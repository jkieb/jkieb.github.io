# Zeugnisse & Zertifikate

Hier liegen die **geschwärzten** PDFs, die auf der Seite verlinkt sind. Alles in
diesem Ordner ist öffentlich unter `https://jkieb.github.io/zeugnisse/<datei>.pdf`
abrufbar – ohne Login, für Suchmaschinen indexierbar.

## Ablauf

### 1. Original ablegen

Scans kommen nach `roh/` im Projektordner. Der ist über `.gitignore`
ausgeschlossen und landet nie auf GitHub.

```
mkdir -p roh
# Scans nach roh/ kopieren
```

### 2. Nachsehen, was weg muss

```
python3 tools/schwaerzen.py vorschau roh/zeugnis-firma.pdf
```

Das legt `roh/zeugnis-firma_vorschau/seite-1.png` usw. an – jede Seite mit rotem
Koordinatenraster. Dort die Eckpunkte der Bereiche ablesen, die verschwinden
sollen. Der Ursprung ist oben links, Einheit sind PDF-Punkte (72 pt = 2,54 cm).

Typischerweise raus müssen:

- Geburtsdatum
- Privatadresse
- Unterschriften (deine und die der Vorgesetzten)
- Personalnummer / Sozialversicherungsnummer
- Telefonnummer und private E-Mail-Adresse

Firmenname, Zeitraum und Tätigkeitsbeschreibung bleiben – das ist ja der Punkt
der Sache.

### 3. Schwärzen

```
python3 tools/schwaerzen.py schwaerzen roh/zeugnis-firma.pdf \
    -o zeugnisse/praktikum-firma-2024.pdf \
    --suche "01.02.2003" \
    --suche "Musterstraße 12" \
    --box "1:60,640,300,720"
```

- `--suche` findet Text im PDF und entfernt ihn (mehrfach angebbar,
  Groß-/Kleinschreibung egal). Klappt nur, wenn das PDF eine Textebene hat.
- `--box "SEITE:x0,y0,x1,y1"` entfernt ein Rechteck – der Weg für Scans und für
  Unterschriften. `*` statt der Seitenzahl trifft alle Seiten.

Das Skript legt **kein schwarzes Rechteck obendrauf**, sondern löscht Text,
Vektoren und Bildpixel im markierten Bereich, rastert die Seite anschließend neu
und entfernt alle Metadaten. Was geschwärzt ist, ist wirklich weg – auch für
"Text markieren und kopieren" oder ein Auslesen der Rohdatei.

### 4. Ergebnis kontrollieren

Vor dem Commit die fertige Datei aufmachen und durchsehen. Prüfen:

- Ist wirklich alles Schwarze schwarz und nichts Wichtiges verdeckt?
- Text markieren im PDF-Viewer – es darf sich gar nichts markieren lassen
  (die Seite ist gerastert).

### 5. Auf der Seite verlinken

In `main.js` ganz oben steht die Liste `zeugnisse`. Pro Dokument einen Eintrag
ergänzen:

```js
{
  titel: "Praktikum Konstruktion",
  aussteller: "Firma XY GmbH",
  zeitraum: "Juli – August 2024",
  text: "Mitarbeit an CAD-Modellen und Fertigungszeichnungen.",
  datei: "zeugnisse/praktikum-firma-2024.pdf",
},
```

Solange die Liste leer ist, blendet die Seite den ganzen Abschnitt samt
Menüpunkt aus – es entstehen also keine toten Links.

### 6. Hochladen

```
git add zeugnisse/ main.js
git commit -m "Zeugnis Firma XY ergänzt"
git push
```

## Namensschema

Kleinbuchstaben, Bindestriche, keine Umlaute, Jahr hinten dran:

```
praktikum-firma-2024.pdf
zertifikat-cs50-2024.pdf
```

## Wenn doch mal etwas Ungeschwärztes hochgeht

Ein `git rm` reicht nicht – die Datei bleibt über die Historie abrufbar. Dann
muss die Historie umgeschrieben werden (`git filter-repo`) und anschließend
force-gepusht. Deshalb: lieber einmal mehr kontrollieren als einmal zu wenig.
