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
    const selectColumnValue = selectColumn.value;
    const selectedColumns = Array.isArray(selectColumnValue) ? selectColumnValue : [selectColumnValue];
    selectedColumns.forEach(column => {
        columnsToFetch.push(column);
    });
    const dogId = selectElement.value;
    let params = new URLSearchParams({
        DogID: dogId,
        columns: JSON.stringify(columnsToFetch)
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
        console.log(response)
        makeChart(ctx, response, columnsToFetch[1]);
    }
    catch (e) {
        console.error(e.message);
        console.error("Parsing Error", xhr.status);
    }
    }}     
}

function makeChart(ctx, response, selectedColumn) {
    if (myChart) {
        myChart.destroy();
    }
    const chartTypeValue = chartTypeSelect.value;
    const labels = response.map(item => item['Hour']);
    const data = response.map(item => {
        const value = item[selectedColumn];
        return isNaN(value) ? value : parseFloat(value);
    });
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
    }
      );
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
            const maxDate = response[0];
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