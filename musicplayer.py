import playsound as ps
import os
from kivy.uix.screenmanager import ScreenManager
from kivymd.uix.screen import MDScreen
from kivymd.app import MDApp
from kivy.base import Builder
from kivy.uix.popup import Popup


###########
# Popups
###########


class PathMissingPU(Popup):
    pass


###########
# SCREENS
###########


class Home(MDScreen):
    def change_screen(self):
        if self.ids.filepath.text != "":
            self.manager.current = "Main"
            self.manager.transition.directio = "right"
        else:
            self.openpathmpu()

    def openpathmpu(self):
        self.pmpu = PathMissingPU()
        self.pmpu.open()

class Main(MDScreen):
    pass


class RootScreen(ScreenManager):
    pass


class MusicPlayer(MDApp):
    def build(self):
        self.title = "MusicPlayer"
        self.theme_cls.primary_palette = "Yellow"
        self.theme_cls.accent_palette = "BlueGray"
        # self.icon = "./BiogasControllerAppLogo.png"
        return Builder.load_file("./bin/gui/gui.kv")

if __name__ == "__main__":
    MusicPlayer().run()

# ps.playsound("/mnt/sda3/Music/Videos/Songs/Ancient.mp3")
