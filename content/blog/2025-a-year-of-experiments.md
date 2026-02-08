+++
title = "2025 a Year of Experimentation" 
date = 2026-02-01 
+++
# LLMs and AI in 2025: experiments, frustrations, and a few big surprises

2025 has been a year of hands-on experimentation for us with LLMs and applied AI. Instead of just watching the space from the sidelines, we spent the year building, testing, breaking things, and trying ideas that sometimes worked and sometimes didn’t.

The overall feeling is mixed. Some parts of the tech are impressive and moving incredibly fast. Other parts still feel early and fragile. Here’s a summary of what we learned and how it’s shaping what we want to do next.

<!-- more -->

## Mixing semantic and full-text search

A big part of our work this year focused on search systems built around LLMs. We experimented a lot with hybrid search: combining semantic search (embeddings + vector databases) with classic full-text search.

In practice, the combination is powerful. Semantic search helps retrieve conceptually relevant information, while full-text search keeps things precise and explainable. When both are tuned well, the results are noticeably better than using either one alone.

The problem is complexity. Keeping vector indexes in sync, tuning ranking, and managing the infrastructure takes real engineering effort. It’s not plug-and-play yet.

Our honest recommendation right now is: if you don’t have the resources for risky experimentation and a fair amount of trial and error, it might be better to wait. The ecosystem is improving quickly, but today it still favors teams that can afford to explore and iterate.



## RAG vs large context: it depends

We also spent time comparing RAG pipelines with approaches that rely more on large context windows.

We were hoping to find a clear winner. We didn’t.

RAG is great when you’re dealing with large or constantly changing knowledge bases. Large-context approaches simplify the architecture but can get expensive and unpredictable at scale. In real systems, we often ended up with hybrids anyway.

The main takeaway is that there’s no universal recipe yet. Architecture decisions are still very application-specific, and a lot of what works comes from experimentation rather than established best practices.



## Using vector databases for tabular ML (a weird detour)

At some point we decided to try something a bit crazy: [using vector databases to perform classic tabular machine learning](https://github.com/amiune/vector-space-thoughts).

From a practical standpoint, it wasn’t very successful. For standard predictive tasks, traditional ML pipelines are still much more efficient and straightforward.

But the detour was surprisingly productive. It forced us to dive deeper into clustering, similarity metrics, and feature engineering. That exploration opened new research directions and ended up feeding into working papers we’re still developing.

So even though the original idea didn’t pan out as a product approach, it paid off as [research](https://github.com/amiune/gn-blog/tree/main/research/clustering-feateng-benchmarks).



## The huge jump in AI coding

The most impressive change this year has been AI coding.

At the start of 2025, agentic coding systems struggled with relatively simple tasks. Getting a decent landing page often required a lot of manual cleanup. By the end of the year, those same systems can generate and organize complex, multi-component projects in a way that actually feels usable.

This changes what small teams can realistically build. AI coding is no longer just fancy autocomplete. It’s starting to feel like a real development partner.

We’re honestly amazed by the speed of improvement here.



## What we’re focusing on in 2026

All of this leads directly into our plans for 2026.

We want to take advantage of what we’ve learned and focus heavily on using AI coding to help small businesses through very specific iOS apps. Instead of building broad platforms, we’re more interested in targeted tools that solve concrete problems.

We’ll go deeper into why we’re focusing on iOS and how we’re thinking about product strategy in future posts.



## Closing thoughts

If we had to summarize 2025 in one sentence: the technology is powerful but still uneven.

Hybrid search works but is complex. RAG vs context is situational. Some experimental ideas fail in useful ways. And AI coding has made a leap that opens new possibilities for small teams.

We end the year with mixed feelings about maturity, but a lot of optimism about direction. Things are moving fast, and the gap between research and practical applications is shrinking.

For teams willing to experiment and tolerate uncertainty, it’s a very interesting time to be building.
