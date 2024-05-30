import { useEffect, useMemo, useState } from "react";
import { AUTH } from "../services/auth";
import { User } from "firebase/auth";
import { auth } from "../config/firebase";

export const useAuth = () => {
  const [user, setUser] = useState<User>();
  const [isAdmin, setIsAdmin] = useState(false);

  const isLogged = useMemo(() => !!user, [user]);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        await user.getIdTokenResult().then((idTokenResult) => {
          setIsAdmin(!!idTokenResult.claims.admin);
        });
      } else setUser(undefined);
    });
  }, []);

  return {
    user,
    setUser,
    isLogged,
    isAdmin,
    login: AUTH.login,
    logout: AUTH.logout,
  };
};
