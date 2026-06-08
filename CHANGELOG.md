# Changelog

## 0.2.1

- **`--` end-of-options separator** — text after a literal `--` is treated as positional, so `add` and `edit` accept task text that begins with a dash (e.g. `todo add -- --wip foo`). Fixes a pre-existing limitation where such text was swallowed by the flag parser.

## 0.2.0

- **`edit <id> "<text>"`** — rename a task.
- **`start <id>` / `start --clear`** — set or clear the single *intended-next* task (`*`); reopens the task if it was done.
- **Single intended-next invariant** — `--auto-start` and `start` now clear the marker from every other task, and completing a task drops its marker. At most one task is ever the intended-next.
- **`clear` / `clear --all`** — drop completed tasks, or wipe the whole list (resets ids).
- **Multi-id `done` / `rm`** — e.g. `done 1 2 3`.
- Refreshed `--help`, SKILL.md, and README.

## 0.1.0

- Initial release: `add`, `list`/`all`, `done`, `rm`, `priority`, `next`; priority + auto-start ordering; `.todo.json` store with a corrupt-store guard.
