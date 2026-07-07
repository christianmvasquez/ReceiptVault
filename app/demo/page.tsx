"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import BrandLogo from "@/components/BrandLogo";

const sampleReceipts = [
  {
    id: "1",
    vendor: "Whole Foods Market",
    amount: 87.65,
    category: "Meals",
    date: "Jul 7",
  },
  {
    id: "2",
    vendor: "Shell",
    amount: 42.31,
    category: "Fuel",
    date: "Jul 6",
  },
  {
    id: "3",
    vendor: "Amazon Business",
    amount: 129.99,
    category: "Supplies",
    date: "Jul 5",
  },
  {
    id: "4",
    vendor: "Delta Air Lines",
    amount: 416.2,
    category: "Travel",
    date: "Jul 4",
  },
  {
    id: "5",
    vendor: "Apple Store",
    amount: 219.0,
    category: "Equipment",
    date: "Jul 3",
  },
  {
    id: "6",
    vendor: "Starbucks",
    amount: 12.48,
    category: "Meals",
    date: "Jul 2",
  },
];

const categories = ["All", "Meals", "Fuel", "Supplies", "Travel", "Equipment"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function DemoPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [scanState, setScanState] = useState<"idle" | "scanning" | "done">(
    "idle"
  );

  const filteredReceipts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sampleReceipts.filter((receipt) => {
      const matchesCategory =
        category === "All" || receipt.category === category;
      const matchesSearch =
        !query ||
        receipt.vendor.toLowerCase().includes(query) ||
        receipt.category.toLowerCase().includes(query) ||
        String(receipt.amount).includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const totalWriteOffs = filteredReceipts.reduce(
    (sum, receipt) => sum + receipt.amount,
    0
  );

  const categoryTotals = categories
    .filter((item) => item !== "All")
    .map((item) => ({
      category: item,
      total: filteredReceipts
        .filter((receipt) => receipt.category === item)
        .reduce((sum, receipt) => sum + receipt.amount, 0),
    }))
    .filter((item) => item.total > 0);

  const maxCategory = Math.max(
    ...categoryTotals.map((item) => item.total),
    1
  );
  const topCategory = [...categoryTotals].sort((a, b) => b.total - a.total)[0];

  function runDemoScan() {
    setScanState("scanning");
    window.setTimeout(() => setScanState("done"), 900);
  }

  return (
    <main className="min-h-screen bg-white px-6 py-8 text-gray-900">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" aria-label="Receiptr home">
          <BrandLogo className="h-14 w-auto" />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl border border-gray-300 px-5 py-3 font-semibold hover:bg-white"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            className="rounded-xl bg-[#6D5EF5] px-5 py-3 font-semibold text-white hover:bg-[#5B4CF0]"
          >
            Subscribe Now
          </Link>
        </div>
      </nav>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <p className="mt-2 text-gray-500">
              Simple receipt tracking for everyday spending.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Tracked Write-Offs
            </p>
            <p className="mt-2 text-3xl font-bold">
              {formatCurrency(totalWriteOffs)}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Potential deductions logged
            </p>
          </div>

          <div className="rounded-3xl bg-[#6D5EF5] p-5 text-white shadow-sm">
            <p className="text-sm font-medium text-violet-100">
              Possible Taxable Income Reduction
            </p>
            <p className="mt-2 text-3xl font-bold">
              {formatCurrency(totalWriteOffs)}
            </p>
            <p className="mt-2 text-sm text-violet-100">
              If expenses qualify as deductible
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Receipts Saved</p>
            <p className="mt-2 text-3xl font-bold">
              {filteredReceipts.length}
            </p>
            <p className="mt-2 text-sm text-gray-500">Ready for tax time</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Top Write-Off</p>
            <p className="mt-2 text-3xl font-bold">
              {topCategory?.category || "None"}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {topCategory ? formatCurrency(topCategory.total) : "No receipts"}
            </p>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Write-Offs by Category
              </h2>
              <p className="mt-2 text-gray-500">
                Track possible business deductions by category before tax time.
              </p>
            </div>

            <div className="rounded-2xl bg-violet-50 px-5 py-4 text-violet-900">
              <p className="text-sm font-semibold">Potential Deductions</p>
              <p className="mt-1 text-2xl font-bold">
                {formatCurrency(totalWriteOffs)}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {categoryTotals.map((item) => (
              <div key={item.category}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-gray-500">
                    {formatCurrency(item.total)}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-gray-100">
                  <div
                    className="h-3 rounded-full bg-[#6D5EF5]"
                    style={{
                      width: `${(item.total / maxCategory) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-gray-400">
            Write-offs usually reduce taxable income, not taxes
            dollar-for-dollar. Eligibility depends on business use and tax
            rules.
          </p>
        </section>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold">Recent Receipts</h2>

              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search receipts..."
                  className="rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-violet-500 md:w-72"
                />

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-violet-500 md:w-44"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 divide-y divide-gray-100">
              {filteredReceipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className="grid grid-cols-[1fr_auto] gap-4 py-4"
                >
                  <div>
                    <p className="font-semibold">{receipt.vendor}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {receipt.category} · {receipt.date}
                    </p>
                  </div>

                  <p className="font-bold">{formatCurrency(receipt.amount)}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">AI Scan Preview</h2>
              <p className="mt-2 text-gray-500">
                Watch how an uploaded receipt can fill the form.
              </p>

              <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5">
                <p className="font-semibold">
                  {scanState === "idle" && "receipt-photo.jpg"}
                  {scanState === "scanning" && "Reading receipt..."}
                  {scanState === "done" && "AI details found"}
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-xl bg-white p-3">
                    Vendor:{" "}
                    <span className="font-semibold">
                      {scanState === "done" ? "Whole Foods Market" : "-"}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    Amount:{" "}
                    <span className="font-semibold">
                      {scanState === "done" ? "$87.65" : "-"}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    Category:{" "}
                    <span className="font-semibold">
                      {scanState === "done" ? "Meals" : "-"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={runDemoScan}
                className="mt-5 w-full rounded-xl bg-[#6D5EF5] p-3 font-semibold text-white hover:bg-[#5B4CF0]"
              >
                {scanState === "scanning" ? "Scanning..." : "Run Demo Scan"}
              </button>
            </section>

            <Link
              href="/signup"
              className="block rounded-2xl bg-[#6D5EF5] p-5 text-center font-semibold text-white hover:bg-[#5B4CF0]"
            >
              Subscribe to upload real receipts
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
