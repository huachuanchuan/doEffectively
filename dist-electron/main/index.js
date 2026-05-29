var Vd = Object.defineProperty;
var Mi = (e) => {
  throw TypeError(e);
};
var Fd = (e, t, r) => t in e ? Vd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var rn = (e, t, r) => Fd(e, typeof t != "symbol" ? t + "" : t, r), Us = (e, t, r) => t.has(e) || Mi("Cannot " + r);
var J = (e, t, r) => (Us(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Je = (e, t, r) => t.has(e) ? Mi("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), De = (e, t, r, n) => (Us(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), pt = (e, t, r) => (Us(e, t, "access private method"), r);
import pl, { app as Ie, screen as bn, globalShortcut as $l, BrowserWindow as ka, ipcMain as jt, nativeImage as zd, Tray as Ud, shell as qd, Menu as Kd, Notification as Li } from "electron";
import { fileURLToPath as Gd } from "node:url";
import Q from "node:path";
import Aa from "node:os";
import Y, { existsSync as Hd } from "node:fs";
import { execFile as Bd } from "node:child_process";
import fe from "node:process";
import { promisify as Se, isDeepStrictEqual as Vi } from "node:util";
import nn from "node:crypto";
import Fi from "node:assert";
import "node:events";
import "node:stream";
const pr = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, yl = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), gl = 1e6, Wd = (e) => e >= "0" && e <= "9";
function _l(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= gl;
  }
  return !1;
}
function qs(e, t) {
  return yl.has(e) ? !1 : (e && _l(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function Xd(e) {
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
        if (!qs(r, t))
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
          if ((r || n === "property") && !qs(r, t))
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
            const u = Number.parseInt(r, 10);
            !Number.isNaN(u) && Number.isFinite(u) && u >= 0 && u <= Number.MAX_SAFE_INTEGER && u <= gl && r === String(u) ? t.push(u) : t.push(r), r = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        r += o;
        break;
      }
      default: {
        if (n === "index" && !Wd(o))
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        n === "start" && (n = "property"), r += o;
      }
    }
  }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (!qs(r, t))
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
function ws(e) {
  if (typeof e == "string")
    return Xd(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [r, n] of e.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${r}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${r} must be a finite number, got ${n}`);
      if (yl.has(n))
        return [];
      typeof n == "string" && _l(n) ? t.push(Number.parseInt(n, 10)) : t.push(n);
    }
    return t;
  }
  return [];
}
function zi(e, t, r) {
  if (!pr(e) || typeof t != "string" && !Array.isArray(t))
    return r === void 0 ? e : r;
  const n = ws(t);
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
function Dn(e, t, r) {
  if (!pr(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, s = ws(t);
  if (s.length === 0)
    return e;
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    if (a === s.length - 1)
      e[o] = r;
    else if (!pr(e[o])) {
      const c = typeof s[a + 1] == "number";
      e[o] = c ? [] : {};
    }
    e = e[o];
  }
  return n;
}
function Jd(e, t) {
  if (!pr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = ws(t);
  if (r.length === 0)
    return !1;
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (n === r.length - 1)
      return Object.hasOwn(e, s) ? (delete e[s], !0) : !1;
    if (e = e[s], !pr(e))
      return !1;
  }
}
function Ks(e, t) {
  if (!pr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = ws(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!pr(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const Ct = Aa.homedir(), Ca = Aa.tmpdir(), { env: Or } = fe, Yd = (e) => {
  const t = Q.join(Ct, "Library");
  return {
    data: Q.join(t, "Application Support", e),
    config: Q.join(t, "Preferences", e),
    cache: Q.join(t, "Caches", e),
    log: Q.join(t, "Logs", e),
    temp: Q.join(Ca, e)
  };
}, Qd = (e) => {
  const t = Or.APPDATA || Q.join(Ct, "AppData", "Roaming"), r = Or.LOCALAPPDATA || Q.join(Ct, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: Q.join(r, e, "Data"),
    config: Q.join(t, e, "Config"),
    cache: Q.join(r, e, "Cache"),
    log: Q.join(r, e, "Log"),
    temp: Q.join(Ca, e)
  };
}, Zd = (e) => {
  const t = Q.basename(Ct);
  return {
    data: Q.join(Or.XDG_DATA_HOME || Q.join(Ct, ".local", "share"), e),
    config: Q.join(Or.XDG_CONFIG_HOME || Q.join(Ct, ".config"), e),
    cache: Q.join(Or.XDG_CACHE_HOME || Q.join(Ct, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: Q.join(Or.XDG_STATE_HOME || Q.join(Ct, ".local", "state"), e),
    temp: Q.join(Ca, t, e)
  };
};
function xd(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), fe.platform === "darwin" ? Yd(e) : fe.platform === "win32" ? Qd(e) : Zd(e);
}
const St = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    return e.apply(void 0, s).catch(r);
  };
}, $t = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    try {
      return e.apply(void 0, s);
    } catch (a) {
      return r(a);
    }
  };
}, ef = 250, Pt = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: a } = s, o = s.interval ?? ef, u = Date.now() + a;
    return function c(...d) {
      return e.apply(void 0, d).catch((l) => {
        if (!r(l) || Date.now() >= u)
          throw l;
        const h = Math.round(o * Math.random());
        return h > 0 ? new Promise((g) => setTimeout(g, h)).then(() => c.apply(void 0, d)) : c.apply(void 0, d);
      });
    };
  };
}, Nt = (e, t) => {
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
}, Tr = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!Tr.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !tf && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!Tr.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!Tr.isNodeError(e))
      throw e;
    if (!Tr.isChangeErrorOk(e))
      throw e;
  }
}, Mn = {
  onError: Tr.onChangeError
}, Ue = {
  onError: () => {
  }
}, tf = fe.getuid ? !fe.getuid() : !1, Pe = {
  isRetriable: Tr.isRetriableError
}, Oe = {
  attempt: {
    /* ASYNC */
    chmod: St(Se(Y.chmod), Mn),
    chown: St(Se(Y.chown), Mn),
    close: St(Se(Y.close), Ue),
    fsync: St(Se(Y.fsync), Ue),
    mkdir: St(Se(Y.mkdir), Ue),
    realpath: St(Se(Y.realpath), Ue),
    stat: St(Se(Y.stat), Ue),
    unlink: St(Se(Y.unlink), Ue),
    /* SYNC */
    chmodSync: $t(Y.chmodSync, Mn),
    chownSync: $t(Y.chownSync, Mn),
    closeSync: $t(Y.closeSync, Ue),
    existsSync: $t(Y.existsSync, Ue),
    fsyncSync: $t(Y.fsync, Ue),
    mkdirSync: $t(Y.mkdirSync, Ue),
    realpathSync: $t(Y.realpathSync, Ue),
    statSync: $t(Y.statSync, Ue),
    unlinkSync: $t(Y.unlinkSync, Ue)
  },
  retry: {
    /* ASYNC */
    close: Pt(Se(Y.close), Pe),
    fsync: Pt(Se(Y.fsync), Pe),
    open: Pt(Se(Y.open), Pe),
    readFile: Pt(Se(Y.readFile), Pe),
    rename: Pt(Se(Y.rename), Pe),
    stat: Pt(Se(Y.stat), Pe),
    write: Pt(Se(Y.write), Pe),
    writeFile: Pt(Se(Y.writeFile), Pe),
    /* SYNC */
    closeSync: Nt(Y.closeSync, Pe),
    fsyncSync: Nt(Y.fsyncSync, Pe),
    openSync: Nt(Y.openSync, Pe),
    readFileSync: Nt(Y.readFileSync, Pe),
    renameSync: Nt(Y.renameSync, Pe),
    statSync: Nt(Y.statSync, Pe),
    writeSync: Nt(Y.writeSync, Pe),
    writeFileSync: Nt(Y.writeFileSync, Pe)
  }
}, rf = "utf8", Ui = 438, nf = 511, sf = {}, af = fe.geteuid ? fe.geteuid() : -1, of = fe.getegid ? fe.getegid() : -1, cf = 1e3, lf = !!fe.getuid;
fe.getuid && fe.getuid();
const qi = 128, uf = (e) => e instanceof Error && "code" in e, Ki = (e) => typeof e == "string", Gs = (e) => e === void 0, df = fe.platform === "linux", vl = fe.platform === "win32", Da = ["SIGHUP", "SIGINT", "SIGTERM"];
vl || Da.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
df && Da.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class ff {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (vl && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? fe.kill(fe.pid, "SIGTERM") : fe.kill(fe.pid, t));
      }
    }, this.hook = () => {
      fe.once("exit", () => this.exit());
      for (const t of Da)
        try {
          fe.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const hf = new ff(), mf = hf.register, Te = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${s}`;
  },
  get: (e, t, r = !0) => {
    const n = Te.truncate(t(e));
    return n in Te.store ? Te.get(e, t, r) : (Te.store[n] = r, [n, () => delete Te.store[n]]);
  },
  purge: (e) => {
    Te.store[e] && (delete Te.store[e], Oe.attempt.unlink(e));
  },
  purgeSync: (e) => {
    Te.store[e] && (delete Te.store[e], Oe.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in Te.store)
      Te.purgeSync(e);
  },
  truncate: (e) => {
    const t = Q.basename(e);
    if (t.length <= qi)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - qi;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
mf(Te.purgeSyncAll);
function wl(e, t, r = sf) {
  if (Ki(r))
    return wl(e, t, { encoding: r });
  const s = { timeout: r.timeout ?? cf };
  let a = null, o = null, u = null;
  try {
    const c = Oe.attempt.realpathSync(e), d = !!c;
    e = c || e, [o, a] = Te.get(e, r.tmpCreate || Te.create, r.tmpPurge !== !1);
    const l = lf && Gs(r.chown), h = Gs(r.mode);
    if (d && (l || h)) {
      const E = Oe.attempt.statSync(e);
      E && (r = { ...r }, l && (r.chown = { uid: E.uid, gid: E.gid }), h && (r.mode = E.mode));
    }
    if (!d) {
      const E = Q.dirname(e);
      Oe.attempt.mkdirSync(E, {
        mode: nf,
        recursive: !0
      });
    }
    u = Oe.retry.openSync(s)(o, "w", r.mode || Ui), r.tmpCreated && r.tmpCreated(o), Ki(t) ? Oe.retry.writeSync(s)(u, t, 0, r.encoding || rf) : Gs(t) || Oe.retry.writeSync(s)(u, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Oe.retry.fsyncSync(s)(u) : Oe.attempt.fsync(u)), Oe.retry.closeSync(s)(u), u = null, r.chown && (r.chown.uid !== af || r.chown.gid !== of) && Oe.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== Ui && Oe.attempt.chmodSync(o, r.mode);
    try {
      Oe.retry.renameSync(s)(o, e);
    } catch (E) {
      if (!uf(E) || E.code !== "ENAMETOOLONG")
        throw E;
      Oe.retry.renameSync(s)(o, Te.truncate(e));
    }
    a(), o = null;
  } finally {
    u && Oe.attempt.closeSync(u), o && Te.purge(o);
  }
}
function El(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ha = { exports: {} }, bl = {}, nt = {}, Ur = {}, Rn = {}, Z = {}, Sn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(v) {
      if (super(), !e.IDENTIFIER.test(v))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = v;
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
    constructor(v) {
      super(), this._items = typeof v == "string" ? [v] : v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const v = this._items[0];
      return v === "" || v === '""';
    }
    get str() {
      var v;
      return (v = this._str) !== null && v !== void 0 ? v : this._str = this._items.reduce((N, R) => `${N}${R}`, "");
    }
    get names() {
      var v;
      return (v = this._names) !== null && v !== void 0 ? v : this._names = this._items.reduce((N, R) => (R instanceof r && (N[R.str] = (N[R.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...v) {
    const N = [m[0]];
    let R = 0;
    for (; R < v.length; )
      u(N, v[R]), N.push(m[++R]);
    return new n(N);
  }
  e._ = s;
  const a = new n("+");
  function o(m, ...v) {
    const N = [g(m[0])];
    let R = 0;
    for (; R < v.length; )
      N.push(a), u(N, v[R]), N.push(a, g(m[++R]));
    return c(N), new n(N);
  }
  e.str = o;
  function u(m, v) {
    v instanceof n ? m.push(...v._items) : v instanceof r ? m.push(v) : m.push(h(v));
  }
  e.addCodeArg = u;
  function c(m) {
    let v = 1;
    for (; v < m.length - 1; ) {
      if (m[v] === a) {
        const N = d(m[v - 1], m[v + 1]);
        if (N !== void 0) {
          m.splice(v - 1, 3, N);
          continue;
        }
        m[v++] = "+";
      }
      v++;
    }
  }
  function d(m, v) {
    if (v === '""')
      return m;
    if (m === '""')
      return v;
    if (typeof m == "string")
      return v instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof v != "string" ? `${m.slice(0, -1)}${v}"` : v[0] === '"' ? m.slice(0, -1) + v.slice(1) : void 0;
    if (typeof v == "string" && v[0] === '"' && !(m instanceof r))
      return `"${m}${v.slice(1)}`;
  }
  function l(m, v) {
    return v.emptyStr() ? m : m.emptyStr() ? v : o`${m}${v}`;
  }
  e.strConcat = l;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : g(Array.isArray(m) ? m.join(",") : m);
  }
  function E(m) {
    return new n(g(m));
  }
  e.stringify = E;
  function g(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = g;
  function w(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = w;
  function _(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = _;
  function y(m) {
    return new n(m.toString());
  }
  e.regexpCode = y;
})(Sn);
var ma = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = Sn;
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
    constructor({ prefixes: d, parent: l } = {}) {
      this._names = {}, this._prefixes = d, this._parent = l;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const l = this._names[d] || this._nameGroup(d);
      return `${d}${l.index++}`;
    }
    _nameGroup(d) {
      var l, h;
      if (!((h = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(d, l) {
      super(l), this.prefix = d;
    }
    setValue(d, { property: l, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(l)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const o = (0, t._)`\n`;
  class u extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
    }
    value(d, l) {
      var h;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const E = this.toName(d), { prefix: g } = E, w = (h = l.key) !== null && h !== void 0 ? h : l.ref;
      let _ = this._values[g];
      if (_) {
        const v = _.get(w);
        if (v)
          return v;
      } else
        _ = this._values[g] = /* @__PURE__ */ new Map();
      _.set(w, E);
      const y = this._scope[g] || (this._scope[g] = []), m = y.length;
      return y[m] = l.ref, E.setValue(l, { property: g, itemIndex: m }), E;
    }
    getValue(d, l) {
      const h = this._values[d];
      if (h)
        return h.get(l);
    }
    scopeRefs(d, l = this._values) {
      return this._reduceValues(l, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, l, h) {
      return this._reduceValues(d, (E) => {
        if (E.value === void 0)
          throw new Error(`CodeGen: name "${E}" has no value`);
        return E.value.code;
      }, l, h);
    }
    _reduceValues(d, l, h = {}, E) {
      let g = t.nil;
      for (const w in d) {
        const _ = d[w];
        if (!_)
          continue;
        const y = h[w] = h[w] || /* @__PURE__ */ new Map();
        _.forEach((m) => {
          if (y.has(m))
            return;
          y.set(m, n.Started);
          let v = l(m);
          if (v) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            g = (0, t._)`${g}${N} ${m} = ${v};${this.opts._n}`;
          } else if (v = E == null ? void 0 : E(m))
            g = (0, t._)`${g}${v}${this.opts._n}`;
          else
            throw new r(m);
          y.set(m, n.Completed);
        });
      }
      return g;
    }
  }
  e.ValueScope = u;
})(ma);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Sn, r = ma;
  var n = Sn;
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
  var s = ma;
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
      const b = i ? r.varKinds.var : this.varKind, T = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${b} ${this.name}${T};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = H(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class u extends a {
    constructor(i, f, b) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = b;
    }
    render({ _n: i }) {
      return `${this.lhs} = ${this.rhs};` + i;
    }
    optimizeNames(i, f) {
      if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
        return this.rhs = H(this.rhs, i, f), this;
    }
    get names() {
      const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return ae(i, this.rhs);
    }
  }
  class c extends u {
    constructor(i, f, b, T) {
      super(i, b, T), this.op = f;
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
  class l extends a {
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
  class E extends a {
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
      return this.code = H(this.code, i, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class g extends a {
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
      let T = b.length;
      for (; T--; ) {
        const I = b[T];
        I.optimizeNames(i, f) || (ce(i, I.names), b.splice(T, 1));
      }
      return b.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => G(i, f.names), {});
    }
  }
  class w extends g {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class _ extends g {
  }
  class y extends w {
  }
  y.kind = "else";
  class m extends w {
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
        f = this.else = Array.isArray(b) ? new y(b) : b;
      }
      if (f)
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(A(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var b;
      if (this.else = (b = this.else) === null || b === void 0 ? void 0 : b.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = H(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return ae(i, this.condition), this.else && G(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class v extends w {
  }
  v.kind = "for";
  class N extends v {
    constructor(i) {
      super(), this.iteration = i;
    }
    render(i) {
      return `for(${this.iteration})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iteration = H(this.iteration, i, f), this;
    }
    get names() {
      return G(super.names, this.iteration.names);
    }
  }
  class R extends v {
    constructor(i, f, b, T) {
      super(), this.varKind = i, this.name = f, this.from = b, this.to = T;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: b, from: T, to: I } = this;
      return `for(${f} ${b}=${T}; ${b}<${I}; ${b}++)` + super.render(i);
    }
    get names() {
      const i = ae(super.names, this.from);
      return ae(i, this.to);
    }
  }
  class O extends v {
    constructor(i, f, b, T) {
      super(), this.loop = i, this.varKind = f, this.name = b, this.iterable = T;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = H(this.iterable, i, f), this;
    }
    get names() {
      return G(super.names, this.iterable.names);
    }
  }
  class K extends w {
    constructor(i, f, b) {
      super(), this.name = i, this.args = f, this.async = b;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  K.kind = "func";
  class X extends g {
    render(i) {
      return "return " + super.render(i);
    }
  }
  X.kind = "return";
  class de extends w {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var b, T;
      return super.optimizeNames(i, f), (b = this.catch) === null || b === void 0 || b.optimizeNames(i, f), (T = this.finally) === null || T === void 0 || T.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && G(i, this.catch.names), this.finally && G(i, this.finally.names), i;
    }
  }
  class he extends w {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  he.kind = "catch";
  class $e extends w {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  $e.kind = "finally";
  class F {
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
    _def(i, f, b, T) {
      const I = this._scope.toName(f);
      return b !== void 0 && T && (this._constants[I.str] = b), this._leafNode(new o(i, I, b)), I;
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
      return this._leafNode(new u(i, f, b));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new c(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new E(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [b, T] of i)
        f.length > 1 && f.push(","), f.push(b), (b !== T || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, T));
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
      return this._elseNode(new y());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, y);
    }
    _for(i, f) {
      return this._blockNode(i), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(i, f) {
      return this._for(new N(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, b, T, I = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const V = this._scope.toName(i);
      return this._for(new R(I, V, f, b), () => T(V));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, T = r.varKinds.const) {
      const I = this._scope.toName(i);
      if (this.opts.es5) {
        const V = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${V}.length`, (L) => {
          this.var(I, (0, t._)`${V}[${L}]`), b(I);
        });
      }
      return this._for(new O("of", T, I, f), () => b(I));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, b, T = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, b);
      const I = this._scope.toName(i);
      return this._for(new O("in", T, I, f), () => b(I));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(v);
    }
    // `label` statement
    label(i) {
      return this._leafNode(new d(i));
    }
    // `break` statement
    break(i) {
      return this._leafNode(new l(i));
    }
    // `return` statement
    return(i) {
      const f = new X();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(X);
    }
    // `try` statement
    try(i, f, b) {
      if (!f && !b)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const T = new de();
      if (this._blockNode(T), this.code(i), f) {
        const I = this.name("e");
        this._currNode = T.catch = new he(I), f(I);
      }
      return b && (this._currNode = T.finally = new $e(), this.code(b)), this._endBlockNode(he, $e);
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
    func(i, f = t.nil, b, T) {
      return this._blockNode(new K(i, f, b)), T && this.code(T).endFunc(), this;
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
  e.CodeGen = F;
  function G($, i) {
    for (const f in i)
      $[f] = ($[f] || 0) + (i[f] || 0);
    return $;
  }
  function ae($, i) {
    return i instanceof t._CodeOrName ? G($, i.names) : $;
  }
  function H($, i, f) {
    if ($ instanceof t.Name)
      return b($);
    if (!T($))
      return $;
    return new t._Code($._items.reduce((I, V) => (V instanceof t.Name && (V = b(V)), V instanceof t._Code ? I.push(...V._items) : I.push(V), I), []));
    function b(I) {
      const V = f[I.str];
      return V === void 0 || i[I.str] !== 1 ? I : (delete i[I.str], V);
    }
    function T(I) {
      return I instanceof t._Code && I._items.some((V) => V instanceof t.Name && i[V.str] === 1 && f[V.str] !== void 0);
    }
  }
  function ce($, i) {
    for (const f in i)
      $[f] = ($[f] || 0) - (i[f] || 0);
  }
  function A($) {
    return typeof $ == "boolean" || typeof $ == "number" || $ === null ? !$ : (0, t._)`!${S($)}`;
  }
  e.not = A;
  const j = p(e.operators.AND);
  function z(...$) {
    return $.reduce(j);
  }
  e.and = z;
  const M = p(e.operators.OR);
  function P(...$) {
    return $.reduce(M);
  }
  e.or = P;
  function p($) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${S(i)} ${$} ${S(f)}`;
  }
  function S($) {
    return $ instanceof t.Name ? $ : (0, t._)`(${$})`;
  }
})(Z);
var C = {};
Object.defineProperty(C, "__esModule", { value: !0 });
C.checkStrictMode = C.getErrorPath = C.Type = C.useFunc = C.setEvaluated = C.evaluatedPropsToName = C.mergeEvaluated = C.eachItem = C.unescapeJsonPointer = C.escapeJsonPointer = C.escapeFragment = C.unescapeFragment = C.schemaRefOrVal = C.schemaHasRulesButRef = C.schemaHasRules = C.checkUnknownRules = C.alwaysValidSchema = C.toHash = void 0;
const oe = Z, pf = Sn;
function $f(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
C.toHash = $f;
function yf(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Sl(e, t), !Pl(t, e.self.RULES.all));
}
C.alwaysValidSchema = yf;
function Sl(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || Ol(e, `unknown keyword: "${a}"`);
}
C.checkUnknownRules = Sl;
function Pl(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
C.schemaHasRules = Pl;
function gf(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
C.schemaHasRulesButRef = gf;
function _f({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, oe._)`${r}`;
  }
  return (0, oe._)`${e}${t}${(0, oe.getProperty)(n)}`;
}
C.schemaRefOrVal = _f;
function vf(e) {
  return Nl(decodeURIComponent(e));
}
C.unescapeFragment = vf;
function wf(e) {
  return encodeURIComponent(Ma(e));
}
C.escapeFragment = wf;
function Ma(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
C.escapeJsonPointer = Ma;
function Nl(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
C.unescapeJsonPointer = Nl;
function Ef(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
C.eachItem = Ef;
function Gi({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, u) => {
    const c = o === void 0 ? a : o instanceof oe.Name ? (a instanceof oe.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof oe.Name ? (t(s, o, a), a) : r(a, o);
    return u === oe.Name && !(c instanceof oe.Name) ? n(s, c) : c;
  };
}
C.mergeEvaluated = {
  props: Gi({
    mergeNames: (e, t, r) => e.if((0, oe._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, oe._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, oe._)`${r} || {}`).code((0, oe._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, oe._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, oe._)`${r} || {}`), La(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Rl
  }),
  items: Gi({
    mergeNames: (e, t, r) => e.if((0, oe._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, oe._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, oe._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, oe._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Rl(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, oe._)`{}`);
  return t !== void 0 && La(e, r, t), r;
}
C.evaluatedPropsToName = Rl;
function La(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, oe._)`${t}${(0, oe.getProperty)(n)}`, !0));
}
C.setEvaluated = La;
const Hi = {};
function bf(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Hi[t.code] || (Hi[t.code] = new pf._Code(t.code))
  });
}
C.useFunc = bf;
var pa;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(pa || (C.Type = pa = {}));
function Sf(e, t, r) {
  if (e instanceof oe.Name) {
    const n = t === pa.Num;
    return r ? n ? (0, oe._)`"[" + ${e} + "]"` : (0, oe._)`"['" + ${e} + "']"` : n ? (0, oe._)`"/" + ${e}` : (0, oe._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, oe.getProperty)(e).toString() : "/" + Ma(e);
}
C.getErrorPath = Sf;
function Ol(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
C.checkStrictMode = Ol;
var Ke = {};
Object.defineProperty(Ke, "__esModule", { value: !0 });
const Ne = Z, Pf = {
  // validation function arguments
  data: new Ne.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Ne.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Ne.Name("instancePath"),
  parentData: new Ne.Name("parentData"),
  parentDataProperty: new Ne.Name("parentDataProperty"),
  rootData: new Ne.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Ne.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Ne.Name("vErrors"),
  // null or array of validation errors
  errors: new Ne.Name("errors"),
  // counter of validation errors
  this: new Ne.Name("this"),
  // "globals"
  self: new Ne.Name("self"),
  scope: new Ne.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Ne.Name("json"),
  jsonPos: new Ne.Name("jsonPos"),
  jsonLen: new Ne.Name("jsonLen"),
  jsonPart: new Ne.Name("jsonPart")
};
Ke.default = Pf;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = Z, r = C, n = Ke;
  e.keywordError = {
    message: ({ keyword: y }) => (0, t.str)`must pass "${y}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: y, schemaType: m }) => m ? (0, t.str)`"${y}" keyword must be ${m} ($data)` : (0, t.str)`"${y}" keyword is invalid ($data)`
  };
  function s(y, m = e.keywordError, v, N) {
    const { it: R } = y, { gen: O, compositeRule: K, allErrors: X } = R, de = h(y, m, v);
    N ?? (K || X) ? c(O, de) : d(R, (0, t._)`[${de}]`);
  }
  e.reportError = s;
  function a(y, m = e.keywordError, v) {
    const { it: N } = y, { gen: R, compositeRule: O, allErrors: K } = N, X = h(y, m, v);
    c(R, X), O || K || d(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o(y, m) {
    y.assign(n.default.errors, m), y.if((0, t._)`${n.default.vErrors} !== null`, () => y.if(m, () => y.assign((0, t._)`${n.default.vErrors}.length`, m), () => y.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function u({ gen: y, keyword: m, schemaValue: v, data: N, errsCount: R, it: O }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const K = y.name("err");
    y.forRange("i", R, n.default.errors, (X) => {
      y.const(K, (0, t._)`${n.default.vErrors}[${X}]`), y.if((0, t._)`${K}.instancePath === undefined`, () => y.assign((0, t._)`${K}.instancePath`, (0, t.strConcat)(n.default.instancePath, O.errorPath))), y.assign((0, t._)`${K}.schemaPath`, (0, t.str)`${O.errSchemaPath}/${m}`), O.opts.verbose && (y.assign((0, t._)`${K}.schema`, v), y.assign((0, t._)`${K}.data`, N));
    });
  }
  e.extendErrors = u;
  function c(y, m) {
    const v = y.const("err", m);
    y.if((0, t._)`${n.default.vErrors} === null`, () => y.assign(n.default.vErrors, (0, t._)`[${v}]`), (0, t._)`${n.default.vErrors}.push(${v})`), y.code((0, t._)`${n.default.errors}++`);
  }
  function d(y, m) {
    const { gen: v, validateName: N, schemaEnv: R } = y;
    R.$async ? v.throw((0, t._)`new ${y.ValidationError}(${m})`) : (v.assign((0, t._)`${N}.errors`, m), v.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h(y, m, v) {
    const { createErrors: N } = y.it;
    return N === !1 ? (0, t._)`{}` : E(y, m, v);
  }
  function E(y, m, v = {}) {
    const { gen: N, it: R } = y, O = [
      g(R, v),
      w(y, v)
    ];
    return _(y, m, O), N.object(...O);
  }
  function g({ errorPath: y }, { instancePath: m }) {
    const v = m ? (0, t.str)`${y}${(0, r.getErrorPath)(m, r.Type.Str)}` : y;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, v)];
  }
  function w({ keyword: y, it: { errSchemaPath: m } }, { schemaPath: v, parentSchema: N }) {
    let R = N ? m : (0, t.str)`${m}/${y}`;
    return v && (R = (0, t.str)`${R}${(0, r.getErrorPath)(v, r.Type.Str)}`), [l.schemaPath, R];
  }
  function _(y, { params: m, message: v }, N) {
    const { keyword: R, data: O, schemaValue: K, it: X } = y, { opts: de, propertyName: he, topSchemaRef: $e, schemaPath: F } = X;
    N.push([l.keyword, R], [l.params, typeof m == "function" ? m(y) : m || (0, t._)`{}`]), de.messages && N.push([l.message, typeof v == "function" ? v(y) : v]), de.verbose && N.push([l.schema, K], [l.parentSchema, (0, t._)`${$e}${F}`], [n.default.data, O]), he && N.push([l.propertyName, he]);
  }
})(Rn);
Object.defineProperty(Ur, "__esModule", { value: !0 });
Ur.boolOrEmptySchema = Ur.topBoolOrEmptySchema = void 0;
const Nf = Rn, Rf = Z, Of = Ke, Tf = {
  message: "boolean schema is false"
};
function If(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Tl(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Of.default.data) : (t.assign((0, Rf._)`${n}.errors`, null), t.return(!0));
}
Ur.topBoolOrEmptySchema = If;
function jf(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Tl(e)) : r.var(t, !0);
}
Ur.boolOrEmptySchema = jf;
function Tl(e, t) {
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
  (0, Nf.reportError)(s, Tf, void 0, t);
}
var ye = {}, $r = {};
Object.defineProperty($r, "__esModule", { value: !0 });
$r.getRules = $r.isJSONType = void 0;
const kf = ["string", "number", "integer", "boolean", "null", "object", "array"], Af = new Set(kf);
function Cf(e) {
  return typeof e == "string" && Af.has(e);
}
$r.isJSONType = Cf;
function Df() {
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
$r.getRules = Df;
var _t = {};
Object.defineProperty(_t, "__esModule", { value: !0 });
_t.shouldUseRule = _t.shouldUseGroup = _t.schemaHasRulesForType = void 0;
function Mf({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Il(e, n);
}
_t.schemaHasRulesForType = Mf;
function Il(e, t) {
  return t.rules.some((r) => jl(e, r));
}
_t.shouldUseGroup = Il;
function jl(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
_t.shouldUseRule = jl;
Object.defineProperty(ye, "__esModule", { value: !0 });
ye.reportTypeError = ye.checkDataTypes = ye.checkDataType = ye.coerceAndCheckDataType = ye.getJSONTypes = ye.getSchemaTypes = ye.DataType = void 0;
const Lf = $r, Vf = _t, Ff = Rn, x = Z, kl = C;
var Dr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Dr || (ye.DataType = Dr = {}));
function zf(e) {
  const t = Al(e.type);
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
ye.getSchemaTypes = zf;
function Al(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(Lf.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ye.getJSONTypes = Al;
function Uf(e, t) {
  const { gen: r, data: n, opts: s } = e, a = qf(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, Vf.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const u = Va(t, n, s.strictNumbers, Dr.Wrong);
    r.if(u, () => {
      a.length ? Kf(e, t, a) : Fa(e);
    });
  }
  return o;
}
ye.coerceAndCheckDataType = Uf;
const Cl = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function qf(e, t) {
  return t ? e.filter((r) => Cl.has(r) || t === "array" && r === "array") : [];
}
function Kf(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, x._)`typeof ${s}`), u = n.let("coerced", (0, x._)`undefined`);
  a.coerceTypes === "array" && n.if((0, x._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, x._)`${s}[0]`).assign(o, (0, x._)`typeof ${s}`).if(Va(t, s, a.strictNumbers), () => n.assign(u, s))), n.if((0, x._)`${u} !== undefined`);
  for (const d of r)
    (Cl.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), Fa(e), n.endIf(), n.if((0, x._)`${u} !== undefined`, () => {
    n.assign(s, u), Gf(e, u);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, x._)`${o} == "number" || ${o} == "boolean"`).assign(u, (0, x._)`"" + ${s}`).elseIf((0, x._)`${s} === null`).assign(u, (0, x._)`""`);
        return;
      case "number":
        n.elseIf((0, x._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(u, (0, x._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, x._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(u, (0, x._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, x._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(u, !1).elseIf((0, x._)`${s} === "true" || ${s} === 1`).assign(u, !0);
        return;
      case "null":
        n.elseIf((0, x._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(u, null);
        return;
      case "array":
        n.elseIf((0, x._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(u, (0, x._)`[${s}]`);
    }
  }
}
function Gf({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, x._)`${t} !== undefined`, () => e.assign((0, x._)`${t}[${r}]`, n));
}
function $a(e, t, r, n = Dr.Correct) {
  const s = n === Dr.Correct ? x.operators.EQ : x.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, x._)`${t} ${s} null`;
    case "array":
      a = (0, x._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, x._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, x._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, x._)`typeof ${t} ${s} ${e}`;
  }
  return n === Dr.Correct ? a : (0, x.not)(a);
  function o(u = x.nil) {
    return (0, x.and)((0, x._)`typeof ${t} == "number"`, u, r ? (0, x._)`isFinite(${t})` : x.nil);
  }
}
ye.checkDataType = $a;
function Va(e, t, r, n) {
  if (e.length === 1)
    return $a(e[0], t, r, n);
  let s;
  const a = (0, kl.toHash)(e);
  if (a.array && a.object) {
    const o = (0, x._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, x._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = x.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, x.and)(s, $a(o, t, r, n));
  return s;
}
ye.checkDataTypes = Va;
const Hf = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, x._)`{type: ${e}}` : (0, x._)`{type: ${t}}`
};
function Fa(e) {
  const t = Bf(e);
  (0, Ff.reportError)(t, Hf);
}
ye.reportTypeError = Fa;
function Bf(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, kl.schemaRefOrVal)(e, n, "type");
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
var Es = {};
Object.defineProperty(Es, "__esModule", { value: !0 });
Es.assignDefaults = void 0;
const wr = Z, Wf = C;
function Xf(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Bi(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => Bi(e, a, s.default));
}
Es.assignDefaults = Xf;
function Bi(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const u = (0, wr._)`${a}${(0, wr.getProperty)(t)}`;
  if (s) {
    (0, Wf.checkStrictMode)(e, `default is ignored for: ${u}`);
    return;
  }
  let c = (0, wr._)`${u} === undefined`;
  o.useDefaults === "empty" && (c = (0, wr._)`${c} || ${u} === null || ${u} === ""`), n.if(c, (0, wr._)`${u} = ${(0, wr.stringify)(r)}`);
}
var ft = {}, re = {};
Object.defineProperty(re, "__esModule", { value: !0 });
re.validateUnion = re.validateArray = re.usePattern = re.callValidateCode = re.schemaProperties = re.allSchemaProperties = re.noPropertyInData = re.propertyInData = re.isOwnProperty = re.hasPropFunc = re.reportMissingProp = re.checkMissingProp = re.checkReportMissingProp = void 0;
const le = Z, za = C, Rt = Ke, Jf = C;
function Yf(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(qa(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, le._)`${t}` }, !0), e.error();
  });
}
re.checkReportMissingProp = Yf;
function Qf({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, le.or)(...n.map((a) => (0, le.and)(qa(e, t, a, r.ownProperties), (0, le._)`${s} = ${a}`)));
}
re.checkMissingProp = Qf;
function Zf(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
re.reportMissingProp = Zf;
function Dl(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, le._)`Object.prototype.hasOwnProperty`
  });
}
re.hasPropFunc = Dl;
function Ua(e, t, r) {
  return (0, le._)`${Dl(e)}.call(${t}, ${r})`;
}
re.isOwnProperty = Ua;
function xf(e, t, r, n) {
  const s = (0, le._)`${t}${(0, le.getProperty)(r)} !== undefined`;
  return n ? (0, le._)`${s} && ${Ua(e, t, r)}` : s;
}
re.propertyInData = xf;
function qa(e, t, r, n) {
  const s = (0, le._)`${t}${(0, le.getProperty)(r)} === undefined`;
  return n ? (0, le.or)(s, (0, le.not)(Ua(e, t, r))) : s;
}
re.noPropertyInData = qa;
function Ml(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
re.allSchemaProperties = Ml;
function eh(e, t) {
  return Ml(t).filter((r) => !(0, za.alwaysValidSchema)(e, t[r]));
}
re.schemaProperties = eh;
function th({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, u, c, d) {
  const l = d ? (0, le._)`${e}, ${t}, ${n}${s}` : t, h = [
    [Rt.default.instancePath, (0, le.strConcat)(Rt.default.instancePath, a)],
    [Rt.default.parentData, o.parentData],
    [Rt.default.parentDataProperty, o.parentDataProperty],
    [Rt.default.rootData, Rt.default.rootData]
  ];
  o.opts.dynamicRef && h.push([Rt.default.dynamicAnchors, Rt.default.dynamicAnchors]);
  const E = (0, le._)`${l}, ${r.object(...h)}`;
  return c !== le.nil ? (0, le._)`${u}.call(${c}, ${E})` : (0, le._)`${u}(${E})`;
}
re.callValidateCode = th;
const rh = (0, le._)`new RegExp`;
function nh({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, le._)`${s.code === "new RegExp" ? rh : (0, Jf.useFunc)(e, s)}(${r}, ${n})`
  });
}
re.usePattern = nh;
function sh(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const u = t.let("valid", !0);
    return o(() => t.assign(u, !1)), u;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(u) {
    const c = t.const("len", (0, le._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: za.Type.Num
      }, a), t.if((0, le.not)(a), u);
    });
  }
}
re.validateArray = sh;
function ah(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, za.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), u = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, u);
    t.assign(o, (0, le._)`${o} || ${u}`), e.mergeValidEvaluated(l, u) || t.if((0, le.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
re.validateUnion = ah;
Object.defineProperty(ft, "__esModule", { value: !0 });
ft.validateKeywordUsage = ft.validSchemaType = ft.funcKeywordCode = ft.macroKeywordCode = void 0;
const ke = Z, nr = Ke, oh = re, ih = Rn;
function ch(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, u = t.macro.call(o.self, s, a, o), c = Ll(r, n, u);
  o.opts.validateSchema !== !1 && o.self.validateSchema(u, !0);
  const d = r.name("valid");
  e.subschema({
    schema: u,
    schemaPath: ke.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
ft.macroKeywordCode = ch;
function lh(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: u, it: c } = e;
  dh(c, t);
  const d = !u && t.compile ? t.compile.call(c.self, a, o, c) : t.validate, l = Ll(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      _(), t.modifying && Wi(e), y(() => e.error());
    else {
      const m = t.async ? g() : w();
      t.modifying && Wi(e), y(() => uh(e, m));
    }
  }
  function g() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, ke._)`await `), (v) => n.assign(h, !1).if((0, ke._)`${v} instanceof ${c.ValidationError}`, () => n.assign(m, (0, ke._)`${v}.errors`), () => n.throw(v))), m;
  }
  function w() {
    const m = (0, ke._)`${l}.errors`;
    return n.assign(m, null), _(ke.nil), m;
  }
  function _(m = t.async ? (0, ke._)`await ` : ke.nil) {
    const v = c.opts.passContext ? nr.default.this : nr.default.self, N = !("compile" in t && !u || t.schema === !1);
    n.assign(h, (0, ke._)`${m}${(0, oh.callValidateCode)(e, l, v, N)}`, t.modifying);
  }
  function y(m) {
    var v;
    n.if((0, ke.not)((v = t.valid) !== null && v !== void 0 ? v : h), m);
  }
}
ft.funcKeywordCode = lh;
function Wi(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, ke._)`${n.parentData}[${n.parentDataProperty}]`));
}
function uh(e, t) {
  const { gen: r } = e;
  r.if((0, ke._)`Array.isArray(${t})`, () => {
    r.assign(nr.default.vErrors, (0, ke._)`${nr.default.vErrors} === null ? ${t} : ${nr.default.vErrors}.concat(${t})`).assign(nr.default.errors, (0, ke._)`${nr.default.vErrors}.length`), (0, ih.extendErrors)(e);
  }, () => e.error());
}
function dh({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Ll(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, ke.stringify)(r) });
}
function fh(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
ft.validSchemaType = fh;
function hh({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((u) => !Object.prototype.hasOwnProperty.call(e, u)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
ft.validateKeywordUsage = hh;
var Ft = {};
Object.defineProperty(Ft, "__esModule", { value: !0 });
Ft.extendSubschemaMode = Ft.extendSubschemaData = Ft.getSubschema = void 0;
const ut = Z, Vl = C;
function mh(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const u = e.schema[t];
    return r === void 0 ? {
      schema: u,
      schemaPath: (0, ut._)`${e.schemaPath}${(0, ut.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: u[r],
      schemaPath: (0, ut._)`${e.schemaPath}${(0, ut.getProperty)(t)}${(0, ut.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Vl.escapeFragment)(r)}`
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
Ft.getSubschema = mh;
function ph(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: u } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: l, opts: h } = t, E = u.let("data", (0, ut._)`${t.data}${(0, ut.getProperty)(r)}`, !0);
    c(E), e.errorPath = (0, ut.str)`${d}${(0, Vl.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, ut._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof ut.Name ? s : u.let("data", s, !0);
    c(d), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Ft.extendSubschemaData = ph;
function $h(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Ft.extendSubschemaMode = $h;
var Ee = {}, bs = function e(t, r) {
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
}, Fl = { exports: {} }, Lt = Fl.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  ts(t, n, s, e, "", e);
};
Lt.keywords = {
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
Lt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Lt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Lt.skipKeywords = {
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
function ts(e, t, r, n, s, a, o, u, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, u, c, d);
    for (var l in n) {
      var h = n[l];
      if (Array.isArray(h)) {
        if (l in Lt.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            ts(e, t, r, h[E], s + "/" + l + "/" + E, a, s, l, n, E);
      } else if (l in Lt.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            ts(e, t, r, h[g], s + "/" + l + "/" + yh(g), a, s, l, n, g);
      } else (l in Lt.keywords || e.allKeys && !(l in Lt.skipKeywords)) && ts(e, t, r, h, s + "/" + l, a, s, l, n);
    }
    r(n, s, a, o, u, c, d);
  }
}
function yh(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var gh = Fl.exports;
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.getSchemaRefs = Ee.resolveUrl = Ee.normalizeId = Ee._getFullPath = Ee.getFullPath = Ee.inlineRef = void 0;
const _h = C, vh = bs, wh = gh, Eh = /* @__PURE__ */ new Set([
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
function bh(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !ya(e) : t ? zl(e) <= t : !1;
}
Ee.inlineRef = bh;
const Sh = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function ya(e) {
  for (const t in e) {
    if (Sh.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(ya) || typeof r == "object" && ya(r))
      return !0;
  }
  return !1;
}
function zl(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Eh.has(r) && (typeof e[r] == "object" && (0, _h.eachItem)(e[r], (n) => t += zl(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Ul(e, t = "", r) {
  r !== !1 && (t = Mr(t));
  const n = e.parse(t);
  return ql(e, n);
}
Ee.getFullPath = Ul;
function ql(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ee._getFullPath = ql;
const Ph = /#\/?$/;
function Mr(e) {
  return e ? e.replace(Ph, "") : "";
}
Ee.normalizeId = Mr;
function Nh(e, t, r) {
  return r = Mr(r), e.resolve(t, r);
}
Ee.resolveUrl = Nh;
const Rh = /^[a-z_][-a-z0-9._]*$/i;
function Oh(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Mr(e[r] || t), a = { "": s }, o = Ul(n, s, !1), u = {}, c = /* @__PURE__ */ new Set();
  return wh(e, { allKeys: !0 }, (h, E, g, w) => {
    if (w === void 0)
      return;
    const _ = o + E;
    let y = a[w];
    typeof h[r] == "string" && (y = m.call(this, h[r])), v.call(this, h.$anchor), v.call(this, h.$dynamicAnchor), a[E] = y;
    function m(N) {
      const R = this.opts.uriResolver.resolve;
      if (N = Mr(y ? R(y, N) : N), c.has(N))
        throw l(N);
      c.add(N);
      let O = this.refs[N];
      return typeof O == "string" && (O = this.refs[O]), typeof O == "object" ? d(h, O.schema, N) : N !== Mr(_) && (N[0] === "#" ? (d(h, u[N], N), u[N] = h) : this.refs[N] = _), N;
    }
    function v(N) {
      if (typeof N == "string") {
        if (!Rh.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), u;
  function d(h, E, g) {
    if (E !== void 0 && !vh(h, E))
      throw l(g);
  }
  function l(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ee.getSchemaRefs = Oh;
Object.defineProperty(nt, "__esModule", { value: !0 });
nt.getData = nt.KeywordCxt = nt.validateFunctionCode = void 0;
const Kl = Ur, Xi = ye, Ka = _t, ds = ye, Th = Es, fn = ft, Hs = Ft, U = Z, B = Ke, Ih = Ee, vt = C, sn = Rn;
function jh(e) {
  if (Bl(e) && (Wl(e), Hl(e))) {
    Ch(e);
    return;
  }
  Gl(e, () => (0, Kl.topBoolOrEmptySchema)(e));
}
nt.validateFunctionCode = jh;
function Gl({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, U._)`${B.default.data}, ${B.default.valCxt}`, n.$async, () => {
    e.code((0, U._)`"use strict"; ${Ji(r, s)}`), Ah(e, s), e.code(a);
  }) : e.func(t, (0, U._)`${B.default.data}, ${kh(s)}`, n.$async, () => e.code(Ji(r, s)).code(a));
}
function kh(e) {
  return (0, U._)`{${B.default.instancePath}="", ${B.default.parentData}, ${B.default.parentDataProperty}, ${B.default.rootData}=${B.default.data}${e.dynamicRef ? (0, U._)`, ${B.default.dynamicAnchors}={}` : U.nil}}={}`;
}
function Ah(e, t) {
  e.if(B.default.valCxt, () => {
    e.var(B.default.instancePath, (0, U._)`${B.default.valCxt}.${B.default.instancePath}`), e.var(B.default.parentData, (0, U._)`${B.default.valCxt}.${B.default.parentData}`), e.var(B.default.parentDataProperty, (0, U._)`${B.default.valCxt}.${B.default.parentDataProperty}`), e.var(B.default.rootData, (0, U._)`${B.default.valCxt}.${B.default.rootData}`), t.dynamicRef && e.var(B.default.dynamicAnchors, (0, U._)`${B.default.valCxt}.${B.default.dynamicAnchors}`);
  }, () => {
    e.var(B.default.instancePath, (0, U._)`""`), e.var(B.default.parentData, (0, U._)`undefined`), e.var(B.default.parentDataProperty, (0, U._)`undefined`), e.var(B.default.rootData, B.default.data), t.dynamicRef && e.var(B.default.dynamicAnchors, (0, U._)`{}`);
  });
}
function Ch(e) {
  const { schema: t, opts: r, gen: n } = e;
  Gl(e, () => {
    r.$comment && t.$comment && Jl(e), Fh(e), n.let(B.default.vErrors, null), n.let(B.default.errors, 0), r.unevaluated && Dh(e), Xl(e), qh(e);
  });
}
function Dh(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, U._)`${r}.evaluated`), t.if((0, U._)`${e.evaluated}.dynamicProps`, () => t.assign((0, U._)`${e.evaluated}.props`, (0, U._)`undefined`)), t.if((0, U._)`${e.evaluated}.dynamicItems`, () => t.assign((0, U._)`${e.evaluated}.items`, (0, U._)`undefined`));
}
function Ji(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, U._)`/*# sourceURL=${r} */` : U.nil;
}
function Mh(e, t) {
  if (Bl(e) && (Wl(e), Hl(e))) {
    Lh(e, t);
    return;
  }
  (0, Kl.boolOrEmptySchema)(e, t);
}
function Hl({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Bl(e) {
  return typeof e.schema != "boolean";
}
function Lh(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Jl(e), zh(e), Uh(e);
  const a = n.const("_errs", B.default.errors);
  Xl(e, a), n.var(t, (0, U._)`${a} === ${B.default.errors}`);
}
function Wl(e) {
  (0, vt.checkUnknownRules)(e), Vh(e);
}
function Xl(e, t) {
  if (e.opts.jtd)
    return Yi(e, [], !1, t);
  const r = (0, Xi.getSchemaTypes)(e.schema), n = (0, Xi.coerceAndCheckDataType)(e, r);
  Yi(e, r, !n, t);
}
function Vh(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, vt.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function Fh(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, vt.checkStrictMode)(e, "default is ignored in the schema root");
}
function zh(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, Ih.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function Uh(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Jl({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, U._)`${B.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, U.str)`${n}/$comment`, u = e.scopeValue("root", { ref: t.root });
    e.code((0, U._)`${B.default.self}.opts.$comment(${a}, ${o}, ${u}.schema)`);
  }
}
function qh(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, U._)`${B.default.errors} === 0`, () => t.return(B.default.data), () => t.throw((0, U._)`new ${s}(${B.default.vErrors})`)) : (t.assign((0, U._)`${n}.errors`, B.default.vErrors), a.unevaluated && Kh(e), t.return((0, U._)`${B.default.errors} === 0`));
}
function Kh({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof U.Name && e.assign((0, U._)`${t}.props`, r), n instanceof U.Name && e.assign((0, U._)`${t}.items`, n);
}
function Yi(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: u, opts: c, self: d } = e, { RULES: l } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, vt.schemaHasRulesButRef)(a, l))) {
    s.block(() => Zl(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || Gh(e, t), s.block(() => {
    for (const E of l.rules)
      h(E);
    h(l.post);
  });
  function h(E) {
    (0, Ka.shouldUseGroup)(a, E) && (E.type ? (s.if((0, ds.checkDataType)(E.type, o, c.strictNumbers)), Qi(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, ds.reportTypeError)(e)), s.endIf()) : Qi(e, E), u || s.if((0, U._)`${B.default.errors} === ${n || 0}`));
  }
}
function Qi(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, Th.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, Ka.shouldUseRule)(n, a) && Zl(e, a.keyword, a.definition, t.type);
  });
}
function Gh(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (Hh(e, t), e.opts.allowUnionTypes || Bh(e, t), Wh(e, e.dataTypes));
}
function Hh(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Yl(e.dataTypes, r) || Ga(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), Jh(e, t);
  }
}
function Bh(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Ga(e, "use allowUnionTypes to allow union type keyword");
}
function Wh(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Ka.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => Xh(t, o)) && Ga(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function Xh(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Yl(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function Jh(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Yl(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Ga(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, vt.checkStrictMode)(e, t, e.opts.strictTypes);
}
let Ql = class {
  constructor(t, r, n) {
    if ((0, fn.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, vt.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", xl(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, fn.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", B.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, U.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, U.not)(t), void 0, r);
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
    this.fail((0, U._)`${r} !== undefined && (${(0, U.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? sn.reportExtraError : sn.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, sn.reportError)(this, this.def.$dataError || sn.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, sn.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = U.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = U.nil, r = U.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, U.or)((0, U._)`${s} === undefined`, r)), t !== U.nil && n.assign(t, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== U.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, U.or)(o(), u());
    function o() {
      if (n.length) {
        if (!(r instanceof U.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, U._)`${(0, ds.checkDataTypes)(c, r, a.opts.strictNumbers, ds.DataType.Wrong)}`;
      }
      return U.nil;
    }
    function u() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, U._)`!${c}(${r})`;
      }
      return U.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Hs.getSubschema)(this.it, t);
    (0, Hs.extendSubschemaData)(n, this.it, t), (0, Hs.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return Mh(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = vt.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = vt.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, U.Name)), !0;
  }
};
nt.KeywordCxt = Ql;
function Zl(e, t, r, n) {
  const s = new Ql(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, fn.funcKeywordCode)(s, r) : "macro" in r ? (0, fn.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, fn.funcKeywordCode)(s, r);
}
const Yh = /^\/(?:[^~]|~0|~1)*$/, Qh = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function xl(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return B.default.rootData;
  if (e[0] === "/") {
    if (!Yh.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = B.default.rootData;
  } else {
    const d = Qh.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +d[1];
    if (s = d[2], s === "#") {
      if (l >= t)
        throw new Error(c("property/index", l));
      return n[t - l];
    }
    if (l > t)
      throw new Error(c("data", l));
    if (a = r[t - l], !s)
      return a;
  }
  let o = a;
  const u = s.split("/");
  for (const d of u)
    d && (a = (0, U._)`${a}${(0, U.getProperty)((0, vt.unescapeJsonPointer)(d))}`, o = (0, U._)`${o} && ${a}`);
  return o;
  function c(d, l) {
    return `Cannot access ${d} ${l} levels up, current level is ${t}`;
  }
}
nt.getData = xl;
var On = {};
Object.defineProperty(On, "__esModule", { value: !0 });
let Zh = class extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
};
On.default = Zh;
var Br = {};
Object.defineProperty(Br, "__esModule", { value: !0 });
const Bs = Ee;
let xh = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Bs.resolveUrl)(t, r, n), this.missingSchema = (0, Bs.normalizeId)((0, Bs.getFullPath)(t, this.missingRef));
  }
};
Br.default = xh;
var Ce = {};
Object.defineProperty(Ce, "__esModule", { value: !0 });
Ce.resolveSchema = Ce.getCompilingSchema = Ce.resolveRef = Ce.compileSchema = Ce.SchemaEnv = void 0;
const Ye = Z, em = On, tr = Ke, et = Ee, Zi = C, tm = nt;
let Ss = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, et.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
Ce.SchemaEnv = Ss;
function Ha(e) {
  const t = eu.call(this, e);
  if (t)
    return t;
  const r = (0, et.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new Ye.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let u;
  e.$async && (u = o.scopeValue("Error", {
    ref: em.default,
    code: (0, Ye._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: tr.default.data,
    parentData: tr.default.parentData,
    parentDataProperty: tr.default.parentDataProperty,
    dataNames: [tr.default.data],
    dataPathArr: [Ye.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Ye.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: u,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Ye.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Ye._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, tm.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    l = `${o.scopeRefs(tr.default.scope)}return ${h}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const g = new Function(`${tr.default.self}`, `${tr.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: _ } = d;
      g.evaluated = {
        props: w instanceof Ye.Name ? void 0 : w,
        items: _ instanceof Ye.Name ? void 0 : _,
        dynamicProps: w instanceof Ye.Name,
        dynamicItems: _ instanceof Ye.Name
      }, g.source && (g.source.evaluated = (0, Ye.stringify)(g.evaluated));
    }
    return e.validate = g, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), h;
  } finally {
    this._compilations.delete(e);
  }
}
Ce.compileSchema = Ha;
function rm(e, t, r) {
  var n;
  r = (0, et.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = am.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: u } = this.opts;
    o && (a = new Ss({ schema: o, schemaId: u, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = nm.call(this, a);
}
Ce.resolveRef = rm;
function nm(e) {
  return (0, et.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Ha.call(this, e);
}
function eu(e) {
  for (const t of this._compilations)
    if (sm(t, e))
      return t;
}
Ce.getCompilingSchema = eu;
function sm(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function am(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Ps.call(this, e, t);
}
function Ps(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, et._getFullPath)(this.opts.uriResolver, r);
  let s = (0, et.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Ws.call(this, r, e);
  const a = (0, et.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const u = Ps.call(this, e, o);
    return typeof (u == null ? void 0 : u.schema) != "object" ? void 0 : Ws.call(this, r, u);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Ha.call(this, o), a === (0, et.normalizeId)(t)) {
      const { schema: u } = o, { schemaId: c } = this.opts, d = u[c];
      return d && (s = (0, et.resolveUrl)(this.opts.uriResolver, s, d)), new Ss({ schema: u, schemaId: c, root: e, baseId: s });
    }
    return Ws.call(this, r, o);
  }
}
Ce.resolveSchema = Ps;
const om = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Ws(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const u of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Zi.unescapeFragment)(u)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !om.has(u) && d && (t = (0, et.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, Zi.schemaHasRulesButRef)(r, this.RULES)) {
    const u = (0, et.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = Ps.call(this, n, u);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new Ss({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const im = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", cm = "Meta-schema for $data reference (JSON AnySchema extension proposal)", lm = "object", um = [
  "$data"
], dm = {
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
}, fm = !1, hm = {
  $id: im,
  description: cm,
  type: lm,
  required: um,
  properties: dm,
  additionalProperties: fm
};
var Ba = {}, Ns = { exports: {} };
const mm = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), tu = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u), Wa = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu), ru = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu), pm = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
function nu(e) {
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
const $m = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function xi(e) {
  return e.length = 0, !0;
}
function ym(e, t, r) {
  if (e.length) {
    const n = nu(e);
    if (n !== "")
      t.push(n);
    else
      return r.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function gm(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, o = !1, u = ym;
  for (let c = 0; c < e.length; c++) {
    const d = e[c];
    if (!(d === "[" || d === "]"))
      if (d === ":") {
        if (a === !0 && (o = !0), !u(s, n, r))
          break;
        if (++t > 7) {
          r.error = !0;
          break;
        }
        c > 0 && e[c - 1] === ":" && (a = !0), n.push(":");
        continue;
      } else if (d === "%") {
        if (!u(s, n, r))
          break;
        u = xi;
      } else {
        s.push(d);
        continue;
      }
  }
  return s.length && (u === xi ? r.zone = s.join("") : o ? n.push(s.join("")) : n.push(nu(s))), r.address = n.join(""), r;
}
function su(e) {
  if (_m(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = gm(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function _m(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function vm(e) {
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
const wm = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" }, Em = /[@/?#:]/g, bm = /[@/?#]/g;
function au(e, t) {
  const r = t ? bm : Em;
  return r.lastIndex = 0, e.replace(r, (n) => wm[n]);
}
function Sm(e, t = !1) {
  if (e.indexOf("%") === -1)
    return e;
  let r = "";
  for (let n = 0; n < e.length; n++) {
    if (e[n] === "%" && n + 2 < e.length) {
      const s = e.slice(n + 1, n + 3);
      if (Wa(s)) {
        const a = s.toUpperCase(), o = String.fromCharCode(parseInt(a, 16));
        t && ru(o) ? r += o : r += "%" + a, n += 2;
        continue;
      }
    }
    r += e[n];
  }
  return r;
}
function Pm(e) {
  let t = "";
  for (let r = 0; r < e.length; r++) {
    if (e[r] === "%" && r + 2 < e.length) {
      const n = e.slice(r + 1, r + 3);
      if (Wa(n)) {
        const s = n.toUpperCase(), a = String.fromCharCode(parseInt(s, 16));
        a !== "." && ru(a) ? t += a : t += "%" + s, r += 2;
        continue;
      }
    }
    pm(e[r]) ? t += e[r] : t += escape(e[r]);
  }
  return t;
}
function Nm(e) {
  let t = "";
  for (let r = 0; r < e.length; r++) {
    if (e[r] === "%" && r + 2 < e.length) {
      const n = e.slice(r + 1, r + 3);
      if (Wa(n)) {
        t += "%" + n.toUpperCase(), r += 2;
        continue;
      }
    }
    t += escape(e[r]);
  }
  return t;
}
function Rm(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    if (!tu(r)) {
      const n = su(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = au(r, !1);
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var ou = {
  nonSimpleDomain: $m,
  recomposeAuthority: Rm,
  reescapeHostDelimiters: au,
  normalizePercentEncoding: Sm,
  normalizePathEncoding: Pm,
  escapePreservingEscapes: Nm,
  removeDotSegments: vm,
  isIPv4: tu,
  isUUID: mm,
  normalizeIPv6: su
};
const { isUUID: Om } = ou, Tm = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function iu(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function cu(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function lu(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function Im(e) {
  return e.secure = iu(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function jm(e) {
  if ((e.port === (iu(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function km(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(Tm);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, a = Xa(s);
    e.path = void 0, a && (e = a.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function Am(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, a = Xa(s);
  a && (e = a.serialize(e, t));
  const o = e, u = e.nss;
  return o.path = `${n || t.nid}:${u}`, t.skipEscape = !0, o;
}
function Cm(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !Om(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function Dm(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const uu = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: cu,
    serialize: lu
  }
), Mm = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: uu.domainHost,
    parse: cu,
    serialize: lu
  }
), rs = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: Im,
    serialize: jm
  }
), Lm = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: rs.domainHost,
    parse: rs.parse,
    serialize: rs.serialize
  }
), Vm = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: km,
    serialize: Am,
    skipNormalize: !0
  }
), Fm = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: Cm,
    serialize: Dm,
    skipNormalize: !0
  }
), fs = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: uu,
    https: Mm,
    ws: rs,
    wss: Lm,
    urn: Vm,
    "urn:uuid": Fm
  }
);
Object.setPrototypeOf(fs, null);
function Xa(e) {
  return e && (fs[
    /** @type {SchemeName} */
    e
  ] || fs[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var zm = {
  SCHEMES: fs,
  getSchemeHandler: Xa
};
const { normalizeIPv6: Um, removeDotSegments: ln, recomposeAuthority: qm, normalizePercentEncoding: Km, normalizePathEncoding: Gm, escapePreservingEscapes: Hm, reescapeHostDelimiters: Bm, isIPv4: Wm, nonSimpleDomain: Xm } = ou, { SCHEMES: Jm, getSchemeHandler: du } = zm;
function Ym(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  tp(e, t) : typeof e == "object" && (e = /** @type {T} */
  qr(yr(e, t), t)), e;
}
function Qm(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = fu(qr(e, n), qr(t, n), n, !0);
  return n.skipEscape = !0, yr(s, n);
}
function fu(e, t, r, n) {
  const s = {};
  return n || (e = qr(yr(e, r), r), t = qr(yr(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = ln(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = ln(t.path || ""), s.query = t.query) : (t.path ? (t.path[0] === "/" ? s.path = ln(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = ln(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function Zm(e, t, r) {
  const n = ec(e, r), s = ec(t, r);
  return n !== void 0 && s !== void 0 && n.toLowerCase() === s.toLowerCase();
}
function yr(e, t) {
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
  }, n = Object.assign({}, t), s = [], a = du(n.scheme || r.scheme);
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = Km(r.path) : (r.path = Hm(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const o = qm(r);
  if (o !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(o), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let u = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (u = ln(u)), o === void 0 && u[0] === "/" && u[1] === "/" && (u = "/%2F" + u.slice(2)), s.push(u);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const xm = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function ep(e, t) {
  if (t[2] !== void 0 && e.path && e.path[0] !== "/")
    return 'URI path must start with "/" when authority is present.';
  if (typeof e.port == "number" && (e.port < 0 || e.port > 65535))
    return "URI port is malformed.";
}
function hu(e, t) {
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
  const o = e.match(xm);
  if (o) {
    n.scheme = o[1], n.userinfo = o[3], n.host = o[4], n.port = parseInt(o[5], 10), n.path = o[6] || "", n.query = o[7], n.fragment = o[8], isNaN(n.port) && (n.port = o[5]);
    const u = ep(n, o);
    if (u !== void 0 && (n.error = n.error || u, s = !0), n.host)
      if (Wm(n.host) === !1) {
        const l = Um(n.host);
        n.host = l.host.toLowerCase(), a = l.isIPV6;
      } else
        a = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const c = du(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!c || !c.unicodeSupport) && n.host && (r.domainHost || c && c.domainHost) && a === !1 && Xm(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (d) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + d;
      }
    if ((!c || c && !c.skipNormalize) && (e.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = Bm(unescape(n.host), a))), n.path && (n.path = Gm(n.path)), n.fragment))
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
function qr(e, t) {
  return hu(e, t).parsed;
}
function tp(e, t) {
  return mu(e, t).normalized;
}
function mu(e, t) {
  const { parsed: r, malformedAuthorityOrPort: n } = hu(e, t);
  return {
    normalized: n ? e : yr(r, t),
    malformedAuthorityOrPort: n
  };
}
function ec(e, t) {
  if (typeof e == "string") {
    const { normalized: r, malformedAuthorityOrPort: n } = mu(e, t);
    return n ? void 0 : r;
  }
  if (typeof e == "object")
    return yr(e, t);
}
const Ja = {
  SCHEMES: Jm,
  normalize: Ym,
  resolve: Qm,
  resolveComponent: fu,
  equal: Zm,
  serialize: yr,
  parse: qr
};
Ns.exports = Ja;
Ns.exports.default = Ja;
Ns.exports.fastUri = Ja;
var pu = Ns.exports;
Object.defineProperty(Ba, "__esModule", { value: !0 });
const $u = pu;
$u.code = 'require("ajv/dist/runtime/uri").default';
Ba.default = $u;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = nt;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = Z;
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
  const n = On, s = Br, a = $r, o = Ce, u = Z, c = Ee, d = ye, l = C, h = hm, E = Ba, g = (P, p) => new RegExp(P, p);
  g.code = "new RegExp";
  const w = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
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
  ]), y = {
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
  }, v = 200;
  function N(P) {
    var p, S, $, i, f, b, T, I, V, L, se, ze, Ut, qt, Kt, Gt, Ht, Bt, Wt, Xt, Jt, Yt, Qt, Zt, xt;
    const Xe = P.strict, er = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, en = er === !0 || er === void 0 ? 1 : er || 0, tn = ($ = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && $ !== void 0 ? $ : g, zs = (i = P.uriResolver) !== null && i !== void 0 ? i : E.default;
    return {
      strictSchema: (b = (f = P.strictSchema) !== null && f !== void 0 ? f : Xe) !== null && b !== void 0 ? b : !0,
      strictNumbers: (I = (T = P.strictNumbers) !== null && T !== void 0 ? T : Xe) !== null && I !== void 0 ? I : !0,
      strictTypes: (L = (V = P.strictTypes) !== null && V !== void 0 ? V : Xe) !== null && L !== void 0 ? L : "log",
      strictTuples: (ze = (se = P.strictTuples) !== null && se !== void 0 ? se : Xe) !== null && ze !== void 0 ? ze : "log",
      strictRequired: (qt = (Ut = P.strictRequired) !== null && Ut !== void 0 ? Ut : Xe) !== null && qt !== void 0 ? qt : !1,
      code: P.code ? { ...P.code, optimize: en, regExp: tn } : { optimize: en, regExp: tn },
      loopRequired: (Kt = P.loopRequired) !== null && Kt !== void 0 ? Kt : v,
      loopEnum: (Gt = P.loopEnum) !== null && Gt !== void 0 ? Gt : v,
      meta: (Ht = P.meta) !== null && Ht !== void 0 ? Ht : !0,
      messages: (Bt = P.messages) !== null && Bt !== void 0 ? Bt : !0,
      inlineRefs: (Wt = P.inlineRefs) !== null && Wt !== void 0 ? Wt : !0,
      schemaId: (Xt = P.schemaId) !== null && Xt !== void 0 ? Xt : "$id",
      addUsedSchema: (Jt = P.addUsedSchema) !== null && Jt !== void 0 ? Jt : !0,
      validateSchema: (Yt = P.validateSchema) !== null && Yt !== void 0 ? Yt : !0,
      validateFormats: (Qt = P.validateFormats) !== null && Qt !== void 0 ? Qt : !0,
      unicodeRegExp: (Zt = P.unicodeRegExp) !== null && Zt !== void 0 ? Zt : !0,
      int32range: (xt = P.int32range) !== null && xt !== void 0 ? xt : !0,
      uriResolver: zs
    };
  }
  class R {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...N(p) };
      const { es5: S, lines: $ } = this.opts.code;
      this.scope = new u.ValueScope({ scope: {}, prefixes: _, es5: S, lines: $ }), this.logger = G(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), O.call(this, y, p, "NOT SUPPORTED"), O.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = $e.call(this), p.formats && de.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && he.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), X.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: S, schemaId: $ } = this.opts;
      let i = h;
      $ === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), S && p && this.addMetaSchema(i, i[$], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: S } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[S] || p : void 0;
    }
    validate(p, S) {
      let $;
      if (typeof p == "string") {
        if ($ = this.getSchema(p), !$)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        $ = this.compile(p);
      const i = $(S);
      return "$async" in $ || (this.errors = $.errors), i;
    }
    compile(p, S) {
      const $ = this._addSchema(p, S);
      return $.validate || this._compileSchemaEnv($);
    }
    compileAsync(p, S) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: $ } = this.opts;
      return i.call(this, p, S);
      async function i(L, se) {
        await f.call(this, L.$schema);
        const ze = this._addSchema(L, se);
        return ze.validate || b.call(this, ze);
      }
      async function f(L) {
        L && !this.getSchema(L) && await i.call(this, { $ref: L }, !0);
      }
      async function b(L) {
        try {
          return this._compileSchemaEnv(L);
        } catch (se) {
          if (!(se instanceof s.default))
            throw se;
          return T.call(this, se), await I.call(this, se.missingSchema), b.call(this, L);
        }
      }
      function T({ missingSchema: L, missingRef: se }) {
        if (this.refs[L])
          throw new Error(`AnySchema ${L} is loaded but ${se} cannot be resolved`);
      }
      async function I(L) {
        const se = await V.call(this, L);
        this.refs[L] || await f.call(this, se.$schema), this.refs[L] || this.addSchema(se, L, S);
      }
      async function V(L) {
        const se = this._loading[L];
        if (se)
          return se;
        try {
          return await (this._loading[L] = $(L));
        } finally {
          delete this._loading[L];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, S, $, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const b of p)
          this.addSchema(b, void 0, $, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: b } = this.opts;
        if (f = p[b], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${b} must be string`);
      }
      return S = (0, c.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(p, $, S, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, S, $ = this.opts.validateSchema) {
      return this.addSchema(p, S, !0, $), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, S) {
      if (typeof p == "boolean")
        return !0;
      let $;
      if ($ = p.$schema, $ !== void 0 && typeof $ != "string")
        throw new Error("$schema must be a string");
      if ($ = $ || this.opts.defaultMeta || this.defaultMeta(), !$)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate($, p);
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
        const { schemaId: $ } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: $ });
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
          let $ = p[this.opts.schemaId];
          return $ && ($ = (0, c.normalizeId)($), delete this.schemas[$], delete this.refs[$]), this;
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
      let $;
      if (typeof p == "string")
        $ = p, typeof S == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), S.keyword = $);
      else if (typeof p == "object" && S === void 0) {
        if (S = p, $ = S.keyword, Array.isArray($) && !$.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (H.call(this, $, S), !S)
        return (0, l.eachItem)($, (f) => ce.call(this, f)), this;
      j.call(this, S);
      const i = {
        ...S,
        type: (0, d.getJSONTypes)(S.type),
        schemaType: (0, d.getJSONTypes)(S.schemaType)
      };
      return (0, l.eachItem)($, i.type.length === 0 ? (f) => ce.call(this, f, i) : (f) => i.type.forEach((b) => ce.call(this, f, i, b))), this;
    }
    getKeyword(p) {
      const S = this.RULES.all[p];
      return typeof S == "object" ? S.definition : !!S;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: S } = this;
      delete S.keywords[p], delete S.all[p];
      for (const $ of S.rules) {
        const i = $.rules.findIndex((f) => f.keyword === p);
        i >= 0 && $.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, S) {
      return typeof S == "string" && (S = new RegExp(S)), this.formats[p] = S, this;
    }
    errorsText(p = this.errors, { separator: S = ", ", dataVar: $ = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${$}${i.instancePath} ${i.message}`).reduce((i, f) => i + S + f);
    }
    $dataMetaSchema(p, S) {
      const $ = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of S) {
        const f = i.split("/").slice(1);
        let b = p;
        for (const T of f)
          b = b[T];
        for (const T in $) {
          const I = $[T];
          if (typeof I != "object")
            continue;
          const { $data: V } = I.definition, L = b[T];
          V && L && (b[T] = M(L));
        }
      }
      return p;
    }
    _removeAllSchemas(p, S) {
      for (const $ in p) {
        const i = p[$];
        (!S || S.test($)) && (typeof i == "string" ? delete p[$] : i && !i.meta && (this._cache.delete(i.schema), delete p[$]));
      }
    }
    _addSchema(p, S, $, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let b;
      const { schemaId: T } = this.opts;
      if (typeof p == "object")
        b = p[T];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let I = this._cache.get(p);
      if (I !== void 0)
        return I;
      $ = (0, c.normalizeId)(b || $);
      const V = c.getSchemaRefs.call(this, p, $);
      return I = new o.SchemaEnv({ schema: p, schemaId: T, meta: S, baseId: $, localRefs: V }), this._cache.set(I.schema, I), f && !$.startsWith("#") && ($ && this._checkUnique($), this.refs[$] = I), i && this.validateSchema(p, !0), I;
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
  R.ValidationError = n.default, R.MissingRefError = s.default, e.default = R;
  function O(P, p, S, $ = "error") {
    for (const i in P) {
      const f = i;
      f in p && this.logger[$](`${S}: option ${i}. ${P[f]}`);
    }
  }
  function K(P) {
    return P = (0, c.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function X() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const p in P)
          this.addSchema(P[p], p);
  }
  function de() {
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
  function $e() {
    const P = { ...this.opts };
    for (const p of w)
      delete P[p];
    return P;
  }
  const F = { log() {
  }, warn() {
  }, error() {
  } };
  function G(P) {
    if (P === !1)
      return F;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const ae = /^[a-z_$][a-z0-9_$:-]*$/i;
  function H(P, p) {
    const { RULES: S } = this;
    if ((0, l.eachItem)(P, ($) => {
      if (S.keywords[$])
        throw new Error(`Keyword ${$} is already defined`);
      if (!ae.test($))
        throw new Error(`Keyword ${$} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function ce(P, p, S) {
    var $;
    const i = p == null ? void 0 : p.post;
    if (S && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let b = i ? f.post : f.rules.find(({ type: I }) => I === S);
    if (b || (b = { type: S, rules: [] }, f.rules.push(b)), f.keywords[P] = !0, !p)
      return;
    const T = {
      keyword: P,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? A.call(this, b, T, p.before) : b.rules.push(T), f.all[P] = T, ($ = p.implements) === null || $ === void 0 || $.forEach((I) => this.addKeyword(I));
  }
  function A(P, p, S) {
    const $ = P.rules.findIndex((i) => i.keyword === S);
    $ >= 0 ? P.rules.splice($, 0, p) : (P.rules.push(p), this.logger.warn(`rule ${S} is not defined`));
  }
  function j(P) {
    let { metaSchema: p } = P;
    p !== void 0 && (P.$data && this.opts.$data && (p = M(p)), P.validateSchema = this.compile(p, !0));
  }
  const z = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function M(P) {
    return { anyOf: [P, z] };
  }
})(bl);
var Ya = {}, Qa = {}, Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
const rp = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Za.default = rp;
var bt = {};
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.callRef = bt.getValidate = void 0;
const np = Br, tc = re, Le = Z, Er = Ke, rc = Ce, Ln = C, sp = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: u, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const l = rc.resolveRef.call(c, d, s, r);
    if (l === void 0)
      throw new np.default(n.opts.uriResolver, s, r);
    if (l instanceof rc.SchemaEnv)
      return E(l);
    return g(l);
    function h() {
      if (a === d)
        return ns(e, o, a, a.$async);
      const w = t.scopeValue("root", { ref: d });
      return ns(e, (0, Le._)`${w}.validate`, d, d.$async);
    }
    function E(w) {
      const _ = yu(e, w);
      ns(e, _, w, w.$async);
    }
    function g(w) {
      const _ = t.scopeValue("schema", u.code.source === !0 ? { ref: w, code: (0, Le.stringify)(w) } : { ref: w }), y = t.name("valid"), m = e.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: Le.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, y);
      e.mergeEvaluated(m), e.ok(y);
    }
  }
};
function yu(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Le._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
bt.getValidate = yu;
function ns(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: u, opts: c } = a, d = c.passContext ? Er.default.this : Le.nil;
  n ? l() : h();
  function l() {
    if (!u.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, Le._)`await ${(0, tc.callValidateCode)(e, t, d)}`), g(t), o || s.assign(w, !0);
    }, (_) => {
      s.if((0, Le._)`!(${_} instanceof ${a.ValidationError})`, () => s.throw(_)), E(_), o || s.assign(w, !1);
    }), e.ok(w);
  }
  function h() {
    e.result((0, tc.callValidateCode)(e, t, d), () => g(t), () => E(t));
  }
  function E(w) {
    const _ = (0, Le._)`${w}.errors`;
    s.assign(Er.default.vErrors, (0, Le._)`${Er.default.vErrors} === null ? ${_} : ${Er.default.vErrors}.concat(${_})`), s.assign(Er.default.errors, (0, Le._)`${Er.default.vErrors}.length`);
  }
  function g(w) {
    var _;
    if (!a.opts.unevaluated)
      return;
    const y = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (a.props !== !0)
      if (y && !y.dynamicProps)
        y.props !== void 0 && (a.props = Ln.mergeEvaluated.props(s, y.props, a.props));
      else {
        const m = s.var("props", (0, Le._)`${w}.evaluated.props`);
        a.props = Ln.mergeEvaluated.props(s, m, a.props, Le.Name);
      }
    if (a.items !== !0)
      if (y && !y.dynamicItems)
        y.items !== void 0 && (a.items = Ln.mergeEvaluated.items(s, y.items, a.items));
      else {
        const m = s.var("items", (0, Le._)`${w}.evaluated.items`);
        a.items = Ln.mergeEvaluated.items(s, m, a.items, Le.Name);
      }
  }
}
bt.callRef = ns;
bt.default = sp;
Object.defineProperty(Qa, "__esModule", { value: !0 });
const ap = Za, op = bt, ip = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  ap.default,
  op.default
];
Qa.default = ip;
var xa = {}, eo = {};
Object.defineProperty(eo, "__esModule", { value: !0 });
const hs = Z, Ot = hs.operators, ms = {
  maximum: { okStr: "<=", ok: Ot.LTE, fail: Ot.GT },
  minimum: { okStr: ">=", ok: Ot.GTE, fail: Ot.LT },
  exclusiveMaximum: { okStr: "<", ok: Ot.LT, fail: Ot.GTE },
  exclusiveMinimum: { okStr: ">", ok: Ot.GT, fail: Ot.LTE }
}, cp = {
  message: ({ keyword: e, schemaCode: t }) => (0, hs.str)`must be ${ms[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, hs._)`{comparison: ${ms[e].okStr}, limit: ${t}}`
}, lp = {
  keyword: Object.keys(ms),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: cp,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, hs._)`${r} ${ms[t].fail} ${n} || isNaN(${r})`);
  }
};
eo.default = lp;
var to = {};
Object.defineProperty(to, "__esModule", { value: !0 });
const hn = Z, up = {
  message: ({ schemaCode: e }) => (0, hn.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, hn._)`{multipleOf: ${e}}`
}, dp = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: up,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), u = a ? (0, hn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, hn._)`${o} !== parseInt(${o})`;
    e.fail$data((0, hn._)`(${n} === 0 || (${o} = ${r}/${n}, ${u}))`);
  }
};
to.default = dp;
var ro = {}, no = {};
Object.defineProperty(no, "__esModule", { value: !0 });
function gu(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
no.default = gu;
gu.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(ro, "__esModule", { value: !0 });
const sr = Z, fp = C, hp = no, mp = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, sr.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, sr._)`{limit: ${e}}`
}, pp = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: mp,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? sr.operators.GT : sr.operators.LT, o = s.opts.unicode === !1 ? (0, sr._)`${r}.length` : (0, sr._)`${(0, fp.useFunc)(e.gen, hp.default)}(${r})`;
    e.fail$data((0, sr._)`${o} ${a} ${n}`);
  }
};
ro.default = pp;
var so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
const $p = re, yp = C, Ir = Z, gp = {
  message: ({ schemaCode: e }) => (0, Ir.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Ir._)`{pattern: ${e}}`
}, _p = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: gp,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e, u = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, Ir._)`new RegExp` : (0, yp.useFunc)(t, c), l = t.let("valid");
      t.try(() => t.assign(l, (0, Ir._)`${d}(${a}, ${u}).test(${r})`), () => t.assign(l, !1)), e.fail$data((0, Ir._)`!${l}`);
    } else {
      const c = (0, $p.usePattern)(e, s);
      e.fail$data((0, Ir._)`!${c}.test(${r})`);
    }
  }
};
so.default = _p;
var ao = {};
Object.defineProperty(ao, "__esModule", { value: !0 });
const mn = Z, vp = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, mn.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, mn._)`{limit: ${e}}`
}, wp = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: vp,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? mn.operators.GT : mn.operators.LT;
    e.fail$data((0, mn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
ao.default = wp;
var oo = {};
Object.defineProperty(oo, "__esModule", { value: !0 });
const an = re, pn = Z, Ep = C, bp = {
  message: ({ params: { missingProperty: e } }) => (0, pn.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, pn._)`{missingProperty: ${e}}`
}, Sp = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: bp,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: u } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= u.loopRequired;
    if (o.allErrors ? d() : l(), u.strictRequired) {
      const g = e.parentSchema.properties, { definedProperties: w } = e.it;
      for (const _ of r)
        if ((g == null ? void 0 : g[_]) === void 0 && !w.has(_)) {
          const y = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${_}" is not defined at "${y}" (strictRequired)`;
          (0, Ep.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(pn.nil, h);
      else
        for (const g of r)
          (0, an.checkReportMissingProp)(e, g);
    }
    function l() {
      const g = t.let("missing");
      if (c || a) {
        const w = t.let("valid", !0);
        e.block$data(w, () => E(g, w)), e.ok(w);
      } else
        t.if((0, an.checkMissingProp)(e, r, g)), (0, an.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, an.noPropertyInData)(t, s, g, u.ownProperties), () => e.error());
      });
    }
    function E(g, w) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(w, (0, an.propertyInData)(t, s, g, u.ownProperties)), t.if((0, pn.not)(w), () => {
          e.error(), t.break();
        });
      }, pn.nil);
    }
  }
};
oo.default = Sp;
var io = {};
Object.defineProperty(io, "__esModule", { value: !0 });
const $n = Z, Pp = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, $n.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, $n._)`{limit: ${e}}`
}, Np = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Pp,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? $n.operators.GT : $n.operators.LT;
    e.fail$data((0, $n._)`${r}.length ${s} ${n}`);
  }
};
io.default = Np;
var co = {}, Tn = {};
Object.defineProperty(Tn, "__esModule", { value: !0 });
const _u = bs;
_u.code = 'require("ajv/dist/runtime/equal").default';
Tn.default = _u;
Object.defineProperty(co, "__esModule", { value: !0 });
const Xs = ye, ve = Z, Rp = C, Op = Tn, Tp = {
  message: ({ params: { i: e, j: t } }) => (0, ve.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, ve._)`{i: ${e}, j: ${t}}`
}, Ip = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Tp,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: u } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, Xs.getSchemaTypes)(a.items) : [];
    e.block$data(c, l, (0, ve._)`${o} === false`), e.ok(c);
    function l() {
      const w = t.let("i", (0, ve._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: w, j: _ }), t.assign(c, !0), t.if((0, ve._)`${w} > 1`, () => (h() ? E : g)(w, _));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function E(w, _) {
      const y = t.name("item"), m = (0, Xs.checkDataTypes)(d, y, u.opts.strictNumbers, Xs.DataType.Wrong), v = t.const("indices", (0, ve._)`{}`);
      t.for((0, ve._)`;${w}--;`, () => {
        t.let(y, (0, ve._)`${r}[${w}]`), t.if(m, (0, ve._)`continue`), d.length > 1 && t.if((0, ve._)`typeof ${y} == "string"`, (0, ve._)`${y} += "_"`), t.if((0, ve._)`typeof ${v}[${y}] == "number"`, () => {
          t.assign(_, (0, ve._)`${v}[${y}]`), e.error(), t.assign(c, !1).break();
        }).code((0, ve._)`${v}[${y}] = ${w}`);
      });
    }
    function g(w, _) {
      const y = (0, Rp.useFunc)(t, Op.default), m = t.name("outer");
      t.label(m).for((0, ve._)`;${w}--;`, () => t.for((0, ve._)`${_} = ${w}; ${_}--;`, () => t.if((0, ve._)`${y}(${r}[${w}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
co.default = Ip;
var lo = {};
Object.defineProperty(lo, "__esModule", { value: !0 });
const ga = Z, jp = C, kp = Tn, Ap = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, ga._)`{allowedValue: ${e}}`
}, Cp = {
  keyword: "const",
  $data: !0,
  error: Ap,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, ga._)`!${(0, jp.useFunc)(t, kp.default)}(${r}, ${s})`) : e.fail((0, ga._)`${a} !== ${r}`);
  }
};
lo.default = Cp;
var uo = {};
Object.defineProperty(uo, "__esModule", { value: !0 });
const un = Z, Dp = C, Mp = Tn, Lp = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, un._)`{allowedValues: ${e}}`
}, Vp = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Lp,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const u = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, Dp.useFunc)(t, Mp.default));
    let l;
    if (u || n)
      l = t.let("valid"), e.block$data(l, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", a);
      l = (0, un.or)(...s.map((w, _) => E(g, _)));
    }
    e.pass(l);
    function h() {
      t.assign(l, !1), t.forOf("v", a, (g) => t.if((0, un._)`${d()}(${r}, ${g})`, () => t.assign(l, !0).break()));
    }
    function E(g, w) {
      const _ = s[w];
      return typeof _ == "object" && _ !== null ? (0, un._)`${d()}(${r}, ${g}[${w}])` : (0, un._)`${r} === ${_}`;
    }
  }
};
uo.default = Vp;
Object.defineProperty(xa, "__esModule", { value: !0 });
const Fp = eo, zp = to, Up = ro, qp = so, Kp = ao, Gp = oo, Hp = io, Bp = co, Wp = lo, Xp = uo, Jp = [
  // number
  Fp.default,
  zp.default,
  // string
  Up.default,
  qp.default,
  // object
  Kp.default,
  Gp.default,
  // array
  Hp.default,
  Bp.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Wp.default,
  Xp.default
];
xa.default = Jp;
var fo = {}, Wr = {};
Object.defineProperty(Wr, "__esModule", { value: !0 });
Wr.validateAdditionalItems = void 0;
const ar = Z, _a = C, Yp = {
  message: ({ params: { len: e } }) => (0, ar.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, ar._)`{limit: ${e}}`
}, Qp = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Yp,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, _a.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    vu(e, n);
  }
};
function vu(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const u = r.const("len", (0, ar._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, ar._)`${u} <= ${t.length}`);
  else if (typeof n == "object" && !(0, _a.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, ar._)`${u} <= ${t.length}`);
    r.if((0, ar.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, u, (l) => {
      e.subschema({ keyword: a, dataProp: l, dataPropType: _a.Type.Num }, d), o.allErrors || r.if((0, ar.not)(d), () => r.break());
    });
  }
}
Wr.validateAdditionalItems = vu;
Wr.default = Qp;
var ho = {}, Xr = {};
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.validateTuple = void 0;
const nc = Z, ss = C, Zp = re, xp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return wu(e, "additionalItems", t);
    r.items = !0, !(0, ss.alwaysValidSchema)(r, t) && e.ok((0, Zp.validateArray)(e));
  }
};
function wu(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: u } = e;
  l(s), u.opts.unevaluated && r.length && u.items !== !0 && (u.items = ss.mergeEvaluated.items(n, r.length, u.items));
  const c = n.name("valid"), d = n.const("len", (0, nc._)`${a}.length`);
  r.forEach((h, E) => {
    (0, ss.alwaysValidSchema)(u, h) || (n.if((0, nc._)`${d} > ${E}`, () => e.subschema({
      keyword: o,
      schemaProp: E,
      dataProp: E
    }, c)), e.ok(c));
  });
  function l(h) {
    const { opts: E, errSchemaPath: g } = u, w = r.length, _ = w === h.minItems && (w === h.maxItems || h[t] === !1);
    if (E.strictTuples && !_) {
      const y = `"${o}" is ${w}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, ss.checkStrictMode)(u, y, E.strictTuples);
    }
  }
}
Xr.validateTuple = wu;
Xr.default = xp;
Object.defineProperty(ho, "__esModule", { value: !0 });
const e$ = Xr, t$ = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, e$.validateTuple)(e, "items")
};
ho.default = t$;
var mo = {};
Object.defineProperty(mo, "__esModule", { value: !0 });
const sc = Z, r$ = C, n$ = re, s$ = Wr, a$ = {
  message: ({ params: { len: e } }) => (0, sc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, sc._)`{limit: ${e}}`
}, o$ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: a$,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, r$.alwaysValidSchema)(n, t) && (s ? (0, s$.validateAdditionalItems)(e, s) : e.ok((0, n$.validateArray)(e)));
  }
};
mo.default = o$;
var po = {};
Object.defineProperty(po, "__esModule", { value: !0 });
const He = Z, Vn = C, i$ = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, He.str)`must contain at least ${e} valid item(s)` : (0, He.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, He._)`{minContains: ${e}}` : (0, He._)`{minContains: ${e}, maxContains: ${t}}`
}, c$ = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: i$,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, u;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, u = d) : o = 1;
    const l = t.const("len", (0, He._)`${s}.length`);
    if (e.setParams({ min: o, max: u }), u === void 0 && o === 0) {
      (0, Vn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (u !== void 0 && o > u) {
      (0, Vn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Vn.alwaysValidSchema)(a, r)) {
      let _ = (0, He._)`${l} >= ${o}`;
      u !== void 0 && (_ = (0, He._)`${_} && ${l} <= ${u}`), e.pass(_);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    u === void 0 && o === 1 ? g(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), u !== void 0 && t.if((0, He._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const _ = t.name("_valid"), y = t.let("count", 0);
      g(_, () => t.if(_, () => w(y)));
    }
    function g(_, y) {
      t.forRange("i", 0, l, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: Vn.Type.Num,
          compositeRule: !0
        }, _), y();
      });
    }
    function w(_) {
      t.code((0, He._)`${_}++`), u === void 0 ? t.if((0, He._)`${_} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, He._)`${_} > ${u}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, He._)`${_} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
po.default = c$;
var Rs = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = Z, r = C, n = re;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: l } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: l, missingProperty: h } }) => (0, t._)`{property: ${c},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${l}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [d, l] = a(c);
      o(c, d), u(c, l);
    }
  };
  function a({ schema: c }) {
    const d = {}, l = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const E = Array.isArray(c[h]) ? d : l;
      E[h] = c[h];
    }
    return [d, l];
  }
  function o(c, d = c.schema) {
    const { gen: l, data: h, it: E } = c;
    if (Object.keys(d).length === 0)
      return;
    const g = l.let("missing");
    for (const w in d) {
      const _ = d[w];
      if (_.length === 0)
        continue;
      const y = (0, n.propertyInData)(l, h, w, E.opts.ownProperties);
      c.setParams({
        property: w,
        depsCount: _.length,
        deps: _.join(", ")
      }), E.allErrors ? l.if(y, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (l.if((0, t._)`${y} && (${(0, n.checkMissingProp)(c, _, g)})`), (0, n.reportMissingProp)(c, g), l.else());
    }
  }
  e.validatePropertyDeps = o;
  function u(c, d = c.schema) {
    const { gen: l, data: h, keyword: E, it: g } = c, w = l.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)(g, d[_]) || (l.if(
        (0, n.propertyInData)(l, h, _, g.opts.ownProperties),
        () => {
          const y = c.subschema({ keyword: E, schemaProp: _ }, w);
          c.mergeValidEvaluated(y, w);
        },
        () => l.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  e.validateSchemaDeps = u, e.default = s;
})(Rs);
var $o = {};
Object.defineProperty($o, "__esModule", { value: !0 });
const Eu = Z, l$ = C, u$ = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Eu._)`{propertyName: ${e.propertyName}}`
}, d$ = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: u$,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, l$.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, Eu.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
$o.default = d$;
var Os = {};
Object.defineProperty(Os, "__esModule", { value: !0 });
const Fn = re, Ze = Z, f$ = Ke, zn = C, h$ = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Ze._)`{additionalProperty: ${e.additionalProperty}}`
}, m$ = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: h$,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: u, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, zn.alwaysValidSchema)(o, r))
      return;
    const d = (0, Fn.allSchemaProperties)(n.properties), l = (0, Fn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Ze._)`${a} === ${f$.default.errors}`);
    function h() {
      t.forIn("key", s, (y) => {
        !d.length && !l.length ? w(y) : t.if(E(y), () => w(y));
      });
    }
    function E(y) {
      let m;
      if (d.length > 8) {
        const v = (0, zn.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, Fn.isOwnProperty)(t, v, y);
      } else d.length ? m = (0, Ze.or)(...d.map((v) => (0, Ze._)`${y} === ${v}`)) : m = Ze.nil;
      return l.length && (m = (0, Ze.or)(m, ...l.map((v) => (0, Ze._)`${(0, Fn.usePattern)(e, v)}.test(${y})`))), (0, Ze.not)(m);
    }
    function g(y) {
      t.code((0, Ze._)`delete ${s}[${y}]`);
    }
    function w(y) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        g(y);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: y }), e.error(), u || t.break();
        return;
      }
      if (typeof r == "object" && !(0, zn.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_(y, m, !1), t.if((0, Ze.not)(m), () => {
          e.reset(), g(y);
        })) : (_(y, m), u || t.if((0, Ze.not)(m), () => t.break()));
      }
    }
    function _(y, m, v) {
      const N = {
        keyword: "additionalProperties",
        dataProp: y,
        dataPropType: zn.Type.Str
      };
      v === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
Os.default = m$;
var yo = {};
Object.defineProperty(yo, "__esModule", { value: !0 });
const p$ = nt, ac = re, Js = C, oc = Os, $$ = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && oc.default.code(new p$.KeywordCxt(a, oc.default, "additionalProperties"));
    const o = (0, ac.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Js.mergeEvaluated.props(t, (0, Js.toHash)(o), a.props));
    const u = o.filter((h) => !(0, Js.alwaysValidSchema)(a, r[h]));
    if (u.length === 0)
      return;
    const c = t.name("valid");
    for (const h of u)
      d(h) ? l(h) : (t.if((0, ac.propertyInData)(t, s, h, a.opts.ownProperties)), l(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function l(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
yo.default = $$;
var go = {};
Object.defineProperty(go, "__esModule", { value: !0 });
const ic = re, Un = Z, cc = C, lc = C, y$ = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, u = (0, ic.allSchemaProperties)(r), c = u.filter((_) => (0, cc.alwaysValidSchema)(a, r[_]));
    if (u.length === 0 || c.length === u.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, l = t.name("valid");
    a.props !== !0 && !(a.props instanceof Un.Name) && (a.props = (0, lc.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    E();
    function E() {
      for (const _ of u)
        d && g(_), a.allErrors ? w(_) : (t.var(l, !0), w(_), t.if(l));
    }
    function g(_) {
      for (const y in d)
        new RegExp(_).test(y) && (0, cc.checkStrictMode)(a, `property ${y} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function w(_) {
      t.forIn("key", n, (y) => {
        t.if((0, Un._)`${(0, ic.usePattern)(e, _)}.test(${y})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: y,
            dataPropType: lc.Type.Str
          }, l), a.opts.unevaluated && h !== !0 ? t.assign((0, Un._)`${h}[${y}]`, !0) : !m && !a.allErrors && t.if((0, Un.not)(l), () => t.break());
        });
      });
    }
  }
};
go.default = y$;
var _o = {};
Object.defineProperty(_o, "__esModule", { value: !0 });
const g$ = C, _$ = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, g$.alwaysValidSchema)(n, r)) {
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
_o.default = _$;
var vo = {};
Object.defineProperty(vo, "__esModule", { value: !0 });
const v$ = re, w$ = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: v$.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
vo.default = w$;
var wo = {};
Object.defineProperty(wo, "__esModule", { value: !0 });
const as = Z, E$ = C, b$ = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, as._)`{passingSchemas: ${e.passing}}`
}, S$ = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: b$,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), u = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: u }), t.block(d), e.result(o, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((l, h) => {
        let E;
        (0, E$.alwaysValidSchema)(s, l) ? t.var(c, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, as._)`${c} && ${o}`).assign(o, !1).assign(u, (0, as._)`[${u}, ${h}]`).else(), t.if(c, () => {
          t.assign(o, !0), t.assign(u, h), E && e.mergeEvaluated(E, as.Name);
        });
      });
    }
  }
};
wo.default = S$;
var Eo = {};
Object.defineProperty(Eo, "__esModule", { value: !0 });
const P$ = C, N$ = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, P$.alwaysValidSchema)(n, a))
        return;
      const u = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(u);
    });
  }
};
Eo.default = N$;
var bo = {};
Object.defineProperty(bo, "__esModule", { value: !0 });
const ps = Z, bu = C, R$ = {
  message: ({ params: e }) => (0, ps.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, ps._)`{failingKeyword: ${e.ifClause}}`
}, O$ = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: R$,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, bu.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = uc(n, "then"), a = uc(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), u = t.name("_valid");
    if (c(), e.reset(), s && a) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(u, d("then", l), d("else", l));
    } else s ? t.if(u, d("then")) : t.if((0, ps.not)(u), d("else"));
    e.pass(o, () => e.error(!0));
    function c() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, u);
      e.mergeEvaluated(l);
    }
    function d(l, h) {
      return () => {
        const E = e.subschema({ keyword: l }, u);
        t.assign(o, u), e.mergeValidEvaluated(E, o), h ? t.assign(h, (0, ps._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function uc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, bu.alwaysValidSchema)(e, r);
}
bo.default = O$;
var So = {};
Object.defineProperty(So, "__esModule", { value: !0 });
const T$ = C, I$ = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, T$.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
So.default = I$;
Object.defineProperty(fo, "__esModule", { value: !0 });
const j$ = Wr, k$ = ho, A$ = Xr, C$ = mo, D$ = po, M$ = Rs, L$ = $o, V$ = Os, F$ = yo, z$ = go, U$ = _o, q$ = vo, K$ = wo, G$ = Eo, H$ = bo, B$ = So;
function W$(e = !1) {
  const t = [
    // any
    U$.default,
    q$.default,
    K$.default,
    G$.default,
    H$.default,
    B$.default,
    // object
    L$.default,
    V$.default,
    M$.default,
    F$.default,
    z$.default
  ];
  return e ? t.push(k$.default, C$.default) : t.push(j$.default, A$.default), t.push(D$.default), t;
}
fo.default = W$;
var Po = {}, Jr = {};
Object.defineProperty(Jr, "__esModule", { value: !0 });
Jr.dynamicAnchor = void 0;
const Ys = Z, X$ = Ke, dc = Ce, J$ = bt, Y$ = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => Su(e, e.schema)
};
function Su(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, Ys._)`${X$.default.dynamicAnchors}${(0, Ys.getProperty)(t)}`, a = n.errSchemaPath === "#" ? n.validateName : Q$(e);
  r.if((0, Ys._)`!${s}`, () => r.assign(s, a));
}
Jr.dynamicAnchor = Su;
function Q$(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: a, localRefs: o, meta: u } = t.root, { schemaId: c } = n.opts, d = new dc.SchemaEnv({ schema: r, schemaId: c, root: s, baseId: a, localRefs: o, meta: u });
  return dc.compileSchema.call(n, d), (0, J$.getValidate)(e, d);
}
Jr.default = Y$;
var Yr = {};
Object.defineProperty(Yr, "__esModule", { value: !0 });
Yr.dynamicRef = void 0;
const fc = Z, Z$ = Ke, hc = bt, x$ = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => Pu(e, e.schema)
};
function Pu(e, t) {
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
      const d = r.let("_v", (0, fc._)`${Z$.default.dynamicAnchors}${(0, fc.getProperty)(a)}`);
      r.if(d, u(d, c), u(s.validateName, c));
    } else
      u(s.validateName, c)();
  }
  function u(c, d) {
    return d ? () => r.block(() => {
      (0, hc.callRef)(e, c), r.let(d, !0);
    }) : () => (0, hc.callRef)(e, c);
  }
}
Yr.dynamicRef = Pu;
Yr.default = x$;
var No = {};
Object.defineProperty(No, "__esModule", { value: !0 });
const ey = Jr, ty = C, ry = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, ey.dynamicAnchor)(e, "") : (0, ty.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
No.default = ry;
var Ro = {};
Object.defineProperty(Ro, "__esModule", { value: !0 });
const ny = Yr, sy = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, ny.dynamicRef)(e, e.schema)
};
Ro.default = sy;
Object.defineProperty(Po, "__esModule", { value: !0 });
const ay = Jr, oy = Yr, iy = No, cy = Ro, ly = [ay.default, oy.default, iy.default, cy.default];
Po.default = ly;
var Oo = {}, To = {};
Object.defineProperty(To, "__esModule", { value: !0 });
const mc = Rs, uy = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: mc.error,
  code: (e) => (0, mc.validatePropertyDeps)(e)
};
To.default = uy;
var Io = {};
Object.defineProperty(Io, "__esModule", { value: !0 });
const dy = Rs, fy = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, dy.validateSchemaDeps)(e)
};
Io.default = fy;
var jo = {};
Object.defineProperty(jo, "__esModule", { value: !0 });
const hy = C, my = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, hy.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
jo.default = my;
Object.defineProperty(Oo, "__esModule", { value: !0 });
const py = To, $y = Io, yy = jo, gy = [py.default, $y.default, yy.default];
Oo.default = gy;
var ko = {}, Ao = {};
Object.defineProperty(Ao, "__esModule", { value: !0 });
const kt = Z, pc = C, _y = Ke, vy = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, kt._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, wy = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: vy,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: u } = a;
    u instanceof kt.Name ? t.if((0, kt._)`${u} !== true`, () => t.forIn("key", n, (h) => t.if(d(u, h), () => c(h)))) : u !== !0 && t.forIn("key", n, (h) => u === void 0 ? c(h) : t.if(l(u, h), () => c(h))), a.props = !0, e.ok((0, kt._)`${s} === ${_y.default.errors}`);
    function c(h) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: h }), e.error(), o || t.break();
        return;
      }
      if (!(0, pc.alwaysValidSchema)(a, r)) {
        const E = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: pc.Type.Str
        }, E), o || t.if((0, kt.not)(E), () => t.break());
      }
    }
    function d(h, E) {
      return (0, kt._)`!${h} || !${h}[${E}]`;
    }
    function l(h, E) {
      const g = [];
      for (const w in h)
        h[w] === !0 && g.push((0, kt._)`${E} !== ${w}`);
      return (0, kt.and)(...g);
    }
  }
};
Ao.default = wy;
var Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
const or = Z, $c = C, Ey = {
  message: ({ params: { len: e } }) => (0, or.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, or._)`{limit: ${e}}`
}, by = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: Ey,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, a = s.items || 0;
    if (a === !0)
      return;
    const o = t.const("len", (0, or._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: a }), e.fail((0, or._)`${o} > ${a}`);
    else if (typeof r == "object" && !(0, $c.alwaysValidSchema)(s, r)) {
      const c = t.var("valid", (0, or._)`${o} <= ${a}`);
      t.if((0, or.not)(c), () => u(c, a)), e.ok(c);
    }
    s.items = !0;
    function u(c, d) {
      t.forRange("i", d, o, (l) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: $c.Type.Num }, c), s.allErrors || t.if((0, or.not)(c), () => t.break());
      });
    }
  }
};
Co.default = by;
Object.defineProperty(ko, "__esModule", { value: !0 });
const Sy = Ao, Py = Co, Ny = [Sy.default, Py.default];
ko.default = Ny;
var Do = {}, Mo = {};
Object.defineProperty(Mo, "__esModule", { value: !0 });
const me = Z, Ry = {
  message: ({ schemaCode: e }) => (0, me.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, me._)`{format: ${e}}`
}, Oy = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Ry,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: u } = e, { opts: c, errSchemaPath: d, schemaEnv: l, self: h } = u;
    if (!c.validateFormats)
      return;
    s ? E() : g();
    function E() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, me._)`${w}[${o}]`), y = r.let("fType"), m = r.let("format");
      r.if((0, me._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign(y, (0, me._)`${_}.type || "string"`).assign(m, (0, me._)`${_}.validate`), () => r.assign(y, (0, me._)`"string"`).assign(m, _)), e.fail$data((0, me.or)(v(), N()));
      function v() {
        return c.strictSchema === !1 ? me.nil : (0, me._)`${o} && !${m}`;
      }
      function N() {
        const R = l.$async ? (0, me._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, me._)`${m}(${n})`, O = (0, me._)`(typeof ${m} == "function" ? ${R} : ${m}.test(${n}))`;
        return (0, me._)`${m} && ${m} !== true && ${y} === ${t} && !${O}`;
      }
    }
    function g() {
      const w = h.formats[a];
      if (!w) {
        v();
        return;
      }
      if (w === !0)
        return;
      const [_, y, m] = N(w);
      _ === t && e.pass(R());
      function v() {
        if (c.strictSchema === !1) {
          h.logger.warn(O());
          return;
        }
        throw new Error(O());
        function O() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function N(O) {
        const K = O instanceof RegExp ? (0, me.regexpCode)(O) : c.code.formats ? (0, me._)`${c.code.formats}${(0, me.getProperty)(a)}` : void 0, X = r.scopeValue("formats", { key: a, ref: O, code: K });
        return typeof O == "object" && !(O instanceof RegExp) ? [O.type || "string", O.validate, (0, me._)`${X}.validate`] : ["string", O, X];
      }
      function R() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, me._)`await ${m}(${n})`;
        }
        return typeof y == "function" ? (0, me._)`${m}(${n})` : (0, me._)`${m}.test(${n})`;
      }
    }
  }
};
Mo.default = Oy;
Object.defineProperty(Do, "__esModule", { value: !0 });
const Ty = Mo, Iy = [Ty.default];
Do.default = Iy;
var Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.contentVocabulary = Kr.metadataVocabulary = void 0;
Kr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Kr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Ya, "__esModule", { value: !0 });
const jy = Qa, ky = xa, Ay = fo, Cy = Po, Dy = Oo, My = ko, Ly = Do, yc = Kr, Vy = [
  Cy.default,
  jy.default,
  ky.default,
  (0, Ay.default)(!0),
  Ly.default,
  yc.metadataVocabulary,
  yc.contentVocabulary,
  Dy.default,
  My.default
];
Ya.default = Vy;
var Lo = {}, Ts = {};
Object.defineProperty(Ts, "__esModule", { value: !0 });
Ts.DiscrError = void 0;
var gc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(gc || (Ts.DiscrError = gc = {}));
Object.defineProperty(Lo, "__esModule", { value: !0 });
const Nr = Z, va = Ts, _c = Ce, Fy = Br, zy = C, Uy = {
  message: ({ params: { discrError: e, tagName: t } }) => e === va.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, Nr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, qy = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Uy,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const u = n.propertyName;
    if (typeof u != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, Nr._)`${r}${(0, Nr.getProperty)(u)}`);
    t.if((0, Nr._)`typeof ${d} == "string"`, () => l(), () => e.error(!1, { discrError: va.DiscrError.Tag, tag: d, tagName: u })), e.ok(c);
    function l() {
      const g = E();
      t.if(!1);
      for (const w in g)
        t.elseIf((0, Nr._)`${d} === ${w}`), t.assign(c, h(g[w]));
      t.else(), e.error(!1, { discrError: va.DiscrError.Mapping, tag: d, tagName: u }), t.endIf();
    }
    function h(g) {
      const w = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: g }, w);
      return e.mergeEvaluated(_, Nr.Name), w;
    }
    function E() {
      var g;
      const w = {}, _ = m(s);
      let y = !0;
      for (let R = 0; R < o.length; R++) {
        let O = o[R];
        if (O != null && O.$ref && !(0, zy.schemaHasRulesButRef)(O, a.self.RULES)) {
          const X = O.$ref;
          if (O = _c.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, X), O instanceof _c.SchemaEnv && (O = O.schema), O === void 0)
            throw new Fy.default(a.opts.uriResolver, a.baseId, X);
        }
        const K = (g = O == null ? void 0 : O.properties) === null || g === void 0 ? void 0 : g[u];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${u}"`);
        y = y && (_ || m(O)), v(K, R);
      }
      if (!y)
        throw new Error(`discriminator: "${u}" must be required`);
      return w;
      function m({ required: R }) {
        return Array.isArray(R) && R.includes(u);
      }
      function v(R, O) {
        if (R.const)
          N(R.const, O);
        else if (R.enum)
          for (const K of R.enum)
            N(K, O);
        else
          throw new Error(`discriminator: "properties/${u}" must have "const" or "enum"`);
      }
      function N(R, O) {
        if (typeof R != "string" || R in w)
          throw new Error(`discriminator: "${u}" values must be unique strings`);
        w[R] = O;
      }
    }
  }
};
Lo.default = qy;
var Vo = {};
const Ky = "https://json-schema.org/draft/2020-12/schema", Gy = "https://json-schema.org/draft/2020-12/schema", Hy = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, By = "meta", Wy = "Core and Validation specifications meta-schema", Xy = [
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
], Jy = [
  "object",
  "boolean"
], Yy = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", Qy = {
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
}, Zy = {
  $schema: Ky,
  $id: Gy,
  $vocabulary: Hy,
  $dynamicAnchor: By,
  title: Wy,
  allOf: Xy,
  type: Jy,
  $comment: Yy,
  properties: Qy
}, xy = "https://json-schema.org/draft/2020-12/schema", e0 = "https://json-schema.org/draft/2020-12/meta/applicator", t0 = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, r0 = "meta", n0 = "Applicator vocabulary meta-schema", s0 = [
  "object",
  "boolean"
], a0 = {
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
}, o0 = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, i0 = {
  $schema: xy,
  $id: e0,
  $vocabulary: t0,
  $dynamicAnchor: r0,
  title: n0,
  type: s0,
  properties: a0,
  $defs: o0
}, c0 = "https://json-schema.org/draft/2020-12/schema", l0 = "https://json-schema.org/draft/2020-12/meta/unevaluated", u0 = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, d0 = "meta", f0 = "Unevaluated applicator vocabulary meta-schema", h0 = [
  "object",
  "boolean"
], m0 = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, p0 = {
  $schema: c0,
  $id: l0,
  $vocabulary: u0,
  $dynamicAnchor: d0,
  title: f0,
  type: h0,
  properties: m0
}, $0 = "https://json-schema.org/draft/2020-12/schema", y0 = "https://json-schema.org/draft/2020-12/meta/content", g0 = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, _0 = "meta", v0 = "Content vocabulary meta-schema", w0 = [
  "object",
  "boolean"
], E0 = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, b0 = {
  $schema: $0,
  $id: y0,
  $vocabulary: g0,
  $dynamicAnchor: _0,
  title: v0,
  type: w0,
  properties: E0
}, S0 = "https://json-schema.org/draft/2020-12/schema", P0 = "https://json-schema.org/draft/2020-12/meta/core", N0 = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, R0 = "meta", O0 = "Core vocabulary meta-schema", T0 = [
  "object",
  "boolean"
], I0 = {
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
}, j0 = {
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
}, k0 = {
  $schema: S0,
  $id: P0,
  $vocabulary: N0,
  $dynamicAnchor: R0,
  title: O0,
  type: T0,
  properties: I0,
  $defs: j0
}, A0 = "https://json-schema.org/draft/2020-12/schema", C0 = "https://json-schema.org/draft/2020-12/meta/format-annotation", D0 = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, M0 = "meta", L0 = "Format vocabulary meta-schema for annotation results", V0 = [
  "object",
  "boolean"
], F0 = {
  format: {
    type: "string"
  }
}, z0 = {
  $schema: A0,
  $id: C0,
  $vocabulary: D0,
  $dynamicAnchor: M0,
  title: L0,
  type: V0,
  properties: F0
}, U0 = "https://json-schema.org/draft/2020-12/schema", q0 = "https://json-schema.org/draft/2020-12/meta/meta-data", K0 = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, G0 = "meta", H0 = "Meta-data vocabulary meta-schema", B0 = [
  "object",
  "boolean"
], W0 = {
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
}, X0 = {
  $schema: U0,
  $id: q0,
  $vocabulary: K0,
  $dynamicAnchor: G0,
  title: H0,
  type: B0,
  properties: W0
}, J0 = "https://json-schema.org/draft/2020-12/schema", Y0 = "https://json-schema.org/draft/2020-12/meta/validation", Q0 = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, Z0 = "meta", x0 = "Validation vocabulary meta-schema", eg = [
  "object",
  "boolean"
], tg = {
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
}, rg = {
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
}, ng = {
  $schema: J0,
  $id: Y0,
  $vocabulary: Q0,
  $dynamicAnchor: Z0,
  title: x0,
  type: eg,
  properties: tg,
  $defs: rg
};
Object.defineProperty(Vo, "__esModule", { value: !0 });
const sg = Zy, ag = i0, og = p0, ig = b0, cg = k0, lg = z0, ug = X0, dg = ng, fg = ["/properties"];
function hg(e) {
  return [
    sg,
    ag,
    og,
    ig,
    cg,
    t(this, lg),
    ug,
    t(this, dg)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, fg) : n;
  }
}
Vo.default = hg;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = bl, n = Ya, s = Lo, a = Vo, o = "https://json-schema.org/draft/2020-12/schema";
  class u extends r.default {
    constructor(g = {}) {
      super({
        ...g,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((g) => this.addVocabulary(g)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: g, meta: w } = this.opts;
      w && (a.default.call(this, g), this.refs["http://json-schema.org/schema"] = o);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
    }
  }
  t.Ajv2020 = u, e.exports = t = u, e.exports.Ajv2020 = u, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = u;
  var c = nt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var d = Z;
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
  var l = On;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return l.default;
  } });
  var h = Br;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(ha, ha.exports);
var mg = ha.exports, wa = { exports: {} }, Nu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(F, G) {
    return { validate: F, compare: G };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(a, o),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(c(!0), d),
    "date-time": t(E(!0), g),
    "iso-time": t(c(), l),
    "iso-date-time": t(E(), w),
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
    regex: $e,
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
    byte: N,
    // signed 32 bit integer
    int32: { type: "number", validate: K },
    // signed 64 bit integer
    int64: { type: "number", validate: X },
    // C-type float
    float: { type: "number", validate: de },
    // C-type double
    double: { type: "number", validate: de },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, o),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, d),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, g),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, l),
    "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, w),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(F) {
    return F % 4 === 0 && (F % 100 !== 0 || F % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function a(F) {
    const G = n.exec(F);
    if (!G)
      return !1;
    const ae = +G[1], H = +G[2], ce = +G[3];
    return H >= 1 && H <= 12 && ce >= 1 && ce <= (H === 2 && r(ae) ? 29 : s[H]);
  }
  function o(F, G) {
    if (F && G)
      return F > G ? 1 : F < G ? -1 : 0;
  }
  const u = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(F) {
    return function(ae) {
      const H = u.exec(ae);
      if (!H)
        return !1;
      const ce = +H[1], A = +H[2], j = +H[3], z = H[4], M = H[5] === "-" ? -1 : 1, P = +(H[6] || 0), p = +(H[7] || 0);
      if (P > 23 || p > 59 || F && !z)
        return !1;
      if (ce <= 23 && A <= 59 && j < 60)
        return !0;
      const S = A - p * M, $ = ce - P * M - (S < 0 ? 1 : 0);
      return ($ === 23 || $ === -1) && (S === 59 || S === -1) && j < 61;
    };
  }
  function d(F, G) {
    if (!(F && G))
      return;
    const ae = (/* @__PURE__ */ new Date("2020-01-01T" + F)).valueOf(), H = (/* @__PURE__ */ new Date("2020-01-01T" + G)).valueOf();
    if (ae && H)
      return ae - H;
  }
  function l(F, G) {
    if (!(F && G))
      return;
    const ae = u.exec(F), H = u.exec(G);
    if (ae && H)
      return F = ae[1] + ae[2] + ae[3], G = H[1] + H[2] + H[3], F > G ? 1 : F < G ? -1 : 0;
  }
  const h = /t|\s/i;
  function E(F) {
    const G = c(F);
    return function(H) {
      const ce = H.split(h);
      return ce.length === 2 && a(ce[0]) && G(ce[1]);
    };
  }
  function g(F, G) {
    if (!(F && G))
      return;
    const ae = new Date(F).valueOf(), H = new Date(G).valueOf();
    if (ae && H)
      return ae - H;
  }
  function w(F, G) {
    if (!(F && G))
      return;
    const [ae, H] = F.split(h), [ce, A] = G.split(h), j = o(ae, ce);
    if (j !== void 0)
      return j || d(H, A);
  }
  const _ = /\/|:/, y = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(F) {
    return _.test(F) && y.test(F);
  }
  const v = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function N(F) {
    return v.lastIndex = 0, v.test(F);
  }
  const R = -2147483648, O = 2 ** 31 - 1;
  function K(F) {
    return Number.isInteger(F) && F <= O && F >= R;
  }
  function X(F) {
    return Number.isInteger(F);
  }
  function de() {
    return !0;
  }
  const he = /[^\\]\\Z/;
  function $e(F) {
    if (he.test(F))
      return !1;
    try {
      return new RegExp(F), !0;
    } catch {
      return !1;
    }
  }
})(Nu);
var Ru = {}, Ea = { exports: {} }, Ou = {}, st = {}, Gr = {}, In = {}, te = {}, Pn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(v) {
      if (super(), !e.IDENTIFIER.test(v))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = v;
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
    constructor(v) {
      super(), this._items = typeof v == "string" ? [v] : v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const v = this._items[0];
      return v === "" || v === '""';
    }
    get str() {
      var v;
      return (v = this._str) !== null && v !== void 0 ? v : this._str = this._items.reduce((N, R) => `${N}${R}`, "");
    }
    get names() {
      var v;
      return (v = this._names) !== null && v !== void 0 ? v : this._names = this._items.reduce((N, R) => (R instanceof r && (N[R.str] = (N[R.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...v) {
    const N = [m[0]];
    let R = 0;
    for (; R < v.length; )
      u(N, v[R]), N.push(m[++R]);
    return new n(N);
  }
  e._ = s;
  const a = new n("+");
  function o(m, ...v) {
    const N = [g(m[0])];
    let R = 0;
    for (; R < v.length; )
      N.push(a), u(N, v[R]), N.push(a, g(m[++R]));
    return c(N), new n(N);
  }
  e.str = o;
  function u(m, v) {
    v instanceof n ? m.push(...v._items) : v instanceof r ? m.push(v) : m.push(h(v));
  }
  e.addCodeArg = u;
  function c(m) {
    let v = 1;
    for (; v < m.length - 1; ) {
      if (m[v] === a) {
        const N = d(m[v - 1], m[v + 1]);
        if (N !== void 0) {
          m.splice(v - 1, 3, N);
          continue;
        }
        m[v++] = "+";
      }
      v++;
    }
  }
  function d(m, v) {
    if (v === '""')
      return m;
    if (m === '""')
      return v;
    if (typeof m == "string")
      return v instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof v != "string" ? `${m.slice(0, -1)}${v}"` : v[0] === '"' ? m.slice(0, -1) + v.slice(1) : void 0;
    if (typeof v == "string" && v[0] === '"' && !(m instanceof r))
      return `"${m}${v.slice(1)}`;
  }
  function l(m, v) {
    return v.emptyStr() ? m : m.emptyStr() ? v : o`${m}${v}`;
  }
  e.strConcat = l;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : g(Array.isArray(m) ? m.join(",") : m);
  }
  function E(m) {
    return new n(g(m));
  }
  e.stringify = E;
  function g(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = g;
  function w(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = w;
  function _(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = _;
  function y(m) {
    return new n(m.toString());
  }
  e.regexpCode = y;
})(Pn);
var ba = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = Pn;
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
    constructor({ prefixes: d, parent: l } = {}) {
      this._names = {}, this._prefixes = d, this._parent = l;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const l = this._names[d] || this._nameGroup(d);
      return `${d}${l.index++}`;
    }
    _nameGroup(d) {
      var l, h;
      if (!((h = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(d, l) {
      super(l), this.prefix = d;
    }
    setValue(d, { property: l, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(l)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const o = (0, t._)`\n`;
  class u extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
    }
    value(d, l) {
      var h;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const E = this.toName(d), { prefix: g } = E, w = (h = l.key) !== null && h !== void 0 ? h : l.ref;
      let _ = this._values[g];
      if (_) {
        const v = _.get(w);
        if (v)
          return v;
      } else
        _ = this._values[g] = /* @__PURE__ */ new Map();
      _.set(w, E);
      const y = this._scope[g] || (this._scope[g] = []), m = y.length;
      return y[m] = l.ref, E.setValue(l, { property: g, itemIndex: m }), E;
    }
    getValue(d, l) {
      const h = this._values[d];
      if (h)
        return h.get(l);
    }
    scopeRefs(d, l = this._values) {
      return this._reduceValues(l, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, l, h) {
      return this._reduceValues(d, (E) => {
        if (E.value === void 0)
          throw new Error(`CodeGen: name "${E}" has no value`);
        return E.value.code;
      }, l, h);
    }
    _reduceValues(d, l, h = {}, E) {
      let g = t.nil;
      for (const w in d) {
        const _ = d[w];
        if (!_)
          continue;
        const y = h[w] = h[w] || /* @__PURE__ */ new Map();
        _.forEach((m) => {
          if (y.has(m))
            return;
          y.set(m, n.Started);
          let v = l(m);
          if (v) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            g = (0, t._)`${g}${N} ${m} = ${v};${this.opts._n}`;
          } else if (v = E == null ? void 0 : E(m))
            g = (0, t._)`${g}${v}${this.opts._n}`;
          else
            throw new r(m);
          y.set(m, n.Completed);
        });
      }
      return g;
    }
  }
  e.ValueScope = u;
})(ba);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Pn, r = ba;
  var n = Pn;
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
  var s = ba;
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
      const b = i ? r.varKinds.var : this.varKind, T = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${b} ${this.name}${T};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = H(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class u extends a {
    constructor(i, f, b) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = b;
    }
    render({ _n: i }) {
      return `${this.lhs} = ${this.rhs};` + i;
    }
    optimizeNames(i, f) {
      if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
        return this.rhs = H(this.rhs, i, f), this;
    }
    get names() {
      const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return ae(i, this.rhs);
    }
  }
  class c extends u {
    constructor(i, f, b, T) {
      super(i, b, T), this.op = f;
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
  class l extends a {
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
  class E extends a {
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
      return this.code = H(this.code, i, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class g extends a {
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
      let T = b.length;
      for (; T--; ) {
        const I = b[T];
        I.optimizeNames(i, f) || (ce(i, I.names), b.splice(T, 1));
      }
      return b.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => G(i, f.names), {});
    }
  }
  class w extends g {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class _ extends g {
  }
  class y extends w {
  }
  y.kind = "else";
  class m extends w {
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
        f = this.else = Array.isArray(b) ? new y(b) : b;
      }
      if (f)
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(A(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var b;
      if (this.else = (b = this.else) === null || b === void 0 ? void 0 : b.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = H(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return ae(i, this.condition), this.else && G(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class v extends w {
  }
  v.kind = "for";
  class N extends v {
    constructor(i) {
      super(), this.iteration = i;
    }
    render(i) {
      return `for(${this.iteration})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iteration = H(this.iteration, i, f), this;
    }
    get names() {
      return G(super.names, this.iteration.names);
    }
  }
  class R extends v {
    constructor(i, f, b, T) {
      super(), this.varKind = i, this.name = f, this.from = b, this.to = T;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: b, from: T, to: I } = this;
      return `for(${f} ${b}=${T}; ${b}<${I}; ${b}++)` + super.render(i);
    }
    get names() {
      const i = ae(super.names, this.from);
      return ae(i, this.to);
    }
  }
  class O extends v {
    constructor(i, f, b, T) {
      super(), this.loop = i, this.varKind = f, this.name = b, this.iterable = T;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = H(this.iterable, i, f), this;
    }
    get names() {
      return G(super.names, this.iterable.names);
    }
  }
  class K extends w {
    constructor(i, f, b) {
      super(), this.name = i, this.args = f, this.async = b;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  K.kind = "func";
  class X extends g {
    render(i) {
      return "return " + super.render(i);
    }
  }
  X.kind = "return";
  class de extends w {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var b, T;
      return super.optimizeNames(i, f), (b = this.catch) === null || b === void 0 || b.optimizeNames(i, f), (T = this.finally) === null || T === void 0 || T.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && G(i, this.catch.names), this.finally && G(i, this.finally.names), i;
    }
  }
  class he extends w {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  he.kind = "catch";
  class $e extends w {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  $e.kind = "finally";
  class F {
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
    _def(i, f, b, T) {
      const I = this._scope.toName(f);
      return b !== void 0 && T && (this._constants[I.str] = b), this._leafNode(new o(i, I, b)), I;
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
      return this._leafNode(new u(i, f, b));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new c(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new E(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [b, T] of i)
        f.length > 1 && f.push(","), f.push(b), (b !== T || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, T));
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
      return this._elseNode(new y());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, y);
    }
    _for(i, f) {
      return this._blockNode(i), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(i, f) {
      return this._for(new N(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, b, T, I = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const V = this._scope.toName(i);
      return this._for(new R(I, V, f, b), () => T(V));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, T = r.varKinds.const) {
      const I = this._scope.toName(i);
      if (this.opts.es5) {
        const V = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${V}.length`, (L) => {
          this.var(I, (0, t._)`${V}[${L}]`), b(I);
        });
      }
      return this._for(new O("of", T, I, f), () => b(I));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, b, T = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, b);
      const I = this._scope.toName(i);
      return this._for(new O("in", T, I, f), () => b(I));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(v);
    }
    // `label` statement
    label(i) {
      return this._leafNode(new d(i));
    }
    // `break` statement
    break(i) {
      return this._leafNode(new l(i));
    }
    // `return` statement
    return(i) {
      const f = new X();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(X);
    }
    // `try` statement
    try(i, f, b) {
      if (!f && !b)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const T = new de();
      if (this._blockNode(T), this.code(i), f) {
        const I = this.name("e");
        this._currNode = T.catch = new he(I), f(I);
      }
      return b && (this._currNode = T.finally = new $e(), this.code(b)), this._endBlockNode(he, $e);
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
    func(i, f = t.nil, b, T) {
      return this._blockNode(new K(i, f, b)), T && this.code(T).endFunc(), this;
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
  e.CodeGen = F;
  function G($, i) {
    for (const f in i)
      $[f] = ($[f] || 0) + (i[f] || 0);
    return $;
  }
  function ae($, i) {
    return i instanceof t._CodeOrName ? G($, i.names) : $;
  }
  function H($, i, f) {
    if ($ instanceof t.Name)
      return b($);
    if (!T($))
      return $;
    return new t._Code($._items.reduce((I, V) => (V instanceof t.Name && (V = b(V)), V instanceof t._Code ? I.push(...V._items) : I.push(V), I), []));
    function b(I) {
      const V = f[I.str];
      return V === void 0 || i[I.str] !== 1 ? I : (delete i[I.str], V);
    }
    function T(I) {
      return I instanceof t._Code && I._items.some((V) => V instanceof t.Name && i[V.str] === 1 && f[V.str] !== void 0);
    }
  }
  function ce($, i) {
    for (const f in i)
      $[f] = ($[f] || 0) - (i[f] || 0);
  }
  function A($) {
    return typeof $ == "boolean" || typeof $ == "number" || $ === null ? !$ : (0, t._)`!${S($)}`;
  }
  e.not = A;
  const j = p(e.operators.AND);
  function z(...$) {
    return $.reduce(j);
  }
  e.and = z;
  const M = p(e.operators.OR);
  function P(...$) {
    return $.reduce(M);
  }
  e.or = P;
  function p($) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${S(i)} ${$} ${S(f)}`;
  }
  function S($) {
    return $ instanceof t.Name ? $ : (0, t._)`(${$})`;
  }
})(te);
var D = {};
Object.defineProperty(D, "__esModule", { value: !0 });
D.checkStrictMode = D.getErrorPath = D.Type = D.useFunc = D.setEvaluated = D.evaluatedPropsToName = D.mergeEvaluated = D.eachItem = D.unescapeJsonPointer = D.escapeJsonPointer = D.escapeFragment = D.unescapeFragment = D.schemaRefOrVal = D.schemaHasRulesButRef = D.schemaHasRules = D.checkUnknownRules = D.alwaysValidSchema = D.toHash = void 0;
const ie = te, pg = Pn;
function $g(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
D.toHash = $g;
function yg(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Tu(e, t), !Iu(t, e.self.RULES.all));
}
D.alwaysValidSchema = yg;
function Tu(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || Au(e, `unknown keyword: "${a}"`);
}
D.checkUnknownRules = Tu;
function Iu(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
D.schemaHasRules = Iu;
function gg(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
D.schemaHasRulesButRef = gg;
function _g({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ie._)`${r}`;
  }
  return (0, ie._)`${e}${t}${(0, ie.getProperty)(n)}`;
}
D.schemaRefOrVal = _g;
function vg(e) {
  return ju(decodeURIComponent(e));
}
D.unescapeFragment = vg;
function wg(e) {
  return encodeURIComponent(Fo(e));
}
D.escapeFragment = wg;
function Fo(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
D.escapeJsonPointer = Fo;
function ju(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
D.unescapeJsonPointer = ju;
function Eg(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
D.eachItem = Eg;
function vc({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, u) => {
    const c = o === void 0 ? a : o instanceof ie.Name ? (a instanceof ie.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof ie.Name ? (t(s, o, a), a) : r(a, o);
    return u === ie.Name && !(c instanceof ie.Name) ? n(s, c) : c;
  };
}
D.mergeEvaluated = {
  props: vc({
    mergeNames: (e, t, r) => e.if((0, ie._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ie._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ie._)`${r} || {}`).code((0, ie._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ie._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ie._)`${r} || {}`), zo(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: ku
  }),
  items: vc({
    mergeNames: (e, t, r) => e.if((0, ie._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ie._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ie._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ie._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function ku(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ie._)`{}`);
  return t !== void 0 && zo(e, r, t), r;
}
D.evaluatedPropsToName = ku;
function zo(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ie._)`${t}${(0, ie.getProperty)(n)}`, !0));
}
D.setEvaluated = zo;
const wc = {};
function bg(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: wc[t.code] || (wc[t.code] = new pg._Code(t.code))
  });
}
D.useFunc = bg;
var Sa;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Sa || (D.Type = Sa = {}));
function Sg(e, t, r) {
  if (e instanceof ie.Name) {
    const n = t === Sa.Num;
    return r ? n ? (0, ie._)`"[" + ${e} + "]"` : (0, ie._)`"['" + ${e} + "']"` : n ? (0, ie._)`"/" + ${e}` : (0, ie._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ie.getProperty)(e).toString() : "/" + Fo(e);
}
D.getErrorPath = Sg;
function Au(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
D.checkStrictMode = Au;
var mt = {};
Object.defineProperty(mt, "__esModule", { value: !0 });
const Re = te, Pg = {
  // validation function arguments
  data: new Re.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Re.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Re.Name("instancePath"),
  parentData: new Re.Name("parentData"),
  parentDataProperty: new Re.Name("parentDataProperty"),
  rootData: new Re.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Re.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Re.Name("vErrors"),
  // null or array of validation errors
  errors: new Re.Name("errors"),
  // counter of validation errors
  this: new Re.Name("this"),
  // "globals"
  self: new Re.Name("self"),
  scope: new Re.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Re.Name("json"),
  jsonPos: new Re.Name("jsonPos"),
  jsonLen: new Re.Name("jsonLen"),
  jsonPart: new Re.Name("jsonPart")
};
mt.default = Pg;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = te, r = D, n = mt;
  e.keywordError = {
    message: ({ keyword: y }) => (0, t.str)`must pass "${y}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: y, schemaType: m }) => m ? (0, t.str)`"${y}" keyword must be ${m} ($data)` : (0, t.str)`"${y}" keyword is invalid ($data)`
  };
  function s(y, m = e.keywordError, v, N) {
    const { it: R } = y, { gen: O, compositeRule: K, allErrors: X } = R, de = h(y, m, v);
    N ?? (K || X) ? c(O, de) : d(R, (0, t._)`[${de}]`);
  }
  e.reportError = s;
  function a(y, m = e.keywordError, v) {
    const { it: N } = y, { gen: R, compositeRule: O, allErrors: K } = N, X = h(y, m, v);
    c(R, X), O || K || d(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o(y, m) {
    y.assign(n.default.errors, m), y.if((0, t._)`${n.default.vErrors} !== null`, () => y.if(m, () => y.assign((0, t._)`${n.default.vErrors}.length`, m), () => y.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function u({ gen: y, keyword: m, schemaValue: v, data: N, errsCount: R, it: O }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const K = y.name("err");
    y.forRange("i", R, n.default.errors, (X) => {
      y.const(K, (0, t._)`${n.default.vErrors}[${X}]`), y.if((0, t._)`${K}.instancePath === undefined`, () => y.assign((0, t._)`${K}.instancePath`, (0, t.strConcat)(n.default.instancePath, O.errorPath))), y.assign((0, t._)`${K}.schemaPath`, (0, t.str)`${O.errSchemaPath}/${m}`), O.opts.verbose && (y.assign((0, t._)`${K}.schema`, v), y.assign((0, t._)`${K}.data`, N));
    });
  }
  e.extendErrors = u;
  function c(y, m) {
    const v = y.const("err", m);
    y.if((0, t._)`${n.default.vErrors} === null`, () => y.assign(n.default.vErrors, (0, t._)`[${v}]`), (0, t._)`${n.default.vErrors}.push(${v})`), y.code((0, t._)`${n.default.errors}++`);
  }
  function d(y, m) {
    const { gen: v, validateName: N, schemaEnv: R } = y;
    R.$async ? v.throw((0, t._)`new ${y.ValidationError}(${m})`) : (v.assign((0, t._)`${N}.errors`, m), v.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h(y, m, v) {
    const { createErrors: N } = y.it;
    return N === !1 ? (0, t._)`{}` : E(y, m, v);
  }
  function E(y, m, v = {}) {
    const { gen: N, it: R } = y, O = [
      g(R, v),
      w(y, v)
    ];
    return _(y, m, O), N.object(...O);
  }
  function g({ errorPath: y }, { instancePath: m }) {
    const v = m ? (0, t.str)`${y}${(0, r.getErrorPath)(m, r.Type.Str)}` : y;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, v)];
  }
  function w({ keyword: y, it: { errSchemaPath: m } }, { schemaPath: v, parentSchema: N }) {
    let R = N ? m : (0, t.str)`${m}/${y}`;
    return v && (R = (0, t.str)`${R}${(0, r.getErrorPath)(v, r.Type.Str)}`), [l.schemaPath, R];
  }
  function _(y, { params: m, message: v }, N) {
    const { keyword: R, data: O, schemaValue: K, it: X } = y, { opts: de, propertyName: he, topSchemaRef: $e, schemaPath: F } = X;
    N.push([l.keyword, R], [l.params, typeof m == "function" ? m(y) : m || (0, t._)`{}`]), de.messages && N.push([l.message, typeof v == "function" ? v(y) : v]), de.verbose && N.push([l.schema, K], [l.parentSchema, (0, t._)`${$e}${F}`], [n.default.data, O]), he && N.push([l.propertyName, he]);
  }
})(In);
Object.defineProperty(Gr, "__esModule", { value: !0 });
Gr.boolOrEmptySchema = Gr.topBoolOrEmptySchema = void 0;
const Ng = In, Rg = te, Og = mt, Tg = {
  message: "boolean schema is false"
};
function Ig(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Cu(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Og.default.data) : (t.assign((0, Rg._)`${n}.errors`, null), t.return(!0));
}
Gr.topBoolOrEmptySchema = Ig;
function jg(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Cu(e)) : r.var(t, !0);
}
Gr.boolOrEmptySchema = jg;
function Cu(e, t) {
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
  (0, Ng.reportError)(s, Tg, void 0, t);
}
var ge = {}, gr = {};
Object.defineProperty(gr, "__esModule", { value: !0 });
gr.getRules = gr.isJSONType = void 0;
const kg = ["string", "number", "integer", "boolean", "null", "object", "array"], Ag = new Set(kg);
function Cg(e) {
  return typeof e == "string" && Ag.has(e);
}
gr.isJSONType = Cg;
function Dg() {
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
gr.getRules = Dg;
var wt = {};
Object.defineProperty(wt, "__esModule", { value: !0 });
wt.shouldUseRule = wt.shouldUseGroup = wt.schemaHasRulesForType = void 0;
function Mg({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Du(e, n);
}
wt.schemaHasRulesForType = Mg;
function Du(e, t) {
  return t.rules.some((r) => Mu(e, r));
}
wt.shouldUseGroup = Du;
function Mu(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
wt.shouldUseRule = Mu;
Object.defineProperty(ge, "__esModule", { value: !0 });
ge.reportTypeError = ge.checkDataTypes = ge.checkDataType = ge.coerceAndCheckDataType = ge.getJSONTypes = ge.getSchemaTypes = ge.DataType = void 0;
const Lg = gr, Vg = wt, Fg = In, ee = te, Lu = D;
var Lr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Lr || (ge.DataType = Lr = {}));
function zg(e) {
  const t = Vu(e.type);
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
ge.getSchemaTypes = zg;
function Vu(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(Lg.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ge.getJSONTypes = Vu;
function Ug(e, t) {
  const { gen: r, data: n, opts: s } = e, a = qg(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, Vg.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const u = Uo(t, n, s.strictNumbers, Lr.Wrong);
    r.if(u, () => {
      a.length ? Kg(e, t, a) : qo(e);
    });
  }
  return o;
}
ge.coerceAndCheckDataType = Ug;
const Fu = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function qg(e, t) {
  return t ? e.filter((r) => Fu.has(r) || t === "array" && r === "array") : [];
}
function Kg(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, ee._)`typeof ${s}`), u = n.let("coerced", (0, ee._)`undefined`);
  a.coerceTypes === "array" && n.if((0, ee._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, ee._)`${s}[0]`).assign(o, (0, ee._)`typeof ${s}`).if(Uo(t, s, a.strictNumbers), () => n.assign(u, s))), n.if((0, ee._)`${u} !== undefined`);
  for (const d of r)
    (Fu.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), qo(e), n.endIf(), n.if((0, ee._)`${u} !== undefined`, () => {
    n.assign(s, u), Gg(e, u);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, ee._)`${o} == "number" || ${o} == "boolean"`).assign(u, (0, ee._)`"" + ${s}`).elseIf((0, ee._)`${s} === null`).assign(u, (0, ee._)`""`);
        return;
      case "number":
        n.elseIf((0, ee._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(u, (0, ee._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, ee._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(u, (0, ee._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, ee._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(u, !1).elseIf((0, ee._)`${s} === "true" || ${s} === 1`).assign(u, !0);
        return;
      case "null":
        n.elseIf((0, ee._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(u, null);
        return;
      case "array":
        n.elseIf((0, ee._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(u, (0, ee._)`[${s}]`);
    }
  }
}
function Gg({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, ee._)`${t} !== undefined`, () => e.assign((0, ee._)`${t}[${r}]`, n));
}
function Pa(e, t, r, n = Lr.Correct) {
  const s = n === Lr.Correct ? ee.operators.EQ : ee.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, ee._)`${t} ${s} null`;
    case "array":
      a = (0, ee._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, ee._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, ee._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, ee._)`typeof ${t} ${s} ${e}`;
  }
  return n === Lr.Correct ? a : (0, ee.not)(a);
  function o(u = ee.nil) {
    return (0, ee.and)((0, ee._)`typeof ${t} == "number"`, u, r ? (0, ee._)`isFinite(${t})` : ee.nil);
  }
}
ge.checkDataType = Pa;
function Uo(e, t, r, n) {
  if (e.length === 1)
    return Pa(e[0], t, r, n);
  let s;
  const a = (0, Lu.toHash)(e);
  if (a.array && a.object) {
    const o = (0, ee._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, ee._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = ee.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, ee.and)(s, Pa(o, t, r, n));
  return s;
}
ge.checkDataTypes = Uo;
const Hg = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, ee._)`{type: ${e}}` : (0, ee._)`{type: ${t}}`
};
function qo(e) {
  const t = Bg(e);
  (0, Fg.reportError)(t, Hg);
}
ge.reportTypeError = qo;
function Bg(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Lu.schemaRefOrVal)(e, n, "type");
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
var Is = {};
Object.defineProperty(Is, "__esModule", { value: !0 });
Is.assignDefaults = void 0;
const br = te, Wg = D;
function Xg(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Ec(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => Ec(e, a, s.default));
}
Is.assignDefaults = Xg;
function Ec(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const u = (0, br._)`${a}${(0, br.getProperty)(t)}`;
  if (s) {
    (0, Wg.checkStrictMode)(e, `default is ignored for: ${u}`);
    return;
  }
  let c = (0, br._)`${u} === undefined`;
  o.useDefaults === "empty" && (c = (0, br._)`${c} || ${u} === null || ${u} === ""`), n.if(c, (0, br._)`${u} = ${(0, br.stringify)(r)}`);
}
var ht = {}, ne = {};
Object.defineProperty(ne, "__esModule", { value: !0 });
ne.validateUnion = ne.validateArray = ne.usePattern = ne.callValidateCode = ne.schemaProperties = ne.allSchemaProperties = ne.noPropertyInData = ne.propertyInData = ne.isOwnProperty = ne.hasPropFunc = ne.reportMissingProp = ne.checkMissingProp = ne.checkReportMissingProp = void 0;
const ue = te, Ko = D, Tt = mt, Jg = D;
function Yg(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Ho(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, ue._)`${t}` }, !0), e.error();
  });
}
ne.checkReportMissingProp = Yg;
function Qg({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, ue.or)(...n.map((a) => (0, ue.and)(Ho(e, t, a, r.ownProperties), (0, ue._)`${s} = ${a}`)));
}
ne.checkMissingProp = Qg;
function Zg(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ne.reportMissingProp = Zg;
function zu(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ue._)`Object.prototype.hasOwnProperty`
  });
}
ne.hasPropFunc = zu;
function Go(e, t, r) {
  return (0, ue._)`${zu(e)}.call(${t}, ${r})`;
}
ne.isOwnProperty = Go;
function xg(e, t, r, n) {
  const s = (0, ue._)`${t}${(0, ue.getProperty)(r)} !== undefined`;
  return n ? (0, ue._)`${s} && ${Go(e, t, r)}` : s;
}
ne.propertyInData = xg;
function Ho(e, t, r, n) {
  const s = (0, ue._)`${t}${(0, ue.getProperty)(r)} === undefined`;
  return n ? (0, ue.or)(s, (0, ue.not)(Go(e, t, r))) : s;
}
ne.noPropertyInData = Ho;
function Uu(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ne.allSchemaProperties = Uu;
function e_(e, t) {
  return Uu(t).filter((r) => !(0, Ko.alwaysValidSchema)(e, t[r]));
}
ne.schemaProperties = e_;
function t_({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, u, c, d) {
  const l = d ? (0, ue._)`${e}, ${t}, ${n}${s}` : t, h = [
    [Tt.default.instancePath, (0, ue.strConcat)(Tt.default.instancePath, a)],
    [Tt.default.parentData, o.parentData],
    [Tt.default.parentDataProperty, o.parentDataProperty],
    [Tt.default.rootData, Tt.default.rootData]
  ];
  o.opts.dynamicRef && h.push([Tt.default.dynamicAnchors, Tt.default.dynamicAnchors]);
  const E = (0, ue._)`${l}, ${r.object(...h)}`;
  return c !== ue.nil ? (0, ue._)`${u}.call(${c}, ${E})` : (0, ue._)`${u}(${E})`;
}
ne.callValidateCode = t_;
const r_ = (0, ue._)`new RegExp`;
function n_({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, ue._)`${s.code === "new RegExp" ? r_ : (0, Jg.useFunc)(e, s)}(${r}, ${n})`
  });
}
ne.usePattern = n_;
function s_(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const u = t.let("valid", !0);
    return o(() => t.assign(u, !1)), u;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(u) {
    const c = t.const("len", (0, ue._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: Ko.Type.Num
      }, a), t.if((0, ue.not)(a), u);
    });
  }
}
ne.validateArray = s_;
function a_(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, Ko.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), u = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, u);
    t.assign(o, (0, ue._)`${o} || ${u}`), e.mergeValidEvaluated(l, u) || t.if((0, ue.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
ne.validateUnion = a_;
Object.defineProperty(ht, "__esModule", { value: !0 });
ht.validateKeywordUsage = ht.validSchemaType = ht.funcKeywordCode = ht.macroKeywordCode = void 0;
const Ae = te, ir = mt, o_ = ne, i_ = In;
function c_(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, u = t.macro.call(o.self, s, a, o), c = qu(r, n, u);
  o.opts.validateSchema !== !1 && o.self.validateSchema(u, !0);
  const d = r.name("valid");
  e.subschema({
    schema: u,
    schemaPath: Ae.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
ht.macroKeywordCode = c_;
function l_(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: u, it: c } = e;
  d_(c, t);
  const d = !u && t.compile ? t.compile.call(c.self, a, o, c) : t.validate, l = qu(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      _(), t.modifying && bc(e), y(() => e.error());
    else {
      const m = t.async ? g() : w();
      t.modifying && bc(e), y(() => u_(e, m));
    }
  }
  function g() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, Ae._)`await `), (v) => n.assign(h, !1).if((0, Ae._)`${v} instanceof ${c.ValidationError}`, () => n.assign(m, (0, Ae._)`${v}.errors`), () => n.throw(v))), m;
  }
  function w() {
    const m = (0, Ae._)`${l}.errors`;
    return n.assign(m, null), _(Ae.nil), m;
  }
  function _(m = t.async ? (0, Ae._)`await ` : Ae.nil) {
    const v = c.opts.passContext ? ir.default.this : ir.default.self, N = !("compile" in t && !u || t.schema === !1);
    n.assign(h, (0, Ae._)`${m}${(0, o_.callValidateCode)(e, l, v, N)}`, t.modifying);
  }
  function y(m) {
    var v;
    n.if((0, Ae.not)((v = t.valid) !== null && v !== void 0 ? v : h), m);
  }
}
ht.funcKeywordCode = l_;
function bc(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Ae._)`${n.parentData}[${n.parentDataProperty}]`));
}
function u_(e, t) {
  const { gen: r } = e;
  r.if((0, Ae._)`Array.isArray(${t})`, () => {
    r.assign(ir.default.vErrors, (0, Ae._)`${ir.default.vErrors} === null ? ${t} : ${ir.default.vErrors}.concat(${t})`).assign(ir.default.errors, (0, Ae._)`${ir.default.vErrors}.length`), (0, i_.extendErrors)(e);
  }, () => e.error());
}
function d_({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function qu(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Ae.stringify)(r) });
}
function f_(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
ht.validSchemaType = f_;
function h_({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((u) => !Object.prototype.hasOwnProperty.call(e, u)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
ht.validateKeywordUsage = h_;
var zt = {};
Object.defineProperty(zt, "__esModule", { value: !0 });
zt.extendSubschemaMode = zt.extendSubschemaData = zt.getSubschema = void 0;
const dt = te, Ku = D;
function m_(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const u = e.schema[t];
    return r === void 0 ? {
      schema: u,
      schemaPath: (0, dt._)`${e.schemaPath}${(0, dt.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: u[r],
      schemaPath: (0, dt._)`${e.schemaPath}${(0, dt.getProperty)(t)}${(0, dt.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Ku.escapeFragment)(r)}`
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
zt.getSubschema = m_;
function p_(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: u } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: l, opts: h } = t, E = u.let("data", (0, dt._)`${t.data}${(0, dt.getProperty)(r)}`, !0);
    c(E), e.errorPath = (0, dt.str)`${d}${(0, Ku.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, dt._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof dt.Name ? s : u.let("data", s, !0);
    c(d), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
zt.extendSubschemaData = p_;
function $_(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
zt.extendSubschemaMode = $_;
var be = {}, Gu = { exports: {} }, Vt = Gu.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  os(t, n, s, e, "", e);
};
Vt.keywords = {
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
Vt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Vt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Vt.skipKeywords = {
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
function os(e, t, r, n, s, a, o, u, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, u, c, d);
    for (var l in n) {
      var h = n[l];
      if (Array.isArray(h)) {
        if (l in Vt.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            os(e, t, r, h[E], s + "/" + l + "/" + E, a, s, l, n, E);
      } else if (l in Vt.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            os(e, t, r, h[g], s + "/" + l + "/" + y_(g), a, s, l, n, g);
      } else (l in Vt.keywords || e.allKeys && !(l in Vt.skipKeywords)) && os(e, t, r, h, s + "/" + l, a, s, l, n);
    }
    r(n, s, a, o, u, c, d);
  }
}
function y_(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var g_ = Gu.exports;
Object.defineProperty(be, "__esModule", { value: !0 });
be.getSchemaRefs = be.resolveUrl = be.normalizeId = be._getFullPath = be.getFullPath = be.inlineRef = void 0;
const __ = D, v_ = bs, w_ = g_, E_ = /* @__PURE__ */ new Set([
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
function b_(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Na(e) : t ? Hu(e) <= t : !1;
}
be.inlineRef = b_;
const S_ = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Na(e) {
  for (const t in e) {
    if (S_.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Na) || typeof r == "object" && Na(r))
      return !0;
  }
  return !1;
}
function Hu(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !E_.has(r) && (typeof e[r] == "object" && (0, __.eachItem)(e[r], (n) => t += Hu(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Bu(e, t = "", r) {
  r !== !1 && (t = Vr(t));
  const n = e.parse(t);
  return Wu(e, n);
}
be.getFullPath = Bu;
function Wu(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
be._getFullPath = Wu;
const P_ = /#\/?$/;
function Vr(e) {
  return e ? e.replace(P_, "") : "";
}
be.normalizeId = Vr;
function N_(e, t, r) {
  return r = Vr(r), e.resolve(t, r);
}
be.resolveUrl = N_;
const R_ = /^[a-z_][-a-z0-9._]*$/i;
function O_(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Vr(e[r] || t), a = { "": s }, o = Bu(n, s, !1), u = {}, c = /* @__PURE__ */ new Set();
  return w_(e, { allKeys: !0 }, (h, E, g, w) => {
    if (w === void 0)
      return;
    const _ = o + E;
    let y = a[w];
    typeof h[r] == "string" && (y = m.call(this, h[r])), v.call(this, h.$anchor), v.call(this, h.$dynamicAnchor), a[E] = y;
    function m(N) {
      const R = this.opts.uriResolver.resolve;
      if (N = Vr(y ? R(y, N) : N), c.has(N))
        throw l(N);
      c.add(N);
      let O = this.refs[N];
      return typeof O == "string" && (O = this.refs[O]), typeof O == "object" ? d(h, O.schema, N) : N !== Vr(_) && (N[0] === "#" ? (d(h, u[N], N), u[N] = h) : this.refs[N] = _), N;
    }
    function v(N) {
      if (typeof N == "string") {
        if (!R_.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), u;
  function d(h, E, g) {
    if (E !== void 0 && !v_(h, E))
      throw l(g);
  }
  function l(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
be.getSchemaRefs = O_;
Object.defineProperty(st, "__esModule", { value: !0 });
st.getData = st.KeywordCxt = st.validateFunctionCode = void 0;
const Xu = Gr, Sc = ge, Bo = wt, $s = ge, T_ = Is, yn = ht, Qs = zt, q = te, W = mt, I_ = be, Et = D, on = In;
function j_(e) {
  if (Qu(e) && (Zu(e), Yu(e))) {
    C_(e);
    return;
  }
  Ju(e, () => (0, Xu.topBoolOrEmptySchema)(e));
}
st.validateFunctionCode = j_;
function Ju({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, q._)`${W.default.data}, ${W.default.valCxt}`, n.$async, () => {
    e.code((0, q._)`"use strict"; ${Pc(r, s)}`), A_(e, s), e.code(a);
  }) : e.func(t, (0, q._)`${W.default.data}, ${k_(s)}`, n.$async, () => e.code(Pc(r, s)).code(a));
}
function k_(e) {
  return (0, q._)`{${W.default.instancePath}="", ${W.default.parentData}, ${W.default.parentDataProperty}, ${W.default.rootData}=${W.default.data}${e.dynamicRef ? (0, q._)`, ${W.default.dynamicAnchors}={}` : q.nil}}={}`;
}
function A_(e, t) {
  e.if(W.default.valCxt, () => {
    e.var(W.default.instancePath, (0, q._)`${W.default.valCxt}.${W.default.instancePath}`), e.var(W.default.parentData, (0, q._)`${W.default.valCxt}.${W.default.parentData}`), e.var(W.default.parentDataProperty, (0, q._)`${W.default.valCxt}.${W.default.parentDataProperty}`), e.var(W.default.rootData, (0, q._)`${W.default.valCxt}.${W.default.rootData}`), t.dynamicRef && e.var(W.default.dynamicAnchors, (0, q._)`${W.default.valCxt}.${W.default.dynamicAnchors}`);
  }, () => {
    e.var(W.default.instancePath, (0, q._)`""`), e.var(W.default.parentData, (0, q._)`undefined`), e.var(W.default.parentDataProperty, (0, q._)`undefined`), e.var(W.default.rootData, W.default.data), t.dynamicRef && e.var(W.default.dynamicAnchors, (0, q._)`{}`);
  });
}
function C_(e) {
  const { schema: t, opts: r, gen: n } = e;
  Ju(e, () => {
    r.$comment && t.$comment && ed(e), F_(e), n.let(W.default.vErrors, null), n.let(W.default.errors, 0), r.unevaluated && D_(e), xu(e), q_(e);
  });
}
function D_(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, q._)`${r}.evaluated`), t.if((0, q._)`${e.evaluated}.dynamicProps`, () => t.assign((0, q._)`${e.evaluated}.props`, (0, q._)`undefined`)), t.if((0, q._)`${e.evaluated}.dynamicItems`, () => t.assign((0, q._)`${e.evaluated}.items`, (0, q._)`undefined`));
}
function Pc(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, q._)`/*# sourceURL=${r} */` : q.nil;
}
function M_(e, t) {
  if (Qu(e) && (Zu(e), Yu(e))) {
    L_(e, t);
    return;
  }
  (0, Xu.boolOrEmptySchema)(e, t);
}
function Yu({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Qu(e) {
  return typeof e.schema != "boolean";
}
function L_(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && ed(e), z_(e), U_(e);
  const a = n.const("_errs", W.default.errors);
  xu(e, a), n.var(t, (0, q._)`${a} === ${W.default.errors}`);
}
function Zu(e) {
  (0, Et.checkUnknownRules)(e), V_(e);
}
function xu(e, t) {
  if (e.opts.jtd)
    return Nc(e, [], !1, t);
  const r = (0, Sc.getSchemaTypes)(e.schema), n = (0, Sc.coerceAndCheckDataType)(e, r);
  Nc(e, r, !n, t);
}
function V_(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, Et.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function F_(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, Et.checkStrictMode)(e, "default is ignored in the schema root");
}
function z_(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, I_.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function U_(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function ed({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, q._)`${W.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, q.str)`${n}/$comment`, u = e.scopeValue("root", { ref: t.root });
    e.code((0, q._)`${W.default.self}.opts.$comment(${a}, ${o}, ${u}.schema)`);
  }
}
function q_(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, q._)`${W.default.errors} === 0`, () => t.return(W.default.data), () => t.throw((0, q._)`new ${s}(${W.default.vErrors})`)) : (t.assign((0, q._)`${n}.errors`, W.default.vErrors), a.unevaluated && K_(e), t.return((0, q._)`${W.default.errors} === 0`));
}
function K_({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof q.Name && e.assign((0, q._)`${t}.props`, r), n instanceof q.Name && e.assign((0, q._)`${t}.items`, n);
}
function Nc(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: u, opts: c, self: d } = e, { RULES: l } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, Et.schemaHasRulesButRef)(a, l))) {
    s.block(() => nd(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || G_(e, t), s.block(() => {
    for (const E of l.rules)
      h(E);
    h(l.post);
  });
  function h(E) {
    (0, Bo.shouldUseGroup)(a, E) && (E.type ? (s.if((0, $s.checkDataType)(E.type, o, c.strictNumbers)), Rc(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, $s.reportTypeError)(e)), s.endIf()) : Rc(e, E), u || s.if((0, q._)`${W.default.errors} === ${n || 0}`));
  }
}
function Rc(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, T_.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, Bo.shouldUseRule)(n, a) && nd(e, a.keyword, a.definition, t.type);
  });
}
function G_(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (H_(e, t), e.opts.allowUnionTypes || B_(e, t), W_(e, e.dataTypes));
}
function H_(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      td(e.dataTypes, r) || Wo(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), J_(e, t);
  }
}
function B_(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Wo(e, "use allowUnionTypes to allow union type keyword");
}
function W_(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Bo.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => X_(t, o)) && Wo(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function X_(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function td(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function J_(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    td(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Wo(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, Et.checkStrictMode)(e, t, e.opts.strictTypes);
}
class rd {
  constructor(t, r, n) {
    if ((0, yn.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Et.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", sd(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, yn.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", W.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, q.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, q.not)(t), void 0, r);
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
    this.fail((0, q._)`${r} !== undefined && (${(0, q.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? on.reportExtraError : on.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, on.reportError)(this, this.def.$dataError || on.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, on.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = q.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = q.nil, r = q.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, q.or)((0, q._)`${s} === undefined`, r)), t !== q.nil && n.assign(t, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== q.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, q.or)(o(), u());
    function o() {
      if (n.length) {
        if (!(r instanceof q.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, q._)`${(0, $s.checkDataTypes)(c, r, a.opts.strictNumbers, $s.DataType.Wrong)}`;
      }
      return q.nil;
    }
    function u() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, q._)`!${c}(${r})`;
      }
      return q.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Qs.getSubschema)(this.it, t);
    (0, Qs.extendSubschemaData)(n, this.it, t), (0, Qs.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return M_(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = Et.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = Et.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, q.Name)), !0;
  }
}
st.KeywordCxt = rd;
function nd(e, t, r, n) {
  const s = new rd(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, yn.funcKeywordCode)(s, r) : "macro" in r ? (0, yn.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, yn.funcKeywordCode)(s, r);
}
const Y_ = /^\/(?:[^~]|~0|~1)*$/, Q_ = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function sd(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return W.default.rootData;
  if (e[0] === "/") {
    if (!Y_.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = W.default.rootData;
  } else {
    const d = Q_.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +d[1];
    if (s = d[2], s === "#") {
      if (l >= t)
        throw new Error(c("property/index", l));
      return n[t - l];
    }
    if (l > t)
      throw new Error(c("data", l));
    if (a = r[t - l], !s)
      return a;
  }
  let o = a;
  const u = s.split("/");
  for (const d of u)
    d && (a = (0, q._)`${a}${(0, q.getProperty)((0, Et.unescapeJsonPointer)(d))}`, o = (0, q._)`${o} && ${a}`);
  return o;
  function c(d, l) {
    return `Cannot access ${d} ${l} levels up, current level is ${t}`;
  }
}
st.getData = sd;
var jn = {};
Object.defineProperty(jn, "__esModule", { value: !0 });
class Z_ extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
jn.default = Z_;
var Qr = {};
Object.defineProperty(Qr, "__esModule", { value: !0 });
const Zs = be;
class x_ extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Zs.resolveUrl)(t, r, n), this.missingSchema = (0, Zs.normalizeId)((0, Zs.getFullPath)(t, this.missingRef));
  }
}
Qr.default = x_;
var Fe = {};
Object.defineProperty(Fe, "__esModule", { value: !0 });
Fe.resolveSchema = Fe.getCompilingSchema = Fe.resolveRef = Fe.compileSchema = Fe.SchemaEnv = void 0;
const Qe = te, ev = jn, rr = mt, tt = be, Oc = D, tv = st;
class js {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, tt.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Fe.SchemaEnv = js;
function Xo(e) {
  const t = ad.call(this, e);
  if (t)
    return t;
  const r = (0, tt.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new Qe.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let u;
  e.$async && (u = o.scopeValue("Error", {
    ref: ev.default,
    code: (0, Qe._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: rr.default.data,
    parentData: rr.default.parentData,
    parentDataProperty: rr.default.parentDataProperty,
    dataNames: [rr.default.data],
    dataPathArr: [Qe.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Qe.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: u,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Qe.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Qe._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, tv.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    l = `${o.scopeRefs(rr.default.scope)}return ${h}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const g = new Function(`${rr.default.self}`, `${rr.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: _ } = d;
      g.evaluated = {
        props: w instanceof Qe.Name ? void 0 : w,
        items: _ instanceof Qe.Name ? void 0 : _,
        dynamicProps: w instanceof Qe.Name,
        dynamicItems: _ instanceof Qe.Name
      }, g.source && (g.source.evaluated = (0, Qe.stringify)(g.evaluated));
    }
    return e.validate = g, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), h;
  } finally {
    this._compilations.delete(e);
  }
}
Fe.compileSchema = Xo;
function rv(e, t, r) {
  var n;
  r = (0, tt.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = av.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: u } = this.opts;
    o && (a = new js({ schema: o, schemaId: u, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = nv.call(this, a);
}
Fe.resolveRef = rv;
function nv(e) {
  return (0, tt.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Xo.call(this, e);
}
function ad(e) {
  for (const t of this._compilations)
    if (sv(t, e))
      return t;
}
Fe.getCompilingSchema = ad;
function sv(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function av(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || ks.call(this, e, t);
}
function ks(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, tt._getFullPath)(this.opts.uriResolver, r);
  let s = (0, tt.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return xs.call(this, r, e);
  const a = (0, tt.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const u = ks.call(this, e, o);
    return typeof (u == null ? void 0 : u.schema) != "object" ? void 0 : xs.call(this, r, u);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Xo.call(this, o), a === (0, tt.normalizeId)(t)) {
      const { schema: u } = o, { schemaId: c } = this.opts, d = u[c];
      return d && (s = (0, tt.resolveUrl)(this.opts.uriResolver, s, d)), new js({ schema: u, schemaId: c, root: e, baseId: s });
    }
    return xs.call(this, r, o);
  }
}
Fe.resolveSchema = ks;
const ov = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function xs(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const u of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Oc.unescapeFragment)(u)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !ov.has(u) && d && (t = (0, tt.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, Oc.schemaHasRulesButRef)(r, this.RULES)) {
    const u = (0, tt.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = ks.call(this, n, u);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new js({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const iv = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", cv = "Meta-schema for $data reference (JSON AnySchema extension proposal)", lv = "object", uv = [
  "$data"
], dv = {
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
}, fv = !1, hv = {
  $id: iv,
  description: cv,
  type: lv,
  required: uv,
  properties: dv,
  additionalProperties: fv
};
var Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
const od = pu;
od.code = 'require("ajv/dist/runtime/uri").default';
Jo.default = od;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = st;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = te;
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
  const n = jn, s = Qr, a = gr, o = Fe, u = te, c = be, d = ge, l = D, h = hv, E = Jo, g = (P, p) => new RegExp(P, p);
  g.code = "new RegExp";
  const w = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
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
  ]), y = {
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
  }, v = 200;
  function N(P) {
    var p, S, $, i, f, b, T, I, V, L, se, ze, Ut, qt, Kt, Gt, Ht, Bt, Wt, Xt, Jt, Yt, Qt, Zt, xt;
    const Xe = P.strict, er = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, en = er === !0 || er === void 0 ? 1 : er || 0, tn = ($ = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && $ !== void 0 ? $ : g, zs = (i = P.uriResolver) !== null && i !== void 0 ? i : E.default;
    return {
      strictSchema: (b = (f = P.strictSchema) !== null && f !== void 0 ? f : Xe) !== null && b !== void 0 ? b : !0,
      strictNumbers: (I = (T = P.strictNumbers) !== null && T !== void 0 ? T : Xe) !== null && I !== void 0 ? I : !0,
      strictTypes: (L = (V = P.strictTypes) !== null && V !== void 0 ? V : Xe) !== null && L !== void 0 ? L : "log",
      strictTuples: (ze = (se = P.strictTuples) !== null && se !== void 0 ? se : Xe) !== null && ze !== void 0 ? ze : "log",
      strictRequired: (qt = (Ut = P.strictRequired) !== null && Ut !== void 0 ? Ut : Xe) !== null && qt !== void 0 ? qt : !1,
      code: P.code ? { ...P.code, optimize: en, regExp: tn } : { optimize: en, regExp: tn },
      loopRequired: (Kt = P.loopRequired) !== null && Kt !== void 0 ? Kt : v,
      loopEnum: (Gt = P.loopEnum) !== null && Gt !== void 0 ? Gt : v,
      meta: (Ht = P.meta) !== null && Ht !== void 0 ? Ht : !0,
      messages: (Bt = P.messages) !== null && Bt !== void 0 ? Bt : !0,
      inlineRefs: (Wt = P.inlineRefs) !== null && Wt !== void 0 ? Wt : !0,
      schemaId: (Xt = P.schemaId) !== null && Xt !== void 0 ? Xt : "$id",
      addUsedSchema: (Jt = P.addUsedSchema) !== null && Jt !== void 0 ? Jt : !0,
      validateSchema: (Yt = P.validateSchema) !== null && Yt !== void 0 ? Yt : !0,
      validateFormats: (Qt = P.validateFormats) !== null && Qt !== void 0 ? Qt : !0,
      unicodeRegExp: (Zt = P.unicodeRegExp) !== null && Zt !== void 0 ? Zt : !0,
      int32range: (xt = P.int32range) !== null && xt !== void 0 ? xt : !0,
      uriResolver: zs
    };
  }
  class R {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...N(p) };
      const { es5: S, lines: $ } = this.opts.code;
      this.scope = new u.ValueScope({ scope: {}, prefixes: _, es5: S, lines: $ }), this.logger = G(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), O.call(this, y, p, "NOT SUPPORTED"), O.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = $e.call(this), p.formats && de.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && he.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), X.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: S, schemaId: $ } = this.opts;
      let i = h;
      $ === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), S && p && this.addMetaSchema(i, i[$], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: S } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[S] || p : void 0;
    }
    validate(p, S) {
      let $;
      if (typeof p == "string") {
        if ($ = this.getSchema(p), !$)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        $ = this.compile(p);
      const i = $(S);
      return "$async" in $ || (this.errors = $.errors), i;
    }
    compile(p, S) {
      const $ = this._addSchema(p, S);
      return $.validate || this._compileSchemaEnv($);
    }
    compileAsync(p, S) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: $ } = this.opts;
      return i.call(this, p, S);
      async function i(L, se) {
        await f.call(this, L.$schema);
        const ze = this._addSchema(L, se);
        return ze.validate || b.call(this, ze);
      }
      async function f(L) {
        L && !this.getSchema(L) && await i.call(this, { $ref: L }, !0);
      }
      async function b(L) {
        try {
          return this._compileSchemaEnv(L);
        } catch (se) {
          if (!(se instanceof s.default))
            throw se;
          return T.call(this, se), await I.call(this, se.missingSchema), b.call(this, L);
        }
      }
      function T({ missingSchema: L, missingRef: se }) {
        if (this.refs[L])
          throw new Error(`AnySchema ${L} is loaded but ${se} cannot be resolved`);
      }
      async function I(L) {
        const se = await V.call(this, L);
        this.refs[L] || await f.call(this, se.$schema), this.refs[L] || this.addSchema(se, L, S);
      }
      async function V(L) {
        const se = this._loading[L];
        if (se)
          return se;
        try {
          return await (this._loading[L] = $(L));
        } finally {
          delete this._loading[L];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, S, $, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const b of p)
          this.addSchema(b, void 0, $, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: b } = this.opts;
        if (f = p[b], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${b} must be string`);
      }
      return S = (0, c.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(p, $, S, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, S, $ = this.opts.validateSchema) {
      return this.addSchema(p, S, !0, $), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, S) {
      if (typeof p == "boolean")
        return !0;
      let $;
      if ($ = p.$schema, $ !== void 0 && typeof $ != "string")
        throw new Error("$schema must be a string");
      if ($ = $ || this.opts.defaultMeta || this.defaultMeta(), !$)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate($, p);
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
        const { schemaId: $ } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: $ });
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
          let $ = p[this.opts.schemaId];
          return $ && ($ = (0, c.normalizeId)($), delete this.schemas[$], delete this.refs[$]), this;
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
      let $;
      if (typeof p == "string")
        $ = p, typeof S == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), S.keyword = $);
      else if (typeof p == "object" && S === void 0) {
        if (S = p, $ = S.keyword, Array.isArray($) && !$.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (H.call(this, $, S), !S)
        return (0, l.eachItem)($, (f) => ce.call(this, f)), this;
      j.call(this, S);
      const i = {
        ...S,
        type: (0, d.getJSONTypes)(S.type),
        schemaType: (0, d.getJSONTypes)(S.schemaType)
      };
      return (0, l.eachItem)($, i.type.length === 0 ? (f) => ce.call(this, f, i) : (f) => i.type.forEach((b) => ce.call(this, f, i, b))), this;
    }
    getKeyword(p) {
      const S = this.RULES.all[p];
      return typeof S == "object" ? S.definition : !!S;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: S } = this;
      delete S.keywords[p], delete S.all[p];
      for (const $ of S.rules) {
        const i = $.rules.findIndex((f) => f.keyword === p);
        i >= 0 && $.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, S) {
      return typeof S == "string" && (S = new RegExp(S)), this.formats[p] = S, this;
    }
    errorsText(p = this.errors, { separator: S = ", ", dataVar: $ = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${$}${i.instancePath} ${i.message}`).reduce((i, f) => i + S + f);
    }
    $dataMetaSchema(p, S) {
      const $ = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of S) {
        const f = i.split("/").slice(1);
        let b = p;
        for (const T of f)
          b = b[T];
        for (const T in $) {
          const I = $[T];
          if (typeof I != "object")
            continue;
          const { $data: V } = I.definition, L = b[T];
          V && L && (b[T] = M(L));
        }
      }
      return p;
    }
    _removeAllSchemas(p, S) {
      for (const $ in p) {
        const i = p[$];
        (!S || S.test($)) && (typeof i == "string" ? delete p[$] : i && !i.meta && (this._cache.delete(i.schema), delete p[$]));
      }
    }
    _addSchema(p, S, $, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let b;
      const { schemaId: T } = this.opts;
      if (typeof p == "object")
        b = p[T];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let I = this._cache.get(p);
      if (I !== void 0)
        return I;
      $ = (0, c.normalizeId)(b || $);
      const V = c.getSchemaRefs.call(this, p, $);
      return I = new o.SchemaEnv({ schema: p, schemaId: T, meta: S, baseId: $, localRefs: V }), this._cache.set(I.schema, I), f && !$.startsWith("#") && ($ && this._checkUnique($), this.refs[$] = I), i && this.validateSchema(p, !0), I;
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
  R.ValidationError = n.default, R.MissingRefError = s.default, e.default = R;
  function O(P, p, S, $ = "error") {
    for (const i in P) {
      const f = i;
      f in p && this.logger[$](`${S}: option ${i}. ${P[f]}`);
    }
  }
  function K(P) {
    return P = (0, c.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function X() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const p in P)
          this.addSchema(P[p], p);
  }
  function de() {
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
  function $e() {
    const P = { ...this.opts };
    for (const p of w)
      delete P[p];
    return P;
  }
  const F = { log() {
  }, warn() {
  }, error() {
  } };
  function G(P) {
    if (P === !1)
      return F;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const ae = /^[a-z_$][a-z0-9_$:-]*$/i;
  function H(P, p) {
    const { RULES: S } = this;
    if ((0, l.eachItem)(P, ($) => {
      if (S.keywords[$])
        throw new Error(`Keyword ${$} is already defined`);
      if (!ae.test($))
        throw new Error(`Keyword ${$} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function ce(P, p, S) {
    var $;
    const i = p == null ? void 0 : p.post;
    if (S && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let b = i ? f.post : f.rules.find(({ type: I }) => I === S);
    if (b || (b = { type: S, rules: [] }, f.rules.push(b)), f.keywords[P] = !0, !p)
      return;
    const T = {
      keyword: P,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? A.call(this, b, T, p.before) : b.rules.push(T), f.all[P] = T, ($ = p.implements) === null || $ === void 0 || $.forEach((I) => this.addKeyword(I));
  }
  function A(P, p, S) {
    const $ = P.rules.findIndex((i) => i.keyword === S);
    $ >= 0 ? P.rules.splice($, 0, p) : (P.rules.push(p), this.logger.warn(`rule ${S} is not defined`));
  }
  function j(P) {
    let { metaSchema: p } = P;
    p !== void 0 && (P.$data && this.opts.$data && (p = M(p)), P.validateSchema = this.compile(p, !0));
  }
  const z = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function M(P) {
    return { anyOf: [P, z] };
  }
})(Ou);
var Yo = {}, Qo = {}, Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
const mv = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Zo.default = mv;
var _r = {};
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.callRef = _r.getValidate = void 0;
const pv = Qr, Tc = ne, Ve = te, Sr = mt, Ic = Fe, qn = D, $v = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: u, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const l = Ic.resolveRef.call(c, d, s, r);
    if (l === void 0)
      throw new pv.default(n.opts.uriResolver, s, r);
    if (l instanceof Ic.SchemaEnv)
      return E(l);
    return g(l);
    function h() {
      if (a === d)
        return is(e, o, a, a.$async);
      const w = t.scopeValue("root", { ref: d });
      return is(e, (0, Ve._)`${w}.validate`, d, d.$async);
    }
    function E(w) {
      const _ = id(e, w);
      is(e, _, w, w.$async);
    }
    function g(w) {
      const _ = t.scopeValue("schema", u.code.source === !0 ? { ref: w, code: (0, Ve.stringify)(w) } : { ref: w }), y = t.name("valid"), m = e.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: Ve.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, y);
      e.mergeEvaluated(m), e.ok(y);
    }
  }
};
function id(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ve._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
_r.getValidate = id;
function is(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: u, opts: c } = a, d = c.passContext ? Sr.default.this : Ve.nil;
  n ? l() : h();
  function l() {
    if (!u.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, Ve._)`await ${(0, Tc.callValidateCode)(e, t, d)}`), g(t), o || s.assign(w, !0);
    }, (_) => {
      s.if((0, Ve._)`!(${_} instanceof ${a.ValidationError})`, () => s.throw(_)), E(_), o || s.assign(w, !1);
    }), e.ok(w);
  }
  function h() {
    e.result((0, Tc.callValidateCode)(e, t, d), () => g(t), () => E(t));
  }
  function E(w) {
    const _ = (0, Ve._)`${w}.errors`;
    s.assign(Sr.default.vErrors, (0, Ve._)`${Sr.default.vErrors} === null ? ${_} : ${Sr.default.vErrors}.concat(${_})`), s.assign(Sr.default.errors, (0, Ve._)`${Sr.default.vErrors}.length`);
  }
  function g(w) {
    var _;
    if (!a.opts.unevaluated)
      return;
    const y = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (a.props !== !0)
      if (y && !y.dynamicProps)
        y.props !== void 0 && (a.props = qn.mergeEvaluated.props(s, y.props, a.props));
      else {
        const m = s.var("props", (0, Ve._)`${w}.evaluated.props`);
        a.props = qn.mergeEvaluated.props(s, m, a.props, Ve.Name);
      }
    if (a.items !== !0)
      if (y && !y.dynamicItems)
        y.items !== void 0 && (a.items = qn.mergeEvaluated.items(s, y.items, a.items));
      else {
        const m = s.var("items", (0, Ve._)`${w}.evaluated.items`);
        a.items = qn.mergeEvaluated.items(s, m, a.items, Ve.Name);
      }
  }
}
_r.callRef = is;
_r.default = $v;
Object.defineProperty(Qo, "__esModule", { value: !0 });
const yv = Zo, gv = _r, _v = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  yv.default,
  gv.default
];
Qo.default = _v;
var xo = {}, ei = {};
Object.defineProperty(ei, "__esModule", { value: !0 });
const ys = te, It = ys.operators, gs = {
  maximum: { okStr: "<=", ok: It.LTE, fail: It.GT },
  minimum: { okStr: ">=", ok: It.GTE, fail: It.LT },
  exclusiveMaximum: { okStr: "<", ok: It.LT, fail: It.GTE },
  exclusiveMinimum: { okStr: ">", ok: It.GT, fail: It.LTE }
}, vv = {
  message: ({ keyword: e, schemaCode: t }) => (0, ys.str)`must be ${gs[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, ys._)`{comparison: ${gs[e].okStr}, limit: ${t}}`
}, wv = {
  keyword: Object.keys(gs),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: vv,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, ys._)`${r} ${gs[t].fail} ${n} || isNaN(${r})`);
  }
};
ei.default = wv;
var ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
const gn = te, Ev = {
  message: ({ schemaCode: e }) => (0, gn.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, gn._)`{multipleOf: ${e}}`
}, bv = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Ev,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), u = a ? (0, gn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, gn._)`${o} !== parseInt(${o})`;
    e.fail$data((0, gn._)`(${n} === 0 || (${o} = ${r}/${n}, ${u}))`);
  }
};
ti.default = bv;
var ri = {}, ni = {};
Object.defineProperty(ni, "__esModule", { value: !0 });
function cd(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
ni.default = cd;
cd.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(ri, "__esModule", { value: !0 });
const cr = te, Sv = D, Pv = ni, Nv = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, cr.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, cr._)`{limit: ${e}}`
}, Rv = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Nv,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? cr.operators.GT : cr.operators.LT, o = s.opts.unicode === !1 ? (0, cr._)`${r}.length` : (0, cr._)`${(0, Sv.useFunc)(e.gen, Pv.default)}(${r})`;
    e.fail$data((0, cr._)`${o} ${a} ${n}`);
  }
};
ri.default = Rv;
var si = {};
Object.defineProperty(si, "__esModule", { value: !0 });
const Ov = ne, Tv = D, jr = te, Iv = {
  message: ({ schemaCode: e }) => (0, jr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, jr._)`{pattern: ${e}}`
}, jv = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Iv,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e, u = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, jr._)`new RegExp` : (0, Tv.useFunc)(t, c), l = t.let("valid");
      t.try(() => t.assign(l, (0, jr._)`${d}(${a}, ${u}).test(${r})`), () => t.assign(l, !1)), e.fail$data((0, jr._)`!${l}`);
    } else {
      const c = (0, Ov.usePattern)(e, s);
      e.fail$data((0, jr._)`!${c}.test(${r})`);
    }
  }
};
si.default = jv;
var ai = {};
Object.defineProperty(ai, "__esModule", { value: !0 });
const _n = te, kv = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, _n.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, _n._)`{limit: ${e}}`
}, Av = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: kv,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? _n.operators.GT : _n.operators.LT;
    e.fail$data((0, _n._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
ai.default = Av;
var oi = {};
Object.defineProperty(oi, "__esModule", { value: !0 });
const cn = ne, vn = te, Cv = D, Dv = {
  message: ({ params: { missingProperty: e } }) => (0, vn.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, vn._)`{missingProperty: ${e}}`
}, Mv = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Dv,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: u } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= u.loopRequired;
    if (o.allErrors ? d() : l(), u.strictRequired) {
      const g = e.parentSchema.properties, { definedProperties: w } = e.it;
      for (const _ of r)
        if ((g == null ? void 0 : g[_]) === void 0 && !w.has(_)) {
          const y = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${_}" is not defined at "${y}" (strictRequired)`;
          (0, Cv.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(vn.nil, h);
      else
        for (const g of r)
          (0, cn.checkReportMissingProp)(e, g);
    }
    function l() {
      const g = t.let("missing");
      if (c || a) {
        const w = t.let("valid", !0);
        e.block$data(w, () => E(g, w)), e.ok(w);
      } else
        t.if((0, cn.checkMissingProp)(e, r, g)), (0, cn.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, cn.noPropertyInData)(t, s, g, u.ownProperties), () => e.error());
      });
    }
    function E(g, w) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(w, (0, cn.propertyInData)(t, s, g, u.ownProperties)), t.if((0, vn.not)(w), () => {
          e.error(), t.break();
        });
      }, vn.nil);
    }
  }
};
oi.default = Mv;
var ii = {};
Object.defineProperty(ii, "__esModule", { value: !0 });
const wn = te, Lv = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, wn.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, wn._)`{limit: ${e}}`
}, Vv = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Lv,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? wn.operators.GT : wn.operators.LT;
    e.fail$data((0, wn._)`${r}.length ${s} ${n}`);
  }
};
ii.default = Vv;
var ci = {}, kn = {};
Object.defineProperty(kn, "__esModule", { value: !0 });
const ld = bs;
ld.code = 'require("ajv/dist/runtime/equal").default';
kn.default = ld;
Object.defineProperty(ci, "__esModule", { value: !0 });
const ea = ge, we = te, Fv = D, zv = kn, Uv = {
  message: ({ params: { i: e, j: t } }) => (0, we.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, we._)`{i: ${e}, j: ${t}}`
}, qv = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Uv,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: u } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, ea.getSchemaTypes)(a.items) : [];
    e.block$data(c, l, (0, we._)`${o} === false`), e.ok(c);
    function l() {
      const w = t.let("i", (0, we._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: w, j: _ }), t.assign(c, !0), t.if((0, we._)`${w} > 1`, () => (h() ? E : g)(w, _));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function E(w, _) {
      const y = t.name("item"), m = (0, ea.checkDataTypes)(d, y, u.opts.strictNumbers, ea.DataType.Wrong), v = t.const("indices", (0, we._)`{}`);
      t.for((0, we._)`;${w}--;`, () => {
        t.let(y, (0, we._)`${r}[${w}]`), t.if(m, (0, we._)`continue`), d.length > 1 && t.if((0, we._)`typeof ${y} == "string"`, (0, we._)`${y} += "_"`), t.if((0, we._)`typeof ${v}[${y}] == "number"`, () => {
          t.assign(_, (0, we._)`${v}[${y}]`), e.error(), t.assign(c, !1).break();
        }).code((0, we._)`${v}[${y}] = ${w}`);
      });
    }
    function g(w, _) {
      const y = (0, Fv.useFunc)(t, zv.default), m = t.name("outer");
      t.label(m).for((0, we._)`;${w}--;`, () => t.for((0, we._)`${_} = ${w}; ${_}--;`, () => t.if((0, we._)`${y}(${r}[${w}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
ci.default = qv;
var li = {};
Object.defineProperty(li, "__esModule", { value: !0 });
const Ra = te, Kv = D, Gv = kn, Hv = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Ra._)`{allowedValue: ${e}}`
}, Bv = {
  keyword: "const",
  $data: !0,
  error: Hv,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, Ra._)`!${(0, Kv.useFunc)(t, Gv.default)}(${r}, ${s})`) : e.fail((0, Ra._)`${a} !== ${r}`);
  }
};
li.default = Bv;
var ui = {};
Object.defineProperty(ui, "__esModule", { value: !0 });
const dn = te, Wv = D, Xv = kn, Jv = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, dn._)`{allowedValues: ${e}}`
}, Yv = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Jv,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const u = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, Wv.useFunc)(t, Xv.default));
    let l;
    if (u || n)
      l = t.let("valid"), e.block$data(l, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", a);
      l = (0, dn.or)(...s.map((w, _) => E(g, _)));
    }
    e.pass(l);
    function h() {
      t.assign(l, !1), t.forOf("v", a, (g) => t.if((0, dn._)`${d()}(${r}, ${g})`, () => t.assign(l, !0).break()));
    }
    function E(g, w) {
      const _ = s[w];
      return typeof _ == "object" && _ !== null ? (0, dn._)`${d()}(${r}, ${g}[${w}])` : (0, dn._)`${r} === ${_}`;
    }
  }
};
ui.default = Yv;
Object.defineProperty(xo, "__esModule", { value: !0 });
const Qv = ei, Zv = ti, xv = ri, ew = si, tw = ai, rw = oi, nw = ii, sw = ci, aw = li, ow = ui, iw = [
  // number
  Qv.default,
  Zv.default,
  // string
  xv.default,
  ew.default,
  // object
  tw.default,
  rw.default,
  // array
  nw.default,
  sw.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  aw.default,
  ow.default
];
xo.default = iw;
var di = {}, Zr = {};
Object.defineProperty(Zr, "__esModule", { value: !0 });
Zr.validateAdditionalItems = void 0;
const lr = te, Oa = D, cw = {
  message: ({ params: { len: e } }) => (0, lr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, lr._)`{limit: ${e}}`
}, lw = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: cw,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Oa.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    ud(e, n);
  }
};
function ud(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const u = r.const("len", (0, lr._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, lr._)`${u} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Oa.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, lr._)`${u} <= ${t.length}`);
    r.if((0, lr.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, u, (l) => {
      e.subschema({ keyword: a, dataProp: l, dataPropType: Oa.Type.Num }, d), o.allErrors || r.if((0, lr.not)(d), () => r.break());
    });
  }
}
Zr.validateAdditionalItems = ud;
Zr.default = lw;
var fi = {}, xr = {};
Object.defineProperty(xr, "__esModule", { value: !0 });
xr.validateTuple = void 0;
const jc = te, cs = D, uw = ne, dw = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return dd(e, "additionalItems", t);
    r.items = !0, !(0, cs.alwaysValidSchema)(r, t) && e.ok((0, uw.validateArray)(e));
  }
};
function dd(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: u } = e;
  l(s), u.opts.unevaluated && r.length && u.items !== !0 && (u.items = cs.mergeEvaluated.items(n, r.length, u.items));
  const c = n.name("valid"), d = n.const("len", (0, jc._)`${a}.length`);
  r.forEach((h, E) => {
    (0, cs.alwaysValidSchema)(u, h) || (n.if((0, jc._)`${d} > ${E}`, () => e.subschema({
      keyword: o,
      schemaProp: E,
      dataProp: E
    }, c)), e.ok(c));
  });
  function l(h) {
    const { opts: E, errSchemaPath: g } = u, w = r.length, _ = w === h.minItems && (w === h.maxItems || h[t] === !1);
    if (E.strictTuples && !_) {
      const y = `"${o}" is ${w}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, cs.checkStrictMode)(u, y, E.strictTuples);
    }
  }
}
xr.validateTuple = dd;
xr.default = dw;
Object.defineProperty(fi, "__esModule", { value: !0 });
const fw = xr, hw = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, fw.validateTuple)(e, "items")
};
fi.default = hw;
var hi = {};
Object.defineProperty(hi, "__esModule", { value: !0 });
const kc = te, mw = D, pw = ne, $w = Zr, yw = {
  message: ({ params: { len: e } }) => (0, kc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, kc._)`{limit: ${e}}`
}, gw = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: yw,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, mw.alwaysValidSchema)(n, t) && (s ? (0, $w.validateAdditionalItems)(e, s) : e.ok((0, pw.validateArray)(e)));
  }
};
hi.default = gw;
var mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
const Be = te, Kn = D, _w = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Be.str)`must contain at least ${e} valid item(s)` : (0, Be.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Be._)`{minContains: ${e}}` : (0, Be._)`{minContains: ${e}, maxContains: ${t}}`
}, vw = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: _w,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, u;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, u = d) : o = 1;
    const l = t.const("len", (0, Be._)`${s}.length`);
    if (e.setParams({ min: o, max: u }), u === void 0 && o === 0) {
      (0, Kn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (u !== void 0 && o > u) {
      (0, Kn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Kn.alwaysValidSchema)(a, r)) {
      let _ = (0, Be._)`${l} >= ${o}`;
      u !== void 0 && (_ = (0, Be._)`${_} && ${l} <= ${u}`), e.pass(_);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    u === void 0 && o === 1 ? g(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), u !== void 0 && t.if((0, Be._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const _ = t.name("_valid"), y = t.let("count", 0);
      g(_, () => t.if(_, () => w(y)));
    }
    function g(_, y) {
      t.forRange("i", 0, l, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: Kn.Type.Num,
          compositeRule: !0
        }, _), y();
      });
    }
    function w(_) {
      t.code((0, Be._)`${_}++`), u === void 0 ? t.if((0, Be._)`${_} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, Be._)`${_} > ${u}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, Be._)`${_} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
mi.default = vw;
var fd = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = te, r = D, n = ne;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: l } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: l, missingProperty: h } }) => (0, t._)`{property: ${c},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${l}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [d, l] = a(c);
      o(c, d), u(c, l);
    }
  };
  function a({ schema: c }) {
    const d = {}, l = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const E = Array.isArray(c[h]) ? d : l;
      E[h] = c[h];
    }
    return [d, l];
  }
  function o(c, d = c.schema) {
    const { gen: l, data: h, it: E } = c;
    if (Object.keys(d).length === 0)
      return;
    const g = l.let("missing");
    for (const w in d) {
      const _ = d[w];
      if (_.length === 0)
        continue;
      const y = (0, n.propertyInData)(l, h, w, E.opts.ownProperties);
      c.setParams({
        property: w,
        depsCount: _.length,
        deps: _.join(", ")
      }), E.allErrors ? l.if(y, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (l.if((0, t._)`${y} && (${(0, n.checkMissingProp)(c, _, g)})`), (0, n.reportMissingProp)(c, g), l.else());
    }
  }
  e.validatePropertyDeps = o;
  function u(c, d = c.schema) {
    const { gen: l, data: h, keyword: E, it: g } = c, w = l.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)(g, d[_]) || (l.if(
        (0, n.propertyInData)(l, h, _, g.opts.ownProperties),
        () => {
          const y = c.subschema({ keyword: E, schemaProp: _ }, w);
          c.mergeValidEvaluated(y, w);
        },
        () => l.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  e.validateSchemaDeps = u, e.default = s;
})(fd);
var pi = {};
Object.defineProperty(pi, "__esModule", { value: !0 });
const hd = te, ww = D, Ew = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, hd._)`{propertyName: ${e.propertyName}}`
}, bw = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Ew,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, ww.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, hd.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
pi.default = bw;
var As = {};
Object.defineProperty(As, "__esModule", { value: !0 });
const Gn = ne, xe = te, Sw = mt, Hn = D, Pw = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, xe._)`{additionalProperty: ${e.additionalProperty}}`
}, Nw = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Pw,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: u, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, Hn.alwaysValidSchema)(o, r))
      return;
    const d = (0, Gn.allSchemaProperties)(n.properties), l = (0, Gn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, xe._)`${a} === ${Sw.default.errors}`);
    function h() {
      t.forIn("key", s, (y) => {
        !d.length && !l.length ? w(y) : t.if(E(y), () => w(y));
      });
    }
    function E(y) {
      let m;
      if (d.length > 8) {
        const v = (0, Hn.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, Gn.isOwnProperty)(t, v, y);
      } else d.length ? m = (0, xe.or)(...d.map((v) => (0, xe._)`${y} === ${v}`)) : m = xe.nil;
      return l.length && (m = (0, xe.or)(m, ...l.map((v) => (0, xe._)`${(0, Gn.usePattern)(e, v)}.test(${y})`))), (0, xe.not)(m);
    }
    function g(y) {
      t.code((0, xe._)`delete ${s}[${y}]`);
    }
    function w(y) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        g(y);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: y }), e.error(), u || t.break();
        return;
      }
      if (typeof r == "object" && !(0, Hn.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_(y, m, !1), t.if((0, xe.not)(m), () => {
          e.reset(), g(y);
        })) : (_(y, m), u || t.if((0, xe.not)(m), () => t.break()));
      }
    }
    function _(y, m, v) {
      const N = {
        keyword: "additionalProperties",
        dataProp: y,
        dataPropType: Hn.Type.Str
      };
      v === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
As.default = Nw;
var $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
const Rw = st, Ac = ne, ta = D, Cc = As, Ow = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Cc.default.code(new Rw.KeywordCxt(a, Cc.default, "additionalProperties"));
    const o = (0, Ac.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = ta.mergeEvaluated.props(t, (0, ta.toHash)(o), a.props));
    const u = o.filter((h) => !(0, ta.alwaysValidSchema)(a, r[h]));
    if (u.length === 0)
      return;
    const c = t.name("valid");
    for (const h of u)
      d(h) ? l(h) : (t.if((0, Ac.propertyInData)(t, s, h, a.opts.ownProperties)), l(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function l(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
$i.default = Ow;
var yi = {};
Object.defineProperty(yi, "__esModule", { value: !0 });
const Dc = ne, Bn = te, Mc = D, Lc = D, Tw = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, u = (0, Dc.allSchemaProperties)(r), c = u.filter((_) => (0, Mc.alwaysValidSchema)(a, r[_]));
    if (u.length === 0 || c.length === u.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, l = t.name("valid");
    a.props !== !0 && !(a.props instanceof Bn.Name) && (a.props = (0, Lc.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    E();
    function E() {
      for (const _ of u)
        d && g(_), a.allErrors ? w(_) : (t.var(l, !0), w(_), t.if(l));
    }
    function g(_) {
      for (const y in d)
        new RegExp(_).test(y) && (0, Mc.checkStrictMode)(a, `property ${y} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function w(_) {
      t.forIn("key", n, (y) => {
        t.if((0, Bn._)`${(0, Dc.usePattern)(e, _)}.test(${y})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: y,
            dataPropType: Lc.Type.Str
          }, l), a.opts.unevaluated && h !== !0 ? t.assign((0, Bn._)`${h}[${y}]`, !0) : !m && !a.allErrors && t.if((0, Bn.not)(l), () => t.break());
        });
      });
    }
  }
};
yi.default = Tw;
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
const Iw = D, jw = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Iw.alwaysValidSchema)(n, r)) {
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
gi.default = jw;
var _i = {};
Object.defineProperty(_i, "__esModule", { value: !0 });
const kw = ne, Aw = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: kw.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
_i.default = Aw;
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
const ls = te, Cw = D, Dw = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, ls._)`{passingSchemas: ${e.passing}}`
}, Mw = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Dw,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), u = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: u }), t.block(d), e.result(o, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((l, h) => {
        let E;
        (0, Cw.alwaysValidSchema)(s, l) ? t.var(c, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, ls._)`${c} && ${o}`).assign(o, !1).assign(u, (0, ls._)`[${u}, ${h}]`).else(), t.if(c, () => {
          t.assign(o, !0), t.assign(u, h), E && e.mergeEvaluated(E, ls.Name);
        });
      });
    }
  }
};
vi.default = Mw;
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
const Lw = D, Vw = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, Lw.alwaysValidSchema)(n, a))
        return;
      const u = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(u);
    });
  }
};
wi.default = Vw;
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
const _s = te, md = D, Fw = {
  message: ({ params: e }) => (0, _s.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, _s._)`{failingKeyword: ${e.ifClause}}`
}, zw = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Fw,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, md.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Vc(n, "then"), a = Vc(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), u = t.name("_valid");
    if (c(), e.reset(), s && a) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(u, d("then", l), d("else", l));
    } else s ? t.if(u, d("then")) : t.if((0, _s.not)(u), d("else"));
    e.pass(o, () => e.error(!0));
    function c() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, u);
      e.mergeEvaluated(l);
    }
    function d(l, h) {
      return () => {
        const E = e.subschema({ keyword: l }, u);
        t.assign(o, u), e.mergeValidEvaluated(E, o), h ? t.assign(h, (0, _s._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function Vc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, md.alwaysValidSchema)(e, r);
}
Ei.default = zw;
var bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
const Uw = D, qw = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Uw.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
bi.default = qw;
Object.defineProperty(di, "__esModule", { value: !0 });
const Kw = Zr, Gw = fi, Hw = xr, Bw = hi, Ww = mi, Xw = fd, Jw = pi, Yw = As, Qw = $i, Zw = yi, xw = gi, eE = _i, tE = vi, rE = wi, nE = Ei, sE = bi;
function aE(e = !1) {
  const t = [
    // any
    xw.default,
    eE.default,
    tE.default,
    rE.default,
    nE.default,
    sE.default,
    // object
    Jw.default,
    Yw.default,
    Xw.default,
    Qw.default,
    Zw.default
  ];
  return e ? t.push(Gw.default, Bw.default) : t.push(Kw.default, Hw.default), t.push(Ww.default), t;
}
di.default = aE;
var Si = {}, Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
const pe = te, oE = {
  message: ({ schemaCode: e }) => (0, pe.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, pe._)`{format: ${e}}`
}, iE = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: oE,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: u } = e, { opts: c, errSchemaPath: d, schemaEnv: l, self: h } = u;
    if (!c.validateFormats)
      return;
    s ? E() : g();
    function E() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, pe._)`${w}[${o}]`), y = r.let("fType"), m = r.let("format");
      r.if((0, pe._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign(y, (0, pe._)`${_}.type || "string"`).assign(m, (0, pe._)`${_}.validate`), () => r.assign(y, (0, pe._)`"string"`).assign(m, _)), e.fail$data((0, pe.or)(v(), N()));
      function v() {
        return c.strictSchema === !1 ? pe.nil : (0, pe._)`${o} && !${m}`;
      }
      function N() {
        const R = l.$async ? (0, pe._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, pe._)`${m}(${n})`, O = (0, pe._)`(typeof ${m} == "function" ? ${R} : ${m}.test(${n}))`;
        return (0, pe._)`${m} && ${m} !== true && ${y} === ${t} && !${O}`;
      }
    }
    function g() {
      const w = h.formats[a];
      if (!w) {
        v();
        return;
      }
      if (w === !0)
        return;
      const [_, y, m] = N(w);
      _ === t && e.pass(R());
      function v() {
        if (c.strictSchema === !1) {
          h.logger.warn(O());
          return;
        }
        throw new Error(O());
        function O() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function N(O) {
        const K = O instanceof RegExp ? (0, pe.regexpCode)(O) : c.code.formats ? (0, pe._)`${c.code.formats}${(0, pe.getProperty)(a)}` : void 0, X = r.scopeValue("formats", { key: a, ref: O, code: K });
        return typeof O == "object" && !(O instanceof RegExp) ? [O.type || "string", O.validate, (0, pe._)`${X}.validate`] : ["string", O, X];
      }
      function R() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, pe._)`await ${m}(${n})`;
        }
        return typeof y == "function" ? (0, pe._)`${m}(${n})` : (0, pe._)`${m}.test(${n})`;
      }
    }
  }
};
Pi.default = iE;
Object.defineProperty(Si, "__esModule", { value: !0 });
const cE = Pi, lE = [cE.default];
Si.default = lE;
var Hr = {};
Object.defineProperty(Hr, "__esModule", { value: !0 });
Hr.contentVocabulary = Hr.metadataVocabulary = void 0;
Hr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Hr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Yo, "__esModule", { value: !0 });
const uE = Qo, dE = xo, fE = di, hE = Si, Fc = Hr, mE = [
  uE.default,
  dE.default,
  (0, fE.default)(),
  hE.default,
  Fc.metadataVocabulary,
  Fc.contentVocabulary
];
Yo.default = mE;
var Ni = {}, Cs = {};
Object.defineProperty(Cs, "__esModule", { value: !0 });
Cs.DiscrError = void 0;
var zc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(zc || (Cs.DiscrError = zc = {}));
Object.defineProperty(Ni, "__esModule", { value: !0 });
const Rr = te, Ta = Cs, Uc = Fe, pE = Qr, $E = D, yE = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Ta.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, Rr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, gE = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: yE,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const u = n.propertyName;
    if (typeof u != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, Rr._)`${r}${(0, Rr.getProperty)(u)}`);
    t.if((0, Rr._)`typeof ${d} == "string"`, () => l(), () => e.error(!1, { discrError: Ta.DiscrError.Tag, tag: d, tagName: u })), e.ok(c);
    function l() {
      const g = E();
      t.if(!1);
      for (const w in g)
        t.elseIf((0, Rr._)`${d} === ${w}`), t.assign(c, h(g[w]));
      t.else(), e.error(!1, { discrError: Ta.DiscrError.Mapping, tag: d, tagName: u }), t.endIf();
    }
    function h(g) {
      const w = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: g }, w);
      return e.mergeEvaluated(_, Rr.Name), w;
    }
    function E() {
      var g;
      const w = {}, _ = m(s);
      let y = !0;
      for (let R = 0; R < o.length; R++) {
        let O = o[R];
        if (O != null && O.$ref && !(0, $E.schemaHasRulesButRef)(O, a.self.RULES)) {
          const X = O.$ref;
          if (O = Uc.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, X), O instanceof Uc.SchemaEnv && (O = O.schema), O === void 0)
            throw new pE.default(a.opts.uriResolver, a.baseId, X);
        }
        const K = (g = O == null ? void 0 : O.properties) === null || g === void 0 ? void 0 : g[u];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${u}"`);
        y = y && (_ || m(O)), v(K, R);
      }
      if (!y)
        throw new Error(`discriminator: "${u}" must be required`);
      return w;
      function m({ required: R }) {
        return Array.isArray(R) && R.includes(u);
      }
      function v(R, O) {
        if (R.const)
          N(R.const, O);
        else if (R.enum)
          for (const K of R.enum)
            N(K, O);
        else
          throw new Error(`discriminator: "properties/${u}" must have "const" or "enum"`);
      }
      function N(R, O) {
        if (typeof R != "string" || R in w)
          throw new Error(`discriminator: "${u}" values must be unique strings`);
        w[R] = O;
      }
    }
  }
};
Ni.default = gE;
const _E = "http://json-schema.org/draft-07/schema#", vE = "http://json-schema.org/draft-07/schema#", wE = "Core schema meta-schema", EE = {
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
}, bE = [
  "object",
  "boolean"
], SE = {
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
}, PE = {
  $schema: _E,
  $id: vE,
  title: wE,
  definitions: EE,
  type: bE,
  properties: SE,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = Ou, n = Yo, s = Ni, a = PE, o = ["/properties"], u = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((w) => this.addVocabulary(w)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const w = this.opts.$data ? this.$dataMetaSchema(a, o) : a;
      this.addMetaSchema(w, u, !1), this.refs["http://json-schema.org/schema"] = u;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(u) ? u : void 0);
    }
  }
  t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var d = st;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var l = te;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return l._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return l.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return l.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return l.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return l.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return l.CodeGen;
  } });
  var h = jn;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var E = Qr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return E.default;
  } });
})(Ea, Ea.exports);
var NE = Ea.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = NE, r = te, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, a = {
    message: ({ keyword: u, schemaCode: c }) => (0, r.str)`should be ${s[u].okStr} ${c}`,
    params: ({ keyword: u, schemaCode: c }) => (0, r._)`{comparison: ${s[u].okStr}, limit: ${c}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: a,
    code(u) {
      const { gen: c, data: d, schemaCode: l, keyword: h, it: E } = u, { opts: g, self: w } = E;
      if (!g.validateFormats)
        return;
      const _ = new t.KeywordCxt(E, w.RULES.all.format.definition, "format");
      _.$data ? y() : m();
      function y() {
        const N = c.scopeValue("formats", {
          ref: w.formats,
          code: g.code.formats
        }), R = c.const("fmt", (0, r._)`${N}[${_.schemaCode}]`);
        u.fail$data((0, r.or)((0, r._)`typeof ${R} != "object"`, (0, r._)`${R} instanceof RegExp`, (0, r._)`typeof ${R}.compare != "function"`, v(R)));
      }
      function m() {
        const N = _.schema, R = w.formats[N];
        if (!R || R === !0)
          return;
        if (typeof R != "object" || R instanceof RegExp || typeof R.compare != "function")
          throw new Error(`"${h}": format "${N}" does not define "compare" function`);
        const O = c.scopeValue("formats", {
          key: N,
          ref: R,
          code: g.code.formats ? (0, r._)`${g.code.formats}${(0, r.getProperty)(N)}` : void 0
        });
        u.fail$data(v(O));
      }
      function v(N) {
        return (0, r._)`${N}.compare(${d}, ${l}) ${s[h].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const o = (u) => (u.addKeyword(e.formatLimitDefinition), u);
  e.default = o;
})(Ru);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = Nu, n = Ru, s = te, a = new s.Name("fullFormats"), o = new s.Name("fastFormats"), u = (d, l = { keywords: !0 }) => {
    if (Array.isArray(l))
      return c(d, l, r.fullFormats, a), d;
    const [h, E] = l.mode === "fast" ? [r.fastFormats, o] : [r.fullFormats, a], g = l.formats || r.formatNames;
    return c(d, g, h, E), l.keywords && (0, n.default)(d), d;
  };
  u.get = (d, l = "full") => {
    const E = (l === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!E)
      throw new Error(`Unknown format "${d}"`);
    return E;
  };
  function c(d, l, h, E) {
    var g, w;
    (g = (w = d.opts.code).formats) !== null && g !== void 0 || (w.formats = (0, s._)`require("ajv-formats/dist/formats").${E}`);
    for (const _ of l)
      d.addFormat(_, h[_]);
  }
  e.exports = t = u, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = u;
})(wa, wa.exports);
var RE = wa.exports;
const OE = /* @__PURE__ */ El(RE), TE = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), a = Object.getOwnPropertyDescriptor(t, r);
  !IE(s, a) && n || Object.defineProperty(e, r, a);
}, IE = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, jE = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, kE = (e, t) => `/* Wrapped ${e}*/
${t}`, AE = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), CE = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), DE = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = kE.bind(null, n, t.toString());
  Object.defineProperty(s, "name", CE);
  const { writable: a, enumerable: o, configurable: u } = AE;
  Object.defineProperty(e, "toString", { value: s, writable: a, enumerable: o, configurable: u });
};
function ME(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    TE(e, t, s, r);
  return jE(e, t), DE(e, t, n), e;
}
const qc = (e, t = {}) => {
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
  let o, u, c;
  const d = function(...l) {
    const h = this, E = () => {
      o = void 0, u && (clearTimeout(u), u = void 0), a && (c = e.apply(h, l));
    }, g = () => {
      u = void 0, o && (clearTimeout(o), o = void 0), a && (c = e.apply(h, l));
    }, w = s && !o;
    return clearTimeout(o), o = setTimeout(E, r), n > 0 && n !== Number.POSITIVE_INFINITY && !u && (u = setTimeout(g, n)), w && (c = e.apply(h, l)), c;
  };
  return ME(d, e), d.cancel = () => {
    o && (clearTimeout(o), o = void 0), u && (clearTimeout(u), u = void 0);
  }, d;
};
var Ia = { exports: {} };
const LE = "2.0.0", pd = 256, VE = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, FE = 16, zE = pd - 6, UE = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var An = {
  MAX_LENGTH: pd,
  MAX_SAFE_COMPONENT_LENGTH: FE,
  MAX_SAFE_BUILD_LENGTH: zE,
  MAX_SAFE_INTEGER: VE,
  RELEASE_TYPES: UE,
  SEMVER_SPEC_VERSION: LE,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const qE = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Ds = qE;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = An, a = Ds;
  t = e.exports = {};
  const o = t.re = [], u = t.safeRe = [], c = t.src = [], d = t.safeSrc = [], l = t.t = {};
  let h = 0;
  const E = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", s],
    [E, n]
  ], w = (y) => {
    for (const [m, v] of g)
      y = y.split(`${m}*`).join(`${m}{0,${v}}`).split(`${m}+`).join(`${m}{1,${v}}`);
    return y;
  }, _ = (y, m, v) => {
    const N = w(m), R = h++;
    a(y, R, m), l[y] = R, c[R] = m, d[R] = N, o[R] = new RegExp(m, v ? "g" : void 0), u[R] = new RegExp(N, v ? "g" : void 0);
  };
  _("NUMERICIDENTIFIER", "0|[1-9]\\d*"), _("NUMERICIDENTIFIERLOOSE", "\\d+"), _("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${E}*`), _("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), _("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), _("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), _("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), _("BUILDIDENTIFIER", `${E}+`), _("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), _("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), _("FULL", `^${c[l.FULLPLAIN]}$`), _("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), _("LOOSE", `^${c[l.LOOSEPLAIN]}$`), _("GTLT", "((?:<|>)?=?)"), _("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), _("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), _("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), _("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), _("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), _("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), _("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), _("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), _("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), _("COERCERTL", c[l.COERCE], !0), _("COERCERTLFULL", c[l.COERCEFULL], !0), _("LONETILDE", "(?:~>?)"), _("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", _("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), _("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), _("LONECARET", "(?:\\^)"), _("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", _("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), _("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), _("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), _("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), _("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", _("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), _("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), _("STAR", "(<|>)?=?\\s*\\*"), _("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), _("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Ia, Ia.exports);
var Cn = Ia.exports;
const KE = Object.freeze({ loose: !0 }), GE = Object.freeze({}), HE = (e) => e ? typeof e != "object" ? KE : e : GE;
var Ri = HE;
const Kc = /^[0-9]+$/, $d = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Kc.test(e), n = Kc.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, BE = (e, t) => $d(t, e);
var yd = {
  compareIdentifiers: $d,
  rcompareIdentifiers: BE
};
const Wn = Ds, { MAX_LENGTH: Gc, MAX_SAFE_INTEGER: Xn } = An, { safeRe: Jn, t: Yn } = Cn, WE = Ri, { compareIdentifiers: ra } = yd;
let XE = class ct {
  constructor(t, r) {
    if (r = WE(r), t instanceof ct) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Gc)
      throw new TypeError(
        `version is longer than ${Gc} characters`
      );
    Wn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Jn[Yn.LOOSE] : Jn[Yn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Xn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Xn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Xn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < Xn)
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
    if (Wn("SemVer.compare", this.version, this.options, t), !(t instanceof ct)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new ct(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof ct || (t = new ct(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof ct || (t = new ct(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = t.prerelease[r];
      if (Wn("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return ra(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof ct || (t = new ct(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (Wn("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return ra(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? Jn[Yn.PRERELEASELOOSE] : Jn[Yn.PRERELEASE]);
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
          n === !1 && (a = [r]), ra(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var je = XE;
const Hc = je, JE = (e, t, r = !1) => {
  if (e instanceof Hc)
    return e;
  try {
    return new Hc(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var vr = JE;
const YE = vr, QE = (e, t) => {
  const r = YE(e, t);
  return r ? r.version : null;
};
var ZE = QE;
const xE = vr, eb = (e, t) => {
  const r = xE(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var tb = eb;
const Bc = je, rb = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Bc(
      e instanceof Bc ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var nb = rb;
const Wc = vr, sb = (e, t) => {
  const r = Wc(e, null, !0), n = Wc(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const a = s > 0, o = a ? r : n, u = a ? n : r, c = !!o.prerelease.length;
  if (!!u.prerelease.length && !c) {
    if (!u.patch && !u.minor)
      return "major";
    if (u.compareMain(o) === 0)
      return u.minor && !u.patch ? "minor" : "patch";
  }
  const l = c ? "pre" : "";
  return r.major !== n.major ? l + "major" : r.minor !== n.minor ? l + "minor" : r.patch !== n.patch ? l + "patch" : "prerelease";
};
var ab = sb;
const ob = je, ib = (e, t) => new ob(e, t).major;
var cb = ib;
const lb = je, ub = (e, t) => new lb(e, t).minor;
var db = ub;
const fb = je, hb = (e, t) => new fb(e, t).patch;
var mb = hb;
const pb = vr, $b = (e, t) => {
  const r = pb(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var yb = $b;
const Xc = je, gb = (e, t, r) => new Xc(e, r).compare(new Xc(t, r));
var at = gb;
const _b = at, vb = (e, t, r) => _b(t, e, r);
var wb = vb;
const Eb = at, bb = (e, t) => Eb(e, t, !0);
var Sb = bb;
const Jc = je, Pb = (e, t, r) => {
  const n = new Jc(e, r), s = new Jc(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var Oi = Pb;
const Nb = Oi, Rb = (e, t) => e.sort((r, n) => Nb(r, n, t));
var Ob = Rb;
const Tb = Oi, Ib = (e, t) => e.sort((r, n) => Tb(n, r, t));
var jb = Ib;
const kb = at, Ab = (e, t, r) => kb(e, t, r) > 0;
var Ms = Ab;
const Cb = at, Db = (e, t, r) => Cb(e, t, r) < 0;
var Ti = Db;
const Mb = at, Lb = (e, t, r) => Mb(e, t, r) === 0;
var gd = Lb;
const Vb = at, Fb = (e, t, r) => Vb(e, t, r) !== 0;
var _d = Fb;
const zb = at, Ub = (e, t, r) => zb(e, t, r) >= 0;
var Ii = Ub;
const qb = at, Kb = (e, t, r) => qb(e, t, r) <= 0;
var ji = Kb;
const Gb = gd, Hb = _d, Bb = Ms, Wb = Ii, Xb = Ti, Jb = ji, Yb = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return Gb(e, r, n);
    case "!=":
      return Hb(e, r, n);
    case ">":
      return Bb(e, r, n);
    case ">=":
      return Wb(e, r, n);
    case "<":
      return Xb(e, r, n);
    case "<=":
      return Jb(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var vd = Yb;
const Qb = je, Zb = vr, { safeRe: Qn, t: Zn } = Cn, xb = (e, t) => {
  if (e instanceof Qb)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Qn[Zn.COERCEFULL] : Qn[Zn.COERCE]);
  else {
    const c = t.includePrerelease ? Qn[Zn.COERCERTLFULL] : Qn[Zn.COERCERTL];
    let d;
    for (; (d = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), c.lastIndex = d.index + d[1].length + d[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", u = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return Zb(`${n}.${s}.${a}${o}${u}`, t);
};
var e1 = xb;
const t1 = vr, r1 = An, n1 = je, s1 = (e, t, r) => {
  if (!r1.RELEASE_TYPES.includes(t))
    return null;
  const n = a1(e, r);
  return n && o1(n, t);
}, a1 = (e, t) => {
  const r = e instanceof n1 ? e.version : e;
  return t1(r, t);
}, o1 = (e, t) => {
  if (i1(t))
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
}, i1 = (e) => e.startsWith("pre");
var c1 = s1;
class l1 {
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
var u1 = l1, na, Yc;
function ot() {
  if (Yc) return na;
  Yc = 1;
  const e = /\s+/g;
  class t {
    constructor(j, z) {
      if (z = s(z), j instanceof t)
        return j.loose === !!z.loose && j.includePrerelease === !!z.includePrerelease ? j : new t(j.raw, z);
      if (j instanceof a)
        return this.raw = j.value, this.set = [[j]], this.formatted = void 0, this;
      if (this.options = z, this.loose = !!z.loose, this.includePrerelease = !!z.includePrerelease, this.raw = j.trim().replace(e, " "), this.set = this.raw.split("||").map((M) => this.parseRange(M.trim())).filter((M) => M.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const M = this.set[0];
        if (this.set = this.set.filter((P) => !m(P[0])), this.set.length === 0)
          this.set = [M];
        else if (this.set.length > 1) {
          for (const P of this.set)
            if (P.length === 1 && v(P[0])) {
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
        for (let j = 0; j < this.set.length; j++) {
          j > 0 && (this.formatted += "||");
          const z = this.set[j];
          for (let M = 0; M < z.length; M++)
            M > 0 && (this.formatted += " "), this.formatted += z[M].toString().trim();
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
    parseRange(j) {
      j = j.replace(y, "");
      const M = ((this.options.includePrerelease && w) | (this.options.loose && _)) + ":" + j, P = n.get(M);
      if (P)
        return P;
      const p = this.options.loose, S = p ? c[l.HYPHENRANGELOOSE] : c[l.HYPHENRANGE];
      j = j.replace(S, H(this.options.includePrerelease)), o("hyphen replace", j), j = j.replace(c[l.COMPARATORTRIM], h), o("comparator trim", j), j = j.replace(c[l.TILDETRIM], E), o("tilde trim", j), j = j.replace(c[l.CARETTRIM], g), o("caret trim", j);
      let $ = j.split(" ").map((T) => R(T, this.options)).join(" ").split(/\s+/).map((T) => ae(T, this.options));
      p && ($ = $.filter((T) => (o("loose invalid filter", T, this.options), !!T.match(c[l.COMPARATORLOOSE])))), o("range list", $);
      const i = /* @__PURE__ */ new Map(), f = $.map((T) => new a(T, this.options));
      for (const T of f) {
        if (m(T))
          return [T];
        i.set(T.value, T);
      }
      i.size > 1 && i.has("") && i.delete("");
      const b = [...i.values()];
      return n.set(M, b), b;
    }
    intersects(j, z) {
      if (!(j instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((M) => N(M, z) && j.set.some((P) => N(P, z) && M.every((p) => P.every((S) => p.intersects(S, z)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(j) {
      if (!j)
        return !1;
      if (typeof j == "string")
        try {
          j = new u(j, this.options);
        } catch {
          return !1;
        }
      for (let z = 0; z < this.set.length; z++)
        if (ce(this.set[z], j, this.options))
          return !0;
      return !1;
    }
  }
  na = t;
  const r = u1, n = new r(), s = Ri, a = Ls(), o = Ds, u = je, {
    safeRe: c,
    src: d,
    t: l,
    comparatorTrimReplace: h,
    tildeTrimReplace: E,
    caretTrimReplace: g
  } = Cn, { FLAG_INCLUDE_PRERELEASE: w, FLAG_LOOSE: _ } = An, y = new RegExp(d[l.BUILD], "g"), m = (A) => A.value === "<0.0.0-0", v = (A) => A.value === "", N = (A, j) => {
    let z = !0;
    const M = A.slice();
    let P = M.pop();
    for (; z && M.length; )
      z = M.every((p) => P.intersects(p, j)), P = M.pop();
    return z;
  }, R = (A, j) => (A = A.replace(c[l.BUILD], ""), o("comp", A, j), A = de(A, j), o("caret", A), A = K(A, j), o("tildes", A), A = $e(A, j), o("xrange", A), A = G(A, j), o("stars", A), A), O = (A) => !A || A.toLowerCase() === "x" || A === "*", K = (A, j) => A.trim().split(/\s+/).map((z) => X(z, j)).join(" "), X = (A, j) => {
    const z = j.loose ? c[l.TILDELOOSE] : c[l.TILDE];
    return A.replace(z, (M, P, p, S, $) => {
      o("tilde", A, M, P, p, S, $);
      let i;
      return O(P) ? i = "" : O(p) ? i = `>=${P}.0.0 <${+P + 1}.0.0-0` : O(S) ? i = `>=${P}.${p}.0 <${P}.${+p + 1}.0-0` : $ ? (o("replaceTilde pr", $), i = `>=${P}.${p}.${S}-${$} <${P}.${+p + 1}.0-0`) : i = `>=${P}.${p}.${S} <${P}.${+p + 1}.0-0`, o("tilde return", i), i;
    });
  }, de = (A, j) => A.trim().split(/\s+/).map((z) => he(z, j)).join(" "), he = (A, j) => {
    o("caret", A, j);
    const z = j.loose ? c[l.CARETLOOSE] : c[l.CARET], M = j.includePrerelease ? "-0" : "";
    return A.replace(z, (P, p, S, $, i) => {
      o("caret", A, P, p, S, $, i);
      let f;
      return O(p) ? f = "" : O(S) ? f = `>=${p}.0.0${M} <${+p + 1}.0.0-0` : O($) ? p === "0" ? f = `>=${p}.${S}.0${M} <${p}.${+S + 1}.0-0` : f = `>=${p}.${S}.0${M} <${+p + 1}.0.0-0` : i ? (o("replaceCaret pr", i), p === "0" ? S === "0" ? f = `>=${p}.${S}.${$}-${i} <${p}.${S}.${+$ + 1}-0` : f = `>=${p}.${S}.${$}-${i} <${p}.${+S + 1}.0-0` : f = `>=${p}.${S}.${$}-${i} <${+p + 1}.0.0-0`) : (o("no pr"), p === "0" ? S === "0" ? f = `>=${p}.${S}.${$}${M} <${p}.${S}.${+$ + 1}-0` : f = `>=${p}.${S}.${$}${M} <${p}.${+S + 1}.0-0` : f = `>=${p}.${S}.${$} <${+p + 1}.0.0-0`), o("caret return", f), f;
    });
  }, $e = (A, j) => (o("replaceXRanges", A, j), A.split(/\s+/).map((z) => F(z, j)).join(" ")), F = (A, j) => {
    A = A.trim();
    const z = j.loose ? c[l.XRANGELOOSE] : c[l.XRANGE];
    return A.replace(z, (M, P, p, S, $, i) => {
      o("xRange", A, M, P, p, S, $, i);
      const f = O(p), b = f || O(S), T = b || O($), I = T;
      return P === "=" && I && (P = ""), i = j.includePrerelease ? "-0" : "", f ? P === ">" || P === "<" ? M = "<0.0.0-0" : M = "*" : P && I ? (b && (S = 0), $ = 0, P === ">" ? (P = ">=", b ? (p = +p + 1, S = 0, $ = 0) : (S = +S + 1, $ = 0)) : P === "<=" && (P = "<", b ? p = +p + 1 : S = +S + 1), P === "<" && (i = "-0"), M = `${P + p}.${S}.${$}${i}`) : b ? M = `>=${p}.0.0${i} <${+p + 1}.0.0-0` : T && (M = `>=${p}.${S}.0${i} <${p}.${+S + 1}.0-0`), o("xRange return", M), M;
    });
  }, G = (A, j) => (o("replaceStars", A, j), A.trim().replace(c[l.STAR], "")), ae = (A, j) => (o("replaceGTE0", A, j), A.trim().replace(c[j.includePrerelease ? l.GTE0PRE : l.GTE0], "")), H = (A) => (j, z, M, P, p, S, $, i, f, b, T, I) => (O(M) ? z = "" : O(P) ? z = `>=${M}.0.0${A ? "-0" : ""}` : O(p) ? z = `>=${M}.${P}.0${A ? "-0" : ""}` : S ? z = `>=${z}` : z = `>=${z}${A ? "-0" : ""}`, O(f) ? i = "" : O(b) ? i = `<${+f + 1}.0.0-0` : O(T) ? i = `<${f}.${+b + 1}.0-0` : I ? i = `<=${f}.${b}.${T}-${I}` : A ? i = `<${f}.${b}.${+T + 1}-0` : i = `<=${i}`, `${z} ${i}`.trim()), ce = (A, j, z) => {
    for (let M = 0; M < A.length; M++)
      if (!A[M].test(j))
        return !1;
    if (j.prerelease.length && !z.includePrerelease) {
      for (let M = 0; M < A.length; M++)
        if (o(A[M].semver), A[M].semver !== a.ANY && A[M].semver.prerelease.length > 0) {
          const P = A[M].semver;
          if (P.major === j.major && P.minor === j.minor && P.patch === j.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return na;
}
var sa, Qc;
function Ls() {
  if (Qc) return sa;
  Qc = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(l, h) {
      if (h = r(h), l instanceof t) {
        if (l.loose === !!h.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), o("comparator", l, h), this.options = h, this.loose = !!h.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(l) {
      const h = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], E = l.match(h);
      if (!E)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = E[1] !== void 0 ? E[1] : "", this.operator === "=" && (this.operator = ""), E[2] ? this.semver = new u(E[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (o("Comparator.test", l, this.options.loose), this.semver === e || l === e)
        return !0;
      if (typeof l == "string")
        try {
          l = new u(l, this.options);
        } catch {
          return !1;
        }
      return a(l, this.operator, this.semver, this.options);
    }
    intersects(l, h) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(l.value, h).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new c(this.value, h).test(l.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || a(this.semver, "<", l.semver, h) && this.operator.startsWith(">") && l.operator.startsWith("<") || a(this.semver, ">", l.semver, h) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  sa = t;
  const r = Ri, { safeRe: n, t: s } = Cn, a = vd, o = Ds, u = je, c = ot();
  return sa;
}
const d1 = ot(), f1 = (e, t, r) => {
  try {
    t = new d1(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Vs = f1;
const h1 = ot(), m1 = (e, t) => new h1(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var p1 = m1;
const $1 = je, y1 = ot(), g1 = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new y1(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === -1) && (n = o, s = new $1(n, r));
  }), n;
};
var _1 = g1;
const v1 = je, w1 = ot(), E1 = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new w1(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === 1) && (n = o, s = new v1(n, r));
  }), n;
};
var b1 = E1;
const aa = je, S1 = ot(), Zc = Ms, P1 = (e, t) => {
  e = new S1(e, t);
  let r = new aa("0.0.0");
  if (e.test(r) || (r = new aa("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let a = null;
    s.forEach((o) => {
      const u = new aa(o.semver.version);
      switch (o.operator) {
        case ">":
          u.prerelease.length === 0 ? u.patch++ : u.prerelease.push(0), u.raw = u.format();
        case "":
        case ">=":
          (!a || Zc(u, a)) && (a = u);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || Zc(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var N1 = P1;
const R1 = ot(), O1 = (e, t) => {
  try {
    return new R1(e, t).range || "*";
  } catch {
    return null;
  }
};
var T1 = O1;
const I1 = je, wd = Ls(), { ANY: j1 } = wd, k1 = ot(), A1 = Vs, xc = Ms, el = Ti, C1 = ji, D1 = Ii, M1 = (e, t, r, n) => {
  e = new I1(e, n), t = new k1(t, n);
  let s, a, o, u, c;
  switch (r) {
    case ">":
      s = xc, a = C1, o = el, u = ">", c = ">=";
      break;
    case "<":
      s = el, a = D1, o = xc, u = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (A1(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const l = t.set[d];
    let h = null, E = null;
    if (l.forEach((g) => {
      g.semver === j1 && (g = new wd(">=0.0.0")), h = h || g, E = E || g, s(g.semver, h.semver, n) ? h = g : o(g.semver, E.semver, n) && (E = g);
    }), h.operator === u || h.operator === c || (!E.operator || E.operator === u) && a(e, E.semver))
      return !1;
    if (E.operator === c && o(e, E.semver))
      return !1;
  }
  return !0;
};
var ki = M1;
const L1 = ki, V1 = (e, t, r) => L1(e, t, ">", r);
var F1 = V1;
const z1 = ki, U1 = (e, t, r) => z1(e, t, "<", r);
var q1 = U1;
const tl = ot(), K1 = (e, t, r) => (e = new tl(e, r), t = new tl(t, r), e.intersects(t, r));
var G1 = K1;
const H1 = Vs, B1 = at;
var W1 = (e, t, r) => {
  const n = [];
  let s = null, a = null;
  const o = e.sort((l, h) => B1(l, h, r));
  for (const l of o)
    H1(l, t, r) ? (a = l, s || (s = l)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const u = [];
  for (const [l, h] of n)
    l === h ? u.push(l) : !h && l === o[0] ? u.push("*") : h ? l === o[0] ? u.push(`<=${h}`) : u.push(`${l} - ${h}`) : u.push(`>=${l}`);
  const c = u.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < d.length ? c : t;
};
const rl = ot(), Ai = Ls(), { ANY: oa } = Ai, ia = Vs, Ci = at, X1 = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new rl(e, r), t = new rl(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const a of t.set) {
      const o = Y1(s, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, J1 = [new Ai(">=0.0.0-0")], nl = [new Ai(">=0.0.0")], Y1 = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === oa) {
    if (t.length === 1 && t[0].semver === oa)
      return !0;
    r.includePrerelease ? e = J1 : e = nl;
  }
  if (t.length === 1 && t[0].semver === oa) {
    if (r.includePrerelease)
      return !0;
    t = nl;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? s = sl(s, g, r) : g.operator === "<" || g.operator === "<=" ? a = al(a, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let o;
  if (s && a) {
    if (o = Ci(s.semver, a.semver, r), o > 0)
      return null;
    if (o === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const g of n) {
    if (s && !ia(g, String(s), r) || a && !ia(g, String(a), r))
      return null;
    for (const w of t)
      if (!ia(g, String(w), r))
        return !1;
    return !0;
  }
  let u, c, d, l, h = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, E = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && a.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const g of t) {
    if (l = l || g.operator === ">" || g.operator === ">=", d = d || g.operator === "<" || g.operator === "<=", s) {
      if (E && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === E.major && g.semver.minor === E.minor && g.semver.patch === E.patch && (E = !1), g.operator === ">" || g.operator === ">=") {
        if (u = sl(s, g, r), u === g && u !== s)
          return !1;
      } else if (s.operator === ">=" && !g.test(s.semver))
        return !1;
    }
    if (a) {
      if (h && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === h.major && g.semver.minor === h.minor && g.semver.patch === h.patch && (h = !1), g.operator === "<" || g.operator === "<=") {
        if (c = al(a, g, r), c === g && c !== a)
          return !1;
      } else if (a.operator === "<=" && !g.test(a.semver))
        return !1;
    }
    if (!g.operator && (a || s) && o !== 0)
      return !1;
  }
  return !(s && d && !a && o !== 0 || a && l && !s && o !== 0 || E || h);
}, sl = (e, t, r) => {
  if (!e)
    return t;
  const n = Ci(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, al = (e, t, r) => {
  if (!e)
    return t;
  const n = Ci(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Q1 = X1;
const ca = Cn, ol = An, Z1 = je, il = yd, x1 = vr, eS = ZE, tS = tb, rS = nb, nS = ab, sS = cb, aS = db, oS = mb, iS = yb, cS = at, lS = wb, uS = Sb, dS = Oi, fS = Ob, hS = jb, mS = Ms, pS = Ti, $S = gd, yS = _d, gS = Ii, _S = ji, vS = vd, wS = e1, ES = c1, bS = Ls(), SS = ot(), PS = Vs, NS = p1, RS = _1, OS = b1, TS = N1, IS = T1, jS = ki, kS = F1, AS = q1, CS = G1, DS = W1, MS = Q1;
var LS = {
  parse: x1,
  valid: eS,
  clean: tS,
  inc: rS,
  diff: nS,
  major: sS,
  minor: aS,
  patch: oS,
  prerelease: iS,
  compare: cS,
  rcompare: lS,
  compareLoose: uS,
  compareBuild: dS,
  sort: fS,
  rsort: hS,
  gt: mS,
  lt: pS,
  eq: $S,
  neq: yS,
  gte: gS,
  lte: _S,
  cmp: vS,
  coerce: wS,
  truncate: ES,
  Comparator: bS,
  Range: SS,
  satisfies: PS,
  toComparators: NS,
  maxSatisfying: RS,
  minSatisfying: OS,
  minVersion: TS,
  validRange: IS,
  outside: jS,
  gtr: kS,
  ltr: AS,
  intersects: CS,
  simplifyRange: DS,
  subset: MS,
  SemVer: Z1,
  re: ca.re,
  src: ca.src,
  tokens: ca.t,
  SEMVER_SPEC_VERSION: ol.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: ol.RELEASE_TYPES,
  compareIdentifiers: il.compareIdentifiers,
  rcompareIdentifiers: il.rcompareIdentifiers
};
const Pr = /* @__PURE__ */ El(LS), VS = Object.prototype.toString, FS = "[object Uint8Array]", zS = "[object ArrayBuffer]";
function Ed(e, t, r) {
  return e ? e.constructor === t ? !0 : VS.call(e) === r : !1;
}
function bd(e) {
  return Ed(e, Uint8Array, FS);
}
function US(e) {
  return Ed(e, ArrayBuffer, zS);
}
function qS(e) {
  return bd(e) || US(e);
}
function KS(e) {
  if (!bd(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function GS(e) {
  if (!qS(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function la(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    KS(s), r.set(s, n), n += s.length;
  return r;
}
const xn = {
  utf8: new globalThis.TextDecoder("utf8")
};
function es(e, t = "utf8") {
  return GS(e), xn[t] ?? (xn[t] = new globalThis.TextDecoder(t)), xn[t].decode(e);
}
function HS(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const BS = new globalThis.TextEncoder();
function ua(e) {
  return HS(e), BS.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const cl = "aes-256-cbc", Sd = /* @__PURE__ */ new Set([
  "aes-256-cbc",
  "aes-256-gcm",
  "aes-256-ctr"
]), WS = (e) => typeof e == "string" && Sd.has(e), yt = () => /* @__PURE__ */ Object.create(null), ll = (e) => e !== void 0, da = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, At = "__internal__", fa = `${At}.migrations.version`;
var Dt, Mt, dr, Me, Ge, fr, hr, zr, lt, _e, Pd, Nd, Rd, Od, Td, Id, jd, kd;
class XS {
  constructor(t = {}) {
    Je(this, _e);
    rn(this, "path");
    rn(this, "events");
    Je(this, Dt);
    Je(this, Mt);
    Je(this, dr);
    Je(this, Me);
    Je(this, Ge, {});
    Je(this, fr, !1);
    Je(this, hr);
    Je(this, zr);
    Je(this, lt);
    rn(this, "_deserialize", (t) => JSON.parse(t));
    rn(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = pt(this, _e, Pd).call(this, t);
    De(this, Me, r), pt(this, _e, Nd).call(this, r), pt(this, _e, Od).call(this, r), pt(this, _e, Td).call(this, r), this.events = new EventTarget(), De(this, Mt, r.encryptionKey), De(this, dr, r.encryptionAlgorithm ?? cl), this.path = pt(this, _e, Id).call(this, r), pt(this, _e, jd).call(this, r), r.watch && this._watch();
  }
  get(t, r) {
    if (J(this, Me).accessPropertiesByDotNotation)
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
      throw new TypeError(`Please don't use the ${At} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, o) => {
      if (da(a, o), J(this, Me).accessPropertiesByDotNotation)
        Dn(n, a, o);
      else {
        if (a === "__proto__" || a === "constructor" || a === "prototype")
          return;
        n[a] = o;
      }
    };
    if (typeof t == "object") {
      const a = t;
      for (const [o, u] of Object.entries(a))
        s(o, u);
    } else
      s(t, r);
    this.store = n;
  }
  has(t) {
    return J(this, Me).accessPropertiesByDotNotation ? Ks(this.store, t) : t in this.store;
  }
  appendToArray(t, r) {
    da(t, r);
    const n = J(this, Me).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
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
      ll(J(this, Ge)[r]) && this.set(r, J(this, Ge)[r]);
  }
  delete(t) {
    const { store: r } = this;
    J(this, Me).accessPropertiesByDotNotation ? Jd(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = yt();
    for (const r of Object.keys(J(this, Ge)))
      ll(J(this, Ge)[r]) && (da(r, J(this, Ge)[r]), J(this, Me).accessPropertiesByDotNotation ? Dn(t, r, J(this, Ge)[r]) : t[r] = J(this, Ge)[r]);
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
      const r = Y.readFileSync(this.path, J(this, Mt) ? null : "utf8"), n = this._decryptData(r);
      return ((a) => {
        const o = this._deserialize(a);
        return J(this, fr) || this._validate(o), Object.assign(yt(), o);
      })(n);
    } catch (r) {
      if ((r == null ? void 0 : r.code) === "ENOENT")
        return this._ensureDirectory(), yt();
      if (J(this, Me).clearInvalidConfig) {
        const n = r;
        if (n.name === "SyntaxError" || (t = n.message) != null && t.startsWith("Config schema violation:") || n.message === "Failed to decrypt config data.")
          return yt();
      }
      throw r;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !Ks(t, At))
      try {
        const r = Y.readFileSync(this.path, J(this, Mt) ? null : "utf8"), n = this._decryptData(r), s = this._deserialize(n);
        Ks(s, At) && Dn(t, At, zi(s, At));
      } catch {
      }
    J(this, fr) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, r]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    J(this, hr) && (J(this, hr).close(), De(this, hr, void 0)), J(this, zr) && (Y.unwatchFile(this.path), De(this, zr, !1)), De(this, lt, void 0);
  }
  _decryptData(t) {
    const r = J(this, Mt);
    if (!r)
      return typeof t == "string" ? t : es(t);
    const n = J(this, dr), s = n === "aes-256-gcm" ? 16 : 0, a = ":".codePointAt(0), o = typeof t == "string" ? t.codePointAt(16) : t[16];
    if (!(a !== void 0 && o === a)) {
      if (n === "aes-256-cbc")
        return typeof t == "string" ? t : es(t);
      throw new Error("Failed to decrypt config data.");
    }
    const c = (g) => {
      if (s === 0)
        return { ciphertext: g };
      const w = g.length - s;
      if (w < 0)
        throw new Error("Invalid authentication tag length.");
      return {
        ciphertext: g.slice(0, w),
        authenticationTag: g.slice(w)
      };
    }, d = t.slice(0, 16), l = t.slice(17), h = typeof l == "string" ? ua(l) : l, E = (g) => {
      const { ciphertext: w, authenticationTag: _ } = c(h), y = nn.pbkdf2Sync(r, g, 1e4, 32, "sha512"), m = nn.createDecipheriv(n, y, d);
      return _ && m.setAuthTag(_), es(la([m.update(w), m.final()]));
    };
    try {
      return E(d);
    } catch {
      try {
        return E(d.toString());
      } catch {
      }
    }
    if (n === "aes-256-cbc")
      return typeof t == "string" ? t : es(t);
    throw new Error("Failed to decrypt config data.");
  }
  _handleStoreChange(t) {
    let r = this.store;
    const n = () => {
      const s = r, a = this.store;
      Vi(a, s) || (r = a, t.call(this, a, s));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(t, r) {
    let n = t();
    const s = () => {
      const a = n, o = t();
      Vi(o, a) || (n = o, r.call(this, o, a));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(t) {
    if (!J(this, Dt) || J(this, Dt).call(this, t) || !J(this, Dt).errors)
      return;
    const n = J(this, Dt).errors.map(({ instancePath: s, message: a = "" }) => `\`${s.slice(1)}\` ${a}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    Y.mkdirSync(Q.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    const n = J(this, Mt);
    if (n) {
      const s = nn.randomBytes(16), a = nn.pbkdf2Sync(n, s, 1e4, 32, "sha512"), o = nn.createCipheriv(J(this, dr), a, s), u = la([o.update(ua(r)), o.final()]), c = [s, ua(":"), u];
      J(this, dr) === "aes-256-gcm" && c.push(o.getAuthTag()), r = la(c);
    }
    if (fe.env.SNAP)
      Y.writeFileSync(this.path, r, { mode: J(this, Me).configFileMode });
    else
      try {
        wl(this.path, r, { mode: J(this, Me).configFileMode });
      } catch (s) {
        if ((s == null ? void 0 : s.code) === "EXDEV") {
          Y.writeFileSync(this.path, r, { mode: J(this, Me).configFileMode });
          return;
        }
        throw s;
      }
  }
  _watch() {
    if (this._ensureDirectory(), Y.existsSync(this.path) || this._write(yt()), fe.platform === "win32" || fe.platform === "darwin") {
      J(this, lt) ?? De(this, lt, qc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = Q.dirname(this.path), r = Q.basename(this.path);
      De(this, hr, Y.watch(t, { persistent: !1, encoding: "utf8" }, (n, s) => {
        s && s !== r || typeof J(this, lt) == "function" && J(this, lt).call(this);
      }));
    } else
      J(this, lt) ?? De(this, lt, qc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), Y.watchFile(this.path, { persistent: !1 }, (t, r) => {
        typeof J(this, lt) == "function" && J(this, lt).call(this);
      }), De(this, zr, !0);
  }
  _migrate(t, r, n) {
    let s = this._get(fa, "0.0.0");
    const a = Object.keys(t).filter((u) => this._shouldPerformMigration(u, s, r));
    let o = structuredClone(this.store);
    for (const u of a)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: u,
          finalVersion: r,
          versions: a
        });
        const c = t[u];
        c == null || c(this), this._set(fa, u), s = u, o = structuredClone(this.store);
      } catch (c) {
        this.store = o;
        const d = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${d}`);
      }
    (this._isVersionInRangeFormat(s) || !Pr.eq(s, r)) && this._set(fa, r);
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
    return t === At || t.startsWith(`${At}.`);
  }
  _isVersionInRangeFormat(t) {
    return Pr.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && Pr.satisfies(r, t) ? !1 : Pr.satisfies(n, t) : !(Pr.lte(t, r) || Pr.gt(t, n));
  }
  _get(t, r) {
    return zi(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    Dn(n, t, r), this.store = n;
  }
}
Dt = new WeakMap(), Mt = new WeakMap(), dr = new WeakMap(), Me = new WeakMap(), Ge = new WeakMap(), fr = new WeakMap(), hr = new WeakMap(), zr = new WeakMap(), lt = new WeakMap(), _e = new WeakSet(), Pd = function(t) {
  const r = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (r.encryptionAlgorithm ?? (r.encryptionAlgorithm = cl), !WS(r.encryptionAlgorithm))
    throw new TypeError(`The \`encryptionAlgorithm\` option must be one of: ${[...Sd].join(", ")}`);
  if (!r.cwd) {
    if (!r.projectName)
      throw new Error("Please specify the `projectName` option.");
    r.cwd = xd(r.projectName, { suffix: r.projectSuffix }).config;
  }
  return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
}, Nd = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const r = OE.default, n = new mg.Ajv2020({
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
  De(this, Dt, n.compile(s)), pt(this, _e, Rd).call(this, t.schema);
}, Rd = function(t) {
  const r = Object.entries(t ?? {});
  for (const [n, s] of r) {
    if (!s || typeof s != "object" || !Object.hasOwn(s, "default"))
      continue;
    const { default: a } = s;
    a !== void 0 && (J(this, Ge)[n] = a);
  }
}, Od = function(t) {
  t.defaults && Object.assign(J(this, Ge), t.defaults);
}, Td = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, Id = function(t) {
  const r = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = r ? `.${r}` : "";
  return Q.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
}, jd = function(t) {
  if (t.migrations) {
    pt(this, _e, kd).call(this, t), this._validate(this.store);
    return;
  }
  const r = this.store, n = Object.assign(yt(), t.defaults ?? {}, r);
  this._validate(n);
  try {
    Fi.deepEqual(r, n);
  } catch {
    this.store = n;
  }
}, kd = function(t) {
  const { migrations: r, projectVersion: n } = t;
  if (r) {
    if (!n)
      throw new Error("Please specify the `projectVersion` option.");
    De(this, fr, !0);
    try {
      const s = this.store, a = Object.assign(yt(), t.defaults ?? {}, s);
      try {
        Fi.deepEqual(s, a);
      } catch {
        this._write(a);
      }
      this._migrate(r, n, t.beforeEachMigration);
    } finally {
      De(this, fr, !1);
    }
  }
};
const { app: us, ipcMain: ja, shell: JS } = pl;
let ul = !1;
const dl = () => {
  if (!ja || !us)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: us.getPath("userData"),
    appVersion: us.getVersion()
  };
  return ul || (ja.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), ul = !0), e;
};
class YS extends XS {
  constructor(t) {
    let r, n;
    if (fe.type === "renderer") {
      const s = pl.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else ja && us && ({ defaultCwd: r, appVersion: n } = dl());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = Q.isAbsolute(t.cwd) ? t.cwd : Q.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    dl();
  }
  async openInEditor() {
    const t = await JS.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const Ad = Q.dirname(Gd(import.meta.url));
process.env.APP_ROOT = Q.join(Ad, "../..");
const NP = Q.join(process.env.APP_ROOT, "dist-electron"), Cd = Q.join(process.env.APP_ROOT, "dist"), Nn = process.env.VITE_DEV_SERVER_URL;
process.env.VITE_PUBLIC = Nn ? Q.join(process.env.APP_ROOT, "public") : Cd;
Aa.release().startsWith("6.1") && Ie.disableHardwareAcceleration();
process.platform === "win32" && Ie.setAppUserModelId(Ie.getName());
Ie.requestSingleInstanceLock() || (Ie.quit(), process.exit(0));
const QS = new YS({
  name: "planner-data",
  defaults: {
    shortPlans: [],
    shortTasks: [],
    longTasks: [],
    notifiedTaskIds: []
  }
}), gt = QS;
let k = null, rt = null, it = null, En = null, Di = !0, Fs = !1, fl = "top-right", kr = null, Ar = null, Cr = null, vs = !1;
const Dd = Q.join(Ad, "../preload/index.mjs"), Md = Q.join(Cd, "index.html");
function ZS(e, t) {
  const { workArea: r } = bn.getDisplayMatching(e.getBounds()), n = 0, s = e.getBounds(), a = r.x + n, o = r.x + r.width - s.width - n, u = r.y + n, c = r.y + r.height - s.height - n;
  return {
    x: t.endsWith("right") ? o : a,
    y: t.startsWith("bottom") ? c : u
  };
}
function Fr(e, t = fl) {
  const r = ZS(e, t), n = Math.round(r.x), s = Math.round(r.y), a = e.getBounds();
  fl = t, !(Math.abs(a.x - n) <= 1 && Math.abs(a.y - s) <= 1) && (Cr && clearTimeout(Cr), vs = !0, e.setPosition(n, s, !1), Cr = setTimeout(() => {
    vs = !1, Cr = null;
  }, 160));
}
function xS(e) {
  const t = e.getBounds(), { workArea: r } = bn.getDisplayMatching(t), n = t.x + t.width / 2, s = t.y + t.height / 2, a = n < r.x + r.width / 2 ? "left" : "right";
  return `${s < r.y + r.height / 2 ? "top" : "bottom"}-${a}`;
}
function eP(e) {
  vs || (kr && clearTimeout(kr), kr = setTimeout(() => {
    kr = null, e.isDestroyed() || Fr(e, xS(e));
  }, 520));
}
function tP(e) {
  const t = e.getNativeWindowHandle();
  return process.arch === "x64" ? t.readBigUInt64LE(0).toString() : t.readUInt32LE(0).toString();
}
function rP() {
  const e = "zorder-helper.exe";
  return Ie.isPackaged ? Q.join(process.resourcesPath, e) : Q.join(process.env.APP_ROOT, "build", e);
}
function nP(e = k) {
  if (!e || e.isDestroyed() || (e.setAlwaysOnTop(!1), e.setSkipTaskbar(!0), process.platform !== "win32") || !e.isVisible()) return;
  const t = rP();
  if (!Hd(t)) return;
  const r = tP(e);
  Bd(t, [r], { windowsHide: !0, timeout: 1e3 }, () => {
  });
}
function ur(e = 80) {
  Ar && clearTimeout(Ar), Ar = setTimeout(() => {
    Ar = null, nP();
  }, e);
}
function We(e = !1) {
  !k || k.isDestroyed() || (Di = !0, k.setSkipTaskbar(!0), k.setFocusable(!0), k.setIgnoreMouseEvents(!1), Fr(k), k.showInactive(), k.setSkipTaskbar(!0), ur(e ? 260 : 40));
}
function hl() {
  !k || k.isDestroyed() || (We(!1), ur(120));
}
function qe() {
  if (!rt) return;
  const e = !!(k && !k.isDestroyed() && k.isVisible()), t = Kd.buildFromTemplate([
    {
      label: e ? "隐藏窗口" : "显示窗口",
      click: () => {
        !k || k.isDestroyed() || (k.isVisible() ? k.hide() : We(!0), qe());
      }
    },
    { type: "separator" },
    {
      label: "退出",
      click: () => {
        Fs = !0, Ie.quit();
      }
    }
  ]);
  rt.setToolTip("计划小组件"), rt.setContextMenu(t);
}
function mr(e, t = !1) {
  !k || k.isDestroyed() || (Di = e, k.setAlwaysOnTop(!1), k.setVisibleOnAllWorkspaces(!1), k.setSkipTaskbar(!0), k.setFocusable(e), k.setIgnoreMouseEvents(!e, { forward: !0 }), e ? We(t) : k.isVisible() && (k.blur(), We(!1)), k.webContents.isDestroyed() || k.webContents.send("planner:interactive-changed", e), qe());
}
function sP() {
  if (rt) return;
  const e = Q.join(process.env.VITE_PUBLIC, "favicon.ico"), t = zd.createFromPath(e);
  rt = new Ud(t.isEmpty() ? e : t), rt.on("click", () => {
    !k || k.isDestroyed() || (k.isVisible() ? k.hide() : We(!0), qe());
  }), rt.on("double-click", () => {
    !k || k.isDestroyed() || (We(!0), qe());
  }), qe();
}
function aP() {
  if (it && !it.isDestroyed()) return;
  const { bounds: e } = bn.getDisplayNearestPoint(bn.getCursorScreenPoint());
  it = new ka({
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
      preload: Dd,
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), it.setIgnoreMouseEvents(!0, { forward: !0 }), Nn ? it.loadURL(`${Nn}#celebrate`) : it.loadFile(Md, { hash: "celebrate" }), setTimeout(() => {
    it && !it.isDestroyed() && it.close(), it = null;
  }, 2200);
}
function ml() {
  if (!Li.isSupported()) return;
  const e = Date.now(), t = 5 * 60 * 1e3, r = gt.get("shortTasks"), n = new Set(gt.get("notifiedTaskIds"));
  for (const s of r) {
    if (s.completed) continue;
    const a = new Date(s.dueAt).getTime();
    if (Number.isNaN(a)) continue;
    const o = a - e;
    o >= 0 && o <= t && !n.has(s.id) && (new Li({
      title: "任务提醒",
      body: `${s.title} 将在 5 分钟内到期`,
      silent: !1
    }).show(), n.add(s.id));
  }
  gt.set("notifiedTaskIds", [...n]);
}
function oP() {
  En && clearInterval(En), ml(), En = setInterval(ml, 60 * 1e3);
}
function iP() {
  process.platform === "win32" && Ie.isPackaged && Ie.setLoginItemSettings({
    openAtLogin: !0,
    openAsHidden: !0,
    path: process.execPath,
    args: ["--hidden"]
  });
}
function cP() {
  jt.handle("planner:get-data", () => gt.store), jt.handle("planner:save-short-plans", (e, t) => (gt.set("shortPlans", t), t)), jt.handle("planner:save-short-tasks", (e, t) => {
    gt.set("shortTasks", t);
    const r = new Set(t.filter((s) => !s.completed).map((s) => s.id)), n = gt.get("notifiedTaskIds").filter((s) => r.has(s));
    return gt.set("notifiedTaskIds", n), t;
  }), jt.handle("planner:save-long-tasks", (e, t) => (gt.set("longTasks", t), t)), jt.on("planner:celebrate", () => {
    aP();
  }), jt.on("planner:set-interactive", (e, t) => {
    mr(t, t);
  }), jt.handle("planner:toggle-widget", () => !k || k.isDestroyed() ? !1 : k.isVisible() ? (k.hide(), qe(), !1) : (We(!0), qe(), !0));
}
async function Ld() {
  const e = !process.argv.includes("--show");
  k = new ka({
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
    icon: Q.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload: Dd,
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), k.setSkipTaskbar(!0), Fr(k), Nn ? k.loadURL(Nn) : k.loadFile(Md), k.once("ready-to-show", () => {
    e ? qe() : (mr(!0, !0), hl());
  }), setTimeout(() => {
    k && !k.isDestroyed() && !e && (mr(!0, !0), hl());
  }, 1200), k.webContents.on("did-finish-load", () => {
    k == null || k.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString()), e || (We(!0), mr(!0, !0)), qe();
  }), k.on("show", () => {
    k && (k.setAlwaysOnTop(!1), k.setSkipTaskbar(!0), Fr(k), ur(40), qe());
  }), k.on("hide", qe), k.on("focus", () => ur(80)), k.on("blur", () => ur(40)), k.on("resize", () => {
    k && (Fr(k), ur(120));
  }), k.on("move", () => {
    k && !k.isDestroyed() && !vs && eP(k), ur(180), qe();
  }), k.on("close", (t) => {
    Fs || (t.preventDefault(), k == null || k.hide());
  }), k.webContents.setWindowOpenHandler(({ url: t }) => (t.startsWith("https:") && qd.openExternal(t), { action: "deny" }));
}
Ie.whenReady().then(() => {
  iP(), cP(), sP(), Ld(), oP(), bn.on("display-metrics-changed", () => {
    k && !k.isDestroyed() && Fr(k);
  }), $l.register("CommandOrControl+Shift+T", () => {
    !k || k.isDestroyed() || (k.isVisible() ? (k.hide(), qe()) : We(!0));
  });
});
Ie.on("before-quit", () => {
  Fs = !0;
});
Ie.on("window-all-closed", () => {
  process.platform !== "darwin" && Fs && Ie.quit();
});
Ie.on("will-quit", () => {
  En && clearInterval(En), kr && clearTimeout(kr), Ar && clearTimeout(Ar), Cr && clearTimeout(Cr), $l.unregisterAll(), rt == null || rt.destroy(), rt = null;
});
Ie.on("second-instance", () => {
  k && !k.isDestroyed() && (k.isMinimized() && k.restore(), We(!0), mr(!0, !0));
});
Ie.on("activate", () => {
  ka.getAllWindows().length ? (We(!0), mr(!0, !0)) : Ld();
});
jt.handle("open-win", async (e, t) => {
  !k || k.isDestroyed() || (k.isVisible() || We(!0), typeof t == "string" && t === "toggle-widget" && mr(!Di, !0));
});
export {
  NP as MAIN_DIST,
  Cd as RENDERER_DIST,
  Nn as VITE_DEV_SERVER_URL
};
