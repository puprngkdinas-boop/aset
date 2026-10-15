import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  message: string;
  duration?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none no-print">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const bgStyles =
    toast.type === 'success'
      ? 'bg-slate-900 text-white border-emerald-500/50 shadow-emerald-950/20'
      : toast.type === 'warning'
      ? 'bg-slate-900 text-white border-amber-500/50 shadow-amber-950/20'
      : toast.type === 'error'
      ? 'bg-slate-900 text-white border-rose-500/50 shadow-rose-950/20'
      : 'bg-slate-900 text-white border-blue-500/50 shadow-blue-950/20';

  const icon =
    toast.type === 'success' ? (
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
    ) : toast.type === 'warning' ? (
      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
    ) : toast.type === 'error' ? (
      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
    ) : (
      <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
    );

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${bgStyles}`}
    >
      {icon}
      <div className="flex-1 text-xs leading-relaxed font-medium">
        {toast.message}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
