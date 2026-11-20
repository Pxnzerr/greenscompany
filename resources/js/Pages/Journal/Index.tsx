import { Head, router, usePage } from '@inertiajs/react';
import { Bookmark, ExternalLink } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import { formatRelativeTime } from '@/lib/format';
import type { JournalArticle, SharedProps } from '@/types';

interface JournalIndexProps {
    articles: JournalArticle[];
    savedIds: number[];
}

export default function JournalIndex({ articles, savedIds }: JournalIndexProps) {
    const { props } = usePage<SharedProps>();
    const user = props.auth.user;

    const [featured, ...rest] = articles;

    const toggleSave = (articleId: number) => {
        if (!user) {
            router.visit('/login');
            return;
        }
        router.post(`/jornal/${articleId}/salvar`, {}, { preserveScroll: true });
    };

    return (
        <MainLayout>
            <Head title="Jornal" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
                <div className="space-y-1.5">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#003200]">Jornal</h1>
                    <p className="text-neutral-600">
                        Últimas notícias e relatórios sobre clima, restauração e meio ambiente.
                    </p>
                </div>

                {featured && (
                    <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5">
                        <img
                            src={featured.image_url}
                            alt={featured.image_alt}
                            className="w-full aspect-16/9 max-h-[420px] object-cover bg-[#C0E0CA]"
                        />
                        <div className="p-6 sm:p-8 space-y-4">
                            <p className="text-sm text-neutral-500 font-semibold">
                                <span className="text-[#B3261E] font-extrabold uppercase tracking-wider">
                                    {featured.category}
                                </span>{' '}
                                · {featured.source_name} ·{' '}
                                <time dateTime={featured.published_at}>
                                    {formatRelativeTime(featured.published_at)}
                                </time>
                            </p>
                            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#003200] leading-tight">
                                {featured.title}
                            </h2>
                            <p className="text-neutral-700 text-base sm:text-lg leading-relaxed max-w-3xl">
                                {featured.summary}
                            </p>
                            <div className="flex flex-wrap gap-3 pt-1">
                                <a
                                    href={featured.external_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 h-11 rounded-xl border-2 border-[#003200] text-[#003200] font-bold text-sm hover:bg-[#EAF5EE]"
                                >
                                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                                    <span>Ler na fonte</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={() => toggleSave(featured.id)}
                                    aria-pressed={savedIds.includes(featured.id)}
                                    className={`inline-flex items-center gap-2 px-5 h-11 rounded-xl border-2 font-bold text-sm transition-colors cursor-pointer ${
                                        savedIds.includes(featured.id)
                                            ? 'bg-[#003200] border-[#003200] text-white'
                                            : 'border-black/15 bg-white text-neutral-700 hover:bg-[#EAF5EE]'
                                    }`}
                                >
                                    <Bookmark
                                        className={`w-4 h-4 ${savedIds.includes(featured.id) ? 'fill-current' : ''}`}
                                        aria-hidden="true"
                                    />
                                    <span>{savedIds.includes(featured.id) ? 'Salvo' : 'Salvar'}</span>
                                </button>
                            </div>
                        </div>
                    </article>
                )}

                <div className="space-y-5">
                    {rest.map((item) => {
                        const saved = savedIds.includes(item.id);
                        return (
                            <article
                                key={item.id}
                                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-black/5 grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-6 items-start hover:shadow-md transition-shadow"
                            >
                                <img
                                    src={item.image_url}
                                    alt={item.image_alt}
                                    loading="lazy"
                                    className="w-full aspect-4/3 object-cover rounded-xl bg-[#C0E0CA]"
                                />
                                <div className="space-y-2.5">
                                    <p className="text-xs sm:text-sm text-neutral-500 font-semibold">
                                        <span className="text-[#B3261E] font-extrabold uppercase tracking-wider">
                                            {item.category}
                                        </span>{' '}
                                        · {item.source_name} ·{' '}
                                        <time dateTime={item.published_at}>
                                            {formatRelativeTime(item.published_at)}
                                        </time>
                                    </p>
                                    <h3 className="text-xl font-extrabold text-[#003200] leading-snug">
                                        {item.title}
                                    </h3>
                                    <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                                        {item.summary}
                                    </p>
                                    <div className="flex flex-wrap gap-2.5 pt-2">
                                        <a
                                            href={item.external_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 h-10 rounded-xl border-2 border-[#003200] text-[#003200] font-bold text-sm hover:bg-[#EAF5EE]"
                                        >
                                            <ExternalLink className="w-4 h-4" aria-hidden="true" />
                                            <span>Ler na fonte</span>
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => toggleSave(item.id)}
                                            aria-pressed={saved}
                                            className={`inline-flex items-center gap-2 px-4 h-10 rounded-xl border-2 font-bold text-sm transition-colors cursor-pointer ${
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
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </MainLayout>
    );
}
