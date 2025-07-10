import { Hono } from "hono";
import { auth } from "../lib/auth.js";
const route = new Hono();
route.on(["GET", "POST"], "/api/auth/*", async (c) => {
    const response = await auth.handler(c.req.raw);
    return response;
});
export default route;
