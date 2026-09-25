#!/usr/bin/env bash
# Fails if tracked files look like secrets or private dumps.
# The pattern list lives only in this script. The scan skips this file.
set -euo pipefail

root=$(git rev-parse --show-toplevel)
cd "$root"

fail=0

while IFS= read -r -d '' f; do
  base=$(basename "$f")
  case "$base" in
    .env|.env.*|*.pem|*.p12|*.key|id_rsa|id_ed25519|credentials.json|secrets.json|offer.md)
      echo "Private file must not be published: $f"
      fail=1
      ;;
  esac
done < <(git ls-files -z)

pattern='sk_(live|test)_[A-Za-z0-9]+|rk_(live|test)_[A-Za-z0-9]+|whsec_[A-Za-z0-9]+|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]+|x-access-token|BEGIN [A-Z ]*PRIVATE KEY'

if git grep -I -n -E "$pattern" -- . ':!scripts/check-no-secrets.sh'; then
  echo "Secret-shaped content is listed above. Remove it before publishing. If it is a live key, rotate it at the provider."
  fail=1
fi

# Public docs must not carry the mail-routing runbook. The form pages still
# contain the fields the customer site needs; this check covers the docs only.
docs_pattern='intake_json|_honey|_captcha|SNAPSHOT-ORDER|MINI-CHECK|\[QUESTION\]|form_type|_autoresponse|_replyto'
if git grep -I -n -E "$docs_pattern" -- README.md SECURITY.md; then
  echo "Public docs include mail-routing or anti-spam internals. Keep those off GitHub."
  fail=1
fi

if [[ "$fail" -ne 0 ]]; then
  exit 1
fi

echo "No secret keys, tokens, or private files in the tracked tree."
