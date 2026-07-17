import Image from "next/image";

type ReceiptFormProps = {
  vendor: string;
  amount: string;
  category: string;
  notes: string;
  file: File | null;
  receiptPreviewUrl: string;
  isEditing: boolean;
  isScanning: boolean;
  scanMessage: string;
  setVendor: (value: string) => void;
  setAmount: (value: string) => void;
  setCategory: (value: string) => void;
  setNotes: (value: string) => void;
  handleFileChange: (file: File | null) => void;
  handleSubmit: (e: React.FormEvent) => void;
  cancelEdit: () => void;
};

export default function ReceiptForm({
  vendor,
  amount,
  category,
  notes,
  file,
  receiptPreviewUrl,
  isEditing,
  isScanning,
  scanMessage,
  setVendor,
  setAmount,
  setCategory,
  setNotes,
  handleFileChange,
  handleSubmit,
  cancelEdit,
}: ReceiptFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-2xl font-semibold">
        {isEditing ? "Edit Receipt" : "Add Receipt"}
      </h2>

      {!isEditing && (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className="mt-6 w-full rounded-xl border border-gray-200 bg-gray-50 p-3"
        />
      )}

      {!isEditing && file && (
        <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
          <p className="font-semibold text-gray-800">{file.name}</p>
          <p>{isScanning ? "Reading receipt with AI..." : scanMessage}</p>
        </div>
      )}

      {!isEditing && receiptPreviewUrl && (
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          <Image
            src={receiptPreviewUrl}
            alt="Receipt preview"
            width={450}
            height={600}
            unoptimized
            className="max-h-96 w-full object-contain"
          />
        </div>
      )}

      <input
        className="mt-4 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-violet-500"
        placeholder="Vendor"
        value={vendor}
        onChange={(e) => setVendor(e.target.value)}
        required
      />

      <input
        className="mt-4 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-violet-500"
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <select
        className="mt-4 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-violet-500"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="">Select Category</option>
        <option value="Meals">Meals</option>
        <option value="Travel">Travel</option>
        <option value="Supplies">Supplies</option>
        <option value="Equipment">Equipment</option>
        <option value="Fuel">Fuel</option>
        <option value="Other">Other</option>
      </select>

      <textarea
        className="mt-4 min-h-24 w-full resize-y rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-violet-500"
        placeholder="Notes, business purpose, or CPA context"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        disabled={isScanning}
        className="mt-6 w-full rounded-xl bg-[#6D5EF5] p-3 font-semibold text-white hover:bg-[#5B4CF0] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isScanning
          ? "Scanning Receipt..."
          : isEditing
            ? "Update Receipt"
            : "Save Receipt"}
      </button>

      {isEditing && (
        <button
          type="button"
          onClick={cancelEdit}
          className="mt-3 w-full rounded-xl border border-gray-200 bg-white p-3 font-semibold hover:bg-gray-50"
        >
          Cancel Edit
        </button>
      )}
    </form>
  );
}
