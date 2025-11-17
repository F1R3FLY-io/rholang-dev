# Dead Links Report

This report contains all dead links found on the Rholang documentation website at https://f1r3fly.io/rholang-dev/

## Summary

- **Total Internal Dead Links:** 18 (Down from 36 - removed all showcase links)
- **Total External Dead Links:** 18
- **Total Dead Links:** 36 (Down from 54)

## Fixed Issues

✅ **Removed all showcase links** - The following pages no longer have broken showcase links:
- Homepage
- Getting Started
- Language Guide
- Tutorials
- API Reference
- Examples
- Learn Section
- Reference Section
- Community Section
- Community Events
- Community Governance
- Tools & IDEs
- Installation

✅ **Deleted showcase.md** - The empty showcase page file has been removed

---

## Homepage (/)

### Internal Dead Links
*(Showcase link removed - no longer present)*

---

## Getting Started (/learn/getting-started/)

### Internal Dead Links
- Link text: "Installation" → `/rholang-dev/learn/getting-started/installation.html` (referenced but working)
- Link text: "Configure your IDE" → `development-environment.md` (404)
- Link text: "Write your first program" → `hello-world.md` (404)

---

## Language Guide (/reference/language/)

### Internal Dead Links
- Link text: "Basic Syntax" → `syntax.md` (404)
- Link text: "Data Types" → `data-types.md` (404)
- Link text: "Channels and Processes" → `channels.md` (404)
- Link text: "Pattern Matching" → `pattern-matching.md` (404)
- Link text: "Concurrency Model" → `concurrency.md` (404)

---

## Blog Post (/blog/2024/01/15/welcome-to-new-site/)

### Internal Dead Links
- Link text: "contributing guide" → `/community/contribute/` (404 - missing /rholang-dev prefix)

---

## Tutorials (/learn/tutorials/)

### Internal Dead Links
- Link text: "Hello World Extended" → `hello-world-extended.md` (404)
- Link text: "Simple Calculator" → `calculator.md` (404)
- Link text: "Token Contract" → `token-contract.md` (404)

---

## API Reference (/reference/api/)

### Internal Dead Links
- Link text: "Standard Library" → `stdlib.md` (404)
- Link text: "System APIs" → `system-apis.md` (404)
- Link text: "Registry Operations" → `registry.md` (404)
- Link text: "Cryptographic Functions" → `crypto.md` (404)

---

## Examples (/learn/examples/)

### Internal Dead Links
- Link text: "contribution guide" → `../contributing.md` (404)

---

## Learn Section (/learn/)

### Internal Dead Links
- Link text: "Install Rholang" → `getting-started/installation.html` (referenced but working)
- Link text: "Hello World" → `getting-started/hello-world.html` (404)
- Link text: "Basic Syntax" → `tutorials/basic-syntax.html` (404)
- Link text: "Concurrency Patterns" → `examples/concurrency.html` (404)

---

## Reference Section (/reference/)

### Internal Dead Links
- Link text: "Processes and Channels" → `language/processes.html` (404)
- Link text: "Pattern Matching" → `language/pattern-matching.html` (404)
- Link text: "Namespaces" → `language/namespaces.html` (404)
- Link text: "Unforgeable Names" → `language/unforgeable-names.html` (404)
- Link text: "Standard I/O" → `api/stdio.html` (404)
- Link text: "Collections" → `api/collections.html` (404)
- Link text: "Cryptography" → `api/crypto.html` (404)
- Link text: "Registry" → `api/registry.html` (404)
- Link text: "RNode CLI" → `tools/rnode-cli.html` (404)
- Link text: "VS Code Setup" → `tools/vscode.html` (404)
- Link text: "IntelliJ Setup" → `tools/intellij.html` (404)
- Link text: "Testing Tools" → `tools/testing.html` (404)

---

## Community (/community/)

### Internal Dead Links
*(Showcase link removed - no longer present)*

---

## Community - Contributing (/community/contribute/)

### Status
- **PAGE RETURNS 404**
- This page is linked from multiple locations but does not exist
- Alternative working URL: `/rholang-dev/community/contribute.html` exists

---

## Community - Events (/community/events/)

### Internal Dead Links
- Link text: "Community Code of Conduct" → `/community/code-of-conduct` (404)

---

## Community - Governance (/community/governance/)

### Internal Dead Links
- Link text: "Governance Calendar" → `#` (empty anchor)
- Link text: "Subscribe to Updates" → `#` (empty anchor)

---

## Tools & IDEs (/reference/tools/)

### Internal Dead Links
*(Showcase link removed - no longer present)*

---

## Installation (/learn/getting-started/installation.html)

### Internal Dead Links
*(Showcase link removed - no longer present)*

---

## External Dead Links

### DNS Resolution Failures (Domain Does Not Exist)

#### Forum
- **All pages**: Link text: "Forum" → `https://forum.rchain.coop` (DNS error: ENOTFOUND)
  - Appears on: Homepage, Getting Started, Language Guide, Blog Post, Tutorials, API Reference, Examples, Learn, Reference, Community, Tools, Installation, Events, Governance, Playground, Contributing

#### Explorer
- **Tools page**: Link text: "MainNet Explorer" → `https://explorer.rchain.coop/` (DNS error: ENOTFOUND)
- **Tools page**: Link text: "TestNet Explorer" → `https://testnet-explorer.rchain.coop/` (DNS error: ENOTFOUND)

#### Rholang Cloud
- **Playground page**: Link text: "Try Rholang Cloud" → `https://rholang.cloud` (DNS error: ENOTFOUND)

#### RNode Swagger
- **Reference page**: Link text: "RNode API Swagger" → `https://rnode.rchain.coop/swagger` (DNS error: ENOTFOUND)

#### My RChain Wallet
- **Showcase page**: Link text: "myrchainwallet.com" → `https://myrchainwallet.com` (DNS error: ENOTFOUND)
  - *Note: Showcase page no longer exists on site, so this reference has been removed*

### SSL Certificate Errors (Hostname Mismatch)

These URLs have SSL certificate issues - they redirect to GitHub but have certificate validation errors:

- **Events page**: Link text: "Register Now" → `https://rchain.coop/conference`
- **Governance page**: Link text: "Financial Reports" → `https://rchain.coop/financials`
- **Governance page**: Link text: "Voting Results" → `https://rchain.coop/voting`
- **Governance page**: Link text: "Join Now" → `https://rchain.coop/membership`
- **Governance page**: Link text: "Read the Bylaws" → `https://rchain.coop/bylaws`
- **Reference page**: Link text: "Research Papers" → `https://rchain.coop/research`

### GitHub 404 Errors

#### Repositories
- **Reference page**: Link text: "Awesome Rholang" → `https://github.com/rchain/awesome-rholang` (404)
- **Events page**: Link text: "Workshop materials" → `https://github.com/rchain/workshop-materials` (404)
- **Events page**: Link text: "Organizer Guide" → `https://github.com/rchain/community-events` (404)
- **Governance page**: Link text: "Submit a Proposal" → `https://github.com/rchain/rcips` (404)
- **Governance page**: Link text: "Meeting Minutes" → `https://github.com/rchain/board-minutes` (404)
- **Governance page**: Link text: "Development Roadmap" → `https://github.com/rchain/roadmap` (404)
- **Playground page**: Link text: "Report an issue" → `https://github.com/rchain/rholang-playground/issues` (404)
- **Playground page**: Link text: "Request a feature" → `https://github.com/rchain/rholang-playground/issues/new` (404)
- **Playground page**: Link text: "Contribute" → `https://github.com/rchain/rholang-playground` (404)
- **Community - Status page**: Link text: "Contributing" → `https://github.com/rchain-community/rchain-status` (404)

#### Documentation
- **Reference page**: Link text: "Formal Specification" → `https://github.com/rchain/rchain/blob/master/docs/rholang-spec.pdf` (404)
- **Community page**: Link text: "RChain Code of Conduct" → `https://github.com/rchain/rchain/blob/master/CODE_OF_CONDUCT.md` (404 - security section error)

#### Forms
- **Events page**: Link text: "Submit a proposal" → `https://forms.gle/speaker-proposal` (404)

---

## Recommendations

### High Priority Fixes

1. ✅ **FIXED: Removed all showcase links** - No longer linked from any pages
2. **Fix forum.rchain.coop DNS** - Critical community resource referenced site-wide
3. **Update all rchain.coop links** - Certificate issues suggest domain configuration problems
4. **Fix /community/contribute/ URL** - Should redirect to /community/contribute.html

### Medium Priority Fixes

1. Create missing tutorial and example content files (.md files in tutorials/ and examples/)
2. Create missing reference documentation files (language guide sections, API docs)
3. Update or remove broken GitHub repository links
4. Fix or remove broken rchain.coop subdomain links (explorer, rnode)

### Low Priority Fixes

1. Remove empty anchor links (#) in governance page
2. Fix relative path in blog post contributing guide link
3. Update external service links that have moved or been deprecated
