<!DOCTYPE html>
<head>
    <title>CSV Table Viewer</title>
    <link rel="stylesheet" href="/../css/records.css">
</head>
<body>
<div class="dashboard-container">
    <div id="form-container">
        <form id="dataQuery">
        <div class="form-group">
            <label for="selectDog">Select Dog:</label>
            <select id="selectDog" required></select>
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
            <label for="rangeDays">Number of Days:</label>
            <input type="number" id="rangeDays" name="rangeDays" min="1" max="30" value="1" />
        </div>
        <div class="form-group">
            <button id="submit" type="submit">View Records</button>
        </div>
        </form>
    <div id="data-container">
        <table id="csvTable"></table>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
<script src="/../js/records.js"></script>
</body>
</html>
