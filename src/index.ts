import "dotenv/config";
import { Hono } from "hono";
import authRoute from "./routes/auth";
import { jwt } from "hono/jwt";
import { createInvoice } from "./routes/create-invoice";
import { xenditWebhook } from "./routes/xendit-webhook";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: "http://localhost:3001",
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.route("/", authRoute);

app.use("/create-invoice", jwt({ secret: process.env.JWT_SECRET! }));

app.post("/create-invoice", createInvoice);
app.post("/xendit-webhook", xenditWebhook);

export default app;
