<?php
$searchValue = 'CANINE001';

$file = fopen('animal-health-data-project/database/activityData.csv', 'r');

while (($data = fgetcsv($file)) !== FALSE) {
    if (in_array($searchValue, $data)) {
        echo($data);
    }
}

// Close the file
fclose($file);
?>
<html>
    <select name="" id="selectDog"></select>
</html>