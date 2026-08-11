type Receipt = {
  id: string;
  vendor: string;
  amount: number;
  category: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function CategoryBreakdown({
  receipts,
}: {
  receipts: Receipt[];
}) {
  const totals: Record<string, number> = {};

  receipts.forEach((receipt) => {
    totals[receipt.category] =
      (totals[receipt.category] || 0) + Number(receipt.amount);
  });

  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const max = sorted.length ? sorted[0][1] : 1;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Spending by Category</h2>
      </div>

      <div className="space-y-5">
        {sorted.map(([category, total]) => (
          <div key={category}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium">{category}</span>
              <span className="text-gray-500">{formatCurrency(total)}</span>
            </div>

            <div className="h-3 w-full rounded-full bg-gray-100">
              <div
                className="h-3 rounded-full bg-[#6D5EF5]"
                style={{
                  width: `${(total / max) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}

        {sorted.length === 0 && (
          <p className="rounded-2xl bg-gray-50 p-5 text-gray-500">
            Upload receipts to start tracking spending by category.
          </p>
        )}
      </div>

      <p className="mt-6 text-sm text-gray-400">
        Confirm deductions with a tax professional.
      </p>
    </div>
  );
}
