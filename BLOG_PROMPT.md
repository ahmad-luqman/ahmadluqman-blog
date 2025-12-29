# Blog Post Request

## Topic
[DESCRIBE YOUR TOPIC HERE]

## Context
- What problem did you encounter?
- What did you try?
- What worked / didn't work?
- What did you learn?

---

## Writing Style Guidelines

### Voice & Tone
- **Humble**: I'm sharing what I learned, not claiming expertise
- **Honest**: Include mistakes, dead ends, what didn't work
- **Curious**: Frame as "here's what I discovered" not "here's what you should do"
- **Inviting**: Encourage readers to share their experiences, I want to learn from them too

### Structure Preferences
- Start with the real problem, not abstract theory
- Share the journey, not just the destination
- Include honest failures and iterations
- End with open questions or invitation for feedback
- Keep sections digestible, not walls of text

### Things to Avoid
- Don't brag about efficiency or cleverness
- Don't use phrases like "simply", "just", "obviously"
- Don't be preachy or lecture the reader
- Don't over-explain basics (trust the reader)
- Avoid clickbait or exaggerated claims

### AI Transparency
Include a brief note acknowledging AI assistance in writing/editing. Example:
> *I used Claude to help structure and polish this post. The experiences and opinions are mine.*

### Philosophical Touch (when relevant)
If the topic involves AI/automation, briefly acknowledge:
- Who benefits, who might be left behind
- What skills we should preserve vs delegate
- Questions worth sitting with (not necessarily answers)

---

## Output Format
```yaml
title: "..."
description: "..."  # 1-2 sentences for SEO/preview
tags: [...]
---
[Blog content in markdown]
```

---

## Example Topics for Reference
- "How I debugged X after trying Y and Z"
- "What I learned building X from scratch"
- "Comparing A vs B: my experience after using both"
- "The workflow that finally worked for me"

---

## Quick Version (Copy-Paste Ready)
```
Write a blog post about: [TOPIC]

My context: [WHAT HAPPENED, WHAT YOU TRIED, WHAT YOU LEARNED]

Style:
- Humble, sharing what I learned (not claiming expertise)
- Honest about mistakes and iterations
- Invite readers to share their experience
- Include a note that AI helped with writing/editing
- If relevant, briefly acknowledge who benefits/loses from this technology

Format: Markdown with frontmatter (title, description, tags)
```

---

## Example Usage
```
Write a blog post about: Building svg-pipeline, an open source asset generator

My context:
- Needed favicons for my blog, existing tools fragmented
- Built a Python CLI with Claude Code in one session
- Architecture: backends (Pillow/OpenCV), presets (YAML), parallel execution
- Learned about plugin patterns, executor abstraction
- Want to share as open source recipe others can follow

Style: [paste the style guidelines above]
```
