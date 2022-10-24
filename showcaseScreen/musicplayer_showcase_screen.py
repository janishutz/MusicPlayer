from kivy.core.window import Window
from kivy.uix.screenmanager import ScreenManager
from kivymd.uix.screen import MDScreen
from kivymd.app import MDApp
from kivy.base import Builder
from kivy.uix.popup import Popup
from kivy.clock import Clock
import handlers.server_handler as shand

server_manager = shand.ServerHandler()


class LoginWindow(MDScreen):
    def startserver(self):
        self.ids.statusbar.text = "Starting server..."
        server_manager.start_server()
        Clock.schedule_once(self.getStatus, 4)

    def getStatus(self, dump):
        print("status update")
        if server_manager.get_server_status():
            self.ids.statusbar.text = "Server running on Port 8080"
        else:
            self.ids.statusbar.text = "There was an error starting the server or it might take longer than expected to start it."
            Clock.schedule_once(self.getStatus, 4)


class MusicPlayerShowcaseScreen(MDApp):
    global screen_manager
    screen_manager = ScreenManager()
    
    def build(self):
        self.title = "MusicPlayer Showcase Screen"
        self.theme_cls.primary_palette = "Blue"
        self.theme_cls.accent_palette = "Gray"
        screen_manager.add_widget(Builder.load_file("./ui/mainui.kv"))
        return screen_manager

MusicPlayerShowcaseScreen().run()