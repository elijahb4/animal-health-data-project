let zhr = new XMLHttpRequest();

zhr.open('GET', 'php_scripts/getDogs.php', true); // absolute works ig?
zhr.setRequestHeader('Accept', '../application/json');

zhr.onload = function () {
    if (zhr.readyState === zhr.DONE) {
        if (zhr.status === 200) {
        let response;
    try {
        response = JSON.parse(zhr.responseText);

        const selectElement = document.getElementById('selectDog');

        const allOption = document.createElement('option'); // ALL OPTION
                allOption.value = 'ALL';
                allOption.textContent = 'All Dogs';
                selectElement.appendChild(allOption);

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