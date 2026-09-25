# Federal AI Visibility Snapshot

Static landing site for the $497 Federal AI Visibility Snapshot, from the team behind [GovConTrack](https://govcontrack.org/). There is no build step. GitHub Pages serves this repository from the `main` branch root:

**https://yarosim.github.io/ai-visibility-snapshot/**

This repository is public, and GitHub Pages publishes every file on `main`. [SECURITY.md](SECURITY.md) is the rule for what must never be committed: secret keys, customer submissions, inbox exports, and internal notes.

In the repo on GitHub: Settings → Pages → Build and deployment → Deploy from a branch → `main` → `/ (root)`.

## What’s in the root

| File | Role |
|---|---|
| `index.html` | Sales page, question form, Snapshot intake, free mini-check |
| `privacy.html` | What the forms collect |
| `thank-you.html` | Form confirmation, and the Stripe return page when `paid=1` |
| `config.js` | The only place to set the checkout URL |
| `site.js` | Payment-link switch and form handler |
| `styles.css` | Layout |
| `robots.txt` | Allows all crawlers, including AI crawlers |
| `sitemap.xml` | Home and privacy |
| `favicon.svg`, `favicon-32.png` | Icon |
| `.nojekyll` | Stops GitHub Pages from running Jekyll |

Canonical and Open Graph URLs point at the GitHub Pages address above.

## Set PAYMENT_LINK

The live $497 Stripe Payment Link is already set in `config.js`:

```javascript
window.SITE_CONFIG = {
  PAYMENT_LINK: "https://buy.stripe.com/cNi5kD1nS1SQ9bI47a2Ji27"
};
```

That checkout collects Company name and Company website. After payment, Stripe redirects to:

https://yarosim.github.io/ai-visibility-snapshot/thank-you.html?paid=1

That address shows a payment-received note, says the receipt and invoice come from Stripe, and links to the intake form. The 48-hour clock starts when the intake is complete. Form submissions still use `thank-you.html?form=order`, `?form=ask`, or `?form=mini`, without `paid=1`.

“Get my Snapshot, $497” opens this checkout link in a new tab. The intake form stays on the page (`#order`). `site.js` adds `offers.url` to the Service JSON-LD in the browser.

To point the buttons somewhere else, replace `PAYMENT_LINK` with a full `http` or `https` URL and push to `main`. An empty string, or anything that is not an `http(s)` URL, sends those buttons to the intake form instead. The Service structured data then has no `offers.url`.

## Forms

The page has three forms: a question, the Snapshot intake, and the free mini-check. Each one is delivered by [FormSubmit.co](https://formsubmit.co/) to **pnsgloballlc@gmail.com**, and each one includes a normal email link to that address if the form does not send.

FormSubmit does not deliver mail until that inbox confirms the address once. Do that from the live site after deploy. A local test can send the same confirmation, so use the email links when you only want to look at the page.

How messages are sorted, and how spam is filtered, stays off this public repository. See [SECURITY.md](SECURITY.md).

## Custom domain later

### Subdomain

A hostname such as `snapshot.govcontrack.org` can be the GitHub Pages custom domain.

1. In the repo, add a `CNAME` file whose only line is that hostname.
2. Settings → Pages → Custom domain → save it, then wait until the certificate is ready.
3. At the DNS host for govcontrack.org, add a `CNAME` record from that host to `yarosim.github.io`.
4. Update the canonical URL, `og:url`, `sitemap.xml` `<loc>` values, and the thank-you address on each form so they use the new origin.

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
