# Part I — Launching a Firefly Shard
> **Document status:** Evidence-based runbook (validated commands + expected outputs).
> **Last verified:** 2026-02-17 • **Repo/branch:** `<REPO>` @ `<BRANCH_OR_COMMIT>`
> **Prepared by:** Daria Bohdanova — Documentation Architect / Technical Writer
> **Validated & approved by:** `<VALIDATOR_NAME>` — `<ROLE>` • **Evidence:** terminal output + logs (+ screenshots where marked)
## Preface
Launching a shard is not just a step — it’s a milestone.  
It marks the beginning of your journey with Firefly: a moment when your own blockchain
universe comes to life on your machine. Think of a shard as a self-contained, isolated
world — your sandbox — where contracts run, state evolves, and logs tell the story
of what happened.

This guide follows Firefly’s onion model:

- **TL;DR for experts** — the minimal, copy–paste path to a running shard.
- **Standard walkthrough** — step-by-step instructions with explanations and sanity checks.
- **Deep dive** — optional advanced content (CLI details, multi-node/multi-shard setups, and future deployment options).

This chapter uses the canonical `system-integration` workflow to launch shards.  
Block production is driven by the **heartbeat** mechanism (the older “autopropose” terminology is deprecated).

We assume you:

- have basic familiarity with Docker and terminal commands;
- are running on Linux / macOS (recommended), or Windows via WSL2;
- want copy–paste commands and clear guardrails at every step.

On macOS, we recommend Homebrew Python + Poetry (some system Python builds may fail to create virtualenvs)

If prerequisites feel unclear — don’t worry.  
This chapter provides everything you need to launch a shard with confidence.
## TL;DR QuickStart (for experts)

Canonical shard launch uses the `system-integration` repo and `shardctl` (Scala stable).

### 0. Prereqs (macOS)

- Docker daemon reachable:
  ```bash
  docker info >/dev/null && echo "Docker daemon OK"
  ```
- Python + Poetry via Homebrew:
```bash
brew install python poetry
```
- Git installed (needed to clone repositories).
- Repo cloned locally (all commands below run from the system-integration repo root):
```bash
cd ~/Documents/GitHub/system-integration
```
> **📝 NOTE (macOS / Docker Desktop)**
> If you see `mountpoint ... is outside of rootfs`, Docker Desktop is failing on file bind-mounts into
> `/var/lib/rnode/*` while `/var/lib/rnode` is already bind-mounted to `./data/...`.
> **Workaround:** comment those file mounts in `compose/scala-shard.yml` and copy the required files into `data/<node>/`.

### 1. Install shardctl (one-time)
```bash
poetry install
poetry run shardctl --help | head -n 20
```
### 2. Clean start

```bash
poetry run shardctl down || true
poetry run shardctl reset -y
```
>**📝 NOTE**
>shardctl reset -y wipes ./data/ (blockchain state + node data directories).
>If you use the macOS workaround (Step 3) and copy files into data/<node>/, run Step 3 >again after every reset.

### 3. macOS workaround: disable file mounts in compose/scala-shard.yml
Back up the compose file:
```bash
cp compose/scala-shard.yml compose/scala-shard.yml.bak.macos
```
Comment file bind-mounts from `../certs`, `../conf`, and `../genesis` into `/var/lib/rnode/...`:
```bash
perl -i -pe 's|^(\s*-\s*\.\./certs/.*\.pem:/var/lib/rnode/.*)$|# $1|g' compose/scala-shard.yml
perl -i -pe 's|^(\s*-\s*\.\./conf/.*:/var/lib/rnode/.*)$|# $1|g' compose/scala-shard.yml
perl -i -pe 's|^(\s*-\s*\.\./genesis/.*:/var/lib/rnode/genesis/.*)$|# $1|g' compose/scala-shard.yml
```
Copy required files into node data directories:
```bash
mkdir -p data/rnode.bootstrap data/rnode.validator1 data/rnode.validator2 data/rnode.validator3 data/rnode.readonly
mkdir -p data/rnode.bootstrap/genesis data/rnode.validator1/genesis data/rnode.validator2/genesis data/rnode.validator3/genesis data/rnode.readonly/genesis

cp certs/bootstrap/node.key.pem          data/rnode.bootstrap/node.key.pem
cp certs/bootstrap/node.certificate.pem  data/rnode.bootstrap/node.certificate.pem
cp certs/validator1/node.key.pem         data/rnode.validator1/node.key.pem
cp certs/validator1/node.certificate.pem data/rnode.validator1/node.certificate.pem
cp certs/validator2/node.key.pem         data/rnode.validator2/node.key.pem
cp certs/validator2/node.certificate.pem data/rnode.validator2/node.certificate.pem
cp certs/validator3/node.key.pem         data/rnode.validator3/node.key.pem
cp certs/validator3/node.certificate.pem data/rnode.validator3/node.certificate.pem

cp conf/bootstrap-ceremony.conf data/rnode.bootstrap/rnode.conf
cp conf/shared-rnode.conf       data/rnode.validator1/rnode.conf
cp conf/shared-rnode.conf       data/rnode.validator2/rnode.conf
cp conf/shared-rnode.conf       data/rnode.validator3/rnode.conf
cp conf/observer.conf           data/rnode.readonly/rnode.conf

cp conf/logback.xml data/rnode.bootstrap/logback.xml
cp conf/logback.xml data/rnode.validator1/logback.xml
cp conf/logback.xml data/rnode.validator2/logback.xml
cp conf/logback.xml data/rnode.validator3/logback.xml
cp conf/logback.xml data/rnode.readonly/logback.xml

cp -R genesis/* data/rnode.bootstrap/genesis/
cp -R genesis/* data/rnode.validator1/genesis/
cp -R genesis/* data/rnode.validator2/genesis/
cp -R genesis/* data/rnode.validator3/genesis/
cp -R genesis/* data/rnode.readonly/genesis/
```
### 4. Launch the shard (Scala stable + Shard topology)
```bash
poetry run shardctl up f1r3node
```
When prompted:
- choose **1 (Scala, stable)**
- choose **2 (Shard)**
### 5. Verify readiness (success criteria)
```bash
poetry run shardctl wait
```
*Expected (happy path): All 5 node(s) ready.*
Confirm containers:

```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | egrep "rnode\." || true
```
Check the status endpoint (validator1 API):
```bash
curl -s http://localhost:40413/status && echo
```
*Expected: valid JSON with address, version, and non-zero peers/nodes.*
### 6. Stop the shard
```bash
poetry run shardctl down f1r3node
```
Sanity check (no `rnode.*` containers should be running):
```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | egrep "rnode\." || echo "OK: no rnode containers running"
```
>**👉 NEXT:**
**§1 Introduction** — What is a shard and why it matters




## 1. Introduction — What is a shard and why it matters

When you launch Firefly, you are not starting a “big chain in the sky.”
You are starting your own shard — a local blockchain instance that runs independently and behaves like a small self-contained network on your machine.

In this guide, a shard is launched via the canonical system-integration + shardctl workflow (Scala node, stable).
In Shard topology, shardctl brings up a small node set (bootstrap + validators + observer) so you can test realistic multi-node behavior locally.

Think of a shard as a sandboxed universe:
- It has its own node processes, networking, and logs.
- It can run contracts in isolation.
- It can be restarted, wiped, and re-launched safely while you iterate on configs and docs.

Block production is driven by **heartbeat** — so once the shard is healthy, it will keep progressing without any “autopropose” setup (that terminology is deprecated in Firefly docs).

Why is this important?
- **For developers** — a shard is your personal testbed: you can deploy Rholang, observe outcomes, and reset state safely.
- **For operators** — shards are building blocks of Firefly’s multi-shard network: each shard can be managed and evolved independently.

>**💡 TIP**
>>If you come from Web2, think of a shard like a local dev environment you spin up for testing.
In Web3, that “environment” is a small blockchain network you control.

>**📝 NOTE**
You don’t need to understand consensus yet. In Part I your goal is simple: launch the shard and confirm it responds consistently (for example via the `/status endpoint`).

> **👉 NEXT** **§2 Prerequisites** — What you must have in place before touching configs or launch commands.


## 2. Prerequisites

Before launching a shard, make sure your environment is ready for the canonical workflow:
- Docker daemon is reachable (Docker Desktop / Linux Docker engine). 
- Git is installed (to clone/update repositories).
- Python 3 + Poetry are installed (required to run shardctl).
- On macOS, Homebrew is the simplest route; on Linux/WSL use your package manager.

All commands below assume you are in the system-integration repo root:
```bash
cd ~/Documents/GitHub/system-integration
```
### Validate tooling (recommended)
Check Docker:
```bash
docker info >/dev/null && echo "OK: Docker daemon reachable"
```
Install Python dependencies and confirm shardctl is available:
```bash
poetry install
poetry run shardctl --help | head -n 20
```
### Validate the shard Compose file loads (recommended)

Parse the canonical shard compose with the repo’s `env-file`:
```bash
docker compose --env-file .env.node -f compose/scala-shard.yml config >/dev/null
echo "OK: compose config parsed"
```
>**📝 NOTE**
>If you run docker compose … config without --env-file .env.node, Compose may warn that `VALIDATOR*_KEY` variables are not set. That’s expected — the canonical workflow loads .env.node.

>**📝 NOTE**
>If this check fails, the most common causes are: running from the wrong directory, missing .env.node, YAML edits that broke indentation, or missing files referenced by the compose config.

>**👉 NEXT** **§3 Launching the Shard** — the actual “go” button.





## 3. Launching the Shard — The “Go” Button

At this point you already have a working TL;DR path.
This section exists for repeatable start/stop, plus the most common gotcha: running commands from the wrong repo root.

>**📝 NOTE** All commands below must be executed from the system-integration repo root.

###  Make sure you are in the correct directory (required)
```bash
cd ~/Documents/GitHub/system-integration
pwd
ls
```
Expected: you see `compose/`, `conf/`, `genesis/`, `.env.node`, and `pyproject.toml`.

### Validate Compose loads with the expected env file (recommended)

This prevents “mystery warnings” about missing validator keys later.
```bash
docker compose --env-file .env.node -f compose/scala-shard.yml config >/dev/null \
  && echo "OK: compose config parsed"
  ```
### Start the shard (repeatable)
```bash
poetry run shardctl up f1r3node
```
When prompted:
- choose **1 (Scala, stable)**
- choose **2 (Shard)**

### Wait until the shard is ready (success criteria)
```bash
poetry run shardctl wait
```
Expected: All 5 node(s) ready.

### Stop the shard (keeps data)
```bash
poetry run shardctl down f1r3node
```
### Clean reset (wipes blockchain state + node data directories)
```bash
poetry run shardctl down || true
poetry run shardctl reset -y
```
>**⚠️ WARNING**
`shardctl reset -y wipes ./data/.`
If you use the macOS workaround (copying files into data/<node>/), you must repeat Step 3 (macOS workaround) after every reset.

>**👉 NEXT §4 Observing Startup & Logs** — what “good” looks like, and what log noise you can ignore.



## 4. Observing Startup & Logs
Launching the shard is only half the job — now you confirm it is actually alive and behaving. In current documentation, we treat logs as signals (what matters) vs noise (what you can ignore).

>**✅ Readiness source of truth**
Your shard is considered ready when:
- all 5 `rnode.*` containers are **Up (healthy)**, and
- `curl -s http://localhost:40413/status` returns JSON with "nodes": 5.

`shardctl` wait is a convenience check and may be flaky on some runs. If Level 1 passes, you can proceed.

>**📝 NOTE** (anti-freeze rule)
Commands with -f stream logs and **never exit by themselves.**
Run only one streaming command at a time, and press Ctrl+C to stop it before running anything else.

### Level 1 — Quick check (no streaming, no hanging)

Use this when you just want a fast “is it alive?” answer.
These checks finish immediately and can be run from any terminal tab.

#### 1. Containers are up + healthy
```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | egrep "rnode\." || true
```
**Expected (happy path):**
- 5 containers listed: `rnode.bootstrap`, `rnode.validator1/2/3`, `rnode.readonly`
- each shows Up ... (healthy) (or health: starting during the first ~minute)

> **📝 NOTE (ports: avoid the 40413 vs 40412 trap)**
> - **40413** = HTTP status API (what you `curl`)
> - **40412** = gRPC API (what the Rust client uses for deploy in [Part II](./part-02-deploying-rholang-code-to-a-shard-system-integration.md))

#### 2. Status endpoint responds (validator1 HTTP API)
```bash
curl -s http://localhost:40413/status && echo
```
Expected (happy path):
	•	valid JSON (not empty)
	•	"nodes": 5 once the shard fully converges
	•	"peers" is typically non-zero (value may change while nodes connect)

>**📝 NOTE** (common early state)
Right after startup you may see health: starting in `docker ps`, and `/status` may briefly show fewer nodes/peers.
Give it a moment and re-run the two commands above.
**
>**✅ PASS criteria**
If all 5 rnode.* containers are Up (healthy) and /status returns JSON with "nodes": 5, your shard is ready for the next workflows (deploy, propose, log-based verification).

### Level 2 — `shardctl wait` (optional convenience check)

This check watches container logs and tries to detect a specific startup marker:
`Making a transition to Running state`.

> **⚠️ Important**
> `shardctl wait` is a convenience helper and can be **flaky** depending on log retention and the exact log marker emitted by the current node image.
> It may time out even when the shard is healthy.
> This usually happens when the expected log marker is **outside the log window** shardctl scans
> (for example, the nodes reached “Running state” earlier, but the marker is no longer in the last log lines).
> **Source of truth:** Level 1 (containers healthy + `/status` shows `"nodes": 5`).

Run from the `system-integration` repo root:

```bash
cd ~/Documents/GitHub/system-integration
poetry run shardctl wait
```
Expected (happy path):
- All 5 node(s) ready ...

If you get a timeout (e.g., Timeout ... not all nodes ready (0/5)):
- Do not treat it as a failure by itself.
- Re-check Level 1 readiness:
- `5 rnode.*` containers are Up (healthy)
- `curl -s http://localhost:40413/status` returns JSON with "nodes": 5

Optional: if you still want a log-based sanity check, search for any startup markers
(without relying on a single exact phrase):
```bash
docker logs rnode.bootstrap  | egrep -i "running|Engine initialization|Internal API server started|External API server started" | tail -n 50 || true
docker logs rnode.validator1 | egrep -i "running|Engine initialization|Peers:" | tail -n 50 || true
```
And quickly scan for fatal signals:
```bash
docker logs --tail 500 rnode.bootstrap  | egrep -i "panic|fatal|exception" || true
docker logs --tail 500 rnode.validator1 | egrep -i "panic|fatal|exception" || true
```
### Level 3 — Save logs (snapshots + streaming capture)

Use Level 3 only when you need a file artifact (for later review, comparing runs, or attaching to an issue).
These commands do not change the shard — they only capture output.

>**📝 NOTE (where files go)**
> `~/...` saves logs into your home directory (e.g., /Users/<you>/).
If you omit `~/,` files will be created in your current terminal directory.

#### A. Snapshot logs (recommended, exits immediately)
Captures the last N lines and exits. This is the safest “grab evidence and move on” option.
```bash
docker logs --tail 2000 rnode.bootstrap   > ~/rnode.bootstrap.log
docker logs --tail 2000 rnode.validator1  > ~/rnode.validator1.log
docker logs --tail 2000 rnode.validator2  > ~/rnode.validator2.log
docker logs --tail 2000 rnode.validator3  > ~/rnode.validator3.log
docker logs --tail 2000 rnode.readonly    > ~/rnode.readonly.log
```
Quick sanity check:
```bash
ls -lh ~/rnode.*.log
wc -l  ~/rnode.*.log | tail
```
Expected (happy path):
- files exist and have non-zero size
- `rnode.bootstrap.log / rnode.readonly.log` often show 2000 lines
- validators may show < 2000 lines if they have fewer log lines available (this is normal)

#### B. Aggregated shard logs via shardctl (recommended for full context)
This captures the combined output (all services) as seen through shardctl:
```bash
cd ~/Documents/GitHub/system-integration
poetry run shardctl logs f1r3node > ~/shardctl.f1r3node.log
```
Check:
```bash
ls -lh ~/shardctl.f1r3node.log
tail -n 50 ~/shardctl.f1r3node.log
```
#### C. Time-boxed “live logs” capture (optional)
Sometimes you want a short excerpt of the live stream without “freezing” your terminal.

Linux/WSL:
```bash
timeout 20s docker logs -f rnode.validator1 > ~/rnode.validator1.live.log || true
timeout 20s docker logs -f rnode.bootstrap  > ~/rnode.bootstrap.live.log  || true
```
macOS (default): install coreutils and use gtimeout:
```bash
brew install coreutils
gtimeout 20s docker logs -f rnode.validator1 > ~/rnode.validator1.live.log || true
gtimeout 20s docker logs -f rnode.bootstrap  > ~/rnode.bootstrap.live.log  || true
```
Verify:
```bash
ls -lh ~/rnode.*.live.log
tail -n 30 ~/rnode.validator1.live.log
tail -n 30 ~/rnode.bootstrap.live.log
```
>**📝 NOTE (anti-freeze rule still applies)**
`docker logs -f ...` streams forever unless you stop it.
`timeout/gtimeout` is what makes this safe in copy-paste docs.

>👉 **NEXT** **§5 Health Checks** — Proving Your Shard is Alive

## 5. Health Checks — Proving Your Shard is Alive

Health checks are for scripts and repeatability. This section confirms the shard is reachable and reports a sane network view.

>**📝 NOTE**
All commands below are one-shot (they exit immediately).
If you see an empty response, it usually means the shard is not running yet, or you’re querying the wrong port.

### Preconditions (Shard is running)

Run:
```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | egrep "rnode\." || true
```
Expected: 5 containers listed:
- `rnode.bootstrap`
- `rnode.validator1`
- `rnode.validator2`
- `rnode.validator3`
- `rnode.readonly`

If nothing is listed, start the shard:
```bash
cd ~/Documents/GitHub/system-integration
poetry run shardctl up f1r3node
poetry run shardctl wait || true
```
> **📝 NOTE** `shardctl` wait may time out on some runs. This is not a blocker — use Level 1 as the source of truth.
 

### Level 1 — Canonical health check (recommended baseline)

#### 1. Validator1 status (host HTTP)
```bash
curl -s http://localhost:40413/status && echo
```
Expected (healthy):
- valid JSON (not empty)
- "nodes": 5 once the shard converges
- "peers" is typically non-zero (may fluctuate during startup)

#### 2. Repeatability sample (optional, good for “no flakes”)
```bash
for i in 1 2 3; do
  echo "Sample $i:"
  curl -s http://localhost:40413/status && echo
  sleep 3
done
```
Pass criteria (Level 1):
- all 5 containers show Up (healthy), and
- `/status` returns JSON with "nodes": 5 consistently.

### Level 2 — Port sanity + “what am I actually querying?”

This prevents “wrong port” and “wrong node” confusion.

#### 1. Confirm validator1 port mapping (host ↔ container)
```bash
docker port rnode.validator1 | sort
```
Expected: your output should include a mapping for validator1 HTTP status:
- 40403/tcp -> ...:40413 (host :40413 serves GET /status)

#### Optional quick check (validator1):
```bash
curl -s http://localhost:40413/status && echo
```
#### 2. (Optional) Bootstrap status too (host HTTP)
On common default mappings, bootstrap is reachable at:
```bash
curl -s http://127.0.0.1:40403/status && echo
```
If `:40403/status` doesn’t work on another machine, verify the mapping first:
```bash
docker port rnode.bootstrap | sort
```
### Level 3 — Scriptable gating (use before deploys/tests)

#### 1. Gate on “nodes = 5” (recommended)
```bash
until curl -s http://localhost:40413/status | grep -q '"nodes":5'; do
  echo "Waiting for shard to converge to nodes=5..."
  sleep 3
done
echo "OK: shard reports nodes=5."
```
#### 2. Gate on “peers > 0” (optional)
```bash
until curl -s http://localhost:40413/status | grep -q '"peers":[1-9]'; do
  echo "Waiting for shard to report non-zero peers..."
  sleep 3
done
echo "OK: shard reports non-zero peers."
```
### Quick diagnosis (if a check fails)
- Empty response / connection refused → shard not running or wrong port
Run:
```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | egrep "rnode\." || true
docker port rnode.validator1 | sort
curl -s http://localhost:40413/status && echo
```
- Containers “healthy” but shardctl wait times out → not a blocker
Treat Level 1 as source of truth (this is normal sometimes).

>**👉 NEXT**
Proceed to the **§6. First Verification Action — Deploy “Hello, Shard!”**

## 6. First Verification Action — Deploy “Hello, Shard!”
At this point you have a shard running and Level 1 health checks pass (`rnode.*` containers are healthy and `/status` returns `"nodes": 5`).
This section is a smoke test: it checks that the deploy toolchain can reach the node’s gRPC endpoint and that the environment is ready to accept deploys.

What this smoke test can verify :
- the shard is up and stable (containers stay **Up (healthy)**);
- the HTTP status API responds (`/status` returns JSON and `"nodes": 5`);
- the **gRPC port** for deploy is reachable from the host (`validator1 40402/tcp -> host :40412`);
- you can attempt a deploy from the Rust client and get a clear success or a clear readiness blocker.

What this smoke test does NOT fully verify:
- deploy inclusion (“Included in block”);
- on-chain execution evidence (stdout in logs).

Those are covered end-to-end in [Part II](./part-02-deploying-rholang-code-to-a-shard-system-integration.md).

### Preconditions (must pass before any deploy attempt)
```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | egrep "rnode\." || true
curl -s http://localhost:40413/status && echo
```
Expected:
- 5 containers: 
  - `rnode.bootstrap`, 
  - `rnode.validator1/2/3`, 
  - `rnode.readonly`
- `/status` returns JSON with `"nodes": 5`
### Level 1 — Port sanity (HTTP vs gRPC)

Confirm `validator1` mappings (prevents “wrong port” mistakes):
```bash
docker port rnode.validator1 | sort
```
Expected (shape; host ports may vary):
- 40403/tcp -> ...:40413  (HTTP /status)
- 40402/tcp -> ...:40412  (gRPC deploy API)

### Level 2 — Prepare the “Hello, Shard!” contract (local file)

Create a minimal Rholang program in the Rust client repo:
```bash
cd ~/Documents/GitHub/rust-client

cat > rho_examples/hello_shard.rho <<'RHO'
new stdout(`rho:io:stdout`) in {
  stdout!("Hello, Shard!")
}
RHO

sed -n '1,20p' rho_examples/hello_shard.rho
```
Expected: it prints the contract body.

### Level 3 — Smoke deploy (Rust client → gRPC)

Attempt a deploy via `validator1` gRPC port (host :40412):
```bash
cd ~/Documents/GitHub/rust-client
cargo run --release -- deploy --host localhost --port 40412 --file ./rho_examples/hello_shard.rho
```
**Success case (PASS: deploy path is unblocked)**
Expected output includes:
- ✅ Deployment successful!
- 🆔 Deploy ID: <...>

**Guardrail**
Run get-deploy only if the deploy command returns a Deploy ID.

Known readiness blocker (may happen even when `/status` looks healthy)
If the deploy fails with:
 `Error: Could not deploy, casper instance was not available yet.`
treat it as an environment readiness issue (Casper not ready). Your shard can look healthy via `/status`, while deploy is still blocked.

### Optional evidence (only if you need a quick artifact for validation)

These do not prove execution, but they help capture what the environment looked like:
```bash
docker logs --tail 200 rnode.bootstrap  | egrep -i "Internal API server started|External API server started|Engine initialization|panic|fatal|exception" || true
docker logs --tail 200 rnode.validator1 | egrep -i "Internal API server started|External API server started|Engine initialization|panic|fatal|exception" || true
```
>**📝 NOTE**
If your deploy attempt is blocked (for example, casper instance was not available yet), follow the dedicated deploy runbook and troubleshooting steps in [Part II](./part-02-deploying-rholang-code-to-a-shard-system-integration.md), where the full “deploy → verify inclusion → verify results” workflow is documented.

>**👉 NEXT**
**§7 Common Pitfalls & Fixes** — compact list of the most common startup failures and what to do.

## 7. Common Pitfalls & Fixes

Even with clear steps, developers will hit errors. Don’t panic — most issues are predictable and have simple fixes. Use this section as a fast troubleshooting path.

>**🔎 DEEP DIVE (debug faster)**
Most failures fall into two buckets:
	1.	**Environment problems** — the shard never accepts your request (wrong port, node not ready, Docker issues).
	2.	**Contract logic problems** — the deploy lands, but expected reductions don’t happen (mismatched sends/receives, syntax).  ￼

### Level 1 — Quick Wins (Environment & Ports)

Use these first. They are the highest ROI fixes.

#### 1. “connection refused” / empty response / node not reachable
Most common causes: shard isn’t running yet, wrong port, or you’re querying the wrong node.
✅ Check containers
```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | egrep "rnode\." || true
```
✅ Canonical status check (validator1 host HTTP)
```bash
curl -s http://localhost:40413/status && echo
```
✅ If you’re unsure about ports: verify mappings
```bash
docker port rnode.validator1 | sort
docker port rnode.bootstrap  | sort
```
✅ Optional (bootstrap status)
Only if docker port `rnode.bootstrap` shows host `:40403` mapped to container `40403/tcp`:
```bash
curl -s http://127.0.0.1:40403/status && echo
```
If /status returns JSON but "nodes"/"peers" are low right after startup — wait and retry:
```bash
sleep 15
curl -s http://localhost:40413/status && echo
```
#### 2. shardctl wait times out (e.g., 0/5) but containers look healthy
This can happen because shardctl wait relies on specific log markers and can be flaky depending on log retention.

✅ Treat Level 1 as the source of truth:
- docker ps shows 5 rnode.* containers healthy
- `/status` returns JSON with "nodes": 5 on http://localhost:40413/status

Optional sanity scan for fatals:
```bash
docker logs --tail 500 rnode.bootstrap  | egrep -i "panic|fatal|exception" || true
docker logs --tail 500 rnode.validator1 | egrep -i "panic|fatal|exception" || true
```
#### 3. cargo: command not found
Rust toolchain is missing (or not on PATH).

Fix (install Rust via rustup), then restart the terminal:
```bash
curl https://sh.rustup.rs -sSf | sh
```
#### 4. “No such file or directory” for your .rho file
Classic culprit: you are in the wrong directory or using a wrong relative path.

Fix checklist:
```bash
pwd
ls -la ./rho_examples
ls -la ./rho_examples/hello_shard.rho
```
If unsure, use an absolute path to the file.

#### 5. Could not deploy, "casper instance was not available yet"
This is an **environment readiness issue**: the node can answer `/status`, but Casper is not ready to accept deploys yet.  
Quick actions:
- Wait a bit and retry deploy (a few minutes).
- If it keeps failing after several retries, restart the shard and retry.  ￼
Important guardrail: don’t run get-deploy unless deploy returned a real Deploy ID.

>**🧭 NOTE**
If you keep hitting “casper instance not available yet”, use the [Part II](./part-02-deploying-rholang-code-to-a-shard-system-integration.md) deploy workflow / troubleshooting (it’s the canonical place for end-to-end deploy verification and fixes).

### Level 2 — Language & Syntax Errors (Rholang)

These mean the tool can submit code, but the code itself is invalid.

#### 1. Unbound name / missing new
Example mistake:
```rholang
stdout!("hi")     // ❌ Unbound name 'stdout'
```
Correct pattern:
```rholang
new stdout(`rho:io:stdout`) in {
  stdout!("hi")   // ✅ OK
}
```
#### 2. Brace / paren mismatch
If you see parser errors near } / ):
- re-check nesting
- reduce to a minimal “Hello” contract first, then expand gradually

>**📝 NOTE**
Reduce to the smallest reproducible snippet — it saves hours.

### Level 3 — Advanced Issues (Deployment & Execution) — DEV-CHECK gated

>**⚠️ WARNING**
This level stays gated by **🚨 DEV-CHECK** until the canonical deploy toolchain is reproducible on a clean machine. Treat these as “issue categories + what to capture”, not as guaranteed fixes.

#### 1. Deploy toolchain mismatch / “which deploy is canonical?”
Validate and capture:
- exact tool used (Rust client vs Rholang CLI container vs direct API)
- exact repo/path + commit hash
- OS + Docker versions
- which compose profile/file was used

#### 2. “Execution proof” gaps (deploy blocked / Casper not ready)
If deploy is blocked (e.g., Casper unavailable), capture:
- exact command
- full error output
- `docker ps + docker port rnode.validator1`
- `curl http://localhost:40413/status`

#### 3. Large deploy / heavy payload behavior (context)
Some workstreams mention large deploy payloads can create backpressure and stall nodes (worth capturing evidence when it occurs, not asserting behavior as fixed).  ￼

### Troubleshooting Workflow (Cheat Sheet)

1️⃣ Environment: containers Up (healthy) + `/status` returns JSON on http://localhost:40413/status
2️⃣ Ports: verify `docker port rnode.validator1` (don’t assume host ports)
3️⃣ Readiness: if deploy says Casper unavailable → wait/restart, then use [Part II](./part-02-deploying-rholang-code-to-a-shard-system-integration.md) canonical deploy workflow
4️⃣ Logic: only after deploy submission works, debug Rholang semantics/reductions

>**👉 NEXT**
**§8 Shut Down & Clean Up** — how to gracefully stop and reset your shard.

## 8. Shut Down & Clean Up — Stopping Your Shard Safely

This section shows the safe, reproducible shutdown path for the System Integration shard, and what “wipe” actually means in this setup.

>**📝 NOTE** (System Integration canonical)
These commands are written for the system-integration repo and shardctl workflow.
If you run raw docker compose commands, always point to the same compose file and env used by shardctl:
`./compose/scala-shard.yml + ./.env.node.`

### Level 1 — Quick Path (Stop / Wipe / Restart)

Use these when you want the shortest “do the thing” commands.

#### 1. Stop the shard (preserve state)
```bash
cd ~/Documents/GitHub/system-integration
poetry run shardctl down f1r3node
```
#### 2. Stop the shard + wipe state (full reset)
Use this when you truly want a clean slate.
```bash
cd ~/Documents/GitHub/system-integration
poetry run shardctl down f1r3node --volumes
```
>**⚠️ WARNING**
`--volumes` removes the Docker volumes for this shard stack. This resets the shard to a fresh state.

#### 3. Restart (only if you want to keep working)
Restart is not required for shutdown — it’s only for “stop → start again and continue testing”.
```bash
cd ~/Documents/GitHub/system-integration
poetry run shardctl up f1r3node
poetry run shardctl wait || true
```
### Level 2 — Standard Walkthrough (Clean, Verifiable, No Surprises)

Use this when you want evidence + a clean sequence.

#### 1. Optional: capture log snapshots (must be done before shutdown)
After down, containers may be removed and docker logs ... will fail.
```bash
docker logs --tail 2000 rnode.bootstrap   > ~/rnode.bootstrap.shutdown.log
docker logs --tail 2000 rnode.validator1  > ~/rnode.validator1.shutdown.log
docker logs --tail 2000 rnode.validator2  > ~/rnode.validator2.shutdown.log
docker logs --tail 2000 rnode.validator3  > ~/rnode.validator3.shutdown.log
docker logs --tail 2000 rnode.readonly    > ~/rnode.readonly.shutdown.log

ls -lh ~/rnode.*.shutdown.log
```
#### 2. Stop the shard (preserve state)
```bash
cd ~/Documents/GitHub/system-integration
poetry run shardctl down f1r3node
```
### 3. Confirm shutdown
```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | egrep "rnode\." || true
```
Expected: no output.

#### 4. Full reset (wipe volumes) — when you need a clean slate
Run this **instead of** (not after) a normal down when you need a wipe.
```bash
cd ~/Documents/GitHub/system-integration
poetry run shardctl down f1r3node --volumes
```
>**📝 NOTE**
If you already ran down and everything is gone, shardctl down ... `--volumes` may print “No containers found”.
That message is about containers, not a shard failure.

#### 5. Restart after wipe (optional)
```bash
cd ~/Documents/GitHub/system-integration
poetry run shardctl up f1r3node
poetry run shardctl wait || true
```
### Level 3 — Selective Actions (Advanced)

Use these only when you do not want to stop the entire shard.

🧠 Rule of thumb
- If you ran down, containers are removed — you cannot restart them individually.
- Selective restarts only make sense while the shard is running.

#### 1. Restart one container (example: validator2) — shard must be running
```bash
docker restart rnode.validator2
```
#### 2. Raw compose shutdown (same stack as shardctl)
Only use this if you intentionally want to bypass shardctl.
```bash
cd ~/Documents/GitHub/system-integration

docker compose --env-file ./.env.node \
  -f ./compose/scala-shard.yml down --remove-orphans
  ```
#### 3. Raw compose wipe (full reset)
```bash
cd ~/Documents/GitHub/system-integration

docker compose --env-file ./.env.node \
  -f ./compose/scala-shard.yml down -v --remove-orphans
  ```
### Checklist (what “done” looks like)
-`docker ps | egrep "rnode\."` shows nothing (shard stopped), and
- if you needed evidence, `~/rnode.*.shutdown.log` files exist, and
- you intentionally chose one:
  - preserve state: `shardctl down`
  - wipe state: `shardctl down --volumes`

>**👉 NEXT**
**§9 Artifacts Capture Checklist** — one-pass checklist to capture commands, logs, and screenshots for a fully reproducible shard run.


## 9. Artifacts Capture Checklist — One-Pass Run (System Integration)
This checklist captures a fully reproducible shard run (startup + health proof + logs + clean shutdown) in a single session. Use it for QA, doc validation, and onboarding.
>**📝 NOTE (canonical path)**
**Part I** uses the System Integration repository as the single source of truth.
All commands below assume:
- repo: `~/Documents/GitHub/system-integration`
- shard profile: `compose/scala-shard.yml`
- env: `.env.node`

>**🚨 DEV-CHECK**
End-to-end deploy verification is currently gated (Casper “not available yet” / canonical deploy workflow lives in [Part II](./part-02-deploying-rholang-code-to-a-shard-system-integration.md)).
This checklist captures a verified shard run + logs + port mappings. Deploy artifacts are intentionally excluded.

### Environment (sanity checks)

#### ✅ Docker:
```bash
docker version
```
#### ✅ Docker Compose:
```bash
docker compose version
```
#### ✅ Repo location (must be inside system-integration):
```bash
cd ~/Documents/GitHub/system-integration
pwd
ls
```
(Optional but useful) capture current repo revision:
```bash
git rev-parse HEAD
```
### Clean stop / clean slate (optional)

If you want to start from a known clean state:

#### A. Stop shard (preserve volumes)
```bash
cd ~/Documents/GitHub/system-integration
poetry run shardctl down f1r3node
```
#### B. Stop shard + wipe volumes (full reset)
```bash
cd ~/Documents/GitHub/system-integration
poetry run shardctl down f1r3node --volumes
```
>**📝 NOTE** If containers are already gone, shardctl may report “No containers found” — that’s OK.

### Launch shard (canonical)
Start:
```bash
cd ~/Documents/GitHub/system-integration
poetry run shardctl up f1r3node
```
Wait (timed; may be flaky — not a blocker):
```bash
cd ~/Documents/GitHub/system-integration
poetry run shardctl wait || true
```
Verify containers are up:
```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | egrep "rnode\." || true
```
Verify canonical /status (validator1 host HTTP):
```bash
curl -s http://localhost:40413/status && echo
```
If peers/nodes are low right after startup — wait and retry:
```bash
sleep 15
curl -s http://localhost:40413/status && echo
```
### Port mappings (capture to avoid “wrong port” confusion)
Validator1 port mapping (host ↔ container):
```bash
docker port rnode.validator1 | sort
```
Bootstrap mapping (optional reference):
```bash
docker port rnode.bootstrap | sort
```
Optional: bootstrap /status (only if mapping shows host :40403):
```bash
curl -s http://127.0.0.1:40403/status && echo
```
### Confirm startup markers (bootstrap + one validator)
Quick grep for “good” markers + fatal signals:
```bash
docker logs --tail 300 rnode.bootstrap  | egrep -i "All tasks started|Engine initialization completed|panic|fatal|exception" || true
docker logs --tail 300 rnode.validator1 | egrep -i "All tasks started|Engine initialization completed|panic|fatal|exception" || true
```
✅ Expected (happy path):
- startup markers may appear depending on log retention
- no `panic|fatal|exception` in the tail window

### Capture logs (while containers are still running)
Snapshot last N lines (recommended):
```bash
docker logs --tail 2000 rnode.bootstrap   > ~/rnode.bootstrap.run.log
docker logs --tail 2000 rnode.validator1  > ~/rnode.validator1.run.log
docker logs --tail 2000 rnode.validator2  > ~/rnode.validator2.run.log
docker logs --tail 2000 rnode.validator3  > ~/rnode.validator3.run.log
docker logs --tail 2000 rnode.readonly    > ~/rnode.readonly.run.log
```
Optional: capture aggregated shard logs via shardctl:
```bash
cd ~/Documents/GitHub/system-integration
poetry run shardctl logs f1r3node > ~/shardctl.f1r3node.run.log
```
Verify files exist:
```bash
ls -lh ~/rnode.*.run.log
ls -lh ~/shardctl.f1r3node.run.log 2>/dev/null || true
```
>**📝 NOTE**
Capture logs before shutdown. After down, docker logs ... will fail with “No such container”.


### Shutdown / reset (verified)
Graceful stop (keeps volumes):
```bash
cd ~/Documents/GitHub/system-integration
poetry run shardctl down f1r3node
```
Full reset (wipes volumes):
```bash
cd ~/Documents/GitHub/system-integration
poetry run shardctl down f1r3node --volumes
```
Confirm shard is stopped:
```bash
docker ps --format "table {{.Names}}\t{{.Status}}" | egrep "rnode\." || true
```
Expected: no output.

### Security / redaction rules

>**📝 NOTE**
Always redact secrets in `logs/screenshots` before sharing:
- use placeholders like <PRIVATE_KEY>, <PUB_KEY>, <HOST>
- never paste real keys into docs or PRs

## Transition — From Shard Launch to Smart Contracts

By the end of **Part I**, you have proven your shard is alive:
- containers launched and stayed healthy (docker ps shows `rnode.* Up`),
- `/status` returned JSON consistently (canonical: `http://localhost:40413/status`),
- port mappings were captured (`docker port ...`),
- logs were captured while containers were still running,
- shutdown was verified (`shardctl down + docker ps shows no rnode.*`).

>**🧭 NOTE**
Full deploy + inclusion verification is intentionally covered in [Part II](./part-02-deploying-rholang-code-to-a-shard-system-integration.md) (canonical workflow + troubleshooting).

In **Part II**, You'll go from a blank shard to one that runs real processes, starting with the simplest "Hello, Shard!" contract and progressing toward advanced Rholang patterns.

👉 [NEXT [Part II — How to Deploy Rholang Code to a Shard](./part-02-deploying-rholang-code-to-a-shard-system-integration.md) hands-on guide to writing, deploying, and verifying smart contracts on your Firefly shard.