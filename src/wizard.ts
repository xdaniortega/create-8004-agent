import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { CHAINS, TRUST_MODELS, type ChainKey, type TrustModel } from "./config.js";
import type { AgentType } from "./types.js";

function getAvailableDir(baseDir: string): string {
    if (baseDir === ".") return baseDir;

    const fullPath = path.resolve(process.cwd(), baseDir);
    if (!fs.existsSync(fullPath)) return baseDir;

    let index = 1;
    let newDir = `${baseDir}-${index}`;
    while (fs.existsSync(path.resolve(process.cwd(), newDir))) {
        index++;
        newDir = `${baseDir}-${index}`;
    }
    return newDir;
}

export type { AgentType } from "./types.js";

export interface WizardAnswers {
    agentType: AgentType;
    projectDir: string;
    agentName: string;
    agentDescription: string;
    agentImage: string;
    features: ("a2a" | "mcp" | "x402")[];
    a2aStreaming: boolean;
    chain: ChainKey;
    trustModels: TrustModel[];
    agentWallet: string;
    generatedPrivateKey?: string;
    useMasterPinataJwt?: boolean;
    preFundFromMaster?: boolean;
    preFundAmount?: string;
    skills?: string[];
    domains?: string[];
}

export const hasFeature = (answers: WizardAnswers, feature: "a2a" | "mcp" | "x402") =>
    answers.features.includes(feature);

export const isFeedbackAgent = (answers: WizardAnswers): boolean =>
    answers.agentType === "feedback-agent";

interface RawAnswers {
    agentType: AgentType;
    projectDir: string;
    agentName: string;
    agentDescription: string;
    agentImage: string;
    agentWallet: string;
    features: ("a2a" | "mcp" | "x402")[];
    a2aStreaming?: boolean;
    chain: ChainKey;
    trustModels: TrustModel[];
    useMasterPinataJwt?: boolean;
    preFundFromMaster?: boolean;
    preFundAmount?: string;
}

export async function runWizard(): Promise<WizardAnswers> {
    console.log("\n");

    const answers = await inquirer.prompt<RawAnswers>([
        {
            type: "list",
            name: "agentType",
            message: "Agent type:",
            choices: [
                { name: "Generic", value: "generic" as const },
                { name: "Feedback Agent (can call giveFeedback to rate other agents)", value: "feedback-agent" as const },
            ],
        },
        {
            type: "input",
            name: "projectDir",
            message: "Project directory (or . for current):",
            default: "agents/my-agent",
        },
        {
            type: "input",
            name: "agentName",
            message: "Agent name:",
            default: "my agent",
        },
        {
            type: "input",
            name: "agentDescription",
            message: "Agent description:",
            default: "test agent created with create-8004-agent",
        },
        {
            type: "input",
            name: "agentImage",
            message: "Agent image URL:",
            default: "https://example.com/agent.png",
        },
        {
            type: "list",
            name: "chain",
            message: "Blockchain network:",
            choices: [
                new inquirer.Separator("── Mainnets ──"),
                ...Object.entries(CHAINS)
                    .filter(([_, chain]) => !chain.name.includes("Testnet"))
                    .map(([key, chain]) => ({
                        name: chain.x402Supported ? `${chain.name.replace(" Mainnet", "")} (x402 supported)` : chain.name.replace(" Mainnet", ""),
                        value: key,
                    })),
                new inquirer.Separator("── Testnets ──"),
                ...Object.entries(CHAINS)
                    .filter(([_, chain]) => chain.name.includes("Testnet"))
                    .map(([key, chain]) => ({
                        name: chain.x402Supported ? `${chain.name.replace(" (Testnet)", "")} (x402 supported)` : chain.name.replace(" (Testnet)", ""),
                        value: key,
                    })),
            ],
        },
        {
            type: "input",
            name: "agentWallet",
            message: "Agent wallet address (leave empty to generate new):",
            validate: (input: string) =>
                input === "" ? true : /^0x[a-fA-F0-9]{40}$/.test(input) || "Enter a valid Ethereum address or leave empty",
        },
        {
            type: "checkbox",
            name: "features",
            message: "Select features to include:",
            choices: (ans: Partial<RawAnswers>) => {
                const chainConfig = ans.chain ? CHAINS[ans.chain] : null;
                const x402Supported = chainConfig?.x402Supported ?? false;
                return [
                    { name: "A2A Server (agent-to-agent communication)", value: "a2a", checked: true },
                    { name: "MCP Server (Model Context Protocol tools)", value: "mcp", checked: false },
                    x402Supported
                        ? { name: "x402 Payments (USDC micropayments)", value: "x402", checked: false }
                        : { name: "x402 Payments", value: "x402", disabled: "Not available on this chain" },
                ];
            },
        },
        {
            type: "confirm",
            name: "a2aStreaming",
            message: "Enable A2A streaming responses? (SSE):",
            default: false,
            when: (ans: Partial<RawAnswers>) => ans.features?.includes("a2a") ?? false,
        },
        {
            type: "checkbox",
            name: "trustModels",
            message: "Supported trust models:",
            choices: TRUST_MODELS.map((model) => ({ name: model, value: model, checked: model === "reputation" })),
        },
        {
            type: "confirm",
            name: "useMasterPinataJwt",
            message: "Use the same Pinata JWT from your master .env for this agent?",
            default: true,
            when: (ans: Partial<RawAnswers>) => ans.chain != null,
        },
        {
            type: "confirm",
            name: "preFundFromMaster",
            message: "Pre-fund the agent wallet from your master account after registration?",
            default: true,
            when: (ans: Partial<RawAnswers>) => ans.chain != null,
        },
        {
            type: "input",
            name: "preFundAmount",
            message: "Amount (ETH) to transfer from master to agent wallet:",
            default: "0.002",
            when: (ans: Partial<RawAnswers>) => ans.preFundFromMaster === true,
        },
    ]);

    let projectDir = answers.projectDir.trim();
    const cwdBasename = path.basename(process.cwd());
    const alreadyInAgents = cwdBasename === "agents";
    const alreadyUnderAgents = projectDir.replace(/^\.\//, "").startsWith("agents/");
    if (
        projectDir !== "." &&
        !path.isAbsolute(projectDir) &&
        !alreadyUnderAgents &&
        !alreadyInAgents
    ) {
        projectDir = `agents/${projectDir}`;
    }

    const availableDir = getAvailableDir(projectDir);
    if (availableDir !== projectDir) {
        console.log(`\n📁 Directory "${projectDir}" exists, using "${availableDir}" instead`);
        projectDir = availableDir;
    }

    let agentWallet = answers.agentWallet;
    let generatedPrivateKey: string | undefined;

    if (!agentWallet) {
        const privateKey = generatePrivateKey();
        generatedPrivateKey = privateKey;
        const account = privateKeyToAccount(privateKey);
        agentWallet = account.address;
        console.log("\n🔑 Generated new wallet:", agentWallet);
    }

    return {
        ...answers,
        agentType: answers.agentType,
        projectDir,
        agentWallet,
        generatedPrivateKey,
        a2aStreaming: answers.a2aStreaming ?? false,
        useMasterPinataJwt: answers.useMasterPinataJwt ?? false,
        preFundFromMaster: answers.preFundFromMaster ?? false,
        preFundAmount: answers.preFundAmount?.trim() || "0.002",
    };
}
