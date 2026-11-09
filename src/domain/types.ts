export const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;
export type Ability = typeof abilities[number];
export type Scores = Record<Ability, number>;
export type Edition = '2014' | '2024';
export const labels: Record<Ability, string> = { str: 'Força', dex: 'Destreza', con: 'Constituição', int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma' };
export const skillInfo = {
  acrobatics: ['Acrobacia', 'dex'], animal: ['Lidar com animais', 'wis'], arcana: ['Arcanismo', 'int'], athletics: ['Atletismo', 'str'], deception: ['Enganação', 'cha'], history: ['História', 'int'], insight: ['Intuição', 'wis'], intimidation: ['Intimidação', 'cha'], investigation: ['Investigação', 'int'], medicine: ['Medicina', 'wis'], nature: ['Natureza', 'int'], perception: ['Percepção', 'wis'], performance: ['Atuação', 'cha'], persuasion: ['Persuasão', 'cha'], religion: ['Religião', 'int'], sleight: ['Prestidigitação', 'dex'], stealth: ['Furtividade', 'dex'], survival: ['Sobrevivência', 'wis'],
} as const;
export type Skill = keyof typeof skillInfo;
export interface Source { edition: Edition; document: string; url: string; page: number; section: string; license: 'CC-BY-4.0' }
export interface RuleOption { id: string; name: string; description: string; source: Source }
export interface ClassOption extends RuleOption { hitDie: number; saves: Ability[]; skillCount: number; skills: Skill[]; pending: string[] }
export interface SpeciesOption extends RuleOption { bonuses: Partial<Scores>; speed: number; hpPerLevel: number; size: string; pending: string[] }
export interface BackgroundOption extends RuleOption { abilities: Ability[]; skills: Skill[]; pending: string[] }
export interface Catalog { edition: Edition; classes: ClassOption[]; species: SpeciesOption[]; backgrounds: BackgroundOption[]; calculationSource: Source }
export interface Character { schemaVersion: 1; id: string; edition: Edition; name: string; level: 1; classId: string; speciesId: string; backgroundId: string; scores: Scores; boosts: Scores; skills: Skill[]; notes: string; updatedAt: string }
export const zeros = (): Scores => ({ str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 });
