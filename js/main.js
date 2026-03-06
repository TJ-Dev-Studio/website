(() => {
  'use strict';

  // ===========================
  // Mobile Navigation Toggle
  // ===========================

  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navLinks.classList.toggle('nav__links--open');
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('nav__links--open');
      });
    });
  }

  // ===========================
  // Smooth Scroll for Anchor Links
  // ===========================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===========================
  // Email Signup Form Handler
  // ===========================

  const SIGNUP_API_ENDPOINT = null; // Set to API URL when backend is ready
  const STORAGE_KEY = 'frogmog-signups';

  const signupForm = document.getElementById('signup-form');
  const toast = document.getElementById('toast');

  function showToast(message, duration = 3000) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('toast--visible');
    setTimeout(() => {
      toast.classList.remove('toast--visible');
    }, duration);
  }

  function saveToLocalStorage(data) {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existing.push({ ...data, timestamp: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('signup-name');
      const emailInput = document.getElementById('signup-email');
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();

      if (!name || !email) return;

      const data = { name, email };

      if (SIGNUP_API_ENDPOINT) {
        try {
          const res = await fetch(SIGNUP_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
        } catch {
          // Fallback to localStorage on API failure
          saveToLocalStorage(data);
        }
      } else {
        saveToLocalStorage(data);
      }

      showToast('Thanks for signing up! 🐸');
      signupForm.reset();
    });
  }

  // ===========================
  // Lazy-Load Gallery Images
  // ===========================

  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('.gallery__item img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // Images already have src set; this triggers visibility-based rendering
          img.classList.add('gallery__item--loaded');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ===========================
  // Hero Parallax Scroll Effect
  // ===========================

  const heroContent = document.querySelector('.hero__content');
  const hero = document.querySelector('.hero');

  if (heroContent && hero) {
    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const heroHeight = hero.offsetHeight;

      if (scrollY < heroHeight) {
        const offset = scrollY * 0.3;
        const opacity = 1 - (scrollY / heroHeight) * 0.8;
        heroContent.style.transform = `translateY(${offset}px)`;
        heroContent.style.opacity = String(opacity);
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }
})();
