/**
 * DIVYAL GUPTA - PORTFOLIO INTERACTIVITY
 * Clean, modern vanilla JavaScript for smooth UX, dark/light theme,
 * typewriter effects, copy-to-clipboard, contact form, and mobile navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC YEAR IN FOOTER
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. THEME SWITCHER (Dark & Light Mode)
  initThemeToggle();

  // 3. MOBILE NAVIGATION MENU
  initMobileMenu();

  // 4. NAVBAR SCROLL EFFECT & SCROLL-SPY
  initNavbarScroll();

  // 5. TYPEWRITER EFFECT
  initTypewriter();

  // 6. COPY-TO-CLIPBOARD FUNCTIONALITY
  initCopyButtons();

  // 7. CONTACT FORM VALIDATION & HANDLING
  initContactForm();

  // 8. BACK TO TOP BUTTON
  initBackToTop();

  // 9. ANIMATE ON SCROLL (Skill Bars & Cards)
  initScrollAnimations();
});

/* ===================================================================
   THEME TOGGLE
   =================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve stored theme or default to dark
  const savedTheme = localStorage.getItem('dg_portfolio_theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('dg_portfolio_theme', newTheme);

      showToast(`Switched to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode`, '🌓');
    });
  }
}

/* ===================================================================
   MOBILE NAVIGATION MENU
   =================================================================== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
  });

  // Close mobile menu when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu if window resized larger than mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 868) {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });
}

/* ===================================================================
   NAVBAR SCROLL & ACTIVE SCROLL-SPY
   =================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Navbar background blur/shrink
    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // ScrollSpy: highlight active link
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ===================================================================
   TYPEWRITER EFFECT
   =================================================================== */
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter');
  if (!typewriterElement) return;

  const words = [
    'Aspiring AI/ML Engineer.',
    'B.Tech CSE (AI/ML) Student @ JECRC.',
    'C Programming Explorer.',
    'Tech Innovator from Gorakhpur.',
    'Passionate Problem Solver.'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 450;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ===================================================================
   COPY-TO-CLIPBOARD FUNCTIONALITY
   =================================================================== */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      copyTextToClipboard(textToCopy, () => {
        const copyTextSpan = btn.querySelector('.copy-text');
        const originalText = copyTextSpan ? copyTextSpan.textContent : 'Copy';

        if (copyTextSpan) {
          copyTextSpan.textContent = 'Copied!';
        }

        showToast(`Copied "${textToCopy}" to clipboard!`, '📋');

        setTimeout(() => {
          if (copyTextSpan) {
            copyTextSpan.textContent = originalText;
          }
        }, 2200);
      });
    });
  });
}

function copyTextToClipboard(text, callback) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(callback).catch(() => {
      fallbackCopyText(text, callback);
    });
  } else {
    fallbackCopyText(text, callback);
  }
}

function fallbackCopyText(text, callback) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.top = '-9999px';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    if (callback) callback();
  } catch (err) {
    console.error('Failed to copy fallback:', err);
  }

  document.body.removeChild(textArea);
}

/* ===================================================================
   CONTACT FORM VALIDATION & HANDLING
   =================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    let isValid = true;

    // Helper for validation
    function validateField(input, condition) {
      const formGroup = input.closest('.form-group');
      if (!condition) {
        formGroup.classList.add('has-error');
        isValid = false;
      } else {
        formGroup.classList.remove('has-error');
      }
    }

    validateField(nameInput, nameInput.value.trim().length > 1);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateField(emailInput, emailPattern.test(emailInput.value.trim()));

    validateField(subjectInput, subjectInput.value.trim().length > 1);
    validateField(messageInput, messageInput.value.trim().length > 3);

    if (isValid) {
      const name = encodeURIComponent(nameInput.value.trim());
      const subject = encodeURIComponent(subjectInput.value.trim());
      const body = encodeURIComponent(
        `Hi Divyal,\n\nName: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`
      );

      // Open mail client addressed to divyalg780@gmail.com
      const mailtoLink = `mailto:divyalg780@gmail.com?subject=${subject}&body=${body}`;

      if (formStatus) {
        formStatus.textContent = 'Opening your email client to send message to divyalg780@gmail.com...';
        formStatus.className = 'form-status success';
      }

      showToast('Opening email client for Divyal Gupta...', '✉️');

      window.location.href = mailtoLink;

      // Reset form after short delay
      setTimeout(() => {
        contactForm.reset();
        if (formStatus) {
          formStatus.textContent = 'Message ready! You can also connect directly via phone (+91 9250127065) or email.';
        }
      }, 1500);
    }
  });

  // Clear errors on input typing
  contactForm.querySelectorAll('.form-input, .form-textarea').forEach(field => {
    field.addEventListener('input', () => {
      const formGroup = field.closest('.form-group');
      if (formGroup) {
        formGroup.classList.remove('has-error');
      }
    });
  });
}

/* ===================================================================
   BACK TO TOP BUTTON
   =================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 380) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ===================================================================
   TOAST NOTIFICATION COMPONENT
   =================================================================== */
function showToast(message, icon = '✨') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Dismiss after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode === container) {
        container.removeChild(toast);
      }
    }, 350);
  }, 3000);
}

/* ===================================================================
   SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   =================================================================== */
function initScrollAnimations() {
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.style.width;
          bar.style.width = '0%';
          requestAnimationFrame(() => {
            bar.style.width = targetWidth;
          });
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => observer.observe(bar));
  }
}
