from kivy.core.window import Window
from kivy.uix.screenmanager import ScreenManager
from kivymd.uix.screen import MDScreen
from kivymd.app import MDApp
from kivy.base import Builder
from kivy.uix.popup import Popup
from kivy.clock import Clock
import handlers.comHandler
import math
import bin.csv_parsers
Builder.load_file('./ui/connectionPU.kv')

comHandler = handlers.comHandler.Com()
cvr = bin.csv_parsers.CsvRead()

class ConnectionPU(Popup):
    pass


class LoginWindow(MDScreen):
    def connect(self):
        self.url = self.ids.url.text
        self.containsPort = False
        for self.letter in self.url:
            if self.letter == ":":
                self.containsPort = True
            else:
                pass
        self.connectionurl = ""
        if self.url[:8] != "https://" and  self.url[:7] != "http://" and self.url[len(self.url) - 1:] == "/" and not self.containsPort:
            self.connectionurl = f"http://{self.url[:len(self.url) - 1]}:8000"
            print(comHandler.connect(self.connectionurl))
        elif self.url[:8] != "https://" and self.url[:7] != "http://" and self.url[len(self.url) - 1:] != "/" and not self.containsPort:
            self.connectionurl = f"http://{self.url}:8000"
            print(comHandler.connect(self.connectionurl))
        else:
            ConnectionPU().open()
        global address
        address = self.url


class ShowcaseScreen(MDScreen):
    def updateScreen(self):
        global address
        self.__windowsize = Window._get_size()
        self.__windowsize_x = self.__windowsize[0]
        self.__windowsize_y = self.__windowsize[1]
        self.__text_size = round(math.sqrt(((self.__windowsize_x + self.__windowsize_y) / 2)), 0)
        self.ids.current_song.font_size = self.__text_size + 5
        self.ids.upcoming_songs.font_size = self.__text_size - 5
        self.ids.titleinfo.font_size = self.__text_size * 2.2
        self.ids.upcoming_ind.font_size = self.__text_size + 10
        self.__current = comHandler.getcurrentsong(address)
        self.__upcoming = comHandler.getupcomingsongs(address)
        self.__songdisplay = int(comHandler.getsonglength(address) / float(comHandler.getsongpos(address)) * 100)
        self.ids.progressbars.value = self.__songdisplay
        if self.__config == ["1"]:
            self.ids.current_song.text = self.__current[:(len(self.__current) - 4)]
        else:
            self.ids.current_song.text = self.__current
        if len(self.__upcoming) <= self.__currents:
            self.ids.upcoming_songs.text = "No more songs in Queue"
        else:
            if self.__config == ["1"]:
                self.__upcoming_output = self.__upcoming[:(len(self.__upcoming) - 4)]
            else:
                self.__upcoming_output = self.__upcoming

            self.__length_output = 0
            for i in range(len(self.__upcoming) - self.__currents):
                if self.__length_output > 5:
                    pass
                else:
                    if self.__config == ["1"]:
                        self.__upcoming_output += f"\n{self.__upcoming[:(len(self.__upcoming) - 4)]}"
                    else:
                        self.__upcoming_output += f"\n{self.__upcoming}"
                    self.__length_output += 1
            self.ids.upcoming_songs.text = self.__upcoming_output


class MusicPlayerShowcaseScreen(MDApp):
    global screen_manager
    screen_manager = ScreenManager()
    
    def build(self):
        self.title = "MusicPlayer Showcase Screen"
        self.theme_cls.primary_palette = "Blue"
        self.theme_cls.accent_palette = "Gray"
        screen_manager.add_widget(Builder.load_file("./ui/mainui.kv"))
        screen_manager.add_widget(Builder.load_file('./ui/showcase.kv'))
        return screen_manager


MusicPlayerShowcaseScreen().run()
