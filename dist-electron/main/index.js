var Ld = Object.defineProperty;
var Mi = (e) => {
  throw TypeError(e);
};
var Fd = (e, t, r) => t in e ? Ld(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var tn = (e, t, r) => Fd(e, typeof t != "symbol" ? t + "" : t, r), zs = (e, t, r) => t.has(e) || Mi("Cannot " + r);
var J = (e, t, r) => (zs(e, t, "read from private field"), r ? r.call(e) : t.get(e)), We = (e, t, r) => t.has(e) ? Mi("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), De = (e, t, r, n) => (zs(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), pt = (e, t, r) => (zs(e, t, "access private method"), r);
import pl, { app as Ce, screen as En, globalShortcut as $l, BrowserWindow as Aa, ipcMain as jt, nativeImage as zd, Tray as Ud, shell as qd, Menu as Kd, Notification as Vi } from "electron";
import { fileURLToPath as Gd } from "node:url";
import ee from "node:path";
import ka from "node:os";
import fe from "node:process";
import { promisify as Se, isDeepStrictEqual as Li } from "node:util";
import Y from "node:fs";
import rn from "node:crypto";
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
]), gl = 1e6, Hd = (e) => e >= "0" && e <= "9";
function _l(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= gl;
  }
  return !1;
}
function Us(e, t) {
  return yl.has(e) ? !1 : (e && _l(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function Bd(e) {
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
        if (!Us(r, t))
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
          if ((r || n === "property") && !Us(r, t))
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
        if (n === "index" && !Hd(o))
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        n === "start" && (n = "property"), r += o;
      }
    }
  }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (!Us(r, t))
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
function vs(e) {
  if (typeof e == "string")
    return Bd(e);
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
  const n = vs(t);
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
function kn(e, t, r) {
  if (!pr(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, s = vs(t);
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
function Wd(e, t) {
  if (!pr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = vs(t);
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
function qs(e, t) {
  if (!pr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = vs(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!pr(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const Ct = ka.homedir(), Ca = ka.tmpdir(), { env: Or } = fe, Xd = (e) => {
  const t = ee.join(Ct, "Library");
  return {
    data: ee.join(t, "Application Support", e),
    config: ee.join(t, "Preferences", e),
    cache: ee.join(t, "Caches", e),
    log: ee.join(t, "Logs", e),
    temp: ee.join(Ca, e)
  };
}, Jd = (e) => {
  const t = Or.APPDATA || ee.join(Ct, "AppData", "Roaming"), r = Or.LOCALAPPDATA || ee.join(Ct, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: ee.join(r, e, "Data"),
    config: ee.join(t, e, "Config"),
    cache: ee.join(r, e, "Cache"),
    log: ee.join(r, e, "Log"),
    temp: ee.join(Ca, e)
  };
}, Yd = (e) => {
  const t = ee.basename(Ct);
  return {
    data: ee.join(Or.XDG_DATA_HOME || ee.join(Ct, ".local", "share"), e),
    config: ee.join(Or.XDG_CONFIG_HOME || ee.join(Ct, ".config"), e),
    cache: ee.join(Or.XDG_CACHE_HOME || ee.join(Ct, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: ee.join(Or.XDG_STATE_HOME || ee.join(Ct, ".local", "state"), e),
    temp: ee.join(Ca, t, e)
  };
};
function Qd(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), fe.platform === "darwin" ? Xd(e) : fe.platform === "win32" ? Jd(e) : Yd(e);
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
}, Zd = 250, Pt = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: a } = s, o = s.interval ?? Zd, u = Date.now() + a;
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
    return t === "ENOSYS" || !xd && (t === "EINVAL" || t === "EPERM");
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
}, Cn = {
  onError: Tr.onChangeError
}, Ue = {
  onError: () => {
  }
}, xd = fe.getuid ? !fe.getuid() : !1, Pe = {
  isRetriable: Tr.isRetriableError
}, Oe = {
  attempt: {
    /* ASYNC */
    chmod: St(Se(Y.chmod), Cn),
    chown: St(Se(Y.chown), Cn),
    close: St(Se(Y.close), Ue),
    fsync: St(Se(Y.fsync), Ue),
    mkdir: St(Se(Y.mkdir), Ue),
    realpath: St(Se(Y.realpath), Ue),
    stat: St(Se(Y.stat), Ue),
    unlink: St(Se(Y.unlink), Ue),
    /* SYNC */
    chmodSync: $t(Y.chmodSync, Cn),
    chownSync: $t(Y.chownSync, Cn),
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
}, ef = "utf8", Ui = 438, tf = 511, rf = {}, nf = fe.geteuid ? fe.geteuid() : -1, sf = fe.getegid ? fe.getegid() : -1, af = 1e3, of = !!fe.getuid;
fe.getuid && fe.getuid();
const qi = 128, cf = (e) => e instanceof Error && "code" in e, Ki = (e) => typeof e == "string", Ks = (e) => e === void 0, lf = fe.platform === "linux", vl = fe.platform === "win32", Da = ["SIGHUP", "SIGINT", "SIGTERM"];
vl || Da.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
lf && Da.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class uf {
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
const df = new uf(), ff = df.register, Te = {
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
    const t = ee.basename(e);
    if (t.length <= qi)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - qi;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
ff(Te.purgeSyncAll);
function wl(e, t, r = rf) {
  if (Ki(r))
    return wl(e, t, { encoding: r });
  const s = { timeout: r.timeout ?? af };
  let a = null, o = null, u = null;
  try {
    const c = Oe.attempt.realpathSync(e), d = !!c;
    e = c || e, [o, a] = Te.get(e, r.tmpCreate || Te.create, r.tmpPurge !== !1);
    const l = of && Ks(r.chown), h = Ks(r.mode);
    if (d && (l || h)) {
      const E = Oe.attempt.statSync(e);
      E && (r = { ...r }, l && (r.chown = { uid: E.uid, gid: E.gid }), h && (r.mode = E.mode));
    }
    if (!d) {
      const E = ee.dirname(e);
      Oe.attempt.mkdirSync(E, {
        mode: tf,
        recursive: !0
      });
    }
    u = Oe.retry.openSync(s)(o, "w", r.mode || Ui), r.tmpCreated && r.tmpCreated(o), Ki(t) ? Oe.retry.writeSync(s)(u, t, 0, r.encoding || ef) : Ks(t) || Oe.retry.writeSync(s)(u, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Oe.retry.fsyncSync(s)(u) : Oe.attempt.fsync(u)), Oe.retry.closeSync(s)(u), u = null, r.chown && (r.chown.uid !== nf || r.chown.gid !== sf) && Oe.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== Ui && Oe.attempt.chmodSync(o, r.mode);
    try {
      Oe.retry.renameSync(s)(o, e);
    } catch (E) {
      if (!cf(E) || E.code !== "ENAMETOOLONG")
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
var ha = { exports: {} }, bl = {}, tt = {}, zr = {}, Nn = {}, Q = {}, bn = {};
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
})(bn);
var ma = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = bn;
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
  const t = bn, r = ma;
  var n = bn;
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
      const L = this._scope.toName(i);
      return this._for(new R(I, L, f, b), () => T(L));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, T = r.varKinds.const) {
      const I = this._scope.toName(i);
      if (this.opts.es5) {
        const L = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${L}.length`, (V) => {
          this.var(I, (0, t._)`${L}[${V}]`), b(I);
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
    return new t._Code($._items.reduce((I, L) => (L instanceof t.Name && (L = b(L)), L instanceof t._Code ? I.push(...L._items) : I.push(L), I), []));
    function b(I) {
      const L = f[I.str];
      return L === void 0 || i[I.str] !== 1 ? I : (delete i[I.str], L);
    }
    function T(I) {
      return I instanceof t._Code && I._items.some((L) => L instanceof t.Name && i[L.str] === 1 && f[L.str] !== void 0);
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
})(Q);
var C = {};
Object.defineProperty(C, "__esModule", { value: !0 });
C.checkStrictMode = C.getErrorPath = C.Type = C.useFunc = C.setEvaluated = C.evaluatedPropsToName = C.mergeEvaluated = C.eachItem = C.unescapeJsonPointer = C.escapeJsonPointer = C.escapeFragment = C.unescapeFragment = C.schemaRefOrVal = C.schemaHasRulesButRef = C.schemaHasRules = C.checkUnknownRules = C.alwaysValidSchema = C.toHash = void 0;
const oe = Q, hf = bn;
function mf(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
C.toHash = mf;
function pf(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Sl(e, t), !Pl(t, e.self.RULES.all));
}
C.alwaysValidSchema = pf;
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
function $f(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
C.schemaHasRulesButRef = $f;
function yf({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, oe._)`${r}`;
  }
  return (0, oe._)`${e}${t}${(0, oe.getProperty)(n)}`;
}
C.schemaRefOrVal = yf;
function gf(e) {
  return Nl(decodeURIComponent(e));
}
C.unescapeFragment = gf;
function _f(e) {
  return encodeURIComponent(Ma(e));
}
C.escapeFragment = _f;
function Ma(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
C.escapeJsonPointer = Ma;
function Nl(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
C.unescapeJsonPointer = Nl;
function vf(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
C.eachItem = vf;
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
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, oe._)`${r} || {}`), Va(e, r, t));
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
  return t !== void 0 && Va(e, r, t), r;
}
C.evaluatedPropsToName = Rl;
function Va(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, oe._)`${t}${(0, oe.getProperty)(n)}`, !0));
}
C.setEvaluated = Va;
const Hi = {};
function wf(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Hi[t.code] || (Hi[t.code] = new hf._Code(t.code))
  });
}
C.useFunc = wf;
var pa;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(pa || (C.Type = pa = {}));
function Ef(e, t, r) {
  if (e instanceof oe.Name) {
    const n = t === pa.Num;
    return r ? n ? (0, oe._)`"[" + ${e} + "]"` : (0, oe._)`"['" + ${e} + "']"` : n ? (0, oe._)`"/" + ${e}` : (0, oe._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, oe.getProperty)(e).toString() : "/" + Ma(e);
}
C.getErrorPath = Ef;
function Ol(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
C.checkStrictMode = Ol;
var qe = {};
Object.defineProperty(qe, "__esModule", { value: !0 });
const Ne = Q, bf = {
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
qe.default = bf;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = Q, r = C, n = qe;
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
})(Nn);
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.boolOrEmptySchema = zr.topBoolOrEmptySchema = void 0;
const Sf = Nn, Pf = Q, Nf = qe, Rf = {
  message: "boolean schema is false"
};
function Of(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Tl(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Nf.default.data) : (t.assign((0, Pf._)`${n}.errors`, null), t.return(!0));
}
zr.topBoolOrEmptySchema = Of;
function Tf(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Tl(e)) : r.var(t, !0);
}
zr.boolOrEmptySchema = Tf;
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
  (0, Sf.reportError)(s, Rf, void 0, t);
}
var ye = {}, $r = {};
Object.defineProperty($r, "__esModule", { value: !0 });
$r.getRules = $r.isJSONType = void 0;
const If = ["string", "number", "integer", "boolean", "null", "object", "array"], jf = new Set(If);
function Af(e) {
  return typeof e == "string" && jf.has(e);
}
$r.isJSONType = Af;
function kf() {
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
$r.getRules = kf;
var _t = {};
Object.defineProperty(_t, "__esModule", { value: !0 });
_t.shouldUseRule = _t.shouldUseGroup = _t.schemaHasRulesForType = void 0;
function Cf({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Il(e, n);
}
_t.schemaHasRulesForType = Cf;
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
const Df = $r, Mf = _t, Vf = Nn, Z = Q, Al = C;
var Cr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Cr || (ye.DataType = Cr = {}));
function Lf(e) {
  const t = kl(e.type);
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
ye.getSchemaTypes = Lf;
function kl(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(Df.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ye.getJSONTypes = kl;
function Ff(e, t) {
  const { gen: r, data: n, opts: s } = e, a = zf(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, Mf.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const u = La(t, n, s.strictNumbers, Cr.Wrong);
    r.if(u, () => {
      a.length ? Uf(e, t, a) : Fa(e);
    });
  }
  return o;
}
ye.coerceAndCheckDataType = Ff;
const Cl = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function zf(e, t) {
  return t ? e.filter((r) => Cl.has(r) || t === "array" && r === "array") : [];
}
function Uf(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, Z._)`typeof ${s}`), u = n.let("coerced", (0, Z._)`undefined`);
  a.coerceTypes === "array" && n.if((0, Z._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, Z._)`${s}[0]`).assign(o, (0, Z._)`typeof ${s}`).if(La(t, s, a.strictNumbers), () => n.assign(u, s))), n.if((0, Z._)`${u} !== undefined`);
  for (const d of r)
    (Cl.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), Fa(e), n.endIf(), n.if((0, Z._)`${u} !== undefined`, () => {
    n.assign(s, u), qf(e, u);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, Z._)`${o} == "number" || ${o} == "boolean"`).assign(u, (0, Z._)`"" + ${s}`).elseIf((0, Z._)`${s} === null`).assign(u, (0, Z._)`""`);
        return;
      case "number":
        n.elseIf((0, Z._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(u, (0, Z._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, Z._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(u, (0, Z._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, Z._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(u, !1).elseIf((0, Z._)`${s} === "true" || ${s} === 1`).assign(u, !0);
        return;
      case "null":
        n.elseIf((0, Z._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(u, null);
        return;
      case "array":
        n.elseIf((0, Z._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(u, (0, Z._)`[${s}]`);
    }
  }
}
function qf({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, Z._)`${t} !== undefined`, () => e.assign((0, Z._)`${t}[${r}]`, n));
}
function $a(e, t, r, n = Cr.Correct) {
  const s = n === Cr.Correct ? Z.operators.EQ : Z.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, Z._)`${t} ${s} null`;
    case "array":
      a = (0, Z._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, Z._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, Z._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, Z._)`typeof ${t} ${s} ${e}`;
  }
  return n === Cr.Correct ? a : (0, Z.not)(a);
  function o(u = Z.nil) {
    return (0, Z.and)((0, Z._)`typeof ${t} == "number"`, u, r ? (0, Z._)`isFinite(${t})` : Z.nil);
  }
}
ye.checkDataType = $a;
function La(e, t, r, n) {
  if (e.length === 1)
    return $a(e[0], t, r, n);
  let s;
  const a = (0, Al.toHash)(e);
  if (a.array && a.object) {
    const o = (0, Z._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, Z._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = Z.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, Z.and)(s, $a(o, t, r, n));
  return s;
}
ye.checkDataTypes = La;
const Kf = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, Z._)`{type: ${e}}` : (0, Z._)`{type: ${t}}`
};
function Fa(e) {
  const t = Gf(e);
  (0, Vf.reportError)(t, Kf);
}
ye.reportTypeError = Fa;
function Gf(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Al.schemaRefOrVal)(e, n, "type");
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
var ws = {};
Object.defineProperty(ws, "__esModule", { value: !0 });
ws.assignDefaults = void 0;
const wr = Q, Hf = C;
function Bf(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Bi(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => Bi(e, a, s.default));
}
ws.assignDefaults = Bf;
function Bi(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const u = (0, wr._)`${a}${(0, wr.getProperty)(t)}`;
  if (s) {
    (0, Hf.checkStrictMode)(e, `default is ignored for: ${u}`);
    return;
  }
  let c = (0, wr._)`${u} === undefined`;
  o.useDefaults === "empty" && (c = (0, wr._)`${c} || ${u} === null || ${u} === ""`), n.if(c, (0, wr._)`${u} = ${(0, wr.stringify)(r)}`);
}
var dt = {}, re = {};
Object.defineProperty(re, "__esModule", { value: !0 });
re.validateUnion = re.validateArray = re.usePattern = re.callValidateCode = re.schemaProperties = re.allSchemaProperties = re.noPropertyInData = re.propertyInData = re.isOwnProperty = re.hasPropFunc = re.reportMissingProp = re.checkMissingProp = re.checkReportMissingProp = void 0;
const le = Q, za = C, Rt = qe, Wf = C;
function Xf(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(qa(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, le._)`${t}` }, !0), e.error();
  });
}
re.checkReportMissingProp = Xf;
function Jf({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, le.or)(...n.map((a) => (0, le.and)(qa(e, t, a, r.ownProperties), (0, le._)`${s} = ${a}`)));
}
re.checkMissingProp = Jf;
function Yf(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
re.reportMissingProp = Yf;
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
function Qf(e, t, r, n) {
  const s = (0, le._)`${t}${(0, le.getProperty)(r)} !== undefined`;
  return n ? (0, le._)`${s} && ${Ua(e, t, r)}` : s;
}
re.propertyInData = Qf;
function qa(e, t, r, n) {
  const s = (0, le._)`${t}${(0, le.getProperty)(r)} === undefined`;
  return n ? (0, le.or)(s, (0, le.not)(Ua(e, t, r))) : s;
}
re.noPropertyInData = qa;
function Ml(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
re.allSchemaProperties = Ml;
function Zf(e, t) {
  return Ml(t).filter((r) => !(0, za.alwaysValidSchema)(e, t[r]));
}
re.schemaProperties = Zf;
function xf({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, u, c, d) {
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
re.callValidateCode = xf;
const eh = (0, le._)`new RegExp`;
function th({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, le._)`${s.code === "new RegExp" ? eh : (0, Wf.useFunc)(e, s)}(${r}, ${n})`
  });
}
re.usePattern = th;
function rh(e) {
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
re.validateArray = rh;
function nh(e) {
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
re.validateUnion = nh;
Object.defineProperty(dt, "__esModule", { value: !0 });
dt.validateKeywordUsage = dt.validSchemaType = dt.funcKeywordCode = dt.macroKeywordCode = void 0;
const je = Q, sr = qe, sh = re, ah = Nn;
function oh(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, u = t.macro.call(o.self, s, a, o), c = Vl(r, n, u);
  o.opts.validateSchema !== !1 && o.self.validateSchema(u, !0);
  const d = r.name("valid");
  e.subschema({
    schema: u,
    schemaPath: je.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
dt.macroKeywordCode = oh;
function ih(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: u, it: c } = e;
  lh(c, t);
  const d = !u && t.compile ? t.compile.call(c.self, a, o, c) : t.validate, l = Vl(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      _(), t.modifying && Wi(e), y(() => e.error());
    else {
      const m = t.async ? g() : w();
      t.modifying && Wi(e), y(() => ch(e, m));
    }
  }
  function g() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, je._)`await `), (v) => n.assign(h, !1).if((0, je._)`${v} instanceof ${c.ValidationError}`, () => n.assign(m, (0, je._)`${v}.errors`), () => n.throw(v))), m;
  }
  function w() {
    const m = (0, je._)`${l}.errors`;
    return n.assign(m, null), _(je.nil), m;
  }
  function _(m = t.async ? (0, je._)`await ` : je.nil) {
    const v = c.opts.passContext ? sr.default.this : sr.default.self, N = !("compile" in t && !u || t.schema === !1);
    n.assign(h, (0, je._)`${m}${(0, sh.callValidateCode)(e, l, v, N)}`, t.modifying);
  }
  function y(m) {
    var v;
    n.if((0, je.not)((v = t.valid) !== null && v !== void 0 ? v : h), m);
  }
}
dt.funcKeywordCode = ih;
function Wi(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, je._)`${n.parentData}[${n.parentDataProperty}]`));
}
function ch(e, t) {
  const { gen: r } = e;
  r.if((0, je._)`Array.isArray(${t})`, () => {
    r.assign(sr.default.vErrors, (0, je._)`${sr.default.vErrors} === null ? ${t} : ${sr.default.vErrors}.concat(${t})`).assign(sr.default.errors, (0, je._)`${sr.default.vErrors}.length`), (0, ah.extendErrors)(e);
  }, () => e.error());
}
function lh({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Vl(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, je.stringify)(r) });
}
function uh(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
dt.validSchemaType = uh;
function dh({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
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
dt.validateKeywordUsage = dh;
var Ft = {};
Object.defineProperty(Ft, "__esModule", { value: !0 });
Ft.extendSubschemaMode = Ft.extendSubschemaData = Ft.getSubschema = void 0;
const lt = Q, Ll = C;
function fh(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const u = e.schema[t];
    return r === void 0 ? {
      schema: u,
      schemaPath: (0, lt._)`${e.schemaPath}${(0, lt.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: u[r],
      schemaPath: (0, lt._)`${e.schemaPath}${(0, lt.getProperty)(t)}${(0, lt.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Ll.escapeFragment)(r)}`
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
Ft.getSubschema = fh;
function hh(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: u } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: l, opts: h } = t, E = u.let("data", (0, lt._)`${t.data}${(0, lt.getProperty)(r)}`, !0);
    c(E), e.errorPath = (0, lt.str)`${d}${(0, Ll.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, lt._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof lt.Name ? s : u.let("data", s, !0);
    c(d), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Ft.extendSubschemaData = hh;
function mh(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Ft.extendSubschemaMode = mh;
var Ee = {}, Es = function e(t, r) {
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
}, Fl = { exports: {} }, Vt = Fl.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  es(t, n, s, e, "", e);
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
function es(e, t, r, n, s, a, o, u, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, u, c, d);
    for (var l in n) {
      var h = n[l];
      if (Array.isArray(h)) {
        if (l in Vt.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            es(e, t, r, h[E], s + "/" + l + "/" + E, a, s, l, n, E);
      } else if (l in Vt.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            es(e, t, r, h[g], s + "/" + l + "/" + ph(g), a, s, l, n, g);
      } else (l in Vt.keywords || e.allKeys && !(l in Vt.skipKeywords)) && es(e, t, r, h, s + "/" + l, a, s, l, n);
    }
    r(n, s, a, o, u, c, d);
  }
}
function ph(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var $h = Fl.exports;
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.getSchemaRefs = Ee.resolveUrl = Ee.normalizeId = Ee._getFullPath = Ee.getFullPath = Ee.inlineRef = void 0;
const yh = C, gh = Es, _h = $h, vh = /* @__PURE__ */ new Set([
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
function wh(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !ya(e) : t ? zl(e) <= t : !1;
}
Ee.inlineRef = wh;
const Eh = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function ya(e) {
  for (const t in e) {
    if (Eh.has(t))
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
    if (t++, !vh.has(r) && (typeof e[r] == "object" && (0, yh.eachItem)(e[r], (n) => t += zl(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Ul(e, t = "", r) {
  r !== !1 && (t = Dr(t));
  const n = e.parse(t);
  return ql(e, n);
}
Ee.getFullPath = Ul;
function ql(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ee._getFullPath = ql;
const bh = /#\/?$/;
function Dr(e) {
  return e ? e.replace(bh, "") : "";
}
Ee.normalizeId = Dr;
function Sh(e, t, r) {
  return r = Dr(r), e.resolve(t, r);
}
Ee.resolveUrl = Sh;
const Ph = /^[a-z_][-a-z0-9._]*$/i;
function Nh(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Dr(e[r] || t), a = { "": s }, o = Ul(n, s, !1), u = {}, c = /* @__PURE__ */ new Set();
  return _h(e, { allKeys: !0 }, (h, E, g, w) => {
    if (w === void 0)
      return;
    const _ = o + E;
    let y = a[w];
    typeof h[r] == "string" && (y = m.call(this, h[r])), v.call(this, h.$anchor), v.call(this, h.$dynamicAnchor), a[E] = y;
    function m(N) {
      const R = this.opts.uriResolver.resolve;
      if (N = Dr(y ? R(y, N) : N), c.has(N))
        throw l(N);
      c.add(N);
      let O = this.refs[N];
      return typeof O == "string" && (O = this.refs[O]), typeof O == "object" ? d(h, O.schema, N) : N !== Dr(_) && (N[0] === "#" ? (d(h, u[N], N), u[N] = h) : this.refs[N] = _), N;
    }
    function v(N) {
      if (typeof N == "string") {
        if (!Ph.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), u;
  function d(h, E, g) {
    if (E !== void 0 && !gh(h, E))
      throw l(g);
  }
  function l(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ee.getSchemaRefs = Nh;
Object.defineProperty(tt, "__esModule", { value: !0 });
tt.getData = tt.KeywordCxt = tt.validateFunctionCode = void 0;
const Kl = zr, Xi = ye, Ka = _t, us = ye, Rh = ws, dn = dt, Gs = Ft, U = Q, B = qe, Oh = Ee, vt = C, nn = Nn;
function Th(e) {
  if (Bl(e) && (Wl(e), Hl(e))) {
    Ah(e);
    return;
  }
  Gl(e, () => (0, Kl.topBoolOrEmptySchema)(e));
}
tt.validateFunctionCode = Th;
function Gl({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, U._)`${B.default.data}, ${B.default.valCxt}`, n.$async, () => {
    e.code((0, U._)`"use strict"; ${Ji(r, s)}`), jh(e, s), e.code(a);
  }) : e.func(t, (0, U._)`${B.default.data}, ${Ih(s)}`, n.$async, () => e.code(Ji(r, s)).code(a));
}
function Ih(e) {
  return (0, U._)`{${B.default.instancePath}="", ${B.default.parentData}, ${B.default.parentDataProperty}, ${B.default.rootData}=${B.default.data}${e.dynamicRef ? (0, U._)`, ${B.default.dynamicAnchors}={}` : U.nil}}={}`;
}
function jh(e, t) {
  e.if(B.default.valCxt, () => {
    e.var(B.default.instancePath, (0, U._)`${B.default.valCxt}.${B.default.instancePath}`), e.var(B.default.parentData, (0, U._)`${B.default.valCxt}.${B.default.parentData}`), e.var(B.default.parentDataProperty, (0, U._)`${B.default.valCxt}.${B.default.parentDataProperty}`), e.var(B.default.rootData, (0, U._)`${B.default.valCxt}.${B.default.rootData}`), t.dynamicRef && e.var(B.default.dynamicAnchors, (0, U._)`${B.default.valCxt}.${B.default.dynamicAnchors}`);
  }, () => {
    e.var(B.default.instancePath, (0, U._)`""`), e.var(B.default.parentData, (0, U._)`undefined`), e.var(B.default.parentDataProperty, (0, U._)`undefined`), e.var(B.default.rootData, B.default.data), t.dynamicRef && e.var(B.default.dynamicAnchors, (0, U._)`{}`);
  });
}
function Ah(e) {
  const { schema: t, opts: r, gen: n } = e;
  Gl(e, () => {
    r.$comment && t.$comment && Jl(e), Vh(e), n.let(B.default.vErrors, null), n.let(B.default.errors, 0), r.unevaluated && kh(e), Xl(e), zh(e);
  });
}
function kh(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, U._)`${r}.evaluated`), t.if((0, U._)`${e.evaluated}.dynamicProps`, () => t.assign((0, U._)`${e.evaluated}.props`, (0, U._)`undefined`)), t.if((0, U._)`${e.evaluated}.dynamicItems`, () => t.assign((0, U._)`${e.evaluated}.items`, (0, U._)`undefined`));
}
function Ji(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, U._)`/*# sourceURL=${r} */` : U.nil;
}
function Ch(e, t) {
  if (Bl(e) && (Wl(e), Hl(e))) {
    Dh(e, t);
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
function Dh(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Jl(e), Lh(e), Fh(e);
  const a = n.const("_errs", B.default.errors);
  Xl(e, a), n.var(t, (0, U._)`${a} === ${B.default.errors}`);
}
function Wl(e) {
  (0, vt.checkUnknownRules)(e), Mh(e);
}
function Xl(e, t) {
  if (e.opts.jtd)
    return Yi(e, [], !1, t);
  const r = (0, Xi.getSchemaTypes)(e.schema), n = (0, Xi.coerceAndCheckDataType)(e, r);
  Yi(e, r, !n, t);
}
function Mh(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, vt.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function Vh(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, vt.checkStrictMode)(e, "default is ignored in the schema root");
}
function Lh(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, Oh.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function Fh(e) {
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
function zh(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, U._)`${B.default.errors} === 0`, () => t.return(B.default.data), () => t.throw((0, U._)`new ${s}(${B.default.vErrors})`)) : (t.assign((0, U._)`${n}.errors`, B.default.vErrors), a.unevaluated && Uh(e), t.return((0, U._)`${B.default.errors} === 0`));
}
function Uh({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof U.Name && e.assign((0, U._)`${t}.props`, r), n instanceof U.Name && e.assign((0, U._)`${t}.items`, n);
}
function Yi(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: u, opts: c, self: d } = e, { RULES: l } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, vt.schemaHasRulesButRef)(a, l))) {
    s.block(() => Zl(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || qh(e, t), s.block(() => {
    for (const E of l.rules)
      h(E);
    h(l.post);
  });
  function h(E) {
    (0, Ka.shouldUseGroup)(a, E) && (E.type ? (s.if((0, us.checkDataType)(E.type, o, c.strictNumbers)), Qi(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, us.reportTypeError)(e)), s.endIf()) : Qi(e, E), u || s.if((0, U._)`${B.default.errors} === ${n || 0}`));
  }
}
function Qi(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, Rh.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, Ka.shouldUseRule)(n, a) && Zl(e, a.keyword, a.definition, t.type);
  });
}
function qh(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (Kh(e, t), e.opts.allowUnionTypes || Gh(e, t), Hh(e, e.dataTypes));
}
function Kh(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Yl(e.dataTypes, r) || Ga(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), Wh(e, t);
  }
}
function Gh(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Ga(e, "use allowUnionTypes to allow union type keyword");
}
function Hh(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Ka.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => Bh(t, o)) && Ga(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function Bh(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Yl(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function Wh(e, t) {
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
    if ((0, dn.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, vt.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", xl(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, dn.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
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
    (t ? nn.reportExtraError : nn.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, nn.reportError)(this, this.def.$dataError || nn.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, nn.resetErrorsCount)(this.gen, this.errsCount);
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
        return (0, U._)`${(0, us.checkDataTypes)(c, r, a.opts.strictNumbers, us.DataType.Wrong)}`;
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
    const n = (0, Gs.getSubschema)(this.it, t);
    (0, Gs.extendSubschemaData)(n, this.it, t), (0, Gs.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return Ch(s, r), s;
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
tt.KeywordCxt = Ql;
function Zl(e, t, r, n) {
  const s = new Ql(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, dn.funcKeywordCode)(s, r) : "macro" in r ? (0, dn.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, dn.funcKeywordCode)(s, r);
}
const Xh = /^\/(?:[^~]|~0|~1)*$/, Jh = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function xl(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return B.default.rootData;
  if (e[0] === "/") {
    if (!Xh.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = B.default.rootData;
  } else {
    const d = Jh.exec(e);
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
tt.getData = xl;
var Rn = {};
Object.defineProperty(Rn, "__esModule", { value: !0 });
class Yh extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
Rn.default = Yh;
var Hr = {};
Object.defineProperty(Hr, "__esModule", { value: !0 });
const Hs = Ee;
let Qh = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Hs.resolveUrl)(t, r, n), this.missingSchema = (0, Hs.normalizeId)((0, Hs.getFullPath)(t, this.missingRef));
  }
};
Hr.default = Qh;
var ke = {};
Object.defineProperty(ke, "__esModule", { value: !0 });
ke.resolveSchema = ke.getCompilingSchema = ke.resolveRef = ke.compileSchema = ke.SchemaEnv = void 0;
const Xe = Q, Zh = Rn, rr = qe, Ze = Ee, Zi = C, xh = tt;
let bs = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Ze.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
ke.SchemaEnv = bs;
function Ha(e) {
  const t = eu.call(this, e);
  if (t)
    return t;
  const r = (0, Ze.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new Xe.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let u;
  e.$async && (u = o.scopeValue("Error", {
    ref: Zh.default,
    code: (0, Xe._)`require("ajv/dist/runtime/validation_error").default`
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
    dataPathArr: [Xe.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Xe.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: u,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Xe.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Xe._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, xh.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    l = `${o.scopeRefs(rr.default.scope)}return ${h}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const g = new Function(`${rr.default.self}`, `${rr.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: _ } = d;
      g.evaluated = {
        props: w instanceof Xe.Name ? void 0 : w,
        items: _ instanceof Xe.Name ? void 0 : _,
        dynamicProps: w instanceof Xe.Name,
        dynamicItems: _ instanceof Xe.Name
      }, g.source && (g.source.evaluated = (0, Xe.stringify)(g.evaluated));
    }
    return e.validate = g, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), h;
  } finally {
    this._compilations.delete(e);
  }
}
ke.compileSchema = Ha;
function em(e, t, r) {
  var n;
  r = (0, Ze.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = nm.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: u } = this.opts;
    o && (a = new bs({ schema: o, schemaId: u, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = tm.call(this, a);
}
ke.resolveRef = em;
function tm(e) {
  return (0, Ze.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Ha.call(this, e);
}
function eu(e) {
  for (const t of this._compilations)
    if (rm(t, e))
      return t;
}
ke.getCompilingSchema = eu;
function rm(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function nm(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Ss.call(this, e, t);
}
function Ss(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Ze._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Ze.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Bs.call(this, r, e);
  const a = (0, Ze.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const u = Ss.call(this, e, o);
    return typeof (u == null ? void 0 : u.schema) != "object" ? void 0 : Bs.call(this, r, u);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Ha.call(this, o), a === (0, Ze.normalizeId)(t)) {
      const { schema: u } = o, { schemaId: c } = this.opts, d = u[c];
      return d && (s = (0, Ze.resolveUrl)(this.opts.uriResolver, s, d)), new bs({ schema: u, schemaId: c, root: e, baseId: s });
    }
    return Bs.call(this, r, o);
  }
}
ke.resolveSchema = Ss;
const sm = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Bs(e, { baseId: t, schema: r, root: n }) {
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
    !sm.has(u) && d && (t = (0, Ze.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, Zi.schemaHasRulesButRef)(r, this.RULES)) {
    const u = (0, Ze.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = Ss.call(this, n, u);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new bs({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const am = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", om = "Meta-schema for $data reference (JSON AnySchema extension proposal)", im = "object", cm = [
  "$data"
], lm = {
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
}, um = !1, dm = {
  $id: am,
  description: om,
  type: im,
  required: cm,
  properties: lm,
  additionalProperties: um
};
var Ba = {}, Ps = { exports: {} };
const fm = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), tu = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u), Wa = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu), ru = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu), hm = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
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
const mm = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function xi(e) {
  return e.length = 0, !0;
}
function pm(e, t, r) {
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
function $m(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, o = !1, u = pm;
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
  if (ym(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = $m(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function ym(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function gm(e) {
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
const _m = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" }, vm = /[@/?#:]/g, wm = /[@/?#]/g;
function au(e, t) {
  const r = t ? wm : vm;
  return r.lastIndex = 0, e.replace(r, (n) => _m[n]);
}
function Em(e, t = !1) {
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
function bm(e) {
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
    hm(e[r]) ? t += e[r] : t += escape(e[r]);
  }
  return t;
}
function Sm(e) {
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
function Pm(e) {
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
  nonSimpleDomain: mm,
  recomposeAuthority: Pm,
  reescapeHostDelimiters: au,
  normalizePercentEncoding: Em,
  normalizePathEncoding: bm,
  escapePreservingEscapes: Sm,
  removeDotSegments: gm,
  isIPv4: tu,
  isUUID: fm,
  normalizeIPv6: su
};
const { isUUID: Nm } = ou, Rm = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
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
function Om(e) {
  return e.secure = iu(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function Tm(e) {
  if ((e.port === (iu(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function Im(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(Rm);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, a = Xa(s);
    e.path = void 0, a && (e = a.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function jm(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, a = Xa(s);
  a && (e = a.serialize(e, t));
  const o = e, u = e.nss;
  return o.path = `${n || t.nid}:${u}`, t.skipEscape = !0, o;
}
function Am(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !Nm(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function km(e) {
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
), Cm = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: uu.domainHost,
    parse: cu,
    serialize: lu
  }
), ts = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: Om,
    serialize: Tm
  }
), Dm = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: ts.domainHost,
    parse: ts.parse,
    serialize: ts.serialize
  }
), Mm = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: Im,
    serialize: jm,
    skipNormalize: !0
  }
), Vm = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: Am,
    serialize: km,
    skipNormalize: !0
  }
), ds = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: uu,
    https: Cm,
    ws: ts,
    wss: Dm,
    urn: Mm,
    "urn:uuid": Vm
  }
);
Object.setPrototypeOf(ds, null);
function Xa(e) {
  return e && (ds[
    /** @type {SchemeName} */
    e
  ] || ds[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var Lm = {
  SCHEMES: ds,
  getSchemeHandler: Xa
};
const { normalizeIPv6: Fm, removeDotSegments: cn, recomposeAuthority: zm, normalizePercentEncoding: Um, normalizePathEncoding: qm, escapePreservingEscapes: Km, reescapeHostDelimiters: Gm, isIPv4: Hm, nonSimpleDomain: Bm } = ou, { SCHEMES: Wm, getSchemeHandler: du } = Lm;
function Xm(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  xm(e, t) : typeof e == "object" && (e = /** @type {T} */
  Ur(yr(e, t), t)), e;
}
function Jm(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = fu(Ur(e, n), Ur(t, n), n, !0);
  return n.skipEscape = !0, yr(s, n);
}
function fu(e, t, r, n) {
  const s = {};
  return n || (e = Ur(yr(e, r), r), t = Ur(yr(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = cn(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = cn(t.path || ""), s.query = t.query) : (t.path ? (t.path[0] === "/" ? s.path = cn(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = cn(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function Ym(e, t, r) {
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
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = Um(r.path) : (r.path = Km(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const o = zm(r);
  if (o !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(o), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let u = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (u = cn(u)), o === void 0 && u[0] === "/" && u[1] === "/" && (u = "/%2F" + u.slice(2)), s.push(u);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const Qm = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Zm(e, t) {
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
  const o = e.match(Qm);
  if (o) {
    n.scheme = o[1], n.userinfo = o[3], n.host = o[4], n.port = parseInt(o[5], 10), n.path = o[6] || "", n.query = o[7], n.fragment = o[8], isNaN(n.port) && (n.port = o[5]);
    const u = Zm(n, o);
    if (u !== void 0 && (n.error = n.error || u, s = !0), n.host)
      if (Hm(n.host) === !1) {
        const l = Fm(n.host);
        n.host = l.host.toLowerCase(), a = l.isIPV6;
      } else
        a = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const c = du(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!c || !c.unicodeSupport) && n.host && (r.domainHost || c && c.domainHost) && a === !1 && Bm(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (d) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + d;
      }
    if ((!c || c && !c.skipNormalize) && (e.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = Gm(unescape(n.host), a))), n.path && (n.path = qm(n.path)), n.fragment))
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
function Ur(e, t) {
  return hu(e, t).parsed;
}
function xm(e, t) {
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
  SCHEMES: Wm,
  normalize: Xm,
  resolve: Jm,
  resolveComponent: fu,
  equal: Ym,
  serialize: yr,
  parse: Ur
};
Ps.exports = Ja;
Ps.exports.default = Ja;
Ps.exports.fastUri = Ja;
var pu = Ps.exports;
Object.defineProperty(Ba, "__esModule", { value: !0 });
const $u = pu;
$u.code = 'require("ajv/dist/runtime/uri").default';
Ba.default = $u;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = tt;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = Q;
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
  const n = Rn, s = Hr, a = $r, o = ke, u = Q, c = Ee, d = ye, l = C, h = dm, E = Ba, g = (P, p) => new RegExp(P, p);
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
    var p, S, $, i, f, b, T, I, L, V, se, ze, qt, Kt, Gt, Ht, Bt, Wt, Xt, Jt, Yt, Qt, Zt, xt, er;
    const Be = P.strict, tr = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, xr = tr === !0 || tr === void 0 ? 1 : tr || 0, en = ($ = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && $ !== void 0 ? $ : g, Fs = (i = P.uriResolver) !== null && i !== void 0 ? i : E.default;
    return {
      strictSchema: (b = (f = P.strictSchema) !== null && f !== void 0 ? f : Be) !== null && b !== void 0 ? b : !0,
      strictNumbers: (I = (T = P.strictNumbers) !== null && T !== void 0 ? T : Be) !== null && I !== void 0 ? I : !0,
      strictTypes: (V = (L = P.strictTypes) !== null && L !== void 0 ? L : Be) !== null && V !== void 0 ? V : "log",
      strictTuples: (ze = (se = P.strictTuples) !== null && se !== void 0 ? se : Be) !== null && ze !== void 0 ? ze : "log",
      strictRequired: (Kt = (qt = P.strictRequired) !== null && qt !== void 0 ? qt : Be) !== null && Kt !== void 0 ? Kt : !1,
      code: P.code ? { ...P.code, optimize: xr, regExp: en } : { optimize: xr, regExp: en },
      loopRequired: (Gt = P.loopRequired) !== null && Gt !== void 0 ? Gt : v,
      loopEnum: (Ht = P.loopEnum) !== null && Ht !== void 0 ? Ht : v,
      meta: (Bt = P.meta) !== null && Bt !== void 0 ? Bt : !0,
      messages: (Wt = P.messages) !== null && Wt !== void 0 ? Wt : !0,
      inlineRefs: (Xt = P.inlineRefs) !== null && Xt !== void 0 ? Xt : !0,
      schemaId: (Jt = P.schemaId) !== null && Jt !== void 0 ? Jt : "$id",
      addUsedSchema: (Yt = P.addUsedSchema) !== null && Yt !== void 0 ? Yt : !0,
      validateSchema: (Qt = P.validateSchema) !== null && Qt !== void 0 ? Qt : !0,
      validateFormats: (Zt = P.validateFormats) !== null && Zt !== void 0 ? Zt : !0,
      unicodeRegExp: (xt = P.unicodeRegExp) !== null && xt !== void 0 ? xt : !0,
      int32range: (er = P.int32range) !== null && er !== void 0 ? er : !0,
      uriResolver: Fs
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
      async function i(V, se) {
        await f.call(this, V.$schema);
        const ze = this._addSchema(V, se);
        return ze.validate || b.call(this, ze);
      }
      async function f(V) {
        V && !this.getSchema(V) && await i.call(this, { $ref: V }, !0);
      }
      async function b(V) {
        try {
          return this._compileSchemaEnv(V);
        } catch (se) {
          if (!(se instanceof s.default))
            throw se;
          return T.call(this, se), await I.call(this, se.missingSchema), b.call(this, V);
        }
      }
      function T({ missingSchema: V, missingRef: se }) {
        if (this.refs[V])
          throw new Error(`AnySchema ${V} is loaded but ${se} cannot be resolved`);
      }
      async function I(V) {
        const se = await L.call(this, V);
        this.refs[V] || await f.call(this, se.$schema), this.refs[V] || this.addSchema(se, V, S);
      }
      async function L(V) {
        const se = this._loading[V];
        if (se)
          return se;
        try {
          return await (this._loading[V] = $(V));
        } finally {
          delete this._loading[V];
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
          const { $data: L } = I.definition, V = b[T];
          L && V && (b[T] = M(V));
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
      const L = c.getSchemaRefs.call(this, p, $);
      return I = new o.SchemaEnv({ schema: p, schemaId: T, meta: S, baseId: $, localRefs: L }), this._cache.set(I.schema, I), f && !$.startsWith("#") && ($ && this._checkUnique($), this.refs[$] = I), i && this.validateSchema(p, !0), I;
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
    p.before ? k.call(this, b, T, p.before) : b.rules.push(T), f.all[P] = T, ($ = p.implements) === null || $ === void 0 || $.forEach((I) => this.addKeyword(I));
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
})(bl);
var Ya = {}, Qa = {}, Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
const ep = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Za.default = ep;
var bt = {};
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.callRef = bt.getValidate = void 0;
const tp = Hr, tc = re, Ve = Q, Er = qe, rc = ke, Dn = C, rp = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: u, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const l = rc.resolveRef.call(c, d, s, r);
    if (l === void 0)
      throw new tp.default(n.opts.uriResolver, s, r);
    if (l instanceof rc.SchemaEnv)
      return E(l);
    return g(l);
    function h() {
      if (a === d)
        return rs(e, o, a, a.$async);
      const w = t.scopeValue("root", { ref: d });
      return rs(e, (0, Ve._)`${w}.validate`, d, d.$async);
    }
    function E(w) {
      const _ = yu(e, w);
      rs(e, _, w, w.$async);
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
function yu(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ve._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
bt.getValidate = yu;
function rs(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: u, opts: c } = a, d = c.passContext ? Er.default.this : Ve.nil;
  n ? l() : h();
  function l() {
    if (!u.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, Ve._)`await ${(0, tc.callValidateCode)(e, t, d)}`), g(t), o || s.assign(w, !0);
    }, (_) => {
      s.if((0, Ve._)`!(${_} instanceof ${a.ValidationError})`, () => s.throw(_)), E(_), o || s.assign(w, !1);
    }), e.ok(w);
  }
  function h() {
    e.result((0, tc.callValidateCode)(e, t, d), () => g(t), () => E(t));
  }
  function E(w) {
    const _ = (0, Ve._)`${w}.errors`;
    s.assign(Er.default.vErrors, (0, Ve._)`${Er.default.vErrors} === null ? ${_} : ${Er.default.vErrors}.concat(${_})`), s.assign(Er.default.errors, (0, Ve._)`${Er.default.vErrors}.length`);
  }
  function g(w) {
    var _;
    if (!a.opts.unevaluated)
      return;
    const y = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (a.props !== !0)
      if (y && !y.dynamicProps)
        y.props !== void 0 && (a.props = Dn.mergeEvaluated.props(s, y.props, a.props));
      else {
        const m = s.var("props", (0, Ve._)`${w}.evaluated.props`);
        a.props = Dn.mergeEvaluated.props(s, m, a.props, Ve.Name);
      }
    if (a.items !== !0)
      if (y && !y.dynamicItems)
        y.items !== void 0 && (a.items = Dn.mergeEvaluated.items(s, y.items, a.items));
      else {
        const m = s.var("items", (0, Ve._)`${w}.evaluated.items`);
        a.items = Dn.mergeEvaluated.items(s, m, a.items, Ve.Name);
      }
  }
}
bt.callRef = rs;
bt.default = rp;
Object.defineProperty(Qa, "__esModule", { value: !0 });
const np = Za, sp = bt, ap = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  np.default,
  sp.default
];
Qa.default = ap;
var xa = {}, eo = {};
Object.defineProperty(eo, "__esModule", { value: !0 });
const fs = Q, Ot = fs.operators, hs = {
  maximum: { okStr: "<=", ok: Ot.LTE, fail: Ot.GT },
  minimum: { okStr: ">=", ok: Ot.GTE, fail: Ot.LT },
  exclusiveMaximum: { okStr: "<", ok: Ot.LT, fail: Ot.GTE },
  exclusiveMinimum: { okStr: ">", ok: Ot.GT, fail: Ot.LTE }
}, op = {
  message: ({ keyword: e, schemaCode: t }) => (0, fs.str)`must be ${hs[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, fs._)`{comparison: ${hs[e].okStr}, limit: ${t}}`
}, ip = {
  keyword: Object.keys(hs),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: op,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, fs._)`${r} ${hs[t].fail} ${n} || isNaN(${r})`);
  }
};
eo.default = ip;
var to = {};
Object.defineProperty(to, "__esModule", { value: !0 });
const fn = Q, cp = {
  message: ({ schemaCode: e }) => (0, fn.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, fn._)`{multipleOf: ${e}}`
}, lp = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: cp,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), u = a ? (0, fn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, fn._)`${o} !== parseInt(${o})`;
    e.fail$data((0, fn._)`(${n} === 0 || (${o} = ${r}/${n}, ${u}))`);
  }
};
to.default = lp;
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
const ar = Q, up = C, dp = no, fp = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, ar.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, ar._)`{limit: ${e}}`
}, hp = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: fp,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? ar.operators.GT : ar.operators.LT, o = s.opts.unicode === !1 ? (0, ar._)`${r}.length` : (0, ar._)`${(0, up.useFunc)(e.gen, dp.default)}(${r})`;
    e.fail$data((0, ar._)`${o} ${a} ${n}`);
  }
};
ro.default = hp;
var so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
const mp = re, pp = C, Ir = Q, $p = {
  message: ({ schemaCode: e }) => (0, Ir.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Ir._)`{pattern: ${e}}`
}, yp = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: $p,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e, u = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, Ir._)`new RegExp` : (0, pp.useFunc)(t, c), l = t.let("valid");
      t.try(() => t.assign(l, (0, Ir._)`${d}(${a}, ${u}).test(${r})`), () => t.assign(l, !1)), e.fail$data((0, Ir._)`!${l}`);
    } else {
      const c = (0, mp.usePattern)(e, s);
      e.fail$data((0, Ir._)`!${c}.test(${r})`);
    }
  }
};
so.default = yp;
var ao = {};
Object.defineProperty(ao, "__esModule", { value: !0 });
const hn = Q, gp = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, hn.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, hn._)`{limit: ${e}}`
}, _p = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: gp,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? hn.operators.GT : hn.operators.LT;
    e.fail$data((0, hn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
ao.default = _p;
var oo = {};
Object.defineProperty(oo, "__esModule", { value: !0 });
const sn = re, mn = Q, vp = C, wp = {
  message: ({ params: { missingProperty: e } }) => (0, mn.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, mn._)`{missingProperty: ${e}}`
}, Ep = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: wp,
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
          (0, vp.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(mn.nil, h);
      else
        for (const g of r)
          (0, sn.checkReportMissingProp)(e, g);
    }
    function l() {
      const g = t.let("missing");
      if (c || a) {
        const w = t.let("valid", !0);
        e.block$data(w, () => E(g, w)), e.ok(w);
      } else
        t.if((0, sn.checkMissingProp)(e, r, g)), (0, sn.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, sn.noPropertyInData)(t, s, g, u.ownProperties), () => e.error());
      });
    }
    function E(g, w) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(w, (0, sn.propertyInData)(t, s, g, u.ownProperties)), t.if((0, mn.not)(w), () => {
          e.error(), t.break();
        });
      }, mn.nil);
    }
  }
};
oo.default = Ep;
var io = {};
Object.defineProperty(io, "__esModule", { value: !0 });
const pn = Q, bp = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, pn.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, pn._)`{limit: ${e}}`
}, Sp = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: bp,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? pn.operators.GT : pn.operators.LT;
    e.fail$data((0, pn._)`${r}.length ${s} ${n}`);
  }
};
io.default = Sp;
var co = {}, On = {};
Object.defineProperty(On, "__esModule", { value: !0 });
const _u = Es;
_u.code = 'require("ajv/dist/runtime/equal").default';
On.default = _u;
Object.defineProperty(co, "__esModule", { value: !0 });
const Ws = ye, ve = Q, Pp = C, Np = On, Rp = {
  message: ({ params: { i: e, j: t } }) => (0, ve.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, ve._)`{i: ${e}, j: ${t}}`
}, Op = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Rp,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: u } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, Ws.getSchemaTypes)(a.items) : [];
    e.block$data(c, l, (0, ve._)`${o} === false`), e.ok(c);
    function l() {
      const w = t.let("i", (0, ve._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: w, j: _ }), t.assign(c, !0), t.if((0, ve._)`${w} > 1`, () => (h() ? E : g)(w, _));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function E(w, _) {
      const y = t.name("item"), m = (0, Ws.checkDataTypes)(d, y, u.opts.strictNumbers, Ws.DataType.Wrong), v = t.const("indices", (0, ve._)`{}`);
      t.for((0, ve._)`;${w}--;`, () => {
        t.let(y, (0, ve._)`${r}[${w}]`), t.if(m, (0, ve._)`continue`), d.length > 1 && t.if((0, ve._)`typeof ${y} == "string"`, (0, ve._)`${y} += "_"`), t.if((0, ve._)`typeof ${v}[${y}] == "number"`, () => {
          t.assign(_, (0, ve._)`${v}[${y}]`), e.error(), t.assign(c, !1).break();
        }).code((0, ve._)`${v}[${y}] = ${w}`);
      });
    }
    function g(w, _) {
      const y = (0, Pp.useFunc)(t, Np.default), m = t.name("outer");
      t.label(m).for((0, ve._)`;${w}--;`, () => t.for((0, ve._)`${_} = ${w}; ${_}--;`, () => t.if((0, ve._)`${y}(${r}[${w}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
co.default = Op;
var lo = {};
Object.defineProperty(lo, "__esModule", { value: !0 });
const ga = Q, Tp = C, Ip = On, jp = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, ga._)`{allowedValue: ${e}}`
}, Ap = {
  keyword: "const",
  $data: !0,
  error: jp,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, ga._)`!${(0, Tp.useFunc)(t, Ip.default)}(${r}, ${s})`) : e.fail((0, ga._)`${a} !== ${r}`);
  }
};
lo.default = Ap;
var uo = {};
Object.defineProperty(uo, "__esModule", { value: !0 });
const ln = Q, kp = C, Cp = On, Dp = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, ln._)`{allowedValues: ${e}}`
}, Mp = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Dp,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const u = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, kp.useFunc)(t, Cp.default));
    let l;
    if (u || n)
      l = t.let("valid"), e.block$data(l, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", a);
      l = (0, ln.or)(...s.map((w, _) => E(g, _)));
    }
    e.pass(l);
    function h() {
      t.assign(l, !1), t.forOf("v", a, (g) => t.if((0, ln._)`${d()}(${r}, ${g})`, () => t.assign(l, !0).break()));
    }
    function E(g, w) {
      const _ = s[w];
      return typeof _ == "object" && _ !== null ? (0, ln._)`${d()}(${r}, ${g}[${w}])` : (0, ln._)`${r} === ${_}`;
    }
  }
};
uo.default = Mp;
Object.defineProperty(xa, "__esModule", { value: !0 });
const Vp = eo, Lp = to, Fp = ro, zp = so, Up = ao, qp = oo, Kp = io, Gp = co, Hp = lo, Bp = uo, Wp = [
  // number
  Vp.default,
  Lp.default,
  // string
  Fp.default,
  zp.default,
  // object
  Up.default,
  qp.default,
  // array
  Kp.default,
  Gp.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Hp.default,
  Bp.default
];
xa.default = Wp;
var fo = {}, Br = {};
Object.defineProperty(Br, "__esModule", { value: !0 });
Br.validateAdditionalItems = void 0;
const or = Q, _a = C, Xp = {
  message: ({ params: { len: e } }) => (0, or.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, or._)`{limit: ${e}}`
}, Jp = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Xp,
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
  const u = r.const("len", (0, or._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, or._)`${u} <= ${t.length}`);
  else if (typeof n == "object" && !(0, _a.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, or._)`${u} <= ${t.length}`);
    r.if((0, or.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, u, (l) => {
      e.subschema({ keyword: a, dataProp: l, dataPropType: _a.Type.Num }, d), o.allErrors || r.if((0, or.not)(d), () => r.break());
    });
  }
}
Br.validateAdditionalItems = vu;
Br.default = Jp;
var ho = {}, Wr = {};
Object.defineProperty(Wr, "__esModule", { value: !0 });
Wr.validateTuple = void 0;
const nc = Q, ns = C, Yp = re, Qp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return wu(e, "additionalItems", t);
    r.items = !0, !(0, ns.alwaysValidSchema)(r, t) && e.ok((0, Yp.validateArray)(e));
  }
};
function wu(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: u } = e;
  l(s), u.opts.unevaluated && r.length && u.items !== !0 && (u.items = ns.mergeEvaluated.items(n, r.length, u.items));
  const c = n.name("valid"), d = n.const("len", (0, nc._)`${a}.length`);
  r.forEach((h, E) => {
    (0, ns.alwaysValidSchema)(u, h) || (n.if((0, nc._)`${d} > ${E}`, () => e.subschema({
      keyword: o,
      schemaProp: E,
      dataProp: E
    }, c)), e.ok(c));
  });
  function l(h) {
    const { opts: E, errSchemaPath: g } = u, w = r.length, _ = w === h.minItems && (w === h.maxItems || h[t] === !1);
    if (E.strictTuples && !_) {
      const y = `"${o}" is ${w}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, ns.checkStrictMode)(u, y, E.strictTuples);
    }
  }
}
Wr.validateTuple = wu;
Wr.default = Qp;
Object.defineProperty(ho, "__esModule", { value: !0 });
const Zp = Wr, xp = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, Zp.validateTuple)(e, "items")
};
ho.default = xp;
var mo = {};
Object.defineProperty(mo, "__esModule", { value: !0 });
const sc = Q, e$ = C, t$ = re, r$ = Br, n$ = {
  message: ({ params: { len: e } }) => (0, sc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, sc._)`{limit: ${e}}`
}, s$ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: n$,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, e$.alwaysValidSchema)(n, t) && (s ? (0, r$.validateAdditionalItems)(e, s) : e.ok((0, t$.validateArray)(e)));
  }
};
mo.default = s$;
var po = {};
Object.defineProperty(po, "__esModule", { value: !0 });
const Ge = Q, Mn = C, a$ = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ge.str)`must contain at least ${e} valid item(s)` : (0, Ge.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ge._)`{minContains: ${e}}` : (0, Ge._)`{minContains: ${e}, maxContains: ${t}}`
}, o$ = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: a$,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, u;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, u = d) : o = 1;
    const l = t.const("len", (0, Ge._)`${s}.length`);
    if (e.setParams({ min: o, max: u }), u === void 0 && o === 0) {
      (0, Mn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (u !== void 0 && o > u) {
      (0, Mn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Mn.alwaysValidSchema)(a, r)) {
      let _ = (0, Ge._)`${l} >= ${o}`;
      u !== void 0 && (_ = (0, Ge._)`${_} && ${l} <= ${u}`), e.pass(_);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    u === void 0 && o === 1 ? g(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), u !== void 0 && t.if((0, Ge._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const _ = t.name("_valid"), y = t.let("count", 0);
      g(_, () => t.if(_, () => w(y)));
    }
    function g(_, y) {
      t.forRange("i", 0, l, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: Mn.Type.Num,
          compositeRule: !0
        }, _), y();
      });
    }
    function w(_) {
      t.code((0, Ge._)`${_}++`), u === void 0 ? t.if((0, Ge._)`${_} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, Ge._)`${_} > ${u}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, Ge._)`${_} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
po.default = o$;
var Ns = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = Q, r = C, n = re;
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
})(Ns);
var $o = {};
Object.defineProperty($o, "__esModule", { value: !0 });
const Eu = Q, i$ = C, c$ = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Eu._)`{propertyName: ${e.propertyName}}`
}, l$ = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: c$,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, i$.alwaysValidSchema)(s, r))
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
$o.default = l$;
var Rs = {};
Object.defineProperty(Rs, "__esModule", { value: !0 });
const Vn = re, Ye = Q, u$ = qe, Ln = C, d$ = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Ye._)`{additionalProperty: ${e.additionalProperty}}`
}, f$ = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: d$,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: u, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, Ln.alwaysValidSchema)(o, r))
      return;
    const d = (0, Vn.allSchemaProperties)(n.properties), l = (0, Vn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Ye._)`${a} === ${u$.default.errors}`);
    function h() {
      t.forIn("key", s, (y) => {
        !d.length && !l.length ? w(y) : t.if(E(y), () => w(y));
      });
    }
    function E(y) {
      let m;
      if (d.length > 8) {
        const v = (0, Ln.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, Vn.isOwnProperty)(t, v, y);
      } else d.length ? m = (0, Ye.or)(...d.map((v) => (0, Ye._)`${y} === ${v}`)) : m = Ye.nil;
      return l.length && (m = (0, Ye.or)(m, ...l.map((v) => (0, Ye._)`${(0, Vn.usePattern)(e, v)}.test(${y})`))), (0, Ye.not)(m);
    }
    function g(y) {
      t.code((0, Ye._)`delete ${s}[${y}]`);
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
      if (typeof r == "object" && !(0, Ln.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_(y, m, !1), t.if((0, Ye.not)(m), () => {
          e.reset(), g(y);
        })) : (_(y, m), u || t.if((0, Ye.not)(m), () => t.break()));
      }
    }
    function _(y, m, v) {
      const N = {
        keyword: "additionalProperties",
        dataProp: y,
        dataPropType: Ln.Type.Str
      };
      v === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
Rs.default = f$;
var yo = {};
Object.defineProperty(yo, "__esModule", { value: !0 });
const h$ = tt, ac = re, Xs = C, oc = Rs, m$ = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && oc.default.code(new h$.KeywordCxt(a, oc.default, "additionalProperties"));
    const o = (0, ac.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Xs.mergeEvaluated.props(t, (0, Xs.toHash)(o), a.props));
    const u = o.filter((h) => !(0, Xs.alwaysValidSchema)(a, r[h]));
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
yo.default = m$;
var go = {};
Object.defineProperty(go, "__esModule", { value: !0 });
const ic = re, Fn = Q, cc = C, lc = C, p$ = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, u = (0, ic.allSchemaProperties)(r), c = u.filter((_) => (0, cc.alwaysValidSchema)(a, r[_]));
    if (u.length === 0 || c.length === u.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, l = t.name("valid");
    a.props !== !0 && !(a.props instanceof Fn.Name) && (a.props = (0, lc.evaluatedPropsToName)(t, a.props));
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
        t.if((0, Fn._)`${(0, ic.usePattern)(e, _)}.test(${y})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: y,
            dataPropType: lc.Type.Str
          }, l), a.opts.unevaluated && h !== !0 ? t.assign((0, Fn._)`${h}[${y}]`, !0) : !m && !a.allErrors && t.if((0, Fn.not)(l), () => t.break());
        });
      });
    }
  }
};
go.default = p$;
var _o = {};
Object.defineProperty(_o, "__esModule", { value: !0 });
const $$ = C, y$ = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, $$.alwaysValidSchema)(n, r)) {
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
_o.default = y$;
var vo = {};
Object.defineProperty(vo, "__esModule", { value: !0 });
const g$ = re, _$ = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: g$.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
vo.default = _$;
var wo = {};
Object.defineProperty(wo, "__esModule", { value: !0 });
const ss = Q, v$ = C, w$ = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, ss._)`{passingSchemas: ${e.passing}}`
}, E$ = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: w$,
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
        (0, v$.alwaysValidSchema)(s, l) ? t.var(c, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, ss._)`${c} && ${o}`).assign(o, !1).assign(u, (0, ss._)`[${u}, ${h}]`).else(), t.if(c, () => {
          t.assign(o, !0), t.assign(u, h), E && e.mergeEvaluated(E, ss.Name);
        });
      });
    }
  }
};
wo.default = E$;
var Eo = {};
Object.defineProperty(Eo, "__esModule", { value: !0 });
const b$ = C, S$ = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, b$.alwaysValidSchema)(n, a))
        return;
      const u = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(u);
    });
  }
};
Eo.default = S$;
var bo = {};
Object.defineProperty(bo, "__esModule", { value: !0 });
const ms = Q, bu = C, P$ = {
  message: ({ params: e }) => (0, ms.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, ms._)`{failingKeyword: ${e.ifClause}}`
}, N$ = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: P$,
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
    } else s ? t.if(u, d("then")) : t.if((0, ms.not)(u), d("else"));
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
        t.assign(o, u), e.mergeValidEvaluated(E, o), h ? t.assign(h, (0, ms._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function uc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, bu.alwaysValidSchema)(e, r);
}
bo.default = N$;
var So = {};
Object.defineProperty(So, "__esModule", { value: !0 });
const R$ = C, O$ = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, R$.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
So.default = O$;
Object.defineProperty(fo, "__esModule", { value: !0 });
const T$ = Br, I$ = ho, j$ = Wr, A$ = mo, k$ = po, C$ = Ns, D$ = $o, M$ = Rs, V$ = yo, L$ = go, F$ = _o, z$ = vo, U$ = wo, q$ = Eo, K$ = bo, G$ = So;
function H$(e = !1) {
  const t = [
    // any
    F$.default,
    z$.default,
    U$.default,
    q$.default,
    K$.default,
    G$.default,
    // object
    D$.default,
    M$.default,
    C$.default,
    V$.default,
    L$.default
  ];
  return e ? t.push(I$.default, A$.default) : t.push(T$.default, j$.default), t.push(k$.default), t;
}
fo.default = H$;
var Po = {}, Xr = {};
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.dynamicAnchor = void 0;
const Js = Q, B$ = qe, dc = ke, W$ = bt, X$ = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => Su(e, e.schema)
};
function Su(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, Js._)`${B$.default.dynamicAnchors}${(0, Js.getProperty)(t)}`, a = n.errSchemaPath === "#" ? n.validateName : J$(e);
  r.if((0, Js._)`!${s}`, () => r.assign(s, a));
}
Xr.dynamicAnchor = Su;
function J$(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: a, localRefs: o, meta: u } = t.root, { schemaId: c } = n.opts, d = new dc.SchemaEnv({ schema: r, schemaId: c, root: s, baseId: a, localRefs: o, meta: u });
  return dc.compileSchema.call(n, d), (0, W$.getValidate)(e, d);
}
Xr.default = X$;
var Jr = {};
Object.defineProperty(Jr, "__esModule", { value: !0 });
Jr.dynamicRef = void 0;
const fc = Q, Y$ = qe, hc = bt, Q$ = {
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
      const d = r.let("_v", (0, fc._)`${Y$.default.dynamicAnchors}${(0, fc.getProperty)(a)}`);
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
Jr.dynamicRef = Pu;
Jr.default = Q$;
var No = {};
Object.defineProperty(No, "__esModule", { value: !0 });
const Z$ = Xr, x$ = C, ey = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, Z$.dynamicAnchor)(e, "") : (0, x$.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
No.default = ey;
var Ro = {};
Object.defineProperty(Ro, "__esModule", { value: !0 });
const ty = Jr, ry = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, ty.dynamicRef)(e, e.schema)
};
Ro.default = ry;
Object.defineProperty(Po, "__esModule", { value: !0 });
const ny = Xr, sy = Jr, ay = No, oy = Ro, iy = [ny.default, sy.default, ay.default, oy.default];
Po.default = iy;
var Oo = {}, To = {};
Object.defineProperty(To, "__esModule", { value: !0 });
const mc = Ns, cy = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: mc.error,
  code: (e) => (0, mc.validatePropertyDeps)(e)
};
To.default = cy;
var Io = {};
Object.defineProperty(Io, "__esModule", { value: !0 });
const ly = Ns, uy = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, ly.validateSchemaDeps)(e)
};
Io.default = uy;
var jo = {};
Object.defineProperty(jo, "__esModule", { value: !0 });
const dy = C, fy = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, dy.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
jo.default = fy;
Object.defineProperty(Oo, "__esModule", { value: !0 });
const hy = To, my = Io, py = jo, $y = [hy.default, my.default, py.default];
Oo.default = $y;
var Ao = {}, ko = {};
Object.defineProperty(ko, "__esModule", { value: !0 });
const At = Q, pc = C, yy = qe, gy = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, At._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, _y = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: gy,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: u } = a;
    u instanceof At.Name ? t.if((0, At._)`${u} !== true`, () => t.forIn("key", n, (h) => t.if(d(u, h), () => c(h)))) : u !== !0 && t.forIn("key", n, (h) => u === void 0 ? c(h) : t.if(l(u, h), () => c(h))), a.props = !0, e.ok((0, At._)`${s} === ${yy.default.errors}`);
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
        }, E), o || t.if((0, At.not)(E), () => t.break());
      }
    }
    function d(h, E) {
      return (0, At._)`!${h} || !${h}[${E}]`;
    }
    function l(h, E) {
      const g = [];
      for (const w in h)
        h[w] === !0 && g.push((0, At._)`${E} !== ${w}`);
      return (0, At.and)(...g);
    }
  }
};
ko.default = _y;
var Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
const ir = Q, $c = C, vy = {
  message: ({ params: { len: e } }) => (0, ir.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, ir._)`{limit: ${e}}`
}, wy = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: vy,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, a = s.items || 0;
    if (a === !0)
      return;
    const o = t.const("len", (0, ir._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: a }), e.fail((0, ir._)`${o} > ${a}`);
    else if (typeof r == "object" && !(0, $c.alwaysValidSchema)(s, r)) {
      const c = t.var("valid", (0, ir._)`${o} <= ${a}`);
      t.if((0, ir.not)(c), () => u(c, a)), e.ok(c);
    }
    s.items = !0;
    function u(c, d) {
      t.forRange("i", d, o, (l) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: $c.Type.Num }, c), s.allErrors || t.if((0, ir.not)(c), () => t.break());
      });
    }
  }
};
Co.default = wy;
Object.defineProperty(Ao, "__esModule", { value: !0 });
const Ey = ko, by = Co, Sy = [Ey.default, by.default];
Ao.default = Sy;
var Do = {}, Mo = {};
Object.defineProperty(Mo, "__esModule", { value: !0 });
const me = Q, Py = {
  message: ({ schemaCode: e }) => (0, me.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, me._)`{format: ${e}}`
}, Ny = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Py,
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
Mo.default = Ny;
Object.defineProperty(Do, "__esModule", { value: !0 });
const Ry = Mo, Oy = [Ry.default];
Do.default = Oy;
var qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.contentVocabulary = qr.metadataVocabulary = void 0;
qr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
qr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Ya, "__esModule", { value: !0 });
const Ty = Qa, Iy = xa, jy = fo, Ay = Po, ky = Oo, Cy = Ao, Dy = Do, yc = qr, My = [
  Ay.default,
  Ty.default,
  Iy.default,
  (0, jy.default)(!0),
  Dy.default,
  yc.metadataVocabulary,
  yc.contentVocabulary,
  ky.default,
  Cy.default
];
Ya.default = My;
var Vo = {}, Os = {};
Object.defineProperty(Os, "__esModule", { value: !0 });
Os.DiscrError = void 0;
var gc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(gc || (Os.DiscrError = gc = {}));
Object.defineProperty(Vo, "__esModule", { value: !0 });
const Nr = Q, va = Os, _c = ke, Vy = Hr, Ly = C, Fy = {
  message: ({ params: { discrError: e, tagName: t } }) => e === va.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, Nr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, zy = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Fy,
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
        if (O != null && O.$ref && !(0, Ly.schemaHasRulesButRef)(O, a.self.RULES)) {
          const X = O.$ref;
          if (O = _c.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, X), O instanceof _c.SchemaEnv && (O = O.schema), O === void 0)
            throw new Vy.default(a.opts.uriResolver, a.baseId, X);
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
Vo.default = zy;
var Lo = {};
const Uy = "https://json-schema.org/draft/2020-12/schema", qy = "https://json-schema.org/draft/2020-12/schema", Ky = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Gy = "meta", Hy = "Core and Validation specifications meta-schema", By = [
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
], Wy = [
  "object",
  "boolean"
], Xy = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", Jy = {
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
}, Yy = {
  $schema: Uy,
  $id: qy,
  $vocabulary: Ky,
  $dynamicAnchor: Gy,
  title: Hy,
  allOf: By,
  type: Wy,
  $comment: Xy,
  properties: Jy
}, Qy = "https://json-schema.org/draft/2020-12/schema", Zy = "https://json-schema.org/draft/2020-12/meta/applicator", xy = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, e0 = "meta", t0 = "Applicator vocabulary meta-schema", r0 = [
  "object",
  "boolean"
], n0 = {
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
}, s0 = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, a0 = {
  $schema: Qy,
  $id: Zy,
  $vocabulary: xy,
  $dynamicAnchor: e0,
  title: t0,
  type: r0,
  properties: n0,
  $defs: s0
}, o0 = "https://json-schema.org/draft/2020-12/schema", i0 = "https://json-schema.org/draft/2020-12/meta/unevaluated", c0 = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, l0 = "meta", u0 = "Unevaluated applicator vocabulary meta-schema", d0 = [
  "object",
  "boolean"
], f0 = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, h0 = {
  $schema: o0,
  $id: i0,
  $vocabulary: c0,
  $dynamicAnchor: l0,
  title: u0,
  type: d0,
  properties: f0
}, m0 = "https://json-schema.org/draft/2020-12/schema", p0 = "https://json-schema.org/draft/2020-12/meta/content", $0 = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, y0 = "meta", g0 = "Content vocabulary meta-schema", _0 = [
  "object",
  "boolean"
], v0 = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, w0 = {
  $schema: m0,
  $id: p0,
  $vocabulary: $0,
  $dynamicAnchor: y0,
  title: g0,
  type: _0,
  properties: v0
}, E0 = "https://json-schema.org/draft/2020-12/schema", b0 = "https://json-schema.org/draft/2020-12/meta/core", S0 = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, P0 = "meta", N0 = "Core vocabulary meta-schema", R0 = [
  "object",
  "boolean"
], O0 = {
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
}, T0 = {
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
}, I0 = {
  $schema: E0,
  $id: b0,
  $vocabulary: S0,
  $dynamicAnchor: P0,
  title: N0,
  type: R0,
  properties: O0,
  $defs: T0
}, j0 = "https://json-schema.org/draft/2020-12/schema", A0 = "https://json-schema.org/draft/2020-12/meta/format-annotation", k0 = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, C0 = "meta", D0 = "Format vocabulary meta-schema for annotation results", M0 = [
  "object",
  "boolean"
], V0 = {
  format: {
    type: "string"
  }
}, L0 = {
  $schema: j0,
  $id: A0,
  $vocabulary: k0,
  $dynamicAnchor: C0,
  title: D0,
  type: M0,
  properties: V0
}, F0 = "https://json-schema.org/draft/2020-12/schema", z0 = "https://json-schema.org/draft/2020-12/meta/meta-data", U0 = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, q0 = "meta", K0 = "Meta-data vocabulary meta-schema", G0 = [
  "object",
  "boolean"
], H0 = {
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
}, B0 = {
  $schema: F0,
  $id: z0,
  $vocabulary: U0,
  $dynamicAnchor: q0,
  title: K0,
  type: G0,
  properties: H0
}, W0 = "https://json-schema.org/draft/2020-12/schema", X0 = "https://json-schema.org/draft/2020-12/meta/validation", J0 = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, Y0 = "meta", Q0 = "Validation vocabulary meta-schema", Z0 = [
  "object",
  "boolean"
], x0 = {
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
}, eg = {
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
}, tg = {
  $schema: W0,
  $id: X0,
  $vocabulary: J0,
  $dynamicAnchor: Y0,
  title: Q0,
  type: Z0,
  properties: x0,
  $defs: eg
};
Object.defineProperty(Lo, "__esModule", { value: !0 });
const rg = Yy, ng = a0, sg = h0, ag = w0, og = I0, ig = L0, cg = B0, lg = tg, ug = ["/properties"];
function dg(e) {
  return [
    rg,
    ng,
    sg,
    ag,
    og,
    t(this, ig),
    cg,
    t(this, lg)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, ug) : n;
  }
}
Lo.default = dg;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = bl, n = Ya, s = Vo, a = Lo, o = "https://json-schema.org/draft/2020-12/schema";
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
  var c = tt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var d = Q;
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
  var l = Rn;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return l.default;
  } });
  var h = Hr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(ha, ha.exports);
var fg = ha.exports, wa = { exports: {} }, Nu = {};
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
    const [ae, H] = F.split(h), [ce, k] = G.split(h), j = o(ae, ce);
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
var Ru = {}, Ea = { exports: {} }, Ou = {}, rt = {}, Kr = {}, Tn = {}, te = {}, Sn = {};
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
var ba = {};
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
})(ba);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Sn, r = ba;
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
      const L = this._scope.toName(i);
      return this._for(new R(I, L, f, b), () => T(L));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, T = r.varKinds.const) {
      const I = this._scope.toName(i);
      if (this.opts.es5) {
        const L = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${L}.length`, (V) => {
          this.var(I, (0, t._)`${L}[${V}]`), b(I);
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
    return new t._Code($._items.reduce((I, L) => (L instanceof t.Name && (L = b(L)), L instanceof t._Code ? I.push(...L._items) : I.push(L), I), []));
    function b(I) {
      const L = f[I.str];
      return L === void 0 || i[I.str] !== 1 ? I : (delete i[I.str], L);
    }
    function T(I) {
      return I instanceof t._Code && I._items.some((L) => L instanceof t.Name && i[L.str] === 1 && f[L.str] !== void 0);
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
const ie = te, hg = Sn;
function mg(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
D.toHash = mg;
function pg(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Tu(e, t), !Iu(t, e.self.RULES.all));
}
D.alwaysValidSchema = pg;
function Tu(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || ku(e, `unknown keyword: "${a}"`);
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
function $g(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
D.schemaHasRulesButRef = $g;
function yg({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ie._)`${r}`;
  }
  return (0, ie._)`${e}${t}${(0, ie.getProperty)(n)}`;
}
D.schemaRefOrVal = yg;
function gg(e) {
  return ju(decodeURIComponent(e));
}
D.unescapeFragment = gg;
function _g(e) {
  return encodeURIComponent(Fo(e));
}
D.escapeFragment = _g;
function Fo(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
D.escapeJsonPointer = Fo;
function ju(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
D.unescapeJsonPointer = ju;
function vg(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
D.eachItem = vg;
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
    resultToName: Au
  }),
  items: vc({
    mergeNames: (e, t, r) => e.if((0, ie._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ie._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ie._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ie._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Au(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ie._)`{}`);
  return t !== void 0 && zo(e, r, t), r;
}
D.evaluatedPropsToName = Au;
function zo(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ie._)`${t}${(0, ie.getProperty)(n)}`, !0));
}
D.setEvaluated = zo;
const wc = {};
function wg(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: wc[t.code] || (wc[t.code] = new hg._Code(t.code))
  });
}
D.useFunc = wg;
var Sa;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Sa || (D.Type = Sa = {}));
function Eg(e, t, r) {
  if (e instanceof ie.Name) {
    const n = t === Sa.Num;
    return r ? n ? (0, ie._)`"[" + ${e} + "]"` : (0, ie._)`"['" + ${e} + "']"` : n ? (0, ie._)`"/" + ${e}` : (0, ie._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ie.getProperty)(e).toString() : "/" + Fo(e);
}
D.getErrorPath = Eg;
function ku(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
D.checkStrictMode = ku;
var mt = {};
Object.defineProperty(mt, "__esModule", { value: !0 });
const Re = te, bg = {
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
mt.default = bg;
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
})(Tn);
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.boolOrEmptySchema = Kr.topBoolOrEmptySchema = void 0;
const Sg = Tn, Pg = te, Ng = mt, Rg = {
  message: "boolean schema is false"
};
function Og(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Cu(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Ng.default.data) : (t.assign((0, Pg._)`${n}.errors`, null), t.return(!0));
}
Kr.topBoolOrEmptySchema = Og;
function Tg(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Cu(e)) : r.var(t, !0);
}
Kr.boolOrEmptySchema = Tg;
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
  (0, Sg.reportError)(s, Rg, void 0, t);
}
var ge = {}, gr = {};
Object.defineProperty(gr, "__esModule", { value: !0 });
gr.getRules = gr.isJSONType = void 0;
const Ig = ["string", "number", "integer", "boolean", "null", "object", "array"], jg = new Set(Ig);
function Ag(e) {
  return typeof e == "string" && jg.has(e);
}
gr.isJSONType = Ag;
function kg() {
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
gr.getRules = kg;
var wt = {};
Object.defineProperty(wt, "__esModule", { value: !0 });
wt.shouldUseRule = wt.shouldUseGroup = wt.schemaHasRulesForType = void 0;
function Cg({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Du(e, n);
}
wt.schemaHasRulesForType = Cg;
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
const Dg = gr, Mg = wt, Vg = Tn, x = te, Vu = D;
var Mr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Mr || (ge.DataType = Mr = {}));
function Lg(e) {
  const t = Lu(e.type);
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
ge.getSchemaTypes = Lg;
function Lu(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(Dg.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ge.getJSONTypes = Lu;
function Fg(e, t) {
  const { gen: r, data: n, opts: s } = e, a = zg(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, Mg.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const u = Uo(t, n, s.strictNumbers, Mr.Wrong);
    r.if(u, () => {
      a.length ? Ug(e, t, a) : qo(e);
    });
  }
  return o;
}
ge.coerceAndCheckDataType = Fg;
const Fu = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function zg(e, t) {
  return t ? e.filter((r) => Fu.has(r) || t === "array" && r === "array") : [];
}
function Ug(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, x._)`typeof ${s}`), u = n.let("coerced", (0, x._)`undefined`);
  a.coerceTypes === "array" && n.if((0, x._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, x._)`${s}[0]`).assign(o, (0, x._)`typeof ${s}`).if(Uo(t, s, a.strictNumbers), () => n.assign(u, s))), n.if((0, x._)`${u} !== undefined`);
  for (const d of r)
    (Fu.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), qo(e), n.endIf(), n.if((0, x._)`${u} !== undefined`, () => {
    n.assign(s, u), qg(e, u);
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
function qg({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, x._)`${t} !== undefined`, () => e.assign((0, x._)`${t}[${r}]`, n));
}
function Pa(e, t, r, n = Mr.Correct) {
  const s = n === Mr.Correct ? x.operators.EQ : x.operators.NEQ;
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
  return n === Mr.Correct ? a : (0, x.not)(a);
  function o(u = x.nil) {
    return (0, x.and)((0, x._)`typeof ${t} == "number"`, u, r ? (0, x._)`isFinite(${t})` : x.nil);
  }
}
ge.checkDataType = Pa;
function Uo(e, t, r, n) {
  if (e.length === 1)
    return Pa(e[0], t, r, n);
  let s;
  const a = (0, Vu.toHash)(e);
  if (a.array && a.object) {
    const o = (0, x._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, x._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = x.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, x.and)(s, Pa(o, t, r, n));
  return s;
}
ge.checkDataTypes = Uo;
const Kg = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, x._)`{type: ${e}}` : (0, x._)`{type: ${t}}`
};
function qo(e) {
  const t = Gg(e);
  (0, Vg.reportError)(t, Kg);
}
ge.reportTypeError = qo;
function Gg(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Vu.schemaRefOrVal)(e, n, "type");
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
var Ts = {};
Object.defineProperty(Ts, "__esModule", { value: !0 });
Ts.assignDefaults = void 0;
const br = te, Hg = D;
function Bg(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Ec(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => Ec(e, a, s.default));
}
Ts.assignDefaults = Bg;
function Ec(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const u = (0, br._)`${a}${(0, br.getProperty)(t)}`;
  if (s) {
    (0, Hg.checkStrictMode)(e, `default is ignored for: ${u}`);
    return;
  }
  let c = (0, br._)`${u} === undefined`;
  o.useDefaults === "empty" && (c = (0, br._)`${c} || ${u} === null || ${u} === ""`), n.if(c, (0, br._)`${u} = ${(0, br.stringify)(r)}`);
}
var ft = {}, ne = {};
Object.defineProperty(ne, "__esModule", { value: !0 });
ne.validateUnion = ne.validateArray = ne.usePattern = ne.callValidateCode = ne.schemaProperties = ne.allSchemaProperties = ne.noPropertyInData = ne.propertyInData = ne.isOwnProperty = ne.hasPropFunc = ne.reportMissingProp = ne.checkMissingProp = ne.checkReportMissingProp = void 0;
const ue = te, Ko = D, Tt = mt, Wg = D;
function Xg(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Ho(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, ue._)`${t}` }, !0), e.error();
  });
}
ne.checkReportMissingProp = Xg;
function Jg({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, ue.or)(...n.map((a) => (0, ue.and)(Ho(e, t, a, r.ownProperties), (0, ue._)`${s} = ${a}`)));
}
ne.checkMissingProp = Jg;
function Yg(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ne.reportMissingProp = Yg;
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
function Qg(e, t, r, n) {
  const s = (0, ue._)`${t}${(0, ue.getProperty)(r)} !== undefined`;
  return n ? (0, ue._)`${s} && ${Go(e, t, r)}` : s;
}
ne.propertyInData = Qg;
function Ho(e, t, r, n) {
  const s = (0, ue._)`${t}${(0, ue.getProperty)(r)} === undefined`;
  return n ? (0, ue.or)(s, (0, ue.not)(Go(e, t, r))) : s;
}
ne.noPropertyInData = Ho;
function Uu(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ne.allSchemaProperties = Uu;
function Zg(e, t) {
  return Uu(t).filter((r) => !(0, Ko.alwaysValidSchema)(e, t[r]));
}
ne.schemaProperties = Zg;
function xg({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, u, c, d) {
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
ne.callValidateCode = xg;
const e_ = (0, ue._)`new RegExp`;
function t_({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, ue._)`${s.code === "new RegExp" ? e_ : (0, Wg.useFunc)(e, s)}(${r}, ${n})`
  });
}
ne.usePattern = t_;
function r_(e) {
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
ne.validateArray = r_;
function n_(e) {
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
ne.validateUnion = n_;
Object.defineProperty(ft, "__esModule", { value: !0 });
ft.validateKeywordUsage = ft.validSchemaType = ft.funcKeywordCode = ft.macroKeywordCode = void 0;
const Ae = te, cr = mt, s_ = ne, a_ = Tn;
function o_(e, t) {
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
ft.macroKeywordCode = o_;
function i_(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: u, it: c } = e;
  l_(c, t);
  const d = !u && t.compile ? t.compile.call(c.self, a, o, c) : t.validate, l = qu(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      _(), t.modifying && bc(e), y(() => e.error());
    else {
      const m = t.async ? g() : w();
      t.modifying && bc(e), y(() => c_(e, m));
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
    const v = c.opts.passContext ? cr.default.this : cr.default.self, N = !("compile" in t && !u || t.schema === !1);
    n.assign(h, (0, Ae._)`${m}${(0, s_.callValidateCode)(e, l, v, N)}`, t.modifying);
  }
  function y(m) {
    var v;
    n.if((0, Ae.not)((v = t.valid) !== null && v !== void 0 ? v : h), m);
  }
}
ft.funcKeywordCode = i_;
function bc(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Ae._)`${n.parentData}[${n.parentDataProperty}]`));
}
function c_(e, t) {
  const { gen: r } = e;
  r.if((0, Ae._)`Array.isArray(${t})`, () => {
    r.assign(cr.default.vErrors, (0, Ae._)`${cr.default.vErrors} === null ? ${t} : ${cr.default.vErrors}.concat(${t})`).assign(cr.default.errors, (0, Ae._)`${cr.default.vErrors}.length`), (0, a_.extendErrors)(e);
  }, () => e.error());
}
function l_({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function qu(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Ae.stringify)(r) });
}
function u_(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
ft.validSchemaType = u_;
function d_({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
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
ft.validateKeywordUsage = d_;
var zt = {};
Object.defineProperty(zt, "__esModule", { value: !0 });
zt.extendSubschemaMode = zt.extendSubschemaData = zt.getSubschema = void 0;
const ut = te, Ku = D;
function f_(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
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
zt.getSubschema = f_;
function h_(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: u } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: l, opts: h } = t, E = u.let("data", (0, ut._)`${t.data}${(0, ut.getProperty)(r)}`, !0);
    c(E), e.errorPath = (0, ut.str)`${d}${(0, Ku.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, ut._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
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
zt.extendSubschemaData = h_;
function m_(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
zt.extendSubschemaMode = m_;
var be = {}, Gu = { exports: {} }, Lt = Gu.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  as(t, n, s, e, "", e);
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
function as(e, t, r, n, s, a, o, u, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, u, c, d);
    for (var l in n) {
      var h = n[l];
      if (Array.isArray(h)) {
        if (l in Lt.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            as(e, t, r, h[E], s + "/" + l + "/" + E, a, s, l, n, E);
      } else if (l in Lt.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            as(e, t, r, h[g], s + "/" + l + "/" + p_(g), a, s, l, n, g);
      } else (l in Lt.keywords || e.allKeys && !(l in Lt.skipKeywords)) && as(e, t, r, h, s + "/" + l, a, s, l, n);
    }
    r(n, s, a, o, u, c, d);
  }
}
function p_(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var $_ = Gu.exports;
Object.defineProperty(be, "__esModule", { value: !0 });
be.getSchemaRefs = be.resolveUrl = be.normalizeId = be._getFullPath = be.getFullPath = be.inlineRef = void 0;
const y_ = D, g_ = Es, __ = $_, v_ = /* @__PURE__ */ new Set([
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
function w_(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Na(e) : t ? Hu(e) <= t : !1;
}
be.inlineRef = w_;
const E_ = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Na(e) {
  for (const t in e) {
    if (E_.has(t))
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
    if (t++, !v_.has(r) && (typeof e[r] == "object" && (0, y_.eachItem)(e[r], (n) => t += Hu(n)), t === 1 / 0))
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
const b_ = /#\/?$/;
function Vr(e) {
  return e ? e.replace(b_, "") : "";
}
be.normalizeId = Vr;
function S_(e, t, r) {
  return r = Vr(r), e.resolve(t, r);
}
be.resolveUrl = S_;
const P_ = /^[a-z_][-a-z0-9._]*$/i;
function N_(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Vr(e[r] || t), a = { "": s }, o = Bu(n, s, !1), u = {}, c = /* @__PURE__ */ new Set();
  return __(e, { allKeys: !0 }, (h, E, g, w) => {
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
        if (!P_.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), u;
  function d(h, E, g) {
    if (E !== void 0 && !g_(h, E))
      throw l(g);
  }
  function l(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
be.getSchemaRefs = N_;
Object.defineProperty(rt, "__esModule", { value: !0 });
rt.getData = rt.KeywordCxt = rt.validateFunctionCode = void 0;
const Xu = Kr, Sc = ge, Bo = wt, ps = ge, R_ = Ts, $n = ft, Ys = zt, q = te, W = mt, O_ = be, Et = D, an = Tn;
function T_(e) {
  if (Qu(e) && (Zu(e), Yu(e))) {
    A_(e);
    return;
  }
  Ju(e, () => (0, Xu.topBoolOrEmptySchema)(e));
}
rt.validateFunctionCode = T_;
function Ju({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, q._)`${W.default.data}, ${W.default.valCxt}`, n.$async, () => {
    e.code((0, q._)`"use strict"; ${Pc(r, s)}`), j_(e, s), e.code(a);
  }) : e.func(t, (0, q._)`${W.default.data}, ${I_(s)}`, n.$async, () => e.code(Pc(r, s)).code(a));
}
function I_(e) {
  return (0, q._)`{${W.default.instancePath}="", ${W.default.parentData}, ${W.default.parentDataProperty}, ${W.default.rootData}=${W.default.data}${e.dynamicRef ? (0, q._)`, ${W.default.dynamicAnchors}={}` : q.nil}}={}`;
}
function j_(e, t) {
  e.if(W.default.valCxt, () => {
    e.var(W.default.instancePath, (0, q._)`${W.default.valCxt}.${W.default.instancePath}`), e.var(W.default.parentData, (0, q._)`${W.default.valCxt}.${W.default.parentData}`), e.var(W.default.parentDataProperty, (0, q._)`${W.default.valCxt}.${W.default.parentDataProperty}`), e.var(W.default.rootData, (0, q._)`${W.default.valCxt}.${W.default.rootData}`), t.dynamicRef && e.var(W.default.dynamicAnchors, (0, q._)`${W.default.valCxt}.${W.default.dynamicAnchors}`);
  }, () => {
    e.var(W.default.instancePath, (0, q._)`""`), e.var(W.default.parentData, (0, q._)`undefined`), e.var(W.default.parentDataProperty, (0, q._)`undefined`), e.var(W.default.rootData, W.default.data), t.dynamicRef && e.var(W.default.dynamicAnchors, (0, q._)`{}`);
  });
}
function A_(e) {
  const { schema: t, opts: r, gen: n } = e;
  Ju(e, () => {
    r.$comment && t.$comment && ed(e), V_(e), n.let(W.default.vErrors, null), n.let(W.default.errors, 0), r.unevaluated && k_(e), xu(e), z_(e);
  });
}
function k_(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, q._)`${r}.evaluated`), t.if((0, q._)`${e.evaluated}.dynamicProps`, () => t.assign((0, q._)`${e.evaluated}.props`, (0, q._)`undefined`)), t.if((0, q._)`${e.evaluated}.dynamicItems`, () => t.assign((0, q._)`${e.evaluated}.items`, (0, q._)`undefined`));
}
function Pc(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, q._)`/*# sourceURL=${r} */` : q.nil;
}
function C_(e, t) {
  if (Qu(e) && (Zu(e), Yu(e))) {
    D_(e, t);
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
function D_(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && ed(e), L_(e), F_(e);
  const a = n.const("_errs", W.default.errors);
  xu(e, a), n.var(t, (0, q._)`${a} === ${W.default.errors}`);
}
function Zu(e) {
  (0, Et.checkUnknownRules)(e), M_(e);
}
function xu(e, t) {
  if (e.opts.jtd)
    return Nc(e, [], !1, t);
  const r = (0, Sc.getSchemaTypes)(e.schema), n = (0, Sc.coerceAndCheckDataType)(e, r);
  Nc(e, r, !n, t);
}
function M_(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, Et.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function V_(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, Et.checkStrictMode)(e, "default is ignored in the schema root");
}
function L_(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, O_.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function F_(e) {
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
function z_(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, q._)`${W.default.errors} === 0`, () => t.return(W.default.data), () => t.throw((0, q._)`new ${s}(${W.default.vErrors})`)) : (t.assign((0, q._)`${n}.errors`, W.default.vErrors), a.unevaluated && U_(e), t.return((0, q._)`${W.default.errors} === 0`));
}
function U_({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof q.Name && e.assign((0, q._)`${t}.props`, r), n instanceof q.Name && e.assign((0, q._)`${t}.items`, n);
}
function Nc(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: u, opts: c, self: d } = e, { RULES: l } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, Et.schemaHasRulesButRef)(a, l))) {
    s.block(() => nd(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || q_(e, t), s.block(() => {
    for (const E of l.rules)
      h(E);
    h(l.post);
  });
  function h(E) {
    (0, Bo.shouldUseGroup)(a, E) && (E.type ? (s.if((0, ps.checkDataType)(E.type, o, c.strictNumbers)), Rc(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, ps.reportTypeError)(e)), s.endIf()) : Rc(e, E), u || s.if((0, q._)`${W.default.errors} === ${n || 0}`));
  }
}
function Rc(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, R_.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, Bo.shouldUseRule)(n, a) && nd(e, a.keyword, a.definition, t.type);
  });
}
function q_(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (K_(e, t), e.opts.allowUnionTypes || G_(e, t), H_(e, e.dataTypes));
}
function K_(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      td(e.dataTypes, r) || Wo(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), W_(e, t);
  }
}
function G_(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Wo(e, "use allowUnionTypes to allow union type keyword");
}
function H_(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Bo.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => B_(t, o)) && Wo(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function B_(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function td(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function W_(e, t) {
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
    if ((0, $n.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Et.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", sd(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, $n.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
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
    (t ? an.reportExtraError : an.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, an.reportError)(this, this.def.$dataError || an.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, an.resetErrorsCount)(this.gen, this.errsCount);
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
        return (0, q._)`${(0, ps.checkDataTypes)(c, r, a.opts.strictNumbers, ps.DataType.Wrong)}`;
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
    const n = (0, Ys.getSubschema)(this.it, t);
    (0, Ys.extendSubschemaData)(n, this.it, t), (0, Ys.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return C_(s, r), s;
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
rt.KeywordCxt = rd;
function nd(e, t, r, n) {
  const s = new rd(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, $n.funcKeywordCode)(s, r) : "macro" in r ? (0, $n.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, $n.funcKeywordCode)(s, r);
}
const X_ = /^\/(?:[^~]|~0|~1)*$/, J_ = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function sd(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return W.default.rootData;
  if (e[0] === "/") {
    if (!X_.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = W.default.rootData;
  } else {
    const d = J_.exec(e);
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
rt.getData = sd;
var zn = {}, Oc;
function Xo() {
  if (Oc) return zn;
  Oc = 1, Object.defineProperty(zn, "__esModule", { value: !0 });
  class e extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return zn.default = e, zn;
}
var Yr = {};
Object.defineProperty(Yr, "__esModule", { value: !0 });
const Qs = be;
class Y_ extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Qs.resolveUrl)(t, r, n), this.missingSchema = (0, Qs.normalizeId)((0, Qs.getFullPath)(t, this.missingRef));
  }
}
Yr.default = Y_;
var Fe = {};
Object.defineProperty(Fe, "__esModule", { value: !0 });
Fe.resolveSchema = Fe.getCompilingSchema = Fe.resolveRef = Fe.compileSchema = Fe.SchemaEnv = void 0;
const Je = te, Q_ = Xo(), nr = mt, xe = be, Tc = D, Z_ = rt;
class Is {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, xe.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Fe.SchemaEnv = Is;
function Jo(e) {
  const t = ad.call(this, e);
  if (t)
    return t;
  const r = (0, xe.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new Je.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let u;
  e.$async && (u = o.scopeValue("Error", {
    ref: Q_.default,
    code: (0, Je._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: nr.default.data,
    parentData: nr.default.parentData,
    parentDataProperty: nr.default.parentDataProperty,
    dataNames: [nr.default.data],
    dataPathArr: [Je.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Je.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: u,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Je.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Je._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, Z_.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    l = `${o.scopeRefs(nr.default.scope)}return ${h}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const g = new Function(`${nr.default.self}`, `${nr.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: _ } = d;
      g.evaluated = {
        props: w instanceof Je.Name ? void 0 : w,
        items: _ instanceof Je.Name ? void 0 : _,
        dynamicProps: w instanceof Je.Name,
        dynamicItems: _ instanceof Je.Name
      }, g.source && (g.source.evaluated = (0, Je.stringify)(g.evaluated));
    }
    return e.validate = g, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), h;
  } finally {
    this._compilations.delete(e);
  }
}
Fe.compileSchema = Jo;
function x_(e, t, r) {
  var n;
  r = (0, xe.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = rv.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: u } = this.opts;
    o && (a = new Is({ schema: o, schemaId: u, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = ev.call(this, a);
}
Fe.resolveRef = x_;
function ev(e) {
  return (0, xe.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Jo.call(this, e);
}
function ad(e) {
  for (const t of this._compilations)
    if (tv(t, e))
      return t;
}
Fe.getCompilingSchema = ad;
function tv(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function rv(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || js.call(this, e, t);
}
function js(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, xe._getFullPath)(this.opts.uriResolver, r);
  let s = (0, xe.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Zs.call(this, r, e);
  const a = (0, xe.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const u = js.call(this, e, o);
    return typeof (u == null ? void 0 : u.schema) != "object" ? void 0 : Zs.call(this, r, u);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Jo.call(this, o), a === (0, xe.normalizeId)(t)) {
      const { schema: u } = o, { schemaId: c } = this.opts, d = u[c];
      return d && (s = (0, xe.resolveUrl)(this.opts.uriResolver, s, d)), new Is({ schema: u, schemaId: c, root: e, baseId: s });
    }
    return Zs.call(this, r, o);
  }
}
Fe.resolveSchema = js;
const nv = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Zs(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const u of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Tc.unescapeFragment)(u)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !nv.has(u) && d && (t = (0, xe.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, Tc.schemaHasRulesButRef)(r, this.RULES)) {
    const u = (0, xe.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = js.call(this, n, u);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new Is({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const sv = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", av = "Meta-schema for $data reference (JSON AnySchema extension proposal)", ov = "object", iv = [
  "$data"
], cv = {
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
}, lv = !1, uv = {
  $id: sv,
  description: av,
  type: ov,
  required: iv,
  properties: cv,
  additionalProperties: lv
};
var Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
const od = pu;
od.code = 'require("ajv/dist/runtime/uri").default';
Yo.default = od;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = rt;
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
  const n = Xo(), s = Yr, a = gr, o = Fe, u = te, c = be, d = ge, l = D, h = uv, E = Yo, g = (P, p) => new RegExp(P, p);
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
    var p, S, $, i, f, b, T, I, L, V, se, ze, qt, Kt, Gt, Ht, Bt, Wt, Xt, Jt, Yt, Qt, Zt, xt, er;
    const Be = P.strict, tr = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, xr = tr === !0 || tr === void 0 ? 1 : tr || 0, en = ($ = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && $ !== void 0 ? $ : g, Fs = (i = P.uriResolver) !== null && i !== void 0 ? i : E.default;
    return {
      strictSchema: (b = (f = P.strictSchema) !== null && f !== void 0 ? f : Be) !== null && b !== void 0 ? b : !0,
      strictNumbers: (I = (T = P.strictNumbers) !== null && T !== void 0 ? T : Be) !== null && I !== void 0 ? I : !0,
      strictTypes: (V = (L = P.strictTypes) !== null && L !== void 0 ? L : Be) !== null && V !== void 0 ? V : "log",
      strictTuples: (ze = (se = P.strictTuples) !== null && se !== void 0 ? se : Be) !== null && ze !== void 0 ? ze : "log",
      strictRequired: (Kt = (qt = P.strictRequired) !== null && qt !== void 0 ? qt : Be) !== null && Kt !== void 0 ? Kt : !1,
      code: P.code ? { ...P.code, optimize: xr, regExp: en } : { optimize: xr, regExp: en },
      loopRequired: (Gt = P.loopRequired) !== null && Gt !== void 0 ? Gt : v,
      loopEnum: (Ht = P.loopEnum) !== null && Ht !== void 0 ? Ht : v,
      meta: (Bt = P.meta) !== null && Bt !== void 0 ? Bt : !0,
      messages: (Wt = P.messages) !== null && Wt !== void 0 ? Wt : !0,
      inlineRefs: (Xt = P.inlineRefs) !== null && Xt !== void 0 ? Xt : !0,
      schemaId: (Jt = P.schemaId) !== null && Jt !== void 0 ? Jt : "$id",
      addUsedSchema: (Yt = P.addUsedSchema) !== null && Yt !== void 0 ? Yt : !0,
      validateSchema: (Qt = P.validateSchema) !== null && Qt !== void 0 ? Qt : !0,
      validateFormats: (Zt = P.validateFormats) !== null && Zt !== void 0 ? Zt : !0,
      unicodeRegExp: (xt = P.unicodeRegExp) !== null && xt !== void 0 ? xt : !0,
      int32range: (er = P.int32range) !== null && er !== void 0 ? er : !0,
      uriResolver: Fs
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
      async function i(V, se) {
        await f.call(this, V.$schema);
        const ze = this._addSchema(V, se);
        return ze.validate || b.call(this, ze);
      }
      async function f(V) {
        V && !this.getSchema(V) && await i.call(this, { $ref: V }, !0);
      }
      async function b(V) {
        try {
          return this._compileSchemaEnv(V);
        } catch (se) {
          if (!(se instanceof s.default))
            throw se;
          return T.call(this, se), await I.call(this, se.missingSchema), b.call(this, V);
        }
      }
      function T({ missingSchema: V, missingRef: se }) {
        if (this.refs[V])
          throw new Error(`AnySchema ${V} is loaded but ${se} cannot be resolved`);
      }
      async function I(V) {
        const se = await L.call(this, V);
        this.refs[V] || await f.call(this, se.$schema), this.refs[V] || this.addSchema(se, V, S);
      }
      async function L(V) {
        const se = this._loading[V];
        if (se)
          return se;
        try {
          return await (this._loading[V] = $(V));
        } finally {
          delete this._loading[V];
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
          const { $data: L } = I.definition, V = b[T];
          L && V && (b[T] = M(V));
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
      const L = c.getSchemaRefs.call(this, p, $);
      return I = new o.SchemaEnv({ schema: p, schemaId: T, meta: S, baseId: $, localRefs: L }), this._cache.set(I.schema, I), f && !$.startsWith("#") && ($ && this._checkUnique($), this.refs[$] = I), i && this.validateSchema(p, !0), I;
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
    p.before ? k.call(this, b, T, p.before) : b.rules.push(T), f.all[P] = T, ($ = p.implements) === null || $ === void 0 || $.forEach((I) => this.addKeyword(I));
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
})(Ou);
var Qo = {}, Zo = {}, xo = {};
Object.defineProperty(xo, "__esModule", { value: !0 });
const dv = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
xo.default = dv;
var _r = {};
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.callRef = _r.getValidate = void 0;
const fv = Yr, Ic = ne, Le = te, Sr = mt, jc = Fe, Un = D, hv = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: u, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const l = jc.resolveRef.call(c, d, s, r);
    if (l === void 0)
      throw new fv.default(n.opts.uriResolver, s, r);
    if (l instanceof jc.SchemaEnv)
      return E(l);
    return g(l);
    function h() {
      if (a === d)
        return os(e, o, a, a.$async);
      const w = t.scopeValue("root", { ref: d });
      return os(e, (0, Le._)`${w}.validate`, d, d.$async);
    }
    function E(w) {
      const _ = id(e, w);
      os(e, _, w, w.$async);
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
function id(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Le._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
_r.getValidate = id;
function os(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: u, opts: c } = a, d = c.passContext ? Sr.default.this : Le.nil;
  n ? l() : h();
  function l() {
    if (!u.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, Le._)`await ${(0, Ic.callValidateCode)(e, t, d)}`), g(t), o || s.assign(w, !0);
    }, (_) => {
      s.if((0, Le._)`!(${_} instanceof ${a.ValidationError})`, () => s.throw(_)), E(_), o || s.assign(w, !1);
    }), e.ok(w);
  }
  function h() {
    e.result((0, Ic.callValidateCode)(e, t, d), () => g(t), () => E(t));
  }
  function E(w) {
    const _ = (0, Le._)`${w}.errors`;
    s.assign(Sr.default.vErrors, (0, Le._)`${Sr.default.vErrors} === null ? ${_} : ${Sr.default.vErrors}.concat(${_})`), s.assign(Sr.default.errors, (0, Le._)`${Sr.default.vErrors}.length`);
  }
  function g(w) {
    var _;
    if (!a.opts.unevaluated)
      return;
    const y = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (a.props !== !0)
      if (y && !y.dynamicProps)
        y.props !== void 0 && (a.props = Un.mergeEvaluated.props(s, y.props, a.props));
      else {
        const m = s.var("props", (0, Le._)`${w}.evaluated.props`);
        a.props = Un.mergeEvaluated.props(s, m, a.props, Le.Name);
      }
    if (a.items !== !0)
      if (y && !y.dynamicItems)
        y.items !== void 0 && (a.items = Un.mergeEvaluated.items(s, y.items, a.items));
      else {
        const m = s.var("items", (0, Le._)`${w}.evaluated.items`);
        a.items = Un.mergeEvaluated.items(s, m, a.items, Le.Name);
      }
  }
}
_r.callRef = os;
_r.default = hv;
Object.defineProperty(Zo, "__esModule", { value: !0 });
const mv = xo, pv = _r, $v = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  mv.default,
  pv.default
];
Zo.default = $v;
var ei = {}, ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
const $s = te, It = $s.operators, ys = {
  maximum: { okStr: "<=", ok: It.LTE, fail: It.GT },
  minimum: { okStr: ">=", ok: It.GTE, fail: It.LT },
  exclusiveMaximum: { okStr: "<", ok: It.LT, fail: It.GTE },
  exclusiveMinimum: { okStr: ">", ok: It.GT, fail: It.LTE }
}, yv = {
  message: ({ keyword: e, schemaCode: t }) => (0, $s.str)`must be ${ys[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, $s._)`{comparison: ${ys[e].okStr}, limit: ${t}}`
}, gv = {
  keyword: Object.keys(ys),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: yv,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, $s._)`${r} ${ys[t].fail} ${n} || isNaN(${r})`);
  }
};
ti.default = gv;
var ri = {};
Object.defineProperty(ri, "__esModule", { value: !0 });
const yn = te, _v = {
  message: ({ schemaCode: e }) => (0, yn.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, yn._)`{multipleOf: ${e}}`
}, vv = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: _v,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), u = a ? (0, yn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, yn._)`${o} !== parseInt(${o})`;
    e.fail$data((0, yn._)`(${n} === 0 || (${o} = ${r}/${n}, ${u}))`);
  }
};
ri.default = vv;
var ni = {}, si = {};
Object.defineProperty(si, "__esModule", { value: !0 });
function cd(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
si.default = cd;
cd.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(ni, "__esModule", { value: !0 });
const lr = te, wv = D, Ev = si, bv = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, lr.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, lr._)`{limit: ${e}}`
}, Sv = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: bv,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? lr.operators.GT : lr.operators.LT, o = s.opts.unicode === !1 ? (0, lr._)`${r}.length` : (0, lr._)`${(0, wv.useFunc)(e.gen, Ev.default)}(${r})`;
    e.fail$data((0, lr._)`${o} ${a} ${n}`);
  }
};
ni.default = Sv;
var ai = {};
Object.defineProperty(ai, "__esModule", { value: !0 });
const Pv = ne, Nv = D, jr = te, Rv = {
  message: ({ schemaCode: e }) => (0, jr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, jr._)`{pattern: ${e}}`
}, Ov = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Rv,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e, u = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, jr._)`new RegExp` : (0, Nv.useFunc)(t, c), l = t.let("valid");
      t.try(() => t.assign(l, (0, jr._)`${d}(${a}, ${u}).test(${r})`), () => t.assign(l, !1)), e.fail$data((0, jr._)`!${l}`);
    } else {
      const c = (0, Pv.usePattern)(e, s);
      e.fail$data((0, jr._)`!${c}.test(${r})`);
    }
  }
};
ai.default = Ov;
var oi = {};
Object.defineProperty(oi, "__esModule", { value: !0 });
const gn = te, Tv = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, gn.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, gn._)`{limit: ${e}}`
}, Iv = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Tv,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? gn.operators.GT : gn.operators.LT;
    e.fail$data((0, gn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
oi.default = Iv;
var ii = {};
Object.defineProperty(ii, "__esModule", { value: !0 });
const on = ne, _n = te, jv = D, Av = {
  message: ({ params: { missingProperty: e } }) => (0, _n.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, _n._)`{missingProperty: ${e}}`
}, kv = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Av,
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
          (0, jv.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(_n.nil, h);
      else
        for (const g of r)
          (0, on.checkReportMissingProp)(e, g);
    }
    function l() {
      const g = t.let("missing");
      if (c || a) {
        const w = t.let("valid", !0);
        e.block$data(w, () => E(g, w)), e.ok(w);
      } else
        t.if((0, on.checkMissingProp)(e, r, g)), (0, on.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, on.noPropertyInData)(t, s, g, u.ownProperties), () => e.error());
      });
    }
    function E(g, w) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(w, (0, on.propertyInData)(t, s, g, u.ownProperties)), t.if((0, _n.not)(w), () => {
          e.error(), t.break();
        });
      }, _n.nil);
    }
  }
};
ii.default = kv;
var ci = {};
Object.defineProperty(ci, "__esModule", { value: !0 });
const vn = te, Cv = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, vn.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, vn._)`{limit: ${e}}`
}, Dv = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Cv,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? vn.operators.GT : vn.operators.LT;
    e.fail$data((0, vn._)`${r}.length ${s} ${n}`);
  }
};
ci.default = Dv;
var li = {}, In = {};
Object.defineProperty(In, "__esModule", { value: !0 });
const ld = Es;
ld.code = 'require("ajv/dist/runtime/equal").default';
In.default = ld;
Object.defineProperty(li, "__esModule", { value: !0 });
const xs = ge, we = te, Mv = D, Vv = In, Lv = {
  message: ({ params: { i: e, j: t } }) => (0, we.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, we._)`{i: ${e}, j: ${t}}`
}, Fv = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Lv,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: u } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, xs.getSchemaTypes)(a.items) : [];
    e.block$data(c, l, (0, we._)`${o} === false`), e.ok(c);
    function l() {
      const w = t.let("i", (0, we._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: w, j: _ }), t.assign(c, !0), t.if((0, we._)`${w} > 1`, () => (h() ? E : g)(w, _));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function E(w, _) {
      const y = t.name("item"), m = (0, xs.checkDataTypes)(d, y, u.opts.strictNumbers, xs.DataType.Wrong), v = t.const("indices", (0, we._)`{}`);
      t.for((0, we._)`;${w}--;`, () => {
        t.let(y, (0, we._)`${r}[${w}]`), t.if(m, (0, we._)`continue`), d.length > 1 && t.if((0, we._)`typeof ${y} == "string"`, (0, we._)`${y} += "_"`), t.if((0, we._)`typeof ${v}[${y}] == "number"`, () => {
          t.assign(_, (0, we._)`${v}[${y}]`), e.error(), t.assign(c, !1).break();
        }).code((0, we._)`${v}[${y}] = ${w}`);
      });
    }
    function g(w, _) {
      const y = (0, Mv.useFunc)(t, Vv.default), m = t.name("outer");
      t.label(m).for((0, we._)`;${w}--;`, () => t.for((0, we._)`${_} = ${w}; ${_}--;`, () => t.if((0, we._)`${y}(${r}[${w}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
li.default = Fv;
var ui = {};
Object.defineProperty(ui, "__esModule", { value: !0 });
const Ra = te, zv = D, Uv = In, qv = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Ra._)`{allowedValue: ${e}}`
}, Kv = {
  keyword: "const",
  $data: !0,
  error: qv,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, Ra._)`!${(0, zv.useFunc)(t, Uv.default)}(${r}, ${s})`) : e.fail((0, Ra._)`${a} !== ${r}`);
  }
};
ui.default = Kv;
var di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
const un = te, Gv = D, Hv = In, Bv = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, un._)`{allowedValues: ${e}}`
}, Wv = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Bv,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const u = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, Gv.useFunc)(t, Hv.default));
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
di.default = Wv;
Object.defineProperty(ei, "__esModule", { value: !0 });
const Xv = ti, Jv = ri, Yv = ni, Qv = ai, Zv = oi, xv = ii, ew = ci, tw = li, rw = ui, nw = di, sw = [
  // number
  Xv.default,
  Jv.default,
  // string
  Yv.default,
  Qv.default,
  // object
  Zv.default,
  xv.default,
  // array
  ew.default,
  tw.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  rw.default,
  nw.default
];
ei.default = sw;
var fi = {}, Qr = {};
Object.defineProperty(Qr, "__esModule", { value: !0 });
Qr.validateAdditionalItems = void 0;
const ur = te, Oa = D, aw = {
  message: ({ params: { len: e } }) => (0, ur.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, ur._)`{limit: ${e}}`
}, ow = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: aw,
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
  const u = r.const("len", (0, ur._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, ur._)`${u} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Oa.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, ur._)`${u} <= ${t.length}`);
    r.if((0, ur.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, u, (l) => {
      e.subschema({ keyword: a, dataProp: l, dataPropType: Oa.Type.Num }, d), o.allErrors || r.if((0, ur.not)(d), () => r.break());
    });
  }
}
Qr.validateAdditionalItems = ud;
Qr.default = ow;
var hi = {}, Zr = {};
Object.defineProperty(Zr, "__esModule", { value: !0 });
Zr.validateTuple = void 0;
const Ac = te, is = D, iw = ne, cw = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return dd(e, "additionalItems", t);
    r.items = !0, !(0, is.alwaysValidSchema)(r, t) && e.ok((0, iw.validateArray)(e));
  }
};
function dd(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: u } = e;
  l(s), u.opts.unevaluated && r.length && u.items !== !0 && (u.items = is.mergeEvaluated.items(n, r.length, u.items));
  const c = n.name("valid"), d = n.const("len", (0, Ac._)`${a}.length`);
  r.forEach((h, E) => {
    (0, is.alwaysValidSchema)(u, h) || (n.if((0, Ac._)`${d} > ${E}`, () => e.subschema({
      keyword: o,
      schemaProp: E,
      dataProp: E
    }, c)), e.ok(c));
  });
  function l(h) {
    const { opts: E, errSchemaPath: g } = u, w = r.length, _ = w === h.minItems && (w === h.maxItems || h[t] === !1);
    if (E.strictTuples && !_) {
      const y = `"${o}" is ${w}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, is.checkStrictMode)(u, y, E.strictTuples);
    }
  }
}
Zr.validateTuple = dd;
Zr.default = cw;
Object.defineProperty(hi, "__esModule", { value: !0 });
const lw = Zr, uw = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, lw.validateTuple)(e, "items")
};
hi.default = uw;
var mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
const kc = te, dw = D, fw = ne, hw = Qr, mw = {
  message: ({ params: { len: e } }) => (0, kc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, kc._)`{limit: ${e}}`
}, pw = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: mw,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, dw.alwaysValidSchema)(n, t) && (s ? (0, hw.validateAdditionalItems)(e, s) : e.ok((0, fw.validateArray)(e)));
  }
};
mi.default = pw;
var pi = {};
Object.defineProperty(pi, "__esModule", { value: !0 });
const He = te, qn = D, $w = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, He.str)`must contain at least ${e} valid item(s)` : (0, He.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, He._)`{minContains: ${e}}` : (0, He._)`{minContains: ${e}, maxContains: ${t}}`
}, yw = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: $w,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, u;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, u = d) : o = 1;
    const l = t.const("len", (0, He._)`${s}.length`);
    if (e.setParams({ min: o, max: u }), u === void 0 && o === 0) {
      (0, qn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (u !== void 0 && o > u) {
      (0, qn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, qn.alwaysValidSchema)(a, r)) {
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
          dataPropType: qn.Type.Num,
          compositeRule: !0
        }, _), y();
      });
    }
    function w(_) {
      t.code((0, He._)`${_}++`), u === void 0 ? t.if((0, He._)`${_} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, He._)`${_} > ${u}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, He._)`${_} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
pi.default = yw;
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
var $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
const hd = te, gw = D, _w = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, hd._)`{propertyName: ${e.propertyName}}`
}, vw = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: _w,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, gw.alwaysValidSchema)(s, r))
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
$i.default = vw;
var As = {};
Object.defineProperty(As, "__esModule", { value: !0 });
const Kn = ne, Qe = te, ww = mt, Gn = D, Ew = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Qe._)`{additionalProperty: ${e.additionalProperty}}`
}, bw = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Ew,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: u, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, Gn.alwaysValidSchema)(o, r))
      return;
    const d = (0, Kn.allSchemaProperties)(n.properties), l = (0, Kn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Qe._)`${a} === ${ww.default.errors}`);
    function h() {
      t.forIn("key", s, (y) => {
        !d.length && !l.length ? w(y) : t.if(E(y), () => w(y));
      });
    }
    function E(y) {
      let m;
      if (d.length > 8) {
        const v = (0, Gn.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, Kn.isOwnProperty)(t, v, y);
      } else d.length ? m = (0, Qe.or)(...d.map((v) => (0, Qe._)`${y} === ${v}`)) : m = Qe.nil;
      return l.length && (m = (0, Qe.or)(m, ...l.map((v) => (0, Qe._)`${(0, Kn.usePattern)(e, v)}.test(${y})`))), (0, Qe.not)(m);
    }
    function g(y) {
      t.code((0, Qe._)`delete ${s}[${y}]`);
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
      if (typeof r == "object" && !(0, Gn.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_(y, m, !1), t.if((0, Qe.not)(m), () => {
          e.reset(), g(y);
        })) : (_(y, m), u || t.if((0, Qe.not)(m), () => t.break()));
      }
    }
    function _(y, m, v) {
      const N = {
        keyword: "additionalProperties",
        dataProp: y,
        dataPropType: Gn.Type.Str
      };
      v === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
As.default = bw;
var yi = {};
Object.defineProperty(yi, "__esModule", { value: !0 });
const Sw = rt, Cc = ne, ea = D, Dc = As, Pw = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Dc.default.code(new Sw.KeywordCxt(a, Dc.default, "additionalProperties"));
    const o = (0, Cc.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = ea.mergeEvaluated.props(t, (0, ea.toHash)(o), a.props));
    const u = o.filter((h) => !(0, ea.alwaysValidSchema)(a, r[h]));
    if (u.length === 0)
      return;
    const c = t.name("valid");
    for (const h of u)
      d(h) ? l(h) : (t.if((0, Cc.propertyInData)(t, s, h, a.opts.ownProperties)), l(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
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
yi.default = Pw;
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
const Mc = ne, Hn = te, Vc = D, Lc = D, Nw = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, u = (0, Mc.allSchemaProperties)(r), c = u.filter((_) => (0, Vc.alwaysValidSchema)(a, r[_]));
    if (u.length === 0 || c.length === u.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, l = t.name("valid");
    a.props !== !0 && !(a.props instanceof Hn.Name) && (a.props = (0, Lc.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    E();
    function E() {
      for (const _ of u)
        d && g(_), a.allErrors ? w(_) : (t.var(l, !0), w(_), t.if(l));
    }
    function g(_) {
      for (const y in d)
        new RegExp(_).test(y) && (0, Vc.checkStrictMode)(a, `property ${y} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function w(_) {
      t.forIn("key", n, (y) => {
        t.if((0, Hn._)`${(0, Mc.usePattern)(e, _)}.test(${y})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: y,
            dataPropType: Lc.Type.Str
          }, l), a.opts.unevaluated && h !== !0 ? t.assign((0, Hn._)`${h}[${y}]`, !0) : !m && !a.allErrors && t.if((0, Hn.not)(l), () => t.break());
        });
      });
    }
  }
};
gi.default = Nw;
var _i = {};
Object.defineProperty(_i, "__esModule", { value: !0 });
const Rw = D, Ow = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Rw.alwaysValidSchema)(n, r)) {
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
_i.default = Ow;
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
const Tw = ne, Iw = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Tw.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
vi.default = Iw;
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
const cs = te, jw = D, Aw = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, cs._)`{passingSchemas: ${e.passing}}`
}, kw = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Aw,
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
        (0, jw.alwaysValidSchema)(s, l) ? t.var(c, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, cs._)`${c} && ${o}`).assign(o, !1).assign(u, (0, cs._)`[${u}, ${h}]`).else(), t.if(c, () => {
          t.assign(o, !0), t.assign(u, h), E && e.mergeEvaluated(E, cs.Name);
        });
      });
    }
  }
};
wi.default = kw;
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
const Cw = D, Dw = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, Cw.alwaysValidSchema)(n, a))
        return;
      const u = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(u);
    });
  }
};
Ei.default = Dw;
var bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
const gs = te, md = D, Mw = {
  message: ({ params: e }) => (0, gs.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, gs._)`{failingKeyword: ${e.ifClause}}`
}, Vw = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Mw,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, md.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Fc(n, "then"), a = Fc(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), u = t.name("_valid");
    if (c(), e.reset(), s && a) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(u, d("then", l), d("else", l));
    } else s ? t.if(u, d("then")) : t.if((0, gs.not)(u), d("else"));
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
        t.assign(o, u), e.mergeValidEvaluated(E, o), h ? t.assign(h, (0, gs._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function Fc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, md.alwaysValidSchema)(e, r);
}
bi.default = Vw;
var Si = {};
Object.defineProperty(Si, "__esModule", { value: !0 });
const Lw = D, Fw = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Lw.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Si.default = Fw;
Object.defineProperty(fi, "__esModule", { value: !0 });
const zw = Qr, Uw = hi, qw = Zr, Kw = mi, Gw = pi, Hw = fd, Bw = $i, Ww = As, Xw = yi, Jw = gi, Yw = _i, Qw = vi, Zw = wi, xw = Ei, eE = bi, tE = Si;
function rE(e = !1) {
  const t = [
    // any
    Yw.default,
    Qw.default,
    Zw.default,
    xw.default,
    eE.default,
    tE.default,
    // object
    Bw.default,
    Ww.default,
    Hw.default,
    Xw.default,
    Jw.default
  ];
  return e ? t.push(Uw.default, Kw.default) : t.push(zw.default, qw.default), t.push(Gw.default), t;
}
fi.default = rE;
var Pi = {}, Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
const pe = te, nE = {
  message: ({ schemaCode: e }) => (0, pe.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, pe._)`{format: ${e}}`
}, sE = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: nE,
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
Ni.default = sE;
Object.defineProperty(Pi, "__esModule", { value: !0 });
const aE = Ni, oE = [aE.default];
Pi.default = oE;
var Gr = {};
Object.defineProperty(Gr, "__esModule", { value: !0 });
Gr.contentVocabulary = Gr.metadataVocabulary = void 0;
Gr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Gr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Qo, "__esModule", { value: !0 });
const iE = Zo, cE = ei, lE = fi, uE = Pi, zc = Gr, dE = [
  iE.default,
  cE.default,
  (0, lE.default)(),
  uE.default,
  zc.metadataVocabulary,
  zc.contentVocabulary
];
Qo.default = dE;
var Ri = {}, ks = {};
Object.defineProperty(ks, "__esModule", { value: !0 });
ks.DiscrError = void 0;
var Uc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Uc || (ks.DiscrError = Uc = {}));
Object.defineProperty(Ri, "__esModule", { value: !0 });
const Rr = te, Ta = ks, qc = Fe, fE = Yr, hE = D, mE = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Ta.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, Rr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, pE = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: mE,
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
        if (O != null && O.$ref && !(0, hE.schemaHasRulesButRef)(O, a.self.RULES)) {
          const X = O.$ref;
          if (O = qc.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, X), O instanceof qc.SchemaEnv && (O = O.schema), O === void 0)
            throw new fE.default(a.opts.uriResolver, a.baseId, X);
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
Ri.default = pE;
const $E = "http://json-schema.org/draft-07/schema#", yE = "http://json-schema.org/draft-07/schema#", gE = "Core schema meta-schema", _E = {
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
}, vE = [
  "object",
  "boolean"
], wE = {
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
}, EE = {
  $schema: $E,
  $id: yE,
  title: gE,
  definitions: _E,
  type: vE,
  properties: wE,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = Ou, n = Qo, s = Ri, a = EE, o = ["/properties"], u = "http://json-schema.org/draft-07/schema";
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
  var d = rt;
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
  var h = Xo();
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var E = Yr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return E.default;
  } });
})(Ea, Ea.exports);
var bE = Ea.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = bE, r = te, n = r.operators, s = {
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
var SE = wa.exports;
const PE = /* @__PURE__ */ El(SE), NE = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), a = Object.getOwnPropertyDescriptor(t, r);
  !RE(s, a) && n || Object.defineProperty(e, r, a);
}, RE = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, OE = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, TE = (e, t) => `/* Wrapped ${e}*/
${t}`, IE = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), jE = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), AE = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = TE.bind(null, n, t.toString());
  Object.defineProperty(s, "name", jE);
  const { writable: a, enumerable: o, configurable: u } = IE;
  Object.defineProperty(e, "toString", { value: s, writable: a, enumerable: o, configurable: u });
};
function kE(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    NE(e, t, s, r);
  return OE(e, t), AE(e, t, n), e;
}
const Kc = (e, t = {}) => {
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
  return kE(d, e), d.cancel = () => {
    o && (clearTimeout(o), o = void 0), u && (clearTimeout(u), u = void 0);
  }, d;
};
var Ia = { exports: {} };
const CE = "2.0.0", pd = 256, DE = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, ME = 16, VE = pd - 6, LE = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var jn = {
  MAX_LENGTH: pd,
  MAX_SAFE_COMPONENT_LENGTH: ME,
  MAX_SAFE_BUILD_LENGTH: VE,
  MAX_SAFE_INTEGER: DE,
  RELEASE_TYPES: LE,
  SEMVER_SPEC_VERSION: CE,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const FE = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Cs = FE;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = jn, a = Cs;
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
var An = Ia.exports;
const zE = Object.freeze({ loose: !0 }), UE = Object.freeze({}), qE = (e) => e ? typeof e != "object" ? zE : e : UE;
var Oi = qE;
const Gc = /^[0-9]+$/, $d = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Gc.test(e), n = Gc.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, KE = (e, t) => $d(t, e);
var yd = {
  compareIdentifiers: $d,
  rcompareIdentifiers: KE
};
const Bn = Cs, { MAX_LENGTH: Hc, MAX_SAFE_INTEGER: Wn } = jn, { safeRe: Xn, t: Jn } = An, GE = Oi, { compareIdentifiers: ta } = yd;
let HE = class it {
  constructor(t, r) {
    if (r = GE(r), t instanceof it) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Hc)
      throw new TypeError(
        `version is longer than ${Hc} characters`
      );
    Bn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Xn[Jn.LOOSE] : Xn[Jn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Wn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Wn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Wn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < Wn)
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
    if (Bn("SemVer.compare", this.version, this.options, t), !(t instanceof it)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new it(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof it || (t = new it(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof it || (t = new it(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = t.prerelease[r];
      if (Bn("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return ta(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof it || (t = new it(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (Bn("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return ta(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? Xn[Jn.PRERELEASELOOSE] : Xn[Jn.PRERELEASE]);
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
          n === !1 && (a = [r]), ta(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Ie = HE;
const Bc = Ie, BE = (e, t, r = !1) => {
  if (e instanceof Bc)
    return e;
  try {
    return new Bc(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var vr = BE;
const WE = vr, XE = (e, t) => {
  const r = WE(e, t);
  return r ? r.version : null;
};
var JE = XE;
const YE = vr, QE = (e, t) => {
  const r = YE(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var ZE = QE;
const Wc = Ie, xE = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Wc(
      e instanceof Wc ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var eb = xE;
const Xc = vr, tb = (e, t) => {
  const r = Xc(e, null, !0), n = Xc(t, null, !0), s = r.compare(n);
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
var rb = tb;
const nb = Ie, sb = (e, t) => new nb(e, t).major;
var ab = sb;
const ob = Ie, ib = (e, t) => new ob(e, t).minor;
var cb = ib;
const lb = Ie, ub = (e, t) => new lb(e, t).patch;
var db = ub;
const fb = vr, hb = (e, t) => {
  const r = fb(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var mb = hb;
const Jc = Ie, pb = (e, t, r) => new Jc(e, r).compare(new Jc(t, r));
var st = pb;
const $b = st, yb = (e, t, r) => $b(t, e, r);
var gb = yb;
const _b = st, vb = (e, t) => _b(e, t, !0);
var wb = vb;
const Yc = Ie, Eb = (e, t, r) => {
  const n = new Yc(e, r), s = new Yc(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var Ti = Eb;
const bb = Ti, Sb = (e, t) => e.sort((r, n) => bb(r, n, t));
var Pb = Sb;
const Nb = Ti, Rb = (e, t) => e.sort((r, n) => Nb(n, r, t));
var Ob = Rb;
const Tb = st, Ib = (e, t, r) => Tb(e, t, r) > 0;
var Ds = Ib;
const jb = st, Ab = (e, t, r) => jb(e, t, r) < 0;
var Ii = Ab;
const kb = st, Cb = (e, t, r) => kb(e, t, r) === 0;
var gd = Cb;
const Db = st, Mb = (e, t, r) => Db(e, t, r) !== 0;
var _d = Mb;
const Vb = st, Lb = (e, t, r) => Vb(e, t, r) >= 0;
var ji = Lb;
const Fb = st, zb = (e, t, r) => Fb(e, t, r) <= 0;
var Ai = zb;
const Ub = gd, qb = _d, Kb = Ds, Gb = ji, Hb = Ii, Bb = Ai, Wb = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return Ub(e, r, n);
    case "!=":
      return qb(e, r, n);
    case ">":
      return Kb(e, r, n);
    case ">=":
      return Gb(e, r, n);
    case "<":
      return Hb(e, r, n);
    case "<=":
      return Bb(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var vd = Wb;
const Xb = Ie, Jb = vr, { safeRe: Yn, t: Qn } = An, Yb = (e, t) => {
  if (e instanceof Xb)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Yn[Qn.COERCEFULL] : Yn[Qn.COERCE]);
  else {
    const c = t.includePrerelease ? Yn[Qn.COERCERTLFULL] : Yn[Qn.COERCERTL];
    let d;
    for (; (d = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), c.lastIndex = d.index + d[1].length + d[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", u = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return Jb(`${n}.${s}.${a}${o}${u}`, t);
};
var Qb = Yb;
const Zb = vr, xb = jn, e1 = Ie, t1 = (e, t, r) => {
  if (!xb.RELEASE_TYPES.includes(t))
    return null;
  const n = r1(e, r);
  return n && n1(n, t);
}, r1 = (e, t) => {
  const r = e instanceof e1 ? e.version : e;
  return Zb(r, t);
}, n1 = (e, t) => {
  if (s1(t))
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
}, s1 = (e) => e.startsWith("pre");
var a1 = t1;
class o1 {
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
var i1 = o1, ra, Qc;
function at() {
  if (Qc) return ra;
  Qc = 1;
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
  ra = t;
  const r = i1, n = new r(), s = Oi, a = Ms(), o = Cs, u = Ie, {
    safeRe: c,
    src: d,
    t: l,
    comparatorTrimReplace: h,
    tildeTrimReplace: E,
    caretTrimReplace: g
  } = An, { FLAG_INCLUDE_PRERELEASE: w, FLAG_LOOSE: _ } = jn, y = new RegExp(d[l.BUILD], "g"), m = (k) => k.value === "<0.0.0-0", v = (k) => k.value === "", N = (k, j) => {
    let z = !0;
    const M = k.slice();
    let P = M.pop();
    for (; z && M.length; )
      z = M.every((p) => P.intersects(p, j)), P = M.pop();
    return z;
  }, R = (k, j) => (k = k.replace(c[l.BUILD], ""), o("comp", k, j), k = de(k, j), o("caret", k), k = K(k, j), o("tildes", k), k = $e(k, j), o("xrange", k), k = G(k, j), o("stars", k), k), O = (k) => !k || k.toLowerCase() === "x" || k === "*", K = (k, j) => k.trim().split(/\s+/).map((z) => X(z, j)).join(" "), X = (k, j) => {
    const z = j.loose ? c[l.TILDELOOSE] : c[l.TILDE];
    return k.replace(z, (M, P, p, S, $) => {
      o("tilde", k, M, P, p, S, $);
      let i;
      return O(P) ? i = "" : O(p) ? i = `>=${P}.0.0 <${+P + 1}.0.0-0` : O(S) ? i = `>=${P}.${p}.0 <${P}.${+p + 1}.0-0` : $ ? (o("replaceTilde pr", $), i = `>=${P}.${p}.${S}-${$} <${P}.${+p + 1}.0-0`) : i = `>=${P}.${p}.${S} <${P}.${+p + 1}.0-0`, o("tilde return", i), i;
    });
  }, de = (k, j) => k.trim().split(/\s+/).map((z) => he(z, j)).join(" "), he = (k, j) => {
    o("caret", k, j);
    const z = j.loose ? c[l.CARETLOOSE] : c[l.CARET], M = j.includePrerelease ? "-0" : "";
    return k.replace(z, (P, p, S, $, i) => {
      o("caret", k, P, p, S, $, i);
      let f;
      return O(p) ? f = "" : O(S) ? f = `>=${p}.0.0${M} <${+p + 1}.0.0-0` : O($) ? p === "0" ? f = `>=${p}.${S}.0${M} <${p}.${+S + 1}.0-0` : f = `>=${p}.${S}.0${M} <${+p + 1}.0.0-0` : i ? (o("replaceCaret pr", i), p === "0" ? S === "0" ? f = `>=${p}.${S}.${$}-${i} <${p}.${S}.${+$ + 1}-0` : f = `>=${p}.${S}.${$}-${i} <${p}.${+S + 1}.0-0` : f = `>=${p}.${S}.${$}-${i} <${+p + 1}.0.0-0`) : (o("no pr"), p === "0" ? S === "0" ? f = `>=${p}.${S}.${$}${M} <${p}.${S}.${+$ + 1}-0` : f = `>=${p}.${S}.${$}${M} <${p}.${+S + 1}.0-0` : f = `>=${p}.${S}.${$} <${+p + 1}.0.0-0`), o("caret return", f), f;
    });
  }, $e = (k, j) => (o("replaceXRanges", k, j), k.split(/\s+/).map((z) => F(z, j)).join(" ")), F = (k, j) => {
    k = k.trim();
    const z = j.loose ? c[l.XRANGELOOSE] : c[l.XRANGE];
    return k.replace(z, (M, P, p, S, $, i) => {
      o("xRange", k, M, P, p, S, $, i);
      const f = O(p), b = f || O(S), T = b || O($), I = T;
      return P === "=" && I && (P = ""), i = j.includePrerelease ? "-0" : "", f ? P === ">" || P === "<" ? M = "<0.0.0-0" : M = "*" : P && I ? (b && (S = 0), $ = 0, P === ">" ? (P = ">=", b ? (p = +p + 1, S = 0, $ = 0) : (S = +S + 1, $ = 0)) : P === "<=" && (P = "<", b ? p = +p + 1 : S = +S + 1), P === "<" && (i = "-0"), M = `${P + p}.${S}.${$}${i}`) : b ? M = `>=${p}.0.0${i} <${+p + 1}.0.0-0` : T && (M = `>=${p}.${S}.0${i} <${p}.${+S + 1}.0-0`), o("xRange return", M), M;
    });
  }, G = (k, j) => (o("replaceStars", k, j), k.trim().replace(c[l.STAR], "")), ae = (k, j) => (o("replaceGTE0", k, j), k.trim().replace(c[j.includePrerelease ? l.GTE0PRE : l.GTE0], "")), H = (k) => (j, z, M, P, p, S, $, i, f, b, T, I) => (O(M) ? z = "" : O(P) ? z = `>=${M}.0.0${k ? "-0" : ""}` : O(p) ? z = `>=${M}.${P}.0${k ? "-0" : ""}` : S ? z = `>=${z}` : z = `>=${z}${k ? "-0" : ""}`, O(f) ? i = "" : O(b) ? i = `<${+f + 1}.0.0-0` : O(T) ? i = `<${f}.${+b + 1}.0-0` : I ? i = `<=${f}.${b}.${T}-${I}` : k ? i = `<${f}.${b}.${+T + 1}-0` : i = `<=${i}`, `${z} ${i}`.trim()), ce = (k, j, z) => {
    for (let M = 0; M < k.length; M++)
      if (!k[M].test(j))
        return !1;
    if (j.prerelease.length && !z.includePrerelease) {
      for (let M = 0; M < k.length; M++)
        if (o(k[M].semver), k[M].semver !== a.ANY && k[M].semver.prerelease.length > 0) {
          const P = k[M].semver;
          if (P.major === j.major && P.minor === j.minor && P.patch === j.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return ra;
}
var na, Zc;
function Ms() {
  if (Zc) return na;
  Zc = 1;
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
  na = t;
  const r = Oi, { safeRe: n, t: s } = An, a = vd, o = Cs, u = Ie, c = at();
  return na;
}
const c1 = at(), l1 = (e, t, r) => {
  try {
    t = new c1(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Vs = l1;
const u1 = at(), d1 = (e, t) => new u1(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var f1 = d1;
const h1 = Ie, m1 = at(), p1 = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new m1(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === -1) && (n = o, s = new h1(n, r));
  }), n;
};
var $1 = p1;
const y1 = Ie, g1 = at(), _1 = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new g1(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === 1) && (n = o, s = new y1(n, r));
  }), n;
};
var v1 = _1;
const sa = Ie, w1 = at(), xc = Ds, E1 = (e, t) => {
  e = new w1(e, t);
  let r = new sa("0.0.0");
  if (e.test(r) || (r = new sa("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let a = null;
    s.forEach((o) => {
      const u = new sa(o.semver.version);
      switch (o.operator) {
        case ">":
          u.prerelease.length === 0 ? u.patch++ : u.prerelease.push(0), u.raw = u.format();
        case "":
        case ">=":
          (!a || xc(u, a)) && (a = u);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || xc(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var b1 = E1;
const S1 = at(), P1 = (e, t) => {
  try {
    return new S1(e, t).range || "*";
  } catch {
    return null;
  }
};
var N1 = P1;
const R1 = Ie, wd = Ms(), { ANY: O1 } = wd, T1 = at(), I1 = Vs, el = Ds, tl = Ii, j1 = Ai, A1 = ji, k1 = (e, t, r, n) => {
  e = new R1(e, n), t = new T1(t, n);
  let s, a, o, u, c;
  switch (r) {
    case ">":
      s = el, a = j1, o = tl, u = ">", c = ">=";
      break;
    case "<":
      s = tl, a = A1, o = el, u = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (I1(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const l = t.set[d];
    let h = null, E = null;
    if (l.forEach((g) => {
      g.semver === O1 && (g = new wd(">=0.0.0")), h = h || g, E = E || g, s(g.semver, h.semver, n) ? h = g : o(g.semver, E.semver, n) && (E = g);
    }), h.operator === u || h.operator === c || (!E.operator || E.operator === u) && a(e, E.semver))
      return !1;
    if (E.operator === c && o(e, E.semver))
      return !1;
  }
  return !0;
};
var ki = k1;
const C1 = ki, D1 = (e, t, r) => C1(e, t, ">", r);
var M1 = D1;
const V1 = ki, L1 = (e, t, r) => V1(e, t, "<", r);
var F1 = L1;
const rl = at(), z1 = (e, t, r) => (e = new rl(e, r), t = new rl(t, r), e.intersects(t, r));
var U1 = z1;
const q1 = Vs, K1 = st;
var G1 = (e, t, r) => {
  const n = [];
  let s = null, a = null;
  const o = e.sort((l, h) => K1(l, h, r));
  for (const l of o)
    q1(l, t, r) ? (a = l, s || (s = l)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const u = [];
  for (const [l, h] of n)
    l === h ? u.push(l) : !h && l === o[0] ? u.push("*") : h ? l === o[0] ? u.push(`<=${h}`) : u.push(`${l} - ${h}`) : u.push(`>=${l}`);
  const c = u.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < d.length ? c : t;
};
const nl = at(), Ci = Ms(), { ANY: aa } = Ci, oa = Vs, Di = st, H1 = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new nl(e, r), t = new nl(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const a of t.set) {
      const o = W1(s, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, B1 = [new Ci(">=0.0.0-0")], sl = [new Ci(">=0.0.0")], W1 = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === aa) {
    if (t.length === 1 && t[0].semver === aa)
      return !0;
    r.includePrerelease ? e = B1 : e = sl;
  }
  if (t.length === 1 && t[0].semver === aa) {
    if (r.includePrerelease)
      return !0;
    t = sl;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? s = al(s, g, r) : g.operator === "<" || g.operator === "<=" ? a = ol(a, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let o;
  if (s && a) {
    if (o = Di(s.semver, a.semver, r), o > 0)
      return null;
    if (o === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const g of n) {
    if (s && !oa(g, String(s), r) || a && !oa(g, String(a), r))
      return null;
    for (const w of t)
      if (!oa(g, String(w), r))
        return !1;
    return !0;
  }
  let u, c, d, l, h = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, E = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && a.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const g of t) {
    if (l = l || g.operator === ">" || g.operator === ">=", d = d || g.operator === "<" || g.operator === "<=", s) {
      if (E && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === E.major && g.semver.minor === E.minor && g.semver.patch === E.patch && (E = !1), g.operator === ">" || g.operator === ">=") {
        if (u = al(s, g, r), u === g && u !== s)
          return !1;
      } else if (s.operator === ">=" && !g.test(s.semver))
        return !1;
    }
    if (a) {
      if (h && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === h.major && g.semver.minor === h.minor && g.semver.patch === h.patch && (h = !1), g.operator === "<" || g.operator === "<=") {
        if (c = ol(a, g, r), c === g && c !== a)
          return !1;
      } else if (a.operator === "<=" && !g.test(a.semver))
        return !1;
    }
    if (!g.operator && (a || s) && o !== 0)
      return !1;
  }
  return !(s && d && !a && o !== 0 || a && l && !s && o !== 0 || E || h);
}, al = (e, t, r) => {
  if (!e)
    return t;
  const n = Di(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, ol = (e, t, r) => {
  if (!e)
    return t;
  const n = Di(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var X1 = H1;
const ia = An, il = jn, J1 = Ie, cl = yd, Y1 = vr, Q1 = JE, Z1 = ZE, x1 = eb, eS = rb, tS = ab, rS = cb, nS = db, sS = mb, aS = st, oS = gb, iS = wb, cS = Ti, lS = Pb, uS = Ob, dS = Ds, fS = Ii, hS = gd, mS = _d, pS = ji, $S = Ai, yS = vd, gS = Qb, _S = a1, vS = Ms(), wS = at(), ES = Vs, bS = f1, SS = $1, PS = v1, NS = b1, RS = N1, OS = ki, TS = M1, IS = F1, jS = U1, AS = G1, kS = X1;
var CS = {
  parse: Y1,
  valid: Q1,
  clean: Z1,
  inc: x1,
  diff: eS,
  major: tS,
  minor: rS,
  patch: nS,
  prerelease: sS,
  compare: aS,
  rcompare: oS,
  compareLoose: iS,
  compareBuild: cS,
  sort: lS,
  rsort: uS,
  gt: dS,
  lt: fS,
  eq: hS,
  neq: mS,
  gte: pS,
  lte: $S,
  cmp: yS,
  coerce: gS,
  truncate: _S,
  Comparator: vS,
  Range: wS,
  satisfies: ES,
  toComparators: bS,
  maxSatisfying: SS,
  minSatisfying: PS,
  minVersion: NS,
  validRange: RS,
  outside: OS,
  gtr: TS,
  ltr: IS,
  intersects: jS,
  simplifyRange: AS,
  subset: kS,
  SemVer: J1,
  re: ia.re,
  src: ia.src,
  tokens: ia.t,
  SEMVER_SPEC_VERSION: il.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: il.RELEASE_TYPES,
  compareIdentifiers: cl.compareIdentifiers,
  rcompareIdentifiers: cl.rcompareIdentifiers
};
const Pr = /* @__PURE__ */ El(CS), DS = Object.prototype.toString, MS = "[object Uint8Array]", VS = "[object ArrayBuffer]";
function Ed(e, t, r) {
  return e ? e.constructor === t ? !0 : DS.call(e) === r : !1;
}
function bd(e) {
  return Ed(e, Uint8Array, MS);
}
function LS(e) {
  return Ed(e, ArrayBuffer, VS);
}
function FS(e) {
  return bd(e) || LS(e);
}
function zS(e) {
  if (!bd(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function US(e) {
  if (!FS(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function ca(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    zS(s), r.set(s, n), n += s.length;
  return r;
}
const Zn = {
  utf8: new globalThis.TextDecoder("utf8")
};
function xn(e, t = "utf8") {
  return US(e), Zn[t] ?? (Zn[t] = new globalThis.TextDecoder(t)), Zn[t].decode(e);
}
function qS(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const KS = new globalThis.TextEncoder();
function la(e) {
  return qS(e), KS.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const ll = "aes-256-cbc", Sd = /* @__PURE__ */ new Set([
  "aes-256-cbc",
  "aes-256-gcm",
  "aes-256-ctr"
]), GS = (e) => typeof e == "string" && Sd.has(e), yt = () => /* @__PURE__ */ Object.create(null), ul = (e) => e !== void 0, ua = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, kt = "__internal__", da = `${kt}.migrations.version`;
var Dt, Mt, dr, Me, Ke, fr, hr, Fr, ct, _e, Pd, Nd, Rd, Od, Td, Id, jd, Ad;
class HS {
  constructor(t = {}) {
    We(this, _e);
    tn(this, "path");
    tn(this, "events");
    We(this, Dt);
    We(this, Mt);
    We(this, dr);
    We(this, Me);
    We(this, Ke, {});
    We(this, fr, !1);
    We(this, hr);
    We(this, Fr);
    We(this, ct);
    tn(this, "_deserialize", (t) => JSON.parse(t));
    tn(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = pt(this, _e, Pd).call(this, t);
    De(this, Me, r), pt(this, _e, Nd).call(this, r), pt(this, _e, Od).call(this, r), pt(this, _e, Td).call(this, r), this.events = new EventTarget(), De(this, Mt, r.encryptionKey), De(this, dr, r.encryptionAlgorithm ?? ll), this.path = pt(this, _e, Id).call(this, r), pt(this, _e, jd).call(this, r), r.watch && this._watch();
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
      throw new TypeError(`Please don't use the ${kt} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, o) => {
      if (ua(a, o), J(this, Me).accessPropertiesByDotNotation)
        kn(n, a, o);
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
    return J(this, Me).accessPropertiesByDotNotation ? qs(this.store, t) : t in this.store;
  }
  appendToArray(t, r) {
    ua(t, r);
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
      ul(J(this, Ke)[r]) && this.set(r, J(this, Ke)[r]);
  }
  delete(t) {
    const { store: r } = this;
    J(this, Me).accessPropertiesByDotNotation ? Wd(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = yt();
    for (const r of Object.keys(J(this, Ke)))
      ul(J(this, Ke)[r]) && (ua(r, J(this, Ke)[r]), J(this, Me).accessPropertiesByDotNotation ? kn(t, r, J(this, Ke)[r]) : t[r] = J(this, Ke)[r]);
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
    if (this._ensureDirectory(), !qs(t, kt))
      try {
        const r = Y.readFileSync(this.path, J(this, Mt) ? null : "utf8"), n = this._decryptData(r), s = this._deserialize(n);
        qs(s, kt) && kn(t, kt, zi(s, kt));
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
    J(this, hr) && (J(this, hr).close(), De(this, hr, void 0)), J(this, Fr) && (Y.unwatchFile(this.path), De(this, Fr, !1)), De(this, ct, void 0);
  }
  _decryptData(t) {
    const r = J(this, Mt);
    if (!r)
      return typeof t == "string" ? t : xn(t);
    const n = J(this, dr), s = n === "aes-256-gcm" ? 16 : 0, a = ":".codePointAt(0), o = typeof t == "string" ? t.codePointAt(16) : t[16];
    if (!(a !== void 0 && o === a)) {
      if (n === "aes-256-cbc")
        return typeof t == "string" ? t : xn(t);
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
    }, d = t.slice(0, 16), l = t.slice(17), h = typeof l == "string" ? la(l) : l, E = (g) => {
      const { ciphertext: w, authenticationTag: _ } = c(h), y = rn.pbkdf2Sync(r, g, 1e4, 32, "sha512"), m = rn.createDecipheriv(n, y, d);
      return _ && m.setAuthTag(_), xn(ca([m.update(w), m.final()]));
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
      return typeof t == "string" ? t : xn(t);
    throw new Error("Failed to decrypt config data.");
  }
  _handleStoreChange(t) {
    let r = this.store;
    const n = () => {
      const s = r, a = this.store;
      Li(a, s) || (r = a, t.call(this, a, s));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(t, r) {
    let n = t();
    const s = () => {
      const a = n, o = t();
      Li(o, a) || (n = o, r.call(this, o, a));
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
    Y.mkdirSync(ee.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    const n = J(this, Mt);
    if (n) {
      const s = rn.randomBytes(16), a = rn.pbkdf2Sync(n, s, 1e4, 32, "sha512"), o = rn.createCipheriv(J(this, dr), a, s), u = ca([o.update(la(r)), o.final()]), c = [s, la(":"), u];
      J(this, dr) === "aes-256-gcm" && c.push(o.getAuthTag()), r = ca(c);
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
      J(this, ct) ?? De(this, ct, Kc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = ee.dirname(this.path), r = ee.basename(this.path);
      De(this, hr, Y.watch(t, { persistent: !1, encoding: "utf8" }, (n, s) => {
        s && s !== r || typeof J(this, ct) == "function" && J(this, ct).call(this);
      }));
    } else
      J(this, ct) ?? De(this, ct, Kc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), Y.watchFile(this.path, { persistent: !1 }, (t, r) => {
        typeof J(this, ct) == "function" && J(this, ct).call(this);
      }), De(this, Fr, !0);
  }
  _migrate(t, r, n) {
    let s = this._get(da, "0.0.0");
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
        c == null || c(this), this._set(da, u), s = u, o = structuredClone(this.store);
      } catch (c) {
        this.store = o;
        const d = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${d}`);
      }
    (this._isVersionInRangeFormat(s) || !Pr.eq(s, r)) && this._set(da, r);
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
    return t === kt || t.startsWith(`${kt}.`);
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
    kn(n, t, r), this.store = n;
  }
}
Dt = new WeakMap(), Mt = new WeakMap(), dr = new WeakMap(), Me = new WeakMap(), Ke = new WeakMap(), fr = new WeakMap(), hr = new WeakMap(), Fr = new WeakMap(), ct = new WeakMap(), _e = new WeakSet(), Pd = function(t) {
  const r = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (r.encryptionAlgorithm ?? (r.encryptionAlgorithm = ll), !GS(r.encryptionAlgorithm))
    throw new TypeError(`The \`encryptionAlgorithm\` option must be one of: ${[...Sd].join(", ")}`);
  if (!r.cwd) {
    if (!r.projectName)
      throw new Error("Please specify the `projectName` option.");
    r.cwd = Qd(r.projectName, { suffix: r.projectSuffix }).config;
  }
  return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
}, Nd = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const r = PE.default, n = new fg.Ajv2020({
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
    a !== void 0 && (J(this, Ke)[n] = a);
  }
}, Od = function(t) {
  t.defaults && Object.assign(J(this, Ke), t.defaults);
}, Td = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, Id = function(t) {
  const r = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = r ? `.${r}` : "";
  return ee.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
}, jd = function(t) {
  if (t.migrations) {
    pt(this, _e, Ad).call(this, t), this._validate(this.store);
    return;
  }
  const r = this.store, n = Object.assign(yt(), t.defaults ?? {}, r);
  this._validate(n);
  try {
    Fi.deepEqual(r, n);
  } catch {
    this.store = n;
  }
}, Ad = function(t) {
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
const { app: ls, ipcMain: ja, shell: BS } = pl;
let dl = !1;
const fl = () => {
  if (!ja || !ls)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: ls.getPath("userData"),
    appVersion: ls.getVersion()
  };
  return dl || (ja.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), dl = !0), e;
};
class WS extends HS {
  constructor(t) {
    let r, n;
    if (fe.type === "renderer") {
      const s = pl.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else ja && ls && ({ defaultCwd: r, appVersion: n } = fl());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = ee.isAbsolute(t.cwd) ? t.cwd : ee.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    fl();
  }
  async openInEditor() {
    const t = await BS.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const kd = ee.dirname(Gd(import.meta.url));
process.env.APP_ROOT = ee.join(kd, "../..");
const gP = ee.join(process.env.APP_ROOT, "dist-electron"), Cd = ee.join(process.env.APP_ROOT, "dist"), Pn = process.env.VITE_DEV_SERVER_URL;
process.env.VITE_PUBLIC = Pn ? ee.join(process.env.APP_ROOT, "public") : Cd;
ka.release().startsWith("6.1") && Ce.disableHardwareAcceleration();
process.platform === "win32" && Ce.setAppUserModelId(Ce.getName());
Ce.requestSingleInstanceLock() || (Ce.quit(), process.exit(0));
const XS = new WS({
  name: "planner-data",
  defaults: {
    shortPlans: [],
    shortTasks: [],
    longTasks: [],
    notifiedTaskIds: []
  }
}), gt = XS;
let A = null, et = null, ot = null, wn = null, mr = !0, Ls = !1, hl = "top-right", Ar = null, kr = null, _s = !1;
const Dd = ee.join(kd, "../preload/index.mjs"), Md = ee.join(Cd, "index.html");
function JS(e, t) {
  const { workArea: r } = En.getDisplayMatching(e.getBounds()), n = 0, s = e.getBounds(), a = r.x + n, o = r.x + r.width - s.width - n, u = r.y + n, c = r.y + r.height - s.height - n;
  return {
    x: t.endsWith("right") ? o : a,
    y: t.startsWith("bottom") ? c : u
  };
}
function Lr(e, t = hl) {
  const r = JS(e, t), n = Math.round(r.x), s = Math.round(r.y), a = e.getBounds();
  hl = t, !(Math.abs(a.x - n) <= 1 && Math.abs(a.y - s) <= 1) && (kr && clearTimeout(kr), _s = !0, e.setPosition(n, s, !1), kr = setTimeout(() => {
    _s = !1, kr = null;
  }, 160));
}
function YS(e) {
  const t = e.getBounds(), { workArea: r } = En.getDisplayMatching(t), n = t.x + t.width / 2, s = t.y + t.height / 2, a = n < r.x + r.width / 2 ? "left" : "right";
  return `${s < r.y + r.height / 2 ? "top" : "bottom"}-${a}`;
}
function QS(e) {
  _s || (Ar && clearTimeout(Ar), Ar = setTimeout(() => {
    Ar = null, e.isDestroyed() || Lr(e, YS(e));
  }, 520));
}
function ht(e = !1) {
  !A || A.isDestroyed() || (Lr(A), e ? (A.show(), A.moveTop(), A.focus()) : A.showInactive());
}
function fa() {
  !A || A.isDestroyed() || (A.setAlwaysOnTop(!0, "floating"), A.show(), A.moveTop(), A.focus(), setTimeout(() => {
    A && !A.isDestroyed() && A.setAlwaysOnTop(!1);
  }, 1500));
}
function Ut() {
  if (!et) return;
  const e = !!(A && !A.isDestroyed() && A.isVisible()), t = Kd.buildFromTemplate([
    {
      label: mr ? "切换到桌面模式" : "进入编辑模式",
      click: () => nt(!mr, !0)
    },
    {
      label: e ? "隐藏窗口" : "显示窗口",
      click: () => {
        !A || A.isDestroyed() || (A.isVisible() ? A.hide() : ht(mr), Ut());
      }
    },
    { type: "separator" },
    {
      label: "退出",
      click: () => {
        Ls = !0, Ce.quit();
      }
    }
  ]);
  et.setToolTip("计划小组件"), et.setContextMenu(t);
}
function nt(e, t = !1) {
  !A || A.isDestroyed() || (mr = e, A.setAlwaysOnTop(!1), A.setVisibleOnAllWorkspaces(!1), A.setFocusable(e), A.setIgnoreMouseEvents(!e, { forward: !0 }), e ? ht(t) : A.isVisible() && (A.blur(), ht(!1)), A.webContents.isDestroyed() || A.webContents.send("planner:interactive-changed", e), Ut());
}
function ZS() {
  if (et) return;
  const e = ee.join(process.env.VITE_PUBLIC, "favicon.ico"), t = zd.createFromPath(e);
  et = new Ud(t.isEmpty() ? e : t), et.on("click", () => {
    !A || A.isDestroyed() || (A.isVisible() ? nt(!0, !0) : ht(!1));
  }), et.on("double-click", () => nt(!0, !0)), Ut();
}
function xS() {
  if (ot && !ot.isDestroyed()) return;
  const { bounds: e } = En.getDisplayNearestPoint(En.getCursorScreenPoint());
  ot = new Aa({
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
  }), ot.setIgnoreMouseEvents(!0, { forward: !0 }), Pn ? ot.loadURL(`${Pn}#celebrate`) : ot.loadFile(Md, { hash: "celebrate" }), setTimeout(() => {
    ot && !ot.isDestroyed() && ot.close(), ot = null;
  }, 2200);
}
function ml() {
  if (!Vi.isSupported()) return;
  const e = Date.now(), t = 5 * 60 * 1e3, r = gt.get("shortTasks"), n = new Set(gt.get("notifiedTaskIds"));
  for (const s of r) {
    if (s.completed) continue;
    const a = new Date(s.dueAt).getTime();
    if (Number.isNaN(a)) continue;
    const o = a - e;
    o >= 0 && o <= t && !n.has(s.id) && (new Vi({
      title: "任务提醒",
      body: `${s.title} 将在 5 分钟内到期`,
      silent: !1
    }).show(), n.add(s.id));
  }
  gt.set("notifiedTaskIds", [...n]);
}
function eP() {
  wn && clearInterval(wn), ml(), wn = setInterval(ml, 60 * 1e3);
}
function tP() {
  process.platform === "win32" && Ce.isPackaged && Ce.setLoginItemSettings({
    openAtLogin: !0,
    openAsHidden: !0,
    path: process.execPath,
    args: ["--hidden"]
  });
}
function rP() {
  jt.handle("planner:get-data", () => gt.store), jt.handle("planner:save-short-plans", (e, t) => (gt.set("shortPlans", t), t)), jt.handle("planner:save-short-tasks", (e, t) => {
    gt.set("shortTasks", t);
    const r = new Set(t.filter((s) => !s.completed).map((s) => s.id)), n = gt.get("notifiedTaskIds").filter((s) => r.has(s));
    return gt.set("notifiedTaskIds", n), t;
  }), jt.handle("planner:save-long-tasks", (e, t) => (gt.set("longTasks", t), t)), jt.on("planner:celebrate", () => {
    xS();
  }), jt.on("planner:set-interactive", (e, t) => {
    nt(t, t);
  }), jt.handle("planner:toggle-widget", () => !A || A.isDestroyed() ? !1 : A.isVisible() ? (A.hide(), Ut(), !1) : (ht(mr), Ut(), !0));
}
async function Vd() {
  const e = process.argv.includes("--hidden");
  A = new Aa({
    title: "计划小组件",
    width: 530,
    height: 540,
    minWidth: 460,
    minHeight: 480,
    show: !e,
    frame: !1,
    transparent: !0,
    skipTaskbar: !0,
    resizable: !0,
    focusable: !0,
    alwaysOnTop: !1,
    hasShadow: !1,
    backgroundColor: "#00000000",
    icon: ee.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload: Dd,
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), Lr(A), e || fa(), Pn ? A.loadURL(Pn) : A.loadFile(Md), A.once("ready-to-show", () => {
    e || (nt(!0, !0), fa());
  }), setTimeout(() => {
    A && !A.isDestroyed() && !e && (nt(!0, !0), fa());
  }, 1200), A.webContents.on("did-finish-load", () => {
    A == null || A.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString()), e || ht(!0), nt(!0, !e);
  }), A.on("show", () => {
    A && (A.setAlwaysOnTop(!1), Lr(A), Ut());
  }), A.on("hide", Ut), A.on("resize", () => {
    A && Lr(A);
  }), A.on("move", () => {
    A && !A.isDestroyed() && !_s && QS(A), Ut();
  }), A.on("close", (t) => {
    Ls || (t.preventDefault(), A == null || A.hide());
  }), A.webContents.setWindowOpenHandler(({ url: t }) => (t.startsWith("https:") && qd.openExternal(t), { action: "deny" }));
}
Ce.whenReady().then(() => {
  tP(), rP(), ZS(), Vd(), eP(), En.on("display-metrics-changed", () => {
    A && !A.isDestroyed() && Lr(A);
  }), $l.register("CommandOrControl+Shift+T", () => {
    !A || A.isDestroyed() || (A.isVisible() || ht(!0), nt(!mr, !0));
  });
});
Ce.on("before-quit", () => {
  Ls = !0;
});
Ce.on("window-all-closed", () => {
  process.platform !== "darwin" && Ls && Ce.quit();
});
Ce.on("will-quit", () => {
  wn && clearInterval(wn), Ar && clearTimeout(Ar), kr && clearTimeout(kr), $l.unregisterAll(), et == null || et.destroy(), et = null;
});
Ce.on("second-instance", () => {
  A && !A.isDestroyed() && (A.isMinimized() && A.restore(), ht(!0), nt(!0, !0));
});
Ce.on("activate", () => {
  Aa.getAllWindows().length ? (ht(!0), nt(!0, !0)) : Vd();
});
jt.handle("open-win", async (e, t) => {
  !A || A.isDestroyed() || (A.isVisible() || ht(!0), typeof t == "string" && t === "toggle-widget" && nt(!mr, !0));
});
export {
  gP as MAIN_DIST,
  Cd as RENDERER_DIST,
  Pn as VITE_DEV_SERVER_URL
};
