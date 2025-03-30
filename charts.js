//Async function variables
let xhr = new XMLHttpRequest();
let yhr = new XMLHttpRequest();

//Varaibles for html elements
const queryForm = document.getElementById("dataQuery")
const selectColumn = document.getElementById("dataSelect");
const selectElement = document.getElementById('selectDog');
const ctx = document.getElementById('myChart').getContext('2d');

let columnsToFetch = ['Hour'];

queryForm.addEventListener("submit", queryData)

function queryData(event) {
    event.preventDefault();
    const selectColumnValue = selectColumn.value;
    const selectedColumns = Array.isArray(selectColumnValue) ? selectColumnValue : [selectColumnValue];
    selectedColumns.forEach(column => {
        columnsToFetch.push(column);
    });
    let params = new URLSearchParams({
        columnId: 'CANINE001',
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
    const labels = response.map(item => item['Hour']);
    const data = response.map(item => parseFloat(item[selectedColumn]));
    const myChart = new Chart(ctx, {
    type: 'line', //Update to be a variable not hardcoded to allow user selection
    data: {
      labels: labels,
      datasets: [{
        label: `Data for ${selectedColumn}`,
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
        }]
    }      
    }
      );
      return myChart;
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