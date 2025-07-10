import { Context } from "hono";
import { PaymentService } from "../services/paymentService.js";
import { Variables } from "../types/data.js";

export class PaymentController {
  static async getPayments(c: Context<{ Variables: Variables }>) {
    const userId = c.get("userId") as string;
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "10");

    const result = await PaymentService.getPayments(userId, page, limit);
    return c.json(result);
  }
}
