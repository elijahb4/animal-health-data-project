<link rel="stylesheet" href="css/dashboard.css">

<div class="view-container">
  <!-- dashboard overview metrics -->
  <div class="metrics-bar">
    <div class="card metric-card">
      <h4>Avg Calorie Burn</h4>
      <p id="metricCalories">Loading...</p>
      <span id="metricCaloriesTrend" class="trend-indicator"></span>
    </div>

    <div class="card metric-card">
      <h4>Avg Heart Rate</h4>
      <p id="metricHeartRate">Loading...</p>
      <span id="metricHeartRateTrend" class="trend-indicator"></span>
    </div>

    <div class="card metric-card">
      <h4>Food Intake</h4>
      <p id="metricFood">Loading...</p>
      <span id="metricFoodTrend" class="trend-indicator"></span>
    </div>

    <div class="card metric-card">
      <h4>Water Intake</h4>
      <p id="metricWater">Loading...</p>
      <span id="metricWaterTrend" class="trend-indicator"></span>
    </div>
  </div>

  <!-- chart filter stuff -->
  <div class="card interactive-filter">
    <div class="chart-header">
      <h3>Dashboard Chart Filter</h3>
    </div>
    <form id="carouselFilterForm">
      <div>
        <label for="selectDog">Dog ID:</label>
        <select id="selectDog" required></select>
      </div>
      <div>
        <label for="datePicker">Start Date:</label>
        <input type="date" id="datePicker" />
      </div>
      <div>
        <label for="rangeDays">Date Range:</label>
        <select id="rangeDays">
          <option value="1" selected>Last 1 Day</option>
          <option value="3">Last 3 Days</option>
          <option value="7">Last 7 Days</option>
          <option value="14">Last 14 Days</option>
          <option value="30">Last 30 Days</option>
        </select>
      </div>
      <div>
        <label for="dateMode">Date Mode:</label>
        <select id="dateMode">
          <option value="from" selected>From Selected Date</option>
          <option value="to">To Selected Date</option>
        </select>
      </div>
      <div>
        <label for="carouselCategory">Chart Group:</label>
        <select id="carouselCategory">
          <option value="all" selected>All Charts</option>
          <option value="healthChart">Health Charts</option>
          <option value="vitalsChart">Vitals Charts</option>
          <option value="behaviourChart">Behaviour Charts</option>
        </select>
      </div>

      <!-- apply all filters button -->
      <div>
        <button type="submit" class="btn">Apply Filter</button>
      </div>
      <div>
        <label><input type="checkbox" id="carouselToggle" checked> Auto-Rotate Carousels</label>
      </div>
    </form>
  </div>

  <!-- GRAPH tiles -->
  <div class="card chart-card" id="healthChartWrapper">
    <div class="chart-header">
      <h3 id="healthChartTitle">Health Trends</h3>
    </div>

    <div class="chart-style-controls">
      <label for="healthChartType">Health Trends Chart Style:</label>
      <select id="healthChartType" class="chart-style-dropdown"></select>
      <button id="healthChartApplyBtn" class="btn">Apply</button>
    </div>

    <div class="horizontal-scroll-wrapper" id="healthChartScrollWrapper"></div>

    <div class="chart-links">
      <a href="index.php?page=analytics" class="chart-link">📊 See full analytics</a>
      <a href="index.php?page=records" class="chart-link">📁 Explore health records</a>
      <a href="index.php?page=health-trends" class="chart-link">📈 Study health trends</a>
    </div>
  </div>

  <div class="card chart-card" id="vitalsChartWrapper">
    <div class="chart-header">
      <h3 id="vitalsChartTitle">Vitals Overview</h3>
    </div>

    <div class="chart-style-controls">
      <label for="vitalsChartType">Vitals Overview Chart Style:</label>
      <select id="vitalsChartType" class="chart-style-dropdown"></select>
      <button id="vitalsChartApplyBtn" class="btn">Apply</button>
    </div>

    <div class="horizontal-scroll-wrapper" id="vitalsChartScrollWrapper"></div>

    <div class="chart-links">
      <a href="index.php?page=analytics" class="chart-link">📊 See full analytics</a>
      <a href="index.php?page=records" class="chart-link">📁 Explore health records</a>
      <a href="index.php?page=health-trends" class="chart-link">📈 Study health trends</a>
    </div>
  </div>

  <div class="card chart-card" id="behaviourChartWrapper">
    <div class="chart-header">
      <h3 id="behaviourChartTitle">Behaviour & Movement</h3>
    </div>

    <div class="chart-style-controls">
      <label for="behaviourChartType">Behaviour & Movement Chart Style:</label>
      <select id="behaviourChartType" class="chart-style-dropdown"></select>
      <button id="behaviourChartApplyBtn" class="btn">Apply</button>
    </div>

    <div class="horizontal-scroll-wrapper" id="behaviourChartScrollWrapper"></div>

    <div class="chart-links">
      <a href="index.php?page=analytics" class="chart-link">📊 See full analytics</a>
      <a href="index.php?page=records" class="chart-link">📁 Explore health records</a>
      <a href="index.php?page=health-trends" class="chart-link">📈 Study health trends</a>
    </div>
  </div>

  <!-- doggy highlight thing idk -->
  <div class="card dog-highlight">
    <img src="assets/content/Screenshot_20250411_214200_Instagram.jpg" alt="Dog of the Day">
    <div>
      <h3>Dog of the Day</h3>
      <p>CANINE003 - Huge appetite and endless energy.</p>
    </div>
  </div>

  <div class="card health-preview">
    <h3>Recent Health Alerts</h3>
    <ul>
      <li>Placeholder for recent notification 1</li>
      <li>Placeholder for recent notification 2</li>
      <li>🔔 <a href="index.php?page=notifications">View all recent health alerts</a></li>
    </ul>
  </div>

  <script type="module" src="../js/dashboard/main.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns"></script>
</div>
