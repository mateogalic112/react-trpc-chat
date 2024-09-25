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
    <ul className="p-4 space-y-3">
      {messages.map((message, index) => {
        const messageText = stripMessage(
          replaceEmoticonsWithEmoji(message.text)
        );

        return (
          <li
            key={index}
            className={cn(
              "flex",
              message.username === username ? "justify-end" : "justify-start"
            )}
            ref={index === messages.length - 1 ? lastMessageRef : null} // Attach ref to the last message
          >
            <div
              className={cn(
                "px-4 py-2 rounded-lg text-white",
                getMessageStyles(message, username)
              )}
            >
              <p
                className={cn(
                  message.text.startsWith("/think ") && "text-gray-700"
                )}
              >
                {messageText}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const getMessageStyles = (message: Message, username: string) => {
  if (message.text.startsWith("/think ")) {
    return "bg-gray-200";
  }
  if (message.username === username) {
    return "bg-blue-700 dark:bg-blue-500 dark:text-white";
  }
  return "bg-slate-600 dark:bg-slate-700";
};

const stripMessage = (message: string) => {
  return message.startsWith("/think ")
    ? message.replace("/think ", "")
    : message;
};

const replaceEmoticonsWithEmoji = (text: string) => {
  return text
    .replace(/:\)/g, "😀") // Replace :) with 😀
    .replace(/;\)/g, "😉"); // Replace ;) with 😉
};

export default MessageList;
