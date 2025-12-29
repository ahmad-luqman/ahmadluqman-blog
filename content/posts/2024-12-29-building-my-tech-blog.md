---
title: "Building My Tech Blog with Hugo, Dracula, and Cloudflare"
date: 2024-12-29
lastmod: 2024-12-29
draft: false
description: "How I built a developer-friendly blog with Hugo, Congo theme, Dracula colors, and Cloudflare Pages—complete with a git-based publishing pipeline."
summary: "A complete walkthrough of setting up a fast, beautiful tech blog with Hugo and Cloudflare Pages, featuring the Dracula color scheme I use everywhere."

tags: ["hugo", "cloudflare", "blogging", "dracula", "workflow"]
categories: ["tutorial"]

showTableOfContents: true
showReadingTime: true
showComments: true
---

## Why Build a Blog in 2024?

After years of keeping notes in private docs, I decided it was time to share what I learn publicly. Not because I think I'm an expert—but because writing forces clarity, and public writing creates accountability.

I wanted something that:

- **Loads fast**: No JavaScript-heavy frameworks
- **Looks good**: Easy on the eyes for long reading sessions
- **Fits my workflow**: Git-based, terminal-friendly, automatable
- **Costs nothing**: Or close to it

## The Stack

After evaluating several options, I landed on:

| Component | Choice | Why |
|-----------|--------|-----|
| Static Site Generator | Hugo | Fast builds, great ecosystem |
| Theme | Congo | Best typography, Tailwind-based |
| Colors | Dracula | I use it everywhere, why not here? |
| Hosting | Cloudflare Pages | Free, fast, auto-deploy from Git |
| Domain | Cloudflare Registrar | ~$10/year, no upsells |

## Setting Up Hugo with Congo

First, install Hugo (you need the extended version for Congo):

```bash
brew install hugo
hugo version  # Should show "extended"
```

Create the site and add Congo:

```bash
hugo new site my-blog
cd my-blog
git init
git submodule add -b stable https://github.com/jpanther/congo.git themes/congo
```

## The Dracula Color Scheme

I already own a [Dracula Pro](https://draculatheme.com) license, so I customized Congo to match. The key colors:

```css
--background: #282a36;    /* That familiar dark purple-gray */
--foreground: #f8f8f2;    /* Soft white text */
--purple: #bd93f9;        /* Primary accent */
--pink: #ff79c6;          /* Secondary accent */
--cyan: #8be9fd;          /* Links on hover */
--green: #50fa7b;         /* Success states */
```

The result? My blog looks like my terminal, my editor, and my notes app. Consistency matters.

## The Publishing Pipeline

Here's my workflow:

```
Write locally → Preview with `make dev` → Commit → Push → Live in 30 seconds
```

The Makefile gives me shortcuts:

```bash
make dev                    # Start local server
make new title="My Post"    # Create new post with slug
make publish                # Build, commit, push
make stats                  # Show content statistics
```

## Cloudflare Pages Setup

Connecting to Cloudflare Pages:

1. Push your repo to GitHub
2. In Cloudflare Dashboard → Pages → Create Project
3. Connect your GitHub repo
4. Build settings:
   - Build command: `hugo --minify`
   - Build output: `public`
   - Environment variable: `HUGO_VERSION` = `0.139.0`

Every push to `main` triggers a deploy. PRs get preview URLs automatically.

## Cost Breakdown

| Item | Cost |
|------|------|
| Domain (ahmadluqman.com) | ~$10/year |
| Hosting (Cloudflare Pages) | $0 |
| SSL | $0 |
| CDN | $0 |
| Email forwarding | $0 |
| **Total** | **~$10/year** |

## What's Next

Now that the infrastructure is in place, I can focus on writing. Topics I'm planning:

- Setting up Qwen2.5-Coder locally on M4 Max
- Django query optimization patterns
- Claude Code workflow tips

---

*The full source for this blog is available on [GitHub](https://github.com/ahmad-luqman/ahmadluqman-blog). Feel free to use it as a starting point for your own.*
