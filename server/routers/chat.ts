import { publicProcedure, router } from "../trpc";
import { EventEmitter } from "events";
import { observable } from "@trpc/server/observable";
import { z } from "zod";

const eventEmitter = new EventEmitter();

const messageSchema = z.object({
  username: z.string(),
  text: z.string(),
});
export type Message = { text: string; username: string };

export const chatRouter = router({
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
  addMessage: publicProcedure
    .input(messageSchema)
    .mutation(async ({ input }) => {
      const message = { ...input };
      eventEmitter.emit("addMessage", message);
    }),
});
