import type { Request, Response, NextFunction } from "express";
import jwt, {type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.userId = decoded.userId as string;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
