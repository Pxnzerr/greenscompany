import { Head, Link, router, usePage } from '@inertiajs/react';
import { Bookmark, Info, PenSquare, Search, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { formatDateBR } from '@/lib/format';
import type { BlogPost, SharedProps } from '@/types';

interface BlogsIndexProps {
    posts: BlogPost[];
    categories: string[];
    savedIds: number[];
    filters: {
        category: string;
        q: string;
        sort: string;
    };
}

export default function BlogsIndex({ posts, categories, savedIds, filters }: BlogsIndexProps) {
    const { props } = usePage<SharedProps>();
    const user = props.auth.user;
    const [search, setSearch] = useState(filters.q);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = window.setTimeout(() => {
            applyFilters({ q: search.trim() || undefined });
        }, 250);

        return () => window.clearTimeout(timer);
    }, [search]);

    const applyFilters = (overrides: { category?: string; q?: string; sort?: string }) => {
        const nextCategory = overrides.category ?? filters.category;
        const nextSort = overrides.sort ?? filters.sort;
        const nextQ = overrides.q !== undefined ? overrides.q : search.trim();

        router.get(
            '/blogs',
            {
                category: nextCategory !== 'Todas' ? nextCategory : undefined,
                sort: nextSort !== 'newest' ? nextSort : undefined,
                q: nextQ || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const toggleSave = (post: BlogPost) => {
        if (!user) {
            router.visit('/login');
            return;
        }
        router.post(`/blogs/${post.slug}/salvar`, {}, { preserveScroll: true });
    };

    const deletePost = (post: BlogPost) => {
        if (!window.confirm(`Excluir o artigo “${post.title}”? Esta ação não pode ser desfeita.`)) {
            return;
        }
        router.delete(`/blogs/${post.slug}`, { preserveScroll: true });
    };

    return (
        <MainLayout>
            <Head title="Blogs" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#003200]">
                            Blogs
                        </h1>
                        <p className="text-neutral-600">
                            Dicas práticas, tutoriais e reflexões da comunidade Green’s.
                        </p>
                    </div>

                    <Link
                        href="/blogs/novo"
                        className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300] shadow-xs"
                    >
                        <PenSquare className="w-4 h-4" aria-hidden="true" />
                        <span>Escrever artigo</span>
                    </Link>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-black/5 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-lg">
                            <Search
                                className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                aria-hidden="true"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por título, conteúdo ou autor"
                                aria-label="Buscar por título, conteúdo ou autor"
                                className="w-full h-11 pl-12 pr-4 rounded-xl border-2 border-[#868c88] bg-white focus:border-[#003200]"
                            />
                        </div>

                        <div className="flex items-center gap-2.5">
                            <label htmlFor="blog-sort" className="text-sm font-bold text-[#003200]">
                                Ordenar:
                            </label>
                            <select
                                id="blog-sort"
                                value={filters.sort}
                                onChange={(e) => applyFilters({ sort: e.target.value })}
                                className="h-11 px-3.5 rounded-xl border-2 border-[#868c88] bg-white text-sm font-semibold"
                            >
                                <option value="newest">Mais recentes</option>
                                <option value="oldest">Mais antigos</option>
                                <option value="title">Título: A–Z</option>
                            </select>
                        </div>
                    </div>

                    <div
                        className="flex flex-wrap gap-2"
                        role="group"
                        aria-label="Filtrar artigos por categoria"
                    >
                        {categories.map((cat) => {
                            const active = cat === filters.category;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => applyFilters({ category: cat })}
                                    className={`h-10 px-4 rounded-full text-sm font-bold border-2 transition-colors cursor-pointer ${
                                        active
                                            ? 'bg-[#003200] border-[#003200] text-white'
                                            : 'bg-white border-[#C0E0CA] text-[#003200] hover:bg-[#EAF5EE]'
                                    }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <p className="text-sm font-semibold text-neutral-600" role="status">
                    {posts.length > 0
                        ? `${posts.length} ${posts.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}`
                        : ''}
                </p>

                {posts.length === 0 ? (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-[#C0E0CA]/60 border-l-4 border-[#2C8554] text-[#003200] font-semibold">
                        <Info className="w-5 h-5 shrink-0" aria-hidden="true" />
                        <span>
                            Nenhum artigo encontrado. Tente outra busca ou categoria.
                        </span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                        {posts.map((post) => {
                            const saved = savedIds.includes(post.id);
                            const isOwner = user && post.user_id === user.id;
                            return (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 hover:shadow-lg transition-shadow flex flex-col"
                                >
                                    {post.resolved_cover_url && (
                                        <img
                                            src={post.resolved_cover_url}
                                            alt={post.cover_alt || post.title}
                                            loading="lazy"
                                            className="w-full h-44 object-cover bg-[#C0E0CA]"
                                        />
                                    )}
                                    <div className="p-6 flex-1 flex flex-col gap-3">
                                        <span className="self-start px-3 py-1 rounded-full bg-[#EAF5EE] text-[#003200] text-xs font-extrabold">
                                            {post.category}
                                        </span>
                                        <h2 className="text-xl font-extrabold text-[#003200] leading-snug">
                                            {post.title}
                                        </h2>
                                        <p className="text-xs text-neutral-500 font-semibold">
                                            Por {post.author_name} ·{' '}
                                            <time dateTime={post.published_at || ''}>
                                                {formatDateBR(post.published_at)}
                                            </time>
                                        </p>
                                        <p className="text-sm text-neutral-600 line-clamp-3 flex-1 leading-relaxed">
                                            {post.content}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-2 pt-2">
                                            <Link
                                                href={`/blogs/${post.slug}`}
                                                className="inline-flex items-center justify-center px-4 h-10 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300]"
                                            >
                                                Ler artigo
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => toggleSave(post)}
                                                aria-pressed={saved}
                                                aria-label={`Salvar: ${post.title}`}
                                                className={`inline-flex items-center gap-1.5 px-3.5 h-10 rounded-xl border-2 font-bold text-sm cursor-pointer transition-colors ${
                                                    saved
                                                        ? 'bg-[#003200] border-[#003200] text-white'
                                                        : 'border-black/15 bg-white text-neutral-700 hover:bg-[#EAF5EE]'
                                                }`}
                                            >
                                                <Bookmark
                                                    className={`w-4 h-4 ${saved ? 'fill-current' : ''}`}
                                                    aria-hidden="true"
                                                />
                                                <span>{saved ? 'Salvo' : 'Salvar'}</span>
                                            </button>

                                            {isOwner && (
                                                <>
                                                    <Link
                                                        href={`/blogs/${post.slug}/editar`}
                                                        className="inline-flex items-center px-3.5 h-10 rounded-xl border-2 border-[#003200]/25 text-[#003200] font-bold text-sm hover:bg-[#EAF5EE]"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => deletePost(post)}
                                                        aria-label={`Excluir artigo: ${post.title}`}
                                                        className="inline-flex items-center gap-1 px-3 h-10 rounded-xl border-2 border-[#B3261E] text-[#B3261E] font-bold text-sm hover:bg-red-50 cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
