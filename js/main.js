/* ============================================
   AUTO-MOMENT | Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initLogoHomeLink();
    initScrollReveal();
    initCounterAnimation();
    initTestimonialSlider();
    initStyleDemo();
    initBackToTop();
    initSmoothScroll();
    initMobileMenu();
    initTypingEffect();
});

/* ============================================
   LOGO → 홈(최상단) 이동
   ============================================ */
function initLogoHomeLink() {
    const logo = document.querySelector('.nav-logo');
    if (!logo) return;

    logo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // 모바일 메뉴 열려있으면 닫기
        const navLinks = document.getElementById('navLinks');
        if (navLinks) navLinks.classList.remove('open');
        const spans = document.querySelectorAll('.hamburger span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
}

/* ============================================
   NAVBAR - Scroll Effect
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const heroHeight = document.getElementById('hero')?.offsetHeight || window.innerHeight;

    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('hero-nav');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.add('hero-nav');
        }
    }

    updateNavbar();
    window.addEventListener('scroll', updateNavbar);
}

/* ============================================
   SCROLL REVEAL
   ============================================ */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for grid items
                const parent = entry.target.parentElement;
                const siblings = [...parent.children].filter(el => el.classList.contains('reveal'));
                const itemIndex = siblings.indexOf(entry.target);
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, itemIndex * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => observer.observe(el));
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, 0, target, 1500);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(progress);
        const current = Math.round(start + (end - start) * eased);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

/* ============================================
   TESTIMONIAL SLIDER
   ============================================ */
let currentSlide = 0;
let totalSlides = 0;
let autoSlideTimer = null;

function initTestimonialSlider() {
    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('sliderDots');
    
    if (!track) return;
    
    const cards = track.querySelectorAll('.testimonial-card');
    totalSlides = cards.length;
    
    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `슬라이드 ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    // Handle resize
    window.addEventListener('resize', () => {
        goToSlide(currentSlide);
    });
    
    // Auto slide
    startAutoSlide();
    
    // Pause on hover
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);
}

function getVisibleCards() {
    return window.innerWidth <= 768 ? 1 : 3;
}

function goToSlide(index) {
    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('sliderDots');
    if (!track) return;
    
    const cards = track.querySelectorAll('.testimonial-card');
    const visible = getVisibleCards();
    const maxSlide = Math.max(0, totalSlides - visible);
    
    currentSlide = Math.max(0, Math.min(index, maxSlide));
    
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    
    // Update dots
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function slideTestimonials(direction) {
    goToSlide(currentSlide + direction);
}

function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
        const visible = getVisibleCards();
        const maxSlide = Math.max(0, totalSlides - visible);
        const nextSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
        goToSlide(nextSlide);
    }, 4000);
}

function stopAutoSlide() {
    if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
    }
}

/* ============================================
   STYLE SELECTION
   ============================================ */
function selectStyle(card) {
    const allCards = document.querySelectorAll('.style-card');
    const allBtns = document.querySelectorAll('.style-select-btn');
    
    allCards.forEach(c => c.classList.remove('active'));
    allBtns.forEach(b => {
        b.classList.remove('active');
        b.textContent = '이 문체 선택';
    });
    
    card.classList.add('active');
    const btn = card.querySelector('.style-select-btn');
    btn.classList.add('active');
    btn.textContent = '선택됨 ✓';
    
    // Animate
    card.style.transform = 'scale(1.02) translateY(-8px)';
    setTimeout(() => {
        card.style.transform = '';
    }, 300);
}

/* ============================================
   STYLE DEMO GENERATOR
   ============================================ */
function initStyleDemo() {
    const input = document.getElementById('keywordInput');
    if (!input) return;
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') generateDemo();
    });
}

const demoTemplates = {
    simple: [
        (kw) => `${new Date().toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'})}. ${kw}. 맑음.`,
        (kw) => `오늘 키워드: ${kw}. 기록 완료.`,
        (kw) => `${kw}가 있었다. 끝.`,
    ],
    emotional: [
        (kw) => `${kw}이 스며드는 오후, 잠시 멈춘 시간처럼 고요하고 아름다운 순간이었다.`,
        (kw) => `어느 날의 ${kw}처럼, 기억은 언제나 가장 소중한 순간에 더 선명해진다.`,
        (kw) => `${kw} 속에서 찾은 작은 위안. 오늘도 그렇게 하루가 저물었다.`,
    ],
    witty: [
        (kw) => `${kw} ← 오늘의 MVP🏆 내일은 더 잘할 수 있을 것 같은 기분?`,
        (kw) => `진심 ${kw}이 이렇게까지 좋을 줄 몰랐음ㅋㅋㅋ 내 취향 믿는다👍`,
        (kw) => `${kw} 만난 오늘 = 갓생의 시작 🔥 이 에너지 내일도 유지바람`,
    ]
};

function generateDemo() {
    const input = document.getElementById('keywordInput');
    const keyword = input.value.trim();
    
    if (!keyword) {
        input.focus();
        input.style.borderColor = 'var(--accent)';
        setTimeout(() => { input.style.borderColor = ''; }, 1500);
        return;
    }
    
    const btn = document.querySelector('.demo-generate-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 생성 중...';
    btn.disabled = true;
    
    setTimeout(() => {
        const randomIdx = Math.floor(Math.random() * 3);
        
        const simpleEl = document.getElementById('simpleResult');
        const emotionalEl = document.getElementById('emotionalResult');
        const wittyEl = document.getElementById('wittyResult');
        
        // Clear and typewrite
        typewrite(simpleEl, demoTemplates.simple[randomIdx](keyword));
        setTimeout(() => typewrite(emotionalEl, demoTemplates.emotional[randomIdx](keyword)), 200);
        setTimeout(() => typewrite(wittyEl, demoTemplates.witty[randomIdx](keyword)), 400);
        
        btn.innerHTML = '<i class="fas fa-magic"></i> AI 생성';
        btn.disabled = false;
    }, 800);
}

function typewrite(element, text) {
    element.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text[i];
            i++;
        } else {
            clearInterval(interval);
        }
    }, 30);
}

/* ============================================
   TYPING EFFECT (Hero)
   ============================================ */
function initTypingEffect() {
    const typingEls = document.querySelectorAll('.typing-text');
    typingEls.forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typewrite(el, text);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(el);
    });
}

/* ============================================
   PRICING TOGGLE
   ============================================ */
function toggleBilling() {
    const isYearly = document.getElementById('billingToggle').checked;
    const priceAmounts = document.querySelectorAll('.price-amount');
    
    priceAmounts.forEach(el => {
        const monthly = parseInt(el.getAttribute('data-monthly'));
        const yearly = parseInt(el.getAttribute('data-yearly'));
        const target = isYearly ? yearly : monthly;
        
        animatePriceChange(el, target);
    });
}

function animatePriceChange(element, target) {
    element.style.transform = 'scale(0.8)';
    element.style.opacity = '0';
    
    setTimeout(() => {
        element.textContent = target === 0 ? '₩0' : `₩${target.toLocaleString('ko-KR')}`;
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
        element.style.transition = 'all 0.3s ease';
    }, 200);
}

/* ============================================
   DOWNLOAD MODAL
   ============================================ */
function openDownloadModal() {
    const modal = document.getElementById('downloadModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDownloadModal(event) {
    // Called directly from button - no event check needed
    if (!event) {
        const modal = document.getElementById('downloadModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        return;
    }
    // Called from overlay click - only close if clicking the overlay itself
    if (event.target && event.target.id === 'downloadModal') {
        const modal = document.getElementById('downloadModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function submitEmail() {
    const input = document.getElementById('emailInput');
    const email = input.value.trim();
    
    if (!email || !email.includes('@')) {
        input.style.borderColor = 'var(--accent)';
        input.placeholder = '올바른 이메일을 입력해주세요';
        setTimeout(() => {
            input.style.borderColor = '';
            input.placeholder = '이메일 주소 입력';
        }, 2000);
        return;
    }
    
    const btn = input.nextElementSibling;
    btn.textContent = '✓ 등록 완료!';
    btn.style.background = 'var(--accent-green)';
    btn.style.color = 'var(--bg-dark)';
    
    setTimeout(() => {
        closeDownloadModal(null);
        showToast('🎉 사전 등록이 완료되었습니다! 출시 알림을 보내드릴게요.');
    }, 1500);
}

/* ============================================
   TOAST NOTIFICATION
   ============================================ */
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: var(--surface);
        border: 1px solid var(--primary);
        color: var(--text-primary);
        padding: 16px 24px;
        border-radius: 14px;
        font-size: 0.9rem;
        font-weight: 600;
        z-index: 3000;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        max-width: 90vw;
        text-align: center;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(0)'; }, 100);
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

/* ============================================
   BACK TO TOP
   ============================================ */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;
            
            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
            
            window.scrollTo({ top: targetY, behavior: 'smooth' });
            
            // Close mobile menu
            document.getElementById('navLinks').classList.remove('open');
        });
    });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (navLinks.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('open');
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
    });
}

/* ============================================
   PROCESS STEP INTERACTIONS
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const stepContents = document.querySelectorAll('.step-content');
    stepContents.forEach(step => {
        step.addEventListener('mouseenter', () => {
            const icon = step.querySelector('.step-icon-wrap');
            icon.style.transform = 'rotate(10deg) scale(1.1)';
        });
        step.addEventListener('mouseleave', () => {
            const icon = step.querySelector('.step-icon-wrap');
            icon.style.transform = '';
        });
    });
});

/* ============================================
   PARALLAX EFFECT (Subtle)
   ============================================ */
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Hero gradient parallax
    const heroGrad = document.querySelector('.hero-gradient');
    if (heroGrad) {
        heroGrad.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
    
    // Photo cards parallax
    const photoCards = document.querySelectorAll('.photo-card');
    photoCards.forEach((card, i) => {
        const speed = 0.05 + i * 0.02;
        card.style.marginTop = `${scrollY * speed}px`;
    });
});

/* ============================================
   MODAL - Keyboard Close (ESC)
   ============================================ */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDownloadModal(null);
    }
});

/* ============================================
   COMPETITIVE TABLE - Hover Highlight
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const table = document.querySelector('.competitive-table');
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            rows.forEach(r => r.style.opacity = '0.5');
            row.style.opacity = '1';
            row.style.transform = 'scale(1.01)';
        });
        row.addEventListener('mouseleave', () => {
            rows.forEach(r => { r.style.opacity = '1'; r.style.transform = ''; });
        });
    });
});

/* ============================================
   FEATURE BLOCK - Image Tilt Effect
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const featureVisuals = document.querySelectorAll('.feature-visual');
    featureVisuals.forEach(visual => {
        visual.addEventListener('mousemove', (e) => {
            const rect = visual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            const child = visual.firstElementChild;
            if (child) {
                child.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg) translateZ(10px)`;
                child.style.transition = 'transform 0.1s ease';
            }
        });
        
        visual.addEventListener('mouseleave', () => {
            const child = visual.firstElementChild;
            if (child) {
                child.style.transform = '';
                child.style.transition = 'transform 0.5s ease';
            }
        });
    });
});

/* ============================================
   ACTIVE NAV HIGHLIGHT
   ============================================ */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${id}`) {
                        link.style.color = 'var(--primary-light)';
                    }
                });
            }
        });
    }, { threshold: 0.5, rootMargin: '-80px 0px -50% 0px' });
    
    sections.forEach(sec => observer.observe(sec));
}

document.addEventListener('DOMContentLoaded', initActiveNavHighlight);

/* ============================================
   CHART BARS ANIMATION ON SCROLL
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const bars = document.querySelectorAll('.bar');
    
    bars.forEach(bar => {
        const targetH = bar.style.getPropertyValue('--h');
        bar.style.setProperty('--h', '0%');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        bar.style.setProperty('--h', targetH);
                    }, 300);
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(bar);
    });
});
