document.addEventListener("DOMContentLoaded", () => {
  initializeNavigationState();
  initializeExternalLinks();
  initializeFaqAnimation();
  initializeScrollEffects();
});

/* =========================================
   Active Navigation
========================================= */

function initializeNavigationState() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".site-nav a").forEach(link => {
    const href = link.getAttribute("href");

    if (href === currentPath) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

/* =========================================
   External Link Safety
========================================= */

function initializeExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.setAttribute("rel", "noopener noreferrer");
  });
}

/* =========================================
   FAQ Enhancement
========================================= */

function initializeFaqAnimation() {
  const detailsElements = document.querySelectorAll("details");

  detailsElements.forEach(details => {
    details.addEventListener("toggle", () => {
      if (details.open) {
        details.style.borderColor = "rgba(212, 109, 44, 0.64)";
      } else {
        details.style.borderColor = "";
      }
    });
  });
}

/* =========================================
   Subtle Scroll Effects
========================================= */

function initializeScrollEffects() {
  const cards = document.querySelectorAll(".forge-card");

  if (!("IntersectionObserver" in window)) {
    cards.forEach(card => {
      card.classList.add("visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  cards.forEach(card => {
    card.classList.add("preload-card");
    observer.observe(card);
  });
}