<?php
// This script reads animal health data from a CSV file,
// detects out-of-range values, and generates object-based
// notifications saved in JSON format.

// === File Paths ===
$csvFile = '../database/activityData.csv';        // Source data file
$jsonFile = '../database/notifications.json';      // Output file for notifications

$notifications = []; // List to hold all generated notifications

// === Check if the CSV exists ===
if (!file_exists($csvFile)) {
    die("CSV file not found.");
}

// === Read and Parse CSV ===
$data = array_map('str_getcsv', file($csvFile));   // Convert CSV rows to arrays
$headers = array_map('trim', $data[0]);            // Extract and clean the header row
unset($data[0]);                                   // Remove header from data rows

// === Define valid values for behaviour pattern ===
$validBehaviours = ["Normal", "Sleeping", "Walking", "Playing", "Eating"];

// === Loop through each row of data ===
foreach ($data as $row) {
    $entry = array_combine($headers, $row);        // Combine headers and row into associative array
    $dog = $entry['DogID'];                        // Dog ID for this row

    // === Format timestamp: dd/mm/yyyy or dd-mm-yyyy + hour → yyyy-mm-dd hh:mm ===
$rawDate = $entry['Date']; // e.g. "12/04/2025" or "12-04-2025"
$dateParts = preg_split('/[\/\-]/', $rawDate); // handle both "/" and "-" as separators
if (count($dateParts) === 3) {
    $formattedDate = "{$dateParts[2]}-{$dateParts[1]}-{$dateParts[0]}"; // "2025-04-12"
} else {
    $formattedDate = $rawDate; // fallback
}
$hour = str_pad($entry['Hour'], 2, '0', STR_PAD_LEFT); // Pad single digit hour with 0
$timestamp = "{$formattedDate} {$hour}:00"; // Final format: "2025-04-12 08:00"


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

// === Save All Notifications to a JSON File ===
file_put_contents($jsonFile, json_encode($notifications, JSON_PRETTY_PRINT));

// === Output JSON Response (for testing/debug) ===
echo json_encode([
    "status" => "done",
    "count" => count($notifications)
]);
?>
