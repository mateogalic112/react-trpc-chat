import { publicProcedure, router } from "./trpc";
import cors from "cors";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";

const app = express();

app.use(cors());

const appRouter = router({
  sayHi: publicProcedure.query(() => {
    return "Hello, World!";
  }),
});

// Export type router type signature, this is used by the client.
export type AppRouter = typeof appRouter;

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(4000, () => {
  console.log("Server started on http://localhost:4000");
});
