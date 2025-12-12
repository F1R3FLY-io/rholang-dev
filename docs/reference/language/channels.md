---
layout: default
title: Channels and Processes
parent: Language Guide
grand_parent: Reference
nav_order: 3
permalink: /reference/language/channels/
---

# Channels and Processes

Channels and processes are the two fundamental concepts in Rholang. Understanding the relationship between them is essential for writing Rholang programs.

## Names and Processes

In Rholang there are two kinds of entities:

- **Processes**: Computational units—code that does something
- **Names** (Channels): Communication endpoints for sending and receiving messages

### The Quote/Unquote Relationship

Names and processes can be converted between each other:

| Operation | Symbol | Description |
|-----------|--------|-------------|
| Quote | `@` | Turns a process into a name |
| Unquote (Eval) | `*` | Turns a name into a process |

```rholang
// @P quotes process P to create a name
@"Hello"           // Name from string literal
@Nil               // Name from Nil process
@(x!(1) | y!(2))   // Name from compound process

// *N unquotes name N to get a process
*channel           // Process from name
*@"Hello"          // "Hello" (back to process)
```

**Key rule**: `*@P ≡ P` and `@*N ≡ N` (quote and unquote are inverses).

### Send Processes, Receive Names

When communicating:

- You **send processes**
- You **receive names**

```rholang
new channel in {
  // Send a process
  channel!("Hello")
  |
  // Receive a name, then unquote to use as process
  for (msg <- channel) {
    stdout!(*msg)    // *msg converts name back to process
  }
}
```

## Creating Channels

### The `new` Construct

Use `new` to create fresh, unforgeable channels:

```rholang
new x in {
  // x is a fresh channel, only accessible in this scope
}

new x, y, z in {
  // Multiple channels
}
```

Channels created with `new` are **unforgeable**—they cannot be guessed or constructed from outside the scope where they're created.

### System URN Bindings

Bind channels to system capabilities:

```rholang
new stdout(`rho:io:stdout`) in {
  stdout!("Hello, World!")
}

new lookup(`rho:registry:lookup`) in {
  lookup!(uri, *resultChannel)
}
```

## Sending Messages

### Single Send (`!`)

Sends a message that is consumed by one receiver:

```rholang
channel!(message)
channel!(1, 2, 3)          // Multiple values (tuple)
channel!({"key": "value"}) // Send a map
```

The send completes immediately—the message waits in the tuplespace until a receiver consumes it.

### Persistent Send (`!!`)

Sends a message that remains available for multiple receivers:

```rholang
channel!!(config)          // All receivers can access
```

Useful for:
- Configuration values
- Shared constants
- Broadcast patterns

### Synchronous Send (`!?`)

Sends a message and blocks until a response:

```rholang
// Send and terminate after response
channel!?(request).

// Send, receive response, then continue
channel!?(request); nextProcess
```

Example request-response:
```rholang
new server, client, stdout(`rho:io:stdout`) in {
  // Server handles requests
  contract server(request, reply) = {
    reply!("Response to: " ++ *request)
  }
  |
  // Client makes synchronous call
  new response in {
    server!("query", *response) |
    for (r <- response) {
      stdout!(*r)
    }
  }
}
```

## Receiving Messages

### Linear Receive (`<-`)

Receives one message and removes it from the channel:

```rholang
for (msg <- channel) {
  // Process msg
}
```

After receiving, the `for` block executes once and terminates.

### Persistent Receive (`<=`)

Handles all messages without being consumed:

```rholang
for (msg <= channel) {
  // Handle every message
}
```

Equivalent to a `contract`:
```rholang
contract channel(msg) = {
  // Handle every message
}
```

### Peek (`<<-`)

Reads a message without consuming it:

```rholang
for (msg <<- channel) {
  // Message remains on channel
}
```

Useful for inspection or multiple readers accessing the same value.

### Multiple Values

Receive multiple values (tuple destructuring):

```rholang
for (x, y, z <- channel) {
  // x, y, z are separate names
}
```

## Contracts

Contracts are persistent message handlers—syntactic sugar for persistent receive:

```rholang
contract serviceName(param1, param2) = {
  // Body executes for each message
}

// Equivalent to:
for (param1, param2 <= serviceName) {
  // Body
}
```

### Contract Example

```rholang
new calculator, stdout(`rho:io:stdout`) in {
  contract calculator(op, x, y, ret) = {
    match *op {
      "add" => ret!(*x + *y)
      "sub" => ret!(*x - *y)
      "mul" => ret!(*x * *y)
      "div" => ret!(*x / *y)
    }
  }
  |
  new result in {
    calculator!("add", 5, 3, *result) |
    for (r <- result) {
      stdout!(*r)  // Prints 8
    }
  }
}
```

### Variadic Contracts

Accept any number of arguments:

```rholang
contract service(args...) = {
  // args is a list of all received values
}
```

## Communication Events

A **comm event** occurs when a send and receive meet on the same channel:

```rholang
new x in {
  x!(42)                    // Send
  |
  for (n <- x) { ... }      // Receive
}
// Comm event: 42 flows from send to receive
```

Comm events can happen in any order—a receive can be waiting before a send arrives, or vice versa.

## Join Patterns

### Sequential Join (`;`)

Both channels must have messages; bindings happen sequentially:

```rholang
for (x <- chanA; y <- chanB) {
  // Receives from chanA, then chanB
}
```

### Concurrent Join (`&`)

All channels must have messages simultaneously:

```rholang
for (x <- chanA & y <- chanB) {
  // Atomic: both messages consumed together
}
```

Use concurrent joins for synchronization barriers:

```rholang
new done1, done2 in {
  // Task 1
  { ... | done1!(Nil) } |
  // Task 2
  { ... | done2!(Nil) } |
  // Wait for both
  for (_ <- done1 & _ <- done2) {
    stdout!("Both tasks complete")
  }
}
```

## Channel Scope and Sharing

### Private Channels

Channels from `new` are private to their scope:

```rholang
new private in {
  // Only code here can use private
  private!(secret)
}
// private is not accessible here
```

### Sharing Channels

Pass channels to grant access:

```rholang
new secret, share in {
  // Store secret capability
  secret!(sensitiveData) |

  // Grant access by sharing the channel
  share!(*secret) |

  // Recipient can now access
  for (ch <- share) {
    for (data <- *ch) {
      // Has access to sensitiveData
    }
  }
}
```

## Related Topics

- [Names and Processes Tutorial](/tutorials/names-and-processes/) - Hands-on introduction
- [Pattern Matching](pattern-matching/) - Receive with patterns
- [Concurrency Model](concurrency/) - Parallel execution
- [Object Capabilities Tutorial](/tutorials/object-capabilities/) - Capability patterns
