Provides a Docker image for running `solana-test-validator` in a container for toolchain isolation.

```shell
npm i -D solana-testcontainers @solana/web3.js@1
```

```typescript
import { afterAll, beforeAll, expect, it } from '@jest/globals';
import { Connection, PublicKey } from '@solana/web3.js';

import { SolanaContainer, StartedSolanaContainer } from './index';

let container: StartedSolanaContainer;
let connection: Connection;

beforeAll(async () => {
  container = await new SolanaContainer().start();
  connection = container.connection;
});

afterAll(async () => {
  await container.stop();
});

it('should get block 0', async () => {
  const block = await connection.getBlock(0);
  expect(block).toMatchObject({
    blockHeight: 0,
    blockhash: expect.any(String),
  });
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
```
