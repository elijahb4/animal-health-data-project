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

async function fetchAndDrawChart(canvasId, column, chartType = 'line', rangeDays = 7) {
  try {
    const dogId = 'CANINE001';
    const dateRes = await fetch('php_scripts/getDates.php');
    const dateData = await dateRes.json();
    const maxDate = dateData.maxDate; // dd-mm-yyyy
    console.log("Date data from getDates.php:", dateData);

    const formattedDate = `${maxDate.split('-').reverse().join('-')}`; // to yyyy-mm-dd

    const params = new URLSearchParams();
    params.append('DogID', dogId);
    params.append('Date', formattedDate);
    params.append('rangeDays', rangeDays);
    params.append('columns[]', column);

    const response = await fetch(`php_scripts/getData.php?${params.toString()}`);
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error(`Invalid response for ${column}:`, data);
      return;
    }

    const ctx = document.getElementById(canvasId).getContext('2d');
    const isNumeric = data.every(item => !isNaN(parseFloat(item[column])) && item[column] !== '');

    let labels = [];
    let values = [];

    if (isNumeric) {
      // numeric data: time series based on hour
      labels = data.map(d => d.Hour);
      values = data.map(d => parseFloat(d[column]));
    } else {
      // categorical data: count frequency
      const counts = data.reduce((acc, item) => {
        const value = item[column];
        if (value) acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {});
      labels = Object.keys(counts);
      values = Object.values(counts);
    }

    // wrapped in animated effect?
    const canvas = document.getElementById(canvasId);
    canvas.classList.remove('show');

    setTimeout(() => {
      // clear previous chart if exists
      if (window[canvasId + '_chart']) {
        window[canvasId + '_chart'].destroy();
      }

      window[canvasId + '_chart'] = new Chart(ctx, {
        type: chartType,
        data: {
          labels: labels,
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
                ? `Average ${column} (Last ${rangeDays} Days)`
                : `Distribution of ${column}`
            }
          },
          scales: isNumeric
            ? { y: { beginAtZero: true } }
            : {} // no special scale for categorical
        }
      });
      canvas.classList.add('show');
    }, 300); // fade out time
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

  state.interval = setInterval(() => {
    const nextIndex = (state.index + 1) % chartList.length;
    drawChart(nextIndex);
  }, 8000);

  drawChart(state.index);
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

  // restart auto-rotation
  carouselState[tileId].interval = setInterval(() => {
    const nextIndex = (carouselState[tileId].index + 1) % chartList.length;
    startManualCarousel(tileId, nextIndex);
  }, 8000);
}

function updateDots(tileId, activeIndex) {
  console.log(`updateDots called for ${tileId} with activeIndex ${activeIndex}`);
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
  const maxDate = dateData.maxDate; // format: dd-mm-yyyy
  const formattedDate = maxDate.split('-').reverse().join('-');

  const columns = ['Calorie Burn', 'Heart Rate (bpm)', 'Food Intake (calories)', 'Water Intake (ml)'];

  const params = new URLSearchParams();
  params.append('DogID', dogId);
  params.append('Date', formattedDate);
  params.append('rangeDays', 7);
  columns.forEach(col => params.append('columns[]', col));

  const response = await fetch(`php_scripts/getData.php?${params.toString()}`);
  const data = await response.json();

  if (!Array.isArray(data)) {
    console.error("Invalid metric data response", data);
    return;
  }

  // average calculator
  function average(col) {
    const values = data.map(d => parseFloat(d[col])).filter(n => !isNaN(n));
    const sum = values.reduce((a, b) => a + b, 0);
    return values.length ? (sum / values.length).toFixed(1) : 'N/A';
  }

  // update UI
  document.getElementById('metricCalories').textContent = average('Calorie Burn');
  document.getElementById('metricHeartRate').textContent = average('Heart Rate (bpm)');
  document.getElementById('metricFood').textContent = average('Food Intake (calories)');
  document.getElementById('metricWater').textContent = average('Water Intake (ml)');
}

document.addEventListener('DOMContentLoaded', () => {
  startCarousel('healthChart');
  startCarousel('vitalsChart');
  startCarousel('behaviourChart');
  updateMetricCards();
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