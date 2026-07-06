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

export default function DashboardStats({ receipts }: DashboardStatsProps) {
  const totalSpending = receipts.reduce(
    (sum, receipt) => sum + Number(receipt.amount),
    0
  );

  const averageReceipt =
    receipts.length > 0 ? totalSpending / receipts.length : 0;

  const largestReceipt =
    receipts.length > 0
      ? Math.max(...receipts.map((receipt) => Number(receipt.amount)))
      : 0;

  const categoryCounts = receipts.reduce<Record<string, number>>(
    (counts, receipt) => {
      counts[receipt.category] = (counts[receipt.category] || 0) + 1;
      return counts;
    },
    {}
  );

  const favoriteCategory =
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "None";

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-5">
      <div className="rounded-2xl bg-slate-900 p-5">
        <p className="text-sm text-slate-400">Total Spending</p>
        <p className="mt-2 text-2xl font-bold">${totalSpending.toFixed(2)}</p>
      </div>

      <div className="rounded-2xl bg-slate-900 p-5">
        <p className="text-sm text-slate-400">Receipts</p>
        <p className="mt-2 text-2xl font-bold">{receipts.length}</p>
      </div>

      <div className="rounded-2xl bg-slate-900 p-5">
        <p className="text-sm text-slate-400">Average</p>
        <p className="mt-2 text-2xl font-bold">
          ${averageReceipt.toFixed(2)}
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 p-5">
        <p className="text-sm text-slate-400">Largest</p>
        <p className="mt-2 text-2xl font-bold">${largestReceipt.toFixed(2)}</p>
      </div>

      <div className="rounded-2xl bg-slate-900 p-5">
        <p className="text-sm text-slate-400">Top Category</p>
        <p className="mt-2 text-2xl font-bold">{favoriteCategory}</p>
      </div>
    </div>
  );
}