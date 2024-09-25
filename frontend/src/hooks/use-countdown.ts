import { useEffect, useState } from "react";

const useCountdown = (currentUser: string) => {
  const [countdown, setCountdown] = useState({
    counter: null as number | null,
    url: null as string | null,
    username: "",
  });

  useEffect(() => {
    if (countdown.counter !== null && countdown.counter > 0) {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => ({
          ...prevCountdown,
          counter: prevCountdown.counter! - 1,
        }));
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on unmount or reset
    } else if (
      countdown.counter === 0 &&
      countdown.url &&
      countdown.username !== currentUser
    ) {
      window.open(countdown.url, "_blank"); // Open the URL in a new tab
      setCountdown({ counter: null, url: null, username: "" });
    }
  }, [countdown, currentUser]);

  return { countdown, setCountdown };
};

export default useCountdown;
