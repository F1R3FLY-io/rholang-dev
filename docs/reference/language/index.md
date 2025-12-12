---
layout: default
title: Language Guide
parent: Reference
nav_order: 1
has_children: true
permalink: /reference/language/
---

# Rholang Language Guide

Comprehensive guide to Rholang syntax, semantics, and programming patterns.

## Core Concepts

Rholang is built on several fundamental concepts:

1. **Processes**: The basic unit of computation
2. **Names (Channels)**: Communication endpoints for processes
3. **Quote/Unquote**: Convert between processes and names with `@` and `*`
4. **Pattern Matching**: Powerful data destructuring
5. **Concurrency**: Parallel execution by default

## Quick Start

```rholang
// Hello World
new stdout(`rho:io:stdout`) in {
  stdout!("Hello, World!")
}
```

```rholang
// Parallel processes
new channel in {
  channel!("message") |
  for (msg <- channel) {
    stdout!(*msg)
  }
}
```

```rholang
// Contract (persistent handler)
new counter, stdout(`rho:io:stdout`) in {
  contract counter(ret) = {
    ret!("Called!")
  } |
  new r in {
    counter!(*r) | for (x <- r) { stdout!(*x) }
  }
}
```

## In This Section

### Fundamentals

- [Basic Syntax](syntax/) - Language syntax, literals, and operators
- [Data Types](data-types/) - Integers, strings, booleans, collections

### Core Concepts

- [Channels and Processes](channels/) - Names, channels, sending, receiving
- [Pattern Matching](pattern-matching/) - Destructuring and match expressions
- [Concurrency Model](concurrency/) - Parallelism, synchronization, patterns

## Additional Resources

- [Language Specification](/docs/specs/rholang-language-spec/) - Complete formal specification
- [Version Differences](/docs/specs/rholang-version-diff/) - Changes from legacy documentation
- [Tutorials](/tutorials/) - Hands-on learning

## Key Syntax Reference

| Construct | Syntax | Description |
|-----------|--------|-------------|
| Send | `channel!(message)` | Send message on channel |
| Persistent send | `channel!!(message)` | Send message that persists |
| Receive | `for (x <- channel) { ... }` | Receive one message |
| Persistent receive | `for (x <= channel) { ... }` | Handle all messages |
| Peek | `for (x <<- channel) { ... }` | Read without consuming |
| New channel | `new x in { ... }` | Create unforgeable channel |
| Parallel | `P \| Q` | Run P and Q concurrently |
| Contract | `contract name(x) = { ... }` | Persistent handler |
| Match | `match x { p => P }` | Pattern matching |
| Quote | `@process` | Process to name |
| Unquote | `*name` | Name to process |