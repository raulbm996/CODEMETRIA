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
        let words = JSON.parse(typingElement.dataset.words || '[]');
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 80;

        function getActiveWords() {
            const active = typingElement.dataset.activeWords;
            if (active) {
                return JSON.parse(active);
            }
            return JSON.parse(typingElement.dataset.words || '[]');
        }

        function typeEffect() {
            const currentWords = getActiveWords();
            if (currentWords.length === 0) { setTimeout(typeEffect, 500); return; }
            if (wordIndex >= currentWords.length) wordIndex = 0;
            const currentWord = currentWords[wordIndex];

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
                wordIndex = (wordIndex + 1) % currentWords.length;
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

    // ---- Language Toggle (ES / EN) ----
    const translations = {
        en: {
            // Nav
            nav_inicio: 'Home',
            nav_servicios: 'Services',
            nav_proyectos: 'Projects',
            nav_nosotros: 'About Us',
            nav_contacto: 'Contact',
            nav_cta: '<i class="fas fa-paper-plane"></i> Start Project',
            // Hero
            hero_badge: '<i class="fas fa-rocket"></i> Web Design Agency',
            hero_title: 'We design experiences',
            hero_desc: 'We transform your vision into modern, functional and optimized websites that take your business to the next level.',
            hero_btn1: '<i class="fas fa-paper-plane"></i> Request a Quote',
            hero_btn2: '<i class="fas fa-eye"></i> View Projects',
            stat1: 'Completed Projects',
            stat2: 'Happy Clients',
            stat3: 'Years of Experience',
            tech_label: 'Technologies we master',
            // Services
            srv_tag: 'Our Services',
            srv_title: 'Custom digital <span class="gradient-text">solutions</span>',
            srv_desc: 'We offer a comprehensive web design and development service tailored to each client\'s needs.',
            srv1_title: 'Web Design',
            srv1_desc: 'Modern and attractive interfaces that reflect your brand identity and captivate your users.',
            srv2_title: 'Web Development',
            srv2_desc: 'Clean and optimized code with the latest technologies for exceptional performance.',
            srv3_title: 'Responsive Design',
            srv3_desc: 'Your website will look perfect on any device: mobile, tablet or desktop.',
            srv4_title: 'E-Commerce',
            srv4_desc: 'Complete and secure online stores that maximize your sales and simplify management.',
            srv5_title: 'Maintenance',
            srv5_desc: 'Ongoing support and updates to keep your website always up to date and running.',
            srv6_title: 'SEO & Positioning',
            srv6_desc: 'Search engine optimization that improves your visibility and attracts qualified traffic to your site.',
            srv_link: 'Learn more',
            srv_all_btn: 'View all services <i class="fas fa-arrow-right"></i>',
            // Projects
            proj_tag: 'Portfolio',
            proj_title: 'Featured <span class="gradient-text">projects</span>',
            proj_desc: 'A selection of our most recent and successful works.',
            proj1_desc: 'Our own corporate website, designed to convey professionalism and modernity in every detail.',
            proj2_desc: 'Corporate website for a pallet company with over 30 years of experience in the industry.',
            proj_link: 'View project',
            proj_all_btn: 'View all projects <i class="fas fa-arrow-right"></i>',
            // Process
            proc_tag: 'How We Work',
            proc_title: 'A <span class="gradient-text">clear and efficient</span> process',
            proc_desc: 'From the initial idea to launch, we accompany you every step of the way.',
            step1_title: 'Discovery',
            step1_desc: 'We analyze your needs, objectives and target audience to define the perfect strategy.',
            step2_title: 'Design',
            step2_desc: 'We create wireframes and visual designs that reflect your brand and optimize user experience.',
            step3_title: 'Development',
            step3_desc: 'We transform the design into clean, optimized and responsive code with the best technologies.',
            step4_title: 'Launch',
            step4_desc: 'We publish your website, perform final tests and provide ongoing support.',
            // CTA
            cta_title: 'Ready to take your business to the <span class="gradient-text">next level</span>?',
            cta_desc: 'Tell us about your project and we\'ll make you a personalized proposal with no commitment.',
            cta_btn1: '<i class="fas fa-paper-plane"></i> Contact Now',
            cta_btn2: '<i class="fas fa-phone"></i> Call Us',
            // Footer
            footer_desc: 'Professional web design and development agency. We transform ideas into exceptional digital experiences.',
            footer_nav: 'Navigation',
            footer_srv: 'Services',
            footer_contact: 'Contact',
            footer_copy: '&copy; 2026 CODEMETRIA. All rights reserved.',
            footer_location: 'Seville, Spain',
            // --- Servicios Page ---
            srvp_title: 'Our <span class="gradient-text">Services</span>',
            srvp_subtitle: 'Comprehensive web design and development solutions to take your business to the digital world.',
            srvd1_title: '<i class="fas fa-palette" style="color: var(--primary-light); margin-right: 10px;"></i>Professional Web Design',
            srvd1_desc: 'We create unique and attractive designs that reflect your brand essence. Every pixel is crafted to deliver the best user experience and convey trust and professionalism.',
            srvd1_f1: 'Custom UI/UX design',
            srvd1_f2: 'Interactive Figma prototypes',
            srvd1_f3: 'Custom color palette and typography',
            srvd1_f4: 'Conversion-focused design',
            srvd1_f5: 'Unlimited revisions',
            srvd2_title: '<i class="fas fa-code" style="color: var(--primary-light); margin-right: 10px;"></i>Custom Web Development',
            srvd2_desc: 'We transform designs into functional websites using the most modern technologies. Clean, fast and scalable code that ensures exceptional performance.',
            srvd2_f1: 'HTML5, CSS3, Modern JavaScript',
            srvd2_f2: 'Frameworks: React, Next.js, Vue',
            srvd2_f3: 'CMS integration (WordPress, etc.)',
            srvd2_f4: 'Custom APIs and backend',
            srvd2_f5: 'Optimized and documented code',
            srvd3_title: '<i class="fas fa-mobile-alt" style="color: var(--primary-light); margin-right: 10px;"></i>Responsive Design',
            srvd3_desc: 'Your website will adapt perfectly to any device. Over 60% of web traffic is mobile, so we ensure a flawless experience across all screen sizes.',
            srvd3_f1: 'Mobile-first approach',
            srvd3_f2: 'Multi-device testing',
            srvd3_f3: 'Touch optimization',
            srvd3_f4: 'Adaptive images',
            srvd3_f5: 'Performance on slow connections',
            srvd4_title: '<i class="fas fa-shopping-cart" style="color: var(--primary-light); margin-right: 10px;"></i>Online Stores / E-Commerce',
            srvd4_desc: 'We develop complete and secure online stores that maximize your sales. From catalog to checkout, every step is optimized to convert visitors into customers.',
            srvd4_f1: 'WooCommerce / Shopify / Custom',
            srvd4_f2: 'Secure payment gateways',
            srvd4_f3: 'Inventory management',
            srvd4_f4: 'Intuitive admin panel',
            srvd4_f5: 'Integrated marketing and analytics',
            srvd5_title: '<i class="fas fa-tools" style="color: var(--primary-light); margin-right: 10px;"></i>Maintenance & Support',
            srvd5_desc: 'Your website needs ongoing attention. We offer maintenance plans to keep it always updated, secure, and running at full performance.',
            srvd5_f1: 'Security updates',
            srvd5_f2: 'Automatic backups',
            srvd5_f3: '24/7 monitoring',
            srvd5_f4: 'Priority technical support',
            srvd5_f5: 'Monthly performance reports',
            srvp_cta_title: 'Can\'t find what you\'re looking for?',
            srvp_cta_desc: 'Tell us about your project and we\'ll create a fully customized solution for you.',
            srvp_cta_btn: '<i class="fas fa-paper-plane"></i> Contact Now',
            // --- Proyectos Page ---
            projp_title: 'Our <span class="gradient-text">Projects</span>',
            projp_subtitle: 'Explore our selection of works and discover how we transform ideas into digital experiences.',
            projp_1_desc: 'Our own corporate website. Designed to convey professionalism, modernity and trust as a web design and development agency.',
            projp_2_desc: 'Corporate website for a Sevillian company dedicated to buying and selling used pallets, manufacturing new pallets and comprehensive repair service. With over three decades of experience.',
            projp_cta_title: 'Would you like to see your project <span class="gradient-text">here?</span>',
            projp_cta_desc: 'Let\'s talk about how we can transform your idea into an exceptional digital experience.',
            projp_cta_btn: '<i class="fas fa-paper-plane"></i> Start My Project',
            // --- Nosotros Page ---
            aboutp_title: 'Meet <span class="gradient-text">CODEMETRIA</span>',
            aboutp_subtitle: 'We are a team passionate about design and technology, committed to transforming your digital vision into reality.',
            about_story_tag: 'Our Story',
            about_story_title: 'From a passion for code to <span class="gradient-text">creating experiences</span>',
            about_story_p1: 'CODEMETRIA was born from the conviction that every business deserves a digital presence that truly makes an impact. Founded with the vision of combining exceptional design with top-level technical development.',
            about_story_p2: 'Since our beginnings, we have worked with companies of all sizes — from startups taking their first steps to established brands looking to reinvent themselves digitally.',
            about_story_p3: 'Our approach goes beyond creating beautiful websites: we design business tools that generate measurable results and contribute to our clients\' growth.',
            about_values_tag: 'Values',
            about_values_title: 'What <span class="gradient-text">defines us</span>',
            about_values_desc: 'These are the principles that guide every project and every decision at CODEMETRIA.',
            val1_title: 'Uncompromising Quality',
            val1_desc: 'Every line of code and every pixel is carefully crafted. We don\'t deliver anything we\'re not proud of.',
            val2_title: 'Full Transparency',
            val2_desc: 'Clear and honest communication at every stage of the project. No surprises, no fine print.',
            val3_title: 'Constant Innovation',
            val3_desc: 'Always up to date with the latest trends and technologies to offer cutting-edge solutions.',
            val4_title: 'Client at the Center',
            val4_desc: 'Your success is our success. We listen, understand and work to exceed your expectations.',
            val5_title: 'Measurable Results',
            val5_desc: 'We don\'t just create websites, we build business tools that produce tangible results.',
            val6_title: 'Passion for Design',
            val6_desc: 'We love what we do and it shows in every project we deliver.',
            about_tech_tag: 'Technology',
            about_tech_title: 'Tools we <span class="gradient-text">use</span>',
            about_tech_desc: 'We work with the most modern and reliable technologies on the market.',
            about_results_tag: 'Results',
            about_results_title: 'Our <span class="gradient-text">numbers speak</span>',
            about_stat1: 'Projects Delivered',
            about_stat2: 'Happy Clients',
            about_stat3: 'Years of Experience',
            about_stat4: 'Satisfaction Rate',
            aboutp_cta_title: 'Want to work <span class="gradient-text">with us?</span>',
            aboutp_cta_desc: 'We\'re ready to hear your idea and turn it into a successful digital project.',
            aboutp_cta_btn: '<i class="fas fa-paper-plane"></i> Contact',
            // --- Contacto Page ---
            contactp_title: 'Let\'s talk about your <span class="gradient-text">Project</span>',
            contactp_subtitle: 'Tell us your idea and we\'ll respond within 24 hours with a personalized proposal.',
            contact_info_title: 'Contact Information',
            contact_email: 'Email',
            contact_phone: 'Phone',
            contact_location: 'Location',
            contact_hours: 'Hours',
            contact_hours_val: 'Maximum availability for the client',
            contact_follow: 'Follow Us',
            contact_form_title: 'Request a Quote',
            contact_form_desc: 'Fill out the form and we\'ll contact you as soon as possible.',
            form_name: 'Name *',
            form_email: 'Email *',
            form_phone: 'Phone',
            form_service: 'Service',
            form_message: 'Tell us about your project *',
            form_submit: 'Send Message',
            form_name_ph: 'Your name',
            form_email_ph: 'you@email.com',
            form_phone_ph: '+34 671 851 592',
            form_message_ph: 'Describe your project, goals and needs...',
            fopt_default: 'Select a service',
            fopt_diseno: 'Web Design',
            fopt_desarrollo: 'Web Development',
            fopt_responsive: 'Responsive Design',
            fopt_ecommerce: 'E-Commerce',
            fopt_mantenimiento: 'Maintenance',
            fopt_seo: 'SEO & Positioning',
            fopt_otro: 'Other',
            faq_tag: 'FAQ',
            faq_title: 'Frequently Asked <span class="gradient-text">Questions</span>',
            faq1_q: 'How much does a website cost?',
            faq1_a: 'We offer very competitive prices tailored to each project. Our goal is for you to have a professional website without it being a great financial burden. Request a no-obligation quote and you\'ll be surprised.',
            faq2_q: 'How long does it take for my website to be ready?',
            faq2_a: 'We work with very agile delivery times. Most projects are delivered in a few days, and the most complex ones in a few weeks. We commit to having your website ready as soon as possible.',
            faq3_q: 'Do you include hosting and domain?',
            faq3_a: 'Yes, all our plans include the first year of hosting and domain. Afterwards, we assist you with renewal under the best conditions.',
            faq4_q: 'Can I modify the website later?',
            faq4_a: 'Of course. All our websites include a CMS or admin panel so you can manage your content independently. We also offer maintenance plans.',
            faq5_q: 'Do you offer technical support?',
            faq5_a: 'Yes. All projects include a free support period (varies by plan). Afterwards, you can hire our monthly maintenance service.',
            // --- Footer Legal ---
            footer_privacy: 'Privacy Policy',
            footer_terms: 'Terms of Service',
            // --- Privacy Policy Page ---
            privacy_breadcrumb: 'Privacy Policy',
            privacy_title: '<span class="gradient-text">Privacy</span> Policy',
            privacy_subtitle: 'Last updated: February 15, 2026',
            privacy_s1_title: '1. Data Controller',
            privacy_s1_p1: 'The data controller for personal data collected through this website is <strong>CODEMETRIA</strong>, based in Seville, Spain.',
            privacy_s1_p2: 'Contact email: <a href="mailto:info.codemetria@gmail.com">info.codemetria@gmail.com</a>',
            privacy_s2_title: '2. Data We Collect',
            privacy_s2_p1: 'We collect personal data that you voluntarily provide through our contact form:',
            privacy_s2_l1: 'Full name',
            privacy_s2_l2: 'Email address',
            privacy_s2_l3: 'Phone number (optional)',
            privacy_s2_l4: 'Service type of interest',
            privacy_s2_l5: 'Project description',
            privacy_s3_title: '3. Purpose of Processing',
            privacy_s3_p1: 'Your personal data will be processed for the following purposes:',
            privacy_s3_l1: 'Responding to your inquiries and quote requests.',
            privacy_s3_l2: 'Managing the business relationship and delivery of our services.',
            privacy_s3_l3: 'Sending you communications related to your project or inquiry.',
            privacy_s4_title: '4. Legal Basis',
            privacy_s4_p1: 'The processing of your data is based on the consent you give us when submitting the contact form, as well as the legitimate interest in responding to your requests and, where applicable, the performance of a service contract.',
            privacy_s5_title: '5. Data Retention',
            privacy_s5_p1: 'We will retain your personal data for as long as necessary to fulfill the purpose for which it was collected. Once the relationship has ended, data will be kept for the legally established periods.',
            privacy_s6_title: '6. Data Sharing',
            privacy_s6_p1: 'We will not share your personal data with third parties, except where required by law. The contact form uses the FormSubmit service for email delivery management.',
            privacy_s7_title: '7. Your Rights',
            privacy_s7_p1: 'You may exercise the following rights at any time:',
            privacy_s7_l1: '<strong>Access:</strong> Know what personal data we hold about you.',
            privacy_s7_l2: '<strong>Rectification:</strong> Request correction of inaccurate data.',
            privacy_s7_l3: '<strong>Erasure:</strong> Request deletion of your data.',
            privacy_s7_l4: '<strong>Objection:</strong> Object to the processing of your data.',
            privacy_s7_l5: '<strong>Portability:</strong> Receive your data in a structured format.',
            privacy_s7_l6: '<strong>Restriction:</strong> Request restriction of processing.',
            privacy_s7_p2: 'To exercise any of these rights, send us an email at <a href="mailto:info.codemetria@gmail.com">info.codemetria@gmail.com</a>.',
            privacy_s8_title: '8. Cookies',
            privacy_s8_p1: 'This website only uses session storage (sessionStorage) to remember the language preference during browsing. We do not use tracking, analytics, or advertising cookies.',
            privacy_s9_title: '9. Security',
            privacy_s9_p1: 'We apply appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.',
            privacy_s10_title: '10. Policy Changes',
            privacy_s10_p1: 'We reserve the right to modify this privacy policy at any time. Any changes will be published on this page with the corresponding update date.',
            // --- Terms of Service Page ---
            terms_breadcrumb: 'Terms of Service',
            terms_title: 'Terms of <span class="gradient-text">Service</span>',
            terms_subtitle: 'Last updated: February 15, 2026',
            terms_s1_title: '1. General Information',
            terms_s1_p1: 'These terms and conditions govern the use of the <strong>CODEMETRIA</strong> website and the contracting of our web design and development services. By accessing this website or contracting our services, you accept these terms in their entirety.',
            terms_s2_title: '2. Services Offered',
            terms_s2_p1: 'CODEMETRIA offers professional services including:',
            terms_s2_l1: 'Professional web design and UI/UX',
            terms_s2_l2: 'Custom web development',
            terms_s2_l3: 'Responsive and adaptive design',
            terms_s2_l4: 'Online stores / E-Commerce',
            terms_s2_l5: 'Maintenance and technical support',
            terms_s2_l6: 'SEO and web positioning',
            terms_s2_p2: 'The specific features of each service will be detailed in the personalized quote provided to the client before starting any project.',
            terms_s3_title: '3. Contracting Process',
            terms_s3_p1: 'The contracting process for our services follows these steps:',
            terms_s3_l1: 'The client requests a quote through our contact form or by email.',
            terms_s3_l2: 'CODEMETRIA prepares a detailed quote with deadlines and conditions.',
            terms_s3_l3: 'The client accepts the quote in writing (email).',
            terms_s3_l4: 'The agreed initial payment is made to begin the project.',
            terms_s4_title: '4. Prices and Payments',
            terms_s4_p1: 'The prices of our services are established in each individual quote. Unless otherwise agreed:',
            terms_s4_l1: 'An initial payment of 50% is required to start the project.',
            terms_s4_l2: 'The remaining 50% is paid upon delivery of the finished project.',
            terms_s4_l3: 'Prices include VAT unless otherwise stated.',
            terms_s5_title: '5. Delivery Deadlines',
            terms_s5_p1: 'Delivery deadlines are specified in each quote. CODEMETRIA commits to meeting agreed deadlines, although these may be affected by:',
            terms_s5_l1: 'Delays in content or material delivery by the client.',
            terms_s5_l2: 'Requests for significant changes to the approved design.',
            terms_s5_l3: 'Force majeure events.',
            terms_s6_title: '6. Revisions and Modifications',
            terms_s6_p1: 'Each quote includes a set number of revision rounds. Additional revisions outside the initial scope may incur additional costs that will be communicated to the client in advance.',
            terms_s7_title: '7. Intellectual Property',
            terms_s7_p1: 'Once full payment for the project is completed:',
            terms_s7_l1: 'The client obtains full ownership of the design and code of the developed website.',
            terms_s7_l2: 'CODEMETRIA reserves the right to include the project in its portfolio.',
            terms_s7_l3: 'Third-party software licenses are governed by their own terms.',
            terms_s8_title: '8. Warranty and Support',
            terms_s8_p1: 'All projects include a post-delivery warranty period for fixing technical errors. The duration of this period varies by plan. Support does not include adding new features or design changes.',
            terms_s9_title: '9. Hosting and Domain',
            terms_s9_p1: 'Our plans include the first year of hosting and domain. After this period, the client is responsible for renewal, although CODEMETRIA will provide advice on the best available conditions.',
            terms_s10_title: '10. Cancellation',
            terms_s10_p1: 'The client may cancel the project at any time. In case of cancellation:',
            terms_s10_l1: 'The initial payment is non-refundable if work has already begun.',
            terms_s10_l2: 'Work completed up to the cancellation date will be invoiced.',
            terms_s10_l3: 'All material produced up to that point will be delivered to the client.',
            terms_s11_title: '11. Limitation of Liability',
            terms_s11_p1: 'CODEMETRIA shall not be liable for indirect damages, loss of profits, or business interruption arising from the use of the developed website. Our maximum liability is limited to the total amount paid by the client for the contracted service.',
            terms_s12_title: '12. Applicable Law',
            terms_s12_p1: 'These terms are governed by Spanish law. For any dispute, both parties submit to the courts and tribunals of Seville, Spain.',
            terms_s13_title: '13. Contact',
            terms_s13_p1: 'For any questions about these terms of service, you can contact us at:',
            terms_s13_l1: 'Email: <a href="mailto:info.codemetria@gmail.com">info.codemetria@gmail.com</a>',
            terms_s13_l2: 'Phone: +34 671 851 592'
        },
        es: {
            nav_inicio: 'Inicio',
            nav_servicios: 'Servicios',
            nav_proyectos: 'Proyectos',
            nav_nosotros: 'Nosotros',
            nav_contacto: 'Contacto',
            nav_cta: '<i class="fas fa-paper-plane"></i> Empezar Proyecto',
            hero_badge: '<i class="fas fa-rocket"></i> Agencia de Diseño Web',
            hero_title: 'Diseñamos experiencias',
            hero_desc: 'Transformamos tu visión en páginas web modernas, funcionales y optimizadas que impulsan tu negocio al siguiente nivel.',
            hero_btn1: '<i class="fas fa-paper-plane"></i> Solicitar Presupuesto',
            hero_btn2: '<i class="fas fa-eye"></i> Ver Proyectos',
            stat1: 'Proyectos Completados',
            stat2: 'Clientes Satisfechos',
            stat3: 'Años de Experiencia',
            tech_label: 'Tecnologías que dominamos',
            srv_tag: 'Nuestros Servicios',
            srv_title: 'Soluciones digitales <span class="gradient-text">a medida</span>',
            srv_desc: 'Ofrecemos un servicio integral de diseño y desarrollo web adaptado a las necesidades de cada cliente.',
            srv1_title: 'Diseño Web',
            srv1_desc: 'Interfaces modernas y atractivas que reflejan la identidad de tu marca y cautivan a tus usuarios.',
            srv2_title: 'Desarrollo Web',
            srv2_desc: 'Código limpio y optimizado con las últimas tecnologías para un rendimiento excepcional.',
            srv3_title: 'Responsive Design',
            srv3_desc: 'Tu web se verá perfecta en cualquier dispositivo: móvil, tablet o escritorio.',
            srv4_title: 'E-Commerce',
            srv4_desc: 'Tiendas online completas y seguras que maximizan tus ventas y facilitan la gestión.',
            srv5_title: 'Mantenimiento',
            srv5_desc: 'Soporte continuo y actualizaciones para que tu sitio web esté siempre al día y funcionando.',
            srv6_title: 'SEO & Posicionamiento',
            srv6_desc: 'Optimización para buscadores que mejora tu visibilidad y atrae tráfico cualificado a tu web.',
            srv_link: 'Saber más',
            srv_all_btn: 'Ver todos los servicios <i class="fas fa-arrow-right"></i>',
            proj_tag: 'Portfolio',
            proj_title: 'Proyectos <span class="gradient-text">destacados</span>',
            proj_desc: 'Una selección de nuestros trabajos más recientes y exitosos.',
            proj1_desc: 'Nuestra propia web corporativa, diseñada para transmitir profesionalidad y modernidad en cada detalle.',
            proj2_desc: 'Web corporativa para empresa de palets con más de 30 años de experiencia en el sector.',
            proj_link: 'Ver proyecto',
            proj_all_btn: 'Ver todos los proyectos <i class="fas fa-arrow-right"></i>',
            proc_tag: 'Cómo Trabajamos',
            proc_title: 'Un proceso <span class="gradient-text">claro y eficiente</span>',
            proc_desc: 'Desde la idea inicial hasta el lanzamiento, te acompañamos en cada paso.',
            step1_title: 'Descubrimiento',
            step1_desc: 'Analizamos tus necesidades, objetivos y público objetivo para definir la estrategia perfecta.',
            step2_title: 'Diseño',
            step2_desc: 'Creamos wireframes y diseños visuales que reflejan tu marca y optimizan la experiencia de usuario.',
            step3_title: 'Desarrollo',
            step3_desc: 'Transformamos el diseño en código limpio, optimizado y responsive con las mejores tecnologías.',
            step4_title: 'Lanzamiento',
            step4_desc: 'Publicamos tu web, realizamos pruebas finales y te proporcionamos soporte continuo.',
            cta_title: '¿Listo para llevar tu negocio al <span class="gradient-text">siguiente nivel</span>?',
            cta_desc: 'Cuéntanos tu proyecto y te haremos una propuesta personalizada sin compromiso.',
            cta_btn1: '<i class="fas fa-paper-plane"></i> Contactar Ahora',
            cta_btn2: '<i class="fas fa-phone"></i> Llámanos',
            footer_desc: 'Agencia de diseño y desarrollo web profesional. Transformamos ideas en experiencias digitales excepcionales.',
            footer_nav: 'Navegación',
            footer_srv: 'Servicios',
            footer_contact: 'Contacto',
            footer_copy: '&copy; 2026 CODEMETRIA. Todos los derechos reservados.',
            footer_location: 'Sevilla, España',
            // --- Servicios Page ---
            srvp_title: 'Nuestros <span class="gradient-text">Servicios</span>',
            srvp_subtitle: 'Soluciones integrales de diseño y desarrollo web para llevar tu negocio al mundo digital.',
            srvd1_title: '<i class="fas fa-palette" style="color: var(--primary-light); margin-right: 10px;"></i>Diseño Web Profesional',
            srvd1_desc: 'Creamos diseños únicos y atractivos que reflejan la esencia de tu marca. Cada píxel está pensado para ofrecer la mejor experiencia de usuario y transmitir confianza y profesionalidad.',
            srvd1_f1: 'Diseño UI/UX personalizado',
            srvd1_f2: 'Prototipos interactivos en Figma',
            srvd1_f3: 'Paleta de colores y tipografía a medida',
            srvd1_f4: 'Diseño orientado a conversión',
            srvd1_f5: 'Revisiones ilimitadas',
            srvd2_title: '<i class="fas fa-code" style="color: var(--primary-light); margin-right: 10px;"></i>Desarrollo Web a Medida',
            srvd2_desc: 'Transformamos diseños en sitios web funcionales utilizando las tecnologías más modernas. Código limpio, rápido y escalable que garantiza un rendimiento excepcional.',
            srvd2_f1: 'HTML5, CSS3, JavaScript Moderno',
            srvd2_f2: 'Frameworks: React, Next.js, Vue',
            srvd2_f3: 'Integración con CMS (WordPress, etc.)',
            srvd2_f4: 'APIs y backend personalizado',
            srvd2_f5: 'Código optimizado y documentado',
            srvd3_title: '<i class="fas fa-mobile-alt" style="color: var(--primary-light); margin-right: 10px;"></i>Diseño Responsive',
            srvd3_desc: 'Tu web se adaptará perfectamente a cualquier dispositivo. Más del 60% del tráfico web es móvil, por eso nos aseguramos de que la experiencia sea impecable en todas las pantallas.',
            srvd3_f1: 'Enfoque mobile-first',
            srvd3_f2: 'Testing en múltiples dispositivos',
            srvd3_f3: 'Optimización táctil',
            srvd3_f4: 'Imágenes adaptativas',
            srvd3_f5: 'Rendimiento en conexiones lentas',
            srvd4_title: '<i class="fas fa-shopping-cart" style="color: var(--primary-light); margin-right: 10px;"></i>Tiendas Online / E-Commerce',
            srvd4_desc: 'Desarrollamos tiendas online completas y seguras que maximizan tus ventas. Desde el catálogo hasta el checkout, cada paso está optimizado para convertir visitantes en clientes.',
            srvd4_f1: 'WooCommerce / Shopify / Custom',
            srvd4_f2: 'Pasarelas de pago seguras',
            srvd4_f3: 'Gestión de inventario',
            srvd4_f4: 'Panel de administración intuitivo',
            srvd4_f5: 'Marketing y analíticas integradas',
            srvd5_title: '<i class="fas fa-tools" style="color: var(--primary-light); margin-right: 10px;"></i>Mantenimiento & Soporte',
            srvd5_desc: 'Tu web necesita atención continua. Ofrecemos planes de mantenimiento para que esté siempre actualizada, segura y funcionando a pleno rendimiento.',
            srvd5_f1: 'Actualizaciones de seguridad',
            srvd5_f2: 'Copias de seguridad automáticas',
            srvd5_f3: 'Monitorización 24/7',
            srvd5_f4: 'Soporte técnico prioritario',
            srvd5_f5: 'Informes mensuales de rendimiento',
            srvp_cta_title: '¿No encuentras lo que buscas?',
            srvp_cta_desc: 'Cuéntanos tu proyecto y crearemos una solución totalmente personalizada para ti.',
            srvp_cta_btn: '<i class="fas fa-paper-plane"></i> Contactar Ahora',
            // --- Proyectos Page ---
            projp_title: 'Nuestros <span class="gradient-text">Proyectos</span>',
            projp_subtitle: 'Explora nuestra selección de trabajos y descubre cómo transformamos ideas en experiencias digitales.',
            projp_1_desc: 'Nuestra propia web corporativa. Diseñada para transmitir profesionalidad, modernidad y confianza como agencia de diseño y desarrollo web.',
            projp_2_desc: 'Web corporativa para una empresa sevillana dedicada a la compra-venta de palets usados, fabricación de palets nuevos y servicio integral de reparación. Con más de tres décadas de experiencia.',
            projp_cta_title: '¿Te gustaría ver tu proyecto <span class="gradient-text">aquí?</span>',
            projp_cta_desc: 'Hablemos sobre cómo podemos transformar tu idea en una experiencia digital excepcional.',
            projp_cta_btn: '<i class="fas fa-paper-plane"></i> Empezar Mi Proyecto',
            // --- Nosotros Page ---
            aboutp_title: 'Conoce <span class="gradient-text">CODEMETRIA</span>',
            aboutp_subtitle: 'Somos un equipo apasionado por el diseño y la tecnología, comprometidos con transformar tu visión digital en realidad.',
            about_story_tag: 'Nuestra Historia',
            about_story_title: 'De la pasión por el código a <span class="gradient-text">crear experiencias</span>',
            about_story_p1: 'CODEMETRIA nació de la convicción de que cada negocio merece una presencia digital que realmente impacte. Fundada con la visión de combinar diseño excepcional con desarrollo técnico de primer nivel.',
            about_story_p2: 'Desde nuestros inicios, hemos trabajado con empresas de todos los tamaños — desde startups dando sus primeros pasos hasta marcas establecidas que buscan reinventarse digitalmente.',
            about_story_p3: 'Nuestro enfoque va más allá de crear sitios web bonitos: diseñamos herramientas de negocio que generan resultados medibles y contribuyen al crecimiento de nuestros clientes.',
            about_values_tag: 'Valores',
            about_values_title: 'Lo que nos <span class="gradient-text">define</span>',
            about_values_desc: 'Estos son los principios que guían cada proyecto y cada decisión en CODEMETRIA.',
            val1_title: 'Calidad Sin Compromisos',
            val1_desc: 'Cada línea de código y cada píxel está cuidadosamente trabajado. No entregamos nada de lo que no estemos orgullosos.',
            val2_title: 'Transparencia Total',
            val2_desc: 'Comunicación clara y honesta en cada fase del proyecto. Sin sorpresas, sin letra pequeña.',
            val3_title: 'Innovación Constante',
            val3_desc: 'Siempre al día con las últimas tendencias y tecnologías para ofrecer soluciones de vanguardia.',
            val4_title: 'Cliente en el Centro',
            val4_desc: 'Tu éxito es nuestro éxito. Escuchamos, entendemos y trabajamos para superar tus expectativas.',
            val5_title: 'Resultados Medibles',
            val5_desc: 'No solo creamos webs, construimos herramientas de negocio que producen resultados tangibles.',
            val6_title: 'Pasión por el Diseño',
            val6_desc: 'Amamos lo que hacemos y se nota en cada proyecto que entregamos.',
            about_tech_tag: 'Tecnología',
            about_tech_title: 'Herramientas que <span class="gradient-text">utilizamos</span>',
            about_tech_desc: 'Trabajamos con las tecnologías más modernas y fiables del mercado.',
            about_results_tag: 'Resultados',
            about_results_title: 'Nuestros <span class="gradient-text">números hablan</span>',
            about_stat1: 'Proyectos Entregados',
            about_stat2: 'Clientes Felices',
            about_stat3: 'Años de Experiencia',
            about_stat4: 'Tasa de Satisfacción',
            aboutp_cta_title: '¿Quieres trabajar <span class="gradient-text">con nosotros?</span>',
            aboutp_cta_desc: 'Estamos listos para escuchar tu idea y convertirla en un proyecto digital exitoso.',
            aboutp_cta_btn: '<i class="fas fa-paper-plane"></i> Contactar',
            // --- Contacto Page ---
            contactp_title: 'Hablemos de tu <span class="gradient-text">Proyecto</span>',
            contactp_subtitle: 'Cuéntanos tu idea y te responderemos en menos de 24 horas con una propuesta personalizada.',
            contact_info_title: 'Información de Contacto',
            contact_email: 'Email',
            contact_phone: 'Teléfono',
            contact_location: 'Ubicación',
            contact_hours: 'Horario',
            contact_hours_val: 'Máxima disponibilidad para el cliente',
            contact_follow: 'Síguenos',
            contact_form_title: 'Solicitar Presupuesto',
            contact_form_desc: 'Rellena el formulario y nos pondremos en contacto contigo lo antes posible.',
            form_name: 'Nombre *',
            form_email: 'Email *',
            form_phone: 'Teléfono',
            form_service: 'Servicio',
            form_message: 'Cuéntanos sobre tu proyecto *',
            form_submit: 'Enviar Mensaje',
            form_name_ph: 'Tu nombre',
            form_email_ph: 'tu@email.com',
            form_phone_ph: '+34 671 851 592',
            form_message_ph: 'Describe tu proyecto, objetivos y necesidades...',
            fopt_default: 'Selecciona un servicio',
            fopt_diseno: 'Diseño Web',
            fopt_desarrollo: 'Desarrollo Web',
            fopt_responsive: 'Diseño Responsive',
            fopt_ecommerce: 'E-Commerce',
            fopt_mantenimiento: 'Mantenimiento',
            fopt_seo: 'SEO & Posicionamiento',
            fopt_otro: 'Otro',
            faq_tag: 'FAQ',
            faq_title: 'Preguntas <span class="gradient-text">frecuentes</span>',
            faq1_q: '¿Cuánto cuesta una página web?',
            faq1_a: 'Ofrecemos precios muy competitivos adaptados a cada proyecto. Nuestro objetivo es que tengas una web profesional sin que suponga un gran desembolso. Solicita un presupuesto sin compromiso y te sorprenderás.',
            faq2_q: '¿Cuánto tiempo tarda en estar lista mi web?',
            faq2_a: 'Trabajamos con plazos de entrega muy ágiles. La mayoría de proyectos se entregan en pocos días, y los más complejos en pocas semanas. Nos comprometemos a tener tu web lista lo antes posible.',
            faq3_q: '¿Incluís hosting y dominio?',
            faq3_a: 'Sí, todos nuestros planes incluyen el primer año de hosting y dominio. Después, te asesoramos en la renovación con las mejores condiciones.',
            faq4_q: '¿Puedo modificar la web después?',
            faq4_a: 'Por supuesto. Todas nuestras webs incluyen un CMS o panel de administración para que puedas gestionar tu contenido de forma independiente. También ofrecemos planes de mantenimiento.',
            faq5_q: '¿Ofrecéis soporte técnico?',
            faq5_a: 'Sí. Todos los proyectos incluyen un periodo de soporte gratuito (varía según el plan). Después, puedes contratar nuestro servicio de mantenimiento mensual.',
            // --- Footer Legal ---
            footer_privacy: 'Política de Privacidad',
            footer_terms: 'Términos de Servicio',
            // --- Privacy Policy Page ---
            privacy_breadcrumb: 'Política de Privacidad',
            privacy_title: 'Política de <span class="gradient-text">Privacidad</span>',
            privacy_subtitle: 'Última actualización: 15 de febrero de 2026',
            privacy_s1_title: '1. Responsable del Tratamiento',
            privacy_s1_p1: 'El responsable del tratamiento de los datos personales recogidos a través de este sitio web es <strong>CODEMETRIA</strong>, con domicilio en Sevilla, España.',
            privacy_s1_p2: 'Email de contacto: <a href="mailto:info.codemetria@gmail.com">info.codemetria@gmail.com</a>',
            privacy_s2_title: '2. Datos que Recopilamos',
            privacy_s2_p1: 'Recopilamos los datos personales que nos proporcionas voluntariamente a través de nuestro formulario de contacto:',
            privacy_s2_l1: 'Nombre completo',
            privacy_s2_l2: 'Dirección de correo electrónico',
            privacy_s2_l3: 'Número de teléfono (opcional)',
            privacy_s2_l4: 'Tipo de servicio de interés',
            privacy_s2_l5: 'Descripción del proyecto',
            privacy_s3_title: '3. Finalidad del Tratamiento',
            privacy_s3_p1: 'Tus datos personales serán tratados con las siguientes finalidades:',
            privacy_s3_l1: 'Responder a tus consultas y solicitudes de presupuesto.',
            privacy_s3_l2: 'Gestionar la relación comercial y prestación de nuestros servicios.',
            privacy_s3_l3: 'Enviarte comunicaciones relacionadas con tu proyecto o consulta.',
            privacy_s4_title: '4. Base Legal',
            privacy_s4_p1: 'El tratamiento de tus datos se basa en el consentimiento que nos otorgas al enviar el formulario de contacto, así como en el interés legítimo de responder a tus solicitudes y, en su caso, la ejecución de un contrato de prestación de servicios.',
            privacy_s5_title: '5. Conservación de Datos',
            privacy_s5_p1: 'Conservaremos tus datos personales durante el tiempo necesario para cumplir con la finalidad para la que fueron recogidos. Una vez finalizada la relación, los datos se mantendrán durante los plazos legalmente establecidos.',
            privacy_s6_title: '6. Cesión de Datos',
            privacy_s6_p1: 'No compartiremos tus datos personales con terceros, salvo obligación legal. El formulario de contacto utiliza el servicio FormSubmit para la gestión del envío de correos electrónicos.',
            privacy_s7_title: '7. Tus Derechos',
            privacy_s7_p1: 'Puedes ejercer los siguientes derechos en cualquier momento:',
            privacy_s7_l1: '<strong>Acceso:</strong> Conocer qué datos personales tenemos sobre ti.',
            privacy_s7_l2: '<strong>Rectificación:</strong> Solicitar la corrección de datos inexactos.',
            privacy_s7_l3: '<strong>Supresión:</strong> Solicitar la eliminación de tus datos.',
            privacy_s7_l4: '<strong>Oposición:</strong> Oponerte al tratamiento de tus datos.',
            privacy_s7_l5: '<strong>Portabilidad:</strong> Recibir tus datos en un formato estructurado.',
            privacy_s7_l6: '<strong>Limitación:</strong> Solicitar la limitación del tratamiento.',
            privacy_s7_p2: 'Para ejercer cualquiera de estos derechos, envíanos un email a <a href="mailto:info.codemetria@gmail.com">info.codemetria@gmail.com</a>.',
            privacy_s8_title: '8. Cookies',
            privacy_s8_p1: 'Este sitio web utiliza únicamente almacenamiento de sesión (sessionStorage) para recordar la preferencia de idioma durante la navegación. No utilizamos cookies de seguimiento, análisis ni publicidad.',
            privacy_s9_title: '9. Seguridad',
            privacy_s9_p1: 'Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos personales contra el acceso no autorizado, alteración, divulgación o destrucción.',
            privacy_s10_title: '10. Cambios en la Política',
            privacy_s10_p1: 'Nos reservamos el derecho de modificar esta política de privacidad en cualquier momento. Cualquier cambio será publicado en esta misma página con la fecha de actualización correspondiente.',
            // --- Terms of Service Page ---
            terms_breadcrumb: 'Términos de Servicio',
            terms_title: 'Términos de <span class="gradient-text">Servicio</span>',
            terms_subtitle: 'Última actualización: 15 de febrero de 2026',
            terms_s1_title: '1. Información General',
            terms_s1_p1: 'Estos términos y condiciones regulan el uso del sitio web de <strong>CODEMETRIA</strong> y la contratación de nuestros servicios de diseño y desarrollo web. Al acceder a este sitio web o contratar nuestros servicios, aceptas estos términos en su totalidad.',
            terms_s2_title: '2. Servicios Ofrecidos',
            terms_s2_p1: 'CODEMETRIA ofrece servicios profesionales de:',
            terms_s2_l1: 'Diseño web profesional y UI/UX',
            terms_s2_l2: 'Desarrollo web a medida',
            terms_s2_l3: 'Diseño responsive y adaptativo',
            terms_s2_l4: 'Tiendas online / E-Commerce',
            terms_s2_l5: 'Mantenimiento y soporte técnico',
            terms_s2_l6: 'SEO y posicionamiento web',
            terms_s2_p2: 'Las características específicas de cada servicio se detallarán en el presupuesto personalizado proporcionado al cliente antes de iniciar cualquier proyecto.',
            terms_s3_title: '3. Proceso de Contratación',
            terms_s3_p1: 'El proceso de contratación de nuestros servicios sigue los siguientes pasos:',
            terms_s3_l1: 'El cliente solicita un presupuesto a través de nuestro formulario de contacto o por email.',
            terms_s3_l2: 'CODEMETRIA elabora un presupuesto detallado con plazos y condiciones.',
            terms_s3_l3: 'El cliente acepta el presupuesto por escrito (email).',
            terms_s3_l4: 'Se realiza el pago inicial acordado para comenzar el proyecto.',
            terms_s4_title: '4. Precios y Pagos',
            terms_s4_p1: 'Los precios de nuestros servicios se establecen en cada presupuesto individual. Salvo acuerdo en contrario:',
            terms_s4_l1: 'Se requiere un pago inicial del 50% para comenzar el proyecto.',
            terms_s4_l2: 'El 50% restante se abona a la entrega del proyecto finalizado.',
            terms_s4_l3: 'Los precios incluyen IVA salvo que se indique lo contrario.',
            terms_s5_title: '5. Plazos de Entrega',
            terms_s5_p1: 'Los plazos de entrega se especifican en cada presupuesto. CODEMETRIA se compromete a cumplir con los plazos acordados, aunque estos pueden verse afectados por:',
            terms_s5_l1: 'Retrasos en la entrega de contenido o materiales por parte del cliente.',
            terms_s5_l2: 'Solicitudes de cambios significativos sobre el diseño aprobado.',
            terms_s5_l3: 'Causas de fuerza mayor.',
            terms_s6_title: '6. Revisiones y Modificaciones',
            terms_s6_p1: 'Cada presupuesto incluye un número determinado de rondas de revisión. Las revisiones adicionales fuera del alcance inicial podrán generar costes adicionales que se comunicarán al cliente previamente.',
            terms_s7_title: '7. Propiedad Intelectual',
            terms_s7_p1: 'Una vez completado el pago total del proyecto:',
            terms_s7_l1: 'El cliente obtiene la propiedad total del diseño y código del sitio web desarrollado.',
            terms_s7_l2: 'CODEMETRIA se reserva el derecho de incluir el proyecto en su portfolio.',
            terms_s7_l3: 'Las licencias de software de terceros se rigen por sus propios términos.',
            terms_s8_title: '8. Garantía y Soporte',
            terms_s8_p1: 'Todos los proyectos incluyen un periodo de garantía posterior a la entrega para la corrección de errores técnicos. La duración de este periodo varía según el plan contratado. El soporte no incluye la adición de nuevas funcionalidades ni cambios de diseño.',
            terms_s9_title: '9. Hosting y Dominio',
            terms_s9_p1: 'Nuestros planes incluyen el primer año de hosting y dominio. Tras este periodo, el cliente será responsable de la renovación, aunque CODEMETRIA ofrecerá asesoramiento en las mejores condiciones disponibles.',
            terms_s10_title: '10. Cancelación',
            terms_s10_p1: 'El cliente puede cancelar el proyecto en cualquier momento. En caso de cancelación:',
            terms_s10_l1: 'El pago inicial no es reembolsable si el trabajo ya ha comenzado.',
            terms_s10_l2: 'Se facturará el trabajo realizado hasta la fecha de cancelación.',
            terms_s10_l3: 'Se entregará al cliente todo el material producido hasta el momento.',
            terms_s11_title: '11. Limitación de Responsabilidad',
            terms_s11_p1: 'CODEMETRIA no será responsable de daños indirectos, pérdida de beneficios o interrupción del negocio derivados del uso del sitio web desarrollado. Nuestra responsabilidad máxima se limita al importe total abonado por el cliente por el servicio contratado.',
            terms_s12_title: '12. Legislación Aplicable',
            terms_s12_p1: 'Estos términos se rigen por la legislación española. Para cualquier controversia, ambas partes se someten a los juzgados y tribunales de Sevilla, España.',
            terms_s13_title: '13. Contacto',
            terms_s13_p1: 'Para cualquier duda sobre estos términos de servicio, puedes contactarnos en:',
            terms_s13_l1: 'Email: <a href="mailto:info.codemetria@gmail.com">info.codemetria@gmail.com</a>',
            terms_s13_l2: 'Teléfono: +34 671 851 592'
        }
    };

    let currentLang = sessionStorage.getItem('codemetria-lang') || 'es';

    function applyTranslations(lang) {
        const dict = translations[lang];
        if (!dict) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (dict[key] !== undefined) {
                el.innerHTML = dict[key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (dict[key] !== undefined) {
                el.placeholder = dict[key];
            }
        });

        // Update typing effect words
        const typingEl = document.querySelector('.typing-text');
        if (typingEl) {
            const wordsAttr = lang === 'en' ? 'data-words-en' : 'data-words';
            const words = typingEl.getAttribute(wordsAttr);
            if (words) {
                typingEl.dataset.activeWords = words;
            }
        }

        // Update html lang attribute
        document.documentElement.lang = lang;
    }

    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        // Set initial state
        if (currentLang === 'en') {
            langToggle.querySelector('span').textContent = 'ES';
            langToggle.title = 'Cambiar a Español';
            applyTranslations('en');
        }

        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'es' ? 'en' : 'es';
            sessionStorage.setItem('codemetria-lang', currentLang);

            langToggle.querySelector('span').textContent = currentLang === 'es' ? 'EN' : 'ES';
            langToggle.title = currentLang === 'es' ? 'Switch to English' : 'Cambiar a Español';

            applyTranslations(currentLang);
        });
    }

});
