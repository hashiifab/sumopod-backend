import { Context, Next } from "hono";
import { auth } from "../lib/auth.js";

type Variables = {
  userId: string;
};

export const authMiddleware = async (c: Context<{ Variables: Variables }>, next: Next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers
  });

  if (!session) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  (c as any).set("userId", session.user.id);
  await next();
};
