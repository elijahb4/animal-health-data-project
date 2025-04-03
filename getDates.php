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

$dateColumn = 'Date';
$minDate = null;
$maxDate = null;

    while (($data = fgetcsv($file, 1000, ",")) !== FALSE) {
        $date = $data[$dateColumn];

        $dateTime = new DateTime($date);

        if ($minDate === null || $dateTime < $minDate) {
            $minDate = clone $dateTime;
        }
        if ($maxDate === null || $dateTime > $maxDate) {
            $maxDate = clone $dateTime;
        }
    }

fclose($file);
echo json_encode($header);
exit();
?>