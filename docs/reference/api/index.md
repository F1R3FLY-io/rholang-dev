---
layout: default
title: API Reference
parent: Reference
nav_order: 2
has_children: true
permalink: /reference/api/
---

# API Reference

Complete reference for Rholang standard library and system APIs.

## Standard Library

### Core Modules

- **rho:io**: Input/output operations
- **rho:lang**: Language primitives
- **rho:collection**: Data structures
- **rho:crypto**: Cryptographic functions
- **rho:registry**: Name registry operations

### Common Imports

```rholang
new stdout(`rho:io:stdout`) in { ... }
new ListOps(`rho:lang:listOps`) in { ... }
new MapOps(`rho:lang:mapOps`) in { ... }
```

## System APIs

### Registry API
Manage and lookup named resources

### Vault API
Secure token management

### Deploy API
Contract deployment utilities

## Categories

- [Standard Library](stdlib.md)
- [System APIs](system-apis.md)
- [Registry Operations](registry.md)
- [Cryptographic Functions](crypto.md)