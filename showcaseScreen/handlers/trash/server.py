from code import interact
from http.server import HTTPServer, BaseHTTPRequestHandler
import cgi
import os


class MusicPlayerServer(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        self._set_headers()
        if self.path == '/reloadstyling':
            pass
        elif self.path == '/connect':
            print("connection being established")
            global details
            details.value = 1
        else:
            try:
                self.opened_file = open(f".{self.path}").read()
                self.wfile.write(bytes(self.opened_file, 'utf-8'))
            except Exception as e:
                print("There was an error in opening the specified file: 404")
    
    def do_POST(self):
        self._set_headers()
        self.returnsPOST = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={ 'REQUEST_METHOD' : 'POST'}
        )
        if self.path == '/publishtime':
            global playtime
            playtime.value = 1
        elif self.path == '/publishsonginfo':
            global com
            print(self.returnsPOST.value[0].value)
            if self.returnsPOST.value[0].name == "songinfos":
                com.value = self.returnsPOST.value[0].value


def run(interact, instructions, pos, server_class=HTTPServer, handler_class=MusicPlayerServer, port=9999):
    server_address = ('', port)
    global details
    details = interact
    global com
    com = instructions
    global playtime
    playtime = pos
    httpd = server_class(server_address, handler_class)
    print(f"Server started on {port}")
    httpd.serve_forever()
