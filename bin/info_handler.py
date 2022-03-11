import bin.csv_parsers


cvr = bin.csv_parsers.CsvRead()
cvw = bin.csv_parsers.CsvWrite()


class InfoHandler:
    def __init__(self):
        self.path = ""
        self.__infos = ""
        self.__style = ""
        self.__outp1 = ""
        self.__output = []

    def infohandler(self, listname, path):
        self.path = f"{path}/{listname}"
        self.__info_doc = cvr.importing(self.path)
        self.__outp1 = ""
        self.__output = []
        for self.item in self.__info_doc:
            self.__outp1 = []
            self.__infos = ""
            self.__infos = self.item
            self.__outp1 = f"{self.__infos.pop(0)} - {self.__infos.pop(0)}"
            try:
                self.__style = self.__infos.pop(0)
                self.__outp1 += f" | {self.__style}"
            except:
                pass
            self.__output.append(self.__outp1)
        cvw.app_str("./data/songtemp.csv", self.__output)
