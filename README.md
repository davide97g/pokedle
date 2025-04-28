# pokèdle

Wordle-inspired game based on pokemon to guess

[Live Website](https://pokedle.online)

## Tech stack

- Frontend:

  - React 18.2
  - Typescript
  - [Tailwind](https://tailwindcss.com/)
  - [Vite](https://vite.dev/)
  - NextUI (now [HeroUI](https://www.heroui.com/))

- Backend:

  - Node.js
  - Typescript
  - [Express](https://expressjs.com/)

- Services:
  - [Firebase](https://firebase.google.com/)
    - Authentication
    - Database: Firestore NoSQL Database

## Setup

### Requirements

- Node.js (>=20 recommended)
- [PNPM](https://pnpm.io/)

### Local development

In the root:

- `pnpm i` to install dependecies
- `pnpm build` to build the projects (backend & frontend)
- `pnpm dev` to test it locally: will run both frontend and backend, relatively at [http://localhost:8080](http://localhost:8080) and [http://localhost:3000](http://localhost:3000)
