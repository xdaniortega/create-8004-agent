# Examples — create-8004-agent

End-to-end walkthroughs for each agent archetype.

---

## Example: Research Agent

### 1. Generate the agent

```bash
npx create-8004-agent
```

Select:
- **Archetype**: 🔍 Research Agent
- **Chain**: Arbitrum Sepolia (Testnet)
- **Features**: A2A + MCP (pre-selected)

### 2. Configure `.env`

```env
PRIVATE_KEY=your_private_key
AGENT_PRIVATE_KEY=your_agent_private_key
PINATA_JWT=your_pinata_jwt
OPENAI_API_KEY=your_openai_api_key
```

### 3. Register on-chain

```bash
cd agents/my-agent
npm install
npm run register
```

Output includes your Agent ID, e.g. `421614:42`.

### 4. Start the A2A server

```bash
npm run start:a2a
```

Agent is live at `http://localhost:3000`.

### 5. Start the MCP server

```bash
npm run start:mcp
```

### 6. Test with the A2A client

```bash
# Discover agent capabilities
npm run a2a:discover

# Interactive chat
npm run a2a:chat
# You: Research the latest Ethereum Layer 2 scaling solutions
# Agent: [structured research report with citations]
```

---

## Example: Code Agent

### 1. Generate the agent

```bash
npx create-8004-agent
```

Select:
- **Archetype**: 💻 Code Agent
- **Chain**: Arbitrum Sepolia
- **Features**: A2A + MCP (pre-selected)

### 2. Test MCP tools

With Claude Desktop or any MCP client, connect to `npm run start:mcp` and call:

```
generate_code: "A TypeScript function that validates Ethereum addresses" in TypeScript
review_code: [paste your code]
debug_code: [paste code] error: [paste error message]
```

---

## Example: Orchestrator discovering and delegating

### 1. Generate the Orchestrator

```bash
npx create-8004-agent
```

Select:
- **Archetype**: 🤖 Orchestrator Agent
- **Chain**: Arbitrum Sepolia (registries deployed here)
- **Features**: A2A (pre-selected)

### 2. Configure `.env`

```env
PRIVATE_KEY=your_private_key
OPENAI_API_KEY=your_openai_api_key
IDENTITY_REGISTRY_ADDRESS=0x8004A818BFB912233c491871b3d84c89A494BD9e
REPUTATION_REGISTRY_ADDRESS=0x8004B663056A597Dffe9eCcC1965A193B7388713
RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
```

### 3. Register the orchestrator on-chain

```bash
cd agents/my-orchestrator
npm install
npm run register
```

### 4. Discover agents in the registry

```bash
npm run discover
```

Output:
```
Discovering ERC-8004 agents...

Found 3 agent(s):

[#5] Research Bot
  Description: Web research and report generation
  Skills: natural_language_processing/natural_language_generation/summarization
  Reputation: avg score 85, total feedbacks 12
  A2A: https://research-bot.example.com

[#7] Code Helper
  Description: Code generation and review
  Skills: analytical_skills/coding_skills/text_to_code
  Reputation: avg score 92, total feedbacks 28
  A2A: https://code-helper.example.com
```

### 5. Start the interactive orchestrator

```bash
npm run start:orchestrator
```

```
  ERC-8004 Orchestrator Agent
  Type your task. The orchestrator will find and delegate to the best agent.

You: Search for recent news about Ethereum scaling

  Orchestrating...
  Searching registry for skills: natural_language_processing/information_extraction, analytical_skills/research_and_analysis

Orchestrator: I found 2 agents capable of this task:

1. Research Bot (#5) — avg score 85 from 12 feedbacks
2. General Assistant (#2) — avg score 71 from 4 feedbacks

I recommend Research Bot based on its higher reputation and relevant skills.
Delegating to Research Bot...

[Research Bot response with Ethereum L2 news summary]

Rate the agent (0-100, or press Enter to skip): 90
Agent ID to rate: 5
Comment (optional): Great research, well cited

Feedback recorded.
```

### 6. Give direct feedback

```bash
npm run feedback -- 5 90
```

---

## Example: Document Agent

### 1. Generate

```bash
npx create-8004-agent
# Select: 📄 Document Agent, ETH Sepolia, A2A + MCP
```

### 2. Test document analysis via MCP

```
analyze_document: [paste a contract or article]
extract_entities: [paste text], entity_types: ["person", "organization", "date"]
transform_content: [paste text], target_format: "summary"
transform_content: [paste text], target_format: "translation", language: "Spanish"
```

---

## Registries by Chain

If you want to run an Orchestrator or query the registry programmatically,
use a chain that has both registries deployed:

| Chain | Status | Recommended for |
|-------|--------|----------------|
| Arbitrum Sepolia | ✅ | Development & testing |
| Ethereum Sepolia | ✅ | Development & testing |
| Arbitrum One | ✅ | Production |
| Ethereum Mainnet | ✅ | Production |
| Base, Polygon | ⏳ Coming soon | — |
