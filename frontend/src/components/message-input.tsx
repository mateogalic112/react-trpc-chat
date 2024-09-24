import { trpc } from "@/trpc";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

const MessageInput = ({ username }: { username: string }) => {
  const [text, setText] = useState("");

  const sendMessage = trpc.chat.addMessage.useMutation();
  const changeNickname = trpc.chat.changeNickname.useMutation();

  const submitMessage = () => {
    if (text.startsWith("/think ")) {
      sendMessage.mutate({
        text: text.replace("/think ", "").trim(),
        username,
        timestamp: Date.now(),
        special: true,
      });
    } else {
      sendMessage.mutate({ text, username, timestamp: Date.now() });
    }

    if (text.startsWith("/nick ")) {
      const newUsername = text.replace("/nick ", "");
      changeNickname.mutate({ username, nickname: newUsername });
    }

    setText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitMessage();
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

      <Button variant="destructive" size="lg" onClick={submitMessage}>
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
