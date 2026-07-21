
(function () {
    'use strict';

    // ========== PRELOADER ==========
    function initPreloader() {
        const preloader = document.getElementById('preloader');
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('loaded');
                document.body.style.overflow = '';
                initAnimations();
            }, 1800);
        });
        document.body.style.overflow = 'hidden';
    }

    // ========== MATRIX RAIN BACKGROUND ==========
    function initMatrix() {
        const canvas = document.getElementById('matrix-bg');
        if (!canvas) return;

        // Disable matrix rain on mobile for performance
        if (window.innerWidth < 768) {
            canvas.style.display = 'none';
            return;
        }

        const ctx = canvas.getContext('2d');

        let width, height, columns, drops;
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const fontSize = 14;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.floor(width / fontSize);
            drops = Array(columns).fill(1);
        }

        function draw() {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#00ff88';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        resize();
        window.addEventListener('resize', resize);

        // Use requestAnimationFrame with throttling for performance
        let lastTime = 0;
        const fps = 15; // Low FPS for performance
        const interval = 1000 / fps;

        function animate(time) {
            requestAnimationFrame(animate);
            if (time - lastTime < interval) return;
            lastTime = time;
            draw();
        }
        requestAnimationFrame(animate);
    }

    // ========== CURSOR GLOW ==========
    function initCursorGlow() {
        const glow = document.getElementById('cursor-glow');
        if (!glow || window.innerWidth < 768) {
            if (glow) glow.style.display = 'none';
            return;
        }

        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function updateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            glow.style.transform = `translate(${glowX - 300}px, ${glowY - 300}px)`;
            requestAnimationFrame(updateGlow);
        }
        updateGlow();
    }

    // ========== NAVIGATION ==========
    function initNavigation() {
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const mobileLinks = document.querySelectorAll('.mobile-link');
        const sections = document.querySelectorAll('.section, #hero');

        // Scroll state
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            lastScroll = scrollY;
        }, { passive: true });

        // Hamburger toggle
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Active section highlighting
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        if (link.dataset.section === id) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => observer.observe(section));
    }

    // ========== TYPING EFFECT ==========
    function initTypingEffect() {
        const typedEl = document.getElementById('typed-text');
        if (!typedEl) return;

        const phrases = [
            'Penetration Tester',
            'CTF Developer',
            'SOC Analyst',
            'Security Researcher',
            'Crypto & Stego Specialist',
            'Purple Teamer'
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 400; // Pause before new word
            }

            setTimeout(type, typeSpeed);
        }

        setTimeout(type, 2000); // Start after preloader
    }

    // ========== COUNTER ANIMATION ==========
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observed = new Set();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !observed.has(entry.target)) {
                    observed.add(entry.target);
                    const target = parseInt(entry.target.dataset.target);
                    animateCounter(entry.target, target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    function animateCounter(element, target) {
        let current = 0;
        const duration = 1500;
        const step = target / (duration / 16);

        function update() {
            current += step;
            if (current >= target) {
                element.textContent = target;
                return;
            }
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        }
        update();
    }

    // ========== SKILL BARS ANIMATION ==========
    function initSkillBars() {
        const skillItems = document.querySelectorAll('.skill-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const level = entry.target.dataset.level;
                    entry.target.style.setProperty('--level', level + '%');
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        skillItems.forEach(item => observer.observe(item));
    }

    // ========== SCROLL REVEAL ==========
    function initScrollReveal() {
        // Add reveal class to sections and cards
        const revealElements = document.querySelectorAll(
            '.section-header, .about-content, .about-visual, .skill-category, ' +
            '.project-card, .cert-card, .achievement-card, .edu-card, ' +
            '.contact-info, .contact-terminal, .highlight-card'
        );

        revealElements.forEach(el => el.classList.add('reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    // ========== TIMELINE ANIMATION ==========
    function initTimeline() {
        const items = document.querySelectorAll('.timeline-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 150);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        items.forEach(item => observer.observe(item));
    }

    // ========== CONTACT FORM ==========
    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            // Create mailto link
            const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            window.location.href = `mailto:asdtriada@gmail.com?subject=${subject}&body=${body}`;

            // Visual feedback
            const btn = form.querySelector('.term-submit');
            btn.innerHTML = '<span class="term-prompt">$</span> message_sent <span style="color: var(--accent-primary)">✓</span>';
            setTimeout(() => {
                btn.innerHTML = '<span class="term-prompt">$</span> send_message --encrypt <span class="submit-arrow">→</span>';
            }, 3000);
        });
    }

    // ========== SMOOTH SCROLL ==========
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ========== TILT EFFECT ON PROJECT CARDS ==========
    function initTiltEffect() {
        if (window.innerWidth < 768) return;

        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

                // Move glow
                const glow = card.querySelector('.project-glow');
                if (glow) {
                    glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,255,136,0.1) 0%, transparent 60%)`;
                    glow.style.opacity = '1';
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                const glow = card.querySelector('.project-glow');
                if (glow) glow.style.opacity = '0';
            });
        });
    }

    // ========== PARTICLE NETWORK ==========
    function initParticleNetwork() {
        const canvas = document.getElementById('particle-network');
        if (!canvas || window.innerWidth < 768) {
            if (canvas) canvas.style.display = 'none';
            return;
        }
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouseX = -9999, mouseY = -9999;
        const particleCount = Math.min(30, Math.floor(window.innerWidth / 40));
        const maxDist = 150;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    r: Math.random() * 2 + 1
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Mouse repulsion
                const dx0 = mouseX - p.x;
                const dy0 = mouseY - p.y;
                const d0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
                if (d0 < 120) {
                    p.x -= dx0 * 0.02;
                    p.y -= dy0 * 0.02;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = '#00ff88';
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDist) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(0, 255, 136, ${1 - dist / maxDist})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        resize();
        createParticles();
        window.addEventListener('resize', () => { resize(); createParticles(); });
        document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

        let lastTime = 0;
        const fps = 20;
        const interval = 1000 / fps;
        function animate(time) {
            requestAnimationFrame(animate);
            if (time - lastTime < interval) return;
            lastTime = time;
            draw();
        }
        requestAnimationFrame(animate);
    }

    // ========== COMMAND PALETTE ==========
    function initCommandPalette() {
        const palette = document.getElementById('command-palette');
        const input = document.getElementById('cmd-input');
        const results = document.getElementById('cmd-results');
        if (!palette || !input || !results) return;

        const items = results.querySelectorAll('.cmd-item');
        let activeIndex = 0;

        const actions = {
            about: () => scrollToSection('#about'),
            skills: () => scrollToSection('#skills'),
            experience: () => scrollToSection('#experience'),
            projects: () => scrollToSection('#projects'),
            certifications: () => scrollToSection('#certifications'),
            contact: () => scrollToSection('#contact'),
            github: () => window.open('https://github.com/Ro0tk1e', '_blank'),
            linkedin: () => window.open('https://linkedin.com/in/asd-assad-632676308', '_blank'),
            resume: () => { const a = document.createElement('a'); a.href = 'Mohammed_Assad_REsuMe.pdf'; a.download = ''; a.click(); },
            top: () => window.scrollTo({ top: 0, behavior: 'smooth' })
        };

        function scrollToSection(selector) {
            const el = document.querySelector(selector);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function open() {
            palette.classList.add('active');
            input.value = '';
            filterItems('');
            activeIndex = 0;
            updateActive();
            setTimeout(() => input.focus(), 100);
        }

        function close() {
            palette.classList.remove('active');
            input.value = '';
        }

        function filterItems(query) {
            const q = query.toLowerCase();
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.classList.toggle('hidden', q && !text.includes(q));
            });
            activeIndex = 0;
            updateActive();
        }

        function updateActive() {
            const visible = [...items].filter(i => !i.classList.contains('hidden'));
            items.forEach(i => i.classList.remove('active'));
            if (visible[activeIndex]) visible[activeIndex].classList.add('active');
        }

        function executeAction() {
            const visible = [...items].filter(i => !i.classList.contains('hidden'));
            if (visible[activeIndex]) {
                const action = visible[activeIndex].dataset.action;
                if (actions[action]) actions[action]();
            }
            close();
        }

        // Keyboard shortcut: Ctrl+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (palette.classList.contains('active')) {
                    close();
                } else {
                    open();
                }
            }
            if (!palette.classList.contains('active')) return;
            if (e.key === 'Escape') { close(); return; }
            if (e.key === 'Enter') { executeAction(); return; }
            const visible = [...items].filter(i => !i.classList.contains('hidden'));
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeIndex = (activeIndex + 1) % visible.length;
                updateActive();
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeIndex = (activeIndex - 1 + visible.length) % visible.length;
                updateActive();
            }
        });

        input.addEventListener('input', () => filterItems(input.value));

        // Click on items
        items.forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                if (actions[action]) actions[action]();
                close();
            });
        });

        // Click backdrop to close
        palette.querySelector('.cmd-backdrop').addEventListener('click', close);

        // Cmd hint button
        const cmdHintBtn = document.getElementById('cmd-hint-btn');
        if (cmdHintBtn) {
            cmdHintBtn.addEventListener('click', () => {
                if (palette.classList.contains('active')) {
                    close();
                } else {
                    open();
                }
            });
        }
    }

    // ========== INITIALIZE ALL ==========
    function initAnimations() {
        initMatrix();
        initParticleNetwork();
        initCursorGlow();
        initTypingEffect();
        initCounters();
        initSkillBars();
        initScrollReveal();
        initTimeline();
        initTiltEffect();
    }

    // Init immediately needed features
    initPreloader();
    initNavigation();
    initSmoothScroll();
    initContactForm();
    initCommandPalette();

})();

