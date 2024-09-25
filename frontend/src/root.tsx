import { trpc } from "./trpc";
import { Card, CardContent } from "./components/ui/card";
import { ScrollArea } from "./components/ui/scroll-area";
import MessageList from "./components/message-list";
import MessageInput from "./components/message-input";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "../../server/routers/chat";
import { useState } from "react";

const username = "user" + Math.floor(Math.random() * 100);

function Root() {
  const queryClient = useQueryClient();

  const { data: messages = [] } = trpc.chat.getMessages.useQuery();

  // Local state to hold the list of messages (initially from the query)
  trpc.chat.onMessageAdd.useSubscription(undefined, {
    onData(newMessage) {
      // TODO add valid nickname check
      if (
        newMessage.text.startsWith("/nick ") &&
        newMessage.username !== username
      ) {
        document.title = newMessage.text.replace("/nick ", "").trim();
      }

      const messagesKey = getQueryKey(
        trpc.chat.getMessages,
        undefined,
        "query"
      );

      // TODO update this
      if (newMessage.text.startsWith("/oops")) {
        queryClient.setQueryData(
          messagesKey,
          (oldMessages: Message[] | undefined) => {
            if (oldMessages) {
              return oldMessages.filter(
                (msg) => msg.username !== newMessage.username
              );
            } else {
              return [];
            }
          }
        );
        return;
      }

      // Optimistically update the messages without refetching
      queryClient.setQueryData(
        messagesKey,
        (oldMessages: Message[] | undefined) => {
          if (oldMessages) {
            return [...oldMessages, newMessage];
          } else {
            return [newMessage];
          }
        }
      );

      if (newMessage.username !== username) {
        new Audio("/popup.mp3").play();
      }
    },
    onError(err) {
      console.error("Subscription error:", err);
    },
  });

  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  trpc.chat.onTypingUpdate.useSubscription(undefined, {
    onData(usernames) {
      const typingUsers = usernames.filter((u) => u !== username);
      setTypingUsers(typingUsers);
      console.log("Typing users:", usernames);
    },
    onError(err) {
      console.error("Subscription error:", err);
    },
  });

  return (
    <main className="bg-slate-800 h-[100dvh] flex items-center justify-center">
      <div className="max-w-[600px] w-full mx-[5%] h-[75vh] flex flex-col gap-4">
        {/* Chat Messages */}
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0 h-full">
            <ScrollArea className="h-full bg-slate-900">
              <MessageList messages={messages} username={username} />
              <p className="p-4">{typingUsers.length > 0 && "Typing..."}</p>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Input Area */}
        <div className="w-full">
          <MessageInput username={username} />
        </div>
      </div>
    </main>
  );
}

export default Root;
