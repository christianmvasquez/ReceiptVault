import Image from "next/image";

type Receipt = {
  id: string;
  vendor: string;
  amount: number;
  category: string;
  notes?: string | null;
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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div>
          <h3 className="text-xl font-semibold">{receipt.vendor}</h3>

          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
              {receipt.category}
            </span>

            <span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700">
              ${Number(receipt.amount).toFixed(2)}
            </span>
          </div>

          {receipt.notes && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
              {receipt.notes}
            </p>
          )}
        </div>

        <div className="flex gap-2 self-start">
          <button
            onClick={() => onEdit(receipt)}
            className="rounded-lg border border-violet-200 bg-white px-4 py-2 font-semibold text-violet-700 hover:bg-violet-50"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(receipt)}
            className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            Delete
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
            className="rounded-xl border border-gray-200"
          />
        </div>
      )}
    </div>
  );
}
