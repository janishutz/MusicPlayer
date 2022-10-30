import os
import configparser

config = configparser.ConfigParser()
config.read('./data/settings.ini')
co = config['Dev Settings']['verbose']

if co == "True":
    pass
else:
    os.environ["KIVY_NO_CONSOLELOG"] = "1"

import signal
import time
import multiprocessing
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
import math
import bin.autocomplete
import bin.servercoms


returnOk = False
pl = bin.player.Player()
pa = bin.filepathanalysis.PathAnalysis()
cvr = bin.csv_parsers.CsvRead()
cvw = bin.csv_parsers.CsvWrite()
ac = bin.autocomplete.AutoComplete()
svc = bin.servercoms.ServerComs()
version_app = f"Music Player {config['Info']['version']}{config['Info']['subVersion']}"

global address
address = ""


###########
# Popups
###########

class ConnectPU(Popup):
    def tryconnect(self):
        self.url = self.ids.url.text
        self.containsPort = False
        for self.letter in self.url:
            if self.letter == ":":
                self.containsPort = True
            else:
                pass
        self.connectionurl = ""
        if self.url[:8] != "https://" and  self.url[:7] != "http://" and self.url[len(self.url) - 1:] == "/" and not self.containsPort and len(self.url) > 2:
            self.connectionurl = f"http://{self.url[:len(self.url) - 1]}:8000"
            print(svc.connect(self.connectionurl))
            self.dismiss()
        elif self.url[:8] != "https://" and self.url[:7] != "http://" and self.url[len(self.url) - 1:] != "/" and not self.containsPort and len(self.url) > 2:
            self.connectionurl = f"http://{self.url}:8000"
            print(svc.connect(self.connectionurl))
            self.dismiss()
        else:
            self.ids.output = "Invalid address, please enter just the IP address!"
        global address
        address = self.connectionurl


class QuitPU(Popup):
    pass


class PathMissingPU(Popup):
    pass


class PathWrongPU(Popup):
    pass


class invalidpathPU(Popup):
    pass


class LeavePU(Popup):
    def check_pwd(self):
        if self.ids.passw.text == config["Security"]["pwd"]:
            returnOk = True
            self.dismiss()
        else:
            time.sleep(2)
            self.ids.output.text = "Password wrong, please try again!"

    def returnToFullscreen(self):
        Window.fullscreen = True


###########
# SCREENS
###########


class Home(MDScreen):
    def initapp(self):
        return version_app

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

    def autocomplete(self):
        self.text = self.ids.filepath.text
        self.input = self.text[len(self.text) - 1:]
        if self.input == "\t":
            self.__ac = ac.autocomplete(self.text)
            self.ids.cmd_output.text = self.__ac.pop(0)
            self.output = self.__ac.pop(0)
            Clock.schedule_once(self.reloadf, 0.1)
        else:
            pass

    def reloadf(self, dt):
        self.ids.filepath.text = self.output

    def quitapp(self):
        QuitPU().open()


class Main(MDScreen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.instructions = multiprocessing.Value('i', 0)
        self.others = multiprocessing.Value('i', 0)
        self.backfeed = multiprocessing.Value('f', 0)
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
        elif self.key == "up":
            self.rewindsong()
        elif self.key == "left":
            self.previoussong()
        elif self.key == "escape":
            self.back_here()
        elif self.key == "s":
            if self.manager.current == "Main":
                self.manager.current = "Showcase"
                self.manager.transition.direction = "left"
            else:
                pass
        elif self.key == "f" and self.manager.current == "Showcase":
            if Window.fullscreen == 'auto':
                Window.fullscreen = False
            else:
                Window.fullscreen = 'auto'
                Window.maximize()
        else:
            pass

    def initialize(self):
        try:
            self.refreshspeed = int(config["Performance"]["showcaseRefreshRate"])
        except ValueError:
            self.refreshspeed = 1

        try:
            Clock.schedule_interval(self.screen_updating, self.refreshspeed)
        except:
            print("Failed to schedule screen updating")

        try:
            if self.mplayer.is_alive() is True:
                pass
            else:
                cvw.chg_str("./data/config.csv", 0, 0, "0")
                self.instructions = multiprocessing.Value('i', 0)
                self.others = multiprocessing.Value('i', 0)
                self.backfeed = multiprocessing.Value('f', 0)
                self.mplayer = multiprocessing.Process(name="player", target=pl.musicmanager, args=(self.instructions, self.others, self.backfeed,))
                self.mplayer.start()
        except AttributeError:
            cvw.chg_str("./data/config.csv", 0, 0, "0")
            self.instructions = multiprocessing.Value('i', 0)
            self.others = multiprocessing.Value('i', 0)
            self.backfeed = multiprocessing.Value('f', 0)
            self.mplayer = multiprocessing.Process(name="player", target=pl.musicmanager, args=(self.instructions, self.others, self.backfeed,))
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

    def previoussong(self):
        self.others.value = 4

    def go_back(self):
        try:
            self.mplayer.kill()
        except:
            pass
        self.ids.pp_button.text = "Play"
        self.manager.current = "Home"
        self.manager.transition.direction = "right"

    def screen_updating(self, waste):
        self.__windowsize = Window._get_size()
        self.__windowsize_x = self.__windowsize[0]
        self.__windowsize_y = self.__windowsize[1]
        self.__text_size = round(math.sqrt(((self.__windowsize_x + self.__windowsize_y) / 2)), 0)
        self.manager.get_screen("Showcase").ids.current_song.font_size = self.__text_size + 5
        self.manager.get_screen("Showcase").ids.upcoming_songs.font_size = self.__text_size - 5
        self.manager.get_screen("Showcase").ids.titleinfo.font_size = self.__text_size * 2.2
        self.manager.get_screen("Showcase").ids.upcoming_ind.font_size = self.__text_size + 10
        self.__config = cvr.importing("./data/config.csv").pop(0)
        self.__config.pop(1)
        self.__info = cvr.importing("./data/songtemp.csv")
        self.__currents_imp = self.__info.pop(0)
        self.__currents = int(self.__currents_imp.pop(0))
        self.__upcoming = self.__info.pop(0)
        self.__songlinfo = self.__info.pop(0)
        self.__songpos = self.backfeed.value
        self.__songdisplay = int(self.__songpos / float(self.__songlinfo.pop(0)) * 100)
        self.manager.get_screen("Showcase").ids.progressbars.value = self.__songdisplay
        self.__current = self.__upcoming.pop(self.__currents)
        if self.__config == ["1"]:
            self.__current_output = self.__current[:(len(self.__current) - 4)]
        else:
            self.__current_output = self.__current
        self.ids.current_song.text = self.__current_output
        self.manager.get_screen("Showcase").ids.current_song.text = self.__current_output
        if len(self.__upcoming) <= self.__currents:
            self.__upcoming_output = "No more songs in Queue"
        else:
            self.__upcoming2 = str(self.__upcoming.pop(self.__currents))
            if self.__config == ["1"]:
                self.__upcoming_output = self.__upcoming2[:(len(self.__upcoming2) - 4)]
            else:
                self.__upcoming_output = self.__upcoming2

            self.__length_output = 0
            for i in range(len(self.__upcoming) - self.__currents):
                if self.__length_output > 5:
                    pass
                else:
                    self.__upcoming2 = str(self.__upcoming.pop(self.__currents))
                    if self.__config == ["1"]:
                        self.__upcoming_output += f"\n{self.__upcoming2[:(len(self.__upcoming2) - 4)]}"
                    else:
                        self.__upcoming_output += f"\n{self.__upcoming2}"
                    self.__length_output += 1
        self.manager.get_screen("Showcase").ids.upcoming_songs.text = self.__upcoming_output

    def back_here(self):
        if self.manager.current == "Showcase":
            self.manager.current = "Main"
            self.manager.transition.direction = "right"
        elif self.manager.current == "Main":
            self.go_back()
        else:
            pass

    def open_leave_popup(self):
        LeavePU().open()

    def connectToServer(self):
        ConnectPU().open()


class ShowcaseS(MDScreen):
    def leave_screen(self):
        self.manager.current = "Main"
        self.manager.transition.direction = "right"

    def disablefullscreen(self):
        Window.fullscreen = False

    def reset(self):
        returnOk = False


class RootScreen(ScreenManager):
    pass


class MusicPlayer(MDApp):
    def build(self):
        Window.bind(on_request_close=self.on_request_close)
        self.title = "MusicPlayer"
        self.theme_cls.primary_palette = "Blue"
        self.theme_cls.accent_palette = "Gray"
        # self.icon = "./BiogasControllerAppLogo.png"
        return Builder.load_file("./bin/gui/gui.kv")

    def on_request_close(self, *args):
        print("leaving...")
        os.killpg(os.getpgid(0), signal.SIGKILL)


if __name__ == "__main__":
    if config['Display']['launchMaximized'] == "True":
        Window.maximize()
    else:
        pass
    try:
        Window.size = (int(config['Display']['width']), int(config['Display']['height']))
    except Exception as e:
        print("Unvalid config string found in Display settings")

    Config.set('graphics', 'width', '800')
    Config.set('graphics', 'height', '600')
    Config.set('graphics', 'resizable', True)
    Config.set('kivy', 'exit_on_escape', '0')
    Config.set('input', 'mouse', 'mouse,multitouch_on_demand')
    Config.set('graphics', 'window_state', 'normal')
    Config.write()
    MusicPlayer().run()
