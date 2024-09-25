import { trpc } from "@/trpc";
import { useState } from "react";

const useTypingUsers = (currentUser: string) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  trpc.chat.onTypingUpdate.useSubscription(undefined, {
    onData(usernames) {
      const typingUsers = usernames.filter((u) => u !== currentUser);
      setTypingUsers(typingUsers);
      console.log("Typing users:", usernames);
    },
    onError(err) {
      console.error("Subscription error:", err);
    },
  });

  return typingUsers;
};

export default useTypingUsers;
