import type { BackgroundOption, Source, SpeciesOption, SpeciesVariant, Trait } from '../domain/types';

const source = (page: number, section: string): Source => ({ edition: '2024', document: 'SRD 5.2.1', url: 'https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf', page, section, license: 'CC-BY-4.0' });

const dv = (feet: number): Trait => ({ name: 'Visão no Escuro', description: `Você tem visão no escuro com alcance de ${feet} pés.` });
const castingNote = 'Inteligência, Sabedoria ou Carisma é seu atributo de conjuração dessas magias (escolha ao selecionar a opção).';

const ancestor = (id: string, name: string, damage: string): SpeciesVariant => ({
  id, name: `Dragão ${name}`,
  description: `Seu sopro e sua resistência são de dano ${damage}.`,
  traits: [{ name: 'Ancestralidade Dracônica', description: `Arma de Sopro e Resistência a Dano usam o tipo ${damage}.` }],
});

const giant = (id: string, name: string, giantName: string, description: string): SpeciesVariant => ({
  id, name, description: `Gigante ${giantName}. ${description}`,
  traits: [{ name, description: `${description} Usos igual ao bônus de proficiência; recupera todos em um descanso longo.` }],
});

const elfLineage = (id: string, name: string, description: string, l1: string, l3: string, l5: string, speed?: number): SpeciesVariant => ({
  id, name, description, ...(speed ? { speed } : {}),
  traits: [
    { name: 'Nível 1', description: l1 },
    { name: 'Nível 3', description: `Você sempre tem preparada a magia ${l3}; conjura uma vez por descanso longo sem espaço de magia, ou com espaços. ${castingNote}` },
    { name: 'Nível 5', description: `Você sempre tem preparada a magia ${l5}; conjura uma vez por descanso longo sem espaço de magia, ou com espaços.` },
  ],
});

const legacy = (id: string, name: string, description: string, l1: string, l3: string, l5: string): SpeciesVariant => ({
  id, name, description,
  traits: [
    { name: 'Nível 1', description: l1 },
    { name: 'Nível 3', description: `Você sempre tem preparada a magia ${l3}; conjura uma vez por descanso longo sem espaço de magia, ou com espaços. ${castingNote}` },
    { name: 'Nível 5', description: `Você sempre tem preparada a magia ${l5}; conjura uma vez por descanso longo sem espaço de magia, ou com espaços.` },
  ],
});

export const species2024: SpeciesOption[] = [
  {
    id: '2024:human', key: 'human', name: 'Humano',
    description: 'Adaptável e engenhoso: perícia extra, talento de Origem e Inspiração Heroica.',
    source: source(86, 'Human'),
    bonuses: {}, speed: 30, hpPerLevel: 0, size: 'Médio ou Pequeno (à escolha)',
    overview: 'Humanos estão em todo canto do multiverso e se adaptam a qualquer cultura ou profissão. Não têm poderes especiais fixos, mas ganham flexibilidade, uma perícia à escolha e um talento. Seus bônus de atributo vêm do antecedente.',
    traits: [
      { name: 'Engenhoso', description: 'Você ganha Inspiração Heroica sempre que termina um descanso longo.' },
      { name: 'Habilidoso', description: 'Proficiência em uma perícia à sua escolha.' },
      { name: 'Versátil', description: 'Você ganha um talento de Origem à sua escolha. Habilidoso (Skilled) é o recomendado.' },
    ],
    languages: 'Comum e dois idiomas à escolha (regra de idiomas do SRD 5.2.1).',
    skillChoice: { count: 1, label: 'Habilidoso' },
    bestFor: 'Qualquer classe. Um talento de Origem no nível 1 é muito forte, por exemplo Alerta para quem quer agir primeiro. Boa escolha para quem quer cobrir mais perícias.',
    pending: ['Escolher talento de Origem (Versátil).', 'Escolher se o personagem é Médio ou Pequeno.'],
  },
  {
    id: '2024:dwarf', key: 'dwarf', name: 'Anão',
    description: 'Robusto e resistente a veneno: +1 PV por nível e visão no escuro de 120 pés.',
    source: source(84, 'Dwarf'),
    bonuses: {}, speed: 30, hpPerLevel: 1, size: 'Médio (cerca de 1,2 a 1,5 m)',
    overview: 'Anões são povos de forja e pedra, conhecidos por tenacidade e tradição. Enxergam bem no escuro e aguentam punição. Seus bônus de atributo vêm do antecedente.',
    traits: [
      dv(120),
      { name: 'Resiliência Anã', description: 'Resistência a dano de veneno e vantagem em salvaguardas para evitar ou encerrar a condição Envenenado.' },
      { name: 'Robustez Anã', description: 'Seus PV máximos aumentam em 1 e aumentam em 1 de novo a cada nível que você ganha.' },
      { name: 'Conhecimento de Pedras', description: 'Como ação bônus, você ganha Sentido de Vibração de 60 pés por 10 minutos, desde que esteja sobre ou tocando pedra. Usos iguais ao bônus de proficiência; recupera todos em um descanso longo.' },
    ],
    languages: 'Comum e dois idiomas à escolha (regra de idiomas do SRD 5.2.1).',
    bestFor: 'Combina com quase qualquer herói de linha de frente, como Guerreiro, Clérigo, Paladino e Bárbaro. O PV extra por nível cresce muito com o tempo.',
    pending: [],
  },
  {
    id: '2024:elf', key: 'elf', name: 'Elfo',
    description: 'Gracioso, com sentidos aguçados e uma linhagem mágica à escolha.',
    source: source(84, 'Elf; Elven Lineages (p. 85)'),
    bonuses: {}, speed: 30, hpPerLevel: 0, size: 'Médio (cerca de 1,5 a 1,8 m)',
    overview: 'Elfos vivem séculos, ligados à magia e à natureza. Cada linhagem concede uma magia ao longo dos níveis. Não dormem, meditam em transe.',
    traits: [
      dv(60),
      { name: 'Linhagem Élfica', description: 'Você escolhe uma linhagem (Drow, Alto Elfo ou Elfo da Floresta) que dá benefício no nível 1 e uma magia nos níveis 3 e 5. Inteligência, Sabedoria ou Carisma é o atributo de conjuração.' },
      { name: 'Ancestralidade Feérica', description: 'Vantagem em salvaguardas para evitar ou encerrar a condição Enfeitiçado.' },
      { name: 'Sentidos Aguçados', description: 'Proficiência em Intuição, Percepção ou Sobrevivência, à sua escolha.' },
      { name: 'Transe', description: 'Você não precisa dormir e magia não pode fazê-lo dormir. Termina um descanso longo em 4 horas se meditar em transe consciente.' },
    ],
    languages: 'Comum e dois idiomas à escolha (regra de idiomas do SRD 5.2.1).',
    variantLabel: 'Linhagem',
    variants: [
      elfLineage('drow', 'Drow', 'Visão no escuro de 120 pés, Globos de Luz e magias sombrias.', 'Seu alcance de Visão no Escuro vira 120 pés. Você também conhece o truque Globos de Luz.', 'Fogo das Fadas', 'Escuridão'),
      elfLineage('high-elf', 'Alto Elfo', 'Prestidigitação e magias de adivinhação e deslocamento.', 'Você conhece o truque Prestidigitação. Ao terminar um descanso longo, pode trocá-lo por outro truque da lista de magias de mago.', 'Detectar Magia', 'Passo Nebuloso'),
      elfLineage('wood-elf', 'Elfo da Floresta', 'Velocidade 35 pés e magias de caçador.', 'Sua Velocidade vira 35 pés. Você também conhece o truque Druidismo.', 'Passos Largos', 'Passos sem Pegadas', 35),
    ],
    skillChoice: { count: 1, from: ['insight', 'perception', 'survival'], label: 'Sentidos Aguçados' },
    bestFor: 'Ótimo para Ladinos, Patrulheiros, Magos e Bardos. O Drow ajuda furtivos, o Alto Elfo ajuda conjuradores e o Elfo da Floresta ajuda quem anda muito.',
    pending: ['Escolher o atributo de conjuração da linhagem (Inteligência, Sabedoria ou Carisma).'],
  },
  {
    id: '2024:gnome', key: 'gnome', name: 'Gnomo',
    description: 'Pequeno, esperto e protegido contra magia mental.',
    source: source(85, 'Gnome'),
    bonuses: {}, speed: 30, hpPerLevel: 0, size: 'Pequeno (cerca de 0,9 a 1,2 m)',
    overview: 'Gnomos são curiosos e inventivos, com uma magia natural. Você escolhe uma linhagem: a floresta ou as rochas.',
    traits: [
      dv(60),
      { name: 'Astúcia Gnômica', description: 'Vantagem em salvaguardas de Inteligência, Sabedoria e Carisma.' },
      { name: 'Linhagem Gnômica', description: 'Você escolhe Gnomo da Floresta ou Gnomo das Rochas. Inteligência, Sabedoria ou Carisma é seu atributo de conjuração.' },
    ],
    languages: 'Comum e dois idiomas à escolha (regra de idiomas do SRD 5.2.1).',
    variantLabel: 'Linhagem',
    variants: [
      { id: 'forest-gnome', name: 'Gnomo da Floresta', description: 'Ilusão menor e fala com animais.', traits: [
        { name: 'Ilusão Menor', description: 'Você conhece o truque Ilusão Menor.' },
        { name: 'Falar com Animais', description: 'Você sempre tem preparada a magia Falar com Animais e conjura sem espaço de magia vezes igual ao bônus de proficiência; recupera em descanso longo. Também pode usar espaços de magia.' },
      ] },
      { id: 'rock-gnome', name: 'Gnomo das Rochas', description: 'Consertar, Prestidigitação e engenhocas.', traits: [
        { name: 'Truques', description: 'Você conhece os truques Consertar e Prestidigitação.' },
        { name: 'Engenhoca Diminuta', description: 'Com 10 minutos conjurando Prestidigitação, cria um dispositivo Miúdo (CA 5, 1 PV) com um efeito da magia, ativado por ação bônus. Pode ter até três, e cada um desmonta em 8 horas.' },
      ] },
    ],
    bestFor: 'Combina bem com Magos, Bruxos, Bardos e Feiticeiros. A vantagem nas salvaguardas mentais protege bem o conjurador de ataques como medo e controle.',
    pending: ['Escolher o atributo de conjuração da linhagem (Inteligência, Sabedoria ou Carisma).'],
  },
  {
    id: '2024:goliath', key: 'goliath', name: 'Golias',
    description: 'Gigante em tamanho e força: benefício de ancestral gigante e Forma Grande.',
    source: source(85, 'Goliath (pp. 85–86)'),
    bonuses: {}, speed: 35, hpPerLevel: 0, size: 'Médio (cerca de 2,1 a 2,4 m)',
    overview: 'Golias descendem de gigantes e são enormes, fortes e orgulhosos. São muito móveis e podem crescer temporariamente.',
    traits: [
      { name: 'Ancestralidade Gigante', description: 'Escolha um benefício sobrenatural de gigante. Você o usa vezes igual ao bônus de proficiência e recupera tudo em um descanso longo.' },
      { name: 'Forma Grande', description: 'A partir do nível 5, como ação bônus você fica Grande por 10 minutos (se couber), com vantagem em testes de Força e +10 pés de Velocidade. Uma vez por descanso longo.' },
      { name: 'Constituição Poderosa', description: 'Vantagem em testes de atributo para encerrar a condição Agarrado. Conta como um tamanho maior para capacidade de carga.' },
    ],
    languages: 'Comum e dois idiomas à escolha (regra de idiomas do SRD 5.2.1).',
    variantLabel: 'Ancestral Gigante',
    variants: [
      giant('clouds-jaunt', 'Salto das Nuvens', 'das Nuvens', 'Como ação bônus, teletransporta-se até 30 pés para um espaço desocupado que você veja.'),
      giant('fires-burn', 'Queimadura do Fogo', 'do Fogo', 'Ao acertar um ataque e causar dano, causa 1d10 de dano de fogo extra.'),
      giant('frosts-chill', 'Frio do Gelo', 'do Gelo', 'Ao acertar um ataque e causar dano, causa 1d6 de dano gélido extra e reduz a Velocidade do alvo em 10 pés até o início do seu próximo turno.'),
      giant('hills-tumble', 'Tombo da Colina', 'da Colina', 'Ao acertar uma criatura Grande ou menor e causar dano, pode derrubá-la (Caído).'),
      giant('stones-endurance', 'Resistência da Pedra', 'da Pedra', 'Ao sofrer dano, usa uma reação para rolar 1d12, soma seu mod. de Constituição e reduz o dano pelo total.'),
      giant('storms-thunder', 'Trovão da Tempestade', 'da Tempestade', 'Ao sofrer dano de criatura a até 60 pés, usa uma reação para causar 1d8 de dano trovejante a ela.'),
    ],
    bestFor: 'Ideal para Bárbaros, Guerreiros, Paladinos e Monges que querem ser fortes e móveis. Cada ancestral dá um truque tático diferente, como dano extra ou defesa.',
    pending: [],
  },
  {
    id: '2024:halfling', key: 'halfling', name: 'Halfling',
    description: 'Pequeno, corajoso e sortudo.',
    source: source(86, 'Halfling'),
    bonuses: {}, speed: 30, hpPerLevel: 0, size: 'Pequeno (cerca de 0,6 a 0,9 m)',
    overview: 'Halflings são povos comunitários e tranquilos, com muita sorte e uma coragem discreta. Conseguem se esconder atrás de criaturas maiores.',
    traits: [
      { name: 'Corajoso', description: 'Vantagem em salvaguardas para evitar ou encerrar a condição Amedrontado.' },
      { name: 'Agilidade Halfling', description: 'Você pode atravessar o espaço de qualquer criatura de um tamanho maior que o seu, mas não pode parar nele.' },
      { name: 'Sorte', description: 'Ao tirar 1 no d20 de um Teste de D20, você pode rolar de novo e deve usar o novo resultado.' },
      { name: 'Furtividade Natural', description: 'Você pode usar a ação Esconder-se mesmo quando só está encoberto por uma criatura pelo menos um tamanho maior que o seu.' },
    ],
    languages: 'Comum e dois idiomas à escolha (regra de idiomas do SRD 5.2.1).',
    bestFor: 'Perfeito para Ladinos, Bardos e Clérigos que preferem agir nas sombras. A Sorte ajuda contra falhas críticas.',
    pending: [],
  },
  {
    id: '2024:dragonborn', key: 'dragonborn', name: 'Draconato',
    description: 'Sopro elemental, resistência e voo temporário.',
    source: source(84, 'Dragonborn'),
    bonuses: {}, speed: 30, hpPerLevel: 0, size: 'Médio (cerca de 1,5 a 2,1 m)',
    overview: 'Draconatos descendem de dragões e têm escamas, sopro elemental e orgulho do clã. A escolha do ancestral define o tipo de dano.',
    traits: [
      { name: 'Ancestralidade Dracônica', description: 'Você escolhe o dragão ancestral na tabela; ele define o tipo de dano do sopro e da resistência.' },
      { name: 'Arma de Sopro', description: 'Quando faz a ação Atacar, pode trocar um ataque por um sopro em cone de 15 pés ou linha de 30 pés por 5 de largura. Salvaguarda de Destreza (CD 8 + mod. de Constituição + proficiência); 1d10 de dano ou metade. Dano sobe para 2d10 no nível 5, 3d10 no 11 e 4d10 no 17. Usos iguais ao bônus de proficiência; recupera em descanso longo.' },
      { name: 'Resistência a Dano', description: 'Resistência ao tipo de dano do seu ancestral.' },
      dv(60),
      { name: 'Voo Dracônico', description: 'No nível 5, como ação bônus, surgem asas por 10 minutos com Velocidade de Voo igual à sua. Uma vez por descanso longo.' },
    ],
    languages: 'Comum e dois idiomas à escolha (regra de idiomas do SRD 5.2.1).',
    variantLabel: 'Ancestral Dracônico',
    variants: [
      ancestor('black', 'Negro', 'ácido'), ancestor('blue', 'Azul', 'elétrico'), ancestor('brass', 'Latão', 'fogo'),
      ancestor('bronze', 'Bronze', 'elétrico'), ancestor('copper', 'Cobre', 'ácido'), ancestor('gold', 'Ouro', 'fogo'),
      ancestor('green', 'Verde', 'veneno'), ancestor('red', 'Vermelho', 'fogo'), ancestor('silver', 'Prata', 'gélido'),
      ancestor('white', 'Branco', 'gélido'),
    ],
    bestFor: 'Combina com Paladinos, Guerreiros, Feiticeiros e Bárbaros. O sopro serve como ataque em área e o voo no nível 5 dá muita mobilidade.',
    pending: [],
  },
  {
    id: '2024:orc', key: 'orc', name: 'Orc',
    description: 'Fôlego de guerra: Surto de Adrenalina, visão no escuro de 120 pés e Resistência Implacável.',
    source: source(86, 'Orc'),
    bonuses: {}, speed: 30, hpPerLevel: 0, size: 'Médio (cerca de 1,8 a 2,1 m)',
    overview: 'Orcs são fortes e resistentes e se movem com ferocidade em combate. Sobrevivem a golpes que derrubariam outros.',
    traits: [
      { name: 'Surto de Adrenalina', description: 'Você pode usar Correr como ação bônus e ganha PV temporários iguais ao bônus de proficiência. Usos iguais ao bônus de proficiência; recupera em descanso curto ou longo.' },
      dv(120),
      { name: 'Resistência Implacável', description: 'Ao cair a 0 PV sem morrer, você fica com 1 PV. Uma vez por descanso longo.' },
    ],
    languages: 'Comum e dois idiomas à escolha (regra de idiomas do SRD 5.2.1).',
    bestFor: 'Perfeito para Bárbaros, Guerreiros e Paladinos que querem entrar na luta rápido e sobreviver.',
    pending: [],
  },
  {
    id: '2024:tiefling', key: 'tiefling', name: 'Tiefling',
    description: 'Legado ínfero com resistência e magias à escolha.',
    source: source(86, 'Tiefling; Fiendish Legacies'),
    bonuses: {}, speed: 30, hpPerLevel: 0, size: 'Médio ou Pequeno (à escolha)',
    overview: 'Tieflings têm herança de planos ínferos, o que lhes dá resistência e magias. Você escolhe o legado: Abissal, Ctônico ou Infernal.',
    traits: [
      dv(60),
      { name: 'Legado Ínfero', description: 'Escolha um legado: ele dá resistência e um truque no nível 1, e uma magia nos níveis 3 e 5. Inteligência, Sabedoria ou Carisma é o atributo de conjuração.' },
      { name: 'Presença Sobrenatural', description: 'Você conhece o truque Taumaturgia, usando o mesmo atributo do seu Legado Ínfero.' },
    ],
    languages: 'Comum e dois idiomas à escolha (regra de idiomas do SRD 5.2.1).',
    variantLabel: 'Legado Ínfero',
    variants: [
      legacy('abyssal', 'Abissal', 'Resistência a veneno e Rajada Venenosa.', 'Resistência a dano de veneno. Você conhece o truque Rajada Venenosa.', 'Raio do Enjoo', 'Imobilizar Pessoa'),
      legacy('chthonic', 'Ctônico', 'Resistência a necrótico e Toque Arrepiante.', 'Resistência a dano necrótico. Você conhece o truque Toque Arrepiante.', 'Vida Falsa', 'Raio do Enfraquecimento'),
      legacy('infernal', 'Infernal', 'Resistência a fogo e Raio de Fogo.', 'Resistência a dano de fogo. Você conhece o truque Raio de Fogo.', 'Repreensão Infernal', 'Escuridão'),
    ],
    bestFor: 'Ótimo para Bruxos, Feiticeiros, Bardos e Magos. O legado define o seu estilo: veneno, necrótico ou fogo.',
    pending: ['Escolher o atributo de conjuração do legado (Inteligência, Sabedoria ou Carisma).', 'Escolher se o personagem é Médio ou Pequeno.'],
  },
];

const alert: Trait = { name: 'Alerta', description: 'Ao rolar Iniciativa, soma seu bônus de proficiência. Logo após rolar, pode trocar sua Iniciativa com a de um aliado disposto no mesmo combate (nenhum dos dois pode estar Incapacitado).' };
const magicInitiate = (list: string): Trait => ({ name: `Iniciado em Magia (${list})`, description: `Você aprende dois truques e uma magia de 1º nível da lista de ${list === 'Clérigo' ? 'clérigo' : 'mago'}, usando Inteligência, Sabedoria ou Carisma como atributo de conjuração. A magia fica sempre preparada: conjure uma vez por descanso longo sem gastar espaço de magia, ou com espaços. A cada nível, pode trocar uma dessas magias por outra do mesmo nível da lista.` });
const savage: Trait = { name: 'Atacante Selvagem', description: 'Uma vez por turno, ao acertar com uma arma, você pode rolar os dados de dano da arma duas vezes e usar o resultado que preferir.' };

export const backgrounds2024: BackgroundOption[] = [
  {
    id: '2024:acolyte', key: 'acolyte', name: 'Acólito',
    description: 'Serviço religioso, magia divina básica e conhecimento sagrado.',
    source: source(83, 'Acolyte'),
    abilities: ['int', 'wis', 'cha'], skills: ['insight', 'religion'],
    overview: 'Você passou anos servindo em um templo, aprendendo ritos, textos sagrados e como falar com os fiéis. Está acostumado a ouvir, aconselhar e guiar.',
    tools: 'Suprimentos de calígrafo.',
    feat: magicInitiate('Clérigo'),
    languages: 'Nenhum adicional (os idiomas vêm da espécie).',
    equipment: 'Opção A: suprimentos de calígrafo, livro (preces), símbolo sagrado, pergaminho (10 folhas), robe e 8 po. Opção B: 50 po.',
    bestFor: 'Clérigos, Paladinos e Druidas combinam, mas serve a qualquer um que queira magia divina de apoio. Sabedoria e Carisma ajudam personagens de conversa.',
    pending: ['Escolher os dois truques, a magia de 1º nível e o atributo de conjuração do talento.'],
  },
  {
    id: '2024:criminal', key: 'criminal', name: 'Criminoso',
    description: 'Experiência nas sombras, reflexos e ferramentas de ladrão.',
    source: source(83, 'Criminal'),
    abilities: ['dex', 'con', 'int'], skills: ['sleight', 'stealth'],
    overview: 'Você viveu à margem da lei, aprendendo a roubar, esconder-se e escapar. Está sempre atento a perigos.',
    tools: 'Ferramentas de ladrão.',
    feat: alert,
    languages: 'Nenhum adicional (os idiomas vêm da espécie).',
    equipment: 'Opção A: 2 adagas, ferramentas de ladrão, pé de cabra, 2 bolsas, roupas de viajante e 16 po. Opção B: 50 po.',
    bestFor: 'Ladinos, Patrulheiros e Monges, pois Destreza e furtividade aparecem muito. O talento Alerta é útil para qualquer classe que queira agir primeiro.',
    pending: [],
  },
  {
    id: '2024:sage', key: 'sage', name: 'Sábio',
    description: 'Estudo, pesquisa e magia arcana básica.',
    source: source(83, 'Sage'),
    abilities: ['con', 'int', 'wis'], skills: ['arcana', 'history'],
    overview: 'Você passou anos em bibliotecas, escolas ou com mestres, buscando conhecimento. Reconhece criaturas, lendas e magias.',
    tools: 'Suprimentos de calígrafo.',
    feat: magicInitiate('Mago'),
    languages: 'Nenhum adicional (os idiomas vêm da espécie).',
    equipment: 'Opção A: bordão, suprimentos de calígrafo, livro (história), pergaminho (8 folhas), robe e 8 po. Opção B: 50 po.',
    bestFor: 'Magos e Bruxos são os mais evidentes, mas Bardos e Clérigos também ganham com Arcanismo e História. Dá acesso a magias arcanas desde o nível 1.',
    pending: ['Escolher os dois truques, a magia de 1º nível e o atributo de conjuração do talento.'],
  },
  {
    id: '2024:soldier', key: 'soldier', name: 'Soldado',
    description: 'Disciplina militar e ataques mais letais.',
    source: source(83, 'Soldier'),
    abilities: ['str', 'dex', 'con'], skills: ['athletics', 'intimidation'],
    overview: 'Você serviu em exército ou milícia, aprendendo disciplina, combate e vida de acampamento.',
    tools: 'Um tipo de jogo à escolha.',
    feat: savage,
    languages: 'Nenhum adicional (os idiomas vêm da espécie).',
    equipment: 'Opção A: lança, arco curto, 20 flechas, jogo (o mesmo da proficiência), kit de curandeiro, aljava, roupas de viajante e 14 po. Opção B: 50 po.',
    bestFor: 'Guerreiros, Bárbaros, Paladinos e Patrulheiros, que atacam com arma. Atacante Selvagem aumenta o dano médio dos acertos.',
    pending: ['Escolher o tipo de jogo.'],
  },
];
