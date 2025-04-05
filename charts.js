//Async function variables
let xhr = new XMLHttpRequest();
let yhr = new XMLHttpRequest();
let vhr = new XMLHttpRequest();
let myChart = null;

//Varaibles for html elements
const queryForm = document.getElementById("dataQuery")
const selectColumn = document.getElementById("dataSelect");
const selectElement = document.getElementById('selectDog');
const ctx = document.getElementById('myChart').getContext('2d');
const chatTypes = ['bar','line','bubble','doughnut','pie','polarArea','radar','scatter'];
const chartTypeSelect = document.getElementById("chartTypes")

function populate_chartTypes() {
    chatTypes.forEach(chartType => {
        const option = document.createElement('option');
        option.value = chartType;
        option.textContent = chartType;
        chartTypeSelect.appendChild(option);
    })
}

function setDateRange(minDate, maxDate) {
    const datePicker = document.getElementById('datePicker');
    datePicker.min = minDate;
    datePicker.max = maxDate;
}

let columnsToFetch = ['Hour'];

queryForm.addEventListener("submit", queryData)

function queryData(event) {
    event.preventDefault();

    const selectedColumns = Array.isArray(selectColumn.value)
        ? selectColumn.value
        : [selectColumn.value];

    // Reset global storage if needed
    columnsToFetch = [];

    selectedColumns.forEach(column => {
        if (column && !columnsToFetch.includes(column)) {
            columnsToFetch.push(column);
        }
    });

    const dogId = selectElement.value;
    const params = new URLSearchParams();
    params.append('DogID', dogId);

    columnsToFetch.forEach(col => {
        params.append('columns[]', col);
    });

    labelKey = columnsToFetch;
    dataKey = columnsToFetch;

    xhr.open('GET', `getData.php?${params.toString()}`, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send();
}

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

    // Check if selectedColumn contains numeric data or categorical data
    const isNumeric = response.every(item => !isNaN(parseFloat(item[selectedColumn])));

    if (!isNumeric) {
        // Categorical column: Count occurrences
        const counts = response.reduce((acc, item) => {
            const value = item[selectedColumn];
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});

        labels = Object.keys(counts); // Unique values
        data = Object.values(counts); // Count of each category
    } else {
        // Numeric column: Directly use values
        labels = response.map(item => item['Hour']); // Use "Hour" as labels
        const data = response.map(item => item[selectedColumn]);
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

vhr.open('GET', 'getDates.php', true)
vhr.setRequestHeader('Accept','application.json')
vhr.onload = function () {
    if (vhr.readyState === vhr.DONE) {
        if (yhr.status === 200) {
        let response;
        try {
            console.log('Raw response:', yhr.responseText);
            response = JSON.parse(yhr.responseText);
            console.log(response)
            const minDate = response[0];
            const maxDate = response[1];
            setDateRange(minDate, maxDate);
        }
        catch (e) {
            console.error(e.message);
            console.error("Parsing Error", yhr.status);
        }
        }
    }
}

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

vhr.send();
yhr.send();
populate_chartTypes();