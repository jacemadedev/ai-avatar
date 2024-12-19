'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Toast } from '@/components/ui/Toast';
import { AnimatePresence } from 'framer-motion';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    const handleToastClose = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail === toast?.id) {
        setToast(null);
      }
    };

    window.addEventListener('toast-close', handleToastClose);
    return () => window.removeEventListener('toast-close', handleToastClose);
  }, [toast?.id]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({
      id: Date.now(),
      message,
      type,
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={toast.id}
          />
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
} 