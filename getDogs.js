let xhr = new XMLHttpRequest();

xhr.open('GET', 'getDogs.php', true);
xhr.setRequestHeader('Accept', 'application/json');

xhr.onload = function () {
    if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
        let response;
    try {
        response = JSON.parse(xhr.responseText);

        const selectElement = document.getElementById('selectDog');

        response.forEach(dog => {
            const option = document.createElement('option');
            option.value = dog;
            option.textContent = dog;
            selectElement.appendChild(option);
        });
    }
    catch (e) {
        console.error("Parsing Error");
    }
    }}     
}

xhr.send();