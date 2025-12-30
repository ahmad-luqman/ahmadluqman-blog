---
title: "Building a Python CLI Tool in 3 Hours with Claude Code"
date: 2024-12-30
draft: false
description: "A detailed look at building svg-pipeline from scratch using AI-assisted development. 27 prompts, 207 tool calls, and lessons learned about working with coding agents."
summary: "I built a complete Python CLI tool and library in one session with Claude Code. Here's how the conversation went, what decisions were made, and what I learned about AI-assisted development."

tags: ["ai", "python", "claude-code", "cli", "development", "workflow"]
categories: ["experience"]

showTableOfContents: true
showReadingTime: true
showComments: true
---

*A note on transparency: This post was written with AI assistance (Claude), reflecting on a project built with AI assistance (Claude Code). The experiences, decisions, and reflections are mine. I've edited this multiple times, but want to be upfront about the meta-ness of writing about AI with AI.*

---

## The Problem I Was Trying to Solve

Every time I start a new web project, I need favicons. And PWA icons. And Open Graph images. And Apple touch icons. Every. Single. Time.

The workflow always goes: find an SVG converter, resize images manually, create ICO files somewhere, forget a size, realize I need `android-chrome-512x512.png`, go back and redo it.

I'd been meaning to automate this for years. I had notes about it. Architecture ideas. Never shipped.

## What I Actually Built

**svg-pipeline** - A Python CLI tool and library that takes an SVG and generates all the derivative assets you need:

```bash
svg-pipeline generate ./logo.svg -o ./assets
```

Output:
```
assets/
├── favicon.svg
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── og-image.png
└── site.webmanifest
```

Also works as a library:

```python
from svg_pipeline import Pipeline

Pipeline("logo.svg").with_preset("web").generate("./output")
```

The whole thing: ~800 lines of Python, full test suite, CI/CD, published to GitHub in about 3 hours.

## The Numbers That Surprised Me

I exported the Claude Code session transcript. Here's what an afternoon of "AI-assisted development" actually looks like:

| Metric | Value |
|--------|-------|
| My prompts | 27 |
| Total messages | 713 |
| Tool calls (file ops, bash, etc.) | 207 |
| Commits generated | 10 |
| Session pages | 6 |

27 prompts for 10 commits means Claude was doing a lot of work between my inputs. Most of that was file reads, writes, test runs, and fixing issues I never saw.

### The Development Flow

Here's what an AI-assisted development loop actually looks like:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     AI-ASSISTED DEVELOPMENT FLOW                        │
└─────────────────────────────────────────────────────────────────────────┘

  ┌──────────┐
  │   ME     │  "Build a favicon generator with
  │ (Human)  │   these architecture principles..."
  └────┬─────┘
       │
       ▼
  ┌──────────────────────────────────────────────────────┐
  │                   CLAUDE CODE                         │
  │  ┌────────────────────────────────────────────────┐  │
  │  │  Read files → Understand context               │  │
  │  │       ↓                                        │  │
  │  │  Plan implementation                           │  │
  │  │       ↓                                        │  │
  │  │  Write code → Run tests → Fix errors          │◄─┼──┐
  │  │       ↓                    ↑                   │  │  │
  │  │       └────────────────────┘                   │  │  │
  │  │            (auto-iterate)                      │  │  │
  │  └────────────────────────────────────────────────┘  │  │
  └───────────────────────┬──────────────────────────────┘  │
                          │                                  │
                          ▼                                  │
                   ┌─────────────┐                           │
                   │   Output    │                           │
                   │  "Here's    │                           │
                   │  what I     │                           │
                   │  built..."  │                           │
                   └──────┬──────┘                           │
                          │                                  │
                          ▼                                  │
                   ┌─────────────┐      ┌──────────────┐     │
                   │   ME        │ YES  │  Next task   │─────┘
                   │  Review &   │─────►│  or tweak    │
                   │  Decide     │      └──────────────┘
                   └──────┬──────┘
                          │ NO (ship it)
                          ▼
                   ┌─────────────┐
                   │   COMMIT    │
                   └─────────────┘
```

The key insight: **I prompted 27 times, but Claude iterated hundreds of times internally** (reading, writing, testing, fixing) between my prompts.

### The Architecture That Emerged

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      SVG-PIPELINE ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────┘

                         ┌─────────────┐
                         │   CLI       │  svg-pipeline generate logo.svg
                         │  (Typer)    │
                         └──────┬──────┘
                                │
                                ▼
  ┌──────────────────────────────────────────────────────────────────────┐
  │                          PIPELINE                                     │
  │                                                                       │
  │   logo.svg ──► Backend ──► Transforms ──► Executor ──► Outputs       │
  │                                                                       │
  └──────────────────────────────────────────────────────────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
  │  Presets   │ │  Backends  │ │ Transforms │ │ Executors  │
  │            │ │            │ │            │ │            │
  │ ┌────────┐ │ │ ┌────────┐ │ │ ┌────────┐ │ │ ┌────────┐ │
  │ │  web   │ │ │ │ Pillow │ │ │ │ resize │ │ │ │ Sequential│
  │ ├────────┤ │ │ ├────────┤ │ │ ├────────┤ │ │ ├────────┤ │
  │ │ mobile │ │ │ │OpenCV* │ │ │ │ color  │ │ │ │ Thread  │ │
  │ ├────────┤ │ │ ├────────┤ │ │ ├────────┤ │ │ ├────────┤ │
  │ │  full  │ │ │ │  GPU*  │ │ │ │ convert│ │ │ │ Process │ │
  │ └────────┘ │ │ └────────┘ │ │ └────────┘ │ │ └────────┘ │
  └────────────┘ └────────────┘ └────────────┘ └────────────┘
                  * = future

                                │
                                ▼
                    ┌───────────────────────┐
                    │       OUTPUT          │
                    │                       │
                    │  favicon.ico          │
                    │  favicon-32x32.png    │
                    │  apple-touch-icon.png │
                    │  og-image.png         │
                    │  site.webmanifest     │
                    │  ...                  │
                    └───────────────────────┘
```

This architecture wasn't in my original prompt—Claude inferred it from my principles and built something extensible.

## How The Session Actually Went

### Prompt 1: The Big Ask

I didn't start small. I gave Claude the full problem statement, solution idea, and architecture:

> use current folder for new git repo which you will git initialize as first task, here is the prompt for you to follow...
>
> PROBLEM: Generating consistent, multi-format assets from source SVGs requires multiple tools and manual work...
>
> ARCHITECTURE PRINCIPLES:
> - Core library separate from CLI
> - Swappable processing backends
> - Parallel execution support
> - Plugin architecture for transforms

Then I pasted a complete project structure I'd sketched out.

This is different from how I'd typically work with ChatGPT or Copilot. I wasn't asking for a snippet—I was handing over a vision and asking for implementation.

### What Claude Did (That I Didn't Ask For)

The interesting part wasn't what I asked for. It was the decisions Claude made that I'd have to make myself:

**Pydantic for config models** - I said "config" in my architecture notes. Claude chose Pydantic, set up proper validation, made it work with YAML presets. Reasonable choice, probably what I'd have picked.

**CairoSVG for rendering** - I mentioned Pillow as default backend. Claude realized Pillow can't render SVG directly, brought in CairoSVG for that step. I didn't know I needed this.

**Hypothesis for property-based tests** - I said "tests." Claude added both unit tests AND property-based tests with Hypothesis. Overkill? Maybe. But I learned something.

### When I Had To Step In

It wasn't all smooth:

**macOS Cairo issues** - Tests kept failing with library not found errors. I had to debug `DYLD_FALLBACK_LIBRARY_PATH` issues myself. Claude helped once I explained the problem, but it didn't anticipate macOS library linking quirks.

**API design choices** - When I wanted a fluent API (`Pipeline().with_preset().generate()`), I had to be specific about the chaining pattern. The initial implementation returned `None` instead of `self`.

**Fit modes for aspect ratios** - Claude's first resize implementation stretched images. I asked for cover/contain modes like CSS. We went back and forth on the exact behavior.

This is the part that matters: **I was still making design decisions**. Claude was implementing them, fast.

## The Commit History Tells A Story

Looking at the commits in order:

```
269cd0b Initial commit: SVG Pipeline project structure
bd20a6b Add parallel execution support
d12a20d Add beard silhouette template
a5bf065 Add aspect ratio handling with fit modes
6f935b7 Replace beard template with traced vector from PNG
455d9cc Add CLAUDE.md for Claude Code guidance
432d332 Add GitHub Actions CI pipeline
06e9fc6 Fix lint issues for CI
4fa80fe Add .DS_Store to gitignore
c8465cf Fix CI: Cairo path for macOS, relax mypy strict mode
86adbe4 Fix Python 3.10 compatibility and CI type checking
```

Notice the pattern:
1. Big initial commit (Claude built the scaffold)
2. Features added incrementally (parallel, templates, fit modes)
3. CI/CD setup
4. Then **four commits just fixing CI issues**

That last part is real software development. The "building" part took maybe an hour. Getting CI green took another hour of iteration.

## What I Learned About AI-Assisted Development

### Give Context, Not Just Tasks

My first prompt was ~300 words of context. Problem, solution, architecture, structure. Claude used all of it.

Compare:
- ❌ "Create a Python CLI for image processing"
- ✅ "I need to generate favicons from SVGs. Here's the full problem, here's my architecture idea, here's how I want the API to look..."

The second gets you something you actually want.

### Let It Run, Then Review

I didn't approve every file write. I let Claude make changes, run tests, fix errors—then reviewed the result. This felt uncomfortable at first.

But it's how I'd work with a junior developer, right? "Here's the task, here's the tests, let me know when it's green."

### AI Is Bad At Knowing What It Doesn't Know

Claude confidently wrote macOS-compatible code that didn't work on macOS. It didn't know about dynamic library loading quirks until tests failed.

When something doesn't work, I still need to debug. AI helps once I've identified the problem. It's less helpful at diagnosing novel issues.

### CLAUDE.md Is Underrated

I added a `CLAUDE.md` file to the repo with:
- How to run tests (including the Cairo path workaround)
- Architecture overview
- Where to add new features

Now when I open Claude Code in this repo, it knows the context. Future me (or future AI) can pick up where I left off.

## The Meta Question: Am I Still A Developer?

This is what I've been thinking about.

In 3 hours, I "built" a tool that would've taken me a weekend. But did I build it? I wrote 27 prompts. Claude wrote 800 lines of code.

My current answer: **I designed it. Claude implemented it.**

That's not nothing. The architecture was mine. The API design was mine. The decision to use cover/contain fit modes—mine. When CI broke, I diagnosed it.

But the Python syntax? The Pydantic models? The test structure? That was all Claude.

I'm not sure how to feel about this. I'm definitely faster. But am I getting better at Python, or just better at prompting?

## Would I Do This Again?

Yes. For this kind of project—a well-defined tool with clear inputs and outputs—AI-assisted development is a force multiplier.

I'd be more cautious for:
- Complex business logic with lots of edge cases
- Code I need to deeply understand and maintain
- Security-critical systems

But for utilities, automation, CLI tools? This is my workflow now.

## Try It Yourself

The code is on GitHub: [github.com/ahmad-luqman/svg-pipeline](https://github.com/ahmad-luqman/svg-pipeline)

The session transcript is in `/transcripts/` if you want to see the actual conversation.

If you build something with AI assistance, I'd love to hear about it. What worked? What didn't? Are you faster? Are you learning?

[hi@ahmadluqman.com](mailto:hi@ahmadluqman.com)

---

*The irony of using AI to write about using AI to write code is not lost on me. We're deep in the meta now.*
