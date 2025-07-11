import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import { BalanceController } from "../controllers/balanceController.js";
import { TransactionController } from "../controllers/transactionController.js";
import { PaymentController } from "../controllers/paymentController.js";
import { Variables } from "../types/data.js";

const route = new Hono<{ Variables: Variables }>();

route.use("*", authMiddleware);

// Balance routes
route.get("/balance", BalanceController.getBalance);

// Transaction routes
route.get("/transactions", TransactionController.getTransactions);

// Payment routes
route.get("/payments", PaymentController.getPayments);

export default route;
