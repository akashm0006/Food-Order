import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const lastToastRef = useRef({ message: '', time: 0 });

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    if (!message) return;

    // Prevent duplicate alerts triggered within 1.2 seconds or already displayed
    const now = Date.now();
    if (lastToastRef.current.message === message && now - lastToastRef.current.time < 1200) {
      return;
    }
    lastToastRef.current = { message, time: now };

    const id = `${now}-${Math.random().toString(36).substring(2, 6)}`;

    setToasts((prev) => {
      // If a toast with identical message is already in view, skip duplicate
      if (prev.some((t) => t.message === message)) {
        return prev;
      }
      return [...prev, { id, message, type }];
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" style={{ zIndex: 9999 }}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={18} color="#10b981" />}
            {toast.type === 'error' && <AlertCircle size={18} color="#f43f5e" />}
            {toast.type === 'info' && <Info size={18} color="#f97316" />}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
              }}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
