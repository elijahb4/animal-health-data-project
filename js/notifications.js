fetch('php_scripts/generateNotification.php')
.then(() => fetch('database/notifications.json'))
.then(res => res.json())
.then(data => {
  const list = document.getElementById('notificationList');
  list.innerHTML = '';

  if (data.length === 0) {
    list.innerHTML = "<p>No notifications 🎉</p>";
    return;
  }

  data.forEach(notification => {
    const card = document.createElement('div');
    card.classList.add('metric-card');
    card.innerHTML = `
      <h4>${notification.title}</h4>
      <p><strong>Dog:</strong> ${notification.dog}</p>
      <p><strong>Time:</strong> ${notification.datetime}</p>
      <p><strong>Reason:</strong> ${notification.reason}</p>
      <p><strong>Status:</strong> ${notification.read ? '✅ Read' : '🔔 Unread'}</p>
    `;
    list.appendChild(card);
  });
})
.catch(err => {
  document.getElementById('notificationList').innerHTML = `<p>Error loading notifications.</p>`;
  console.error(err);
});
