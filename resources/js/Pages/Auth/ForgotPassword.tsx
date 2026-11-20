import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import PasswordInput from '@/Components/PasswordInput';
import MainLayout from '@/Layouts/MainLayout';
import type { SharedProps } from '@/types';

export default function ForgotPassword() {
    const { props } = usePage<SharedProps>();
    const [step, setStep] = useState<'email' | 'reset'>('email');

    const codeForm = useForm({
        email: '',
    });

    const resetForm = useForm({
        email: '',
        code: '',
        password: '',
        password_confirmation: '',
    });

    const handleSendCode = (e: FormEvent) => {
        e.preventDefault();
        codeForm.post('/esqueci-senha/codigo', {
            onSuccess: () => {
                resetForm.setData('email', codeForm.data.email);
                setStep('reset');
            },
        });
    };

    const handleReset = (e: FormEvent) => {
        e.preventDefault();
        resetForm.post('/esqueci-senha/redefinir');
    };

    return (
        <MainLayout>
            <Head title="Esqueci minha senha" />

            <div className="max-w-md mx-auto px-4 sm:px-6 pt-10">
                <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-sm border border-black/5 space-y-5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003200]">
                        Esqueci minha senha
                    </h1>

                    {props.flash.dev_reset_code && (
                        <div
                            role="status"
                            className="p-3.5 rounded-xl bg-[#EBFAEA] border-l-4 border-[#2E7D32] text-sm text-[#1F4F21] font-semibold"
                        >
                            Ambiente local: use o código{' '}
                            <code className="font-mono font-extrabold">
                                {props.flash.dev_reset_code}
                            </code>{' '}
                            para concluir a redefinição.
                        </div>
                    )}

                    {step === 'email' ? (
                        <form onSubmit={handleSendCode} noValidate className="space-y-4">
                            <p className="text-sm text-neutral-600">
                                Informe o e-mail da sua conta e geraremos um código de 6 dígitos
                                para criar uma nova senha.
                            </p>

                            <div className="space-y-1.5">
                                <label htmlFor="x-email" className="block text-sm font-bold text-[#003200]">
                                    E-mail cadastrado
                                </label>
                                <input
                                    id="x-email"
                                    type="email"
                                    autoComplete="email"
                                    value={codeForm.data.email}
                                    onChange={(e) => codeForm.setData('email', e.target.value)}
                                    className={`w-full h-11 px-4 rounded-xl border-2 bg-white ${
                                        codeForm.errors.email ? 'border-[#B3261E]' : 'border-[#868c88]'
                                    }`}
                                />
                                {codeForm.errors.email && (
                                    <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                        {codeForm.errors.email}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={codeForm.processing}
                                className="w-full h-11 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300] cursor-pointer"
                            >
                                {codeForm.processing ? 'Enviando...' : 'Enviar código'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleReset} noValidate className="space-y-4">
                            <div className="space-y-1.5">
                                <label htmlFor="x-code" className="block text-sm font-bold text-[#003200]">
                                    Código recebido
                                </label>
                                <input
                                    id="x-code"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={resetForm.data.code}
                                    onChange={(e) => resetForm.setData('code', e.target.value)}
                                    className={`w-full h-11 px-4 rounded-xl border-2 bg-white font-mono tracking-widest ${
                                        resetForm.errors.code ? 'border-[#B3261E]' : 'border-[#868c88]'
                                    }`}
                                />
                                {resetForm.errors.code && (
                                    <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                        {resetForm.errors.code}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="x-pass" className="block text-sm font-bold text-[#003200]">
                                    Nova senha
                                </label>
                                <PasswordInput
                                    id="x-pass"
                                    autoComplete="new-password"
                                    value={resetForm.data.password}
                                    onChange={(e) => resetForm.setData('password', e.target.value)}
                                    hasError={Boolean(resetForm.errors.password)}
                                />
                                {resetForm.errors.password && (
                                    <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                        {resetForm.errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="x-pass2" className="block text-sm font-bold text-[#003200]">
                                    Confirmar nova senha
                                </label>
                                <PasswordInput
                                    id="x-pass2"
                                    autoComplete="new-password"
                                    value={resetForm.data.password_confirmation}
                                    onChange={(e) =>
                                        resetForm.setData('password_confirmation', e.target.value)
                                    }
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={resetForm.processing}
                                className="w-full h-11 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300] cursor-pointer"
                            >
                                {resetForm.processing ? 'Salvando...' : 'Redefinir senha'}
                            </button>
                        </form>
                    )}

                    <Link
                        href="/login"
                        className="block w-full text-center py-2.5 rounded-xl border-2 border-[#003200]/20 text-[#003200] font-bold text-sm hover:bg-[#EAF5EE]"
                    >
                        Voltar ao login
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
}
