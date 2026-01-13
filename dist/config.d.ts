export declare const CHAINS: {
    readonly "eth-sepolia": {
        readonly name: "Ethereum Sepolia";
        readonly chainId: 11155111;
        readonly rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com";
        readonly scanPath: "sepolia";
        readonly x402Network: "eip155:11155111";
    };
};
export type ChainKey = keyof typeof CHAINS;
export declare const TRUST_MODELS: readonly ["reputation", "crypto-economic", "tee-attestation"];
export type TrustModel = (typeof TRUST_MODELS)[number];
