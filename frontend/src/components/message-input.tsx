import { trpc } from "@/trpc";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

const MessageInput = () => {
  const [text, setText] = useState("");

  const mutation = trpc.chat.addMessage.useMutation();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      mutation.mutate({ text, username: "user1" });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Input
        className="flex-1 bg-slate-900 h-10"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        onKeyUp={handleKeyPress}
      />

      <Button
        variant="destructive"
        size="lg"
        onClick={() => mutation.mutate({ text, username: "user1" })}
      >
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
