import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { PUser } from "../../../../../types/user.types";
import { db } from "../../../config/firebase";

export const useUserGetUserById = (id?: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const docRef = doc(db, "users", id!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data() as PUser;
      return undefined;
    },
    enabled: !!id,
  });
};
