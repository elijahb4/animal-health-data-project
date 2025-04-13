//AJAX function variables
let xhr = new XMLHttpRequest();
let yhr = new XMLHttpRequest();

//Varaibles (*varialbls) for html elements
const queryForm = document.getElementById("dataQuery")
const container = document.getElementById("checkboxContainer");
//const checkbox = document.getElementById("checkbox");
//const checkboxValue = checkbox.value;
const selectElement = document.getElementById('selectDog');
const ctx = document.getElementById('myChart').getContext('2d');
const chatTypes = ['bar','line','bubble','doughnut','pie','polarArea','radar','scatter'];
const chartTypeSelect = document.getElementById("chartTypes");
const datePicker = document.getElementById("datePicker");
const expandButton = document.getElementById('expandCheckboxes');
const downloadButtons = document.getElementById('download-button-container');

//General variables
let myChart = null;
let columnsToFetch = ['Hour'];
let minDate = null;
let maxDate = null;

//Event listeners
queryForm.addEventListener("submit", queryData)

//Expand/collapse the checkboxes
expandButton.addEventListener('click', () => {
    const isVisible = checkboxContainer.style.display === 'block';
    checkboxContainer.style.display = isVisible ? 'none' : 'block';
    expandButton.textContent = isVisible ? 'Show Options ▼' : 'Hide Options ▲';
});

//download chart as pdf
async function makePDF() {
    const { jsPDF } = window.jspdf;
    const chartCanvas = document.getElementById('myChart');
    const imgData = chartCanvas.toDataURL('image/png');

    const pdf = new jsPDF();

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth - 20;
    const imgHeight = (chartCanvas.height / chartCanvas.width) * imgWidth;

    const x = 10;
    const y = (pdfHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save("chart.pdf");
}

//download chart as bitmap
function downloadBitmap() {
    const chartCanvas = document.getElementById('myChart');
    const imgURL = chartCanvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = imgURL;
    link.download = 'chart.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

//Export JSON
function exportJSON(data) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chart_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

//Export CSV
function exportCSV(data) {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','), // Header row
        ...data.map(row => headers.map(field => `"${row[field]}"`).join(','))
    ];

    const csvStr = csvRows.join('\n');
    const blob = new Blob([csvStr], { type: "text/csv" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chart_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

//invoked immediately to populate the chart types
function populate_chartTypes() {
    chatTypes.forEach(chartType => {
        const option = document.createElement('option');
        option.value = chartType;
        option.textContent = chartType;
        chartTypeSelect.appendChild(option);
    })
}

//Invoked immediately (via fetchDates()) to set the range of the date picker
function setDateRange(minDate, maxDate) {
    const datePicker = document.getElementById('datePicker');
    datePicker.min = minDate;
    datePicker.max = maxDate;
    datePicker.value = maxDate; // default date is the latest entry in csv
}

//Prevents out of range searches
function addDaysToUTCDate(selectedDate, rangeDays) {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() + rangeDays);
    return date;
}

//Function invoked when form submitted to reformat dates to dd-mm-yyyy for the csv
function formatDateForCSV(queryDate) {
    const [year, month, day] = queryDate.split("-");
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
}

//Invoked via fetchDates() to format the date from the database to ISO format (They are dd-mm-yyyy in the CSV file)
function formatDateToISO(dateString) {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

//invoked immediately to fetch the min and max dates from the database
async function fetchDates() {
    try {
        const response = await fetch('/../php_scripts/getDates.php');
        const data = await response.json();

        if (data.error) {
            console.error(data.error);
            alert(data.error);
        } else {
            const minDate = formatDateToISO(data.minDate);
            const maxDate = formatDateToISO(data.maxDate);
            setDateRange(minDate, maxDate);
        }
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

//Invoked immediately to populate the select column with the headers from the database
yhr.open('GET', '/../php_scripts/getHeaders.php', true);
yhr.setRequestHeader('Accept', 'application.json')
yhr.onload = function () {
    if (yhr.readyState === yhr.DONE) {
        if (yhr.status === 200) {
        let response;
    try {
        console.log('Raw response:', yhr.responseText);
        response = JSON.parse(yhr.responseText);
        console.log(response)
        response.forEach(column => {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.gap = '6px';
            wrapper.style.marginBottom = '4px';
        
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = column.toLowerCase();
            checkbox.name = 'columns';
            checkbox.value = column;
        
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = column;
        
            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            container.appendChild(wrapper);
        });
    }
    catch (e) {
        console.error(e.message);
        console.error("Parsing Error", yhr.status);
    }
    }}     
}

//Function invoked by the event listener when user sumbits the form, it handles form input and calls the php code to get the data required
function queryData(event, minDate, maxDate) {
    event.preventDefault();
    const dogId = selectElement.value;
    const selectedDate = datePicker.value; // date thingy
    const rangeDays = document.getElementById("rangeDays").value; // day range thingy
    const endDate = addDaysToUTCDate(selectedDate, rangeDays);
    if (minDate > selectedDate || endDate > maxDate) {
        alert("Please select a date within the range provided.");
        return;
    }

    const checkedBoxes = document.querySelectorAll('input[name="columns"]:checked');

    columnsToFetch = Array.from(checkedBoxes).map(checkbox => checkbox.value);

    if (columnsToFetch.length === 0) {
        alert("Please select at least one column to display.");
        return;
    }

    const params = new URLSearchParams();
    params.append('DogID', dogId);
    params.append('Date', selectedDate);
    params.append('rangeDays', rangeDays);

    columnsToFetch.forEach(col => {
        params.append('columns[]', col);
    });

    labelKey = columnsToFetch;
    dataKey = columnsToFetch;

    xhr.open('GET', `/../php_scripts/getData.php?${params.toString()}`, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send();
}

//Function to call and handle the response from the server
xhr.onload = function () {
    if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
    try {
        console.log('Raw response:', xhr.responseText);
        const response = JSON.parse(xhr.responseText);
        console.log('Response:', response);
        console.log('Columns to fetch:', columnsToFetch);
        makeChart(ctx, response, columnsToFetch);
    }
    catch (e) {
        console.error(e.message);
        console.error("Parsing Error", xhr.status);
    }
    }}     
}

//Function to create the chart using Chart.js
function makeChart(ctx, response, columns) {
    console.log('Chart columns:', columns);
    console.log('Sample data row:', response[0]);
    if (myChart) {
        myChart.destroy();
    }

    const chartTypeValue = chartTypeSelect.value;
    console.log("Selected Chart Type:", chartTypeValue);

    // Predefined color palette - can be replaced with random color generation later
    const colorPalette = [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)',
        'rgb(201, 203, 207)'
    ];

    let labels = response.map(item => item['Hour']); // Common x-axis labels
    let datasets = columns.map((column, index) => {
        let data = [];

        // Check if the column data is numeric or categorical
        const isNumeric = response.every(item => !isNaN(parseFloat(item[column])));
        if (!isNumeric) {
            // Categorical Data
            const counts = response.reduce((acc, item) => {
                const value = item[column];
                acc[value] = (acc[value] || 0) + 1;
                return acc;
            }, {});

            labels = Object.keys(counts);
            data = Object.values(counts);
        } else {
            // Numeric Data
            data = response.map(item => item[column]);
        }

        // Use color from palette, cycling through if more datasets than colors
        const colorIndex = index % colorPalette.length;
        
        return {
            label: `Data for ${column}`,
            data: data,
            backgroundColor: colorPalette[colorIndex],
            borderColor: colorPalette[colorIndex],
            borderWidth: 1,
            fill: false
        };
    });

    console.log("Chart Labels:", labels);
    console.log("Datasets:", datasets);

    myChart = new Chart(ctx, {
        type: chartTypeValue,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    downloadButtons.innerHTML = `<button id="pdfButton">Download as PDF</button> <button id="pngButton">Download as PNG</button> <button id="jsonButton">Export JSON</button> <button id="csvButton">Download as CSV</button>`;
    const pdfButton = document.getElementById('pdfButton');
    const pngButton = document.getElementById('pngButton');
    const jsonButton = document.getElementById('jsonButton');
    const csvButton = document.getElementById('csvButton');
    pdfButton.addEventListener('click', makePDF);
    pngButton.addEventListener('click', downloadBitmap);
    jsonButton.addEventListener('click', () => exportJSON(response));
    csvButton.addEventListener('click', () => exportCSV(response));
    return myChart;
}

document.addEventListener('DOMContentLoaded', () => {
    yhr.send();
    fetchDates();
    populate_chartTypes();
  });