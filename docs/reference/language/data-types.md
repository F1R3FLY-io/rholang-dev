---
layout: default
title: Data Types
parent: Language Guide
grand_parent: Reference
nav_order: 2
permalink: /reference/language/data-types/
---

# Data Types

Rholang is a typed language with ground types (primitives) and collection types. This guide covers all data types and their operations.

## Ground Types

Ground types are the primitive values in Rholang.

### Integers

Arbitrary-precision integers:

```rholang
0
42
-17
123456789012345678901234567890
```

**Operations**:

| Operation | Description | Example |
|-----------|-------------|---------|
| `+` | Addition | `1 + 2` → `3` |
| `-` | Subtraction | `5 - 3` → `2` |
| `*` | Multiplication | `4 * 5` → `20` |
| `/` | Integer division | `17 / 5` → `3` |
| `%` | Modulo | `17 % 5` → `2` |
| Unary `-` | Negation | `-42` |

**Comparison**:

```rholang
1 == 1       // true
1 < 2        // true
5 >= 5       // true
```

### Booleans

Logical values `true` and `false`:

```rholang
true
false
```

**Operations**:

| Operation | Description | Example |
|-----------|-------------|---------|
| `and` | Logical AND | `true and false` → `false` |
| `or` | Logical OR | `true or false` → `true` |
| `not` | Logical NOT | `not true` → `false` |

**Short-circuit evaluation**: `and` and `or` evaluate left-to-right and short-circuit when the result is determined.

### Strings

UTF-8 encoded text enclosed in double quotes:

```rholang
"Hello, World!"
"Line 1\nLine 2"
"Tab:\there"
""  // Empty string
```

**Escape sequences**:

| Escape | Character |
|--------|-----------|
| `\\` | Backslash |
| `\"` | Double quote |
| `\n` | Newline |
| `\t` | Tab |

**Operations**:

| Operation | Description | Example |
|-----------|-------------|---------|
| `++` | Concatenation | `"Hello, " ++ "World!"` → `"Hello, World!"` |
| `.length()` | Length | `"hello".length()` → `5` |
| `.slice(start, end)` | Substring | `"hello".slice(1, 4)` → `"ell"` |
| `.hexToBytes()` | Convert hex to bytes | `"deadbeef".hexToBytes()` |

### URIs

Resource identifiers enclosed in backticks:

```rholang
`rho:io:stdout`
`rho:crypto:blake2b256Hash`
`rho:registry:lookup`
`file:///path/to/file`
```

URIs are primarily used to reference system capabilities and external resources. See [System URNs](/docs/specs/rholang-language-spec/#8-system-urns) for the complete reference.

### Byte Arrays

Binary data, typically created via string conversion or cryptographic operations:

```rholang
"deadbeef".hexToBytes()
```

**Operations**:

| Operation | Description |
|-----------|-------------|
| `.toUtf8Bytes()` | String to bytes |
| `.hexToBytes()` | Hex string to bytes |
| `.bytesToHex()` | Bytes to hex string |

## Collection Types

### Lists

Ordered, indexable sequences enclosed in square brackets:

```rholang
[]                    // Empty list
[1, 2, 3]             // Integer list
["a", "b", "c"]       // String list
[1, "mixed", true]    // Mixed types
[[1, 2], [3, 4]]      // Nested lists
```

**Operations**:

| Operation | Description | Example |
|-----------|-------------|---------|
| `++` | Concatenation | `[1, 2] ++ [3, 4]` → `[1, 2, 3, 4]` |
| `--` | Difference | `[1, 2, 3] -- [2]` → `[1, 3]` |
| `.nth(i)` | Index access | `[1, 2, 3].nth(0)` → `1` |
| `.length()` | Length | `[1, 2, 3].length()` → `3` |
| `.slice(s, e)` | Sublist | `[1, 2, 3, 4].slice(1, 3)` → `[2, 3]` |
| `.toSet()` | Convert to set | `[1, 2, 2, 3].toSet()` → `Set(1, 2, 3)` |

### Maps

Key-value collections enclosed in curly braces:

```rholang
{}                        // Empty map
{key: value}              // String key
{"key": value}            // Explicit string key
{@"key": value}           // Name as key
{1: "one", 2: "two"}      // Integer keys
```

**Key syntax**: Bare identifiers become string keys (`{foo: 1}` equals `{"foo": 1}`).

**Operations**:

| Operation | Description | Example |
|-----------|-------------|---------|
| `++` | Merge | `{a: 1} ++ {b: 2}` → `{a: 1, b: 2}` |
| `--` | Remove keys | `{a: 1, b: 2} -- Set("a")` → `{b: 2}` |
| `.get(key)` | Lookup | `{a: 1}.get("a")` → `1` |
| `.getOrElse(k, d)` | Lookup with default | `{a: 1}.getOrElse("b", 0)` → `0` |
| `.set(key, val)` | Update/insert | `{a: 1}.set("b", 2)` |
| `.delete(key)` | Remove key | `{a: 1, b: 2}.delete("a")` |
| `.contains(key)` | Key exists | `{a: 1}.contains("a")` → `true` |
| `.keys()` | Get all keys | `{a: 1, b: 2}.keys()` |
| `.size()` | Number of entries | `{a: 1, b: 2}.size()` → `2` |

### Sets

Unordered collections of unique elements:

```rholang
Set()                 // Empty set
Set(1, 2, 3)          // Integer set
Set("a", "b")         // String set
```

**Operations**:

| Operation | Description | Example |
|-----------|-------------|---------|
| `++` | Union | `Set(1, 2) ++ Set(2, 3)` → `Set(1, 2, 3)` |
| `--` | Difference | `Set(1, 2, 3) -- Set(2)` → `Set(1, 3)` |
| `.contains(e)` | Membership | `Set(1, 2).contains(1)` → `true` |
| `.add(e)` | Add element | `Set(1, 2).add(3)` → `Set(1, 2, 3)` |
| `.delete(e)` | Remove element | `Set(1, 2, 3).delete(2)` |
| `.size()` | Cardinality | `Set(1, 2, 3).size()` → `3` |
| `.toList()` | Convert to list | `Set(1, 2, 3).toList()` |

### Tuples

Fixed-size sequences used in send/receive operations:

```rholang
channel!(a, b, c)                    // Send tuple
for (x, y, z <- channel) { ... }     // Receive tuple
```

Tuples are not a distinct data type—they're syntactic shorthand for multi-value communication.

## Type Predicates

Type predicates check runtime types in patterns:

```rholang
match x {
  Int => "It's an integer"
  String => "It's a string"
  Bool => "It's a boolean"
  Uri => "It's a URI"
  ByteArray => "It's bytes"
  _ => "Something else"
}
```

**Available predicates**:

| Predicate | Matches |
|-----------|---------|
| `Int` | Integers |
| `Bool` | Booleans |
| `String` | Strings |
| `Uri` | URIs |
| `ByteArray` | Byte arrays |

## Nil

`Nil` is the null process—it terminates immediately and produces no value:

```rholang
Nil

for (x <- channel) { Nil }  // Discard received message
```

In patterns, `Nil` matches only itself.

## Type Coercion

Rholang has no implicit type coercion. Operations require compatible types:

```rholang
// Valid
1 + 2
"a" ++ "b"

// Invalid - type mismatch
1 + "2"        // Error
"a" ++ 1       // Error
```

## Related Topics

- [Basic Syntax](syntax/) - Language syntax overview
- [Pattern Matching](pattern-matching/) - Matching on types
- [Collections Methods](/docs/specs/rholang-language-spec/#34-collections) - Complete method reference
