async function fetchAndDrawChart(canvasId, column, chartType = 'line', rangeDays = 7) { // line be the default matey, range be the default matey
    try {
      const dogId = 'CANINE001';
      const dateRes = await fetch('getDates.php');
      const dateData = await dateRes.json();
      const maxDate = dateData.maxDate; // dd-mm-yyyy
  
      const params = new URLSearchParams();
      params.append('DogID', dogId);
      params.append('Date', `${maxDate.split('-').reverse().join('-')}`); // to yyyy-mm-dd
      params.append('rangeDays', rangeDays);
      params.append('columns[]', column);
  
      const response = await fetch(`getData.php?${params.toString()}`);
      const data = await response.json();
  
      const ctx = document.getElementById(canvasId).getContext('2d');
      const labels = data.map(d => d.Hour);
      const values = data.map(d => d[column]);
  
      new Chart(ctx, {
        type: chartType,
        data: {
          labels: labels,
          datasets: [{
            label: column,
            data: values,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.3
          }]
        }
      });
    } catch (e) {
      console.error(`Error loading ${column} chart`, e);
    }
  }
  
  window.onload = function () {
    fetchAndDrawChart('calorieChart', 'Calorie Burn');
    fetchAndDrawChart('heartRateChart', 'Heart Rate (bpm)'); // ensure column name is an exact match okay?
    fetchAndDrawChart('behaviourChart', 'Behaviour Pattern', 'bar', 1); // override defaults like dis --- this doesnt work yet ---
  };