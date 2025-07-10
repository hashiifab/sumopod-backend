import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
    log: ["warn", "error"],
});
export class BalanceService {
    static async getBalance(userId) {
        return await prisma.balance.findFirst({
            where: { userId },
            select: { id: true, userBalance: true, createdAt: true },
        });
    }
}
