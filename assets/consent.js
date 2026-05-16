(function() {
  if (localStorage.getItem('consent') !== null) return;

  var banner = document.getElementById('consent-banner');
  if (!banner) return;
  banner.style.display = 'flex';

  document.getElementById('consent-accept').addEventListener('click', function() {
    localStorage.setItem('consent', 'granted');
    gtag('consent', 'update', { analytics_storage: 'granted' });
    banner.style.display = 'none';
  });

  document.getElementById('consent-decline').addEventListener('click', function() {
    localStorage.setItem('consent', 'denied');
    gtag('consent', 'update', { analytics_storage: 'denied' });
    banner.style.display = 'none';
  });
})();
