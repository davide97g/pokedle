import { Request } from "express";
import { getAuth } from "firebase-admin/auth";

export const getUserInfoFromToken = async (
  req: Request
): Promise<{
  uid: string;
  displayName: string;
  photoURL: string;
} | null> => {
  const bearerToken = req.header("Authorization");
  if (!bearerToken) return null;
  try {
    const tokenInfo = await getAuth().verifyIdToken(
      bearerToken.split("Bearer ")[1]
    );
    return {
      uid: tokenInfo.uid,
      displayName: tokenInfo.name,
      photoURL: tokenInfo.picture!,
    };
  } catch (err) {
    return null;
  }
};
