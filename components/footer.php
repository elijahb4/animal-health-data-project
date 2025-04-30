<link rel="stylesheet" href="css/footer.css">
<div class="footer">
  <span class="footer-text">© <span id="year"></span> Elanco & GROUP-14</span>
  <a href="https://elanco.com/" target="_blank">
    <img src="assets/elanco-blue.svg" alt="Elanco" class="footer-logo">
  </a>
</div>
<script>
    let c = new Date().getFullYear();
    let notice = document.getElementById("year");
    notice.innerText = c;
</script>