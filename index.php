<?php

?>
<!doctype html>
<!-- This is just a mockup page to show the client, do not develop it further in the way that it has been -->
<html lang="en">
    <head>
        <title>Analytics</title>
        <!-- Required meta tags -->
        <meta charset="utf-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <!-- Bootstrap CSS v5.2.1 -->
        <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
            crossorigin="anonymous"
        />
        <!-- custom css (global styles)-->
        <link
            href="css/global.css"
            rel="stylesheet"
        />
    </head>
    <!--html page content-->
    <body>
        <div class="container-fluid">
            <div class="row">
                <div id="header-container">
                <?php include __DIR__ . '/components/header.php'; ?>
                    <!--<div class="col-md-3 col-lg-2 header-section d-flex align-items-center justify-content-center">
                        <h2>Logo/Brand</h2>
                    </div>-->                    
                </div>
                <div id="navbar">
                    <?php include __DIR__ . '/components/navbar_temp.php'; ?>
                </div>
                <main class="col-md-10 main-content">
                    <div class="row">
                        <div class="col-12 col-md-6">
                            <div class="card mb-3">
                                <div class="row g-0">
                                    <div class="col-md-4 d-flex align-items-center">
                                        <img src="assets/sample_data/pie_chart.png" class="card-img" alt="...">
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card-body">
                                            <h5 class="card-title">Behaviour Breakdown</h5>
                                            <p class="card-text">48% Sleeping<br />23% Normal<br />10% Playing<br />10% Walking<br />9% Eating</p>
                                            <p class="card-text"><small class="text-muted">Last updated...</small></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="card mb-3">
                                <div class="row g-0">
                                    <div class="col-md-4 d-flex align-items-center">
                                        <img src="assets/sample_data/water_temp.png" class="card-img" alt="...">
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card-body">
                                            <h5 class="card-title">Temperature and Water Intake Comparison</h5>
                                            <p class="card-text">This shows the trends between dog body temperature and water intake.</p>
                                            <p class="card-text"><small class="text-muted"></small></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                    <div class="col-12 col-md-6">
                            <div class="card mb-3">
                                <div class="row g-0">
                                    <div class="col-md-4 d-flex align-items-center">
                                        <img src="assets/sample_data/food_calorie.png" class="card-img" alt="...">
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card-body">
                                            <h5 class="card-title">Calorie Intake and Expenditure Comparison</h5>
                                            <p class="card-text">This shows the times and trends of calorie intake and calorie expenditiure.</p>
                                            <p class="card-text"><small class="text-muted"></small></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                        <div class="card mb-3">
                                <div class="row g-0">
                                    <div class="col-md-4 d-flex align-items-center">
                                        <img src="assets/sample_data/heart_rate.png" class="card-img" alt="...">
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card-body">
                                            <h5 class="card-title">Heart Rate</h5>
                                            <p class="card-text">This chart shows heart rate in bpm throughout the day.</p>
                                            <p class="card-text"><small class="text-muted"></small></p>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        <footer>
            <?php include __DIR__ . '/components/footer.php'; ?>
        </footer>
        <!-- Bootstrap JavaScript Libraries -->
        <script
            src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
            integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
            crossorigin="anonymous"
        ></script>

        <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"
            integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+"
            crossorigin="anonymous"
        ></script>
    </body>
</html>
