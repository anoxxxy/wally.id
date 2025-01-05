<?php
//https://electrumx.readthedocs.io/en/latest/protocol-methods.html
//sudo php -S 127.0.0.1:80
 header("Access-Control-Allow-Origin: *");	//allow cross origin

/*

testing purpose
https://wally.id/api/x.php?protocol=ssl&asset=lynx&server=electrum6.getlynx.io:50002&method=server.version


https://wally.id/api/x.php?asset=blk&method=blockchain.transaction.broadcast&server= electrum3.blackcoin.nl:30001&rawtx=0100000009bd7567015b8735409d4af030c13652c206c24ec22b62b969c7a275c118c4bbbad76a13c7000000006a473044022045d2f687e287da828e318489e7feb0fcfc711d06047fb23770f43d217832c46802205214bb88377ab8a200fe7c0328dc9fa91baacb4c4ecddfadaa1d2b077e0de90b012102376131a80c492b46185d204483fc51868b78eb75785325d970f7dc1bfac9e273feffffff01606b4111000000001976a914ae0bbccf7708a7b787636221fb0298cb257377d988ac00000000&protocol=tcp


https://wally.id/api/x.php?asset=blk&protocol=tcp&method=blockchain.transaction.broadcast&server=pink-one.ewm-cx.net:50001&rawtx=01000000be9675670150b2357ed42a9720ffe4dccd333168280487066a3d150452bf26138157458107000000006b48304502210084fd326570bca3d2ce67d7c9069d0b3c8abae014b5d0a03f0f4588de5d00553302202021130ea194bad856727713907ebd1bb761382fab10e584c2e0bc3fd2df011d01210228a8ef33edf5cdda6084a7621fff79617a1015cc33435c7128f767f58289adc0feffffff02001a7118020000001976a91490bd96857e2dd847bd20f5543ea6f05b9b374cb688ac80457c3b000000001976a91490bd96857e2dd847bd20f5543ea6f05b9b374cb688ac00000000


https://wally.id/api/x.php?protocol=tcp&asset=btc&method=blockchain.scripthash.get_balance&scripthash=172f32b9d06940cc8caa794bfc6471fda750d0ed3f2ec6e0fbfa7b19ab88b433&server=api.ordimint.com:50001

https://wally.id/api/x.php?protocol=tcp&asset=btc&method=blockchain.scripthash.get_balance&scripthash=9ac16650dce17e4b9784ade9c16182f9dca17c160db7002a98168a1dd22fe688,172f32b9d06940cc8caa794bfc6471fda750d0ed3f2ec6e0fbfa7b19ab88b433&server=api.ordimint.com:50001

https://wally.id/api/x.php?protocol=tcp&asset=btc&method=blockchain.scripthash.get_balance&scripthash=9ac16650dce17e4b9784ade9c16182f9dca17c160db7002a98168a1dd22fe688,568765642978f5defb83a95ab7c668931a1d2c43ece17189ec7c0cc7e69d5bfd,8cacf06d3d440486b9320091e80339c4ee2f986a003b28c7cb143400ecc454cd,4e7b15dfef036a8a5e57cc0fb6ac63ac02a755a2dcb398e4ecc2efbda66d11a5,1dedb7f6753a66eef5e79ef6f4e76559c8cf21953bf107384ecfa64d572329d9,f3582fb03e1e4d7ad3d080da7706ea988aa1fea0c0e9110529d356d08f1c11e4,6197a3b6b5083019eb1d5a96653c9bd8725a7f81271e5312e662c1ffd318d94f,a72b333cabd2aed0c9cbcac8362c3dbb3b06704fc802f6c9dc2f7c063012e488,10673a8caca82116d0e459ff67f9b2c528187da4a25c105489056a7fa787a028,172f32b9d06940cc8caa794bfc6471fda750d0ed3f2ec6e0fbfa7b19ab88b433&server=api.ordimint.com:50001

http://localhost/php/x.php?asset=blk&protocol=tcp&method=blockchain.transaction.broadcast&server=electrum3.blackcoin.nl:30001&rawtx=02000000026e01703b7f3157924fc9b59c3a53aef601e718264d24fc8f1c209eeeed2039f8000000006b483045022100aee570c41b6119f9ddee6ff116e96e242ee6a58ac14ad8fccbda18bd12bd5ec702200ced803fdce03dbab512dc8cfb0e937633d4bb9cb51ad71df91eb1ddf49c52e3012102376131a80c492b46185d204483fc51868b78eb75785325d970f7dc1bfac9e273feffffff5b5e534a5c1451bc81a4e1d3b3d8207b97b661654857f577481fe760bcc22631000000006b483045022100cea47c0bd87dceb77ce9e7fa8ae24cd434a39a38cd421a834a27a8fce4da539202200858507e73367a3e5be3f0f60bcf829c36bfeaa8344fe709c0b50d51d4acb70b012102376131a80c492b46185d204483fc51868b78eb75785325d970f7dc1bfac9e273feffffff01c0aeda4c000000001976a914ae0bbccf7708a7b787636221fb0298cb257377d988ac00000000



https://wally.id/api/x.php?protocol=tcp&asset=btc&method=blockchain.scripthash.get_balance&scripthash=9ac16650dce17e4b9784ade9c16182f9dca17c160db7002a98168a1dd22fe688,568765642978f5defb83a95ab7c668931a1d2c43ece17189ec7c0cc7e69d5bfd,8cacf06d3d440486b9320091e80339c4ee2f986a003b28c7cb143400ecc454cd,4e7b15dfef036a8a5e57cc0fb6ac63ac02a755a2dcb398e4ecc2efbda66d11a5,1dedb7f6753a66eef5e79ef6f4e76559c8cf21953bf107384ecfa64d572329d9,f3582fb03e1e4d7ad3d080da7706ea988aa1fea0c0e9110529d356d08f1c11e4,6197a3b6b5083019eb1d5a96653c9bd8725a7f81271e5312e662c1ffd318d94f,a72b333cabd2aed0c9cbcac8362c3dbb3b06704fc802f6c9dc2f7c063012e488,10673a8caca82116d0e459ff67f9b2c528187da4a25c105489056a7fa787a028,172f32b9d06940cc8caa794bfc6471fda750d0ed3f2ec6e0fbfa7b19ab88b433&server=api.ordimint.com:50001

*/
/*
https://docs.komodoplatform.com/mmV1/coin-integration/electrum-servers-list.html#updated-list-from-the-coins-repository

https://stats.kmd.io/atomicdex/electrum_status/

//https://www.lampdocs.com/how-to-query-an-electrumx-server-with-php/

wally.id/api/x.php?asset=aby&method=server.version&server=electrumx-four.artbyte.live:50012

https://wally.id/api/x.php?asset=aby&method=blockchain.scripthash.get_balance&scripthash=asasasas&server=electrumx-four.artbyte.live:50012
*/



 //phpinfo();
 //exit();

	//ini_set('display_errors', 'On');
	//error_reporting(E_ALL);


/*
https://docs.komodoplatform.com/mmV1/coin-integration/electrum-servers-list.html#updated-list-from-the-coins-repository

electrumx servers list
https://stats.kmd.io/atomicdex/electrum_status/
https://1209k.com/bitcoin-eye/ele.php
*/
//return the json response
header("Content-Type: application/json;charset=utf-8");
//https://www.lampdocs.com/how-to-query-an-electrumx-server-with-php/


$appName = "Wally.id";

function outputJsonResponse($success, $status, $message) {
    $response = ["success" => $success, "status" => $status, "message" => $message];
    echo json_encode($response, JSON_PRETTY_PRINT);
    exit();
}

function validateQueryParam($paramName, $errorMessage) {
    if (!isset($_GET[$paramName]) || empty($_GET[$paramName])) {
        outputJsonResponse(false, "error", $errorMessage);
    }
}


	//default settings
	//$useSSL = true;
	$useSSL = (isset($_GET['protocol']) && $_GET['protocol'] == 'ssl') ? 'ssl' : 'tcp';

	 ///**GET & POST ) Request Parameters
	$asset_q = ( isset($_GET['asset']) ? $_GET['asset'] : '');
	$method_q = ( isset($_GET['method']) ? $_GET['method'] : '');
	
		//used for batch requests
	$total_requests = 0;

		//params for ElectrumX
	$scripthash_q = ( isset($_GET['scripthash']) ? $_GET['scripthash'] : '');
	// If $scripthash_q is not empty, split the input by commas and store in an array
	$scripthash_values = !empty($scripthash_q) ? explode(',', $scripthash_q) : array();
	// Set $total_requests to the number of elements in $scripthash_values
	$total_requests = count($scripthash_values);

	if($total_requests > 1)
		$scripthash_q = $scripthash_values[0];

	
	$rawtx_q = ( isset($_GET['rawtx']) ? trim($_GET['rawtx']) : '');
	$tx_hash_q = ( isset($_GET['tx_hash']) ? trim($_GET['tx_hash']) : '');
	$verbose_q = ( isset($_GET['verbose']) ? trim($_GET['verbose']) : '');
	$server_q = ( isset($_GET['server']) ? trim($_GET['server']) : '');
	
	$exit_q = ( isset($_GET['exit']) ? trim($_GET['exit']) : '');

	$params_q = '';	//electrumx parameter





	// if we have Missing Parameters -> Quit
	/*if (!$asset_q && $method_q && $server_q ) {
		echo json_encode(["status" => "error", "message" => "MISSING_PARAMS"], JSON_PRETTY_PRINT);
		exit();
	}
	*/
	if (empty($asset_q) || empty($method_q) || empty($server_q)) {
    outputJsonResponse(false, "error", "MISSING_PARAMS");
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
	    "mempool.get_fee_histogram" => [],
	    "server.banner" => [],
	    "server.features" => [],
	    "server.version" => [],
	);

	//exit if method doesnt exist in the query
	/*if (!array_key_exists($method_q, $electrum_api)) {
		echo json_encode(["status" => "error", "message" => "METHOD_REQUIRED"], JSON_PRETTY_PRINT);
		exit();
	}
	*/
	if (!array_key_exists($method_q, $electrum_api)) {
    outputJsonResponse(false, "error", "METHOD_REQUIRED");
	}

	//exit if required params doesnt exist in the query	
	if (array_key_exists('scripthash', $electrum_api[$method_q])) {
		if ($scripthash_q == '')
			validateQueryParam('scripthash', 'MISSING_PARAM_SCRIPTHASH');
		
		$params_q = $scripthash_q;
		$params_q = '"'.$params_q.'"';
	}else if (array_key_exists('rawtx', $electrum_api[$method_q])) {
		if ($rawtx_q == '')
			validateQueryParam('rawtx', 'MISSING_PARAM_RAWTX');
		
		$params_q = $rawtx_q;
		$params_q = '"'.$params_q.'"';
	}
	else if (array_key_exists('tx_hash', $electrum_api[$method_q])) {
		if ($tx_hash_q == '')
			validateQueryParam('tx_hash', 'MISSING_PARAM_TXHASH');
		
		$params_q = $tx_hash_q;
		$params_q = '"'.$params_q.'"';

		//extra electrumx parameter https://bitcoin.stackexchange.com/questions/75854/requesting-for-verbose-output-from-electrumx
		//{"method":"blockchain.transaction.get","id":0,"params":["fc992bd10bbcbd54ee2279de497ad4bd49ce6a64c27f2a2d3293f761d2a5a3a3","verbose":true]}
		if ($verbose_q == 'true')
			//$params_q = $params_q . ', "verbose": true';
			$params_q = $params_q . ', true';


	}
	//for all other methods
	else if (array_key_exists($method_q, $electrum_api[$method_q])) {

		$params_q = "";
		$scripthash_q = 'wally';
	}
	
	//if ($params_q != '')
		//$params_q = ', "params":['.$params_q.']';

	//explode server_q to arr and get host and port for electrumx server
	$server_arr = (explode(":",$server_q));

	$host = $server_arr[0] ?? '';
	$port = $server_arr[1] ?? '';

	//handle empty host and port
	if (empty($host) || empty($port)) {
    outputJsonResponse(false, "error", "MISSING_HOST_OR_PORT");
	}

	// Defining host, port, and timeout
	//$host = 'electrumx-four.artbyte.live';
	///$port = 50012;
	$timeoutInSeconds = 30;
	 
	
	//batch rquest
	//$query='[{"id": "'.$scripthash_q.'_", "jsonrpc":"2.0", "method": "'.$method_q.'" '.$params_q.'}, {"id": "'.$scripthash_q.'", "jsonrpc":"2.0", "method": "'.$method_q.'" '.$params_q.'}]';
	
	//single request
	/*$query='{"id": "'.$scripthash_q.'", "jsonrpc":"2.0", "method": "'.$method_q.'" '.$params_q.'}';


	//only prepare for json batch request when there is more than 1 query
	if ($total_requests>1) {
		$json_query = '';
		// Duplicate the string and create an array
		for ($i = 0; $i < $total_requests; $i++) {
		    $json_query .= $query.',';
		}

		$json_query = rtrim($json_query, ',');

		// set the query from json_output
		$json_query = '['.$json_query.']';
	}else
		$json_query = $query;
	*/
	// Define the base query structure
	//$pingQuery = '{"id": 1, "jsonrpc":"2.0", "method": "server.ping", "params": []}';
	$serverClientQuery = '{"id": 2, "jsonrpc":"2.0", "method": "server.version", "params": ["Wally.id 1.0", "1.4"]}';

	$queryTemplate = '{"id": "{{id}}", "jsonrpc":"2.0", "method": "'.$method_q.'", "params": [{{params}}]}';

	// Only prepare a JSON batch request if there is more than 1 query
	if ($total_requests > 1) {
		$queryTemplate = '{"id": "{{id}}", "jsonrpc":"2.0", "method": "'.$method_q.'", "params": ["{{params}}"]}';
	    $batch_queries = []; // Array to hold individual queries

	    // Loop through all scripthash values, skipping the first
	    for ($i = 0; $i < $total_requests; $i++) {
	        $scripthash_q = $scripthash_values[$i];
	        $batch_queries[] = str_replace(['{{id}}', '{{params}}'], [$scripthash_q, $scripthash_q], $queryTemplate);
	    }

	    // Combine all queries into a valid JSON batch array
	    $json_query = '[ ' . $serverClientQuery . ', '. implode(',', $batch_queries) . ']';
	} else {
		$scripthash_q = $scripthash_values[0] ?? 3;	//default to 3 if not set 
		$json_query = str_replace(['{{id}}', '{{params}}'], [$scripthash_q, $params_q], $queryTemplate);

		$json_query = '[ ' . $serverClientQuery . ' , '. $json_query . ']';
	}

	

	//sending batch request example
	//$query.='[{"id": "btc1", "jsonrpc":"2.0", "method": "blockchain.scripthash.listunspent" , "params":["d41073e36a5b6123efcce7214d2cea7f1502d28496fdc1b3906f1350e2bce056"]}, {"id": "btc2", "jsonrpc":"2.0", "method": "blockchain.scripthash.listunspent" , "params":["d41073e36a5b6123efcce7214d2cea7f1502d28496fdc1b3906f1350e2bce056"]}]';

	//$query='[{"id": 1, "jsonrpc":"2.0", "method": "blockchain.scripthash.get_balance", "params": ["716decbe1660861c3d93906cb1d98ee68b154fd4d23aed9783859c1271b52a9c"]}, {"id": 2, "jsonrpc":"2.0", "method": "blockchain.scripthash.get_balance", "params": ["9f23070df9a696196571f1be061059dea4076d72ee6b321aff3b749967c6f5b7"]}]';
	
	//echo json_encode($json_query, JSON_PRETTY_PRINT);
	//exit();
	
	if ( $exit_q) {
		echo json_encode($json_query, JSON_PRETTY_PRINT);
		exit();
	}
//$ echo '[{"id": 1, "method": "blockchain.scripthash.get_balance", "params": ["716decbe1660861c3d93906cb1d98ee68b154fd4d23aed9783859c1271b52a9c"]}, {"id": 2, "method": "blockchain.scripthash.get_balance", "params": ["9f23070df9a696196571f1be061059dea4076d72ee6b321aff3b749967c6f5b7"]}]' | timeout 2 openssl s_client -quiet  -connect electrum1.bluewallet.io:443 2>/dev/null

//SSL connection
// Function to handle error responses
function handleErrorResponse($message) {
    $response = [
        "success" => false,
        "status" => "error",
        "message" => $message
    ];
    echo json_encode($response, JSON_PRETTY_PRINT);
    exit();
}

// Function to connect using SSL
function connectUsingSSL($host, $port, $query, $timeoutInSeconds) {
    $context = stream_context_create();
    stream_context_set_option($context, 'ssl', 'allow_self_signed', true);
    stream_context_set_option($context, 'ssl', 'verify_peer_name', false);

    try {
        $socket = stream_socket_client('ssl://' . $host . ':' . $port, $errno, $errstr, $timeoutInSeconds, STREAM_CLIENT_CONNECT, $context);

        if ($socket) {
            fwrite($socket, $query . "\n");
            $value = fread($socket, 81920);
            fclose($socket);

            if ($value === false) {
                throw new Exception("Error reading response");
            }

            $result = json_decode($value);

            if ($result === null) {
                throw new Exception("Error decoding response");
            }

            echo json_encode($result, JSON_PRETTY_PRINT);
            exit();
        } else {
            // Check if there was an error during the SSL connection
            if ($errno) {
                handleErrorResponse("SSL 1.1 - Connection Failed: $errno - $errstr");
            } else {
                // Handle other SSL connection errors here if needed
                handleErrorResponse("SSL 1.1 - Connection Failed for an unknown reason");
            }
        }
    } catch (Exception $e) {
        handleErrorResponse("SSL 1.2: " . $e->getMessage());
    }
}


// Function to connect using TCP
function connectUsingTCP($host, $port, $query, $timeoutInSeconds) {
    try {
        $socket = stream_socket_client("tcp://{$host}:{$port}", $errno, $errstr, $timeoutInSeconds, STREAM_CLIENT_CONNECT);

        if ($socket) {
            fwrite($socket, $query . "\n");
            $value = fread($socket, 81920);
            fclose($socket);

            if ($value === false) {
                throw new Exception("Error reading response");
            }

            //echo json_encode($value, JSON_PRETTY_PRINT);
            //exit();

            $result = json_decode($value);

            if ($result === null) {
                throw new Exception("Error decoding response: " . $value);
            }

            echo json_encode($result, JSON_PRETTY_PRINT);
            exit();
        } else {
            // Check if there was an error during connection
            if ($errno) {
                $errorDetails = "Failed to connect to {$host}:{$port} - {$errstr}";
                handleErrorResponse("TCP 1.1 - Connection Failed: " . $errorDetails);
            } else {
                // Handle other connection errors here if needed
                handleErrorResponse("TCP 1.1 - Connection Failed for an unknown reason");
            }
        }
    } catch (JsonException $jsonException) {
        handleErrorResponse("TCP 1.2 JSON Exception: " . $jsonException->getMessage());
    } catch (Exception $e) {
        handleErrorResponse("TCP 1.3 Catch: " . $e->getMessage());
    }
}


try {
	if ($useSSL == 'ssl') {
	    connectUsingSSL($host, $port, $json_query, $timeoutInSeconds);
	} else {
	    connectUsingTCP($host, $port, $json_query, $timeoutInSeconds);
	}
} catch (Exception $e) {
	handleErrorResponse("Connection Error: " . $e->getMessage());
}

// If the code runs below this, something is wrong
handleErrorResponse($appName." - ERROR-1 Connection Failed");