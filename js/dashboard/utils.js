import { CONFIG } from './config.js';

export function getColorForDog(dog) {
  if (!getColorForDog.colorMap) getColorForDog.colorMap = {};
  if (!getColorForDog.colorIndex) getColorForDog.colorIndex = 0;

  if (!getColorForDog.colorMap[dog]) {
    const color = CONFIG.colorPalette[getColorForDog.colorIndex % CONFIG.colorPalette.length];
    getColorForDog.colorMap[dog] = color;
    getColorForDog.colorIndex++;
  }
  
  return getColorForDog.colorMap[dog];
}

export function isoToDDMMYYYY(isoDate) {
  const [year, month, day] = isoDate.split('-');
  return `${day}-${month}-${year}`;
}

export function formatDateTime(date, hour) {
  if (!date || !hour) return null;
  const [day, month, year] = date.split('-'); // expects dd-mm-yyyy
  return `${year}-${month}-${day}T${hour.padStart(2, '0')}:00:00Z`;
}

export function isCategoryColumn(column) {
  return ['Behaviour Pattern', 'Barking Frequency'].includes(column);
}

export const CHART_TYPE_COMPAT = {
  numeric: ['line', 'bar', 'scatter', 'bubble'],
  categorical: ['bar', 'pie', 'doughnut', 'polarArea', 'radar']
};

export function getChartTypesForTile(tileId) {
  return tileId === 'behaviourChart' ? CHART_TYPE_COMPAT.categorical : CHART_TYPE_COMPAT.numeric;
}

export function formatChartLabel(chartType) {
  return chartType
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, c => c.toUpperCase());
}