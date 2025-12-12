---
layout: page
title: Rholang Language Specification
description: Complete language specification for Rholang (Mercury release)
version: Mercury
status: outline
last_updated: 2025-12-11
---

# Rholang Language Specification

This document provides the complete language specification for Rholang, based on the Mercury release grammar (`rholang_mercury.cf`) and the Rust interpreter implementation in `f1r3node`.

## Table of Contents

1. [Introduction](#1-introduction)
2. [Lexical Structure](#2-lexical-structure)
3. [Syntax](#3-syntax)
   - 3.1 [Processes](#31-processes)
   - 3.2 [Names](#32-names)
   - 3.3 [Patterns](#33-patterns)
   - 3.4 [Collections](#34-collections)
   - 3.5 [Operators](#35-operators)
4. [Semantics](#4-semantics)
   - 4.1 [Reduction Rules](#41-reduction-rules)
   - 4.2 [Communication Events](#42-communication-events)
   - 4.3 [Name Binding](#43-name-binding)
5. [Concurrency Primitives](#5-concurrency-primitives)
   - 5.1 [Parallel Composition](#51-parallel-composition)
   - 5.2 [Receive (for)](#52-receive-for)
   - 5.3 [Contracts](#53-contracts)
   - 5.4 [Select (Choice)](#54-select-choice)
6. [Type System](#6-type-system)
7. [Cost Model](#7-cost-model)
8. [System URNs](#8-system-urns)
9. [Appendix: Grammar Reference](#9-appendix-grammar-reference)

---

## 1. Introduction

Rholang is a reflective, higher-order process calculus designed for concurrent and distributed computing. Unlike traditional languages based on lambda calculus, Rholang is built on the rho-calculus, providing native support for:

- **Concurrency**: Parallel composition as a first-class construct
- **Communication**: Message passing via named channels
- **Reflection**: Processes can be quoted as names and names dereferenced as processes
- **Pattern Matching**: Powerful destructuring for data and channel messages

### 1.1 Scope

This specification covers:
- Grammar version: `rholang_mercury.cf` (Mercury release)
- Interpreter: Rust-based implementation in `f1r3node`
- Runtime: RSpace++ execution environment

### 1.2 Compatibility Notes

This specification supersedes legacy public documentation. Key differences from legacy docs are tracked in [rholang-version-diff.md](./rholang-version-diff.md).

---

## 2. Lexical Structure

### 2.1 Tokens

| Token | Pattern | Description |
|-------|---------|-------------|
| `LongLiteral` | `digit+` | Integer literals |
| `StringLiteral` | `"..."` | String with escape sequences (`\n`, `\t`, `\\`, `\"`) |
| `UriLiteral` | `` `...` `` | URI literals with escape sequences |
| `Var` | `letter (letter \| digit \| _ \| ')*` | Variable identifiers |
| `BoolLiteral` | `true \| false` | Boolean literals |

### 2.2 Comments

```rholang
// Single-line comment
/* Multi-line
   comment */
```

### 2.3 Reserved Words

```
new in for contract select match if else let
true false Nil not and or matches
bundle bundle+ bundle- bundle0
Bool Int String Uri ByteArray
Set
```

---

## 3. Syntax

### 3.1 Processes

Processes are the primary computational units in Rholang. The grammar defines process precedence levels (Proc through Proc16).

#### 3.1.1 Ground Processes

```rholang
Nil                    // Null process
true, false            // Boolean values
42                     // Integer
"hello"                // String
`rho:io:stdout`        // URI
```

#### 3.1.2 Process Expressions

```rholang
// Parallel composition
P | Q

// Send (single)
channel!(message)

// Send (persistent)
channel!!(message)

// Synchronous send
channel!?(message)

// Receive (linear)
for (pattern <- channel) { P }

// Receive (persistent)
for (pattern <= channel) { P }

// Peek (non-consuming)
for (pattern <<- channel) { P }

// Contract
contract name(params) = { P }

// New name binding
new x, y, z in { P }

// Conditional
if (condition) { P } else { Q }

// Pattern match
match expr {
  pattern1 => P1
  pattern2 => P2
}

// Select (choice)
select {
  pattern1 <- chan1 => P1
  pattern2 <- chan2 => P2
}

// Let binding
let x <- expr in { P }

// Bundle
bundle+ { P }   // Write-only
bundle- { P }   // Read-only
bundle0 { P }   // Opaque
bundle { P }    // Read-write

// Dereference
*name
```

### 3.2 Names

Names are communication endpoints (channels). Names and processes are dual via reflection.

```rholang
// Variable as name
x

// Wildcard
_

// Quoted process (process → name)
@P

// Dereference (name → process)
*name
```

### 3.3 Patterns

Patterns are used in receive operations and match expressions.

```rholang
// Variable binding
x

// Wildcard (discard)
_

// Literal matching
42
"exact string"

// Structure matching
[head, ...tail]
{key: value, ...rest}
(a, b, c)

// Name remainder
...@rest
```

### 3.4 Collections

```rholang
// List
[1, 2, 3]
[head, ...tail]

// Tuple
(a, b)
(single,)

// Set
Set(1, 2, 3)

// Map
{key1: value1, key2: value2}
```

### 3.5 Operators

#### 3.5.1 Arithmetic

| Operator | Description | Precedence |
|----------|-------------|------------|
| `*` | Multiplication | 9 |
| `/` | Division | 9 |
| `%` | Modulo | 9 |
| `%%` | Interpolation | 9 |
| `+` | Addition | 8 |
| `-` | Subtraction | 8 |
| `++` | Concatenation | 8 |
| `--` | List difference | 8 |

#### 3.5.2 Comparison

| Operator | Description | Precedence |
|----------|-------------|------------|
| `<` | Less than | 7 |
| `<=` | Less or equal | 7 |
| `>` | Greater than | 7 |
| `>=` | Greater or equal | 7 |
| `==` | Equality | 6 |
| `!=` | Inequality | 6 |
| `matches` | Pattern match test | 6 |

#### 3.5.3 Logical

| Operator | Description | Precedence |
|----------|-------------|------------|
| `not` | Boolean negation | 10 |
| `~` | Process negation | 15 |
| `/\` | Conjunction | 14 |
| `\/` | Disjunction | 13 |
| `and` | Boolean AND | 5 |
| `or` | Boolean OR | 4 |

---

## 4. Semantics

### 4.1 Reduction Rules

Rholang computation proceeds by reduction. The primary reduction is the COMM rule.

#### 4.1.1 COMM Rule

When a send and receive are co-located on the same channel:

```
channel!(P) | for (x <- channel) { Q }  →  Q[P/x]
```

The message `P` is substituted for `x` in the continuation `Q`.

#### 4.1.2 Structural Equivalence

Processes are equivalent under:
- Commutativity: `P | Q ≡ Q | P`
- Associativity: `(P | Q) | R ≡ P | (Q | R)`
- Identity: `P | Nil ≡ P`

### 4.2 Communication Events

Communication events occur when sends and receives synchronize:

| Pattern | Type | Behavior |
|---------|------|----------|
| `x <- chan` | Linear | Consumes message once |
| `x <= chan` | Persistent | Handles all messages (contract-like) |
| `x <<- chan` | Peek | Reads without consuming |

### 4.3 Name Binding

The `new` construct creates fresh, unforgeable names:

```rholang
new private in {
  // 'private' is unique and cannot be guessed
  private!("secret")
}
```

---

## 5. Concurrency Primitives

### 5.1 Parallel Composition

The `|` operator runs processes concurrently:

```rholang
P | Q | R    // All three run in parallel
```

### 5.2 Receive (for)

```rholang
// Linear receive (consumes one message)
for (msg <- channel) { process(msg) }

// Persistent receive (handles all messages)
for (msg <= channel) { process(msg) }

// Peek (non-consuming read)
for (msg <<- channel) { process(msg) }

// Join (synchronize on multiple channels)
for (x <- chanA; y <- chanB) { process(x, y) }

// Concurrent join
for (x <- chanA & y <- chanB) { process(x, y) }
```

### 5.3 Contracts

Contracts are persistent receive handlers:

```rholang
contract service(request, response) = {
  // Handle request, send response
  response!(handle(request))
}
```

### 5.4 Select (Choice)

Non-deterministic choice between alternatives:

```rholang
select {
  msg <- chanA => handleA(msg)
  msg <- chanB => handleB(msg)
}
```

---

## 6. Type System

### 6.1 Simple Types

| Type | Description |
|------|-------------|
| `Bool` | Boolean values |
| `Int` | Integer values |
| `String` | String values |
| `Uri` | URI values |
| `ByteArray` | Byte array values |

### 6.2 Bundle Types

Bundles restrict channel capabilities:

| Bundle | Read | Write | Use Case |
|--------|------|-------|----------|
| `bundle+` | No | Yes | Write-only capability |
| `bundle-` | Yes | No | Read-only capability |
| `bundle0` | No | No | Opaque reference |
| `bundle` | Yes | Yes | Full access |

---

## 7. Cost Model

Execution costs are tracked for resource accounting. Costs are defined in the interpreter's `accounting/costs.rs` module.

### 7.1 Operation Costs

| Operation | Cost Factor |
|-----------|-------------|
| `send_eval` | Base send cost |
| `receive_eval` | Base receive cost |
| `new_bindings` | Per-binding cost |
| `match_eval` | Pattern match cost |
| `method_call` | Method invocation |
| `equality_check` | Comparison cost |
| `var_eval` | Variable lookup |

### 7.2 Collection Costs

| Operation | Cost Factor |
|-----------|-------------|
| `length_method` | O(1) |
| `nth_method_call` | O(n) |
| `lookup` | Map lookup |
| `keys_method` | Map keys |
| `size_method` | Collection size |

*Detailed cost values are implementation-specific. See `f1r3node/rholang/src/rust/interpreter/accounting/costs.rs` for current values.*

---

## 8. System URNs

System URNs provide built-in functionality. See [rholang-version-diff.md](./rholang-version-diff.md) for the complete URN inventory.

### 8.1 Core URNs

```rholang
new stdout(`rho:io:stdout`) in { stdout!("Hello") }
new stderr(`rho:io:stderr`) in { stderr!("Error") }
```

### 8.2 Cryptography URNs

```rholang
new hash(`rho:crypto:blake2b256Hash`) in { ... }
new verify(`rho:crypto:secp256k1Verify`) in { ... }
```

### 8.3 Registry URNs

```rholang
new lookup(`rho:registry:lookup`) in { ... }
```

---

## 9. Appendix: Grammar Reference

The complete BNFC grammar is located at:
```
f1r3node/rholang/src/main/bnfc/rholang_mercury.cf
```

### 9.1 Process Precedence

From lowest to highest precedence:

| Level | Constructs |
|-------|------------|
| Proc | `P \| Q` (parallel) |
| Proc1 | `if`, `new`, `!?` sync send |
| Proc2 | `for`, `contract`, `select`, `match`, `bundle`, `let` |
| Proc3 | `!` send |
| Proc4-5 | `or`, `and` |
| Proc6-7 | `==`, `!=`, `matches`, comparisons |
| Proc8-9 | Arithmetic |
| Proc10-15 | Unary operators |
| Proc16 | Ground, collections, variables, `{}` |

### 9.2 Grammar Files

| File | Purpose |
|------|---------|
| `rholang_mercury.cf` | BNFC grammar definition |
| `reduce.rs` | Reduction semantics |
| `substitute.rs` | Substitution implementation |
| `matcher/` | Pattern matching |
| `accounting/costs.rs` | Cost model |

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | 2025-12-11 | Initial outline |
