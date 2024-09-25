import { getUsernameFromLocalStorage } from "@/utils";
import { useEffect, useState } from "react";

const useUsername = () => {
  // Load the username from localStorage (or generate it)
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = getUsernameFromLocalStorage();
    setUsername(storedUsername);
  }, []);

  return username;
};

export default useUsername;
