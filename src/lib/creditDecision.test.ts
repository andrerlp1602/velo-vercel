import { describe, expect, it } from 'vitest';
import { decideCreditStatus } from './creditDecision';

const TOTAL = 100000;

describe('decideCreditStatus', () => {
  describe('regra da entrada alta (>= 50% e score < 700)', () => {
    it.each([
      { score: 699, entry: 50000 },
      { score: 501, entry: 60000 },
      // A regra da entrada alta vem primeiro, então aprova mesmo com score baixo
      { score: 500, entry: 50000 },
      { score: 0, entry: TOTAL },
    ])('aprova com score $score e entrada $entry', ({ score, entry }) => {
      expect(decideCreditStatus(score, entry, TOTAL)).toBe('APROVADO');
    });
  });

  describe('score alto (> 700)', () => {
    it.each([
      { score: 701, entry: 0 },
      { score: 1000, entry: 10000 },
      { score: 701, entry: 50000 },
    ])('aprova com score $score e entrada $entry', ({ score, entry }) => {
      expect(decideCreditStatus(score, entry, TOTAL)).toBe('APROVADO');
    });
  });

  describe('score médio (501 a 700) com entrada < 50%', () => {
    it.each([
      { score: 501, entry: 0 },
      { score: 600, entry: 20000 },
      { score: 700, entry: 0 },
      { score: 700, entry: 49990 },
    ])('envia para análise com score $score e entrada $entry', ({ score, entry }) => {
      expect(decideCreditStatus(score, entry, TOTAL)).toBe('EM_ANALISE');
    });
  });

  describe('score baixo (<= 500) com entrada < 50%', () => {
    it.each([
      { score: 500, entry: 0 },
      { score: 420, entry: 20000 },
      { score: 0, entry: 49990 },
    ])('reprova com score $score e entrada $entry', ({ score, entry }) => {
      expect(decideCreditStatus(score, entry, TOTAL)).toBe('REPROVADO');
    });
  });

  describe('fronteira da entrada de 50%', () => {
    it('com exatamente 50% de entrada e score baixo, aprova', () => {
      expect(decideCreditStatus(400, 50000, TOTAL)).toBe('APROVADO');
    });

    it('com 49,99% de entrada e score baixo, reprova', () => {
      expect(decideCreditStatus(400, 49990, TOTAL)).toBe('REPROVADO');
    });
  });

  describe('score exatamente 700', () => {
    // Comportamento atual: nem "score < 700" nem "score > 700" se aplicam,
    // então cai na regra de score médio mesmo com entrada >= 50%.
    it('com entrada >= 50% retorna EM_ANALISE', () => {
      expect(decideCreditStatus(700, 50000, TOTAL)).toBe('EM_ANALISE');
    });
  });
});
