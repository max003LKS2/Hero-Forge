import { z } from 'zod';
import { abilities, skillInfo, type Character } from '../domain/types';
import { integrityErrors } from '../domain/engine';
const scoreSchema = (min: number, max: number) => z.strictObject(Object.fromEntries(abilities.map(a => [a, z.number().int().min(min).max(max)])) as Record<typeof abilities[number], z.ZodNumber>);
const schema = z.strictObject({ schemaVersion: z.literal(1), id: z.uuid(), edition: z.enum(['2014', '2024']), name: z.string().max(80), level: z.literal(1), classId: z.string().max(80), speciesId: z.string().max(80), backgroundId: z.string().max(80), scores: scoreSchema(8, 15), boosts: scoreSchema(0, 2), skills: z.array(z.enum(Object.keys(skillInfo) as [keyof typeof skillInfo, ...(keyof typeof skillInfo)[]])).max(4), notes: z.string().max(4000), updatedAt: z.iso.datetime() });
export const STORAGE_KEY = 'forja-de-herois.characters.v1';
export const MAX_IMPORT_BYTES = 100_000;
export function parseCharacter(value: unknown): Character {
  const result = schema.safeParse(value);
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
