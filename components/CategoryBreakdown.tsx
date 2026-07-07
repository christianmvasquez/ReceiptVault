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
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold">Expenses by Category</h2>

      <div className="space-y-5">
        {sorted.map(([category, total]) => (
          <div key={category}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium">{category}</span>
              <span className="text-gray-500">${total.toFixed(2)}</span>
            </div>

            <div className="h-3 w-full rounded-full bg-gray-100">
              <div
                className="h-3 rounded-full bg-blue-600"
                style={{
                  width: `${(total / max) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}

        {sorted.length === 0 && (
          <p className="text-gray-500">No receipts yet.</p>
        )}
      </div>
    </div>
  );
}