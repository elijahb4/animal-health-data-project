let currentData = [];
const CSV_PATH = '/../database/activityData.csv';

Papa.parse(CSV_PATH, {
  download: true,
  complete: function (results) {
    const data = results.data.filter(row => row.length > 1);
    renderTable(data);
    }
});

    function renderTable(data, sortColumn = null, sortDirection = 'asc') {
      const table = document.getElementById('csvTable');
      table.innerHTML = '';

      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      data[0].forEach((cell, index) => {
        const th = document.createElement('th');
        th.textContent = cell;
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
          renderTable([data[0], ...sorted], index, direction);
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