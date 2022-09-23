# MusicPlayer
Yet another Music Player but with one twist. It displays the Playlist beautifully on a second display.

## FEATURES
- Play back music 
- Show the playing song on a special screen that also displays the upcoming songs
- Add a file (songlist.csv) into the folder containing the songs, that has the following layout: Songname, Artist, Dance/Music-Style, Tempo
- Multiple Keyboard-Shortcuts are available: Spacebar = Play/Pause; Escape = go back; S = Switch to showcase-screen; Left-arrow-key = previous song; Up-Arrow-Key = Rewind; Right-arrow-key = Next song; F = Fullscreen
- Password protected and fully locked down full-screen mode (togglable from settings.ini file, soon from settings screen)
- Planned: App theming

## Installation:
*You may download the compiled version from "releases" and follow the instructions in the "releases" section*
- You will need to install the following dependencies: kivy[full], kivymd, pygame.
- Kivy may actually also (if you are on a distro that uses apt) be installed by cloning an apt repository as follows (adapted from kivy documentation), as pip will most likely fail: 'sudo add-apt-repository ppa:kivy-team/kivy', then running 'sudo apt-get update' and then 'sudo apt-get install python3-kivy'
