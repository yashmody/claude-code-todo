---
name: todo
description: Ad-hoc task list for Claude Code. Capture a task mid-flight WITHOUT interrupting the current work, list tasks, set priority, complete or remove them, and surface the next task after the current one finishes. Trigger when the user types /todo — e.g. "/todo <text>", "/todo all", "/todo done 3", "/todo next".
---

# /todo — ad-hoc task list

A persistent, project-local list so the user can park ad-hoc tasks **without derailing the work
in progress**. Backed by a zero-dependency CLI (`todo.mjs`, bundled in this skill) and a
`.todo.json` store in the project root. Needs only Node 18+.

## Running the CLI

`todo.mjs` sits in this skill's own directory. Invoke it with Node using its full path:

- installed as a plugin → `node "$CLAUDE_PLUGIN_ROOT/skills/todo/todo.mjs" <command>`
- copied into a project → `node .claude/skills/todo/todo.mjs <command>`

Add `--json` for machine-readable output.

## How to respond to /todo

- **`/todo <text>`** — capture. Run `add "<text>"` (add `--priority high|med|low` and/or
  `--auto-start` if the user implied them). Confirm in ONE short line, then **immediately resume
  what you were doing**. Capturing must never interrupt — do not start the new task now.
- **`/todo all`** (or `/todo list`) — run `list --json`, then mirror the tasks into the built-in
  todo UI via the **TodoWrite** tool so the user sees the native checklist. Also print a short summary.
- **`/todo done <id>`**, **`/todo rm <id>`**, **`/todo priority <id> <level>`** — run the matching
  command and confirm in one line.
- **`/todo next`** — run `next --json` and report the single next task.

## Surfacing tasks after the current task

When the current task finishes (or the user is idle), run `next --json`. If it returns a task —
especially one with `"autoStart": true` or `"priority": "high"` — say
**"Next up: <text>. Want me to start it?"** and **wait for confirmation**. Never auto-execute a
parked task without asking; `auto-start` only marks which task is the intended next one.

## Store

Tasks live in `.todo.json` in the project root (override with the `TODO_FILE` env var). It is user
data — keep it out of version control.
