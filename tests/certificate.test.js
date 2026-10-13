/**
 * tests/certificate.test.js — Testes para o comando certificate
 */
import { generateCertificate } from '../commands/certificate.js';

describe('generateCertificate()', () => {
  test('retorna um certificado para entradas válidas', () => {
    const result = generateCertificate('javascript', 'beginner', 'John Doe');
    expect(result.certificate).toBeDefined();
    expect(result.certificate.studentName).toBe('John Doe');
    expect(result.certificate.technology).toBe('JavaScript');
    expect(result.certificate.level).toBe('beginner');
  });

  test('não diferencia maiúsculas/minúsculas para tecnologia', () => {
    const result = generateCertificate('REACT', 'advanced', 'Jane Doe');
    expect(result.certificate).toBeDefined();
    expect(result.certificate.technology).toBe('React');
  });

  test('certificado possui id único começando com GEO-', () => {
    const result = generateCertificate('python', 'intermediate', 'Alice');
    expect(result.certificate.id).toMatch(/^GEO-/);
  });

  test('certificado possui uma string de data ISO válida', () => {
    const result = generateCertificate('typescript', 'advanced', 'Bob');
    expect(result.certificate.issuedAt).toBeDefined();
    expect(() => new Date(result.certificate.issuedAt)).not.toThrow();
  });

  test('retorna erro para tecnologia desconhecida', () => {
    const result = generateCertificate('cobol', 'beginner', 'Legacy Dev');
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/não encontrada/i);
  });

  test('retorna erro para nível inválido', () => {
    const result = generateCertificate('nodejs', 'guru', 'Dev');
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/nível/i);
  });

  test('retorna erro quando o nome do aluno está vazio', () => {
    const result = generateCertificate('react', 'beginner', '   ');
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/nome/i);
  });

  test('remove espaços em branco do nome do aluno', () => {
    const result = generateCertificate('react', 'beginner', '  Maria  ');
    expect(result.certificate.studentName).toBe('Maria');
  });

  test('dois certificados gerados no mesmo segundo possuem IDs diferentes', async () => {
    const r1 = generateCertificate('javascript', 'beginner', 'Dev Um');
    await new Promise((res) => setTimeout(res, 5));
    const r2 = generateCertificate('javascript', 'beginner', 'Dev Dois');
    expect(r1.certificate.id).not.toBe(r2.certificate.id);
  });
});
