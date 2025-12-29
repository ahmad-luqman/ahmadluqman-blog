# Makefile for ahmadluqman.com blog
# Developer-friendly commands for the publishing pipeline

.PHONY: dev build deploy new preview clean help

# Default target
.DEFAULT_GOAL := help

# Variables
HUGO := hugo
PORT := 1313
DRAFTS := -D
FUTURE := -F

#------------------------------------------------------------------------------
# Development
#------------------------------------------------------------------------------

dev: ## Start development server with drafts and future posts
	@echo "🚀 Starting dev server at http://localhost:$(PORT)"
	$(HUGO) server $(DRAFTS) $(FUTURE) --port $(PORT) --bind 0.0.0.0

dev-live: ## Dev server with live reload and drafts
	$(HUGO) server $(DRAFTS) $(FUTURE) --port $(PORT) --navigateToChanged

prod: ## Start server in production mode (no drafts)
	$(HUGO) server --port $(PORT)

#------------------------------------------------------------------------------
# Content Creation
#------------------------------------------------------------------------------

new: ## Create new post: make new title="My Post Title"
ifndef title
	$(error Usage: make new title="Your Post Title")
endif
	@slug=$$(echo "$(title)" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$$//'); \
	date=$$(date +%Y-%m-%d); \
	$(HUGO) new posts/$$date-$$slug.md; \
	echo "📝 Created: content/posts/$$date-$$slug.md"

draft: ## Create draft post: make draft title="WIP Post"
ifndef title
	$(error Usage: make draft title="Your Post Title")
endif
	@slug=$$(echo "$(title)" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$$//'); \
	date=$$(date +%Y-%m-%d); \
	$(HUGO) new posts/$$date-$$slug.md; \
	echo "📝 Created draft: content/posts/$$date-$$slug.md"

project: ## Create new project: make project title="Project Name"
ifndef title
	$(error Usage: make project title="Project Name")
endif
	@slug=$$(echo "$(title)" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$$//'); \
	$(HUGO) new projects/$$slug.md; \
	echo "🛠️  Created: content/projects/$$slug.md"

#------------------------------------------------------------------------------
# Build
#------------------------------------------------------------------------------

build: ## Build site for production
	@echo "🔨 Building site..."
	$(HUGO) --minify --gc
	@echo "✅ Built to ./public"

build-preview: ## Build including drafts and future posts
	$(HUGO) --minify --gc $(DRAFTS) $(FUTURE)

stats: ## Show site statistics
	@echo "📊 Site Statistics"
	@echo "=================="
	@echo "Posts: $$(find content/posts -name '*.md' 2>/dev/null | wc -l | tr -d ' ')"
	@echo "Projects: $$(find content/projects -name '*.md' 2>/dev/null | wc -l | tr -d ' ')"
	@echo "Drafts: $$(grep -rl 'draft: true' content/ 2>/dev/null | wc -l | tr -d ' ')"
	@echo "Total words: $$(find content -name '*.md' -exec cat {} \; 2>/dev/null | wc -w | tr -d ' ')"

#------------------------------------------------------------------------------
# Git Workflow
#------------------------------------------------------------------------------

publish: ## Build and push to main (triggers deploy)
	@echo "📤 Publishing to production..."
	git add -A
	@read -p "Commit message: " msg; \
	git commit -m "$$msg"
	git push origin main
	@echo "✅ Pushed! Cloudflare will auto-deploy."

save: ## Quick save (add, commit, push)
	git add -A
	git commit -m "WIP: $$(date '+%Y-%m-%d %H:%M')"
	git push

sync: ## Sync with remote
	git fetch --all
	git pull --rebase

#------------------------------------------------------------------------------
# Preview & Testing
#------------------------------------------------------------------------------

preview-build: ## Build preview for PR/branch
	$(HUGO) --minify --gc --baseURL "/" $(DRAFTS)

check: ## Check for common issues
	@echo "🔍 Checking for issues..."
	@echo ""
	@echo "Broken internal links:"
	@grep -rn "\](/[^)]*)" content/ | grep -v "http" || echo "  None found ✓"
	@echo ""
	@echo "Missing descriptions:"
	@grep -L "description:" content/posts/*.md 2>/dev/null || echo "  All posts have descriptions ✓"
	@echo ""
	@echo "Long titles (>60 chars):"
	@grep "^title:" content/posts/*.md 2>/dev/null | awk -F'"' 'length($$2) > 60 {print $$2}' || echo "  None found ✓"

#------------------------------------------------------------------------------
# Utilities
#------------------------------------------------------------------------------

clean: ## Clean build artifacts
	rm -rf public/ resources/ .hugo_build.lock
	@echo "🧹 Cleaned!"

update-theme: ## Update Congo theme
	git submodule update --remote themes/congo
	@echo "✅ Theme updated"

open: ## Open site in browser
	open http://localhost:$(PORT)

#------------------------------------------------------------------------------
# Help
#------------------------------------------------------------------------------

help: ## Show this help
	@echo "Ahmad Luqman Blog - Development Commands"
	@echo "========================================"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Examples:"
	@echo "  make dev                    # Start dev server"
	@echo "  make new title=\"My Post\"    # Create new post"
	@echo "  make publish                # Deploy to production"
