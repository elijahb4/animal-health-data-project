<?php
$query = $_GET['q'] ?? '';

$results = [];

if ($query) {
    $escapedQuery = escapeshellarg($query);
    $cmd = "python3 ../python/search.py $escapedQuery $escapedColumn";
    $json = shell_exec($cmd);
    $results = json_decode($json, true) ?? [];
}

include __DIR__ . '/../views/search_views.php';
?>