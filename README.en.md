# Smart-Order

[🇧🇷 Português](README.md) | **🇺🇸 English**

An order and table-tab (comanda) management system for restaurants, bars, hotels, and similar venues: opening/closing tabs, sending orders to the kitchen, and alerting waiters when orders are ready.

## Table of contents

- [Domain](#domain)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Folder structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Environment setup](#environment-setup)
- [Running the project](#running-the-project)
- [Database (Prisma)](#database-prisma)
- [Tests](#tests)
- [Exploring the API](#exploring-the-api)
- [Available scripts](#available-scripts)
- [Contribution conventions](#contribution-conventions)
- [Additional documentation](#additional-documentation)

## Domain

The full domain glossary (with terms to avoid and the reasoning behind each decision) lives in [`CONTEXT.md`](./CONTEXT.md) — written in Portuguese, as it's the project's ubiquitous language, but the code identifiers themselves are in English. Summary of the core concepts:

| Term | What it is |
| --- | --- |
| **Company** | Legal entity that owns one or more Establishments. |
| **Establishment** | A restaurant/bar/hotel — the product's tenant instance and the data isolation boundary. |
| **Collaborator** | A person working at one Establishment with an operational role (`Waiter`, `KitchenStaff`, `Cashier`, `Owner`...). Decoupled from the login `User`. |
| **User** | Authentication identity (login), independent of the operational role. |
| **CompanyRole** / **EstablishmentAccess** | Administrative access of a `User` to a Company/Establishment (admin RBAC, ADR-0010). |
| **Cartão** (card) | Physical numbered object (QR code) handed to the customer, reused across visits. |
| **Comanda** (`CustomerCard` in code) | A single visit record, opened by scanning a Cartão. Lifecycle: `OPEN → IN_USE → CLOSED/CANCELLED`. |
| **Order** | An order placed on a Comanda, grouping one or more `OrderItem`s. Becomes `READY` (derived) once all its items are prepared, triggering an alert to the assigned Waiter(s). |
| **OrderItem** | A single item in an Order with its own kitchen lifecycle: `created → preparing → prepared → delivered`. |

Relevant architectural decisions (one per topic) live in [`docs/adr/`](./docs/adr/) — worth reading before touching a new area.

## Architecture

Every domain module under `src/core/<module>` follows the same layout:

```
<module>/
├── domain/            # Entities, value objects, errors, events, ports (interfaces), repository contracts
├── dto/                # Input/output DTOs (validated with class-validator)
└── infrastructure/     # Controller, service, Nest module, Prisma/in-memory repositories, event listeners
```

Guiding principles (see the ADRs for the full rationale):

- **Modules integrate through ports and events, not direct imports across domains** (ADR-0005) — e.g. `OrdersModule` notifies through a `CollaboratorAlertNotifier` port instead of depending on `CollaboratorsModule` directly.
- **Entities are decoupled from the login identity** — `Collaborator`/`Waiter` don't depend on `User` (ADR-0003, ADR-0009), so the same person can have different bindings in different contexts.
- `src/shared/` holds everything cross-cutting: `entities/` (`EntityBase`), `errors/`, `infrastructure/` (domain exception filter, `EnvConfigModule`, Prisma), `repositories/` (generic contract + in-memory implementation for tests), `validators/`, and `vo/` (value objects, e.g. unique UUID).
- `packages/payments-sdk` is a separate npm workspace: a hexagonal payments core, agnostic of provider and framework (with a dedicated adapter to plug into NestJS).

## Tech stack

- **Runtime/language**: Node.js 22, TypeScript (strict null checks, `target ES2023`)
- **Framework**: NestJS 11 (`@nestjs/cqrs` available for modules that need it)
- **Database**: PostgreSQL 16, via Prisma 6 (modular schema in `prisma/schema/*.prisma`)
- **Validation**: `class-validator` / `class-transformer`
- **API docs**: Swagger (`@nestjs/swagger`), served at `/api`
- **Tests**: Jest (unit and e2e) + Supertest
- **Lint/format**: ESLint (flat config) + Prettier
- **Containers**: Docker / Docker Compose (local and test Postgres instances)

## Folder structure

```
smart-order/
├── src/
│   ├── core/                  # Domain modules (orders, companies, establishments,
│   │                           #   collaborators, customer-cards, access-control)
│   ├── users/                  # Auth/identity module (User)
│   ├── shared/                 # Cross-cutting code (entities, errors, repositories, vo, validators)
│   ├── config/prisma/          # PrismaService/PrismaModule
│   ├── app.module.ts
│   └── main.ts                 # Nest bootstrap + Swagger + global exception filter
├── prisma/schema/               # Modular Prisma schema (one file per entity) + migrations
├── packages/payments-sdk/       # Separate npm workspace — hexagonal payments core
├── test/                        # e2e tests (Supertest) + e2e Jest config
├── http/                        # `.http` request collections for manual API testing (REST Client)
├── docs/adr/                    # Architecture Decision Records
├── docs/agents/                 # How AI agents should operate in this repo (issues, domain, labels)
├── openspec/                    # Spec-driven flow for proposing/applying changes (see `opsx:*` skills)
└── CONTEXT.md                   # Domain glossary (ubiquitous language, in Portuguese)
```

## Prerequisites

- Node.js 22+
- npm
- Docker and Docker Compose (to run local Postgres without installing anything on your machine)

## Environment setup

The project uses three environment files, each with a different role:

| File | When it's used |
| --- | --- |
| `.env` | Read automatically by **Docker Compose** to interpolate `${PORT}`, `${POSTGRES_*}`, etc. in `docker-compose.yml`. |
| `.env.development` | Loaded by the application when `NODE_ENV=development` (the `start:dev` script). |
| `.env.test` | Loaded by the application when `NODE_ENV=test` (the `test-unit*` and e2e test scripts). Points to the `db-test` database (port `5433`), isolated from the dev database. |

`EnvConfigModule` (`src/shared/infrastructure/env-config`) always loads `.env.${NODE_ENV}` — that's why each environment needs its own file.

To get started:

```bash
cp .env.example .env
cp .env.example .env.development
cp .env.example .env.test   # adjust port/DB to the test database (5433 / db-smart-test)
```

The defaults in `.env.example` already work with this repo's `docker-compose.yml`.

## Running the project

```bash
# 1. Install dependencies
npm install

# 2. Start Postgres (dev + test)
docker-compose up -d db db-test

# 3. Apply migrations
npx prisma migrate dev

# 4. Run in watch mode
npm run start:dev
```

The API starts at `http://localhost:3001` (the `PORT` default in `.env.development`), and Swagger docs are served at `http://localhost:3001/api`.

Alternative: single-container run (spins up the app + `db`, as defined in `docker-compose.yml`):

```bash
npm run up
```

## Database (Prisma)

The schema is modular — one `.prisma` file per entity under `prisma/schema/` (`company.prisma`, `establishment.prisma`, `collaborator.prisma`, `order.prisma`, `customer-card.prisma`, `user.prisma`, `company-role.prisma`, `establishment-access.prisma`), tied together by `prisma/schema/schema.prisma`.

```bash
npx prisma migrate dev      # create/apply a new dev migration
npx prisma generate         # regenerate the Prisma Client after a schema change
npx prisma studio           # inspect the database visually
```

## Tests

```bash
npm run test-unit           # unit tests (*.spec.ts colocated with the code, in __tests__/)
npm run test-unit:watch     # unit tests in watch mode
npm run test-unit:cov       # unit tests with coverage
npm run test:e2e            # e2e tests (Supertest), in test/*.e2e-spec.ts, boots the full app
```

Unit tests run with `NODE_ENV=test`, loading `.env.test` — make sure `db-test` is up (`docker-compose up -d db-test`) before running suites that touch Prisma repositories.

## Exploring the API

- **Swagger**: `http://localhost:3001/api` while the server is running.
- **`.http` collections**: the [`http/`](./http) folder has ready-to-use requests (REST Client / IntelliJ HTTP Client format) for the main flows — comandas, orders, cancellation, waiters, users.

## Available scripts

| Script | What it does |
| --- | --- |
| `npm run build` | Compiles with the Nest CLI (`dist/`) |
| `npm run start` | Starts the app (no watch) |
| `npm run start:dev` | Starts in watch mode, with `NODE_ENV=development` |
| `npm run start:debug` | Watch mode + Node debugger |
| `npm run start:swc` | Starts using the SWC compiler (faster) |
| `npm run start:prod` | Runs the already-built app (`dist/main`) |
| `npm run lint` | ESLint with `--fix` over `src/`, `apps/`, `libs/`, `test/` |
| `npm run format` | Prettier `--write` over `src/` and `test/` |
| `npm run test-unit` | Unit tests |
| `npm run test-unit:watch` | Unit tests in watch mode |
| `npm run test-unit:cov` | Unit tests with coverage |
| `npm run test:e2e` | e2e tests |
| `npm run test:debug` | Tests with the Node debugger attached |
| `npm run up` | `docker-compose down && docker-compose up` |

## Contribution conventions

- **Code in English** (identifiers, classes, internal messages); **Portuguese only in the UI/labels** shown to end users — see term-by-term examples in `CONTEXT.md`.
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) scoped to the module, with a Portuguese description, e.g. `feat(orders): adiciona política de cancelamento`.
- **Architectural decisions**: a meaningful structural change gets a new ADR in `docs/adr/`.
- **New domain vocabulary**: update `CONTEXT.md` — don't invent synonyms for terms the glossary already covers (see each term's "Avoid" section).
- **Issues**: managed via the `gh` CLI in this repo (`jrodrigo887/smart-order`); see `docs/agents/issue-tracker.md`.
- **Larger changes**: this repo has an optional spec-driven flow (`openspec/`, `opsx:*` skills) to propose, apply, and archive changes before coding.

## Additional documentation

- [`CONTEXT.md`](./CONTEXT.md) — domain glossary (ubiquitous language)
- [`docs/adr/`](./docs/adr/) — Architecture Decision Records
- [`docs/agents/`](./docs/agents/) — how AI agents should operate in this repo (issues, domain, triage labels)
- [`openspec/`](./openspec/) — spec-driven flow for proposing/applying/archiving changes
