# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Added

- **Agent type choice in Create agent** – Wizard now asks "Agent type" with options **Generic** and **Feedback Agent**. Same flow (directory, name, chain, wallet, features, etc.); Feedback Agent projects get extra capability to submit reputation feedback.
- **Local registry (`.8004-agents.json`)** – Registry at repo root lists created agents (projectDir, name, agentType, agentId, chainId). Updated when generating a new agent and when running `npm run register` from an agent folder. Used so "Give feedback" can list your deployed agents.
- **Per-agent metadata (`.8004.json`)** – Each generated project gets a small file with `projectDir` and `agentType` so the register script can update the root registry after registration.
- **Give feedback from CLI** – Main menu "Give feedback" loads the local registry, shows only deployed agents (with agentId), lets you choose which agent to use. If you select a **Generic** agent, shows an error (only Feedback Agent can submit feedback). If you select a **Feedback Agent**, runs that project’s `npm run feedback` (prompts for chain, agent ID, value, tags).
- **Feedback Agent template module (`src/templates/feedback-agent.ts`)** – All Feedback Agent–specific logic lives here: `generateGiveFeedbackScript()`, package.json extras (script `feedback`), env block (FEEDBACK_PRIVATE_KEY), README structure line and section. Base template stays generic.
- **Shared types (`src/types.ts`)** – Single definition of `AgentType` ('generic' | 'feedback-agent') used by wizard and registry.
- **Registry helpers** – `loadRegistryFile()` to read/parse `.8004-agents.json`; `readRegistry`, `upsertAgent`, and `updateAgentAfterRegister` use it to avoid duplicated logic.
- **Config helpers** – `getChainKeys()`, `getChainChoices()`, `AGENT_ID_REGEX`, `AGENT_ID_MESSAGE`, `validateAgentId()` for consistent chain selection and agent ID validation in commands and generated script.
- **Commands: `exitWithError()`** – Small helper in `src/commands/exit-with-error.ts` for consistent error handling in give-feedback (and future commands).
- **Data-driven next steps in `index.ts`** – "Next steps" after creating an agent are driven by a `NEXT_STEPS` array (when/title/lines) instead of long if/console blocks.

### Changed

- **Base template is generic only** – `base.ts` no longer branches on agent type. Package.json, .env, and README are for the generic agent; Feedback Agent extras are applied in the generator by merging/concatenating output from `feedback-agent.ts`. `generateReadme()` accepts optional `ReadmeOptions` (extraStructureLines, extraSections) for those extras.
- **Give feedback script uses only agent key** – Generated `give-feedback.ts` (and template in `feedback-agent.ts`) uses **only** `FEEDBACK_PRIVATE_KEY` or `AGENT_PRIVATE_KEY` to sign feedback. It no longer falls back to `PRIVATE_KEY` (master), which caused "Self-feedback not allowed" when the master owned the rated agent.
- **Read feedback** – Uses `getChainChoices()` and `validateAgentId()` from config instead of duplicating chain list and validation.
- **SDK version** – `@blockbyvlog/agent0-sdk` set to `"latest"` in root `package.json` and in generated agent `package.json` so new projects get the latest SDK.

### Removed

- **Solana support** – Removed `config-solana.ts`, `templates/solana.ts`, Solana chain choice and wallet generation from the wizard, and `generateSolanaProject` from the generator. CLI and generated agents are EVM-only.
- **Monad support** – Removed Monad chains from `config.ts`, `templates/monad.ts`, and `generateMonadProject` from the generator.
- **Dependencies** – Removed `@solana/web3.js` and `bs58` from root `package.json` (no longer used after Solana removal).
- **`test-register.ts`** – Removed (optional cleanup).

### Fixed

- **a2a.ts build** – After Solana removal, two template literals still referenced `x402SchemeClass`. Replaced with the literal `ExactEvmScheme` so the generated A2A server uses the EVM scheme only.

### Why

- **Agent types** – To support agents that only chat (Generic) vs agents that can also submit reputation feedback (Feedback Agent) without mixing concerns in one template.
- **Local registry** – So "Give feedback" can show your deployed agents by name/directory instead of typing agent IDs by hand, and so only Feedback Agents are offered for the feedback flow.
- **No PRIVATE_KEY for feedback** – The contract blocks the **owner** of the rated agent from submitting feedback. If the script used the master key (owner), every feedback failed with "Self-feedback not allowed". Using only AGENT_PRIVATE_KEY or FEEDBACK_PRIVATE_KEY ensures the signer is the agent (or a dedicated reviewer) and not the master.
- **EVM-only** – Simplifies maintenance and code paths; Solana and Monad can be re-added later as separate branches or modules if needed.
- **Base vs feedback-agent split** – Keeps `base.ts` focused on the generic agent; Feedback Agent behavior is isolated in one module and applied only when that type is chosen.
