export function populateMlDogDropdown() {
  let mlDogRequest = new XMLHttpRequest();
  mlDogRequest.open('GET', '../php_scripts/getDogs.php', true);
  mlDogRequest.setRequestHeader('Accept', 'application/json');

  mlDogRequest.onload = function () {
    if (
      mlDogRequest.readyState === mlDogRequest.DONE &&
      mlDogRequest.status === 200
    ) {
      try {
        const dogs = JSON.parse(mlDogRequest.responseText);
        const mlDogSelect = document.getElementById('mlDog');

        if (!mlDogSelect) {
          console.warn('No #mlDog dropdown found in DOM.');
          return;
        }

        dogs.forEach(dog => {
          const option = document.createElement('option');
          option.value = dog;
          option.textContent = dog;
          mlDogSelect.appendChild(option);
        });

      } catch (e) {
        console.error('failed to parse dog list', e);
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

export function initMlPredictionForm() {
  const form = document.getElementById('mlPredictionForm');
  if (!form) {
    console.warn('ML Prediction form not found.');
    return;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const dogId = document.getElementById('mlDog').value;
    const metric = document.getElementById('mlMetric').value;
    const startDate = document.getElementById('mlStart').value;
    const days = parseInt(document.getElementById('mlDays').value);
    const trainingDays = parseInt(document.getElementById('mlTrainingDays').value);
    const model = document.getElementById('mlModel').value;

    try {
      const response = await fetch('../php_scripts/getPredictions.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          dogId,
          metric,
          startDate,
          days,
          trainingDays,
          model
        })
      });

      const responseText = await response.text();
      console.log('raw response from PHP:', responseText);

      const result = JSON.parse(responseText);
      const predictions = result.predictions ?? result;
      const training = result.training ?? [];

      if (!Array.isArray(predictions)) {
        console.error('Prediction error:', result.error ?? 'Unexpected response');
        alert(result.error ?? 'Prediction failed. See console for details.');
        return;
      }

      const ctx = document.getElementById('mlPredictionChart')?.getContext('2d');
      if (!ctx) {
        alert('Prediction chart canvas not found.');
        return;
      }

      if (window.mlPredictionChart && typeof window.mlPredictionChart.destroy === 'function') {
        window.mlPredictionChart.destroy();
      }

      const allDates = [...new Set([...training.map(d => d.date), ...predictions.map(d => d.date)])];

      window.mlPredictionChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: allDates,
          datasets: [
            {
              label: `Training (${metric})`,
              data: training.map(d => d.value),
              borderColor: 'rgba(100,100,100,0.5)',
              backgroundColor: 'rgba(100,100,100,0.2)',
              borderDash: [4, 4],
              tension: 0.2
            },
            {
              label: `Predicted ${metric}`,
              data: predictions.map(d => d.value),
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderWidth: 2,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `Forecast for ${metric} (${startDate} + ${days} days)`
            }
          },
          scales: {
            y: { beginAtZero: true },
            x: {
              ticks: { autoSkip: true },
              title: { display: true, text: 'Date' }
            }
          }
        }
      });

    } catch (err) {
      console.error('Prediction fetch error:', err);
      alert('An error occurred while generating predictions.');
    }
  });
}