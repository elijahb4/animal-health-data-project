const chartFiles = [
    { file: 'data/chart_data_calories.json', title: 'Calorie Burn Overview' },
    { file: 'data/chart_data_heartrate.json', title: 'Average Heart Rate by Hour' },
    { file: 'data/chart_data_water.json', title: 'Water Intake by Hour' },
    { file: 'data/chart_data_food.json', title: 'Food Intake by Hour' }
];
  
let currentChart = 0;
let chartInstance = null;

function loadChart(index) {
const chartMeta = chartFiles[index];
fetch(chartMeta.file)
    .then(response => response.json())
    .then(data => {
    const ctx = document.getElementById('mainChart').getContext('2d');

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
        responsive: true,
        plugins: {
            title: {
            display: true,
            text: chartMeta.title,
            font: { size: 18 }
            },
            legend: { display: false }
        },
        scales: {
            x: { title: { display: true, text: 'Hour of Day' } },
            y: { title: { display: true, text: 'Value' } }
        }
        }
    });

    document.getElementById('chart-title').textContent = chartMeta.title;
    });
}

document.getElementById('prev-chart').addEventListener('click', () => {
currentChart = (currentChart - 1 + chartFiles.length) % chartFiles.length;
loadChart(currentChart);
});

document.getElementById('next-chart').addEventListener('click', () => {
currentChart = (currentChart + 1) % chartFiles.length;
loadChart(currentChart);
});

loadChart(currentChart);