#!/usr/bin/env node
// /todo — a tiny, dependency-free ad-hoc task list for Claude Code.
// Store: ./.todo.json (override with TODO_FILE). Node 18+. No npm install needed.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const FILE = process.env.TODO_FILE || resolve(process.cwd(), '.todo.json');
const RANK = { high: 0, med: 1, low: 2 };
const LEVELS = ['high', 'med', 'low'];

function load() {
  if (!existsSync(FILE)) return { tasks: [], nextId: 1 };
  try {
    const db = JSON.parse(readFileSync(FILE, 'utf8'));
    return { tasks: db.tasks || [], nextId: db.nextId || 1 };
  } catch {
    // Don't silently wipe a corrupt/half-written store — warn before the next save overwrites it.
    process.stderr.write(
      `todo: ${FILE} is unreadable; starting empty (it will be overwritten on the next change)\n`
    );
    return { tasks: [], nextId: 1 };
  }
}

function save(db) {
  mkdirSync(dirname(FILE), { recursive: true });
  writeFileSync(FILE, JSON.stringify(db, null, 2) + '\n');
}

function parse(args) {
  const out = { _: [] };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = args[i + 1];
      if (next === undefined || next.startsWith('--')) out[key] = true;
      else {
        out[key] = next;
        i++;
      }
    } else {
      out._.push(a);
    }
  }
  return out;
}

function sortTasks(tasks) {
  return tasks.slice().sort((a, b) => {
    if (a.status !== b.status) return a.status === 'pending' ? -1 : 1;
    if (!!b.autoStart !== !!a.autoStart) return a.autoStart ? -1 : 1;
    const ra = RANK[a.priority] ?? 1;
    const rb = RANK[b.priority] ?? 1;
    if (ra !== rb) return ra - rb;
    return a.id - b.id;
  });
}

const fmt = (t) =>
  `${t.status === 'done' ? '[x]' : '[ ]'} #${t.id} (${t.priority})${t.autoStart ? ' *' : ''} ${t.text}`;

const HELP = `todo — ad-hoc task list (store: ${FILE})
  todo add "<text>" [--priority high|med|low] [--auto-start]
  todo list [--all] [--json]            (alias: all)
  todo done <id>
  todo rm <id>
  todo priority <id> <high|med|low>
  todo next [--json]
The * marks an auto-start task: the intended next one. --json prints machine output.`;

const commands = {
  add(db, f) {
    const text = f._.join(' ').trim();
    if (!text) throw new Error('usage: todo add "<text>" [--priority high|med|low] [--auto-start]');
    if (f.priority !== undefined && !LEVELS.includes(f.priority)) {
      throw new Error('priority must be high|med|low');
    }
    const priority = LEVELS.includes(f.priority) ? f.priority : 'med';
    const task = {
      id: db.nextId++,
      text,
      priority,
      status: 'pending',
      autoStart: !!f['auto-start'],
      created: new Date().toISOString(),
      completed: null,
    };
    db.tasks.push(task);
    save(db);
    return f.json ? JSON.stringify(task) : `added #${task.id}: ${text}`;
  },

  list(db, f) {
    const tasks = sortTasks(f.all ? db.tasks : db.tasks.filter((t) => t.status === 'pending'));
    if (f.json) return JSON.stringify(tasks, null, 2);
    return tasks.length ? tasks.map(fmt).join('\n') : 'no tasks';
  },

  done(db, f) {
    const id = Number(f._[0]);
    const t = db.tasks.find((x) => x.id === id);
    if (!t) throw new Error(`no task #${id}`);
    t.status = 'done';
    t.completed = new Date().toISOString();
    save(db);
    return `done #${id}`;
  },

  rm(db, f) {
    const id = Number(f._[0]);
    const before = db.tasks.length;
    db.tasks = db.tasks.filter((x) => x.id !== id);
    if (db.tasks.length === before) throw new Error(`no task #${id}`);
    save(db);
    return `removed #${id}`;
  },

  priority(db, f) {
    const id = Number(f._[0]);
    const level = f._[1];
    if (!LEVELS.includes(level)) throw new Error('usage: todo priority <id> <high|med|low>');
    const t = db.tasks.find((x) => x.id === id);
    if (!t) throw new Error(`no task #${id}`);
    t.priority = level;
    save(db);
    return `#${id} -> ${level}`;
  },

  next(db, f) {
    const t = sortTasks(db.tasks.filter((x) => x.status === 'pending'))[0] || null;
    if (f.json) return JSON.stringify(t);
    return t ? fmt(t) : 'no pending tasks';
  },

  help() {
    return HELP;
  },
};

const [cmd, ...rest] = process.argv.slice(2);
const name = cmd === 'all' ? 'list' : cmd || 'help';
const handler = commands[name];
if (!handler) {
  console.error(`unknown command: ${cmd}\n`);
  console.log(HELP);
  process.exit(1);
}
try {
  const out = handler(load(), parse(rest));
  if (out) console.log(out);
} catch (err) {
  console.error(err.message || String(err));
  process.exit(1);
}
