<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// get values from GET request
$dogID = $_GET['DogID'] ?? 'ALL'; // ALL
$date = $_GET['Date'] ?? '';
$columns = $_GET['columns'] ?? [];

if (!is_array($columns)) {
    $columns = [$columns]; // ensure its always an array
}

// file path
$csvPath = __DIR__ . '/../database/activityData.csv';

if (!file_exists($csvPath)) {
    echo json_encode(['error' => 'CSV file not found']);
    exit();
}

$file = fopen($csvPath, 'r');
if ($file === false) {
    echo json_encode(['error' => 'Unable to open file']);
    exit();
}

// get headers
$header = fgetcsv($file, 0, ',', '"', '\\');
if ($header === false) {
    echo json_encode(['error' => 'Invalid CSV format']);
    exit();
}

// map requested column names to their indexes
$column_indexes = [];
$dogId_index = array_search('DogID', $header);
$date_index = array_search('Date', $header);
$hour_index = array_search('Hour', $header);

foreach ($columns as $column) {
    $index = array_search($column, $header);
    if ($index !== false) {
        $column_indexes[$column] = $index;
    }
}

// grab rangeDays and convert date format
$rangeDays = isset($_GET['rangeDays']) ? intval($_GET['rangeDays']) : 1;
$startTimestamp = strtotime($date);
$endTimestamp = strtotime("+$rangeDays days", $startTimestamp);
// filter data
$data = [];
while (($row = fgetcsv($file, 0, ',', '"', '\\')) !== false) {
    $rowDogId = $row[$dogId_index];
    $rowDateRaw = $row[$date_index]; // expect dd-mm-yyyy format

    // convert to timestamp
    list($day, $month, $year) = explode('-', $rowDateRaw);
    $rowTimestamp = strtotime("$year-$month-$day");

    $matchesDog = ($dogID === 'ALL' || $rowDogId === $dogID);
    $matchesDate = ($rowTimestamp >= $startTimestamp && $rowTimestamp < $endTimestamp);

    if ($matchesDog && $matchesDate) {
        $filtered_row = [];

        foreach ($column_indexes as $column => $index) {
            $filtered_row[$column] = $row[$index];
        }

        if ($hour_index !== false) {
            $filtered_row['Hour'] = $row[$hour_index];
        }

        $data[] = $filtered_row;
    }
}

fclose($file);
echo json_encode($data);
exit();
?>