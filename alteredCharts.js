function makeChart(ctx, response, selectedColumn) {
    if (myChart) {
        myChart.destroy();
    }

    const chartTypeValue = chartTypeSelect.value;
    console.log("Selected Chart Type:", chartTypeValue);

    let labels = [];
    let data = [];

    const isNumeric = response.every(item => !isNaN(parseFloat(item[selectedColumn])));

    if (!isNumeric) {
        // Generic case: Count occurrences of each unique value in the selected column
        const counts = response.reduce((acc, item) => {
            const value = item[selectedColumn];
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});

        labels = Object.keys(counts); // Unique categorical values
        data = Object.values(counts); // Count of occurrences
    } else {
        // Numeric case: Map values directly
        labels = response.map(item => item['Hour']);
        data = response.map(item => {
            const value = parseFloat(item[selectedColumn]);
            return isNaN(value) ? 0 : value;
        });
    }

    console.log("Chart Labels:", labels);
    console.log("Chart Data:", data);

    myChart = new Chart(ctx, {
        type: chartTypeValue,
        data: {
            labels: labels,
            datasets: [{
                label: `Data for ${selectedColumn}`,
                data: data,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
            }]
        }
    });

    return myChart;
}
