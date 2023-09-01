# Deprecated
This app will not see any more development. It has been fully deprecated on March 2nd 2023. A replacement for it is in development [here](https://github.com/simplePCBuilding/MusicPlayerV2).

# MusicPlayer
Yet another Music Player but with one twist. It displays the Playlist beautifully on a second display.

## What's new in Version 2.0
- Webserver that allows you to connect multiple display clients off of it
- Exclusive fullscreen on remote display
- smoothed out progressbar
- Optimised player so it uses less CPU resources


## FEATURES
- Play back music 
- Show the playing song on a special screen that also displays the upcoming songs
- Add a file (songlist.csv) into the folder containing the songs, that has the following layout: Songname, Artist, Dance/Music-Style, Tempo
- Multiple Keyboard-Shortcuts are available: Spacebar = Play/Pause; Escape = go back; S = Switch to showcase-screen; Left-arrow-key = previous song; Up-Arrow-Key = Rewind; Right-arrow-key = Next song; F = Fullscreen
- Planned: App theming
- Secondary display app that can run on a different PC in the same network

## Installation:
*You may download the compiled version from "releases" and follow the instructions in the "releases" section (WINDOWS ONLY)*
- You will need to install the following dependencies: kivy[full], kivymd, pygame. Additionally, you'll need to install xclip using your distro's package manager.
- Kivy may actually also (if you are on ubuntu or derivative) be installed by cloning an apt repository as follows (adapted from kivy documentation), as the version on pip is inferior to the apt version and leads to breakage: 'sudo add-apt-repository ppa:kivy-team/kivy', then running 'sudo apt-get update' and then 'sudo apt-get install python3-kivy'

## Roadmap
This App here will be deprecated with the release of the next version. The new version will be migrated to fully utilize JavaScript (with Node.JS backend in an Electron App) and HTML & CSS for the user interface. You can connect remotely over an IP through a new App with lockdown mode (Framework tbd). 
