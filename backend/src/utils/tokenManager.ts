import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        balance: number;
      };
    }
  }
}

export const createToken = (
  id: string,
  email: string,
  name: string,
  role: string,
  balance: number,
  expiresIn: string
): string => {
  const payload = { id, email, name, role, balance };
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    { expiresIn } as jwt.SignOptions
  );
  return token;
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Attach the decoded user information to the request object
    req.user = decoded as Express.Request["user"];
    next();
  });
};
