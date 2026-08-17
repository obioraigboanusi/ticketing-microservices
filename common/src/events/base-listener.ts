import type { Message, Stan } from "node-nats-streaming";
import type { Event } from "./utils.js";

export abstract class BaseListener<T extends Event> {
  protected client: Stan;
  abstract subject: T["subject"];
  abstract queryGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  protected ackWait = 5000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setDurableName(this.queryGroupName)
      .setManualAckMode(true)
      .setAckWait(this.ackWait);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queryGroupName,
      this.subscriptionOptions(),
    );

    subscription.on("message", (msg: Message) => {
      const parsedData = this.parseMessage(msg);

      console.log(
        `Message ${this.subject}/ ${this.queryGroupName}: `,
        parsedData,
      );

      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }
}
