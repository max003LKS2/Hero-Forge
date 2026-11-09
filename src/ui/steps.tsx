import { Heart, Shield, Sparkles, Swords, Wand2 } from 'lucide-react';
import { abilities, allSkills, labels, skillInfo, zeros, type Ability, type Character, type Skill, type WeaponCategory } from '../domain/types';
import { applyKit, armorById, asiSlots, derive, masteryCount, masteryEligible, MAX_LEVEL, MAX_WEAPONS, pointCosts, pointSpend, proficiencyBonus, selections, signed, totalScore, weaponProficient } from '../domain/engine';
import { armors, fightingStyles, masteries, weapons } from '../data/equipment';
import { backgroundThemes } from '../data/themes';
import { abilityInfo, Callout, FeatureList, OptionCards, Panel, propertyNames, TraitList } from './shared';

export interface StepProps { c: Character; patch: (p: Partial<Character>) => void; derived: ReturnType<typeof derive> }
const skillName = (s: Skill) => skillInfo[s][0];

// ---- Classe e nível ---------------------------------------------------------
export function ClassStep({ c, patch }: StepProps) {
  const { catalog, cls } = selections(c);
  return <>
    <div className="level-picker">
      <div><label htmlFor="level-range">Nível do personagem</label><span className="field-help">O padrão é o nível 1, o começo de toda aventura. Aumente apenas se a sua mesa começa em nível mais alto: poderes, PV e proficiência acompanham.</span></div>
      <div className="level-controls"><button aria-label="Diminuir nível" disabled={c.level <= 1} onClick={() => patch({ level: c.level - 1 })}>−</button><output aria-live="polite"><b>{c.level}</b><small>proficiência {signed(proficiencyBonus(c.level))}</small></output><button aria-label="Aumentar nível" disabled={c.level >= MAX_LEVEL} onClick={() => patch({ level: c.level + 1 })}>+</button></div>
      <input id="level-range" type="range" min={1} max={MAX_LEVEL} value={c.level} onChange={e => patch({ level: Number(e.target.value) })} />
    </div>
    <OptionCards options={catalog.classes} value={c.classId} onSelect={classId => patch({ classId, skills: [], kitId: '', armorId: '', shield: false, weaponIds: [], fightingStyleId: '', masteries: [], asi: zeros() })} />
    {cls && <div className="detail">
      <h3>{cls.name} <small>{cls.role}</small></h3>
      <p>{cls.overview}</p>
      <Callout title={`Atributo principal: ${cls.primaryText}`}>Dado de Vida d{cls.hitDie} · Salvaguardas de {cls.saves.map(a => labels[a]).join(' e ')} · {cls.skillCount} perícias à escolha.</Callout>
      <h4>Como é jogar de {cls.name}</h4>
      <ul className="bullets">{cls.playstyle.map(p => <li key={p}>{p}</li>)}</ul>
      <Panel title="Proficiências e equipamento">
        <p><b>Armaduras:</b> {cls.armorText}</p><p><b>Armas:</b> {cls.weaponText}</p><p><b>Ferramentas:</b> {cls.toolText}</p>
      </Panel>
      <Panel title={`Poderes da classe até o nível ${c.level}`} open><FeatureList features={cls.features.filter(f => f.level <= c.level)} /></Panel>
      {c.level >= cls.subclass.level
        ? <Panel title={`Subclasse: ${cls.subclass.name}`} open><p>{cls.subclass.description}</p><FeatureList features={cls.subclass.features.filter(f => f.level <= c.level)} /></Panel>
        : <Callout title={`Subclasse: ${cls.subclass.name}`}>Disponível a partir do nível {cls.subclass.level}. {cls.subclass.description}</Callout>}
      {cls.spellcasting && <Panel title="Magia"><p>{cls.spellcasting.summary}</p><p><b>Atributo de conjuração:</b> {labels[cls.spellcasting.ability]} · <b>Foco:</b> {cls.spellcasting.focus}</p></Panel>}
      {cls.mastery && <Panel title="Maestria de Arma (2024)"><p>{cls.mastery.rule}</p></Panel>}
      <Panel title="Ver todos os 20 níveis"><FeatureList features={[...cls.features, ...cls.subclass.features.map(f => ({ ...f, name: `${cls.subclass.name}: ${f.name}` }))].sort((a, b) => a.level - b.level)} level={c.level} /></Panel>
    </div>}
  </>;
}

// ---- Espécie ----------------------------------------------------------------
export function SpeciesStep({ c, patch }: StepProps) {
  const { catalog, cls, species, background } = selections(c);
  const badges = Object.fromEntries(catalog.species.filter(s => cls?.speciesFit[s.key]).map(s => [s.id, 'Recomendado']));
  const autoFit = (key: string) => {
    const s = catalog.species.find(x => x.key === key);
    if (!s || !cls) return '';
    const hits = cls.primary.filter(a => s.bonuses[a]);
    return hits.length ? `Seus bônus de atributo (${hits.map(a => `${labels[a]} ${signed(s.bonuses[a]!)}`).join(', ')}) reforçam o atributo principal de ${cls.name}.` : '';
  };
  const grantedSkills = new Set<Skill>([...(background?.skills ?? []), ...c.backgroundSkills]);
  const choose = (speciesId: string) => patch({ speciesId, variantId: '', speciesAbilities: [], speciesSkills: [] });
  const toggle = <T,>(arr: T[], v: T, max: number) => arr.includes(v) ? arr.filter(x => x !== v) : arr.length < max ? [...arr, v] : arr;
  return <>
    <OptionCards options={catalog.species} value={c.speciesId} onSelect={choose} badges={badges} />
    {species && <div className="detail">
      <h3>{species.name} <small>{species.size} · deslocamento {species.speed} pés</small></h3>
      <p>{species.overview}</p>
      {(cls?.speciesFit[species.key] || autoFit(species.key)) && <Callout title={`Para ${cls?.name ?? 'sua classe'}`} tone="good">{cls?.speciesFit[species.key] ?? autoFit(species.key)}</Callout>}
      <p><b>Ideal para:</b> {species.bestFor}</p>
      {c.edition === '2014' && Object.keys(species.bonuses).length > 0 && <p><b>Bônus de atributo:</b> {Object.entries(species.bonuses).map(([a, v]) => `${labels[a as Ability]} ${signed(v!)}`).join(', ')}{species.abilityChoice ? ` e +${species.abilityChoice.amount} em ${species.abilityChoice.count} atributos à escolha` : ''}.</p>}
      {c.edition === '2024' && <p className="field-help">Em 2024 os bônus de atributo vêm do antecedente, não da espécie.</p>}
      <Panel title="Traços da espécie" open><TraitList traits={species.traits} /></Panel>
      <p><b>Idiomas:</b> {species.languages}</p>
      {species.variants && <fieldset><legend>{species.variantLabel ?? 'Variante'}</legend><div className="variant-grid">{species.variants.map(v => <button key={v.id} className={c.variantId === v.id ? 'chosen' : ''} aria-pressed={c.variantId === v.id} onClick={() => patch({ variantId: v.id })}><strong>{v.name}</strong><small>{v.description}</small></button>)}</div>
        {species.variants.filter(v => v.id === c.variantId).map(v => <TraitList key={v.id} traits={v.traits} />)}</fieldset>}
      {species.abilityChoice && <fieldset><legend>Escolha {species.abilityChoice.count} atributos (+{species.abilityChoice.amount} cada)</legend><div className="pill-grid">{abilities.filter(a => !species.abilityChoice!.exclude.includes(a)).map(a => <label key={a} className={`pill ${c.speciesAbilities.includes(a) ? 'on' : ''}`}><input type="checkbox" checked={c.speciesAbilities.includes(a)} onChange={() => patch({ speciesAbilities: toggle(c.speciesAbilities, a, species.abilityChoice!.count) })} />{labels[a]}</label>)}</div></fieldset>}
      {species.skillChoice && <fieldset><legend>{species.skillChoice.label}: escolha {species.skillChoice.count} perícia(s)</legend><div className="pill-grid">{(species.skillChoice.from ?? allSkills).map(s => <label key={s} className={`pill ${c.speciesSkills.includes(s) ? 'on' : ''}`}><input type="checkbox" disabled={grantedSkills.has(s)} checked={c.speciesSkills.includes(s)} onChange={() => { const next = toggle(c.speciesSkills, s, species.skillChoice!.count); patch({ speciesSkills: next, skills: c.skills.filter(x => !next.includes(x)) }); }} />{skillName(s)}</label>)}</div></fieldset>}
    </div>}
  </>;
}

// ---- Antecedente ------------------------------------------------------------
export function BackgroundStep({ c, patch }: StepProps) {
  const { catalog, cls, background } = selections(c);
  const badges: Record<string, string> = {};
  for (const b of catalog.backgrounds) if (cls?.backgroundFit[b.key]) badges[b.id] = 'Recomendado';
  const fixed = background?.skills ?? [];
  const overlap = cls ? fixed.filter(s => cls.skills.includes(s)) : [];
  const primaryHits = cls && background ? background.abilities.filter(a => cls.primary.includes(a)) : [];
  const taken = new Set<Skill>(c.speciesSkills);
  const toggleSkill = (s: Skill) => { const on = c.backgroundSkills.includes(s); const next = on ? c.backgroundSkills.filter(x => x !== s) : c.backgroundSkills.length < (background?.customSkills ?? 0) ? [...c.backgroundSkills, s] : c.backgroundSkills; patch({ backgroundSkills: next, skills: c.skills.filter(x => !next.includes(x)) }); };
  return <>
    <OptionCards options={catalog.backgrounds} value={c.backgroundId} onSelect={backgroundId => patch({ backgroundId, boosts: zeros(), skills: [], backgroundSkills: [], backgroundTheme: '' })} badges={badges} />
    {c.edition === '2014' && <p className="field-help">O SRD 5.1 traz só o Acólito. Para ter variedade, use o <b>Antecedente livre</b>: escolha um tema de história e duas perícias. Os benefícios dos antecedentes de livros comerciais não foram copiados.</p>}
    {c.edition === '2024' && <p className="field-help">O SRD 5.2.1 inclui quatro antecedentes: Acólito, Criminoso, Sábio e Soldado.</p>}
    {background && <div className="detail">
      <h3>{background.name}</h3>
      <p>{background.overview}</p>
      {cls?.backgroundFit[background.key] && <Callout title={`Para ${cls.name}`} tone="good">{cls.backgroundFit[background.key]}</Callout>}
      <p><b>Ideal para:</b> {background.bestFor}</p>
      <ul className="bullets">
        {background.abilities.length > 0 && <li><b>Atributos (+2/+1 ou +1/+1/+1):</b> {background.abilities.map(a => labels[a]).join(', ')}{primaryHits.length ? ` — ${primaryHits.map(a => labels[a]).join(' e ')} ${primaryHits.length > 1 ? 'são' : 'é'} principal(is) de ${cls!.name}.` : '.'}</li>}
        {fixed.length > 0 && <li><b>Perícias concedidas:</b> {fixed.map(skillName).join(' e ')}{overlap.length ? ` — ${overlap.map(skillName).join(' e ')} também aparece(m) na lista de ${cls!.name}; na etapa de perícias você escolherá outras.` : '.'}</li>}
        <li><b>Ferramentas:</b> {background.tools}</li>
        {background.languages && <li><b>Idiomas:</b> {background.languages}</li>}
        {background.feat && <li><b>{c.edition === '2024' ? 'Talento de Origem' : 'Característica'}: {background.feat.name}.</b> {background.feat.description}</li>}
        <li><b>Equipamento:</b> {background.equipment}</li>
      </ul>
      {background.customSkills ? <>
        <fieldset><legend>Tema de história (opcional)</legend><select value={c.backgroundTheme} onChange={e => patch({ backgroundTheme: e.target.value })}><option value="">Sem tema definido</option>{[...new Set(backgroundThemes.map(t => t.group))].map(g => <optgroup key={g} label={g}>{backgroundThemes.filter(t => t.group === g).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</optgroup>)}</select>{c.backgroundTheme && <p className="field-help">{backgroundThemes.find(t => t.id === c.backgroundTheme)?.description} Tema só de inspiração: não concede benefícios automáticos.</p>}</fieldset>
        <fieldset><legend>Escolha {background.customSkills} perícias</legend>{cls && <p className="field-help">Combina com {cls.name}: {cls.recommendedSkills.map(skillName).join(', ')}.</p>}<div className="pill-grid">{allSkills.map(s => <label key={s} className={`pill ${c.backgroundSkills.includes(s) ? 'on' : ''}`}><input type="checkbox" disabled={taken.has(s)} checked={c.backgroundSkills.includes(s)} onChange={() => toggleSkill(s)} />{skillName(s)}</label>)}</div></fieldset></> : null}
    </div>}
  </>;
}

// ---- Atributos --------------------------------------------------------------
export function AbilitiesStep({ c, patch, derived }: StepProps) {
  const { cls, background } = selections(c);
  const spent = pointSpend(c.scores);
  const slots = asiSlots(cls, c.level);
  const set = (a: Ability, v: number) => patch({ scores: { ...c.scores, [a]: v } });
  return <>
    <div className="points-banner"><span>Compra de atributos</span><strong>{27 - spent}<small> / 27 pontos restantes</small></strong></div>
    {cls && <div className="reco"><span>Recomendação para {cls.name}: <b>{abilities.filter(a => cls.primary.includes(a)).map(a => labels[a]).join(' e ')}</b> primeiro, depois Constituição.</span><button className="secondary" onClick={() => patch({ scores: { ...cls.recommendedScores } })}><Wand2 size={15} /> Usar distribuição recomendada</button></div>}
    <div className="ability-cards">{abilities.map(a => <div className={`ability-card ${cls?.primary.includes(a) ? 'key-ability' : ''}`} key={a}>
      <div className="ability-head"><label htmlFor={`score-${a}`}>{labels[a]}<small>{a.toUpperCase()}{cls?.primary.includes(a) ? ' · principal' : ''}</small></label>
        <div className="stepper"><button aria-label={`Diminuir ${labels[a]}`} disabled={c.scores[a] <= 8} onClick={() => set(a, c.scores[a] - 1)}>−</button><output id={`score-${a}`}>{c.scores[a]}</output><button aria-label={`Aumentar ${labels[a]}`} disabled={c.scores[a] >= 15 || spent - pointCosts[c.scores[a]] + pointCosts[c.scores[a] + 1] > 27 || totalScore(c, a) >= 20} onClick={() => set(a, c.scores[a] + 1)}>+</button></div>
        <span className="score-total">{derived.scores[a]} <small>final · {signed(derived.mods[a])}</small></span></div>
      <p className="ability-sum">{abilityInfo[a].summary}</p>
      <ul className="bullets small">{abilityInfo[a].helps.map(h => <li key={h}>{h}</li>)}</ul>
      {cls && <p className="advice"><Sparkles size={13} /> {cls.abilityAdvice[a]}</p>}
      {(totalScore(c, a) !== c.scores[a]) && <p className="breakdown">Base {c.scores[a]}{totalScore(c, a) - c.scores[a] - c.asi[a] !== 0 ? ` ${signed(totalScore(c, a) - c.scores[a] - c.asi[a])} origem` : ''}{c.asi[a] ? ` ${signed(c.asi[a])} aumentos` : ''}</p>}
    </div>)}</div>
    {c.edition === '2024' ? <fieldset><legend>Bônus do antecedente</legend>{background ? <><p className="field-help">Aplique +2 em um atributo e +1 em outro, ou +1 nos três. Trocar o antecedente limpa estes bônus e as perícias de classe.</p><div className="boost-grid">{background.abilities.map(a => <label key={a}>{labels[a]}<select value={c.boosts[a]} onChange={e => patch({ boosts: { ...c.boosts, [a]: Number(e.target.value) } })}>{[0, 1, 2].map(v => <option key={v} value={v} disabled={abilities.reduce((n, k) => n + (k === a ? v : c.boosts[k]), 0) > 3 || (v === 2 && abilities.some(k => k !== a && c.boosts[k] === 2))}>+{v}</option>)}</select></label>)}</div></> : <p>Escolha um antecedente primeiro.</p>}</fieldset> : <p className="field-help">Bônus raciais são aplicados automaticamente (escolha-os na etapa da espécie). Em 2014, a compra de 27 pontos é a convenção de criação solicitada para este aplicativo; não é apresentada como texto do SRD 5.1.</p>}
    {slots > 0 && <fieldset><legend>Aumentos de atributo do nível {c.level}</legend><p className="field-help">Você tem {slots} aumento(s) = {derived.asiBudget} pontos para distribuir (+2 em um atributo ou +1 em dois). Usados: {derived.asiSpent}. Nenhum atributo passa de 20. Talentos podem substituir um aumento, mas ainda não estão catalogados.</p><div className="boost-grid">{abilities.map(a => <label key={a}>{labels[a]}<div className="stepper"><button disabled={c.asi[a] <= 0} onClick={() => patch({ asi: { ...c.asi, [a]: c.asi[a] - 1 } })}>−</button><output>+{c.asi[a]}</output><button disabled={derived.asiSpent >= derived.asiBudget || totalScore(c, a) >= 20} onClick={() => patch({ asi: { ...c.asi, [a]: c.asi[a] + 1 } })}>+</button></div></label>)}</div></fieldset>}
    <button className="text-button" onClick={() => patch({ scores: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 } })}>Usar distribuição de exemplo genérica (27 pontos)</button>
  </>;
}

// ---- Perícias ----------------------------------------------------------------
export function SkillsStep({ c, patch, derived }: StepProps) {
  const { cls, background } = selections(c);
  const granted = new Set<Skill>([...(background?.skills ?? []), ...c.backgroundSkills, ...c.speciesSkills]);
  if (!cls) return <p>Escolha uma classe para ver as perícias disponíveis.</p>;
  return <>
    {granted.size > 0 && <div className="note"><span>Já concedidas por antecedente/espécie: {[...granted].map(skillName).join(', ')}.</span></div>}
    <div className="reco"><span>Recomendadas para {cls.name}: <b>{cls.recommendedSkills.map(skillName).join(', ')}</b>{cls.recommendedSkills.some(s => granted.has(s)) ? ' (as que você já recebeu serão substituídas pelas próximas da lista)' : ''}.</span><button className="secondary" onClick={() => patch({ skills: [...cls.recommendedSkills, ...cls.skills].filter((s, i, all) => !granted.has(s) && all.indexOf(s) === i).slice(0, cls.skillCount) })}><Wand2 size={15} /> Usar recomendadas</button></div>
    <p className="selection-counter">{c.skills.length} de {cls.skillCount} perícias escolhidas</p>
    <div className="skills-grid">{cls.skills.map(s => <label className="skill-option" key={s}><input type="checkbox" checked={c.skills.includes(s) || granted.has(s)} disabled={granted.has(s) || (!c.skills.includes(s) && c.skills.length >= cls.skillCount)} onChange={e => patch({ skills: e.target.checked ? [...c.skills, s] : c.skills.filter(x => x !== s) })} /><span>{skillName(s)}<small>{labels[skillInfo[s][1]]}{granted.has(s) ? ' · já concedida' : cls.recommendedSkills.includes(s) ? ' · recomendada' : ''}</small></span><b>{signed(derived.skills[s])}</b></label>)}</div>
  </>;
}

// ---- Combate e equipamento --------------------------------------------------
const categoryTitles: Array<[WeaponCategory, boolean, string]> = [['simple', true, 'Simples · corpo a corpo'], ['simple', false, 'Simples · à distância'], ['martial', true, 'Marciais · corpo a corpo'], ['martial', false, 'Marciais · à distância']];
export function CombatStep({ c, patch, derived }: StepProps) {
  const { cls, style } = selections(c);
  if (!cls) return <p>Escolha uma classe primeiro.</p>;
  const styleRule = cls.fightingStyle;
  const styles = styleRule ? fightingStyles[c.edition].filter(s => styleRule.options.includes(s.id)) : [];
  const mCount = masteryCount(cls, c.level);
  const toggleWeapon = (id: string) => patch({ weaponIds: c.weaponIds.includes(id) ? c.weaponIds.filter(x => x !== id) : c.weaponIds.length < MAX_WEAPONS ? [...c.weaponIds, id] : c.weaponIds, masteries: c.weaponIds.includes(id) ? c.masteries.filter(x => x !== id) : c.masteries });
  return <>
    <div className="vitals">
      <div><Heart size={18} /><b>{derived.hp ?? '—'}</b><span>PV no nível {c.level}</span><small>{derived.hitDice} · média por nível acima do 1º</small></div>
      <div><Shield size={18} /><b>{derived.ac}</b><span>Classe de Armadura</span><small>{derived.acNote}</small></div>
      <div><Swords size={18} /><b>{signed(derived.proficiency)}</b><span>Proficiência</span><small>iniciativa {signed(derived.initiative)}</small></div>
    </div>
    {derived.warnings.map(w => <Callout key={w} title="Atenção" tone="warn">{w}</Callout>)}

    <h4>Equipamento inicial</h4>
    <p className="field-help">Escolha um kit pronto (depois você pode trocar armadura, escudo e armas à vontade).</p>
    <div className="kit-grid">{cls.kits.map(k => <button key={k.id} className={c.kitId === k.id ? 'chosen' : ''} aria-pressed={c.kitId === k.id} onClick={() => patch(applyKit(c, k))}><strong>{k.name}</strong><small>{k.description}</small>{k.gear.length > 0 && <small>{k.gear.join(' · ')}</small>}{k.gp > 0 && <small>{k.gp} PO</small>}</button>)}</div>

    <h4>Armadura e escudo</h4>
    <div className="armor-row"><label>Armadura<select value={c.armorId} onChange={e => patch({ armorId: e.target.value })}><option value="">Sem armadura</option>{(['light', 'medium', 'heavy'] as const).map(cat => <optgroup key={cat} label={{ light: 'Leves', medium: 'Médias', heavy: 'Pesadas' }[cat]}>{armors.filter(a => a.category === cat).map(a => <option key={a.id} value={a.id}>{a.name} · CA {a.ac}{a.dexCap === null ? ' + Des' : a.dexCap ? ` + Des (máx ${a.dexCap})` : ''}{cls.armorProf.includes(cat) ? '' : ' · sem proficiência'}</option>)}</optgroup>)}</select></label>
      <label className="check"><input type="checkbox" checked={c.shield} onChange={e => patch({ shield: e.target.checked })} /> Escudo (+2 CA){cls.shieldProf ? '' : ' · sem proficiência'}</label></div>
    {c.armorId && <p className="field-help">{(() => { const a = armorById(c.armorId)!; return `${a.name}: custa ${a.cost}, pesa ${a.weight}${a.strengthReq ? `, exige Força ${a.strengthReq}` : ''}${a.stealthDisadvantage ? ', desvantagem em Furtividade' : ''}.`; })()}</p>}

    {styleRule && c.level >= styleRule.level && <><h4>Estilo de luta</h4><p className="field-help">{styleRule.note ?? 'Uma especialização de combate: escolha o que combina com as armas que você pretende usar.'}</p>
      <div className="variant-grid">{styles.map(s => <button key={s.id} className={c.fightingStyleId === s.id ? 'chosen' : ''} aria-pressed={c.fightingStyleId === s.id} onClick={() => patch({ fightingStyleId: s.id })}><strong>{s.name}</strong><small>{s.description}</small></button>)}</div></>}
    {styleRule && c.level < styleRule.level && <Callout title="Estilo de luta">{cls.name} escolhe um estilo de luta no nível {styleRule.level}.</Callout>}

    <h4>Armas</h4>
    <p className="field-help">Marque até {MAX_WEAPONS} armas. ✓ indica que {cls.name} tem proficiência (soma o bônus de {signed(derived.proficiency)}).</p>
    {categoryTitles.map(([cat, melee, title]) => <Panel key={title} title={title}><div className="weapon-list">{weapons.filter(w => w.category === cat && w.melee === melee).map(w => { const prof = weaponProficient(cls, w); const mm = masteries.find(m => m.id === w.mastery); return <label key={w.id} className={`weapon ${c.weaponIds.includes(w.id) ? 'on' : ''}`}><input type="checkbox" checked={c.weaponIds.includes(w.id)} onChange={() => toggleWeapon(w.id)} /><span><b>{w.name}</b> {prof && <em className="ok">✓ proficiente</em>}<small>{w.damage === '—' ? 'sem dano' : `${w.damage}${w.versatile ? ` (${w.versatile} a duas mãos)` : ''} ${w.damageType}`}{w.range ? ` · alcance ${w.range} pés` : ''} · {w.properties.map(p => propertyNames[p]).join(', ') || 'sem propriedades'}{c.edition === '2024' && mm ? ` · Maestria: ${mm.name}` : ''}</small></span></label>; })}</div></Panel>)}

    {mCount > 0 && <><h4>Maestria de arma ({c.masteries.length}/{mCount})</h4><p className="field-help">{cls.mastery!.rule} Cada maestria dá um efeito extra ao atacar com aquela arma. Você pode trocar após um Descanso Longo.</p>
      <div className="weapon-list">{weapons.filter(w => masteryEligible(cls, w)).map(w => { const m = masteries.find(x => x.id === w.mastery)!; const on = c.masteries.includes(w.id); return <label key={w.id} className={`weapon ${on ? 'on' : ''}`}><input type="checkbox" checked={on} disabled={!on && c.masteries.length >= mCount} onChange={() => patch({ masteries: on ? c.masteries.filter(x => x !== w.id) : [...c.masteries, w.id] })} /><span><b>{w.name}</b> · {m.name}{on && <small>{m.description}</small>}</span></label>; })}</div>
      <Panel title="O que faz cada maestria"><ul className="bullets">{masteries.map(m => <li key={m.id}><b>{m.name}:</b> {m.description}</li>)}</ul></Panel></>}

    {derived.attacks.length > 0 && <><h4>Ataques</h4><AttackTable attacks={derived.attacks} /></>}
    {style && <p className="field-help">Estilo ativo: {style.name}.</p>}
  </>;
}
export function AttackTable({ attacks }: { attacks: ReturnType<typeof derive>['attacks'] }) {
  return <div className="table-wrap"><table className="attack-table"><thead><tr><th>Arma</th><th>Ataque</th><th>Dano</th><th>Notas</th></tr></thead><tbody>{attacks.map(a => <tr key={a.id}><td>{a.name}<small>{labels[a.ability]}</small></td><td>{signed(a.bonus)}</td><td>{a.damage} {a.damageType}{a.versatile ? <small>duas mãos: {a.versatile}</small> : null}</td><td>{[a.mastery && `Maestria: ${a.mastery}`, ...a.notes].filter(Boolean).join(' · ')}</td></tr>)}</tbody></table></div>;
}

// ---- Ficha --------------------------------------------------------------------
export function SheetSummary({ c, derived }: { c: Character; derived: ReturnType<typeof derive> }) {
  const { cls, species, background, subclass, variant } = selections(c);
  const sp = derived.spellcasting;
  return <>
    <div className="vitals big">
      <div><Heart size={18} /><b>{derived.hp ?? '—'}</b><span>Pontos de Vida</span><small>{derived.hitDice}</small></div>
      <div><Shield size={18} /><b>{derived.ac}</b><span>Classe de Armadura</span><small>{derived.acNote}</small></div>
      <div><Swords size={18} /><b>{signed(derived.initiative)}</b><span>Iniciativa</span><small>{derived.alert ? 'inclui Alerta' : 'Destreza'}</small></div>
      <div><Sparkles size={18} /><b>{derived.speed ?? '—'}</b><span>Deslocamento (pés)</span><small>Percepção passiva {derived.passivePerception}</small></div>
    </div>
    {derived.warnings.map(w => <Callout key={w} title="Atenção" tone="warn">{w}</Callout>)}
    {derived.attacks.length > 0 && <Panel title="Ataques" open><AttackTable attacks={derived.attacks} /></Panel>}
    {sp && <Panel title="Magia" open><ul className="bullets"><li><b>CD de salvaguarda:</b> {sp.dc} · <b>Bônus de ataque mágico:</b> {signed(sp.attack)} ({labels[sp.ability]})</li><li><b>Truques:</b> {sp.cantrips} · <b>Magias {cls?.spellcasting?.kind === 'known' ? 'conhecidas' : 'preparadas'}:</b> {sp.prepared}</li>{sp.pact ? <li><b>Magia de Pacto:</b> {sp.pact.count} espaço(s) de {sp.pact.level}º círculo (recuperados em Descanso Curto)</li> : <li><b>Espaços:</b> {sp.slots.length ? sp.slots.map((n, i) => `${i + 1}º: ${n}`).join(' · ') : 'nenhum neste nível'}</li>}</ul><p className="field-help">{cls?.spellcasting?.summary}</p></Panel>}
    <Panel title="Salvaguardas e perícias"><ul className="mini-list">{abilities.map(a => <li key={a}>{cls?.saves.includes(a) ? '● ' : ''}{labels[a]} <b>{signed(derived.saves[a])}</b></li>)}</ul><ul className="mini-list">{allSkills.map(s => <li key={s}>{derived.trained.has(s) ? '● ' : ''}{skillName(s)} <b>{signed(derived.skills[s])}</b></li>)}</ul></Panel>
    <Panel title={`Poderes de ${cls?.name ?? 'classe'}`} open><FeatureList features={derived.classFeatures} /></Panel>
    {subclass && <Panel title={`Subclasse: ${subclass.name}`}><FeatureList features={derived.subclassFeatures} /></Panel>}
    <Panel title={`Traços: ${species?.name ?? 'espécie'}${variant ? ` (${variant.name})` : ''}`}><TraitList traits={derived.speciesTraits} /></Panel>
    {background && <Panel title={`Antecedente: ${background.name}`}><ul className="bullets"><li><b>Ferramentas:</b> {background.tools}</li>{background.feat && <li><b>{background.feat.name}:</b> {background.feat.description}</li>}<li><b>Equipamento:</b> {background.equipment}</li></ul></Panel>}
  </>;
}
