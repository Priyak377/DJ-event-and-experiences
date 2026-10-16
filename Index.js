/* MOBILE NAVIGATION */
        const mobileMenuBtn = document.getElementById("mobileMenuBtn");
        const mainNav = document.getElementById("mainNav");
        const homeDropdown = document.getElementById("homeDropdown");
        const homeDropdownBtn = document.getElementById("homeDropdownBtn");

        function closeMobileMenu() {
            mainNav.classList.remove("open");
            document.body.classList.remove("menu-open");
            mobileMenuBtn.setAttribute("aria-expanded", "false");
            mobileMenuBtn.setAttribute("aria-label", "Open navigation");
            mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            homeDropdown.classList.remove("open");
            homeDropdownBtn.setAttribute("aria-expanded", "false");
        }

        mobileMenuBtn.addEventListener("click", function () {
            const isOpen = mainNav.classList.toggle("open");
            document.body.classList.toggle("menu-open", isOpen);
            mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
            mobileMenuBtn.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
            mobileMenuBtn.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });

        homeDropdownBtn.addEventListener("click", function () {
            const isOpen = homeDropdown.classList.toggle("open");
            homeDropdownBtn.setAttribute("aria-expanded", String(isOpen));
        });

        mainNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                if (window.innerWidth <= 900) closeMobileMenu();
            });
        });

        document.addEventListener("click", function (event) {
            if (window.innerWidth > 900 && !homeDropdown.contains(event.target)) {
                homeDropdown.classList.remove("open");
                homeDropdownBtn.setAttribute("aria-expanded", "false");
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 900) closeMobileMenu();
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
            themeToggle.addEventListener("click", function () {
                const currentTheme =
                    rootElement.getAttribute("data-theme");

                const newTheme =
                    currentTheme === "dark" ? "light" : "dark";

                setTheme(newTheme);
                localStorage.setItem("vibedeck-theme", newTheme);
            });
        }


        /* LTR / RTL */
        const directionToggle = document.getElementById("directionToggle");

        directionToggle.addEventListener("click", function () {
            const currentDirection = rootElement.getAttribute("dir") || "ltr";
            const newDirection = currentDirection === "ltr" ? "rtl" : "ltr";
            rootElement.setAttribute("dir", newDirection);
            directionToggle.setAttribute("aria-label", newDirection === "ltr" ? "Switch to RTL" : "Switch to LTR");
            directionToggle.title = newDirection.toUpperCase() + " layout";
        });

        /* HERO SLIDER */
        const slides = Array.from(document.querySelectorAll(".hero-slide"));
        const dots = Array.from(document.querySelectorAll(".slide-dot"));
        const currentSlideText = document.getElementById("currentSlide");
        const slideProgress = document.getElementById("slideProgress");
        const prevSlideBtn = document.getElementById("prevSlide");
        const nextSlideBtn = document.getElementById("nextSlide");

        let activeSlide = 0;
        let sliderTimer;

        function showSlide(index) {
            activeSlide = (index + slides.length) % slides.length;
            slides.forEach((slide, i) => slide.classList.toggle("active", i === activeSlide));
            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === activeSlide);
                dot.setAttribute("aria-pressed", String(i === activeSlide));
            });
            currentSlideText.textContent = String(activeSlide + 1).padStart(2, "0");
            slideProgress.style.width = ((activeSlide + 1) / slides.length * 100) + "%";
        }

        function restartSlider() {
            clearInterval(sliderTimer);
            sliderTimer = setInterval(() => showSlide(activeSlide + 1), 5500);
        }

        prevSlideBtn.addEventListener("click", () => {
            showSlide(activeSlide - 1);
            restartSlider();
        });
        nextSlideBtn.addEventListener("click", () => {
            showSlide(activeSlide + 1);
            restartSlider();
        });
        dots.forEach(dot => dot.addEventListener("click", () => {
            showSlide(Number(dot.dataset.slide));
            restartSlider();
        }));

        showSlide(0);
        restartSlider();

        /* SCROLL REVEAL */
        const revealElements = document.querySelectorAll(".reveal");

        if ("IntersectionObserver" in window) {
            const revealObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold:0.12 });

      
            revealElements.forEach(element => revealObserver.observe(element));
        } else {
            revealElements.forEach(element => element.classList.add("visible"));
        }

      
const voltFooterYear = document.getElementById("voltFooterYear");

if (voltFooterYear) {
    voltFooterYear.textContent = new Date().getFullYear();
}