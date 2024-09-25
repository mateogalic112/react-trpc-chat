import { cn } from "@/lib/utils";
import { Message } from "../../../server/routers/chat";
import { useEffect, useRef } from "react";

interface Props {
  messages: Message[];
  username: string;
}

const MessageList = ({ messages, username }: Props) => {
  const lastMessageRef = useRef<HTMLLIElement>(null);

  // Scroll to the last message when a new message is added
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // This effect will run whenever `messages` changes

  return (
    <ul className="p-4 space-y-3">
      {messages.map((message, index) => {
        const messageText = replaceEmoticonsWithEmoji(message.text);
        return (
          <li
            key={index}
            className={`flex ${
              message.username === username ? "justify-end" : "justify-start"
            }`}
            ref={index === messages.length - 1 ? lastMessageRef : null} // Attach ref to the last message
          >
            <div
              className={`px-4 py-2 rounded-lg ${
                message.text.startsWith("/think ")
                  ? "bg-cyan-500 text-cyan-900"
                  : message.username === username
                  ? "bg-blue-500 text-white"
                  : "bg-slate-700"
              }`}
            >
              <p
                className={cn(
                  "",
                  message.text.startsWith("/think ") && "text-cyan-900"
                )}
              >
                {messageText.startsWith("/think ")
                  ? messageText.replace("/think ", "")
                  : messageText}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const replaceEmoticonsWithEmoji = (text: string) => {
  return text
    .replace(/:\)/g, "😀") // Replace :) with 😀
    .replace(/;\)/g, "😉"); // Replace ;) with 😉
};

export default MessageList;
