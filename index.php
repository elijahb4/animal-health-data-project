<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Elanco Animal Health Dashboard</title>
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/sidebar.css">
    <link rel="stylesheet" href="css/footer.css">
</head>
<body>
    <?php include 'components/sidebar.php'; ?>
    <?php include 'components/header.php'; ?>

    <main>
    <?php
        $allowedPages = [
            'dashboard',
            'analytics',
            'our-dogs',
            'records',
            'health-data',
            'trends',
            'settings',
            'notifications',
            'search',
        ];

        $page = $_GET['page'] ?? 'dashboard';

        $viewPath = "views/$page.php";
        if (in_array($page, $allowedPages) && file_exists($viewPath)) {
            include $viewPath;
        } else {
            include "views/404.php";
        }
        ?>
    </main>

    <?php include 'components/footer.php'; ?>
</body>
</html>