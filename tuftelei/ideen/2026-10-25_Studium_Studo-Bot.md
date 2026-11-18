---
title: "Studo-Bot: Fragen beantworten mit Quelle und Sicherheit"
date: 2026-10-25
bereich: "Studium / KI"
status: Roh
---

## Kernidee
Zwei Bausteine: (1) Zugang zur Studo-Website bzw. ihren Inhalten, (2) ein Chat-Bot, der Fragen beantwortet und dabei immer eine **Referenz** (Quelle) und eine **Sicherheit in Prozent** angibt.

Verwandt: [TUWEL-Bot](2026-10-25_Studium_TUWEL-Bot.md) (gleiche Technik, andere Wissensbasis).

## Warum interessant
- Schnelle Antworten auf Studienfragen, ohne Foren und Skripte manuell zu durchsuchen.
- Nachprüfbar durch Quellenangabe; ehrlich durch Sicherheitswert ("weiß ich nicht" statt Raten).

## Skizze
**Zugang**
- Keine öffentliche Studo-API bekannt (zu prüfen). Klären, ob eigener Login-Zugriff auf eigene Daten oder öffentliche Inhalte gemeint sind; Nutzungsbedingungen und DSGVO prüfen, bevor etwas automatisiert abgerufen wird.
- Optionen: (a) manueller Export bzw. Einfügen der Inhalte (sicherster Start), (b) Browser-Automation (Playwright) mit Login – fragil, ToS prüfen, Zugangsdaten nur als Secret/Umgebungsvariable, nie im Repo.

**Bot (RAG)**
1. Inhalte in Abschnitte zerlegen, als Embeddings in einen Vektorindex ablegen.
2. Frage → Top-k-Abschnitte holen → Antwort nur auf Basis dieser Abschnitte.
3. Ausgabe: Antwort + Referenz (Dokument/Seite/Link + Zitat).
4. **Sicherheit in %** aus messbaren Signalen, nicht aus der Selbstauskunft des Modells:
   - Ähnlichkeit Frage ↔ Fundstelle
   - Grounding-Check (Antwort durch Fundstelle gedeckt?)
   - Übereinstimmung mehrerer Quellen, Aktualität
5. Unter Schwellwert (z. B. 50 %): "Keine verlässliche Quelle gefunden".
6. **Kalibrierung:** Mit Testfragen prüfen, ob "80 %" tatsächlich in etwa 80 % der Fälle stimmt.

**Einbindung:** Chat-Seite in dieser Astro-Website (statisch auf GitHub Pages → Backend nötig, z. B. Serverless Function); Schlüssel nie im Client. Alternativ Telegram/Discord-Bot.

## Offene Fragen
- Was genau ist "Studo" hier (Studo-App/-Website, Uni-Plattform, eigenes Projekt)? Welche Inhalte (Foren, Lehrunterlagen, Studienportal)?
- Offizielle Schnittstelle, oder Scraping (rechtlich/technisch heikel)?
- Für wen: nur für mich oder auch für andere (Login, Datenschutz)? Dürfen fremde Beiträge/Unterlagen indexiert werden?
- Welches Sprachmodell, und wo laufen die Daten (lokal vs. Cloud)?

## Nächste Schritte
- [ ] Zugangsweg und Nutzungsbedingungen klären.
- [ ] Prototyp: 20–50 Seiten/Dokumente indexieren, Fragen stellen, Quelle anzeigen.
- [ ] Konfidenz-Methode festlegen und mit ca. 30 Testfragen kalibrieren.
- [ ] Erst danach Zugang/Automatisierung und Web-Einbindung klären.
