import { describe, expect, it } from 'vitest';
import { catalogs } from '../data/catalog';
import { abilities, zeros, type Character } from './types';
import { creationErrors, derive, integrityErrors, modifier, newCharacter, pointSpend, proficiencyBonus, sanitize } from './engine';
export function fixture(edition: '2014' | '2024' = '2024'): Character {
  return { ...newCharacter(edition), name: 'Aurora', classId: `${edition}:fighter`, speciesId: edition === '2024' ? '2024:dwarf' : '2014:hill-dwarf', backgroundId: `${edition}:acolyte`, scores: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 }, boosts: edition === '2024' ? { ...zeros(), wis: 2, cha: 1 } : zeros(), skills: ['athletics', 'perception'], fightingStyleId: 'defense', masteries: edition === '2024' ? ['longsword', 'greatsword', 'flail'] : [] };
}
const withGear = (c: Character, patch: Partial<Character>): Character => ({ ...c, ...patch });
describe('nível, PV e proficiência', () => {
  it.each([[1, 2], [4, 2], [5, 3], [9, 4], [13, 5], [17, 6], [20, 6]])('nível %i = proficiência +%i', (level, bonus) => expect(proficiencyBonus(level)).toBe(bonus));
  it('PV: dado máximo no 1º nível e média nos demais', () => {
    const base = fixture('2024');
    expect(derive({ ...base, level: 1 }).hp).toBe(12);
    // d10: média 6 + Con (+1) = 7 por nível, mais 1 de robustez anã por nível.
    expect(derive({ ...base, level: 5, asi: zeros() }).hp).toBe(12 + 4 * 7 + 4 * 1);
  });
  it('recusa nível fora de 1–20', () => { expect(integrityErrors({ ...fixture(), level: 0 }).length).toBeGreaterThan(0); expect(integrityErrors({ ...fixture(), level: 21 }).length).toBeGreaterThan(0); });
  it('aumentos de atributo respeitam o nível e o teto de 20', () => {
    expect(integrityErrors({ ...fixture(), asi: { ...zeros(), str: 2 } }).length).toBeGreaterThan(0);
    const lvl4 = { ...fixture(), level: 4 };
    expect(integrityErrors({ ...lvl4, asi: { ...zeros(), str: 2 } })).toEqual([]);
    expect(derive({ ...lvl4, asi: { ...zeros(), str: 2 } }).scores.str).toBe(17);
    expect(integrityErrors({ ...lvl4, asi: { ...zeros(), str: 3 } }).length).toBeGreaterThan(0);
  });
  it('sanitize remove escolhas que deixaram de valer ao reduzir o nível', () => { const high = { ...fixture(), level: 4, asi: { ...zeros(), str: 2 } }; expect(sanitize({ ...high, level: 1 }).asi).toEqual(zeros()); });
});
describe('CA, ataques e estilo de luta', () => {
  it('armadura pesada ignora Destreza; escudo +2; Defesa +1 só com armadura', () => {
    const c = withGear(fixture('2024'), { armorId: 'chain-mail', shield: true });
    expect(derive(c).ac).toBe(16 + 2 + 1);
    expect(derive(withGear(c, { armorId: '', shield: false })).ac).toBe(12);
  });
  it('armadura média limita Destreza a +2', () => { const c = withGear({ ...fixture('2014'), scores: { str: 8, dex: 15, con: 8, int: 8, wis: 8, cha: 8 }, fightingStyleId: '' }, { armorId: 'breastplate' }); expect(derive(c).ac).toBe(14 + 2); });
  it('Bárbaro sem armadura soma Constituição; Monge soma Sabedoria', () => {
    const barb: Character = { ...fixture('2024'), classId: '2024:barbarian', skills: ['athletics', 'perception'], fightingStyleId: '', masteries: ['greataxe', 'handaxe'] };
    expect(derive(barb).ac).toBe(10 + 2 + 1);
    const monk: Character = { ...fixture('2024'), classId: '2024:monk', skills: ['athletics', 'acrobatics'], fightingStyleId: '', masteries: [] };
    expect(derive(monk).ac).toBe(10 + 2 + 1); // Sabedoria 12 (+2 do antecedente) = +1
  });
  it('ataque usa Força, Acuidade escolhe o melhor, arco usa Destreza + Arquearia', () => {
    const c = withGear({ ...fixture('2024'), fightingStyleId: 'archery', masteries: [] }, { weaponIds: ['longsword', 'rapier', 'longbow'] });
    const [sword, rapier, bow] = derive(c).attacks;
    expect(sword.bonus).toBe(4); expect(rapier.bonus).toBe(4); // Força +2 e Destreza +2: empate favorece Força
    expect(rapier.ability).toBe('str');
    expect(bow.ability).toBe('dex'); expect(bow.bonus).toBe(2 + 2 + 2);
  });
  it('sem proficiência não soma bônus', () => { const wiz: Character = { ...fixture('2024'), classId: '2024:wizard', skills: ['arcana', 'history'], fightingStyleId: '', masteries: [], weaponIds: ['greatsword'] }; expect(derive(wiz).attacks[0].proficient).toBe(false); });
  it('exige estilo de luta e maestrias para concluir', () => {
    expect(creationErrors({ ...fixture('2024'), fightingStyleId: '' })).toContain('Escolha um estilo de luta.');
    expect(creationErrors({ ...fixture('2024'), masteries: [] }).join()).toContain('maestria');
    expect(integrityErrors({ ...fixture('2014'), masteries: ['longsword'] }).length).toBeGreaterThan(0);
  });
});
describe('conjuração', () => {
  it('Mago nível 1 e 5 (2024)', () => {
    const wiz: Character = { ...fixture('2024'), classId: '2024:wizard', skills: ['arcana', 'history'], fightingStyleId: '', masteries: [], scores: { str: 8, dex: 14, con: 14, int: 15, wis: 8, cha: 8 } };
    const s1 = derive(wiz).spellcasting!; expect(s1.cantrips).toBe(3); expect(s1.prepared).toBe(4); expect(s1.slots).toEqual([2]); expect(s1.dc).toBe(8 + 2 + derive(wiz).mods.int);
    expect(derive({ ...wiz, level: 5 }).spellcasting!.slots).toEqual([4, 3, 2]);
  });
  it('meio-conjuradores 2014 só conjuram a partir do 2º nível', () => {
    const pal: Character = { ...fixture('2014'), classId: '2014:paladin', skills: ['athletics', 'intimidation'], fightingStyleId: '' };
    expect(derive(pal).spellcasting!.slots).toEqual([]); expect(derive({ ...pal, level: 2, fightingStyleId: '' }).spellcasting!.slots).toEqual([2]);
  });
  it('Bruxo usa Magia de Pacto', () => { const wl: Character = { ...fixture('2024'), classId: '2024:warlock', skills: ['arcana', 'history'], fightingStyleId: '', masteries: [] }; expect(derive(wl).spellcasting!.pact).toEqual({ count: 1, level: 1 }); });
});
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
