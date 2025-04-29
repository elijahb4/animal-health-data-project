import { getColorForDog, formatDateTime, isCategoryColumn } from './utils.js';
import { currentDog, currentStartDate, currentRange, dateMode } from './config.js';

export function buildChartConfig(data, column, chartType, isCategory) {
  const dogs = [...new Set(data.map(r => r.DogID))];
  if (isCategory) {
    const cats = [...new Set(data.map(r => r[column] || 'Unknown'))];
    const datasets = dogs.map(dog => ({
      label: dog,
      data: cats.map(cat =>
        data.filter(r => r.DogID === dog && (r[column] || 'Unknown') === cat).length
      ),
      backgroundColor: getColorForDog(dog),
      borderColor: getColorForDog(dog),
      borderWidth: 1
    }));

    return {
      type: chartType,
      data: { labels: cats, datasets },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: column } },
          y: { beginAtZero: true }
        }
      }
    };
  } else {
    const datasets = dogs.map(dog => ({
      label: dog,
      data: data
        .filter(r => r.DogID === dog)
        .map(r => ({
          x: formatDateTime(r.Date, r.Hour),
          y: parseFloat(r[column]) || 0
        })),
      backgroundColor: getColorForDog(dog),
      borderColor: getColorForDog(dog),
      borderWidth: 2,
      fill: false,
      tension: 0.3,
      showLine: chartType === 'line'
    }));

    return {
      type: chartType === 'line' ? 'scatter' : chartType,
      data: { datasets },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              tooltipFormat: 'dd/MM/yyyy HH:mm',
              displayFormats: { hour: 'dd/MM HH:mm' }
            },
            title: { display: true, text: 'Time' }
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: column }
          }
        }
      }
    };
  }
}

export async function fetchAndDrawChart(canvasId, column, chartType, chartRegistry) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (chartRegistry[canvasId] && typeof chartRegistry[canvasId].destroy === 'function') {
    chartRegistry[canvasId].destroy();
  }

  const isCategory = isCategoryColumn(column);

  try {
    let sendDate = currentStartDate;
    if (!sendDate) {
      const d = await (await fetch('../php_scripts/getDates.php')).json();
      const [dd, mm, yy] = d.maxDate.split('-');
      sendDate = `${yy}-${mm}-${dd}`;
    }
    if (dateMode === 'to') {
      const end = new Date(sendDate);
      end.setDate(end.getDate() - (currentRange - 1));
      sendDate = end.toISOString().slice(0, 10);
    }

    const dateParam = sendDate.split('-').reverse().join('-'); // to dd-mm-yyyy
    const params = new URLSearchParams();
    params.append('DogID', currentDog);
    params.append('Date', dateParam);
    params.append('rangeDays', currentRange);
    ['Date', 'Hour', 'DogID', column].forEach(c => params.append('columns[]', c));

    const data = await (await fetch(`../php_scripts/getData.php?${params}`)).json();
    if (!data.length) return;

    const config = buildChartConfig(data, column, chartType, isCategory);
    chartRegistry[canvasId] = new Chart(ctx, config);
  } catch (err) {
    console.error("Error drawing chart:", err);
  }
}