import multiprocessing
import os
from kivy.core.window import Window, Config
from kivy.uix.screenmanager import ScreenManager
from kivymd.uix.screen import MDScreen
from kivymd.app import MDApp
from kivy.base import Builder
from kivy.uix.popup import Popup
from kivy.clock import Clock
import bin.csv_parsers
import bin.filepathanalysis
import bin.player


pl = bin.player.Player()
pa = bin.filepathanalysis.PathAnalysis()
cvr = bin.csv_parsers.CsvRead()
cvw = bin.csv_parsers.CsvWrite()


###########
# Popups
###########


class PathMissingPU(Popup):
    pass


class PathWrongPU(Popup):
    pass


class invalidpathPU(Popup):
    pass


###########
# SCREENS
###########


class Home(MDScreen):
    def change_screen(self):
        if self.ids.filepath.text != "":
            self.analyse_dir()
        else:
            self.openpathmpu()

    def analyse_dir(self):
        try:
            self.__fcontent = os.listdir(self.ids.filepath.text)
            self.__good_files = 0
            for self.item in self.__fcontent:
                self.__filextension = self.item[(len(self.item) - 4):]
                if self.__filextension == ".mp3" or self.__filextension == ".wav":
                    self.__good_files += 1
                else:
                    pass
            # self.__good_files = 1
            if self.__good_files > 0:
                cvw.write_str("./data/temp.csv", [self.ids.filepath.text])
                self.manager.current = "Main"
                self.manager.transition.direction = "left"
            else:
                self.openpathfpu()
        except:
            self.ivpathpu()

    def openpathmpu(self):
        self.pmpu = PathMissingPU()
        self.pmpu.open()

    def openpathfpu(self):
        self.wppu = PathWrongPU()
        self.wppu.open()

    def ivpathpu(self):
        self.ivppu = invalidpathPU()
        self.ivppu.open()


class Main(MDScreen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.instructions = multiprocessing.Value('i', 0)
        self.others = multiprocessing.Value('i', 0)
        self.keyboard = Window.request_keyboard(None, self)
        self.keyboard.bind(on_key_down=self.key_pressed)
        self.quit_requests = 0

    def key_pressed(self, keyboard, keycode, text, modifiers):
        # print(keycode[1])
        self.key = keycode[1]
        if self.key == "spacebar":
            self.playmusic()
        elif self.key == "right":
            self.nextsong()
        elif self.key == "left":
            self.rewindsong()
        else:
            pass

    def initialize(self):
        try:
            if self.mplayer.is_alive() == True:
                pass
            else:
                self.mplayer = multiprocessing.Process(name="player", target=pl.musicmanager, args=(self.instructions, self.others,))
                self.mplayer.start()
        except:
            self.mplayer = multiprocessing.Process(name="player", target=pl.musicmanager, args=(self.instructions, self.others,))
            self.mplayer.start()

    def playmusic(self):
        self.others.value = 3
        if self.instructions.value == 0:
            self.instructions.value = 1
            self.ids.pp_button.text = "Pause"
        else:
            self.instructions.value = 0
            self.ids.pp_button.text = "Play"

    def nextsong(self):
        self.others.value = 1

    def rewindsong(self):
        self.others.value = 2

    def go_back(self):
        try:
            self.mplayer.kill()
        except:
            pass
        self.manager.current = "Home"
        self.manager.transition.direction = "right"

class ShowcaseS(MDScreen):
    def screen_updater_start(self):
        Clock.schedule_interval(self.screen_updating, 2)


    def screen_updating(self, waste):
        self.__info = cvr.importing("./data/songtemp.csv")
        self.__currents_imp = self.__info.pop(0)
        self.__currents = int(self.__currents_imp.pop(0))
        self.__upcoming = self.__info.pop(0)
        self.__upcoming.sort()
        self.__current = self.__upcoming.pop(self.__currents)
        self.ids.current_song.text = self.__current[:(len(self.__current) - 4)]
        if len(self.__upcoming) <= self.__currents:
            self.ids.upcoming_songs.text = "No more songs in Queue"
        else:
            self.__upcoming2 = str(self.__upcoming.pop(self.__currents))
            self.__upcoming_output = self.__upcoming2[:(len(self.__upcoming2) - 4)]
            self.__length_output = 0
            for i in range(len(self.__upcoming) - self.__currents):
                if self.__length_output > 5:
                    pass
                else:
                    self.__upcoming2 = str(self.__upcoming.pop(self.__currents))
                    self.__upcoming_output += f"\n{self.__upcoming2[:(len(self.__upcoming2) - 4)]}"
                    self.__length_output += 1
            self.ids.upcoming_songs.text = self.__upcoming_output

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
    Config.set('graphics', 'width', '800')
    Config.set('graphics', 'height', '600')
    Config.set('graphics', 'resizable', True)
    Config.set('kivy', 'exit_on_escape', '0')
    Config.set('input', 'mouse', 'mouse,multitouch_on_demand')
    Config.set('graphics', 'window_state', 'normal')
    Config.set('graphics', 'fullscreen', False)
    Config.write()
    MusicPlayer().run()
