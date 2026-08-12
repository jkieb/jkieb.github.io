/* Kleine Helfer für die Seite – ohne Framework, ohne Abhängigkeiten. */

/* Zeugnisse und Zertifikate.
 *
 * Pro Dokument ein Eintrag. Die PDF gehört nach `zeugnisse/` und muss vorher
 * geschwärzt sein – siehe zeugnisse/README.md. Ist die Liste leer, blendet die
 * Seite den Abschnitt und den Menüpunkt aus.
 */
const zeugnisse = [
  {
    titel: "Praktikum Digital & Automation",
    aussteller: "Siemens Healthcare Diagnostics GmbH",
    zeitraum: "Juli – September 2025",
    text:
      "Dreimonatiges Vollzeitpraktikum: Automatisierung von Arbeitsprozessen mit " +
      "VBA, Finetuning von Machine-Learning-Modellen mit PyTorch und Aufbau der " +
      "Dokumentation für nachfolgende Praktikanten.",
    datei: "zeugnisse/praktikum-siemens-healthineers-2025.pdf",
  },
  {
    titel: "CS50x – Introduction to Computer Science",
    aussteller: "Harvard University",
    zeitraum: "2024",
    text:
      "Harvards Einführung in die Informatik: zehn Problem Sets und ein " +
      "Abschlussprojekt zu Algorithmen, Datenstrukturen und Speicherverwaltung " +
      "in C, Python und SQL sowie Webentwicklung mit HTML, CSS und JavaScript.",
    datei: "zeugnisse/cs50x-harvard-2024.pdf",
    pruefLink:
      "https://cs50.harvard.edu/certificates/2c8b92d4-d5bf-4070-8fbe-bc454adfd9c7",
  },
  {
    titel: "Praktikum Entwicklung & Fertigung",
    aussteller: "General Laser OG",
    zeitraum: "August 2021",
    text:
      "Einblick in LiDAR, GNSS und IMU sowie in additive und subtraktive " +
      "Materialbearbeitung – von der Recherche zu mobilen LiDAR-Scannern bis zur " +
      "Herstellung von Komponenten für eine flexible Betonschalung.",
    datei: "zeugnisse/praktikum-general-laser-2021.pdf",
  },
];

(function () {
  "use strict";

  const root = document.documentElement;

  /* --- Zeugnisse einsetzen ----------------------------------------------- */
  const zeugnisseAbschnitt = document.getElementById("zeugnisse");
  const zeugnisseListe = document.getElementById("zeugnisseListe");
  const zeugnisseMenue = document.getElementById("navZeugnisse");

  if (zeugnisseAbschnitt && zeugnisseListe && zeugnisse.length) {
    const dokumentSymbol =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />' +
      '<path d="M14 2v6h6M9 15h6M9 11h2" /></svg>';

    const pruefSymbol =
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5z" />' +
      '<path d="m9 12 2 2 4-4" /></svg>';

    const pfeilSymbol =
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M5 12h14M13 6l6 6-6 6" /></svg>';

    zeugnisse.forEach(function (eintrag) {
      const karte = document.createElement("article");
      karte.className = "card credential reveal";

      const koerper = document.createElement("div");
      koerper.className = "card__body";

      const symbol = document.createElement("span");
      symbol.className = "card__icon";
      symbol.setAttribute("aria-hidden", "true");
      symbol.innerHTML = dokumentSymbol;
      koerper.append(symbol);

      const titel = document.createElement("h3");
      titel.className = "card__title";
      titel.textContent = eintrag.titel;
      koerper.append(titel);

      // Aussteller und Zeitraum stehen zusammen in einer Zeile, beides optional
      const angaben = [eintrag.aussteller, eintrag.zeitraum].filter(Boolean);
      if (angaben.length) {
        const meta = document.createElement("p");
        meta.className = "credential__meta";
        meta.textContent = angaben.join(" · ");
        koerper.append(meta);
      }

      if (eintrag.text) {
        const text = document.createElement("p");
        text.className = "card__text";
        text.textContent = eintrag.text;
        koerper.append(text);
      }

      const links = document.createElement("div");
      links.className = "credential__links";

      if (eintrag.datei) {
        const link = document.createElement("a");
        link.className = "credential__link";
        link.href = eintrag.datei;
        link.target = "_blank";
        // nofollow ergänzt robots.txt: die Zeugnisse sollen nicht in den Suchindex
        link.rel = "noopener noreferrer nofollow";
        link.innerHTML = "PDF ansehen" + pfeilSymbol;
        // Damit im Screenreader klar ist, welches PDF gemeint ist
        link.setAttribute("aria-label", "PDF ansehen: " + eintrag.titel);
        links.append(link);
      }

      if (eintrag.pruefLink) {
        const pruefen = document.createElement("a");
        pruefen.className = "credential__link credential__link--pruefen";
        pruefen.href = eintrag.pruefLink;
        pruefen.target = "_blank";
        pruefen.rel = "noopener noreferrer";
        pruefen.innerHTML = pruefSymbol + "Echtheit prüfen";
        pruefen.setAttribute("aria-label", "Echtheit prüfen: " + eintrag.titel);
        links.append(pruefen);
      }

      if (links.children.length) koerper.append(links);

      karte.append(koerper);
      zeugnisseListe.append(karte);
    });

    zeugnisseAbschnitt.hidden = false;
    if (zeugnisseMenue) zeugnisseMenue.hidden = false;
  }

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
