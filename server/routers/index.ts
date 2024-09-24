import { publicProcedure, router } from "../trpc";
import { EventEmitter } from "events";
import { observable } from "@trpc/server/observable";
import { z } from "zod";

const eventEmitter = new EventEmitter();

const messageSchema = z.object({
  userId: z.string(),
  text: z.string(),
});
type Message = z.infer<typeof messageSchema>;

export const appRouter = router({
  onMessageAdd: publicProcedure.subscription(() => {
    return observable<Message>((emit) => {
      const onMessageAdd = (data: Message) => {
        emit.next(data);
      };
      eventEmitter.on("addMessage", onMessageAdd);
      return () => {
        eventEmitter.off("addMessage", onMessageAdd);
      };
    });
  }),
  addMessage: publicProcedure.input(messageSchema).mutation(async (opts) => {
    const message = { ...opts.input };
    eventEmitter.emit("addMessage", { ...opts.input });
    return message;
  }),
});
