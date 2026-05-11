import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950/95 p-8 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition hover:bg-white/5 hover:text-white">
            ×
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
