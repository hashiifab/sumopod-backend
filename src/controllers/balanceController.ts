import { Context } from "hono";
import { BalanceService } from "../services/balanceService.js";
import { Variables } from "../types/data.js";

export class BalanceController {
  static async getBalance(c: Context<{ Variables: Variables }>) {
    const userId = c.get("userId") as string;
    const balance = await BalanceService.getBalance(userId);

    return c.json(
      balance ?? {
        userBalance: 0,
        createdAt: new Date(),
      }
    );
  }
}
