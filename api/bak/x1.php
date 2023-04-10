<?php
//return the json response
header("Content-Type: application/json;charset=utf-8");
//https://www.lampdocs.com/how-to-query-an-electrumx-server-with-php/
 
// Defining host, port, and timeout
$host = 'electrumx-four.artbyte.live';
$port = 50012;
$timeout = 30;
 
// Setting context options
$context = stream_context_create();
stream_context_set_option($context, 'ssl', 'allow_self_signed', true);
stream_context_set_option($context, 'ssl', 'verify_peer_name', false);
 
// JSON query for fee estimation in 5 blocks
//$query='{"id": "aby", "method": "blockchain.transaction.broadcast", "params":["5"]}';
$query='{"id": "aby", "method": "blockchain.transaction.broadcast", "params":["01000000d4ee236401dfa539e1a6e4068d12bd139fa8be7f3b52809cfc9f6c926ef650a7ceb0e9a0b6010000006b48304502210097e7c9df1d18241d84d860028f29bf5ed968631bdecafb5be941dfcf3d9b72e9022031d3635317923ef0e6eb56e0f4b4387573249a793906098a99fc5e787426cf10012102f84c509cb39a48c78128b43e0f9f19530ed1f570825bdf7971534339fcf98648feffffff0100080992020000001976a914f13a01323358363dc9963567fe63bc4f9bb3d0d688ac00000000"]}';
 
if ($socket = stream_socket_client('ssl://'.$host.':'.$port, $errno, $errstr, 30, STREAM_CLIENT_CONNECT, $context)
) {
    fwrite($socket, $query."\n");
    $value=fread($socket,10240);
 
    $result=json_decode($value);
 
    //print_r($result);
 
    echo json_encode($result, JSON_PRETTY_PRINT);
    fclose($socket);
} else {
   echo json_encode("ERROR: $errno - $errstr", JSON_PRETTY_PRINT);
}
 
?>
