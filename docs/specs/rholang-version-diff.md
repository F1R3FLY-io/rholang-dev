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

## Action Items

1. [ ] Validate all tutorial code against Rust interpreter
2. [ ] Document new AI URNs with examples
3. [ ] Update cost accounting documentation
4. [ ] Clarify RChain vs F1r3fly differences
5. [ ] Add feature flag documentation if applicable

---

## Version Notes

- **Grammar version**: `rholang_mercury.cf` (Mercury release)
- **Interpreter**: Rust-based, in `f1r3node`
- **Documentation baseline**: rholang.org tutorials (Joshy Orndorff series)
