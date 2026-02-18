# Part I — Launching a Firefly Shard
> **Document status:** Evidence-based runbook (validated commands + expected outputs).
> **Last verified:** 2026-02-17 • **Repo/branch:** `<REPO>` @ `<BRANCH_OR_COMMIT>`
> **Prepared by:** Daria Bohdanova — Documentation Architect / Technical Writer
> **Validated & approved by:** `<VALIDATOR_NAME>` — `<ROLE>` • **Evidence:** terminal output + logs (+ screenshots where marked)
## Preface

Launching a shard is not just a step it is a milestone.  
It marks the beginning of your journey with Firefly: a moment when your own blockchain
universe comes to life on your machine. Think of a shard as a self-contained, isolated
world — your sandbox - where contracts run, state evolves, and logs tell the story
of what happened.

This guide follows Firefly’s onion model:

- **TL;DR for experts** — for those who already know Docker and just want the minimal path to a running shard.
- **Standard walkthrough** — step-by-step instructions with explanations and guardrails.
- **Deep dive** — optional advanced content (CLI, Kubernetes/Helm, IaC, multi-shard setups).

We assume you:

- have basic familiarity with Docker and terminal commands;
- are running on Linux / macOS / Windows (via WSL2);
- want copy–paste commands and clear sanity checks at every step.

If prerequisites feel unclear — don’t worry.  
This chapter provides everything needed to run Firefly with confidence.


## TL;DR QuickStart (for experts)

If you want to see a shard running and responding in under five minutes, here’s the shortest possible path.

### 1. Open the repo (use the local clone)

If you already have the repo locally (recommended):

```bash
cd ~/Documents/GitHub/f1r3node/docker
pwd
ls
```
If git clone fails because the destination folder already exists (e.g., “destination path … already exists”), you already have a clone — just cd into it.
```bash 
cd ~/Documents/GitHub
git clone https://github.com/F1R3FLY-io/f1r3node.git
cd f1r3node/docker
pwd
ls
```
>**📝 NOTE**
All commands below are executed from the f1r3node/docker directory.

### 2. Check Docker is alive (30-second sanity check)

```bash
docker version
docker compose version
```
>**💡 TIP**
If both commands print versions — you’re good.


### 3. Reset the shard (clean start)

```bash
docker compose -f shard-with-autopropose.yml down --remove-orphans
```
>**⚠️ WARNING**
This stops/removes the running shard containers for this Compose file.

>**💡 TIP**
If you want a truly clean reset (also wipes shard data volumes), use:
```bash
docker compose -f shard-with-autopropose.yml down -v --remove-orphans
```

### 4. Launch the shard (autopropose profile)
```bash
docker compose -f shard-with-autopropose.yml up -d --force-recreate
sleep 10
```
You should see containers being Created.
### 5. Verify containers are up
```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | egrep "rnode\." || true
```
Expected: you see these names (order may differ):
	- rnode.bootstrap
	- rnode.validator1
	- rnode.validator2
	- rnode.validator3

### 6. Confirm startup completed (bootstrap + at least one validator)
Bootstrap:
```bash
docker logs --tail 300 rnode.bootstrap | egrep -i "All tasks started|Engine initialization completed|error|panic" || true
```
Validator (example: validator1):
```bash
docker logs --tail 300 rnode.validator1 | egrep -i "All tasks started|Engine initialization completed|error|panic" || true
```
Expected (happy path):
	- All tasks started. Node is now running.
	- Engine initialization completed successfully

>**📝 NOTE**
It’s normal to see occasional transient connect messages early on. What matters is that nodes reach “now running” / “initialization completed”.


### 7. Check shard status endpoint

```bash
curl -s http://127.0.0.1:40403/status && echo
```
>**📝 NOTE**
The JSON below is an example output. Don’t paste it into the terminal.
```json
{"address":"rnode://<NODE_ID>@rnode.bootstrap?protocol=<PORT>&discovery=<PORT>","version":"F1r3fly Node <...>","peers":<N>,"nodes":<N>}
```
>**📝 NOTE**
In this /status response, peers/nodes may show 3 (bootstrap reporting other nodes). The key success criterion is: you get a valid JSON response with address, version, and non-zero peer/node counts.
### Repositories used in this guide

**Main node repo (this QuickStart uses it):**  
https://github.com/F1R3FLY-io/f1r3node  
Docker shard configs live in `f1r3node/docker`.
>**👉 NEXT:**
**§1 Introduction** — What is a shard and why it matters


## 1 Introduction — What is a shard and why it matters

When you launch Firefly, you are not starting a “big chain in the sky.”  
You are starting **your own shard** — a local blockchain instance that runs independently and behaves like a small self-contained network on your machine.

Think of a shard (`f1r3node`) as a sandboxed universe:

- It has its own processes, registry, and logs.  
- It can run contracts in isolation.  
- It can be restarted, wiped, and re-launched safely while you iterate on docs/configs.

#### Why is this important?

  **For developers** — a shard is your personal testbed: you can deploy Rholang, break things, and restart safely.
  **For operators** — shards are building blocks of Firefly’s multi-shard network. Each shard can scale, restart, and evolve independently.
	

> 💡 **TIP**  
If you come from Web2, think of a shard like a local web server you spin up for development.  
In Web3, this “server” happens to be a blockchain node.

> 📝 **NOTE**  
You don’t need to understand consensus yet. For Part I, your goal is simply: start the shard and confirm it responds on /status.

>👉 **NEXT**  
**§2 Prerequisites** — What you must have in place before touching configs or launch commands.

## 2. Prerequisites

Before you launch the shard, confirm one thing:

- the Compose file parses cleanly (no YAML/env/path issues)

### Validate the Compose file loads (recommended)

Run from `f1r3node/docker`:

```bash
docker compose -f shard-with-autopropose.yml config >/dev/null
echo "OK: compose config parsed"
```
>**📝 NOTE**
If this fails, the most common causes are: running from the wrong directory, YAML syntax errors, or missing files referenced by Compose.
>**👉 NEXT**
**§3 Launching the Shard** — the actual “go” button.
## 3. Launching the Shard — The “Go” Button

At this point, you already have a working TL;DR path.
This section exists for **repeatable start/stop** and the most common gotcha: **running Compose from the wrong directory**.

>**📝 NOTE**  
All commands below must be executed from `f1r3node/docker`. If git clone fails because the destination folder already exists (e.g., “destination path … already exists”), you already have a clone — just cd into it.

### Make sure you are in the correct directory (required)

```bash
cd ~/Documents/GitHub/f1r3node/docker
pwd
ls
```
Expected: you see `shard-with-autopropose.yml and observer.yml.`
Start (repeatable)
```bash
docker compose -f shard-with-autopropose.yml up -d --force-recreate
sleep 10
```
Stop (keeps data)
```bash
docker compose -f shard-with-autopropose.yml down --remove-orphans
```
Clean reset (wipes data volumes)
```bash
docker compose -f shard-with-autopropose.yml down -v --remove-orphans
docker compose -f shard-with-autopropose.yml up -d --force-recreate
sleep 10
```
>**⚠️ WARNING**
down -v removes volumes for this Compose stack. Use it only when you want a fresh state.

Optional: start an observer (read-only)

```bash
docker compose -f observer.yml up -d
docker compose -f observer.yml logs -f
```
>**📝 NOTE**  
You may see a warning about “orphan containers” when starting `observer.yml` while the shard is running.  
This is expected (different Compose files). It does not break anything.

>**👉 NEXT**
**§4 Observing Startup & Logs** — what “good” looks like, and what log noise you can ignore.

## 4. Observing Startup & Logs

Launching the shard is only half the job — now you confirm it is **actually alive** and behaving.
In Part I, we treat logs as signals (what matters) vs noise (what you can ignore).

>**📝 NOTE (anti-freeze rule)**  
Commands with `-f` stream logs and **never exit by themselves**.  
Run **only one** `-f` command at a time, and press **Ctrl+C** to stop it before running anything else.


### Level 1 — Quick check (no streaming, no hanging)

Use this when you just want a fast “is it alive?” answer.

**1. Status endpoint (must return JSON):**
```bash
curl -s http://127.0.0.1:40403/status && echo
```
**2. Startup markers (bootstrap + one validator):**
Bootstrap:
```bash
docker logs --tail 300 rnode.bootstrap | egrep -i "All tasks started|Engine initialization completed|error|panic" || true
```
Validator (example):
```bash
docker logs --tail 300 rnode.validator1 | egrep -i "All tasks started|Engine initialization completed|error|panic" || true
```
Expected (happy path):
- All tasks started. Node is now running
- Engine initialization completed successfully

>**📝 NOTE**
It’s normal to see early “connection refused / handshake / lookup” errors during the first seconds.
What matters is that nodes eventually reach the two “startup completed” markers above.

### Level 2 — Live observation (choose ONE stream)

Use this when you want to watch behavior in real time.

**Step 1 — Pick a service name (no hanging):**
```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | egrep "rnode\." || true
```
**Step 2 — Stream logs (RUN ONE, then STOP with Ctrl+C):**
*Option A — bootstrap live logs:*
```bash
docker logs -f rnode.bootstrap
```
*Option B — one validator live logs:*
```bash
docker logs -f rnode.validator1
```
>**📝 NOTE**
Stop streaming with Ctrl+C.
Then you can run other commands.

*What “good” looks like:*
- no crash/restart loop (containers stay Up)
- bootstrap/validators eventually form connections (you may see “Peers: …” grow)
- `/status` keeps responding

*What is usually harmless noise:*
- transient connection/TLS/lookup errors during early startup
- short bursts of “connection refused” before bootstrap/validators fully come up

*What is NOT OK (investigate):*
- repeating “panic” / restart loops
- persistent port bind errors (“address already in use”)
- `/status` never responds

### Level 3 — Save logs (when you need a snapshot)

Use this level only if you want to **save logs to a file** (for later reading, comparing runs, or attaching to an issue).
These commands do not change your shard — they only capture output.

>**📝 NOTE**  
Commands with `-f` stream forever. If you use them, stop with **Ctrl+C**.

**A. Save a “last N lines” snapshot (recommended)**

This captures the latest log output and exits immediately:

```bash
docker logs --tail 2000 rnode.bootstrap > rnode.bootstrap.log
docker logs --tail 2000 rnode.validator1 > rnode.validator1.log
```
>**💡 TIP**
Log files are created in your current terminal directory.
If you want them inside the repo, run this first:
```bash
cd ~/Documents/GitHub/f1r3node/docker
```
**B. Capture live logs to a file (streaming)**
Run one stream at a time. Stop with Ctrl+C when you have enough:

Bootstrap (live):
```bash
docker logs -f rnode.bootstrap > rnode.bootstrap.live.log
```
Validator (live):
```bash
docker logs -f rnode.validator1 > rnode.validator1.live.log
```
>📝 **NOTE**  
`docker logs -f ...` streams forever. Your terminal will look “stuck” because it’s waiting for new log lines.  Stop streaming with **Ctrl+C**.
>👉 **NEXT** **§5 Health Checks** — Proving Your Shard is Alive

## 5. Health Checks — Proving Your Shard is Alive

Logs are great for humans, but health checks are what you automate and trust in scripts.
In this section you’ll confirm that the shard is reachable and reporting a sane network view.

>**📝 NOTE**
Most commands here are one-shot (they finish immediately) and can be run in any terminal tab.
The only “looks stuck” commands are the ones with -f (follow/stream) — those are covered in §4.

### Level 1 — Minimal check (recommended baseline)

**A. Bootstrap status (canonical)**
Run:
```bash
curl -s http://127.0.0.1:40403/status && echo
```
>**📝 NOTE**
`/health` may return `404` on this Docker setup. Treat `/status` as the canonical health check.

Expected output shape:
```json
{"address":"rnode://...@rnode.bootstrap?protocol=...&discovery=...","version":"F1r3fly Node ...","peers":<N>,"nodes":<N>}
```
What “healthy” means here:
- You get valid JSON (not an empty response)
- peers and nodes are non-zero (values may vary slightly during startup).
>**💡 TIP**
`40403`is the default HTTP API port for the bootstrap node in the Docker setup (unless your compose/env overrides it).

**B. Quick “is it stable?” sample (optional)**
Run a few samples to make sure it’s consistently responding:
```bash
for i in 1 2 3; do
  echo "Sample $i:"
  curl -s http://127.0.0.1:40403/status && echo
  sleep 3
done
```
### Level 2 — Confirm what’s running and which port to query

**A. Confirm containers are up**
This works from anywhere:
```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | egrep "rnode\." || true
```
Expected: rnode.bootstrap and validators are Up ...
If you started an observer, you’ll also see rnode.readonly.

**B. Compose view (works only with a compose file)**
If you are already in `f1r3node/docker:`
```bash
pwd
ls
docker compose ps
```
If you are not in `f1r3node/docker`, always specify `-f`:
```bash
docker compose -f ~/Documents/GitHub/f1r3node/docker/shard-with-autopropose.yml ps
```
>**📝 NOTE**
If you run docker compose ps from the repo root (or any other directory), you may see:
no configuration file provided: not found
This is not a shard failure — it’s just Compose not knowing which file to use.

**C. Observer status (optional)**
If you started the observer, it may expose HTTP on a different host port. **Do not assume 40453** — read the published port from docker ps.
Query it directly:
```bash
# Find the observer's published port
docker ps --format "table {{.Names}}\t{{.Ports}}" | egrep "rnode\.readonly|observer|PORTS" || true

# Example: if Docker shows 0.0.0.0:40453->40403/tcp, then:
curl -s http://127.0.0.1:<OBSERVER_PORT>/status && echo
```
Expected output shape is the same (address will reference rnode.readonly).

### Level 3 — Scriptable gating (use before deploys/tests)

**A. Wait until the shard reports non-zero peers**
Use this to gate deploys or tests:
```bash
until curl -s http://127.0.0.1:40403/status | grep -q '"peers":[1-9]'; do
  echo "Waiting for shard peers..."
  sleep 3
done
echo "OK: shard reports non-zero peers."
```
If you prefer to gate on nodes instead:
```bash
until curl -s http://127.0.0.1:40403/status | grep -q '"nodes":[1-9]'; do
  echo "Waiting for shard nodes..."
  sleep 3
done
echo "OK: shard reports non-zero nodes."
```
### Optional: /health endpoint (availability may vary)
Some builds expose a simple health probe:
```bash
curl -s http://127.0.0.1:40403/health && echo
```
If it returns something like:

```json
{"status":"OK"}
```
— great. If it returns `empty/404`, don’t worry: **use /status as the canonical health check** for this Docker workflow.

### Quick diagnosis if a health check fails
- Connection refused / no response → shard not running or wrong port
- Check containers: `docker ps | egrep "rnode\."`
- Compose commands fail (e.g., “no configuration file”) → you’re in the wrong directory or missing `-f`
- Status responds but deploys later hang → verify block production via logs (§4), and confirm autopropose is enabled.

>**⚠️ WARNING** Don’t proceed to contract deploys until /status returns valid JSON consistently.

>**👉 NEXT** **§6 First Verification Action** — deploy a minimal contract to prove the shard is not only alive, but executing code.

## 6. First Verification Action — Deploy “Hello, Shard!”

You’ve launched your shard and confirmed /status responds. Now the goal is to prove code execution on the shard by deploying a minimal Rholang program and observing its output.

### What we can verify right now (without repo changes)

At minimum, you can confirm:
- the shard is up (docker ps shows bootstrap + validators);
- the HTTP API responds (/status returns JSON);
- the nodes connect over time (peers/nodes become non-zero after a short wait).

That’s already a meaningful “it’s alive” proof.

### Where deploy verification currently blocks

>**🚨 DEV-CHECK** The repository’s Docker-based Rholang CLI path is currently blocked in a clean checkout:
docker/rholang-cli/Dockerfile tries to copy rosette/build.out/src/rosette, but this path is not present. As a result, docker build ... fails and the f1r3node-rholang-cli image is not created.
Until the repo provides a build artifact for Rosette at a stable path (or the Dockerfile is updated), we cannot run the documented rholang-cli deploy flow without applying a local workaround.

### Level 1 — Minimal proof the shard is healthy (baseline)

Run from `f1r3node/docker:`
```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | egrep "rnode\." || true
```
Then check status:
```bash
curl -s http://127.0.0.1:40403/status && echo
```
If you see valid JSON but peers/nodes are 0, wait a bit and retry:
```bash
sleep 15
curl -s http://127.0.0.1:40403/status && echo
```
Expected: eventually peers and nodes become non-zero.

>**📝 NOTE**
Early “connection refused / lookup / handshake” log lines can appear during the first seconds after startup. What matters is that the network stabilizes and /status responds consistently.


### Level 2 — Prepare the “Hello, Shard!” contract (local file)

Create a minimal Rholang file in f1r3node/docker (same directory you run Compose from):
```bash
cd ~/Documents/GitHub/f1r3node/docker

cat > hello.rho <<'RHO'
new stdout(`rho:io:stdout`) in {
  stdout!("Hello, Shard!")
}
RHO

sed -n '1,20p' hello.rho
```
Expected output is exactly the contract body.

>**📝 NOTE**
This step only creates a file. It does not deploy anything yet.

### Level 3 — Deploy the contract (blocked path)

The intended Docker workflow is to build and run the rholang-cli container and deploy `hello.rho` via the HTTP API.
However, on a clean repository checkout, the image build currently fails:
```bash
cd ~/Documents/GitHub/f1r3node

docker build -t f1r3node-rholang-cli -f docker/rholang-cli/Dockerfile .
```
Expected result right now: the build fails at:
- COPY rosette/build.out/src/rosette /usr/local/bin/rosette

because `rosette/build.out/src/rosette `does not exist.

>**🚨 DEV-CHECK** Repo fix required (to unblock deploy verification in docs):
Either (1) add a build step that produces the Rosette binary at a stable path, or (2) update the Dockerfile to copy the correct existing Rosette artifact.
What the validator can still confirm (even while deploy is blocked)
While the deploy toolchain is blocked, the validator can still verify:
	1.	shard launches from f1r3node/docker/shard-with-autopropose.yml
	2.	containers stay Up (no restart loop)
	3.	/status returns JSON consistently
	4.	peers/nodes become non-zero after a short wait

**Optional log snapshot for evidence:**
```bash
docker logs --tail 200 rnode.bootstrap | egrep -i "All tasks started|Engine initialization completed|panic|error" || true
docker logs --tail 200 rnode.validator1 | egrep -i "All tasks started|Engine initialization completed|panic|error" || true
```
>**📝 NOTE**
The deploy step is a “proof of execution”. The shard health checks above are a “proof of life”. For this repo state, we can fully prove “life”, but “execution” requires the repo to unblock the CLI path.
>**👉 NEXT**
**§7 Common Pitfalls & Fixes** — compact list of the most common startup failures and what to do.

## 7. Common Pitfalls & Fixes

Even with clear steps, developers will hit errors. Don’t panic — most issues are predictable and easy to fix. This section is your quick troubleshooting guide.

### Level 1 — Quick Wins (Environment & Path)

#### node not reachable / connection refused
Most common causes: shard is not running, wrong port, or containers didn’t finish startup.

✅ Verify shard status:
```bash
curl -s http://127.0.0.1:40403/status && echo
```
✅ Verify containers are Up:
```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | egrep "rnode\." || true
```
✅ If /status returns JSON but peers/nodes are 0 — wait ~10–20s and retry:
```bash
sleep 15
curl -s http://127.0.0.1:40403/status && echo
```
#### cargo: command not found
✅ Rust toolchain is not installed (or not on PATH).

Fix: install Rust using rustup and re-run:
```bash
Install Rust via rustup (see rustup.rs)
```
>**NOTE:** “Restart your terminal after install”.

#### No such file or directory (your `rho file`)
✅ Wrong path (relative path from the wrong directory is the classic culprit).

Fix checklist:
- confirm you are in the expected directory (pwd)
- confirm the file exists (`ls -la <path>`)
- prefer an absolute path if unsure

Example:
```bash
pwd
ls -la ./hello.rho
```
>**💡 TIP**
Most Level 1 issues are setup-related. Fix them once, and you’ll rarely see them again.

### Level 2 — Language & Syntax Errors (Rholang)

#### Unbound name / missing new
Example of a typical mistake:
```rholang
stdout!("hi")     // ❌ Unbound name 'stdout'
```
Correct pattern:
```rholang
new stdout(`rho:io:stdout`) in {
  stdout!("hi")   // ✅ OK
}
```
#### Brace/paren mismatch
If you see parse errors around } / ):
	•	re-check nesting
	•	start from a minimal hello contract and expand gradually

>**📝 NOTE**
Rholang errors are often “one missing bracket” problems. Reduce to the smallest reproducible snippet first.

### Level 3 — Advanced Issues (Deployment & Execution) — DEV-CHECK gated

>**⚠️ WARNING**
This section is intentionally gated by 🚨 **DEV-CHECK** until the canonical deploy toolchain (CLI/API + required artifacts) is reproducible on a clean machine.
Do not treat these as “fixes” yet — treat them as known issue categories + what to collect.

#### Deploy does not complete / deploy tooling not reproducible

Symptom: you cannot reliably submit a deploy and verify it was included in a block.

>**🚨DEV-CHECK !**
Confirm the canonical deploy workflow for this repository and shard setup:
- What exact tool is supported (Rust client? rholang-cli container? direct HTTP API?)
- From which repo/path?
- Minimal end-to-end command sequence that works on a clean machine.

What the validator should capture:
- exact command(s) used
- exact error output
- repo revision (commit hash)
- OS + Docker + Compose versions
- whether autopropose profile is enabled (which compose file)

#### “Autopropose not running / block production assumptions”

Symptom: shard is up, /status responds, but there is no confirmed proof that blocks are being produced (because deploy path is blocked).

>**🚨DEV-CHECK !**
Do not assert “deploy pending” / “not included in block” behavior until we have a verified deploy submission path.

#### What we can verify today (safe, already validated):
- containers are stable: docker ps | egrep "rnode\."
- /status returns JSON consistently: curl -s http://127.0.0.1:40403/status && echo
- startup markers in logs (§4): “All tasks started” / “Engine initialization completed”


#### Registry lookup / capability issues (concept-only for now)

Symptom: registry-based interactions fail or appear to “do nothing” (lookup returns nothing, or capability usage has no effect).

>**🚨DEV-CHECK !**
Do not include code snippets (e.g., registryLookup!(...)) until confirmed against:
- the canonical contract/deploy workflow, and
- a running shard where deploys can be executed and observed.

What the validator should capture once deploy works:
- exact registry name used
- shard context / shard id (if applicable)
- signing key used for register vs lookup
- expected effect (stdout? state change?) and where it should be observed (logs/API)

#### Endpoint / API assumptions (Observer + deploy status APIs)

Symptom: docs mention endpoints like /api/deploy/<id> or observer ports (e.g., 40453) that may not be exposed in this repo setup.

>**🚨DEV-CHECK !**
Any observer endpoints/ports must be derived from the repo Compose config and verified via docker ps port publishing.
Do not hardcode ports/endpoints in this Level 3 section until verified.

What the validator should capture:
- docker ps --format "table {{.Names}}\t{{.Ports}}" output for observer container (if used)
- which HTTP endpoints are actually available (curl output + status codes)

#### “Key/signature” and identity-dependent failures (deferred)

Symptom: invalid signature / rejected deploy / key mismatch scenarios.

>**🚨DEV-CHECK !**
Do not document key/signature “fixes” until the canonical deploy tool confirms how keys are provided (.env, flags, keystore) in this repo.

What the validator should capture (once deploy is possible):
- which key input method is used
- full error text
- whether the same key is used across register/lookup flows

### Troubleshooting Workflow (Cheat Sheet)

1️⃣ Environment → shard running, containers Up, /status responds.
2️⃣ Startup markers → “All tasks started / Engine initialization completed” in logs (§4).
3️⃣ (Later) Deploy path → only after the repo-side deploy tooling is fixed (see DEV-CHECK above).

### Success Checklist
- Shard is running (docker ps shows bootstrap + validators Up)
- /status returns valid JSON consistently
- Startup markers confirmed in logs

>**👉 NEXT**
**§8 Shut Down & Clean Up** — how to gracefully stop and reset your shard.

## 8. Shut Down & Clean Up — Stopping Your Shard Safely

At some point, you’ll want to stop your shard: you’re done testing, you need a clean reset, or you just want to free resources. This section shows the safe, reproducible shutdown path — and what “wipe” actually means in this Docker Compose setup.

>**📝 NOTE**
All commands below assume you are in: `f1r3node/docker`
If you’re elsewhere — either cd into that directory or use full paths.
### Level 1 — Quick Path (Stop / Wipe / Restart)

#### A. Stop containers (keep state)
```bash
cd ~/Documents/GitHub/f1r3node/docker
docker compose -f shard-with-autopropose.yml down --remove-orphans
```
#### B. Stop containers + wipe volumes (full reset)
```bash
cd ~/Documents/GitHub/f1r3node/docker
docker compose -f shard-with-autopropose.yml down -v --remove-orphans
```
>**⚠️ WARNING**
down -v removes Docker volumes for this Compose stack. This resets your shard to a fresh state (genesis).

#### C. Restart cleanly
```bash
cd ~/Documents/GitHub/f1r3node/docker
docker compose -f shard-with-autopropose.yml up -d --force-recreate
sleep 10
curl -s http://127.0.0.1:40403/status && echo
```
### Level 2 — Standard Walkthrough (Clean, Verifiable, No Surprises)

#### 1. Optional: save a shutdown log snapshot before stopping containers
If you want logs for debugging or reporting, capture them before down.
(After down, containers may be removed and docker logs ... will fail with “No such container”.)
```bash
cd ~/Documents/GitHub/f1r3node/docker

docker logs --tail 2000 rnode.bootstrap  > rnode.bootstrap.shutdown.log
docker logs --tail 2000 rnode.validator1 > rnode.validator1.shutdown.log
docker logs --tail 2000 rnode.validator2 > rnode.validator2.shutdown.log
docker logs --tail 2000 rnode.validator3 > rnode.validator3.shutdown.log
```
>**📝 NOTE**
If you’ve already stopped/removed containers, log capture is no longer possible via docker logs. That is expected.

#### 2. Stop the shard (preserve data)
```bash 
cd ~/Documents/GitHub/f1r3node/docker
docker compose -f shard-with-autopropose.yml down --remove-orphans
```
#### 3. Confirm shutdown
```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | egrep "rnode\." || true
```
Expected: no output (no rnode.* containers running).

#### 4. If you started the observer, stop it too (optional)
```bash
cd ~/Documents/GitHub/f1r3node/docker
docker compose -f observer.yml down --remove-orphans
```
>**📝 NOTE**
If observer was not running, Compose may print something like “No resource found to remove…”. That’s normal.

#### 5. Full reset (wipe volumes) — when you truly want a clean slate
```bash
cd ~/Documents/GitHub/f1r3node/docker
docker compose -f shard-with-autopropose.yml down -v --remove-orphans
```
>**⚠️ WARNING**
Wiping volumes resets your shard state. Previous blocks/contracts/state are not preserved.

#### 6. Restart after wipe
```bash
cd ~/Documents/GitHub/f1r3node/docker
docker compose -f shard-with-autopropose.yml up -d --force-recreate
sleep 10
curl -s http://127.0.0.1:40403/status && echo
```
### Level 3 — Selective Cleanup (Advanced, Verified)

Sometimes you want to restart one validator without resetting the whole shard.

#### 1. Confirm the actual Compose service names (do not guess)
```bash
cd ~/Documents/GitHub/f1r3node/docker
docker compose -f shard-with-autopropose.yml config --services
```
Expected service names (example): `boot, validator1, validator2, validator3`
Use service names (like `validator2`) — not container names (like `rnode.validator2`) — for docker compose commands.

#### 2. Restart a single validator (example: validator2)
```bash
cd ~/Documents/GitHub/f1r3node/docker

docker compose -f shard-with-autopropose.yml stop validator2
docker compose -f shard-with-autopropose.yml rm -f validator2
docker compose -f shard-with-autopropose.yml up -d validator2
```
>**📝 NOTE**
This does not wipe chain state. It only recreates the validator container.

Checklist for safe cleanup
- Containers stopped (no rnode.* in docker ps).
- (Optional) Logs saved before shutdown.
- Either:
  - state preserved (down without `-v`), or
  - state wiped (down `-v`) for a clean reset.
- If observer was used, it’s stopped too.

>**👉 NEXT**
**§9 Artifacts Capture Checklist** — one-pass checklist to capture commands, logs, and screenshots for a fully reproducible shard run.

## 9. Artifacts Capture Checklist — One-Pass Run

This checklist ensures you capture all essential artifacts in a single run of your shard. Use it for QA, documentation validation, and onboarding.

> 📝 **NOTE**
>All commands below assume you are running from `f1r3node/docker` (the canonical LTR path used throughout Part I).

### Environment (sanity checks)

✅ Docker:
```bash
docker version
```
✅ Docker Compose:
```bash
docker compose version
```
✅ Repo location (must be inside `f1r3node/docker`):
```bash
cd ~/Documents/GitHub/f1r3node/docker
pwd
ls
```
>**🚨 DEV-CHECK !**
Deploy tooling (Rust client / rholang-cli / API deploy endpoints) is not yet reproducible end-to-end on a clean machine due to a repo-side blocker (see Part I §6/§7 DEV-CHECK notes).
This checklist captures a verified shard run + observer + logs. Deploy artifacts are intentionally gated.

### Clean start (optional but recommended)

Stop the shard (if running) and remove orphan containers:
```bash
docker compose -f shard-with-autopropose.yml down --remove-orphans
```
Full reset (also wipes volumes for this compose stack):
```bash
docker compose -f shard-with-autopropose.yml down -v --remove-orphans
```
### Launch shard (canonical)

Start the shard:
```bash
docker compose -f shard-with-autopropose.yml up -d --force-recreate
sleep 10
```
Verify containers are up:
```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | egrep "rnode\." || true
```
Verify /status is responding:
```bash
curl -s http://127.0.0.1:40403/status && echo
```
If peers/nodes are 0 right after startup — wait and retry:
```bash
sleep 15
curl -s http://127.0.0.1:40403/status && echo
```
### Confirm startup markers (bootstrap + one validator)
Bootstrap:
```bash
docker logs --tail 300 rnode.bootstrap | egrep -i "All tasks started|Engine initialization completed|error|panic" || true
```
Validator (example: validator1):
```bash
docker logs --tail 300 rnode.validator1 | egrep -i "All tasks started|Engine initialization completed|error|panic" || true
```
✅ Expected (happy path):
- All tasks started. Node is now running.
- Engine initialization completed successfully

### Observer (optional, read-only)
Start observer:
```bash
docker compose -f observer.yml up -d
```
>**📝 NOTE**
You may see a warning about “orphan containers” when running observer.yml while the shard is up. This is expected and does not indicate a failure.

Find the observer’s published ports:
```bash
docker ps --format "table {{.Names}}\t{{.Ports}}" | egrep "rnode\.readonly|observer|PORTS" || true
```
✅ Example output shape (your port may differ):
	•	`0.0.0.0:40453->40403/tcp` (host `40453` maps to the observer HTTP API)

Query observer /status using the actual port from docker ps:
```bash
curl -s http://127.0.0.1:40453/status && echo
```
>**📝 NOTE**
Do not paste placeholders like <OBSERVER_PORT> into the terminal — shells interpret <...> as redirection syntax.
Either:
- use the real port you see in docker ps, or
- set a variable:
```bash
OBSERVER_PORT=40453
curl -s "http://127.0.0.1:${OBSERVER_PORT}/status" && echo
```
✅ Expected:
- JSON output shape is the same as bootstrap /status
- the returned address references rnode.readonly
- 
### Capture logs (while containers are still running)
Save “last N lines” snapshots:
```bash
docker logs --tail 2000 rnode.bootstrap  > rnode.bootstrap.run.log
docker logs --tail 2000 rnode.validator1 > rnode.validator1.run.log
docker logs --tail 2000 rnode.validator2 > rnode.validator2.run.log
docker logs --tail 2000 rnode.validator3 > rnode.validator3.run.log
```
>**📝 NOTE**
Capture logs before shutting down containers.
If you run down first, docker logs ... will fail with “No such container”.
### Shutdown / reset (verified)

Graceful stop (keeps volumes):
```bash
docker compose -f shard-with-autopropose.yml down --remove-orphans
```
Full reset (wipes volumes for this compose stack):
```bash
docker compose -f shard-with-autopropose.yml down -v --remove-orphans
```
Observer shutdown (only if you started observer):
```bash
docker compose -f observer.yml down --remove-orphans
```
>**📝 NOTE**
If observer was never started, docker compose -f observer.yml down ... may print:
Warning: No resource found to remove for project ...
That is expected and safe to ignore.

###  Optional: prove Compose service names (useful for selective ops)

List services defined by this Compose file:
```bash
docker compose -f shard-with-autopropose.yml config --services
```
✅ Example output shape:
- boot
- validator1
- validator2
- validator3
### Optional: selective validator recycle (verified)

Stop one validator (service name from `config --services`):
```bash
docker compose -f shard-with-autopropose.yml stop validator2
```
Remove the container:
```bash
docker compose -f shard-with-autopropose.yml rm -f validator2
```
Bring it back:
```bash
docker compose -f shard-with-autopropose.yml up -d validator2
```
### Security / redaction rules
>**📝 NOTE**
Always redact secrets in screenshots and logs before sharing:
- Use placeholders like `<PRIVATE_KEY>`, `<PUB_KEY>`,`<HOST`>
- Never paste real keys into documentation or PRs

### Security / redaction rules

>**📝 NOTE**
Always redact secrets in screenshots and logs before sharing:
- Use placeholders like `<PRIVATE_KEY>`, `<PUB_KEY>`, `<HOST>`
- Never paste real keys into documentation or PRs

---

### Transition — From Shard Launch to Smart Contracts

By the end of **Part I**, you have proven your shard is alive:
- Containers launched and stayed healthy (`docker ps` shows bootstrap + validators Up).
- `/status` returned JSON consistently.
- Logs showed clean startup markers (“All tasks started” / “Engine initialization completed”).
- (Optional) Observer started and responded on its published host port.

A shard without code is just an idle engine. To unlock its true potential, you’ll deploy Rholang contracts — contracts turn infrastructure into an application: state, logic, and interaction.

>**📝 NOTE**
This is documentation text. Do not paste this section into your terminal.

That is where **Part II** begins. You'll go from a blank shard to one that runs real processes, starting with the simplest "Hello, Shard!" contract and progressing toward advanced Rholang patterns.

👉 [NEXT Part II — Deploying Rholang Code to a Shard](./part-02-deploying-rholang-code-to-a-shard.md): hands-on guide to writing, deploying, and verifying smart contracts on your Firefly shard.