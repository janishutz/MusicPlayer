import requests


class Com:
    def __init__(self):
        pass

    def connect(self, url):
        self.x = requests.get(f"{url}/tryconnect")
        print(self.x.text)
        if self.x.text == "ok":
            return True
        else:
            return False

    def getcurrentsong(self, url):
        return "Testsong"

    def getsonglength(self, url):
        return 100

    def getupcomingsongs(self, url):
        return "Test1\nTest2"

    def getsongpos(self, url):
        return 2