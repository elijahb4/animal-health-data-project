<link rel="stylesheet" href="css/dashboard.css">

<div class="dashboard-container">
  <!-- dashboard overview metrics -->
  <div class="metrics-bar">
    <div class="metric-card">
      <h4>Avg Calorie Burn</h4>
      <p id="metricCalories">Loading...</p>
      <span id="metricCaloriesTrend" class="trend-indicator"></span>
    </div>

    <div class="metric-card">
      <h4>Avg Heart Rate</h4>
      <p id="metricHeartRate">Loading...</p>
      <span id="metricHeartRateTrend" class="trend-indicator"></span>
    </div>

    <div class="metric-card">
      <h4>Food Intake</h4>
      <p id="metricFood">Loading...</p>
      <span id="metricFoodTrend" class="trend-indicator"></span>
    </div>

    <div class="metric-card">
      <h4>Water Intake</h4>
      <p id="metricWater">Loading...</p>
      <span id="metricWaterTrend" class="trend-indicator"></span>
    </div>
  </div>

  <!-- chart filter stuff -->
  <div class="interactive-filter">
    <h2 style="margin-bottom: 1rem; font-size: 1.2rem;">Filter Dashboard Charts</h2>
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
          <option value="from" selected>From selected date</option>
          <option value="to">To selected date</option>
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

      <div>
        <button type="submit" class="submit-btn">Apply Filter</button>
      </div>
    </form>
  </div>

  <!-- GRAPH tiles -->
  <h2 class="section-label">Health Trends</h2>
    <div class="chart-card" id="healthChartWrapper">
      <div class="chart-header">
        <h3 id="healthChartTitle">Health Trends</h3>
      </div>
      <div class="chart-canvas-wrapper">
        <button class="carousel-btn left" onclick="prevChart('healthChart')">‹</button>
        <canvas id="healthChart" class="show"></canvas>
        <button class="carousel-btn right" onclick="nextChart('healthChart')">›</button>
      </div>
      <div class="chart-dots" id="healthChartDots"></div>
      <div class="chart-links">
        <a href="analytics.php" class="chart-link">📊 See full analytics</a>
        <a href="records.php" class="chart-link">📁 Explore health records</a>
      </div>
    </div>
    
    <h2 class="section-label">Vitals Overview</h2>
    <div class="chart-card" id="vitalsChartWrapper">
      <div class="chart-header">
        <h3 id="vitalsChartTitle">Vitals Overview</h3>
      </div>
      <div class="chart-canvas-wrapper">
        <button class="carousel-btn left" onclick="prevChart('vitalsChart')">‹</button>
        <canvas id="vitalsChart" class="show"></canvas>
        <button class="carousel-btn right" onclick="nextChart('vitalsChart')">›</button>
      </div>
      <div class="chart-dots" id="vitalsChartDots"></div>
      <div class="chart-links">
        <a href="analytics.php" class="chart-link">📊 See full analytics</a>
        <a href="records.php" class="chart-link">📁 Explore health records</a>
      </div>
    </div>
    
    <h2 class="section-label">Behaviour Insights</h2>
    <div class="chart-card" id="behaviourChartWrapper">
      <div class="chart-header">
        <h3 id="behaviourChartTitle">Behaviour & Movement</h3>
      </div>
      <div class="chart-canvas-wrapper">
        <button class="carousel-btn left" onclick="prevChart('behaviourChart')">‹</button>
        <canvas id="behaviourChart" class="show"></canvas>
        <button class="carousel-btn right" onclick="nextChart('behaviourChart')">›</button>
      </div>
      <div class="chart-dots" id="behaviourChartDots"></div>
      <div class="chart-links">
        <a href="analytics.php" class="chart-link">📊 See full analytics</a>
        <a href="records.php" class="chart-link">📁 Explore health records</a>
      </div>
    </div>

  <!-- doggy highlight thing idk -->
  <div class="dog-highlight">
    <img src="assets/content/Screenshot_20250411_214200_Instagram.jpg" alt="Dog of the Day">
    <div>
      <h4>Dog of the Day</h4>
      <p>CANINE003 - Huge appetite and endless energy.</p>
    </div>
  </div>

  <div class="health-preview">
    <h4>Recent Health Alerts</h4>
    <ul>
      <li><strong>CANINE001</strong>: Unusual Temperature detected - <a href="index.php?page=health-data">View details</a></li>
      <li><strong>CANINE002</strong>: Low Activity - <a href="index.php?page=health-data">View details</a></li>
    </ul>
  </div>

  <!-- prediction tile -->
  <section class="prediction-tile">
    <div class="prediction-header">
      <h3>Predicted Trends</h3>
      <p>Forecast future values using machine learning</p>
    </div>

    <form id="mlPredictionForm" class="prediction-form">
      <div>
        <label for="mlDog">Dog ID:</label>
        <select id="mlDog"></select>
      </div>

      <div>
        <label for="mlMetric">Metric:</label>
        <select id="mlMetric">
          <option value="Calorie Burn">Calorie Burn</option>
          <option value="Heart Rate (bpm)">Heart Rate (bpm)</option>
          <option value="Food Intake (calories)">Food Intake</option>
          <option value="Water Intake (ml)">Water Intake</option>
        </select>
      </div>

      <div>
        <label for="mlStart">Start Date:</label>
        <input type="date" id="mlStart">
      </div>

      <div>
        <label for="mlDays">Predict Next (Days):</label>
        <select id="mlDays">
          <option value="1">1</option>
          <option value="3">3</option>
          <option value="7" selected>7</option>
          <option value="14">14</option>
          <option value="30">30</option>
        </select>
      </div>

      <button type="submit">Generate Prediction</button>
    </form>

    <canvas id="mlPredictionChart"></canvas>
  </section>


  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js"></script>
  <script src="js/getDogs.js"></script>
  <script src="js/charts.js"></script>
  <script src="js/dashboardCharts.js"></script>
</div>
