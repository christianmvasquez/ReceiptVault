type SummaryCardProps = {
  receiptCount: number;
  totalSpending: number;
  exportCSV: () => void;
};

export default function SummaryCard({
  receiptCount,
  totalSpending,
  exportCSV,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold">Summary</h2>

      <p className="mt-6 text-slate-400">Showing Receipts</p>
      <p className="text-3xl font-bold">{receiptCount}</p>

      <p className="mt-6 text-slate-400">Showing Spending</p>
      <p className="text-3xl font-bold">${totalSpending.toFixed(2)}</p>

      <button
        onClick={exportCSV}
        className="mt-8 w-full rounded-xl bg-green-500 p-3 font-semibold hover:bg-green-600"
      >
        Export CSV
      </button>
    </div>
  );
}