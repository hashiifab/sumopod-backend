import "dotenv/config";
import { Hono } from "hono";
import authRoute from "./routes/auth.js";
import { createInvoice } from "./routes/create-invoice.js";
import { xenditWebhook } from "./routes/xendit-webhook.js";
import dataRoute from "./routes/data.js";
import { cors } from "hono/cors";
import { authMiddleware } from "./middleware/auth.js";
const app = new Hono();
// CORS Configuration from environment variables
const corsOrigins = process.env.CORS_ORIGINS?.split(',') || ["http://localhost:3001", "https://cloone-sumopod.netlify.app"];
const corsAllowHeaders = process.env.CORS_ALLOW_HEADERS?.split(',') || ["Content-Type", "Authorization", "X-Session-Token"];
const corsAllowMethods = process.env.CORS_ALLOW_METHODS?.split(',') || ["GET", "POST", "PUT", "DELETE", "OPTIONS"];
app.use("*", cors({
    origin: [...corsOrigins, "*", "null"],
    allowHeaders: corsAllowHeaders,
    allowMethods: corsAllowMethods,
    credentials: true,
}));
app.route("/", authRoute);
app.route("/api/data", dataRoute);
app.use("/create-invoice", authMiddleware);
app.post("/create-invoice", createInvoice);
app.post("/xendit-webhook", xenditWebhook);
const port = process.env.PORT || 8080;
console.log(`Server is running on port ${port}`);
// For Bun/Cloudflare Workers
export default {
    port,
    fetch: app.fetch,
};
// For Node.js deployment
if (typeof Bun === "undefined") {
    import("@hono/node-server").then(({ serve }) => {
        const server = serve({
            fetch: app.fetch,
            port: Number(port),
        });
        console.log(`HTTP server started on port ${port}`);
        // Keep the process alive
        process.on('SIGTERM', () => {
            console.log('Received SIGTERM, shutting down gracefully');
            server.close(() => {
                process.exit(0);
            });
        });
        process.on('SIGINT', () => {
            console.log('Received SIGINT, shutting down gracefully');
            server.close(() => {
                process.exit(0);
            });
        });
    }).catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
}
