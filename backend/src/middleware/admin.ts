import { NextFunction, Request, Response } from "express";
import { getAppCheck } from "firebase-admin/app-check";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const appCheckToken = req.header("X-Firebase-AppCheck");

  if (!appCheckToken) {
    res.status(401);
    return next({ message: "Unauthorized: no token" });
  }

  try {
    await getAppCheck().verifyToken(appCheckToken);
    return next();
  } catch (err) {
    res.status(401);
    return next({ message: "Unauthorized: user not authorized" });
  }
};
