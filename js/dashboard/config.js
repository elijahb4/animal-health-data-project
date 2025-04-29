export const chartRegistry = {};

export const CONFIG = {
  defaultDogId: 'CANINE001',
  carouselInterval: 7000,
  colorPalette: [
    'rgba(54,162,235,1)', 'rgba(75,192,192,1)', 'rgba(255,99,132,1)',
    'rgba(255,205,86,1)', 'rgba(201,203,207,1)', 'rgba(153,102,255,1)'
  ]
};

export const currentChartTypes = { // change this for diff defaults if u want
  healthChart: 'bar',
  vitalsChart: 'line',
  behaviourChart: 'radar'
};

export let currentDog = 'ALL';
export let currentStartDate = null;
export let currentRange = 1;
export let dateMode = 'from';
export let carouselsEnabled = true;

export function setCarouselsEnabled(value) {
  carouselsEnabled = value;
}

export const carouselState = {
  healthChart: { index: 0, interval: null },
  vitalsChart: { index: 0, interval: null },
  behaviourChart: { index: 0, interval: null }
};

export const carouselCharts = {
  healthChart: [
    { column: 'Calorie Burn', type: 'line', range: 7 },
    { column: 'Food Intake (calories)', type: 'line', range: 7 },
    { column: 'Water Intake (ml)', type: 'line', range: 7 },
    { column: 'Activity Level (steps)', type: 'line', range: 7 },
    { column: 'Weight (kg)', type: 'line', range: 7 }
  ],
  vitalsChart: [
    { column: 'Heart Rate (bpm)', type: 'line', range: 7 },
    { column: 'Temperature (C)', type: 'line', range: 7 },
    { column: 'Breathing Rate (breaths/min)', type: 'line', range: 7 }
  ],
  behaviourChart: [
    { column: 'Behaviour Pattern', type: 'bar', range: 1 },
    { column: 'Barking Frequency', type: 'bar', range: 1 }
  ]
};

export function updateFilterState({ dog, date, range, mode }) {
  currentDog = dog;
  currentStartDate = date;
  currentRange = range;
  dateMode = mode;
}