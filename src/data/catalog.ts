import { classes2014a } from './classes2014a';
import { classes2014b } from './classes2014b';
import { classes2024a } from './classes2024a';
import { classes2024b } from './classes2024b';
import { backgrounds2014, species2014 } from './origins2014';
import { backgrounds2024, species2024 } from './origins2024';
import type { Catalog, Edition, Source } from '../domain/types';
const calc = (edition: Edition): Source => edition === '2014'
  ? { edition, document: 'SRD 5.1', url: 'https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf', page: 76, section: 'Ability Scores and Modifiers; Proficiency Bonus', license: 'CC-BY-4.0' }
  : { edition, document: 'SRD 5.2.1', url: 'https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf', page: 21, section: 'Ability Scores; Creating a Character (pp. 19–23)', license: 'CC-BY-4.0' };
const byName = <T extends { name: string }>(list: T[]) => [...list].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
export const catalogs: Record<Edition, Catalog> = {
  '2014': { edition: '2014', calculationSource: calc('2014'), classes: byName([...classes2014a, ...classes2014b]), species: byName(species2014), backgrounds: backgrounds2014 },
  '2024': { edition: '2024', calculationSource: calc('2024'), classes: byName([...classes2024a, ...classes2024b]), species: byName(species2024), backgrounds: backgrounds2024 },
};
export const attribution51 = 'This work includes material taken from the System Reference Document 5.1 (“SRD 5.1”) by Wizards of the Coast LLC and available at https://dnd.wizards.com/resources/systems-reference-document. The SRD 5.1 is licensed under the Creative Commons Attribution 4.0 International License available at https://creativecommons.org/licenses/by/4.0/legalcode.';
export const attribution521 = 'This work includes material from the System Reference Document 5.2.1 (“SRD 5.2.1”) by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at https://creativecommons.org/licenses/by/4.0/legalcode.';
