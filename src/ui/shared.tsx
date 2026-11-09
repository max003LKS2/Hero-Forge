import { BookOpen, Check, ChevronRight, EyeOff, Feather, Flame, Hand, Leaf, Moon, Music, Shield, Sparkles, Sun, Swords, Target } from 'lucide-react';
import type { Ability, Feature, RuleOption, Trait, WeaponProperty } from '../domain/types';

export const propertyNames: Record<WeaponProperty, string> = { ammunition: 'Munição', finesse: 'Acuidade', heavy: 'Pesada', light: 'Leve', loading: 'Recarga', range: 'Alcance', reach: 'Alcance estendido', special: 'Especial', thrown: 'Arremesso', 'two-handed': 'Duas mãos', versatile: 'Versátil' };

/** O que cada atributo faz, em linguagem direta, para quem está começando. */
export const abilityInfo: Record<Ability, { summary: string; helps: string[] }> = {
  str: { summary: 'Músculos e potência física.', helps: ['Atletismo: escalar, nadar, empurrar, agarrar', 'ataque e dano com armas corpo a corpo (espadas, machados, martelos)', 'carregar peso e usar armaduras pesadas sem lentidão', 'salvaguardas de Força contra ser empurrado ou derrubado'] },
  dex: { summary: 'Reflexos, equilíbrio e pontaria.', helps: ['Acrobacia, Furtividade e Prestidigitação', 'ataque e dano com arcos, bestas e armas de acuidade (adagas, floretes)', 'CA com armadura leve, média ou sem armadura', 'Iniciativa (agir primeiro) e salvaguardas de Destreza contra explosões e armadilhas'] },
  con: { summary: 'Saúde, resistência e fôlego.', helps: ['PV: cada ponto de modificador vale PV extra em TODOS os níveis', 'salvaguardas de Constituição, inclusive para manter a Concentração em magias', 'resistência a veneno, doença e exaustão'] },
  int: { summary: 'Memória, estudo e raciocínio.', helps: ['Arcanismo, História, Investigação, Natureza e Religião', 'conjuração do Mago (e de alguns subtipos)', 'perceber pistas, decifrar enigmas e lembrar conhecimento'] },
  wis: { summary: 'Percepção, intuição e bom senso.', helps: ['Percepção, Intuição, Medicina, Sobrevivência e Lidar com Animais', 'conjuração de Clérigo, Druida e Patrulheiro, e Percepção passiva (notar emboscadas)', 'salvaguardas de Sabedoria contra encantamentos e medo, que são muito comuns'] },
  cha: { summary: 'Presença, carisma e força de vontade.', helps: ['Persuasão, Enganação, Intimidação e Atuação', 'conjuração de Bardo, Bruxo, Feiticeiro e Paladino', 'liderar, negociar e impressionar'] },
};

const icons = [<Swords key="s" />, <Feather key="f" />, <Sparkles key="p" />, <BookOpen key="b" />];
const classIcons: Record<string, React.ReactNode> = { barbarian: <Flame />, bard: <Music />, cleric: <Sun />, druid: <Leaf />, fighter: <Swords />, monk: <Hand />, paladin: <Shield />, ranger: <Target />, rogue: <EyeOff />, sorcerer: <Sparkles />, warlock: <Moon />, wizard: <BookOpen /> };
export function OptionCards({ options, value, onSelect, badges = {} }: { options: RuleOption[]; value: string; onSelect: (id: string) => void; badges?: Record<string, string> }) {
  return <div className="option-grid">{options.map((o, i) => <article className={`option ${value === o.id ? 'selected' : ''}`} key={o.id}>
    <button className="option-select" aria-pressed={value === o.id} onClick={() => onSelect(o.id)}><span className="option-icon">{classIcons[o.id.split(':')[1]] ?? icons[i % 4]}</span><span className="option-title">{o.name}</span>{badges[o.id] && <span className="badge">{badges[o.id]}</span>}<span className="option-desc">{o.description}</span><span className="option-check">{value === o.id ? <Check size={17} /> : <ChevronRight size={17} />}</span></button>
    <a className="source-link" href={`${o.source.url}#page=${o.source.page}`} target="_blank" rel="noreferrer">{o.source.document} · p. {o.source.page} ↗</a>
  </article>)}</div>;
}
export function FeatureList({ features, level }: { features: Feature[]; level?: number }) {
  return <ul className="feature-list">{features.map(f => <li key={`${f.level}-${f.name}`} className={level !== undefined && f.level > level ? 'future' : ''}><b><span className="lvl">Nível {f.level}</span> {f.name}</b><span>{f.description}</span></li>)}</ul>;
}
export function TraitList({ traits }: { traits: Trait[] }) {
  return <ul className="feature-list">{traits.map(t => <li key={t.name}><b>{t.name}</b><span>{t.description}</span></li>)}</ul>;
}
export function Callout({ title, children, tone = 'info' }: { title: string; children: React.ReactNode; tone?: 'info' | 'good' | 'warn' }) {
  return <div className={`callout ${tone}`}><strong>{title}</strong><div>{children}</div></div>;
}
export function Panel({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return <details className="panel" open={open}><summary>{title}</summary><div className="panel-body">{children}</div></details>;
}
export { ChevronRight };
