document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. INTRO LOADER — INFINITY RING ANIMATION
    // ==========================================
    const loader       = document.getElementById("intro-loader");
    const heroContent  = document.querySelector(".hero-content");
    const ringLeft     = document.getElementById("ring-left");
    const ringRight    = document.getElementById("ring-right");
    const infinityPath = document.getElementById("infinity-path");
    const logoWrap     = document.querySelector(".loader-logo-wrap");

    function runInfinityIntro() {
        if (typeof gsap === "undefined") {
            // Fallback: just hide loader after 3s
            setTimeout(() => {
                loader.classList.add("hide");
                setTimeout(() => { loader.style.display = "none"; }, 1300);
            }, 3000);
            return;
        }

        // Set starting positions via GSAP attr (SVG-safe)
        // Rings start way off-screen left/right
        gsap.set(ringLeft,  { attr: { cx: -100 }, opacity: 0 });
        gsap.set(ringRight, { attr: { cx:  500 }, opacity: 0 });
        gsap.set(infinityPath, { opacity: 0 });

        const tl = gsap.timeline({
            onComplete: () => {
                loader.classList.add("hide");
                setTimeout(() => {
                    loader.style.display = "none";
                    if (heroContent) {
                        heroContent.style.opacity = "1";
                        heroContent.style.transform = "scale(1)";
                    }
                }, 1350);
            }
        });

        /* ---- PHASE 1: Rings fly in to their resting positions ---- */
        tl.to(ringLeft, {
            attr: { cx: 100 },
            opacity: 1,
            duration: 1.0,
            ease: "power3.out"
        }, 0.2);

        tl.to(ringRight, {
            attr: { cx: 300 },
            opacity: 1,
            duration: 1.0,
            ease: "power3.out"
        }, 0.2);

        /* ---- PHASE 2: Rings converge toward the centre ---- */
        tl.to(ringLeft, {
            attr: { cx: 150 },
            duration: 0.7,
            ease: "power2.inOut"
        }, 1.3);

        tl.to(ringRight, {
            attr: { cx: 250 },
            duration: 0.7,
            ease: "power2.inOut"
        }, 1.3);

        /* ---- PHASE 3: Rings fade out, infinity path draws in ---- */
        tl.to([ringLeft, ringRight], {
            opacity: 0,
            duration: 0.4,
            ease: "power1.in"
        }, 1.9);

        tl.to(infinityPath, {
            opacity: 1,
            strokeDashoffset: 0,
            duration: 1.15,
            ease: "power2.inOut"
        }, 1.95);

        /* ---- PHASE 4: Glow pulse ---- */
        tl.call(() => { infinityPath.classList.add("glowing"); }, [], 2.85);
        tl.to(infinityPath, {
            attr: { "stroke-width": 5 },
            duration: 0.35,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1
        }, 2.85);

        /* ---- PHASE 5: H·D logo fades in beneath infinity ---- */
        tl.call(() => { logoWrap.classList.add("visible"); }, [], 3.1);

        /* ---- PHASE 6: Hold, then exit ---- */
        tl.to({}, { duration: 1.65 });
    }

    runInfinityIntro();

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
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwZF3U-GPPNXEUIxkT7wYOV9YBBx4zyO60eTZdyDwHquoWB1detY9VdCVoH98BNdARdvA/exec";
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

            try {
                // Actual submission to Google Sheets webapp URL
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: "POST",
                    mode: "no-cors", // Required to submit cross-origin to Google Script
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                });

                formFeedback.classList.remove("hidden");
                formFeedback.classList.add("success");
                formFeedback.textContent = "Thank you! Your response has been logged successfully.";
                rsvpForm.reset();
                if (guestsCountGroup) guestsCountGroup.style.display = "flex";
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

    // ==========================================
    // 7. BACKGROUND MUSIC PLAYER & SCROLL TRIGGER
    // ==========================================
    const bgMusic = document.getElementById("bgMusic");
    const musicToggle = document.getElementById("musicToggle");

    if (bgMusic && musicToggle) {
        const musicText = musicToggle.querySelector(".music-text");
        const musicWaves = musicToggle.querySelector(".music-waves");
        const iconPlay = musicToggle.querySelector(".icon-play");
        const iconPause = musicToggle.querySelector(".icon-pause");

        bgMusic.volume = 0.4; // Soft background volume
        let isPlaying = false;

        const updateUIPlaying = () => {
            isPlaying = true;
            musicToggle.classList.add("playing");
            musicToggle.classList.remove("pulse-hint");
            if (musicText) musicText.textContent = "Music Playing";
            if (musicWaves) musicWaves.classList.remove("hidden");
            if (iconPlay) iconPlay.classList.add("hidden");
            if (iconPause) iconPause.classList.remove("hidden");
        };

        const updateUIPaused = () => {
            isPlaying = false;
            musicToggle.classList.remove("playing");
            if (musicText) musicText.textContent = "Play Music";
            if (musicWaves) musicWaves.classList.add("hidden");
            if (iconPlay) iconPlay.classList.remove("hidden");
            if (iconPause) iconPause.classList.add("hidden");
        };

        const togglePlay = () => {
            if (isPlaying) {
                bgMusic.pause();
                updateUIPaused();
            } else {
                bgMusic.play().then(() => {
                    updateUIPlaying();
                }).catch(err => {
                    console.log("Play failed on click:", err);
                });
            }
        };

        musicToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            togglePlay();
        });

        // Start music on user interaction (scroll, touch, wheel, click)
        const tryPlayAudio = () => {
            if (!isPlaying && bgMusic.paused) {
                bgMusic.play().then(() => {
                    updateUIPlaying();
                    removeAllInteractionListeners();
                }).catch(err => {
                    // Autoplay blocked by browser policy until explicit touch/click
                    musicToggle.classList.add("pulse-hint");
                });
            }
        };

        const removeAllInteractionListeners = () => {
            window.removeEventListener("scroll", tryPlayAudio);
            window.removeEventListener("wheel", tryPlayAudio);
            window.removeEventListener("touchstart", tryPlayAudio);
            window.removeEventListener("touchmove", tryPlayAudio);
            window.removeEventListener("pointerdown", tryPlayAudio);
            window.removeEventListener("click", tryPlayAudio);
        };

        // Attach listeners across user scroll & gesture events
        window.addEventListener("scroll", tryPlayAudio, { passive: true });
        window.addEventListener("wheel", tryPlayAudio, { passive: true });
        window.addEventListener("touchstart", tryPlayAudio, { passive: true });
        window.addEventListener("touchmove", tryPlayAudio, { passive: true });
        window.addEventListener("pointerdown", tryPlayAudio, { passive: true });
        window.addEventListener("click", tryPlayAudio, { passive: true });

        // Scroll indicator click
        const scrollIndicator = document.getElementById("scrollIndicator");
        if (scrollIndicator) {
            scrollIndicator.addEventListener("click", () => {
                if (!isPlaying) tryPlayAudio();
            });
        }
    }

    // ==========================================
    // 8. COLOR PALETTE THEME & LIGHT/DARK MODE SWITCHER
    // ==========================================
    const paletteToggle = document.getElementById("paletteToggle");
    const palettePanel = document.getElementById("palettePanel");
    const paletteOptions = document.querySelectorAll(".palette-option");
    const modeLightBtn = document.getElementById("modeLightBtn");
    const modeDarkBtn = document.getElementById("modeDarkBtn");

    let currentTheme = "sage-gold";
    let currentMode = "light";

    const colorThemes = {
        "sage-gold": {
            light: {
                "--bg-primary": "#FAF8F5",
                "--bg-secondary": "#F4F1EA",
                "--bg-card": "#FFFFFF",
                "--bg-navbar": "rgba(250, 248, 245, 0.95)",
                "--border-color": "rgba(197, 160, 89, 0.25)",
                "--color-sage": "#7D8C77",
                "--color-sage-light": "#A3B19B",
                "--color-sage-dark": "#586453",
                "--color-gold": "#C5A059",
                "--color-gold-light": "#E0C797",
                "--color-text-main": "#2C3539",
                "--color-text-muted": "#6B7280"
            },
            dark: {
                "--bg-primary": "#121614",
                "--bg-secondary": "#1B221E",
                "--bg-card": "#1F2722",
                "--bg-navbar": "rgba(18, 22, 20, 0.95)",
                "--border-color": "rgba(212, 175, 55, 0.3)",
                "--color-sage": "#98AA92",
                "--color-sage-light": "#BDCCB7",
                "--color-sage-dark": "#74866E",
                "--color-gold": "#D4AF37",
                "--color-gold-light": "#EBD68B",
                "--color-text-main": "#F2EFE9",
                "--color-text-muted": "#A1AEA5"
            }
        },
        "rose-copper": {
            light: {
                "--bg-primary": "#FAF6F5",
                "--bg-secondary": "#F4ECE9",
                "--bg-card": "#FFFFFF",
                "--bg-navbar": "rgba(250, 246, 245, 0.95)",
                "--border-color": "rgba(200, 147, 85, 0.25)",
                "--color-sage": "#A67B78",
                "--color-sage-light": "#CBB1AF",
                "--color-sage-dark": "#6E4D4A",
                "--color-gold": "#C89355",
                "--color-gold-light": "#E5C9A6",
                "--color-text-main": "#332A29",
                "--color-text-muted": "#736563"
            },
            dark: {
                "--bg-primary": "#1A1414",
                "--bg-secondary": "#241C1C",
                "--bg-card": "#2D2323",
                "--bg-navbar": "rgba(26, 20, 20, 0.95)",
                "--border-color": "rgba(224, 170, 111, 0.3)",
                "--color-sage": "#C69895",
                "--color-sage-light": "#DFC1BF",
                "--color-sage-dark": "#A17370",
                "--color-gold": "#E0AA6F",
                "--color-gold-light": "#F2CFA5",
                "--color-text-main": "#F7EFEB",
                "--color-text-muted": "#BBA9A7"
            }
        },
        "emerald-gold": {
            light: {
                "--bg-primary": "#F6FAF8",
                "--bg-secondary": "#EAF2EE",
                "--bg-card": "#FFFFFF",
                "--bg-navbar": "rgba(246, 250, 248, 0.95)",
                "--border-color": "rgba(212, 175, 55, 0.25)",
                "--color-sage": "#4E7C69",
                "--color-sage-light": "#83AA9A",
                "--color-sage-dark": "#2C4F41",
                "--color-gold": "#D4AF37",
                "--color-gold-light": "#EBD68B",
                "--color-text-main": "#1F2E2B",
                "--color-text-muted": "#526662"
            },
            dark: {
                "--bg-primary": "#0D1714",
                "--bg-secondary": "#14241F",
                "--bg-card": "#1A2E28",
                "--bg-navbar": "rgba(13, 23, 20, 0.95)",
                "--border-color": "rgba(229, 193, 88, 0.3)",
                "--color-sage": "#649E87",
                "--color-sage-light": "#9CC2B3",
                "--color-sage-dark": "#477864",
                "--color-gold": "#E5C158",
                "--color-gold-light": "#F5DC8C",
                "--color-text-main": "#EBF5F1",
                "--color-text-muted": "#93B2A6"
            }
        },
        "eucalyptus-sand": {
            light: {
                "--bg-primary": "#F8F7F3",
                "--bg-secondary": "#EEECE4",
                "--bg-card": "#FFFFFF",
                "--bg-navbar": "rgba(248, 247, 243, 0.95)",
                "--border-color": "rgba(184, 151, 108, 0.25)",
                "--color-sage": "#5B7065",
                "--color-sage-light": "#91A399",
                "--color-sage-dark": "#37473F",
                "--color-gold": "#B8976C",
                "--color-gold-light": "#DCC5A8",
                "--color-text-main": "#29302B",
                "--color-text-muted": "#616B64"
            },
            dark: {
                "--bg-primary": "#141816",
                "--bg-secondary": "#1E2421",
                "--bg-card": "#252D29",
                "--bg-navbar": "rgba(20, 24, 22, 0.95)",
                "--border-color": "rgba(209, 178, 138, 0.3)",
                "--color-sage": "#768E81",
                "--color-sage-light": "#A7B8AF",
                "--color-sage-dark": "#55685E",
                "--color-gold": "#D1B28A",
                "--color-gold-light": "#E8D5BC",
                "--color-text-main": "#EEF0ED",
                "--color-text-muted": "#9FAEA6"
            }
        },
        "burgundy-champagne": {
            light: {
                "--bg-primary": "#FAF6F7",
                "--bg-secondary": "#F2EAEB",
                "--bg-card": "#FFFFFF",
                "--bg-navbar": "rgba(250, 246, 247, 0.95)",
                "--border-color": "rgba(203, 163, 88, 0.25)",
                "--color-sage": "#803B43",
                "--color-sage-light": "#B57B82",
                "--color-sage-dark": "#522127",
                "--color-gold": "#CBA358",
                "--color-gold-light": "#E8D4A2",
                "--color-text-main": "#302325",
                "--color-text-muted": "#6E5A5D"
            },
            dark: {
                "--bg-primary": "#170F11",
                "--bg-secondary": "#24181B",
                "--bg-card": "#2D1F23",
                "--bg-navbar": "rgba(23, 15, 17, 0.95)",
                "--border-color": "rgba(223, 192, 123, 0.3)",
                "--color-sage": "#A8525D",
                "--color-sage-light": "#C9868F",
                "--color-sage-dark": "#843842",
                "--color-gold": "#DFC07B",
                "--color-gold-light": "#F2DEC2",
                "--color-text-main": "#FAF0F2",
                "--color-text-muted": "#BFA8AC"
            }
        }
    };

    const applyTheme = (themeName, modeName) => {
        if (colorThemes[themeName] && colorThemes[themeName][modeName]) {
            const props = colorThemes[themeName][modeName];
            const root = document.documentElement;

            Object.keys(props).forEach(key => {
                root.style.setProperty(key, props[key]);
            });

            if (modeName === "dark") {
                document.body.classList.add("dark-mode");
            } else {
                document.body.classList.remove("dark-mode");
            }
        }
    };

    if (paletteToggle && palettePanel) {
        paletteToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            palettePanel.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
            if (!palettePanel.contains(e.target) && e.target !== paletteToggle) {
                palettePanel.classList.remove("active");
            }
        });

        paletteOptions.forEach(opt => {
            opt.addEventListener("click", () => {
                const themeKey = opt.getAttribute("data-theme");
                if (colorThemes[themeKey]) {
                    currentTheme = themeKey;
                    applyTheme(currentTheme, currentMode);

                    paletteOptions.forEach(o => o.classList.remove("active"));
                    opt.classList.add("active");
                }
            });
        });

        if (modeLightBtn && modeDarkBtn) {
            modeLightBtn.addEventListener("click", () => {
                currentMode = "light";
                modeLightBtn.classList.add("active");
                modeDarkBtn.classList.remove("active");
                applyTheme(currentTheme, currentMode);
            });

            modeDarkBtn.addEventListener("click", () => {
                currentMode = "dark";
                modeDarkBtn.classList.add("active");
                modeLightBtn.classList.remove("active");
                applyTheme(currentTheme, currentMode);
            });
        }
    }
});
