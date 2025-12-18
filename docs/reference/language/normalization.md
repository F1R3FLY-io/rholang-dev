---
layout: default
title: Normalization
parent: Language Guide
grand_parent: Reference
nav_order: 6
permalink: /reference/language/normalization/
---

# Normalization

Normalization converts a Rholang source term into a canonical (stable) internal representation. This is critical for:

- Deterministic hashing and signatures (the same program normalizes to the same bytes)
- State-machine replication (independent nodes agree on what was executed)
- Removing accidental differences caused by variable naming, ordering, or formatting

Normalization is a deterministic transformation. It does **not** make Rholang execution deterministic by itself; see [Non-Determinism](/reference/language/concurrency/#non-determinism).

## Alpha Equivalence (Canonical Variable Names)

Two Rholang terms are **alpha-equivalent** if they differ only by renaming *bound* names/variables.

Example: these are alpha-equivalent:

```rholang
new x in { x!(1) }
```

```rholang
new y in { y!(1) }
```

A normalizer achieves alpha equivalence by rewriting bound variables into a canonical form (commonly described as using De Bruijn-style indexing). The result is that renaming a bound name does not change the normalized form.

### Unforgeable Names and Runtime Allocation

Rholang’s `new` creates unforgeable names. In practice, the **identity** of those names is allocated at runtime, while normalization gives them a stable placeholder identity.

If you require replayable execution across replicas, the host runtime must ensure that `new`-name allocation is repeatable (for example by deterministically seeding its name generator from a committed identifier), or alternatively commit an execution witness that pins the allocation choices.

## Canonical Ordering (Commutativity of `|`)

Parallel composition `P | Q` is commutative and associative, so normalization applies a **canonical sort** so that equivalent programs normalize identically.

Example: these should normalize equivalently:

```rholang
new a, b in { a!(1) | b!(2) }
```

```rholang
new a, b in { b!(2) | a!(1) }
```

Normalization also removes redundant `Nil` terms (`P | Nil ≡ P`).

### Joins (`for` with Multiple Channels)

Join receives (`for` with multiple binds) are also normalized with a canonical ordering of the involved channels, to avoid accidental differences caused by reordering.

**Caveat**: joining multiple times on the same channel can make ordering ambiguous in some implementations. Prefer joins over distinct channels or introduce explicit structure to disambiguate.

## Top-Level Expressions (Evaluation Boundaries)

Some expressions are evaluated each time a process is spawned. As a rule of thumb, “top level” includes expressions that are not inside:

- A pattern position, or
- The body of a binding form (`for`, `match`, `contract`)

When you rely on deterministic execution, keep such expressions pure and avoid depending on evaluation ordering.

## Contracts Are Sugar

`contract` is syntactic sugar for a persistent receive (`<=`). See [Concurrency Model](/reference/language/concurrency/) for the canonical expansion and examples.

## Determinism in Replicated Execution

Rholang includes non-determinism at the language level (notably from concurrency). In replicated settings, a protocol must make replay possible by addressing sources of non-determinism such as:

- Interleavings of parallel processes
- Multiple possible comm events (multiple sends/receives can match)
- Runtime allocation of `new` names

Common approaches include:

- **Deterministic tie-breaking**: define canonical selection rules for comm-event choice and ensure stable ordering in underlying storage/hashing.
- **Committed execution witness**: commit enough trace/witness data to replay the same choices during verification.

When writing contracts intended for replicated execution, avoid relying on racing sends/receives to pick “the winner”. If order matters, use explicit synchronization patterns (see [Concurrency Model](/reference/language/concurrency/)).
