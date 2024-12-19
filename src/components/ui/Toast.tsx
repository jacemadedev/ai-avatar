'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: string | number;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof onClose === 'string' || typeof onClose === 'number') {
        window.dispatchEvent(new CustomEvent('toast-close', { detail: onClose }));
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    if (typeof onClose === 'string' || typeof onClose === 'number') {
      window.dispatchEvent(new CustomEvent('toast-close', { detail: onClose }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`
        fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg
        flex items-center space-x-3
        ${type === 'success' 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'}
      `}
    >
      <span>{message}</span>
      <button onClick={handleClose} className="text-white/80 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
} 