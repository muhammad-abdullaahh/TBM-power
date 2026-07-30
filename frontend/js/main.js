/**
 * TBM POWER & ELECTRICAL ENGINEERING
 * Modern Industrial Corporate Vanilla JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modular components
  initPageLoader();
  initStickyHeader();
  initMobileMenu();
  initScrollReveal();
  initCounterAnimation();
  initTestimonialSlider();
  initGalleryFilterAndModal();
  initContactFormValidation();
  initScrollTopButton();
  highlightActiveNavLink();
});
/* --------------------------------------------------------------------------
   1. PAGE LOADER
   -------------------------------------------------------------------------- */
function initPageLoader() {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 300);
    });
    // Fallback if load already fired
    setTimeout(() => {
      if (!loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
      }
    }, 1500);
  }
}

/* --------------------------------------------------------------------------
   2. STICKY HEADER & SCROLL BEHAVIOR
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/* --------------------------------------------------------------------------
   3. MOBILE NAVIGATION MENU
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close when clicking outside menu
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   4. HIGHLIGHT ACTIVE NAV LINK ACCORDING TO URL
   -------------------------------------------------------------------------- */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   5. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   6. ANIMATED NUMERICAL COUNTERS
   -------------------------------------------------------------------------- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  let animated = false;

  const observerOptions = {
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => animateSingleCounter(counter));
      }
    });
  }, observerOptions);

  if (counters[0] && counters[0].parentElement) {
    counterObserver.observe(counters[0].parentElement.parentElement || counters[0]);
  }
}

function animateSingleCounter(counter) {
  const target = parseInt(counter.getAttribute('data-target'), 10);
  const suffix = counter.getAttribute('data-suffix') || '';
  const duration = 2000; // 2 seconds
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = target / steps;

  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      counter.textContent = target + suffix;
      clearInterval(timer);
    } else {
      counter.textContent = Math.ceil(current) + suffix;
    }
  }, stepTime);
}

/* --------------------------------------------------------------------------
   7. TESTIMONIAL SLIDER
   -------------------------------------------------------------------------- */
function initTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  const slides = document.querySelectorAll('.testimonial-slide');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoPlayTimer = null;

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

  function startAutoplay() {
    autoPlayTimer = setInterval(nextSlide, 6000);
  }

  function resetAutoplay() {
    clearInterval(autoPlayTimer);
    startAutoplay();
  }

  startAutoplay();
}

/* --------------------------------------------------------------------------
   8. GALLERY FILTER & MODAL LIGHTBOX
   -------------------------------------------------------------------------- */
function initGalleryFilterAndModal() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('galleryModal');
  const modalLabel = document.getElementById('modalPlaceholderLabel');
  const modalClose = document.getElementById('modalCloseBtn');

  // Filtering Logic
  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => { item.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  // Modal Lightbox Logic
  if (galleryItems.length > 0 && modal) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const labelText = item.querySelector('.placeholder-label')
          ? item.querySelector('.placeholder-label').textContent
          : 'Project View';
        if (modalLabel) modalLabel.textContent = labelText;
        modal.classList.add('active');
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   9. CONTACT FORM VALIDATION & SUCCESS STATE
   -------------------------------------------------------------------------- */
function initContactFormValidation() {
  const form = document.getElementById('contactForm');
  const successBanner = document.getElementById('formSuccessBanner');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Fields
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');

    // Reset error states
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.form-error-msg').forEach(el => el.classList.remove('active'));

    // Validate Name
    if (nameInput && nameInput.value.trim() === '') {
      setError(nameInput, 'Please enter your name.');
      isValid = false;
    }

    // Validate Email
    if (emailInput) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput.value.trim() === '' || !emailRegex.test(emailInput.value.trim())) {
        setError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      }
    }

    // Validate Phone
    if (phoneInput && phoneInput.value.trim() === '') {
      setError(phoneInput, 'Please enter your phone number.');
      isValid = false;
    }

    // Validate Message
    if (messageInput && messageInput.value.trim() === '') {
      setError(messageInput, 'Please enter your message.');
      isValid = false;
    }

    if (isValid) {
      if (successBanner) {
        successBanner.classList.add('active');
        form.reset();
        setTimeout(() => {
          successBanner.classList.remove('active');
        }, 6000);
      }
    }
  });
}

function setError(element, message) {
  element.classList.add('error');
  const errorContainer = element.parentElement.querySelector('.form-error-msg');
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.classList.add('active');
  }
}

/* --------------------------------------------------------------------------
   10. SCROLL TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initScrollTopButton() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('active');
    } else {
      scrollTopBtn.classList.remove('active');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
