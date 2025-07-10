import { auth } from "../lib/auth.js";
export const authMiddleware = async (c, next) => {
    const session = await auth.api.getSession({
        headers: c.req.raw.headers
    });
    if (!session) {
        return c.json({ message: "Unauthorized" }, 401);
    }
    c.set("userId", session.user.id);
    await next();
};
