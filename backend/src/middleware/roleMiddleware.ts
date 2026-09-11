import type { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Access Denied" });
    return;
  }
  next();
};

export const isDeveloper = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== "developer") {
    res.status(403).json({ message: "Access Denied" });
    return;
  }
  next();
};
