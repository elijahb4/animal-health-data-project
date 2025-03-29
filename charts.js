let xhr = new XMLHttpRequest();
let yhr = new XMLHttpRequest();

const selectColumn = document.getElementById("dataSelect");

const columnsToFetch = ['columnID', 'Heart Rate', 'Temperature', 'Activity Level'];

let params = new URLSearchParams({
    columnId: 'CANINE001',
    columns: JSON.stringify(columnsToFetch)
});

xhr.open('GET', 'getData.php', true);
xhr.setRequestHeader('Accept', 'application/json');

xhr.onload = function () {
    if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
        let response;
    try {
        console.log('Raw response:', xhr.responseText);
        const response = JSON.parse(xhr.responseText);
        console.log(response)
        
    }
    catch (e) {
        console.error(e.message);
        console.error("Parsing Error", xhr.status);
    }
    }}     
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