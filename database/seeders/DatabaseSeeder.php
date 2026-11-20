<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\JournalArticle;
use App\Models\Ong;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $demoUser = User::updateOrCreate(
            ['email' => 'demo@greens.com'],
            [
                'name' => 'Demo Green’s',
                'username' => 'demo',
                'password' => Hash::make('123456'),
                'cep' => '30130-010',
                'street' => 'Praça Sete de Setembro',
                'neighborhood' => 'Centro',
                'city' => 'Belo Horizonte',
                'state' => 'MG',
            ]
        );

        $ongs = [
            [
                'slug' => 'blue',
                'name' => 'Blue Company',
                'initials' => 'BC',
                'cause' => 'Água e vida marinha',
                'cause_label' => 'Rios e oceanos',
                'mission' => 'Limpar rios, oceanos e praias para devolvê-los à população e à natureza.',
                'vision' => 'Rios saudáveis e acessíveis a todos.',
                'stats' => [
                    ['value' => '12 t', 'label' => 'de lixo retiradas dos rios'],
                    ['value' => '8', 'label' => 'mutirões por ano'],
                ],
                'testimonial' => [
                    'quote' => '“Participar do mutirão mudou o jeito que eu vejo o rio do meu bairro.”',
                    'author' => 'Voluntária',
                ],
                'location' => 'Rua das Peiras, Bairro Fonseca, Contagem',
                'distance' => '30 km',
                'website_url' => null,
                'image_url' => 'https://images.unsplash.com/photo-1623682864217-9fc26b5207e0?auto=format&fit=crop&w=1200&q=75',
                'image_alt' => 'Lixo plástico boiando na superfície da água, cenário de limpeza de rios',
                'featured' => true,
            ],
            [
                'slug' => 'cotemig',
                'name' => 'Cotemig Company',
                'initials' => 'CC',
                'cause' => 'Tecnologia',
                'cause_label' => 'Tecnologia ambiental',
                'mission' => 'Usar tecnologia para apoiar projetos de proteção ambiental em várias áreas.',
                'vision' => 'Tecnologia a serviço da natureza.',
                'stats' => [
                    ['value' => '15', 'label' => 'projetos apoiados'],
                    ['value' => '300', 'label' => 'voluntários'],
                ],
                'testimonial' => [
                    'quote' => '“Aprendi a unir tecnologia e causa ambiental.”',
                    'author' => 'Voluntário',
                ],
                'location' => 'Av. Verde, Centro, Belo Horizonte',
                'distance' => '45 km',
                'website_url' => null,
                'image_url' => 'https://images.unsplash.com/photo-1467579424161-6bbc141569d7?auto=format&fit=crop&w=1200&q=75',
                'image_alt' => 'Moinho de vento cercado por grama, símbolo de energia limpa e tecnologia',
                'featured' => true,
            ],
            [
                'slug' => 'eco',
                'name' => 'Grupo Eco',
                'initials' => 'GE',
                'cause' => 'Reflorestamento',
                'cause_label' => 'Reflorestamento',
                'mission' => 'Apoiar comunidades com soluções sustentáveis para preservar a biodiversidade.',
                'vision' => 'Florestas restauradas e comunidades engajadas.',
                'stats' => [
                    ['value' => '5 mil', 'label' => 'árvores plantadas'],
                    ['value' => '20', 'label' => 'comunidades atendidas'],
                ],
                'testimonial' => [
                    'quote' => '“Plantar a primeira árvore foi só o começo.”',
                    'author' => 'Voluntária',
                ],
                'location' => 'Rua das Maçãs, Bairro Jardim, São Paulo',
                'distance' => '580 km',
                'website_url' => null,
                'image_url' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=75',
                'image_alt' => 'Dois pares de mãos plantando uma pequena muda verde',
                'featured' => true,
            ],
            [
                'slug' => 'sosma',
                'name' => 'SOS Mata Atlântica',
                'initials' => 'SM',
                'cause' => 'Reflorestamento',
                'cause_label' => 'Reflorestamento',
                'mission' => 'Promover a conservação e a recuperação da Mata Atlântica.',
                'vision' => 'Uma Mata Atlântica preservada e restaurada.',
                'stats' => [
                    ['value' => '+42 milhões', 'label' => 'de mudas plantadas'],
                ],
                'testimonial' => null,
                'location' => 'São Paulo (SP)',
                'distance' => null,
                'website_url' => 'https://www.sosma.org.br/',
                'image_url' => 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=75',
                'image_alt' => 'Copas de árvores vistas de baixo para cima em uma floresta',
                'featured' => true,
            ],
            [
                'slug' => 'tamar',
                'name' => 'Projeto Tamar',
                'initials' => 'PT',
                'cause' => 'Água e vida marinha',
                'cause_label' => 'Proteção marinha',
                'mission' => 'Proteger as tartarugas marinhas e os ambientes em que vivem.',
                'vision' => 'Oceanos saudáveis para as tartarugas marinhas.',
                'stats' => [
                    ['value' => '+40 milhões', 'label' => 'de tartarugas salvas'],
                ],
                'testimonial' => null,
                'location' => 'Bahia (BA)',
                'distance' => null,
                'website_url' => 'https://www.tamar.org.br/',
                'image_url' => 'https://images.unsplash.com/photo-1591025207163-942350e47db2?auto=format&fit=crop&w=1200&q=75',
                'image_alt' => 'Tartaruga marinha nadando sobre um recife de coral',
                'featured' => true,
            ],
            [
                'slug' => 'terra',
                'name' => 'Instituto Terra',
                'initials' => 'IT',
                'cause' => 'Reflorestamento',
                'cause_label' => 'Recuperação florestal',
                'mission' => 'Recuperar áreas degradadas e promover a educação ambiental.',
                'vision' => 'Paisagens recuperadas e comunidades conscientes.',
                'stats' => [
                    ['value' => '2.100 ha', 'label' => 'de floresta recuperados'],
                ],
                'testimonial' => null,
                'location' => 'Minas Gerais (MG)',
                'distance' => null,
                'website_url' => 'https://institutoterra.org/',
                'image_url' => 'https://images.unsplash.com/photo-1603446750917-ccfd69742be3?auto=format&fit=crop&w=1200&q=75',
                'image_alt' => 'Solo marrom com plantas verdes brotando, símbolo de área em recuperação',
                'featured' => true,
            ],
            [
                'slug' => 'ipe',
                'name' => 'IPÊ — Instituto de Pesquisas Ecológicas',
                'initials' => 'IPÊ',
                'cause' => 'Biodiversidade',
                'cause_label' => 'Biodiversidade',
                'mission' => 'Atua com pesquisa científica, inovação socioambiental, participação comunitária e educação para a conservação da biodiversidade.',
                'vision' => 'Contribuir para a conservação da biodiversidade brasileira.',
                'stats' => [
                    ['value' => '4 biomas', 'label' => 'Mata Atlântica, Amazônia, Pantanal e Cerrado'],
                    ['value' => 'Atuação', 'label' => 'Pesquisa, educação e inovação socioambiental'],
                ],
                'testimonial' => null,
                'location' => 'Nazaré Paulista (SP)',
                'distance' => null,
                'website_url' => 'https://ipe.org.br/',
                'image_url' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=75',
                'image_alt' => 'Mãos segurando uma pequena muda, representando pesquisa e conservação da biodiversidade',
                'featured' => true,
            ],
            [
                'slug' => 'isa',
                'name' => 'Instituto Socioambiental (ISA)',
                'initials' => 'ISA',
                'cause' => 'Biodiversidade',
                'cause_label' => 'Biodiversidade',
                'mission' => 'Atua ao lado de comunidades indígenas, quilombolas e extrativistas para proteger territórios, fortalecer culturas e apoiar economias sustentáveis.',
                'vision' => 'Defender a diversidade socioambiental brasileira.',
                'stats' => [
                    ['value' => 'Desde 1994', 'label' => 'ao lado de comunidades'],
                    ['value' => 'Atuação', 'label' => 'Vale do Ribeira, Xingu e Rio Negro'],
                ],
                'testimonial' => null,
                'location' => 'São Paulo (SP) e territórios parceiros',
                'distance' => null,
                'website_url' => 'https://www.socioambiental.org/sobre',
                'image_url' => 'https://images.unsplash.com/photo-1633876477607-f6541b2af314?auto=format&fit=crop&w=1200&q=75',
                'image_alt' => 'Paisagem verde cercada por árvores, representando territórios e natureza',
                'featured' => true,
            ],
        ];

        foreach ($ongs as $ong) {
            Ong::updateOrCreate(['slug' => $ong['slug']], $ong);
        }

        $blogs = [
            [
                'title' => '5 atitudes sustentáveis para a sua rotina',
                'author_name' => 'Equipe Green’s',
                'category' => 'Dicas práticas',
                'published_at' => '2026-11-03',
                'cover_url' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=75',
                'cover_alt' => 'Mãos segurando uma pequena muda em meio à terra',
                'sources' => [['title' => 'INPE — Como posso ajudar a reduzir os efeitos das mudanças climáticas?', 'url' => 'https://www.gov.br/inpe/pt-br/acesso-a-informacao/perguntas-frequentes/principais-produtos-e-servicos-do-inpe/monitoramento-do-territorio-mudancas-climaticas/como-posso-ajudar-a-reduzir']],
                'content' => "Pequenas mudanças em casa reduzem o seu impacto: economizar água, separar o lixo reciclável, preferir transporte coletivo, reduzir o desperdício de comida e apoiar o comércio local.\nO importante é começar por uma atitude e manter. Hábitos pequenos, multiplicados por muitas pessoas, geram grandes resultados.",
            ],
            [
                'title' => 'Como escolher uma ONG confiável',
                'author_name' => 'Equipe Green’s',
                'category' => 'Dicas práticas',
                'published_at' => '2026-11-05',
                'cover_url' => 'https://images.unsplash.com/photo-1684775622511-c76e31cd404b?auto=format&fit=crop&w=1200&q=75',
                'cover_alt' => 'Mão segurando uma esfera de vidro diante de um campo verde',
                'sources' => [['title' => 'Ipea — Mapa das Organizações da Sociedade Civil', 'url' => 'https://mapaosc.ipea.gov.br/']],
                'content' => "Antes de doar ou se voluntariar, confira se a ONG divulga sua missão, seus resultados e suas contas de forma clara.\nBusque também relatos de quem já participou e visite os canais oficiais da organização.",
            ],
            [
                'title' => 'O que é reflorestamento, na prática',
                'author_name' => 'Equipe Green’s',
                'category' => 'Tutoriais',
                'published_at' => '2026-11-07',
                'cover_url' => 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=75',
                'cover_alt' => 'Copas de árvores em floresta de reflorestamento',
                'sources' => [['title' => 'Instituto de Botânica de São Paulo — Espécies indicadas para restauração ecológica', 'url' => 'https://www.infraestruturameioambiente.sp.gov.br/institutodebotanica/wp-content/uploads/sites/235/2019/10/lista-especies-rad-2019.pdf']],
                'content' => "Reflorestar é recuperar áreas degradadas com o plantio de espécies nativas, do preparo do solo à manutenção das mudas.\nÉ um trabalho de anos, e a ajuda de voluntários faz muita diferença nas ações de plantio.",
            ],
            [
                'title' => 'Como Pequenas Atitudes no Cotidiano Combatem o Aquecimento Global',
                'author_name' => 'Marcos de Castro',
                'category' => 'Dicas práticas',
                'published_at' => '2026-11-08',
                'cover_url' => 'https://images.unsplash.com/photo-1506316178580-fe3a431d65b5?auto=format&fit=crop&w=1200&q=75',
                'cover_alt' => 'Pessoa caminhando sobre solo seco e rachado',
                'sources' => [['title' => 'IPCC — AR6 WGIII, Chapter 5: Demand, services and social aspects of mitigation', 'url' => 'https://www.ipcc.ch/report/ar6/wg3/chapter/chapter-5/']],
                'content' => "Cada escolha conta: desligar aparelhos sem uso, reduzir o consumo de carne, evitar descartáveis e priorizar produtos locais diminuem as emissões de gases de efeito estufa.\nQuando muita gente muda um pouco, o efeito coletivo é enorme.",
            ],
            [
                'title' => 'O Papel do Reflorestamento Urbano no Clima das Cidades',
                'author_name' => 'Arthur Clark',
                'category' => 'Notícias',
                'published_at' => '2026-11-09',
                'cover_url' => 'https://images.unsplash.com/photo-1648499207805-790f4a65c928?auto=format&fit=crop&w=1200&q=75',
                'cover_alt' => 'Vista aérea de uma estrada cercada por árvores',
                'sources' => [['title' => 'Prefeitura de São Paulo — Manual Técnico de Arborização Urbana', 'url' => 'https://www.prefeitura.sp.gov.br/cidade/secretarias/upload/meio_ambiente/MARBOURB.pdf']],
                'content' => "Árvores nas cidades reduzem o calor, melhoram a qualidade do ar e ajudam a absorver a água da chuva.\nPraças, ruas arborizadas e corredores verdes tornam o clima urbano mais agradável.",
            ],
            [
                'title' => 'Guia do Iniciante para Compostagem Doméstica',
                'author_name' => 'Rafael Correia',
                'category' => 'Tutoriais',
                'published_at' => '2026-11-10',
                'cover_url' => 'https://images.unsplash.com/photo-1641320201668-1b2bedb4a066?auto=format&fit=crop&w=1200&q=75',
                'cover_alt' => 'Mão despejando terra ao redor de uma muda de árvore recém-plantada',
                'sources' => [['title' => 'Ministério do Meio Ambiente — Compostagem doméstica, comunitária e institucional', 'url' => 'https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/saneamento/protegeer/biblioteca/CompostagemDomsticaComunitriaeInstitucionaldeResduosOrgnicosMMA.pdf']],
                'content' => "Compostar é transformar restos de comida em adubo. Use um recipiente com tampa, alterne resíduos úmidos (cascas, borra de café) e secos (folhas, papel picado) e mexa de vez em quando.\nEm algumas semanas você terá um adubo rico para plantas e hortas.",
            ],
            [
                'title' => 'Como Economizar Água em Casa sem Complicar',
                'author_name' => 'Equipe Green’s',
                'category' => 'Dicas práticas',
                'published_at' => '2026-11-11',
                'cover_url' => 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=75',
                'cover_alt' => 'Paisagem verde com água e vegetação',
                'sources' => [
                    ['title' => 'INPE — Como posso ajudar a reduzir os efeitos das mudanças climáticas?', 'url' => 'https://www.gov.br/inpe/pt-br/acesso-a-informacao/perguntas-frequentes/principais-produtos-e-servicos-do-inpe/monitoramento-do-territorio-mudancas-climaticas/como-posso-ajudar-a-reduzir'],
                    ['title' => 'ANA — Usos da água', 'url' => 'https://www.gov.br/ana/pt-br/assuntos/gestao-das-aguas/usos-da-agua'],
                ],
                'content' => "Feche a torneira enquanto escova os dentes e ensaboa a louça. Prefira banhos mais curtos e conserte vazamentos assim que possível.\nNa limpeza e na jardinagem, use apenas a água necessária. Se puder, aproveite água da chuva para regar plantas — sem usar essa água para beber ou cozinhar.\nEscolha uma mudança simples para começar hoje e observe o resultado na sua rotina.",
            ],
            [
                'title' => 'Separação de Resíduos: um Guia Básico para Começar',
                'author_name' => 'Equipe Green’s',
                'category' => 'Tutoriais',
                'published_at' => '2026-11-11',
                'cover_url' => 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=75',
                'cover_alt' => 'Separação consciente de materiais recicláveis',
                'sources' => [['title' => 'AGU — Guia para Implantação da Coleta Seletiva e Cidadã', 'url' => 'https://www.gov.br/agu/pt-br/composicao/secretaria-geral-de-administracao-1/coleta-seletiva-solidaria/guia-para-implantacao-da-coleta-seletiva']],
                'content' => "Comece separando recicláveis limpos e secos dos resíduos orgânicos e rejeitos. Papel, embalagens, vidro e metais podem ter coleta diferente dependendo da cidade; confira as orientações da prefeitura ou da cooperativa local.\nEsvazie as embalagens antes de separar. Não coloque materiais sujos de comida junto dos recicláveis, pois isso pode dificultar o reaproveitamento.\nQuando não houver coleta seletiva perto de você, procure pontos de entrega ou cooperativas da região.",
            ],
            [
                'title' => 'Como Participar de um Plantio de Árvores com Segurança',
                'author_name' => 'Equipe Green’s',
                'category' => 'Tutoriais',
                'published_at' => '2026-11-11',
                'cover_url' => 'https://images.unsplash.com/photo-1598335624134-5bceb5de202d?auto=format&fit=crop&w=1200&q=75',
                'cover_alt' => 'Voluntários plantando mudas em ação comunitária',
                'sources' => [['title' => 'Instituto de Botânica de São Paulo — Espécies indicadas para restauração ecológica', 'url' => 'https://www.infraestruturameioambiente.sp.gov.br/institutodebotanica/wp-content/uploads/sites/235/2019/10/lista-especies-rad-2019.pdf']],
                'content' => "Procure ações organizadas por uma ONG, coletivo ou órgão público e confirme o local, o horário e o que precisa levar. Em plantios de restauração, a escolha das espécies e o cuidado com o solo devem seguir a orientação de quem coordena a atividade.\nUse calçado fechado, roupa confortável, proteção contra o sol e água para se hidratar. Respeite as instruções da equipe e não plante mudas por conta própria em áreas públicas ou naturais sem autorização.\nDepois da ação, acompanhe se o grupo organiza regas e manutenção: cuidar das mudas é tão importante quanto plantá-las.",
            ],
            [
                'title' => 'A biodiversidade também começa perto de casa',
                'author_name' => 'Pablo Daniel',
                'category' => 'Dicas práticas',
                'published_at' => '2026-11-11',
                'cover_url' => 'https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?auto=format&fit=crop&w=1200&q=75',
                'cover_alt' => 'Vista aérea de uma floresta densa e biodiversa',
                'sources' => [
                    ['title' => 'IPÊ — Instituto de Pesquisas Ecológicas', 'url' => 'https://ipe.org.br/'],
                    ['title' => 'ISA — Instituto Socioambiental', 'url' => 'https://www.socioambiental.org/sobre'],
                ],
                'content' => "Uma forma de apoiar a biodiversidade é conhecer melhor as espécies e os territórios da sua região. Projetos de conservação podem combinar pesquisa, educação e participação das comunidades.\nEm vez de soltar animais ou plantar qualquer espécie por conta própria, procure uma iniciativa local e siga a orientação de quem conhece o ambiente. Apoiar um projeto comunitário ou aprender sobre a natureza do seu bairro também é um bom começo.",
            ],
            [
                'title' => 'Restauração florestal é mais do que plantar mudas',
                'author_name' => 'Samuel Macedo',
                'category' => 'Tutoriais',
                'published_at' => '2026-11-11',
                'cover_url' => 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1200&q=75',
                'cover_alt' => 'Árvore verde envolta por neblina na mata',
                'sources' => [['title' => 'Instituto de Botânica de São Paulo — Espécies indicadas para restauração ecológica', 'url' => 'https://www.infraestruturameioambiente.sp.gov.br/institutodebotanica/wp-content/uploads/sites/235/2019/10/lista-especies-rad-2019.pdf']],
                'content' => "Restaurar uma área não é apenas colocar mudas no chão. A escolha das espécies nativas deve considerar o ambiente, e o plantio precisa ser acompanhado por cuidados posteriores.\nAntes de participar, procure uma ação organizada por uma ONG ou equipe técnica, confirme o que será feito e siga as orientações para aquele local. Acompanhar o desenvolvimento das mudas e ajudar na manutenção também faz parte do trabalho de restauração.",
            ],
        ];

        foreach ($blogs as $index => $blog) {
            $slug = Str::slug($blog['title']);
            BlogPost::updateOrCreate(
                ['slug' => $slug],
                [
                    'user_id' => null,
                    'author_name' => $blog['author_name'],
                    'title' => $blog['title'],
                    'slug' => $slug,
                    'category' => $blog['category'],
                    'content' => $blog['content'],
                    'cover_url' => $blog['cover_url'],
                    'cover_alt' => $blog['cover_alt'],
                    'sources' => $blog['sources'],
                    'status' => 'published',
                    'published_at' => $blog['published_at'],
                ]
            );
        }

        $journal = [
            [
                'title' => 'Relatório de Mudanças Climáticas Alerta para Elevação das Temperaturas Globais',
                'source_name' => 'Um Só Planeta',
                'summary' => 'Cientistas reforçam a urgência de reduzir as emissões para conter o aquecimento.',
                'external_url' => 'https://umsoplaneta.globo.com/',
                'category' => 'Clima',
                'image_url' => 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=75',
                'image_alt' => 'Paisagem montanhosa envolta por névoa climática',
                'published_at' => now()->subMinutes(25),
            ],
            [
                'title' => 'Restauração de florestas no Brasil',
                'source_name' => 'The Nature Conservancy Brasil',
                'summary' => 'Conheça a iniciativa que apoia a restauração de áreas degradadas.',
                'external_url' => 'https://www.tnc.org.br/o-que-fazemos/nossas-iniciativas/restaura-brasil/',
                'category' => 'Restauração',
                'image_url' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=75',
                'image_alt' => 'Mãos plantando uma pequena muda verde em solo fértil',
                'published_at' => now()->subMinutes(130),
            ],
            [
                'title' => 'Projetos de Restauração Florestal Avançam no Brasil em 2026',
                'source_name' => 'The Nature Conservancy (TNC)',
                'summary' => 'Iniciativas de restauração ampliam áreas recuperadas em diferentes biomas.',
                'external_url' => 'https://www.tnc.org.br/o-que-fazemos/nossas-iniciativas/restaura-brasil/',
                'category' => 'Restauração',
                'image_url' => 'https://images.unsplash.com/photo-1603446750917-ccfd69742be3?auto=format&fit=crop&w=1000&q=75',
                'image_alt' => 'Mudas nascendo em área de recuperação florestal',
                'published_at' => now()->subMinutes(300),
            ],
            [
                'title' => 'Notícias sobre clima e meio ambiente',
                'source_name' => 'Um Só Planeta (Globo)',
                'summary' => 'Reportagens sobre crise climática, energia e sustentabilidade.',
                'external_url' => 'https://umsoplaneta.globo.com/',
                'category' => 'Clima',
                'image_url' => 'https://images.unsplash.com/photo-1506316178580-fe3a431d65b5?auto=format&fit=crop&w=1000&q=75',
                'image_alt' => 'Solo seco retratando impactos das mudanças climáticas',
                'published_at' => now()->subMinutes(720),
            ],
            [
                'title' => 'Empresas Adotam Metas Neutras em Carbono para os Próximos Anos',
                'source_name' => 'Notícias Ambientais',
                'summary' => 'Cresce o número de empresas com metas de neutralidade de carbono.',
                'external_url' => 'https://noticiasambientais.com.br/',
                'category' => 'Economia verde',
                'image_url' => 'https://images.unsplash.com/photo-1611270418597-a6c77f4b7271?auto=format&fit=crop&w=1000&q=75',
                'image_alt' => 'Chaminé industrial soltando fumaça contra o céu',
                'published_at' => now()->subMinutes(1600),
            ],
            [
                'title' => 'Conservação da natureza no Brasil',
                'source_name' => 'WWF-Brasil',
                'summary' => 'Projetos e notícias sobre biodiversidade e proteção ambiental.',
                'external_url' => 'https://www.wwf.org.br/',
                'category' => 'Biodiversidade',
                'image_url' => 'https://images.unsplash.com/photo-1633876477607-f6541b2af314?auto=format&fit=crop&w=1000&q=75',
                'image_alt' => 'Vista aérea de um campo cercado por árvores',
                'published_at' => now()->subMinutes(3000),
            ],
        ];

        foreach ($journal as $item) {
            JournalArticle::updateOrCreate(['title' => $item['title']], $item);
        }
    }
}
