import { publicProcedure, router } from "../trpc";
import { EventEmitter } from "events";
import { observable } from "@trpc/server/observable";
import { z } from "zod";

const eventEmitter = new EventEmitter();

const messageSchema = z.object({
  username: z.string(),
  text: z.string(),
  timestamp: z.number(),
  special: z.boolean().optional(),
});
export type Message = z.infer<typeof messageSchema>;

const nicknamePayloadSchema = z.object({
  username: z.string(),
  nickname: z.string(),
});
export type NicknamePayload = { username: string; nickname: string };

const messages = new Array<Message>();
const users = new Map<string, string>([]);

export const chatRouter = router({
  onNicknameChange: publicProcedure.subscription(() => {
    return observable<NicknamePayload>((emit) => {
      const onNicknameChange = (data: NicknamePayload) => {
        emit.next(data);
      };
      eventEmitter.on("changeNickname", onNicknameChange);
      return () => {
        eventEmitter.off("changeNickname", onNicknameChange);
      };
    });
  }),
  changeNickname: publicProcedure
    .input(nicknamePayloadSchema)
    .mutation(({ input }) => {
      users.set(input.username, input.nickname);
      eventEmitter.emit("changeNickname", input);
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
      messages.push(message);
      if (!users.has(input.username)) {
        users.set(input.username, "");
      }
      eventEmitter.emit("addMessage", message);
      return messages;
    }),

  getMessages: publicProcedure.query(() => {
    return messages;
  }),
});
