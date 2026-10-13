#!/usr/bin/env node
/**
 * Servidor MCP do Geo-Explorer
 * Expõe três ferramentas: get_trail, get_challenge, generate_certificate
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Utilitários de dados ────────────────────────────────────────────────────

function loadData() {
  const filePath = join(__dirname, "..", "..", "data", "trails.json");
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function findTrail(technology: string) {
  const { trails } = loadData();
  return (
    trails.find(
      (t: { technology: string; id: string }) =>
        t.technology.toLowerCase() === technology.toLowerCase() ||
        t.id.toLowerCase() === technology.toLowerCase()
    ) ?? null
  );
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Servidor MCP ────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "geo-explorer",
  version: "1.0.0",
});

// Ferramenta 1 — get_trail
server.registerTool(
  "get_trail",
  {
    description:
      "Retorna um plano de trilha de aprendizado estruturado para uma tecnologia. " +
      "Filtre opcionalmente por nível (beginner | intermediate | advanced).",
    inputSchema: z.object({
      technology: z
        .string()
        .describe(
          "Nome da tecnologia, ex.: javascript, python, typescript, react, nodejs"
        ),
      level: z
        .enum(["beginner", "intermediate", "advanced"])
        .optional()
        .describe("Filtrar por nível. Omita para obter todos os níveis."),
    }),
  },
  async ({ technology, level }) => {
    const trail = findTrail(technology);
    if (!trail) {
      const { trails } = loadData();
      const available = trails
        .map((t: { technology: string }) => t.technology)
        .join(", ");
      return {
        content: [
          {
            type: "text",
            text: `Trilha não encontrada para "${technology}". Disponíveis: ${available}`,
          },
        ],
        isError: true,
      };
    }

    if (level && !trail.levels.includes(level)) {
      return {
        content: [
          {
            type: "text",
            text: `Nível "${level}" não disponível para ${trail.technology}. Escolha: ${trail.levels.join(", ")}`,
          },
        ],
        isError: true,
      };
    }

    const filteredModules = level
      ? { [level]: trail.modules[level] }
      : trail.modules;

    const result = {
      technology: trail.technology,
      description: trail.description,
      duration: trail.duration,
      levels: trail.levels,
      modules: filteredModules,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// Ferramenta 2 — get_challenge
server.registerTool(
  "get_challenge",
  {
    description:
      "Retorna um desafio de código aleatório para uma tecnologia e nível de dificuldade.",
    inputSchema: z.object({
      technology: z
        .string()
        .describe("ID da tecnologia, ex.: javascript, python, typescript, react, nodejs"),
      level: z
        .enum(["beginner", "intermediate", "advanced"])
        .default("beginner")
        .describe("Nível de dificuldade. Padrão: beginner."),
    }),
  },
  async ({ technology, level }) => {
    const { challenges } = loadData();
    const key = technology.toLowerCase();

    if (!challenges[key]) {
      const available = Object.keys(challenges).join(", ");
      return {
        content: [
          {
            type: "text",
            text: `Nenhum desafio para "${technology}". Disponíveis: ${available}`,
          },
        ],
        isError: true,
      };
    }

    const levelChallenges = challenges[key][level];
    if (!levelChallenges || levelChallenges.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `Nenhum desafio encontrado para o nível "${level}" em "${technology}".`,
          },
        ],
        isError: true,
      };
    }

    const challenge = pickRandom<Record<string, unknown>>(levelChallenges);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            { ...challenge, technology: key, level },
            null,
            2
          ),
        },
      ],
    };
  }
);

// Ferramenta 3 — generate_certificate
server.registerTool(
  "generate_certificate",
  {
    description:
      "Gera um certificado fictício de conclusão para uma trilha de aprendizado. " +
      "Retorna os metadados do certificado como JSON (não grava arquivos).",
    inputSchema: z.object({
      technology: z.string().describe("Nome da tecnologia, ex.: javascript, react"),
      level: z
        .enum(["beginner", "intermediate", "advanced"])
        .describe("Nível concluído"),
      student_name: z.string().describe("Nome completo do aluno"),
    }),
  },
  async ({ technology, level, student_name }) => {
    const trail = findTrail(technology);
    if (!trail) {
      const { trails } = loadData();
      const available = trails
        .map((t: { technology: string }) => t.technology)
        .join(", ");
      return {
        content: [
          {
            type: "text",
            text: `Trilha não encontrada para "${technology}". Disponíveis: ${available}`,
          },
        ],
        isError: true,
      };
    }

    if (!trail.levels.includes(level)) {
      return {
        content: [
          {
            type: "text",
            text: `Nível "${level}" não disponível. Escolha: ${trail.levels.join(", ")}`,
          },
        ],
        isError: true,
      };
    }

    const name = student_name.trim();
    if (!name) {
      return {
        content: [{ type: "text", text: "O nome do aluno não pode estar vazio." }],
        isError: true,
      };
    }

    const issuedAt = new Date();
    const certId = `GEO-${Date.now().toString(36).toUpperCase()}`;
    const certificate = {
      id: certId,
      studentName: name,
      technology: trail.technology,
      level,
      issuedAt: issuedAt.toISOString(),
      dateStr: issuedAt.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    return {
      content: [{ type: "text", text: JSON.stringify(certificate, null, 2) }],
    };
  }
);

// ─── Inicialização ───────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Servidor MCP do Geo-Explorer em execução via stdio");
}

main().catch((error) => {
  console.error("Erro fatal:", error);
  process.exit(1);
});
