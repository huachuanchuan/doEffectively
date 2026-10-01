var Ad = Object.defineProperty;
var Ci = (e) => {
  throw TypeError(e);
};
var kd = (e, t, r) => t in e ? Ad(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Zr = (e, t, r) => kd(e, typeof t != "symbol" ? t + "" : t, r), Vs = (e, t, r) => t.has(e) || Ci("Cannot " + r);
var ee = (e, t, r) => (Vs(e, t, "read from private field"), r ? r.call(e) : t.get(e)), rt = (e, t, r) => t.has(e) ? Ci("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), He = (e, t, r, n) => (Vs(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), bt = (e, t, r) => (Vs(e, t, "access private method"), r);
import gl, { app as Fe, screen as Jt, globalShortcut as _l, BrowserWindow as ko, ipcMain as gr, nativeImage as Cd, Tray as Dd, shell as Md, Menu as Ld, Notification as Di } from "electron";
import { fileURLToPath as Vd } from "node:url";
import re from "node:path";
import Co from "node:os";
import te, { existsSync as Fd } from "node:fs";
import { execFile as zd } from "node:child_process";
import $e from "node:process";
import { promisify as ke, isDeepStrictEqual as Mi } from "node:util";
import xr from "node:crypto";
import Li from "node:assert";
import "node:events";
import "node:stream";
import * as ho from "@hicccc77/electron-liquid-glass";
const fr = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, vl = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), wl = 1e6, Ud = (e) => e >= "0" && e <= "9";
function El(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= wl;
  }
  return !1;
}
function Fs(e, t) {
  return vl.has(e) ? !1 : (e && El(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function qd(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  const t = [];
  let r = "", n = "start", s = !1, o = 0;
  for (const a of e) {
    if (o++, s) {
      r += a, s = !1;
      continue;
    }
    if (a === "\\") {
      if (n === "index")
        throw new Error(`Invalid character '${a}' in an index at position ${o}`);
      if (n === "indexEnd")
        throw new Error(`Invalid character '${a}' after an index at position ${o}`);
      s = !0, n = n === "start" ? "property" : n;
      continue;
    }
    switch (a) {
      case ".": {
        if (n === "index")
          throw new Error(`Invalid character '${a}' in an index at position ${o}`);
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (!Fs(r, t))
          return [];
        r = "", n = "property";
        break;
      }
      case "[": {
        if (n === "index")
          throw new Error(`Invalid character '${a}' in an index at position ${o}`);
        if (n === "indexEnd") {
          n = "index";
          break;
        }
        if (n === "property" || n === "start") {
          if ((r || n === "property") && !Fs(r, t))
            return [];
          r = "";
        }
        n = "index";
        break;
      }
      case "]": {
        if (n === "index") {
          if (r === "")
            r = (t.pop() || "") + "[]", n = "property";
          else {
            const c = Number.parseInt(r, 10);
            !Number.isNaN(c) && Number.isFinite(c) && c >= 0 && c <= Number.MAX_SAFE_INTEGER && c <= wl && r === String(c) ? t.push(c) : t.push(r), r = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${a}' after an index at position ${o}`);
        r += a;
        break;
      }
      default: {
        if (n === "index" && !Ud(a))
          throw new Error(`Invalid character '${a}' in an index at position ${o}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${a}' after an index at position ${o}`);
        n === "start" && (n = "property"), r += a;
      }
    }
  }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (!Fs(r, t))
        return [];
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      t.push("");
      break;
    }
  }
  return t;
}
function ys(e) {
  if (typeof e == "string")
    return qd(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [r, n] of e.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${r}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${r} must be a finite number, got ${n}`);
      if (vl.has(n))
        return [];
      typeof n == "string" && El(n) ? t.push(Number.parseInt(n, 10)) : t.push(n);
    }
    return t;
  }
  return [];
}
function Vi(e, t, r) {
  if (!fr(e) || typeof t != "string" && !Array.isArray(t))
    return r === void 0 ? e : r;
  const n = ys(t);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const o = n[s];
    if (e = e[o], e == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function On(e, t, r) {
  if (!fr(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, s = ys(t);
  if (s.length === 0)
    return e;
  for (let o = 0; o < s.length; o++) {
    const a = s[o];
    if (o === s.length - 1)
      e[a] = r;
    else if (!fr(e[a])) {
      const l = typeof s[o + 1] == "number";
      e[a] = l ? [] : {};
    }
    e = e[a];
  }
  return n;
}
function Kd(e, t) {
  if (!fr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = ys(t);
  if (r.length === 0)
    return !1;
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (n === r.length - 1)
      return Object.hasOwn(e, s) ? (delete e[s], !0) : !1;
    if (e = e[s], !fr(e))
      return !1;
  }
}
function zs(e, t) {
  if (!fr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = ys(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!fr(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const Kt = Co.homedir(), Do = Co.tmpdir(), { env: Pr } = $e, Gd = (e) => {
  const t = re.join(Kt, "Library");
  return {
    data: re.join(t, "Application Support", e),
    config: re.join(t, "Preferences", e),
    cache: re.join(t, "Caches", e),
    log: re.join(t, "Logs", e),
    temp: re.join(Do, e)
  };
}, Hd = (e) => {
  const t = Pr.APPDATA || re.join(Kt, "AppData", "Roaming"), r = Pr.LOCALAPPDATA || re.join(Kt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: re.join(r, e, "Data"),
    config: re.join(t, e, "Config"),
    cache: re.join(r, e, "Cache"),
    log: re.join(r, e, "Log"),
    temp: re.join(Do, e)
  };
}, Bd = (e) => {
  const t = re.basename(Kt);
  return {
    data: re.join(Pr.XDG_DATA_HOME || re.join(Kt, ".local", "share"), e),
    config: re.join(Pr.XDG_CONFIG_HOME || re.join(Kt, ".config"), e),
    cache: re.join(Pr.XDG_CACHE_HOME || re.join(Kt, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: re.join(Pr.XDG_STATE_HOME || re.join(Kt, ".local", "state"), e),
    temp: re.join(Do, t, e)
  };
};
function Wd(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), $e.platform === "darwin" ? Gd(e) : $e.platform === "win32" ? Hd(e) : Bd(e);
}
const Ct = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    return e.apply(void 0, s).catch(r);
  };
}, St = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    try {
      return e.apply(void 0, s);
    } catch (o) {
      return r(o);
    }
  };
}, Xd = 250, Dt = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: o } = s, a = s.interval ?? Xd, c = Date.now() + o;
    return function l(...d) {
      return e.apply(void 0, d).catch((u) => {
        if (!r(u) || Date.now() >= c)
          throw u;
        const h = Math.round(a * Math.random());
        return h > 0 ? new Promise(($) => setTimeout($, h)).then(() => l.apply(void 0, d)) : l.apply(void 0, d);
      });
    };
  };
}, Mt = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: o } = s, a = Date.now() + o;
    return function(...l) {
      for (; ; )
        try {
          return e.apply(void 0, l);
        } catch (d) {
          if (!r(d) || Date.now() >= a)
            throw d;
          continue;
        }
    };
  };
}, Nr = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!Nr.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !Jd && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!Nr.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!Nr.isNodeError(e))
      throw e;
    if (!Nr.isChangeErrorOk(e))
      throw e;
  }
}, In = {
  onError: Nr.onChangeError
}, Ye = {
  onError: () => {
  }
}, Jd = $e.getuid ? !$e.getuid() : !1, Ce = {
  isRetriable: Nr.isRetriableError
}, Le = {
  attempt: {
    /* ASYNC */
    chmod: Ct(ke(te.chmod), In),
    chown: Ct(ke(te.chown), In),
    close: Ct(ke(te.close), Ye),
    fsync: Ct(ke(te.fsync), Ye),
    mkdir: Ct(ke(te.mkdir), Ye),
    realpath: Ct(ke(te.realpath), Ye),
    stat: Ct(ke(te.stat), Ye),
    unlink: Ct(ke(te.unlink), Ye),
    /* SYNC */
    chmodSync: St(te.chmodSync, In),
    chownSync: St(te.chownSync, In),
    closeSync: St(te.closeSync, Ye),
    existsSync: St(te.existsSync, Ye),
    fsyncSync: St(te.fsync, Ye),
    mkdirSync: St(te.mkdirSync, Ye),
    realpathSync: St(te.realpathSync, Ye),
    statSync: St(te.statSync, Ye),
    unlinkSync: St(te.unlinkSync, Ye)
  },
  retry: {
    /* ASYNC */
    close: Dt(ke(te.close), Ce),
    fsync: Dt(ke(te.fsync), Ce),
    open: Dt(ke(te.open), Ce),
    readFile: Dt(ke(te.readFile), Ce),
    rename: Dt(ke(te.rename), Ce),
    stat: Dt(ke(te.stat), Ce),
    write: Dt(ke(te.write), Ce),
    writeFile: Dt(ke(te.writeFile), Ce),
    /* SYNC */
    closeSync: Mt(te.closeSync, Ce),
    fsyncSync: Mt(te.fsyncSync, Ce),
    openSync: Mt(te.openSync, Ce),
    readFileSync: Mt(te.readFileSync, Ce),
    renameSync: Mt(te.renameSync, Ce),
    statSync: Mt(te.statSync, Ce),
    writeSync: Mt(te.writeSync, Ce),
    writeFileSync: Mt(te.writeFileSync, Ce)
  }
}, Yd = "utf8", Fi = 438, Qd = 511, Zd = {}, xd = $e.geteuid ? $e.geteuid() : -1, ef = $e.getegid ? $e.getegid() : -1, tf = 1e3, rf = !!$e.getuid;
$e.getuid && $e.getuid();
const zi = 128, nf = (e) => e instanceof Error && "code" in e, Ui = (e) => typeof e == "string", Us = (e) => e === void 0, sf = $e.platform === "linux", bl = $e.platform === "win32", Mo = ["SIGHUP", "SIGINT", "SIGTERM"];
bl || Mo.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
sf && Mo.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class of {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (bl && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? $e.kill($e.pid, "SIGTERM") : $e.kill($e.pid, t));
      }
    }, this.hook = () => {
      $e.once("exit", () => this.exit());
      for (const t of Mo)
        try {
          $e.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const af = new of(), cf = af.register, Ve = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${s}`;
  },
  get: (e, t, r = !0) => {
    const n = Ve.truncate(t(e));
    return n in Ve.store ? Ve.get(e, t, r) : (Ve.store[n] = r, [n, () => delete Ve.store[n]]);
  },
  purge: (e) => {
    Ve.store[e] && (delete Ve.store[e], Le.attempt.unlink(e));
  },
  purgeSync: (e) => {
    Ve.store[e] && (delete Ve.store[e], Le.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in Ve.store)
      Ve.purgeSync(e);
  },
  truncate: (e) => {
    const t = re.basename(e);
    if (t.length <= zi)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - zi;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
cf(Ve.purgeSyncAll);
function Sl(e, t, r = Zd) {
  if (Ui(r))
    return Sl(e, t, { encoding: r });
  const s = { timeout: r.timeout ?? tf };
  let o = null, a = null, c = null;
  try {
    const l = Le.attempt.realpathSync(e), d = !!l;
    e = l || e, [a, o] = Ve.get(e, r.tmpCreate || Ve.create, r.tmpPurge !== !1);
    const u = rf && Us(r.chown), h = Us(r.mode);
    if (d && (u || h)) {
      const w = Le.attempt.statSync(e);
      w && (r = { ...r }, u && (r.chown = { uid: w.uid, gid: w.gid }), h && (r.mode = w.mode));
    }
    if (!d) {
      const w = re.dirname(e);
      Le.attempt.mkdirSync(w, {
        mode: Qd,
        recursive: !0
      });
    }
    c = Le.retry.openSync(s)(a, "w", r.mode || Fi), r.tmpCreated && r.tmpCreated(a), Ui(t) ? Le.retry.writeSync(s)(c, t, 0, r.encoding || Yd) : Us(t) || Le.retry.writeSync(s)(c, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Le.retry.fsyncSync(s)(c) : Le.attempt.fsync(c)), Le.retry.closeSync(s)(c), c = null, r.chown && (r.chown.uid !== xd || r.chown.gid !== ef) && Le.attempt.chownSync(a, r.chown.uid, r.chown.gid), r.mode && r.mode !== Fi && Le.attempt.chmodSync(a, r.mode);
    try {
      Le.retry.renameSync(s)(a, e);
    } catch (w) {
      if (!nf(w) || w.code !== "ENAMETOOLONG")
        throw w;
      Le.retry.renameSync(s)(a, Ve.truncate(e));
    }
    o(), a = null;
  } finally {
    c && Le.attempt.closeSync(c), a && Ve.purge(a);
  }
}
function Pl(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var mo = { exports: {} }, Nl = {}, Pt = {}, xt = {}, wn = {}, ne = {}, gn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(E) {
      if (super(), !e.IDENTIFIER.test(E))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(E) {
      super(), this._items = typeof E == "string" ? [E] : E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const E = this._items[0];
      return E === "" || E === '""';
    }
    get str() {
      var E;
      return (E = this._str) !== null && E !== void 0 ? E : this._str = this._items.reduce((R, T) => `${R}${T}`, "");
    }
    get names() {
      var E;
      return (E = this._names) !== null && E !== void 0 ? E : this._names = this._items.reduce((R, T) => (T instanceof r && (R[T.str] = (R[T.str] || 0) + 1), R), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...E) {
    const R = [m[0]];
    let T = 0;
    for (; T < E.length; )
      c(R, E[T]), R.push(m[++T]);
    return new n(R);
  }
  e._ = s;
  const o = new n("+");
  function a(m, ...E) {
    const R = [$(m[0])];
    let T = 0;
    for (; T < E.length; )
      R.push(o), c(R, E[T]), R.push(o, $(m[++T]));
    return l(R), new n(R);
  }
  e.str = a;
  function c(m, E) {
    E instanceof n ? m.push(...E._items) : E instanceof r ? m.push(E) : m.push(h(E));
  }
  e.addCodeArg = c;
  function l(m) {
    let E = 1;
    for (; E < m.length - 1; ) {
      if (m[E] === o) {
        const R = d(m[E - 1], m[E + 1]);
        if (R !== void 0) {
          m.splice(E - 1, 3, R);
          continue;
        }
        m[E++] = "+";
      }
      E++;
    }
  }
  function d(m, E) {
    if (E === '""')
      return m;
    if (m === '""')
      return E;
    if (typeof m == "string")
      return E instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof E != "string" ? `${m.slice(0, -1)}${E}"` : E[0] === '"' ? m.slice(0, -1) + E.slice(1) : void 0;
    if (typeof E == "string" && E[0] === '"' && !(m instanceof r))
      return `"${m}${E.slice(1)}`;
  }
  function u(m, E) {
    return E.emptyStr() ? m : m.emptyStr() ? E : a`${m}${E}`;
  }
  e.strConcat = u;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : $(Array.isArray(m) ? m.join(",") : m);
  }
  function w(m) {
    return new n($(m));
  }
  e.stringify = w;
  function $(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = $;
  function v(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = v;
  function _(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = _;
  function g(m) {
    return new n(m.toString());
  }
  e.regexpCode = g;
})(gn);
var po = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = gn;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(l) {
    l[l.Started = 0] = "Started", l[l.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: u } = {}) {
      this._names = {}, this._prefixes = d, this._parent = u;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const u = this._names[d] || this._nameGroup(d);
      return `${d}${u.index++}`;
    }
    _nameGroup(d) {
      var u, h;
      if (!((h = (u = this._parent) === null || u === void 0 ? void 0 : u._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class o extends t.Name {
    constructor(d, u) {
      super(u), this.prefix = d;
    }
    setValue(d, { property: u, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(u)}[${h}]`;
    }
  }
  e.ValueScopeName = o;
  const a = (0, t._)`\n`;
  class c extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? a : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new o(d, this._newName(d));
    }
    value(d, u) {
      var h;
      if (u.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const w = this.toName(d), { prefix: $ } = w, v = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let _ = this._values[$];
      if (_) {
        const E = _.get(v);
        if (E)
          return E;
      } else
        _ = this._values[$] = /* @__PURE__ */ new Map();
      _.set(v, w);
      const g = this._scope[$] || (this._scope[$] = []), m = g.length;
      return g[m] = u.ref, w.setValue(u, { property: $, itemIndex: m }), w;
    }
    getValue(d, u) {
      const h = this._values[d];
      if (h)
        return h.get(u);
    }
    scopeRefs(d, u = this._values) {
      return this._reduceValues(u, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, u, h) {
      return this._reduceValues(d, (w) => {
        if (w.value === void 0)
          throw new Error(`CodeGen: name "${w}" has no value`);
        return w.value.code;
      }, u, h);
    }
    _reduceValues(d, u, h = {}, w) {
      let $ = t.nil;
      for (const v in d) {
        const _ = d[v];
        if (!_)
          continue;
        const g = h[v] = h[v] || /* @__PURE__ */ new Map();
        _.forEach((m) => {
          if (g.has(m))
            return;
          g.set(m, n.Started);
          let E = u(m);
          if (E) {
            const R = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            $ = (0, t._)`${$}${R} ${m} = ${E};${this.opts._n}`;
          } else if (E = w == null ? void 0 : w(m))
            $ = (0, t._)`${$}${E}${this.opts._n}`;
          else
            throw new r(m);
          g.set(m, n.Completed);
        });
      }
      return $;
    }
  }
  e.ValueScope = c;
})(po);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = gn, r = po;
  var n = gn;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = po;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class o {
    optimizeNodes() {
      return this;
    }
    optimizeNames(i, f) {
      return this;
    }
  }
  class a extends o {
    constructor(i, f, b) {
      super(), this.varKind = i, this.name = f, this.rhs = b;
    }
    render({ es5: i, _n: f }) {
      const b = i ? r.varKinds.var : this.varKind, j = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${b} ${this.name}${j};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = B(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class c extends o {
    constructor(i, f, b) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = b;
    }
    render({ _n: i }) {
      return `${this.lhs} = ${this.rhs};` + i;
    }
    optimizeNames(i, f) {
      if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
        return this.rhs = B(this.rhs, i, f), this;
    }
    get names() {
      const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return Q(i, this.rhs);
    }
  }
  class l extends c {
    constructor(i, f, b, j) {
      super(i, b, j), this.op = f;
    }
    render({ _n: i }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + i;
    }
  }
  class d extends o {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `${this.label}:` + i;
    }
  }
  class u extends o {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `break${this.label ? ` ${this.label}` : ""};` + i;
    }
  }
  class h extends o {
    constructor(i) {
      super(), this.error = i;
    }
    render({ _n: i }) {
      return `throw ${this.error};` + i;
    }
    get names() {
      return this.error.names;
    }
  }
  class w extends o {
    constructor(i) {
      super(), this.code = i;
    }
    render({ _n: i }) {
      return `${this.code};` + i;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(i, f) {
      return this.code = B(this.code, i, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class $ extends o {
    constructor(i = []) {
      super(), this.nodes = i;
    }
    render(i) {
      return this.nodes.reduce((f, b) => f + b.render(i), "");
    }
    optimizeNodes() {
      const { nodes: i } = this;
      let f = i.length;
      for (; f--; ) {
        const b = i[f].optimizeNodes();
        Array.isArray(b) ? i.splice(f, 1, ...b) : b ? i[f] = b : i.splice(f, 1);
      }
      return i.length > 0 ? this : void 0;
    }
    optimizeNames(i, f) {
      const { nodes: b } = this;
      let j = b.length;
      for (; j--; ) {
        const A = b[j];
        A.optimizeNames(i, f) || (ue(i, A.names), b.splice(j, 1));
      }
      return b.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => J(i, f.names), {});
    }
  }
  class v extends $ {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class _ extends $ {
  }
  class g extends v {
  }
  g.kind = "else";
  class m extends v {
    constructor(i, f) {
      super(f), this.condition = i;
    }
    render(i) {
      let f = `if(${this.condition})` + super.render(i);
      return this.else && (f += "else " + this.else.render(i)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const i = this.condition;
      if (i === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const b = f.optimizeNodes();
        f = this.else = Array.isArray(b) ? new g(b) : b;
      }
      if (f)
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(M(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var b;
      if (this.else = (b = this.else) === null || b === void 0 ? void 0 : b.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = B(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return Q(i, this.condition), this.else && J(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class E extends v {
  }
  E.kind = "for";
  class R extends E {
    constructor(i) {
      super(), this.iteration = i;
    }
    render(i) {
      return `for(${this.iteration})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iteration = B(this.iteration, i, f), this;
    }
    get names() {
      return J(super.names, this.iteration.names);
    }
  }
  class T extends E {
    constructor(i, f, b, j) {
      super(), this.varKind = i, this.name = f, this.from = b, this.to = j;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: b, from: j, to: A } = this;
      return `for(${f} ${b}=${j}; ${b}<${A}; ${b}++)` + super.render(i);
    }
    get names() {
      const i = Q(super.names, this.from);
      return Q(i, this.to);
    }
  }
  class I extends E {
    constructor(i, f, b, j) {
      super(), this.loop = i, this.varKind = f, this.name = b, this.iterable = j;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = B(this.iterable, i, f), this;
    }
    get names() {
      return J(super.names, this.iterable.names);
    }
  }
  class K extends v {
    constructor(i, f, b) {
      super(), this.name = i, this.args = f, this.async = b;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  K.kind = "func";
  class Y extends $ {
    render(i) {
      return "return " + super.render(i);
    }
  }
  Y.kind = "return";
  class le extends v {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var b, j;
      return super.optimizeNames(i, f), (b = this.catch) === null || b === void 0 || b.optimizeNames(i, f), (j = this.finally) === null || j === void 0 || j.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && J(i, this.catch.names), this.finally && J(i, this.finally.names), i;
    }
  }
  class he extends v {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  he.kind = "catch";
  class ye extends v {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  ye.kind = "finally";
  class q {
    constructor(i, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = i, this._scope = new r.Scope({ parent: i }), this._nodes = [new _()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(i) {
      return this._scope.name(i);
    }
    // reserves unique name in the external scope
    scopeName(i) {
      return this._extScope.name(i);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(i, f) {
      const b = this._extScope.value(i, f);
      return (this._values[b.prefix] || (this._values[b.prefix] = /* @__PURE__ */ new Set())).add(b), b;
    }
    getScopeValue(i, f) {
      return this._extScope.getValue(i, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(i) {
      return this._extScope.scopeRefs(i, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(i, f, b, j) {
      const A = this._scope.toName(f);
      return b !== void 0 && j && (this._constants[A.str] = b), this._leafNode(new a(i, A, b)), A;
    }
    // `const` declaration (`var` in es5 mode)
    const(i, f, b) {
      return this._def(r.varKinds.const, i, f, b);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(i, f, b) {
      return this._def(r.varKinds.let, i, f, b);
    }
    // `var` declaration with optional assignment
    var(i, f, b) {
      return this._def(r.varKinds.var, i, f, b);
    }
    // assignment code
    assign(i, f, b) {
      return this._leafNode(new c(i, f, b));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new l(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new w(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [b, j] of i)
        f.length > 1 && f.push(","), f.push(b), (b !== j || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, j));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(i, f, b) {
      if (this._blockNode(new m(i)), f && b)
        this.code(f).else().code(b).endIf();
      else if (f)
        this.code(f).endIf();
      else if (b)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(i) {
      return this._elseNode(new m(i));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new g());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, g);
    }
    _for(i, f) {
      return this._blockNode(i), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(i, f) {
      return this._for(new R(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, b, j, A = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const G = this._scope.toName(i);
      return this._for(new T(A, G, f, b), () => j(G));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, j = r.varKinds.const) {
      const A = this._scope.toName(i);
      if (this.opts.es5) {
        const G = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${G}.length`, (U) => {
          this.var(A, (0, t._)`${G}[${U}]`), b(A);
        });
      }
      return this._for(new I("of", j, A, f), () => b(A));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, b, j = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, b);
      const A = this._scope.toName(i);
      return this._for(new I("in", j, A, f), () => b(A));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(E);
    }
    // `label` statement
    label(i) {
      return this._leafNode(new d(i));
    }
    // `break` statement
    break(i) {
      return this._leafNode(new u(i));
    }
    // `return` statement
    return(i) {
      const f = new Y();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(Y);
    }
    // `try` statement
    try(i, f, b) {
      if (!f && !b)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const j = new le();
      if (this._blockNode(j), this.code(i), f) {
        const A = this.name("e");
        this._currNode = j.catch = new he(A), f(A);
      }
      return b && (this._currNode = j.finally = new ye(), this.code(b)), this._endBlockNode(he, ye);
    }
    // `throw` statement
    throw(i) {
      return this._leafNode(new h(i));
    }
    // start self-balancing block
    block(i, f) {
      return this._blockStarts.push(this._nodes.length), i && this.code(i).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(i) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const b = this._nodes.length - f;
      if (b < 0 || i !== void 0 && b !== i)
        throw new Error(`CodeGen: wrong number of nodes: ${b} vs ${i} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(i, f = t.nil, b, j) {
      return this._blockNode(new K(i, f, b)), j && this.code(j).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(K);
    }
    optimize(i = 1) {
      for (; i-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(i) {
      return this._currNode.nodes.push(i), this;
    }
    _blockNode(i) {
      this._currNode.nodes.push(i), this._nodes.push(i);
    }
    _endBlockNode(i, f) {
      const b = this._currNode;
      if (b instanceof i || f && b instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${i.kind}/${f.kind}` : i.kind}"`);
    }
    _elseNode(i) {
      const f = this._currNode;
      if (!(f instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = i, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const i = this._nodes;
      return i[i.length - 1];
    }
    set _currNode(i) {
      const f = this._nodes;
      f[f.length - 1] = i;
    }
  }
  e.CodeGen = q;
  function J(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) + (i[f] || 0);
    return y;
  }
  function Q(y, i) {
    return i instanceof t._CodeOrName ? J(y, i.names) : y;
  }
  function B(y, i, f) {
    if (y instanceof t.Name)
      return b(y);
    if (!j(y))
      return y;
    return new t._Code(y._items.reduce((A, G) => (G instanceof t.Name && (G = b(G)), G instanceof t._Code ? A.push(...G._items) : A.push(G), A), []));
    function b(A) {
      const G = f[A.str];
      return G === void 0 || i[A.str] !== 1 ? A : (delete i[A.str], G);
    }
    function j(A) {
      return A instanceof t._Code && A._items.some((G) => G instanceof t.Name && i[G.str] === 1 && f[G.str] !== void 0);
    }
  }
  function ue(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) - (i[f] || 0);
  }
  function M(y) {
    return typeof y == "boolean" || typeof y == "number" || y === null ? !y : (0, t._)`!${S(y)}`;
  }
  e.not = M;
  const C = p(e.operators.AND);
  function W(...y) {
    return y.reduce(C);
  }
  e.and = W;
  const z = p(e.operators.OR);
  function P(...y) {
    return y.reduce(z);
  }
  e.or = P;
  function p(y) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${S(i)} ${y} ${S(f)}`;
  }
  function S(y) {
    return y instanceof t.Name ? y : (0, t._)`(${y})`;
  }
})(ne);
var V = {};
Object.defineProperty(V, "__esModule", { value: !0 });
V.checkStrictMode = V.getErrorPath = V.Type = V.useFunc = V.setEvaluated = V.evaluatedPropsToName = V.mergeEvaluated = V.eachItem = V.unescapeJsonPointer = V.escapeJsonPointer = V.escapeFragment = V.unescapeFragment = V.schemaRefOrVal = V.schemaHasRulesButRef = V.schemaHasRules = V.checkUnknownRules = V.alwaysValidSchema = V.toHash = void 0;
const de = ne, lf = gn;
function uf(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
V.toHash = uf;
function df(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Rl(e, t), !Tl(t, e.self.RULES.all));
}
V.alwaysValidSchema = df;
function Rl(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const o in t)
    s[o] || jl(e, `unknown keyword: "${o}"`);
}
V.checkUnknownRules = Rl;
function Tl(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
V.schemaHasRules = Tl;
function ff(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
V.schemaHasRulesButRef = ff;
function hf({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, de._)`${r}`;
  }
  return (0, de._)`${e}${t}${(0, de.getProperty)(n)}`;
}
V.schemaRefOrVal = hf;
function mf(e) {
  return Ol(decodeURIComponent(e));
}
V.unescapeFragment = mf;
function pf(e) {
  return encodeURIComponent(Lo(e));
}
V.escapeFragment = pf;
function Lo(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
V.escapeJsonPointer = Lo;
function Ol(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
V.unescapeJsonPointer = Ol;
function $f(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
V.eachItem = $f;
function qi({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, o, a, c) => {
    const l = a === void 0 ? o : a instanceof de.Name ? (o instanceof de.Name ? e(s, o, a) : t(s, o, a), a) : o instanceof de.Name ? (t(s, a, o), o) : r(o, a);
    return c === de.Name && !(l instanceof de.Name) ? n(s, l) : l;
  };
}
V.mergeEvaluated = {
  props: qi({
    mergeNames: (e, t, r) => e.if((0, de._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, de._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, de._)`${r} || {}`).code((0, de._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, de._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, de._)`${r} || {}`), Vo(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Il
  }),
  items: qi({
    mergeNames: (e, t, r) => e.if((0, de._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, de._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, de._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, de._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Il(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, de._)`{}`);
  return t !== void 0 && Vo(e, r, t), r;
}
V.evaluatedPropsToName = Il;
function Vo(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, de._)`${t}${(0, de.getProperty)(n)}`, !0));
}
V.setEvaluated = Vo;
const Ki = {};
function yf(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Ki[t.code] || (Ki[t.code] = new lf._Code(t.code))
  });
}
V.useFunc = yf;
var $o;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})($o || (V.Type = $o = {}));
function gf(e, t, r) {
  if (e instanceof de.Name) {
    const n = t === $o.Num;
    return r ? n ? (0, de._)`"[" + ${e} + "]"` : (0, de._)`"['" + ${e} + "']"` : n ? (0, de._)`"/" + ${e}` : (0, de._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, de.getProperty)(e).toString() : "/" + Lo(e);
}
V.getErrorPath = gf;
function jl(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
V.checkStrictMode = jl;
var Qe = {};
Object.defineProperty(Qe, "__esModule", { value: !0 });
const De = ne, _f = {
  // validation function arguments
  data: new De.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new De.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new De.Name("instancePath"),
  parentData: new De.Name("parentData"),
  parentDataProperty: new De.Name("parentDataProperty"),
  rootData: new De.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new De.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new De.Name("vErrors"),
  // null or array of validation errors
  errors: new De.Name("errors"),
  // counter of validation errors
  this: new De.Name("this"),
  // "globals"
  self: new De.Name("self"),
  scope: new De.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new De.Name("json"),
  jsonPos: new De.Name("jsonPos"),
  jsonLen: new De.Name("jsonLen"),
  jsonPart: new De.Name("jsonPart")
};
Qe.default = _f;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = ne, r = V, n = Qe;
  e.keywordError = {
    message: ({ keyword: g }) => (0, t.str)`must pass "${g}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: g, schemaType: m }) => m ? (0, t.str)`"${g}" keyword must be ${m} ($data)` : (0, t.str)`"${g}" keyword is invalid ($data)`
  };
  function s(g, m = e.keywordError, E, R) {
    const { it: T } = g, { gen: I, compositeRule: K, allErrors: Y } = T, le = h(g, m, E);
    R ?? (K || Y) ? l(I, le) : d(T, (0, t._)`[${le}]`);
  }
  e.reportError = s;
  function o(g, m = e.keywordError, E) {
    const { it: R } = g, { gen: T, compositeRule: I, allErrors: K } = R, Y = h(g, m, E);
    l(T, Y), I || K || d(R, n.default.vErrors);
  }
  e.reportExtraError = o;
  function a(g, m) {
    g.assign(n.default.errors, m), g.if((0, t._)`${n.default.vErrors} !== null`, () => g.if(m, () => g.assign((0, t._)`${n.default.vErrors}.length`, m), () => g.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function c({ gen: g, keyword: m, schemaValue: E, data: R, errsCount: T, it: I }) {
    if (T === void 0)
      throw new Error("ajv implementation error");
    const K = g.name("err");
    g.forRange("i", T, n.default.errors, (Y) => {
      g.const(K, (0, t._)`${n.default.vErrors}[${Y}]`), g.if((0, t._)`${K}.instancePath === undefined`, () => g.assign((0, t._)`${K}.instancePath`, (0, t.strConcat)(n.default.instancePath, I.errorPath))), g.assign((0, t._)`${K}.schemaPath`, (0, t.str)`${I.errSchemaPath}/${m}`), I.opts.verbose && (g.assign((0, t._)`${K}.schema`, E), g.assign((0, t._)`${K}.data`, R));
    });
  }
  e.extendErrors = c;
  function l(g, m) {
    const E = g.const("err", m);
    g.if((0, t._)`${n.default.vErrors} === null`, () => g.assign(n.default.vErrors, (0, t._)`[${E}]`), (0, t._)`${n.default.vErrors}.push(${E})`), g.code((0, t._)`${n.default.errors}++`);
  }
  function d(g, m) {
    const { gen: E, validateName: R, schemaEnv: T } = g;
    T.$async ? E.throw((0, t._)`new ${g.ValidationError}(${m})`) : (E.assign((0, t._)`${R}.errors`, m), E.return(!1));
  }
  const u = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h(g, m, E) {
    const { createErrors: R } = g.it;
    return R === !1 ? (0, t._)`{}` : w(g, m, E);
  }
  function w(g, m, E = {}) {
    const { gen: R, it: T } = g, I = [
      $(T, E),
      v(g, E)
    ];
    return _(g, m, I), R.object(...I);
  }
  function $({ errorPath: g }, { instancePath: m }) {
    const E = m ? (0, t.str)`${g}${(0, r.getErrorPath)(m, r.Type.Str)}` : g;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, E)];
  }
  function v({ keyword: g, it: { errSchemaPath: m } }, { schemaPath: E, parentSchema: R }) {
    let T = R ? m : (0, t.str)`${m}/${g}`;
    return E && (T = (0, t.str)`${T}${(0, r.getErrorPath)(E, r.Type.Str)}`), [u.schemaPath, T];
  }
  function _(g, { params: m, message: E }, R) {
    const { keyword: T, data: I, schemaValue: K, it: Y } = g, { opts: le, propertyName: he, topSchemaRef: ye, schemaPath: q } = Y;
    R.push([u.keyword, T], [u.params, typeof m == "function" ? m(g) : m || (0, t._)`{}`]), le.messages && R.push([u.message, typeof E == "function" ? E(g) : E]), le.verbose && R.push([u.schema, K], [u.parentSchema, (0, t._)`${ye}${q}`], [n.default.data, I]), he && R.push([u.propertyName, he]);
  }
})(wn);
var Gi;
function vf() {
  if (Gi) return xt;
  Gi = 1, Object.defineProperty(xt, "__esModule", { value: !0 }), xt.boolOrEmptySchema = xt.topBoolOrEmptySchema = void 0;
  const e = wn, t = ne, r = Qe, n = {
    message: "boolean schema is false"
  };
  function s(c) {
    const { gen: l, schema: d, validateName: u } = c;
    d === !1 ? a(c, !1) : typeof d == "object" && d.$async === !0 ? l.return(r.default.data) : (l.assign((0, t._)`${u}.errors`, null), l.return(!0));
  }
  xt.topBoolOrEmptySchema = s;
  function o(c, l) {
    const { gen: d, schema: u } = c;
    u === !1 ? (d.var(l, !1), a(c)) : d.var(l, !0);
  }
  xt.boolOrEmptySchema = o;
  function a(c, l) {
    const { gen: d, data: u } = c, h = {
      gen: d,
      keyword: "false schema",
      data: u,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: c
    };
    (0, e.reportError)(h, n, void 0, l);
  }
  return xt;
}
var be = {}, hr = {};
Object.defineProperty(hr, "__esModule", { value: !0 });
hr.getRules = hr.isJSONType = void 0;
const wf = ["string", "number", "integer", "boolean", "null", "object", "array"], Ef = new Set(wf);
function bf(e) {
  return typeof e == "string" && Ef.has(e);
}
hr.isJSONType = bf;
function Sf() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
hr.getRules = Sf;
var It = {};
Object.defineProperty(It, "__esModule", { value: !0 });
It.shouldUseRule = It.shouldUseGroup = It.schemaHasRulesForType = void 0;
function Pf({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Al(e, n);
}
It.schemaHasRulesForType = Pf;
function Al(e, t) {
  return t.rules.some((r) => kl(e, r));
}
It.shouldUseGroup = Al;
function kl(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
It.shouldUseRule = kl;
Object.defineProperty(be, "__esModule", { value: !0 });
be.reportTypeError = be.checkDataTypes = be.checkDataType = be.coerceAndCheckDataType = be.getJSONTypes = be.getSchemaTypes = be.DataType = void 0;
const Nf = hr, Rf = It, Tf = wn, se = ne, Cl = V;
var Ar;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Ar || (be.DataType = Ar = {}));
function Of(e) {
  const t = Dl(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
be.getSchemaTypes = Of;
function Dl(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(Nf.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
be.getJSONTypes = Dl;
function If(e, t) {
  const { gen: r, data: n, opts: s } = e, o = jf(t, s.coerceTypes), a = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, Rf.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const c = Fo(t, n, s.strictNumbers, Ar.Wrong);
    r.if(c, () => {
      o.length ? Af(e, t, o) : zo(e);
    });
  }
  return a;
}
be.coerceAndCheckDataType = If;
const Ml = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function jf(e, t) {
  return t ? e.filter((r) => Ml.has(r) || t === "array" && r === "array") : [];
}
function Af(e, t, r) {
  const { gen: n, data: s, opts: o } = e, a = n.let("dataType", (0, se._)`typeof ${s}`), c = n.let("coerced", (0, se._)`undefined`);
  o.coerceTypes === "array" && n.if((0, se._)`${a} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, se._)`${s}[0]`).assign(a, (0, se._)`typeof ${s}`).if(Fo(t, s, o.strictNumbers), () => n.assign(c, s))), n.if((0, se._)`${c} !== undefined`);
  for (const d of r)
    (Ml.has(d) || d === "array" && o.coerceTypes === "array") && l(d);
  n.else(), zo(e), n.endIf(), n.if((0, se._)`${c} !== undefined`, () => {
    n.assign(s, c), kf(e, c);
  });
  function l(d) {
    switch (d) {
      case "string":
        n.elseIf((0, se._)`${a} == "number" || ${a} == "boolean"`).assign(c, (0, se._)`"" + ${s}`).elseIf((0, se._)`${s} === null`).assign(c, (0, se._)`""`);
        return;
      case "number":
        n.elseIf((0, se._)`${a} == "boolean" || ${s} === null
              || (${a} == "string" && ${s} && ${s} == +${s})`).assign(c, (0, se._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, se._)`${a} === "boolean" || ${s} === null
              || (${a} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(c, (0, se._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, se._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(c, !1).elseIf((0, se._)`${s} === "true" || ${s} === 1`).assign(c, !0);
        return;
      case "null":
        n.elseIf((0, se._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(c, null);
        return;
      case "array":
        n.elseIf((0, se._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${s} === null`).assign(c, (0, se._)`[${s}]`);
    }
  }
}
function kf({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, se._)`${t} !== undefined`, () => e.assign((0, se._)`${t}[${r}]`, n));
}
function yo(e, t, r, n = Ar.Correct) {
  const s = n === Ar.Correct ? se.operators.EQ : se.operators.NEQ;
  let o;
  switch (e) {
    case "null":
      return (0, se._)`${t} ${s} null`;
    case "array":
      o = (0, se._)`Array.isArray(${t})`;
      break;
    case "object":
      o = (0, se._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      o = a((0, se._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      o = a();
      break;
    default:
      return (0, se._)`typeof ${t} ${s} ${e}`;
  }
  return n === Ar.Correct ? o : (0, se.not)(o);
  function a(c = se.nil) {
    return (0, se.and)((0, se._)`typeof ${t} == "number"`, c, r ? (0, se._)`isFinite(${t})` : se.nil);
  }
}
be.checkDataType = yo;
function Fo(e, t, r, n) {
  if (e.length === 1)
    return yo(e[0], t, r, n);
  let s;
  const o = (0, Cl.toHash)(e);
  if (o.array && o.object) {
    const a = (0, se._)`typeof ${t} != "object"`;
    s = o.null ? a : (0, se._)`!${t} || ${a}`, delete o.null, delete o.array, delete o.object;
  } else
    s = se.nil;
  o.number && delete o.integer;
  for (const a in o)
    s = (0, se.and)(s, yo(a, t, r, n));
  return s;
}
be.checkDataTypes = Fo;
const Cf = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, se._)`{type: ${e}}` : (0, se._)`{type: ${t}}`
};
function zo(e) {
  const t = Df(e);
  (0, Tf.reportError)(t, Cf);
}
be.reportTypeError = zo;
function Df(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Cl.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: e
  };
}
var en = {}, Hi;
function Mf() {
  if (Hi) return en;
  Hi = 1, Object.defineProperty(en, "__esModule", { value: !0 }), en.assignDefaults = void 0;
  const e = ne, t = V;
  function r(s, o) {
    const { properties: a, items: c } = s.schema;
    if (o === "object" && a)
      for (const l in a)
        n(s, l, a[l].default);
    else o === "array" && Array.isArray(c) && c.forEach((l, d) => n(s, d, l.default));
  }
  en.assignDefaults = r;
  function n(s, o, a) {
    const { gen: c, compositeRule: l, data: d, opts: u } = s;
    if (a === void 0)
      return;
    const h = (0, e._)`${d}${(0, e.getProperty)(o)}`;
    if (l) {
      (0, t.checkStrictMode)(s, `default is ignored for: ${h}`);
      return;
    }
    let w = (0, e._)`${h} === undefined`;
    u.useDefaults === "empty" && (w = (0, e._)`${w} || ${h} === null || ${h} === ""`), c.if(w, (0, e._)`${h} = ${(0, e.stringify)(a)}`);
  }
  return en;
}
var nt = {}, ie = {};
Object.defineProperty(ie, "__esModule", { value: !0 });
ie.validateUnion = ie.validateArray = ie.usePattern = ie.callValidateCode = ie.schemaProperties = ie.allSchemaProperties = ie.noPropertyInData = ie.propertyInData = ie.isOwnProperty = ie.hasPropFunc = ie.reportMissingProp = ie.checkMissingProp = ie.checkReportMissingProp = void 0;
const me = ne, Uo = V, Lt = Qe, Lf = V;
function Vf(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Ko(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, me._)`${t}` }, !0), e.error();
  });
}
ie.checkReportMissingProp = Vf;
function Ff({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, me.or)(...n.map((o) => (0, me.and)(Ko(e, t, o, r.ownProperties), (0, me._)`${s} = ${o}`)));
}
ie.checkMissingProp = Ff;
function zf(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ie.reportMissingProp = zf;
function Ll(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, me._)`Object.prototype.hasOwnProperty`
  });
}
ie.hasPropFunc = Ll;
function qo(e, t, r) {
  return (0, me._)`${Ll(e)}.call(${t}, ${r})`;
}
ie.isOwnProperty = qo;
function Uf(e, t, r, n) {
  const s = (0, me._)`${t}${(0, me.getProperty)(r)} !== undefined`;
  return n ? (0, me._)`${s} && ${qo(e, t, r)}` : s;
}
ie.propertyInData = Uf;
function Ko(e, t, r, n) {
  const s = (0, me._)`${t}${(0, me.getProperty)(r)} === undefined`;
  return n ? (0, me.or)(s, (0, me.not)(qo(e, t, r))) : s;
}
ie.noPropertyInData = Ko;
function Vl(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ie.allSchemaProperties = Vl;
function qf(e, t) {
  return Vl(t).filter((r) => !(0, Uo.alwaysValidSchema)(e, t[r]));
}
ie.schemaProperties = qf;
function Kf({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: o }, it: a }, c, l, d) {
  const u = d ? (0, me._)`${e}, ${t}, ${n}${s}` : t, h = [
    [Lt.default.instancePath, (0, me.strConcat)(Lt.default.instancePath, o)],
    [Lt.default.parentData, a.parentData],
    [Lt.default.parentDataProperty, a.parentDataProperty],
    [Lt.default.rootData, Lt.default.rootData]
  ];
  a.opts.dynamicRef && h.push([Lt.default.dynamicAnchors, Lt.default.dynamicAnchors]);
  const w = (0, me._)`${u}, ${r.object(...h)}`;
  return l !== me.nil ? (0, me._)`${c}.call(${l}, ${w})` : (0, me._)`${c}(${w})`;
}
ie.callValidateCode = Kf;
const Gf = (0, me._)`new RegExp`;
function Hf({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, o = s(r, n);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, me._)`${s.code === "new RegExp" ? Gf : (0, Lf.useFunc)(e, s)}(${r}, ${n})`
  });
}
ie.usePattern = Hf;
function Bf(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, o = t.name("valid");
  if (s.allErrors) {
    const c = t.let("valid", !0);
    return a(() => t.assign(c, !1)), c;
  }
  return t.var(o, !0), a(() => t.break()), o;
  function a(c) {
    const l = t.const("len", (0, me._)`${r}.length`);
    t.forRange("i", 0, l, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: Uo.Type.Num
      }, o), t.if((0, me.not)(o), c);
    });
  }
}
ie.validateArray = Bf;
function Wf(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((l) => (0, Uo.alwaysValidSchema)(s, l)) && !s.opts.unevaluated)
    return;
  const a = t.let("valid", !1), c = t.name("_valid");
  t.block(() => r.forEach((l, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, c);
    t.assign(a, (0, me._)`${a} || ${c}`), e.mergeValidEvaluated(u, c) || t.if((0, me.not)(a));
  })), e.result(a, () => e.reset(), () => e.error(!0));
}
ie.validateUnion = Wf;
var Bi;
function Xf() {
  if (Bi) return nt;
  Bi = 1, Object.defineProperty(nt, "__esModule", { value: !0 }), nt.validateKeywordUsage = nt.validSchemaType = nt.funcKeywordCode = nt.macroKeywordCode = void 0;
  const e = ne, t = Qe, r = ie, n = wn;
  function s(w, $) {
    const { gen: v, keyword: _, schema: g, parentSchema: m, it: E } = w, R = $.macro.call(E.self, g, m, E), T = d(v, _, R);
    E.opts.validateSchema !== !1 && E.self.validateSchema(R, !0);
    const I = v.name("valid");
    w.subschema({
      schema: R,
      schemaPath: e.nil,
      errSchemaPath: `${E.errSchemaPath}/${_}`,
      topSchemaRef: T,
      compositeRule: !0
    }, I), w.pass(I, () => w.error(!0));
  }
  nt.macroKeywordCode = s;
  function o(w, $) {
    var v;
    const { gen: _, keyword: g, schema: m, parentSchema: E, $data: R, it: T } = w;
    l(T, $);
    const I = !R && $.compile ? $.compile.call(T.self, m, E, T) : $.validate, K = d(_, g, I), Y = _.let("valid");
    w.block$data(Y, le), w.ok((v = $.valid) !== null && v !== void 0 ? v : Y);
    function le() {
      if ($.errors === !1)
        q(), $.modifying && a(w), J(() => w.error());
      else {
        const Q = $.async ? he() : ye();
        $.modifying && a(w), J(() => c(w, Q));
      }
    }
    function he() {
      const Q = _.let("ruleErrs", null);
      return _.try(() => q((0, e._)`await `), (B) => _.assign(Y, !1).if((0, e._)`${B} instanceof ${T.ValidationError}`, () => _.assign(Q, (0, e._)`${B}.errors`), () => _.throw(B))), Q;
    }
    function ye() {
      const Q = (0, e._)`${K}.errors`;
      return _.assign(Q, null), q(e.nil), Q;
    }
    function q(Q = $.async ? (0, e._)`await ` : e.nil) {
      const B = T.opts.passContext ? t.default.this : t.default.self, ue = !("compile" in $ && !R || $.schema === !1);
      _.assign(Y, (0, e._)`${Q}${(0, r.callValidateCode)(w, K, B, ue)}`, $.modifying);
    }
    function J(Q) {
      var B;
      _.if((0, e.not)((B = $.valid) !== null && B !== void 0 ? B : Y), Q);
    }
  }
  nt.funcKeywordCode = o;
  function a(w) {
    const { gen: $, data: v, it: _ } = w;
    $.if(_.parentData, () => $.assign(v, (0, e._)`${_.parentData}[${_.parentDataProperty}]`));
  }
  function c(w, $) {
    const { gen: v } = w;
    v.if((0, e._)`Array.isArray(${$})`, () => {
      v.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${$} : ${t.default.vErrors}.concat(${$})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, n.extendErrors)(w);
    }, () => w.error());
  }
  function l({ schemaEnv: w }, $) {
    if ($.async && !w.$async)
      throw new Error("async keyword in sync schema");
  }
  function d(w, $, v) {
    if (v === void 0)
      throw new Error(`keyword "${$}" failed to compile`);
    return w.scopeValue("keyword", typeof v == "function" ? { ref: v } : { ref: v, code: (0, e.stringify)(v) });
  }
  function u(w, $, v = !1) {
    return !$.length || $.some((_) => _ === "array" ? Array.isArray(w) : _ === "object" ? w && typeof w == "object" && !Array.isArray(w) : typeof w == _ || v && typeof w > "u");
  }
  nt.validSchemaType = u;
  function h({ schema: w, opts: $, self: v, errSchemaPath: _ }, g, m) {
    if (Array.isArray(g.keyword) ? !g.keyword.includes(m) : g.keyword !== m)
      throw new Error("ajv implementation error");
    const E = g.dependencies;
    if (E != null && E.some((R) => !Object.prototype.hasOwnProperty.call(w, R)))
      throw new Error(`parent schema must have dependencies of ${m}: ${E.join(",")}`);
    if (g.validateSchema && !g.validateSchema(w[m])) {
      const T = `keyword "${m}" value is invalid at path "${_}": ` + v.errorsText(g.validateSchema.errors);
      if ($.validateSchema === "log")
        v.logger.error(T);
      else
        throw new Error(T);
    }
  }
  return nt.validateKeywordUsage = h, nt;
}
var Nt = {}, Wi;
function Jf() {
  if (Wi) return Nt;
  Wi = 1, Object.defineProperty(Nt, "__esModule", { value: !0 }), Nt.extendSubschemaMode = Nt.extendSubschemaData = Nt.getSubschema = void 0;
  const e = ne, t = V;
  function r(o, { keyword: a, schemaProp: c, schema: l, schemaPath: d, errSchemaPath: u, topSchemaRef: h }) {
    if (a !== void 0 && l !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (a !== void 0) {
      const w = o.schema[a];
      return c === void 0 ? {
        schema: w,
        schemaPath: (0, e._)`${o.schemaPath}${(0, e.getProperty)(a)}`,
        errSchemaPath: `${o.errSchemaPath}/${a}`
      } : {
        schema: w[c],
        schemaPath: (0, e._)`${o.schemaPath}${(0, e.getProperty)(a)}${(0, e.getProperty)(c)}`,
        errSchemaPath: `${o.errSchemaPath}/${a}/${(0, t.escapeFragment)(c)}`
      };
    }
    if (l !== void 0) {
      if (d === void 0 || u === void 0 || h === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: l,
        schemaPath: d,
        topSchemaRef: h,
        errSchemaPath: u
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Nt.getSubschema = r;
  function n(o, a, { dataProp: c, dataPropType: l, data: d, dataTypes: u, propertyName: h }) {
    if (d !== void 0 && c !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: w } = a;
    if (c !== void 0) {
      const { errorPath: v, dataPathArr: _, opts: g } = a, m = w.let("data", (0, e._)`${a.data}${(0, e.getProperty)(c)}`, !0);
      $(m), o.errorPath = (0, e.str)`${v}${(0, t.getErrorPath)(c, l, g.jsPropertySyntax)}`, o.parentDataProperty = (0, e._)`${c}`, o.dataPathArr = [..._, o.parentDataProperty];
    }
    if (d !== void 0) {
      const v = d instanceof e.Name ? d : w.let("data", d, !0);
      $(v), h !== void 0 && (o.propertyName = h);
    }
    u && (o.dataTypes = u);
    function $(v) {
      o.data = v, o.dataLevel = a.dataLevel + 1, o.dataTypes = [], a.definedProperties = /* @__PURE__ */ new Set(), o.parentData = a.data, o.dataNames = [...a.dataNames, v];
    }
  }
  Nt.extendSubschemaData = n;
  function s(o, { jtdDiscriminator: a, jtdMetadata: c, compositeRule: l, createErrors: d, allErrors: u }) {
    l !== void 0 && (o.compositeRule = l), d !== void 0 && (o.createErrors = d), u !== void 0 && (o.allErrors = u), o.jtdDiscriminator = a, o.jtdMetadata = c;
  }
  return Nt.extendSubschemaMode = s, Nt;
}
var Ie = {}, gs = function e(t, r) {
  if (t === r) return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor) return !1;
    var n, s, o;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length) return !1;
      for (s = n; s-- !== 0; )
        if (!e(t[s], r[s])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
    if (o = Object.keys(t), n = o.length, n !== Object.keys(r).length) return !1;
    for (s = n; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, o[s])) return !1;
    for (s = n; s-- !== 0; ) {
      var a = o[s];
      if (!e(t[a], r[a])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, Fl = { exports: {} }, Bt = Fl.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Jn(t, n, s, e, "", e);
};
Bt.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
Bt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Bt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Bt.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Jn(e, t, r, n, s, o, a, c, l, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, o, a, c, l, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in Bt.arrayKeywords)
          for (var w = 0; w < h.length; w++)
            Jn(e, t, r, h[w], s + "/" + u + "/" + w, o, s, u, n, w);
      } else if (u in Bt.propsKeywords) {
        if (h && typeof h == "object")
          for (var $ in h)
            Jn(e, t, r, h[$], s + "/" + u + "/" + Yf($), o, s, u, n, $);
      } else (u in Bt.keywords || e.allKeys && !(u in Bt.skipKeywords)) && Jn(e, t, r, h, s + "/" + u, o, s, u, n);
    }
    r(n, s, o, a, c, l, d);
  }
}
function Yf(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Qf = Fl.exports;
Object.defineProperty(Ie, "__esModule", { value: !0 });
Ie.getSchemaRefs = Ie.resolveUrl = Ie.normalizeId = Ie._getFullPath = Ie.getFullPath = Ie.inlineRef = void 0;
const Zf = V, xf = gs, eh = Qf, th = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function rh(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !go(e) : t ? zl(e) <= t : !1;
}
Ie.inlineRef = rh;
const nh = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function go(e) {
  for (const t in e) {
    if (nh.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(go) || typeof r == "object" && go(r))
      return !0;
  }
  return !1;
}
function zl(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !th.has(r) && (typeof e[r] == "object" && (0, Zf.eachItem)(e[r], (n) => t += zl(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Ul(e, t = "", r) {
  r !== !1 && (t = kr(t));
  const n = e.parse(t);
  return ql(e, n);
}
Ie.getFullPath = Ul;
function ql(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ie._getFullPath = ql;
const sh = /#\/?$/;
function kr(e) {
  return e ? e.replace(sh, "") : "";
}
Ie.normalizeId = kr;
function oh(e, t, r) {
  return r = kr(r), e.resolve(t, r);
}
Ie.resolveUrl = oh;
const ah = /^[a-z_][-a-z0-9._]*$/i;
function ih(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = kr(e[r] || t), o = { "": s }, a = Ul(n, s, !1), c = {}, l = /* @__PURE__ */ new Set();
  return eh(e, { allKeys: !0 }, (h, w, $, v) => {
    if (v === void 0)
      return;
    const _ = a + w;
    let g = o[v];
    typeof h[r] == "string" && (g = m.call(this, h[r])), E.call(this, h.$anchor), E.call(this, h.$dynamicAnchor), o[w] = g;
    function m(R) {
      const T = this.opts.uriResolver.resolve;
      if (R = kr(g ? T(g, R) : R), l.has(R))
        throw u(R);
      l.add(R);
      let I = this.refs[R];
      return typeof I == "string" && (I = this.refs[I]), typeof I == "object" ? d(h, I.schema, R) : R !== kr(_) && (R[0] === "#" ? (d(h, c[R], R), c[R] = h) : this.refs[R] = _), R;
    }
    function E(R) {
      if (typeof R == "string") {
        if (!ah.test(R))
          throw new Error(`invalid anchor "${R}"`);
        m.call(this, `#${R}`);
      }
    }
  }), c;
  function d(h, w, $) {
    if (w !== void 0 && !xf(h, w))
      throw u($);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ie.getSchemaRefs = ih;
var Xi;
function _s() {
  if (Xi) return Pt;
  Xi = 1, Object.defineProperty(Pt, "__esModule", { value: !0 }), Pt.getData = Pt.KeywordCxt = Pt.validateFunctionCode = void 0;
  const e = vf(), t = be, r = It, n = be, s = Mf(), o = Xf(), a = Jf(), c = ne, l = Qe, d = Ie, u = V, h = wn;
  function w(N) {
    if (I(N) && (Y(N), T(N))) {
      g(N);
      return;
    }
    $(N, () => (0, e.topBoolOrEmptySchema)(N));
  }
  Pt.validateFunctionCode = w;
  function $({ gen: N, validateName: O, schema: k, schemaEnv: D, opts: H }, x) {
    H.code.es5 ? N.func(O, (0, c._)`${l.default.data}, ${l.default.valCxt}`, D.$async, () => {
      N.code((0, c._)`"use strict"; ${E(k, H)}`), _(N, H), N.code(x);
    }) : N.func(O, (0, c._)`${l.default.data}, ${v(H)}`, D.$async, () => N.code(E(k, H)).code(x));
  }
  function v(N) {
    return (0, c._)`{${l.default.instancePath}="", ${l.default.parentData}, ${l.default.parentDataProperty}, ${l.default.rootData}=${l.default.data}${N.dynamicRef ? (0, c._)`, ${l.default.dynamicAnchors}={}` : c.nil}}={}`;
  }
  function _(N, O) {
    N.if(l.default.valCxt, () => {
      N.var(l.default.instancePath, (0, c._)`${l.default.valCxt}.${l.default.instancePath}`), N.var(l.default.parentData, (0, c._)`${l.default.valCxt}.${l.default.parentData}`), N.var(l.default.parentDataProperty, (0, c._)`${l.default.valCxt}.${l.default.parentDataProperty}`), N.var(l.default.rootData, (0, c._)`${l.default.valCxt}.${l.default.rootData}`), O.dynamicRef && N.var(l.default.dynamicAnchors, (0, c._)`${l.default.valCxt}.${l.default.dynamicAnchors}`);
    }, () => {
      N.var(l.default.instancePath, (0, c._)`""`), N.var(l.default.parentData, (0, c._)`undefined`), N.var(l.default.parentDataProperty, (0, c._)`undefined`), N.var(l.default.rootData, l.default.data), O.dynamicRef && N.var(l.default.dynamicAnchors, (0, c._)`{}`);
    });
  }
  function g(N) {
    const { schema: O, opts: k, gen: D } = N;
    $(N, () => {
      k.$comment && O.$comment && Q(N), ye(N), D.let(l.default.vErrors, null), D.let(l.default.errors, 0), k.unevaluated && m(N), le(N), B(N);
    });
  }
  function m(N) {
    const { gen: O, validateName: k } = N;
    N.evaluated = O.const("evaluated", (0, c._)`${k}.evaluated`), O.if((0, c._)`${N.evaluated}.dynamicProps`, () => O.assign((0, c._)`${N.evaluated}.props`, (0, c._)`undefined`)), O.if((0, c._)`${N.evaluated}.dynamicItems`, () => O.assign((0, c._)`${N.evaluated}.items`, (0, c._)`undefined`));
  }
  function E(N, O) {
    const k = typeof N == "object" && N[O.schemaId];
    return k && (O.code.source || O.code.process) ? (0, c._)`/*# sourceURL=${k} */` : c.nil;
  }
  function R(N, O) {
    if (I(N) && (Y(N), T(N))) {
      K(N, O);
      return;
    }
    (0, e.boolOrEmptySchema)(N, O);
  }
  function T({ schema: N, self: O }) {
    if (typeof N == "boolean")
      return !N;
    for (const k in N)
      if (O.RULES.all[k])
        return !0;
    return !1;
  }
  function I(N) {
    return typeof N.schema != "boolean";
  }
  function K(N, O) {
    const { schema: k, gen: D, opts: H } = N;
    H.$comment && k.$comment && Q(N), q(N), J(N);
    const x = D.const("_errs", l.default.errors);
    le(N, x), D.var(O, (0, c._)`${x} === ${l.default.errors}`);
  }
  function Y(N) {
    (0, u.checkUnknownRules)(N), he(N);
  }
  function le(N, O) {
    if (N.opts.jtd)
      return M(N, [], !1, O);
    const k = (0, t.getSchemaTypes)(N.schema), D = (0, t.coerceAndCheckDataType)(N, k);
    M(N, k, !D, O);
  }
  function he(N) {
    const { schema: O, errSchemaPath: k, opts: D, self: H } = N;
    O.$ref && D.ignoreKeywordsWithRef && (0, u.schemaHasRulesButRef)(O, H.RULES) && H.logger.warn(`$ref: keywords ignored in schema at path "${k}"`);
  }
  function ye(N) {
    const { schema: O, opts: k } = N;
    O.default !== void 0 && k.useDefaults && k.strictSchema && (0, u.checkStrictMode)(N, "default is ignored in the schema root");
  }
  function q(N) {
    const O = N.schema[N.opts.schemaId];
    O && (N.baseId = (0, d.resolveUrl)(N.opts.uriResolver, N.baseId, O));
  }
  function J(N) {
    if (N.schema.$async && !N.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function Q({ gen: N, schemaEnv: O, schema: k, errSchemaPath: D, opts: H }) {
    const x = k.$comment;
    if (H.$comment === !0)
      N.code((0, c._)`${l.default.self}.logger.log(${x})`);
    else if (typeof H.$comment == "function") {
      const _e = (0, c.str)`${D}/$comment`, Ue = N.scopeValue("root", { ref: O.root });
      N.code((0, c._)`${l.default.self}.opts.$comment(${x}, ${_e}, ${Ue}.schema)`);
    }
  }
  function B(N) {
    const { gen: O, schemaEnv: k, validateName: D, ValidationError: H, opts: x } = N;
    k.$async ? O.if((0, c._)`${l.default.errors} === 0`, () => O.return(l.default.data), () => O.throw((0, c._)`new ${H}(${l.default.vErrors})`)) : (O.assign((0, c._)`${D}.errors`, l.default.vErrors), x.unevaluated && ue(N), O.return((0, c._)`${l.default.errors} === 0`));
  }
  function ue({ gen: N, evaluated: O, props: k, items: D }) {
    k instanceof c.Name && N.assign((0, c._)`${O}.props`, k), D instanceof c.Name && N.assign((0, c._)`${O}.items`, D);
  }
  function M(N, O, k, D) {
    const { gen: H, schema: x, data: _e, allErrors: Ue, opts: Pe, self: Ne } = N, { RULES: ve } = Ne;
    if (x.$ref && (Pe.ignoreKeywordsWithRef || !(0, u.schemaHasRulesButRef)(x, ve))) {
      H.block(() => j(N, "$ref", ve.all.$ref.definition));
      return;
    }
    Pe.jtd || W(N, O), H.block(() => {
      for (const Ae of ve.rules)
        mt(Ae);
      mt(ve.post);
    });
    function mt(Ae) {
      (0, r.shouldUseGroup)(x, Ae) && (Ae.type ? (H.if((0, n.checkDataType)(Ae.type, _e, Pe.strictNumbers)), C(N, Ae), O.length === 1 && O[0] === Ae.type && k && (H.else(), (0, n.reportTypeError)(N)), H.endIf()) : C(N, Ae), Ue || H.if((0, c._)`${l.default.errors} === ${D || 0}`));
    }
  }
  function C(N, O) {
    const { gen: k, schema: D, opts: { useDefaults: H } } = N;
    H && (0, s.assignDefaults)(N, O.type), k.block(() => {
      for (const x of O.rules)
        (0, r.shouldUseRule)(D, x) && j(N, x.keyword, x.definition, O.type);
    });
  }
  function W(N, O) {
    N.schemaEnv.meta || !N.opts.strictTypes || (z(N, O), N.opts.allowUnionTypes || P(N, O), p(N, N.dataTypes));
  }
  function z(N, O) {
    if (O.length) {
      if (!N.dataTypes.length) {
        N.dataTypes = O;
        return;
      }
      O.forEach((k) => {
        y(N.dataTypes, k) || f(N, `type "${k}" not allowed by context "${N.dataTypes.join(",")}"`);
      }), i(N, O);
    }
  }
  function P(N, O) {
    O.length > 1 && !(O.length === 2 && O.includes("null")) && f(N, "use allowUnionTypes to allow union type keyword");
  }
  function p(N, O) {
    const k = N.self.RULES.all;
    for (const D in k) {
      const H = k[D];
      if (typeof H == "object" && (0, r.shouldUseRule)(N.schema, H)) {
        const { type: x } = H.definition;
        x.length && !x.some((_e) => S(O, _e)) && f(N, `missing type "${x.join(",")}" for keyword "${D}"`);
      }
    }
  }
  function S(N, O) {
    return N.includes(O) || O === "number" && N.includes("integer");
  }
  function y(N, O) {
    return N.includes(O) || O === "integer" && N.includes("number");
  }
  function i(N, O) {
    const k = [];
    for (const D of N.dataTypes)
      y(O, D) ? k.push(D) : O.includes("integer") && D === "number" && k.push("integer");
    N.dataTypes = k;
  }
  function f(N, O) {
    const k = N.schemaEnv.baseId + N.errSchemaPath;
    O += ` at "${k}" (strictTypes)`, (0, u.checkStrictMode)(N, O, N.opts.strictTypes);
  }
  class b {
    constructor(O, k, D) {
      if ((0, o.validateKeywordUsage)(O, k, D), this.gen = O.gen, this.allErrors = O.allErrors, this.keyword = D, this.data = O.data, this.schema = O.schema[D], this.$data = k.$data && O.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, u.schemaRefOrVal)(O, this.schema, D, this.$data), this.schemaType = k.schemaType, this.parentSchema = O.schema, this.params = {}, this.it = O, this.def = k, this.$data)
        this.schemaCode = O.gen.const("vSchema", U(this.$data, O));
      else if (this.schemaCode = this.schemaValue, !(0, o.validSchemaType)(this.schema, k.schemaType, k.allowUndefined))
        throw new Error(`${D} value must be ${JSON.stringify(k.schemaType)}`);
      ("code" in k ? k.trackErrors : k.errors !== !1) && (this.errsCount = O.gen.const("_errs", l.default.errors));
    }
    result(O, k, D) {
      this.failResult((0, c.not)(O), k, D);
    }
    failResult(O, k, D) {
      this.gen.if(O), D ? D() : this.error(), k ? (this.gen.else(), k(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(O, k) {
      this.failResult((0, c.not)(O), void 0, k);
    }
    fail(O) {
      if (O === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(O), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(O) {
      if (!this.$data)
        return this.fail(O);
      const { schemaCode: k } = this;
      this.fail((0, c._)`${k} !== undefined && (${(0, c.or)(this.invalid$data(), O)})`);
    }
    error(O, k, D) {
      if (k) {
        this.setParams(k), this._error(O, D), this.setParams({});
        return;
      }
      this._error(O, D);
    }
    _error(O, k) {
      (O ? h.reportExtraError : h.reportError)(this, this.def.error, k);
    }
    $dataError() {
      (0, h.reportError)(this, this.def.$dataError || h.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, h.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(O) {
      this.allErrors || this.gen.if(O);
    }
    setParams(O, k) {
      k ? Object.assign(this.params, O) : this.params = O;
    }
    block$data(O, k, D = c.nil) {
      this.gen.block(() => {
        this.check$data(O, D), k();
      });
    }
    check$data(O = c.nil, k = c.nil) {
      if (!this.$data)
        return;
      const { gen: D, schemaCode: H, schemaType: x, def: _e } = this;
      D.if((0, c.or)((0, c._)`${H} === undefined`, k)), O !== c.nil && D.assign(O, !0), (x.length || _e.validateSchema) && (D.elseIf(this.invalid$data()), this.$dataError(), O !== c.nil && D.assign(O, !1)), D.else();
    }
    invalid$data() {
      const { gen: O, schemaCode: k, schemaType: D, def: H, it: x } = this;
      return (0, c.or)(_e(), Ue());
      function _e() {
        if (D.length) {
          if (!(k instanceof c.Name))
            throw new Error("ajv implementation error");
          const Pe = Array.isArray(D) ? D : [D];
          return (0, c._)`${(0, n.checkDataTypes)(Pe, k, x.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return c.nil;
      }
      function Ue() {
        if (H.validateSchema) {
          const Pe = O.scopeValue("validate$data", { ref: H.validateSchema });
          return (0, c._)`!${Pe}(${k})`;
        }
        return c.nil;
      }
    }
    subschema(O, k) {
      const D = (0, a.getSubschema)(this.it, O);
      (0, a.extendSubschemaData)(D, this.it, O), (0, a.extendSubschemaMode)(D, O);
      const H = { ...this.it, ...D, items: void 0, props: void 0 };
      return R(H, k), H;
    }
    mergeEvaluated(O, k) {
      const { it: D, gen: H } = this;
      D.opts.unevaluated && (D.props !== !0 && O.props !== void 0 && (D.props = u.mergeEvaluated.props(H, O.props, D.props, k)), D.items !== !0 && O.items !== void 0 && (D.items = u.mergeEvaluated.items(H, O.items, D.items, k)));
    }
    mergeValidEvaluated(O, k) {
      const { it: D, gen: H } = this;
      if (D.opts.unevaluated && (D.props !== !0 || D.items !== !0))
        return H.if(k, () => this.mergeEvaluated(O, c.Name)), !0;
    }
  }
  Pt.KeywordCxt = b;
  function j(N, O, k, D) {
    const H = new b(N, k, O);
    "code" in k ? k.code(H, D) : H.$data && k.validate ? (0, o.funcKeywordCode)(H, k) : "macro" in k ? (0, o.macroKeywordCode)(H, k) : (k.compile || k.validate) && (0, o.funcKeywordCode)(H, k);
  }
  const A = /^\/(?:[^~]|~0|~1)*$/, G = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function U(N, { dataLevel: O, dataNames: k, dataPathArr: D }) {
    let H, x;
    if (N === "")
      return l.default.rootData;
    if (N[0] === "/") {
      if (!A.test(N))
        throw new Error(`Invalid JSON-pointer: ${N}`);
      H = N, x = l.default.rootData;
    } else {
      const Ne = G.exec(N);
      if (!Ne)
        throw new Error(`Invalid JSON-pointer: ${N}`);
      const ve = +Ne[1];
      if (H = Ne[2], H === "#") {
        if (ve >= O)
          throw new Error(Pe("property/index", ve));
        return D[O - ve];
      }
      if (ve > O)
        throw new Error(Pe("data", ve));
      if (x = k[O - ve], !H)
        return x;
    }
    let _e = x;
    const Ue = H.split("/");
    for (const Ne of Ue)
      Ne && (x = (0, c._)`${x}${(0, c.getProperty)((0, u.unescapeJsonPointer)(Ne))}`, _e = (0, c._)`${_e} && ${x}`);
    return _e;
    function Pe(Ne, ve) {
      return `Cannot access ${Ne} ${ve} levels up, current level is ${O}`;
    }
  }
  return Pt.getData = U, Pt;
}
var En = {};
Object.defineProperty(En, "__esModule", { value: !0 });
let ch = class extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
};
En.default = ch;
var qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
const qs = Ie;
let lh = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, qs.resolveUrl)(t, r, n), this.missingSchema = (0, qs.normalizeId)((0, qs.getFullPath)(t, this.missingRef));
  }
};
qr.default = lh;
var Ge = {};
Object.defineProperty(Ge, "__esModule", { value: !0 });
Ge.resolveSchema = Ge.getCompilingSchema = Ge.resolveRef = Ge.compileSchema = Ge.SchemaEnv = void 0;
const st = ne, uh = En, er = Qe, ct = Ie, Ji = V, dh = _s();
let vs = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, ct.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
Ge.SchemaEnv = vs;
function Go(e) {
  const t = Kl.call(this, e);
  if (t)
    return t;
  const r = (0, ct.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: o } = this.opts, a = new st.CodeGen(this.scope, { es5: n, lines: s, ownProperties: o });
  let c;
  e.$async && (c = a.scopeValue("Error", {
    ref: uh.default,
    code: (0, st._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const l = a.scopeName("validate");
  e.validateName = l;
  const d = {
    gen: a,
    allErrors: this.opts.allErrors,
    data: er.default.data,
    parentData: er.default.parentData,
    parentDataProperty: er.default.parentDataProperty,
    dataNames: [er.default.data],
    dataPathArr: [st.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: a.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, st.stringify)(e.schema) } : { ref: e.schema }),
    validateName: l,
    ValidationError: c,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: st.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, st._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, dh.validateFunctionCode)(d), a.optimize(this.opts.code.optimize);
    const h = a.toString();
    u = `${a.scopeRefs(er.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const $ = new Function(`${er.default.self}`, `${er.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(l, { ref: $ }), $.errors = null, $.schema = e.schema, $.schemaEnv = e, e.$async && ($.$async = !0), this.opts.code.source === !0 && ($.source = { validateName: l, validateCode: h, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: v, items: _ } = d;
      $.evaluated = {
        props: v instanceof st.Name ? void 0 : v,
        items: _ instanceof st.Name ? void 0 : _,
        dynamicProps: v instanceof st.Name,
        dynamicItems: _ instanceof st.Name
      }, $.source && ($.source.evaluated = (0, st.stringify)($.evaluated));
    }
    return e.validate = $, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
Ge.compileSchema = Go;
function fh(e, t, r) {
  var n;
  r = (0, ct.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let o = ph.call(this, e, r);
  if (o === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: c } = this.opts;
    a && (o = new vs({ schema: a, schemaId: c, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[r] = hh.call(this, o);
}
Ge.resolveRef = fh;
function hh(e) {
  return (0, ct.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Go.call(this, e);
}
function Kl(e) {
  for (const t of this._compilations)
    if (mh(t, e))
      return t;
}
Ge.getCompilingSchema = Kl;
function mh(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function ph(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || ws.call(this, e, t);
}
function ws(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, ct._getFullPath)(this.opts.uriResolver, r);
  let s = (0, ct.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Ks.call(this, r, e);
  const o = (0, ct.normalizeId)(n), a = this.refs[o] || this.schemas[o];
  if (typeof a == "string") {
    const c = ws.call(this, e, a);
    return typeof (c == null ? void 0 : c.schema) != "object" ? void 0 : Ks.call(this, r, c);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || Go.call(this, a), o === (0, ct.normalizeId)(t)) {
      const { schema: c } = a, { schemaId: l } = this.opts, d = c[l];
      return d && (s = (0, ct.resolveUrl)(this.opts.uriResolver, s, d)), new vs({ schema: c, schemaId: l, root: e, baseId: s });
    }
    return Ks.call(this, r, a);
  }
}
Ge.resolveSchema = ws;
const $h = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Ks(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const c of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const l = r[(0, Ji.unescapeFragment)(c)];
    if (l === void 0)
      return;
    r = l;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !$h.has(c) && d && (t = (0, ct.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let o;
  if (typeof r != "boolean" && r.$ref && !(0, Ji.schemaHasRulesButRef)(r, this.RULES)) {
    const c = (0, ct.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    o = ws.call(this, n, c);
  }
  const { schemaId: a } = this.opts;
  if (o = o || new vs({ schema: r, schemaId: a, root: n, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const yh = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", gh = "Meta-schema for $data reference (JSON AnySchema extension proposal)", _h = "object", vh = [
  "$data"
], wh = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, Eh = !1, bh = {
  $id: yh,
  description: gh,
  type: _h,
  required: vh,
  properties: wh,
  additionalProperties: Eh
};
var Ho = {}, Es = { exports: {} };
const Sh = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), Gl = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u), Bo = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu), Hl = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu), Ph = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
function Bl(e) {
  let t = "", r = 0, n = 0;
  for (n = 0; n < e.length; n++)
    if (r = e[n].charCodeAt(0), r !== 48) {
      if (!(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
        return "";
      t += e[n];
      break;
    }
  for (n += 1; n < e.length; n++) {
    if (r = e[n].charCodeAt(0), !(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
      return "";
    t += e[n];
  }
  return t;
}
const Nh = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function Yi(e) {
  return e.length = 0, !0;
}
function Rh(e, t, r) {
  if (e.length) {
    const n = Bl(e);
    if (n !== "")
      t.push(n);
    else
      return r.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function Th(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let o = !1, a = !1, c = Rh;
  for (let l = 0; l < e.length; l++) {
    const d = e[l];
    if (!(d === "[" || d === "]"))
      if (d === ":") {
        if (o === !0 && (a = !0), !c(s, n, r))
          break;
        if (++t > 7) {
          r.error = !0;
          break;
        }
        l > 0 && e[l - 1] === ":" && (o = !0), n.push(":");
        continue;
      } else if (d === "%") {
        if (!c(s, n, r))
          break;
        c = Yi;
      } else {
        s.push(d);
        continue;
      }
  }
  return s.length && (c === Yi ? r.zone = s.join("") : a ? n.push(s.join("")) : n.push(Bl(s))), r.address = n.join(""), r;
}
function Wl(e) {
  if (Oh(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = Th(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function Oh(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function Ih(e) {
  let t = e;
  const r = [];
  let n = -1, s = 0;
  for (; s = t.length; ) {
    if (s === 1) {
      if (t === ".")
        break;
      if (t === "/") {
        r.push("/");
        break;
      } else {
        r.push(t);
        break;
      }
    } else if (s === 2) {
      if (t[0] === ".") {
        if (t[1] === ".")
          break;
        if (t[1] === "/") {
          t = t.slice(2);
          continue;
        }
      } else if (t[0] === "/" && (t[1] === "." || t[1] === "/")) {
        r.push("/");
        break;
      }
    } else if (s === 3 && t === "/..") {
      r.length !== 0 && r.pop(), r.push("/");
      break;
    }
    if (t[0] === ".") {
      if (t[1] === ".") {
        if (t[2] === "/") {
          t = t.slice(3);
          continue;
        }
      } else if (t[1] === "/") {
        t = t.slice(2);
        continue;
      }
    } else if (t[0] === "/" && t[1] === ".") {
      if (t[2] === "/") {
        t = t.slice(2);
        continue;
      } else if (t[2] === "." && t[3] === "/") {
        t = t.slice(3), r.length !== 0 && r.pop();
        continue;
      }
    }
    if ((n = t.indexOf("/", 1)) === -1) {
      r.push(t);
      break;
    } else
      r.push(t.slice(0, n)), t = t.slice(n);
  }
  return r.join("");
}
const jh = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" }, Ah = /[@/?#:]/g, kh = /[@/?#]/g;
function Xl(e, t) {
  const r = t ? kh : Ah;
  return r.lastIndex = 0, e.replace(r, (n) => jh[n]);
}
function Ch(e, t = !1) {
  if (e.indexOf("%") === -1)
    return e;
  let r = "";
  for (let n = 0; n < e.length; n++) {
    if (e[n] === "%" && n + 2 < e.length) {
      const s = e.slice(n + 1, n + 3);
      if (Bo(s)) {
        const o = s.toUpperCase(), a = String.fromCharCode(parseInt(o, 16));
        t && Hl(a) ? r += a : r += "%" + o, n += 2;
        continue;
      }
    }
    r += e[n];
  }
  return r;
}
function Dh(e) {
  let t = "";
  for (let r = 0; r < e.length; r++) {
    if (e[r] === "%" && r + 2 < e.length) {
      const n = e.slice(r + 1, r + 3);
      if (Bo(n)) {
        const s = n.toUpperCase(), o = String.fromCharCode(parseInt(s, 16));
        o !== "." && Hl(o) ? t += o : t += "%" + s, r += 2;
        continue;
      }
    }
    Ph(e[r]) ? t += e[r] : t += escape(e[r]);
  }
  return t;
}
function Mh(e) {
  let t = "";
  for (let r = 0; r < e.length; r++) {
    if (e[r] === "%" && r + 2 < e.length) {
      const n = e.slice(r + 1, r + 3);
      if (Bo(n)) {
        t += "%" + n.toUpperCase(), r += 2;
        continue;
      }
    }
    t += escape(e[r]);
  }
  return t;
}
function Lh(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    if (!Gl(r)) {
      const n = Wl(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = Xl(r, !1);
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var Jl = {
  nonSimpleDomain: Nh,
  recomposeAuthority: Lh,
  reescapeHostDelimiters: Xl,
  normalizePercentEncoding: Ch,
  normalizePathEncoding: Dh,
  escapePreservingEscapes: Mh,
  removeDotSegments: Ih,
  isIPv4: Gl,
  isUUID: Sh,
  normalizeIPv6: Wl
};
const { isUUID: Vh } = Jl, Fh = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Yl(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function Ql(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function Zl(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function zh(e) {
  return e.secure = Yl(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function Uh(e) {
  if ((e.port === (Yl(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function qh(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(Fh);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, o = Wo(s);
    e.path = void 0, o && (e = o.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function Kh(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, o = Wo(s);
  o && (e = o.serialize(e, t));
  const a = e, c = e.nss;
  return a.path = `${n || t.nid}:${c}`, t.skipEscape = !0, a;
}
function Gh(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !Vh(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function Hh(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const xl = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: Ql,
    serialize: Zl
  }
), Bh = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: xl.domainHost,
    parse: Ql,
    serialize: Zl
  }
), Yn = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: zh,
    serialize: Uh
  }
), Wh = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: Yn.domainHost,
    parse: Yn.parse,
    serialize: Yn.serialize
  }
), Xh = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: qh,
    serialize: Kh,
    skipNormalize: !0
  }
), Jh = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: Gh,
    serialize: Hh,
    skipNormalize: !0
  }
), as = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: xl,
    https: Bh,
    ws: Yn,
    wss: Wh,
    urn: Xh,
    "urn:uuid": Jh
  }
);
Object.setPrototypeOf(as, null);
function Wo(e) {
  return e && (as[
    /** @type {SchemeName} */
    e
  ] || as[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var Yh = {
  SCHEMES: as,
  getSchemeHandler: Wo
};
const { normalizeIPv6: Qh, removeDotSegments: sn, recomposeAuthority: Zh, normalizePercentEncoding: xh, normalizePathEncoding: em, escapePreservingEscapes: tm, reescapeHostDelimiters: rm, isIPv4: nm, nonSimpleDomain: sm } = Jl, { SCHEMES: om, getSchemeHandler: eu } = Yh;
function am(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  dm(e, t) : typeof e == "object" && (e = /** @type {T} */
  Vr(mr(e, t), t)), e;
}
function im(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = tu(Vr(e, n), Vr(t, n), n, !0);
  return n.skipEscape = !0, mr(s, n);
}
function tu(e, t, r, n) {
  const s = {};
  return n || (e = Vr(mr(e, r), r), t = Vr(mr(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = sn(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = sn(t.path || ""), s.query = t.query) : (t.path ? (t.path[0] === "/" ? s.path = sn(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = sn(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function cm(e, t, r) {
  const n = Qi(e, r), s = Qi(t, r);
  return n !== void 0 && s !== void 0 && n.toLowerCase() === s.toLowerCase();
}
function mr(e, t) {
  const r = {
    host: e.host,
    scheme: e.scheme,
    userinfo: e.userinfo,
    port: e.port,
    path: e.path,
    query: e.query,
    nid: e.nid,
    nss: e.nss,
    uuid: e.uuid,
    fragment: e.fragment,
    reference: e.reference,
    resourceName: e.resourceName,
    secure: e.secure,
    error: ""
  }, n = Object.assign({}, t), s = [], o = eu(n.scheme || r.scheme);
  o && o.serialize && o.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = xh(r.path) : (r.path = tm(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const a = Zh(r);
  if (a !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(a), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let c = r.path;
    !n.absolutePath && (!o || !o.absolutePath) && (c = sn(c)), a === void 0 && c[0] === "/" && c[1] === "/" && (c = "/%2F" + c.slice(2)), s.push(c);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const lm = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function um(e, t) {
  if (t[2] !== void 0 && e.path && e.path[0] !== "/")
    return 'URI path must start with "/" when authority is present.';
  if (typeof e.port == "number" && (e.port < 0 || e.port > 65535))
    return "URI port is malformed.";
}
function ru(e, t) {
  const r = Object.assign({}, t), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  };
  let s = !1, o = !1;
  r.reference === "suffix" && (r.scheme ? e = r.scheme + ":" + e : e = "//" + e);
  const a = e.match(lm);
  if (a) {
    n.scheme = a[1], n.userinfo = a[3], n.host = a[4], n.port = parseInt(a[5], 10), n.path = a[6] || "", n.query = a[7], n.fragment = a[8], isNaN(n.port) && (n.port = a[5]);
    const c = um(n, a);
    if (c !== void 0 && (n.error = n.error || c, s = !0), n.host)
      if (nm(n.host) === !1) {
        const u = Qh(n.host);
        n.host = u.host.toLowerCase(), o = u.isIPV6;
      } else
        o = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const l = eu(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!l || !l.unicodeSupport) && n.host && (r.domainHost || l && l.domainHost) && o === !1 && sm(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (d) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + d;
      }
    if ((!l || l && !l.skipNormalize) && (e.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = rm(unescape(n.host), o))), n.path && (n.path = em(n.path)), n.fragment))
      try {
        n.fragment = encodeURI(decodeURIComponent(n.fragment));
      } catch {
        n.error = n.error || "URI malformed";
      }
    l && l.parse && l.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return { parsed: n, malformedAuthorityOrPort: s };
}
function Vr(e, t) {
  return ru(e, t).parsed;
}
function dm(e, t) {
  return nu(e, t).normalized;
}
function nu(e, t) {
  const { parsed: r, malformedAuthorityOrPort: n } = ru(e, t);
  return {
    normalized: n ? e : mr(r, t),
    malformedAuthorityOrPort: n
  };
}
function Qi(e, t) {
  if (typeof e == "string") {
    const { normalized: r, malformedAuthorityOrPort: n } = nu(e, t);
    return n ? void 0 : r;
  }
  if (typeof e == "object")
    return mr(e, t);
}
const Xo = {
  SCHEMES: om,
  normalize: am,
  resolve: im,
  resolveComponent: tu,
  equal: cm,
  serialize: mr,
  parse: Vr
};
Es.exports = Xo;
Es.exports.default = Xo;
Es.exports.fastUri = Xo;
var su = Es.exports;
Object.defineProperty(Ho, "__esModule", { value: !0 });
const ou = su;
ou.code = 'require("ajv/dist/runtime/uri").default';
Ho.default = ou;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = _s();
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = ne;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = En, s = qr, o = hr, a = Ge, c = ne, l = Ie, d = be, u = V, h = bh, w = Ho, $ = (P, p) => new RegExp(P, p);
  $.code = "new RegExp";
  const v = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), g = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, E = 200;
  function R(P) {
    var p, S, y, i, f, b, j, A, G, U, N, O, k, D, H, x, _e, Ue, Pe, Ne, ve, mt, Ae, Yt, Qt;
    const tt = P.strict, Zt = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, Yr = Zt === !0 || Zt === void 0 ? 1 : Zt || 0, Qr = (y = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && y !== void 0 ? y : $, Ls = (i = P.uriResolver) !== null && i !== void 0 ? i : w.default;
    return {
      strictSchema: (b = (f = P.strictSchema) !== null && f !== void 0 ? f : tt) !== null && b !== void 0 ? b : !0,
      strictNumbers: (A = (j = P.strictNumbers) !== null && j !== void 0 ? j : tt) !== null && A !== void 0 ? A : !0,
      strictTypes: (U = (G = P.strictTypes) !== null && G !== void 0 ? G : tt) !== null && U !== void 0 ? U : "log",
      strictTuples: (O = (N = P.strictTuples) !== null && N !== void 0 ? N : tt) !== null && O !== void 0 ? O : "log",
      strictRequired: (D = (k = P.strictRequired) !== null && k !== void 0 ? k : tt) !== null && D !== void 0 ? D : !1,
      code: P.code ? { ...P.code, optimize: Yr, regExp: Qr } : { optimize: Yr, regExp: Qr },
      loopRequired: (H = P.loopRequired) !== null && H !== void 0 ? H : E,
      loopEnum: (x = P.loopEnum) !== null && x !== void 0 ? x : E,
      meta: (_e = P.meta) !== null && _e !== void 0 ? _e : !0,
      messages: (Ue = P.messages) !== null && Ue !== void 0 ? Ue : !0,
      inlineRefs: (Pe = P.inlineRefs) !== null && Pe !== void 0 ? Pe : !0,
      schemaId: (Ne = P.schemaId) !== null && Ne !== void 0 ? Ne : "$id",
      addUsedSchema: (ve = P.addUsedSchema) !== null && ve !== void 0 ? ve : !0,
      validateSchema: (mt = P.validateSchema) !== null && mt !== void 0 ? mt : !0,
      validateFormats: (Ae = P.validateFormats) !== null && Ae !== void 0 ? Ae : !0,
      unicodeRegExp: (Yt = P.unicodeRegExp) !== null && Yt !== void 0 ? Yt : !0,
      int32range: (Qt = P.int32range) !== null && Qt !== void 0 ? Qt : !0,
      uriResolver: Ls
    };
  }
  class T {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...R(p) };
      const { es5: S, lines: y } = this.opts.code;
      this.scope = new c.ValueScope({ scope: {}, prefixes: _, es5: S, lines: y }), this.logger = J(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, o.getRules)(), I.call(this, g, p, "NOT SUPPORTED"), I.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ye.call(this), p.formats && le.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && he.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), Y.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: S, schemaId: y } = this.opts;
      let i = h;
      y === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), S && p && this.addMetaSchema(i, i[y], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: S } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[S] || p : void 0;
    }
    validate(p, S) {
      let y;
      if (typeof p == "string") {
        if (y = this.getSchema(p), !y)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        y = this.compile(p);
      const i = y(S);
      return "$async" in y || (this.errors = y.errors), i;
    }
    compile(p, S) {
      const y = this._addSchema(p, S);
      return y.validate || this._compileSchemaEnv(y);
    }
    compileAsync(p, S) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: y } = this.opts;
      return i.call(this, p, S);
      async function i(U, N) {
        await f.call(this, U.$schema);
        const O = this._addSchema(U, N);
        return O.validate || b.call(this, O);
      }
      async function f(U) {
        U && !this.getSchema(U) && await i.call(this, { $ref: U }, !0);
      }
      async function b(U) {
        try {
          return this._compileSchemaEnv(U);
        } catch (N) {
          if (!(N instanceof s.default))
            throw N;
          return j.call(this, N), await A.call(this, N.missingSchema), b.call(this, U);
        }
      }
      function j({ missingSchema: U, missingRef: N }) {
        if (this.refs[U])
          throw new Error(`AnySchema ${U} is loaded but ${N} cannot be resolved`);
      }
      async function A(U) {
        const N = await G.call(this, U);
        this.refs[U] || await f.call(this, N.$schema), this.refs[U] || this.addSchema(N, U, S);
      }
      async function G(U) {
        const N = this._loading[U];
        if (N)
          return N;
        try {
          return await (this._loading[U] = y(U));
        } finally {
          delete this._loading[U];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, S, y, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const b of p)
          this.addSchema(b, void 0, y, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: b } = this.opts;
        if (f = p[b], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${b} must be string`);
      }
      return S = (0, l.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(p, y, S, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, S, y = this.opts.validateSchema) {
      return this.addSchema(p, S, !0, y), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, S) {
      if (typeof p == "boolean")
        return !0;
      let y;
      if (y = p.$schema, y !== void 0 && typeof y != "string")
        throw new Error("$schema must be a string");
      if (y = y || this.opts.defaultMeta || this.defaultMeta(), !y)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate(y, p);
      if (!i && S) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return i;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(p) {
      let S;
      for (; typeof (S = K.call(this, p)) == "string"; )
        p = S;
      if (S === void 0) {
        const { schemaId: y } = this.opts, i = new a.SchemaEnv({ schema: {}, schemaId: y });
        if (S = a.resolveSchema.call(this, i, p), !S)
          return;
        this.refs[p] = S;
      }
      return S.validate || this._compileSchemaEnv(S);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(p) {
      if (p instanceof RegExp)
        return this._removeAllSchemas(this.schemas, p), this._removeAllSchemas(this.refs, p), this;
      switch (typeof p) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const S = K.call(this, p);
          return typeof S == "object" && this._cache.delete(S.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const S = p;
          this._cache.delete(S);
          let y = p[this.opts.schemaId];
          return y && (y = (0, l.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const S of p)
        this.addKeyword(S);
      return this;
    }
    addKeyword(p, S) {
      let y;
      if (typeof p == "string")
        y = p, typeof S == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), S.keyword = y);
      else if (typeof p == "object" && S === void 0) {
        if (S = p, y = S.keyword, Array.isArray(y) && !y.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (B.call(this, y, S), !S)
        return (0, u.eachItem)(y, (f) => ue.call(this, f)), this;
      C.call(this, S);
      const i = {
        ...S,
        type: (0, d.getJSONTypes)(S.type),
        schemaType: (0, d.getJSONTypes)(S.schemaType)
      };
      return (0, u.eachItem)(y, i.type.length === 0 ? (f) => ue.call(this, f, i) : (f) => i.type.forEach((b) => ue.call(this, f, i, b))), this;
    }
    getKeyword(p) {
      const S = this.RULES.all[p];
      return typeof S == "object" ? S.definition : !!S;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: S } = this;
      delete S.keywords[p], delete S.all[p];
      for (const y of S.rules) {
        const i = y.rules.findIndex((f) => f.keyword === p);
        i >= 0 && y.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, S) {
      return typeof S == "string" && (S = new RegExp(S)), this.formats[p] = S, this;
    }
    errorsText(p = this.errors, { separator: S = ", ", dataVar: y = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${y}${i.instancePath} ${i.message}`).reduce((i, f) => i + S + f);
    }
    $dataMetaSchema(p, S) {
      const y = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of S) {
        const f = i.split("/").slice(1);
        let b = p;
        for (const j of f)
          b = b[j];
        for (const j in y) {
          const A = y[j];
          if (typeof A != "object")
            continue;
          const { $data: G } = A.definition, U = b[j];
          G && U && (b[j] = z(U));
        }
      }
      return p;
    }
    _removeAllSchemas(p, S) {
      for (const y in p) {
        const i = p[y];
        (!S || S.test(y)) && (typeof i == "string" ? delete p[y] : i && !i.meta && (this._cache.delete(i.schema), delete p[y]));
      }
    }
    _addSchema(p, S, y, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let b;
      const { schemaId: j } = this.opts;
      if (typeof p == "object")
        b = p[j];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let A = this._cache.get(p);
      if (A !== void 0)
        return A;
      y = (0, l.normalizeId)(b || y);
      const G = l.getSchemaRefs.call(this, p, y);
      return A = new a.SchemaEnv({ schema: p, schemaId: j, meta: S, baseId: y, localRefs: G }), this._cache.set(A.schema, A), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = A), i && this.validateSchema(p, !0), A;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : a.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const S = this.opts;
      this.opts = this._metaOpts;
      try {
        a.compileSchema.call(this, p);
      } finally {
        this.opts = S;
      }
    }
  }
  T.ValidationError = n.default, T.MissingRefError = s.default, e.default = T;
  function I(P, p, S, y = "error") {
    for (const i in P) {
      const f = i;
      f in p && this.logger[y](`${S}: option ${i}. ${P[f]}`);
    }
  }
  function K(P) {
    return P = (0, l.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function Y() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const p in P)
          this.addSchema(P[p], p);
  }
  function le() {
    for (const P in this.opts.formats) {
      const p = this.opts.formats[P];
      p && this.addFormat(P, p);
    }
  }
  function he(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in P) {
      const S = P[p];
      S.keyword || (S.keyword = p), this.addKeyword(S);
    }
  }
  function ye() {
    const P = { ...this.opts };
    for (const p of v)
      delete P[p];
    return P;
  }
  const q = { log() {
  }, warn() {
  }, error() {
  } };
  function J(P) {
    if (P === !1)
      return q;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const Q = /^[a-z_$][a-z0-9_$:-]*$/i;
  function B(P, p) {
    const { RULES: S } = this;
    if ((0, u.eachItem)(P, (y) => {
      if (S.keywords[y])
        throw new Error(`Keyword ${y} is already defined`);
      if (!Q.test(y))
        throw new Error(`Keyword ${y} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function ue(P, p, S) {
    var y;
    const i = p == null ? void 0 : p.post;
    if (S && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let b = i ? f.post : f.rules.find(({ type: A }) => A === S);
    if (b || (b = { type: S, rules: [] }, f.rules.push(b)), f.keywords[P] = !0, !p)
      return;
    const j = {
      keyword: P,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? M.call(this, b, j, p.before) : b.rules.push(j), f.all[P] = j, (y = p.implements) === null || y === void 0 || y.forEach((A) => this.addKeyword(A));
  }
  function M(P, p, S) {
    const y = P.rules.findIndex((i) => i.keyword === S);
    y >= 0 ? P.rules.splice(y, 0, p) : (P.rules.push(p), this.logger.warn(`rule ${S} is not defined`));
  }
  function C(P) {
    let { metaSchema: p } = P;
    p !== void 0 && (P.$data && this.opts.$data && (p = z(p)), P.validateSchema = this.compile(p, !0));
  }
  const W = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function z(P) {
    return { anyOf: [P, W] };
  }
})(Nl);
var Jo = {}, Yo = {}, Qo = {};
Object.defineProperty(Qo, "__esModule", { value: !0 });
const fm = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Qo.default = fm;
var kt = {};
Object.defineProperty(kt, "__esModule", { value: !0 });
kt.callRef = kt.getValidate = void 0;
const hm = qr, Zi = ie, We = ne, _r = Qe, xi = Ge, jn = V, mm = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: o, validateName: a, opts: c, self: l } = n, { root: d } = o;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = xi.resolveRef.call(l, d, s, r);
    if (u === void 0)
      throw new hm.default(n.opts.uriResolver, s, r);
    if (u instanceof xi.SchemaEnv)
      return w(u);
    return $(u);
    function h() {
      if (o === d)
        return Qn(e, a, o, o.$async);
      const v = t.scopeValue("root", { ref: d });
      return Qn(e, (0, We._)`${v}.validate`, d, d.$async);
    }
    function w(v) {
      const _ = au(e, v);
      Qn(e, _, v, v.$async);
    }
    function $(v) {
      const _ = t.scopeValue("schema", c.code.source === !0 ? { ref: v, code: (0, We.stringify)(v) } : { ref: v }), g = t.name("valid"), m = e.subschema({
        schema: v,
        dataTypes: [],
        schemaPath: We.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, g);
      e.mergeEvaluated(m), e.ok(g);
    }
  }
};
function au(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, We._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
kt.getValidate = au;
function Qn(e, t, r, n) {
  const { gen: s, it: o } = e, { allErrors: a, schemaEnv: c, opts: l } = o, d = l.passContext ? _r.default.this : We.nil;
  n ? u() : h();
  function u() {
    if (!c.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, We._)`await ${(0, Zi.callValidateCode)(e, t, d)}`), $(t), a || s.assign(v, !0);
    }, (_) => {
      s.if((0, We._)`!(${_} instanceof ${o.ValidationError})`, () => s.throw(_)), w(_), a || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, Zi.callValidateCode)(e, t, d), () => $(t), () => w(t));
  }
  function w(v) {
    const _ = (0, We._)`${v}.errors`;
    s.assign(_r.default.vErrors, (0, We._)`${_r.default.vErrors} === null ? ${_} : ${_r.default.vErrors}.concat(${_})`), s.assign(_r.default.errors, (0, We._)`${_r.default.vErrors}.length`);
  }
  function $(v) {
    var _;
    if (!o.opts.unevaluated)
      return;
    const g = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (o.props !== !0)
      if (g && !g.dynamicProps)
        g.props !== void 0 && (o.props = jn.mergeEvaluated.props(s, g.props, o.props));
      else {
        const m = s.var("props", (0, We._)`${v}.evaluated.props`);
        o.props = jn.mergeEvaluated.props(s, m, o.props, We.Name);
      }
    if (o.items !== !0)
      if (g && !g.dynamicItems)
        g.items !== void 0 && (o.items = jn.mergeEvaluated.items(s, g.items, o.items));
      else {
        const m = s.var("items", (0, We._)`${v}.evaluated.items`);
        o.items = jn.mergeEvaluated.items(s, m, o.items, We.Name);
      }
  }
}
kt.callRef = Qn;
kt.default = mm;
Object.defineProperty(Yo, "__esModule", { value: !0 });
const pm = Qo, $m = kt, ym = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  pm.default,
  $m.default
];
Yo.default = ym;
var Zo = {}, xo = {};
Object.defineProperty(xo, "__esModule", { value: !0 });
const is = ne, Vt = is.operators, cs = {
  maximum: { okStr: "<=", ok: Vt.LTE, fail: Vt.GT },
  minimum: { okStr: ">=", ok: Vt.GTE, fail: Vt.LT },
  exclusiveMaximum: { okStr: "<", ok: Vt.LT, fail: Vt.GTE },
  exclusiveMinimum: { okStr: ">", ok: Vt.GT, fail: Vt.LTE }
}, gm = {
  message: ({ keyword: e, schemaCode: t }) => (0, is.str)`must be ${cs[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, is._)`{comparison: ${cs[e].okStr}, limit: ${t}}`
}, _m = {
  keyword: Object.keys(cs),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: gm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, is._)`${r} ${cs[t].fail} ${n} || isNaN(${r})`);
  }
};
xo.default = _m;
var ea = {};
Object.defineProperty(ea, "__esModule", { value: !0 });
const cn = ne, vm = {
  message: ({ schemaCode: e }) => (0, cn.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, cn._)`{multipleOf: ${e}}`
}, wm = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: vm,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, o = s.opts.multipleOfPrecision, a = t.let("res"), c = o ? (0, cn._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, cn._)`${a} !== parseInt(${a})`;
    e.fail$data((0, cn._)`(${n} === 0 || (${a} = ${r}/${n}, ${c}))`);
  }
};
ea.default = wm;
var ta = {}, ra = {};
Object.defineProperty(ra, "__esModule", { value: !0 });
function iu(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
ra.default = iu;
iu.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(ta, "__esModule", { value: !0 });
const rr = ne, Em = V, bm = ra, Sm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, rr.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, rr._)`{limit: ${e}}`
}, Pm = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Sm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, o = t === "maxLength" ? rr.operators.GT : rr.operators.LT, a = s.opts.unicode === !1 ? (0, rr._)`${r}.length` : (0, rr._)`${(0, Em.useFunc)(e.gen, bm.default)}(${r})`;
    e.fail$data((0, rr._)`${a} ${o} ${n}`);
  }
};
ta.default = Pm;
var na = {};
Object.defineProperty(na, "__esModule", { value: !0 });
const Nm = ie, Rm = V, Rr = ne, Tm = {
  message: ({ schemaCode: e }) => (0, Rr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Rr._)`{pattern: ${e}}`
}, Om = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Tm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e, c = a.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: l } = a.opts.code, d = l.code === "new RegExp" ? (0, Rr._)`new RegExp` : (0, Rm.useFunc)(t, l), u = t.let("valid");
      t.try(() => t.assign(u, (0, Rr._)`${d}(${o}, ${c}).test(${r})`), () => t.assign(u, !1)), e.fail$data((0, Rr._)`!${u}`);
    } else {
      const l = (0, Nm.usePattern)(e, s);
      e.fail$data((0, Rr._)`!${l}.test(${r})`);
    }
  }
};
na.default = Om;
var sa = {};
Object.defineProperty(sa, "__esModule", { value: !0 });
const ln = ne, Im = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, ln.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, ln._)`{limit: ${e}}`
}, jm = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Im,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? ln.operators.GT : ln.operators.LT;
    e.fail$data((0, ln._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
sa.default = jm;
var oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
const tn = ie, un = ne, Am = V, km = {
  message: ({ params: { missingProperty: e } }) => (0, un.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, un._)`{missingProperty: ${e}}`
}, Cm = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: km,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: o, it: a } = e, { opts: c } = a;
    if (!o && r.length === 0)
      return;
    const l = r.length >= c.loopRequired;
    if (a.allErrors ? d() : u(), c.strictRequired) {
      const $ = e.parentSchema.properties, { definedProperties: v } = e.it;
      for (const _ of r)
        if (($ == null ? void 0 : $[_]) === void 0 && !v.has(_)) {
          const g = a.schemaEnv.baseId + a.errSchemaPath, m = `required property "${_}" is not defined at "${g}" (strictRequired)`;
          (0, Am.checkStrictMode)(a, m, a.opts.strictRequired);
        }
    }
    function d() {
      if (l || o)
        e.block$data(un.nil, h);
      else
        for (const $ of r)
          (0, tn.checkReportMissingProp)(e, $);
    }
    function u() {
      const $ = t.let("missing");
      if (l || o) {
        const v = t.let("valid", !0);
        e.block$data(v, () => w($, v)), e.ok(v);
      } else
        t.if((0, tn.checkMissingProp)(e, r, $)), (0, tn.reportMissingProp)(e, $), t.else();
    }
    function h() {
      t.forOf("prop", n, ($) => {
        e.setParams({ missingProperty: $ }), t.if((0, tn.noPropertyInData)(t, s, $, c.ownProperties), () => e.error());
      });
    }
    function w($, v) {
      e.setParams({ missingProperty: $ }), t.forOf($, n, () => {
        t.assign(v, (0, tn.propertyInData)(t, s, $, c.ownProperties)), t.if((0, un.not)(v), () => {
          e.error(), t.break();
        });
      }, un.nil);
    }
  }
};
oa.default = Cm;
var aa = {};
Object.defineProperty(aa, "__esModule", { value: !0 });
const dn = ne, Dm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, dn.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, dn._)`{limit: ${e}}`
}, Mm = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Dm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? dn.operators.GT : dn.operators.LT;
    e.fail$data((0, dn._)`${r}.length ${s} ${n}`);
  }
};
aa.default = Mm;
var ia = {}, bn = {};
Object.defineProperty(bn, "__esModule", { value: !0 });
const cu = gs;
cu.code = 'require("ajv/dist/runtime/equal").default';
bn.default = cu;
Object.defineProperty(ia, "__esModule", { value: !0 });
const Gs = be, Te = ne, Lm = V, Vm = bn, Fm = {
  message: ({ params: { i: e, j: t } }) => (0, Te.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Te._)`{i: ${e}, j: ${t}}`
}, zm = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Fm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: o, schemaCode: a, it: c } = e;
    if (!n && !s)
      return;
    const l = t.let("valid"), d = o.items ? (0, Gs.getSchemaTypes)(o.items) : [];
    e.block$data(l, u, (0, Te._)`${a} === false`), e.ok(l);
    function u() {
      const v = t.let("i", (0, Te._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: v, j: _ }), t.assign(l, !0), t.if((0, Te._)`${v} > 1`, () => (h() ? w : $)(v, _));
    }
    function h() {
      return d.length > 0 && !d.some((v) => v === "object" || v === "array");
    }
    function w(v, _) {
      const g = t.name("item"), m = (0, Gs.checkDataTypes)(d, g, c.opts.strictNumbers, Gs.DataType.Wrong), E = t.const("indices", (0, Te._)`{}`);
      t.for((0, Te._)`;${v}--;`, () => {
        t.let(g, (0, Te._)`${r}[${v}]`), t.if(m, (0, Te._)`continue`), d.length > 1 && t.if((0, Te._)`typeof ${g} == "string"`, (0, Te._)`${g} += "_"`), t.if((0, Te._)`typeof ${E}[${g}] == "number"`, () => {
          t.assign(_, (0, Te._)`${E}[${g}]`), e.error(), t.assign(l, !1).break();
        }).code((0, Te._)`${E}[${g}] = ${v}`);
      });
    }
    function $(v, _) {
      const g = (0, Lm.useFunc)(t, Vm.default), m = t.name("outer");
      t.label(m).for((0, Te._)`;${v}--;`, () => t.for((0, Te._)`${_} = ${v}; ${_}--;`, () => t.if((0, Te._)`${g}(${r}[${v}], ${r}[${_}])`, () => {
        e.error(), t.assign(l, !1).break(m);
      })));
    }
  }
};
ia.default = zm;
var ca = {};
Object.defineProperty(ca, "__esModule", { value: !0 });
const _o = ne, Um = V, qm = bn, Km = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, _o._)`{allowedValue: ${e}}`
}, Gm = {
  keyword: "const",
  $data: !0,
  error: Km,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: o } = e;
    n || o && typeof o == "object" ? e.fail$data((0, _o._)`!${(0, Um.useFunc)(t, qm.default)}(${r}, ${s})`) : e.fail((0, _o._)`${o} !== ${r}`);
  }
};
ca.default = Gm;
var la = {};
Object.defineProperty(la, "__esModule", { value: !0 });
const on = ne, Hm = V, Bm = bn, Wm = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, on._)`{allowedValues: ${e}}`
}, Xm = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Wm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const c = s.length >= a.opts.loopEnum;
    let l;
    const d = () => l ?? (l = (0, Hm.useFunc)(t, Bm.default));
    let u;
    if (c || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const $ = t.const("vSchema", o);
      u = (0, on.or)(...s.map((v, _) => w($, _)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", o, ($) => t.if((0, on._)`${d()}(${r}, ${$})`, () => t.assign(u, !0).break()));
    }
    function w($, v) {
      const _ = s[v];
      return typeof _ == "object" && _ !== null ? (0, on._)`${d()}(${r}, ${$}[${v}])` : (0, on._)`${r} === ${_}`;
    }
  }
};
la.default = Xm;
Object.defineProperty(Zo, "__esModule", { value: !0 });
const Jm = xo, Ym = ea, Qm = ta, Zm = na, xm = sa, ep = oa, tp = aa, rp = ia, np = ca, sp = la, op = [
  // number
  Jm.default,
  Ym.default,
  // string
  Qm.default,
  Zm.default,
  // object
  xm.default,
  ep.default,
  // array
  tp.default,
  rp.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  np.default,
  sp.default
];
Zo.default = op;
var ua = {}, Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.validateAdditionalItems = void 0;
const nr = ne, vo = V, ap = {
  message: ({ params: { len: e } }) => (0, nr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, nr._)`{limit: ${e}}`
}, ip = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: ap,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, vo.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    lu(e, n);
  }
};
function lu(e, t) {
  const { gen: r, schema: n, data: s, keyword: o, it: a } = e;
  a.items = !0;
  const c = r.const("len", (0, nr._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, nr._)`${c} <= ${t.length}`);
  else if (typeof n == "object" && !(0, vo.alwaysValidSchema)(a, n)) {
    const d = r.var("valid", (0, nr._)`${c} <= ${t.length}`);
    r.if((0, nr.not)(d), () => l(d)), e.ok(d);
  }
  function l(d) {
    r.forRange("i", t.length, c, (u) => {
      e.subschema({ keyword: o, dataProp: u, dataPropType: vo.Type.Num }, d), a.allErrors || r.if((0, nr.not)(d), () => r.break());
    });
  }
}
Kr.validateAdditionalItems = lu;
Kr.default = ip;
var da = {}, Gr = {};
Object.defineProperty(Gr, "__esModule", { value: !0 });
Gr.validateTuple = void 0;
const ec = ne, Zn = V, cp = ie, lp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return uu(e, "additionalItems", t);
    r.items = !0, !(0, Zn.alwaysValidSchema)(r, t) && e.ok((0, cp.validateArray)(e));
  }
};
function uu(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: o, keyword: a, it: c } = e;
  u(s), c.opts.unevaluated && r.length && c.items !== !0 && (c.items = Zn.mergeEvaluated.items(n, r.length, c.items));
  const l = n.name("valid"), d = n.const("len", (0, ec._)`${o}.length`);
  r.forEach((h, w) => {
    (0, Zn.alwaysValidSchema)(c, h) || (n.if((0, ec._)`${d} > ${w}`, () => e.subschema({
      keyword: a,
      schemaProp: w,
      dataProp: w
    }, l)), e.ok(l));
  });
  function u(h) {
    const { opts: w, errSchemaPath: $ } = c, v = r.length, _ = v === h.minItems && (v === h.maxItems || h[t] === !1);
    if (w.strictTuples && !_) {
      const g = `"${a}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${$}"`;
      (0, Zn.checkStrictMode)(c, g, w.strictTuples);
    }
  }
}
Gr.validateTuple = uu;
Gr.default = lp;
Object.defineProperty(da, "__esModule", { value: !0 });
const up = Gr, dp = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, up.validateTuple)(e, "items")
};
da.default = dp;
var fa = {};
Object.defineProperty(fa, "__esModule", { value: !0 });
const tc = ne, fp = V, hp = ie, mp = Kr, pp = {
  message: ({ params: { len: e } }) => (0, tc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, tc._)`{limit: ${e}}`
}, $p = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: pp,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, fp.alwaysValidSchema)(n, t) && (s ? (0, mp.validateAdditionalItems)(e, s) : e.ok((0, hp.validateArray)(e)));
  }
};
fa.default = $p;
var ha = {};
Object.defineProperty(ha, "__esModule", { value: !0 });
const xe = ne, An = V, yp = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, xe.str)`must contain at least ${e} valid item(s)` : (0, xe.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, xe._)`{minContains: ${e}}` : (0, xe._)`{minContains: ${e}, maxContains: ${t}}`
}, gp = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: yp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    let a, c;
    const { minContains: l, maxContains: d } = n;
    o.opts.next ? (a = l === void 0 ? 1 : l, c = d) : a = 1;
    const u = t.const("len", (0, xe._)`${s}.length`);
    if (e.setParams({ min: a, max: c }), c === void 0 && a === 0) {
      (0, An.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (c !== void 0 && a > c) {
      (0, An.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, An.alwaysValidSchema)(o, r)) {
      let _ = (0, xe._)`${u} >= ${a}`;
      c !== void 0 && (_ = (0, xe._)`${_} && ${u} <= ${c}`), e.pass(_);
      return;
    }
    o.items = !0;
    const h = t.name("valid");
    c === void 0 && a === 1 ? $(h, () => t.if(h, () => t.break())) : a === 0 ? (t.let(h, !0), c !== void 0 && t.if((0, xe._)`${s}.length > 0`, w)) : (t.let(h, !1), w()), e.result(h, () => e.reset());
    function w() {
      const _ = t.name("_valid"), g = t.let("count", 0);
      $(_, () => t.if(_, () => v(g)));
    }
    function $(_, g) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: An.Type.Num,
          compositeRule: !0
        }, _), g();
      });
    }
    function v(_) {
      t.code((0, xe._)`${_}++`), c === void 0 ? t.if((0, xe._)`${_} >= ${a}`, () => t.assign(h, !0).break()) : (t.if((0, xe._)`${_} > ${c}`, () => t.assign(h, !1).break()), a === 1 ? t.assign(h, !0) : t.if((0, xe._)`${_} >= ${a}`, () => t.assign(h, !0)));
    }
  }
};
ha.default = gp;
var bs = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = ne, r = V, n = ie;
  e.error = {
    message: ({ params: { property: l, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${l} is present`;
    },
    params: ({ params: { property: l, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${l},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${u}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(l) {
      const [d, u] = o(l);
      a(l, d), c(l, u);
    }
  };
  function o({ schema: l }) {
    const d = {}, u = {};
    for (const h in l) {
      if (h === "__proto__")
        continue;
      const w = Array.isArray(l[h]) ? d : u;
      w[h] = l[h];
    }
    return [d, u];
  }
  function a(l, d = l.schema) {
    const { gen: u, data: h, it: w } = l;
    if (Object.keys(d).length === 0)
      return;
    const $ = u.let("missing");
    for (const v in d) {
      const _ = d[v];
      if (_.length === 0)
        continue;
      const g = (0, n.propertyInData)(u, h, v, w.opts.ownProperties);
      l.setParams({
        property: v,
        depsCount: _.length,
        deps: _.join(", ")
      }), w.allErrors ? u.if(g, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(l, m);
      }) : (u.if((0, t._)`${g} && (${(0, n.checkMissingProp)(l, _, $)})`), (0, n.reportMissingProp)(l, $), u.else());
    }
  }
  e.validatePropertyDeps = a;
  function c(l, d = l.schema) {
    const { gen: u, data: h, keyword: w, it: $ } = l, v = u.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)($, d[_]) || (u.if(
        (0, n.propertyInData)(u, h, _, $.opts.ownProperties),
        () => {
          const g = l.subschema({ keyword: w, schemaProp: _ }, v);
          l.mergeValidEvaluated(g, v);
        },
        () => u.var(v, !0)
        // TODO var
      ), l.ok(v));
  }
  e.validateSchemaDeps = c, e.default = s;
})(bs);
var ma = {};
Object.defineProperty(ma, "__esModule", { value: !0 });
const du = ne, _p = V, vp = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, du._)`{propertyName: ${e.propertyName}}`
}, wp = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: vp,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, _p.alwaysValidSchema)(s, r))
      return;
    const o = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, o), t.if((0, du.not)(o), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
ma.default = wp;
var Ss = {};
Object.defineProperty(Ss, "__esModule", { value: !0 });
const kn = ie, at = ne, Ep = Qe, Cn = V, bp = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, at._)`{additionalProperty: ${e.additionalProperty}}`
}, Sp = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: bp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: o, it: a } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: c, opts: l } = a;
    if (a.props = !0, l.removeAdditional !== "all" && (0, Cn.alwaysValidSchema)(a, r))
      return;
    const d = (0, kn.allSchemaProperties)(n.properties), u = (0, kn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, at._)`${o} === ${Ep.default.errors}`);
    function h() {
      t.forIn("key", s, (g) => {
        !d.length && !u.length ? v(g) : t.if(w(g), () => v(g));
      });
    }
    function w(g) {
      let m;
      if (d.length > 8) {
        const E = (0, Cn.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, kn.isOwnProperty)(t, E, g);
      } else d.length ? m = (0, at.or)(...d.map((E) => (0, at._)`${g} === ${E}`)) : m = at.nil;
      return u.length && (m = (0, at.or)(m, ...u.map((E) => (0, at._)`${(0, kn.usePattern)(e, E)}.test(${g})`))), (0, at.not)(m);
    }
    function $(g) {
      t.code((0, at._)`delete ${s}[${g}]`);
    }
    function v(g) {
      if (l.removeAdditional === "all" || l.removeAdditional && r === !1) {
        $(g);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: g }), e.error(), c || t.break();
        return;
      }
      if (typeof r == "object" && !(0, Cn.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        l.removeAdditional === "failing" ? (_(g, m, !1), t.if((0, at.not)(m), () => {
          e.reset(), $(g);
        })) : (_(g, m), c || t.if((0, at.not)(m), () => t.break()));
      }
    }
    function _(g, m, E) {
      const R = {
        keyword: "additionalProperties",
        dataProp: g,
        dataPropType: Cn.Type.Str
      };
      E === !1 && Object.assign(R, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(R, m);
    }
  }
};
Ss.default = Sp;
var pa = {};
Object.defineProperty(pa, "__esModule", { value: !0 });
const Pp = _s(), rc = ie, Hs = V, nc = Ss, Np = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && nc.default.code(new Pp.KeywordCxt(o, nc.default, "additionalProperties"));
    const a = (0, rc.allSchemaProperties)(r);
    for (const h of a)
      o.definedProperties.add(h);
    o.opts.unevaluated && a.length && o.props !== !0 && (o.props = Hs.mergeEvaluated.props(t, (0, Hs.toHash)(a), o.props));
    const c = a.filter((h) => !(0, Hs.alwaysValidSchema)(o, r[h]));
    if (c.length === 0)
      return;
    const l = t.name("valid");
    for (const h of c)
      d(h) ? u(h) : (t.if((0, rc.propertyInData)(t, s, h, o.opts.ownProperties)), u(h), o.allErrors || t.else().var(l, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(l);
    function d(h) {
      return o.opts.useDefaults && !o.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, l);
    }
  }
};
pa.default = Np;
var $a = {};
Object.defineProperty($a, "__esModule", { value: !0 });
const sc = ie, Dn = ne, oc = V, ac = V, Rp = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: o } = e, { opts: a } = o, c = (0, sc.allSchemaProperties)(r), l = c.filter((_) => (0, oc.alwaysValidSchema)(o, r[_]));
    if (c.length === 0 || l.length === c.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const d = a.strictSchema && !a.allowMatchingProperties && s.properties, u = t.name("valid");
    o.props !== !0 && !(o.props instanceof Dn.Name) && (o.props = (0, ac.evaluatedPropsToName)(t, o.props));
    const { props: h } = o;
    w();
    function w() {
      for (const _ of c)
        d && $(_), o.allErrors ? v(_) : (t.var(u, !0), v(_), t.if(u));
    }
    function $(_) {
      for (const g in d)
        new RegExp(_).test(g) && (0, oc.checkStrictMode)(o, `property ${g} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function v(_) {
      t.forIn("key", n, (g) => {
        t.if((0, Dn._)`${(0, sc.usePattern)(e, _)}.test(${g})`, () => {
          const m = l.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: g,
            dataPropType: ac.Type.Str
          }, u), o.opts.unevaluated && h !== !0 ? t.assign((0, Dn._)`${h}[${g}]`, !0) : !m && !o.allErrors && t.if((0, Dn.not)(u), () => t.break());
        });
      });
    }
  }
};
$a.default = Rp;
var ya = {};
Object.defineProperty(ya, "__esModule", { value: !0 });
const Tp = V, Op = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Tp.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
ya.default = Op;
var ga = {};
Object.defineProperty(ga, "__esModule", { value: !0 });
const Ip = ie, jp = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Ip.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
ga.default = jp;
var _a = {};
Object.defineProperty(_a, "__esModule", { value: !0 });
const xn = ne, Ap = V, kp = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, xn._)`{passingSchemas: ${e.passing}}`
}, Cp = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: kp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const o = r, a = t.let("valid", !1), c = t.let("passing", null), l = t.name("_valid");
    e.setParams({ passing: c }), t.block(d), e.result(a, () => e.reset(), () => e.error(!0));
    function d() {
      o.forEach((u, h) => {
        let w;
        (0, Ap.alwaysValidSchema)(s, u) ? t.var(l, !0) : w = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, l), h > 0 && t.if((0, xn._)`${l} && ${a}`).assign(a, !1).assign(c, (0, xn._)`[${c}, ${h}]`).else(), t.if(l, () => {
          t.assign(a, !0), t.assign(c, h), w && e.mergeEvaluated(w, xn.Name);
        });
      });
    }
  }
};
_a.default = Cp;
var va = {};
Object.defineProperty(va, "__esModule", { value: !0 });
const Dp = V, Mp = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((o, a) => {
      if ((0, Dp.alwaysValidSchema)(n, o))
        return;
      const c = e.subschema({ keyword: "allOf", schemaProp: a }, s);
      e.ok(s), e.mergeEvaluated(c);
    });
  }
};
va.default = Mp;
var wa = {};
Object.defineProperty(wa, "__esModule", { value: !0 });
const ls = ne, fu = V, Lp = {
  message: ({ params: e }) => (0, ls.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, ls._)`{failingKeyword: ${e.ifClause}}`
}, Vp = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Lp,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, fu.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = ic(n, "then"), o = ic(n, "else");
    if (!s && !o)
      return;
    const a = t.let("valid", !0), c = t.name("_valid");
    if (l(), e.reset(), s && o) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(c, d("then", u), d("else", u));
    } else s ? t.if(c, d("then")) : t.if((0, ls.not)(c), d("else"));
    e.pass(a, () => e.error(!0));
    function l() {
      const u = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, c);
      e.mergeEvaluated(u);
    }
    function d(u, h) {
      return () => {
        const w = e.subschema({ keyword: u }, c);
        t.assign(a, c), e.mergeValidEvaluated(w, a), h ? t.assign(h, (0, ls._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function ic(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, fu.alwaysValidSchema)(e, r);
}
wa.default = Vp;
var Ea = {};
Object.defineProperty(Ea, "__esModule", { value: !0 });
const Fp = V, zp = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Fp.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Ea.default = zp;
Object.defineProperty(ua, "__esModule", { value: !0 });
const Up = Kr, qp = da, Kp = Gr, Gp = fa, Hp = ha, Bp = bs, Wp = ma, Xp = Ss, Jp = pa, Yp = $a, Qp = ya, Zp = ga, xp = _a, e$ = va, t$ = wa, r$ = Ea;
function n$(e = !1) {
  const t = [
    // any
    Qp.default,
    Zp.default,
    xp.default,
    e$.default,
    t$.default,
    r$.default,
    // object
    Wp.default,
    Xp.default,
    Bp.default,
    Jp.default,
    Yp.default
  ];
  return e ? t.push(qp.default, Gp.default) : t.push(Up.default, Kp.default), t.push(Hp.default), t;
}
ua.default = n$;
var ba = {}, Hr = {};
Object.defineProperty(Hr, "__esModule", { value: !0 });
Hr.dynamicAnchor = void 0;
const Bs = ne, s$ = Qe, cc = Ge, o$ = kt, a$ = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => hu(e, e.schema)
};
function hu(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, Bs._)`${s$.default.dynamicAnchors}${(0, Bs.getProperty)(t)}`, o = n.errSchemaPath === "#" ? n.validateName : i$(e);
  r.if((0, Bs._)`!${s}`, () => r.assign(s, o));
}
Hr.dynamicAnchor = hu;
function i$(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: o, localRefs: a, meta: c } = t.root, { schemaId: l } = n.opts, d = new cc.SchemaEnv({ schema: r, schemaId: l, root: s, baseId: o, localRefs: a, meta: c });
  return cc.compileSchema.call(n, d), (0, o$.getValidate)(e, d);
}
Hr.default = a$;
var Br = {};
Object.defineProperty(Br, "__esModule", { value: !0 });
Br.dynamicRef = void 0;
const lc = ne, c$ = Qe, uc = kt, l$ = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => mu(e, e.schema)
};
function mu(e, t) {
  const { gen: r, keyword: n, it: s } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const o = t.slice(1);
  if (s.allErrors)
    a();
  else {
    const l = r.let("valid", !1);
    a(l), e.ok(l);
  }
  function a(l) {
    if (s.schemaEnv.root.dynamicAnchors[o]) {
      const d = r.let("_v", (0, lc._)`${c$.default.dynamicAnchors}${(0, lc.getProperty)(o)}`);
      r.if(d, c(d, l), c(s.validateName, l));
    } else
      c(s.validateName, l)();
  }
  function c(l, d) {
    return d ? () => r.block(() => {
      (0, uc.callRef)(e, l), r.let(d, !0);
    }) : () => (0, uc.callRef)(e, l);
  }
}
Br.dynamicRef = mu;
Br.default = l$;
var Sa = {};
Object.defineProperty(Sa, "__esModule", { value: !0 });
const u$ = Hr, d$ = V, f$ = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, u$.dynamicAnchor)(e, "") : (0, d$.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
Sa.default = f$;
var Pa = {};
Object.defineProperty(Pa, "__esModule", { value: !0 });
const h$ = Br, m$ = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, h$.dynamicRef)(e, e.schema)
};
Pa.default = m$;
Object.defineProperty(ba, "__esModule", { value: !0 });
const p$ = Hr, $$ = Br, y$ = Sa, g$ = Pa, _$ = [p$.default, $$.default, y$.default, g$.default];
ba.default = _$;
var Na = {}, Ra = {};
Object.defineProperty(Ra, "__esModule", { value: !0 });
const dc = bs, v$ = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: dc.error,
  code: (e) => (0, dc.validatePropertyDeps)(e)
};
Ra.default = v$;
var Ta = {};
Object.defineProperty(Ta, "__esModule", { value: !0 });
const w$ = bs, E$ = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, w$.validateSchemaDeps)(e)
};
Ta.default = E$;
var Oa = {};
Object.defineProperty(Oa, "__esModule", { value: !0 });
const b$ = V, S$ = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, b$.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
Oa.default = S$;
Object.defineProperty(Na, "__esModule", { value: !0 });
const P$ = Ra, N$ = Ta, R$ = Oa, T$ = [P$.default, N$.default, R$.default];
Na.default = T$;
var Ia = {}, ja = {};
Object.defineProperty(ja, "__esModule", { value: !0 });
const Ut = ne, fc = V, O$ = Qe, I$ = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, Ut._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, j$ = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: I$,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: o } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: a, props: c } = o;
    c instanceof Ut.Name ? t.if((0, Ut._)`${c} !== true`, () => t.forIn("key", n, (h) => t.if(d(c, h), () => l(h)))) : c !== !0 && t.forIn("key", n, (h) => c === void 0 ? l(h) : t.if(u(c, h), () => l(h))), o.props = !0, e.ok((0, Ut._)`${s} === ${O$.default.errors}`);
    function l(h) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: h }), e.error(), a || t.break();
        return;
      }
      if (!(0, fc.alwaysValidSchema)(o, r)) {
        const w = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: fc.Type.Str
        }, w), a || t.if((0, Ut.not)(w), () => t.break());
      }
    }
    function d(h, w) {
      return (0, Ut._)`!${h} || !${h}[${w}]`;
    }
    function u(h, w) {
      const $ = [];
      for (const v in h)
        h[v] === !0 && $.push((0, Ut._)`${w} !== ${v}`);
      return (0, Ut.and)(...$);
    }
  }
};
ja.default = j$;
var Aa = {};
Object.defineProperty(Aa, "__esModule", { value: !0 });
const sr = ne, hc = V, A$ = {
  message: ({ params: { len: e } }) => (0, sr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, sr._)`{limit: ${e}}`
}, k$ = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: A$,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, o = s.items || 0;
    if (o === !0)
      return;
    const a = t.const("len", (0, sr._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: o }), e.fail((0, sr._)`${a} > ${o}`);
    else if (typeof r == "object" && !(0, hc.alwaysValidSchema)(s, r)) {
      const l = t.var("valid", (0, sr._)`${a} <= ${o}`);
      t.if((0, sr.not)(l), () => c(l, o)), e.ok(l);
    }
    s.items = !0;
    function c(l, d) {
      t.forRange("i", d, a, (u) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: u, dataPropType: hc.Type.Num }, l), s.allErrors || t.if((0, sr.not)(l), () => t.break());
      });
    }
  }
};
Aa.default = k$;
Object.defineProperty(Ia, "__esModule", { value: !0 });
const C$ = ja, D$ = Aa, M$ = [C$.default, D$.default];
Ia.default = M$;
var ka = {}, Ca = {};
Object.defineProperty(Ca, "__esModule", { value: !0 });
const we = ne, L$ = {
  message: ({ schemaCode: e }) => (0, we.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, we._)`{format: ${e}}`
}, V$ = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: L$,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: o, schemaCode: a, it: c } = e, { opts: l, errSchemaPath: d, schemaEnv: u, self: h } = c;
    if (!l.validateFormats)
      return;
    s ? w() : $();
    function w() {
      const v = r.scopeValue("formats", {
        ref: h.formats,
        code: l.code.formats
      }), _ = r.const("fDef", (0, we._)`${v}[${a}]`), g = r.let("fType"), m = r.let("format");
      r.if((0, we._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign(g, (0, we._)`${_}.type || "string"`).assign(m, (0, we._)`${_}.validate`), () => r.assign(g, (0, we._)`"string"`).assign(m, _)), e.fail$data((0, we.or)(E(), R()));
      function E() {
        return l.strictSchema === !1 ? we.nil : (0, we._)`${a} && !${m}`;
      }
      function R() {
        const T = u.$async ? (0, we._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, we._)`${m}(${n})`, I = (0, we._)`(typeof ${m} == "function" ? ${T} : ${m}.test(${n}))`;
        return (0, we._)`${m} && ${m} !== true && ${g} === ${t} && !${I}`;
      }
    }
    function $() {
      const v = h.formats[o];
      if (!v) {
        E();
        return;
      }
      if (v === !0)
        return;
      const [_, g, m] = R(v);
      _ === t && e.pass(T());
      function E() {
        if (l.strictSchema === !1) {
          h.logger.warn(I());
          return;
        }
        throw new Error(I());
        function I() {
          return `unknown format "${o}" ignored in schema at path "${d}"`;
        }
      }
      function R(I) {
        const K = I instanceof RegExp ? (0, we.regexpCode)(I) : l.code.formats ? (0, we._)`${l.code.formats}${(0, we.getProperty)(o)}` : void 0, Y = r.scopeValue("formats", { key: o, ref: I, code: K });
        return typeof I == "object" && !(I instanceof RegExp) ? [I.type || "string", I.validate, (0, we._)`${Y}.validate`] : ["string", I, Y];
      }
      function T() {
        if (typeof v == "object" && !(v instanceof RegExp) && v.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, we._)`await ${m}(${n})`;
        }
        return typeof g == "function" ? (0, we._)`${m}(${n})` : (0, we._)`${m}.test(${n})`;
      }
    }
  }
};
Ca.default = V$;
Object.defineProperty(ka, "__esModule", { value: !0 });
const F$ = Ca, z$ = [F$.default];
ka.default = z$;
var Fr = {};
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.contentVocabulary = Fr.metadataVocabulary = void 0;
Fr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Fr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Jo, "__esModule", { value: !0 });
const U$ = Yo, q$ = Zo, K$ = ua, G$ = ba, H$ = Na, B$ = Ia, W$ = ka, mc = Fr, X$ = [
  G$.default,
  U$.default,
  q$.default,
  (0, K$.default)(!0),
  W$.default,
  mc.metadataVocabulary,
  mc.contentVocabulary,
  H$.default,
  B$.default
];
Jo.default = X$;
var Da = {}, Ps = {};
Object.defineProperty(Ps, "__esModule", { value: !0 });
Ps.DiscrError = void 0;
var pc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(pc || (Ps.DiscrError = pc = {}));
Object.defineProperty(Da, "__esModule", { value: !0 });
const br = ne, wo = Ps, $c = Ge, J$ = qr, Y$ = V, Q$ = {
  message: ({ params: { discrError: e, tagName: t } }) => e === wo.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, br._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, Z$ = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Q$,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: o } = e, { oneOf: a } = s;
    if (!o.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const c = n.propertyName;
    if (typeof c != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!a)
      throw new Error("discriminator: requires oneOf keyword");
    const l = t.let("valid", !1), d = t.const("tag", (0, br._)`${r}${(0, br.getProperty)(c)}`);
    t.if((0, br._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: wo.DiscrError.Tag, tag: d, tagName: c })), e.ok(l);
    function u() {
      const $ = w();
      t.if(!1);
      for (const v in $)
        t.elseIf((0, br._)`${d} === ${v}`), t.assign(l, h($[v]));
      t.else(), e.error(!1, { discrError: wo.DiscrError.Mapping, tag: d, tagName: c }), t.endIf();
    }
    function h($) {
      const v = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: $ }, v);
      return e.mergeEvaluated(_, br.Name), v;
    }
    function w() {
      var $;
      const v = {}, _ = m(s);
      let g = !0;
      for (let T = 0; T < a.length; T++) {
        let I = a[T];
        if (I != null && I.$ref && !(0, Y$.schemaHasRulesButRef)(I, o.self.RULES)) {
          const Y = I.$ref;
          if (I = $c.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, Y), I instanceof $c.SchemaEnv && (I = I.schema), I === void 0)
            throw new J$.default(o.opts.uriResolver, o.baseId, Y);
        }
        const K = ($ = I == null ? void 0 : I.properties) === null || $ === void 0 ? void 0 : $[c];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${c}"`);
        g = g && (_ || m(I)), E(K, T);
      }
      if (!g)
        throw new Error(`discriminator: "${c}" must be required`);
      return v;
      function m({ required: T }) {
        return Array.isArray(T) && T.includes(c);
      }
      function E(T, I) {
        if (T.const)
          R(T.const, I);
        else if (T.enum)
          for (const K of T.enum)
            R(K, I);
        else
          throw new Error(`discriminator: "properties/${c}" must have "const" or "enum"`);
      }
      function R(T, I) {
        if (typeof T != "string" || T in v)
          throw new Error(`discriminator: "${c}" values must be unique strings`);
        v[T] = I;
      }
    }
  }
};
Da.default = Z$;
var Ma = {};
const x$ = "https://json-schema.org/draft/2020-12/schema", ey = "https://json-schema.org/draft/2020-12/schema", ty = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, ry = "meta", ny = "Core and Validation specifications meta-schema", sy = [
  {
    $ref: "meta/core"
  },
  {
    $ref: "meta/applicator"
  },
  {
    $ref: "meta/unevaluated"
  },
  {
    $ref: "meta/validation"
  },
  {
    $ref: "meta/meta-data"
  },
  {
    $ref: "meta/format-annotation"
  },
  {
    $ref: "meta/content"
  }
], oy = [
  "object",
  "boolean"
], ay = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", iy = {
  definitions: {
    $comment: '"definitions" has been replaced by "$defs".',
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    deprecated: !0,
    default: {}
  },
  dependencies: {
    $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $dynamicRef: "#meta"
        },
        {
          $ref: "meta/validation#/$defs/stringArray"
        }
      ]
    },
    deprecated: !0,
    default: {}
  },
  $recursiveAnchor: {
    $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
    $ref: "meta/core#/$defs/anchorString",
    deprecated: !0
  },
  $recursiveRef: {
    $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
    $ref: "meta/core#/$defs/uriReferenceString",
    deprecated: !0
  }
}, cy = {
  $schema: x$,
  $id: ey,
  $vocabulary: ty,
  $dynamicAnchor: ry,
  title: ny,
  allOf: sy,
  type: oy,
  $comment: ay,
  properties: iy
}, ly = "https://json-schema.org/draft/2020-12/schema", uy = "https://json-schema.org/draft/2020-12/meta/applicator", dy = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, fy = "meta", hy = "Applicator vocabulary meta-schema", my = [
  "object",
  "boolean"
], py = {
  prefixItems: {
    $ref: "#/$defs/schemaArray"
  },
  items: {
    $dynamicRef: "#meta"
  },
  contains: {
    $dynamicRef: "#meta"
  },
  additionalProperties: {
    $dynamicRef: "#meta"
  },
  properties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependentSchemas: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  propertyNames: {
    $dynamicRef: "#meta"
  },
  if: {
    $dynamicRef: "#meta"
  },
  then: {
    $dynamicRef: "#meta"
  },
  else: {
    $dynamicRef: "#meta"
  },
  allOf: {
    $ref: "#/$defs/schemaArray"
  },
  anyOf: {
    $ref: "#/$defs/schemaArray"
  },
  oneOf: {
    $ref: "#/$defs/schemaArray"
  },
  not: {
    $dynamicRef: "#meta"
  }
}, $y = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, yy = {
  $schema: ly,
  $id: uy,
  $vocabulary: dy,
  $dynamicAnchor: fy,
  title: hy,
  type: my,
  properties: py,
  $defs: $y
}, gy = "https://json-schema.org/draft/2020-12/schema", _y = "https://json-schema.org/draft/2020-12/meta/unevaluated", vy = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, wy = "meta", Ey = "Unevaluated applicator vocabulary meta-schema", by = [
  "object",
  "boolean"
], Sy = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, Py = {
  $schema: gy,
  $id: _y,
  $vocabulary: vy,
  $dynamicAnchor: wy,
  title: Ey,
  type: by,
  properties: Sy
}, Ny = "https://json-schema.org/draft/2020-12/schema", Ry = "https://json-schema.org/draft/2020-12/meta/content", Ty = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Oy = "meta", Iy = "Content vocabulary meta-schema", jy = [
  "object",
  "boolean"
], Ay = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, ky = {
  $schema: Ny,
  $id: Ry,
  $vocabulary: Ty,
  $dynamicAnchor: Oy,
  title: Iy,
  type: jy,
  properties: Ay
}, Cy = "https://json-schema.org/draft/2020-12/schema", Dy = "https://json-schema.org/draft/2020-12/meta/core", My = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, Ly = "meta", Vy = "Core vocabulary meta-schema", Fy = [
  "object",
  "boolean"
], zy = {
  $id: {
    $ref: "#/$defs/uriReferenceString",
    $comment: "Non-empty fragments not allowed.",
    pattern: "^[^#]*#?$"
  },
  $schema: {
    $ref: "#/$defs/uriString"
  },
  $ref: {
    $ref: "#/$defs/uriReferenceString"
  },
  $anchor: {
    $ref: "#/$defs/anchorString"
  },
  $dynamicRef: {
    $ref: "#/$defs/uriReferenceString"
  },
  $dynamicAnchor: {
    $ref: "#/$defs/anchorString"
  },
  $vocabulary: {
    type: "object",
    propertyNames: {
      $ref: "#/$defs/uriString"
    },
    additionalProperties: {
      type: "boolean"
    }
  },
  $comment: {
    type: "string"
  },
  $defs: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    }
  }
}, Uy = {
  anchorString: {
    type: "string",
    pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
  },
  uriString: {
    type: "string",
    format: "uri"
  },
  uriReferenceString: {
    type: "string",
    format: "uri-reference"
  }
}, qy = {
  $schema: Cy,
  $id: Dy,
  $vocabulary: My,
  $dynamicAnchor: Ly,
  title: Vy,
  type: Fy,
  properties: zy,
  $defs: Uy
}, Ky = "https://json-schema.org/draft/2020-12/schema", Gy = "https://json-schema.org/draft/2020-12/meta/format-annotation", Hy = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, By = "meta", Wy = "Format vocabulary meta-schema for annotation results", Xy = [
  "object",
  "boolean"
], Jy = {
  format: {
    type: "string"
  }
}, Yy = {
  $schema: Ky,
  $id: Gy,
  $vocabulary: Hy,
  $dynamicAnchor: By,
  title: Wy,
  type: Xy,
  properties: Jy
}, Qy = "https://json-schema.org/draft/2020-12/schema", Zy = "https://json-schema.org/draft/2020-12/meta/meta-data", xy = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, e0 = "meta", t0 = "Meta-data vocabulary meta-schema", r0 = [
  "object",
  "boolean"
], n0 = {
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  deprecated: {
    type: "boolean",
    default: !1
  },
  readOnly: {
    type: "boolean",
    default: !1
  },
  writeOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  }
}, s0 = {
  $schema: Qy,
  $id: Zy,
  $vocabulary: xy,
  $dynamicAnchor: e0,
  title: t0,
  type: r0,
  properties: n0
}, o0 = "https://json-schema.org/draft/2020-12/schema", a0 = "https://json-schema.org/draft/2020-12/meta/validation", i0 = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, c0 = "meta", l0 = "Validation vocabulary meta-schema", u0 = [
  "object",
  "boolean"
], d0 = {
  type: {
    anyOf: [
      {
        $ref: "#/$defs/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/$defs/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  const: !0,
  enum: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  maxItems: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  maxContains: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minContains: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 1
  },
  maxProperties: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/$defs/stringArray"
  },
  dependentRequired: {
    type: "object",
    additionalProperties: {
      $ref: "#/$defs/stringArray"
    }
  }
}, f0 = {
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 0
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, h0 = {
  $schema: o0,
  $id: a0,
  $vocabulary: i0,
  $dynamicAnchor: c0,
  title: l0,
  type: u0,
  properties: d0,
  $defs: f0
};
Object.defineProperty(Ma, "__esModule", { value: !0 });
const m0 = cy, p0 = yy, $0 = Py, y0 = ky, g0 = qy, _0 = Yy, v0 = s0, w0 = h0, E0 = ["/properties"];
function b0(e) {
  return [
    m0,
    p0,
    $0,
    y0,
    g0,
    t(this, _0),
    v0,
    t(this, w0)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, E0) : n;
  }
}
Ma.default = b0;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = Nl, n = Jo, s = Da, o = Ma, a = "https://json-schema.org/draft/2020-12/schema";
  class c extends r.default {
    constructor($ = {}) {
      super({
        ...$,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach(($) => this.addVocabulary($)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: $, meta: v } = this.opts;
      v && (o.default.call(this, $), this.refs["http://json-schema.org/schema"] = a);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
    }
  }
  t.Ajv2020 = c, e.exports = t = c, e.exports.Ajv2020 = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var l = _s();
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return l.KeywordCxt;
  } });
  var d = ne;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return d._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return d.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return d.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return d.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return d.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return d.CodeGen;
  } });
  var u = En;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return u.default;
  } });
  var h = qr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(mo, mo.exports);
var S0 = mo.exports, Eo = { exports: {} }, pu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(q, J) {
    return { validate: q, compare: J };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(o, a),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(l(!0), d),
    "date-time": t(w(!0), $),
    "iso-time": t(l(), u),
    "iso-date-time": t(w(), v),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: m,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: ye,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
    // byte: https://github.com/miguelmota/is-base64
    byte: R,
    // signed 32 bit integer
    int32: { type: "number", validate: K },
    // signed 64 bit integer
    int64: { type: "number", validate: Y },
    // C-type float
    float: { type: "number", validate: le },
    // C-type double
    double: { type: "number", validate: le },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, a),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, d),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, $),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, u),
    "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, v),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(q) {
    return q % 4 === 0 && (q % 100 !== 0 || q % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function o(q) {
    const J = n.exec(q);
    if (!J)
      return !1;
    const Q = +J[1], B = +J[2], ue = +J[3];
    return B >= 1 && B <= 12 && ue >= 1 && ue <= (B === 2 && r(Q) ? 29 : s[B]);
  }
  function a(q, J) {
    if (q && J)
      return q > J ? 1 : q < J ? -1 : 0;
  }
  const c = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function l(q) {
    return function(Q) {
      const B = c.exec(Q);
      if (!B)
        return !1;
      const ue = +B[1], M = +B[2], C = +B[3], W = B[4], z = B[5] === "-" ? -1 : 1, P = +(B[6] || 0), p = +(B[7] || 0);
      if (P > 23 || p > 59 || q && !W)
        return !1;
      if (ue <= 23 && M <= 59 && C < 60)
        return !0;
      const S = M - p * z, y = ue - P * z - (S < 0 ? 1 : 0);
      return (y === 23 || y === -1) && (S === 59 || S === -1) && C < 61;
    };
  }
  function d(q, J) {
    if (!(q && J))
      return;
    const Q = (/* @__PURE__ */ new Date("2020-01-01T" + q)).valueOf(), B = (/* @__PURE__ */ new Date("2020-01-01T" + J)).valueOf();
    if (Q && B)
      return Q - B;
  }
  function u(q, J) {
    if (!(q && J))
      return;
    const Q = c.exec(q), B = c.exec(J);
    if (Q && B)
      return q = Q[1] + Q[2] + Q[3], J = B[1] + B[2] + B[3], q > J ? 1 : q < J ? -1 : 0;
  }
  const h = /t|\s/i;
  function w(q) {
    const J = l(q);
    return function(B) {
      const ue = B.split(h);
      return ue.length === 2 && o(ue[0]) && J(ue[1]);
    };
  }
  function $(q, J) {
    if (!(q && J))
      return;
    const Q = new Date(q).valueOf(), B = new Date(J).valueOf();
    if (Q && B)
      return Q - B;
  }
  function v(q, J) {
    if (!(q && J))
      return;
    const [Q, B] = q.split(h), [ue, M] = J.split(h), C = a(Q, ue);
    if (C !== void 0)
      return C || d(B, M);
  }
  const _ = /\/|:/, g = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(q) {
    return _.test(q) && g.test(q);
  }
  const E = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function R(q) {
    return E.lastIndex = 0, E.test(q);
  }
  const T = -2147483648, I = 2 ** 31 - 1;
  function K(q) {
    return Number.isInteger(q) && q <= I && q >= T;
  }
  function Y(q) {
    return Number.isInteger(q);
  }
  function le() {
    return !0;
  }
  const he = /[^\\]\\Z/;
  function ye(q) {
    if (he.test(q))
      return !1;
    try {
      return new RegExp(q), !0;
    } catch {
      return !1;
    }
  }
})(pu);
var $u = {}, bo = { exports: {} }, yu = {}, dt = {}, zr = {}, Sn = {}, ae = {}, _n = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(E) {
      if (super(), !e.IDENTIFIER.test(E))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(E) {
      super(), this._items = typeof E == "string" ? [E] : E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const E = this._items[0];
      return E === "" || E === '""';
    }
    get str() {
      var E;
      return (E = this._str) !== null && E !== void 0 ? E : this._str = this._items.reduce((R, T) => `${R}${T}`, "");
    }
    get names() {
      var E;
      return (E = this._names) !== null && E !== void 0 ? E : this._names = this._items.reduce((R, T) => (T instanceof r && (R[T.str] = (R[T.str] || 0) + 1), R), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...E) {
    const R = [m[0]];
    let T = 0;
    for (; T < E.length; )
      c(R, E[T]), R.push(m[++T]);
    return new n(R);
  }
  e._ = s;
  const o = new n("+");
  function a(m, ...E) {
    const R = [$(m[0])];
    let T = 0;
    for (; T < E.length; )
      R.push(o), c(R, E[T]), R.push(o, $(m[++T]));
    return l(R), new n(R);
  }
  e.str = a;
  function c(m, E) {
    E instanceof n ? m.push(...E._items) : E instanceof r ? m.push(E) : m.push(h(E));
  }
  e.addCodeArg = c;
  function l(m) {
    let E = 1;
    for (; E < m.length - 1; ) {
      if (m[E] === o) {
        const R = d(m[E - 1], m[E + 1]);
        if (R !== void 0) {
          m.splice(E - 1, 3, R);
          continue;
        }
        m[E++] = "+";
      }
      E++;
    }
  }
  function d(m, E) {
    if (E === '""')
      return m;
    if (m === '""')
      return E;
    if (typeof m == "string")
      return E instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof E != "string" ? `${m.slice(0, -1)}${E}"` : E[0] === '"' ? m.slice(0, -1) + E.slice(1) : void 0;
    if (typeof E == "string" && E[0] === '"' && !(m instanceof r))
      return `"${m}${E.slice(1)}`;
  }
  function u(m, E) {
    return E.emptyStr() ? m : m.emptyStr() ? E : a`${m}${E}`;
  }
  e.strConcat = u;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : $(Array.isArray(m) ? m.join(",") : m);
  }
  function w(m) {
    return new n($(m));
  }
  e.stringify = w;
  function $(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = $;
  function v(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = v;
  function _(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = _;
  function g(m) {
    return new n(m.toString());
  }
  e.regexpCode = g;
})(_n);
var So = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = _n;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(l) {
    l[l.Started = 0] = "Started", l[l.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: u } = {}) {
      this._names = {}, this._prefixes = d, this._parent = u;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const u = this._names[d] || this._nameGroup(d);
      return `${d}${u.index++}`;
    }
    _nameGroup(d) {
      var u, h;
      if (!((h = (u = this._parent) === null || u === void 0 ? void 0 : u._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class o extends t.Name {
    constructor(d, u) {
      super(u), this.prefix = d;
    }
    setValue(d, { property: u, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(u)}[${h}]`;
    }
  }
  e.ValueScopeName = o;
  const a = (0, t._)`\n`;
  class c extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? a : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new o(d, this._newName(d));
    }
    value(d, u) {
      var h;
      if (u.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const w = this.toName(d), { prefix: $ } = w, v = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let _ = this._values[$];
      if (_) {
        const E = _.get(v);
        if (E)
          return E;
      } else
        _ = this._values[$] = /* @__PURE__ */ new Map();
      _.set(v, w);
      const g = this._scope[$] || (this._scope[$] = []), m = g.length;
      return g[m] = u.ref, w.setValue(u, { property: $, itemIndex: m }), w;
    }
    getValue(d, u) {
      const h = this._values[d];
      if (h)
        return h.get(u);
    }
    scopeRefs(d, u = this._values) {
      return this._reduceValues(u, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, u, h) {
      return this._reduceValues(d, (w) => {
        if (w.value === void 0)
          throw new Error(`CodeGen: name "${w}" has no value`);
        return w.value.code;
      }, u, h);
    }
    _reduceValues(d, u, h = {}, w) {
      let $ = t.nil;
      for (const v in d) {
        const _ = d[v];
        if (!_)
          continue;
        const g = h[v] = h[v] || /* @__PURE__ */ new Map();
        _.forEach((m) => {
          if (g.has(m))
            return;
          g.set(m, n.Started);
          let E = u(m);
          if (E) {
            const R = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            $ = (0, t._)`${$}${R} ${m} = ${E};${this.opts._n}`;
          } else if (E = w == null ? void 0 : w(m))
            $ = (0, t._)`${$}${E}${this.opts._n}`;
          else
            throw new r(m);
          g.set(m, n.Completed);
        });
      }
      return $;
    }
  }
  e.ValueScope = c;
})(So);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = _n, r = So;
  var n = _n;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = So;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class o {
    optimizeNodes() {
      return this;
    }
    optimizeNames(i, f) {
      return this;
    }
  }
  class a extends o {
    constructor(i, f, b) {
      super(), this.varKind = i, this.name = f, this.rhs = b;
    }
    render({ es5: i, _n: f }) {
      const b = i ? r.varKinds.var : this.varKind, j = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${b} ${this.name}${j};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = B(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class c extends o {
    constructor(i, f, b) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = b;
    }
    render({ _n: i }) {
      return `${this.lhs} = ${this.rhs};` + i;
    }
    optimizeNames(i, f) {
      if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
        return this.rhs = B(this.rhs, i, f), this;
    }
    get names() {
      const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return Q(i, this.rhs);
    }
  }
  class l extends c {
    constructor(i, f, b, j) {
      super(i, b, j), this.op = f;
    }
    render({ _n: i }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + i;
    }
  }
  class d extends o {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `${this.label}:` + i;
    }
  }
  class u extends o {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `break${this.label ? ` ${this.label}` : ""};` + i;
    }
  }
  class h extends o {
    constructor(i) {
      super(), this.error = i;
    }
    render({ _n: i }) {
      return `throw ${this.error};` + i;
    }
    get names() {
      return this.error.names;
    }
  }
  class w extends o {
    constructor(i) {
      super(), this.code = i;
    }
    render({ _n: i }) {
      return `${this.code};` + i;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(i, f) {
      return this.code = B(this.code, i, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class $ extends o {
    constructor(i = []) {
      super(), this.nodes = i;
    }
    render(i) {
      return this.nodes.reduce((f, b) => f + b.render(i), "");
    }
    optimizeNodes() {
      const { nodes: i } = this;
      let f = i.length;
      for (; f--; ) {
        const b = i[f].optimizeNodes();
        Array.isArray(b) ? i.splice(f, 1, ...b) : b ? i[f] = b : i.splice(f, 1);
      }
      return i.length > 0 ? this : void 0;
    }
    optimizeNames(i, f) {
      const { nodes: b } = this;
      let j = b.length;
      for (; j--; ) {
        const A = b[j];
        A.optimizeNames(i, f) || (ue(i, A.names), b.splice(j, 1));
      }
      return b.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => J(i, f.names), {});
    }
  }
  class v extends $ {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class _ extends $ {
  }
  class g extends v {
  }
  g.kind = "else";
  class m extends v {
    constructor(i, f) {
      super(f), this.condition = i;
    }
    render(i) {
      let f = `if(${this.condition})` + super.render(i);
      return this.else && (f += "else " + this.else.render(i)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const i = this.condition;
      if (i === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const b = f.optimizeNodes();
        f = this.else = Array.isArray(b) ? new g(b) : b;
      }
      if (f)
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(M(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var b;
      if (this.else = (b = this.else) === null || b === void 0 ? void 0 : b.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = B(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return Q(i, this.condition), this.else && J(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class E extends v {
  }
  E.kind = "for";
  class R extends E {
    constructor(i) {
      super(), this.iteration = i;
    }
    render(i) {
      return `for(${this.iteration})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iteration = B(this.iteration, i, f), this;
    }
    get names() {
      return J(super.names, this.iteration.names);
    }
  }
  class T extends E {
    constructor(i, f, b, j) {
      super(), this.varKind = i, this.name = f, this.from = b, this.to = j;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: b, from: j, to: A } = this;
      return `for(${f} ${b}=${j}; ${b}<${A}; ${b}++)` + super.render(i);
    }
    get names() {
      const i = Q(super.names, this.from);
      return Q(i, this.to);
    }
  }
  class I extends E {
    constructor(i, f, b, j) {
      super(), this.loop = i, this.varKind = f, this.name = b, this.iterable = j;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = B(this.iterable, i, f), this;
    }
    get names() {
      return J(super.names, this.iterable.names);
    }
  }
  class K extends v {
    constructor(i, f, b) {
      super(), this.name = i, this.args = f, this.async = b;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  K.kind = "func";
  class Y extends $ {
    render(i) {
      return "return " + super.render(i);
    }
  }
  Y.kind = "return";
  class le extends v {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var b, j;
      return super.optimizeNames(i, f), (b = this.catch) === null || b === void 0 || b.optimizeNames(i, f), (j = this.finally) === null || j === void 0 || j.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && J(i, this.catch.names), this.finally && J(i, this.finally.names), i;
    }
  }
  class he extends v {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  he.kind = "catch";
  class ye extends v {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  ye.kind = "finally";
  class q {
    constructor(i, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = i, this._scope = new r.Scope({ parent: i }), this._nodes = [new _()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(i) {
      return this._scope.name(i);
    }
    // reserves unique name in the external scope
    scopeName(i) {
      return this._extScope.name(i);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(i, f) {
      const b = this._extScope.value(i, f);
      return (this._values[b.prefix] || (this._values[b.prefix] = /* @__PURE__ */ new Set())).add(b), b;
    }
    getScopeValue(i, f) {
      return this._extScope.getValue(i, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(i) {
      return this._extScope.scopeRefs(i, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(i, f, b, j) {
      const A = this._scope.toName(f);
      return b !== void 0 && j && (this._constants[A.str] = b), this._leafNode(new a(i, A, b)), A;
    }
    // `const` declaration (`var` in es5 mode)
    const(i, f, b) {
      return this._def(r.varKinds.const, i, f, b);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(i, f, b) {
      return this._def(r.varKinds.let, i, f, b);
    }
    // `var` declaration with optional assignment
    var(i, f, b) {
      return this._def(r.varKinds.var, i, f, b);
    }
    // assignment code
    assign(i, f, b) {
      return this._leafNode(new c(i, f, b));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new l(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new w(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [b, j] of i)
        f.length > 1 && f.push(","), f.push(b), (b !== j || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, j));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(i, f, b) {
      if (this._blockNode(new m(i)), f && b)
        this.code(f).else().code(b).endIf();
      else if (f)
        this.code(f).endIf();
      else if (b)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(i) {
      return this._elseNode(new m(i));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new g());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, g);
    }
    _for(i, f) {
      return this._blockNode(i), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(i, f) {
      return this._for(new R(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, b, j, A = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const G = this._scope.toName(i);
      return this._for(new T(A, G, f, b), () => j(G));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, j = r.varKinds.const) {
      const A = this._scope.toName(i);
      if (this.opts.es5) {
        const G = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${G}.length`, (U) => {
          this.var(A, (0, t._)`${G}[${U}]`), b(A);
        });
      }
      return this._for(new I("of", j, A, f), () => b(A));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, b, j = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, b);
      const A = this._scope.toName(i);
      return this._for(new I("in", j, A, f), () => b(A));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(E);
    }
    // `label` statement
    label(i) {
      return this._leafNode(new d(i));
    }
    // `break` statement
    break(i) {
      return this._leafNode(new u(i));
    }
    // `return` statement
    return(i) {
      const f = new Y();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(Y);
    }
    // `try` statement
    try(i, f, b) {
      if (!f && !b)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const j = new le();
      if (this._blockNode(j), this.code(i), f) {
        const A = this.name("e");
        this._currNode = j.catch = new he(A), f(A);
      }
      return b && (this._currNode = j.finally = new ye(), this.code(b)), this._endBlockNode(he, ye);
    }
    // `throw` statement
    throw(i) {
      return this._leafNode(new h(i));
    }
    // start self-balancing block
    block(i, f) {
      return this._blockStarts.push(this._nodes.length), i && this.code(i).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(i) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const b = this._nodes.length - f;
      if (b < 0 || i !== void 0 && b !== i)
        throw new Error(`CodeGen: wrong number of nodes: ${b} vs ${i} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(i, f = t.nil, b, j) {
      return this._blockNode(new K(i, f, b)), j && this.code(j).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(K);
    }
    optimize(i = 1) {
      for (; i-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(i) {
      return this._currNode.nodes.push(i), this;
    }
    _blockNode(i) {
      this._currNode.nodes.push(i), this._nodes.push(i);
    }
    _endBlockNode(i, f) {
      const b = this._currNode;
      if (b instanceof i || f && b instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${i.kind}/${f.kind}` : i.kind}"`);
    }
    _elseNode(i) {
      const f = this._currNode;
      if (!(f instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = i, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const i = this._nodes;
      return i[i.length - 1];
    }
    set _currNode(i) {
      const f = this._nodes;
      f[f.length - 1] = i;
    }
  }
  e.CodeGen = q;
  function J(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) + (i[f] || 0);
    return y;
  }
  function Q(y, i) {
    return i instanceof t._CodeOrName ? J(y, i.names) : y;
  }
  function B(y, i, f) {
    if (y instanceof t.Name)
      return b(y);
    if (!j(y))
      return y;
    return new t._Code(y._items.reduce((A, G) => (G instanceof t.Name && (G = b(G)), G instanceof t._Code ? A.push(...G._items) : A.push(G), A), []));
    function b(A) {
      const G = f[A.str];
      return G === void 0 || i[A.str] !== 1 ? A : (delete i[A.str], G);
    }
    function j(A) {
      return A instanceof t._Code && A._items.some((G) => G instanceof t.Name && i[G.str] === 1 && f[G.str] !== void 0);
    }
  }
  function ue(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) - (i[f] || 0);
  }
  function M(y) {
    return typeof y == "boolean" || typeof y == "number" || y === null ? !y : (0, t._)`!${S(y)}`;
  }
  e.not = M;
  const C = p(e.operators.AND);
  function W(...y) {
    return y.reduce(C);
  }
  e.and = W;
  const z = p(e.operators.OR);
  function P(...y) {
    return y.reduce(z);
  }
  e.or = P;
  function p(y) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${S(i)} ${y} ${S(f)}`;
  }
  function S(y) {
    return y instanceof t.Name ? y : (0, t._)`(${y})`;
  }
})(ae);
var F = {};
Object.defineProperty(F, "__esModule", { value: !0 });
F.checkStrictMode = F.getErrorPath = F.Type = F.useFunc = F.setEvaluated = F.evaluatedPropsToName = F.mergeEvaluated = F.eachItem = F.unescapeJsonPointer = F.escapeJsonPointer = F.escapeFragment = F.unescapeFragment = F.schemaRefOrVal = F.schemaHasRulesButRef = F.schemaHasRules = F.checkUnknownRules = F.alwaysValidSchema = F.toHash = void 0;
const fe = ae, P0 = _n;
function N0(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
F.toHash = N0;
function R0(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (gu(e, t), !_u(t, e.self.RULES.all));
}
F.alwaysValidSchema = R0;
function gu(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const o in t)
    s[o] || Eu(e, `unknown keyword: "${o}"`);
}
F.checkUnknownRules = gu;
function _u(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
F.schemaHasRules = _u;
function T0(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
F.schemaHasRulesButRef = T0;
function O0({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, fe._)`${r}`;
  }
  return (0, fe._)`${e}${t}${(0, fe.getProperty)(n)}`;
}
F.schemaRefOrVal = O0;
function I0(e) {
  return vu(decodeURIComponent(e));
}
F.unescapeFragment = I0;
function j0(e) {
  return encodeURIComponent(La(e));
}
F.escapeFragment = j0;
function La(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
F.escapeJsonPointer = La;
function vu(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
F.unescapeJsonPointer = vu;
function A0(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
F.eachItem = A0;
function yc({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, o, a, c) => {
    const l = a === void 0 ? o : a instanceof fe.Name ? (o instanceof fe.Name ? e(s, o, a) : t(s, o, a), a) : o instanceof fe.Name ? (t(s, a, o), o) : r(o, a);
    return c === fe.Name && !(l instanceof fe.Name) ? n(s, l) : l;
  };
}
F.mergeEvaluated = {
  props: yc({
    mergeNames: (e, t, r) => e.if((0, fe._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, fe._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, fe._)`${r} || {}`).code((0, fe._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, fe._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, fe._)`${r} || {}`), Va(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: wu
  }),
  items: yc({
    mergeNames: (e, t, r) => e.if((0, fe._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, fe._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, fe._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, fe._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function wu(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, fe._)`{}`);
  return t !== void 0 && Va(e, r, t), r;
}
F.evaluatedPropsToName = wu;
function Va(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, fe._)`${t}${(0, fe.getProperty)(n)}`, !0));
}
F.setEvaluated = Va;
const gc = {};
function k0(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: gc[t.code] || (gc[t.code] = new P0._Code(t.code))
  });
}
F.useFunc = k0;
var Po;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Po || (F.Type = Po = {}));
function C0(e, t, r) {
  if (e instanceof fe.Name) {
    const n = t === Po.Num;
    return r ? n ? (0, fe._)`"[" + ${e} + "]"` : (0, fe._)`"['" + ${e} + "']"` : n ? (0, fe._)`"/" + ${e}` : (0, fe._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, fe.getProperty)(e).toString() : "/" + La(e);
}
F.getErrorPath = C0;
function Eu(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
F.checkStrictMode = Eu;
var Et = {};
Object.defineProperty(Et, "__esModule", { value: !0 });
const Me = ae, D0 = {
  // validation function arguments
  data: new Me.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Me.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Me.Name("instancePath"),
  parentData: new Me.Name("parentData"),
  parentDataProperty: new Me.Name("parentDataProperty"),
  rootData: new Me.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Me.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Me.Name("vErrors"),
  // null or array of validation errors
  errors: new Me.Name("errors"),
  // counter of validation errors
  this: new Me.Name("this"),
  // "globals"
  self: new Me.Name("self"),
  scope: new Me.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Me.Name("json"),
  jsonPos: new Me.Name("jsonPos"),
  jsonLen: new Me.Name("jsonLen"),
  jsonPart: new Me.Name("jsonPart")
};
Et.default = D0;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = ae, r = F, n = Et;
  e.keywordError = {
    message: ({ keyword: g }) => (0, t.str)`must pass "${g}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: g, schemaType: m }) => m ? (0, t.str)`"${g}" keyword must be ${m} ($data)` : (0, t.str)`"${g}" keyword is invalid ($data)`
  };
  function s(g, m = e.keywordError, E, R) {
    const { it: T } = g, { gen: I, compositeRule: K, allErrors: Y } = T, le = h(g, m, E);
    R ?? (K || Y) ? l(I, le) : d(T, (0, t._)`[${le}]`);
  }
  e.reportError = s;
  function o(g, m = e.keywordError, E) {
    const { it: R } = g, { gen: T, compositeRule: I, allErrors: K } = R, Y = h(g, m, E);
    l(T, Y), I || K || d(R, n.default.vErrors);
  }
  e.reportExtraError = o;
  function a(g, m) {
    g.assign(n.default.errors, m), g.if((0, t._)`${n.default.vErrors} !== null`, () => g.if(m, () => g.assign((0, t._)`${n.default.vErrors}.length`, m), () => g.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function c({ gen: g, keyword: m, schemaValue: E, data: R, errsCount: T, it: I }) {
    if (T === void 0)
      throw new Error("ajv implementation error");
    const K = g.name("err");
    g.forRange("i", T, n.default.errors, (Y) => {
      g.const(K, (0, t._)`${n.default.vErrors}[${Y}]`), g.if((0, t._)`${K}.instancePath === undefined`, () => g.assign((0, t._)`${K}.instancePath`, (0, t.strConcat)(n.default.instancePath, I.errorPath))), g.assign((0, t._)`${K}.schemaPath`, (0, t.str)`${I.errSchemaPath}/${m}`), I.opts.verbose && (g.assign((0, t._)`${K}.schema`, E), g.assign((0, t._)`${K}.data`, R));
    });
  }
  e.extendErrors = c;
  function l(g, m) {
    const E = g.const("err", m);
    g.if((0, t._)`${n.default.vErrors} === null`, () => g.assign(n.default.vErrors, (0, t._)`[${E}]`), (0, t._)`${n.default.vErrors}.push(${E})`), g.code((0, t._)`${n.default.errors}++`);
  }
  function d(g, m) {
    const { gen: E, validateName: R, schemaEnv: T } = g;
    T.$async ? E.throw((0, t._)`new ${g.ValidationError}(${m})`) : (E.assign((0, t._)`${R}.errors`, m), E.return(!1));
  }
  const u = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h(g, m, E) {
    const { createErrors: R } = g.it;
    return R === !1 ? (0, t._)`{}` : w(g, m, E);
  }
  function w(g, m, E = {}) {
    const { gen: R, it: T } = g, I = [
      $(T, E),
      v(g, E)
    ];
    return _(g, m, I), R.object(...I);
  }
  function $({ errorPath: g }, { instancePath: m }) {
    const E = m ? (0, t.str)`${g}${(0, r.getErrorPath)(m, r.Type.Str)}` : g;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, E)];
  }
  function v({ keyword: g, it: { errSchemaPath: m } }, { schemaPath: E, parentSchema: R }) {
    let T = R ? m : (0, t.str)`${m}/${g}`;
    return E && (T = (0, t.str)`${T}${(0, r.getErrorPath)(E, r.Type.Str)}`), [u.schemaPath, T];
  }
  function _(g, { params: m, message: E }, R) {
    const { keyword: T, data: I, schemaValue: K, it: Y } = g, { opts: le, propertyName: he, topSchemaRef: ye, schemaPath: q } = Y;
    R.push([u.keyword, T], [u.params, typeof m == "function" ? m(g) : m || (0, t._)`{}`]), le.messages && R.push([u.message, typeof E == "function" ? E(g) : E]), le.verbose && R.push([u.schema, K], [u.parentSchema, (0, t._)`${ye}${q}`], [n.default.data, I]), he && R.push([u.propertyName, he]);
  }
})(Sn);
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.boolOrEmptySchema = zr.topBoolOrEmptySchema = void 0;
const M0 = Sn, L0 = ae, V0 = Et, F0 = {
  message: "boolean schema is false"
};
function z0(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? bu(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(V0.default.data) : (t.assign((0, L0._)`${n}.errors`, null), t.return(!0));
}
zr.topBoolOrEmptySchema = z0;
function U0(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), bu(e)) : r.var(t, !0);
}
zr.boolOrEmptySchema = U0;
function bu(e, t) {
  const { gen: r, data: n } = e, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, M0.reportError)(s, F0, void 0, t);
}
var Se = {}, pr = {};
Object.defineProperty(pr, "__esModule", { value: !0 });
pr.getRules = pr.isJSONType = void 0;
const q0 = ["string", "number", "integer", "boolean", "null", "object", "array"], K0 = new Set(q0);
function G0(e) {
  return typeof e == "string" && K0.has(e);
}
pr.isJSONType = G0;
function H0() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
pr.getRules = H0;
var jt = {};
Object.defineProperty(jt, "__esModule", { value: !0 });
jt.shouldUseRule = jt.shouldUseGroup = jt.schemaHasRulesForType = void 0;
function B0({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Su(e, n);
}
jt.schemaHasRulesForType = B0;
function Su(e, t) {
  return t.rules.some((r) => Pu(e, r));
}
jt.shouldUseGroup = Su;
function Pu(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
jt.shouldUseRule = Pu;
Object.defineProperty(Se, "__esModule", { value: !0 });
Se.reportTypeError = Se.checkDataTypes = Se.checkDataType = Se.coerceAndCheckDataType = Se.getJSONTypes = Se.getSchemaTypes = Se.DataType = void 0;
const W0 = pr, X0 = jt, J0 = Sn, oe = ae, Nu = F;
var Cr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Cr || (Se.DataType = Cr = {}));
function Y0(e) {
  const t = Ru(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
Se.getSchemaTypes = Y0;
function Ru(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(W0.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
Se.getJSONTypes = Ru;
function Q0(e, t) {
  const { gen: r, data: n, opts: s } = e, o = Z0(t, s.coerceTypes), a = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, X0.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const c = Fa(t, n, s.strictNumbers, Cr.Wrong);
    r.if(c, () => {
      o.length ? x0(e, t, o) : za(e);
    });
  }
  return a;
}
Se.coerceAndCheckDataType = Q0;
const Tu = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function Z0(e, t) {
  return t ? e.filter((r) => Tu.has(r) || t === "array" && r === "array") : [];
}
function x0(e, t, r) {
  const { gen: n, data: s, opts: o } = e, a = n.let("dataType", (0, oe._)`typeof ${s}`), c = n.let("coerced", (0, oe._)`undefined`);
  o.coerceTypes === "array" && n.if((0, oe._)`${a} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, oe._)`${s}[0]`).assign(a, (0, oe._)`typeof ${s}`).if(Fa(t, s, o.strictNumbers), () => n.assign(c, s))), n.if((0, oe._)`${c} !== undefined`);
  for (const d of r)
    (Tu.has(d) || d === "array" && o.coerceTypes === "array") && l(d);
  n.else(), za(e), n.endIf(), n.if((0, oe._)`${c} !== undefined`, () => {
    n.assign(s, c), eg(e, c);
  });
  function l(d) {
    switch (d) {
      case "string":
        n.elseIf((0, oe._)`${a} == "number" || ${a} == "boolean"`).assign(c, (0, oe._)`"" + ${s}`).elseIf((0, oe._)`${s} === null`).assign(c, (0, oe._)`""`);
        return;
      case "number":
        n.elseIf((0, oe._)`${a} == "boolean" || ${s} === null
              || (${a} == "string" && ${s} && ${s} == +${s})`).assign(c, (0, oe._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, oe._)`${a} === "boolean" || ${s} === null
              || (${a} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(c, (0, oe._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, oe._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(c, !1).elseIf((0, oe._)`${s} === "true" || ${s} === 1`).assign(c, !0);
        return;
      case "null":
        n.elseIf((0, oe._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(c, null);
        return;
      case "array":
        n.elseIf((0, oe._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${s} === null`).assign(c, (0, oe._)`[${s}]`);
    }
  }
}
function eg({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, oe._)`${t} !== undefined`, () => e.assign((0, oe._)`${t}[${r}]`, n));
}
function No(e, t, r, n = Cr.Correct) {
  const s = n === Cr.Correct ? oe.operators.EQ : oe.operators.NEQ;
  let o;
  switch (e) {
    case "null":
      return (0, oe._)`${t} ${s} null`;
    case "array":
      o = (0, oe._)`Array.isArray(${t})`;
      break;
    case "object":
      o = (0, oe._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      o = a((0, oe._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      o = a();
      break;
    default:
      return (0, oe._)`typeof ${t} ${s} ${e}`;
  }
  return n === Cr.Correct ? o : (0, oe.not)(o);
  function a(c = oe.nil) {
    return (0, oe.and)((0, oe._)`typeof ${t} == "number"`, c, r ? (0, oe._)`isFinite(${t})` : oe.nil);
  }
}
Se.checkDataType = No;
function Fa(e, t, r, n) {
  if (e.length === 1)
    return No(e[0], t, r, n);
  let s;
  const o = (0, Nu.toHash)(e);
  if (o.array && o.object) {
    const a = (0, oe._)`typeof ${t} != "object"`;
    s = o.null ? a : (0, oe._)`!${t} || ${a}`, delete o.null, delete o.array, delete o.object;
  } else
    s = oe.nil;
  o.number && delete o.integer;
  for (const a in o)
    s = (0, oe.and)(s, No(a, t, r, n));
  return s;
}
Se.checkDataTypes = Fa;
const tg = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, oe._)`{type: ${e}}` : (0, oe._)`{type: ${t}}`
};
function za(e) {
  const t = rg(e);
  (0, J0.reportError)(t, tg);
}
Se.reportTypeError = za;
function rg(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Nu.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: e
  };
}
var Ns = {};
Object.defineProperty(Ns, "__esModule", { value: !0 });
Ns.assignDefaults = void 0;
const vr = ae, ng = F;
function sg(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      _c(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, o) => _c(e, o, s.default));
}
Ns.assignDefaults = sg;
function _c(e, t, r) {
  const { gen: n, compositeRule: s, data: o, opts: a } = e;
  if (r === void 0)
    return;
  const c = (0, vr._)`${o}${(0, vr.getProperty)(t)}`;
  if (s) {
    (0, ng.checkStrictMode)(e, `default is ignored for: ${c}`);
    return;
  }
  let l = (0, vr._)`${c} === undefined`;
  a.useDefaults === "empty" && (l = (0, vr._)`${l} || ${c} === null || ${c} === ""`), n.if(l, (0, vr._)`${c} = ${(0, vr.stringify)(r)}`);
}
var vt = {}, ce = {};
Object.defineProperty(ce, "__esModule", { value: !0 });
ce.validateUnion = ce.validateArray = ce.usePattern = ce.callValidateCode = ce.schemaProperties = ce.allSchemaProperties = ce.noPropertyInData = ce.propertyInData = ce.isOwnProperty = ce.hasPropFunc = ce.reportMissingProp = ce.checkMissingProp = ce.checkReportMissingProp = void 0;
const pe = ae, Ua = F, Ft = Et, og = F;
function ag(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Ka(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, pe._)`${t}` }, !0), e.error();
  });
}
ce.checkReportMissingProp = ag;
function ig({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, pe.or)(...n.map((o) => (0, pe.and)(Ka(e, t, o, r.ownProperties), (0, pe._)`${s} = ${o}`)));
}
ce.checkMissingProp = ig;
function cg(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ce.reportMissingProp = cg;
function Ou(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, pe._)`Object.prototype.hasOwnProperty`
  });
}
ce.hasPropFunc = Ou;
function qa(e, t, r) {
  return (0, pe._)`${Ou(e)}.call(${t}, ${r})`;
}
ce.isOwnProperty = qa;
function lg(e, t, r, n) {
  const s = (0, pe._)`${t}${(0, pe.getProperty)(r)} !== undefined`;
  return n ? (0, pe._)`${s} && ${qa(e, t, r)}` : s;
}
ce.propertyInData = lg;
function Ka(e, t, r, n) {
  const s = (0, pe._)`${t}${(0, pe.getProperty)(r)} === undefined`;
  return n ? (0, pe.or)(s, (0, pe.not)(qa(e, t, r))) : s;
}
ce.noPropertyInData = Ka;
function Iu(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ce.allSchemaProperties = Iu;
function ug(e, t) {
  return Iu(t).filter((r) => !(0, Ua.alwaysValidSchema)(e, t[r]));
}
ce.schemaProperties = ug;
function dg({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: o }, it: a }, c, l, d) {
  const u = d ? (0, pe._)`${e}, ${t}, ${n}${s}` : t, h = [
    [Ft.default.instancePath, (0, pe.strConcat)(Ft.default.instancePath, o)],
    [Ft.default.parentData, a.parentData],
    [Ft.default.parentDataProperty, a.parentDataProperty],
    [Ft.default.rootData, Ft.default.rootData]
  ];
  a.opts.dynamicRef && h.push([Ft.default.dynamicAnchors, Ft.default.dynamicAnchors]);
  const w = (0, pe._)`${u}, ${r.object(...h)}`;
  return l !== pe.nil ? (0, pe._)`${c}.call(${l}, ${w})` : (0, pe._)`${c}(${w})`;
}
ce.callValidateCode = dg;
const fg = (0, pe._)`new RegExp`;
function hg({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, o = s(r, n);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, pe._)`${s.code === "new RegExp" ? fg : (0, og.useFunc)(e, s)}(${r}, ${n})`
  });
}
ce.usePattern = hg;
function mg(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, o = t.name("valid");
  if (s.allErrors) {
    const c = t.let("valid", !0);
    return a(() => t.assign(c, !1)), c;
  }
  return t.var(o, !0), a(() => t.break()), o;
  function a(c) {
    const l = t.const("len", (0, pe._)`${r}.length`);
    t.forRange("i", 0, l, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: Ua.Type.Num
      }, o), t.if((0, pe.not)(o), c);
    });
  }
}
ce.validateArray = mg;
function pg(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((l) => (0, Ua.alwaysValidSchema)(s, l)) && !s.opts.unevaluated)
    return;
  const a = t.let("valid", !1), c = t.name("_valid");
  t.block(() => r.forEach((l, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, c);
    t.assign(a, (0, pe._)`${a} || ${c}`), e.mergeValidEvaluated(u, c) || t.if((0, pe.not)(a));
  })), e.result(a, () => e.reset(), () => e.error(!0));
}
ce.validateUnion = pg;
Object.defineProperty(vt, "__esModule", { value: !0 });
vt.validateKeywordUsage = vt.validSchemaType = vt.funcKeywordCode = vt.macroKeywordCode = void 0;
const Ke = ae, or = Et, $g = ce, yg = Sn;
function gg(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: o, it: a } = e, c = t.macro.call(a.self, s, o, a), l = ju(r, n, c);
  a.opts.validateSchema !== !1 && a.self.validateSchema(c, !0);
  const d = r.name("valid");
  e.subschema({
    schema: c,
    schemaPath: Ke.nil,
    errSchemaPath: `${a.errSchemaPath}/${n}`,
    topSchemaRef: l,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
vt.macroKeywordCode = gg;
function _g(e, t) {
  var r;
  const { gen: n, keyword: s, schema: o, parentSchema: a, $data: c, it: l } = e;
  wg(l, t);
  const d = !c && t.compile ? t.compile.call(l.self, o, a, l) : t.validate, u = ju(n, s, d), h = n.let("valid");
  e.block$data(h, w), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function w() {
    if (t.errors === !1)
      _(), t.modifying && vc(e), g(() => e.error());
    else {
      const m = t.async ? $() : v();
      t.modifying && vc(e), g(() => vg(e, m));
    }
  }
  function $() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, Ke._)`await `), (E) => n.assign(h, !1).if((0, Ke._)`${E} instanceof ${l.ValidationError}`, () => n.assign(m, (0, Ke._)`${E}.errors`), () => n.throw(E))), m;
  }
  function v() {
    const m = (0, Ke._)`${u}.errors`;
    return n.assign(m, null), _(Ke.nil), m;
  }
  function _(m = t.async ? (0, Ke._)`await ` : Ke.nil) {
    const E = l.opts.passContext ? or.default.this : or.default.self, R = !("compile" in t && !c || t.schema === !1);
    n.assign(h, (0, Ke._)`${m}${(0, $g.callValidateCode)(e, u, E, R)}`, t.modifying);
  }
  function g(m) {
    var E;
    n.if((0, Ke.not)((E = t.valid) !== null && E !== void 0 ? E : h), m);
  }
}
vt.funcKeywordCode = _g;
function vc(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Ke._)`${n.parentData}[${n.parentDataProperty}]`));
}
function vg(e, t) {
  const { gen: r } = e;
  r.if((0, Ke._)`Array.isArray(${t})`, () => {
    r.assign(or.default.vErrors, (0, Ke._)`${or.default.vErrors} === null ? ${t} : ${or.default.vErrors}.concat(${t})`).assign(or.default.errors, (0, Ke._)`${or.default.vErrors}.length`), (0, yg.extendErrors)(e);
  }, () => e.error());
}
function wg({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function ju(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Ke.stringify)(r) });
}
function Eg(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
vt.validSchemaType = Eg;
function bg({ schema: e, opts: t, self: r, errSchemaPath: n }, s, o) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(o) : s.keyword !== o)
    throw new Error("ajv implementation error");
  const a = s.dependencies;
  if (a != null && a.some((c) => !Object.prototype.hasOwnProperty.call(e, c)))
    throw new Error(`parent schema must have dependencies of ${o}: ${a.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[o])) {
    const l = `keyword "${o}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(l);
    else
      throw new Error(l);
  }
}
vt.validateKeywordUsage = bg;
var Xt = {};
Object.defineProperty(Xt, "__esModule", { value: !0 });
Xt.extendSubschemaMode = Xt.extendSubschemaData = Xt.getSubschema = void 0;
const gt = ae, Au = F;
function Sg(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: o, topSchemaRef: a }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const c = e.schema[t];
    return r === void 0 ? {
      schema: c,
      schemaPath: (0, gt._)`${e.schemaPath}${(0, gt.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: c[r],
      schemaPath: (0, gt._)`${e.schemaPath}${(0, gt.getProperty)(t)}${(0, gt.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Au.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || o === void 0 || a === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: a,
      errSchemaPath: o
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Xt.getSubschema = Sg;
function Pg(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: o, propertyName: a }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: c } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, w = c.let("data", (0, gt._)`${t.data}${(0, gt.getProperty)(r)}`, !0);
    l(w), e.errorPath = (0, gt.str)`${d}${(0, Au.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, gt._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof gt.Name ? s : c.let("data", s, !0);
    l(d), a !== void 0 && (e.propertyName = a);
  }
  o && (e.dataTypes = o);
  function l(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Xt.extendSubschemaData = Pg;
function Ng(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: o }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Xt.extendSubschemaMode = Ng;
var je = {}, ku = { exports: {} }, Wt = ku.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  es(t, n, s, e, "", e);
};
Wt.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
Wt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Wt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Wt.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function es(e, t, r, n, s, o, a, c, l, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, o, a, c, l, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in Wt.arrayKeywords)
          for (var w = 0; w < h.length; w++)
            es(e, t, r, h[w], s + "/" + u + "/" + w, o, s, u, n, w);
      } else if (u in Wt.propsKeywords) {
        if (h && typeof h == "object")
          for (var $ in h)
            es(e, t, r, h[$], s + "/" + u + "/" + Rg($), o, s, u, n, $);
      } else (u in Wt.keywords || e.allKeys && !(u in Wt.skipKeywords)) && es(e, t, r, h, s + "/" + u, o, s, u, n);
    }
    r(n, s, o, a, c, l, d);
  }
}
function Rg(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Tg = ku.exports;
Object.defineProperty(je, "__esModule", { value: !0 });
je.getSchemaRefs = je.resolveUrl = je.normalizeId = je._getFullPath = je.getFullPath = je.inlineRef = void 0;
const Og = F, Ig = gs, jg = Tg, Ag = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function kg(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Ro(e) : t ? Cu(e) <= t : !1;
}
je.inlineRef = kg;
const Cg = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Ro(e) {
  for (const t in e) {
    if (Cg.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Ro) || typeof r == "object" && Ro(r))
      return !0;
  }
  return !1;
}
function Cu(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Ag.has(r) && (typeof e[r] == "object" && (0, Og.eachItem)(e[r], (n) => t += Cu(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Du(e, t = "", r) {
  r !== !1 && (t = Dr(t));
  const n = e.parse(t);
  return Mu(e, n);
}
je.getFullPath = Du;
function Mu(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
je._getFullPath = Mu;
const Dg = /#\/?$/;
function Dr(e) {
  return e ? e.replace(Dg, "") : "";
}
je.normalizeId = Dr;
function Mg(e, t, r) {
  return r = Dr(r), e.resolve(t, r);
}
je.resolveUrl = Mg;
const Lg = /^[a-z_][-a-z0-9._]*$/i;
function Vg(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Dr(e[r] || t), o = { "": s }, a = Du(n, s, !1), c = {}, l = /* @__PURE__ */ new Set();
  return jg(e, { allKeys: !0 }, (h, w, $, v) => {
    if (v === void 0)
      return;
    const _ = a + w;
    let g = o[v];
    typeof h[r] == "string" && (g = m.call(this, h[r])), E.call(this, h.$anchor), E.call(this, h.$dynamicAnchor), o[w] = g;
    function m(R) {
      const T = this.opts.uriResolver.resolve;
      if (R = Dr(g ? T(g, R) : R), l.has(R))
        throw u(R);
      l.add(R);
      let I = this.refs[R];
      return typeof I == "string" && (I = this.refs[I]), typeof I == "object" ? d(h, I.schema, R) : R !== Dr(_) && (R[0] === "#" ? (d(h, c[R], R), c[R] = h) : this.refs[R] = _), R;
    }
    function E(R) {
      if (typeof R == "string") {
        if (!Lg.test(R))
          throw new Error(`invalid anchor "${R}"`);
        m.call(this, `#${R}`);
      }
    }
  }), c;
  function d(h, w, $) {
    if (w !== void 0 && !Ig(h, w))
      throw u($);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
je.getSchemaRefs = Vg;
Object.defineProperty(dt, "__esModule", { value: !0 });
dt.getData = dt.KeywordCxt = dt.validateFunctionCode = void 0;
const Lu = zr, wc = Se, Ga = jt, us = Se, Fg = Ns, fn = vt, Ws = Xt, X = ae, Z = Et, zg = je, At = F, rn = Sn;
function Ug(e) {
  if (zu(e) && (Uu(e), Fu(e))) {
    Gg(e);
    return;
  }
  Vu(e, () => (0, Lu.topBoolOrEmptySchema)(e));
}
dt.validateFunctionCode = Ug;
function Vu({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, o) {
  s.code.es5 ? e.func(t, (0, X._)`${Z.default.data}, ${Z.default.valCxt}`, n.$async, () => {
    e.code((0, X._)`"use strict"; ${Ec(r, s)}`), Kg(e, s), e.code(o);
  }) : e.func(t, (0, X._)`${Z.default.data}, ${qg(s)}`, n.$async, () => e.code(Ec(r, s)).code(o));
}
function qg(e) {
  return (0, X._)`{${Z.default.instancePath}="", ${Z.default.parentData}, ${Z.default.parentDataProperty}, ${Z.default.rootData}=${Z.default.data}${e.dynamicRef ? (0, X._)`, ${Z.default.dynamicAnchors}={}` : X.nil}}={}`;
}
function Kg(e, t) {
  e.if(Z.default.valCxt, () => {
    e.var(Z.default.instancePath, (0, X._)`${Z.default.valCxt}.${Z.default.instancePath}`), e.var(Z.default.parentData, (0, X._)`${Z.default.valCxt}.${Z.default.parentData}`), e.var(Z.default.parentDataProperty, (0, X._)`${Z.default.valCxt}.${Z.default.parentDataProperty}`), e.var(Z.default.rootData, (0, X._)`${Z.default.valCxt}.${Z.default.rootData}`), t.dynamicRef && e.var(Z.default.dynamicAnchors, (0, X._)`${Z.default.valCxt}.${Z.default.dynamicAnchors}`);
  }, () => {
    e.var(Z.default.instancePath, (0, X._)`""`), e.var(Z.default.parentData, (0, X._)`undefined`), e.var(Z.default.parentDataProperty, (0, X._)`undefined`), e.var(Z.default.rootData, Z.default.data), t.dynamicRef && e.var(Z.default.dynamicAnchors, (0, X._)`{}`);
  });
}
function Gg(e) {
  const { schema: t, opts: r, gen: n } = e;
  Vu(e, () => {
    r.$comment && t.$comment && Ku(e), Jg(e), n.let(Z.default.vErrors, null), n.let(Z.default.errors, 0), r.unevaluated && Hg(e), qu(e), Zg(e);
  });
}
function Hg(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, X._)`${r}.evaluated`), t.if((0, X._)`${e.evaluated}.dynamicProps`, () => t.assign((0, X._)`${e.evaluated}.props`, (0, X._)`undefined`)), t.if((0, X._)`${e.evaluated}.dynamicItems`, () => t.assign((0, X._)`${e.evaluated}.items`, (0, X._)`undefined`));
}
function Ec(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, X._)`/*# sourceURL=${r} */` : X.nil;
}
function Bg(e, t) {
  if (zu(e) && (Uu(e), Fu(e))) {
    Wg(e, t);
    return;
  }
  (0, Lu.boolOrEmptySchema)(e, t);
}
function Fu({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function zu(e) {
  return typeof e.schema != "boolean";
}
function Wg(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Ku(e), Yg(e), Qg(e);
  const o = n.const("_errs", Z.default.errors);
  qu(e, o), n.var(t, (0, X._)`${o} === ${Z.default.errors}`);
}
function Uu(e) {
  (0, At.checkUnknownRules)(e), Xg(e);
}
function qu(e, t) {
  if (e.opts.jtd)
    return bc(e, [], !1, t);
  const r = (0, wc.getSchemaTypes)(e.schema), n = (0, wc.coerceAndCheckDataType)(e, r);
  bc(e, r, !n, t);
}
function Xg(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, At.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function Jg(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, At.checkStrictMode)(e, "default is ignored in the schema root");
}
function Yg(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, zg.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function Qg(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Ku({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const o = r.$comment;
  if (s.$comment === !0)
    e.code((0, X._)`${Z.default.self}.logger.log(${o})`);
  else if (typeof s.$comment == "function") {
    const a = (0, X.str)`${n}/$comment`, c = e.scopeValue("root", { ref: t.root });
    e.code((0, X._)`${Z.default.self}.opts.$comment(${o}, ${a}, ${c}.schema)`);
  }
}
function Zg(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: o } = e;
  r.$async ? t.if((0, X._)`${Z.default.errors} === 0`, () => t.return(Z.default.data), () => t.throw((0, X._)`new ${s}(${Z.default.vErrors})`)) : (t.assign((0, X._)`${n}.errors`, Z.default.vErrors), o.unevaluated && xg(e), t.return((0, X._)`${Z.default.errors} === 0`));
}
function xg({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof X.Name && e.assign((0, X._)`${t}.props`, r), n instanceof X.Name && e.assign((0, X._)`${t}.items`, n);
}
function bc(e, t, r, n) {
  const { gen: s, schema: o, data: a, allErrors: c, opts: l, self: d } = e, { RULES: u } = d;
  if (o.$ref && (l.ignoreKeywordsWithRef || !(0, At.schemaHasRulesButRef)(o, u))) {
    s.block(() => Bu(e, "$ref", u.all.$ref.definition));
    return;
  }
  l.jtd || e_(e, t), s.block(() => {
    for (const w of u.rules)
      h(w);
    h(u.post);
  });
  function h(w) {
    (0, Ga.shouldUseGroup)(o, w) && (w.type ? (s.if((0, us.checkDataType)(w.type, a, l.strictNumbers)), Sc(e, w), t.length === 1 && t[0] === w.type && r && (s.else(), (0, us.reportTypeError)(e)), s.endIf()) : Sc(e, w), c || s.if((0, X._)`${Z.default.errors} === ${n || 0}`));
  }
}
function Sc(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, Fg.assignDefaults)(e, t.type), r.block(() => {
    for (const o of t.rules)
      (0, Ga.shouldUseRule)(n, o) && Bu(e, o.keyword, o.definition, t.type);
  });
}
function e_(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (t_(e, t), e.opts.allowUnionTypes || r_(e, t), n_(e, e.dataTypes));
}
function t_(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Gu(e.dataTypes, r) || Ha(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), o_(e, t);
  }
}
function r_(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Ha(e, "use allowUnionTypes to allow union type keyword");
}
function n_(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Ga.shouldUseRule)(e.schema, s)) {
      const { type: o } = s.definition;
      o.length && !o.some((a) => s_(t, a)) && Ha(e, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function s_(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Gu(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function o_(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Gu(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Ha(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, At.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Hu {
  constructor(t, r, n) {
    if ((0, fn.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, At.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Wu(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, fn.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", Z.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, X.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, X.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, X._)`${r} !== undefined && (${(0, X.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? rn.reportExtraError : rn.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, rn.reportError)(this, this.def.$dataError || rn.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, rn.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = X.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = X.nil, r = X.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: o, def: a } = this;
    n.if((0, X.or)((0, X._)`${s} === undefined`, r)), t !== X.nil && n.assign(t, !0), (o.length || a.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== X.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: o } = this;
    return (0, X.or)(a(), c());
    function a() {
      if (n.length) {
        if (!(r instanceof X.Name))
          throw new Error("ajv implementation error");
        const l = Array.isArray(n) ? n : [n];
        return (0, X._)`${(0, us.checkDataTypes)(l, r, o.opts.strictNumbers, us.DataType.Wrong)}`;
      }
      return X.nil;
    }
    function c() {
      if (s.validateSchema) {
        const l = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, X._)`!${l}(${r})`;
      }
      return X.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Ws.getSubschema)(this.it, t);
    (0, Ws.extendSubschemaData)(n, this.it, t), (0, Ws.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return Bg(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = At.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = At.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, X.Name)), !0;
  }
}
dt.KeywordCxt = Hu;
function Bu(e, t, r, n) {
  const s = new Hu(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, fn.funcKeywordCode)(s, r) : "macro" in r ? (0, fn.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, fn.funcKeywordCode)(s, r);
}
const a_ = /^\/(?:[^~]|~0|~1)*$/, i_ = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Wu(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, o;
  if (e === "")
    return Z.default.rootData;
  if (e[0] === "/") {
    if (!a_.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, o = Z.default.rootData;
  } else {
    const d = i_.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const u = +d[1];
    if (s = d[2], s === "#") {
      if (u >= t)
        throw new Error(l("property/index", u));
      return n[t - u];
    }
    if (u > t)
      throw new Error(l("data", u));
    if (o = r[t - u], !s)
      return o;
  }
  let a = o;
  const c = s.split("/");
  for (const d of c)
    d && (o = (0, X._)`${o}${(0, X.getProperty)((0, At.unescapeJsonPointer)(d))}`, a = (0, X._)`${a} && ${o}`);
  return a;
  function l(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
dt.getData = Wu;
var Pn = {};
Object.defineProperty(Pn, "__esModule", { value: !0 });
class c_ extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
Pn.default = c_;
var Wr = {};
Object.defineProperty(Wr, "__esModule", { value: !0 });
const Xs = je;
class l_ extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Xs.resolveUrl)(t, r, n), this.missingSchema = (0, Xs.normalizeId)((0, Xs.getFullPath)(t, this.missingRef));
  }
}
Wr.default = l_;
var Je = {};
Object.defineProperty(Je, "__esModule", { value: !0 });
Je.resolveSchema = Je.getCompilingSchema = Je.resolveRef = Je.compileSchema = Je.SchemaEnv = void 0;
const ot = ae, u_ = Pn, tr = Et, lt = je, Pc = F, d_ = dt;
class Rs {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, lt.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Je.SchemaEnv = Rs;
function Ba(e) {
  const t = Xu.call(this, e);
  if (t)
    return t;
  const r = (0, lt.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: o } = this.opts, a = new ot.CodeGen(this.scope, { es5: n, lines: s, ownProperties: o });
  let c;
  e.$async && (c = a.scopeValue("Error", {
    ref: u_.default,
    code: (0, ot._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const l = a.scopeName("validate");
  e.validateName = l;
  const d = {
    gen: a,
    allErrors: this.opts.allErrors,
    data: tr.default.data,
    parentData: tr.default.parentData,
    parentDataProperty: tr.default.parentDataProperty,
    dataNames: [tr.default.data],
    dataPathArr: [ot.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: a.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, ot.stringify)(e.schema) } : { ref: e.schema }),
    validateName: l,
    ValidationError: c,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: ot.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, ot._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, d_.validateFunctionCode)(d), a.optimize(this.opts.code.optimize);
    const h = a.toString();
    u = `${a.scopeRefs(tr.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const $ = new Function(`${tr.default.self}`, `${tr.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(l, { ref: $ }), $.errors = null, $.schema = e.schema, $.schemaEnv = e, e.$async && ($.$async = !0), this.opts.code.source === !0 && ($.source = { validateName: l, validateCode: h, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: v, items: _ } = d;
      $.evaluated = {
        props: v instanceof ot.Name ? void 0 : v,
        items: _ instanceof ot.Name ? void 0 : _,
        dynamicProps: v instanceof ot.Name,
        dynamicItems: _ instanceof ot.Name
      }, $.source && ($.source.evaluated = (0, ot.stringify)($.evaluated));
    }
    return e.validate = $, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
Je.compileSchema = Ba;
function f_(e, t, r) {
  var n;
  r = (0, lt.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let o = p_.call(this, e, r);
  if (o === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: c } = this.opts;
    a && (o = new Rs({ schema: a, schemaId: c, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[r] = h_.call(this, o);
}
Je.resolveRef = f_;
function h_(e) {
  return (0, lt.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Ba.call(this, e);
}
function Xu(e) {
  for (const t of this._compilations)
    if (m_(t, e))
      return t;
}
Je.getCompilingSchema = Xu;
function m_(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function p_(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Ts.call(this, e, t);
}
function Ts(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, lt._getFullPath)(this.opts.uriResolver, r);
  let s = (0, lt.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Js.call(this, r, e);
  const o = (0, lt.normalizeId)(n), a = this.refs[o] || this.schemas[o];
  if (typeof a == "string") {
    const c = Ts.call(this, e, a);
    return typeof (c == null ? void 0 : c.schema) != "object" ? void 0 : Js.call(this, r, c);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || Ba.call(this, a), o === (0, lt.normalizeId)(t)) {
      const { schema: c } = a, { schemaId: l } = this.opts, d = c[l];
      return d && (s = (0, lt.resolveUrl)(this.opts.uriResolver, s, d)), new Rs({ schema: c, schemaId: l, root: e, baseId: s });
    }
    return Js.call(this, r, a);
  }
}
Je.resolveSchema = Ts;
const $_ = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Js(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const c of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const l = r[(0, Pc.unescapeFragment)(c)];
    if (l === void 0)
      return;
    r = l;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !$_.has(c) && d && (t = (0, lt.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let o;
  if (typeof r != "boolean" && r.$ref && !(0, Pc.schemaHasRulesButRef)(r, this.RULES)) {
    const c = (0, lt.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    o = Ts.call(this, n, c);
  }
  const { schemaId: a } = this.opts;
  if (o = o || new Rs({ schema: r, schemaId: a, root: n, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const y_ = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", g_ = "Meta-schema for $data reference (JSON AnySchema extension proposal)", __ = "object", v_ = [
  "$data"
], w_ = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, E_ = !1, b_ = {
  $id: y_,
  description: g_,
  type: __,
  required: v_,
  properties: w_,
  additionalProperties: E_
};
var Wa = {};
Object.defineProperty(Wa, "__esModule", { value: !0 });
const Ju = su;
Ju.code = 'require("ajv/dist/runtime/uri").default';
Wa.default = Ju;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = dt;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = ae;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = Pn, s = Wr, o = pr, a = Je, c = ae, l = je, d = Se, u = F, h = b_, w = Wa, $ = (P, p) => new RegExp(P, p);
  $.code = "new RegExp";
  const v = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), g = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, E = 200;
  function R(P) {
    var p, S, y, i, f, b, j, A, G, U, N, O, k, D, H, x, _e, Ue, Pe, Ne, ve, mt, Ae, Yt, Qt;
    const tt = P.strict, Zt = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, Yr = Zt === !0 || Zt === void 0 ? 1 : Zt || 0, Qr = (y = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && y !== void 0 ? y : $, Ls = (i = P.uriResolver) !== null && i !== void 0 ? i : w.default;
    return {
      strictSchema: (b = (f = P.strictSchema) !== null && f !== void 0 ? f : tt) !== null && b !== void 0 ? b : !0,
      strictNumbers: (A = (j = P.strictNumbers) !== null && j !== void 0 ? j : tt) !== null && A !== void 0 ? A : !0,
      strictTypes: (U = (G = P.strictTypes) !== null && G !== void 0 ? G : tt) !== null && U !== void 0 ? U : "log",
      strictTuples: (O = (N = P.strictTuples) !== null && N !== void 0 ? N : tt) !== null && O !== void 0 ? O : "log",
      strictRequired: (D = (k = P.strictRequired) !== null && k !== void 0 ? k : tt) !== null && D !== void 0 ? D : !1,
      code: P.code ? { ...P.code, optimize: Yr, regExp: Qr } : { optimize: Yr, regExp: Qr },
      loopRequired: (H = P.loopRequired) !== null && H !== void 0 ? H : E,
      loopEnum: (x = P.loopEnum) !== null && x !== void 0 ? x : E,
      meta: (_e = P.meta) !== null && _e !== void 0 ? _e : !0,
      messages: (Ue = P.messages) !== null && Ue !== void 0 ? Ue : !0,
      inlineRefs: (Pe = P.inlineRefs) !== null && Pe !== void 0 ? Pe : !0,
      schemaId: (Ne = P.schemaId) !== null && Ne !== void 0 ? Ne : "$id",
      addUsedSchema: (ve = P.addUsedSchema) !== null && ve !== void 0 ? ve : !0,
      validateSchema: (mt = P.validateSchema) !== null && mt !== void 0 ? mt : !0,
      validateFormats: (Ae = P.validateFormats) !== null && Ae !== void 0 ? Ae : !0,
      unicodeRegExp: (Yt = P.unicodeRegExp) !== null && Yt !== void 0 ? Yt : !0,
      int32range: (Qt = P.int32range) !== null && Qt !== void 0 ? Qt : !0,
      uriResolver: Ls
    };
  }
  class T {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...R(p) };
      const { es5: S, lines: y } = this.opts.code;
      this.scope = new c.ValueScope({ scope: {}, prefixes: _, es5: S, lines: y }), this.logger = J(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, o.getRules)(), I.call(this, g, p, "NOT SUPPORTED"), I.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ye.call(this), p.formats && le.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && he.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), Y.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: S, schemaId: y } = this.opts;
      let i = h;
      y === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), S && p && this.addMetaSchema(i, i[y], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: S } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[S] || p : void 0;
    }
    validate(p, S) {
      let y;
      if (typeof p == "string") {
        if (y = this.getSchema(p), !y)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        y = this.compile(p);
      const i = y(S);
      return "$async" in y || (this.errors = y.errors), i;
    }
    compile(p, S) {
      const y = this._addSchema(p, S);
      return y.validate || this._compileSchemaEnv(y);
    }
    compileAsync(p, S) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: y } = this.opts;
      return i.call(this, p, S);
      async function i(U, N) {
        await f.call(this, U.$schema);
        const O = this._addSchema(U, N);
        return O.validate || b.call(this, O);
      }
      async function f(U) {
        U && !this.getSchema(U) && await i.call(this, { $ref: U }, !0);
      }
      async function b(U) {
        try {
          return this._compileSchemaEnv(U);
        } catch (N) {
          if (!(N instanceof s.default))
            throw N;
          return j.call(this, N), await A.call(this, N.missingSchema), b.call(this, U);
        }
      }
      function j({ missingSchema: U, missingRef: N }) {
        if (this.refs[U])
          throw new Error(`AnySchema ${U} is loaded but ${N} cannot be resolved`);
      }
      async function A(U) {
        const N = await G.call(this, U);
        this.refs[U] || await f.call(this, N.$schema), this.refs[U] || this.addSchema(N, U, S);
      }
      async function G(U) {
        const N = this._loading[U];
        if (N)
          return N;
        try {
          return await (this._loading[U] = y(U));
        } finally {
          delete this._loading[U];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, S, y, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const b of p)
          this.addSchema(b, void 0, y, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: b } = this.opts;
        if (f = p[b], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${b} must be string`);
      }
      return S = (0, l.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(p, y, S, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, S, y = this.opts.validateSchema) {
      return this.addSchema(p, S, !0, y), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, S) {
      if (typeof p == "boolean")
        return !0;
      let y;
      if (y = p.$schema, y !== void 0 && typeof y != "string")
        throw new Error("$schema must be a string");
      if (y = y || this.opts.defaultMeta || this.defaultMeta(), !y)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate(y, p);
      if (!i && S) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return i;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(p) {
      let S;
      for (; typeof (S = K.call(this, p)) == "string"; )
        p = S;
      if (S === void 0) {
        const { schemaId: y } = this.opts, i = new a.SchemaEnv({ schema: {}, schemaId: y });
        if (S = a.resolveSchema.call(this, i, p), !S)
          return;
        this.refs[p] = S;
      }
      return S.validate || this._compileSchemaEnv(S);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(p) {
      if (p instanceof RegExp)
        return this._removeAllSchemas(this.schemas, p), this._removeAllSchemas(this.refs, p), this;
      switch (typeof p) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const S = K.call(this, p);
          return typeof S == "object" && this._cache.delete(S.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const S = p;
          this._cache.delete(S);
          let y = p[this.opts.schemaId];
          return y && (y = (0, l.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const S of p)
        this.addKeyword(S);
      return this;
    }
    addKeyword(p, S) {
      let y;
      if (typeof p == "string")
        y = p, typeof S == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), S.keyword = y);
      else if (typeof p == "object" && S === void 0) {
        if (S = p, y = S.keyword, Array.isArray(y) && !y.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (B.call(this, y, S), !S)
        return (0, u.eachItem)(y, (f) => ue.call(this, f)), this;
      C.call(this, S);
      const i = {
        ...S,
        type: (0, d.getJSONTypes)(S.type),
        schemaType: (0, d.getJSONTypes)(S.schemaType)
      };
      return (0, u.eachItem)(y, i.type.length === 0 ? (f) => ue.call(this, f, i) : (f) => i.type.forEach((b) => ue.call(this, f, i, b))), this;
    }
    getKeyword(p) {
      const S = this.RULES.all[p];
      return typeof S == "object" ? S.definition : !!S;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: S } = this;
      delete S.keywords[p], delete S.all[p];
      for (const y of S.rules) {
        const i = y.rules.findIndex((f) => f.keyword === p);
        i >= 0 && y.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, S) {
      return typeof S == "string" && (S = new RegExp(S)), this.formats[p] = S, this;
    }
    errorsText(p = this.errors, { separator: S = ", ", dataVar: y = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${y}${i.instancePath} ${i.message}`).reduce((i, f) => i + S + f);
    }
    $dataMetaSchema(p, S) {
      const y = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of S) {
        const f = i.split("/").slice(1);
        let b = p;
        for (const j of f)
          b = b[j];
        for (const j in y) {
          const A = y[j];
          if (typeof A != "object")
            continue;
          const { $data: G } = A.definition, U = b[j];
          G && U && (b[j] = z(U));
        }
      }
      return p;
    }
    _removeAllSchemas(p, S) {
      for (const y in p) {
        const i = p[y];
        (!S || S.test(y)) && (typeof i == "string" ? delete p[y] : i && !i.meta && (this._cache.delete(i.schema), delete p[y]));
      }
    }
    _addSchema(p, S, y, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let b;
      const { schemaId: j } = this.opts;
      if (typeof p == "object")
        b = p[j];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let A = this._cache.get(p);
      if (A !== void 0)
        return A;
      y = (0, l.normalizeId)(b || y);
      const G = l.getSchemaRefs.call(this, p, y);
      return A = new a.SchemaEnv({ schema: p, schemaId: j, meta: S, baseId: y, localRefs: G }), this._cache.set(A.schema, A), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = A), i && this.validateSchema(p, !0), A;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : a.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const S = this.opts;
      this.opts = this._metaOpts;
      try {
        a.compileSchema.call(this, p);
      } finally {
        this.opts = S;
      }
    }
  }
  T.ValidationError = n.default, T.MissingRefError = s.default, e.default = T;
  function I(P, p, S, y = "error") {
    for (const i in P) {
      const f = i;
      f in p && this.logger[y](`${S}: option ${i}. ${P[f]}`);
    }
  }
  function K(P) {
    return P = (0, l.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function Y() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const p in P)
          this.addSchema(P[p], p);
  }
  function le() {
    for (const P in this.opts.formats) {
      const p = this.opts.formats[P];
      p && this.addFormat(P, p);
    }
  }
  function he(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in P) {
      const S = P[p];
      S.keyword || (S.keyword = p), this.addKeyword(S);
    }
  }
  function ye() {
    const P = { ...this.opts };
    for (const p of v)
      delete P[p];
    return P;
  }
  const q = { log() {
  }, warn() {
  }, error() {
  } };
  function J(P) {
    if (P === !1)
      return q;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const Q = /^[a-z_$][a-z0-9_$:-]*$/i;
  function B(P, p) {
    const { RULES: S } = this;
    if ((0, u.eachItem)(P, (y) => {
      if (S.keywords[y])
        throw new Error(`Keyword ${y} is already defined`);
      if (!Q.test(y))
        throw new Error(`Keyword ${y} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function ue(P, p, S) {
    var y;
    const i = p == null ? void 0 : p.post;
    if (S && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let b = i ? f.post : f.rules.find(({ type: A }) => A === S);
    if (b || (b = { type: S, rules: [] }, f.rules.push(b)), f.keywords[P] = !0, !p)
      return;
    const j = {
      keyword: P,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? M.call(this, b, j, p.before) : b.rules.push(j), f.all[P] = j, (y = p.implements) === null || y === void 0 || y.forEach((A) => this.addKeyword(A));
  }
  function M(P, p, S) {
    const y = P.rules.findIndex((i) => i.keyword === S);
    y >= 0 ? P.rules.splice(y, 0, p) : (P.rules.push(p), this.logger.warn(`rule ${S} is not defined`));
  }
  function C(P) {
    let { metaSchema: p } = P;
    p !== void 0 && (P.$data && this.opts.$data && (p = z(p)), P.validateSchema = this.compile(p, !0));
  }
  const W = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function z(P) {
    return { anyOf: [P, W] };
  }
})(yu);
var Xa = {}, Ja = {}, Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
const S_ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Ya.default = S_;
var $r = {};
Object.defineProperty($r, "__esModule", { value: !0 });
$r.callRef = $r.getValidate = void 0;
const P_ = Wr, Nc = ce, Xe = ae, wr = Et, Rc = Je, Mn = F, N_ = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: o, validateName: a, opts: c, self: l } = n, { root: d } = o;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = Rc.resolveRef.call(l, d, s, r);
    if (u === void 0)
      throw new P_.default(n.opts.uriResolver, s, r);
    if (u instanceof Rc.SchemaEnv)
      return w(u);
    return $(u);
    function h() {
      if (o === d)
        return ts(e, a, o, o.$async);
      const v = t.scopeValue("root", { ref: d });
      return ts(e, (0, Xe._)`${v}.validate`, d, d.$async);
    }
    function w(v) {
      const _ = Yu(e, v);
      ts(e, _, v, v.$async);
    }
    function $(v) {
      const _ = t.scopeValue("schema", c.code.source === !0 ? { ref: v, code: (0, Xe.stringify)(v) } : { ref: v }), g = t.name("valid"), m = e.subschema({
        schema: v,
        dataTypes: [],
        schemaPath: Xe.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, g);
      e.mergeEvaluated(m), e.ok(g);
    }
  }
};
function Yu(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Xe._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
$r.getValidate = Yu;
function ts(e, t, r, n) {
  const { gen: s, it: o } = e, { allErrors: a, schemaEnv: c, opts: l } = o, d = l.passContext ? wr.default.this : Xe.nil;
  n ? u() : h();
  function u() {
    if (!c.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, Xe._)`await ${(0, Nc.callValidateCode)(e, t, d)}`), $(t), a || s.assign(v, !0);
    }, (_) => {
      s.if((0, Xe._)`!(${_} instanceof ${o.ValidationError})`, () => s.throw(_)), w(_), a || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, Nc.callValidateCode)(e, t, d), () => $(t), () => w(t));
  }
  function w(v) {
    const _ = (0, Xe._)`${v}.errors`;
    s.assign(wr.default.vErrors, (0, Xe._)`${wr.default.vErrors} === null ? ${_} : ${wr.default.vErrors}.concat(${_})`), s.assign(wr.default.errors, (0, Xe._)`${wr.default.vErrors}.length`);
  }
  function $(v) {
    var _;
    if (!o.opts.unevaluated)
      return;
    const g = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (o.props !== !0)
      if (g && !g.dynamicProps)
        g.props !== void 0 && (o.props = Mn.mergeEvaluated.props(s, g.props, o.props));
      else {
        const m = s.var("props", (0, Xe._)`${v}.evaluated.props`);
        o.props = Mn.mergeEvaluated.props(s, m, o.props, Xe.Name);
      }
    if (o.items !== !0)
      if (g && !g.dynamicItems)
        g.items !== void 0 && (o.items = Mn.mergeEvaluated.items(s, g.items, o.items));
      else {
        const m = s.var("items", (0, Xe._)`${v}.evaluated.items`);
        o.items = Mn.mergeEvaluated.items(s, m, o.items, Xe.Name);
      }
  }
}
$r.callRef = ts;
$r.default = N_;
Object.defineProperty(Ja, "__esModule", { value: !0 });
const R_ = Ya, T_ = $r, O_ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  R_.default,
  T_.default
];
Ja.default = O_;
var Qa = {}, Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
const ds = ae, zt = ds.operators, fs = {
  maximum: { okStr: "<=", ok: zt.LTE, fail: zt.GT },
  minimum: { okStr: ">=", ok: zt.GTE, fail: zt.LT },
  exclusiveMaximum: { okStr: "<", ok: zt.LT, fail: zt.GTE },
  exclusiveMinimum: { okStr: ">", ok: zt.GT, fail: zt.LTE }
}, I_ = {
  message: ({ keyword: e, schemaCode: t }) => (0, ds.str)`must be ${fs[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, ds._)`{comparison: ${fs[e].okStr}, limit: ${t}}`
}, j_ = {
  keyword: Object.keys(fs),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: I_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, ds._)`${r} ${fs[t].fail} ${n} || isNaN(${r})`);
  }
};
Za.default = j_;
var xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
const hn = ae, A_ = {
  message: ({ schemaCode: e }) => (0, hn.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, hn._)`{multipleOf: ${e}}`
}, k_ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: A_,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, o = s.opts.multipleOfPrecision, a = t.let("res"), c = o ? (0, hn._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, hn._)`${a} !== parseInt(${a})`;
    e.fail$data((0, hn._)`(${n} === 0 || (${a} = ${r}/${n}, ${c}))`);
  }
};
xa.default = k_;
var ei = {}, ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
function Qu(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
ti.default = Qu;
Qu.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(ei, "__esModule", { value: !0 });
const ar = ae, C_ = F, D_ = ti, M_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, ar.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, ar._)`{limit: ${e}}`
}, L_ = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: M_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, o = t === "maxLength" ? ar.operators.GT : ar.operators.LT, a = s.opts.unicode === !1 ? (0, ar._)`${r}.length` : (0, ar._)`${(0, C_.useFunc)(e.gen, D_.default)}(${r})`;
    e.fail$data((0, ar._)`${a} ${o} ${n}`);
  }
};
ei.default = L_;
var ri = {};
Object.defineProperty(ri, "__esModule", { value: !0 });
const V_ = ce, F_ = F, Tr = ae, z_ = {
  message: ({ schemaCode: e }) => (0, Tr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Tr._)`{pattern: ${e}}`
}, U_ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: z_,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e, c = a.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: l } = a.opts.code, d = l.code === "new RegExp" ? (0, Tr._)`new RegExp` : (0, F_.useFunc)(t, l), u = t.let("valid");
      t.try(() => t.assign(u, (0, Tr._)`${d}(${o}, ${c}).test(${r})`), () => t.assign(u, !1)), e.fail$data((0, Tr._)`!${u}`);
    } else {
      const l = (0, V_.usePattern)(e, s);
      e.fail$data((0, Tr._)`!${l}.test(${r})`);
    }
  }
};
ri.default = U_;
var ni = {};
Object.defineProperty(ni, "__esModule", { value: !0 });
const mn = ae, q_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, mn.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, mn._)`{limit: ${e}}`
}, K_ = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: q_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? mn.operators.GT : mn.operators.LT;
    e.fail$data((0, mn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
ni.default = K_;
var si = {};
Object.defineProperty(si, "__esModule", { value: !0 });
const nn = ce, pn = ae, G_ = F, H_ = {
  message: ({ params: { missingProperty: e } }) => (0, pn.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, pn._)`{missingProperty: ${e}}`
}, B_ = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: H_,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: o, it: a } = e, { opts: c } = a;
    if (!o && r.length === 0)
      return;
    const l = r.length >= c.loopRequired;
    if (a.allErrors ? d() : u(), c.strictRequired) {
      const $ = e.parentSchema.properties, { definedProperties: v } = e.it;
      for (const _ of r)
        if (($ == null ? void 0 : $[_]) === void 0 && !v.has(_)) {
          const g = a.schemaEnv.baseId + a.errSchemaPath, m = `required property "${_}" is not defined at "${g}" (strictRequired)`;
          (0, G_.checkStrictMode)(a, m, a.opts.strictRequired);
        }
    }
    function d() {
      if (l || o)
        e.block$data(pn.nil, h);
      else
        for (const $ of r)
          (0, nn.checkReportMissingProp)(e, $);
    }
    function u() {
      const $ = t.let("missing");
      if (l || o) {
        const v = t.let("valid", !0);
        e.block$data(v, () => w($, v)), e.ok(v);
      } else
        t.if((0, nn.checkMissingProp)(e, r, $)), (0, nn.reportMissingProp)(e, $), t.else();
    }
    function h() {
      t.forOf("prop", n, ($) => {
        e.setParams({ missingProperty: $ }), t.if((0, nn.noPropertyInData)(t, s, $, c.ownProperties), () => e.error());
      });
    }
    function w($, v) {
      e.setParams({ missingProperty: $ }), t.forOf($, n, () => {
        t.assign(v, (0, nn.propertyInData)(t, s, $, c.ownProperties)), t.if((0, pn.not)(v), () => {
          e.error(), t.break();
        });
      }, pn.nil);
    }
  }
};
si.default = B_;
var oi = {};
Object.defineProperty(oi, "__esModule", { value: !0 });
const $n = ae, W_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, $n.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, $n._)`{limit: ${e}}`
}, X_ = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: W_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? $n.operators.GT : $n.operators.LT;
    e.fail$data((0, $n._)`${r}.length ${s} ${n}`);
  }
};
oi.default = X_;
var ai = {}, Nn = {};
Object.defineProperty(Nn, "__esModule", { value: !0 });
const Zu = gs;
Zu.code = 'require("ajv/dist/runtime/equal").default';
Nn.default = Zu;
Object.defineProperty(ai, "__esModule", { value: !0 });
const Ys = Se, Oe = ae, J_ = F, Y_ = Nn, Q_ = {
  message: ({ params: { i: e, j: t } }) => (0, Oe.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Oe._)`{i: ${e}, j: ${t}}`
}, Z_ = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Q_,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: o, schemaCode: a, it: c } = e;
    if (!n && !s)
      return;
    const l = t.let("valid"), d = o.items ? (0, Ys.getSchemaTypes)(o.items) : [];
    e.block$data(l, u, (0, Oe._)`${a} === false`), e.ok(l);
    function u() {
      const v = t.let("i", (0, Oe._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: v, j: _ }), t.assign(l, !0), t.if((0, Oe._)`${v} > 1`, () => (h() ? w : $)(v, _));
    }
    function h() {
      return d.length > 0 && !d.some((v) => v === "object" || v === "array");
    }
    function w(v, _) {
      const g = t.name("item"), m = (0, Ys.checkDataTypes)(d, g, c.opts.strictNumbers, Ys.DataType.Wrong), E = t.const("indices", (0, Oe._)`{}`);
      t.for((0, Oe._)`;${v}--;`, () => {
        t.let(g, (0, Oe._)`${r}[${v}]`), t.if(m, (0, Oe._)`continue`), d.length > 1 && t.if((0, Oe._)`typeof ${g} == "string"`, (0, Oe._)`${g} += "_"`), t.if((0, Oe._)`typeof ${E}[${g}] == "number"`, () => {
          t.assign(_, (0, Oe._)`${E}[${g}]`), e.error(), t.assign(l, !1).break();
        }).code((0, Oe._)`${E}[${g}] = ${v}`);
      });
    }
    function $(v, _) {
      const g = (0, J_.useFunc)(t, Y_.default), m = t.name("outer");
      t.label(m).for((0, Oe._)`;${v}--;`, () => t.for((0, Oe._)`${_} = ${v}; ${_}--;`, () => t.if((0, Oe._)`${g}(${r}[${v}], ${r}[${_}])`, () => {
        e.error(), t.assign(l, !1).break(m);
      })));
    }
  }
};
ai.default = Z_;
var ii = {};
Object.defineProperty(ii, "__esModule", { value: !0 });
const To = ae, x_ = F, ev = Nn, tv = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, To._)`{allowedValue: ${e}}`
}, rv = {
  keyword: "const",
  $data: !0,
  error: tv,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: o } = e;
    n || o && typeof o == "object" ? e.fail$data((0, To._)`!${(0, x_.useFunc)(t, ev.default)}(${r}, ${s})`) : e.fail((0, To._)`${o} !== ${r}`);
  }
};
ii.default = rv;
var ci = {};
Object.defineProperty(ci, "__esModule", { value: !0 });
const an = ae, nv = F, sv = Nn, ov = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, an._)`{allowedValues: ${e}}`
}, av = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: ov,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const c = s.length >= a.opts.loopEnum;
    let l;
    const d = () => l ?? (l = (0, nv.useFunc)(t, sv.default));
    let u;
    if (c || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const $ = t.const("vSchema", o);
      u = (0, an.or)(...s.map((v, _) => w($, _)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", o, ($) => t.if((0, an._)`${d()}(${r}, ${$})`, () => t.assign(u, !0).break()));
    }
    function w($, v) {
      const _ = s[v];
      return typeof _ == "object" && _ !== null ? (0, an._)`${d()}(${r}, ${$}[${v}])` : (0, an._)`${r} === ${_}`;
    }
  }
};
ci.default = av;
Object.defineProperty(Qa, "__esModule", { value: !0 });
const iv = Za, cv = xa, lv = ei, uv = ri, dv = ni, fv = si, hv = oi, mv = ai, pv = ii, $v = ci, yv = [
  // number
  iv.default,
  cv.default,
  // string
  lv.default,
  uv.default,
  // object
  dv.default,
  fv.default,
  // array
  hv.default,
  mv.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  pv.default,
  $v.default
];
Qa.default = yv;
var li = {}, Xr = {};
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.validateAdditionalItems = void 0;
const ir = ae, Oo = F, gv = {
  message: ({ params: { len: e } }) => (0, ir.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, ir._)`{limit: ${e}}`
}, _v = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: gv,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Oo.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    xu(e, n);
  }
};
function xu(e, t) {
  const { gen: r, schema: n, data: s, keyword: o, it: a } = e;
  a.items = !0;
  const c = r.const("len", (0, ir._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, ir._)`${c} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Oo.alwaysValidSchema)(a, n)) {
    const d = r.var("valid", (0, ir._)`${c} <= ${t.length}`);
    r.if((0, ir.not)(d), () => l(d)), e.ok(d);
  }
  function l(d) {
    r.forRange("i", t.length, c, (u) => {
      e.subschema({ keyword: o, dataProp: u, dataPropType: Oo.Type.Num }, d), a.allErrors || r.if((0, ir.not)(d), () => r.break());
    });
  }
}
Xr.validateAdditionalItems = xu;
Xr.default = _v;
var ui = {}, Jr = {};
Object.defineProperty(Jr, "__esModule", { value: !0 });
Jr.validateTuple = void 0;
const Tc = ae, rs = F, vv = ce, wv = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return ed(e, "additionalItems", t);
    r.items = !0, !(0, rs.alwaysValidSchema)(r, t) && e.ok((0, vv.validateArray)(e));
  }
};
function ed(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: o, keyword: a, it: c } = e;
  u(s), c.opts.unevaluated && r.length && c.items !== !0 && (c.items = rs.mergeEvaluated.items(n, r.length, c.items));
  const l = n.name("valid"), d = n.const("len", (0, Tc._)`${o}.length`);
  r.forEach((h, w) => {
    (0, rs.alwaysValidSchema)(c, h) || (n.if((0, Tc._)`${d} > ${w}`, () => e.subschema({
      keyword: a,
      schemaProp: w,
      dataProp: w
    }, l)), e.ok(l));
  });
  function u(h) {
    const { opts: w, errSchemaPath: $ } = c, v = r.length, _ = v === h.minItems && (v === h.maxItems || h[t] === !1);
    if (w.strictTuples && !_) {
      const g = `"${a}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${$}"`;
      (0, rs.checkStrictMode)(c, g, w.strictTuples);
    }
  }
}
Jr.validateTuple = ed;
Jr.default = wv;
Object.defineProperty(ui, "__esModule", { value: !0 });
const Ev = Jr, bv = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, Ev.validateTuple)(e, "items")
};
ui.default = bv;
var di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
const Oc = ae, Sv = F, Pv = ce, Nv = Xr, Rv = {
  message: ({ params: { len: e } }) => (0, Oc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Oc._)`{limit: ${e}}`
}, Tv = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Rv,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, Sv.alwaysValidSchema)(n, t) && (s ? (0, Nv.validateAdditionalItems)(e, s) : e.ok((0, Pv.validateArray)(e)));
  }
};
di.default = Tv;
var fi = {};
Object.defineProperty(fi, "__esModule", { value: !0 });
const et = ae, Ln = F, Ov = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, et.str)`must contain at least ${e} valid item(s)` : (0, et.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, et._)`{minContains: ${e}}` : (0, et._)`{minContains: ${e}, maxContains: ${t}}`
}, Iv = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Ov,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    let a, c;
    const { minContains: l, maxContains: d } = n;
    o.opts.next ? (a = l === void 0 ? 1 : l, c = d) : a = 1;
    const u = t.const("len", (0, et._)`${s}.length`);
    if (e.setParams({ min: a, max: c }), c === void 0 && a === 0) {
      (0, Ln.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (c !== void 0 && a > c) {
      (0, Ln.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Ln.alwaysValidSchema)(o, r)) {
      let _ = (0, et._)`${u} >= ${a}`;
      c !== void 0 && (_ = (0, et._)`${_} && ${u} <= ${c}`), e.pass(_);
      return;
    }
    o.items = !0;
    const h = t.name("valid");
    c === void 0 && a === 1 ? $(h, () => t.if(h, () => t.break())) : a === 0 ? (t.let(h, !0), c !== void 0 && t.if((0, et._)`${s}.length > 0`, w)) : (t.let(h, !1), w()), e.result(h, () => e.reset());
    function w() {
      const _ = t.name("_valid"), g = t.let("count", 0);
      $(_, () => t.if(_, () => v(g)));
    }
    function $(_, g) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: Ln.Type.Num,
          compositeRule: !0
        }, _), g();
      });
    }
    function v(_) {
      t.code((0, et._)`${_}++`), c === void 0 ? t.if((0, et._)`${_} >= ${a}`, () => t.assign(h, !0).break()) : (t.if((0, et._)`${_} > ${c}`, () => t.assign(h, !1).break()), a === 1 ? t.assign(h, !0) : t.if((0, et._)`${_} >= ${a}`, () => t.assign(h, !0)));
    }
  }
};
fi.default = Iv;
var td = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = ae, r = F, n = ce;
  e.error = {
    message: ({ params: { property: l, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${l} is present`;
    },
    params: ({ params: { property: l, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${l},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${u}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(l) {
      const [d, u] = o(l);
      a(l, d), c(l, u);
    }
  };
  function o({ schema: l }) {
    const d = {}, u = {};
    for (const h in l) {
      if (h === "__proto__")
        continue;
      const w = Array.isArray(l[h]) ? d : u;
      w[h] = l[h];
    }
    return [d, u];
  }
  function a(l, d = l.schema) {
    const { gen: u, data: h, it: w } = l;
    if (Object.keys(d).length === 0)
      return;
    const $ = u.let("missing");
    for (const v in d) {
      const _ = d[v];
      if (_.length === 0)
        continue;
      const g = (0, n.propertyInData)(u, h, v, w.opts.ownProperties);
      l.setParams({
        property: v,
        depsCount: _.length,
        deps: _.join(", ")
      }), w.allErrors ? u.if(g, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(l, m);
      }) : (u.if((0, t._)`${g} && (${(0, n.checkMissingProp)(l, _, $)})`), (0, n.reportMissingProp)(l, $), u.else());
    }
  }
  e.validatePropertyDeps = a;
  function c(l, d = l.schema) {
    const { gen: u, data: h, keyword: w, it: $ } = l, v = u.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)($, d[_]) || (u.if(
        (0, n.propertyInData)(u, h, _, $.opts.ownProperties),
        () => {
          const g = l.subschema({ keyword: w, schemaProp: _ }, v);
          l.mergeValidEvaluated(g, v);
        },
        () => u.var(v, !0)
        // TODO var
      ), l.ok(v));
  }
  e.validateSchemaDeps = c, e.default = s;
})(td);
var hi = {};
Object.defineProperty(hi, "__esModule", { value: !0 });
const rd = ae, jv = F, Av = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, rd._)`{propertyName: ${e.propertyName}}`
}, kv = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Av,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, jv.alwaysValidSchema)(s, r))
      return;
    const o = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, o), t.if((0, rd.not)(o), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
hi.default = kv;
var Os = {};
Object.defineProperty(Os, "__esModule", { value: !0 });
const Vn = ce, it = ae, Cv = Et, Fn = F, Dv = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, it._)`{additionalProperty: ${e.additionalProperty}}`
}, Mv = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Dv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: o, it: a } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: c, opts: l } = a;
    if (a.props = !0, l.removeAdditional !== "all" && (0, Fn.alwaysValidSchema)(a, r))
      return;
    const d = (0, Vn.allSchemaProperties)(n.properties), u = (0, Vn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, it._)`${o} === ${Cv.default.errors}`);
    function h() {
      t.forIn("key", s, (g) => {
        !d.length && !u.length ? v(g) : t.if(w(g), () => v(g));
      });
    }
    function w(g) {
      let m;
      if (d.length > 8) {
        const E = (0, Fn.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, Vn.isOwnProperty)(t, E, g);
      } else d.length ? m = (0, it.or)(...d.map((E) => (0, it._)`${g} === ${E}`)) : m = it.nil;
      return u.length && (m = (0, it.or)(m, ...u.map((E) => (0, it._)`${(0, Vn.usePattern)(e, E)}.test(${g})`))), (0, it.not)(m);
    }
    function $(g) {
      t.code((0, it._)`delete ${s}[${g}]`);
    }
    function v(g) {
      if (l.removeAdditional === "all" || l.removeAdditional && r === !1) {
        $(g);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: g }), e.error(), c || t.break();
        return;
      }
      if (typeof r == "object" && !(0, Fn.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        l.removeAdditional === "failing" ? (_(g, m, !1), t.if((0, it.not)(m), () => {
          e.reset(), $(g);
        })) : (_(g, m), c || t.if((0, it.not)(m), () => t.break()));
      }
    }
    function _(g, m, E) {
      const R = {
        keyword: "additionalProperties",
        dataProp: g,
        dataPropType: Fn.Type.Str
      };
      E === !1 && Object.assign(R, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(R, m);
    }
  }
};
Os.default = Mv;
var mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
const Lv = dt, Ic = ce, Qs = F, jc = Os, Vv = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && jc.default.code(new Lv.KeywordCxt(o, jc.default, "additionalProperties"));
    const a = (0, Ic.allSchemaProperties)(r);
    for (const h of a)
      o.definedProperties.add(h);
    o.opts.unevaluated && a.length && o.props !== !0 && (o.props = Qs.mergeEvaluated.props(t, (0, Qs.toHash)(a), o.props));
    const c = a.filter((h) => !(0, Qs.alwaysValidSchema)(o, r[h]));
    if (c.length === 0)
      return;
    const l = t.name("valid");
    for (const h of c)
      d(h) ? u(h) : (t.if((0, Ic.propertyInData)(t, s, h, o.opts.ownProperties)), u(h), o.allErrors || t.else().var(l, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(l);
    function d(h) {
      return o.opts.useDefaults && !o.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, l);
    }
  }
};
mi.default = Vv;
var pi = {};
Object.defineProperty(pi, "__esModule", { value: !0 });
const Ac = ce, zn = ae, kc = F, Cc = F, Fv = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: o } = e, { opts: a } = o, c = (0, Ac.allSchemaProperties)(r), l = c.filter((_) => (0, kc.alwaysValidSchema)(o, r[_]));
    if (c.length === 0 || l.length === c.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const d = a.strictSchema && !a.allowMatchingProperties && s.properties, u = t.name("valid");
    o.props !== !0 && !(o.props instanceof zn.Name) && (o.props = (0, Cc.evaluatedPropsToName)(t, o.props));
    const { props: h } = o;
    w();
    function w() {
      for (const _ of c)
        d && $(_), o.allErrors ? v(_) : (t.var(u, !0), v(_), t.if(u));
    }
    function $(_) {
      for (const g in d)
        new RegExp(_).test(g) && (0, kc.checkStrictMode)(o, `property ${g} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function v(_) {
      t.forIn("key", n, (g) => {
        t.if((0, zn._)`${(0, Ac.usePattern)(e, _)}.test(${g})`, () => {
          const m = l.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: g,
            dataPropType: Cc.Type.Str
          }, u), o.opts.unevaluated && h !== !0 ? t.assign((0, zn._)`${h}[${g}]`, !0) : !m && !o.allErrors && t.if((0, zn.not)(u), () => t.break());
        });
      });
    }
  }
};
pi.default = Fv;
var $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
const zv = F, Uv = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, zv.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
$i.default = Uv;
var yi = {};
Object.defineProperty(yi, "__esModule", { value: !0 });
const qv = ce, Kv = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: qv.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
yi.default = Kv;
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
const ns = ae, Gv = F, Hv = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, ns._)`{passingSchemas: ${e.passing}}`
}, Bv = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Hv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const o = r, a = t.let("valid", !1), c = t.let("passing", null), l = t.name("_valid");
    e.setParams({ passing: c }), t.block(d), e.result(a, () => e.reset(), () => e.error(!0));
    function d() {
      o.forEach((u, h) => {
        let w;
        (0, Gv.alwaysValidSchema)(s, u) ? t.var(l, !0) : w = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, l), h > 0 && t.if((0, ns._)`${l} && ${a}`).assign(a, !1).assign(c, (0, ns._)`[${c}, ${h}]`).else(), t.if(l, () => {
          t.assign(a, !0), t.assign(c, h), w && e.mergeEvaluated(w, ns.Name);
        });
      });
    }
  }
};
gi.default = Bv;
var _i = {};
Object.defineProperty(_i, "__esModule", { value: !0 });
const Wv = F, Xv = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((o, a) => {
      if ((0, Wv.alwaysValidSchema)(n, o))
        return;
      const c = e.subschema({ keyword: "allOf", schemaProp: a }, s);
      e.ok(s), e.mergeEvaluated(c);
    });
  }
};
_i.default = Xv;
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
const hs = ae, nd = F, Jv = {
  message: ({ params: e }) => (0, hs.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, hs._)`{failingKeyword: ${e.ifClause}}`
}, Yv = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Jv,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, nd.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Dc(n, "then"), o = Dc(n, "else");
    if (!s && !o)
      return;
    const a = t.let("valid", !0), c = t.name("_valid");
    if (l(), e.reset(), s && o) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(c, d("then", u), d("else", u));
    } else s ? t.if(c, d("then")) : t.if((0, hs.not)(c), d("else"));
    e.pass(a, () => e.error(!0));
    function l() {
      const u = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, c);
      e.mergeEvaluated(u);
    }
    function d(u, h) {
      return () => {
        const w = e.subschema({ keyword: u }, c);
        t.assign(a, c), e.mergeValidEvaluated(w, a), h ? t.assign(h, (0, hs._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function Dc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, nd.alwaysValidSchema)(e, r);
}
vi.default = Yv;
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
const Qv = F, Zv = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Qv.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
wi.default = Zv;
Object.defineProperty(li, "__esModule", { value: !0 });
const xv = Xr, ew = ui, tw = Jr, rw = di, nw = fi, sw = td, ow = hi, aw = Os, iw = mi, cw = pi, lw = $i, uw = yi, dw = gi, fw = _i, hw = vi, mw = wi;
function pw(e = !1) {
  const t = [
    // any
    lw.default,
    uw.default,
    dw.default,
    fw.default,
    hw.default,
    mw.default,
    // object
    ow.default,
    aw.default,
    sw.default,
    iw.default,
    cw.default
  ];
  return e ? t.push(ew.default, rw.default) : t.push(xv.default, tw.default), t.push(nw.default), t;
}
li.default = pw;
var Ei = {}, bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
const Ee = ae, $w = {
  message: ({ schemaCode: e }) => (0, Ee.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, Ee._)`{format: ${e}}`
}, yw = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: $w,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: o, schemaCode: a, it: c } = e, { opts: l, errSchemaPath: d, schemaEnv: u, self: h } = c;
    if (!l.validateFormats)
      return;
    s ? w() : $();
    function w() {
      const v = r.scopeValue("formats", {
        ref: h.formats,
        code: l.code.formats
      }), _ = r.const("fDef", (0, Ee._)`${v}[${a}]`), g = r.let("fType"), m = r.let("format");
      r.if((0, Ee._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign(g, (0, Ee._)`${_}.type || "string"`).assign(m, (0, Ee._)`${_}.validate`), () => r.assign(g, (0, Ee._)`"string"`).assign(m, _)), e.fail$data((0, Ee.or)(E(), R()));
      function E() {
        return l.strictSchema === !1 ? Ee.nil : (0, Ee._)`${a} && !${m}`;
      }
      function R() {
        const T = u.$async ? (0, Ee._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, Ee._)`${m}(${n})`, I = (0, Ee._)`(typeof ${m} == "function" ? ${T} : ${m}.test(${n}))`;
        return (0, Ee._)`${m} && ${m} !== true && ${g} === ${t} && !${I}`;
      }
    }
    function $() {
      const v = h.formats[o];
      if (!v) {
        E();
        return;
      }
      if (v === !0)
        return;
      const [_, g, m] = R(v);
      _ === t && e.pass(T());
      function E() {
        if (l.strictSchema === !1) {
          h.logger.warn(I());
          return;
        }
        throw new Error(I());
        function I() {
          return `unknown format "${o}" ignored in schema at path "${d}"`;
        }
      }
      function R(I) {
        const K = I instanceof RegExp ? (0, Ee.regexpCode)(I) : l.code.formats ? (0, Ee._)`${l.code.formats}${(0, Ee.getProperty)(o)}` : void 0, Y = r.scopeValue("formats", { key: o, ref: I, code: K });
        return typeof I == "object" && !(I instanceof RegExp) ? [I.type || "string", I.validate, (0, Ee._)`${Y}.validate`] : ["string", I, Y];
      }
      function T() {
        if (typeof v == "object" && !(v instanceof RegExp) && v.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, Ee._)`await ${m}(${n})`;
        }
        return typeof g == "function" ? (0, Ee._)`${m}(${n})` : (0, Ee._)`${m}.test(${n})`;
      }
    }
  }
};
bi.default = yw;
Object.defineProperty(Ei, "__esModule", { value: !0 });
const gw = bi, _w = [gw.default];
Ei.default = _w;
var Ur = {};
Object.defineProperty(Ur, "__esModule", { value: !0 });
Ur.contentVocabulary = Ur.metadataVocabulary = void 0;
Ur.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Ur.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Xa, "__esModule", { value: !0 });
const vw = Ja, ww = Qa, Ew = li, bw = Ei, Mc = Ur, Sw = [
  vw.default,
  ww.default,
  (0, Ew.default)(),
  bw.default,
  Mc.metadataVocabulary,
  Mc.contentVocabulary
];
Xa.default = Sw;
var Si = {}, Is = {};
Object.defineProperty(Is, "__esModule", { value: !0 });
Is.DiscrError = void 0;
var Lc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Lc || (Is.DiscrError = Lc = {}));
Object.defineProperty(Si, "__esModule", { value: !0 });
const Sr = ae, Io = Is, Vc = Je, Pw = Wr, Nw = F, Rw = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Io.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, Sr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, Tw = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Rw,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: o } = e, { oneOf: a } = s;
    if (!o.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const c = n.propertyName;
    if (typeof c != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!a)
      throw new Error("discriminator: requires oneOf keyword");
    const l = t.let("valid", !1), d = t.const("tag", (0, Sr._)`${r}${(0, Sr.getProperty)(c)}`);
    t.if((0, Sr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: Io.DiscrError.Tag, tag: d, tagName: c })), e.ok(l);
    function u() {
      const $ = w();
      t.if(!1);
      for (const v in $)
        t.elseIf((0, Sr._)`${d} === ${v}`), t.assign(l, h($[v]));
      t.else(), e.error(!1, { discrError: Io.DiscrError.Mapping, tag: d, tagName: c }), t.endIf();
    }
    function h($) {
      const v = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: $ }, v);
      return e.mergeEvaluated(_, Sr.Name), v;
    }
    function w() {
      var $;
      const v = {}, _ = m(s);
      let g = !0;
      for (let T = 0; T < a.length; T++) {
        let I = a[T];
        if (I != null && I.$ref && !(0, Nw.schemaHasRulesButRef)(I, o.self.RULES)) {
          const Y = I.$ref;
          if (I = Vc.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, Y), I instanceof Vc.SchemaEnv && (I = I.schema), I === void 0)
            throw new Pw.default(o.opts.uriResolver, o.baseId, Y);
        }
        const K = ($ = I == null ? void 0 : I.properties) === null || $ === void 0 ? void 0 : $[c];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${c}"`);
        g = g && (_ || m(I)), E(K, T);
      }
      if (!g)
        throw new Error(`discriminator: "${c}" must be required`);
      return v;
      function m({ required: T }) {
        return Array.isArray(T) && T.includes(c);
      }
      function E(T, I) {
        if (T.const)
          R(T.const, I);
        else if (T.enum)
          for (const K of T.enum)
            R(K, I);
        else
          throw new Error(`discriminator: "properties/${c}" must have "const" or "enum"`);
      }
      function R(T, I) {
        if (typeof T != "string" || T in v)
          throw new Error(`discriminator: "${c}" values must be unique strings`);
        v[T] = I;
      }
    }
  }
};
Si.default = Tw;
const Ow = "http://json-schema.org/draft-07/schema#", Iw = "http://json-schema.org/draft-07/schema#", jw = "Core schema meta-schema", Aw = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, kw = [
  "object",
  "boolean"
], Cw = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, Dw = {
  $schema: Ow,
  $id: Iw,
  title: jw,
  definitions: Aw,
  type: kw,
  properties: Cw,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = yu, n = Xa, s = Si, o = Dw, a = ["/properties"], c = "http://json-schema.org/draft-07/schema";
  class l extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((v) => this.addVocabulary(v)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const v = this.opts.$data ? this.$dataMetaSchema(o, a) : o;
      this.addMetaSchema(v, c, !1), this.refs["http://json-schema.org/schema"] = c;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(c) ? c : void 0);
    }
  }
  t.Ajv = l, e.exports = t = l, e.exports.Ajv = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
  var d = dt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var u = ae;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return u._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return u.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return u.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return u.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return u.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return u.CodeGen;
  } });
  var h = Pn;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var w = Wr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return w.default;
  } });
})(bo, bo.exports);
var Mw = bo.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = Mw, r = ae, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, o = {
    message: ({ keyword: c, schemaCode: l }) => (0, r.str)`should be ${s[c].okStr} ${l}`,
    params: ({ keyword: c, schemaCode: l }) => (0, r._)`{comparison: ${s[c].okStr}, limit: ${l}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: o,
    code(c) {
      const { gen: l, data: d, schemaCode: u, keyword: h, it: w } = c, { opts: $, self: v } = w;
      if (!$.validateFormats)
        return;
      const _ = new t.KeywordCxt(w, v.RULES.all.format.definition, "format");
      _.$data ? g() : m();
      function g() {
        const R = l.scopeValue("formats", {
          ref: v.formats,
          code: $.code.formats
        }), T = l.const("fmt", (0, r._)`${R}[${_.schemaCode}]`);
        c.fail$data((0, r.or)((0, r._)`typeof ${T} != "object"`, (0, r._)`${T} instanceof RegExp`, (0, r._)`typeof ${T}.compare != "function"`, E(T)));
      }
      function m() {
        const R = _.schema, T = v.formats[R];
        if (!T || T === !0)
          return;
        if (typeof T != "object" || T instanceof RegExp || typeof T.compare != "function")
          throw new Error(`"${h}": format "${R}" does not define "compare" function`);
        const I = l.scopeValue("formats", {
          key: R,
          ref: T,
          code: $.code.formats ? (0, r._)`${$.code.formats}${(0, r.getProperty)(R)}` : void 0
        });
        c.fail$data(E(I));
      }
      function E(R) {
        return (0, r._)`${R}.compare(${d}, ${u}) ${s[h].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const a = (c) => (c.addKeyword(e.formatLimitDefinition), c);
  e.default = a;
})($u);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = pu, n = $u, s = ae, o = new s.Name("fullFormats"), a = new s.Name("fastFormats"), c = (d, u = { keywords: !0 }) => {
    if (Array.isArray(u))
      return l(d, u, r.fullFormats, o), d;
    const [h, w] = u.mode === "fast" ? [r.fastFormats, a] : [r.fullFormats, o], $ = u.formats || r.formatNames;
    return l(d, $, h, w), u.keywords && (0, n.default)(d), d;
  };
  c.get = (d, u = "full") => {
    const w = (u === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!w)
      throw new Error(`Unknown format "${d}"`);
    return w;
  };
  function l(d, u, h, w) {
    var $, v;
    ($ = (v = d.opts.code).formats) !== null && $ !== void 0 || (v.formats = (0, s._)`require("ajv-formats/dist/formats").${w}`);
    for (const _ of u)
      d.addFormat(_, h[_]);
  }
  e.exports = t = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
})(Eo, Eo.exports);
var Lw = Eo.exports;
const Vw = /* @__PURE__ */ Pl(Lw), Fw = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), o = Object.getOwnPropertyDescriptor(t, r);
  !zw(s, o) && n || Object.defineProperty(e, r, o);
}, zw = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, Uw = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, qw = (e, t) => `/* Wrapped ${e}*/
${t}`, Kw = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), Gw = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), Hw = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = qw.bind(null, n, t.toString());
  Object.defineProperty(s, "name", Gw);
  const { writable: o, enumerable: a, configurable: c } = Kw;
  Object.defineProperty(e, "toString", { value: s, writable: o, enumerable: a, configurable: c });
};
function Bw(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    Fw(e, t, s, r);
  return Uw(e, t), Hw(e, t, n), e;
}
const Fc = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: s = !1,
    after: o = !0
  } = t;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!s && !o)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let a, c, l;
  const d = function(...u) {
    const h = this, w = () => {
      a = void 0, c && (clearTimeout(c), c = void 0), o && (l = e.apply(h, u));
    }, $ = () => {
      c = void 0, a && (clearTimeout(a), a = void 0), o && (l = e.apply(h, u));
    }, v = s && !a;
    return clearTimeout(a), a = setTimeout(w, r), n > 0 && n !== Number.POSITIVE_INFINITY && !c && (c = setTimeout($, n)), v && (l = e.apply(h, u)), l;
  };
  return Bw(d, e), d.cancel = () => {
    a && (clearTimeout(a), a = void 0), c && (clearTimeout(c), c = void 0);
  }, d;
};
var jo = { exports: {} };
const Ww = "2.0.0", sd = 256, Xw = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, Jw = 16, Yw = sd - 6, Qw = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Rn = {
  MAX_LENGTH: sd,
  MAX_SAFE_COMPONENT_LENGTH: Jw,
  MAX_SAFE_BUILD_LENGTH: Yw,
  MAX_SAFE_INTEGER: Xw,
  RELEASE_TYPES: Qw,
  SEMVER_SPEC_VERSION: Ww,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Zw = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var js = Zw;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = Rn, o = js;
  t = e.exports = {};
  const a = t.re = [], c = t.safeRe = [], l = t.src = [], d = t.safeSrc = [], u = t.t = {};
  let h = 0;
  const w = "[a-zA-Z0-9-]", $ = [
    ["\\s", 1],
    ["\\d", s],
    [w, n]
  ], v = (g) => {
    for (const [m, E] of $)
      g = g.split(`${m}*`).join(`${m}{0,${E}}`).split(`${m}+`).join(`${m}{1,${E}}`);
    return g;
  }, _ = (g, m, E) => {
    const R = v(m), T = h++;
    o(g, T, m), u[g] = T, l[T] = m, d[T] = R, a[T] = new RegExp(m, E ? "g" : void 0), c[T] = new RegExp(R, E ? "g" : void 0);
  };
  _("NUMERICIDENTIFIER", "0|[1-9]\\d*"), _("NUMERICIDENTIFIERLOOSE", "\\d+"), _("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${w}*`), _("MAINVERSION", `(${l[u.NUMERICIDENTIFIER]})\\.(${l[u.NUMERICIDENTIFIER]})\\.(${l[u.NUMERICIDENTIFIER]})`), _("MAINVERSIONLOOSE", `(${l[u.NUMERICIDENTIFIERLOOSE]})\\.(${l[u.NUMERICIDENTIFIERLOOSE]})\\.(${l[u.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASEIDENTIFIER", `(?:${l[u.NONNUMERICIDENTIFIER]}|${l[u.NUMERICIDENTIFIER]})`), _("PRERELEASEIDENTIFIERLOOSE", `(?:${l[u.NONNUMERICIDENTIFIER]}|${l[u.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASE", `(?:-(${l[u.PRERELEASEIDENTIFIER]}(?:\\.${l[u.PRERELEASEIDENTIFIER]})*))`), _("PRERELEASELOOSE", `(?:-?(${l[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[u.PRERELEASEIDENTIFIERLOOSE]})*))`), _("BUILDIDENTIFIER", `${w}+`), _("BUILD", `(?:\\+(${l[u.BUILDIDENTIFIER]}(?:\\.${l[u.BUILDIDENTIFIER]})*))`), _("FULLPLAIN", `v?${l[u.MAINVERSION]}${l[u.PRERELEASE]}?${l[u.BUILD]}?`), _("FULL", `^${l[u.FULLPLAIN]}$`), _("LOOSEPLAIN", `[v=\\s]*${l[u.MAINVERSIONLOOSE]}${l[u.PRERELEASELOOSE]}?${l[u.BUILD]}?`), _("LOOSE", `^${l[u.LOOSEPLAIN]}$`), _("GTLT", "((?:<|>)?=?)"), _("XRANGEIDENTIFIERLOOSE", `${l[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), _("XRANGEIDENTIFIER", `${l[u.NUMERICIDENTIFIER]}|x|X|\\*`), _("XRANGEPLAIN", `[v=\\s]*(${l[u.XRANGEIDENTIFIER]})(?:\\.(${l[u.XRANGEIDENTIFIER]})(?:\\.(${l[u.XRANGEIDENTIFIER]})(?:${l[u.PRERELEASE]})?${l[u.BUILD]}?)?)?`), _("XRANGEPLAINLOOSE", `[v=\\s]*(${l[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[u.XRANGEIDENTIFIERLOOSE]})(?:${l[u.PRERELEASELOOSE]})?${l[u.BUILD]}?)?)?`), _("XRANGE", `^${l[u.GTLT]}\\s*${l[u.XRANGEPLAIN]}$`), _("XRANGELOOSE", `^${l[u.GTLT]}\\s*${l[u.XRANGEPLAINLOOSE]}$`), _("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), _("COERCE", `${l[u.COERCEPLAIN]}(?:$|[^\\d])`), _("COERCEFULL", l[u.COERCEPLAIN] + `(?:${l[u.PRERELEASE]})?(?:${l[u.BUILD]})?(?:$|[^\\d])`), _("COERCERTL", l[u.COERCE], !0), _("COERCERTLFULL", l[u.COERCEFULL], !0), _("LONETILDE", "(?:~>?)"), _("TILDETRIM", `(\\s*)${l[u.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", _("TILDE", `^${l[u.LONETILDE]}${l[u.XRANGEPLAIN]}$`), _("TILDELOOSE", `^${l[u.LONETILDE]}${l[u.XRANGEPLAINLOOSE]}$`), _("LONECARET", "(?:\\^)"), _("CARETTRIM", `(\\s*)${l[u.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", _("CARET", `^${l[u.LONECARET]}${l[u.XRANGEPLAIN]}$`), _("CARETLOOSE", `^${l[u.LONECARET]}${l[u.XRANGEPLAINLOOSE]}$`), _("COMPARATORLOOSE", `^${l[u.GTLT]}\\s*(${l[u.LOOSEPLAIN]})$|^$`), _("COMPARATOR", `^${l[u.GTLT]}\\s*(${l[u.FULLPLAIN]})$|^$`), _("COMPARATORTRIM", `(\\s*)${l[u.GTLT]}\\s*(${l[u.LOOSEPLAIN]}|${l[u.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", _("HYPHENRANGE", `^\\s*(${l[u.XRANGEPLAIN]})\\s+-\\s+(${l[u.XRANGEPLAIN]})\\s*$`), _("HYPHENRANGELOOSE", `^\\s*(${l[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[u.XRANGEPLAINLOOSE]})\\s*$`), _("STAR", "(<|>)?=?\\s*\\*"), _("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), _("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(jo, jo.exports);
var Tn = jo.exports;
const xw = Object.freeze({ loose: !0 }), eE = Object.freeze({}), tE = (e) => e ? typeof e != "object" ? xw : e : eE;
var Pi = tE;
const zc = /^[0-9]+$/, od = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = zc.test(e), n = zc.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, rE = (e, t) => od(t, e);
var ad = {
  compareIdentifiers: od,
  rcompareIdentifiers: rE
};
const Un = js, { MAX_LENGTH: Uc, MAX_SAFE_INTEGER: qn } = Rn, { safeRe: Kn, t: Gn } = Tn, nE = Pi, { compareIdentifiers: Zs } = ad;
let sE = class $t {
  constructor(t, r) {
    if (r = nE(r), t instanceof $t) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Uc)
      throw new TypeError(
        `version is longer than ${Uc} characters`
      );
    Un("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Kn[Gn.LOOSE] : Kn[Gn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > qn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > qn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > qn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const o = +s;
        if (o >= 0 && o < qn)
          return o;
      }
      return s;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (Un("SemVer.compare", this.version, this.options, t), !(t instanceof $t)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new $t(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof $t || (t = new $t(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof $t || (t = new $t(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = t.prerelease[r];
      if (Un("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return Zs(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof $t || (t = new $t(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (Un("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return Zs(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? Kn[Gn.PRERELEASELOOSE] : Kn[Gn.PRERELEASE]);
        if (!s || s[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const s = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [s];
        else {
          let o = this.prerelease.length;
          for (; --o >= 0; )
            typeof this.prerelease[o] == "number" && (this.prerelease[o]++, o = -2);
          if (o === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(s);
          }
        }
        if (r) {
          let o = [r, s];
          n === !1 && (o = [r]), Zs(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var ze = sE;
const qc = ze, oE = (e, t, r = !1) => {
  if (e instanceof qc)
    return e;
  try {
    return new qc(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var yr = oE;
const aE = yr, iE = (e, t) => {
  const r = aE(e, t);
  return r ? r.version : null;
};
var cE = iE;
const lE = yr, uE = (e, t) => {
  const r = lE(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var dE = uE;
const Kc = ze, fE = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Kc(
      e instanceof Kc ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var hE = fE;
const Gc = yr, mE = (e, t) => {
  const r = Gc(e, null, !0), n = Gc(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const o = s > 0, a = o ? r : n, c = o ? n : r, l = !!a.prerelease.length;
  if (!!c.prerelease.length && !l) {
    if (!c.patch && !c.minor)
      return "major";
    if (c.compareMain(a) === 0)
      return c.minor && !c.patch ? "minor" : "patch";
  }
  const u = l ? "pre" : "";
  return r.major !== n.major ? u + "major" : r.minor !== n.minor ? u + "minor" : r.patch !== n.patch ? u + "patch" : "prerelease";
};
var pE = mE;
const $E = ze, yE = (e, t) => new $E(e, t).major;
var gE = yE;
const _E = ze, vE = (e, t) => new _E(e, t).minor;
var wE = vE;
const EE = ze, bE = (e, t) => new EE(e, t).patch;
var SE = bE;
const PE = yr, NE = (e, t) => {
  const r = PE(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var RE = NE;
const Hc = ze, TE = (e, t, r) => new Hc(e, r).compare(new Hc(t, r));
var ft = TE;
const OE = ft, IE = (e, t, r) => OE(t, e, r);
var jE = IE;
const AE = ft, kE = (e, t) => AE(e, t, !0);
var CE = kE;
const Bc = ze, DE = (e, t, r) => {
  const n = new Bc(e, r), s = new Bc(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var Ni = DE;
const ME = Ni, LE = (e, t) => e.sort((r, n) => ME(r, n, t));
var VE = LE;
const FE = Ni, zE = (e, t) => e.sort((r, n) => FE(n, r, t));
var UE = zE;
const qE = ft, KE = (e, t, r) => qE(e, t, r) > 0;
var As = KE;
const GE = ft, HE = (e, t, r) => GE(e, t, r) < 0;
var Ri = HE;
const BE = ft, WE = (e, t, r) => BE(e, t, r) === 0;
var id = WE;
const XE = ft, JE = (e, t, r) => XE(e, t, r) !== 0;
var cd = JE;
const YE = ft, QE = (e, t, r) => YE(e, t, r) >= 0;
var Ti = QE;
const ZE = ft, xE = (e, t, r) => ZE(e, t, r) <= 0;
var Oi = xE;
const eb = id, tb = cd, rb = As, nb = Ti, sb = Ri, ob = Oi, ab = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return eb(e, r, n);
    case "!=":
      return tb(e, r, n);
    case ">":
      return rb(e, r, n);
    case ">=":
      return nb(e, r, n);
    case "<":
      return sb(e, r, n);
    case "<=":
      return ob(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var ld = ab;
const ib = ze, cb = yr, { safeRe: Hn, t: Bn } = Tn, lb = (e, t) => {
  if (e instanceof ib)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Hn[Bn.COERCEFULL] : Hn[Bn.COERCE]);
  else {
    const l = t.includePrerelease ? Hn[Bn.COERCERTLFULL] : Hn[Bn.COERCERTL];
    let d;
    for (; (d = l.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), l.lastIndex = d.index + d[1].length + d[2].length;
    l.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", o = r[4] || "0", a = t.includePrerelease && r[5] ? `-${r[5]}` : "", c = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return cb(`${n}.${s}.${o}${a}${c}`, t);
};
var ub = lb;
const db = yr, fb = Rn, hb = ze, mb = (e, t, r) => {
  if (!fb.RELEASE_TYPES.includes(t))
    return null;
  const n = pb(e, r);
  return n && $b(n, t);
}, pb = (e, t) => {
  const r = e instanceof hb ? e.version : e;
  return db(r, t);
}, $b = (e, t) => {
  if (yb(t))
    return e.version;
  switch (e.prerelease = [], t) {
    case "major":
      e.minor = 0, e.patch = 0;
      break;
    case "minor":
      e.patch = 0;
      break;
  }
  return e.format();
}, yb = (e) => e.startsWith("pre");
var gb = mb;
class _b {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const s = this.map.keys().next().value;
        this.delete(s);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var vb = _b, xs, Wc;
function ht() {
  if (Wc) return xs;
  Wc = 1;
  const e = /\s+/g;
  class t {
    constructor(C, W) {
      if (W = s(W), C instanceof t)
        return C.loose === !!W.loose && C.includePrerelease === !!W.includePrerelease ? C : new t(C.raw, W);
      if (C instanceof o)
        return this.raw = C.value, this.set = [[C]], this.formatted = void 0, this;
      if (this.options = W, this.loose = !!W.loose, this.includePrerelease = !!W.includePrerelease, this.raw = C.trim().replace(e, " "), this.set = this.raw.split("||").map((z) => this.parseRange(z.trim())).filter((z) => z.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const z = this.set[0];
        if (this.set = this.set.filter((P) => !m(P[0])), this.set.length === 0)
          this.set = [z];
        else if (this.set.length > 1) {
          for (const P of this.set)
            if (P.length === 1 && E(P[0])) {
              this.set = [P];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let C = 0; C < this.set.length; C++) {
          C > 0 && (this.formatted += "||");
          const W = this.set[C];
          for (let z = 0; z < W.length; z++)
            z > 0 && (this.formatted += " "), this.formatted += W[z].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(C) {
      C = C.replace(g, "");
      const z = ((this.options.includePrerelease && v) | (this.options.loose && _)) + ":" + C, P = n.get(z);
      if (P)
        return P;
      const p = this.options.loose, S = p ? l[u.HYPHENRANGELOOSE] : l[u.HYPHENRANGE];
      C = C.replace(S, B(this.options.includePrerelease)), a("hyphen replace", C), C = C.replace(l[u.COMPARATORTRIM], h), a("comparator trim", C), C = C.replace(l[u.TILDETRIM], w), a("tilde trim", C), C = C.replace(l[u.CARETTRIM], $), a("caret trim", C);
      let y = C.split(" ").map((j) => T(j, this.options)).join(" ").split(/\s+/).map((j) => Q(j, this.options));
      p && (y = y.filter((j) => (a("loose invalid filter", j, this.options), !!j.match(l[u.COMPARATORLOOSE])))), a("range list", y);
      const i = /* @__PURE__ */ new Map(), f = y.map((j) => new o(j, this.options));
      for (const j of f) {
        if (m(j))
          return [j];
        i.set(j.value, j);
      }
      i.size > 1 && i.has("") && i.delete("");
      const b = [...i.values()];
      return n.set(z, b), b;
    }
    intersects(C, W) {
      if (!(C instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((z) => R(z, W) && C.set.some((P) => R(P, W) && z.every((p) => P.every((S) => p.intersects(S, W)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(C) {
      if (!C)
        return !1;
      if (typeof C == "string")
        try {
          C = new c(C, this.options);
        } catch {
          return !1;
        }
      for (let W = 0; W < this.set.length; W++)
        if (ue(this.set[W], C, this.options))
          return !0;
      return !1;
    }
  }
  xs = t;
  const r = vb, n = new r(), s = Pi, o = ks(), a = js, c = ze, {
    safeRe: l,
    src: d,
    t: u,
    comparatorTrimReplace: h,
    tildeTrimReplace: w,
    caretTrimReplace: $
  } = Tn, { FLAG_INCLUDE_PRERELEASE: v, FLAG_LOOSE: _ } = Rn, g = new RegExp(d[u.BUILD], "g"), m = (M) => M.value === "<0.0.0-0", E = (M) => M.value === "", R = (M, C) => {
    let W = !0;
    const z = M.slice();
    let P = z.pop();
    for (; W && z.length; )
      W = z.every((p) => P.intersects(p, C)), P = z.pop();
    return W;
  }, T = (M, C) => (M = M.replace(l[u.BUILD], ""), a("comp", M, C), M = le(M, C), a("caret", M), M = K(M, C), a("tildes", M), M = ye(M, C), a("xrange", M), M = J(M, C), a("stars", M), M), I = (M) => !M || M.toLowerCase() === "x" || M === "*", K = (M, C) => M.trim().split(/\s+/).map((W) => Y(W, C)).join(" "), Y = (M, C) => {
    const W = C.loose ? l[u.TILDELOOSE] : l[u.TILDE];
    return M.replace(W, (z, P, p, S, y) => {
      a("tilde", M, z, P, p, S, y);
      let i;
      return I(P) ? i = "" : I(p) ? i = `>=${P}.0.0 <${+P + 1}.0.0-0` : I(S) ? i = `>=${P}.${p}.0 <${P}.${+p + 1}.0-0` : y ? (a("replaceTilde pr", y), i = `>=${P}.${p}.${S}-${y} <${P}.${+p + 1}.0-0`) : i = `>=${P}.${p}.${S} <${P}.${+p + 1}.0-0`, a("tilde return", i), i;
    });
  }, le = (M, C) => M.trim().split(/\s+/).map((W) => he(W, C)).join(" "), he = (M, C) => {
    a("caret", M, C);
    const W = C.loose ? l[u.CARETLOOSE] : l[u.CARET], z = C.includePrerelease ? "-0" : "";
    return M.replace(W, (P, p, S, y, i) => {
      a("caret", M, P, p, S, y, i);
      let f;
      return I(p) ? f = "" : I(S) ? f = `>=${p}.0.0${z} <${+p + 1}.0.0-0` : I(y) ? p === "0" ? f = `>=${p}.${S}.0${z} <${p}.${+S + 1}.0-0` : f = `>=${p}.${S}.0${z} <${+p + 1}.0.0-0` : i ? (a("replaceCaret pr", i), p === "0" ? S === "0" ? f = `>=${p}.${S}.${y}-${i} <${p}.${S}.${+y + 1}-0` : f = `>=${p}.${S}.${y}-${i} <${p}.${+S + 1}.0-0` : f = `>=${p}.${S}.${y}-${i} <${+p + 1}.0.0-0`) : (a("no pr"), p === "0" ? S === "0" ? f = `>=${p}.${S}.${y}${z} <${p}.${S}.${+y + 1}-0` : f = `>=${p}.${S}.${y}${z} <${p}.${+S + 1}.0-0` : f = `>=${p}.${S}.${y} <${+p + 1}.0.0-0`), a("caret return", f), f;
    });
  }, ye = (M, C) => (a("replaceXRanges", M, C), M.split(/\s+/).map((W) => q(W, C)).join(" ")), q = (M, C) => {
    M = M.trim();
    const W = C.loose ? l[u.XRANGELOOSE] : l[u.XRANGE];
    return M.replace(W, (z, P, p, S, y, i) => {
      a("xRange", M, z, P, p, S, y, i);
      const f = I(p), b = f || I(S), j = b || I(y), A = j;
      return P === "=" && A && (P = ""), i = C.includePrerelease ? "-0" : "", f ? P === ">" || P === "<" ? z = "<0.0.0-0" : z = "*" : P && A ? (b && (S = 0), y = 0, P === ">" ? (P = ">=", b ? (p = +p + 1, S = 0, y = 0) : (S = +S + 1, y = 0)) : P === "<=" && (P = "<", b ? p = +p + 1 : S = +S + 1), P === "<" && (i = "-0"), z = `${P + p}.${S}.${y}${i}`) : b ? z = `>=${p}.0.0${i} <${+p + 1}.0.0-0` : j && (z = `>=${p}.${S}.0${i} <${p}.${+S + 1}.0-0`), a("xRange return", z), z;
    });
  }, J = (M, C) => (a("replaceStars", M, C), M.trim().replace(l[u.STAR], "")), Q = (M, C) => (a("replaceGTE0", M, C), M.trim().replace(l[C.includePrerelease ? u.GTE0PRE : u.GTE0], "")), B = (M) => (C, W, z, P, p, S, y, i, f, b, j, A) => (I(z) ? W = "" : I(P) ? W = `>=${z}.0.0${M ? "-0" : ""}` : I(p) ? W = `>=${z}.${P}.0${M ? "-0" : ""}` : S ? W = `>=${W}` : W = `>=${W}${M ? "-0" : ""}`, I(f) ? i = "" : I(b) ? i = `<${+f + 1}.0.0-0` : I(j) ? i = `<${f}.${+b + 1}.0-0` : A ? i = `<=${f}.${b}.${j}-${A}` : M ? i = `<${f}.${b}.${+j + 1}-0` : i = `<=${i}`, `${W} ${i}`.trim()), ue = (M, C, W) => {
    for (let z = 0; z < M.length; z++)
      if (!M[z].test(C))
        return !1;
    if (C.prerelease.length && !W.includePrerelease) {
      for (let z = 0; z < M.length; z++)
        if (a(M[z].semver), M[z].semver !== o.ANY && M[z].semver.prerelease.length > 0) {
          const P = M[z].semver;
          if (P.major === C.major && P.minor === C.minor && P.patch === C.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return xs;
}
var eo, Xc;
function ks() {
  if (Xc) return eo;
  Xc = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(u, h) {
      if (h = r(h), u instanceof t) {
        if (u.loose === !!h.loose)
          return u;
        u = u.value;
      }
      u = u.trim().split(/\s+/).join(" "), a("comparator", u, h), this.options = h, this.loose = !!h.loose, this.parse(u), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(u) {
      const h = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], w = u.match(h);
      if (!w)
        throw new TypeError(`Invalid comparator: ${u}`);
      this.operator = w[1] !== void 0 ? w[1] : "", this.operator === "=" && (this.operator = ""), w[2] ? this.semver = new c(w[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(u) {
      if (a("Comparator.test", u, this.options.loose), this.semver === e || u === e)
        return !0;
      if (typeof u == "string")
        try {
          u = new c(u, this.options);
        } catch {
          return !1;
        }
      return o(u, this.operator, this.semver, this.options);
    }
    intersects(u, h) {
      if (!(u instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new l(u.value, h).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new l(this.value, h).test(u.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || o(this.semver, "<", u.semver, h) && this.operator.startsWith(">") && u.operator.startsWith("<") || o(this.semver, ">", u.semver, h) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  eo = t;
  const r = Pi, { safeRe: n, t: s } = Tn, o = ld, a = js, c = ze, l = ht();
  return eo;
}
const wb = ht(), Eb = (e, t, r) => {
  try {
    t = new wb(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Cs = Eb;
const bb = ht(), Sb = (e, t) => new bb(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var Pb = Sb;
const Nb = ze, Rb = ht(), Tb = (e, t, r) => {
  let n = null, s = null, o = null;
  try {
    o = new Rb(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || s.compare(a) === -1) && (n = a, s = new Nb(n, r));
  }), n;
};
var Ob = Tb;
const Ib = ze, jb = ht(), Ab = (e, t, r) => {
  let n = null, s = null, o = null;
  try {
    o = new jb(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || s.compare(a) === 1) && (n = a, s = new Ib(n, r));
  }), n;
};
var kb = Ab;
const to = ze, Cb = ht(), Jc = As, Db = (e, t) => {
  e = new Cb(e, t);
  let r = new to("0.0.0");
  if (e.test(r) || (r = new to("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let o = null;
    s.forEach((a) => {
      const c = new to(a.semver.version);
      switch (a.operator) {
        case ">":
          c.prerelease.length === 0 ? c.patch++ : c.prerelease.push(0), c.raw = c.format();
        case "":
        case ">=":
          (!o || Jc(c, o)) && (o = c);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!r || Jc(r, o)) && (r = o);
  }
  return r && e.test(r) ? r : null;
};
var Mb = Db;
const Lb = ht(), Vb = (e, t) => {
  try {
    return new Lb(e, t).range || "*";
  } catch {
    return null;
  }
};
var Fb = Vb;
const zb = ze, ud = ks(), { ANY: Ub } = ud, qb = ht(), Kb = Cs, Yc = As, Qc = Ri, Gb = Oi, Hb = Ti, Bb = (e, t, r, n) => {
  e = new zb(e, n), t = new qb(t, n);
  let s, o, a, c, l;
  switch (r) {
    case ">":
      s = Yc, o = Gb, a = Qc, c = ">", l = ">=";
      break;
    case "<":
      s = Qc, o = Hb, a = Yc, c = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (Kb(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const u = t.set[d];
    let h = null, w = null;
    if (u.forEach(($) => {
      $.semver === Ub && ($ = new ud(">=0.0.0")), h = h || $, w = w || $, s($.semver, h.semver, n) ? h = $ : a($.semver, w.semver, n) && (w = $);
    }), h.operator === c || h.operator === l || (!w.operator || w.operator === c) && o(e, w.semver))
      return !1;
    if (w.operator === l && a(e, w.semver))
      return !1;
  }
  return !0;
};
var Ii = Bb;
const Wb = Ii, Xb = (e, t, r) => Wb(e, t, ">", r);
var Jb = Xb;
const Yb = Ii, Qb = (e, t, r) => Yb(e, t, "<", r);
var Zb = Qb;
const Zc = ht(), xb = (e, t, r) => (e = new Zc(e, r), t = new Zc(t, r), e.intersects(t, r));
var eS = xb;
const tS = Cs, rS = ft;
var nS = (e, t, r) => {
  const n = [];
  let s = null, o = null;
  const a = e.sort((u, h) => rS(u, h, r));
  for (const u of a)
    tS(u, t, r) ? (o = u, s || (s = u)) : (o && n.push([s, o]), o = null, s = null);
  s && n.push([s, null]);
  const c = [];
  for (const [u, h] of n)
    u === h ? c.push(u) : !h && u === a[0] ? c.push("*") : h ? u === a[0] ? c.push(`<=${h}`) : c.push(`${u} - ${h}`) : c.push(`>=${u}`);
  const l = c.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < d.length ? l : t;
};
const xc = ht(), ji = ks(), { ANY: ro } = ji, no = Cs, Ai = ft, sS = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new xc(e, r), t = new xc(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const o of t.set) {
      const a = aS(s, o, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, oS = [new ji(">=0.0.0-0")], el = [new ji(">=0.0.0")], aS = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === ro) {
    if (t.length === 1 && t[0].semver === ro)
      return !0;
    r.includePrerelease ? e = oS : e = el;
  }
  if (t.length === 1 && t[0].semver === ro) {
    if (r.includePrerelease)
      return !0;
    t = el;
  }
  const n = /* @__PURE__ */ new Set();
  let s, o;
  for (const $ of e)
    $.operator === ">" || $.operator === ">=" ? s = tl(s, $, r) : $.operator === "<" || $.operator === "<=" ? o = rl(o, $, r) : n.add($.semver);
  if (n.size > 1)
    return null;
  let a;
  if (s && o) {
    if (a = Ai(s.semver, o.semver, r), a > 0)
      return null;
    if (a === 0 && (s.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const $ of n) {
    if (s && !no($, String(s), r) || o && !no($, String(o), r))
      return null;
    for (const v of t)
      if (!no($, String(v), r))
        return !1;
    return !0;
  }
  let c, l, d, u, h = o && !r.includePrerelease && o.semver.prerelease.length ? o.semver : !1, w = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && o.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const $ of t) {
    if (u = u || $.operator === ">" || $.operator === ">=", d = d || $.operator === "<" || $.operator === "<=", s) {
      if (w && $.semver.prerelease && $.semver.prerelease.length && $.semver.major === w.major && $.semver.minor === w.minor && $.semver.patch === w.patch && (w = !1), $.operator === ">" || $.operator === ">=") {
        if (c = tl(s, $, r), c === $ && c !== s)
          return !1;
      } else if (s.operator === ">=" && !$.test(s.semver))
        return !1;
    }
    if (o) {
      if (h && $.semver.prerelease && $.semver.prerelease.length && $.semver.major === h.major && $.semver.minor === h.minor && $.semver.patch === h.patch && (h = !1), $.operator === "<" || $.operator === "<=") {
        if (l = rl(o, $, r), l === $ && l !== o)
          return !1;
      } else if (o.operator === "<=" && !$.test(o.semver))
        return !1;
    }
    if (!$.operator && (o || s) && a !== 0)
      return !1;
  }
  return !(s && d && !o && a !== 0 || o && u && !s && a !== 0 || w || h);
}, tl = (e, t, r) => {
  if (!e)
    return t;
  const n = Ai(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, rl = (e, t, r) => {
  if (!e)
    return t;
  const n = Ai(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var iS = sS;
const so = Tn, nl = Rn, cS = ze, sl = ad, lS = yr, uS = cE, dS = dE, fS = hE, hS = pE, mS = gE, pS = wE, $S = SE, yS = RE, gS = ft, _S = jE, vS = CE, wS = Ni, ES = VE, bS = UE, SS = As, PS = Ri, NS = id, RS = cd, TS = Ti, OS = Oi, IS = ld, jS = ub, AS = gb, kS = ks(), CS = ht(), DS = Cs, MS = Pb, LS = Ob, VS = kb, FS = Mb, zS = Fb, US = Ii, qS = Jb, KS = Zb, GS = eS, HS = nS, BS = iS;
var WS = {
  parse: lS,
  valid: uS,
  clean: dS,
  inc: fS,
  diff: hS,
  major: mS,
  minor: pS,
  patch: $S,
  prerelease: yS,
  compare: gS,
  rcompare: _S,
  compareLoose: vS,
  compareBuild: wS,
  sort: ES,
  rsort: bS,
  gt: SS,
  lt: PS,
  eq: NS,
  neq: RS,
  gte: TS,
  lte: OS,
  cmp: IS,
  coerce: jS,
  truncate: AS,
  Comparator: kS,
  Range: CS,
  satisfies: DS,
  toComparators: MS,
  maxSatisfying: LS,
  minSatisfying: VS,
  minVersion: FS,
  validRange: zS,
  outside: US,
  gtr: qS,
  ltr: KS,
  intersects: GS,
  simplifyRange: HS,
  subset: BS,
  SemVer: cS,
  re: so.re,
  src: so.src,
  tokens: so.t,
  SEMVER_SPEC_VERSION: nl.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: nl.RELEASE_TYPES,
  compareIdentifiers: sl.compareIdentifiers,
  rcompareIdentifiers: sl.rcompareIdentifiers
};
const Er = /* @__PURE__ */ Pl(WS), XS = Object.prototype.toString, JS = "[object Uint8Array]", YS = "[object ArrayBuffer]";
function dd(e, t, r) {
  return e ? e.constructor === t ? !0 : XS.call(e) === r : !1;
}
function fd(e) {
  return dd(e, Uint8Array, JS);
}
function QS(e) {
  return dd(e, ArrayBuffer, YS);
}
function ZS(e) {
  return fd(e) || QS(e);
}
function xS(e) {
  if (!fd(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function e1(e) {
  if (!ZS(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function oo(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, o) => s + o.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    xS(s), r.set(s, n), n += s.length;
  return r;
}
const Wn = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Xn(e, t = "utf8") {
  return e1(e), Wn[t] ?? (Wn[t] = new globalThis.TextDecoder(t)), Wn[t].decode(e);
}
function t1(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const r1 = new globalThis.TextEncoder();
function ao(e) {
  return t1(e), r1.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const ol = "aes-256-cbc", hd = /* @__PURE__ */ new Set([
  "aes-256-cbc",
  "aes-256-gcm",
  "aes-256-ctr"
]), n1 = (e) => typeof e == "string" && hd.has(e), Rt = () => /* @__PURE__ */ Object.create(null), al = (e) => e !== void 0, io = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, qt = "__internal__", co = `${qt}.migrations.version`;
var Gt, Ht, lr, Be, Ze, ur, dr, Lr, yt, Re, md, pd, $d, yd, gd, _d, vd, wd;
class s1 {
  constructor(t = {}) {
    rt(this, Re);
    Zr(this, "path");
    Zr(this, "events");
    rt(this, Gt);
    rt(this, Ht);
    rt(this, lr);
    rt(this, Be);
    rt(this, Ze, {});
    rt(this, ur, !1);
    rt(this, dr);
    rt(this, Lr);
    rt(this, yt);
    Zr(this, "_deserialize", (t) => JSON.parse(t));
    Zr(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = bt(this, Re, md).call(this, t);
    He(this, Be, r), bt(this, Re, pd).call(this, r), bt(this, Re, yd).call(this, r), bt(this, Re, gd).call(this, r), this.events = new EventTarget(), He(this, Ht, r.encryptionKey), He(this, lr, r.encryptionAlgorithm ?? ol), this.path = bt(this, Re, _d).call(this, r), bt(this, Re, vd).call(this, r), r.watch && this._watch();
  }
  get(t, r) {
    if (ee(this, Be).accessPropertiesByDotNotation)
      return this._get(t, r);
    const { store: n } = this;
    return t in n ? n[t] : r;
  }
  set(t, r) {
    if (typeof t != "string" && typeof t != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof t}`);
    if (typeof t != "object" && r === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(t))
      throw new TypeError(`Please don't use the ${qt} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (o, a) => {
      if (io(o, a), ee(this, Be).accessPropertiesByDotNotation)
        On(n, o, a);
      else {
        if (o === "__proto__" || o === "constructor" || o === "prototype")
          return;
        n[o] = a;
      }
    };
    if (typeof t == "object") {
      const o = t;
      for (const [a, c] of Object.entries(o))
        s(a, c);
    } else
      s(t, r);
    this.store = n;
  }
  has(t) {
    return ee(this, Be).accessPropertiesByDotNotation ? zs(this.store, t) : t in this.store;
  }
  appendToArray(t, r) {
    io(t, r);
    const n = ee(this, Be).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
    if (!Array.isArray(n))
      throw new TypeError(`The key \`${t}\` is already set to a non-array value`);
    this.set(t, [...n, r]);
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      al(ee(this, Ze)[r]) && this.set(r, ee(this, Ze)[r]);
  }
  delete(t) {
    const { store: r } = this;
    ee(this, Be).accessPropertiesByDotNotation ? Kd(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = Rt();
    for (const r of Object.keys(ee(this, Ze)))
      al(ee(this, Ze)[r]) && (io(r, ee(this, Ze)[r]), ee(this, Be).accessPropertiesByDotNotation ? On(t, r, ee(this, Ze)[r]) : t[r] = ee(this, Ze)[r]);
    this.store = t;
  }
  onDidChange(t, r) {
    if (typeof t != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof t}`);
    if (typeof r != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof r}`);
    return this._handleValueChange(() => this.get(t), r);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(t) {
    if (typeof t != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof t}`);
    return this._handleStoreChange(t);
  }
  get size() {
    return Object.keys(this.store).filter((r) => !this._isReservedKeyPath(r)).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    var t;
    try {
      const r = te.readFileSync(this.path, ee(this, Ht) ? null : "utf8"), n = this._decryptData(r);
      return ((o) => {
        const a = this._deserialize(o);
        return ee(this, ur) || this._validate(a), Object.assign(Rt(), a);
      })(n);
    } catch (r) {
      if ((r == null ? void 0 : r.code) === "ENOENT")
        return this._ensureDirectory(), Rt();
      if (ee(this, Be).clearInvalidConfig) {
        const n = r;
        if (n.name === "SyntaxError" || (t = n.message) != null && t.startsWith("Config schema violation:") || n.message === "Failed to decrypt config data.")
          return Rt();
      }
      throw r;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !zs(t, qt))
      try {
        const r = te.readFileSync(this.path, ee(this, Ht) ? null : "utf8"), n = this._decryptData(r), s = this._deserialize(n);
        zs(s, qt) && On(t, qt, Vi(s, qt));
      } catch {
      }
    ee(this, ur) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, r]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    ee(this, dr) && (ee(this, dr).close(), He(this, dr, void 0)), ee(this, Lr) && (te.unwatchFile(this.path), He(this, Lr, !1)), He(this, yt, void 0);
  }
  _decryptData(t) {
    const r = ee(this, Ht);
    if (!r)
      return typeof t == "string" ? t : Xn(t);
    const n = ee(this, lr), s = n === "aes-256-gcm" ? 16 : 0, o = ":".codePointAt(0), a = typeof t == "string" ? t.codePointAt(16) : t[16];
    if (!(o !== void 0 && a === o)) {
      if (n === "aes-256-cbc")
        return typeof t == "string" ? t : Xn(t);
      throw new Error("Failed to decrypt config data.");
    }
    const l = ($) => {
      if (s === 0)
        return { ciphertext: $ };
      const v = $.length - s;
      if (v < 0)
        throw new Error("Invalid authentication tag length.");
      return {
        ciphertext: $.slice(0, v),
        authenticationTag: $.slice(v)
      };
    }, d = t.slice(0, 16), u = t.slice(17), h = typeof u == "string" ? ao(u) : u, w = ($) => {
      const { ciphertext: v, authenticationTag: _ } = l(h), g = xr.pbkdf2Sync(r, $, 1e4, 32, "sha512"), m = xr.createDecipheriv(n, g, d);
      return _ && m.setAuthTag(_), Xn(oo([m.update(v), m.final()]));
    };
    try {
      return w(d);
    } catch {
      try {
        return w(d.toString());
      } catch {
      }
    }
    if (n === "aes-256-cbc")
      return typeof t == "string" ? t : Xn(t);
    throw new Error("Failed to decrypt config data.");
  }
  _handleStoreChange(t) {
    let r = this.store;
    const n = () => {
      const s = r, o = this.store;
      Mi(o, s) || (r = o, t.call(this, o, s));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(t, r) {
    let n = t();
    const s = () => {
      const o = n, a = t();
      Mi(a, o) || (n = a, r.call(this, a, o));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(t) {
    if (!ee(this, Gt) || ee(this, Gt).call(this, t) || !ee(this, Gt).errors)
      return;
    const n = ee(this, Gt).errors.map(({ instancePath: s, message: o = "" }) => `\`${s.slice(1)}\` ${o}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    te.mkdirSync(re.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    const n = ee(this, Ht);
    if (n) {
      const s = xr.randomBytes(16), o = xr.pbkdf2Sync(n, s, 1e4, 32, "sha512"), a = xr.createCipheriv(ee(this, lr), o, s), c = oo([a.update(ao(r)), a.final()]), l = [s, ao(":"), c];
      ee(this, lr) === "aes-256-gcm" && l.push(a.getAuthTag()), r = oo(l);
    }
    if ($e.env.SNAP)
      te.writeFileSync(this.path, r, { mode: ee(this, Be).configFileMode });
    else
      try {
        Sl(this.path, r, { mode: ee(this, Be).configFileMode });
      } catch (s) {
        if ((s == null ? void 0 : s.code) === "EXDEV") {
          te.writeFileSync(this.path, r, { mode: ee(this, Be).configFileMode });
          return;
        }
        throw s;
      }
  }
  _watch() {
    if (this._ensureDirectory(), te.existsSync(this.path) || this._write(Rt()), $e.platform === "win32" || $e.platform === "darwin") {
      ee(this, yt) ?? He(this, yt, Fc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = re.dirname(this.path), r = re.basename(this.path);
      He(this, dr, te.watch(t, { persistent: !1, encoding: "utf8" }, (n, s) => {
        s && s !== r || typeof ee(this, yt) == "function" && ee(this, yt).call(this);
      }));
    } else
      ee(this, yt) ?? He(this, yt, Fc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), te.watchFile(this.path, { persistent: !1 }, (t, r) => {
        typeof ee(this, yt) == "function" && ee(this, yt).call(this);
      }), He(this, Lr, !0);
  }
  _migrate(t, r, n) {
    let s = this._get(co, "0.0.0");
    const o = Object.keys(t).filter((c) => this._shouldPerformMigration(c, s, r));
    let a = structuredClone(this.store);
    for (const c of o)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: c,
          finalVersion: r,
          versions: o
        });
        const l = t[c];
        l == null || l(this), this._set(co, c), s = c, a = structuredClone(this.store);
      } catch (l) {
        this.store = a;
        const d = l instanceof Error ? l.message : String(l);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${d}`);
      }
    (this._isVersionInRangeFormat(s) || !Er.eq(s, r)) && this._set(co, r);
  }
  _containsReservedKey(t) {
    return typeof t == "string" ? this._isReservedKeyPath(t) : !t || typeof t != "object" ? !1 : this._objectContainsReservedKey(t);
  }
  _objectContainsReservedKey(t) {
    if (!t || typeof t != "object")
      return !1;
    for (const [r, n] of Object.entries(t))
      if (this._isReservedKeyPath(r) || this._objectContainsReservedKey(n))
        return !0;
    return !1;
  }
  _isReservedKeyPath(t) {
    return t === qt || t.startsWith(`${qt}.`);
  }
  _isVersionInRangeFormat(t) {
    return Er.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && Er.satisfies(r, t) ? !1 : Er.satisfies(n, t) : !(Er.lte(t, r) || Er.gt(t, n));
  }
  _get(t, r) {
    return Vi(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    On(n, t, r), this.store = n;
  }
}
Gt = new WeakMap(), Ht = new WeakMap(), lr = new WeakMap(), Be = new WeakMap(), Ze = new WeakMap(), ur = new WeakMap(), dr = new WeakMap(), Lr = new WeakMap(), yt = new WeakMap(), Re = new WeakSet(), md = function(t) {
  const r = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (r.encryptionAlgorithm ?? (r.encryptionAlgorithm = ol), !n1(r.encryptionAlgorithm))
    throw new TypeError(`The \`encryptionAlgorithm\` option must be one of: ${[...hd].join(", ")}`);
  if (!r.cwd) {
    if (!r.projectName)
      throw new Error("Please specify the `projectName` option.");
    r.cwd = Wd(r.projectName, { suffix: r.projectSuffix }).config;
  }
  return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
}, pd = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const r = Vw.default, n = new S0.Ajv2020({
    allErrors: !0,
    useDefaults: !0,
    ...t.ajvOptions
  });
  r(n);
  const s = {
    ...t.rootSchema,
    type: "object",
    properties: t.schema
  };
  He(this, Gt, n.compile(s)), bt(this, Re, $d).call(this, t.schema);
}, $d = function(t) {
  const r = Object.entries(t ?? {});
  for (const [n, s] of r) {
    if (!s || typeof s != "object" || !Object.hasOwn(s, "default"))
      continue;
    const { default: o } = s;
    o !== void 0 && (ee(this, Ze)[n] = o);
  }
}, yd = function(t) {
  t.defaults && Object.assign(ee(this, Ze), t.defaults);
}, gd = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, _d = function(t) {
  const r = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = r ? `.${r}` : "";
  return re.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
}, vd = function(t) {
  if (t.migrations) {
    bt(this, Re, wd).call(this, t), this._validate(this.store);
    return;
  }
  const r = this.store, n = Object.assign(Rt(), t.defaults ?? {}, r);
  this._validate(n);
  try {
    Li.deepEqual(r, n);
  } catch {
    this.store = n;
  }
}, wd = function(t) {
  const { migrations: r, projectVersion: n } = t;
  if (r) {
    if (!n)
      throw new Error("Please specify the `projectVersion` option.");
    He(this, ur, !0);
    try {
      const s = this.store, o = Object.assign(Rt(), t.defaults ?? {}, s);
      try {
        Li.deepEqual(s, o);
      } catch {
        this._write(o);
      }
      this._migrate(r, n, t.beforeEachMigration);
    } finally {
      He(this, ur, !1);
    }
  }
};
const { app: ss, ipcMain: Ao, shell: o1 } = gl;
let il = !1;
const cl = () => {
  if (!Ao || !ss)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: ss.getPath("userData"),
    appVersion: ss.getVersion()
  };
  return il || (Ao.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), il = !0), e;
};
class a1 extends s1 {
  constructor(t) {
    let r, n;
    if ($e.type === "renderer") {
      const s = gl.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else Ao && ss && ({ defaultCwd: r, appVersion: n } = cl());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = re.isAbsolute(t.cwd) ? t.cwd : re.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    cl();
  }
  async openInEditor() {
    const t = await o1.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const Ed = re.dirname(Vd(import.meta.url));
process.env.APP_ROOT = re.join(Ed, "../..");
const V1 = re.join(process.env.APP_ROOT, "dist-electron"), bd = re.join(process.env.APP_ROOT, "dist"), vn = process.env.VITE_DEV_SERVER_URL;
process.env.VITE_PUBLIC = vn ? re.join(process.env.APP_ROOT, "public") : bd;
Co.release().startsWith("6.1") && Fe.disableHardwareAcceleration();
process.platform === "win32" && Fe.setAppUserModelId(Fe.getName());
Fe.requestSingleInstanceLock() || (Fe.quit(), process.exit(0));
const lo = 530, uo = 620, Sd = 32, i1 = 500, Pd = 5e3, c1 = 1e3, Tt = {
  fontFamily: "system",
  fontSize: 14,
  accentColor: "#2f7cff",
  textColor: "#17334d",
  glassTint: "#ffffff",
  motto: "把今天的行动，放进长期的节奏里"
};
function Ds(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Ot(e, t) {
  return typeof e == "string" ? e.trim().slice(0, t) : "";
}
function ms(e, t = (/* @__PURE__ */ new Date()).toISOString()) {
  if (typeof e != "string") return t;
  const r = new Date(e);
  return Number.isNaN(r.getTime()) ? t : r.toISOString();
}
function ll(e) {
  if (typeof e != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(e)) return "";
  const t = /* @__PURE__ */ new Date(`${e}T00:00:00`);
  return Number.isNaN(t.getTime()) ? "" : e;
}
function Nd(e) {
  return typeof e == "string" && /^\d{8}$/.test(e) ? e : "";
}
function fo(e, t) {
  return typeof e == "string" && /^#[0-9a-fA-F]{6}$/.test(e) ? e.toLowerCase() : t;
}
function ul(e) {
  if (!Ds(e)) return { ...Tt };
  const t = ["system", "rounded", "serif", "mono"].includes(String(e.fontFamily)) ? e.fontFamily : Tt.fontFamily, r = typeof e.fontSize == "number" && Number.isFinite(e.fontSize) ? e.fontSize : Tt.fontSize, n = fo(e.glassTint, Tt.glassTint);
  return {
    fontFamily: t,
    fontSize: Math.max(12, Math.min(18, Math.round(r))),
    accentColor: fo(e.accentColor, Tt.accentColor),
    textColor: fo(e.textColor, Tt.textColor),
    glassTint: n === "#bfeeff" ? Tt.glassTint : n,
    motto: Ot(e.motto, 120) || Tt.motto
  };
}
function dl(e) {
  return Array.isArray(e) ? e.slice(0, i1).flatMap((t) => {
    if (!Ds(t)) return [];
    const r = Ot(t.id, 128), n = Ot(t.name, 160), s = Nd(t.planDate);
    return !r || !n || !s ? [] : [{ id: r, name: n, planDate: s, createdAt: ms(t.createdAt) }];
  }) : [];
}
function fl(e) {
  return Array.isArray(e) ? e.slice(0, Pd).flatMap((t) => {
    if (!Ds(t)) return [];
    const r = Ot(t.id, 128), n = Ot(t.title, 240), s = Ot(t.planId, 128), o = Nd(t.planDate), a = Number(t.priority);
    if (!r || !n || !s || !o || ![1, 2, 3, 4].includes(a)) return [];
    const c = t.longTaskId == null ? null : Ot(t.longTaskId, 128) || null;
    return [{
      id: r,
      title: n,
      planId: s,
      planDate: o,
      longTaskId: c,
      priority: a,
      dueAt: ms(t.dueAt),
      completed: t.completed === !0,
      createdAt: ms(t.createdAt)
    }];
  }) : [];
}
function hl(e) {
  return Array.isArray(e) ? e.slice(0, c1).flatMap((t) => {
    if (!Ds(t)) return [];
    const r = Ot(t.id, 128), n = Ot(t.name, 240), s = ll(t.start), o = ll(t.end);
    if (!r || !n || !s || !o) return [];
    const a = typeof t.progress == "number" && Number.isFinite(t.progress) ? t.progress : 0, c = t.progressMode === "manual" || t.progressMode === "time" ? t.progressMode : "linked";
    return [{
      id: r,
      name: n,
      start: s,
      end: o < s ? s : o,
      progress: Math.max(0, Math.min(100, a)),
      progressMode: c,
      completed: t.completed === !0,
      delayedAt: t.delayedAt == null ? null : ms(t.delayedAt, "")
    }];
  }) : [];
}
const l1 = new a1({
  name: "planner-data",
  defaults: {
    shortPlans: [],
    shortTasks: [],
    longTasks: [],
    notifiedTaskIds: [],
    preferences: Tt
  }
}), qe = l1;
let L = null, ut = null, pt = null, yn = null, ge = null, ki = 0, Ms = !1, ml = "top-right", Or = null, Ir = null, jr = null, ps = !1;
const Rd = re.join(Ed, "../preload/index.mjs"), Td = re.join(bd, "index.html");
function u1(e, t, r) {
  const n = Math.max(0, Math.min(r, Math.floor(Math.min(e, t) / 2))), s = [];
  let o = 0, a = -1;
  for (let c = 0; c < t; c += 1) {
    const l = c < n ? n - c - 0.5 : c >= t - n ? c - (t - n) + 0.5 : 0, d = l > 0 ? Math.ceil(n - Math.sqrt(Math.max(0, n * n - l * l))) : 0;
    a !== -1 && d !== a && (s.push({ x: a, y: o, width: e - a * 2, height: c - o }), o = c), a = d;
  }
  return s.push({ x: a, y: o, width: e - a * 2, height: t - o }), s.filter((c) => c.width > 0 && c.height > 0);
}
function pl(e) {
  if (process.platform !== "win32" || e.isDestroyed()) return;
  const { width: t, height: r } = e.getContentBounds();
  e.setShape(u1(t, r, Sd));
}
function Od(e) {
  return Jt.dipToScreenRect(e, e.getBounds());
}
function Id() {
  ge == null || ge.destroy(), ge = null, ki = 0;
}
function $s(e) {
  if (!(ge || e.isDestroyed())) {
    try {
      if (process.platform === "win32" && ho.isSupported()) {
        const t = Od(e), r = Jt.getDisplayMatching(e.getBounds()).scaleFactor;
        e.setContentProtection(!0), ge = ho.createPanel({
          ...t,
          dpr: r,
          cornerRadius: Sd * r,
          blurSigma: 0.35 * r,
          displacementScale: 72 * r,
          aberrationIntensity: 0.35,
          saturation: 1,
          excludeFromCapture: !0,
          anchorWindow: e
        }), ki = ge ? r : 0;
      }
    } catch {
      ge = null;
    }
    !ge && process.platform === "win32" && (e.setContentProtection(!1), e.setBackgroundMaterial("acrylic"));
  }
}
function os(e = L) {
  if (!e || e.isDestroyed()) return;
  if (!ge) {
    $s(e);
    return;
  }
  const t = Jt.getDisplayMatching(e.getBounds()).scaleFactor;
  if (Math.abs(t - ki) > 0.01) {
    Id(), $s(e);
    return;
  }
  ge.setBounds(Od(e)), ge.anchor(e);
}
function d1(e, t) {
  const { workArea: r } = Jt.getDisplayMatching(e.getBounds()), n = 0, s = e.getBounds(), o = r.x + n, a = r.x + r.width - s.width - n, c = r.y + n, l = r.y + r.height - s.height - n;
  return {
    x: t.endsWith("right") ? a : o,
    y: t.startsWith("bottom") ? l : c
  };
}
function Mr(e, t = ml) {
  const r = d1(e, t), n = Math.round(r.x), s = Math.round(r.y), o = e.getBounds();
  ml = t, !(Math.abs(o.x - n) <= 1 && Math.abs(o.y - s) <= 1) && (jr && clearTimeout(jr), ps = !0, e.setPosition(n, s, !1), jr = setTimeout(() => {
    ps = !1, jr = null;
  }, 160));
}
function f1(e) {
  const t = e.getBounds(), { workArea: r } = Jt.getDisplayMatching(t), n = t.x + t.width / 2, s = t.y + t.height / 2, o = n < r.x + r.width / 2 ? "left" : "right";
  return `${s < r.y + r.height / 2 ? "top" : "bottom"}-${o}`;
}
function h1(e) {
  ps || (Or && clearTimeout(Or), Or = setTimeout(() => {
    Or = null, e.isDestroyed() || Mr(e, f1(e));
  }, 520));
}
function m1(e) {
  const t = e.getNativeWindowHandle();
  return process.arch === "x64" ? t.readBigUInt64LE(0).toString() : t.readUInt32LE(0).toString();
}
function p1() {
  const e = "zorder-helper.exe";
  return Fe.isPackaged ? re.join(process.resourcesPath, e) : re.join(process.env.APP_ROOT, "build", e);
}
function $1(e = L) {
  if (!e || e.isDestroyed() || (e.setAlwaysOnTop(!1), e.setSkipTaskbar(!0), process.platform !== "win32") || !e.isVisible()) return;
  const t = p1();
  if (!Fd(t)) return;
  const r = m1(e);
  zd(t, [r], { windowsHide: !0, timeout: 1e3 }, () => {
    ge && e === L && ge.anchor(e);
  });
}
function cr(e = 80) {
  Ir && clearTimeout(Ir), Ir = setTimeout(() => {
    Ir = null, $1();
  }, e);
}
function wt(e = !1) {
  !L || L.isDestroyed() || (L.setSkipTaskbar(!0), L.setFocusable(!0), L.setIgnoreMouseEvents(!1), Mr(L), L.showInactive(), $s(L), os(L), ge == null || ge.show(e ? 120 : 60), L.setSkipTaskbar(!0), cr(e ? 260 : 40));
}
function $l() {
  !L || L.isDestroyed() || (wt(!1), cr(120));
}
function _t() {
  if (!ut) return;
  const e = !!(L && !L.isDestroyed() && L.isVisible()), t = Ld.buildFromTemplate([
    {
      label: e ? "隐藏窗口" : "显示窗口",
      click: () => {
        !L || L.isDestroyed() || (L.isVisible() ? L.hide() : wt(!0), _t());
      }
    },
    { type: "separator" },
    {
      label: "退出",
      click: () => {
        Ms = !0, Fe.quit();
      }
    }
  ]);
  ut.setToolTip("计划小组件"), ut.setContextMenu(t);
}
function y1() {
  if (ut) return;
  const e = re.join(process.env.VITE_PUBLIC, "favicon.ico"), t = Cd.createFromPath(e);
  ut = new Dd(t.isEmpty() ? e : t), ut.on("click", () => {
    !L || L.isDestroyed() || (L.isVisible() ? L.hide() : wt(!0), _t());
  }), ut.on("double-click", () => {
    !L || L.isDestroyed() || (wt(!0), _t());
  }), _t();
}
function g1() {
  if (pt && !pt.isDestroyed()) return;
  const { bounds: e } = Jt.getDisplayNearestPoint(Jt.getCursorScreenPoint());
  pt = new ko({
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height,
    frame: !1,
    transparent: !0,
    resizable: !1,
    skipTaskbar: !0,
    focusable: !1,
    alwaysOnTop: !0,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: Rd,
      contextIsolation: !0,
      nodeIntegration: !1,
      sandbox: !0
    }
  }), pt.setIgnoreMouseEvents(!0, { forward: !0 }), vn ? pt.loadURL(`${vn}#celebrate`) : pt.loadFile(Td, { hash: "celebrate" }), setTimeout(() => {
    pt && !pt.isDestroyed() && pt.close(), pt = null;
  }, 2200);
}
function yl() {
  if (!Di.isSupported()) return;
  const e = Date.now(), t = 5 * 60 * 1e3, r = qe.get("shortTasks"), n = new Set(qe.get("notifiedTaskIds"));
  for (const s of r) {
    if (s.completed) continue;
    const o = new Date(s.dueAt).getTime();
    if (Number.isNaN(o)) continue;
    const a = o - e;
    a >= 0 && a <= t && !n.has(s.id) && (new Di({
      title: "任务提醒",
      body: `${s.title} 将在 5 分钟内到期`,
      silent: !1
    }).show(), n.add(s.id));
  }
  qe.set("notifiedTaskIds", [...n]);
}
function _1() {
  yn && clearInterval(yn), yl(), yn = setInterval(yl, 60 * 1e3);
}
function v1() {
  process.platform === "win32" && Fe.isPackaged && Fe.setLoginItemSettings({
    openAtLogin: !0,
    openAsHidden: !0,
    path: process.execPath,
    args: ["--hidden"]
  });
}
function w1() {
  gr.handle("planner:get-data", () => ({
    shortPlans: dl(qe.get("shortPlans")),
    shortTasks: fl(qe.get("shortTasks")),
    longTasks: hl(qe.get("longTasks")),
    notifiedTaskIds: Array.isArray(qe.get("notifiedTaskIds")) ? qe.get("notifiedTaskIds").filter((e) => typeof e == "string").slice(0, Pd) : [],
    preferences: ul(qe.get("preferences"))
  })), gr.handle("planner:save-short-plans", (e, t) => {
    const r = dl(t);
    return qe.set("shortPlans", r), r;
  }), gr.handle("planner:save-short-tasks", (e, t) => {
    const r = fl(t);
    qe.set("shortTasks", r);
    const n = new Set(r.filter((o) => !o.completed).map((o) => o.id)), s = qe.get("notifiedTaskIds").filter((o) => n.has(o));
    return qe.set("notifiedTaskIds", s), r;
  }), gr.handle("planner:save-long-tasks", (e, t) => {
    const r = hl(t);
    return qe.set("longTasks", r), r;
  }), gr.handle("planner:save-preferences", (e, t) => {
    const r = ul(t);
    return qe.set("preferences", r), r;
  }), gr.on("planner:celebrate", () => {
    g1();
  });
}
async function jd() {
  const e = !process.argv.includes("--show");
  L = new ko({
    title: "计划小组件",
    width: lo,
    height: uo,
    minWidth: lo,
    minHeight: uo,
    maxWidth: lo,
    maxHeight: uo,
    useContentSize: !0,
    show: !1,
    frame: !1,
    transparent: !0,
    skipTaskbar: !0,
    resizable: !1,
    maximizable: !1,
    fullscreenable: !1,
    focusable: !0,
    alwaysOnTop: !1,
    hasShadow: !1,
    backgroundColor: "#00000000",
    backgroundMaterial: "none",
    icon: re.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload: Rd,
      contextIsolation: !0,
      nodeIntegration: !1,
      sandbox: !0
    }
  }), L.setSkipTaskbar(!0), pl(L), L.webContents.setZoomFactor(1), L.webContents.setVisualZoomLevelLimits(1, 1), Mr(L), vn ? L.loadURL(vn) : L.loadFile(Td), L.once("ready-to-show", () => {
    e ? _t() : (wt(!0), $l());
  }), setTimeout(() => {
    L && !L.isDestroyed() && !e && (wt(!0), $l());
  }, 1200), L.webContents.on("did-finish-load", () => {
    L == null || L.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString()), e || wt(!0), _t();
  }), L.on("show", () => {
    L && (L.setAlwaysOnTop(!1), L.setSkipTaskbar(!0), Mr(L), $s(L), os(L), ge == null || ge.show(80), cr(40), _t());
  }), L.on("hide", () => {
    ge == null || ge.hide(80), _t();
  }), L.on("focus", () => cr(80)), L.on("blur", () => cr(40)), L.on("resize", () => {
    L && (pl(L), Mr(L), os(L), cr(120));
  }), L.on("move", () => {
    L && !L.isDestroyed() && !ps && h1(L), os(L), cr(180), _t();
  }), L.on("close", (t) => {
    Ms || (t.preventDefault(), L == null || L.hide());
  }), L.webContents.setWindowOpenHandler(({ url: t }) => {
    try {
      const r = new URL(t);
      r.protocol === "https:" && Md.openExternal(r.toString());
    } catch {
    }
    return { action: "deny" };
  }), L.webContents.on("will-navigate", (t) => {
    t.preventDefault();
  });
}
Fe.whenReady().then(() => {
  v1(), w1(), y1(), jd(), _1(), Jt.on("display-metrics-changed", () => {
    L && !L.isDestroyed() && Mr(L);
  }), _l.register("CommandOrControl+Shift+T", () => {
    !L || L.isDestroyed() || (L.isVisible() ? (L.hide(), _t()) : wt(!0));
  });
});
Fe.on("before-quit", () => {
  Ms = !0;
});
Fe.on("window-all-closed", () => {
  process.platform !== "darwin" && Ms && Fe.quit();
});
Fe.on("will-quit", () => {
  yn && clearInterval(yn), Or && clearTimeout(Or), Ir && clearTimeout(Ir), jr && clearTimeout(jr), _l.unregisterAll(), Id(), ho.shutdown(), ut == null || ut.destroy(), ut = null;
});
Fe.on("second-instance", () => {
  L && !L.isDestroyed() && (L.isMinimized() && L.restore(), wt(!0));
});
Fe.on("activate", () => {
  ko.getAllWindows().length ? wt(!0) : jd();
});
export {
  V1 as MAIN_DIST,
  bd as RENDERER_DIST,
  vn as VITE_DEV_SERVER_URL
};
