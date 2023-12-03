<?php
//sudo php -S 127.0.0.1:80
 header("Access-Control-Allow-Origin: *");	//allow cross origin

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
	$useSSL = true;
	$useSSL = ( isset($_GET['ssl']) ? true : false);

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

	
	$rawtx_q = ( isset($_GET['rawtx']) ? $_GET['rawtx'] : '');
	$tx_hash_q = ( isset($_GET['tx_hash']) ? $_GET['tx_hash'] : '');
	$verbose_q = ( isset($_GET['verbose']) ? $_GET['verbose'] : '');
	$server_q = ( isset($_GET['server']) ? $_GET['server'] : '');
	
	$exit_q = ( isset($_GET['exit']) ? $_GET['exit'] : '');

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
	
	if ($params_q != '')
		$params_q = ', "params":['.$params_q.']';

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
	$query='{"id": "'.$scripthash_q.'", "jsonrpc":"2.0", "method": "'.$method_q.'" '.$params_q.'}';

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
                throw new Exception("Error decoding response");
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
	if ($useSSL) {
	    connectUsingSSL($host, $port, $json_query, $timeoutInSeconds);
	} else {
	    connectUsingTCP($host, $port, $json_query, $timeoutInSeconds);
	}
} catch (Exception $e) {
	handleErrorResponse("Connection Error: " . $e->getMessage());
}

// If the code runs below this, something is wrong
handleErrorResponse("ERROR-1 Connection Failed");