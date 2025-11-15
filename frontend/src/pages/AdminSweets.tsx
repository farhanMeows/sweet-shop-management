import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../auth/AuthContext";

const AdminSweets: React.FC = () => {
  const { user } = useAuth();
  const [sweets, setSweets] = useState<any[]>([]);
  useEffect(() => {
    api.get("/sweets").then((r) => setSweets(r.data));
  }, []);
  if (!user || user.role !== "ADMIN") {
    return <div>Admin access required</div>;
  }
  return (
    <div>
      <h2>Admin — Sweets</h2>
      <p>Implement create/update/delete/restock here (next commits).</p>
      <ul>
        {sweets.map((s) => (
          <li key={s.id}>
            {s.name} — stock: {s.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSweets;
