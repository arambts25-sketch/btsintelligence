  function openModal(e, pkg) {
    if (e) e.preventDefault();
    var calLink = document.getElementById('modalCalendlyLink');
    var base = 'https://calendly.com/btsintelligence/30min';
    calLink.href = pkg ? base + '?utm_source=website&utm_medium=pricing&utm_content=' + encodeURIComponent(pkg) : base;
    document.getElementById('ctaModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    document.getElementById('ctaModal').classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('ctaModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
    document.querySelector('nav.site-nav').classList.toggle('menu-open');
  }
  document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', () => {
      document.getElementById('navLinks').classList.remove('open');
      document.querySelector('nav.site-nav').classList.remove('menu-open');
    }));

  // Kontaktformular — normales POST zu N8N
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Wird gesendet...';
      btn.disabled = true;
    });
  }

  var currentZW = 'monthly'; // monthly | once
  var currentLZ = 'monthly'; // monthly | 6m | 12m

  function moveSlider(sliderId, activeBtn) {
    var slider = document.getElementById(sliderId);
    if (slider && activeBtn) {
      slider.style.left = activeBtn.offsetLeft + 'px';
      slider.style.width = activeBtn.offsetWidth + 'px';
    }
  }

  function updateLaufzeitBadges() {
    var lz3m = document.getElementById('lzBadge3m');
    var lz6m = document.getElementById('lzBadge6m');
    var lz12m = document.getElementById('lzBadge12m');
    var isOnce = currentZW === 'once';
    if (lz3m) lz3m.style.display = isOnce ? '' : 'none';
    if (lz6m) lz6m.textContent = isOnce ? '–10 %' : '–5 %';
    if (lz12m) lz12m.textContent = isOnce ? '–15 %' : '–10 %';
  }

  function updateNote() {
    var note = document.getElementById('billingNote');
    if (!note) return;
    var notes = {
      'monthly-monthly': 'Mindestlaufzeit 3 Monate · monatlich kündbar ab Monat 3',
      'monthly-6m':      '6 Monate Mindestlaufzeit · monatlich kündbar ab Monat 6',
      'monthly-12m':     '12 Monate Mindestlaufzeit',
      'once-monthly':    'Einmalige Vorauszahlung für 3 Monate · kündbar ab Monat 3',
      'once-6m':         'Einmalige Vorauszahlung für 6 Monate',
      'once-12m':        'Einmalige Vorauszahlung für 12 Monate'
    };
    note.textContent = notes[currentZW + '-' + currentLZ] || '';
  }

  function updatePrices() {
    var key = (currentZW === 'monthly' ? 'm' : 'o') + (currentLZ === 'monthly' ? 'm' : currentLZ === '6m' ? '6' : '12');
    document.querySelectorAll('#betreuung-grid .price-card').forEach(function(card) {
      var numEl = card.querySelector('.price-num[data-mm]');
      var unitEl = card.querySelector('.price-unit[data-mm]');
      var savingsEl = card.querySelector('.price-savings');
      if (!numEl) return;
      numEl.textContent = numEl.getAttribute('data-' + key) || '';
      if (unitEl) unitEl.textContent = unitEl.getAttribute('data-' + key) || '';
      if (savingsEl) {
        var txt = savingsEl.getAttribute('data-save-' + key) || '';
        savingsEl.textContent = txt;
        savingsEl.classList.toggle('visible', txt !== '');
      }
      var totalEl = card.querySelector('.price-total');
      if (totalEl) totalEl.textContent = totalEl.getAttribute('data-' + key) || '';
    });
  }

  function setZahlweise(zw, btn) {
    currentZW = zw;
    var activeBtn = btn || document.querySelector('[data-zw="' + zw + '"]');
    document.querySelectorAll('[data-zw]').forEach(function(b) { b.classList.toggle('active', b === activeBtn); });
    document.querySelectorAll('[data-zw]').forEach(function(b) { b.setAttribute('aria-pressed', b === activeBtn ? 'true' : 'false'); });
    moveSlider('zahlweiseSlider', activeBtn);
    updateLaufzeitBadges();
    // Badge-Änderung verändert Button-Breiten → Laufzeit-Slider neu ausrichten
    var activeLzBtn = document.querySelector('[data-lz="' + currentLZ + '"]');
    moveSlider('laufzeitSlider', activeLzBtn);
    updateNote();
    updatePrices();
  }

  function setLaufzeit(lz, btn) {
    currentLZ = lz;
    var activeBtn = btn || document.querySelector('[data-lz="' + lz + '"]');
    document.querySelectorAll('[data-lz]').forEach(function(b) { b.classList.toggle('active', b === activeBtn); });
    document.querySelectorAll('[data-lz]').forEach(function(b) { b.setAttribute('aria-pressed', b === activeBtn ? 'true' : 'false'); });
    moveSlider('laufzeitSlider', activeBtn);
    updateNote();
    updatePrices();
  }

  setZahlweise('monthly');
  setLaufzeit('monthly');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
