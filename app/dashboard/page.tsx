"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import ReceiptCard from "../../components/ReceiptCard";
import ReceiptForm from "../../components/ReceiptForm";
import SummaryCard from "../../components/SummaryCard";
import DashboardStats from "../../components/DashboardStats";
import CategoryBreakdown from "../../components/CategoryBreakdown";
import BrandLogo from "@/components/BrandLogo";

type Receipt = {
  id: string;
  vendor: string;
  amount: number;
  category: string;
  notes?: string | null;
  image_url?: string;
  user_id?: string;
};

function hasActiveSubscription(metadata: Record<string, unknown>) {
  return metadata.subscribed === true || metadata.subscribed === "true";
}

export default function Dashboard() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState("");
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const loadReceipts = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (!hasActiveSubscription(user.user_metadata || {})) {
      router.push("/pricing");
      return;
    }

    const { data, error } = await supabase
      .from("receipts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setReceipts((data as Receipt[]) || []);
    setIsCheckingAccess(false);
  }, [router, supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadReceipts();
  }, [loadReceipts]);

  function startEdit(receipt: Receipt) {
    setEditingReceipt(receipt);
    setVendor(receipt.vendor);
    setAmount(String(receipt.amount));
    setCategory(receipt.category);
    setNotes(receipt.notes || "");
    setFile(null);
    setReceiptPreviewUrl("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingReceipt(null);
    setVendor("");
    setAmount("");
    setCategory("");
    setNotes("");
    setFile(null);
    setReceiptPreviewUrl("");
    setScanMessage("");
  }

  function readFileAsJpegDataUrl(selectedFile: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();

        image.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          if (!context) {
            reject(new Error("Could not prepare receipt image."));
            return;
          }

          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          context.drawImage(image, 0, 0);

          resolve(canvas.toDataURL("image/jpeg", 0.9));
        };

        image.onerror = () => {
          reject(
            new Error(
              "This image format could not be read. Try a JPG, PNG, or screenshot."
            )
          );
        };

        image.src = String(reader.result);
      };
      reader.onerror = () => reject(new Error("Could not read receipt image."));
      reader.readAsDataURL(selectedFile);
    });
  }

  async function handleFileChange(selectedFile: File | null) {
    setFile(selectedFile);
    setReceiptPreviewUrl("");
    setScanMessage("");

    if (!selectedFile) return;

    setIsScanning(true);
    setScanMessage("Reading receipt with AI...");

    try {
      const imageUrl = await readFileAsJpegDataUrl(selectedFile);
      setReceiptPreviewUrl(imageUrl);
      const response = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        setScanMessage(data.error || "AI scan failed. Fill in the fields.");
        return;
      }

      if (data.vendor) setVendor(String(data.vendor));
      if (data.amount) setAmount(String(data.amount));
      if (data.category) setCategory(String(data.category));

      setScanMessage("AI filled the receipt details. Review before saving.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "AI scan failed. Fill in the fields manually.";

      setScanMessage(message);
    } finally {
      setIsScanning(false);
    }
  }

  async function handleDelete(receipt: Receipt) {
    const confirmed = confirm(`Delete receipt from ${receipt.vendor}?`);
    if (!confirmed) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const { error } = await supabase
      .from("receipts")
      .delete()
      .eq("id", receipt.id)
      .eq("user_id", user.id);

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
          notes,
        })
        .eq("id", editingReceipt.id)
        .eq("user_id", user.id);

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
        notes,
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
    setNotes("");
    setFile(null);
    setReceiptPreviewUrl("");

    await loadReceipts();
  }

  const filteredReceipts = receipts.filter((receipt) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      receipt.vendor.toLowerCase().includes(searchText) ||
      receipt.category.toLowerCase().includes(searchText) ||
      (receipt.notes || "").toLowerCase().includes(searchText) ||
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

    const headers = ["Vendor", "Amount", "Category", "Notes", "Image URL"];

    const rows = filteredReceipts.map((receipt) => [
      receipt.vendor,
      String(receipt.amount),
      receipt.category,
      receipt.notes || "",
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
    link.download = "receiptr-export.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  const totalSpending = filteredReceipts.reduce(
    (sum, receipt) => sum + Number(receipt.amount),
    0
  );

  if (isCheckingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-gray-900">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold">Checking subscription...</p>
          <p className="mt-2 text-gray-500">Loading your account.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-6xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <BrandLogo className="h-16 w-auto" />
            <p className="mt-2 text-gray-500">
              Simple receipt tracking for everyday spending.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-[#6D5EF5] px-5 py-3 font-semibold text-white shadow-sm hover:bg-[#5B4CF0]"
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
            notes={notes}
            file={file}
            receiptPreviewUrl={receiptPreviewUrl}
            isEditing={!!editingReceipt}
            isScanning={isScanning}
            scanMessage={scanMessage}
            setVendor={setVendor}
            setAmount={setAmount}
            setCategory={setCategory}
            setNotes={setNotes}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            cancelEdit={cancelEdit}
          />

          <SummaryCard
            receiptCount={filteredReceipts.length}
            totalSpending={totalSpending}
            exportCSV={exportCSV}
          />
        </div>

        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-2xl font-semibold">Recent Receipts</h2>

            <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row lg:max-w-md">
              <input
                className="w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-violet-500 sm:flex-1"
                placeholder="Search receipts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-violet-500 sm:w-40 sm:shrink-0"
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
              <p className="text-gray-500">No receipts found.</p>
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
