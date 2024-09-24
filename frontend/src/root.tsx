import { useState } from "react";
import { trpc } from "./trpc";
import { Message } from "../../server/routers/chat";
import { Card, CardContent } from "./components/ui/card";
import { ScrollArea } from "./components/ui/scroll-area";
import MessageList from "./components/message-list";
import MessageInput from "./components/message-input";

const username = "user" + Math.floor(Math.random() * 100);

function Root() {
  const [messages, setMessages] = useState<Message[]>([]);

  trpc.chat.onMessageAdd.useSubscription(undefined, {
    onData(message) {
      setMessages((prevMessages) => [...prevMessages, message]);
    },
    onError(err) {
      console.error("Subscription error:", err);
    },
  });

  trpc.chat.onNicknameChange.useSubscription(undefined, {
    onData(data) {
      if (data.username !== username) {
        document.title = data.nickname;
      }
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
