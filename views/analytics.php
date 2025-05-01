<!DOCTYPE html>
<link rel="stylesheet" href="../css/analytics.css">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chart Dev</title>
</head>
<body>
    <div class="view-container">
        <div id=form-container>
        <form id="dataQuery">
            <div class="form-group">
                <label for="selectDog">Select Dog:</label>
                <select id="selectDog" required="yes"></select>
            </div>
            <div class="form-group">
                <label for="datePicker">Select Date:</label>
                <input type="date" id="datePicker" min="2021-01-01" max="2023-12-31" />
            </div>
            <div class="form-group">
                <label>Data Points:</label>
                <button type="button" id="expandCheckboxes">Show Options ▼</button>
                <div id="checkboxContainer"></div>
            </div>
            <div class="form-group">
                <label for="chartTypes">Chart Type:</label>
                <select id="chartTypes" class="btn" required></select>
            </div>
            <div class="form-group">
                <label for="rangeDays">Number of Days:</label>
                <input type="number" id="rangeDays" name="rangeDays" min="1" max="30" value="1" />
            </div>
            <div class="form-group">
                <label for="submit"> </label>
                <button id="submit" class="btn" type="submit">Load Chart</button>
            </div>
        </form>
        </div>
        <br />
        <div id="chart-container">
            <div id="download-button-container">
        </div>
        <canvas id="myChart" width="400" height="400"></canvas>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
        <script src="../js/getDogs.js"></script>
        <script src="../js/charts.js"></script>
    </div>
</body>
</html>