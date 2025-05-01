<link rel="stylesheet" href="css/health-trends.css">

<div class="view-container">
    <!-- prediction tile -->
    <div class="card prediction-tile">
        <div class="prediction-header">
        <h3>Predicted Trends</h3>
        <p>Forecast future values using various machine learning models including Linear Regression, Polynomial Regression, Support Vector Regression, and Random Forest.</p>
        </div>

        <form id="mlPredictionForm" class="prediction-form">
            <label for="mlModel">Prediction Model:</label>
            <select id="mlModel" required>
                <option value="linear" selected>Linear Regression</option>
                <option value="polynomial">Polynomial Regression</option>
                <option value="svr">Support Vector Regression</option>
                <option value="rf">Random Forest</option>
            </select>

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
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns"></script>
<script type="module" src="../js/health-trends.js"></script>