# PromiseGuard: local proof of concept
Working name only; trademark/domain availability not checked.

## Run (Python 3.10+)
Unzip, open a terminal in this directory:
```sh
python promiseguard.py demo_config.json --output report.json
python -m unittest -v
```
Expected demonstration: 1 PASS, 3 REVIEW findings. All demo business data is fictional.

## What works
- Checks saved HTML against explicitly approved required text, forbidden text, and exact link destinations.
- Emits structured JSON with evidence and UTC timestamps.
- No external dependencies, accounts, API keys, network calls, or AI charges.

## What does NOT work yet
No live crawling, JavaScript rendering, visual interface, scheduling, alerts, billing, multi-tenancy, authenticated access, or semantic inference. A missing string is a REVIEW, not proof that a business claim is wrong. No link availability or form delivery tests. CSS-hidden text can be counted; formatting may cause false misses. Exact href checks require matching relative/absolute formatting. Do not market this prototype as production monitoring.

## Customize
Save authorized page HTML locally, add a page to the JSON configuration, and define approved rules. Link targets must match exactly. Keep rules scoped to the pages where the fact should appear. Have the client approve rules and expiration dates before operating a service.

## Next build
See the accompanying implementation playbook. Validate willingness to pay before building SaaS infrastructure.
