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
This branch is for the upcoming version 4 of MusicPlayer and is in late stages of development

It switches to a backend written in `Go`, as opposed to `node.js` and should perform a lot better.
Furthermore, the entire frontend has been rewritten from scratch to be *much* more user-friendly.


# MusicPlayer
A free and open source music player integrating multiple music sources (currently local and Apple Music) into a single playlist,
with the option of sharing current playback status with other people on the internet via a link.

It uses my manually created [types for MusicKitJS](https://github.com/janishutz/musickit-v3-types),
as well as my [OpenID Connect Login SDK for Go](https://github.com/janishutz/oidclogin)
and the [accompanying browser solution](https://github.com/janishutz/oidc-login-sdk/tree/main/browser)


## Getting Started
There are two main ways to use MusicPlayer:
- Self Host it, for instructions, see [the Wiki](https://github.com/janishutz/MusicPlayer/wiki)
- [Hosted version](https://music.janishutz.com). This has the benefit of not requiring an Apple Developer Subscription and any setup. It is however a subscription service.
See the [store page](https://store.janishutz.com/product/com.janishutz.MusicPlayer)


## Features
- Browser based, meaning it can run on all devices. Note on mobile devices: The player interface is not yet mobile optimized.
- Combine songs from multiple sources into a single playlist
- Show song information and playback status over the Internet to any number of other devices, if you wish
- Tampering notifications for these devices on a specific page
- Use the Apple Music API to get song details for local songs. This process is automated, but you can still manually change the details if you so choose.
- Performant backend written in Go, easy installation with a Docker Compose file
- No setup required when using the hosted version at [music.janishutz.com](https://music.janishutz.com)


<div id="donate" align="center">
    <a href="https://store.janishutz.com/donate" target="_blank"><img src="https://store-cdn.janishutz.com/static/support-me.jpg" width="150px"></a>
</div>


## Contributing
Please note that this project has entirely been written without the help of AI and I am fairly opposed to Pretend Intelligence.

If you wish to contribute code that was partially written by AI, you may do so, but be aware that as with most FOSS projects,
you are fully responsible for the code it generates and obvious slop code will be rejected.


## License
MusicPlayer Copyright (C) 2026 janishutz

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see http://www.gnu.org/licenses/.
