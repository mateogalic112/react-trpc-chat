import { useEffect, useState } from "react";

const useCountdown = (currentUser: string) => {
  const [countdown, setCountdown] = useState({
    counter: null as number | null,
    url: null as string | null,
    username: "",
  });

  // Start the countdown when a new message is received
  useEffect(() => {
    if (countdown.counter !== null && countdown.counter > 0) {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => ({
          ...prevCountdown,
          counter: prevCountdown.counter! - 1,
        }));
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on unmount or reset
    }
  }, [countdown, currentUser]);

  // Open the URL when the countdown reaches 0
  useEffect(() => {
    if (
      countdown.counter === 0 &&
      countdown.url &&
      countdown.username !== currentUser
    ) {
      window.open(countdown.url, "_blank"); // Open the URL in a new tab
      setCountdown({ counter: null, url: null, username: "" });
    }
  }, [countdown.counter, countdown.url, countdown.username, currentUser]);

  return { countdown, setCountdown };
};

export default useCountdown;
