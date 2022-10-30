import handlers.server
import handlers.server_translator as st
import multiprocessing as mp
import ctypes

servert = st.ServerTranslator()

class ServerHandler:
    def __init__(self):
        self.details = mp.Manager().Value('i', 0)
        self.com = mp.Manager().Value(ctypes.c_wchar_p, "Test")
        self.playbackpos = mp.Manager().Value('i', 0)

    def start_server(self):
        print("starting server")
        try:
            if self.mpserver.is_alive():
                pass
            else:
                self.mpserver = mp.Process(name="runserver", target=handlers.server.run, args=(self.details, self.com, self.playbackpos ))
                self.mpserver.start()
        except AttributeError as e:
            self.mpserver = mp.Process(name="runserver", target=handlers.server.run, args=(self.details, self.com, self.playbackpos, ))
            self.mpserver.start()

    def stop_server(self):
        self.mpserver.kill()

    def get_server_status(self):
        try:
            return self.mpserver.is_alive()
        except AttributeError:
            return False

    def get_connection_status(self):
        return servert.connection(self.details)

    def getData(self):
        return self.com.value