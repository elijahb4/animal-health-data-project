<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Get values from GET request
$dogID = $_GET['DogID'] ?? '';
$columns = $_GET['columns'] ?? [];

if (!is_array($columns)) {
    $columns = [$columns]; // Ensure it's always an array
}

// File path
$csvPath = __DIR__ . '/database/activityData.csv';

if (!file_exists($csvPath)) {
    echo json_encode(['error' => 'CSV file not found']);
    exit();
}

$file = fopen($csvPath, 'r');
if ($file === false) {
    echo json_encode(['error' => 'Unable to open file']);
    exit();
}

// Get headers
$header = fgetcsv($file, 0, ',', '"', '\\');
if ($header === false) {
    echo json_encode(['error' => 'Invalid CSV format']);
    exit();
}

// Map requested column names to their indexes
$column_indexes = [];
$dogId_index = array_search('DogID', $header);

foreach ($columns as $column) {
    $index = array_search($column, $header);
    if ($index !== false) {
        $column_indexes[$column] = $index;
    }
}

// Filter data by DogID and selected columns
$data = [];

while (($row = fgetcsv($file, 0, ',', '"', '\\')) !== false) {
    if ($row[$dogId_index] === $dogID) {
        $filtered_row = [];
        foreach ($column_indexes as $column => $index) {
            $filtered_row[$column] = $row[$index];
        }
        // Always include Hour if available
        $hourIndex = array_search('Hour', $header);
        if ($hourIndex !== false) {
            $filtered_row['Hour'] = $row[$hourIndex];
        }
        $data[] = $filtered_row;
    }
}

fclose($file);
echo json_encode($data);
exit();
?>