import "dotenv/config";
import { Hono } from "hono";
import authRoute from "./routes/auth";
import { createInvoice } from "./routes/create-invoice";
import { xenditWebhook } from "./routes/xendit-webhook";
import dataRoute from "./routes/data";
import { cors } from "hono/cors";
import { authMiddleware } from "./middleware/auth";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3001", "*", "null"],
    allowHeaders: ["Content-Type", "Authorization", "X-Session-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.route("/", authRoute);
app.route("/api/data", dataRoute);

app.use("/create-invoice", authMiddleware);

app.post("/create-invoice", createInvoice);
app.post("/xendit-webhook", xenditWebhook);

export default app;
