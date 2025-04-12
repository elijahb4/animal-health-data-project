let currentData = [];
const CSV_PATH = '/../database/activityData.csv';
let minDate = null;
let maxDate = null;

//html elements
const queryForm = document.getElementById("dataQuery")
const container = document.getElementById("checkboxContainer");
const selectElement = document.getElementById('selectDog');
const datePicker = document.getElementById("datePicker");
const expandButton = document.getElementById('expandCheckboxes');

//global event listeners
queryForm.addEventListener("submit", queryData)

//Expand/collapse the checkboxes
expandButton.addEventListener('click', () => {
  const isVisible = checkboxContainer.style.display === 'block';
  container.style.display = isVisible ? 'none' : 'block';
  expandButton.textContent = isVisible ? 'Show Options ▼' : 'Hide Options ▲';
});

async function getDogs () {
  try {
    const response = await fetch('/../php_scripts/getDogs.php');
    const data = await response.json();
    const selectElement = document.getElementById('selectDog');
    data.forEach(dog => {
      const option = document.createElement('option');
      option.value = dog;
      option.textContent = dog;
      selectElement.appendChild(option);
    });
    }
  catch (e) {
    console.error("Parsing Error");
  }
}

async function fetchDates() {
  try {
      const response = await fetch('/../php_scripts/getDates.php');
      const data = await response.json();
      console.log("Min Date:", data.minDate, "Max Date:", data.maxDate);
      if (data.error) {
          console.error(data.error);
          alert(data.error);
      } else {
          minDate = formatDateToISO(data.minDate);
          maxDate = formatDateToISO(data.maxDate);
          //setDateRange(minDate, maxDate);
      }
  } catch (err) {
      console.error('Fetch error:', err);
  }
}

/*function setDateRange(minDate, maxDate) {
  const datePicker = document.getElementById('datePicker');
  datePicker.min = minDate;
  datePicker.max = maxDate;
  datePicker.value = maxDate; // default date is the latest entry in csv
}*/

async function selectdata() {
  const response = await fetch('/../php_scripts/getHeaders.php');
  const data = await response.json();
  data.forEach(column => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '6px';
    wrapper.style.marginBottom = '4px';
        
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = column.toLowerCase();
    checkbox.name = 'columns';
    checkbox.value = column;
        
    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.textContent = column;
        
    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  })
}

function formatDateToISO(dateString) {
  const [day, month, year] = dateString.split("-");
  return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
}

function addDaysToUTCDate(selectedDate, rangeDays) {
  const [year, month, day] = selectedDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + rangeDays);
  return date;
}

async function queryData(event) {
  event.preventDefault();

  const checkedBoxes = document.querySelectorAll('input[name="columns"]:checked');
  const selectedCategories = Array.from(checkedBoxes).map(checkbox => checkbox.value);
  
  if (selectedCategories.length === 0) {
      alert("Please select at least one category to filter by.");
      return;
  }
  
  const startDate = datePicker.value;
  const rangeDays = parseInt(document.getElementById("rangeDays").value, 10);
  /*if (isNaN(rangeDays)) {
      alert("Please enter a valid number for the range of days.");
      return;
  }*/
  const endDate = addDaysToUTCDate(startDate, rangeDays);

  Papa.parse(CSV_PATH, {
    download: true,
    header: false, // Treat rows as arrays
    dynamicTyping: true,
    complete: function (results) {
      currentData = results.data;
      headers = currentData.shift(); // Assume the first row contains headers
  
      const dateIndex = headers.indexOf('Date');
      if (dateIndex === -1) {
        console.error("Date column not found in headers.");
        return;
      }
  
      filteredData = currentData.filter(row => {
        const matchesCategories = selectedCategories.length === 0 || selectedCategories.some(category => {
          const categoryIndex = headers.indexOf(category);
          return categoryIndex !== -1 && row[categoryIndex] !== undefined;
        });
        const rowDate = row[dateIndex];
        const matchesDate = (!startDate && !endDate) || (
          (!startDate || new Date(rowDate) >= new Date(startDate)) &&
          (!endDate || new Date(rowDate) <= new Date(endDate))
        );
  
        return matchesCategories && matchesDate;
      });
  
      renderTable([headers, ...filteredData]);
    },
    error: function (error) {
      console.error("Error parsing CSV:", error);
      alert("Failed to load data. Please try again.");
    }
  });
}

function renderTable(data, sortColumn = null, sortDirection = 'asc') {
  const table = document.getElementById('csvTable');
  table.innerHTML = '';

  if (!data || data.length === 0) {
    const noDataMessage = document.createElement('p');
    noDataMessage.textContent = "No data available to display.";
    table.appendChild(noDataMessage);
    return;
  }

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headers = data[0];

  headers.forEach((header, index) => {
    const th = document.createElement('th');
    th.textContent = header;
    th.addEventListener('click', () => {
      const direction = (sortColumn === index && sortDirection === 'asc') ? 'desc' : 'asc';
      const sorted = [...data.slice(1)].sort((a, b) => {
        const aVal = a[index];
        const bVal = b[index];
        const numA = parseFloat(aVal);
        const numB = parseFloat(bVal);
        if (!isNaN(numA) && !isNaN(numB)) {
          return direction === 'asc' ? numA - numB : numB - numA;
        } else {
          return direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
      });
      renderTable([headers, ...sorted], index, direction);
    });

    if (index === sortColumn) {
      th.classList.add(sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
    }
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  data.slice(1).forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

document.addEventListener('DOMContentLoaded', () => {
  getDogs();
  fetchDates();
  selectdata();
});