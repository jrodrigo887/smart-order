# Smart-Order

**🇧🇷 Português** | [🇺🇸 English](README.en.md)

Sistema de gestão de comandas e pedidos para restaurantes, bares, hotéis e outros estabelecimentos: abertura/fechamento de comandas, envio de pedidos para a cozinha e alertas aos garçons quando os pedidos ficam prontos.

## Sumário

- [Domínio](#domínio)
- [Arquitetura](#arquitetura)
- [Stack técnica](#stack-técnica)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Rodando o projeto](#rodando-o-projeto)
- [Banco de dados (Prisma)](#banco-de-dados-prisma)
- [Testes](#testes)
- [Explorando a API](#explorando-a-api)
- [Scripts disponíveis](#scripts-disponíveis)
- [Convenções de contribuição](#convenções-de-contribuição)
- [Documentação adicional](#documentação-adicional)

## Domínio

O glossário completo do domínio (com termos a evitar e o porquê de cada decisão) vive em [`CONTEXT.md`](./CONTEXT.md). Resumo dos conceitos principais:

| Termo | O que é |
| --- | --- |
| **Company** | Pessoa jurídica dona de um ou mais Establishments. |
| **Establishment** | Um restaurante/bar/hotel — a instância (tenant) do produto e o limite de isolamento de dados. |
| **Collaborator** | Pessoa que trabalha em um Establishment com um papel operacional (`Waiter`, `KitchenStaff`, `Cashier`, `Owner`...). Desacoplado do `User` de login. |
| **User** | Identidade de autenticação (login), independente do papel operacional. |
| **CompanyRole** / **EstablishmentAccess** | Acesso administrativo de um `User` a uma Company/Establishment (RBAC administrativo, ADR-0010). |
| **Cartão** | Objeto físico numerado (QR code) entregue ao cliente, reaproveitado entre atendimentos. |
| **Comanda** (`CustomerCard` no código) | Registro de um atendimento, aberto ao escanear um Cartão. Ciclo de vida: `ABERTA → EM_USO → FECHADA/CANCELADA`. |
| **Order** | Um pedido lançado numa Comanda, agrupando um ou mais `OrderItem`. Fica `PRONTO` (derivado) quando todos os itens são preparados, disparando alerta ao(s) Waiter(s). |
| **OrderItem** | Item de um Order com ciclo próprio na cozinha: `criado → em preparo → preparado → entregue`. |

As decisões arquiteturais relevantes (uma por tema) estão em [`docs/adr/`](./docs/adr/) — vale ler antes de mexer numa área nova.

## Arquitetura

Cada módulo de domínio em `src/core/<módulo>` segue o mesmo layout:

```
<módulo>/
├── domain/            # Entidades, VOs, erros, eventos, portas (interfaces) e contratos de repositório
├── dto/                # DTOs de entrada/saída (validação com class-validator)
└── infrastructure/     # Controller, service, módulo Nest, repositórios Prisma/in-memory, listeners de evento
```

Princípios (ver ADRs para o racional completo):

- **Módulos se integram por portas e eventos, não por import direto entre domínios** (ADR-0005) — ex.: `OrdersModule` notifica via `CollaboratorAlertNotifier` (porta), não conhece `CollaboratorsModule` diretamente.
- **Entidades desacopladas de identidade de login** — `Collaborator`/`Waiter` não dependem de `User` (ADR-0003, ADR-0009), permitindo que a mesma pessoa tenha vínculos diferentes em contextos diferentes.
- `src/shared/` concentra o que é transversal a todos os módulos: `entities/` (`EntityBase`), `errors/`, `infrastructure/` (filtro de exceções de domínio, `EnvConfigModule`, Prisma), `repositories/` (contrato genérico + implementação in-memory para testes), `validators/` e `vo/` (value objects, ex. UUID único).
- `packages/payments-sdk` é um workspace npm separado: núcleo hexagonal de pagamentos, agnóstico de provedor e de framework (usa um adapter dedicado para se plugar no NestJS).

## Stack técnica

- **Runtime/linguagem**: Node.js 22, TypeScript (strict null checks, `target ES2023`)
- **Framework**: NestJS 11 (`@nestjs/cqrs` disponível para os módulos que precisarem)
- **Banco de dados**: PostgreSQL 16, via Prisma 6 (schema modular em `prisma/schema/*.prisma`)
- **Validação**: `class-validator` / `class-transformer`
- **Documentação de API**: Swagger (`@nestjs/swagger`), servido em `/api`
- **Testes**: Jest (unitários e e2e) + Supertest
- **Lint/format**: ESLint (flat config) + Prettier
- **Containers**: Docker / Docker Compose (Postgres local e de teste)

## Estrutura de pastas

```
smart-order/
├── src/
│   ├── core/                  # Módulos de domínio (orders, companies, establishments,
│   │                           #   collaborators, customer-cards, access-control)
│   ├── users/                  # Módulo de autenticação/identidade (User)
│   ├── shared/                 # Código transversal (entities, errors, repositories, vo, validators)
│   ├── config/prisma/          # PrismaService/PrismaModule
│   ├── app.module.ts
│   └── main.ts                 # Bootstrap Nest + Swagger + filtro global de exceções
├── prisma/schema/               # Schema Prisma modular (um arquivo por entidade) + migrations
├── packages/payments-sdk/       # Workspace npm separado — núcleo hexagonal de pagamentos
├── test/                        # Testes e2e (Supertest) + config do Jest e2e
├── http/                        # Coleções `.http` para testar a API manualmente (REST Client)
├── docs/adr/                    # Architecture Decision Records
├── docs/agents/                 # Como agentes de IA devem operar neste repo (issues, domínio, labels)
├── openspec/                    # Fluxo spec-driven para propor/aplicar mudanças (ver skills `opsx:*`)
└── CONTEXT.md                   # Glossário de domínio (ubiquitous language)
```

## Pré-requisitos

- Node.js 22+
- npm
- Docker e Docker Compose (para subir o Postgres local sem instalar nada na máquina)

## Configuração do ambiente

O projeto usa três arquivos de variáveis de ambiente, cada um com um papel diferente:

| Arquivo | Quando é usado |
| --- | --- |
| `.env` | Lido automaticamente pelo **Docker Compose** para interpolar `${PORT}`, `${POSTGRES_*}` etc. no `docker-compose.yml`. |
| `.env.development` | Carregado pela aplicação quando `NODE_ENV=development` (script `start:dev`). |
| `.env.test` | Carregado pela aplicação quando `NODE_ENV=test` (scripts `test-unit*`, testes e2e). Aponta para o banco `db-test` (porta `5433`), isolado do banco de desenvolvimento. |

`EnvConfigModule` (`src/shared/infrastructure/env-config`) sempre carrega o arquivo `.env.${NODE_ENV}` — por isso cada ambiente precisa do seu próprio arquivo.

Para começar:

```bash
cp .env.example .env
cp .env.example .env.development
cp .env.example .env.test   # ajuste a porta/DB para o banco de teste (5433 / db-smart-test)
```

Os valores default em `.env.example` já funcionam com o `docker-compose.yml` deste repo.

## Rodando o projeto

```bash
# 1. Instalar dependências
npm install

# 2. Subir o Postgres (dev + teste) via Docker
docker-compose up -d db db-test

# 3. Aplicar as migrations
npx prisma migrate dev

# 4. Rodar em modo watch
npm run start:dev
```

A API sobe em `http://localhost:3001` (valor default de `PORT` no `.env.development`) e a documentação Swagger fica em `http://localhost:3001/api`.

Alternativa via container único (sobe app + `db`, definido em `docker-compose.yml`):

```bash
npm run up
```

## Banco de dados (Prisma)

O schema é modular — um arquivo `.prisma` por entidade em `prisma/schema/` (`company.prisma`, `establishment.prisma`, `collaborator.prisma`, `order.prisma`, `customer-card.prisma`, `user.prisma`, `company-role.prisma`, `establishment-access.prisma`), unidos por `prisma/schema/schema.prisma`.

```bash
npx prisma migrate dev      # cria/aplica uma nova migration em dev
npx prisma generate         # regenera o Prisma Client após mudar o schema
npx prisma studio           # inspeciona o banco visualmente
```

## Testes

```bash
npm run test-unit           # testes unitários (*.spec.ts colocados junto ao código, em __tests__/)
npm run test-unit:watch     # unitários em modo watch
npm run test-unit:cov       # unitários com cobertura
npm run test:e2e            # testes e2e (Supertest), em test/*.e2e-spec.ts, sobe a aplicação inteira
```

Os testes unitários rodam com `NODE_ENV=test`, carregando `.env.test` — garanta que `db-test` esteja no ar (`docker-compose up -d db-test`) antes de rodar suites que tocam repositórios Prisma.

## Explorando a API

- **Swagger**: `http://localhost:3001/api` com o servidor rodando.
- **Coleções `.http`**: a pasta [`http/`](./http) tem requisições prontas (formato REST Client / IntelliJ HTTP Client) para os principais fluxos — comandas, pedidos, cancelamento, garçons, usuários.

## Scripts disponíveis

| Script | O que faz |
| --- | --- |
| `npm run build` | Compila com o Nest CLI (`dist/`) |
| `npm run start` | Sobe a aplicação (sem watch) |
| `npm run start:dev` | Sobe em modo watch, com `NODE_ENV=development` |
| `npm run start:debug` | Modo watch + debugger do Node |
| `npm run start:swc` | Sobe usando o compilador SWC (mais rápido) |
| `npm run start:prod` | Roda o build já compilado (`dist/main`) |
| `npm run lint` | ESLint com `--fix` sobre `src/`, `apps/`, `libs/`, `test/` |
| `npm run format` | Prettier `--write` sobre `src/` e `test/` |
| `npm run test-unit` | Testes unitários |
| `npm run test-unit:watch` | Testes unitários em watch |
| `npm run test-unit:cov` | Testes unitários com cobertura |
| `npm run test:e2e` | Testes e2e |
| `npm run test:debug` | Testes com o debugger do Node anexado |
| `npm run up` | `docker-compose down && docker-compose up` |

## Convenções de contribuição

- **Código em inglês** (identificadores, classes, mensagens internas); **PT-BR só na interface/rótulos** exibidos ao usuário final — ver exemplos termo a termo em `CONTEXT.md`.
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) com escopo do módulo e descrição em português, ex. `feat(orders): adiciona política de cancelamento`.
- **Decisões de arquitetura**: uma mudança estrutural relevante ganha um ADR novo em `docs/adr/`.
- **Novo vocabulário de domínio**: atualize `CONTEXT.md` — não crie sinônimos para termos que o glossário já cobre (veja a seção "Avoid" de cada termo).
- **Issues**: gerenciadas via `gh` CLI neste repositório (`jrodrigo887/smart-order`); ver `docs/agents/issue-tracker.md`.
- **Mudanças maiores**: este repo usa um fluxo spec-driven opcional (`openspec/`, skills `opsx:*`) para propor, aplicar e arquivar mudanças antes de codar.

## Documentação adicional

- [`CONTEXT.md`](./CONTEXT.md) — glossário de domínio (ubiquitous language)
- [`docs/adr/`](./docs/adr/) — Architecture Decision Records
- [`docs/agents/`](./docs/agents/) — como agentes de IA devem operar neste repo (issues, domínio, labels de triagem)
- [`openspec/`](./openspec/) — fluxo spec-driven para propor/aplicar/arquivar mudanças
