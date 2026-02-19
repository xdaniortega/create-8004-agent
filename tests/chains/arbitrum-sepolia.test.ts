/**
 * Arbitrum Sepolia Test Suite
 */

import { createChainTestSuite } from '../utils/chain-test-factory.js';

createChainTestSuite({
    chainKey: 'arbitrum-sepolia',
    chainName: 'Arbitrum Sepolia',
    x402Supported: false,
});
