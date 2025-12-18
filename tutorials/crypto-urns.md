---
layout: page
title: Crypto URNs
description: Hashing and signature verification with rho:crypto system processes
---

# Crypto URNs

Rholang exposes cryptographic functionality as **system processes**, referenced by `rho:crypto:*` URNs. You bind a local name to a URN with `new`, then call it by sending the required arguments and a return channel.

For the full list of available crypto URNs and their signatures, see the [Language Specification](/docs/specs/rholang-language-spec/#83-cryptography-urns).

## Hashing

`rho:crypto:*Hash` URNs take `(data, resultChannel)` where `data` is a `ByteArray`.

Example (Blake2b-256):

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

Other supported hash URNs include:

- `rho:crypto:sha256Hash`
- `rho:crypto:keccak256Hash`

## Signature Verification

Signature verification URNs take `(data, sig, pubkey, resultChannel)` and return a `Bool`.

Example (Secp256k1):

```rholang
new secp256k1(`rho:crypto:secp256k1Verify`),
    stdout(`rho:io:stdout`) in {
  new result in {
    secp256k1!(
      "message".toByteArray(),
      "signature-bytes".toByteArray(),
      "pubkey-bytes".toByteArray(),
      *result
    ) |
    for (valid <- result) {
      match *valid {
        true => stdout!("Signature valid")
        false => stdout!("Signature invalid")
      }
    }
  }
}
```

Notes:

- For a real verification, provide the actual signature and public key as `ByteArray` values in the format expected by the URN.
- `rho:crypto:ed25519Verify` is also available for Ed25519 signatures.

