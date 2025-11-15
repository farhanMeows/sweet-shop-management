import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  sweetName?: string;
  quantity?: number;
};

export default function PurchaseModal({
  open,
  onClose,
  onConfirm,
  sweetName = "Sweet",
  quantity = 1,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setError(null);
    }
  }, [open]);

  // close on ESC
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
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      // best-effort error message
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    // overlay
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby="purchase-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* modal panel */}
      <div className="relative w-full max-w-md mx-auto rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-850 shadow-2xl ring-1 ring-white/6 p-6 sm:p-8 transform transition-all">
        {/* header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              id="purchase-modal-title"
              className="text-lg sm:text-xl font-semibold text-gray-100"
            >
              Confirm purchase
            </h3>
            <p className="mt-1 text-sm text-gray-300">
              You're about to buy{" "}
              <span className="font-semibold text-indigo-300">{quantity}</span>
              {quantity === 1 ? " item of " : " items of "}
              <span className="font-semibold text-indigo-300">{sweetName}</span>
              .
            </p>
          </div>

          {/* close button */}
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/3 hover:bg-white/6 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-5 w-5 text-gray-100"
            >
              <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* body */}
        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-900/30 ring-1 ring-indigo-600/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6 text-indigo-300"
              >
                <path
                  d="M12 2a2 2 0 00-2 2v1H7a2 2 0 00-2 2v1h14V7a2 2 0 00-2-2h-3V4a2 2 0 00-2-2zM5 12v6a3 3 0 003 3h8a3 3 0 003-3v-6H5z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-200">Order summary</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-100">
                  ₹{(49 * quantity).toFixed(2)}
                </span>
                <span className="text-sm text-gray-400">
                  ({quantity} × ₹49)
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-900/20 border border-red-800/30 p-3 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* footer actions */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:items-center">
          <button
            onClick={onClose}
            type="button"
            className="w-full sm:w-auto rounded-lg px-4 py-2 text-sm font-medium text-gray-300 bg-white/3 hover:bg-white/6 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            type="button"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 active:scale-98 transform transition shadow-md"
          >
            {loading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              <>
                <span>Confirm</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                >
                  <path
                    d="M5 12l5 5L20 7"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
