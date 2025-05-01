import { carouselCharts, chartRegistry, currentChartTypes, CONFIG, carouselState } from './config.js';
import { fetchAndDrawChart } from './chartRenderer.js';

export function buildSingleChartCards(selectedGroups = ['healthChart', 'vitalsChart', 'behaviourChart']) {
  selectedGroups.forEach(tileId => {
    const scrollWrapper = document.getElementById(`${tileId}ScrollWrapper`);
    if (!scrollWrapper) return;

    scrollWrapper.innerHTML = ''; // clear old

    const chartList = carouselCharts[tileId];
    chartList.forEach((chart, i) => {
      const card = document.createElement('div');
      card.className = 'scroll-card';
    
      const title = document.createElement('h4');
      title.textContent = chart.column;  // TITLES
      title.className = 'chart-title';
      card.appendChild(title);
    
      const canvas = document.createElement('canvas');
      canvas.id = `${tileId}-canvas-${i}`;
      card.appendChild(canvas);
      scrollWrapper.appendChild(card);
    
      fetchAndDrawChart(canvas, chart.column, currentChartTypes[tileId], chartRegistry);
    });
  });
}

export function applyChartStyle(tileId) {
  const dropdown = document.getElementById(`${tileId}Type`);
  if (!dropdown) return;

  currentChartTypes[tileId] = dropdown.value;
  buildSingleChartCards();
}

export function startAutoScroll(tileId) {
  const wrapper = document.getElementById(`${tileId}ScrollWrapper`);
  if (!wrapper) return;

  stopAutoScroll(tileId); // prevent double intervals

  carouselState[tileId].interval = setInterval(() => {
    wrapper.scrollBy({ left: wrapper.clientWidth, behavior: 'smooth' });

    // loop if scrolled to end
    if (wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 5) {
      wrapper.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, CONFIG.carouselInterval);
}

export function stopAutoScroll(tileId) {
  clearInterval(carouselState[tileId].interval);
  carouselState[tileId].interval = null;
}