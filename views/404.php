<?php
http_response_code(404);
?>
<!DOCTYPE html>
<head>
    <link rel="stylesheet" href="/../css/404.css">
    <title>Page not found</title>
</head>
<body>
    <div class="dashboard-container">
    <h1>404: Page not found</h1>
    <p>The page or asset you're looking for does not exist in this location.</p>
    <button id="home_link" class="<?= ($_GET['page'] ?? 'dashboard') == 'dashboard' ? 'active' : '' ?>">
        <a href="index.php?page=dashboard">Click here to return to the dashboard</a>
    </button>
    <br />
    <img width="600" height="auto" src="/../assets/content/GWFbN43WsAAAmLv.jpeg"/>
    </div>
</body>
</html>