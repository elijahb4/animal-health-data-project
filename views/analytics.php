<!DOCTYPE html>
<link rel="stylesheet" href="/../css/analytics.css">
<div class="dashboard-container">
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chart Dev</title>
</head>
<body>
    <form id="dataQuery">
        <select id="selectDog" required></select>
        <input type="date" id="datePicker" min="2021-01-01" max="2023-12-31" />
        <div id="checkboxContainer"></div>
        <select id="chartTypes" required></select>
      
        <label for="rangeDays">Number of Days:</label>
        <input type="number" id="rangeDays" name="rangeDays" min="1" max="30" value="1" />
      
        <button type="submit">Load Chart</button>
      </form>
      
    <canvas id="myChart" width="400" height="400"></canvas>
    <script src="/../js/getDogs.js"></script>
    <script src="/../js/charts.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js"></script>
</div>
</body>
</html>