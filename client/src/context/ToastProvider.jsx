// client/src/context/ToastProvider.jsx
import React, { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((msg, { type = "info", duration = 3500 } = {}) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);
  }, []);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ add, remove }}>
      {children}
      <div style={{ position: "fixed", right: 16, top: 16, zIndex: 60 }}>
        <div className="space-y-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`px-4 py-2 rounded shadow-sm max-w-xs text-sm ${
                t.type === "success"
                  ? "bg-green-50 text-green-800"
                  : t.type === "error"
                  ? "bg-red-50 text-red-800"
                  : "bg-gray-50 text-gray-900"
              }`}
            >
              {t.msg}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
