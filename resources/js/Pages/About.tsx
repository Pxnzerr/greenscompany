import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

interface TeamMember {
    initials: string;
    name: string;
    role: string;
}

interface AboutProps {
    team: TeamMember[];
}

export default function About({ team }: AboutProps) {
    return (
        <MainLayout>
            <Head title="Quem Somos" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-14">
                <section
                    className="relative overflow-hidden rounded-3xl min-h-[340px] flex items-end p-7 sm:p-12 text-white shadow-xl"
                    style={{
                        backgroundImage: `
                            linear-gradient(90deg, rgba(0, 50, 0, 0.92) 0%, rgba(0, 50, 0, 0.55) 60%, rgba(0, 50, 0, 0.25) 100%),
                            url('https://images.unsplash.com/photo-1628262081428-037ac495fcb2?auto=format&fit=crop&w=1800&q=75')
                        `,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="max-w-xl space-y-4">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
                            GREEN’S Company
                        </h1>
                        <p className="text-lg text-white/90">
                            Conectando Pessoas para Transformar o Planeta
                        </p>
                        <Link
                            href="/ongs"
                            className="inline-flex items-center gap-2 px-6 h-11 rounded-xl bg-white text-[#003200] font-extrabold text-sm hover:bg-[#C0E0CA] transition-colors"
                        >
                            <span>Conhecer as ONGs</span>
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-3xl font-extrabold text-[#003200]">Sobre a startup</h2>
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-black/5 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4 text-neutral-700 leading-relaxed text-base sm:text-lg">
                            <p>
                                A Green’s Company é uma startup focada na causa ambiental. Nosso
                                objetivo é informar a sociedade sobre as causas e os impactos do
                                aquecimento global acelerado.
                            </p>
                            <p>
                                Queremos mostrar como pequenas atitudes diárias geram grandes
                                transformações. Para combater a sobrecarga de informação, usamos
                                conteúdos rápidos e acessíveis em cartões visuais.
                            </p>
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1589519160732-57fc498494f8?auto=format&fit=crop&w=1200&q=75"
                            alt="Mãos segurando um globo terrestre, símbolo do cuidado com o planeta"
                            loading="lazy"
                            className="w-full aspect-4/3 object-cover rounded-xl bg-[#C0E0CA]"
                        />
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-3xl font-extrabold text-[#003200]">
                        Nossa missão e ação
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <article className="bg-white rounded-2xl p-7 shadow-sm border border-black/5 space-y-3">
                            <span className="inline-block px-3 py-1 rounded-full bg-[#C0E0CA] text-[#003200] text-xs font-extrabold">
                                Apoio público
                            </span>
                            <h3 className="text-xl font-extrabold text-[#003200]">
                                Dar visibilidade a quem cuida do planeta
                            </h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Facilitar o acesso e o apoio público a grupos beneficentes e ONGs
                                de preservação ambiental.
                            </p>
                        </article>

                        <article className="bg-white rounded-2xl p-7 shadow-sm border border-black/5 space-y-3">
                            <span className="inline-block px-3 py-1 rounded-full bg-[#EBFAEA] text-[#1F4F21] text-xs font-extrabold">
                                Ação
                            </span>
                            <h3 className="text-xl font-extrabold text-[#003200]">Criar pontes</h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Conectar pessoas interessadas em ajudar a equipes de reflorestamento,
                                em ações práticas no campo, como o plantio de árvores, ou em apoios
                                digitais.
                            </p>
                        </article>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-extrabold text-[#003200]">Equipe de criadores</h2>
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"
                        role="list"
                        aria-label="Integrantes da equipe de criadores"
                    >
                        {team.map((member) => (
                            <article
                                key={member.name}
                                role="listitem"
                                className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 text-center space-y-3 hover:shadow-md transition-shadow"
                            >
                                <span
                                    aria-hidden="true"
                                    className="w-16 h-16 mx-auto rounded-full bg-[#003200] text-white font-extrabold text-xl grid place-items-center"
                                >
                                    {member.initials}
                                </span>
                                <h3 className="text-base font-extrabold text-[#003200]">
                                    {member.name}
                                </h3>
                                <p className="text-xs text-neutral-500 font-semibold">{member.role}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
