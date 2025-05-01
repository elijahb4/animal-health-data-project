<div class="dashboard-container">
    <form method="GET" action="search.php" class="search-bar">
        <button type="submit" class="search-button">
            <img src="assets/header/search.png" class="search-icon" alt="Search">
        </button>
        <input type="text" name="q" value="<?= htmlspecialchars($query) ?>" placeholder="Search our records..." required>
    </form>
</div>
<?php if ($query): ?>
    <h2>Results for "<?= htmlspecialchars($query) ?>"</h2>
    <?php if (empty($results)): ?>
        <p>No results found.</p>
    <?php else: ?>
        <ul>
            <?php foreach ($results as $row): ?>
                <li><?= htmlspecialchars($row['name']) ?> - <?= htmlspecialchars($row['city']) ?></li>
            <?php endforeach; ?>
        </ul>
    <?php endif; ?>
<?php endif; ?>
