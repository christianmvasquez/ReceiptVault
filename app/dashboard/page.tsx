"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ReceiptCard from "../../components/ReceiptCard";
import ReceiptForm from "../../components/ReceiptForm";
import SummaryCard from "../../components/SummaryCard";
import DashboardStats from "../../components/DashboardStats";
import CategoryBreakdown from "../../components/CategoryBreakdown";
import { useRouter } from "next/navigation";

type Receipt = {
  id: string;
  vendor: string;
  amount: number;
  category: string;
  image_url?: string;
};

export default function Dashboard() {
    const router = useRouter();

async function handleLogout() {
  await supabase.auth.signOut();
  router.push("/login");
}
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);

  async function loadReceipts() {
    const { data, error } = await supabase
      .from("receipts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setReceipts((data as Receipt[]) || []);
  }

  useEffect(() => {
    loadReceipts();
  }, []);

  function startEdit(receipt: Receipt) {
    setEditingReceipt(receipt);
    setVendor(receipt.vendor);
    setAmount(String(receipt.amount));
    setCategory(receipt.category);
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingReceipt(null);
    setVendor("");
    setAmount("");
    setCategory("");
    setFile(null);
  }

  async function handleDelete(receipt: Receipt) {
    const confirmed = confirm(`Delete receipt from ${receipt.vendor}?`);
    if (!confirmed) return;

    const { error } = await supabase
      .from("receipts")
      .delete()
      .eq("id", receipt.id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadReceipts();
  }

  async function uploadReceiptImage() {
    if (!file) return "";

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      return "";
    }

    const fileExt = file.name.split(".").pop() || "png";
    const safeFileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${user.id}/${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("receipts")
      .upload(filePath, file);

    if (uploadError) {
      alert(uploadError.message);
      return "";
    }

    const { data } = supabase.storage.from("receipts").getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to save receipts.");
      return;
    }

    if (editingReceipt) {
      const { error } = await supabase
        .from("receipts")
        .update({
          vendor,
          amount: Number(amount),
          category,
        })
        .eq("id", editingReceipt.id);

      if (error) {
        alert(error.message);
        return;
      }

      cancelEdit();
      await loadReceipts();
      return;
    }

    const imageUrl = await uploadReceiptImage();

    const { error } = await supabase.from("receipts").insert([
      {
        vendor,
        amount: Number(amount),
        category,
        image_url: imageUrl,
        user_id: user.id,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setVendor("");
    setAmount("");
    setCategory("");
    setFile(null);

    await loadReceipts();
  }

  const filteredReceipts = receipts.filter((receipt) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      receipt.vendor.toLowerCase().includes(searchText) ||
      receipt.category.toLowerCase().includes(searchText) ||
      String(receipt.amount).includes(searchText);

    const matchesCategory =
      categoryFilter === "All" || receipt.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  function exportCSV() {
    if (filteredReceipts.length === 0) {
      alert("No receipts to export.");
      return;
    }

    const headers = ["Vendor", "Amount", "Category", "Image URL"];

    const rows = filteredReceipts.map((receipt) => [
      receipt.vendor,
      String(receipt.amount),
      receipt.category,
      receipt.image_url || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "receipt-vault-export.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  const totalSpending = filteredReceipts.reduce(
    (sum, receipt) => sum + Number(receipt.amount),
    0
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl p-8">
        <div className="flex items-center justify-between">
  <div>
    <h1 className="text-4xl font-bold">📸 Receipt Vault</h1>

    <p className="mt-2 text-slate-400">
      Track and organize your receipts.
    </p>
  </div>

  <button
    onClick={handleLogout}
    className="rounded-xl bg-slate-800 px-5 py-3 font-semibold hover:bg-slate-700"
  >
    Logout
  </button>
</div>

        <DashboardStats receipts={filteredReceipts} />

        <div className="mt-8">
          <CategoryBreakdown receipts={filteredReceipts} />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <ReceiptForm
            vendor={vendor}
            amount={amount}
            category={category}
            file={file}
            isEditing={!!editingReceipt}
            setVendor={setVendor}
            setAmount={setAmount}
            setCategory={setCategory}
            setFile={setFile}
            handleSubmit={handleSubmit}
            cancelEdit={cancelEdit}
          />

          <SummaryCard
            receiptCount={filteredReceipts.length}
            totalSpending={totalSpending}
            exportCSV={exportCSV}
          />
        </div>

        <div className="mt-8 rounded-2xl bg-slate-900 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-semibold">Recent Receipts</h2>

            <div className="flex flex-col gap-3 md:flex-row">
              <input
                className="w-full rounded-xl bg-slate-950 p-3 md:w-80"
                placeholder="Search receipts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="w-full rounded-xl bg-slate-950 p-3 md:w-48"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Meals">Meals</option>
                <option value="Travel">Travel</option>
                <option value="Supplies">Supplies</option>
                <option value="Equipment">Equipment</option>
                <option value="Fuel">Fuel</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {filteredReceipts.length === 0 ? (
              <p className="text-slate-400">No receipts found.</p>
            ) : (
              filteredReceipts.map((receipt) => (
                <ReceiptCard
                  key={receipt.id}
                  receipt={receipt}
                  onDelete={handleDelete}
                  onEdit={startEdit}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}