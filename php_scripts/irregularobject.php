<?php
error_reporting(E_ALL);
ini_set('display_errors', 1); // error display

$csvFile = '../database/activityData.csv';        
$jsonFile = '../database/anomalies.json'; 

if (!file_exists($csvFile)) // checks file exists
{
    die("CSV file not found.");
}

$csvFileHandle = fopen($csvFile, 'r');  // opens file for reading

$normalRanges = [   // predefined normal ranges
    'weight' => ['min' => 7, 'max' => 27],
    'heart_rate' => ['min' => 100, 'max' => 140],
    'temperature' => ['min' => 24, 'max' => 29],
    'breathing_rate' => ['min' => 10, 'max' => 30]
];

$fieldsToCheck = [  // predefined fields to check
    'Weight (kg)' => ['key' => 'weight', 'type' => 'float'],
    'Heart Rate (bpm)' => ['key' => 'heart_rate', 'type' => 'int'],
    'Temperature (C)' => ['key' => 'temperature', 'type' => 'float'],
    'Breathing Rate (breaths/min)' => ['key' => 'breathing_rate', 'type' => 'int']
];

$headers = fgetcsv($csvFileHandle); // gets table headers

while (($row = fgetcsv($csvFileHandle)) !== false)
{
    $entry = array_combine($headers, $row); // assosiative array of headers and row values
    if (!$entry) continue;

    $outOfRange = []; // array for out of range values

    foreach ($fieldsToCheck as $csvField => $info) // foreach loop
    {
        if (isset($entry[$csvField]) && is_numeric($entry[$csvField])) // checks if entry is numeric
        {
            $value = $info['type'] === 'float' ? (float)$entry[$csvField] : (int)$entry[$csvField]; // sets value as float from entry
            $range = $normalRanges[$info['key']]; // sets $range as key of normal ranges

            if ($value < $range['min'] || $value > $range['max']) // checks value agaist range min and max
            {
                $outOfRange[$info['key']] = $value; // add vaule to out of range array
            }
        }
    }

    if (!empty($outOfRange)) //checl if out of range is not empty
    {
        $outOfRange['dog_id'] = $entry['DogID'] ?? null; // dog id
        $outOfRange['date'] = $entry['Date'] ?? null;   // date
        $outOfRange['hour'] = $entry['Hour'] ?? null;   // hour
        $anomalies[] = $outOfRange; // add to anomalies array
    }
}

fclose($csvFileHandle); // close file handle

file_put_contents($jsonFile, json_encode($anomalies, JSON_PRETTY_PRINT)); // saves anomalies to json file

echo "Anomalies saved to $jsonFile\n";  //success message for anomalies saved.

?>
