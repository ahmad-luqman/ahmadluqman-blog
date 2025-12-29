# LLM Prompt Templates for Blog Writing

Use these templates with Claude, GPT, or other LLMs to accelerate content creation.

---

## 1. Technical Tutorial Post

```
I'm writing a tutorial for my tech blog (ahmadluqman.com).
Target audience: Intermediate developers familiar with [TECH_STACK].

**Topic**: [DESCRIBE WHAT YOU'RE TEACHING]

**My rough notes**:
[PASTE YOUR BULLET POINTS, CODE SNIPPETS, COMMANDS]

**Please write**:
1. Engaging title (< 60 chars, SEO-friendly)
2. Meta description (150-160 chars)
3. Introduction with hook + what they'll learn
4. Prerequisites section
5. Step-by-step guide with code examples
6. Common pitfalls/troubleshooting
7. Conclusion with key takeaways

**Format**: Hugo-compatible Markdown with YAML frontmatter
**Length**: 1000-1500 words
**Tone**: Technical but approachable, like explaining to a colleague
```

---

## 2. Experience/Story Post

```
I want to write about a real experience I had as a developer.

**What happened**:
[DESCRIBE THE SITUATION - PROBLEM, PROCESS, RESOLUTION]

**Key learnings**:
[BULLET POINTS OF WHAT YOU LEARNED]

**Please write**:
1. Compelling title that hints at the lesson
2. Meta description
3. Story structure: situation → complication → resolution
4. Technical details where relevant (with code if applicable)
5. Lessons learned section
6. Conclusion with broader takeaway

**Tone**: Personal, reflective, but still technically valuable
**Length**: 800-1200 words
```

---

## 3. Tool/Library Review

```
I want to review a tool/library I've been using.

**Tool**: [NAME]
**What it does**: [BRIEF DESCRIPTION]
**My use case**: [HOW I'M USING IT]

**My experience**:
- Pros: [LIST]
- Cons: [LIST]
- Gotchas: [ANY SURPRISES]

**Please write**:
1. Title with clear value proposition
2. Quick intro: what it is, who it's for
3. Getting started section
4. My real-world use case
5. Honest pros/cons
6. Comparison with alternatives (if any)
7. Verdict: who should use it

**Tone**: Honest, practical, not promotional
```

---

## 4. Today I Learned (TIL)

```
I learned something useful today that's worth sharing.

**What I learned**:
[DESCRIBE THE THING]

**Context**:
[WHY I NEEDED THIS, WHAT PROBLEM IT SOLVED]

**The solution/insight**:
[CODE OR EXPLANATION]

**Please write**:
A short (300-500 word) TIL post with:
1. Catchy title starting with "TIL:"
2. Brief context (1-2 sentences)
3. The actual learning with code example
4. Why it matters / when to use it
5. Optional: link to docs or further reading

**Tone**: Quick, punchy, immediately useful
```

---

## 5. Comparison Post

```
I want to compare two approaches/tools/methods.

**Comparing**: [A] vs [B]
**Context**: [WHAT PROBLEM THEY BOTH SOLVE]

**My experience with A**:
[NOTES]

**My experience with B**:
[NOTES]

**Please write**:
1. Title: "[A] vs [B]: [VALUE PROPOSITION]"
2. Intro: when you'd need to choose between these
3. Overview of each option
4. Comparison table with key criteria
5. When to use A vs when to use B
6. My recommendation based on different scenarios

**Tone**: Balanced, data-driven where possible
```

---

## 6. Polish/Edit Existing Draft

```
Please edit this draft blog post. Keep my voice but improve:
- Clarity and flow
- Grammar and punctuation
- Technical accuracy
- Engagement (hook, transitions, conclusion)

**My draft**:
[PASTE YOUR DRAFT]

**Specific concerns**:
[ANY SPECIFIC THINGS YOU WANT ADDRESSED]

Return the edited version with:
1. Suggested title if mine needs improvement
2. Meta description
3. Full edited post
4. Summary of major changes made
```

---

## 7. Generate Post Ideas

```
Help me brainstorm blog post ideas.

**My expertise/interests**:
- Django, React, PostgreSQL
- DevOps (Docker, Azure)
- Local LLMs and AI tools
- Developer productivity
- Performance optimization

**Recent things I've worked on**:
[LIST A FEW RECENT PROJECTS OR CHALLENGES]

**Please suggest**:
10 blog post ideas with:
- Working title
- One-sentence pitch
- Target audience
- Estimated difficulty to write (easy/medium/hard)

Mix of tutorials, experiences, and opinions.
```

---

## Usage Tips

1. **Be specific**: The more context you give, the better the output
2. **Include real code**: LLMs write better when they have examples
3. **Iterate**: First draft → ask for specific improvements → polish
4. **Verify technical content**: Always test code examples yourself
5. **Add your voice**: Edit the output to sound like you
6. **Save time on structure**: Let AI handle outline, you focus on unique insights
