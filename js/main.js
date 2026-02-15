/* ===== MAIN JAVASCRIPT - CODEMETRIA ===== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Loader ----
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.classList.remove('no-scroll');
            }, 400);
        });
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }, 1500);
    }

    // ---- Header Scroll Effect with hide/show on direction ----
    const header = document.getElementById('header');
    let ticking = false;

    globalThis.addEventListener('scroll', () => {
        if (!ticking) {
            globalThis.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;

                if (currentScroll > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                ticking = false;
            });
            ticking = true;
        }
    });

    // ---- Mobile Navigation ----
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        });

        navLinks.addEventListener('click', (e) => {
            if (e.target === navLinks) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // ---- Active Nav Link ----
    const currentPage = globalThis.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ---- Enhanced Scroll Animations with Stagger ----
    const animateElements = document.querySelectorAll('[data-animate]');
    const staggerElements = document.querySelectorAll('[data-stagger]');

    const observerOptions = {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));
    staggerElements.forEach(el => observer.observe(el));

    // ---- Counter Animation (improved with easing) ----
    const counters = document.querySelectorAll('.stat-number[data-target]');

    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = Number.parseInt(counter.dataset.target);
                const duration = 2200;
                const startTime = performance.now();

                const updateCounter = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easedProgress = easeOutQuart(progress);
                    const current = Math.round(easedProgress * target);

                    counter.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ---- Typing Effect for Hero ----
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const words = JSON.parse(typingElement.dataset.words || '[]');
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 80;

        function typeEffect() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 40;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 80;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 300;
            }

            setTimeout(typeEffect, typingSpeed);
        }

        setTimeout(typeEffect, 1000);
    }

    // ---- Parallax on Mouse Move (Hero) ----
    const hero = document.querySelector('.hero');
    if (hero) {
        const orbs = hero.querySelectorAll('.hero-orb');

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 15;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }

    // ---- Magnetic Buttons ----
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-3px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ---- Project Filter Tabs ----
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-filterable');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter;

            projectCards.forEach((card, index) => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = '';
                    card.style.animation = `fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s forwards`;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ---- Contact Form ----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const btn = contactForm.querySelector('.btn-submit');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            btn.disabled = true;
        });
    }

    // ---- Smooth Scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ---- Tilt Card Effect for Service Cards ----
    document.querySelectorAll('.service-card, .value-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltX = (y - 0.5) * 6;
            const tiltY = (x - 0.5) * -6;

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ---- Progressive Image Loading ----
    document.querySelectorAll('img[data-src]').forEach(img => {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    delete image.dataset.src;
                    image.style.opacity = '0';
                    image.addEventListener('load', () => {
                        image.style.transition = 'opacity 0.5s ease';
                        image.style.opacity = '1';
                    }, { once: true });
                    imageObserver.unobserve(image);
                }
            });
        });
        imageObserver.observe(img);
    });

});
