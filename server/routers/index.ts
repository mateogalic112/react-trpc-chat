import { router } from "../trpc";
import { chatRouter } from "./chat";

export const appRouter = router({
  chat: chatRouter,
});
