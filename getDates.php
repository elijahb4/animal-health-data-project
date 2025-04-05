<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if (!file_exists(__DIR__ . '/database/activityData.csv')) {
    die(json_encode(['error' => 'CSV file not found']));
}

$file = fopen(__DIR__ . '/database/activityData.csv', 'r');
if ($file === false) {
    die(json_encode(['error' => 'Unable to open file']));
}

$dateColumn = 2;
$minDate = null;
$maxDate = null;
$firstRow = true;
$dateArray = [];

    while (($data = fgetcsv($file, 1000, ",", '"', '\\')) !== FALSE) {
        if ($firstRow) {
            $firstRow = false;
            continue;
        }
        $datetext = $data[$dateColumn];
        if (empty($datetext)) {
            continue;
        }
        $dateTime = new DateTime($datetext);

        if ($minDate && $maxDate) {
            echo json_encode([$minDate->format('Y-m-d'), $maxDate->format('Y-m-d')]);
        } else {
            echo json_encode(['error' => 'No valid dates found']);
        }
    }

array_push($dateArray, $minDate, $maxDate);
fclose($file);
echo json_encode($dateArray);
exit();
?>