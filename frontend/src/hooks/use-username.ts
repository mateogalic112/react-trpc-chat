import { useEffect, useState } from "react";

const useUsername = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(getUsernameFromStorage());
  }, []);

  return username;
};

const getUsernameFromStorage = () => {
  const storedUsername = sessionStorage.getItem("username");
  if (storedUsername) return storedUsername;

  // If no username exists, create a new one
  const newUsername = "user" + Math.floor(Math.random() * 1000);
  sessionStorage.setItem("username", newUsername);
  return newUsername;
};

export default useUsername;
