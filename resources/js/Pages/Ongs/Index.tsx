import { Head, Link, router } from '@inertiajs/react';
import { Info, MapPin, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { CAUSE_THEMES } from '@/lib/format';
import type { Ong } from '@/types';

interface OngsIndexProps {
    ongs: Ong[];
    causes: string[];
    filters: {
        cause: string;
        q: string;
    };
}

export default function OngsIndex({ ongs, causes, filters }: OngsIndexProps) {
    const [search, setSearch] = useState(filters.q);
    const isFirstRender = useRef(true);

    const theme = CAUSE_THEMES[filters.cause] ?? CAUSE_THEMES.Todas;

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = window.setTimeout(() => {
            router.get(
                '/ongs',
                {
                    cause: filters.cause !== 'Todas' ? filters.cause : undefined,
                    q: search.trim() || undefined,
                },
                { preserveState: true, replace: true }
            );
        }, 250);

        return () => window.clearTimeout(timer);
    }, [search]);

    const selectCause = (cause: string) => {
        router.get(
            '/ongs',
            {
                cause: cause !== 'Todas' ? cause : undefined,
                q: search.trim() || undefined,
            },
            { preserveState: true }
        );
    };

    return (
        <MainLayout pageBg={theme.pageBg}>
            <Head title="Nossas ONGs" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
                {/* Banner dinâmico da causa */}
                <section
                    role="region"
                    aria-label="Causa selecionada"
                    className="relative overflow-hidden rounded-3xl min-h-[210px] p-7 sm:p-10 flex items-end text-white shadow-lg"
                    style={{
                        backgroundImage: `linear-gradient(90deg, rgba(0, 20, 0, 0.85), rgba(0, 20, 0, 0.30)), url('${theme.image}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="space-y-2 max-w-2xl">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-extrabold uppercase tracking-wider">
                            Causa
                        </span>
                        <h2 className="text-3xl font-extrabold text-white">{filters.cause}</h2>
                        <p className="text-white/90">{theme.description}</p>
                    </div>
                </section>

                {/* Cabeçalho + Busca + Filtros */}
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#003200]">
                        Nossas ONGs
                    </h1>
                    <p className="text-neutral-600">
                        Um espaço para você se juntar a uma equipe e colocar a mão na obra.
                    </p>

                    <div className="relative max-w-lg mx-auto">
                        <Search
                            className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                            aria-hidden="true"
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar ONG, causa ou cidade"
                            aria-label="Buscar ONG, causa ou cidade"
                            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-[#868c88] bg-white text-neutral-900 focus:border-[#003200] shadow-xs"
                        />
                    </div>
                </div>

                <div
                    className="flex flex-wrap items-center justify-center gap-2.5"
                    role="group"
                    aria-label="Filtrar ONGs por causa"
                >
                    {causes.map((c) => {
                        const active = c === filters.cause;
                        return (
                            <button
                                key={c}
                                type="button"
                                aria-pressed={active}
                                onClick={() => selectCause(c)}
                                className={`h-11 px-5 rounded-full text-sm font-bold border-2 transition-colors cursor-pointer ${
                                    active
                                        ? 'bg-[#003200] border-[#003200] text-white shadow-xs'
                                        : 'bg-white border-[#C0E0CA] text-[#003200] hover:bg-[#C0E0CA]/50'
                                }`}
                            >
                                {c}
                            </button>
                        );
                    })}
                </div>

                <p className="text-center text-sm font-semibold text-neutral-600" role="status">
                    {ongs.length > 0
                        ? `${ongs.length} ${ongs.length === 1 ? 'ONG encontrada' : 'ONGs encontradas'}`
                        : ''}
                </p>

                {/* Lista */}
                {ongs.length === 0 ? (
                    <div className="max-w-xl mx-auto flex items-center gap-3 p-4 rounded-xl bg-[#C0E0CA]/60 border-l-4 border-[#2C8554] text-[#003200] font-semibold">
                        <Info className="w-5 h-5 shrink-0" aria-hidden="true" />
                        <span>
                            Nenhuma ONG encontrada. Tente outro nome, causa ou cidade.
                        </span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                        {ongs.map((ong) => (
                            <article
                                key={ong.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 hover:shadow-lg transition-shadow flex flex-col"
                            >
                                <img
                                    src={ong.image_url}
                                    alt={ong.image_alt}
                                    loading="lazy"
                                    className="w-full h-40 object-cover bg-[#C0E0CA]"
                                />
                                <div className="p-6 flex-1 flex flex-col gap-4">
                                    <div className="flex items-start gap-3.5">
                                        <span
                                            aria-hidden="true"
                                            className="w-12 h-12 rounded-full bg-[#003200] text-white font-extrabold text-sm grid place-items-center shrink-0"
                                        >
                                            {ong.initials}
                                        </span>
                                        <div className="space-y-1 min-w-0">
                                            <h3 className="text-lg font-extrabold text-[#003200] leading-snug line-clamp-2">
                                                {ong.name}
                                            </h3>
                                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EAF5EE] text-[#1F4F21] text-xs font-extrabold">
                                                {ong.cause_label}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                                        {ong.mission}
                                    </p>

                                    {ong.stats?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {ong.stats.map((st, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-[#EAF5EE] rounded-xl px-3 py-2 text-xs flex-1 min-w-[120px]"
                                                >
                                                    <b className="block text-base font-extrabold text-[#003200]">
                                                        {st.value}
                                                    </b>
                                                    <span className="text-neutral-600">
                                                        {st.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-xs text-neutral-600 mt-auto pt-1">
                                        <MapPin
                                            className="w-4 h-4 text-[#2C8554] shrink-0"
                                            aria-hidden="true"
                                        />
                                        <span className="line-clamp-2">
                                            {[ong.distance, ong.location].filter(Boolean).join(' · ')}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/ongs/${ong.slug}`}
                                        className="w-full h-11 rounded-xl bg-[#003200] text-white font-bold text-sm grid place-items-center hover:bg-[#002300] transition-colors"
                                    >
                                        Conhecer e ajudar
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
