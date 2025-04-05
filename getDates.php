<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

function writeLog($message) {
    $logFile = __DIR__ . '/debug.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

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

while (($data = fgetcsv($file, 1000, ",", '"', '\\')) !== false) {
    if ($firstRow) {
        writeLog("Header row: " . implode(',', $data));
        $firstRow = false;
        continue;
    }
    writeLog("Processing row: " . implode(',', $data));
    $datetext = $data[$dateColumn] ?? null;
    if (empty($datetext)) {
        continue;
    }
    $currentDate = DateTime::createFromFormat('d-m-Y', $datetext);
    if ($currentDate === false) {
        continue;
    }
    if ($minDate === null || $currentDate < $minDate) {
        $minDate = $currentDate;
    }
    if ($maxDate === null || $currentDate > $maxDate) {
        $maxDate = $currentDate;
    }
}

if ($minDate && $maxDate) {
    echo json_encode([
        'minDate' => $minDate->format('d-m-Y'),
        'maxDate' => $maxDate->format('d-m-Y')
    ]);
} else {
    echo json_encode(['error' => 'No valid dates found']);
}
fclose($file);
exit();
?>