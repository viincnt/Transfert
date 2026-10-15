//! LibVLC 3's C ABI, loaded at runtime. All native objects stay on their creating
//! blocking thread; the library outlives them. No VLC executable is launched.
use std::{
    ffi::{c_char, c_int, c_void, CStr, CString},
    fs,
    path::{Path, PathBuf},
    thread,
    time::{Duration, Instant},
};

use libloading::Library;

type Handle = *mut c_void;
type Release = unsafe extern "C" fn(Handle);

struct Object {
    ptr: Handle,
    release: Release,
}

impl Object {
    fn new(ptr: Handle, release: Release) -> Result<Self, String> {
        if ptr.is_null() {
            Err("LibVLC could not allocate a media object".into())
        } else {
            Ok(Self { ptr, release })
        }
    }
}

impl Drop for Object {
    fn drop(&mut self) {
        // SAFETY: owned reference, released exactly once before the library.
        unsafe { (self.release)(self.ptr) }
    }
}

struct Player {
    object: Object,
    stop: Release,
}

impl Drop for Player {
    fn drop(&mut self) {
        // Stop joins the conversion and flushes output before releasing it.
        unsafe { (self.stop)(self.object.ptr) }
    }
}

struct Vlc {
    instance: Object,
    library: Library,
}

fn library_name() -> &'static str {
    if cfg!(target_os = "windows") {
        "libvlc.dll"
    } else if cfg!(target_os = "macos") {
        "libvlc.dylib"
    } else {
        "libvlc.so.5"
    }
}

fn library_path() -> PathBuf {
    if let Some(dir) = std::env::var_os("TRANSFERT_VLC_DIR") {
        return PathBuf::from(dir).join(library_name());
    }
    if let Ok(exe) = std::env::current_exe() {
        if let Some(parent) = exe.parent() {
            for dir in [parent.join("vlc"), parent.join("../Resources/vlc/lib")] {
                let path = dir.join(library_name());
                if path.exists() {
                    return path;
                }
            }
        }
    }
    #[cfg(debug_assertions)]
    for suffix in ["resources/vlc", "resources/vlc/lib"] {
        let path = Path::new(env!("CARGO_MANIFEST_DIR"))
            .join(suffix)
            .join(library_name());
        if path.exists() {
            return path;
        }
    }
    #[cfg(target_os = "windows")]
    if let Some(root) = std::env::var_os("ProgramFiles") {
        return PathBuf::from(root).join("VideoLAN/VLC/libvlc.dll");
    }
    #[cfg(target_os = "macos")]
    return PathBuf::from("/Applications/VLC.app/Contents/MacOS/lib/libvlc.dylib");
    #[allow(unreachable_code)]
    PathBuf::from(library_name())
}

impl Vlc {
    fn new() -> Result<Self, String> {
        let path = library_path();
        // SAFETY: load only the configured/bundled/system VLC library. Symbols
        // below use the documented libVLC 3 ABI, checked before creating objects.
        let library: Library = unsafe {
            #[cfg(target_os = "windows")]
            {
                libloading::os::windows::Library::load_with_flags(&path, 0x00000008).map(Into::into)
            }
            #[cfg(not(target_os = "windows"))]
            {
                Library::new(&path)
            }
        }
        .map_err(|e| {
            format!(
                "LibVLC 3 runtime unavailable at {}: {e}. Install VLC 3 or set TRANSFERT_VLC_DIR.",
                path.display()
            )
        })?;
        unsafe {
            let version = library
                .get::<unsafe extern "C" fn() -> *const c_char>(b"libvlc_get_version\0")
                .map_err(err)?;
            if !CStr::from_ptr(version()).to_bytes().starts_with(b"3.") {
                return Err("This converter requires LibVLC 3.x".into());
            }
            let new = library
                .get::<unsafe extern "C" fn(c_int, *const *const c_char) -> Handle>(b"libvlc_new\0")
                .map_err(err)?;
            let release = *library.get::<Release>(b"libvlc_release\0").map_err(err)?;
            let args = [
                "--ignore-config",
                "--intf=dummy",
                "--no-video-title-show",
                "--no-media-library",
                "--no-stats",
                "--no-snapshot-preview",
                "--aout=dummy",
                "--vout=dummy",
                "--avcodec-hw=none",
                "--no-sub-autodetect-file",
            ];
            // Avoid hardware-specific encoding/decoding paths for portability.
            let args: Vec<CString> = args.iter().map(|arg| CString::new(*arg).unwrap()).collect();
            let pointers: Vec<_> = args.iter().map(|arg| arg.as_ptr()).collect();
            let instance = Object::new(new(pointers.len() as c_int, pointers.as_ptr()), release)?;
            Ok(Self { instance, library })
        }
    }

    fn media(&self, path: &Path) -> Result<Object, String> {
        let path = CString::new(path.to_str().ok_or("Media path must be Unicode")?).map_err(err)?;
        unsafe {
            let new = self
                .library
                .get::<unsafe extern "C" fn(Handle, *const c_char) -> Handle>(
                    b"libvlc_media_new_path\0",
                )
                .map_err(err)?;
            let release = *self
                .library
                .get::<Release>(b"libvlc_media_release\0")
                .map_err(err)?;
            Object::new(new(self.instance.ptr, path.as_ptr()), release)
        }
    }

    fn inspect(&self, path: &Path) -> Result<(bool, bool, i64), String> {
        let media = self.media(path)?;
        unsafe {
            let parse = self
                .library
                .get::<unsafe extern "C" fn(Handle, c_int, c_int) -> c_int>(
                    b"libvlc_media_parse_with_options\0",
                )
                .map_err(err)?;
            let status = self
                .library
                .get::<unsafe extern "C" fn(Handle) -> c_int>(b"libvlc_media_get_parsed_status\0")
                .map_err(err)?;
            if parse(media.ptr, 0, 10_000) != 0 {
                return Err("Cannot inspect media".into());
            }
            let start = Instant::now();
            loop {
                match status(media.ptr) {
                    4 => break,
                    1..=3 => {
                        return Err(
                            "Media is unsupported, corrupt, or timed out during inspection".into(),
                        )
                    }
                    _ if start.elapsed() > Duration::from_secs(12) => {
                        return Err("Media inspection timed out".into())
                    }
                    _ => thread::sleep(Duration::from_millis(20)),
                }
            }
            // Only access the stable prefix of libvlc_media_track_t.
            #[repr(C)]
            struct Track {
                codec: u32,
                original: u32,
                id: c_int,
                kind: c_int,
            }
            let get = self
                .library
                .get::<unsafe extern "C" fn(Handle, *mut *mut *mut Track) -> u32>(
                    b"libvlc_media_tracks_get\0",
                )
                .map_err(err)?;
            let release = self
                .library
                .get::<unsafe extern "C" fn(*mut *mut Track, u32)>(b"libvlc_media_tracks_release\0")
                .map_err(err)?;
            let duration = self
                .library
                .get::<unsafe extern "C" fn(Handle) -> i64>(b"libvlc_media_get_duration\0")
                .map_err(err)?;
            let mut tracks = std::ptr::null_mut();
            let count = get(media.ptr, &mut tracks);
            let (mut audio, mut video) = (false, false);
            if !tracks.is_null() {
                for i in 0..count as usize {
                    let track = *tracks.add(i);
                    if !track.is_null() {
                        audio |= (*track).kind == 0;
                        video |= (*track).kind == 1;
                    }
                }
                release(tracks, count);
            }
            Ok((audio, video, duration(media.ptr)))
        }
    }

    fn transcode(&self, input: &Path, output: &Path, profile: Profile) -> Result<(), String> {
        let media = self.media(input)?;
        let sout = CString::new(profile.sout(output)?).map_err(err)?;
        unsafe {
            let add = self
                .library
                .get::<unsafe extern "C" fn(Handle, *const c_char)>(b"libvlc_media_add_option\0")
                .map_err(err)?;
            add(media.ptr, sout.as_ptr());
            for option in [
                ":no-sout-keep",
                ":sout-all",
                ":no-sout-display",
                ":avcodec-hw=none",
                ":no-spu",
            ] {
                add(media.ptr, CString::new(option).unwrap().as_ptr());
            }
            let new = self
                .library
                .get::<unsafe extern "C" fn(Handle) -> Handle>(
                    b"libvlc_media_player_new_from_media\0",
                )
                .map_err(err)?;
            let release = *self
                .library
                .get::<Release>(b"libvlc_media_player_release\0")
                .map_err(err)?;
            let stop = *self
                .library
                .get::<Release>(b"libvlc_media_player_stop\0")
                .map_err(err)?;
            let play = self
                .library
                .get::<unsafe extern "C" fn(Handle) -> c_int>(b"libvlc_media_player_play\0")
                .map_err(err)?;
            let state = self
                .library
                .get::<unsafe extern "C" fn(Handle) -> c_int>(b"libvlc_media_player_get_state\0")
                .map_err(err)?;
            let player = Player {
                object: Object::new(new(media.ptr), release)?,
                stop,
            };
            if play(player.object.ptr) != 0 {
                return Err("LibVLC could not start conversion".into());
            }
            let start = Instant::now();
            loop {
                match state(player.object.ptr) {
                    6 => return Ok(()),
                    7 => return Err("LibVLC conversion failed; this runtime may lack the required codec or muxer".into()),
                    _ if start.elapsed() > Duration::from_secs(7200) => return Err("Conversion exceeded the two-hour time limit".into()),
                    _ => thread::sleep(Duration::from_millis(30)),
                }
            }
        }
    }
}

fn err(error: impl std::fmt::Display) -> String {
    error.to_string()
}

#[derive(Clone, Copy)]
struct Profile {
    codecs: &'static str,
    mux: &'static str,
}

fn profile(kind: &str, target: &str) -> Result<Profile, String> {
    let (codecs, mux) = match (kind, target) {
        ("audio", "wav") => ("vcodec=none,acodec=s16l,channels=2,samplerate=44100", "wav"),
        ("audio", "flac") => ("vcodec=none,acodec=flac", "raw"),
        ("audio", "mp3") => ("vcodec=none,acodec=mp3,ab=192,channels=2", "raw"),
        ("audio", "ogg") => ("vcodec=none,acodec=vorb,ab=192,channels=2", "ogg"),
        ("audio", "opus") => (
            "vcodec=none,acodec=opus,ab=128,channels=2,samplerate=48000",
            "ogg",
        ),
        ("audio", "m4a") => ("vcodec=none,acodec=mp4a,ab=192,channels=2", "mp4"),
        ("video", "mp4" | "mov") => ("vcodec=h264,vb=2500,acodec=mp4a,ab=192,channels=2", "mp4"),
        ("video", "webm") => ("vcodec=VP80,vb=2500,acodec=vorb,ab=192,channels=2", "webm"),
        ("video", "ogv") => ("vcodec=theo,vb=2500,acodec=vorb,ab=192,channels=2", "ogg"),
        ("video", "ts") => ("vcodec=mp2v,vb=4000,acodec=mpga,ab=192,channels=2", "ts"),
        ("video", "avi") => ("vcodec=mp4v,vb=2500,acodec=mp3,ab=192,channels=2", "avi"),
        _ => return Err(format!("Unsupported {kind} output: {target}")),
    };
    Ok(Profile { codecs, mux })
}

impl Profile {
    fn sout(self, output: &Path) -> Result<String, String> {
        let path = output.to_str().ok_or("Output path must be Unicode")?;
        // VLC's sout parser unescapes quoted strings (not shell quoting).
        let path = path.replace('\\', "\\\\").replace('\'', "\\'");
        Ok(format!(
            ":sout=#transcode{{{}}}:standard{{access=file,mux={},dst='{path}'}}",
            self.codecs, self.mux
        ))
    }
}

pub fn runtime_status() -> Result<(), String> {
    Vlc::new().map(|_| ())
}

pub fn convert(bytes: &[u8], source: &str, target: &str, kind: &str) -> Result<Vec<u8>, String> {
    let profile = profile(kind, target)?;
    if source.is_empty() || !source.bytes().all(|b| b.is_ascii_alphanumeric()) {
        return Err("Invalid source extension".into());
    }
    let temp = tempfile::Builder::new()
        .prefix("transfert-media-")
        .tempdir()
        .map_err(err)?;
    // Declare the runtime after the directory so native handles are always
    // released before temporary files are removed, including on error paths.
    let vlc = Vlc::new()?;
    let input = temp.path().join(format!("input.{source}"));
    let output = temp.path().join(format!("output.{target}"));
    fs::write(&input, bytes).map_err(err)?;
    let (audio, video, _) = vlc.inspect(&input)?;
    if (kind == "audio" && !audio) || (kind == "video" && !video) {
        return Err(format!("Source does not contain an {kind} track"));
    }
    vlc.transcode(&input, &output, profile)?;
    drop(vlc);
    let verifier = Vlc::new()?;
    let (out_audio, out_video, _) = verifier.inspect(&output)?;
    if (kind == "audio" && (!out_audio || out_video))
        || (kind == "video" && (!out_video || (audio && !out_audio)))
    {
        return Err("Converted media failed verification (missing tracks)".into());
    }
    let result = fs::read(output).map_err(err)?;
    if result.is_empty() {
        return Err("LibVLC produced an empty file".into());
    }
    Ok(result)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn decoded_samples(bytes: &[u8], extension: &str) -> u64 {
        use symphonia::core::{
            codecs::DecoderOptions, formats::FormatOptions, io::MediaSourceStream,
            meta::MetadataOptions, probe::Hint,
        };
        let source = MediaSourceStream::new(
            Box::new(std::io::Cursor::new(bytes.to_vec())),
            Default::default(),
        );
        let mut hint = Hint::new();
        hint.with_extension(extension);
        let mut format = symphonia::default::get_probe()
            .format(
                &hint,
                source,
                &FormatOptions::default(),
                &MetadataOptions::default(),
            )
            .unwrap()
            .format;
        let track = format.default_track().unwrap();
        let id = track.id;
        let mut decoder = symphonia::default::get_codecs()
            .make(&track.codec_params, &DecoderOptions::default())
            .unwrap();
        let mut samples = 0;
        loop {
            match format.next_packet() {
                Ok(packet) if packet.track_id() == id => {
                    samples += decoder.decode(&packet).unwrap().frames() as u64
                }
                Ok(_) => {}
                Err(symphonia::core::errors::Error::IoError(e))
                    if e.kind() == std::io::ErrorKind::UnexpectedEof =>
                {
                    break
                }
                Err(error) => panic!("reference decoder: {error}"),
            }
        }
        samples
    }

    #[test]
    #[ignore = "requires LibVLC runtime"]
    fn libvlc_pcm_sample_regression() {
        let temp = tempfile::tempdir().unwrap();
        let vlc = Vlc::new().unwrap();
        let source = temp.path().join("input.wav");
        fs::write(&source, wav_fixture()).unwrap();
        for target in ["wav", "flac"] {
            let output = temp.path().join(format!("output.{target}"));
            vlc.transcode(&source, &output, profile("audio", target).unwrap())
                .unwrap();
            let samples = decoded_samples(&fs::read(output).unwrap(), target);
            assert_eq!(
                samples, 44100,
                "{target}: lossless conversion must preserve every source sample"
            );
        }
    }

    #[test]
    fn rejects_unsupported_muxers_and_option_injection() {
        assert!(profile("video", "mkv").is_err());
        assert!(profile("audio", "wav}:display").is_err());
        let option = profile("audio", "wav")
            .unwrap()
            .sout(Path::new("a'b.wav"))
            .unwrap();
        assert!(option.contains("dst='a\\'b.wav'"));
    }

    fn wav_fixture() -> Vec<u8> {
        let data_size = 44100u32 * 2;
        let mut bytes = Vec::new();
        bytes.extend(b"RIFF");
        bytes.extend((36 + data_size).to_le_bytes());
        bytes.extend(b"WAVEfmt ");
        bytes.extend(16u32.to_le_bytes());
        bytes.extend(1u16.to_le_bytes());
        bytes.extend(1u16.to_le_bytes());
        bytes.extend(44100u32.to_le_bytes());
        bytes.extend(88200u32.to_le_bytes());
        bytes.extend(2u16.to_le_bytes());
        bytes.extend(16u16.to_le_bytes());
        bytes.extend(b"data");
        bytes.extend(data_size.to_le_bytes());
        for i in 0..44100 {
            let sample =
                ((i as f32 * 440.0 * std::f32::consts::TAU / 44100.0).sin() * 10000.0) as i16;
            bytes.extend(sample.to_le_bytes());
        }
        bytes
    }

    #[test]
    #[ignore = "requires LibVLC 3 and codec plugins; run with --ignored"]
    fn libvlc_audio_round_trips_and_rejects_corruption() {
        let input = wav_fixture();
        for target in ["flac", "mp3", "ogg", "opus", "m4a"] {
            let converted =
                convert(&input, "wav", target, "audio").unwrap_or_else(|e| panic!("{target}: {e}"));
            let decoded = convert(&converted, target, "wav", "audio")
                .unwrap_or_else(|e| panic!("{target} -> wav: {e}"));
            assert!(decoded.starts_with(b"RIFF"));
            assert!(
                decoded.len() > 160000,
                "{target}: missing audio samples, {} bytes",
                decoded.len()
            );
        }
        assert!(convert(b"not media", "wav", "mp3", "audio").is_err());
        assert!(convert(&input, "wav", "mp4", "video").is_err());
    }

    #[test]
    #[ignore = "requires LibVLC 3 and codec plugins; run with --ignored"]
    fn libvlc_video_outputs_are_readable() {
        let mut video = b"YUV4MPEG2 W32 H32 F25:1 Ip A1:1 C420jpeg\n".to_vec();
        for frame in 0..25 {
            video.extend(b"FRAME\n");
            video.extend(vec![64 + frame; 32 * 32]);
            video.extend(vec![128; 32 * 32 / 2]);
        }
        for target in ["mp4", "mov", "webm", "ogv", "ts", "avi"] {
            let output =
                convert(&video, "y4m", target, "video").unwrap_or_else(|e| panic!("{target}: {e}"));
            assert!(output.len() > 100, "{target}: empty container");
            let round_trip = convert(&output, target, "mp4", "video")
                .unwrap_or_else(|e| panic!("{target} decode: {e}"));
            assert!(round_trip.len() > 100);
        }
    }
}
