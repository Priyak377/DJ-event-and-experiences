document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;

    // Footer copyright year
    const footerYear = document.getElementById("voltFooterYear");

    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }


    // Dark / Light theme — Shared across all VibeDeck pages
    const themeToggle = document.getElementById("themeToggle");

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);

        if (themeToggle) {
            const icon = themeToggle.querySelector("i");

            if (icon) {
                icon.className = theme === "dark"
                    ? "fa-solid fa-sun"
                    : "fa-solid fa-moon";
            }

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
        const currentTheme = root.getAttribute("data-theme");
        const nextTheme = currentTheme === "dark" ? "light" : "dark";

        applyTheme(nextTheme);

        try {
            localStorage.setItem("vibedeck-theme", nextTheme);
        } catch (error) {
            // Theme remains active for the current page.
        }
    });


    // LTR / RTL direction
    const directionToggle = document.getElementById("directionToggle");

    function applyDirection(direction) {
        root.setAttribute("dir", direction);

        if (directionToggle) {
            directionToggle.setAttribute(
                "aria-label",
                direction === "ltr"
                    ? "Switch to right-to-left layout"
                    : "Switch to left-to-right layout"
            );
        }
    }

    let savedDirection = "ltr";

    try {
        savedDirection =
            localStorage.getItem("vibedeck-direction") || "ltr";
    } catch (error) {
        savedDirection = "ltr";
    }

    applyDirection(savedDirection);

    directionToggle?.addEventListener("click", () => {
        const nextDirection =
            root.getAttribute("dir") === "ltr" ? "rtl" : "ltr";

        applyDirection(nextDirection);

        try {
            localStorage.setItem("vibedeck-direction", nextDirection);
        } catch (error) {
            // Direction still works for the current page.
        }
    });

    // Mobile navigation
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mainNav = document.getElementById("mainNav");

    function closeMobileMenu() {
       mainNav?.classList.remove("open");
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute("aria-expanded", "false");
            mobileMenuBtn.setAttribute("aria-label", "Open navigation");

            const icon = mobileMenuBtn.querySelector("i");

            if (icon) {
                icon.className = "fa-solid fa-bars";
            }
        }
    }

    mobileMenuBtn?.addEventListener("click", () => {
       const isOpen = mainNav?.classList.toggle("open") ?? false;

        mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
        mobileMenuBtn.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

        const icon = mobileMenuBtn.querySelector("i");

        if (icon) {
            icon.className = isOpen
                ? "fa-solid fa-xmark"
                : "fa-solid fa-bars";
        }
    });

    // Home dropdown
    const homeDropdown = document.getElementById("homeDropdown");
    const homeDropdownBtn = document.getElementById("homeDropdownBtn");

    homeDropdownBtn?.addEventListener("click", (event) => {
        event.preventDefault();

        const isOpen = homeDropdown?.classList.toggle("open") ?? false;

        homeDropdownBtn.setAttribute("aria-expanded", String(isOpen));
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

    // Close mobile navigation after selecting a link
    mainNav?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();

            homeDropdown?.classList.remove("open");
            homeDropdownBtn?.setAttribute("aria-expanded", "false");
        });
    });

    // Reveal animations
    const revealElements = document.querySelectorAll(".reveal");

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
                rootMargin: "0px 0px -25px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    }

    // Set the earliest selectable event date to today.
    const eventDate = document.getElementById("eventDate");

    if (eventDate) {
        const today = new Date();
        const localToday = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");

        eventDate.min = localToday;
    }

    // Preselect package when arriving from Packages page.
    const packageSelect = document.getElementById("service");
    const query = new URLSearchParams(window.location.search);
    const selectedPackage = query.get("package");

    const packageOptions = {
        single: "DJ Booking",
        couple: "DJ + Sound + Lighting",
        family: "Complete Event Experience",
        premium: "Complete Event Experience",
        custom: "Need Suggestions"
    };

    if (packageSelect && selectedPackage && packageOptions[selectedPackage]) {
        packageSelect.value = packageOptions[selectedPackage];

        // Scroll to the enquiry form when a package is selected.
        const enquirySection = document.getElementById("enquiry");

        if (enquirySection) {
            window.setTimeout(() => {
                enquirySection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }, 350);
        }
    }

    // Prepare an enquiry email.
    // Replace this placeholder with your actual business email.
    const businessEmail = "hello@yourdomain.com";

    const enquiryForm = document.getElementById("eventEnquiryForm");
    const formStatus = document.getElementById("formStatus");

    enquiryForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!enquiryForm.reportValidity()) {
            return;
        }

        const formData = new FormData(enquiryForm);

        const fields = [
            ["Full Name", "fullName"],
            ["Email Address", "email"],
            ["Phone Number", "phone"],
            ["Event Type", "eventType"],
            ["Preferred Event Date", "eventDate"],
            ["Expected Guests", "guestCount"],
            ["Event Venue / City", "venue"],
            ["Estimated Budget", "budget"],
            ["Service Required", "service"],
            ["Additional Details", "message"]
        ];

        const emailBody = fields.map(([label, name]) => {
            const value = String(formData.get(name) || "").trim();
            return `${label}: ${value || "Not provided"}`;
        }).join("\n");

        const subject = `VibeDeck Event Enquiry - ${String(
            formData.get("eventType") || "New Enquiry"
        ).trim()}`;

        const mailtoURL =
            `mailto:${businessEmail}` +
            `?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(emailBody)}`;

        if (formStatus) {
            formStatus.textContent =
                `Your enquiry is ready. Your email app will open to ${businessEmail}. ` +
                "Please review the details and send the email.";
        }

        // Open the visitor's configured email application.
        window.location.href = mailtoURL;
    });

    // Smooth scrolling for in-page links.
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
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
