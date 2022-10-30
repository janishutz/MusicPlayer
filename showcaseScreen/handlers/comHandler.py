import requests


class Com:
    def __init__(self):
        pass

    def connect(self, url):
        try: 
            self.x = requests.get(f"{url}/tryconnect")
        except Exception:
            return False
        print(self.x.text)
        if self.x.text == "ok":
            return True
        else:
            return False

    def getcurrentsong(self, url):
        try: 
            self.x = requests.get(f"{url}/currentsong")
        except Exception as e:
            print(e)
            return "Error"
        return self.x.text

    def getsonglength(self, url):
        try: 
            self.x = requests.get(f"{url}/songmaxlength")
        except Exception:
            return 100
        return int(self.x.text)

    def getupcomingsongs(self, url):
        try: 
            self.x = requests.get(f"{url}/upcomingsongs")
        except Exception:
            return "Error"
        return self.x.text

    def getsongpos(self, url):
        try: 
            self.x = requests.get(f"{url}/playbackpos")
        except Exception:
            return 0
        return int(self.x.text)

    def checkiffullscreen(self, url):
        try: 
            self.x = requests.get(f"{url}/currentsong")
        except Exception:
            return False
        if self.x.text == "True":
            return True
        else:
            return False