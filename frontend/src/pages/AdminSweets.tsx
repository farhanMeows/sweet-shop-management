import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../auth/AuthContext";
import SweetForm from "../components/SweetForm";

export default function AdminSweets() {
  const { user } = useAuth();
  const [sweets, setSweets] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const r = await api.get("/sweets");
    setSweets(r.data);
    setLoading(false);
  }

  async function restock(id: number) {
    const qty = Number(prompt("Quantity to restock", "10") || "0");
    if (!qty || qty <= 0) return;
    await api.post(`/sweets/${id}/restock`, { quantity: qty });
    await load();
  }

  async function remove(id: number) {
    if (!confirm("Delete this sweet?")) return;
    await api.delete(`/sweets/${id}`);
    await load();
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
          <SweetForm
            onSaved={() => {
              setCreating(false);
              load();
            }}
          />
        </div>
      )}

      {/* Edit Mode */}
      {editing && (
        <div className="mb-8 p-4 rounded-xl bg-neutral-900/70 ring-1 ring-white/10">
          <h4 className="text-lg font-semibold mb-3">Edit Sweet</h4>
          <SweetForm
            initial={editing}
            onSaved={() => {
              setEditing(null);
              load();
            }}
          />
        </div>
      )}

      {/* List */}
      <div className="rounded-xl bg-neutral-900/60 ring-1 ring-white/10 p-4">
        <h3 className="text-xl font-semibold mb-4">All Sweets</h3>

        {loading ? (
          <div className="text-gray-400 text-sm">Loading...</div>
        ) : sweets.length === 0 ? (
          <div className="text-gray-500 text-sm">No sweets found</div>
        ) : (
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
                    Stock: <span className="text-gray-200">{s.quantity}</span> —
                    ₹{s.price}
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
                    onClick={() => restock(s.id)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-sm text-gray-100"
                  >
                    Restock
                  </button>

                  <button
                    onClick={() => remove(s.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-sm text-gray-100"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
