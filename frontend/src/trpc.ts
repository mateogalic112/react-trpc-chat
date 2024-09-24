import { AppRouter } from "../../server";
import {
  createTRPCReact,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from "@trpc/react-query";

// create persistent WebSocket connection
const wsClient = createWSClient({
  url: `ws://localhost:4000`,
});

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    splitLink({
      condition(op) {
        return op.type === "subscription";
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: "http://localhost:4000/trpc",
      }),
    }),
  ],
});
