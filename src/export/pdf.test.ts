import { expect, it } from 'vitest';
import { newCharacter } from '../domain/engine';
import { createCharacterPdf } from './pdf';
it('gera A4 e pagina conteúdo longo sem sair da área útil', () => {
  const c = { ...newCharacter('2014'), name: 'Áurea da Colina', notes: 'Memória de uma aventura. '.repeat(150) };
  const pdf = createCharacterPdf(c);
  expect(pdf.internal.pageSize.getWidth()).toBeCloseTo(210, 0);
  expect(pdf.internal.pageSize.getHeight()).toBeCloseTo(297, 0);
  expect(pdf.getNumberOfPages()).toBeGreaterThan(2);
  expect(pdf.output('arraybuffer').byteLength).toBeGreaterThan(1500);
});
