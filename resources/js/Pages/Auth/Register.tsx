import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useRef, useState } from 'react';
import PasswordInput from '@/Components/PasswordInput';
import MainLayout from '@/Layouts/MainLayout';
import { BRAZILIAN_STATES } from '@/lib/format';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        username: '',
        password: '',
        password_confirmation: '',
        cep: '',
        street: '',
        neighborhood: '',
        city: '',
        state: '',
    });

    const [cepHint, setCepHint] = useState(
        'Digite o CEP e preencheremos o endereço para você.'
    );
    const [loadingCep, setLoadingCep] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    const passwordMismatch =
        data.password_confirmation.length > 0 && data.password !== data.password_confirmation;

    const handleCepChange = async (rawValue: string) => {
        const digits = rawValue.replace(/\D/g, '').slice(0, 8);
        const formatted = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
        setData('cep', formatted);

        if (abortRef.current) abortRef.current.abort();

        if (digits.length < 8) {
            setLoadingCep(false);
            setCepHint('Digite o CEP e preencheremos o endereço para você.');
            return;
        }

        const controller = new AbortController();
        abortRef.current = controller;
        setLoadingCep(true);
        setCepHint('Buscando endereço...');

        try {
            const response = await fetch(`/api/cep/${digits}`, {
                signal: controller.signal,
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) {
                setCepHint('CEP não encontrado. Preencha o endereço manualmente.');
                return;
            }

            const addr = (await response.json()) as {
                street?: string;
                neighborhood?: string;
                city?: string;
                state?: string;
            };

            setData((prev) => ({
                ...prev,
                cep: formatted,
                street: addr.street || prev.street,
                neighborhood: addr.neighborhood || prev.neighborhood,
                city: addr.city || prev.city,
                state: addr.state || prev.state,
            }));
            setCepHint('Endereço preenchido automaticamente.');
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                setCepHint('Busca automática indisponível — preencha o endereço manualmente.');
            }
        } finally {
            setLoadingCep(false);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/cadastro');
    };

    return (
        <MainLayout>
            <Head title="Crie sua conta" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-black/5 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        <h1 className="text-3xl font-extrabold text-[#003200]">Crie sua conta</h1>

                        <div className="space-y-1">
                            <label htmlFor="c-email" className="block text-sm font-bold text-[#003200]">
                                E-mail
                            </label>
                            <input
                                id="c-email"
                                type="email"
                                autoComplete="email"
                                placeholder="nome@email.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full h-11 px-4 rounded-xl border-2 bg-white ${
                                    errors.email ? 'border-[#B3261E]' : 'border-[#868c88]'
                                }`}
                            />
                            {errors.email && (
                                <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="c-user" className="block text-sm font-bold text-[#003200]">
                                Nome de usuário
                            </label>
                            <input
                                id="c-user"
                                type="text"
                                autoComplete="username"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className={`w-full h-11 px-4 rounded-xl border-2 bg-white ${
                                    errors.username ? 'border-[#B3261E]' : 'border-[#868c88]'
                                }`}
                            />
                            {errors.username && (
                                <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div className="space-y-1">
                                <label htmlFor="c-pass" className="block text-sm font-bold text-[#003200]">
                                    Senha
                                </label>
                                <PasswordInput
                                    id="c-pass"
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    hasError={Boolean(errors.password)}
                                />
                                <p className="text-xs text-neutral-500">Mínimo de 6 caracteres.</p>
                                {errors.password && (
                                    <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="c-pass2" className="block text-sm font-bold text-[#003200]">
                                    Confirmar senha
                                </label>
                                <PasswordInput
                                    id="c-pass2"
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    hasError={passwordMismatch || Boolean(errors.password_confirmation)}
                                />
                                {passwordMismatch && (
                                    <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                        As senhas não coincidem.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="c-cep" className="block text-sm font-bold text-[#003200]">
                                CEP
                            </label>
                            <input
                                id="c-cep"
                                inputMode="numeric"
                                maxLength={9}
                                autoComplete="postal-code"
                                placeholder="00000-000"
                                value={data.cep}
                                onChange={(e) => handleCepChange(e.target.value)}
                                className={`w-full h-11 px-4 rounded-xl border-2 bg-white ${
                                    errors.cep ? 'border-[#B3261E]' : 'border-[#868c88]'
                                }`}
                            />
                            <p className="text-xs text-neutral-500" aria-live="polite">
                                {cepHint}
                            </p>
                            {errors.cep && (
                                <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                    {errors.cep}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="c-street" className="block text-sm font-bold text-[#003200]">
                                Rua
                            </label>
                            <input
                                id="c-street"
                                type="text"
                                disabled={loadingCep}
                                autoComplete="address-line1"
                                value={data.street}
                                onChange={(e) => setData('street', e.target.value)}
                                className={`w-full h-11 px-4 rounded-xl border-2 bg-white disabled:bg-[#EAF5EE] ${
                                    errors.street ? 'border-[#B3261E]' : 'border-[#868c88]'
                                }`}
                            />
                            {errors.street && (
                                <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                    {errors.street}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <label htmlFor="c-neigh" className="block text-sm font-bold text-[#003200]">
                                    Bairro
                                </label>
                                <input
                                    id="c-neigh"
                                    type="text"
                                    disabled={loadingCep}
                                    value={data.neighborhood}
                                    onChange={(e) => setData('neighborhood', e.target.value)}
                                    className={`w-full h-11 px-3 rounded-xl border-2 bg-white disabled:bg-[#EAF5EE] ${
                                        errors.neighborhood ? 'border-[#B3261E]' : 'border-[#868c88]'
                                    }`}
                                />
                                {errors.neighborhood && (
                                    <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                        {errors.neighborhood}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="c-city" className="block text-sm font-bold text-[#003200]">
                                    Cidade
                                </label>
                                <input
                                    id="c-city"
                                    type="text"
                                    disabled={loadingCep}
                                    autoComplete="address-level2"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className={`w-full h-11 px-3 rounded-xl border-2 bg-white disabled:bg-[#EAF5EE] ${
                                        errors.city ? 'border-[#B3261E]' : 'border-[#868c88]'
                                    }`}
                                />
                                {errors.city && (
                                    <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                        {errors.city}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="c-state" className="block text-sm font-bold text-[#003200]">
                                    Estado
                                </label>
                                <select
                                    id="c-state"
                                    disabled={loadingCep}
                                    autoComplete="address-level1"
                                    value={data.state}
                                    onChange={(e) => setData('state', e.target.value)}
                                    className={`w-full h-11 px-3 rounded-xl border-2 bg-white disabled:bg-[#EAF5EE] ${
                                        errors.state ? 'border-[#B3261E]' : 'border-[#868c88]'
                                    }`}
                                >
                                    <option value="">UF</option>
                                    {BRAZILIAN_STATES.map((uf) => (
                                        <option key={uf} value={uf}>
                                            {uf}
                                        </option>
                                    ))}
                                </select>
                                {errors.state && (
                                    <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                        {errors.state}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing || passwordMismatch}
                            className="w-full h-11 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300] disabled:opacity-60 cursor-pointer"
                        >
                            {processing ? 'Cadastrando...' : 'Cadastrar'}
                        </button>

                        <p className="text-center text-sm text-neutral-600">
                            Já tem conta?{' '}
                            <Link href="/login" className="font-bold text-[#003200] hover:underline">
                                Faça login aqui
                            </Link>
                        </p>
                    </form>

                    <img
                        src="https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?auto=format&fit=crop&w=1200&q=75"
                        alt="Vista aérea de uma floresta densa"
                        className="w-full aspect-4/3 object-cover rounded-2xl bg-[#C0E0CA] md:sticky md:top-24"
                    />
                </div>
            </div>
        </MainLayout>
    );
}
