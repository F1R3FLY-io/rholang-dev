# Agents Guide for Rholang Docs

Guidance for AI agents working in this repository, adapted from the Smart Assets top-level agentic workflow.

## Scope and Priorities
- Document-first: write or update specs/design notes before code; follow SA’s [AI Coding Philosophy](https://gitlab.com/smart-assets.io/gitlab-profile/-/blob/master/docs/common/ai-coding-philosophy.md).
- Preserve Rholang accuracy: keep examples valid, align with existing terminology, and avoid speculative language changes.
- Keep edits local to this repo; do not touch sibling projects unless explicitly asked.

## How to Work (Interactive vs Agentic)
- Default: interactive mode with approvals; respect repo boundaries and avoid automated git actions.
- Agentic/YOLO runs: use a git worktree or set `CLAUDE_AGENTIC_MODE=true` only when explicitly approved. Follow the [Agentic Mode Usage](https://gitlab.com/smart-assets.io/gitlab-profile/-/blob/master/docs/agentic-workflows.md#yolo-mode-for-agentic-development) pattern: isolated worktree, autonomous edits, then handoff for review.
- Task selection: if multiple tasks exist, mirror the SA `docs/ToDos.md` structure (YAML frontmatter for MR readiness) before autonomous execution.

## Git and Change Control
- Do **not** run `git add`, `git commit`, or `git push` directly; use workspace slash commands (`/quick-commit`, `/recursive-push`) if instructed.
- Prefer feature work in a worktree; keep the main checkout clean for review.
- No destructive git commands; never discard user changes.

## Implementation and Quality Bar
- Follow existing Jekyll structure; keep navigation and link formats consistent.
- Include runnable snippets; prefer concise Rholang examples that demonstrate concurrency patterns.
- Cross-reference related docs where useful (tutorials, language guide, reference).
- Run checks when changing site content: `bundle exec jekyll build` (or `bundle exec jekyll serve` locally) before handoff when feasible.

## Quick References
- Project context and commands: `README.md`, `CLAUDE.md`
- SA agentic standards: [Agentic Workflows](https://gitlab.com/smart-assets.io/gitlab-profile/-/blob/master/docs/agentic-workflows.md), [Git Interaction Policy](https://gitlab.com/smart-assets.io/gitlab-profile/-/blob/master/docs/common/git-interaction-policy.md), [Agentic File Structure Standard](https://gitlab.com/smart-assets.io/gitlab-profile/-/blob/master/docs/common/agentic-file-structure-standard.md)
