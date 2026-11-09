import { describe, expect, it } from 'vitest';
import { catalogs } from '../data/catalog';
import { abilities, zeros, type Character } from './types';
import { creationErrors, derive, integrityErrors, modifier, newCharacter, pointSpend } from './engine';
export function fixture(edition: '2014' | '2024' = '2024'): Character {
  return { ...newCharacter(edition), name: 'Aurora', classId: `${edition}:fighter`, speciesId: edition === '2024' ? '2024:dwarf' : '2014:hill-dwarf', backgroundId: `${edition}:acolyte`, scores: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 }, boosts: edition === '2024' ? { ...zeros(), wis: 2, cha: 1 } : zeros(), skills: ['athletics', 'perception'] };
}
describe('compra de atributos', () => {
  it.each([[8, 0], [9, 1], [10, 2], [11, 3], [12, 4], [13, 5], [14, 7], [15, 9]])('custo %i = %i', (score, cost) => { expect(pointSpend({ str: score, dex: 8, con: 8, int: 8, wis: 8, cha: 8 })).toBe(cost); });
  it('soma 27 para 15/14/13/12/10/8', () => expect(pointSpend(fixture().scores)).toBe(27));
  it.each([7, 16, 10.5, NaN, Infinity])('rejeita valor %s', value => expect(() => pointSpend({ ...fixture().scores, str: value })).toThrow());
  it('rejeita compra acima de 27', () => expect(integrityErrors({ ...fixture(), scores: { str: 15, dex: 15, con: 15, int: 15, wis: 15, cha: 15 } })).toContain('A compra ultrapassa 27 pontos.'));
});
describe('regras separadas', () => {
  it.each(['2014', '2024'] as const)('catálogo %s não referencia opções de outra edição', edition => { const cat = catalogs[edition]; for (const o of [...cat.classes, ...cat.species, ...cat.backgrounds]) { expect(o.id.startsWith(`${edition}:`)).toBe(true); expect(o.source.edition).toBe(edition); expect(o.source.license).toBe('CC-BY-4.0'); expect(o.source.page).toBeGreaterThan(0); } });
  it('não aplica bônus de espécie em 2024', () => { const d = derive(fixture()); expect(d.scores.con).toBe(13); expect(d.scores.wis).toBe(12); expect(d.hp).toBe(12); expect(d.speed).toBe(30); });
  it('aplica bônus racial e robustez em 2014', () => { const d = derive(fixture('2014')); expect(d.scores.con).toBe(15); expect(d.scores.wis).toBe(11); expect(d.hp).toBe(13); expect(d.speed).toBe(25); });
  it('humano 2014 aumenta os seis atributos', () => { const c = { ...fixture('2014'), speciesId: '2014:human' }; const d = derive(c); for (const a of abilities) expect(d.scores[a]).toBe(c.scores[a] + 1); });
  it('bloqueia contaminação cruzada', () => expect(() => derive({ ...fixture(), classId: '2014:fighter' })).toThrow('incompatível'));
  it('bloqueia bônus de antecedente em 2014', () => expect(integrityErrors({ ...fixture('2014'), boosts: { ...zeros(), str: 1 } }).length).toBeGreaterThan(0));
  it('aceita +1/+1/+1 em atributos permitidos', () => expect(creationErrors({ ...fixture(), boosts: { ...zeros(), int: 1, wis: 1, cha: 1 } })).toEqual([]));
  it('rejeita bônus fora do antecedente e +2/+2', () => { expect(integrityErrors({ ...fixture(), boosts: { ...zeros(), str: 2, cha: 1 } }).length).toBeGreaterThan(0); expect(integrityErrors({ ...fixture(), boosts: { ...zeros(), wis: 2, cha: 2 } }).length).toBeGreaterThan(0); });
});
describe('valores derivados e escolhas', () => {
  it.each([[8, -1], [9, -1], [10, 0], [11, 0], [15, 2], [17, 3]])('modificador %i = %i', (score, result) => expect(modifier(score)).toBe(result));
  it('calcula salvaguardas, perícias, CA e percepção', () => { const d = derive(fixture()); expect(d.saves.str).toBe(4); expect(d.saves.dex).toBe(2); expect(d.skills.athletics).toBe(4); expect(d.skills.insight).toBe(3); expect(d.passivePerception).toBe(13); expect(d.baseAC).toBe(12); expect(d.baseInitiative).toBe(2); });
  it('permite somente quantidade e opções da classe', () => { expect(integrityErrors({ ...fixture(), skills: ['arcana'] }).length).toBeGreaterThan(0); expect(integrityErrors({ ...fixture(), skills: ['athletics', 'athletics'] }).length).toBeGreaterThan(0); expect(integrityErrors({ ...fixture(), skills: ['insight', 'athletics'] }).length).toBeGreaterThan(0); });
  it('detecta rascunho incompleto', () => expect(creationErrors(newCharacter()).length).toBeGreaterThan(4));
  it.each(['2014', '2024'] as const)('base preenchida %s passa validação', edition => expect(creationErrors(fixture(edition))).toEqual([]));
});
