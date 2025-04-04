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

    while (($data = fgetcsv($handle, 1000, ",", '"', '\\')) !== FALSE) {
        if ($firstRow) {
            $firstRow = false;
            continue;
        }
        $datetext = $data[$dateColumn];

        $dateTime = new DateTime($date);

        if ($minDate === null || $dateTime < $minDate) {
            $minDate = clone $dateTime;
        }
        if ($maxDate === null || $dateTime > $maxDate) {
            $maxDate = clone $dateTime;
        }
    }

array_push($dateArray, $minDate, $maxDate);
fclose($file);
echo json_encode($dateArray);
exit();
?>