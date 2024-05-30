import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { PUser } from "../../../types";
import { useMutation } from "@tanstack/react-query";

export const useUserUpdateUser = () => {
  return useMutation({
    mutationFn: async (user: Partial<PUser>) => {
      if (!user.id) throw new Error("User id is required");
      try {
        const docRef = doc(db, "users", user.id!);
        await setDoc(docRef, user, { merge: true });
      } catch (e) {
        console.error(e);
        throw new Error("Error creating user");
      }
    },
  });
};
