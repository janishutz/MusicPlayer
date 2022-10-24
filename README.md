# Development branch!
This is the branch that sees updates until V2.0 is considered stable, at which point it will be merged into master again. Note that there might be program-breaking bugs in this branch, so I do not encourage you to use this branch, unless you want to contribute. I personally upload unfinished code quite often, as such certain features might not work properly yet, as I work from two different PCs and I need to transfer the files between the two. 


## What's happening right now?
I will remove need to restructure the whole app, which will lead to lots of chaos and may introduce some new bugs. Additionally, I will add a secondary app that runs on either your local system or another one. This system will run a webserver that gets the latest updates from the main software through PUSH request (Push instead of Poll principle). This means that the main app will inform the screen, when there were changes. This is to improve resource usage on both systems. The secondary display then is also being entirely controlled by the main app, so you can remotely lock it down and unlock it again. You can also change the settings on the fly and tweak the layout to your liking. This customisation will for the time being only be added to the secondary app. 

The main app's workflow will not change much. The only change will be an option on the showcase screen to connect to a remote display. There you'll need to type that machine's IP address, which will be displayed by the display app. 



# MusicPlayer
Yet another Music Player but with one twist. It displays the Playlist beautifully on a second display.

## FEATURES
- Play back music 
- Show the playing song on a special screen that also displays the upcoming songs
- Add a file (songlist.csv) into the folder containing the songs, that has the following layout: Songname, Artist, Dance/Music-Style, Tempo
- Multiple Keyboard-Shortcuts are available: Spacebar = Play/Pause; Escape = go back; S = Switch to showcase-screen; Left-arrow-key = previous song; Up-Arrow-Key = Rewind; Right-arrow-key = Next song; F = Fullscreen
- CURRENTLY BROKEN: Password protected and fully locked down full-screen mode (togglable from settings.ini file, soon from settings screen)
- Planned: App theming
- Planned: Secondary display app that can run on a different PC in the same network

## Installation:
*You may download the compiled version from "releases" and follow the instructions in the "releases" section (WINDOWS ONLY)*
- You will need to install the following dependencies: kivy[full], kivymd, pygame. Additionally, you'll need to install xclip using your distro's package manager.
- Kivy may actually also (if you are on a distro that uses apt) be installed by cloning an apt repository as follows (adapted from kivy documentation), as pip will most likely fail: 'sudo add-apt-repository ppa:kivy-team/kivy', then running 'sudo apt-get update' and then 'sudo apt-get install python3-kivy'

## Roadmap
**V2.0**
*UPCOMING VERSION IN DEVELOPMENT RIGHT NOW*

- Locked down mode only available when running second app --> Therefore multi-display support / even multi-PC-Support
- Display app can now run on additional PC
- Settings page
- Backend optimisations to reduce CPU loads
- Changing to Pushing instead of polling UI updating
- UI Styling.

POSSIBLE UPDATES:
- Migrate to PyQt5 for Main interface, stay on Kivy for display, as it offers more styling flexibility
