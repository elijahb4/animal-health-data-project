<!DOCTYPE html>
<head>
    <title>CSV Table Viewer</title>
    <link rel="stylesheet" href="/../css/records.css">
</head>
<body>
<div class="view-container">
    <div class="card">
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
                <label for="rangeDays">Number of Days:</label>
                <input type="number" id="rangeDays" name="rangeDays" min="1" max="30" value="1" />
            </div>
            <div class="form-group">
            <label for="submit"><br /></label>
                <button id="submit" class="btn" type="submit">View Records</button>
            </div>
            </form>
        <br />
        <div id="chart-container">
            <div id="download-button-container">
        </div>
        <br />
        <div id="data-container">
            <table id="csvTable"></table>
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jspdf-autotable@3.5.28/dist/jspdf.plugin.autotable.min.js"></script>
<script src="/../js/records.js"></script>
</body>
</html>
