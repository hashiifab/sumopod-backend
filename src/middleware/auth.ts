import { Context, Next } from "hono";
import { jwtVerify, createLocalJWKSet } from "jose";

type Variables = {
  userId: string;
};

export const authMiddleware = async (c: Context<{ Variables: Variables }>, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const token = authHeader.substring(7);
  const jwksResponse = await fetch("http://localhost:3000/api/auth/jwks");
  const jwksData = await jwksResponse.json();
  const JWKS = createLocalJWKSet(jwksData);
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: "http://localhost:3000",
    audience: "http://localhost:3000",
  });

  const userId = payload.sub || payload.id;
  if (!userId) return c.json({ message: "Unauthorized" }, 401);
  (c as any).set("userId", userId);
  await next();
};
