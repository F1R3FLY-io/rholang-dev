---
layout: page
title: Source Artifacts Reference
description: Reference to grammar and interpreter source files for documentation
status: draft
last_updated: 2025-12-11
---

# Source Artifacts Reference

This document catalogs the public source artifacts from `f1r3node` used for Rholang language documentation. These references ensure documentation accuracy and traceability.

## Repository Information

| Property | Value |
|----------|-------|
| Repository | `f1r3node` |
| Local Path | `/Users/jeff/src/CurrentProjects/FF/f1r3node` |
| Branch | `rust/dev` |
| Commit | `1ba0835e` |
| Commit Message | "updating for work w/Nash, Stephen" |

---

## Related Documents

- [rholang-version-diff.md](./rholang-version-diff.md) — change log and gap analysis derived from these artifacts
- [rholang-bnfc-draft.md](./rholang-bnfc-draft.md) — BNFC-style grammar draft translated from the Tree-sitter snapshot
- [doc-update-plan.md](./doc-update-plan.md) — page inventory prioritized using this source catalog

---

## Grammar Artifacts

### BNFC Grammar (Primary Reference)

| Property | Value |
|----------|-------|
| File | `rholang_mercury.cf` |
| Path | `rholang/src/main/bnfc/rholang_mercury.cf` |
| Size | 7138 bytes |
| Grammar Version | Mercury |

The BNFC grammar is the authoritative syntax definition for Rholang. It defines:
- Process expressions and precedence levels (Proc through Proc16)
- Name expressions and patterns
- Ground types (Bool, Int, String, Uri, ByteArray)
- Collections (List, Tuple, Set, Map)
- Operators and their precedence

### Tree-sitter Grammar

| Property | Value |
|----------|-------|
| File | `grammar.json` |
| Path | `rholang/src/main/tree_sitter/src/grammar.json` |
| Source | `rholang/src/main/tree_sitter/grammar.js` |

The Tree-sitter grammar provides parsing for editor integrations and tooling. It is derived from the BNFC grammar with adaptations for Tree-sitter's parsing model.

Supporting files:
- `GPT-BNFC-to-Tree-Sitter.md` - Translation notes
- `test/` - Grammar test cases

---

## Rust Interpreter Artifacts

### Interpreter Core

| File | Path | Purpose |
|------|------|---------|
| `interpreter.rs` | `rholang/src/rust/interpreter/interpreter.rs` | Main interpreter entry |
| `reduce.rs` | `rholang/src/rust/interpreter/reduce.rs` | Reduction semantics (146KB) |
| `substitute.rs` | `rholang/src/rust/interpreter/substitute.rs` | Substitution implementation |
| `rho_runtime.rs` | `rholang/src/rust/interpreter/rho_runtime.rs` | Runtime environment |
| `rho_type.rs` | `rholang/src/rust/interpreter/rho_type.rs` | Type definitions |

### Pattern Matching

| File | Path | Purpose |
|------|------|---------|
| `matcher/` | `rholang/src/rust/interpreter/matcher/` | Pattern matching implementation |

### Cost Accounting

| File | Path | Purpose |
|------|------|---------|
| `costs.rs` | `rholang/src/rust/interpreter/accounting/costs.rs` | Cost definitions |
| `cost_accounting.rs` | `rholang/src/rust/interpreter/accounting/cost_accounting.rs` | Cost tracking |
| `has_cost.rs` | `rholang/src/rust/interpreter/accounting/has_cost.rs` | Cost trait |
| `mod.rs` | `rholang/src/rust/interpreter/accounting/mod.rs` | Module exports |

### System Processes (URNs)

| File | Path | Purpose |
|------|------|---------|
| `system_processes.rs` | `rholang/src/rust/interpreter/system_processes.rs` | URN implementations |
| `openai_service.rs` | `rholang/src/rust/interpreter/openai_service.rs` | AI URN support |

### Supporting Modules

| Directory | Path | Purpose |
|-----------|------|---------|
| `compiler/` | `rholang/src/rust/interpreter/compiler/` | Compilation pipeline |
| `registry/` | `rholang/src/rust/interpreter/registry/` | Registry operations |
| `storage/` | `rholang/src/rust/interpreter/storage/` | Storage backend |
| `merging/` | `rholang/src/rust/interpreter/merging/` | State merging |
| `util/` | `rholang/src/rust/interpreter/util/` | Utilities |
| `test_utils/` | `rholang/src/rust/interpreter/test_utils/` | Test helpers |

---

## Example Rholang Files

Sample `.rho` files in the repository:

| File | Path | Purpose |
|------|------|---------|
| `hello_world_again.rho` | `docker/resources/hello_world_again.rho` | Basic example |
| `nil.rho` | `docker/resources/nil.rho` | Minimal example |
| `simpleInsertLookup.rho` | `docker/resources/simpleInsertLookup.rho` | Registry example |
| `simpleInsertTest.rho` | `docker/resources/simpleInsertTest.rho` | Registry test |
| `simpleLookupTest.rho` | `docker/resources/simpleLookupTest.rho` | Lookup test |

Benchmark files:
- `rspace-bench/src/test/resources/rholang/wide.rho`
- `rspace-bench/src/test/resources/rholang/wide-setup.rho`
- `rspace-bench/src/test/resources/rholang/mvcepp.rho`

Test contracts:
- `casper/src/test/resources/RevAddressTest.rho`
- `casper/src/test/resources/RhoSpecContractTest.rho`

---

## Missing Artifacts

The following artifacts were identified as potentially missing or not publicly available:

| Artifact | Status | Notes |
|----------|--------|-------|
| Stdlib definitions | Not found | No dedicated stdlib directory located |
| Cost model documentation | Partial | `costs.rs` exists but no prose documentation |
| OSLF verification rules | Not found | Referenced in docs but not located in repo |
| Complete system URN tests | Partial | Some test files exist, coverage unclear |

---

## Build Flags and Configuration

The Rust interpreter may support feature flags that affect language behavior. Check `Cargo.toml` files for:

- `rholang/Cargo.toml` - Main Rholang crate
- `rholang/src/rust/interpreter/Cargo.toml` - Interpreter features (if present)

---

## Version Control Notes

To update these references:

1. Navigate to `f1r3node` repository
2. Run `git log --oneline -1` to get current commit
3. Run `git branch --show-current` to verify branch
4. Update this document with new commit information

To compare with a specific version:

```bash
cd /Users/jeff/src/CurrentProjects/FF/f1r3node
git diff <old-commit>..<new-commit> -- rholang/src/main/bnfc/
git diff <old-commit>..<new-commit> -- rholang/src/rust/interpreter/
```

---

## Foundational Reference Documents

### Meredith-Radestock Rho-Calculus Paper (2005)

| Property | Value |
|----------|-------|
| Title | "A logic for a reflective higher-order calculus" |
| Authors | L.G. Meredith, Matthias Radestock |
| Publication | FInCo 2005, Electronic Notes in Theoretical Computer Science |
| Local Path | `Meredith_Radestock-rho_calculus.pdf` |
| Google Drive | `https://drive.google.com/file/d/1FvPuiPm7ytGyklex_PEmVyJ8XgbTdIEg/view` |

This paper defines the theoretical foundation of Rholang - the rho-calculus. Key sections relevant to the language specification:

#### Section 2: The Calculus

Defines the core rho-calculus grammar:

```
P, Q ::= 0           (null process)
       | x(y) . P    (input)
       | x<|P|>      (lift)
       | *x          (drop)
       | P | Q       (parallel)

x, y ::= @P          (quote - name is quoted process)
```

**Key Concepts**:
- **Quote (`@P`)**: Names are quoted processes - a reification of syntactic structure
- **Lift (`x<|P|>`)**: Dynamically packages process P as its code `@P` for output on channel x
- **Drop (`*x`)**: Extracts and runs the process from a quoted name
- **Reflection**: Ability to turn running code into data (quote) and back (drop)

#### Section 2.3: Structural Congruence

```
P | 0  ≡  P  ≡  0 | P
P | Q  ≡  Q | P
(P | Q) | R  ≡  P | (Q | R)
```

#### Section 2.4: Name Equivalence

Two rules generate name equivalence:
- **Quote-drop**: `@(*x) ≡N x`
- **Struct-equiv**: `P ≡ Q` implies `@P ≡N @Q`

#### Section 2.8: Operational Semantics (COMM Rule)

```
x0 ≡N x1
─────────────────────────────────
x0<|Q|> | x1(y) . P  →  P{@Q/y}
```

Communication occurs when send and receive are co-located on equivalent channels.

#### Section 3: Replication

Shows replication can be derived (not primitive):
```
D(x)  ≜  x(y) . (x[y] | *y)
!P(x) ≜  x<|D(x) | P|> | D(x)
```

#### Section 6: Logic

Defines a logic for the calculus with:
- `true` (verity), `0` (nullity)
- `¬φ` (negation), `φ & ψ` (conjunction)
- `φ | ψ` (simultaneity)
- `*b` (descent), `a<|φ|>` (elevation)
- `<a?b>φ` (activity)

#### Mapping to Rholang Syntax

| Rho-Calculus | Rholang | Description |
|--------------|---------|-------------|
| `0` | `Nil` | Null process |
| `x(y) . P` | `for (y <- x) { P }` | Input/receive |
| `x<|P|>` | `x!(P)` | Lift/send |
| `*x` | `*x` | Drop/dereference |
| `P | Q` | `P \| Q` | Parallel composition |
| `@P` | `@P` | Quote (process to name) |

---

## F1r3fly Improvement Proposals (FIPS)

The FIPS repository contains design proposals for Rholang language extensions. These are in-scope for the current specification (version 1.4).

| Property | Value |
|----------|-------|
| Repository | `FIPS` |
| Local Path | `/Users/jeff/src/CurrentProjects/FF/FIPS` |
| Branch | `main` |

### FIPS-Agents (2025-08-20)

| Property | Value |
|----------|-------|
| File | `Agents.md` |
| Path | `approved/2025-08-20-Agents/Agents.md` |
| Author | Michael Stay |
| Status | Approved |

Defines syntactic sugar for OOP-style agents (concurrent objects):

**Agent Declaration Syntax**:
```
agent fooCtor {
  constructor(<fooPtrns>) { Pc } |
  method fooMethod1(<ptrns1>) { P1 } |
  ... |
  method fooMethodn(<ptrnsn>) { Pn } |
  default(...@args) { Q }
}
```

**Desugaring**: Agents desugar to contracts with:
- Persistent listener on constructor channel
- Fresh `this` channel for instance
- Method dispatch via pattern matching on method name
- Bundle-protected `this` reference returned to caller

**Method Call Syntax**:
```
for(barInstance <- barCtor!?(...barArgs)) {
  barInstance!update(...updateArgs);
  for(response <- barInstance!compute(...computeArgs)) { ... }
}
```

**Key Features**:
- `this` channel available in all method bodies
- `return` channel available in method bodies
- Constructor initializes state, methods operate on it
- Long-term goal: replace `contract` keyword with `agent`

### FIPS-Reifying-RSpaces (2025-09-26)

| Property | Value |
|----------|-------|
| File | `Reifying RSpaces.md` |
| Path | `approved/2025-09-26-Reifying-RSpaces/Reifying RSpaces.md` |
| Authors | Michael Stay, L. Gregory Meredith |
| Status | Approved |

Generalizes RSpace to support multiple storage strategies.

**Space Agent API**:
```
agent Space {
  constructor(qualifier, theory, ...) { ... }
  method gensym() { ... }
  method produce(channel, process) { ... }
  method consume(listMatcherChannel, arrowType, body) { ... }
}
```

**Channel Qualifiers**:
| Qualifier | Persistence | Concurrency | Restrictions |
|-----------|-------------|-------------|--------------|
| `default` | Persistent | Concurrent | None |
| `temp` | Non-persistent | Concurrent | Data not written to disk |
| `seq` | Non-persistent | Sequential | Cannot be sent, no concurrent use |

**Outer Storage Structures**:
| Structure | Description |
|-----------|-------------|
| HashMap | Current implementation (channel -> row) |
| PathMap | Hierarchical paths with prefix matching (for MeTTa) |
| Array | Fixed length with out-of-names error or cyclic reuse |
| Vector | Unbounded length, grows on demand |
| HashSet | For sequential processes (set membership) |

**Inner Collection Types**:
| Collection | Semantics |
|------------|-----------|
| Bags | Multiset (current implementation) |
| Sets | Idempotent (at most one copy) |
| Cells | At most one datum/continuation |
| Queues | FIFO ordering |
| Stacks | LIFO ordering |
| Priority Queues | Ordered by priority |
| Vector DB | Similarity-distance matching |

**The `use` Block**:
```
use space_1 {
  new x_1 : space_j, x_2 : space_j in {
    // channels created in specified spaces
  }
}
```

**Space URN Namespace**: `rho:space:*`
- `rho:space:HashMapBagSpace` - Default HashMap + Bag
- `rho:space:PathMapSpace` - PathMap for MeTTa

### FIPS-Versioned-Registry (2025-09-16)

| Property | Value |
|----------|-------|
| File | `Versioned Registry.md` |
| Path | `approved/2025-09-16-Versioned-Registry/Versioned Registry.md` |
| Author | Michael Stay |
| Status | Approved |

Extends the registry with semantic versioning for libraries and services.

**Namespace Structure**:
```
rho:lib:<lib version>:<public key>:<project id>:<project version>
rho:serve:<serve version>:<public key>:<project id>:<project version>
```

**Namespaces**:
| Namespace | Purpose | Constraints |
|-----------|---------|-------------|
| `rho:lib` | Stateless code libraries | Only temp names; no persistence |
| `rho:serve` | Versioned services | Maintains internal state |

**Version Wildcards**:
- `2.6.3` - Exact version
- `2.6.*` - Latest patch of 2.6
- `2.*` - Latest minor of 2
- `*` - Latest major (requires reflection for API discovery)

**Import Syntax**:
```
new getTC(`rho:lib:1.*:0x60605a...:tempConvert:2.3.*`),
    notify in {
  for (tempConvert <- getTC!?(*notify)) {
    for (f2c, c2f <- tempConvert) { ... }
  }
}
```

**New Registry API Methods**:
- `insertVersion(ret, namespace, deployerId, projectId, version, code)` - Register versioned code
- `deprecateVersion(ret, namespace, deployerId, projectId, version)` - Mark version deprecated
- `approveVersion(ret, namespace, deployerId, projectId, version)` - Remove deprecation flag

---

## Related Documents

- [Rholang Version Differences](./rholang-version-diff.md) - Change inventory
- [Rholang Language Specification](./rholang-language-spec.md) - Spec outline
- [Documentation Update Plan](./doc-update-plan.md) - Update roadmap

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | 2025-12-11 | Initial artifact collection from TASK-103 |
| 0.2 | 2025-12-11 | Added Meredith-Radestock reference from TASK-103a |
| 0.3 | 2025-12-11 | Added FIPS references (Agents, Reifying RSpaces, Versioned Registry) from TASK-106 |
