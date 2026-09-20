---
name: contributing
description: How to contribute to the GBBO Bracket site - branch naming, commits, draft PRs, and the project's LitElement/Tailwind/Airtable conventions. Use whenever starting new work, creating a branch, committing, or opening a pull request in this repo, and when you need to know where code lives or how to run and build the site.
---

# Contributing to GBBO Bracket

This is the static site behind [gbbo-bracket.github.io](https://gbbo-bracket.github.io/) - a Great
British Bake Off bracket built with LitElement, Tailwind CSS, and Vite, deployed to GitHub Pages and
backed by Airtable. It is a small, friendly, low-ceremony project: there is no test suite and no
linter, so care at review time is what keeps it working.

## Workflow rules

These are non-negotiable and apply to every change.

### Always branch off an up-to-date `main`

Unless the user explicitly says to build on top of another branch, start from `main` and pull before
branching:

```bash
git checkout main && git pull --ff-only origin main && git checkout -b <prefix>/<name>
```

### Branch names are `<prefix>/<short-kebab-name>`

- **Prefix** - `tarin/` when most of the change came from human intervention, `claude/` when most of
  it was made by Claude Code. Judge by who wrote the bulk of the diff, not who kicked off the task.
- **Name** - simple, short, human readable, kebab-case. Two or three words that say what the change
  is: `claude/contributing-guide`, `tarin/finalist-banner`, `claude/mobile-vote-fix`. Avoid ticket
  numbers, dates, and single letters.
- **Renaming is expected.** If the work drifts from the original intent, rename the branch to match
  what actually changed before the first commit is pushed or the PR is opened:

  ```bash
  git branch -m <new-name>
  ```

  Once a PR exists, leave the branch name alone.

### Pull requests are always opened as drafts

Every PR starts as a draft so the human can review the diff and the screenshots before anyone else
is asked to look:

```bash
gh pr create --draft --title "<title>" --body-file <path>
```

Fill in [`.github/pull_request_template.md`](../../../.github/pull_request_template.md) - Summary,
What Changed, Testing - and leave the `Reviewed by A Human` checkbox unchecked. The human checks it
and marks the PR ready for review; never mark a PR ready yourself.

Write PR descriptions so a non-technical PM can follow them. Say what a visitor to the site will
notice, then the implementation detail as a sub-bullet if it matters.

### Screenshots

Anything that changes what the site looks like needs before/after screenshots in the Testing table,
at both mobile and desktop widths. Run the dev server and capture the affected pages rather than
describing the change in prose.

## Running the site

```bash
npm install        # first time only
npm start          # Vite dev server on http://localhost:3000 (alias for `npm run dev`)
npm run build      # production build into dist/
npm run preview    # serve the built output locally
```

`npm run build:gh-pages` is what CI runs - it builds with `--base=./` so assets resolve on GitHub
Pages. Use it when you want to reproduce a CI build locally.

There are no tests. Verify changes by loading the affected pages in the dev server, at mobile and
desktop widths, and checking the browser console for errors.

## Project layout

```
index.html, contestants.html, finals.html,   # one HTML entry per page; each is registered in
join.html, rules.html, standings.html,       # vite.config.js rollupOptions.input
vote.html, 2024.html
components/
  foundations/    # generic building blocks: card, primary-button
  shared/         # header, footer, banner, mobile-banner, loading-container
  home/ contestants/ finals/ join/ rules/ vote/   # page-specific components
js/
  main.js             # imports every component and the CSS; the single entry point
  airtable-service.js # all Airtable reads and writes
  utils/              # bakers, baker-results, nominations, participants, join
src/
  input.css   # Tailwind directives, @layer components, Google Fonts
  styles.css  # CSS custom properties (the GBBO palette) and global styles
assets/images/  # served as Vite's publicDir
```

Adding a new page means adding the HTML file **and** registering it in `vite.config.js`, or it will
not be built. Add it to the `content` array in `tailwind.config.js` too, or Tailwind classes used
only on that page get purged from the stylesheet.

## Code conventions

- **Components are LitElement classes** in their own file, named `gbbo-<thing>.js` for site
  components and plainly (`card.js`, `primary-button.js`) for foundations. Export the class, declare
  reactive state in `static properties`, set defaults in the constructor, and end the file with
  `customElements.define('gbbo-thing', GBBOThing)`.
- **Register new components in `js/main.js`.** Nothing renders unless it is imported there.
- **Styles live in `static styles`** as a `css` template literal. Component styles are scoped by
  shadow DOM, so Tailwind utility classes in a component template do not apply - write plain CSS
  inside the component and save Tailwind for markup in the HTML pages.
- **Use the palette variables, never raw hex.** `--berry-red`, `--royal-blue`, `--icing-pink`,
  `--mint-green`, `--buttercream-yellow`, `--powder-blue`, `--golden-brown`, `--clotted-cream`,
  `--earl-grey`, plus the semantic aliases `--canvas`, `--body-text`, `--body-text-on-dark`,
  `--heading-text`, `--link-text`, `--link-text-on-hover`. They are defined in `src/styles.css` and
  mirrored as Tailwind `gbbo-*` colors in `tailwind.config.js`.
- **Reuse the foundations.** Prefer `<primary-button>` and `<gbbo-card>` over hand-rolled buttons and
  panels so the styling stays consistent.
- **Mobile matters.** Most people open this on a phone during the episode. Check narrow widths before
  calling a visual change done.

## Airtable and secrets

`js/airtable-service.js` is the only place that talks to Airtable. It reads the API key from
`import.meta.env.VITE_AIRTABLE_API_KEY`; base and table IDs are constants at the top of the class.
Local development reads the key from `.env`, which is gitignored. CI injects it from the
`VITE_AIRTABLE_API_KEY` repository secret.

Never commit a key, a `.env` file, or a record of real participant data. Season rollover (new base
or table IDs) is a deliberate change to that file - see `airtable-setup.md` for the setup notes.

## Deploying

`.github/workflows/deploy.yml` builds on every push and PR against `main`, and deploys to GitHub
Pages only for `main`. Merging a PR ships the site; there is no separate release step. `deploy.sh`
is a local convenience script for building by hand.
