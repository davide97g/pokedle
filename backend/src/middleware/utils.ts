import { Request } from "express";
import { getAuth } from "firebase-admin/auth";

export const getUserIdFromToken = async (req: Request) => {
  const bearerToken = req.header("Authorization");
  if (!bearerToken) return null;
  try {
    const tokenInfo = await getAuth().verifyIdToken(
      bearerToken.split("Bearer ")[1]
    );
    return tokenInfo.uid;
  } catch (err) {
    return null;
  }
};
