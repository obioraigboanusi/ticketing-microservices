console.clear();
console.log("Listener started");

import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener, TicketUpdatedListener } from "./events/fetures/ticket/listeners.js";

const clientId = randomBytes(4).toString("hex");

// cluster id must correspond with the -cid flag in the depl config
const stan = nats.connect("ticketing", clientId, {
  // client id stays unique for each instance
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
  new TicketUpdatedListener(stan).listen();
});

stan.on("error", (err) => {
  console.error("Listener error", err);
});

const cleanup = () => {
  stan.close();
};

process.on("SIGINT", cleanup);
process.on("SIGBREAK", cleanup); // Windows
process.on("SIGTERM", cleanup); // Linux/macOS; harmless on Windows
