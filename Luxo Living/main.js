// main initialization function that sets up all features when the page loads
function initializeApp() {
    try {
        initParallaxEffects();
        initSmoothScroll();
        initBenefitsSlider();
        initDrawer();
        initAnimations();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// handles all parallax scrolling effects using gsap
function initParallaxEffects() {
    // Add GSAP dependency check
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP and/or ScrollTrigger not loaded');
        return;
    }

    // configuration array for all parallax elements
    const parallaxElements = [
        {
            // target the hero image for parallax effect
            element: "#hero img",
            // scroll trigger options for controlling the animation
            options: {
                trigger: "#hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            },
            // define the scale animation for the parallax effect
            animation: { scale: 1.1 }
        }
    ];

    // apply parallax effect to each configured element
    parallaxElements.forEach(({ element, options, animation }) => {
        gsap.to(element, {
            scrollTrigger: options,
            ...animation
        });
    });
}

// sets up smooth scrolling behavior for navigation links
function initSmoothScroll() {
    // attach click handlers to all navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
}

// handles the smooth scroll behavior when navigation links are clicked
function handleSmoothScroll(e) {
    e.preventDefault();
    // get the target section id from the href attribute
    const targetId = this.getAttribute('href');
    // Add error handling for invalid href
    if (!targetId) {
        console.warn('Invalid href attribute');
        return;
    }
    // find the target element in the document
    const target = document.querySelector(targetId);
    if (!target) {
        console.warn(`Target section ${targetId} not found`);
        return;
    }
    // smoothly scroll to the target section
    target.scrollIntoView({ behavior: 'smooth' });
}

// initializes the benefits slider functionality
function initBenefitsSlider() {
    // maintain state for the slider
    const sliderState = {
        tiles: document.querySelectorAll('.benefit-tile'),
        currentIndex: 0
    };

    // Add validation for required elements
    if (!sliderState.tiles.length) {
        console.warn('No benefit tiles found');
        return;
    }

    // store references to navigation controls
    const controls = {
        prev: document.querySelector('.prev-benefit'),
        next: document.querySelector('.next-benefit')
    };

    // Validate navigation controls
    if (!controls.prev || !controls.next) {
        console.warn('Slider navigation controls not found');
        return;
    }

    // updates the active benefit tile
    function updateBenefit(index) {
        // remove active class from all tiles
        sliderState.tiles.forEach(tile => tile.classList.remove('active'));
        // add active class to the current tile
        sliderState.tiles[index].classList.add('active');
    }

    // creates handlers for next/previous navigation
    function createNavigationHandlers() {
        return {
            // handle next button click
            next: () => {
                // calculate next index with wraparound
                sliderState.currentIndex = (sliderState.currentIndex + 1) % sliderState.tiles.length;
                updateBenefit(sliderState.currentIndex);
            },
            // handle previous button click
            prev: () => {
                // calculate previous index with wraparound
                sliderState.currentIndex = (sliderState.currentIndex - 1 + sliderState.tiles.length) % sliderState.tiles.length;
                updateBenefit(sliderState.currentIndex);
            }
        };
    }

    // set up event handlers and initial state
    const handlers = createNavigationHandlers();
    controls.prev.addEventListener('click', handlers.prev);
    controls.next.addEventListener('click', handlers.next);
    updateBenefit(sliderState.currentIndex);
}

// initializes the newsletter signup drawer functionality
function initDrawer() {
    // store references to all required elements
    const elements = {
        drawer: document.querySelector('.drawer-overview'),
        openButton: document.querySelector('#open-drawer'),
        form: document.querySelector('#newsletter-form'),
        alert: document.querySelector('#subscription-alert')
    };

    // Validate all required elements
    if (!elements.drawer || !elements.openButton || !elements.form || !elements.alert) {
        console.error('Required drawer elements not found');
        return;
    }

    // Verify required methods exist
    if (typeof elements.drawer.show !== 'function' || 
        typeof elements.drawer.hide !== 'function' || 
        typeof elements.alert.toast !== 'function') {
        console.error('Required drawer methods not available');
        return;
    }

    // attach event listeners for drawer interactions
    elements.openButton.addEventListener('click', () => elements.drawer.show());
    elements.form.addEventListener('submit', (event) => handleNewsletterSubmit(event, elements));
}

// handles the newsletter form submission
function handleNewsletterSubmit(event, elements) {
    event.preventDefault();
    // hide the drawer after submission
    elements.drawer.hide();
    // show the success toast notification
    elements.alert.toast();
    // reset the form fields
    elements.form.reset();
}

// initializes all gsap animations
function initAnimations() {
    // Add GSAP dependency check
    if (typeof gsap === 'undefined') {
        console.error('GSAP not loaded');
        return;
    }

    // configuration array for all animations
    const animations = [
        {
            // target the testimonial video section
            element: "#testimonial-video",
            // scroll trigger options for controlling when animation plays
            options: {
                trigger: "#testimonials",
                start: "top bottom",
                end: "top center",
                toggleActions: "play none none reverse"
            },
            // define the animation properties
            animation: {
                y: 100,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            }
        },
        {
            element: ".wave",
            options: {
                trigger: "#hero",
                start: "top center",
                end: "bottom center",
                toggleActions: "play pause resume reverse"
            },
            animation: {
                scaleY: 1.2,
                duration: 2,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1
            }
        }
    ];

    // apply animations to each configured element
    animations.forEach(({ element, options, animation }) => {
        gsap.from(element, {
            scrollTrigger: options,
            ...animation
        });
    });
}

// wait for dom content to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', initializeApp);
