import { useState } from "react";

export const useUser = () => {
  // url contains "admin"
  // url contains "pro"
  // const url = window.location.href;

  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [isPro, setIsPro] = useState(true);

  return {
    isLogged,
    setIsLogged,
    isAdmin,
    setIsAdmin,
    isPro,
    setIsPro,
  };
};
