import requests

x = requests.post('http://localhost:8000/testrequest', {"Test":"test"})

print(x.text)