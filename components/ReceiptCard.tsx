import Image from "next/image";

type Receipt = {
  id: string;
  vendor: string;
  amount: number;
  category: string;
  image_url?: string;
};

type ReceiptCardProps = {
  receipt: Receipt;
  onDelete: (receipt: Receipt) => void;
  onEdit: (receipt: Receipt) => void;
};

export default function ReceiptCard({
  receipt,
  onDelete,
  onEdit,
}: ReceiptCardProps) {
  return (
    <div className="rounded-2xl bg-slate-950 p-5 border border-slate-800 shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div>
          <h3 className="text-xl font-bold">{receipt.vendor}</h3>

          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm">
              {receipt.category}
            </span>

            <span className="rounded-full bg-green-900/40 px-3 py-1 text-sm font-semibold text-green-400">
              ${Number(receipt.amount).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 self-start">
          <button
            onClick={() => onEdit(receipt)}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold transition hover:bg-blue-700"
          >
            ✏️ Edit
          </button>

          <button
            onClick={() => onDelete(receipt)}
            className="rounded-lg bg-red-600 px-4 py-2 font-semibold transition hover:bg-red-700"
          >
            🗑 Delete
          </button>
        </div>
      </div>

      {receipt.image_url && (
        <div className="mt-5">
          <Image
            src={receipt.image_url}
            alt={receipt.vendor}
            width={450}
            height={600}
            className="rounded-xl border border-slate-700"
          />
        </div>
      )}
    </div>
  );
}