# 🌍 Geo-Explorer

> Um explorador interativo de trilhas de aprendizado com desafios de código e certificados — powered by Node.js e um servidor MCP.

---

## O que é o Geo-Explorer?

O Geo-Explorer é uma ferramenta de linha de comando que permite:

- **Explorar trilhas de aprendizado** para tecnologias populares com planos de estudo semanais estruturados;
- **Receber desafios de código** adequados ao seu nível atual;
- **Gerar certificados fictícios de conclusão** em formato HTML que você pode salvar ou compartilhar.

Ele também inclui um **servidor MCP (Model Context Protocol)** para que assistentes de IA (como o IBM Bob) possam chamar seus recursos diretamente como ferramentas.

---

## Estrutura do Projeto

```
geo-explorer/
├── commands/           # Comandos CLI (trail, challenge, certificate)
├── data/
│   └── trails.json     # Banco de dados de trilhas e desafios
├── certificates/       # Certificados HTML gerados (ignorados pelo git)
├── docs/               # Documentação adicional
├── tests/              # Testes automatizados (Jest)
├── mcp-server/
│   ├── src/index.ts    # Código-fonte do servidor MCP (TypeScript)
│   ├── build/          # Servidor MCP compilado
│   └── tsconfig.json
├── package.json
└── README.md
```

---

## Pré-requisitos

- **Node.js** ≥ 18
- **npm** ≥ 9

---

## Instalação

```bash
git clone https://github.com/<seu-usuario>/geo-explorer.git
cd geo-explorer
npm install
```

---

## Como Usar os Comandos

### 1. `trail` — Explorar uma Trilha de Aprendizado

```bash
node commands/trail.js                        # listar todas as trilhas disponíveis
node commands/trail.js javascript             # trilha completa de JavaScript
node commands/trail.js python iniciante       # trilha de Python filtrada pelo nível iniciante
node commands/trail.js react avancado
```

**Tecnologias disponíveis:** `javascript`, `python`, `typescript`, `react`, `nodejs`

**Níveis disponíveis:** `beginner`, `intermediate`, `advanced`

---

### 2. `challenge` — Obter um Desafio de Código

```bash
node commands/challenge.js javascript beginner
node commands/challenge.js typescript intermediate
node commands/challenge.js react advanced
```

Um desafio aleatório é selecionado do nível. Cada desafio inclui título, descrição e uma dica.

---

### 3. `certificate` — Gerar um Certificado de Conclusão

```bash
node commands/certificate.js javascript beginner "Seu Nome"
node commands/certificate.js react advanced "Maria Silva"
node commands/certificate.js nodejs intermediate "João Santos"
```

Um certificado HTML é salvo na pasta `certificates/`. Abra-o em qualquer navegador.

---

## Executando os Testes

```bash
npm test
```

A suíte de testes cobre a lógica central dos três comandos:

| Arquivo de Teste              | Testes |
|-------------------------------|--------|
| `tests/trail.test.js`         | 7      |
| `tests/challenge.test.js`     | 7      |
| `tests/certificate.test.js`   | 9      |
| **Total**                     | **25** |

---

## Servidor MCP

O servidor MCP expõe as ferramentas do Geo-Explorer para qualquer cliente de IA compatível com MCP (ex.: IBM Bob).

### Build

```bash
npm run mcp:build
```

### Iniciar (transporte stdio)

```bash
npm run mcp:start
```

### Ferramentas MCP Disponíveis

| Ferramenta           | Descrição |
|----------------------|-----------|
| `get_trail`          | Retorna um plano de trilha estruturado. Parâmetros: `technology`, `level` (opcional) |
| `get_challenge`      | Retorna um desafio aleatório. Parâmetros: `technology`, `level` |
| `generate_certificate` | Retorna metadados do certificado como JSON. Parâmetros: `technology`, `level`, `student_name` |

### Registrar no IBM Bob

Adicione ao seu `mcp.json` do Bob:

```json
{
  "mcpServers": {
    "geo-explorer": {
      "command": "node",
      "args": ["/caminho/absoluto/para/geo-explorer/mcp-server/build/index.js"]
    }
  }
}
```

---

## Melhorias Realizadas

- **5 tecnologias** cobertas: JavaScript, Python, TypeScript, React, Node.js
- **3 níveis** por tecnologia com planos de módulos semanais
- **2 desafios por nível por tecnologia** (30 desafios no total)
- Geração de **certificado HTML** com template estilizado salvo em disco
- **Servidor MCP** com TypeScript para integração com assistentes de IA
- **25 testes automatizados** cobrindo todos os caminhos felizes e cenários de erro

---

## O que Aprendi

- Como estruturar um projeto CLI em Node.js com ES Modules
- Como exportar funções para testabilidade preservando os pontos de entrada CLI
- Como construir um servidor MCP tipado com `McpServer` e `registerTool`
- Como escrever testes Jest para módulos ESM usando `--experimental-vm-modules`
- Como gerar artefatos HTML programaticamente a partir do Node.js

---

## Licença

ISC
