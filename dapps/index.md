---
layout: page
title: Build dApps
description: Learn to build decentralized applications with Rholang
---

# Build dApps

dApps are a growing opportunity for disrupting decentralized applications. This tutorial should help you build dApps by your own and deploy them to the network with the use of CodeSandbox.io. Use this [CodeSandbox template](https://codesandbox.io/s/rholang-template-jd55p?file=/src/rholang/rho.js) to start.

## CodeSandbox.io Advantages for dApp Development

- Free to use for everybody
- No login required
- Evaluate your Rholang code (read only) for free on the RChain testnet
- Evaluate your Rholang code (REV cost) on the RChain mainnet

## Write Rholang Code

The language in which you write your dApp is Rholang, which is being executed decentralized on the RChain network.

### Getting Started

1. Go to CodeSandbox.io and use the [Rholang template](https://codesandbox.io/s/rholang-template-jd55p?file=/src/rholang/rho.js)
2. Under the folder `rholang`, select the `rho.js` file
3. Insert your Rholang code after the key `template:`
   - If you have variables, which you want to fill from a UI and should be inserted into the Rholang code, write this variable after the key `fields:`

## Execute Your Rholang Code on the RChain Network

To execute your Rholang code on the RChain network you can choose between **testnet** or **mainnet**:

After that you can use **Explore** or **Deploy**.

**Explore** runs your code on the network (on a read-only node). You can deploy a contract which is reading some state of a contract on the network. This execution is free to use.

**Deploy** runs your code on the network and mutates the state of some contract. This execution costs REV (use MetaMask for signing the transaction).

The returned result will be displayed after the execution in the UI.

## Make Your Code Searchable for Others

To let others discover your Rholang code, please edit the title of your CodeSandbox.

> ⚠️ Your title of the sandbox has to begin with: `rholang-` 
> Example titles: `rholang-helloworld`, `rholang-liquid-democracy` ... 
> Otherwise your sandbox will not be found by CodeSandbox by others.

With this your CodeSandbox is searchable under the search query: rholang

See here: [Search Rholang dApps](https://codesandbox.io/search?refinementList%5Btags%5D=&refinementList%5Bnpm_dependencies.dependency%5D=&page=1&configure%5BhitsPerPage%5D=12&query=rholang%20)

## Code Examples

### Hello World
```rholang
new helloworld, stdout(`rho:io:stdout`) in {
  contract helloworld( world ) = {
    for( @msg <- world ) {
      stdout!(msg)
    }
  } |
  new world, world2 in {
    helloworld!(*world) |
    world!("Hello World") |
    helloworld!(*world2) |
    world2!("Hello World again")
  }
}
```

### Managing Resources (Content)
```rholang
new resourceManager, stdout(`rho:io:stdout`) in {
  contract resourceManager(resource, @operation, return) = {
    match operation {
      "get" => {
        for (@content <- resource) {
          resource!(content) |
          return!(content)
        }
      }
      "set" => {
        for (@newContent <- return) {
          resource!(newContent)
        }
      }
    }
  }
}
```

### Non-negative Numbers Contract
```rholang
new NonNegativeNumber, stdout(`rho:io:stdout`) in {
  contract NonNegativeNumber(@init, return) = {
    new valueStore in {
      if (init >= 0) {
        valueStore!(init) |
        return!(true)
      } else {
        return!(false)
      }
    }
  }
}
```

## Next Steps

- Explore more [examples](/dapps/examples/)
- Read the [development documentation](/docs/)
- Join the community on [Discord](https://discord.gg/NWkQnfH)
- Try the [RChain Cloud](https://try-rholang-22.netlify.app/) environment