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
    <h2 style="margin-bottom: 1rem; font-size: 1.2rem;">Dashboard Chart Filter</h2>
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
  <h2 class="section-label">Health Trends</h2>
  <div class="card chart-card" id="healthChartWrapper">
    <div class="chart-header">
      <h3 id="healthChartTitle">Health Trends</h3>
    </div>
    <div class="chart-style-controls">
        <label for="healthChartType">Health Trends Chart Style:</label>
        <select id="healthChartType" class="chart-style-dropdown"></select>
        <button id="healthChartApplyBtn" class="btn">Apply</button>
      </div>
    <div class="chart-canvas-wrapper">
      <button class="carousel-btn left" data-prev-tile="healthChart">‹</button>
      <canvas id="healthChart" class="show"></canvas>
      <button class="carousel-btn right" data-next-tile="healthChart">›</button>
    </div>
    <div class="chart-dots" id="healthChartDots"></div>
    <div class="chart-links">
      <a href="index.php?page=analytics" class="chart-link">📊 See full analytics</a>
      <a href="index.php?page=records" class="chart-link">📁 Explore health records</a>
      <a href="index.php?page=health-trends" class="chart-link">📈 Study health trends</a>
    </div>
  </div>
  
  <h2 class="section-label">Vitals Overview</h2>
  <div class="card chart-card" id="vitalsChartWrapper">
    <div class="chart-header">
      <h3 id="vitalsChartTitle">Vitals Overview</h3>
    </div>
    <div class="chart-style-controls">
        <label for="vitalsChartType">Vitals Overview Chart Style:</label>
        <select id="vitalsChartType" class="chart-style-dropdown"></select>
        <button id="vitalsChartApplyBtn" class="btn">Apply</button>
      </div>
    <div class="chart-canvas-wrapper">
      <button class="carousel-btn left" data-prev-tile="vitalsChart">‹</button>
      <canvas id="vitalsChart" class="show"></canvas>
      <button class="carousel-btn right" data-next-tile="vitalsChart ">›</button>
    </div>
    <div class="chart-dots" id="vitalsChartDots"></div>
    <div class="chart-links">
      <a href="index.php?page=analytics" class="chart-link">📊 See full analytics</a>
      <a href="index.php?page=records" class="chart-link">📁 Explore health records</a>
      <a href="index.php?page=health-trends" class="chart-link">📈 Study health trends</a>
    </div>
  </div>
  
  <h2 class="section-label">Behaviour Insights</h2>
  <div class="card chart-card" id="behaviourChartWrapper">
    <div class="chart-header">
      <h3 id="behaviourChartTitle">Behaviour & Movement</h3>
    </div>
    <div class="chart-style-controls">
        <label for="behaviourChartType">Behaviour & Movement Chart Style:</label>
        <select id="behaviourChartType" class="chart-style-dropdown"></select>
        <button id="behaviourChartApplyBtn" class="btn">Apply</button>
      </div>
    <div class="chart-canvas-wrapper">
      <button class="carousel-btn left" data-prev-tile="behaviourChart">‹</button>
      <canvas id="behaviourChart" class="show"></canvas>
      <button class="carousel-btn right" data-next-tile="behaviourChart">›</button>
    </div>
    <div class="chart-dots" id="behaviourChartDots"></div>
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

  <!-- prediction tile -->
  <div class="card prediction-tile">
    <div class="prediction-header">
      <h3>Predicted Trends</h3>
      <p>Forecast future values using the Linear Regression Machine Learning model in a time series.</p>
    </div>

    <form id="mlPredictionForm" class="prediction-form">
      <div>
        <label for="mlDog">Dog ID:</label>
        <select id="mlDog" required></select>
      </div>

      <div>
        <label for="mlMetric">Metric:</label>
        <select id="mlMetric" required>
          <option value="Calorie Burn" selected>Calorie Burn</option>
          <option value="Heart Rate (bpm)">Heart Rate (bpm)</option>
          <option value="Food Intake (calories)">Food Intake</option>
          <option value="Water Intake (ml)">Water Intake</option>
        </select>
      </div>

      <div>
        <label for="mlStart">Start Date:</label>
        <input type="date" id="mlStart" required>
      </div>

      <div>
        <label for="mlTrainingDays">Training Days</label>
        <input type="number" id="mlTrainingDays" name="mlTrainingDays" min="7" max="90" value="30" required>
      </div>

      <div>
        <label for="mlDays">Predict Next (Days):</label>
        <select id="mlDays" required>
          <option value="1">1</option>
          <option value="3">3</option>
          <option value="7" selected>7</option>
          <option value="14">14</option>
          <option value="30">30</option>
        </select>
      </div>

      <button type="submit" class="btn">Generate Prediction</button>
    </form>

    <canvas id="mlPredictionChart"></canvas>
  </div>
  
  <script type="module" src="js/dashboard/main.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns"></script>
</div>
