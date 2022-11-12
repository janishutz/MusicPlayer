import os

folderpath = input("Type the path to a folder containing to be converted files (excluding final /): ")

files = os.listdir(folderpath)

toberun = []
for file in files:
    extension = file[len(file) - 4:]
    if extension == ".m4a" or extension == ".wav":
        toberun.append(str(folderpath + "/" + file))


for item in toberun:
    command = f"ffmpeg -i {item} -acodec mp3 {item[:len(item) - 4]}.mp3"
    os.system(command)

print("""


            DONE


""")