import { describe, expect, it } from 'vitest';
import { catalogs } from './catalog';
import { armors, fightingStyles, masteries, weapons } from './equipment';
import { abilities, allSkills } from '../domain/types';
import { pointCosts } from '../domain/engine';

const editions = ['2014', '2024'] as const;
const classKeys = ['barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'];
describe.each(editions)('catálogo %s', edition => {
  const cat = catalogs[edition];
  it('tem as 12 classes do SRD', () => expect(cat.classes.map(c => c.key).sort()).toEqual([...classKeys].sort()));
  it('ids únicos, prefixados e com fonte coerente', () => {
    const all = [...cat.classes, ...cat.species, ...cat.backgrounds];
    expect(new Set(all.map(o => o.id)).size).toBe(all.length);
    for (const o of all) { expect(o.id.startsWith(`${edition}:`)).toBe(true); expect(o.id).toBe(`${edition}:${o.key}`); expect(o.source.edition).toBe(edition); expect(o.source.license).toBe('CC-BY-4.0'); expect(o.source.page).toBeGreaterThan(0); expect(o.description.length).toBeGreaterThan(10); }
  });
  it.each(classKeys)('classe %s: dados consistentes', key => {
    const c = cat.classes.find(x => x.key === key)!;
    expect(c.skills.every(s => allSkills.includes(s))).toBe(true);
    expect(c.recommendedSkills).toHaveLength(c.skillCount);
    expect(c.recommendedSkills.every(s => c.skills.includes(s))).toBe(true);
    expect(abilities.reduce((n, a) => n + pointCosts[c.recommendedScores[a]], 0)).toBe(27);
    expect(abilities.every(a => c.abilityAdvice[a].length > 40)).toBe(true);
    expect(c.overview.length).toBeGreaterThan(80);
    expect(c.playstyle.length).toBeGreaterThanOrEqual(3);
    // Poderes cobrem o nível 1 e há uma entrada de subclasse no nível correto.
    expect(c.features.some(f => f.level === 1)).toBe(true);
    expect(c.features.every(f => f.level >= 1 && f.level <= 20 && f.description.length > 10)).toBe(true);
    expect(c.subclass.features.length).toBeGreaterThan(0);
    expect(c.subclass.features.every(f => f.level >= c.subclass.level)).toBe(true);
    expect(c.asiLevels).toContain(4);
    expect(c.kits.length).toBeGreaterThan(0);
    for (const k of c.kits) { if (k.armor) expect(armors.find(a => a.id === k.armor && a.category !== 'shield'), `${c.id} ${k.id}`).toBeTruthy(); for (const w of k.weapons) expect(weapons.find(x => x.id === w), `${c.id} ${k.id} ${w}`).toBeTruthy(); }
    if (c.fightingStyle) for (const o of c.fightingStyle.options) expect(fightingStyles[edition].some(s => s.id === o), `${c.id} ${o}`).toBe(true);
    if (c.spellcasting) { expect(c.spellcasting.cantrips).toHaveLength(20); if (!c.spellcasting.formula) expect(c.spellcasting.spells).toHaveLength(20); }
    if (c.mastery) expect(c.mastery.counts).toHaveLength(20);
    if (edition === '2014') expect(c.mastery).toBeUndefined();
    for (const k of Object.keys(c.speciesFit)) expect(cat.species.some(s => s.key === k), `${c.id} speciesFit ${k}`).toBe(true);
    for (const k of Object.keys(c.backgroundFit)) expect(cat.backgrounds.some(b => b.key === k), `${c.id} backgroundFit ${k}`).toBe(true);
  });
  it('espécies e antecedentes bem formados', () => {
    for (const s of cat.species) { expect(s.traits.length).toBeGreaterThan(0); expect(s.overview.length).toBeGreaterThan(40); if (edition === '2024') expect(s.bonuses).toEqual({}); for (const v of s.variants ?? []) expect(v.id.length).toBeGreaterThan(0); }
    for (const b of cat.backgrounds) { expect(b.overview.length).toBeGreaterThan(40); expect(b.skills.length + (b.customSkills ?? 0)).toBe(2); }
  });
});
describe('equipamento', () => {
  it('ids únicos e maestrias existentes', () => {
    expect(new Set(weapons.map(w => w.id)).size).toBe(weapons.length);
    expect(new Set(armors.map(a => a.id)).size).toBe(armors.length);
    for (const w of weapons) if (w.mastery) expect(masteries.some(m => m.id === w.mastery)).toBe(true);
  });
  it('2014 não tem Maestria de Arma e 2024 não mistura estilos', () => { expect(fightingStyles['2014'].length).toBe(6); expect(fightingStyles['2024'].every(s => s.id && s.description)).toBe(true); });
});
