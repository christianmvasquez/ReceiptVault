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
  const totalWriteOffs = sorted.reduce((sum, [, total]) => sum + total, 0);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Write-Offs by Category</h2>
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
            Upload receipts to start tracking possible write-offs.
          </p>
        )}
      </div>

      <p className="mt-6 text-sm text-gray-400">
        Write-offs usually reduce taxable income, not taxes dollar-for-dollar.
        Eligibility depends on business use and tax rules. Confirm deductions
        with a tax professional.
      </p>
    </div>
  );
}
