import os


class PathAnalysis:
    def __init__(self):
        self.__output = []
        self.__input = []
        self.__file_extension = ""
        self.__filepath = ""
        self.__returns = []
        self.__names = []

    def validsonglistcreator(self, path):
        self.__input = os.listdir(path)
        for self.item in self.__input:
            self.__file_extension = self.item[(len(self.item) - 4):]
            if self.__file_extension == ".mp3" or self.__file_extension == ".wav":
                self.__filepath = str(path)
                self.__filepath += f"/{str(self.item)}"
                self.__names.append(self.item)
                self.__output.append(self.__filepath)
            else:
                pass
        self.__returns.append(self.__output)
        self.__returns.append(self.__names)
        return self.__returns
