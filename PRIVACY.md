# Privacy Policy for Transfert

_Last updated: October 15, 2026_

Transfert is a local-first desktop application. This policy explains, plainly, what happens to your data when you use it.

## We do not collect any data

Transfert does not collect personal data, files, or usage information for itself or send them to a service. There are no analytics, no crash reporting, no telemetry, and no tracking of any kind built into the app. Files are read and written locally to perform the operations you request.

## Your files never leave your device

Every conversion happens entirely on your computer. Files you drop into Transfert are read from disk, converted locally, and written back to a destination you choose — at no point are they uploaded to a server, sent over a network, or shared with any third party. Transfert has no network functionality for file processing; it works fully offline.

## Local conversion engines and temporary files

Audio and video conversion uses **libVLC**, developed by **VideoLAN and its contributors**, through a local Rust integration. LibVLC and its codec plugins run on your device; they are not a VideoLAN cloud service. Transfert does not send your files to VideoLAN or use libVLC to stream files or retrieve online media metadata. Images and text documents are processed by local Rust libraries.

Conversions may create working copies in your operating system's temporary directory. These are removed when the operation finishes or returns an error. An unexpected application or system shutdown may leave temporary files behind. Completed outputs remain in the destination you select until you remove them.

## Optional update checks

When automatic update checks are enabled, Transfert checks the latest public GitHub Release on startup. You can disable automatic checks in Settings or check manually from About. These requests contain no files, account details, analytics, or usage data. GitHub may process standard connection data under its own privacy policy. File conversion does not need these requests.

## No accounts, no sign-up

Transfert does not require or offer any account creation, login, or authentication. There is no user profile of any kind, on your device or anywhere else.

## App permissions

Transfert asks for two things from your operating system:

- **File/folder access** — only when you explicitly pick files to convert or a destination to save them to, via the native file picker.
- **Permission to open links in your default browser** — only when you click an external link inside the app (for example, the update download, source code, or license links in Settings → About).

Neither permission is used to collect or transmit data — they exist purely to let you choose files and open links.

## Third parties

The update check is made to GitHub's public Releases API. The app also links out to a few external websites (its own source repository, its author's site, and the open-source projects it's built on) — visiting those is subject to that site's own privacy policy, not this one.

Using third-party libraries locally does not share your files with their authors. Attribution and license information, including VideoLAN/libVLC, is available in Settings → About and in [Third-party notices](THIRD_PARTY_NOTICES.md). Transfert is an independent project and is not affiliated with or endorsed by VideoLAN.

## Children's privacy

Transfert is not directed at children and does not knowingly collect information from anyone, regardless of age — because it does not collect information at all.

## Changes to this policy

If this policy ever changes (for example, if the app makes a new kind of network request), this page will be updated and the "Last updated" date above will reflect it.

## Contact

Questions about this policy: <https://viincnt.com>
