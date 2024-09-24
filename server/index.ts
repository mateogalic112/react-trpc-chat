import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import ws from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "./routers";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

// Export type router type signature, this is used by the client.
export type AppRouter = typeof appRouter;

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

const httpServer = app.listen(4000, () => {
  console.log("Server started on http://localhost:4000");
});

// Set up WebSocket server
const wss = new ws.Server({
  server: httpServer, // Attach to the same HTTP server
});

// Apply the WebSocket handler from tRPC
const handler = applyWSSHandler({
  wss,
  router: appRouter,
});

wss.on("connection", (ws) => {
  console.log(`WebSocket connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`WebSocket connection closed (${wss.clients.size})`);
  });
});

console.log("✅ WebSocket Server listening on ws://localhost:4000");

// Handle process signals for graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received.");
  handler.broadcastReconnectNotification();
  wss.close();
  httpServer.close();
});
