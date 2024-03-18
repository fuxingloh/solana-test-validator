# Solana Container

```typescript
import { SolanaContainer, StartedSolanaContainer } from 'solana-testcontainers';
import { createPublicClient, http, PublicClient } from 'viem';
import { solana } from 'viem/chains';

let container: StartedSolanaContainer;

beforeAll(async () => {
  container = await new SolanaContainer().start();
});

afterAll(async () => {
  await container.stop();
});

it('should rpc(eth_blockNumber) via viem', async () => {
  const client = createPublicClient({ chain: solana, transport: http(container.getHostRpcUrl()) });

  const blockNumber = await client.getBlockNumber();
  expect(blockNumber).toStrictEqual(BigInt(0));
});
```

## License

MPL-2.0
