import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../auth/AuthContext";
import PurchaseModal from "../components/PurchaseModal";

type Sweet = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
};

const SweetsList: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [selected, setSelected] = useState<Sweet | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await api.get("/sweets");
    setSweets(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  async function confirmPurchase(id: number, qty = 1) {
    try {
      await api.post(`/sweets/${id}/purchase`, { quantity: qty });
      setMsg("Purchase successful");
      await load();
    } catch (e: any) {
      setMsg(e?.response?.data?.error || "Purchase failed");
    }
  }

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h2>Sweets</h2>
      {msg && <div style={{ marginBottom: 8 }}>{msg}</div>}
      <ul>
        {sweets.map((s) => (
          <li key={s.id} style={{ marginBottom: 8 }}>
            <strong>{s.name}</strong> — {s.category} — ₹{s.price} — stock:{" "}
            {s.quantity}
            <button
              onClick={() => {
                setSelected(s);
                setModalOpen(true);
              }}
              disabled={s.quantity <= 0}
              style={{ marginLeft: 8 }}
            >
              Buy 1
            </button>
          </li>
        ))}
      </ul>

      <PurchaseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() =>
          selected ? confirmPurchase(selected.id, 1) : Promise.resolve()
        }
        sweetName={selected?.name}
        quantity={1}
      />
    </div>
  );
};

export default SweetsList;
