import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    api
      .get("/sweets")
      .then((res) => {
        setSweets(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  async function purchase(id: number) {
    await api.post(`/sweets/${id}/purchase`, { quantity: 1 });
    // refresh
    const res = await api.get("/sweets");
    setSweets(res.data);
  }

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h2>Sweets</h2>
      <ul>
        {sweets.map((s) => (
          <li key={s.id}>
            <strong>{s.name}</strong> — {s.category} — ₹{s.price} — stock:{" "}
            {s.quantity}
            <button
              onClick={() => purchase(s.id)}
              disabled={s.quantity <= 0}
              style={{ marginLeft: 8 }}
            >
              Buy 1
            </button>
          </li>
        ))}
      </ul>
      {token ? (
        <div style={{ marginTop: 12 }}>You can buy. </div>
      ) : (
        <div style={{ marginTop: 12 }}>Login to buy</div>
      )}
    </div>
  );
};

export default SweetsList;
