#!/bin/bash
# Exit on error
set -e

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Validate semantic version format
validate_semver() {
    if [[ ! "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$ ]]; then
        echo "Error: Invalid semantic version format. Use format like 1.2.3"
        exit 1
    fi
}

# Build Android APK
build_android() {
    echo "Building Android APK..."
     # Use the absolute path to the build script
    bash "${SCRIPT_DIR}/build-android.sh" || { echo "Android build failed!"; exit 1; }
}

# Ensure the working directory is clean
ensure_clean_workdir() {
    if [[ -n $(git status --porcelain) ]]; then
        echo "Error: Uncommitted changes detected. Commit or stash them before running this script."
        exit 1
    fi
}

# Ensure on main branch
ensure_on_main() {
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if [[ "$BRANCH" != "main" ]]; then
        echo "Error: You must be on the 'main' branch to release."
        exit 1
    fi
}

# Parse arguments
BUILD_ANDROID=false
VERSION=""

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -a|--android) BUILD_ANDROID=true ;;
        *) 
            if [ -z "$VERSION" ]; then 
                VERSION="$1"
            else
                echo "Unknown parameter passed: $1"
                exit 1
            fi
            ;;
    esac
    shift
done

# Validate inputs
if [ -z "$VERSION" ]; then
    echo "Usage: ./release.sh <version> [-a|--android]"
    echo "  -a, --android   Build Android APK during release"
    exit 1
fi

# Run validations
validate_semver "$VERSION"
ensure_clean_workdir
ensure_on_main

# Pull latest changes
git pull origin main

# Commit version bump
echo "Bumping version to $VERSION..."
git commit -am "chore(release): bump version to $VERSION"

# Create a Git tag
git tag "v$VERSION"

# Generate changelog
echo "Generating changelog..."
if ! npm run changelog; then
    echo "Error: Failed to generate changelog."
    exit 1
fi

# Commit changelog and amend previous commit
git add CHANGELOG.md
git commit --amend --no-edit

# Force update the tag
git tag -f "v$VERSION"

# Optional Android build
if [ "$BUILD_ANDROID" = true ]; then
    build_android
fi

# Push changes and tags
echo "Pushing changes..."
git push origin main --tags -f

echo "✅ Release v$VERSION completed successfully!"
