export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar_url: string | null;
    cep: string | null;
    street: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
}

export interface OngStat {
    value: string;
    label: string;
}

export interface OngTestimonial {
    quote: string;
    author: string;
}

export interface Ong {
    id: number;
    slug: string;
    name: string;
    initials: string;
    cause: string;
    cause_label: string;
    mission: string;
    vision: string;
    stats: OngStat[];
    testimonial: OngTestimonial | null;
    location: string;
    distance: string | null;
    website_url: string | null;
    image_url: string;
    image_alt: string;
    featured: boolean;
}

export interface OngApplication {
    id: number;
    user_id: number;
    ong_id: number;
    status: 'pending' | 'approved' | 'rejected';
    availability: string | null;
    message: string | null;
    created_at: string;
    ong?: Ong;
}

export interface BlogSource {
    title: string;
    url: string;
}

export interface BlogPost {
    id: number;
    user_id: number | null;
    author_name: string;
    title: string;
    slug: string;
    category: 'Dicas práticas' | 'Notícias' | 'Tutoriais';
    content: string;
    cover_path: string | null;
    cover_url: string | null;
    resolved_cover_url: string | null;
    cover_alt: string | null;
    sources: BlogSource[] | null;
    status: 'draft' | 'published';
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface JournalArticle {
    id: number;
    title: string;
    source_name: string;
    summary: string;
    external_url: string;
    category: string;
    image_url: string;
    image_alt: string;
    published_at: string;
}

export interface FlashMessages {
    success?: string | null;
    error?: string | null;
    info?: string | null;
    dev_reset_code?: string | null;
}

export interface SharedProps {
    auth: {
        user: User | null;
    };
    flash: FlashMessages;
    [key: string]: unknown;
}
