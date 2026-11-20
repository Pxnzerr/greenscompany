import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Camera,
    CheckCircle2,
    ExternalLink,
    LogOut,
    MapPin,
    PenSquare,
    Trash2,
} from 'lucide-react';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import Modal from '@/Components/Modal';
import PasswordInput from '@/Components/PasswordInput';
import MainLayout from '@/Layouts/MainLayout';
import { formatDateBR } from '@/lib/format';
import type { BlogPost, JournalArticle, OngApplication, SharedProps } from '@/types';

interface ProfileShowProps {
    applications: OngApplication[];
    ownPosts: BlogPost[];
    savedPosts: BlogPost[];
    savedJournal: JournalArticle[];
    stats: {
        appliedCount: number;
        readCount: number;
        savedCount: number;
    };
}

export default function ProfileShow({
    applications,
    ownPosts,
    savedPosts,
    savedJournal,
    stats,
}: ProfileShowProps) {
    const { props } = usePage<SharedProps>();
    const user = props.auth.user!;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [activeModal, setActiveModal] = useState<'username' | 'email' | 'password' | null>(null);

    const usernameForm = useForm({ username: user.username });
    const emailForm = useForm({ email: user.email });
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        router.post(
            '/perfil/foto',
            { avatar: file },
            { forceFormData: true, preserveScroll: true }
        );
    };

    const handleRemoveAvatar = () => {
        router.delete('/perfil/foto', { preserveScroll: true });
    };

    const submitUsername = (e: FormEvent) => {
        e.preventDefault();
        usernameForm.patch('/perfil/nome', {
            preserveScroll: true,
            onSuccess: () => setActiveModal(null),
        });
    };

    const submitEmail = (e: FormEvent) => {
        e.preventDefault();
        emailForm.patch('/perfil/email', {
            preserveScroll: true,
            onSuccess: () => setActiveModal(null),
        });
    };

    const submitPassword = (e: FormEvent) => {
        e.preventDefault();
        passwordForm.patch('/perfil/senha', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                setActiveModal(null);
            },
        });
    };

    const deleteOwnPost = (post: BlogPost) => {
        if (!window.confirm(`Excluir “${post.title}”? Esta ação não pode ser desfeita.`)) {
            return;
        }
        router.delete(`/blogs/${post.slug}`, { preserveScroll: true });
    };

    return (
        <MainLayout>
            <Head title="Meu perfil" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
                {/* Cabeçalho do perfil */}
                <section className="rounded-3xl bg-gradient-to-br from-[#003200] to-[#2C8554] text-white p-7 sm:p-10 shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {user.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt={`Foto de perfil de ${user.username}`}
                            className="w-24 h-24 rounded-full object-cover border-4 border-[#C0E0CA] bg-white shrink-0"
                        />
                    ) : (
                        <div
                            aria-hidden="true"
                            className="w-24 h-24 rounded-full bg-white text-[#003200] border-4 border-[#C0E0CA] grid place-items-center text-3xl font-extrabold shrink-0"
                        >
                            {user.username.slice(0, 2).toUpperCase()}
                        </div>
                    )}

                    <div className="space-y-2 flex-1 min-w-0">
                        <span className="inline-block px-3 py-0.5 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider">
                            Meu perfil
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white break-words">
                            {user.username}
                        </h1>
                        <p className="text-white/90 text-sm break-all">{user.email}</p>
                        <p className="text-white/75 text-xs">
                            Este é o nome exibido como autor dos seus artigos nos blogs.
                        </p>

                        <div className="flex flex-wrap gap-2.5 pt-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="sr-only"
                                aria-label="Escolher foto de perfil"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-white text-[#003200] font-bold text-sm hover:bg-[#C0E0CA] cursor-pointer"
                            >
                                <Camera className="w-4 h-4" aria-hidden="true" />
                                <span>Alterar foto</span>
                            </button>
                            {user.avatar_url && (
                                <button
                                    type="button"
                                    onClick={handleRemoveAvatar}
                                    className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-white/15 text-white border border-white/30 font-bold text-sm hover:bg-white/25 cursor-pointer"
                                >
                                    Remover foto
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* KPIs */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 text-center space-y-1">
                        <b className="block text-4xl font-extrabold text-[#003200]">
                            {stats.appliedCount}
                        </b>
                        <span className="text-sm font-semibold text-neutral-600">
                            ONGs apoiadas
                        </span>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 text-center space-y-1">
                        <b className="block text-4xl font-extrabold text-[#003200]">
                            {stats.readCount}
                        </b>
                        <span className="text-sm font-semibold text-neutral-600">
                            Artigos lidos
                        </span>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 text-center space-y-1">
                        <b className="block text-4xl font-extrabold text-[#003200]">
                            {stats.savedCount}
                        </b>
                        <span className="text-sm font-semibold text-neutral-600">
                            Itens salvos
                        </span>
                    </div>
                </section>

                {/* Grade principal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 items-start">
                    <div className="space-y-7">
                        {/* Minha conta */}
                        <section className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 space-y-4">
                            <h2 className="text-xl font-extrabold text-[#003200]">Minha conta</h2>

                            <div className="divide-y divide-black/10">
                                <div className="py-3.5 flex items-center justify-between gap-4 flex-wrap">
                                    <div>
                                        <span className="text-xs text-neutral-500 block">
                                            Nome de usuário
                                        </span>
                                        <strong className="text-neutral-900">{user.username}</strong>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            usernameForm.setData('username', user.username);
                                            setActiveModal('username');
                                        }}
                                        className="px-4 h-9 rounded-xl border-2 border-[#003200] text-[#003200] font-bold text-xs hover:bg-[#EAF5EE] cursor-pointer"
                                    >
                                        Alterar nome
                                    </button>
                                </div>

                                <div className="py-3.5 flex items-center justify-between gap-4 flex-wrap">
                                    <div>
                                        <span className="text-xs text-neutral-500 block">E-mail</span>
                                        <strong className="text-neutral-900">{user.email}</strong>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            emailForm.setData('email', user.email);
                                            setActiveModal('email');
                                        }}
                                        className="px-4 h-9 rounded-xl border-2 border-[#003200] text-[#003200] font-bold text-xs hover:bg-[#EAF5EE] cursor-pointer"
                                    >
                                        Alterar e-mail
                                    </button>
                                </div>

                                <div className="py-3.5 flex items-center justify-between gap-4 flex-wrap">
                                    <div>
                                        <span className="text-xs text-neutral-500 block">Senha</span>
                                        <strong className="text-neutral-900">••••••••</strong>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setActiveModal('password')}
                                        className="px-4 h-9 rounded-xl border-2 border-[#003200] text-[#003200] font-bold text-xs hover:bg-[#EAF5EE] cursor-pointer"
                                    >
                                        Alterar senha
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* ONGs cadastradas */}
                        <section className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 space-y-4">
                            <h2 className="text-xl font-extrabold text-[#003200]">
                                ONGs cadastradas
                            </h2>
                            {applications.length === 0 ? (
                                <div className="space-y-3">
                                    <p className="text-sm text-neutral-600">
                                        Que tal começar? Ainda não há ONGs aqui.
                                    </p>
                                    <Link
                                        href="/ongs"
                                        className="inline-flex items-center px-5 h-10 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300]"
                                    >
                                        Ver ONGs
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {applications.map((app) => (
                                        <div
                                            key={app.id}
                                            className="flex items-start justify-between gap-4 border-b border-black/10 pb-3.5 last:border-0 last:pb-0"
                                        >
                                            <div className="space-y-1">
                                                <Link
                                                    href={`/ongs/${app.ong?.slug}`}
                                                    className="font-extrabold text-[#003200] hover:underline"
                                                >
                                                    {app.ong?.name}
                                                </Link>
                                                <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                                                    <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                                                    <span>{app.ong?.location}</span>
                                                </p>
                                                {app.availability && (
                                                    <p className="text-xs text-neutral-600">
                                                        Disponibilidade: {app.availability}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBFAEA] text-[#1F4F21] text-xs font-extrabold shrink-0">
                                                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                                                <span>Em análise</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="space-y-7">
                        {/* Meus blogs */}
                        <section className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 space-y-4">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div>
                                    <h2 className="text-xl font-extrabold text-[#003200]">
                                        Meus blogs
                                    </h2>
                                    <p className="text-xs text-neutral-500">
                                        Artigos publicados e rascunhos da sua conta.
                                    </p>
                                </div>
                                <Link
                                    href="/blogs/novo"
                                    className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300]"
                                >
                                    <PenSquare className="w-4 h-4" aria-hidden="true" />
                                    <span>Escrever artigo</span>
                                </Link>
                            </div>

                            {ownPosts.length === 0 ? (
                                <p className="text-sm text-neutral-600">
                                    Você ainda não escreveu nenhum blog.
                                </p>
                            ) : (
                                <div className="space-y-4 divide-y divide-black/10">
                                    {ownPosts.map((post) => {
                                        const isDraft = post.status === 'draft';
                                        return (
                                            <article key={post.id} className="pt-4 first:pt-0 space-y-2.5">
                                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                                    <div>
                                                        <h3 className="font-extrabold text-[#003200]">
                                                            {post.title}
                                                        </h3>
                                                        <p className="text-xs text-neutral-500 font-semibold">
                                                            {isDraft ? 'Rascunho' : post.category} ·{' '}
                                                            {formatDateBR(post.published_at)}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={`/blogs/${post.slug}/editar`}
                                                            className="px-3.5 h-9 inline-flex items-center rounded-xl border-2 border-[#003200]/25 text-[#003200] font-bold text-xs hover:bg-[#EAF5EE]"
                                                        >
                                                            {isDraft ? 'Continuar editando' : 'Editar'}
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteOwnPost(post)}
                                                            aria-label={`Excluir ${post.title}`}
                                                            className="px-3 h-9 inline-flex items-center rounded-xl border-2 border-[#B3261E] text-[#B3261E] font-bold text-xs hover:bg-red-50 cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                {post.content && (
                                                    <p className="text-sm text-neutral-600 line-clamp-2">
                                                        {post.content}
                                                    </p>
                                                )}
                                                {!isDraft && (
                                                    <Link
                                                        href={`/blogs/${post.slug}`}
                                                        className="inline-block text-xs font-extrabold text-[#2C8554] hover:underline"
                                                    >
                                                        Ler artigo →
                                                    </Link>
                                                )}
                                            </article>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* Blogs salvos */}
                        <section className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 space-y-4">
                            <h2 className="text-xl font-extrabold text-[#003200]">Blogs salvos</h2>
                            {savedPosts.length === 0 ? (
                                <div className="space-y-3">
                                    <p className="text-sm text-neutral-600">
                                        Você ainda não salvou nenhum blog.
                                    </p>
                                    <Link
                                        href="/blogs"
                                        className="inline-flex items-center px-5 h-10 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300]"
                                    >
                                        Ver blogs
                                    </Link>
                                </div>
                            ) : (
                                <ul className="space-y-2">
                                    {savedPosts.map((b) => (
                                        <li key={b.id}>
                                            <Link
                                                href={`/blogs/${b.slug}`}
                                                className="font-bold text-sm text-[#003200] hover:underline"
                                            >
                                                {b.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        {/* Jornais salvos */}
                        <section className="bg-white rounded-2xl p-6 shadow-xs border border-black/5 space-y-4">
                            <h2 className="text-xl font-extrabold text-[#003200]">
                                Jornais salvos
                            </h2>
                            {savedJournal.length === 0 ? (
                                <div className="space-y-3">
                                    <p className="text-sm text-neutral-600">
                                        Você ainda não salvou nenhum jornal.
                                    </p>
                                    <Link
                                        href="/jornal"
                                        className="inline-flex items-center px-5 h-10 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300]"
                                    >
                                        Ver jornal
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {savedJournal.map((j) => (
                                        <a
                                            key={j.id}
                                            href={j.external_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm font-bold text-[#003200] hover:underline"
                                        >
                                            <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                                            <span>
                                                {j.title} · {j.source_name}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>

                <div>
                    <button
                        type="button"
                        onClick={() => router.post('/logout')}
                        className="inline-flex items-center gap-2 px-5 h-11 rounded-xl border-2 border-[#003200] text-[#003200] font-bold text-sm hover:bg-white cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" aria-hidden="true" />
                        <span>Sair da conta</span>
                    </button>
                </div>
            </div>

            {/* Modais de edição de conta */}
            <Modal
                open={activeModal === 'username'}
                onClose={() => setActiveModal(null)}
                title="Alterar nome"
            >
                <form onSubmit={submitUsername} className="space-y-4">
                    <div className="space-y-1.5">
                        <label htmlFor="m-username" className="block text-sm font-bold text-[#003200]">
                            Nome de usuário
                        </label>
                        <input
                            id="m-username"
                            type="text"
                            value={usernameForm.data.username}
                            onChange={(e) => usernameForm.setData('username', e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border-2 border-[#868c88]"
                        />
                        {usernameForm.errors.username && (
                            <p className="text-xs font-bold text-[#B3261E]">
                                {usernameForm.errors.username}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={usernameForm.processing}
                            className="px-5 h-10 rounded-xl bg-[#003200] text-white font-bold text-sm cursor-pointer"
                        >
                            Salvar
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveModal(null)}
                            className="px-5 h-10 rounded-xl border-2 border-black/15 font-bold text-sm cursor-pointer"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                open={activeModal === 'email'}
                onClose={() => setActiveModal(null)}
                title="Alterar e-mail"
            >
                <form onSubmit={submitEmail} className="space-y-4">
                    <div className="space-y-1.5">
                        <label htmlFor="m-email" className="block text-sm font-bold text-[#003200]">
                            Novo e-mail
                        </label>
                        <input
                            id="m-email"
                            type="email"
                            value={emailForm.data.email}
                            onChange={(e) => emailForm.setData('email', e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border-2 border-[#868c88]"
                        />
                        {emailForm.errors.email && (
                            <p className="text-xs font-bold text-[#B3261E]">
                                {emailForm.errors.email}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={emailForm.processing}
                            className="px-5 h-10 rounded-xl bg-[#003200] text-white font-bold text-sm cursor-pointer"
                        >
                            Salvar
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveModal(null)}
                            className="px-5 h-10 rounded-xl border-2 border-black/15 font-bold text-sm cursor-pointer"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                open={activeModal === 'password'}
                onClose={() => setActiveModal(null)}
                title="Alterar senha"
            >
                <form onSubmit={submitPassword} className="space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="m-curpass" className="block text-sm font-bold text-[#003200]">
                            Senha atual
                        </label>
                        <PasswordInput
                            id="m-curpass"
                            value={passwordForm.data.current_password}
                            onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                            hasError={Boolean(passwordForm.errors.current_password)}
                        />
                        {passwordForm.errors.current_password && (
                            <p className="text-xs font-bold text-[#B3261E]">
                                {passwordForm.errors.current_password}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="m-newpass" className="block text-sm font-bold text-[#003200]">
                            Nova senha
                        </label>
                        <PasswordInput
                            id="m-newpass"
                            value={passwordForm.data.password}
                            onChange={(e) => passwordForm.setData('password', e.target.value)}
                            hasError={Boolean(passwordForm.errors.password)}
                        />
                        {passwordForm.errors.password && (
                            <p className="text-xs font-bold text-[#B3261E]">
                                {passwordForm.errors.password}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="m-confpass" className="block text-sm font-bold text-[#003200]">
                            Confirmar nova senha
                        </label>
                        <PasswordInput
                            id="m-confpass"
                            value={passwordForm.data.password_confirmation}
                            onChange={(e) =>
                                passwordForm.setData('password_confirmation', e.target.value)
                            }
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={passwordForm.processing}
                            className="px-5 h-10 rounded-xl bg-[#003200] text-white font-bold text-sm cursor-pointer"
                        >
                            Alterar senha
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveModal(null)}
                            className="px-5 h-10 rounded-xl border-2 border-black/15 font-bold text-sm cursor-pointer"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </Modal>
        </MainLayout>
    );
}
