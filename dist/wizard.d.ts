import { type ChainKey, type TrustModel } from "./config.js";
import type { AgentType } from "./types.js";
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
export declare const hasFeature: (answers: WizardAnswers, feature: "a2a" | "mcp" | "x402") => boolean;
export declare const isFeedbackAgent: (answers: WizardAnswers) => boolean;
export declare function runWizard(): Promise<WizardAnswers>;
