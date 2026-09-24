<div id="title" align="center">
    <img src="./assets/logo.png" width="300">
    <h1>MusicPlayer</h1>
</div>

<div id="badges" align="center">
    <img alt="Project License" src="https://img.shields.io/github/license/janishutz/MusicPlayer.svg">
    <img alt="GitHub Repo size" src="https://img.shields.io/github/repo-size/janishutz/MusicPlayer.svg">
    <img alt="GitHub Repo issues" src="https://img.shields.io/github/issues-pr-raw/janishutz/MusicPlayer">
    <img alt="Top Languages" src="https://img.shields.io/github/languages/top/janishutz/MusicPlayer">
    <img alt="GitHub Repo filecount" src="https://img.shields.io/github/directory-file-count/janishutz/MusicPlayer.svg">
    <br>
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/janishutz/MusicPlayer">
    <img alt="GitHub watchers" src="https://img.shields.io/github/watchers/janishutz/MusicPlayer">
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/janishutz/MusicPlayer">
    <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/janishutz/MusicPlayer">
    <br>
    <img alt="GitHub all releases" src="https://img.shields.io/github/downloads/janishutz/MusicPlayer/total?label=Downloads (total)">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/downloads/janishutz/MusicPlayer/latest/total?label=Downloads (latest)">
    <img alt="Latest release" src="https://img.shields.io/github/release/janishutz/MusicPlayer.svg">
    <img alt="App Version" src="https://img.shields.io/github/package-json/v/janishutz/MusicPlayer.svg?label=Development Version">
</div>

# Development Branch
This branch is for the upcoming version 4 of Music Player and is in fairly late stages of development

It switches to a backend written in `Go`, as opposed to `node.js` and should perform a lot better.
Furthermore, the entire frontend has been rewritten from scratch to be more user-friendly.

It uses my manually created [types for MusicKitJS](https://github.com/janishutz/musickit-v3-types), as well as my [OpenID Connect Login SDK for Go](https://github.com/janishutz/oidclogin)
and the [accompanying browser solution](https://github.com/janishutz/oidc-login-sdk/tree/main/browser)


# MusicPlayer
A music player, specifically created for displaying song information on multiple different displays that are connected to the same network, just from the browser. 

I also offer a [hosted solution](https://music.janishutz.com), running the exact same code base as the open source version.
This solution has the benefit of being set up for you already, but is subscription-based and available on my [store](https://store.janishutz.com/product/com.janishutz).

<div id="donate" align="center">
    <a href="https://store.janishutz.com/donate" target="_blank"><img src="https://store-cdn.janishutz.com/static/support-me.jpg" width="150px"></a>
</div>


## Limitations
- You can either use OpenID Connect for sign in or no sign in at all. There are plans to eventually also add local authentication, but that is low priority (since ProxyAuth is a thing).
- In Anti-Tamper mode, only websockets can be used for the clients with Anti-Tamper enabled.
- As an intentional design choice, users on the default share settings, or all users on shares without Anti-Tamper, cannot use websockets and must instead rely on the polling or SSE options.
- The player that created the share must use WebSockets.
- If you want to offer a hosted service for MusicPlayer, currently only my store is supported for ownership check. Implementing your own solution is fairly easy however.


## Features
**NOTICE:** This section has not been updated for the new version of MusicPlayer yet
- Browser based App that runs on all OS (Linux, MacOS, Windows, iOS, Android, iPadOS, ...)
- Fully featured Music Player
- Show all song information over the Internet on any amount of client displays
- Client displays show the playback position and all information from song metadata fetched from the Apple Music API
- Play most common music files
- No setup required when using the hosted version at [music.janishutz.com](https://music.janishutz.com)


## Contributing
Please note that this project has entirely been written without the help of AI and I am fairly opposed to Pretend Intelligence.

If you wish to contribute code that was partially written by AI, you may do so, but be aware that as with most FOSS projects,
you are fully responsible for the code it generates and obvious slop code will be rejected.


## License
MusicPlayer Copyright (C) 2026 janishutz

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see http://www.gnu.org/licenses/.
