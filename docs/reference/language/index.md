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
2. **Channels**: Communication endpoints for processes
3. **Names**: References to channels and data
4. **Pattern Matching**: Powerful data destructuring
5. **Concurrency**: Parallel execution by default

## Language Features

### Syntax Overview

```rholang
// Creating new channels
new channelName in { 
  // process body
}

// Sending data
channel!(data)

// Receiving data
for (@x <- channel) {
  // process x
}

// Parallel composition
process1 | process2
```

## In This Section

- [Basic Syntax](syntax.md)
- [Data Types](data-types.md)
- [Channels and Processes](channels.md)
- [Pattern Matching](pattern-matching.md)
- [Concurrency Model](concurrency.md)