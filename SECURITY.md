# Publishing rules

This repository is public. GitHub Pages serves `main` as the website, so a commit is a public post. These rules exist so a push cannot leak private data or hand out account access.

## Never commit

- Stripe secret keys, restricted keys, or webhook secrets (`sk_live_`, `sk_test_`, `rk_live_`, `rk_test_`, `whsec_`). A Payment Link (`https://buy.stripe.com/...`) is the public checkout URL. It is not a key.
- API tokens, GitHub tokens, cloud keys, passwords, or private key files (`.pem`, `.key`, `id_rsa`, and key blocks).
- `.env` files, `credentials.json`, and anything named like a secret store.
- Customer form submissions, inbox exports, prospect lists, or spreadsheets of leads.
- Internal strategy notes (pricing experiments, owner notes, kill criteria, unpublished offer drafts such as `offer.md`).
- Operator notes: how incoming mail is sorted, internal subject lines, anti-spam field names, or how a submission is parsed. The public site shows the form a customer fills in. The processing rules stay off this repository.

The contact address on the site and the Payment Link in `config.js` are the public storefront. They stay because the live page needs them. Do not replace the Payment Link with a secret key.

## Before you push

`.github/workflows/no-secrets.yml` runs `scripts/check-no-secrets.sh` on every push and pull request. Run it locally too:

```bash
bash scripts/check-no-secrets.sh
```

`.gitignore` keeps the common secret filenames out of `git add`. It does not scrub a file that is already tracked, and it does not scan file contents. The script does.

## If a secret was pushed

1. Rotate or revoke it at the provider first. Deleting the file in a later commit leaves it in git history, and history is public.
2. Remove it from the current tree and push that removal.
3. Treat the old value as compromised even after it disappears from the latest commit.
