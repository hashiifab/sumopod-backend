import { Context } from "hono";
import { TransactionService } from "../services/transactionService.js";
import { Variables } from "../types/data.js";

export class TransactionController {
  static async getTransactions(c: Context<{ Variables: Variables }>) {
    const userId = c.get("userId") as string;
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "10");

    const result = await TransactionService.getTransactions(userId, page, limit);
    return c.json(result);
  }
}
