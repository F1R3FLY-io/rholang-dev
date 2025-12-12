---
layout: default
title: Pattern Matching
parent: Language Guide
grand_parent: Reference
nav_order: 4
permalink: /reference/language/pattern-matching/
---

# Pattern Matching

Pattern matching is a powerful feature in Rholang for destructuring data, filtering messages, and controlling program flow.

## Pattern Syntax

Patterns appear in:
- Receive operations: `for (pattern <- channel) { ... }`
- Match expressions: `match value { pattern => ... }`
- Contract parameters: `contract name(pattern) = { ... }`

## Basic Patterns

### Variable Patterns

Bind any value to a name:

```rholang
for (x <- channel) {
  // x is bound to the received name
  stdout!(*x)
}
```

### Literal Patterns

Match exact values:

```rholang
for (@42 <- channel) {
  stdout!("Received 42")
}

for (@"hello" <- channel) {
  stdout!("Received hello")
}

for (@true <- channel) {
  stdout!("Received true")
}
```

### Wildcard Pattern

Match any value without binding:

```rholang
for (_ <- channel) {
  stdout!("Received something")
}
```

Use `_` when you need to consume a message but don't need its value.

### Nil Pattern

Match only `Nil`:

```rholang
for (@Nil <- channel) {
  stdout!("Received Nil")
}
```

## Process Patterns with `@`

The `@` prefix converts a process pattern into a name pattern:

```rholang
// Match when the sent process equals 42
for (@42 <- channel) { ... }

// Match any integer and bind it
for (@x <- channel) {
  stdout!(x)    // x is a process (the integer)
}
```

**Key distinction**:
- `x` binds a **name**
- `@x` destructures a **process** into variable `x`

```rholang
for (x <- channel) {
  stdout!(*x)   // Must unquote: x is a name
}

for (@x <- channel) {
  stdout!(x)    // No unquote: x is already a process
}
```

## Collection Patterns

### List Patterns

Match and destructure lists:

```rholang
// Match specific list
for (@[1, 2, 3] <- channel) { ... }

// Bind elements
for (@[first, second, third] <- channel) {
  stdout!(first)
}

// Head and tail
for (@[head, ...tail] <- channel) {
  stdout!(head)      // First element
  stdout!(tail)      // Rest of list
}

// Empty list
for (@[] <- channel) {
  stdout!("Empty list")
}
```

### Map Patterns

Match and destructure maps:

```rholang
// Match specific map
for (@{name: "Alice", age: 30} <- channel) { ... }

// Bind values
for (@{name: n, age: a} <- channel) {
  stdout!(n)
  stdout!(a)
}

// Partial match (map may have other keys)
for (@{name: n, ...rest} <- channel) {
  stdout!(n)
  stdout!(rest)   // Remaining key-value pairs
}
```

### Set Patterns

Match sets:

```rholang
for (@Set(1, 2, 3) <- channel) { ... }

for (@Set(x, ...rest) <- channel) {
  stdout!(x)
}
```

### Tuple Patterns

Match multiple values:

```rholang
for (x, y, z <- channel) {
  // Three separate names
}

for (@a, @b, @c <- channel) {
  // Three process bindings
}
```

## The `match` Expression

Pattern match on a value with multiple cases:

```rholang
match value {
  pattern1 => process1
  pattern2 => process2
  _ => defaultProcess
}
```

### Basic Match

```rholang
match x {
  42 => stdout!("The answer")
  0 => stdout!("Zero")
  _ => stdout!("Something else")
}
```

### Type Matching

Use type predicates:

```rholang
match x {
  Int => stdout!("Integer")
  String => stdout!("String")
  Bool => stdout!("Boolean")
  _ => stdout!("Other type")
}
```

### Binding in Match

Bind values while matching:

```rholang
match x {
  [head, ...tail] => {
    stdout!(head)
    // Process tail...
  }
  [] => stdout!("Empty")
}
```

### Nested Patterns

```rholang
match x {
  {user: {name: n, role: "admin"}} => {
    stdout!("Admin: " ++ n)
  }
  {user: {name: n}} => {
    stdout!("User: " ++ n)
  }
  _ => stdout!("Unknown format")
}
```

## Pattern Guards with `matches`

The `matches` operator tests if a value matches a pattern:

```rholang
value matches pattern   // Returns true or false
```

Example:
```rholang
if (x matches [_, _, _]) {
  stdout!("Three-element list")
}
```

## Logical Patterns

### Conjunction (`/\`)

Match when both patterns match:

```rholang
for (@(x /\ y) <- channel) {
  // x and y both bound to the same value
}
```

Useful for aliasing:
```rholang
match data {
  [first, ...rest] /\ all => {
    // first, rest, and all are all bound
    stdout!(first)
    stdout!(all)
  }
}
```

### Disjunction (`\/`)

Match when either pattern matches:

```rholang
match x {
  "yes" \/ "y" \/ "true" => stdout!("Affirmative")
  "no" \/ "n" \/ "false" => stdout!("Negative")
  _ => stdout!("Unknown")
}
```

### Negation (`~`)

Match when pattern does not match:

```rholang
match x {
  ~Nil => stdout!("Not nil")
  _ => stdout!("Is nil")
}
```

## Pattern Matching in Receives

### Filtering Messages

Only receive messages matching a pattern:

```rholang
// Only receive positive integers
for (@n <- numbers if n > 0) {
  stdout!(n)
}

// Alternative: pattern-based filtering
for (@true <- flags) {
  stdout!("Got a true flag")
}
```

### Selective Receive

```rholang
new channel in {
  channel!(1) | channel!(2) | channel!("skip") |

  // Only matches integers
  for (@n <- channel if n matches Int) {
    stdout!(n)
  }
}
```

## Common Patterns

### Option/Maybe Pattern

Handle optional values:

```rholang
match result {
  ("some", value) => stdout!("Got: " ++ value)
  ("none", Nil) => stdout!("No value")
}
```

### Result Pattern

Handle success/error:

```rholang
match result {
  ("ok", data) => processData(data)
  ("error", msg) => handleError(msg)
}
```

### Recursive List Processing

```rholang
contract processAll(list, ret) = {
  match *list {
    [] => ret!(Nil)
    [head, ...tail] => {
      // Process head, then recurse
      stdout!(head) |
      processAll!(tail, *ret)
    }
  }
}
```

## Pattern Matching Semantics

1. **Left to right**: Patterns are tested in order
2. **First match wins**: First matching pattern executes
3. **Exhaustiveness**: Unmatched values cause runtime errors (use `_` as catch-all)
4. **Binding scope**: Variables bound in patterns are scoped to the continuation

## Related Topics

- [Pattern Matching Tutorial](/tutorials/pattern-matching/) - Hands-on examples
- [Data Structures Tutorial](/tutorials/data-structures/) - Collection operations
- [Data Types](data-types/) - Type reference
