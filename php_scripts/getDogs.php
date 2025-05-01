<?php
header('Content-Type: application/json');
header('Cache-Control: no-cache');

if (!file_exists(__DIR__ . '../database/activityData.csv')) {
    header('Content-Type: application/json');
    die(json_encode(['error' => 'CSV file not found']));
}

$file = fopen(__DIR__ . '../database/activityData.csv', 'r');
if ($file === false) {
    header('Content-Type: application/json');
    die(json_encode(['error' => 'Unable to open file']));
}

$header = fgetcsv($file, 1000, ",", '"', "\\"); // error: the $escape parameter must be provided... (PHP 8+ requires it explicitly now apparently?)
if ($header === false) {
    header('Content-Type: application/json');
    die(json_encode(['error' => 'Invalid CSV format']));
}

$dogIndex = -1;
foreach ($header as $index => $column) {
    if ($column === 'DogID') {
        $dogIndex = $index;
        break;
    }
}

if ($dogIndex === -1) {
    header('Content-Type: application/json');
    die(json_encode(['error' => 'DogID column not found']));
}

$dogArray = [];

while (($data = fgetcsv($file, 0, ",", '"', "\\")) !== FALSE) {
    if (isset($data[$dogIndex])) {
        $dog = $data[$dogIndex];
        $found = false;
        foreach ($dogArray as $existingDog) {
            if ($existingDog === $dog) {
                $found = true;
                break;
            }
        }
        if (!$found) {
            $dogArray[] = $dog;
        }
    }
}

fclose($file);

while (ob_get_level()) {
    ob_end_clean();
}

$json = json_encode($dogArray);
if ($json === false) {
    die(json_encode(['error' => 'JSON encoding failed: ' . json_last_error_msg()]));
}
echo $json;
exit();
?>
