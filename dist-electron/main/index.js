var cf = Object.defineProperty;
var Wi = (e) => {
  throw TypeError(e);
};
var lf = (e, t, r) => t in e ? cf(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var on = (e, t, r) => lf(e, typeof t != "symbol" ? t + "" : t, r), Ws = (e, t, r) => t.has(e) || Wi("Cannot " + r);
var J = (e, t, r) => (Ws(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Je = (e, t, r) => t.has(e) ? Wi("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Le = (e, t, r, n) => (Ws(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), yt = (e, t, r) => (Ws(e, t, "access private method"), r);
import kl, { app as je, screen as Kt, globalShortcut as Cl, BrowserWindow as Ko, ipcMain as br, nativeImage as uf, Tray as df, shell as ff, Menu as hf, Notification as Xi } from "electron";
import { fileURLToPath as mf } from "node:url";
import Q from "node:path";
import Go from "node:os";
import Y, { existsSync as pf } from "node:fs";
import { execFile as $f } from "node:child_process";
import fe from "node:process";
import { promisify as Pe, isDeepStrictEqual as Ji } from "node:util";
import an from "node:crypto";
import Yi from "node:assert";
import "node:events";
import "node:stream";
import * as bo from "@hicccc77/electron-liquid-glass";
const yr = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, Dl = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), Ml = 1e6, yf = (e) => e >= "0" && e <= "9";
function Ll(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= Ml;
  }
  return !1;
}
function Xs(e, t) {
  return Dl.has(e) ? !1 : (e && Ll(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function gf(e) {
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
        if (!Xs(r, t))
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
          if ((r || n === "property") && !Xs(r, t))
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
            !Number.isNaN(l) && Number.isFinite(l) && l >= 0 && l <= Number.MAX_SAFE_INTEGER && l <= Ml && r === String(l) ? t.push(l) : t.push(r), r = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${a}' after an index at position ${o}`);
        r += a;
        break;
      }
      default: {
        if (n === "index" && !yf(a))
          throw new Error(`Invalid character '${a}' in an index at position ${o}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${a}' after an index at position ${o}`);
        n === "start" && (n = "property"), r += a;
      }
    }
  }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (!Xs(r, t))
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
function Ns(e) {
  if (typeof e == "string")
    return gf(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [r, n] of e.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${r}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${r} must be a finite number, got ${n}`);
      if (Dl.has(n))
        return [];
      typeof n == "string" && Ll(n) ? t.push(Number.parseInt(n, 10)) : t.push(n);
    }
    return t;
  }
  return [];
}
function Qi(e, t, r) {
  if (!yr(e) || typeof t != "string" && !Array.isArray(t))
    return r === void 0 ? e : r;
  const n = Ns(t);
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
function Mn(e, t, r) {
  if (!yr(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, s = Ns(t);
  if (s.length === 0)
    return e;
  for (let o = 0; o < s.length; o++) {
    const a = s[o];
    if (o === s.length - 1)
      e[a] = r;
    else if (!yr(e[a])) {
      const c = typeof s[o + 1] == "number";
      e[a] = c ? [] : {};
    }
    e = e[a];
  }
  return n;
}
function _f(e, t) {
  if (!yr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = Ns(t);
  if (r.length === 0)
    return !1;
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (n === r.length - 1)
      return Object.hasOwn(e, s) ? (delete e[s], !0) : !1;
    if (e = e[s], !yr(e))
      return !1;
  }
}
function Js(e, t) {
  if (!yr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = Ns(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!yr(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const Mt = Go.homedir(), Ho = Go.tmpdir(), { env: jr } = fe, vf = (e) => {
  const t = Q.join(Mt, "Library");
  return {
    data: Q.join(t, "Application Support", e),
    config: Q.join(t, "Preferences", e),
    cache: Q.join(t, "Caches", e),
    log: Q.join(t, "Logs", e),
    temp: Q.join(Ho, e)
  };
}, wf = (e) => {
  const t = jr.APPDATA || Q.join(Mt, "AppData", "Roaming"), r = jr.LOCALAPPDATA || Q.join(Mt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: Q.join(r, e, "Data"),
    config: Q.join(t, e, "Config"),
    cache: Q.join(r, e, "Cache"),
    log: Q.join(r, e, "Log"),
    temp: Q.join(Ho, e)
  };
}, Ef = (e) => {
  const t = Q.basename(Mt);
  return {
    data: Q.join(jr.XDG_DATA_HOME || Q.join(Mt, ".local", "share"), e),
    config: Q.join(jr.XDG_CONFIG_HOME || Q.join(Mt, ".config"), e),
    cache: Q.join(jr.XDG_CACHE_HOME || Q.join(Mt, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: Q.join(jr.XDG_STATE_HOME || Q.join(Mt, ".local", "state"), e),
    temp: Q.join(Ho, t, e)
  };
};
function bf(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), fe.platform === "darwin" ? vf(e) : fe.platform === "win32" ? wf(e) : Ef(e);
}
const Nt = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    return e.apply(void 0, s).catch(r);
  };
}, gt = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    try {
      return e.apply(void 0, s);
    } catch (o) {
      return r(o);
    }
  };
}, Sf = 250, Rt = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: o } = s, a = s.interval ?? Sf, l = Date.now() + o;
    return function c(...d) {
      return e.apply(void 0, d).catch((u) => {
        if (!r(u) || Date.now() >= l)
          throw u;
        const h = Math.round(a * Math.random());
        return h > 0 ? new Promise((g) => setTimeout(g, h)).then(() => c.apply(void 0, d)) : c.apply(void 0, d);
      });
    };
  };
}, Tt = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: o } = s, a = Date.now() + o;
    return function(...c) {
      for (; ; )
        try {
          return e.apply(void 0, c);
        } catch (d) {
          if (!r(d) || Date.now() >= a)
            throw d;
          continue;
        }
    };
  };
}, Ar = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!Ar.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !Pf && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!Ar.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!Ar.isNodeError(e))
      throw e;
    if (!Ar.isChangeErrorOk(e))
      throw e;
  }
}, Ln = {
  onError: Ar.onChangeError
}, Ke = {
  onError: () => {
  }
}, Pf = fe.getuid ? !fe.getuid() : !1, Ne = {
  isRetriable: Ar.isRetriableError
}, Oe = {
  attempt: {
    /* ASYNC */
    chmod: Nt(Pe(Y.chmod), Ln),
    chown: Nt(Pe(Y.chown), Ln),
    close: Nt(Pe(Y.close), Ke),
    fsync: Nt(Pe(Y.fsync), Ke),
    mkdir: Nt(Pe(Y.mkdir), Ke),
    realpath: Nt(Pe(Y.realpath), Ke),
    stat: Nt(Pe(Y.stat), Ke),
    unlink: Nt(Pe(Y.unlink), Ke),
    /* SYNC */
    chmodSync: gt(Y.chmodSync, Ln),
    chownSync: gt(Y.chownSync, Ln),
    closeSync: gt(Y.closeSync, Ke),
    existsSync: gt(Y.existsSync, Ke),
    fsyncSync: gt(Y.fsync, Ke),
    mkdirSync: gt(Y.mkdirSync, Ke),
    realpathSync: gt(Y.realpathSync, Ke),
    statSync: gt(Y.statSync, Ke),
    unlinkSync: gt(Y.unlinkSync, Ke)
  },
  retry: {
    /* ASYNC */
    close: Rt(Pe(Y.close), Ne),
    fsync: Rt(Pe(Y.fsync), Ne),
    open: Rt(Pe(Y.open), Ne),
    readFile: Rt(Pe(Y.readFile), Ne),
    rename: Rt(Pe(Y.rename), Ne),
    stat: Rt(Pe(Y.stat), Ne),
    write: Rt(Pe(Y.write), Ne),
    writeFile: Rt(Pe(Y.writeFile), Ne),
    /* SYNC */
    closeSync: Tt(Y.closeSync, Ne),
    fsyncSync: Tt(Y.fsyncSync, Ne),
    openSync: Tt(Y.openSync, Ne),
    readFileSync: Tt(Y.readFileSync, Ne),
    renameSync: Tt(Y.renameSync, Ne),
    statSync: Tt(Y.statSync, Ne),
    writeSync: Tt(Y.writeSync, Ne),
    writeFileSync: Tt(Y.writeFileSync, Ne)
  }
}, Nf = "utf8", Zi = 438, Rf = 511, Tf = {}, Of = fe.geteuid ? fe.geteuid() : -1, If = fe.getegid ? fe.getegid() : -1, jf = 1e3, Af = !!fe.getuid;
fe.getuid && fe.getuid();
const xi = 128, kf = (e) => e instanceof Error && "code" in e, ec = (e) => typeof e == "string", Ys = (e) => e === void 0, Cf = fe.platform === "linux", Vl = fe.platform === "win32", Bo = ["SIGHUP", "SIGINT", "SIGTERM"];
Vl || Bo.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
Cf && Bo.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class Df {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (Vl && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? fe.kill(fe.pid, "SIGTERM") : fe.kill(fe.pid, t));
      }
    }, this.hook = () => {
      fe.once("exit", () => this.exit());
      for (const t of Bo)
        try {
          fe.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const Mf = new Df(), Lf = Mf.register, Ie = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${s}`;
  },
  get: (e, t, r = !0) => {
    const n = Ie.truncate(t(e));
    return n in Ie.store ? Ie.get(e, t, r) : (Ie.store[n] = r, [n, () => delete Ie.store[n]]);
  },
  purge: (e) => {
    Ie.store[e] && (delete Ie.store[e], Oe.attempt.unlink(e));
  },
  purgeSync: (e) => {
    Ie.store[e] && (delete Ie.store[e], Oe.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in Ie.store)
      Ie.purgeSync(e);
  },
  truncate: (e) => {
    const t = Q.basename(e);
    if (t.length <= xi)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - xi;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
Lf(Ie.purgeSyncAll);
function Fl(e, t, r = Tf) {
  if (ec(r))
    return Fl(e, t, { encoding: r });
  const s = { timeout: r.timeout ?? jf };
  let o = null, a = null, l = null;
  try {
    const c = Oe.attempt.realpathSync(e), d = !!c;
    e = c || e, [a, o] = Ie.get(e, r.tmpCreate || Ie.create, r.tmpPurge !== !1);
    const u = Af && Ys(r.chown), h = Ys(r.mode);
    if (d && (u || h)) {
      const E = Oe.attempt.statSync(e);
      E && (r = { ...r }, u && (r.chown = { uid: E.uid, gid: E.gid }), h && (r.mode = E.mode));
    }
    if (!d) {
      const E = Q.dirname(e);
      Oe.attempt.mkdirSync(E, {
        mode: Rf,
        recursive: !0
      });
    }
    l = Oe.retry.openSync(s)(a, "w", r.mode || Zi), r.tmpCreated && r.tmpCreated(a), ec(t) ? Oe.retry.writeSync(s)(l, t, 0, r.encoding || Nf) : Ys(t) || Oe.retry.writeSync(s)(l, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Oe.retry.fsyncSync(s)(l) : Oe.attempt.fsync(l)), Oe.retry.closeSync(s)(l), l = null, r.chown && (r.chown.uid !== Of || r.chown.gid !== If) && Oe.attempt.chownSync(a, r.chown.uid, r.chown.gid), r.mode && r.mode !== Zi && Oe.attempt.chmodSync(a, r.mode);
    try {
      Oe.retry.renameSync(s)(a, e);
    } catch (E) {
      if (!kf(E) || E.code !== "ENAMETOOLONG")
        throw E;
      Oe.retry.renameSync(s)(a, Ie.truncate(e));
    }
    o(), a = null;
  } finally {
    l && Oe.attempt.closeSync(l), a && Ie.purge(a);
  }
}
function zl(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var So = { exports: {} }, Ul = {}, nt = {}, Gr = {}, On = {}, Z = {}, Nn = {};
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
      l(N, v[R]), N.push(m[++R]);
    return new n(N);
  }
  e._ = s;
  const o = new n("+");
  function a(m, ...v) {
    const N = [g(m[0])];
    let R = 0;
    for (; R < v.length; )
      N.push(o), l(N, v[R]), N.push(o, g(m[++R]));
    return c(N), new n(N);
  }
  e.str = a;
  function l(m, v) {
    v instanceof n ? m.push(...v._items) : v instanceof r ? m.push(v) : m.push(h(v));
  }
  e.addCodeArg = l;
  function c(m) {
    let v = 1;
    for (; v < m.length - 1; ) {
      if (m[v] === o) {
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
  function u(m, v) {
    return v.emptyStr() ? m : m.emptyStr() ? v : a`${m}${v}`;
  }
  e.strConcat = u;
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
})(Nn);
var Po = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = Nn;
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
  class l extends s {
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
      const E = this.toName(d), { prefix: g } = E, w = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let _ = this._values[g];
      if (_) {
        const v = _.get(w);
        if (v)
          return v;
      } else
        _ = this._values[g] = /* @__PURE__ */ new Map();
      _.set(w, E);
      const y = this._scope[g] || (this._scope[g] = []), m = y.length;
      return y[m] = u.ref, E.setValue(u, { property: g, itemIndex: m }), E;
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
      return this._reduceValues(d, (E) => {
        if (E.value === void 0)
          throw new Error(`CodeGen: name "${E}" has no value`);
        return E.value.code;
      }, u, h);
    }
    _reduceValues(d, u, h = {}, E) {
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
          let v = u(m);
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
  e.ValueScope = l;
})(Po);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Nn, r = Po;
  var n = Nn;
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
  var s = Po;
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
      const b = i ? r.varKinds.var : this.varKind, O = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${b} ${this.name}${O};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = H(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class l extends o {
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
      return oe(i, this.rhs);
    }
  }
  class c extends l {
    constructor(i, f, b, O) {
      super(i, b, O), this.op = f;
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
  class E extends o {
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
  class g extends o {
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
      let O = b.length;
      for (; O--; ) {
        const I = b[O];
        I.optimizeNames(i, f) || (ce(i, I.names), b.splice(O, 1));
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
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(k(i), f instanceof m ? [f] : f.nodes);
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
      return oe(i, this.condition), this.else && G(i, this.else.names), i;
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
    constructor(i, f, b, O) {
      super(), this.varKind = i, this.name = f, this.from = b, this.to = O;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: b, from: O, to: I } = this;
      return `for(${f} ${b}=${O}; ${b}<${I}; ${b}++)` + super.render(i);
    }
    get names() {
      const i = oe(super.names, this.from);
      return oe(i, this.to);
    }
  }
  class T extends v {
    constructor(i, f, b, O) {
      super(), this.loop = i, this.varKind = f, this.name = b, this.iterable = O;
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
      var b, O;
      return super.optimizeNames(i, f), (b = this.catch) === null || b === void 0 || b.optimizeNames(i, f), (O = this.finally) === null || O === void 0 || O.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && G(i, this.catch.names), this.finally && G(i, this.finally.names), i;
    }
  }
  class me extends w {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  me.kind = "catch";
  class ye extends w {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  ye.kind = "finally";
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
    _def(i, f, b, O) {
      const I = this._scope.toName(f);
      return b !== void 0 && O && (this._constants[I.str] = b), this._leafNode(new a(i, I, b)), I;
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
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new E(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [b, O] of i)
        f.length > 1 && f.push(","), f.push(b), (b !== O || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, O));
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
    forRange(i, f, b, O, I = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const V = this._scope.toName(i);
      return this._for(new R(I, V, f, b), () => O(V));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, O = r.varKinds.const) {
      const I = this._scope.toName(i);
      if (this.opts.es5) {
        const V = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${V}.length`, (L) => {
          this.var(I, (0, t._)`${V}[${L}]`), b(I);
        });
      }
      return this._for(new T("of", O, I, f), () => b(I));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, b, O = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, b);
      const I = this._scope.toName(i);
      return this._for(new T("in", O, I, f), () => b(I));
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
      return this._leafNode(new u(i));
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
      const O = new de();
      if (this._blockNode(O), this.code(i), f) {
        const I = this.name("e");
        this._currNode = O.catch = new me(I), f(I);
      }
      return b && (this._currNode = O.finally = new ye(), this.code(b)), this._endBlockNode(me, ye);
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
    func(i, f = t.nil, b, O) {
      return this._blockNode(new K(i, f, b)), O && this.code(O).endFunc(), this;
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
  function oe($, i) {
    return i instanceof t._CodeOrName ? G($, i.names) : $;
  }
  function H($, i, f) {
    if ($ instanceof t.Name)
      return b($);
    if (!O($))
      return $;
    return new t._Code($._items.reduce((I, V) => (V instanceof t.Name && (V = b(V)), V instanceof t._Code ? I.push(...V._items) : I.push(V), I), []));
    function b(I) {
      const V = f[I.str];
      return V === void 0 || i[I.str] !== 1 ? I : (delete i[I.str], V);
    }
    function O(I) {
      return I instanceof t._Code && I._items.some((V) => V instanceof t.Name && i[V.str] === 1 && f[V.str] !== void 0);
    }
  }
  function ce($, i) {
    for (const f in i)
      $[f] = ($[f] || 0) - (i[f] || 0);
  }
  function k($) {
    return typeof $ == "boolean" || typeof $ == "number" || $ === null ? !$ : (0, t._)`!${S($)}`;
  }
  e.not = k;
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
const ae = Z, Vf = Nn;
function Ff(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
C.toHash = Ff;
function zf(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (ql(e, t), !Kl(t, e.self.RULES.all));
}
C.alwaysValidSchema = zf;
function ql(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const o in t)
    s[o] || Bl(e, `unknown keyword: "${o}"`);
}
C.checkUnknownRules = ql;
function Kl(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
C.schemaHasRules = Kl;
function Uf(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
C.schemaHasRulesButRef = Uf;
function qf({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ae._)`${r}`;
  }
  return (0, ae._)`${e}${t}${(0, ae.getProperty)(n)}`;
}
C.schemaRefOrVal = qf;
function Kf(e) {
  return Gl(decodeURIComponent(e));
}
C.unescapeFragment = Kf;
function Gf(e) {
  return encodeURIComponent(Wo(e));
}
C.escapeFragment = Gf;
function Wo(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
C.escapeJsonPointer = Wo;
function Gl(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
C.unescapeJsonPointer = Gl;
function Hf(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
C.eachItem = Hf;
function tc({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, o, a, l) => {
    const c = a === void 0 ? o : a instanceof ae.Name ? (o instanceof ae.Name ? e(s, o, a) : t(s, o, a), a) : o instanceof ae.Name ? (t(s, a, o), o) : r(o, a);
    return l === ae.Name && !(c instanceof ae.Name) ? n(s, c) : c;
  };
}
C.mergeEvaluated = {
  props: tc({
    mergeNames: (e, t, r) => e.if((0, ae._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ae._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ae._)`${r} || {}`).code((0, ae._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ae._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ae._)`${r} || {}`), Xo(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Hl
  }),
  items: tc({
    mergeNames: (e, t, r) => e.if((0, ae._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ae._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ae._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ae._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Hl(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ae._)`{}`);
  return t !== void 0 && Xo(e, r, t), r;
}
C.evaluatedPropsToName = Hl;
function Xo(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ae._)`${t}${(0, ae.getProperty)(n)}`, !0));
}
C.setEvaluated = Xo;
const rc = {};
function Bf(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: rc[t.code] || (rc[t.code] = new Vf._Code(t.code))
  });
}
C.useFunc = Bf;
var No;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(No || (C.Type = No = {}));
function Wf(e, t, r) {
  if (e instanceof ae.Name) {
    const n = t === No.Num;
    return r ? n ? (0, ae._)`"[" + ${e} + "]"` : (0, ae._)`"['" + ${e} + "']"` : n ? (0, ae._)`"/" + ${e}` : (0, ae._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ae.getProperty)(e).toString() : "/" + Wo(e);
}
C.getErrorPath = Wf;
function Bl(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
C.checkStrictMode = Bl;
var Ge = {};
Object.defineProperty(Ge, "__esModule", { value: !0 });
const Re = Z, Xf = {
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
Ge.default = Xf;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = Z, r = C, n = Ge;
  e.keywordError = {
    message: ({ keyword: y }) => (0, t.str)`must pass "${y}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: y, schemaType: m }) => m ? (0, t.str)`"${y}" keyword must be ${m} ($data)` : (0, t.str)`"${y}" keyword is invalid ($data)`
  };
  function s(y, m = e.keywordError, v, N) {
    const { it: R } = y, { gen: T, compositeRule: K, allErrors: X } = R, de = h(y, m, v);
    N ?? (K || X) ? c(T, de) : d(R, (0, t._)`[${de}]`);
  }
  e.reportError = s;
  function o(y, m = e.keywordError, v) {
    const { it: N } = y, { gen: R, compositeRule: T, allErrors: K } = N, X = h(y, m, v);
    c(R, X), T || K || d(N, n.default.vErrors);
  }
  e.reportExtraError = o;
  function a(y, m) {
    y.assign(n.default.errors, m), y.if((0, t._)`${n.default.vErrors} !== null`, () => y.if(m, () => y.assign((0, t._)`${n.default.vErrors}.length`, m), () => y.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function l({ gen: y, keyword: m, schemaValue: v, data: N, errsCount: R, it: T }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const K = y.name("err");
    y.forRange("i", R, n.default.errors, (X) => {
      y.const(K, (0, t._)`${n.default.vErrors}[${X}]`), y.if((0, t._)`${K}.instancePath === undefined`, () => y.assign((0, t._)`${K}.instancePath`, (0, t.strConcat)(n.default.instancePath, T.errorPath))), y.assign((0, t._)`${K}.schemaPath`, (0, t.str)`${T.errSchemaPath}/${m}`), T.opts.verbose && (y.assign((0, t._)`${K}.schema`, v), y.assign((0, t._)`${K}.data`, N));
    });
  }
  e.extendErrors = l;
  function c(y, m) {
    const v = y.const("err", m);
    y.if((0, t._)`${n.default.vErrors} === null`, () => y.assign(n.default.vErrors, (0, t._)`[${v}]`), (0, t._)`${n.default.vErrors}.push(${v})`), y.code((0, t._)`${n.default.errors}++`);
  }
  function d(y, m) {
    const { gen: v, validateName: N, schemaEnv: R } = y;
    R.$async ? v.throw((0, t._)`new ${y.ValidationError}(${m})`) : (v.assign((0, t._)`${N}.errors`, m), v.return(!1));
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
  function h(y, m, v) {
    const { createErrors: N } = y.it;
    return N === !1 ? (0, t._)`{}` : E(y, m, v);
  }
  function E(y, m, v = {}) {
    const { gen: N, it: R } = y, T = [
      g(R, v),
      w(y, v)
    ];
    return _(y, m, T), N.object(...T);
  }
  function g({ errorPath: y }, { instancePath: m }) {
    const v = m ? (0, t.str)`${y}${(0, r.getErrorPath)(m, r.Type.Str)}` : y;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, v)];
  }
  function w({ keyword: y, it: { errSchemaPath: m } }, { schemaPath: v, parentSchema: N }) {
    let R = N ? m : (0, t.str)`${m}/${y}`;
    return v && (R = (0, t.str)`${R}${(0, r.getErrorPath)(v, r.Type.Str)}`), [u.schemaPath, R];
  }
  function _(y, { params: m, message: v }, N) {
    const { keyword: R, data: T, schemaValue: K, it: X } = y, { opts: de, propertyName: me, topSchemaRef: ye, schemaPath: F } = X;
    N.push([u.keyword, R], [u.params, typeof m == "function" ? m(y) : m || (0, t._)`{}`]), de.messages && N.push([u.message, typeof v == "function" ? v(y) : v]), de.verbose && N.push([u.schema, K], [u.parentSchema, (0, t._)`${ye}${F}`], [n.default.data, T]), me && N.push([u.propertyName, me]);
  }
})(On);
Object.defineProperty(Gr, "__esModule", { value: !0 });
Gr.boolOrEmptySchema = Gr.topBoolOrEmptySchema = void 0;
const Jf = On, Yf = Z, Qf = Ge, Zf = {
  message: "boolean schema is false"
};
function xf(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Wl(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Qf.default.data) : (t.assign((0, Yf._)`${n}.errors`, null), t.return(!0));
}
Gr.topBoolOrEmptySchema = xf;
function eh(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Wl(e)) : r.var(t, !0);
}
Gr.boolOrEmptySchema = eh;
function Wl(e, t) {
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
  (0, Jf.reportError)(s, Zf, void 0, t);
}
var ge = {}, gr = {};
Object.defineProperty(gr, "__esModule", { value: !0 });
gr.getRules = gr.isJSONType = void 0;
const th = ["string", "number", "integer", "boolean", "null", "object", "array"], rh = new Set(th);
function nh(e) {
  return typeof e == "string" && rh.has(e);
}
gr.isJSONType = nh;
function sh() {
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
gr.getRules = sh;
var wt = {};
Object.defineProperty(wt, "__esModule", { value: !0 });
wt.shouldUseRule = wt.shouldUseGroup = wt.schemaHasRulesForType = void 0;
function oh({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Xl(e, n);
}
wt.schemaHasRulesForType = oh;
function Xl(e, t) {
  return t.rules.some((r) => Jl(e, r));
}
wt.shouldUseGroup = Xl;
function Jl(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
wt.shouldUseRule = Jl;
Object.defineProperty(ge, "__esModule", { value: !0 });
ge.reportTypeError = ge.checkDataTypes = ge.checkDataType = ge.coerceAndCheckDataType = ge.getJSONTypes = ge.getSchemaTypes = ge.DataType = void 0;
const ah = gr, ih = wt, ch = On, x = Z, Yl = C;
var Vr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Vr || (ge.DataType = Vr = {}));
function lh(e) {
  const t = Ql(e.type);
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
ge.getSchemaTypes = lh;
function Ql(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(ah.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ge.getJSONTypes = Ql;
function uh(e, t) {
  const { gen: r, data: n, opts: s } = e, o = dh(t, s.coerceTypes), a = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, ih.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const l = Jo(t, n, s.strictNumbers, Vr.Wrong);
    r.if(l, () => {
      o.length ? fh(e, t, o) : Yo(e);
    });
  }
  return a;
}
ge.coerceAndCheckDataType = uh;
const Zl = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function dh(e, t) {
  return t ? e.filter((r) => Zl.has(r) || t === "array" && r === "array") : [];
}
function fh(e, t, r) {
  const { gen: n, data: s, opts: o } = e, a = n.let("dataType", (0, x._)`typeof ${s}`), l = n.let("coerced", (0, x._)`undefined`);
  o.coerceTypes === "array" && n.if((0, x._)`${a} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, x._)`${s}[0]`).assign(a, (0, x._)`typeof ${s}`).if(Jo(t, s, o.strictNumbers), () => n.assign(l, s))), n.if((0, x._)`${l} !== undefined`);
  for (const d of r)
    (Zl.has(d) || d === "array" && o.coerceTypes === "array") && c(d);
  n.else(), Yo(e), n.endIf(), n.if((0, x._)`${l} !== undefined`, () => {
    n.assign(s, l), hh(e, l);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, x._)`${a} == "number" || ${a} == "boolean"`).assign(l, (0, x._)`"" + ${s}`).elseIf((0, x._)`${s} === null`).assign(l, (0, x._)`""`);
        return;
      case "number":
        n.elseIf((0, x._)`${a} == "boolean" || ${s} === null
              || (${a} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, x._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, x._)`${a} === "boolean" || ${s} === null
              || (${a} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, x._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, x._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, x._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, x._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, x._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${s} === null`).assign(l, (0, x._)`[${s}]`);
    }
  }
}
function hh({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, x._)`${t} !== undefined`, () => e.assign((0, x._)`${t}[${r}]`, n));
}
function Ro(e, t, r, n = Vr.Correct) {
  const s = n === Vr.Correct ? x.operators.EQ : x.operators.NEQ;
  let o;
  switch (e) {
    case "null":
      return (0, x._)`${t} ${s} null`;
    case "array":
      o = (0, x._)`Array.isArray(${t})`;
      break;
    case "object":
      o = (0, x._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      o = a((0, x._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      o = a();
      break;
    default:
      return (0, x._)`typeof ${t} ${s} ${e}`;
  }
  return n === Vr.Correct ? o : (0, x.not)(o);
  function a(l = x.nil) {
    return (0, x.and)((0, x._)`typeof ${t} == "number"`, l, r ? (0, x._)`isFinite(${t})` : x.nil);
  }
}
ge.checkDataType = Ro;
function Jo(e, t, r, n) {
  if (e.length === 1)
    return Ro(e[0], t, r, n);
  let s;
  const o = (0, Yl.toHash)(e);
  if (o.array && o.object) {
    const a = (0, x._)`typeof ${t} != "object"`;
    s = o.null ? a : (0, x._)`!${t} || ${a}`, delete o.null, delete o.array, delete o.object;
  } else
    s = x.nil;
  o.number && delete o.integer;
  for (const a in o)
    s = (0, x.and)(s, Ro(a, t, r, n));
  return s;
}
ge.checkDataTypes = Jo;
const mh = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, x._)`{type: ${e}}` : (0, x._)`{type: ${t}}`
};
function Yo(e) {
  const t = ph(e);
  (0, ch.reportError)(t, mh);
}
ge.reportTypeError = Yo;
function ph(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Yl.schemaRefOrVal)(e, n, "type");
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
var Rs = {};
Object.defineProperty(Rs, "__esModule", { value: !0 });
Rs.assignDefaults = void 0;
const Sr = Z, $h = C;
function yh(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      nc(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, o) => nc(e, o, s.default));
}
Rs.assignDefaults = yh;
function nc(e, t, r) {
  const { gen: n, compositeRule: s, data: o, opts: a } = e;
  if (r === void 0)
    return;
  const l = (0, Sr._)`${o}${(0, Sr.getProperty)(t)}`;
  if (s) {
    (0, $h.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let c = (0, Sr._)`${l} === undefined`;
  a.useDefaults === "empty" && (c = (0, Sr._)`${c} || ${l} === null || ${l} === ""`), n.if(c, (0, Sr._)`${l} = ${(0, Sr.stringify)(r)}`);
}
var ht = {}, re = {};
Object.defineProperty(re, "__esModule", { value: !0 });
re.validateUnion = re.validateArray = re.usePattern = re.callValidateCode = re.schemaProperties = re.allSchemaProperties = re.noPropertyInData = re.propertyInData = re.isOwnProperty = re.hasPropFunc = re.reportMissingProp = re.checkMissingProp = re.checkReportMissingProp = void 0;
const le = Z, Qo = C, Ot = Ge, gh = C;
function _h(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(xo(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, le._)`${t}` }, !0), e.error();
  });
}
re.checkReportMissingProp = _h;
function vh({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, le.or)(...n.map((o) => (0, le.and)(xo(e, t, o, r.ownProperties), (0, le._)`${s} = ${o}`)));
}
re.checkMissingProp = vh;
function wh(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
re.reportMissingProp = wh;
function xl(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, le._)`Object.prototype.hasOwnProperty`
  });
}
re.hasPropFunc = xl;
function Zo(e, t, r) {
  return (0, le._)`${xl(e)}.call(${t}, ${r})`;
}
re.isOwnProperty = Zo;
function Eh(e, t, r, n) {
  const s = (0, le._)`${t}${(0, le.getProperty)(r)} !== undefined`;
  return n ? (0, le._)`${s} && ${Zo(e, t, r)}` : s;
}
re.propertyInData = Eh;
function xo(e, t, r, n) {
  const s = (0, le._)`${t}${(0, le.getProperty)(r)} === undefined`;
  return n ? (0, le.or)(s, (0, le.not)(Zo(e, t, r))) : s;
}
re.noPropertyInData = xo;
function eu(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
re.allSchemaProperties = eu;
function bh(e, t) {
  return eu(t).filter((r) => !(0, Qo.alwaysValidSchema)(e, t[r]));
}
re.schemaProperties = bh;
function Sh({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: o }, it: a }, l, c, d) {
  const u = d ? (0, le._)`${e}, ${t}, ${n}${s}` : t, h = [
    [Ot.default.instancePath, (0, le.strConcat)(Ot.default.instancePath, o)],
    [Ot.default.parentData, a.parentData],
    [Ot.default.parentDataProperty, a.parentDataProperty],
    [Ot.default.rootData, Ot.default.rootData]
  ];
  a.opts.dynamicRef && h.push([Ot.default.dynamicAnchors, Ot.default.dynamicAnchors]);
  const E = (0, le._)`${u}, ${r.object(...h)}`;
  return c !== le.nil ? (0, le._)`${l}.call(${c}, ${E})` : (0, le._)`${l}(${E})`;
}
re.callValidateCode = Sh;
const Ph = (0, le._)`new RegExp`;
function Nh({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, o = s(r, n);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, le._)`${s.code === "new RegExp" ? Ph : (0, gh.useFunc)(e, s)}(${r}, ${n})`
  });
}
re.usePattern = Nh;
function Rh(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, o = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return a(() => t.assign(l, !1)), l;
  }
  return t.var(o, !0), a(() => t.break()), o;
  function a(l) {
    const c = t.const("len", (0, le._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: Qo.Type.Num
      }, o), t.if((0, le.not)(o), l);
    });
  }
}
re.validateArray = Rh;
function Th(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, Qo.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const a = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(a, (0, le._)`${a} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, le.not)(a));
  })), e.result(a, () => e.reset(), () => e.error(!0));
}
re.validateUnion = Th;
Object.defineProperty(ht, "__esModule", { value: !0 });
ht.validateKeywordUsage = ht.validSchemaType = ht.funcKeywordCode = ht.macroKeywordCode = void 0;
const Ce = Z, ar = Ge, Oh = re, Ih = On;
function jh(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: o, it: a } = e, l = t.macro.call(a.self, s, o, a), c = tu(r, n, l);
  a.opts.validateSchema !== !1 && a.self.validateSchema(l, !0);
  const d = r.name("valid");
  e.subschema({
    schema: l,
    schemaPath: Ce.nil,
    errSchemaPath: `${a.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
ht.macroKeywordCode = jh;
function Ah(e, t) {
  var r;
  const { gen: n, keyword: s, schema: o, parentSchema: a, $data: l, it: c } = e;
  Ch(c, t);
  const d = !l && t.compile ? t.compile.call(c.self, o, a, c) : t.validate, u = tu(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      _(), t.modifying && sc(e), y(() => e.error());
    else {
      const m = t.async ? g() : w();
      t.modifying && sc(e), y(() => kh(e, m));
    }
  }
  function g() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, Ce._)`await `), (v) => n.assign(h, !1).if((0, Ce._)`${v} instanceof ${c.ValidationError}`, () => n.assign(m, (0, Ce._)`${v}.errors`), () => n.throw(v))), m;
  }
  function w() {
    const m = (0, Ce._)`${u}.errors`;
    return n.assign(m, null), _(Ce.nil), m;
  }
  function _(m = t.async ? (0, Ce._)`await ` : Ce.nil) {
    const v = c.opts.passContext ? ar.default.this : ar.default.self, N = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, Ce._)`${m}${(0, Oh.callValidateCode)(e, u, v, N)}`, t.modifying);
  }
  function y(m) {
    var v;
    n.if((0, Ce.not)((v = t.valid) !== null && v !== void 0 ? v : h), m);
  }
}
ht.funcKeywordCode = Ah;
function sc(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Ce._)`${n.parentData}[${n.parentDataProperty}]`));
}
function kh(e, t) {
  const { gen: r } = e;
  r.if((0, Ce._)`Array.isArray(${t})`, () => {
    r.assign(ar.default.vErrors, (0, Ce._)`${ar.default.vErrors} === null ? ${t} : ${ar.default.vErrors}.concat(${t})`).assign(ar.default.errors, (0, Ce._)`${ar.default.vErrors}.length`), (0, Ih.extendErrors)(e);
  }, () => e.error());
}
function Ch({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function tu(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Ce.stringify)(r) });
}
function Dh(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
ht.validSchemaType = Dh;
function Mh({ schema: e, opts: t, self: r, errSchemaPath: n }, s, o) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(o) : s.keyword !== o)
    throw new Error("ajv implementation error");
  const a = s.dependencies;
  if (a != null && a.some((l) => !Object.prototype.hasOwnProperty.call(e, l)))
    throw new Error(`parent schema must have dependencies of ${o}: ${a.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[o])) {
    const c = `keyword "${o}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
ht.validateKeywordUsage = Mh;
var Ut = {};
Object.defineProperty(Ut, "__esModule", { value: !0 });
Ut.extendSubschemaMode = Ut.extendSubschemaData = Ut.getSubschema = void 0;
const ut = Z, ru = C;
function Lh(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: o, topSchemaRef: a }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const l = e.schema[t];
    return r === void 0 ? {
      schema: l,
      schemaPath: (0, ut._)`${e.schemaPath}${(0, ut.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: l[r],
      schemaPath: (0, ut._)`${e.schemaPath}${(0, ut.getProperty)(t)}${(0, ut.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, ru.escapeFragment)(r)}`
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
Ut.getSubschema = Lh;
function Vh(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: o, propertyName: a }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, E = l.let("data", (0, ut._)`${t.data}${(0, ut.getProperty)(r)}`, !0);
    c(E), e.errorPath = (0, ut.str)`${d}${(0, ru.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, ut._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof ut.Name ? s : l.let("data", s, !0);
    c(d), a !== void 0 && (e.propertyName = a);
  }
  o && (e.dataTypes = o);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Ut.extendSubschemaData = Vh;
function Fh(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: o }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Ut.extendSubschemaMode = Fh;
var be = {}, Ts = function e(t, r) {
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
}, nu = { exports: {} }, Ft = nu.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  ns(t, n, s, e, "", e);
};
Ft.keywords = {
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
Ft.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Ft.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Ft.skipKeywords = {
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
function ns(e, t, r, n, s, o, a, l, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, o, a, l, c, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in Ft.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            ns(e, t, r, h[E], s + "/" + u + "/" + E, o, s, u, n, E);
      } else if (u in Ft.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            ns(e, t, r, h[g], s + "/" + u + "/" + zh(g), o, s, u, n, g);
      } else (u in Ft.keywords || e.allKeys && !(u in Ft.skipKeywords)) && ns(e, t, r, h, s + "/" + u, o, s, u, n);
    }
    r(n, s, o, a, l, c, d);
  }
}
function zh(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Uh = nu.exports;
Object.defineProperty(be, "__esModule", { value: !0 });
be.getSchemaRefs = be.resolveUrl = be.normalizeId = be._getFullPath = be.getFullPath = be.inlineRef = void 0;
const qh = C, Kh = Ts, Gh = Uh, Hh = /* @__PURE__ */ new Set([
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
function Bh(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !To(e) : t ? su(e) <= t : !1;
}
be.inlineRef = Bh;
const Wh = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function To(e) {
  for (const t in e) {
    if (Wh.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(To) || typeof r == "object" && To(r))
      return !0;
  }
  return !1;
}
function su(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Hh.has(r) && (typeof e[r] == "object" && (0, qh.eachItem)(e[r], (n) => t += su(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function ou(e, t = "", r) {
  r !== !1 && (t = Fr(t));
  const n = e.parse(t);
  return au(e, n);
}
be.getFullPath = ou;
function au(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
be._getFullPath = au;
const Xh = /#\/?$/;
function Fr(e) {
  return e ? e.replace(Xh, "") : "";
}
be.normalizeId = Fr;
function Jh(e, t, r) {
  return r = Fr(r), e.resolve(t, r);
}
be.resolveUrl = Jh;
const Yh = /^[a-z_][-a-z0-9._]*$/i;
function Qh(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Fr(e[r] || t), o = { "": s }, a = ou(n, s, !1), l = {}, c = /* @__PURE__ */ new Set();
  return Gh(e, { allKeys: !0 }, (h, E, g, w) => {
    if (w === void 0)
      return;
    const _ = a + E;
    let y = o[w];
    typeof h[r] == "string" && (y = m.call(this, h[r])), v.call(this, h.$anchor), v.call(this, h.$dynamicAnchor), o[E] = y;
    function m(N) {
      const R = this.opts.uriResolver.resolve;
      if (N = Fr(y ? R(y, N) : N), c.has(N))
        throw u(N);
      c.add(N);
      let T = this.refs[N];
      return typeof T == "string" && (T = this.refs[T]), typeof T == "object" ? d(h, T.schema, N) : N !== Fr(_) && (N[0] === "#" ? (d(h, l[N], N), l[N] = h) : this.refs[N] = _), N;
    }
    function v(N) {
      if (typeof N == "string") {
        if (!Yh.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), l;
  function d(h, E, g) {
    if (E !== void 0 && !Kh(h, E))
      throw u(g);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
be.getSchemaRefs = Qh;
Object.defineProperty(nt, "__esModule", { value: !0 });
nt.getData = nt.KeywordCxt = nt.validateFunctionCode = void 0;
const iu = Gr, oc = ge, ea = wt, ms = ge, Zh = Rs, pn = ht, Qs = Ut, U = Z, B = Ge, xh = be, Et = C, cn = On;
function em(e) {
  if (uu(e) && (du(e), lu(e))) {
    nm(e);
    return;
  }
  cu(e, () => (0, iu.topBoolOrEmptySchema)(e));
}
nt.validateFunctionCode = em;
function cu({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, o) {
  s.code.es5 ? e.func(t, (0, U._)`${B.default.data}, ${B.default.valCxt}`, n.$async, () => {
    e.code((0, U._)`"use strict"; ${ac(r, s)}`), rm(e, s), e.code(o);
  }) : e.func(t, (0, U._)`${B.default.data}, ${tm(s)}`, n.$async, () => e.code(ac(r, s)).code(o));
}
function tm(e) {
  return (0, U._)`{${B.default.instancePath}="", ${B.default.parentData}, ${B.default.parentDataProperty}, ${B.default.rootData}=${B.default.data}${e.dynamicRef ? (0, U._)`, ${B.default.dynamicAnchors}={}` : U.nil}}={}`;
}
function rm(e, t) {
  e.if(B.default.valCxt, () => {
    e.var(B.default.instancePath, (0, U._)`${B.default.valCxt}.${B.default.instancePath}`), e.var(B.default.parentData, (0, U._)`${B.default.valCxt}.${B.default.parentData}`), e.var(B.default.parentDataProperty, (0, U._)`${B.default.valCxt}.${B.default.parentDataProperty}`), e.var(B.default.rootData, (0, U._)`${B.default.valCxt}.${B.default.rootData}`), t.dynamicRef && e.var(B.default.dynamicAnchors, (0, U._)`${B.default.valCxt}.${B.default.dynamicAnchors}`);
  }, () => {
    e.var(B.default.instancePath, (0, U._)`""`), e.var(B.default.parentData, (0, U._)`undefined`), e.var(B.default.parentDataProperty, (0, U._)`undefined`), e.var(B.default.rootData, B.default.data), t.dynamicRef && e.var(B.default.dynamicAnchors, (0, U._)`{}`);
  });
}
function nm(e) {
  const { schema: t, opts: r, gen: n } = e;
  cu(e, () => {
    r.$comment && t.$comment && hu(e), cm(e), n.let(B.default.vErrors, null), n.let(B.default.errors, 0), r.unevaluated && sm(e), fu(e), dm(e);
  });
}
function sm(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, U._)`${r}.evaluated`), t.if((0, U._)`${e.evaluated}.dynamicProps`, () => t.assign((0, U._)`${e.evaluated}.props`, (0, U._)`undefined`)), t.if((0, U._)`${e.evaluated}.dynamicItems`, () => t.assign((0, U._)`${e.evaluated}.items`, (0, U._)`undefined`));
}
function ac(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, U._)`/*# sourceURL=${r} */` : U.nil;
}
function om(e, t) {
  if (uu(e) && (du(e), lu(e))) {
    am(e, t);
    return;
  }
  (0, iu.boolOrEmptySchema)(e, t);
}
function lu({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function uu(e) {
  return typeof e.schema != "boolean";
}
function am(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && hu(e), lm(e), um(e);
  const o = n.const("_errs", B.default.errors);
  fu(e, o), n.var(t, (0, U._)`${o} === ${B.default.errors}`);
}
function du(e) {
  (0, Et.checkUnknownRules)(e), im(e);
}
function fu(e, t) {
  if (e.opts.jtd)
    return ic(e, [], !1, t);
  const r = (0, oc.getSchemaTypes)(e.schema), n = (0, oc.coerceAndCheckDataType)(e, r);
  ic(e, r, !n, t);
}
function im(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, Et.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function cm(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, Et.checkStrictMode)(e, "default is ignored in the schema root");
}
function lm(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, xh.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function um(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function hu({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const o = r.$comment;
  if (s.$comment === !0)
    e.code((0, U._)`${B.default.self}.logger.log(${o})`);
  else if (typeof s.$comment == "function") {
    const a = (0, U.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, U._)`${B.default.self}.opts.$comment(${o}, ${a}, ${l}.schema)`);
  }
}
function dm(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: o } = e;
  r.$async ? t.if((0, U._)`${B.default.errors} === 0`, () => t.return(B.default.data), () => t.throw((0, U._)`new ${s}(${B.default.vErrors})`)) : (t.assign((0, U._)`${n}.errors`, B.default.vErrors), o.unevaluated && fm(e), t.return((0, U._)`${B.default.errors} === 0`));
}
function fm({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof U.Name && e.assign((0, U._)`${t}.props`, r), n instanceof U.Name && e.assign((0, U._)`${t}.items`, n);
}
function ic(e, t, r, n) {
  const { gen: s, schema: o, data: a, allErrors: l, opts: c, self: d } = e, { RULES: u } = d;
  if (o.$ref && (c.ignoreKeywordsWithRef || !(0, Et.schemaHasRulesButRef)(o, u))) {
    s.block(() => $u(e, "$ref", u.all.$ref.definition));
    return;
  }
  c.jtd || hm(e, t), s.block(() => {
    for (const E of u.rules)
      h(E);
    h(u.post);
  });
  function h(E) {
    (0, ea.shouldUseGroup)(o, E) && (E.type ? (s.if((0, ms.checkDataType)(E.type, a, c.strictNumbers)), cc(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, ms.reportTypeError)(e)), s.endIf()) : cc(e, E), l || s.if((0, U._)`${B.default.errors} === ${n || 0}`));
  }
}
function cc(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, Zh.assignDefaults)(e, t.type), r.block(() => {
    for (const o of t.rules)
      (0, ea.shouldUseRule)(n, o) && $u(e, o.keyword, o.definition, t.type);
  });
}
function hm(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (mm(e, t), e.opts.allowUnionTypes || pm(e, t), $m(e, e.dataTypes));
}
function mm(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      mu(e.dataTypes, r) || ta(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), gm(e, t);
  }
}
function pm(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && ta(e, "use allowUnionTypes to allow union type keyword");
}
function $m(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, ea.shouldUseRule)(e.schema, s)) {
      const { type: o } = s.definition;
      o.length && !o.some((a) => ym(t, a)) && ta(e, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function ym(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function mu(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function gm(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    mu(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function ta(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, Et.checkStrictMode)(e, t, e.opts.strictTypes);
}
let pu = class {
  constructor(t, r, n) {
    if ((0, pn.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Et.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", yu(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, pn.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
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
    (t ? cn.reportExtraError : cn.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, cn.reportError)(this, this.def.$dataError || cn.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, cn.resetErrorsCount)(this.gen, this.errsCount);
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
    const { gen: n, schemaCode: s, schemaType: o, def: a } = this;
    n.if((0, U.or)((0, U._)`${s} === undefined`, r)), t !== U.nil && n.assign(t, !0), (o.length || a.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== U.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: o } = this;
    return (0, U.or)(a(), l());
    function a() {
      if (n.length) {
        if (!(r instanceof U.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, U._)`${(0, ms.checkDataTypes)(c, r, o.opts.strictNumbers, ms.DataType.Wrong)}`;
      }
      return U.nil;
    }
    function l() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, U._)`!${c}(${r})`;
      }
      return U.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Qs.getSubschema)(this.it, t);
    (0, Qs.extendSubschemaData)(n, this.it, t), (0, Qs.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return om(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = Et.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = Et.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, U.Name)), !0;
  }
};
nt.KeywordCxt = pu;
function $u(e, t, r, n) {
  const s = new pu(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, pn.funcKeywordCode)(s, r) : "macro" in r ? (0, pn.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, pn.funcKeywordCode)(s, r);
}
const _m = /^\/(?:[^~]|~0|~1)*$/, vm = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function yu(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, o;
  if (e === "")
    return B.default.rootData;
  if (e[0] === "/") {
    if (!_m.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, o = B.default.rootData;
  } else {
    const d = vm.exec(e);
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
    if (o = r[t - u], !s)
      return o;
  }
  let a = o;
  const l = s.split("/");
  for (const d of l)
    d && (o = (0, U._)`${o}${(0, U.getProperty)((0, Et.unescapeJsonPointer)(d))}`, a = (0, U._)`${a} && ${o}`);
  return a;
  function c(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
nt.getData = yu;
var In = {};
Object.defineProperty(In, "__esModule", { value: !0 });
class wm extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
In.default = wm;
var Jr = {};
Object.defineProperty(Jr, "__esModule", { value: !0 });
const Zs = be;
let Em = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Zs.resolveUrl)(t, r, n), this.missingSchema = (0, Zs.normalizeId)((0, Zs.getFullPath)(t, this.missingRef));
  }
};
Jr.default = Em;
var Me = {};
Object.defineProperty(Me, "__esModule", { value: !0 });
Me.resolveSchema = Me.getCompilingSchema = Me.resolveRef = Me.compileSchema = Me.SchemaEnv = void 0;
const Ye = Z, bm = In, sr = Ge, et = be, lc = C, Sm = nt;
let Os = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, et.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
Me.SchemaEnv = Os;
function ra(e) {
  const t = gu.call(this, e);
  if (t)
    return t;
  const r = (0, et.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: o } = this.opts, a = new Ye.CodeGen(this.scope, { es5: n, lines: s, ownProperties: o });
  let l;
  e.$async && (l = a.scopeValue("Error", {
    ref: bm.default,
    code: (0, Ye._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = a.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: a,
    allErrors: this.opts.allErrors,
    data: sr.default.data,
    parentData: sr.default.parentData,
    parentDataProperty: sr.default.parentDataProperty,
    dataNames: [sr.default.data],
    dataPathArr: [Ye.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: a.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Ye.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: l,
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
  let u;
  try {
    this._compilations.add(e), (0, Sm.validateFunctionCode)(d), a.optimize(this.opts.code.optimize);
    const h = a.toString();
    u = `${a.scopeRefs(sr.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const g = new Function(`${sr.default.self}`, `${sr.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: h, scopeValues: a._values }), this.opts.unevaluated) {
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
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
Me.compileSchema = ra;
function Pm(e, t, r) {
  var n;
  r = (0, et.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let o = Tm.call(this, e, r);
  if (o === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    a && (o = new Os({ schema: a, schemaId: l, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[r] = Nm.call(this, o);
}
Me.resolveRef = Pm;
function Nm(e) {
  return (0, et.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : ra.call(this, e);
}
function gu(e) {
  for (const t of this._compilations)
    if (Rm(t, e))
      return t;
}
Me.getCompilingSchema = gu;
function Rm(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Tm(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Is.call(this, e, t);
}
function Is(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, et._getFullPath)(this.opts.uriResolver, r);
  let s = (0, et.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return xs.call(this, r, e);
  const o = (0, et.normalizeId)(n), a = this.refs[o] || this.schemas[o];
  if (typeof a == "string") {
    const l = Is.call(this, e, a);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : xs.call(this, r, l);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || ra.call(this, a), o === (0, et.normalizeId)(t)) {
      const { schema: l } = a, { schemaId: c } = this.opts, d = l[c];
      return d && (s = (0, et.resolveUrl)(this.opts.uriResolver, s, d)), new Os({ schema: l, schemaId: c, root: e, baseId: s });
    }
    return xs.call(this, r, a);
  }
}
Me.resolveSchema = Is;
const Om = /* @__PURE__ */ new Set([
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
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, lc.unescapeFragment)(l)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !Om.has(l) && d && (t = (0, et.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let o;
  if (typeof r != "boolean" && r.$ref && !(0, lc.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, et.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    o = Is.call(this, n, l);
  }
  const { schemaId: a } = this.opts;
  if (o = o || new Os({ schema: r, schemaId: a, root: n, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const Im = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", jm = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Am = "object", km = [
  "$data"
], Cm = {
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
}, Dm = !1, Mm = {
  $id: Im,
  description: jm,
  type: Am,
  required: km,
  properties: Cm,
  additionalProperties: Dm
};
var na = {}, js = { exports: {} };
const Lm = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), _u = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u), sa = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu), vu = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu), Vm = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
function wu(e) {
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
const Fm = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function uc(e) {
  return e.length = 0, !0;
}
function zm(e, t, r) {
  if (e.length) {
    const n = wu(e);
    if (n !== "")
      t.push(n);
    else
      return r.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function Um(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let o = !1, a = !1, l = zm;
  for (let c = 0; c < e.length; c++) {
    const d = e[c];
    if (!(d === "[" || d === "]"))
      if (d === ":") {
        if (o === !0 && (a = !0), !l(s, n, r))
          break;
        if (++t > 7) {
          r.error = !0;
          break;
        }
        c > 0 && e[c - 1] === ":" && (o = !0), n.push(":");
        continue;
      } else if (d === "%") {
        if (!l(s, n, r))
          break;
        l = uc;
      } else {
        s.push(d);
        continue;
      }
  }
  return s.length && (l === uc ? r.zone = s.join("") : a ? n.push(s.join("")) : n.push(wu(s))), r.address = n.join(""), r;
}
function Eu(e) {
  if (qm(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = Um(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function qm(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function Km(e) {
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
const Gm = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" }, Hm = /[@/?#:]/g, Bm = /[@/?#]/g;
function bu(e, t) {
  const r = t ? Bm : Hm;
  return r.lastIndex = 0, e.replace(r, (n) => Gm[n]);
}
function Wm(e, t = !1) {
  if (e.indexOf("%") === -1)
    return e;
  let r = "";
  for (let n = 0; n < e.length; n++) {
    if (e[n] === "%" && n + 2 < e.length) {
      const s = e.slice(n + 1, n + 3);
      if (sa(s)) {
        const o = s.toUpperCase(), a = String.fromCharCode(parseInt(o, 16));
        t && vu(a) ? r += a : r += "%" + o, n += 2;
        continue;
      }
    }
    r += e[n];
  }
  return r;
}
function Xm(e) {
  let t = "";
  for (let r = 0; r < e.length; r++) {
    if (e[r] === "%" && r + 2 < e.length) {
      const n = e.slice(r + 1, r + 3);
      if (sa(n)) {
        const s = n.toUpperCase(), o = String.fromCharCode(parseInt(s, 16));
        o !== "." && vu(o) ? t += o : t += "%" + s, r += 2;
        continue;
      }
    }
    Vm(e[r]) ? t += e[r] : t += escape(e[r]);
  }
  return t;
}
function Jm(e) {
  let t = "";
  for (let r = 0; r < e.length; r++) {
    if (e[r] === "%" && r + 2 < e.length) {
      const n = e.slice(r + 1, r + 3);
      if (sa(n)) {
        t += "%" + n.toUpperCase(), r += 2;
        continue;
      }
    }
    t += escape(e[r]);
  }
  return t;
}
function Ym(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    if (!_u(r)) {
      const n = Eu(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = bu(r, !1);
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var Su = {
  nonSimpleDomain: Fm,
  recomposeAuthority: Ym,
  reescapeHostDelimiters: bu,
  normalizePercentEncoding: Wm,
  normalizePathEncoding: Xm,
  escapePreservingEscapes: Jm,
  removeDotSegments: Km,
  isIPv4: _u,
  isUUID: Lm,
  normalizeIPv6: Eu
};
const { isUUID: Qm } = Su, Zm = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Pu(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function Nu(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function Ru(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function xm(e) {
  return e.secure = Pu(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function ep(e) {
  if ((e.port === (Pu(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function tp(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(Zm);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, o = oa(s);
    e.path = void 0, o && (e = o.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function rp(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, o = oa(s);
  o && (e = o.serialize(e, t));
  const a = e, l = e.nss;
  return a.path = `${n || t.nid}:${l}`, t.skipEscape = !0, a;
}
function np(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !Qm(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function sp(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const Tu = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: Nu,
    serialize: Ru
  }
), op = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: Tu.domainHost,
    parse: Nu,
    serialize: Ru
  }
), ss = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: xm,
    serialize: ep
  }
), ap = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: ss.domainHost,
    parse: ss.parse,
    serialize: ss.serialize
  }
), ip = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: tp,
    serialize: rp,
    skipNormalize: !0
  }
), cp = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: np,
    serialize: sp,
    skipNormalize: !0
  }
), ps = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: Tu,
    https: op,
    ws: ss,
    wss: ap,
    urn: ip,
    "urn:uuid": cp
  }
);
Object.setPrototypeOf(ps, null);
function oa(e) {
  return e && (ps[
    /** @type {SchemeName} */
    e
  ] || ps[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var lp = {
  SCHEMES: ps,
  getSchemeHandler: oa
};
const { normalizeIPv6: up, removeDotSegments: fn, recomposeAuthority: dp, normalizePercentEncoding: fp, normalizePathEncoding: hp, escapePreservingEscapes: mp, reescapeHostDelimiters: pp, isIPv4: $p, nonSimpleDomain: yp } = Su, { SCHEMES: gp, getSchemeHandler: Ou } = lp;
function _p(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  Sp(e, t) : typeof e == "object" && (e = /** @type {T} */
  Hr(_r(e, t), t)), e;
}
function vp(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = Iu(Hr(e, n), Hr(t, n), n, !0);
  return n.skipEscape = !0, _r(s, n);
}
function Iu(e, t, r, n) {
  const s = {};
  return n || (e = Hr(_r(e, r), r), t = Hr(_r(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = fn(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = fn(t.path || ""), s.query = t.query) : (t.path ? (t.path[0] === "/" ? s.path = fn(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = fn(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function wp(e, t, r) {
  const n = dc(e, r), s = dc(t, r);
  return n !== void 0 && s !== void 0 && n.toLowerCase() === s.toLowerCase();
}
function _r(e, t) {
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
  }, n = Object.assign({}, t), s = [], o = Ou(n.scheme || r.scheme);
  o && o.serialize && o.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = fp(r.path) : (r.path = mp(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const a = dp(r);
  if (a !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(a), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let l = r.path;
    !n.absolutePath && (!o || !o.absolutePath) && (l = fn(l)), a === void 0 && l[0] === "/" && l[1] === "/" && (l = "/%2F" + l.slice(2)), s.push(l);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const Ep = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function bp(e, t) {
  if (t[2] !== void 0 && e.path && e.path[0] !== "/")
    return 'URI path must start with "/" when authority is present.';
  if (typeof e.port == "number" && (e.port < 0 || e.port > 65535))
    return "URI port is malformed.";
}
function ju(e, t) {
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
  const a = e.match(Ep);
  if (a) {
    n.scheme = a[1], n.userinfo = a[3], n.host = a[4], n.port = parseInt(a[5], 10), n.path = a[6] || "", n.query = a[7], n.fragment = a[8], isNaN(n.port) && (n.port = a[5]);
    const l = bp(n, a);
    if (l !== void 0 && (n.error = n.error || l, s = !0), n.host)
      if ($p(n.host) === !1) {
        const u = up(n.host);
        n.host = u.host.toLowerCase(), o = u.isIPV6;
      } else
        o = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const c = Ou(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!c || !c.unicodeSupport) && n.host && (r.domainHost || c && c.domainHost) && o === !1 && yp(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (d) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + d;
      }
    if ((!c || c && !c.skipNormalize) && (e.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = pp(unescape(n.host), o))), n.path && (n.path = hp(n.path)), n.fragment))
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
function Hr(e, t) {
  return ju(e, t).parsed;
}
function Sp(e, t) {
  return Au(e, t).normalized;
}
function Au(e, t) {
  const { parsed: r, malformedAuthorityOrPort: n } = ju(e, t);
  return {
    normalized: n ? e : _r(r, t),
    malformedAuthorityOrPort: n
  };
}
function dc(e, t) {
  if (typeof e == "string") {
    const { normalized: r, malformedAuthorityOrPort: n } = Au(e, t);
    return n ? void 0 : r;
  }
  if (typeof e == "object")
    return _r(e, t);
}
const aa = {
  SCHEMES: gp,
  normalize: _p,
  resolve: vp,
  resolveComponent: Iu,
  equal: wp,
  serialize: _r,
  parse: Hr
};
js.exports = aa;
js.exports.default = aa;
js.exports.fastUri = aa;
var ku = js.exports;
Object.defineProperty(na, "__esModule", { value: !0 });
const Cu = ku;
Cu.code = 'require("ajv/dist/runtime/uri").default';
na.default = Cu;
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
  const n = In, s = Jr, o = gr, a = Me, l = Z, c = be, d = ge, u = C, h = Mm, E = na, g = (P, p) => new RegExp(P, p);
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
    var p, S, $, i, f, b, O, I, V, L, se, qe, Gt, Ht, Bt, Wt, Xt, Jt, Yt, Qt, Zt, xt, er, tr, rr;
    const Xe = P.strict, nr = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, nn = nr === !0 || nr === void 0 ? 1 : nr || 0, sn = ($ = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && $ !== void 0 ? $ : g, Bs = (i = P.uriResolver) !== null && i !== void 0 ? i : E.default;
    return {
      strictSchema: (b = (f = P.strictSchema) !== null && f !== void 0 ? f : Xe) !== null && b !== void 0 ? b : !0,
      strictNumbers: (I = (O = P.strictNumbers) !== null && O !== void 0 ? O : Xe) !== null && I !== void 0 ? I : !0,
      strictTypes: (L = (V = P.strictTypes) !== null && V !== void 0 ? V : Xe) !== null && L !== void 0 ? L : "log",
      strictTuples: (qe = (se = P.strictTuples) !== null && se !== void 0 ? se : Xe) !== null && qe !== void 0 ? qe : "log",
      strictRequired: (Ht = (Gt = P.strictRequired) !== null && Gt !== void 0 ? Gt : Xe) !== null && Ht !== void 0 ? Ht : !1,
      code: P.code ? { ...P.code, optimize: nn, regExp: sn } : { optimize: nn, regExp: sn },
      loopRequired: (Bt = P.loopRequired) !== null && Bt !== void 0 ? Bt : v,
      loopEnum: (Wt = P.loopEnum) !== null && Wt !== void 0 ? Wt : v,
      meta: (Xt = P.meta) !== null && Xt !== void 0 ? Xt : !0,
      messages: (Jt = P.messages) !== null && Jt !== void 0 ? Jt : !0,
      inlineRefs: (Yt = P.inlineRefs) !== null && Yt !== void 0 ? Yt : !0,
      schemaId: (Qt = P.schemaId) !== null && Qt !== void 0 ? Qt : "$id",
      addUsedSchema: (Zt = P.addUsedSchema) !== null && Zt !== void 0 ? Zt : !0,
      validateSchema: (xt = P.validateSchema) !== null && xt !== void 0 ? xt : !0,
      validateFormats: (er = P.validateFormats) !== null && er !== void 0 ? er : !0,
      unicodeRegExp: (tr = P.unicodeRegExp) !== null && tr !== void 0 ? tr : !0,
      int32range: (rr = P.int32range) !== null && rr !== void 0 ? rr : !0,
      uriResolver: Bs
    };
  }
  class R {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...N(p) };
      const { es5: S, lines: $ } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: _, es5: S, lines: $ }), this.logger = G(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, o.getRules)(), T.call(this, y, p, "NOT SUPPORTED"), T.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ye.call(this), p.formats && de.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && me.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), X.call(this), p.validateFormats = i;
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
        const qe = this._addSchema(L, se);
        return qe.validate || b.call(this, qe);
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
          return O.call(this, se), await I.call(this, se.missingSchema), b.call(this, L);
        }
      }
      function O({ missingSchema: L, missingRef: se }) {
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
        const { schemaId: $ } = this.opts, i = new a.SchemaEnv({ schema: {}, schemaId: $ });
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
        return (0, u.eachItem)($, (f) => ce.call(this, f)), this;
      j.call(this, S);
      const i = {
        ...S,
        type: (0, d.getJSONTypes)(S.type),
        schemaType: (0, d.getJSONTypes)(S.schemaType)
      };
      return (0, u.eachItem)($, i.type.length === 0 ? (f) => ce.call(this, f, i) : (f) => i.type.forEach((b) => ce.call(this, f, i, b))), this;
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
        for (const O of f)
          b = b[O];
        for (const O in $) {
          const I = $[O];
          if (typeof I != "object")
            continue;
          const { $data: V } = I.definition, L = b[O];
          V && L && (b[O] = M(L));
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
      const { schemaId: O } = this.opts;
      if (typeof p == "object")
        b = p[O];
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
      return I = new a.SchemaEnv({ schema: p, schemaId: O, meta: S, baseId: $, localRefs: V }), this._cache.set(I.schema, I), f && !$.startsWith("#") && ($ && this._checkUnique($), this.refs[$] = I), i && this.validateSchema(p, !0), I;
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
  R.ValidationError = n.default, R.MissingRefError = s.default, e.default = R;
  function T(P, p, S, $ = "error") {
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
  function me(P) {
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
  const oe = /^[a-z_$][a-z0-9_$:-]*$/i;
  function H(P, p) {
    const { RULES: S } = this;
    if ((0, u.eachItem)(P, ($) => {
      if (S.keywords[$])
        throw new Error(`Keyword ${$} is already defined`);
      if (!oe.test($))
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
    const O = {
      keyword: P,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? k.call(this, b, O, p.before) : b.rules.push(O), f.all[P] = O, ($ = p.implements) === null || $ === void 0 || $.forEach((I) => this.addKeyword(I));
  }
  function k(P, p, S) {
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
})(Ul);
var ia = {}, ca = {}, la = {};
Object.defineProperty(la, "__esModule", { value: !0 });
const Pp = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
la.default = Pp;
var Pt = {};
Object.defineProperty(Pt, "__esModule", { value: !0 });
Pt.callRef = Pt.getValidate = void 0;
const Np = Jr, fc = re, Fe = Z, Pr = Ge, hc = Me, Vn = C, Rp = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: o, validateName: a, opts: l, self: c } = n, { root: d } = o;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = hc.resolveRef.call(c, d, s, r);
    if (u === void 0)
      throw new Np.default(n.opts.uriResolver, s, r);
    if (u instanceof hc.SchemaEnv)
      return E(u);
    return g(u);
    function h() {
      if (o === d)
        return os(e, a, o, o.$async);
      const w = t.scopeValue("root", { ref: d });
      return os(e, (0, Fe._)`${w}.validate`, d, d.$async);
    }
    function E(w) {
      const _ = Du(e, w);
      os(e, _, w, w.$async);
    }
    function g(w) {
      const _ = t.scopeValue("schema", l.code.source === !0 ? { ref: w, code: (0, Fe.stringify)(w) } : { ref: w }), y = t.name("valid"), m = e.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: Fe.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, y);
      e.mergeEvaluated(m), e.ok(y);
    }
  }
};
function Du(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Fe._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Pt.getValidate = Du;
function os(e, t, r, n) {
  const { gen: s, it: o } = e, { allErrors: a, schemaEnv: l, opts: c } = o, d = c.passContext ? Pr.default.this : Fe.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, Fe._)`await ${(0, fc.callValidateCode)(e, t, d)}`), g(t), a || s.assign(w, !0);
    }, (_) => {
      s.if((0, Fe._)`!(${_} instanceof ${o.ValidationError})`, () => s.throw(_)), E(_), a || s.assign(w, !1);
    }), e.ok(w);
  }
  function h() {
    e.result((0, fc.callValidateCode)(e, t, d), () => g(t), () => E(t));
  }
  function E(w) {
    const _ = (0, Fe._)`${w}.errors`;
    s.assign(Pr.default.vErrors, (0, Fe._)`${Pr.default.vErrors} === null ? ${_} : ${Pr.default.vErrors}.concat(${_})`), s.assign(Pr.default.errors, (0, Fe._)`${Pr.default.vErrors}.length`);
  }
  function g(w) {
    var _;
    if (!o.opts.unevaluated)
      return;
    const y = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (o.props !== !0)
      if (y && !y.dynamicProps)
        y.props !== void 0 && (o.props = Vn.mergeEvaluated.props(s, y.props, o.props));
      else {
        const m = s.var("props", (0, Fe._)`${w}.evaluated.props`);
        o.props = Vn.mergeEvaluated.props(s, m, o.props, Fe.Name);
      }
    if (o.items !== !0)
      if (y && !y.dynamicItems)
        y.items !== void 0 && (o.items = Vn.mergeEvaluated.items(s, y.items, o.items));
      else {
        const m = s.var("items", (0, Fe._)`${w}.evaluated.items`);
        o.items = Vn.mergeEvaluated.items(s, m, o.items, Fe.Name);
      }
  }
}
Pt.callRef = os;
Pt.default = Rp;
Object.defineProperty(ca, "__esModule", { value: !0 });
const Tp = la, Op = Pt, Ip = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  Tp.default,
  Op.default
];
ca.default = Ip;
var ua = {}, da = {};
Object.defineProperty(da, "__esModule", { value: !0 });
const $s = Z, It = $s.operators, ys = {
  maximum: { okStr: "<=", ok: It.LTE, fail: It.GT },
  minimum: { okStr: ">=", ok: It.GTE, fail: It.LT },
  exclusiveMaximum: { okStr: "<", ok: It.LT, fail: It.GTE },
  exclusiveMinimum: { okStr: ">", ok: It.GT, fail: It.LTE }
}, jp = {
  message: ({ keyword: e, schemaCode: t }) => (0, $s.str)`must be ${ys[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, $s._)`{comparison: ${ys[e].okStr}, limit: ${t}}`
}, Ap = {
  keyword: Object.keys(ys),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: jp,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, $s._)`${r} ${ys[t].fail} ${n} || isNaN(${r})`);
  }
};
da.default = Ap;
var fa = {};
Object.defineProperty(fa, "__esModule", { value: !0 });
const $n = Z, kp = {
  message: ({ schemaCode: e }) => (0, $n.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, $n._)`{multipleOf: ${e}}`
}, Cp = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: kp,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, o = s.opts.multipleOfPrecision, a = t.let("res"), l = o ? (0, $n._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, $n._)`${a} !== parseInt(${a})`;
    e.fail$data((0, $n._)`(${n} === 0 || (${a} = ${r}/${n}, ${l}))`);
  }
};
fa.default = Cp;
var ha = {}, ma = {};
Object.defineProperty(ma, "__esModule", { value: !0 });
function Mu(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
ma.default = Mu;
Mu.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(ha, "__esModule", { value: !0 });
const ir = Z, Dp = C, Mp = ma, Lp = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, ir.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, ir._)`{limit: ${e}}`
}, Vp = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Lp,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, o = t === "maxLength" ? ir.operators.GT : ir.operators.LT, a = s.opts.unicode === !1 ? (0, ir._)`${r}.length` : (0, ir._)`${(0, Dp.useFunc)(e.gen, Mp.default)}(${r})`;
    e.fail$data((0, ir._)`${a} ${o} ${n}`);
  }
};
ha.default = Vp;
var pa = {};
Object.defineProperty(pa, "__esModule", { value: !0 });
const Fp = re, zp = C, kr = Z, Up = {
  message: ({ schemaCode: e }) => (0, kr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, kr._)`{pattern: ${e}}`
}, qp = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Up,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e, l = a.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = a.opts.code, d = c.code === "new RegExp" ? (0, kr._)`new RegExp` : (0, zp.useFunc)(t, c), u = t.let("valid");
      t.try(() => t.assign(u, (0, kr._)`${d}(${o}, ${l}).test(${r})`), () => t.assign(u, !1)), e.fail$data((0, kr._)`!${u}`);
    } else {
      const c = (0, Fp.usePattern)(e, s);
      e.fail$data((0, kr._)`!${c}.test(${r})`);
    }
  }
};
pa.default = qp;
var $a = {};
Object.defineProperty($a, "__esModule", { value: !0 });
const yn = Z, Kp = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, yn.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, yn._)`{limit: ${e}}`
}, Gp = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Kp,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? yn.operators.GT : yn.operators.LT;
    e.fail$data((0, yn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
$a.default = Gp;
var ya = {};
Object.defineProperty(ya, "__esModule", { value: !0 });
const ln = re, gn = Z, Hp = C, Bp = {
  message: ({ params: { missingProperty: e } }) => (0, gn.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, gn._)`{missingProperty: ${e}}`
}, Wp = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Bp,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: o, it: a } = e, { opts: l } = a;
    if (!o && r.length === 0)
      return;
    const c = r.length >= l.loopRequired;
    if (a.allErrors ? d() : u(), l.strictRequired) {
      const g = e.parentSchema.properties, { definedProperties: w } = e.it;
      for (const _ of r)
        if ((g == null ? void 0 : g[_]) === void 0 && !w.has(_)) {
          const y = a.schemaEnv.baseId + a.errSchemaPath, m = `required property "${_}" is not defined at "${y}" (strictRequired)`;
          (0, Hp.checkStrictMode)(a, m, a.opts.strictRequired);
        }
    }
    function d() {
      if (c || o)
        e.block$data(gn.nil, h);
      else
        for (const g of r)
          (0, ln.checkReportMissingProp)(e, g);
    }
    function u() {
      const g = t.let("missing");
      if (c || o) {
        const w = t.let("valid", !0);
        e.block$data(w, () => E(g, w)), e.ok(w);
      } else
        t.if((0, ln.checkMissingProp)(e, r, g)), (0, ln.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, ln.noPropertyInData)(t, s, g, l.ownProperties), () => e.error());
      });
    }
    function E(g, w) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(w, (0, ln.propertyInData)(t, s, g, l.ownProperties)), t.if((0, gn.not)(w), () => {
          e.error(), t.break();
        });
      }, gn.nil);
    }
  }
};
ya.default = Wp;
var ga = {};
Object.defineProperty(ga, "__esModule", { value: !0 });
const _n = Z, Xp = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, _n.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, _n._)`{limit: ${e}}`
}, Jp = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Xp,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? _n.operators.GT : _n.operators.LT;
    e.fail$data((0, _n._)`${r}.length ${s} ${n}`);
  }
};
ga.default = Jp;
var _a = {}, jn = {};
Object.defineProperty(jn, "__esModule", { value: !0 });
const Lu = Ts;
Lu.code = 'require("ajv/dist/runtime/equal").default';
jn.default = Lu;
Object.defineProperty(_a, "__esModule", { value: !0 });
const eo = ge, we = Z, Yp = C, Qp = jn, Zp = {
  message: ({ params: { i: e, j: t } }) => (0, we.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, we._)`{i: ${e}, j: ${t}}`
}, xp = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Zp,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: o, schemaCode: a, it: l } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = o.items ? (0, eo.getSchemaTypes)(o.items) : [];
    e.block$data(c, u, (0, we._)`${a} === false`), e.ok(c);
    function u() {
      const w = t.let("i", (0, we._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: w, j: _ }), t.assign(c, !0), t.if((0, we._)`${w} > 1`, () => (h() ? E : g)(w, _));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function E(w, _) {
      const y = t.name("item"), m = (0, eo.checkDataTypes)(d, y, l.opts.strictNumbers, eo.DataType.Wrong), v = t.const("indices", (0, we._)`{}`);
      t.for((0, we._)`;${w}--;`, () => {
        t.let(y, (0, we._)`${r}[${w}]`), t.if(m, (0, we._)`continue`), d.length > 1 && t.if((0, we._)`typeof ${y} == "string"`, (0, we._)`${y} += "_"`), t.if((0, we._)`typeof ${v}[${y}] == "number"`, () => {
          t.assign(_, (0, we._)`${v}[${y}]`), e.error(), t.assign(c, !1).break();
        }).code((0, we._)`${v}[${y}] = ${w}`);
      });
    }
    function g(w, _) {
      const y = (0, Yp.useFunc)(t, Qp.default), m = t.name("outer");
      t.label(m).for((0, we._)`;${w}--;`, () => t.for((0, we._)`${_} = ${w}; ${_}--;`, () => t.if((0, we._)`${y}(${r}[${w}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
_a.default = xp;
var va = {};
Object.defineProperty(va, "__esModule", { value: !0 });
const Oo = Z, e$ = C, t$ = jn, r$ = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Oo._)`{allowedValue: ${e}}`
}, n$ = {
  keyword: "const",
  $data: !0,
  error: r$,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: o } = e;
    n || o && typeof o == "object" ? e.fail$data((0, Oo._)`!${(0, e$.useFunc)(t, t$.default)}(${r}, ${s})`) : e.fail((0, Oo._)`${o} !== ${r}`);
  }
};
va.default = n$;
var wa = {};
Object.defineProperty(wa, "__esModule", { value: !0 });
const hn = Z, s$ = C, o$ = jn, a$ = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, hn._)`{allowedValues: ${e}}`
}, i$ = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: a$,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= a.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, s$.useFunc)(t, o$.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", o);
      u = (0, hn.or)(...s.map((w, _) => E(g, _)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", o, (g) => t.if((0, hn._)`${d()}(${r}, ${g})`, () => t.assign(u, !0).break()));
    }
    function E(g, w) {
      const _ = s[w];
      return typeof _ == "object" && _ !== null ? (0, hn._)`${d()}(${r}, ${g}[${w}])` : (0, hn._)`${r} === ${_}`;
    }
  }
};
wa.default = i$;
Object.defineProperty(ua, "__esModule", { value: !0 });
const c$ = da, l$ = fa, u$ = ha, d$ = pa, f$ = $a, h$ = ya, m$ = ga, p$ = _a, $$ = va, y$ = wa, g$ = [
  // number
  c$.default,
  l$.default,
  // string
  u$.default,
  d$.default,
  // object
  f$.default,
  h$.default,
  // array
  m$.default,
  p$.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  $$.default,
  y$.default
];
ua.default = g$;
var Ea = {}, Yr = {};
Object.defineProperty(Yr, "__esModule", { value: !0 });
Yr.validateAdditionalItems = void 0;
const cr = Z, Io = C, _$ = {
  message: ({ params: { len: e } }) => (0, cr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, cr._)`{limit: ${e}}`
}, v$ = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: _$,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Io.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Vu(e, n);
  }
};
function Vu(e, t) {
  const { gen: r, schema: n, data: s, keyword: o, it: a } = e;
  a.items = !0;
  const l = r.const("len", (0, cr._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, cr._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Io.alwaysValidSchema)(a, n)) {
    const d = r.var("valid", (0, cr._)`${l} <= ${t.length}`);
    r.if((0, cr.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: o, dataProp: u, dataPropType: Io.Type.Num }, d), a.allErrors || r.if((0, cr.not)(d), () => r.break());
    });
  }
}
Yr.validateAdditionalItems = Vu;
Yr.default = v$;
var ba = {}, Qr = {};
Object.defineProperty(Qr, "__esModule", { value: !0 });
Qr.validateTuple = void 0;
const mc = Z, as = C, w$ = re, E$ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Fu(e, "additionalItems", t);
    r.items = !0, !(0, as.alwaysValidSchema)(r, t) && e.ok((0, w$.validateArray)(e));
  }
};
function Fu(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: o, keyword: a, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = as.mergeEvaluated.items(n, r.length, l.items));
  const c = n.name("valid"), d = n.const("len", (0, mc._)`${o}.length`);
  r.forEach((h, E) => {
    (0, as.alwaysValidSchema)(l, h) || (n.if((0, mc._)`${d} > ${E}`, () => e.subschema({
      keyword: a,
      schemaProp: E,
      dataProp: E
    }, c)), e.ok(c));
  });
  function u(h) {
    const { opts: E, errSchemaPath: g } = l, w = r.length, _ = w === h.minItems && (w === h.maxItems || h[t] === !1);
    if (E.strictTuples && !_) {
      const y = `"${a}" is ${w}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, as.checkStrictMode)(l, y, E.strictTuples);
    }
  }
}
Qr.validateTuple = Fu;
Qr.default = E$;
Object.defineProperty(ba, "__esModule", { value: !0 });
const b$ = Qr, S$ = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, b$.validateTuple)(e, "items")
};
ba.default = S$;
var Sa = {};
Object.defineProperty(Sa, "__esModule", { value: !0 });
const pc = Z, P$ = C, N$ = re, R$ = Yr, T$ = {
  message: ({ params: { len: e } }) => (0, pc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, pc._)`{limit: ${e}}`
}, O$ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: T$,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, P$.alwaysValidSchema)(n, t) && (s ? (0, R$.validateAdditionalItems)(e, s) : e.ok((0, N$.validateArray)(e)));
  }
};
Sa.default = O$;
var Pa = {};
Object.defineProperty(Pa, "__esModule", { value: !0 });
const Be = Z, Fn = C, I$ = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Be.str)`must contain at least ${e} valid item(s)` : (0, Be.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Be._)`{minContains: ${e}}` : (0, Be._)`{minContains: ${e}, maxContains: ${t}}`
}, j$ = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: I$,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    let a, l;
    const { minContains: c, maxContains: d } = n;
    o.opts.next ? (a = c === void 0 ? 1 : c, l = d) : a = 1;
    const u = t.const("len", (0, Be._)`${s}.length`);
    if (e.setParams({ min: a, max: l }), l === void 0 && a === 0) {
      (0, Fn.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && a > l) {
      (0, Fn.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Fn.alwaysValidSchema)(o, r)) {
      let _ = (0, Be._)`${u} >= ${a}`;
      l !== void 0 && (_ = (0, Be._)`${_} && ${u} <= ${l}`), e.pass(_);
      return;
    }
    o.items = !0;
    const h = t.name("valid");
    l === void 0 && a === 1 ? g(h, () => t.if(h, () => t.break())) : a === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, Be._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const _ = t.name("_valid"), y = t.let("count", 0);
      g(_, () => t.if(_, () => w(y)));
    }
    function g(_, y) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: Fn.Type.Num,
          compositeRule: !0
        }, _), y();
      });
    }
    function w(_) {
      t.code((0, Be._)`${_}++`), l === void 0 ? t.if((0, Be._)`${_} >= ${a}`, () => t.assign(h, !0).break()) : (t.if((0, Be._)`${_} > ${l}`, () => t.assign(h, !1).break()), a === 1 ? t.assign(h, !0) : t.if((0, Be._)`${_} >= ${a}`, () => t.assign(h, !0)));
    }
  }
};
Pa.default = j$;
var As = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = Z, r = C, n = re;
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
      const [d, u] = o(c);
      a(c, d), l(c, u);
    }
  };
  function o({ schema: c }) {
    const d = {}, u = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const E = Array.isArray(c[h]) ? d : u;
      E[h] = c[h];
    }
    return [d, u];
  }
  function a(c, d = c.schema) {
    const { gen: u, data: h, it: E } = c;
    if (Object.keys(d).length === 0)
      return;
    const g = u.let("missing");
    for (const w in d) {
      const _ = d[w];
      if (_.length === 0)
        continue;
      const y = (0, n.propertyInData)(u, h, w, E.opts.ownProperties);
      c.setParams({
        property: w,
        depsCount: _.length,
        deps: _.join(", ")
      }), E.allErrors ? u.if(y, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (u.if((0, t._)`${y} && (${(0, n.checkMissingProp)(c, _, g)})`), (0, n.reportMissingProp)(c, g), u.else());
    }
  }
  e.validatePropertyDeps = a;
  function l(c, d = c.schema) {
    const { gen: u, data: h, keyword: E, it: g } = c, w = u.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)(g, d[_]) || (u.if(
        (0, n.propertyInData)(u, h, _, g.opts.ownProperties),
        () => {
          const y = c.subschema({ keyword: E, schemaProp: _ }, w);
          c.mergeValidEvaluated(y, w);
        },
        () => u.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  e.validateSchemaDeps = l, e.default = s;
})(As);
var Na = {};
Object.defineProperty(Na, "__esModule", { value: !0 });
const zu = Z, A$ = C, k$ = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, zu._)`{propertyName: ${e.propertyName}}`
}, C$ = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: k$,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, A$.alwaysValidSchema)(s, r))
      return;
    const o = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, o), t.if((0, zu.not)(o), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
Na.default = C$;
var ks = {};
Object.defineProperty(ks, "__esModule", { value: !0 });
const zn = re, Ze = Z, D$ = Ge, Un = C, M$ = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Ze._)`{additionalProperty: ${e.additionalProperty}}`
}, L$ = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: M$,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: o, it: a } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: c } = a;
    if (a.props = !0, c.removeAdditional !== "all" && (0, Un.alwaysValidSchema)(a, r))
      return;
    const d = (0, zn.allSchemaProperties)(n.properties), u = (0, zn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Ze._)`${o} === ${D$.default.errors}`);
    function h() {
      t.forIn("key", s, (y) => {
        !d.length && !u.length ? w(y) : t.if(E(y), () => w(y));
      });
    }
    function E(y) {
      let m;
      if (d.length > 8) {
        const v = (0, Un.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, zn.isOwnProperty)(t, v, y);
      } else d.length ? m = (0, Ze.or)(...d.map((v) => (0, Ze._)`${y} === ${v}`)) : m = Ze.nil;
      return u.length && (m = (0, Ze.or)(m, ...u.map((v) => (0, Ze._)`${(0, zn.usePattern)(e, v)}.test(${y})`))), (0, Ze.not)(m);
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
        e.setParams({ additionalProperty: y }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, Un.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_(y, m, !1), t.if((0, Ze.not)(m), () => {
          e.reset(), g(y);
        })) : (_(y, m), l || t.if((0, Ze.not)(m), () => t.break()));
      }
    }
    function _(y, m, v) {
      const N = {
        keyword: "additionalProperties",
        dataProp: y,
        dataPropType: Un.Type.Str
      };
      v === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
ks.default = L$;
var Ra = {};
Object.defineProperty(Ra, "__esModule", { value: !0 });
const V$ = nt, $c = re, to = C, yc = ks, F$ = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && yc.default.code(new V$.KeywordCxt(o, yc.default, "additionalProperties"));
    const a = (0, $c.allSchemaProperties)(r);
    for (const h of a)
      o.definedProperties.add(h);
    o.opts.unevaluated && a.length && o.props !== !0 && (o.props = to.mergeEvaluated.props(t, (0, to.toHash)(a), o.props));
    const l = a.filter((h) => !(0, to.alwaysValidSchema)(o, r[h]));
    if (l.length === 0)
      return;
    const c = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, $c.propertyInData)(t, s, h, o.opts.ownProperties)), u(h), o.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return o.opts.useDefaults && !o.compositeRule && r[h].default !== void 0;
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
Ra.default = F$;
var Ta = {};
Object.defineProperty(Ta, "__esModule", { value: !0 });
const gc = re, qn = Z, _c = C, vc = C, z$ = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: o } = e, { opts: a } = o, l = (0, gc.allSchemaProperties)(r), c = l.filter((_) => (0, _c.alwaysValidSchema)(o, r[_]));
    if (l.length === 0 || c.length === l.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const d = a.strictSchema && !a.allowMatchingProperties && s.properties, u = t.name("valid");
    o.props !== !0 && !(o.props instanceof qn.Name) && (o.props = (0, vc.evaluatedPropsToName)(t, o.props));
    const { props: h } = o;
    E();
    function E() {
      for (const _ of l)
        d && g(_), o.allErrors ? w(_) : (t.var(u, !0), w(_), t.if(u));
    }
    function g(_) {
      for (const y in d)
        new RegExp(_).test(y) && (0, _c.checkStrictMode)(o, `property ${y} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function w(_) {
      t.forIn("key", n, (y) => {
        t.if((0, qn._)`${(0, gc.usePattern)(e, _)}.test(${y})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: y,
            dataPropType: vc.Type.Str
          }, u), o.opts.unevaluated && h !== !0 ? t.assign((0, qn._)`${h}[${y}]`, !0) : !m && !o.allErrors && t.if((0, qn.not)(u), () => t.break());
        });
      });
    }
  }
};
Ta.default = z$;
var Oa = {};
Object.defineProperty(Oa, "__esModule", { value: !0 });
const U$ = C, q$ = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, U$.alwaysValidSchema)(n, r)) {
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
Oa.default = q$;
var Ia = {};
Object.defineProperty(Ia, "__esModule", { value: !0 });
const K$ = re, G$ = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: K$.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Ia.default = G$;
var ja = {};
Object.defineProperty(ja, "__esModule", { value: !0 });
const is = Z, H$ = C, B$ = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, is._)`{passingSchemas: ${e.passing}}`
}, W$ = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: B$,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const o = r, a = t.let("valid", !1), l = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: l }), t.block(d), e.result(a, () => e.reset(), () => e.error(!0));
    function d() {
      o.forEach((u, h) => {
        let E;
        (0, H$.alwaysValidSchema)(s, u) ? t.var(c, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, is._)`${c} && ${a}`).assign(a, !1).assign(l, (0, is._)`[${l}, ${h}]`).else(), t.if(c, () => {
          t.assign(a, !0), t.assign(l, h), E && e.mergeEvaluated(E, is.Name);
        });
      });
    }
  }
};
ja.default = W$;
var Aa = {};
Object.defineProperty(Aa, "__esModule", { value: !0 });
const X$ = C, J$ = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((o, a) => {
      if ((0, X$.alwaysValidSchema)(n, o))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: a }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
Aa.default = J$;
var ka = {};
Object.defineProperty(ka, "__esModule", { value: !0 });
const gs = Z, Uu = C, Y$ = {
  message: ({ params: e }) => (0, gs.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, gs._)`{failingKeyword: ${e.ifClause}}`
}, Q$ = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Y$,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Uu.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = wc(n, "then"), o = wc(n, "else");
    if (!s && !o)
      return;
    const a = t.let("valid", !0), l = t.name("_valid");
    if (c(), e.reset(), s && o) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, gs.not)(l), d("else"));
    e.pass(a, () => e.error(!0));
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
        const E = e.subschema({ keyword: u }, l);
        t.assign(a, l), e.mergeValidEvaluated(E, a), h ? t.assign(h, (0, gs._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function wc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Uu.alwaysValidSchema)(e, r);
}
ka.default = Q$;
var Ca = {};
Object.defineProperty(Ca, "__esModule", { value: !0 });
const Z$ = C, x$ = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Z$.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Ca.default = x$;
Object.defineProperty(Ea, "__esModule", { value: !0 });
const ey = Yr, ty = ba, ry = Qr, ny = Sa, sy = Pa, oy = As, ay = Na, iy = ks, cy = Ra, ly = Ta, uy = Oa, dy = Ia, fy = ja, hy = Aa, my = ka, py = Ca;
function $y(e = !1) {
  const t = [
    // any
    uy.default,
    dy.default,
    fy.default,
    hy.default,
    my.default,
    py.default,
    // object
    ay.default,
    iy.default,
    oy.default,
    cy.default,
    ly.default
  ];
  return e ? t.push(ty.default, ny.default) : t.push(ey.default, ry.default), t.push(sy.default), t;
}
Ea.default = $y;
var Da = {}, Zr = {};
Object.defineProperty(Zr, "__esModule", { value: !0 });
Zr.dynamicAnchor = void 0;
const ro = Z, yy = Ge, Ec = Me, gy = Pt, _y = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => qu(e, e.schema)
};
function qu(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, ro._)`${yy.default.dynamicAnchors}${(0, ro.getProperty)(t)}`, o = n.errSchemaPath === "#" ? n.validateName : vy(e);
  r.if((0, ro._)`!${s}`, () => r.assign(s, o));
}
Zr.dynamicAnchor = qu;
function vy(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: o, localRefs: a, meta: l } = t.root, { schemaId: c } = n.opts, d = new Ec.SchemaEnv({ schema: r, schemaId: c, root: s, baseId: o, localRefs: a, meta: l });
  return Ec.compileSchema.call(n, d), (0, gy.getValidate)(e, d);
}
Zr.default = _y;
var xr = {};
Object.defineProperty(xr, "__esModule", { value: !0 });
xr.dynamicRef = void 0;
const bc = Z, wy = Ge, Sc = Pt, Ey = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => Ku(e, e.schema)
};
function Ku(e, t) {
  const { gen: r, keyword: n, it: s } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const o = t.slice(1);
  if (s.allErrors)
    a();
  else {
    const c = r.let("valid", !1);
    a(c), e.ok(c);
  }
  function a(c) {
    if (s.schemaEnv.root.dynamicAnchors[o]) {
      const d = r.let("_v", (0, bc._)`${wy.default.dynamicAnchors}${(0, bc.getProperty)(o)}`);
      r.if(d, l(d, c), l(s.validateName, c));
    } else
      l(s.validateName, c)();
  }
  function l(c, d) {
    return d ? () => r.block(() => {
      (0, Sc.callRef)(e, c), r.let(d, !0);
    }) : () => (0, Sc.callRef)(e, c);
  }
}
xr.dynamicRef = Ku;
xr.default = Ey;
var Ma = {};
Object.defineProperty(Ma, "__esModule", { value: !0 });
const by = Zr, Sy = C, Py = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, by.dynamicAnchor)(e, "") : (0, Sy.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
Ma.default = Py;
var La = {};
Object.defineProperty(La, "__esModule", { value: !0 });
const Ny = xr, Ry = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, Ny.dynamicRef)(e, e.schema)
};
La.default = Ry;
Object.defineProperty(Da, "__esModule", { value: !0 });
const Ty = Zr, Oy = xr, Iy = Ma, jy = La, Ay = [Ty.default, Oy.default, Iy.default, jy.default];
Da.default = Ay;
var Va = {}, Fa = {};
Object.defineProperty(Fa, "__esModule", { value: !0 });
const Pc = As, ky = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Pc.error,
  code: (e) => (0, Pc.validatePropertyDeps)(e)
};
Fa.default = ky;
var za = {};
Object.defineProperty(za, "__esModule", { value: !0 });
const Cy = As, Dy = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, Cy.validateSchemaDeps)(e)
};
za.default = Dy;
var Ua = {};
Object.defineProperty(Ua, "__esModule", { value: !0 });
const My = C, Ly = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, My.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
Ua.default = Ly;
Object.defineProperty(Va, "__esModule", { value: !0 });
const Vy = Fa, Fy = za, zy = Ua, Uy = [Vy.default, Fy.default, zy.default];
Va.default = Uy;
var qa = {}, Ka = {};
Object.defineProperty(Ka, "__esModule", { value: !0 });
const kt = Z, Nc = C, qy = Ge, Ky = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, kt._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, Gy = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: Ky,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: o } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: a, props: l } = o;
    l instanceof kt.Name ? t.if((0, kt._)`${l} !== true`, () => t.forIn("key", n, (h) => t.if(d(l, h), () => c(h)))) : l !== !0 && t.forIn("key", n, (h) => l === void 0 ? c(h) : t.if(u(l, h), () => c(h))), o.props = !0, e.ok((0, kt._)`${s} === ${qy.default.errors}`);
    function c(h) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: h }), e.error(), a || t.break();
        return;
      }
      if (!(0, Nc.alwaysValidSchema)(o, r)) {
        const E = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: Nc.Type.Str
        }, E), a || t.if((0, kt.not)(E), () => t.break());
      }
    }
    function d(h, E) {
      return (0, kt._)`!${h} || !${h}[${E}]`;
    }
    function u(h, E) {
      const g = [];
      for (const w in h)
        h[w] === !0 && g.push((0, kt._)`${E} !== ${w}`);
      return (0, kt.and)(...g);
    }
  }
};
Ka.default = Gy;
var Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
const lr = Z, Rc = C, Hy = {
  message: ({ params: { len: e } }) => (0, lr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, lr._)`{limit: ${e}}`
}, By = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: Hy,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, o = s.items || 0;
    if (o === !0)
      return;
    const a = t.const("len", (0, lr._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: o }), e.fail((0, lr._)`${a} > ${o}`);
    else if (typeof r == "object" && !(0, Rc.alwaysValidSchema)(s, r)) {
      const c = t.var("valid", (0, lr._)`${a} <= ${o}`);
      t.if((0, lr.not)(c), () => l(c, o)), e.ok(c);
    }
    s.items = !0;
    function l(c, d) {
      t.forRange("i", d, a, (u) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: u, dataPropType: Rc.Type.Num }, c), s.allErrors || t.if((0, lr.not)(c), () => t.break());
      });
    }
  }
};
Ga.default = By;
Object.defineProperty(qa, "__esModule", { value: !0 });
const Wy = Ka, Xy = Ga, Jy = [Wy.default, Xy.default];
qa.default = Jy;
var Ha = {}, Ba = {};
Object.defineProperty(Ba, "__esModule", { value: !0 });
const pe = Z, Yy = {
  message: ({ schemaCode: e }) => (0, pe.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, pe._)`{format: ${e}}`
}, Qy = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Yy,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: o, schemaCode: a, it: l } = e, { opts: c, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!c.validateFormats)
      return;
    s ? E() : g();
    function E() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, pe._)`${w}[${a}]`), y = r.let("fType"), m = r.let("format");
      r.if((0, pe._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign(y, (0, pe._)`${_}.type || "string"`).assign(m, (0, pe._)`${_}.validate`), () => r.assign(y, (0, pe._)`"string"`).assign(m, _)), e.fail$data((0, pe.or)(v(), N()));
      function v() {
        return c.strictSchema === !1 ? pe.nil : (0, pe._)`${a} && !${m}`;
      }
      function N() {
        const R = u.$async ? (0, pe._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, pe._)`${m}(${n})`, T = (0, pe._)`(typeof ${m} == "function" ? ${R} : ${m}.test(${n}))`;
        return (0, pe._)`${m} && ${m} !== true && ${y} === ${t} && !${T}`;
      }
    }
    function g() {
      const w = h.formats[o];
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
          h.logger.warn(T());
          return;
        }
        throw new Error(T());
        function T() {
          return `unknown format "${o}" ignored in schema at path "${d}"`;
        }
      }
      function N(T) {
        const K = T instanceof RegExp ? (0, pe.regexpCode)(T) : c.code.formats ? (0, pe._)`${c.code.formats}${(0, pe.getProperty)(o)}` : void 0, X = r.scopeValue("formats", { key: o, ref: T, code: K });
        return typeof T == "object" && !(T instanceof RegExp) ? [T.type || "string", T.validate, (0, pe._)`${X}.validate`] : ["string", T, X];
      }
      function R() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, pe._)`await ${m}(${n})`;
        }
        return typeof y == "function" ? (0, pe._)`${m}(${n})` : (0, pe._)`${m}.test(${n})`;
      }
    }
  }
};
Ba.default = Qy;
Object.defineProperty(Ha, "__esModule", { value: !0 });
const Zy = Ba, xy = [Zy.default];
Ha.default = xy;
var Br = {};
Object.defineProperty(Br, "__esModule", { value: !0 });
Br.contentVocabulary = Br.metadataVocabulary = void 0;
Br.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Br.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(ia, "__esModule", { value: !0 });
const e0 = ca, t0 = ua, r0 = Ea, n0 = Da, s0 = Va, o0 = qa, a0 = Ha, Tc = Br, i0 = [
  n0.default,
  e0.default,
  t0.default,
  (0, r0.default)(!0),
  a0.default,
  Tc.metadataVocabulary,
  Tc.contentVocabulary,
  s0.default,
  o0.default
];
ia.default = i0;
var Wa = {}, Cs = {};
Object.defineProperty(Cs, "__esModule", { value: !0 });
Cs.DiscrError = void 0;
var Oc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Oc || (Cs.DiscrError = Oc = {}));
Object.defineProperty(Wa, "__esModule", { value: !0 });
const Or = Z, jo = Cs, Ic = Me, c0 = Jr, l0 = C, u0 = {
  message: ({ params: { discrError: e, tagName: t } }) => e === jo.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, Or._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, d0 = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: u0,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: o } = e, { oneOf: a } = s;
    if (!o.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const l = n.propertyName;
    if (typeof l != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!a)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, Or._)`${r}${(0, Or.getProperty)(l)}`);
    t.if((0, Or._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: jo.DiscrError.Tag, tag: d, tagName: l })), e.ok(c);
    function u() {
      const g = E();
      t.if(!1);
      for (const w in g)
        t.elseIf((0, Or._)`${d} === ${w}`), t.assign(c, h(g[w]));
      t.else(), e.error(!1, { discrError: jo.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(g) {
      const w = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: g }, w);
      return e.mergeEvaluated(_, Or.Name), w;
    }
    function E() {
      var g;
      const w = {}, _ = m(s);
      let y = !0;
      for (let R = 0; R < a.length; R++) {
        let T = a[R];
        if (T != null && T.$ref && !(0, l0.schemaHasRulesButRef)(T, o.self.RULES)) {
          const X = T.$ref;
          if (T = Ic.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, X), T instanceof Ic.SchemaEnv && (T = T.schema), T === void 0)
            throw new c0.default(o.opts.uriResolver, o.baseId, X);
        }
        const K = (g = T == null ? void 0 : T.properties) === null || g === void 0 ? void 0 : g[l];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        y = y && (_ || m(T)), v(K, R);
      }
      if (!y)
        throw new Error(`discriminator: "${l}" must be required`);
      return w;
      function m({ required: R }) {
        return Array.isArray(R) && R.includes(l);
      }
      function v(R, T) {
        if (R.const)
          N(R.const, T);
        else if (R.enum)
          for (const K of R.enum)
            N(K, T);
        else
          throw new Error(`discriminator: "properties/${l}" must have "const" or "enum"`);
      }
      function N(R, T) {
        if (typeof R != "string" || R in w)
          throw new Error(`discriminator: "${l}" values must be unique strings`);
        w[R] = T;
      }
    }
  }
};
Wa.default = d0;
var Xa = {};
const f0 = "https://json-schema.org/draft/2020-12/schema", h0 = "https://json-schema.org/draft/2020-12/schema", m0 = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, p0 = "meta", $0 = "Core and Validation specifications meta-schema", y0 = [
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
], g0 = [
  "object",
  "boolean"
], _0 = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", v0 = {
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
}, w0 = {
  $schema: f0,
  $id: h0,
  $vocabulary: m0,
  $dynamicAnchor: p0,
  title: $0,
  allOf: y0,
  type: g0,
  $comment: _0,
  properties: v0
}, E0 = "https://json-schema.org/draft/2020-12/schema", b0 = "https://json-schema.org/draft/2020-12/meta/applicator", S0 = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, P0 = "meta", N0 = "Applicator vocabulary meta-schema", R0 = [
  "object",
  "boolean"
], T0 = {
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
}, O0 = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, I0 = {
  $schema: E0,
  $id: b0,
  $vocabulary: S0,
  $dynamicAnchor: P0,
  title: N0,
  type: R0,
  properties: T0,
  $defs: O0
}, j0 = "https://json-schema.org/draft/2020-12/schema", A0 = "https://json-schema.org/draft/2020-12/meta/unevaluated", k0 = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, C0 = "meta", D0 = "Unevaluated applicator vocabulary meta-schema", M0 = [
  "object",
  "boolean"
], L0 = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, V0 = {
  $schema: j0,
  $id: A0,
  $vocabulary: k0,
  $dynamicAnchor: C0,
  title: D0,
  type: M0,
  properties: L0
}, F0 = "https://json-schema.org/draft/2020-12/schema", z0 = "https://json-schema.org/draft/2020-12/meta/content", U0 = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, q0 = "meta", K0 = "Content vocabulary meta-schema", G0 = [
  "object",
  "boolean"
], H0 = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, B0 = {
  $schema: F0,
  $id: z0,
  $vocabulary: U0,
  $dynamicAnchor: q0,
  title: K0,
  type: G0,
  properties: H0
}, W0 = "https://json-schema.org/draft/2020-12/schema", X0 = "https://json-schema.org/draft/2020-12/meta/core", J0 = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, Y0 = "meta", Q0 = "Core vocabulary meta-schema", Z0 = [
  "object",
  "boolean"
], x0 = {
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
}, eg = {
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
}, tg = {
  $schema: W0,
  $id: X0,
  $vocabulary: J0,
  $dynamicAnchor: Y0,
  title: Q0,
  type: Z0,
  properties: x0,
  $defs: eg
}, rg = "https://json-schema.org/draft/2020-12/schema", ng = "https://json-schema.org/draft/2020-12/meta/format-annotation", sg = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, og = "meta", ag = "Format vocabulary meta-schema for annotation results", ig = [
  "object",
  "boolean"
], cg = {
  format: {
    type: "string"
  }
}, lg = {
  $schema: rg,
  $id: ng,
  $vocabulary: sg,
  $dynamicAnchor: og,
  title: ag,
  type: ig,
  properties: cg
}, ug = "https://json-schema.org/draft/2020-12/schema", dg = "https://json-schema.org/draft/2020-12/meta/meta-data", fg = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, hg = "meta", mg = "Meta-data vocabulary meta-schema", pg = [
  "object",
  "boolean"
], $g = {
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
}, yg = {
  $schema: ug,
  $id: dg,
  $vocabulary: fg,
  $dynamicAnchor: hg,
  title: mg,
  type: pg,
  properties: $g
}, gg = "https://json-schema.org/draft/2020-12/schema", _g = "https://json-schema.org/draft/2020-12/meta/validation", vg = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, wg = "meta", Eg = "Validation vocabulary meta-schema", bg = [
  "object",
  "boolean"
], Sg = {
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
}, Pg = {
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
}, Ng = {
  $schema: gg,
  $id: _g,
  $vocabulary: vg,
  $dynamicAnchor: wg,
  title: Eg,
  type: bg,
  properties: Sg,
  $defs: Pg
};
Object.defineProperty(Xa, "__esModule", { value: !0 });
const Rg = w0, Tg = I0, Og = V0, Ig = B0, jg = tg, Ag = lg, kg = yg, Cg = Ng, Dg = ["/properties"];
function Mg(e) {
  return [
    Rg,
    Tg,
    Og,
    Ig,
    jg,
    t(this, Ag),
    kg,
    t(this, Cg)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, Dg) : n;
  }
}
Xa.default = Mg;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = Ul, n = ia, s = Wa, o = Xa, a = "https://json-schema.org/draft/2020-12/schema";
  class l extends r.default {
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
      w && (o.default.call(this, g), this.refs["http://json-schema.org/schema"] = a);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
    }
  }
  t.Ajv2020 = l, e.exports = t = l, e.exports.Ajv2020 = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
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
  var u = In;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return u.default;
  } });
  var h = Jr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(So, So.exports);
var Lg = So.exports, Ao = { exports: {} }, Gu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(F, G) {
    return { validate: F, compare: G };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(o, a),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(c(!0), d),
    "date-time": t(E(!0), g),
    "iso-time": t(c(), u),
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
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, a),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, d),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, g),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, u),
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
  function o(F) {
    const G = n.exec(F);
    if (!G)
      return !1;
    const oe = +G[1], H = +G[2], ce = +G[3];
    return H >= 1 && H <= 12 && ce >= 1 && ce <= (H === 2 && r(oe) ? 29 : s[H]);
  }
  function a(F, G) {
    if (F && G)
      return F > G ? 1 : F < G ? -1 : 0;
  }
  const l = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(F) {
    return function(oe) {
      const H = l.exec(oe);
      if (!H)
        return !1;
      const ce = +H[1], k = +H[2], j = +H[3], z = H[4], M = H[5] === "-" ? -1 : 1, P = +(H[6] || 0), p = +(H[7] || 0);
      if (P > 23 || p > 59 || F && !z)
        return !1;
      if (ce <= 23 && k <= 59 && j < 60)
        return !0;
      const S = k - p * M, $ = ce - P * M - (S < 0 ? 1 : 0);
      return ($ === 23 || $ === -1) && (S === 59 || S === -1) && j < 61;
    };
  }
  function d(F, G) {
    if (!(F && G))
      return;
    const oe = (/* @__PURE__ */ new Date("2020-01-01T" + F)).valueOf(), H = (/* @__PURE__ */ new Date("2020-01-01T" + G)).valueOf();
    if (oe && H)
      return oe - H;
  }
  function u(F, G) {
    if (!(F && G))
      return;
    const oe = l.exec(F), H = l.exec(G);
    if (oe && H)
      return F = oe[1] + oe[2] + oe[3], G = H[1] + H[2] + H[3], F > G ? 1 : F < G ? -1 : 0;
  }
  const h = /t|\s/i;
  function E(F) {
    const G = c(F);
    return function(H) {
      const ce = H.split(h);
      return ce.length === 2 && o(ce[0]) && G(ce[1]);
    };
  }
  function g(F, G) {
    if (!(F && G))
      return;
    const oe = new Date(F).valueOf(), H = new Date(G).valueOf();
    if (oe && H)
      return oe - H;
  }
  function w(F, G) {
    if (!(F && G))
      return;
    const [oe, H] = F.split(h), [ce, k] = G.split(h), j = a(oe, ce);
    if (j !== void 0)
      return j || d(H, k);
  }
  const _ = /\/|:/, y = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(F) {
    return _.test(F) && y.test(F);
  }
  const v = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function N(F) {
    return v.lastIndex = 0, v.test(F);
  }
  const R = -2147483648, T = 2 ** 31 - 1;
  function K(F) {
    return Number.isInteger(F) && F <= T && F >= R;
  }
  function X(F) {
    return Number.isInteger(F);
  }
  function de() {
    return !0;
  }
  const me = /[^\\]\\Z/;
  function ye(F) {
    if (me.test(F))
      return !1;
    try {
      return new RegExp(F), !0;
    } catch {
      return !1;
    }
  }
})(Gu);
var Hu = {}, ko = { exports: {} }, Bu = {}, st = {}, Wr = {}, An = {}, te = {}, Rn = {};
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
      l(N, v[R]), N.push(m[++R]);
    return new n(N);
  }
  e._ = s;
  const o = new n("+");
  function a(m, ...v) {
    const N = [g(m[0])];
    let R = 0;
    for (; R < v.length; )
      N.push(o), l(N, v[R]), N.push(o, g(m[++R]));
    return c(N), new n(N);
  }
  e.str = a;
  function l(m, v) {
    v instanceof n ? m.push(...v._items) : v instanceof r ? m.push(v) : m.push(h(v));
  }
  e.addCodeArg = l;
  function c(m) {
    let v = 1;
    for (; v < m.length - 1; ) {
      if (m[v] === o) {
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
  function u(m, v) {
    return v.emptyStr() ? m : m.emptyStr() ? v : a`${m}${v}`;
  }
  e.strConcat = u;
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
})(Rn);
var Co = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = Rn;
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
  class l extends s {
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
      const E = this.toName(d), { prefix: g } = E, w = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let _ = this._values[g];
      if (_) {
        const v = _.get(w);
        if (v)
          return v;
      } else
        _ = this._values[g] = /* @__PURE__ */ new Map();
      _.set(w, E);
      const y = this._scope[g] || (this._scope[g] = []), m = y.length;
      return y[m] = u.ref, E.setValue(u, { property: g, itemIndex: m }), E;
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
      return this._reduceValues(d, (E) => {
        if (E.value === void 0)
          throw new Error(`CodeGen: name "${E}" has no value`);
        return E.value.code;
      }, u, h);
    }
    _reduceValues(d, u, h = {}, E) {
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
          let v = u(m);
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
  e.ValueScope = l;
})(Co);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Rn, r = Co;
  var n = Rn;
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
  var s = Co;
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
      const b = i ? r.varKinds.var : this.varKind, O = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${b} ${this.name}${O};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = H(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class l extends o {
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
      return oe(i, this.rhs);
    }
  }
  class c extends l {
    constructor(i, f, b, O) {
      super(i, b, O), this.op = f;
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
  class E extends o {
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
  class g extends o {
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
      let O = b.length;
      for (; O--; ) {
        const I = b[O];
        I.optimizeNames(i, f) || (ce(i, I.names), b.splice(O, 1));
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
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(k(i), f instanceof m ? [f] : f.nodes);
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
      return oe(i, this.condition), this.else && G(i, this.else.names), i;
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
    constructor(i, f, b, O) {
      super(), this.varKind = i, this.name = f, this.from = b, this.to = O;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: b, from: O, to: I } = this;
      return `for(${f} ${b}=${O}; ${b}<${I}; ${b}++)` + super.render(i);
    }
    get names() {
      const i = oe(super.names, this.from);
      return oe(i, this.to);
    }
  }
  class T extends v {
    constructor(i, f, b, O) {
      super(), this.loop = i, this.varKind = f, this.name = b, this.iterable = O;
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
      var b, O;
      return super.optimizeNames(i, f), (b = this.catch) === null || b === void 0 || b.optimizeNames(i, f), (O = this.finally) === null || O === void 0 || O.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && G(i, this.catch.names), this.finally && G(i, this.finally.names), i;
    }
  }
  class me extends w {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  me.kind = "catch";
  class ye extends w {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  ye.kind = "finally";
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
    _def(i, f, b, O) {
      const I = this._scope.toName(f);
      return b !== void 0 && O && (this._constants[I.str] = b), this._leafNode(new a(i, I, b)), I;
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
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new E(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [b, O] of i)
        f.length > 1 && f.push(","), f.push(b), (b !== O || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, O));
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
    forRange(i, f, b, O, I = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const V = this._scope.toName(i);
      return this._for(new R(I, V, f, b), () => O(V));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, O = r.varKinds.const) {
      const I = this._scope.toName(i);
      if (this.opts.es5) {
        const V = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${V}.length`, (L) => {
          this.var(I, (0, t._)`${V}[${L}]`), b(I);
        });
      }
      return this._for(new T("of", O, I, f), () => b(I));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, b, O = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, b);
      const I = this._scope.toName(i);
      return this._for(new T("in", O, I, f), () => b(I));
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
      return this._leafNode(new u(i));
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
      const O = new de();
      if (this._blockNode(O), this.code(i), f) {
        const I = this.name("e");
        this._currNode = O.catch = new me(I), f(I);
      }
      return b && (this._currNode = O.finally = new ye(), this.code(b)), this._endBlockNode(me, ye);
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
    func(i, f = t.nil, b, O) {
      return this._blockNode(new K(i, f, b)), O && this.code(O).endFunc(), this;
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
  function oe($, i) {
    return i instanceof t._CodeOrName ? G($, i.names) : $;
  }
  function H($, i, f) {
    if ($ instanceof t.Name)
      return b($);
    if (!O($))
      return $;
    return new t._Code($._items.reduce((I, V) => (V instanceof t.Name && (V = b(V)), V instanceof t._Code ? I.push(...V._items) : I.push(V), I), []));
    function b(I) {
      const V = f[I.str];
      return V === void 0 || i[I.str] !== 1 ? I : (delete i[I.str], V);
    }
    function O(I) {
      return I instanceof t._Code && I._items.some((V) => V instanceof t.Name && i[V.str] === 1 && f[V.str] !== void 0);
    }
  }
  function ce($, i) {
    for (const f in i)
      $[f] = ($[f] || 0) - (i[f] || 0);
  }
  function k($) {
    return typeof $ == "boolean" || typeof $ == "number" || $ === null ? !$ : (0, t._)`!${S($)}`;
  }
  e.not = k;
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
const ie = te, Vg = Rn;
function Fg(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
D.toHash = Fg;
function zg(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Wu(e, t), !Xu(t, e.self.RULES.all));
}
D.alwaysValidSchema = zg;
function Wu(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const o in t)
    s[o] || Qu(e, `unknown keyword: "${o}"`);
}
D.checkUnknownRules = Wu;
function Xu(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
D.schemaHasRules = Xu;
function Ug(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
D.schemaHasRulesButRef = Ug;
function qg({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ie._)`${r}`;
  }
  return (0, ie._)`${e}${t}${(0, ie.getProperty)(n)}`;
}
D.schemaRefOrVal = qg;
function Kg(e) {
  return Ju(decodeURIComponent(e));
}
D.unescapeFragment = Kg;
function Gg(e) {
  return encodeURIComponent(Ja(e));
}
D.escapeFragment = Gg;
function Ja(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
D.escapeJsonPointer = Ja;
function Ju(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
D.unescapeJsonPointer = Ju;
function Hg(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
D.eachItem = Hg;
function jc({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, o, a, l) => {
    const c = a === void 0 ? o : a instanceof ie.Name ? (o instanceof ie.Name ? e(s, o, a) : t(s, o, a), a) : o instanceof ie.Name ? (t(s, a, o), o) : r(o, a);
    return l === ie.Name && !(c instanceof ie.Name) ? n(s, c) : c;
  };
}
D.mergeEvaluated = {
  props: jc({
    mergeNames: (e, t, r) => e.if((0, ie._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ie._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ie._)`${r} || {}`).code((0, ie._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ie._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ie._)`${r} || {}`), Ya(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Yu
  }),
  items: jc({
    mergeNames: (e, t, r) => e.if((0, ie._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ie._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ie._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ie._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Yu(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ie._)`{}`);
  return t !== void 0 && Ya(e, r, t), r;
}
D.evaluatedPropsToName = Yu;
function Ya(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ie._)`${t}${(0, ie.getProperty)(n)}`, !0));
}
D.setEvaluated = Ya;
const Ac = {};
function Bg(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Ac[t.code] || (Ac[t.code] = new Vg._Code(t.code))
  });
}
D.useFunc = Bg;
var Do;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Do || (D.Type = Do = {}));
function Wg(e, t, r) {
  if (e instanceof ie.Name) {
    const n = t === Do.Num;
    return r ? n ? (0, ie._)`"[" + ${e} + "]"` : (0, ie._)`"['" + ${e} + "']"` : n ? (0, ie._)`"/" + ${e}` : (0, ie._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ie.getProperty)(e).toString() : "/" + Ja(e);
}
D.getErrorPath = Wg;
function Qu(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
D.checkStrictMode = Qu;
var $t = {};
Object.defineProperty($t, "__esModule", { value: !0 });
const Te = te, Xg = {
  // validation function arguments
  data: new Te.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Te.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Te.Name("instancePath"),
  parentData: new Te.Name("parentData"),
  parentDataProperty: new Te.Name("parentDataProperty"),
  rootData: new Te.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Te.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Te.Name("vErrors"),
  // null or array of validation errors
  errors: new Te.Name("errors"),
  // counter of validation errors
  this: new Te.Name("this"),
  // "globals"
  self: new Te.Name("self"),
  scope: new Te.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Te.Name("json"),
  jsonPos: new Te.Name("jsonPos"),
  jsonLen: new Te.Name("jsonLen"),
  jsonPart: new Te.Name("jsonPart")
};
$t.default = Xg;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = te, r = D, n = $t;
  e.keywordError = {
    message: ({ keyword: y }) => (0, t.str)`must pass "${y}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: y, schemaType: m }) => m ? (0, t.str)`"${y}" keyword must be ${m} ($data)` : (0, t.str)`"${y}" keyword is invalid ($data)`
  };
  function s(y, m = e.keywordError, v, N) {
    const { it: R } = y, { gen: T, compositeRule: K, allErrors: X } = R, de = h(y, m, v);
    N ?? (K || X) ? c(T, de) : d(R, (0, t._)`[${de}]`);
  }
  e.reportError = s;
  function o(y, m = e.keywordError, v) {
    const { it: N } = y, { gen: R, compositeRule: T, allErrors: K } = N, X = h(y, m, v);
    c(R, X), T || K || d(N, n.default.vErrors);
  }
  e.reportExtraError = o;
  function a(y, m) {
    y.assign(n.default.errors, m), y.if((0, t._)`${n.default.vErrors} !== null`, () => y.if(m, () => y.assign((0, t._)`${n.default.vErrors}.length`, m), () => y.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function l({ gen: y, keyword: m, schemaValue: v, data: N, errsCount: R, it: T }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const K = y.name("err");
    y.forRange("i", R, n.default.errors, (X) => {
      y.const(K, (0, t._)`${n.default.vErrors}[${X}]`), y.if((0, t._)`${K}.instancePath === undefined`, () => y.assign((0, t._)`${K}.instancePath`, (0, t.strConcat)(n.default.instancePath, T.errorPath))), y.assign((0, t._)`${K}.schemaPath`, (0, t.str)`${T.errSchemaPath}/${m}`), T.opts.verbose && (y.assign((0, t._)`${K}.schema`, v), y.assign((0, t._)`${K}.data`, N));
    });
  }
  e.extendErrors = l;
  function c(y, m) {
    const v = y.const("err", m);
    y.if((0, t._)`${n.default.vErrors} === null`, () => y.assign(n.default.vErrors, (0, t._)`[${v}]`), (0, t._)`${n.default.vErrors}.push(${v})`), y.code((0, t._)`${n.default.errors}++`);
  }
  function d(y, m) {
    const { gen: v, validateName: N, schemaEnv: R } = y;
    R.$async ? v.throw((0, t._)`new ${y.ValidationError}(${m})`) : (v.assign((0, t._)`${N}.errors`, m), v.return(!1));
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
  function h(y, m, v) {
    const { createErrors: N } = y.it;
    return N === !1 ? (0, t._)`{}` : E(y, m, v);
  }
  function E(y, m, v = {}) {
    const { gen: N, it: R } = y, T = [
      g(R, v),
      w(y, v)
    ];
    return _(y, m, T), N.object(...T);
  }
  function g({ errorPath: y }, { instancePath: m }) {
    const v = m ? (0, t.str)`${y}${(0, r.getErrorPath)(m, r.Type.Str)}` : y;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, v)];
  }
  function w({ keyword: y, it: { errSchemaPath: m } }, { schemaPath: v, parentSchema: N }) {
    let R = N ? m : (0, t.str)`${m}/${y}`;
    return v && (R = (0, t.str)`${R}${(0, r.getErrorPath)(v, r.Type.Str)}`), [u.schemaPath, R];
  }
  function _(y, { params: m, message: v }, N) {
    const { keyword: R, data: T, schemaValue: K, it: X } = y, { opts: de, propertyName: me, topSchemaRef: ye, schemaPath: F } = X;
    N.push([u.keyword, R], [u.params, typeof m == "function" ? m(y) : m || (0, t._)`{}`]), de.messages && N.push([u.message, typeof v == "function" ? v(y) : v]), de.verbose && N.push([u.schema, K], [u.parentSchema, (0, t._)`${ye}${F}`], [n.default.data, T]), me && N.push([u.propertyName, me]);
  }
})(An);
Object.defineProperty(Wr, "__esModule", { value: !0 });
Wr.boolOrEmptySchema = Wr.topBoolOrEmptySchema = void 0;
const Jg = An, Yg = te, Qg = $t, Zg = {
  message: "boolean schema is false"
};
function xg(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Zu(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Qg.default.data) : (t.assign((0, Yg._)`${n}.errors`, null), t.return(!0));
}
Wr.topBoolOrEmptySchema = xg;
function e_(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Zu(e)) : r.var(t, !0);
}
Wr.boolOrEmptySchema = e_;
function Zu(e, t) {
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
  (0, Jg.reportError)(s, Zg, void 0, t);
}
var _e = {}, vr = {};
Object.defineProperty(vr, "__esModule", { value: !0 });
vr.getRules = vr.isJSONType = void 0;
const t_ = ["string", "number", "integer", "boolean", "null", "object", "array"], r_ = new Set(t_);
function n_(e) {
  return typeof e == "string" && r_.has(e);
}
vr.isJSONType = n_;
function s_() {
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
vr.getRules = s_;
var bt = {};
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.shouldUseRule = bt.shouldUseGroup = bt.schemaHasRulesForType = void 0;
function o_({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && xu(e, n);
}
bt.schemaHasRulesForType = o_;
function xu(e, t) {
  return t.rules.some((r) => ed(e, r));
}
bt.shouldUseGroup = xu;
function ed(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
bt.shouldUseRule = ed;
Object.defineProperty(_e, "__esModule", { value: !0 });
_e.reportTypeError = _e.checkDataTypes = _e.checkDataType = _e.coerceAndCheckDataType = _e.getJSONTypes = _e.getSchemaTypes = _e.DataType = void 0;
const a_ = vr, i_ = bt, c_ = An, ee = te, td = D;
var zr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(zr || (_e.DataType = zr = {}));
function l_(e) {
  const t = rd(e.type);
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
_e.getSchemaTypes = l_;
function rd(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(a_.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
_e.getJSONTypes = rd;
function u_(e, t) {
  const { gen: r, data: n, opts: s } = e, o = d_(t, s.coerceTypes), a = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, i_.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const l = Qa(t, n, s.strictNumbers, zr.Wrong);
    r.if(l, () => {
      o.length ? f_(e, t, o) : Za(e);
    });
  }
  return a;
}
_e.coerceAndCheckDataType = u_;
const nd = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function d_(e, t) {
  return t ? e.filter((r) => nd.has(r) || t === "array" && r === "array") : [];
}
function f_(e, t, r) {
  const { gen: n, data: s, opts: o } = e, a = n.let("dataType", (0, ee._)`typeof ${s}`), l = n.let("coerced", (0, ee._)`undefined`);
  o.coerceTypes === "array" && n.if((0, ee._)`${a} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, ee._)`${s}[0]`).assign(a, (0, ee._)`typeof ${s}`).if(Qa(t, s, o.strictNumbers), () => n.assign(l, s))), n.if((0, ee._)`${l} !== undefined`);
  for (const d of r)
    (nd.has(d) || d === "array" && o.coerceTypes === "array") && c(d);
  n.else(), Za(e), n.endIf(), n.if((0, ee._)`${l} !== undefined`, () => {
    n.assign(s, l), h_(e, l);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, ee._)`${a} == "number" || ${a} == "boolean"`).assign(l, (0, ee._)`"" + ${s}`).elseIf((0, ee._)`${s} === null`).assign(l, (0, ee._)`""`);
        return;
      case "number":
        n.elseIf((0, ee._)`${a} == "boolean" || ${s} === null
              || (${a} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, ee._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, ee._)`${a} === "boolean" || ${s} === null
              || (${a} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, ee._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, ee._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, ee._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, ee._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, ee._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${s} === null`).assign(l, (0, ee._)`[${s}]`);
    }
  }
}
function h_({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, ee._)`${t} !== undefined`, () => e.assign((0, ee._)`${t}[${r}]`, n));
}
function Mo(e, t, r, n = zr.Correct) {
  const s = n === zr.Correct ? ee.operators.EQ : ee.operators.NEQ;
  let o;
  switch (e) {
    case "null":
      return (0, ee._)`${t} ${s} null`;
    case "array":
      o = (0, ee._)`Array.isArray(${t})`;
      break;
    case "object":
      o = (0, ee._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      o = a((0, ee._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      o = a();
      break;
    default:
      return (0, ee._)`typeof ${t} ${s} ${e}`;
  }
  return n === zr.Correct ? o : (0, ee.not)(o);
  function a(l = ee.nil) {
    return (0, ee.and)((0, ee._)`typeof ${t} == "number"`, l, r ? (0, ee._)`isFinite(${t})` : ee.nil);
  }
}
_e.checkDataType = Mo;
function Qa(e, t, r, n) {
  if (e.length === 1)
    return Mo(e[0], t, r, n);
  let s;
  const o = (0, td.toHash)(e);
  if (o.array && o.object) {
    const a = (0, ee._)`typeof ${t} != "object"`;
    s = o.null ? a : (0, ee._)`!${t} || ${a}`, delete o.null, delete o.array, delete o.object;
  } else
    s = ee.nil;
  o.number && delete o.integer;
  for (const a in o)
    s = (0, ee.and)(s, Mo(a, t, r, n));
  return s;
}
_e.checkDataTypes = Qa;
const m_ = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, ee._)`{type: ${e}}` : (0, ee._)`{type: ${t}}`
};
function Za(e) {
  const t = p_(e);
  (0, c_.reportError)(t, m_);
}
_e.reportTypeError = Za;
function p_(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, td.schemaRefOrVal)(e, n, "type");
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
var Ds = {};
Object.defineProperty(Ds, "__esModule", { value: !0 });
Ds.assignDefaults = void 0;
const Nr = te, $_ = D;
function y_(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      kc(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, o) => kc(e, o, s.default));
}
Ds.assignDefaults = y_;
function kc(e, t, r) {
  const { gen: n, compositeRule: s, data: o, opts: a } = e;
  if (r === void 0)
    return;
  const l = (0, Nr._)`${o}${(0, Nr.getProperty)(t)}`;
  if (s) {
    (0, $_.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let c = (0, Nr._)`${l} === undefined`;
  a.useDefaults === "empty" && (c = (0, Nr._)`${c} || ${l} === null || ${l} === ""`), n.if(c, (0, Nr._)`${l} = ${(0, Nr.stringify)(r)}`);
}
var mt = {}, ne = {};
Object.defineProperty(ne, "__esModule", { value: !0 });
ne.validateUnion = ne.validateArray = ne.usePattern = ne.callValidateCode = ne.schemaProperties = ne.allSchemaProperties = ne.noPropertyInData = ne.propertyInData = ne.isOwnProperty = ne.hasPropFunc = ne.reportMissingProp = ne.checkMissingProp = ne.checkReportMissingProp = void 0;
const ue = te, xa = D, jt = $t, g_ = D;
function __(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(ti(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, ue._)`${t}` }, !0), e.error();
  });
}
ne.checkReportMissingProp = __;
function v_({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, ue.or)(...n.map((o) => (0, ue.and)(ti(e, t, o, r.ownProperties), (0, ue._)`${s} = ${o}`)));
}
ne.checkMissingProp = v_;
function w_(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ne.reportMissingProp = w_;
function sd(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ue._)`Object.prototype.hasOwnProperty`
  });
}
ne.hasPropFunc = sd;
function ei(e, t, r) {
  return (0, ue._)`${sd(e)}.call(${t}, ${r})`;
}
ne.isOwnProperty = ei;
function E_(e, t, r, n) {
  const s = (0, ue._)`${t}${(0, ue.getProperty)(r)} !== undefined`;
  return n ? (0, ue._)`${s} && ${ei(e, t, r)}` : s;
}
ne.propertyInData = E_;
function ti(e, t, r, n) {
  const s = (0, ue._)`${t}${(0, ue.getProperty)(r)} === undefined`;
  return n ? (0, ue.or)(s, (0, ue.not)(ei(e, t, r))) : s;
}
ne.noPropertyInData = ti;
function od(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ne.allSchemaProperties = od;
function b_(e, t) {
  return od(t).filter((r) => !(0, xa.alwaysValidSchema)(e, t[r]));
}
ne.schemaProperties = b_;
function S_({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: o }, it: a }, l, c, d) {
  const u = d ? (0, ue._)`${e}, ${t}, ${n}${s}` : t, h = [
    [jt.default.instancePath, (0, ue.strConcat)(jt.default.instancePath, o)],
    [jt.default.parentData, a.parentData],
    [jt.default.parentDataProperty, a.parentDataProperty],
    [jt.default.rootData, jt.default.rootData]
  ];
  a.opts.dynamicRef && h.push([jt.default.dynamicAnchors, jt.default.dynamicAnchors]);
  const E = (0, ue._)`${u}, ${r.object(...h)}`;
  return c !== ue.nil ? (0, ue._)`${l}.call(${c}, ${E})` : (0, ue._)`${l}(${E})`;
}
ne.callValidateCode = S_;
const P_ = (0, ue._)`new RegExp`;
function N_({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, o = s(r, n);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, ue._)`${s.code === "new RegExp" ? P_ : (0, g_.useFunc)(e, s)}(${r}, ${n})`
  });
}
ne.usePattern = N_;
function R_(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, o = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return a(() => t.assign(l, !1)), l;
  }
  return t.var(o, !0), a(() => t.break()), o;
  function a(l) {
    const c = t.const("len", (0, ue._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: xa.Type.Num
      }, o), t.if((0, ue.not)(o), l);
    });
  }
}
ne.validateArray = R_;
function T_(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, xa.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const a = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(a, (0, ue._)`${a} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, ue.not)(a));
  })), e.result(a, () => e.reset(), () => e.error(!0));
}
ne.validateUnion = T_;
Object.defineProperty(mt, "__esModule", { value: !0 });
mt.validateKeywordUsage = mt.validSchemaType = mt.funcKeywordCode = mt.macroKeywordCode = void 0;
const De = te, ur = $t, O_ = ne, I_ = An;
function j_(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: o, it: a } = e, l = t.macro.call(a.self, s, o, a), c = ad(r, n, l);
  a.opts.validateSchema !== !1 && a.self.validateSchema(l, !0);
  const d = r.name("valid");
  e.subschema({
    schema: l,
    schemaPath: De.nil,
    errSchemaPath: `${a.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
mt.macroKeywordCode = j_;
function A_(e, t) {
  var r;
  const { gen: n, keyword: s, schema: o, parentSchema: a, $data: l, it: c } = e;
  C_(c, t);
  const d = !l && t.compile ? t.compile.call(c.self, o, a, c) : t.validate, u = ad(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      _(), t.modifying && Cc(e), y(() => e.error());
    else {
      const m = t.async ? g() : w();
      t.modifying && Cc(e), y(() => k_(e, m));
    }
  }
  function g() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, De._)`await `), (v) => n.assign(h, !1).if((0, De._)`${v} instanceof ${c.ValidationError}`, () => n.assign(m, (0, De._)`${v}.errors`), () => n.throw(v))), m;
  }
  function w() {
    const m = (0, De._)`${u}.errors`;
    return n.assign(m, null), _(De.nil), m;
  }
  function _(m = t.async ? (0, De._)`await ` : De.nil) {
    const v = c.opts.passContext ? ur.default.this : ur.default.self, N = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, De._)`${m}${(0, O_.callValidateCode)(e, u, v, N)}`, t.modifying);
  }
  function y(m) {
    var v;
    n.if((0, De.not)((v = t.valid) !== null && v !== void 0 ? v : h), m);
  }
}
mt.funcKeywordCode = A_;
function Cc(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, De._)`${n.parentData}[${n.parentDataProperty}]`));
}
function k_(e, t) {
  const { gen: r } = e;
  r.if((0, De._)`Array.isArray(${t})`, () => {
    r.assign(ur.default.vErrors, (0, De._)`${ur.default.vErrors} === null ? ${t} : ${ur.default.vErrors}.concat(${t})`).assign(ur.default.errors, (0, De._)`${ur.default.vErrors}.length`), (0, I_.extendErrors)(e);
  }, () => e.error());
}
function C_({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function ad(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, De.stringify)(r) });
}
function D_(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
mt.validSchemaType = D_;
function M_({ schema: e, opts: t, self: r, errSchemaPath: n }, s, o) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(o) : s.keyword !== o)
    throw new Error("ajv implementation error");
  const a = s.dependencies;
  if (a != null && a.some((l) => !Object.prototype.hasOwnProperty.call(e, l)))
    throw new Error(`parent schema must have dependencies of ${o}: ${a.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[o])) {
    const c = `keyword "${o}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
mt.validateKeywordUsage = M_;
var qt = {};
Object.defineProperty(qt, "__esModule", { value: !0 });
qt.extendSubschemaMode = qt.extendSubschemaData = qt.getSubschema = void 0;
const dt = te, id = D;
function L_(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: o, topSchemaRef: a }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const l = e.schema[t];
    return r === void 0 ? {
      schema: l,
      schemaPath: (0, dt._)`${e.schemaPath}${(0, dt.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: l[r],
      schemaPath: (0, dt._)`${e.schemaPath}${(0, dt.getProperty)(t)}${(0, dt.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, id.escapeFragment)(r)}`
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
qt.getSubschema = L_;
function V_(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: o, propertyName: a }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, E = l.let("data", (0, dt._)`${t.data}${(0, dt.getProperty)(r)}`, !0);
    c(E), e.errorPath = (0, dt.str)`${d}${(0, id.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, dt._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof dt.Name ? s : l.let("data", s, !0);
    c(d), a !== void 0 && (e.propertyName = a);
  }
  o && (e.dataTypes = o);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
qt.extendSubschemaData = V_;
function F_(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: o }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
qt.extendSubschemaMode = F_;
var Se = {}, cd = { exports: {} }, zt = cd.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  cs(t, n, s, e, "", e);
};
zt.keywords = {
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
zt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
zt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
zt.skipKeywords = {
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
function cs(e, t, r, n, s, o, a, l, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, o, a, l, c, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in zt.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            cs(e, t, r, h[E], s + "/" + u + "/" + E, o, s, u, n, E);
      } else if (u in zt.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            cs(e, t, r, h[g], s + "/" + u + "/" + z_(g), o, s, u, n, g);
      } else (u in zt.keywords || e.allKeys && !(u in zt.skipKeywords)) && cs(e, t, r, h, s + "/" + u, o, s, u, n);
    }
    r(n, s, o, a, l, c, d);
  }
}
function z_(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var U_ = cd.exports;
Object.defineProperty(Se, "__esModule", { value: !0 });
Se.getSchemaRefs = Se.resolveUrl = Se.normalizeId = Se._getFullPath = Se.getFullPath = Se.inlineRef = void 0;
const q_ = D, K_ = Ts, G_ = U_, H_ = /* @__PURE__ */ new Set([
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
function B_(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Lo(e) : t ? ld(e) <= t : !1;
}
Se.inlineRef = B_;
const W_ = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Lo(e) {
  for (const t in e) {
    if (W_.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Lo) || typeof r == "object" && Lo(r))
      return !0;
  }
  return !1;
}
function ld(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !H_.has(r) && (typeof e[r] == "object" && (0, q_.eachItem)(e[r], (n) => t += ld(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function ud(e, t = "", r) {
  r !== !1 && (t = Ur(t));
  const n = e.parse(t);
  return dd(e, n);
}
Se.getFullPath = ud;
function dd(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Se._getFullPath = dd;
const X_ = /#\/?$/;
function Ur(e) {
  return e ? e.replace(X_, "") : "";
}
Se.normalizeId = Ur;
function J_(e, t, r) {
  return r = Ur(r), e.resolve(t, r);
}
Se.resolveUrl = J_;
const Y_ = /^[a-z_][-a-z0-9._]*$/i;
function Q_(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Ur(e[r] || t), o = { "": s }, a = ud(n, s, !1), l = {}, c = /* @__PURE__ */ new Set();
  return G_(e, { allKeys: !0 }, (h, E, g, w) => {
    if (w === void 0)
      return;
    const _ = a + E;
    let y = o[w];
    typeof h[r] == "string" && (y = m.call(this, h[r])), v.call(this, h.$anchor), v.call(this, h.$dynamicAnchor), o[E] = y;
    function m(N) {
      const R = this.opts.uriResolver.resolve;
      if (N = Ur(y ? R(y, N) : N), c.has(N))
        throw u(N);
      c.add(N);
      let T = this.refs[N];
      return typeof T == "string" && (T = this.refs[T]), typeof T == "object" ? d(h, T.schema, N) : N !== Ur(_) && (N[0] === "#" ? (d(h, l[N], N), l[N] = h) : this.refs[N] = _), N;
    }
    function v(N) {
      if (typeof N == "string") {
        if (!Y_.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), l;
  function d(h, E, g) {
    if (E !== void 0 && !K_(h, E))
      throw u(g);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Se.getSchemaRefs = Q_;
Object.defineProperty(st, "__esModule", { value: !0 });
st.getData = st.KeywordCxt = st.validateFunctionCode = void 0;
const fd = Wr, Dc = _e, ri = bt, _s = _e, Z_ = Ds, vn = mt, no = qt, q = te, W = $t, x_ = Se, St = D, un = An;
function ev(e) {
  if (pd(e) && ($d(e), md(e))) {
    nv(e);
    return;
  }
  hd(e, () => (0, fd.topBoolOrEmptySchema)(e));
}
st.validateFunctionCode = ev;
function hd({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, o) {
  s.code.es5 ? e.func(t, (0, q._)`${W.default.data}, ${W.default.valCxt}`, n.$async, () => {
    e.code((0, q._)`"use strict"; ${Mc(r, s)}`), rv(e, s), e.code(o);
  }) : e.func(t, (0, q._)`${W.default.data}, ${tv(s)}`, n.$async, () => e.code(Mc(r, s)).code(o));
}
function tv(e) {
  return (0, q._)`{${W.default.instancePath}="", ${W.default.parentData}, ${W.default.parentDataProperty}, ${W.default.rootData}=${W.default.data}${e.dynamicRef ? (0, q._)`, ${W.default.dynamicAnchors}={}` : q.nil}}={}`;
}
function rv(e, t) {
  e.if(W.default.valCxt, () => {
    e.var(W.default.instancePath, (0, q._)`${W.default.valCxt}.${W.default.instancePath}`), e.var(W.default.parentData, (0, q._)`${W.default.valCxt}.${W.default.parentData}`), e.var(W.default.parentDataProperty, (0, q._)`${W.default.valCxt}.${W.default.parentDataProperty}`), e.var(W.default.rootData, (0, q._)`${W.default.valCxt}.${W.default.rootData}`), t.dynamicRef && e.var(W.default.dynamicAnchors, (0, q._)`${W.default.valCxt}.${W.default.dynamicAnchors}`);
  }, () => {
    e.var(W.default.instancePath, (0, q._)`""`), e.var(W.default.parentData, (0, q._)`undefined`), e.var(W.default.parentDataProperty, (0, q._)`undefined`), e.var(W.default.rootData, W.default.data), t.dynamicRef && e.var(W.default.dynamicAnchors, (0, q._)`{}`);
  });
}
function nv(e) {
  const { schema: t, opts: r, gen: n } = e;
  hd(e, () => {
    r.$comment && t.$comment && gd(e), cv(e), n.let(W.default.vErrors, null), n.let(W.default.errors, 0), r.unevaluated && sv(e), yd(e), dv(e);
  });
}
function sv(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, q._)`${r}.evaluated`), t.if((0, q._)`${e.evaluated}.dynamicProps`, () => t.assign((0, q._)`${e.evaluated}.props`, (0, q._)`undefined`)), t.if((0, q._)`${e.evaluated}.dynamicItems`, () => t.assign((0, q._)`${e.evaluated}.items`, (0, q._)`undefined`));
}
function Mc(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, q._)`/*# sourceURL=${r} */` : q.nil;
}
function ov(e, t) {
  if (pd(e) && ($d(e), md(e))) {
    av(e, t);
    return;
  }
  (0, fd.boolOrEmptySchema)(e, t);
}
function md({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function pd(e) {
  return typeof e.schema != "boolean";
}
function av(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && gd(e), lv(e), uv(e);
  const o = n.const("_errs", W.default.errors);
  yd(e, o), n.var(t, (0, q._)`${o} === ${W.default.errors}`);
}
function $d(e) {
  (0, St.checkUnknownRules)(e), iv(e);
}
function yd(e, t) {
  if (e.opts.jtd)
    return Lc(e, [], !1, t);
  const r = (0, Dc.getSchemaTypes)(e.schema), n = (0, Dc.coerceAndCheckDataType)(e, r);
  Lc(e, r, !n, t);
}
function iv(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, St.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function cv(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, St.checkStrictMode)(e, "default is ignored in the schema root");
}
function lv(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, x_.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function uv(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function gd({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const o = r.$comment;
  if (s.$comment === !0)
    e.code((0, q._)`${W.default.self}.logger.log(${o})`);
  else if (typeof s.$comment == "function") {
    const a = (0, q.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, q._)`${W.default.self}.opts.$comment(${o}, ${a}, ${l}.schema)`);
  }
}
function dv(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: o } = e;
  r.$async ? t.if((0, q._)`${W.default.errors} === 0`, () => t.return(W.default.data), () => t.throw((0, q._)`new ${s}(${W.default.vErrors})`)) : (t.assign((0, q._)`${n}.errors`, W.default.vErrors), o.unevaluated && fv(e), t.return((0, q._)`${W.default.errors} === 0`));
}
function fv({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof q.Name && e.assign((0, q._)`${t}.props`, r), n instanceof q.Name && e.assign((0, q._)`${t}.items`, n);
}
function Lc(e, t, r, n) {
  const { gen: s, schema: o, data: a, allErrors: l, opts: c, self: d } = e, { RULES: u } = d;
  if (o.$ref && (c.ignoreKeywordsWithRef || !(0, St.schemaHasRulesButRef)(o, u))) {
    s.block(() => wd(e, "$ref", u.all.$ref.definition));
    return;
  }
  c.jtd || hv(e, t), s.block(() => {
    for (const E of u.rules)
      h(E);
    h(u.post);
  });
  function h(E) {
    (0, ri.shouldUseGroup)(o, E) && (E.type ? (s.if((0, _s.checkDataType)(E.type, a, c.strictNumbers)), Vc(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, _s.reportTypeError)(e)), s.endIf()) : Vc(e, E), l || s.if((0, q._)`${W.default.errors} === ${n || 0}`));
  }
}
function Vc(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, Z_.assignDefaults)(e, t.type), r.block(() => {
    for (const o of t.rules)
      (0, ri.shouldUseRule)(n, o) && wd(e, o.keyword, o.definition, t.type);
  });
}
function hv(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (mv(e, t), e.opts.allowUnionTypes || pv(e, t), $v(e, e.dataTypes));
}
function mv(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      _d(e.dataTypes, r) || ni(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), gv(e, t);
  }
}
function pv(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && ni(e, "use allowUnionTypes to allow union type keyword");
}
function $v(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, ri.shouldUseRule)(e.schema, s)) {
      const { type: o } = s.definition;
      o.length && !o.some((a) => yv(t, a)) && ni(e, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function yv(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function _d(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function gv(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    _d(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function ni(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, St.checkStrictMode)(e, t, e.opts.strictTypes);
}
class vd {
  constructor(t, r, n) {
    if ((0, vn.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, St.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Ed(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, vn.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
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
    (t ? un.reportExtraError : un.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, un.reportError)(this, this.def.$dataError || un.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, un.resetErrorsCount)(this.gen, this.errsCount);
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
    const { gen: n, schemaCode: s, schemaType: o, def: a } = this;
    n.if((0, q.or)((0, q._)`${s} === undefined`, r)), t !== q.nil && n.assign(t, !0), (o.length || a.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== q.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: o } = this;
    return (0, q.or)(a(), l());
    function a() {
      if (n.length) {
        if (!(r instanceof q.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, q._)`${(0, _s.checkDataTypes)(c, r, o.opts.strictNumbers, _s.DataType.Wrong)}`;
      }
      return q.nil;
    }
    function l() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, q._)`!${c}(${r})`;
      }
      return q.nil;
    }
  }
  subschema(t, r) {
    const n = (0, no.getSubschema)(this.it, t);
    (0, no.extendSubschemaData)(n, this.it, t), (0, no.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return ov(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = St.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = St.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, q.Name)), !0;
  }
}
st.KeywordCxt = vd;
function wd(e, t, r, n) {
  const s = new vd(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, vn.funcKeywordCode)(s, r) : "macro" in r ? (0, vn.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, vn.funcKeywordCode)(s, r);
}
const _v = /^\/(?:[^~]|~0|~1)*$/, vv = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Ed(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, o;
  if (e === "")
    return W.default.rootData;
  if (e[0] === "/") {
    if (!_v.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, o = W.default.rootData;
  } else {
    const d = vv.exec(e);
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
    if (o = r[t - u], !s)
      return o;
  }
  let a = o;
  const l = s.split("/");
  for (const d of l)
    d && (o = (0, q._)`${o}${(0, q.getProperty)((0, St.unescapeJsonPointer)(d))}`, a = (0, q._)`${a} && ${o}`);
  return a;
  function c(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
st.getData = Ed;
var Kn = {}, Fc;
function si() {
  if (Fc) return Kn;
  Fc = 1, Object.defineProperty(Kn, "__esModule", { value: !0 });
  class e extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return Kn.default = e, Kn;
}
var en = {};
Object.defineProperty(en, "__esModule", { value: !0 });
const so = Se;
class wv extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, so.resolveUrl)(t, r, n), this.missingSchema = (0, so.normalizeId)((0, so.getFullPath)(t, this.missingRef));
  }
}
en.default = wv;
var Ue = {};
Object.defineProperty(Ue, "__esModule", { value: !0 });
Ue.resolveSchema = Ue.getCompilingSchema = Ue.resolveRef = Ue.compileSchema = Ue.SchemaEnv = void 0;
const Qe = te, Ev = si(), or = $t, tt = Se, zc = D, bv = st;
class Ms {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, tt.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Ue.SchemaEnv = Ms;
function oi(e) {
  const t = bd.call(this, e);
  if (t)
    return t;
  const r = (0, tt.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: o } = this.opts, a = new Qe.CodeGen(this.scope, { es5: n, lines: s, ownProperties: o });
  let l;
  e.$async && (l = a.scopeValue("Error", {
    ref: Ev.default,
    code: (0, Qe._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = a.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: a,
    allErrors: this.opts.allErrors,
    data: or.default.data,
    parentData: or.default.parentData,
    parentDataProperty: or.default.parentDataProperty,
    dataNames: [or.default.data],
    dataPathArr: [Qe.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: a.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Qe.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: l,
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
  let u;
  try {
    this._compilations.add(e), (0, bv.validateFunctionCode)(d), a.optimize(this.opts.code.optimize);
    const h = a.toString();
    u = `${a.scopeRefs(or.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const g = new Function(`${or.default.self}`, `${or.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: h, scopeValues: a._values }), this.opts.unevaluated) {
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
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
Ue.compileSchema = oi;
function Sv(e, t, r) {
  var n;
  r = (0, tt.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let o = Rv.call(this, e, r);
  if (o === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    a && (o = new Ms({ schema: a, schemaId: l, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[r] = Pv.call(this, o);
}
Ue.resolveRef = Sv;
function Pv(e) {
  return (0, tt.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : oi.call(this, e);
}
function bd(e) {
  for (const t of this._compilations)
    if (Nv(t, e))
      return t;
}
Ue.getCompilingSchema = bd;
function Nv(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Rv(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Ls.call(this, e, t);
}
function Ls(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, tt._getFullPath)(this.opts.uriResolver, r);
  let s = (0, tt.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return oo.call(this, r, e);
  const o = (0, tt.normalizeId)(n), a = this.refs[o] || this.schemas[o];
  if (typeof a == "string") {
    const l = Ls.call(this, e, a);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : oo.call(this, r, l);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || oi.call(this, a), o === (0, tt.normalizeId)(t)) {
      const { schema: l } = a, { schemaId: c } = this.opts, d = l[c];
      return d && (s = (0, tt.resolveUrl)(this.opts.uriResolver, s, d)), new Ms({ schema: l, schemaId: c, root: e, baseId: s });
    }
    return oo.call(this, r, a);
  }
}
Ue.resolveSchema = Ls;
const Tv = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function oo(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, zc.unescapeFragment)(l)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !Tv.has(l) && d && (t = (0, tt.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let o;
  if (typeof r != "boolean" && r.$ref && !(0, zc.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, tt.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    o = Ls.call(this, n, l);
  }
  const { schemaId: a } = this.opts;
  if (o = o || new Ms({ schema: r, schemaId: a, root: n, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const Ov = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Iv = "Meta-schema for $data reference (JSON AnySchema extension proposal)", jv = "object", Av = [
  "$data"
], kv = {
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
}, Cv = !1, Dv = {
  $id: Ov,
  description: Iv,
  type: jv,
  required: Av,
  properties: kv,
  additionalProperties: Cv
};
var ai = {};
Object.defineProperty(ai, "__esModule", { value: !0 });
const Sd = ku;
Sd.code = 'require("ajv/dist/runtime/uri").default';
ai.default = Sd;
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
  const n = si(), s = en, o = vr, a = Ue, l = te, c = Se, d = _e, u = D, h = Dv, E = ai, g = (P, p) => new RegExp(P, p);
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
    var p, S, $, i, f, b, O, I, V, L, se, qe, Gt, Ht, Bt, Wt, Xt, Jt, Yt, Qt, Zt, xt, er, tr, rr;
    const Xe = P.strict, nr = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, nn = nr === !0 || nr === void 0 ? 1 : nr || 0, sn = ($ = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && $ !== void 0 ? $ : g, Bs = (i = P.uriResolver) !== null && i !== void 0 ? i : E.default;
    return {
      strictSchema: (b = (f = P.strictSchema) !== null && f !== void 0 ? f : Xe) !== null && b !== void 0 ? b : !0,
      strictNumbers: (I = (O = P.strictNumbers) !== null && O !== void 0 ? O : Xe) !== null && I !== void 0 ? I : !0,
      strictTypes: (L = (V = P.strictTypes) !== null && V !== void 0 ? V : Xe) !== null && L !== void 0 ? L : "log",
      strictTuples: (qe = (se = P.strictTuples) !== null && se !== void 0 ? se : Xe) !== null && qe !== void 0 ? qe : "log",
      strictRequired: (Ht = (Gt = P.strictRequired) !== null && Gt !== void 0 ? Gt : Xe) !== null && Ht !== void 0 ? Ht : !1,
      code: P.code ? { ...P.code, optimize: nn, regExp: sn } : { optimize: nn, regExp: sn },
      loopRequired: (Bt = P.loopRequired) !== null && Bt !== void 0 ? Bt : v,
      loopEnum: (Wt = P.loopEnum) !== null && Wt !== void 0 ? Wt : v,
      meta: (Xt = P.meta) !== null && Xt !== void 0 ? Xt : !0,
      messages: (Jt = P.messages) !== null && Jt !== void 0 ? Jt : !0,
      inlineRefs: (Yt = P.inlineRefs) !== null && Yt !== void 0 ? Yt : !0,
      schemaId: (Qt = P.schemaId) !== null && Qt !== void 0 ? Qt : "$id",
      addUsedSchema: (Zt = P.addUsedSchema) !== null && Zt !== void 0 ? Zt : !0,
      validateSchema: (xt = P.validateSchema) !== null && xt !== void 0 ? xt : !0,
      validateFormats: (er = P.validateFormats) !== null && er !== void 0 ? er : !0,
      unicodeRegExp: (tr = P.unicodeRegExp) !== null && tr !== void 0 ? tr : !0,
      int32range: (rr = P.int32range) !== null && rr !== void 0 ? rr : !0,
      uriResolver: Bs
    };
  }
  class R {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...N(p) };
      const { es5: S, lines: $ } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: _, es5: S, lines: $ }), this.logger = G(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, o.getRules)(), T.call(this, y, p, "NOT SUPPORTED"), T.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ye.call(this), p.formats && de.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && me.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), X.call(this), p.validateFormats = i;
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
        const qe = this._addSchema(L, se);
        return qe.validate || b.call(this, qe);
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
          return O.call(this, se), await I.call(this, se.missingSchema), b.call(this, L);
        }
      }
      function O({ missingSchema: L, missingRef: se }) {
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
        const { schemaId: $ } = this.opts, i = new a.SchemaEnv({ schema: {}, schemaId: $ });
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
        return (0, u.eachItem)($, (f) => ce.call(this, f)), this;
      j.call(this, S);
      const i = {
        ...S,
        type: (0, d.getJSONTypes)(S.type),
        schemaType: (0, d.getJSONTypes)(S.schemaType)
      };
      return (0, u.eachItem)($, i.type.length === 0 ? (f) => ce.call(this, f, i) : (f) => i.type.forEach((b) => ce.call(this, f, i, b))), this;
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
        for (const O of f)
          b = b[O];
        for (const O in $) {
          const I = $[O];
          if (typeof I != "object")
            continue;
          const { $data: V } = I.definition, L = b[O];
          V && L && (b[O] = M(L));
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
      const { schemaId: O } = this.opts;
      if (typeof p == "object")
        b = p[O];
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
      return I = new a.SchemaEnv({ schema: p, schemaId: O, meta: S, baseId: $, localRefs: V }), this._cache.set(I.schema, I), f && !$.startsWith("#") && ($ && this._checkUnique($), this.refs[$] = I), i && this.validateSchema(p, !0), I;
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
  R.ValidationError = n.default, R.MissingRefError = s.default, e.default = R;
  function T(P, p, S, $ = "error") {
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
  function me(P) {
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
  const oe = /^[a-z_$][a-z0-9_$:-]*$/i;
  function H(P, p) {
    const { RULES: S } = this;
    if ((0, u.eachItem)(P, ($) => {
      if (S.keywords[$])
        throw new Error(`Keyword ${$} is already defined`);
      if (!oe.test($))
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
    const O = {
      keyword: P,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? k.call(this, b, O, p.before) : b.rules.push(O), f.all[P] = O, ($ = p.implements) === null || $ === void 0 || $.forEach((I) => this.addKeyword(I));
  }
  function k(P, p, S) {
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
})(Bu);
var ii = {}, ci = {}, li = {};
Object.defineProperty(li, "__esModule", { value: !0 });
const Mv = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
li.default = Mv;
var wr = {};
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.callRef = wr.getValidate = void 0;
const Lv = en, Uc = ne, ze = te, Rr = $t, qc = Ue, Gn = D, Vv = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: o, validateName: a, opts: l, self: c } = n, { root: d } = o;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = qc.resolveRef.call(c, d, s, r);
    if (u === void 0)
      throw new Lv.default(n.opts.uriResolver, s, r);
    if (u instanceof qc.SchemaEnv)
      return E(u);
    return g(u);
    function h() {
      if (o === d)
        return ls(e, a, o, o.$async);
      const w = t.scopeValue("root", { ref: d });
      return ls(e, (0, ze._)`${w}.validate`, d, d.$async);
    }
    function E(w) {
      const _ = Pd(e, w);
      ls(e, _, w, w.$async);
    }
    function g(w) {
      const _ = t.scopeValue("schema", l.code.source === !0 ? { ref: w, code: (0, ze.stringify)(w) } : { ref: w }), y = t.name("valid"), m = e.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: ze.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, y);
      e.mergeEvaluated(m), e.ok(y);
    }
  }
};
function Pd(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, ze._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
wr.getValidate = Pd;
function ls(e, t, r, n) {
  const { gen: s, it: o } = e, { allErrors: a, schemaEnv: l, opts: c } = o, d = c.passContext ? Rr.default.this : ze.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, ze._)`await ${(0, Uc.callValidateCode)(e, t, d)}`), g(t), a || s.assign(w, !0);
    }, (_) => {
      s.if((0, ze._)`!(${_} instanceof ${o.ValidationError})`, () => s.throw(_)), E(_), a || s.assign(w, !1);
    }), e.ok(w);
  }
  function h() {
    e.result((0, Uc.callValidateCode)(e, t, d), () => g(t), () => E(t));
  }
  function E(w) {
    const _ = (0, ze._)`${w}.errors`;
    s.assign(Rr.default.vErrors, (0, ze._)`${Rr.default.vErrors} === null ? ${_} : ${Rr.default.vErrors}.concat(${_})`), s.assign(Rr.default.errors, (0, ze._)`${Rr.default.vErrors}.length`);
  }
  function g(w) {
    var _;
    if (!o.opts.unevaluated)
      return;
    const y = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (o.props !== !0)
      if (y && !y.dynamicProps)
        y.props !== void 0 && (o.props = Gn.mergeEvaluated.props(s, y.props, o.props));
      else {
        const m = s.var("props", (0, ze._)`${w}.evaluated.props`);
        o.props = Gn.mergeEvaluated.props(s, m, o.props, ze.Name);
      }
    if (o.items !== !0)
      if (y && !y.dynamicItems)
        y.items !== void 0 && (o.items = Gn.mergeEvaluated.items(s, y.items, o.items));
      else {
        const m = s.var("items", (0, ze._)`${w}.evaluated.items`);
        o.items = Gn.mergeEvaluated.items(s, m, o.items, ze.Name);
      }
  }
}
wr.callRef = ls;
wr.default = Vv;
Object.defineProperty(ci, "__esModule", { value: !0 });
const Fv = li, zv = wr, Uv = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  Fv.default,
  zv.default
];
ci.default = Uv;
var ui = {}, di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
const vs = te, At = vs.operators, ws = {
  maximum: { okStr: "<=", ok: At.LTE, fail: At.GT },
  minimum: { okStr: ">=", ok: At.GTE, fail: At.LT },
  exclusiveMaximum: { okStr: "<", ok: At.LT, fail: At.GTE },
  exclusiveMinimum: { okStr: ">", ok: At.GT, fail: At.LTE }
}, qv = {
  message: ({ keyword: e, schemaCode: t }) => (0, vs.str)`must be ${ws[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, vs._)`{comparison: ${ws[e].okStr}, limit: ${t}}`
}, Kv = {
  keyword: Object.keys(ws),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: qv,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, vs._)`${r} ${ws[t].fail} ${n} || isNaN(${r})`);
  }
};
di.default = Kv;
var fi = {};
Object.defineProperty(fi, "__esModule", { value: !0 });
const wn = te, Gv = {
  message: ({ schemaCode: e }) => (0, wn.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, wn._)`{multipleOf: ${e}}`
}, Hv = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Gv,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, o = s.opts.multipleOfPrecision, a = t.let("res"), l = o ? (0, wn._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}` : (0, wn._)`${a} !== parseInt(${a})`;
    e.fail$data((0, wn._)`(${n} === 0 || (${a} = ${r}/${n}, ${l}))`);
  }
};
fi.default = Hv;
var hi = {}, mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
function Nd(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
mi.default = Nd;
Nd.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(hi, "__esModule", { value: !0 });
const dr = te, Bv = D, Wv = mi, Xv = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, dr.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, dr._)`{limit: ${e}}`
}, Jv = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Xv,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, o = t === "maxLength" ? dr.operators.GT : dr.operators.LT, a = s.opts.unicode === !1 ? (0, dr._)`${r}.length` : (0, dr._)`${(0, Bv.useFunc)(e.gen, Wv.default)}(${r})`;
    e.fail$data((0, dr._)`${a} ${o} ${n}`);
  }
};
hi.default = Jv;
var pi = {};
Object.defineProperty(pi, "__esModule", { value: !0 });
const Yv = ne, Qv = D, Cr = te, Zv = {
  message: ({ schemaCode: e }) => (0, Cr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Cr._)`{pattern: ${e}}`
}, xv = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Zv,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e, l = a.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = a.opts.code, d = c.code === "new RegExp" ? (0, Cr._)`new RegExp` : (0, Qv.useFunc)(t, c), u = t.let("valid");
      t.try(() => t.assign(u, (0, Cr._)`${d}(${o}, ${l}).test(${r})`), () => t.assign(u, !1)), e.fail$data((0, Cr._)`!${u}`);
    } else {
      const c = (0, Yv.usePattern)(e, s);
      e.fail$data((0, Cr._)`!${c}.test(${r})`);
    }
  }
};
pi.default = xv;
var $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
const En = te, ew = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, En.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, En._)`{limit: ${e}}`
}, tw = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: ew,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? En.operators.GT : En.operators.LT;
    e.fail$data((0, En._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
$i.default = tw;
var yi = {};
Object.defineProperty(yi, "__esModule", { value: !0 });
const dn = ne, bn = te, rw = D, nw = {
  message: ({ params: { missingProperty: e } }) => (0, bn.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, bn._)`{missingProperty: ${e}}`
}, sw = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: nw,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: o, it: a } = e, { opts: l } = a;
    if (!o && r.length === 0)
      return;
    const c = r.length >= l.loopRequired;
    if (a.allErrors ? d() : u(), l.strictRequired) {
      const g = e.parentSchema.properties, { definedProperties: w } = e.it;
      for (const _ of r)
        if ((g == null ? void 0 : g[_]) === void 0 && !w.has(_)) {
          const y = a.schemaEnv.baseId + a.errSchemaPath, m = `required property "${_}" is not defined at "${y}" (strictRequired)`;
          (0, rw.checkStrictMode)(a, m, a.opts.strictRequired);
        }
    }
    function d() {
      if (c || o)
        e.block$data(bn.nil, h);
      else
        for (const g of r)
          (0, dn.checkReportMissingProp)(e, g);
    }
    function u() {
      const g = t.let("missing");
      if (c || o) {
        const w = t.let("valid", !0);
        e.block$data(w, () => E(g, w)), e.ok(w);
      } else
        t.if((0, dn.checkMissingProp)(e, r, g)), (0, dn.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, dn.noPropertyInData)(t, s, g, l.ownProperties), () => e.error());
      });
    }
    function E(g, w) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(w, (0, dn.propertyInData)(t, s, g, l.ownProperties)), t.if((0, bn.not)(w), () => {
          e.error(), t.break();
        });
      }, bn.nil);
    }
  }
};
yi.default = sw;
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
const Sn = te, ow = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Sn.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Sn._)`{limit: ${e}}`
}, aw = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: ow,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? Sn.operators.GT : Sn.operators.LT;
    e.fail$data((0, Sn._)`${r}.length ${s} ${n}`);
  }
};
gi.default = aw;
var _i = {}, kn = {};
Object.defineProperty(kn, "__esModule", { value: !0 });
const Rd = Ts;
Rd.code = 'require("ajv/dist/runtime/equal").default';
kn.default = Rd;
Object.defineProperty(_i, "__esModule", { value: !0 });
const ao = _e, Ee = te, iw = D, cw = kn, lw = {
  message: ({ params: { i: e, j: t } }) => (0, Ee.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Ee._)`{i: ${e}, j: ${t}}`
}, uw = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: lw,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: o, schemaCode: a, it: l } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = o.items ? (0, ao.getSchemaTypes)(o.items) : [];
    e.block$data(c, u, (0, Ee._)`${a} === false`), e.ok(c);
    function u() {
      const w = t.let("i", (0, Ee._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: w, j: _ }), t.assign(c, !0), t.if((0, Ee._)`${w} > 1`, () => (h() ? E : g)(w, _));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function E(w, _) {
      const y = t.name("item"), m = (0, ao.checkDataTypes)(d, y, l.opts.strictNumbers, ao.DataType.Wrong), v = t.const("indices", (0, Ee._)`{}`);
      t.for((0, Ee._)`;${w}--;`, () => {
        t.let(y, (0, Ee._)`${r}[${w}]`), t.if(m, (0, Ee._)`continue`), d.length > 1 && t.if((0, Ee._)`typeof ${y} == "string"`, (0, Ee._)`${y} += "_"`), t.if((0, Ee._)`typeof ${v}[${y}] == "number"`, () => {
          t.assign(_, (0, Ee._)`${v}[${y}]`), e.error(), t.assign(c, !1).break();
        }).code((0, Ee._)`${v}[${y}] = ${w}`);
      });
    }
    function g(w, _) {
      const y = (0, iw.useFunc)(t, cw.default), m = t.name("outer");
      t.label(m).for((0, Ee._)`;${w}--;`, () => t.for((0, Ee._)`${_} = ${w}; ${_}--;`, () => t.if((0, Ee._)`${y}(${r}[${w}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
_i.default = uw;
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
const Vo = te, dw = D, fw = kn, hw = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Vo._)`{allowedValue: ${e}}`
}, mw = {
  keyword: "const",
  $data: !0,
  error: hw,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: o } = e;
    n || o && typeof o == "object" ? e.fail$data((0, Vo._)`!${(0, dw.useFunc)(t, fw.default)}(${r}, ${s})`) : e.fail((0, Vo._)`${o} !== ${r}`);
  }
};
vi.default = mw;
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
const mn = te, pw = D, $w = kn, yw = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, mn._)`{allowedValues: ${e}}`
}, gw = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: yw,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: o, it: a } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= a.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, pw.useFunc)(t, $w.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", o);
      u = (0, mn.or)(...s.map((w, _) => E(g, _)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", o, (g) => t.if((0, mn._)`${d()}(${r}, ${g})`, () => t.assign(u, !0).break()));
    }
    function E(g, w) {
      const _ = s[w];
      return typeof _ == "object" && _ !== null ? (0, mn._)`${d()}(${r}, ${g}[${w}])` : (0, mn._)`${r} === ${_}`;
    }
  }
};
wi.default = gw;
Object.defineProperty(ui, "__esModule", { value: !0 });
const _w = di, vw = fi, ww = hi, Ew = pi, bw = $i, Sw = yi, Pw = gi, Nw = _i, Rw = vi, Tw = wi, Ow = [
  // number
  _w.default,
  vw.default,
  // string
  ww.default,
  Ew.default,
  // object
  bw.default,
  Sw.default,
  // array
  Pw.default,
  Nw.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Rw.default,
  Tw.default
];
ui.default = Ow;
var Ei = {}, tn = {};
Object.defineProperty(tn, "__esModule", { value: !0 });
tn.validateAdditionalItems = void 0;
const fr = te, Fo = D, Iw = {
  message: ({ params: { len: e } }) => (0, fr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, fr._)`{limit: ${e}}`
}, jw = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Iw,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Fo.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Td(e, n);
  }
};
function Td(e, t) {
  const { gen: r, schema: n, data: s, keyword: o, it: a } = e;
  a.items = !0;
  const l = r.const("len", (0, fr._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, fr._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Fo.alwaysValidSchema)(a, n)) {
    const d = r.var("valid", (0, fr._)`${l} <= ${t.length}`);
    r.if((0, fr.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: o, dataProp: u, dataPropType: Fo.Type.Num }, d), a.allErrors || r.if((0, fr.not)(d), () => r.break());
    });
  }
}
tn.validateAdditionalItems = Td;
tn.default = jw;
var bi = {}, rn = {};
Object.defineProperty(rn, "__esModule", { value: !0 });
rn.validateTuple = void 0;
const Kc = te, us = D, Aw = ne, kw = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Od(e, "additionalItems", t);
    r.items = !0, !(0, us.alwaysValidSchema)(r, t) && e.ok((0, Aw.validateArray)(e));
  }
};
function Od(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: o, keyword: a, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = us.mergeEvaluated.items(n, r.length, l.items));
  const c = n.name("valid"), d = n.const("len", (0, Kc._)`${o}.length`);
  r.forEach((h, E) => {
    (0, us.alwaysValidSchema)(l, h) || (n.if((0, Kc._)`${d} > ${E}`, () => e.subschema({
      keyword: a,
      schemaProp: E,
      dataProp: E
    }, c)), e.ok(c));
  });
  function u(h) {
    const { opts: E, errSchemaPath: g } = l, w = r.length, _ = w === h.minItems && (w === h.maxItems || h[t] === !1);
    if (E.strictTuples && !_) {
      const y = `"${a}" is ${w}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, us.checkStrictMode)(l, y, E.strictTuples);
    }
  }
}
rn.validateTuple = Od;
rn.default = kw;
Object.defineProperty(bi, "__esModule", { value: !0 });
const Cw = rn, Dw = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, Cw.validateTuple)(e, "items")
};
bi.default = Dw;
var Si = {};
Object.defineProperty(Si, "__esModule", { value: !0 });
const Gc = te, Mw = D, Lw = ne, Vw = tn, Fw = {
  message: ({ params: { len: e } }) => (0, Gc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Gc._)`{limit: ${e}}`
}, zw = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Fw,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, Mw.alwaysValidSchema)(n, t) && (s ? (0, Vw.validateAdditionalItems)(e, s) : e.ok((0, Lw.validateArray)(e)));
  }
};
Si.default = zw;
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
const We = te, Hn = D, Uw = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, We.str)`must contain at least ${e} valid item(s)` : (0, We.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, We._)`{minContains: ${e}}` : (0, We._)`{minContains: ${e}, maxContains: ${t}}`
}, qw = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Uw,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    let a, l;
    const { minContains: c, maxContains: d } = n;
    o.opts.next ? (a = c === void 0 ? 1 : c, l = d) : a = 1;
    const u = t.const("len", (0, We._)`${s}.length`);
    if (e.setParams({ min: a, max: l }), l === void 0 && a === 0) {
      (0, Hn.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && a > l) {
      (0, Hn.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Hn.alwaysValidSchema)(o, r)) {
      let _ = (0, We._)`${u} >= ${a}`;
      l !== void 0 && (_ = (0, We._)`${_} && ${u} <= ${l}`), e.pass(_);
      return;
    }
    o.items = !0;
    const h = t.name("valid");
    l === void 0 && a === 1 ? g(h, () => t.if(h, () => t.break())) : a === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, We._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const _ = t.name("_valid"), y = t.let("count", 0);
      g(_, () => t.if(_, () => w(y)));
    }
    function g(_, y) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: Hn.Type.Num,
          compositeRule: !0
        }, _), y();
      });
    }
    function w(_) {
      t.code((0, We._)`${_}++`), l === void 0 ? t.if((0, We._)`${_} >= ${a}`, () => t.assign(h, !0).break()) : (t.if((0, We._)`${_} > ${l}`, () => t.assign(h, !1).break()), a === 1 ? t.assign(h, !0) : t.if((0, We._)`${_} >= ${a}`, () => t.assign(h, !0)));
    }
  }
};
Pi.default = qw;
var Id = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = te, r = D, n = ne;
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
      const [d, u] = o(c);
      a(c, d), l(c, u);
    }
  };
  function o({ schema: c }) {
    const d = {}, u = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const E = Array.isArray(c[h]) ? d : u;
      E[h] = c[h];
    }
    return [d, u];
  }
  function a(c, d = c.schema) {
    const { gen: u, data: h, it: E } = c;
    if (Object.keys(d).length === 0)
      return;
    const g = u.let("missing");
    for (const w in d) {
      const _ = d[w];
      if (_.length === 0)
        continue;
      const y = (0, n.propertyInData)(u, h, w, E.opts.ownProperties);
      c.setParams({
        property: w,
        depsCount: _.length,
        deps: _.join(", ")
      }), E.allErrors ? u.if(y, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (u.if((0, t._)`${y} && (${(0, n.checkMissingProp)(c, _, g)})`), (0, n.reportMissingProp)(c, g), u.else());
    }
  }
  e.validatePropertyDeps = a;
  function l(c, d = c.schema) {
    const { gen: u, data: h, keyword: E, it: g } = c, w = u.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)(g, d[_]) || (u.if(
        (0, n.propertyInData)(u, h, _, g.opts.ownProperties),
        () => {
          const y = c.subschema({ keyword: E, schemaProp: _ }, w);
          c.mergeValidEvaluated(y, w);
        },
        () => u.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  e.validateSchemaDeps = l, e.default = s;
})(Id);
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
const jd = te, Kw = D, Gw = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, jd._)`{propertyName: ${e.propertyName}}`
}, Hw = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Gw,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Kw.alwaysValidSchema)(s, r))
      return;
    const o = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, o), t.if((0, jd.not)(o), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
Ni.default = Hw;
var Vs = {};
Object.defineProperty(Vs, "__esModule", { value: !0 });
const Bn = ne, xe = te, Bw = $t, Wn = D, Ww = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, xe._)`{additionalProperty: ${e.additionalProperty}}`
}, Xw = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Ww,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: o, it: a } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: c } = a;
    if (a.props = !0, c.removeAdditional !== "all" && (0, Wn.alwaysValidSchema)(a, r))
      return;
    const d = (0, Bn.allSchemaProperties)(n.properties), u = (0, Bn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, xe._)`${o} === ${Bw.default.errors}`);
    function h() {
      t.forIn("key", s, (y) => {
        !d.length && !u.length ? w(y) : t.if(E(y), () => w(y));
      });
    }
    function E(y) {
      let m;
      if (d.length > 8) {
        const v = (0, Wn.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, Bn.isOwnProperty)(t, v, y);
      } else d.length ? m = (0, xe.or)(...d.map((v) => (0, xe._)`${y} === ${v}`)) : m = xe.nil;
      return u.length && (m = (0, xe.or)(m, ...u.map((v) => (0, xe._)`${(0, Bn.usePattern)(e, v)}.test(${y})`))), (0, xe.not)(m);
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
        e.setParams({ additionalProperty: y }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, Wn.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_(y, m, !1), t.if((0, xe.not)(m), () => {
          e.reset(), g(y);
        })) : (_(y, m), l || t.if((0, xe.not)(m), () => t.break()));
      }
    }
    function _(y, m, v) {
      const N = {
        keyword: "additionalProperties",
        dataProp: y,
        dataPropType: Wn.Type.Str
      };
      v === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
Vs.default = Xw;
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
const Jw = st, Hc = ne, io = D, Bc = Vs, Yw = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: o } = e;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Bc.default.code(new Jw.KeywordCxt(o, Bc.default, "additionalProperties"));
    const a = (0, Hc.allSchemaProperties)(r);
    for (const h of a)
      o.definedProperties.add(h);
    o.opts.unevaluated && a.length && o.props !== !0 && (o.props = io.mergeEvaluated.props(t, (0, io.toHash)(a), o.props));
    const l = a.filter((h) => !(0, io.alwaysValidSchema)(o, r[h]));
    if (l.length === 0)
      return;
    const c = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, Hc.propertyInData)(t, s, h, o.opts.ownProperties)), u(h), o.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return o.opts.useDefaults && !o.compositeRule && r[h].default !== void 0;
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
Ri.default = Yw;
var Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
const Wc = ne, Xn = te, Xc = D, Jc = D, Qw = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: o } = e, { opts: a } = o, l = (0, Wc.allSchemaProperties)(r), c = l.filter((_) => (0, Xc.alwaysValidSchema)(o, r[_]));
    if (l.length === 0 || c.length === l.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const d = a.strictSchema && !a.allowMatchingProperties && s.properties, u = t.name("valid");
    o.props !== !0 && !(o.props instanceof Xn.Name) && (o.props = (0, Jc.evaluatedPropsToName)(t, o.props));
    const { props: h } = o;
    E();
    function E() {
      for (const _ of l)
        d && g(_), o.allErrors ? w(_) : (t.var(u, !0), w(_), t.if(u));
    }
    function g(_) {
      for (const y in d)
        new RegExp(_).test(y) && (0, Xc.checkStrictMode)(o, `property ${y} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function w(_) {
      t.forIn("key", n, (y) => {
        t.if((0, Xn._)`${(0, Wc.usePattern)(e, _)}.test(${y})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: y,
            dataPropType: Jc.Type.Str
          }, u), o.opts.unevaluated && h !== !0 ? t.assign((0, Xn._)`${h}[${y}]`, !0) : !m && !o.allErrors && t.if((0, Xn.not)(u), () => t.break());
        });
      });
    }
  }
};
Ti.default = Qw;
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
const Zw = D, xw = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Zw.alwaysValidSchema)(n, r)) {
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
Oi.default = xw;
var Ii = {};
Object.defineProperty(Ii, "__esModule", { value: !0 });
const eE = ne, tE = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: eE.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Ii.default = tE;
var ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
const ds = te, rE = D, nE = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, ds._)`{passingSchemas: ${e.passing}}`
}, sE = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: nE,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const o = r, a = t.let("valid", !1), l = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: l }), t.block(d), e.result(a, () => e.reset(), () => e.error(!0));
    function d() {
      o.forEach((u, h) => {
        let E;
        (0, rE.alwaysValidSchema)(s, u) ? t.var(c, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, ds._)`${c} && ${a}`).assign(a, !1).assign(l, (0, ds._)`[${l}, ${h}]`).else(), t.if(c, () => {
          t.assign(a, !0), t.assign(l, h), E && e.mergeEvaluated(E, ds.Name);
        });
      });
    }
  }
};
ji.default = sE;
var Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
const oE = D, aE = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((o, a) => {
      if ((0, oE.alwaysValidSchema)(n, o))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: a }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
Ai.default = aE;
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
const Es = te, Ad = D, iE = {
  message: ({ params: e }) => (0, Es.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Es._)`{failingKeyword: ${e.ifClause}}`
}, cE = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: iE,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Ad.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Yc(n, "then"), o = Yc(n, "else");
    if (!s && !o)
      return;
    const a = t.let("valid", !0), l = t.name("_valid");
    if (c(), e.reset(), s && o) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, Es.not)(l), d("else"));
    e.pass(a, () => e.error(!0));
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
        const E = e.subschema({ keyword: u }, l);
        t.assign(a, l), e.mergeValidEvaluated(E, a), h ? t.assign(h, (0, Es._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function Yc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Ad.alwaysValidSchema)(e, r);
}
ki.default = cE;
var Ci = {};
Object.defineProperty(Ci, "__esModule", { value: !0 });
const lE = D, uE = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, lE.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Ci.default = uE;
Object.defineProperty(Ei, "__esModule", { value: !0 });
const dE = tn, fE = bi, hE = rn, mE = Si, pE = Pi, $E = Id, yE = Ni, gE = Vs, _E = Ri, vE = Ti, wE = Oi, EE = Ii, bE = ji, SE = Ai, PE = ki, NE = Ci;
function RE(e = !1) {
  const t = [
    // any
    wE.default,
    EE.default,
    bE.default,
    SE.default,
    PE.default,
    NE.default,
    // object
    yE.default,
    gE.default,
    $E.default,
    _E.default,
    vE.default
  ];
  return e ? t.push(fE.default, mE.default) : t.push(dE.default, hE.default), t.push(pE.default), t;
}
Ei.default = RE;
var Di = {}, Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
const $e = te, TE = {
  message: ({ schemaCode: e }) => (0, $e.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, $e._)`{format: ${e}}`
}, OE = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: TE,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: o, schemaCode: a, it: l } = e, { opts: c, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!c.validateFormats)
      return;
    s ? E() : g();
    function E() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, $e._)`${w}[${a}]`), y = r.let("fType"), m = r.let("format");
      r.if((0, $e._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign(y, (0, $e._)`${_}.type || "string"`).assign(m, (0, $e._)`${_}.validate`), () => r.assign(y, (0, $e._)`"string"`).assign(m, _)), e.fail$data((0, $e.or)(v(), N()));
      function v() {
        return c.strictSchema === !1 ? $e.nil : (0, $e._)`${a} && !${m}`;
      }
      function N() {
        const R = u.$async ? (0, $e._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, $e._)`${m}(${n})`, T = (0, $e._)`(typeof ${m} == "function" ? ${R} : ${m}.test(${n}))`;
        return (0, $e._)`${m} && ${m} !== true && ${y} === ${t} && !${T}`;
      }
    }
    function g() {
      const w = h.formats[o];
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
          h.logger.warn(T());
          return;
        }
        throw new Error(T());
        function T() {
          return `unknown format "${o}" ignored in schema at path "${d}"`;
        }
      }
      function N(T) {
        const K = T instanceof RegExp ? (0, $e.regexpCode)(T) : c.code.formats ? (0, $e._)`${c.code.formats}${(0, $e.getProperty)(o)}` : void 0, X = r.scopeValue("formats", { key: o, ref: T, code: K });
        return typeof T == "object" && !(T instanceof RegExp) ? [T.type || "string", T.validate, (0, $e._)`${X}.validate`] : ["string", T, X];
      }
      function R() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, $e._)`await ${m}(${n})`;
        }
        return typeof y == "function" ? (0, $e._)`${m}(${n})` : (0, $e._)`${m}.test(${n})`;
      }
    }
  }
};
Mi.default = OE;
Object.defineProperty(Di, "__esModule", { value: !0 });
const IE = Mi, jE = [IE.default];
Di.default = jE;
var Xr = {};
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.contentVocabulary = Xr.metadataVocabulary = void 0;
Xr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Xr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(ii, "__esModule", { value: !0 });
const AE = ci, kE = ui, CE = Ei, DE = Di, Qc = Xr, ME = [
  AE.default,
  kE.default,
  (0, CE.default)(),
  DE.default,
  Qc.metadataVocabulary,
  Qc.contentVocabulary
];
ii.default = ME;
var Li = {}, Fs = {};
Object.defineProperty(Fs, "__esModule", { value: !0 });
Fs.DiscrError = void 0;
var Zc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Zc || (Fs.DiscrError = Zc = {}));
Object.defineProperty(Li, "__esModule", { value: !0 });
const Ir = te, zo = Fs, xc = Ue, LE = en, VE = D, FE = {
  message: ({ params: { discrError: e, tagName: t } }) => e === zo.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, Ir._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, zE = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: FE,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: o } = e, { oneOf: a } = s;
    if (!o.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const l = n.propertyName;
    if (typeof l != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!a)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, Ir._)`${r}${(0, Ir.getProperty)(l)}`);
    t.if((0, Ir._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: zo.DiscrError.Tag, tag: d, tagName: l })), e.ok(c);
    function u() {
      const g = E();
      t.if(!1);
      for (const w in g)
        t.elseIf((0, Ir._)`${d} === ${w}`), t.assign(c, h(g[w]));
      t.else(), e.error(!1, { discrError: zo.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(g) {
      const w = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: g }, w);
      return e.mergeEvaluated(_, Ir.Name), w;
    }
    function E() {
      var g;
      const w = {}, _ = m(s);
      let y = !0;
      for (let R = 0; R < a.length; R++) {
        let T = a[R];
        if (T != null && T.$ref && !(0, VE.schemaHasRulesButRef)(T, o.self.RULES)) {
          const X = T.$ref;
          if (T = xc.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, X), T instanceof xc.SchemaEnv && (T = T.schema), T === void 0)
            throw new LE.default(o.opts.uriResolver, o.baseId, X);
        }
        const K = (g = T == null ? void 0 : T.properties) === null || g === void 0 ? void 0 : g[l];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        y = y && (_ || m(T)), v(K, R);
      }
      if (!y)
        throw new Error(`discriminator: "${l}" must be required`);
      return w;
      function m({ required: R }) {
        return Array.isArray(R) && R.includes(l);
      }
      function v(R, T) {
        if (R.const)
          N(R.const, T);
        else if (R.enum)
          for (const K of R.enum)
            N(K, T);
        else
          throw new Error(`discriminator: "properties/${l}" must have "const" or "enum"`);
      }
      function N(R, T) {
        if (typeof R != "string" || R in w)
          throw new Error(`discriminator: "${l}" values must be unique strings`);
        w[R] = T;
      }
    }
  }
};
Li.default = zE;
const UE = "http://json-schema.org/draft-07/schema#", qE = "http://json-schema.org/draft-07/schema#", KE = "Core schema meta-schema", GE = {
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
}, HE = [
  "object",
  "boolean"
], BE = {
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
}, WE = {
  $schema: UE,
  $id: qE,
  title: KE,
  definitions: GE,
  type: HE,
  properties: BE,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = Bu, n = ii, s = Li, o = WE, a = ["/properties"], l = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((w) => this.addVocabulary(w)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const w = this.opts.$data ? this.$dataMetaSchema(o, a) : o;
      this.addMetaSchema(w, l, !1), this.refs["http://json-schema.org/schema"] = l;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(l) ? l : void 0);
    }
  }
  t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var d = st;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var u = te;
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
  var h = si();
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var E = en;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return E.default;
  } });
})(ko, ko.exports);
var XE = ko.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = XE, r = te, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, o = {
    message: ({ keyword: l, schemaCode: c }) => (0, r.str)`should be ${s[l].okStr} ${c}`,
    params: ({ keyword: l, schemaCode: c }) => (0, r._)`{comparison: ${s[l].okStr}, limit: ${c}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: o,
    code(l) {
      const { gen: c, data: d, schemaCode: u, keyword: h, it: E } = l, { opts: g, self: w } = E;
      if (!g.validateFormats)
        return;
      const _ = new t.KeywordCxt(E, w.RULES.all.format.definition, "format");
      _.$data ? y() : m();
      function y() {
        const N = c.scopeValue("formats", {
          ref: w.formats,
          code: g.code.formats
        }), R = c.const("fmt", (0, r._)`${N}[${_.schemaCode}]`);
        l.fail$data((0, r.or)((0, r._)`typeof ${R} != "object"`, (0, r._)`${R} instanceof RegExp`, (0, r._)`typeof ${R}.compare != "function"`, v(R)));
      }
      function m() {
        const N = _.schema, R = w.formats[N];
        if (!R || R === !0)
          return;
        if (typeof R != "object" || R instanceof RegExp || typeof R.compare != "function")
          throw new Error(`"${h}": format "${N}" does not define "compare" function`);
        const T = c.scopeValue("formats", {
          key: N,
          ref: R,
          code: g.code.formats ? (0, r._)`${g.code.formats}${(0, r.getProperty)(N)}` : void 0
        });
        l.fail$data(v(T));
      }
      function v(N) {
        return (0, r._)`${N}.compare(${d}, ${u}) ${s[h].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const a = (l) => (l.addKeyword(e.formatLimitDefinition), l);
  e.default = a;
})(Hu);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = Gu, n = Hu, s = te, o = new s.Name("fullFormats"), a = new s.Name("fastFormats"), l = (d, u = { keywords: !0 }) => {
    if (Array.isArray(u))
      return c(d, u, r.fullFormats, o), d;
    const [h, E] = u.mode === "fast" ? [r.fastFormats, a] : [r.fullFormats, o], g = u.formats || r.formatNames;
    return c(d, g, h, E), u.keywords && (0, n.default)(d), d;
  };
  l.get = (d, u = "full") => {
    const E = (u === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!E)
      throw new Error(`Unknown format "${d}"`);
    return E;
  };
  function c(d, u, h, E) {
    var g, w;
    (g = (w = d.opts.code).formats) !== null && g !== void 0 || (w.formats = (0, s._)`require("ajv-formats/dist/formats").${E}`);
    for (const _ of u)
      d.addFormat(_, h[_]);
  }
  e.exports = t = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
})(Ao, Ao.exports);
var JE = Ao.exports;
const YE = /* @__PURE__ */ zl(JE), QE = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), o = Object.getOwnPropertyDescriptor(t, r);
  !ZE(s, o) && n || Object.defineProperty(e, r, o);
}, ZE = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, xE = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, eb = (e, t) => `/* Wrapped ${e}*/
${t}`, tb = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), rb = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), nb = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = eb.bind(null, n, t.toString());
  Object.defineProperty(s, "name", rb);
  const { writable: o, enumerable: a, configurable: l } = tb;
  Object.defineProperty(e, "toString", { value: s, writable: o, enumerable: a, configurable: l });
};
function sb(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    QE(e, t, s, r);
  return xE(e, t), nb(e, t, n), e;
}
const el = (e, t = {}) => {
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
  let a, l, c;
  const d = function(...u) {
    const h = this, E = () => {
      a = void 0, l && (clearTimeout(l), l = void 0), o && (c = e.apply(h, u));
    }, g = () => {
      l = void 0, a && (clearTimeout(a), a = void 0), o && (c = e.apply(h, u));
    }, w = s && !a;
    return clearTimeout(a), a = setTimeout(E, r), n > 0 && n !== Number.POSITIVE_INFINITY && !l && (l = setTimeout(g, n)), w && (c = e.apply(h, u)), c;
  };
  return sb(d, e), d.cancel = () => {
    a && (clearTimeout(a), a = void 0), l && (clearTimeout(l), l = void 0);
  }, d;
};
var Uo = { exports: {} };
const ob = "2.0.0", kd = 256, ab = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, ib = 16, cb = kd - 6, lb = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Cn = {
  MAX_LENGTH: kd,
  MAX_SAFE_COMPONENT_LENGTH: ib,
  MAX_SAFE_BUILD_LENGTH: cb,
  MAX_SAFE_INTEGER: ab,
  RELEASE_TYPES: lb,
  SEMVER_SPEC_VERSION: ob,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const ub = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var zs = ub;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = Cn, o = zs;
  t = e.exports = {};
  const a = t.re = [], l = t.safeRe = [], c = t.src = [], d = t.safeSrc = [], u = t.t = {};
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
    o(y, R, m), u[y] = R, c[R] = m, d[R] = N, a[R] = new RegExp(m, v ? "g" : void 0), l[R] = new RegExp(N, v ? "g" : void 0);
  };
  _("NUMERICIDENTIFIER", "0|[1-9]\\d*"), _("NUMERICIDENTIFIERLOOSE", "\\d+"), _("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${E}*`), _("MAINVERSION", `(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})`), _("MAINVERSIONLOOSE", `(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASEIDENTIFIER", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIER]})`), _("PRERELEASEIDENTIFIERLOOSE", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASE", `(?:-(${c[u.PRERELEASEIDENTIFIER]}(?:\\.${c[u.PRERELEASEIDENTIFIER]})*))`), _("PRERELEASELOOSE", `(?:-?(${c[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[u.PRERELEASEIDENTIFIERLOOSE]})*))`), _("BUILDIDENTIFIER", `${E}+`), _("BUILD", `(?:\\+(${c[u.BUILDIDENTIFIER]}(?:\\.${c[u.BUILDIDENTIFIER]})*))`), _("FULLPLAIN", `v?${c[u.MAINVERSION]}${c[u.PRERELEASE]}?${c[u.BUILD]}?`), _("FULL", `^${c[u.FULLPLAIN]}$`), _("LOOSEPLAIN", `[v=\\s]*${c[u.MAINVERSIONLOOSE]}${c[u.PRERELEASELOOSE]}?${c[u.BUILD]}?`), _("LOOSE", `^${c[u.LOOSEPLAIN]}$`), _("GTLT", "((?:<|>)?=?)"), _("XRANGEIDENTIFIERLOOSE", `${c[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), _("XRANGEIDENTIFIER", `${c[u.NUMERICIDENTIFIER]}|x|X|\\*`), _("XRANGEPLAIN", `[v=\\s]*(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:${c[u.PRERELEASE]})?${c[u.BUILD]}?)?)?`), _("XRANGEPLAINLOOSE", `[v=\\s]*(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:${c[u.PRERELEASELOOSE]})?${c[u.BUILD]}?)?)?`), _("XRANGE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAIN]}$`), _("XRANGELOOSE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAINLOOSE]}$`), _("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), _("COERCE", `${c[u.COERCEPLAIN]}(?:$|[^\\d])`), _("COERCEFULL", c[u.COERCEPLAIN] + `(?:${c[u.PRERELEASE]})?(?:${c[u.BUILD]})?(?:$|[^\\d])`), _("COERCERTL", c[u.COERCE], !0), _("COERCERTLFULL", c[u.COERCEFULL], !0), _("LONETILDE", "(?:~>?)"), _("TILDETRIM", `(\\s*)${c[u.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", _("TILDE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAIN]}$`), _("TILDELOOSE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAINLOOSE]}$`), _("LONECARET", "(?:\\^)"), _("CARETTRIM", `(\\s*)${c[u.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", _("CARET", `^${c[u.LONECARET]}${c[u.XRANGEPLAIN]}$`), _("CARETLOOSE", `^${c[u.LONECARET]}${c[u.XRANGEPLAINLOOSE]}$`), _("COMPARATORLOOSE", `^${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]})$|^$`), _("COMPARATOR", `^${c[u.GTLT]}\\s*(${c[u.FULLPLAIN]})$|^$`), _("COMPARATORTRIM", `(\\s*)${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]}|${c[u.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", _("HYPHENRANGE", `^\\s*(${c[u.XRANGEPLAIN]})\\s+-\\s+(${c[u.XRANGEPLAIN]})\\s*$`), _("HYPHENRANGELOOSE", `^\\s*(${c[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[u.XRANGEPLAINLOOSE]})\\s*$`), _("STAR", "(<|>)?=?\\s*\\*"), _("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), _("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Uo, Uo.exports);
var Dn = Uo.exports;
const db = Object.freeze({ loose: !0 }), fb = Object.freeze({}), hb = (e) => e ? typeof e != "object" ? db : e : fb;
var Vi = hb;
const tl = /^[0-9]+$/, Cd = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = tl.test(e), n = tl.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, mb = (e, t) => Cd(t, e);
var Dd = {
  compareIdentifiers: Cd,
  rcompareIdentifiers: mb
};
const Jn = zs, { MAX_LENGTH: rl, MAX_SAFE_INTEGER: Yn } = Cn, { safeRe: Qn, t: Zn } = Dn, pb = Vi, { compareIdentifiers: co } = Dd;
let $b = class ct {
  constructor(t, r) {
    if (r = pb(r), t instanceof ct) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > rl)
      throw new TypeError(
        `version is longer than ${rl} characters`
      );
    Jn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Qn[Zn.LOOSE] : Qn[Zn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Yn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Yn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Yn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const o = +s;
        if (o >= 0 && o < Yn)
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
    if (Jn("SemVer.compare", this.version, this.options, t), !(t instanceof ct)) {
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
      if (Jn("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return co(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof ct || (t = new ct(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (Jn("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return co(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? Qn[Zn.PRERELEASELOOSE] : Qn[Zn.PRERELEASE]);
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
          n === !1 && (o = [r]), co(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Ae = $b;
const nl = Ae, yb = (e, t, r = !1) => {
  if (e instanceof nl)
    return e;
  try {
    return new nl(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Er = yb;
const gb = Er, _b = (e, t) => {
  const r = gb(e, t);
  return r ? r.version : null;
};
var vb = _b;
const wb = Er, Eb = (e, t) => {
  const r = wb(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var bb = Eb;
const sl = Ae, Sb = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new sl(
      e instanceof sl ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var Pb = Sb;
const ol = Er, Nb = (e, t) => {
  const r = ol(e, null, !0), n = ol(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const o = s > 0, a = o ? r : n, l = o ? n : r, c = !!a.prerelease.length;
  if (!!l.prerelease.length && !c) {
    if (!l.patch && !l.minor)
      return "major";
    if (l.compareMain(a) === 0)
      return l.minor && !l.patch ? "minor" : "patch";
  }
  const u = c ? "pre" : "";
  return r.major !== n.major ? u + "major" : r.minor !== n.minor ? u + "minor" : r.patch !== n.patch ? u + "patch" : "prerelease";
};
var Rb = Nb;
const Tb = Ae, Ob = (e, t) => new Tb(e, t).major;
var Ib = Ob;
const jb = Ae, Ab = (e, t) => new jb(e, t).minor;
var kb = Ab;
const Cb = Ae, Db = (e, t) => new Cb(e, t).patch;
var Mb = Db;
const Lb = Er, Vb = (e, t) => {
  const r = Lb(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var Fb = Vb;
const al = Ae, zb = (e, t, r) => new al(e, r).compare(new al(t, r));
var ot = zb;
const Ub = ot, qb = (e, t, r) => Ub(t, e, r);
var Kb = qb;
const Gb = ot, Hb = (e, t) => Gb(e, t, !0);
var Bb = Hb;
const il = Ae, Wb = (e, t, r) => {
  const n = new il(e, r), s = new il(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var Fi = Wb;
const Xb = Fi, Jb = (e, t) => e.sort((r, n) => Xb(r, n, t));
var Yb = Jb;
const Qb = Fi, Zb = (e, t) => e.sort((r, n) => Qb(n, r, t));
var xb = Zb;
const e1 = ot, t1 = (e, t, r) => e1(e, t, r) > 0;
var Us = t1;
const r1 = ot, n1 = (e, t, r) => r1(e, t, r) < 0;
var zi = n1;
const s1 = ot, o1 = (e, t, r) => s1(e, t, r) === 0;
var Md = o1;
const a1 = ot, i1 = (e, t, r) => a1(e, t, r) !== 0;
var Ld = i1;
const c1 = ot, l1 = (e, t, r) => c1(e, t, r) >= 0;
var Ui = l1;
const u1 = ot, d1 = (e, t, r) => u1(e, t, r) <= 0;
var qi = d1;
const f1 = Md, h1 = Ld, m1 = Us, p1 = Ui, $1 = zi, y1 = qi, g1 = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return f1(e, r, n);
    case "!=":
      return h1(e, r, n);
    case ">":
      return m1(e, r, n);
    case ">=":
      return p1(e, r, n);
    case "<":
      return $1(e, r, n);
    case "<=":
      return y1(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Vd = g1;
const _1 = Ae, v1 = Er, { safeRe: xn, t: es } = Dn, w1 = (e, t) => {
  if (e instanceof _1)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? xn[es.COERCEFULL] : xn[es.COERCE]);
  else {
    const c = t.includePrerelease ? xn[es.COERCERTLFULL] : xn[es.COERCERTL];
    let d;
    for (; (d = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), c.lastIndex = d.index + d[1].length + d[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", o = r[4] || "0", a = t.includePrerelease && r[5] ? `-${r[5]}` : "", l = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return v1(`${n}.${s}.${o}${a}${l}`, t);
};
var E1 = w1;
const b1 = Er, S1 = Cn, P1 = Ae, N1 = (e, t, r) => {
  if (!S1.RELEASE_TYPES.includes(t))
    return null;
  const n = R1(e, r);
  return n && T1(n, t);
}, R1 = (e, t) => {
  const r = e instanceof P1 ? e.version : e;
  return b1(r, t);
}, T1 = (e, t) => {
  if (O1(t))
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
}, O1 = (e) => e.startsWith("pre");
var I1 = N1;
class j1 {
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
var A1 = j1, lo, cl;
function at() {
  if (cl) return lo;
  cl = 1;
  const e = /\s+/g;
  class t {
    constructor(j, z) {
      if (z = s(z), j instanceof t)
        return j.loose === !!z.loose && j.includePrerelease === !!z.includePrerelease ? j : new t(j.raw, z);
      if (j instanceof o)
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
      const p = this.options.loose, S = p ? c[u.HYPHENRANGELOOSE] : c[u.HYPHENRANGE];
      j = j.replace(S, H(this.options.includePrerelease)), a("hyphen replace", j), j = j.replace(c[u.COMPARATORTRIM], h), a("comparator trim", j), j = j.replace(c[u.TILDETRIM], E), a("tilde trim", j), j = j.replace(c[u.CARETTRIM], g), a("caret trim", j);
      let $ = j.split(" ").map((O) => R(O, this.options)).join(" ").split(/\s+/).map((O) => oe(O, this.options));
      p && ($ = $.filter((O) => (a("loose invalid filter", O, this.options), !!O.match(c[u.COMPARATORLOOSE])))), a("range list", $);
      const i = /* @__PURE__ */ new Map(), f = $.map((O) => new o(O, this.options));
      for (const O of f) {
        if (m(O))
          return [O];
        i.set(O.value, O);
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
          j = new l(j, this.options);
        } catch {
          return !1;
        }
      for (let z = 0; z < this.set.length; z++)
        if (ce(this.set[z], j, this.options))
          return !0;
      return !1;
    }
  }
  lo = t;
  const r = A1, n = new r(), s = Vi, o = qs(), a = zs, l = Ae, {
    safeRe: c,
    src: d,
    t: u,
    comparatorTrimReplace: h,
    tildeTrimReplace: E,
    caretTrimReplace: g
  } = Dn, { FLAG_INCLUDE_PRERELEASE: w, FLAG_LOOSE: _ } = Cn, y = new RegExp(d[u.BUILD], "g"), m = (k) => k.value === "<0.0.0-0", v = (k) => k.value === "", N = (k, j) => {
    let z = !0;
    const M = k.slice();
    let P = M.pop();
    for (; z && M.length; )
      z = M.every((p) => P.intersects(p, j)), P = M.pop();
    return z;
  }, R = (k, j) => (k = k.replace(c[u.BUILD], ""), a("comp", k, j), k = de(k, j), a("caret", k), k = K(k, j), a("tildes", k), k = ye(k, j), a("xrange", k), k = G(k, j), a("stars", k), k), T = (k) => !k || k.toLowerCase() === "x" || k === "*", K = (k, j) => k.trim().split(/\s+/).map((z) => X(z, j)).join(" "), X = (k, j) => {
    const z = j.loose ? c[u.TILDELOOSE] : c[u.TILDE];
    return k.replace(z, (M, P, p, S, $) => {
      a("tilde", k, M, P, p, S, $);
      let i;
      return T(P) ? i = "" : T(p) ? i = `>=${P}.0.0 <${+P + 1}.0.0-0` : T(S) ? i = `>=${P}.${p}.0 <${P}.${+p + 1}.0-0` : $ ? (a("replaceTilde pr", $), i = `>=${P}.${p}.${S}-${$} <${P}.${+p + 1}.0-0`) : i = `>=${P}.${p}.${S} <${P}.${+p + 1}.0-0`, a("tilde return", i), i;
    });
  }, de = (k, j) => k.trim().split(/\s+/).map((z) => me(z, j)).join(" "), me = (k, j) => {
    a("caret", k, j);
    const z = j.loose ? c[u.CARETLOOSE] : c[u.CARET], M = j.includePrerelease ? "-0" : "";
    return k.replace(z, (P, p, S, $, i) => {
      a("caret", k, P, p, S, $, i);
      let f;
      return T(p) ? f = "" : T(S) ? f = `>=${p}.0.0${M} <${+p + 1}.0.0-0` : T($) ? p === "0" ? f = `>=${p}.${S}.0${M} <${p}.${+S + 1}.0-0` : f = `>=${p}.${S}.0${M} <${+p + 1}.0.0-0` : i ? (a("replaceCaret pr", i), p === "0" ? S === "0" ? f = `>=${p}.${S}.${$}-${i} <${p}.${S}.${+$ + 1}-0` : f = `>=${p}.${S}.${$}-${i} <${p}.${+S + 1}.0-0` : f = `>=${p}.${S}.${$}-${i} <${+p + 1}.0.0-0`) : (a("no pr"), p === "0" ? S === "0" ? f = `>=${p}.${S}.${$}${M} <${p}.${S}.${+$ + 1}-0` : f = `>=${p}.${S}.${$}${M} <${p}.${+S + 1}.0-0` : f = `>=${p}.${S}.${$} <${+p + 1}.0.0-0`), a("caret return", f), f;
    });
  }, ye = (k, j) => (a("replaceXRanges", k, j), k.split(/\s+/).map((z) => F(z, j)).join(" ")), F = (k, j) => {
    k = k.trim();
    const z = j.loose ? c[u.XRANGELOOSE] : c[u.XRANGE];
    return k.replace(z, (M, P, p, S, $, i) => {
      a("xRange", k, M, P, p, S, $, i);
      const f = T(p), b = f || T(S), O = b || T($), I = O;
      return P === "=" && I && (P = ""), i = j.includePrerelease ? "-0" : "", f ? P === ">" || P === "<" ? M = "<0.0.0-0" : M = "*" : P && I ? (b && (S = 0), $ = 0, P === ">" ? (P = ">=", b ? (p = +p + 1, S = 0, $ = 0) : (S = +S + 1, $ = 0)) : P === "<=" && (P = "<", b ? p = +p + 1 : S = +S + 1), P === "<" && (i = "-0"), M = `${P + p}.${S}.${$}${i}`) : b ? M = `>=${p}.0.0${i} <${+p + 1}.0.0-0` : O && (M = `>=${p}.${S}.0${i} <${p}.${+S + 1}.0-0`), a("xRange return", M), M;
    });
  }, G = (k, j) => (a("replaceStars", k, j), k.trim().replace(c[u.STAR], "")), oe = (k, j) => (a("replaceGTE0", k, j), k.trim().replace(c[j.includePrerelease ? u.GTE0PRE : u.GTE0], "")), H = (k) => (j, z, M, P, p, S, $, i, f, b, O, I) => (T(M) ? z = "" : T(P) ? z = `>=${M}.0.0${k ? "-0" : ""}` : T(p) ? z = `>=${M}.${P}.0${k ? "-0" : ""}` : S ? z = `>=${z}` : z = `>=${z}${k ? "-0" : ""}`, T(f) ? i = "" : T(b) ? i = `<${+f + 1}.0.0-0` : T(O) ? i = `<${f}.${+b + 1}.0-0` : I ? i = `<=${f}.${b}.${O}-${I}` : k ? i = `<${f}.${b}.${+O + 1}-0` : i = `<=${i}`, `${z} ${i}`.trim()), ce = (k, j, z) => {
    for (let M = 0; M < k.length; M++)
      if (!k[M].test(j))
        return !1;
    if (j.prerelease.length && !z.includePrerelease) {
      for (let M = 0; M < k.length; M++)
        if (a(k[M].semver), k[M].semver !== o.ANY && k[M].semver.prerelease.length > 0) {
          const P = k[M].semver;
          if (P.major === j.major && P.minor === j.minor && P.patch === j.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return lo;
}
var uo, ll;
function qs() {
  if (ll) return uo;
  ll = 1;
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
      const h = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], E = u.match(h);
      if (!E)
        throw new TypeError(`Invalid comparator: ${u}`);
      this.operator = E[1] !== void 0 ? E[1] : "", this.operator === "=" && (this.operator = ""), E[2] ? this.semver = new l(E[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(u) {
      if (a("Comparator.test", u, this.options.loose), this.semver === e || u === e)
        return !0;
      if (typeof u == "string")
        try {
          u = new l(u, this.options);
        } catch {
          return !1;
        }
      return o(u, this.operator, this.semver, this.options);
    }
    intersects(u, h) {
      if (!(u instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(u.value, h).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new c(this.value, h).test(u.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || o(this.semver, "<", u.semver, h) && this.operator.startsWith(">") && u.operator.startsWith("<") || o(this.semver, ">", u.semver, h) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  uo = t;
  const r = Vi, { safeRe: n, t: s } = Dn, o = Vd, a = zs, l = Ae, c = at();
  return uo;
}
const k1 = at(), C1 = (e, t, r) => {
  try {
    t = new k1(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Ks = C1;
const D1 = at(), M1 = (e, t) => new D1(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var L1 = M1;
const V1 = Ae, F1 = at(), z1 = (e, t, r) => {
  let n = null, s = null, o = null;
  try {
    o = new F1(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || s.compare(a) === -1) && (n = a, s = new V1(n, r));
  }), n;
};
var U1 = z1;
const q1 = Ae, K1 = at(), G1 = (e, t, r) => {
  let n = null, s = null, o = null;
  try {
    o = new K1(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || s.compare(a) === 1) && (n = a, s = new q1(n, r));
  }), n;
};
var H1 = G1;
const fo = Ae, B1 = at(), ul = Us, W1 = (e, t) => {
  e = new B1(e, t);
  let r = new fo("0.0.0");
  if (e.test(r) || (r = new fo("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let o = null;
    s.forEach((a) => {
      const l = new fo(a.semver.version);
      switch (a.operator) {
        case ">":
          l.prerelease.length === 0 ? l.patch++ : l.prerelease.push(0), l.raw = l.format();
        case "":
        case ">=":
          (!o || ul(l, o)) && (o = l);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!r || ul(r, o)) && (r = o);
  }
  return r && e.test(r) ? r : null;
};
var X1 = W1;
const J1 = at(), Y1 = (e, t) => {
  try {
    return new J1(e, t).range || "*";
  } catch {
    return null;
  }
};
var Q1 = Y1;
const Z1 = Ae, Fd = qs(), { ANY: x1 } = Fd, eS = at(), tS = Ks, dl = Us, fl = zi, rS = qi, nS = Ui, sS = (e, t, r, n) => {
  e = new Z1(e, n), t = new eS(t, n);
  let s, o, a, l, c;
  switch (r) {
    case ">":
      s = dl, o = rS, a = fl, l = ">", c = ">=";
      break;
    case "<":
      s = fl, o = nS, a = dl, l = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (tS(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const u = t.set[d];
    let h = null, E = null;
    if (u.forEach((g) => {
      g.semver === x1 && (g = new Fd(">=0.0.0")), h = h || g, E = E || g, s(g.semver, h.semver, n) ? h = g : a(g.semver, E.semver, n) && (E = g);
    }), h.operator === l || h.operator === c || (!E.operator || E.operator === l) && o(e, E.semver))
      return !1;
    if (E.operator === c && a(e, E.semver))
      return !1;
  }
  return !0;
};
var Ki = sS;
const oS = Ki, aS = (e, t, r) => oS(e, t, ">", r);
var iS = aS;
const cS = Ki, lS = (e, t, r) => cS(e, t, "<", r);
var uS = lS;
const hl = at(), dS = (e, t, r) => (e = new hl(e, r), t = new hl(t, r), e.intersects(t, r));
var fS = dS;
const hS = Ks, mS = ot;
var pS = (e, t, r) => {
  const n = [];
  let s = null, o = null;
  const a = e.sort((u, h) => mS(u, h, r));
  for (const u of a)
    hS(u, t, r) ? (o = u, s || (s = u)) : (o && n.push([s, o]), o = null, s = null);
  s && n.push([s, null]);
  const l = [];
  for (const [u, h] of n)
    u === h ? l.push(u) : !h && u === a[0] ? l.push("*") : h ? u === a[0] ? l.push(`<=${h}`) : l.push(`${u} - ${h}`) : l.push(`>=${u}`);
  const c = l.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < d.length ? c : t;
};
const ml = at(), Gi = qs(), { ANY: ho } = Gi, mo = Ks, Hi = ot, $S = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new ml(e, r), t = new ml(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const o of t.set) {
      const a = gS(s, o, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, yS = [new Gi(">=0.0.0-0")], pl = [new Gi(">=0.0.0")], gS = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === ho) {
    if (t.length === 1 && t[0].semver === ho)
      return !0;
    r.includePrerelease ? e = yS : e = pl;
  }
  if (t.length === 1 && t[0].semver === ho) {
    if (r.includePrerelease)
      return !0;
    t = pl;
  }
  const n = /* @__PURE__ */ new Set();
  let s, o;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? s = $l(s, g, r) : g.operator === "<" || g.operator === "<=" ? o = yl(o, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let a;
  if (s && o) {
    if (a = Hi(s.semver, o.semver, r), a > 0)
      return null;
    if (a === 0 && (s.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const g of n) {
    if (s && !mo(g, String(s), r) || o && !mo(g, String(o), r))
      return null;
    for (const w of t)
      if (!mo(g, String(w), r))
        return !1;
    return !0;
  }
  let l, c, d, u, h = o && !r.includePrerelease && o.semver.prerelease.length ? o.semver : !1, E = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && o.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const g of t) {
    if (u = u || g.operator === ">" || g.operator === ">=", d = d || g.operator === "<" || g.operator === "<=", s) {
      if (E && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === E.major && g.semver.minor === E.minor && g.semver.patch === E.patch && (E = !1), g.operator === ">" || g.operator === ">=") {
        if (l = $l(s, g, r), l === g && l !== s)
          return !1;
      } else if (s.operator === ">=" && !g.test(s.semver))
        return !1;
    }
    if (o) {
      if (h && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === h.major && g.semver.minor === h.minor && g.semver.patch === h.patch && (h = !1), g.operator === "<" || g.operator === "<=") {
        if (c = yl(o, g, r), c === g && c !== o)
          return !1;
      } else if (o.operator === "<=" && !g.test(o.semver))
        return !1;
    }
    if (!g.operator && (o || s) && a !== 0)
      return !1;
  }
  return !(s && d && !o && a !== 0 || o && u && !s && a !== 0 || E || h);
}, $l = (e, t, r) => {
  if (!e)
    return t;
  const n = Hi(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, yl = (e, t, r) => {
  if (!e)
    return t;
  const n = Hi(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var _S = $S;
const po = Dn, gl = Cn, vS = Ae, _l = Dd, wS = Er, ES = vb, bS = bb, SS = Pb, PS = Rb, NS = Ib, RS = kb, TS = Mb, OS = Fb, IS = ot, jS = Kb, AS = Bb, kS = Fi, CS = Yb, DS = xb, MS = Us, LS = zi, VS = Md, FS = Ld, zS = Ui, US = qi, qS = Vd, KS = E1, GS = I1, HS = qs(), BS = at(), WS = Ks, XS = L1, JS = U1, YS = H1, QS = X1, ZS = Q1, xS = Ki, eP = iS, tP = uS, rP = fS, nP = pS, sP = _S;
var oP = {
  parse: wS,
  valid: ES,
  clean: bS,
  inc: SS,
  diff: PS,
  major: NS,
  minor: RS,
  patch: TS,
  prerelease: OS,
  compare: IS,
  rcompare: jS,
  compareLoose: AS,
  compareBuild: kS,
  sort: CS,
  rsort: DS,
  gt: MS,
  lt: LS,
  eq: VS,
  neq: FS,
  gte: zS,
  lte: US,
  cmp: qS,
  coerce: KS,
  truncate: GS,
  Comparator: HS,
  Range: BS,
  satisfies: WS,
  toComparators: XS,
  maxSatisfying: JS,
  minSatisfying: YS,
  minVersion: QS,
  validRange: ZS,
  outside: xS,
  gtr: eP,
  ltr: tP,
  intersects: rP,
  simplifyRange: nP,
  subset: sP,
  SemVer: vS,
  re: po.re,
  src: po.src,
  tokens: po.t,
  SEMVER_SPEC_VERSION: gl.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: gl.RELEASE_TYPES,
  compareIdentifiers: _l.compareIdentifiers,
  rcompareIdentifiers: _l.rcompareIdentifiers
};
const Tr = /* @__PURE__ */ zl(oP), aP = Object.prototype.toString, iP = "[object Uint8Array]", cP = "[object ArrayBuffer]";
function zd(e, t, r) {
  return e ? e.constructor === t ? !0 : aP.call(e) === r : !1;
}
function Ud(e) {
  return zd(e, Uint8Array, iP);
}
function lP(e) {
  return zd(e, ArrayBuffer, cP);
}
function uP(e) {
  return Ud(e) || lP(e);
}
function dP(e) {
  if (!Ud(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function fP(e) {
  if (!uP(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function $o(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, o) => s + o.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    dP(s), r.set(s, n), n += s.length;
  return r;
}
const ts = {
  utf8: new globalThis.TextDecoder("utf8")
};
function rs(e, t = "utf8") {
  return fP(e), ts[t] ?? (ts[t] = new globalThis.TextDecoder(t)), ts[t].decode(e);
}
function hP(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const mP = new globalThis.TextEncoder();
function yo(e) {
  return hP(e), mP.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const vl = "aes-256-cbc", qd = /* @__PURE__ */ new Set([
  "aes-256-cbc",
  "aes-256-gcm",
  "aes-256-ctr"
]), pP = (e) => typeof e == "string" && qd.has(e), _t = () => /* @__PURE__ */ Object.create(null), wl = (e) => e !== void 0, go = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Ct = "__internal__", _o = `${Ct}.migrations.version`;
var Lt, Vt, mr, Ve, He, pr, $r, Kr, lt, ve, Kd, Gd, Hd, Bd, Wd, Xd, Jd, Yd;
class $P {
  constructor(t = {}) {
    Je(this, ve);
    on(this, "path");
    on(this, "events");
    Je(this, Lt);
    Je(this, Vt);
    Je(this, mr);
    Je(this, Ve);
    Je(this, He, {});
    Je(this, pr, !1);
    Je(this, $r);
    Je(this, Kr);
    Je(this, lt);
    on(this, "_deserialize", (t) => JSON.parse(t));
    on(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = yt(this, ve, Kd).call(this, t);
    Le(this, Ve, r), yt(this, ve, Gd).call(this, r), yt(this, ve, Bd).call(this, r), yt(this, ve, Wd).call(this, r), this.events = new EventTarget(), Le(this, Vt, r.encryptionKey), Le(this, mr, r.encryptionAlgorithm ?? vl), this.path = yt(this, ve, Xd).call(this, r), yt(this, ve, Jd).call(this, r), r.watch && this._watch();
  }
  get(t, r) {
    if (J(this, Ve).accessPropertiesByDotNotation)
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
      throw new TypeError(`Please don't use the ${Ct} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (o, a) => {
      if (go(o, a), J(this, Ve).accessPropertiesByDotNotation)
        Mn(n, o, a);
      else {
        if (o === "__proto__" || o === "constructor" || o === "prototype")
          return;
        n[o] = a;
      }
    };
    if (typeof t == "object") {
      const o = t;
      for (const [a, l] of Object.entries(o))
        s(a, l);
    } else
      s(t, r);
    this.store = n;
  }
  has(t) {
    return J(this, Ve).accessPropertiesByDotNotation ? Js(this.store, t) : t in this.store;
  }
  appendToArray(t, r) {
    go(t, r);
    const n = J(this, Ve).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
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
      wl(J(this, He)[r]) && this.set(r, J(this, He)[r]);
  }
  delete(t) {
    const { store: r } = this;
    J(this, Ve).accessPropertiesByDotNotation ? _f(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = _t();
    for (const r of Object.keys(J(this, He)))
      wl(J(this, He)[r]) && (go(r, J(this, He)[r]), J(this, Ve).accessPropertiesByDotNotation ? Mn(t, r, J(this, He)[r]) : t[r] = J(this, He)[r]);
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
      const r = Y.readFileSync(this.path, J(this, Vt) ? null : "utf8"), n = this._decryptData(r);
      return ((o) => {
        const a = this._deserialize(o);
        return J(this, pr) || this._validate(a), Object.assign(_t(), a);
      })(n);
    } catch (r) {
      if ((r == null ? void 0 : r.code) === "ENOENT")
        return this._ensureDirectory(), _t();
      if (J(this, Ve).clearInvalidConfig) {
        const n = r;
        if (n.name === "SyntaxError" || (t = n.message) != null && t.startsWith("Config schema violation:") || n.message === "Failed to decrypt config data.")
          return _t();
      }
      throw r;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !Js(t, Ct))
      try {
        const r = Y.readFileSync(this.path, J(this, Vt) ? null : "utf8"), n = this._decryptData(r), s = this._deserialize(n);
        Js(s, Ct) && Mn(t, Ct, Qi(s, Ct));
      } catch {
      }
    J(this, pr) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, r]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    J(this, $r) && (J(this, $r).close(), Le(this, $r, void 0)), J(this, Kr) && (Y.unwatchFile(this.path), Le(this, Kr, !1)), Le(this, lt, void 0);
  }
  _decryptData(t) {
    const r = J(this, Vt);
    if (!r)
      return typeof t == "string" ? t : rs(t);
    const n = J(this, mr), s = n === "aes-256-gcm" ? 16 : 0, o = ":".codePointAt(0), a = typeof t == "string" ? t.codePointAt(16) : t[16];
    if (!(o !== void 0 && a === o)) {
      if (n === "aes-256-cbc")
        return typeof t == "string" ? t : rs(t);
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
    }, d = t.slice(0, 16), u = t.slice(17), h = typeof u == "string" ? yo(u) : u, E = (g) => {
      const { ciphertext: w, authenticationTag: _ } = c(h), y = an.pbkdf2Sync(r, g, 1e4, 32, "sha512"), m = an.createDecipheriv(n, y, d);
      return _ && m.setAuthTag(_), rs($o([m.update(w), m.final()]));
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
      return typeof t == "string" ? t : rs(t);
    throw new Error("Failed to decrypt config data.");
  }
  _handleStoreChange(t) {
    let r = this.store;
    const n = () => {
      const s = r, o = this.store;
      Ji(o, s) || (r = o, t.call(this, o, s));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(t, r) {
    let n = t();
    const s = () => {
      const o = n, a = t();
      Ji(a, o) || (n = a, r.call(this, a, o));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(t) {
    if (!J(this, Lt) || J(this, Lt).call(this, t) || !J(this, Lt).errors)
      return;
    const n = J(this, Lt).errors.map(({ instancePath: s, message: o = "" }) => `\`${s.slice(1)}\` ${o}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    Y.mkdirSync(Q.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    const n = J(this, Vt);
    if (n) {
      const s = an.randomBytes(16), o = an.pbkdf2Sync(n, s, 1e4, 32, "sha512"), a = an.createCipheriv(J(this, mr), o, s), l = $o([a.update(yo(r)), a.final()]), c = [s, yo(":"), l];
      J(this, mr) === "aes-256-gcm" && c.push(a.getAuthTag()), r = $o(c);
    }
    if (fe.env.SNAP)
      Y.writeFileSync(this.path, r, { mode: J(this, Ve).configFileMode });
    else
      try {
        Fl(this.path, r, { mode: J(this, Ve).configFileMode });
      } catch (s) {
        if ((s == null ? void 0 : s.code) === "EXDEV") {
          Y.writeFileSync(this.path, r, { mode: J(this, Ve).configFileMode });
          return;
        }
        throw s;
      }
  }
  _watch() {
    if (this._ensureDirectory(), Y.existsSync(this.path) || this._write(_t()), fe.platform === "win32" || fe.platform === "darwin") {
      J(this, lt) ?? Le(this, lt, el(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = Q.dirname(this.path), r = Q.basename(this.path);
      Le(this, $r, Y.watch(t, { persistent: !1, encoding: "utf8" }, (n, s) => {
        s && s !== r || typeof J(this, lt) == "function" && J(this, lt).call(this);
      }));
    } else
      J(this, lt) ?? Le(this, lt, el(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), Y.watchFile(this.path, { persistent: !1 }, (t, r) => {
        typeof J(this, lt) == "function" && J(this, lt).call(this);
      }), Le(this, Kr, !0);
  }
  _migrate(t, r, n) {
    let s = this._get(_o, "0.0.0");
    const o = Object.keys(t).filter((l) => this._shouldPerformMigration(l, s, r));
    let a = structuredClone(this.store);
    for (const l of o)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: l,
          finalVersion: r,
          versions: o
        });
        const c = t[l];
        c == null || c(this), this._set(_o, l), s = l, a = structuredClone(this.store);
      } catch (c) {
        this.store = a;
        const d = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${d}`);
      }
    (this._isVersionInRangeFormat(s) || !Tr.eq(s, r)) && this._set(_o, r);
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
    return t === Ct || t.startsWith(`${Ct}.`);
  }
  _isVersionInRangeFormat(t) {
    return Tr.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && Tr.satisfies(r, t) ? !1 : Tr.satisfies(n, t) : !(Tr.lte(t, r) || Tr.gt(t, n));
  }
  _get(t, r) {
    return Qi(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    Mn(n, t, r), this.store = n;
  }
}
Lt = new WeakMap(), Vt = new WeakMap(), mr = new WeakMap(), Ve = new WeakMap(), He = new WeakMap(), pr = new WeakMap(), $r = new WeakMap(), Kr = new WeakMap(), lt = new WeakMap(), ve = new WeakSet(), Kd = function(t) {
  const r = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (r.encryptionAlgorithm ?? (r.encryptionAlgorithm = vl), !pP(r.encryptionAlgorithm))
    throw new TypeError(`The \`encryptionAlgorithm\` option must be one of: ${[...qd].join(", ")}`);
  if (!r.cwd) {
    if (!r.projectName)
      throw new Error("Please specify the `projectName` option.");
    r.cwd = bf(r.projectName, { suffix: r.projectSuffix }).config;
  }
  return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
}, Gd = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const r = YE.default, n = new Lg.Ajv2020({
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
  Le(this, Lt, n.compile(s)), yt(this, ve, Hd).call(this, t.schema);
}, Hd = function(t) {
  const r = Object.entries(t ?? {});
  for (const [n, s] of r) {
    if (!s || typeof s != "object" || !Object.hasOwn(s, "default"))
      continue;
    const { default: o } = s;
    o !== void 0 && (J(this, He)[n] = o);
  }
}, Bd = function(t) {
  t.defaults && Object.assign(J(this, He), t.defaults);
}, Wd = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, Xd = function(t) {
  const r = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = r ? `.${r}` : "";
  return Q.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
}, Jd = function(t) {
  if (t.migrations) {
    yt(this, ve, Yd).call(this, t), this._validate(this.store);
    return;
  }
  const r = this.store, n = Object.assign(_t(), t.defaults ?? {}, r);
  this._validate(n);
  try {
    Yi.deepEqual(r, n);
  } catch {
    this.store = n;
  }
}, Yd = function(t) {
  const { migrations: r, projectVersion: n } = t;
  if (r) {
    if (!n)
      throw new Error("Please specify the `projectVersion` option.");
    Le(this, pr, !0);
    try {
      const s = this.store, o = Object.assign(_t(), t.defaults ?? {}, s);
      try {
        Yi.deepEqual(s, o);
      } catch {
        this._write(o);
      }
      this._migrate(r, n, t.beforeEachMigration);
    } finally {
      Le(this, pr, !1);
    }
  }
};
const { app: fs, ipcMain: qo, shell: yP } = kl;
let El = !1;
const bl = () => {
  if (!qo || !fs)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: fs.getPath("userData"),
    appVersion: fs.getVersion()
  };
  return El || (qo.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), El = !0), e;
};
class gP extends $P {
  constructor(t) {
    let r, n;
    if (fe.type === "renderer") {
      const s = kl.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else qo && fs && ({ defaultCwd: r, appVersion: n } = bl());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = Q.isAbsolute(t.cwd) ? t.cwd : Q.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    bl();
  }
  async openInEditor() {
    const t = await yP.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const Qd = Q.dirname(mf(import.meta.url));
process.env.APP_ROOT = Q.join(Qd, "../..");
const YP = Q.join(process.env.APP_ROOT, "dist-electron"), Zd = Q.join(process.env.APP_ROOT, "dist"), Tn = process.env.VITE_DEV_SERVER_URL;
process.env.VITE_PUBLIC = Tn ? Q.join(process.env.APP_ROOT, "public") : Zd;
Go.release().startsWith("6.1") && je.disableHardwareAcceleration();
process.platform === "win32" && je.setAppUserModelId(je.getName());
je.requestSingleInstanceLock() || (je.quit(), process.exit(0));
const vo = 530, wo = 620, xd = 32, _P = 500, ef = 5e3, vP = 1e3, Dt = {
  fontFamily: "system",
  fontSize: 14,
  accentColor: "#2f7cff",
  textColor: "#17334d",
  glassTint: "#bfeeff",
  motto: "把今天的行动，放进长期的节奏里"
};
function Gs(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function vt(e, t) {
  return typeof e == "string" ? e.trim().slice(0, t) : "";
}
function bs(e, t = (/* @__PURE__ */ new Date()).toISOString()) {
  if (typeof e != "string") return t;
  const r = new Date(e);
  return Number.isNaN(r.getTime()) ? t : r.toISOString();
}
function Sl(e) {
  if (typeof e != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(e)) return "";
  const t = /* @__PURE__ */ new Date(`${e}T00:00:00`);
  return Number.isNaN(t.getTime()) ? "" : e;
}
function tf(e) {
  return typeof e == "string" && /^\d{8}$/.test(e) ? e : "";
}
function Eo(e, t) {
  return typeof e == "string" && /^#[0-9a-fA-F]{6}$/.test(e) ? e.toLowerCase() : t;
}
function Pl(e) {
  if (!Gs(e)) return { ...Dt };
  const t = ["system", "rounded", "serif", "mono"].includes(String(e.fontFamily)) ? e.fontFamily : Dt.fontFamily, r = typeof e.fontSize == "number" && Number.isFinite(e.fontSize) ? e.fontSize : Dt.fontSize;
  return {
    fontFamily: t,
    fontSize: Math.max(12, Math.min(18, Math.round(r))),
    accentColor: Eo(e.accentColor, Dt.accentColor),
    textColor: Eo(e.textColor, Dt.textColor),
    glassTint: Eo(e.glassTint, Dt.glassTint),
    motto: vt(e.motto, 120) || Dt.motto
  };
}
function Nl(e) {
  return Array.isArray(e) ? e.slice(0, _P).flatMap((t) => {
    if (!Gs(t)) return [];
    const r = vt(t.id, 128), n = vt(t.name, 160), s = tf(t.planDate);
    return !r || !n || !s ? [] : [{ id: r, name: n, planDate: s, createdAt: bs(t.createdAt) }];
  }) : [];
}
function Rl(e) {
  return Array.isArray(e) ? e.slice(0, ef).flatMap((t) => {
    if (!Gs(t)) return [];
    const r = vt(t.id, 128), n = vt(t.title, 240), s = vt(t.planId, 128), o = tf(t.planDate), a = Number(t.priority);
    if (!r || !n || !s || !o || ![1, 2, 3, 4].includes(a)) return [];
    const l = t.longTaskId == null ? null : vt(t.longTaskId, 128) || null;
    return [{
      id: r,
      title: n,
      planId: s,
      planDate: o,
      longTaskId: l,
      priority: a,
      dueAt: bs(t.dueAt),
      completed: t.completed === !0,
      createdAt: bs(t.createdAt)
    }];
  }) : [];
}
function Tl(e) {
  return Array.isArray(e) ? e.slice(0, vP).flatMap((t) => {
    if (!Gs(t)) return [];
    const r = vt(t.id, 128), n = vt(t.name, 240), s = Sl(t.start), o = Sl(t.end);
    if (!r || !n || !s || !o) return [];
    const a = typeof t.progress == "number" && Number.isFinite(t.progress) ? t.progress : 0, l = t.progressMode === "manual" || t.progressMode === "time" ? t.progressMode : "linked";
    return [{
      id: r,
      name: n,
      start: s,
      end: o < s ? s : o,
      progress: Math.max(0, Math.min(100, a)),
      progressMode: l,
      completed: t.completed === !0,
      delayedAt: t.delayedAt == null ? null : bs(t.delayedAt, "")
    }];
  }) : [];
}
const wP = new gP({
  name: "planner-data",
  defaults: {
    shortPlans: [],
    shortTasks: [],
    longTasks: [],
    notifiedTaskIds: [],
    preferences: Dt
  }
}), ke = wP;
let A = null, rt = null, it = null, Pn = null, he = null, Bi = 0, Hs = !1, Ol = "top-right", Dr = null, Mr = null, Lr = null, Ss = !1;
const rf = Q.join(Qd, "../preload/index.mjs"), nf = Q.join(Zd, "index.html");
function EP(e, t, r) {
  const n = Math.max(0, Math.min(r, Math.floor(Math.min(e, t) / 2))), s = [];
  let o = 0, a = -1;
  for (let l = 0; l < t; l += 1) {
    const c = l < n ? n - l - 0.5 : l >= t - n ? l - (t - n) + 0.5 : 0, d = c > 0 ? Math.ceil(n - Math.sqrt(Math.max(0, n * n - c * c))) : 0;
    a !== -1 && d !== a && (s.push({ x: a, y: o, width: e - a * 2, height: l - o }), o = l), a = d;
  }
  return s.push({ x: a, y: o, width: e - a * 2, height: t - o }), s.filter((l) => l.width > 0 && l.height > 0);
}
function Il(e) {
  if (process.platform !== "win32" || e.isDestroyed()) return;
  const { width: t, height: r } = e.getContentBounds();
  e.setShape(EP(t, r, xd));
}
function sf(e) {
  return Kt.dipToScreenRect(e, e.getBounds());
}
function of() {
  he == null || he.destroy(), he = null, Bi = 0;
}
function Ps(e) {
  if (!(he || e.isDestroyed())) {
    try {
      if (process.platform === "win32" && bo.isSupported()) {
        const t = sf(e), r = Kt.getDisplayMatching(e.getBounds()).scaleFactor;
        he = bo.createPanel({
          ...t,
          dpr: r,
          cornerRadius: xd * r,
          blurSigma: 2.4 * r,
          displacementScale: 54 * r,
          aberrationIntensity: 1.2,
          saturation: 1.18,
          excludeFromCapture: !0,
          anchorWindow: e
        }), Bi = he ? r : 0;
      }
    } catch {
      he = null;
    }
    !he && process.platform === "win32" && e.setBackgroundMaterial("acrylic");
  }
}
function hs(e = A) {
  if (!e || e.isDestroyed()) return;
  if (!he) {
    Ps(e);
    return;
  }
  const t = Kt.getDisplayMatching(e.getBounds()).scaleFactor;
  if (Math.abs(t - Bi) > 0.01) {
    of(), Ps(e);
    return;
  }
  he.setBounds(sf(e)), he.anchor(e);
}
function bP(e, t) {
  const { workArea: r } = Kt.getDisplayMatching(e.getBounds()), n = 0, s = e.getBounds(), o = r.x + n, a = r.x + r.width - s.width - n, l = r.y + n, c = r.y + r.height - s.height - n;
  return {
    x: t.endsWith("right") ? a : o,
    y: t.startsWith("bottom") ? c : l
  };
}
function qr(e, t = Ol) {
  const r = bP(e, t), n = Math.round(r.x), s = Math.round(r.y), o = e.getBounds();
  Ol = t, !(Math.abs(o.x - n) <= 1 && Math.abs(o.y - s) <= 1) && (Lr && clearTimeout(Lr), Ss = !0, e.setPosition(n, s, !1), Lr = setTimeout(() => {
    Ss = !1, Lr = null;
  }, 160));
}
function SP(e) {
  const t = e.getBounds(), { workArea: r } = Kt.getDisplayMatching(t), n = t.x + t.width / 2, s = t.y + t.height / 2, o = n < r.x + r.width / 2 ? "left" : "right";
  return `${s < r.y + r.height / 2 ? "top" : "bottom"}-${o}`;
}
function PP(e) {
  Ss || (Dr && clearTimeout(Dr), Dr = setTimeout(() => {
    Dr = null, e.isDestroyed() || qr(e, SP(e));
  }, 520));
}
function NP(e) {
  const t = e.getNativeWindowHandle();
  return process.arch === "x64" ? t.readBigUInt64LE(0).toString() : t.readUInt32LE(0).toString();
}
function RP() {
  const e = "zorder-helper.exe";
  return je.isPackaged ? Q.join(process.resourcesPath, e) : Q.join(process.env.APP_ROOT, "build", e);
}
function TP(e = A) {
  if (!e || e.isDestroyed() || (e.setAlwaysOnTop(!1), e.setSkipTaskbar(!0), process.platform !== "win32") || !e.isVisible()) return;
  const t = RP();
  if (!pf(t)) return;
  const r = NP(e);
  $f(t, [r], { windowsHide: !0, timeout: 1e3 }, () => {
    he && e === A && he.anchor(e);
  });
}
function hr(e = 80) {
  Mr && clearTimeout(Mr), Mr = setTimeout(() => {
    Mr = null, TP();
  }, e);
}
function pt(e = !1) {
  !A || A.isDestroyed() || (A.setSkipTaskbar(!0), A.setFocusable(!0), A.setIgnoreMouseEvents(!1), qr(A), A.showInactive(), Ps(A), hs(A), he == null || he.show(e ? 120 : 60), A.setSkipTaskbar(!0), hr(e ? 260 : 40));
}
function jl() {
  !A || A.isDestroyed() || (pt(!1), hr(120));
}
function ft() {
  if (!rt) return;
  const e = !!(A && !A.isDestroyed() && A.isVisible()), t = hf.buildFromTemplate([
    {
      label: e ? "隐藏窗口" : "显示窗口",
      click: () => {
        !A || A.isDestroyed() || (A.isVisible() ? A.hide() : pt(!0), ft());
      }
    },
    { type: "separator" },
    {
      label: "退出",
      click: () => {
        Hs = !0, je.quit();
      }
    }
  ]);
  rt.setToolTip("计划小组件"), rt.setContextMenu(t);
}
function OP() {
  if (rt) return;
  const e = Q.join(process.env.VITE_PUBLIC, "favicon.ico"), t = uf.createFromPath(e);
  rt = new df(t.isEmpty() ? e : t), rt.on("click", () => {
    !A || A.isDestroyed() || (A.isVisible() ? A.hide() : pt(!0), ft());
  }), rt.on("double-click", () => {
    !A || A.isDestroyed() || (pt(!0), ft());
  }), ft();
}
function IP() {
  if (it && !it.isDestroyed()) return;
  const { bounds: e } = Kt.getDisplayNearestPoint(Kt.getCursorScreenPoint());
  it = new Ko({
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
      preload: rf,
      contextIsolation: !0,
      nodeIntegration: !1,
      sandbox: !0
    }
  }), it.setIgnoreMouseEvents(!0, { forward: !0 }), Tn ? it.loadURL(`${Tn}#celebrate`) : it.loadFile(nf, { hash: "celebrate" }), setTimeout(() => {
    it && !it.isDestroyed() && it.close(), it = null;
  }, 2200);
}
function Al() {
  if (!Xi.isSupported()) return;
  const e = Date.now(), t = 5 * 60 * 1e3, r = ke.get("shortTasks"), n = new Set(ke.get("notifiedTaskIds"));
  for (const s of r) {
    if (s.completed) continue;
    const o = new Date(s.dueAt).getTime();
    if (Number.isNaN(o)) continue;
    const a = o - e;
    a >= 0 && a <= t && !n.has(s.id) && (new Xi({
      title: "任务提醒",
      body: `${s.title} 将在 5 分钟内到期`,
      silent: !1
    }).show(), n.add(s.id));
  }
  ke.set("notifiedTaskIds", [...n]);
}
function jP() {
  Pn && clearInterval(Pn), Al(), Pn = setInterval(Al, 60 * 1e3);
}
function AP() {
  process.platform === "win32" && je.isPackaged && je.setLoginItemSettings({
    openAtLogin: !0,
    openAsHidden: !0,
    path: process.execPath,
    args: ["--hidden"]
  });
}
function kP() {
  br.handle("planner:get-data", () => ({
    shortPlans: Nl(ke.get("shortPlans")),
    shortTasks: Rl(ke.get("shortTasks")),
    longTasks: Tl(ke.get("longTasks")),
    notifiedTaskIds: Array.isArray(ke.get("notifiedTaskIds")) ? ke.get("notifiedTaskIds").filter((e) => typeof e == "string").slice(0, ef) : [],
    preferences: Pl(ke.get("preferences"))
  })), br.handle("planner:save-short-plans", (e, t) => {
    const r = Nl(t);
    return ke.set("shortPlans", r), r;
  }), br.handle("planner:save-short-tasks", (e, t) => {
    const r = Rl(t);
    ke.set("shortTasks", r);
    const n = new Set(r.filter((o) => !o.completed).map((o) => o.id)), s = ke.get("notifiedTaskIds").filter((o) => n.has(o));
    return ke.set("notifiedTaskIds", s), r;
  }), br.handle("planner:save-long-tasks", (e, t) => {
    const r = Tl(t);
    return ke.set("longTasks", r), r;
  }), br.handle("planner:save-preferences", (e, t) => {
    const r = Pl(t);
    return ke.set("preferences", r), r;
  }), br.on("planner:celebrate", () => {
    IP();
  });
}
async function af() {
  const e = !process.argv.includes("--show");
  A = new Ko({
    title: "计划小组件",
    width: vo,
    height: wo,
    minWidth: vo,
    minHeight: wo,
    maxWidth: vo,
    maxHeight: wo,
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
    icon: Q.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload: rf,
      contextIsolation: !0,
      nodeIntegration: !1,
      sandbox: !0
    }
  }), A.setSkipTaskbar(!0), Il(A), A.webContents.setZoomFactor(1), A.webContents.setVisualZoomLevelLimits(1, 1), qr(A), Tn ? A.loadURL(Tn) : A.loadFile(nf), A.once("ready-to-show", () => {
    e ? ft() : (pt(!0), jl());
  }), setTimeout(() => {
    A && !A.isDestroyed() && !e && (pt(!0), jl());
  }, 1200), A.webContents.on("did-finish-load", () => {
    A == null || A.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString()), e || pt(!0), ft();
  }), A.on("show", () => {
    A && (A.setAlwaysOnTop(!1), A.setSkipTaskbar(!0), qr(A), Ps(A), hs(A), he == null || he.show(80), hr(40), ft());
  }), A.on("hide", () => {
    he == null || he.hide(80), ft();
  }), A.on("focus", () => hr(80)), A.on("blur", () => hr(40)), A.on("resize", () => {
    A && (Il(A), qr(A), hs(A), hr(120));
  }), A.on("move", () => {
    A && !A.isDestroyed() && !Ss && PP(A), hs(A), hr(180), ft();
  }), A.on("close", (t) => {
    Hs || (t.preventDefault(), A == null || A.hide());
  }), A.webContents.setWindowOpenHandler(({ url: t }) => {
    try {
      const r = new URL(t);
      r.protocol === "https:" && ff.openExternal(r.toString());
    } catch {
    }
    return { action: "deny" };
  }), A.webContents.on("will-navigate", (t) => {
    t.preventDefault();
  });
}
je.whenReady().then(() => {
  AP(), kP(), OP(), af(), jP(), Kt.on("display-metrics-changed", () => {
    A && !A.isDestroyed() && qr(A);
  }), Cl.register("CommandOrControl+Shift+T", () => {
    !A || A.isDestroyed() || (A.isVisible() ? (A.hide(), ft()) : pt(!0));
  });
});
je.on("before-quit", () => {
  Hs = !0;
});
je.on("window-all-closed", () => {
  process.platform !== "darwin" && Hs && je.quit();
});
je.on("will-quit", () => {
  Pn && clearInterval(Pn), Dr && clearTimeout(Dr), Mr && clearTimeout(Mr), Lr && clearTimeout(Lr), Cl.unregisterAll(), of(), bo.shutdown(), rt == null || rt.destroy(), rt = null;
});
je.on("second-instance", () => {
  A && !A.isDestroyed() && (A.isMinimized() && A.restore(), pt(!0));
});
je.on("activate", () => {
  Ko.getAllWindows().length ? pt(!0) : af();
});
export {
  YP as MAIN_DIST,
  Zd as RENDERER_DIST,
  Tn as VITE_DEV_SERVER_URL
};
