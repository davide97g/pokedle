import { NextFunction, Request, Response } from "express";
import { getAppCheck } from "firebase-admin/app-check";
import { getAuth } from "firebase-admin/auth";

export const isPro = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const appCheckToken = req.header("X-Firebase-AppCheck");
  const bearerToken = req.header("Authorization");

  if (!appCheckToken || !bearerToken) {
    res.status(401);
    return next({ message: "Unauthorized: no token" });
  }

  try {
    await getAppCheck().verifyToken(appCheckToken);
    await getAuth().verifyIdToken(bearerToken.split("Bearer ")[1]);
    return next();
  } catch (err) {
    res.status(401);
    return next({ message: "Unauthorized: user not authorized" });
  }
};
