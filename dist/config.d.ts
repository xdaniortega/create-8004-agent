export declare const CHAINS: {
    readonly "eth-mainnet": {
        readonly name: "Ethereum Mainnet";
        readonly chainId: 1;
        readonly rpcUrl: "https://ethereum-rpc.publicnode.com";
        readonly scanPath: "mainnet";
        readonly x402Network: "eip155:1";
        readonly x402Supported: false;
        readonly facilitatorUrl: null;
        readonly usdcAddress: null;
    };
    readonly "arbitrum-mainnet": {
        readonly name: "Arbitrum One";
        readonly chainId: 42161;
        readonly rpcUrl: "https://arb1.arbitrum.io/rpc";
        readonly scanPath: "arbitrum";
        readonly x402Network: "eip155:42161";
        readonly x402Supported: false;
        readonly facilitatorUrl: null;
        readonly usdcAddress: null;
    };
    readonly "base-mainnet": {
        readonly name: "Base Mainnet";
        readonly chainId: 8453;
        readonly rpcUrl: "https://mainnet.base.org";
        readonly scanPath: "base";
        readonly x402Network: "eip155:8453";
        readonly x402Supported: true;
        readonly facilitatorUrl: "https://facilitator.payai.network";
        readonly usdcAddress: null;
    };
    readonly "polygon-mainnet": {
        readonly name: "Polygon Mainnet";
        readonly chainId: 137;
        readonly rpcUrl: "https://polygon-rpc.com";
        readonly scanPath: "polygon";
        readonly x402Network: "eip155:137";
        readonly x402Supported: true;
        readonly facilitatorUrl: "https://facilitator.payai.network";
        readonly usdcAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
        readonly usdcName: "USD Coin";
        readonly usdcVersion: "2";
    };
    readonly "eth-sepolia": {
        readonly name: "Ethereum Sepolia (Testnet)";
        readonly chainId: 11155111;
        readonly rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com";
        readonly scanPath: "sepolia";
        readonly x402Network: "eip155:11155111";
        readonly x402Supported: false;
        readonly facilitatorUrl: null;
        readonly usdcAddress: null;
    };
    readonly "arbitrum-sepolia": {
        readonly name: "Arbitrum Sepolia (Testnet)";
        readonly chainId: 421614;
        readonly rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc";
        readonly scanPath: "arbitrum-sepolia";
        readonly x402Network: "eip155:421614";
        readonly x402Supported: false;
        readonly facilitatorUrl: null;
        readonly usdcAddress: null;
    };
    readonly "base-sepolia": {
        readonly name: "Base Sepolia (Testnet)";
        readonly chainId: 84532;
        readonly rpcUrl: "https://sepolia.base.org";
        readonly scanPath: "base-sepolia";
        readonly x402Network: "eip155:84532";
        readonly x402Supported: true;
        readonly facilitatorUrl: "https://facilitator.payai.network";
        readonly usdcAddress: null;
    };
    readonly "polygon-amoy": {
        readonly name: "Polygon Amoy (Testnet)";
        readonly chainId: 80002;
        readonly rpcUrl: "https://rpc-amoy.polygon.technology";
        readonly scanPath: "polygon-amoy";
        readonly x402Network: "eip155:80002";
        readonly x402Supported: true;
        readonly facilitatorUrl: "https://facilitator.payai.network";
        readonly usdcAddress: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582";
        readonly usdcName: "USDC";
        readonly usdcVersion: "2";
    };
};
export type ChainKey = keyof typeof CHAINS;
export declare const TRUST_MODELS: readonly ["reputation", "crypto-economic", "tee-attestation"];
export type TrustModel = (typeof TRUST_MODELS)[number];
export declare function getChainKeys(): ChainKey[];
export declare function getChainChoices(): {
    name: string;
    value: ChainKey;
}[];
export declare const AGENT_ID_REGEX: RegExp;
export declare const AGENT_ID_MESSAGE = "Agent ID (format chainId:tokenId, e.g. 421614:5)";
export declare function validateAgentId(v: string): true | string;
