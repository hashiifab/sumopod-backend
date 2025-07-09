import { Context } from "hono";
import { PrismaClient } from "@prisma/client";

const XENDIT_API_KEY = process.env.XENDIT_API_KEY!;
const prisma = new PrismaClient({
  log: ["warn", "error"], // minimal logging
});

export const createInvoice = async (c: Context) => {
  const userId = c.get("userId");
  const body = await c.req.json().catch(() => ({}));

  if (typeof body.amount !== "number" || body.amount <= 0) {
    return c.json({ message: "amount is required" }, 400);
  }

  const inserted = await prisma.payment.create({
    data: {
      userId,
      amount: body.amount,
    },
  });

  const xres = await fetch("https://api.xendit.co/v2/invoices", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(XENDIT_API_KEY + ":"),
    },
    body: JSON.stringify({
      external_id: `sumopod-${inserted.id}`,
      amount: body.amount,
    }),
  });

  const xendit = await xres.json();

  await prisma.payment.update({
    where: { id: inserted.id },
    data: {
      invoiceUrl: xendit.invoice_url ?? null,
    },
  });

  return c.json({ invoice_url: xendit.invoice_url });
};
