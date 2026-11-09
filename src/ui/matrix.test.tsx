import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { catalogs } from '../data/catalog';
import { applyKit, creationErrors, derive, integrityErrors, masteryCount, masteryEligible, newCharacter, sanitize } from '../domain/engine';
import { weapons } from '../data/equipment';
import { createCharacterPdf } from '../export/pdf';
import { parseCharacter } from '../persistence/characters';
import { allSkills, type Character, type Edition } from '../domain/types';
import { AbilitiesStep, BackgroundStep, ClassStep, CombatStep, SheetSummary, SkillsStep, SpeciesStep } from './steps';

function build(edition: Edition, classId: string, level: number, speciesIndex = 0): Character {
  const cat = catalogs[edition];
  const cls = cat.classes.find(c => c.id === classId)!;
  const species = cat.species[speciesIndex % cat.species.length];
  const bg = cat.backgrounds[0];
  let c: Character = { ...newCharacter(edition), name: 'Teste', level, classId, speciesId: species.id, backgroundId: bg.id, scores: cls.recommendedScores };
  if (species.variants?.length) c.variantId = species.variants[0].id;
  if (species.abilityChoice) c.speciesAbilities = (['str', 'dex', 'con', 'int', 'wis'] as const).filter(a => !species.abilityChoice!.exclude.includes(a)).slice(0, species.abilityChoice.count);
  const taken = new Set<string>(bg.skills);
  if (species.skillChoice) { c.speciesSkills = (species.skillChoice.from ?? allSkills).filter(s => !taken.has(s)).slice(0, species.skillChoice.count); c.speciesSkills.forEach(s => taken.add(s)); }
  if (bg.customSkills) { c.backgroundSkills = allSkills.filter(s => !taken.has(s)).slice(0, bg.customSkills); c.backgroundSkills.forEach(s => taken.add(s)); }
  if (edition === '2024') c.boosts = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0, [bg.abilities[0]]: 2, [bg.abilities[1]]: 1 } as Character['boosts'];
  c.skills = cls.skills.filter(s => !taken.has(s)).slice(0, cls.skillCount);
  if (cls.fightingStyle && level >= cls.fightingStyle.level) c.fightingStyleId = cls.fightingStyle.options[0];
  const n = masteryCount(cls, level);
  c.masteries = weapons.filter(w => masteryEligible(cls, w)).slice(0, n).map(w => w.id);
  c = applyKit(c, cls.kits[0]);
  c.masteries = c.masteries.filter(() => true);
  return sanitize(c);
}

describe.each(['2014', '2024'] as const)('matriz %s', edition => {
  for (const cls of catalogs[edition].classes) for (const level of [1, 5, 11, 20]) {
    it(`${cls.key} nível ${level}`, () => {
      const c = build(edition, cls.id, level, level);
      expect(integrityErrors(c)).toEqual([]);
      expect(creationErrors(c)).toEqual([]);
      const d = derive(c);
      expect(d.hp).toBeGreaterThan(0);
      expect(d.ac).toBeGreaterThanOrEqual(8);
      expect(d.classFeatures.length).toBeGreaterThan(0);
      if (cls.spellcasting && !(edition === '2014' && cls.spellcasting.caster === 'half' && level < 2)) expect(d.spellcasting!.slots.length + (d.spellcasting!.pact?.count ?? 0)).toBeGreaterThan(0);
      expect(parseCharacter(JSON.parse(JSON.stringify(c)))).toEqual(c);
      expect(createCharacterPdf(c).getNumberOfPages()).toBeGreaterThan(1);
      const props = { c, patch: () => undefined, derived: d };
      for (const Step of [ClassStep, SpeciesStep, BackgroundStep, AbilitiesStep, SkillsStep, CombatStep]) expect(renderToString(<Step {...props} />).length).toBeGreaterThan(100);
      expect(renderToString(<SheetSummary c={c} derived={d} />)).toContain('Pontos de Vida');
    });
  }
  it('todas as espécies e variantes geram personagens válidos', () => {
    const cat = catalogs[edition];
    cat.species.forEach((s, i) => { const variants = s.variants?.length ? s.variants : [undefined]; for (const v of variants) { const c = { ...build(edition, cat.classes[0].id, 1, i), variantId: v?.id ?? '' }; expect(integrityErrors(c), s.id).toEqual([]); expect(derive(c).speed).toBeGreaterThan(0); } });
  });
});
