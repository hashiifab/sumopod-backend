import { PaymentService } from "../services/paymentService.js";
export class PaymentController {
    static async getPayments(c) {
        const userId = c.get("userId");
        const page = parseInt(c.req.query("page") || "1");
        const limit = parseInt(c.req.query("limit") || "10");
        const result = await PaymentService.getPayments(userId, page, limit);
        return c.json(result);
    }
}
