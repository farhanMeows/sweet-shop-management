import React, { useEffect, useState } from "react";

type Props = {
  open: boolean;
  itemName?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  description?: string;
};

export default function ConfirmDeleteModal({
  open,
  itemName = "",
  onClose,
  onConfirm,
  title = "Delete item?",
  description = "This action cannot be undone.",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setError(null);
    }
  }, [open]);

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
      setError(err?.response?.data?.error ?? err?.message ?? "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={() => !loading && onClose()}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-850 p-6 ring-1 ring-white/6 shadow-2xl z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              id="confirm-delete-title"
              className="text-lg font-semibold text-gray-100"
            >
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-300">
              {description}{" "}
              <span className="font-semibold text-indigo-300">{itemName}</span>
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

        {error && (
          <div className="mt-4 rounded-md bg-red-900/20 border border-red-800/30 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:items-center">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto rounded-lg px-4 py-2 text-sm font-medium text-gray-300 bg-white/3 hover:bg-white/6 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
