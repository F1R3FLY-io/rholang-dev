---
layout: page
title: Rholang Version Differences
description: Changes between legacy RChain docs and current F1r3fly interpreter
last_updated: 2025-12-11
status: draft
---

# Rholang Version Differences

This document inventories syntax and semantic changes between the legacy documentation (scraped from rholang.org) and the current Rholang implementation in F1r3fly's `f1r3node` repository.

## Source References

| Source | Location |
|--------|----------|
| BNFC Grammar | `f1r3node/rholang/src/main/bnfc/rholang_mercury.cf` |
| Rust Interpreter | `f1r3node/rholang/src/rust/interpreter/` |
| Scala Interpreter (legacy reference) | `f1r3node/rholang/src/main/scala/coop/rchain/rholang/interpreter/` |

---

## System URNs

### Available in Current Interpreter

The Rust interpreter (`rho_runtime.rs`, `system_processes.rs`) provides these URNs:

#### I/O
| URN | Description | Status |
|-----|-------------|--------|
| `rho:io:stdout` | Print to stdout | documented |
| `rho:io:stdoutAck` | Print with acknowledgment | documented |
| `rho:io:stderr` | Print to stderr | documented |
| `rho:io:stderrAck` | Print to stderr with ack | undocumented |
| `rho:io:stdlog` | Logging output | undocumented |
| `rho:io:grpcTell` | gRPC communication | undocumented |
| `rho:io:devNull` | Discard output | undocumented |

#### Cryptography
| URN | Description | Status |
|-----|-------------|--------|
| `rho:crypto:secp256k1Verify` | ECDSA signature verification | undocumented |
| `rho:crypto:blake2b256Hash` | Blake2b hashing | undocumented |
| `rho:crypto:keccak256Hash` | Keccak hashing | undocumented |
| `rho:crypto:sha256Hash` | SHA-256 hashing | undocumented |
| `rho:crypto:ed25519Verify` | Ed25519 signature verification | undocumented |

#### Registry
| URN | Description | Status |
|-----|-------------|--------|
| `rho:registry:ops` | Registry operations | undocumented |
| `rho:registry:lookup` | Lookup registered values | undocumented |
| `rho:registry:insertArbitrary` | Insert arbitrary values | undocumented |
| `rho:registry:insertSigned:secp256k1` | Insert signed values | undocumented |

#### Blockchain
| URN | Description | Status |
|-----|-------------|--------|
| `rho:block:data` | Block data access | undocumented |
| `rho:casper:invalidBlocks` | Invalid block list | undocumented |
| `rho:rev:address` | REV address operations | undocumented |
| `rho:rchain:deployerId:ops` | Deployer ID operations | undocumented |

#### AI Services (F1r3fly Extension)
| URN | Description | Status |
|-----|-------------|--------|
| `rho:ai:gpt4` | GPT-4 integration | **new** |
| `rho:ai:dalle3` | DALL-E 3 integration | **new** |
| `rho:ai:textToAudio` | Text-to-audio conversion | **new** |

#### Testing
| URN | Description | Status |
|-----|-------------|--------|
| `rho:test:assertAck` | Test assertions | undocumented |
| `rho:test:testSuiteCompleted` | Test suite completion | undocumented |
| `rho:test:deployerId:make` | Create test deployer ID | undocumented |
| `rho:test:crypto:secp256k1Sign` | Test signing | undocumented |
| `rho:test:block:data:set` | Set test block data | undocumented |
| `rho:test:casper:invalidBlocks:set` | Set test invalid blocks | undocumented |

---

## Grammar Constructs

### Core Syntax (from BNFC grammar `rholang_mercury.cf`)

#### Processes (Proc)
| Construct | Syntax | Notes |
|-----------|--------|-------|
| Ground value | `Ground` | Literals: bool, int, string, uri |
| Collection | `Collection` | List, tuple, set, map |
| Variable | `Var` | Process variable |
| Nil | `Nil` | Null process |
| Negation | `~Proc` | Logical negation |
| Conjunction | `Proc /\ Proc` | Logical AND |
| Disjunction | `Proc \/ Proc` | Logical OR |
| Dereference | `*Name` | Evaluate name as process |
| Method call | `Proc.method(args)` | Method invocation |
| Boolean NOT | `not Proc` | Boolean negation |
| Arithmetic | `+`, `-`, `*`, `/`, `%` | Standard operators |
| Comparison | `<`, `<=`, `>`, `>=`, `==`, `!=` | Comparison operators |
| Pattern match test | `matches` | Test if pattern matches |
| Boolean ops | `and`, `or` | Boolean operators |
| Send | `Name!(args)` | Single send |
| Persistent send | `Name!!(args)` | Persistent send |
| Contract | `contract Name(params) = { Proc }` | Contract definition |
| For (receive) | `for (receipts) { Proc }` | Receive from channels |
| Select | `select { branches }` | Choice operator |
| Match | `match Proc { cases }` | Pattern matching |
| Bundle | `bundle+`, `bundle-`, `bundle0`, `bundle` | Capability bundles |
| Let | `let decl in { Proc }` | Local binding |
| If/else | `if (cond) Proc else Proc` | Conditional |
| New | `new names in Proc` | Fresh name generation |
| Synchronous send | `Name!?(args)` | Synchronous send with continuation |
| Parallel | `Proc \| Proc` | Parallel composition |

#### String/Collection Operations
| Operator | Description |
|----------|-------------|
| `++` | String/list concatenation |
| `--` | List difference |
| `%%` | Interpolation |

#### Receive Patterns
| Pattern | Syntax | Description |
|---------|--------|-------------|
| Linear | `x <- chan` | Consume once |
| Repeated | `x <= chan` | Persistent listener |
| Peek | `x <<- chan` | Non-consuming read |

#### Bundles
| Bundle | Read | Write | Description |
|--------|------|-------|-------------|
| `bundle+` | no | yes | Write-only |
| `bundle-` | yes | no | Read-only |
| `bundle0` | no | no | Opaque |
| `bundle` | yes | yes | Read-write |

---

## Behavioral Changes

### Known Differences

1. **Cost Model**: The Rust interpreter uses different cost accounting (see `accounting/costs.rs`). Specific cost values may differ from legacy Scala implementation.

2. **AI URNs**: The `rho:ai:*` URNs are F1r3fly extensions not present in original RChain.

3. **Execution Environment**: Rust interpreter runs on RSpace++ instead of original RSpace.

---

## Tutorial Compatibility

### Verified Compatible
- Basic send/receive patterns
- `rho:io:stdout` and `rho:io:stderr`
- Channel operations
- Pattern matching syntax
- Contract definitions
- Bundle syntax

### Needs Verification
- Cost accounting examples
- Registry operations
- Crypto operations
- Multi-node deployment examples

### Likely Breaking
- References to RChain-specific infrastructure
- REV/phlogiston cost examples (may differ)
- Validator bonding examples (F1r3fly consensus differs)

---

## Gap Analysis: Source Artifacts vs Documentation

This section compares constructs present in the BNFC grammar and Rust interpreter against the current documentation set.

### Grammar Constructs Coverage

| Construct | BNFC Grammar | Documented | Tutorial Coverage | Notes |
|-----------|--------------|------------|-------------------|-------|
| **Basic Processes** |
| `Nil` | PNil | Yes | Yes | Fully covered |
| Ground values | PGround | Partial | Yes | Bool, Int, String, Uri covered |
| Collections | PCollect | Partial | Yes | List, Tuple, Set, Map basics covered |
| Variables | PVar, ProcVarWildcard | Partial | Yes | `_` wildcard documented |
| **Operators** |
| Negation (`~`) | PNegation | No | No | **GAP**: Logical negation |
| Conjunction (`/\`) | PConjunction | No | No | **GAP**: Logical AND |
| Disjunction (`\/`) | PDisjunction | No | No | **GAP**: Logical OR |
| Dereference (`*`) | PEval | Yes | Yes | Well covered |
| Method calls | PMethod | Partial | No | **GAP**: Collection methods |
| `not` | PNot | Partial | Yes | Boolean negation |
| Arithmetic | PMult, PDiv, PMod, PAdd, PMinus | Yes | Yes | Standard operators |
| `%%` interpolation | PPercentPercent | No | Partial | **GAP**: String interpolation |
| `++` concat | PPlusPlus | Partial | Yes | List/string concat |
| `--` difference | PMinusMinus | No | No | **GAP**: List difference |
| Comparisons | PLt, PLte, PGt, PGte, PEq, PNeq | Yes | Yes | Well covered |
| `matches` | PMatches | Partial | Partial | Pattern match test |
| `and`, `or` | PAnd, POr | Yes | Yes | Boolean operators |
| **Communication** |
| Send (`!`) | PSend, SendSingle | Yes | Yes | Well covered |
| Persistent send (`!!`) | SendMultiple | Yes | Yes | Covered |
| Sync send (`!?`) | PSendSynch | Partial | No | **GAP**: Needs examples |
| Receive (`for`) | PInput | Yes | Yes | Well covered |
| Linear bind (`<-`) | LinearBindImpl | Yes | Yes | Basic receive |
| Repeated bind (`<=`) | RepeatedBindImpl | Yes | Yes | Persistent listener |
| Peek (`<<-`) | PeekBindImpl | Partial | Partial | Non-consuming read |
| Receive-send (`?!`) | ReceiveSendSource | No | No | **GAP**: Ack pattern |
| Send-receive (`!?`) in bind | SendReceiveSource | No | No | **GAP**: Call-response in receive |
| **Control Flow** |
| Contract | PContr | Yes | Yes | Well covered |
| Match | PMatch | Yes | Yes | Pattern matching |
| Select | PChoice | Partial | No | **GAP**: Non-deterministic choice |
| If/else | PIf, PIfElse | Yes | Yes | Conditional |
| **Binding** |
| New | PNew | Yes | Yes | Fresh names |
| Let | PLet | Partial | Partial | Local binding |
| Bundle | PBundle | Yes | Yes | Capability bundles |
| Parallel (`\|`) | PPar | Yes | Yes | Parallel composition |
| **Advanced** |
| VarRef (`=`, `=*`) | PVarRef | No | No | **GAP**: Variable references |
| URN declarations | NameDeclUrn | Partial | Partial | System URNs |
| Remainder patterns | ProcRemainder, NameRemainder | Partial | Partial | `...` patterns |

### System URN Coverage

| URN Category | In Interpreter | Documented | Examples | Gap Level |
|--------------|----------------|------------|----------|-----------|
| I/O (`rho:io:*`) | 7 URNs | 3 URNs | Partial | Medium |
| Crypto (`rho:crypto:*`) | 5 URNs | 0 URNs | None | **High** |
| Registry (`rho:registry:*`) | 4 URNs | 0 URNs | None | **High** |
| Blockchain (`rho:block:*`, `rho:casper:*`, `rho:rev:*`) | 4 URNs | 0 URNs | None | **High** |
| AI (`rho:ai:*`) | 3 URNs | 0 URNs | None | **High** (F1r3fly-specific) |
| Testing (`rho:test:*`) | 6 URNs | 0 URNs | None | Medium |

### Spec Section Requirements

Based on the gap analysis, the following spec sections need additions:

| Spec Section | Current State | Additions Required |
|--------------|---------------|-------------------|
| **3.5 Operators** | Partial | Add `~`, `/\`, `\/`, `--`, `%%` documentation |
| **5.4 Select** | Outline only | Full semantics and examples |
| **5.2 Receive** | Partial | Add `?!`, `!?` bind variants |
| **8. System URNs** | Minimal | Complete URN reference with examples |
| **7. Cost Model** | Outline | Add specific cost values from `costs.rs` |
| **(New) Method Reference** | Missing | Collection methods (`.nth()`, `.length()`, etc.) |
| **(New) VarRef Semantics** | Missing | `=` and `=*` operators |

### Risks and Unknowns

| Area | Risk Level | Description |
|------|------------|-------------|
| Cost model values | Medium | Rust interpreter costs may differ from legacy; need verification |
| `select` semantics | Medium | Non-deterministic choice may have subtle behavioral differences |
| Sync send continuation | Low | `!?` syntax documented but behavioral edge cases unclear |
| Registry URN lifecycle | High | Registration/lookup patterns need interpreter verification |
| AI URN availability | High | Depends on OpenAI API configuration; not always available |
| VarRef behavior | Medium | `=` and `=*` operators undocumented; behavior inferred from grammar |

### Documentation Priority Matrix

| Priority | Items |
|----------|-------|
| **P0** | Crypto URNs, Registry URNs (needed for real contracts) |
| **P1** | `select` statement, sync send/receive, collection methods |
| **P2** | Logical operators (`~`, `/\`, `\/`), string interpolation |
| **P3** | VarRef operators, testing URNs |

---

## Action Items

1. [ ] Validate all tutorial code against Rust interpreter
2. [ ] Document new AI URNs with examples
3. [ ] Update cost accounting documentation
4. [ ] Clarify RChain vs F1r3fly differences
5. [ ] Add feature flag documentation if applicable
6. [ ] Document undocumented operators (`~`, `/\`, `\/`, `--`)
7. [ ] Complete system URN reference (crypto, registry, blockchain)
8. [ ] Add `select` statement documentation with examples
9. [ ] Document sync send/receive patterns (`!?`, `?!`)
10. [ ] Add collection method reference

---

## Rholang Version History (1.0 - 1.4 Roadmap)

This section documents the version evolution of Rholang from its foundational release through planned future versions.

### Version 1.0: Foundation (Legacy/RChain)

The original Rholang implementation based on the Mercury grammar. Core features:

- Rho-calculus primitives (send, receive, parallel, new)
- Pattern matching
- Contract definitions
- Bundle capabilities
- Basic system URNs

**Grammar**: `rholang_mercury.cf`
**Interpreter**: Scala-based (legacy RChain)

### Version 1.1: Syntactic Sugar (Implemented)

Key changes from 1.0:

| Change | Description |
|--------|-------------|
| `;` renamed to `&` | Sequential composition operator renamed to parallel |
| `;` reintroduced | New sequencing operator for sequential execution |
| `!?` (call-response) | Synchronous send with continuation |
| `?!` (receive-ack) | Receive with acknowledgment pattern |

**Rationale**: Clearer distinction between parallel (`\|`), concurrent (`&`), and sequential (`;`) composition.

### Version 1.2: Name Qualifiers (Partially Implemented)

Planned features:

| Feature | Status | Notes |
|---------|--------|-------|
| Name qualifiers | Deferred | Namespace qualification for names |
| MORK internal use | Deferred | Internal representation optimizations |

These features were partially designed but deferred to focus on the Rust interpreter migration.

### Version 1.3: MeTTa IL and Advanced Features (In Progress)

Major architectural changes targeting the MeTTa Intermediate Language:

| Feature | Description | Status |
|---------|-------------|--------|
| Theories | Formal theory framework | In progress |
| Spaces | First-class computation spaces | In progress |
| MORK | Meta-Object Reflection Kit | In progress |
| Type predicates | Runtime type checking | Planned |
| Transactions | Atomic transaction support | Planned |
| Tokenization | Asset tokenization primitives | Planned |

**Target**: Integration with MeTTa for enhanced reasoning and formal verification capabilities.

### Version 1.4: Agents and Reifiable Spaces (Current Spec Target)

Advanced features for agent-based computing and space reification. Detailed designs are in the FIPS repository (see `docs/specs/source-artifacts.md` for full references).

#### Agents (FIPS-2025-08-20)

| Feature | Description | Status |
|---------|-------------|--------|
| `agent` keyword | OOP-style contract declaration | Approved |
| `constructor` block | Instance initialization | Approved |
| `method` declarations | Named method handlers | Approved |
| `default` handler | Catch-all for unknown methods | Approved |
| `this` channel | Instance self-reference | Approved |
| `return` channel | Method return value | Approved |

**Syntax**:
```
agent Stack {
  constructor() { @(*this, *sizeP)!(0) } |
  method push(@value) { ... return!(size + 1) } |
  method pop() { ... return!((true, value)) } |
  default(...@args) { ... }
}
```

**Desugaring**: Agents desugar to contracts with persistent listeners, fresh `this` channels per instance, and method dispatch via pattern matching.

**Long-term Goal**: Replace `contract` keyword with `agent`.

#### Reifiable Spaces (FIPS-2025-09-26)

| Feature | Description | Status |
|---------|-------------|--------|
| Space Agent API | `gensym`, `produce`, `consume` methods | Approved |
| Channel qualifiers | `default`, `temp`, `seq` | Approved |
| Outer storage | HashMap, PathMap, Array, Vector, HashSet | Approved |
| Inner collections | Bags, Sets, Cells, Queues, Stacks, Priority Queues | Approved |
| `use` block | Default space selection | Approved |
| `rho:space:*` URNs | Space factory namespace | Approved |

**Channel Qualifiers**:
| Qualifier | Persistence | Concurrency | Restrictions |
|-----------|-------------|-------------|--------------|
| `default` | Persistent | Concurrent | None |
| `temp` | Non-persistent | Concurrent | Data not written to disk |
| `seq` | Non-persistent | Sequential | Cannot be sent, no concurrent use |

**Space Creation**:
```
new HMB(`rho:space:HashMapBagSpace`),
    PM(`rho:space:PathMapSpace`) in {
  for(space <- HMB!?("default", theory)) {
    use space { new x in { x!(42) } }
  }
}
```

#### Versioned Registry (FIPS-2025-09-16)

| Feature | Description | Status |
|---------|-------------|--------|
| `rho:lib:*` namespace | Stateless versioned libraries | Approved |
| `rho:serve:*` namespace | Stateful versioned services | Approved |
| Version wildcards | `2.6.*`, `2.*`, `*` patterns | Approved |
| `insertVersion` | Register versioned code | Approved |
| `deprecateVersion` | Mark version deprecated | Approved |

**Import Syntax**:
```
new getLib(`rho:lib:1.*:0xpubkey:mylib:2.3.*`), notify in {
  for (lib <- getLib!?(*notify)) { ... }
}
```

**Note**: Version 1.4 features are considered in-scope for the current specification, not future-only. See FIPS repository for full design details.

---

## Version Delta Summary

### Operator Changes (1.0 -> 1.1+)

| Original | New | Purpose |
|----------|-----|---------|
| `;` (parallel) | `&` | Concurrent execution |
| (none) | `;` | Sequential execution |
| (none) | `!?` | Synchronous call-response |
| (none) | `?!` | Receive with acknowledgment |

### New Constructs by Version

| Version | Constructs Added |
|---------|-----------------|
| 1.1 | `&`, `;`, `!?`, `?!` |
| 1.2 | (deferred) |
| 1.3 | Theories, spaces, transactions |
| 1.4 | `agent`, `constructor`, `method`, `default`, `use`, channel qualifiers (`temp`, `seq`), `rho:space:*`, `rho:lib:*`, `rho:serve:*` |

---

## Branch/Commit References

| Version | Branch | Notes |
|---------|--------|-------|
| 1.0 (Mercury) | `main` (historical) | Original BNFC grammar |
| 1.1+ | `rust/dev` | Rust interpreter development |
| Current | `rust/dev` @ `1ba0835e` | Active development |

**Tree-sitter Grammar**: `rholang/src/main/tree_sitter/src/grammar.json`
**Rust Interpreter**: `rholang/src/rust/interpreter/`

---

## Version Notes

- **Grammar version**: `rholang_mercury.cf` (Mercury release)
- **Interpreter**: Rust-based, in `f1r3node`
- **Documentation baseline**: rholang.org tutorials (Joshy Orndorff series)
- **Current development branch**: `rust/dev`
