#!/usr/bin/python
#Connect to the ElectrumX with socket
#@Created by Anoxy(Anoxxxy) anoxydoxy@gmail.com 
#Python Server to communicate with the ElectrumX server.
#May be tweaked!

#To find what parameters  and methods to use navigate to:
#https://github.com/kyuupichan/electrumx/blob/master/docs/PROTOCOL.rst

import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse
import socket
import json
import errno

#https://62.171.189.243:50005/api?method=blockchain.address.listunspent&params=PS4VbNzWjoUyAzcZbQ7v4j5h975uv6Vkyu
#127.0.0.1:9998/api?method=blockchain.address.listunspent&params=KDVGcpkxpSyPMMEqMKPMQngsbRNzmWC9N4

HOST_ELECTRUMX = "62.171.189.243:50002"	#HOST name for the ElectrumX server
PORT_ELECTRUMX = 50002				#PORT number for the ElectrumX server

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

	qs["id"] = "msg_id"
	#print("id : msg_id")
	#return qs
	#Convert Python Object (Dict) to JSON
	#https://pythonspot.com/en/json-encoding-and-decoding-with-python/
	qs_json = (json.dumps(qs, ensure_ascii=False))
	print (qs_json)
	return electrumx_request(qs_json)
	#return qs_json
	
	#print("Method : {0}, Value : {1}".format(k, v))

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
	
#following PROTOCOL is accepted
#https://github.com/kyuupichan/electrumx/blob/master/docs/PROTOCOL.rst
#ElectrumX - Socket Server
def electrumx_request(_json_string_):
	'''# try and connect to a bind shell.'''
	error_msg =""
	try:
		s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)	## Create a socket (SOCK_STREAM means a TCP socket)
		s.connect((HOST_ELECTRUMX, PORT_ELECTRUMX))
		#print "[+] Connected to bind shell!\n"
		#cmd = raw_input("(py-shell) $ ");
		s.sendall(_json_string_ + "\n");  
		result = recv_timeout(s).strip();
	except (socket.error, e):
		#https://stackoverflow.com/questions/34718208/catch-broken-pipe-in-python-2-and-python-3
		if e.errno == errno.EPIPE:
			#do_something_about_the_broken_pipe()
			result ='{"api_status" : "error"}'
			error_msg = "EPIPE error. Broken Pipe Error 32. Client closed the socket connection?"
		if e.errno == errno.ECONNREFUSED:
			result ='{"api_status" : "error"}'
			error_msg = "Connection refused, Error 111. Is ElectrumX synching?"
		else:
			# Other error
			result ='{"api_status" : "error"}'
			error_msg = "Error Occured."
		pass
	finally: 
		s.close();  #close Socket connection
	
	#result = recv_timeout(s).strip();
	#result = s.recv(1024).strip();
	#result = recv_timeout(s).strip();
	result_d = {}
	result_d = json.loads(result)	#convert to json
	if 'result' in result_d:		#check if there is any response
		#if not len(result_d["result"]):
		#if not len(result) :  
			#result = '{"api_status" : "error", "api_msg" : "Empty response. Dead shell / exited?"}'
		result_d["api_status"] =  "success"
	else:
		result_d["api_status"] =  "error"
		#result_d["api_msg"] =  "Unable to connect to Bitbay ElectrumX server. Empty response from ElectrumX?"
		result_d["api_msg"] =  error_msg
	
	result = (json.dumps(result_d, ensure_ascii=False))
	
	return result

#print electrumx_connect(json_string_);

#LOCAL server for running this script
class MyHandler(BaseHTTPRequestHandler):
	def do_HEAD(s):
		s.send_response(200)
		#s.send_header("Content-type", "text/html")
		s.send_header("Access-Control-Allow-Origin", "*")
		s.send_header("Content-type", "application/json")
		s.send_header('Access-Control-Allow-Methods', 'PUT, PATCH, GET, POST, DELETE, OPTIONS')
		s.send_header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
		s.end_headers()
	def do_GET(s):
		"""Respond to a GET request."""
		s.send_response(200)
		s.send_header("Access-Control-Allow-Origin", "*")
		s.send_header("Content-type", "application/json")
		s.send_header('Access-Control-Allow-Methods', 'PUT, PATCH, GET, POST, DELETE, OPTIONS')
		s.send_header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
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
	server_class = HTTPServer
	httpd = server_class((HOST_LOCAL, PORT_LOCAL), MyHandler)
	print (time.asctime(), "Server Starts - %s:%s" % (HOST_LOCAL, PORT_LOCAL))
	try:
		httpd.serve_forever()
	except KeyboardInterrupt:
		pass
	httpd.server_close()
	print (time.asctime(), "Server Stops - %s:%s" % (HOST_LOCAL, PORT_LOCAL))

#run in backround
#https://askubuntu.com/questions/396654/how-to-run-the-python-program-in-the-background-in-ubuntu-machine
#sudo  chmod +x electrumx_socket.py
#sudo nohup python /home/coino0/electrumx_socket.py &
#ps ax | grep electrumx_socket.py
#sudo kill #pid

#@Denny both nohup python /path/to/test.py & or nohup /path/to/test.py & will work. For the latter you need to use the shebang line in your python script and make the script executable as shown above. – souravc May 29 '15 at 13:40	
#How to bring the script to the foreground? – Xinyang Li Jan 17 '16 at 11:05	
#@LiXinyang If you are using bash, fg will bring the script to the foreground. 
#But that won't change the output redirection, which will still be going to nohup.out.
# If the command jobs cannot find see it, then it is no longer a child of this shell. 
#If you do a ps you'll see it is now owned by process 1 (init). 
#That cannot be "brought back to the foreground" because the foreground no longer exists. 
#you can use screen which will enable you to attach/reattach. – souravc Jan 19 '16 at 6:14