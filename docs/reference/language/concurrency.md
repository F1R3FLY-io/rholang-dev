---
layout: default
title: Concurrency Model
parent: Language Guide
grand_parent: Reference
nav_order: 5
permalink: /reference/language/concurrency/
---

# Concurrency Model

Rholang is inherently concurrent—parallelism is a first-class concept, not an afterthought. This guide covers Rholang's concurrency primitives and patterns.

## Parallel Composition

### The `|` Operator

The parallel composition operator `|` runs processes concurrently:

```rholang
P | Q | R
```

All processes separated by `|` execute in parallel with no guaranteed order.

```rholang
new stdout(`rho:io:stdout`) in {
  stdout!("First") |
  stdout!("Second") |
  stdout!("Third")
}
// Output order is non-deterministic
```

### Properties of `|`

| Property | Description |
|----------|-------------|
| Commutative | `P \| Q ≡ Q \| P` |
| Associative | `(P \| Q) \| R ≡ P \| (Q \| R)` |
| Identity | `P \| Nil ≡ P` |

## Communication Events

A **comm event** occurs when a send and receive synchronize on the same channel:

```rholang
new x in {
  x!(42) |              // Send
  for (n <- x) { ... }  // Receive
}
```

The send and receive can appear in any order—Rholang matches them based on channel, not code position.

### Send Before Receive

```rholang
new x in {
  x!(42) |                    // Message waits in tuplespace
  for (n <- x) { stdout!(*n) } // Consumes when ready
}
```

### Receive Before Send

```rholang
new x in {
  for (n <- x) { stdout!(*n) } | // Receive waits for message
  x!(42)                         // Message triggers comm event
}
```

## Synchronization Patterns

### Join Patterns

Synchronize on multiple channels:

```rholang
// Sequential join: receive from A, then B
for (x <- chanA; y <- chanB) {
  process(*x, *y)
}

// Concurrent join: atomic receive from both
for (x <- chanA & y <- chanB) {
  process(*x, *y)
}
```

### Barrier Synchronization

Wait for multiple tasks to complete:

```rholang
new task1Done, task2Done, task3Done in {
  // Task 1
  { doWork1() | task1Done!(Nil) } |

  // Task 2
  { doWork2() | task2Done!(Nil) } |

  // Task 3
  { doWork3() | task3Done!(Nil) } |

  // Wait for all
  for (_ <- task1Done & _ <- task2Done & _ <- task3Done) {
    stdout!("All tasks complete")
  }
}
```

### Mutual Exclusion

Use a token channel for mutual exclusion:

```rholang
new mutex, stdout(`rho:io:stdout`) in {
  mutex!(Nil) |  // Initial token

  // Critical section 1
  for (_ <- mutex) {
    stdout!("Section 1 has lock") |
    mutex!(Nil)  // Release
  } |

  // Critical section 2
  for (_ <- mutex) {
    stdout!("Section 2 has lock") |
    mutex!(Nil)  // Release
  }
}
```

## The Select Construct

Choose between multiple receives—first available wins:

```rholang
select {
  case msg <- channel1 => process1(*msg)
  case msg <- channel2 => process2(*msg)
  case msg <- channel3 => process3(*msg)
}
```

Only one case executes, even if multiple channels have messages.

### Select with Timeout Pattern

```rholang
new timeout in {
  // Set timeout
  { sleep!(1000) | timeout!(Nil) } |

  select {
    case result <- response => handleResult(*result)
    case _ <- timeout => handleTimeout()
  }
}
```

## Persistent Operations

### Persistent Receive (`<=`)

Handle all messages without being consumed:

```rholang
for (msg <= channel) {
  // Executes for every message
  // Receive persists after each execution
}
```

### Persistent Send (`!!`)

Message remains available for multiple receivers:

```rholang
config!!({port: 8080, host: "localhost"})

// Multiple receivers can access
for (c <<- config) { useConfig(*c) } |
for (c <<- config) { logConfig(*c) }
```

### Contracts

Contracts are syntactic sugar for persistent receives:

```rholang
contract serviceName(args) = {
  // Body
}

// Equivalent to:
for (args <= serviceName) {
  // Body
}
```

## Non-Determinism

Rholang execution is non-deterministic in several ways:

### Interleaving

Parallel processes interleave arbitrarily:

```rholang
stdout!("A") | stdout!("B")
// Could print "A" then "B", or "B" then "A"
```

### Multiple Senders

When multiple sends target the same receiver, one is chosen non-deterministically:

```rholang
new x in {
  x!(1) | x!(2) | x!(3) |
  for (n <- x) { stdout!(*n) }
}
// Prints one of: 1, 2, or 3
```

### Multiple Receivers

When multiple receivers target the same send, one is chosen non-deterministically:

```rholang
new x in {
  x!(42) |
  for (n <- x) { stdout!("A: " ++ *n) } |
  for (n <- x) { stdout!("B: " ++ *n) }
}
// One receives 42, the other blocks
```

## State Channels

Manage state using channels as mutable cells:

```rholang
new state in {
  state!(0) |  // Initial state

  // Read (non-consuming)
  for (s <<- state) { stdout!(*s) } |

  // Update (consume and replace)
  for (s <- state) {
    state!(*s + 1)
  }
}
```

### Counter Pattern

```rholang
new counter, get, inc, dec in {
  counter!(0) |

  contract get(ret) = {
    for (n <<- counter) { ret!(*n) }
  } |

  contract inc(ret) = {
    for (n <- counter) {
      counter!(*n + 1) | ret!(Nil)
    }
  } |

  contract dec(ret) = {
    for (n <- counter) {
      counter!(*n - 1) | ret!(Nil)
    }
  }
}
```

## Deadlock and Livelock

### Deadlock

Circular wait causing all processes to block:

```rholang
// DEADLOCK - each waits for the other
new a, b in {
  for (x <- a) { b!(1) } |
  for (y <- b) { a!(2) }
}
```

**Prevention**: Ensure at least one initial message or use timeouts.

### Livelock

Processes run but make no progress:

```rholang
// LIVELOCK - infinite ping-pong
new a, b in {
  a!(Nil) |
  for (_ <= a) { b!(Nil) } |
  for (_ <= b) { a!(Nil) }
}
```

**Prevention**: Include termination conditions.

## Best Practices

### 1. Minimize Shared State

Prefer message passing over shared mutable state:

```rholang
// Good: isolated state per actor
contract actor(msg, state) = {
  // Process msg, compute new state
}

// Avoid: global mutable state
```

### 2. Use Contracts for Services

```rholang
contract logger(level, message) = {
  if (*level == "error") {
    stderr!(*message)
  } else {
    stdout!(*message)
  }
}
```

### 3. Explicit Synchronization

When order matters, use explicit synchronization:

```rholang
new step1Done in {
  { doStep1() | step1Done!(Nil) } |
  for (_ <- step1Done) {
    doStep2()  // Guaranteed after step1
  }
}
```

### 4. Handle Non-Determinism

Don't assume execution order:

```rholang
// Bad: assumes A before B
stdout!("A") | stdout!("B")

// Good: explicit ordering when needed
new done in {
  stdout!("A") | done!(Nil) |
  for (_ <- done) { stdout!("B") }
}
```

## Related Topics

- [Sending Tutorial](/tutorials/sending/) - Message passing basics
- [Receiving Tutorial](/tutorials/receiving/) - Receive patterns
- [Join Tutorial](/tutorials/join/) - Join patterns
- [State Channels Tutorial](/tutorials/state-channels/) - State management
- [Object Capabilities](/tutorials/object-capabilities/) - Capability patterns
- [Normalization](/reference/language/normalization/) - Canonical form for hashing and replay
