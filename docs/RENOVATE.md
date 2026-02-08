# Renovate Configuration

This document explains the automated dependency management setup using Renovate.

## Overview

Renovate is configured to automatically update dependencies daily to minimize CVE exposure and keep the project up-to-date. It runs as a GitHub Action and creates pull requests for dependency updates.

## Configuration Files

### `renovate.json`
Main configuration file at the repository root. Defines:
- Update schedule (daily at 9 AM UTC)
- Grouping rules for related dependencies
- Auto-merge policies
- Security vulnerability handling
- Package-specific rules

### `.github/workflows/renovate.yaml`
GitHub Actions workflow that runs Renovate:
- **Schedule**: Daily at 9 AM UTC (10 AM CET/CEST)
- **Manual trigger**: Can be run manually via workflow_dispatch
- **Permissions**: Write access to contents, PRs, and issues

## Features

### 1. Automated Updates
- **npm dependencies**: Frontend JavaScript/TypeScript packages
- **Python dependencies**: Backend requirements.txt packages
- **GitHub Actions**: Workflow action version updates (monthly)

### 2. Smart Grouping
Dependencies are grouped to reduce PR noise:
- **npm dependencies**: All npm updates in one PR
- **Python dependencies**: All Python updates in one PR
- **React ecosystem**: React and related packages grouped together
- **ESLint ecosystem**: ESLint plugins and configs grouped
- **FastAPI ecosystem**: FastAPI, Uvicorn, Pydantic grouped

### 3. Auto-Merge
Automatic merging is enabled for:
- **Patch updates** (e.g., 1.0.0 → 1.0.1) on stable versions
- **Minor updates** (e.g., 1.0.0 → 1.1.0) on stable versions
- **Lock file maintenance** (weekly on Mondays)
- **GitHub Actions** updates (monthly)

Auto-merge is **disabled** for:
- Major version updates (require manual review)
- Pre-1.0 versions (considered unstable)
- Security vulnerabilities (require review even if minor)

### 4. Security Handling
- **HIGH/CRITICAL vulnerabilities**:
  - Created immediately (not bound by schedule)
  - Labeled with `security` and `priority`
  - Assigned to repository maintainers
  - Auto-merge disabled (manual review required)

### 5. Pull Request Management
- **Dependency Dashboard**: Enabled (tracks all pending updates)
- **Semantic commits**: Enabled with ⬆️ emoji prefix
- **Labels**: All PRs tagged with `dependencies`
- **Concurrent limit**: Up to 10 PRs at once
- **Rebase strategy**: Rebases when behind base branch

## Schedule

| Update Type | Schedule | Example |
|-------------|----------|---------|
| Regular dependencies | Daily at 9 AM UTC | Mon-Fri before 10 AM |
| Lock file maintenance | Weekly | Mondays at 9 AM UTC |
| GitHub Actions | Monthly | 1st of month at 9 AM UTC |
| Security vulnerabilities | Immediate | Any time |

## Usage

### Viewing Updates
1. Check the **Dependency Dashboard** issue in the repository
2. Review open Renovate PRs with the `dependencies` label
3. Monitor GitHub Actions runs for the Renovate workflow

### Manual Trigger
To run Renovate manually:
1. Go to **Actions** tab in GitHub
2. Select **Renovate** workflow
3. Click **Run workflow**
4. Optionally set log level (info, debug, trace)

### Reviewing PRs
Renovate PRs include:
- Clear description of what's being updated
- Links to changelogs and release notes
- CI status checks
- Auto-merge status (if applicable)

### Handling Failures
If a Renovate PR fails CI:
1. Auto-merge is automatically disabled
2. Review the CI logs to understand the failure
3. Fix issues either:
   - In the PR branch (comment updates will rebase)
   - In the main branch (Renovate will rebase PR)
4. Close the PR if the update should be skipped

## Configuration Customization

### Adding New Package Rules
Edit `renovate.json` to add new rules in the `packageRules` array:

```json
{
  "description": "Group specific packages",
  "matchPackagePatterns": ["^package-prefix"],
  "groupName": "Package Group Name",
  "automerge": true
}
```

### Adjusting Schedule
Modify the `schedule` field in `renovate.json`:

```json
{
  "schedule": ["before 10am every weekday"]
}
```

### Disabling Auto-Merge
To disable auto-merge for specific packages:

```json
{
  "matchPackageNames": ["package-name"],
  "automerge": false
}
```

## Monitoring

### Metrics to Watch
- Number of open Renovate PRs
- Age of pending updates
- Security vulnerability count
- Auto-merge success rate

### Troubleshooting

#### No PRs Being Created
- Check the Dependency Dashboard issue for status
- Review Renovate workflow logs in Actions tab
- Verify `GITHUB_TOKEN` has sufficient permissions

#### Auto-Merge Not Working
- Ensure CI passes successfully
- Check branch protection rules allow auto-merge
- Verify the update matches auto-merge criteria

#### Too Many PRs
- Adjust `prConcurrentLimit` in `renovate.json`
- Increase grouping of related packages
- Adjust schedule to less frequent updates

## Benefits

1. **Security**: Immediate updates for vulnerabilities
2. **Maintenance**: Keeps dependencies current
3. **Automation**: Reduces manual update work
4. **Consistency**: Standardized update process
5. **Visibility**: Clear tracking via PRs and dashboard

## References

- [Renovate Documentation](https://docs.renovatebot.com/)
- [Configuration Options](https://docs.renovatebot.com/configuration-options/)
- [Preset Configs](https://docs.renovatebot.com/presets-config/)
- [Package Rules](https://docs.renovatebot.com/configuration-options/#packagerules)
