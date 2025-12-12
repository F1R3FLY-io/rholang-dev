---
layout: default
title: Tools & IDEs
parent: Reference
permalink: /reference/tools/
---

# Tools & IDEs

Development tools and IDE support for Rholang programming.

## Official Tools

### Rholang CLI
The official Rholang command-line interface for running and testing Rholang programs.

```bash
# Install Rholang CLI
curl -sSf https://get.rholang.io | sh

# Run a Rholang file
rho run myprogram.rho
```

### RNode
The RChain node software for deploying and executing Rholang smart contracts.

- [Download RNode](https://github.com/rchain/rchain/releases)
- [RNode Documentation](https://rchain.atlassian.net/wiki/spaces/CORE/pages/428376065/User+guide+for+RNode)

## IDE Support

### Visual Studio Code Extension
Full-featured Rholang support for VS Code with syntax highlighting, code completion, and error checking.

- **Install**: Search for "Rholang" in VS Code Extensions
- **Features**:
  - Syntax highlighting
  - Code snippets
  - Error detection
  - Auto-formatting
  - Hover documentation

[VS Code Extension on Marketplace](https://marketplace.visualstudio.com/items?itemName=tgrospic.rholang)

### IntelliJ IDEA Plugin
Rholang language support for IntelliJ-based IDEs.

- Syntax highlighting
- Code navigation
- Refactoring support
- Integrated debugging

## Online Tools

### Rholang Web IDE
Try Rholang directly in your browser without any installation.

- [Rholang Playground](https://try-rholang-22.netlify.app/)
- Interactive tutorials
- Example programs
- Share code snippets

### RChain Explorer
Blockchain explorer for viewing deployed contracts and transactions.

- [MainNet Explorer](https://explorer.rchain.coop/)
- [TestNet Explorer](https://testnet-explorer.rchain.coop/)

## Development Utilities

### Rholang Formatter
Automatic code formatting tool for consistent code style.

```bash
rho fmt myfile.rho
```

### Rholang Linter
Static analysis tool for detecting common errors and style issues.

```bash
rho lint src/
```

### Testing Framework
Built-in testing support for Rholang programs.

```rholang
new test in {
  test!("should add numbers correctly", {
    assert!(2 + 2 == 4, "Math is broken!")
  })
}
```

## Build Tools

### Rholang Build System
Project management and build automation for Rholang applications.

```yaml
# rholang.yaml
name: my-project
version: 1.0.0
dependencies:
  - rchain-core: "^0.9.0"
  - collections: "^1.0.0"
```

### Package Manager
Manage dependencies and libraries for your Rholang projects.

```bash
rho install
rho add rchain-core
rho publish
```

## Debugging Tools

### RNode Debug Mode
Enable detailed logging and debugging information.

```bash
rnode run --debug-mode
```

### Contract Visualizer
Visual representation of channel communication and process execution.

### Performance Profiler
Analyze resource usage and optimize contract performance.

## Integration Tools

### REST API Client
HTTP interface for interacting with RNode.

### JavaScript SDK
```javascript
const { RNode } = require('@rchain/rnode-client');
const node = new RNode('http://localhost:40401');
```

### Python SDK
```python
from rchain.client import RClient
client = RClient('localhost', 40401)
```

## Community Tools

### Third-party Libraries
- [Awesome Rholang](https://github.com/rchain/awesome-rholang) - Curated list of Rholang resources
- Community packages and libraries

## Getting Help

- [Tool Documentation](https://rchain.atlassian.net/wiki)
- [Discord #dev-tools Channel](https://discord.gg/NWkQnfH)
- [GitHub Issues](https://github.com/rchain/rchain/issues)