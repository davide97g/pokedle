import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const provider = new GoogleAuthProvider();

export const AUTH = {
  login: async () => {
    return signInWithPopup(auth, provider)
      .then((result) => {
        console.info(result);
        return result;
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  },
  logout: async () => {
    return signOut(auth)
      .then(() => {
        console.info("Logged out");
        return true;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  },
};
