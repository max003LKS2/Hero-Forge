import { expect, it } from 'vitest';
import { newCharacter } from '../domain/engine';
import { importCharacter, parseCharacter, readLibrary, saveCharacter, STORAGE_KEY } from './characters';
const memory = () => { const data = new Map<string, string>(); return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); } }; };
it('persiste e atualiza sem duplicar', () => { const storage = memory(); const c = newCharacter(); saveCharacter(storage, c); saveCharacter(storage, { ...c, name: 'Áurea' }); expect(readLibrary(storage)).toHaveLength(1); expect(readLibrary(storage)[0].name).toBe('Áurea'); });
it('JSON roundtrip preserva texto e escolhas', () => { const c = { ...newCharacter('2014'), name: 'João 🐉', notes: 'Ação e memória' }; expect(importCharacter(JSON.stringify(c))).toEqual(c); });
it('não substitui dados locais corrompidos', () => { const storage = memory(); storage.setItem(STORAGE_KEY, '{broken'); expect(() => saveCharacter(storage, newCharacter())).toThrow(); expect(storage.getItem(STORAGE_KEY)).toBe('{broken'); });
it('propaga falha de armazenamento', () => { expect(() => saveCharacter({ getItem: () => null, setItem: () => { throw new Error('quota'); } }, newCharacter())).toThrow('quota'); });
it.each([{ level: 21 }, { schemaVersion: 3 }, { edition: '2025' }, { classId: '2014:fighter' }, { unexpected: 1 }, { name: 'x'.repeat(81) }])('rejeita payload inválido %j', patch => { expect(() => parseCharacter({ ...newCharacter(), ...patch })).toThrow(); });
it('rejeita arquivo grande e JSON inválido', () => { expect(() => importCharacter('x'.repeat(100001))).toThrow('100 KB'); expect(() => importCharacter('{')).toThrow('JSON'); });

