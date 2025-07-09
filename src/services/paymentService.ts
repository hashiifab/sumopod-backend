import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["warn", "error"],
});

export class PaymentService {
  static async getPayments(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          amount: true,
          status: true,
          invoiceUrl: true,
          createdAt: true,
        },
      }),
      prisma.payment.count({ where: { userId } }),
    ]);

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getPaymentCount(userId: string) {
    return await prisma.payment.count({ where: { userId } });
  }
}
