/**
 * tests/trail.test.js — Testes para o comando trail
 */
import { getTrail, loadTrails } from '../commands/trail.js';

describe('loadTrails()', () => {
  test('retorna um objeto com um array de trilhas', () => {
    const data = loadTrails();
    expect(data).toHaveProperty('trails');
    expect(Array.isArray(data.trails)).toBe(true);
    expect(data.trails.length).toBeGreaterThan(0);
  });
});

describe('getTrail()', () => {
  test('retorna uma trilha para uma tecnologia válida', () => {
    const result = getTrail('javascript');
    expect(result.trail).toBeDefined();
    expect(result.trail.technology).toBe('JavaScript');
  });

  test('não diferencia maiúsculas/minúsculas no nome da tecnologia', () => {
    const result = getTrail('PYTHON');
    expect(result.trail).toBeDefined();
    expect(result.trail.technology).toBe('Python');
  });

  test('encontra trilha pelo id (ex.: "nodejs")', () => {
    const result = getTrail('nodejs');
    expect(result.trail).toBeDefined();
    expect(result.trail.id).toBe('nodejs');
  });

  test('retorna erro para uma tecnologia desconhecida', () => {
    const result = getTrail('cobol');
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/não encontrada/i);
  });

  test('retorna a trilha filtrada pelo nível quando um nível é fornecido', () => {
    const result = getTrail('react', 'beginner');
    expect(result.trail).toBeDefined();
    expect(result.level).toBe('beginner');
  });

  test('retorna erro para um nível inválido', () => {
    const result = getTrail('react', 'expert');
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/nível/i);
  });

  test('trilha possui campos obrigatórios: id, technology, description, duration, levels, modules', () => {
    const { trail } = getTrail('typescript');
    expect(trail).toHaveProperty('id');
    expect(trail).toHaveProperty('technology');
    expect(trail).toHaveProperty('description');
    expect(trail).toHaveProperty('duration');
    expect(trail).toHaveProperty('levels');
    expect(trail).toHaveProperty('modules');
  });
});
