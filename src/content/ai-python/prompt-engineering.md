## Learning objectives

- Use **system vs user vs assistant** messages deliberately.
- Apply few-shot examples, chain-of-thought, and delimiters to steer output.
- Build reusable **prompt templates** instead of f-string spaghetti.
- Treat prompts like code: version them and evaluate them.

## Prerequisites

[How LLMs Actually Work](/courses/ai-python/llm-fundamentals). Helpful: [Tokens & Embeddings](/courses/ai-python/tokens-and-embeddings).

## The core idea in one line

> Prompt engineering is **interface design for a probabilistic function**: you shape the input so the distribution of outputs lands where you want.

**Analogy — briefing a brilliant new hire on day one.** They're smart but know nothing about your context. Vague instructions ("handle the tickets") get vague results. A precise brief — role, goal, constraints, an example of a good result, and what to do when unsure — gets professional work. A prompt is that brief, written once and reused.

## The message roles

```python
messages = [
    {"role": "system", "content": "You are a terse SQL assistant. Output only SQL, no prose."},
    {"role": "user", "content": "Users who signed up last week."},
    {"role": "assistant", "content": "SELECT * FROM users WHERE created_at >= NOW() - INTERVAL '7 days';"},
    {"role": "user", "content": "Now only their emails."},
]
```

- **system** — the durable brief: role, rules, format, tone. Set once; it frames everything.
- **user** — the request for this turn.
- **assistant** — the model's prior replies (and, usefully, examples you plant to demonstrate the pattern).

## Techniques, from basic to advanced

### 1. Be specific and give structure

```text
BAD:  "Summarize this."
GOOD: "Summarize the text below in 3 bullet points, each under 15 words,
       focused on action items. Text: <<<{text}>>>"
```

Delimiters (`<<< >>>`, triple backticks, XML tags) tell the model exactly where data starts and ends — and blunt many prompt-injection attempts.

### 2. Few-shot: show, don't just tell

```text
Classify sentiment as POSITIVE/NEGATIVE/NEUTRAL.
Review: "Fast shipping, loved it" -> POSITIVE
Review: "Broke in a day" -> NEGATIVE
Review: "It's fine, nothing special" -> NEUTRAL
Review: "{input}" ->
```

Two or three examples often beat a paragraph of description, especially for formatting.

### 3. Chain-of-thought (when reasoning matters)

Ask the model to work step by step before answering. It genuinely improves multi-step reasoning — but the reasoning eats tokens and shouldn't always be shown to the user.

```text
"Think step by step, then give the final answer after 'ANSWER:'."
```

> [!NOTE]
> For extraction/classification you usually want the *opposite* — no reasoning, just the label, at temperature 0. Chain-of-thought is for genuinely multi-step problems.

### 4. Assign a role and constraints

"You are a senior Python reviewer. Flag only correctness bugs and security issues. Ignore style." Roles + explicit *exclusions* sharpen output more than adjectives.

## Templates, not f-string spaghetti

Hardcoded prompts scattered through code are unmaintainable. Centralize them:

```python
from string import Template

SUMMARIZE = Template(
    "Summarize the $doc_type below in $n bullets for a $audience.\n\n"
    "```\n$text\n```"
)

def build(text: str, *, doc_type="document", n=3, audience="busy executive") -> str:
    return SUMMARIZE.substitute(doc_type=doc_type, n=n, audience=audience, text=text)
```

Now prompts are testable, diffable, and reusable — and you can A/B two versions cleanly.

## Prompts are code — evaluate them

The amateur move is to tweak a prompt until one example looks good. The professional move is a small **eval set**:

```python
cases = [
    {"input": "Broke in a day", "expect": "NEGATIVE"},
    {"input": "It's fine", "expect": "NEUTRAL"},
]

def score(prompt_fn) -> float:
    ok = sum(prompt_fn(c["input"]).strip() == c["expect"] for c in cases)
    return ok / len(cases)
```

Change a prompt → re-run the eval → keep the change only if the score improves. This is how you avoid "fixed one case, broke three."

## Comparison — prompting vs fine-tuning

| | Prompting | Fine-tuning |
|---|---|---|
| Effort | Minutes | Data + training pipeline |
| Cost | Per-call tokens | Upfront + hosting |
| Changes | Instantly | Retrain |
| Best for | Almost everything to start | Fixed style/format at high volume |

Reach for prompting (and few-shot) first; fine-tune only when prompting demonstrably plateaus.

## Common mistakes

1. **Vague asks** — "make it better" has no target.
2. **No output format** — then complaining the output varies.
3. **Stuffing rules the model can't follow** ("respond in exactly 47 words") — soft targets work better.
4. **Putting untrusted user text where instructions go** — an injection risk (covered in the security lesson).
5. **Tuning on a single example** — you're overfitting to one input.

## Performance & cost

- Every instruction, example, and delimiter is tokens you pay for on *every* call. Keep the system prompt lean; move rarely-needed detail into retrieval.
- Few-shot examples are the biggest silent cost — trim to the minimum that holds quality.
- Stable prefix first: providers that cache prompt prefixes bill the repeated part cheaper.

## Interview questions

1. **"System vs user message?"** — System is the durable brief (role, rules, format); user is the per-turn request.
2. **"When does chain-of-thought help/hurt?"** — Helps multi-step reasoning; hurts simple extraction (cost, and leaking reasoning).
3. **"How do you know a prompt change is an improvement?"** — Run it against an eval set and compare scores, not vibes.
4. **"Prompting or fine-tuning?"** — Prompt/few-shot first; fine-tune only for fixed format/style at scale after prompting plateaus.

## Summary

- Use roles deliberately; the system message frames every response.
- Specificity, delimiters, few-shot examples, and (when needed) chain-of-thought steer the output.
- Centralize prompts as templates so they're testable and versioned.
- Evaluate prompt changes against a set — treat prompts as code.

## Exercises

**Easy**

1. Rewrite "summarize this article" into a specific, format-constrained prompt with delimiters.
2. Convert a paragraph of classification rules into a 3-example few-shot prompt.

**Intermediate**

3. Build a `PromptTemplate` helper and render the same summarize prompt for two audiences (child vs CFO). Compare outputs.
4. Write a 5-case eval set for a classifier and a `score()` function; try two system prompts and report which wins.

**Advanced**

5. Design a system prompt for a customer-support agent that must stay on-topic, never promise refunds, cite policy, and refuse politely off-scope. Test it with three adversarial inputs.

**Debugging**

6. A classifier sometimes returns "The sentiment is POSITIVE." instead of "POSITIVE". Fix the prompt so the output is always exactly the label, and explain why your change works.

**Mini project**

Build a `prompt_lab.py`: load prompt variants from files, run each against a labeled eval set, and print a leaderboard (accuracy, avg tokens). Use it to iterate on one real task.

## Quiz

<details>
<summary>1. What belongs in the system message?</summary>
Durable framing: role, rules, output format, and tone — everything that should apply to every turn.
</details>

<details>
<summary>2. Why use delimiters around inserted data?</summary>
They mark exactly where data begins/ends, improving reliability and blunting prompt injection.
</details>

<details>
<summary>3. When should you avoid chain-of-thought?</summary>
Simple extraction/classification — you want just the answer at temperature 0, not token-costly reasoning.
</details>

<details>
<summary>4. How do you validate a prompt change?</summary>
Run both versions against an eval set and keep the change only if the measured score improves.
</details>

## Further reading

- Anthropic and OpenAI prompt-engineering guides
- "Chain-of-Thought Prompting" (Wei et al., 2022)
- Next lesson: [Structured Outputs & Function Calling](/courses/ai-python/structured-outputs-and-tools)
