import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, Compass, HeartHandshake, Newspaper, Sprout } from 'lucide-react';
import OngCarousel from '@/Components/OngCarousel';
import MainLayout from '@/Layouts/MainLayout';
import { formatDateBR } from '@/lib/format';
import type { BlogPost, Ong } from '@/types';

interface HomeProps {
    featuredOngs: Ong[];
    latestPosts: BlogPost[];
    metrics: {
        ongsCount: number;
        postsCount: number;
        journalCount: number;
    };
}

const PILLARS = [
    {
        icon: Sprout,
        title: 'Prosperidade',
        description:
            'Com a sua ajuda, podemos transformar o presente e dar à Terra um novo começo.',
    },
    {
        icon: Compass,
        title: 'Visão',
        description:
            'Acreditamos que mesmo a menor luz pode iluminar o caminho para um novo amanhã.',
    },
    {
        icon: HeartHandshake,
        title: 'União',
        description:
            'Junte-se à nossa causa! Unidos, podemos mudar o mundo e garantir um futuro melhor para as próximas gerações.',
    },
];

export default function Home({ featuredOngs, latestPosts, metrics }: HomeProps) {
    return (
        <MainLayout>
            <Head title="Início" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-16">
                {/* Hero */}
                <section
                    className="relative overflow-hidden rounded-3xl min-h-[420px] flex items-end p-7 sm:p-12 text-white shadow-xl"
                    style={{
                        backgroundImage: `
                            radial-gradient(ellipse 60% 55% at 100% 100%, rgba(179, 38, 30, 0.55), transparent 70%),
                            linear-gradient(90deg, rgba(0, 50, 0, 0.94) 0%, rgba(0, 50, 0, 0.68) 55%, rgba(0, 50, 0, 0.28) 100%),
                            url('https://images.unsplash.com/photo-1628262081428-037ac495fcb2?auto=format&fit=crop&w=1800&q=75')
                        `,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="max-w-xl space-y-5 relative z-10">
                        <div className="inline-flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/15 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/20">
                            <span>{metrics.ongsCount} ONGs ativas</span>
                            <span aria-hidden="true">·</span>
                            <span>{metrics.postsCount} artigos no blog</span>
                            <span aria-hidden="true">·</span>
                            <span>{metrics.journalCount} notícias no jornal</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white">
                            Juntos pelo planeta
                        </h1>

                        <p className="text-lg text-white/90 leading-relaxed">
                            Informe-se sobre a crise climática, conheça ONGs perto de você e coloque
                            a mão na obra pelo futuro.
                        </p>

                        <div className="flex flex-wrap gap-3 pt-1">
                            <Link
                                href="/cadastro"
                                className="inline-flex items-center gap-2 px-6 h-12 rounded-xl bg-white text-[#003200] font-extrabold text-sm hover:bg-[#C0E0CA] transition-colors shadow-md"
                            >
                                <span>Junte-se</span>
                                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </Link>
                            <Link
                                href="/ongs"
                                className="inline-flex items-center gap-2 px-6 h-12 rounded-xl bg-white/15 backdrop-blur-xs text-white border border-white/30 font-bold text-sm hover:bg-white/25 transition-colors"
                            >
                                Explorar ONGs
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Três Pilares */}
                <section className="space-y-8">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                        <h2 className="text-3xl font-extrabold text-[#003200]">
                            Nossos Três Pilares
                        </h2>
                        <p className="text-neutral-600">
                            Princípios que guiam cada conexão entre pessoas e iniciativas ambientais.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {PILLARS.map((pillar) => {
                            const Icon = pillar.icon;
                            return (
                                <article
                                    key={pillar.title}
                                    className="bg-white rounded-2xl p-7 shadow-sm border border-black/5 hover:shadow-md transition-shadow space-y-3"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-[#EAF5EE] text-[#003200] grid place-items-center">
                                        <Icon className="w-6 h-6" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-xl font-extrabold text-[#003200]">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-neutral-600 leading-relaxed">
                                        {pillar.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* Narrativa Problema & Solução */}
                <section className="space-y-8">
                    <div className="space-y-3">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003200]">
                            Uma Doença Eterna
                        </h2>
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-black/5 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <img
                                src="https://images.unsplash.com/photo-1536245344390-dbf1df63c30a?auto=format&fit=crop&w=1200&q=75"
                                alt="Silhuetas de árvores em uma floresta coberta pela fumaça de uma queimada"
                                loading="lazy"
                                className="w-full aspect-4/3 object-cover rounded-xl bg-[#C0E0CA]"
                            />
                            <div className="space-y-4 text-neutral-700 leading-relaxed text-base sm:text-lg">
                                <p>
                                    Nosso planeta enfrenta uma destruição que se intensifica há
                                    décadas. Cada dia de negligência nos aproxima de consequências
                                    mais difíceis de reverter.
                                </p>
                                <p>
                                    Florestas são consumidas por queimadas, rios cristalinos ficam
                                    poluídos, as temperaturas sobem e eventos climáticos extremos se
                                    tornam frequentes.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003200]">
                            A Cura Desta Doença
                        </h2>
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-black/5 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4 text-neutral-700 leading-relaxed text-base sm:text-lg order-2 md:order-1">
                                <p>
                                    Toda ferida pode encontrar um caminho para a recuperação. A
                                    Terra está ferida, mas ainda podemos ajudá-la a se recuperar, e
                                    você pode fazer parte dessa transformação.
                                </p>
                                <p>
                                    Pequenas atitudes, multiplicadas por milhares de pessoas,
                                    transformam o mundo. Milhares já fazem parte dessa causa. E você,
                                    por que não pode ser a próxima?
                                </p>
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1598335624134-5bceb5de202d?auto=format&fit=crop&w=1200&q=75"
                                alt="Mulher e criança plantando uma árvore jovem em uma floresta"
                                loading="lazy"
                                className="w-full aspect-4/3 object-cover rounded-xl bg-[#C0E0CA] order-1 md:order-2"
                            />
                        </div>
                    </div>
                </section>

                {/* Carrossel de ONGs */}
                <section className="space-y-6">
                    <div className="max-w-2xl space-y-2">
                        <h2 className="text-3xl font-extrabold text-[#003200]">ONGs em destaque</h2>
                        <p className="text-neutral-600 leading-relaxed">
                            A transformação do planeta não acontece por meio de uma única
                            iniciativa. Por isso, apoiamos ONGs que compartilham do nosso
                            compromisso com a preservação ambiental.
                        </p>
                    </div>

                    <OngCarousel ongs={featuredOngs} />

                    <div className="text-center pt-2">
                        <Link
                            href="/ongs"
                            className="inline-flex items-center gap-2 px-6 h-12 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300] transition-colors shadow-sm"
                        >
                            <span>Conheça todas as ONGs</span>
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                    </div>
                </section>

                {/* Últimos artigos do blog */}
                {latestPosts.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-extrabold text-[#003200]">
                                    Leituras recentes do Blog
                                </h2>
                                <p className="text-neutral-600">
                                    Guias práticos e tutoriais para aplicar sustentabilidade no dia a dia.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href="/jornal"
                                    className="inline-flex items-center gap-2 px-4 h-10 rounded-xl border-2 border-[#003200]/20 bg-white text-[#003200] font-bold text-sm hover:bg-[#EAF5EE]"
                                >
                                    <Newspaper className="w-4 h-4" aria-hidden="true" />
                                    <span>Ver Jornal</span>
                                </Link>
                                <Link
                                    href="/blogs"
                                    className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300]"
                                >
                                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                                    <span>Todos os blogs</span>
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {latestPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 hover:shadow-md transition-shadow flex flex-col"
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
                                        <h3 className="text-lg font-extrabold text-[#003200] line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-xs text-neutral-500">
                                            Por {post.author_name} · {formatDateBR(post.published_at)}
                                        </p>
                                        <p className="text-sm text-neutral-600 line-clamp-3 flex-1">
                                            {post.content}
                                        </p>
                                        <Link
                                            href={`/blogs/${post.slug}`}
                                            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#2C8554] hover:text-[#003200] pt-1"
                                        >
                                            <span>Ler artigo</span>
                                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </MainLayout>
    );
}
