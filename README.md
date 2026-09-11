# sotasci.com

Source for the Sotasci (SOTA Science Inc.) marketing site, served via GitHub
Pages from this repo's root (custom domain in `CNAME`).

Static HTML only — no frameworks, no build step, no bundler. One shared
stylesheet and one small vanilla JS file.

## Structure

```
index.html         Home — hero, product cards, principles, contact CTA
ember-quest.html    Product page: Ember Quest
sellsnap.html       Product page: Sellsnap
privacy.html        Privacy policy (site + both apps)
support.html        FAQ + how to get help / file a bug report
contact.html        Contact form (Formspree) + email fallback
404.html            GitHub Pages 404 page
style.css           Shared styles (layout, light/dark via prefers-color-scheme)
script.js           Mobile nav toggle + progressive-enhancement contact form
logo.png            Site logo / favicon
CNAME               Custom domain for GitHub Pages
```

Every page shares the same header/nav/footer markup (hand-copied, since there's
no templating layer). If you add a page, copy the header and footer from an
existing one and add it to the nav lists and footer link lists on every page,
including 404.html's footer.

## Preview locally

No build step needed. From this directory:

```
python3 -m http.server 8000
```

Then open http://localhost:8000/.

## Contact form / Formspree

The contact form posts to a Formspree endpoint:

```
https://formspree.io/f/mgegpgee
```

To point it at a different Formspree form (or your own endpoint), update the
`action` attribute on the `<form>` in `contact.html` — it's the only place
this URL appears. The form works two ways:

- **With JS**: `script.js` intercepts the submit, POSTs via `fetch`, and shows
  an inline "thanks" message without leaving the page.
- **Without JS**: the browser does a normal form POST to Formspree, which
  shows its own confirmation page.

The form also includes a honeypot field (`_gotcha`, visually and semantically
hidden) to cut down on spam; Formspree ignores submissions where it's filled.

Product CTAs ("Join the beta", "Get notified") link to
`contact.html?subject=...`; `script.js` reads that query param to prefill the
hidden Formspree subject field and seed the message textarea.

## Product names

**Ember Quest** and **Sellsnap** are placeholder names used throughout this
site's copy, filenames, and CTAs. If either app is renamed, update:

- The `<title>` and copy in `ember-quest.html` / `sellsnap.html`
- Card copy and links on `index.html`
- FAQ entries on `support.html`
- App-specific sections of `privacy.html`
- Any `contact.html?subject=...` links referencing the old name

## Outstanding TODOs

Search the HTML for `<!-- TODO -->` comments — currently:

- `hello@sotasci.com` (general contact) and `privacy@sotasci.com` (privacy
  contact) are placeholder addresses. Replace with real inboxes before
  launch, in `contact.html`, `privacy.html`, and `support.html`.
