  // ===== THEME TOGGLE =====
  (function(){
    var storageKey = 'bts-theme';
    var darkThemeColor = '#090b12';
    var lightThemeColor = '#f7f8fc';

    function getStoredTheme(){
      try {
        var stored = localStorage.getItem(storageKey);
        return stored === 'light' || stored === 'dark' ? stored : 'dark';
      } catch (err) {
        return 'dark';
      }
    }

    function updateThemeMeta(theme){
      var themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) themeMeta.setAttribute('content', theme === 'light' ? lightThemeColor : darkThemeColor);
    }

    function updateThemeButton(theme){
      var toggle = document.getElementById('themeToggle');
      if (!toggle) return;
      var isLight = theme === 'light';
      toggle.setAttribute('aria-pressed', String(isLight));
      toggle.setAttribute('aria-label', isLight ? 'Dark Mode aktivieren' : 'Light Mode aktivieren');
      toggle.setAttribute('title', isLight ? 'Dark Mode aktivieren' : 'Light Mode aktivieren');
      var label = toggle.querySelector('.theme-toggle-label');
      if (label) label.textContent = isLight ? 'Dark Mode aktivieren' : 'Light Mode aktivieren';
    }

    function setTheme(theme){
      var nextTheme = theme === 'light' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      try { localStorage.setItem(storageKey, nextTheme); } catch (err) {}
      updateThemeMeta(nextTheme);
      updateThemeButton(nextTheme);
    }

    window.toggleTheme = function(){
      var currentTheme = document.documentElement.getAttribute('data-theme') || getStoredTheme();
      setTheme(currentTheme === 'light' ? 'dark' : 'light');
    };

    setTheme(getStoredTheme());
  })();

  // ===== MODAL mit Focus-Trap =====
  var lastFocusedBeforeModal = null;

  function getFocusables(container) {
    return Array.from(container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function(el){ return el.offsetParent !== null; });
  }

  function openModal(e, pkg) {
    if (e) e.preventDefault();
    var modal = document.getElementById('ctaModal');
    var calLink = document.getElementById('modalCalendlyLink');
    var base = 'https://calendly.com/btsintelligence/30min';
    if (calLink) calLink.href = pkg ? base + '?utm_source=website&utm_medium=pricing&utm_content=' + encodeURIComponent(pkg) : base;
    lastFocusedBeforeModal = document.activeElement;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Sticky-CTA ausblenden während Modal offen
    var sticky = document.getElementById('mobileStickyCta');
    if (sticky) sticky.classList.remove('show');
    // Erstes fokussierbares Element fokussieren
    setTimeout(function(){
      var focusables = getFocusables(modal);
      if (focusables.length) focusables[0].focus();
    }, 50);
  }

  function closeModal() {
    var modal = document.getElementById('ctaModal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // Fokus zurück zum Trigger
    if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') {
      lastFocusedBeforeModal.focus();
    }
    lastFocusedBeforeModal = null;
  }

  var ctaModalEl = document.getElementById('ctaModal');
  if (ctaModalEl) {
    ctaModalEl.addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });
    // Focus-Trap: Tab/Shift+Tab innerhalb Modal zirkulär
    ctaModalEl.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab' || !this.classList.contains('open')) return;
      var focusables = getFocusables(this);
      if (focusables.length === 0) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      var m = document.getElementById('ctaModal');
      if (m && m.classList.contains('open')) closeModal();
    }
  });

  // ===== MOBILE NAV TOGGLE =====
  function setMenuOpen(isOpen) {
    var navLinks = document.getElementById('navLinks');
    var nav = document.querySelector('nav.site-nav');
    var hamburger = document.getElementById('hamburger');
    if (!navLinks || !nav) return;
    navLinks.classList.toggle('open', isOpen);
    nav.classList.toggle('menu-open', isOpen);
    document.body.classList.toggle('mobile-menu-open', isOpen);
    if (hamburger) hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  function toggleMenu() {
    var navLinks = document.getElementById('navLinks');
    setMenuOpen(!(navLinks && navLinks.classList.contains('open')));
  }
  document.querySelectorAll('.nav-links a').forEach(function(a){
    a.addEventListener('click', function(){
      setMenuOpen(false);
    });
  });
  var navCta = document.querySelector('nav.site-nav > .nav-btn');
  if (navCta) {
    navCta.addEventListener('click', function(){
      setMenuOpen(false);
    });
  }

  // ===== MOBILE STICKY CTA BAR =====
  // Immer sichtbar auf Mobile (CSS-gesteuert), nur ausgeblendet wenn Modal offen.
  (function(){
    var sticky = document.getElementById('mobileStickyCta');
    if (!sticky) return;
    sticky.setAttribute('aria-hidden', 'false');
    function update(){
      var modal = document.getElementById('ctaModal');
      if (modal && modal.classList.contains('open')) {
        sticky.classList.add('hidden');
        sticky.setAttribute('aria-hidden', 'true');
      } else {
        sticky.classList.remove('hidden');
        sticky.setAttribute('aria-hidden', 'false');
      }
    }
    // Modal-Open-Status beobachten (MutationObserver auf class-Attribut)
    var modal = document.getElementById('ctaModal');
    if (modal) {
      var mo = new MutationObserver(update);
      mo.observe(modal, { attributes: true, attributeFilter: ['class'] });
    }
    update();
  })();

  // ===== KONTAKTFORMULAR mit Inline-Validierung =====
  (function(){
    var form = document.getElementById('contactForm');
    if (!form) return;

    var validators = {
      name: function(v){ return v.trim().length >= 2 ? null : 'Bitte geben Sie Ihren Namen ein (mindestens 2 Zeichen).'; },
      email: function(v){
        if (!v.trim()) return 'Bitte geben Sie Ihre E-Mail-Adresse ein.';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      },
      phone: function(v){
        if (!v.trim()) return null;
        var digits = v.replace(/\D/g, '');
        return digits.length >= 6 ? null : 'Telefonnummer wirkt unvollständig (mindestens 6 Ziffern).';
      }
    };

    function setError(fieldName, msg){
      var field = form.querySelector('[name="'+fieldName+'"]');
      var errEl = document.getElementById(fieldName+'-hint');
      if (!field) return;
      if (msg) {
        field.classList.add('invalid');
        field.setAttribute('aria-invalid', 'true');
        if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
      } else {
        field.classList.remove('invalid');
        field.removeAttribute('aria-invalid');
        if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
      }
    }

    function validateField(fieldName){
      var field = form.querySelector('[name="'+fieldName+'"]');
      if (!field || !validators[fieldName]) return true;
      var msg = validators[fieldName](field.value);
      setError(fieldName, msg);
      return !msg;
    }

    ['name','email','phone'].forEach(function(n){
      var f = form.querySelector('[name="'+n+'"]');
      if (f) f.addEventListener('blur', function(){ validateField(n); });
    });

    form.addEventListener('submit', async function(e){
      e.preventDefault();
      var allValid = ['name','email','phone'].every(validateField);
      if (!allValid) {
        var firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      var btn = form.querySelector('.form-submit');
      btn.textContent = 'Wird gesendet...';
      btn.disabled = true;
      try {
        var res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.reset();
          ['name','email','phone'].forEach(function(n){ setError(n, null); });
          document.getElementById('formSuccess').style.display = 'block';
          document.getElementById('formError').style.display = 'none';
          btn.style.display = 'none';
        } else {
          throw new Error();
        }
      } catch (err) {
        document.getElementById('formError').style.display = 'block';
        btn.textContent = 'Kostenlose Potenzialanalyse anfordern →';
        btn.disabled = false;
      }
    });
  })();

  // ===== REVEAL ON SCROLL =====
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
