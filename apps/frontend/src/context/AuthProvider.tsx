import { User } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth } from "../config/firebase";

interface AuthContext {
  user?: User;
}

export const AuthContext = createContext({
  user: undefined,
} as AuthContext);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setFirebaseUser(user ?? undefined);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user: firebaseUser,
    }),
    [firebaseUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = AuthContext;
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return useContext(AuthContext);
};
