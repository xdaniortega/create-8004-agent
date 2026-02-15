import type { WizardAnswers } from "../wizard.js";
import { CHAINS } from "../config.js";
type ChainConfig = (typeof CHAINS)[keyof typeof CHAINS];
export declare function generatePackageJson(answers: WizardAnswers): string;
export declare function generateEnvExample(answers: WizardAnswers, chain: ChainConfig): string;
export declare function generateRegisterScript(answers: WizardAnswers, chain: ChainConfig): string;
export declare function generateAgentTs(answers: WizardAnswers): string;
export interface ReadmeOptions {
    /** Extra lines for the Project Structure (e.g. give-feedback.ts for Feedback Agent) */
    extraStructureLines?: string[];
    /** Extra markdown sections to insert after Project Structure */
    extraSections?: string[];
}
export declare function generateReadme(answers: WizardAnswers, chain: ChainConfig, opts?: ReadmeOptions): string;
export {};
