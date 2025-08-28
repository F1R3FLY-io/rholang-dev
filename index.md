---
layout: default
title: Home
---

<div class="disclaimer-section">
  <div class="disclaimer-content">
    <p><strong>Community Documentation</strong> - This site is maintained by F1r3fly.io Limited Cooperative Association and is not officially affiliated with the RChain Cooperative. For official RChain documentation, visit <a href="https://developer.rchain.coop">developer.rchain.coop</a>.</p>
  </div>
</div>

<div class="hero-section">
  <h1>Rholang is a new concurrent language</h1>
  <p>Rholang is an open and scalable blockchain language designed for speed and reliability. Built on latest research from the reflective higher order calculus.</p>
  <a href="/docs/" class="cta-button">Get started</a>
</div>

<div class="features-section">
  <div class="feature-grid">
    <div class="feature">
      <h3>Write a smart contract</h3>
      <h4>IDEs</h4>
      <ul>
        <li><a href="https://marketplace.visualstudio.com/items?itemName=tgrospic.rholang">Visual Studio Code Plugin</a></li>
        <li><a href="https://try-rholang-22.netlify.app/">RChain Cloud</a></li>
        <li><a href="https://github.com/tgrospic/rholang-idea">Intellij Plugin</a></li>
      </ul>
    </div>

    <div class="feature">
      <h3>Compile</h3>
      <p>Compile code written in Rholang</p>
      <ul>
        <li>Complete asynchronous language</li>
        <li>Runtime engine written in type safe language (Scala)</li>
        <li>Concurrency built into the language</li>
      </ul>
    </div>

    <div class="feature">
      <h3>Deploy</h3>
      <p>Propose smart-contract to the global distributed RChain network</p>
      <ul>
        <li>Types of interaction bounded by namespaces</li>
        <li>Sharding for validators</li>
        <li>Asynchronous notification for names in a contract</li>
        <li>Scalable DAG structure (Directed Acyclic Graph)</li>
      </ul>
    </div>
  </div>
</div>

<div class="content-sections">
  <section class="language-intro">
    <h3>The language you've been waiting for</h3>
    <p>Rholang is built on the latest research on concurrent languages. Up to now all functional languages are built on the lambda calculus. With Rholang we built a new language on top of the reflective higher order calculus (rho-calculus). This leads to a full concurrent language, with a very simple and safe way for developers to write concurrent code. Rholang is a new calculus from research led by Greg Meredith inspired from the pi-calculus.</p>
  </section>

  <section class="consensus-layer">
    <h3>A new consensus layer</h3>
    <p>Most blockchains are running serial like a chain, with that, throughput is very limited. The F1r3fly blockchain uses DAGs (directed acyclic graphs) that have a tree-like structure and scale massively. F1r3fly uses proof of stake consensus mechanisms. Additionally, Rholang code is fully verified and the F1r3fly project code is written in Scala. With that, Rholang provides strong safety guarantees for blockchain applications.</p>
  </section>

  <section class="community">
    <h3>F1r3fly.io Community</h3>
    <p>The community for Rholang on F1r3fly is the F1r3fly.io community. F1r3fly.io is founded as a cooperative with democratic thinking in mind. Join our Discord community to participate in the development and discussion of Rholang and the F1r3fly blockchain platform.</p>
  </section>

  <section class="dapp-developers">
    <h3>Built for dApp developers</h3>
    <p>The Rholang developer ecosystem is growing on the F1r3fly platform. With a type-safe API, dApps can be written for F1r3fly blockchain. The community is developing tools and tutorials to make it easy for new developers to come onboard and build on the F1r3fly platform.</p>
    <a href="/docs">Read more</a>
  </section>
</div>

<div class="code-example">
  <h2>A better way to build apps for distributed computing</h2>
  <p>Rholang makes it simple & fast to build modern dApps.</p>
  
  <div class="code-tabs">
    <button class="tab-button active" data-tab="hello-world">Hello World Example</button>
    <button class="tab-button" data-tab="resources">Managing Resources</button>
    <button class="tab-button" data-tab="numbers">Non-negative numbers</button>
  </div>

  <div class="code-content">
    <div class="tab-pane active" id="hello-world">
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
    </div>
  </div>

  <a href="/docs/" class="cta-button">Get started</a>
</div>

<div class="resources-grid">
  <div class="resource-item">
    <h3>Documentation</h3>
    <p>Everything you need to get up and running.</p>
    <a href="/docs">Read more</a>
  </div>

  <div class="resource-item">
    <h3>Tutorials</h3>
    <p>Read tutorials from the community and learn Rholang</p>
    <a href="/tutorials">Read more</a>
  </div>

  <div class="resource-item">
    <h3>F1r3fly.io Community</h3>
    <p>Join our Discord community for support and discussion</p>
    <a href="https://discord.gg/nCQxEwUd">Join Discord</a>
  </div>

  <div class="resource-item">
    <h3>F1r3fly Blockchain</h3>
    <p>F1r3fly blockchain implementation and development</p>
    <a href="https://github.com/F1R3FLY-io/f1r3fly/">Read more</a>
  </div>

  <div class="resource-item">
    <h3>Rholang Cloud</h3>
    <p>Try to write Rholang code and compile it online</p>
    <a href="https://try-rholang-22.netlify.app/">Read more</a>
  </div>

  <div class="resource-item">
    <h3>Official RChain Development Updates</h3>
    <p>Read the latest development updates from RChain</p>
    <a href="https://rchain.atlassian.net/wiki/spaces/CORE/overview">Read more</a>
  </div>

  <div class="resource-item">
    <h3>Official RChain Developer Page</h3>
    <p>Official resources for developers</p>
    <a href="https://developer.rchain.coop/">Read more</a>
  </div>

  <div class="resource-item">
    <h3>Official RChain Blog</h3>
    <p>Keep up to date with official RChain blog posts</p>
    <a href="https://blog.rchain.coop">Read more</a>
  </div>

  <div class="resource-item">
    <h3>RChain Wallets</h3>
    <p>Community driven RChain Wallets</p>
    <ul>
      <li><a href="https://myrchainwallet.com">MyRChainWallet</a></li>
      <li><a href="https://wenode.io/rui/">Rui Wallet</a></li>
      <li><a href="https://icapo.app/">Capo Wallet</a></li>
      <li><a href="http://app.onechain.one/appstart_en.html">ONE Wallet</a></li>
    </ul>
  </div>

  <div class="resource-item">
    <h3>RChain Blockchain Explorer</h3>
    <p>Watch the network live</p>
    <a href="http://revdefine.io/">Read more</a>
  </div>
</div>