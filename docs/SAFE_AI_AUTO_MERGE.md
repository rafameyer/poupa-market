# Safe AI Auto Merge

PoupaMarket includes a separate GitHub Actions workflow for carefully merging AI-created pull requests:

```txt
.github/workflows/safe-ai-auto-merge.yml
```

This workflow is intentionally conservative. It does not make every AI pull request merge automatically. It only runs a merge when the pull request satisfies all configured safety gates.

## Merge Gates

The workflow only merges a pull request when:

- The pull request has the `safe-to-merge` label.
- The source branch starts with `ai/`.
- The pull request is not a draft.
- GitHub reports the pull request as `CLEAN`, meaning branch protection and required checks are satisfied.
- The changed files do not match the sensitive file rules.

The workflow uses `pull_request_target` because it needs permission to merge and update labels. To reduce risk, it does not check out or execute pull request code. It only reads pull request metadata and changed file names through the GitHub API.

## Sensitive Files

Pull requests are blocked from auto-merge when they touch files that match these areas:

- `.env*`
- `.github/workflows/*`
- Supabase migrations or policy files
- Auth-related files
- Payment, billing, Stripe, or checkout files
- Deployment configuration
- Dependency lockfiles and package manifest files

If a sensitive file is detected, the workflow comments on the pull request and leaves the merge for manual review.

## Required Setup

Create these labels in GitHub before relying on the workflow:

- `safe-to-merge`
- `ai-in-progress`
- `ai-review`
- `completed`

The `safe-to-merge` label is the manual approval switch. Do not apply it until a human has reviewed the pull request scope and confirmed the PR is expected to be merged automatically.

## Branch Protection

The workflow relies on GitHub branch protection to know whether required checks passed. Configure branch protection on `main` so important checks are required before merge, such as:

- build
- lint
- tests, once available

Without branch protection, GitHub may report a pull request as mergeable even when no meaningful checks are configured.

## Project Board Updates

After a successful merge, the workflow:

- Removes `ai-in-progress` and `ai-review` from the pull request.
- Removes `ai-in-progress` and `ai-review` from related closing issues.
- Adds `completed` to related closing issues.
- Comments on related closing issues.

GitHub Projects v2 updates are best effort and require extra configuration because repository-scoped `GITHUB_TOKEN` access is not enough for user or organization Projects.

To let the workflow move project cards to `Completed`, configure:

- Secret: `GH_PROJECT_TOKEN`
- Variable: `POUPAMARKET_PROJECT_ID`
- Variable: `POUPAMARKET_PROJECT_STATUS_FIELD_ID`
- Variable: `POUPAMARKET_PROJECT_STATUS_COMPLETED_OPTION_ID`

The token should have the minimum Projects permissions needed to edit the PoupaMarket roadmap project.

## Risks

Auto-merge always carries risk. The workflow reduces that risk with branch naming, labels, draft checks, branch protection, sensitive file detection, and no checkout of PR code. It still depends on correct repository settings and disciplined use of the `safe-to-merge` label.

Keep auto-merge limited to small, low-risk AI pull requests. Review anything that changes infrastructure, auth, payments, secrets, deployments, data migrations, or dependency boundaries manually.
