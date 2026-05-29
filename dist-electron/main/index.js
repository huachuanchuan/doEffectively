var pd = Object.defineProperty;
var Pi = (e) => {
  throw TypeError(e);
};
var $d = (e, t, r) => t in e ? pd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Wr = (e, t, r) => $d(e, typeof t != "symbol" ? t + "" : t, r), Is = (e, t, r) => t.has(e) || Pi("Cannot " + r);
var ee = (e, t, r) => (Is(e, t, "read from private field"), r ? r.call(e) : t.get(e)), tt = (e, t, r) => t.has(e) ? Pi("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Ke = (e, t, r, n) => (Is(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), wt = (e, t, r) => (Is(e, t, "access private method"), r);
import il, { app as qe, screen as hn, globalShortcut as cl, BrowserWindow as wa, ipcMain as Lt, nativeImage as yd, Tray as gd, shell as _d, Menu as vd, Notification as Ni } from "electron";
import { fileURLToPath as wd } from "node:url";
import ae from "node:path";
import Ea from "node:os";
import $e from "node:process";
import { promisify as Ae, isDeepStrictEqual as Ri } from "node:util";
import te from "node:fs";
import Xr from "node:crypto";
import Oi from "node:assert";
import "node:events";
import "node:stream";
const lr = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, ll = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), ul = 1e6, Ed = (e) => e >= "0" && e <= "9";
function dl(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= ul;
  }
  return !1;
}
function js(e, t) {
  return ll.has(e) ? !1 : (e && dl(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function bd(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  const t = [];
  let r = "", n = "start", s = !1, a = 0;
  for (const o of e) {
    if (a++, s) {
      r += o, s = !1;
      continue;
    }
    if (o === "\\") {
      if (n === "index")
        throw new Error(`Invalid character '${o}' in an index at position ${a}`);
      if (n === "indexEnd")
        throw new Error(`Invalid character '${o}' after an index at position ${a}`);
      s = !0, n = n === "start" ? "property" : n;
      continue;
    }
    switch (o) {
      case ".": {
        if (n === "index")
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (!js(r, t))
          return [];
        r = "", n = "property";
        break;
      }
      case "[": {
        if (n === "index")
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd") {
          n = "index";
          break;
        }
        if (n === "property" || n === "start") {
          if ((r || n === "property") && !js(r, t))
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
            const l = Number.parseInt(r, 10);
            !Number.isNaN(l) && Number.isFinite(l) && l >= 0 && l <= Number.MAX_SAFE_INTEGER && l <= ul && r === String(l) ? t.push(l) : t.push(r), r = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        r += o;
        break;
      }
      default: {
        if (n === "index" && !Ed(o))
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        n === "start" && (n = "property"), r += o;
      }
    }
  }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (!js(r, t))
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
function ls(e) {
  if (typeof e == "string")
    return bd(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [r, n] of e.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${r}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${r} must be a finite number, got ${n}`);
      if (ll.has(n))
        return [];
      typeof n == "string" && dl(n) ? t.push(Number.parseInt(n, 10)) : t.push(n);
    }
    return t;
  }
  return [];
}
function Ti(e, t, r) {
  if (!lr(e) || typeof t != "string" && !Array.isArray(t))
    return r === void 0 ? e : r;
  const n = ls(t);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const a = n[s];
    if (e = e[a], e == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function En(e, t, r) {
  if (!lr(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, s = ls(t);
  if (s.length === 0)
    return e;
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    if (a === s.length - 1)
      e[o] = r;
    else if (!lr(e[o])) {
      const c = typeof s[a + 1] == "number";
      e[o] = c ? [] : {};
    }
    e = e[o];
  }
  return n;
}
function Sd(e, t) {
  if (!lr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = ls(t);
  if (r.length === 0)
    return !1;
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (n === r.length - 1)
      return Object.hasOwn(e, s) ? (delete e[s], !0) : !1;
    if (e = e[s], !lr(e))
      return !1;
  }
}
function As(e, t) {
  if (!lr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = ls(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!lr(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const Ut = Ea.homedir(), ba = Ea.tmpdir(), { env: wr } = $e, Pd = (e) => {
  const t = ae.join(Ut, "Library");
  return {
    data: ae.join(t, "Application Support", e),
    config: ae.join(t, "Preferences", e),
    cache: ae.join(t, "Caches", e),
    log: ae.join(t, "Logs", e),
    temp: ae.join(ba, e)
  };
}, Nd = (e) => {
  const t = wr.APPDATA || ae.join(Ut, "AppData", "Roaming"), r = wr.LOCALAPPDATA || ae.join(Ut, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: ae.join(r, e, "Data"),
    config: ae.join(t, e, "Config"),
    cache: ae.join(r, e, "Cache"),
    log: ae.join(r, e, "Log"),
    temp: ae.join(ba, e)
  };
}, Rd = (e) => {
  const t = ae.basename(Ut);
  return {
    data: ae.join(wr.XDG_DATA_HOME || ae.join(Ut, ".local", "share"), e),
    config: ae.join(wr.XDG_CONFIG_HOME || ae.join(Ut, ".config"), e),
    cache: ae.join(wr.XDG_CACHE_HOME || ae.join(Ut, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: ae.join(wr.XDG_STATE_HOME || ae.join(Ut, ".local", "state"), e),
    temp: ae.join(ba, t, e)
  };
};
function Od(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), $e.platform === "darwin" ? Pd(e) : $e.platform === "win32" ? Nd(e) : Rd(e);
}
const jt = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    return e.apply(void 0, s).catch(r);
  };
}, Et = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    try {
      return e.apply(void 0, s);
    } catch (a) {
      return r(a);
    }
  };
}, Td = 250, At = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: a } = s, o = s.interval ?? Td, l = Date.now() + a;
    return function c(...d) {
      return e.apply(void 0, d).catch((u) => {
        if (!r(u) || Date.now() >= l)
          throw u;
        const h = Math.round(o * Math.random());
        return h > 0 ? new Promise(($) => setTimeout($, h)).then(() => c.apply(void 0, d)) : c.apply(void 0, d);
      });
    };
  };
}, kt = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: a } = s, o = Date.now() + a;
    return function(...c) {
      for (; ; )
        try {
          return e.apply(void 0, c);
        } catch (d) {
          if (!r(d) || Date.now() >= o)
            throw d;
          continue;
        }
    };
  };
}, Er = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!Er.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !Id && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!Er.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!Er.isNodeError(e))
      throw e;
    if (!Er.isChangeErrorOk(e))
      throw e;
  }
}, bn = {
  onError: Er.onChangeError
}, Xe = {
  onError: () => {
  }
}, Id = $e.getuid ? !$e.getuid() : !1, ke = {
  isRetriable: Er.isRetriableError
}, Me = {
  attempt: {
    /* ASYNC */
    chmod: jt(Ae(te.chmod), bn),
    chown: jt(Ae(te.chown), bn),
    close: jt(Ae(te.close), Xe),
    fsync: jt(Ae(te.fsync), Xe),
    mkdir: jt(Ae(te.mkdir), Xe),
    realpath: jt(Ae(te.realpath), Xe),
    stat: jt(Ae(te.stat), Xe),
    unlink: jt(Ae(te.unlink), Xe),
    /* SYNC */
    chmodSync: Et(te.chmodSync, bn),
    chownSync: Et(te.chownSync, bn),
    closeSync: Et(te.closeSync, Xe),
    existsSync: Et(te.existsSync, Xe),
    fsyncSync: Et(te.fsync, Xe),
    mkdirSync: Et(te.mkdirSync, Xe),
    realpathSync: Et(te.realpathSync, Xe),
    statSync: Et(te.statSync, Xe),
    unlinkSync: Et(te.unlinkSync, Xe)
  },
  retry: {
    /* ASYNC */
    close: At(Ae(te.close), ke),
    fsync: At(Ae(te.fsync), ke),
    open: At(Ae(te.open), ke),
    readFile: At(Ae(te.readFile), ke),
    rename: At(Ae(te.rename), ke),
    stat: At(Ae(te.stat), ke),
    write: At(Ae(te.write), ke),
    writeFile: At(Ae(te.writeFile), ke),
    /* SYNC */
    closeSync: kt(te.closeSync, ke),
    fsyncSync: kt(te.fsyncSync, ke),
    openSync: kt(te.openSync, ke),
    readFileSync: kt(te.readFileSync, ke),
    renameSync: kt(te.renameSync, ke),
    statSync: kt(te.statSync, ke),
    writeSync: kt(te.writeSync, ke),
    writeFileSync: kt(te.writeFileSync, ke)
  }
}, jd = "utf8", Ii = 438, Ad = 511, kd = {}, Cd = $e.geteuid ? $e.geteuid() : -1, Dd = $e.getegid ? $e.getegid() : -1, Md = 1e3, Vd = !!$e.getuid;
$e.getuid && $e.getuid();
const ji = 128, Ld = (e) => e instanceof Error && "code" in e, Ai = (e) => typeof e == "string", ks = (e) => e === void 0, Fd = $e.platform === "linux", fl = $e.platform === "win32", Sa = ["SIGHUP", "SIGINT", "SIGTERM"];
fl || Sa.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
Fd && Sa.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class zd {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (fl && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? $e.kill($e.pid, "SIGTERM") : $e.kill($e.pid, t));
      }
    }, this.hook = () => {
      $e.once("exit", () => this.exit());
      for (const t of Sa)
        try {
          $e.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const Ud = new zd(), qd = Ud.register, Ve = {
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
    Ve.store[e] && (delete Ve.store[e], Me.attempt.unlink(e));
  },
  purgeSync: (e) => {
    Ve.store[e] && (delete Ve.store[e], Me.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in Ve.store)
      Ve.purgeSync(e);
  },
  truncate: (e) => {
    const t = ae.basename(e);
    if (t.length <= ji)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - ji;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
qd(Ve.purgeSyncAll);
function hl(e, t, r = kd) {
  if (Ai(r))
    return hl(e, t, { encoding: r });
  const s = { timeout: r.timeout ?? Md };
  let a = null, o = null, l = null;
  try {
    const c = Me.attempt.realpathSync(e), d = !!c;
    e = c || e, [o, a] = Ve.get(e, r.tmpCreate || Ve.create, r.tmpPurge !== !1);
    const u = Vd && ks(r.chown), h = ks(r.mode);
    if (d && (u || h)) {
      const w = Me.attempt.statSync(e);
      w && (r = { ...r }, u && (r.chown = { uid: w.uid, gid: w.gid }), h && (r.mode = w.mode));
    }
    if (!d) {
      const w = ae.dirname(e);
      Me.attempt.mkdirSync(w, {
        mode: Ad,
        recursive: !0
      });
    }
    l = Me.retry.openSync(s)(o, "w", r.mode || Ii), r.tmpCreated && r.tmpCreated(o), Ai(t) ? Me.retry.writeSync(s)(l, t, 0, r.encoding || jd) : ks(t) || Me.retry.writeSync(s)(l, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Me.retry.fsyncSync(s)(l) : Me.attempt.fsync(l)), Me.retry.closeSync(s)(l), l = null, r.chown && (r.chown.uid !== Cd || r.chown.gid !== Dd) && Me.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== Ii && Me.attempt.chmodSync(o, r.mode);
    try {
      Me.retry.renameSync(s)(o, e);
    } catch (w) {
      if (!Ld(w) || w.code !== "ENAMETOOLONG")
        throw w;
      Me.retry.renameSync(s)(o, Ve.truncate(e));
    }
    a(), o = null;
  } finally {
    l && Me.attempt.closeSync(l), o && Ve.purge(o);
  }
}
function ml(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ra = { exports: {} }, pl = {}, ut = {}, kr = {}, yn = {}, re = {}, mn = {};
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
      return (E = this._str) !== null && E !== void 0 ? E : this._str = this._items.reduce((R, O) => `${R}${O}`, "");
    }
    get names() {
      var E;
      return (E = this._names) !== null && E !== void 0 ? E : this._names = this._items.reduce((R, O) => (O instanceof r && (R[O.str] = (R[O.str] || 0) + 1), R), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...E) {
    const R = [m[0]];
    let O = 0;
    for (; O < E.length; )
      l(R, E[O]), R.push(m[++O]);
    return new n(R);
  }
  e._ = s;
  const a = new n("+");
  function o(m, ...E) {
    const R = [$(m[0])];
    let O = 0;
    for (; O < E.length; )
      R.push(a), l(R, E[O]), R.push(a, $(m[++O]));
    return c(R), new n(R);
  }
  e.str = o;
  function l(m, E) {
    E instanceof n ? m.push(...E._items) : E instanceof r ? m.push(E) : m.push(h(E));
  }
  e.addCodeArg = l;
  function c(m) {
    let E = 1;
    for (; E < m.length - 1; ) {
      if (m[E] === a) {
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
    return E.emptyStr() ? m : m.emptyStr() ? E : o`${m}${E}`;
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
})(mn);
var na = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = mn;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
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
  class a extends t.Name {
    constructor(d, u) {
      super(u), this.prefix = d;
    }
    setValue(d, { property: u, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(u)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const o = (0, t._)`\n`;
  class l extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
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
  e.ValueScope = l;
})(na);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = mn, r = na;
  var n = mn;
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
  var s = na;
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
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(i, f) {
      return this;
    }
  }
  class o extends a {
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
  class l extends a {
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
  class c extends l {
    constructor(i, f, b, j) {
      super(i, b, j), this.op = f;
    }
    render({ _n: i }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + i;
    }
  }
  class d extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `${this.label}:` + i;
    }
  }
  class u extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `break${this.label ? ` ${this.label}` : ""};` + i;
    }
  }
  class h extends a {
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
  class w extends a {
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
  class $ extends a {
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
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(V(i), f instanceof m ? [f] : f.nodes);
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
  class O extends E {
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
      return b !== void 0 && j && (this._constants[A.str] = b), this._leafNode(new o(i, A, b)), A;
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
      return this._leafNode(new l(i, f, b));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new c(i, e.operators.ADD, f));
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
      return this._for(new O(A, G, f, b), () => j(G));
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
  function V(y) {
    return typeof y == "boolean" || typeof y == "number" || y === null ? !y : (0, t._)`!${S(y)}`;
  }
  e.not = V;
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
})(re);
var L = {};
Object.defineProperty(L, "__esModule", { value: !0 });
L.checkStrictMode = L.getErrorPath = L.Type = L.useFunc = L.setEvaluated = L.evaluatedPropsToName = L.mergeEvaluated = L.eachItem = L.unescapeJsonPointer = L.escapeJsonPointer = L.escapeFragment = L.unescapeFragment = L.schemaRefOrVal = L.schemaHasRulesButRef = L.schemaHasRules = L.checkUnknownRules = L.alwaysValidSchema = L.toHash = void 0;
const de = re, Kd = mn;
function Gd(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
L.toHash = Gd;
function Hd(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : ($l(e, t), !yl(t, e.self.RULES.all));
}
L.alwaysValidSchema = Hd;
function $l(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || vl(e, `unknown keyword: "${a}"`);
}
L.checkUnknownRules = $l;
function yl(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
L.schemaHasRules = yl;
function Bd(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
L.schemaHasRulesButRef = Bd;
function Wd({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, de._)`${r}`;
  }
  return (0, de._)`${e}${t}${(0, de.getProperty)(n)}`;
}
L.schemaRefOrVal = Wd;
function Xd(e) {
  return gl(decodeURIComponent(e));
}
L.unescapeFragment = Xd;
function Jd(e) {
  return encodeURIComponent(Pa(e));
}
L.escapeFragment = Jd;
function Pa(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
L.escapeJsonPointer = Pa;
function gl(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
L.unescapeJsonPointer = gl;
function Yd(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
L.eachItem = Yd;
function ki({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, l) => {
    const c = o === void 0 ? a : o instanceof de.Name ? (a instanceof de.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof de.Name ? (t(s, o, a), a) : r(a, o);
    return l === de.Name && !(c instanceof de.Name) ? n(s, c) : c;
  };
}
L.mergeEvaluated = {
  props: ki({
    mergeNames: (e, t, r) => e.if((0, de._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, de._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, de._)`${r} || {}`).code((0, de._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, de._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, de._)`${r} || {}`), Na(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: _l
  }),
  items: ki({
    mergeNames: (e, t, r) => e.if((0, de._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, de._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, de._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, de._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function _l(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, de._)`{}`);
  return t !== void 0 && Na(e, r, t), r;
}
L.evaluatedPropsToName = _l;
function Na(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, de._)`${t}${(0, de.getProperty)(n)}`, !0));
}
L.setEvaluated = Na;
const Ci = {};
function Qd(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Ci[t.code] || (Ci[t.code] = new Kd._Code(t.code))
  });
}
L.useFunc = Qd;
var sa;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(sa || (L.Type = sa = {}));
function Zd(e, t, r) {
  if (e instanceof de.Name) {
    const n = t === sa.Num;
    return r ? n ? (0, de._)`"[" + ${e} + "]"` : (0, de._)`"['" + ${e} + "']"` : n ? (0, de._)`"/" + ${e}` : (0, de._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, de.getProperty)(e).toString() : "/" + Pa(e);
}
L.getErrorPath = Zd;
function vl(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
L.checkStrictMode = vl;
var Ye = {};
Object.defineProperty(Ye, "__esModule", { value: !0 });
const Ce = re, xd = {
  // validation function arguments
  data: new Ce.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Ce.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Ce.Name("instancePath"),
  parentData: new Ce.Name("parentData"),
  parentDataProperty: new Ce.Name("parentDataProperty"),
  rootData: new Ce.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Ce.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Ce.Name("vErrors"),
  // null or array of validation errors
  errors: new Ce.Name("errors"),
  // counter of validation errors
  this: new Ce.Name("this"),
  // "globals"
  self: new Ce.Name("self"),
  scope: new Ce.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Ce.Name("json"),
  jsonPos: new Ce.Name("jsonPos"),
  jsonLen: new Ce.Name("jsonLen"),
  jsonPart: new Ce.Name("jsonPart")
};
Ye.default = xd;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = re, r = L, n = Ye;
  e.keywordError = {
    message: ({ keyword: g }) => (0, t.str)`must pass "${g}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: g, schemaType: m }) => m ? (0, t.str)`"${g}" keyword must be ${m} ($data)` : (0, t.str)`"${g}" keyword is invalid ($data)`
  };
  function s(g, m = e.keywordError, E, R) {
    const { it: O } = g, { gen: I, compositeRule: K, allErrors: Y } = O, le = h(g, m, E);
    R ?? (K || Y) ? c(I, le) : d(O, (0, t._)`[${le}]`);
  }
  e.reportError = s;
  function a(g, m = e.keywordError, E) {
    const { it: R } = g, { gen: O, compositeRule: I, allErrors: K } = R, Y = h(g, m, E);
    c(O, Y), I || K || d(R, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o(g, m) {
    g.assign(n.default.errors, m), g.if((0, t._)`${n.default.vErrors} !== null`, () => g.if(m, () => g.assign((0, t._)`${n.default.vErrors}.length`, m), () => g.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function l({ gen: g, keyword: m, schemaValue: E, data: R, errsCount: O, it: I }) {
    if (O === void 0)
      throw new Error("ajv implementation error");
    const K = g.name("err");
    g.forRange("i", O, n.default.errors, (Y) => {
      g.const(K, (0, t._)`${n.default.vErrors}[${Y}]`), g.if((0, t._)`${K}.instancePath === undefined`, () => g.assign((0, t._)`${K}.instancePath`, (0, t.strConcat)(n.default.instancePath, I.errorPath))), g.assign((0, t._)`${K}.schemaPath`, (0, t.str)`${I.errSchemaPath}/${m}`), I.opts.verbose && (g.assign((0, t._)`${K}.schema`, E), g.assign((0, t._)`${K}.data`, R));
    });
  }
  e.extendErrors = l;
  function c(g, m) {
    const E = g.const("err", m);
    g.if((0, t._)`${n.default.vErrors} === null`, () => g.assign(n.default.vErrors, (0, t._)`[${E}]`), (0, t._)`${n.default.vErrors}.push(${E})`), g.code((0, t._)`${n.default.errors}++`);
  }
  function d(g, m) {
    const { gen: E, validateName: R, schemaEnv: O } = g;
    O.$async ? E.throw((0, t._)`new ${g.ValidationError}(${m})`) : (E.assign((0, t._)`${R}.errors`, m), E.return(!1));
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
    const { gen: R, it: O } = g, I = [
      $(O, E),
      v(g, E)
    ];
    return _(g, m, I), R.object(...I);
  }
  function $({ errorPath: g }, { instancePath: m }) {
    const E = m ? (0, t.str)`${g}${(0, r.getErrorPath)(m, r.Type.Str)}` : g;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, E)];
  }
  function v({ keyword: g, it: { errSchemaPath: m } }, { schemaPath: E, parentSchema: R }) {
    let O = R ? m : (0, t.str)`${m}/${g}`;
    return E && (O = (0, t.str)`${O}${(0, r.getErrorPath)(E, r.Type.Str)}`), [u.schemaPath, O];
  }
  function _(g, { params: m, message: E }, R) {
    const { keyword: O, data: I, schemaValue: K, it: Y } = g, { opts: le, propertyName: he, topSchemaRef: ye, schemaPath: q } = Y;
    R.push([u.keyword, O], [u.params, typeof m == "function" ? m(g) : m || (0, t._)`{}`]), le.messages && R.push([u.message, typeof E == "function" ? E(g) : E]), le.verbose && R.push([u.schema, K], [u.parentSchema, (0, t._)`${ye}${q}`], [n.default.data, I]), he && R.push([u.propertyName, he]);
  }
})(yn);
Object.defineProperty(kr, "__esModule", { value: !0 });
kr.boolOrEmptySchema = kr.topBoolOrEmptySchema = void 0;
const ef = yn, tf = re, rf = Ye, nf = {
  message: "boolean schema is false"
};
function sf(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? wl(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(rf.default.data) : (t.assign((0, tf._)`${n}.errors`, null), t.return(!0));
}
kr.topBoolOrEmptySchema = sf;
function af(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), wl(e)) : r.var(t, !0);
}
kr.boolOrEmptySchema = af;
function wl(e, t) {
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
  (0, ef.reportError)(s, nf, void 0, t);
}
var Ee = {}, ur = {};
Object.defineProperty(ur, "__esModule", { value: !0 });
ur.getRules = ur.isJSONType = void 0;
const of = ["string", "number", "integer", "boolean", "null", "object", "array"], cf = new Set(of);
function lf(e) {
  return typeof e == "string" && cf.has(e);
}
ur.isJSONType = lf;
function uf() {
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
ur.getRules = uf;
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.shouldUseRule = Ot.shouldUseGroup = Ot.schemaHasRulesForType = void 0;
function df({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && El(e, n);
}
Ot.schemaHasRulesForType = df;
function El(e, t) {
  return t.rules.some((r) => bl(e, r));
}
Ot.shouldUseGroup = El;
function bl(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
Ot.shouldUseRule = bl;
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.reportTypeError = Ee.checkDataTypes = Ee.checkDataType = Ee.coerceAndCheckDataType = Ee.getJSONTypes = Ee.getSchemaTypes = Ee.DataType = void 0;
const ff = ur, hf = Ot, mf = yn, ne = re, Sl = L;
var Rr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Rr || (Ee.DataType = Rr = {}));
function pf(e) {
  const t = Pl(e.type);
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
Ee.getSchemaTypes = pf;
function Pl(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(ff.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
Ee.getJSONTypes = Pl;
function $f(e, t) {
  const { gen: r, data: n, opts: s } = e, a = yf(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, hf.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const l = Ra(t, n, s.strictNumbers, Rr.Wrong);
    r.if(l, () => {
      a.length ? gf(e, t, a) : Oa(e);
    });
  }
  return o;
}
Ee.coerceAndCheckDataType = $f;
const Nl = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function yf(e, t) {
  return t ? e.filter((r) => Nl.has(r) || t === "array" && r === "array") : [];
}
function gf(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, ne._)`typeof ${s}`), l = n.let("coerced", (0, ne._)`undefined`);
  a.coerceTypes === "array" && n.if((0, ne._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, ne._)`${s}[0]`).assign(o, (0, ne._)`typeof ${s}`).if(Ra(t, s, a.strictNumbers), () => n.assign(l, s))), n.if((0, ne._)`${l} !== undefined`);
  for (const d of r)
    (Nl.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), Oa(e), n.endIf(), n.if((0, ne._)`${l} !== undefined`, () => {
    n.assign(s, l), _f(e, l);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, ne._)`${o} == "number" || ${o} == "boolean"`).assign(l, (0, ne._)`"" + ${s}`).elseIf((0, ne._)`${s} === null`).assign(l, (0, ne._)`""`);
        return;
      case "number":
        n.elseIf((0, ne._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, ne._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, ne._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, ne._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, ne._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, ne._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, ne._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, ne._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(l, (0, ne._)`[${s}]`);
    }
  }
}
function _f({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, ne._)`${t} !== undefined`, () => e.assign((0, ne._)`${t}[${r}]`, n));
}
function aa(e, t, r, n = Rr.Correct) {
  const s = n === Rr.Correct ? ne.operators.EQ : ne.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, ne._)`${t} ${s} null`;
    case "array":
      a = (0, ne._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, ne._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, ne._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, ne._)`typeof ${t} ${s} ${e}`;
  }
  return n === Rr.Correct ? a : (0, ne.not)(a);
  function o(l = ne.nil) {
    return (0, ne.and)((0, ne._)`typeof ${t} == "number"`, l, r ? (0, ne._)`isFinite(${t})` : ne.nil);
  }
}
Ee.checkDataType = aa;
function Ra(e, t, r, n) {
  if (e.length === 1)
    return aa(e[0], t, r, n);
  let s;
  const a = (0, Sl.toHash)(e);
  if (a.array && a.object) {
    const o = (0, ne._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, ne._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = ne.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, ne.and)(s, aa(o, t, r, n));
  return s;
}
Ee.checkDataTypes = Ra;
const vf = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, ne._)`{type: ${e}}` : (0, ne._)`{type: ${t}}`
};
function Oa(e) {
  const t = wf(e);
  (0, mf.reportError)(t, vf);
}
Ee.reportTypeError = Oa;
function wf(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Sl.schemaRefOrVal)(e, n, "type");
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
var us = {};
Object.defineProperty(us, "__esModule", { value: !0 });
us.assignDefaults = void 0;
const pr = re, Ef = L;
function bf(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Di(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => Di(e, a, s.default));
}
us.assignDefaults = bf;
function Di(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const l = (0, pr._)`${a}${(0, pr.getProperty)(t)}`;
  if (s) {
    (0, Ef.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let c = (0, pr._)`${l} === undefined`;
  o.useDefaults === "empty" && (c = (0, pr._)`${c} || ${l} === null || ${l} === ""`), n.if(c, (0, pr._)`${l} = ${(0, pr.stringify)(r)}`);
}
var _t = {}, ie = {};
Object.defineProperty(ie, "__esModule", { value: !0 });
ie.validateUnion = ie.validateArray = ie.usePattern = ie.callValidateCode = ie.schemaProperties = ie.allSchemaProperties = ie.noPropertyInData = ie.propertyInData = ie.isOwnProperty = ie.hasPropFunc = ie.reportMissingProp = ie.checkMissingProp = ie.checkReportMissingProp = void 0;
const me = re, Ta = L, Ct = Ye, Sf = L;
function Pf(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(ja(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, me._)`${t}` }, !0), e.error();
  });
}
ie.checkReportMissingProp = Pf;
function Nf({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, me.or)(...n.map((a) => (0, me.and)(ja(e, t, a, r.ownProperties), (0, me._)`${s} = ${a}`)));
}
ie.checkMissingProp = Nf;
function Rf(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ie.reportMissingProp = Rf;
function Rl(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, me._)`Object.prototype.hasOwnProperty`
  });
}
ie.hasPropFunc = Rl;
function Ia(e, t, r) {
  return (0, me._)`${Rl(e)}.call(${t}, ${r})`;
}
ie.isOwnProperty = Ia;
function Of(e, t, r, n) {
  const s = (0, me._)`${t}${(0, me.getProperty)(r)} !== undefined`;
  return n ? (0, me._)`${s} && ${Ia(e, t, r)}` : s;
}
ie.propertyInData = Of;
function ja(e, t, r, n) {
  const s = (0, me._)`${t}${(0, me.getProperty)(r)} === undefined`;
  return n ? (0, me.or)(s, (0, me.not)(Ia(e, t, r))) : s;
}
ie.noPropertyInData = ja;
function Ol(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ie.allSchemaProperties = Ol;
function Tf(e, t) {
  return Ol(t).filter((r) => !(0, Ta.alwaysValidSchema)(e, t[r]));
}
ie.schemaProperties = Tf;
function If({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, l, c, d) {
  const u = d ? (0, me._)`${e}, ${t}, ${n}${s}` : t, h = [
    [Ct.default.instancePath, (0, me.strConcat)(Ct.default.instancePath, a)],
    [Ct.default.parentData, o.parentData],
    [Ct.default.parentDataProperty, o.parentDataProperty],
    [Ct.default.rootData, Ct.default.rootData]
  ];
  o.opts.dynamicRef && h.push([Ct.default.dynamicAnchors, Ct.default.dynamicAnchors]);
  const w = (0, me._)`${u}, ${r.object(...h)}`;
  return c !== me.nil ? (0, me._)`${l}.call(${c}, ${w})` : (0, me._)`${l}(${w})`;
}
ie.callValidateCode = If;
const jf = (0, me._)`new RegExp`;
function Af({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, me._)`${s.code === "new RegExp" ? jf : (0, Sf.useFunc)(e, s)}(${r}, ${n})`
  });
}
ie.usePattern = Af;
function kf(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return o(() => t.assign(l, !1)), l;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(l) {
    const c = t.const("len", (0, me._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: Ta.Type.Num
      }, a), t.if((0, me.not)(a), l);
    });
  }
}
ie.validateArray = kf;
function Cf(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, Ta.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(o, (0, me._)`${o} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, me.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
ie.validateUnion = Cf;
Object.defineProperty(_t, "__esModule", { value: !0 });
_t.validateKeywordUsage = _t.validSchemaType = _t.funcKeywordCode = _t.macroKeywordCode = void 0;
const ze = re, xt = Ye, Df = ie, Mf = yn;
function Vf(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, l = t.macro.call(o.self, s, a, o), c = Tl(r, n, l);
  o.opts.validateSchema !== !1 && o.self.validateSchema(l, !0);
  const d = r.name("valid");
  e.subschema({
    schema: l,
    schemaPath: ze.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
_t.macroKeywordCode = Vf;
function Lf(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: l, it: c } = e;
  zf(c, t);
  const d = !l && t.compile ? t.compile.call(c.self, a, o, c) : t.validate, u = Tl(n, s, d), h = n.let("valid");
  e.block$data(h, w), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function w() {
    if (t.errors === !1)
      _(), t.modifying && Mi(e), g(() => e.error());
    else {
      const m = t.async ? $() : v();
      t.modifying && Mi(e), g(() => Ff(e, m));
    }
  }
  function $() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, ze._)`await `), (E) => n.assign(h, !1).if((0, ze._)`${E} instanceof ${c.ValidationError}`, () => n.assign(m, (0, ze._)`${E}.errors`), () => n.throw(E))), m;
  }
  function v() {
    const m = (0, ze._)`${u}.errors`;
    return n.assign(m, null), _(ze.nil), m;
  }
  function _(m = t.async ? (0, ze._)`await ` : ze.nil) {
    const E = c.opts.passContext ? xt.default.this : xt.default.self, R = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, ze._)`${m}${(0, Df.callValidateCode)(e, u, E, R)}`, t.modifying);
  }
  function g(m) {
    var E;
    n.if((0, ze.not)((E = t.valid) !== null && E !== void 0 ? E : h), m);
  }
}
_t.funcKeywordCode = Lf;
function Mi(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, ze._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Ff(e, t) {
  const { gen: r } = e;
  r.if((0, ze._)`Array.isArray(${t})`, () => {
    r.assign(xt.default.vErrors, (0, ze._)`${xt.default.vErrors} === null ? ${t} : ${xt.default.vErrors}.concat(${t})`).assign(xt.default.errors, (0, ze._)`${xt.default.vErrors}.length`), (0, Mf.extendErrors)(e);
  }, () => e.error());
}
function zf({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Tl(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, ze.stringify)(r) });
}
function Uf(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
_t.validSchemaType = Uf;
function qf({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((l) => !Object.prototype.hasOwnProperty.call(e, l)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
_t.validateKeywordUsage = qf;
var Bt = {};
Object.defineProperty(Bt, "__esModule", { value: !0 });
Bt.extendSubschemaMode = Bt.extendSubschemaData = Bt.getSubschema = void 0;
const gt = re, Il = L;
function Kf(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const l = e.schema[t];
    return r === void 0 ? {
      schema: l,
      schemaPath: (0, gt._)`${e.schemaPath}${(0, gt.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: l[r],
      schemaPath: (0, gt._)`${e.schemaPath}${(0, gt.getProperty)(t)}${(0, gt.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Il.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: o,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Bt.getSubschema = Kf;
function Gf(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, w = l.let("data", (0, gt._)`${t.data}${(0, gt.getProperty)(r)}`, !0);
    c(w), e.errorPath = (0, gt.str)`${d}${(0, Il.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, gt._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof gt.Name ? s : l.let("data", s, !0);
    c(d), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Bt.extendSubschemaData = Gf;
function Hf(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Bt.extendSubschemaMode = Hf;
var Te = {}, ds = function e(t, r) {
  if (t === r) return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor) return !1;
    var n, s, a;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length) return !1;
      for (s = n; s-- !== 0; )
        if (!e(t[s], r[s])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
    if (a = Object.keys(t), n = a.length, n !== Object.keys(r).length) return !1;
    for (s = n; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, a[s])) return !1;
    for (s = n; s-- !== 0; ) {
      var o = a[s];
      if (!e(t[o], r[o])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, jl = { exports: {} }, Gt = jl.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Gn(t, n, s, e, "", e);
};
Gt.keywords = {
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
Gt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Gt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Gt.skipKeywords = {
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
function Gn(e, t, r, n, s, a, o, l, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, l, c, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in Gt.arrayKeywords)
          for (var w = 0; w < h.length; w++)
            Gn(e, t, r, h[w], s + "/" + u + "/" + w, a, s, u, n, w);
      } else if (u in Gt.propsKeywords) {
        if (h && typeof h == "object")
          for (var $ in h)
            Gn(e, t, r, h[$], s + "/" + u + "/" + Bf($), a, s, u, n, $);
      } else (u in Gt.keywords || e.allKeys && !(u in Gt.skipKeywords)) && Gn(e, t, r, h, s + "/" + u, a, s, u, n);
    }
    r(n, s, a, o, l, c, d);
  }
}
function Bf(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Wf = jl.exports;
Object.defineProperty(Te, "__esModule", { value: !0 });
Te.getSchemaRefs = Te.resolveUrl = Te.normalizeId = Te._getFullPath = Te.getFullPath = Te.inlineRef = void 0;
const Xf = L, Jf = ds, Yf = Wf, Qf = /* @__PURE__ */ new Set([
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
function Zf(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !oa(e) : t ? Al(e) <= t : !1;
}
Te.inlineRef = Zf;
const xf = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function oa(e) {
  for (const t in e) {
    if (xf.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(oa) || typeof r == "object" && oa(r))
      return !0;
  }
  return !1;
}
function Al(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Qf.has(r) && (typeof e[r] == "object" && (0, Xf.eachItem)(e[r], (n) => t += Al(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function kl(e, t = "", r) {
  r !== !1 && (t = Or(t));
  const n = e.parse(t);
  return Cl(e, n);
}
Te.getFullPath = kl;
function Cl(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Te._getFullPath = Cl;
const eh = /#\/?$/;
function Or(e) {
  return e ? e.replace(eh, "") : "";
}
Te.normalizeId = Or;
function th(e, t, r) {
  return r = Or(r), e.resolve(t, r);
}
Te.resolveUrl = th;
const rh = /^[a-z_][-a-z0-9._]*$/i;
function nh(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Or(e[r] || t), a = { "": s }, o = kl(n, s, !1), l = {}, c = /* @__PURE__ */ new Set();
  return Yf(e, { allKeys: !0 }, (h, w, $, v) => {
    if (v === void 0)
      return;
    const _ = o + w;
    let g = a[v];
    typeof h[r] == "string" && (g = m.call(this, h[r])), E.call(this, h.$anchor), E.call(this, h.$dynamicAnchor), a[w] = g;
    function m(R) {
      const O = this.opts.uriResolver.resolve;
      if (R = Or(g ? O(g, R) : R), c.has(R))
        throw u(R);
      c.add(R);
      let I = this.refs[R];
      return typeof I == "string" && (I = this.refs[I]), typeof I == "object" ? d(h, I.schema, R) : R !== Or(_) && (R[0] === "#" ? (d(h, l[R], R), l[R] = h) : this.refs[R] = _), R;
    }
    function E(R) {
      if (typeof R == "string") {
        if (!rh.test(R))
          throw new Error(`invalid anchor "${R}"`);
        m.call(this, `#${R}`);
      }
    }
  }), l;
  function d(h, w, $) {
    if (w !== void 0 && !Jf(h, w))
      throw u($);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Te.getSchemaRefs = nh;
Object.defineProperty(ut, "__esModule", { value: !0 });
ut.getData = ut.KeywordCxt = ut.validateFunctionCode = void 0;
const Dl = kr, Vi = Ee, Aa = Ot, es = Ee, sh = us, rn = _t, Cs = Bt, X = re, Z = Ye, ah = Te, Tt = L, Jr = yn;
function oh(e) {
  if (Ll(e) && (Fl(e), Vl(e))) {
    lh(e);
    return;
  }
  Ml(e, () => (0, Dl.topBoolOrEmptySchema)(e));
}
ut.validateFunctionCode = oh;
function Ml({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, X._)`${Z.default.data}, ${Z.default.valCxt}`, n.$async, () => {
    e.code((0, X._)`"use strict"; ${Li(r, s)}`), ch(e, s), e.code(a);
  }) : e.func(t, (0, X._)`${Z.default.data}, ${ih(s)}`, n.$async, () => e.code(Li(r, s)).code(a));
}
function ih(e) {
  return (0, X._)`{${Z.default.instancePath}="", ${Z.default.parentData}, ${Z.default.parentDataProperty}, ${Z.default.rootData}=${Z.default.data}${e.dynamicRef ? (0, X._)`, ${Z.default.dynamicAnchors}={}` : X.nil}}={}`;
}
function ch(e, t) {
  e.if(Z.default.valCxt, () => {
    e.var(Z.default.instancePath, (0, X._)`${Z.default.valCxt}.${Z.default.instancePath}`), e.var(Z.default.parentData, (0, X._)`${Z.default.valCxt}.${Z.default.parentData}`), e.var(Z.default.parentDataProperty, (0, X._)`${Z.default.valCxt}.${Z.default.parentDataProperty}`), e.var(Z.default.rootData, (0, X._)`${Z.default.valCxt}.${Z.default.rootData}`), t.dynamicRef && e.var(Z.default.dynamicAnchors, (0, X._)`${Z.default.valCxt}.${Z.default.dynamicAnchors}`);
  }, () => {
    e.var(Z.default.instancePath, (0, X._)`""`), e.var(Z.default.parentData, (0, X._)`undefined`), e.var(Z.default.parentDataProperty, (0, X._)`undefined`), e.var(Z.default.rootData, Z.default.data), t.dynamicRef && e.var(Z.default.dynamicAnchors, (0, X._)`{}`);
  });
}
function lh(e) {
  const { schema: t, opts: r, gen: n } = e;
  Ml(e, () => {
    r.$comment && t.$comment && Ul(e), mh(e), n.let(Z.default.vErrors, null), n.let(Z.default.errors, 0), r.unevaluated && uh(e), zl(e), yh(e);
  });
}
function uh(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, X._)`${r}.evaluated`), t.if((0, X._)`${e.evaluated}.dynamicProps`, () => t.assign((0, X._)`${e.evaluated}.props`, (0, X._)`undefined`)), t.if((0, X._)`${e.evaluated}.dynamicItems`, () => t.assign((0, X._)`${e.evaluated}.items`, (0, X._)`undefined`));
}
function Li(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, X._)`/*# sourceURL=${r} */` : X.nil;
}
function dh(e, t) {
  if (Ll(e) && (Fl(e), Vl(e))) {
    fh(e, t);
    return;
  }
  (0, Dl.boolOrEmptySchema)(e, t);
}
function Vl({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Ll(e) {
  return typeof e.schema != "boolean";
}
function fh(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Ul(e), ph(e), $h(e);
  const a = n.const("_errs", Z.default.errors);
  zl(e, a), n.var(t, (0, X._)`${a} === ${Z.default.errors}`);
}
function Fl(e) {
  (0, Tt.checkUnknownRules)(e), hh(e);
}
function zl(e, t) {
  if (e.opts.jtd)
    return Fi(e, [], !1, t);
  const r = (0, Vi.getSchemaTypes)(e.schema), n = (0, Vi.coerceAndCheckDataType)(e, r);
  Fi(e, r, !n, t);
}
function hh(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, Tt.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function mh(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, Tt.checkStrictMode)(e, "default is ignored in the schema root");
}
function ph(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, ah.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function $h(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Ul({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, X._)`${Z.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, X.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, X._)`${Z.default.self}.opts.$comment(${a}, ${o}, ${l}.schema)`);
  }
}
function yh(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, X._)`${Z.default.errors} === 0`, () => t.return(Z.default.data), () => t.throw((0, X._)`new ${s}(${Z.default.vErrors})`)) : (t.assign((0, X._)`${n}.errors`, Z.default.vErrors), a.unevaluated && gh(e), t.return((0, X._)`${Z.default.errors} === 0`));
}
function gh({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof X.Name && e.assign((0, X._)`${t}.props`, r), n instanceof X.Name && e.assign((0, X._)`${t}.items`, n);
}
function Fi(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: l, opts: c, self: d } = e, { RULES: u } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, Tt.schemaHasRulesButRef)(a, u))) {
    s.block(() => Gl(e, "$ref", u.all.$ref.definition));
    return;
  }
  c.jtd || _h(e, t), s.block(() => {
    for (const w of u.rules)
      h(w);
    h(u.post);
  });
  function h(w) {
    (0, Aa.shouldUseGroup)(a, w) && (w.type ? (s.if((0, es.checkDataType)(w.type, o, c.strictNumbers)), zi(e, w), t.length === 1 && t[0] === w.type && r && (s.else(), (0, es.reportTypeError)(e)), s.endIf()) : zi(e, w), l || s.if((0, X._)`${Z.default.errors} === ${n || 0}`));
  }
}
function zi(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, sh.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, Aa.shouldUseRule)(n, a) && Gl(e, a.keyword, a.definition, t.type);
  });
}
function _h(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (vh(e, t), e.opts.allowUnionTypes || wh(e, t), Eh(e, e.dataTypes));
}
function vh(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      ql(e.dataTypes, r) || ka(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), Sh(e, t);
  }
}
function wh(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && ka(e, "use allowUnionTypes to allow union type keyword");
}
function Eh(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Aa.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => bh(t, o)) && ka(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function bh(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function ql(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function Sh(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    ql(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function ka(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, Tt.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Kl {
  constructor(t, r, n) {
    if ((0, rn.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Tt.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Hl(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, rn.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
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
    (t ? Jr.reportExtraError : Jr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Jr.reportError)(this, this.def.$dataError || Jr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Jr.resetErrorsCount)(this.gen, this.errsCount);
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
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, X.or)((0, X._)`${s} === undefined`, r)), t !== X.nil && n.assign(t, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== X.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, X.or)(o(), l());
    function o() {
      if (n.length) {
        if (!(r instanceof X.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, X._)`${(0, es.checkDataTypes)(c, r, a.opts.strictNumbers, es.DataType.Wrong)}`;
      }
      return X.nil;
    }
    function l() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, X._)`!${c}(${r})`;
      }
      return X.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Cs.getSubschema)(this.it, t);
    (0, Cs.extendSubschemaData)(n, this.it, t), (0, Cs.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return dh(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = Tt.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = Tt.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, X.Name)), !0;
  }
}
ut.KeywordCxt = Kl;
function Gl(e, t, r, n) {
  const s = new Kl(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, rn.funcKeywordCode)(s, r) : "macro" in r ? (0, rn.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, rn.funcKeywordCode)(s, r);
}
const Ph = /^\/(?:[^~]|~0|~1)*$/, Nh = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Hl(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return Z.default.rootData;
  if (e[0] === "/") {
    if (!Ph.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = Z.default.rootData;
  } else {
    const d = Nh.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const u = +d[1];
    if (s = d[2], s === "#") {
      if (u >= t)
        throw new Error(c("property/index", u));
      return n[t - u];
    }
    if (u > t)
      throw new Error(c("data", u));
    if (a = r[t - u], !s)
      return a;
  }
  let o = a;
  const l = s.split("/");
  for (const d of l)
    d && (a = (0, X._)`${a}${(0, X.getProperty)((0, Tt.unescapeJsonPointer)(d))}`, o = (0, X._)`${o} && ${a}`);
  return o;
  function c(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
ut.getData = Hl;
var Sn = {}, Ui;
function Ca() {
  if (Ui) return Sn;
  Ui = 1, Object.defineProperty(Sn, "__esModule", { value: !0 });
  class e extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return Sn.default = e, Sn;
}
var Vr = {};
Object.defineProperty(Vr, "__esModule", { value: !0 });
const Ds = Te;
let Rh = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Ds.resolveUrl)(t, r, n), this.missingSchema = (0, Ds.normalizeId)((0, Ds.getFullPath)(t, this.missingRef));
  }
};
Vr.default = Rh;
var Ue = {};
Object.defineProperty(Ue, "__esModule", { value: !0 });
Ue.resolveSchema = Ue.getCompilingSchema = Ue.resolveRef = Ue.compileSchema = Ue.SchemaEnv = void 0;
const rt = re, Oh = Ca(), Yt = Ye, it = Te, qi = L, Th = ut;
let fs = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, it.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
Ue.SchemaEnv = fs;
function Da(e) {
  const t = Bl.call(this, e);
  if (t)
    return t;
  const r = (0, it.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new rt.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let l;
  e.$async && (l = o.scopeValue("Error", {
    ref: Oh.default,
    code: (0, rt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: Yt.default.data,
    parentData: Yt.default.parentData,
    parentDataProperty: Yt.default.parentDataProperty,
    dataNames: [Yt.default.data],
    dataPathArr: [rt.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, rt.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: l,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: rt.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, rt._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, Th.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    u = `${o.scopeRefs(Yt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const $ = new Function(`${Yt.default.self}`, `${Yt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(c, { ref: $ }), $.errors = null, $.schema = e.schema, $.schemaEnv = e, e.$async && ($.$async = !0), this.opts.code.source === !0 && ($.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: v, items: _ } = d;
      $.evaluated = {
        props: v instanceof rt.Name ? void 0 : v,
        items: _ instanceof rt.Name ? void 0 : _,
        dynamicProps: v instanceof rt.Name,
        dynamicItems: _ instanceof rt.Name
      }, $.source && ($.source.evaluated = (0, rt.stringify)($.evaluated));
    }
    return e.validate = $, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
Ue.compileSchema = Da;
function Ih(e, t, r) {
  var n;
  r = (0, it.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = kh.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    o && (a = new fs({ schema: o, schemaId: l, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = jh.call(this, a);
}
Ue.resolveRef = Ih;
function jh(e) {
  return (0, it.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Da.call(this, e);
}
function Bl(e) {
  for (const t of this._compilations)
    if (Ah(t, e))
      return t;
}
Ue.getCompilingSchema = Bl;
function Ah(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function kh(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || hs.call(this, e, t);
}
function hs(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, it._getFullPath)(this.opts.uriResolver, r);
  let s = (0, it.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Ms.call(this, r, e);
  const a = (0, it.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const l = hs.call(this, e, o);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : Ms.call(this, r, l);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Da.call(this, o), a === (0, it.normalizeId)(t)) {
      const { schema: l } = o, { schemaId: c } = this.opts, d = l[c];
      return d && (s = (0, it.resolveUrl)(this.opts.uriResolver, s, d)), new fs({ schema: l, schemaId: c, root: e, baseId: s });
    }
    return Ms.call(this, r, o);
  }
}
Ue.resolveSchema = hs;
const Ch = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Ms(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, qi.unescapeFragment)(l)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !Ch.has(l) && d && (t = (0, it.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, qi.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, it.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = hs.call(this, n, l);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new fs({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const Dh = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Mh = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Vh = "object", Lh = [
  "$data"
], Fh = {
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
}, zh = !1, Uh = {
  $id: Dh,
  description: Mh,
  type: Vh,
  required: Lh,
  properties: Fh,
  additionalProperties: zh
};
var Ma = {}, ms = { exports: {} };
const qh = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), Wl = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u), Va = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu), Xl = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu), Kh = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
function Jl(e) {
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
const Gh = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function Ki(e) {
  return e.length = 0, !0;
}
function Hh(e, t, r) {
  if (e.length) {
    const n = Jl(e);
    if (n !== "")
      t.push(n);
    else
      return r.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function Bh(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, o = !1, l = Hh;
  for (let c = 0; c < e.length; c++) {
    const d = e[c];
    if (!(d === "[" || d === "]"))
      if (d === ":") {
        if (a === !0 && (o = !0), !l(s, n, r))
          break;
        if (++t > 7) {
          r.error = !0;
          break;
        }
        c > 0 && e[c - 1] === ":" && (a = !0), n.push(":");
        continue;
      } else if (d === "%") {
        if (!l(s, n, r))
          break;
        l = Ki;
      } else {
        s.push(d);
        continue;
      }
  }
  return s.length && (l === Ki ? r.zone = s.join("") : o ? n.push(s.join("")) : n.push(Jl(s))), r.address = n.join(""), r;
}
function Yl(e) {
  if (Wh(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = Bh(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function Wh(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function Xh(e) {
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
const Jh = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" }, Yh = /[@/?#:]/g, Qh = /[@/?#]/g;
function Ql(e, t) {
  const r = t ? Qh : Yh;
  return r.lastIndex = 0, e.replace(r, (n) => Jh[n]);
}
function Zh(e, t = !1) {
  if (e.indexOf("%") === -1)
    return e;
  let r = "";
  for (let n = 0; n < e.length; n++) {
    if (e[n] === "%" && n + 2 < e.length) {
      const s = e.slice(n + 1, n + 3);
      if (Va(s)) {
        const a = s.toUpperCase(), o = String.fromCharCode(parseInt(a, 16));
        t && Xl(o) ? r += o : r += "%" + a, n += 2;
        continue;
      }
    }
    r += e[n];
  }
  return r;
}
function xh(e) {
  let t = "";
  for (let r = 0; r < e.length; r++) {
    if (e[r] === "%" && r + 2 < e.length) {
      const n = e.slice(r + 1, r + 3);
      if (Va(n)) {
        const s = n.toUpperCase(), a = String.fromCharCode(parseInt(s, 16));
        a !== "." && Xl(a) ? t += a : t += "%" + s, r += 2;
        continue;
      }
    }
    Kh(e[r]) ? t += e[r] : t += escape(e[r]);
  }
  return t;
}
function em(e) {
  let t = "";
  for (let r = 0; r < e.length; r++) {
    if (e[r] === "%" && r + 2 < e.length) {
      const n = e.slice(r + 1, r + 3);
      if (Va(n)) {
        t += "%" + n.toUpperCase(), r += 2;
        continue;
      }
    }
    t += escape(e[r]);
  }
  return t;
}
function tm(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    if (!Wl(r)) {
      const n = Yl(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = Ql(r, !1);
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var Zl = {
  nonSimpleDomain: Gh,
  recomposeAuthority: tm,
  reescapeHostDelimiters: Ql,
  normalizePercentEncoding: Zh,
  normalizePathEncoding: xh,
  escapePreservingEscapes: em,
  removeDotSegments: Xh,
  isIPv4: Wl,
  isUUID: qh,
  normalizeIPv6: Yl
};
const { isUUID: rm } = Zl, nm = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function xl(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function eu(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function tu(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function sm(e) {
  return e.secure = xl(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function am(e) {
  if ((e.port === (xl(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function om(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(nm);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, a = La(s);
    e.path = void 0, a && (e = a.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function im(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, a = La(s);
  a && (e = a.serialize(e, t));
  const o = e, l = e.nss;
  return o.path = `${n || t.nid}:${l}`, t.skipEscape = !0, o;
}
function cm(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !rm(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function lm(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const ru = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: eu,
    serialize: tu
  }
), um = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: ru.domainHost,
    parse: eu,
    serialize: tu
  }
), Hn = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: sm,
    serialize: am
  }
), dm = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: Hn.domainHost,
    parse: Hn.parse,
    serialize: Hn.serialize
  }
), fm = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: om,
    serialize: im,
    skipNormalize: !0
  }
), hm = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: cm,
    serialize: lm,
    skipNormalize: !0
  }
), ts = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: ru,
    https: um,
    ws: Hn,
    wss: dm,
    urn: fm,
    "urn:uuid": hm
  }
);
Object.setPrototypeOf(ts, null);
function La(e) {
  return e && (ts[
    /** @type {SchemeName} */
    e
  ] || ts[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var mm = {
  SCHEMES: ts,
  getSchemeHandler: La
};
const { normalizeIPv6: pm, removeDotSegments: xr, recomposeAuthority: $m, normalizePercentEncoding: ym, normalizePathEncoding: gm, escapePreservingEscapes: _m, reescapeHostDelimiters: vm, isIPv4: wm, nonSimpleDomain: Em } = Zl, { SCHEMES: bm, getSchemeHandler: nu } = mm;
function Sm(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  Tm(e, t) : typeof e == "object" && (e = /** @type {T} */
  Cr(dr(e, t), t)), e;
}
function Pm(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = su(Cr(e, n), Cr(t, n), n, !0);
  return n.skipEscape = !0, dr(s, n);
}
function su(e, t, r, n) {
  const s = {};
  return n || (e = Cr(dr(e, r), r), t = Cr(dr(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = xr(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = xr(t.path || ""), s.query = t.query) : (t.path ? (t.path[0] === "/" ? s.path = xr(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = xr(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function Nm(e, t, r) {
  const n = Gi(e, r), s = Gi(t, r);
  return n !== void 0 && s !== void 0 && n.toLowerCase() === s.toLowerCase();
}
function dr(e, t) {
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
  }, n = Object.assign({}, t), s = [], a = nu(n.scheme || r.scheme);
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = ym(r.path) : (r.path = _m(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const o = $m(r);
  if (o !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(o), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let l = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (l = xr(l)), o === void 0 && l[0] === "/" && l[1] === "/" && (l = "/%2F" + l.slice(2)), s.push(l);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const Rm = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Om(e, t) {
  if (t[2] !== void 0 && e.path && e.path[0] !== "/")
    return 'URI path must start with "/" when authority is present.';
  if (typeof e.port == "number" && (e.port < 0 || e.port > 65535))
    return "URI port is malformed.";
}
function au(e, t) {
  const r = Object.assign({}, t), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  };
  let s = !1, a = !1;
  r.reference === "suffix" && (r.scheme ? e = r.scheme + ":" + e : e = "//" + e);
  const o = e.match(Rm);
  if (o) {
    n.scheme = o[1], n.userinfo = o[3], n.host = o[4], n.port = parseInt(o[5], 10), n.path = o[6] || "", n.query = o[7], n.fragment = o[8], isNaN(n.port) && (n.port = o[5]);
    const l = Om(n, o);
    if (l !== void 0 && (n.error = n.error || l, s = !0), n.host)
      if (wm(n.host) === !1) {
        const u = pm(n.host);
        n.host = u.host.toLowerCase(), a = u.isIPV6;
      } else
        a = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const c = nu(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!c || !c.unicodeSupport) && n.host && (r.domainHost || c && c.domainHost) && a === !1 && Em(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (d) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + d;
      }
    if ((!c || c && !c.skipNormalize) && (e.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = vm(unescape(n.host), a))), n.path && (n.path = gm(n.path)), n.fragment))
      try {
        n.fragment = encodeURI(decodeURIComponent(n.fragment));
      } catch {
        n.error = n.error || "URI malformed";
      }
    c && c.parse && c.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return { parsed: n, malformedAuthorityOrPort: s };
}
function Cr(e, t) {
  return au(e, t).parsed;
}
function Tm(e, t) {
  return ou(e, t).normalized;
}
function ou(e, t) {
  const { parsed: r, malformedAuthorityOrPort: n } = au(e, t);
  return {
    normalized: n ? e : dr(r, t),
    malformedAuthorityOrPort: n
  };
}
function Gi(e, t) {
  if (typeof e == "string") {
    const { normalized: r, malformedAuthorityOrPort: n } = ou(e, t);
    return n ? void 0 : r;
  }
  if (typeof e == "object")
    return dr(e, t);
}
const Fa = {
  SCHEMES: bm,
  normalize: Sm,
  resolve: Pm,
  resolveComponent: su,
  equal: Nm,
  serialize: dr,
  parse: Cr
};
ms.exports = Fa;
ms.exports.default = Fa;
ms.exports.fastUri = Fa;
var iu = ms.exports;
Object.defineProperty(Ma, "__esModule", { value: !0 });
const cu = iu;
cu.code = 'require("ajv/dist/runtime/uri").default';
Ma.default = cu;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = ut;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = re;
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
  const n = Ca(), s = Vr, a = ur, o = Ue, l = re, c = Te, d = Ee, u = L, h = Uh, w = Ma, $ = (P, p) => new RegExp(P, p);
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
    var p, S, y, i, f, b, j, A, G, U, N, T, k, M, H, x, ge, Fe, Se, Pe, _e, mt, je, Wt, Xt;
    const et = P.strict, Jt = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, Hr = Jt === !0 || Jt === void 0 ? 1 : Jt || 0, Br = (y = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && y !== void 0 ? y : $, Ts = (i = P.uriResolver) !== null && i !== void 0 ? i : w.default;
    return {
      strictSchema: (b = (f = P.strictSchema) !== null && f !== void 0 ? f : et) !== null && b !== void 0 ? b : !0,
      strictNumbers: (A = (j = P.strictNumbers) !== null && j !== void 0 ? j : et) !== null && A !== void 0 ? A : !0,
      strictTypes: (U = (G = P.strictTypes) !== null && G !== void 0 ? G : et) !== null && U !== void 0 ? U : "log",
      strictTuples: (T = (N = P.strictTuples) !== null && N !== void 0 ? N : et) !== null && T !== void 0 ? T : "log",
      strictRequired: (M = (k = P.strictRequired) !== null && k !== void 0 ? k : et) !== null && M !== void 0 ? M : !1,
      code: P.code ? { ...P.code, optimize: Hr, regExp: Br } : { optimize: Hr, regExp: Br },
      loopRequired: (H = P.loopRequired) !== null && H !== void 0 ? H : E,
      loopEnum: (x = P.loopEnum) !== null && x !== void 0 ? x : E,
      meta: (ge = P.meta) !== null && ge !== void 0 ? ge : !0,
      messages: (Fe = P.messages) !== null && Fe !== void 0 ? Fe : !0,
      inlineRefs: (Se = P.inlineRefs) !== null && Se !== void 0 ? Se : !0,
      schemaId: (Pe = P.schemaId) !== null && Pe !== void 0 ? Pe : "$id",
      addUsedSchema: (_e = P.addUsedSchema) !== null && _e !== void 0 ? _e : !0,
      validateSchema: (mt = P.validateSchema) !== null && mt !== void 0 ? mt : !0,
      validateFormats: (je = P.validateFormats) !== null && je !== void 0 ? je : !0,
      unicodeRegExp: (Wt = P.unicodeRegExp) !== null && Wt !== void 0 ? Wt : !0,
      int32range: (Xt = P.int32range) !== null && Xt !== void 0 ? Xt : !0,
      uriResolver: Ts
    };
  }
  class O {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...R(p) };
      const { es5: S, lines: y } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: _, es5: S, lines: y }), this.logger = J(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), I.call(this, g, p, "NOT SUPPORTED"), I.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ye.call(this), p.formats && le.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && he.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), Y.call(this), p.validateFormats = i;
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
        const T = this._addSchema(U, N);
        return T.validate || b.call(this, T);
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
      return S = (0, c.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(p, y, S, i, !0), this;
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
        const { schemaId: y } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: y });
        if (S = o.resolveSchema.call(this, i, p), !S)
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
          return y && (y = (0, c.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
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
      y = (0, c.normalizeId)(b || y);
      const G = c.getSchemaRefs.call(this, p, y);
      return A = new o.SchemaEnv({ schema: p, schemaId: j, meta: S, baseId: y, localRefs: G }), this._cache.set(A.schema, A), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = A), i && this.validateSchema(p, !0), A;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : o.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const S = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, p);
      } finally {
        this.opts = S;
      }
    }
  }
  O.ValidationError = n.default, O.MissingRefError = s.default, e.default = O;
  function I(P, p, S, y = "error") {
    for (const i in P) {
      const f = i;
      f in p && this.logger[y](`${S}: option ${i}. ${P[f]}`);
    }
  }
  function K(P) {
    return P = (0, c.normalizeId)(P), this.schemas[P] || this.refs[P];
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
    p.before ? V.call(this, b, j, p.before) : b.rules.push(j), f.all[P] = j, (y = p.implements) === null || y === void 0 || y.forEach((A) => this.addKeyword(A));
  }
  function V(P, p, S) {
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
})(pl);
var za = {}, Ua = {}, qa = {};
Object.defineProperty(qa, "__esModule", { value: !0 });
const Im = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
qa.default = Im;
var It = {};
Object.defineProperty(It, "__esModule", { value: !0 });
It.callRef = It.getValidate = void 0;
const jm = Vr, Hi = ie, He = re, $r = Ye, Bi = Ue, Pn = L, Am = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: l, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = Bi.resolveRef.call(c, d, s, r);
    if (u === void 0)
      throw new jm.default(n.opts.uriResolver, s, r);
    if (u instanceof Bi.SchemaEnv)
      return w(u);
    return $(u);
    function h() {
      if (a === d)
        return Bn(e, o, a, a.$async);
      const v = t.scopeValue("root", { ref: d });
      return Bn(e, (0, He._)`${v}.validate`, d, d.$async);
    }
    function w(v) {
      const _ = lu(e, v);
      Bn(e, _, v, v.$async);
    }
    function $(v) {
      const _ = t.scopeValue("schema", l.code.source === !0 ? { ref: v, code: (0, He.stringify)(v) } : { ref: v }), g = t.name("valid"), m = e.subschema({
        schema: v,
        dataTypes: [],
        schemaPath: He.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, g);
      e.mergeEvaluated(m), e.ok(g);
    }
  }
};
function lu(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, He._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
It.getValidate = lu;
function Bn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: l, opts: c } = a, d = c.passContext ? $r.default.this : He.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, He._)`await ${(0, Hi.callValidateCode)(e, t, d)}`), $(t), o || s.assign(v, !0);
    }, (_) => {
      s.if((0, He._)`!(${_} instanceof ${a.ValidationError})`, () => s.throw(_)), w(_), o || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, Hi.callValidateCode)(e, t, d), () => $(t), () => w(t));
  }
  function w(v) {
    const _ = (0, He._)`${v}.errors`;
    s.assign($r.default.vErrors, (0, He._)`${$r.default.vErrors} === null ? ${_} : ${$r.default.vErrors}.concat(${_})`), s.assign($r.default.errors, (0, He._)`${$r.default.vErrors}.length`);
  }
  function $(v) {
    var _;
    if (!a.opts.unevaluated)
      return;
    const g = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (a.props !== !0)
      if (g && !g.dynamicProps)
        g.props !== void 0 && (a.props = Pn.mergeEvaluated.props(s, g.props, a.props));
      else {
        const m = s.var("props", (0, He._)`${v}.evaluated.props`);
        a.props = Pn.mergeEvaluated.props(s, m, a.props, He.Name);
      }
    if (a.items !== !0)
      if (g && !g.dynamicItems)
        g.items !== void 0 && (a.items = Pn.mergeEvaluated.items(s, g.items, a.items));
      else {
        const m = s.var("items", (0, He._)`${v}.evaluated.items`);
        a.items = Pn.mergeEvaluated.items(s, m, a.items, He.Name);
      }
  }
}
It.callRef = Bn;
It.default = Am;
Object.defineProperty(Ua, "__esModule", { value: !0 });
const km = qa, Cm = It, Dm = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  km.default,
  Cm.default
];
Ua.default = Dm;
var Ka = {}, Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
const rs = re, Dt = rs.operators, ns = {
  maximum: { okStr: "<=", ok: Dt.LTE, fail: Dt.GT },
  minimum: { okStr: ">=", ok: Dt.GTE, fail: Dt.LT },
  exclusiveMaximum: { okStr: "<", ok: Dt.LT, fail: Dt.GTE },
  exclusiveMinimum: { okStr: ">", ok: Dt.GT, fail: Dt.LTE }
}, Mm = {
  message: ({ keyword: e, schemaCode: t }) => (0, rs.str)`must be ${ns[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, rs._)`{comparison: ${ns[e].okStr}, limit: ${t}}`
}, Vm = {
  keyword: Object.keys(ns),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Mm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, rs._)`${r} ${ns[t].fail} ${n} || isNaN(${r})`);
  }
};
Ga.default = Vm;
var Ha = {};
Object.defineProperty(Ha, "__esModule", { value: !0 });
const nn = re, Lm = {
  message: ({ schemaCode: e }) => (0, nn.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, nn._)`{multipleOf: ${e}}`
}, Fm = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Lm,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), l = a ? (0, nn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, nn._)`${o} !== parseInt(${o})`;
    e.fail$data((0, nn._)`(${n} === 0 || (${o} = ${r}/${n}, ${l}))`);
  }
};
Ha.default = Fm;
var Ba = {}, Wa = {};
Object.defineProperty(Wa, "__esModule", { value: !0 });
function uu(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Wa.default = uu;
uu.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Ba, "__esModule", { value: !0 });
const er = re, zm = L, Um = Wa, qm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, er.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, er._)`{limit: ${e}}`
}, Km = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: qm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? er.operators.GT : er.operators.LT, o = s.opts.unicode === !1 ? (0, er._)`${r}.length` : (0, er._)`${(0, zm.useFunc)(e.gen, Um.default)}(${r})`;
    e.fail$data((0, er._)`${o} ${a} ${n}`);
  }
};
Ba.default = Km;
var Xa = {};
Object.defineProperty(Xa, "__esModule", { value: !0 });
const Gm = ie, Hm = L, br = re, Bm = {
  message: ({ schemaCode: e }) => (0, br.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, br._)`{pattern: ${e}}`
}, Wm = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Bm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e, l = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, br._)`new RegExp` : (0, Hm.useFunc)(t, c), u = t.let("valid");
      t.try(() => t.assign(u, (0, br._)`${d}(${a}, ${l}).test(${r})`), () => t.assign(u, !1)), e.fail$data((0, br._)`!${u}`);
    } else {
      const c = (0, Gm.usePattern)(e, s);
      e.fail$data((0, br._)`!${c}.test(${r})`);
    }
  }
};
Xa.default = Wm;
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
const sn = re, Xm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, sn.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, sn._)`{limit: ${e}}`
}, Jm = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Xm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? sn.operators.GT : sn.operators.LT;
    e.fail$data((0, sn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Ja.default = Jm;
var Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
const Yr = ie, an = re, Ym = L, Qm = {
  message: ({ params: { missingProperty: e } }) => (0, an.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, an._)`{missingProperty: ${e}}`
}, Zm = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Qm,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: l } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= l.loopRequired;
    if (o.allErrors ? d() : u(), l.strictRequired) {
      const $ = e.parentSchema.properties, { definedProperties: v } = e.it;
      for (const _ of r)
        if (($ == null ? void 0 : $[_]) === void 0 && !v.has(_)) {
          const g = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${_}" is not defined at "${g}" (strictRequired)`;
          (0, Ym.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(an.nil, h);
      else
        for (const $ of r)
          (0, Yr.checkReportMissingProp)(e, $);
    }
    function u() {
      const $ = t.let("missing");
      if (c || a) {
        const v = t.let("valid", !0);
        e.block$data(v, () => w($, v)), e.ok(v);
      } else
        t.if((0, Yr.checkMissingProp)(e, r, $)), (0, Yr.reportMissingProp)(e, $), t.else();
    }
    function h() {
      t.forOf("prop", n, ($) => {
        e.setParams({ missingProperty: $ }), t.if((0, Yr.noPropertyInData)(t, s, $, l.ownProperties), () => e.error());
      });
    }
    function w($, v) {
      e.setParams({ missingProperty: $ }), t.forOf($, n, () => {
        t.assign(v, (0, Yr.propertyInData)(t, s, $, l.ownProperties)), t.if((0, an.not)(v), () => {
          e.error(), t.break();
        });
      }, an.nil);
    }
  }
};
Ya.default = Zm;
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
const on = re, xm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, on.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, on._)`{limit: ${e}}`
}, ep = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: xm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? on.operators.GT : on.operators.LT;
    e.fail$data((0, on._)`${r}.length ${s} ${n}`);
  }
};
Qa.default = ep;
var Za = {}, gn = {};
Object.defineProperty(gn, "__esModule", { value: !0 });
const du = ds;
du.code = 'require("ajv/dist/runtime/equal").default';
gn.default = du;
Object.defineProperty(Za, "__esModule", { value: !0 });
const Vs = Ee, Re = re, tp = L, rp = gn, np = {
  message: ({ params: { i: e, j: t } }) => (0, Re.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Re._)`{i: ${e}, j: ${t}}`
}, sp = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: np,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: l } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, Vs.getSchemaTypes)(a.items) : [];
    e.block$data(c, u, (0, Re._)`${o} === false`), e.ok(c);
    function u() {
      const v = t.let("i", (0, Re._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: v, j: _ }), t.assign(c, !0), t.if((0, Re._)`${v} > 1`, () => (h() ? w : $)(v, _));
    }
    function h() {
      return d.length > 0 && !d.some((v) => v === "object" || v === "array");
    }
    function w(v, _) {
      const g = t.name("item"), m = (0, Vs.checkDataTypes)(d, g, l.opts.strictNumbers, Vs.DataType.Wrong), E = t.const("indices", (0, Re._)`{}`);
      t.for((0, Re._)`;${v}--;`, () => {
        t.let(g, (0, Re._)`${r}[${v}]`), t.if(m, (0, Re._)`continue`), d.length > 1 && t.if((0, Re._)`typeof ${g} == "string"`, (0, Re._)`${g} += "_"`), t.if((0, Re._)`typeof ${E}[${g}] == "number"`, () => {
          t.assign(_, (0, Re._)`${E}[${g}]`), e.error(), t.assign(c, !1).break();
        }).code((0, Re._)`${E}[${g}] = ${v}`);
      });
    }
    function $(v, _) {
      const g = (0, tp.useFunc)(t, rp.default), m = t.name("outer");
      t.label(m).for((0, Re._)`;${v}--;`, () => t.for((0, Re._)`${_} = ${v}; ${_}--;`, () => t.if((0, Re._)`${g}(${r}[${v}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Za.default = sp;
var xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
const ia = re, ap = L, op = gn, ip = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, ia._)`{allowedValue: ${e}}`
}, cp = {
  keyword: "const",
  $data: !0,
  error: ip,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, ia._)`!${(0, ap.useFunc)(t, op.default)}(${r}, ${s})`) : e.fail((0, ia._)`${a} !== ${r}`);
  }
};
xa.default = cp;
var eo = {};
Object.defineProperty(eo, "__esModule", { value: !0 });
const en = re, lp = L, up = gn, dp = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, en._)`{allowedValues: ${e}}`
}, fp = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: dp,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, lp.useFunc)(t, up.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const $ = t.const("vSchema", a);
      u = (0, en.or)(...s.map((v, _) => w($, _)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", a, ($) => t.if((0, en._)`${d()}(${r}, ${$})`, () => t.assign(u, !0).break()));
    }
    function w($, v) {
      const _ = s[v];
      return typeof _ == "object" && _ !== null ? (0, en._)`${d()}(${r}, ${$}[${v}])` : (0, en._)`${r} === ${_}`;
    }
  }
};
eo.default = fp;
Object.defineProperty(Ka, "__esModule", { value: !0 });
const hp = Ga, mp = Ha, pp = Ba, $p = Xa, yp = Ja, gp = Ya, _p = Qa, vp = Za, wp = xa, Ep = eo, bp = [
  // number
  hp.default,
  mp.default,
  // string
  pp.default,
  $p.default,
  // object
  yp.default,
  gp.default,
  // array
  _p.default,
  vp.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  wp.default,
  Ep.default
];
Ka.default = bp;
var to = {}, Lr = {};
Object.defineProperty(Lr, "__esModule", { value: !0 });
Lr.validateAdditionalItems = void 0;
const tr = re, ca = L, Sp = {
  message: ({ params: { len: e } }) => (0, tr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, tr._)`{limit: ${e}}`
}, Pp = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Sp,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, ca.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    fu(e, n);
  }
};
function fu(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const l = r.const("len", (0, tr._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, tr._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, ca.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, tr._)`${l} <= ${t.length}`);
    r.if((0, tr.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: a, dataProp: u, dataPropType: ca.Type.Num }, d), o.allErrors || r.if((0, tr.not)(d), () => r.break());
    });
  }
}
Lr.validateAdditionalItems = fu;
Lr.default = Pp;
var ro = {}, Fr = {};
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.validateTuple = void 0;
const Wi = re, Wn = L, Np = ie, Rp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return hu(e, "additionalItems", t);
    r.items = !0, !(0, Wn.alwaysValidSchema)(r, t) && e.ok((0, Np.validateArray)(e));
  }
};
function hu(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = Wn.mergeEvaluated.items(n, r.length, l.items));
  const c = n.name("valid"), d = n.const("len", (0, Wi._)`${a}.length`);
  r.forEach((h, w) => {
    (0, Wn.alwaysValidSchema)(l, h) || (n.if((0, Wi._)`${d} > ${w}`, () => e.subschema({
      keyword: o,
      schemaProp: w,
      dataProp: w
    }, c)), e.ok(c));
  });
  function u(h) {
    const { opts: w, errSchemaPath: $ } = l, v = r.length, _ = v === h.minItems && (v === h.maxItems || h[t] === !1);
    if (w.strictTuples && !_) {
      const g = `"${o}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${$}"`;
      (0, Wn.checkStrictMode)(l, g, w.strictTuples);
    }
  }
}
Fr.validateTuple = hu;
Fr.default = Rp;
Object.defineProperty(ro, "__esModule", { value: !0 });
const Op = Fr, Tp = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, Op.validateTuple)(e, "items")
};
ro.default = Tp;
var no = {};
Object.defineProperty(no, "__esModule", { value: !0 });
const Xi = re, Ip = L, jp = ie, Ap = Lr, kp = {
  message: ({ params: { len: e } }) => (0, Xi.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Xi._)`{limit: ${e}}`
}, Cp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: kp,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, Ip.alwaysValidSchema)(n, t) && (s ? (0, Ap.validateAdditionalItems)(e, s) : e.ok((0, jp.validateArray)(e)));
  }
};
no.default = Cp;
var so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
const Ze = re, Nn = L, Dp = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ze.str)`must contain at least ${e} valid item(s)` : (0, Ze.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ze._)`{minContains: ${e}}` : (0, Ze._)`{minContains: ${e}, maxContains: ${t}}`
}, Mp = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Dp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, l;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, l = d) : o = 1;
    const u = t.const("len", (0, Ze._)`${s}.length`);
    if (e.setParams({ min: o, max: l }), l === void 0 && o === 0) {
      (0, Nn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && o > l) {
      (0, Nn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Nn.alwaysValidSchema)(a, r)) {
      let _ = (0, Ze._)`${u} >= ${o}`;
      l !== void 0 && (_ = (0, Ze._)`${_} && ${u} <= ${l}`), e.pass(_);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    l === void 0 && o === 1 ? $(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, Ze._)`${s}.length > 0`, w)) : (t.let(h, !1), w()), e.result(h, () => e.reset());
    function w() {
      const _ = t.name("_valid"), g = t.let("count", 0);
      $(_, () => t.if(_, () => v(g)));
    }
    function $(_, g) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: Nn.Type.Num,
          compositeRule: !0
        }, _), g();
      });
    }
    function v(_) {
      t.code((0, Ze._)`${_}++`), l === void 0 ? t.if((0, Ze._)`${_} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, Ze._)`${_} > ${l}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, Ze._)`${_} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
so.default = Mp;
var ps = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = re, r = L, n = ie;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${c},
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
    code(c) {
      const [d, u] = a(c);
      o(c, d), l(c, u);
    }
  };
  function a({ schema: c }) {
    const d = {}, u = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const w = Array.isArray(c[h]) ? d : u;
      w[h] = c[h];
    }
    return [d, u];
  }
  function o(c, d = c.schema) {
    const { gen: u, data: h, it: w } = c;
    if (Object.keys(d).length === 0)
      return;
    const $ = u.let("missing");
    for (const v in d) {
      const _ = d[v];
      if (_.length === 0)
        continue;
      const g = (0, n.propertyInData)(u, h, v, w.opts.ownProperties);
      c.setParams({
        property: v,
        depsCount: _.length,
        deps: _.join(", ")
      }), w.allErrors ? u.if(g, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (u.if((0, t._)`${g} && (${(0, n.checkMissingProp)(c, _, $)})`), (0, n.reportMissingProp)(c, $), u.else());
    }
  }
  e.validatePropertyDeps = o;
  function l(c, d = c.schema) {
    const { gen: u, data: h, keyword: w, it: $ } = c, v = u.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)($, d[_]) || (u.if(
        (0, n.propertyInData)(u, h, _, $.opts.ownProperties),
        () => {
          const g = c.subschema({ keyword: w, schemaProp: _ }, v);
          c.mergeValidEvaluated(g, v);
        },
        () => u.var(v, !0)
        // TODO var
      ), c.ok(v));
  }
  e.validateSchemaDeps = l, e.default = s;
})(ps);
var ao = {};
Object.defineProperty(ao, "__esModule", { value: !0 });
const mu = re, Vp = L, Lp = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, mu._)`{propertyName: ${e.propertyName}}`
}, Fp = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Lp,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Vp.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, mu.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
ao.default = Fp;
var $s = {};
Object.defineProperty($s, "__esModule", { value: !0 });
const Rn = ie, at = re, zp = Ye, On = L, Up = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, at._)`{additionalProperty: ${e.additionalProperty}}`
}, qp = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Up,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, On.alwaysValidSchema)(o, r))
      return;
    const d = (0, Rn.allSchemaProperties)(n.properties), u = (0, Rn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, at._)`${a} === ${zp.default.errors}`);
    function h() {
      t.forIn("key", s, (g) => {
        !d.length && !u.length ? v(g) : t.if(w(g), () => v(g));
      });
    }
    function w(g) {
      let m;
      if (d.length > 8) {
        const E = (0, On.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, Rn.isOwnProperty)(t, E, g);
      } else d.length ? m = (0, at.or)(...d.map((E) => (0, at._)`${g} === ${E}`)) : m = at.nil;
      return u.length && (m = (0, at.or)(m, ...u.map((E) => (0, at._)`${(0, Rn.usePattern)(e, E)}.test(${g})`))), (0, at.not)(m);
    }
    function $(g) {
      t.code((0, at._)`delete ${s}[${g}]`);
    }
    function v(g) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        $(g);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: g }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, On.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_(g, m, !1), t.if((0, at.not)(m), () => {
          e.reset(), $(g);
        })) : (_(g, m), l || t.if((0, at.not)(m), () => t.break()));
      }
    }
    function _(g, m, E) {
      const R = {
        keyword: "additionalProperties",
        dataProp: g,
        dataPropType: On.Type.Str
      };
      E === !1 && Object.assign(R, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(R, m);
    }
  }
};
$s.default = qp;
var oo = {};
Object.defineProperty(oo, "__esModule", { value: !0 });
const Kp = ut, Ji = ie, Ls = L, Yi = $s, Gp = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Yi.default.code(new Kp.KeywordCxt(a, Yi.default, "additionalProperties"));
    const o = (0, Ji.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Ls.mergeEvaluated.props(t, (0, Ls.toHash)(o), a.props));
    const l = o.filter((h) => !(0, Ls.alwaysValidSchema)(a, r[h]));
    if (l.length === 0)
      return;
    const c = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, Ji.propertyInData)(t, s, h, a.opts.ownProperties)), u(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
oo.default = Gp;
var io = {};
Object.defineProperty(io, "__esModule", { value: !0 });
const Qi = ie, Tn = re, Zi = L, xi = L, Hp = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, l = (0, Qi.allSchemaProperties)(r), c = l.filter((_) => (0, Zi.alwaysValidSchema)(a, r[_]));
    if (l.length === 0 || c.length === l.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, u = t.name("valid");
    a.props !== !0 && !(a.props instanceof Tn.Name) && (a.props = (0, xi.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    w();
    function w() {
      for (const _ of l)
        d && $(_), a.allErrors ? v(_) : (t.var(u, !0), v(_), t.if(u));
    }
    function $(_) {
      for (const g in d)
        new RegExp(_).test(g) && (0, Zi.checkStrictMode)(a, `property ${g} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function v(_) {
      t.forIn("key", n, (g) => {
        t.if((0, Tn._)`${(0, Qi.usePattern)(e, _)}.test(${g})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: g,
            dataPropType: xi.Type.Str
          }, u), a.opts.unevaluated && h !== !0 ? t.assign((0, Tn._)`${h}[${g}]`, !0) : !m && !a.allErrors && t.if((0, Tn.not)(u), () => t.break());
        });
      });
    }
  }
};
io.default = Hp;
var co = {};
Object.defineProperty(co, "__esModule", { value: !0 });
const Bp = L, Wp = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Bp.alwaysValidSchema)(n, r)) {
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
co.default = Wp;
var lo = {};
Object.defineProperty(lo, "__esModule", { value: !0 });
const Xp = ie, Jp = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Xp.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
lo.default = Jp;
var uo = {};
Object.defineProperty(uo, "__esModule", { value: !0 });
const Xn = re, Yp = L, Qp = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Xn._)`{passingSchemas: ${e.passing}}`
}, Zp = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Qp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), l = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: l }), t.block(d), e.result(o, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((u, h) => {
        let w;
        (0, Yp.alwaysValidSchema)(s, u) ? t.var(c, !0) : w = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, Xn._)`${c} && ${o}`).assign(o, !1).assign(l, (0, Xn._)`[${l}, ${h}]`).else(), t.if(c, () => {
          t.assign(o, !0), t.assign(l, h), w && e.mergeEvaluated(w, Xn.Name);
        });
      });
    }
  }
};
uo.default = Zp;
var fo = {};
Object.defineProperty(fo, "__esModule", { value: !0 });
const xp = L, e$ = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, xp.alwaysValidSchema)(n, a))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
fo.default = e$;
var ho = {};
Object.defineProperty(ho, "__esModule", { value: !0 });
const ss = re, pu = L, t$ = {
  message: ({ params: e }) => (0, ss.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, ss._)`{failingKeyword: ${e.ifClause}}`
}, r$ = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: t$,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, pu.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = ec(n, "then"), a = ec(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), l = t.name("_valid");
    if (c(), e.reset(), s && a) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, ss.not)(l), d("else"));
    e.pass(o, () => e.error(!0));
    function c() {
      const u = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, l);
      e.mergeEvaluated(u);
    }
    function d(u, h) {
      return () => {
        const w = e.subschema({ keyword: u }, l);
        t.assign(o, l), e.mergeValidEvaluated(w, o), h ? t.assign(h, (0, ss._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function ec(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, pu.alwaysValidSchema)(e, r);
}
ho.default = r$;
var mo = {};
Object.defineProperty(mo, "__esModule", { value: !0 });
const n$ = L, s$ = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, n$.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
mo.default = s$;
Object.defineProperty(to, "__esModule", { value: !0 });
const a$ = Lr, o$ = ro, i$ = Fr, c$ = no, l$ = so, u$ = ps, d$ = ao, f$ = $s, h$ = oo, m$ = io, p$ = co, $$ = lo, y$ = uo, g$ = fo, _$ = ho, v$ = mo;
function w$(e = !1) {
  const t = [
    // any
    p$.default,
    $$.default,
    y$.default,
    g$.default,
    _$.default,
    v$.default,
    // object
    d$.default,
    f$.default,
    u$.default,
    h$.default,
    m$.default
  ];
  return e ? t.push(o$.default, c$.default) : t.push(a$.default, i$.default), t.push(l$.default), t;
}
to.default = w$;
var po = {}, zr = {};
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.dynamicAnchor = void 0;
const Fs = re, E$ = Ye, tc = Ue, b$ = It, S$ = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => $u(e, e.schema)
};
function $u(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, Fs._)`${E$.default.dynamicAnchors}${(0, Fs.getProperty)(t)}`, a = n.errSchemaPath === "#" ? n.validateName : P$(e);
  r.if((0, Fs._)`!${s}`, () => r.assign(s, a));
}
zr.dynamicAnchor = $u;
function P$(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: a, localRefs: o, meta: l } = t.root, { schemaId: c } = n.opts, d = new tc.SchemaEnv({ schema: r, schemaId: c, root: s, baseId: a, localRefs: o, meta: l });
  return tc.compileSchema.call(n, d), (0, b$.getValidate)(e, d);
}
zr.default = S$;
var Ur = {};
Object.defineProperty(Ur, "__esModule", { value: !0 });
Ur.dynamicRef = void 0;
const rc = re, N$ = Ye, nc = It, R$ = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => yu(e, e.schema)
};
function yu(e, t) {
  const { gen: r, keyword: n, it: s } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const a = t.slice(1);
  if (s.allErrors)
    o();
  else {
    const c = r.let("valid", !1);
    o(c), e.ok(c);
  }
  function o(c) {
    if (s.schemaEnv.root.dynamicAnchors[a]) {
      const d = r.let("_v", (0, rc._)`${N$.default.dynamicAnchors}${(0, rc.getProperty)(a)}`);
      r.if(d, l(d, c), l(s.validateName, c));
    } else
      l(s.validateName, c)();
  }
  function l(c, d) {
    return d ? () => r.block(() => {
      (0, nc.callRef)(e, c), r.let(d, !0);
    }) : () => (0, nc.callRef)(e, c);
  }
}
Ur.dynamicRef = yu;
Ur.default = R$;
var $o = {};
Object.defineProperty($o, "__esModule", { value: !0 });
const O$ = zr, T$ = L, I$ = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, O$.dynamicAnchor)(e, "") : (0, T$.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
$o.default = I$;
var yo = {};
Object.defineProperty(yo, "__esModule", { value: !0 });
const j$ = Ur, A$ = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, j$.dynamicRef)(e, e.schema)
};
yo.default = A$;
Object.defineProperty(po, "__esModule", { value: !0 });
const k$ = zr, C$ = Ur, D$ = $o, M$ = yo, V$ = [k$.default, C$.default, D$.default, M$.default];
po.default = V$;
var go = {}, _o = {};
Object.defineProperty(_o, "__esModule", { value: !0 });
const sc = ps, L$ = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: sc.error,
  code: (e) => (0, sc.validatePropertyDeps)(e)
};
_o.default = L$;
var vo = {};
Object.defineProperty(vo, "__esModule", { value: !0 });
const F$ = ps, z$ = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, F$.validateSchemaDeps)(e)
};
vo.default = z$;
var wo = {};
Object.defineProperty(wo, "__esModule", { value: !0 });
const U$ = L, q$ = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, U$.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
wo.default = q$;
Object.defineProperty(go, "__esModule", { value: !0 });
const K$ = _o, G$ = vo, H$ = wo, B$ = [K$.default, G$.default, H$.default];
go.default = B$;
var Eo = {}, bo = {};
Object.defineProperty(bo, "__esModule", { value: !0 });
const Ft = re, ac = L, W$ = Ye, X$ = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, Ft._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, J$ = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: X$,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: l } = a;
    l instanceof Ft.Name ? t.if((0, Ft._)`${l} !== true`, () => t.forIn("key", n, (h) => t.if(d(l, h), () => c(h)))) : l !== !0 && t.forIn("key", n, (h) => l === void 0 ? c(h) : t.if(u(l, h), () => c(h))), a.props = !0, e.ok((0, Ft._)`${s} === ${W$.default.errors}`);
    function c(h) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: h }), e.error(), o || t.break();
        return;
      }
      if (!(0, ac.alwaysValidSchema)(a, r)) {
        const w = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: ac.Type.Str
        }, w), o || t.if((0, Ft.not)(w), () => t.break());
      }
    }
    function d(h, w) {
      return (0, Ft._)`!${h} || !${h}[${w}]`;
    }
    function u(h, w) {
      const $ = [];
      for (const v in h)
        h[v] === !0 && $.push((0, Ft._)`${w} !== ${v}`);
      return (0, Ft.and)(...$);
    }
  }
};
bo.default = J$;
var So = {};
Object.defineProperty(So, "__esModule", { value: !0 });
const rr = re, oc = L, Y$ = {
  message: ({ params: { len: e } }) => (0, rr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, rr._)`{limit: ${e}}`
}, Q$ = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: Y$,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, a = s.items || 0;
    if (a === !0)
      return;
    const o = t.const("len", (0, rr._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: a }), e.fail((0, rr._)`${o} > ${a}`);
    else if (typeof r == "object" && !(0, oc.alwaysValidSchema)(s, r)) {
      const c = t.var("valid", (0, rr._)`${o} <= ${a}`);
      t.if((0, rr.not)(c), () => l(c, a)), e.ok(c);
    }
    s.items = !0;
    function l(c, d) {
      t.forRange("i", d, o, (u) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: u, dataPropType: oc.Type.Num }, c), s.allErrors || t.if((0, rr.not)(c), () => t.break());
      });
    }
  }
};
So.default = Q$;
Object.defineProperty(Eo, "__esModule", { value: !0 });
const Z$ = bo, x$ = So, ey = [Z$.default, x$.default];
Eo.default = ey;
var Po = {}, No = {};
Object.defineProperty(No, "__esModule", { value: !0 });
const ve = re, ty = {
  message: ({ schemaCode: e }) => (0, ve.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, ve._)`{format: ${e}}`
}, ry = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: ty,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: l } = e, { opts: c, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!c.validateFormats)
      return;
    s ? w() : $();
    function w() {
      const v = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, ve._)`${v}[${o}]`), g = r.let("fType"), m = r.let("format");
      r.if((0, ve._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign(g, (0, ve._)`${_}.type || "string"`).assign(m, (0, ve._)`${_}.validate`), () => r.assign(g, (0, ve._)`"string"`).assign(m, _)), e.fail$data((0, ve.or)(E(), R()));
      function E() {
        return c.strictSchema === !1 ? ve.nil : (0, ve._)`${o} && !${m}`;
      }
      function R() {
        const O = u.$async ? (0, ve._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, ve._)`${m}(${n})`, I = (0, ve._)`(typeof ${m} == "function" ? ${O} : ${m}.test(${n}))`;
        return (0, ve._)`${m} && ${m} !== true && ${g} === ${t} && !${I}`;
      }
    }
    function $() {
      const v = h.formats[a];
      if (!v) {
        E();
        return;
      }
      if (v === !0)
        return;
      const [_, g, m] = R(v);
      _ === t && e.pass(O());
      function E() {
        if (c.strictSchema === !1) {
          h.logger.warn(I());
          return;
        }
        throw new Error(I());
        function I() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function R(I) {
        const K = I instanceof RegExp ? (0, ve.regexpCode)(I) : c.code.formats ? (0, ve._)`${c.code.formats}${(0, ve.getProperty)(a)}` : void 0, Y = r.scopeValue("formats", { key: a, ref: I, code: K });
        return typeof I == "object" && !(I instanceof RegExp) ? [I.type || "string", I.validate, (0, ve._)`${Y}.validate`] : ["string", I, Y];
      }
      function O() {
        if (typeof v == "object" && !(v instanceof RegExp) && v.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, ve._)`await ${m}(${n})`;
        }
        return typeof g == "function" ? (0, ve._)`${m}(${n})` : (0, ve._)`${m}.test(${n})`;
      }
    }
  }
};
No.default = ry;
Object.defineProperty(Po, "__esModule", { value: !0 });
const ny = No, sy = [ny.default];
Po.default = sy;
var Dr = {};
Object.defineProperty(Dr, "__esModule", { value: !0 });
Dr.contentVocabulary = Dr.metadataVocabulary = void 0;
Dr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Dr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(za, "__esModule", { value: !0 });
const ay = Ua, oy = Ka, iy = to, cy = po, ly = go, uy = Eo, dy = Po, ic = Dr, fy = [
  cy.default,
  ay.default,
  oy.default,
  (0, iy.default)(!0),
  dy.default,
  ic.metadataVocabulary,
  ic.contentVocabulary,
  ly.default,
  uy.default
];
za.default = fy;
var Ro = {}, ys = {};
Object.defineProperty(ys, "__esModule", { value: !0 });
ys.DiscrError = void 0;
var cc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(cc || (ys.DiscrError = cc = {}));
Object.defineProperty(Ro, "__esModule", { value: !0 });
const _r = re, la = ys, lc = Ue, hy = Vr, my = L, py = {
  message: ({ params: { discrError: e, tagName: t } }) => e === la.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, _r._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, $y = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: py,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const l = n.propertyName;
    if (typeof l != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, _r._)`${r}${(0, _r.getProperty)(l)}`);
    t.if((0, _r._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: la.DiscrError.Tag, tag: d, tagName: l })), e.ok(c);
    function u() {
      const $ = w();
      t.if(!1);
      for (const v in $)
        t.elseIf((0, _r._)`${d} === ${v}`), t.assign(c, h($[v]));
      t.else(), e.error(!1, { discrError: la.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h($) {
      const v = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: $ }, v);
      return e.mergeEvaluated(_, _r.Name), v;
    }
    function w() {
      var $;
      const v = {}, _ = m(s);
      let g = !0;
      for (let O = 0; O < o.length; O++) {
        let I = o[O];
        if (I != null && I.$ref && !(0, my.schemaHasRulesButRef)(I, a.self.RULES)) {
          const Y = I.$ref;
          if (I = lc.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, Y), I instanceof lc.SchemaEnv && (I = I.schema), I === void 0)
            throw new hy.default(a.opts.uriResolver, a.baseId, Y);
        }
        const K = ($ = I == null ? void 0 : I.properties) === null || $ === void 0 ? void 0 : $[l];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        g = g && (_ || m(I)), E(K, O);
      }
      if (!g)
        throw new Error(`discriminator: "${l}" must be required`);
      return v;
      function m({ required: O }) {
        return Array.isArray(O) && O.includes(l);
      }
      function E(O, I) {
        if (O.const)
          R(O.const, I);
        else if (O.enum)
          for (const K of O.enum)
            R(K, I);
        else
          throw new Error(`discriminator: "properties/${l}" must have "const" or "enum"`);
      }
      function R(O, I) {
        if (typeof O != "string" || O in v)
          throw new Error(`discriminator: "${l}" values must be unique strings`);
        v[O] = I;
      }
    }
  }
};
Ro.default = $y;
var Oo = {};
const yy = "https://json-schema.org/draft/2020-12/schema", gy = "https://json-schema.org/draft/2020-12/schema", _y = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, vy = "meta", wy = "Core and Validation specifications meta-schema", Ey = [
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
], by = [
  "object",
  "boolean"
], Sy = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", Py = {
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
}, Ny = {
  $schema: yy,
  $id: gy,
  $vocabulary: _y,
  $dynamicAnchor: vy,
  title: wy,
  allOf: Ey,
  type: by,
  $comment: Sy,
  properties: Py
}, Ry = "https://json-schema.org/draft/2020-12/schema", Oy = "https://json-schema.org/draft/2020-12/meta/applicator", Ty = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, Iy = "meta", jy = "Applicator vocabulary meta-schema", Ay = [
  "object",
  "boolean"
], ky = {
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
}, Cy = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, Dy = {
  $schema: Ry,
  $id: Oy,
  $vocabulary: Ty,
  $dynamicAnchor: Iy,
  title: jy,
  type: Ay,
  properties: ky,
  $defs: Cy
}, My = "https://json-schema.org/draft/2020-12/schema", Vy = "https://json-schema.org/draft/2020-12/meta/unevaluated", Ly = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, Fy = "meta", zy = "Unevaluated applicator vocabulary meta-schema", Uy = [
  "object",
  "boolean"
], qy = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, Ky = {
  $schema: My,
  $id: Vy,
  $vocabulary: Ly,
  $dynamicAnchor: Fy,
  title: zy,
  type: Uy,
  properties: qy
}, Gy = "https://json-schema.org/draft/2020-12/schema", Hy = "https://json-schema.org/draft/2020-12/meta/content", By = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Wy = "meta", Xy = "Content vocabulary meta-schema", Jy = [
  "object",
  "boolean"
], Yy = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, Qy = {
  $schema: Gy,
  $id: Hy,
  $vocabulary: By,
  $dynamicAnchor: Wy,
  title: Xy,
  type: Jy,
  properties: Yy
}, Zy = "https://json-schema.org/draft/2020-12/schema", xy = "https://json-schema.org/draft/2020-12/meta/core", e0 = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, t0 = "meta", r0 = "Core vocabulary meta-schema", n0 = [
  "object",
  "boolean"
], s0 = {
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
}, a0 = {
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
}, o0 = {
  $schema: Zy,
  $id: xy,
  $vocabulary: e0,
  $dynamicAnchor: t0,
  title: r0,
  type: n0,
  properties: s0,
  $defs: a0
}, i0 = "https://json-schema.org/draft/2020-12/schema", c0 = "https://json-schema.org/draft/2020-12/meta/format-annotation", l0 = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, u0 = "meta", d0 = "Format vocabulary meta-schema for annotation results", f0 = [
  "object",
  "boolean"
], h0 = {
  format: {
    type: "string"
  }
}, m0 = {
  $schema: i0,
  $id: c0,
  $vocabulary: l0,
  $dynamicAnchor: u0,
  title: d0,
  type: f0,
  properties: h0
}, p0 = "https://json-schema.org/draft/2020-12/schema", $0 = "https://json-schema.org/draft/2020-12/meta/meta-data", y0 = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, g0 = "meta", _0 = "Meta-data vocabulary meta-schema", v0 = [
  "object",
  "boolean"
], w0 = {
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
}, E0 = {
  $schema: p0,
  $id: $0,
  $vocabulary: y0,
  $dynamicAnchor: g0,
  title: _0,
  type: v0,
  properties: w0
}, b0 = "https://json-schema.org/draft/2020-12/schema", S0 = "https://json-schema.org/draft/2020-12/meta/validation", P0 = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, N0 = "meta", R0 = "Validation vocabulary meta-schema", O0 = [
  "object",
  "boolean"
], T0 = {
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
}, I0 = {
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
}, j0 = {
  $schema: b0,
  $id: S0,
  $vocabulary: P0,
  $dynamicAnchor: N0,
  title: R0,
  type: O0,
  properties: T0,
  $defs: I0
};
Object.defineProperty(Oo, "__esModule", { value: !0 });
const A0 = Ny, k0 = Dy, C0 = Ky, D0 = Qy, M0 = o0, V0 = m0, L0 = E0, F0 = j0, z0 = ["/properties"];
function U0(e) {
  return [
    A0,
    k0,
    C0,
    D0,
    M0,
    t(this, V0),
    L0,
    t(this, F0)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, z0) : n;
  }
}
Oo.default = U0;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = pl, n = za, s = Ro, a = Oo, o = "https://json-schema.org/draft/2020-12/schema";
  class l extends r.default {
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
      v && (a.default.call(this, $), this.refs["http://json-schema.org/schema"] = o);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
    }
  }
  t.Ajv2020 = l, e.exports = t = l, e.exports.Ajv2020 = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
  var c = ut;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var d = re;
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
  var u = Ca();
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return u.default;
  } });
  var h = Vr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(ra, ra.exports);
var q0 = ra.exports, ua = { exports: {} }, gu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(q, J) {
    return { validate: q, compare: J };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(a, o),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(c(!0), d),
    "date-time": t(w(!0), $),
    "iso-time": t(c(), u),
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
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, o),
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
  function a(q) {
    const J = n.exec(q);
    if (!J)
      return !1;
    const Q = +J[1], B = +J[2], ue = +J[3];
    return B >= 1 && B <= 12 && ue >= 1 && ue <= (B === 2 && r(Q) ? 29 : s[B]);
  }
  function o(q, J) {
    if (q && J)
      return q > J ? 1 : q < J ? -1 : 0;
  }
  const l = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(q) {
    return function(Q) {
      const B = l.exec(Q);
      if (!B)
        return !1;
      const ue = +B[1], V = +B[2], C = +B[3], W = B[4], z = B[5] === "-" ? -1 : 1, P = +(B[6] || 0), p = +(B[7] || 0);
      if (P > 23 || p > 59 || q && !W)
        return !1;
      if (ue <= 23 && V <= 59 && C < 60)
        return !0;
      const S = V - p * z, y = ue - P * z - (S < 0 ? 1 : 0);
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
    const Q = l.exec(q), B = l.exec(J);
    if (Q && B)
      return q = Q[1] + Q[2] + Q[3], J = B[1] + B[2] + B[3], q > J ? 1 : q < J ? -1 : 0;
  }
  const h = /t|\s/i;
  function w(q) {
    const J = c(q);
    return function(B) {
      const ue = B.split(h);
      return ue.length === 2 && a(ue[0]) && J(ue[1]);
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
    const [Q, B] = q.split(h), [ue, V] = J.split(h), C = o(Q, ue);
    if (C !== void 0)
      return C || d(B, V);
  }
  const _ = /\/|:/, g = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(q) {
    return _.test(q) && g.test(q);
  }
  const E = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function R(q) {
    return E.lastIndex = 0, E.test(q);
  }
  const O = -2147483648, I = 2 ** 31 - 1;
  function K(q) {
    return Number.isInteger(q) && q <= I && q >= O;
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
})(gu);
var _u = {}, da = { exports: {} }, vu = {}, bt = {}, Qt = {}, zs = {}, oe = {}, pn = {};
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
      return (E = this._str) !== null && E !== void 0 ? E : this._str = this._items.reduce((R, O) => `${R}${O}`, "");
    }
    get names() {
      var E;
      return (E = this._names) !== null && E !== void 0 ? E : this._names = this._items.reduce((R, O) => (O instanceof r && (R[O.str] = (R[O.str] || 0) + 1), R), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...E) {
    const R = [m[0]];
    let O = 0;
    for (; O < E.length; )
      l(R, E[O]), R.push(m[++O]);
    return new n(R);
  }
  e._ = s;
  const a = new n("+");
  function o(m, ...E) {
    const R = [$(m[0])];
    let O = 0;
    for (; O < E.length; )
      R.push(a), l(R, E[O]), R.push(a, $(m[++O]));
    return c(R), new n(R);
  }
  e.str = o;
  function l(m, E) {
    E instanceof n ? m.push(...E._items) : E instanceof r ? m.push(E) : m.push(h(E));
  }
  e.addCodeArg = l;
  function c(m) {
    let E = 1;
    for (; E < m.length - 1; ) {
      if (m[E] === a) {
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
    return E.emptyStr() ? m : m.emptyStr() ? E : o`${m}${E}`;
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
})(pn);
var fa = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = pn;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
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
  class a extends t.Name {
    constructor(d, u) {
      super(u), this.prefix = d;
    }
    setValue(d, { property: u, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(u)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const o = (0, t._)`\n`;
  class l extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
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
  e.ValueScope = l;
})(fa);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = pn, r = fa;
  var n = pn;
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
  var s = fa;
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
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(i, f) {
      return this;
    }
  }
  class o extends a {
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
  class l extends a {
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
  class c extends l {
    constructor(i, f, b, j) {
      super(i, b, j), this.op = f;
    }
    render({ _n: i }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + i;
    }
  }
  class d extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `${this.label}:` + i;
    }
  }
  class u extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `break${this.label ? ` ${this.label}` : ""};` + i;
    }
  }
  class h extends a {
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
  class w extends a {
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
  class $ extends a {
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
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(V(i), f instanceof m ? [f] : f.nodes);
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
  class O extends E {
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
      return b !== void 0 && j && (this._constants[A.str] = b), this._leafNode(new o(i, A, b)), A;
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
      return this._leafNode(new l(i, f, b));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new c(i, e.operators.ADD, f));
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
      return this._for(new O(A, G, f, b), () => j(G));
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
  function V(y) {
    return typeof y == "boolean" || typeof y == "number" || y === null ? !y : (0, t._)`!${S(y)}`;
  }
  e.not = V;
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
})(oe);
var F = {};
Object.defineProperty(F, "__esModule", { value: !0 });
F.checkStrictMode = F.getErrorPath = F.Type = F.useFunc = F.setEvaluated = F.evaluatedPropsToName = F.mergeEvaluated = F.eachItem = F.unescapeJsonPointer = F.escapeJsonPointer = F.escapeFragment = F.unescapeFragment = F.schemaRefOrVal = F.schemaHasRulesButRef = F.schemaHasRules = F.checkUnknownRules = F.alwaysValidSchema = F.toHash = void 0;
const fe = oe, K0 = pn;
function G0(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
F.toHash = G0;
function H0(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (wu(e, t), !Eu(t, e.self.RULES.all));
}
F.alwaysValidSchema = H0;
function wu(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || Pu(e, `unknown keyword: "${a}"`);
}
F.checkUnknownRules = wu;
function Eu(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
F.schemaHasRules = Eu;
function B0(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
F.schemaHasRulesButRef = B0;
function W0({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, fe._)`${r}`;
  }
  return (0, fe._)`${e}${t}${(0, fe.getProperty)(n)}`;
}
F.schemaRefOrVal = W0;
function X0(e) {
  return bu(decodeURIComponent(e));
}
F.unescapeFragment = X0;
function J0(e) {
  return encodeURIComponent(To(e));
}
F.escapeFragment = J0;
function To(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
F.escapeJsonPointer = To;
function bu(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
F.unescapeJsonPointer = bu;
function Y0(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
F.eachItem = Y0;
function uc({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, l) => {
    const c = o === void 0 ? a : o instanceof fe.Name ? (a instanceof fe.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof fe.Name ? (t(s, o, a), a) : r(a, o);
    return l === fe.Name && !(c instanceof fe.Name) ? n(s, c) : c;
  };
}
F.mergeEvaluated = {
  props: uc({
    mergeNames: (e, t, r) => e.if((0, fe._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, fe._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, fe._)`${r} || {}`).code((0, fe._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, fe._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, fe._)`${r} || {}`), Io(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Su
  }),
  items: uc({
    mergeNames: (e, t, r) => e.if((0, fe._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, fe._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, fe._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, fe._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Su(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, fe._)`{}`);
  return t !== void 0 && Io(e, r, t), r;
}
F.evaluatedPropsToName = Su;
function Io(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, fe._)`${t}${(0, fe.getProperty)(n)}`, !0));
}
F.setEvaluated = Io;
const dc = {};
function Q0(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: dc[t.code] || (dc[t.code] = new K0._Code(t.code))
  });
}
F.useFunc = Q0;
var ha;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(ha || (F.Type = ha = {}));
function Z0(e, t, r) {
  if (e instanceof fe.Name) {
    const n = t === ha.Num;
    return r ? n ? (0, fe._)`"[" + ${e} + "]"` : (0, fe._)`"['" + ${e} + "']"` : n ? (0, fe._)`"/" + ${e}` : (0, fe._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, fe.getProperty)(e).toString() : "/" + To(e);
}
F.getErrorPath = Z0;
function Pu(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
F.checkStrictMode = Pu;
var vt = {};
Object.defineProperty(vt, "__esModule", { value: !0 });
const De = oe, x0 = {
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
vt.default = x0;
var fc;
function gs() {
  return fc || (fc = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
    const t = oe, r = F, n = vt;
    e.keywordError = {
      message: ({ keyword: g }) => (0, t.str)`must pass "${g}" keyword validation`
    }, e.keyword$DataError = {
      message: ({ keyword: g, schemaType: m }) => m ? (0, t.str)`"${g}" keyword must be ${m} ($data)` : (0, t.str)`"${g}" keyword is invalid ($data)`
    };
    function s(g, m = e.keywordError, E, R) {
      const { it: O } = g, { gen: I, compositeRule: K, allErrors: Y } = O, le = h(g, m, E);
      R ?? (K || Y) ? c(I, le) : d(O, (0, t._)`[${le}]`);
    }
    e.reportError = s;
    function a(g, m = e.keywordError, E) {
      const { it: R } = g, { gen: O, compositeRule: I, allErrors: K } = R, Y = h(g, m, E);
      c(O, Y), I || K || d(R, n.default.vErrors);
    }
    e.reportExtraError = a;
    function o(g, m) {
      g.assign(n.default.errors, m), g.if((0, t._)`${n.default.vErrors} !== null`, () => g.if(m, () => g.assign((0, t._)`${n.default.vErrors}.length`, m), () => g.assign(n.default.vErrors, null)));
    }
    e.resetErrorsCount = o;
    function l({ gen: g, keyword: m, schemaValue: E, data: R, errsCount: O, it: I }) {
      if (O === void 0)
        throw new Error("ajv implementation error");
      const K = g.name("err");
      g.forRange("i", O, n.default.errors, (Y) => {
        g.const(K, (0, t._)`${n.default.vErrors}[${Y}]`), g.if((0, t._)`${K}.instancePath === undefined`, () => g.assign((0, t._)`${K}.instancePath`, (0, t.strConcat)(n.default.instancePath, I.errorPath))), g.assign((0, t._)`${K}.schemaPath`, (0, t.str)`${I.errSchemaPath}/${m}`), I.opts.verbose && (g.assign((0, t._)`${K}.schema`, E), g.assign((0, t._)`${K}.data`, R));
      });
    }
    e.extendErrors = l;
    function c(g, m) {
      const E = g.const("err", m);
      g.if((0, t._)`${n.default.vErrors} === null`, () => g.assign(n.default.vErrors, (0, t._)`[${E}]`), (0, t._)`${n.default.vErrors}.push(${E})`), g.code((0, t._)`${n.default.errors}++`);
    }
    function d(g, m) {
      const { gen: E, validateName: R, schemaEnv: O } = g;
      O.$async ? E.throw((0, t._)`new ${g.ValidationError}(${m})`) : (E.assign((0, t._)`${R}.errors`, m), E.return(!1));
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
      const { gen: R, it: O } = g, I = [
        $(O, E),
        v(g, E)
      ];
      return _(g, m, I), R.object(...I);
    }
    function $({ errorPath: g }, { instancePath: m }) {
      const E = m ? (0, t.str)`${g}${(0, r.getErrorPath)(m, r.Type.Str)}` : g;
      return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, E)];
    }
    function v({ keyword: g, it: { errSchemaPath: m } }, { schemaPath: E, parentSchema: R }) {
      let O = R ? m : (0, t.str)`${m}/${g}`;
      return E && (O = (0, t.str)`${O}${(0, r.getErrorPath)(E, r.Type.Str)}`), [u.schemaPath, O];
    }
    function _(g, { params: m, message: E }, R) {
      const { keyword: O, data: I, schemaValue: K, it: Y } = g, { opts: le, propertyName: he, topSchemaRef: ye, schemaPath: q } = Y;
      R.push([u.keyword, O], [u.params, typeof m == "function" ? m(g) : m || (0, t._)`{}`]), le.messages && R.push([u.message, typeof E == "function" ? E(g) : E]), le.verbose && R.push([u.schema, K], [u.parentSchema, (0, t._)`${ye}${q}`], [n.default.data, I]), he && R.push([u.propertyName, he]);
    }
  }(zs)), zs;
}
var hc;
function eg() {
  if (hc) return Qt;
  hc = 1, Object.defineProperty(Qt, "__esModule", { value: !0 }), Qt.boolOrEmptySchema = Qt.topBoolOrEmptySchema = void 0;
  const e = gs(), t = oe, r = vt, n = {
    message: "boolean schema is false"
  };
  function s(l) {
    const { gen: c, schema: d, validateName: u } = l;
    d === !1 ? o(l, !1) : typeof d == "object" && d.$async === !0 ? c.return(r.default.data) : (c.assign((0, t._)`${u}.errors`, null), c.return(!0));
  }
  Qt.topBoolOrEmptySchema = s;
  function a(l, c) {
    const { gen: d, schema: u } = l;
    u === !1 ? (d.var(c, !1), o(l)) : d.var(c, !0);
  }
  Qt.boolOrEmptySchema = a;
  function o(l, c) {
    const { gen: d, data: u } = l, h = {
      gen: d,
      keyword: "false schema",
      data: u,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: l
    };
    (0, e.reportError)(h, n, void 0, c);
  }
  return Qt;
}
var be = {}, fr = {};
Object.defineProperty(fr, "__esModule", { value: !0 });
fr.getRules = fr.isJSONType = void 0;
const tg = ["string", "number", "integer", "boolean", "null", "object", "array"], rg = new Set(tg);
function ng(e) {
  return typeof e == "string" && rg.has(e);
}
fr.isJSONType = ng;
function sg() {
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
fr.getRules = sg;
var St = {}, mc;
function Nu() {
  if (mc) return St;
  mc = 1, Object.defineProperty(St, "__esModule", { value: !0 }), St.shouldUseRule = St.shouldUseGroup = St.schemaHasRulesForType = void 0;
  function e({ schema: n, self: s }, a) {
    const o = s.RULES.types[a];
    return o && o !== !0 && t(n, o);
  }
  St.schemaHasRulesForType = e;
  function t(n, s) {
    return s.rules.some((a) => r(n, a));
  }
  St.shouldUseGroup = t;
  function r(n, s) {
    var a;
    return n[s.keyword] !== void 0 || ((a = s.definition.implements) === null || a === void 0 ? void 0 : a.some((o) => n[o] !== void 0));
  }
  return St.shouldUseRule = r, St;
}
Object.defineProperty(be, "__esModule", { value: !0 });
be.reportTypeError = be.checkDataTypes = be.checkDataType = be.coerceAndCheckDataType = be.getJSONTypes = be.getSchemaTypes = be.DataType = void 0;
const ag = fr, og = Nu(), ig = gs(), se = oe, Ru = F;
var Tr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Tr || (be.DataType = Tr = {}));
function cg(e) {
  const t = Ou(e.type);
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
be.getSchemaTypes = cg;
function Ou(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(ag.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
be.getJSONTypes = Ou;
function lg(e, t) {
  const { gen: r, data: n, opts: s } = e, a = ug(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, og.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const l = jo(t, n, s.strictNumbers, Tr.Wrong);
    r.if(l, () => {
      a.length ? dg(e, t, a) : Ao(e);
    });
  }
  return o;
}
be.coerceAndCheckDataType = lg;
const Tu = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function ug(e, t) {
  return t ? e.filter((r) => Tu.has(r) || t === "array" && r === "array") : [];
}
function dg(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, se._)`typeof ${s}`), l = n.let("coerced", (0, se._)`undefined`);
  a.coerceTypes === "array" && n.if((0, se._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, se._)`${s}[0]`).assign(o, (0, se._)`typeof ${s}`).if(jo(t, s, a.strictNumbers), () => n.assign(l, s))), n.if((0, se._)`${l} !== undefined`);
  for (const d of r)
    (Tu.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), Ao(e), n.endIf(), n.if((0, se._)`${l} !== undefined`, () => {
    n.assign(s, l), fg(e, l);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, se._)`${o} == "number" || ${o} == "boolean"`).assign(l, (0, se._)`"" + ${s}`).elseIf((0, se._)`${s} === null`).assign(l, (0, se._)`""`);
        return;
      case "number":
        n.elseIf((0, se._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, se._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, se._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, se._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, se._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, se._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, se._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, se._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(l, (0, se._)`[${s}]`);
    }
  }
}
function fg({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, se._)`${t} !== undefined`, () => e.assign((0, se._)`${t}[${r}]`, n));
}
function ma(e, t, r, n = Tr.Correct) {
  const s = n === Tr.Correct ? se.operators.EQ : se.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, se._)`${t} ${s} null`;
    case "array":
      a = (0, se._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, se._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, se._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, se._)`typeof ${t} ${s} ${e}`;
  }
  return n === Tr.Correct ? a : (0, se.not)(a);
  function o(l = se.nil) {
    return (0, se.and)((0, se._)`typeof ${t} == "number"`, l, r ? (0, se._)`isFinite(${t})` : se.nil);
  }
}
be.checkDataType = ma;
function jo(e, t, r, n) {
  if (e.length === 1)
    return ma(e[0], t, r, n);
  let s;
  const a = (0, Ru.toHash)(e);
  if (a.array && a.object) {
    const o = (0, se._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, se._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = se.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, se.and)(s, ma(o, t, r, n));
  return s;
}
be.checkDataTypes = jo;
const hg = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, se._)`{type: ${e}}` : (0, se._)`{type: ${t}}`
};
function Ao(e) {
  const t = mg(e);
  (0, ig.reportError)(t, hg);
}
be.reportTypeError = Ao;
function mg(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Ru.schemaRefOrVal)(e, n, "type");
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
var Qr = {}, pc;
function pg() {
  if (pc) return Qr;
  pc = 1, Object.defineProperty(Qr, "__esModule", { value: !0 }), Qr.assignDefaults = void 0;
  const e = oe, t = F;
  function r(s, a) {
    const { properties: o, items: l } = s.schema;
    if (a === "object" && o)
      for (const c in o)
        n(s, c, o[c].default);
    else a === "array" && Array.isArray(l) && l.forEach((c, d) => n(s, d, c.default));
  }
  Qr.assignDefaults = r;
  function n(s, a, o) {
    const { gen: l, compositeRule: c, data: d, opts: u } = s;
    if (o === void 0)
      return;
    const h = (0, e._)`${d}${(0, e.getProperty)(a)}`;
    if (c) {
      (0, t.checkStrictMode)(s, `default is ignored for: ${h}`);
      return;
    }
    let w = (0, e._)`${h} === undefined`;
    u.useDefaults === "empty" && (w = (0, e._)`${w} || ${h} === null || ${h} === ""`), l.if(w, (0, e._)`${h} = ${(0, e.stringify)(o)}`);
  }
  return Qr;
}
var nt = {}, ce = {};
Object.defineProperty(ce, "__esModule", { value: !0 });
ce.validateUnion = ce.validateArray = ce.usePattern = ce.callValidateCode = ce.schemaProperties = ce.allSchemaProperties = ce.noPropertyInData = ce.propertyInData = ce.isOwnProperty = ce.hasPropFunc = ce.reportMissingProp = ce.checkMissingProp = ce.checkReportMissingProp = void 0;
const pe = oe, ko = F, Mt = vt, $g = F;
function yg(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Do(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, pe._)`${t}` }, !0), e.error();
  });
}
ce.checkReportMissingProp = yg;
function gg({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, pe.or)(...n.map((a) => (0, pe.and)(Do(e, t, a, r.ownProperties), (0, pe._)`${s} = ${a}`)));
}
ce.checkMissingProp = gg;
function _g(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ce.reportMissingProp = _g;
function Iu(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, pe._)`Object.prototype.hasOwnProperty`
  });
}
ce.hasPropFunc = Iu;
function Co(e, t, r) {
  return (0, pe._)`${Iu(e)}.call(${t}, ${r})`;
}
ce.isOwnProperty = Co;
function vg(e, t, r, n) {
  const s = (0, pe._)`${t}${(0, pe.getProperty)(r)} !== undefined`;
  return n ? (0, pe._)`${s} && ${Co(e, t, r)}` : s;
}
ce.propertyInData = vg;
function Do(e, t, r, n) {
  const s = (0, pe._)`${t}${(0, pe.getProperty)(r)} === undefined`;
  return n ? (0, pe.or)(s, (0, pe.not)(Co(e, t, r))) : s;
}
ce.noPropertyInData = Do;
function ju(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ce.allSchemaProperties = ju;
function wg(e, t) {
  return ju(t).filter((r) => !(0, ko.alwaysValidSchema)(e, t[r]));
}
ce.schemaProperties = wg;
function Eg({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, l, c, d) {
  const u = d ? (0, pe._)`${e}, ${t}, ${n}${s}` : t, h = [
    [Mt.default.instancePath, (0, pe.strConcat)(Mt.default.instancePath, a)],
    [Mt.default.parentData, o.parentData],
    [Mt.default.parentDataProperty, o.parentDataProperty],
    [Mt.default.rootData, Mt.default.rootData]
  ];
  o.opts.dynamicRef && h.push([Mt.default.dynamicAnchors, Mt.default.dynamicAnchors]);
  const w = (0, pe._)`${u}, ${r.object(...h)}`;
  return c !== pe.nil ? (0, pe._)`${l}.call(${c}, ${w})` : (0, pe._)`${l}(${w})`;
}
ce.callValidateCode = Eg;
const bg = (0, pe._)`new RegExp`;
function Sg({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, pe._)`${s.code === "new RegExp" ? bg : (0, $g.useFunc)(e, s)}(${r}, ${n})`
  });
}
ce.usePattern = Sg;
function Pg(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return o(() => t.assign(l, !1)), l;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(l) {
    const c = t.const("len", (0, pe._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: ko.Type.Num
      }, a), t.if((0, pe.not)(a), l);
    });
  }
}
ce.validateArray = Pg;
function Ng(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, ko.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(o, (0, pe._)`${o} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, pe.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
ce.validateUnion = Ng;
var $c;
function Rg() {
  if ($c) return nt;
  $c = 1, Object.defineProperty(nt, "__esModule", { value: !0 }), nt.validateKeywordUsage = nt.validSchemaType = nt.funcKeywordCode = nt.macroKeywordCode = void 0;
  const e = oe, t = vt, r = ce, n = gs();
  function s(w, $) {
    const { gen: v, keyword: _, schema: g, parentSchema: m, it: E } = w, R = $.macro.call(E.self, g, m, E), O = d(v, _, R);
    E.opts.validateSchema !== !1 && E.self.validateSchema(R, !0);
    const I = v.name("valid");
    w.subschema({
      schema: R,
      schemaPath: e.nil,
      errSchemaPath: `${E.errSchemaPath}/${_}`,
      topSchemaRef: O,
      compositeRule: !0
    }, I), w.pass(I, () => w.error(!0));
  }
  nt.macroKeywordCode = s;
  function a(w, $) {
    var v;
    const { gen: _, keyword: g, schema: m, parentSchema: E, $data: R, it: O } = w;
    c(O, $);
    const I = !R && $.compile ? $.compile.call(O.self, m, E, O) : $.validate, K = d(_, g, I), Y = _.let("valid");
    w.block$data(Y, le), w.ok((v = $.valid) !== null && v !== void 0 ? v : Y);
    function le() {
      if ($.errors === !1)
        q(), $.modifying && o(w), J(() => w.error());
      else {
        const Q = $.async ? he() : ye();
        $.modifying && o(w), J(() => l(w, Q));
      }
    }
    function he() {
      const Q = _.let("ruleErrs", null);
      return _.try(() => q((0, e._)`await `), (B) => _.assign(Y, !1).if((0, e._)`${B} instanceof ${O.ValidationError}`, () => _.assign(Q, (0, e._)`${B}.errors`), () => _.throw(B))), Q;
    }
    function ye() {
      const Q = (0, e._)`${K}.errors`;
      return _.assign(Q, null), q(e.nil), Q;
    }
    function q(Q = $.async ? (0, e._)`await ` : e.nil) {
      const B = O.opts.passContext ? t.default.this : t.default.self, ue = !("compile" in $ && !R || $.schema === !1);
      _.assign(Y, (0, e._)`${Q}${(0, r.callValidateCode)(w, K, B, ue)}`, $.modifying);
    }
    function J(Q) {
      var B;
      _.if((0, e.not)((B = $.valid) !== null && B !== void 0 ? B : Y), Q);
    }
  }
  nt.funcKeywordCode = a;
  function o(w) {
    const { gen: $, data: v, it: _ } = w;
    $.if(_.parentData, () => $.assign(v, (0, e._)`${_.parentData}[${_.parentDataProperty}]`));
  }
  function l(w, $) {
    const { gen: v } = w;
    v.if((0, e._)`Array.isArray(${$})`, () => {
      v.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${$} : ${t.default.vErrors}.concat(${$})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, n.extendErrors)(w);
    }, () => w.error());
  }
  function c({ schemaEnv: w }, $) {
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
      const O = `keyword "${m}" value is invalid at path "${_}": ` + v.errorsText(g.validateSchema.errors);
      if ($.validateSchema === "log")
        v.logger.error(O);
      else
        throw new Error(O);
    }
  }
  return nt.validateKeywordUsage = h, nt;
}
var Pt = {}, yc;
function Og() {
  if (yc) return Pt;
  yc = 1, Object.defineProperty(Pt, "__esModule", { value: !0 }), Pt.extendSubschemaMode = Pt.extendSubschemaData = Pt.getSubschema = void 0;
  const e = oe, t = F;
  function r(a, { keyword: o, schemaProp: l, schema: c, schemaPath: d, errSchemaPath: u, topSchemaRef: h }) {
    if (o !== void 0 && c !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (o !== void 0) {
      const w = a.schema[o];
      return l === void 0 ? {
        schema: w,
        schemaPath: (0, e._)`${a.schemaPath}${(0, e.getProperty)(o)}`,
        errSchemaPath: `${a.errSchemaPath}/${o}`
      } : {
        schema: w[l],
        schemaPath: (0, e._)`${a.schemaPath}${(0, e.getProperty)(o)}${(0, e.getProperty)(l)}`,
        errSchemaPath: `${a.errSchemaPath}/${o}/${(0, t.escapeFragment)(l)}`
      };
    }
    if (c !== void 0) {
      if (d === void 0 || u === void 0 || h === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: c,
        schemaPath: d,
        topSchemaRef: h,
        errSchemaPath: u
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Pt.getSubschema = r;
  function n(a, o, { dataProp: l, dataPropType: c, data: d, dataTypes: u, propertyName: h }) {
    if (d !== void 0 && l !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: w } = o;
    if (l !== void 0) {
      const { errorPath: v, dataPathArr: _, opts: g } = o, m = w.let("data", (0, e._)`${o.data}${(0, e.getProperty)(l)}`, !0);
      $(m), a.errorPath = (0, e.str)`${v}${(0, t.getErrorPath)(l, c, g.jsPropertySyntax)}`, a.parentDataProperty = (0, e._)`${l}`, a.dataPathArr = [..._, a.parentDataProperty];
    }
    if (d !== void 0) {
      const v = d instanceof e.Name ? d : w.let("data", d, !0);
      $(v), h !== void 0 && (a.propertyName = h);
    }
    u && (a.dataTypes = u);
    function $(v) {
      a.data = v, a.dataLevel = o.dataLevel + 1, a.dataTypes = [], o.definedProperties = /* @__PURE__ */ new Set(), a.parentData = o.data, a.dataNames = [...o.dataNames, v];
    }
  }
  Pt.extendSubschemaData = n;
  function s(a, { jtdDiscriminator: o, jtdMetadata: l, compositeRule: c, createErrors: d, allErrors: u }) {
    c !== void 0 && (a.compositeRule = c), d !== void 0 && (a.createErrors = d), u !== void 0 && (a.allErrors = u), a.jtdDiscriminator = o, a.jtdMetadata = l;
  }
  return Pt.extendSubschemaMode = s, Pt;
}
var Ie = {}, Au = { exports: {} }, Ht = Au.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Jn(t, n, s, e, "", e);
};
Ht.keywords = {
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
Ht.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Ht.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Ht.skipKeywords = {
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
function Jn(e, t, r, n, s, a, o, l, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, l, c, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in Ht.arrayKeywords)
          for (var w = 0; w < h.length; w++)
            Jn(e, t, r, h[w], s + "/" + u + "/" + w, a, s, u, n, w);
      } else if (u in Ht.propsKeywords) {
        if (h && typeof h == "object")
          for (var $ in h)
            Jn(e, t, r, h[$], s + "/" + u + "/" + Tg($), a, s, u, n, $);
      } else (u in Ht.keywords || e.allKeys && !(u in Ht.skipKeywords)) && Jn(e, t, r, h, s + "/" + u, a, s, u, n);
    }
    r(n, s, a, o, l, c, d);
  }
}
function Tg(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Ig = Au.exports;
Object.defineProperty(Ie, "__esModule", { value: !0 });
Ie.getSchemaRefs = Ie.resolveUrl = Ie.normalizeId = Ie._getFullPath = Ie.getFullPath = Ie.inlineRef = void 0;
const jg = F, Ag = ds, kg = Ig, Cg = /* @__PURE__ */ new Set([
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
function Dg(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !pa(e) : t ? ku(e) <= t : !1;
}
Ie.inlineRef = Dg;
const Mg = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function pa(e) {
  for (const t in e) {
    if (Mg.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(pa) || typeof r == "object" && pa(r))
      return !0;
  }
  return !1;
}
function ku(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Cg.has(r) && (typeof e[r] == "object" && (0, jg.eachItem)(e[r], (n) => t += ku(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Cu(e, t = "", r) {
  r !== !1 && (t = Ir(t));
  const n = e.parse(t);
  return Du(e, n);
}
Ie.getFullPath = Cu;
function Du(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ie._getFullPath = Du;
const Vg = /#\/?$/;
function Ir(e) {
  return e ? e.replace(Vg, "") : "";
}
Ie.normalizeId = Ir;
function Lg(e, t, r) {
  return r = Ir(r), e.resolve(t, r);
}
Ie.resolveUrl = Lg;
const Fg = /^[a-z_][-a-z0-9._]*$/i;
function zg(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Ir(e[r] || t), a = { "": s }, o = Cu(n, s, !1), l = {}, c = /* @__PURE__ */ new Set();
  return kg(e, { allKeys: !0 }, (h, w, $, v) => {
    if (v === void 0)
      return;
    const _ = o + w;
    let g = a[v];
    typeof h[r] == "string" && (g = m.call(this, h[r])), E.call(this, h.$anchor), E.call(this, h.$dynamicAnchor), a[w] = g;
    function m(R) {
      const O = this.opts.uriResolver.resolve;
      if (R = Ir(g ? O(g, R) : R), c.has(R))
        throw u(R);
      c.add(R);
      let I = this.refs[R];
      return typeof I == "string" && (I = this.refs[I]), typeof I == "object" ? d(h, I.schema, R) : R !== Ir(_) && (R[0] === "#" ? (d(h, l[R], R), l[R] = h) : this.refs[R] = _), R;
    }
    function E(R) {
      if (typeof R == "string") {
        if (!Fg.test(R))
          throw new Error(`invalid anchor "${R}"`);
        m.call(this, `#${R}`);
      }
    }
  }), l;
  function d(h, w, $) {
    if (w !== void 0 && !Ag(h, w))
      throw u($);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ie.getSchemaRefs = zg;
var gc;
function _s() {
  if (gc) return bt;
  gc = 1, Object.defineProperty(bt, "__esModule", { value: !0 }), bt.getData = bt.KeywordCxt = bt.validateFunctionCode = void 0;
  const e = eg(), t = be, r = Nu(), n = be, s = pg(), a = Rg(), o = Og(), l = oe, c = vt, d = Ie, u = F, h = gs();
  function w(N) {
    if (I(N) && (Y(N), O(N))) {
      g(N);
      return;
    }
    $(N, () => (0, e.topBoolOrEmptySchema)(N));
  }
  bt.validateFunctionCode = w;
  function $({ gen: N, validateName: T, schema: k, schemaEnv: M, opts: H }, x) {
    H.code.es5 ? N.func(T, (0, l._)`${c.default.data}, ${c.default.valCxt}`, M.$async, () => {
      N.code((0, l._)`"use strict"; ${E(k, H)}`), _(N, H), N.code(x);
    }) : N.func(T, (0, l._)`${c.default.data}, ${v(H)}`, M.$async, () => N.code(E(k, H)).code(x));
  }
  function v(N) {
    return (0, l._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${N.dynamicRef ? (0, l._)`, ${c.default.dynamicAnchors}={}` : l.nil}}={}`;
  }
  function _(N, T) {
    N.if(c.default.valCxt, () => {
      N.var(c.default.instancePath, (0, l._)`${c.default.valCxt}.${c.default.instancePath}`), N.var(c.default.parentData, (0, l._)`${c.default.valCxt}.${c.default.parentData}`), N.var(c.default.parentDataProperty, (0, l._)`${c.default.valCxt}.${c.default.parentDataProperty}`), N.var(c.default.rootData, (0, l._)`${c.default.valCxt}.${c.default.rootData}`), T.dynamicRef && N.var(c.default.dynamicAnchors, (0, l._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      N.var(c.default.instancePath, (0, l._)`""`), N.var(c.default.parentData, (0, l._)`undefined`), N.var(c.default.parentDataProperty, (0, l._)`undefined`), N.var(c.default.rootData, c.default.data), T.dynamicRef && N.var(c.default.dynamicAnchors, (0, l._)`{}`);
    });
  }
  function g(N) {
    const { schema: T, opts: k, gen: M } = N;
    $(N, () => {
      k.$comment && T.$comment && Q(N), ye(N), M.let(c.default.vErrors, null), M.let(c.default.errors, 0), k.unevaluated && m(N), le(N), B(N);
    });
  }
  function m(N) {
    const { gen: T, validateName: k } = N;
    N.evaluated = T.const("evaluated", (0, l._)`${k}.evaluated`), T.if((0, l._)`${N.evaluated}.dynamicProps`, () => T.assign((0, l._)`${N.evaluated}.props`, (0, l._)`undefined`)), T.if((0, l._)`${N.evaluated}.dynamicItems`, () => T.assign((0, l._)`${N.evaluated}.items`, (0, l._)`undefined`));
  }
  function E(N, T) {
    const k = typeof N == "object" && N[T.schemaId];
    return k && (T.code.source || T.code.process) ? (0, l._)`/*# sourceURL=${k} */` : l.nil;
  }
  function R(N, T) {
    if (I(N) && (Y(N), O(N))) {
      K(N, T);
      return;
    }
    (0, e.boolOrEmptySchema)(N, T);
  }
  function O({ schema: N, self: T }) {
    if (typeof N == "boolean")
      return !N;
    for (const k in N)
      if (T.RULES.all[k])
        return !0;
    return !1;
  }
  function I(N) {
    return typeof N.schema != "boolean";
  }
  function K(N, T) {
    const { schema: k, gen: M, opts: H } = N;
    H.$comment && k.$comment && Q(N), q(N), J(N);
    const x = M.const("_errs", c.default.errors);
    le(N, x), M.var(T, (0, l._)`${x} === ${c.default.errors}`);
  }
  function Y(N) {
    (0, u.checkUnknownRules)(N), he(N);
  }
  function le(N, T) {
    if (N.opts.jtd)
      return V(N, [], !1, T);
    const k = (0, t.getSchemaTypes)(N.schema), M = (0, t.coerceAndCheckDataType)(N, k);
    V(N, k, !M, T);
  }
  function he(N) {
    const { schema: T, errSchemaPath: k, opts: M, self: H } = N;
    T.$ref && M.ignoreKeywordsWithRef && (0, u.schemaHasRulesButRef)(T, H.RULES) && H.logger.warn(`$ref: keywords ignored in schema at path "${k}"`);
  }
  function ye(N) {
    const { schema: T, opts: k } = N;
    T.default !== void 0 && k.useDefaults && k.strictSchema && (0, u.checkStrictMode)(N, "default is ignored in the schema root");
  }
  function q(N) {
    const T = N.schema[N.opts.schemaId];
    T && (N.baseId = (0, d.resolveUrl)(N.opts.uriResolver, N.baseId, T));
  }
  function J(N) {
    if (N.schema.$async && !N.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function Q({ gen: N, schemaEnv: T, schema: k, errSchemaPath: M, opts: H }) {
    const x = k.$comment;
    if (H.$comment === !0)
      N.code((0, l._)`${c.default.self}.logger.log(${x})`);
    else if (typeof H.$comment == "function") {
      const ge = (0, l.str)`${M}/$comment`, Fe = N.scopeValue("root", { ref: T.root });
      N.code((0, l._)`${c.default.self}.opts.$comment(${x}, ${ge}, ${Fe}.schema)`);
    }
  }
  function B(N) {
    const { gen: T, schemaEnv: k, validateName: M, ValidationError: H, opts: x } = N;
    k.$async ? T.if((0, l._)`${c.default.errors} === 0`, () => T.return(c.default.data), () => T.throw((0, l._)`new ${H}(${c.default.vErrors})`)) : (T.assign((0, l._)`${M}.errors`, c.default.vErrors), x.unevaluated && ue(N), T.return((0, l._)`${c.default.errors} === 0`));
  }
  function ue({ gen: N, evaluated: T, props: k, items: M }) {
    k instanceof l.Name && N.assign((0, l._)`${T}.props`, k), M instanceof l.Name && N.assign((0, l._)`${T}.items`, M);
  }
  function V(N, T, k, M) {
    const { gen: H, schema: x, data: ge, allErrors: Fe, opts: Se, self: Pe } = N, { RULES: _e } = Pe;
    if (x.$ref && (Se.ignoreKeywordsWithRef || !(0, u.schemaHasRulesButRef)(x, _e))) {
      H.block(() => j(N, "$ref", _e.all.$ref.definition));
      return;
    }
    Se.jtd || W(N, T), H.block(() => {
      for (const je of _e.rules)
        mt(je);
      mt(_e.post);
    });
    function mt(je) {
      (0, r.shouldUseGroup)(x, je) && (je.type ? (H.if((0, n.checkDataType)(je.type, ge, Se.strictNumbers)), C(N, je), T.length === 1 && T[0] === je.type && k && (H.else(), (0, n.reportTypeError)(N)), H.endIf()) : C(N, je), Fe || H.if((0, l._)`${c.default.errors} === ${M || 0}`));
    }
  }
  function C(N, T) {
    const { gen: k, schema: M, opts: { useDefaults: H } } = N;
    H && (0, s.assignDefaults)(N, T.type), k.block(() => {
      for (const x of T.rules)
        (0, r.shouldUseRule)(M, x) && j(N, x.keyword, x.definition, T.type);
    });
  }
  function W(N, T) {
    N.schemaEnv.meta || !N.opts.strictTypes || (z(N, T), N.opts.allowUnionTypes || P(N, T), p(N, N.dataTypes));
  }
  function z(N, T) {
    if (T.length) {
      if (!N.dataTypes.length) {
        N.dataTypes = T;
        return;
      }
      T.forEach((k) => {
        y(N.dataTypes, k) || f(N, `type "${k}" not allowed by context "${N.dataTypes.join(",")}"`);
      }), i(N, T);
    }
  }
  function P(N, T) {
    T.length > 1 && !(T.length === 2 && T.includes("null")) && f(N, "use allowUnionTypes to allow union type keyword");
  }
  function p(N, T) {
    const k = N.self.RULES.all;
    for (const M in k) {
      const H = k[M];
      if (typeof H == "object" && (0, r.shouldUseRule)(N.schema, H)) {
        const { type: x } = H.definition;
        x.length && !x.some((ge) => S(T, ge)) && f(N, `missing type "${x.join(",")}" for keyword "${M}"`);
      }
    }
  }
  function S(N, T) {
    return N.includes(T) || T === "number" && N.includes("integer");
  }
  function y(N, T) {
    return N.includes(T) || T === "integer" && N.includes("number");
  }
  function i(N, T) {
    const k = [];
    for (const M of N.dataTypes)
      y(T, M) ? k.push(M) : T.includes("integer") && M === "number" && k.push("integer");
    N.dataTypes = k;
  }
  function f(N, T) {
    const k = N.schemaEnv.baseId + N.errSchemaPath;
    T += ` at "${k}" (strictTypes)`, (0, u.checkStrictMode)(N, T, N.opts.strictTypes);
  }
  class b {
    constructor(T, k, M) {
      if ((0, a.validateKeywordUsage)(T, k, M), this.gen = T.gen, this.allErrors = T.allErrors, this.keyword = M, this.data = T.data, this.schema = T.schema[M], this.$data = k.$data && T.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, u.schemaRefOrVal)(T, this.schema, M, this.$data), this.schemaType = k.schemaType, this.parentSchema = T.schema, this.params = {}, this.it = T, this.def = k, this.$data)
        this.schemaCode = T.gen.const("vSchema", U(this.$data, T));
      else if (this.schemaCode = this.schemaValue, !(0, a.validSchemaType)(this.schema, k.schemaType, k.allowUndefined))
        throw new Error(`${M} value must be ${JSON.stringify(k.schemaType)}`);
      ("code" in k ? k.trackErrors : k.errors !== !1) && (this.errsCount = T.gen.const("_errs", c.default.errors));
    }
    result(T, k, M) {
      this.failResult((0, l.not)(T), k, M);
    }
    failResult(T, k, M) {
      this.gen.if(T), M ? M() : this.error(), k ? (this.gen.else(), k(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(T, k) {
      this.failResult((0, l.not)(T), void 0, k);
    }
    fail(T) {
      if (T === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(T), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(T) {
      if (!this.$data)
        return this.fail(T);
      const { schemaCode: k } = this;
      this.fail((0, l._)`${k} !== undefined && (${(0, l.or)(this.invalid$data(), T)})`);
    }
    error(T, k, M) {
      if (k) {
        this.setParams(k), this._error(T, M), this.setParams({});
        return;
      }
      this._error(T, M);
    }
    _error(T, k) {
      (T ? h.reportExtraError : h.reportError)(this, this.def.error, k);
    }
    $dataError() {
      (0, h.reportError)(this, this.def.$dataError || h.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, h.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(T) {
      this.allErrors || this.gen.if(T);
    }
    setParams(T, k) {
      k ? Object.assign(this.params, T) : this.params = T;
    }
    block$data(T, k, M = l.nil) {
      this.gen.block(() => {
        this.check$data(T, M), k();
      });
    }
    check$data(T = l.nil, k = l.nil) {
      if (!this.$data)
        return;
      const { gen: M, schemaCode: H, schemaType: x, def: ge } = this;
      M.if((0, l.or)((0, l._)`${H} === undefined`, k)), T !== l.nil && M.assign(T, !0), (x.length || ge.validateSchema) && (M.elseIf(this.invalid$data()), this.$dataError(), T !== l.nil && M.assign(T, !1)), M.else();
    }
    invalid$data() {
      const { gen: T, schemaCode: k, schemaType: M, def: H, it: x } = this;
      return (0, l.or)(ge(), Fe());
      function ge() {
        if (M.length) {
          if (!(k instanceof l.Name))
            throw new Error("ajv implementation error");
          const Se = Array.isArray(M) ? M : [M];
          return (0, l._)`${(0, n.checkDataTypes)(Se, k, x.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return l.nil;
      }
      function Fe() {
        if (H.validateSchema) {
          const Se = T.scopeValue("validate$data", { ref: H.validateSchema });
          return (0, l._)`!${Se}(${k})`;
        }
        return l.nil;
      }
    }
    subschema(T, k) {
      const M = (0, o.getSubschema)(this.it, T);
      (0, o.extendSubschemaData)(M, this.it, T), (0, o.extendSubschemaMode)(M, T);
      const H = { ...this.it, ...M, items: void 0, props: void 0 };
      return R(H, k), H;
    }
    mergeEvaluated(T, k) {
      const { it: M, gen: H } = this;
      M.opts.unevaluated && (M.props !== !0 && T.props !== void 0 && (M.props = u.mergeEvaluated.props(H, T.props, M.props, k)), M.items !== !0 && T.items !== void 0 && (M.items = u.mergeEvaluated.items(H, T.items, M.items, k)));
    }
    mergeValidEvaluated(T, k) {
      const { it: M, gen: H } = this;
      if (M.opts.unevaluated && (M.props !== !0 || M.items !== !0))
        return H.if(k, () => this.mergeEvaluated(T, l.Name)), !0;
    }
  }
  bt.KeywordCxt = b;
  function j(N, T, k, M) {
    const H = new b(N, k, T);
    "code" in k ? k.code(H, M) : H.$data && k.validate ? (0, a.funcKeywordCode)(H, k) : "macro" in k ? (0, a.macroKeywordCode)(H, k) : (k.compile || k.validate) && (0, a.funcKeywordCode)(H, k);
  }
  const A = /^\/(?:[^~]|~0|~1)*$/, G = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function U(N, { dataLevel: T, dataNames: k, dataPathArr: M }) {
    let H, x;
    if (N === "")
      return c.default.rootData;
    if (N[0] === "/") {
      if (!A.test(N))
        throw new Error(`Invalid JSON-pointer: ${N}`);
      H = N, x = c.default.rootData;
    } else {
      const Pe = G.exec(N);
      if (!Pe)
        throw new Error(`Invalid JSON-pointer: ${N}`);
      const _e = +Pe[1];
      if (H = Pe[2], H === "#") {
        if (_e >= T)
          throw new Error(Se("property/index", _e));
        return M[T - _e];
      }
      if (_e > T)
        throw new Error(Se("data", _e));
      if (x = k[T - _e], !H)
        return x;
    }
    let ge = x;
    const Fe = H.split("/");
    for (const Pe of Fe)
      Pe && (x = (0, l._)`${x}${(0, l.getProperty)((0, u.unescapeJsonPointer)(Pe))}`, ge = (0, l._)`${ge} && ${x}`);
    return ge;
    function Se(Pe, _e) {
      return `Cannot access ${Pe} ${_e} levels up, current level is ${T}`;
    }
  }
  return bt.getData = U, bt;
}
var In = {}, _c;
function Mo() {
  if (_c) return In;
  _c = 1, Object.defineProperty(In, "__esModule", { value: !0 });
  class e extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return In.default = e, In;
}
var qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
const Us = Ie;
class Ug extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Us.resolveUrl)(t, r, n), this.missingSchema = (0, Us.normalizeId)((0, Us.getFullPath)(t, this.missingRef));
  }
}
qr.default = Ug;
var We = {};
Object.defineProperty(We, "__esModule", { value: !0 });
We.resolveSchema = We.getCompilingSchema = We.resolveRef = We.compileSchema = We.SchemaEnv = void 0;
const st = oe, qg = Mo(), Zt = vt, ct = Ie, vc = F, Kg = _s();
class vs {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, ct.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
We.SchemaEnv = vs;
function Vo(e) {
  const t = Mu.call(this, e);
  if (t)
    return t;
  const r = (0, ct.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new st.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let l;
  e.$async && (l = o.scopeValue("Error", {
    ref: qg.default,
    code: (0, st._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: Zt.default.data,
    parentData: Zt.default.parentData,
    parentDataProperty: Zt.default.parentDataProperty,
    dataNames: [Zt.default.data],
    dataPathArr: [st.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, st.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: l,
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
    this._compilations.add(e), (0, Kg.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    u = `${o.scopeRefs(Zt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const $ = new Function(`${Zt.default.self}`, `${Zt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(c, { ref: $ }), $.errors = null, $.schema = e.schema, $.schemaEnv = e, e.$async && ($.$async = !0), this.opts.code.source === !0 && ($.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
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
We.compileSchema = Vo;
function Gg(e, t, r) {
  var n;
  r = (0, ct.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = Wg.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    o && (a = new vs({ schema: o, schemaId: l, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = Hg.call(this, a);
}
We.resolveRef = Gg;
function Hg(e) {
  return (0, ct.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Vo.call(this, e);
}
function Mu(e) {
  for (const t of this._compilations)
    if (Bg(t, e))
      return t;
}
We.getCompilingSchema = Mu;
function Bg(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Wg(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || ws.call(this, e, t);
}
function ws(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, ct._getFullPath)(this.opts.uriResolver, r);
  let s = (0, ct.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return qs.call(this, r, e);
  const a = (0, ct.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const l = ws.call(this, e, o);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : qs.call(this, r, l);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Vo.call(this, o), a === (0, ct.normalizeId)(t)) {
      const { schema: l } = o, { schemaId: c } = this.opts, d = l[c];
      return d && (s = (0, ct.resolveUrl)(this.opts.uriResolver, s, d)), new vs({ schema: l, schemaId: c, root: e, baseId: s });
    }
    return qs.call(this, r, o);
  }
}
We.resolveSchema = ws;
const Xg = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function qs(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, vc.unescapeFragment)(l)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !Xg.has(l) && d && (t = (0, ct.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, vc.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, ct.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = ws.call(this, n, l);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new vs({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const Jg = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Yg = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Qg = "object", Zg = [
  "$data"
], xg = {
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
}, e_ = !1, t_ = {
  $id: Jg,
  description: Yg,
  type: Qg,
  required: Zg,
  properties: xg,
  additionalProperties: e_
};
var Lo = {};
Object.defineProperty(Lo, "__esModule", { value: !0 });
const Vu = iu;
Vu.code = 'require("ajv/dist/runtime/uri").default';
Lo.default = Vu;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = _s();
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = oe;
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
  const n = Mo(), s = qr, a = fr, o = We, l = oe, c = Ie, d = be, u = F, h = t_, w = Lo, $ = (P, p) => new RegExp(P, p);
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
    var p, S, y, i, f, b, j, A, G, U, N, T, k, M, H, x, ge, Fe, Se, Pe, _e, mt, je, Wt, Xt;
    const et = P.strict, Jt = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, Hr = Jt === !0 || Jt === void 0 ? 1 : Jt || 0, Br = (y = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && y !== void 0 ? y : $, Ts = (i = P.uriResolver) !== null && i !== void 0 ? i : w.default;
    return {
      strictSchema: (b = (f = P.strictSchema) !== null && f !== void 0 ? f : et) !== null && b !== void 0 ? b : !0,
      strictNumbers: (A = (j = P.strictNumbers) !== null && j !== void 0 ? j : et) !== null && A !== void 0 ? A : !0,
      strictTypes: (U = (G = P.strictTypes) !== null && G !== void 0 ? G : et) !== null && U !== void 0 ? U : "log",
      strictTuples: (T = (N = P.strictTuples) !== null && N !== void 0 ? N : et) !== null && T !== void 0 ? T : "log",
      strictRequired: (M = (k = P.strictRequired) !== null && k !== void 0 ? k : et) !== null && M !== void 0 ? M : !1,
      code: P.code ? { ...P.code, optimize: Hr, regExp: Br } : { optimize: Hr, regExp: Br },
      loopRequired: (H = P.loopRequired) !== null && H !== void 0 ? H : E,
      loopEnum: (x = P.loopEnum) !== null && x !== void 0 ? x : E,
      meta: (ge = P.meta) !== null && ge !== void 0 ? ge : !0,
      messages: (Fe = P.messages) !== null && Fe !== void 0 ? Fe : !0,
      inlineRefs: (Se = P.inlineRefs) !== null && Se !== void 0 ? Se : !0,
      schemaId: (Pe = P.schemaId) !== null && Pe !== void 0 ? Pe : "$id",
      addUsedSchema: (_e = P.addUsedSchema) !== null && _e !== void 0 ? _e : !0,
      validateSchema: (mt = P.validateSchema) !== null && mt !== void 0 ? mt : !0,
      validateFormats: (je = P.validateFormats) !== null && je !== void 0 ? je : !0,
      unicodeRegExp: (Wt = P.unicodeRegExp) !== null && Wt !== void 0 ? Wt : !0,
      int32range: (Xt = P.int32range) !== null && Xt !== void 0 ? Xt : !0,
      uriResolver: Ts
    };
  }
  class O {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...R(p) };
      const { es5: S, lines: y } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: _, es5: S, lines: y }), this.logger = J(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), I.call(this, g, p, "NOT SUPPORTED"), I.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ye.call(this), p.formats && le.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && he.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), Y.call(this), p.validateFormats = i;
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
        const T = this._addSchema(U, N);
        return T.validate || b.call(this, T);
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
      return S = (0, c.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(p, y, S, i, !0), this;
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
        const { schemaId: y } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: y });
        if (S = o.resolveSchema.call(this, i, p), !S)
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
          return y && (y = (0, c.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
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
      y = (0, c.normalizeId)(b || y);
      const G = c.getSchemaRefs.call(this, p, y);
      return A = new o.SchemaEnv({ schema: p, schemaId: j, meta: S, baseId: y, localRefs: G }), this._cache.set(A.schema, A), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = A), i && this.validateSchema(p, !0), A;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : o.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const S = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, p);
      } finally {
        this.opts = S;
      }
    }
  }
  O.ValidationError = n.default, O.MissingRefError = s.default, e.default = O;
  function I(P, p, S, y = "error") {
    for (const i in P) {
      const f = i;
      f in p && this.logger[y](`${S}: option ${i}. ${P[f]}`);
    }
  }
  function K(P) {
    return P = (0, c.normalizeId)(P), this.schemas[P] || this.refs[P];
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
    p.before ? V.call(this, b, j, p.before) : b.rules.push(j), f.all[P] = j, (y = p.implements) === null || y === void 0 || y.forEach((A) => this.addKeyword(A));
  }
  function V(P, p, S) {
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
})(vu);
var Fo = {}, zo = {}, Uo = {};
Object.defineProperty(Uo, "__esModule", { value: !0 });
const r_ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Uo.default = r_;
var hr = {};
Object.defineProperty(hr, "__esModule", { value: !0 });
hr.callRef = hr.getValidate = void 0;
const n_ = qr, wc = ce, Be = oe, yr = vt, Ec = We, jn = F, s_ = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: l, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = Ec.resolveRef.call(c, d, s, r);
    if (u === void 0)
      throw new n_.default(n.opts.uriResolver, s, r);
    if (u instanceof Ec.SchemaEnv)
      return w(u);
    return $(u);
    function h() {
      if (a === d)
        return Yn(e, o, a, a.$async);
      const v = t.scopeValue("root", { ref: d });
      return Yn(e, (0, Be._)`${v}.validate`, d, d.$async);
    }
    function w(v) {
      const _ = Lu(e, v);
      Yn(e, _, v, v.$async);
    }
    function $(v) {
      const _ = t.scopeValue("schema", l.code.source === !0 ? { ref: v, code: (0, Be.stringify)(v) } : { ref: v }), g = t.name("valid"), m = e.subschema({
        schema: v,
        dataTypes: [],
        schemaPath: Be.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, g);
      e.mergeEvaluated(m), e.ok(g);
    }
  }
};
function Lu(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Be._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
hr.getValidate = Lu;
function Yn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: l, opts: c } = a, d = c.passContext ? yr.default.this : Be.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, Be._)`await ${(0, wc.callValidateCode)(e, t, d)}`), $(t), o || s.assign(v, !0);
    }, (_) => {
      s.if((0, Be._)`!(${_} instanceof ${a.ValidationError})`, () => s.throw(_)), w(_), o || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, wc.callValidateCode)(e, t, d), () => $(t), () => w(t));
  }
  function w(v) {
    const _ = (0, Be._)`${v}.errors`;
    s.assign(yr.default.vErrors, (0, Be._)`${yr.default.vErrors} === null ? ${_} : ${yr.default.vErrors}.concat(${_})`), s.assign(yr.default.errors, (0, Be._)`${yr.default.vErrors}.length`);
  }
  function $(v) {
    var _;
    if (!a.opts.unevaluated)
      return;
    const g = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (a.props !== !0)
      if (g && !g.dynamicProps)
        g.props !== void 0 && (a.props = jn.mergeEvaluated.props(s, g.props, a.props));
      else {
        const m = s.var("props", (0, Be._)`${v}.evaluated.props`);
        a.props = jn.mergeEvaluated.props(s, m, a.props, Be.Name);
      }
    if (a.items !== !0)
      if (g && !g.dynamicItems)
        g.items !== void 0 && (a.items = jn.mergeEvaluated.items(s, g.items, a.items));
      else {
        const m = s.var("items", (0, Be._)`${v}.evaluated.items`);
        a.items = jn.mergeEvaluated.items(s, m, a.items, Be.Name);
      }
  }
}
hr.callRef = Yn;
hr.default = s_;
Object.defineProperty(zo, "__esModule", { value: !0 });
const a_ = Uo, o_ = hr, i_ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  a_.default,
  o_.default
];
zo.default = i_;
var qo = {}, Ko = {};
Object.defineProperty(Ko, "__esModule", { value: !0 });
const as = oe, Vt = as.operators, os = {
  maximum: { okStr: "<=", ok: Vt.LTE, fail: Vt.GT },
  minimum: { okStr: ">=", ok: Vt.GTE, fail: Vt.LT },
  exclusiveMaximum: { okStr: "<", ok: Vt.LT, fail: Vt.GTE },
  exclusiveMinimum: { okStr: ">", ok: Vt.GT, fail: Vt.LTE }
}, c_ = {
  message: ({ keyword: e, schemaCode: t }) => (0, as.str)`must be ${os[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, as._)`{comparison: ${os[e].okStr}, limit: ${t}}`
}, l_ = {
  keyword: Object.keys(os),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: c_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, as._)`${r} ${os[t].fail} ${n} || isNaN(${r})`);
  }
};
Ko.default = l_;
var Go = {};
Object.defineProperty(Go, "__esModule", { value: !0 });
const cn = oe, u_ = {
  message: ({ schemaCode: e }) => (0, cn.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, cn._)`{multipleOf: ${e}}`
}, d_ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: u_,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), l = a ? (0, cn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, cn._)`${o} !== parseInt(${o})`;
    e.fail$data((0, cn._)`(${n} === 0 || (${o} = ${r}/${n}, ${l}))`);
  }
};
Go.default = d_;
var Ho = {}, Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
function Fu(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Bo.default = Fu;
Fu.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Ho, "__esModule", { value: !0 });
const nr = oe, f_ = F, h_ = Bo, m_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, nr.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, nr._)`{limit: ${e}}`
}, p_ = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: m_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? nr.operators.GT : nr.operators.LT, o = s.opts.unicode === !1 ? (0, nr._)`${r}.length` : (0, nr._)`${(0, f_.useFunc)(e.gen, h_.default)}(${r})`;
    e.fail$data((0, nr._)`${o} ${a} ${n}`);
  }
};
Ho.default = p_;
var Wo = {};
Object.defineProperty(Wo, "__esModule", { value: !0 });
const $_ = ce, y_ = F, Sr = oe, g_ = {
  message: ({ schemaCode: e }) => (0, Sr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Sr._)`{pattern: ${e}}`
}, __ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: g_,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e, l = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, Sr._)`new RegExp` : (0, y_.useFunc)(t, c), u = t.let("valid");
      t.try(() => t.assign(u, (0, Sr._)`${d}(${a}, ${l}).test(${r})`), () => t.assign(u, !1)), e.fail$data((0, Sr._)`!${u}`);
    } else {
      const c = (0, $_.usePattern)(e, s);
      e.fail$data((0, Sr._)`!${c}.test(${r})`);
    }
  }
};
Wo.default = __;
var Xo = {};
Object.defineProperty(Xo, "__esModule", { value: !0 });
const ln = oe, v_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, ln.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, ln._)`{limit: ${e}}`
}, w_ = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: v_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? ln.operators.GT : ln.operators.LT;
    e.fail$data((0, ln._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Xo.default = w_;
var Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
const Zr = ce, un = oe, E_ = F, b_ = {
  message: ({ params: { missingProperty: e } }) => (0, un.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, un._)`{missingProperty: ${e}}`
}, S_ = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: b_,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: l } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= l.loopRequired;
    if (o.allErrors ? d() : u(), l.strictRequired) {
      const $ = e.parentSchema.properties, { definedProperties: v } = e.it;
      for (const _ of r)
        if (($ == null ? void 0 : $[_]) === void 0 && !v.has(_)) {
          const g = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${_}" is not defined at "${g}" (strictRequired)`;
          (0, E_.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(un.nil, h);
      else
        for (const $ of r)
          (0, Zr.checkReportMissingProp)(e, $);
    }
    function u() {
      const $ = t.let("missing");
      if (c || a) {
        const v = t.let("valid", !0);
        e.block$data(v, () => w($, v)), e.ok(v);
      } else
        t.if((0, Zr.checkMissingProp)(e, r, $)), (0, Zr.reportMissingProp)(e, $), t.else();
    }
    function h() {
      t.forOf("prop", n, ($) => {
        e.setParams({ missingProperty: $ }), t.if((0, Zr.noPropertyInData)(t, s, $, l.ownProperties), () => e.error());
      });
    }
    function w($, v) {
      e.setParams({ missingProperty: $ }), t.forOf($, n, () => {
        t.assign(v, (0, Zr.propertyInData)(t, s, $, l.ownProperties)), t.if((0, un.not)(v), () => {
          e.error(), t.break();
        });
      }, un.nil);
    }
  }
};
Jo.default = S_;
var Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
const dn = oe, P_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, dn.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, dn._)`{limit: ${e}}`
}, N_ = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: P_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? dn.operators.GT : dn.operators.LT;
    e.fail$data((0, dn._)`${r}.length ${s} ${n}`);
  }
};
Yo.default = N_;
var Qo = {}, _n = {};
Object.defineProperty(_n, "__esModule", { value: !0 });
const zu = ds;
zu.code = 'require("ajv/dist/runtime/equal").default';
_n.default = zu;
Object.defineProperty(Qo, "__esModule", { value: !0 });
const Ks = be, Oe = oe, R_ = F, O_ = _n, T_ = {
  message: ({ params: { i: e, j: t } }) => (0, Oe.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Oe._)`{i: ${e}, j: ${t}}`
}, I_ = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: T_,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: l } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, Ks.getSchemaTypes)(a.items) : [];
    e.block$data(c, u, (0, Oe._)`${o} === false`), e.ok(c);
    function u() {
      const v = t.let("i", (0, Oe._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: v, j: _ }), t.assign(c, !0), t.if((0, Oe._)`${v} > 1`, () => (h() ? w : $)(v, _));
    }
    function h() {
      return d.length > 0 && !d.some((v) => v === "object" || v === "array");
    }
    function w(v, _) {
      const g = t.name("item"), m = (0, Ks.checkDataTypes)(d, g, l.opts.strictNumbers, Ks.DataType.Wrong), E = t.const("indices", (0, Oe._)`{}`);
      t.for((0, Oe._)`;${v}--;`, () => {
        t.let(g, (0, Oe._)`${r}[${v}]`), t.if(m, (0, Oe._)`continue`), d.length > 1 && t.if((0, Oe._)`typeof ${g} == "string"`, (0, Oe._)`${g} += "_"`), t.if((0, Oe._)`typeof ${E}[${g}] == "number"`, () => {
          t.assign(_, (0, Oe._)`${E}[${g}]`), e.error(), t.assign(c, !1).break();
        }).code((0, Oe._)`${E}[${g}] = ${v}`);
      });
    }
    function $(v, _) {
      const g = (0, R_.useFunc)(t, O_.default), m = t.name("outer");
      t.label(m).for((0, Oe._)`;${v}--;`, () => t.for((0, Oe._)`${_} = ${v}; ${_}--;`, () => t.if((0, Oe._)`${g}(${r}[${v}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Qo.default = I_;
var Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
const $a = oe, j_ = F, A_ = _n, k_ = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, $a._)`{allowedValue: ${e}}`
}, C_ = {
  keyword: "const",
  $data: !0,
  error: k_,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, $a._)`!${(0, j_.useFunc)(t, A_.default)}(${r}, ${s})`) : e.fail((0, $a._)`${a} !== ${r}`);
  }
};
Zo.default = C_;
var xo = {};
Object.defineProperty(xo, "__esModule", { value: !0 });
const tn = oe, D_ = F, M_ = _n, V_ = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, tn._)`{allowedValues: ${e}}`
}, L_ = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: V_,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, D_.useFunc)(t, M_.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const $ = t.const("vSchema", a);
      u = (0, tn.or)(...s.map((v, _) => w($, _)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", a, ($) => t.if((0, tn._)`${d()}(${r}, ${$})`, () => t.assign(u, !0).break()));
    }
    function w($, v) {
      const _ = s[v];
      return typeof _ == "object" && _ !== null ? (0, tn._)`${d()}(${r}, ${$}[${v}])` : (0, tn._)`${r} === ${_}`;
    }
  }
};
xo.default = L_;
Object.defineProperty(qo, "__esModule", { value: !0 });
const F_ = Ko, z_ = Go, U_ = Ho, q_ = Wo, K_ = Xo, G_ = Jo, H_ = Yo, B_ = Qo, W_ = Zo, X_ = xo, J_ = [
  // number
  F_.default,
  z_.default,
  // string
  U_.default,
  q_.default,
  // object
  K_.default,
  G_.default,
  // array
  H_.default,
  B_.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  W_.default,
  X_.default
];
qo.default = J_;
var ei = {}, Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.validateAdditionalItems = void 0;
const sr = oe, ya = F, Y_ = {
  message: ({ params: { len: e } }) => (0, sr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, sr._)`{limit: ${e}}`
}, Q_ = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Y_,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, ya.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Uu(e, n);
  }
};
function Uu(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const l = r.const("len", (0, sr._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, sr._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, ya.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, sr._)`${l} <= ${t.length}`);
    r.if((0, sr.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: a, dataProp: u, dataPropType: ya.Type.Num }, d), o.allErrors || r.if((0, sr.not)(d), () => r.break());
    });
  }
}
Kr.validateAdditionalItems = Uu;
Kr.default = Q_;
var ti = {}, Gr = {};
Object.defineProperty(Gr, "__esModule", { value: !0 });
Gr.validateTuple = void 0;
const bc = oe, Qn = F, Z_ = ce, x_ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return qu(e, "additionalItems", t);
    r.items = !0, !(0, Qn.alwaysValidSchema)(r, t) && e.ok((0, Z_.validateArray)(e));
  }
};
function qu(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = Qn.mergeEvaluated.items(n, r.length, l.items));
  const c = n.name("valid"), d = n.const("len", (0, bc._)`${a}.length`);
  r.forEach((h, w) => {
    (0, Qn.alwaysValidSchema)(l, h) || (n.if((0, bc._)`${d} > ${w}`, () => e.subschema({
      keyword: o,
      schemaProp: w,
      dataProp: w
    }, c)), e.ok(c));
  });
  function u(h) {
    const { opts: w, errSchemaPath: $ } = l, v = r.length, _ = v === h.minItems && (v === h.maxItems || h[t] === !1);
    if (w.strictTuples && !_) {
      const g = `"${o}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${$}"`;
      (0, Qn.checkStrictMode)(l, g, w.strictTuples);
    }
  }
}
Gr.validateTuple = qu;
Gr.default = x_;
Object.defineProperty(ti, "__esModule", { value: !0 });
const ev = Gr, tv = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, ev.validateTuple)(e, "items")
};
ti.default = tv;
var ri = {};
Object.defineProperty(ri, "__esModule", { value: !0 });
const Sc = oe, rv = F, nv = ce, sv = Kr, av = {
  message: ({ params: { len: e } }) => (0, Sc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Sc._)`{limit: ${e}}`
}, ov = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: av,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, rv.alwaysValidSchema)(n, t) && (s ? (0, sv.validateAdditionalItems)(e, s) : e.ok((0, nv.validateArray)(e)));
  }
};
ri.default = ov;
var ni = {};
Object.defineProperty(ni, "__esModule", { value: !0 });
const xe = oe, An = F, iv = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, xe.str)`must contain at least ${e} valid item(s)` : (0, xe.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, xe._)`{minContains: ${e}}` : (0, xe._)`{minContains: ${e}, maxContains: ${t}}`
}, cv = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: iv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, l;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, l = d) : o = 1;
    const u = t.const("len", (0, xe._)`${s}.length`);
    if (e.setParams({ min: o, max: l }), l === void 0 && o === 0) {
      (0, An.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && o > l) {
      (0, An.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, An.alwaysValidSchema)(a, r)) {
      let _ = (0, xe._)`${u} >= ${o}`;
      l !== void 0 && (_ = (0, xe._)`${_} && ${u} <= ${l}`), e.pass(_);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    l === void 0 && o === 1 ? $(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, xe._)`${s}.length > 0`, w)) : (t.let(h, !1), w()), e.result(h, () => e.reset());
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
      t.code((0, xe._)`${_}++`), l === void 0 ? t.if((0, xe._)`${_} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, xe._)`${_} > ${l}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, xe._)`${_} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
ni.default = cv;
var Ku = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = oe, r = F, n = ce;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${c},
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
    code(c) {
      const [d, u] = a(c);
      o(c, d), l(c, u);
    }
  };
  function a({ schema: c }) {
    const d = {}, u = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const w = Array.isArray(c[h]) ? d : u;
      w[h] = c[h];
    }
    return [d, u];
  }
  function o(c, d = c.schema) {
    const { gen: u, data: h, it: w } = c;
    if (Object.keys(d).length === 0)
      return;
    const $ = u.let("missing");
    for (const v in d) {
      const _ = d[v];
      if (_.length === 0)
        continue;
      const g = (0, n.propertyInData)(u, h, v, w.opts.ownProperties);
      c.setParams({
        property: v,
        depsCount: _.length,
        deps: _.join(", ")
      }), w.allErrors ? u.if(g, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (u.if((0, t._)`${g} && (${(0, n.checkMissingProp)(c, _, $)})`), (0, n.reportMissingProp)(c, $), u.else());
    }
  }
  e.validatePropertyDeps = o;
  function l(c, d = c.schema) {
    const { gen: u, data: h, keyword: w, it: $ } = c, v = u.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)($, d[_]) || (u.if(
        (0, n.propertyInData)(u, h, _, $.opts.ownProperties),
        () => {
          const g = c.subschema({ keyword: w, schemaProp: _ }, v);
          c.mergeValidEvaluated(g, v);
        },
        () => u.var(v, !0)
        // TODO var
      ), c.ok(v));
  }
  e.validateSchemaDeps = l, e.default = s;
})(Ku);
var si = {};
Object.defineProperty(si, "__esModule", { value: !0 });
const Gu = oe, lv = F, uv = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Gu._)`{propertyName: ${e.propertyName}}`
}, dv = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: uv,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, lv.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, Gu.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
si.default = dv;
var Es = {};
Object.defineProperty(Es, "__esModule", { value: !0 });
const kn = ce, ot = oe, fv = vt, Cn = F, hv = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, ot._)`{additionalProperty: ${e.additionalProperty}}`
}, mv = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: hv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, Cn.alwaysValidSchema)(o, r))
      return;
    const d = (0, kn.allSchemaProperties)(n.properties), u = (0, kn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, ot._)`${a} === ${fv.default.errors}`);
    function h() {
      t.forIn("key", s, (g) => {
        !d.length && !u.length ? v(g) : t.if(w(g), () => v(g));
      });
    }
    function w(g) {
      let m;
      if (d.length > 8) {
        const E = (0, Cn.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, kn.isOwnProperty)(t, E, g);
      } else d.length ? m = (0, ot.or)(...d.map((E) => (0, ot._)`${g} === ${E}`)) : m = ot.nil;
      return u.length && (m = (0, ot.or)(m, ...u.map((E) => (0, ot._)`${(0, kn.usePattern)(e, E)}.test(${g})`))), (0, ot.not)(m);
    }
    function $(g) {
      t.code((0, ot._)`delete ${s}[${g}]`);
    }
    function v(g) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        $(g);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: g }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, Cn.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_(g, m, !1), t.if((0, ot.not)(m), () => {
          e.reset(), $(g);
        })) : (_(g, m), l || t.if((0, ot.not)(m), () => t.break()));
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
Es.default = mv;
var ai = {};
Object.defineProperty(ai, "__esModule", { value: !0 });
const pv = _s(), Pc = ce, Gs = F, Nc = Es, $v = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Nc.default.code(new pv.KeywordCxt(a, Nc.default, "additionalProperties"));
    const o = (0, Pc.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Gs.mergeEvaluated.props(t, (0, Gs.toHash)(o), a.props));
    const l = o.filter((h) => !(0, Gs.alwaysValidSchema)(a, r[h]));
    if (l.length === 0)
      return;
    const c = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, Pc.propertyInData)(t, s, h, a.opts.ownProperties)), u(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
ai.default = $v;
var oi = {};
Object.defineProperty(oi, "__esModule", { value: !0 });
const Rc = ce, Dn = oe, Oc = F, Tc = F, yv = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, l = (0, Rc.allSchemaProperties)(r), c = l.filter((_) => (0, Oc.alwaysValidSchema)(a, r[_]));
    if (l.length === 0 || c.length === l.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, u = t.name("valid");
    a.props !== !0 && !(a.props instanceof Dn.Name) && (a.props = (0, Tc.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    w();
    function w() {
      for (const _ of l)
        d && $(_), a.allErrors ? v(_) : (t.var(u, !0), v(_), t.if(u));
    }
    function $(_) {
      for (const g in d)
        new RegExp(_).test(g) && (0, Oc.checkStrictMode)(a, `property ${g} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function v(_) {
      t.forIn("key", n, (g) => {
        t.if((0, Dn._)`${(0, Rc.usePattern)(e, _)}.test(${g})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: g,
            dataPropType: Tc.Type.Str
          }, u), a.opts.unevaluated && h !== !0 ? t.assign((0, Dn._)`${h}[${g}]`, !0) : !m && !a.allErrors && t.if((0, Dn.not)(u), () => t.break());
        });
      });
    }
  }
};
oi.default = yv;
var ii = {};
Object.defineProperty(ii, "__esModule", { value: !0 });
const gv = F, _v = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, gv.alwaysValidSchema)(n, r)) {
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
ii.default = _v;
var ci = {};
Object.defineProperty(ci, "__esModule", { value: !0 });
const vv = ce, wv = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: vv.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
ci.default = wv;
var li = {};
Object.defineProperty(li, "__esModule", { value: !0 });
const Zn = oe, Ev = F, bv = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Zn._)`{passingSchemas: ${e.passing}}`
}, Sv = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: bv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), l = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: l }), t.block(d), e.result(o, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((u, h) => {
        let w;
        (0, Ev.alwaysValidSchema)(s, u) ? t.var(c, !0) : w = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, Zn._)`${c} && ${o}`).assign(o, !1).assign(l, (0, Zn._)`[${l}, ${h}]`).else(), t.if(c, () => {
          t.assign(o, !0), t.assign(l, h), w && e.mergeEvaluated(w, Zn.Name);
        });
      });
    }
  }
};
li.default = Sv;
var ui = {};
Object.defineProperty(ui, "__esModule", { value: !0 });
const Pv = F, Nv = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, Pv.alwaysValidSchema)(n, a))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
ui.default = Nv;
var di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
const is = oe, Hu = F, Rv = {
  message: ({ params: e }) => (0, is.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, is._)`{failingKeyword: ${e.ifClause}}`
}, Ov = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Rv,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Hu.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Ic(n, "then"), a = Ic(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), l = t.name("_valid");
    if (c(), e.reset(), s && a) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, is.not)(l), d("else"));
    e.pass(o, () => e.error(!0));
    function c() {
      const u = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, l);
      e.mergeEvaluated(u);
    }
    function d(u, h) {
      return () => {
        const w = e.subschema({ keyword: u }, l);
        t.assign(o, l), e.mergeValidEvaluated(w, o), h ? t.assign(h, (0, is._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function Ic(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Hu.alwaysValidSchema)(e, r);
}
di.default = Ov;
var fi = {};
Object.defineProperty(fi, "__esModule", { value: !0 });
const Tv = F, Iv = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Tv.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
fi.default = Iv;
Object.defineProperty(ei, "__esModule", { value: !0 });
const jv = Kr, Av = ti, kv = Gr, Cv = ri, Dv = ni, Mv = Ku, Vv = si, Lv = Es, Fv = ai, zv = oi, Uv = ii, qv = ci, Kv = li, Gv = ui, Hv = di, Bv = fi;
function Wv(e = !1) {
  const t = [
    // any
    Uv.default,
    qv.default,
    Kv.default,
    Gv.default,
    Hv.default,
    Bv.default,
    // object
    Vv.default,
    Lv.default,
    Mv.default,
    Fv.default,
    zv.default
  ];
  return e ? t.push(Av.default, Cv.default) : t.push(jv.default, kv.default), t.push(Dv.default), t;
}
ei.default = Wv;
var hi = {}, mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
const we = oe, Xv = {
  message: ({ schemaCode: e }) => (0, we.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, we._)`{format: ${e}}`
}, Jv = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Xv,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: l } = e, { opts: c, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!c.validateFormats)
      return;
    s ? w() : $();
    function w() {
      const v = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, we._)`${v}[${o}]`), g = r.let("fType"), m = r.let("format");
      r.if((0, we._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign(g, (0, we._)`${_}.type || "string"`).assign(m, (0, we._)`${_}.validate`), () => r.assign(g, (0, we._)`"string"`).assign(m, _)), e.fail$data((0, we.or)(E(), R()));
      function E() {
        return c.strictSchema === !1 ? we.nil : (0, we._)`${o} && !${m}`;
      }
      function R() {
        const O = u.$async ? (0, we._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, we._)`${m}(${n})`, I = (0, we._)`(typeof ${m} == "function" ? ${O} : ${m}.test(${n}))`;
        return (0, we._)`${m} && ${m} !== true && ${g} === ${t} && !${I}`;
      }
    }
    function $() {
      const v = h.formats[a];
      if (!v) {
        E();
        return;
      }
      if (v === !0)
        return;
      const [_, g, m] = R(v);
      _ === t && e.pass(O());
      function E() {
        if (c.strictSchema === !1) {
          h.logger.warn(I());
          return;
        }
        throw new Error(I());
        function I() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function R(I) {
        const K = I instanceof RegExp ? (0, we.regexpCode)(I) : c.code.formats ? (0, we._)`${c.code.formats}${(0, we.getProperty)(a)}` : void 0, Y = r.scopeValue("formats", { key: a, ref: I, code: K });
        return typeof I == "object" && !(I instanceof RegExp) ? [I.type || "string", I.validate, (0, we._)`${Y}.validate`] : ["string", I, Y];
      }
      function O() {
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
mi.default = Jv;
Object.defineProperty(hi, "__esModule", { value: !0 });
const Yv = mi, Qv = [Yv.default];
hi.default = Qv;
var Mr = {};
Object.defineProperty(Mr, "__esModule", { value: !0 });
Mr.contentVocabulary = Mr.metadataVocabulary = void 0;
Mr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Mr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Fo, "__esModule", { value: !0 });
const Zv = zo, xv = qo, ew = ei, tw = hi, jc = Mr, rw = [
  Zv.default,
  xv.default,
  (0, ew.default)(),
  tw.default,
  jc.metadataVocabulary,
  jc.contentVocabulary
];
Fo.default = rw;
var pi = {}, bs = {};
Object.defineProperty(bs, "__esModule", { value: !0 });
bs.DiscrError = void 0;
var Ac;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Ac || (bs.DiscrError = Ac = {}));
Object.defineProperty(pi, "__esModule", { value: !0 });
const vr = oe, ga = bs, kc = We, nw = qr, sw = F, aw = {
  message: ({ params: { discrError: e, tagName: t } }) => e === ga.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, vr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, ow = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: aw,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const l = n.propertyName;
    if (typeof l != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, vr._)`${r}${(0, vr.getProperty)(l)}`);
    t.if((0, vr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: ga.DiscrError.Tag, tag: d, tagName: l })), e.ok(c);
    function u() {
      const $ = w();
      t.if(!1);
      for (const v in $)
        t.elseIf((0, vr._)`${d} === ${v}`), t.assign(c, h($[v]));
      t.else(), e.error(!1, { discrError: ga.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h($) {
      const v = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: $ }, v);
      return e.mergeEvaluated(_, vr.Name), v;
    }
    function w() {
      var $;
      const v = {}, _ = m(s);
      let g = !0;
      for (let O = 0; O < o.length; O++) {
        let I = o[O];
        if (I != null && I.$ref && !(0, sw.schemaHasRulesButRef)(I, a.self.RULES)) {
          const Y = I.$ref;
          if (I = kc.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, Y), I instanceof kc.SchemaEnv && (I = I.schema), I === void 0)
            throw new nw.default(a.opts.uriResolver, a.baseId, Y);
        }
        const K = ($ = I == null ? void 0 : I.properties) === null || $ === void 0 ? void 0 : $[l];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        g = g && (_ || m(I)), E(K, O);
      }
      if (!g)
        throw new Error(`discriminator: "${l}" must be required`);
      return v;
      function m({ required: O }) {
        return Array.isArray(O) && O.includes(l);
      }
      function E(O, I) {
        if (O.const)
          R(O.const, I);
        else if (O.enum)
          for (const K of O.enum)
            R(K, I);
        else
          throw new Error(`discriminator: "properties/${l}" must have "const" or "enum"`);
      }
      function R(O, I) {
        if (typeof O != "string" || O in v)
          throw new Error(`discriminator: "${l}" values must be unique strings`);
        v[O] = I;
      }
    }
  }
};
pi.default = ow;
const iw = "http://json-schema.org/draft-07/schema#", cw = "http://json-schema.org/draft-07/schema#", lw = "Core schema meta-schema", uw = {
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
}, dw = [
  "object",
  "boolean"
], fw = {
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
}, hw = {
  $schema: iw,
  $id: cw,
  title: lw,
  definitions: uw,
  type: dw,
  properties: fw,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = vu, n = Fo, s = pi, a = hw, o = ["/properties"], l = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((v) => this.addVocabulary(v)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const v = this.opts.$data ? this.$dataMetaSchema(a, o) : a;
      this.addMetaSchema(v, l, !1), this.refs["http://json-schema.org/schema"] = l;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(l) ? l : void 0);
    }
  }
  t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var d = _s();
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var u = oe;
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
  var h = Mo();
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var w = qr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return w.default;
  } });
})(da, da.exports);
var mw = da.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = mw, r = oe, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, a = {
    message: ({ keyword: l, schemaCode: c }) => (0, r.str)`should be ${s[l].okStr} ${c}`,
    params: ({ keyword: l, schemaCode: c }) => (0, r._)`{comparison: ${s[l].okStr}, limit: ${c}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: a,
    code(l) {
      const { gen: c, data: d, schemaCode: u, keyword: h, it: w } = l, { opts: $, self: v } = w;
      if (!$.validateFormats)
        return;
      const _ = new t.KeywordCxt(w, v.RULES.all.format.definition, "format");
      _.$data ? g() : m();
      function g() {
        const R = c.scopeValue("formats", {
          ref: v.formats,
          code: $.code.formats
        }), O = c.const("fmt", (0, r._)`${R}[${_.schemaCode}]`);
        l.fail$data((0, r.or)((0, r._)`typeof ${O} != "object"`, (0, r._)`${O} instanceof RegExp`, (0, r._)`typeof ${O}.compare != "function"`, E(O)));
      }
      function m() {
        const R = _.schema, O = v.formats[R];
        if (!O || O === !0)
          return;
        if (typeof O != "object" || O instanceof RegExp || typeof O.compare != "function")
          throw new Error(`"${h}": format "${R}" does not define "compare" function`);
        const I = c.scopeValue("formats", {
          key: R,
          ref: O,
          code: $.code.formats ? (0, r._)`${$.code.formats}${(0, r.getProperty)(R)}` : void 0
        });
        l.fail$data(E(I));
      }
      function E(R) {
        return (0, r._)`${R}.compare(${d}, ${u}) ${s[h].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const o = (l) => (l.addKeyword(e.formatLimitDefinition), l);
  e.default = o;
})(_u);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = gu, n = _u, s = oe, a = new s.Name("fullFormats"), o = new s.Name("fastFormats"), l = (d, u = { keywords: !0 }) => {
    if (Array.isArray(u))
      return c(d, u, r.fullFormats, a), d;
    const [h, w] = u.mode === "fast" ? [r.fastFormats, o] : [r.fullFormats, a], $ = u.formats || r.formatNames;
    return c(d, $, h, w), u.keywords && (0, n.default)(d), d;
  };
  l.get = (d, u = "full") => {
    const w = (u === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!w)
      throw new Error(`Unknown format "${d}"`);
    return w;
  };
  function c(d, u, h, w) {
    var $, v;
    ($ = (v = d.opts.code).formats) !== null && $ !== void 0 || (v.formats = (0, s._)`require("ajv-formats/dist/formats").${w}`);
    for (const _ of u)
      d.addFormat(_, h[_]);
  }
  e.exports = t = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
})(ua, ua.exports);
var pw = ua.exports;
const $w = /* @__PURE__ */ ml(pw), yw = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), a = Object.getOwnPropertyDescriptor(t, r);
  !gw(s, a) && n || Object.defineProperty(e, r, a);
}, gw = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, _w = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, vw = (e, t) => `/* Wrapped ${e}*/
${t}`, ww = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), Ew = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), bw = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = vw.bind(null, n, t.toString());
  Object.defineProperty(s, "name", Ew);
  const { writable: a, enumerable: o, configurable: l } = ww;
  Object.defineProperty(e, "toString", { value: s, writable: a, enumerable: o, configurable: l });
};
function Sw(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    yw(e, t, s, r);
  return _w(e, t), bw(e, t, n), e;
}
const Cc = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: s = !1,
    after: a = !0
  } = t;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!s && !a)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let o, l, c;
  const d = function(...u) {
    const h = this, w = () => {
      o = void 0, l && (clearTimeout(l), l = void 0), a && (c = e.apply(h, u));
    }, $ = () => {
      l = void 0, o && (clearTimeout(o), o = void 0), a && (c = e.apply(h, u));
    }, v = s && !o;
    return clearTimeout(o), o = setTimeout(w, r), n > 0 && n !== Number.POSITIVE_INFINITY && !l && (l = setTimeout($, n)), v && (c = e.apply(h, u)), c;
  };
  return Sw(d, e), d.cancel = () => {
    o && (clearTimeout(o), o = void 0), l && (clearTimeout(l), l = void 0);
  }, d;
};
var _a = { exports: {} };
const Pw = "2.0.0", Bu = 256, Nw = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, Rw = 16, Ow = Bu - 6, Tw = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var vn = {
  MAX_LENGTH: Bu,
  MAX_SAFE_COMPONENT_LENGTH: Rw,
  MAX_SAFE_BUILD_LENGTH: Ow,
  MAX_SAFE_INTEGER: Nw,
  RELEASE_TYPES: Tw,
  SEMVER_SPEC_VERSION: Pw,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Iw = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Ss = Iw;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = vn, a = Ss;
  t = e.exports = {};
  const o = t.re = [], l = t.safeRe = [], c = t.src = [], d = t.safeSrc = [], u = t.t = {};
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
    const R = v(m), O = h++;
    a(g, O, m), u[g] = O, c[O] = m, d[O] = R, o[O] = new RegExp(m, E ? "g" : void 0), l[O] = new RegExp(R, E ? "g" : void 0);
  };
  _("NUMERICIDENTIFIER", "0|[1-9]\\d*"), _("NUMERICIDENTIFIERLOOSE", "\\d+"), _("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${w}*`), _("MAINVERSION", `(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})`), _("MAINVERSIONLOOSE", `(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASEIDENTIFIER", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIER]})`), _("PRERELEASEIDENTIFIERLOOSE", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASE", `(?:-(${c[u.PRERELEASEIDENTIFIER]}(?:\\.${c[u.PRERELEASEIDENTIFIER]})*))`), _("PRERELEASELOOSE", `(?:-?(${c[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[u.PRERELEASEIDENTIFIERLOOSE]})*))`), _("BUILDIDENTIFIER", `${w}+`), _("BUILD", `(?:\\+(${c[u.BUILDIDENTIFIER]}(?:\\.${c[u.BUILDIDENTIFIER]})*))`), _("FULLPLAIN", `v?${c[u.MAINVERSION]}${c[u.PRERELEASE]}?${c[u.BUILD]}?`), _("FULL", `^${c[u.FULLPLAIN]}$`), _("LOOSEPLAIN", `[v=\\s]*${c[u.MAINVERSIONLOOSE]}${c[u.PRERELEASELOOSE]}?${c[u.BUILD]}?`), _("LOOSE", `^${c[u.LOOSEPLAIN]}$`), _("GTLT", "((?:<|>)?=?)"), _("XRANGEIDENTIFIERLOOSE", `${c[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), _("XRANGEIDENTIFIER", `${c[u.NUMERICIDENTIFIER]}|x|X|\\*`), _("XRANGEPLAIN", `[v=\\s]*(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:${c[u.PRERELEASE]})?${c[u.BUILD]}?)?)?`), _("XRANGEPLAINLOOSE", `[v=\\s]*(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:${c[u.PRERELEASELOOSE]})?${c[u.BUILD]}?)?)?`), _("XRANGE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAIN]}$`), _("XRANGELOOSE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAINLOOSE]}$`), _("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), _("COERCE", `${c[u.COERCEPLAIN]}(?:$|[^\\d])`), _("COERCEFULL", c[u.COERCEPLAIN] + `(?:${c[u.PRERELEASE]})?(?:${c[u.BUILD]})?(?:$|[^\\d])`), _("COERCERTL", c[u.COERCE], !0), _("COERCERTLFULL", c[u.COERCEFULL], !0), _("LONETILDE", "(?:~>?)"), _("TILDETRIM", `(\\s*)${c[u.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", _("TILDE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAIN]}$`), _("TILDELOOSE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAINLOOSE]}$`), _("LONECARET", "(?:\\^)"), _("CARETTRIM", `(\\s*)${c[u.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", _("CARET", `^${c[u.LONECARET]}${c[u.XRANGEPLAIN]}$`), _("CARETLOOSE", `^${c[u.LONECARET]}${c[u.XRANGEPLAINLOOSE]}$`), _("COMPARATORLOOSE", `^${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]})$|^$`), _("COMPARATOR", `^${c[u.GTLT]}\\s*(${c[u.FULLPLAIN]})$|^$`), _("COMPARATORTRIM", `(\\s*)${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]}|${c[u.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", _("HYPHENRANGE", `^\\s*(${c[u.XRANGEPLAIN]})\\s+-\\s+(${c[u.XRANGEPLAIN]})\\s*$`), _("HYPHENRANGELOOSE", `^\\s*(${c[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[u.XRANGEPLAINLOOSE]})\\s*$`), _("STAR", "(<|>)?=?\\s*\\*"), _("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), _("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(_a, _a.exports);
var wn = _a.exports;
const jw = Object.freeze({ loose: !0 }), Aw = Object.freeze({}), kw = (e) => e ? typeof e != "object" ? jw : e : Aw;
var $i = kw;
const Dc = /^[0-9]+$/, Wu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Dc.test(e), n = Dc.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, Cw = (e, t) => Wu(t, e);
var Xu = {
  compareIdentifiers: Wu,
  rcompareIdentifiers: Cw
};
const Mn = Ss, { MAX_LENGTH: Mc, MAX_SAFE_INTEGER: Vn } = vn, { safeRe: Ln, t: Fn } = wn, Dw = $i, { compareIdentifiers: Hs } = Xu;
let Mw = class $t {
  constructor(t, r) {
    if (r = Dw(r), t instanceof $t) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Mc)
      throw new TypeError(
        `version is longer than ${Mc} characters`
      );
    Mn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Ln[Fn.LOOSE] : Ln[Fn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Vn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Vn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Vn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < Vn)
          return a;
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
    if (Mn("SemVer.compare", this.version, this.options, t), !(t instanceof $t)) {
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
      if (Mn("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return Hs(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof $t || (t = new $t(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (Mn("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return Hs(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? Ln[Fn.PRERELEASELOOSE] : Ln[Fn.PRERELEASE]);
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
          let a = this.prerelease.length;
          for (; --a >= 0; )
            typeof this.prerelease[a] == "number" && (this.prerelease[a]++, a = -2);
          if (a === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(s);
          }
        }
        if (r) {
          let a = [r, s];
          n === !1 && (a = [r]), Hs(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Le = Mw;
const Vc = Le, Vw = (e, t, r = !1) => {
  if (e instanceof Vc)
    return e;
  try {
    return new Vc(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var mr = Vw;
const Lw = mr, Fw = (e, t) => {
  const r = Lw(e, t);
  return r ? r.version : null;
};
var zw = Fw;
const Uw = mr, qw = (e, t) => {
  const r = Uw(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var Kw = qw;
const Lc = Le, Gw = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Lc(
      e instanceof Lc ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var Hw = Gw;
const Fc = mr, Bw = (e, t) => {
  const r = Fc(e, null, !0), n = Fc(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const a = s > 0, o = a ? r : n, l = a ? n : r, c = !!o.prerelease.length;
  if (!!l.prerelease.length && !c) {
    if (!l.patch && !l.minor)
      return "major";
    if (l.compareMain(o) === 0)
      return l.minor && !l.patch ? "minor" : "patch";
  }
  const u = c ? "pre" : "";
  return r.major !== n.major ? u + "major" : r.minor !== n.minor ? u + "minor" : r.patch !== n.patch ? u + "patch" : "prerelease";
};
var Ww = Bw;
const Xw = Le, Jw = (e, t) => new Xw(e, t).major;
var Yw = Jw;
const Qw = Le, Zw = (e, t) => new Qw(e, t).minor;
var xw = Zw;
const eE = Le, tE = (e, t) => new eE(e, t).patch;
var rE = tE;
const nE = mr, sE = (e, t) => {
  const r = nE(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var aE = sE;
const zc = Le, oE = (e, t, r) => new zc(e, r).compare(new zc(t, r));
var ft = oE;
const iE = ft, cE = (e, t, r) => iE(t, e, r);
var lE = cE;
const uE = ft, dE = (e, t) => uE(e, t, !0);
var fE = dE;
const Uc = Le, hE = (e, t, r) => {
  const n = new Uc(e, r), s = new Uc(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var yi = hE;
const mE = yi, pE = (e, t) => e.sort((r, n) => mE(r, n, t));
var $E = pE;
const yE = yi, gE = (e, t) => e.sort((r, n) => yE(n, r, t));
var _E = gE;
const vE = ft, wE = (e, t, r) => vE(e, t, r) > 0;
var Ps = wE;
const EE = ft, bE = (e, t, r) => EE(e, t, r) < 0;
var gi = bE;
const SE = ft, PE = (e, t, r) => SE(e, t, r) === 0;
var Ju = PE;
const NE = ft, RE = (e, t, r) => NE(e, t, r) !== 0;
var Yu = RE;
const OE = ft, TE = (e, t, r) => OE(e, t, r) >= 0;
var _i = TE;
const IE = ft, jE = (e, t, r) => IE(e, t, r) <= 0;
var vi = jE;
const AE = Ju, kE = Yu, CE = Ps, DE = _i, ME = gi, VE = vi, LE = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return AE(e, r, n);
    case "!=":
      return kE(e, r, n);
    case ">":
      return CE(e, r, n);
    case ">=":
      return DE(e, r, n);
    case "<":
      return ME(e, r, n);
    case "<=":
      return VE(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Qu = LE;
const FE = Le, zE = mr, { safeRe: zn, t: Un } = wn, UE = (e, t) => {
  if (e instanceof FE)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? zn[Un.COERCEFULL] : zn[Un.COERCE]);
  else {
    const c = t.includePrerelease ? zn[Un.COERCERTLFULL] : zn[Un.COERCERTL];
    let d;
    for (; (d = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), c.lastIndex = d.index + d[1].length + d[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", l = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return zE(`${n}.${s}.${a}${o}${l}`, t);
};
var qE = UE;
const KE = mr, GE = vn, HE = Le, BE = (e, t, r) => {
  if (!GE.RELEASE_TYPES.includes(t))
    return null;
  const n = WE(e, r);
  return n && XE(n, t);
}, WE = (e, t) => {
  const r = e instanceof HE ? e.version : e;
  return KE(r, t);
}, XE = (e, t) => {
  if (JE(t))
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
}, JE = (e) => e.startsWith("pre");
var YE = BE;
class QE {
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
var ZE = QE, Bs, qc;
function ht() {
  if (qc) return Bs;
  qc = 1;
  const e = /\s+/g;
  class t {
    constructor(C, W) {
      if (W = s(W), C instanceof t)
        return C.loose === !!W.loose && C.includePrerelease === !!W.includePrerelease ? C : new t(C.raw, W);
      if (C instanceof a)
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
      const p = this.options.loose, S = p ? c[u.HYPHENRANGELOOSE] : c[u.HYPHENRANGE];
      C = C.replace(S, B(this.options.includePrerelease)), o("hyphen replace", C), C = C.replace(c[u.COMPARATORTRIM], h), o("comparator trim", C), C = C.replace(c[u.TILDETRIM], w), o("tilde trim", C), C = C.replace(c[u.CARETTRIM], $), o("caret trim", C);
      let y = C.split(" ").map((j) => O(j, this.options)).join(" ").split(/\s+/).map((j) => Q(j, this.options));
      p && (y = y.filter((j) => (o("loose invalid filter", j, this.options), !!j.match(c[u.COMPARATORLOOSE])))), o("range list", y);
      const i = /* @__PURE__ */ new Map(), f = y.map((j) => new a(j, this.options));
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
          C = new l(C, this.options);
        } catch {
          return !1;
        }
      for (let W = 0; W < this.set.length; W++)
        if (ue(this.set[W], C, this.options))
          return !0;
      return !1;
    }
  }
  Bs = t;
  const r = ZE, n = new r(), s = $i, a = Ns(), o = Ss, l = Le, {
    safeRe: c,
    src: d,
    t: u,
    comparatorTrimReplace: h,
    tildeTrimReplace: w,
    caretTrimReplace: $
  } = wn, { FLAG_INCLUDE_PRERELEASE: v, FLAG_LOOSE: _ } = vn, g = new RegExp(d[u.BUILD], "g"), m = (V) => V.value === "<0.0.0-0", E = (V) => V.value === "", R = (V, C) => {
    let W = !0;
    const z = V.slice();
    let P = z.pop();
    for (; W && z.length; )
      W = z.every((p) => P.intersects(p, C)), P = z.pop();
    return W;
  }, O = (V, C) => (V = V.replace(c[u.BUILD], ""), o("comp", V, C), V = le(V, C), o("caret", V), V = K(V, C), o("tildes", V), V = ye(V, C), o("xrange", V), V = J(V, C), o("stars", V), V), I = (V) => !V || V.toLowerCase() === "x" || V === "*", K = (V, C) => V.trim().split(/\s+/).map((W) => Y(W, C)).join(" "), Y = (V, C) => {
    const W = C.loose ? c[u.TILDELOOSE] : c[u.TILDE];
    return V.replace(W, (z, P, p, S, y) => {
      o("tilde", V, z, P, p, S, y);
      let i;
      return I(P) ? i = "" : I(p) ? i = `>=${P}.0.0 <${+P + 1}.0.0-0` : I(S) ? i = `>=${P}.${p}.0 <${P}.${+p + 1}.0-0` : y ? (o("replaceTilde pr", y), i = `>=${P}.${p}.${S}-${y} <${P}.${+p + 1}.0-0`) : i = `>=${P}.${p}.${S} <${P}.${+p + 1}.0-0`, o("tilde return", i), i;
    });
  }, le = (V, C) => V.trim().split(/\s+/).map((W) => he(W, C)).join(" "), he = (V, C) => {
    o("caret", V, C);
    const W = C.loose ? c[u.CARETLOOSE] : c[u.CARET], z = C.includePrerelease ? "-0" : "";
    return V.replace(W, (P, p, S, y, i) => {
      o("caret", V, P, p, S, y, i);
      let f;
      return I(p) ? f = "" : I(S) ? f = `>=${p}.0.0${z} <${+p + 1}.0.0-0` : I(y) ? p === "0" ? f = `>=${p}.${S}.0${z} <${p}.${+S + 1}.0-0` : f = `>=${p}.${S}.0${z} <${+p + 1}.0.0-0` : i ? (o("replaceCaret pr", i), p === "0" ? S === "0" ? f = `>=${p}.${S}.${y}-${i} <${p}.${S}.${+y + 1}-0` : f = `>=${p}.${S}.${y}-${i} <${p}.${+S + 1}.0-0` : f = `>=${p}.${S}.${y}-${i} <${+p + 1}.0.0-0`) : (o("no pr"), p === "0" ? S === "0" ? f = `>=${p}.${S}.${y}${z} <${p}.${S}.${+y + 1}-0` : f = `>=${p}.${S}.${y}${z} <${p}.${+S + 1}.0-0` : f = `>=${p}.${S}.${y} <${+p + 1}.0.0-0`), o("caret return", f), f;
    });
  }, ye = (V, C) => (o("replaceXRanges", V, C), V.split(/\s+/).map((W) => q(W, C)).join(" ")), q = (V, C) => {
    V = V.trim();
    const W = C.loose ? c[u.XRANGELOOSE] : c[u.XRANGE];
    return V.replace(W, (z, P, p, S, y, i) => {
      o("xRange", V, z, P, p, S, y, i);
      const f = I(p), b = f || I(S), j = b || I(y), A = j;
      return P === "=" && A && (P = ""), i = C.includePrerelease ? "-0" : "", f ? P === ">" || P === "<" ? z = "<0.0.0-0" : z = "*" : P && A ? (b && (S = 0), y = 0, P === ">" ? (P = ">=", b ? (p = +p + 1, S = 0, y = 0) : (S = +S + 1, y = 0)) : P === "<=" && (P = "<", b ? p = +p + 1 : S = +S + 1), P === "<" && (i = "-0"), z = `${P + p}.${S}.${y}${i}`) : b ? z = `>=${p}.0.0${i} <${+p + 1}.0.0-0` : j && (z = `>=${p}.${S}.0${i} <${p}.${+S + 1}.0-0`), o("xRange return", z), z;
    });
  }, J = (V, C) => (o("replaceStars", V, C), V.trim().replace(c[u.STAR], "")), Q = (V, C) => (o("replaceGTE0", V, C), V.trim().replace(c[C.includePrerelease ? u.GTE0PRE : u.GTE0], "")), B = (V) => (C, W, z, P, p, S, y, i, f, b, j, A) => (I(z) ? W = "" : I(P) ? W = `>=${z}.0.0${V ? "-0" : ""}` : I(p) ? W = `>=${z}.${P}.0${V ? "-0" : ""}` : S ? W = `>=${W}` : W = `>=${W}${V ? "-0" : ""}`, I(f) ? i = "" : I(b) ? i = `<${+f + 1}.0.0-0` : I(j) ? i = `<${f}.${+b + 1}.0-0` : A ? i = `<=${f}.${b}.${j}-${A}` : V ? i = `<${f}.${b}.${+j + 1}-0` : i = `<=${i}`, `${W} ${i}`.trim()), ue = (V, C, W) => {
    for (let z = 0; z < V.length; z++)
      if (!V[z].test(C))
        return !1;
    if (C.prerelease.length && !W.includePrerelease) {
      for (let z = 0; z < V.length; z++)
        if (o(V[z].semver), V[z].semver !== a.ANY && V[z].semver.prerelease.length > 0) {
          const P = V[z].semver;
          if (P.major === C.major && P.minor === C.minor && P.patch === C.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Bs;
}
var Ws, Kc;
function Ns() {
  if (Kc) return Ws;
  Kc = 1;
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
      u = u.trim().split(/\s+/).join(" "), o("comparator", u, h), this.options = h, this.loose = !!h.loose, this.parse(u), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(u) {
      const h = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], w = u.match(h);
      if (!w)
        throw new TypeError(`Invalid comparator: ${u}`);
      this.operator = w[1] !== void 0 ? w[1] : "", this.operator === "=" && (this.operator = ""), w[2] ? this.semver = new l(w[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(u) {
      if (o("Comparator.test", u, this.options.loose), this.semver === e || u === e)
        return !0;
      if (typeof u == "string")
        try {
          u = new l(u, this.options);
        } catch {
          return !1;
        }
      return a(u, this.operator, this.semver, this.options);
    }
    intersects(u, h) {
      if (!(u instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(u.value, h).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new c(this.value, h).test(u.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || a(this.semver, "<", u.semver, h) && this.operator.startsWith(">") && u.operator.startsWith("<") || a(this.semver, ">", u.semver, h) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  Ws = t;
  const r = $i, { safeRe: n, t: s } = wn, a = Qu, o = Ss, l = Le, c = ht();
  return Ws;
}
const xE = ht(), eb = (e, t, r) => {
  try {
    t = new xE(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Rs = eb;
const tb = ht(), rb = (e, t) => new tb(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var nb = rb;
const sb = Le, ab = ht(), ob = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new ab(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === -1) && (n = o, s = new sb(n, r));
  }), n;
};
var ib = ob;
const cb = Le, lb = ht(), ub = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new lb(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === 1) && (n = o, s = new cb(n, r));
  }), n;
};
var db = ub;
const Xs = Le, fb = ht(), Gc = Ps, hb = (e, t) => {
  e = new fb(e, t);
  let r = new Xs("0.0.0");
  if (e.test(r) || (r = new Xs("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let a = null;
    s.forEach((o) => {
      const l = new Xs(o.semver.version);
      switch (o.operator) {
        case ">":
          l.prerelease.length === 0 ? l.patch++ : l.prerelease.push(0), l.raw = l.format();
        case "":
        case ">=":
          (!a || Gc(l, a)) && (a = l);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || Gc(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var mb = hb;
const pb = ht(), $b = (e, t) => {
  try {
    return new pb(e, t).range || "*";
  } catch {
    return null;
  }
};
var yb = $b;
const gb = Le, Zu = Ns(), { ANY: _b } = Zu, vb = ht(), wb = Rs, Hc = Ps, Bc = gi, Eb = vi, bb = _i, Sb = (e, t, r, n) => {
  e = new gb(e, n), t = new vb(t, n);
  let s, a, o, l, c;
  switch (r) {
    case ">":
      s = Hc, a = Eb, o = Bc, l = ">", c = ">=";
      break;
    case "<":
      s = Bc, a = bb, o = Hc, l = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (wb(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const u = t.set[d];
    let h = null, w = null;
    if (u.forEach(($) => {
      $.semver === _b && ($ = new Zu(">=0.0.0")), h = h || $, w = w || $, s($.semver, h.semver, n) ? h = $ : o($.semver, w.semver, n) && (w = $);
    }), h.operator === l || h.operator === c || (!w.operator || w.operator === l) && a(e, w.semver))
      return !1;
    if (w.operator === c && o(e, w.semver))
      return !1;
  }
  return !0;
};
var wi = Sb;
const Pb = wi, Nb = (e, t, r) => Pb(e, t, ">", r);
var Rb = Nb;
const Ob = wi, Tb = (e, t, r) => Ob(e, t, "<", r);
var Ib = Tb;
const Wc = ht(), jb = (e, t, r) => (e = new Wc(e, r), t = new Wc(t, r), e.intersects(t, r));
var Ab = jb;
const kb = Rs, Cb = ft;
var Db = (e, t, r) => {
  const n = [];
  let s = null, a = null;
  const o = e.sort((u, h) => Cb(u, h, r));
  for (const u of o)
    kb(u, t, r) ? (a = u, s || (s = u)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const l = [];
  for (const [u, h] of n)
    u === h ? l.push(u) : !h && u === o[0] ? l.push("*") : h ? u === o[0] ? l.push(`<=${h}`) : l.push(`${u} - ${h}`) : l.push(`>=${u}`);
  const c = l.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < d.length ? c : t;
};
const Xc = ht(), Ei = Ns(), { ANY: Js } = Ei, Ys = Rs, bi = ft, Mb = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Xc(e, r), t = new Xc(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const a of t.set) {
      const o = Lb(s, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, Vb = [new Ei(">=0.0.0-0")], Jc = [new Ei(">=0.0.0")], Lb = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Js) {
    if (t.length === 1 && t[0].semver === Js)
      return !0;
    r.includePrerelease ? e = Vb : e = Jc;
  }
  if (t.length === 1 && t[0].semver === Js) {
    if (r.includePrerelease)
      return !0;
    t = Jc;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const $ of e)
    $.operator === ">" || $.operator === ">=" ? s = Yc(s, $, r) : $.operator === "<" || $.operator === "<=" ? a = Qc(a, $, r) : n.add($.semver);
  if (n.size > 1)
    return null;
  let o;
  if (s && a) {
    if (o = bi(s.semver, a.semver, r), o > 0)
      return null;
    if (o === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const $ of n) {
    if (s && !Ys($, String(s), r) || a && !Ys($, String(a), r))
      return null;
    for (const v of t)
      if (!Ys($, String(v), r))
        return !1;
    return !0;
  }
  let l, c, d, u, h = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, w = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && a.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const $ of t) {
    if (u = u || $.operator === ">" || $.operator === ">=", d = d || $.operator === "<" || $.operator === "<=", s) {
      if (w && $.semver.prerelease && $.semver.prerelease.length && $.semver.major === w.major && $.semver.minor === w.minor && $.semver.patch === w.patch && (w = !1), $.operator === ">" || $.operator === ">=") {
        if (l = Yc(s, $, r), l === $ && l !== s)
          return !1;
      } else if (s.operator === ">=" && !$.test(s.semver))
        return !1;
    }
    if (a) {
      if (h && $.semver.prerelease && $.semver.prerelease.length && $.semver.major === h.major && $.semver.minor === h.minor && $.semver.patch === h.patch && (h = !1), $.operator === "<" || $.operator === "<=") {
        if (c = Qc(a, $, r), c === $ && c !== a)
          return !1;
      } else if (a.operator === "<=" && !$.test(a.semver))
        return !1;
    }
    if (!$.operator && (a || s) && o !== 0)
      return !1;
  }
  return !(s && d && !a && o !== 0 || a && u && !s && o !== 0 || w || h);
}, Yc = (e, t, r) => {
  if (!e)
    return t;
  const n = bi(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Qc = (e, t, r) => {
  if (!e)
    return t;
  const n = bi(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Fb = Mb;
const Qs = wn, Zc = vn, zb = Le, xc = Xu, Ub = mr, qb = zw, Kb = Kw, Gb = Hw, Hb = Ww, Bb = Yw, Wb = xw, Xb = rE, Jb = aE, Yb = ft, Qb = lE, Zb = fE, xb = yi, eS = $E, tS = _E, rS = Ps, nS = gi, sS = Ju, aS = Yu, oS = _i, iS = vi, cS = Qu, lS = qE, uS = YE, dS = Ns(), fS = ht(), hS = Rs, mS = nb, pS = ib, $S = db, yS = mb, gS = yb, _S = wi, vS = Rb, wS = Ib, ES = Ab, bS = Db, SS = Fb;
var PS = {
  parse: Ub,
  valid: qb,
  clean: Kb,
  inc: Gb,
  diff: Hb,
  major: Bb,
  minor: Wb,
  patch: Xb,
  prerelease: Jb,
  compare: Yb,
  rcompare: Qb,
  compareLoose: Zb,
  compareBuild: xb,
  sort: eS,
  rsort: tS,
  gt: rS,
  lt: nS,
  eq: sS,
  neq: aS,
  gte: oS,
  lte: iS,
  cmp: cS,
  coerce: lS,
  truncate: uS,
  Comparator: dS,
  Range: fS,
  satisfies: hS,
  toComparators: mS,
  maxSatisfying: pS,
  minSatisfying: $S,
  minVersion: yS,
  validRange: gS,
  outside: _S,
  gtr: vS,
  ltr: wS,
  intersects: ES,
  simplifyRange: bS,
  subset: SS,
  SemVer: zb,
  re: Qs.re,
  src: Qs.src,
  tokens: Qs.t,
  SEMVER_SPEC_VERSION: Zc.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Zc.RELEASE_TYPES,
  compareIdentifiers: xc.compareIdentifiers,
  rcompareIdentifiers: xc.rcompareIdentifiers
};
const gr = /* @__PURE__ */ ml(PS), NS = Object.prototype.toString, RS = "[object Uint8Array]", OS = "[object ArrayBuffer]";
function xu(e, t, r) {
  return e ? e.constructor === t ? !0 : NS.call(e) === r : !1;
}
function ed(e) {
  return xu(e, Uint8Array, RS);
}
function TS(e) {
  return xu(e, ArrayBuffer, OS);
}
function IS(e) {
  return ed(e) || TS(e);
}
function jS(e) {
  if (!ed(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function AS(e) {
  if (!IS(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Zs(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    jS(s), r.set(s, n), n += s.length;
  return r;
}
const qn = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Kn(e, t = "utf8") {
  return AS(e), qn[t] ?? (qn[t] = new globalThis.TextDecoder(t)), qn[t].decode(e);
}
function kS(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const CS = new globalThis.TextEncoder();
function xs(e) {
  return kS(e), CS.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const el = "aes-256-cbc", td = /* @__PURE__ */ new Set([
  "aes-256-cbc",
  "aes-256-gcm",
  "aes-256-ctr"
]), DS = (e) => typeof e == "string" && td.has(e), Nt = () => /* @__PURE__ */ Object.create(null), tl = (e) => e !== void 0, ea = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, zt = "__internal__", ta = `${zt}.migrations.version`;
var qt, Kt, ar, Ge, Qe, or, ir, Ar, yt, Ne, rd, nd, sd, ad, od, id, cd, ld;
class MS {
  constructor(t = {}) {
    tt(this, Ne);
    Wr(this, "path");
    Wr(this, "events");
    tt(this, qt);
    tt(this, Kt);
    tt(this, ar);
    tt(this, Ge);
    tt(this, Qe, {});
    tt(this, or, !1);
    tt(this, ir);
    tt(this, Ar);
    tt(this, yt);
    Wr(this, "_deserialize", (t) => JSON.parse(t));
    Wr(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = wt(this, Ne, rd).call(this, t);
    Ke(this, Ge, r), wt(this, Ne, nd).call(this, r), wt(this, Ne, ad).call(this, r), wt(this, Ne, od).call(this, r), this.events = new EventTarget(), Ke(this, Kt, r.encryptionKey), Ke(this, ar, r.encryptionAlgorithm ?? el), this.path = wt(this, Ne, id).call(this, r), wt(this, Ne, cd).call(this, r), r.watch && this._watch();
  }
  get(t, r) {
    if (ee(this, Ge).accessPropertiesByDotNotation)
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
      throw new TypeError(`Please don't use the ${zt} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, o) => {
      if (ea(a, o), ee(this, Ge).accessPropertiesByDotNotation)
        En(n, a, o);
      else {
        if (a === "__proto__" || a === "constructor" || a === "prototype")
          return;
        n[a] = o;
      }
    };
    if (typeof t == "object") {
      const a = t;
      for (const [o, l] of Object.entries(a))
        s(o, l);
    } else
      s(t, r);
    this.store = n;
  }
  has(t) {
    return ee(this, Ge).accessPropertiesByDotNotation ? As(this.store, t) : t in this.store;
  }
  appendToArray(t, r) {
    ea(t, r);
    const n = ee(this, Ge).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
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
      tl(ee(this, Qe)[r]) && this.set(r, ee(this, Qe)[r]);
  }
  delete(t) {
    const { store: r } = this;
    ee(this, Ge).accessPropertiesByDotNotation ? Sd(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = Nt();
    for (const r of Object.keys(ee(this, Qe)))
      tl(ee(this, Qe)[r]) && (ea(r, ee(this, Qe)[r]), ee(this, Ge).accessPropertiesByDotNotation ? En(t, r, ee(this, Qe)[r]) : t[r] = ee(this, Qe)[r]);
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
      const r = te.readFileSync(this.path, ee(this, Kt) ? null : "utf8"), n = this._decryptData(r);
      return ((a) => {
        const o = this._deserialize(a);
        return ee(this, or) || this._validate(o), Object.assign(Nt(), o);
      })(n);
    } catch (r) {
      if ((r == null ? void 0 : r.code) === "ENOENT")
        return this._ensureDirectory(), Nt();
      if (ee(this, Ge).clearInvalidConfig) {
        const n = r;
        if (n.name === "SyntaxError" || (t = n.message) != null && t.startsWith("Config schema violation:") || n.message === "Failed to decrypt config data.")
          return Nt();
      }
      throw r;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !As(t, zt))
      try {
        const r = te.readFileSync(this.path, ee(this, Kt) ? null : "utf8"), n = this._decryptData(r), s = this._deserialize(n);
        As(s, zt) && En(t, zt, Ti(s, zt));
      } catch {
      }
    ee(this, or) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, r]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    ee(this, ir) && (ee(this, ir).close(), Ke(this, ir, void 0)), ee(this, Ar) && (te.unwatchFile(this.path), Ke(this, Ar, !1)), Ke(this, yt, void 0);
  }
  _decryptData(t) {
    const r = ee(this, Kt);
    if (!r)
      return typeof t == "string" ? t : Kn(t);
    const n = ee(this, ar), s = n === "aes-256-gcm" ? 16 : 0, a = ":".codePointAt(0), o = typeof t == "string" ? t.codePointAt(16) : t[16];
    if (!(a !== void 0 && o === a)) {
      if (n === "aes-256-cbc")
        return typeof t == "string" ? t : Kn(t);
      throw new Error("Failed to decrypt config data.");
    }
    const c = ($) => {
      if (s === 0)
        return { ciphertext: $ };
      const v = $.length - s;
      if (v < 0)
        throw new Error("Invalid authentication tag length.");
      return {
        ciphertext: $.slice(0, v),
        authenticationTag: $.slice(v)
      };
    }, d = t.slice(0, 16), u = t.slice(17), h = typeof u == "string" ? xs(u) : u, w = ($) => {
      const { ciphertext: v, authenticationTag: _ } = c(h), g = Xr.pbkdf2Sync(r, $, 1e4, 32, "sha512"), m = Xr.createDecipheriv(n, g, d);
      return _ && m.setAuthTag(_), Kn(Zs([m.update(v), m.final()]));
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
      return typeof t == "string" ? t : Kn(t);
    throw new Error("Failed to decrypt config data.");
  }
  _handleStoreChange(t) {
    let r = this.store;
    const n = () => {
      const s = r, a = this.store;
      Ri(a, s) || (r = a, t.call(this, a, s));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(t, r) {
    let n = t();
    const s = () => {
      const a = n, o = t();
      Ri(o, a) || (n = o, r.call(this, o, a));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(t) {
    if (!ee(this, qt) || ee(this, qt).call(this, t) || !ee(this, qt).errors)
      return;
    const n = ee(this, qt).errors.map(({ instancePath: s, message: a = "" }) => `\`${s.slice(1)}\` ${a}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    te.mkdirSync(ae.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    const n = ee(this, Kt);
    if (n) {
      const s = Xr.randomBytes(16), a = Xr.pbkdf2Sync(n, s, 1e4, 32, "sha512"), o = Xr.createCipheriv(ee(this, ar), a, s), l = Zs([o.update(xs(r)), o.final()]), c = [s, xs(":"), l];
      ee(this, ar) === "aes-256-gcm" && c.push(o.getAuthTag()), r = Zs(c);
    }
    if ($e.env.SNAP)
      te.writeFileSync(this.path, r, { mode: ee(this, Ge).configFileMode });
    else
      try {
        hl(this.path, r, { mode: ee(this, Ge).configFileMode });
      } catch (s) {
        if ((s == null ? void 0 : s.code) === "EXDEV") {
          te.writeFileSync(this.path, r, { mode: ee(this, Ge).configFileMode });
          return;
        }
        throw s;
      }
  }
  _watch() {
    if (this._ensureDirectory(), te.existsSync(this.path) || this._write(Nt()), $e.platform === "win32" || $e.platform === "darwin") {
      ee(this, yt) ?? Ke(this, yt, Cc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = ae.dirname(this.path), r = ae.basename(this.path);
      Ke(this, ir, te.watch(t, { persistent: !1, encoding: "utf8" }, (n, s) => {
        s && s !== r || typeof ee(this, yt) == "function" && ee(this, yt).call(this);
      }));
    } else
      ee(this, yt) ?? Ke(this, yt, Cc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), te.watchFile(this.path, { persistent: !1 }, (t, r) => {
        typeof ee(this, yt) == "function" && ee(this, yt).call(this);
      }), Ke(this, Ar, !0);
  }
  _migrate(t, r, n) {
    let s = this._get(ta, "0.0.0");
    const a = Object.keys(t).filter((l) => this._shouldPerformMigration(l, s, r));
    let o = structuredClone(this.store);
    for (const l of a)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: l,
          finalVersion: r,
          versions: a
        });
        const c = t[l];
        c == null || c(this), this._set(ta, l), s = l, o = structuredClone(this.store);
      } catch (c) {
        this.store = o;
        const d = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${d}`);
      }
    (this._isVersionInRangeFormat(s) || !gr.eq(s, r)) && this._set(ta, r);
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
    return t === zt || t.startsWith(`${zt}.`);
  }
  _isVersionInRangeFormat(t) {
    return gr.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && gr.satisfies(r, t) ? !1 : gr.satisfies(n, t) : !(gr.lte(t, r) || gr.gt(t, n));
  }
  _get(t, r) {
    return Ti(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    En(n, t, r), this.store = n;
  }
}
qt = new WeakMap(), Kt = new WeakMap(), ar = new WeakMap(), Ge = new WeakMap(), Qe = new WeakMap(), or = new WeakMap(), ir = new WeakMap(), Ar = new WeakMap(), yt = new WeakMap(), Ne = new WeakSet(), rd = function(t) {
  const r = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (r.encryptionAlgorithm ?? (r.encryptionAlgorithm = el), !DS(r.encryptionAlgorithm))
    throw new TypeError(`The \`encryptionAlgorithm\` option must be one of: ${[...td].join(", ")}`);
  if (!r.cwd) {
    if (!r.projectName)
      throw new Error("Please specify the `projectName` option.");
    r.cwd = Od(r.projectName, { suffix: r.projectSuffix }).config;
  }
  return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
}, nd = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const r = $w.default, n = new q0.Ajv2020({
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
  Ke(this, qt, n.compile(s)), wt(this, Ne, sd).call(this, t.schema);
}, sd = function(t) {
  const r = Object.entries(t ?? {});
  for (const [n, s] of r) {
    if (!s || typeof s != "object" || !Object.hasOwn(s, "default"))
      continue;
    const { default: a } = s;
    a !== void 0 && (ee(this, Qe)[n] = a);
  }
}, ad = function(t) {
  t.defaults && Object.assign(ee(this, Qe), t.defaults);
}, od = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, id = function(t) {
  const r = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = r ? `.${r}` : "";
  return ae.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
}, cd = function(t) {
  if (t.migrations) {
    wt(this, Ne, ld).call(this, t), this._validate(this.store);
    return;
  }
  const r = this.store, n = Object.assign(Nt(), t.defaults ?? {}, r);
  this._validate(n);
  try {
    Oi.deepEqual(r, n);
  } catch {
    this.store = n;
  }
}, ld = function(t) {
  const { migrations: r, projectVersion: n } = t;
  if (r) {
    if (!n)
      throw new Error("Please specify the `projectVersion` option.");
    Ke(this, or, !0);
    try {
      const s = this.store, a = Object.assign(Nt(), t.defaults ?? {}, s);
      try {
        Oi.deepEqual(s, a);
      } catch {
        this._write(a);
      }
      this._migrate(r, n, t.beforeEachMigration);
    } finally {
      Ke(this, or, !1);
    }
  }
};
const { app: xn, ipcMain: va, shell: VS } = il;
let rl = !1;
const nl = () => {
  if (!va || !xn)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: xn.getPath("userData"),
    appVersion: xn.getVersion()
  };
  return rl || (va.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), rl = !0), e;
};
class LS extends MS {
  constructor(t) {
    let r, n;
    if ($e.type === "renderer") {
      const s = il.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else va && xn && ({ defaultCwd: r, appVersion: n } = nl());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = ae.isAbsolute(t.cwd) ? t.cwd : ae.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    nl();
  }
  async openInEditor() {
    const t = await VS.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const ud = ae.dirname(wd(import.meta.url));
process.env.APP_ROOT = ae.join(ud, "../..");
const c1 = ae.join(process.env.APP_ROOT, "dist-electron"), dd = ae.join(process.env.APP_ROOT, "dist"), $n = process.env.VITE_DEV_SERVER_URL;
process.env.VITE_PUBLIC = $n ? ae.join(process.env.APP_ROOT, "public") : dd;
Ea.release().startsWith("6.1") && qe.disableHardwareAcceleration();
process.platform === "win32" && qe.setAppUserModelId(qe.getName());
qe.requestSingleInstanceLock() || (qe.quit(), process.exit(0));
const FS = new LS({
  name: "planner-data",
  defaults: {
    shortPlans: [],
    shortTasks: [],
    longTasks: [],
    notifiedTaskIds: []
  }
}), Rt = FS;
let D = null, lt = null, pt = null, fn = null, Si = !0, Os = !1, sl = "top-right", Pr = null, Nr = null, cs = !1;
const fd = ae.join(ud, "../preload/index.mjs"), hd = ae.join(dd, "index.html");
function zS(e, t) {
  const { workArea: r } = hn.getDisplayMatching(e.getBounds()), n = 0, s = e.getBounds(), a = r.x + n, o = r.x + r.width - s.width - n, l = r.y + n, c = r.y + r.height - s.height - n;
  return {
    x: t.endsWith("right") ? o : a,
    y: t.startsWith("bottom") ? c : l
  };
}
function jr(e, t = sl) {
  const r = zS(e, t), n = Math.round(r.x), s = Math.round(r.y), a = e.getBounds();
  sl = t, !(Math.abs(a.x - n) <= 1 && Math.abs(a.y - s) <= 1) && (Nr && clearTimeout(Nr), cs = !0, e.setPosition(n, s, !1), Nr = setTimeout(() => {
    cs = !1, Nr = null;
  }, 160));
}
function US(e) {
  const t = e.getBounds(), { workArea: r } = hn.getDisplayMatching(t), n = t.x + t.width / 2, s = t.y + t.height / 2, a = n < r.x + r.width / 2 ? "left" : "right";
  return `${s < r.y + r.height / 2 ? "top" : "bottom"}-${a}`;
}
function qS(e) {
  cs || (Pr && clearTimeout(Pr), Pr = setTimeout(() => {
    Pr = null, e.isDestroyed() || jr(e, US(e));
  }, 520));
}
function dt(e = !1) {
  !D || D.isDestroyed() || (Si = !0, D.setFocusable(!0), D.setIgnoreMouseEvents(!1), jr(D), e ? (D.show(), D.moveTop(), D.focus()) : D.showInactive());
}
function al() {
  !D || D.isDestroyed() || (D.setAlwaysOnTop(!0, "floating"), D.show(), D.moveTop(), D.focus(), setTimeout(() => {
    D && !D.isDestroyed() && D.setAlwaysOnTop(!1);
  }, 1500));
}
function Je() {
  if (!lt) return;
  const e = !!(D && !D.isDestroyed() && D.isVisible()), t = vd.buildFromTemplate([
    {
      label: e ? "隐藏窗口" : "显示窗口",
      click: () => {
        !D || D.isDestroyed() || (D.isVisible() ? D.hide() : dt(!0), Je());
      }
    },
    { type: "separator" },
    {
      label: "退出",
      click: () => {
        Os = !0, qe.quit();
      }
    }
  ]);
  lt.setToolTip("计划小组件"), lt.setContextMenu(t);
}
function cr(e, t = !1) {
  !D || D.isDestroyed() || (Si = e, D.setAlwaysOnTop(!1), D.setVisibleOnAllWorkspaces(!1), D.setFocusable(e), D.setIgnoreMouseEvents(!e, { forward: !0 }), e ? dt(t) : D.isVisible() && (D.blur(), dt(!1)), D.webContents.isDestroyed() || D.webContents.send("planner:interactive-changed", e), Je());
}
function KS() {
  if (lt) return;
  const e = ae.join(process.env.VITE_PUBLIC, "favicon.ico"), t = yd.createFromPath(e);
  lt = new gd(t.isEmpty() ? e : t), lt.on("click", () => {
    !D || D.isDestroyed() || (D.isVisible() ? D.hide() : dt(!0), Je());
  }), lt.on("double-click", () => {
    !D || D.isDestroyed() || (dt(!0), Je());
  }), Je();
}
function GS() {
  if (pt && !pt.isDestroyed()) return;
  const { bounds: e } = hn.getDisplayNearestPoint(hn.getCursorScreenPoint());
  pt = new wa({
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
      preload: fd,
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), pt.setIgnoreMouseEvents(!0, { forward: !0 }), $n ? pt.loadURL(`${$n}#celebrate`) : pt.loadFile(hd, { hash: "celebrate" }), setTimeout(() => {
    pt && !pt.isDestroyed() && pt.close(), pt = null;
  }, 2200);
}
function ol() {
  if (!Ni.isSupported()) return;
  const e = Date.now(), t = 5 * 60 * 1e3, r = Rt.get("shortTasks"), n = new Set(Rt.get("notifiedTaskIds"));
  for (const s of r) {
    if (s.completed) continue;
    const a = new Date(s.dueAt).getTime();
    if (Number.isNaN(a)) continue;
    const o = a - e;
    o >= 0 && o <= t && !n.has(s.id) && (new Ni({
      title: "任务提醒",
      body: `${s.title} 将在 5 分钟内到期`,
      silent: !1
    }).show(), n.add(s.id));
  }
  Rt.set("notifiedTaskIds", [...n]);
}
function HS() {
  fn && clearInterval(fn), ol(), fn = setInterval(ol, 60 * 1e3);
}
function BS() {
  process.platform === "win32" && qe.isPackaged && qe.setLoginItemSettings({
    openAtLogin: !0,
    openAsHidden: !0,
    path: process.execPath,
    args: ["--hidden"]
  });
}
function WS() {
  Lt.handle("planner:get-data", () => Rt.store), Lt.handle("planner:save-short-plans", (e, t) => (Rt.set("shortPlans", t), t)), Lt.handle("planner:save-short-tasks", (e, t) => {
    Rt.set("shortTasks", t);
    const r = new Set(t.filter((s) => !s.completed).map((s) => s.id)), n = Rt.get("notifiedTaskIds").filter((s) => r.has(s));
    return Rt.set("notifiedTaskIds", n), t;
  }), Lt.handle("planner:save-long-tasks", (e, t) => (Rt.set("longTasks", t), t)), Lt.on("planner:celebrate", () => {
    GS();
  }), Lt.on("planner:set-interactive", (e, t) => {
    cr(t, t);
  }), Lt.handle("planner:toggle-widget", () => !D || D.isDestroyed() ? !1 : D.isVisible() ? (D.hide(), Je(), !1) : (dt(!0), Je(), !0));
}
async function md() {
  const e = !process.argv.includes("--show");
  D = new wa({
    title: "计划小组件",
    width: 530,
    height: 540,
    minWidth: 460,
    minHeight: 480,
    show: !1,
    frame: !1,
    transparent: !0,
    skipTaskbar: !0,
    resizable: !0,
    focusable: !0,
    alwaysOnTop: !1,
    hasShadow: !1,
    backgroundColor: "#00000000",
    icon: ae.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload: fd,
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), D.setSkipTaskbar(!0), jr(D), $n ? D.loadURL($n) : D.loadFile(hd), D.once("ready-to-show", () => {
    e ? Je() : (cr(!0, !0), al());
  }), setTimeout(() => {
    D && !D.isDestroyed() && !e && (cr(!0, !0), al());
  }, 1200), D.webContents.on("did-finish-load", () => {
    D == null || D.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString()), e || (dt(!0), cr(!0, !0)), Je();
  }), D.on("show", () => {
    D && (D.setAlwaysOnTop(!1), jr(D), Je());
  }), D.on("hide", Je), D.on("resize", () => {
    D && jr(D);
  }), D.on("move", () => {
    D && !D.isDestroyed() && !cs && qS(D), Je();
  }), D.on("close", (t) => {
    Os || (t.preventDefault(), D == null || D.hide());
  }), D.webContents.setWindowOpenHandler(({ url: t }) => (t.startsWith("https:") && _d.openExternal(t), { action: "deny" }));
}
qe.whenReady().then(() => {
  BS(), WS(), KS(), md(), HS(), hn.on("display-metrics-changed", () => {
    D && !D.isDestroyed() && jr(D);
  }), cl.register("CommandOrControl+Shift+T", () => {
    !D || D.isDestroyed() || (D.isVisible() ? (D.hide(), Je()) : dt(!0));
  });
});
qe.on("before-quit", () => {
  Os = !0;
});
qe.on("window-all-closed", () => {
  process.platform !== "darwin" && Os && qe.quit();
});
qe.on("will-quit", () => {
  fn && clearInterval(fn), Pr && clearTimeout(Pr), Nr && clearTimeout(Nr), cl.unregisterAll(), lt == null || lt.destroy(), lt = null;
});
qe.on("second-instance", () => {
  D && !D.isDestroyed() && (D.isMinimized() && D.restore(), dt(!0), cr(!0, !0));
});
qe.on("activate", () => {
  wa.getAllWindows().length ? (dt(!0), cr(!0, !0)) : md();
});
Lt.handle("open-win", async (e, t) => {
  !D || D.isDestroyed() || (D.isVisible() || dt(!0), typeof t == "string" && t === "toggle-widget" && cr(!Si, !0));
});
export {
  c1 as MAIN_DIST,
  dd as RENDERER_DIST,
  $n as VITE_DEV_SERVER_URL
};
