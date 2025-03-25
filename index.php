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
  <div class="layout">
    <?php include 'components/sidebar.php'; ?>
    <div class="content-area">
      <?php include 'components/header.php'; ?>

      <main>
        <?php
          $page = $_GET['page'] ?? 'dashboard';
          include "views/$page.php";
        ?>
      </main>

      <?php include 'components/footer.php'; ?>
    </div>
  </div>
</body>
</html>