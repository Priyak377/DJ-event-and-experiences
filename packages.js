
document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;

    // =========================================
    // FOOTER YEAR
    // =========================================
    const footerYear = document.getElementById("voltFooterYear");

    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = themeToggle?.querySelector("i");

    function applyTheme(theme) {
        html.setAttribute("data-theme", theme);

        if (themeIcon) {
            themeIcon.className =
                theme === "dark"
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

            themeToggle.title =
                theme === "dark" ? "Light mode" : "Dark mode";
        }
    }

    let savedTheme = "dark";

    try {
        savedTheme = localStorage.getItem("vibedeck-theme") || "dark";
    } catch (error) {
        savedTheme = "dark";
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
            // Theme still works when browser storage is unavailable.
        }
    });

    // =========================================
    // LTR / RTL DIRECTION
    // =========================================
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
            // Direction still works when browser storage is unavailable.
        }
    });

    // =========================================
    // MOBILE NAVIGATION
    // =========================================
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
        mainNav?.classList.add("is-open");
        mobileMenuBtn?.setAttribute("aria-expanded", "true");
        mobileMenuBtn?.setAttribute("aria-label", "Close navigation");

        if (menuIcon) {
            menuIcon.className = "fa-solid fa-xmark";
        }
    }

    mobileMenuBtn?.addEventListener("click", () => {
        const isOpen = mainNav?.classList.contains("is-open");

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
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

    // Close mobile navigation after choosing a page.
    mainNav?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    // Close the mobile menu when switching to desktop width.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 920) {
            closeMobileMenu();
        }
    });

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");

        question?.addEventListener("click", () => {
            const isOpen = item.classList.contains("open");

            // Keep only one answer open at a time.
            faqItems.forEach((otherItem) => {
                otherItem.classList.remove("open");

                const otherQuestion =
                    otherItem.querySelector(".faq-question");

                otherQuestion?.setAttribute("aria-expanded", "false");
            });

            if (!isOpen) {
                item.classList.add("open");
                question.setAttribute("aria-expanded", "true");
            }
        });
    });

    // =========================================
    // SCROLL REVEAL ANIMATION
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
    // SMOOTH SCROLL FOR IN-PAGE LINKS
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
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
});
