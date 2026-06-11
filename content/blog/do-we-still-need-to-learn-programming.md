+++
title = "Do We Still Need to Learn Programming? Probably Yes"
description = "Why natural language, pseudocode, and code are complementary tools in the age of AI-assisted programming."
date = 2026-06-11
draft = false

[extra]
author = "Hernán Amiune"
+++

## tl;dr

Natural language, pseudocode, and code are not competing tools. They are different languages for different levels of precision.

In the age of AI-assisted programming, learning to program is not only about writing every line of code by hand. It is about knowing when an idea needs to become more precise, how to control that translation, and how to distinguish between decisions made by a human and decisions filled in by an AI system.

<!-- more -->

## A quote from Richard Feynman

To understand why programming does not simply disappear with AI, it helps to start with a more general distinction: the difference between clarity and precision.

Richard Feynman once explained this idea while talking about mathematics:

> The real problem in speech is not precise language. The problem is clear language. The desire is to have the idea clearly communicated to the other person. It is only necessary to be precise when there is some doubt as to the meaning of a phrase, and then the precision should be put in the place where the doubt exists.
>
> It is really quite impossible to say anything with absolute precision, unless that thing is so abstracted from the real world as to not represent any real thing. Pure mathematics is just such an abstraction from the real world, and pure mathematics does have a special precise language for dealing with its own special and technical subjects.
>
> But this precise language is not precise in any sense if you deal with real objects of the world, and it is only pedantic and quite confusing to use it unless there are some special subtleties which have to be carefully distinguished.

The interesting part is that Feynman is not criticizing mathematics. He is criticizing the idea that more formalism always means more understanding.

His point is simple:

- clarity matters more than precision;
- precision should be introduced only where there is a real ambiguity;
- pure mathematics can be perfectly precise because it deals with abstractions defined by mathematics itself;
- when we speak about the real world, there are always approximations, assumptions, and imperfect definitions.

Although Feynman was talking about mathematics, the distinction is useful for thinking about programming too. Not because programming is the same as pure mathematics, but because programming also introduces formal precision where natural language is too ambiguous.

The central idea of this article is this:

> Learning to program still matters because the hard problem is not only producing code. The hard problem is controlling the translation between an ambiguous human intention and a formal system that executes instructions without common sense.

## The language of people and the language of computers

Programming is a way of communicating a procedure. It is a way of telling a machine what we want it to do.

A CPU, or Central Processing Unit, does not understand English, Spanish, Python, or C++ in the way a person does. At the lowest level, it executes very simple instructions: reading numbers, comparing them, adding them, copying data from one place in memory to another, and jumping from one instruction to another.

Programming languages are a much more human-friendly layer for describing procedures that will later be interpreted or compiled into instructions the machine can execute.

In natural language, a sentence like:

> Sort this deck of cards.

leaves many things open to interpretation.

It assumes that the person receiving the instruction knows what a card is, what sorting means, which ordering criterion to use, which cards are higher than others, whether suits matter, and how much time or effort is acceptable.

In programming, those decisions must be defined somewhere in the system.

We do not always write every detail by hand, because we use programming languages, libraries, frameworks, and abstractions that already encapsulate many decisions. But someone, at some level, had to define those decisions precisely.

Natural language and programming languages are not better or worse versions of the same thing. They are different tools. Asking whether AI means we no longer need to learn programming is a bit like asking whether, because we know how to use a magnifying glass, we no longer need to understand what a microscope is for.

## How software is created in a software company

In a software company, almost everything starts with natural language.

A client explains what they want:

> I need an app to manage orders.

Or:

> I need a website to sell products.

Or:

> I need a system to manage appointments.

That first description is rarely precise. Not because the client is expressing themselves poorly, but because they are trying to compress a large amount of domain knowledge into a few sentences.

That knowledge may include habits, exceptions, business rules, preferences, edge cases, previous problems, and implicit decisions.

That is why intermediate layers exist.

A product manager, business analyst, or functional analyst talks to the client, asks questions, detects ambiguities, and transforms the initial request into clearer requirements.

Then a tech lead, architect, or programmer translates those requirements into increasingly specific technical decisions, until eventually there is code.

Each layer may discover problems or propose changes. But no layer should silently override a decision made at a higher level.

If a programmer finds a contradiction, they should raise it. If a product manager reformulates a requirement, that reformulation should remain traceable to the original client request.

### Three ways to translate an idea into code

The following diagram compares three workflows: traditional software development, direct LLM-based code generation, and a proposed workflow with an explicit intermediate layer.

<div class="flow-grid">
  <div class="flow-card">
    <h4>Traditional process</h4>
    <div class="flow-node human">Client</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-node human">Analyst / PM</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-node human">Tech lead</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-node human">Programmer</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-node mixed">Code</div>
  </div>

  <div class="flow-card">
    <h4>LLM without methodology</h4>
    <div class="flow-node human">User</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-node human">Prompt</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-node ai">LLM</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-node ai">Code</div>
  </div>

  <div class="flow-card">
    <h4>Black Box Approach</h4>
    <div class="flow-node human">User</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-node human">Natural language</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-node mixed">Pseudocode + boxes</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-node ai">LLM guided by skills</div>
    <div class="flow-arrow">↓</div>
    <div class="flow-node mixed">Traceable code</div>
  </div>
</div>

## What happens when a person uses an LLM to generate code?

When a person interacts directly with an LLM to generate code, the intermediate layer does not fully disappear. It becomes implicit.

The model interprets the prompt, fills in missing details, prioritizes instructions, and makes implementation decisions. But many of those decisions are not recorded anywhere stable.

That is why many AI coding tools have something like a *Plan Mode*. The idea is to ask the model to think before implementing.

The problem is that the plan is often temporary. It may remain trapped in a conversation, disconnected from the final code, or ignored by the user.

When the user is a programmer, they often spend a lot of time writing specs, requirements documents, architecture notes, and context files to guide the LLM. But that creates another problem: dozens of scattered files, each with different levels of authority, priority, and freshness.

Even when specs are carefully written, the problem does not disappear.

The LLM may encounter contradictions, fill in gaps, or make decisions that do not exactly match the requirements. Sometimes this happens because natural language is ambiguous. Sometimes it happens because of the order in which the model reads files. Sometimes it happens because instructions conflict. And sometimes it happens because LLMs are probabilistic systems.

The problem is not that the LLM makes decisions.

The problem is not knowing which decisions it made, why it made them, or whether they contradict something a human had already decided.

## Pseudocode as an intermediate layer

Pseudocode can play the role that, in traditional software development, is often distributed across conversations between clients, managers, architects, and programmers.

It is not pure natural language, because it has structure.

But it is not executable code either, because it still allows us to speak in terms of intention, modules, and responsibilities.

This intermediate layer is especially useful with LLMs because it separates two moments that are often collapsed too quickly:

1. deciding what the system should do;
2. deciding how to implement it.

For example:

```text
IF user selects a subscription plan
  CALL create_checkout_session

IF payment succeeds
  CALL activate_subscription
  CALL send_confirmation_email
ELSE
  CALL show_payment_error
```

This pseudocode does not yet decide whether we will use Stripe, Paddle, Mercado Pago, a custom API, or a specific library.

But it does define a structure:

- there is a plan;
- there is a checkout session;
- there is a subscription activation step;
- there is a payment success path;
- there is an error path.

That is already much more precise than a vague request like:

> Add payments to the app.

But it is still not as rigid as final implementation code.

## The proposal: the Black Box Approach

The proposed methodology is simple:

> Treat each part of the system as a refinable black box, with clear boundaries, intermediate pseudocode, and explicit provenance.

Each app project gets a `blackboxes/` folder containing:

- YAML boxes;
- shared data structures;
- a skill file the LLM must follow when explicitly invoked;
- a provenance log;
- optionally, a visualizer that shows the box tree.

The goal is not to replace code.

The goal is to make the translation from human intention to code visible, editable, and auditable.

## What it tries to solve

### 1. Human decisions vs AI decisions

Every box and every data field tracks provenance:

- `human_defined`
- `ai_defined`
- `mixed`

Once a human confirms something, the AI cannot silently downgrade it back into a guess.

For example, if the LLM decides to use Stripe, that decision can initially be marked as `ai_defined`.

If a human confirms that decision, it becomes human-approved. From then on, the model should not replace Stripe with another provider unless it explicitly raises that change.

### 2. Pseudocode as a middle layer

Boxes use hybrid pseudocode:

```text
CALL create_checkout_session
IF payment succeeds
WHILE there are pending invoices
```

This provides enough structure to decompose a system, but not so much structure that we drown in implementation details before we are ready.

### 3. Modular boundaries

The system is refined one black box at a time.

Ancestors are read-only context. Only the selected subtree can change.

This matters because a request like:

> Fix the payment flow.

should not allow the LLM to rewrite the authentication layer, the database schema, and the notification system unless those changes are explicitly connected and approved.

### 4. A human-readable view

A visualizer can show the box tree in a much simpler way than dozens of scattered spec files.

The point is not merely documentation. The point is to preserve decision boundaries.

## A minimal example

Here is a simplified example of a black box for a payment flow:

```yaml
box: payment_flow
goal: allow the user to pay for a subscription
provenance: human_defined

inputs:
  - selected_plan
  - user_id

pseudocode:
  - IF user selects plan
  - CALL create_checkout_session
  - IF payment succeeds
  - CALL activate_subscription
  - ELSE show_error_message

decisions:
  payment_provider:
    value: Stripe
    provenance: ai_defined
    status: needs_human_confirmation

constraints:
  - Do not modify auth_flow without human approval
  - Do not store sensitive card data
```

The interesting part is not the YAML itself.

The interesting part is that every decision has a place. The system knows what has been specified by a human, what has been inferred by the AI, and what still needs confirmation.

The intermediate layer is not bureaucracy. It is a way to prevent AI from turning ambiguity into invisible decisions.

## So what does it mean to learn programming now?

Maybe learning programming no longer means memorizing syntax or writing every function from scratch.

Maybe it means learning how to think in levels of precision.

It means knowing when natural language is enough, when pseudocode is needed, when executable code is needed, and when a decision must be recorded because it will affect the whole system.

Learning programming also teaches:

- how to decompose problems;
- how to identify edge cases;
- how to model data;
- how to read generated code critically;
- how to debug;
- how to evaluate trade-offs;
- how to reason about constraints like memory, latency, security, concurrency, permissions, and cost.

AI can dramatically accelerate code generation.

But the more code AI generates, the more important it becomes to read it, question it, and connect it back to the human decisions it is supposed to implement.

## Conclusion

The question "Do we still need to learn programming?" may be poorly framed.

If programming means memorizing syntax and manually writing every line of code, then we will probably need to do less of that over time.

But if programming means understanding how an ambiguous intention becomes a formal system that makes decisions and executes actions, then the answer is clearly yes.

AI can write code.

But someone still has to control the translation.

And to control a translation, you need to understand at least part of both languages.

---

*The Black Box Approach described in this article is a proof-of-concept experiment. [github.com/amiune/theblackboxapproach](https://github.com/amiune/theblackboxapproach)*

<style>
.flow-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.flow-card {
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 1rem;
  padding: 1rem;
  background: var(--card-background, #ffffff);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
}

.flow-card h4 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.flow-node {
  border-radius: 0.75rem;
  padding: 0.65rem 0.75rem;
  text-align: center;
  font-weight: 700;
  font-size: 0.92rem;
  border: 1px solid;
}

.flow-node.human {
  background: #dbeafe;
  border-color: #2563eb;
  color: #1e3a8a;
}

.flow-node.ai {
  background: #ede9fe;
  border-color: #7c3aed;
  color: #4c1d95;
}

.flow-node.mixed {
  background: #fef3c7;
  border-color: #f59e0b;
  color: #78350f;
}

.flow-arrow {
  text-align: center;
  color: #94a3b8;
  font-weight: 800;
  line-height: 1.8;
}

@media (max-width: 900px) {
  .flow-grid {
    grid-template-columns: 1fr;
  }
}
</style>
