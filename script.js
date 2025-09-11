/**
 * =================================================================================
 * Main JavaScript file (Corrected Version)
 *
 * FIX: The `applyTranslations` function has been corrected to properly handle
 * attribute translations like placeholders.
 * =================================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // PARTICLE EFFECT
    function createParticles() {
        const heroSection = document.querySelector('.hero-section');

        if (!heroSection) {
            console.error("Particle Effect Error: '.hero-section' element not found in the HTML.");
            return;
        }
        if (getComputedStyle(heroSection).position === 'static') {
            heroSection.style.position = 'relative';
        }

        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;

        const particleAnimationStyle = document.createElement('style');
        particleAnimationStyle.textContent = `
        @keyframes float {
            0% { transform: translateY(0px); opacity: 0.7; }
            50% { opacity: 1; }
            100% { transform: translateY(-25px); opacity: 0; }
        }
    `;
        document.head.appendChild(particleAnimationStyle);
        const isMobile = window.innerWidth < 768;

        let particleSizeFormula;
        let particleCount;

        if (isMobile) {

            console.log("Device is Mobile: Creating smaller particles.");
            particleSizeFormula = '1 + Math.random() * 1.5';
            particleCount = 500;
        } else {

            console.log("Device is Desktop: Creating larger particles.");
            particleSizeFormula = '1 + Math.random() * 3';
            particleCount = 700;
        }

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const size = eval(particleSizeFormula);

            particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: float ${4 + Math.random() * 6}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
            particlesContainer.appendChild(particle);
        }
        heroSection.appendChild(particlesContainer);
    }


    function applyTranslations(translations) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key.startsWith('[') && key.includes(']')) {
                const match = key.match(/\[(.*?)\](.*)/);
                if (match) {
                    const attr = match[1];
                    const translationKey = match[2];
                    const translation = translations[translationKey];

                    if (translation) {
                        element.setAttribute(attr, translation);
                    }
                }
            } else {
                const translation = translations[key];
                if (translation) {
                    element.innerHTML = translation;
                }
            }
        });
    }

    const langSwitchContainer = document.createElement('div');
    langSwitchContainer.className = 'd-flex align-items-center ms-auto';
    langSwitchContainer.innerHTML = `
    <button class="btn btn-light btn-sm me-2 lang-btn" data-lang="ar">AR</button>
    <button class="btn btn-light btn-sm me-2 lang-btn" data-lang="en">EN</button>
    <button class="btn btn-light btn-sm me-2 lang-btn" data-lang="de">DE</button>
    <button id="theme-toggle" class="btn btn-light btn-sm me-2"><i class="p-1 fas fa-moon"></i></button>
    `;
    const navbarNav = document.getElementById('navbarNav');
    if (navbarNav) {
        navbarNav.appendChild(langSwitchContainer);
    } else {
        console.error("Language Switcher Error: '#navbarNav' element not found.");
    }

    langSwitchContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('lang-btn')) {
            const lang = event.target.getAttribute('data-lang');
            setLanguage(lang);
        }
    });

    async function fetchTranslations(lang) {
        const response = await fetch(`translation/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Cannot fetch translation file: translation/${lang}.json`);
        }
        return await response.json();
    }

    async function setLanguage(lang) {
        try {
            const translations = await fetchTranslations(lang);
            applyTranslations(translations);
            document.documentElement.lang = lang;
            document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
            localStorage.setItem('preferredLanguage', lang);
            updateActiveButton(lang);
            initializeTypingEffect(translations);
        } catch (error) {
            console.error('Failed to set language:', error);
        }
    }

    function updateActiveButton(activeLang) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === activeLang);
        });
    }

    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    function initializeTypingEffect(translations) {
        const heroGreetingSpan = document.querySelector('[data-i18n="hero.greeting"]');
        if (heroGreetingSpan && translations['hero.greeting']) {
            typeWriter(heroGreetingSpan, translations['hero.greeting']);
        }
    }

    const animationStyle = document.createElement('style');
    animationStyle.textContent = `.animate-on-scroll { opacity: 0; transform: translateY(20px); transition: opacity 0.8s ease, transform 0.8s ease; }`;
    document.head.appendChild(animationStyle);

    const animateOnScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                animateOnScrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skill-card, .project-card, .contact-info, .about-content, .about-image').forEach(el => {
        el.classList.add('animate-on-scroll');
        animateOnScrollObserver.observe(el);
    });

    const scrolledNavStyle = document.createElement('style');
    scrolledNavStyle.textContent = `.navbar.scrolled { background-color: rgba(33, 37, 41, 0.9) !important; backdrop-filter: blur(10px); }`;
    document.head.appendChild(scrolledNavStyle);

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }

    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    function initialize() {
        createParticles();
        const initialLang = localStorage.getItem('preferredLanguage') || 'en';
        setLanguage(initialLang);
    }

    initialize();
});

document.addEventListener('DOMContentLoaded', () => {

    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleIcon = themeToggle.querySelector('i');

    const currentTheme = localStorage.getItem('theme') || 'light';

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);

        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
            themeToggleIcon.classList.remove('fa-moon');
            themeToggleIcon.classList.add('fa-sun');
        } else {
            themeToggleIcon.classList.remove('fa-sun');
            themeToggleIcon.classList.add('fa-moon');
        }
    };

    applyTheme(currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
});
