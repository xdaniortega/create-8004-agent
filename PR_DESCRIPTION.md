## Summary

Add an A2A client to the generated template for testing and debugging agents, providing parity with MCP testing capabilities.

## Problem

The template currently includes A2A Server and MCP Server, but there's no built-in way to test A2A endpoints. Developers must use raw curl commands:

```bash
curl -X POST http://localhost:3000/a2a \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"message/send","params":{...},"id":1}'
```

This approach:
- Doesn't demonstrate multi-turn conversations (contextId management)
- Doesn't show SSE streaming in action
- Requires manual JSON-RPC payload construction
- No visibility into agent card / skills discovery

## Solution

Add a single-file A2A client (`src/a2a-client.ts`) with multiple modes:

```bash
yarn a2a:discover  # Show agent capabilities
yarn a2a:chat      # Interactive chat with the agent
yarn a2a:test      # Run automated test suite
```

### Features

- **Discovery**: Fetch and display agent card with skills and capabilities
- **Interactive chat**: Multi-turn conversations with `/new`, `/stream`, `/context`, `/help` commands
- **Automated tests**: 5 tests covering discovery, messaging, multi-turn, context isolation, and streaming
- **Verbose mode** (`-v`): Debug JSON-RPC payloads
- **Exportable classes**: `A2AClient` and `PaymentRequiredError` for programmatic use
- **No new dependencies**: Uses native `fetch` and `readline`

### Example Output

**Discovery:**
```
Name: My Agent
Description: An AI agent with x402 payments
Version: 1.0.0

Capabilities:
  Streaming: true

Skills:
  - Chat
    General conversation and question answering

Authentication: x402
```

**Test Suite:**
```
A2A Test Suite

--------------------------------------------------
[PASS] Agent Discovery (45ms)
[PASS] Simple Message (234ms)
[PASS] Multi-turn Conversation (456ms)
[PASS] Context Isolation (389ms)
[PASS] Streaming Response (1203ms)
--------------------------------------------------

5/5 tests passed
```

## Changes

- `src/templates/a2a.ts`: Add `generateA2AClient()` function
- `src/templates/base.ts`: Add npm scripts and update README template
- `src/templates/solana.ts`: Add npm scripts for Solana template
- `src/generator.ts`: Generate `src/a2a-client.ts` when A2A feature is enabled

## Test Plan

- [ ] Generate a new project with A2A enabled
- [ ] Run `yarn a2a:discover` - shows agent card
- [ ] Run `yarn a2a:chat` - interactive mode works
- [ ] Run `yarn a2a:test` - all tests pass
- [ ] Run with `-v` flag - shows JSON-RPC payloads
