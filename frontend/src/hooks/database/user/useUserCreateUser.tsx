import { useMutation } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { PUser } from "../../../../../types/user.types";
import { db } from "../../../config/firebase";

export const useUserCreateUser = () => {
  return useMutation({
    mutationFn: async (user: PUser) => {
      try {
        const docRef = doc(db, "users", user.id);
        await setDoc(docRef, user, { merge: true });
      } catch (e) {
        console.error(e);
        throw new Error("Error creating user");
      }
    },
  });
};
