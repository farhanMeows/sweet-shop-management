import React, { useEffect, useState, useCallback } from "react";
import api from "../api";
import { useAuth } from "../auth/AuthContext";
import PurchaseModal from "../components/PurchaseModal";
import Toast from "../components/Toast";

type Sweet = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
};

export default function SweetsList() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [selected, setSelected] = useState<Sweet | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // filters
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [searching, setSearching] = useState(false);

  const currency = (n: number) =>
    n.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/sweets");
      setSweets(res.data || []);
    } catch (err: any) {
      console.error(err);
      setToast("Failed to load sweets");
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async () => {
    setSearching(true);
    try {
      const params: any = {};
      if (q) params.q = q;
      if (name) params.name = name;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get("/sweets/search", { params });
      setSweets(res.data || []);
    } catch (e: any) {
      setToast(e?.response?.data?.error || "Search failed");
    } finally {
      setSearching(false);
    }
  }, [q, name, category, minPrice, maxPrice]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function confirmPurchase(id: number, qty = 1) {
    try {
      await api.post(`/sweets/${id}/purchase`, { quantity: qty });
      setToast("Purchase successful");
      // refresh current listing (use search or full list depending on filters)
      if (q || name || category || minPrice || maxPrice) await search();
      else await loadAll();
    } catch (e: any) {
      setToast(e?.response?.data?.error || "Purchase failed");
    }
  }

  if (!token) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center rounded-xl bg-neutral-900/60 ring-1 ring-white/6">
        <p className="text-gray-300">
          You must be signed in to browse and buy sweets.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Sweets</h2>
        <div className="text-sm text-gray-400">
          {loading ? "Refreshing..." : `${sweets.length} items`}
        </div>
      </div>

      {/* Filters */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
        className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-6 items-end"
      >
        <div className="sm:col-span-2 lg:col-span-2">
          <label className="text-sm text-gray-300">Quick search</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="name or category"
            className="mt-1 w-full rounded-lg bg-white/3 px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Exact name"
            className="mt-1 w-full rounded-lg bg-white/3 px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="mt-1 w-full rounded-lg bg-white/3 px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Min price</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            className="mt-1 w-full rounded-lg bg-white/3 px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Max price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="1000"
            className="mt-1 w-full rounded-lg bg-white/3 px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={searching}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              searching
                ? "bg-white/6 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
            }`}
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setName("");
              setCategory("");
              setMinPrice("");
              setMaxPrice("");
              loadAll();
            }}
            className="rounded-lg px-4 py-2 text-sm font-medium bg-white/3 text-gray-200 hover:bg-white/6"
          >
            Reset
          </button>
        </div>
      </form>

      {/* List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className="h-36 rounded-xl bg-neutral-800/30 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sweets.map((s) => (
            <div
              key={s.id}
              className="rounded-xl bg-neutral-900/60 p-4 ring-1 ring-white/6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">
                    {s.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{s.category}</p>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-gray-100">
                    ₹{currency(s.price)}
                  </div>
                  <div
                    className={`text-sm mt-1 ${
                      s.quantity > 0 ? "text-gray-300" : "text-red-400"
                    }`}
                  >
                    {s.quantity > 0
                      ? `In stock: ${s.quantity}`
                      : "Out of stock"}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelected(s);
                    setModalOpen(true);
                  }}
                  disabled={s.quantity <= 0}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    s.quantity <= 0
                      ? "bg-white/6 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                  }`}
                >
                  Buy 1
                </button>

                <button
                  onClick={() => window.alert("Open details")}
                  className="ml-auto text-sm text-indigo-300 hover:underline"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PurchaseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() =>
          selected ? confirmPurchase(selected.id, 1) : Promise.resolve()
        }
        sweetName={selected?.name}
        quantity={1}
      />

      <Toast message={toast} />
    </div>
  );
}
