# Solana Container

```typescript
import { SolanaContainer, StartedSolanaContainer } from 'solana-testcontainers';
import { Connection, PublicKey } from '@solana/web3.js';

describe('SolanaContainer', () => {
  let container: StartedSolanaContainer;
  let connection: Connection;

  beforeAll(async () => {
    container = await new SolanaContainer().start();
    connection = new Connection(container.getHostRpcEndpoint(), {
      commitment: 'processed',
      wsEndpoint: container.getHostWsEndpoint(),
    });
  });

  afterAll(async () => {
    await container.stop();
  });

  it('should get processed block height', async () => {
    const blockHeight = await connection.getBlockHeight('processed');
    expect(blockHeight).toBeGreaterThanOrEqual(0);
  });

  it('should fund address with 5129000000 lamports with confirmation', async () => {
    const publicKey = new PublicKey('Emp8JcXpFnCXzdWBC3ChRPtNQHiiQW6kr61wopT3hbNL');
    const lamports = 5_129_000_000;

    const block = await connection.getLatestBlockhash('processed');
    const signature = await connection.requestAirdrop(publicKey, lamports);
    await connection.confirmTransaction({ signature, ...block }, 'processed');

    const balance = await connection.getBalance(publicKey, 'processed');
    expect(balance).toStrictEqual(lamports);
  });
});
```

## Motivation

This library creates a Docker image that isolates the toolchain for Solana from the host system.
This is particularly useful for language-agnostic development and parallelization of systems.

The default [solanalabs/solana](https://hub.docker.com/r/solanalabs/solana) is an optimized image,
when used on a host system that does not support AVX, it will fail with the following error:
Incompatible CPU detected: missing AVX support.
Please build from source on the target.

## License

MPL-2.0
