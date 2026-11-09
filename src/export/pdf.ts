import { jsPDF } from 'jspdf';
import { attribution51, attribution521 } from '../data/catalog';
import { creationErrors, derive, pendingRules, selections, signed, weaponById } from '../domain/engine';
import { abilities, allSkills, labels, skillInfo, type Character } from '../domain/types';
import { parseCharacter } from '../persistence/characters';

// A Helvetica embutida suporta português (WinAnsi). O JSON preserva Unicode completo;
// caracteres fora do repertório do PDF são substituídos por um marcador visível.
const printable = (text: string) => text.normalize('NFC').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[–—]/g, '-').replace(/[●✓]/gu, '*').replace(/[^\x20-\x7e\xa0-\xff\n]/gu, '?');
export function createCharacterPdf(input: Character): jsPDF {
  const c = parseCharacter(input);
  const d = derive(c);
  const { cls, species, background, catalog, subclass, variant, style } = selections(c);
  const doc = new jsPDF({ format: 'a4', unit: 'mm', compress: true });
  doc.setProperties({ title: `Forja de Heróis - ${printable(c.name)}`, subject: `Ficha provisória de nível ${c.level}`, creator: 'Forja de Heróis' });
  let y = 22;
  const line = (text: string, size = 10, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(size);
    const rows: string[] = doc.splitTextToSize(printable(text), 174);
    const height = rows.length * (size * 0.45 + 1.4) + 2;
    if (height < 250 && y + height > 274) { doc.addPage(); y = 22; }
    for (const row of rows) { if (y > 274) { doc.addPage(); y = 22; } doc.text(row, 18, y); y += size * 0.45 + 1.4; }
    y += 2;
  };
  const section = (title: string) => { if (y > 250) { doc.addPage(); y = 22; } y += 3; line(title, 12, true); };
  const grid = (items: string[]) => {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    for (let i = 0; i < items.length; i += 2) {
      if (y > 270) { doc.addPage(); y = 22; }
      doc.text(printable(items[i]), 18, y);
      if (items[i + 1]) doc.text(printable(items[i + 1]), 108, y);
      y += 8;
    }
    y += 2;
  };
  line('FORJA DE HERÓIS', 22, true);
  line('FICHA PROVISÓRIA - conferir pendências antes de jogar', 10, true);
  line(c.name || 'Herói sem nome', 18, true);
  line(`Edição ${c.edition} | ${c.edition === '2014' ? 'SRD 5.1' : 'SRD 5.2.1'} | Nível ${c.level}`);
  line(`${cls?.name ?? 'Classe pendente'}${subclass ? ` (${subclass.name})` : ''} | ${species?.name ?? 'Origem pendente'}${variant ? ` (${variant.name})` : ''} | ${background?.name ?? 'Antecedente pendente'}`);
  section('ATRIBUTOS');
  grid(abilities.map(a => `${labels[a]}: ${d.scores[a]} (${signed(d.mods[a])}) | base ${c.scores[a]} | bônus ${signed(d.scores[a] - c.scores[a])}`));
  section('VALORES');
  line(`PV: ${d.hp ?? '-'} | Dado de Vida: ${d.hitDice} | Proficiência: ${signed(d.proficiency)}`);
  line(`CA: ${d.ac} (${d.acNote}) | Iniciativa: ${signed(d.initiative)} | Deslocamento: ${d.speed ?? '-'} pés`);
  line(`Tamanho: ${species?.size ?? '-'} | Percepção passiva: ${d.passivePerception}`);
  for (const w of d.warnings) line(`Atenção: ${w}`, 8);
  if (style) line(`Estilo de luta: ${style.name}`);
  section('ATAQUES');
  if (d.attacks.length) for (const a of d.attacks) line(`${a.name}: ${signed(a.bonus)} para atingir | dano ${a.damage} ${a.damageType}${a.versatile ? ` (duas mãos ${a.versatile})` : ''}${a.mastery ? ` | Maestria: ${a.mastery}` : ''}${a.notes.length ? ` | ${a.notes.join('; ')}` : ''}`, 9);
  else line('Nenhuma arma selecionada.', 9);
  if (c.masteries.length) line(`Maestrias: ${c.masteries.map(id => weaponById(id)?.name).join(', ')}`, 9);
  if (d.spellcasting) {
    const s = d.spellcasting;
    section('MAGIA');
    line(`Atributo: ${labels[s.ability]} | CD ${s.dc} | Ataque mágico ${signed(s.attack)} | Truques: ${s.cantrips} | Magias ${cls?.spellcasting?.kind === 'known' ? 'conhecidas' : 'preparadas'}: ${s.prepared}`, 9);
    line(s.pact ? `Magia de Pacto: ${s.pact.count} espaço(s) de ${s.pact.level}º círculo` : `Espaços: ${s.slots.map((n, i) => `${i + 1}º ${n}`).join(' | ') || 'nenhum'}`, 9);
  }
  section('SALVAGUARDAS');
  grid(abilities.map(a => `${labels[a]}: ${signed(d.saves[a])}${cls?.saves.includes(a) ? ' (proficiente)' : ''}`));
  section('PERÍCIAS');
  grid(allSkills.map(s => `${skillInfo[s][0]}: ${signed(d.skills[s])}${d.trained.has(s) ? ' (proficiente)' : ''}`));
  section('PODERES DA CLASSE');
  for (const f of d.classFeatures) line(`Nível ${f.level} - ${f.name}: ${f.description}`, 8);
  if (subclass && d.subclassFeatures.length) { section(`SUBCLASSE: ${subclass.name.toUpperCase()}`); for (const f of d.subclassFeatures) line(`Nível ${f.level} - ${f.name}: ${f.description}`, 8); }
  if (d.speciesTraits.length) { section('TRAÇOS DA ESPÉCIE'); for (const t of d.speciesTraits) line(`${t.name}: ${t.description}`, 8); }
  if (background?.feat) { section('ANTECEDENTE'); line(`${background.feat.name}: ${background.feat.description}`, 8); line(`Ferramentas: ${background.tools} | Equipamento: ${background.equipment}`, 8); }
  doc.addPage(); y = 22;
  line(`${c.name || 'Herói sem nome'} - Revisão e fontes`, 16, true);
  section('PENDÊNCIAS');
  for (const message of [...creationErrors(c), ...pendingRules(c)]) line(`- ${message}`, 9);
  section('HISTÓRIA E ANOTAÇÕES (SEM EFEITO NOS CÁLCULOS)');
  line(c.notes || 'Nenhuma anotação.', 10);
  section('FONTES E LICENÇA');
  for (const source of [cls?.source, species?.source, background?.source, catalog.calculationSource]) {
    if (source) { line(`${source.document}, p. ${source.page}: ${source.section} | ${source.license}`, 8); line(source.url, 7); }
  }
  line('Compra de 27 pontos: método de criação do aplicativo. Tabela documentada no SRD 5.2.1, p. 21. No modo 2014, é uma convenção explícita solicitada pelo projeto, não uma seção do SRD 5.1.', 8);
  line(c.edition === '2014' ? attribution51 : attribution521, 8);
  line('Traduções e resumos próprios em português. Material adaptado; as regras originais prevalecem. Caracteres fora do repertório latino da fonte do PDF são substituídos por ?. O JSON preserva o texto integral.', 8);
  const count = doc.getNumberOfPages();
  for (let p = 1; p <= count; p++) { doc.setPage(p); doc.setFontSize(8); doc.setTextColor(90); doc.text(`Forja de Heróis | Rascunho | ${p}/${count}`, 18, 288); }
  return doc;
}
