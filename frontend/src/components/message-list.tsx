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
            message.userId === "user1" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-4 py-2 rounded-lg ${
              message.userId === "user1"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
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
