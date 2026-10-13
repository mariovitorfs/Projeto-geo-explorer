#!/usr/bin/env node
/**
 * challenge.js — Gera um desafio de código para uma tecnologia e nível.
 * Uso: node commands/challenge.js <tecnologia> <nível>
 * Exemplo: node commands/challenge.js python intermediate
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadChallenges() {
  const filePath = join(__dirname, '..', 'data', 'trails.json');
  return JSON.parse(readFileSync(filePath, 'utf-8')).challenges;
}

export function getChallenge(technology, level) {
  const challenges = loadChallenges();
  const key = technology.toLowerCase();

  if (!challenges[key]) {
    const available = Object.keys(challenges).join(', ');
    return { error: `Nenhum desafio para "${technology}". Disponíveis: ${available}` };
  }

  const levelChallenges = challenges[key][level ? level.toLowerCase() : 'beginner'];
  if (!levelChallenges) {
    const available = Object.keys(challenges[key]).join(', ');
    return { error: `Nível "${level}" não encontrado para "${technology}". Disponíveis: ${available}` };
  }

  // Pick a random challenge from the level
  const challenge = levelChallenges[Math.floor(Math.random() * levelChallenges.length)];
  return { challenge, technology: key, level: level ? level.toLowerCase() : 'beginner' };
}

function printChallenge(technology, level) {
  const result = getChallenge(technology, level);

  if (result.error) {
    console.error(`\n❌  ${result.error}\n`);
    process.exit(1);
  }

  const { challenge } = result;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`⚡  GEO-EXPLORER — Desafio de Código`);
  console.log(`${'='.repeat(60)}`);
  console.log(`\n🆔  ID         : ${challenge.id}`);
  console.log(`🏷️  Título     : ${challenge.title}`);
  console.log(`🎯  Tecnologia : ${result.technology}`);
  console.log(`📊  Nível      : ${result.level}`);
  console.log(`\n📝  Descrição:`);
  console.log(`   ${challenge.description}`);
  console.log(`\n💡  Dica:`);
  console.log(`   ${challenge.hint}`);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅  Conclua este desafio e depois execute:`);
  console.log(`   node commands/certificate.js "${result.technology}" "${result.level}" "Seu Nome"`);
  console.log(`${'='.repeat(60)}\n`);
}

// Ponto de entrada CLI — executa apenas quando o arquivo é chamado diretamente
import { argv, exit } from 'process';

const isMain = argv[1] && (argv[1].endsWith('challenge.js') || argv[1].endsWith('challenge'));

if (isMain) {
  const [,, techArg, levelArg] = argv;

  if (!techArg) {
    console.log('\n⚡  GEO-EXPLORER — Gerador de Desafios\n');
    console.log('Uso: node commands/challenge.js <tecnologia> <nível>');
    console.log('Exemplo: node commands/challenge.js javascript beginner\n');
    exit(0);
  }

  printChallenge(techArg, levelArg || 'beginner');
}
