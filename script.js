// Smooth scroll with momentum effect
document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.getElementById('scrollWrapper');
    const sections = document.querySelectorAll('.scroll-section');
    const nav = document.getElementById('navbar');
    const progressBar = document.getElementById('progressBar');
    
    let currentSection = 0;
    let isScrolling = false;
    let scrollTimeout;
    let touchStartY = 0;
    let isUserScrolling = false;

    // Create progress indicator dots
    createProgressDots();

    // Function to create navigation dots
    function createProgressDots() {
        const indicator = document.createElement('div');
        indicator.className = 'progress-indicator';
        indicator.id = 'progressIndicator';
        
        sections.forEach((section, index) => {
            const dot = document.createElement('div');
            dot.className = `progress-dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.index = index;
            dot.addEventListener('click', () => scrollToSection(index));
            indicator.appendChild(dot);
        });
        
        document.body.appendChild(indicator);
    }

    // Update active dot
    function updateActiveDot(index) {
        document.querySelectorAll('.progress-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Scroll to specific section
    function scrollToSection(index) {
        if (index < 0 || index >= sections.length) return;
        
        currentSection = index;
        isScrolling = true;
        
        sections[index].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        updateActiveDot(index);
        updateProgressBar();
        
        // Reset scrolling flag after animation
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }

    // Update progress bar
    function updateProgressBar() {
        const progress = ((currentSection + 1) / sections.length) * 100;
        progressBar.style.width = progress + '%';
    }

    // Handle wheel scroll
    wrapper.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        if (isScrolling) return;
        
        if (e.deltaY > 0) {
            // Scroll down
            if (currentSection < sections.length - 1) {
                scrollToSection(currentSection + 1);
            }
        } else {
            // Scroll up
            if (currentSection > 0) {
                scrollToSection(currentSection - 1);
            }
        }
    }, { passive: false });

    // Handle touch events for mobile
    wrapper.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
        isUserScrolling = true;
    });

    wrapper.addEventListener('touchmove', function(e) {
        if (!isUserScrolling) return;
        
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        
        if (Math.abs(deltaY) > 50 && !isScrolling) {
            if (deltaY > 0) {
                // Swipe up
                if (currentSection < sections.length - 1) {
                    scrollToSection(currentSection + 1);
                }
            } else {
                // Swipe down
                if (currentSection > 0) {
                    scrollToSection(currentSection - 1);
                }
            }
            isUserScrolling = false;
        }
        
        e.preventDefault();
    }, { passive: false });

    wrapper.addEventListener('touchend', function() {
        isUserScrolling = false;
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (isScrolling) return;
        
        switch(e.key) {
            case 'ArrowDown':
            case ' ':
            case 'PageDown':
                e.preventDefault();
                if (currentSection < sections.length - 1) {
                    scrollToSection(currentSection + 1);
                }
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                if (currentSection > 0) {
                    scrollToSection(currentSection - 1);
                }
                break;
            case 'Home':
                e.preventDefault();
                scrollToSection(0);
                break;
            case 'End':
                e.preventDefault();
                scrollToSection(sections.length - 1);
                break;
        }
    });

    // Handle intersection observer for scroll events
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isScrolling) {
                const index = Array.from(sections).indexOf(entry.target);
                currentSection = index;
                updateActiveDot(index);
                updateProgressBar();
            }
        });
    }, {
        threshold: 0.5
    });

    sections.forEach(section => observer.observe(section));

    // Nav link click handlers
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;
            
            const index = Array.from(sections).indexOf(targetSection);
            if (index !== -1) {
                scrollToSection(index);
            }
        });
    });

    // Mobile menu link handlers
    document.querySelectorAll('#mobile-menu a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;
            
            const index = Array.from(sections).indexOf(targetSection);
            if (index !== -1) {
                scrollToSection(index);
                toggleMobileMenu();
            }
        });
    });

    // Initialize
    updateProgressBar();
    
    // Smooth scroll on page load
    setTimeout(() => {
        wrapper.style.scrollBehavior = 'smooth';
    }, 100);

    // Enhanced nav scroll effect
    window.addEventListener('scroll', () => {
        const scrollTop = wrapper.scrollTop;
        if (scrollTop > 20) {
            nav.classList.add('shadow-lg');
        } else {
            nav.classList.remove('shadow-lg');
        }
    });
});

// Keep your existing toggleMobileMenu function
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
    menu.classList.toggle('animate__animated');
    menu.classList.toggle('animate__fadeInDown');
}