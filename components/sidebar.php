<link rel="stylesheet" href="css/global.css">
<link rel="stylesheet" href="css/sidebar.css">
<div class="sidebar">
    <div class="logo">
        <a href="https://elanco.com/" target="_blank"><img src="assets/elanco-white.png" alt="Elanco" class="logo-icon"></a>
    </div>
    <ul class="nav">
        <li class="<?= ($_GET['page'] ?? 'dashboard') == 'dashboard' ? 'active' : '' ?>">
            <a href="index.php?page=dashboard">Dashboard</a>
        </li>
        <li class="<?= ($_GET['page'] ?? '') == 'analytics' ? 'active' : '' ?>">
            <a href="index.php?page=analytics">Analytics</a>
        </li>
        <li class="<?= ($_GET['page'] ?? '') == 'our-dogs' ? 'active' : '' ?>">
            <a href="index.php?page=our-dogs">Our Dogs</a>
        </li>
        <li class="<?= ($_GET['page'] ?? '') == 'records' ? 'active' : '' ?>">
            <a href="index.php?page=records">Records</a>
        </li>
        <li class="<?= ($_GET['page'] ?? '') == 'health-trends' ? 'active' : '' ?>">
            <a href="index.php?page=health-trends">Health Trends</a>
        </li>
    </ul>
    <ul class="settings-link">
        <li class="<?= ($_GET['page'] ?? '') === 'settings' ? 'active' : '' ?>">
            <a href="index.php?page=settings">Settings</a>
        </li>
    </ul>
</div>