import { Message } from "../../../server/routers/chat";

interface Props {
  messages: Message[];
  username: string;
}

const MessageList = ({ messages, username }: Props) => {
  return (
    <div className="p-4 space-y-3">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.username === username ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-4 py-2 rounded-lg ${
              message.username === username
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
