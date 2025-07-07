import { Hono } from "hono";
import { jwt } from "hono/jwt";

const app = new Hono();

app.use("/testing", jwt({ secret: process.env.JWT_SECRET! }));

app.post("/testing", (c) => {
  const payload = c.get('jwtPayload')
  return c.json(payload);
});


export default app;
