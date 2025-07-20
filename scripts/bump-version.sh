#!/bin/bash
set -e

COMPONENT=$1
BUMP_TYPE=${2:-patch}

if [[ -z "$COMPONENT" ]]; then
    echo "Usage: $0 <backend|frontend|chart> [major|minor|patch]"
    echo "Examples:"
    echo "  $0 backend patch    # 1.0.0 -> 1.0.1"
    echo "  $0 frontend minor   # 1.0.0 -> 1.1.0"
    echo "  $0 chart major      # 1.0.0 -> 2.0.0"
    exit 1
fi

case $COMPONENT in
    "backend")
        VERSION_FILE="backend/VERSION"
        ;;
    "frontend")
        VERSION_FILE="frontend/VERSION"
        ;;
    "chart")
        VERSION_FILE="charts/numberninja/VERSION"
        ;;
    *)
        echo "Invalid component: $COMPONENT"
        echo "Valid components: backend, frontend, chart"
        exit 1
        ;;
esac

if [[ ! -f "$VERSION_FILE" ]]; then
    echo "Version file not found: $VERSION_FILE"
    exit 1
fi

CURRENT_VERSION=$(cat "$VERSION_FILE")

# Parse current version
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

# Bump version based on type
case $BUMP_TYPE in
    "major")
        MAJOR=$((MAJOR + 1))
        MINOR=0
        PATCH=0
        ;;
    "minor")
        MINOR=$((MINOR + 1))
        PATCH=0
        ;;
    "patch")
        PATCH=$((PATCH + 1))
        ;;
    *)
        echo "Invalid bump type: $BUMP_TYPE"
        echo "Valid types: major, minor, patch"
        exit 1
        ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
echo "$NEW_VERSION" > "$VERSION_FILE"

echo "Bumped $COMPONENT version: $CURRENT_VERSION -> $NEW_VERSION"

# Update component-specific files
case $COMPONENT in
    "backend")
        # Could update go.mod or other backend-specific version references
        echo "Backend version updated to $NEW_VERSION"
        ;;
    "frontend")
        # Update package.json version
        if [[ -f "frontend/package.json" ]]; then
            sed -i.bak "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" frontend/package.json
            rm frontend/package.json.bak
        fi
        echo "Frontend version updated to $NEW_VERSION"
        ;;
    "chart")
        # Update Chart.yaml
        if [[ -f "charts/numberninja/Chart.yaml" ]]; then
            sed -i.bak "s/version: .*/version: $NEW_VERSION/" charts/numberninja/Chart.yaml
            rm charts/numberninja/Chart.yaml.bak
        fi
        echo "Chart version updated to $NEW_VERSION"
        ;;
esac