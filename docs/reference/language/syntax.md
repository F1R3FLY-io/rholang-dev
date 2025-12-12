---
layout: default
title: Basic Syntax
parent: Language Guide
grand_parent: Reference
nav_order: 1
permalink: /reference/language/syntax/
---

# Basic Syntax

This guide covers the fundamental syntax of Rholang, from basic building blocks to program structure.

## Program Structure

Every Rholang program is a **process**. Processes can be composed in parallel, send and receive messages, and create new channels.

```rholang
new channel in {
  // Process body
}
```

## Comments

Rholang supports two comment styles:

```rholang
// Single-line comment

/* Multi-line comment
   spans multiple lines */

new x in {
  x!(42)  // Inline comment
}
```

## Literals

### Integer Literals

Integers are sequences of decimal digits:

```rholang
0
42
123456789
-1          // Unary negation
```

### String Literals

Strings are enclosed in double quotes with escape sequences:

```rholang
"Hello, World!"
"Line 1\nLine 2"     // \n = newline
"Tab:\there"          // \t = tab
"Quote: \"example\""  // \" = double quote
"Backslash: \\"       // \\ = backslash
```

### Boolean Literals

```rholang
true
false
```

### URI Literals

URIs are enclosed in backticks:

```rholang
`rho:io:stdout`
`rho:crypto:blake2b256Hash`
`rho:registry:lookup`
```

## Names and Variables

### Variable Names

Variables start with a letter or single quote, followed by letters, digits, underscores, or single quotes:

```rholang
x
myChannel
channel'
_private      // Underscore followed by letters
counter1
```

A lone underscore `_` is the wildcard pattern, not a variable.

### Reserved Words

The following are reserved and cannot be used as variable names:

```
new in for contract select match if else let
true false Nil
not and or matches
bundle bundle+ bundle- bundle0
Bool Int String Uri ByteArray
Set
```

## Basic Constructs

### Sending Messages

Use `!` to send a message on a channel:

```rholang
channel!(message)
channel!(1, 2, 3)         // Multiple values
stdout!("Hello, World!")  // Print to stdout
```

### Receiving Messages

Use `for` to receive messages:

```rholang
for (msg <- channel) {
  // Process the message
}
```

### Creating New Channels

Use `new` to create fresh, unforgeable channels:

```rholang
new x in {
  x!(42)
}

new x, y, z in {
  // Multiple channels
}

new stdout(`rho:io:stdout`) in {
  stdout!("Bound to system URN")
}
```

### Parallel Composition

Use `|` to run processes concurrently:

```rholang
process1 | process2 | process3
```

All processes separated by `|` execute in parallel—there is no guaranteed order.

### The Nil Process

`Nil` is the empty process that does nothing:

```rholang
Nil

for (x <- channel) { Nil }  // Receive and discard
```

## Operators

### Arithmetic Operators

| Operator | Description |
|----------|-------------|
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `%` | Modulo |

```rholang
1 + 2        // 3
10 - 3       // 7
4 * 5        // 20
15 / 3       // 5
17 % 5       // 2
```

### Comparison Operators

| Operator | Description |
|----------|-------------|
| `==` | Equal |
| `!=` | Not equal |
| `<` | Less than |
| `<=` | Less or equal |
| `>` | Greater than |
| `>=` | Greater or equal |

```rholang
1 == 1       // true
1 != 2       // true
3 < 5        // true
```

### Boolean Operators

| Operator | Description |
|----------|-------------|
| `and` | Logical AND |
| `or` | Logical OR |
| `not` | Logical NOT |

```rholang
true and false   // false
true or false    // true
not true         // false
```

### String Operators

| Operator | Description |
|----------|-------------|
| `++` | String concatenation |

```rholang
"Hello, " ++ "World!"  // "Hello, World!"
```

### Collection Operators

| Operator | Description |
|----------|-------------|
| `++` | List/map concatenation |
| `--` | List/map difference |

```rholang
[1, 2] ++ [3, 4]          // [1, 2, 3, 4]
[1, 2, 3] -- [2]          // [1, 3]
{a: 1} ++ {b: 2}          // {a: 1, b: 2}
```

## Whitespace

Rholang is a free-form language—whitespace separates tokens but is otherwise insignificant:

```rholang
// These are equivalent:
new x in { x!(1) | x!(2) }

new x in {
  x!(1) |
  x!(2)
}

new x in {x!(1)|x!(2)}
```

## Related Topics

- [Data Types](data-types/) - Complete reference for Rholang data types
- [Channels and Processes](channels/) - Detailed channel operations
- [Pattern Matching](pattern-matching/) - Pattern matching syntax
- [Concurrency Model](concurrency/) - Parallel execution details
- [Language Specification](/docs/specs/rholang-language-spec/) - Complete formal specification
