// Chain configs - SDK handles contract addresses internally
export const CHAINS = {
    "eth-sepolia": {
        name: "Ethereum Sepolia",
    chainId: 11155111,
        rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
        scanPath: "sepolia",
        x402Network: "eip155:11155111", // CAIP-2 for x402
    },
    // Coming soon - contracts being deployed
    // "base-sepolia": {
    //     name: "Base Sepolia",
    //     chainId: 84532,
    //     rpcUrl: "https://sepolia.base.org",
    //     scanPath: "base-sepolia",
    //     x402Network: "eip155:84532",
    // },
    // "linea-sepolia": {
    //     name: "Linea Sepolia",
    //     chainId: 59141,
    //     rpcUrl: "https://rpc.sepolia.linea.build",
    //     scanPath: null,
    //     x402Network: "eip155:59141",
    // },
    // "polygon-amoy": {
    //     name: "Polygon Amoy",
    //     chainId: 80002,
    //     rpcUrl: "https://rpc-amoy.polygon.technology",
    //     scanPath: null,
    //     x402Network: "eip155:80002",
    // },
} as const;

export type ChainKey = keyof typeof CHAINS;

export const TRUST_MODELS = ["reputation", "crypto-economic", "tee-attestation"] as const;
export type TrustModel = (typeof TRUST_MODELS)[number];
