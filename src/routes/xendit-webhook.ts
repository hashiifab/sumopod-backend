import { Context } from "hono";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const XENDIT_CALLBACK_TOKEN = process.env.XENDIT_CALLBACK_TOKEN!;

export const xenditWebhook = async (c: Context) => {
  const token = c.req.header("x-callback-token");
  if (token !== XENDIT_CALLBACK_TOKEN) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const body = await c.req.json();
  const { external_id, amount } = body;

  const idString = external_id?.replace("sumopod-", "");
  const id = parseInt(idString);

  if (!id || !amount || isNaN(id)) {
    return c.json({ message: "Invalid payload" }, 400);
  }

  const payment = await prisma.payment.findUnique({
    where: { id },
    select: { userId: true },
  });

  const userId = payment?.userId;

  if (!userId) {
    return c.json({ message: "Payment not found" }, 404);
  }

  await prisma.payment.update({
    where: { id },
    data: { status: "paid" },
  });

  let balance = await prisma.balance.findFirst({
    where: { userId },
    select: { id: true, userBalance: true },
  });

  if (!balance) {
    balance = await prisma.balance.create({
      data: { userId, userBalance: 0 },
      select: { id: true, userBalance: true },
    });
  }

  const newBalance = (balance.userBalance || 0) + amount;

  await prisma.balance.update({
    where: { id: balance.id },
    data: { userBalance: newBalance },
  });

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type: "purchase",
      amount,
    },
  });

  return c.json({
    status: "ok",
  });
};
