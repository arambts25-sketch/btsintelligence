# FlowMind AI — Website

Statische One-Page-Website für FlowMind AI.

## Projektstruktur

```
flowmindai/
├── index.html          ← Komplette Website (HTML + CSS + JS inline)
├── robots.txt          ← SEO: Crawler-Regeln
├── sitemap.xml         ← SEO: Sitemap (URL anpassen!)
├── _headers            ← Netlify / Cloudflare Pages: Security-Header & Caching
├── _redirects          ← Netlify: Weiterleitungsregeln
├── vercel.json         ← Vercel: Header & Clean-URLs
└── assets/
    ├── icon.svg        ← Favicon (SVG)
    ├── site.webmanifest← PWA-Manifest
    ├── favicon.ico     ← Favicon ICO (selbst erstellen, z.B. favicon.io)
    ├── apple-touch-icon.png ← 180×180px PNG (selbst erstellen)
    └── og-image.png    ← 1200×630px Open-Graph-Bild (selbst erstellen)
```

---

## Vor dem Deploy: Checkliste

1. **Domain anpassen** — alle `https://www.flowmind.ai` in `index.html` und `sitemap.xml` durch eure echte Domain ersetzen
2. **Fehlende Assets erstellen:**
   - `assets/favicon.ico` → kostenlos auf [favicon.io](https://favicon.io)
   - `assets/apple-touch-icon.png` → 180×180px, dunkler Hintergrund + Logo
   - `assets/og-image.png` → 1200×630px (wichtig für LinkedIn-Vorschauen)
3. **Sitemap-Datum** in `sitemap.xml` aktualisieren

---

## Deployment

### Option A — Netlify (empfohlen, kostenlos)

```bash
# 1. Netlify CLI installieren
npm install -g netlify-cli

# 2. In den Projektordner wechseln
cd flowmindai

# 3. Deployen
netlify deploy --prod --dir .
```

Oder einfach den Ordner auf **netlify.com** per Drag & Drop hochladen.
`_headers` und `_redirects` werden automatisch erkannt.

---

### Option B — Vercel (kostenlos)

```bash
# 1. Vercel CLI installieren
npm install -g vercel

# 2. In den Projektordner wechseln
cd flowmindai

# 3. Deployen
vercel --prod
```

`vercel.json` wird automatisch erkannt.

---

### Option C — GitHub Pages (kostenlos)

```bash
# 1. Git-Repository initialisieren
cd flowmindai
git init
git add .
git commit -m "Initial deploy"

# 2. Auf GitHub pushen
git remote add origin https://github.com/DEIN-USERNAME/flowmindai.git
git push -u origin main

# 3. In GitHub → Settings → Pages → Source: main branch → / (root)
```

Hinweis: `_headers` und `_redirects` funktionieren bei GitHub Pages nicht —
Security-Header werden dort nicht unterstützt. Netlify oder Vercel bevorzugen.

---

### Option D — Eigener Server (Apache/Nginx)

Einfach alle Dateien in das Web-Root kopieren:

```bash
scp -r flowmindai/* user@server:/var/www/html/
```

Für Apache: `.htaccess` mit Security-Headern hinzufügen (auf Anfrage).

---

## Custom Domain

Bei Netlify / Vercel nach dem ersten Deploy unter **Domain Settings** eintragen.
Danach DNS beim Domain-Anbieter auf den Netlify/Vercel-Nameserver zeigen lassen.
SSL wird automatisch über Let's Encrypt aktiviert.

---

## Kontakt / Anpassungen

Bei Fragen zur Website: aram.bts25@gmail.com
