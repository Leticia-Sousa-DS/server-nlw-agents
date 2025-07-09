# Server (NLW Agents)

Este projeto foi desenvolvido durante o evento **NLW Agents** promovido pela Rocketseat. Ele consiste em uma API Node.js moderna, utilizando Fastify, Drizzle ORM e PostgreSQL, com foco em boas práticas de organização e validação.

## Tecnologias e Bibliotecas Utilizadas

- **Node.js** + **TypeScript**: Base do projeto. Utiliza o flag `--experimental-strip-types` para rodar arquivos `.ts` diretamente no Node.js, sem necessidade de transpilar manualmente para JavaScript.
- **Fastify**: Framework web para criação de APIs rápidas e eficientes.
- **@fastify/cors**: Middleware para habilitar CORS.
- **Zod** + **fastify-type-provider-zod**: Validação e tipagem de dados das rotas.
- **Drizzle ORM**: ORM para integração com banco de dados PostgreSQL.
- **postgres**: Driver para conexão com PostgreSQL.
- **dotenv**: Gerenciamento de variáveis de ambiente.
- **@biomejs/biome**: Linter e formatter.
- **drizzle-kit**: Ferramentas de migração e geração de schema para o Drizzle ORM.
- **docker** e **docker-compose**: Para orquestração do banco de dados PostgreSQL.

## Padrões de Projeto e Arquitetura

- **Organização em camadas**: Separação clara entre rotas HTTP (`src/http/routes`), lógica de banco de dados (`src/db`), e configuração de ambiente (`src/env.ts`).
- **Validação centralizada**: Uso de Zod para validação de dados de entrada e saída nas rotas.
- **Migrations e Seeds**: Gerenciamento de schema e dados iniciais via Drizzle ORM.
- **Variáveis de ambiente tipadas**: Validação das variáveis de ambiente com Zod.

## Instruções de Setup

### 1. Clonar o repositório

```bash
git clone <url-do-repo>
cd server
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
PORT=3333
DATABASE_URL=postgresql://usuario:senha@localhost:5433/banco-de-dados
```

### 4. Subir o banco de dados com Docker

```bash
docker-compose up -d
```

### 5. Rodar as migrations e seed

```bash
# Gere as migrations (se necessário)
npx drizzle-kit migrate

# Popule o banco com dados iniciais (opicional)
npm run db:seed
```

### 6. Iniciar o servidor

```bash
npm run dev
```

A API estará disponível em `http://localhost:3333`.

## Exemplos de uso

- **Health check:**  
  `GET http://localhost:3333/health`

- **Listar salas:**  
  `GET http://localhost:3333/rooms`

## Scripts úteis

- `npm run dev`: Inicia o servidor em modo desenvolvimento.
- `npm run start`: Inicia o servidor em modo produção.
- `npm run db:seed`: Popula o banco de dados com dados iniciais.

--- 