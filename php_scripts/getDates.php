<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

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

$dateColumn = 2;
$minDate = null;
$maxDate = null;
$firstRow = true;

while (($data = fgetcsv($file, 1000, ",", '"', '\\')) !== false) {
    if ($firstRow) {
        $firstRow = false;
        continue;
    }

    $dateText = $data[$dateColumn] ?? '';
    if (empty($dateText)) continue;

    try {
        $date = new DateTime($dateText);
        if (is_null($minDate) || $date < $minDate) {
            $minDate = $date;
        }
        if (is_null($maxDate) || $date > $maxDate) {
            $maxDate = $date;
        }
    } catch (Exception $e) {
        continue;
    }
}

fclose($file);

if ($minDate && $maxDate) {
    echo json_encode([
        'minDate' => $minDate->format('d-m-Y'),
        'maxDate' => $maxDate->format('d-m-Y')
    ]);
} else {
    echo json_encode(['error' => 'No valid dates found']);
}
exit();
?>
