type ReceiptFormProps = {
  vendor: string;
  amount: string;
  category: string;
  file: File | null;
  isEditing: boolean;
  setVendor: (value: string) => void;
  setAmount: (value: string) => void;
  setCategory: (value: string) => void;
  setFile: (value: File | null) => void;
  handleSubmit: (e: React.FormEvent) => void;
  cancelEdit: () => void;
};

export default function ReceiptForm({
  vendor,
  amount,
  category,
  isEditing,
  setVendor,
  setAmount,
  setCategory,
  setFile,
  handleSubmit,
  cancelEdit,
}: ReceiptFormProps) {
  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold">
        {isEditing ? "Edit Receipt" : "Add Receipt"}
      </h2>

      {!isEditing && (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-6 w-full rounded-xl bg-slate-950 p-3"
        />
      )}

      <input
        className="mt-4 w-full rounded-xl bg-slate-950 p-3"
        placeholder="Vendor"
        value={vendor}
        onChange={(e) => setVendor(e.target.value)}
        required
      />

      <input
        className="mt-4 w-full rounded-xl bg-slate-950 p-3"
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <select
        className="mt-4 w-full rounded-xl bg-slate-950 p-3"
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

      <button className="mt-6 w-full rounded-xl bg-blue-500 p-3 font-semibold hover:bg-blue-600">
        {isEditing ? "Update Receipt" : "Save Receipt"}
      </button>

      {isEditing && (
        <button
          type="button"
          onClick={cancelEdit}
          className="mt-3 w-full rounded-xl bg-slate-700 p-3 font-semibold hover:bg-slate-600"
        >
          Cancel Edit
        </button>
      )}
    </form>
  );
}