/* =========================================================
   TECHONE — script.js
========================================================= */
(function(){
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 760px)').matches || /Mobi|Android/i.test(navigator.userAgent);

  /* ---------------- Loader ---------------- */
  window.addEventListener('load', function(){
    var loader = document.getElementById('loader');
    setTimeout(function(){
      loader.classList.add('hidden');
    }, 900);
  });

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Navbar scroll state ---------------- */
  var navbar = document.getElementById('navbar');
  function onScroll(){
    if (window.scrollY > 24) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Hamburger menu ---------------- */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', function(){
    var open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', function(){
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------- Active nav link on scroll ---------------- */
  var sections = document.querySelectorAll('section[id]');
  var navA = document.querySelectorAll('.nav-links a[data-nav]');
  var navObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){
        navA.forEach(function(a){
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(function(s){ navObserver.observe(s); });

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (reduceMotion){
    revealEls.forEach(function(el){ el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry, i){
        if (entry.isIntersecting){
          setTimeout(function(){ entry.target.classList.add('in'); }, i * 40);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function(el){ revealObserver.observe(el); });
  }

  /* ---------------- Terminal diagnostic typing effect ---------------- */
  var terminalBody = document.getElementById('terminalBody');
  var terminalLines = [
    { text: '&gt; scanning_hardware...', cls: '' },
    { text: '[OK] CPU temperature ........ 38&deg;C', cls: 't-ok' },
    { text: '[OK] Memory integrity ........ 100%', cls: 't-ok' },
    { text: '[OK] Storage health .......... GOOD', cls: 't-ok' },
    { text: '[OK] Cooling system .......... OPTIMAL', cls: 't-ok' },
    { text: '&nbsp;', cls: '' },
    { text: 'performance_mode: MAX', cls: 't-ok' }
  ];
  var terminalStarted = false;
  function runTerminal(){
    if (terminalStarted) return;
    terminalStarted = true;
    terminalBody.innerHTML = '';
    var i = 0;
    function nextLine(){
      if (i >= terminalLines.length){
        var cursor = document.createElement('p');
        cursor.className = 't-line';
        cursor.innerHTML = '&gt; <span class="t-cursor">_</span>';
        terminalBody.appendChild(cursor);
        return;
      }
      var line = terminalLines[i];
      var p = document.createElement('p');
      p.className = 't-line ' + line.cls;
      p.innerHTML = line.text;
      terminalBody.appendChild(p);
      i++;
      setTimeout(nextLine, reduceMotion ? 0 : 260);
    }
    nextLine();
  }
  var terminalEl = document.querySelector('.terminal');
  if (terminalEl){
    var termObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) runTerminal();
      });
    }, { threshold: 0.4 });
    termObserver.observe(terminalEl);
  }

  /* ---------------- Gallery filter ---------------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      filterBtns.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      galleryItems.forEach(function(item){
        var match = f === 'all' || item.getAttribute('data-cat') === f;
        item.classList.toggle('hide', !match);
      });
    });
  });

  /* ---------------- Lightbox ---------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  galleryItems.forEach(function(item){
    item.addEventListener('click', function(){
      var img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });
  function closeLightbox(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e){
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeLightbox();
  });

  /* =========================================================
     THREE.JS — technological background
  ========================================================= */
  if (window.THREE && !reduceMotion){
    initThree();
  }

  function initThree(){
    var canvas = document.getElementById('bg-canvas');
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: !isMobile });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 22;

    var greenColor = new THREE.Color(0x9CFF00);
    var cyanColor = new THREE.Color(0x4fe3d0);

    /* --- Particle field --- */
    var particleCount = isMobile ? 260 : 900;
    var positions = new Float32Array(particleCount * 3);
    var colors = new Float32Array(particleCount * 3);
    for (var i = 0; i < particleCount; i++){
      var x = (Math.random() - 0.5) * 60;
      var y = (Math.random() - 0.5) * 34;
      var z = (Math.random() - 0.5) * 40;
      positions[i*3] = x; positions[i*3+1] = y; positions[i*3+2] = z;
      var c = Math.random() > 0.85 ? cyanColor : greenColor;
      colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
    }
    var particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    var particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.11 : 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true
    });
    var particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* --- Wireframe rings (technological rings) --- */
    var ringGroup = new THREE.Group();
    var ringCount = isMobile ? 2 : 3;
    for (var r = 0; r < ringCount; r++){
      var torusGeo = new THREE.TorusGeometry(6 + r * 2.4, 0.02, 8, 64);
      var torusMat = new THREE.MeshBasicMaterial({ color: 0x9CFF00, transparent: true, opacity: 0.16 - r * 0.03, wireframe: false });
      var torus = new THREE.Mesh(torusGeo, torusMat);
      torus.rotation.x = Math.PI / 2.4 + r * 0.3;
      torus.rotation.y = r * 0.4;
      torus.position.set(9, -3, -6 - r * 3);
      ringGroup.add(torus);
    }
    scene.add(ringGroup);

    /* --- Wireframe icosahedron (holographic object) --- */
    var icoGeo = new THREE.IcosahedronGeometry(3.4, 0);
    var icoMat = new THREE.MeshBasicMaterial({ color: 0x9CFF00, wireframe: true, transparent: true, opacity: 0.22 });
    var ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(-10, 3, -8);
    scene.add(ico);

    /* --- Circuit lines (simple connecting line segments) --- */
    var lineCount = isMobile ? 10 : 26;
    var lineGroup = new THREE.Group();
    for (var l = 0; l < lineCount; l++){
      var lx = (Math.random() - 0.5) * 50;
      var ly = (Math.random() - 0.5) * 28;
      var lz = (Math.random() - 0.5) * 30;
      var len = 1 + Math.random() * 2.5;
      var horizontal = Math.random() > 0.5;
      var lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(lx, ly, lz),
        new THREE.Vector3(lx + (horizontal ? len : 0), ly + (horizontal ? 0 : len), lz)
      ]);
      var lineMat = new THREE.LineBasicMaterial({ color: 0x9CFF00, transparent: true, opacity: 0.15 });
      lineGroup.add(new THREE.Line(lineGeo, lineMat));
    }
    scene.add(lineGroup);

    /* --- Mouse parallax --- */
    var mouseX = 0, mouseY = 0;
    var targetX = 0, targetY = 0;
    window.addEventListener('mousemove', function(e){
      mouseX = (e.clientX / window.innerWidth - 0.5);
      mouseY = (e.clientY / window.innerHeight - 0.5);
    }, { passive: true });

    /* --- Resize --- */
    function onResize(){
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    /* --- Visibility pause (perf) --- */
    var isVisible = true;
    document.addEventListener('visibilitychange', function(){
      isVisible = !document.hidden;
    });

    var clock = new THREE.Clock();
    function animate(){
      requestAnimationFrame(animate);
      if (!isVisible) return;
      var t = clock.getElapsedTime();

      particles.rotation.y = t * 0.015;
      particles.rotation.x = t * 0.006;

      ringGroup.rotation.z = t * 0.04;
      ringGroup.children.forEach(function(mesh, idx){
        mesh.rotation.y = t * 0.05 * (idx + 1) * 0.5;
      });

      ico.rotation.x = t * 0.12;
      ico.rotation.y = t * 0.09;

      lineGroup.rotation.y = t * 0.01;

      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;
      camera.position.x = targetX * 3;
      camera.position.y = -targetY * 2;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    animate();
  }

})();
