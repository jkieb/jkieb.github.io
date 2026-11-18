---
title: "TUWEL-Bot: beantwortet klare Fragen zur Lehrveranstaltung"
date: 2026-10-25
bereich: "Studium / KI"
status: Roh
---

## Kernidee
Ein Bot für TUWEL (Moodle der TU Wien), der **klare, eindeutig beantwortbare Fragen** beantwortet (Termine, Abgabefristen, Beurteilungsschema, Ablauf der LU, Anmeldung) – direkt aus den Kursinhalten, mit Quellenangabe.

## Gedanken zum Start
- **Abgrenzung:** Nur Fragen mit klarer Antwort in den Kursmaterialien. Bei Unklarem oder inhaltlichen Rechenfragen: "Frag die Lehrenden" statt Raten.
- **Technik:** RAG wie beim [Studo-Bot](2026-10-25_Studium_Studo-Bot.md): Kursseite, Angabe-PDFs, Foren-Ankündigungen indexieren, Antwort mit Fundstelle und Sicherheit in %.
- **Zugang:** Moodle hat eine Web-Service-API (Token pro Nutzer) – sauberer als Scraping, aber an der TU Wien evtl. nicht freigeschaltet. Alternative: Kursinhalte selbst exportieren.
- **Datenschutz:** Nur eigene bzw. freigegebene Kursinhalte; keine Studierendendaten anderer indexieren.

## Offene Fragen
- Darf die TU Wien-Instanz per API oder Bot genutzt werden? Ansprechpartner (TU.it, Lehrende)?
- Pro Kurs ein Bot oder ein Bot über alle eigenen Kurse?
- Wo läuft der Chat: Browser-Plugin, Telegram, eigene Seite?
- Nutzen für andere: Würden Lehrende den Bot selbst anbieten wollen?

## Nächste Schritte
- [ ] Einen Kurs als Testfall wählen, Material manuell exportieren.
- [ ] 20 typische "klare Fragen" sammeln (Testset) und Bot dagegen prüfen.
- [ ] Moodle-API-Zugang und Nutzungsregeln klären.
