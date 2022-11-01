import stat
import requests

class ServerComs:
    def __init__(self):
        pass

    def connect(self, url):
        try:
            self.x = requests.get(f"{url}/tryconnect")
            return True
        except Exception:
            return False

    def postcurrentsong(self, url, data):
        try:
            self.x = requests.post(f"{url}/postcurrentsong", {"songname":data})
            return True
        except Exception:
            return False

    def postupcomingsongs(self, url, data):
        try:
            self.x = requests.post(f"{url}/postupcomingsongs", {"songs":data})
            return True
        except Exception:
            return False

    def postplaybackpos(self, url, data):
        try:
            self.x = requests.post(f"{url}/postplayback", {"pos":data})
            return True
        except Exception:
            return False

    def postsonglength(self, url, data):
        try:
            self.x = requests.post(f"{url}/postsonglength", {"length":data})
            return True
        except Exception:
            return False

    def changefullscreen(self, url):
        try:
            self.x = requests.get(f"{url}/changefullscreen")
            return True
        except Exception:
            return False

    def getfullscreeninfo(self, url):
        try:
            self.x = requests.get(f"{url}/fullscreen")
            return self.x.text
        except Exception as e:
            print(e)
            return "False"

    def poststatus(self, url, statuscode):
        try:
            self.x = requests.post(f"{url}/poststatus", {"status":statuscode})
            return True
        except Exception:
            return False

    def requestUIupdate(self, url):
        try:
            self.x = requests.get(f"{url}/requestuiupdate")
            return True
        except Exception:
            return False
