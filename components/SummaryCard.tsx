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
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">Summary</h2>

      <p className="mt-6 text-gray-500">Showing Receipts</p>
      <p className="text-3xl font-bold">{receiptCount}</p>

      <p className="mt-6 text-gray-500">Showing Spending</p>
      <p className="text-3xl font-bold">${totalSpending.toFixed(2)}</p>

      <button
        onClick={exportCSV}
        className="mt-8 w-full rounded-xl bg-[#6D5EF5] p-3 font-semibold text-white hover:bg-[#5B4CF0]"
      >
        Export CSV
      </button>
    </div>
  );
}
