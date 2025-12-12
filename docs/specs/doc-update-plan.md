---
layout: page
title: Documentation Update Plan
description: Mapping existing documentation to updated language spec
status: draft
last_updated: 2025-12-11
---

# Documentation Update Plan

This document maps all existing documentation pages to the updated Rholang specification, flagging outdated sections and defining required updates. Based on analysis from TASK-100 (version diff) and TASK-101 (language spec outline).
Source baseline: `f1r3node` `rust/dev` commit `1ba0835e` cataloged in [source-artifacts.md](./source-artifacts.md); grammar snapshot is recorded in [rholang-bnfc-draft.md](./rholang-bnfc-draft.md).

## Executive Summary

The documentation set was scraped from legacy rholang.org content (Joshy Orndorff tutorials). Most core language concepts remain valid, but the following areas require updates:

1. **Infrastructure references** - Legacy platform content needs F1r3fly updates
2. **Cost model** - Phlogiston/REV references need Rust interpreter alignment
3. **System URNs** - New AI URNs and undocumented URNs need coverage
4. **Validator/consensus** - Legacy Casper references need F1r3fly consensus updates

---

## Page Inventory Matrix

### Legend

| Status | Meaning |
|--------|---------|
| **keep** | Content is accurate, no changes needed |
| **update** | Content is mostly valid but needs specific updates |
| **rewrite** | Content structure is valid but requires significant revision |
| **remove** | Content is obsolete or misleading |
| **create** | Page does not exist, needs to be created |

---

## Main Documentation (`docs/`)

| Page | Status | Priority | Owner | Notes |
|------|--------|----------|-------|-------|
| `docs/index.md` | **update** | p1 | - | Align branding with F1r3fly; fix broken links |
| `docs/rholang/index.md` | **update** | p1 | - | Update F1r3fly branding; verify OSLF reference |

### Specs (`docs/specs/`)

| Page | Status | Priority | Owner | Notes |
|------|--------|----------|-------|-------|
| `docs/specs/rholang-version-diff.md` | **keep** | p0 | - | Core reference, maintain as updates occur |
| `docs/specs/rholang-language-spec.md` | **update** | p0 | - | Fill out sections per TASK-110 |
| `docs/specs/doc-update-plan.md` | **keep** | p0 | - | This document |

### Language Reference (to be created)

| Page | Status | Priority | Blocked By | Notes |
|------|--------|----------|------------|-------|
| `docs/names-processes.md` | **create** | p1 | TASK-111 | Core language concept |
| `docs/expressions.md` | **create** | p1 | TASK-111 | Data types and expressions |
| `docs/send-receive.md` | **create** | p1 | TASK-111 | Channel communication |
| `docs/pattern-match.md` | **create** | p1 | TASK-111 | Pattern matching reference |
| `docs/iteration.md` | **create** | p1 | TASK-111 | Looping patterns |
| `docs/design-patterns.md` | **create** | p1 | TASK-111 | Common idioms |
| `docs/rholang-cost-accounting.md` | **create** | p1 | TASK-111 | Cost model documentation |

### RNode Setup (to be created)

| Page | Status | Priority | Blocked By | Notes |
|------|--------|----------|------------|-------|
| `docs/installing-rnode.md` | **create** | p1 | TASK-102 | Update for F1r3fly node |
| `docs/running-rnode.md` | **create** | p1 | TASK-020 | Non-Docker setup |
| `docs/running-rnode-docker.md` | **create** | p1 | TASK-102 | Docker-based setup |
| `docs/network-configuration.md` | **create** | p1 | TASK-020 | Network settings |

### RNode Operations (to be created)

| Page | Status | Priority | Blocked By | Notes |
|------|--------|----------|------------|-------|
| `docs/commands.md` | **create** | p1 | TASK-020 | CLI reference |
| `docs/deploy-contract.md` | **create** | p1 | TASK-030 | Deployment guide |
| `docs/propose-block.md` | **create** | p1 | TASK-031 | Block proposal |
| `docs/block-finalization.md` | **create** | p1 | TASK-032 | Finalization checking |

### RSpace (to be created)

| Page | Status | Priority | Blocked By | Notes |
|------|--------|----------|------------|-------|
| `docs/rspace-intro.md` | **create** | p2 | TASK-102 | RSpace++ introduction |
| `docs/rspace-tut.md` | **create** | p2 | TASK-040 | Implementation tutorial |

### Validator (to be created)

| Page | Status | Priority | Blocked By | Notes |
|------|--------|----------|------------|-------|
| `docs/cbc-protocol.md` | **create** | p2 | TASK-102 | Protocol status (F1r3fly consensus) |
| `docs/bonding-network.md` | **create** | p2 | TASK-102 | Validator overview |
| `docs/bonding-validator.md` | **create** | p2 | TASK-051 | Validator setup |
| `docs/f1r3fly-network-docker.md` | **create** | p2 | TASK-022 | Multi-node Docker |
| `docs/f1r3fly-network-terraform.md` | **create** | p2 | TASK-102 | Cloud deployment |

### Sharding (to be created)

| Page | Status | Priority | Blocked By | Notes |
|------|--------|----------|------------|-------|
| `docs/sharding-proposal.md` | **create** | p2 | TASK-102 | Sharding overview |
| `docs/sharding-definitions.md` | **create** | p2 | TASK-060 | Terminology |
| `docs/sharding-localized.md` | **create** | p2 | TASK-061 | Localized processes |
| `docs/powerset-shards.md` | **create** | p2 | TASK-061 | Powerset model |

### Research (to be created)

| Page | Status | Priority | Blocked By | Notes |
|------|--------|----------|------------|-------|
| `docs/research.md` | **create** | p3 | TASK-102 | Research foundations |
| `docs/history-blockchain.md` | **create** | p3 | TASK-102 | Historical context |

---

## Tutorials (`tutorials/`)

All tutorials are from the Joshy Orndorff series. Core Rholang syntax is compatible with the current interpreter; infrastructure references need updates.

| Page | Status | Priority | Notes |
|------|--------|----------|-------|
| `tutorials/index.md` | **update** | p1 | Update environment links; verify VSCode plugin status |
| `tutorials/sending.md` | **update** | p1 | Verify examples against Rust interpreter |
| `tutorials/receiving.md` | **update** | p1 | Verify examples |
| `tutorials/names-and-processes.md` | **keep** | p1 | Core concepts unchanged |
| `tutorials/send-and-peek.md` | **update** | p1 | Verify `<<-` syntax support |
| `tutorials/join.md` | **update** | p1 | Verify join semantics |
| `tutorials/unforgable-names.md` | **keep** | p1 | Core concept unchanged |
| `tutorials/bundles-interpolation.md` | **update** | p1 | Verify `%%` operator |
| `tutorials/state-channels.md` | **keep** | p1 | Pattern unchanged |
| `tutorials/object-capabilities.md` | **keep** | p1 | Pattern unchanged |
| `tutorials/additional-syntax.md` | **update** | p1 | Verify all syntax constructs |
| `tutorials/pattern-matching.md` | **keep** | p1 | Core concept unchanged |
| `tutorials/data-structures.md` | **update** | p1 | Verify collection operations |
| `tutorials/recursion.md` | **keep** | p1 | Pattern unchanged |
| `tutorials/game-example.md` | **update** | p2 | Verify example runs |
| `tutorials/off-chain.md` | **update** | p2 | May need F1r3fly-specific updates |
| `tutorials/cheat-sheet.md` | **update** | p1 | Add new syntax from spec |

### Rho-Lambda Series

| Page | Status | Priority | Notes |
|------|--------|----------|-------|
| `tutorials/introduction.md` | **keep** | p2 | Theoretical content unchanged |
| `tutorials/boolean.md` | **keep** | p2 | Church booleans unchanged |
| `tutorials/church.md` | **keep** | p2 | Church numerals unchanged |
| `tutorials/linked.md` | **update** | p2 | Verify list operations |
| `tutorials/notation.md` | **keep** | p2 | Notation unchanged |
| `tutorials/conway.md` | **update** | p2 | Verify example runs |

---

## dApps (`dapps/`)

| Page | Status | Priority | Notes |
|------|--------|----------|-------|
| `dapps/index.md` | **update** | p2 | Legacy references need F1r3fly updates; CodeSandbox links may be stale |
| `dapps/examples/` | **create** | p3 | Directory referenced but does not exist |

---

## Navigation Impact

### `docs/index.md` Changes Required

1. Update header branding to F1r3fly
2. Fix all broken internal links (currently point to pages that don't exist)
3. Add link to language specification (`docs/specs/rholang-language-spec.md`)
4. Add link to version differences (`docs/specs/rholang-version-diff.md`)
5. Consider restructuring sections by completion status

### Sidebar/Navigation Structure

Current structure references many non-existent pages. Recommended approach:

1. Phase 1: Link only to existing, verified content
2. Phase 2: Add new pages as they are created per this plan
3. Phase 3: Remove or redirect legacy platform-specific pages

---

## Content Migration Strategy

### Phase 1: Core Language (p0/p1)

1. Complete spec outline (TASK-101) - **DONE**
2. Re-scope docs (TASK-102) - **THIS DOCUMENT**
3. Fill language spec sections (TASK-110)
4. Update core language docs (TASK-111)
5. Update tutorials (TASK-112)
6. Refresh navigation (TASK-113)

### Phase 2: Infrastructure (p1/p2)

1. RNode setup documentation (TASK-020 through TASK-023)
2. RNode operations (TASK-030 through TASK-033)
3. RSpace documentation (TASK-040, TASK-041)

### Phase 3: Advanced Topics (p2/p3)

1. Validator documentation (TASK-050 through TASK-054)
2. Sharding documentation (TASK-060 through TASK-063)
3. Research and history (TASK-070, TASK-071)

---

## Dependencies

```
TASK-100 (version diff)
    |
    v
TASK-101 (spec outline) -----> TASK-110 (author spec)
    |                               |
    v                               v
TASK-102 (this plan) ---------> TASK-111 (update core docs)
    |                               |
    |                               v
    |                          TASK-112 (refresh tutorials)
    |
    +---> TASK-113 (navigation refresh)
    |
    +---> TASK-020+ (infrastructure docs)
```

---

## Risk Areas

### High Risk

1. **Cost model accuracy** - Legacy phlogiston/REV costs may differ from Rust interpreter
2. **Consensus differences** - F1r3fly consensus differs from legacy Casper
3. **External tool references** - VSCode plugin, legacy cloud sandbox may be unmaintained

### Medium Risk

1. **Tutorial examples** - Need verification against current interpreter
2. **Registry URN behavior** - May differ between implementations
3. **Crypto URN availability** - Need to verify all documented URNs work

### Low Risk

1. **Core syntax** - BNFC grammar is stable
2. **Basic patterns** - Send/receive/contract patterns unchanged
3. **Object capability model** - Unchanged conceptually

---

## Action Items

1. [ ] Update `docs/index.md` branding and links
2. [ ] Update `tutorials/index.md` environment references
3. [ ] Verify tutorial examples against Rust interpreter (TASK-112)
4. [ ] Create missing language reference pages (TASK-010 through TASK-016)
5. [ ] Update `dapps/index.md` for F1r3fly
6. [ ] Create `dapps/examples/` directory with working examples (TASK-080)

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | 2025-12-11 | Initial draft from TASK-102 |
