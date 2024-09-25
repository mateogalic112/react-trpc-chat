import { cn } from "@/lib/utils";
import { Message } from "../../../server/routers/chat";
import useScrollToLastItem from "@/hooks/use-scroll-to-last-item";

interface Props {
  messages: Message[];
  username: string;
}

const MessageList = ({ messages, username }: Props) => {
  const lastMessageRef = useScrollToLastItem(messages);

  return (
    <ul className="px-4 py-8 space-y-2">
      {messages.map((message, index) => {
        const messageText = stripMessage(replaceWithEmoji(message.text));
        const myMessage = message.username === username;

        return (
          <li
            key={index}
            className={cn("flex", myMessage ? "justify-end" : "justify-start")}
            ref={index === messages.length - 1 ? lastMessageRef : null} // Attach ref to the last message
          >
            <div
              className={cn(
                "px-4 py-2 rounded-lg text-white",
                getMessageStyles(message, username)
              )}
            >
              <p>{messageText}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const getMessageStyles = (message: Message, username: string) => {
  if (message.text.startsWith("/think ")) {
    return "bg-gray-200 text-black";
  }
  if (message.username === username) {
    return "bg-blue-700 dark:bg-blue-500";
  }
  return "bg-slate-600 dark:bg-slate-700";
};

const stripMessage = (message: string) => {
  return message.startsWith("/think ")
    ? message.replace("/think ", "")
    : message;
};

const replaceWithEmoji = (text: string) => {
  return text
    .replace(/:\)/g, "😀") // Replace :) with 😀
    .replace(/;\)/g, "😉"); // Replace ;) with 😉
};

export default MessageList;
