import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Bookmark, Edit3, ExternalLink, Trash2 } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import { formatDateBR } from '@/lib/format';
import type { BlogPost, SharedProps } from '@/types';

interface BlogShowProps {
    post: BlogPost;
    isSaved: boolean;
}

export default function BlogShow({ post, isSaved }: BlogShowProps) {
    const { props } = usePage<SharedProps>();
    const user = props.auth.user;
    const isOwner = user && post.user_id === user.id;

    const paragraphs = post.content.split(/\r?\n/).filter((p) => p.trim().length > 0);

    const toggleSave = () => {
        if (!user) {
            router.visit('/login');
            return;
        }
        router.post(`/blogs/${post.slug}/salvar`, {}, { preserveScroll: true });
    };

    const handleDelete = () => {
        if (!window.confirm(`Excluir o artigo “${post.title}”? Esta ação não pode ser desfeita.`)) {
            return;
        }
        router.delete(`/blogs/${post.slug}`);
    };

    return (
        <MainLayout>
            <Head title={post.title} />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
                <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#003200] hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Voltar aos blogs</span>
                </Link>

                <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5">
                    {post.resolved_cover_url && (
                        <img
                            src={post.resolved_cover_url}
                            alt={post.cover_alt || post.title}
                            className="w-full h-64 sm:h-80 object-cover bg-[#C0E0CA]"
                        />
                    )}

                    <div className="p-6 sm:p-10 space-y-6">
                        <div className="space-y-3">
                            <span className="inline-block px-3 py-1 rounded-full bg-[#EAF5EE] text-[#003200] text-xs font-extrabold">
                                {post.category}
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#003200] leading-tight">
                                {post.title}
                            </h1>
                            <p className="text-sm text-neutral-500 font-semibold">
                                Por {post.author_name} ·{' '}
                                <time dateTime={post.published_at || ''}>
                                    {formatDateBR(post.published_at)}
                                </time>
                            </p>
                        </div>

                        <div className="space-y-4 text-neutral-800 text-base sm:text-lg leading-relaxed">
                            {paragraphs.map((p, idx) => (
                                <p key={idx}>{p}</p>
                            ))}
                        </div>

                        {post.sources && post.sources.length > 0 && (
                            <section
                                aria-label="Fontes e leituras"
                                className="bg-[#EAF5EE] rounded-2xl p-6 space-y-3"
                            >
                                <h2 className="text-lg font-extrabold text-[#003200]">
                                    Fontes e leituras
                                </h2>
                                <ul className="space-y-2 list-disc list-inside text-sm">
                                    {post.sources.map((src, idx) => (
                                        <li key={idx}>
                                            <a
                                                href={src.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 font-bold text-[#003200] hover:underline"
                                            >
                                                <span>{src.title || src.url}</span>
                                                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <div className="flex flex-wrap gap-3 pt-4 border-t border-black/10">
                            <button
                                type="button"
                                onClick={toggleSave}
                                aria-pressed={isSaved}
                                className={`inline-flex items-center gap-2 px-5 h-11 rounded-xl border-2 font-bold text-sm cursor-pointer transition-colors ${
                                    isSaved
                                        ? 'bg-[#003200] border-[#003200] text-white'
                                        : 'border-black/15 bg-white text-neutral-700 hover:bg-[#EAF5EE]'
                                }`}
                            >
                                <Bookmark
                                    className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`}
                                    aria-hidden="true"
                                />
                                <span>{isSaved ? 'Salvo nos favoritos' : 'Salvar artigo'}</span>
                            </button>

                            {isOwner && (
                                <>
                                    <Link
                                        href={`/blogs/${post.slug}/editar`}
                                        className="inline-flex items-center gap-2 px-5 h-11 rounded-xl border-2 border-[#003200] text-[#003200] font-bold text-sm hover:bg-[#EAF5EE]"
                                    >
                                        <Edit3 className="w-4 h-4" aria-hidden="true" />
                                        <span>Editar artigo</span>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="inline-flex items-center gap-2 px-5 h-11 rounded-xl border-2 border-[#B3261E] text-[#B3261E] font-bold text-sm hover:bg-red-50 cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                                        <span>Excluir artigo</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </article>
            </div>
        </MainLayout>
    );
}
