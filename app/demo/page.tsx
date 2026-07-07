export default function DemoPage() {
  const receipts = [
    ["Whole Foods Market", "Groceries", "$87.65"],
    ["Uber", "Transportation", "$23.14"],
    ["Amazon", "Shopping", "$129.99"],
    ["Starbucks", "Dining", "$6.75"],
    ["Shell", "Gas", "$42.31"],
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Receiptr Demo</h1>
            <p className="mt-2 text-gray-500">
              Explore how Receiptr organizes receipts and tracks expenses.
            </p>
          </div>

          <a
            href="/signup"
            className="rounded-xl bg-[#6D5EF5] px-6 py-3 font-semibold text-white hover:bg-[#5B4CF0]"
          >
            Subscribe to Unlock
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Spent</p>
            <h2 className="mt-2 text-3xl font-bold">$2,567.89</h2>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Receipts</p>
            <h2 className="mt-2 text-3xl font-bold">48</h2>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Categories</p>
            <h2 className="mt-2 text-3xl font-bold">12</h2>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Avg. Per Day</p>
            <h2 className="mt-2 text-3xl font-bold">$82.84</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm md:col-span-2">
            <h3 className="text-xl font-bold">Recent Receipts</h3>

            <div className="mt-6 space-y-4">
              {receipts.map(([store, category, amount]) => (
                <div
                  key={store}
                  className="flex items-center justify-between rounded-xl border bg-gray-50 p-4"
                >
                  <div>
                    <p className="font-semibold">{store}</p>
                    <p className="text-sm text-gray-500">{category}</p>
                  </div>
                  <p className="font-bold">{amount}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold">Premium Actions</h3>

            <div className="mt-6 space-y-3">
              {["Upload Receipt", "AI Scan", "Export CSV", "Create Report"].map(
                (item) => (
                  <button
                    key={item}
                    className="w-full rounded-xl border bg-gray-50 p-4 text-left font-semibold text-gray-400"
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <p className="mt-5 text-sm text-gray-500">
              Subscribe to unlock uploads, AI scanning, exports, and saved data.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
