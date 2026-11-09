import { jsPDF } from 'jspdf';
import { attribution51, attribution521 } from '../data/catalog';
import { creationErrors, derive, pendingRules, selections, signed } from '../domain/engine';
import { abilities, labels, skillInfo, type Character, type Skill } from '../domain/types';
import { parseCharacter } from '../persistence/characters';

// Built-in Helvetica supports Portuguese (WinAnsi). Preserve full Unicode in JSON;
// use a visible replacement for characters outside this PDF font's repertoire.
const printable = (text: string) => text.normalize('NFC').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[–—]/g, '-').replace(/[^\x20-\x7e\xa0-\xff\n]/gu, '?');
export function createCharacterPdf(input: Character): jsPDF {
  const c = parseCharacter(input);
  const d = derive(c);
  const { cls, species, background, catalog } = selections(c);
  const doc = new jsPDF({ format: 'a4', unit: 'mm', compress: true });
  doc.setProperties({ title: `Forja de Heróis - ${printable(c.name)}`, subject: 'Ficha provisória de nível 1', creator: 'Forja de Heróis' });
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
  line(`Edição ${c.edition} | ${c.edition === '2014' ? 'SRD 5.1' : 'SRD 5.2.1'} | Nível 1`);
  line(`${cls?.name ?? 'Classe pendente'} | ${species?.name ?? 'Origem pendente'} | ${background?.name ?? 'Antecedente pendente'}`);
  section('ATRIBUTOS');
  grid(abilities.map(a => `${labels[a]}: ${d.scores[a]} (${signed(d.mods[a])}) | base ${c.scores[a]} | bônus ${signed(d.scores[a] - c.scores[a])}`));
  section('VALORES BASE');
  line(`PV base: ${d.hp ?? '-'} | Dado de Vida: ${cls ? `1d${cls.hitDie}` : '-'} | Proficiência: +2`);
  line(`CA sem armadura: ${d.baseAC} | Iniciativa base: ${signed(d.baseInitiative)} | Deslocamento: ${d.speed ?? '-'} pés`);
  line(`Tamanho: ${species?.size ?? '-'} | Percepção passiva base: ${d.passivePerception}`);
  line('Sem aplicação de equipamentos, talentos, magias ou efeitos situacionais. Ex.: Alerta de 2024 ainda não foi aplicado à iniciativa.', 8);
  section('SALVAGUARDAS BASE');
  grid(abilities.map(a => `${labels[a]}: ${signed(d.saves[a])}${cls?.saves.includes(a) ? ' (proficiente)' : ''}`));
  section('PERÍCIAS BASE');
  grid((Object.keys(skillInfo) as Skill[]).map(s => `${skillInfo[s][0]}: ${signed(d.skills[s])}${d.trained.has(s) ? ' (proficiente)' : ''}`));
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
