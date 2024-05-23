import { useState } from "react";

export const useUser = () => {
  // url contains "admin"
  // url contains "pro"
  const url = window.location.href;

  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(url.includes("admin"));
  const [isPro, setIsPro] = useState(url.includes("pro"));

  return {
    isLogged,
    setIsLogged,
    isAdmin,
    setIsAdmin,
    isPro,
    setIsPro,
  };
};
