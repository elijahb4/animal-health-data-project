<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if (!file_exists(__DIR__ . '/../database/activityData.csv')) {
    die(json_encode(['error' => 'CSV file not found']));
}

$file = fopen(__DIR__ . '/../database/activityData.csv', 'r');
if ($file === false) {
    die(json_encode(['error' => 'Unable to open file']));
}

$header = fgetcsv($file, 0, ',', '"', '\\');
if ($header === false) {
    die(json_encode(['error' => 'Invalid CSV format']));
}

fclose($file);
echo json_encode($header);
exit();
?>
