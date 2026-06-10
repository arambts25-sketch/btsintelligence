# Seobility Learnings vom 2026-06-04

## Was echte Probleme waren

- Canonicals duerfen nicht auf Redirect-Ziele zeigen. Wenn Vercel `/leistungen/` auf `/leistungen` weiterleitet, muss der Canonical direkt auf `/leistungen` zeigen.
- Sitemap-URLs muessen dieselbe URL-Policy wie die Live-Seite verwenden. Fuer diese Website ist die kanonische Form slashlos, ausser der Homepage `/`.
- Interne Links sollten direkt auf die finale `200 OK`-URL gehen. Links auf `/preise/`, `/ratgeber/` oder `/demos/.../` erzeugen unnoetige interne Redirects.

## Was mittelwichtig war

- Lange Seitentitel und Meta-Descriptions sind selten harte Ranking-Fehler, aber sie werden in Snippets abgeschnitten und wirken unsauber.
- H1- oder Title-Woerter sollten im sichtbaren Body natuerlich wieder auftauchen. Ein kurzer, sinnvoller Intro-Satz reicht meist.
- Open-Graph- und Twitter-Titles sollten bei Title-Aenderungen mitgezogen werden, damit Sharing-Snippets konsistent bleiben.

## Was eher Tool-Kosmetik war

- Wiederholter Footer-, Legal- und CTA-Text ist normaler Seiten-Chrome und nicht automatisch Duplicate-Content im problematischen Sinn.
- Viele `strong`-Tags sind nur dann relevant, wenn sie komplette Saetze oder wiederholte Struktur-Labels semantisch falsch betonen.
- Wiederkehrende Autorenboxen und Foerder-CTAs koennen bleiben, solange Hauptartikel und Suchintention klar eigenstaendig sind.

## Regeln fuer kuenftige Seiten

- Neue Directory-Seiten immer slashlos verlinken: `/leistungen`, nicht `/leistungen/`.
- Canonical aus der finalen Live-URL ableiten und nicht aus dem Dateipfad `.../index.html`.
- Sitemap-Eintrag, Canonical, interne Links, `og:url` und sichtbare Navigation muessen dieselbe URL verwenden.
- Title grob unter 55 Zeichen halten, bevorzugt: `Hauptkeyword | BTS`.
- Meta-Description grob bei 120-155 Zeichen halten und das Hauptkeyword frueh nennen.
- H1 darf laenger und menschlicher sein; die wichtigsten H1-Begriffe sollten im ersten Body-Absatz wieder vorkommen.
- Labels wie `Problem:`, `Loesung:` oder `Ergebnis:` besser als gestylte Spans statt als `strong` auszeichnen, wenn sie rein strukturell sind.

## Pruefung vor Deploy

- Lokale SEO-Pruefung laufen lassen:
  - keine non-home Canonicals mit trailing slash;
  - keine Sitemap-URLs mit trailing slash ausser Homepage;
  - keine internen Links auf bekannte Redirect-Varianten;
  - jede indexierbare Seite hat genau eine H1.
- `npm run build` im Root ausfuehren.
- Wenn `astro/public` synchronisiert wurde: `cd astro && npm run build`.
- Nach Deploy stichprobenartig live pruefen:
  - `https://www.btsintelligence.de/leistungen` muss `200` liefern;
  - `https://www.btsintelligence.de/leistungen/` darf nur als Alt-URL auf slashlos redirecten.
