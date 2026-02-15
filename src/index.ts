#!/usr/bin/env node
import chalk from "chalk";
import ora from "ora";
import { execSync } from "child_process";
import { runMainMenu } from "./menu.js";
import { runWizard, hasFeature } from "./wizard.js";
import type { WizardAnswers } from "./wizard.js";
import { generateProject } from "./generator.js";
import { runGiveFeedback } from "./commands/give-feedback.js";
import { runReadFeedback } from "./commands/read-feedback.js";

const NEXT_STEPS: Array<{
    when: (a: WizardAnswers) => boolean;
    title: string;
    lines: (a: WizardAnswers) => string[];
}> = [
    {
        when: (a) => a.projectDir !== ".",
        title: "Navigate to your project",
        lines: (a) => [`cd ${a.projectDir}`],
    },
    {
        when: (a) => !!a.generatedPrivateKey,
        title: "Back up your wallet",
        lines: (a) => [
            "⚠️  A new wallet was generated and added to .env",
            `Address: ${a.agentWallet}`,
            "→ Back up your .env file!",
        ],
    },
    {
        when: () => true,
        title: "Configure .env",
        lines: (a) =>
            a.generatedPrivateKey
                ? ["- Add OPENAI_API_KEY", "- Add PINATA_JWT (get one at pinata.cloud)"]
                : ["- Add PRIVATE_KEY", "- Add OPENAI_API_KEY", "- Add PINATA_JWT (get one at pinata.cloud)"],
    },
    {
        when: () => true,
        title: "Fund your wallet with testnet ETH",
        lines: () => ["→ https://cloud.google.com/application/web3/faucet/ethereum/sepolia"],
    },
    {
        when: (a) => hasFeature(a, "a2a"),
        title: "Start & deploy your A2A server",
        lines: () => [
            "npm run start:a2a",
            "→ Test locally: http://localhost:3000/.well-known/agent-card.json",
            "→ Deploy to Railway/Render/etc for public access",
        ],
    },
    {
        when: (a) => hasFeature(a, "a2a"),
        title: "Update registration with your public URL",
        lines: () => ["Change the A2A endpoint from example.com to your real URL"],
    },
    {
        when: (a) => hasFeature(a, "mcp"),
        title: "Start your MCP server",
        lines: () => ["npm run start:mcp"],
    },
    {
        when: () => true,
        title: "Register your agent on-chain",
        lines: () => ["npm run register"],
    },
];

function printNextSteps(answers: WizardAnswers): void {
    console.log(chalk.bold.cyan("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.bold.cyan("  🚀 NEXT STEPS"));
    console.log(chalk.bold.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));

    let step = 1;
    for (const { when, title, lines } of NEXT_STEPS) {
        if (!when(answers)) continue;
        console.log(chalk.bold.white(`${step}. ${title}`));
        for (const line of lines(answers)) {
            const isCommand = line.startsWith("npm ") || line.startsWith("cd ");
            console.log(isCommand ? chalk.cyan(`   ${line}`) : chalk.gray(`   ${line}`));
        }
        console.log("");
        step++;
    }

    console.log(chalk.bold.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.gray("Learn more: https://eips.ethereum.org/EIPS/eip-8004"));
    console.log("");
}

async function main() {
    console.log(chalk.bold.cyan("\n  This is the ERC-8004 AI Agent wizard\n"));
    console.log(chalk.gray("  Create agents, give feedback, and read reputation on ERC-8004.\n"));

    const action = await runMainMenu();

    if (action === "give-feedback") {
        await runGiveFeedback();
        return;
    }
    if (action === "read-feedback") {
        await runReadFeedback();
        return;
    }

    try {
        const answers = await runWizard();

        console.log("\n");
        const spinner = ora("Generating project files...").start();
        await generateProject(answers);
        spinner.succeed(chalk.green("ERC-8004 Agent generated successfully!"));

        const installDir = answers.projectDir === "." ? process.cwd() : answers.projectDir;
        const installSpinner = ora("Installing dependencies...").start();
        try {
            execSync("npm install", { cwd: installDir, stdio: "pipe" });
            installSpinner.succeed(chalk.green("Dependencies installed successfully!"));
        } catch {
            installSpinner.fail(chalk.yellow("Failed to install dependencies. Run 'npm install' manually."));
        }

        printNextSteps(answers);
    } catch (error) {
        console.error(chalk.red("\n❌ Error:"), error);
        process.exit(1);
    }
}

main();
