// ===== Main JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    
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
            
            if (value.length > 0) {
                if (value[0] === '8') {
                    value = '7' + value.slice(1);
                }
                if (value[0] !== '7') {
                    value = '7' + value;
                }
            }
            
            let formatted = '';
            if (value.length > 0) {
                formatted = '+7';
            }
            if (value.length > 1) {
                formatted += ' (' + value.slice(1, 4);
            }
            if (value.length > 4) {
                formatted += ') ' + value.slice(4, 7);
            }
            if (value.length > 7) {
                formatted += '-' + value.slice(7, 9);
            }
            if (value.length > 9) {
                formatted += '-' + value.slice(9, 11);
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
    backToTopBtn.setAttribute('aria-label', 'Наверх');
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
    console.log('%c🚚 ЛогистикПро', 'font-size: 24px; font-weight: bold; color: #2563eb;');
    console.log('%cНадёжные грузоперевозки по всей России', 'font-size: 14px; color: #64748b;');
});
