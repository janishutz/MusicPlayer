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
        else:
            self.opened_file = open(f".{self.path}").read()
        self.wfile.write(bytes(self.opened_file, 'utf-8'))
    
    def do_POST(self):
        self._set_headers()
        self.returnsPOST = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={ 'REQUEST_METHOD' : 'POST'}
        )
        print(self.returnsPOST)

def run(server_class=HTTPServer, handler_class=MusicPlayerServer, port=8080):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Server started on {port}")
    httpd.serve_forever()
