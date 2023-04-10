<?php
//return the json response
header("Content-Type: application/json;charset=utf-8");
//https://www.lampdocs.com/how-to-query-an-electrumx-server-with-php/

/*
wally.id/api/x.php?asset=aby&method=server.version&server=electrumx-four.artbyte.live:50012

https://wally.id/api/x.php?asset=aby&method=blockchain.scripthash.get_balance&scripthash=asasasas&server=electrumx-four.artbyte.live:50012
*/

try {

	 ///**GET & POST ) Request Parameters
	$asset_q = ( isset($_GET['asset']) ? $_GET['asset'] : '');
	$method_q = ( isset($_GET['method']) ? $_GET['method'] : '');
		//params for ElectrumX
	$scripthash_q = ( isset($_GET['scripthash']) ? $_GET['scripthash'] : '');
	$rawtx_q = ( isset($_GET['rawtx']) ? $_GET['rawtx'] : '');
	$tx_hash_q = ( isset($_GET['tx_hash']) ? $_GET['tx_hash'] : '');
	$verbose_q = ( isset($_GET['verbose']) ? $_GET['verbose'] : '');
	$server_q = ( isset($_GET['server']) ? $_GET['server'] : '');

	$params_q = '';	//electrumx parameter





	// if we have Missing Parameters -> Quit
	if (!$asset_q && $method_q && $server_q ) {
		echo json_encode(["status" => "error", "message" => "MISSING_PARAMS"], JSON_PRETTY_PRINT);
		exit();
	}

	$electrum_api = array(
	      //https://www.geeksforgeeks.org/multidimensional-associative-array-in-php/?ref=lbp
	    // "blockchain.scripthash.get_balance" as as key
	    "blockchain.scripthash.get_balance" => [
	        "scripthash" => 'req',
	    ],
	    "blockchain.scripthash.get_history" => [
	        "scripthash" => 'req',
	    ],
	    "blockchain.scripthash.get_mempool" => [
	        "scripthash" => 'req',
	    ],
	    "blockchain.scripthash.listunspent" => [
	        "scripthash" => 'req',
	    ],
	    "blockchain.transaction.broadcast" => [
	        "rawtx" => 'req',
	    ],
	    "blockchain.transaction.get" => [
	        "tx_hash" => 'req',
	        "verbose",	//default false
	    ],
	    "server.banner" => [],
	    "server.features" => [],
	    "server.version" => [],
	);

	//exit if method doesnt exist in the query
	if (!array_key_exists($method_q, $electrum_api)) {
		echo json_encode(["status" => "error", "message" => "METHOD_REQUIRED"], JSON_PRETTY_PRINT);
		exit();
	}


	//exit if required params doesnt exist in the query
	//if (array_key_exists($params_q, $electrum_api[$method_q]))
	//	exit('PARAM_REQUIRED');

	//exit('ok: '.array_key_exists($electrum_api[$method_q]['scripthash']));
	if (array_key_exists('scripthash', $electrum_api[$method_q])) {
		if ($scripthash_q == ''){
			echo json_encode(["status" => "error", "message" => "MISSING_PARAM_SCRIPTHASH"], JSON_PRETTY_PRINT);
			exit();
		}
		$params_q = $scripthash_q;
		$params_q = '"'.$params_q.'"';
	}else if (array_key_exists('rawtx', $electrum_api[$method_q])) {
		if ($rawtx_q == ''){
			echo json_encode(["status" => "error", "message" => "MISSING_PARAM_RAWTX"], JSON_PRETTY_PRINT);
			exit();
		}
		$params_q = $rawtx_q;
		$params_q = '"'.$params_q.'"';
	}
	else if (array_key_exists('tx_hash', $electrum_api[$method_q])) {
		if ($tx_hash_q == ''){
			echo json_encode(["status" => "error", "message" => "MISSING_PARAM_TXHASH"], JSON_PRETTY_PRINT);
			exit();
		}
		$params_q = $tx_hash_q;
		$params_q = '"'.$params_q.'"';

		//extra electrumx parameter https://bitcoin.stackexchange.com/questions/75854/requesting-for-verbose-output-from-electrumx
		//{"method":"blockchain.transaction.get","id":0,"params":["fc992bd10bbcbd54ee2279de497ad4bd49ce6a64c27f2a2d3293f761d2a5a3a3","verbose":true]}
		if ($verbose_q == 'true')
			$params_q = $params_q . ', "verbose": true"';


	}

	


	//explode server_q to arr and get host and port for electrumx server
	$server_arr = (explode(":",$server_q));

	//echo '$server_arr: ' . $server_arr[0];	//host
	//echo '$server_arr: ' . $server_arr[1];	//port

	$host = $server_arr[0];
	$port = $server_arr[1];


	// Defining host, port, and timeout
	//$host = 'electrumx-four.artbyte.live';
	///$port = 50012;
	$timeout = 30;
	 
	// Setting context options
	$context = stream_context_create();
	stream_context_set_option($context, 'ssl', 'allow_self_signed', true);
	stream_context_set_option($context, 'ssl', 'verify_peer_name', false);
	 

		$query='{"id": "aby", "jsonrpc":"2.0", "method": "'.$method_q.'", "params":['.$params_q.']}';

		//exit($query);
		//$query='{"id": "aby", "jsonrpc":"2.0", "method": "server.version"}';
		//$query='{"id": "aby", "jsonrpc":"2.0", "method": "blockchain.scripthash.get_balance", "params":["f2c773074a10d44ee5f9d196d9f7bf5da8d173e4a608aa3e752ec35b8be286c9"]}';

		//echo json_encode($query, JSON_PRETTY_PRINT);
		//exit();


	//http://127.0.0.1:9998/api?method=blockchain.transaction.broadcast&params=01000000d4ee236401dfa539e1a6e4068d12bd139fa8be7f3b52809cfc9f6c926ef650a7ceb0e9a0b6010000006b48304502210097e7c9df1d18241d84d860028f29bf5ed968631bdecafb5be941dfcf3d9b72e9022031d3635317923ef0e6eb56e0f4b4387573249a793906098a99fc5e787426cf10012102f84c509cb39a48c78128b43e0f9f19530ed1f570825bdf7971534339fcf98648feffffff0100080992020000001976a914f13a01323358363dc9963567fe63bc4f9bb3d0d688ac00000000

	//$query='{"id": "aby", "method": "blockchain.transaction.broadcast", "params":["5"]}';


	//echo json_encode('ssl://'.$host.':'.$port, JSON_PRETTY_PRINT);
	//exit();

	//Connect to ElectrumX server
	if ($socket = stream_socket_client('ssl://'.$host.':'.$port, $errno, $errstr, 30, STREAM_CLIENT_CONNECT, $context)) {




		//**CHECK IF the method is supported by ElectrumX
		//https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-transaction-broadcast
		//https://www.geeksforgeeks.org/multidimensional-arrays-in-php/
		/*$accepted_methods_params = [
			'blockchain.info' => '',
			'blockchain.scripthash.get_balance' => ['scripthash'],
			'blockchain.scripthash.get_history' => ['scripthash'],
			'blockchain.scripthash.get_mempool' => ['scripthash'],
			'blockchain.scripthash.listunspent' => ['scripthash'],	//https://api.mbc.wiki/?method=blockchain.address.utxo&params[]=Mbb18MGUuDPnPp2oaAvjACiJzbdndxJ58b&params[]=1000
			'blockchain.transaction.broadcast' => ['rawtx'],	
			'blockchain.transaction.get' => ['tx_hash, verbose'],
			'server.banner' => [''],	
			'server.features' => [''],	
			'server.version' => [''],	
		];*/


/*
	//print_r( $electrum_api['blockchain.info']);

	print_r("\n\r\n\r");
	//if (in_array("blockchain.info", $electrum_api))
	if (array_key_exists("blockchain.info", $electrum_api))
		echo 'blockchain.info: yes';
	else
		echo 'blockchain.info: no';

	print_r("\n\r\n\r");
	//if (in_array('scripthash', $electrum_api['blockchain.info']))
	if (array_key_exists('scripthash', $electrum_api['blockchain.info']))
		echo 'scripthash: yes';
	else
		echo 'scripthash: no';

	print_r("\n\r\n\r");

	print_r('====================');
		var_dump($electrum_api);
		exit();

		*/
		/*
		}
		*/
		/*
		$electrum_api = new ArrayObject();                                   
	    $electrum_api['arr'] = 'array data';                             
	    $electrum_api->prop = 'prop data'
	    */

		//send the query to ElectrumX 
		//$query='{"id": "aby", "method": "blockchain.transaction.broadcast", "params":["01000000d4ee236401dfa539e1a6e4068d12bd139fa8be7f3b52809cfc9f6c926ef650a7ceb0e9a0b6010000006b48304502210097e7c9df1d18241d84d860028f29bf5ed968631bdecafb5be941dfcf3d9b72e9022031d3635317923ef0e6eb56e0f4b4387573249a793906098a99fc5e787426cf10012102f84c509cb39a48c78128b43e0f9f19530ed1f570825bdf7971534339fcf98648feffffff0100080992020000001976a914f13a01323358363dc9963567fe63bc4f9bb3d0d688ac00000000"]}';
	 
	    fwrite($socket, $query."\n");
	    $value=fread($socket,10240);
	 
	    $result=json_decode($value);
	    

	    //check for errors
	    if (isset($result->error)) {
	    	$return['code'] = $result->error->code;
	    	$return['message'] = $result->error->message;
	    }
	 	$return = $result;
	    //print_r($result);
	    //var_dump($result);
	 

	    //print_r($return);
	    
	    echo json_encode($result, JSON_PRETTY_PRINT);

	    fclose($socket);
	    exit();
	} else {
		echo json_encode(["status" => "error", "message" => "§1.1: $errno - $errstr"], JSON_PRETTY_PRINT);
	   	//echo json_encode("ERROR: $errno - $errstr", JSON_PRETTY_PRINT);
	   	exit();
	}
 //catch exception
} catch(Exception $e) {
  //echo json_encode('Message: ' .$e->getMessage());
  echo json_encode(["status" => "error", "message" => "MESSAGE: §1.2: " .$e->getMessage()], JSON_PRETTY_PRINT);
  exit();
}

 //https://github.com/bitcoinjs/bitcoinjs-lib/issues/990
/*
https://github.com/checksum0/go-electrum
// Asking the server for the balance of address 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
	// 8b01df4e368ea28f8dc0423bcf7a4923e3a12d307c875e47a0cfbf90b5c39161
	// We must use scripthash of the address now as explained in ElectrumX docs
	scripthash, _ := electrum.AddressToElectrumScriptHash("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa")
	balance, err := client.GetBalance(ctx, scripthash)


	For example, the legacy Bitcoin address from the genesis block:

		1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa

		has P2PKH script:

		76a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac

		with SHA256 hash:

		6191c3b590bfcfa0475e877c302da1e323497acf3b42c08d8fa28e364edf018b

		which is sent to the server reversed as:

		8b01df4e368ea28f8dc0423bcf7a4923e3a12d307c875e47a0cfbf90b5c39161

https://learnmeabitcoin.com/tools/sha256/?string=76a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac&multiple=1&binary=true





-----------------------

?>
// "base58check address, to hex ripemd160 hash of public key";
var testInput = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
var testExpected = "62e907b15cbf27d5425399ebf6f0fb50ebb88f18";
var bytes = coinjs.base58decode(testInput);
var front = bytes.slice(1, bytes.length-4);
var ripemd160hash = Crypto.util.bytesToHex(front);
console.log('testOutput', testOutput);	//gives 62e907b15cbf27d5425399ebf6f0fb50ebb88f18


var a = Crypto.SHA256(ripemd160hash);
var b = Crypto.util.hexToBytes(a).reverse();
var c = Crypto.util.bytesToHex(b);

console.log('scripthash from address: ', c)

var address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';

var pubkeyHashScript = Crypto.util.bytesToHex( i.pubkeyHash(address).buffer);
//should generate: 76a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac
console.log('pubkeyHashScript: ', pubkeyHashScript);

var pubkeyHashScriptSHA256 = Crypto.SHA256(pubkeyHashScript);

//should generate: 6191c3b590bfcfa0475e877c302da1e323497acf3b42c08d8fa28e364edf018b
console.log('pubkeyHashScriptSHA256: ', pubkeyHashScriptSHA256);

var pubkeyHashScriptSHA256Reversed = Crypto.util.bytesToHex(Crypto.util.hexToBytes(pubkeyHashScriptSHA256).reverse());
console.log('pubkeyHashScriptSHA256Reversed: ', pubkeyHashScriptSHA256Reversed);

//should generate: 8b01df4e368ea28f8dc0423bcf7a4923e3a12d307c875e47a0cfbf90b5c39161

--------------
var hash = Crypto.SHA256(buffer, {asBytes: true});


*/
