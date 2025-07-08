// src/routes/auth.ts
import { Hono } from "hono";
import { auth } from "../lib/auth";

const route = new Hono();

route.on(["GET", "POST"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

export default route;
