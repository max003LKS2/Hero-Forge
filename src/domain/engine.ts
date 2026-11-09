import { catalogs } from '../data/catalog';
import { armors, fightingStyles, masteries, weapons } from '../data/equipment';
import { themeIds } from '../data/themes';
import { abilities, allSkills, labels, skillInfo, zeros, type Ability, type ArmorCategory, type Character, type ClassOption, type Edition, type Feature, type Kit, type Scores, type Skill, type Trait, type Weapon } from './types';

export const pointCosts: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
export const MAX_LEVEL = 20;
export const MAX_WEAPONS = 6;
export const modifier = (score: number) => Math.floor((score - 10) / 2);
export const signed = (value: number) => value >= 0 ? `+${value}` : String(value);
export const proficiencyBonus = (level: number) => Math.floor((level - 1) / 4) + 2;
export function pointSpend(scores: Scores) {
  if (abilities.some(a => !Number.isInteger(scores[a]) || !(scores[a] in pointCosts))) throw new Error('Atributos base devem ser inteiros entre 8 e 15.');
  return abilities.reduce((total, a) => total + pointCosts[scores[a]], 0);
}
export function newCharacter(edition: Edition = '2024'): Character {
  return { schemaVersion: 2, id: crypto.randomUUID(), edition, name: '', level: 1, classId: '', speciesId: '', backgroundId: '', scores: { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 }, boosts: zeros(), skills: [], backgroundTheme: '', variantId: '', speciesAbilities: [], speciesSkills: [], backgroundSkills: [], asi: zeros(), fightingStyleId: '', masteries: [], kitId: '', armorId: '', shield: false, weaponIds: [], notes: '', updatedAt: new Date().toISOString() };
}
export const weaponById = (id: string) => weapons.find(w => w.id === id);
export const armorById = (id: string) => armors.find(a => a.id === id && a.category !== 'shield');
export const shieldItem = () => armors.find(a => a.id === 'shield');
export const masteryById = (id: string) => masteries.find(m => m.id === id);

export function selections(c: Character) {
  const catalog = catalogs[c.edition];
  const cls = catalog.classes.find(x => x.id === c.classId);
  const species = catalog.species.find(x => x.id === c.speciesId);
  const background = catalog.backgrounds.find(x => x.id === c.backgroundId);
  const variant = species?.variants?.find(v => v.id === c.variantId);
  const subclass = cls && c.level >= cls.subclass.level ? cls.subclass : undefined;
  const style = fightingStyles[c.edition].find(s => s.id === c.fightingStyleId);
  return { catalog, cls, species, background, variant, subclass, style };
}

// ---- Conjuração -----------------------------------------------------------
const fullSlots: number[][] = [[2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1]];
// Meio-conjuradores: tabela comum a 2014 (a partir do nível 2) e 2024 (a partir do nível 1).
const halfSlots: number[][] = [[2], [2], [3], [3], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3, 2], [4, 3, 2], [4, 3, 3], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2]];
const pactTable: Array<[number, number]> = [[1, 1], [2, 1], [2, 2], [2, 2], [2, 3], [2, 3], [2, 4], [2, 4], [2, 5], [2, 5], [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [4, 5], [4, 5], [4, 5], [4, 5]];
export function spellSlots(cls: ClassOption, level: number, edition: Edition): { slots: number[]; pact?: { count: number; level: number } } {
  const sc = cls.spellcasting;
  if (!sc) return { slots: [] };
  if (sc.caster === 'pact') { const [count, lvl] = pactTable[level - 1]; return { slots: [], pact: { count, level: lvl } }; }
  if (sc.caster === 'full') return { slots: fullSlots[level - 1] };
  if (edition === '2014' && level < 2) return { slots: [] };
  return { slots: halfSlots[level - 1] };
}
export function preparedCount(cls: ClassOption, level: number, mod: number, edition: Edition): number {
  const sc = cls.spellcasting;
  if (!sc) return 0;
  if (sc.formula === 'level+mod') return Math.max(1, mod + level);
  if (sc.formula === 'halfLevel+mod') return edition === '2014' && level < 2 ? 0 : Math.max(1, mod + Math.floor(level / 2));
  return sc.spells[level - 1] ?? 0;
}

// ---- Proficiência com armas -----------------------------------------------
export function weaponProficient(cls: ClassOption | undefined, w: Weapon): boolean {
  if (!cls) return false;
  const p = cls.weaponProf;
  if (p.weaponIds?.includes(w.id) || p.categories.includes(w.category)) return true;
  return w.category === 'martial' && Boolean(p.martialWithProperty?.some(prop => w.properties.includes(prop)));
}
export function masteryEligible(cls: ClassOption | undefined, w: Weapon): boolean {
  const rule = cls?.mastery;
  if (!rule || !w.mastery) return false;
  if (rule.meleeOnly && !w.melee) return false;
  if (rule.categories.includes(w.category)) return true;
  return w.category === 'martial' && Boolean(rule.martialWithProperty?.some(prop => w.properties.includes(prop)));
}
export const masteryCount = (cls: ClassOption | undefined, level: number) => cls?.mastery?.counts[level - 1] ?? 0;
export const asiSlots = (cls: ClassOption | undefined, level: number) => cls ? cls.asiLevels.filter(l => l <= level).length : 0;

function speciesBonus(c: Character, a: Ability): number {
  const { species, variant } = selections(c);
  if (c.edition !== '2014') return 0;
  return (species?.bonuses[a] ?? 0) + (variant?.bonuses?.[a] ?? 0) + (c.speciesAbilities.includes(a) ? species?.abilityChoice?.amount ?? 0 : 0);
}
const backgroundBonus = (c: Character, a: Ability) => c.edition === '2024' ? c.boosts[a] : 0;
export const totalScore = (c: Character, a: Ability) => c.scores[a] + speciesBonus(c, a) + backgroundBonus(c, a) + c.asi[a];

// ---- Validação ------------------------------------------------------------
// Rascunhos podem estar incompletos, mas nunca contêm regra estrangeira ou escolha numérica ilegal.
export function integrityErrors(c: Character): string[] {
  const errors: string[] = [];
  const { cls, species, background, variant, style } = selections(c);
  if (!Number.isInteger(c.level) || c.level < 1 || c.level > MAX_LEVEL) errors.push('Nível deve estar entre 1 e 20.');
  if (c.classId && !cls) errors.push('Classe incompatível com a edição.');
  if (c.speciesId && !species) errors.push('Origem incompatível com a edição.');
  if (c.backgroundId && !background) errors.push('Antecedente incompatível com a edição.');
  try { if (pointSpend(c.scores) > 27) errors.push('A compra ultrapassa 27 pontos.'); } catch { errors.push('Atributos base inválidos.'); }
  const values = abilities.map(a => c.boosts[a]);
  if (values.some(v => !Number.isInteger(v) || v < 0 || v > 2)) errors.push('Bônus inválidos.');
  if (c.edition === '2014' && values.some(Boolean)) errors.push('2014 não aceita bônus de antecedente.');
  if (c.edition === '2024') {
    if (abilities.some(a => c.boosts[a] && !background?.abilities.includes(a))) errors.push('Bônus fora dos atributos do antecedente.');
    if (values.reduce((a, b) => a + b, 0) > 3 || values.filter(v => v === 2).length > 1) errors.push('Distribuição de bônus inválida.');
  }
  // Espécie
  if (c.variantId && !variant) errors.push('Variante incompatível com a espécie.');
  if (c.speciesAbilities.length) {
    const choice = species?.abilityChoice;
    if (!choice || c.speciesAbilities.length > choice.count || new Set(c.speciesAbilities).size !== c.speciesAbilities.length || c.speciesAbilities.some(a => choice.exclude.includes(a))) errors.push('Atributos da espécie inválidos.');
  }
  const sChoice = species?.skillChoice;
  if (c.speciesSkills.length && (!sChoice || c.speciesSkills.length > sChoice.count || new Set(c.speciesSkills).size !== c.speciesSkills.length || c.speciesSkills.some(s => sChoice.from && !sChoice.from.includes(s)))) errors.push('Perícias da espécie inválidas.');
  // Antecedente
  if (c.backgroundSkills.length && (!background?.customSkills || c.backgroundSkills.length > background.customSkills || new Set(c.backgroundSkills).size !== c.backgroundSkills.length || c.backgroundSkills.some(s => background.skills.includes(s)))) errors.push('Perícias do antecedente inválidas.');
  if (c.backgroundTheme && (!background?.customSkills || !themeIds.has(c.backgroundTheme))) errors.push('Tema de antecedente inválido.');
  // Perícias de classe
  const taken = [...(background?.skills ?? []), ...c.backgroundSkills, ...c.speciesSkills];
  if (new Set(c.skills).size !== c.skills.length) errors.push('Perícias repetidas.');
  if (c.skills.length > (cls?.skillCount ?? 0) || c.skills.some(s => !cls?.skills.includes(s))) errors.push('Perícias de classe inválidas.');
  if (c.skills.some(s => taken.includes(s))) errors.push('Escolha perícias de classe diferentes das já concedidas por antecedente ou espécie.');
  if (new Set([...c.backgroundSkills, ...c.speciesSkills, ...(background?.skills ?? [])]).size !== c.backgroundSkills.length + c.speciesSkills.length + (background?.skills.length ?? 0)) errors.push('Perícias duplicadas entre espécie e antecedente.');
  // Aumentos de atributo
  const budget = asiSlots(cls, c.level) * 2;
  const spent = abilities.reduce((n, a) => n + c.asi[a], 0);
  if (abilities.some(a => !Number.isInteger(c.asi[a]) || c.asi[a] < 0) || spent > budget) errors.push('Aumentos de atributo acima do permitido para o nível.');
  if (abilities.some(a => totalScore(c, a) > 20)) errors.push('Nenhum atributo pode passar de 20.');
  // Combate
  if (c.fightingStyleId) {
    const fs = cls?.fightingStyle;
    if (!fs || !style || !fs.options.includes(c.fightingStyleId) || c.level < fs.level) errors.push('Estilo de luta inválido para a classe ou o nível.');
  }
  if (new Set(c.masteries).size !== c.masteries.length) errors.push('Maestrias repetidas.');
  if (c.masteries.length > masteryCount(cls, c.level)) errors.push('Maestrias acima do permitido.');
  if (c.masteries.some(id => { const w = weaponById(id); return !w || !masteryEligible(cls, w); })) errors.push('Maestria em arma não permitida pela classe.');
  if (c.kitId && !cls?.kits.some(k => k.id === c.kitId)) errors.push('Kit incompatível com a classe.');
  if (c.armorId && !armorById(c.armorId)) errors.push('Armadura desconhecida.');
  if (c.weaponIds.length > MAX_WEAPONS || new Set(c.weaponIds).size !== c.weaponIds.length || c.weaponIds.some(id => !weaponById(id))) errors.push('Armas inválidas.');
  return errors;
}
export function creationErrors(c: Character): string[] {
  const { cls, species, background, style } = selections(c);
  const errors = integrityErrors(c);
  if (!c.name.trim()) errors.push('Dê um nome ao personagem.');
  if (!cls) errors.push('Escolha uma classe.');
  if (!species) errors.push('Escolha uma raça ou espécie.');
  else {
    if (species.variants?.length && !c.variantId) errors.push(`Escolha: ${species.variantLabel ?? 'variante'}.`);
    if (species.abilityChoice && c.speciesAbilities.length !== species.abilityChoice.count) errors.push(`Escolha ${species.abilityChoice.count} atributos para a espécie.`);
    if (species.skillChoice && c.speciesSkills.length !== species.skillChoice.count) errors.push(`Escolha ${species.skillChoice.count} perícia(s) da espécie.`);
  }
  if (!background) errors.push('Escolha um antecedente.');
  else if (background.customSkills && c.backgroundSkills.length !== background.customSkills) errors.push(`Escolha ${background.customSkills} perícias do antecedente.`);
  if (pointSpend(c.scores) < 27) errors.push(`Distribua os ${27 - pointSpend(c.scores)} pontos restantes.`);
  if (c.edition === '2024' && abilities.reduce((n, a) => n + c.boosts[a], 0) !== 3) errors.push('Distribua os 3 pontos do antecedente: +2/+1 ou +1/+1/+1.');
  if (cls && c.skills.length !== cls.skillCount) errors.push(`Escolha ${cls.skillCount} perícias de classe.`);
  if (cls?.fightingStyle && c.level >= cls.fightingStyle.level && !style) errors.push('Escolha um estilo de luta.');
  if (cls && c.masteries.length !== masteryCount(cls, c.level)) errors.push(`Escolha ${masteryCount(cls, c.level)} maestria(s) de arma.`);
  return errors;
}

/** Remove escolhas que deixaram de valer após uma mudança de nível, classe ou edição. */
export function sanitize(c: Character): Character {
  const { cls, species, background } = selections(c);
  const next = { ...c };
  const uniq = <T,>(list: T[]) => [...new Set(list)];
  // Espécie
  if (!species?.variants?.some(v => v.id === c.variantId)) next.variantId = '';
  const ac = species?.abilityChoice;
  next.speciesAbilities = ac ? uniq(c.speciesAbilities).filter(a => !ac.exclude.includes(a)).slice(0, ac.count) : [];
  const sc = species?.skillChoice;
  next.speciesSkills = sc ? uniq(c.speciesSkills).filter(s => (!sc.from || sc.from.includes(s)) && !background?.skills.includes(s)).slice(0, sc.count) : [];
  // Antecedente
  if (c.edition === '2024') for (const a of abilities) if (!background?.abilities.includes(a)) next.boosts = { ...next.boosts, [a]: 0 };
  next.backgroundSkills = background?.customSkills ? uniq(c.backgroundSkills).filter(s => !background.skills.includes(s) && !next.speciesSkills.includes(s)).slice(0, background.customSkills) : [];
  if (!background?.customSkills) next.backgroundTheme = '';
  // Perícias de classe: nunca repetem as de espécie/antecedente.
  const taken = new Set<Skill>([...(background?.skills ?? []), ...next.backgroundSkills, ...next.speciesSkills]);
  next.skills = cls ? uniq(c.skills).filter(s => cls.skills.includes(s) && !taken.has(s)).slice(0, cls.skillCount) : [];
  if (!cls?.kits.some(k => k.id === c.kitId)) next.kitId = '';
  if (!cls?.fightingStyle || c.level < cls.fightingStyle.level || !cls.fightingStyle.options.includes(c.fightingStyleId)) next.fightingStyleId = '';
  next.masteries = c.masteries.filter(id => { const w = weaponById(id); return w && masteryEligible(cls, w); }).slice(0, masteryCount(cls, c.level));
  const budget = asiSlots(cls, c.level) * 2;
  if (abilities.reduce((n, a) => n + c.asi[a], 0) > budget) next.asi = zeros();
  if (abilities.some(a => totalScore(next, a) > 20)) next.asi = zeros();
  return next;
}

// ---- Derivação -------------------------------------------------------------
export function applyKit(c: Character, kit: Kit): Character {
  return { ...c, kitId: kit.id, armorId: kit.armor, shield: kit.shield, weaponIds: [...new Set(kit.weapons)].slice(0, MAX_WEAPONS) };
}
export interface AttackRow { id: string; name: string; bonus: number; damage: string; damageType: string; versatile?: string; proficient: boolean; ability: Ability; mastery?: string; notes: string[] }
export function derive(c: Character) {
  const errors = integrityErrors(c);
  if (errors.length) throw new Error(errors.join(' '));
  const { cls, species, background, variant, subclass, style } = selections(c);
  const proficiency = proficiencyBonus(c.level);
  const scores = Object.fromEntries(abilities.map(a => [a, totalScore(c, a)])) as Scores;
  const mods = Object.fromEntries(abilities.map(a => [a, modifier(scores[a])])) as Scores;
  const trained = new Set<Skill>([...(background?.skills ?? []), ...c.backgroundSkills, ...c.speciesSkills, ...c.skills]);
  const skills = Object.fromEntries(allSkills.map(key => [key, mods[skillInfo[key][1]] + (trained.has(key) ? proficiency : 0)])) as Record<Skill, number>;
  const saves = Object.fromEntries(abilities.map(a => [a, mods[a] + (cls?.saves.includes(a) ? proficiency : 0)])) as Scores;

  // Pontos de vida: dado máximo no nível 1; média arredondada para cima nos demais.
  const perLevelFlat = (species?.hpPerLevel ?? 0) + (variant?.hpPerLevel ?? 0) + (subclass?.effects.hpPerLevel ?? 0);
  const hp = cls && species ? cls.hitDie + mods.con + Math.max(0, c.level - 1) * Math.max(1, Math.floor(cls.hitDie / 2) + 1 + mods.con) + c.level * perLevelFlat : null;

  // Proficiências e CA
  const armorProf = new Set<ArmorCategory>([...(cls?.armorProf ?? []), ...(subclass?.effects.armorGrant ?? [])]);
  const armor = armorById(c.armorId);
  const shield = c.shield ? shieldItem() : undefined;
  const warnings: string[] = [];
  let ac = 10 + mods.dex; let acNote = 'Sem armadura: 10 + Destreza.';
  if (armor) {
    const dexPart = armor.dexCap === null ? mods.dex : armor.dexCap === 0 ? 0 : Math.min(mods.dex, armor.dexCap);
    ac = armor.ac + dexPart; acNote = `${armor.name}: ${armor.ac}${dexPart ? ` ${signed(dexPart)} Destreza` : ''}.`;
    if (armor.category !== 'shield' && !armorProf.has(armor.category)) warnings.push(`Sem proficiência em armadura ${armor.name}: desvantagem em testes, ataques e salvaguardas de Força/Destreza e sem conjurar magias.`);
    if (armor.strengthReq && scores.str < armor.strengthReq) warnings.push(`${armor.name} exige Força ${armor.strengthReq}: deslocamento reduzido em 10 pés.`);
    if (armor.stealthDisadvantage) warnings.push(`${armor.name} impõe desvantagem em Furtividade.`);
  } else {
    const options: Array<[number, string]> = [[10 + mods.dex, 'Sem armadura: 10 + Destreza.']];
    if (cls?.unarmoredDefense === 'barbarian') options.push([10 + mods.dex + mods.con, 'Defesa sem Armadura (Bárbaro): 10 + Des + Con.']);
    if (cls?.unarmoredDefense === 'monk' && !shield) options.push([10 + mods.dex + mods.wis, 'Defesa sem Armadura (Monge): 10 + Des + Sab.']);
    if (subclass?.effects.unarmoredBase) options.push([subclass.effects.unarmoredBase + mods.dex, `Resiliência Dracônica: ${subclass.effects.unarmoredBase} + Destreza.`]);
    if (subclass?.effects.unarmoredAbility) options.push([10 + mods.dex + mods[subclass.effects.unarmoredAbility], `Resiliência Dracônica: 10 + Des + ${labels[subclass.effects.unarmoredAbility]}.`]);
    [ac, acNote] = options.reduce((best, o) => o[0] > best[0] ? o : best);
  }
  if (shield) { ac += shield.ac; acNote += ` Escudo ${signed(shield.ac)}.`; if (!cls?.shieldProf) warnings.push('Sem proficiência com escudos.'); }
  if (armor && style?.effects.acWithArmor) { ac += style.effects.acWithArmor; acNote += ` ${style.name} ${signed(style.effects.acWithArmor)}.`; }

  // Ataques
  const attacks: AttackRow[] = c.weaponIds.map(id => {
    const w = weaponById(id)!;
    const ability: Ability = w.properties.includes('finesse') ? (mods.dex > mods.str ? 'dex' : 'str') : w.melee ? 'str' : 'dex';
    const proficient = weaponProficient(cls, w);
    const notes: string[] = [];
    let bonus = mods[ability] + (proficient ? proficiency : 0);
    if (!w.melee && style?.effects.rangedAttack) { bonus += style.effects.rangedAttack; notes.push(`${style.name} ${signed(style.effects.rangedAttack)} no ataque`); }
    let dmgMod = mods[ability];
    if (w.melee && !w.properties.includes('two-handed') && style?.effects.oneHandedDamage) { dmgMod += style.effects.oneHandedDamage; notes.push(`${style.name} ${signed(style.effects.oneHandedDamage)} no dano (uma arma em uma mão)`); }
    if (!proficient) notes.push('sem proficiência: sem bônus de proficiência');
    return { id, name: w.name, bonus, damage: `${w.damage}${dmgMod ? signed(dmgMod) : ''}`, damageType: w.damageType, versatile: w.versatile ? `${w.versatile}${dmgMod ? signed(dmgMod) : ''}` : undefined, proficient, ability, mastery: c.masteries.includes(id) ? masteryById(w.mastery ?? '')?.name : undefined, notes };
  });

  // Conjuração
  const sc = cls?.spellcasting;
  const spellcasting = cls && sc ? { ability: sc.ability, dc: 8 + proficiency + mods[sc.ability], attack: proficiency + mods[sc.ability], cantrips: sc.cantrips[c.level - 1] ?? 0, prepared: preparedCount(cls, c.level, mods[sc.ability], c.edition), ...spellSlots(cls, c.level, c.edition) } : null;

  // Poderes e traços
  const classFeatures: Feature[] = cls ? cls.features.filter(f => f.level <= c.level) : [];
  const subclassFeatures: Feature[] = subclass ? subclass.features.filter(f => f.level <= c.level) : [];
  const speciesTraits: Trait[] = [...(species?.traits ?? []), ...(variant?.traits ?? [])];
  const alert = c.edition === '2024' && background?.key === 'criminal';
  const baseInitiative = mods.dex + (alert ? proficiency : 0);
  const speed = variant?.speed ?? species?.speed ?? null;
  const asiBudget = asiSlots(cls, c.level) * 2;
  return { scores, mods, proficiency, skills, saves, trained, hp, ac, acNote, baseAC: ac, baseInitiative, initiative: baseInitiative, passivePerception: 10 + skills.perception, speed, warnings, attacks, spellcasting, classFeatures, subclassFeatures, speciesTraits, asiBudget, asiSpent: abilities.reduce((n, a) => n + c.asi[a], 0), hitDice: cls ? `${c.level}d${cls.hitDie}` : '—', alert };
}
export function pendingRules(c: Character): string[] {
  const { cls, species, background } = selections(c);
  const out = [...(cls?.pending ?? []), ...(species?.pending ?? []), ...(background?.pending ?? [])];
  if (cls?.spellcasting) out.push('Escolher as magias específicas (truques e magias de círculo) consultando a lista da classe no SRD; esta versão mostra quantas você conhece/prepara e seus espaços, mas ainda não cataloga as magias.');
  if (cls && asiSlots(cls, c.level) > 0) out.push('Talentos podem substituir um Aumento de Atributo; esta versão só aplica o aumento de atributos.');
  if (c.edition === '2024') out.push('Escolher dois idiomas além de Comum.');
  out.push('Equipamento além de armas e armaduras, ferramentas, talentos e efeitos situacionais devem ser conferidos no SRD. A CA e os ataques mostrados consideram apenas armadura, escudo, estilo de luta e características de CA da classe.');
  return out;
}
