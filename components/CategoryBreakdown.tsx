type Receipt = {
  id: string;
  vendor: string;
  amount: number;
  category: string;
};

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
    <div className="rounded-2xl bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Expenses by Category
      </h2>

      <div className="space-y-5">
        {sorted.map(([category, total]) => (
          <div key={category}>
            <div className="flex justify-between mb-2">
              <span>{category}</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="w-full rounded-full bg-slate-800 h-3">
              <div
                className="h-3 rounded-full bg-blue-500"
                style={{
                  width: `${(total / max) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}

        {sorted.length === 0 && (
          <p className="text-slate-400">
            No receipts yet.
          </p>
        )}
      </div>
    </div>
  );
}