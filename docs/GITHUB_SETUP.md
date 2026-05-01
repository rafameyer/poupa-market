# GitHub Setup

## Goal

Prepare the local `poupa-market` repository so it can be pushed to the GitHub account `rafameyer` under the repository name `poupa-market`.

## Current state

This project was bootstrapped with `create-next-app`, which already ran `git init` and created an initial local commit. That means this repository is already initialized and using the `main` branch.

## 1. git init

If you were starting from a plain folder, the first command would be:

```bash
git init
git branch -M main
```

For this repository, that step is already complete.

## 2. .gitignore validation

The `.gitignore` has been reviewed and is appropriate for the current Phase 0 scope. It already ignores:

- `node_modules/`
- `.next/`
- `out/`
- `.vercel/`
- `.env*`
- common log files
- `.DS_Store`
- TypeScript build info

No advanced CI or deployment-specific ignore rules were added in this phase.

## 3. Initial commit

Because the repository already contains the default `create-next-app` starter commit, the recommended next step is to create a clean foundation commit for the Phase 0 work:

```bash
git add .
git commit -m "chore: prepare PoupaMarket Phase 0 foundation"
```

This keeps the history simple without rewriting the generated starter commit.

## 4. Remote origin setup

Set the GitHub remote:

```bash
git remote add origin https://github.com/rafameyer/poupa-market.git
```

If `origin` already exists, update it instead:

```bash
git remote set-url origin https://github.com/rafameyer/poupa-market.git
```

Verify:

```bash
git remote -v
```

## 5. Push to main branch

After creating the GitHub repository in the browser, push the local `main` branch:

```bash
git push -u origin main
```

The `-u` flag sets the upstream so future pushes can use just:

```bash
git push
```

## 6. Recommended branch strategy

Keep the branch strategy intentionally simple:

- `main`: stable default branch
- `feat/<short-topic>`: new features
- `fix/<short-topic>`: bug fixes
- `docs/<short-topic>`: documentation-only work

Examples:

```txt
feat/lists-crud
feat/local-storage-lists
fix/pwa-icons
docs/phase-1-plan
```

Suggested workflow:

1. Pull the latest `main`
2. Create a small feature branch
3. Implement one focused change
4. Run `npm run lint` and `npm run build`
5. Open a pull request into `main`
6. Merge once reviewed

## 7. Create the GitHub repository

Since GitHub CLI is not installed in this environment, create the remote repository in the GitHub web UI:

1. Sign in to GitHub
2. Open [https://github.com/new](https://github.com/new)
3. Set Owner to `rafameyer`
4. Set Repository name to `poupa-market`
5. Keep it empty
6. Do not add a new README, `.gitignore`, or license if you want to push the current local repository without conflicts
7. Click `Create repository`

## Full command sequence

From the project root:

```bash
git status
git add .
git commit -m "chore: prepare PoupaMarket Phase 0 foundation"
git remote add origin https://github.com/rafameyer/poupa-market.git
git push -u origin main
```

If `origin` already exists:

```bash
git remote set-url origin https://github.com/rafameyer/poupa-market.git
git push -u origin main
```
