<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$columnId = $_GET['columnId'];
$columns = json_decode($_GET['columns']);

if (!file_exists(__DIR__ . '/database/activityData.csv')) {
    header('Content-Type: application/json');
    die(json_encode(['error' => 'CSV file not found']));
}

$file = fopen(__DIR__ . '/database/activityData.csv', 'r');
if ($file === false) {
    header('Content-Type: application/json');
    die(json_encode(['error' => 'Unable to open file']));
}

$header = fgetcsv($file, 0, ',', '"', '\\');
if ($header === false) {
    header('Content-Type: application/json');
    die(json_encode(['error' => 'Invalid CSV format']));
}

$column_indexes = [];
foreach ($columns as $column) {
    $index = array_search($column, $header);
    if ($index !== false) {
        $column_indexes[$column] = $index;
    }
}

$data = [];

while (($row = fgetcsv($file, 0, ',', '"', '\\')) !== FALSE) {
    $filtered_row = [];
    foreach ($column_indexes as $column => $index) {
        $filtered_row[$column] = $row[$index];
    }
    $data[] = $filtered_row;
}

fclose($file);
echo json_encode($data);
exit();