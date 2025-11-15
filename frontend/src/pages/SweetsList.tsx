import React, { useCallback, useEffect, useState } from "react";
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

type PagedResponse = {
  data: Sweet[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export default function SweetsList(): React.ReactElement {
  const { token } = useAuth();

  // data + ui states
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<Sweet | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // filters
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // pagination
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const perPage = 10; // change if needed

  const currency = (n: number) =>
    n.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const buildParams = (p = 1) => {
    const params: Record<string, any> = { page: p, perPage };
    if (q) params.q = q;
    if (name) params.name = name;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    return params;
  };

  // load full list (paged)
  const loadAll = useCallback(
    async (p = 1) => {
      setLoading(true);
      try {
        const res = await api.get("/sweets", { params: { page: p, perPage } });
        const body: PagedResponse = res.data;
        setSweets(body.data || []);
        setPage(body.page ?? p);
        setTotalPages(body.totalPages ?? 1);
      } catch (err: any) {
        console.error(err);
        setToast("Failed to load sweets");
      } finally {
        setLoading(false);
      }
    },
    [perPage]
  );

  // search with filters (server-side)
  const search = useCallback(
    async (p = 1) => {
      setLoading(true);
      try {
        const params = buildParams(p);
        const res = await api.get("/sweets/search", { params });
        const body: PagedResponse = res.data;
        setSweets(body.data || []);
        setPage(body.page ?? p);
        setTotalPages(body.totalPages ?? 1);
      } catch (err: any) {
        console.error(err);
        setToast(err?.response?.data?.error || "Search failed");
      } finally {
        setLoading(false);
      }
    },
    [q, name, category, minPrice, maxPrice]
  );

  // initial load
  useEffect(() => {
    void loadAll(1); // call loadAll for page 1
  }, [loadAll]);

  // confirm purchase then refresh appropriate page
  async function confirmPurchase(id: number, qty = 1) {
    try {
      await api.post(`/sweets/${id}/purchase`, { quantity: qty });
      setToast("Purchase successful");
      // refresh current listing (use filters if set)
      if (q || name || category || minPrice || maxPrice) {
        await search(page);
      } else {
        await loadAll(page);
      }
    } catch (e: any) {
      console.error(e);
      setToast(e?.response?.data?.error || "Purchase failed");
    }
  }

  function onSearchClick() {
    setPage(1);
    void search(1);
  }

  function onReset() {
    setQ("");
    setName("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
    void loadAll(1);
  }

  // pagination handler (defined inside component to avoid placeholder tricks)
  async function gotoPage(p: number) {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    if (q || name || category || minPrice || maxPrice) {
      await search(p);
    } else {
      await loadAll(p);
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
          onSearchClick();
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
            aria-label="Quick search"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Exact name"
            className="mt-1 w-full rounded-lg bg-white/3 px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Filter by name"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="mt-1 w-full rounded-lg bg-white/3 px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Filter by category"
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
            aria-label="Minimum price"
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
            aria-label="Maximum price"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-lg px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 disabled:opacity-60"
            disabled={loading}
          >
            Search
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg px-4 py-2 text-sm font-medium bg-white/3 text-gray-200 hover:bg-white/6"
            disabled={loading}
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
      ) : sweets.length === 0 ? (
        <div className="rounded-xl bg-neutral-900/60 p-6 text-center text-gray-400">
          No sweets found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sweets.map((s) => (
            <article
              key={s.id}
              className="rounded-2xl bg-gradient-to-br from-neutral-900/60 to-neutral-900/70 p-5 ring-1 ring-white/6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              {/* Top section */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-100 truncate">
                    {s.name}
                  </h3>

                  <span className="mt-2 inline-block rounded-full bg-white/6 px-2.5 py-0.5 text-xs font-medium text-gray-200">
                    {s.category}
                  </span>

                  {/* optional short description */}
                  <p className="mt-3 text-sm text-gray-400 line-clamp-2">
                    Delicious {s.category.toLowerCase()} from our sweet shop.
                  </p>
                </div>

                {/* Price & stock */}
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-bold text-gray-100">
                    ₹{currency(s.price)}
                  </div>
                  <div
                    className={`text-sm mt-1 ${
                      s.quantity > 0
                        ? "text-gray-300"
                        : "text-red-500 font-medium"
                    }`}
                  >
                    {s.quantity > 0 ? `Stock: ${s.quantity}` : "Out of stock"}
                  </div>
                </div>
              </div>

              {/* Buy button */}
              <div className="mt-5">
                <button
                  onClick={() => {
                    setSelected(s);
                    setModalOpen(true);
                  }}
                  disabled={s.quantity <= 0}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                    s.quantity <= 0
                      ? "bg-white/6 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-600 active:scale-[0.98]"
                  }`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 3h2l.4 2M7 13h10l3-8H6.4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="10" cy="20" r="1" fill="currentColor" />
                    <circle cx="18" cy="20" r="1" fill="currentColor" />
                  </svg>
                  Buy 1
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => void gotoPage(page - 1)}
            disabled={page <= 1 || loading}
            className="rounded-lg px-3 py-2 bg-white/3 text-sm text-gray-200 hover:bg-white/6 disabled:opacity-60"
          >
            Previous
          </button>

          <div className="text-sm text-gray-300 px-3 py-2 rounded-lg bg-white/3">
            Page <span className="font-medium text-gray-100">{page}</span> of{" "}
            <span className="font-medium text-gray-100">{totalPages}</span>
          </div>

          <button
            onClick={() => void gotoPage(page + 1)}
            disabled={page >= totalPages || loading}
            className="rounded-lg px-3 py-2 bg-white/3 text-sm text-gray-200 hover:bg-white/6 disabled:opacity-60"
          >
            Next
          </button>
        </div>

        <div className="text-sm text-gray-400">
          Showing {sweets.length} items • {perPage} per page
        </div>
      </div>

      {/* Confirm modal & toast */}
      <PurchaseModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelected(null);
        }}
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
