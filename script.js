/* ============================================================
   Portfolio – Main Script
   Premium personal portfolio interactions & animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ----------------------------------------------------------
     1.  UTILITY REFERENCES
  ---------------------------------------------------------- */
  const navbar       = document.querySelector('.navbar');
  const navToggle    = document.querySelector('.nav-toggle');
  const navMenu      = document.querySelector('.nav-menu');
  const navLinks     = document.querySelectorAll('.nav-menu a[href^="#"]');
  const sections     = document.querySelectorAll('section[id]');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroContent  = document.querySelector('.hero-content');
  const backToTop    = document.querySelector('.back-to-top');
  const progressBar  = document.querySelector('.progress-bar');
  const preloader    = document.querySelector('.preloader');
  const contactForm  = document.querySelector('.contact-form');
  const canvas       = document.getElementById('particles-bg');

  const NAVBAR_HEIGHT = 80;

  /* ----------------------------------------------------------
     2.  SMOOTH SCROLL
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.pageYOffset - NAVBAR_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile menu after click
      if (navMenu) navMenu.classList.remove('active');
    });
  });

  /* ----------------------------------------------------------
     3.  NAVBAR – scroll class & active link tracking
  ---------------------------------------------------------- */
  const handleNavbar = () => {
    if (!navbar) return;

    // Add .scrolled when user scrolls past 50px
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Determine active section
    let currentSection = '';
    sections.forEach(section => {
      const top = section.offsetTop - NAVBAR_HEIGHT - 60;
      if (window.scrollY >= top) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('nav-active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('nav-active');
      }
    });
  };

  window.addEventListener('scroll', handleNavbar, { passive: true });
  handleNavbar(); // run once on load

  // Mobile hamburger toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  /* ----------------------------------------------------------
     4.  SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  ---------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target); // trigger once
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ----------------------------------------------------------
     5.  TYPING EFFECT on .hero-subtitle
  ---------------------------------------------------------- */
  if (heroSubtitle) {
    const fullText = heroSubtitle.textContent.trim();
    heroSubtitle.textContent = '';
    heroSubtitle.style.visibility = 'visible';

    let charIndex = 0;

    const type = () => {
      if (charIndex < fullText.length) {
        heroSubtitle.textContent += fullText.charAt(charIndex);
        charIndex++;
        setTimeout(type, 50);
      } else {
        // Add blinking cursor after typing completes
        const cursor = document.createElement('span');
        cursor.classList.add('typing-cursor');
        cursor.textContent = '|';
        heroSubtitle.appendChild(cursor);
      }
    };

    setTimeout(type, 500);
  }

  /* ----------------------------------------------------------
     6.  SKILL BAR ANIMATION
  ---------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-bar');

  if (skillBars.length) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const bars = entry.target.closest('.skills-container')
            ? entry.target.closest('.skills-container').querySelectorAll('.skill-bar')
            : [entry.target];

          bars.forEach((bar, i) => {
            setTimeout(() => animateSkillBar(bar), i * 100);
          });

          skillObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    // Observe each bar individually so stagger is per-bar
    skillBars.forEach(bar => skillObserver.observe(bar));
  }

  /**
   * Animate a single skill bar from 0 → data-percentage.
   */
  function animateSkillBar(bar) {
    const fill = bar.querySelector('.skill-fill');
    const label = bar.querySelector('.skill-percentage');
    if (!fill) return;

    const target = parseInt(fill.getAttribute('data-percentage') || bar.getAttribute('data-percentage'), 10);
    if (isNaN(target)) return;

    // Animate width
    fill.style.width = `${target}%`;

    // Count up the number
    if (label) {
      countUp(label, 0, target, 1000);
    }
  }

  /* ----------------------------------------------------------
     7.  ACHIEVEMENT COUNTER ANIMATION
  ---------------------------------------------------------- */
  const achievementsSection = document.getElementById('achievements');

  if (achievementsSection) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const counters = entry.target.querySelectorAll('.counter-number');
          counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const suffix = counter.getAttribute('data-suffix') || '';
            if (isNaN(target)) return;

            countUp(counter, 0, target, 2000, suffix);
          });

          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    counterObserver.observe(achievementsSection);
  }

  /**
   * Smooth count-up with ease-out.
   * @param {HTMLElement} el   – element whose textContent to update
   * @param {number}     from – start value
   * @param {number}     to   – end value
   * @param {number}     dur  – duration in ms
   * @param {string}     suffix – optional suffix like '+'
   */
  function countUp(el, from, to, dur, suffix = '') {
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / dur, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);

      el.textContent = `${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  /* ----------------------------------------------------------
     8.  PROJECT CARD HOVER TILT (3D)
  ---------------------------------------------------------- */
  const MAX_TILT = 5; // degrees

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;   // cursor position inside card
      const y = e.clientY - rect.top;
      const hw = rect.width / 2;
      const hh = rect.height / 2;

      const rotateY = ((x - hw) / hw) * MAX_TILT;
      const rotateX = ((hh - y) / hh) * MAX_TILT;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    });
  });

  /* ----------------------------------------------------------
     9.  CONTACT FORM → mailto:
  ---------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = contactForm.querySelector('[name="name"]');
      const email   = contactForm.querySelector('[name="email"]');
      const subject = contactForm.querySelector('[name="subject"]');
      const message = contactForm.querySelector('[name="message"]');

      const subjectText = subject ? subject.value : 'Portfolio Contact';
      const bodyParts = [];
      if (name)    bodyParts.push(`Name: ${name.value}`);
      if (email)   bodyParts.push(`Email: ${email.value}`);
      if (message) bodyParts.push(`\n${message.value}`);

      const mailto = `mailto:?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyParts.join('\n'))}`;
      window.open(mailto, '_blank');

      // Brief success message
      const successMsg = document.createElement('p');
      successMsg.classList.add('form-success');
      successMsg.textContent = 'Opening your email client…';
      contactForm.appendChild(successMsg);

      setTimeout(() => successMsg.remove(), 4000);
      contactForm.reset();

      // Remove any leftover .focused classes
      contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('focused'));
    });
  }

  /* ----------------------------------------------------------
     10.  FLOATING LABEL ANIMATION
  ---------------------------------------------------------- */
  document.querySelectorAll('.form-input').forEach(input => {
    const group = input.closest('.form-group');
    if (!group) return;

    // If the field already has a value on load (e.g. autofill)
    if (input.value.trim()) group.classList.add('focused');

    input.addEventListener('focus', () => group.classList.add('focused'));
    input.addEventListener('blur', () => {
      if (!input.value.trim()) group.classList.remove('focused');
    });
  });

  /* ----------------------------------------------------------
     11.  PARALLAX EFFECT – hero content
  ---------------------------------------------------------- */
  const handleParallax = () => {
    if (window.innerWidth <= 768 || !heroContent) return;
    const offset = window.scrollY * 0.3;
    heroContent.style.transform = `translateY(${offset}px)`;
  };

  window.addEventListener('scroll', handleParallax, { passive: true });

  /* ----------------------------------------------------------
     12.  BACK TO TOP BUTTON
  ---------------------------------------------------------- */
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     13.  SECTION PROGRESS BAR
  ---------------------------------------------------------- */
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / docHeight) * 100;
      progressBar.style.width = `${scrolled}%`;
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     14.  PRELOADER
  ---------------------------------------------------------- */
  window.addEventListener('load', () => {
    if (preloader) {
      preloader.style.opacity = '0';
      preloader.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
    document.body.classList.add('loaded');
  });

  /* ----------------------------------------------------------
     15.  CERTIFICATE MODAL
  ---------------------------------------------------------- */
  const certModal = document.querySelector('.cert-modal');
  const certModalImg = certModal ? certModal.querySelector('img') : null;
  const certCloseBtn = certModal ? certModal.querySelector('.cert-modal-close') : null;

  const openCertModal = (src, alt) => {
    if (!certModal || !certModalImg) return;
    certModalImg.src = src;
    certModalImg.alt = alt || 'Certificate';
    certModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeCertModal = () => {
    if (!certModal) return;
    certModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
        const imagePath = card.dataset.cert;
        const title = card.querySelector('.cert-title').textContent;

        if (imagePath) {
            openCertModal(imagePath, title);
        }
    });
});

  if (certCloseBtn) certCloseBtn.addEventListener('click', closeCertModal);
  if (certModal) {
    certModal.addEventListener('click', (e) => {
      // Close when clicking the overlay (not the image itself)
      if (e.target === certModal) closeCertModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCertModal();
  });

  /* ----------------------------------------------------------
     16.  PARTICLES BACKGROUND (Canvas)
  ---------------------------------------------------------- */
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const PARTICLE_COUNT_MIN = 20;
    const PARTICLE_COUNT_MAX = 40;
    const CONNECT_DIST = 120;  // px – max distance to draw a line
    const PARTICLE_COLOR = 'rgba(0, 206, 209, ';  // teal base (darkturquoise)

    let particles = [];
    let animFrameId = null;

    /** Size the canvas to its parent / landing section */
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width  = parent ? parent.offsetWidth  : window.innerWidth;
      canvas.height = parent ? parent.offsetHeight : window.innerHeight;
    };

    /** Create one particle */
    const createParticle = () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 2 + 1,           // radius 1-3
      vx: (Math.random() - 0.5) * 0.4,     // slow horizontal drift
      vy: (Math.random() - 0.5) * 0.4,     // slow vertical drift
      alpha: Math.random() * 0.5 + 0.3,    // 0.3 – 0.8 opacity
    });

    /** Initialise particle array */
    const initParticles = () => {
      const count = Math.floor(
        Math.random() * (PARTICLE_COUNT_MAX - PARTICLE_COUNT_MIN + 1) + PARTICLE_COUNT_MIN
      );
      particles = Array.from({ length: count }, createParticle);
    };

    /** Draw a single frame */
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move & draw dots
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${PARTICLE_COLOR}${p.alpha})`;
        ctx.fill();
      });

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const opacity = (1 - dist / CONNECT_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${PARTICLE_COLOR}${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animFrameId = requestAnimationFrame(draw);
    };

    // Kick off
    resizeCanvas();
    initParticles();
    draw();

    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        initParticles();  // redistribute particles for new dimensions
      }, 200);
    });
  }

}); // END DOMContentLoaded
