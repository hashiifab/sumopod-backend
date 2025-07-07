import { Context } from "hono";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const XENDIT_CALLBACK_TOKEN = process.env.XENDIT_CALLBACK_TOKEN!;

export const xenditWebhookHandler = async (c: Context) => {
  const token = c.req.header("x-callback-token");
  if (token !== XENDIT_CALLBACK_TOKEN) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const body = await c.req.json();
  const { external_id, amount } = body;
  const id = external_id?.split("-")[1];

  if (!id || !amount) {
    return c.json({ message: "Invalid payload" }, 400);
  }

  const { data: payment } = await supabase
    .from("payments")
    .select("user_id")
    .eq("id", id)
    .single();

  const user_id = payment?.user_id;

  await supabase.from("payments").update({ status: "paid" }).eq("id", id);

  const { data: balance } = await supabase
    .from("balances")
    .select("user_balance")
    .eq("user_id", user_id)
    .single();

  if (!balance) {
    await supabase.from("balances").insert({ user_id, user_balance: amount });
  } else {
    await supabase
      .from("balances")
      .update({ user_balance: balance.user_balance + amount })
      .eq("user_id", user_id);
  }

  await supabase
    .from("transactions")
    .insert({ user_id, type: "purchase", amount });

  return c.json({ status: "ok" });
};
