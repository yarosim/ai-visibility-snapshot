# Secure SDLC policy: yarosim GitHub Pages sites
Owner: Simon. Applies to every repo that publishes a site or sells a product. Version 1, Nov 1, 2026. Budget: $0 (free GitHub features and free actions only).

## 1. Branch + PR review
- No direct pushes to `main`. Every change goes on a branch (`fix/...`, `feat/...`) and a pull request.
- Branch protection on `main`: require PR, 1 approval (Simon or a review agent), require the `static-checks` status to pass, block force-push and deletion.
- Agents (cloud agents, routines) open PRs; they never merge their own PR on paid-product pages, payment links or delivery code.

## 2. Secret scanning
- Enable GitHub secret scanning + push protection (Settings > Code security; free on public repos).
- `static-checks` runs gitleaks over full history on every PR, push and weekly.
- If a secret is found: revoke/rotate it at the provider first, then remove it from code. Rewriting history is a destructive step and needs Simon's approval.

## 3. Dependency checks
- Static sites carry no npm deps. Any repo with `package.json` (e.g. yarosecurity/tradebpt source, paygate) enables Dependabot alerts + security updates and runs `npm audit --omit=dev` in CI.
- Do not vendor third-party JS from CDNs. If unavoidable, pin a version and add SRI.

## 4. CSP and SRI
- Every HTML page has a CSP `<meta>` (GitHub Pages cannot set headers): `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action` limited to `'self' https://formsubmit.co https://buy.stripe.com`, `connect-src 'self' https://formsubmit.co`.
- `'unsafe-inline'` is tolerated for now because pages use inline script/style; goal: move scripts into `.js` files and drop it.
- Any `<script src="https://...">` must carry `integrity="sha384-..." crossorigin="anonymous"`; CI fails otherwise.

## 5. No API keys in client code
- Only publishable values may appear in a public repo: Stripe Payment Link URLs, publishable keys (`pk_`), form endpoints.
- Never commit `sk_`, `rk_`, `whsec_`, broker/API tokens, or `.env`/`.dev.vars`/`wrangler.toml` with IDs. Secrets live only in Cloudflare Worker secrets / GitHub Actions secrets.
- Apps that ask users for their own API keys (e.g. trading dashboards) must not ship on the marketing site.

## 6. Paid-file delivery (paywall)
- Paid files never live at a public static path (no `thanks-<hash>/file.pdf`, no `dl/<hash>/file.zip`, no public `downloads/`). A hard-to-guess URL is not a paywall.
- Delivery goes through the Paygate Worker (`/workspace/paygate/`): Stripe Payment Link redirect -> Worker verifies the Checkout Session is `paid` for that product -> streams from private R2.
- Every paid product has a free hook (sample/checklist/mini-tool) with email capture that links to the paid product.

## 7. Stripe test mode before live
- New products, prices, links and Worker changes are exercised in Stripe test mode first (card 4242 4242 4242 4242): paid session -> 200, fake session -> 403, wrong product -> 403.
- Only after a passing test-mode run do live links replace test links. Record the test date in the PR.

## 8. Release checklist (paste into every PR touching a product page)
- [ ] `static-checks` green (gitleaks, secret grep, paid-file guard, SRI, link check, HTML validator)
- [ ] Buy button opens the right Stripe link (HTTP 200, correct product name and price)
- [ ] After-payment redirect goes to the Paygate, not a static file
- [ ] Free hook downloads, email capture submits and lands on `/free/`
- [ ] Facts/claims changed? Source URL cited and re-checked today
- [ ] Mobile + desktop visual check; no console errors
- [ ] Privacy page mentions email capture and Stripe

## 9. Weekly re-scan
- `static-checks` runs on a schedule every Monday. A routine also runs the audit script (`/workspace/sites-audit/tools/`) across all yarosim Pages repos: Stripe link HTTP check, exposed paid files, CSP presence, broken links, secrets. Findings go into MATRIX.csv and the weekly report.

## 10. Incident response
- Leaked paid file or link: deactivate the Payment Link (`active=false`), create a new one, update the Worker catalog, and rotate the R2 object key.
- Leaked key: rotate in the provider dashboard, `wrangler secret put`, then scrub.
