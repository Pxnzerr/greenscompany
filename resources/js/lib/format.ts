export function formatDateBR(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    const datePart = dateStr.slice(0, 10);
    const parts = datePart.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function formatRelativeTime(isoDate: string): string {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.max(1, Math.round(diffMs / 60000));
    if (minutes < 60) return `há ${minutes} min`;
    if (minutes < 1440) return `há ${Math.round(minutes / 60)} h`;
    return `há ${Math.round(minutes / 1440)} d`;
}

export const BRAZILIAN_STATES = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

export const CAUSE_THEMES: Record<
    string,
    { image: string; accent: string; pageBg: string; description: string }
> = {
    Todas: {
        image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1400&q=75',
        accent: '#2C8554',
        pageBg: '#EAF5EE',
        description: 'Escolha uma causa e conheça quem já está agindo pelo planeta.',
    },
    Reflorestamento: {
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1400&q=75',
        accent: '#4C8B3F',
        pageBg: '#EDF5EA',
        description: 'Recuperar florestas é devolver vida, água e clima estável.',
    },
    'Água e vida marinha': {
        image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=1400&q=75',
        accent: '#1E78B4',
        pageBg: '#EBF4F9',
        description: 'Rios e oceanos limpos protegem espécies e comunidades inteiras.',
    },
    Tecnologia: {
        image: 'https://images.unsplash.com/photo-1451847251646-8a6c0dd1510c?auto=format&fit=crop&w=1400&q=75',
        accent: '#3F7D6B',
        pageBg: '#EAF4F2',
        description: 'Inovação a serviço da proteção ambiental.',
    },
    Biodiversidade: {
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1400&q=75',
        accent: '#477A43',
        pageBg: '#ECF5EB',
        description: 'Proteger a biodiversidade é cuidar das espécies, dos territórios e das comunidades.',
    },
};
