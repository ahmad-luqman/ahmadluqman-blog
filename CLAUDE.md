# Claude Code Context

## Project Overview

Personal tech blog for Ahmad Luqman at https://ahmadluqman.com

**Stack**: Hugo (extended) + Congo theme + Dracula colors + Cloudflare Pages

## Available CLI Tools

| Tool | Command | Purpose |
|------|---------|---------|
| Hugo | `hugo` | Static site generator (extended version with SCSS) |
| GitHub CLI | `gh` | Repo management, Actions, PRs |
| Wrangler | `wrangler` | Cloudflare Pages deployments |
| Make | `make` | Project automation |

## Quick Commands

```bash
# Development
make dev                    # Start local server at localhost:1313
make build                  # Production build to ./public

# Content
make new title="Post Title" # Create new post with date-slug
make draft title="WIP"      # Create draft post
make stats                  # Show content statistics

# Deployment
git push origin main        # Auto-deploys via GitHub Actions
make publish                # Interactive commit + push

# Cloudflare
wrangler pages project list              # List projects
wrangler pages deploy public             # Manual deploy (prefer GH Actions)
```

## Project Structure

```
├── .github/workflows/     # deploy.yml (main→prod), preview.yml (PRs)
├── archetypes/            # Post templates (posts.md, default.md)
├── assets/css/
│   ├── custom.css         # Typography and layout overrides
│   └── schemes/dracula.css # Dracula color scheme
├── config/_default/
│   ├── hugo.toml          # Main config (baseURL, build settings)
│   ├── params.toml        # Theme params, author info, features
│   └── menus.toml         # Navigation menus
├── content/
│   ├── about.md           # About page
│   ├── posts/             # Blog posts
│   └── projects/          # Project showcases
└── themes/congo/          # Git submodule (don't edit directly)
```

## Configuration

- **baseURL**: https://ahmadluqman.com/
- **Theme**: Congo (git submodule, stable branch)
- **Color scheme**: Dracula (`colorScheme = "dracula"` in params.toml)
- **Default appearance**: Dark mode, no auto-switch

## GitHub Actions

- **deploy.yml**: Triggers on push to `main` → builds → deploys to Cloudflare Pages
- **preview.yml**: Triggers on PRs → builds with drafts → deploys preview → comments URL

**Required secrets** (Settings → Secrets → Actions):
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Cloudflare Pages

- **Project**: `ahmadluqman-blog`
- **Production URL**: https://ahmadluqman.com
- **Preview URL pattern**: https://<branch>.ahmadluqman-blog.pages.dev

## Content Guidelines

### Post Frontmatter

```yaml
---
title: "Post Title"
date: 2024-12-29
draft: false
description: "SEO description (150 chars)"
summary: "Card summary for list pages"
tags: ["tag1", "tag2"]
categories: ["tutorial"]  # tutorial, experience, til, tooling, architecture
showTableOfContents: true
---
```

### Categories

- `tutorial` - Step-by-step guides
- `experience` - Lessons learned, war stories
- `til` - Today I Learned (short notes)
- `tooling` - Developer tools and workflow
- `architecture` - System design, decisions

## Common Tasks

### Update Congo theme
```bash
git submodule update --remote themes/congo
```

### Check for issues
```bash
make check  # Broken links, missing descriptions, long titles
```

### Add comments (Giscus)
1. Set up Giscus at https://giscus.app
2. Add config to `params.toml`:
```toml
[giscus]
  repo = "ahmad-luqman/ahmadluqman-blog"
  repoId = "..."
  category = "Comments"
  categoryId = "..."
```

## Author Info

- **Name**: Ahmad Luqman
- **Email**: hi@ahmadluqman.com
- **GitHub**: github.com/ahmad-luqman
- **Location**: Pakistan
