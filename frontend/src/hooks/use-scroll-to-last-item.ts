import { useEffect, useRef } from "react";
import { Message } from "../../../server/routers/chat";

const useScrollToLastItem = (messages: Message[]) => {
  const lastMessageRef = useRef<HTMLLIElement>(null);

  // Scroll to the last message when a new message is added
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return lastMessageRef;
};

export default useScrollToLastItem;
