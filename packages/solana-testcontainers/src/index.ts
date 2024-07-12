import { Connection, ConnectionConfig } from '@solana/web3.js';
import { AbstractStartedContainer, GenericContainer, StartedTestContainer, Wait } from 'testcontainers';

export class SolanaContainer extends GenericContainer {
  constructor(image: string = `ghcr.io/fuxingloh/solana-test-validator:1.18.18`) {
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
  /**
   * Default connection to the Solana node.
   * Use createConnection to create a new custom connection.
   */
  public readonly connection: Connection;

  constructor(startedTestContainer: StartedTestContainer) {
    super(startedTestContainer);
    this.connection = this.createConnection();
  }

  getHostRpcEndpoint(host: string = this.getHost()): string {
    return `http://${host}:${this.getMappedPort(8899)}`;
  }

  getHostWsEndpoint(host: string = this.getHost()): string {
    return `ws://${host}:${this.getMappedPort(8900)}`;
  }

  createConnection(
    hostRpcEndpoint: string = this.getHostRpcEndpoint(),
    config: ConnectionConfig = {
      commitment: 'confirmed',
      wsEndpoint: this.getHostWsEndpoint(),
    },
  ): Connection {
    return new Connection(hostRpcEndpoint, config);
  }
}
