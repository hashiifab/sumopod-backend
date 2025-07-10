import { TransactionService } from "../services/transactionService.js";
export class TransactionController {
    static async getTransactions(c) {
        const userId = c.get("userId");
        const page = parseInt(c.req.query("page") || "1");
        const limit = parseInt(c.req.query("limit") || "10");
        const result = await TransactionService.getTransactions(userId, page, limit);
        return c.json(result);
    }
}
