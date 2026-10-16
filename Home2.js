
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mainNav = document.getElementById("mainNav");
const homeDropdown = document.getElementById("homeDropdown");
const homeDropdownBtn = document.getElementById("homeDropdownBtn");

/* MOBILE MENU */
function closeMobileMenu() {
    if (!mainNav || !mobileMenuBtn) return;

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
    homeDropdownBtn.addEventListener("click", () => {
        const isOpen = homeDropdown.classList.toggle("open");

        homeDropdownBtn.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", event => {
        if (
            window.innerWidth > 900 &&
            !homeDropdown.contains(event.target)
        ) {
            homeDropdown.classList.remove("open");
            homeDropdownBtn.setAttribute("aria-expanded", "false");
        }
    });
}

window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
        closeMobileMenu();
    }
});

/* DARK / LIGHT MODE */
const themeToggle = document.getElementById("themeToggle");
const rootElement = document.documentElement;

function setTheme(theme) {
    rootElement.setAttribute("data-theme", theme);

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
    }
}

const savedTheme = localStorage.getItem("vibedeck-theme") || "light";

setTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme = rootElement.getAttribute("data-theme");

        const newTheme = currentTheme === "dark" ? "light" : "dark";

        setTheme(newTheme);
        localStorage.setItem("vibedeck-theme", newTheme);
    });
}

/* LTR / RTL */
const directionToggle = document.getElementById("directionToggle");

if (directionToggle) {
    directionToggle.addEventListener("click", () => {
        const next =
            (rootElement.getAttribute("dir") || "ltr") === "ltr"
                ? "rtl"
                : "ltr";

        rootElement.setAttribute("dir", next);

        directionToggle.setAttribute(
            "aria-label",
            next === "ltr" ? "Switch to RTL" : "Switch to LTR"
        );

        directionToggle.title = next.toUpperCase() + " layout";
    });
}

/* HOME 2 ANIMATIONS */
const revealElements = document.querySelectorAll(
    ".home2-experience-card, .home2-showcase-copy, .home2-showcase-visual, .home2-section-head"
);

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.animate(
                        [
                            { opacity: 0, transform: "translateY(18px)" },
                            { opacity: 1, transform: "translateY(0)" }
                        ],
                        {
                            duration: 650,
                            easing: "ease-out",
                            fill: "both"
                        }
                    );

                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

/* FOOTER YEAR */
const voltFooterYear = document.getElementById("voltFooterYear");

if (voltFooterYear) {
    voltFooterYear.textContent = new Date().getFullYear();
}