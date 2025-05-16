import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Toast } from '../../types';

export interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Toast) => {
    setToasts((prevToasts) => [...prevToasts, toast]);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

const ToastIcon = ({ type }: { type: Toast['type'] }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-success-500" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-error-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-primary-500" />;
    default:
      return null;
  }
};

function ToastList() {
  const context = React.useContext(ToastContext);
  
  if (!context) return null;
  
  const { toasts, removeToast } = context;
  
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        removeToast(toasts[0].id);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [toasts, removeToast]);
  
  return (
    <AnimatePresence>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-4 flex items-start gap-3"
        >
          <div className="flex-shrink-0 pt-0.5">
            <ToastIcon type={toast.type} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900">{toast.title}</p>
            {toast.description && (
              <p className="mt-1 text-sm text-gray-500">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

export function Toaster() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
      <ToastList />
    </div>
  ) : null;
}