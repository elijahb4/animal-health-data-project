//Async function variables
let xhr = new XMLHttpRequest();
let yhr = new XMLHttpRequest();
let myChart = null;
let minDate = null;
let maxDate = null;

fetchDates();

//Varaibles for html elements
const queryForm = document.getElementById("dataQuery")
const selectColumn = document.getElementById("dataSelect");
const selectElement = document.getElementById('selectDog');
const datePicker = document.getElementById('datePicker');
const ctx = document.getElementById('myChart').getContext('2d');
const chatTypes = ['bar','line','bubble','doughnut','pie','polarArea','radar','scatter'];
const chartTypeSelect = document.getElementById("chartTypes");
let queryDate = new Date(datePicker.value);
queryForm.addEventListener("submit", queryData);
datePicker.addEventListener("change", function () {
    queryDate = new Date(datePicker.value);
    console.log("Selected date:", queryDate);
});

function populate_chartTypes() {
    chatTypes.forEach(chartType => {
        const option = document.createElement('option');
        option.value = chartType;
        option.textContent = chartType;
        chartTypeSelect.appendChild(option);
    })
}

function setDateRange(minDate, maxDate) {
    datePicker.min = minDate;
    datePicker.max = maxDate;
}

let columnsToFetch = ['Hour'];

function queryData(event) {
    event.preventDefault();
    if (queryDate < minDate || queryDate > maxDate) {
        alert("Please select a date within the range.");
        return;
    }
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

async function fetchDates() {
    try {
      const response = await fetch('getDates.php');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.error) {
        console.error('Error:', data.error);
        alert(`Error: ${data.error}`);
      } else {
        console.log('Min Date:', data.minDate);
        console.log('Max Date:', data.maxDate);
        minDate = formatDateToISO(data.minDate);
        maxDate = formatDateToISO(data.maxDate);
        setDateRange(minDate, maxDate);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('An error occurred while fetching the data.');
    }
}

function formatDateToISO(dateString) {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
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

yhr.send();
populate_chartTypes();