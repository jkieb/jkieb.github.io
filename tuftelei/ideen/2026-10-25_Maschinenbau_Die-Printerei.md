---
title: "Die Printerei: Reparatur gebrochener Kunststoffteile per Scan und 3D-Druck"
date: 2026-10-25
bereich: "Maschinenbau / Unternehmen"
status: Roh
---

## Kernidee
Unternehmen **"Die Printerei"**, spezialisiert auf das Reparieren bzw. Nachbauen gebrochener Kunststoffteile: Henkel, Zahnräder, Untersetzer, Clips, Knöpfe. Ablauf: **3D-Scan → Reverse Engineering (KI-gestützt) → Konstruktion → 3D-Druck**.

## Gedanken zum Start
- **Prozess:**
  1. Kund:in schickt Teil (und Bruchstücke) oder Fotos.
  2. Scan (Fotogrammetrie/Handscanner), Netz bereinigen.
  3. Fehlende Geometrie ergänzen: KI rekonstruiert Bruchflächen und symmetrische Formen, Zahnräder werden parametrisch aus Modul, Zähnezahl, Eingriffswinkel neu erzeugt (CAD).
  4. Material passend wählen (PETG, Nylon, TPU, ggf. SLS/Harz) und drucken.
  5. Maßprüfung, Versand.
- **Wert:** Ersatzteile für Geräte, die nicht mehr lieferbar sind; Reparatur statt Neukauf (Nachhaltigkeit, Right-to-Repair).
- **Technik:** Scanner (Strukturlicht-Handscanner), FDM- und Harzdrucker, CAD (Fusion/FreeCAD), Reverse-Engineering-Software; KI für Lückenfüllung und Symmetrieerkennung.
- **Haken:** Haftung bei sicherheitsrelevanten Teilen (Bremse, Gurt, Elektrik) → ausschließen oder klar ablehnen. Festigkeit gedruckter Teile (Schichthaftung) ist geringer als Spritzguss; Geometrie ggf. verstärken. Urheber- und Designschutz bei Originalteilen beachten.
- **Skalierung:** Teile-Bibliothek, Online-Konfigurator (Foto hochladen → Angebot), Kooperation mit Repair-Cafés und Herstellern.

## Offene Fragen
- Marktgröße: Wer zahlt für ein Einzelteil, und wie viel (Preis vs. Neugerät)?
- Aufwand pro Teil: Wie viel lässt sich automatisieren, damit ein Teil unter ca. 1 h Arbeit bleibt?
- Gewerbe, Haftung und Versicherung in Österreich?
- Welche Teile sind lohnend (Zahnräder, Griffe) und welche nicht?

## Nächste Schritte
- [ ] 5 reale defekte Teile aus dem Bekanntenkreis reparieren und Zeit/Kosten messen.
- [ ] Workflow Foto/Scan → CAD → Druck dokumentieren; KI-Schritt testen.
- [ ] Preisliste und Haftungsausschluss entwerfen; Name "Die Printerei" prüfen.
