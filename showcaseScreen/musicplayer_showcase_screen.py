from audioop import add
from kivy.core.window import Window
from kivy.uix.screenmanager import ScreenManager
from kivymd.uix.screen import MDScreen
from kivymd.app import MDApp
from kivy.base import Builder
from kivy.uix.popup import Popup
from kivy.clock import Clock
import handlers.comHandler
import math
import handlers.csv_parsers
Builder.load_file('./ui/connectionPU.kv')

comHandler = handlers.comHandler.Com()
cvr = handlers.csv_parsers.CsvRead()

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
        if self.url[:8] != "https://" and  self.url[:7] != "http://" and self.url[len(self.url) - 1:] == "/" and not self.containsPort and len(self.url) > 2:
            self.connectionurl = f"http://{self.url[:len(self.url) - 1]}:8000"
            print(comHandler.connect(self.connectionurl))
        elif self.url[:8] != "https://" and self.url[:7] != "http://" and self.url[len(self.url) - 1:] != "/" and not self.containsPort and len(self.url) > 2:
            self.connectionurl = f"http://{self.url}:8000"
            print(comHandler.connect(self.connectionurl))
        else:
            ConnectionPU().open()
        global address
        address = self.connectionurl
        screen_manager.current = "ShowcaseScreen"


class ShowcaseScreen(MDScreen):
    def beginUpdating(self):
        Clock.schedule_interval(self.updateScreen, 0.5)
        self.lastsongpos = 200
        self.__current = comHandler.getcurrentsong(address)
        self.__upcoming = comHandler.getupcomingsongs(address)
        self.songlength = comHandler.getsonglength(address)

    def updateScreen(self, dmp):
        global address
        Window.fullscreen = comHandler.checkiffullscreen(address)
        Window.maximize()
        self.__windowsize = Window._get_size()
        self.__windowsize_x = self.__windowsize[0]
        self.__windowsize_y = self.__windowsize[1]
        self.__text_size = round(math.sqrt(((self.__windowsize_x + self.__windowsize_y) / 2)), 0)
        self.ids.current_song.font_size = self.__text_size + 5
        self.ids.upcoming_songs.font_size = self.__text_size - 5
        self.ids.titleinfo.font_size = self.__text_size * 2.2
        self.ids.upcoming_ind.font_size = self.__text_size + 10
        self.songpos = comHandler.getsongpos(address)
        if self.songpos < self.lastsongpos:
            self.__current = comHandler.getcurrentsong(address)
            self.__upcoming = comHandler.getupcomingsongs(address)
            self.songlength = comHandler.getsonglength(address)
        else:
            pass
        self.lastsongpos = self.songpos
        self.__songdisplay = int(self.songpos / float(self.songlength) * 100)
        self.ids.progressbars.value = self.__songdisplay
        self.ids.current_song.text = self.__current
        self.ids.upcoming_songs.text = self.__upcoming
        if comHandler.checkgo(address):
            pass
        else:
            Window.fullscreen = False
            screen_manager.current = "Login"


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
