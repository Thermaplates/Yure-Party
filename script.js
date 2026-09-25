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

  // ============================================================
  // FEATURES CAROUSEL CONTROLLER (PAGE 3)
  // ============================================================
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselViewport = document.getElementById('carouselViewport');
  const slides = document.querySelectorAll('.carousel-slide');
  const tabs = document.querySelectorAll('.carousel-tab');
  const btnPrev = document.getElementById('carouselPrev');
  const btnNext = document.getElementById('carouselNext');

  if (slides.length > 0 && carouselTrack) {
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideTimer = null;

    const goToSlide = (index) => {
      // Normalize index
      currentSlide = (index + totalSlides) % totalSlides;

      // Translate track smoothly
      carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

      // Update slide states & video playback
      slides.forEach((slide, idx) => {
        const isActive = (idx === currentSlide);
        slide.classList.toggle('active', isActive);

        const video = slide.querySelector('video');
        if (video) {
          if (isActive) {
            video.currentTime = 0;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      });

      // Update tab active states
      tabs.forEach((tab, idx) => {
        tab.classList.toggle('active', idx === currentSlide);
      });
    };

    // Navigation button clicks
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        resetAutoSlide();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        resetAutoSlide();
      });
    }

    // Tab button clicks
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetIndex = parseInt(tab.getAttribute('data-index'), 10);
        if (!isNaN(targetIndex)) {
          goToSlide(targetIndex);
          resetAutoSlide();
        }
      });
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (carouselViewport) {
      carouselViewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carouselViewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            goToSlide(currentSlide + 1); // Swipe left -> Next
          } else {
            goToSlide(currentSlide - 1); // Swipe right -> Prev
          }
          resetAutoSlide();
        }
      }, { passive: true });
    }

    // Auto-advance every 8 seconds, paused on hover
    const startAutoSlide = () => {
      autoSlideTimer = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 8000);
    };

    const stopAutoSlide = () => {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    };

    const resetAutoSlide = () => {
      stopAutoSlide();
      startAutoSlide();
    };

    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
      carouselWrapper.addEventListener('mouseenter', stopAutoSlide);
      carouselWrapper.addEventListener('mouseleave', startAutoSlide);
    }

    // Initialize first slide state
    goToSlide(0);

    // Start timer initially
    startAutoSlide();
  }

  /* ==========================================================================
     SECTION 4: HEROES SHOWCASE CONTROLLER (GUARDIAN TALES STYLE)
     ========================================================================== */
  const heroesData = [
    {
      id: 'nia',
      name: 'NIA',
      roleTitle: 'GHOST MAID & LEADER',
      mainArt: 'assets/images/chara_nia.png',
      miniThumb: 'assets/images/face_nia_thumb.png',
      role: 'MENTALIST',
      element: 'THUNDER(ASTRAPHOBIA) - MAGIC',
      special: '',
      weapon: 'Cyclops',
      evoStar: 3,
      evoStages: {
        3: 'assets/images/face_nia_thumb.png',
        4: 'assets/images/chara_nia.png',
        5: 'assets/img/Happy.png'
      }
    },
    {
      id: 'sophia',
      name: 'SOPHIA',
      roleTitle: 'TEN THOUSAND GHOST FIST',
      mainArt: 'assets/images/chara_sophia.png',
      miniThumb: 'assets/images/face_sophia.png',
      role: 'HAUNTER',
      element: 'WIND(ANCRAOPHOBIA) - PHYSICAL',
      special: 'ELECTRIC GHOST WIND FISTS',
      weapon: 'SIMON',
      evoStar: 3,
      evoStages: {
        3: 'assets/images/face_sophia.png',
        4: 'assets/images/chara_sophia.png',
        5: 'assets/img/Sophia1.png'
      }
    },
    {
      id: 'saki',
      name: 'SAKI',
      roleTitle: 'THE TOUGHNESS GHOST',
      mainArt: 'assets/images/chara_saki.png',
      miniThumb: 'assets/images/face_saki.png',
      role: 'RESISTER',
      element: 'DARKNESS(NYCTOPHOBIA) - MAGIC',
      special: "I'M AFRAID",
      weapon: 'ETHAN',
      evoStar: 3,
      evoStages: {
        3: 'assets/images/face_saki.png',
        4: 'assets/images/chara_saki.png',
        5: 'assets/img/Saki2.png'
      }
    },
    {
      id: 'karso',
      name: 'MBAH KARSO',
      roleTitle: 'MYSTIC SAGE & FORGER',
      mainArt: 'assets/images/chara_karso.png',
      miniThumb: 'assets/images/face_karso_thumb.png',
      role: 'DALANG',
      element: 'EARTH(TACHOPHOBIA) FIRE (PYROPHOBIA) - MAGIC',
      special: 'GENBI AMARTA DAHANA',
      weapon: 'KERIS ',
      evoStar: 3,
      evoStages: {
        3: 'assets/images/face_karso_thumb.png',
        4: 'assets/images/chara_karso.png',
        5: 'assets/img/mbah karso_20260728125825.png'
      }
    },
    {
      id: 'john',
      name: 'JOHN',
      roleTitle: 'WORLD-WEARY SALARYMAN',
      mainArt: 'assets/img/John 1 (2).png',
      miniThumb: 'assets/img/Ambatong.png',
      role: 'DEFENDER TANK',
      element: 'NEUTRAL / VOID',
      special: 'OVERTIME OVERDRIVE',
      weapon: 'BRIEFCASE OF JUSTICE',
      evoStar: 3,
      evoStages: {
        3: 'assets/img/Ambatong.png',
        4: 'assets/img/John 1 (2).png',
        5: 'assets/img/Untitled356_20260710213924.png'
      }
    }
  ];

  let currentHeroIndex = 0;
  const heroDisplayContent = document.getElementById('heroDisplayContent');
  const heroNameEl = document.getElementById('heroName');
  const heroRoleTitleEl = document.getElementById('heroRoleTitle');
  const heroMainArtEl = document.getElementById('heroMainArt');
  const heroStatRoleEl = document.getElementById('heroStatRole');
  const heroStatElementEl = document.getElementById('heroStatElement');
  const heroStatSpecialEl = document.getElementById('heroStatSpecial');
  const heroStatWeaponEl = document.getElementById('heroStatWeapon');
  const evolutionSpriteEl = document.getElementById('evolutionSprite');
  const evolutionStarsEl = document.getElementById('evolutionStars');
  const heroMiniPrevImg = document.querySelector('#heroMiniPrev img');
  const heroMiniNextImg = document.querySelector('#heroMiniNext img');
  const heroPrevBtn = document.getElementById('heroPrevBtn');
  const heroNextBtn = document.getElementById('heroNextBtn');
  const evoPrevBtn = document.getElementById('evoPrevBtn');
  const evoNextBtn = document.getElementById('evoNextBtn');
  const heroDots = document.querySelectorAll('.hero-dot');
  const heroStage = document.getElementById('heroStage');

  const updateEvolutionUI = (hero) => {
    if (!evolutionSpriteEl || !evolutionStarsEl) return;
    const currentStars = hero.evoStar || 3;
    const spriteSrc = hero.evoStages[currentStars] || hero.miniThumb;
    
    // Smooth sprite transition
    evolutionSpriteEl.style.opacity = '0.4';
    evolutionSpriteEl.style.transform = 'scale(0.85)';
    setTimeout(() => {
      evolutionSpriteEl.src = spriteSrc;
      evolutionSpriteEl.style.opacity = '1';
      evolutionSpriteEl.style.transform = 'scale(1)';
    }, 150);

    // Update stars (5 stars total, 1 to 5)
    evolutionStarsEl.innerHTML = '';
    for (let s = 1; s <= 5; s++) {
      const star = document.createElement('span');
      star.className = s <= currentStars ? 'evo-star active' : 'evo-star';
      star.textContent = '✦';
      evolutionStarsEl.appendChild(star);
    }
  };

  const renderHero = (index, direction = 'next') => {
    if (index < 0) index = heroesData.length - 1;
    if (index >= heroesData.length) index = 0;
    currentHeroIndex = index;

    const hero = heroesData[currentHeroIndex];
    const prevHero = heroesData[(currentHeroIndex - 1 + heroesData.length) % heroesData.length];
    const nextHero = heroesData[(currentHeroIndex + 1) % heroesData.length];

    // Transition out main content
    if (heroDisplayContent) {
      heroDisplayContent.classList.add('hero-transition-out');
    }

    setTimeout(() => {
      // Update Texts
      if (heroNameEl) heroNameEl.textContent = hero.name;
      if (heroRoleTitleEl) heroRoleTitleEl.textContent = hero.roleTitle;
      if (heroStatRoleEl) heroStatRoleEl.textContent = hero.role;
      if (heroStatElementEl) heroStatElementEl.textContent = hero.element;
      if (heroStatSpecialEl) heroStatSpecialEl.textContent = hero.special ? hero.special : '—';
      if (heroStatWeaponEl) heroStatWeaponEl.textContent = hero.weapon;

      // Update Main Art
      if (heroMainArtEl) {
        heroMainArtEl.src = hero.mainArt;
        heroMainArtEl.alt = `${hero.name} Artwork`;
      }

      // Update Nav Mini Previews
      if (heroMiniPrevImg) {
        heroMiniPrevImg.src = prevHero.miniThumb || prevHero.mainArt;
        heroMiniPrevImg.alt = prevHero.name;
      }
      if (heroMiniNextImg) {
        heroMiniNextImg.src = nextHero.miniThumb || nextHero.mainArt;
        heroMiniNextImg.alt = nextHero.name;
      }

      // Update Evolution Stage
      updateEvolutionUI(hero);

      // Update Dots
      heroDots.forEach((dot, dIdx) => {
        dot.classList.toggle('active', dIdx === currentHeroIndex);
      });

      // Transition in
      if (heroDisplayContent) {
        heroDisplayContent.classList.remove('hero-transition-out');
        heroDisplayContent.classList.add('hero-transition-in');
        setTimeout(() => {
          heroDisplayContent.classList.remove('hero-transition-in');
        }, 300);
      }
    }, 180);
  };

  // Wire Hero Navigation Arrows
  if (heroPrevBtn) {
    heroPrevBtn.addEventListener('click', () => {
      renderHero(currentHeroIndex - 1, 'prev');
    });
  }

  if (heroNextBtn) {
    heroNextBtn.addEventListener('click', () => {
      renderHero(currentHeroIndex + 1, 'next');
    });
  }

  // Wire Pagination Dots
  heroDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      if (!isNaN(idx) && idx !== currentHeroIndex) {
        renderHero(idx, idx > currentHeroIndex ? 'next' : 'prev');
      }
    });
  });

  // Wire Evolution Star Toggles (< and >)
  if (evoPrevBtn) {
    evoPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const hero = heroesData[currentHeroIndex];
      if (hero.evoStar > 3) {
        hero.evoStar--;
      } else {
        hero.evoStar = 5; // wrap around
      }
      updateEvolutionUI(hero);
    });
  }

  if (evoNextBtn) {
    evoNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const hero = heroesData[currentHeroIndex];
      if (hero.evoStar < 5) {
        hero.evoStar++;
      } else {
        hero.evoStar = 3; // wrap around
      }
      updateEvolutionUI(hero);
    });
  }

  // Swipe support for heroes stage on mobile
  if (heroStage) {
    let heroTouchStartX = 0;
    let heroTouchEndX = 0;

    heroStage.addEventListener('touchstart', (e) => {
      heroTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroStage.addEventListener('touchend', (e) => {
      heroTouchEndX = e.changedTouches[0].screenX;
      const diff = heroTouchStartX - heroTouchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          renderHero(currentHeroIndex + 1, 'next');
        } else {
          renderHero(currentHeroIndex - 1, 'prev');
        }
      }
    }, { passive: true });
  }

  // Initialize first hero
  if (document.getElementById('heroes')) {
    renderHero(0);
  }
});

