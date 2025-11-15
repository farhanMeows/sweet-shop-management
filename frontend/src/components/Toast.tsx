import { useEffect, useState } from "react";

export default function Toast({ message }: { message: string | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 2500);
      return () => clearTimeout(t);
    }
  }, [message]);

  if (!message || !visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeIn select-none">
      <div className="rounded-xl bg-neutral-900/90 px-4 py-2 shadow-xl ring-1 ring-white/10 text-sm text-gray-100 backdrop-blur-md min-w-[180px] flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-4 w-4 text-indigo-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{message}</span>
      </div>

      {/* fade-out animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
