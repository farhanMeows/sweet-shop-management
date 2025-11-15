import React, { useEffect, useState } from "react";
import api from "../api";

type Props = {
  initial?: any;
  onSaved?: () => void;
};

const SweetForm: React.FC<Props> = ({ initial, onSaved }) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [quantity, setQuantity] = useState(initial?.quantity ?? 0);
  const [busy, setBusy] = useState(false);
  const isEdit = Boolean(initial?.id);

  async function save() {
    setBusy(true);
    try {
      if (isEdit) {
        await api.put(`/sweets/${initial.id}`, {
          name,
          category,
          price,
          quantity,
        });
      } else {
        await api.post("/sweets", { name, category, price, quantity });
      }
      onSaved?.();
    } catch (e) {
      console.error(e);
      alert("Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
      <div>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Category</label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div>
        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={save} disabled={busy}>
          {isEdit ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
};

export default SweetForm;
