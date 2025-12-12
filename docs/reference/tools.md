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

### F1r3fly Node
The F1r3fly node software for deploying and executing Rholang smart contracts.

- [f1r3node Repository](https://github.com/F1R3FLY-io/f1r3node)

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
  - f1r3fly-core: "^0.9.0"
  - collections: "^1.0.0"
```

### Package Manager
Manage dependencies and libraries for your Rholang projects.

```bash
rho install
rho add f1r3fly-core
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

SDKs and client libraries are documented alongside the node API in the `f1r3node` repository. HTTP/JSON examples are available in the repository's docs and tests.

## Community Tools

### Third-party Libraries
- Community packages and libraries (catalog in progress)

## Getting Help

- Tool Documentation: see `f1r3node` repository docs
- [Discord #dev-tools Channel](https://discord.gg/nCQxEwUd)
- [GitHub Issues](https://github.com/F1R3FLY-io/f1r3node/issues)
