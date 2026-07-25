import stan, { type Stan } from 'node-nats-streaming';

export class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('NATs client must be mounted.');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = stan.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this._client?.on('connect', () => {
        console.warn('NATS connected...');
        resolve();
      });
      this._client?.on('error', (err) => {
        reject(err);
      });
    });
  }
}
