import { db } from "../database";
import { eq } from "drizzle-orm";
import { users } from "../database/schema";
import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      currentUser: typeof users.$inferSelect;
    }
  }
}

const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization as string;

    if (!authHeader?.startsWith("Bearer ")) {
      return next(res.status(401).json({ message: "You are not authorized!" }));
    }

    // Get clerk Id from headers
    const clerkId = authHeader.split(" ")[1];

    // Verify if user exists in db
    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .then((res) => res[0]);

    if (!userExists) {
      return next(res.status(401).json({ message: "You are not authorized!" }));
    }

    req.currentUser = userExists;

    next();
  } catch (error) {
    console.log("Verify Auth Err", error);

    return next(res.status(500).json({ message: "Internal server error" }));
  }
};

export default verifyAuth;
