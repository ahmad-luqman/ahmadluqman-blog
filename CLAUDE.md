# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal tech blog at https://blog.ahmadluqman.com

**Stack**: Hugo (extended) + Congo theme + Dracula colors + Cloudflare Pages

## Commands

```bash
# Development
make dev                    # Start local server at localhost:1313 (includes drafts)
make prod                   # Server without drafts
make build                  # Production build to ./public

# Content
make new title="Post Title" # Create post: content/posts/YYYY-MM-DD-slug.md
make project title="Name"   # Create project page

# Publishing
make publish                # Interactive commit + push (triggers deploy)
git push origin main        # Direct deploy via GitHub Actions

# Utilities
make stats                  # Content statistics
make check                  # Find broken links, missing descriptions
make update-theme           # Update Congo submodule
make clean                  # Remove build artifacts
```

## Architecture

```
config/_default/
├── hugo.toml          # baseURL, build settings, markup config
├── params.toml        # Theme config, colorScheme="dracula", author info
└── menus.toml         # Navigation structure

assets/css/
├── schemes/dracula.css # Color scheme (cyan primary, purple accents)
└── custom.css          # Typography overrides

content/
├── posts/              # Blog posts (YYYY-MM-DD-slug.md format)
├── projects/           # Project showcases
└── about.md            # About page

themes/congo/           # Git submodule - don't edit directly
```

## Deployment

- **Push to main** → GitHub Actions → Hugo build → Cloudflare Pages
- **PR branches** → Preview deploys with drafts included
- **Production**: https://blog.ahmadluqman.com
- **Previews**: https://{branch}.ahmadluqman-blog.pages.dev

## Post Frontmatter

```yaml
---
title: "Post Title"
date: 2024-12-29
draft: false                 # Set true to hide from production
description: "SEO desc"      # ~150 chars
summary: "Card text"         # List page preview
tags: ["tag1", "tag2"]
categories: ["tutorial"]     # tutorial, experience, til, tooling, architecture
showTableOfContents: true
---
```

## Key Files

| File | Purpose |
|------|---------|
| `config/_default/params.toml` | Theme settings, author info, feature toggles |
| `assets/css/schemes/dracula.css` | Color scheme (CSS custom properties) |
| `archetypes/posts.md` | Template for new posts |
| `.github/workflows/deploy.yml` | Production deploy pipeline |
