import { fetchAndDrawChart } from './chartRenderer.js';
import { carouselState, carouselCharts, currentChartTypes, chartRegistry, carouselsEnabled, CONFIG } from './config.js';

export function startCarousel(tileId) {
  const state = carouselState[tileId];
  const chartList = carouselCharts[tileId];

  if (state.interval) clearInterval(state.interval);

  function drawChart(index) {
    const chartConfig = chartList[index];
    fetchAndDrawChart(tileId, chartConfig.column, currentChartTypes[tileId], chartRegistry);
    updateDots(tileId, index);
    updateTitle(tileId, chartConfig.column);
    state.index = index;
  }

  drawChart(state.index);
  state.interval = setInterval(() => {
    const nextIndex = (state.index + 1) % chartList.length;
    drawChart(nextIndex);
  }, CONFIG.carouselInterval);
}

export function applyChartStyle(tileId) {
  const dropdown = document.getElementById(`${tileId}Type`);
  if (dropdown) {
    currentChartTypes[tileId] = dropdown.value;
    const chartList = carouselCharts[tileId];
    const chartConfig = chartList[carouselState[tileId].index];
    fetchAndDrawChart(tileId, chartConfig.column, currentChartTypes[tileId], chartRegistry);
    startCarousel(tileId);
  }
}

export function updateDots(tileId, activeIndex) {
  const dotsContainer = document.getElementById(`${tileId}Dots`);
  if (!dotsContainer) return;

  dotsContainer.innerHTML = '';

  carouselCharts[tileId].forEach((_, idx) => {
    const dot = document.createElement('span');
    dot.classList.add('chart-dot', 'carousel-dot');
    if (idx === activeIndex) dot.classList.add('active-dot');
    dot.addEventListener('click', () => {
      clearInterval(carouselState[tileId].interval);
      startManualCarousel(tileId, idx);
    });
    dotsContainer.appendChild(dot);
  });
}

export function updateTitle(tileId, column) {
  const title = document.getElementById(`${tileId}Title`);
  if (title) {
    title.textContent = column;
  }
}

export function prevChart(tileId) {
  const state = carouselState[tileId];
  clearInterval(state.interval);
  const prevIndex = (state.index - 1 + carouselCharts[tileId].length) % carouselCharts[tileId].length;
  startManualCarousel(tileId, prevIndex);
}

export function startManualCarousel(tileId, newIndex) {
  const chartList = carouselCharts[tileId];
  const chartConfig = chartList[newIndex];
  fetchAndDrawChart(tileId, chartConfig.column, currentChartTypes[tileId], chartRegistry);
  updateDots(tileId, newIndex);
  updateTitle(tileId, chartConfig.column);
  carouselState[tileId].index = newIndex;

  if (carouselsEnabled) {
    startCarousel(tileId);
  }
}