import { BalanceService } from "../services/balanceService.js";
export class BalanceController {
    static async getBalance(c) {
        const userId = c.get("userId");
        const balance = await BalanceService.getBalance(userId);
        return c.json(balance ?? {
            userBalance: 0,
            createdAt: new Date(),
        });
    }
}
