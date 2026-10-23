document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. INTRO LOADER — WEDDING RINGS → INFINITY + BEAUTIFUL SNOWFALL
    // ==========================================
    const loader         = document.getElementById("intro-loader");
    const heroContent    = document.querySelector(".hero-content");
    const gRingLeft      = document.getElementById("g-ring-left");
    const gRingRight     = document.getElementById("g-ring-right");
    const gRingRightFront = document.getElementById("g-ring-right-front");
    const infinityPath   = document.getElementById("infinity-path");
    const logoWrap       = document.querySelector(".loader-logo-wrap");
    const snowCanvas     = document.getElementById("snow-canvas");

    // ── Snowfall Canvas Particle Engine ──
    let snowAnimId = null;
    function initSnowfall() {
        if (!snowCanvas) return;
        const ctx = snowCanvas.getContext("2d");
        let width = snowCanvas.width = window.innerWidth;
        let height = snowCanvas.height = window.innerHeight;

        window.addEventListener("resize", () => {
            if (!snowCanvas) return;
            width = snowCanvas.width = window.innerWidth;
            height = snowCanvas.height = window.innerHeight;
        });

        const particleCount = Math.min(120, Math.floor(width / 11));
        const flakes = [];

        for (let i = 0; i < particleCount; i++) {
            flakes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 3.2 + 0.8,
                d: Math.random() * particleCount,
                opacity: Math.random() * 0.75 + 0.25,
                speedY: Math.random() * 1.2 + 0.6,
                swaySpeed: Math.random() * 0.02 + 0.005,
                swayOffset: Math.random() * Math.PI * 2,
                glow: Math.random() > 0.4
            });
        }

        let angle = 0;
        function renderSnow() {
            ctx.clearRect(0, 0, width, height);
            angle += 0.01;

            for (let i = 0; i < flakes.length; i++) {
                const f = flakes[i];
                f.y += f.speedY;
                f.x += Math.sin(angle + f.swayOffset) * 0.8;

                if (f.y > height) {
                    f.y = -10;
                    f.x = Math.random() * width;
                }

                ctx.beginPath();
                ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, false);
                ctx.shadowBlur = 0;
                ctx.fillStyle = `rgba(180, 190, 195, ${f.opacity * 0.55})`;
                ctx.fill();
            }

            snowAnimId = requestAnimationFrame(renderSnow);
        }

        renderSnow();
    }

    initSnowfall();

    function runSnowfallLogoIntro() {
        const infinitySymbol = document.querySelector(".infinity-symbol");
        const infinityPath   = document.querySelector(".infinity-path");
        const wishText       = document.querySelector(".wish-text");

        // ── ABSOLUTE FAILSAFE: Hide loader after 5s no matter what ──
        // This prevents the loader from blocking all page content if GSAP
        // fails, the tab is backgrounded, or onComplete never fires.
        const FAILSAFE_MS = 5000;
        const failsafeTimer = setTimeout(() => {
            if (loader && !loader.classList.contains("hide")) {
                loader.style.display = "none";
                if (snowAnimId) cancelAnimationFrame(snowAnimId);
            }
        }, FAILSAFE_MS);

        if (!loader || !logoWrap) {
            clearTimeout(failsafeTimer);
            return;
        }

        const finishIntro = () => {
            clearTimeout(failsafeTimer);
            loader.classList.add("hide");
            setTimeout(() => {
                loader.style.display = "none";
                if (snowAnimId) cancelAnimationFrame(snowAnimId);
            }, 800);
        };

        if (typeof gsap === "undefined") {
            // GSAP not loaded — show everything instantly and dismiss quickly
            if(infinitySymbol) infinitySymbol.style.opacity = "1";
            if(wishText) wishText.style.opacity = "1";
            logoWrap.style.opacity = "1";
            logoWrap.style.transform = "scale(1) translateY(0)";
            setTimeout(finishIntro, 1500);
            return;
        }

        // Elements start invisible for the animated entrance
        gsap.set(logoWrap, { opacity: 0, scale: 0.95, y: 15 });
        if(infinitySymbol) gsap.set(infinitySymbol, { opacity: 0, scale: 1.2 });
        if(wishText) gsap.set(wishText, { opacity: 0, y: -12, scale: 0.95 });
        if(infinityPath) gsap.set(infinityPath, { strokeDasharray: 300, strokeDashoffset: 300 });

        const tl = gsap.timeline({ onComplete: finishIntro });

        // All elements reveal quickly and together
        if(infinitySymbol) tl.to(infinitySymbol, { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" }, 0);
        if(infinityPath)   tl.to(infinityPath, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 0);
        if(wishText)       tl.to(wishText, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power2.out" }, 0.1);
        tl.to(logoWrap, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.2);

        // Brief hold, then dismiss
        tl.to({}, { duration: 1.2 });
    }

    runSnowfallLogoIntro();



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
    const revealElements = document.querySelectorAll(".story-card, .gallery-card, .film-frame-card");

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
    // 3b. STORY FRAME TAP-TO-FRONT (Mobile)
    // ==========================================
    const frameLeft  = document.getElementById("frameLeft");
    const frameRight = document.getElementById("frameRight");

    function bringToFront(activeFrame, otherFrame) {
        activeFrame.style.zIndex  = "5";
        otherFrame.style.zIndex   = "1";
        activeFrame.style.transform = "scale(1.04) rotate(0deg)";
    }

    if (frameLeft && frameRight) {
        frameLeft.addEventListener("click", () => {
            bringToFront(frameLeft, frameRight);
            setTimeout(() => { frameLeft.style.transform = ""; }, 600);
        });
        frameLeft.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") frameLeft.click(); });

        frameRight.addEventListener("click", () => {
            bringToFront(frameRight, frameLeft);
            setTimeout(() => { frameRight.style.transform = ""; }, 600);
        });
        frameRight.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") frameRight.click(); });
    }

    // ==========================================
    // 3c. INTERACTIVE PRE-WEDDING GALLERY & LIGHTBOX ENGINE
    // ==========================================
    const galleryData = [
        {
            index: 0,
            src: "assets/shoot_placeholder_1.png",
            title: "Living With You Is Pure Bliss",
            tamil: "உன்னோடு வாழ்வது ஆனந்தமே",
            subtitle: "Our Signature Portrait • Hari & Diya",
            desc: "The hand-illustrated signature moment capturing our shared smiles, warmth, and lifelong promise.",
            location: "Signature Studio, Chennai",
            date: "Our 11:11 Wish",
            category: "heritage",
            categoryLabel: "Heritage & Grace",
            hearts: 142
        },
        {
            index: 1,
            src: "assets/shoot_photo_beach.jpg",
            title: "Golden Hour Whispers",
            tamil: "",
            subtitle: "Barefoot laughter as the evening tide welcomes our forever",
            desc: "Walking along the golden shore, our hearts matching the rhythmic rise and fall of the gentle evening waves.",
            location: "Marina Coastal Shore",
            date: "Dusk Glow",
            category: "nature",
            categoryLabel: "Nature & Shores",
            hearts: 98
        },
        {
            index: 2,
            src: "assets/shoot_photo_hills.jpg",
            title: "Munnar Whispers",
            tamil: "",
            subtitle: "Wrapped in emerald plantations & crisp mountain breeze",
            desc: "Standing atop misty rolling hills in Munnar, surrounded by lush tea shrubs under soft morning sunbeams.",
            location: "Munnar High Range, Kerala",
            date: "Mountain Sunrise",
            category: "nature",
            categoryLabel: "Nature & Shores",
            hearts: 115
        },
        {
            index: 3,
            src: "assets/shoot_photo_heritage.jpg",
            title: "A Royal Heritage Reflection",
            tamil: "",
            subtitle: "Illuminated by brass diyas in an antique Chettinad courtyard",
            desc: "Carved wooden pillars, fragrant white jasmine blossoms, rich Kanchipuram silk, and the timeless glow of oil lamps.",
            location: "Chettinad Heritage Courtyard",
            date: "Twilight Diyas",
            category: "heritage",
            categoryLabel: "Heritage & Grace",
            hearts: 136
        },
        {
            index: 4,
            src: "assets/shoot_photo_boat.jpg",
            title: "Drifting Into Forever",
            tamil: "",
            subtitle: "Lotus petals and marigold garlands over tranquil waters",
            desc: "A romantic canoe ride across calm backwaters as the setting sun painted ripples of amber and gold.",
            location: "Vembanad Backwaters, Kerala",
            date: "Golden Twilight",
            category: "nature",
            categoryLabel: "Nature & Shores",
            hearts: 88
        },
        {
            index: 5,
            src: "assets/shoot_photo_lane.jpg",
            title: "Bougainvillea Lane",
            tamil: "",
            subtitle: "Sunlight filtering through vibrant magenta petals",
            desc: "Hand-in-hand strolls along quiet historic cobblestone paths, where every flower bloomed for our love story.",
            location: "Pondicherry White Town",
            date: "Warm Afternoon",
            category: "candid",
            categoryLabel: "Candid & Romance",
            hearts: 104
        },
        {
            index: 6,
            src: "assets/shoot_photo_ring.jpg",
            title: "A Promise Sealed in Gold",
            tamil: "",
            subtitle: "Intertwined hands, the solitaire diamond & bridal mehendi",
            desc: "Delicate henna motifs, sparkling facets, and the sacred warmth of fingers that fit together perfectly.",
            location: "The Sacred Vow Ceremony",
            date: "Intimate Promise",
            category: "candid",
            categoryLabel: "Candid & Romance",
            hearts: 158
        },
        {
            index: 7,
            src: "assets/shoot_placeholder_4.png",
            title: "Sunlit Canopy",
            tamil: "",
            subtitle: "Walking into the light under towering evergreens",
            desc: "Stepping together along sun-dappled trails, trusting each stride as our shadows merged into one.",
            location: "Pine Forest Trail",
            date: "Enchanted Woods",
            category: "nature",
            categoryLabel: "Nature & Shores",
            hearts: 82
        },
        {
            index: 8,
            src: "assets/shoot_placeholder_3.png",
            title: "Entwined in Gold",
            tamil: "",
            subtitle: "Fine art botanical illustration of sacred touch",
            desc: "Olive leaves, gold dust, and joined palms representing enduring tranquility, friendship, and peace.",
            location: "Artistic Keepsake",
            date: "Fine Art Watercolor",
            category: "candid",
            categoryLabel: "Candid & Romance",
            hearts: 89
        },
        {
            index: 9,
            src: "assets/shoot_placeholder_2.png",
            title: "Under the Eternal Banyan",
            tamil: "",
            subtitle: "Rooted deep in love, reaching into tomorrow's sky",
            desc: "Embraced beneath the grand sheltering branches of eternity, where our 11:11 wishes came true.",
            location: "Sacred Grove Sanctuary",
            date: "Golden Sunset",
            category: "heritage",
            categoryLabel: "Heritage & Grace",
            hearts: 129
        }
    ];

    // Load persisted likes from sessionStorage
    const savedLikes = JSON.parse(sessionStorage.getItem("wedding_gallery_likes") || "{}");
    galleryData.forEach(item => {
        if (savedLikes[item.index] !== undefined) {
            item.hearts = savedLikes[item.index].count;
            item.liked = savedLikes[item.index].liked;
        }
    });

    // Populate Cinematic Film Reel
    const filmReelTrack = document.getElementById("filmReelTrack");
    if (filmReelTrack) {
        filmReelTrack.innerHTML = galleryData.map((item, idx) => `
            <div class="film-frame-card" data-index="${idx}" data-category="${item.category}">
                <div class="film-frame-header">
                    <span>FRAME #${String(idx + 1).padStart(2, "0")}</span>
                    <span>${item.categoryLabel}</span>
                </div>
                <div class="film-frame-img-box">
                    <img src="${item.src}" alt="${item.title}" loading="lazy">
                </div>
                <div class="film-frame-body">
                    <h4>${item.title}</h4>
                    <p>${item.subtitle}</p>
                </div>
            </div>
        `).join("");
    }

    // View Switcher (Lookbook vs Film Reel)
    const viewShowcaseBtn = document.getElementById("viewShowcaseBtn");
    const viewReelBtn = document.getElementById("viewReelBtn");
    const galleryShowcaseView = document.getElementById("galleryShowcaseView");
    const galleryReelView = document.getElementById("galleryReelView");

    function setGalleryView(mode) {
        if (mode === "reel") {
            if (viewReelBtn) {
                viewReelBtn.classList.add("active");
                viewReelBtn.setAttribute("aria-pressed", "true");
            }
            if (viewShowcaseBtn) {
                viewShowcaseBtn.classList.remove("active");
                viewShowcaseBtn.setAttribute("aria-pressed", "false");
            }
            if (galleryShowcaseView) {
                galleryShowcaseView.classList.remove("active-view");
                galleryShowcaseView.classList.add("hidden-view");
            }
            if (galleryReelView) {
                galleryReelView.classList.remove("hidden-view");
                galleryReelView.classList.add("active-view");
            }
        } else {
            if (viewShowcaseBtn) {
                viewShowcaseBtn.classList.add("active");
                viewShowcaseBtn.setAttribute("aria-pressed", "true");
            }
            if (viewReelBtn) {
                viewReelBtn.classList.remove("active");
                viewReelBtn.setAttribute("aria-pressed", "false");
            }
            if (galleryReelView) {
                galleryReelView.classList.remove("active-view");
                galleryReelView.classList.add("hidden-view");
            }
            if (galleryShowcaseView) {
                galleryShowcaseView.classList.remove("hidden-view");
                galleryShowcaseView.classList.add("active-view");
            }
        }
    }

    if (viewShowcaseBtn) viewShowcaseBtn.addEventListener("click", () => setGalleryView("lookbook"));
    if (viewReelBtn) viewReelBtn.addEventListener("click", () => setGalleryView("reel"));

    // Category Filter Tabs
    const galleryTabs = document.querySelectorAll(".gallery-tab");
    const lookbookCards = document.querySelectorAll(".gallery-card");
    const filmFrameCards = document.querySelectorAll(".film-frame-card");

    galleryTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            galleryTabs.forEach(t => {
                t.classList.remove("active");
                t.setAttribute("aria-selected", "false");
            });
            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");

            const filter = tab.getAttribute("data-filter");

            lookbookCards.forEach(card => {
                const cardCat = card.getAttribute("data-category");
                if (filter === "all" || cardCat === filter) {
                    card.classList.remove("filtered-out");
                } else {
                    card.classList.add("filtered-out");
                }
            });

            filmFrameCards.forEach(card => {
                const cardCat = card.getAttribute("data-category");
                if (filter === "all" || cardCat === filter) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // Reel Track Scrolling & Counter
    const reelPrevBtn = document.getElementById("reelPrevBtn");
    const reelNextBtn = document.getElementById("reelNextBtn");
    const reelCounter = document.getElementById("reelCounter");

    if (filmReelTrack && reelCounter) {
        const updateReelCounter = () => {
            const cards = Array.from(filmReelTrack.querySelectorAll(".film-frame-card")).filter(c => c.style.display !== "none");
            if (cards.length === 0) return;
            const scrollLeft = filmReelTrack.scrollLeft;
            const cardWidth = cards[0].offsetWidth + 28; // gap
            const currentIdx = Math.min(cards.length - 1, Math.max(0, Math.round(scrollLeft / cardWidth)));
            reelCounter.textContent = `${String(currentIdx + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
        };

        filmReelTrack.addEventListener("scroll", updateReelCounter, { passive: true });

        if (reelPrevBtn) {
            reelPrevBtn.addEventListener("click", () => {
                const cardWidth = filmReelTrack.querySelector(".film-frame-card")?.offsetWidth || 320;
                filmReelTrack.scrollBy({ left: -(cardWidth + 28), behavior: "smooth" });
            });
        }

        if (reelNextBtn) {
            reelNextBtn.addEventListener("click", () => {
                const cardWidth = filmReelTrack.querySelector(".film-frame-card")?.offsetWidth || 320;
                filmReelTrack.scrollBy({ left: (cardWidth + 28), behavior: "smooth" });
            });
        }
    }

    // Heart Particle Burst Animation Helper
    function spawnFloatingHeart(clientX, clientY) {
        const heart = document.createElement("div");
        heart.className = "floating-heart-particle";
        heart.textContent = ["❤️", "💖", "✨", "💕", "🤍"][Math.floor(Math.random() * 5)];
        heart.style.left = `${clientX}px`;
        heart.style.top = `${clientY}px`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1200);
    }

    // Heart Reactions Handler
    function handlePhotoLike(index, clientX, clientY) {
        const item = galleryData[index];
        if (!item) return;

        item.hearts += 1;
        item.liked = true;

        // Persist
        savedLikes[index] = { count: item.hearts, liked: true };
        sessionStorage.setItem("wedding_gallery_likes", JSON.stringify(savedLikes));

        // Update Card Heart Buttons
        const cardHeartBtn = document.querySelector(`.card-heart-btn[data-index="${index}"]`);
        if (cardHeartBtn) {
            cardHeartBtn.classList.add("liked");
            const countEl = cardHeartBtn.querySelector(".heart-count");
            if (countEl) countEl.textContent = item.hearts;
        }

        // Update Lightbox Button if open
        const lightboxLikeBtn = document.getElementById("lightboxLikeBtn");
        const lightboxLikeCount = document.getElementById("lightboxLikeCount");
        if (lightboxLikeBtn && currentLightboxIdx === index) {
            lightboxLikeBtn.classList.add("liked");
            if (lightboxLikeCount) lightboxLikeCount.textContent = item.hearts;
        }

        // Spawn visual particle
        if (clientX && clientY) {
            spawnFloatingHeart(clientX, clientY);
            setTimeout(() => spawnFloatingHeart(clientX + 20, clientY - 10), 100);
            setTimeout(() => spawnFloatingHeart(clientX - 20, clientY - 15), 200);
        }
    }

    // Card Heart Button Clicks
    document.querySelectorAll(".card-heart-btn").forEach(btn => {
        const idx = parseInt(btn.getAttribute("data-index"), 10);
        // Apply initial state
        if (galleryData[idx] && galleryData[idx].liked) {
            btn.classList.add("liked");
            const countEl = btn.querySelector(".heart-count");
            if (countEl) countEl.textContent = galleryData[idx].hearts;
        }

        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const rect = btn.getBoundingClientRect();
            handlePhotoLike(idx, rect.left + rect.width / 2, rect.top);
        });
    });

    // Double Tap / Double Click on Gallery Cards to Like
    let lastTapTime = 0;
    document.querySelectorAll(".gallery-card, .film-frame-card").forEach(card => {
        const idx = parseInt(card.getAttribute("data-index"), 10);

        // Desktop Double Click
        card.addEventListener("dblclick", (e) => {
            handlePhotoLike(idx, e.clientX, e.clientY);
        });

        // Mobile Double Tap
        card.addEventListener("touchend", (e) => {
            const currentTime = new Date().getTime();
            const tapGap = currentTime - lastTapTime;
            if (tapGap < 350 && tapGap > 0) {
                const touch = e.changedTouches[0];
                handlePhotoLike(idx, touch.clientX, touch.clientY);
                e.preventDefault();
            }
            lastTapTime = currentTime;
        });
    });

    // ==========================================
    // 3d. LUXURY LIGHTBOX MODAL
    // ==========================================
    const lightboxModal      = document.getElementById("photoLightboxModal");
    const lightboxBackdrop   = document.getElementById("lightboxBackdrop");
    const lightboxCloseBtn   = document.getElementById("lightboxCloseBtn");
    const lightboxPrevBtn    = document.getElementById("lightboxPrevBtn");
    const lightboxNextBtn    = document.getElementById("lightboxNextBtn");
    const lightboxImg        = document.getElementById("lightboxImg");
    const lightboxBadge      = document.getElementById("lightboxBadge");
    const lightboxCounter    = document.getElementById("lightboxCounter");
    const lightboxTamil      = document.getElementById("lightboxTamil");
    const lightboxTitle      = document.getElementById("lightboxTitle");
    const lightboxDesc       = document.getElementById("lightboxDesc");
    const lightboxLocation   = document.getElementById("lightboxLocation");
    const lightboxDate       = document.getElementById("lightboxDate");
    const lightboxLikeBtn    = document.getElementById("lightboxLikeBtn");
    const lightboxLikeCount  = document.getElementById("lightboxLikeCount");
    const lightboxThumbs     = document.getElementById("lightboxThumbs");
    const lightboxFigure     = document.querySelector(".lightbox-figure");
    const lightboxFloatingHeart = document.getElementById("lightboxFloatingHeart");

    let currentLightboxIdx = 0;

    // Build bottom thumbnail strip
    if (lightboxThumbs) {
        lightboxThumbs.innerHTML = galleryData.map((item, i) => `
            <div class="lightbox-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
                <img src="${item.src}" alt="${item.title}">
            </div>
        `).join("");

        lightboxThumbs.querySelectorAll(".lightbox-thumb").forEach(thumb => {
            thumb.addEventListener("click", () => {
                const idx = parseInt(thumb.getAttribute("data-index"), 10);
                openLightboxAt(idx);
            });
        });
    }

    function openLightboxAt(index) {
        currentLightboxIdx = (index + galleryData.length) % galleryData.length;
        const item = galleryData[currentLightboxIdx];

        if (lightboxImg) {
            lightboxImg.style.opacity = "0.3";
            lightboxImg.src = item.src;
            lightboxImg.onload = () => { lightboxImg.style.opacity = "1"; };
        }

        if (lightboxBadge)    lightboxBadge.textContent    = item.categoryLabel;
        if (lightboxCounter)  lightboxCounter.textContent  = `${String(currentLightboxIdx + 1).padStart(2, "0")} / ${String(galleryData.length).padStart(2, "0")}`;
        if (lightboxTamil) {
            lightboxTamil.textContent = item.tamil || "";
            lightboxTamil.style.display = item.tamil ? "block" : "none";
        }
        if (lightboxTitle)    lightboxTitle.textContent    = item.title;
        if (lightboxDesc)     lightboxDesc.textContent     = item.desc;
        if (lightboxLocation) lightboxLocation.textContent = item.location;
        if (lightboxDate)     lightboxDate.textContent     = item.date;

        if (lightboxLikeBtn && lightboxLikeCount) {
            lightboxLikeCount.textContent = item.hearts;
            if (item.liked) {
                lightboxLikeBtn.classList.add("liked");
            } else {
                lightboxLikeBtn.classList.remove("liked");
            }
        }

        // Highlight active thumbnail
        if (lightboxThumbs) {
            const thumbs = lightboxThumbs.querySelectorAll(".lightbox-thumb");
            thumbs.forEach((t, i) => {
                if (i === currentLightboxIdx) {
                    t.classList.add("active");
                    t.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                } else {
                    t.classList.remove("active");
                }
            });
        }

        if (lightboxModal) {
            lightboxModal.classList.remove("hidden");
            lightboxModal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden"; // Prevent background scroll
        }
    }

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.add("hidden");
            lightboxModal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
        }
    }

    // Attach click triggers to open lightbox
    document.querySelectorAll(".gallery-card, .film-frame-card").forEach(el => {
        el.addEventListener("click", (e) => {
            // Avoid triggering when clicking heart button directly
            if (e.target.closest(".card-heart-btn")) return;
            const idx = parseInt(el.getAttribute("data-index"), 10);
            openLightboxAt(idx);
        });
    });

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener("click", closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);

    if (lightboxPrevBtn) lightboxPrevBtn.addEventListener("click", () => openLightboxAt(currentLightboxIdx - 1));
    if (lightboxNextBtn) lightboxNextBtn.addEventListener("click", () => openLightboxAt(currentLightboxIdx + 1));

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (!lightboxModal || lightboxModal.classList.contains("hidden")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") openLightboxAt(currentLightboxIdx - 1);
        if (e.key === "ArrowRight") openLightboxAt(currentLightboxIdx + 1);
    });

    // Lightbox Modal Like Button
    if (lightboxLikeBtn) {
        lightboxLikeBtn.addEventListener("click", (e) => {
            const rect = lightboxLikeBtn.getBoundingClientRect();
            handlePhotoLike(currentLightboxIdx, rect.left + rect.width / 2, rect.top);
        });
    }

    // Double tap on Lightbox figure
    if (lightboxFigure) {
        let lastLbTap = 0;
        lightboxFigure.addEventListener("touchend", (e) => {
            const now = new Date().getTime();
            if (now - lastLbTap < 350) {
                const touch = e.changedTouches[0];
                handlePhotoLike(currentLightboxIdx, touch.clientX, touch.clientY);
                if (lightboxFloatingHeart) {
                    lightboxFloatingHeart.classList.add("show");
                    setTimeout(() => lightboxFloatingHeart.classList.remove("show"), 600);
                }
                e.preventDefault();
            }
            lastLbTap = now;
        });

        // Touch swipe gestures for mobile lightbox
        let touchStartX = 0;
        let touchEndX = 0;

        lightboxFigure.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightboxFigure.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diffX = touchEndX - touchStartX;
            if (Math.abs(diffX) > 45) {
                if (diffX < 0) {
                    openLightboxAt(currentLightboxIdx + 1); // Swipe left -> Next
                } else {
                    openLightboxAt(currentLightboxIdx - 1); // Swipe right -> Prev
                }
            }
        }, { passive: true });
    }

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
    // 5. RSVP FORM HANDLING, PHOTO UPLOAD & WEDDING PASS GENERATION
    // ==========================================
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwZF3U-GPPNXEUIxkT7wYOV9YBBx4zyO60eTZdyDwHquoWB1detY9VdCVoH98BNdARdvA/exec";
    const rsvpForm = document.getElementById("rsvpForm");
    const guestsCountGroup = document.getElementById("guestsCountGroup");
    const guestAttendance = document.getElementById("guestAttendance");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn.querySelector(".btn-text");
    const spinner = submitBtn.querySelector(".spinner");
    const formFeedback = document.getElementById("formFeedback");

    // Photo Upload Handling
    const guestPhotoInput = document.getElementById("guestPhoto");
    const photoDropZone = document.getElementById("photoDropZone");
    const photoPlaceholder = document.getElementById("photoPlaceholder");
    const guestPhotoPreview = document.getElementById("guestPhotoPreview");
    let currentPhotoDataUrl = null;

    if (guestPhotoInput && photoDropZone) {
        photoDropZone.addEventListener("click", () => guestPhotoInput.click());

        guestPhotoInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 10 * 1024 * 1024) {
                    alert("Please select an image smaller than 10MB.");
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    currentPhotoDataUrl = event.target.result;
                    if (guestPhotoPreview) {
                        guestPhotoPreview.src = currentPhotoDataUrl;
                        guestPhotoPreview.classList.remove("hidden");
                    }
                    if (photoPlaceholder) {
                        photoPlaceholder.classList.add("hidden");
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

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

    // Pass Modal Elements
    const passModal = document.getElementById("passModal");
    const closePassModalBtn = document.getElementById("closePassModal");
    const downloadPassBtn = document.getElementById("downloadPassBtn");
    const printPassBtn = document.getElementById("printPassBtn");
    const passGuestName = document.getElementById("passGuestName");
    const passGuestStatus = document.getElementById("passGuestStatus");
    const passGuestCount = document.getElementById("passGuestCount");
    const passTicketId = document.getElementById("passTicketId");
    const passAvatarImg = document.getElementById("passAvatarImg");
    const passAvatarFallback = document.getElementById("passAvatarFallback");
    const passAvatarInitials = document.getElementById("passAvatarInitials");
    const qrcodeContainer = document.getElementById("qrcode");

    let currentPassData = null;

    if (rsvpForm) {
        rsvpForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Set loading state
            submitBtn.disabled = true;
            btnText.textContent = "Generating Pass...";
            spinner.classList.remove("hidden");
            formFeedback.classList.add("hidden");
            formFeedback.className = "form-feedback"; // reset classes

            const formData = new FormData(rsvpForm);
            const nameVal = formData.get("name") || "Valued Guest";
            const attendanceVal = formData.get("attendance") || "Yes";
            const guestsVal = formData.get("guests") || "1";
            const randomId = "HD-2027-" + Math.floor(1000 + Math.random() * 9000);

            currentPassData = {
                name: nameVal,
                attendance: attendanceVal,
                guests: attendanceVal === "No" ? "0" : guestsVal,
                ticketId: randomId,
                photoUrl: currentPhotoDataUrl
            };

            // Fire Google script in background (non-blocking for quick modal feedback)
            fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Object.fromEntries(formData))
            }).catch(err => console.error("RSVP sync notice:", err));

            // Trigger Confetti Celebration!
            if (typeof confetti === "function") {
                confetti({
                    particleCount: 90,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#C5A059', '#7D8C77', '#E0C797', '#ffffff']
                });
            }

            // Populate Modal Content
            if (passGuestName) passGuestName.textContent = nameVal;

            // Swap letter body text based on attendance
            const letterBodyEl = document.getElementById("letterBodyText");
            if (letterBodyEl) {
                if (attendanceVal === "No") {
                    letterBodyEl.textContent = "We completely understand, and we so appreciate you letting us know. Though we'll miss you dearly on this special evening, know that you are always in our hearts. We hope to celebrate with you soon!";
                } else {
                    letterBodyEl.textContent = "We are so incredibly thrilled that you will be joining us to celebrate our wedding reception. Your presence means the world to us, and we can't wait to share this magical evening with you!";
                }
            }

            // Handle Avatar Display
            if (currentPhotoDataUrl && passAvatarImg) {
                passAvatarImg.src = currentPhotoDataUrl;
                passAvatarImg.classList.remove("hidden");
                if (passAvatarFallback) passAvatarFallback.classList.add("hidden");
            } else {
                if (passAvatarImg) passAvatarImg.classList.add("hidden");
                if (passAvatarFallback) passAvatarFallback.classList.remove("hidden");
                // Initials
                const parts = nameVal.trim().split(" ");
                const initials = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0].substring(0, 2).toUpperCase();
                if (passAvatarInitials) passAvatarInitials.textContent = initials || "HD";
            }

            // Generate QR Code
            if (qrcodeContainer) {
                qrcodeContainer.innerHTML = "";
                const qrText = `Hari & Diya Wedding Pass | Name: ${nameVal} | Guests: ${guestsVal} | ID: ${randomId}`;
                if (typeof QRCode !== "undefined") {
                    new QRCode(qrcodeContainer, {
                        text: qrText,
                        width: 90,
                        height: 90,
                        colorDark: "#2C3539",
                        colorLight: "#FFFFFF",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                }
            }

            // Reveal Modal smoothly
            if (passModal) {
                passModal.classList.remove("hidden");
                passModal.classList.add("active");
            }

            // Reset form button state
            submitBtn.disabled = false;
            btnText.textContent = "Submit RSVP ✉️";
            spinner.classList.add("hidden");
        });
    }

    // Modal Close Logic
    const closePassModal = () => {
        if (passModal) {
            passModal.classList.remove("active");
            passModal.classList.add("hidden");
        }
    };

    if (closePassModalBtn) {
        closePassModalBtn.addEventListener("click", closePassModal);
    }
    if (passModal) {
        passModal.addEventListener("click", (e) => {
            if (e.target === passModal) closePassModal();
        });
    }

    // Print Pass
    if (printPassBtn) {
        printPassBtn.addEventListener("click", () => {
            window.print();
        });
    }

            // Canvas Download Function: Renders Letter as high-res PNG Image
    if (downloadPassBtn) {
        downloadPassBtn.addEventListener("click", () => {
            if (!currentPassData) return;

            // Wait for cursive font to load before drawing to canvas
            document.fonts.load('3rem "Alex Brush"').then(() => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const w = 750;
                const h = 900;
                canvas.width = w;
                canvas.height = h;

                const drawLetter = () => {
                    // If guest has a photo, use it as a blurred, overlaid background
                    if (currentPassData.photoUrl) {
                        const bgImg = new Image();
                        bgImg.onload = () => {
                            // Draw photo stretched to fill canvas
                            ctx.drawImage(bgImg, 0, 0, w, h);
                            // Frost/darken it with a warm parchment overlay
                            ctx.fillStyle = "rgba(252, 247, 242, 0.82)";
                            ctx.fillRect(0, 0, w, h);
                            drawText();
                        };
                        bgImg.src = currentPassData.photoUrl;
                    } else {
                        // Plain parchment background
                        const bgGradient = ctx.createLinearGradient(0, 0, w, h);
                        bgGradient.addColorStop(0, "#fcf7f2");
                        bgGradient.addColorStop(0.5, "#f5eee4");
                        bgGradient.addColorStop(1, "#f2eadf");
                        ctx.fillStyle = bgGradient;
                        ctx.fillRect(0, 0, w, h);
                        drawText();
                    }
                };

                const drawText = () => {
                    // Subtle Border
                    ctx.strokeStyle = "#e3dccf";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(20, 20, w - 40, h - 40);

                    // Header Date
                    ctx.fillStyle = "#8c8273";
                    ctx.font = "400 18px 'Montserrat', sans-serif";
                    ctx.textAlign = "right";
                    ctx.fillText("January 24th, 2027", w - 50, 80);

                    // Separator Line
                    ctx.beginPath();
                    ctx.moveTo(w - 230, 100);
                    ctx.lineTo(w - 50, 100);
                    ctx.strokeStyle = "rgba(197, 160, 89, 0.4)";
                    ctx.stroke();

                    // Greeting
                    ctx.fillStyle = "#3b3631";
                    ctx.font = "400 64px 'Alex Brush', cursive";
                    ctx.textAlign = "left";
                    ctx.fillText(`Dear ${currentPassData.name},`, 60, 200);

                    // Body Text (attendance-aware)
                    ctx.fillStyle = "#4a453f";
                    ctx.font = "400 32px 'Cormorant Garamond', serif";
                    const bodyLines = currentPassData.attendance === "No"
                        ? ["We completely understand, and we so", "appreciate you letting us know. Though", "we'll miss you dearly on this special", "evening, know that you are always in", "our hearts. We hope to celebrate soon!"]
                        : ["We are so incredibly thrilled that you will", "be joining us to celebrate our wedding", "reception. Your presence means the world", "to us, and we can't wait to share this", "magical evening with you!"];
                    bodyLines.forEach((line, i) => ctx.fillText(line, 60, 300 + i * 50));

                    // Sign off
                    ctx.fillStyle = "#4a453f";
                    ctx.font = "italic 400 32px 'Cormorant Garamond', serif";
                    ctx.textAlign = "right";
                    ctx.fillText("With all our love,", w - 80, 680);

                    ctx.fillStyle = "#C5A059";
                    ctx.font = "400 80px 'Alex Brush', cursive";
                    ctx.fillText("Hari & Diya", w - 60, 770);

                    // Trigger Download
                    const link = document.createElement("a");
                    link.download = `Hari_Diya_Wedding_Note_${currentPassData.name.replace(/\s+/g, '_')}.png`;
                    link.href = canvas.toDataURL("image/png");
                    link.click();
                };

                drawLetter();
            });
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
    // 10. COLOR PALETTE THEME & LIGHT/DARK MODE SWITCHER
    // ==========================================
    const paletteToggle = document.getElementById("paletteToggle");
    const palettePanel = document.getElementById("palettePanel");
    const paletteOptions = document.querySelectorAll(".palette-option");
    const modeLightBtn = document.getElementById("modeLightBtn");
    const modeDarkBtn = document.getElementById("modeDarkBtn");

    let currentTheme = "burgundy-champagne";
    let currentMode = "dark";

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

    // Ensure default theme (Burgundy & Gold Dark) is applied on initial load
    applyTheme(currentTheme, currentMode);

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
