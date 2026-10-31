# PromiseGuard

Check client websites against the business facts the owner approved: required text, retired promises that must not appear, and exact link destinations.

**Site:** https://yarosim.github.io/ai-visibility-snapshot/promiseguard/ · **Free Promise Check:** https://yarosim.github.io/ai-visibility-snapshot/promiseguard/request.html

## Quick start (Python 3.10+, no dependencies)
```sh
cd tool
python promiseguard.py demo_config.json --output report.json
python -m unittest -v
```
Expected demo output: 1 PASS, 3 REVIEW on a fictional plumbing page.

## Status
Early-stage proof of concept. Works on saved HTML only. No live crawling, JS rendering, scheduling, alerts or multi-tenant features yet. A REVIEW result means a person should look; it isn't proof a claim is wrong. See `tool/README.md`.

## Repo layout
- `index.html`, `sample-report.html`, `request.html`, `template-pack.html`, `blog/`: GitHub Pages site
- `assets/config.js`: **payment link config** (paste Stripe Payment Links here)
- `tool/`: checker, tests, demo
- `downloads/`: free Website Promise Audit Checklist (PDF)

## License
MIT. © 2026 PNS Global LLC
