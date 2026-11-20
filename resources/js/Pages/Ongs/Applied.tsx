import { Head, Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import type { Ong } from '@/types';

interface AppliedProps {
    ong: Ong;
}

export default function OngApplied({ ong }: AppliedProps) {
    return (
        <MainLayout>
            <Head title="Solicitação enviada" />

            <div className="max-w-lg mx-auto px-4 sm:px-6 pt-12">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 text-center space-y-5">
                    <div
                        role="status"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EBFAEA] text-[#1F4F21] font-bold text-sm border border-[#92C491]"
                    >
                        <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                        <span>Solicitação enviada para {ong.name}.</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003200]">
                        Sua solicitação foi recebida com sucesso!
                    </h1>

                    <p className="text-neutral-600 leading-relaxed">
                        Agora é só aguardar. Nossa equipe analisará seu pedido e você acompanhará o
                        andamento pelo seu perfil e e-mail.
                    </p>

                    <p className="text-neutral-600 leading-relaxed">
                        Obrigado por querer fazer parte dessa transformação! Juntos, podemos
                        construir um futuro mais verde para todos.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                        <Link
                            href="/perfil"
                            className="inline-flex items-center justify-center px-6 h-11 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300]"
                        >
                            Ver meu perfil
                        </Link>
                        <Link
                            href="/ongs"
                            className="inline-flex items-center justify-center px-6 h-11 rounded-xl border-2 border-[#003200] text-[#003200] font-bold text-sm hover:bg-[#EAF5EE]"
                        >
                            Voltar às ONGs
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
