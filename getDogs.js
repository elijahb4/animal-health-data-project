fetch('getDogs.php')
            .then(response => response.json())
            .then(uniqueCities => {
                // Get the select element
                const selectElement = document.getElementById('selectDog');

                // Populate the select element with unique cities
                uniqueCities.forEach(dog => {
                    const option = document.createElement('option');
                    option.value = dog;
                    option.textContent = dog;
                    selectElement.appendChild(option);
                });
            })