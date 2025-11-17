---
layout: default
title: Installation
parent: Getting Started
grand_parent: Learn
nav_order: 1
---

# Installation

Install Rholang and set up your development environment.

## System Requirements

- Java 11 or higher
- 4GB RAM minimum (8GB recommended)
- 10GB free disk space

## Installation Methods

### Using Package Manager

#### macOS (Homebrew)
```bash
brew tap rholang/rholang
brew install rholang
```

#### Linux (apt)
```bash
sudo add-apt-repository ppa:rholang/stable
sudo apt update
sudo apt install rholang
```

### From Source

```bash
git clone https://github.com/rholang/rholang.git
cd rholang
./scripts/install.sh
```

## Verify Installation

```bash
rho --version
```

You should see output similar to:
```
Rholang v1.0.0
```

## Next Steps

- [Configure your IDE](development-environment.md)
- [Write your first program](hello-world.md)