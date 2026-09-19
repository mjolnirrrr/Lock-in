# Lock In — Ionic Angular (Mock Data Only)

A fully working study-planner app built with **Ionic + Angular (standalone components)**.
There is **no backend** — every piece of data (subjects, tasks, materials, profile stats)
lives in one in-memory service, so the whole thing runs instantly with no API keys,
no database, and no network calls.

## Features

- **Onboarding + Auth flow** — Login, Sign up, Forgot password, Reset password (all mocked
  with simulated network delay so loading states feel real; any email/password "works").
- **Home dashboard** — greeting, today's plan with tap-to-complete tasks, upcoming session,
  horizontally scrolling subject chips, quick actions.
- **Calendar** — week strip + day agenda pulled from the same task store as Home.
- **My Study** — subject list with progress bars, recent materials, quick actions.
- **Materials** — full file library with subject filter chips and delete.
- **Add Quiz/Activity** and **Add Materials** — real modals (Ionic `ModalController`)
  that write into the shared mock data store, so anything you add shows up immediately
  on Home, Calendar, and Study.
- **Stats** — streak, total hours, quizzes taken, average score, per-subject progress.
- **Profile** — account card, preference toggles, logout.

## Why it's structured this way

Everything reads and writes through **`src/app/services/mock-data.service.ts`**, which
uses Angular **signals** as an in-memory store. No component talks to `localStorage`,
a REST API, or Firebase directly. When you're ready to add a real backend:

1. Keep the same public method names (`addTask`, `addMaterial`, `toggleTaskDone`, etc.)
2. Swap the internals of `mock-data.service.ts` for `HttpClient` calls.
3. Nothing in the pages/components needs to change.

The same pattern applies to `mock-auth.service.ts` for login/signup/reset.

## Getting started

```bash
npm install
ionic serve
```

That's it — no `.env`, no backend URL, no setup. Requires Node 18+ and the Ionic CLI
(`npm install -g @ionic/cli` if you don't have it).

To build a native app shell later:

```bash
ionic build
npx cap add ios
npx cap add android
npx cap sync
```

## Project structure

```
src/app/
├── models/            # TypeScript interfaces (Subject, StudyTask, Material, UserProfile)
├── services/
│   ├── mock-data.service.ts   # single source of truth for all app data
│   └── mock-auth.service.ts   # mocked login/signup/reset flow
├── components/
│   ├── add-quiz-modal/        # "Add Quiz / Activity" bottom sheet
│   └── add-material-modal/    # "Add Materials" bottom sheet
└── pages/
    ├── auth/               # onboarding, login, signup, forgot/reset password
    ├── tabs/                # bottom tab shell
    ├── home/ calendar/ study/ materials/ stats/ profile/
```

## Design tokens

Colors and radii are centralized in `src/theme/variables.scss` (near-black primary,
soft off-white background, single indigo accent) so re-theming means editing one file.
