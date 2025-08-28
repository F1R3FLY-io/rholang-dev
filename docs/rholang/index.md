---
layout: page
title: Rholang
description: Introduction to the Rholang programming language
---

# Rholang

Rholang is a reflective, concurrent programming language built on the rho-calculus, designed specifically for blockchain and distributed computing applications. Unlike traditional programming languages based on lambda calculus, Rholang's foundation in process calculus makes it naturally concurrent and well-suited for distributed systems.

## Key Features

- **Concurrent by Design**: Built-in concurrency primitives make parallel programming safe and intuitive
- **Reflective**: Code can inspect and modify itself at runtime
- **Process-oriented**: Based on process calculus rather than lambda calculus
- **Blockchain-native**: Designed specifically for the F1r3fly blockchain platform
- **Type-safe**: Strong type system prevents common programming errors

## Core Concepts

### Names and Processes
In Rholang, computation happens through the interaction of processes that communicate via named channels. This is fundamentally different from traditional function-based programming.

### Channel Communication
Processes communicate by sending and receiving messages on channels, enabling safe concurrent programming without traditional locks or mutexes.

### Pattern Matching
Rholang provides powerful pattern matching capabilities for deconstructing data and controlling program flow.

## Getting Started

To start programming in Rholang, you'll need a development environment. See our [tutorials section](/tutorials/) for step-by-step guides.

## Language Reference

- [Names and Processes](/docs/names-processes/) - Understanding the fundamental building blocks
- [Expressions](/docs/expressions/) - Working with data and computations
- [Sending and Receiving](/docs/send-receive/) - Channel communication patterns
- [Pattern Matching](/docs/pattern-match/) - Deconstructing and matching data
- [Iteration](/docs/iteration/) - Looping and repetitive operations
- [Design Patterns](/docs/design-patterns/) - Common programming patterns in Rholang
- [Cost Accounting](/docs/rholang-cost-accounting/) - Understanding execution costs