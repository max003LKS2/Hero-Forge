import type { Armor, Edition, FightingStyle, Mastery, Weapon, WeaponCategory, WeaponProperty } from '../domain/types';

/*
 * Equipamento — SRD 5.1 (2014) e SRD 5.2.1 (2024), CC-BY-4.0.
 * Onde as edições divergem, `damage`/`properties`/`versatile`/`weight` seguem o SRD 5.2.1 (2024).
 * Divergências materiais (2014 -> 2024):
 *  - Lança (lance): 1d12, Alcance/Especial -> 1d10, Pesada/Alcance/Duas mãos (exceto montado).
 *  - Tridente: Versátil 1d8 -> 1d10.
 *  - Martelo de guerra: 2 lb -> 5 lb.
 *  - Picareta de guerra: sem Versátil -> Versátil 1d10.
 *  - Rede (net): NÃO consta no SRD 5.2.1; valores de 2014 (sem Maestria; page 2024 = 0).
 *  - Armas 2014 não têm Maestria; Maestrias vêm apenas do SRD 5.2.1.
 * Pesos em libras ('lb'); custos em PO/PP/PC.
 */

type W = [id: string, name: string, category: WeaponCategory, melee: boolean, damage: string, damageType: string, properties: WeaponProperty[], mastery: string | undefined, weight: string, cost: string, extra?: { versatile?: string; range?: string }];

const p14 = 66;
const p24 = 91;
const raw: W[] = [
  // Simples corpo a corpo
  ['club', 'Clava', 'simple', true, '1d4', 'contundente', ['light'], 'slow', '2 lb', '1 PP'],
  ['dagger', 'Adaga', 'simple', true, '1d4', 'perfurante', ['finesse', 'light', 'thrown', 'range'], 'nick', '1 lb', '2 PO', { range: '20/60' }],
  ['greatclub', 'Clava grande', 'simple', true, '1d8', 'contundente', ['two-handed'], 'push', '10 lb', '2 PP'],
  ['handaxe', 'Machadinha', 'simple', true, '1d6', 'cortante', ['light', 'thrown', 'range'], 'vex', '2 lb', '5 PO', { range: '20/60' }],
  ['javelin', 'Azagaia', 'simple', true, '1d6', 'perfurante', ['thrown', 'range'], 'slow', '2 lb', '5 PP', { range: '30/120' }],
  ['light-hammer', 'Martelo leve', 'simple', true, '1d4', 'contundente', ['light', 'thrown', 'range'], 'nick', '2 lb', '2 PO', { range: '20/60' }],
  ['mace', 'Maça', 'simple', true, '1d6', 'contundente', [], 'sap', '4 lb', '5 PO'],
  ['quarterstaff', 'Bordão', 'simple', true, '1d6', 'contundente', ['versatile'], 'topple', '4 lb', '2 PP', { versatile: '1d8' }],
  ['sickle', 'Foice curta', 'simple', true, '1d4', 'cortante', ['light'], 'nick', '2 lb', '1 PO'],
  ['spear', 'Lança curta', 'simple', true, '1d6', 'perfurante', ['thrown', 'range', 'versatile'], 'sap', '3 lb', '1 PO', { versatile: '1d8', range: '20/60' }],
  // Simples à distância
  ['dart', 'Dardo', 'simple', false, '1d4', 'perfurante', ['finesse', 'thrown', 'range'], 'vex', '1/4 lb', '5 PC', { range: '20/60' }],
  ['light-crossbow', 'Besta leve', 'simple', false, '1d8', 'perfurante', ['ammunition', 'range', 'loading', 'two-handed'], 'slow', '5 lb', '25 PO', { range: '80/320' }],
  ['shortbow', 'Arco curto', 'simple', false, '1d6', 'perfurante', ['ammunition', 'range', 'two-handed'], 'vex', '2 lb', '25 PO', { range: '80/320' }],
  ['sling', 'Funda', 'simple', false, '1d4', 'contundente', ['ammunition', 'range'], 'slow', '—', '1 PP', { range: '30/120' }],
  // Marciais corpo a corpo
  ['battleaxe', 'Machado de batalha', 'martial', true, '1d8', 'cortante', ['versatile'], 'topple', '4 lb', '10 PO', { versatile: '1d10' }],
  ['flail', 'Mangual', 'martial', true, '1d8', 'contundente', [], 'sap', '2 lb', '10 PO'],
  ['glaive', 'Glaive', 'martial', true, '1d10', 'cortante', ['heavy', 'reach', 'two-handed'], 'graze', '6 lb', '20 PO'],
  ['greataxe', 'Machado grande', 'martial', true, '1d12', 'cortante', ['heavy', 'two-handed'], 'cleave', '7 lb', '30 PO'],
  ['greatsword', 'Montante', 'martial', true, '2d6', 'cortante', ['heavy', 'two-handed'], 'graze', '6 lb', '50 PO'],
  ['halberd', 'Alabarda', 'martial', true, '1d10', 'cortante', ['heavy', 'reach', 'two-handed'], 'cleave', '6 lb', '20 PO'],
  ['lance', 'Lança de montaria', 'martial', true, '1d10', 'perfurante', ['heavy', 'reach', 'two-handed'], 'topple', '6 lb', '10 PO'], // 2014: 1d12, Alcance/Especial
  ['longsword', 'Espada longa', 'martial', true, '1d8', 'cortante', ['versatile'], 'sap', '3 lb', '15 PO', { versatile: '1d10' }],
  ['maul', 'Malho', 'martial', true, '2d6', 'contundente', ['heavy', 'two-handed'], 'topple', '10 lb', '10 PO'],
  ['morningstar', 'Maça estrela', 'martial', true, '1d8', 'perfurante', [], 'sap', '4 lb', '15 PO'],
  ['pike', 'Pique', 'martial', true, '1d10', 'perfurante', ['heavy', 'reach', 'two-handed'], 'push', '18 lb', '5 PO'],
  ['rapier', 'Rapieira', 'martial', true, '1d8', 'perfurante', ['finesse'], 'vex', '2 lb', '25 PO'],
  ['scimitar', 'Cimitarra', 'martial', true, '1d6', 'cortante', ['finesse', 'light'], 'nick', '3 lb', '25 PO'],
  ['shortsword', 'Espada curta', 'martial', true, '1d6', 'perfurante', ['finesse', 'light'], 'vex', '2 lb', '10 PO'],
  ['trident', 'Tridente', 'martial', true, '1d8', 'perfurante', ['thrown', 'range', 'versatile'], 'topple', '4 lb', '5 PO', { versatile: '1d10', range: '20/60' }], // 2014: versátil 1d8
  ['war-pick', 'Picareta de guerra', 'martial', true, '1d8', 'perfurante', ['versatile'], 'sap', '2 lb', '5 PO', { versatile: '1d10' }], // 2014: sem versátil
  ['warhammer', 'Martelo de guerra', 'martial', true, '1d8', 'contundente', ['versatile'], 'push', '5 lb', '15 PO', { versatile: '1d10' }], // 2014: 2 lb
  ['whip', 'Chicote', 'martial', true, '1d4', 'cortante', ['finesse', 'reach'], 'slow', '3 lb', '2 PO'],
  // Marciais à distância
  ['blowgun', 'Zarabatana', 'martial', false, '1', 'perfurante', ['ammunition', 'range', 'loading'], 'vex', '1 lb', '10 PO', { range: '25/100' }],
  ['hand-crossbow', 'Besta de mão', 'martial', false, '1d6', 'perfurante', ['ammunition', 'range', 'light', 'loading'], 'vex', '3 lb', '75 PO', { range: '30/120' }],
  ['heavy-crossbow', 'Besta pesada', 'martial', false, '1d10', 'perfurante', ['ammunition', 'range', 'heavy', 'loading', 'two-handed'], 'push', '18 lb', '50 PO', { range: '100/400' }],
  ['longbow', 'Arco longo', 'martial', false, '1d8', 'perfurante', ['ammunition', 'range', 'heavy', 'two-handed'], 'slow', '2 lb', '50 PO', { range: '150/600' }],
];

export const weapons: Weapon[] = [
  ...raw.map(([id, name, category, melee, damage, damageType, properties, mastery, weight, cost, extra]): Weapon => ({
    id, name, category, melee, damage, damageType,
    ...(extra?.versatile ? { versatile: extra.versatile } : {}),
    properties,
    ...(extra?.range ? { range: extra.range } : {}),
    ...(mastery ? { mastery } : {}),
    cost, weight, page: { '2014': p14, '2024': p24 },
  })),
  // Rede: ausente no SRD 5.2.1 (valores do SRD 5.1; sem dano nem Maestria).
  { id: 'net', name: 'Rede', category: 'martial', melee: false, damage: '—', damageType: '—', properties: ['special', 'thrown', 'range'], range: '5/15', cost: '1 PO', weight: '3 lb', page: { '2014': 66, '2024': 0 } },
];

const a = (id: string, name: string, category: Armor['category'], ac: number, dexCap: number | null, stealthDisadvantage: boolean, strengthReq: number, cost: string, weight: string, p14: number): Armor =>
  ({ id, name, category, ac, dexCap, stealthDisadvantage, strengthReq, cost, weight, page: { '2014': p14, '2024': 92 } });

export const armors: Armor[] = [
  a('padded', 'Acolchoada', 'light', 11, null, true, 0, '5 PO', '8 lb', 63),
  a('leather', 'Couro', 'light', 11, null, false, 0, '10 PO', '10 lb', 64),
  a('studded-leather', 'Couro batido', 'light', 12, null, false, 0, '45 PO', '13 lb', 64),
  a('hide', 'Peles', 'medium', 12, 2, false, 0, '10 PO', '12 lb', 64),
  a('chain-shirt', 'Camisão de malha', 'medium', 13, 2, false, 0, '50 PO', '20 lb', 64),
  a('scale-mail', 'Brunea', 'medium', 14, 2, true, 0, '50 PO', '45 lb', 64),
  a('breastplate', 'Peitoral', 'medium', 14, 2, false, 0, '400 PO', '20 lb', 64),
  a('half-plate', 'Meia armadura', 'medium', 15, 2, true, 0, '750 PO', '40 lb', 64),
  a('ring-mail', 'Cota de anéis', 'heavy', 14, 0, true, 0, '30 PO', '40 lb', 64),
  a('chain-mail', 'Cota de malha', 'heavy', 16, 0, true, 13, '75 PO', '55 lb', 64),
  a('splint', 'Cota de talas', 'heavy', 17, 0, true, 15, '200 PO', '60 lb', 64),
  a('plate', 'Armadura de placas', 'heavy', 18, 0, true, 15, '1.500 PO', '65 lb', 64),
  a('shield', 'Escudo', 'shield', 2, 0, false, 0, '10 PO', '6 lb', 64),
];

export const masteries: Mastery[] = [
  { id: 'cleave', name: 'Racha', description: 'Ao acertar uma criatura com um ataque corpo a corpo com esta arma, você pode fazer outro ataque com ela contra uma segunda criatura a até 1,5 m da primeira e ao seu alcance. Se acertar, causa o dano da arma, sem somar o modificador de atributo (a menos que seja negativo). Apenas uma vez por turno.' },
  { id: 'graze', name: 'Raspão', description: 'Se o ataque com esta arma errar, você ainda causa à criatura dano igual ao modificador de atributo usado no ataque, do mesmo tipo da arma. Esse dano só aumenta se o modificador aumentar.' },
  { id: 'nick', name: 'Talho', description: 'Ao fazer o ataque extra da propriedade Leve, você pode fazê-lo como parte da ação Atacar, em vez de como Ação Bônus. Só pode ser usado uma vez por turno.' },
  { id: 'push', name: 'Empurrar', description: 'Ao acertar uma criatura com esta arma, você pode empurrá-la até 3 m em linha reta para longe de você, se ela for Grande ou menor.' },
  { id: 'sap', name: 'Enfraquecer', description: 'Ao acertar uma criatura com esta arma, ela tem Desvantagem na próxima jogada de ataque que fizer antes do início do seu próximo turno.' },
  { id: 'slow', name: 'Lentidão', description: 'Ao acertar uma criatura e causar dano com esta arma, você pode reduzir o Deslocamento dela em 3 m até o início do seu próximo turno. Múltiplos acertos não reduzem mais de 3 m no total.' },
  { id: 'topple', name: 'Derrubar', description: 'Ao acertar uma criatura com esta arma, você pode forçá-la a fazer um teste de resistência de Constituição (CD 8 + modificador de atributo do ataque + bônus de proficiência). Em caso de falha, a criatura fica Caída.' },
  { id: 'vex', name: 'Importunar', description: 'Ao acertar uma criatura e causar dano com esta arma, você tem Vantagem na sua próxima jogada de ataque contra ela antes do fim do seu próximo turno.' },
];

export const fightingStyles: Record<Edition, FightingStyle[]> = {
  '2014': [
    { id: 'archery', name: 'Arquearia', description: 'Você recebe +2 nas jogadas de ataque com armas à distância.', effects: { rangedAttack: 2 }, page: 24 },
    { id: 'defense', name: 'Defesa', description: 'Enquanto estiver usando armadura, você recebe +1 na CA.', effects: { acWithArmor: 1 }, page: 24 },
    { id: 'dueling', name: 'Duelismo', description: 'Ao empunhar uma arma corpo a corpo em uma mão e nenhuma outra arma, você recebe +2 nas jogadas de dano com ela.', effects: { oneHandedDamage: 2 }, page: 24 },
    { id: 'great-weapon-fighting', name: 'Combate com Arma Grande', description: 'Ao tirar 1 ou 2 em um dado de dano de ataque corpo a corpo com arma empunhada com duas mãos, você pode rolar o dado novamente e deve usar o novo resultado. A arma precisa ter a propriedade Duas mãos ou Versátil.', effects: {}, page: 24 },
    { id: 'protection', name: 'Proteção', description: 'Quando uma criatura que você vê ataca um alvo diferente de você a até 1,5 m, você pode usar sua reação para impor Desvantagem à jogada de ataque. Exige empunhar um escudo.', effects: {}, page: 24 },
    { id: 'two-weapon-fighting', name: 'Combate com Duas Armas', description: 'Ao lutar com duas armas, você pode somar seu modificador de atributo ao dano do segundo ataque.', effects: {}, page: 24 },
  ],
  '2024': [
    { id: 'archery', name: 'Arquearia', description: 'Talento de Estilo de Luta: você recebe +2 nas jogadas de ataque feitas com armas à distância.', effects: { rangedAttack: 2 }, page: 87 },
    { id: 'defense', name: 'Defesa', description: 'Talento de Estilo de Luta: enquanto usar armadura Leve, Média ou Pesada, você recebe +1 na CA.', effects: { acWithArmor: 1 }, page: 88 },
    { id: 'great-weapon-fighting', name: 'Combate com Arma Grande', description: 'Talento de Estilo de Luta: ao rolar dano de um ataque corpo a corpo com arma empunhada com duas mãos, você pode tratar qualquer 1 ou 2 nos dados de dano como 3. A arma precisa ter a propriedade Duas mãos ou Versátil.', effects: {}, page: 88 },
    { id: 'two-weapon-fighting', name: 'Combate com Duas Armas', description: 'Talento de Estilo de Luta: ao fazer o ataque extra de uma arma com a propriedade Leve, você pode somar seu modificador de atributo ao dano desse ataque, se ainda não o estiver somando.', effects: {}, page: 88 },
  ],
};
