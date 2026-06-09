+++
title = "MokuML: Local ML Predictions Without a Pipeline"
date = 2026-06-09
+++

# MokuML: Local ML Predictions Without a Pipeline

*Proof-of-concept research. [github.com/amiune/MokuML](https://github.com/amiune/MokuML)*

What if a small business could connect Postgres, describe a prediction in plain English, and get results on their Mac without a data science team, cloud ML stack, or Kumo-style subscription?

That's what we're exploring with **MokuML**. Think lightweight [Kumo.ai](https://kumo.ai): connect a database, ask for predictions, get answers. But everything runs locally.

<!-- more -->

## The idea

1. Connect to your Postgres database.
2. Describe what you want to predict ("which customers will churn?", "which invoices will be paid late?").
3. A **local LLM** reads your schema (table names, columns, keys) and writes a safe `SELECT` query. It never sees your actual rows.
4. The query runs on your machine in a read-only transaction.
5. **TabPFN-3** trains and predicts on that table, also locally.

No feature engineering pipeline. No model tuning UI. No sending customer data to an API.

## Privacy is the product rule

The LLM gets schema metadata and your prompt. No cell values, no previews, no passwords. SQL is validated with an AST parser before execution. Mutations, DDL, and multi-statement tricks get rejected.

Optional remote LLM mode exists, but the same boundary applies: schema only.

## Stack

- **SwiftUI** macOS app
- **Python worker** on `127.0.0.1` for DB access, SQL validation, TabPFN inference
- **Ollama** (or OpenAI-compatible API) for text-to-SQL
- Local run history in `~/Library/Application Support/MokuML/runs/`

## Honest limitations

It can't predict the future from thin air. You need historical labels or a derivable target in the schema. TabPFN has row/feature limits. And check the TabPFN license before commercial use.

Still early, but the direction feels right: local LLMs + tabular foundation models could make useful ML cheap and private for small businesses.

**Repo:** [github.com/amiune/MokuML](https://github.com/amiune/MokuML)
