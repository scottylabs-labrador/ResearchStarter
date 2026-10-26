# Main branch protection

`CODEOWNERS` assigns sensitive paths to `@nicholascui225`, `@jahuang24`, and `@JennyPenguin`. One listed owner's approval is sufficient, except that authors cannot approve their own PRs. GitHub evaluates CODEOWNERS from the PR's base branch, so the new ownership requirements take effect only after this file lands on `main`.

The GitHub branch settings require a PR with one approval, code-owner review for owned paths, approval of the latest push by someone other than its pusher, stale approval dismissal, and resolved conversations. Administrators are subject to these rules. Direct unreviewed pushes, force pushes, and deletion are disabled. There are no required CI/status checks and no PR bypass allowances. Only the three maintainers can dismiss reviews.

`main-protection.json` is the request body for these settings; it does not apply itself. An administrator can apply and inspect the settings from the repository root:

```sh
gh api --method PUT repos/scottylabs-labrador/ResearchStarter/branches/main/protection --input .github/main-protection.json
gh api repos/scottylabs-labrador/ResearchStarter/branches/main/protection
gh api repos/scottylabs-labrador/ResearchStarter/codeowners/errors
```

Verify `enforce_admins.enabled`, `required_conversation_resolution.enabled`, `dismiss_stale_reviews`, `require_code_owner_reviews`, and `require_last_push_approval` are true; the review count is 1; force pushes/deletion are false; and status checks are absent. Once merged, the CODEOWNERS errors endpoint should return an empty errors array.

Before merging the migration, get a review from Jarrett or Jennifer: its author cannot self-approve and CODEOWNERS is not yet on the base branch. Afterward, a scraper/API/config PR must show a required owner review, while a web-source-only PR requires an ordinary approval. New commits invalidate prior approvals.

GitHub administrators can still edit repository settings. These rules do not change repository roles or restrict separately issued MongoDB credentials.
