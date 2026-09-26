# novaline-fe

Nuxt 4 SSR frontend for the NovaLine ISP website. Tailwind v3, i18n (uk default, `/en`), content from Strapi via server routes (BFF).

## Run

```bash
cp .env.example .env
pnpm install
pnpm dev          # http://localhost:3000 (expects Strapi on :1337)
pnpm build && pnpm typecheck
```

Full stack: `docker compose up --build` in the parent `therecom/` folder.

## Design tokens

All colours live in `app/theme/colors.ts` and are wired into `tailwind.config.ts`. Change a value there — never hardcode colours in components.

## Specs

Spec-driven development with [GitHub Spec Kit](https://github.com/github/spec-kit): `.specify/memory/constitution.md`, features in `specs/NNN-*/`.
