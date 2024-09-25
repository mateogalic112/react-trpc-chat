export const getUsernameFromLocalStorage = () => {
  const storedUsername = localStorage.getItem("username");
  if (storedUsername) return storedUsername;

  // If no username exists, create a new one
  const newUsername = "user" + Math.floor(Math.random() * 1000);
  localStorage.setItem("username", newUsername);
  return newUsername;
};
