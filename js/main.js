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
  function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
    document.querySelector('nav.site-nav').classList.toggle('menu-open');
  }
  document.querySelectorAll('.nav-links a').forEach(function(a){
    a.addEventListener('click', function(){
      document.getElementById('navLinks').classList.remove('open');
      document.querySelector('nav.site-nav').classList.remove('menu-open');
    });
  });

  // ===== MOBILE STICKY CTA BAR =====
  (function(){
    var sticky = document.getElementById('mobileStickyCta');
    if (!sticky) return;
    var SHOW_AT = 600;
    var HIDE_AT = 400;
    var shown = false;
    function onScroll(){
      if (window.innerWidth > 768) {
        if (shown) { sticky.classList.remove('show'); sticky.setAttribute('aria-hidden','true'); shown = false; }
        return;
      }
      // nicht zeigen, wenn Modal offen
      var modal = document.getElementById('ctaModal');
      if (modal && modal.classList.contains('open')) {
        if (shown) { sticky.classList.remove('show'); sticky.setAttribute('aria-hidden','true'); shown = false; }
        return;
      }
      var y = window.scrollY || window.pageYOffset;
      if (!shown && y > SHOW_AT) { sticky.classList.add('show'); sticky.setAttribute('aria-hidden','false'); shown = true; }
      else if (shown && y < HIDE_AT) { sticky.classList.remove('show'); sticky.setAttribute('aria-hidden','true'); shown = false; }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
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
