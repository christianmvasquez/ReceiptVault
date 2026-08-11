type SummaryCardProps = {
  exportCSV: () => void;
};

export default function SummaryCard({
  exportCSV,
}: SummaryCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">CPA Export</h2>
      <p className="mt-3 leading-7 text-gray-500">
        Download a clean CSV with receipt details, notes, image links, and
        category totals.
      </p>

      <button
        onClick={exportCSV}
        className="mt-8 w-full rounded-xl bg-[#6D5EF5] p-3 font-semibold text-white hover:bg-[#5B4CF0]"
      >
        Download CSV
      </button>
    </div>
  );
}
