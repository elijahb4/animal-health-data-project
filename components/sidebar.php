<link rel="stylesheet" href="css/global.css">
<link rel="stylesheet" href="css/sidebar.css">
<div class="sidebar">
    <div class="logo">
        <img src="assets/sidebar/health.png" class="logo-icon" alt="Veterinarian Icon">
        <img src="assets/elanco-white.png" class="logo-text" alt="Elanco Logo">
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
        <li class="<?= ($_GET['page'] ?? '') == 'health-data' ? 'active' : '' ?>">
            <a href="index.php?page=health-data">Health Data</a>
        </li>


        <li class="<?= ($_GET['page'] ?? '') == 'trends' ? 'active' : '' ?>">
            <a href="index.php?page=trends">Trends</a>
        </li>
        <li class="<?= ($_GET['page'] ?? '') == 'lab-results' ? 'active' : '' ?>">
            <a href="index.php?page=lab-results">Lab Results</a>
        </li>
        <li class="<?= ($_GET['page'] ?? '') == 'appointments' ? 'active' : '' ?>">
            <a href="index.php?page=appointments">Appointments</a>
        </li>
        <li class="<?= ($_GET['page'] ?? '') == 'media-gallery' ? 'active' : '' ?>">
            <a href="index.php?page=media-gallery">Media Gallery</a>
        </li>
        <li class="<?= ($_GET['page'] ?? '') == 'notes-and-logs' ? 'active' : '' ?>">
            <a href="index.php?page=notes-and-logs">Notes & Logs</a>
        </li>
    </ul>
    <ul class="settings-link">
        <li class="<?= ($_GET['page'] ?? '') === 'settings' ? 'active' : '' ?>">
            <a href="index.php?page=settings">Settings</a>
        </li>
    </ul>
</div>