console.clear();
console.log("Publisher started");

import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/fetures/ticket/publishers.js";

const stan = nats.connect("ticketing", "publisher", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 20,
      userId: "sdfdsf",
    });
  } catch (error) {
    console.log("publish failed: " + error);
  }
});

stan.on("error", (err) => {
  console.error("Publisher error", err);
});
