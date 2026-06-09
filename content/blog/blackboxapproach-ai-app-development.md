+++
title = "BlackBoxApproach: Building Apps When AI Keeps Breaking Things"
date = 2026-06-09
+++

# BlackBoxApproach: Building Apps When AI Keeps Breaking Things

*Proof-of-concept research. [github.com/amiune/theblackboxapproach](https://github.com/amiune/theblackboxapproach)*

AI is great at generating code. It's also great at rewriting your entire project when you asked it to tweak one button. **BlackBoxApproach** is our experiment in fixing that.

<!-- more -->

## What it tries to solve

**Human vs AI decisions.** Every box and data field tracks provenance: `human_defined`, `ai_defined`, or `mixed`. Once you confirm something, AI can't downgrade it back to a guess.

**Pseudocode as a middle layer.** Boxes use hybrid pseudocode (`CALL`, `IF`, natural language): enough structure to decompose a system, not enough to drown in implementation details until you're ready.

**Modular boundaries.** Refine one black box at a time. Ancestors are read-only context; only the selected subtree can change. The visualizer generates prompts that enforce this, so "fix the payment flow" doesn't rewrite your auth layer.

**A human-readable view.** A native macOS visualizer shows the box tree, provenance badges, and contracts. Simpler than dozens of scattered spec files.

## How it works

Each app project gets a `blackboxes/` folder: YAML boxes, shared data structures, a skill file the LLM follows when explicitly invoked, and a provenance log. ChatGPT (or similar) returns structured file updates; the app writes them, tracks git diff, and blocks new AI edits while you have uncommitted changes.

Not low-code. Not "natural language programming." Recursive black-box decomposition with contracts, intent, and audit trail.

## Status

Early POC. macOS app + project template. The method matters more than the UI. The goal is disciplined AI-assisted development that stays understandable to humans.

**Repo:** [github.com/amiune/theblackboxapproach](https://github.com/amiune/theblackboxapproach)
