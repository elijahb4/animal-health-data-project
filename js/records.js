let currentData = [];
const CSV_PATH = '/../database/activityData.csv';
let minDate = null;
let maxDate = null;

//html elements
const queryForm = document.getElementById("dataQuery")
const container = document.getElementById("checkboxContainer");
const selectElement = document.getElementById('selectDog');
const datePicker = document.getElementById("datePicker");
const table = document.getElementById('csvTable');
const downloadButtons = document.getElementById('download-button-container');

//global event listeners
queryForm.addEventListener("submit", queryData)

//Invoked immediately to populate the get dogs select input
async function getDogs () {
  try {
    const response = await fetch('/../php_scripts/getDates.php');
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
      const response = await fetch('../php_scripts/getDates.php');
      const data = await response.json();
      console.log("Min Date:", data.minDate, "Max Date:", data.maxDate);
      if (data.error) {
          console.error(data.error);
          alert(data.error);
      } else {
          minDate = formatDateToISO(data.minDate);
          maxDate = formatDateToISO(data.maxDate);
      }
  } catch (err) {
      console.error('Fetch error:', err);
  }
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

//Export PDF
function makePDF() {
  const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent);
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(row => {
        return Array.from(row.querySelectorAll('td')).map(td => td.textContent);
    });

    const columnStyles = {};
    headers.forEach((header, index) => {
        columnStyles[index] = { cellWidth: 'auto', halign: 'center' };
    });

    doc.autoTable({
        head: [headers],
        body: rows,
        startY: 20,
        margin: { horizontal: 10 },
        styles: { fontSize: 11, overflow: 'linebreak' },
        headStyles: { fillColor: [14, 26, 64] },
        columnStyles: columnStyles
    });

    doc.save('table.pdf');
  };

//Export PNG
function downloadBitmap() {
  // clone container OUTSIDE BOUNDS omg no clip bakcrooms reference
  const cloneContainer = document.createElement('div');
  cloneContainer.style.position = 'absolute';
  cloneContainer.style.top = '-9999px'; // out of sight out of mind
  cloneContainer.style.left = '-9999px';
  cloneContainer.style.width = 'auto';
  cloneContainer.style.maxWidth = 'none'; // NECESSARY FO PERFECT PNG! requires full size for no squishy or misalignment issues
  cloneContainer.style.background = 'white'; // white bg can be customized

  const clonedTable = table.cloneNode(true);
  clonedTable.style.width = 'auto'; // natural size!!! again same here
  clonedTable.style.maxWidth = 'none'; 
  cloneContainer.appendChild(clonedTable);

  document.body.appendChild(cloneContainer); // add to DOM

  html2canvas(cloneContainer, { scale: 2 }).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'table.png';
      link.click();

      // Clean up
      document.body.removeChild(cloneContainer);
  });
}

//Export JSON Data
function exportJSON() {
  const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent);
  const rows = Array.from(table.querySelectorAll('tbody tr'));

  const data = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td'));
      const rowData = {};
      cells.forEach((cell, i) => {
          rowData[headers[i]] = cell.textContent;
      });
      return rowData;
  });

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'table.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

//Export Data is CSV Format
function exportCSV() {
  const rows = Array.from(table.querySelectorAll('tr'));
  const csv = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('th, td'));
      return cells.map(cell => `"${cell.textContent}"`).join(',');
  }).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'table.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function queryData(event) {
  event.preventDefault();
  const startDate = datePicker.value;
  const rangeDays = parseInt(document.getElementById("rangeDays").value, 10);
  const dog = selectElement.value;
  const endDate = addDaysToUTCDate(startDate, rangeDays);

  Papa.parse(CSV_PATH, {
    download: true,
    header: false,
    dynamicTyping: true,
    complete: function (results) {
      currentData = results.data;
      headers = currentData.shift();
  
      const dateIndex = headers.indexOf('Date');
      if (dateIndex === -1) {
        console.error("Date column not found in headers.");
        return;
      }
      const dogIndex = headers.indexOf('DogID');
  
      filteredData = currentData.filter(row => {
        const rowDate = row[dateIndex];
        const matchesDate = (!startDate && !endDate) || (
          (!startDate || new Date(rowDate) >= new Date(startDate)) &&
          (!endDate || new Date(rowDate) <= new Date(endDate))
        );
        const matchesDog = (row[dogIndex] == dog);

        return matchesDate && matchesDog;
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

  downloadButtons.innerHTML = `<button class="btn" id="pdfButton">Download as PDF</button> <button class="btn" id="pngButton">Download as PNG</button> <button class="btn" id="jsonButton">Export data as JSON</button> <button class="btn" id="csvButton">Export data as CSV</button>`;
    const pdfButton = document.getElementById('pdfButton');
    const pngButton = document.getElementById('pngButton');
    const jsonButton = document.getElementById('jsonButton');
    const csvButton = document.getElementById('csvButton');
    pdfButton.addEventListener('click', makePDF);
    pngButton.addEventListener('click', downloadBitmap);
    jsonButton.addEventListener('click', () => exportJSON());
    csvButton.addEventListener('click', () => exportCSV());
}

document.addEventListener('DOMContentLoaded', () => {
  getDogs();
  fetchDates();
});
