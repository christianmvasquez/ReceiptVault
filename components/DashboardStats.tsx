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

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      <div className="rounded-3xl bg-[#6D5EF5] p-5 text-white shadow-sm">
        <p className="text-sm font-medium text-violet-100">
          Total Possible Deductions
        </p>
        <p className="mt-2 text-3xl font-bold">
          {formatCurrency(totalWriteOffs)}
        </p>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Receipts</p>
        <p className="mt-2 text-3xl font-bold">{receipts.length}</p>
      </div>
    </div>
  );
}
