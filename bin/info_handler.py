import bin.csv_parsers


cvr = bin.csv_parsers.CsvRead()
cvw = bin.csv_parsers.CsvWrite()


class InfoHandler:
    def __init__(self):
        pass

    def infohandler(self, infos, path):
        print(path, "path")
        self.path = f"{path}/songlist.csv"
        self.__info_doc = cvr.importing(self.path)
        print(self.__info_doc)
        print(infos)
