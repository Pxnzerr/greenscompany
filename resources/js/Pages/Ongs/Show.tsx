import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, ExternalLink, MapPin } from 'lucide-react';
import { FormEvent, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { CAUSE_THEMES } from '@/lib/format';
import type { Ong, OngApplication, SharedProps } from '@/types';

interface OngShowProps {
    ong: Ong;
    application: OngApplication | null;
}

export default function OngShow({ ong, application }: OngShowProps) {
    const { props } = usePage<SharedProps>();
    const user = props.auth.user;
    const theme = CAUSE_THEMES[ong.cause] ?? CAUSE_THEMES.Todas;
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        availability: 'Finais de semana',
        message: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/ongs/${ong.slug}/ajudar`);
    };

    return (
        <MainLayout pageBg={theme.pageBg}>
            <Head title={ong.name} />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
                <Link
                    href="/ongs"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#003200] hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Voltar às ONGs</span>
                </Link>

                <div
                    className="relative overflow-hidden rounded-3xl min-h-[220px] p-7 sm:p-9 flex items-end gap-5 text-white shadow-lg"
                    style={{
                        backgroundImage: `linear-gradient(90deg, rgba(0, 20, 0, 0.88), rgba(0, 20, 0, 0.35)), url('${ong.image_url}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <span
                        aria-hidden="true"
                        className="w-16 h-16 rounded-full bg-white text-[#003200] font-extrabold text-xl grid place-items-center shrink-0 shadow-md"
                    >
                        {ong.initials}
                    </span>
                    <div className="space-y-1.5">
                        <span className="inline-block px-3 py-0.5 rounded-full bg-white/20 text-xs font-extrabold">
                            {ong.cause_label}
                        </span>
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                            {ong.name}
                        </h1>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 space-y-6">
                    <div className="space-y-1.5">
                        <h2 className="text-xl font-extrabold text-[#003200]">Missão</h2>
                        <p className="text-neutral-700 leading-relaxed">{ong.mission}</p>
                    </div>

                    <div className="space-y-1.5">
                        <h2 className="text-xl font-extrabold text-[#003200]">Visão</h2>
                        <p className="text-neutral-700 leading-relaxed">{ong.vision}</p>
                    </div>

                    {ong.stats?.length > 0 && (
                        <div className="space-y-2.5">
                            <h2 className="text-xl font-extrabold text-[#003200]">Impacto</h2>
                            <div className="flex flex-wrap gap-3">
                                {ong.stats.map((st, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-[#EAF5EE] rounded-xl px-4 py-3 min-w-[160px]"
                                    >
                                        <b className="block text-xl font-extrabold text-[#003200]">
                                            {st.value}
                                        </b>
                                        <span className="text-sm text-neutral-600">{st.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {ong.testimonial && (
                        <blockquote className="border-l-4 border-[#2C8554] pl-5 py-1 space-y-1 bg-[#EAF5EE]/50 rounded-r-xl pr-4">
                            <p className="text-neutral-800 italic">{ong.testimonial.quote}</p>
                            <footer className="text-xs font-bold text-neutral-500">
                                — {ong.testimonial.author}
                            </footer>
                        </blockquote>
                    )}

                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <MapPin className="w-4 h-4 text-[#2C8554] shrink-0" aria-hidden="true" />
                        <span>{[ong.distance, ong.location].filter(Boolean).join(' · ')}</span>
                    </div>

                    <div className="pt-2 border-t border-black/10 space-y-4">
                        <div className="flex flex-wrap gap-3">
                            {ong.website_url && (
                                <a
                                    href={ong.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 h-11 rounded-xl border-2 border-[#003200] text-[#003200] font-bold text-sm hover:bg-[#EAF5EE]"
                                >
                                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                                    <span>Visite o site oficial</span>
                                </a>
                            )}

                            {application ? (
                                <div className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-[#EBFAEA] text-[#1F4F21] font-bold text-sm border border-[#92C491]">
                                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                                    <span>Solicitação enviada (Em análise)</span>
                                </div>
                            ) : user ? (
                                <button
                                    type="button"
                                    onClick={() => setShowForm((s) => !s)}
                                    className="inline-flex items-center justify-center px-6 h-11 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300] cursor-pointer"
                                >
                                    Quero Ajudar
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center px-6 h-11 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300]"
                                >
                                    Entre para se candidatar
                                </Link>
                            )}
                        </div>

                        {showForm && !application && user && (
                            <form
                                onSubmit={handleSubmit}
                                className="bg-[#EAF5EE] rounded-2xl p-5 space-y-4 border border-[#C0E0CA]"
                            >
                                <h3 className="text-lg font-extrabold text-[#003200]">
                                    Enviar interesse de voluntariado
                                </h3>

                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="availability"
                                        className="block text-sm font-bold text-[#003200]"
                                    >
                                        Disponibilidade
                                    </label>
                                    <select
                                        id="availability"
                                        value={data.availability}
                                        onChange={(e) => setData('availability', e.target.value)}
                                        className="w-full h-11 px-3 rounded-xl border-2 border-[#868c88] bg-white"
                                    >
                                        <option value="Finais de semana">Finais de semana</option>
                                        <option value="Dias úteis">Dias úteis</option>
                                        <option value="Apoio remoto / digital">
                                            Apoio remoto / digital
                                        </option>
                                        <option value="Eventos pontuais">Eventos pontuais</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-bold text-[#003200]"
                                    >
                                        Mensagem para a equipe (opcional)
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={3}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Conte brevemente como gostaria de contribuir..."
                                        className="w-full p-3 rounded-xl border-2 border-[#868c88] bg-white"
                                    />
                                    {errors.message && (
                                        <p className="text-xs font-bold text-[#B3261E]">
                                            {errors.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 h-11 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300] disabled:opacity-60 cursor-pointer"
                                    >
                                        {processing ? 'Enviando...' : 'Confirmar solicitação'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-5 h-11 rounded-xl border-2 border-[#003200]/20 bg-white text-[#003200] font-bold text-sm hover:bg-neutral-50 cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
