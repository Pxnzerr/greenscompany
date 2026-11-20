import { Eye, EyeOff } from 'lucide-react';
import { InputHTMLAttributes, useState } from 'react';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    hasError?: boolean;
}

export default function PasswordInput({ hasError, className = '', ...props }: PasswordInputProps) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative flex items-center">
            <input
                {...props}
                type={visible ? 'text' : 'password'}
                aria-invalid={hasError ? 'true' : undefined}
                className={`w-full h-11 pl-4 pr-12 rounded-xl border-2 bg-white text-neutral-900 transition-colors ${
                    hasError
                        ? 'border-[#B3261E] focus:border-[#B3261E]'
                        : 'border-[#868c88] focus:border-[#003200]'
                } ${className}`}
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-pressed={visible}
                aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-1 w-9 h-9 rounded-lg grid place-items-center text-[#003200] hover:bg-[#C0E0CA]/60 transition-colors"
            >
                {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
        </div>
    );
}
