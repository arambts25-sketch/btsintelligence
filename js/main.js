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

  // Kontaktformular AJAX
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Wird gesendet...';
      btn.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.reset();
          document.getElementById('formSuccess').style.display = 'block';
          document.getElementById('formError').style.display = 'none';
          btn.style.display = 'none';
        } else {
          throw new Error();
        }
      } catch {
        document.getElementById('formError').style.display = 'block';
        btn.textContent = 'Kostenlose Potenzialanalyse anfordern →';
        btn.disabled = false;
      }
    });
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
