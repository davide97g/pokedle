import { User } from "firebase/auth";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { auth } from "../config/firebase";
import { useUserCreateUpdateUser } from "../hooks/database/useUserCreateUpdateUser";
import { useUserGetUserById } from "../hooks/database/useUserGetUserById";
import { PUser } from "../types";

interface AuthContext {
  user?: PUser;
  isAdmin: boolean;
  isLogged: boolean;
}

export const AuthContext = createContext({
  user: undefined,
} as AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<User>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { data: user, isFetching } = useUserGetUserById(firebaseUser?.uid);
  const { mutateAsync: createUser } = useUserCreateUpdateUser();

  const isLogged = useMemo(() => !!firebaseUser, [firebaseUser]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setFirebaseUser(user ?? undefined);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (firebaseUser) {
      firebaseUser
        .getIdTokenResult()
        .then((idTokenResult) => {
          setIsAdmin(!!idTokenResult.claims.admin);
        })
        .catch(() => setIsAdmin(false));
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (firebaseUser && !user && !isFetching) {
      createUser({
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName!,
        photoURL: firebaseUser.photoURL!,
      });
    }
  }, [createUser, firebaseUser, isFetching, user]);

  const value = {
    user,
    isAdmin,
    isLogged,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
