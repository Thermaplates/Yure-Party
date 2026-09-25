/* ============================================================
   GUARDIAN TALES - INTERACTIONS SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const heroVideo = document.getElementById('heroVideo');
  const soundToggle = document.getElementById('soundToggle');
  const iconMuted = document.getElementById('iconMuted');
  const iconUnmuted = document.getElementById('iconUnmuted');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navbarWrapper = document.querySelector('.navbar-wrapper');

  // Ensure Video Autoplay
  if (heroVideo) {
    heroVideo.play().catch((err) => {
      console.log('Video autoplay prevented, retrying with muted:', err);
      heroVideo.muted = true;
      heroVideo.play();
    });
  }

  // Sound Toggle Feature
  if (soundToggle && heroVideo) {
    soundToggle.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      if (heroVideo.muted) {
        iconMuted.classList.remove('hidden');
        iconUnmuted.classList.add('hidden');
        soundToggle.setAttribute('title', 'Unmute Sound');
      } else {
        iconMuted.classList.add('hidden');
        iconUnmuted.classList.remove('hidden');
        soundToggle.setAttribute('title', 'Mute Sound');
      }
    });
  }

  // Mobile Navigation Toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking any nav link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // Dynamic Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbarWrapper.style.background = 'rgba(7, 8, 12, 0.95)';
      navbarWrapper.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.8)';
    } else {
      navbarWrapper.style.background = 'rgba(10, 11, 16, 0.88)';
      navbarWrapper.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.6)';
    }
  });

  // ============================================================
  // SCROLL-REVEAL OBSERVERS (Rise from bottom when scrolled into view)
  // ============================================================

  // Reveal News Cards
  const newsCards = document.querySelectorAll('.news-card');
  if (newsCards.length > 0 && 'IntersectionObserver' in window) {
    const newsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    newsCards.forEach(card => newsObserver.observe(card));
  } else {
    newsCards.forEach(card => card.classList.add('is-revealed'));
  }

  // Reveal Characters Stage (Smooth rise from bottom)
  const charactersStage = document.getElementById('charactersStage');
  if (charactersStage && 'IntersectionObserver' in window) {
    const charObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          charactersStage.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    charObserver.observe(charactersStage);
  } else if (charactersStage) {
    charactersStage.classList.add('is-revealed');
  }

  // ============================================================
  // PARALLAX SCROLL EFFECT FOR CHARACTERS SHOWCASE
  // ============================================================
  const parallaxSection = document.getElementById('characters-showcase');
  const parallaxBgLayer = document.getElementById('parallaxBgLayer');
  const parallaxGroupLayer = document.getElementById('parallaxGroupLayer');

  if (parallaxSection && parallaxBgLayer && parallaxGroupLayer) {
    let isTicking = false;

    const updateParallax = () => {
      const rect = parallaxSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only calculate when section is near viewport
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        // Background moves slightly slower/deeper
        const bgOffset = (progress - 0.5) * 60;
        // Characters group moves with subtle foreground parallax
        const charOffset = (progress - 0.5) * -18;

        parallaxBgLayer.style.transform = `translate3d(0, ${bgOffset.toFixed(1)}px, 0)`;
        parallaxGroupLayer.style.transform = `translate3d(0, ${charOffset.toFixed(1)}px, 0)`;
      }

      isTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (!isTicking) {
        window.requestAnimationFrame(updateParallax);
        isTicking = true;
      }
    }, { passive: true });

    // Initial positioning
    updateParallax();
  }
});
