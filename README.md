# ahmadluqman.com

My personal tech blog built with Hugo, Congo theme, and Dracula colors.

🌐 **Live**: [ahmadluqman.com](https://ahmadluqman.com)

## Stack

- **Generator**: [Hugo](https://gohugo.io) (Extended)
- **Theme**: [Congo](https://github.com/jpanther/congo) with custom Dracula colors
- **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com)
- **Domain**: Cloudflare Registrar

## Quick Start

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/ahmadluqman/ahmadluqman-blog.git
cd ahmadluqman-blog

# Start dev server
make dev

# Open http://localhost:1313
```

## Commands

```bash
make dev                    # Start development server (with drafts)
make new title="My Post"    # Create new post
make build                  # Build for production
make publish                # Commit and push (triggers deploy)
make stats                  # Show site statistics
make help                   # Show all commands
```

## Project Structure

```
.
├── archetypes/           # Post templates
├── assets/css/           # Custom CSS + Dracula scheme
├── config/_default/      # Hugo configuration
├── content/
│   ├── posts/            # Blog posts
│   ├── projects/         # Project pages
│   └── about.md          # About page
├── layouts/              # Template overrides
├── static/images/        # Static assets
├── themes/congo/         # Theme (git submodule)
└── Makefile              # Dev commands
```

## Writing Workflow

1. Create post: `make new title="My Post Title"`
2. Edit in `content/posts/`
3. Preview: `make dev`
4. Set `draft: false` when ready
5. Publish: `make publish`

## Customization

### Dracula Colors

The custom Dracula scheme is in `assets/css/schemes/dracula.css`.

### Typography

Additional typography tweaks in `assets/css/custom.css`.

## License

Content: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)  
Code: [MIT](LICENSE)
