<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

// params
$dog_id = $_POST['dogId'] ?? $_GET['dog_id'] ?? 'CANINE001';
$metric = $_POST['metric'] ?? $_GET['metric'] ?? 'Calorie Burn';
$start_date = $_POST['startDate'] ?? $_GET['start_date'] ?? date('Y-m-d');
$days = $_POST['days'] ?? $_GET['days'] ?? 7;

$csv_path = '../database/activityData.csv';
$script_path = '../python/ml_predictor.py';

$command = "python \"$script_path\" \"$csv_path\" \"$dog_id\" \"$metric\" \"$start_date\" $days 2>&1"; // command building, no escaping double quotes (^" characters bug)

file_put_contents('debug_log.txt', "COMMAND: $command\n", FILE_APPEND);
$output = shell_exec($command);
file_put_contents('debug_log.txt', "OUTPUT: $output\n", FILE_APPEND);
if (!$output) {
    echo json_encode(["error" => "Python execution failed. Check if it's installed and in PATH."]); // need dat python in env variable mane
    exit;
}
echo $output;
?>