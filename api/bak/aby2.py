#!/usr/bin/python
#Connect to the ElectrumX TCP server with Python v2.7 API
#@Created by Anoxy(Anoxxxy) anoxydoxy@gmail.com 
#Python Server to communicate with the ElectrumX server.
#May be tweaked!

#To find what parameters  and methods to use navigate to:
#https://github.com/kyuupichan/electrumx/blob/master/docs/PROTOCOL.rst

import time
import BaseHTTPServer
import urlparse
import socket
import json

#https://62.171.189.243:50005/api?method=blockchain.address.listunspent&params=PS4VbNzWjoUyAzcZbQ7v4j5h975uv6Vkyu
#127.0.0.1:9998/api?method=blockchain.address.listunspent&params=PS4VbNzWjoUyAzcZbQ7v4j5h975uv6Vkyu

HOST_ELECTRUMX = "electrumx-four.artbyte.live"	#HOST name for the ElectrumX server
PORT_ELECTRUMX = 50012				#PORT number for the ElectrumX server

HOST_LOCAL = "127.0.0.1"		#HOST name for this server (where this script runs)
PORT_LOCAL = 9998				#PORT number for this server (where this script runs)


#https://stackoverflow.com/questions/5239547/fetching-http-get-variables-in-python
#Fetching HTTP GET variables in Python
def do_FETCH_QUERY(url):
	qs = {}
	path = url
	qs_json = ""
	if 'api?' in path:
		path, tmp = path.split('?', 1)
		qs = urlparse.parse_qs(tmp)
	#if set(("method", "params")) <= set(qs):
	#print(qs)
	#print (url)
	if 'method' in qs:
		qs_json = do_PREPARE_QUERY(qs)
		#print ("method and params set!")
	else:
		qs_json = '{"api_status" : "error", "api_msg" : "no Method or Params!"}'
		#print ("method and params NOT set!")
	#print path, qs
	
	return qs_json

#Fetching HTTP GET variables in Python
def do_PREPARE_QUERY(queries):
	print("prepare")
	qs = {}
	#print key n values
#if 'key1' in dict:
#print "blah"
#else:
#print "boo"

	for k, v in queries.items():
		if  k == 'method':
			replaced_v = str(v).replace("[","").replace("]", "")
			replaced_v = replaced_v.replace("'","").replace("'", "")
			qs["method"] = replaced_v
			#print("Method : ", v)
		elif k == 'params':
			qs["params"] = v
			#print("Params : ", v)

	qs["id"] = "aby"
	qs["jsonrpc"] = "2.0"

	#Convert Python Object (Dict) to JSON
	#https://pythonspot.com/en/json-encoding-and-decoding-with-python/
	qs_json = (json.dumps(qs, ensure_ascii=False))
	return electrumx_request(qs_json)

	#print path, qs
	#return qs
#http://www.binarytides.com/receive-full-data-with-the-recv-socket-function-in-python/
#http://gnosis.cx/publish/programming/sockets.html
#http://scotdoyle.com/python-epoll-howto.html
def recv_timeout(the_socket,timeout=2):
	#make socket non blocking
	the_socket.setblocking(0)
	 
	#total data partwise in an array
	total_data=[];
	data='';
	 
	#beginning time
	begin=time.time()
	while 1:
		#if you got some data, then break after timeout
		if total_data and time.time()-begin > timeout:
			break

		#if you got no data at all, wait a little longer, twice the timeout
		elif time.time()-begin > timeout*2:
			break
         
		#recv something
		try:
			data = the_socket.recv(8192)
			if data:
				total_data.append(data)
				#change the beginning time for measurement
				begin = time.time()
			else:
				#sleep for sometime to indicate a gap
				time.sleep(0.1)
		except:
			pass

	#join all parts to make final string
	return ''.join(total_data)

def parse_json(string):

	try:
		string = string.replace('\\"', '`')
		return json.loads(string)
	except:
		pass
	return json.loads('{}')	#return empty dict if json above is empty

#following PROTOCOL is accepted
#https://github.com/kyuupichan/electrumx/blob/master/docs/PROTOCOL.rst
#ElectrumX - Socket Server
def electrumx_request(_json_string_):
	'''# try and connect to a bind shell.'''
	result = ''
	result_d = {}
	try:
		print('_json_string_: ', _json_string_)
		s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)	## Create a socket (SOCK_STREAM means a TCP socket)
		s.connect((HOST_ELECTRUMX, PORT_ELECTRUMX))
		#print "[+] Connected to bind shell!\n"
		#cmd = raw_input("(py-shell) $ ");
		s.sendall(_json_string_ + "\n")
		result = recv_timeout(s).strip()
	except socket.error:
		#print "[+] Unable to connect to bind shell."
		result ='{"api_status": "error", "api_msg": "Unable to connect to ElectrumX server"}'
		pass
	
	#result = s.recv(1024).strip();	#only works for small data < 4096 chars
	
	#print('---------------')
	#print ('result from electrumx in string: ', result)
	#print('---------------')

	result_d = parse_json(result)	#convert response to json
	print( json.dumps(result, ensure_ascii=False).encode('utf8'))
	print( json.dumps(result_d, ensure_ascii=False).encode('utf8'))

	#if 'result' in result_d:		#check if there is any response
	if 'api' in result:
		#if not len(result_d["result"]):
		#if not len(result) :  
			#result = '{"api_status" : "error", "api_msg" : "Empty response. Dead shell / exited?"}'
		result_d["api_status"] =  "success"
	elif 'error' in result:
		result_d["api_status"] =  "error"
	else:
		result_d["api_status"] =  "error"
		result_d["api_msg"] =  "-Empty response or Dead ElectrumX server"
	
	s.close()
	return json.dumps(result_d, ensure_ascii=False).encode('utf8')


#print electrumx_connect(json_string_);

#LOCAL server for running this script
class MyHandler(BaseHTTPServer.BaseHTTPRequestHandler):
	def do_HEAD(s):
		s.send_response(200)
		#s.send_header("Content-type", "text/html")
		s.send_header("Content-type", "application/json")
		s.end_headers()
	def do_GET(s):
		"""Respond to a GET request."""
		s.send_response(200)
		s.send_header("Content-type", "application/json")
		s.end_headers()
		#s.wfile.write("<html><head><title>Title goes here.</title></head>")
		#s.wfile.write("<body><p>This is a test.</p>")
		# If someone went to "http://something.somewhere.net/foo/bar/",
		# then s.path equals "/foo/bar/".
		#s.wfile.write("<p>You accessed path: %s</p>" % s.path)
		#s.wfile.write("<p>Your parameters: %s</p>" % do_REQUEST_QUERY(s.path))
		s.wfile.write((do_FETCH_QUERY(s.path)))	#result from electrum request
		#s.wfile.write(do_FETCH_QUERY(s.path))						#user/client request
		#s.wfile.write("</body></html>")

if __name__ == '__main__':
	server_class = BaseHTTPServer.HTTPServer
	httpd = server_class((HOST_LOCAL, PORT_LOCAL), MyHandler)
	print time.asctime(), "Server Starts - %s:%s" % (HOST_LOCAL, PORT_LOCAL)
	try:
		httpd.serve_forever()
	except KeyboardInterrupt:
		pass
	httpd.server_close()
	print time.asctime(), "Server Stops - %s:%s" % (HOST_LOCAL, PORT_LOCAL)

#run in backround
#https://askubuntu.com/questions/396654/how-to-run-the-python-program-in-the-background-in-ubuntu-machine
#sudo  chmod +x electrumx_socket.py
#sudo nohup python /home/coino0/electrumx_socket.py &
#kill if needed
#ps ax | grep electrumx_socket.py
#sudo kill #pid
