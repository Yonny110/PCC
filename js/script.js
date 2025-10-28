// Overlay functions
function openOverlay() {
    const overlay = document.getElementById('applicationOverlay');
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('active'), 10);
    document.body.style.overflow = 'hidden'; 
}

function closeOverlay() {
    const overlay = document.getElementById('applicationOverlay');
    overlay.classList.remove('active');
    setTimeout(() => {
        overlay.style.display = 'none';
        document.body.style.overflow = ''; 
    }, 300);
}

function proceedApplication() {
    const studentType = document.getElementById('studentType').value;
    if (!studentType) {
        alert('Please select a student type');
        return;
    }
    alert('Proceeding with application for ' + studentType + ' student...');
}

document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements for better performance
    const nav = document.getElementById('siteNav');
    const header = document.getElementById('site-header');
    const toggle = document.getElementById('navToggle');
    const backToTopButton = document.querySelector('.back-to-top');
    const messageForm = document.getElementById('messageForm');

    // Navigation toggle functionality - optimized for instant response
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            requestAnimationFrame(() => {
                const expanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', String(!expanded));
                nav.classList.toggle('active');
            });
        });

        // Instant menu close on link click
        nav.querySelectorAll('a').forEach(anchor => {
            anchor.addEventListener('click', () => {
                requestAnimationFrame(() => {
                    toggle.setAttribute('aria-expanded', 'false');
                    nav.classList.remove('active');
                });
            });
        });
    }

    // Optimized click outside handler
    const closeMenuHandler = (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
            requestAnimationFrame(() => {
                toggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
            });
        }
    };
    
    document.addEventListener('click', closeMenuHandler);

    // Optimized scroll handler using requestAnimationFrame
    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Header effects
                const shouldShow = window.scrollY > 20;
                header.classList.toggle('scrolled', shouldShow);
                header.style.boxShadow = shouldShow ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none';

                // Back to top button
                backToTopButton.classList.toggle('show', window.scrollY > 300);

                ticking = false;
            });
            ticking = true;
        }
    };

    // Use passive scroll listener for better performance
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial state setup

    // Instant back to top functionality
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        requestAnimationFrame(() => {
            window.scrollTo({
                top: 0,
                behavior: 'auto' // Changed from 'smooth' for instant scroll
            });
        });
    });

    // Special handling for brand logo - instant scroll to top
    document.querySelector('.brand').addEventListener('click', function(e) {
        e.preventDefault();
        requestAnimationFrame(() => {
            window.scrollTo({
                top: 0,
                behavior: 'auto'
            });
        });
    });

    // Optimized instant scrolling for other internal links
    document.querySelectorAll('a[href^="#"]:not(.brand)').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                requestAnimationFrame(() => {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'auto' // Changed from 'smooth' for instant scroll
                    });
                });
            }
        });
    });

    // Optimized form submission handling
    if (messageForm) {
        const formInputs = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            subject: document.getElementById('subject'),
            message: document.getElementById('message')
        };

        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values using cached references
            const formData = {};
            for (const [key, input] of Object.entries(formInputs)) {
                formData[key] = input.value;
            }
            
            // Instant feedback
            requestAnimationFrame(() => {
                alert(`Thank you, ${formData.name}! Your message has been sent.`);
                this.reset();
            });
        });
    }

    // Optimized element reveal animation
    const observeElements = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    });
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px' // Preload elements before they come into view
        });

        // Batch DOM operations
        const elements = document.querySelectorAll('.feature-card, .program-card, .facility-card, .testimonial-card');
        requestAnimationFrame(() => {
            elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.3s ease-out'; // Reduced from 0.6s for faster animation
                observer.observe(el);
            });
        });
    };

    // Initialize immediately
    observeElements();
});