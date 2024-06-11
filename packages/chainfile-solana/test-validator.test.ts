import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { ChainfileTestcontainers } from '@chainfile/testcontainers';

import test from './test-validator.json';

const testcontainers = new ChainfileTestcontainers(test);

beforeAll(async () => {
  await testcontainers.start();
});

afterAll(async () => {
  await testcontainers.stop();
});

describe('solana', () => {
  it('should rpc(getBlockHeight)', async () => {
    const response = await testcontainers.get('solana').rpc({
      method: 'getBlockHeight',
    });

    expect(response.status).toStrictEqual(200);
    expect(await response.json()).toMatchObject({
      result: 0,
    });
  });
});
