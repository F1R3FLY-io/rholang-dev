---
layout: page
title: Legacy Tutorial Mapping
description: Where to find topics from the older monolithic Rholang tutorial
---

# Legacy Tutorial Mapping

Rholang documentation is organized as a set of focused tutorials and reference pages, rather than a single monolithic tutorial file.

This page maps common “legacy tutorial” topics to their current locations in `rholang-dev`, and calls out areas that still need dedicated write-ups.

## Topic Map

| Topic | Where to read next |
|-------|---------------------|
| Getting started | [Beginners Tutorial](/tutorials/) |
| Names, processes, quote/unquote, scope | [Names and Processes](/tutorials/names-and-processes/), [Channels and Processes](/reference/language/channels/) |
| Primitive values and data | [Data Types](/reference/language/data-types/) |
| Expressions and operators | [Basic Syntax](/reference/language/syntax/) |
| Sending and receiving | [Sending](/tutorials/sending/), [Receiving](/tutorials/receiving/) |
| Persistent receives, contracts | [Concurrency Model](/reference/language/concurrency/) |
| Persistent sends | [Channels and Processes](/reference/language/channels/) |
| Pattern matching | [Pattern Matching Tutorial](/tutorials/pattern-matching/), [Pattern Matching](/reference/language/pattern-matching/) |
| Mutable state patterns | [State Channels](/tutorials/state-channels/), [Concurrency Model](/reference/language/concurrency/) |
| Iteration/recursion patterns | [Recursion](/tutorials/recursion/) |
| Normalization and canonical hashing | [Normalization](/reference/language/normalization/) |
| Cryptographic hashes and signature verification | [Crypto URNs](/tutorials/crypto-urns/), [Language Specification](/docs/specs/rholang-language-spec/#83-cryptography-urns) |
| Secure/capability design patterns | [Object Capabilities](/tutorials/object-capabilities/), [Language Specification (Capabilities)](/docs/specs/rholang-language-spec/#65-bundle-types-capabilities) |

## Gaps (To Be Written)

Some legacy tutorial material does not yet have a dedicated, modernized page in `rholang-dev`:

- Coat-check pattern write-up (service patterns over channels)
- A full “Dining Philosophers” example tied to modern [Deadlock/Livelock](/reference/language/concurrency/#deadlock-and-livelock) guidance
- A focused “facets / attenuation / revocation” pattern catalog (beyond the current object-capability tutorial flow)
