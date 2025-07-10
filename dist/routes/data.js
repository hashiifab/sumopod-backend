import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import { BalanceController } from "../controllers/balanceController.js";
import { TransactionController } from "../controllers/transactionController.js";
import { PaymentController } from "../controllers/paymentController.js";
const route = new Hono();
route.use("*", authMiddleware);
// Balance routes
route.get("/balance", BalanceController.getBalance);
// Transaction routes
route.get("/transactions", TransactionController.getTransactions);
// Payment routes
route.get("/payments", PaymentController.getPayments);
export default route;
