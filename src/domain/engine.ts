import { catalogs } from '../data/catalog';
import { abilities, zeros, skillInfo, type Scores, type Character, type Edition, type Skill } from './types';
export const pointCosts: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
export const modifier = (score: number) => Math.floor((score - 10) / 2);
export const signed = (value: number) => value >= 0 ? `+${value}` : String(value);
export function pointSpend(scores: Scores) {
  if (abilities.some(a => !Number.isInteger(scores[a]) || !(scores[a] in pointCosts))) throw new Error('Atributos base devem ser inteiros entre 8 e 15.');
  return abilities.reduce((total, a) => total + pointCosts[scores[a]], 0);
}
export function newCharacter(edition: Edition = '2024'): Character {
  return { schemaVersion: 1, id: crypto.randomUUID(), edition, name: '', level: 1, classId: '', speciesId: '', backgroundId: '', scores: { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 }, boosts: zeros(), skills: [], notes: '', updatedAt: new Date().toISOString() };
}
export function selections(c: Character) {
  const catalog = catalogs[c.edition];
  return { catalog, cls: catalog.classes.find(x => x.id === c.classId), species: catalog.species.find(x => x.id === c.speciesId), background: catalog.backgrounds.find(x => x.id === c.backgroundId) };
}
// Drafts may be incomplete, but never contain a foreign rule or an illegal numerical choice.
export function integrityErrors(c: Character): string[] {
  const errors: string[] = [];
  const { cls, species, background } = selections(c);
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
  if (new Set(c.skills).size !== c.skills.length) errors.push('Perícias repetidas.');
  if (c.skills.length > (cls?.skillCount ?? 0) || c.skills.some(s => !cls?.skills.includes(s))) errors.push('Perícias de classe inválidas.');
  if (c.skills.some(s => background?.skills.includes(s))) errors.push('Escolha perícias de classe diferentes das concedidas pelo antecedente.');
  return errors;
}
export function creationErrors(c: Character): string[] {
  const { cls, species, background } = selections(c);
  const errors = integrityErrors(c);
  if (!c.name.trim()) errors.push('Dê um nome ao personagem.');
  if (!cls) errors.push('Escolha uma classe.');
  if (!species) errors.push('Escolha uma raça ou espécie.');
  if (!background) errors.push('Escolha um antecedente.');
  if (pointSpend(c.scores) < 27) errors.push(`Distribua os ${27 - pointSpend(c.scores)} pontos restantes.`);
  if (c.edition === '2024' && abilities.reduce((n, a) => n + c.boosts[a], 0) !== 3) errors.push('Distribua os 3 pontos do antecedente: +2/+1 ou +1/+1/+1.');
  if (cls && c.skills.length !== cls.skillCount) errors.push(`Escolha ${cls.skillCount} perícias de classe.`);
  return errors;
}
export function derive(c: Character) {
  const errors = integrityErrors(c);
  if (errors.length) throw new Error(errors.join(' '));
  const { cls, species, background } = selections(c);
  const scores = { ...c.scores };
  for (const a of abilities) scores[a] += c.edition === '2014' ? (species?.bonuses[a] ?? 0) : c.boosts[a];
  const mods = Object.fromEntries(abilities.map(a => [a, modifier(scores[a])])) as Scores;
  const proficiency = 2; // Only level 1 is accepted by the persistence schema and UI.
  const trained = new Set<Skill>([...(background?.skills ?? []), ...c.skills]);
  const skills = Object.fromEntries(Object.entries(skillInfo).map(([key, [, ability]]) => [key, mods[ability] + (trained.has(key as Skill) ? proficiency : 0)])) as Record<Skill, number>;
  const saves = Object.fromEntries(abilities.map(a => [a, mods[a] + (cls?.saves.includes(a) ? proficiency : 0)])) as Scores;
  return { scores, mods, proficiency, skills, saves, trained, hp: cls && species ? cls.hitDie + mods.con + species.hpPerLevel : null, baseAC: 10 + mods.dex, baseInitiative: mods.dex, passivePerception: 10 + skills.perception, speed: species?.speed ?? null };
}
export function pendingRules(c: Character): string[] {
  const { cls, species, background } = selections(c);
  return [...(cls?.pending ?? []), ...(species?.pending ?? []), ...(background?.pending ?? []), ...(c.edition === '2024' ? ['Escolher dois idiomas além de Comum.'] : []), 'Equipamentos, ataques, magias, talentos e efeitos situacionais ainda exigem revisão no SRD. A CA e a iniciativa exibidas são valores base, sem esses efeitos.'];
}
