---
layout: page
title: Beginners Tutorial
description: Learn Rholang programming from the ground up
---

# Beginners Tutorial

Written by Joshy Orndorff

In order to run the Rholang snippets in this tutorial, you will need some kind of development environment. This is not an exhaustive guide to Rholang development tools or stacks. Rather, it shows a few common basic development environments to get you started. Content adapted from the rholang.org tutorial series.

## Development Environments

### VSCode Plugin
This is the Visual Studio Code extension for the Rholang programming language. It has support for syntax highlighting and code evaluation with error highlighting. [Marketplace VSCode](https://marketplace.visualstudio.com/items?itemName=tgrospic.rholang)

### Rholang Playground
Evaluate Rholang code in the cloud and test your dApp at [Rholang Playground](https://try-rholang-22.netlify.app/).

### Local Node
Another way to run Rholang code is to start up your own local RNode and use its Rholang interpreter. For that RNode has to be installed. There are two modes to run Rholang code locally: repl and eval. With repl you can type Rholang code directly into the console and execute it. With eval you are running a `.rho` file and execute this file. Tutorial for local setup is [here](/docs/rholang/).

## Start learning Rholang
- [Sending](/tutorials/sending/) - Send messages on channels and see how concurrency works.
- [Receiving](/tutorials/receiving/) - Listen on channels, trigger comm events, and introduce simple contracts.
- [Names and Processes](/tutorials/names-and-processes/) - Relay messages and understand name scoping.
- [Send and Peek](/tutorials/send-and-peek/) - Use send-and-peek patterns to coordinate processes.
- [Join](/tutorials/join/) - Coordinate multiple channels with joins.
- [Unforgeable Names](/tutorials/unforgable-names/) - Create secure channels with unforgeable names.
- [Bundles and Interpolation](/tutorials/bundles-interpolation/) - Work with data bundles and interpolation.
- [State Channels](/tutorials/state-channels/) - Manage persistent state.
- [Object Capabilities](/tutorials/object-capabilities/) - Apply object-capability security patterns.
- [Additional Syntax](/tutorials/additional-syntax/) - Explore additional Rholang syntax.
- [Pattern Matching](/tutorials/pattern-matching/) - Use pattern matching to control program flow.
- [Data Structures](/tutorials/data-structures/) - Build common data structures in Rholang.
- [Recursion](/tutorials/recursion/) - Write recursive processes.
- [Game Example](/tutorials/game-example/) - Walk through a complete example.
- [Off Chain](/tutorials/off-chain/) - Interact with external systems.
- [Crypto URNs](/tutorials/crypto-urns/) - Hashing and signature verification.
- [Cheat Sheet](/tutorials/cheat-sheet/) - Quick reference for syntax.
- Rho Lambda series:
  - [Introduction](/tutorials/introduction/)
  - [Booleans](/tutorials/boolean/)
  - [Church Numerals](/tutorials/church/)
  - [Linked Lists](/tutorials/linked/)
  - [Notation](/tutorials/notation/)
  - [Conway](/tutorials/conway/)

## Next Steps

Once you've completed these tutorials, you'll be ready to:
- Build your own dApps using the [dApp development guide](/dapps/)
- Explore the complete [language documentation](/docs/rholang/)
- Join the community on [Discord](https://discord.gg/nCQxEwUd)

If you're coming from an older monolithic tutorial, see [Legacy Tutorial Mapping](/tutorials/legacy-tutorial-mapping/).
