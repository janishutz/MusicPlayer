import bin.csv_parsers
import os

cvr = bin.csv_parsers.CsvRead()


class AutoComplete:
    def __init__(self):
        self.__length_command_completion = 0
        self.__command_list = []
        self.__possible_completion = []
        self.item = ""
        self.items = ""
        self.__return_value = []
        self.__return_value_assembly = ""
        self.__command_count = 0
        self.text = ""
        self.path = ""
        self.check = ""
        self.check_in = ""
        self.okay = True

    def autocomplete(self, text):
        self.text = str(text)
        self.okay = True
        if self.text[len(self.text) - 2:] == "\t\n":
            self.text = self.text[:len(self.text) - 2]
        elif self.text[len(self.text) - 1:] == "\t":
            self.text = self.text[:len(self.text) - 1]
            if self.text == "":
                self.text = "/"
                self.path = "/"
            elif self.text[len(self.text) - 1:] == "/":
                self.path = self.text
            else:
                self.path = self.text[:len(self.text) - 1]
                while self.path[len(self.path) - 1:] != "/":
                    self.path = self.path[:len(self.path) - 1]
        self.__command_list = os.listdir(self.path)
        self.__return_value = []
        self.__return_value_assembly = ""
        self.__possible_completion = []
        self.__command_count = 0
        self.check = ""
        self.check_in = self.text
        while self.check_in[len(self.check_in) - 1:] != "/":
            if len(self.check_in) < 1:
                self.okay = False
            else:
                self.check += str(self.check_in[len(self.check_in) - 1:])
                self.check_in = self.check_in[:len(self.check_in) - 1]
        if self.okay:
            self.check = self.check[::-1]
            for self.item in self.__command_list:
                if self.check == self.item[:len(self.check)]:
                    self.__possible_completion.append(f'{self.path}{self.item}/')
                else:
                    pass
            if len(self.__possible_completion) < 1:
                self.__return_value = ["No such file or directory", self.text[:len(self.text)]]
            elif len(self.__possible_completion) == 1:
                self.__return_value = ["", str(self.__possible_completion.pop(0))]
            else:
                for self.items in self.__possible_completion:
                    self.__return_value_assembly += f"{str(self.items)}               "
                    if self.__command_count > 2:
                        self.__return_value_assembly += "\n"
                        self.__command_count = 0
                    else:
                        self.__command_count += 1
                self.__return_value.append(self.__return_value_assembly)
                self.__return_value.append(self.text[:len(self.text)])
            return self.__return_value
        else:
            pass
