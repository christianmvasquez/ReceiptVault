import { supabase } from "./supabase";

export async function addReceipt(
  vendor: string,
  amount: number,
  category: string,
  notes = ""
) {
  const { data, error } = await supabase
    .from("receipts")
    .insert([
      {
        vendor,
        amount,
        category,
        notes,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function getReceipts() {
  const { data, error } = await supabase
    .from("receipts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
