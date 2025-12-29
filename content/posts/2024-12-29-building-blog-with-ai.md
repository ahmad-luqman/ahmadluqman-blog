---
title: "How I Finally Built My Tech Blog After 10 Years (With a Little AI Help)"
date: 2024-12-29
lastmod: 2024-12-29
draft: true
description: "A developer's honest journey from a neglected domain to a live blog in one afternoon. What worked, what didn't, and some thoughts on AI-assisted workflows."
summary: "I had a domain sitting unused for 10 years. Here's how I finally got unstuck, what I learned along the way, and some honest reflections on working with AI tools."

tags: ["ai", "workflow", "cloudflare", "hugo", "productivity", "learning"]
categories: ["experience"]

showTableOfContents: true
showReadingTime: true
showComments: true
---

*A note before we start: I used Claude to help me write and structure this post. The experiences, decisions, and opinions are mine—I've proofread and edited this multiple times—but I want to be upfront that AI assisted with the writing. More thoughts on this at the end.*

---

## The Embarrassing Truth

I've owned `ahmadluqman.com` for over a decade. Ten years of paying renewal fees for a domain that pointed to nothing. Ten years of telling myself "I'll set up that blog this weekend."

If you've ever had a side project that never shipped, you know the feeling. It's not that I didn't know how—I'm a software engineer, I deploy things for a living. It was the accumulated weight of small decisions: Which platform? What theme? How to handle deployment? Each question felt like a commitment I wasn't ready to make.

I'm sharing this not because I figured out some secret, but because I finally got unstuck. Maybe something here helps you do the same.

## What Changed

I'd been using Claude for coding tasks at work—debugging, refactoring, explaining unfamiliar codebases. But I'd always treated it like a search engine with better answers. Ask question, get answer, move on.

This time, I tried something different. Instead of asking "how do I set up a Hugo blog," I started a conversation about what I actually needed. I shared context: my background, my constraints, what I already owned (like a Dracula theme license I'd bought years ago), and what mattered to me.

The difference surprised me. It wasn't faster, necessarily. But it was... less lonely? Having something to think through options with, even if that something is an AI, made the decisions feel less heavy.

## The Decisions (And How I Made Them)

I'm not going to tell you what tools to use—your situation is different from mine. But here's how I thought through a few choices, in case the process is helpful.

### Where to Host the Domain

I'd been paying Google Workspace for email I barely used, with the domain registered through eNom (their backend provider). I asked Claude to compare Cloudflare and DNSimple.

What I learned:
- Cloudflare is basically at-cost (~$10/year) but locks you to their nameservers
- DNSimple is more flexible but pricier and had some recent price increases

For a personal blog, the lock-in didn't matter. I went with Cloudflare. But if you're managing domains for clients or need more control, DNSimple might make more sense. There's no universal "best."

### Static Site Generator

I looked at Hugo, Astro, and 11ty. Honestly? They're all fine. I picked Hugo because the Congo theme had typography I liked, and I'd heard good things about build speed.

If you're more comfortable with JavaScript, Astro might feel more natural. If you want maximum simplicity, 11ty is great. I don't think you can go wrong here.

### The Theme Colors

This is where having context helped. I mentioned I'd bought a Dracula Pro license years ago. Instead of ignoring that, we figured out how to create a custom color scheme for Congo using the Dracula palette.

Small thing, but it meant I got something that felt like *mine*, not just another default template.

## What Actually Happened

The build process wasn't smooth. I want to be honest about that.

**First attempt**: Got all the config files set up, pushed to GitHub, deploy failed. The Cloudflare Pages project didn't exist yet—you have to create it before the GitHub Action can deploy to it. Obvious in hindsight, confusing in the moment.

**Second attempt**: Created the Pages project, deploy worked, but I'd accidentally created a Worker instead of a Pages project. Different things in Cloudflare's world. Had to delete and redo.

**Third attempt**: DNS took a few minutes to propagate. Kept refreshing, wondering if I'd broken something. I hadn't. Just impatience.

Total time: Maybe 3 hours from start to live site. But at least an hour of that was me not reading error messages carefully enough.

## A Few Things I Learned

Take these with a grain of salt—they worked for me today, they might not work for you tomorrow.

### Share Context Generously

The more I told Claude about my situation—not just technical requirements, but constraints, preferences, existing tools—the more useful the suggestions were. 

It's like talking to a colleague. "How do I deploy this?" gets a generic answer. "I have this existing setup, I'm trying to avoid this problem, and I care about this tradeoff" gets a conversation.

### Ask for Options, Then Decide

I tried to ask "what are the tradeoffs between X and Y" rather than "which should I use." 

This isn't about doubting AI recommendations. It's about staying in the driver's seat. The decisions are mine to live with, so I want to understand them.

### Small Steps, Tested Often

We didn't try to build everything at once:
1. Transfer domain (test: DNS resolves)
2. Set up email forwarding (test: email arrives)
3. Create blog structure (test: runs locally)
4. Set up deployment (test: pushes work)
5. Add custom domain (test: live site)

When step 4 failed, I knew the problem was somewhere in the deployment config, not in Hugo or DNS or email.

### Let AI Handle the Tedious Parts

The valuable work was deciding what to build and how. The tedious work was YAML syntax, finding the right dashboard buttons, remembering git submodule commands.

I'm happy to outsource the second category.

## The Numbers

I'm a bit embarrassed to share these, but maybe it'll motivate someone:

| Before | After |
|--------|-------|
| Google Workspace email | Cloudflare Email Routing (free) |
| ~$12/year domain (unused) | ~$10/year domain (with a blog!) |
| **~$100+/year for nothing** | **~$10/year for a working blog** |

The blog also comes with free CDN, SSL, DDoS protection, and automatic deploys. I was massively overpaying for services I didn't need.

## My Writing Workflow Now

I want to write more, so I tried to make the process as frictionless as possible:

```bash
make new title="My Post Title"   # Creates the file
make dev                         # Preview locally
# ... write, probably badly ...
make publish                     # Live in 30 seconds
```

For the actual writing, I'll often:
1. Dump rough thoughts as bullet points
2. Ask Claude to help structure and polish
3. Read it back, edit heavily, add my voice
4. Read it again the next day before publishing

The AI helps with grammar and flow (English is my second language). The ideas are mine. The final edit is mine.

## Some Honest Thoughts on AI Tools

This is where I want to pause and be a bit more reflective.

### What I'm Excited About

The productivity gain is real. Things that would have taken me a weekend of googling and frustration took an afternoon. That's meaningful—it means more people can build things, and more ideas can see the light of day.

### What I'm Cautious About

I'm aware that I'm coming at this from a position of privilege. I'm a software engineer, I understand what the AI is outputting, I can spot when it's wrong. I speak English (even if it's my second language). I have access to these tools.

Not everyone does.

I worry about a world where the gap widens between those who can leverage AI effectively and those who can't. I worry about what happens to people whose jobs get automated before they can adapt. I worry about us becoming dependent on tools we don't fully understand.

I don't have answers. But I think it's worth sitting with these questions rather than just celebrating the productivity gains.

### How I Want AI to Treat Me

This might sound strange, but: I want AI to be a tool that makes me better at being human, not a replacement for being human.

When Claude helps me write, I want to end up a better writer—not someone who's forgotten how to write. When it helps me debug, I want to understand the fix—not just copy-paste blindly.

I'm still figuring out where that line is. But I think it's worth being intentional about it.

*These thoughts probably deserve their own post. For now, I'll leave them here as notes to myself as much as to anyone reading.*

---

## If You've Been Putting Something Off

I don't know if this post was useful. I'm not an expert on any of this—I'm just someone who finally shipped something he'd been avoiding for a decade.

If you've got a similar project collecting dust, maybe today's the day. The tools are good enough. The friction is lower than ever. And sometimes you just need to start.

If you do build something, I'd love to hear about it. I'm at [hi@ahmadluqman.com](mailto:hi@ahmadluqman.com), and I genuinely mean that—I learn more from seeing what others build than from any tutorial.

Thanks for reading.

---

*The source for this blog is on [GitHub](https://github.com/ahmad-luqman/ahmadluqman-blog) if you want to see the setup. And yes, the irony of using AI to write a blog post about using AI is not lost on me.*
