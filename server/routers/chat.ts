import { publicProcedure, router } from "../trpc";
import { EventEmitter } from "events";
import { observable } from "@trpc/server/observable";
import { z } from "zod";

const eventEmitter = new EventEmitter();

const messageSchema = z.object({
  username: z.string(),
  text: z.string(),
  timestamp: z.number(),
});
export type Message = z.infer<typeof messageSchema>;

const messages = new Array<Message>();

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
      if (message.text.startsWith("/oops")) {
        for (let i = messages.length - 1; i >= 0; i--) {
          if (messages[i].username === input.username) {
            // Remove the message using splice
            messages.splice(i, 1);
            break; // Break after deleting the last message
          }
        }
        eventEmitter.emit("addMessage", message);
        return messages;
      }
      messages.push(message);
      eventEmitter.emit("addMessage", message);
      return messages;
    }),

  getMessages: publicProcedure.query(() => {
    return messages;
  }),
});
