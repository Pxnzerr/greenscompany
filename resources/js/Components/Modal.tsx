import { X } from 'lucide-react';
import { PropsWithChildren, useEffect } from 'react';

interface ModalProps extends PropsWithChildren {
    open: boolean;
    onClose: () => void;
    title: string;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001400]/60 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between gap-4">
                    <h2 id="modal-title" className="text-xl font-extrabold text-[#003200]">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar janela"
                        className="w-9 h-9 rounded-lg text-neutral-500 hover:bg-[#EAF5EE] hover:text-[#003200] grid place-items-center"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
