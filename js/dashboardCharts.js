let currentDog = 'CANINE001'; // default values
let currentStartDate = null;
let currentRange = 1;

// handling form submission for graph filters
document.getElementById('carouselFilterForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  currentDog = document.getElementById('selectDog').value;
  currentStartDate = document.getElementById('datePicker').value;
  currentRange = parseInt(document.getElementById('rangeDays').value);
  const category = document.getElementById('carouselCategory').value;

  if (category === 'all') {
    startCarousel('healthChart');
    startCarousel('vitalsChart');
    startCarousel('behaviourChart');
  } else {
    startCarousel(category);
  }
});

const carouselState = {
  healthChart: { index: 0, interval: null },
  vitalsChart: { index: 0, interval: null },
  behaviourChart: { index: 0, interval: null }
};

const carouselCharts = {
  healthChart: [
    { column: 'Calorie Burn', type: 'line', range: 7 },
    { column: 'Food Intake (calories)', type: 'line', range: 7 },
    { column: 'Water Intake (ml)', type: 'line', range: 7 }
  ],
  vitalsChart: [
    { column: 'Heart Rate (bpm)', type: 'line', range: 7 },
    { column: 'Temperature (C)', type: 'line', range: 7 },
    { column: 'Breathing Rate (breaths/min)', type: 'line', range: 7 }
  ],
  behaviourChart: [
    { column: 'Behaviour Pattern', type: 'bar', range: 1 },
    { column: 'Barking Frequency', type: 'bar', range: 1 }
    //{ column: 'Sleep Duration', type: 'bar', range: 1 }
  ]
};

async function fetchAndDrawChart(canvasId, column, chartType = 'line') {
  try {
    const dogId = currentDog;

    // get latest user range from dropdown
    const rangeInput = document.getElementById('rangeDays');
    const rangeDays = parseInt(rangeInput?.value || currentRange);

    // get the selected date
    let startDate = currentStartDate;
    if (!startDate) {
      const dateRes = await fetch('php_scripts/getDates.php');
      const dateData = await dateRes.json();
      startDate = dateData.maxDate.split('-').reverse().join('-');
    }

    const dateMode = document.getElementById('dateMode').value;

    let startDateToSend;
    if (dateMode === 'from') {
      startDateToSend = startDate;
    } else {
      const end = new Date(startDate);
      end.setDate(end.getDate() - (rangeDays - 1));
      startDateToSend = end.toISOString().slice(0, 10); // yyyy-mm-dd
    }

    // send parameters
    const params = new URLSearchParams();
    params.append('DogID', dogId);
    params.append('Date', startDateToSend);
    params.append('rangeDays', rangeDays);
    params.append('columns[]', column);

    const response = await fetch(`php_scripts/getData.php?${params.toString()}`);
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error(`Invalid response for ${column}:`, data);
      return;
    }

    // build chart data
    const ctx = document.getElementById(canvasId).getContext('2d');
    const isNumeric = data.every(item => !isNaN(parseFloat(item[column])) && item[column] !== '');

    let labels = [], values = [];
    if (isNumeric) {
      labels = data.map(d => d.Hour);
      values = data.map(d => parseFloat(d[column]));
    } else {
      const counts = data.reduce((acc, item) => {
        const value = item[column];
        if (value) acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {});
      labels = Object.keys(counts);
      values = Object.values(counts);
    }

    // fade animation
    const canvas = document.getElementById(canvasId);
    canvas.classList.remove('show');

    // compute title range
    const startDateObj = new Date(startDateToSend);
    const endDateObj = new Date(startDateToSend);
    endDateObj.setDate(startDateObj.getDate() + rangeDays - 1);

    const titleStart = startDateObj.toLocaleDateString('en-GB');
    const titleEnd = endDateObj.toLocaleDateString('en-GB');

    setTimeout(() => {
      if (window[canvasId + '_chart']) {
        window[canvasId + '_chart'].destroy();
      }

      window[canvasId + '_chart'] = new Chart(ctx, {
        type: chartType,
        data: {
          labels,
          datasets: [{
            label: column,
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.4)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
            pointRadius: 3
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: isNumeric
                ? `${column} (${titleStart} to ${titleEnd})`
                : `Distribution of ${column}`
            }
          },
          scales: isNumeric ? { y: { beginAtZero: true } } : {}
        }
      });

      canvas.classList.add('show');
    }, 100);
  } catch (e) {
    console.error(`Error loading ${column} chart`, e);
  }
}

function startCarousel(tileId) {
  const state = carouselState[tileId];
  const chartList = carouselCharts[tileId];

  if (state.interval) clearInterval(state.interval); // performative

  function drawChart(index) {
    const chartConfig = chartList[index];
    fetchAndDrawChart(tileId, chartConfig.column, chartConfig.type, chartConfig.range);
    updateDots(tileId, index);
    updateTitle(tileId, chartConfig.column);
    state.index = index;
  }

  drawChart(state.index); // draw immediately

  state.interval = setInterval(() => {
    const nextIndex = (state.index + 1) % chartList.length;
    drawChart(nextIndex);
  }, 8000);
}

function nextChart(tileId) {
  const state = carouselState[tileId];
  clearInterval(state.interval);
  const nextIndex = (state.index + 1) % carouselCharts[tileId].length;
  startManualCarousel(tileId, nextIndex);
}

function prevChart(tileId) {
  const state = carouselState[tileId];
  clearInterval(state.interval);
  const prevIndex = (state.index - 1 + carouselCharts[tileId].length) % carouselCharts[tileId].length;
  startManualCarousel(tileId, prevIndex);
}

function startManualCarousel(tileId, newIndex) {
  const chartList = carouselCharts[tileId];
  const chartConfig = chartList[newIndex];

  fetchAndDrawChart(tileId, chartConfig.column, chartConfig.type, chartConfig.range);
  updateDots(tileId, newIndex);
  updateTitle(tileId, chartConfig.column);
  carouselState[tileId].index = newIndex;

  // restart auto rotation
  startCarousel(tileId);
}

function updateDots(tileId, activeIndex) {
  const dotsContainer = document.getElementById(`${tileId}Dots`);
  dotsContainer.innerHTML = '';

  carouselCharts[tileId].forEach((_, idx) => {
    const dot = document.createElement('span');
    dot.classList.add('chart-dot');

    dot.classList.add('carousel-dot');
    if (idx === activeIndex) {
      dot.classList.add('active-dot');
    }

    dot.addEventListener('click', () => {
      clearInterval(carouselState[tileId].interval);
      startManualCarousel(tileId, idx);
    });

    dotsContainer.appendChild(dot);
  });
}

//----- tile functions -----

function updateTitle(tileId, column) {
  const title = document.getElementById(`${tileId}Title`);
  if (title) {
    title.textContent = column;
  }
}

async function updateMetricCards() {
  const dogId = 'CANINE001';

  const dateRes = await fetch('php_scripts/getDates.php');
  const dateData = await dateRes.json();
  const maxDate = dateData.maxDate;
  const formattedMax = maxDate.split('-').reverse().join('-');

  const columns = ['Calorie Burn', 'Heart Rate (bpm)', 'Food Intake (calories)', 'Water Intake (ml)'];

  const recentParams = new URLSearchParams();
  recentParams.append('DogID', dogId);
  recentParams.append('Date', formattedMax);
  recentParams.append('rangeDays', 7);
  columns.forEach(col => recentParams.append('columns[]', col));
  const recentData = await (await fetch(`php_scripts/getData.php?${recentParams.toString()}`)).json();

  const maxDateObj = new Date(formattedMax);
  maxDateObj.setDate(maxDateObj.getDate() - 1);
  const yesterday = maxDateObj.toISOString().slice(0, 10);

  const prevParams = new URLSearchParams();
  prevParams.append('DogID', dogId);
  prevParams.append('Date', yesterday);
  prevParams.append('rangeDays', 1);
  columns.forEach(col => prevParams.append('columns[]', col));
  const prevData = await (await fetch(`php_scripts/getData.php?${prevParams.toString()}`)).json();

  function avg(data, col) {
    const vals = data.map(d => parseFloat(d[col])).filter(n => !isNaN(n));
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  }

  columns.forEach(col => {
    const currentAvg = avg(recentData, col);
    const prevVal = avg(prevData, col);

    const id = col.includes('Calorie') ? 'Calories'
              : col.includes('Heart') ? 'HeartRate'
              : col.includes('Food') ? 'Food'
              : 'Water';

    document.getElementById(`metric${id}`).textContent = currentAvg?.toFixed(1) ?? 'N/A';

    const trendElem = document.getElementById(`metric${id}Trend`);

    if (prevVal !== null && currentAvg !== null) {
      const diff = currentAvg - prevVal;
      const absDiff = Math.abs(diff).toFixed(1);

      let emoji = '', className = '', text = '';

      if (diff > 0.1) {
        emoji = '🔼';
        className = 'trend-up';
        text = `+${absDiff}`;
      } else if (diff < -0.1) {
        emoji = '🔽';
        className = 'trend-down';
        text = `-${absDiff}`;
      } else {
        emoji = '➖';
        className = 'trend-same';
        text = `0.0`;
      }

      trendElem.textContent = `${emoji} ${text}`;
      trendElem.className = `trend-indicator ${className}`;
    } else {
      trendElem.textContent = '';
      trendElem.className = 'trend-indicator trend-same';
    }
  });
}

async function setDatePickerLimits() {
  try {
    const res = await fetch('php_scripts/getDates.php');
    const data = await res.json();

    if (data.minDate && data.maxDate) {
      const min = data.minDate.split('-').reverse().join('-'); // to yyyy-mm-dd
      const max = data.maxDate.split('-').reverse().join('-');

      const dateInput = document.getElementById('datePicker');
      dateInput.min = min;
      dateInput.max = max;
      dateInput.value = max; // default to latest date!!!
    } else {
      console.error("Missing minDate or maxDate in getDates.php response:", data);
    }
  } catch (err) {
    console.error("Failed to fetch date limits:", err);
  }
}

document.getElementById('mlPredictionForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const dogId = document.getElementById('mlDog').value;
  const metric = document.getElementById('mlMetric').value;
  const startDate = document.getElementById('mlStart').value;
  const days = parseInt(document.getElementById('mlDays').value);

  const labels = [];
  const values = [];

  try {
    const response = await fetch('php_scripts/getPredictions.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        dogId,
        metric,
        startDate,
        days
      })
    });

    // 👇 read text first to inspect it
    const responseText = await response.text();
    console.log('raw response from PHP:', responseText);

    const result = JSON.parse(responseText); // 👈 only parse after logging

    result.forEach(entry => {
      labels.push(new Date(entry.date).toLocaleDateString('en-GB'));
      values.push(entry.value);
    });

  } catch (err) {
    console.error('prediction fetch error', err);
    return; // stop here if something went wrong
  }

  const ctx = document.getElementById('mlPredictionChart').getContext('2d');

  // ✅ safe check before destroy
  if (window.mlPredictionChart && typeof window.mlPredictionChart.destroy === 'function') {
    window.mlPredictionChart.destroy();
  }

  window.mlPredictionChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `Predicted ${metric}`,
        data: values,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
        tension: 0.3
      }]
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
        y: { beginAtZero: true }
      }
    }
  });
});

// populate mlDog dropdown
function populateMlDogDropdown() {
  let mlDogRequest = new XMLHttpRequest();

  mlDogRequest.open('GET', 'php_scripts/getDogs.php', true);
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

document.addEventListener('DOMContentLoaded', () => {
  startCarousel('healthChart');
  startCarousel('vitalsChart');
  startCarousel('behaviourChart');
  updateMetricCards();
  setDatePickerLimits();
  populateMlDogDropdown();
});

document.addEventListener("visibilitychange", () => {
  // pauses the carousels when tabbed out, because performative
  if (document.hidden) {
    Object.values(carouselState).forEach(state => clearInterval(state.interval));
  } else {
    Object.keys(carouselState).forEach(tileId => {
      startCarousel(tileId);
    });
  }
});