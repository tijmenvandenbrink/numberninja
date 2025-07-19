# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated CI/CD of the Number Ninja application.

## Workflows

### 1. CI Workflow (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` branch

**Jobs:**
- **test-backend**: Tests Python backend code
- **test-frontend**: Tests React frontend code and builds the application
- **validate-helm**: Lints and validates the Helm chart
- **build-images**: Builds Docker images (only on main branch pushes)

### 2. Release Workflow (`release.yml`)

**Triggers:**
- GitHub release published

**Smart Conditional Builds:**
The workflow detects changes between releases and only builds what's necessary:

**Jobs:**
- **detect-changes**: Compares files changed since last release
- **build-backend**: Only runs if `backend/` files changed
- **build-frontend**: Only runs if `frontend/` files changed
- **publish-helm-chart**: Only runs if `charts/` files changed
- **publish-chart-fallback**: Publishes chart if only docs/other files changed

**Benefits:**
- ⚡ Faster releases (no unnecessary image builds)
- 💰 Lower costs (fewer compute minutes)
- 🎯 Precise artifacts (only updated components)

## Published Artifacts

### Container Images

Images are published to GitHub Container Registry (ghcr.io):

- `ghcr.io/{owner}/numberninja/backend:{version}`
- `ghcr.io/{owner}/numberninja/frontend:{version}`

**Supported Architectures:**
- linux/amd64
- linux/arm64

**Image Tags:**
- `{version}` - Semantic version (e.g., `1.2.3`)
- `{major}.{minor}` - Major.minor version (e.g., `1.2`)
- `{major}` - Major version (e.g., `1`)
- `sha-{commit}` - Git commit SHA

### Helm Chart

The Helm chart is published in two locations:

1. **GitHub Releases**: Attached as `.tgz` file to each release
2. **OCI Registry**: `ghcr.io/{owner}/numberninja/charts/numberninja:{version}`

## Release Process

### Creating a Release

1. **Update Version**: Ensure your changes are ready and merged to `main`

2. **Create Release**: Go to GitHub → Releases → "Create a new release"

3. **Tag Format**: Use semantic versioning (e.g., `v1.0.0`, `v1.2.3`)

4. **Release Title**: Use the same as the tag (e.g., `v1.0.0`)

5. **Release Description**: Include:
   ```markdown
   ## What's Changed
   - Feature 1: Description
   - Feature 2: Description
   - Bug fix: Description
   
   ## Docker Images
   - Backend: ghcr.io/{owner}/numberninja/backend:1.0.0
   - Frontend: ghcr.io/{owner}/numberninja/frontend:1.0.0
   
   ## Helm Chart
   ```bash
   helm install numberninja oci://ghcr.io/{owner}/numberninja/charts/numberninja --version 1.0.0
   ```
   ```

6. **Publish**: Click "Publish release"

The workflows will automatically:
- Build and push Docker images with the release tag
- Update Chart.yaml with the new version
- Package and publish the Helm chart
- Attach chart `.tgz` to the GitHub release

### Example Release Commands

After a release is published, users can:

```bash
# Pull Docker images
docker pull ghcr.io/{owner}/numberninja/backend:1.0.0
docker pull ghcr.io/{owner}/numberninja/frontend:1.0.0

# Install Helm chart from OCI registry
helm install numberninja oci://ghcr.io/{owner}/numberninja/charts/numberninja --version 1.0.0

# Or from GitHub releases
wget https://github.com/{owner}/numberninja/releases/download/v1.0.0/numberninja-1.0.0.tgz
helm install numberninja ./numberninja-1.0.0.tgz
```

## Setup Requirements

### Repository Secrets

The workflows use built-in `GITHUB_TOKEN` which has the necessary permissions. No additional secrets are required.

### Repository Settings

Ensure the following permissions are enabled:

1. **Actions** → **General** → **Workflow permissions**:
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests

2. **Settings** → **Actions** → **General** → **Artifact and log retention**:
   - Set appropriate retention period for build artifacts

### Branch Protection (Recommended)

For production repositories, configure branch protection on `main`:

1. **Settings** → **Branches** → **Add rule**
2. Branch name pattern: `main`
3. ✅ Require status checks to pass before merging
4. ✅ Require up-to-date branches before merging
5. Select required status checks:
   - `test-backend`
   - `test-frontend`  
   - `validate-helm`

## Monitoring

### Workflow Status

Monitor workflow runs:
- **Actions** tab in GitHub repository
- Check for failed runs and review logs
- Set up notifications for failed workflows

### Published Packages

View published packages:
- **Code** tab → **Packages** (right sidebar)
- Container images and Helm charts are listed
- Check download statistics and versions

## Troubleshooting

### Common Issues

1. **Image build failures**:
   - Check Dockerfile syntax
   - Verify build context paths
   - Review build logs in Actions tab

2. **Helm chart validation errors**:
   - Run `helm lint charts/numberninja` locally
   - Check template syntax and values

3. **Permission errors**:
   - Verify GITHUB_TOKEN has packages:write permission
   - Check repository settings for workflow permissions

4. **Release not triggering workflow**:
   - Ensure release is "published" not "draft"
   - Check workflow trigger configuration

### Getting Help

- Review workflow logs in the Actions tab
- Check the [GitHub Actions documentation](https://docs.github.com/en/actions)
- Open an issue in the repository for specific problems