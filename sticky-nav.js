(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;

  // ── Move nav outside .page so position:fixed works against the viewport,
  //    not against .page's transform context ──
  var page = document.querySelector('.page');
  if (page && page.parentNode) {
    if (page.classList.contains('page--home')) nav.classList.add('page--home');
    page.parentNode.insertBefore(nav, page);
  }

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
  if (!document.getElementById('mobile-menu')) {
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
    document.body.appendChild(overlay);
  }

  // ── Hamburger toggle ──
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

    menu.addEventListener('click', function (e) {
      if (e.target === menu) closeMenu();
    });
  }

  // ── Nav positioning ──
  // Desktop: position:fixed + scale transform (nav is outside .page, so fixed works
  //          against the real viewport, not the transformed ancestor).
  // Mobile:  clear inline styles and let CSS handle it (mobile CSS already uses fixed).

  function isMobile() { return window.innerWidth <= 768; }

  function updateNav() {
    if (isMobile()) {
      nav.style.cssText = '';          // clear all inline styles; mobile CSS takes over
      nav.classList.remove('nav--sticky');
      return;
    }
    var scale = Math.min(window.innerWidth / 1920, 1);
    nav.style.position = 'fixed';
    nav.style.top = '0';
    nav.style.left = '0';
    nav.style.zIndex = '100';
    nav.style.transform = 'scale(' + scale + ')';
    nav.style.transformOrigin = '0 0';
    nav.classList.add('nav--sticky');
  }

  // ── Hash-link clicks on desktop: scroll to visual position ──
  // (The browser's default anchor scroll uses layout coords, not visual coords,
  //  which lands at the wrong position inside a scaled .page.)
  document.addEventListener('click', function (e) {
    if (isMobile()) return;
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    var target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    var top = target.getBoundingClientRect().top;
    window.scrollTo(0, window.scrollY + top);
    history.pushState(null, '', hash);
  });

  window.addEventListener('resize', updateNav);
  window.addEventListener('load', updateNav);
  window.addEventListener('pageshow', updateNav);

  updateNav();
})();
