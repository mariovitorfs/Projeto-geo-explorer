#!/usr/bin/env node
/**
 * trail.js — Exibe o plano de uma trilha de aprendizado para uma tecnologia.
 * Uso: node commands/trail.js <tecnologia> [nível]
 * Exemplo: node commands/trail.js javascript beginner
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadTrails() {
  const filePath = join(__dirname, '..', 'data', 'trails.json');
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

export function getTrail(technology, level) {
  const { trails } = loadTrails();
  const trail = trails.find(
    (t) => t.technology.toLowerCase() === technology.toLowerCase() ||
           t.id.toLowerCase() === technology.toLowerCase()
  );

  if (!trail) {
    const available = trails.map((t) => t.technology).join(', ');
    return { error: `Trilha não encontrada para "${technology}". Disponíveis: ${available}` };
  }

  if (level && !trail.levels.includes(level.toLowerCase())) {
    return { error: `Nível "${level}" não disponível. Escolha: ${trail.levels.join(', ')}` };
  }

  return { trail, level: level ? level.toLowerCase() : null };
}

function printTrail(technology, level) {
  const result = getTrail(technology, level);

  if (result.error) {
    console.error(`\n❌  ${result.error}\n`);
    process.exit(1);
  }

  const { trail } = result;
  const targetLevel = result.level;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🗺️  GEO-EXPLORER — Trilha de Aprendizado`);
  console.log(`${'='.repeat(60)}`);
  console.log(`\n📚  Tecnologia : ${trail.technology}`);
  console.log(`📋  Descrição  : ${trail.description}`);
  console.log(`⏱️  Duração    : ${trail.duration}`);
  console.log(`🎯  Níveis     : ${trail.levels.join(' → ')}`);

  const levels = targetLevel ? [targetLevel] : trail.levels;

  for (const lvl of levels) {
    const modules = trail.modules[lvl];
    if (!modules) continue;

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`📗  Nível: ${lvl.charAt(0).toUpperCase() + lvl.slice(1)}`);
    console.log(`${'─'.repeat(60)}`);

    for (const mod of modules) {
      console.log(`\n  Semana ${String(mod.week).padStart(2, '0')} │ ${mod.title}`);
      console.log(`            └ Tópicos: ${mod.topics.join(' • ')}`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`💡  Dica: execute "node commands/challenge.js ${trail.id} <nível>" para obter um desafio!`);
  console.log(`${'='.repeat(60)}\n`);
}

// Ponto de entrada CLI — executa apenas quando o arquivo é chamado diretamente
import { argv, exit } from 'process';

const isMain = argv[1] && (argv[1].endsWith('trail.js') || argv[1].endsWith('trail'));

if (isMain) {
  const [,, techArg, levelArg] = argv;

  if (!techArg) {
    const { trails } = loadTrails();
    console.log('\n🗺️  GEO-EXPLORER — Trilhas Disponíveis\n');
    trails.forEach((t) => {
      console.log(`  • ${t.technology.padEnd(15)} — ${t.description}`);
    });
    console.log('\nUso: node commands/trail.js <tecnologia> [nível]\n');
    exit(0);
  }

  printTrail(techArg, levelArg);
}
