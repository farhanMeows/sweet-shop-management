import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  sweetName?: string;
  quantity?: number;
};

const PurchaseModal: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  sweetName,
  quantity,
}) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.4)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 8,
          width: 320,
        }}
      >
        <h3>Confirm purchase</h3>
        <p>
          Buy <strong>{quantity ?? 1}</strong> of <strong>{sweetName}</strong>?
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
