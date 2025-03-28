let xhr = new XMLHttpRequest();

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

xhr.send();