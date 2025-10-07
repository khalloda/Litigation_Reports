# Quick Start
Load and follow all rules below for this session. Keep this document open as the active source of truth.

# Current Working Rules & Conventions

## Prohibited Actions
- Do not refactor code outside the agreed scope without explicit approval.
- Do not modify migrations or seeders unless the user explicitly requests it.
- Do not overwrite documentation owned by other modules or teams.
- Do not use Codacy at all.
- Do not use **Codacy** at all (no CLI commands, no configuration, no references).

## 1. Commit & Documentation Rules
- **Commit messages**
  - Use descriptive, human-readable titles (no ticket-only shorthand).
  - Include body details only when helpful; mention rationale/impact and references.
  - Keep commits atomic—scope them to the files relevant to that task.
- **Documentation expectations**
  - Update or create Markdown artifacts after each change (e.g., `_Deep_Analysis.md`, `_Plan.md`, `_Runbook.md`, `_Tasks.md`, `_Bugfix.md`).
  - Record rollback steps and verification notes in the relevant doc.
  - Reference updated documentation when summarizing work.
- **File naming**
  - Planning/analysis docs use suffixes like `_Deep_Analysis.md`, `_Plan.md`, `_Runbook.md`, `_Tasks.md`, `_Bugfix.md` under logical subdirectories such as `docs/payroll/...`.
  - Prompt or command snapshots live alongside other docs with clear kebab- or snake-case names.

## 2. Development Rules
- **Naming**
  - Branches follow `feat/...` style names.
  - Config flags use descriptive snake_case keys (e.g., `use_safe_engine_conditionals`); environment variables mirror them in screaming snake case (`PAYROLL_SAFE_ENGINE_CONDITIONALS`).
  - PHP/Laravel naming conventions apply: StudlyCase classes, camelCase methods, kebab-case Blade view files.
- **Safe coding**
  - Avoid `eval` and other unsafe dynamic execution; rely on whitelisted registries and validated parsing.
  - Never hardcode secrets; read from `.env`/config with `env()` lookups.
  - Respect feature flags; default behaviour must remain unchanged when flags are off.
- **Testing**
  - Add or update PHPUnit unit/feature tests for new logic.
  - Cover UI-impacting changes with Playwright E2E tests.
  - Ensure tests exercise validation, error paths, and both flag states.

## 3. Workflow & Approval Rules
- Ask for confirmation before long or destructive operations; clarify when instructions conflict.
- Wrap up tasks with the Codex reply format: status line, list of files touched, commit hash, and “READY FOR NEXT?” unless user specifies otherwise.
- Stop and clarify if encountering unexpected repository state or missing context.
- Maintain incremental commits and provide rollback guidance (feature flag toggle or `git revert`).

## 4. Security & Environment
- Do not expose passwords, usernames, or sensitive config values.
- Align environment variable usage with Laravel conventions (`APP_ENV`, `DB_HOST`, `DB_USERNAME`, etc.) and document new vars.
- Describe required `.env` changes rather than committing secrets.
- Config files must read from env values to stay deployable.

#### System Access Configuration
- System URL: hrms.local
- Username: hr@sarieldin.com
- Password: password123

#### Database Configuration
- Host: localhost
- Port: 3306
- Username: root
- Password: 1234
- Database Name: sep_hrms

## 5. Documentation & File Outputs
- Store docs beneath `docs/` with domain subfolders (`docs/payroll/...`, `docs/payroll/bugs/...`, etc.).
- Use consistent suffixes: `_Deep_Analysis.md`, `_Plan.md`, `_Runbook.md`, `_Tasks.md`, `_Bugfix.md`, `_Prompt.md`.
- Markdown formatting should include headings, bullet lists, code snippets, and sections for summary, investigation, fix, rollback, and status where relevant.

## 6. Communication Rules
- Keep tone professional, concise, and collaborative.
- Summaries should be brief; highlight key findings and avoid unnecessary verbosity.
- Mention feature-flag usage explicitly when relevant.
- Stop output once requested information is delivered and await further direction.

## 7. Rollback & Safety
- Every change needs an explicit rollback plan (feature flag toggle, `git revert`, or manual steps).
- Document rollback in associated Markdown files and commit notes.
- Ensure tests are green (local or CI) and docs updated before merging.

## 8. Special Codex Prompts & Artifacts
- Store `.md` prompt files alongside other docs with descriptive names.
- After completing tasks, update the corresponding `_Tasks.md`, `_Runbook.md`, `_Plan.md`, or bug docs with results, verification, and outstanding work.
- Keep prompts, plans, and execution notes synchronized to aid future agents.

## CI & Testing Consistency
- `php artisan test` must pass locally and on the canonical CI pipeline before any merge.

---

# Version 1.0 — Maintained by Khaled Helmy, 2025-10
