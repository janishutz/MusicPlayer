from tkinter.tix import Tree


class ServerTranslator:
    def __init__(self):
        pass
    
    def connection(self, details):
        print(details.value)
        if details.value == 1:
            return True
        else:
            return False
