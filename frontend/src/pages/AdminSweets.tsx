import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../auth/AuthContext";
import SweetForm from "../components/SweetForm";
import Toast from "../components/Toast";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import RestockModal from "../components/RestockModal";

export default function AdminSweets() {
  const { user } = useAuth();
  const [sweets, setSweets] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  // pagination state
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const perPage = 10; // server uses 10 per page

  // action modals / toasts
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [restockTarget, setRestockTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load(p = 1) {
    try {
      setLoading(true);
      const r = await api.get("/sweets", { params: { page: p } });

      const payload = r.data;
      let items: any[] = [];
      if (Array.isArray(payload)) {
        items = payload;
        setPage(1);
        setTotalPages(1);
      } else if (payload && Array.isArray(payload.data)) {
        items = payload.data;
        setPage(payload.page || p);
        setTotalPages(payload.totalPages || 1);
      } else {
        console.warn("Unexpected /sweets response shape", payload);
        items = [];
        setPage(1);
        setTotalPages(1);
      }
      setSweets(items);
    } catch (err) {
      console.error("Failed to load sweets", err);
      setSweets([]);
      setToast("Failed to load sweets");
    } finally {
      setLoading(false);
    }
  }

  // wrapper passed to ConfirmDeleteModal
  async function handleDeleteConfirm(id: number) {
    setActionBusy(true);
    try {
      await api.delete(`/sweets/${id}`);
      setToast("Sweet deleted");
      await load(page);
      setDeleteTarget(null);
    } catch (err: any) {
      console.error(err);
      setToast(err?.response?.data?.error ?? "Delete failed");
    } finally {
      setActionBusy(false);
    }
  }

  // wrapper passed to RestockModal
  async function handleRestockConfirm(id: number, qty: number) {
    setActionBusy(true);
    try {
      if (!qty || qty <= 0) throw new Error("Quantity must be greater than 0");
      await api.post(`/sweets/${id}/restock`, { quantity: qty });
      setToast("Stock updated");
      await load(page);
      setRestockTarget(null);
    } catch (err: any) {
      console.error(err);
      setToast(err?.response?.data?.error ?? err?.message ?? "Restock failed");
      // keep modal open so user can retry
    } finally {
      setActionBusy(false);
    }
  }

  async function handleCreateSaved() {
    setCreating(false);
    await load(page);
  }

  async function handleEditSaved() {
    setEditing(null);
    await load(page);
  }

  function gotoPage(p: number) {
    if (p < 1 || p > totalPages) return;
    load(p);
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="p-6 rounded-xl bg-red-900/20 text-red-300 text-center">
        Admin access required
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Admin — Sweets</h2>
        <button
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
          className="rounded-lg px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-sm font-medium shadow-lg focus:ring-2 focus:ring-indigo-400"
        >
          + Create Sweet
        </button>
      </div>

      {/* Create Mode */}
      {creating && (
        <div className="mb-8 p-4 rounded-xl bg-neutral-900/70 ring-1 ring-white/10">
          <h4 className="text-lg font-semibold mb-3">Create Sweet</h4>
          <SweetForm onSaved={handleCreateSaved} />
        </div>
      )}

      {/* Edit Mode */}
      {editing && (
        <div className="mb-8 p-4 rounded-xl bg-neutral-900/70 ring-1 ring-white/10">
          <h4 className="text-lg font-semibold mb-3">Edit Sweet</h4>
          <SweetForm initial={editing} onSaved={handleEditSaved} />
        </div>
      )}

      {/* List */}
      <div className="rounded-xl bg-neutral-900/60 ring-1 ring-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">All Sweets</h3>
          <div className="text-sm text-gray-400">
            Page {page} of {totalPages} — {perPage} / page
          </div>
        </div>

        {loading ? (
          <div className="text-gray-400 text-sm">Loading...</div>
        ) : sweets.length === 0 ? (
          <div className="text-gray-500 text-sm">No sweets found</div>
        ) : (
          <>
            <ul className="space-y-3">
              {sweets.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg bg-neutral-800/40 border border-white/5 hover:bg-neutral-800/60 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-100 text-lg">
                      {s.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      Stock: <span className="text-gray-200">{s.quantity}</span>{" "}
                      — ₹{s.price}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-3 sm:mt-0">
                    <button
                      onClick={() => {
                        setEditing(s);
                        setCreating(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-200"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        setRestockTarget({ id: s.id, name: s.name })
                      }
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-sm text-gray-100"
                    >
                      Restock
                    </button>

                    <button
                      onClick={() =>
                        setDeleteTarget({ id: s.id, name: s.name })
                      }
                      className="px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-sm text-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination controls */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => gotoPage(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1 rounded bg-neutral-800/40 hover:bg-neutral-800/60 disabled:opacity-50"
              >
                Previous
              </button>

              <div className="text-sm text-gray-300">
                Page {page} of {totalPages}
              </div>

              <button
                onClick={() => gotoPage(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded bg-neutral-800/40 hover:bg-neutral-800/60 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Reusable modals */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        itemName={deleteTarget?.name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget
            ? handleDeleteConfirm(deleteTarget.id)
            : Promise.resolve()
        }
      />

      <RestockModal
        open={!!restockTarget}
        itemName={restockTarget?.name}
        initialQty={10}
        onClose={() => setRestockTarget(null)}
        onConfirm={(qty) =>
          restockTarget
            ? handleRestockConfirm(restockTarget.id, qty)
            : Promise.resolve()
        }
      />

      <Toast message={toast} />
    </div>
  );
}
