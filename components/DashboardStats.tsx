type Receipt = {
  id: string;
  vendor: string;
  amount: number;
  category: string;
  image_url?: string;
};

type DashboardStatsProps = {
  receipts: Receipt[];
};

const estimatedTaxRate = 0.25;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function DashboardStats({ receipts }: DashboardStatsProps) {
  const totalWriteOffs = receipts.reduce(
    (sum, receipt) => sum + Number(receipt.amount),
    0
  );

  const estimatedSavings = totalWriteOffs * estimatedTaxRate;

  const categoryTotals = receipts.reduce<Record<string, number>>(
    (totals, receipt) => {
      totals[receipt.category] =
        (totals[receipt.category] || 0) + Number(receipt.amount);
      return totals;
    },
    {}
  );

  const topCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-4">
      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Tracked Write-Offs</p>
        <p className="mt-2 text-3xl font-bold">
          {formatCurrency(totalWriteOffs)}
        </p>
        <p className="mt-2 text-sm text-gray-500">Potential deductions logged</p>
      </div>

      <div className="rounded-3xl bg-[#6D5EF5] p-5 text-white shadow-sm">
        <p className="text-sm font-medium text-violet-100">
          Estimated Tax Savings
        </p>
        <p className="mt-2 text-3xl font-bold">
          {formatCurrency(estimatedSavings)}
        </p>
        <p className="mt-2 text-sm text-violet-100">Based on a 25% estimate</p>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Receipts Saved</p>
        <p className="mt-2 text-3xl font-bold">{receipts.length}</p>
        <p className="mt-2 text-sm text-gray-500">Ready for tax time</p>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Top Write-Off</p>
        <p className="mt-2 text-3xl font-bold">{topCategory?.[0] || "None"}</p>
        <p className="mt-2 text-sm text-gray-500">
          {topCategory ? formatCurrency(topCategory[1]) : "No receipts yet"}
        </p>
      </div>
    </div>
  );
}
