import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { BalanceController } from "../controllers/balanceController";
import { TransactionController } from "../controllers/transactionController";
import { PaymentController } from "../controllers/paymentController";
import { Variables } from "../types/data";

const route = new Hono<{ Variables: Variables }>();

route.use("*", authMiddleware);

// Balance routes
route.get("/balance", BalanceController.getBalance);

// Transaction routes
route.get("/transactions", TransactionController.getTransactions);

// Payment routes
route.get("/payments", PaymentController.getPayments);

export default route;
