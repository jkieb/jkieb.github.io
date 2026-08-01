/* Kleine Helfer für die Seite – ohne Framework, ohne Abhängigkeiten. */

(function () {
  "use strict";

  const root = document.documentElement;

  /* --- Farbschema umschalten (Auswahl bleibt gespeichert) ---------------- */
  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const current = root.dataset.theme || (prefersDark ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";

      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* z. B. private Browser-Modi – dann gilt die Wahl nur für diese Seite */
      }
    });
  }

  /* --- Mobiles Menü ------------------------------------------------------ */
  const navToggle = document.getElementById("navToggle");
  const navList = document.getElementById("navList");

  if (navToggle && navList) {
    const setMenu = function (open) {
      navList.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    };

    navToggle.addEventListener("click", function () {
      setMenu(navToggle.getAttribute("aria-expanded") !== "true");
    });

    // Nach einem Klick auf einen Link schließen
    navList.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navList.classList.contains("is-open")) {
        setMenu(false);
        navToggle.focus();
      }
    });
  }

  /* --- Kopfzeile beim Scrollen absetzen ---------------------------------- */
  const header = document.getElementById("siteHeader");

  if (header) {
    const updateHeader = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  /* --- Aktiven Navigationspunkt markieren -------------------------------- */
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = new Map();

  document.querySelectorAll('.nav__link[href^="#"]').forEach(function (link) {
    navLinks.set(link.getAttribute("href").slice(1), link);
  });

  if (sections.length && navLinks.size && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const link = navLinks.get(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (other) {
              other.removeAttribute("aria-current");
            });
            link.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* --- Inhalte beim Scrollen sanft einblenden ---------------------------- */
  const revealItems = document.querySelectorAll(".reveal");

  if (revealItems.length) {
    if ("IntersectionObserver" in window) {
      const revealer = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
      );

      revealItems.forEach(function (item) {
        revealer.observe(item);
      });
    } else {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
    }
  }

  /* --- Jahreszahl im Footer aktuell halten ------------------------------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
