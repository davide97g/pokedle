import { User } from "firebase/auth";
import { createContext } from "react";

interface AuthContext {
  user?: User;
  setUser?: (user: User) => void;
}

export const AuthContext = createContext<AuthContext>({
  user: undefined,
  setUser: () => {},
});
