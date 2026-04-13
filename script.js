document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const nav = document.querySelector('nav');

    // Dark Mode with Cookies
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };
    
    const setCookie = (name, value, days) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = `; expires=${date.toUTCString()}`;
        }
        document.cookie = `${name}=${value || ""}${expires}; path=/`;
    };

    const moonSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    const sunSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

    if (getCookie('theme') === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggle) themeToggle.innerHTML = sunSvg;
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            themeToggle.innerHTML = isDark ? sunSvg : moonSvg;
            setCookie('theme', isDark ? 'dark' : 'light', 365);
        });
    }

    // Navigation Toggle Logic
    const toggleMobileMenu = () => {
        const isOpen = mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    const closeMobileMenu = () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // Project Data for Lightbox
    const projectGalleries = {
        felipe: Array.from({ length: 7 }, (_, i) => `./img/Projetos/Felipe_araujo/Felipe Araujo_${i + 1}.png`),
        ana: Array.from({ length: 10 }, (_, i) => `./img/Projetos/Ana_moreno/Ana Moreno Design_${i + 1}.png`),
        almendra: Array.from({ length: 3 }, (_, i) => `./img/Projetos/Almendra_designn/almendra_designn_${i + 1}.png`)
    };

    let currentGallery = [];
    let currentIndex = 0;

    const lightbox = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    // Open Lightbox
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const type = card.getAttribute('data-project');
            if (type && projectGalleries[type]) {
                currentGallery = projectGalleries[type];
                currentIndex = 0;
                updateLightboxImage();
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function updateLightboxImage() {
        if (!lightboxImg) return;
        
        lightboxImg.style.opacity = '0';
        // Show loader if you have one
        const loader = document.querySelector('.lightbox-loader');
        if (loader) loader.style.display = 'block';

        const tempImg = new Image();
        tempImg.src = currentGallery[currentIndex];
        tempImg.onload = () => {
            lightboxImg.src = tempImg.src;
            lightboxCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
            lightboxImg.style.opacity = '1';
            if (loader) loader.style.display = 'none';
        };
        tempImg.onerror = () => {
            console.error("Erro ao carregar imagem:", tempImg.src);
            if (loader) loader.style.display = 'none';
        }
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % currentGallery.length;
            updateLightboxImage();
        });
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            updateLightboxImage();
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') lightboxClose.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
    });

    // Scroll effect for Nav
    window.addEventListener('scroll', () => {
        if (nav) {
            if (window.scrollY > 50) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Reveal
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-left').forEach(el => revealObserver.observe(el));

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

