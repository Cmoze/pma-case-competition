import { seed, type Row, type Tables } from "./seed";

const DB_KEY = "pma-demo-db-v1";
const SESSION_KEY = "pma-demo-session-v1";

export interface DbError {
  message: string;
  code?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
  created_at: string;
}

export interface Session {
  user: AuthUser;
}

type AuthEvent = "INITIAL_SESSION" | "SIGNED_IN" | "SIGNED_OUT";
type AuthListener = (event: AuthEvent, session: Session | null) => void;

interface Result<T> {
  data: T | null;
  error: DbError | null;
  count?: number | null;
}

const UNIQUE_KEYS: Record<string, string[]> = {
  profiles: ["user_id"],
  roadmap_profiles: ["user_id"],
  leaderboard_scores: ["email"],
};

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode, quota). Data stays in memory for this tab.
  }
}

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

let tables: Tables | null = null;

function getTables(): Tables {
  if (!tables) {
    const stored = readJson<Tables>(DB_KEY) ?? {};
    tables = { ...clone(seed), ...stored };
  }
  return tables;
}

function table(name: string): Row[] {
  const all = getTables();
  if (!all[name]) all[name] = [];
  return all[name];
}

const persist = () => writeJson(DB_KEY, getTables());

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

function project(row: Row, columns: string): Row {
  const cols = columns.split(",").map((c) => c.trim()).filter(Boolean);
  if (cols.length === 0 || cols.includes("*")) return { ...row };
  return Object.fromEntries(cols.map((c) => [c, row[c] ?? null]));
}

type Op = "select" | "insert" | "update" | "upsert" | "delete";

class QueryBuilder<T = Row[]> implements PromiseLike<Result<T>> {
  private op: Op = "select";
  private columns: string | null = null;
  private countMode = false;
  private headOnly = false;
  private payload: Row[] = [];
  private patch: Row = {};
  private conflictKeys: string[] = [];
  private filters: ((row: Row) => boolean)[] = [];
  private orders: { column: string; ascending: boolean }[] = [];
  private max: number | null = null;
  private singleMode: "single" | "maybe" | null = null;

  constructor(private readonly name: string) {}

  select(columns = "*", options?: { count?: string; head?: boolean }) {
    this.columns = columns;
    this.countMode = !!options?.count;
    this.headOnly = !!options?.head;
    return this;
  }

  insert(values: Row | Row[]) {
    this.op = "insert";
    this.payload = Array.isArray(values) ? values : [values];
    return this;
  }

  upsert(values: Row | Row[], options?: { onConflict?: string }) {
    this.op = "upsert";
    this.payload = Array.isArray(values) ? values : [values];
    this.conflictKeys = options?.onConflict
      ? options.onConflict.split(",").map((k) => k.trim())
      : UNIQUE_KEYS[this.name] ?? ["id"];
    return this;
  }

  update(values: Row) {
    this.op = "update";
    this.patch = values;
    return this;
  }

  delete() {
    this.op = "delete";
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push((row) => row[column] === value);
    return this;
  }

  in(column: string, values: unknown[]) {
    this.filters.push((row) => values.includes(row[column]));
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orders.push({ column, ascending: options?.ascending ?? true });
    return this;
  }

  limit(count: number) {
    this.max = count;
    return this;
  }

  single() {
    this.singleMode = "single";
    return this as unknown as QueryBuilder<Row>;
  }

  maybeSingle() {
    this.singleMode = "maybe";
    return this as unknown as QueryBuilder<Row>;
  }

  then<R1 = Result<T>, R2 = never>(
    onFulfilled?: ((value: Result<T>) => R1 | PromiseLike<R1>) | null,
    onRejected?: ((reason: unknown) => R2 | PromiseLike<R2>) | null,
  ): PromiseLike<R1 | R2> {
    return Promise.resolve()
      .then(() => this.execute() as Result<T>)
      .then(onFulfilled, onRejected);
  }

  private matches(row: Row) {
    return this.filters.every((f) => f(row));
  }

  private violatesUnique(row: Row, rows: Row[], ignore?: Row): boolean {
    const keys = UNIQUE_KEYS[this.name] ?? [];
    return keys.some(
      (k) => row[k] != null && rows.some((r) => r !== ignore && r[k] === row[k]),
    );
  }

  private execute(): Result<Row[] | Row> {
    const rows = table(this.name);
    let affected: Row[] = [];

    if (this.op === "insert") {
      const now = new Date().toISOString();
      const toInsert = this.payload.map((v) => ({ id: newId(), created_at: now, ...v }));
      for (const row of toInsert) {
        if (this.violatesUnique(row, rows)) {
          return { data: null, error: { message: "duplicate key value violates unique constraint", code: "23505" } };
        }
      }
      rows.push(...toInsert);
      affected = toInsert;
      persist();
    } else if (this.op === "upsert") {
      const now = new Date().toISOString();
      for (const value of this.payload) {
        const existing = rows.find((r) => this.conflictKeys.every((k) => r[k] === value[k]));
        if (existing) {
          Object.assign(existing, value, { updated_at: now });
          affected.push(existing);
        } else {
          const row = { id: newId(), created_at: now, updated_at: now, ...value };
          rows.push(row);
          affected.push(row);
        }
      }
      persist();
    } else if (this.op === "update") {
      affected = rows.filter((r) => this.matches(r));
      affected.forEach((r) => Object.assign(r, this.patch));
      persist();
    } else if (this.op === "delete") {
      affected = rows.filter((r) => this.matches(r));
      const remaining = rows.filter((r) => !affected.includes(r));
      getTables()[this.name] = remaining;
      persist();
    } else {
      affected = rows.filter((r) => this.matches(r));
      for (const { column, ascending } of [...this.orders].reverse()) {
        affected = [...affected].sort((a, b) => {
          const av = a[column];
          const bv = b[column];
          if (av === bv) return 0;
          if (av == null) return 1;
          if (bv == null) return -1;
          return (av < bv ? -1 : 1) * (ascending ? 1 : -1);
        });
      }
    }

    const count = affected.length;
    if (this.max !== null) affected = affected.slice(0, this.max);

    if (this.op !== "select" && this.columns === null) {
      return { data: null, error: null, count: null };
    }

    const data = affected.map((r) => project(r, this.columns ?? "*"));

    if (this.headOnly) return { data: null, error: null, count };

    if (this.singleMode) {
      if (data.length === 1) return { data: data[0], error: null };
      if (data.length === 0 && this.singleMode === "maybe") return { data: null, error: null };
      return {
        data: null,
        error: {
          message: data.length === 0 ? "JSON object requested, multiple (or no) rows returned" : "Multiple rows returned",
          code: "PGRST116",
        },
      };
    }

    return { data, error: null, count: this.countMode ? count : null };
  }
}

const listeners = new Set<AuthListener>();

function currentSession(): Session | null {
  return readJson<Session>(SESSION_KEY);
}

function setSession(session: Session | null, event: AuthEvent) {
  writeJson(SESSION_KEY, session);
  listeners.forEach((cb) => cb(event, session));
}

function toAuthUser(row: Row): AuthUser {
  return {
    id: row.id,
    email: row.email,
    user_metadata: row.user_metadata ?? {},
    created_at: row.created_at,
  };
}

const auth = {
  async getSession() {
    return { data: { session: currentSession() }, error: null };
  },

  async getUser() {
    return { data: { user: currentSession()?.user ?? null }, error: null };
  },

  onAuthStateChange(callback: AuthListener) {
    listeners.add(callback);
    queueMicrotask(() => {
      if (listeners.has(callback)) callback("INITIAL_SESSION", currentSession());
    });
    return { data: { subscription: { unsubscribe: () => void listeners.delete(callback) } } };
  },

  async signUp({
    email,
    password,
    options,
  }: {
    email: string;
    password: string;
    options?: { emailRedirectTo?: string; data?: Record<string, any> };
  }) {
    const normalized = email.trim().toLowerCase();
    const users = table("auth_users");
    if (password.length < 6) {
      return { data: { user: null, session: null }, error: { message: "Password should be at least 6 characters." } };
    }
    if (users.some((u) => u.email === normalized)) {
      return { data: { user: null, session: null }, error: { message: "User already registered" } };
    }

    const now = new Date().toISOString();
    const userRow = { id: newId(), email: normalized, password, user_metadata: options?.data ?? {}, created_at: now };
    users.push(userRow);
    table("profiles").push({
      id: newId(),
      user_id: userRow.id,
      full_name: options?.data?.full_name ?? null,
      email: normalized,
      role: "guest",
      is_pma_member: false,
      is_blocked: false,
      deleted_at: null,
      created_at: now,
    });
    persist();

    const session: Session = { user: toAuthUser(userRow) };
    setSession(session, "SIGNED_IN");
    return { data: { user: session.user, session }, error: null };
  },

  async signInWithPassword({ email, password }: { email: string; password: string }) {
    const normalized = email.trim().toLowerCase();
    const userRow = table("auth_users").find((u) => u.email === normalized && u.password === password);
    if (!userRow) {
      return { data: { user: null, session: null }, error: { message: "Invalid login credentials" } };
    }
    const session: Session = { user: toAuthUser(userRow) };
    setSession(session, "SIGNED_IN");
    return { data: { user: session.user, session }, error: null };
  },

  async signOut(_options?: { scope?: "local" | "global" }) {
    setSession(null, "SIGNED_OUT");
    return { error: null };
  },
};

async function rpc(name: string, params: Record<string, any>): Promise<Result<null>> {
  if (name === "upsert_leaderboard_score") {
    const rows = table("leaderboard_scores");
    const email = String(params.p_email ?? "").trim().toLowerCase();
    const existing = rows.find((r) => r.email === email);
    if (existing) {
      existing.name = params.p_name;
      if (params.p_score > existing.score) {
        existing.score = params.p_score;
        existing.created_at = new Date().toISOString();
      }
    } else {
      rows.push({ id: newId(), email, name: params.p_name, score: params.p_score, created_at: new Date().toISOString() });
    }
    persist();
    return { data: null, error: null };
  }
  return { data: null, error: { message: `Unknown function: ${name}` } };
}

export const db = {
  auth,
  from: (name: string) => new QueryBuilder(name),
  rpc,
};
