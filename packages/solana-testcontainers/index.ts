import { AbstractStartedContainer, GenericContainer, StartedTestContainer, Wait } from 'testcontainers';

// renovate: datasource=github-releases depName=solana-labs/solana
const SOLANA_VERSION = '1.18.14';

export class SolanaContainer extends GenericContainer {
  constructor(image: string = `ghcr.io/fuxingloh/solana-container:${SOLANA_VERSION}`) {
    super(image);
    this.withWaitStrategy(Wait.forLogMessage('Processed Slot:'));
    this.withExposedPorts(
      8899, // RPC
      8900, // WS
    );
  }

  async start(): Promise<StartedSolanaContainer> {
    return new StartedSolanaContainer(await super.start());
  }
}

export class StartedSolanaContainer extends AbstractStartedContainer {
  constructor(startedTestContainer: StartedTestContainer) {
    super(startedTestContainer);
  }

  getHostRpcEndpoint(): string {
    return `http://${this.getHost()}:${this.getMappedPort(8899)}`;
  }

  getHostWsEndpoint(): string {
    return `ws://${this.getHost()}:${this.getMappedPort(8900)}`;
  }
}
