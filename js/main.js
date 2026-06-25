/* HCH INMOBILIARIA — JS */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CURSOR PERSONALIZADO ── */
  const cursor       = document.getElementById('cursor');
  const cursorFollow = document.getElementById('cursorFollower');

  if (cursor && cursorFollow && window.matchMedia('(pointer: fine)').matches) {
    document.body.classList.add('cursor-active');

    let mouseX = 0, mouseY = 0;
    let followX = 0, followY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    /* Follower con lerp suave */
    (function animateFollower() {
      followX += (mouseX - followX) * 0.1;
      followY += (mouseY - followY) * 0.1;
      cursorFollow.style.left = followX + 'px';
      cursorFollow.style.top  = followY + 'px';
      requestAnimationFrame(animateFollower);
    })();

    /* Hover en elementos interactivos */
    // Selectores de targets
    const clickTargets = 'a, button, .propiedad-card, .servicio-card, .filtro-btn, .dot, .slider-btn, .gallery-thumb, .gallery-arrow, .card-slider-arrow, .lightbox-arrow, .lightbox-close, .modal-close, .tag, .social-icon, .mobile-link, .whatsapp-fab';
    const zoomTargets  = '.gallery-main img, .gallery-main-img, .card-slide img, .lightbox-img';

    function setCursor(type) {
      cursor.classList.remove('hover', 'zoom');
      cursorFollow.classList.remove('hover', 'zoom');
      if (type) { cursor.classList.add(type); cursorFollow.classList.add(type); }
    }

    document.addEventListener('mouseover', e => {
      // Zoom tiene prioridad: solo si NO estamos sobre una flecha
      if (e.target.closest(zoomTargets) && !e.target.closest('.gallery-arrow, .card-slider-arrow, .lightbox-arrow')) {
        setCursor('zoom');
      } else if (e.target.closest(clickTargets)) {
        setCursor('hover');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(zoomTargets) || e.target.closest(clickTargets)) {
        setCursor(null);
      }
    });

    /* Click pulse */
    document.addEventListener('mousedown', () => {
      cursor.classList.add('click');
      cursorFollow.classList.add('click');
    });
    document.addEventListener('mouseup', () => {
      cursor.classList.remove('click');
      cursorFollow.classList.remove('click');
    });
  }

  /* ── ANIMACIÓN DE ENTRADA HERO (fade up por elemento) ── */
  const heroEls = [
    document.querySelector('.hero-eyebrow'),
    document.querySelector('.hero-title'),
    document.querySelector('.hero-subtitle'),
    document.querySelector('.hero-actions'),
    document.querySelector('.hero-stats'),
  ];
  heroEls.forEach(el => { if (el) el.classList.remove('animate'); });

  /* Pequeño delay para que el browser pinte antes de arrancar */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroEls.forEach(el => { if (el) el.classList.add('animate'); });
    });
  });

const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  let menuOpen = false;

  function openMobileMenu() {
    menuOpen = true;
    hamburger.classList.add('active');
    mobileMenu.classList.add('open');
    // Mostrar overlay con pequeño delay para que la transición se vea
    requestAnimationFrame(() => {
      mobileOverlay.style.display = 'block';
      requestAnimationFrame(() => mobileOverlay.classList.add('active'));
    });
    lockScroll();
  }

  function closeMobileMenu() {
    menuOpen = false;
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('active');
    unlockScroll();
    // Ocultar overlay al terminar la transición
    mobileOverlay.addEventListener('transitionend', () => {
      if (!menuOpen) mobileOverlay.style.display = 'none';
    }, { once: true });
  }

  hamburger.addEventListener('click', () => {
    menuOpen ? closeMobileMenu() : openMobileMenu();
  });

  mobileOverlay.addEventListener('click', closeMobileMenu);

  // Links del menú móvil
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // CTA en menú móvil
  const mobileContactBtn = document.getElementById('openContactModalMobile');
  if (mobileContactBtn) {
    mobileContactBtn.addEventListener('click', () => {
      closeMobileMenu();
      setTimeout(() => openModal(document.getElementById('contactModal')), 300);
    });
  }

const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => {
    if (!el.closest('.hero')) revObs.observe(el);
  });

const statNums = document.querySelectorAll('.stat-num[data-count]');
  const heroStatsEl = document.querySelector('.hero-stats');
  let heroStatsReady = !heroStatsEl; /* true si no existe hero-stats */

  if (heroStatsEl) {
    /* El fade-up del hero-stats tarda 0.7s y arranca a los 0.8s (ver CSS) */
    setTimeout(() => { heroStatsReady = true; }, 1600);
  }

  const cntObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el  = e.target;
        const run = () => {
          animateCount(el, 0, +el.dataset.count, 1400);
          cntObs.unobserve(el);
        };
        /* Si el contador está dentro del hero, esperar a que termine su fade-in */
        if (el.closest('.hero-stats') && !heroStatsReady) {
          const wait = setInterval(() => {
            if (heroStatsReady) { clearInterval(wait); run(); }
          }, 50);
        } else {
          run();
        }
      }
    });
  }, { threshold: 0.4 });
  statNums.forEach(el => cntObs.observe(el));

  function animateCount(el, start, end, dur) {
    let t0 = null;
    const step = ts => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(start + (end - start) * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

document.querySelectorAll('.card-slider').forEach(slider => {
    const card      = slider.closest('.propiedad-card');
    const fotosStr  = (card ? card.dataset.fotos : '') || '';
    const fotos     = fotosStr.split('|').map(s => s.trim()).filter(Boolean);
    const slidesWrap = slider.querySelector('.card-slides');
    const dotsWrap   = slider.querySelector('.card-slider-dots');
    const allSlides  = Array.from(slidesWrap.querySelectorAll('.card-slide'));
    const count      = allSlides.length;

    if (count === 0) return;

    // Inyectar imágenes reales encima del color placeholder
    fotos.forEach((src, i) => {
      if (!allSlides[i]) return;
      const img = document.createElement('img');
      img.src     = src;
      img.alt     = '';
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;';
      img.onerror = () => img.remove();
      allSlides[i].appendChild(img);
    });

    allSlides[0].classList.add('active-slide');

    dotsWrap.innerHTML = '';
    if (count > 1) {
      allSlides.forEach((_, i) => {
        const d = document.createElement('span');
        d.className = 'cs-dot' + (i === 0 ? ' active' : '');
        dotsWrap.appendChild(d);
      });
    } else {
      dotsWrap.style.display = 'none';
    }
    const dots = dotsWrap.querySelectorAll('.cs-dot');

    if (count <= 1) return;

    ['prev','next'].forEach(dir => {
      const btn = document.createElement('button');
      btn.className = `card-slider-arrow ${dir}`;
      btn.innerHTML = dir === 'prev' ? '‹' : '›';
      btn.setAttribute('aria-label', dir === 'prev' ? 'Anterior' : 'Siguiente');
      slider.appendChild(btn);
    });

    let cur = 0, autoTimer = null;

    function goTo(idx, resetAuto = true) {
      cur = (idx + count) % count;
      slidesWrap.style.transform = `translateX(-${cur * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === cur));
      allSlides.forEach((s, i) => s.classList.toggle('active-slide', i === cur));
      if (resetAuto) { clearInterval(autoTimer); startAuto(); }
    }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(cur + 1, false), 8000); // ← cambia este número (ms) para ajustar velocidad
    }

    slider.addEventListener('mouseenter', () => clearInterval(autoTimer));
    slider.addEventListener('mouseleave', () => startAuto());

    slider.querySelector('.card-slider-arrow.prev')
      .addEventListener('click', e => { e.stopPropagation(); goTo(cur - 1); });
    slider.querySelector('.card-slider-arrow.next')
      .addEventListener('click', e => { e.stopPropagation(); goTo(cur + 1); });

    let tx = 0, ty = 0, swiping = false;
    slider.addEventListener('touchstart', e => {
      tx = e.touches[0].clientX; ty = e.touches[0].clientY; swiping = false;
    }, { passive: true });
    slider.addEventListener('touchmove', e => {
      const dx = tx - e.touches[0].clientX, dy = ty - e.touches[0].clientY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) { swiping = true; e.stopPropagation(); }
    }, { passive: true });
    slider.addEventListener('touchend', e => {
      if (!swiping) return;
      const diff = tx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? goTo(cur + 1) : goTo(cur - 1); e.stopPropagation(); }
      swiping = false;
    });

    startAuto();
  });

document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.propiedad-card').forEach(card => {
        card.classList.toggle('hidden', f !== 'todos' && card.dataset.tipo !== f);
      });
    });
  });

let galleryPhotos = [];
  let galleryCurrent = 0;

  const galleryMainImg  = document.getElementById('galleryMainImg');
  const galleryPh       = document.getElementById('galleryPlaceholder');
  const galleryCounter  = document.getElementById('galleryCounter');
  const galleryThumbs   = document.getElementById('galleryThumbs');
  const galleryPrev     = document.getElementById('galleryPrev');
  const galleryNext     = document.getElementById('galleryNext');
  const galleryMain     = document.getElementById('galleryMain');

  function buildGallery(fotosStr) {
    galleryPhotos = fotosStr ? fotosStr.split('|').map(s => s.trim()).filter(Boolean) : [];
    galleryThumbs.innerHTML = '';
    galleryCurrent = 0;

    if (galleryPhotos.length === 0) {
      galleryMainImg.style.display = 'none';
      galleryPh.style.display = 'flex';
      galleryCounter.textContent = '';
      galleryPrev.style.display = 'none';
      galleryNext.style.display = 'none';
      return;
    }

    galleryPh.style.display = 'none';
    galleryPrev.style.display = galleryPhotos.length > 1 ? 'flex' : 'none';
    galleryNext.style.display = galleryPhotos.length > 1 ? 'flex' : 'none';

    galleryPhotos.forEach((src, i) => {
      const thumb = document.createElement('div');
      thumb.className = 'gallery-thumb' + (i === 0 ? ' active' : '');
      if (src && !src.includes('placeholder')) {
        const img = document.createElement('img');
        img.src = src; img.alt = `Foto ${i + 1}`;
        thumb.appendChild(img);
      } else {
        thumb.textContent = `${i + 1}`;
      }
      thumb.addEventListener('click', (e) => { e.stopPropagation(); goGallery(i); });
      galleryThumbs.appendChild(thumb);
    });

    goGallery(0);
  }

  function goGallery(idx) {
    galleryCurrent = (idx + galleryPhotos.length) % galleryPhotos.length;
    const src = galleryPhotos[galleryCurrent];

    galleryMainImg.style.opacity = '0';
    setTimeout(() => {
      if (src && !src.includes('placeholder')) {
        galleryMainImg.src = src;
        galleryMainImg.style.display = 'block';
        galleryPh.style.display = 'none';
        galleryMainImg.onload = () => { galleryMainImg.style.opacity = '1'; };
        galleryMainImg.onerror = () => {
          galleryMainImg.style.display = 'none';
          galleryPh.style.display = 'flex';
        };
      } else {
        galleryMainImg.style.display = 'none';
        galleryPh.style.display = 'flex';
      }
      galleryCounter.textContent = `${galleryCurrent + 1} / ${galleryPhotos.length}`;
      galleryThumbs.querySelectorAll('.gallery-thumb').forEach((t, i) => {
        t.classList.toggle('active', i === galleryCurrent);
      });
    }, 120);
  }

  galleryPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    goGallery(galleryCurrent - 1);
  });
  galleryNext.addEventListener('click', (e) => {
    e.stopPropagation();
    goGallery(galleryCurrent + 1);
  });

  /* Touch swipe en la galería del modal */
  let gTouchX = 0, gTouchY = 0, gSwiping = false;
  galleryMain.addEventListener('touchstart', e => {
    gTouchX = e.touches[0].clientX;
    gTouchY = e.touches[0].clientY;
    gSwiping = false;
  }, { passive: true });
  galleryMain.addEventListener('touchmove', e => {
    const dx = gTouchX - e.touches[0].clientX;
    const dy = gTouchY - e.touches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
      gSwiping = true;
      e.preventDefault(); // evitar que el modal-scroll interfiera
    }
  }, { passive: false });
  galleryMain.addEventListener('touchend', e => {
    if (!gSwiping) return;
    const diff = gTouchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goGallery(galleryCurrent + 1) : goGallery(galleryCurrent - 1);
    }
    gSwiping = false;
  });

  /* Clic SOLO en la imagen → lightbox (no en flechas ni al terminar un swipe) */
  galleryMain.addEventListener('click', (e) => {
    if (e.target.closest('.gallery-arrow')) return;
    if (gSwiping) return;
    if (galleryPhotos.length > 0) openLightbox(galleryCurrent);
  });

const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxCap  = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');
  let lbCurrent = 0;

  function openLightbox(idx) {
    lbCurrent = idx;
    showLightboxImg(lbCurrent);
    lightbox.classList.add('active');
    document.body.classList.add('modal-open');
    lockScroll();
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('modal-open');
    const anyOpen = document.querySelector('.modal-overlay.active');
    if (!anyOpen) unlockScroll();
  }
  function showLightboxImg(idx) {
    lbCurrent = (idx + galleryPhotos.length) % galleryPhotos.length;
    const src = galleryPhotos[lbCurrent];
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = src || '';
      lightboxImg.style.opacity = '1';
      lightboxCap.textContent = `${lbCurrent + 1} / ${galleryPhotos.length}`;
    }, 100);
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showLightboxImg(lbCurrent - 1));
  lightboxNext.addEventListener('click', () => showLightboxImg(lbCurrent + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  /* Swipe en lightbox */
  let lbTouchX = 0;
  lightbox.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const diff = lbTouchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? showLightboxImg(lbCurrent + 1) : showLightboxImg(lbCurrent - 1);
  });

const propModal    = document.getElementById('propiedadModal');
  const closePropBtn = document.getElementById('closePropModal');

  document.querySelectorAll('.propiedad-card').forEach(card => {
    card.addEventListener('click', () => openPropModal(card));
  });

  function openPropModal(card) {
    document.getElementById('modalTipo').textContent     = capitalize(card.dataset.tipo);
    document.getElementById('modalNombre').textContent   = card.dataset.nombre;
    document.getElementById('modalUbicacion').textContent= '📍 ' + card.dataset.ubicacion;
    document.getElementById('modalPrecio').textContent   = card.dataset.precio;
    document.getElementById('modalRec').textContent      = card.dataset.recamaras;
    document.getElementById('modalBanos').textContent    = card.dataset.banos;
    document.getElementById('modalM2').textContent       = card.dataset.m2;
    document.getElementById('modalEstac').textContent    = card.dataset.estacionamientos;
    document.getElementById('modalDesc').textContent     = card.dataset.descripcion;

    buildGallery(card.dataset.fotos);
    openModal(propModal);
  }

  closePropBtn.addEventListener('click', () => closeModal(propModal));
  propModal.addEventListener('click', e => { if (e.target === propModal) closeModal(propModal); });

  document.getElementById('modalContactBtn').addEventListener('click', () => {
    closeModal(propModal);
    setTimeout(() => openModal(document.getElementById('contactModal')), 260);
  });

const contactModal = document.getElementById('contactModal');
  const closeContactBtn = document.getElementById('closeContactModal');

  ['openContactModal', 'openContactModalHero', 'openContactModalCTA'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => openModal(contactModal));
  });

  closeContactBtn.addEventListener('click', () => closeModal(contactModal));
  contactModal.addEventListener('click', e => { if (e.target === contactModal) closeModal(contactModal); });

/* ── Scroll lock que funciona en iOS Safari ── */
  let _scrollY = 0;

  function lockScroll() {
    _scrollY = window.scrollY;
    document.body.style.position   = 'fixed';
    document.body.style.top        = `-${_scrollY}px`;
    document.body.style.left       = '0';
    document.body.style.right      = '0';
    document.body.style.overflowY  = 'scroll'; /* evita salto por scrollbar */
  }

  function unlockScroll() {
    document.body.style.position  = '';
    document.body.style.top       = '';
    document.body.style.left      = '';
    document.body.style.right     = '';
    document.body.style.overflowY = '';
    window.scrollTo({ top: _scrollY, behavior: 'instant' });
  }

  function openModal(modal) {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    lockScroll();
  }
  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    /* Solo desbloquear si no hay otro modal abierto */
    const anyOpen = document.querySelector('.modal-overlay.active, .lightbox.active');
    if (!anyOpen) unlockScroll();
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (lightbox.classList.contains('active')) { closeLightbox(); return; }
      document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m));
    }
  });

const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  /* Solo números en el campo teléfono */
  const telInput = document.getElementById('telefono');
  if (telInput) {
    telInput.addEventListener('keypress', e => {
      // Permitir: números, backspace, tab, enter, flechas, +, -, (, ), espacio
      const allowed = /[0-9\+\-\(\)\s]/;
      if (!allowed.test(e.key) && !['Backspace','Delete','Tab','Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
        e.preventDefault();
      }
    });
    telInput.addEventListener('paste', e => {
      // Limpiar pegado — solo dejar números y símbolos válidos
      setTimeout(() => {
        telInput.value = telInput.value.replace(/[^0-9\+\-\(\)\s]/g, '');
      }, 0);
    });
  }

  contactForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateForm(contactForm)) return;

      /* Campo trampa para bots*/
      const trampa = contactForm.querySelector('#sitio_web');
      if (trampa && trampa.value !== '') return;

      const btnText   = contactForm.querySelector('.btn-text');
      const btnLoader = contactForm.querySelector('.btn-loader');
      btnText.style.display   = 'none';
      btnLoader.style.display = 'inline';

      /* jsmail */
      const SERVICE_ID  = 'service_cfph9ue';
      const TEMPLATE_ID = 'template_ebr2ock';

      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, contactForm)
        .then(() => {
          btnText.style.display   = 'inline';
          btnLoader.style.display = 'none';
          formSuccess.style.display = 'block';
          contactForm.reset();
          setTimeout(() => formSuccess.style.display = 'none', 6000);
        })
        .catch(err => {
          btnText.style.display   = 'inline';
          btnLoader.style.display = 'none';
          console.error('EmailJS error:', err);
          alert('Hubo un error al enviar. Por favor intenta de nuevo o contáctanos directamente.');
        });
    });

(function() {
    const track    = document.getElementById('serviciosTrack');
    const dotsWrap = document.getElementById('serviciosDots');
    const prevBtn  = document.getElementById('serviciosPrev');
    const nextBtn  = document.getElementById('serviciosNext');
    if (!track) return;

    const origCards = Array.from(track.querySelectorAll('.servicio-card'));
    const n = origCards.length;

    function visibles() {
      if (window.innerWidth >= 1024) return Math.min(3, n);
      if (window.innerWidth >= 768)  return Math.min(2, n);
      return 1;
    }

    // Clonar cards para el bucle infinito
    function setupClones() {
      // Limpiar clones previos
      track.querySelectorAll('.servicio-clone').forEach(c => c.remove());
      const vis = visibles();
      // Agregar clones al final e inicio
      for (let i = 0; i < vis; i++) {
        const cloneEnd   = origCards[i % n].cloneNode(true);
        const cloneStart = origCards[(n - 1 - i + n) % n].cloneNode(true);
        cloneEnd.classList.add('servicio-clone');
        cloneStart.classList.add('servicio-clone');
        track.appendChild(cloneEnd);
        track.prepend(cloneStart);
      }
    }

    let cur = 0; // índice lógico (0 = primera card real)

    function allCards() { return Array.from(track.querySelectorAll('.servicio-card')); }

    function getCardW() {
      // En móvil: ancho del contenedor slider (1 card = 100%)
      // En tablet/desktop: ancho de la primera card real + gap
      const vis = visibles();
      const cards = allCards();
      const realCards = cards.filter(c => !c.classList.contains('servicio-clone'));
      if (!realCards[0]) return 0;
      if (vis === 1) {
        // Móvil: moverse exactamente el ancho del slider
        return track.parentElement.offsetWidth;
      }
      return realCards[0].offsetWidth + 24; // card + gap (1.5rem)
    }

    function goTo(idx, animated = true) {
      const cards        = allCards();
      const clonesBefore = Math.round(track.querySelectorAll('.servicio-clone').length / 2);
      const realIdx      = idx + clonesBefore;
      const cardW        = getCardW();

      if (!animated) track.style.transition = 'none';
      track.style.transform = `translateX(-${realIdx * cardW}px)`;
      if (!animated) { track.offsetHeight; track.style.transition = ''; }

      cur = ((idx % n) + n) % n;
      dotsWrap.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === cur));
    }

    // Detección de fin de transición → teletransportar sin animación
    track.addEventListener('transitionend', () => {
      const vis         = visibles();
      const clonesBefore = Math.round(track.querySelectorAll('.servicio-clone').length / 2);
      const cards       = allCards();
      const cardW       = cards[0] ? cards[0].offsetWidth + 24 : 0;

      // Si estamos en los clones del final → volver al inicio
      if (cur === 0 && parseFloat(track.style.transform.replace('translateX(','')) < -(clonesBefore * cardW)) {
        goTo(0, false);
      }
      // Si estamos en los clones del inicio
      if (cur === n - 1 && parseFloat(track.style.transform.replace('translateX(','')) > -((clonesBefore - 1) * cardW)) {
        goTo(n - 1, false);
      }
    });

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < n; i++) {
        const d = document.createElement('button');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', `Servicio ${i + 1}`);
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
      }
    }

    function next() { goTo(cur + 1); }
    function prev() { goTo(cur - 1); }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    // Swipe táctil
    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = tx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    });

    // Deeplink — al hacer clic en un enlace #servicio-*
    function handleDeeplink(hash) {
      if (!hash || !hash.startsWith('#servicio-')) return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      const idx = origCards.indexOf(target);
      if (idx < 0) return;
      goTo(idx);
      // Scroll a la sección servicios
      const section = document.getElementById('servicios');
      if (section) {
        setTimeout(() => {
          const y = section.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 50);
      }
    }

    // Interceptar clicks en links del footer con deeplink a servicios
    document.querySelectorAll('a[href^="#servicio-"]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const hash = link.getAttribute('href');
        const target = document.querySelector(hash);
        if (!target) return;
        const idx = origCards.indexOf(target);
        if (idx >= 0) goTo(idx);
        const section = document.getElementById('servicios');
        if (section) {
          // Offset manual para compensar navbar fija (~80px)
          const y = section.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });

    window.addEventListener('hashchange', () => handleDeeplink(window.location.hash));
    window.addEventListener('resize', () => {
      setupClones();
      buildDots();
      goTo(cur, false);
    });

    // Init
    buildDots();
    setupClones();
    setTimeout(() => goTo(0, false), 50);
    setTimeout(() => handleDeeplink(window.location.hash), 500);
  })();

  function validateForm(form) {
    let ok = true;

    // Limpiar estilos previos y validar campos requeridos
    form.querySelectorAll('[required]').forEach(f => {
      f.style.borderColor = '';
      f.style.boxShadow   = '';
      if (!f.value.trim()) {
        markError(f);
        ok = false;
      }
    });

    // Validar email — formato correcto
    const em = form.querySelector('[type="email"]');
    if (em && em.value.trim()) {
      const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(em.value.trim())) {
        markError(em, 'Ingresa un correo válido (ej. nombre@correo.com)');
        ok = false;
      }
    }

    // Validar teléfono — solo números, espacios, guiones, paréntesis y +
    const tel = form.querySelector('[type="tel"]');
    if (tel && tel.value.trim()) {
      const telClean = tel.value.replace(/[\s\-\(\)\+]/g, '');
      if (!/^\d{7,15}$/.test(telClean)) {
        markError(tel, 'Solo ingresa números (7-15 dígitos)');
        ok = false;
      }
    }

    return ok;
  }

  function markError(field, msg) {
    field.style.borderColor = '#e05555';
    field.style.boxShadow   = '0 0 0 3px rgba(224,85,85,0.12)';
    // Mostrar mensaje de error inline si no existe ya
    let errEl = field.parentElement.querySelector('.field-error');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'field-error';
      errEl.style.cssText = 'display:block;font-size:0.72rem;color:#e05555;margin-top:0.3rem;';
      field.parentElement.appendChild(errEl);
    }
    if (msg) errEl.textContent = msg;
    // Limpiar error al escribir
    field.addEventListener('input', () => {
      field.style.borderColor = '';
      field.style.boxShadow   = '';
      if (errEl) errEl.remove();
    }, { once: true });
  }

const track   = document.getElementById('testimoniosTrack');
  const dotsWrap = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const slides  = track ? [...track.querySelectorAll('.testimonio-card')] : [];
  let cur = 0, autoT;

  if (slides.length) {
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Testimonio ${i + 1}`);
      d.addEventListener('click', () => { goSlide(i); resetAuto(); });
      dotsWrap.appendChild(d);
    });

    function goSlide(i) {
      cur = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${cur * 100}%)`;
      dotsWrap.querySelectorAll('.dot').forEach((d, j) => d.classList.toggle('active', j === cur));
    }
    function startAuto() { autoT = setInterval(() => goSlide(cur + 1), 5000); }
    function resetAuto() { clearInterval(autoT); startAuto(); }

    prevBtn.addEventListener('click', () => { goSlide(cur - 1); resetAuto(); });
    nextBtn.addEventListener('click', () => { goSlide(cur + 1); resetAuto(); });

    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const d = tx - e.changedTouches[0].clientX;
      if (Math.abs(d) > 50) { d > 0 ? goSlide(cur + 1) : goSlide(cur - 1); resetAuto(); }
    });

    startAuto();
  }

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const t = document.querySelector(this.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        document.querySelectorAll('.nav-link').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('section[id]').forEach(s => sectionObs.observe(s));

function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : ''; }

});
