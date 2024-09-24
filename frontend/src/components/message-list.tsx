import { Message } from "../../../server/routers/chat";

interface Props {
  messages: Message[];
}

const MessageList = ({ messages }: Props) => {
  return (
    <div className="p-4 space-y-3">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.username === "user1" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-4 py-2 rounded-lg ${
              message.username === "user1"
                ? "bg-blue-500 text-white"
                : "bg-slate-700"
            }`}
          >
            <p>{message.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
