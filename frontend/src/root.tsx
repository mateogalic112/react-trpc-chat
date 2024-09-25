import { trpc } from "./trpc";
import { Card, CardContent } from "./components/ui/card";
import { ScrollArea } from "./components/ui/scroll-area";
import MessageList from "./components/message-list";
import MessageInput from "./components/message-input";
import { useEffect, useState } from "react";
import { Message } from "../../server/routers/chat";
import { useTheme } from "./components/theme-provider";

const username = "user" + Math.floor(Math.random() * 100);

function Root() {
  const { setTheme } = useTheme();

  const [countdown, setCountdown] = useState({
    counter: null as number | null,
    url: null as string | null,
    username: "",
  });

  const [messages, setMessages] = useState<Message[]>([]);
  trpc.chat.onMessagesUpdate.useSubscription(undefined, {
    onData(newMessages) {
      console.log({ newMessages });
      setMessages(newMessages);
    },
    onError(err) {
      console.error("Subscription error:", err);
    },
  });

  // Local state to hold the list of messages (initially from the query)
  trpc.chat.onMessageAdd.useSubscription(undefined, {
    onData(newMessage) {
      if (
        newMessage.text.startsWith("/nick ") &&
        newMessage.text.replace("/nick ", "").trim().length > 0 &&
        newMessage.username !== username
      ) {
        document.title = newMessage.text.replace("/nick ", "").trim();
      }

      if (
        newMessage.text.startsWith("/light") &&
        newMessage.username === username
      ) {
        setTheme("light");
      }

      if (
        newMessage.text.startsWith("/dark") &&
        newMessage.username === username
      ) {
        setTheme("dark");
      }

      if (newMessage.text.startsWith("/countdown ")) {
        const [, count, url] = newMessage.text.split(" ");
        if (!count || !url) return;

        const parsedCount = parseInt(count, 10);
        if (isNaN(parsedCount)) {
          return;
        }

        const urlRegex = /^(https?:\/\/)?([^\s$.?#].[^\s]*)$/i;
        if (!urlRegex.test(url)) {
          return;
        }

        setCountdown({
          counter: parsedCount,
          url,
          username: newMessage.username,
        });
      }

      if (newMessage.username !== username) {
        new Audio("/popup.mp3").play();
      }
    },
    onError(err) {
      console.error("Subscription error:", err);
    },
  });

  useEffect(() => {
    if (countdown.counter !== null && countdown.counter > 0) {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => ({
          ...prevCountdown,
          counter: prevCountdown.counter! - 1,
        }));
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on unmount or reset
    } else if (
      countdown.counter === 0 &&
      countdown.url &&
      countdown.username !== username
    ) {
      window.open(countdown.url, "_blank"); // Open the URL in a new tab
      setCountdown({ counter: null, url: null, username: "" });
    }
  }, [countdown]);

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
    <main className="bg-slate-600 dark:bg-slate-800 h-[100dvh] flex items-center justify-center">
      <div className="max-w-[600px] w-full mx-[5%] h-[75vh] flex flex-col gap-4">
        <div>
          {countdown.counter && countdown.username !== username && (
            <p>{countdown.counter}</p>
          )}
        </div>
        {/* Chat Messages */}
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0 h-full">
            <ScrollArea className="h-full bg-slate-700 dark:bg-slate-900">
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
