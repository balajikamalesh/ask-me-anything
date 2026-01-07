# Ask Me Anything

Ask Me Anything is an interactive quiz and practice app built with Next.js and TypeScript. It supports multiple game types (open-ended, true/false, multiple choice), records game history, and uses a PostgreSQL database via Prisma for persistence. The project includes server-side API routes, a component-driven React frontend (app router), and integrations for authentication and generative AI.

Link: https://quiz-engine-n56ekcfhc-balajikamaleshs-projects.vercel.app/

## Table of Contents

- **Overview**
- **Tech stack**
- **High-level architecture**
- **Low-level design**
	- Database schema
	- API routes
	- Frontend components
- **Setup & development**
- **Testing & linting**
- **Deployment**
- **Potential improvements / roadmap**

## Overview

This application provides a fast, modern interface for practicing quiz-style questions. It supports three game types:

- Open-ended: users type answers; similarity scoring is used to evaluate correctness.
- True/False: simple boolean answers.
- Multiple Choice: selectable options and scoring per choice.

The system records each game and its questions so users can review history and statistics.

## Tech stack

- Frontend: Next.js (App Router), React 19, TypeScript
- Styling: PostCSS / Tailwind CSS utilities (project ships with PostCSS config)
- State & data fetching: `@tanstack/react-query`
- Forms: `react-hook-form` + `@hookform/resolvers`
- Authentication: `@clerk/nextjs` (installed)
- AI & language processing: `@google/generative-ai` (present in dependencies)
- Database: PostgreSQL (via Prisma ORM)
- ORM: `prisma` with generated client in `generated/prisma`
- Utilities: `date-fns`, `keyword-extractor`, `d3-scale`, `lucide-react`
- Tooling: Prettier, ESLint, TypeScript

## High-level architecture

The app follows a standard full-stack Next.js 13+ layout using the App Router:

- Client: UI components live in `src/components` and pages live under `src/app`.
- Server: API routes under `src/app/api/*` implement endpoints for game actions, scoring, and analytics.
- Database: Prisma models defined in `prisma/schema.prisma` persist `User`, `Game`, and `Question` data.
- Server utilities: `src/server/db.ts` instantiates the Prisma client and centralizes DB access.
- Env and config: `src/env.js` validates required environment variables at build time.

A simplified request flow:

1. User initiates a game in the browser.
2. Client calls API routes (e.g., `/api/game`) to create or update `Game` and `Question` records.
3. Server persists data to Postgres via Prisma.
4. UI displays questions and uses AI/utility routes (e.g., answer checking endpoints) to evaluate open-ended responses.

## Low-level design

### Database schema (summary)

Defined in `prisma/schema.prisma` (source of truth). Key models:

- `User`
	- `id` (cuid), `emailAddress` (unique), `imageUrl`, `firstName`, `lastName`
- `Game`
	- `id`, `topic`, `userEmail`, `timeStarted`, `timeEnded`, `gametype` (enum)
	- Relation: `questions` -> `Question[]`
- `Question`
	- `id`, `gameId` (FK), `question`, `answer`, `options` (JSON for MCQs), correctness flags, `userAnswer`, `percentCorrect`

Enum `GameType` values: `open_ended`, `true_false`, `multiple_choice`.

Refer to `prisma/schema.prisma` for full definitions.

### API routes (in `src/app/api`)

Routes present in the codebase (each implements server logic for the app):

- `checkAnswer/route.ts` — evaluate answers (likely used for true/false and MCQ scoring)
- `checkAnswerSimilarity/route.ts` — used for open-ended similarity scoring
- `game/route.ts` — create/update game records
- `hotTopics/route.ts` — return trending topics or suggestions
- `questions/route.ts` — load or add questions
- `recent-activity/route.ts` — fetch recent activity/history

Implementation note: API routes use server-side logic and Prisma client in `src/server/db.ts`.

### Frontend components (key files)

- `src/app/page.tsx` and pages under `src/app/play/*` — main UI and game flows
- `src/components/MultipleChoice.tsx`, `OpenEnded.tsx`, `TrueFalse` (pages under `play/*`) — question UIs
- `src/components/QuizCreation.tsx` — quiz creation UI
- `src/components/dashboard/*` — cards and dashboard widgets
- `src/components/CustomWordCloud.tsx` — visualization support
- `src/components/ui/*` — small design-system primitives (button, card, form input, etc.)

State and server interactions are typically handled with `react-query` and fetch calls to the API routes.

## Potential improvements & roadmap

Future ideas:

- Add comprehensive tests (unit + integration) for API routes and core utilities.
- Real-time multiplayer games with WebSockets for synchronous quizzes.
- Add analytics & dashboards showing long-term trends, question difficulty, and per-user progress.
- Improve accessibility (a11y) and add i18n/localization support.
- Add export/import for quizzes (JSON/CSV) and shareable quiz links.

## Where to look in the codebase

- App entry & routes: `src/app`
- Components: `src/components`
- Server DB client: `src/server/db.ts`
- Prisma schema: `prisma/schema.prisma`
- Env validation: `src/env.js`
- Generated Prisma client: `generated/prisma`
