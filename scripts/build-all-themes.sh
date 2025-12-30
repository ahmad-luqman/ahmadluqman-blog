#!/bin/bash
# Build site with multiple themes for runtime switching
# Usage: ./scripts/build-all-themes.sh

set -ex  # Enable debug mode to show each command

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
THEMES_FILE="$SCRIPT_DIR/themes.txt"
CONFIG_FILE="$PROJECT_DIR/config/_default/hugo.toml"
PUBLIC_DIR="$PROJECT_DIR/public"
THEMES_OUTPUT_DIR="$PUBLIC_DIR/themes"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Extract theme name from module path
get_theme_name() {
    local path="$1"
    # Remove github.com/ prefix and version suffix
    local name=$(echo "$path" | sed 's|github.com/||' | sed 's|/v[0-9]*$||' | tr '/' '-')
    echo "$name"
}

# Get display name (last part of path)
get_display_name() {
    local path="$1"
    echo "$path" | sed 's|.*/||' | sed 's|/v[0-9]*$||' | sed 's|hugo-theme-||' | sed 's|hugo-||'
}

# Backup original config
backup_config() {
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup"
    log_info "Backed up config"
}

# Restore original config
restore_config() {
    if [[ -f "$CONFIG_FILE.backup" ]]; then
        mv "$CONFIG_FILE.backup" "$CONFIG_FILE"
        log_info "Restored original config"
    fi
}

# Update hugo.toml with new theme (cross-platform sed)
set_theme() {
    local theme_path="$1"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|path = \"github.com/[^\"]*\"|path = \"$theme_path\"|" "$CONFIG_FILE"
    else
        sed -i "s|path = \"github.com/[^\"]*\"|path = \"$theme_path\"|" "$CONFIG_FILE"
    fi
}

# Build theme manifest JSON for the switcher UI
build_manifest() {
    local manifest_file="$PUBLIC_DIR/theme-manifest.json"
    log_info "Building theme manifest..."

    echo '[' > "$manifest_file"
    local first=true

    while IFS= read -r line || [[ -n "$line" ]]; do
        # Skip comments and empty lines
        [[ "$line" =~ ^#.*$ ]] && continue
        [[ -z "$line" ]] && continue

        local theme_path="$line"
        local theme_name=$(get_theme_name "$theme_path")
        local display_name=$(get_display_name "$theme_path")
        local theme_dir="$THEMES_OUTPUT_DIR/$theme_name"

        # Only add if theme was built successfully
        if [[ -d "$theme_dir" ]]; then
            if [[ "$first" == true ]]; then
                first=false
            else
                echo ',' >> "$manifest_file"
            fi

            cat >> "$manifest_file" << EOF
  {
    "id": "$theme_name",
    "name": "$display_name",
    "path": "/themes/$theme_name/",
    "module": "$theme_path"
  }
EOF
        fi
    done < "$THEMES_FILE"

    echo ']' >> "$manifest_file"
    log_info "Manifest saved to $manifest_file"
}

# Main build function
build_all_themes() {
    local total=0
    local success=0
    local failed=0
    local failed_themes=""

    # Count themes
    while IFS= read -r line || [[ -n "$line" ]]; do
        [[ "$line" =~ ^#.*$ ]] && continue
        [[ -z "$line" ]] && continue
        ((total++))
    done < "$THEMES_FILE"

    log_info "Building $total themes..."

    # Clean output directories
    rm -rf "$PUBLIC_DIR"
    mkdir -p "$THEMES_OUTPUT_DIR"

    # Backup config
    backup_config
    trap restore_config EXIT

    # Build each theme
    local count=0
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Skip comments and empty lines
        [[ "$line" =~ ^#.*$ ]] && continue
        [[ -z "$line" ]] && continue

        ((count++))
        local theme_path="$line"
        local theme_name=$(get_theme_name "$theme_path")
        local theme_output="$THEMES_OUTPUT_DIR/$theme_name"

        echo -e "\n${GREEN}[$count/$total]${NC} Building: $theme_name"

        # Update config with this theme
        set_theme "$theme_path"

        # Fetch theme module
        if ! hugo mod get -u 2>/dev/null; then
            log_warn "Failed to fetch module: $theme_path"
            ((failed++))
            failed_themes="$failed_themes\n  - $theme_name"
            continue
        fi

        # Build to theme directory
        if hugo --minify --gc -d "$theme_output" 2>/dev/null; then
            ((success++))
            log_info "Built: $theme_name"
        else
            ((failed++))
            failed_themes="$failed_themes\n  - $theme_name"
            log_warn "Build failed: $theme_name"
        fi
    done < "$THEMES_FILE"

    # Restore original config and build main site
    restore_config
    trap - EXIT

    log_info "Building main site (Congo)..."
    hugo mod get -u
    hugo --minify --gc

    # Build manifest
    build_manifest

    # Copy theme switcher assets
    if [[ -f "$PROJECT_DIR/assets/js/theme-switcher.js" ]]; then
        mkdir -p "$PUBLIC_DIR/js"
        cp "$PROJECT_DIR/assets/js/theme-switcher.js" "$PUBLIC_DIR/js/"
    fi

    # Summary
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}Build Complete${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "Total themes: $total"
    echo -e "Successful:   ${GREEN}$success${NC}"
    echo -e "Failed:       ${RED}$failed${NC}"

    if [[ -n "$failed_themes" ]]; then
        echo -e "\nFailed themes:$failed_themes"
    fi

    # Calculate size
    local size=$(du -sh "$PUBLIC_DIR" | cut -f1)
    echo -e "\nTotal deploy size: $size"
}

# Run
build_all_themes
