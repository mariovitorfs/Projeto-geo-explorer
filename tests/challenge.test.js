/**
 * tests/challenge.test.js — Testes para o comando challenge
 */
import { getChallenge, loadChallenges } from '../commands/challenge.js';

describe('loadChallenges()', () => {
  test('retorna um objeto com chaves de desafios por tecnologia', () => {
    const challenges = loadChallenges();
    expect(challenges).toBeDefined();
    expect(typeof challenges).toBe('object');
    expect(Object.keys(challenges).length).toBeGreaterThan(0);
  });
});

describe('getChallenge()', () => {
  test('retorna um desafio para uma tecnologia e nível válidos', () => {
    const result = getChallenge('javascript', 'beginner');
    expect(result.challenge).toBeDefined();
    expect(result.challenge).toHaveProperty('id');
    expect(result.challenge).toHaveProperty('title');
    expect(result.challenge).toHaveProperty('description');
    expect(result.challenge).toHaveProperty('hint');
  });

  test('não diferencia maiúsculas/minúsculas para tecnologia', () => {
    const result = getChallenge('PYTHON', 'intermediate');
    expect(result.challenge).toBeDefined();
  });

  test('usa beginner como padrão quando nenhum nível é especificado', () => {
    const result = getChallenge('typescript', null);
    expect(result.level).toBe('beginner');
  });

  test('retorna erro para uma tecnologia desconhecida', () => {
    const result = getChallenge('rust', 'beginner');
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/nenhum desafio/i);
  });

  test('retorna erro para um nível inválido', () => {
    const result = getChallenge('react', 'godmode');
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/nível/i);
  });

  test('o id do desafio retornado começa com o prefixo da tecnologia', () => {
    const result = getChallenge('nodejs', 'advanced');
    expect(result.challenge.id).toMatch(/^nd-/);
  });

  test('todas as tecnologias possuem desafios no nível beginner', () => {
    const challenges = loadChallenges();
    for (const tech of Object.keys(challenges)) {
      expect(challenges[tech].beginner).toBeDefined();
      expect(challenges[tech].beginner.length).toBeGreaterThan(0);
    }
  });
});
