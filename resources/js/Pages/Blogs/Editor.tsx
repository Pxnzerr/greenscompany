import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ImagePlus, X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import type { BlogPost, SharedProps } from '@/types';

interface EditorProps {
    post: BlogPost | null;
    categories: string[];
}

export default function BlogEditor({ post, categories }: EditorProps) {
    const { props } = usePage<SharedProps>();
    const user = props.auth.user!;
    const isEditing = Boolean(post);

    const [previewUrl, setPreviewUrl] = useState<string | null>(
        post?.resolved_cover_url ?? null
    );

    const initialSourcesText = post?.sources
        ? post.sources.map((s) => s.url).join('\n')
        : '';

    const { data, setData, post: submitPost, processing, errors, transform } = useForm<{
        _method?: 'PUT';
        title: string;
        published_at: string;
        category: string;
        cover: File | null;
        remove_cover: boolean;
        sources_text: string;
        content: string;
        status: 'published' | 'draft';
    }>({
        title: post?.title ?? '',
        published_at: post?.published_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
        category: post?.category ?? categories[0] ?? 'Dicas práticas',
        cover: null,
        remove_cover: false,
        sources_text: initialSourcesText,
        content: post?.content ?? '',
        status: post?.status ?? 'published',
    });

    const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData((prev) => ({ ...prev, cover: file, remove_cover: false }));
        setPreviewUrl(URL.createObjectURL(file));
    };

    const removeCover = () => {
        setData((prev) => ({ ...prev, cover: null, remove_cover: true }));
        setPreviewUrl(null);
    };

    const submitWithStatus = (status: 'published' | 'draft') => {
        transform((current) => ({
            ...current,
            status,
            ...(isEditing ? { _method: 'PUT' as const } : {}),
        }));

        submitPost(isEditing && post ? `/blogs/${post.slug}` : '/blogs', {
            forceFormData: true,
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        submitWithStatus('published');
    };

    return (
        <MainLayout>
            <Head title={isEditing ? 'Editar artigo' : 'Novo artigo'} />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-black/5 space-y-6"
                >
                    <h1 className="text-3xl font-extrabold text-[#003200]">
                        {isEditing
                            ? post?.status === 'draft'
                                ? 'Editar rascunho'
                                : 'Editar artigo'
                            : 'Novo artigo'}
                    </h1>

                    <div className="space-y-1.5">
                        <label htmlFor="p-title" className="block text-sm font-bold text-[#003200]">
                            Título do artigo
                        </label>
                        <input
                            id="p-title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className={`w-full h-11 px-4 rounded-xl border-2 bg-white ${
                                errors.title ? 'border-[#B3261E]' : 'border-[#868c88]'
                            }`}
                        />
                        {errors.title && (
                            <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="p-author" className="block text-sm font-bold text-[#003200]">
                                Autor
                            </label>
                            <input
                                id="p-author"
                                type="text"
                                readOnly
                                value={user.username}
                                className="w-full h-11 px-4 rounded-xl border-2 border-[#868c88]/50 bg-[#EAF5EE] text-neutral-700 cursor-not-allowed"
                            />
                            <p className="text-xs text-neutral-500">
                                Exibido automaticamente a partir do seu perfil.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="p-date" className="block text-sm font-bold text-[#003200]">
                                Data de publicação
                            </label>
                            <input
                                id="p-date"
                                type="date"
                                value={data.published_at}
                                onChange={(e) => setData('published_at', e.target.value)}
                                className="w-full h-11 px-4 rounded-xl border-2 border-[#868c88] bg-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="p-category" className="block text-sm font-bold text-[#003200]">
                            Categoria
                        </label>
                        <select
                            id="p-category"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border-2 border-[#868c88] bg-white"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="p-cover" className="block text-sm font-bold text-[#003200]">
                            Imagem de capa (opcional)
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                            <label
                                htmlFor="p-cover"
                                className="inline-flex items-center gap-2 px-4 h-10 rounded-xl border-2 border-[#003200] text-[#003200] font-bold text-sm hover:bg-[#EAF5EE] cursor-pointer"
                            >
                                <ImagePlus className="w-4 h-4" aria-hidden="true" />
                                <span>Escolher imagem</span>
                            </label>
                            <input
                                id="p-cover"
                                type="file"
                                accept="image/*"
                                onChange={handleCoverChange}
                                className="sr-only"
                            />
                            <span className="text-xs text-neutral-500">
                                Armazenada no servidor (máx. 12 MB).
                            </span>
                        </div>
                        {errors.cover && (
                            <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                {errors.cover}
                            </p>
                        )}
                        {previewUrl && (
                            <div className="relative inline-block mt-2">
                                <img
                                    src={previewUrl}
                                    alt="Prévia da imagem de capa"
                                    className="max-w-xs max-h-48 object-cover rounded-xl border border-black/10"
                                />
                                <button
                                    type="button"
                                    onClick={removeCover}
                                    aria-label="Remover imagem de capa"
                                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#B3261E] text-white grid place-items-center shadow-md cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="p-sources" className="block text-sm font-bold text-[#003200]">
                            Fontes e links de leitura (opcional, um URL por linha)
                        </label>
                        <textarea
                            id="p-sources"
                            rows={3}
                            value={data.sources_text}
                            onChange={(e) => setData('sources_text', e.target.value)}
                            placeholder="https://exemplo.org/artigo"
                            className={`w-full p-3.5 rounded-xl border-2 bg-white ${
                                errors.sources_text ? 'border-[#B3261E]' : 'border-[#868c88]'
                            }`}
                        />
                        {errors.sources_text && (
                            <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                {errors.sources_text}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="p-content" className="block text-sm font-bold text-[#003200]">
                            Texto do artigo
                        </label>
                        <textarea
                            id="p-content"
                            rows={8}
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className={`w-full p-4 rounded-xl border-2 bg-white leading-relaxed ${
                                errors.content ? 'border-[#B3261E]' : 'border-[#868c88]'
                            }`}
                        />
                        {errors.content && (
                            <p className="text-xs font-bold text-[#B3261E]" role="alert">
                                {errors.content}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 h-11 rounded-xl bg-[#003200] text-white font-bold text-sm hover:bg-[#002300] disabled:opacity-60 cursor-pointer"
                        >
                            {isEditing && post?.status === 'published'
                                ? 'Salvar alterações'
                                : 'Publicar artigo'}
                        </button>
                        <button
                            type="button"
                            disabled={processing}
                            onClick={() => submitWithStatus('draft')}
                            className="px-5 h-11 rounded-xl border-2 border-[#003200] text-[#003200] font-bold text-sm hover:bg-[#EAF5EE] disabled:opacity-60 cursor-pointer"
                        >
                            Salvar rascunho
                        </button>
                        <Link
                            href="/blogs"
                            className="inline-flex items-center px-5 h-11 rounded-xl border-2 border-black/15 text-neutral-700 font-bold text-sm hover:bg-neutral-50"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
