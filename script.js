document.addEventListener('DOMContentLoaded', () => {

    const langSwitchContainer = document.createElement('div');
    langSwitchContainer.classList.add('d-flex', 'align-items-center', 'ms-auto');
    langSwitchContainer.innerHTML = `
        <button class="btn btn-outline-light btn-sm me-2 lang-btn" data-lang="en">EN</button>
        <button class="btn btn-outline-light btn-sm me-2 lang-btn" data-lang="de">DE</button>
        <button class="btn btn-outline-light btn-sm lang-btn" data-lang="ar">AR</button>
    `;
    document.getElementById('navbarNav').appendChild(langSwitchContainer);

    langSwitchContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('lang-btn')) {
            const lang = event.target.getAttribute('data-lang');
            setLanguage(lang);
        }
    });

    async function fetchTranslations(lang) {
        const response = await fetch(`translation/${lang}.json`);
        if (!response.ok) throw new Error(`Cannot fetch translation: ${lang}`);
        return await response.json();
    }

    function applyTranslations(translations) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key.startsWith('[') && key.includes(']')) {
                const match = key.match(/\[(.*?)\](.*)/);
                const attr = match[1];
                const translationKey = match[2];
                if (translations[translationKey]) {
                    element.setAttribute(attr, translations[translationKey]);
                }
            } else {
                if (translations[key]) {
                    element.innerHTML = translations[key];
                }
            }
        });
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

    function typeWriter(element, text, speed = 50) {
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
    animationStyle.textContent = `
        .animate-on-scroll { opacity: 0; transform: translateY(20px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .force-ltr { direction: ltr !important; text-align: left !important; }
    `;
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

    window.addEventListener('scroll', () => {
        document.querySelector('.navbar').classList.toggle('scrolled', window.scrollY > 50);
    });

    const scrolledNavStyle = document.createElement('style');
    scrolledNavStyle.textContent = `.navbar.scrolled { background-color: rgba(33, 37, 41, 0.9) !important; backdrop-filter: blur(10px); }`;
    document.head.appendChild(scrolledNavStyle);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.elements['name'].value;
            const email = this.elements['email'].value;
            const subject = this.elements['subject'].value;
            const message = this.elements['message'].value;

            if (!name || !email || !subject || !message) {
                alert('Please fill out all fields');
                return;
            }

            const button = this.querySelector('button[type="submit"]');
            const originalButtonHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending...';
            button.disabled = true;

            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check me-2"></i> Sent!';
                button.classList.replace('btn-primary', 'btn-success');
                this.reset();
                setTimeout(() => {
                    button.innerHTML = originalButtonHTML;
                    button.classList.replace('btn-success', 'btn-primary');
                    button.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const initialLang = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(initialLang);

});
