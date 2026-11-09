export const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;
export type Ability = typeof abilities[number];
export type Scores = Record<Ability, number>;
export type Edition = '2014' | '2024';
export const labels: Record<Ability, string> = { str: 'Força', dex: 'Destreza', con: 'Constituição', int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma' };
export const skillInfo = {
  acrobatics: ['Acrobacia', 'dex'], animal: ['Lidar com animais', 'wis'], arcana: ['Arcanismo', 'int'], athletics: ['Atletismo', 'str'], deception: ['Enganação', 'cha'], history: ['História', 'int'], insight: ['Intuição', 'wis'], intimidation: ['Intimidação', 'cha'], investigation: ['Investigação', 'int'], medicine: ['Medicina', 'wis'], nature: ['Natureza', 'int'], perception: ['Percepção', 'wis'], performance: ['Atuação', 'cha'], persuasion: ['Persuasão', 'cha'], religion: ['Religião', 'int'], sleight: ['Prestidigitação', 'dex'], stealth: ['Furtividade', 'dex'], survival: ['Sobrevivência', 'wis'],
} as const;
export type Skill = keyof typeof skillInfo;
export const allSkills = Object.keys(skillInfo) as Skill[];
export interface Source { edition: Edition; document: string; url: string; page: number; section: string; license: 'CC-BY-4.0' }
export interface RuleOption { id: string; name: string; description: string; source: Source }

/** Um traço, habilidade ou poder. `description` é resumo próprio em português. */
export interface Feature { level: number; name: string; description: string }
export interface Trait { name: string; description: string }

export type ArmorCategory = 'light' | 'medium' | 'heavy';
export type WeaponCategory = 'simple' | 'martial';
/** Propriedades de arma (chaves em inglês estáveis). */
export type WeaponProperty = 'ammunition' | 'finesse' | 'heavy' | 'light' | 'loading' | 'range' | 'reach' | 'special' | 'thrown' | 'two-handed' | 'versatile';
export interface WeaponProficiency { categories: WeaponCategory[]; /** Armas marciais liberadas se tiverem QUALQUER uma destas propriedades. */ martialWithProperty?: WeaponProperty[]; /** Armas específicas (ids de equipment.ts) além das categorias. */ weaponIds?: string[] }

export interface Weapon { id: string; name: string; category: WeaponCategory; melee: boolean; damage: string; damageType: string; versatile?: string; properties: WeaponProperty[]; range?: string; /** Maestria (SRD 5.2.1): id em `masteries`. */ mastery?: string; cost: string; weight: string; page: { '2014': number; '2024': number } }
export interface Armor { id: string; name: string; category: ArmorCategory | 'shield'; ac: number; /** Máximo do modificador de Destreza somado à CA (null = sem limite, 0 = nenhum). Escudo: 0. */ dexCap: number | null; stealthDisadvantage: boolean; strengthReq: number; cost: string; weight: string; page: { '2014': number; '2024': number } }
export interface Mastery { id: string; name: string; description: string }
export interface FightingStyle { id: string; name: string; description: string; /** Efeitos numéricos aplicados pelo motor. */ effects: { acWithArmor?: number; rangedAttack?: number; oneHandedDamage?: number }; page: number }
export interface Kit { id: string; name: string; description: string; /** id de armadura ('' = nenhuma). */ armor: string; shield: boolean; /** ids de armas. */ weapons: string[]; /** Demais itens, texto livre. */ gear: string[]; gp: number }

export interface Spellcasting {
  ability: Ability;
  caster: 'full' | 'half' | 'pact';
  /** Truques conhecidos por nível (20 posições, índice 0 = nível 1). */
  cantrips: number[];
  /** Magias preparadas/conhecidas por nível (20 posições). Vazio quando `formula` é usada. */
  spells: number[];
  /** 2014: preparadas = mod + nível (full) ou mod + metade do nível (half). */
  formula?: 'level+mod' | 'halfLevel+mod';
  kind: 'prepared' | 'known';
  focus: string;
  ritual: boolean;
  summary: string;
}
export interface SubclassEffects { hpPerLevel?: number; armorGrant?: ArmorCategory[]; /** CA sem armadura = valor + Destreza (feiticeiro dracônico). */ unarmoredBase?: number; /** CA sem armadura = 10 + Destreza + este atributo (Feitiçaria Dracônica 2024). */ unarmoredAbility?: Ability }
export interface Subclass { id: string; name: string; description: string; level: number; features: Feature[]; effects: SubclassEffects; source: Source }
export interface MasteryRule { counts: number[]; rule: string; categories: WeaponCategory[]; meleeOnly?: boolean; martialWithProperty?: WeaponProperty[] }

export interface ClassOption extends RuleOption {
  key: string;
  hitDie: number; saves: Ability[]; skillCount: number; skills: Skill[]; pending: string[];
  primary: Ability[]; primaryText: string;
  role: string;
  overview: string;
  playstyle: string[];
  abilityAdvice: Record<Ability, string>;
  /** Compra de 27 pontos recomendada (8–15, soma de custo = 27). */
  recommendedScores: Scores;
  recommendedSkills: Skill[];
  armorProf: ArmorCategory[]; shieldProf: boolean;
  weaponProf: WeaponProficiency;
  armorText: string; weaponText: string; toolText: string;
  kits: Kit[];
  features: Feature[];
  subclass: Subclass;
  spellcasting?: Spellcasting;
  fightingStyle?: { level: number; options: string[]; note?: string };
  mastery?: MasteryRule;
  /** Níveis em que há Aumento de Atributo. */
  asiLevels: number[];
  /** Cálculo especial de CA sem armadura. */
  unarmoredDefense?: 'barbarian' | 'monk';
  /** Chave da espécie (sufixo do id) → por que combina com esta classe. */
  speciesFit: Record<string, string>;
  /** Chave do antecedente → por que combina com esta classe. */
  backgroundFit: Record<string, string>;
}

export interface SpeciesVariant { id: string; name: string; description: string; bonuses?: Partial<Scores>; speed?: number; hpPerLevel?: number; traits: Trait[] }
export interface SpeciesOption extends RuleOption {
  key: string;
  bonuses: Partial<Scores>; speed: number; hpPerLevel: number; size: string;
  overview: string;
  traits: Trait[];
  languages: string;
  /** Ex.: linhagem, ancestral. Quando presente, é preciso escolher uma variante. */
  variantLabel?: string;
  variants?: SpeciesVariant[];
  /** Escolha de atributos livres (meio-elfo 2014). */
  abilityChoice?: { count: number; amount: number; exclude: Ability[] };
  /** Perícias livres ou restritas concedidas pela espécie. */
  skillChoice?: { count: number; from?: Skill[]; label: string };
  bestFor: string;
  pending: string[];
}
export interface BackgroundOption extends RuleOption {
  key: string;
  abilities: Ability[]; skills: Skill[];
  /** Antecedente livre: o jogador escolhe esta quantidade de perícias. */
  customSkills?: number;
  overview: string;
  tools: string;
  feat?: Trait;
  languages?: string;
  equipment: string;
  bestFor: string;
  pending: string[];
}
export interface Catalog { edition: Edition; classes: ClassOption[]; species: SpeciesOption[]; backgrounds: BackgroundOption[]; calculationSource: Source }

export interface Character {
  schemaVersion: 2; id: string; edition: Edition; name: string; level: number;
  classId: string; speciesId: string; backgroundId: string;
  scores: Scores; boosts: Scores;
  skills: Skill[];
  /** Tema narrativo do antecedente livre (2014). */
  backgroundTheme: string;
  variantId: string; speciesAbilities: Ability[]; speciesSkills: Skill[]; backgroundSkills: Skill[];
  asi: Scores;
  fightingStyleId: string; masteries: string[];
  kitId: string; armorId: string; shield: boolean; weaponIds: string[];
  notes: string; updatedAt: string;
}
export const zeros = (): Scores => ({ str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 });
