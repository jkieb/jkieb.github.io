#!/usr/bin/env python3
"""Schwärzt Zeugnisse und Zertifikate, bevor sie öffentlich hochgeladen werden.

Wichtig: Hier wird nicht nur ein schwarzes Rechteck über den Inhalt gelegt.
Der Inhalt wird tatsächlich aus der Datei entfernt (Text, Vektoren und
Bildpixel), zusätzlich werden alle Metadaten gelöscht. Im Standardmodus wird
die Seite danach noch gerastert, damit garantiert keine Textebene übrig bleibt.

Verwendung
----------
1. Vorschau mit Koordinatenraster erzeugen (zeigt, wo was liegt):

       python3 tools/schwaerzen.py vorschau roh/zeugnis.pdf

   Legt PNGs in `roh/zeugnis_vorschau/` an. Dort die Koordinaten der
   Bereiche ablesen, die weg sollen (Unterschrift, Adresse, ...).

2. Schwärzen:

       python3 tools/schwaerzen.py schwaerzen roh/zeugnis.pdf \
           -o zeugnisse/praktikum-firma-2024.pdf \
           --suche "Musterstraße 12" --suche "01.02.2003" \
           --box "1:60,640,300,720"

   --suche  Textstelle, die entfernt wird (überall im Dokument, Groß- und
            Kleinschreibung egal). Funktioniert nur bei PDFs mit Textebene.
   --box    Rechteck in Punkten als "SEITE:x0,y0,x1,y1". Ursprung ist oben
            links. SEITE ist 1-basiert, "*" trifft alle Seiten. Das ist der
            Weg für gescannte Zeugnisse ohne Textebene.

Abhängigkeit: PyMuPDF  ->  pip install pymupdf
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    import pymupdf
except ImportError:  # pragma: no cover - reine Bedienerführung
    sys.exit(
        "PyMuPDF fehlt. Installieren mit:\n\n    pip install pymupdf\n"
    )

BILD_ENDUNGEN = {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".bmp", ".webp"}

# Raster der Vorschau in PDF-Punkten (72 pt = 1 Zoll = 25,4 mm).
RASTER_SCHRITT = 50


def dokument_oeffnen(pfad: Path) -> pymupdf.Document:
    """Öffnet PDFs direkt, Bilder werden vorher in ein PDF gewandelt."""
    if pfad.suffix.lower() in BILD_ENDUNGEN:
        with pymupdf.open(pfad) as bild:
            return pymupdf.open("pdf", bild.convert_to_pdf())
    return pymupdf.open(pfad)


def box_parsen(angabe: str, seitenzahl: int) -> list[tuple[int, pymupdf.Rect]]:
    """Wandelt "SEITE:x0,y0,x1,y1" in (Seitenindex, Rect)-Paare."""
    if ":" not in angabe:
        raise argparse.ArgumentTypeError(
            f"--box '{angabe}': Format ist SEITE:x0,y0,x1,y1, z. B. 1:60,640,300,720"
        )
    seiten_teil, koordinaten_teil = angabe.split(":", 1)
    try:
        x0, y0, x1, y1 = (float(w) for w in koordinaten_teil.split(","))
    except ValueError:
        raise argparse.ArgumentTypeError(
            f"--box '{angabe}': Es braucht genau vier Zahlen x0,y0,x1,y1."
        ) from None

    rect = pymupdf.Rect(x0, y0, x1, y1)
    if rect.is_empty:
        raise argparse.ArgumentTypeError(
            f"--box '{angabe}': Rechteck ist leer – x1 muss größer als x0 sein, y1 größer als y0."
        )

    seiten_teil = seiten_teil.strip()
    if seiten_teil == "*":
        return [(i, rect) for i in range(seitenzahl)]

    try:
        nummer = int(seiten_teil)
    except ValueError:
        raise argparse.ArgumentTypeError(
            f"--box '{angabe}': Seite muss eine Zahl oder '*' sein."
        ) from None
    if not 1 <= nummer <= seitenzahl:
        raise argparse.ArgumentTypeError(
            f"--box '{angabe}': Seite {nummer} gibt es nicht (Dokument hat {seitenzahl})."
        )
    return [(nummer - 1, rect)]


def vorschau(pfad: Path, dpi: int) -> Path:
    """Rendert jede Seite mit Koordinatenraster als PNG."""
    ziel = pfad.parent / f"{pfad.stem}_vorschau"
    ziel.mkdir(parents=True, exist_ok=True)

    with dokument_oeffnen(pfad) as doc:
        for nummer, seite in enumerate(doc, start=1):
            breite, hoehe = seite.rect.width, seite.rect.height

            # Raster und Beschriftung direkt auf die Seite zeichnen – das
            # passiert nur in der Vorschau, die Originaldatei bleibt unberührt.
            zeichner = seite.new_shape()
            x = 0.0
            while x <= breite:
                stark = int(x) % (RASTER_SCHRITT * 2) == 0
                zeichner.draw_line(pymupdf.Point(x, 0), pymupdf.Point(x, hoehe))
                zeichner.finish(
                    color=(1, 0, 0), width=0.7 if stark else 0.3, stroke_opacity=0.55
                )
                x += RASTER_SCHRITT

            y = 0.0
            while y <= hoehe:
                stark = int(y) % (RASTER_SCHRITT * 2) == 0
                zeichner.draw_line(pymupdf.Point(0, y), pymupdf.Point(breite, y))
                zeichner.finish(
                    color=(1, 0, 0), width=0.7 if stark else 0.3, stroke_opacity=0.55
                )
                y += RASTER_SCHRITT
            zeichner.commit()

            for x in range(0, int(breite) + 1, RASTER_SCHRITT * 2):
                seite.insert_text(
                    pymupdf.Point(x + 2, 10), str(x), fontsize=7, color=(1, 0, 0)
                )
            for y in range(0, int(hoehe) + 1, RASTER_SCHRITT * 2):
                seite.insert_text(
                    pymupdf.Point(2, y - 2), str(y), fontsize=7, color=(1, 0, 0)
                )

            ausgabe = ziel / f"seite-{nummer}.png"
            seite.get_pixmap(dpi=dpi).save(ausgabe)
            print(f"  Seite {nummer}: {ausgabe}  ({breite:.0f} x {hoehe:.0f} pt)")

    return ziel


def rastern(doc: pymupdf.Document, dpi: int) -> pymupdf.Document:
    """Baut ein neues PDF, das nur noch aus Seitenbildern besteht.

    Damit verschwinden Textebene, Annotationen, eingebettete Dateien und alles
    andere, was in der Datei sonst noch mitreisen könnte.
    """
    neu = pymupdf.open()
    for seite in doc:
        pix = seite.get_pixmap(dpi=dpi)
        ziel_seite = neu.new_page(width=seite.rect.width, height=seite.rect.height)
        ziel_seite.insert_image(ziel_seite.rect, pixmap=pix)
    return neu


def schwaerzen(
    quelle: Path,
    ziel: Path,
    suchbegriffe: list[str],
    box_angaben: list[str],
    raster: bool,
    dpi: int,
) -> None:
    doc = dokument_oeffnen(quelle)
    treffer_gesamt = 0

    try:
        boxen: list[tuple[int, pymupdf.Rect]] = []
        for angabe in box_angaben:
            boxen.extend(box_parsen(angabe, doc.page_count))

        for index, seite in enumerate(doc):
            rechtecke: list[pymupdf.Rect] = []

            for begriff in suchbegriffe:
                treffer = seite.search_for(begriff)
                if treffer:
                    print(
                        f"  Seite {index + 1}: '{begriff}' {len(treffer)}x gefunden"
                    )
                rechtecke.extend(treffer)

            rechtecke.extend(rect for seiten_index, rect in boxen if seiten_index == index)

            for rect in rechtecke:
                seite.add_redact_annot(rect, fill=(0, 0, 0))

            if rechtecke:
                treffer_gesamt += len(rechtecke)
                # images=PDF_REDACT_IMAGE_PIXELS überschreibt die Pixel im Bild
                # selbst – bei Scans ist genau das der entscheidende Teil.
                seite.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_PIXELS)

        for begriff in suchbegriffe:
            if not any(seite.search_for(begriff) for seite in doc):
                continue
            print(f"  ACHTUNG: '{begriff}' ist nach dem Schwärzen noch auffindbar.")

        if raster:
            gerastert = rastern(doc, dpi)
            doc.close()
            doc = gerastert

        # Metadaten und XMP entfernen: dort stehen sonst Scanner-Modell,
        # Autor, Originaldateiname und Zeitstempel drin.
        doc.del_xml_metadata()
        doc.set_metadata({})

        ziel.parent.mkdir(parents=True, exist_ok=True)
        doc.save(ziel, garbage=4, deflate=True, clean=True)
    finally:
        doc.close()

    groesse = ziel.stat().st_size / 1024
    print(f"\n  Geschrieben: {ziel} ({groesse:.0f} kB, {treffer_gesamt} Bereiche geschwärzt)")
    if not treffer_gesamt:
        print("  Hinweis: Es wurde nichts geschwärzt – --suche/--box angegeben?")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Zeugnisse schwärzen, bevor sie öffentlich hochgeladen werden.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    unterbefehle = parser.add_subparsers(dest="befehl", required=True)

    p_vorschau = unterbefehle.add_parser(
        "vorschau", help="Seiten mit Koordinatenraster als PNG rendern"
    )
    p_vorschau.add_argument("datei", type=Path)
    p_vorschau.add_argument("--dpi", type=int, default=150)

    p_schwaerzen = unterbefehle.add_parser(
        "schwaerzen", help="Bereiche endgültig entfernen"
    )
    p_schwaerzen.add_argument("datei", type=Path)
    p_schwaerzen.add_argument("-o", "--ausgabe", type=Path, required=True)
    p_schwaerzen.add_argument(
        "--suche", action="append", default=[], metavar="TEXT",
        help="Textstelle, die entfernt wird (mehrfach möglich)",
    )
    p_schwaerzen.add_argument(
        "--box", action="append", default=[], metavar="SEITE:x0,y0,x1,y1",
        help="Rechteck, das entfernt wird (mehrfach möglich)",
    )
    p_schwaerzen.add_argument(
        "--kein-raster", dest="raster", action="store_false",
        help="Textebene erhalten (nur für digitale PDFs ohne Scan sinnvoll)",
    )
    p_schwaerzen.add_argument("--dpi", type=int, default=200)

    args = parser.parse_args()

    if not args.datei.exists():
        print(f"Datei nicht gefunden: {args.datei}", file=sys.stderr)
        return 1

    if args.befehl == "vorschau":
        print(f"Vorschau für {args.datei}:")
        vorschau(args.datei, args.dpi)
        return 0

    if args.ausgabe.resolve() == args.datei.resolve():
        print("Ausgabe darf nicht die Quelldatei sein.", file=sys.stderr)
        return 1

    print(f"Schwärze {args.datei}:")
    schwaerzen(
        args.datei, args.ausgabe, args.suche, args.box, args.raster, args.dpi
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
