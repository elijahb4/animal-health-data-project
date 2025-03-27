let xhr = new XMLHttpRequest();

xhr.open('GET', '/getDogs.php', true);

xhr.onload = function () {
    if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
    try {
        let response = JSON.parse(xhr.responseText);
    }
    catch (e) {
        console.error();
    }
    }}
    const selectElement = document.getElementById('selectDog');

            
            response.forEach(dog => {
                const option = document.createElement('option');
                option.value = dog;
                option.textContent = dog;
                selectElement.appendChild(option);
            })
}

xhr.send();

console.error();