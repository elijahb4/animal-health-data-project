<?php
$file = fopen('animal-health-data-project/database/activityData.csv', 'r');

$header = fgetcsv($file);

$dogIndex = array_search('DogID', $header);

// Array to store unique city values
$dogArray = [];

// Loop through the remaining rows
while (($data = fgetcsv($file)) !== FALSE) {
    // Get the city value
    $dog = $data[$dogIndex];

    // Add the city to the array if it's not already present
    if (!in_array($dog, $dogArray)) {
        $dogArray[] = $dog;
    }
}

// Close the file
fclose($file);

header('Content-Type: application/json');
echo json_encode($dogArray);
?>