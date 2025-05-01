import { initMlPredictionForm, populateMlDogDropdown  } from './dashboard/ml.js';
import { setDatePickerLimits } from './dashboard/metrics.js';

document.addEventListener('DOMContentLoaded', () => {
  initMlPredictionForm();
  populateMlDogDropdown();
  setDatePickerLimits('mlStart');
});