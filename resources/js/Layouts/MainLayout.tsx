import { Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Info,
    Leaf,
    Menu,
    User as UserIcon,
    X,
} from 'lucide-react';
import { PropsWithChildren, useEffect, useState } from 'react';
import type { SharedProps } from '@/types';

interface ToastItem {
    id: number;
    type: 'success' | 'error' | 'info';
    text: string;
}

interface MainLayoutProps extends PropsWithChildren {
    pageBg?: string;
}

const NAV_ITEMS = [
    { label: 'Home', href: '/', match: (url: string) => url === '/' },
    { label: 'Quem Somos', href: '/quem-somos', match: (url: string) => url.startsWith('/quem-somos') },
    { label: 'ONGs', href: '/ongs', match: (url: string) => url.startsWith('/ongs') },
    { label: 'Jornal', href: '/jornal', match: (url: string) => url.startsWith('/jornal') },
    { label: 'Blogs', href: '/blogs', match: (url: string) => url.startsWith('/blogs') },
];

export default function MainLayout({ children, pageBg }: MainLayoutProps) {
    const { url, props } = usePage<SharedProps>();
    const user = props.auth.user;
    const [menuOpen, setMenuOpen] = useState(false);
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        if (pageBg) {
            document.body.style.setProperty('--page-bg', pageBg);
        } else {
            document.body.style.removeProperty('--page-bg');
        }
        return () => {
            document.body.style.removeProperty('--page-bg');
        };
    }, [pageBg]);

    useEffect(() => {
        setMenuOpen(false);
    }, [url]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    useEffect(() => {
        const incoming: Array<{ type: ToastItem['type']; text: string }> = [];
        if (props.flash.success) incoming.push({ type: 'success', text: props.flash.success });
        if (props.flash.error) incoming.push({ type: 'error', text: props.flash.error });
        if (props.flash.info) incoming.push({ type: 'info', text: props.flash.info });

        if (!incoming.length) return;

        const created = incoming.map((item, idx) => ({
            id: Date.now() + idx,
            ...item,
        }));

        setToasts((prev) => [...prev, ...created].slice(-3));

        const timers = created.map((toast) =>
            window.setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }, 4500)
        );

        return () => timers.forEach((t) => window.clearTimeout(t));
    }, [props.flash.success, props.flash.error, props.flash.info]);

    return (
        <div className="min-h-screen flex flex-col">
            <a className="skip-link" href="#main-content">
                Pular para o conteúdo
            </a>

            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs">
                <nav
                    aria-label="Navegação principal"
                    className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2.5 text-[#003200] font-extrabold text-xl tracking-tight shrink-0"
                    >
                        <span className="w-9 h-9 rounded-xl bg-[#003200] text-white grid place-items-center shadow-xs">
                            <Leaf className="w-5 h-5" aria-hidden="true" />
                        </span>
                        <span>Green’s Company</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {NAV_ITEMS.map((item) => {
                            const active = item.match(url);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={active ? 'page' : undefined}
                                    className={`px-4 py-2 rounded-lg text-[15px] font-bold transition-colors ${
                                        active
                                            ? 'bg-[#C0E0CA] text-[#003200]'
                                            : 'text-[#003200]/85 hover:bg-[#EAF5EE] hover:text-[#003200]'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2">
                        {user ? (
                            <Link
                                href="/perfil"
                                aria-label={`Meu perfil (${user.username})`}
                                className="inline-flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border-2 border-[#003200]/20 hover:border-[#003200] bg-white transition-colors"
                            >
                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt=""
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="w-8 h-8 rounded-full bg-[#003200] text-white text-xs font-extrabold grid place-items-center">
                                        {user.username.slice(0, 2).toUpperCase()}
                                    </span>
                                )}
                                <span className="hidden sm:inline text-sm font-bold text-[#003200]">
                                    {user.username}
                                </span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border-2 border-[#003200] text-[#003200] text-sm font-bold hover:bg-[#EAF5EE] transition-colors"
                                >
                                    <UserIcon className="w-4 h-4" aria-hidden="true" />
                                    <span>Entrar</span>
                                </Link>
                                <Link
                                    href="/cadastro"
                                    className="hidden sm:inline-flex items-center px-4 h-10 rounded-lg bg-[#003200] text-white text-sm font-bold hover:bg-[#002300] transition-colors shadow-xs"
                                >
                                    Junte-se
                                </Link>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-nav"
                            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                            className="md:hidden w-11 h-11 rounded-lg border-2 border-[#003200]/20 text-[#003200] grid place-items-center hover:bg-[#EAF5EE]"
                        >
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </nav>

                {menuOpen && (
                    <div
                        id="mobile-nav"
                        className="md:hidden border-t border-emerald-950/10 bg-white px-4 py-3 space-y-1"
                    >
                        {NAV_ITEMS.map((item) => {
                            const active = item.match(url);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={active ? 'page' : undefined}
                                    className={`block px-4 py-2.5 rounded-lg font-bold ${
                                        active
                                            ? 'bg-[#C0E0CA] text-[#003200]'
                                            : 'text-[#003200] hover:bg-[#EAF5EE]'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                        {!user && (
                            <Link
                                href="/cadastro"
                                className="block px-4 py-2.5 rounded-lg bg-[#003200] text-white font-bold text-center mt-2"
                            >
                                Criar conta
                            </Link>
                        )}
                    </div>
                )}
            </header>

            <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
                {children}
            </main>

            <footer className="bg-[#003200] text-white mt-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 font-extrabold text-lg">
                            <Leaf className="w-5 h-5 text-[#92C7A4]" aria-hidden="true" />
                            <span>Green’s Company</span>
                        </div>
                        <p className="text-sm text-white/80">Contato: (31) 99999-9999</p>
                        <p className="text-xs text-white/70 max-w-md">
                            Fotos: Clare Tallamy, Joanne Francis, Ashley Diane Worsham, Narno Beats e
                            outros autores, via Unsplash.
                        </p>
                    </div>

                    <nav aria-label="Rodapé" className="flex flex-wrap gap-2">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="px-3.5 py-2 rounded-lg text-sm font-bold text-white/90 hover:bg-white/10 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </footer>

            <div
                aria-live="polite"
                className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2.5 sm:max-w-sm pointer-events-none"
            >
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        role="status"
                        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-bold ${
                            t.type === 'error'
                                ? 'bg-[#B3261E] text-white border-red-900/20'
                                : t.type === 'info'
                                  ? 'bg-[#184715] text-white border-emerald-950/20'
                                  : 'bg-[#003200] text-white border-emerald-950/20'
                        }`}
                    >
                        {t.type === 'error' ? (
                            <AlertCircle className="w-5 h-5 shrink-0" />
                        ) : t.type === 'info' ? (
                            <Info className="w-5 h-5 shrink-0" />
                        ) : (
                            <CheckCircle2 className="w-5 h-5 shrink-0 text-[#92C7A4]" />
                        )}
                        <span className="flex-1">{t.text}</span>
                        <button
                            type="button"
                            onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
                            aria-label="Fechar aviso"
                            className="p-1 rounded-md hover:bg-white/15"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
