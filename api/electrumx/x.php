<?php
//return the json response
header("Content-Type: application/json;charset=utf-8");
//https://www.lampdocs.com/how-to-query-an-electrumx-server-with-php/


try {

	 ///**GET & POST ) Request Parameters
	$asset_q = ( isset($_GET['asset']) ? $_GET['asset'] : '');
	$method_q = ( isset($_GET['method']) ? $_GET['method'] : '');
		//params for ElectrumX
	$scripthash_q = ( isset($_GET['scripthash']) ? $_GET['scripthash'] : '');
	$rawtx_q = ( isset($_GET['rawtx']) ? $_GET['rawtx'] : '');
	$tx_hash_q = ( isset($_GET['tx_hash']) ? $_GET['tx_hash'] : '');
	$verbose_q = ( isset($_GET['verbose']) ? $_GET['verbose'] : '');





	// Missing Parameters, Quit
	if (!$asset || $method ) {
		echo json_encode('ERROR: MISSING_PARAMS');
		//exit();
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
	if (array_key_exists($method_q, $electrum_api))
		exit('METHOD_REQUIRED');


	//exit if required params doesnt exist in the query
	//if (array_key_exists($params_q, $electrum_api[$method_q]))
	//	exit('PARAM_REQUIRED');

	if ($electrum_api[$method_q] == 'scripthash') {
		if ($scripthash_q == ''){
			echo json_encode('ERROR: MISSING_PARAM_SCRIPTHASH');
			exit();
		}
	}else if ($electrum_api[$method_q] == 'rawtx') {
		if ($rawtx_q == ''){
			echo json_encode('ERROR: MISSING_PARAM_RAWTX');
			exit();
		}
	}
	else if ($electrum_api[$method_q] == 'tx_hash') {
		if ($tx_hash_q == ''){
			echo json_encode('ERROR: MISSING_PARAM_TXHASH');
			exit();
		}
	}



	// Defining host, port, and timeout
	$host = 'electrumx.nvc.ewmcx.org';
	$port = 50002;
	$timeout = 30;
	 
	// Setting context options
	$context = stream_context_create();
	stream_context_set_option($context, 'ssl', 'allow_self_signed', true);
	stream_context_set_option($context, 'ssl', 'verify_peer_name', false);
	 
	//http://127.0.0.1:9998/api?method=blockchain.transaction.broadcast&params=01000000d4ee236401dfa539e1a6e4068d12bd139fa8be7f3b52809cfc9f6c926ef650a7ceb0e9a0b6010000006b48304502210097e7c9df1d18241d84d860028f29bf5ed968631bdecafb5be941dfcf3d9b72e9022031d3635317923ef0e6eb56e0f4b4387573249a793906098a99fc5e787426cf10012102f84c509cb39a48c78128b43e0f9f19530ed1f570825bdf7971534339fcf98648feffffff0100080992020000001976a914f13a01323358363dc9963567fe63bc4f9bb3d0d688ac00000000

	//$query='{"id": "aby", "method": "blockchain.transaction.broadcast", "params":["5"]}';



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
		/*
		}
		*/
		/*
		$electrum_api = new ArrayObject();                                   
	    $electrum_api['arr'] = 'array data';                             
	    $electrum_api->prop = 'prop data'
	    */

/*
https://wally.id/api/x.php?asset=nvc&method=blockchain.transaction.broadcast&rawtx=0100000033c54264019b3797aaa753f7edbe8810d49c32a07df4a6e56eaf5db4d08430ea0c6de03fae010000006b483045022100dcbf99fb9341e517f7e7a402575b5a2c3d1826fa9f82b96ef2c7663efdd11033022015612126883f700fed7d48bd6a04a1a4c8ff108bce51699c880b37c599de9fcf012103d928fc52610164842551bdd92597f7b22c9a1673f63c36741e40a42f8a24d174feffffff030050d6dc010000001976a914e40ec92c5974904ad43f03a1b156bb2b6de4c9fd88ac00ca9a3b000000001976a914e40ec92c5974904ad43f03a1b156bb2b6de4c9fd88ac00ca9a3b000000001976a914e40ec92c5974904ad43f03a1b156bb2b6de4c9fd88ac00000000&server=electrumx.nvc.ewmcx.org:50002
*/
		//send the query to ElectrumX 
		$query='{"id": "nvc", "method": "blockchain.transaction.broadcast", "params":["0100000033c54264019b3797aaa753f7edbe8810d49c32a07df4a6e56eaf5db4d08430ea0c6de03fae010000006b483045022100dcbf99fb9341e517f7e7a402575b5a2c3d1826fa9f82b96ef2c7663efdd11033022015612126883f700fed7d48bd6a04a1a4c8ff108bce51699c880b37c599de9fcf012103d928fc52610164842551bdd92597f7b22c9a1673f63c36741e40a42f8a24d174feffffff030050d6dc010000001976a914e40ec92c5974904ad43f03a1b156bb2b6de4c9fd88ac00ca9a3b000000001976a914e40ec92c5974904ad43f03a1b156bb2b6de4c9fd88ac00ca9a3b000000001976a914e40ec92c5974904ad43f03a1b156bb2b6de4c9fd88ac00000000"]}';
	 


	    fwrite($socket, $query."\n");
	    $value=fread($socket,10240);
	 
	    $result=json_decode($value);

	    //check for errors
	    if (isset($result->error)) {
	    	$return['code'] = $result->error->code;
	    	$return['message'] = $result->error->message;
	    }
	 
	    //print_r($result);
	    //var_dump($result);
	 

	    //print_r($return);
	    
	    echo json_encode($return, JSON_PRETTY_PRINT);

	    fclose($socket);
	} else {
	   echo json_encode("ERROR: $errno - $errstr", JSON_PRETTY_PRINT);
	}
 //catch exception
} catch(Exception $e) {
  echo json_encode('Message: ' .$e->getMessage());
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
