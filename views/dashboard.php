<link rel="stylesheet" href="css/dashboard.css">

<div class="dashboard-container">
<!-- dashboard overview metrics -->
  <div class="metrics-bar">
    <div class="metric-card">
      <h4>Avg Calorie Burn</h4>
      <p>N/A</p>
    </div>
    <div class="metric-card">
      <h4>Avg Heart Rate</h4>
      <p>N/A</p>
    </div>
    <div class="metric-card">
      <h4>Food Intake</h4>
      <p>N/A</p>
    </div>
    <div class="metric-card">
      <h4>Water Intake</h4>
      <p>N/A</p>
    </div>
  </div>

  <!-- GRAPH tiles -->
  <div class="chart-card">
    <div class="chart-header">
      <h3>Average Calorie Burn (Last 7 Days)</h3>
    </div>
    <canvas id="calorieChart" width="800" height="400"></canvas>
  </div>

  <div class="chart-card">
    <div class="chart-header">
      <h3>Average Heart Rate (Last 7 Days)</h3>
    </div>
    <canvas id="heartRateChart" width="800" height="400"></canvas>
  </div>

  <div class="chart-card">
    <div class="chart-header">
      <h3>Behaviour Pattern Distribution (Latest Day)</h3>
    </div>
    <canvas id="behaviourChart" width="800" height="400"></canvas>
  </div>
</div>

  <!-- doggy highlight thing idk -->
  <div class="dog-highlight">
    <img src="assets/content/GWFbN43WsAAAmLv.jpeg" alt="Dog of the Day">
    <div>
      <h4>Dog of the Day</h4>
      <p>CANINE003 - Excellent performance in activity and health levels.</p>
    </div>
  </div>

  <!-- alert -->
  <div class="health-preview">
    <h4>Recent Health Alerts</h4>
    <ul>
      <li><strong>CANINE001</strong>: Unusual Temperature detected - <a href="index.php?page=health-data">View details</a></li>
      <li><strong>CANINE002</strong>: Low Activity - <a href="index.php?page=health-data">View details</a></li>
    </ul>
  </div>

  <!-- THIS IS FOR TESTING PURPOSES. MAY BE DELETED SOON -->
  <form id="dataQuery">
    <label for="selectDog">Dog ID:</label>
    <select id="selectDog" required></select>

    <label for="dataSelect">Metric:</label>
    <select id="dataSelect" required></select>

    <label for="chartTypes">Chart Type:</label>
    <select id="chartTypes" required></select>

    <label for="datePicker">Start Date:</label> <!-- default value set in js -->
    <input type="date" id="datePicker" />

    <label for="rangeDays">Select Range:</label>
    <select id="rangeDays" name="rangeDays">
      <option value="1">Last 1 Day</option>
      <option value="3">Last 3 Days</option>
      <option value="7" selected>Last 7 Days</option> <!-- a week as default -->
      <option value="14">Last 14 Days</option>
      <option value="30">Last 30 Days</option>
    </select>

    <input type="submit" value="Generate Chart" />
  </form>

  <canvas id="myChart" width="800" height="400"></canvas>

  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js"></script>
  <script src="js/dashboardCharts.js"></script>
  <script src="getDogs.js"></script>
  <script src="charts.js"></script>

</div>

