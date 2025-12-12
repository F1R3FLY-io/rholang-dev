---
layout: page
title: Rholang Language Specification
description: Complete language specification for Rholang (Mercury release)
version: Mercury
status: draft
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

### 2.1 Character Set

Rholang source code is encoded in UTF-8. The grammar distinguishes:

- **Letters**: `a-z`, `A-Z`
- **Digits**: `0-9`
- **Whitespace**: space, tab, newline, carriage return
- **Special characters**: operators, delimiters, quotation marks

### 2.2 Tokens

#### 2.2.1 Integer Literals

```bnfc
token LongLiteral digit+ ;
```

Integers are sequences of one or more decimal digits. Negative integers use the unary `-` operator.

```rholang
0
42
123456789
-1          // Unary negation applied to 1
```

#### 2.2.2 String Literals

```bnfc
token StringLiteral ( '"' ((char - ["\"\\"]) | ('\\' ["\"\\nt"]))* '"' ) ;
```

Strings are enclosed in double quotes with support for escape sequences:

| Escape | Meaning |
|--------|---------|
| `\\` | Backslash |
| `\"` | Double quote |
| `\n` | Newline |
| `\t` | Tab |

```rholang
"Hello, World!"
"Line 1\nLine 2"
"Tab:\there"
"Quote: \"example\""
"Backslash: \\"
```

#### 2.2.3 URI Literals

```bnfc
token UriLiteral ('`' ((char - ["\\`"]) | ('\\' ["`\\"]))* '`') ;
```

URIs are enclosed in backticks with escape sequences for backtick and backslash:

| Escape | Meaning |
|--------|---------|
| `` \` `` | Backtick |
| `\\` | Backslash |

```rholang
`rho:io:stdout`
`rho:crypto:blake2b256Hash`
`rho:registry:lookup`
`file:///path/to/file`
```

System URNs follow the pattern `rho:category:name`. See [Section 8](#8-system-urns) for the complete URN reference.

#### 2.2.4 Boolean Literals

```bnfc
BoolTrue.   BoolLiteral ::= "true" ;
BoolFalse.  BoolLiteral ::= "false" ;
```

```rholang
true
false
```

#### 2.2.5 Variable Identifiers

```bnfc
token Var (((letter | '\'') (letter | digit | '_' | '\'')*)
          |(('_') (letter | digit | '_' | '\'')+)) ;
```

Variables must start with a letter or single quote, followed by letters, digits, underscores, or single quotes. A lone underscore `_` is the wildcard pattern, not a variable.

```rholang
x
myChannel
channel'
_private      // Valid: underscore followed by letters
x_y_z
counter1
```

**Invalid identifiers**:
```rholang
_             // Wildcard, not identifier
1channel      // Cannot start with digit
my-channel    // Hyphen not allowed
```

### 2.3 Comments

```bnfc
comment "//" ;
comment "/*" "*/" ;
```

Two comment styles are supported:

```rholang
// Single-line comment extends to end of line

/* Multi-line comment
   can span multiple lines
   and is closed with */

new x in {
  x!(42)  // Inline comment after code
}
```

Multi-line comments do not nest.

### 2.4 Reserved Words

The following identifiers are reserved and cannot be used as variable names:

**Control flow**:
```
new in for contract select match if else let
```

**Boolean and null values**:
```
true false Nil
```

**Operators**:
```
not and or matches
```

**Bundle keywords**:
```
bundle bundle+ bundle- bundle0
```

**Type names** (used as type predicates):
```
Bool Int String Uri ByteArray
```

**Collection constructor**:
```
Set
```

### 2.5 Operators and Delimiters

#### 2.5.1 Single-Character Operators

```
|  !  @  *  +  -  /  %  <  >  =  ~  .  ,  ;  &  :
```

#### 2.5.2 Multi-Character Operators

```
!!   !?   ?!   <<-  <-   <=   >=   ==   !=
++   --   %%   /\   \/   =>   =*
```

#### 2.5.3 Delimiters

```
( )   // Grouping, tuples, parameters
[ ]   // Lists
{ }   // Blocks, maps
` `   // URI literals
" "   // String literals
```

### 2.6 Whitespace and Line Structure

Whitespace (spaces, tabs, newlines) separates tokens but is otherwise insignificant. Rholang is a free-form language with no significant indentation.

```rholang
// These are equivalent:
new x in { x!(1) | x!(2) }

new x in {
  x!(1) |
  x!(2)
}

new x in {x!(1)|x!(2)}
```

---

## 3. Syntax

The Rholang grammar uses 17 precedence levels (Proc through Proc16) with lower numbers binding looser. This section provides the complete grammar with examples.

### 3.1 Process Precedence Overview

| Level | Constructs | Associativity |
|-------|------------|---------------|
| 0 (Proc) | `P \| Q` | Left |
| 1 (Proc1) | `new`, `!?`, `if`/`else` | Right |
| 2 (Proc2) | `contract`, `for`, `select`, `match`, `bundle`, `let` | - |
| 3 (Proc3) | `!`, `!!` (send) | - |
| 4 (Proc4) | `or` | Left |
| 5 (Proc5) | `and` | Left |
| 6 (Proc6) | `==`, `!=`, `matches` | Left |
| 7 (Proc7) | `<`, `<=`, `>`, `>=` | Left |
| 8 (Proc8) | `+`, `-`, `++`, `--` | Left |
| 9 (Proc9) | `*`, `/`, `%`, `%%` | Left |
| 10 (Proc10) | `not`, unary `-` | Right |
| 11 (Proc11) | `.method()` | Left |
| 12 (Proc12) | `*` (eval) | Right |
| 13 (Proc13) | `=`, `=*` (VarRef), `\/` | Left |
| 14 (Proc14) | `/\` | Left |
| 15 (Proc15) | `~` | Right |
| 16 (Proc16) | Ground, Collection, Var, Nil, `{}` | - |

### 3.2 Processes

Processes are the primary computational units in Rholang. Every Rholang program is a process.

#### 3.2.1 Ground Processes (Proc16)

Ground processes are literal values:

```bnfc
PGround.     Proc16 ::= Ground ;
PNil.        Proc16 ::= "Nil" ;
PVar.        Proc16 ::= ProcVar ;
PCollect.    Proc16 ::= Collection ;
PSimpleType. Proc16 ::= SimpleType ;
```

```rholang
Nil                    // Null process (terminates)
true                   // Boolean literal
false
42                     // Integer literal
"hello"                // String literal
`rho:io:stdout`        // URI literal
```

**Type predicates** (for runtime type checking):
```rholang
Bool                   // Boolean type predicate
Int                    // Integer type predicate
String                 // String type predicate
Uri                    // URI type predicate
ByteArray              // Byte array type predicate
```

#### 3.2.2 Parallel Composition (Proc0)

```bnfc
PPar. Proc ::= Proc "|" Proc1 ;
```

The `|` operator runs processes concurrently:

```rholang
P | Q                  // P and Q execute in parallel
P | Q | R              // All three run concurrently
x!(1) | x!(2) | for (y <- x) { stdout!(*y) }
```

Parallel composition is:
- **Commutative**: `P | Q ≡ Q | P`
- **Associative**: `(P | Q) | R ≡ P | (Q | R)`
- **Identity**: `P | Nil ≡ P`

#### 3.2.3 Send Operations (Proc3)

```bnfc
PSend.      Proc3 ::= Name Send "(" [Proc] ")" ;
SendSingle. Send  ::= "!" ;
SendMultiple. Send ::= "!!" ;
```

**Single send** (`!`): Sends a message and is consumed on first receive.

```rholang
channel!(message)           // Single message
channel!(1, 2, 3)           // Multiple values
stdout!("Hello, World!")    // Print to stdout
```

**Persistent send** (`!!`): Message remains available for multiple receivers.

```rholang
channel!!(value)            // Persistent message
config!!({port: 8080})      // Configuration available to all
```

#### 3.2.4 Synchronous Send (Proc1)

```bnfc
PSendSynch. Proc1 ::= Name "!?" "(" [Proc] ")" SynchSendCont ;
EmptyCont.    SynchSendCont ::= "." ;
NonEmptyCont. SynchSendCont ::= ";" Proc1 ;
```

Synchronous send blocks until response is received:

```rholang
// Request-response pattern
channel!?(request).         // Send and wait, terminate after
channel!?(request); next    // Send and wait, then continue with next
```

Example:
```rholang
new server, client in {
  // Server: receive request, send response
  for (req, ret <- server) {
    ret!(*req ++ " processed")
  } |
  // Client: synchronous call
  server!?("data", *client); stdout!("done")
}
```

#### 3.2.5 Receive Operations (Proc2)

```bnfc
PInput. Proc2 ::= "for" "(" [Receipt] ")" "{" Proc "}" ;
```

**Linear receive** (`<-`): Consumes one message.

```rholang
for (msg <- channel) { process(*msg) }
```

**Persistent receive** (`<=`): Handles all messages (contract-like behavior).

```rholang
for (msg <= channel) { process(*msg) }
```

**Peek** (`<<-`): Reads without consuming.

```rholang
for (msg <<- channel) { inspect(*msg) }
```

**Receive with acknowledgment** (`?!`): Receives and signals completion.

```rholang
for (data <- channel?!) { process(*data) }
```

**Join patterns**: Synchronize on multiple channels.

```rholang
// Sequential (both must have messages)
for (x <- chanA; y <- chanB) { process(*x, *y) }

// Concurrent (all must have messages simultaneously)
for (x <- chanA & y <- chanB) { process(*x, *y) }
```

#### 3.2.6 Contract Definition (Proc2)

```bnfc
PContr. Proc2 ::= "contract" Name "(" [Name] NameRemainder ")" "=" "{" Proc "}" ;
```

Contracts are persistent message handlers (syntactic sugar for persistent receive):

```rholang
contract serviceName(param1, param2) = {
  // Handler body
}

// Equivalent to:
for (param1, param2 <= serviceName) {
  // Handler body
}
```

Example:
```rholang
contract add(x, y, ret) = {
  ret!(*x + *y)
}
```

#### 3.2.7 New Name Binding (Proc1)

```bnfc
PNew. Proc1 ::= "new" [NameDecl] "in" Proc1 ;
NameDeclSimpl. NameDecl ::= Var ;
NameDeclUrn.   NameDecl ::= Var "(" UriLiteral ")" ;
```

Creates fresh, unforgeable names:

```rholang
new x in { P }                    // Single fresh name
new x, y, z in { P }              // Multiple fresh names
new stdout(`rho:io:stdout`) in { P }  // Bind to system URN
```

Example:
```rholang
new counter, get, inc in {
  counter!(0) |
  contract get(ret) = {
    for (n <- counter) { ret!(*n) | counter!(*n) }
  } |
  contract inc(ret) = {
    for (n <- counter) { counter!(*n + 1) | ret!(Nil) }
  }
}
```

#### 3.2.8 Conditional (Proc1)

```bnfc
PIf.     Proc1 ::= "if" "(" Proc ")" Proc2 ;
PIfElse. Proc1 ::= "if" "(" Proc ")" Proc2 "else" Proc1 ;
```

```rholang
if (condition) { thenBranch }
if (condition) { thenBranch } else { elseBranch }
```

Example:
```rholang
if (*x > 0) {
  stdout!("positive")
} else {
  if (*x == 0) {
    stdout!("zero")
  } else {
    stdout!("negative")
  }
}
```

#### 3.2.9 Pattern Match (Proc2)

```bnfc
PMatch. Proc2 ::= "match" Proc4 "{" [Case] "}" ;
CaseImpl. Case ::= Proc "=>" Proc ;
```

```rholang
match expr {
  pattern1 => process1
  pattern2 => process2
  _        => defaultProcess
}
```

Example:
```rholang
match *msg {
  [head, ...tail] => { stdout!(*head) | process!(*tail) }
  []              => { stdout!("empty") }
  _               => { stdout!("not a list") }
}
```

#### 3.2.10 Select (Choice) (Proc2)

```bnfc
PChoice. Proc2 ::= "select" "{" [Branch] "}" ;
BranchImpl. Branch ::= [LinearBind] "=>" Proc3 ;
```

Non-deterministic choice between receive operations:

```rholang
select {
  x <- chanA => processA(*x)
  y <- chanB => processB(*y)
}
```

Only one branch executes (whichever receives first). Example:

```rholang
new timeout, data, result in {
  // Race between data and timeout
  select {
    d <- data    => result!(*d)
    _ <- timeout => result!("timeout")
  }
}
```

#### 3.2.11 Let Binding (Proc2)

```bnfc
PLet. Proc2 ::= "let" Decl Decls "in" "{" Proc "}" ;
DeclImpl. Decl ::= [Name] NameRemainder "=" [Proc] ;
```

Local bindings with pattern matching:

```rholang
let x = 42 in { stdout!(*x) }
let (a, b) = (1, 2) in { stdout!(*a + *b) }
let [h, ...t] = [1, 2, 3] in { stdout!(*h) }
```

Sequential vs concurrent bindings:

```rholang
// Sequential: second binding sees first
let x = 1; y = *x + 1 in { stdout!(*y) }

// Concurrent: bindings computed in parallel
let x = compute1() & y = compute2() in { stdout!(*x, *y) }
```

#### 3.2.12 Bundle (Proc2)

```bnfc
PBundle. Proc2 ::= Bundle "{" Proc "}" ;
BundleWrite.     Bundle ::= "bundle+" ;
BundleRead.      Bundle ::= "bundle-" ;
BundleEquiv.     Bundle ::= "bundle0" ;
BundleReadWrite. Bundle ::= "bundle" ;
```

Bundles restrict channel capabilities:

| Bundle | Read | Write | Description |
|--------|------|-------|-------------|
| `bundle+` | No | Yes | Write-only (output) |
| `bundle-` | Yes | No | Read-only (input) |
| `bundle0` | No | No | Opaque reference |
| `bundle` | Yes | Yes | Full access (default) |

```rholang
new ch in {
  // Export write-only capability
  export!(bundle+ { *ch })
}
```

#### 3.2.13 Dereference (Proc12)

```bnfc
PEval. Proc12 ::= "*" Name ;
```

Evaluates a name as a process (inverse of quote `@`):

```rholang
*x              // Dereference variable x
*@P             // ≡ P (dereference of quote)
```

#### 3.2.14 Method Calls (Proc11)

```bnfc
PMethod. Proc11 ::= Proc11 "." Var "(" [Proc] ")" ;
```

Collection and value methods:

```rholang
list.length()           // List length
list.nth(2)             // Get element at index
map.get("key")          // Map lookup
string.slice(0, 5)      // String slice
```

See [Section 3.5](#35-collection-methods) for complete method reference.

### 3.3 Names

Names are communication endpoints (channels). In Rholang, names and processes are dual via reflection.

```bnfc
NameWildcard. Name ::= "_" ;
NameVar.      Name ::= Var ;
NameQuote.    Name ::= "@" Quotable ;
```

#### 3.3.1 Variable Names

```rholang
x                       // Variable reference
channel                 // Channel variable
```

#### 3.3.2 Wildcard

```rholang
_                       // Matches anything, discards value
```

#### 3.3.3 Quoted Processes (Quote)

The `@` operator converts a process to a name:

```rholang
@P                      // Quote process P as name
@42                     // Quoted integer
@"hello"                // Quoted string
@Nil                    // Quoted Nil
```

Reflection laws:
- `*@P ≡ P` (dereference of quote is identity)
- `@*x ≡ x` (quote of dereference is identity, for simple names)

### 3.4 Collections

#### 3.4.1 Lists

```bnfc
CollectList. Collection ::= "[" [Proc] ProcRemainder "]" ;
```

Ordered, indexable sequences:

```rholang
[]                      // Empty list
[1, 2, 3]               // List literal
[head, ...tail]         // Pattern with remainder
[1, 2, ...rest]         // Partial list pattern
```

List operations:
```rholang
list.length()           // Number of elements
list.nth(0)             // First element
list ++ [4, 5]          // Concatenation
list -- [2]             // Remove element
```

#### 3.4.2 Tuples

```bnfc
TupleSingle.   Tuple ::= "(" Proc ",)" ;
TupleMultiple. Tuple ::= "(" Proc "," [Proc] ")" ;
```

Fixed-size groupings:

```rholang
(a, b)                  // Pair
(x, y, z)               // Triple
(single,)               // Single-element tuple (trailing comma required)
```

#### 3.4.3 Sets

```bnfc
CollectSet. Collection ::= "Set" "(" [Proc] ProcRemainder ")" ;
```

Unordered collections with unique elements:

```rholang
Set()                   // Empty set
Set(1, 2, 3)            // Set literal
Set(1, 2, ...rest)      // Pattern with remainder
```

#### 3.4.4 Maps

```bnfc
CollectMap. Collection ::= "{" [KeyValuePair] ProcRemainder "}" ;
KeyValuePairImpl. KeyValuePair ::= Proc ":" Proc ;
```

Key-value associations:

```rholang
{}                      // Empty map
{key: value}            // Single entry
{"name": "Alice", "age": 30}  // Multiple entries
{k1: v1, ...rest}       // Pattern with remainder
```

Map operations:
```rholang
map.get("key")          // Lookup
map.contains("key")     // Check existence
map.keys()              // Get all keys
map.size()              // Number of entries
```

### 3.5 Collection Methods

Methods are invoked using dot notation on values:

#### 3.5.1 List Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `length()` | `List → Int` | Number of elements |
| `nth(i)` | `List × Int → Proc` | Element at index |
| `slice(start, end)` | `List × Int × Int → List` | Sublist |
| `toByteArray()` | `List → ByteArray` | Convert to bytes |

#### 3.5.2 Map Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `get(key)` | `Map × Proc → Proc` | Lookup value |
| `getOrElse(key, default)` | `Map × Proc × Proc → Proc` | Lookup with default |
| `contains(key)` | `Map × Proc → Bool` | Check key existence |
| `keys()` | `Map → Set` | All keys |
| `size()` | `Map → Int` | Number of entries |

#### 3.5.3 String Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `length()` | `String → Int` | Character count |
| `slice(start, end)` | `String × Int × Int → String` | Substring |
| `hexToBytes()` | `String → ByteArray` | Parse hex string |

#### 3.5.4 Set Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `size()` | `Set → Int` | Number of elements |
| `contains(elem)` | `Set × Proc → Bool` | Check membership |
| `add(elem)` | `Set × Proc → Set` | Add element |
| `delete(elem)` | `Set × Proc → Set` | Remove element |
| `union(other)` | `Set × Set → Set` | Set union |

### 3.6 Operators

#### 3.6.1 Arithmetic Operators

| Operator | Level | Description | Example |
|----------|-------|-------------|---------|
| `*` | 9 | Multiplication | `2 * 3` → `6` |
| `/` | 9 | Integer division | `7 / 2` → `3` |
| `%` | 9 | Modulo | `7 % 3` → `1` |
| `%%` | 9 | String interpolation | `"x=%%" %% [42]` → `"x=42"` |
| `+` | 8 | Addition | `2 + 3` → `5` |
| `-` | 8 | Subtraction | `5 - 2` → `3` |
| `++` | 8 | Concatenation | `[1] ++ [2]` → `[1, 2]` |
| `--` | 8 | Difference | `[1,2,3] -- [2]` → `[1, 3]` |
| `-` (unary) | 10 | Negation | `-5` |

**String interpolation** (`%%`):
```rholang
"Hello, %%!" %% ["World"]     // "Hello, World!"
"x=%%, y=%%" %% [1, 2]        // "x=1, y=2"
```

#### 3.6.2 Comparison Operators

| Operator | Level | Description | Example |
|----------|-------|-------------|---------|
| `<` | 7 | Less than | `1 < 2` → `true` |
| `<=` | 7 | Less or equal | `2 <= 2` → `true` |
| `>` | 7 | Greater than | `3 > 2` → `true` |
| `>=` | 7 | Greater or equal | `2 >= 2` → `true` |
| `==` | 6 | Equality | `1 == 1` → `true` |
| `!=` | 6 | Inequality | `1 != 2` → `true` |
| `matches` | 6 | Pattern test | `[1,2] matches [_, _]` → `true` |

**Pattern match test** (`matches`):
```rholang
[1, 2, 3] matches [head, ...tail]    // true
42 matches Int                        // true
"hello" matches String                // true
```

#### 3.6.3 Boolean Operators

| Operator | Level | Description | Example |
|----------|-------|-------------|---------|
| `or` | 4 | Logical OR | `true or false` → `true` |
| `and` | 5 | Logical AND | `true and false` → `false` |
| `not` | 10 | Logical NOT | `not true` → `false` |

#### 3.6.4 Logical Operators (Process-Level)

These operators work on process-level logic for pattern matching:

| Operator | Level | Description |
|----------|-------|-------------|
| `~` | 15 | Negation |
| `/\` | 14 | Conjunction |
| `\/` | 13 | Disjunction |

```rholang
// In patterns
P /\ Q                  // Match both P and Q
P \/ Q                  // Match P or Q
~P                      // Match if P doesn't match
```

#### 3.6.5 Variable Reference Operators

```bnfc
VarRefKindProc. VarRefKind ::= "=" ;
VarRefKindName. VarRefKind ::= "=*" ;
```

| Operator | Description |
|----------|-------------|
| `=x` | Reference to process variable x |
| `=*x` | Reference to name variable x |

### 3.7 Patterns

Patterns destructure data in receive operations and match expressions.

#### 3.7.1 Simple Patterns

```rholang
x                       // Bind to variable
_                       // Wildcard (discard)
42                      // Match exact integer
"hello"                 // Match exact string
true                    // Match boolean
Nil                     // Match Nil
```

#### 3.7.2 Collection Patterns

```rholang
[a, b, c]               // Match exact 3-element list
[head, ...tail]         // Bind head, collect rest
[x, y, ...rest]         // Partial list pattern
(a, b)                  // Tuple pattern
{key: value}            // Map pattern
{k: v, ...rest}         // Map with remainder
Set(x, y, ...rest)      // Set pattern
```

#### 3.7.3 Name Patterns

```rholang
@x                      // Bind quoted process to x
...@rest                // Name remainder (collect remaining names)
```

#### 3.7.4 Type Patterns

```rholang
Int                     // Match any integer
String                  // Match any string
Bool                    // Match any boolean
Uri                     // Match any URI
ByteArray               // Match any byte array
```

### 3.8 Remainder Patterns

Remainders capture excess elements in collections:

```bnfc
ProcRemainderVar.   ProcRemainder ::= "..." ProcVar ;
ProcRemainderEmpty. ProcRemainder ::= ;
NameRemainderVar.   NameRemainder ::= "..." "@" ProcVar ;
NameRemainderEmpty. NameRemainder ::= ;
```

```rholang
// Process remainder in lists
[a, b, ...rest]         // rest gets remaining elements

// Name remainder in receives
for (x, y, ...@rest <- channel) { ... }

// Contract with variable args
contract service(arg, ...@args) = { ... }
```

---

## 4. Semantics

Rholang semantics are based on the rho-calculus, a reflective higher-order process calculus. Computation proceeds via reduction rules that model communication between concurrent processes.

### 4.1 Reduction Rules

#### 4.1.1 COMM Rule (Communication)

The fundamental computation step in Rholang. When a send and receive are co-located on the same channel, they synchronize:

```
channel!(P) | for (x <- channel) { Q }  →  Q[P/x]
```

The message `P` is substituted for the pattern `x` in the continuation `Q`. After reduction:
- The send is consumed
- The linear receive is consumed
- The continuation `Q` executes with `P` bound to `x`

**Example**:
```rholang
// Before reduction
x!(42) | for (n <- x) { stdout!(*n) }

// After reduction
stdout!(42)
```

#### 4.1.2 COMM with Multiple Values

When sending multiple values:

```
channel!(P₁, P₂, ..., Pₙ) | for (x₁, x₂, ..., xₙ <- channel) { Q }
  →  Q[P₁/x₁, P₂/x₂, ..., Pₙ/xₙ]
```

**Example**:
```rholang
// Before
ch!(1, 2, 3) | for (a, b, c <- ch) { stdout!(*a + *b + *c) }

// After
stdout!(1 + 2 + 3)
```

#### 4.1.3 Persistent Receive

With persistent receive (`<=`), the receiver is not consumed:

```
channel!(P) | for (x <= channel) { Q }  →  Q[P/x] | for (x <= channel) { Q }
```

The receive remains available for future messages.

#### 4.1.4 Persistent Send

With persistent send (`!!`), the message is not consumed:

```
channel!!(P) | for (x <- channel) { Q }  →  Q[P/x] | channel!!(P)
```

The message remains available for future receivers.

#### 4.1.5 Peek (Non-consuming Read)

With peek (`<<-`), neither message nor receiver is consumed:

```
channel!(P) | for (x <<- channel) { Q }  →  Q[P/x] | channel!(P)
```

#### 4.1.6 NEW Rule (Name Creation)

The `new` construct generates fresh, unforgeable names:

```
new x in { P }  →  P[n/x]
```

Where `n` is a globally unique name that cannot be synthesized by any other process. This is the foundation of Rholang's security model.

#### 4.1.7 IF Rule (Conditional)

```
if (true) { P } else { Q }   →  P
if (false) { P } else { Q }  →  Q
```

#### 4.1.8 MATCH Rule (Pattern Matching)

```
match V {
  pattern₁ => P₁
  pattern₂ => P₂
  ...
}
```

Evaluates to `Pᵢ[σ]` where `σ` is the first successful substitution from matching `V` against `patternᵢ`.

### 4.2 Structural Equivalence

Processes may be rearranged without changing their meaning:

#### 4.2.1 Parallel Composition Laws

| Law | Equivalence | Description |
|-----|-------------|-------------|
| Commutativity | `P \| Q ≡ Q \| P` | Order doesn't matter |
| Associativity | `(P \| Q) \| R ≡ P \| (Q \| R)` | Grouping doesn't matter |
| Identity | `P \| Nil ≡ P` | Nil is neutral element |

#### 4.2.2 Scope Laws

| Law | Equivalence | Condition |
|-----|-------------|-----------|
| Scope extrusion | `new x in { P \| Q } ≡ P \| new x in { Q }` | `x` not free in `P` |
| Scope combination | `new x in { new y in { P } } ≡ new y in { new x in { P } }` | Always |

#### 4.2.3 Reflection Laws

| Law | Equivalence | Description |
|-----|-------------|-------------|
| Quote-eval | `*@P ≡ P` | Dereference of quote is identity |
| Eval-quote | `@*x ≡ x` | Quote of dereference is identity (simple names) |

### 4.3 Substitution

Substitution `P[Q/x]` replaces free occurrences of `x` with `Q` in process `P`, with capture-avoiding renaming when necessary.

#### 4.3.1 Substitution Rules

```
Nil[Q/x] = Nil
(P | R)[Q/x] = P[Q/x] | R[Q/x]
channel!(P)[Q/x] = channel[Q/x]!(P[Q/x])
(for (y <- chan) { P })[Q/x] = for (y <- chan[Q/x]) { P[Q/x] }  // y ≠ x
(new y in { P })[Q/x] = new y in { P[Q/x] }  // y ≠ x, y not free in Q
```

#### 4.3.2 Free Names

A name is **free** in a process if it is not bound by `new`, `for`, or `contract`:

```rholang
new x in { x!(y) }    // y is free, x is bound
for (a <- b) { a!(c) }  // b, c are free; a is bound
```

### 4.4 Pattern Matching Semantics

Pattern matching attempts to unify a value with a pattern, producing a substitution on success.

#### 4.4.1 Match Success

| Pattern | Value | Substitution |
|---------|-------|--------------|
| `x` | `V` | `{x ↦ V}` |
| `_` | `V` | `{}` (wildcard, no binding) |
| `42` | `42` | `{}` (literal match) |
| `[h, ...t]` | `[1,2,3]` | `{h ↦ 1, t ↦ [2,3]}` |
| `{k: v}` | `{"a": 1}` | `{k ↦ "a", v ↦ 1}` |

#### 4.4.2 Match Failure

Pattern match fails when:
- Literal mismatch: `42` vs `43`
- Type mismatch: `Int` pattern vs `"string"` value
- Structure mismatch: `[a, b]` vs `[1, 2, 3]`
- Collection size mismatch (without remainder)

#### 4.4.3 Logical Patterns

| Pattern | Matches if |
|---------|------------|
| `P /\ Q` | Both `P` and `Q` match |
| `P \/ Q` | Either `P` or `Q` matches |
| `~P` | `P` does not match |

### 4.5 Join Semantics

Joins synchronize on multiple channels atomically.

#### 4.5.1 Sequential Join (`;`)

```
for (x <- a; y <- b) { P }
```

Waits for message on `a`, then waits for message on `b`, then continues with `P`.

#### 4.5.2 Concurrent Join (`&`)

```
for (x <- a & y <- b) { P }
```

Waits for messages on both `a` and `b` simultaneously. Only fires when both are available atomically (prevents race conditions).

**Example: Resource Allocation**
```rholang
// Only proceeds when both resources available
for (r1 <- resource1 & r2 <- resource2) {
  useResources(*r1, *r2) |
  resource1!(*r1) |
  resource2!(*r2)
}
```

### 4.6 Non-determinism

The `select` construct introduces controlled non-determinism:

```rholang
select {
  x <- chanA => P
  y <- chanB => Q
}
```

Exactly one branch executes:
- If only `chanA` has data: `P` executes
- If only `chanB` has data: `Q` executes
- If both have data: **one is chosen non-deterministically**
- If neither has data: blocks until one does

### 4.7 Evaluation Order

#### 4.7.1 Parallel Processes

Processes separated by `|` have no defined evaluation order. They may execute in any interleaving.

#### 4.7.2 Expression Evaluation

Within expressions, evaluation follows standard precedence (see Section 3.1). Arguments are evaluated before operations.

#### 4.7.3 Send/Receive Synchronization

A send blocks until a matching receive is available (and vice versa), unless using persistent variants.

---

## 5. Concurrency Primitives

Rholang provides first-class concurrency primitives based on the rho-calculus. All communication is asynchronous via named channels.

### 5.1 Parallel Composition

The `|` operator creates concurrent processes:

```rholang
P | Q | R    // All three run in parallel
```

**Properties**:
- No shared mutable state between parallel processes
- Communication only via channels
- Non-deterministic interleaving of execution

**Example: Producer-Consumer**
```rholang
new buffer in {
  // Producer
  buffer!(1) | buffer!(2) | buffer!(3) |

  // Consumer
  for (x <- buffer) { stdout!("Got: " ++ *x.toString()) }
}
```

### 5.2 Channels

Channels are the fundamental communication mechanism. Every name can serve as a channel.

#### 5.2.1 Channel Creation

Fresh channels are created with `new`:

```rholang
new private in {
  // 'private' is a fresh, unforgeable channel
  private!("secret data")
}
```

**Unforgeable Names**: Names created with `new` cannot be guessed or constructed by other processes. This is the basis of Rholang's capability-based security.

#### 5.2.2 Channel Operations

| Operation | Syntax | Behavior |
|-----------|--------|----------|
| Send | `ch!(msg)` | Places message on channel |
| Persistent send | `ch!!(msg)` | Message persists after receipt |
| Receive | `for (x <- ch) { P }` | Removes message, binds to x |
| Persistent receive | `for (x <= ch) { P }` | Handles all messages |
| Peek | `for (x <<- ch) { P }` | Reads without removing |
| Sync send | `ch!?(msg)` | Blocks for response |

### 5.3 Send Operations

#### 5.3.1 Single Send

Sends one message, consumed on first receive:

```rholang
channel!("hello")           // Single value
channel!(1, 2, 3)           // Multiple values (tuple-like)
channel!([1, 2, 3])         // Send a list
```

#### 5.3.2 Persistent Send

Message remains available after being received:

```rholang
config!!({"host": "localhost", "port": 8080})

// Multiple receivers all get the config
for (c <- config) { useConfig(*c) } |
for (c <- config) { logConfig(*c) }
```

#### 5.3.3 Synchronous Send

Blocks until response is received:

```rholang
// Call-response pattern
new ret in {
  service!?("request", *ret);
  for (response <- ret) {
    stdout!("Got: " ++ *response)
  }
}
```

### 5.4 Receive Operations

#### 5.4.1 Linear Receive

Consumes exactly one message:

```rholang
for (msg <- channel) {
  // msg is bound to received value
  process(*msg)
}
// This receive is gone after firing
```

#### 5.4.2 Persistent Receive

Handles all messages (contract behavior):

```rholang
for (msg <= channel) {
  // Fires for every message
  process(*msg)
}
// Receive remains active
```

#### 5.4.3 Peek

Reads without consuming:

```rholang
for (msg <<- channel) {
  inspect(*msg)
}
// Message remains on channel
```

Useful for inspection, logging, or debugging without affecting program behavior.

#### 5.4.4 Receive with Acknowledgment

The `?!` operator acknowledges receipt:

```rholang
for (data <- channel?!) {
  process(*data)
}
```

### 5.5 Join Patterns

Joins synchronize on multiple channels before proceeding.

#### 5.5.1 Sequential Join

Receives from channels in order:

```rholang
for (a <- ch1; b <- ch2; c <- ch3) {
  // a, b, c all bound
  process(*a, *b, *c)
}
```

Blocks on `ch1`, then `ch2`, then `ch3`.

#### 5.5.2 Concurrent Join

Receives from all channels atomically:

```rholang
for (a <- ch1 & b <- ch2 & c <- ch3) {
  // Only fires when ALL channels have messages
  process(*a, *b, *c)
}
```

All messages must be available simultaneously. This prevents race conditions when coordinating multiple resources.

**Example: Dining Philosophers**
```rholang
// Philosopher needs both forks atomically
for (left <- leftFork & right <- rightFork) {
  eat() |
  leftFork!(Nil) | rightFork!(Nil)
}
```

### 5.6 Contracts

Contracts are persistent message handlers:

```rholang
contract serviceName(param1, param2, ...) = {
  body
}
```

Equivalent to:
```rholang
for (param1, param2, ... <= serviceName) {
  body
}
```

#### 5.6.1 Service Pattern

```rholang
contract calculator(op, a, b, ret) = {
  match *op {
    "add" => ret!(*a + *b)
    "sub" => ret!(*a - *b)
    "mul" => ret!(*a * *b)
    "div" => ret!(*a / *b)
    _     => ret!("unknown op")
  }
}
```

#### 5.6.2 Stateful Contracts

Use a separate state channel:

```rholang
new counter, get, inc, state in {
  state!(0) |

  contract get(ret) = {
    for (n <<- state) { ret!(*n) }
  } |

  contract inc(ret) = {
    for (n <- state) {
      state!(*n + 1) |
      ret!(*n + 1)
    }
  }
}
```

### 5.7 Select (Non-deterministic Choice)

The `select` construct chooses between alternatives:

```rholang
select {
  x <- chanA => processA(*x)
  y <- chanB => processB(*y)
  z <- chanC => processC(*z)
}
```

**Semantics**:
- Exactly one branch executes
- First available message wins
- If multiple available, choice is non-deterministic
- If none available, blocks

#### 5.7.1 Timeout Pattern

```rholang
new timeout, result, data in {
  // Timeout after delay
  delay!(100, *timeout) |

  select {
    d <- data    => result!(*d)
    _ <- timeout => result!("timeout")
  }
}
```

#### 5.7.2 Priority Selection

```rholang
// Try high priority first
select {
  h <- highPriority => processHigh(*h)
  m <- mediumPriority => processMedium(*m)
  l <- lowPriority => processLow(*l)
}
```

### 5.8 Synchronization Patterns

#### 5.8.1 Barrier Synchronization

```rholang
new barrier, done in {
  // Three workers must all complete
  worker1!(barrier) | worker2!(barrier) | worker3!(barrier) |

  for (_ <- barrier & _ <- barrier & _ <- barrier) {
    done!("all workers finished")
  }
}
```

#### 5.8.2 Mutex (Mutual Exclusion)

```rholang
new mutex in {
  mutex!(Nil) |  // Initialize with one token

  // Critical section
  for (_ <- mutex) {
    // Protected code here
    criticalSection() |
    mutex!(Nil)  // Release
  }
}
```

#### 5.8.3 Semaphore

```rholang
new semaphore in {
  // Initialize with N permits
  semaphore!(Nil) | semaphore!(Nil) | semaphore!(Nil) |

  // Acquire
  for (_ <- semaphore) {
    // Use resource
    useResource() |
    // Release
    semaphore!(Nil)
  }
}
```

---

## 6. Type System

Rholang uses a combination of runtime type checking and capability-based security through bundles.

### 6.1 Ground Types

Ground types are the primitive values in Rholang:

| Type | Description | Examples |
|------|-------------|----------|
| `Bool` | Boolean values | `true`, `false` |
| `Int` | Arbitrary-precision integers | `0`, `42`, `-17` |
| `String` | Unicode strings | `"hello"`, `""` |
| `Uri` | URI references | `` `rho:io:stdout` `` |
| `ByteArray` | Raw byte sequences | (from conversions) |

### 6.2 Type Predicates

Type names can be used as patterns for runtime type checking:

```rholang
match *value {
  Int    => stdout!("It's an integer")
  String => stdout!("It's a string")
  Bool   => stdout!("It's a boolean")
  Uri    => stdout!("It's a URI")
  _      => stdout!("Unknown type")
}
```

The `matches` operator tests types:

```rholang
42 matches Int           // true
"hello" matches String   // true
true matches Bool        // true
```

### 6.3 Collection Types

Collections are homogeneous or heterogeneous aggregates:

| Type | Description | Example |
|------|-------------|---------|
| List | Ordered sequence | `[1, 2, 3]` |
| Tuple | Fixed-size group | `(a, b)`, `(x,)` |
| Set | Unique elements | `Set(1, 2, 3)` |
| Map | Key-value pairs | `{k: v}` |

Collections can contain any type:
```rholang
[1, "mixed", true]           // Heterogeneous list
{1: "one", "two": 2}         // Mixed key/value types
```

### 6.4 Process and Name Types

In Rholang, processes and names are the core types:

- **Process**: A computation or value
- **Name**: A channel or quoted process

The `@` and `*` operators convert between them:

```rholang
@P      // Process → Name (quote)
*n      // Name → Process (dereference)
```

### 6.5 Bundle Types (Capabilities)

Bundles restrict channel access to implement capability-based security:

| Bundle | Syntax | Read | Write | Description |
|--------|--------|------|-------|-------------|
| Write-only | `bundle+` | No | Yes | Can only send |
| Read-only | `bundle-` | Yes | No | Can only receive |
| Opaque | `bundle0` | No | No | Reference only |
| Full access | `bundle` | Yes | Yes | Both send/receive |

#### 6.5.1 Bundle Syntax

```rholang
bundle+ { @channel }    // Write-only view
bundle- { @channel }    // Read-only view
bundle0 { @channel }    // Opaque reference
bundle { @channel }     // Full access (default)
```

#### 6.5.2 Capability Attenuation

Bundles cannot be "upgraded" - you can only restrict capabilities:

```rholang
new fullAccess in {
  // Export restricted capabilities
  let writeOnly = bundle+ { @fullAccess } in {
  let readOnly = bundle- { @fullAccess } in {
    producer!(writeOnly) |    // Can only write
    consumer!(readOnly)       // Can only read
  }}
}
```

#### 6.5.3 Use Cases

**API Design**:
```rholang
contract createCounter(ret) = {
  new state, getOp, incOp in {
    state!(0) |

    // Get: read-only access to state
    contract getOp(reply) = {
      for (n <<- state) { reply!(*n) }
    } |

    // Inc: needs to modify state
    contract incOp(reply) = {
      for (n <- state) {
        state!(*n + 1) |
        reply!(*n + 1)
      }
    } |

    // Return read-only capabilities
    ret!((bundle- { @getOp }, bundle- { @incOp }))
  }
}
```

**Security Boundaries**:
```rholang
// Internal channel
new internal in {
  // Only expose write capability to external
  export!(bundle+ { @internal }) |

  // Internal can read
  for (msg <- internal) {
    process(*msg)
  }
}
```

### 6.6 Nil Type

`Nil` is the null process with type `Nil`:

```rholang
Nil                   // The null process
x matches Nil         // Test for Nil
```

`Nil` is used for:
- Signaling completion without data
- Empty continuations
- Placeholders

### 6.7 Type Safety

Rholang uses dynamic typing with runtime checks:

```rholang
// Type error at runtime if x is not an integer
*x + 1

// Safe version with type check
if (*x matches Int) {
  stdout!(*x + 1)
} else {
  stderr!("Expected integer")
}
```

#### 6.7.1 Type Errors

Common runtime type errors:

| Operation | Error Condition |
|-----------|-----------------|
| `a + b` | Non-numeric operands |
| `list.nth(i)` | Non-integer index |
| `map.get(k)` | Key not found |
| `P \| Q` | Non-process operands |

#### 6.7.2 Defensive Programming

```rholang
contract safeAdd(a, b, ret) = {
  match (*a, *b) {
    (Int, Int) => ret!(*a + *b)
    _          => ret!(("error", "Expected integers"))
  }
}
```

---

## 7. Cost Model

Rholang tracks execution costs for resource accounting and DoS prevention. The cost model is defined in the interpreter's `accounting/costs.rs` module.

### 7.1 Cost Accounting Overview

Every operation in Rholang consumes "phlogiston" (computational fuel). Execution halts if the cost budget is exhausted.

```rholang
// Each operation consumes cost:
x!(1)           // send_eval cost
for (y <- x) {} // receive_eval cost
1 + 2           // arithmetic cost
```

### 7.2 Operation Costs

#### 7.2.1 Core Operations

| Operation | Cost Name | Description |
|-----------|-----------|-------------|
| Send | `send_eval` | Base cost for sending a message |
| Receive | `receive_eval` | Base cost for setting up receiver |
| New binding | `new_bindings` | Per fresh name created |
| Variable lookup | `var_eval` | Variable reference |

#### 7.2.2 Control Flow

| Operation | Cost Name | Description |
|-----------|-----------|-------------|
| Match | `match_eval` | Pattern match setup |
| Branch | Per case examined | Each case adds cost |
| If/else | Conditional evaluation | Condition + chosen branch |

#### 7.2.3 Expressions

| Operation | Cost Name | Description |
|-----------|-----------|-------------|
| Arithmetic | `add`, `mult`, etc. | Per operation |
| Comparison | `equality_check` | Equality/comparison |
| Boolean | `and`, `or`, `not` | Logical operations |

### 7.3 Collection Costs

Collection operations have size-dependent costs:

| Operation | Cost | Complexity |
|-----------|------|------------|
| `list.length()` | `length_method` | O(1) |
| `list.nth(i)` | `nth_method_call` | O(n) |
| `list ++ list2` | Linear in size | O(n + m) |
| `map.get(k)` | `lookup` | O(log n) |
| `map.keys()` | `keys_method` | O(n) |
| `set.contains(x)` | `lookup` | O(log n) |
| `set.size()` | `size_method` | O(1) |

### 7.4 Method Costs

| Method | Cost | Notes |
|--------|------|-------|
| `.length()` | `length_method` | List/string length |
| `.nth(i)` | `nth_method_call` | Index access |
| `.slice(s, e)` | Proportional to slice | O(e - s) |
| `.get(k)` | `lookup` | Map lookup |
| `.getOrElse(k, d)` | `lookup` | With default |
| `.keys()` | `keys_method` | All keys |
| `.contains(x)` | `lookup` | Membership |

### 7.5 Data Costs

Data size affects cost:

| Data | Cost Factor |
|------|-------------|
| Integers | Constant (small), linear (big) |
| Strings | Linear in length |
| Collections | Linear in element count |
| Nested data | Recursive sum of costs |

### 7.6 Communication Costs

| Pattern | Cost |
|---------|------|
| Single send `!` | `send_eval` |
| Persistent send `!!` | `send_eval` + persistence overhead |
| Linear receive `<-` | `receive_eval` |
| Persistent receive `<=` | `receive_eval` + persistence overhead |
| Peek `<<-` | `receive_eval` |
| Join | Sum of receive costs |

### 7.7 Cost Limits

When deployed on F1r3fly:

```rholang
// Deployment has cost limit
// Execution stops if limit exceeded
```

**Best Practices**:
- Minimize nested loops
- Use efficient data structures
- Avoid unbounded recursion
- Test with cost monitoring

### 7.8 Cost Monitoring

The interpreter tracks:
- Total cost consumed
- Remaining budget
- Per-operation breakdown (debug mode)

*Note: Exact cost values are implementation-specific and may change between versions. See `f1r3node/rholang/src/rust/interpreter/accounting/costs.rs` for current values.*

---

## 8. System URNs

System URNs provide access to built-in functionality. They are bound using URI literals in `new` declarations.

### 8.1 URN Syntax

```rholang
new identifier(`rho:category:name`) in {
  // Use identifier to access the system function
}
```

### 8.2 I/O URNs

For console input/output:

| URN | Description | Signature |
|-----|-------------|-----------|
| `rho:io:stdout` | Print to stdout | `stdout!(message)` |
| `rho:io:stdoutAck` | Print with acknowledgment | `stdoutAck!(message, ackChannel)` |
| `rho:io:stderr` | Print to stderr | `stderr!(message)` |
| `rho:io:stderrAck` | Print to stderr with ack | `stderrAck!(message, ackChannel)` |
| `rho:io:stdlog` | Logging output | `stdlog!(level, message)` |

**Examples**:

```rholang
new stdout(`rho:io:stdout`) in {
  stdout!("Hello, World!")
}
```

```rholang
new stdoutAck(`rho:io:stdoutAck`) in {
  new ack in {
    stdoutAck!("Processing...", *ack) |
    for (_ <- ack) {
      stdout!("Done!")
    }
  }
}
```

### 8.3 Cryptography URNs

For cryptographic operations:

| URN | Description | Signature |
|-----|-------------|-----------|
| `rho:crypto:blake2b256Hash` | Blake2b-256 hash | `hash!(data, resultChannel)` |
| `rho:crypto:sha256Hash` | SHA-256 hash | `hash!(data, resultChannel)` |
| `rho:crypto:keccak256Hash` | Keccak-256 hash | `hash!(data, resultChannel)` |
| `rho:crypto:secp256k1Verify` | ECDSA signature verification | `verify!(data, sig, pubkey, resultChannel)` |
| `rho:crypto:ed25519Verify` | Ed25519 signature verification | `verify!(data, sig, pubkey, resultChannel)` |

**Hashing Example**:

```rholang
new blake2b(`rho:crypto:blake2b256Hash`),
    stdout(`rho:io:stdout`) in {
  new result in {
    blake2b!("data to hash".toByteArray(), *result) |
    for (hash <- result) {
      stdout!("Hash: " ++ *hash.toHexString())
    }
  }
}
```

**Signature Verification Example**:

```rholang
new secp256k1(`rho:crypto:secp256k1Verify`),
    stdout(`rho:io:stdout`) in {
  new result in {
    secp256k1!(data, signature, publicKey, *result) |
    for (valid <- result) {
      if (*valid) {
        stdout!("Signature valid")
      } else {
        stdout!("Signature invalid")
      }
    }
  }
}
```

### 8.4 Registry URNs

For name registration and lookup:

| URN | Description | Signature |
|-----|-------------|-----------|
| `rho:registry:lookup` | Lookup registered name | `lookup!(uri, resultChannel)` |
| `rho:registry:ops` | Registry operations | (advanced) |
| `rho:registry:insertArbitrary` | Insert arbitrary value | `insert!(value, resultChannel)` |
| `rho:registry:insertSigned:secp256k1` | Insert signed value | `insert!(value, sig, resultChannel)` |

**Lookup Example**:

```rholang
new lookup(`rho:registry:lookup`),
    stdout(`rho:io:stdout`) in {
  new result in {
    lookup!(`rho:id:abc123...`, *result) |
    for (value <- result) {
      stdout!("Found: " ++ *value)
    }
  }
}
```

### 8.5 Blockchain URNs

For accessing blockchain state:

| URN | Description |
|-----|-------------|
| `rho:block:data` | Current block information |
| `rho:casper:invalidBlocks` | List of invalid blocks |
| `rho:rev:address` | REV address operations |
| `rho:deployerId:ops` | Deployer identity operations |

**Block Data Example**:

```rholang
new blockData(`rho:block:data`),
    stdout(`rho:io:stdout`) in {
  new result in {
    blockData!(*result) |
    for (data <- result) {
      match *data {
        {blockNumber: n, ...rest} => stdout!("Block: " ++ *n.toString())
        _ => stdout!("Unknown format")
      }
    }
  }
}
```

### 8.6 AI URNs (F1r3fly Extension)

F1r3fly provides AI service integration:

| URN | Description | Signature |
|-----|-------------|-----------|
| `rho:ai:gpt4` | GPT-4 integration | `gpt4!(prompt, resultChannel)` |
| `rho:ai:dalle3` | DALL-E 3 image generation | `dalle3!(prompt, resultChannel)` |
| `rho:ai:textToAudio` | Text-to-audio conversion | `tts!(text, resultChannel)` |

**AI Example**:

```rholang
new gpt4(`rho:ai:gpt4`),
    stdout(`rho:io:stdout`) in {
  new result in {
    gpt4!("Explain Rholang in one sentence", *result) |
    for (response <- result) {
      stdout!(*response)
    }
  }
}
```

*Note: AI URNs require API configuration and may not be available in all deployments.*

### 8.7 Testing URNs

For test contracts:

| URN | Description |
|-----|-------------|
| `rho:test:assertAck` | Test assertions |
| `rho:test:testSuiteCompleted` | Mark test suite complete |
| `rho:test:deployerId:make` | Create test deployer ID |
| `rho:test:crypto:secp256k1Sign` | Test signing |
| `rho:test:block:data:set` | Set test block data |

**Test Example**:

```rholang
new assert(`rho:test:assertAck`),
    completed(`rho:test:testSuiteCompleted`) in {
  new ack in {
    assert!(1 + 1 == 2, "Math works", *ack) |
    for (_ <- ack) {
      completed!(true)
    }
  }
}
```

### 8.8 URN Categories Summary

| Category | Prefix | Purpose |
|----------|--------|---------|
| I/O | `rho:io:` | Console I/O |
| Crypto | `rho:crypto:` | Cryptographic ops |
| Registry | `rho:registry:` | Name registration |
| Block | `rho:block:` | Blockchain state |
| Casper | `rho:casper:` | Consensus data |
| REV | `rho:rev:` | Token operations |
| AI | `rho:ai:` | AI services |
| Test | `rho:test:` | Testing utilities |

### 8.9 Creating Custom URNs

Custom URNs can be registered via the registry:

```rholang
new insertArbitrary(`rho:registry:insertArbitrary`),
    stdout(`rho:io:stdout`) in {

  // Register a contract
  contract myService(request, reply) = {
    reply!("Response to: " ++ *request)
  } |

  new uri in {
    insertArbitrary!(bundle+ { @myService }, *uri) |
    for (registeredUri <- uri) {
      stdout!("Registered at: " ++ *registeredUri)
    }
  }
}
```

---

## 9. Appendix: Grammar Reference

### 9.1 Source Files

| Location | Description |
|----------|-------------|
| `f1r3node/rholang/src/main/bnfc/rholang_mercury.cf` | BNFC grammar (Mercury release) |
| `f1r3node/rholang/src/main/tree_sitter/src/grammar.json` | Tree-sitter grammar |
| `f1r3node/rholang/src/rust/interpreter/` | Rust interpreter |

### 9.2 Process Precedence (Complete)

| Level | Name | Constructs | Associativity |
|-------|------|------------|---------------|
| 0 | Proc | `P \| Q` | Left |
| 1 | Proc1 | `new`, `!?`, `if`/`else` | Right |
| 2 | Proc2 | `contract`, `for`, `select`, `match`, `bundle`, `let` | - |
| 3 | Proc3 | `!`, `!!` (send) | - |
| 4 | Proc4 | `or` | Left |
| 5 | Proc5 | `and` | Left |
| 6 | Proc6 | `==`, `!=`, `matches` | Left |
| 7 | Proc7 | `<`, `<=`, `>`, `>=` | Left |
| 8 | Proc8 | `+`, `-`, `++`, `--` | Left |
| 9 | Proc9 | `*`, `/`, `%`, `%%` | Left |
| 10 | Proc10 | `not`, unary `-` | Right |
| 11 | Proc11 | `.method()` | Left |
| 12 | Proc12 | `*` (dereference) | Right |
| 13 | Proc13 | `=`, `=*`, `\/` | Left |
| 14 | Proc14 | `/\` | Left |
| 15 | Proc15 | `~` | Right |
| 16 | Proc16 | Ground, Collection, Var, Nil, `{}` | - |

### 9.3 Interpreter Source Files

| File | Purpose |
|------|---------|
| `reduce.rs` | Reduction semantics |
| `substitute.rs` | Substitution implementation |
| `matcher/mod.rs` | Pattern matching |
| `accounting/costs.rs` | Cost model |
| `rho_runtime.rs` | Runtime and system processes |
| `system_processes.rs` | URN implementations |

### 9.4 Quick Reference Card

#### Send/Receive

| Syntax | Description |
|--------|-------------|
| `ch!(msg)` | Single send |
| `ch!!(msg)` | Persistent send |
| `ch!?(msg)` | Synchronous send |
| `for (x <- ch) { P }` | Linear receive |
| `for (x <= ch) { P }` | Persistent receive |
| `for (x <<- ch) { P }` | Peek |
| `for (x <- ch?!) { P }` | Receive with ack |

#### Bindings

| Syntax | Description |
|--------|-------------|
| `new x in { P }` | Fresh name |
| `new x(\`urn\`) in { P }` | Bind to URN |
| `let x = v in { P }` | Local binding |
| `contract f(args) = { P }` | Persistent handler |

#### Collections

| Syntax | Type |
|--------|------|
| `[a, b, c]` | List |
| `(a, b)` | Tuple |
| `Set(a, b)` | Set |
| `{k: v}` | Map |
| `[h, ...t]` | List with remainder |

#### Patterns

| Syntax | Matches |
|--------|---------|
| `x` | Any, binds to x |
| `_` | Any, discards |
| `42` | Exact integer |
| `Int` | Any integer |
| `[a, b]` | 2-element list |
| `{k: v}` | Map with key k |

### 9.5 Related Documents

- [Rholang BNFC-Style Grammar](./rholang-bnfc-draft.md) - Complete grammar derivation
- [Rholang Version Differences](./rholang-version-diff.md) - Changes from legacy docs
- [Source Artifacts](./source-artifacts.md) - Reference file inventory

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | 2025-12-11 | Initial outline |
| 0.2 | 2025-12-11 | Complete specification with all sections expanded |
