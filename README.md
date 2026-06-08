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
/todo done 2                              # complete #2
/todo priority 3 high                     # re-prioritise
/todo rm 4                                # remove
/todo next                                # the single next task
```

The CLI underneath (`skills/todo/todo.mjs`) is usable directly too:

```sh
node skills/todo/todo.mjs add "buy milk" --priority low
node skills/todo/todo.mjs list --json
```

Flags: `--priority high|med|low`, `--auto-start` (marks the intended next task), `--json`
(machine output). The `next` ordering is: auto-start first, then priority, then age.

## Storage

Tasks live in `.todo.json` in the current project (override with `TODO_FILE`). It's user data —
keep it gitignored.

## License

MIT © Yash Mody
