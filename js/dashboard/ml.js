export function populateMlDogDropdown() {
  let mlDogRequest = new XMLHttpRequest();
  mlDogRequest.open('GET', '../php_scripts/getDogs.php', true);
  mlDogRequest.setRequestHeader('Accept', 'application/json');
  mlDogRequest.onload = function () {
    if (mlDogRequest.readyState === mlDogRequest.DONE && mlDogRequest.status === 200) {
      try {
        const dogs = JSON.parse(mlDogRequest.responseText);
        const mlDogSelect = document.getElementById('mlDog');
        dogs.forEach(dog => {
          const option = document.createElement('option');
          option.value = dog;
          option.textContent = dog;
          mlDogSelect.appendChild(option);
        });
      } catch (e) {
        console.error("failed to parse dog list", e);
      }
    }
  };
  mlDogRequest.send();
}

export function populateFilterDogDropdown() {
  fetch('../php_scripts/getDogs.php')
    .then(res => res.json())
    .then(dogs => {
      const select = document.getElementById('selectDog');
      if (!select) return;

      select.innerHTML = '';

      const allOption = document.createElement('option');
      allOption.value = 'ALL';
      allOption.textContent = 'ALL';
      select.appendChild(allOption);

      dogs.forEach(dog => {
        const option = document.createElement('option');
        option.value = dog;
        option.textContent = dog;
        select.appendChild(option);
      });
    })
    .catch(err => console.error('Failed to populate Dog ID filter:', err));
}