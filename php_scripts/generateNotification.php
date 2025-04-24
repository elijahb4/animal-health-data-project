<?php
// This script reads animal health data from a CSV file,
// detects out-of-range values, and generates object-based
// notifications saved in JSON format.

// WORK TO BE DONE: - style notifications - currently hard to look at (wall of text), make them divisible and easy to see.
//                  - connect the dashboard tile that displays health alerts with your notifications - make it display like the latest few notifications dynamically.
//                          - add a link to this tile like ive done with the graphs to jump to your notification view page.
//                  - optionally, add dropdown for notification date range from current date (make sure current date is the last date in the csv file, which is 31/12/23, 
//                          do this dynamically, dont hardcode this date.)
//                  - no logic for reading notifications? cannot change status of notifications. maybe a button that dismisses one notification at a time?

error_reporting(E_ALL);
ini_set('display_errors', 1);

// === File Paths ===
$csvFile = '../database/activityData.csv';        // Source data file
$jsonFile = '../database/notifications.json';     // Output file for notifications

$notifications = [];

// === Check if the CSV exists ===
if (!file_exists($csvFile)) {
    die("CSV file not found.");
}

// === Read and Parse CSV ===
$data = array_map('str_getcsv', file($csvFile));
$headers = array_map('trim', $data[0]);
unset($data[0]); // Remove header

$validBehaviours = ["Normal", "Sleeping", "Walking", "Playing", "Eating"];

// === Step 2: Dynamically find the latest timestamp in the data ===
$latestTimestamp = null;

foreach ($data as $row) {
    $entry = array_combine($headers, $row);
    $rawDate = $entry['Date'];
    $dateParts = preg_split('/[\/\-]/', $rawDate);
    if (count($dateParts) === 3) {
        $formattedDate = "{$dateParts[2]}-{$dateParts[1]}-{$dateParts[0]}";
    } else {
        continue;
    }
    $hour = str_pad($entry['Hour'], 2, '0', STR_PAD_LEFT);
    $timestampStr = "{$formattedDate} {$hour}:00";

    $dt = DateTime::createFromFormat('Y-m-d H:i', $timestampStr);
    if ($dt && ($latestTimestamp === null || $dt > $latestTimestamp)) {
        $latestTimestamp = $dt;
    }
}

if (!$latestTimestamp) {
    die("No valid timestamps found in CSV.");
}

$cutoff = (clone $latestTimestamp)->modify('-7 days');

// === Step 3: Main loop to generate notifications ===
foreach ($data as $row) {
    $entry = array_combine($headers, $row);
    $dog = $entry['DogID'];

    // Format timestamp
    $rawDate = $entry['Date'];
    $dateParts = preg_split('/[\/\-]/', $rawDate);
    if (count($dateParts) === 3) {
        $formattedDate = "{$dateParts[2]}-{$dateParts[1]}-{$dateParts[0]}";
    } else {
        $formattedDate = $rawDate;
    }
    $hour = str_pad($entry['Hour'], 2, '0', STR_PAD_LEFT);
    $timestamp = "{$formattedDate} {$hour}:00";

    // ✅ Step 4: Dynamic filter
    $notificationTime = DateTime::createFromFormat('Y-m-d H:i', $timestamp);
    if (!$notificationTime || $notificationTime < $cutoff) {
        continue;
    }

    // === HEART RATE CHECK ===
    if (isset($entry['Heart Rate (bpm)']) && is_numeric($entry['Heart Rate (bpm)'])) {
        $rate = (float)$entry['Heart Rate (bpm)'];
        if ($rate < 60 || $rate > 130) {
            $notifications[] = [
                "title" => "Abnormal Heart Rate",
                "dog" => $dog,
                "read" => false,
                "datetime" => $timestamp,
                "timestamp" => $timestamp,
                "reason" => "Heart Rate = {$rate}, expected 60–130 bpm"
            ];
        }
    }

    // === CALORIE BURN CHECK ===
    if (isset($entry['Calorie Burn']) && is_numeric($entry['Calorie Burn'])) {
        $cal = (float)$entry['Calorie Burn'];
        if ($cal > 250) {
            $notifications[] = [
                "title" => "Unusual Calorie Burn",
                "dog" => $dog,
                "read" => false,
                "datetime" => $timestamp,
                "timestamp" => $timestamp,
                "reason" => "Calorie Burn = {$cal}, expected ≤ 250"
            ];
        }
    }

    // === INACTIVITY CHECK ===
    if (isset($entry['Activity Level (steps)']) && (int)$entry['Activity Level (steps)'] == 0) {
        $notifications[] = [
            "title" => "Inactivity Detected",
            "dog" => $dog,
            "read" => false,
            "datetime" => $timestamp,
            "timestamp" => $timestamp,
            "reason" => "Activity Level is 0 steps"
        ];
    }

    // === TEMPERATURE CHECK ===
    if (isset($entry['Temperature (C)']) && is_numeric($entry['Temperature (C)'])) {
        $temp = (float)$entry['Temperature (C)'];
        if ($temp < 20 || $temp > 35) {
            $notifications[] = [
                "title" => "Abnormal Temperature",
                "dog" => $dog,
                "read" => false,
                "datetime" => $timestamp,
                "timestamp" => $timestamp,
                "reason" => "Temperature = {$temp}°C, expected 20–35°C"
            ];
        }
    }

    // === BREATHING RATE CHECK ===
    if (isset($entry['Breathing Rate (breaths/min)']) && is_numeric($entry['Breathing Rate (breaths/min)'])) {
        $breath = (float)$entry['Breathing Rate (breaths/min)'];
        if ($breath < 12 || $breath > 30) {
            $notifications[] = [
                "title" => "Abnormal Breathing Rate",
                "dog" => $dog,
                "read" => false,
                "datetime" => $timestamp,
                "timestamp" => $timestamp,
                "reason" => "Breathing Rate = {$breath}, expected 12–30 breaths/min"
            ];
        }
    }

    // === NO FOOD INTAKE CHECK ===
    if (isset($entry['Food Intake (calories)']) && is_numeric($entry['Food Intake (calories)']) && (float)$entry['Food Intake (calories)'] == 0) {
        $notifications[] = [
            "title" => "No Food Intake",
            "dog" => $dog,
            "read" => false,
            "datetime" => $timestamp,
            "timestamp" => $timestamp,
            "reason" => "Food Intake = 0 calories"
        ];
    }

    // === NO WATER INTAKE CHECK ===
    if (isset($entry['Water Intake (ml)']) && is_numeric($entry['Water Intake (ml)']) && (float)$entry['Water Intake (ml)'] == 0) {
        $notifications[] = [
            "title" => "No Water Intake",
            "dog" => $dog,
            "read" => false,
            "datetime" => $timestamp,
            "timestamp" => $timestamp,
            "reason" => "Water Intake = 0 ml"
        ];
    }

    // === UNUSUAL BEHAVIOUR CHECK ===
    if (isset($entry['Behaviour Pattern']) && !in_array(trim($entry['Behaviour Pattern']), $validBehaviours)) {
        $notifications[] = [
            "title" => "Unusual Behaviour Pattern",
            "dog" => $dog,
            "read" => false,
            "datetime" => $timestamp,
            "timestamp" => $timestamp,
            "reason" => "Unexpected behaviour: '{$entry['Behaviour Pattern']}'"
        ];
    }
}
 
// Sort notifications by timestamp (newest first)
usort($notifications, function ($a, $b) {
    return strtotime($b['timestamp']) - strtotime($a['timestamp']);
});

// === Save to JSON ===
file_put_contents($jsonFile, json_encode($notifications, JSON_PRETTY_PRINT));

// === Response ===
echo json_encode([
    "status" => "done",
    "count" => count($notifications)
]);
?>
