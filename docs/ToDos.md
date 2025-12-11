---
layout: page
title: Documentation Tasks
mr_status:
  ready: false
  target_branch: main
  title: ""
  description: ""
  labels: []
last_updated: 2025-02-19
---

# Documentation Tasks

Task tracker for completing the Rholang documentation site.

## Priority Levels
- **p0**: Blocking - site broken or misleading without this
- **p1**: High - core documentation needed for users
- **p2**: Medium - valuable but not essential for launch
- **p3**: Low - nice to have, can defer

---

## p0 - Blocking

### TASK-100: Capture language deltas from new interpreter sources
- **Status**: completed
- **Goal**: Inventory all syntax/semantic changes between the scraped (legacy) docs and the current Rholang implementation in:
  - `f1r3node/rust/dev/rholang/src/rust/interpreter`
  - `f1r3node/main/rholang/src/main/bnfc`
- **Acceptance Criteria**:
  - Change log drafted in `docs/specs/rholang-version-diff.md` with references to source files/commits
  - List of new/changed constructs, removed constructs, and behavioral changes
  - Identified feature flags or runtime differences that affect examples
- **Blocked by**: None

### TASK-101: Draft updated language specification outline
- **Status**: completed
- **Goal**: Produce a structured outline for the updated spec that reflects the current interpreter and BNFC grammar.
- **File**: `docs/specs/rholang-language-spec.md`
- **Acceptance Criteria**:
  - Table of contents covering syntax, semantics, cost model, and concurrency primitives
  - Imports grammar from BNFC or references its location for regeneration
  - Notes on intended version scope and compatibility with legacy docs
- **Blocked by**: TASK-100

### TASK-102: Re-scope documentation set to the current language
- **Status**: pending
- **Goal**: Map all existing `.md` pages to the updated spec, flag outdated sections, and define required updates/removals.
- **File**: `docs/specs/doc-update-plan.md`
- **Acceptance Criteria**:
  - Matrix of existing pages → keep/update/remove, with owners and priorities
  - Navigation impact noted (including `docs/index.md` and sidebar menus)
  - Dependencies recorded so execution tasks can be sequenced
- **Blocked by**: TASK-100, TASK-101

### TASK-103: Collect publicly available grammar and interpreter artifacts
- **Status**: pending
- **Goal**: Assemble the public sources needed for comparison (BNFC grammar and Rust interpreter snapshots from `f1r3node` links).
- **Acceptance Criteria**:
  - Local copies of the BNFC grammar (`rholang/src/main/bnfc`) and interpreter entry points (`rholang/src/rust/interpreter`) saved for reference
  - Note which branch/commit each snapshot comes from and any build flags affecting language features
  - Identified any missing public artifacts required for full coverage (e.g., cost model docs, stdlib definitions)
- **Blocked by**: None

### TASK-103a: Incorporate legacy reference PDF (Google Drive)
- **Status**: pending
- **Goal**: Add the Google Drive document (`https://drive.google.com/file/d/1FvPuiPm7ytGyklex_PEmVyJ8XgbTdIEg/view`) to the resource set for language documentation.
- **Acceptance Criteria**:
  - Local copy or accessible reference stored/linked for the team
  - Noted provenance/version/date of the document
  - Extracted relevant sections mapped to spec outline where applicable
- **Blocked by**: None

### TASK-104: Gap analysis between public sources and planned spec
- **Status**: pending
- **Goal**: Compare the public interpreter/grammar artifacts against the planned spec outline to surface missing sections and doc gaps.
- **File**: `docs/specs/rholang-version-diff.md` (or section therein)
- **Acceptance Criteria**:
  - Table summarizing constructs present in interpreter/BNFC vs current doc set (new/changed/removed)
  - List of spec sections that need additions or clarifications to cover observed behavior (syntax, semantics, cost model, stdlib)
  - Risks and unknowns called out (e.g., areas where behavior is unclear from public code)
- **Blocked by**: TASK-101, TASK-103

### TASK-105: Capture version history (1.0 → 1.4 roadmap)
- **Status**: pending
- **Goal**: Document the provided version history notes (1.1 syntactic sugar, partially implemented 1.2, in-progress 1.3 MeTTa IL, future 1.4 agents/reifiable spaces) and integrate them into the spec context.
- **File**: `docs/specs/rholang-version-diff.md`
- **Acceptance Criteria**:
  - Version deltas summarized: rename `;`→`&`, reintroduce `;` as sequencing, call-response `!?`, receive-ack `?!`
  - 1.2 deferred items (name qualifiers, MORK internal use) noted with where/when addressed
  - 1.3 goals (theories, spaces, MORK, type predicates, transactions/tokenization) captured
  - 1.4 preview (agents, reifiable spaces with qualifiers) captured with current status
- **Blocked by**: None

### TASK-106: Incorporate agents and reifiable spaces from FIPS
- **Status**: pending
- **Goal**: Pull the agents and reifiable spaces design details from `https://github.com/F1R3FLY-io/FIPS/tree/main` (both “under review” and “approved”) to inform the spec and gap analysis.
- **Acceptance Criteria**:
  - Key FIPS documents identified and locally referenced
  - Agent model and reifiable space semantics summarized for the spec outline
  - Open questions/risks logged if FIPS content is incomplete or evolving
- **Blocked by**: TASK-105, availability of the FIPS repo content

---

## p1 - Core Language Documentation

### TASK-110: Author updated language specification
- **Status**: pending
- **Goal**: Fill out `docs/specs/rholang-language-spec.md` with the current grammar and semantics, using the BNFC grammar and Rust interpreter as sources.
- **Acceptance Criteria**:
  - Sections for syntax, operational semantics, name/process distinction, cost model, and concurrency primitives are populated
  - Examples reflect current interpreter behavior and pass against reference interpreter
  - Version and compatibility notes included
- **Blocked by**: TASK-101

### TASK-111: Update core language docs to match new spec
- **Status**: pending
- **Goal**: Align existing language pages with the updated spec (names/processes, expressions, send/receive, pattern matching, iteration, design patterns, cost accounting).
- **Acceptance Criteria**:
  - Each core language page refreshed for current syntax/semantics
  - Examples validated against the updated interpreter
  - Cross-links added back to the spec and tutorials
- **Blocked by**: TASK-110

### TASK-112: Refresh tutorials and examples
- **Status**: pending
- **Goal**: Update tutorials and example snippets to match the current language behavior and cost model.
- **Acceptance Criteria**:
  - Tutorial steps match current syntax and runtime behavior
  - Code samples verified against the interpreter
  - Notes added for breaking changes from legacy docs
- **Blocked by**: TASK-111

### TASK-113: Navigation refresh for updated docs
- **Status**: pending
- **Goal**: Rebuild navigation (`docs/index.md` and sidebar includes) to reflect the updated spec and refreshed pages.
- **Acceptance Criteria**:
  - No dead links in navigation
  - New spec and updated pages linked from top-level index
  - Legacy pages removed or redirected per `docs/specs/doc-update-plan.md`
- **Blocked by**: TASK-102

### TASK-010: Create names-processes page
- **Status**: pending
- **Goal**: Document Rholang names and processes fundamentals
- **File**: `docs/names-processes.md`
- **Acceptance Criteria**:
  - Explains names vs processes distinction
  - Includes working code examples
  - Links to related tutorials
- **Blocked by**: TASK-111

### TASK-011: Create expressions page
- **Status**: pending
- **Goal**: Document Rholang expressions and data types
- **File**: `docs/expressions.md`
- **Acceptance Criteria**:
  - Covers all expression types
  - Includes syntax examples
- **Blocked by**: TASK-111

### TASK-012: Create send-receive page
- **Status**: pending
- **Goal**: Document channel communication patterns
- **File**: `docs/send-receive.md`
- **Acceptance Criteria**:
  - Explains send (`!`) and receive (`for`) syntax
  - Covers persistent sends and receives
  - Includes concurrency examples
- **Blocked by**: TASK-111

### TASK-013: Create pattern-match page
- **Status**: pending
- **Goal**: Document pattern matching in Rholang
- **File**: `docs/pattern-match.md`
- **Acceptance Criteria**:
  - Covers all pattern types
  - Explains match expressions
  - Includes practical examples
- **Blocked by**: TASK-111

### TASK-014: Create iteration page
- **Status**: pending
- **Goal**: Document looping and iteration patterns
- **File**: `docs/iteration.md`
- **Acceptance Criteria**:
  - Explains recursive patterns
  - Covers common iteration idioms
- **Blocked by**: TASK-111

### TASK-015: Create design-patterns page
- **Status**: pending
- **Goal**: Document common Rholang design patterns
- **File**: `docs/design-patterns.md`
- **Acceptance Criteria**:
  - Covers state management patterns
  - Includes concurrency patterns
  - Shows object-capability examples
- **Blocked by**: TASK-111

### TASK-016: Create rholang-cost-accounting page
- **Status**: pending
- **Goal**: Document execution costs and phlogiston
- **File**: `docs/rholang-cost-accounting.md`
- **Acceptance Criteria**:
  - Explains cost model
  - Covers optimization strategies
- **Blocked by**: TASK-111

---

## p1 - RNode Setup Documentation

### TASK-020: Create installing-rnode page
- **Status**: pending
- **Goal**: Document RNode installation process
- **File**: `docs/installing-rnode.md`
- **Acceptance Criteria**:
  - Covers all supported platforms
  - Includes prerequisites
  - Verified installation steps
- **Blocked by**: TASK-102

### TASK-021: Create running-rnode page
- **Status**: pending
- **Goal**: Document running RNode without Docker
- **File**: `docs/running-rnode.md`
- **Acceptance Criteria**:
  - Covers standalone mode
  - Explains configuration options
- **Blocked by**: TASK-020, TASK-102

### TASK-022: Create running-rnode-docker page
- **Status**: pending
- **Goal**: Document running RNode with Docker
- **File**: `docs/running-rnode-docker.md`
- **Acceptance Criteria**:
  - Docker compose examples
  - Volume and networking setup
- **Blocked by**: TASK-102

### TASK-023: Create network-configuration page
- **Status**: pending
- **Goal**: Document network configuration options
- **File**: `docs/network-configuration.md`
- **Acceptance Criteria**:
  - Covers bootstrap nodes
  - Explains networking options
- **Blocked by**: TASK-020, TASK-102

---

## p1 - RNode Operations

### TASK-030: Create commands page
- **Status**: pending
- **Goal**: Document RNode CLI commands
- **File**: `docs/commands.md`
- **Acceptance Criteria**:
  - Complete command reference
  - Usage examples for each command
- **Blocked by**: TASK-020, TASK-102

### TASK-031: Create deploy-contract page
- **Status**: pending
- **Goal**: Document contract deployment process
- **File**: `docs/deploy-contract.md`
- **Acceptance Criteria**:
  - Step-by-step deployment guide
  - Includes error handling
- **Blocked by**: TASK-030, TASK-102

### TASK-032: Create propose-block page
- **Status**: pending
- **Goal**: Document block proposal process
- **File**: `docs/propose-block.md`
- **Acceptance Criteria**:
  - Explains propose mechanism
  - Covers timing and requirements
- **Blocked by**: TASK-031, TASK-102

### TASK-033: Create block-finalization page
- **Status**: pending
- **Goal**: Document block finalization checking
- **File**: `docs/block-finalization.md`
- **Acceptance Criteria**:
  - Explains finalization process
  - Covers verification steps
- **Blocked by**: TASK-032, TASK-102

---

## p2 - RSpace Documentation

### TASK-040: Create rspace-intro page
- **Status**: pending
- **Goal**: Introduce RSpace execution environment
- **File**: `docs/rspace-intro.md`
- **Acceptance Criteria**:
  - Explains RSpace++ architecture
  - Covers key concepts
- **Blocked by**: TASK-102

### TASK-041: Create rspace-tut page
- **Status**: pending
- **Goal**: RSpace implementation tutorial
- **File**: `docs/rspace-tut.md`
- **Acceptance Criteria**:
  - Hands-on examples
  - Explains internal workings
- **Blocked by**: TASK-040, TASK-102

---

## p2 - Validator Documentation

### TASK-050: Create cbc-protocol page
- **Status**: pending
- **Goal**: Document CBC Casper protocol state
- **File**: `docs/cbc-protocol.md`
- **Acceptance Criteria**:
  - Explains current protocol status
  - Covers safety guarantees
- **Blocked by**: TASK-102

### TASK-051: Create bonding-network page
- **Status**: pending
- **Goal**: Explain validator bonding
- **File**: `docs/bonding-network.md`
- **Acceptance Criteria**:
  - Explains what validators do
  - Covers bonding requirements
- **Blocked by**: TASK-102

### TASK-052: Create bonding-validator page
- **Status**: pending
- **Goal**: Guide for running a validator
- **File**: `docs/bonding-validator.md`
- **Acceptance Criteria**:
  - Step-by-step setup guide
  - Hardware requirements
- **Blocked by**: TASK-051, TASK-102

### TASK-053: Create rchain-network-docker page
- **Status**: pending
- **Goal**: Document Docker-based network setup
- **File**: `docs/rchain-network-docker.md`
- **Acceptance Criteria**:
  - Multi-node Docker setup
  - Networking configuration
- **Blocked by**: TASK-022, TASK-102

### TASK-054: Create rchain-network-terraform page
- **Status**: pending
- **Goal**: Document Terraform deployment
- **File**: `docs/rchain-network-terraform.md`
- **Acceptance Criteria**:
  - Terraform modules
  - Cloud deployment guide
- **Blocked by**: TASK-102

---

## p2 - Sharding Documentation

### TASK-060: Create sharding-proposal page
- **Status**: pending
- **Goal**: Document sharding proposal
- **File**: `docs/sharding-proposal.md`
- **Blocked by**: TASK-102

### TASK-061: Create sharding-definitions page
- **Status**: pending
- **Goal**: Define sharding terminology
- **File**: `docs/sharding-definitions.md`
- **Blocked by**: TASK-060, TASK-102

### TASK-062: Create sharding-localized page
- **Status**: pending
- **Goal**: Document localized processes
- **File**: `docs/sharding-localized.md`
- **Blocked by**: TASK-061, TASK-102

### TASK-063: Create powerset-shards page
- **Status**: pending
- **Goal**: Document powerset shards
- **File**: `docs/powerset-shards.md`
- **Blocked by**: TASK-061, TASK-102

---

## p3 - Research and History

### TASK-070: Create research page
- **Status**: pending
- **Goal**: Overview of research foundations
- **File**: `docs/research.md`
- **Blocked by**: TASK-102

### TASK-071: Create history-blockchain page
- **Status**: pending
- **Goal**: Document blockchain history context
- **File**: `docs/history-blockchain.md`
- **Blocked by**: TASK-102

---

## p3 - Site Infrastructure

### TASK-080: Create dapps/examples directory
- **Status**: pending
- **Goal**: Add example dApps referenced in dapps/index.md
- **File**: `dapps/examples/`
- **Blocked by**: TASK-102

### TASK-081: Verify Jekyll build
- **Status**: pending
- **Goal**: Ensure site builds without errors
- **Acceptance Criteria**:
  - `bundle exec jekyll build` succeeds
  - No broken internal links
- **Blocked by**: TASK-102

---

## Completed

_None yet_

---

## Notes

- Tutorials section is complete with 21 files
- Core language docs (TASK-010 through TASK-016) should be prioritized as they're most useful to developers
- Consider whether some RNode-specific docs should link to external RChain resources instead of duplicating
- Repository content is legacy (scraped from rholang.org); align everything to the current interpreter in `f1r3node` (Rust) and the BNFC grammar before publishing updates
