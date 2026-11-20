import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MapPin, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Ong } from '@/types';

interface OngCarouselProps {
    ongs: Ong[];
}

export default function OngCarousel({ ongs }: OngCarouselProps) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        if (ongs.length <= 1 || paused || hovered) return;

        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (media.matches) return;

        const timer = window.setInterval(() => {
            setIndex((prev) => (prev + 1) % ongs.length);
        }, 6500);

        return () => window.clearInterval(timer);
    }, [ongs.length, paused, hovered]);

    if (!ongs.length) return null;

    const current = ongs[index];
    const go = (nextIdx: number) => setIndex((nextIdx + ongs.length) % ongs.length);

    return (
        <div
            role="region"
            aria-roledescription="carrossel"
            aria-label="ONGs em destaque"
            tabIndex={0}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    go(index + 1);
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    go(index - 1);
                }
            }}
            className="bg-white border border-black/10 rounded-3xl overflow-hidden shadow-[0_18px_50px_rgba(0,38,14,0.10)] outline-none"
        >
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[400px]">
                <div className="relative md:col-span-6 min-h-[260px] md:min-h-[400px] bg-gradient-to-br from-[#003200] to-[#2C8554] overflow-hidden">
                    <img
                        src={current.image_url}
                        alt={current.image_alt}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-white font-bold text-sm drop-shadow">
                        <span>{current.name}</span>
                        <span className="font-mono bg-black/35 px-2.5 py-1 rounded-full backdrop-blur-xs">
                            {String(index + 1).padStart(2, '0')} / {String(ongs.length).padStart(2, '0')}
                        </span>
                    </div>
                </div>

                <div className="md:col-span-6 p-6 sm:p-10 flex flex-col justify-center gap-5">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="px-3 py-1 rounded-full bg-[#C0E0CA] text-[#003200] text-xs font-extrabold uppercase tracking-wider">
                            ONG em destaque
                        </span>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#2C8554]">
                            {current.cause_label}
                        </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#003200] leading-tight">
                        {current.name}
                    </h3>

                    <p className="text-neutral-600 text-base leading-relaxed">{current.mission}</p>

                    {current.stats?.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                            {current.stats.slice(0, 2).map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="bg-[#EAF5EE] px-4 py-2.5 rounded-xl max-w-[210px]"
                                >
                                    <span className="block text-lg font-extrabold text-[#003200]">
                                        {stat.value}
                                    </span>
                                    <span className="text-xs text-neutral-600 leading-snug block">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <p className="flex items-center gap-2 text-sm text-neutral-600">
                        <MapPin className="w-4 h-4 text-[#2C8554] shrink-0" aria-hidden="true" />
                        <span>{current.location}</span>
                    </p>

                    <div>
                        <Link
                            href={`/ongs/${current.slug}`}
                            className="inline-flex items-center justify-center px-5 h-11 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300] transition-colors"
                        >
                            Conheça o trabalho
                        </Link>
                    </div>
                </div>
            </div>

            <p className="sr-only" aria-live="polite" aria-atomic="true">
                ONG {index + 1} de {ongs.length}: {current.name}
            </p>

            <div className="px-4 py-3.5 border-t border-black/10 bg-gradient-to-b from-white to-[#EAF5EE] flex items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={() => go(index - 1)}
                    aria-label="ONG anterior"
                    className="w-10 h-10 rounded-full border border-black/15 bg-white text-[#003200] grid place-items-center hover:bg-[#EAF5EE] hover:border-[#2C8554] transition"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2" role="group" aria-label="Escolher ONG em destaque">
                    {ongs.map((item, idx) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setIndex(idx)}
                            aria-label={`Mostrar ${item.name}`}
                            aria-current={idx === index ? 'true' : undefined}
                            className={`h-2.5 rounded-full transition-all ${
                                idx === index ? 'w-7 bg-[#003200]' : 'w-2.5 bg-[#B9C9BE] hover:bg-[#7D9D7A]'
                            }`}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => go(index + 1)}
                    aria-label="Próxima ONG"
                    className="w-10 h-10 rounded-full border border-black/15 bg-white text-[#003200] grid place-items-center hover:bg-[#EAF5EE] hover:border-[#2C8554] transition"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                <button
                    type="button"
                    onClick={() => setPaused((p) => !p)}
                    aria-label={paused ? 'Retomar troca automática' : 'Pausar troca automática'}
                    className="w-10 h-10 rounded-full border border-black/15 bg-white text-[#003200] grid place-items-center hover:bg-[#EAF5EE] hover:border-[#2C8554] transition"
                >
                    {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}
