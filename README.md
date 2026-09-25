# Federal AI Visibility Snapshot

Static landing site for the $497 Federal AI Visibility Snapshot, from the team behind [GovConTrack](https://govcontrack.org/). There is no build step. GitHub Pages serves this repository from the `main` branch root:

**https://yarosim.github.io/ai-visibility-snapshot/**

In the repo on GitHub: Settings → Pages → Build and deployment → Deploy from a branch → `main` → `/ (root)`.

## What’s in the root

| File | Role |
|---|---|
| `index.html` | Sales page, question form, Snapshot intake, free mini-check |
| `privacy.html` | What the forms collect |
| `thank-you.html` | Page FormSubmit opens after a no-JavaScript submit |
| `config.js` | The only place to set the checkout URL |
| `site.js` | Payment-link switch and form handler |
| `styles.css` | Layout |
| `robots.txt` | Allows all crawlers, including AI crawlers |
| `sitemap.xml` | Home and privacy |
| `favicon.svg`, `favicon-32.png` | Icon |
| `.nojekyll` | Stops GitHub Pages from running Jekyll |

Canonical and Open Graph URLs point at the GitHub Pages address above.

## Set PAYMENT_LINK

1. Open `config.js`.
2. Set `PAYMENT_LINK` to the full checkout URL, including `https://`.

```javascript
window.SITE_CONFIG = {
  PAYMENT_LINK: "https://buy.stripe.com/your-link"
};
```

3. Commit that change and push it to `main`.

Leave the value as `""` until the link exists. Anything that is not an `http` or `https` URL is ignored.

While `PAYMENT_LINK` is empty:

- Every “Get my Snapshot, $497” button opens the intake form (`#order`).
- The Service structured data has no `offers.url`.

After you set a URL:

- Those buttons open checkout in a new tab.
- The intake form stays on the page (the pricing card, the footer, and `#order`).
- `site.js` adds `offers.url` to the Service JSON-LD in the browser. Crawlers that don’t run JavaScript keep seeing the offer without a URL, which is correct until you want that URL in the raw HTML too. One config value is enough for the buttons.

## Forms

Every form is meant to reach **pnsgloballlc@gmail.com**.

The handler is [FormSubmit.co](https://formsubmit.co/). With JavaScript, the page posts to:

`https://formsubmit.co/ajax/pnsgloballlc@gmail.com`

Without JavaScript, the same form posts to `https://formsubmit.co/pnsgloballlc@gmail.com` and FormSubmit redirects to `thank-you.html`.

Each form has:

- A hidden `_honey` field. If it is filled, the browser does not send the form, and FormSubmit drops it if it arrives anyway.
- A success or error message on the page (`role="status"`).
- A `mailto:pnsgloballlc@gmail.com` link under the button.

The three forms are: a question (name, work email, company, message), the Snapshot intake (the fields in the offer, plus a consent checkbox; phone is optional), and the free mini-check (name, email, company website).

### Activate FormSubmit once, after deploy

FormSubmit will not deliver mail until the inbox confirms the address. Do this yourself after the site is live. Don’t expect a test from this repo to have triggered it.

1. Open the live page and submit one form with a real note (any of the three).
2. Check **pnsgloballlc@gmail.com** for FormSubmit’s activation message.
3. Open the activation link in that message.
4. Submit once more and confirm the message lands in that inbox.

Until that link is clicked, the form’s error text will say that activation is still required. The mailto link under the form works either way.

`_captcha` is `false` so the on-page success message isn’t replaced by a captcha redirect. The honeypot is the spam guard. If spam gets through, set the hidden `_captcha` field on each form to `true`.

## Custom domain later

### Subdomain

A hostname such as `snapshot.govcontrack.org` can be the GitHub Pages custom domain.

1. In the repo, add a `CNAME` file whose only line is that hostname.
2. Settings → Pages → Custom domain → save it, then wait until the certificate is ready.
3. At the DNS host for govcontrack.org, add a `CNAME` record from that host to `yarosim.github.io`.
4. Update the canonical URL, `og:url`, `sitemap.xml` `<loc>` values, and each form’s `_next` address so they use the new origin.

### A path on govcontrack.org

`govcontrack.org/ai-visibility` is not something GitHub Pages can publish by itself. Pages replaces the hostname; it does not mount this project on a path of another site.

Two ways to get that path:

- Redirect `https://govcontrack.org/ai-visibility` to `https://yarosim.github.io/ai-visibility-snapshot/`.
- Reverse-proxy that path on the GovConTrack host to this site.

Asset paths are already relative, so a proxy can serve the folder at `/ai-visibility/`. After either change, point canonical, Open Graph, and sitemap URLs at `https://govcontrack.org/ai-visibility/`.

## Preview locally

```bash
python3 -m http.server 8080
```

Open http://127.0.0.1:8080/

Submitting a form locally can trigger the one-time FormSubmit activation email. Use the mailto links if you only want to check the page.

## Copy

The page keeps the supplied sales copy, including the dated 24 September 2026 sample and the delivery guarantee. It does not add testimonials, client logos, or ranking promises.
