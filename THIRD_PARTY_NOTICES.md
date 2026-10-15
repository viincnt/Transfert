# Third-party notices

Transfert is an independent project distributed under the [GNU GPL v3.0](LICENSE).
Third-party components retain their own copyrights and license terms.

## VideoLAN, libVLC and codecs

The audio/video engine uses **libVLC**, developed by **VideoLAN and the VLC
contributors**. Transfert supplies the Rust integration and user interface; it
does not claim authorship of libVLC or the bundled codecs.

- [VideoLAN](https://www.videolan.org/)
- [libVLC project](https://www.videolan.org/vlc/libvlc.html)
- [VLC source code](https://code.videolan.org/videolan/vlc)
- [Source releases](https://download.videolan.org/pub/videolan/vlc/)
- [VideoLAN legal and redistribution information](https://www.videolan.org/legal.html)

LibVLC is licensed under **LGPL-2.1-or-later**. The VLC distribution includes
plugins and dependencies under additional licenses, including GPL licenses.
The LGPL license of libVLC does not describe every plugin in the runtime.
The packaging script copies upstream copyright/license files with the runtime.
Redistribution must also satisfy the corresponding-source requirements of the
licenses applicable to the exact binaries and dependencies being distributed;
this attribution page is not a substitute for those requirements.

Codec plugins may include FFmpeg, x264, libvpx, Xiph.Org codecs and other
third-party libraries. Availability depends on the runtime build. Loading libVLC
from Rust does not make these libraries pure Rust, nor imply that their code or
licenses belong to Transfert.

VideoLAN, VLC and VLC media player are trademarks of the VideoLAN nonprofit
organization. Transfert is not affiliated with or endorsed by VideoLAN.

## Rust conversion libraries

| Project                                                            | Use                                | License          |
| ------------------------------------------------------------------ | ---------------------------------- | ---------------- |
| [image](https://github.com/image-rs/image)                         | Raster image decoding and encoding | MIT / Apache-2.0 |
| [resvg](https://github.com/linebender/resvg)                       | SVG rasterization                  | MPL-2.0          |
| [pulldown-cmark](https://github.com/pulldown-cmark/pulldown-cmark) | Markdown parsing                   | MIT              |
| [html2text](https://crates.io/crates/html2text)                    | HTML to plain text                 | MIT              |
| [html2md](https://crates.io/crates/html2md)                        | HTML to Markdown                   | MIT              |
| [libloading](https://github.com/nagisa/rust_libloading)            | Native library loading             | ISC              |

Additional application dependencies and contributors are credited in Settings →
About. Dependency versions are recorded in `Cargo.lock` and `pnpm-lock.yaml`.

The native test suite also uses [Symphonia](https://github.com/pdeljanov/Symphonia)
(MPL-2.0) as an independent reference decoder. This is a development dependency,
not the runtime media-conversion engine.
