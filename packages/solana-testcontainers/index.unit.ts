import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { createPublicClient, http, PublicClient } from 'viem';
import { solana } from 'viem/chains';
import waitForExpect from 'wait-for-expect';

import { SolanaContainer, StartedSolanaContainer } from './index';

describe('default container', () => {
  let container: StartedSolanaContainer;

  beforeAll(async () => {
    container = await new SolanaContainer().start();
  });

  afterAll(async () => {
    await container.stop();
  });

  it('should expose host rpc url', async () => {
    expect(container.getHostRpcUrl()).toMatch(/http:\/\/localhost:\d+/);
  });

  it('should rpc(eth_blockNumber) via viem', async () => {
    const client = createPublicClient({
      chain: solana,
      transport: http(container.getHostRpcUrl()),
    });

    const blockNumber = await client.getBlockNumber();
    expect(blockNumber).toBeGreaterThanOrEqual(0n);
  });
});

describe('auto mining container 2000ms interval', () => {
  let container: StartedSolanaContainer;
  let client: PublicClient;

  beforeAll(async () => {
    container = await new SolanaContainer().withMiningInterval(2000).start();
    client = createPublicClient({
      chain: solana,
      transport: http(container.getHostRpcUrl()),
    });
  });

  afterAll(async () => {
    await container.stop();
  });

  it('should auto mine block', async () => {
    await waitForExpect(async () => {
      const blockNumber = await client.getBlockNumber();
      expect(blockNumber).toBeGreaterThan(1n);
    }, 6000);
  });
});
