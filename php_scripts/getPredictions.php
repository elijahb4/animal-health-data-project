<?php
$dog_id = $_POST['dogId'] ?? $_GET['dog_id'] ?? 'CANINE001';
$metric = $_POST['metric'] ?? $_GET['metric'] ?? 'Calorie Burn';
$start_date = $_POST['startDate'] ?? $_GET['start_date'] ?? date('Y-m-d');
$days = $_POST['days'] ?? $_GET['days'] ?? 7;

$csv_path = '../database/activityData.csv';
$script_path = '../python/ml_predictor.py';

$command = "python \"$script_path\" \"$csv_path\" \"$dog_id\" \"$metric\" \"$start_date\" $days 2>&1";

// debug log
file_put_contents('debug_log.txt', "COMMAND: $command\n", FILE_APPEND);
$output = shell_exec($command);
file_put_contents('debug_log.txt', "OUTPUT:\n$output\n", FILE_APPEND);

if (!$output || trim($output) === "") {
    http_response_code(500);
    echo json_encode(["error" => "Python ran but returned nothing. Check script for errors."]);
    exit;
}

// try decode
$json = json_decode($output, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode(["error" => "Python returned invalid JSON.", "raw" => $output]);
    exit;
}

echo json_encode($json);
?>