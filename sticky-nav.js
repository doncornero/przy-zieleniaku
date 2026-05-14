(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;

  // ── Inject hamburger button if not already in nav ──
  if (!nav.querySelector('.nav-hamburger')) {
    var btn = document.createElement('button');
    btn.className = 'nav-hamburger';
    btn.id = 'nav-hamburger';
    btn.setAttribute('aria-label', 'Otwórz menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(btn);
  }

  // ── Inject mobile menu overlay if not already present ──
  var page = document.querySelector('.page');
  if (page && !document.getElementById('mobile-menu')) {
    var overlay = document.createElement('div');
    overlay.className = 'mobile-menu';
    overlay.id = 'mobile-menu';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="mobile-menu-inner">' +
        '<a href="index.html" class="mobile-menu-home-btn" aria-label="Strona główna"></a>' +
        '<button class="mobile-menu-close" id="mobile-menu-close" aria-label="Zamknij menu">' +
          '<span class="mobile-menu-x"></span>' +
        '</button>' +
        '<nav class="mobile-menu-nav">' +
          '<a href="index.html#uslugi" class="mobile-menu-item">Usługi</a>' +
          '<a href="lekarze.html" class="mobile-menu-item">Lekarze</a>' +
          '<a href="specjalisci-mgr.html" class="mobile-menu-item">Specjaliści</a>' +
          '<a href="index.html#cennik" class="mobile-menu-item">Cennik</a>' +
          '<a href="index.html#kontakt" class="mobile-menu-item">Kontakt</a>' +
          '<a href="index.html#godziny" class="mobile-menu-item mobile-menu-item--two-line">Godziny<br>pracy</a>' +
        '</nav>' +
        '<div class="mobile-menu-secondary">' +
          '<a href="regulamin.html" class="mobile-menu-secondary-btn">Regulamin</a>' +
          '<a href="polityka-prywatnosci.html" class="mobile-menu-secondary-btn">Polityka prywatności</a>' +
        '</div>' +
      '</div>';
    page.appendChild(overlay);
  }

  // ── Hamburger toggle (works for both injected and pre-existing menus) ──
  var hamburger = document.getElementById('nav-hamburger');
  var menu = document.getElementById('mobile-menu');

  if (hamburger && menu) {
    var closeBtn = menu.querySelector('#mobile-menu-close, .mobile-menu-close');

    function openMenu() {
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    // Close on overlay click (outside the panel)
    menu.addEventListener('click', function (e) {
      if (e.target === menu) closeMenu();
    });
  }

  // ── Sticky nav on desktop scroll ──
  var ticking = false;

  function isMobile() { return window.innerWidth <= 768; }

  function updateNav() {
    if (isMobile()) {
      nav.style.transform = '';
      nav.classList.remove('nav--sticky');
      ticking = false;
      return;
    }
    var scale = Math.min(window.innerWidth / 1920, 1);
    var scrollY = window.scrollY;
    if (scrollY > 0) {
      nav.style.transform = 'translate3d(0,' + (scrollY / scale) + 'px,0)';
      nav.classList.add('nav--sticky');
    } else {
      nav.style.transform = '';
      nav.classList.remove('nav--sticky');
    }
    ticking = false;
  }

  window.addEventListener('resize', updateNav);
  window.addEventListener('hashchange', updateNav);
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(updateNav); ticking = true; }
  }, { passive: true });

  function startPoll(durationMs) {
    var end = Date.now() + durationMs;
    function poll() {
      updateNav();
      if (Date.now() < end) requestAnimationFrame(poll);
    }
    requestAnimationFrame(poll);
  }

  window.addEventListener('load', function () { startPoll(800); });
  window.addEventListener('pageshow', function () { startPoll(800); });

  updateNav();
})();
