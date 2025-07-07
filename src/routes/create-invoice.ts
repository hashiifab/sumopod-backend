import { Context } from "hono";
import { createClient } from "@supabase/supabase-js";

const XENDIT_API_KEY = process.env.XENDIT_API_KEY!;

const getSupabase = (token: string) =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

export const createInvoice = async (c: Context) => {
  const jwtPayload = c.get("jwtPayload");
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  const body = await c.req.json().catch(() => ({}));

  if (typeof body.amount !== "number" || body.amount <= 0) {
    return c.json({ message: "amount is required" }, 400);
  }

  const supabase = getSupabase(token!);

  const { data: inserted } = await supabase
    .from("payments")
    .insert({ user_id: jwtPayload.sub, amount: body.amount })
    .select()
    .single();

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

  await supabase
    .from("payments")
    .update({ invoice_url: xendit.invoice_url })
    .eq("id", inserted.id);

  return c.json({ invoice_url: xendit.invoice_url });
};
