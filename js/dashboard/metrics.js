import { CONFIG } from './config.js';
import { isoToDDMMYYYY } from './utils.js';

export async function updateMetricCards() {
  const dogId = CONFIG.defaultDogId;
  const dateRes = await fetch('../php_scripts/getDates.php');
  const dateData = await dateRes.json();
  const maxDateDDMMYYYY = dateData.maxDate;

  const isoMaxDate = maxDateDDMMYYYY.split('-').reverse().join('-');
  const columns = ['Calorie Burn', 'Heart Rate (bpm)', 'Food Intake (calories)', 'Water Intake (ml)'];

  const maxDateObj = new Date(isoMaxDate);
  maxDateObj.setDate(maxDateObj.getDate() - 1);
  const isoYesterday = maxDateObj.toISOString().slice(0, 10);
  const yesterdayDDMMYYYY = isoToDDMMYYYY(isoYesterday);

  const currentParams = new URLSearchParams();
  const prevParams = new URLSearchParams();
  currentParams.append('DogID', dogId);
  currentParams.append('Date', maxDateDDMMYYYY);
  currentParams.append('rangeDays', 1);
  prevParams.append('DogID', dogId);
  prevParams.append('Date', yesterdayDDMMYYYY);
  prevParams.append('rangeDays', 1);
  columns.forEach(col => {
    currentParams.append('columns[]', col);
    prevParams.append('columns[]', col);
  });

  const recentData = await (await fetch(`../php_scripts/getData.php?${currentParams}`)).json();
  const prevData = await (await fetch(`../php_scripts/getData.php?${prevParams}`)).json();

  function avg(data, col) {
    const vals = data.map(d => parseFloat(d[col])).filter(n => !isNaN(n));
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  }

  columns.forEach(col => {
    const currentAvg = avg(recentData, col);
    const prevVal = avg(prevData, col);

    const id = col.includes('Calorie') ? 'Calories'
              : col.includes('Heart') ? 'HeartRate'
              : col.includes('Food') ? 'Food'
              : 'Water';

    document.getElementById(`metric${id}`).textContent = currentAvg?.toFixed(1) ?? 'N/A';
    const trendElem = document.getElementById(`metric${id}Trend`);

    if (prevVal !== null && currentAvg !== null) {
      const diff = currentAvg - prevVal;
      const absDiff = Math.abs(diff).toFixed(1);
      const className = diff > 0.1 ? 'trend-up' : diff < -0.1 ? 'trend-down' : 'trend-same';
      const text = diff > 0.1 ? `+${absDiff}` : diff < -0.1 ? `-${absDiff}` : '0.0';

      trendElem.textContent = text;
      trendElem.className = `trend-indicator ${className}`;
    } else {
      trendElem.textContent = '';
      trendElem.className = 'trend-indicator trend-same';
    }
  });
}

export async function setDatePickerLimits(inputId = 'datePicker') {
  try {
    const res = await fetch('../php_scripts/getDates.php');
    const data = await res.json();

    if (data.minDate && data.maxDate) {
      const min = data.minDate.split('-').reverse().join('-');
      const max = data.maxDate.split('-').reverse().join('-');
      const dateInput = document.getElementById(inputId);
      if (dateInput) {
        dateInput.min = min;
        dateInput.max = max;
        dateInput.value = max;
      }
    }
  } catch (err) {
    console.error("failed to fetch date limits:", err);
  }
}