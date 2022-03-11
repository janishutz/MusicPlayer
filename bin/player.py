import pygame.mixer as mx
import bin.csv_parsers
import copy
import bin.filepathanalysis
import pygame
import bin.info_handler

pa = bin.filepathanalysis.PathAnalysis()
cvr = bin.csv_parsers.CsvRead()
cvw = bin.csv_parsers.CsvWrite()


class Player:
    def __init__(self):
        self.__running = 1
        self.event = ""
        self.__recent_change = 1000000
        self.__imports = []
        self.information = []
        self.current_playing_pos = 0

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
        self.transmission = []
        cvw.write_str("./data/songtemp.csv", [self.current_playing_pos])
        self.__config = cvr.importing("./data/config.csv").pop(0)
        if self.__config == ["1"]:
            cvw.app_str("./data/songtemp.csv", self.information)
        else:
            print(self.path, "path")
            bin.info_handler.InfoHandler().infohandler(self.information, self.pathtr)

    def musicmanager(self, inst, other):
        self.start_playing()
        self.infoupdater()
        while self.__running == 1:
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
                mx.music.rewind()
                other.value = 0

            elif other.value == 3:
                self.__recent_change = 1000000
                other.value = 0
            else:
                if inst.value == 1:
                    mx.music.unpause()
                else:
                    mx.music.pause()
            # Main event-checking part
            if mx.music.get_busy() is False and inst.value == 1 and self.__recent_change == 0:
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
                self.__recent_change = 10000000
                self.infoupdater()
            else:
                pass

