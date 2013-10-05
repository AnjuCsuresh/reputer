import BaseHTTPServer
from SimpleHTTPServer import SimpleHTTPRequestHandler

addr = ("", 8888)

serv = BaseHTTPServer.HTTPServer(addr, SimpleHTTPRequestHandler)

serv.serve_forever()