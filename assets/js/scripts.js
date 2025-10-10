// Critical JavaScript - loads immediately
// Tailwind CSS Configuration (critical for styling)
tailwind.config = {
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.8s ease-out",
        "slide-in-left": "slideInLeft 0.8s ease-out",
        "slide-in-right": "slideInRight 0.8s ease-out",
        "pulse-gentle": "pulseGentle 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseGentle: {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
};

// Critical navigation and header functionality
document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("main-header");
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileButton = header?.querySelector("#mobile-menu-button svg");
  const allNavLinks = document.querySelectorAll('a[href^="#"]');

  // Header scroll transition (critical for UX)
  function handleScroll() {
    const scrollPosition = window.scrollY;
    const logoText = header?.querySelector("span.text-2xl.font-bold.ml-2");

    if (scrollPosition > 50) {
      header?.classList.remove("bg-transparent");
      header?.classList.add("header-scrolled");
      mobileButton?.classList.remove("text-white");
      mobileButton?.classList.add("text-gray-700");
      logoText?.classList.remove("text-white");
      logoText?.classList.add("text-black");
    } else {
      header?.classList.remove("header-scrolled");
      header?.classList.add("bg-transparent");
      mobileButton?.classList.remove("text-gray-700");
      mobileButton?.classList.add("text-white");
      logoText?.classList.remove("text-black");
      logoText?.classList.add("text-white");
    }
  }

  // Mobile menu toggle (critical for mobile UX)
  function toggleMobileMenu() {
    mobileMenu?.classList.toggle("hidden");
  }

  // Smooth scroll for navigation (critical for UX)
  function handleNavClick(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      mobileMenu?.classList.add("hidden");
      const headerHeight = header?.offsetHeight || 0;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  }

  // Critical event listeners
  window.addEventListener("scroll", handleScroll);
  mobileMenuButton?.addEventListener("click", toggleMobileMenu);
  allNavLinks.forEach((link) => link.addEventListener("click", handleNavClick));

  // Initial call
  handleScroll();

  // Defer non-critical features
  requestIdleCallback(() => loadNonCriticalFeatures(), { timeout: 2000 });
});

// Non-critical features loaded after page is interactive
function loadNonCriticalFeatures() {
  // Load structured data (SEO, non-critical)
  fetch("structured-data.json")
    .then((response) => response.json())
    .then((data) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    })
    .catch(() => {}); // Silent fail for non-critical feature

  // Active section indicator (nice-to-have)
  const sections = document.querySelectorAll("section[id]");
  const header = document.getElementById("main-header");

  function updateActiveLink() {
    const headerHeight = header?.offsetHeight || 0;
    const scrollPosition = window.scrollY + headerHeight + 100;
    let activeSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        activeSection = "#" + section.id;
      }
    });

    document.querySelectorAll("nav .nav-link").forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === activeSection) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink();

  // Scroll reveal animations (enhancement)
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealElements.forEach((el) => observer.observe(el));
  }

  // Contact form handling (only needed when form is visible)
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const submitBtn = document.getElementById("submit-btn");
    const btnText = document.getElementById("btn-text");
    const btnLoading = document.getElementById("btn-loading");
    const successMsg = document.getElementById("form-success");
    const errorMsg = document.getElementById("form-error");

    // Email validation
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    contactForm.addEventListener("submit", function (e) {
      const name = contactForm.querySelector("#name")?.value.trim();
      const email = contactForm.querySelector("#email")?.value.trim();
      const message = contactForm.querySelector("#message")?.value.trim();

      if (!name || !email || !message) {
        e.preventDefault();
        errorMsg.textContent =
          "?? Veuillez remplir tous les champs obligatoires.";
        errorMsg.classList.remove("hidden");
        return;
      }

      if (!isValidEmail(email)) {
        e.preventDefault();
        errorMsg.textContent = "?? Veuillez entrer une adresse email valide.";
        errorMsg.classList.remove("hidden");
        return;
      }

      // Show loading state
      btnText?.classList.add("hidden");
      btnLoading?.classList.remove("hidden");
      if (submitBtn) submitBtn.disabled = true;
      successMsg?.classList.add("hidden");
      errorMsg?.classList.add("hidden");
    });

    // Check for success parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success") === "true") {
      successMsg?.classList.remove("hidden");
      contactForm.reset();
    }
  }
}

// Fallback for browsers without requestIdleCallback
if (!window.requestIdleCallback) {
  window.requestIdleCallback = function (cb) {
    return setTimeout(cb, 1);
  };
}
