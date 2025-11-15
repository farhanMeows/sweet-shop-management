import React from "react";

export default function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        background: "rgba(15,23,42,0.9)",
        color: "white",
        padding: "8px 12px",
        borderRadius: 8,
        boxShadow: "0 6px 18px rgba(2,6,23,0.6)",
      }}
    >
      {message}
    </div>
  );
}
