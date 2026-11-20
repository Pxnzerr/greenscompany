import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import PasswordInput from '@/Components/PasswordInput';
import MainLayout from '@/Layouts/MainLayout';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        login: '',
        password: '',
        remember: true,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <MainLayout>
            <Head title="Entrar" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-black/5 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-extrabold text-[#003200]">Entrar</h1>
                            <p className="text-sm text-neutral-500">
                                Para testar: <code className="font-mono font-bold">demo@greens.com</code> /{' '}
                                <code className="font-mono font-bold">123456</code>
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="l-login" className="block text-sm font-bold text-[#003200]">
                                E-mail ou nome de usuário
                            </label>
                            <input
                                id="l-login"
                                type="text"
                                autoComplete="username"
                                value={data.login}
                                onChange={(e) => setData('login', e.target.value)}
                                className={`w-full h-11 px-4 rounded-xl border-2 bg-white ${
                                    errors.login ? 'border-[#B3261E]' : 'border-[#868c88]'
                                }`}
                            />
                            {errors.login && (
                                <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                    {errors.login}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="l-pass" className="block text-sm font-bold text-[#003200]">
                                Senha
                            </label>
                            <PasswordInput
                                id="l-pass"
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                hasError={Boolean(errors.password)}
                            />
                            {errors.password && (
                                <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="inline-flex items-center gap-2 text-neutral-700 font-semibold cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 accent-[#003200]"
                                />
                                <span>Manter conectado</span>
                            </label>
                            <Link
                                href="/esqueci-senha"
                                className="font-bold text-[#003200] hover:underline"
                            >
                                Esqueci minha senha
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-11 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300] disabled:opacity-60 cursor-pointer"
                        >
                            {processing ? 'Entrando...' : 'Entrar'}
                        </button>

                        <p className="text-center text-sm text-neutral-600">
                            Novo na Green’s?{' '}
                            <Link href="/cadastro" className="font-bold text-[#003200] hover:underline">
                                Crie uma conta
                            </Link>
                        </p>
                    </form>

                    <img
                        src="https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1200&q=75"
                        alt="Árvore verde envolta por neblina"
                        className="w-full aspect-4/3 object-cover rounded-2xl bg-[#C0E0CA]"
                    />
                </div>
            </div>
        </MainLayout>
    );
}
