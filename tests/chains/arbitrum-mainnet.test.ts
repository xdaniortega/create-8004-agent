/**
 * Arbitrum Mainnet Test Suite
 */

import { createChainTestSuite } from '../utils/chain-test-factory.js';

createChainTestSuite({
    chainKey: 'arbitrum-mainnet',
    chainName: 'Arbitrum One',
    x402Supported: false,
});
