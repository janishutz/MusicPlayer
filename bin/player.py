import pygame.mixer as mx
import bin.csv_parsers
import copy
import bin.filepathanalysis
import pygame
import bin.info_handler
import configparser

pa = bin.filepathanalysis.PathAnalysis()
cvr = bin.csv_parsers.CsvRead()
cvw = bin.csv_parsers.CsvWrite()

config = configparser.ConfigParser()
config.read('./data/settings.ini')


class Player:
    def __init__(self):
        self.__running = 1
        self.event = ""
        self.__recent_change = 1000000
        self.__imports = []
        self.information = []
        self.current_playing_pos = 0
        self.__songlength = 0

    def start_playing(self):
        # initialize playing
        if pygame.get_init() == True:
            pass
        else:
            pygame.init()
            self.path = cvr.importing("./data/temp.csv").pop(0)
            self.pathtr = self.path.pop(0)
            self.__imports = pa.validsonglistcreator(self.pathtr)
            self.playlist = self.__imports.pop(0)
            self.playlist.sort()
            self.playlist_backup = copy.deepcopy(self.playlist)
            self.information = self.__imports.pop(0)
            self.information.sort()
            mx.init()
            self.current_playing = self.playlist.pop(0)
            mx.music.load(self.current_playing)
            mx.music.play()
            mx.music.pause()

    def infoupdater(self):
        self.__songlength = mx.Sound(self.current_playing).get_length()
        self.transmission = []
        cvw.write_str("./data/songtemp.csv", [self.current_playing_pos])
        self.__config = cvr.importing("./data/config.csv").pop(0)
        self.listinfo = self.__config.pop(1)
        if self.__config == ["1"]:
            cvw.app_str("./data/songtemp.csv", self.information)
        else:
            try:
                bin.info_handler.InfoHandler().infohandler(self.listinfo, self.pathtr)
            except FileNotFoundError:
                cvw.chg_str("./data/config.csv", 0, 0, "1")
                cvw.app_str("./data/songtemp.csv", self.information)
        cvw.app_str("./data/songtemp.csv", [self.__songlength])

    def musicmanager(self, inst, other, backfeed):
        self.start_playing()
        self.infoupdater()
        while self.__running == 1:
            backfeed.value = mx.music.get_pos() / 1000
            if self.__recent_change < 1:
                pass
            else:
                self.__recent_change -= 1
            # instructions from main class
            if other.value == 1:
                other.value = 0
                mx.music.unload()
                if len(self.playlist) > 0:
                    pass
                else:
                    self.playlist = copy.deepcopy(self.playlist_backup)
                    self.current_playing_pos = -1
                self.current_playing = self.playlist.pop(0)
                self.current_playing_pos += 1
                mx.music.load(self.current_playing)
                mx.music.play()
                self.__recent_change = 1000000
                self.infoupdater()

            elif other.value == 2:
                mx.music.unload()
                mx.music.load(self.current_playing)
                mx.music.play()
                other.value = 0

            elif other.value == 3:
                self.__recent_change = 1000000
                other.value = 0

            elif other.value == 4:
                other.value = 0
                mx.music.unload()
                self.playlist = copy.deepcopy(self.playlist_backup)
                if self.current_playing_pos > 0:
                    self.current_playing_pos -= 1
                else:
                    self.current_playing_pos = len(self.playlist_backup) - 1
                for i in range(self.current_playing_pos):
                    self.playlist.pop(0)
                self.current_playing = self.playlist.pop(0)
                mx.music.load(self.current_playing)
                mx.music.play()
                self.__recent_change = 10000000
                self.infoupdater()
            else:
                if inst.value == 1:
                    mx.music.unpause()
                else:
                    mx.music.pause()
            # Main event-checking part
            if mx.music.get_busy() is False and inst.value == 1 and self.__recent_change == 0:
                mx.music.unload()
                if config["Playback"]["loopPlayback"] == "0":
                    pass
                else:
                    if len(self.playlist) > 0:
                        pass
                    else:
                        self.playlist = copy.deepcopy(self.playlist_backup)
                        self.current_playing_pos = -1
                    self.current_playing = self.playlist.pop(0)
                    self.current_playing_pos += 1
                    mx.music.load(self.current_playing)
                    mx.music.play()
                    self.__recent_change = 10000000
                    self.infoupdater()
            else:
                pass
