// Shared header, call to action and footer for every public page.
// Each page sets <body data-page="..."> so the current link can be marked.
(function () {
  var page = document.body.getAttribute('data-page') || '';

  var links = [
    ['solutions', 'index.html#solutions', 'Solutions'],
    ['features', 'features.html', 'Features'],
    ['how-it-works', 'how-it-works.html', 'How it works'],
    ['pricing', 'pricing.html', 'Pricing'],
    ['resources', 'resources.html', 'Resources']
  ];

  var navItems = links.map(function (l) {
    var current = (l[0] === page || (l[0] === 'solutions' && page.indexOf('solutions') === 0)) ? ' aria-current="page"' : '';
    return '<li><a href="' + l[1] + '"' + current + '>' + l[2] + '</a></li>';
  }).join('');

  var header =
    '<a class="skip" href="#main">Skip to content</a>' +
    '<header class="site-header"><div class="wrap nav">' +
      '<a class="wordmark" href="index.html">Healthmate<span>POSTURE AI</span></a>' +
      '<nav aria-label="Main" id="site-nav"><ul>' + navItems + '</ul></nav>' +
      '<div class="nav-actions">' +
        '<a class="login" href="login.html">Log in</a>' +
        '<a class="btn btn-primary" href="demo.html">Book a demo</a>' +
        '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>' +
      '</div>' +
    '</div></header>';

  var cta =
    '<section class="cta band"><div class="wrap">' +
      '<p class="label">Demonstration</p>' +
      '<h2>See Healthmate in your setting.</h2>' +
      '<p>Book a demonstration with the TRIMAX team and walk through an assessment from capture to report.</p>' +
      '<div class="hero-actions">' +
        '<a class="btn btn-primary" href="demo.html">Book a demo</a>' +
        '<a class="btn btn-secondary" href="login.html">Try the demo app</a>' +
      '</div>' +
    '</div></section>';

  var footer =
    '<footer class="site-footer"><div class="wrap">' +
      '<div class="foot-grid">' +
        '<div><a class="wordmark" href="index.html">Healthmate<span>POSTURE AI</span></a>' +
          '<p style="margin-top:12px;max-width:22em">AI-assisted posture and lower-limb assessment, by TRIMAX Healthcare.</p></div>' +
        '<div><h3>Solutions</h3><ul>' +
          '<li><a href="solutions-clinics.html">Clinics</a></li>' +
          '<li><a href="solutions-hospitals.html">Hospitals</a></li>' +
          '<li><a href="solutions-retail.html">Retail screening</a></li></ul></div>' +
        '<div><h3>Product</h3><ul>' +
          '<li><a href="features.html">Features</a></li>' +
          '<li><a href="how-it-works.html">How it works</a></li>' +
          '<li><a href="pricing.html">Pricing</a></li>' +
          '<li><a href="resources.html">Resources</a></li>' +
          '<li><a href="demo.html">Book a demo</a></li></ul></div>' +
        '<div><h3>Legal and safety</h3><ul>' +
          '<li><a href="privacy.html">Privacy</a></li>' +
          '<li><a href="terms.html">Terms</a></li>' +
          '<li><a href="consent.html">Consent</a></li>' +
          '<li><a href="clinical-limitations.html">Clinical limitations</a></li></ul></div>' +
      '</div>' +
      '<div class="foot-base"><span>© 2026 TRIMAX Healthcare</span>' +
        '<p class="disclaimer">Healthmate Posture AI provides AI-assisted assessment and screening support. It is not a diagnostic device and does not replace assessment by a qualified healthcare professional.</p>' +
      '</div>' +
    '</div></footer>';

  document.body.insertAdjacentHTML('afterbegin', header);
  var showCta = document.body.getAttribute('data-cta') !== 'off';
  document.body.insertAdjacentHTML('beforeend', (showCta ? cta : '') + footer);

  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Smooth scrolling with Lenis (github.com/darkroomengineering/lenis).
  // Skipped for visitors who ask for reduced motion; the page scrolls normally if it fails to load.
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var lenisScript = document.createElement('script');
    lenisScript.src = 'https://unpkg.com/lenis@1.3.4/dist/lenis.min.js';
    lenisScript.onload = function () {
      window.lenis = new window.Lenis({ autoRaf: true, anchors: true });
    };
    document.head.appendChild(lenisScript);
  }

  // Animated background with Vanta.js (github.com/tengbao/vanta) on any section marked data-vanta.
  // The NET effect echoes the landmark points in the product. Skipped for reduced motion and on
  // small screens; the section keeps its plain background if anything fails to load.
  var vantaEl = document.querySelector('[data-vanta]');
  if (vantaEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerWidth >= 700) {
    var loadScript = function (src, done) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = done;
      document.head.appendChild(s);
    };
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js', function () {
      loadScript('https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.net.min.js', function () {
        try {
          window.vantaEffect = window.VANTA.NET({
            el: vantaEl,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            color: 0x8fd8e6,
            backgroundColor: 0xf8fafc,
            points: 8,
            maxDistance: 22,
            spacing: 20,
            showDots: true
          });
        } catch (e) { /* no WebGL: leave the plain background */ }
      });
    });
  }

  // Three effects modelled on React Bits (github.com/DavidHDev/react-bits). React Bits itself is a
  // React component library and this site is plain HTML, so these are small plain-JS versions of
  // its Blur Text, Spotlight Card and Animated Content components.
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Blur Text: the page heading resolves word by word on load.
  var h1 = document.querySelector('.hero h1, .page-hero h1');
  if (h1 && !calm && !h1.children.length) {
    var words = h1.textContent.trim().split(/\s+/);
    h1.setAttribute('aria-label', words.join(' '));
    h1.innerHTML = words.map(function (w, i) {
      return '<span class="bt-word" aria-hidden="true" style="--i:' + i + '"></span>';
    }).join(' ');
    Array.prototype.forEach.call(h1.children, function (span, i) { span.textContent = words[i]; });
  }

  // Spotlight Card: a soft highlight follows the pointer across cards.
  document.addEventListener('pointermove', function (e) {
    var card = e.target.closest ? e.target.closest('.card, .safe-item, .role') : null;
    if (!card) return;
    var box = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - box.left) + 'px');
    card.style.setProperty('--my', (e.clientY - box.top) + 'px');
  });

  // Animated Content: blocks below the first screen rise into place as they are scrolled to.
  // Anything already on screen at load is left alone, so the first view is complete.
  if (!calm && 'IntersectionObserver' in window) {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('rv-in'); seen.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(document.querySelectorAll('main .section-head, main .card, main .steps li, main .safe-item, main .faq details'), function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      var i = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = (Math.min(i, 5) * 60) + 'ms';
      el.classList.add('rv');
      seen.observe(el);
    });
  }

  // Login role picker: pass the chosen role in storage as well as in the link.
  Array.prototype.forEach.call(document.querySelectorAll('a.role'), function (a) {
    a.addEventListener('click', function () {
      try { sessionStorage.setItem('healthmate-role', a.getAttribute('href').split('role=')[1]); } catch (e) { /* the link still carries it */ }
    });
  });

  // The demo request form is not connected to anything. Nothing is sent or stored.
  var form = document.querySelector('[data-demo-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.style.display = 'none';
      var result = document.querySelector('.form-result');
      result.classList.add('show');
      result.focus();
    });
  }
})();
