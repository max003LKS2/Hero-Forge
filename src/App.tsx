import { useEffect, useRef, useState } from 'react';
import { Anvil, ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Download, Feather, FileText, FolderOpen, Heart, Shield, Sparkles, Swords, Upload, X } from 'lucide-react';
import { abilities, labels, skillInfo, type Character, type Edition, type Skill, allSkills } from './domain/types';
import { creationErrors, derive, newCharacter, pendingRules, pointSpend, sanitize, selections, signed } from './domain/engine';
import { downloadJson, importCharacter, MAX_IMPORT_BYTES, readLibrary, saveCharacter } from './persistence/characters';
import { attribution51, attribution521 } from './data/catalog';
import { AbilitiesStep, BackgroundStep, ClassStep, CombatStep, SheetSummary, SkillsStep, SpeciesStep } from './ui/steps';

const steps = ['Identidade', 'Classe e nível', 'Raça ou espécie', 'Antecedente', 'Atributos', 'Perícias', 'Combate e equipamento', 'Sua ficha'];
const LAST = steps.length - 1;
const questions = ['Toda lenda começa com um nome.', 'Que caminho você deseja seguir?', 'De onde vem a sua essência?', 'Quem você era antes da aventura?', 'Vamos descobrir seus pontos fortes.', 'O que você sabe fazer melhor?', 'Como você luta e se protege?', 'Sua história está tomando forma.'];
const hints = ['Eu sou o Cronista. Vou ajudar você a construir seu herói, uma escolha de cada vez.', 'Escolha a maneira como seu personagem enfrenta o mundo e o nível em que ele começa (o padrão é o nível 1). Você poderá voltar e mudar esta decisão.', 'Cada edição tem suas próprias opções. Só mostrarei as que pertencem ao livro de regras escolhido. Vou indicar as que combinam com a sua classe.', 'Seu passado concede perícias e outras escolhas. Em 2024, ele também determina seus bônus de atributos.', 'Você tem 27 pontos para comprar atributos de 8 a 15, antes dos bônus de origem. Valores 14 e 15 custam mais. Explico para que serve cada atributo e o que recomendo para a sua classe.', 'Antecedente e espécie já podem conceder perícias. Agora escolha as da classe, sem repetir as que você já tem.', 'Escolha o equipamento, o estilo de luta e as maestrias. Mostro na hora seus PV, sua CA e seus ataques.', 'A base está aqui. As pendências abaixo acompanham a ficha e o PDF, para você revisar cada regra com calma.'];

export default function App() {
  const [character, setCharacter] = useState<Character>(() => newCharacter());
  const [step, setStep] = useState(0);
  const [library, setLibrary] = useState<Character[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [status, setStatus] = useState('Seu progresso será salvo neste navegador.');
  const [error, setError] = useState('');
  const [pdfBusy, setPdfBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const c = character;
  const { cls, species, background } = selections(c);
  const derived = derive(c);
  const spent = pointSpend(c.scores);
  const errors = creationErrors(c);

  useEffect(() => { try { setLibrary(readLibrary(localStorage)); } catch { setError('Não foi possível ler a biblioteca local. Os dados foram preservados; exporte o personagem atual em JSON como cópia.'); } }, []);
  useEffect(() => {
    if (!c.name.trim()) return;
    setStatus('Salvando…');
    const timer = setTimeout(() => {
      try { setLibrary(saveCharacter(localStorage, c)); setStatus('Salvo neste navegador'); }
      catch { setStatus('Não salvo'); setError('O navegador não permitiu salvar, ou há dados incompatíveis. Exporte em JSON para não perder o personagem.'); }
    }, 350);
    return () => clearTimeout(timer);
  }, [c]);
  useEffect(() => { heading.current?.focus(); }, [step]);
  useEffect(() => {
    const flush = () => { if (c.name.trim()) { try { saveCharacter(localStorage, c); } catch { /* O aviso visível já orienta o backup em JSON. */ } } };
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, [c]);
  useEffect(() => {
    if (!libraryOpen && !sourcesOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
    const trap = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setLibraryOpen(false); setSourcesOpen(false); return; }
      if (event.key !== 'Tab' || !dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled)'));
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', trap);
    return () => { document.removeEventListener('keydown', trap); if (previous?.isConnected) previous.focus(); };
  }, [libraryOpen, sourcesOpen]);

  // Toda alteração passa por sanitize: escolhas que deixam de valer (nível, classe, espécie) são removidas.
  function patch(p: Partial<Character>) { setCharacter(old => sanitize({ ...old, ...p, updatedAt: new Date().toISOString() })); }
  function persistNow(): boolean {
    if (!c.name.trim()) return true;
    try { setLibrary(saveCharacter(localStorage, c)); return true; }
    catch { setError('Salve uma cópia JSON antes de trocar de personagem: o salvamento local falhou.'); return false; }
  }
  function changeEdition(edition: Edition) {
    if (edition === c.edition) return;
    if (c.classId || c.speciesId || c.backgroundId) {
      if (!window.confirm('A mudança cria um novo rascunho e limpa escolhas de regras. Seu personagem atual será preservado na biblioteca. Continuar?')) return;
      if (!persistNow()) return;
      setCharacter({ ...newCharacter(edition), name: c.name, notes: c.notes, level: c.level });
    } else patch({ edition });
  }
  const speciesDone = Boolean(species && (!species.variants?.length || c.variantId) && (!species.abilityChoice || c.speciesAbilities.length === species.abilityChoice.count) && (!species.skillChoice || c.speciesSkills.length === species.skillChoice.count));
  const backgroundDone = Boolean(background && (!background.customSkills || c.backgroundSkills.length === background.customSkills));
  const canContinue = [Boolean(c.name.trim()), Boolean(cls), speciesDone, backgroundDone, spent === 27 && (c.edition === '2014' || abilities.reduce((sum, a) => sum + c.boosts[a], 0) === 3), Boolean(cls && c.skills.length === cls.skillCount), !errors.some(e => /estilo de luta|maestria/i.test(e)), true][step];
  async function exportPdf() {
    setPdfBusy(true); setError('');
    try { const { createCharacterPdf } = await import('./export/pdf'); const doc = createCharacterPdf(c); doc.save(`forja-${c.id}.pdf`); }
    catch { setError('Não foi possível gerar o PDF. Exporte em JSON para guardar o personagem e tente novamente.'); }
    finally { setPdfBusy(false); }
  }
  async function importFile(file?: File) {
    if (!file) return;
    try {
      if (file.size > MAX_IMPORT_BYTES) throw new Error('O arquivo excede 100 KB.');
      const imported = importCharacter(await file.text());
      if (!persistNow()) return;
      // Importações viram cópias independentes: um ID antigo nunca sobrescreve um herói salvo.
      setCharacter({ ...imported, id: crypto.randomUUID(), updatedAt: new Date().toISOString() }); setStep(LAST); setLibraryOpen(false); setError('');
    } catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível importar.'); }
    finally { if (fileInput.current) fileInput.current.value = ''; }
  }
  const props = { c, patch, derived };

  return <div className="app-shell">
    <header className="topbar"><a href="#main" className="brand"><span className="brand-mark"><Anvil size={25} /></span><span>FORJA <small>DE</small> HERÓIS<em>O começo de uma grande história</em></span></a><div className="header-actions"><span className="local-label"><span className="dot" /> Sem conta · dados locais</span><button className="subtle" onClick={() => setLibraryOpen(true)}><FolderOpen size={17} /> Meus heróis <span className="count">{library.length}</span></button></div></header>
    <div className="workspace">
      <aside className="sidebar"><p className="eyebrow">SEU PRÓXIMO CAPÍTULO</p><h2>Forje sua<br /><i>própria lenda.</i></h2><p className="sidebar-intro">Da primeira ideia ao papel.<br />Uma escolha por vez.</p>
        <nav aria-label="Etapas da criação">{steps.map((label, i) => <button key={label} aria-current={step === i ? 'step' : undefined} className={`step-link ${step === i ? 'active' : ''}`} onClick={() => setStep(i)}><span className="step-number">{String(i + 1).padStart(2, '0')}</span><span>{label}</span>{step === i && <ChevronRight size={15} />}</button>)}</nav>
        <div className="sidebar-bottom"><BookOpen size={19} /><p><strong>Regras com origem</strong><br />SRD 5.1 e SRD 5.2.1<br />Conteúdos sempre separados.</p><button className="text-button" onClick={() => setSourcesOpen(true)}>Fontes e licenças ↗</button></div>
      </aside>
      <main id="main"><div className="section-top"><span className="eyebrow">A MESA ESTÁ PRONTA</span><span className="edition-badge">{c.edition} · {c.edition === '2014' ? 'SRD 5.1' : 'SRD 5.2.1'}</span></div>
        <div className="chapter-heading"><h1>Uma nova aventura</h1><p>Vamos criar alguém que vale a pena lembrar.</p></div>
        <div className="progress" aria-label={`Etapa ${step + 1} de ${steps.length}`}><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
        <div className="conversation"><div className="narrator"><span className="avatar"><Feather size={23} /></span><div><strong>O Cronista</strong><span>Seu guia nesta jornada · etapa {step + 1} de {steps.length}</span></div><Sparkles className="narrator-spark" size={18} /></div>
          <h2 ref={heading} tabIndex={-1}>{questions[step]}</h2><p className="hint">{hints[step]}</p>
          {step === 0 && <div className="identity-form"><label htmlFor="hero-name">Como seu herói será conhecido?</label><input id="hero-name" maxLength={80} value={c.name} onChange={e => patch({ name: e.target.value })} placeholder="Ex.: Aurora, a Guardiã" autoComplete="off" /><span className="field-help">Pode ser um nome, um apelido ou o início de uma lenda.</span><fieldset><legend>Qual edição vamos usar?</legend><div className="edition-options">{(['2024', '2014'] as const).map(edition => <button key={edition} className={c.edition === edition ? 'chosen' : ''} aria-pressed={c.edition === edition} onClick={() => changeEdition(edition)}><span>{edition}</span><strong>{edition === '2024' ? 'Regras revisadas' : 'Regras clássicas'}</strong><small>{edition === '2024' ? 'SRD 5.2.1' : 'SRD 5.1'}</small>{c.edition === edition && <Check size={16} />}</button>)}</div></fieldset><div className="note"><BookOpen size={18} /><span><strong>Do nível 1 ao 20.</strong> As 12 classes, espécies, antecedentes, poderes, equipamento, PV e CA estão disponíveis. A lista de magias específicas e os talentos ainda não estão catalogados; a ficha indica todas as pendências.</span></div></div>}
          {step === 1 && <ClassStep {...props} />}
          {step === 2 && <SpeciesStep {...props} />}
          {step === 3 && <BackgroundStep {...props} />}
          {step === 4 && <AbilitiesStep {...props} />}
          {step === 5 && <SkillsStep {...props} />}
          {step === 6 && <CombatStep {...props} />}
          {step === 7 && <><div className="review-title"><Shield size={32} /><div><h3>{c.name || 'Herói sem nome'}</h3><p>{cls?.name ?? 'Classe pendente'} · {species?.name ?? 'Origem pendente'} · Nível {c.level}</p></div></div><div className="note"><FileText size={18} /><span><strong>Ficha provisória · {errors.length ? 'base incompleta' : 'base preenchida'}</strong><br />A conclusão das etapas não significa que o personagem esteja pronto para jogar. Consulte as pendências abaixo.</span></div>{errors.length > 0 && <ul className="validation-list">{errors.map(e => <li key={e}>{e}</li>)}</ul>}
            <SheetSummary c={c} derived={derived} />
            <details><summary>Regras e escolhas a revisar</summary><ul className="pending-list">{pendingRules(c).map(p => <li key={p}>{p}</li>)}</ul></details><label className="notes-label" htmlFor="notes">História e anotações livres</label><textarea id="notes" maxLength={4000} rows={4} placeholder="O que trouxe seu herói até aqui? Estas anotações não alteram os cálculos." value={c.notes} onChange={e => patch({ notes: e.target.value })} /><div className="export-actions"><button className="primary" disabled={pdfBusy} onClick={exportPdf}><Download size={17} />{pdfBusy ? 'Gerando…' : 'Baixar ficha PDF A4'}</button><button className="secondary" onClick={() => downloadJson(c)}>Exportar JSON</button></div><p className="field-help">O PDF inclui atributos, PV, CA, ataques, poderes, perícias, fontes e pendências. A exportação não envia dados a um servidor.</p></>}
        </div>
        <div className="wizard-footer"><button className="subtle" disabled={step === 0} onClick={() => setStep(s => s - 1)}><ArrowLeft size={17} /> Voltar</button><span className="save-status" role="status">{status}</span>{step < LAST ? <button className="primary" disabled={!canContinue} onClick={() => setStep(s => s + 1)}>Continuar <ArrowRight size={17} /></button> : <button className="secondary" onClick={() => { if (persistNow()) { setCharacter(newCharacter(c.edition)); setStep(0); } }}>Novo herói</button>}</div>
        {error && <div className="error" role="alert">{error}<button aria-label="Fechar aviso" onClick={() => setError('')}><X size={17} /></button></div>}
        <p className="page-footnote">FEITO PARA IMAGINAR. CONSTRUÍDO PARA CONFERIR.</p>
      </main>
      <aside className="preview" aria-label="Prévia do personagem"><div className="preview-heading"><span className="eyebrow">SEU HERÓI</span><span className="draft">RASCUNHO</span></div><div className="sigil" aria-hidden="true"><div className="sigil-diamond" /><Swords size={72} strokeWidth={1} /><span>{c.level}</span></div><h2>{c.name || 'Uma lenda por nascer'}</h2><p className="hero-subtitle">{cls?.name ?? 'Classe a descobrir'} · Nível {c.level}</p><div className="hero-tags"><span>{species?.name ?? 'Origem a escolher'}</span><span>{background?.name ?? 'Passado a escrever'}</span></div><div className="preview-divider" /><div className="stat-trio"><div><Heart size={17} /><b>{derived.hp ?? '—'}</b><span>PV</span></div><div><Shield size={17} /><b>{derived.ac}</b><span>CA</span></div><div><Sparkles size={17} /><b>{signed(derived.proficiency)}</b><span>Proficiência</span></div></div><p className="tiny">{derived.acNote}</p><div className="preview-scores">{abilities.map(a => <div key={a}><span>{a.toUpperCase()}</span><b>{derived.scores[a]}</b><em>{signed(derived.mods[a])}</em></div>)}</div><div className="mini-stats"><span>Iniciativa <b>{signed(derived.initiative)}</b></span><span>Deslocamento <b>{derived.speed ? `${derived.speed} pés` : '—'}</b></span><span>Percepção passiva <b>{derived.passivePerception}</b></span></div><details className="save-details"><summary>Ver salvaguardas e perícias</summary><ul>{abilities.map(a => <li key={a}>{labels[a]} <b>{signed(derived.saves[a])}</b></li>)}</ul><ul>{(allSkills as Skill[]).map(s => <li key={s}>{derived.trained.has(s) ? '● ' : ''}{skillInfo[s][0]} <b>{signed(derived.skills[s])}</b></li>)}</ul></details><div className="preview-quote">“Grandes histórias começam<br />com uma pequena escolha.”</div></aside>
    </div>
    {libraryOpen && <div className="drawer-backdrop"><section className="drawer" role="dialog" aria-modal="true" aria-labelledby="library-title"><div className="drawer-top"><h2 id="library-title">Meus heróis</h2><button autoFocus className="icon-button" aria-label="Fechar biblioteca" onClick={() => setLibraryOpen(false)}><X /></button></div><p>Salvos somente neste navegador. Exporte um JSON para transferir ou manter uma cópia.</p><button className="secondary" onClick={() => fileInput.current?.click()}><Upload size={17} /> Importar personagem JSON</button><div className="saved-list">{library.length ? library.map(hero => <button key={hero.id} onClick={() => { if (persistNow()) { setCharacter(hero); setStep(LAST); setLibraryOpen(false); } }}><span><strong>{hero.name || 'Sem nome'}</strong><small>{hero.edition} · {selections(hero).cls?.name ?? 'Rascunho'} · nível {hero.level} · {new Date(hero.updatedAt).toLocaleDateString('pt-BR')}</small></span><ChevronRight size={18} /></button>) : <p className="empty-state">Seu primeiro herói começa com um nome. Ele aparecerá aqui automaticamente.</p>}</div><button className="text-button" onClick={() => { if (persistNow()) { setCharacter(newCharacter()); setStep(0); setLibraryOpen(false); } }}>+ Criar outro herói</button></section></div>}
    {sourcesOpen && <div className="drawer-backdrop"><section className="drawer sources" role="dialog" aria-modal="true" aria-labelledby="sources-title"><div className="drawer-top"><h2 id="sources-title">Fontes e licenças</h2><button autoFocus className="icon-button" aria-label="Fechar fontes" onClick={() => setSourcesOpen(false)}><X /></button></div><p>Resumos e traduções próprias em português. As páginas se referem aos PDFs em inglês. Nenhum texto de livros comerciais foi incorporado.</p><p>{attribution51}</p><p>{attribution521}</p><a href="https://www.dndbeyond.com/srd" target="_blank" rel="noreferrer">Consultar os documentos oficiais ↗</a><p><a href="https://creativecommons.org/licenses/by/4.0/legalcode" target="_blank" rel="noreferrer">Creative Commons Attribution 4.0</a></p><p>A compra de 27 pontos é o método de criação solicitado para o aplicativo. O SRD 5.2.1 documenta a tabela na página 21; o SRD 5.1 não contém essa seção. No modo 2014, ela é uma convenção explícita do construtor, sem importar antecedentes ou bônus de 2024.</p><p>Os temas do antecedente livre (2014) são apenas ideias de história; nenhum benefício mecânico de livros comerciais foi copiado.</p><p>Projeto independente, compatível com quinta edição. Código MIT; conteúdo derivado dos SRDs sob CC BY 4.0. Ilustração geométrica original; ícones Lucide sob ISC.</p></section></div>}
    <input ref={fileInput} hidden type="file" accept=".json,application/json" aria-label="Importar arquivo de personagem" onChange={e => void importFile(e.target.files?.[0])} />
  </div>;
}
