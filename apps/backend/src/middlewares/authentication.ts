import { NextFunction, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";

export const isLogged = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerToken = req.header("Authorization");

  if (!bearerToken) {
    res.status(401);
    return next({ message: "Unauthorized: no token" });
  }

  try {
    await getAuth().verifyIdToken(bearerToken.split("Bearer ")[1]);
    return next();
  } catch (err) {
    res.status(401);
    return next({ message: "Unauthorized: user not authorized" });
  }
};
