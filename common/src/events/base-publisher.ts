import type { Stan } from "node-nats-streaming";
import type { Event } from "./utils.js";

export abstract class BasePublisher<T extends Event> {
  protected client: Stan;
  abstract subject: T['subject'];

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err, guid) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
