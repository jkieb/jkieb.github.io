---
title: "Strom herstellen, speichern, Arbitrage (Solar + Batterie)"
date: 2026-10-24
bereich: "Energie"
status: Roh
---

## Kernidee
Strom mit Solar erzeugen, in Batterien speichern und mit Preisunterschieden Geld verdienen: laden bei niedrigem oder negativem Preis, einspeisen oder verbrauchen bei hohem Preis.

## Gedanken zum Start
- **Ertragsquellen:** Eigenverbrauch erhöhen, Börsenpreis-Arbitrage (dynamischer Tarif, z. B. Day-Ahead/Intraday), ggf. Regelenergie.
- **Rechnung (grob):** Gewinn pro Zyklus ≈ nutzbare kWh × (Verkaufspreis − Kaufpreis) × Wirkungsgrad (ca. 85–92 % Round-Trip), minus Zellverschleiß pro Zyklus.
- **Haken:** Abgaben, Netzentgelte und Steuern können den Spread auffressen; Regeln zu Netzeinspeisung und Anmeldung beachten.
- **Technik:** PV-Anlage, Hybridwechselrichter, LFP-Speicher, Steuerung anhand von Preisprognose (Home Assistant, evcc o. Ä.).
- **Skalierung:** Erst Heimanlage, später Gewerbe oder Gemeinschaft.

## Offene Fragen
- Land und Markt: Österreich oder Deutschland? Welche dynamischen Tarife sind verfügbar?
- Wie hoch ist der realistische Spread nach allen Abgaben?
- Amortisation: Kosten pro gespeicherter kWh über die Lebensdauer (Zyklen) vs. Spread?
- Rechtlich/steuerlich: Gewerbe nötig? Netzbetreiber-Auflagen?

## Nächste Schritte
- Simulation in Python/Excel mit historischen Day-Ahead-Preisen (z. B. ENTSO-E, aWATTar).
- Break-even für verschiedene Speichergrößen berechnen.
