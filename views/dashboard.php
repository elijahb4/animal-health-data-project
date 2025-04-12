<link rel="stylesheet" href="css/dashboard.css">

<div class="dashboard-container">
  <div class="metrics-bar">
    <div class="metric-card">
      <h4>Avg Calorie Burn</h4>
      <p id="metricCalories">Loading...</p>
    </div>
    <div class="metric-card">
      <h4>Avg Heart Rate</h4>
      <p id="metricHeartRate">Loading...</p>
    </div>
    <div class="metric-card">
      <h4>Food Intake</h4>
      <p id="metricFood">Loading...</p>
    </div>
    <div class="metric-card">
      <h4>Water Intake</h4>
      <p id="metricWater">Loading...</p>
    </div>
  </div>

  <div class="chart-card">
    <div class="chart-header">
      <button id="prev-chart">&#8592;</button>
      <h3 id="chart-title">Calorie Burn Overview</h3>
      <button id="next-chart">&#8594;</button>
    </div>
    <canvas id="mainChart"></canvas>
    <a href="index.php?page=analytics" class="view-more">View full analytics</a>
  </div>

  <div class="dog-highlight">
    <img src="assets/content/Screenshot_20250411_214200_Instagram.jpg" alt="Dog of the Day">
    <div>
      <h4>Dog of the Day</h4>
      <p>CANINE003 - Excellent performance in activity and health levels.</p>
    </div>
  </div>

  <div class="health-preview">
    <h4>Recent Health Alerts</h4>
    <ul>
      <li><strong>CANINE001</strong>: Unusual Temperature detected - <a href="index.php?page=health-data">View details</a></li>
      <li><strong>CANINE002</strong>: Low Activity - <a href="index.php?page=health-data">View details</a></li>
    </ul>
  </div>

</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="js/dashboard.js"></script>
