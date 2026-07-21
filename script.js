document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. INTRO LOADER SEQUENCE
    // ==========================================
    const loader = document.getElementById("intro-loader");
    const mainContent = document.getElementById("main-content");
    const heroContent = document.querySelector(".hero-content");

    // Hide loader after logo animation completes (approx 2.8s)
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";

            // Once loader fades, trigger hero animations
            setTimeout(() => {
                loader.style.display = "none";
                if (heroContent) {
                    heroContent.style.opacity = "1";
                    heroContent.style.transform = "scale(1)";
                }
            }, 800); // match transition duration
        }
    }, 2800);

    // ==========================================
    // 2. MOBILE MENU & NAVIGATION
    // ==========================================
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navbar = document.querySelector(".navbar");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll("a");
        links.forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }

    // Scroll Navbar effect
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // ==========================================
    // 3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll(".story-card, .gallery-item");

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animated");
                observer.unobserve(entry.target); // Animates only once
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // viewport
        threshold: 0.15, // trigger when 15% visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 4. COUNTDOWN TIMER
    // ==========================================
    // Wedding Date: January 24th, 2027
    const weddingDate = new Date("Jan 24, 2027 00:00:00").getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const difference = weddingDate - now;

        // If wedding date has passed
        if (difference < 0) {
            document.getElementById("timer").innerHTML = `
                <div class="timer-block" style="grid-column: span 4; width: 100%;">
                    <span class="number" style="font-size: 2.2rem; font-family: var(--font-serif);">We are happily married!</span>
                </div>
            `;
            clearInterval(timerInterval);
            return;
        }

        // Time calculations
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Format to always display double digits
        document.getElementById("days").innerText = String(days).padStart(2, "0");
        document.getElementById("hours").innerText = String(hours).padStart(2, "0");
        document.getElementById("minutes").innerText = String(minutes).padStart(2, "0");
        document.getElementById("seconds").innerText = String(seconds).padStart(2, "0");
    };

    // Run timer immediately and then every second
    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000);

    // ==========================================
    // 5. RSVP FORM HANDLING WITH GOOGLE SPREADSHEET
    // ==========================================
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzZmuXYf7iYdHSsAUjCDhj46lynMb-_HyPK_F_DgVWNOopsnyfvejB5RJ_hDYwKb5XbBw/exec"
    const rsvpForm = document.getElementById("rsvpForm");
    const guestsCountGroup = document.getElementById("guestsCountGroup");
    const guestAttendance = document.getElementById("guestAttendance");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn.querySelector(".btn-text");
    const spinner = submitBtn.querySelector(".spinner");
    const formFeedback = document.getElementById("formFeedback");

    // Show/hide number of guests depending on attendance option
    if (guestAttendance && guestsCountGroup) {
        guestAttendance.addEventListener("change", (e) => {
            if (e.target.value === "No") {
                guestsCountGroup.style.display = "none";
                document.getElementById("guestsCount").value = "0";
            } else {
                guestsCountGroup.style.display = "flex";
                document.getElementById("guestsCount").value = "1";
            }
        });
    }

    if (rsvpForm) {
        rsvpForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Set loading state
            submitBtn.disabled = true;
            btnText.textContent = "Sending...";
            spinner.classList.remove("hidden");
            formFeedback.classList.add("hidden");
            formFeedback.className = "form-feedback"; // reset classes

            const formData = new FormData(rsvpForm);

            // Format data for request
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Note: Replace this URL placeholder with the deployment Apps Script Web App URL
            // Instructions for setting up are in the project's README.md
            const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/PLACEHOLDER_WEBAPP_ID/exec";

            try {
                // If the URL is still placeholder, mock successful response for demonstration
                if (GOOGLE_SCRIPT_URL.includes("PLACEHOLDER_WEBAPP_ID")) {
                    await new Promise(resolve => setTimeout(resolve, 1500)); // mock network lag
                    console.log("Mock RSVP data submitted:", data);

                    formFeedback.classList.remove("hidden");
                    formFeedback.classList.add("success");
                    formFeedback.textContent = "Thank you! Your response has been joyfully received.";

                    rsvpForm.reset();
                    if (guestsCountGroup) guestsCountGroup.style.display = "flex";
                } else {
                    // Actual submission to Google Sheets webapp URL
                    const response = await fetch(GOOGLE_SCRIPT_URL, {
                        method: "POST",
                        mode: "no-cors", // Required to submit cross-origin to Google Script
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    });

                    formFeedback.classList.remove("hidden");
                    formFeedback.classList.add("success");
                    formFeedback.textContent = "Thank you! Your response has been logged successfully.";
                    rsvpForm.reset();
                    if (guestsCountGroup) guestsCountGroup.style.display = "flex";
                }
            } catch (error) {
                console.error("Error submitting RSVP:", error);
                formFeedback.classList.remove("hidden");
                formFeedback.classList.add("error");
                formFeedback.textContent = "Oops! Something went wrong. Please try again or contact us directly.";
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                btnText.textContent = "Submit RSVP";
                spinner.classList.add("hidden");
            }
        });
    }

    // ==========================================
    // 6. GSAP PARALLAX EFFECTS (Optional Enhancement)
    // ==========================================
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // Slow parallax movement for artistic frames in story
        gsap.to(".frame-left", {
            yPercent: -15,
            ease: "none",
            scrollTrigger: {
                trigger: "#story",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        gsap.to(".frame-right", {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: "#story",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Soft fade parallax for hero name text
        gsap.to(".hero-content", {
            opacity: 0,
            y: -50,
            ease: "none",
            scrollTrigger: {
                trigger: "#hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }
});
