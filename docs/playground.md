---
layout: default
title: Playground
nav_exclude: false
permalink: /playground/
---

# Rholang Playground

Try Rholang directly in your browser! Write, run, and experiment with Rholang code without any installation.

## Interactive Editor

<div class="playground-container">
  <div class="playground-notice">
    <h3>🚀 Launch the Playground</h3>
    <p>The interactive Rholang playground opens in a new window for the best experience.</p>
    <a href="https://try-rholang-22.netlify.app/" target="_blank" class="btn btn-primary">Open Playground →</a>
  </div>
</div>

## Features

### 💻 Full IDE Experience
- Syntax highlighting
- Auto-completion
- Error detection
- Code formatting

### 📚 Built-in Examples
Choose from a library of example programs:
- Hello World
- Channel communication
- Pattern matching
- Concurrent processes
- Smart contracts

### 🔧 Developer Tools
- Console output
- Process visualization
- Step-by-step execution
- Performance metrics

### 💾 Save & Share
- Save your programs locally
- Share code via URL
- Export to GitHub Gist
- Download as .rho files

## Quick Start Examples

### Hello World
```rholang
new stdout(`rho:io:stdout`) in {
  stdout!("Hello, Rholang!")
}
```

### Simple Counter
```rholang
new counter, increment, getValue, stdout(`rho:io:stdout`) in {
  counter!(0) |
  
  contract increment(_) = {
    for(@value <- counter) {
      counter!(value + 1)
    }
  } |
  
  contract getValue(return) = {
    for(@value <- counter) {
      counter!(value) |
      return!(value)
    }
  } |
  
  increment!(Nil) |
  increment!(Nil) |
  getValue!(*stdout)
}
```

### Parallel Processes
```rholang
new chan, stdout(`rho:io:stdout`) in {
  chan!(1) |
  chan!(2) |
  chan!(3) |
  
  for(@x <- chan) {
    stdout!(["Received:", x])
  } |
  
  for(@y <- chan) {
    stdout!(["Also received:", y])
  }
}
```

## Tutorial Mode

New to Rholang? Try our interactive tutorials directly in the playground:

1. **Introduction to Channels** - Learn about Rholang's core communication primitive
2. **Pattern Matching** - Master Rholang's powerful pattern matching
3. **Concurrent Programming** - Understand parallel execution
4. **Building Contracts** - Create your first smart contract

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Run code |
| `Ctrl/Cmd + S` | Save locally |
| `Ctrl/Cmd + O` | Open file |
| `Ctrl/Cmd + /` | Toggle comment |
| `Alt + Shift + F` | Format code |

## Limitations

The online playground runs in a sandboxed environment with some limitations:

- No file system access
- Limited execution time (30 seconds max)
- Memory limit (100MB)
- No network requests
- Simplified blockchain simulation

For full Rholang capabilities, [install the CLI tools](/reference/tools/).

## Embedding the Playground

You can embed the playground in your own documentation or tutorials:

```html
<iframe 
  src="https://try-rholang-22.netlify.app/embed" 
  width="100%" 
  height="600"
  frameborder="0">
</iframe>
```

### URL Parameters
- `?code=...` - Pre-load code (URL encoded)
- `?theme=dark` - Use dark theme
- `?readonly=true` - Make editor read-only
- `?hideToolbar=true` - Hide toolbar

## Local Development

Want to run the playground locally?

```bash
git clone https://github.com/rchain/rholang-playground
cd rholang-playground
npm install
npm start
```

Visit `http://localhost:3000` to use the playground locally.

## Feedback & Issues

Found a bug or have a suggestion for the playground?

- [Report an issue](https://github.com/rchain/rholang-playground/issues)
- [Request a feature](https://github.com/rchain/rholang-playground/issues/new)
- [Contribute](https://github.com/rchain/rholang-playground)

## Alternative Playgrounds

### Rholang Cloud
A more advanced cloud-based IDE with additional features:
- Multi-file projects
- Collaboration features
- Deployment to testnet
- Advanced debugging

[Try Rholang Cloud →](https://rholang.cloud)

### VS Code Online
Use Visual Studio Code in your browser with Rholang extension:
- Full VS Code experience
- Extension marketplace
- Git integration
- Terminal access

[Open VS Code Online →](https://vscode.dev)

<style>
.playground-container {
  margin: 2rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
}

.playground-notice {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

.playground-notice h3 {
  margin-top: 0;
  color: #2c3e50;
}

.playground-notice p {
  color: #666;
  margin: 1rem 0 2rem;
}

.btn-primary {
  display: inline-block;
  padding: 0.875rem 2rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #764ba2;
  transform: translateY(-2px);
  text-decoration: none;
}

table {
  margin: 2rem 0;
}

code {
  background: #f4f4f4;
  padding: 2px 6px;
  border-radius: 3px;
}
</style>