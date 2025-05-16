import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToastContext, ToastContextType } from '../components/ui/Toaster';
import { Toast } from '../types';

export function useToast() {
  const context = useContext<ToastContextType | undefined>(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  const showToast = (toast: Omit<Toast, 'id'>) => {
    context.addToast({
      id: uuidv4(),
      ...toast,
    });
  };
  
  return { showToast };
}