#!/usr/bin/env node
/**
 * certificate.js — Gera um certificado fictício de conclusão de trilha de aprendizado.
 * Uso: node commands/certificate.js <tecnologia> <nível> <nome>
 * Exemplo: node commands/certificate.js react advanced "Maria Silva"
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadTrails() {
  const filePath = join(__dirname, '..', 'data', 'trails.json');
  return JSON.parse(readFileSync(filePath, 'utf-8')).trails;
}

export function generateCertificate(technology, level, studentName) {
  const trails = loadTrails();
  const trail = trails.find(
    (t) => t.technology.toLowerCase() === technology.toLowerCase() ||
           t.id.toLowerCase() === technology.toLowerCase()
  );

  if (!trail) {
    const available = trails.map((t) => t.technology).join(', ');
    return { error: `Trilha não encontrada para "${technology}". Disponíveis: ${available}` };
  }

  const normalizedLevel = level ? level.toLowerCase() : 'beginner';
  if (!trail.levels.includes(normalizedLevel)) {
    return { error: `Nível "${level}" não disponível. Escolha: ${trail.levels.join(', ')}` };
  }

  if (!studentName || studentName.trim().length === 0) {
    return { error: 'O nome do aluno é obrigatório.' };
  }

  const issuedAt = new Date();
  const dateStr = issuedAt.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
  const certId = `GEO-${Date.now().toString(36).toUpperCase()}`;

  const certificate = {
    id: certId,
    studentName: studentName.trim(),
    technology: trail.technology,
    level: normalizedLevel,
    issuedAt: issuedAt.toISOString(),
    dateStr,
  };

  return { certificate };
}

function saveCertificateHTML(cert) {
  const outputDir = join(__dirname, '..', 'certificates');
  mkdirSync(outputDir, { recursive: true });

  const filename = `${cert.id}.html`;
  const filePath = join(outputDir, filename);

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Certificado — ${cert.studentName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #f0f4f8;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: Georgia, 'Times New Roman', serif;
    }
    .cert {
      background: #ffffff;
      border: 6px double #3b82d4;
      width: 760px;
      padding: 60px 70px;
      text-align: center;
    }
    .badge { font-size: 56px; margin-bottom: 16px; }
    .title {
      font-size: 12px;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #57606a;
      margin-bottom: 24px;
    }
    .certifies { font-size: 16px; color: #57606a; margin-bottom: 12px; }
    .student-name {
      font-size: 38px;
      color: #1f2328;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .completion {
      font-size: 16px;
      color: #57606a;
      line-height: 1.8;
      margin-bottom: 32px;
    }
    .technology { color: #3b82d4; font-weight: bold; font-size: 20px; }
    .level { color: #7c5cd8; font-weight: bold; font-size: 18px; }
    .meta {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #e5e7eb;
      padding-top: 24px;
      font-size: 12px;
      color: #57606a;
    }
    .seal { margin: 24px auto 16px; }
    .seal-circle {
      width: 80px;
      height: 80px;
      border: 3px solid #3b82d4;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      font-size: 11px;
      color: #3b82d4;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-family: sans-serif;
    }
  </style>
</head>
<body>
  <div class="cert">
    <div class="badge">🌍</div>
    <p class="title">Certificado de Conclusão</p>
    <p class="certifies">Este certificado é apresentado com orgulho a</p>
    <h1 class="student-name">${cert.studentName}</h1>
    <p class="completion">
      por concluir com êxito a trilha de aprendizado de<br/>
      <span class="technology">${cert.technology}</span><br/>
      no nível <span class="level">${cert.level.charAt(0).toUpperCase() + cert.level.slice(1)}</span><br/>
      pela plataforma <strong>Geo-Explorer</strong>.
    </p>
    <div class="seal">
      <div class="seal-circle">Verificado</div>
    </div>
    <div class="meta">
      <span>ID do Certificado: <strong>${cert.id}</strong></span>
      <span>Emitido em: <strong>${cert.dateStr}</strong></span>
    </div>
  </div>
</body>
</html>`;

  writeFileSync(filePath, html, 'utf-8');
  return filePath;
}

function printCertificate(technology, level, studentName) {
  const result = generateCertificate(technology, level, studentName);

  if (result.error) {
    console.error(`\n❌  ${result.error}\n`);
    process.exit(1);
  }

  const { certificate: cert } = result;
  const savedPath = saveCertificateHTML(cert);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🏆  GEO-EXPLORER — Certificado de Conclusão`);
  console.log(`${'='.repeat(60)}`);
  console.log(`\n🎓  Aluno      : ${cert.studentName}`);
  console.log(`📚  Tecnologia : ${cert.technology}`);
  console.log(`📊  Nível      : ${cert.level}`);
  console.log(`📅  Emitido    : ${cert.dateStr}`);
  console.log(`🆔  ID Cert    : ${cert.id}`);
  console.log(`\n📄  Arquivo HTML: ${savedPath}`);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🌍  Parabéns! Abra o arquivo HTML para visualizar seu certificado.`);
  console.log(`${'='.repeat(60)}\n`);
}

// Ponto de entrada CLI — executa apenas quando o arquivo é chamado diretamente
import { argv, exit } from 'process';

const isMain = argv[1] && (argv[1].endsWith('certificate.js') || argv[1].endsWith('certificate'));

if (isMain) {
  const args = argv.slice(2);

  if (args.length < 3) {
    console.log('\n🏆  GEO-EXPLORER — Gerador de Certificados\n');
    console.log('Uso: node commands/certificate.js <tecnologia> <nível> "<seu nome>"');
    console.log('Exemplo: node commands/certificate.js react advanced "Maria Silva"\n');
    exit(0);
  }

  const [techArg, levelArg, ...nameParts] = args;
  printCertificate(techArg, levelArg, nameParts.join(' '));
}
