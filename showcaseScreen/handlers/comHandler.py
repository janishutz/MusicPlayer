import requests


class Com:
    def __init__(self):
        self.connectok = True

    def connect(self, url):
        try: 
            self.x = requests.get(f"{url}/tryconnect")
        except Exception:
            self.connectok = False
            return False
        if self.connectok:
            if self.x.text == "ok":
                return True
            else:
                return False
        else:
            pass

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
        return float(self.x.text)

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
        return float(self.x.text)

    def checkiffullscreen(self, url):
        try: 
            self.x = requests.get(f"{url}/fullscreen")
        except Exception:
            return False
        if self.x.text == "True":
            return 'auto'
        else:
            return False

    def checkgo(self, url):
        try: 
            self.x = requests.get(f"{url}/isrunning")
        except Exception:
            return False
        return self.x.text

    def getuiupdate(self, url):
        try: 
            self.x = requests.get(f"{url}/uiupdate")
        except Exception:
            return False
        if self.x.text == "True":
            return True
        else:
            return False