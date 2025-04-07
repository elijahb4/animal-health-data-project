//AJAX function variables
let xhr = new XMLHttpRequest();
let yhr = new XMLHttpRequest();

//Varaibles (*varialbls) for html elements
const queryForm = document.getElementById("dataQuery")
const selectColumn = document.getElementById("dataSelect");
const selectElement = document.getElementById('selectDog');
const ctx = document.getElementById('myChart').getContext('2d');
const chatTypes = ['bar','line','bubble','doughnut','pie','polarArea','radar','scatter'];
const chartTypeSelect = document.getElementById("chartTypes");
const datePicker = document.getElementById("datePicker");

//General variables
let myChart = null;
let columnsToFetch = ['Hour'];
let minDate = null;
let maxDate = null;

//Event listeners
queryForm.addEventListener("submit", queryData)

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
        const response = await fetch('getDates.php');
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
yhr.open('GET', 'getHeaders.php', true);
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
            const option = document.createElement('option');
            option.value = column;
            option.textContent = column;
            selectColumn.appendChild(option);
        })
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
    let queryDate = datePicker.value;
    if (minDate > queryDate || queryDate > maxDate) {
        alert("Please select a date within the range provided.");
        return;
    }
    formatDateForCSV(queryDate);
    const selectedColumns = Array.isArray(selectColumn.value)
        ? selectColumn.value
        : [selectColumn.value];

    columnsToFetch = [];

    selectedColumns.forEach(column => {
        if (column && !columnsToFetch.includes(column)) {
            columnsToFetch.push(column);
        }
    });

    const dogId = selectElement.value;
    const selectedDate = datePicker.value; // date thingy
    const rangeDays = document.getElementById("rangeDays").value; // day range thingy

    const params = new URLSearchParams();
    params.append('DogID', dogId);
    params.append('Date', selectedDate);
    params.append('rangeDays', rangeDays);

    columnsToFetch.forEach(col => {
        params.append('columns[]', col);
    });

    labelKey = columnsToFetch;
    dataKey = columnsToFetch;

    xhr.open('GET', `getData.php?${params.toString()}`, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send();
}

//Function to call and handle the response from the server
xhr.onload = function (selectColumnValue) {
    if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
    try {
        console.log('Raw response:', xhr.responseText);
        const response = JSON.parse(xhr.responseText);
        console.log('Response:', response);
        console.log('Columns to fetch:', columnsToFetch);
        makeChart(ctx, response, columnsToFetch[0]);
    }
    catch (e) {
        console.error(e.message);
        console.error("Parsing Error", xhr.status);
    }
    }}     
}

//Function to create the chart using Chart.js
function makeChart(ctx, response, selectedColumn) {
    console.log('Chart column:', selectedColumn);
    console.log('Sample data row:', response[0]);
    if (myChart) {
        myChart.destroy();
    }

    const chartTypeValue = chartTypeSelect.value;
    console.log("Selected Chart Type:", chartTypeValue);

    let labels = [];
    let data = [];

    //This section checks if the selected column is numeric or categorical
    const isNumeric = response.every(item => !isNaN(parseFloat(item[selectedColumn])));
    if (!isNumeric) {
        //Categorical Data
        const counts = response.reduce((acc, item) => {
            const value = item[selectedColumn];
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});

        labels = Object.keys(counts);
        data = Object.values(counts);
    } else {
        //Numeric Data
        labels = response.map(item => item['Hour']);
        data = response.map(item => item[selectedColumn]);
    }

    console.log("Chart Labels:", labels);
    console.log("Chart Data:", data);

    myChart = new Chart(ctx, {
        type: chartTypeValue,
        data: {
            labels: labels,
            datasets: [{
                label: `Data for ${selectedColumn}`,
                data: data,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
            }]
        }
    });

    return myChart;
}

yhr.send();
fetchDates();
populate_chartTypes();