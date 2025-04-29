import { startCarousel, applyChartStyle, prevChart, startManualCarousel } from './carousel.js';
import { updateMetricCards, setDatePickerLimits } from './metrics.js';
import { getChartTypesForTile, formatChartLabel } from './utils.js';
import { populateMlDogDropdown, populateFilterDogDropdown } from './ml.js';

// IM TIRED ASF MANE
import {
  updateFilterState,
  setCarouselsEnabled,
  carouselsEnabled,
  carouselState,
  carouselCharts
} from './config.js';

document.getElementById('carouselFilterForm').addEventListener('submit', e => {
  e.preventDefault();

  const dog = document.getElementById('selectDog').value;
  const date = document.getElementById('datePicker').value;
  const range = parseInt(document.getElementById('rangeDays').value, 10);
  const mode = document.getElementById('dateMode').value;
  const group = document.getElementById('carouselCategory').value;

  updateFilterState({ dog, date, range, mode });

  const allTiles = ['healthChart', 'vitalsChart', 'behaviourChart'];
  const tiles = group === 'all' ? allTiles : [group];

  allTiles.forEach(tileId => {
    clearInterval(carouselState[tileId].interval);
    carouselState[tileId].index = 0;
  
    if (tiles.includes(tileId)) {
      startCarousel(tileId); // only selected group start immediatekly
    } else {
      if (carouselsEnabled && group === 'all') {
        startCarousel(tileId);
      }
    }
  });
});

document.getElementById('carouselToggle').addEventListener('change', e => {
  const enabled = e.target.checked;
  setCarouselsEnabled(enabled);

  const group = document.getElementById('carouselCategory').value;
  const tiles = group === 'all'
    ? ['healthChart', 'vitalsChart', 'behaviourChart']
    : [group];

  if (!enabled) {
    tiles.forEach(tileId => clearInterval(carouselState[tileId].interval));
  } else {
    tiles.forEach(tileId => {
      carouselState[tileId].index = 0;
      startCarousel(tileId);
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  ['healthChart', 'vitalsChart', 'behaviourChart'].forEach(tileId => {
    startCarousel(tileId);
    const applyBtn = document.getElementById(`${tileId}ApplyBtn`);
    if (applyBtn) {
      applyBtn.addEventListener('click', () => applyChartStyle(tileId));
    }
    const dropdown = document.getElementById(`${tileId}Type`);
    if (dropdown) {
      const types = getChartTypesForTile(tileId);
      types.forEach(type => {
        const opt = document.createElement('option');
        opt.value = type;
        opt.textContent = formatChartLabel(type);
        dropdown.appendChild(opt);
      });
    }
  });

  document.querySelectorAll('[data-prev-tile]').forEach(btn => {
    const tileId = btn.getAttribute('data-prev-tile');
    btn.addEventListener('click', () => {
      prevChart(tileId);
    });
  });
  
  document.querySelectorAll('[data-next-tile]').forEach(btn => {
    const tileId = btn.getAttribute('data-next-tile');
    btn.addEventListener('click', () => {
      const nextIndex = (carouselState[tileId].index + 1) % carouselCharts[tileId].length;
      startManualCarousel(tileId, nextIndex);
    });
  });

  updateMetricCards();
  setDatePickerLimits('datePicker');
  setDatePickerLimits('mlStart');
  populateMlDogDropdown();
  populateFilterDogDropdown();
});