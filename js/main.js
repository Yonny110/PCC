// Main JavaScript for Pasig Catholic College Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const siteNav = document.getElementById('siteNav');
    
    if (navToggle && siteNav) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            siteNav.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.site-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (siteNav.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                siteNav.classList.remove('active');
            }
        });
    });
    
    // Back to Top Button
    const backToTopButton = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
        
        // Header scroll effect
        const header = document.getElementById('site-header');
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.getElementById('site-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize animations
    initAnimations();
});

// Program Overlay Functions
function openProgramOverlay(program) {
    const overlay = document.getElementById('programOverlay');
    const content = document.getElementById('programOverlayContent');
    
    // Program data
    const programs = {
        preschool: {
            icon: '👶',
            title: 'Pre-School Program',
            description: 'Our Pre-School program provides a nurturing environment for young learners aged 3-5 years old, focusing on holistic development through play-based learning and early childhood education principles.',
            details: [
                'Nursery (3-4 years old)',
                'Kindergarten (4-5 years old)',
                'Preparatory (5-6 years old)',
                'Play-based learning approach',
                'Early literacy and numeracy skills',
                'Social and emotional development',
                'Creative arts and physical activities'
            ],
            highlight: 'Enroll your child for a strong educational foundation!'
        },
        elementary: {
            icon: '🧒',
            title: 'Elementary Program',
            description: 'Our Elementary program (Grades 1-6) provides a comprehensive education that balances academic excellence with character formation, preparing students for higher education and life.',
            details: [
                'Grades 1-6 comprehensive curriculum',
                'Core subjects: English, Math, Science, Filipino',
                'Values Education and Christian Living',
                'MAPEH (Music, Arts, PE, Health)',
                'Technology and Livelihood Education',
                'Extracurricular activities and clubs',
                'Remedial and enrichment programs'
            ],
            highlight: 'Build a strong academic foundation with us!'
        },
        'junior-high': {
            icon: '👦',
            title: 'Junior High School Program',
            description: 'Our Junior High School program (Grades 7-10) follows the K-12 curriculum with specialized tracks and electives that prepare students for senior high school and future careers.',
            details: [
                'Grades 7-10 K-12 curriculum',
                'Core academic subjects',
                'Technology and Livelihood Education tracks',
                'Arts and Sports tracks',
                'Career guidance and counseling',
                'Leadership training programs',
                'Work immersion opportunities'
            ],
            highlight: 'Discover your potential in our diverse programs!'
        },
        'senior-high': {
            icon: '👨‍🎓',
            title: 'Senior High School Program',
            description: 'Our Senior High School program offers Academic, Technical-Vocational, and Sports tracks designed to prepare students for college, entrepreneurship, or immediate employment.',
            details: [
                'Academic Track (STEM, ABM, HUMSS)',
                'Technical-Vocational-Livelihood Track',
                'Sports Track',
                'Industry-aligned curriculum',
                'Work immersion programs',
                'College preparation courses',
                'Career assessment and guidance'
            ],
            highlight: 'Choose your path to success with our SHS programs!'
        },
        college: {
            icon: '🎓',
            title: 'College Programs',
            description: 'Our College programs offer undergraduate degrees in various fields, combining academic excellence with practical skills development and industry exposure.',
            details: [
                'Bachelor of Elementary Education',
                'Bachelor of Secondary Education',
                'Bachelor of Science in Business Administration',
                'Bachelor of Science in Information Technology',
                'Bachelor of Arts in Psychology',
                'Bachelor of Science in Hospitality Management',
                'Customized internship programs'
            ],
            highlight: 'Start your professional journey with PCC College!'
        },
        graduate: {
            icon: '📚',
            title: 'Graduate School Programs',
            description: 'Our Graduate School offers Master\'s and Doctoral programs for professionals seeking advanced knowledge, research skills, and career advancement in their respective fields.',
            details: [
                'Master of Arts in Education',
                'Master in Business Administration',
                'Master in Public Administration',
                'Doctor of Education',
                'Doctor of Philosophy in Leadership',
                'Weekend and evening classes available',
                'Thesis and non-thesis options'
            ],
            highlight: 'Advance your career with our graduate programs!'
        }
    };
    
    const programData = programs[program];
    if (programData) {
        content.innerHTML = `
            <div class="program-overlay-content">
                <div class="program-overlay-icon">${programData.icon}</div>
                <h2 style="color: var(--primary);">${programData.title}</h2>
                <p>${programData.description}</p>
                <ul class="program-details-list">
                    ${programData.details.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <div class="program-highlight">${programData.highlight}</div>
                <div style="margin-top: 2rem;">
                    <a href="admissions.html" class="btn btn-primary">Apply Now</a>
                </div>
            </div>
        `;
        
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeProgramOverlay() {
    const overlay = document.getElementById('programOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close overlay when clicking on the background
document.addEventListener('click', function(e) {
    const overlay = document.getElementById('programOverlay');
    if (e.target === overlay) {
        closeProgramOverlay();
    }
});

// Close overlay on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('programOverlay');
        if (overlay.classList.contains('active')) {
            closeProgramOverlay();
        }
    }
});

// Animation initialization
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.feature-card, .program-card, .facility-card, .testimonial-card, .contact-item');
    elementsToAnimate.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Form handling for contact page
if (document.getElementById('contactForm')) {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // In a real application, you would send the data to a server here
            console.log('Form submitted:', data);
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Image error handling
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Replace broken images with placeholder
            this.style.display = 'none';
            const parent = this.parentElement;
            
            if (parent.classList.contains('testimonial-img')) {
                const initial = this.alt ? this.alt.charAt(0) : '?';
                parent.innerHTML = `<div class="placeholder-avatar">${initial}</div>`;
            } else {
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.textContent = 'Image not available';
                parent.appendChild(placeholder);
            }
        });
    });
});