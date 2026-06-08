# claude-code-todo

A tiny **`/todo`** skill for [Claude Code](https://claude.com/claude-code) — capture ad-hoc tasks
**without interrupting** the work in progress, prioritise them, complete them, and let Claude
surface the next one when the current task is done. Zero dependencies (Node 18+); tasks persist in
a local `.todo.json`.

## Why

You're mid-task and think of three other things. Instead of derailing, you type `/todo <thing>` —
Claude parks it and carries on. Later, `/todo all` shows the list (mirrored into Claude's native
checklist UI), and when you're done Claude asks whether to pick up the next one.

## Install

```
/plugin marketplace add yashmody/claude-code-todo
/plugin install todo@claude-code-todo
```

Or just copy `skills/todo/` into any repo's `.claude/skills/` — it's self-contained.

## Usage

```
/todo Fix the flaky login test            # capture (does not interrupt current work)
/todo Ship the release notes --priority high --auto-start
/todo all                                 # list (rendered in the native todo UI)
/todo edit 2 Rewrite the release notes    # rename #2
/todo priority 3 high                     # re-prioritise
/todo start 3                             # mark #3 as the single intended-next (*)
/todo done 2 5                            # complete #2 and #5
/todo rm 4                                # remove
/todo clear                               # drop completed tasks (clear --all wipes everything)
/todo next                                # the single next task
```

The CLI underneath (`skills/todo/todo.mjs`) is usable directly too:

```sh
node skills/todo/todo.mjs add "buy milk" --priority low
node skills/todo/todo.mjs list --json
```

Flags: `--priority high|med|low`, `--auto-start` (marks the single intended-next task), `--json`
(machine output). The `next` ordering is: intended-next first, then priority, then age. Only one
task can be the intended-next at a time.

To add or edit a task whose text begins with a dash, use a `--` end-of-options separator so it
isn't parsed as a flag:

```sh
node skills/todo/todo.mjs add -- --wip refactor the parser
node skills/todo/todo.mjs edit 3 -- --blocked waiting on review
```

## Storage

Tasks live in `.todo.json` in the current project (override with `TODO_FILE`). It's user data —
keep it gitignored.

## Changelog

See [CHANGELOG.md](CHANGELOG.md). Latest: **0.2.1** — `--` end-of-options separator so task text
can begin with a dash.

## License

MIT © Yash Mody
