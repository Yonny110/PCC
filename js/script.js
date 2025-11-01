// Overlay functions
function openOverlay() {
    const overlay = document.getElementById('applicationOverlay');
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('active'), 10);
    overlay.setAttribute('aria-hidden', 'false');
    // Move focus into the overlay for accessibility
    const studentType = document.getElementById('studentType');
    if (studentType) studentType.focus();
    document.body.style.overflow = 'hidden'; 
}

function closeOverlay() {
    const overlay = document.getElementById('applicationOverlay');
    overlay.classList.remove('active');
    setTimeout(() => {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        overlay.setAttribute('aria-hidden', 'true');
        // Return focus to the primary trigger
        const applyBtn = document.querySelector('.btn-primary[onclick="openOverlay()"]') || document.querySelector('.btn-primary');
        if (applyBtn) applyBtn.focus();
    }, 300);
}

function proceedApplication() {
    const studentType = document.getElementById('studentType').value;
    if (!studentType) {
        alert('Please select a student type');
        return;
    }
    alert('Proceeding with application for ' + studentType + ' student...');
    closeOverlay();
}


    // Error handling for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'image-placeholder';
            fallback.setAttribute('aria-label', this.alt || 'Image placeholder');
            fallback.textContent = this.alt || 'Image';
            this.parentNode.insertBefore(fallback, this);
        });
    });

    // Navigation toggle functionality - optimized for instant response
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            requestAnimationFrame(() => {
                const expanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', String(!expanded));
                // Toggle both class names to match the CSS which references .active and .open
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
        if (nav && toggle && !nav.contains(e.target) && !toggle.contains(e.target)) {
            requestAnimationFrame(() => {
                toggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
            });
        }
    };
    
    document.addEventListener('click', closeMenuHandler);

    // Enhanced back to top functionality with throttling
    let lastScrollTime = 0;
    const scrollThreshold = 300; // Show button after scrolling 300px
    const throttleDelay = 150; // Throttle scroll events to every 150ms

    const handleScroll = () => {
        const now = Date.now();
        if (now - lastScrollTime >= throttleDelay) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset || document.documentElement.scrollTop;
                // Toggle header effects
                const shouldShow = scrolled > 20;
                if (header) {
                    header.classList.toggle('scrolled', shouldShow);
                    header.style.boxShadow = shouldShow ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none';
                }
                
                // Toggle back to top button
                if (backToTopButton) {
                    backToTopButton.classList.toggle('show', scrolled > scrollThreshold);
                }
                lastScrollTime = now;
            });
        }
    };

    // Use passive scroll listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial state setup

    // Smooth scroll to top with acceleration
    if (backToTopButton) {
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            const duration = 600; // Animation duration in ms
            const startPosition = window.pageYOffset;
            const startTime = performance.now();

            const easeOutQuad = (t) => t * (2 - t); // Easing function for smooth deceleration

            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                window.scrollTo(0, startPosition * (1 - easeOutQuad(progress)));

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };

            requestAnimationFrame(animateScroll);
        });
    }

    // Special handling for brand logo - instant scroll to top
    const brandEl = document.querySelector('.brand');
    if (brandEl) {
        brandEl.addEventListener('click', function(e) {
            e.preventDefault();
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
    }

    // Improved internal anchor handling: ensure scrolling occurs AFTER mobile nav closes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#' || targetId === '#home') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            // Close mobile nav first (if open) so the overlay doesn't block scrolling
            try {
                if (toggle && nav) {
                    toggle.setAttribute('aria-expanded', 'false');
                    nav.classList.remove('active');
                }
            } catch (err) {
                // ignore if nav/toggle missing
            }

            // Compute header offset dynamically (handles different header heights)
            const headerOffset = header ? header.getBoundingClientRect().height || 80 : 80;

            // Small delay to allow CSS hide animation / layout updates on mobile
            const scrollAfter = () => {
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            };

            // If the site nav was visible on small screens, allow a short delay
            const delay = (nav && nav.classList.contains('active')) ? 120 : 0;
            setTimeout(scrollAfter, delay);
        });
    });

    // Enhanced form validation and submission handling
    if (messageForm) {
        const formInputs = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            subject: document.getElementById('subject'),
            message: document.getElementById('message')
        };

        const validateInput = (input, value) => {
            const type = input.type;
            const id = input.id;
            let isValid = true;
            let message = '';

            if (!value.trim()) {
                isValid = false;
                message = `${id.charAt(0).toUpperCase() + id.slice(1)} is required`;
            } else if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            } else if (id === 'message' && value.trim().length < 10) {
                isValid = false;
                message = 'Message must be at least 10 characters long';
            }

            return { isValid, message };
        };

        // Add real-time validation feedback
        Object.values(formInputs).forEach(input => {
            if (!input) return;

            const createErrorElement = (message) => {
                const errorDiv = document.createElement('div');
                errorDiv.id = `${input.id}-error`;
                errorDiv.className = 'error-message';
                errorDiv.setAttribute('aria-live', 'polite');
                errorDiv.textContent = message;
                return errorDiv;
            };

            input.addEventListener('blur', () => {
                const { isValid, message } = validateInput(input, input.value);
                const existingError = document.getElementById(`${input.id}-error`);
                
                if (!isValid) {
                    input.classList.add('error');
                    input.setAttribute('aria-invalid', 'true');
                    
                    if (!existingError) {
                        input.parentNode.appendChild(createErrorElement(message));
                    } else {
                        existingError.textContent = message;
                    }
                } else {
                    if (existingError) {
                        existingError.remove();
                    }
                    input.classList.remove('error');
                    input.removeAttribute('aria-invalid');
                }
            });

            // Clear error on input
            input.addEventListener('input', () => {
                const existingError = document.getElementById(`${input.id}-error`);
                if (existingError) {
                    input.classList.remove('error');
                    input.removeAttribute('aria-invalid');
                    existingError.remove();
                }
            });
        });

        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const formData = {};
            
            // Validate all inputs
            for (const [key, input] of Object.entries(formInputs)) {
                if (!input) continue;
                
                formData[key] = input.value.trim();
                const validation = validateInput(input, formData[key]);
                
                if (!validation.isValid) {
                    isValid = false;
                    input.classList.add('error');
                    const existingError = document.getElementById(`${input.id}-error`);
                    if (!existingError) {
                        input.parentNode.appendChild(createErrorElement(validation.message));
                    }
                }
            }
            
            if (!isValid) {
                // Focus first invalid input
                const firstInvalid = Object.values(formInputs).find(input => 
                    input && input.classList.contains('error'));
                if (firstInvalid) firstInvalid.focus();
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.setAttribute('role', 'alert');
                successMessage.innerHTML = `
                    <div class="success-icon">✓</div>
                    <p>Thank you, ${formData.name}!</p>
                    <p>Your message has been sent successfully.</p>
                `;
                
                messageForm.reset();
                messageForm.style.opacity = '0';
                messageForm.parentNode.insertBefore(successMessage, messageForm);
                
                setTimeout(() => {
                    messageForm.style.display = 'none';
                    successMessage.style.opacity = '1';
                }, 300);
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    setTimeout(() => {
                        successMessage.remove();
                        messageForm.style.display = '';
                        setTimeout(() => {
                            messageForm.style.opacity = '1';
                        }, 50);
                    }, 300);
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }, 5000);
            }, 1500);
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

    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu if open
            if (nav && nav.classList.contains('active')) {
                toggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
            }
            // Close overlay if open
            const overlay = document.getElementById('applicationOverlay');
            if (overlay && overlay.classList.contains('active')) {
                closeOverlay();
            }
        }
    });

    // Focus trap for overlay
    const overlay = document.getElementById('applicationOverlay');
    if (overlay) {
        const focusableElements = overlay.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        overlay.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }

    // Enhanced animations with Intersection Observer
    const initAnimations = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        // Unobserve after animation
                        observer.unobserve(entry.target);
                    });
                }
            });
        }, { 
            threshold: 0.15,
            rootMargin: '50px'
        });

        // Observe all animated elements
        const elements = document.querySelectorAll('.feature-card, .program-card, .facility-card, .testimonial-card, .section-title');
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    };

    // Initialize animations
    initAnimations();

    // Add scroll-based parallax to section backgrounds
    const parallaxSections = document.querySelectorAll('section:nth-child(even)');
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            parallaxSections.forEach(section => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                if (window.innerWidth > 768) { // Only on desktop
                    section.style.backgroundPosition = `center ${rate}px`;
                }
            });
        });
    }, { passive: true });

    // Add smooth scrolling behavior to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;

            const headerOffset = header.offsetHeight;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Add touch swipe support for testimonials on mobile
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        let touchStartX = 0;
        let touchEndX = 0;

        testimonialSlider.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialSlider.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                const direction = diff > 0 ? 'left' : 'right';
                // Add your testimonial sliding logic here
                console.log('Swiped', direction);
            }
        };
    }
});