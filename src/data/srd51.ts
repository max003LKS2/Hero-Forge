import type { Catalog, Source } from '../domain/types';
const source = (page: number, section: string): Source => ({ edition: '2014', document: 'SRD 5.1', url: 'https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf', page, section, license: 'CC-BY-4.0' });
export const srd51: Catalog = {
  edition: '2014', calculationSource: source(76, 'Ability Scores and Modifiers; Proficiency Bonus'),
  classes: [
    { id: '2014:fighter', name: 'Guerreiro', description: 'A linha de frente é o seu lugar. Força ou Destreza guiam suas armas.', hitDie: 10, saves: ['str', 'con'], skillCount: 2, skills: ['acrobatics', 'animal', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival'], pending: ['Escolher Estilo de Luta; registrar Segundo Fôlego.'], source: source(24, 'Fighter') },
    { id: '2014:rogue', name: 'Ladino', description: 'Precisão, astúcia e um talento para encontrar caminhos inesperados.', hitDie: 8, saves: ['dex', 'int'], skillCount: 4, skills: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleight', 'stealth'], pending: ['Escolher Especialização; registrar Ataque Furtivo, Gíria de Ladrões e ferramentas.'], source: source(39, 'Rogue') },
    { id: '2014:cleric', name: 'Clérigo', description: 'Sabedoria e devoção conduzem sua magia e seu apoio ao grupo.', hitDie: 8, saves: ['wis', 'cha'], skillCount: 2, skills: ['history', 'insight', 'medicine', 'persuasion', 'religion'], pending: ['Aplicar Domínio da Vida e suas proficiências; selecionar e preparar magias.'], source: source(15, 'Cleric') },
    { id: '2014:wizard', name: 'Mago', description: 'Transforme estudo em magia. A Inteligência é sua principal ferramenta.', hitDie: 6, saves: ['int', 'wis'], skillCount: 2, skills: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'religion'], pending: ['Montar grimório, escolher truques e preparar magias; registrar Recuperação Arcana.'], source: source(52, 'Wizard') },
  ],
  species: [
    { id: '2014:human', name: 'Humano', description: 'Versatilidade: +1 em cada atributo.', bonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 }, speed: 30, hpPerLevel: 0, size: 'Médio', pending: ['Idiomas: Comum e um adicional à escolha.'], source: source(6, 'Human') },
    { id: '2014:hill-dwarf', name: 'Anão da colina', description: 'Resiliência: +2 Constituição, +1 Sabedoria e +1 PV por nível.', bonuses: { con: 2, wis: 1 }, speed: 25, hpPerLevel: 1, size: 'Médio', pending: ['Registrar visão no escuro, resiliência, treinamento em combate, ferramenta e conhecimento de pedras; idiomas Comum e Anão.'], source: source(3, 'Dwarf; Hill Dwarf (p. 4)') },
    { id: '2014:lightfoot', name: 'Halfling pés-leves', description: 'Agilidade discreta: +2 Destreza e +1 Carisma.', bonuses: { dex: 2, cha: 1 }, speed: 25, hpPerLevel: 0, size: 'Pequeno', pending: ['Registrar Sorte, Bravura, Agilidade e Furtividade Natural; idiomas Comum e Halfling.'], source: source(5, 'Halfling; Lightfoot (p. 6)') },
  ],
  backgrounds: [{ id: '2014:acolyte', name: 'Acólito', description: 'Uma vida dedicada ao serviço de um templo. Não concede bônus de atributo.', abilities: [], skills: ['insight', 'religion'], pending: ['Escolher dois idiomas e registrar Abrigo dos Fiéis e equipamento de antecedente.'], source: source(60, 'Acolyte') }],
};
