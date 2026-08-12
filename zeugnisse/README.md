# Zeugnisse & Zertifikate

Hier liegen die **geschwärzten** PDFs, die auf der Seite verlinkt sind. Alles in
diesem Ordner ist öffentlich unter `https://jkieb.github.io/zeugnisse/<datei>.pdf`
abrufbar – ohne Login und für Suchmaschinen indexierbar.

## Ein Dokument ergänzen

1. **Schwärzen** – im PDF-Programm deiner Wahl, bevor die Datei hierher kommt.
   Achte darauf, dass der Inhalt wirklich entfernt und nicht nur ein Rechteck
   darübergelegt wird (siehe Kontrolle unten).

2. **Ablegen** unter `zeugnisse/`, Dateiname klein, mit Bindestrichen, ohne
   Umlaute, Jahr hinten dran:

   ```
   praktikum-siemens-healthineers-2025.pdf
   praktikum-general-laser-2021.pdf
   ```

3. **Verlinken** – in `main.js` steht ganz oben die Liste `zeugnisse`. Pro
   Dokument ein Eintrag:

   ```js
   {
     titel: "Praktikum Konstruktion",
     aussteller: "Firma XY GmbH",
     zeitraum: "Juli – August 2024",
     text: "Mitarbeit an CAD-Modellen und Fertigungszeichnungen.",
     datei: "zeugnisse/praktikum-firma-2024.pdf",
   },
   ```

   Ist die Liste leer, blendet die Seite den Abschnitt samt Menüpunkt aus – es
   entstehen also keine toten Links.

4. **Hochladen:** `git add zeugnisse/ main.js && git commit && git push`

## Was üblicherweise raus muss

- Geburtsdatum
- Privatadresse, Telefonnummer, private E-Mail-Adresse
- Personalnummer, Sozialversicherungsnummer
- Unterschriften – deine und die der Vorgesetzten

Firmenname, Zeitraum und Tätigkeitsbeschreibung bleiben, das ist ja der Punkt
der Sache. Die getippten Namen der Unterzeichnenden stehen auf dem Briefkopf und
sind unkritisch, die handschriftlichen Unterschriften nicht.

## Kontrolle vor dem Commit

Ein schwarzes Rechteck über dem Text ist keine Schwärzung – in vielen Programmen
bleibt der Inhalt darunter erhalten und lässt sich wieder freilegen. Deshalb bei
jedem neuen PDF prüfen:

- **Text markieren.** Im PDF-Viewer über die geschwärzte Stelle ziehen und
  kopieren. Es darf nichts herauskommen.
- **Bei Scans:** das eingebettete Bild ansehen, nicht nur die gerenderte Seite.
  Wenn die Balken nur im PDF liegen und nicht im Bild selbst, sind die Daten noch
  da. Sicher ist ein Scan, bei dem die Balken schon im Bild schwarz sind.

Die beiden vorhandenen Dateien wurden so geprüft und sind sauber: General Laser
ist ein reiner Bildscan ohne Textebene, die geschwärzten Bereiche sind schon im
Bild selbst reines Schwarz. Beim Siemens-Zeugnis ist das Geburtsdatum tatsächlich
aus der Textebene entfernt, unter den Balken liegt kein Text und keine Grafik.

## Wenn doch mal etwas Ungeschwärztes hochgeht

Ein `git rm` reicht nicht – die Datei bleibt über die Git-Historie abrufbar. Dann
muss die Historie umgeschrieben werden (`git filter-repo`) und anschließend
force-gepusht. Deshalb lieber einmal mehr kontrollieren als einmal zu wenig.

Ungeschwärzte Originale gehören nach `roh/`; der Ordner ist über `.gitignore`
ausgeschlossen und kann nicht versehentlich mitcommittet werden.
