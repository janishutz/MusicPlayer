from mutagen.mp3 import MP3
from mutagen.id3 import ID3, APIC, error
from PIL import Image
from io import BytesIO

songpath = '/mnt/storage/SORTED/Music/KB/01 Tennessee Waltz.mp3'
audio = MP3(songpath)
tags = ID3(songpath)
print(tags.pprint())
pic = tags.get("APIC:").data
img = Image.open(BytesIO(pic))
img.save('./coverart.png')