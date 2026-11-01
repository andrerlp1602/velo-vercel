import { describe, expect, it } from 'vitest';
import { isValidCpf, onlyDigits } from './cpf';

describe('onlyDigits', () => {
  it('remove tudo que não é dígito', () => {
    expect(onlyDigits('529.982.247-25')).toBe('52998224725');
    expect(onlyDigits('abc')).toBe('');
  });
});

describe('isValidCpf', () => {
  describe('CPFs válidos', () => {
    it.each(['529.982.247-25', '52998224725'])('aceita %s', (cpf) => {
      expect(isValidCpf(cpf)).toBe(true);
    });

    it('aceita CPF cujo 1º dígito verificador é 0 (resto < 2)', () => {
      expect(isValidCpf('000.000.006-04')).toBe(true);
    });

    it('aceita CPF cujo 2º dígito verificador é 0 (resto < 2)', () => {
      expect(isValidCpf('000.000.018-30')).toBe(true);
    });
  });

  describe('CPFs inválidos', () => {
    it.each([
      ['dígito verificador errado (2º)', '529.982.247-24'],
      ['dígito verificador errado (1º)', '529.982.247-35'],
      ['sequência repetida 111...', '111.111.111-11'],
      ['sequência repetida 000...', '000.000.000-00'],
      ['10 dígitos', '529.982.247-2'],
      ['12 dígitos', '529.982.247-255'],
      ['string vazia', ''],
      ['somente letras', 'abcdefghijk'],
    ])('rejeita %s', (_descricao, cpf) => {
      expect(isValidCpf(cpf)).toBe(false);
    });

    it('rejeita CPF com letras misturadas que não resultam em 11 dígitos', () => {
      expect(isValidCpf('529.982.24A-25')).toBe(false);
    });
  });
});
