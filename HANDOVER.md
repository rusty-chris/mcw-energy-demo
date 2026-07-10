# HANDOVER — MCWe / HydroPulse demo (`test-react`)

_For the agent (and Chris) picking this up on a new machine. Written 2026-07-08._

## What this is
A demo React dashboard, **"HydroPulse"**, that showcases the hydropower monitoring
methodologies of **Mike McWilliams** (mcw-e.com) to stakeholders — the goal is to make his
ideas legible and compelling, not just to display data. Two case-study modules so far:
**Tunnel Health** (Glendoe collapse) and **Bearing Health** (Neelum-Jhelum, Pakistan).

## Stack
Vite 4 · React 18 · React Router v6 · Tailwind CSS 3 · Recharts 3.9. ML side: Python +
Keras/TensorFlow (bearing LSTM in `ml/`).

## Repo & branch state
- GitHub: `git@github.com:rusty-chris/mcw-energy-demo.git` — **PUBLIC**.
- **Work on `chris-dev`.** `main` auto-deploys to Vercel → https://mcw-energy-demo.vercel.app
- At handover: working tree clean, everything committed & pushed.
  - `chris-dev` @ `8830f3d` (latest work)
  - `main` @ `bd6e2c3`
- **⚠️ `main` is 3 commits behind `chris-dev`.** The entire needle-valve tunnel rework lives on
  `chris-dev` only, so the live Vercel site does **not** show it yet. Merging `chris-dev → main`
  deploys to production — hold that until the tunnel data is confirmed with Mike (see Outstanding).

## New-machine setup
1. `git clone git@github.com:rusty-chris/mcw-energy-demo.git`
2. `npm install`
3. `npm run dev` (dev server) · `npm run build` (production) · `npm run lint`
- **Node version:** the old machine was pinned to Node 16.20.2 via nvm **only** because it ran
  Ubuntu 18.04 (glibc 2.27). That constraint does not apply on a modern OS — use Node 18 or 20.
  Vite 4 / React 18 run fine on 16/18/20. (You can drop the old `export PATH=...nvm...` dance.)

## ⚠️ Files that will NOT arrive via `git clone` — copy them across manually
These are gitignored and must be moved by USB / scp / cloud, or they're lost:

- **`domain_knowledge/`** — Mike's emailed review feedback and his **Appendix T expert-witness
  charts** (the real needle-valve-vs-head plots) plus his Asset Management Scale doc. This is the
  **source of truth for the tunnel methodology.** Gitignored deliberately — it's Mike's private
  material and the repo is public, so **keep it out of git.** Files:
  - `email_feedback.odt` — Mike's review + corrections
  - `App T 1-7 needle valve v head.pdf` — the real Appendix T charts (T1–T7)
  - `Asset Management Scale.docx` — 5-level maturity ladder (Break-and-Mend → ISO 55000)
- **`ml/lstm_model*.keras`, `ml/lstm_results.png`** — trained bearing model + plot. Regenerable via
  `ml/train_bearing_lstm.py` (which _is_ committed), but that needs the datasets below. Optional.
- **LSTM training datasets** — NASA IMS bearing data + Pakistan `vibration_data.csv`, currently in
  the old machine's session scratchpad, not the repo. Only needed to retrain. Optional.
- **Claude Code project memory** — old machine had notes under
  `~/.claude/projects/.../memory/`. This doc supersedes them; copy only if you want the raw notes.

## Key domain knowledge (get up to speed)

### Tunnel page — the big correction (most important thing to understand)
Mike reviewed the app and corrected the core physics:
- **Head/pressure is nearly BLIND to tunnel collapse** — a two-thirds blockage costs only ~1 m of
  a ~605 m head (<0.2%), inside gauge error. The earlier head-decline story was wrong; the Jan–Apr
  head drop was **seasonal reservoir drawdown**, not the collapse.
- **The real method:** plot **needle-valve opening % (x) vs gross head m (y)** at steady 100 MW.
  Healthy readings form a tight, downward-sloping **"band of normal operation."** A blockage forces
  the valve further open to hold 100 MW → points drift **right, out of the band.**
- **Timeline (his charts T1–T7):** Dec–Feb baseline in band; 1–15 Mar within; 16–31 Mar grazes the
  upper edge (possible onset); **early April clearly departs → collapse began before 1 April**;
  May–Jul blow out toward a fully-open (100%) valve. Discovered 4 Aug 2009.
- **The moral (which held up in court):** operators acted **reasonably** — the tools to see this
  didn't exist. NOT negligence. Do **not** reintroduce operator-blaming language.
- **Decisive scale constraint:** Mike's charts T3–T7 use an **80.5–84.5% valve x-axis**, so every
  Dec–April reading lives in that narrow window; the 90–100% excursion is a **May–July** phenomenon
  (chart T1). The reconstructed data honours this.

### The tunnel scatter data is ILLUSTRATIVE
`src/data/glendoeData.js` holds **78 reconstructed points** standing in for Mike's real
**~7,400 ten-minute readings**, faithfully scaled to his Appendix T geometry and labelled
illustrative on the page. **Swap for the real data when Mike sends it** — same structure/axes, a
drop-in replacement. Chart is colour-coded by band status (blue inside / teal edge / orange out /
red far out); palette validated with the dataviz skill's validator.

### Bearing page
`src/pages/BearingHealth.jsx` + `src/data/bearingHealthData.js` + `ml/train_bearing_lstm.py`:
- LSTM trained on NASA IMS, applied to Neelum-Jhelum (Pakistan) **Unit No. 01** (NOT "G4" — that
  was an earlier error) turbine guide bearing. Failure ~**3 Feb 2022** (last operational reading;
  "13 Feb" was wrong — not in the paper).
- User-facing term is **"AI risk model"** (the hydro audience doesn't know "LSTM"); the LSTM term is
  explained once, in the methodology section.
- Known caveat noted on the page: the October baseline (242 MW full load) vs winter inference
  (~119 MW) is an operating-point confound.

## Working style / safety rules (also in `CLAUDE.md` — read it)
- Confirmation passphrase for guarded actions: **`AFFIRMATIVE`** (capitals). "yes"/"ok"/Enter do
  not count.
- Guarded: writing outside the project dir, system changes, destructive git (force-push, hard reset,
  amending pushed commits), `rm -rf`/bulk deletes, package removal, `kill`/`pkill`, destructive DB ops.
- **Never** commit `*.env`, `*secret*`, `*credential*`, `*token*`, `*api_key*`.
- Web-search unknown tools/terms before answering; accuracy over confidence; don't fabricate.
- `DECISIONS.md` logs significant technical decisions — check it before changing tooling/layout.

## Outstanding / next steps
1. **Awaiting Mike's real Glendoe data** (Chris has emailed him). Needed: the ~7,400 needle-valve
   readings + gross-head series; his definition of the "band of normal operation" (tolerance +
   how start-up/shutdown/output-change points are filtered); the reservoir-level series. Also
   confirm the **1,700 sensors / 179 relayed / ~20,000 alarms** figures are OK to publish (source is
   Mike's report, not the open web). Swap the real data into `glendoeData.js` on arrival.
2. **Deploy decision:** merge `chris-dev → main` when ready to push the tunnel rework live (Vercel
   auto-deploys `main`). Currently held because the scatter data is still illustrative.
3. **GitHub Issue #1** — contact form not yet implemented.
4. **Possible future modules** (from Mike's feedback): turbine-efficiency / runner-wear monitoring
   (same band-departure method, but slow drift from erosion/cavitation); the Asset Management Scale
   as a positioning device on the site.

## Sanity check after setup
`npm run dev`, then open `/tunnel-health` and `/bearing-health`. Confirm the tunnel page shows the
valve-vs-head scatter with the grey band (overview + zoomed detail) and the bearing page shows the
AI risk chart. If both render, you're good.
