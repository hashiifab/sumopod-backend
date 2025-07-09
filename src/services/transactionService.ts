import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["warn", "error"],
});

export class TransactionService {
  static async getTransactions(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        skip,
        take: limit,
        select: { id: true, amount: true, type: true, date: true },
      }),
      prisma.transaction.count({ where: { userId } }),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getRecentTransactions(userId: string, limit: number = 5) {
    return await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
      select: { id: true, amount: true, type: true, date: true },
    });
  }

  static async getTransactionCount(userId: string) {
    return await prisma.transaction.count({ where: { userId } });
  }
}
