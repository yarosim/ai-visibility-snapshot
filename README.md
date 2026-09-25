# Federal AI Visibility Snapshot

Static landing site for the $497 Federal AI Visibility Snapshot, from the team behind [GovConTrack](https://govcontrack.org/). There is no build step. GitHub Pages serves this repository from the `main` branch root:

**https://yarosim.github.io/ai-visibility-snapshot/**

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

Every form is meant to reach **pnsgloballlc@gmail.com**.

The handler is [FormSubmit.co](https://formsubmit.co/). With JavaScript, the page posts to:

`https://formsubmit.co/ajax/pnsgloballlc@gmail.com`

Without JavaScript, the same form posts to `https://formsubmit.co/pnsgloballlc@gmail.com` and FormSubmit redirects to `thank-you.html`.

Each form has:

- A hidden `_honey` field. If it is filled, the browser does not send the form, and FormSubmit drops it if it arrives anyway.
- A success or error message on the page (`role="status"`).
- A `mailto:pnsgloballlc@gmail.com` link under the button.

The three forms are a question, the Snapshot intake, and the free mini-check. Field names, subjects, and the JSON block are specified under Automation contract.

### Activate FormSubmit once, after deploy

FormSubmit will not deliver mail until the inbox confirms the address. Do this yourself after the site is live. Don’t expect a test from this repo to have triggered it.

1. Open the live page and submit one form with a real note (any of the three).
2. Check **pnsgloballlc@gmail.com** for FormSubmit’s activation message.
3. Open the activation link in that message.
4. Submit once more and confirm the message lands in that inbox.

Until that link is clicked, the form’s error text will say that activation is still required. The mailto link under the form works either way.

`_captcha` is `false` so the on-page success message isn’t replaced by a captcha redirect. The honeypot is the spam guard. If spam gets through, set the hidden `_captcha` field on each form to `true`.

Reply-To on each submission is the customer’s email (`_replyto`, set from the `email` field when JavaScript runs; the field is also named `email` for the no-JavaScript post). FormSubmit’s `_autoresponse` sends the customer a short receipt:

- Snapshot order: `Thanks, we received your request. Your Snapshot is delivered within 48 hours of a completed intake and payment. Reply to this email with any questions.`
- Question: `Thanks, we received your question. Reply to this email if you need to add anything.`
- Mini-check: `Thanks, we received your mini-check request. We’ll reply to this email. This is not the full Snapshot, and it is not a promise that any AI engine will name your firm.`

## Automation contract

An agent reads pnsgloballlc@gmail.com, picks out these messages, and runs delivery. Search Gmail by the subject prefix. The prefix is fixed. JavaScript appends one identifier after it.

| Form | `form_type` | Subject |
|---|---|---|
| Snapshot intake | `snapshot_order` | `[SNAPSHOT-ORDER] <company>` |
| Free mini-check | `mini_check` | `[MINI-CHECK] <website>` |
| Question | `question` | `[QUESTION] <name>` |

Gmail queries: `subject:[SNAPSHOT-ORDER]`, `subject:[MINI-CHECK]`, `subject:[QUESTION]`.

Without JavaScript the subject is only the prefix (`[SNAPSHOT-ORDER]`, `[MINI-CHECK]`, or `[QUESTION]`). The same prefixes are on the mailto fallback under each form.

### Snapshot order fields

These `name` attributes are the intake keys. Required: `company`, `website`, `service`, `naics`, `cert`, `agency`, `contact_name`, `email`, `consent`.

| Key | Required | Notes |
|---|---|---|
| `company` | yes | |
| `legal_name` | no | |
| `website` | yes | |
| `uei` | no | SAM Unique Entity ID |
| `city_state` | no | |
| `service` | yes | Main service in plain words |
| `service_2` | no | Second service |
| `naics` | yes | 6-digit primary NAICS |
| `cert` | yes | One of: `8(a)`, `SDVOSB`, `WOSB`, `EDWOSB`, `HUBZone`, `Small business / none`, `Other` |
| `region` | no | |
| `agency` | yes | Main target agency |
| `vehicle` | no | Contract vehicles |
| `competitor` | no | Up to 3, comma-separated |
| `problem` | no | Buyer problem they solve |
| `contact_name` | yes | |
| `email` | yes | Also used as Reply-To |
| `phone` | no | |
| `consent` | yes | `yes` when the box is checked |

Also sent on this form:

- `form_type` = `snapshot_order`
- `intake_date` = ISO-8601 UTC timestamp, filled by JavaScript on submit (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- `intake_json` = one JSON object, filled by JavaScript, with exactly the keys in the table above, in that order. Missing optional answers are empty strings. `consent` is `"yes"`.

Example `intake_json`:

```json
{
  "company": "Example Federal LLC",
  "legal_name": "",
  "website": "https://example.com",
  "uei": "",
  "city_state": "Arlington, VA",
  "service": "cybersecurity monitoring",
  "service_2": "",
  "naics": "541512",
  "cert": "SDVOSB",
  "region": "",
  "agency": "Department of Veterans Affairs",
  "vehicle": "",
  "competitor": "Firm A, Firm B",
  "problem": "",
  "contact_name": "Ada Lovelace",
  "email": "ada@example.com",
  "phone": "",
  "consent": "yes"
}
```

If `intake_json` is empty, the message was sent without JavaScript. Read the individual fields instead. Ignore FormSubmit fields that start with `_`, and the `Page` field. Those are not intake keys.

The `intake_json` value is a JSON string. If the email body HTML-escapes it (`&quot;` for quotes), unescape that, then parse.

### Mini-check

`form_type` is `mini_check`. `intake_json` keys, in order: `name`, `email`, `website`, `company`. Required on the form: `name`, `email`, `website`. `company` may be an empty string.

### Question

`form_type` is `question`. `intake_json` keys, in order: `name`, `email`, `company`, `message`. All four are required. There is no `intake_date` on this form or the mini-check.

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
