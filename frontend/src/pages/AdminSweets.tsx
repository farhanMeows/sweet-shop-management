import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../auth/AuthContext";
import SweetForm from "../components/SweetForm";

const AdminSweets: React.FC = () => {
  const { user } = useAuth();
  const [sweets, setSweets] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const r = await api.get("/sweets");
    setSweets(r.data);
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

  if (!user || user.role !== "ADMIN") return <div>Admin access required</div>;

  return (
    <div>
      <h2>Admin — Sweets</h2>
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
        >
          Create new sweet
        </button>
      </div>

      {creating && (
        <div style={{ marginBottom: 12 }}>
          <h4>Create</h4>
          <SweetForm
            onSaved={() => {
              setCreating(false);
              load();
            }}
          />
        </div>
      )}

      {editing && (
        <div style={{ marginBottom: 12 }}>
          <h4>Edit</h4>
          <SweetForm
            initial={editing}
            onSaved={() => {
              setEditing(null);
              load();
            }}
          />
        </div>
      )}

      <ul>
        {sweets.map((s) => (
          <li key={s.id} style={{ marginBottom: 8 }}>
            <strong>{s.name}</strong> — stock: {s.quantity} — ₹{s.price}
            <button
              onClick={() => {
                setEditing(s);
                setCreating(false);
              }}
              style={{ marginLeft: 8 }}
            >
              Edit
            </button>
            <button onClick={() => restock(s.id)} style={{ marginLeft: 8 }}>
              Restock
            </button>
            <button onClick={() => remove(s.id)} style={{ marginLeft: 8 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSweets;
