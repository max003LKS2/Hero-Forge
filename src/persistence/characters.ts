import { z } from 'zod';
import { abilities, allSkills, zeros, type Character } from '../domain/types';
import { integrityErrors } from '../domain/engine';
const scoreSchema = (min: number, max: number) => z.strictObject(Object.fromEntries(abilities.map(a => [a, z.number().int().min(min).max(max)])) as Record<typeof abilities[number], z.ZodNumber>);
const skill = z.enum(allSkills as [typeof allSkills[number], ...typeof allSkills]);
const ability = z.enum(abilities);
const id = z.string().max(80);
const fields = {
  id: z.uuid(), edition: z.enum(['2014', '2024']), name: z.string().max(80), level: z.number().int().min(1).max(20),
  classId: id, speciesId: id, backgroundId: id, scores: scoreSchema(8, 15), boosts: scoreSchema(0, 2),
  skills: z.array(skill).max(4), notes: z.string().max(4000), updatedAt: z.iso.datetime(),
};
const schemaV1 = z.strictObject({ schemaVersion: z.literal(1), ...fields, level: z.literal(1) });
const schemaV2 = z.strictObject({
  schemaVersion: z.literal(2), ...fields,
  backgroundTheme: id, variantId: id, speciesAbilities: z.array(ability).max(3), speciesSkills: z.array(skill).max(3), backgroundSkills: z.array(skill).max(3),
  asi: scoreSchema(0, 12), fightingStyleId: id, masteries: z.array(id).max(6), kitId: id, armorId: id, shield: z.boolean(), weaponIds: z.array(id).max(6),
});
export const STORAGE_KEY = 'forja-de-herois.characters.v1';
export const MAX_IMPORT_BYTES = 100_000;
/** Personagens salvos na versão 1 (nível 1, sem equipamento) são migrados sem perder escolhas. */
function migrate(value: unknown): unknown {
  const v1 = schemaV1.safeParse(value);
  if (!v1.success) return value;
  return { ...v1.data, schemaVersion: 2, backgroundTheme: '', variantId: '', speciesAbilities: [], speciesSkills: [], backgroundSkills: [], asi: zeros(), fightingStyleId: '', masteries: [], kitId: '', armorId: '', shield: false, weaponIds: [] };
}
export function parseCharacter(value: unknown): Character {
  const result = schemaV2.safeParse(migrate(value));
  if (!result.success) throw new Error('Arquivo incompatível: confira a versão, os campos e os limites do personagem.');
  const c = result.data as Character;
  const errors = integrityErrors(c);
  if (errors.length) throw new Error(errors.join(' '));
  return c;
}
export function importCharacter(text: string): Character {
  if (new TextEncoder().encode(text).length > MAX_IMPORT_BYTES) throw new Error('O arquivo excede 100 KB.');
  let value: unknown;
  try { value = JSON.parse(text); } catch { throw new Error('O arquivo não contém JSON válido.'); }
  return parseCharacter(value);
}
export function readLibrary(storage: Pick<Storage, 'getItem'>): Character[] {
  const text = storage.getItem(STORAGE_KEY);
  if (!text) return [];
  if (text.length > 5_000_000) throw new Error('Biblioteca local muito grande. Faça uma cópia antes de recuperar os dados.');
  const value: unknown = JSON.parse(text);
  if (!Array.isArray(value) || value.length > 100) throw new Error('Biblioteca inválida. Os dados originais foram preservados.');
  return value.map(parseCharacter);
}
export function saveCharacter(storage: Pick<Storage, 'getItem' | 'setItem'>, c: Character): Character[] {
  const valid = parseCharacter(c);
  const library = readLibrary(storage);
  const next = [valid, ...library.filter(x => x.id !== valid.id)];
  if (next.length > 100) throw new Error('Limite de 100 personagens. Exporte uma cópia para guardar seus personagens.');
  storage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
export function downloadJson(c: Character) {
  const blob = new Blob([JSON.stringify(parseCharacter(c), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `forja-${c.id}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
