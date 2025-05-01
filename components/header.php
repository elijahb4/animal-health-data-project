<link rel="stylesheet" href="css/global.css">
<link rel="stylesheet" href="css/header.css">
<div class="header">
    <form class="search-bar" action="index.php?page=search_views" method="GET">
        <a href="index.php?page=search_views"><button type="submit" class="search-button">
            <img src="assets/header/search.png" class="search-icon" alt="Search">
        </button></a>
        <?php $query = $query ?? ''; ?>
        <input type="text" name="q" value="<?= htmlspecialchars($query) ?>" minlength="3" maxlength="20" placeholder="Search our records..." required>
    </form>
    <div class="header-icons">
        <div class="icon-wrapper">
            <a href="index.php?page=notifications">
            <img src="assets/header/notification.png" class="icon" alt="Notifications" />
            </a>
        </div>
        <div class="icon-wrapper">
            <img src="assets/header/user.png" class="icon" alt="Account" />
        </div>
    </div>
</div>