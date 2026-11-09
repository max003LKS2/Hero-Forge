import type { ClassOption, Feature, Source } from '../domain/types';

const source = (page: number, section: string): Source => ({ edition: '2014', document: 'SRD 5.1', url: 'https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf', page, section, license: 'CC-BY-4.0' });

const asi = (level: number): Feature => ({ level, name: 'Aumento de Atributo', description: 'Aumente um atributo em 2 pontos ou dois atributos em 1 ponto cada. Nenhum atributo passa de 20 desta forma. (Você também pode trocar este aumento por um talento, se a sua mesa usar talentos.)' });
const slotLevel = (level: number, circle: string): Feature => ({ level, name: `Espaços de magia de ${circle} círculo`, description: `A tabela da classe passa a oferecer espaços de magia de ${circle} círculo, e você pode aprender ou preparar magias desse nível.` });

export const classes2014a: ClassOption[] = [
  // ───────────────────────── BÁRBARO ─────────────────────────
  {
    id: '2014:barbarian', key: 'barbarian', name: 'Bárbaro',
    description: 'Fúria primal, muito aguento e dano brutal: o guerreiro que fica mais perigoso quanto mais apanha.',
    source: source(8, 'Barbarian'),
    hitDie: 12, saves: ['str', 'con'], skillCount: 2,
    skills: ['animal', 'athletics', 'intimidation', 'nature', 'perception', 'survival'],
    pending: [],
    primary: ['str'], primaryText: 'Força (ataque e dano) e Constituição (PV e CA sem armadura)',
    role: 'Linha de frente, tanque e causador de dano corpo a corpo',
    overview: 'O Bárbaro luta movido por uma fúria primal. Ao entrar em Fúria ele quase não sente os golpes comuns (resistência a dano físico) e bate com mais força. Tem o maior dado de vida do jogo (d12), então sobrevive a muito dano. É uma classe simples de jogar e muito boa para quem está começando: quase sempre a melhor jogada é entrar em Fúria e atacar.',
    playstyle: [
      'Entre em Fúria no primeiro turno de uma luta difícil: com resistência a dano físico você aguenta o dobro do castigo.',
      'Use Ataque Descuidado quando quiser acertar com certeza (vantagem), sabendo que os inimigos também terão vantagem contra você.',
      'Fique no meio da briga e proteja os aliados mais frágeis atraindo os inimigos para você.',
      'Seu maior limite é o número de Fúrias por Descanso Longo; guarde-as para os combates que importam.',
      'Fora de combate você é bom em testes de Força e Atletismo: empurrar, escalar, arrombar e intimidar.'
    ],
    abilityAdvice: {
      str: 'Força ajuda você a acertar e a causar dano com armas corpo a corpo, além de Atletismo, empurrar e arrombar portas; como Bárbaro eu recomendo o valor mais alto possível aqui, porque a Fúria só soma dano em ataques feitos com Força.',
      dex: 'Destreza ajuda você na CA, na Iniciativa, em Furtividade e nas Salvaguardas contra armadilhas e magias de área; como Bárbaro eu recomendo um valor médio (13 ou 14), porque sua Defesa sem Armadura já usa Destreza e você não precisa de muito mais.',
      con: 'Constituição ajuda você nos PV, na concentração de quem sofre dano e, para o Bárbaro, na CA sem armadura (10 + Des + Con); como Bárbaro eu recomendo valor alto (14 ou 15), porque ela soma duas vezes: mais vida e mais defesa.',
      int: 'Inteligência ajuda você em Arcanismo, História, Investigação e Natureza; como Bárbaro eu recomendo deixá-la baixa (8), porque o personagem quase nunca depende dela e você ganha pontos para Força e Constituição.',
      wis: 'Sabedoria ajuda você em Percepção, Intuição e Sobrevivência e protege contra encantamentos e medo; como Bárbaro eu recomendo um valor mediano (12), porque é a Salvaguarda mental mais comum e Percepção é uma perícia da classe.',
      cha: 'Carisma ajuda você em Persuasão, Enganação e Intimidação; como Bárbaro eu recomendo deixá-lo em 8, porque seu poder vem do corpo, e a única exceção é a Intimidação, que pode usar Força se o Mestre permitir.'
    },
    recommendedScores: { str: 15, dex: 13, con: 15, int: 8, wis: 12, cha: 8 },
    recommendedSkills: ['athletics', 'perception'],
    armorProf: ['light', 'medium'], shieldProf: true,
    weaponProf: { categories: ['simple', 'martial'] },
    armorText: 'Armaduras leves, armaduras médias e escudos.',
    weaponText: 'Armas simples e armas marciais.',
    toolText: 'Nenhuma proficiência em ferramentas.',
    kits: [
      { id: 'barbarian-a', name: 'Machado e machadinhas', description: 'Escolhas (a) e (a): um machado grande e duas machadinhas, mais mochila de aventureiro e quatro azagaias. Pura potência de dano.', armor: '', shield: false, weapons: ['greataxe', 'handaxe', 'javelin'], gear: ['Mochila de aventureiro (explorer\'s pack)', '2 machadinhas e 4 azagaias (quantidades do kit)'], gp: 0 },
      { id: 'barbarian-b', name: 'Montante e lança', description: 'Escolhas (b) e (b): uma espada grande (arma marcial corpo a corpo) e uma lança (arma simples), mais mochila de aventureiro e quatro azagaias.', armor: '', shield: false, weapons: ['greatsword', 'spear', 'javelin'], gear: ['Mochila de aventureiro (explorer\'s pack)', '4 azagaias (quantidade do kit)'], gp: 0 },
      { id: 'barbarian-c', name: 'Espada longa e machadinhas', description: 'Escolhas (b) e (a): uma espada longa como arma marcial e duas machadinhas, mais mochila de aventureiro e quatro azagaias. Versátil, com opção de arremesso.', armor: '', shield: false, weapons: ['longsword', 'handaxe', 'javelin'], gear: ['Mochila de aventureiro (explorer\'s pack)', '2 machadinhas e 4 azagaias (quantidades do kit)'], gp: 0 }
    ],
    features: [
      { level: 1, name: 'Fúria', description: 'Como Ação Bônus, você entra em Fúria por 1 minuto (sem armadura pesada): vantagem em testes e Salvaguardas de Força, bônus de dano em ataques corpo a corpo com Força e resistência a dano contundente, perfurante e cortante. Você tem 2 Fúrias por Descanso Longo no nível 1 (a tabela aumenta isso) e não conjura nem se concentra em magias enquanto está em Fúria.' },
      { level: 1, name: 'Defesa sem Armadura', description: 'Sem armadura, sua CA é 10 + modificador de Destreza + modificador de Constituição. Você pode usar escudo e manter o benefício.' },
      { level: 2, name: 'Ataque Descuidado', description: 'No primeiro ataque do turno você pode atacar sem cautela: vantagem nos ataques corpo a corpo com Força neste turno, mas ataques contra você têm vantagem até o seu próximo turno.' },
      { level: 2, name: 'Sentido de Perigo', description: 'Vantagem em Salvaguardas de Destreza contra efeitos que você consegue ver, como armadilhas e magias. Não funciona se você estiver cego, surdo ou incapacitado.' },
      { level: 3, name: 'Caminho Primitivo', description: 'Escolha um caminho que molda a sua Fúria (no SRD 5.1: Caminho do Berserker). Ele concede traços nos níveis 3, 6, 10 e 14.' },
      asi(4),
      { level: 5, name: 'Ataque Extra', description: 'Ao usar a ação Atacar, você ataca duas vezes em vez de uma.' },
      { level: 5, name: 'Movimento Rápido', description: 'Seu deslocamento aumenta em 10 pés quando você não usa armadura pesada.' },
      { level: 7, name: 'Instinto Selvagem', description: 'Vantagem nas jogadas de Iniciativa. Se você for surpreendido, pode agir normalmente no primeiro turno desde que entre em Fúria antes de fazer qualquer outra coisa.' },
      asi(8),
      { level: 9, name: 'Crítico Brutal (1 dado)', description: 'Ao acertar um crítico corpo a corpo, role 1 dado de dano de arma adicional.' },
      { level: 11, name: 'Fúria Implacável', description: 'Se você cair a 0 PV em Fúria sem morrer na hora, pode fazer uma Salvaguarda de Constituição CD 10 para ficar com 1 PV. A CD sobe 5 a cada uso seguinte e volta a 10 após um Descanso Curto ou Longo.' },
      asi(12),
      { level: 13, name: 'Crítico Brutal (2 dados)', description: 'Você rola 2 dados adicionais de dano de arma em críticos corpo a corpo.' },
      { level: 15, name: 'Fúria Persistente', description: 'Sua Fúria só termina cedo se você ficar inconsciente ou decidir encerrá-la; não acaba mais por falta de ataques ou de dano.' },
      asi(16),
      { level: 17, name: 'Crítico Brutal (3 dados)', description: 'Você rola 3 dados adicionais de dano de arma em críticos corpo a corpo.' },
      { level: 18, name: 'Força Indomável', description: 'Se o total de um teste de Força for menor que o seu valor de Força, você usa o valor de Força no lugar do total.' },
      asi(19),
      { level: 20, name: 'Campeão Primal', description: 'Força e Constituição aumentam em 4 pontos, e o máximo dessas duas passa a ser 24. Além disso, suas Fúrias se tornam ilimitadas.' }
    ],
    subclass: {
      id: '2014:barbarian:berserker', name: 'Caminho do Berserker',
      description: 'Fúria como fim em si mesma: mais ataques e imunidade a medo, ao custo de exaustão.',
      level: 3,
      features: [
        { level: 3, name: 'Frenesi', description: 'Ao entrar em Fúria você pode entrar em frenesi: durante a Fúria, faz um ataque corpo a corpo como Ação Bônus a cada turno seguinte. Quando a Fúria termina, você sofre 1 nível de exaustão.' },
        { level: 6, name: 'Fúria Irracional', description: 'Você não pode ser enfeitiçado nem amedrontado em Fúria. Se já estiver sob um desses efeitos ao entrar em Fúria, ele fica suspenso enquanto ela durar.' },
        { level: 10, name: 'Presença Intimidante', description: 'Como ação, escolha uma criatura a até 30 pés que veja ou ouça você: Salvaguarda de Sabedoria (CD 8 + bônus de proficiência + mod. de Carisma) ou fica amedrontada até o fim do seu próximo turno. Você pode estender o efeito com uma ação por turno; quem passa fica imune por 24 horas.' },
        { level: 14, name: 'Retaliação', description: 'Quando uma criatura a até 5 pés causar dano a você, use a Reação para fazer um ataque corpo a corpo contra ela.' }
      ],
      effects: {}, source: source(9, 'Path of the Berserker')
    },
    asiLevels: [4, 8, 12, 16, 19],
    unarmoredDefense: 'barbarian',
    speciesFit: {
      'half-orc': 'Meio-Orc: +2 Força e +1 Constituição, exatamente os atributos do Bárbaro; Ataques Selvagens e Resistência Implacável combinam com críticos e sobrevivência.',
      dragonborn: 'Draconato: +2 Força e +1 Carisma; sopro e resistência elemental dão alcance e defesa extras ao combate corpo a corpo.',
      'hill-dwarf': 'Anão da Colina: +2 Constituição e +1 Sabedoria, mais 1 PV extra por nível; vira um tanque quase impossível de derrubar.',
      human: 'Humano: +1 em todos os atributos, melhorando Força, Constituição e Destreza ao mesmo tempo; opção flexível e segura.'
    },
    backgroundFit: {
      acolyte: 'Acólito dá Intuição e Religião; Intuição é útil para o Bárbaro ler as pessoas, mas Religião quase não é usada. Funciona melhor pela história do que pelas perícias.',
      custom: 'Antecedente livre: escolha duas perícias. Atletismo e Percepção são as mais úteis (se não as pegou na classe); Intimidação, Sobrevivência e Lidar com Animais combinam com a pegada selvagem.'
    }
  },

  // ───────────────────────── BARDO ─────────────────────────
  {
    id: '2014:bard', key: 'bard', name: 'Bardo',
    description: 'Magia pela música e pela lábia: apoio, perícias de sobra e um truque para cada situação.',
    source: source(11, 'Bard'),
    hitDie: 8, saves: ['dex', 'cha'], skillCount: 3,
    skills: ['acrobatics', 'animal', 'arcana', 'athletics', 'deception', 'history', 'insight', 'intimidation', 'investigation', 'medicine', 'nature', 'perception', 'performance', 'persuasion', 'religion', 'sleight', 'stealth', 'survival'],
    pending: ['Escolher três instrumentos musicais.', 'Escolher 2 truques e 4 magias conhecidas do Bardo.'],
    primary: ['cha'], primaryText: 'Carisma (magias e inspiração) e Destreza (CA e Salvaguardas)',
    role: 'Apoio, rosto do grupo e conjurador versátil',
    overview: 'O Bardo usa música, palavras e carisma para fazer magia. Ele inspira os aliados com dados extras, conjura de forma versátil e é o melhor das perícias: aprende qualquer três e, depois, ganha mais três e Especialização. É ótimo para quem gosta de interpretar, conversar e ajudar o grupo em qualquer situação, dentro e fora de combate.',
    playstyle: [
      'Use Inspiração de Bardo (Ação Bônus) nos aliados antes de testes e ataques importantes; eles somam o dado depois de ver o resultado do d20.',
      'Você sabe poucas magias, então escolha com cuidado: misture magias de controle (Sono, Canção de Ninar), cura e utilidade.',
      'Fora de combate você brilha em Persuasão, Enganação, Atuação e qualquer perícia graças a Pau para Toda Obra.',
      'Em combate, fique atrás da linha de frente e escolha entre apoiar, controlar ou usar um truque de ataque.',
      'No nível 3, escolha duas perícias para Especialização e dobre o bônus delas.'
    ],
    abilityAdvice: {
      str: 'Força ajuda você em Atletismo, em carregar peso e em armas pesadas; como Bardo eu recomendo 8, porque você usa magia e armas leves e prefere pontos em Carisma e Destreza.',
      dex: 'Destreza ajuda você na CA com armadura leve, na Iniciativa, em Acrobacia, Furtividade e em armas de acuidade como o florete; como Bardo eu recomendo 14, porque você só usa armadura leve e Destreza é uma das suas Salvaguardas.',
      con: 'Constituição ajuda você nos PV e a manter a concentração em magias quando é atingido; como Bardo eu recomendo 13 ou 14, porque você é frágil (d8) e quase sempre se concentra em alguma magia.',
      int: 'Inteligência ajuda você em Arcanismo, História, Investigação e Natureza; como Bardo eu recomendo 10, porque o Bardo ganha perícias de qualquer área sem depender do atributo.',
      wis: 'Sabedoria ajuda você em Percepção, Intuição e Sobrevivência e é a Salvaguarda mais comum contra efeitos mentais; como Bardo eu recomendo 12, porque Percepção e Intuição são perícias que o Bardo quase sempre quer ter.',
      cha: 'Carisma é o atributo de conjuração do Bardo: define a CD das magias, o ataque mágico, as vezes que você usa Inspiração de Bardo e perícias como Persuasão, Enganação e Atuação; como Bardo eu recomendo o valor mais alto possível (15 antes dos bônus raciais).'
    },
    recommendedScores: { str: 8, dex: 14, con: 13, int: 10, wis: 12, cha: 15 },
    recommendedSkills: ['deception', 'persuasion', 'performance'],
    armorProf: ['light'], shieldProf: false,
    weaponProf: { categories: ['simple'], weaponIds: ['hand-crossbow', 'longsword', 'rapier', 'shortsword'] },
    armorText: 'Armaduras leves.',
    weaponText: 'Armas simples, bestas de mão, espadas longas, floretes e espadas curtas.',
    toolText: 'Três instrumentos musicais à sua escolha.',
    kits: [
      { id: 'bard-a', name: 'Florete e pacote de diplomata', description: 'Escolhas (a), (a) e (a): florete, pacote de diplomata e um alaúde, mais armadura de couro e adaga. Bom para quem quer interpretar nas cortes e na política.', armor: 'leather', shield: false, weapons: ['rapier', 'dagger'], gear: ['Pacote de diplomata (diplomat\'s pack)', 'Alaúde (foco de conjuração)'], gp: 0 },
      { id: 'bard-b', name: 'Espada longa e pacote de artista', description: 'Escolhas (b), (b) e (a): espada longa, pacote de artista e um alaúde, mais armadura de couro e adaga. Visual de menestrel aventureiro.', armor: 'leather', shield: false, weapons: ['longsword', 'dagger'], gear: ['Pacote de artista (entertainer\'s pack)', 'Alaúde (foco de conjuração)'], gp: 0 },
      { id: 'bard-c', name: 'Arco curto e flauta', description: 'Escolhas (c), (b) e (b): um arco curto como arma simples, pacote de artista e uma flauta (outro instrumento), mais armadura de couro e adaga. Para o bardo que ataca de longe.', armor: 'leather', shield: false, weapons: ['shortbow', 'dagger'], gear: ['Pacote de artista (entertainer\'s pack)', 'Flauta (foco de conjuração)', 'Aljava com flechas'], gp: 0 }
    ],
    features: [
      { level: 1, name: 'Conjuração', description: 'Você conjura magias de Bardo usando Carisma. Começa com 2 truques e 4 magias conhecidas de 1º círculo, aprende mais conforme a tabela e pode trocar uma magia conhecida a cada nível. Pode conjurar magias com marca de ritual e usar um instrumento musical como foco.' },
      { level: 1, name: 'Inspiração de Bardo (d6)', description: 'Como Ação Bônus, dê um dado de inspiração a outra criatura a até 60 pés que ouça você. Em 10 minutos ela pode somar o dado a um teste, ataque ou Salvaguarda. Você tem usos iguais ao seu mod. de Carisma (mínimo 1) por Descanso Longo.' },
      { level: 2, name: 'Pau para Toda Obra', description: 'Você soma metade do seu bônus de proficiência (arredondado para baixo) a qualquer teste de atributo que ainda não use a sua proficiência.' },
      { level: 2, name: 'Canção de Descanso (d6)', description: 'Durante um Descanso Curto, você e aliados que ouvirem sua música recuperam 1d6 PV extras ao gastar Dados de Vida. O dado sobe para d8 no nível 9, d10 no 13 e d12 no 17.' },
      { level: 3, name: 'Colégio de Bardo', description: 'Escolha um colégio que define seu estilo (no SRD 5.1: Colégio do Conhecimento). Ele concede traços nos níveis 3, 6 e 14.' },
      { level: 3, name: 'Especialização', description: 'Escolha duas perícias com proficiência: seu bônus de proficiência é dobrado nelas. No nível 10 você escolhe mais duas.' },
      slotLevel(3, '2º'),
      asi(4),
      { level: 5, name: 'Inspiração de Bardo (d8)', description: 'O dado de inspiração passa de d6 para d8.' },
      { level: 5, name: 'Fonte de Inspiração', description: 'Você recupera todos os usos de Inspiração de Bardo ao terminar um Descanso Curto ou Longo.' },
      slotLevel(5, '3º'),
      { level: 6, name: 'Contra-Encantamento', description: 'Como ação, inicie uma performance até o fim do seu próximo turno: você e aliados a até 30 pés que ouçam têm vantagem em Salvaguardas contra amedrontar e enfeitiçar.' },
      slotLevel(7, '4º'),
      asi(8),
      { level: 9, name: 'Canção de Descanso (d8)', description: 'Os PV extras da Canção de Descanso passam a 1d8.' },
      slotLevel(9, '5º'),
      { level: 10, name: 'Inspiração de Bardo (d10)', description: 'O dado de inspiração passa de d8 para d10.' },
      { level: 10, name: 'Especialização (2ª)', description: 'Escolha mais duas perícias com proficiência para receber Especialização (bônus de proficiência dobrado).' },
      { level: 10, name: 'Segredos Mágicos', description: 'Escolha 2 magias de qualquer classe (de um círculo que você pode lançar, ou truques). Elas contam como magias de Bardo e entram na sua lista de magias conhecidas.' },
      slotLevel(11, '6º'),
      asi(12),
      { level: 13, name: 'Canção de Descanso (d10)', description: 'Os PV extras da Canção de Descanso passam a 1d10.' },
      slotLevel(13, '7º'),
      { level: 14, name: 'Segredos Mágicos (2ª escolha)', description: 'Você aprende mais 2 magias de qualquer classe, seguindo as mesmas regras do nível 10.' },
      { level: 15, name: 'Inspiração de Bardo (d12)', description: 'O dado de inspiração passa de d10 para d12.' },
      slotLevel(15, '8º'),
      asi(16),
      { level: 17, name: 'Canção de Descanso (d12)', description: 'Os PV extras da Canção de Descanso passam a 1d12.' },
      slotLevel(17, '9º'),
      { level: 18, name: 'Segredos Mágicos (3ª escolha)', description: 'Você aprende mais 2 magias de qualquer classe, seguindo as mesmas regras do nível 10.' },
      asi(19),
      { level: 20, name: 'Inspiração Superior', description: 'Ao rolar Iniciativa sem nenhum uso de Inspiração de Bardo restante, você recupera 1 uso.' }
    ],
    subclass: {
      id: '2014:bard:lore', name: 'Colégio do Conhecimento',
      description: 'Bardos eruditos que sabem um pouco de tudo e usam a língua afiada como arma.',
      level: 3,
      features: [
        { level: 3, name: 'Proficiências Adicionais', description: 'Você ganha proficiência em 3 perícias à sua escolha.' },
        { level: 3, name: 'Palavras de Corte', description: 'Quando uma criatura a até 60 pés (que ouça você) faz ataque, teste de atributo ou rolagem de dano, use a Reação e gaste 1 uso de Inspiração de Bardo para subtrair o dado da jogada dela. Pode ser usada depois da jogada, antes do resultado ser anunciado.' },
        { level: 6, name: 'Segredos Mágicos Adicionais', description: 'Você aprende 2 magias de qualquer classe (de círculo que pode lançar, ou truques). Elas contam como magias de Bardo, mas não contam no limite de magias conhecidas.' },
        { level: 14, name: 'Perícia Inigualável', description: 'Ao fazer um teste de atributo, você pode gastar 1 uso de Inspiração de Bardo e somar o dado ao resultado, mesmo depois de rolar o d20.' }
      ],
      effects: {}, source: source(13, 'College of Lore')
    },
    spellcasting: {
      ability: 'cha', caster: 'full',
      cantrips: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      spells: [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
      kind: 'known',
      focus: 'Instrumento musical',
      ritual: true,
      summary: 'Carisma é seu atributo de conjuração (CD = 8 + proficiência + mod. de Carisma). Você conhece um número fixo de magias, listado na tabela, e pode trocar uma a cada nível. Recupera os espaços de magia em um Descanso Longo e pode lançar como ritual as magias conhecidas que tenham essa marca.'
    },
    asiLevels: [4, 8, 12, 16, 19],
    speciesFit: {
      'half-elf': 'Meio-Elfo: +2 Carisma e +1 em outros dois atributos à escolha (ex.: Destreza e Constituição), mais duas perícias extras; talvez o melhor encaixe para o Bardo.',
      tiefling: 'Tiefling: +2 Carisma e +1 Inteligência, com magias inatas e resistência a fogo; combina com o lado carismático.',
      lightfoot: 'Halfling Pés-Leves: +2 Destreza e +1 Carisma, com Sorte para evitar falhas e Furtividade Natural; ótimo bardo ágil.',
      human: 'Humano: +1 em todos os atributos, o que reforça Carisma, Destreza e Constituição ao mesmo tempo.'
    },
    backgroundFit: {
      acolyte: 'Acólito dá Intuição e Religião; Intuição é muito útil para o Bardo social e Religião acrescenta conhecimento, liberando suas escolhas de perícia da classe.',
      custom: 'Antecedente livre: duas perícias. Para o Bardo, Persuasão, Enganação, Atuação, Intuição e Percepção rendem mais, mas como a classe já deixa escolher livremente, use aqui as perícias que sobraram.'
    }
  },

  // ───────────────────────── CLÉRIGO ─────────────────────────
  {
    id: '2014:cleric', key: 'cleric', name: 'Clérigo',
    description: 'Sabedoria e devoção: cura, proteção e magias divinas, com armadura pesada no Domínio da Vida.',
    source: source(15, 'Cleric'),
    hitDie: 8, saves: ['wis', 'cha'], skillCount: 2,
    skills: ['history', 'insight', 'medicine', 'persuasion', 'religion'],
    pending: ['Escolher 3 truques de Clérigo e preparar magias (mod. de Sabedoria + nível de Clérigo) a cada Descanso Longo.'],
    primary: ['wis'], primaryText: 'Sabedoria (magias) e Constituição ou Força (resistência no corpo a corpo)',
    role: 'Curandeiro, apoio e conjurador resistente',
    overview: 'O Clérigo canaliza o poder de uma divindade. Ele prepara magias de uma lista enorme, cura aliados, protege o grupo e ainda aguenta golpes graças à armadura média e ao escudo. No Domínio da Vida você também usa armadura pesada e suas curas ficam mais fortes. É a classe mais confiável para manter o grupo de pé.',
    playstyle: [
      'Você prepara magias a cada Descanso Longo: leve cura, Bênção e magias de proteção para a maioria das aventuras.',
      'Use Cura de Ferimentos e Palavra de Cura em aliados caídos: ressuscitar um aliado com 1 PV em combate vale muito mais do que curar muita vida de uma vez.',
      'Com armadura pesada e escudo você pode ficar na linha de frente sem medo; use magias de apoio em vez de bater em tudo.',
      'Canalizar Divindade é sua carta na manga: Expulsar Mortos-Vivos contra hordas e Preservar Vida para curar vários de uma vez.',
      'Como o Domínio da Vida soma 2 + círculo da magia em toda cura, você é a melhor fonte de PV do grupo.'
    ],
    abilityAdvice: {
      str: 'Força ajuda você em ataques corpo a corpo, em Atletismo e a vestir armaduras pesadas que exigem Força 13; como Clérigo da Vida eu recomendo 13, porque a cota de malha pede Força 13 e esse é o mínimo para usar a armadura pesada sem lentidão.',
      dex: 'Destreza ajuda você na CA com armaduras leves, na Iniciativa, em Furtividade e em Salvaguardas de área; como Clérigo eu recomendo 10, porque com armadura pesada o bônus de Destreza não conta e você pode investir em outros atributos.',
      con: 'Constituição ajuda você nos PV e em manter a concentração em magias como Bênção; como Clérigo eu recomendo 14, porque você fica perto do perigo para curar e precisa aguentar o dano.',
      int: 'Inteligência ajuda você em Arcanismo, História, Investigação e Natureza; como Clérigo eu recomendo 8, porque nenhuma habilidade de classe depende dela e você precisa dos pontos em Sabedoria e Constituição.',
      wis: 'Sabedoria é o atributo de conjuração do Clérigo: define a CD das magias, o ataque mágico, quantas magias você prepara e perícias como Intuição, Medicina e Percepção; como Clérigo eu recomendo o valor mais alto possível (15 antes dos bônus raciais).',
      cha: 'Carisma ajuda você em Persuasão, Enganação e Intimidação e é uma das suas Salvaguardas; como Clérigo eu recomendo 12, porque você fala pelo grupo em muitas cenas e ainda tem Persuasão como perícia da classe.'
    },
    recommendedScores: { str: 13, dex: 10, con: 14, int: 8, wis: 15, cha: 12 },
    recommendedSkills: ['insight', 'medicine'],
    armorProf: ['light', 'medium'], shieldProf: true,
    weaponProf: { categories: ['simple'] },
    armorText: 'Armaduras leves, armaduras médias e escudos (o Domínio da Vida adiciona armaduras pesadas).',
    weaponText: 'Armas simples.',
    toolText: 'Nenhuma proficiência em ferramentas.',
    kits: [
      { id: 'cleric-a', name: 'Cota de escamas e besta', description: 'Escolhas (a), (a), (a) e (a): maça, cota de escamas, besta leve com 20 virotes e pacote de sacerdote, mais escudo e símbolo sagrado. Defesa média e ataque à distância.', armor: 'scale-mail', shield: true, weapons: ['mace', 'light-crossbow'], gear: ['20 virotes', 'Pacote de sacerdote (priest\'s pack)', 'Símbolo sagrado'], gp: 0 },
      { id: 'cleric-b', name: 'Armadura de couro e lança', description: 'Escolhas (a), (b), (b) e (b): maça, armadura de couro, lança (arma simples) e pacote de explorador, mais escudo e símbolo sagrado. Mais leve e prática para viajar.', armor: 'leather', shield: true, weapons: ['mace', 'spear'], gear: ['Pacote de explorador (explorer\'s pack)', 'Símbolo sagrado'], gp: 0 },
      { id: 'cleric-c', name: 'Cota de malha (Domínio da Vida)', description: 'Escolhas (a), (c), (a) e (a): maça, cota de malha (permitida pela proficiência em armadura pesada do Domínio da Vida; exige Força 13), besta leve com 20 virotes e pacote de sacerdote, mais escudo e símbolo sagrado. Defesa máxima.', armor: 'chain-mail', shield: true, weapons: ['mace', 'light-crossbow'], gear: ['20 virotes', 'Pacote de sacerdote (priest\'s pack)', 'Símbolo sagrado'], gp: 0 }
    ],
    features: [
      { level: 1, name: 'Conjuração', description: 'Você conjura magias de Clérigo usando Sabedoria. Conhece 3 truques e prepara a cada Descanso Longo um número de magias igual ao mod. de Sabedoria + nível de Clérigo (mín. 1). Pode usar um símbolo sagrado como foco e lançar magias preparadas com marca de ritual.' },
      { level: 1, name: 'Domínio Divino', description: 'Escolha um domínio ligado à sua divindade (no SRD 5.1: Domínio da Vida). Ele concede magias de domínio e traços nos níveis 1, 2, 6, 8 e 17.' },
      { level: 2, name: 'Canalizar Divindade (1/descanso)', description: 'Você usa energia divina para Expulsar Mortos-Vivos ou para o efeito do seu domínio. Recupera o uso em um Descanso Curto ou Longo.' },
      { level: 2, name: 'Canalizar Divindade: Expulsar Mortos-Vivos', description: 'Como ação, apresente o símbolo sagrado: cada morto-vivo a até 30 pés que veja ou ouça você faz Salvaguarda de Sabedoria (CD da sua magia). Quem falhar fica expulso por 1 minuto ou até sofrer dano: foge de você e só pode usar a ação de Correr.' },
      slotLevel(3, '2º'),
      asi(4),
      { level: 5, name: 'Destruir Mortos-Vivos (ND 1/2)', description: 'Mortos-vivos de ND 1/2 ou menor que falharem na Salvaguarda contra Expulsar Mortos-Vivos são destruídos na hora.' },
      slotLevel(5, '3º'),
      { level: 6, name: 'Canalizar Divindade (2/descanso)', description: 'Você pode usar Canalizar Divindade 2 vezes entre descansos.' },
      slotLevel(7, '4º'),
      asi(8),
      { level: 8, name: 'Destruir Mortos-Vivos (ND 1)', description: 'O limite de ND dos mortos-vivos destruídos sobe para 1.' },
      slotLevel(9, '5º'),
      { level: 10, name: 'Intervenção Divina', description: 'Como ação, peça ajuda à divindade e role d100: se o resultado for igual ou menor que o seu nível de Clérigo, ela intervém (o Mestre decide como). Se funcionar, você não pode usar de novo por 7 dias; se falhar, pode tentar após um Descanso Longo.' },
      { level: 11, name: 'Destruir Mortos-Vivos (ND 2)', description: 'O limite de ND dos mortos-vivos destruídos sobe para 2.' },
      slotLevel(11, '6º'),
      asi(12),
      slotLevel(13, '7º'),
      { level: 14, name: 'Destruir Mortos-Vivos (ND 3)', description: 'O limite de ND dos mortos-vivos destruídos sobe para 3.' },
      slotLevel(15, '8º'),
      asi(16),
      { level: 17, name: 'Destruir Mortos-Vivos (ND 4)', description: 'O limite de ND dos mortos-vivos destruídos sobe para 4.' },
      slotLevel(17, '9º'),
      { level: 18, name: 'Canalizar Divindade (3/descanso)', description: 'Você pode usar Canalizar Divindade 3 vezes entre descansos.' },
      asi(19),
      { level: 20, name: 'Intervenção Divina Aprimorada', description: 'Seu pedido de Intervenção Divina passa a dar certo automaticamente, sem rolar dados.' }
    ],
    subclass: {
      id: '2014:cleric:life', name: 'Domínio da Vida',
      description: 'Energia positiva e cura: armadura pesada e magias de cura mais poderosas.',
      level: 1,
      features: [
        { level: 1, name: 'Magias de Domínio', description: 'Você sempre tem preparadas (sem contar no limite) as magias bênção e curar ferimentos (nível 1), restauração menor e arma espiritual (3), farol de esperança e reviver (5), proteção contra a morte e guardião da fé (7), curar ferimentos em massa e ressuscitar os mortos (9).' },
        { level: 1, name: 'Proficiência Bônus', description: 'Você ganha proficiência em armaduras pesadas.' },
        { level: 1, name: 'Discípulo da Vida', description: 'Sempre que você usa uma magia de 1º círculo ou maior para restaurar PV, a criatura recupera 2 + o círculo da magia de PV adicionais.' },
        { level: 2, name: 'Canalizar Divindade: Preservar Vida', description: 'Como ação, gaste Canalizar Divindade para distribuir uma reserva de PV igual a 5 x o seu nível de Clérigo entre criaturas a até 30 pés. Não leva ninguém acima da metade dos PV máximos e não funciona em mortos-vivos nem constructos.' },
        { level: 6, name: 'Curandeiro Abençoado', description: 'Quando você lança uma magia de 1º círculo ou maior que cure outra criatura, você recupera 2 + o círculo da magia de PV.' },
        { level: 8, name: 'Golpe Divino', description: 'Uma vez por turno, ao acertar um ataque com arma, causa 1d8 de dano radiante extra. Sobe para 2d8 no nível 14.' },
        { level: 17, name: 'Cura Suprema', description: 'Ao restaurar PV com uma magia, em vez de rolar os dados você usa o valor máximo de cada dado (ex.: 2d6 vira 12).' }
      ],
      effects: { armorGrant: ['heavy'] }, source: source(17, 'Life Domain')
    },
    spellcasting: {
      ability: 'wis', caster: 'full',
      cantrips: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      spells: [],
      formula: 'level+mod',
      kind: 'prepared',
      focus: 'Símbolo sagrado',
      ritual: true,
      summary: 'Sabedoria é seu atributo de conjuração (CD = 8 + proficiência + mod. de Sabedoria). Depois de um Descanso Longo você prepara um número de magias igual ao mod. de Sabedoria + nível de Clérigo (mín. 1) a partir de toda a lista de Clérigo, e as magias de domínio ficam sempre preparadas. Você pode lançar como ritual magias preparadas que tenham essa marca.'
    },
    asiLevels: [4, 8, 12, 16, 19],
    speciesFit: {
      'hill-dwarf': 'Anão da Colina: +2 Constituição e +1 Sabedoria (o atributo principal do Clérigo), mais PV extras por nível; um clérigo resistente.',
      human: 'Humano: +1 em todos os atributos, ajudando Sabedoria, Constituição e Força de uma vez.',
      'half-orc': 'Meio-Orc: +2 Força e +1 Constituição; ótimo para um clérigo de armadura pesada que entra na briga.',
      'half-elf': 'Meio-Elfo: +2 Carisma e +1 em outros dois atributos (por exemplo Sabedoria e Constituição), com duas perícias extras.'
    },
    backgroundFit: {
      acolyte: 'Acólito dá Intuição e Religião, exatamente a vocação do Clérigo, e ainda traz Abrigo dos Fiéis; uma combinação natural.',
      custom: 'Antecedente livre: duas perícias. Percepção e Persuasão são úteis ao Clérigo (a primeira não é da classe), e Medicina completa o lado de curandeiro.'
    }
  },

  // ───────────────────────── DRUIDA ─────────────────────────
  {
    id: '2014:druid', key: 'druid', name: 'Druida',
    description: 'Magia da natureza e transformação em animais: conjurador versátil e protetor do mundo selvagem.',
    source: source(19, 'Druid'),
    hitDie: 8, saves: ['int', 'wis'], skillCount: 2,
    skills: ['arcana', 'animal', 'insight', 'medicine', 'nature', 'perception', 'religion', 'survival'],
    pending: ['Escolher 2 truques de Druida (mais 1 do Círculo da Terra no nível 2) e preparar magias a cada Descanso Longo.', 'Escolher o terreno do Círculo da Terra no nível 3 (ártico, costa, deserto, floresta, pradaria, montanha ou pântano).'],
    primary: ['wis'], primaryText: 'Sabedoria (magias) e Constituição ou Destreza (sobrevivência)',
    role: 'Conjurador versátil, controlador e batedor',
    overview: 'O Druida usa a magia da natureza e pode se transformar em animais com Forma Selvagem. Ele prepara magias de uma lista grande de controle, cura e dano, e ainda vira urso, lobo ou águia para lutar, explorar ou fugir. É uma classe poderosa, com muitas opções; exige um pouco mais de leitura de regras, mas é muito divertida.',
    playstyle: [
      'Prepare magias de acordo com a aventura: você pode trocar a lista a cada Descanso Longo.',
      'Use Forma Selvagem para explorar (voar, nadar, espiar), para lutar com os PV da fera ou para absorver dano no lugar dos seus PV reais.',
      'Concentre-se em magias de controle, como Constrição, Névoa Obscurecente e Crescer Espinhos, para dominar o campo de batalha.',
      'Em forma de animal você não conjura magias, então escolha o momento certo para se transformar e voltar.',
      'Natureza e Sobrevivência são suas perícias de assinatura, e você fala Druídico.'
    ],
    abilityAdvice: {
      str: 'Força ajuda você em Atletismo e em ataques corpo a corpo, mas na Forma Selvagem você usa a Força da fera; como Druida eu recomendo 8, porque seus ataques são magias e sua Força não é usada em forma animal.',
      dex: 'Destreza ajuda você na CA com armaduras leves e médias, na Iniciativa, em Furtividade e em Salvaguardas de área; como Druida eu recomendo 13, porque armadura média limita o bônus a +2 e Iniciativa é útil para conjurar primeiro.',
      con: 'Constituição ajuda você nos PV e em manter a concentração, vital para magias como Constrição; como Druida eu recomendo 14, porque você vive concentrado em alguma magia.',
      int: 'Inteligência ajuda você em Arcanismo, Natureza, Investigação e História, e é uma das suas Salvaguardas; como Druida eu recomendo 12, porque Natureza e Arcanismo são perícias úteis e a Salvaguarda de Inteligência cobre ataques mentais.',
      wis: 'Sabedoria é o atributo de conjuração do Druida: define a CD das magias, o ataque mágico, quantas magias você prepara e perícias como Percepção, Intuição, Medicina e Sobrevivência; como Druida eu recomendo o valor mais alto possível (15 antes dos bônus raciais).',
      cha: 'Carisma ajuda você em Persuasão, Enganação e Intimidação; como Druida eu recomendo 10, porque nenhuma habilidade de classe depende dele e você prefere usar os pontos em Sabedoria e Constituição.'
    },
    recommendedScores: { str: 8, dex: 13, con: 14, int: 12, wis: 15, cha: 10 },
    recommendedSkills: ['nature', 'perception'],
    armorProf: ['light', 'medium'], shieldProf: true,
    weaponProf: { categories: [], weaponIds: ['club', 'dagger', 'dart', 'javelin', 'mace', 'quarterstaff', 'scimitar', 'sickle', 'sling', 'spear'] },
    armorText: 'Armaduras leves, armaduras médias e escudos (druidas não usam armaduras nem escudos de metal).',
    weaponText: 'Clavas, adagas, dardos, azagaias, maças, bordões, cimitarras, foices, fundas e lanças.',
    toolText: 'Kit de herbalismo.',
    kits: [
      { id: 'druid-a', name: 'Escudo de madeira e cimitarra', description: 'Escolhas (a) e (a): escudo de madeira e cimitarra, mais armadura de couro, pacote de explorador e foco druídico. A opção mais clássica.', armor: 'leather', shield: true, weapons: ['scimitar'], gear: ['Pacote de explorador (explorer\'s pack)', 'Foco druídico'], gp: 0 },
      { id: 'druid-b', name: 'Funda e lança', description: 'Escolhas (b) e (b): uma funda (arma simples) e uma lança (arma simples corpo a corpo), mais armadura de couro, pacote de explorador e foco druídico. Sem escudo, para quem prefere ataque à distância.', armor: 'leather', shield: false, weapons: ['sling', 'spear'], gear: ['Pacote de explorador (explorer\'s pack)', 'Foco druídico', 'Balas de funda'], gp: 0 },
      { id: 'druid-c', name: 'Escudo de madeira e bordão', description: 'Escolhas (a) e (b): escudo de madeira e um bordão (arma simples corpo a corpo), mais armadura de couro, pacote de explorador e foco druídico. Boa defesa e bordão como foco de cena.', armor: 'leather', shield: true, weapons: ['quarterstaff'], gear: ['Pacote de explorador (explorer\'s pack)', 'Foco druídico'], gp: 0 }
    ],
    features: [
      { level: 1, name: 'Druídico', description: 'Você conhece o Druídico, o idioma secreto dos druidas, e pode deixar mensagens escondidas. Quem não o conhece só percebe a mensagem com um teste de Sabedoria (Percepção) CD 15 e não consegue lê-la sem magia.' },
      { level: 1, name: 'Conjuração', description: 'Você conjura magias de Druida usando Sabedoria. Conhece 2 truques e prepara a cada Descanso Longo um número de magias igual ao mod. de Sabedoria + nível de Druida (mín. 1). Pode usar um foco druídico e lançar magias preparadas com marca de ritual.' },
      { level: 2, name: 'Forma Selvagem', description: 'Como ação, vire uma fera que você já viu, 2 vezes por Descanso Curto ou Longo. No nível 2 a fera é ND 1/4 ou menor sem deslocamento de voo ou natação; sobe para ND 1/2 sem voo no nível 4 e ND 1 no nível 8. A transformação dura horas iguais à metade do seu nível, e você usa os PV e as estatísticas da fera, sem conjurar magias.' },
      { level: 2, name: 'Círculo Druídico', description: 'Escolha um círculo de druidas (no SRD 5.1: Círculo da Terra). Ele concede traços nos níveis 2, 6, 10 e 14.' },
      slotLevel(3, '2º'),
      { level: 4, name: 'Aprimoramento de Forma Selvagem', description: 'Você pode se transformar em feras de ND 1/2 que não voem (como um crocodilo).' },
      asi(4),
      slotLevel(5, '3º'),
      slotLevel(7, '4º'),
      { level: 8, name: 'Aprimoramento de Forma Selvagem', description: 'Você pode se transformar em feras de ND 1 (como uma águia gigante), inclusive as que voam.' },
      asi(8),
      slotLevel(9, '5º'),
      slotLevel(11, '6º'),
      asi(12),
      slotLevel(13, '7º'),
      slotLevel(15, '8º'),
      asi(16),
      slotLevel(17, '9º'),
      { level: 18, name: 'Corpo Atemporal', description: 'A magia primal retarda seu envelhecimento: a cada 10 anos que passam, você envelhece apenas 1.' },
      { level: 18, name: 'Magias Animais', description: 'Você pode lançar magias de Druida em Forma Selvagem, usando os componentes verbais e somáticos, mas sem fornecer componentes materiais.' },
      asi(19),
      { level: 20, name: 'Arquidruida', description: 'Você pode usar Forma Selvagem quantas vezes quiser e ignora componentes verbais, somáticos e materiais sem custo (e não consumidos) das suas magias de Druida, em qualquer forma.' }
    ],
    subclass: {
      id: '2014:druid:land', name: 'Círculo da Terra',
      description: 'Místicos ligados a um tipo de terreno: truque extra, recuperação de espaços e magias de círculo.',
      level: 2,
      features: [
        { level: 2, name: 'Truque Adicional', description: 'Você aprende 1 truque de Druida a mais, à sua escolha.' },
        { level: 2, name: 'Recuperação Natural', description: 'Em um Descanso Curto, recupere espaços de magia gastos com nível combinado igual ou menor que metade do seu nível de Druida (arredondado para cima), sem espaços de 6º círculo ou maiores. Uma vez por Descanso Longo.' },
        { level: 3, name: 'Magias de Círculo', description: 'Escolha o terreno (ártico, costa, deserto, floresta, pradaria, montanha ou pântano). Nos níveis 3, 5, 7 e 9 você ganha magias do terreno, sempre preparadas e sem contar no limite (por exemplo, floresta: pele de árvore e escalar como aranha no nível 3).' },
        { level: 6, name: 'Passo da Terra', description: 'Terreno difícil não mágico não custa movimento extra, você atravessa plantas não mágicas sem se ferir nem se atrasar e tem vantagem em Salvaguardas contra plantas mágicas que impeçam o movimento.' },
        { level: 10, name: 'Proteção da Natureza', description: 'Elementais e feéricos não podem enfeitiçar nem amedrontar você, e você é imune a veneno e doença.' },
        { level: 14, name: 'Santuário da Natureza', description: 'Quando uma fera ou planta o ataca, ela faz Salvaguarda de Sabedoria contra a CD das suas magias. Se falhar, escolhe outro alvo ou o ataque erra automaticamente; se passar, fica imune por 24 horas.' }
      ],
      effects: {}, source: source(21, 'Circle of the Land')
    },
    spellcasting: {
      ability: 'wis', caster: 'full',
      cantrips: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      spells: [],
      formula: 'level+mod',
      kind: 'prepared',
      focus: 'Foco druídico',
      ritual: true,
      summary: 'Sabedoria é seu atributo de conjuração (CD = 8 + proficiência + mod. de Sabedoria). Depois de um Descanso Longo você prepara um número de magias igual ao mod. de Sabedoria + nível de Druida (mín. 1) a partir da lista de Druida; magias de círculo ficam sempre preparadas. Você pode lançar como ritual magias preparadas que tenham essa marca.'
    },
    asiLevels: [4, 8, 12, 16, 19],
    speciesFit: {
      'hill-dwarf': 'Anão da Colina: +2 Constituição e +1 Sabedoria, mais PV extras por nível; ótimo para manter concentração e sobreviver.',
      human: 'Humano: +1 em todos os atributos, o que reforça Sabedoria, Constituição e Destreza de uma vez.',
      'high-elf': 'Elfo Alto: +2 Destreza e +1 Inteligência, mais um truque de Mago e Transe; bom para o druida que quer CA e perícias.',
      'half-elf': 'Meio-Elfo: +2 Carisma e +1 em dois outros atributos (por exemplo Sabedoria e Constituição), com duas perícias extras.'
    },
    backgroundFit: {
      acolyte: 'Acólito dá Intuição e Religião, e Intuição combina bem com Sabedoria; a história do druida que serviu a um templo antigo também funciona.',
      custom: 'Antecedente livre: duas perícias. Percepção, Sobrevivência, Natureza e Lidar com Animais são as mais úteis para o Druida, para cobrir o que a classe não ofereceu.'
    }
  },

  // ───────────────────────── GUERREIRO ─────────────────────────
  {
    id: '2014:fighter', key: 'fighter', name: 'Guerreiro',
    description: 'O mestre das armas e armaduras: ataques consistentes, muitas opções e mais Aumentos de Atributo.',
    source: source(24, 'Fighter'),
    hitDie: 10, saves: ['str', 'con'], skillCount: 2,
    skills: ['acrobatics', 'animal', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival'],
    pending: [],
    primary: ['str', 'dex'], primaryText: 'Força ou Destreza (conforme a arma) e Constituição',
    role: 'Linha de frente ou atirador, especialista em combate',
    overview: 'O Guerreiro é o especialista em combate: usa qualquer armadura e arma, e recebe o máximo de ataques e de Aumentos de Atributo. É a classe mais flexível e simples de aprender: você pode ser um cavaleiro de armadura pesada, um arqueiro ou um duelista. Segundo Fôlego e Surto de Ação dão explosões de poder em momentos críticos.',
    playstyle: [
      'Use Surto de Ação (a partir do nível 2) para ganhar uma ação extra no turno em que o combate for decidido.',
      'Segundo Fôlego é uma cura de Ação Bônus: use quando estiver abaixo da metade dos PV, e recupere-o em um Descanso Curto.',
      'Escolha seu Estilo de Luta cedo: Defesa para tanques, Arquearia para arqueiros, Duelo para espada e escudo, Armas Grandes para armas de duas mãos.',
      'Com Ataque Extra no nível 5 e mais Aumentos de Atributo que as outras classes, você fica muito eficiente com poucos truques.',
      'Você é a escolha segura para iniciantes: fácil de montar, difícil de matar e útil em qualquer grupo.'
    ],
    abilityAdvice: {
      str: 'Força ajuda você a acertar e causar dano com armas pesadas, a usar armaduras pesadas e em Atletismo; como Guerreiro de armadura pesada eu recomendo o valor mais alto possível (15 antes dos bônus raciais), porque a cota de malha exige Força 13 e Força aumenta seu dano corpo a corpo.',
      dex: 'Destreza ajuda você na CA com armaduras leves e médias, na Iniciativa, em Furtividade e em armas à distância e de acuidade; como Guerreiro eu recomendo 13, porque cobre a Iniciativa e Salvaguardas sem tirar pontos de Força (se você preferir um arqueiro, troque os valores de Força e Destreza).',
      con: 'Constituição ajuda você nos PV e é uma Salvaguarda de classe contra veneno e atordoamento; como Guerreiro eu recomendo 14, porque você vive no meio da luta e cada ponto de PV conta.',
      int: 'Inteligência ajuda você em Arcanismo, História, Investigação e Natureza; como Guerreiro eu recomendo 8, porque nenhum traço de classe depende dela e os pontos rendem mais em Força e Constituição.',
      wis: 'Sabedoria ajuda você em Percepção, Intuição e Sobrevivência e protege contra efeitos mentais; como Guerreiro eu recomendo 12, porque ela cobre Percepção e Intuição, perícias da classe, e é a Salvaguarda mental mais comum.',
      cha: 'Carisma ajuda você em Persuasão, Enganação e Intimidação; como Guerreiro eu recomendo 10, porque você precisa de um pouco de presença social para dialogar, mas sem gastar muitos pontos.'
    },
    recommendedScores: { str: 15, dex: 13, con: 14, int: 8, wis: 12, cha: 10 },
    recommendedSkills: ['athletics', 'perception'],
    armorProf: ['light', 'medium', 'heavy'], shieldProf: true,
    weaponProf: { categories: ['simple', 'martial'] },
    armorText: 'Todas as armaduras e escudos.',
    weaponText: 'Armas simples e armas marciais.',
    toolText: 'Nenhuma proficiência em ferramentas.',
    kits: [
      { id: 'fighter-a', name: 'Cavaleiro: cota de malha e escudo', description: 'Escolhas (a), (a), (a) e (a): cota de malha, espada longa e escudo, besta leve com 20 virotes e pacote de aventureiro de masmorra. O clássico defensor.', armor: 'chain-mail', shield: true, weapons: ['longsword', 'light-crossbow'], gear: ['20 virotes', 'Pacote de aventureiro de masmorra (dungeoneer\'s pack)'], gp: 0 },
      { id: 'fighter-b', name: 'Arqueiro e duelista', description: 'Escolhas (b), (b), (b) e (b): armadura de couro, arco longo com 20 flechas, duas armas marciais (espada curta e espada longa), duas machadinhas e pacote de explorador. Ágil e com alcance.', armor: 'leather', shield: false, weapons: ['longbow', 'shortsword', 'longsword', 'handaxe'], gear: ['20 flechas', 'Pacote de explorador (explorer\'s pack)', '2 machadinhas (quantidade do kit)'], gp: 0 },
      { id: 'fighter-c', name: 'Armadura pesada e arma grande', description: 'Escolhas (a), (b), (a) e (b): cota de malha, duas armas marciais (espada grande e espada curta), besta leve com 20 virotes e pacote de explorador. Máximo de dano com Armas Grandes.', armor: 'chain-mail', shield: false, weapons: ['greatsword', 'shortsword', 'light-crossbow'], gear: ['20 virotes', 'Pacote de explorador (explorer\'s pack)'], gp: 0 }
    ],
    features: [
      { level: 1, name: 'Estilo de Luta', description: 'Escolha um estilo: Arquearia (+2 em ataques à distância), Defesa (+1 de CA com armadura), Duelo (+2 de dano com uma arma em uma mão e nada na outra), Armas Grandes (relança 1 e 2 no dano de armas de duas mãos ou versáteis), Proteção (Reação para impor desvantagem a um ataque contra aliado a 5 pés, com escudo) ou Combater com Duas Armas (soma o modificador ao segundo ataque).' },
      { level: 1, name: 'Segundo Fôlego', description: 'Como Ação Bônus, recupere 1d10 + nível de Guerreiro PV. Recarrega com um Descanso Curto ou Longo.' },
      { level: 2, name: 'Surto de Ação', description: 'No seu turno, faça 1 ação adicional além da ação normal e da Ação Bônus. Recarrega em um Descanso Curto ou Longo; a partir do nível 17 você pode usar 2 vezes entre descansos, mas só uma por turno.' },
      { level: 3, name: 'Arquétipo Marcial', description: 'Escolha um arquétipo de combate (no SRD 5.1: Campeão). Ele concede traços nos níveis 3, 7, 10, 15 e 18.' },
      asi(4),
      { level: 5, name: 'Ataque Extra', description: 'Ao usar a ação Atacar, você ataca duas vezes em vez de uma.' },
      asi(6),
      asi(8),
      { level: 9, name: 'Indomável', description: 'Você pode refazer uma Salvaguarda que falhou, ficando com o novo resultado. Uma vez por Descanso Longo; sobe para 2 usos no nível 13 e 3 usos no nível 17.' },
      { level: 11, name: 'Ataque Extra (2)', description: 'Ao usar a ação Atacar, você ataca três vezes.' },
      asi(12),
      { level: 13, name: 'Indomável (2 usos)', description: 'Você pode usar Indomável duas vezes entre Descansos Longos.' },
      asi(14),
      asi(16),
      { level: 17, name: 'Surto de Ação (2 usos)', description: 'Você pode usar Surto de Ação duas vezes entre descansos, mas só uma vez por turno.' },
      { level: 17, name: 'Indomável (3 usos)', description: 'Você pode usar Indomável três vezes entre Descansos Longos.' },
      asi(19),
      { level: 20, name: 'Ataque Extra (3)', description: 'Ao usar a ação Atacar, você ataca quatro vezes.' }
    ],
    subclass: {
      id: '2014:fighter:champion', name: 'Campeão',
      description: 'Poder físico lapidado: críticos mais frequentes e resistência sem truques.',
      level: 3,
      features: [
        { level: 3, name: 'Crítico Aprimorado', description: 'Seus ataques com arma causam um crítico com 19 ou 20 no d20.' },
        { level: 7, name: 'Atleta Extraordinário', description: 'Você soma metade do bônus de proficiência (arredondado para cima) a testes de Força, Destreza e Constituição que ainda não usam proficiência. Seu salto longo com corrida aumenta em pés iguais ao mod. de Força.' },
        { level: 10, name: 'Estilo de Luta Adicional', description: 'Você escolhe um segundo estilo de luta da lista do Guerreiro.' },
        { level: 15, name: 'Crítico Superior', description: 'Seus ataques com arma causam um crítico com 18 a 20 no d20.' },
        { level: 18, name: 'Sobrevivente', description: 'No início de cada turno, se tiver metade dos PV ou menos (e mais de 0), você recupera 5 + mod. de Constituição PV.' }
      ],
      effects: {}, source: source(25, 'Champion')
    },
    fightingStyle: { level: 1, options: ['archery', 'defense', 'dueling', 'great-weapon-fighting', 'protection', 'two-weapon-fighting'], note: 'O Campeão escolhe um segundo estilo no nível 10, mas não pode repetir o primeiro.' },
    asiLevels: [4, 6, 8, 12, 14, 16, 19],
    speciesFit: {
      'half-orc': 'Meio-Orc: +2 Força e +1 Constituição; ideal para o guerreiro corpo a corpo, com Resistência Implacável para sobreviver.',
      dragonborn: 'Draconato: +2 Força e +1 Carisma, com sopro de dragão e resistência elemental para variar a tática.',
      human: 'Humano: +1 em todos os atributos, ótimo para o guerreiro que quer ser bom em tudo.',
      'hill-dwarf': 'Anão da Colina: +2 Constituição e +1 Sabedoria, com PV extras por nível e proficiência em machados e martelos; resistente de verdade.'
    },
    backgroundFit: {
      acolyte: 'Acólito dá Intuição e Religião; Intuição é a mais útil para o Guerreiro, mas ambas têm pouco peso em combate. Vale mais pelo roteiro de personagem.',
      custom: 'Antecedente livre: duas perícias. Atletismo, Percepção, Sobrevivência e Intimidação são as mais úteis; escolha as que não foram cobertas pela classe.'
    }
  },

  // ───────────────────────── MONGE ─────────────────────────
  {
    id: '2014:monk', key: 'monk', name: 'Monge',
    description: 'Artista marcial ágil, com ki para golpes extras, velocidade e controle.',
    source: source(26, 'Monk'),
    hitDie: 8, saves: ['str', 'dex'], skillCount: 2,
    skills: ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth'],
    pending: ['Escolher uma ferramenta de artesão ou um instrumento musical para proficiência.'],
    primary: ['dex', 'wis'], primaryText: 'Destreza (ataque e CA) e Sabedoria (CA e CD de ki)',
    role: 'Lutador ágil e móvel, controlador de combate',
    overview: 'O Monge luta sem armadura, com socos, chutes e armas simples, e usa pontos de ki para golpes extras, defesa e mobilidade. Tem muito deslocamento, ataca várias vezes por turno e aplica efeitos de controle como Golpe Atordoante. Exige gerenciar bem os pontos de ki, mas é muito recompensador.',
    playstyle: [
      'Depois de atacar, gaste 1 ponto de ki para Rajada de Golpes e dar dois ataques desarmados extras como Ação Bônus.',
      'Use Defesa Paciente para se esquivar quando estiver cercado e Passo do Vento para correr ou escapar.',
      'Desde o nível 5, Golpe Atordoante pode paralisar um inimigo perigoso (Salvaguarda de Constituição), mas gasta ki.',
      'Sem armadura, sua CA depende de Destreza e Sabedoria; evite escudo e armadura para manter os benefícios do Monge.',
      'Você é muito rápido e ótimo para perseguir inimigos, atravessar o campo de batalha e salvar aliados.'
    ],
    abilityAdvice: {
      str: 'Força ajuda você em Atletismo, em agarrar e empurrar e em armas pesadas; como Monge eu recomendo 8, porque Artes Marciais usa Destreza para acertar e causar dano.',
      dex: 'Destreza ajuda você na CA sem armadura, nos ataques e dano desarmados, na Iniciativa, em Acrobacia e Furtividade; como Monge eu recomendo o valor mais alto possível (15 antes dos bônus raciais), porque ela decide quase tudo no seu combate.',
      con: 'Constituição ajuda você nos PV e na Salvaguarda contra Golpe Atordoante dos inimigos; como Monge eu recomendo 14, porque seu dado de vida é só d8 e você luta no corpo a corpo sem armadura.',
      int: 'Inteligência ajuda você em Arcanismo, História, Investigação e Natureza; como Monge eu recomendo 8, porque nenhuma habilidade de classe depende dela.',
      wis: 'Sabedoria soma à sua CA sem armadura (10 + Des + Sab), define a CD dos seus efeitos de ki e ajuda em Percepção e Intuição; como Monge eu recomendo 15, porque é seu segundo atributo mais importante.',
      cha: 'Carisma ajuda você em Persuasão, Enganação e Intimidação; como Monge eu recomendo 10, porque nenhuma habilidade de classe depende dele, mas você pode precisar conversar com NPCs.'
    },
    recommendedScores: { str: 8, dex: 15, con: 14, int: 8, wis: 15, cha: 10 },
    recommendedSkills: ['acrobatics', 'insight'],
    armorProf: [], shieldProf: false,
    weaponProf: { categories: ['simple'], weaponIds: ['shortsword'] },
    armorText: 'Nenhuma.',
    weaponText: 'Armas simples e espadas curtas.',
    toolText: 'Um tipo de ferramenta de artesão ou um instrumento musical, à sua escolha.',
    kits: [
      { id: 'monk-a', name: 'Espada curta e masmorra', description: 'Escolhas (a) e (a): espada curta e pacote de aventureiro de masmorra, mais 10 dardos. A opção clássica.', armor: '', shield: false, weapons: ['shortsword', 'dart'], gear: ['Pacote de aventureiro de masmorra (dungeoneer\'s pack)', '10 dardos (quantidade do kit)'], gp: 0 },
      { id: 'monk-b', name: 'Bordão e explorador', description: 'Escolhas (b) e (b): um bordão (arma simples) e pacote de explorador, mais 10 dardos. Bordão é arma de monge e pode ser usada com as duas mãos.', armor: '', shield: false, weapons: ['quarterstaff', 'dart'], gear: ['Pacote de explorador (explorer\'s pack)', '10 dardos (quantidade do kit)'], gp: 0 },
      { id: 'monk-c', name: 'Lança e masmorra', description: 'Escolhas (b) e (a): uma lança (arma simples) e pacote de aventureiro de masmorra, mais 10 dardos. Dá alcance para arremessar.', armor: '', shield: false, weapons: ['spear', 'dart'], gear: ['Pacote de aventureiro de masmorra (dungeoneer\'s pack)', '10 dardos (quantidade do kit)'], gp: 0 }
    ],
    features: [
      { level: 1, name: 'Defesa sem Armadura', description: 'Sem armadura e sem escudo, sua CA é 10 + modificador de Destreza + modificador de Sabedoria.' },
      { level: 1, name: 'Artes Marciais', description: 'Sem armadura nem escudo e só com armas de monge (espada curta e armas simples corpo a corpo sem as propriedades duas mãos e pesada): use Destreza em vez de Força, role um d4 de dano (sobe com o nível: d6 no 5, d8 no 11, d10 no 17) e, após atacar com a ação Atacar, faça um ataque desarmado como Ação Bônus.' },
      { level: 2, name: 'Ki', description: 'Você tem pontos de ki iguais ao seu nível de Monge (a partir do nível 2), que voltam em um Descanso Curto ou Longo. CD de ki = 8 + proficiência + mod. de Sabedoria. Você começa com Rajada de Golpes (1 ki: dois ataques desarmados como Ação Bônus após atacar), Defesa Paciente (1 ki: Esquivar como Ação Bônus) e Passo do Vento (1 ki: Desengajar ou Correr como Ação Bônus e salto dobrado).' },
      { level: 2, name: 'Movimento sem Armadura', description: 'Seu deslocamento aumenta em 10 pés sem armadura nem escudo, e o bônus sobe com o nível (+15 no 6, +20 no 10, +25 no 14, +30 no 18).' },
      { level: 3, name: 'Tradição Monástica', description: 'Escolha uma tradição (no SRD 5.1: Caminho da Mão Aberta). Ela concede traços nos níveis 3, 6, 11 e 17.' },
      { level: 3, name: 'Defletir Projéteis', description: 'Quando um ataque à distância atinge você, use a Reação para reduzir o dano em 1d10 + mod. de Destreza + nível de Monge. Se reduzir a 0, pode pegar o projétil e, gastando 1 ki, lançá-lo de volta como parte da mesma Reação (alcance 20/60 pés).' },
      asi(4),
      { level: 4, name: 'Queda Lenta', description: 'Como Reação ao cair, reduz o dano de queda em 5 vezes o seu nível de Monge.' },
      { level: 5, name: 'Ataque Extra', description: 'Ao usar a ação Atacar, você ataca duas vezes em vez de uma.' },
      { level: 5, name: 'Golpe Atordoante', description: 'Ao acertar uma criatura com um ataque corpo a corpo com arma, gaste 1 ki: ela faz Salvaguarda de Constituição ou fica atordoada até o fim do seu próximo turno.' },
      { level: 6, name: 'Golpes Fortalecidos por Ki', description: 'Seus ataques desarmados contam como mágicos para vencer resistência e imunidade a dano não mágico.' },
      { level: 7, name: 'Evasão', description: 'Ao sofrer um efeito que permita Salvaguarda de Destreza para metade do dano, você não sofre dano se passar e só metade se falhar.' },
      { level: 7, name: 'Mente Tranquila', description: 'Como ação, encerre um efeito que esteja enfeitiçando ou amedrontando você.' },
      asi(8),
      { level: 9, name: 'Movimento sem Armadura Aprimorado', description: 'Você pode se mover por superfícies verticais e sobre líquidos no seu turno sem cair durante o movimento.' },
      { level: 10, name: 'Pureza Corporal', description: 'Você fica imune a doença e veneno.' },
      asi(12),
      { level: 13, name: 'Língua do Sol e da Lua', description: 'Você entende todos os idiomas falados, e qualquer criatura que entenda um idioma entende o que você diz.' },
      { level: 14, name: 'Alma de Diamante', description: 'Você tem proficiência em todas as Salvaguardas e, ao falhar em uma, pode gastar 1 ki para rolar de novo e usar o novo resultado.' },
      { level: 15, name: 'Corpo Atemporal', description: 'Você não sofre mais os efeitos da velhice, não pode ser envelhecido magicamente e não precisa mais de comida nem água (ainda pode morrer de velhice).' },
      asi(16),
      { level: 18, name: 'Corpo Vazio', description: 'Como ação, gaste 4 ki para ficar invisível por 1 minuto, com resistência a todo dano exceto energético. Você também pode gastar 8 ki para lançar projeção astral sem componentes materiais (só você).' },
      asi(19),
      { level: 20, name: 'Eu Perfeito', description: 'Ao rolar Iniciativa sem pontos de ki restantes, você recupera 4 pontos de ki.' }
    ],
    subclass: {
      id: '2014:monk:open-hand', name: 'Caminho da Mão Aberta',
      description: 'Mestres do combate marcial com efeitos de controle na Rajada de Golpes, cura própria e aura de paz.',
      level: 3,
      features: [
        { level: 3, name: 'Técnica da Mão Aberta', description: 'Ao acertar uma criatura com um ataque da Rajada de Golpes, escolha um efeito: Salvaguarda de Destreza ou fica caída; Salvaguarda de Força ou é empurrada até 15 pés; ou não pode usar reações até o fim do seu próximo turno.' },
        { level: 6, name: 'Integridade Corporal', description: 'Como ação, você recupera PV iguais a 3 x o seu nível de Monge. Uma vez por Descanso Longo.' },
        { level: 11, name: 'Tranquilidade', description: 'Ao fim de cada Descanso Longo, você ganha o efeito de santuário até o início do próximo Descanso Longo (CD = 8 + mod. de Sabedoria + proficiência).' },
        { level: 17, name: 'Palma Vibrante', description: 'Ao acertar com um ataque desarmado, gaste 3 ki para criar vibrações que duram dias iguais ao seu nível. Depois, como ação, ative: a criatura faz Salvaguarda de Constituição e, se falhar, cai a 0 PV; se passar, sofre 10d10 de dano necrótico. Só uma criatura por vez; você pode encerrar sem usar ação.' }
      ],
      effects: {}, source: source(28, 'Way of the Open Hand')
    },
    asiLevels: [4, 8, 12, 16, 19],
    unarmoredDefense: 'monk',
    speciesFit: {
      lightfoot: 'Halfling Pés-Leves: +2 Destreza e +1 Carisma; Destreza é o atributo principal do Monge, e Furtividade Natural e Sorte ajudam muito.',
      'high-elf': 'Elfo Alto: +2 Destreza e +1 Inteligência, com Transe e sentidos aguçados; bom para o monge ágil.',
      human: 'Humano: +1 em todos os atributos, reforçando Destreza, Sabedoria e Constituição ao mesmo tempo.',
      'hill-dwarf': 'Anão da Colina: +2 Constituição e +1 Sabedoria (que soma à CA do Monge), com PV extras por nível; resistente, ainda que devagar (25 pés).'
    },
    backgroundFit: {
      acolyte: 'Acólito dá Intuição e Religião; Intuição e Religião são ambas perícias de Monge, então sobra espaço para outras escolhas, e a vida de templo combina com a disciplina monástica.',
      custom: 'Antecedente livre: duas perícias. Furtividade, Atletismo, Acrobacia e Percepção são as mais úteis para o Monge; escolha as que sobraram da classe.'
    }
  }
];
