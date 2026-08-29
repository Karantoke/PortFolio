/**
 * Karan Toke - Personal Developer Portfolio
 * JavaScript Architecture & Interactive Modules
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    hideLoader();
    initTheme();
    handleScroll();
    highlightActiveSection();
    smoothScrollLinks();
    initMobileMenu();
    typeWriter();
    initScrollReveal();
    initProjectFilter();
    initLightbox();
    initContactForm();
    initBackToTop();
    setYear();
    imageErrorFallback();
});

/* ==========================================================================
   1. LOADING SCREEN
   ========================================================================== */
function hideLoader() {
    const loader = document.getElementById('loading-screen');
    if (!loader) return;

    // Simulate system initialization for 1800ms
    setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 400);
    }, 1800);
}

/* ==========================================================================
   2 & 3. THEME MANAGEMENT (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
    const savedTheme = localStorage.getItem('kp_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    const themeToggleBtn = document.getElementById('theme-toggle');
    const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    if (mobileThemeToggleBtn) {
        mobileThemeToggleBtn.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('kp_theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const toggles = [
        document.getElementById('theme-toggle'),
        document.getElementById('mobile-theme-toggle')
    ];

    toggles.forEach(toggle => {
        if (!toggle) return;
        if (theme === 'light') {
            toggle.innerHTML = `
                <svg class="theme-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            `;
            toggle.setAttribute('aria-label', 'Switch to dark mode');
            toggle.setAttribute('title', 'Switch to dark mode');
        } else {
            toggle.innerHTML = `
                <svg class="theme-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
            `;
            toggle.setAttribute('aria-label', 'Switch to light mode');
            toggle.setAttribute('title', 'Switch to light mode');
        }
    });
}

/* ==========================================================================
   4. NAVBAR SCROLL & BACK TO TOP VISIBILITY
   ========================================================================== */
function handleScroll() {
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar blur trigger (> 80px)
        if (navbar) {
            if (scrollY > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Back to top visibility (> 300px)
        if (backToTopBtn) {
            if (scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    }, { passive: true });
}

/* ==========================================================================
   5. ACTIVE NAV LINK HIGHLIGHTING
   ========================================================================== */
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, { passive: true });
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   6. SMOOTH SCROLLING FOR LINKS
   ========================================================================== */
function smoothScrollLinks() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                const hamburger = document.querySelector('.hamburger');
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                    if (hamburger) {
                        hamburger.classList.remove('open');
                        hamburger.setAttribute('aria-expanded', 'false');
                    }
                }

                // Scroll smoothly considering fixed navbar offset
                const navHeight = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================================================
   7. MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileMenu.classList.contains('open');
        if (isOpen) {
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        } else {
            mobileMenu.classList.add('open');
            hamburger.classList.add('open');
            hamburger.setAttribute('aria-expanded', 'true');
        }
    });

    // Close when clicking outside menu
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    // Close on window resize if expanded
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ==========================================================================
   8. TYPEWRITER ANIMATION
   ========================================================================== */
function typeWriter() {
    const textElement = document.querySelector('.hero-title-dynamic');
    if (!textElement) return;

    const phrases = [
        "Aspiring Software Developer",
        "Web Developer",
        "Java Developer",
        "Problem Solver"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = 100;

        if (isDeleting) {
            typingSpeed = 50; // faster deletion
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at complete phrase
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // pause before typing next
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ==========================================================================
   9. SCROLL REVEAL (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('revealed'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   10. PROJECTS CATEGORY FILTER
   ========================================================================== */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length === 0 || projectCards.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (category === 'all' || cardCategory === category) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.96)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

/* ==========================================================================
   11 & 12. LIGHTBOX MODAL
   ========================================================================== */
let activeLightbox = null;

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    activeLightbox = lightbox;
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const overlay = lightbox.querySelector('.lightbox-overlay');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    if (overlay) {
        overlay.addEventListener('click', closeLightbox);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // Attach open triggers to certificate & assessment cards
    const triggers = document.querySelectorAll('[data-lightbox-src]');
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const src = trigger.getAttribute('data-lightbox-src');
            const title = trigger.getAttribute('data-lightbox-title') || 'Preview';
            openLightbox(src, title);
        });
    });
}

function openLightbox(src, title) {
    if (!activeLightbox) activeLightbox = document.getElementById('lightbox');
    if (!activeLightbox) return;

    const img = activeLightbox.querySelector('.lightbox-img');
    const caption = activeLightbox.querySelector('.lightbox-caption');
    const fallbackBox = activeLightbox.querySelector('.lightbox-fallback');

    if (img) {
        img.style.display = 'block';
        img.src = src;
        img.alt = title;

        img.onerror = () => {
            img.style.display = 'none';
            if (fallbackBox) {
                fallbackBox.style.display = 'flex';
                fallbackBox.innerHTML = `
                    <div class="lightbox-placeholder-content">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <h3>${title}</h3>
                        <p>Verified credential / document for Karan Toke</p>
                    </div>
                `;
            }
        };
        if (fallbackBox) fallbackBox.style.display = 'none';
    }

    if (caption) {
        caption.textContent = title;
    }

    activeLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (!activeLightbox) activeLightbox = document.getElementById('lightbox');
    if (!activeLightbox) return;

    activeLightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Expose globally for inline triggers if needed
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

/* ==========================================================================
   13. CONTACT FORM VALIDATION & EMAILJS SUBMIT
   ========================================================================== */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const submitText = submitButton ? submitButton.querySelector('.submit-text') : null;
    const statusBox = document.getElementById('form-status');
    const emailConfig = window.EMAILJS_CONFIG || {};

    function showFieldError(field, message) {
        if (!field) return;
        field.classList.add('error');
        const errSpan = field.parentElement.querySelector('.error-msg');
        if (errSpan) {
            errSpan.textContent = message;
        }
    }

    function clearFormStatus() {
        if (!statusBox) return;
        statusBox.className = 'form-status';
        statusBox.textContent = '';
    }

    function showFormStatus(type, message) {
        if (!statusBox) return;
        statusBox.className = `form-status ${type}`;
        statusBox.textContent = message;
    }

    function setSubmitting(isSubmitting) {
        if (!submitButton) return;

        submitButton.disabled = isSubmitting;

        if (submitText) {
            submitText.textContent = isSubmitting ? 'Sending...' : 'Send Message';
        }
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearFormStatus();

        let isValid = true;
        [nameInput, emailInput, subjectInput, messageInput].forEach(field => {
            if (field) {
                field.classList.remove('error');
                const errSpan = field.parentElement.querySelector('.error-msg');
                if (errSpan) errSpan.textContent = '';
            }
        });

        const nameVal = nameInput ? nameInput.value.trim() : '';
        const emailVal = emailInput ? emailInput.value.trim() : '';
        const subjectVal = subjectInput ? subjectInput.value.trim() : '';
        const messageVal = messageInput ? messageInput.value.trim() : '';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nameVal) {
            showFieldError(nameInput, 'Please enter your full name');
            isValid = false;
        }

        if (!emailVal) {
            showFieldError(emailInput, 'Please enter your email address');
            isValid = false;
        } else if (!emailRegex.test(emailVal)) {
            showFieldError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        if (!subjectVal) {
            showFieldError(subjectInput, 'Please enter a subject line');
            isValid = false;
        }

        if (!messageVal) {
            showFieldError(messageInput, 'Please enter your message');
            isValid = false;
        } else if (messageVal.length < 10) {
            showFieldError(messageInput, 'Message should be at least 10 characters long');
            isValid = false;
        }

        if (!isValid) return;

        const serviceId = emailConfig.serviceId || 'YOUR_SERVICE_ID';
        const templateId = emailConfig.templateId || 'YOUR_TEMPLATE_ID';
        const publicKey = emailConfig.publicKey || 'YOUR_PUBLIC_KEY';

        if (serviceId === 'YOUR_SERVICE_ID' || templateId === 'YOUR_TEMPLATE_ID' || publicKey === 'YOUR_PUBLIC_KEY') {
            showFormStatus('error', 'EmailJS is not configured yet. Add your Service ID, Template ID, and Public Key in config.js.');
            return;
        }

        if (!window.emailjs) {
            showFormStatus('error', 'EmailJS failed to load. Please refresh the page and try again.');
            return;
        }

        setSubmitting(true);

        try {
            emailjs.init({ publicKey: publicKey });
            await emailjs.sendForm(serviceId, templateId, contactForm);

            showFormStatus('success', 'Message sent successfully!');
            contactForm.reset();
        } catch (error) {
            console.error('EmailJS send error:', error);
            showFormStatus('error', 'Something went wrong while sending the message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    });

    [nameInput, emailInput, subjectInput, messageInput].forEach(field => {
        if (field) {
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    field.classList.remove('error');
                    const errSpan = field.parentElement.querySelector('.error-msg');
                    if (errSpan) errSpan.textContent = '';
                }
                clearFormStatus();
            });
        }
    });
}

/* ==========================================================================
   14. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   15. DYNAMIC YEAR
   ========================================================================== */
function setYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/* ==========================================================================
   16. IMAGE ERROR FALLBACK HANDLER
   ========================================================================== */
function imageErrorFallback() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        img.addEventListener('error', function() {
            // If the image is inside an avatar or card with fallback
            const parent = this.parentElement;
            if (parent) {
                parent.classList.add('img-fallback-active');
            }
            this.style.display = 'none';

            // Show any existing sibling fallback element
            const siblingFallback = parent ? parent.querySelector('.img-fallback') : null;
            if (siblingFallback) {
                siblingFallback.style.display = 'flex';
            }
        });
    });
}
