import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  itemName?: string;
  initialQty?: number;
  onClose: () => void;
  onConfirm: (qty: number) => Promise<void>;
};

export default function RestockModal({
  open,
  itemName = "",
  initialQty = 10,
  onClose,
  onConfirm,
}: Props) {
  const [qty, setQty] = useState<number>(initialQty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setQty(initialQty);
      setError(null);
      setLoading(false);
    }
  }, [open, initialQty]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleConfirm() {
    setError(null);
    if (!Number.isFinite(qty) || qty <= 0) {
      setError("Enter a quantity greater than 0");
      return;
    }

    setLoading(true);
    try {
      await onConfirm(qty);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error ?? err?.message ?? "Restock failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="restock-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={() => !loading && onClose()}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md mx-auto rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-850 p-6 ring-1 ring-white/6 shadow-2xl z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              id="restock-modal-title"
              className="text-lg font-semibold text-gray-100"
            >
              Restock "{itemName}"
            </h3>
            <p className="mt-1 text-sm text-gray-300">
              Add units to inventory.
            </p>
          </div>

          <button
            onClick={() => !loading && onClose()}
            aria-label="Close dialog"
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/3 hover:bg-white/6 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <svg
              className="h-5 w-5 text-gray-100"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="mt-6">
          <label className="block text-sm text-gray-300">Quantity to add</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            placeholder="Enter quantity"
            className="mt-2 w-full rounded-lg bg-white/3 px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Restock quantity"
          />

          {error && (
            <div className="mt-4 rounded-md bg-red-900/20 border border-red-800/30 p-3 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:items-center">
          <button
            onClick={() => onClose()}
            disabled={loading}
            className="w-full sm:w-auto rounded-lg px-4 py-2 text-sm font-medium text-gray-300 bg-white/3 hover:bg-white/6 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {loading ? "Restocking..." : "Restock"}
          </button>
        </div>
      </div>
    </div>
  );
}
