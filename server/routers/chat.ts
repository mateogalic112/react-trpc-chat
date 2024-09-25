import { publicProcedure, router } from "../trpc";
import { EventEmitter } from "events";
import { observable } from "@trpc/server/observable";
import { z } from "zod";

const eventEmitter = new EventEmitter();

const messageSchema = z.object({
  username: z.string(),
  text: z.string(),
});
export type Message = z.infer<typeof messageSchema>;

const messages = new Array<Message>();

const currentlyTyping: Record<string, { lastTyped: Date }> =
  Object.create(null);

export const chatRouter = router({
  onTypingUpdate: publicProcedure.subscription(() => {
    return observable<string[]>((emit) => {
      const onIsTypingUpdate = () => {
        const users = Object.keys(currentlyTyping);
        emit.next(users);
      };
      eventEmitter.on("isTypingUpdate", onIsTypingUpdate);
      return () => {
        eventEmitter.off("isTypingUpdate", onIsTypingUpdate);
      };
    });
  }),
  updateTyping: publicProcedure
    .input(z.object({ username: z.string(), typing: z.boolean() }))
    .mutation(({ input }) => {
      if (!input.typing) {
        delete currentlyTyping[input.username];
      } else {
        currentlyTyping[input.username] = {
          lastTyped: new Date(),
        };
      }
      eventEmitter.emit("isTypingUpdate");
    }),

  messages: publicProcedure.query(() => {
    return messages;
  }),

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

      switch (true) {
        case message.text.startsWith("/oops"):
          deleteLastUserMessage(message.username);
          break;
        case message.text.startsWith("/edit "):
          const newText = message.text.replace("/edit ", "");
          editLastUserMessage(message.username, newText);
          break;
        default:
          messages.push(message);
      }
      eventEmitter.emit("addMessage", message);

      delete currentlyTyping[message.username];
      eventEmitter.emit("isTypingUpdate");
    }),
});

// every 3s, clear old "isTyping"
const clearTypingsInterval = setInterval(() => {
  let updated = false;
  const now = Date.now();
  for (const [username, { lastTyped }] of Object.entries(currentlyTyping)) {
    if (now - lastTyped.getTime() > 3000) {
      delete currentlyTyping[username];
      updated = true;
    }
  }
  if (updated) {
    eventEmitter.emit("isTypingUpdate");
  }
}, 3000);
process.on("SIGTERM", () => {
  clearInterval(clearTypingsInterval);
});

const deleteLastUserMessage = (username: string) => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].username === username) {
      // Remove the message using splice
      messages.splice(i, 1);
      break; // Break after deleting the last message
    }
  }
};

const editLastUserMessage = (username: string, newText: string) => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].username === username) {
      // Update the message using splice
      messages.splice(i, 1, {
        ...messages[i],
        text: newText,
      });
      break; // Break after updating the last message
    }
  }
};
