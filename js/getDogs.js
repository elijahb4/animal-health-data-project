let zhr = new XMLHttpRequest();

zhr.open('GET', 'php_scripts/getDogs.php', true);
zhr.setRequestHeader('Accept', 'application/json');

zhr.onload = function () {
    if (zhr.readyState === zhr.DONE) {
        if (zhr.status === 200) {
        let response;
    try {
        response = JSON.parse(zhr.responseText);

        const selectElement = document.getElementById('selectDog');
        console.log("getDogs.php returned:", response);
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

zhr.send();