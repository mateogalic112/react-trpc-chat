import { trpc } from "@/trpc";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

const MessageInput = ({ username }: { username: string }) => {
  const [text, setText] = useState("");

  const sendMessage = trpc.chat.addMessage.useMutation();
  const typingMessage = trpc.chat.updateTyping.useMutation();

  const submitMessage = () => {
    if (text.length === 0) return;

    // Send the message
    sendMessage.mutate({ text, username });
    // Update typing status
    typingMessage.mutate({ username, typing: false });

    setText("");
  };

  return (
    <div className="flex items-center gap-4">
      <Input
        className="flex-1 dark:bg-slate-900 h-10"
        value={text}
        onChange={(e) => {
          // Update typing status
          typingMessage.mutate({ username, typing: e.target.value.length > 0 });
          setText(e.target.value);
        }}
        placeholder="Type a message..."
        onKeyUp={(e) => {
          if (e.key === "Enter") submitMessage();
        }}
      />

      <Button variant="destructive" size="lg" onClick={submitMessage}>
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
