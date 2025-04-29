import { applyChartStyle, buildSingleChartCards, startAutoScroll, stopAutoScroll } from './carousel.js';
import { updateMetricCards, setDatePickerLimits } from './metrics.js';
import { getChartTypesForTile, formatChartLabel } from './utils.js';
import { populateMlDogDropdown, populateFilterDogDropdown } from './ml.js';
import { updateFilterState, setCarouselsEnabled, carouselsEnabled } from './config.js';

const allTiles = ['healthChart', 'vitalsChart', 'behaviourChart'];

document.addEventListener('DOMContentLoaded', () => {
  buildSingleChartCards(); // build and draw charts on load

  allTiles.forEach(tileId => {
    const dropdown = document.getElementById(`${tileId}Type`);
    const applyBtn = document.getElementById(`${tileId}ApplyBtn`);
    const wrapper = document.getElementById(`${tileId}ScrollWrapper`);

    if (dropdown) {
      getChartTypesForTile(tileId).forEach(type => {
        const opt = document.createElement('option');
        opt.value = type;
        opt.textContent = formatChartLabel(type);
        dropdown.appendChild(opt);
      });
    }

    if (applyBtn) {
      applyBtn.addEventListener('click', () => applyChartStyle(tileId));
    }

    if (wrapper) {
      wrapper.addEventListener('wheel', evt => {
        if (evt.deltaY !== 0) {
          evt.preventDefault();
          wrapper.scrollBy({ left: evt.deltaY, behavior: 'smooth' });
        }
      });

      if (carouselsEnabled) startAutoScroll(tileId);
    }
  });

  updateMetricCards();
  setDatePickerLimits('datePicker');
  setDatePickerLimits('mlStart');
  populateMlDogDropdown();
  populateFilterDogDropdown();
});

document.getElementById('carouselToggle').addEventListener('change', e => {
  const enabled = e.target.checked;
  setCarouselsEnabled(enabled);

  allTiles.forEach(tileId => {
    if (enabled) {
      startAutoScroll(tileId);
    } else {
      stopAutoScroll(tileId);
    }
  });
});

document.getElementById('carouselFilterForm').addEventListener('submit', e => {
  e.preventDefault();

  const dog = document.getElementById('selectDog').value;
  const date = document.getElementById('datePicker').value;
  const range = parseInt(document.getElementById('rangeDays').value, 10);
  const mode = document.getElementById('dateMode').value;
  const group = document.getElementById('carouselCategory').value;

  updateFilterState({ dog, date, range, mode });

  const groupsToUpdate = group === 'all'
    ? ['healthChart', 'vitalsChart', 'behaviourChart']
    : [group];

  buildSingleChartCards(groupsToUpdate);

  if (carouselsEnabled) {
    groupsToUpdate.forEach(tileId => startAutoScroll(tileId));
  }
});