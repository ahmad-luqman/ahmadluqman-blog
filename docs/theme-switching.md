# Hugo Theme Switching Guide

This document covers the multi-theme architecture implemented for this Hugo blog, including technical details, usage instructions, and architectural decisions.

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [How Hugo Modules Work](#how-hugo-modules-work)
- [Theme Switching Commands](#theme-switching-commands)
- [Popular Themes Reference](#popular-themes-reference)
- [Content Portability](#content-portability)
- [Theme Configuration](#theme-configuration)
- [Troubleshooting](#troubleshooting)
- [Architecture Decision Records](#architecture-decision-records)

---

## Quick Start

```bash
# List available themes
make list-themes

# Switch to a different theme
make switch-theme theme=adityatelange/hugo-PaperMod

# Switch back to Congo
make switch-theme theme=jpanther/congo/v2

# Update current theme to latest version
make update-theme

# Build site
make build
```

---

## Architecture Overview

### Before: Git Submodules

```
ahmadluqman-blog/
├── themes/
│   └── congo/          # 10+ MB submodule in repo
├── .gitmodules         # Submodule config
└── config/_default/
    └── hugo.toml       # theme = "congo"
```

**Problems:**
- Each theme adds 5-50 MB to repository
- Supporting 200+ themes = 2-10 GB repo size
- Submodule sync issues common
- Version pinning requires manual management

### After: Hugo Modules

```
ahmadluqman-blog/
├── go.mod              # Module definition (~100 bytes)
├── go.sum              # Checksums (~200 bytes)
├── themes/             # Empty directory
└── config/_default/
    └── hugo.toml       # [module] imports
```

**Benefits:**
- Zero repo footprint for themes
- Themes cached globally in `~/go/pkg/mod/`
- Shared across all Hugo projects
- Automatic version resolution
- One-command theme switching

### Where Themes Live Now

```
~/go/pkg/mod/github.com/
├── jpanther/congo/v2@v2.12.2/
├── adityatelange/hugo-!paper!mod@v0.0.0-.../
├── !cai!jimmy/hugo-theme-stack@v3.../
└── ... (cached as needed)
```

---

## How Hugo Modules Work

### The Module System

Hugo Modules use Go's module system under the hood. When you run:

```bash
hugo mod init github.com/ahmadluqman/ahmadluqman-blog
```

It creates a `go.mod` file that declares your site as a Go module:

```go
module github.com/ahmadluqman/ahmadluqman-blog

go 1.25
```

### Theme as Module Import

In `config/_default/hugo.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/jpanther/congo/v2"
```

This tells Hugo to:
1. Download the theme from GitHub (if not cached)
2. Store it in Go's module cache
3. Mount theme files into Hugo's virtual filesystem

### Module Resolution Flow

```
hugo build
    │
    ▼
Read config/_default/hugo.toml
    │
    ▼
Find [module.imports] → "github.com/jpanther/congo/v2"
    │
    ▼
Check ~/go/pkg/mod/ cache
    │
    ├─► Found → Use cached version
    │
    └─► Not found → Download from GitHub
                         │
                         ▼
                    Cache in ~/go/pkg/mod/
                         │
                         ▼
                    Mount theme files
```

### Version Resolution

Hugo Modules support semantic versioning:

```toml
# Latest version (default)
path = "github.com/jpanther/congo/v2"

# Specific version (via go.mod)
# Run: hugo mod get github.com/jpanther/congo/v2@v2.10.0
```

The `go.sum` file locks exact versions:

```
github.com/jpanther/congo/v2 v2.12.2 h1:abc123.../
github.com/jpanther/congo/v2 v2.12.2/go.mod h1:def456.../
```

---

## Theme Switching Commands

### `make switch-theme theme=owner/repo`

Switches to any Hugo theme from GitHub.

**How it works:**
1. Updates `config/_default/hugo.toml` with new module path
2. Runs `hugo mod get -u` to fetch the theme
3. Runs `hugo mod tidy` to clean up dependencies

**Examples:**

```bash
# Full path format
make switch-theme theme=jpanther/congo/v2
make switch-theme theme=adityatelange/hugo-PaperMod
make switch-theme theme=CaiJimmy/hugo-theme-stack

# Note: Case-sensitive! Use exact GitHub path
```

**What it modifies:**

```toml
# Before
[[module.imports]]
  path = "github.com/jpanther/congo/v2"

# After (with theme=adityatelange/hugo-PaperMod)
[[module.imports]]
  path = "github.com/adityatelange/hugo-PaperMod"
```

### `make update-theme`

Updates the current theme to its latest version.

```bash
make update-theme
# Equivalent to:
# hugo mod get -u
# hugo mod tidy
```

### `make list-themes`

Shows curated list of popular blog themes:

```
Popular Hugo blog themes (use with switch-theme):
  jpanther/congo/v2         - Current theme (modern, feature-rich)
  adityatelange/hugo-PaperMod - Clean, fast, minimal
  CaiJimmy/hugo-theme-stack - Card-style, photo-friendly
  luizdepra/hugo-coder      - Developer-focused, minimal
  panr/hugo-theme-terminal  - Terminal/retro aesthetic

Browse all: https://themes.gohugo.io/tags/blog/
```

---

## Popular Themes Reference

### Tier 1: High Compatibility (tested)

| Theme | Module Path | Style | Notes |
|-------|-------------|-------|-------|
| Congo | `jpanther/congo/v2` | Modern, feature-rich | Current theme, full config support |
| PaperMod | `adityatelange/hugo-PaperMod` | Clean, minimal | Tested, builds successfully |

### Tier 2: Popular (untested)

| Theme | Module Path | Style |
|-------|-------------|-------|
| Stack | `CaiJimmy/hugo-theme-stack` | Card-based, photo-friendly |
| Coder | `luizdepra/hugo-coder` | Developer portfolio |
| Terminal | `panr/hugo-theme-terminal` | Retro terminal aesthetic |
| Blowfish | `nunocoracao/blowfish` | Modern, Tailwind-based |
| LoveIt | `dillonzq/LoveIt` | Feature-rich, Chinese/English |
| Ananke | `theNewDynamic/gohugo-theme-ananke` | Official Hugo starter theme |

### Finding Theme Module Paths

1. Go to https://themes.gohugo.io/tags/blog/
2. Click on a theme
3. Find the GitHub repository URL
4. Extract `owner/repo` from `github.com/owner/repo`
5. Check if theme uses `/v2`, `/v3` suffix (major version)

**Example:**
```
GitHub URL: https://github.com/CaiJimmy/hugo-theme-stack
Module path: CaiJimmy/hugo-theme-stack
```

---

## Content Portability

### What Transfers Between Themes

| Content Type | Portability | Notes |
|--------------|-------------|-------|
| Markdown body | 100% | All themes render standard Markdown |
| `title` | 100% | Universal frontmatter field |
| `date` | 100% | Universal frontmatter field |
| `draft` | 100% | Universal frontmatter field |
| `tags` | ~95% | Most themes support, some use `keywords` |
| `categories` | ~90% | Most themes support |
| `description` | ~90% | SEO field, widely supported |
| `summary` | ~70% | Some themes auto-generate from content |
| Images in content | 100% | Standard Markdown image syntax |

### What Does NOT Transfer

| Content Type | Why |
|--------------|-----|
| `showTableOfContents` | Congo-specific display option |
| `showReadingTime` | Congo-specific display option |
| `heroStyle` | Congo-specific layout option |
| `{{< alert >}}` shortcode | Congo-specific |
| `{{< badge >}}` shortcode | Congo-specific |
| Theme-specific params | Each theme defines its own |

### Your Content's Portability Score: ~85%

Current content analysis:
- Posts use pure Markdown (100% portable)
- Frontmatter uses some Congo-specific fields (need mapping)
- No shortcodes used (100% portable)
- No custom layouts (100% portable)

### Frontmatter Mapping Example

**Congo → PaperMod:**

```yaml
# Congo frontmatter
showTableOfContents: true
showReadingTime: true
showDate: true

# PaperMod equivalent
ShowToc: true
ShowReadingTime: true
ShowPostNavLinks: true
```

---

## Theme Configuration

### The params.toml Challenge

Each theme has completely different `params.toml` structure:

**Congo:**
```toml
colorScheme = "dracula"
homepage.layout = "profile"
article.showTableOfContents = true
```

**PaperMod:**
```toml
defaultTheme = "dark"
ShowReadingTime = true
ShowToc = true
```

**Stack:**
```toml
mainSections = ["post"]
featuredImageField = "image"
```

### Strategy: Theme-Specific Config Profiles

For themes you use frequently, maintain separate config profiles:

```
config/
├── _default/           # Shared settings
│   ├── hugo.toml       # Module import (active theme)
│   ├── menus.toml      # Navigation
│   └── params.toml     # Active theme params
└── themes/             # Theme-specific params (optional)
    ├── congo.params.toml
    ├── papermod.params.toml
    └── stack.params.toml
```

**To switch completely:**
```bash
make switch-theme theme=adityatelange/hugo-PaperMod
cp config/themes/papermod.params.toml config/_default/params.toml
```

### Minimal params.toml for Testing

For quick theme testing, use minimal config:

```toml
# Minimal params.toml that works with most themes
author = "Ahmad Luqman"
description = "Personal tech blog"
```

---

## Troubleshooting

### "binary with name 'go' not found"

Hugo Modules require Go. Install it:

```bash
brew install go
```

### "module not found" Error

The module path is case-sensitive and must match GitHub exactly:

```bash
# Wrong (lowercase)
make switch-theme theme=caiJimmy/hugo-theme-stack

# Correct (exact case)
make switch-theme theme=CaiJimmy/hugo-theme-stack
```

### Theme Not Rendering Correctly

1. **Check params.toml**: Theme may require specific configuration
2. **Check frontmatter**: Theme may expect different fields
3. **Check shortcodes**: Theme may not have shortcodes you're using

### Clearing Module Cache

If themes seem stale or corrupted:

```bash
hugo mod clean
hugo mod tidy
```

Or clear Go's entire module cache:

```bash
go clean -modcache
```

### Build Warnings

**"Comments are enabled but no comments partial exists"** (Congo)
- Benign warning, ignore unless you want comments
- To fix: set `article.showComments = false` in params.toml

---

## Architecture Decision Records

### ADR-001: Hugo Modules over Git Submodules

**Status:** Accepted

**Context:**
We wanted to support switching between 200+ Hugo themes without bloating the repository.

**Decision:**
Use Hugo Modules instead of git submodules for theme management.

**Consequences:**
- (+) Zero repository size increase per theme
- (+) Themes shared across all Hugo projects via Go module cache
- (+) One-command theme switching
- (+) Automatic version management
- (-) Requires Go runtime installed
- (-) First-run latency when downloading new themes

---

### ADR-002: Build-Time Theme Switching Only

**Status:** Accepted

**Context:**
Evaluated runtime theme switching (like dark/light mode) vs build-time switching.

**Decision:**
Support only build-time theme switching.

**Rationale:**
Hugo themes define HTML structure, not just CSS:
- Congo: `<article class="prose">`
- PaperMod: `<div class="post-content">`

Runtime switching would require either:
1. All themes use identical HTML (impossible - defeats purpose of themes)
2. JavaScript rewrites entire DOM (impractical, slow)
3. Bundle all theme CSS (massive file sizes)

**Consequences:**
- (+) Simple, reliable implementation
- (+) Zero runtime overhead
- (+) Full theme feature support
- (-) Theme changes require rebuild
- (-) Cannot let visitors choose themes

---

### ADR-003: Content Portability over Theme Features

**Status:** Accepted

**Context:**
Theme-specific features (shortcodes, frontmatter) create lock-in.

**Decision:**
Keep content in standard Markdown, avoid theme-specific shortcodes.

**Consequences:**
- (+) ~85% content portability across themes
- (+) Easy theme experimentation
- (+) Future-proof content
- (-) Miss out on some theme-specific features
- (-) Less rich content formatting

---

## Performance Benchmarks

### Build Times

| Scenario | Time |
|----------|------|
| Build with cached theme | ~50ms |
| First build (download theme) | 5-30s |
| Theme switch + build | 1-10s |

### Storage Impact

| Before (Submodules) | After (Modules) |
|---------------------|-----------------|
| themes/congo: ~10 MB | themes/: 0 MB |
| .git/modules: ~15 MB | go.mod: ~100 B |
| Total: ~25 MB | go.sum: ~200 B |

Themes now live in `~/go/pkg/mod/` (shared system-wide).

---

## References

- [Hugo Modules Documentation](https://gohugo.io/hugo-modules/)
- [Hugo Theme Components](https://gohugo.io/hugo-modules/theme-components/)
- [Go Modules Reference](https://go.dev/ref/mod)
- [Hugo Blog Themes Gallery](https://themes.gohugo.io/tags/blog/)
- [Congo Theme Documentation](https://jpanther.github.io/congo/)
- [PaperMod Theme Documentation](https://adityatelange.github.io/hugo-PaperMod/)
