import type { Course } from "../types";

export const aiPythonCourse: Course = {
  id: "ai-python",
  title: "AI Engineering with Python",
  tagline: "Build production LLM apps, RAG, and agents",
  description:
    "A practical AI Engineering course — not a machine-learning crash course. You will learn how modern LLM applications are actually built in Python: tokens and embeddings, vector databases and RAG, prompt engineering, function calling and structured outputs, the OpenAI / Anthropic / Gemini APIs, local models with Ollama, LangChain, LangGraph, MCP, agents, memory, streaming, security, cost control, and shipping to production.",
  level: "Intermediate → Advanced",
  sections: [
    {
      id: "foundations",
      title: "AI Engineering Foundations",
      description:
        "What an AI engineer actually does, and the mental model of how large language models turn text into text.",
      lessons: [
        {
          slug: "modern-ai-landscape",
          title: "The Modern AI Landscape & the AI Engineer",
          description:
            "Where LLMs fit, what an AI engineer builds vs an ML engineer, the model/provider ecosystem, and the shape of a real AI application.",
          difficulty: "beginner",
          tags: ["ai landscape", "llm", "ai engineer", "architecture", "providers", "roadmap"],
        },
        {
          slug: "llm-fundamentals",
          title: "How LLMs Actually Work",
          description:
            "Next-token prediction, context windows, temperature and sampling, why models hallucinate, and the intuition behind 'it's just predicting the next token'.",
          difficulty: "beginner",
          tags: ["llm", "transformer", "next token", "temperature", "context window", "hallucination"],
        },
        {
          slug: "tokens-and-embeddings",
          title: "Tokens, Embeddings & Vector Space",
          description:
            "Tokenization and why it matters for cost and limits, what embeddings are, cosine similarity, and how meaning becomes geometry.",
          difficulty: "intermediate",
          tags: ["tokens", "tokenizer", "embeddings", "cosine similarity", "vectors", "semantic search"],
        },
      ],
    },
    {
      id: "retrieval",
      title: "Retrieval & RAG",
      description:
        "Give models knowledge they were never trained on: vector databases and Retrieval-Augmented Generation.",
      lessons: [
        {
          slug: "vector-databases",
          title: "Vector Databases",
          description:
            "Storing and searching embeddings at scale: indexes (HNSW, IVF), metadata filtering, chunking strategies, and choosing between Chroma, Qdrant, pgvector, and Pinecone.",
          difficulty: "intermediate",
          tags: ["vector database", "chroma", "qdrant", "pgvector", "hnsw", "chunking"],
        },
        {
          slug: "rag-systems",
          title: "Retrieval-Augmented Generation (RAG)",
          description:
            "The full RAG pipeline: load, chunk, embed, retrieve, rerank, and generate. Why naive RAG fails and how to build one that actually answers correctly.",
          difficulty: "advanced",
          tags: ["rag", "retrieval", "chunking", "reranking", "grounding", "citations"],
        },
      ],
    },
    {
      id: "prompting",
      title: "Prompting & Structured I/O",
      description:
        "Control model behaviour precisely: prompt engineering, structured outputs, and tool/function calling.",
      lessons: [
        {
          slug: "prompt-engineering",
          title: "Prompt Engineering",
          description:
            "System vs user messages, few-shot examples, chain-of-thought, prompt templates, guardrails, and evaluating prompts like code instead of guessing.",
          difficulty: "intermediate",
          tags: ["prompt engineering", "system prompt", "few-shot", "chain of thought", "templates", "evaluation"],
        },
        {
          slug: "structured-outputs-and-tools",
          title: "Structured Outputs & Function Calling",
          description:
            "Force valid JSON with Pydantic schemas, use tool/function calling to let the model call your code, and build the loop that turns a chat model into an automation.",
          difficulty: "advanced",
          tags: ["structured outputs", "function calling", "tool calling", "json schema", "pydantic", "validation"],
        },
      ],
    },
    {
      id: "providers",
      title: "Providers, Local Models & Streaming",
      description:
        "Talk to every major model provider, run models locally, and stream responses in async Python.",
      lessons: [
        {
          slug: "provider-apis",
          title: "OpenAI, Anthropic & Gemini APIs",
          description:
            "A unified mental model for the three big provider SDKs: messages, roles, parameters, errors and retries, and writing a thin provider-agnostic client.",
          difficulty: "intermediate",
          tags: ["openai", "anthropic", "gemini", "api", "sdk", "retries"],
        },
        {
          slug: "local-llms-ollama",
          title: "Local LLMs with Ollama",
          description:
            "Run open models on your own machine with Ollama: quantization, the OpenAI-compatible endpoint, privacy and cost tradeoffs, and when local beats cloud.",
          difficulty: "intermediate",
          tags: ["ollama", "local llm", "quantization", "privacy", "open models", "gguf"],
        },
        {
          slug: "streaming-and-async",
          title: "Streaming & Async AI Applications",
          description:
            "Token streaming with async generators, Server-Sent Events, concurrency with asyncio.gather, backpressure, and building responsive AI backends.",
          difficulty: "advanced",
          tags: ["streaming", "async", "sse", "asyncio", "generators", "concurrency"],
        },
      ],
    },
    {
      id: "orchestration",
      title: "Orchestration & Agents",
      description:
        "Compose models, tools, and memory into stateful workflows and autonomous agents.",
      lessons: [
        {
          slug: "langchain-langgraph-mcp",
          title: "LangChain, LangGraph & MCP",
          description:
            "When frameworks help and when they hurt: LCEL chains, LangGraph state machines, and the Model Context Protocol for standardized tool/context servers.",
          difficulty: "advanced",
          tags: ["langchain", "langgraph", "mcp", "chains", "state machine", "orchestration"],
        },
        {
          slug: "ai-agents",
          title: "Building AI Agents & Multi-Agent Systems",
          description:
            "The agent loop (reason → act → observe), tool use, memory, planning, multi-agent collaboration, and the guardrails that keep autonomous systems from going rogue.",
          difficulty: "advanced",
          tags: ["agents", "react", "tool use", "memory", "multi-agent", "planning"],
        },
      ],
    },
    {
      id: "production",
      title: "Production AI",
      description:
        "Security, cost, evaluation, and deployment — everything between a demo and a system people rely on.",
      lessons: [
        {
          slug: "ai-in-production",
          title: "Security, Cost & Production Deployment",
          description:
            "Prompt injection and defenses, PII handling, caching and token budgets, evaluation and observability, rate limits, and deploying AI services that stay up.",
          difficulty: "expert",
          tags: ["ai security", "prompt injection", "cost optimization", "caching", "evaluation", "deployment"],
        },
        {
          slug: "capstone-ai-assistant",
          title: "Capstone: A Production RAG Agent",
          description:
            "Assemble everything into one system: an async, streaming, tool-using RAG agent with memory, structured outputs, cost controls, and tests — deployable as a static-friendly API.",
          difficulty: "expert",
          tags: ["capstone", "rag", "agent", "streaming", "production", "architecture"],
        },
      ],
    },
  ],
};
