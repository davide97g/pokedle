import { User } from "firebase/auth";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { auth } from "../config/firebase";

import { useUserGetUserById } from "../hooks/database/user/useUserGetUserById";
import { useUserCreateUser } from "../hooks/database/user/useUserCreateUser";
import { PUser } from "../../../types/user.types";

interface AuthContext {
  user?: PUser;
  isAdmin: boolean;
  isLogged: boolean;
  refetch: () => void;
}

export const AuthContext = createContext({
  user: undefined,
} as AuthContext);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<User>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const {
    data: user,
    isFetching,
    refetch,
  } = useUserGetUserById(firebaseUser?.uid);
  const { mutateAsync: createUser } = useUserCreateUser();

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

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      isLogged,
      refetch,
    }),
    [user, isAdmin, isLogged, refetch]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
