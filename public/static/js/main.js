// ===== Main JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    // ===== Language Toggle =====
    const languageToggle = document.querySelector('[data-lang-toggle]');
    const supportedLanguages = ['ru', 'en'];
    const languageStorageKey = 'site-language';
    const uiTranslations = {
        ru: {
            backToTop: 'Наверх',
            brandTitle: '🚚 ЛогистикПро',
            brandSubtitle: 'Надёжные грузоперевозки по всей России'
        },
        en: {
            backToTop: 'Back to top',
            brandTitle: '🚚 LogistikPro',
            brandSubtitle: 'Reliable freight transport across Russia'
        }
    };

    function getStoredLanguage() {
        const stored = localStorage.getItem(languageStorageKey);
        return supportedLanguages.includes(stored) ? stored : 'ru';
    }

    function applyTranslations(language) {
        const languageCode = supportedLanguages.includes(language) ? language : 'ru';
        document.documentElement.lang = languageCode;

        const textElements = document.querySelectorAll('[data-i18n]');
        textElements.forEach((element) => {
            if (!element.dataset.i18nRu) {
                element.dataset.i18nRu = element.textContent;
            }
            const nextText = languageCode === 'en' ? element.dataset.i18nEn : element.dataset.i18nRu;
            if (nextText !== undefined) {
                element.textContent = nextText;
            }
        });

        const htmlElements = document.querySelectorAll('[data-i18n-html]');
        htmlElements.forEach((element) => {
            if (!element.dataset.i18nHtmlRu) {
                element.dataset.i18nHtmlRu = element.innerHTML;
            }
            const nextHtml = languageCode === 'en' ? element.dataset.i18nHtmlEn : element.dataset.i18nHtmlRu;
            if (nextHtml !== undefined) {
                element.innerHTML = nextHtml;
            }
        });

        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach((element) => {
            if (!element.dataset.i18nPlaceholderRu) {
                element.dataset.i18nPlaceholderRu = element.getAttribute('placeholder') || '';
            }
            const nextPlaceholder = languageCode === 'en'
                ? element.dataset.i18nPlaceholderEn
                : element.dataset.i18nPlaceholderRu;
            if (nextPlaceholder !== undefined) {
                element.setAttribute('placeholder', nextPlaceholder);
            }
        });

        const valueElements = document.querySelectorAll('[data-i18n-value]');
        valueElements.forEach((element) => {
            if (!element.dataset.i18nValueRu) {
                element.dataset.i18nValueRu = element.getAttribute('value') || '';
            }
            const nextValue = languageCode === 'en'
                ? element.dataset.i18nValueEn
                : element.dataset.i18nValueRu;
            if (nextValue !== undefined) {
                element.setAttribute('value', nextValue);
            }
        });

        const ariaElements = document.querySelectorAll('[data-i18n-aria-label]');
        ariaElements.forEach((element) => {
            if (!element.dataset.i18nAriaLabelRu) {
                element.dataset.i18nAriaLabelRu = element.getAttribute('aria-label') || '';
            }
            const nextLabel = languageCode === 'en'
                ? element.dataset.i18nAriaLabelEn
                : element.dataset.i18nAriaLabelRu;
            if (nextLabel !== undefined) {
                element.setAttribute('aria-label', nextLabel);
            }
        });

        const altElements = document.querySelectorAll('[data-i18n-alt]');
        altElements.forEach((element) => {
            if (!element.dataset.i18nAltRu) {
                element.dataset.i18nAltRu = element.getAttribute('alt') || '';
            }
            const nextAlt = languageCode === 'en' ? element.dataset.i18nAltEn : element.dataset.i18nAltRu;
            if (nextAlt !== undefined) {
                element.setAttribute('alt', nextAlt);
            }
        });

        const contentElements = document.querySelectorAll('[data-i18n-content]');
        contentElements.forEach((element) => {
            if (!element.dataset.i18nContentRu) {
                element.dataset.i18nContentRu = element.getAttribute('content') || '';
            }
            const nextContent = languageCode === 'en'
                ? element.dataset.i18nContentEn
                : element.dataset.i18nContentRu;
            if (nextContent !== undefined) {
                element.setAttribute('content', nextContent);
            }
        });

        const titleElement = document.querySelector('title[data-i18n]');
        if (titleElement) {
            if (!titleElement.dataset.i18nRu) {
                titleElement.dataset.i18nRu = titleElement.textContent;
            }
            const nextTitle = languageCode === 'en' ? titleElement.dataset.i18nEn : titleElement.dataset.i18nRu;
            if (nextTitle !== undefined) {
                titleElement.textContent = nextTitle;
            }
        }

        const backToTopElement = document.querySelector('.back-to-top');
        if (backToTopElement) {
            backToTopElement.setAttribute('aria-label', window.siteI18n.t('backToTop'));
        }

        if (languageToggle) {
            languageToggle.textContent = languageCode === 'en' ? 'RU' : 'EN';
        }

        if (window.siteI18n) {
            window.siteI18n.language = languageCode;
        }
    }

    window.siteI18n = {
        language: getStoredLanguage(),
        setLanguage: (language) => {
            const nextLanguage = supportedLanguages.includes(language) ? language : 'ru';
            localStorage.setItem(languageStorageKey, nextLanguage);
            applyTranslations(nextLanguage);
        },
        getLanguage: () => document.documentElement.lang || getStoredLanguage(),
        translations: uiTranslations,
        t: (key) => {
            const lang = document.documentElement.lang || getStoredLanguage();
            return uiTranslations[lang]?.[key] || uiTranslations.ru[key] || key;
        }
    };

    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            const nextLanguage = window.siteI18n.getLanguage() === 'ru' ? 'en' : 'ru';
            window.siteI18n.setLanguage(nextLanguage);
        });
    }

    applyTranslations(window.siteI18n.getLanguage());
    
    // ===== Mobile Menu =====
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const body = document.body;
    
    function toggleMenu() {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    }
    
    function closeMenu() {
        burger.classList.remove('active');
        nav.classList.remove('active');
        mobileOverlay.classList.remove('active');
        body.style.overflow = '';
    }
    
    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMenu);
    }
    
    // Close menu on nav link click (mobile)
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });
    
    // ===== Mobile Dropdown =====
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // ===== Header Scroll Effect =====
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // ===== Smooth Scroll for Anchor Links =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMenu();
            }
        });
    });
    
    // ===== Phone Input Mask (if exists) =====
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            let formatted = '';
            if (value.length > 0) {
                formatted = '0';
            }
            if (value.length > 1) {
                formatted += ' (' + value.slice(1, 4);
            }
            if (value.length > 4) {
                formatted += ') ' + value.slice(4, 6);
            }
            if (value.length > 6) {
                formatted += '-' + value.slice(6, 8);
            }
            if (value.length > 8) {
                formatted += '-' + value.slice(8, 10);
            }
            
            e.target.value = formatted;
        });
    });
    
    // ===== Form Validation Feedback =====
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateInput(this);
                }
            });
        });
    });
    
    function validateInput(input) {
        const value = input.value.trim();
        const isRequired = input.hasAttribute('required');
        
        // Remove existing error state
        input.classList.remove('error');
        
        if (isRequired && !value) {
            input.classList.add('error');
            return false;
        }
        
        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                input.classList.add('error');
                return false;
            }
        }
        
        return true;
    }
    
    // ===== Animation on Scroll =====
    const animatedElements = document.querySelectorAll('.service-card, .advantage-item, .step-item, .stat-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
    
    // Add animated class styles
    const style = document.createElement('style');
    style.textContent = `
        .animated {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // ===== Back to Top Button (optional) =====
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', window.siteI18n.t('backToTop'));
    document.body.appendChild(backToTopBtn);
    
    // Add styles for back to top button
    const backToTopStyle = document.createElement('style');
    backToTopStyle.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        .back-to-top:hover {
            background: var(--primary-dark);
            transform: translateY(-3px);
        }
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        @media (max-width: 768px) {
            .back-to-top {
                bottom: 20px;
                right: 20px;
                width: 44px;
                height: 44px;
            }
        }
    `;
    document.head.appendChild(backToTopStyle);
    
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===== Lazy Loading Images =====
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // ===== Counter Animation =====
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = counter.textContent.replace(/\D/g, '');
                const suffix = counter.textContent.replace(/[\d]/g, '');
                
                if (target) {
                    animateCounter(counter, parseInt(target), suffix);
                }
                
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
    
    function animateCounter(element, target, suffix) {
        let current = 0;
        const increment = target / 50;
        const duration = 1500;
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, stepTime);
    }
    
    // ===== Console Log =====
    console.log(`%c${window.siteI18n.t('brandTitle')}`, 'font-size: 24px; font-weight: bold; color: #2563eb;');
    console.log(`%c${window.siteI18n.t('brandSubtitle')}`, 'font-size: 14px; color: #64748b;');
});
