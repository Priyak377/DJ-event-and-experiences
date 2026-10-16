
document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mainNav = document.getElementById("mainNav");
    const homeDropdown = document.getElementById("homeDropdown");
    const homeDropdownBtn = document.getElementById("homeDropdownBtn");
    const themeToggle = document.getElementById("themeToggle");
    const directionToggle = document.getElementById("directionToggle");
    const footerYear = document.getElementById("voltFooterYear");

    // Footer year
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // Mobile navigation
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("open");
            mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
            mobileMenuBtn.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

            mobileMenuBtn.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });
    }

    // Home dropdown
    if (homeDropdown && homeDropdownBtn) {
        homeDropdownBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            const isOpen = homeDropdown.classList.toggle("open");
            homeDropdownBtn.setAttribute("aria-expanded", String(isOpen));
        });

        document.addEventListener("click", (event) => {
            if (!homeDropdown.contains(event.target)) {
                homeDropdown.classList.remove("open");
                homeDropdownBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Close mobile menu after selecting a page
    if (mainNav) {
        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("open");
                homeDropdown?.classList.remove("open");

                if (mobileMenuBtn) {
                    mobileMenuBtn.setAttribute("aria-expanded", "false");
                    mobileMenuBtn.setAttribute("aria-label", "Open navigation");
                    mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                }
            });
        });
    }

    // Dark / light theme toggle
    function updateThemeIcon() {
        if (!themeToggle) return;

        const isDark = html.getAttribute("data-theme") !== "light";
        themeToggle.innerHTML = isDark
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';

        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
    }

    const savedTheme = localStorage.getItem("vibedeck-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
        html.setAttribute("data-theme", savedTheme);
    }

    updateThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme = html.getAttribute("data-theme") || "dark";
            const nextTheme = currentTheme === "dark" ? "light" : "dark";

            html.setAttribute("data-theme", nextTheme);
            localStorage.setItem("vibedeck-theme", nextTheme);
            updateThemeIcon();
        });
    }

    // LTR / RTL toggle
    if (directionToggle) {
        const savedDirection = localStorage.getItem("vibedeck-direction");

        if (savedDirection === "rtl" || savedDirection === "ltr") {
            html.setAttribute("dir", savedDirection);
        }

        directionToggle.addEventListener("click", () => {
            const currentDirection = html.getAttribute("dir") || "ltr";
            const nextDirection = currentDirection === "ltr" ? "rtl" : "ltr";

            html.setAttribute("dir", nextDirection);
            localStorage.setItem("vibedeck-direction", nextDirection);
        });
    }

    // Subtle reveal animation when sections enter the viewport
    const revealElements = document.querySelectorAll(
        ".service-card, .process-card, .benefit-item, .event-type-card"
    );

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach((element) => {
            element.classList.add("reveal-on-scroll");
            revealObserver.observe(element);
        });
    }
});
