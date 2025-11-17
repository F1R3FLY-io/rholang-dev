# Claude Code Assistant Rules

## Git Interaction Rules

### Committing Changes
- **DO NOT** automatically commit changes after making edits
- **DO NOT** suggest committing unless explicitly asked by the user
- **WAIT** for explicit user instructions like "commit this", "save to git", or "commit these changes"
- **EXCEPTION**: Only commit when the user explicitly requests it

### Git Commands
- The user will explicitly ask when they want to:
  - Commit changes
  - Create branches
  - Push to remote
  - Create pull requests
  - Perform any other git operations

## Project-Specific Information

### Project: Rholang Documentation Site
- Jekyll-based static site for Rholang programming language
- Uses custom navigation (top bar) instead of Just the Docs sidebar
- Community-focused approach with Learn, Reference, Community, and Blog sections
- GitHub Pages deployment ready

### Testing Commands
- Local Jekyll server: `bundle exec jekyll serve --watch`
- Site available at: http://localhost:4000/

### Project Structure
```
docs/
├── _layouts/          # Custom layouts (home.html, default.html)
├── assets/
│   ├── css/          # Custom styling (custom.css)
│   └── js/           # Navigation scripts (nav.js)
├── learn/            # Learning resources
├── reference/        # API and language reference
├── community/        # Community resources
├── blog/             # Blog posts
└── _config.yml       # Jekyll configuration
```