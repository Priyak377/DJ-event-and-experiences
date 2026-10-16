
document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;


    const footerYear = document.getElementById("voltFooterYear");

    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = themeToggle?.querySelector("i");

    function applyTheme(theme) {
        html.setAttribute("data-theme", theme);

        if (themeIcon) {
            themeIcon.className = theme === "dark"
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon";
        }

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );

            themeToggle.title = theme === "dark"
                ? "Light mode"
                : "Dark mode";
        }

        const themeColor = document.querySelector(
            'meta[name="theme-color"]'
        );

        if (themeColor) {
            themeColor.content = theme === "dark"
                ? "#090911"
                : "#FAF8FF";
        }
    }

    let savedTheme = "light";

    try {
        savedTheme =
            localStorage.getItem("vibedeck-theme") || "light";
    } catch (error) {
        savedTheme = "light";
    }

    applyTheme(savedTheme);

    themeToggle?.addEventListener("click", () => {
        const nextTheme =
            html.getAttribute("data-theme") === "dark"
                ? "light"
                : "dark";

        applyTheme(nextTheme);

        try {
            localStorage.setItem("vibedeck-theme", nextTheme);
        } catch (error) {
            // Theme remains active for the current page.
        }
    });
   

    const directionToggle = document.getElementById("directionToggle");

    let savedDirection = "ltr";

    try {
        savedDirection =
            localStorage.getItem("vibedeck-direction") || "ltr";
    } catch (error) {
        savedDirection = "ltr";
    }

    function applyDirection(direction) {
        html.setAttribute("dir", direction);

        if (directionToggle) {
            directionToggle.setAttribute(
                "aria-label",
                direction === "ltr"
                    ? "Switch to right-to-left layout"
                    : "Switch to left-to-right layout"
            );

            directionToggle.title =
                direction === "ltr" ? "Switch to RTL" : "Switch to LTR";
        }
    }

    applyDirection(savedDirection);

    directionToggle?.addEventListener("click", () => {
        const nextDirection =
            html.getAttribute("dir") === "ltr" ? "rtl" : "ltr";

        applyDirection(nextDirection);

        try {
            localStorage.setItem("vibedeck-direction", nextDirection);
        } catch (error) {
            // Direction still works without local storage.
        }
    });


    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mainNav = document.getElementById("mainNav");
    const menuIcon = mobileMenuBtn?.querySelector("i");

    function closeMobileMenu() {
        mainNav?.classList.remove("is-open");

        mobileMenuBtn?.setAttribute("aria-expanded", "false");
        mobileMenuBtn?.setAttribute("aria-label", "Open navigation");

        if (menuIcon) {
            menuIcon.className = "fa-solid fa-bars";
        }
    }

    function openMobileMenu() {
        mainNav?.classList.add("open");

        mobileMenuBtn?.setAttribute("aria-expanded", "true");
        mobileMenuBtn?.setAttribute("aria-label", "Close navigation");

        if (menuIcon) {
            menuIcon.className = "fa-solid fa-xmark";
        }
    }

    mobileMenuBtn?.addEventListener("click", () => {
        if (mainNav?.classList.contains("is-open")) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 920) {
            closeMobileMenu();
        }
    });

    // =========================================
    // HOME DROPDOWN
    // =========================================

    const homeDropdown = document.getElementById("homeDropdown");
    const homeDropdownBtn = document.getElementById("homeDropdownBtn");

    homeDropdownBtn?.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen = homeDropdown?.classList.toggle("open");

        homeDropdownBtn.setAttribute(
            "aria-expanded",
            String(Boolean(isOpen))
        );
    });

    document.addEventListener("click", (event) => {
        if (
            homeDropdown &&
            !homeDropdown.contains(event.target)
        ) {
            homeDropdown.classList.remove("open");
            homeDropdownBtn?.setAttribute("aria-expanded", "false");
        }
    });

    mainNav?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    // =========================================
    // HERO SLIDER
    // =========================================

    const heroSlides = Array.from(
        document.querySelectorAll(".hero-slide")
    );

    const heroDots = Array.from(
        document.querySelectorAll(".hero-dot")
    );

    const heroCurrent = document.getElementById("heroCurrent");
    const heroPrev = document.getElementById("heroPrev");
    const heroNext = document.getElementById("heroNext");
    const galleryHero = document.getElementById("galleryHero");

    let currentSlide = 0;
    let sliderTimer = null;

    const sliderDelay = 5000;

    function showSlide(index) {
        if (!heroSlides.length) return;

        currentSlide =
            (index + heroSlides.length) % heroSlides.length;

        heroSlides.forEach((slide, i) => {
            const isActive = i === currentSlide;

            slide.classList.toggle("active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });

        heroDots.forEach((dot, i) => {
            const isActive = i === currentSlide;

            dot.classList.toggle("active", isActive);

            if (isActive) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });

        if (heroCurrent) {
            heroCurrent.textContent = String(currentSlide + 1).padStart(2, "0");
        }
    }

    function stopSlider() {
        if (sliderTimer) {
            clearInterval(sliderTimer);
            sliderTimer = null;
        }
    }

    function startSlider() {
        stopSlider();

        if (heroSlides.length < 2) return;

        sliderTimer = setInterval(() => {
            showSlide(currentSlide + 1);
        }, sliderDelay);
    }

    heroPrev?.addEventListener("click", () => {
        showSlide(currentSlide - 1);
        startSlider();
    });

    heroNext?.addEventListener("click", () => {
        showSlide(currentSlide + 1);
        startSlider();
    });

    heroDots.forEach((dot) => {
        dot.addEventListener("click", () => {
            const index = Number(dot.dataset.slide);

            if (Number.isInteger(index)) {
                showSlide(index);
                startSlider();
            }
        });
    });

    galleryHero?.addEventListener("mouseenter", stopSlider);
    galleryHero?.addEventListener("mouseleave", startSlider);

    galleryHero?.addEventListener("focusin", stopSlider);
    galleryHero?.addEventListener("focusout", (event) => {
        if (!galleryHero.contains(event.relatedTarget)) {
            startSlider();
        }
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopSlider();
        } else {
            startSlider();
        }
    });

    showSlide(0);
    startSlider();

    // =========================================
    // SCROLL REVEAL ANIMATIONS
    // =========================================

    const revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        revealItems.forEach((item, index) => {
            item.style.transitionDelay = `${(index % 4) * 70}ms`;
            revealObserver.observe(item);
        });
    } else {
        revealItems.forEach((item) => {
            item.classList.add("is-visible");
        });
    }

    // =========================================
    // SMOOTH SCROLL
    // =========================================

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                event.preventDefault();
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth",
                    block: "start"
                });
            }
        });
    });

});
/* =========================================
   VIBEDECK HEADER & FOOTER FUNCTIONALITY
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const root = document.documentElement;

    /* -------------------------------------
       DARK / LIGHT MODE
    ------------------------------------- */

    const themeButton = document.getElementById("vdThemeToggle");

    function updateThemeButton() {
        if (!themeButton) return;

        const isDark = root.getAttribute("data-theme") !== "light";

        themeButton.innerHTML = isDark
            ? '<i class="fa-regular fa-sun" aria-hidden="true"></i>'
            : '<i class="fa-regular fa-moon" aria-hidden="true"></i>';

        themeButton.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );

        themeButton.title = isDark
            ? "Switch to Light Mode"
            : "Switch to Dark Mode";
    }

    // Restore the saved theme, if available.
    try {
        const savedTheme = localStorage.getItem("vibedeck-theme");

        if (savedTheme === "dark" || savedTheme === "light") {
            root.setAttribute("data-theme", savedTheme);
        }
    } catch (error) {
        // Continue using the theme already set in the HTML.
    }

    if (!root.hasAttribute("data-theme")) {
        root.setAttribute("data-theme", "dark");
    }

    updateThemeButton();

    if (themeButton) {
        themeButton.addEventListener("click", function () {
            const currentTheme = root.getAttribute("data-theme");
            const nextTheme = currentTheme === "dark" ? "light" : "dark";

            root.setAttribute("data-theme", nextTheme);

            try {
                localStorage.setItem("vibedeck-theme", nextTheme);
            } catch (error) {
                // The theme still works for the current page.
            }

            updateThemeButton();
        });
    }

    /* -------------------------------------
       RTL / LTR DIRECTION
    ------------------------------------- */

    const directionButton =
        document.getElementById("vdDirectionToggle");

    function updateDirectionButton() {
        if (!directionButton) return;

        const direction = root.getAttribute("dir") || "ltr";

        directionButton.innerHTML =
            '<i class="fa-solid fa-arrow-right-arrow-left" ' +
            'aria-hidden="true"></i>' +
            '<span>' + direction.toUpperCase() + '</span>';

        directionButton.setAttribute(
            "aria-label",
            direction === "ltr"
                ? "Switch to right-to-left layout"
                : "Switch to left-to-right layout"
        );
    }

    updateDirectionButton();

    if (directionButton) {
        directionButton.addEventListener("click", function () {
            const currentDirection = root.getAttribute("dir") || "ltr";
            const nextDirection = currentDirection === "ltr" ? "rtl" : "ltr";

            root.setAttribute("dir", nextDirection);

            try {
                localStorage.setItem("vibedeck-direction", nextDirection);
            } catch (error) {
                // Direction still changes for the current page.
            }

            updateDirectionButton();
        });
    }

    // Restore saved text direction.
    try {
        const savedDirection = localStorage.getItem("vibedeck-direction");

        if (savedDirection === "ltr" || savedDirection === "rtl") {
            root.setAttribute("dir", savedDirection);
            updateDirectionButton();
        }
    } catch (error) {
        // Keep the direction defined by the HTML.
    }

    /* -------------------------------------
       MOBILE MENU
    ------------------------------------- */

    const mobileButton = document.getElementById("vdMobileToggle");
    const headerContent = document.getElementById("vdHeaderContent");

    function closeMobileMenu() {
        if (!mobileButton || !headerContent) return;

        headerContent.classList.remove("is-open");
        mobileButton.setAttribute("aria-expanded", "false");
        mobileButton.setAttribute("aria-label", "Open navigation");

        mobileButton.innerHTML =
            '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    }

    if (mobileButton && headerContent) {
        mobileButton.addEventListener("click", function () {
            const isOpen =
                headerContent.classList.toggle("is-open");

            mobileButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            mobileButton.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

            mobileButton.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
                : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
        });

        headerContent.querySelectorAll(".vd-nav-link").forEach(function (link) {
            link.addEventListener("click", closeMobileMenu);
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 980) {
                closeMobileMenu();
            }
        });
    }

    /* -------------------------------------
       ACTIVE PAGE HIGHLIGHT
    ------------------------------------- */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".vd-nav-link").forEach(function (link) {
        const linkPage = link.getAttribute("href").split("#")[0];

        if (linkPage === currentPage) {
            link.classList.add("is-active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("is-active");
            link.removeAttribute("aria-current");
        }
    });

    /* -------------------------------------
       AUTOMATIC COPYRIGHT YEAR
    ------------------------------------- */

    const copyrightYear = document.getElementById("vdCopyrightYear");

    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

});