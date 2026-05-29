# Versioning Strategy

This project uses **decoupled semantic versioning** where each component evolves independently.

## Components

### Backend (`backend/VERSION`)
- **Images**: `ghcr.io/tijmenvandenbrink/numberninja/backend:<version>`

### Frontend (`frontend/VERSION`)
- **Images**: `ghcr.io/tijmenvandenbrink/numberninja/frontend:<version>`

### Helm Chart (`charts/numberninja/VERSION`)
- **References**: Latest stable backend + frontend versions

## Releasing

All releases are done through a single workflow: **`release.yaml`** (manual dispatch only).

### Via GitHub Actions UI
1. Go to **Actions > Release**
2. Select the component (`backend`, `frontend`, or `both`)
3. Select the bump type (`patch`, `minor`, or `major`)
4. Optionally enable/disable chart release
5. Click **Run workflow**

### Via CLI
```bash
# Release backend with a patch bump + chart release
gh workflow run release.yaml -f component=backend -f bump_type=patch -f release_chart=true

# Release both components with a minor bump, no chart
gh workflow run release.yaml -f component=both -f bump_type=minor -f release_chart=false
```

### What the release workflow does
1. **Bumps version(s)** for the selected component(s) via `scripts/bump-version.sh`
2. **Updates chart** image tags and bumps chart version (if `release_chart` is enabled)
3. **Commits all changes atomically** in a single commit and push
4. **Builds and pushes** Docker images to GHCR with the new version tag
5. **Packages and publishes** the Helm chart to the OCI registry (if enabled)
6. **Creates GitHub releases** for the component(s) and chart

### Local Development
```bash
# Using the bump-version script directly:
./scripts/bump-version.sh backend minor   # 1.1.0 -> 1.2.0
./scripts/bump-version.sh frontend patch  # 1.1.0 -> 1.1.1
./scripts/bump-version.sh chart major     # 1.2.1 -> 2.0.0
```

## Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yaml` | PR / push to main | Lint, test, build validation (no push) |
| `release.yaml` | Manual dispatch | Version bump + image build+push + chart release |
| `_build-image.yaml` | Called by ci/release | Reusable Docker build+push |
| `vulnerability-scans.yaml` | Daily cron / manual | Trivy security scans (fails on HIGH+) |
| `renovate.yaml` | Mon/Thu cron | Dependency management |
| `release-drafter.yml` | PR / push to main | Release notes drafting |

## Example Workflow

1. **Make backend changes** and push to main
2. **CI runs** — tests, lint, build validation (no images pushed)
3. **Trigger release** via Actions UI: `component=backend, bump_type=patch`
4. **Backend version** bumped (e.g. `1.1.0` -> `1.1.1`), image built and pushed
5. **Chart updated** with new backend image tag and chart version bumped
6. **GitHub releases** created for backend and chart
