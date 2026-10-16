
/* =========================================
   VIBEDECK EVENTS — ABOUT PAGE JAVASCRIPT
========================================= */

const root = document.documentElement;

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mainNav = document.getElementById("mainNav");
const homeDropdown = document.getElementById("homeDropdown");
const homeDropdownBtn = document.getElementById("homeDropdownBtn");

const themeToggle = document.getElementById("themeToggle");
const directionToggle = document.getElementById("directionToggle");
const footerYear = document.getElementById("voltFooterYear");

/* MOBILE NAVIGATION */

function closeMobileMenu() {
    if (!mobileMenuBtn || !mainNav) return;

    mainNav.classList.remove("open");
    document.body.classList.remove("menu-open");

    mobileMenuBtn.setAttribute("aria-expanded", "false");
    mobileMenuBtn.setAttribute("aria-label", "Open navigation");
    mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';

    if (homeDropdown) {
        homeDropdown.classList.remove("open");
    }

    if (homeDropdownBtn) {
        homeDropdownBtn.setAttribute("aria-expanded", "false");
    }
}

if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");

        document.body.classList.toggle("menu-open", isOpen);

        mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
        mobileMenuBtn.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

        mobileMenuBtn.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    mainNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 900) {
                closeMobileMenu();
            }
        });
    });
}

/* HOME DROPDOWN */

if (homeDropdown && homeDropdownBtn) {
    homeDropdownBtn.addEventListener("click", event => {
        event.stopPropagation();

        const isOpen = homeDropdown.classList.toggle("open");

        homeDropdownBtn.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", event => {
        if (!homeDropdown.contains(event.target)) {
            homeDropdown.classList.remove("open");
            homeDropdownBtn.setAttribute("aria-expanded", "false");
        }
    });
}

/* RESPONSIVE MENU RESET */

window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
        closeMobileMenu();
    }
});


/* DARK / LIGHT MODE — SHARED ACROSS ALL PAGES */

function setTheme(theme) {
    root.setAttribute("data-theme", theme);

    if (themeToggle) {
        themeToggle.innerHTML = theme === "dark"
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';

        themeToggle.setAttribute(
            "aria-label",
            theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
        );

        themeToggle.title = theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode";
    }
}

/* Load the theme saved by any VibeDeck page */
const savedTheme = localStorage.getItem("vibedeck-theme") || "light";

setTheme(savedTheme);

/* Save theme changes */
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme = root.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        setTheme(newTheme);
        localStorage.setItem("vibedeck-theme", newTheme);
    });
}

/* LTR / RTL */

if (directionToggle) {
    directionToggle.addEventListener("click", () => {
        const currentDirection = root.getAttribute("dir") || "ltr";
        const nextDirection = currentDirection === "ltr" ? "rtl" : "ltr";

        root.setAttribute("dir", nextDirection);

        directionToggle.setAttribute(
            "aria-label",
            nextDirection === "ltr" ? "Switch to RTL" : "Switch to LTR"
        );

        directionToggle.title = nextDirection.toUpperCase() + " layout";
    });
}

/* SCROLL REVEAL */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(element => {
        element.classList.add("visible");
    });
}

/* FOOTER YEAR */

if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}

