<?php
// Function to fetch and filter Komodo data
function fetchAndFilterKomodoData() {
    $currentTimestamp = time(); // Get the current timestamp
    $apiUrl = "https://electrum-status.dragonhound.info/api/v1/electrums_status?_={$currentTimestamp}";

    try {
        // Fetch the data from the API
        $response = file_get_contents($apiUrl);

        if ($response === FALSE) {
            throw new Exception("HTTP error! Unable to fetch data.");
        }

        // Decode the JSON response
        $data = json_decode($response, true);

        // Filter the data
        $filteredData = array_filter($data, function ($item) {
            return $item['category'] === "Electrum" &&
                ($item['protocol'] === "TCP" || $item['protocol'] === "SSL") &&
                $item['result'] === "Passed" &&
                strpos($item['coin'], '-') === false; // Exclude coins with a '-' in their name
        });

        // Re-index the array after filtering
        $filteredData = array_values($filteredData);

        // Output the filtered data
        //echo "Filtered Data: <pre>" . print_r($filteredData, true) . "</pre>";

        // Export the filtered data as a JSON file
        exportToJsonFile($filteredData, "komodo_filtered_data.json");

    } catch (Exception $e) {
        echo "Error fetching or processing data: " . $e->getMessage();
    }
}

// Function to export JSON data to a file
function exportToJsonFile($data, $filename) {
    // Encode the data into a JSON string with nice formatting
    $jsonData = json_encode($data, JSON_PRETTY_PRINT);

    // Write the JSON data to a file
    file_put_contents($filename, $jsonData);

    echo "Data successfully exported to {$filename}.";
}

// Call the function to fetch and filter data
fetchAndFilterKomodoData();
?>
