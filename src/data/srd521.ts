import type { Catalog, Source } from '../domain/types';
const source = (page: number, section: string): Source => ({ edition: '2024', document: 'SRD 5.2.1', url: 'https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf', page, section, license: 'CC-BY-4.0' });
export const srd521: Catalog = {
  edition: '2024', calculationSource: source(21, 'Ability Scores; Creating a Character (pp. 19–23)'),
  classes: [
    { id: '2024:fighter', name: 'Guerreiro', description: 'Domine a linha de frente com Força ou Destreza e técnica marcial.', hitDie: 10, saves: ['str', 'con'], skillCount: 2, skills: ['acrobatics', 'animal', 'athletics', 'history', 'insight', 'intimidation', 'persuasion', 'perception', 'survival'], pending: ['Escolher talento Estilo de Luta e maestrias de armas; registrar Segundo Fôlego.'], source: source(47, 'Fighter') },
    { id: '2024:rogue', name: 'Ladino', description: 'Destreza e perícias abrem portas onde outros só veem obstáculos.', hitDie: 8, saves: ['dex', 'int'], skillCount: 4, skills: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'persuasion', 'sleight', 'stealth'], pending: ['Escolher Especialização, idioma adicional e maestrias; registrar Ataque Furtivo e Gíria de Ladrões.'], source: source(61, 'Rogue') },
    { id: '2024:cleric', name: 'Clérigo', description: 'Empregue Sabedoria e magia divina para amparar seus companheiros.', hitDie: 8, saves: ['wis', 'cha'], skillCount: 2, skills: ['history', 'insight', 'medicine', 'persuasion', 'religion'], pending: ['Escolher Ordem Divina, aplicar seus efeitos e selecionar magias. Subclasse somente no nível 3.'], source: source(36, 'Cleric') },
    { id: '2024:wizard', name: 'Mago', description: 'Explore o poder arcano com Inteligência, pesquisa e um grimório.', hitDie: 6, saves: ['int', 'wis'], skillCount: 2, skills: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'nature', 'religion'], pending: ['Montar grimório e selecionar magias; registrar Adepto de Rituais e Recuperação Arcana.'], source: source(77, 'Wizard') },
  ],
  species: [
    { id: '2024:human', name: 'Humano', description: 'Adaptável e engenhoso. Os bônus de atributos vêm do antecedente.', bonuses: {}, speed: 30, hpPerLevel: 0, size: 'Pequeno ou Médio (pendente)', pending: ['Escolher tamanho, perícia e talento de Origem; registrar Inspiração Heroica após descanso longo.'], source: source(86, 'Human') },
    { id: '2024:dwarf', name: 'Anão', description: 'Robustez anã: +1 PV por nível, sem bônus racial de atributo.', bonuses: {}, speed: 30, hpPerLevel: 1, size: 'Médio', pending: ['Registrar visão no escuro de 120 pés, resiliência e percepção sísmica de Conhecimento de Pedras.'], source: source(84, 'Dwarf') },
    { id: '2024:halfling', name: 'Halfling', description: 'Pequeno, corajoso e naturalmente furtivo.', bonuses: {}, speed: 30, hpPerLevel: 0, size: 'Pequeno', pending: ['Registrar Bravura, Agilidade, Sorte e Furtividade Natural.'], source: source(86, 'Halfling') },
  ],
  backgrounds: [
    { id: '2024:acolyte', name: 'Acólito', description: 'Serviço e conhecimento religioso.', abilities: ['int', 'wis', 'cha'], skills: ['insight', 'religion'], pending: ['Aplicar Iniciado em Magia (Clérigo), suprimentos de calígrafo e equipamento.'], source: source(83, 'Acolyte') },
    { id: '2024:criminal', name: 'Criminoso', description: 'Experiência nas sombras e atenção ao perigo.', abilities: ['dex', 'con', 'int'], skills: ['sleight', 'stealth'], pending: ['Aplicar Alerta (inclui proficiência na iniciativa), ferramentas de ladrão e equipamento.'], source: source(83, 'Criminal') },
    { id: '2024:sage', name: 'Sábio', description: 'Anos de pesquisa e descobertas.', abilities: ['con', 'int', 'wis'], skills: ['arcana', 'history'], pending: ['Aplicar Iniciado em Magia (Mago), suprimentos de calígrafo e equipamento.'], source: source(83, 'Sage') },
    { id: '2024:soldier', name: 'Soldado', description: 'Disciplina e experiência na vida militar.', abilities: ['str', 'dex', 'con'], skills: ['athletics', 'intimidation'], pending: ['Aplicar Atacante Selvagem, escolher conjunto de jogos e equipamento.'], source: source(83, 'Soldier') },
  ],
};
