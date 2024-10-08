import { useTheme } from "@/components/theme-provider";
import { trpc } from "@/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import useCountdown from "./use-countdown";
import { Message } from "../../../server/routers/chat";

const useMessageAddSub = (username: string) => {
  const queryClient = useQueryClient();

  const { setTheme } = useTheme();

  const { countdown, setCountdown } = useCountdown(username);

  trpc.chat.onMessageAdd.useSubscription(undefined, {
    onData(newMessage) {
      // `/nick <nickname>` - sets the user's nickname - the nickname should appear as the title of the other user's browser tab
      if (
        newMessage.text.startsWith("/nick ") &&
        newMessage.username !== username
      ) {
        const documentTitle = newMessage.text.replace("/nick ", "").trim();

        if (documentTitle.length > 0) {
          document.title = documentTitle;
        }
      }

      // `/light` - should change the theme of the chat to light (only for the user who issued the command)
      if (newMessage.text === "/light" && newMessage.username === username) {
        setTheme("light");
      }

      // `/dark` - should change the theme of the chat to dark (only for the user who issued the command)
      if (newMessage.text === "/dark" && newMessage.username === username) {
        setTheme("dark");
      }

      // `/countdown <number> <url>` - should start a visible countdown on the other persons browser, and at the end of the countdown open the new window with the `url` specified.
      if (newMessage.text.startsWith("/countdown ")) {
        const parsedCountdown = parseCountdown(newMessage);
        if (parsedCountdown) {
          setCountdown({
            counter: parsedCountdown!.counter,
            url: parsedCountdown!.url,
            username: newMessage.username,
          });
        }
      }

      // - When new message arrives, it should trigger a sound notification
      if (newMessage.username !== username) {
        new Audio("/popup.mp3").play();
      }

      // - When new message arrives, it should invalidate the messages query
      queryClient.invalidateQueries(
        getQueryKey(trpc.chat.messages, undefined, "query")
      );
    },
    onError(err) {
      console.error("Subscription error:", err);
    },
  });

  return { countdown };
};

const parseCountdown = (newMessage: Message) => {
  const [, count, url] = newMessage.text.split(" ");
  if (!count || !url) return null;

  const parsedCount = parseInt(count, 10);
  if (isNaN(parsedCount)) return null;

  const urlRegex =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

  if (!urlRegex.test(url)) return null;

  return {
    counter: parsedCount,
    url,
    username: newMessage.username,
  };
};

export default useMessageAddSub;
