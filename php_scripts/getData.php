<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// get values from GET request
$dogID = $_GET['DogID'] ?? '';
$columns = $_GET['columns'] ?? [];
$date = $_GET['Date'] ?? '';

if (!is_array($columns)) {
    $columns = [$columns]; // ensure it's always an array
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

// filter data by DogID and date
$data = [];
while (($row = fgetcsv($file, 0, ',', '"', '\\')) !== false) {
    $matchesDog = $row[$dogId_index] === $dogID;
    // $matchesDate = $date ? ($row[$date_index] === date("d-m-Y", strtotime($date))) : true;

    $rangeDays = isset($_GET['rangeDays']) ? intval($_GET['rangeDays']) : 1;
    $startTimestamp = strtotime($date);
    $endTimestamp = strtotime("+$rangeDays days", $startTimestamp);

    list($day, $month, $year) = explode('-', $row[$date_index]);
    $rowTimestamp = strtotime("$year-$month-$day");

    $matchesDate = $date ? ($rowTimestamp >= $startTimestamp && $rowTimestamp < $endTimestamp) : true;

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