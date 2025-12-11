---
layout: page
title: Rholang BNFC-Style Grammar (Draft)
description: Grammar derived from Tree-sitter for documentation purposes
status: draft
last_updated: 2025-12-11
---

# Rholang BNFC-Style Grammar (Draft)

This document presents a BNFC-style grammar derived from the Tree-sitter grammar in `f1r3node`. It serves as documentation until an official BNFC grammar is produced for the Rust interpreter.

## Source Reference

| Property | Value |
|----------|-------|
| Tree-sitter Source | `rholang/src/main/tree_sitter/src/grammar.json` |
| JavaScript Source | `rholang/src/main/tree_sitter/grammar.js` |
| Repository | `f1r3node` |
| Branch | `rust/dev` |
| Commit | `1ba0835e` |

---

## Grammar Overview

### Tokens

```bnfc
-- Integer literals
token LongLiteral digit+ ;

-- String literals (double-quoted with escape sequences)
token StringLiteral ( '"' ((char - ["\"\\"]) | ('\\' ["\"\\nt"]))* '"' ) ;

-- URI literals (backtick-quoted with escape sequences)
token UriLiteral ('`' ((char - ["\\`"]) | ('\\' ["`\\"]))* '`') ;

-- Variable identifiers
token Var (((letter | '\'') (letter | digit | '_' | '\'')*)|(('_') (letter | digit | '_' | '\'')+)) ;

-- Comments
comment "//" ;
comment "/*" "*/" ;
```

---

## Process Grammar

### Precedence Levels

The grammar uses 16 precedence levels (Proc through Proc16), with higher numbers binding tighter.

```bnfc
-- Coercions (highest to lowest precedence)
_. Proc   ::= Proc1 ;
_. Proc1  ::= Proc2 ;
_. Proc2  ::= Proc3 ;
_. Proc3  ::= Proc4 ;
_. Proc4  ::= Proc5 ;
_. Proc5  ::= Proc6 ;
_. Proc6  ::= Proc7 ;
_. Proc7  ::= Proc8 ;
_. Proc8  ::= Proc9 ;
_. Proc9  ::= Proc10 ;
_. Proc10 ::= Proc11 ;
_. Proc11 ::= Proc12 ;
_. Proc12 ::= Proc13 ;
_. Proc13 ::= Proc14 ;
_. Proc14 ::= Proc15 ;
_. Proc15 ::= Proc16 ;
_. Proc16 ::= "{" Proc "}" ;
```

### Process Productions

#### Level 0: Parallel Composition (Lowest Precedence)

```bnfc
PPar.         Proc  ::= Proc "|" Proc1 ;
```

#### Level 1: Control Flow and Synchronous Send

```bnfc
PNew.         Proc1 ::= "new" [NameDecl] "in" Proc1 ;
PSendSynch.   Proc1 ::= Name "!?" "(" [Proc] ")" SynchSendCont ;
PIf.          Proc1 ::= "if" "(" Proc ")" Proc2 ;
PIfElse.      Proc1 ::= "if" "(" Proc ")" Proc2 "else" Proc1 ;
```

#### Level 2: Definitions and Statements

```bnfc
PContr.       Proc2 ::= "contract" Name "(" [Name] NameRemainder ")" "=" "{" Proc "}" ;
PInput.       Proc2 ::= "for" "(" [Receipt] ")" "{" Proc "}" ;
PChoice.      Proc2 ::= "select" "{" [Branch] "}" ;
PMatch.       Proc2 ::= "match" Proc4 "{" [Case] "}" ;
PBundle.      Proc2 ::= Bundle "{" Proc "}" ;
PLet.         Proc2 ::= "let" Decl Decls "in" "{" Proc "}" ;
```

#### Level 3: Send

```bnfc
PSend.        Proc3 ::= Name Send "(" [Proc] ")" ;
```

#### Level 4-5: Boolean Operators

```bnfc
POr.          Proc4 ::= Proc4 "or" Proc5 ;
PAnd.         Proc5 ::= Proc5 "and" Proc6 ;
```

#### Level 6: Equality and Pattern Match Test

```bnfc
PMatches.     Proc6 ::= Proc7 "matches" Proc7 ;
PEq.          Proc6 ::= Proc6 "==" Proc7 ;
PNeq.         Proc6 ::= Proc6 "!=" Proc7 ;
```

#### Level 7: Comparison

```bnfc
PLt.          Proc7 ::= Proc7 "<" Proc8 ;
PLte.         Proc7 ::= Proc7 "<=" Proc8 ;
PGt.          Proc7 ::= Proc7 ">" Proc8 ;
PGte.         Proc7 ::= Proc7 ">=" Proc8 ;
```

#### Level 8: Additive Operators

```bnfc
PAdd.         Proc8 ::= Proc8 "+" Proc9 ;
PMinus.       Proc8 ::= Proc8 "-" Proc9 ;
PPlusPlus.    Proc8 ::= Proc8 "++" Proc9 ;
PMinusMinus.  Proc8 ::= Proc8 "--" Proc9 ;
```

#### Level 9: Multiplicative Operators

```bnfc
PMult.        Proc9 ::= Proc9 "*" Proc10 ;
PDiv.         Proc9 ::= Proc9 "/" Proc10 ;
PMod.         Proc9 ::= Proc9 "%" Proc10 ;
PPercentPercent. Proc9 ::= Proc9 "%%" Proc10 ;
```

#### Level 10: Unary Operators

```bnfc
PNot.         Proc10 ::= "not" Proc10 ;
PNeg.         Proc10 ::= "-" Proc10 ;
```

#### Level 11: Method Calls

```bnfc
PMethod.      Proc11 ::= Proc11 "." Var "(" [Proc] ")" ;
PExprs.       Proc11 ::= "(" Proc4 ")" ;
```

#### Level 12: Dereference and Quote

```bnfc
PEval.        Proc12 ::= "*" Name ;
-- Note: Quote is part of Name, not a separate Proc production
```

#### Level 13: Variable References and Logical Operators

```bnfc
PVarRef.      Proc13 ::= VarRefKind Var ;
PDisjunction. Proc13 ::= Proc13 "\\/" Proc14 ;
```

#### Level 14-15: Logical Operators

```bnfc
PConjunction. Proc14 ::= Proc14 "/\\" Proc15 ;
PNegation.    Proc15 ::= "~" Proc15 ;
```

#### Level 16: Ground Terms

```bnfc
PGround.      Proc16 ::= Ground ;
PCollect.     Proc16 ::= Collection ;
PVar.         Proc16 ::= ProcVar ;
PNil.         Proc16 ::= "Nil" ;
PSimpleType.  Proc16 ::= SimpleType ;
```

---

## Names

```bnfc
NameWildcard. Name ::= "_" ;
NameVar.      Name ::= Var ;
NameQuote.    Name ::= "@" Quotable ;

-- Quotable restricts what can follow @
Quotable ::= VarRef | Eval | Disjunction | Conjunction | Negation | GroundExpression ;
```

**Note**: The Tree-sitter grammar introduces `Quotable` to restrict what can be quoted, which differs slightly from the BNFC grammar where `@` can precede `Proc12`.

---

## Process Variables

```bnfc
ProcVarWildcard. ProcVar ::= "_" ;
ProcVarVar.      ProcVar ::= Var ;
```

---

## Bindings

### Send Types

```bnfc
SendSingle.   Send ::= "!" ;
SendMultiple. Send ::= "!!" ;
```

### Receipt Bindings

```bnfc
-- Linear (consume once)
LinearBindImpl. LinearBind ::= [Name] NameRemainder "<-" NameSource ;

-- Repeated (persistent listener)
RepeatedBindImpl. RepeatedBind ::= [Name] NameRemainder "<=" Name ;

-- Peek (non-consuming read)
PeekBindImpl. PeekBind ::= [Name] NameRemainder "<<-" Name ;
```

### Name Sources

```bnfc
SimpleSource.       NameSource ::= Name ;
ReceiveSendSource.  NameSource ::= Name "?!" ;
SendReceiveSource.  NameSource ::= Name "!?" "(" [Proc] ")" ;
```

### Receipts

```bnfc
ReceiptLinear.    Receipt ::= [LinearBind] ;
ReceiptRepeated.  Receipt ::= [RepeatedBind] ;
ReceiptPeek.      Receipt ::= [PeekBind] ;
separator nonempty Receipt ";" ;
separator nonempty LinearBind "&" ;
separator nonempty RepeatedBind "&" ;
separator nonempty PeekBind "&" ;
```

---

## Declarations

### Let Declarations

```bnfc
DeclImpl.    Decl ::= [Name] NameRemainder "=" [Proc] ;

LinearDeclsImpl. Decls ::= ";" [Decl] ;
ConcDeclsImpl.   Decls ::= "&" [Decl] ;
EmptyDeclImpl.   Decls ::= ;
```

### Name Declarations (for `new`)

```bnfc
NameDeclSimpl. NameDecl ::= Var ;
NameDeclUrn.   NameDecl ::= Var "(" UriLiteral ")" ;
separator nonempty NameDecl "," ;
```

---

## Synchronous Send Continuation

```bnfc
EmptyCont.      SynchSendCont ::= "." ;
NonEmptyCont.   SynchSendCont ::= ";" Proc1 ;
```

---

## Control Flow

### Match Cases

```bnfc
CaseImpl. Case ::= Proc "=>" Proc ;
separator nonempty Case "" ;
```

### Select Branches

```bnfc
BranchImpl. Branch ::= [LinearBind] "=>" Proc3 ;
separator nonempty Branch "" ;
```

---

## Bundles

```bnfc
BundleWrite.     Bundle ::= "bundle+" ;
BundleRead.      Bundle ::= "bundle-" ;
BundleEquiv.     Bundle ::= "bundle0" ;
BundleReadWrite. Bundle ::= "bundle" ;
```

---

## Ground Types

### Literals

```bnfc
BoolTrue.   BoolLiteral ::= "true" ;
BoolFalse.  BoolLiteral ::= "false" ;

GroundBool.    Ground ::= BoolLiteral ;
GroundInt.     Ground ::= LongLiteral ;
GroundString.  Ground ::= StringLiteral ;
GroundUri.     Ground ::= UriLiteral ;
```

### Simple Types (Type Predicates)

```bnfc
SimpleTypeBool.      SimpleType ::= "Bool" ;
SimpleTypeInt.       SimpleType ::= "Int" ;
SimpleTypeString.    SimpleType ::= "String" ;
SimpleTypeUri.       SimpleType ::= "Uri" ;
SimpleTypeByteArray. SimpleType ::= "ByteArray" ;
```

---

## Collections

```bnfc
CollectList.   Collection ::= "[" [Proc] ProcRemainder "]" ;
CollectTuple.  Collection ::= Tuple ;
CollectSet.    Collection ::= "Set" "(" [Proc] ProcRemainder ")" ;
CollectMap.    Collection ::= "{" [KeyValuePair] ProcRemainder "}" ;

TupleSingle.   Tuple ::= "(" Proc ",)" ;
TupleMultiple. Tuple ::= "(" Proc "," [Proc] ")" ;

KeyValuePairImpl. KeyValuePair ::= Proc ":" Proc ;
separator KeyValuePair "," ;
separator Proc "," ;
```

---

## Remainders

```bnfc
ProcRemainderVar.   ProcRemainder ::= "..." ProcVar ;
ProcRemainderEmpty. ProcRemainder ::= ;

NameRemainderVar.   NameRemainder ::= "..." "@" ProcVar ;
NameRemainderEmpty. NameRemainder ::= ;
```

---

## Variable References

```bnfc
VarRefKindProc. VarRefKind ::= "=" ;
VarRefKindName. VarRefKind ::= "=*" ;
```

**Note**: The Tree-sitter grammar uses `=*` while the legacy BNFC uses `= *` (with space). This is a syntactic difference.

---

## Differences from Legacy BNFC Grammar

### Syntactic Differences

| Feature | Legacy BNFC | Tree-sitter | Notes |
|---------|-------------|-------------|-------|
| VarRef operator | `= *` (with space) | `=*` (no space) | Minor tokenization difference |
| Quote restriction | `@` Proc12 | `@` Quotable | Tree-sitter restricts quotable forms |
| Let declaration | `<-` in decl | `=` in decl | Tree-sitter uses `=` for let bindings |
| Case pattern | Proc13 | Proc | Tree-sitter allows full Proc |

### Precedence Mapping

| Tree-sitter Prec | BNFC Level | Operator(s) |
|------------------|------------|-------------|
| 0 | Proc | `\|` (parallel) |
| 1 | Proc1 | `new`, `!?`, `if`/`else` |
| 2 | Proc2 | `contract`, `for`, `select`, `match`, `bundle`, `let` |
| 3 | Proc3 | `!`, `!!` (send) |
| 4 | Proc4 | `or` |
| 5 | Proc5 | `and` |
| 6 | Proc6 | `matches`, `==`, `!=` |
| 7 | Proc7 | `<`, `<=`, `>`, `>=` |
| 8 | Proc8 | `+`, `-`, `++`, `--` |
| 9 | Proc9 | `*`, `/`, `%`, `%%` |
| 10 | Proc10 | `not`, unary `-` |
| 11 | Proc11 | `.method()`, `()` |
| 12 | Proc12 | `*` (eval) |
| 13 | Proc13 | `=`/`=*` (VarRef), `\/` |
| 14 | Proc14 | `/\` |
| 15 | Proc15 | `~` |
| 16 | Proc16 | Ground, Collection, Var, Nil, Block |

### Constructs Present in Both

Both grammars support:
- All process constructs (send, receive, contract, match, select, if/else, new, let, bundle)
- All operator classes (arithmetic, comparison, boolean, logical)
- All binding types (linear `<-`, repeated `<=`, peek `<<-`)
- All collection types (list, tuple, set, map)
- All ground types (bool, int, string, uri)
- All bundle types (bundle+, bundle-, bundle0, bundle)
- Synchronous send (`!?`) with continuation (`.` or `; P`)
- Receive-send (`?!`) and send-receive (`!?` in bind)
- Remainder patterns (`...x`, `...@x`)

### Ambiguities and Notes

1. **`*` operator ambiguity**: Both multiplication `Proc * Proc` and dereference `*Name` use `*`. Context (operand type) determines interpretation.

2. **`-` operator ambiguity**: Both subtraction `Proc - Proc` and unary negation `-Proc` use `-`. Precedence resolves this.

3. **Block vs Map**: Both use `{}`. Block contains a single Proc; Map contains key-value pairs with `:`.

4. **Tuple syntax**: Single-element tuples require trailing comma: `(x,)` vs multi-element `(x, y)`.

---

## Example Productions

### Hello World

```rholang
new stdout(`rho:io:stdout`) in {
  stdout!("Hello, World!")
}
```

Parses as:
```
PNew -> [NameDeclUrn("stdout", `rho:io:stdout`)] -> PSend -> NameVar("stdout") -> SendSingle -> [PGround(GroundString("Hello, World!"))]
```

### Contract Definition

```rholang
contract Counter(ret) = {
  new count in {
    count!(0) |
    for (@n <= count) {
      ret!(n)
    }
  }
}
```

Parses as:
```
PContr -> NameVar("Counter") -> [NameVar("ret")] ->
  PNew -> [NameDeclSimpl("count")] ->
    PPar ->
      PSend -> NameVar("count") -> SendSingle -> [PGround(0)]
      PInput -> [ReceiptRepeated -> RepeatedBindImpl -> [@n] -> NameVar("count")] ->
        PSend -> NameVar("ret") -> SendSingle -> [PVar("n")]
```

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | 2025-12-11 | Initial draft from TASK-107 |
