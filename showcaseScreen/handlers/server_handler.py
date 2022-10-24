import handlers.server
import multiprocessing as mp


class ServerHandler:
    def __init__(self):
        pass

    def start_server(self):
        print("starting server")
        try:
            if self.mpserver.is_alive():
                pass
            else:
                self.mpserver = mp.Process(name="runserver", target=handlers.server.run,)
                self.mpserver.start()
        except AttributeError as e:
            print(e)
            self.mpserver = mp.Process(name="runserver", target=handlers.server.run,)
            self.mpserver.start()

    def stop_server(self):
        self.mpserver.kill()

    def get_server_status(self):
        try:
            return self.mpserver.is_alive()
        except AttributeError:
            return False