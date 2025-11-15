import React, { useEffect, useState } from "react";
import api from "../api";

type Props = {
  initial?: any;
  onSaved?: () => void;
};

const currencyFormat = (n: number) => {
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const SweetForm: React.FC<Props> = ({ initial, onSaved }) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [price, setPrice] = useState<number>(initial?.price ?? 0);
  const [quantity, setQuantity] = useState<number>(initial?.quantity ?? 0);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const isEdit = Boolean(initial?.id);

  useEffect(() => {
    // if initial changes (when editing different item), sync fields
    setName(initial?.name ?? "");
    setCategory(initial?.category ?? "");
    setPrice(initial?.price ?? 0);
    setQuantity(initial?.quantity ?? 0);
    setErrors({});
    setSuccess(null);
  }, [initial]);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (price <= 0 || Number.isNaN(price))
      e.price = "Price must be greater than 0";
    if (quantity < 0 || Number.isNaN(quantity))
      e.quantity = "Quantity cannot be negative";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function save() {
    if (!validate()) return;
    setBusy(true);
    setErrors({});
    setSuccess(null);

    try {
      const payload = {
        name: name.trim(),
        category: category.trim(),
        price,
        quantity,
      };
      if (isEdit) {
        await api.put(`/sweets/${initial.id}`, payload);
        setSuccess("Updated successfully");
      } else {
        await api.post("/sweets", payload);
        setSuccess("Created successfully");
        // reset fields after create
        setName("");
        setCategory("");
        setPrice(0);
        setQuantity(0);
      }
      onSaved?.();
    } catch (err: any) {
      console.error(err);
      // try to show server error message if available
      const message =
        err?.response?.data?.message ?? err?.message ?? "Save failed";
      setErrors({ form: message });
    } finally {
      setBusy(false);
      // hide success after a short delay
      setTimeout(() => setSuccess(null), 2600);
    }
  }

  return (
    <form
      className="w-full max-w-2xl rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-850 p-6 shadow-lg ring-1 ring-white/6"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      aria-labelledby="sweet-form-title"
    >
      <div className="flex items-center justify-between">
        <h2
          id="sweet-form-title"
          className="text-lg font-semibold text-gray-100"
        >
          {isEdit ? "Edit Sweet" : "Create Sweet"}
        </h2>
        <div className="text-sm text-gray-400">
          Status: {isEdit ? "Edit" : "New"}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">
            Name
          </label>
          <input
            className={`w-full rounded-lg border-0 bg-white/3 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              errors.name ? "ring-2 ring-red-500/40" : ""
            }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rasgulla"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "error-name" : undefined}
          />
          {errors.name && (
            <p id="error-name" className="mt-1 text-xs text-red-300">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">
            Category
          </label>
          <input
            className="w-full rounded-lg border-0 bg-white/3 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Milk Sweets"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">
            Price (₹)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              className={`w-full rounded-lg border-0 bg-white/3 px-3 py-2 pr-24 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                errors.price ? "ring-2 ring-red-500/40" : ""
              }`}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              aria-invalid={!!errors.price}
              aria-describedby={errors.price ? "error-price" : undefined}
            />
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-300">
              {currencyFormat(price)}
            </div>
          </div>
          {errors.price && (
            <p id="error-price" className="mt-1 text-xs text-red-300">
              {errors.price}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">
            Quantity
          </label>
          <input
            type="number"
            step="1"
            min="0"
            className={`w-full rounded-lg border-0 bg-white/3 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              errors.quantity ? "ring-2 ring-red-500/40" : ""
            }`}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            aria-invalid={!!errors.quantity}
            aria-describedby={errors.quantity ? "error-quantity" : undefined}
          />
          {errors.quantity && (
            <p id="error-quantity" className="mt-1 text-xs text-red-300">
              {errors.quantity}
            </p>
          )}
        </div>
      </div>

      {errors.form && (
        <div className="mt-4 rounded-md bg-red-900/20 border border-red-800/30 p-3 text-sm text-red-200">
          {errors.form}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-md bg-green-900/15 border border-green-800/20 p-3 text-sm text-green-200">
          {success}
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-md transition transform active:scale-98 ${
            busy ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {busy ? (
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
            <span>{isEdit ? "Update" : "Create"}</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setName("");
            setCategory("");
            setPrice(0);
            setQuantity(0);
            setErrors({});
          }}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-white/3 text-gray-200 hover:bg-white/6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Reset
        </button>

        <div className="ml-auto text-sm text-gray-400">
          Preview:{" "}
          <span className="font-medium text-gray-100">{name || "-"}</span>
        </div>
      </div>
    </form>
  );
};

export default SweetForm;
