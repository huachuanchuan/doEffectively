var $d = Object.defineProperty;
var Pi = (e) => {
  throw TypeError(e);
};
var yd = (e, t, r) => t in e ? $d(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Br = (e, t, r) => yd(e, typeof t != "symbol" ? t + "" : t, r), Is = (e, t, r) => t.has(e) || Pi("Cannot " + r);
var ee = (e, t, r) => (Is(e, t, "read from private field"), r ? r.call(e) : t.get(e)), et = (e, t, r) => t.has(e) ? Pi("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), qe = (e, t, r, n) => (Is(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), _t = (e, t, r) => (Is(e, t, "access private method"), r);
import cl, { app as Ue, screen as fn, globalShortcut as ll, BrowserWindow as wa, ipcMain as Mt, nativeImage as gd, Tray as _d, shell as vd, Menu as wd, Notification as Ni } from "electron";
import { fileURLToPath as Ed } from "node:url";
import ae from "node:path";
import Ea from "node:os";
import $e from "node:process";
import { promisify as ke, isDeepStrictEqual as Ri } from "node:util";
import te from "node:fs";
import Wr from "node:crypto";
import Oi from "node:assert";
import "node:events";
import "node:stream";
const cr = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, ul = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), dl = 1e6, bd = (e) => e >= "0" && e <= "9";
function fl(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= dl;
  }
  return !1;
}
function js(e, t) {
  return ul.has(e) ? !1 : (e && fl(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function Sd(e) {
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
            !Number.isNaN(l) && Number.isFinite(l) && l >= 0 && l <= Number.MAX_SAFE_INTEGER && l <= dl && r === String(l) ? t.push(l) : t.push(r), r = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        r += o;
        break;
      }
      default: {
        if (n === "index" && !bd(o))
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
    return Sd(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [r, n] of e.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${r}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${r} must be a finite number, got ${n}`);
      if (ul.has(n))
        return [];
      typeof n == "string" && fl(n) ? t.push(Number.parseInt(n, 10)) : t.push(n);
    }
    return t;
  }
  return [];
}
function Ti(e, t, r) {
  if (!cr(e) || typeof t != "string" && !Array.isArray(t))
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
function wn(e, t, r) {
  if (!cr(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, s = ls(t);
  if (s.length === 0)
    return e;
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    if (a === s.length - 1)
      e[o] = r;
    else if (!cr(e[o])) {
      const c = typeof s[a + 1] == "number";
      e[o] = c ? [] : {};
    }
    e = e[o];
  }
  return n;
}
function Pd(e, t) {
  if (!cr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = ls(t);
  if (r.length === 0)
    return !1;
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (n === r.length - 1)
      return Object.hasOwn(e, s) ? (delete e[s], !0) : !1;
    if (e = e[s], !cr(e))
      return !1;
  }
}
function ks(e, t) {
  if (!cr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = ls(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!cr(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const Ft = Ea.homedir(), ba = Ea.tmpdir(), { env: vr } = $e, Nd = (e) => {
  const t = ae.join(Ft, "Library");
  return {
    data: ae.join(t, "Application Support", e),
    config: ae.join(t, "Preferences", e),
    cache: ae.join(t, "Caches", e),
    log: ae.join(t, "Logs", e),
    temp: ae.join(ba, e)
  };
}, Rd = (e) => {
  const t = vr.APPDATA || ae.join(Ft, "AppData", "Roaming"), r = vr.LOCALAPPDATA || ae.join(Ft, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: ae.join(r, e, "Data"),
    config: ae.join(t, e, "Config"),
    cache: ae.join(r, e, "Cache"),
    log: ae.join(r, e, "Log"),
    temp: ae.join(ba, e)
  };
}, Od = (e) => {
  const t = ae.basename(Ft);
  return {
    data: ae.join(vr.XDG_DATA_HOME || ae.join(Ft, ".local", "share"), e),
    config: ae.join(vr.XDG_CONFIG_HOME || ae.join(Ft, ".config"), e),
    cache: ae.join(vr.XDG_CACHE_HOME || ae.join(Ft, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: ae.join(vr.XDG_STATE_HOME || ae.join(Ft, ".local", "state"), e),
    temp: ae.join(ba, t, e)
  };
};
function Td(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), $e.platform === "darwin" ? Nd(e) : $e.platform === "win32" ? Rd(e) : Od(e);
}
const Tt = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    return e.apply(void 0, s).catch(r);
  };
}, vt = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    try {
      return e.apply(void 0, s);
    } catch (a) {
      return r(a);
    }
  };
}, Id = 250, It = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: a } = s, o = s.interval ?? Id, l = Date.now() + a;
    return function c(...d) {
      return e.apply(void 0, d).catch((u) => {
        if (!r(u) || Date.now() >= l)
          throw u;
        const h = Math.round(o * Math.random());
        return h > 0 ? new Promise(($) => setTimeout($, h)).then(() => c.apply(void 0, d)) : c.apply(void 0, d);
      });
    };
  };
}, jt = (e, t) => {
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
}, wr = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!wr.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !jd && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!wr.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!wr.isNodeError(e))
      throw e;
    if (!wr.isChangeErrorOk(e))
      throw e;
  }
}, En = {
  onError: wr.onChangeError
}, We = {
  onError: () => {
  }
}, jd = $e.getuid ? !$e.getuid() : !1, Ae = {
  isRetriable: wr.isRetriableError
}, De = {
  attempt: {
    /* ASYNC */
    chmod: Tt(ke(te.chmod), En),
    chown: Tt(ke(te.chown), En),
    close: Tt(ke(te.close), We),
    fsync: Tt(ke(te.fsync), We),
    mkdir: Tt(ke(te.mkdir), We),
    realpath: Tt(ke(te.realpath), We),
    stat: Tt(ke(te.stat), We),
    unlink: Tt(ke(te.unlink), We),
    /* SYNC */
    chmodSync: vt(te.chmodSync, En),
    chownSync: vt(te.chownSync, En),
    closeSync: vt(te.closeSync, We),
    existsSync: vt(te.existsSync, We),
    fsyncSync: vt(te.fsync, We),
    mkdirSync: vt(te.mkdirSync, We),
    realpathSync: vt(te.realpathSync, We),
    statSync: vt(te.statSync, We),
    unlinkSync: vt(te.unlinkSync, We)
  },
  retry: {
    /* ASYNC */
    close: It(ke(te.close), Ae),
    fsync: It(ke(te.fsync), Ae),
    open: It(ke(te.open), Ae),
    readFile: It(ke(te.readFile), Ae),
    rename: It(ke(te.rename), Ae),
    stat: It(ke(te.stat), Ae),
    write: It(ke(te.write), Ae),
    writeFile: It(ke(te.writeFile), Ae),
    /* SYNC */
    closeSync: jt(te.closeSync, Ae),
    fsyncSync: jt(te.fsyncSync, Ae),
    openSync: jt(te.openSync, Ae),
    readFileSync: jt(te.readFileSync, Ae),
    renameSync: jt(te.renameSync, Ae),
    statSync: jt(te.statSync, Ae),
    writeSync: jt(te.writeSync, Ae),
    writeFileSync: jt(te.writeFileSync, Ae)
  }
}, kd = "utf8", Ii = 438, Ad = 511, Cd = {}, Dd = $e.geteuid ? $e.geteuid() : -1, Md = $e.getegid ? $e.getegid() : -1, Vd = 1e3, Ld = !!$e.getuid;
$e.getuid && $e.getuid();
const ji = 128, Fd = (e) => e instanceof Error && "code" in e, ki = (e) => typeof e == "string", As = (e) => e === void 0, zd = $e.platform === "linux", hl = $e.platform === "win32", Sa = ["SIGHUP", "SIGINT", "SIGTERM"];
hl || Sa.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
zd && Sa.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class Ud {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (hl && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? $e.kill($e.pid, "SIGTERM") : $e.kill($e.pid, t));
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
const qd = new Ud(), Kd = qd.register, Me = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${s}`;
  },
  get: (e, t, r = !0) => {
    const n = Me.truncate(t(e));
    return n in Me.store ? Me.get(e, t, r) : (Me.store[n] = r, [n, () => delete Me.store[n]]);
  },
  purge: (e) => {
    Me.store[e] && (delete Me.store[e], De.attempt.unlink(e));
  },
  purgeSync: (e) => {
    Me.store[e] && (delete Me.store[e], De.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in Me.store)
      Me.purgeSync(e);
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
Kd(Me.purgeSyncAll);
function ml(e, t, r = Cd) {
  if (ki(r))
    return ml(e, t, { encoding: r });
  const s = { timeout: r.timeout ?? Vd };
  let a = null, o = null, l = null;
  try {
    const c = De.attempt.realpathSync(e), d = !!c;
    e = c || e, [o, a] = Me.get(e, r.tmpCreate || Me.create, r.tmpPurge !== !1);
    const u = Ld && As(r.chown), h = As(r.mode);
    if (d && (u || h)) {
      const w = De.attempt.statSync(e);
      w && (r = { ...r }, u && (r.chown = { uid: w.uid, gid: w.gid }), h && (r.mode = w.mode));
    }
    if (!d) {
      const w = ae.dirname(e);
      De.attempt.mkdirSync(w, {
        mode: Ad,
        recursive: !0
      });
    }
    l = De.retry.openSync(s)(o, "w", r.mode || Ii), r.tmpCreated && r.tmpCreated(o), ki(t) ? De.retry.writeSync(s)(l, t, 0, r.encoding || kd) : As(t) || De.retry.writeSync(s)(l, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? De.retry.fsyncSync(s)(l) : De.attempt.fsync(l)), De.retry.closeSync(s)(l), l = null, r.chown && (r.chown.uid !== Dd || r.chown.gid !== Md) && De.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== Ii && De.attempt.chmodSync(o, r.mode);
    try {
      De.retry.renameSync(s)(o, e);
    } catch (w) {
      if (!Fd(w) || w.code !== "ENAMETOOLONG")
        throw w;
      De.retry.renameSync(s)(o, Me.truncate(e));
    }
    a(), o = null;
  } finally {
    l && De.attempt.closeSync(l), o && Me.purge(o);
  }
}
function pl(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ra = { exports: {} }, $l = {}, lt = {}, kr = {}, $n = {}, re = {}, hn = {};
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
})(hn);
var na = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = hn;
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
  const t = hn, r = na;
  var n = hn;
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
        const k = b[j];
        k.optimizeNames(i, f) || (ue(i, k.names), b.splice(j, 1));
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
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: b, from: j, to: k } = this;
      return `for(${f} ${b}=${j}; ${b}<${k}; ${b}++)` + super.render(i);
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
      const k = this._scope.toName(f);
      return b !== void 0 && j && (this._constants[k.str] = b), this._leafNode(new o(i, k, b)), k;
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
    forRange(i, f, b, j, k = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const G = this._scope.toName(i);
      return this._for(new O(k, G, f, b), () => j(G));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, j = r.varKinds.const) {
      const k = this._scope.toName(i);
      if (this.opts.es5) {
        const G = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${G}.length`, (U) => {
          this.var(k, (0, t._)`${G}[${U}]`), b(k);
        });
      }
      return this._for(new I("of", j, k, f), () => b(k));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, b, j = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, b);
      const k = this._scope.toName(i);
      return this._for(new I("in", j, k, f), () => b(k));
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
        const k = this.name("e");
        this._currNode = j.catch = new he(k), f(k);
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
    return new t._Code(y._items.reduce((k, G) => (G instanceof t.Name && (G = b(G)), G instanceof t._Code ? k.push(...G._items) : k.push(G), k), []));
    function b(k) {
      const G = f[k.str];
      return G === void 0 || i[k.str] !== 1 ? k : (delete i[k.str], G);
    }
    function j(k) {
      return k instanceof t._Code && k._items.some((G) => G instanceof t.Name && i[G.str] === 1 && f[G.str] !== void 0);
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
const de = re, Gd = hn;
function Hd(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
L.toHash = Hd;
function Bd(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (yl(e, t), !gl(t, e.self.RULES.all));
}
L.alwaysValidSchema = Bd;
function yl(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || wl(e, `unknown keyword: "${a}"`);
}
L.checkUnknownRules = yl;
function gl(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
L.schemaHasRules = gl;
function Wd(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
L.schemaHasRulesButRef = Wd;
function Xd({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, de._)`${r}`;
  }
  return (0, de._)`${e}${t}${(0, de.getProperty)(n)}`;
}
L.schemaRefOrVal = Xd;
function Jd(e) {
  return _l(decodeURIComponent(e));
}
L.unescapeFragment = Jd;
function Yd(e) {
  return encodeURIComponent(Pa(e));
}
L.escapeFragment = Yd;
function Pa(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
L.escapeJsonPointer = Pa;
function _l(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
L.unescapeJsonPointer = _l;
function Qd(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
L.eachItem = Qd;
function Ai({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, l) => {
    const c = o === void 0 ? a : o instanceof de.Name ? (a instanceof de.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof de.Name ? (t(s, o, a), a) : r(a, o);
    return l === de.Name && !(c instanceof de.Name) ? n(s, c) : c;
  };
}
L.mergeEvaluated = {
  props: Ai({
    mergeNames: (e, t, r) => e.if((0, de._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, de._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, de._)`${r} || {}`).code((0, de._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, de._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, de._)`${r} || {}`), Na(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: vl
  }),
  items: Ai({
    mergeNames: (e, t, r) => e.if((0, de._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, de._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, de._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, de._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function vl(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, de._)`{}`);
  return t !== void 0 && Na(e, r, t), r;
}
L.evaluatedPropsToName = vl;
function Na(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, de._)`${t}${(0, de.getProperty)(n)}`, !0));
}
L.setEvaluated = Na;
const Ci = {};
function Zd(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Ci[t.code] || (Ci[t.code] = new Gd._Code(t.code))
  });
}
L.useFunc = Zd;
var sa;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(sa || (L.Type = sa = {}));
function xd(e, t, r) {
  if (e instanceof de.Name) {
    const n = t === sa.Num;
    return r ? n ? (0, de._)`"[" + ${e} + "]"` : (0, de._)`"['" + ${e} + "']"` : n ? (0, de._)`"/" + ${e}` : (0, de._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, de.getProperty)(e).toString() : "/" + Pa(e);
}
L.getErrorPath = xd;
function wl(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
L.checkStrictMode = wl;
var Je = {};
Object.defineProperty(Je, "__esModule", { value: !0 });
const Ce = re, ef = {
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
Je.default = ef;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = re, r = L, n = Je;
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
})($n);
Object.defineProperty(kr, "__esModule", { value: !0 });
kr.boolOrEmptySchema = kr.topBoolOrEmptySchema = void 0;
const tf = $n, rf = re, nf = Je, sf = {
  message: "boolean schema is false"
};
function af(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? El(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(nf.default.data) : (t.assign((0, rf._)`${n}.errors`, null), t.return(!0));
}
kr.topBoolOrEmptySchema = af;
function of(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), El(e)) : r.var(t, !0);
}
kr.boolOrEmptySchema = of;
function El(e, t) {
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
  (0, tf.reportError)(s, sf, void 0, t);
}
var Ee = {}, lr = {};
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.getRules = lr.isJSONType = void 0;
const cf = ["string", "number", "integer", "boolean", "null", "object", "array"], lf = new Set(cf);
function uf(e) {
  return typeof e == "string" && lf.has(e);
}
lr.isJSONType = uf;
function df() {
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
lr.getRules = df;
var Nt = {};
Object.defineProperty(Nt, "__esModule", { value: !0 });
Nt.shouldUseRule = Nt.shouldUseGroup = Nt.schemaHasRulesForType = void 0;
function ff({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && bl(e, n);
}
Nt.schemaHasRulesForType = ff;
function bl(e, t) {
  return t.rules.some((r) => Sl(e, r));
}
Nt.shouldUseGroup = bl;
function Sl(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
Nt.shouldUseRule = Sl;
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.reportTypeError = Ee.checkDataTypes = Ee.checkDataType = Ee.coerceAndCheckDataType = Ee.getJSONTypes = Ee.getSchemaTypes = Ee.DataType = void 0;
const hf = lr, mf = Nt, pf = $n, ne = re, Pl = L;
var Nr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Nr || (Ee.DataType = Nr = {}));
function $f(e) {
  const t = Nl(e.type);
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
Ee.getSchemaTypes = $f;
function Nl(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(hf.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
Ee.getJSONTypes = Nl;
function yf(e, t) {
  const { gen: r, data: n, opts: s } = e, a = gf(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, mf.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const l = Ra(t, n, s.strictNumbers, Nr.Wrong);
    r.if(l, () => {
      a.length ? _f(e, t, a) : Oa(e);
    });
  }
  return o;
}
Ee.coerceAndCheckDataType = yf;
const Rl = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function gf(e, t) {
  return t ? e.filter((r) => Rl.has(r) || t === "array" && r === "array") : [];
}
function _f(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, ne._)`typeof ${s}`), l = n.let("coerced", (0, ne._)`undefined`);
  a.coerceTypes === "array" && n.if((0, ne._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, ne._)`${s}[0]`).assign(o, (0, ne._)`typeof ${s}`).if(Ra(t, s, a.strictNumbers), () => n.assign(l, s))), n.if((0, ne._)`${l} !== undefined`);
  for (const d of r)
    (Rl.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), Oa(e), n.endIf(), n.if((0, ne._)`${l} !== undefined`, () => {
    n.assign(s, l), vf(e, l);
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
function vf({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, ne._)`${t} !== undefined`, () => e.assign((0, ne._)`${t}[${r}]`, n));
}
function aa(e, t, r, n = Nr.Correct) {
  const s = n === Nr.Correct ? ne.operators.EQ : ne.operators.NEQ;
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
  return n === Nr.Correct ? a : (0, ne.not)(a);
  function o(l = ne.nil) {
    return (0, ne.and)((0, ne._)`typeof ${t} == "number"`, l, r ? (0, ne._)`isFinite(${t})` : ne.nil);
  }
}
Ee.checkDataType = aa;
function Ra(e, t, r, n) {
  if (e.length === 1)
    return aa(e[0], t, r, n);
  let s;
  const a = (0, Pl.toHash)(e);
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
const wf = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, ne._)`{type: ${e}}` : (0, ne._)`{type: ${t}}`
};
function Oa(e) {
  const t = Ef(e);
  (0, pf.reportError)(t, wf);
}
Ee.reportTypeError = Oa;
function Ef(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Pl.schemaRefOrVal)(e, n, "type");
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
const mr = re, bf = L;
function Sf(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Di(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => Di(e, a, s.default));
}
us.assignDefaults = Sf;
function Di(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const l = (0, mr._)`${a}${(0, mr.getProperty)(t)}`;
  if (s) {
    (0, bf.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let c = (0, mr._)`${l} === undefined`;
  o.useDefaults === "empty" && (c = (0, mr._)`${c} || ${l} === null || ${l} === ""`), n.if(c, (0, mr._)`${l} = ${(0, mr.stringify)(r)}`);
}
var gt = {}, ie = {};
Object.defineProperty(ie, "__esModule", { value: !0 });
ie.validateUnion = ie.validateArray = ie.usePattern = ie.callValidateCode = ie.schemaProperties = ie.allSchemaProperties = ie.noPropertyInData = ie.propertyInData = ie.isOwnProperty = ie.hasPropFunc = ie.reportMissingProp = ie.checkMissingProp = ie.checkReportMissingProp = void 0;
const me = re, Ta = L, kt = Je, Pf = L;
function Nf(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(ja(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, me._)`${t}` }, !0), e.error();
  });
}
ie.checkReportMissingProp = Nf;
function Rf({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, me.or)(...n.map((a) => (0, me.and)(ja(e, t, a, r.ownProperties), (0, me._)`${s} = ${a}`)));
}
ie.checkMissingProp = Rf;
function Of(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ie.reportMissingProp = Of;
function Ol(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, me._)`Object.prototype.hasOwnProperty`
  });
}
ie.hasPropFunc = Ol;
function Ia(e, t, r) {
  return (0, me._)`${Ol(e)}.call(${t}, ${r})`;
}
ie.isOwnProperty = Ia;
function Tf(e, t, r, n) {
  const s = (0, me._)`${t}${(0, me.getProperty)(r)} !== undefined`;
  return n ? (0, me._)`${s} && ${Ia(e, t, r)}` : s;
}
ie.propertyInData = Tf;
function ja(e, t, r, n) {
  const s = (0, me._)`${t}${(0, me.getProperty)(r)} === undefined`;
  return n ? (0, me.or)(s, (0, me.not)(Ia(e, t, r))) : s;
}
ie.noPropertyInData = ja;
function Tl(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ie.allSchemaProperties = Tl;
function If(e, t) {
  return Tl(t).filter((r) => !(0, Ta.alwaysValidSchema)(e, t[r]));
}
ie.schemaProperties = If;
function jf({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, l, c, d) {
  const u = d ? (0, me._)`${e}, ${t}, ${n}${s}` : t, h = [
    [kt.default.instancePath, (0, me.strConcat)(kt.default.instancePath, a)],
    [kt.default.parentData, o.parentData],
    [kt.default.parentDataProperty, o.parentDataProperty],
    [kt.default.rootData, kt.default.rootData]
  ];
  o.opts.dynamicRef && h.push([kt.default.dynamicAnchors, kt.default.dynamicAnchors]);
  const w = (0, me._)`${u}, ${r.object(...h)}`;
  return c !== me.nil ? (0, me._)`${l}.call(${c}, ${w})` : (0, me._)`${l}(${w})`;
}
ie.callValidateCode = jf;
const kf = (0, me._)`new RegExp`;
function Af({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, me._)`${s.code === "new RegExp" ? kf : (0, Pf.useFunc)(e, s)}(${r}, ${n})`
  });
}
ie.usePattern = Af;
function Cf(e) {
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
ie.validateArray = Cf;
function Df(e) {
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
ie.validateUnion = Df;
Object.defineProperty(gt, "__esModule", { value: !0 });
gt.validateKeywordUsage = gt.validSchemaType = gt.funcKeywordCode = gt.macroKeywordCode = void 0;
const Fe = re, Zt = Je, Mf = ie, Vf = $n;
function Lf(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, l = t.macro.call(o.self, s, a, o), c = Il(r, n, l);
  o.opts.validateSchema !== !1 && o.self.validateSchema(l, !0);
  const d = r.name("valid");
  e.subschema({
    schema: l,
    schemaPath: Fe.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
gt.macroKeywordCode = Lf;
function Ff(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: l, it: c } = e;
  Uf(c, t);
  const d = !l && t.compile ? t.compile.call(c.self, a, o, c) : t.validate, u = Il(n, s, d), h = n.let("valid");
  e.block$data(h, w), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function w() {
    if (t.errors === !1)
      _(), t.modifying && Mi(e), g(() => e.error());
    else {
      const m = t.async ? $() : v();
      t.modifying && Mi(e), g(() => zf(e, m));
    }
  }
  function $() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, Fe._)`await `), (E) => n.assign(h, !1).if((0, Fe._)`${E} instanceof ${c.ValidationError}`, () => n.assign(m, (0, Fe._)`${E}.errors`), () => n.throw(E))), m;
  }
  function v() {
    const m = (0, Fe._)`${u}.errors`;
    return n.assign(m, null), _(Fe.nil), m;
  }
  function _(m = t.async ? (0, Fe._)`await ` : Fe.nil) {
    const E = c.opts.passContext ? Zt.default.this : Zt.default.self, R = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, Fe._)`${m}${(0, Mf.callValidateCode)(e, u, E, R)}`, t.modifying);
  }
  function g(m) {
    var E;
    n.if((0, Fe.not)((E = t.valid) !== null && E !== void 0 ? E : h), m);
  }
}
gt.funcKeywordCode = Ff;
function Mi(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Fe._)`${n.parentData}[${n.parentDataProperty}]`));
}
function zf(e, t) {
  const { gen: r } = e;
  r.if((0, Fe._)`Array.isArray(${t})`, () => {
    r.assign(Zt.default.vErrors, (0, Fe._)`${Zt.default.vErrors} === null ? ${t} : ${Zt.default.vErrors}.concat(${t})`).assign(Zt.default.errors, (0, Fe._)`${Zt.default.vErrors}.length`), (0, Vf.extendErrors)(e);
  }, () => e.error());
}
function Uf({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Il(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Fe.stringify)(r) });
}
function qf(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
gt.validSchemaType = qf;
function Kf({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
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
gt.validateKeywordUsage = Kf;
var Gt = {};
Object.defineProperty(Gt, "__esModule", { value: !0 });
Gt.extendSubschemaMode = Gt.extendSubschemaData = Gt.getSubschema = void 0;
const yt = re, jl = L;
function Gf(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const l = e.schema[t];
    return r === void 0 ? {
      schema: l,
      schemaPath: (0, yt._)`${e.schemaPath}${(0, yt.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: l[r],
      schemaPath: (0, yt._)`${e.schemaPath}${(0, yt.getProperty)(t)}${(0, yt.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, jl.escapeFragment)(r)}`
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
Gt.getSubschema = Gf;
function Hf(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, w = l.let("data", (0, yt._)`${t.data}${(0, yt.getProperty)(r)}`, !0);
    c(w), e.errorPath = (0, yt.str)`${d}${(0, jl.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, yt._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof yt.Name ? s : l.let("data", s, !0);
    c(d), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Gt.extendSubschemaData = Hf;
function Bf(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Gt.extendSubschemaMode = Bf;
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
}, kl = { exports: {} }, qt = kl.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Gn(t, n, s, e, "", e);
};
qt.keywords = {
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
qt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
qt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
qt.skipKeywords = {
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
        if (u in qt.arrayKeywords)
          for (var w = 0; w < h.length; w++)
            Gn(e, t, r, h[w], s + "/" + u + "/" + w, a, s, u, n, w);
      } else if (u in qt.propsKeywords) {
        if (h && typeof h == "object")
          for (var $ in h)
            Gn(e, t, r, h[$], s + "/" + u + "/" + Wf($), a, s, u, n, $);
      } else (u in qt.keywords || e.allKeys && !(u in qt.skipKeywords)) && Gn(e, t, r, h, s + "/" + u, a, s, u, n);
    }
    r(n, s, a, o, l, c, d);
  }
}
function Wf(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Xf = kl.exports;
Object.defineProperty(Te, "__esModule", { value: !0 });
Te.getSchemaRefs = Te.resolveUrl = Te.normalizeId = Te._getFullPath = Te.getFullPath = Te.inlineRef = void 0;
const Jf = L, Yf = ds, Qf = Xf, Zf = /* @__PURE__ */ new Set([
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
function xf(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !oa(e) : t ? Al(e) <= t : !1;
}
Te.inlineRef = xf;
const eh = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function oa(e) {
  for (const t in e) {
    if (eh.has(t))
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
    if (t++, !Zf.has(r) && (typeof e[r] == "object" && (0, Jf.eachItem)(e[r], (n) => t += Al(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Cl(e, t = "", r) {
  r !== !1 && (t = Rr(t));
  const n = e.parse(t);
  return Dl(e, n);
}
Te.getFullPath = Cl;
function Dl(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Te._getFullPath = Dl;
const th = /#\/?$/;
function Rr(e) {
  return e ? e.replace(th, "") : "";
}
Te.normalizeId = Rr;
function rh(e, t, r) {
  return r = Rr(r), e.resolve(t, r);
}
Te.resolveUrl = rh;
const nh = /^[a-z_][-a-z0-9._]*$/i;
function sh(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Rr(e[r] || t), a = { "": s }, o = Cl(n, s, !1), l = {}, c = /* @__PURE__ */ new Set();
  return Qf(e, { allKeys: !0 }, (h, w, $, v) => {
    if (v === void 0)
      return;
    const _ = o + w;
    let g = a[v];
    typeof h[r] == "string" && (g = m.call(this, h[r])), E.call(this, h.$anchor), E.call(this, h.$dynamicAnchor), a[w] = g;
    function m(R) {
      const O = this.opts.uriResolver.resolve;
      if (R = Rr(g ? O(g, R) : R), c.has(R))
        throw u(R);
      c.add(R);
      let I = this.refs[R];
      return typeof I == "string" && (I = this.refs[I]), typeof I == "object" ? d(h, I.schema, R) : R !== Rr(_) && (R[0] === "#" ? (d(h, l[R], R), l[R] = h) : this.refs[R] = _), R;
    }
    function E(R) {
      if (typeof R == "string") {
        if (!nh.test(R))
          throw new Error(`invalid anchor "${R}"`);
        m.call(this, `#${R}`);
      }
    }
  }), l;
  function d(h, w, $) {
    if (w !== void 0 && !Yf(h, w))
      throw u($);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Te.getSchemaRefs = sh;
Object.defineProperty(lt, "__esModule", { value: !0 });
lt.getData = lt.KeywordCxt = lt.validateFunctionCode = void 0;
const Ml = kr, Vi = Ee, ka = Nt, es = Ee, ah = us, tn = gt, Cs = Gt, X = re, Z = Je, oh = Te, Rt = L, Xr = $n;
function ih(e) {
  if (Fl(e) && (zl(e), Ll(e))) {
    uh(e);
    return;
  }
  Vl(e, () => (0, Ml.topBoolOrEmptySchema)(e));
}
lt.validateFunctionCode = ih;
function Vl({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, X._)`${Z.default.data}, ${Z.default.valCxt}`, n.$async, () => {
    e.code((0, X._)`"use strict"; ${Li(r, s)}`), lh(e, s), e.code(a);
  }) : e.func(t, (0, X._)`${Z.default.data}, ${ch(s)}`, n.$async, () => e.code(Li(r, s)).code(a));
}
function ch(e) {
  return (0, X._)`{${Z.default.instancePath}="", ${Z.default.parentData}, ${Z.default.parentDataProperty}, ${Z.default.rootData}=${Z.default.data}${e.dynamicRef ? (0, X._)`, ${Z.default.dynamicAnchors}={}` : X.nil}}={}`;
}
function lh(e, t) {
  e.if(Z.default.valCxt, () => {
    e.var(Z.default.instancePath, (0, X._)`${Z.default.valCxt}.${Z.default.instancePath}`), e.var(Z.default.parentData, (0, X._)`${Z.default.valCxt}.${Z.default.parentData}`), e.var(Z.default.parentDataProperty, (0, X._)`${Z.default.valCxt}.${Z.default.parentDataProperty}`), e.var(Z.default.rootData, (0, X._)`${Z.default.valCxt}.${Z.default.rootData}`), t.dynamicRef && e.var(Z.default.dynamicAnchors, (0, X._)`${Z.default.valCxt}.${Z.default.dynamicAnchors}`);
  }, () => {
    e.var(Z.default.instancePath, (0, X._)`""`), e.var(Z.default.parentData, (0, X._)`undefined`), e.var(Z.default.parentDataProperty, (0, X._)`undefined`), e.var(Z.default.rootData, Z.default.data), t.dynamicRef && e.var(Z.default.dynamicAnchors, (0, X._)`{}`);
  });
}
function uh(e) {
  const { schema: t, opts: r, gen: n } = e;
  Vl(e, () => {
    r.$comment && t.$comment && ql(e), ph(e), n.let(Z.default.vErrors, null), n.let(Z.default.errors, 0), r.unevaluated && dh(e), Ul(e), gh(e);
  });
}
function dh(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, X._)`${r}.evaluated`), t.if((0, X._)`${e.evaluated}.dynamicProps`, () => t.assign((0, X._)`${e.evaluated}.props`, (0, X._)`undefined`)), t.if((0, X._)`${e.evaluated}.dynamicItems`, () => t.assign((0, X._)`${e.evaluated}.items`, (0, X._)`undefined`));
}
function Li(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, X._)`/*# sourceURL=${r} */` : X.nil;
}
function fh(e, t) {
  if (Fl(e) && (zl(e), Ll(e))) {
    hh(e, t);
    return;
  }
  (0, Ml.boolOrEmptySchema)(e, t);
}
function Ll({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Fl(e) {
  return typeof e.schema != "boolean";
}
function hh(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && ql(e), $h(e), yh(e);
  const a = n.const("_errs", Z.default.errors);
  Ul(e, a), n.var(t, (0, X._)`${a} === ${Z.default.errors}`);
}
function zl(e) {
  (0, Rt.checkUnknownRules)(e), mh(e);
}
function Ul(e, t) {
  if (e.opts.jtd)
    return Fi(e, [], !1, t);
  const r = (0, Vi.getSchemaTypes)(e.schema), n = (0, Vi.coerceAndCheckDataType)(e, r);
  Fi(e, r, !n, t);
}
function mh(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, Rt.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function ph(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, Rt.checkStrictMode)(e, "default is ignored in the schema root");
}
function $h(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, oh.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function yh(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function ql({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, X._)`${Z.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, X.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, X._)`${Z.default.self}.opts.$comment(${a}, ${o}, ${l}.schema)`);
  }
}
function gh(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, X._)`${Z.default.errors} === 0`, () => t.return(Z.default.data), () => t.throw((0, X._)`new ${s}(${Z.default.vErrors})`)) : (t.assign((0, X._)`${n}.errors`, Z.default.vErrors), a.unevaluated && _h(e), t.return((0, X._)`${Z.default.errors} === 0`));
}
function _h({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof X.Name && e.assign((0, X._)`${t}.props`, r), n instanceof X.Name && e.assign((0, X._)`${t}.items`, n);
}
function Fi(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: l, opts: c, self: d } = e, { RULES: u } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, Rt.schemaHasRulesButRef)(a, u))) {
    s.block(() => Hl(e, "$ref", u.all.$ref.definition));
    return;
  }
  c.jtd || vh(e, t), s.block(() => {
    for (const w of u.rules)
      h(w);
    h(u.post);
  });
  function h(w) {
    (0, ka.shouldUseGroup)(a, w) && (w.type ? (s.if((0, es.checkDataType)(w.type, o, c.strictNumbers)), zi(e, w), t.length === 1 && t[0] === w.type && r && (s.else(), (0, es.reportTypeError)(e)), s.endIf()) : zi(e, w), l || s.if((0, X._)`${Z.default.errors} === ${n || 0}`));
  }
}
function zi(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, ah.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, ka.shouldUseRule)(n, a) && Hl(e, a.keyword, a.definition, t.type);
  });
}
function vh(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (wh(e, t), e.opts.allowUnionTypes || Eh(e, t), bh(e, e.dataTypes));
}
function wh(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Kl(e.dataTypes, r) || Aa(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), Ph(e, t);
  }
}
function Eh(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Aa(e, "use allowUnionTypes to allow union type keyword");
}
function bh(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, ka.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => Sh(t, o)) && Aa(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function Sh(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Kl(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function Ph(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Kl(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Aa(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, Rt.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Gl {
  constructor(t, r, n) {
    if ((0, tn.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Rt.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Bl(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, tn.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
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
    (t ? Xr.reportExtraError : Xr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Xr.reportError)(this, this.def.$dataError || Xr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Xr.resetErrorsCount)(this.gen, this.errsCount);
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
    return fh(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = Rt.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = Rt.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, X.Name)), !0;
  }
}
lt.KeywordCxt = Gl;
function Hl(e, t, r, n) {
  const s = new Gl(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, tn.funcKeywordCode)(s, r) : "macro" in r ? (0, tn.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, tn.funcKeywordCode)(s, r);
}
const Nh = /^\/(?:[^~]|~0|~1)*$/, Rh = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Bl(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return Z.default.rootData;
  if (e[0] === "/") {
    if (!Nh.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = Z.default.rootData;
  } else {
    const d = Rh.exec(e);
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
    d && (a = (0, X._)`${a}${(0, X.getProperty)((0, Rt.unescapeJsonPointer)(d))}`, o = (0, X._)`${o} && ${a}`);
  return o;
  function c(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
lt.getData = Bl;
var bn = {}, Ui;
function Ca() {
  if (Ui) return bn;
  Ui = 1, Object.defineProperty(bn, "__esModule", { value: !0 });
  class e extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return bn.default = e, bn;
}
var Mr = {};
Object.defineProperty(Mr, "__esModule", { value: !0 });
const Ds = Te;
let Oh = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Ds.resolveUrl)(t, r, n), this.missingSchema = (0, Ds.normalizeId)((0, Ds.getFullPath)(t, this.missingRef));
  }
};
Mr.default = Oh;
var ze = {};
Object.defineProperty(ze, "__esModule", { value: !0 });
ze.resolveSchema = ze.getCompilingSchema = ze.resolveRef = ze.compileSchema = ze.SchemaEnv = void 0;
const tt = re, Th = Ca(), Jt = Je, ot = Te, qi = L, Ih = lt;
let fs = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, ot.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
ze.SchemaEnv = fs;
function Da(e) {
  const t = Wl.call(this, e);
  if (t)
    return t;
  const r = (0, ot.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new tt.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let l;
  e.$async && (l = o.scopeValue("Error", {
    ref: Th.default,
    code: (0, tt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: Jt.default.data,
    parentData: Jt.default.parentData,
    parentDataProperty: Jt.default.parentDataProperty,
    dataNames: [Jt.default.data],
    dataPathArr: [tt.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, tt.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: l,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: tt.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, tt._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, Ih.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    u = `${o.scopeRefs(Jt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const $ = new Function(`${Jt.default.self}`, `${Jt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(c, { ref: $ }), $.errors = null, $.schema = e.schema, $.schemaEnv = e, e.$async && ($.$async = !0), this.opts.code.source === !0 && ($.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: v, items: _ } = d;
      $.evaluated = {
        props: v instanceof tt.Name ? void 0 : v,
        items: _ instanceof tt.Name ? void 0 : _,
        dynamicProps: v instanceof tt.Name,
        dynamicItems: _ instanceof tt.Name
      }, $.source && ($.source.evaluated = (0, tt.stringify)($.evaluated));
    }
    return e.validate = $, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
ze.compileSchema = Da;
function jh(e, t, r) {
  var n;
  r = (0, ot.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = Ch.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    o && (a = new fs({ schema: o, schemaId: l, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = kh.call(this, a);
}
ze.resolveRef = jh;
function kh(e) {
  return (0, ot.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Da.call(this, e);
}
function Wl(e) {
  for (const t of this._compilations)
    if (Ah(t, e))
      return t;
}
ze.getCompilingSchema = Wl;
function Ah(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Ch(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || hs.call(this, e, t);
}
function hs(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, ot._getFullPath)(this.opts.uriResolver, r);
  let s = (0, ot.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Ms.call(this, r, e);
  const a = (0, ot.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const l = hs.call(this, e, o);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : Ms.call(this, r, l);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Da.call(this, o), a === (0, ot.normalizeId)(t)) {
      const { schema: l } = o, { schemaId: c } = this.opts, d = l[c];
      return d && (s = (0, ot.resolveUrl)(this.opts.uriResolver, s, d)), new fs({ schema: l, schemaId: c, root: e, baseId: s });
    }
    return Ms.call(this, r, o);
  }
}
ze.resolveSchema = hs;
const Dh = /* @__PURE__ */ new Set([
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
    !Dh.has(l) && d && (t = (0, ot.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, qi.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, ot.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = hs.call(this, n, l);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new fs({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const Mh = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Vh = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Lh = "object", Fh = [
  "$data"
], zh = {
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
}, Uh = !1, qh = {
  $id: Mh,
  description: Vh,
  type: Lh,
  required: Fh,
  properties: zh,
  additionalProperties: Uh
};
var Ma = {}, ms = { exports: {} };
const Kh = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), Xl = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u), Va = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu), Jl = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu), Gh = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
function Yl(e) {
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
const Hh = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function Ki(e) {
  return e.length = 0, !0;
}
function Bh(e, t, r) {
  if (e.length) {
    const n = Yl(e);
    if (n !== "")
      t.push(n);
    else
      return r.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function Wh(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, o = !1, l = Bh;
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
  return s.length && (l === Ki ? r.zone = s.join("") : o ? n.push(s.join("")) : n.push(Yl(s))), r.address = n.join(""), r;
}
function Ql(e) {
  if (Xh(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = Wh(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function Xh(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function Jh(e) {
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
const Yh = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" }, Qh = /[@/?#:]/g, Zh = /[@/?#]/g;
function Zl(e, t) {
  const r = t ? Zh : Qh;
  return r.lastIndex = 0, e.replace(r, (n) => Yh[n]);
}
function xh(e, t = !1) {
  if (e.indexOf("%") === -1)
    return e;
  let r = "";
  for (let n = 0; n < e.length; n++) {
    if (e[n] === "%" && n + 2 < e.length) {
      const s = e.slice(n + 1, n + 3);
      if (Va(s)) {
        const a = s.toUpperCase(), o = String.fromCharCode(parseInt(a, 16));
        t && Jl(o) ? r += o : r += "%" + a, n += 2;
        continue;
      }
    }
    r += e[n];
  }
  return r;
}
function em(e) {
  let t = "";
  for (let r = 0; r < e.length; r++) {
    if (e[r] === "%" && r + 2 < e.length) {
      const n = e.slice(r + 1, r + 3);
      if (Va(n)) {
        const s = n.toUpperCase(), a = String.fromCharCode(parseInt(s, 16));
        a !== "." && Jl(a) ? t += a : t += "%" + s, r += 2;
        continue;
      }
    }
    Gh(e[r]) ? t += e[r] : t += escape(e[r]);
  }
  return t;
}
function tm(e) {
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
function rm(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    if (!Xl(r)) {
      const n = Ql(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = Zl(r, !1);
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var xl = {
  nonSimpleDomain: Hh,
  recomposeAuthority: rm,
  reescapeHostDelimiters: Zl,
  normalizePercentEncoding: xh,
  normalizePathEncoding: em,
  escapePreservingEscapes: tm,
  removeDotSegments: Jh,
  isIPv4: Xl,
  isUUID: Kh,
  normalizeIPv6: Ql
};
const { isUUID: nm } = xl, sm = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function eu(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function tu(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function ru(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function am(e) {
  return e.secure = eu(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function om(e) {
  if ((e.port === (eu(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function im(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(sm);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, a = La(s);
    e.path = void 0, a && (e = a.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function cm(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, a = La(s);
  a && (e = a.serialize(e, t));
  const o = e, l = e.nss;
  return o.path = `${n || t.nid}:${l}`, t.skipEscape = !0, o;
}
function lm(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !nm(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function um(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const nu = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: tu,
    serialize: ru
  }
), dm = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: nu.domainHost,
    parse: tu,
    serialize: ru
  }
), Hn = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: am,
    serialize: om
  }
), fm = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: Hn.domainHost,
    parse: Hn.parse,
    serialize: Hn.serialize
  }
), hm = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: im,
    serialize: cm,
    skipNormalize: !0
  }
), mm = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: lm,
    serialize: um,
    skipNormalize: !0
  }
), ts = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: nu,
    https: dm,
    ws: Hn,
    wss: fm,
    urn: hm,
    "urn:uuid": mm
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
var pm = {
  SCHEMES: ts,
  getSchemeHandler: La
};
const { normalizeIPv6: $m, removeDotSegments: Zr, recomposeAuthority: ym, normalizePercentEncoding: gm, normalizePathEncoding: _m, escapePreservingEscapes: vm, reescapeHostDelimiters: wm, isIPv4: Em, nonSimpleDomain: bm } = xl, { SCHEMES: Sm, getSchemeHandler: su } = pm;
function Pm(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  Im(e, t) : typeof e == "object" && (e = /** @type {T} */
  Ar(ur(e, t), t)), e;
}
function Nm(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = au(Ar(e, n), Ar(t, n), n, !0);
  return n.skipEscape = !0, ur(s, n);
}
function au(e, t, r, n) {
  const s = {};
  return n || (e = Ar(ur(e, r), r), t = Ar(ur(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Zr(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Zr(t.path || ""), s.query = t.query) : (t.path ? (t.path[0] === "/" ? s.path = Zr(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = Zr(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function Rm(e, t, r) {
  const n = Gi(e, r), s = Gi(t, r);
  return n !== void 0 && s !== void 0 && n.toLowerCase() === s.toLowerCase();
}
function ur(e, t) {
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
  }, n = Object.assign({}, t), s = [], a = su(n.scheme || r.scheme);
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = gm(r.path) : (r.path = vm(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const o = ym(r);
  if (o !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(o), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let l = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (l = Zr(l)), o === void 0 && l[0] === "/" && l[1] === "/" && (l = "/%2F" + l.slice(2)), s.push(l);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const Om = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Tm(e, t) {
  if (t[2] !== void 0 && e.path && e.path[0] !== "/")
    return 'URI path must start with "/" when authority is present.';
  if (typeof e.port == "number" && (e.port < 0 || e.port > 65535))
    return "URI port is malformed.";
}
function ou(e, t) {
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
  const o = e.match(Om);
  if (o) {
    n.scheme = o[1], n.userinfo = o[3], n.host = o[4], n.port = parseInt(o[5], 10), n.path = o[6] || "", n.query = o[7], n.fragment = o[8], isNaN(n.port) && (n.port = o[5]);
    const l = Tm(n, o);
    if (l !== void 0 && (n.error = n.error || l, s = !0), n.host)
      if (Em(n.host) === !1) {
        const u = $m(n.host);
        n.host = u.host.toLowerCase(), a = u.isIPV6;
      } else
        a = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const c = su(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!c || !c.unicodeSupport) && n.host && (r.domainHost || c && c.domainHost) && a === !1 && bm(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (d) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + d;
      }
    if ((!c || c && !c.skipNormalize) && (e.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = wm(unescape(n.host), a))), n.path && (n.path = _m(n.path)), n.fragment))
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
function Ar(e, t) {
  return ou(e, t).parsed;
}
function Im(e, t) {
  return iu(e, t).normalized;
}
function iu(e, t) {
  const { parsed: r, malformedAuthorityOrPort: n } = ou(e, t);
  return {
    normalized: n ? e : ur(r, t),
    malformedAuthorityOrPort: n
  };
}
function Gi(e, t) {
  if (typeof e == "string") {
    const { normalized: r, malformedAuthorityOrPort: n } = iu(e, t);
    return n ? void 0 : r;
  }
  if (typeof e == "object")
    return ur(e, t);
}
const Fa = {
  SCHEMES: Sm,
  normalize: Pm,
  resolve: Nm,
  resolveComponent: au,
  equal: Rm,
  serialize: ur,
  parse: Ar
};
ms.exports = Fa;
ms.exports.default = Fa;
ms.exports.fastUri = Fa;
var cu = ms.exports;
Object.defineProperty(Ma, "__esModule", { value: !0 });
const lu = cu;
lu.code = 'require("ajv/dist/runtime/uri").default';
Ma.default = lu;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = lt;
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
  const n = Ca(), s = Mr, a = lr, o = ze, l = re, c = Te, d = Ee, u = L, h = qh, w = Ma, $ = (P, p) => new RegExp(P, p);
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
    var p, S, y, i, f, b, j, k, G, U, N, T, A, M, H, x, ge, Le, Se, Pe, _e, ht, je, Bt, Wt;
    const xe = P.strict, Xt = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, Gr = Xt === !0 || Xt === void 0 ? 1 : Xt || 0, Hr = (y = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && y !== void 0 ? y : $, Ts = (i = P.uriResolver) !== null && i !== void 0 ? i : w.default;
    return {
      strictSchema: (b = (f = P.strictSchema) !== null && f !== void 0 ? f : xe) !== null && b !== void 0 ? b : !0,
      strictNumbers: (k = (j = P.strictNumbers) !== null && j !== void 0 ? j : xe) !== null && k !== void 0 ? k : !0,
      strictTypes: (U = (G = P.strictTypes) !== null && G !== void 0 ? G : xe) !== null && U !== void 0 ? U : "log",
      strictTuples: (T = (N = P.strictTuples) !== null && N !== void 0 ? N : xe) !== null && T !== void 0 ? T : "log",
      strictRequired: (M = (A = P.strictRequired) !== null && A !== void 0 ? A : xe) !== null && M !== void 0 ? M : !1,
      code: P.code ? { ...P.code, optimize: Gr, regExp: Hr } : { optimize: Gr, regExp: Hr },
      loopRequired: (H = P.loopRequired) !== null && H !== void 0 ? H : E,
      loopEnum: (x = P.loopEnum) !== null && x !== void 0 ? x : E,
      meta: (ge = P.meta) !== null && ge !== void 0 ? ge : !0,
      messages: (Le = P.messages) !== null && Le !== void 0 ? Le : !0,
      inlineRefs: (Se = P.inlineRefs) !== null && Se !== void 0 ? Se : !0,
      schemaId: (Pe = P.schemaId) !== null && Pe !== void 0 ? Pe : "$id",
      addUsedSchema: (_e = P.addUsedSchema) !== null && _e !== void 0 ? _e : !0,
      validateSchema: (ht = P.validateSchema) !== null && ht !== void 0 ? ht : !0,
      validateFormats: (je = P.validateFormats) !== null && je !== void 0 ? je : !0,
      unicodeRegExp: (Bt = P.unicodeRegExp) !== null && Bt !== void 0 ? Bt : !0,
      int32range: (Wt = P.int32range) !== null && Wt !== void 0 ? Wt : !0,
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
          return j.call(this, N), await k.call(this, N.missingSchema), b.call(this, U);
        }
      }
      function j({ missingSchema: U, missingRef: N }) {
        if (this.refs[U])
          throw new Error(`AnySchema ${U} is loaded but ${N} cannot be resolved`);
      }
      async function k(U) {
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
          const k = y[j];
          if (typeof k != "object")
            continue;
          const { $data: G } = k.definition, U = b[j];
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
      let k = this._cache.get(p);
      if (k !== void 0)
        return k;
      y = (0, c.normalizeId)(b || y);
      const G = c.getSchemaRefs.call(this, p, y);
      return k = new o.SchemaEnv({ schema: p, schemaId: j, meta: S, baseId: y, localRefs: G }), this._cache.set(k.schema, k), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = k), i && this.validateSchema(p, !0), k;
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
    let b = i ? f.post : f.rules.find(({ type: k }) => k === S);
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
    p.before ? V.call(this, b, j, p.before) : b.rules.push(j), f.all[P] = j, (y = p.implements) === null || y === void 0 || y.forEach((k) => this.addKeyword(k));
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
})($l);
var za = {}, Ua = {}, qa = {};
Object.defineProperty(qa, "__esModule", { value: !0 });
const jm = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
qa.default = jm;
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.callRef = Ot.getValidate = void 0;
const km = Mr, Hi = ie, Ge = re, pr = Je, Bi = ze, Sn = L, Am = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: l, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = Bi.resolveRef.call(c, d, s, r);
    if (u === void 0)
      throw new km.default(n.opts.uriResolver, s, r);
    if (u instanceof Bi.SchemaEnv)
      return w(u);
    return $(u);
    function h() {
      if (a === d)
        return Bn(e, o, a, a.$async);
      const v = t.scopeValue("root", { ref: d });
      return Bn(e, (0, Ge._)`${v}.validate`, d, d.$async);
    }
    function w(v) {
      const _ = uu(e, v);
      Bn(e, _, v, v.$async);
    }
    function $(v) {
      const _ = t.scopeValue("schema", l.code.source === !0 ? { ref: v, code: (0, Ge.stringify)(v) } : { ref: v }), g = t.name("valid"), m = e.subschema({
        schema: v,
        dataTypes: [],
        schemaPath: Ge.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, g);
      e.mergeEvaluated(m), e.ok(g);
    }
  }
};
function uu(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ge._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Ot.getValidate = uu;
function Bn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: l, opts: c } = a, d = c.passContext ? pr.default.this : Ge.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, Ge._)`await ${(0, Hi.callValidateCode)(e, t, d)}`), $(t), o || s.assign(v, !0);
    }, (_) => {
      s.if((0, Ge._)`!(${_} instanceof ${a.ValidationError})`, () => s.throw(_)), w(_), o || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, Hi.callValidateCode)(e, t, d), () => $(t), () => w(t));
  }
  function w(v) {
    const _ = (0, Ge._)`${v}.errors`;
    s.assign(pr.default.vErrors, (0, Ge._)`${pr.default.vErrors} === null ? ${_} : ${pr.default.vErrors}.concat(${_})`), s.assign(pr.default.errors, (0, Ge._)`${pr.default.vErrors}.length`);
  }
  function $(v) {
    var _;
    if (!a.opts.unevaluated)
      return;
    const g = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (a.props !== !0)
      if (g && !g.dynamicProps)
        g.props !== void 0 && (a.props = Sn.mergeEvaluated.props(s, g.props, a.props));
      else {
        const m = s.var("props", (0, Ge._)`${v}.evaluated.props`);
        a.props = Sn.mergeEvaluated.props(s, m, a.props, Ge.Name);
      }
    if (a.items !== !0)
      if (g && !g.dynamicItems)
        g.items !== void 0 && (a.items = Sn.mergeEvaluated.items(s, g.items, a.items));
      else {
        const m = s.var("items", (0, Ge._)`${v}.evaluated.items`);
        a.items = Sn.mergeEvaluated.items(s, m, a.items, Ge.Name);
      }
  }
}
Ot.callRef = Bn;
Ot.default = Am;
Object.defineProperty(Ua, "__esModule", { value: !0 });
const Cm = qa, Dm = Ot, Mm = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  Cm.default,
  Dm.default
];
Ua.default = Mm;
var Ka = {}, Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
const rs = re, At = rs.operators, ns = {
  maximum: { okStr: "<=", ok: At.LTE, fail: At.GT },
  minimum: { okStr: ">=", ok: At.GTE, fail: At.LT },
  exclusiveMaximum: { okStr: "<", ok: At.LT, fail: At.GTE },
  exclusiveMinimum: { okStr: ">", ok: At.GT, fail: At.LTE }
}, Vm = {
  message: ({ keyword: e, schemaCode: t }) => (0, rs.str)`must be ${ns[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, rs._)`{comparison: ${ns[e].okStr}, limit: ${t}}`
}, Lm = {
  keyword: Object.keys(ns),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Vm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, rs._)`${r} ${ns[t].fail} ${n} || isNaN(${r})`);
  }
};
Ga.default = Lm;
var Ha = {};
Object.defineProperty(Ha, "__esModule", { value: !0 });
const rn = re, Fm = {
  message: ({ schemaCode: e }) => (0, rn.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, rn._)`{multipleOf: ${e}}`
}, zm = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Fm,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), l = a ? (0, rn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, rn._)`${o} !== parseInt(${o})`;
    e.fail$data((0, rn._)`(${n} === 0 || (${o} = ${r}/${n}, ${l}))`);
  }
};
Ha.default = zm;
var Ba = {}, Wa = {};
Object.defineProperty(Wa, "__esModule", { value: !0 });
function du(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Wa.default = du;
du.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Ba, "__esModule", { value: !0 });
const xt = re, Um = L, qm = Wa, Km = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, xt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, xt._)`{limit: ${e}}`
}, Gm = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Km,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? xt.operators.GT : xt.operators.LT, o = s.opts.unicode === !1 ? (0, xt._)`${r}.length` : (0, xt._)`${(0, Um.useFunc)(e.gen, qm.default)}(${r})`;
    e.fail$data((0, xt._)`${o} ${a} ${n}`);
  }
};
Ba.default = Gm;
var Xa = {};
Object.defineProperty(Xa, "__esModule", { value: !0 });
const Hm = ie, Bm = L, Er = re, Wm = {
  message: ({ schemaCode: e }) => (0, Er.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Er._)`{pattern: ${e}}`
}, Xm = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Wm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e, l = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, Er._)`new RegExp` : (0, Bm.useFunc)(t, c), u = t.let("valid");
      t.try(() => t.assign(u, (0, Er._)`${d}(${a}, ${l}).test(${r})`), () => t.assign(u, !1)), e.fail$data((0, Er._)`!${u}`);
    } else {
      const c = (0, Hm.usePattern)(e, s);
      e.fail$data((0, Er._)`!${c}.test(${r})`);
    }
  }
};
Xa.default = Xm;
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
const nn = re, Jm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, nn.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, nn._)`{limit: ${e}}`
}, Ym = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Jm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? nn.operators.GT : nn.operators.LT;
    e.fail$data((0, nn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Ja.default = Ym;
var Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
const Jr = ie, sn = re, Qm = L, Zm = {
  message: ({ params: { missingProperty: e } }) => (0, sn.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, sn._)`{missingProperty: ${e}}`
}, xm = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Zm,
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
          (0, Qm.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(sn.nil, h);
      else
        for (const $ of r)
          (0, Jr.checkReportMissingProp)(e, $);
    }
    function u() {
      const $ = t.let("missing");
      if (c || a) {
        const v = t.let("valid", !0);
        e.block$data(v, () => w($, v)), e.ok(v);
      } else
        t.if((0, Jr.checkMissingProp)(e, r, $)), (0, Jr.reportMissingProp)(e, $), t.else();
    }
    function h() {
      t.forOf("prop", n, ($) => {
        e.setParams({ missingProperty: $ }), t.if((0, Jr.noPropertyInData)(t, s, $, l.ownProperties), () => e.error());
      });
    }
    function w($, v) {
      e.setParams({ missingProperty: $ }), t.forOf($, n, () => {
        t.assign(v, (0, Jr.propertyInData)(t, s, $, l.ownProperties)), t.if((0, sn.not)(v), () => {
          e.error(), t.break();
        });
      }, sn.nil);
    }
  }
};
Ya.default = xm;
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
const an = re, ep = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, an.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, an._)`{limit: ${e}}`
}, tp = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: ep,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? an.operators.GT : an.operators.LT;
    e.fail$data((0, an._)`${r}.length ${s} ${n}`);
  }
};
Qa.default = tp;
var Za = {}, yn = {};
Object.defineProperty(yn, "__esModule", { value: !0 });
const fu = ds;
fu.code = 'require("ajv/dist/runtime/equal").default';
yn.default = fu;
Object.defineProperty(Za, "__esModule", { value: !0 });
const Vs = Ee, Re = re, rp = L, np = yn, sp = {
  message: ({ params: { i: e, j: t } }) => (0, Re.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Re._)`{i: ${e}, j: ${t}}`
}, ap = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: sp,
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
      const g = (0, rp.useFunc)(t, np.default), m = t.name("outer");
      t.label(m).for((0, Re._)`;${v}--;`, () => t.for((0, Re._)`${_} = ${v}; ${_}--;`, () => t.if((0, Re._)`${g}(${r}[${v}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Za.default = ap;
var xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
const ia = re, op = L, ip = yn, cp = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, ia._)`{allowedValue: ${e}}`
}, lp = {
  keyword: "const",
  $data: !0,
  error: cp,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, ia._)`!${(0, op.useFunc)(t, ip.default)}(${r}, ${s})`) : e.fail((0, ia._)`${a} !== ${r}`);
  }
};
xa.default = lp;
var eo = {};
Object.defineProperty(eo, "__esModule", { value: !0 });
const xr = re, up = L, dp = yn, fp = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, xr._)`{allowedValues: ${e}}`
}, hp = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: fp,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, up.useFunc)(t, dp.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const $ = t.const("vSchema", a);
      u = (0, xr.or)(...s.map((v, _) => w($, _)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", a, ($) => t.if((0, xr._)`${d()}(${r}, ${$})`, () => t.assign(u, !0).break()));
    }
    function w($, v) {
      const _ = s[v];
      return typeof _ == "object" && _ !== null ? (0, xr._)`${d()}(${r}, ${$}[${v}])` : (0, xr._)`${r} === ${_}`;
    }
  }
};
eo.default = hp;
Object.defineProperty(Ka, "__esModule", { value: !0 });
const mp = Ga, pp = Ha, $p = Ba, yp = Xa, gp = Ja, _p = Ya, vp = Qa, wp = Za, Ep = xa, bp = eo, Sp = [
  // number
  mp.default,
  pp.default,
  // string
  $p.default,
  yp.default,
  // object
  gp.default,
  _p.default,
  // array
  vp.default,
  wp.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Ep.default,
  bp.default
];
Ka.default = Sp;
var to = {}, Vr = {};
Object.defineProperty(Vr, "__esModule", { value: !0 });
Vr.validateAdditionalItems = void 0;
const er = re, ca = L, Pp = {
  message: ({ params: { len: e } }) => (0, er.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, er._)`{limit: ${e}}`
}, Np = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Pp,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, ca.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    hu(e, n);
  }
};
function hu(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const l = r.const("len", (0, er._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, er._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, ca.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, er._)`${l} <= ${t.length}`);
    r.if((0, er.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: a, dataProp: u, dataPropType: ca.Type.Num }, d), o.allErrors || r.if((0, er.not)(d), () => r.break());
    });
  }
}
Vr.validateAdditionalItems = hu;
Vr.default = Np;
var ro = {}, Lr = {};
Object.defineProperty(Lr, "__esModule", { value: !0 });
Lr.validateTuple = void 0;
const Wi = re, Wn = L, Rp = ie, Op = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return mu(e, "additionalItems", t);
    r.items = !0, !(0, Wn.alwaysValidSchema)(r, t) && e.ok((0, Rp.validateArray)(e));
  }
};
function mu(e, t, r = e.schema) {
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
Lr.validateTuple = mu;
Lr.default = Op;
Object.defineProperty(ro, "__esModule", { value: !0 });
const Tp = Lr, Ip = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, Tp.validateTuple)(e, "items")
};
ro.default = Ip;
var no = {};
Object.defineProperty(no, "__esModule", { value: !0 });
const Xi = re, jp = L, kp = ie, Ap = Vr, Cp = {
  message: ({ params: { len: e } }) => (0, Xi.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Xi._)`{limit: ${e}}`
}, Dp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Cp,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, jp.alwaysValidSchema)(n, t) && (s ? (0, Ap.validateAdditionalItems)(e, s) : e.ok((0, kp.validateArray)(e)));
  }
};
no.default = Dp;
var so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
const Qe = re, Pn = L, Mp = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Qe.str)`must contain at least ${e} valid item(s)` : (0, Qe.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Qe._)`{minContains: ${e}}` : (0, Qe._)`{minContains: ${e}, maxContains: ${t}}`
}, Vp = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Mp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, l;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, l = d) : o = 1;
    const u = t.const("len", (0, Qe._)`${s}.length`);
    if (e.setParams({ min: o, max: l }), l === void 0 && o === 0) {
      (0, Pn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && o > l) {
      (0, Pn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Pn.alwaysValidSchema)(a, r)) {
      let _ = (0, Qe._)`${u} >= ${o}`;
      l !== void 0 && (_ = (0, Qe._)`${_} && ${u} <= ${l}`), e.pass(_);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    l === void 0 && o === 1 ? $(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, Qe._)`${s}.length > 0`, w)) : (t.let(h, !1), w()), e.result(h, () => e.reset());
    function w() {
      const _ = t.name("_valid"), g = t.let("count", 0);
      $(_, () => t.if(_, () => v(g)));
    }
    function $(_, g) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: Pn.Type.Num,
          compositeRule: !0
        }, _), g();
      });
    }
    function v(_) {
      t.code((0, Qe._)`${_}++`), l === void 0 ? t.if((0, Qe._)`${_} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, Qe._)`${_} > ${l}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, Qe._)`${_} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
so.default = Vp;
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
const pu = re, Lp = L, Fp = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, pu._)`{propertyName: ${e.propertyName}}`
}, zp = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Fp,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Lp.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, pu.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
ao.default = zp;
var $s = {};
Object.defineProperty($s, "__esModule", { value: !0 });
const Nn = ie, st = re, Up = Je, Rn = L, qp = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, st._)`{additionalProperty: ${e.additionalProperty}}`
}, Kp = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: qp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, Rn.alwaysValidSchema)(o, r))
      return;
    const d = (0, Nn.allSchemaProperties)(n.properties), u = (0, Nn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, st._)`${a} === ${Up.default.errors}`);
    function h() {
      t.forIn("key", s, (g) => {
        !d.length && !u.length ? v(g) : t.if(w(g), () => v(g));
      });
    }
    function w(g) {
      let m;
      if (d.length > 8) {
        const E = (0, Rn.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, Nn.isOwnProperty)(t, E, g);
      } else d.length ? m = (0, st.or)(...d.map((E) => (0, st._)`${g} === ${E}`)) : m = st.nil;
      return u.length && (m = (0, st.or)(m, ...u.map((E) => (0, st._)`${(0, Nn.usePattern)(e, E)}.test(${g})`))), (0, st.not)(m);
    }
    function $(g) {
      t.code((0, st._)`delete ${s}[${g}]`);
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
      if (typeof r == "object" && !(0, Rn.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_(g, m, !1), t.if((0, st.not)(m), () => {
          e.reset(), $(g);
        })) : (_(g, m), l || t.if((0, st.not)(m), () => t.break()));
      }
    }
    function _(g, m, E) {
      const R = {
        keyword: "additionalProperties",
        dataProp: g,
        dataPropType: Rn.Type.Str
      };
      E === !1 && Object.assign(R, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(R, m);
    }
  }
};
$s.default = Kp;
var oo = {};
Object.defineProperty(oo, "__esModule", { value: !0 });
const Gp = lt, Ji = ie, Ls = L, Yi = $s, Hp = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Yi.default.code(new Gp.KeywordCxt(a, Yi.default, "additionalProperties"));
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
oo.default = Hp;
var io = {};
Object.defineProperty(io, "__esModule", { value: !0 });
const Qi = ie, On = re, Zi = L, xi = L, Bp = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, l = (0, Qi.allSchemaProperties)(r), c = l.filter((_) => (0, Zi.alwaysValidSchema)(a, r[_]));
    if (l.length === 0 || c.length === l.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, u = t.name("valid");
    a.props !== !0 && !(a.props instanceof On.Name) && (a.props = (0, xi.evaluatedPropsToName)(t, a.props));
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
        t.if((0, On._)`${(0, Qi.usePattern)(e, _)}.test(${g})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: g,
            dataPropType: xi.Type.Str
          }, u), a.opts.unevaluated && h !== !0 ? t.assign((0, On._)`${h}[${g}]`, !0) : !m && !a.allErrors && t.if((0, On.not)(u), () => t.break());
        });
      });
    }
  }
};
io.default = Bp;
var co = {};
Object.defineProperty(co, "__esModule", { value: !0 });
const Wp = L, Xp = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Wp.alwaysValidSchema)(n, r)) {
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
co.default = Xp;
var lo = {};
Object.defineProperty(lo, "__esModule", { value: !0 });
const Jp = ie, Yp = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Jp.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
lo.default = Yp;
var uo = {};
Object.defineProperty(uo, "__esModule", { value: !0 });
const Xn = re, Qp = L, Zp = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Xn._)`{passingSchemas: ${e.passing}}`
}, xp = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Zp,
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
        (0, Qp.alwaysValidSchema)(s, u) ? t.var(c, !0) : w = e.subschema({
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
uo.default = xp;
var fo = {};
Object.defineProperty(fo, "__esModule", { value: !0 });
const e$ = L, t$ = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, e$.alwaysValidSchema)(n, a))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
fo.default = t$;
var ho = {};
Object.defineProperty(ho, "__esModule", { value: !0 });
const ss = re, $u = L, r$ = {
  message: ({ params: e }) => (0, ss.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, ss._)`{failingKeyword: ${e.ifClause}}`
}, n$ = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: r$,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, $u.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
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
  return r !== void 0 && !(0, $u.alwaysValidSchema)(e, r);
}
ho.default = n$;
var mo = {};
Object.defineProperty(mo, "__esModule", { value: !0 });
const s$ = L, a$ = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, s$.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
mo.default = a$;
Object.defineProperty(to, "__esModule", { value: !0 });
const o$ = Vr, i$ = ro, c$ = Lr, l$ = no, u$ = so, d$ = ps, f$ = ao, h$ = $s, m$ = oo, p$ = io, $$ = co, y$ = lo, g$ = uo, _$ = fo, v$ = ho, w$ = mo;
function E$(e = !1) {
  const t = [
    // any
    $$.default,
    y$.default,
    g$.default,
    _$.default,
    v$.default,
    w$.default,
    // object
    f$.default,
    h$.default,
    d$.default,
    m$.default,
    p$.default
  ];
  return e ? t.push(i$.default, l$.default) : t.push(o$.default, c$.default), t.push(u$.default), t;
}
to.default = E$;
var po = {}, Fr = {};
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.dynamicAnchor = void 0;
const Fs = re, b$ = Je, tc = ze, S$ = Ot, P$ = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => yu(e, e.schema)
};
function yu(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, Fs._)`${b$.default.dynamicAnchors}${(0, Fs.getProperty)(t)}`, a = n.errSchemaPath === "#" ? n.validateName : N$(e);
  r.if((0, Fs._)`!${s}`, () => r.assign(s, a));
}
Fr.dynamicAnchor = yu;
function N$(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: a, localRefs: o, meta: l } = t.root, { schemaId: c } = n.opts, d = new tc.SchemaEnv({ schema: r, schemaId: c, root: s, baseId: a, localRefs: o, meta: l });
  return tc.compileSchema.call(n, d), (0, S$.getValidate)(e, d);
}
Fr.default = P$;
var zr = {};
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.dynamicRef = void 0;
const rc = re, R$ = Je, nc = Ot, O$ = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => gu(e, e.schema)
};
function gu(e, t) {
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
      const d = r.let("_v", (0, rc._)`${R$.default.dynamicAnchors}${(0, rc.getProperty)(a)}`);
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
zr.dynamicRef = gu;
zr.default = O$;
var $o = {};
Object.defineProperty($o, "__esModule", { value: !0 });
const T$ = Fr, I$ = L, j$ = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, T$.dynamicAnchor)(e, "") : (0, I$.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
$o.default = j$;
var yo = {};
Object.defineProperty(yo, "__esModule", { value: !0 });
const k$ = zr, A$ = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, k$.dynamicRef)(e, e.schema)
};
yo.default = A$;
Object.defineProperty(po, "__esModule", { value: !0 });
const C$ = Fr, D$ = zr, M$ = $o, V$ = yo, L$ = [C$.default, D$.default, M$.default, V$.default];
po.default = L$;
var go = {}, _o = {};
Object.defineProperty(_o, "__esModule", { value: !0 });
const sc = ps, F$ = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: sc.error,
  code: (e) => (0, sc.validatePropertyDeps)(e)
};
_o.default = F$;
var vo = {};
Object.defineProperty(vo, "__esModule", { value: !0 });
const z$ = ps, U$ = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, z$.validateSchemaDeps)(e)
};
vo.default = U$;
var wo = {};
Object.defineProperty(wo, "__esModule", { value: !0 });
const q$ = L, K$ = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, q$.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
wo.default = K$;
Object.defineProperty(go, "__esModule", { value: !0 });
const G$ = _o, H$ = vo, B$ = wo, W$ = [G$.default, H$.default, B$.default];
go.default = W$;
var Eo = {}, bo = {};
Object.defineProperty(bo, "__esModule", { value: !0 });
const Vt = re, ac = L, X$ = Je, J$ = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, Vt._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, Y$ = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: J$,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: l } = a;
    l instanceof Vt.Name ? t.if((0, Vt._)`${l} !== true`, () => t.forIn("key", n, (h) => t.if(d(l, h), () => c(h)))) : l !== !0 && t.forIn("key", n, (h) => l === void 0 ? c(h) : t.if(u(l, h), () => c(h))), a.props = !0, e.ok((0, Vt._)`${s} === ${X$.default.errors}`);
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
        }, w), o || t.if((0, Vt.not)(w), () => t.break());
      }
    }
    function d(h, w) {
      return (0, Vt._)`!${h} || !${h}[${w}]`;
    }
    function u(h, w) {
      const $ = [];
      for (const v in h)
        h[v] === !0 && $.push((0, Vt._)`${w} !== ${v}`);
      return (0, Vt.and)(...$);
    }
  }
};
bo.default = Y$;
var So = {};
Object.defineProperty(So, "__esModule", { value: !0 });
const tr = re, oc = L, Q$ = {
  message: ({ params: { len: e } }) => (0, tr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, tr._)`{limit: ${e}}`
}, Z$ = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: Q$,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, a = s.items || 0;
    if (a === !0)
      return;
    const o = t.const("len", (0, tr._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: a }), e.fail((0, tr._)`${o} > ${a}`);
    else if (typeof r == "object" && !(0, oc.alwaysValidSchema)(s, r)) {
      const c = t.var("valid", (0, tr._)`${o} <= ${a}`);
      t.if((0, tr.not)(c), () => l(c, a)), e.ok(c);
    }
    s.items = !0;
    function l(c, d) {
      t.forRange("i", d, o, (u) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: u, dataPropType: oc.Type.Num }, c), s.allErrors || t.if((0, tr.not)(c), () => t.break());
      });
    }
  }
};
So.default = Z$;
Object.defineProperty(Eo, "__esModule", { value: !0 });
const x$ = bo, ey = So, ty = [x$.default, ey.default];
Eo.default = ty;
var Po = {}, No = {};
Object.defineProperty(No, "__esModule", { value: !0 });
const ve = re, ry = {
  message: ({ schemaCode: e }) => (0, ve.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, ve._)`{format: ${e}}`
}, ny = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: ry,
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
No.default = ny;
Object.defineProperty(Po, "__esModule", { value: !0 });
const sy = No, ay = [sy.default];
Po.default = ay;
var Cr = {};
Object.defineProperty(Cr, "__esModule", { value: !0 });
Cr.contentVocabulary = Cr.metadataVocabulary = void 0;
Cr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Cr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(za, "__esModule", { value: !0 });
const oy = Ua, iy = Ka, cy = to, ly = po, uy = go, dy = Eo, fy = Po, ic = Cr, hy = [
  ly.default,
  oy.default,
  iy.default,
  (0, cy.default)(!0),
  fy.default,
  ic.metadataVocabulary,
  ic.contentVocabulary,
  uy.default,
  dy.default
];
za.default = hy;
var Ro = {}, ys = {};
Object.defineProperty(ys, "__esModule", { value: !0 });
ys.DiscrError = void 0;
var cc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(cc || (ys.DiscrError = cc = {}));
Object.defineProperty(Ro, "__esModule", { value: !0 });
const gr = re, la = ys, lc = ze, my = Mr, py = L, $y = {
  message: ({ params: { discrError: e, tagName: t } }) => e === la.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, gr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, yy = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: $y,
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
    const c = t.let("valid", !1), d = t.const("tag", (0, gr._)`${r}${(0, gr.getProperty)(l)}`);
    t.if((0, gr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: la.DiscrError.Tag, tag: d, tagName: l })), e.ok(c);
    function u() {
      const $ = w();
      t.if(!1);
      for (const v in $)
        t.elseIf((0, gr._)`${d} === ${v}`), t.assign(c, h($[v]));
      t.else(), e.error(!1, { discrError: la.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h($) {
      const v = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: $ }, v);
      return e.mergeEvaluated(_, gr.Name), v;
    }
    function w() {
      var $;
      const v = {}, _ = m(s);
      let g = !0;
      for (let O = 0; O < o.length; O++) {
        let I = o[O];
        if (I != null && I.$ref && !(0, py.schemaHasRulesButRef)(I, a.self.RULES)) {
          const Y = I.$ref;
          if (I = lc.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, Y), I instanceof lc.SchemaEnv && (I = I.schema), I === void 0)
            throw new my.default(a.opts.uriResolver, a.baseId, Y);
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
Ro.default = yy;
var Oo = {};
const gy = "https://json-schema.org/draft/2020-12/schema", _y = "https://json-schema.org/draft/2020-12/schema", vy = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, wy = "meta", Ey = "Core and Validation specifications meta-schema", by = [
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
], Sy = [
  "object",
  "boolean"
], Py = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", Ny = {
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
}, Ry = {
  $schema: gy,
  $id: _y,
  $vocabulary: vy,
  $dynamicAnchor: wy,
  title: Ey,
  allOf: by,
  type: Sy,
  $comment: Py,
  properties: Ny
}, Oy = "https://json-schema.org/draft/2020-12/schema", Ty = "https://json-schema.org/draft/2020-12/meta/applicator", Iy = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, jy = "meta", ky = "Applicator vocabulary meta-schema", Ay = [
  "object",
  "boolean"
], Cy = {
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
}, Dy = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, My = {
  $schema: Oy,
  $id: Ty,
  $vocabulary: Iy,
  $dynamicAnchor: jy,
  title: ky,
  type: Ay,
  properties: Cy,
  $defs: Dy
}, Vy = "https://json-schema.org/draft/2020-12/schema", Ly = "https://json-schema.org/draft/2020-12/meta/unevaluated", Fy = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, zy = "meta", Uy = "Unevaluated applicator vocabulary meta-schema", qy = [
  "object",
  "boolean"
], Ky = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, Gy = {
  $schema: Vy,
  $id: Ly,
  $vocabulary: Fy,
  $dynamicAnchor: zy,
  title: Uy,
  type: qy,
  properties: Ky
}, Hy = "https://json-schema.org/draft/2020-12/schema", By = "https://json-schema.org/draft/2020-12/meta/content", Wy = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Xy = "meta", Jy = "Content vocabulary meta-schema", Yy = [
  "object",
  "boolean"
], Qy = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, Zy = {
  $schema: Hy,
  $id: By,
  $vocabulary: Wy,
  $dynamicAnchor: Xy,
  title: Jy,
  type: Yy,
  properties: Qy
}, xy = "https://json-schema.org/draft/2020-12/schema", e0 = "https://json-schema.org/draft/2020-12/meta/core", t0 = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, r0 = "meta", n0 = "Core vocabulary meta-schema", s0 = [
  "object",
  "boolean"
], a0 = {
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
}, o0 = {
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
}, i0 = {
  $schema: xy,
  $id: e0,
  $vocabulary: t0,
  $dynamicAnchor: r0,
  title: n0,
  type: s0,
  properties: a0,
  $defs: o0
}, c0 = "https://json-schema.org/draft/2020-12/schema", l0 = "https://json-schema.org/draft/2020-12/meta/format-annotation", u0 = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, d0 = "meta", f0 = "Format vocabulary meta-schema for annotation results", h0 = [
  "object",
  "boolean"
], m0 = {
  format: {
    type: "string"
  }
}, p0 = {
  $schema: c0,
  $id: l0,
  $vocabulary: u0,
  $dynamicAnchor: d0,
  title: f0,
  type: h0,
  properties: m0
}, $0 = "https://json-schema.org/draft/2020-12/schema", y0 = "https://json-schema.org/draft/2020-12/meta/meta-data", g0 = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, _0 = "meta", v0 = "Meta-data vocabulary meta-schema", w0 = [
  "object",
  "boolean"
], E0 = {
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
}, b0 = {
  $schema: $0,
  $id: y0,
  $vocabulary: g0,
  $dynamicAnchor: _0,
  title: v0,
  type: w0,
  properties: E0
}, S0 = "https://json-schema.org/draft/2020-12/schema", P0 = "https://json-schema.org/draft/2020-12/meta/validation", N0 = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, R0 = "meta", O0 = "Validation vocabulary meta-schema", T0 = [
  "object",
  "boolean"
], I0 = {
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
}, j0 = {
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
}, k0 = {
  $schema: S0,
  $id: P0,
  $vocabulary: N0,
  $dynamicAnchor: R0,
  title: O0,
  type: T0,
  properties: I0,
  $defs: j0
};
Object.defineProperty(Oo, "__esModule", { value: !0 });
const A0 = Ry, C0 = My, D0 = Gy, M0 = Zy, V0 = i0, L0 = p0, F0 = b0, z0 = k0, U0 = ["/properties"];
function q0(e) {
  return [
    A0,
    C0,
    D0,
    M0,
    V0,
    t(this, L0),
    F0,
    t(this, z0)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, U0) : n;
  }
}
Oo.default = q0;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = $l, n = za, s = Ro, a = Oo, o = "https://json-schema.org/draft/2020-12/schema";
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
  var c = lt;
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
  var h = Mr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(ra, ra.exports);
var K0 = ra.exports, ua = { exports: {} }, _u = {};
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
})(_u);
var vu = {}, da = { exports: {} }, wu = {}, wt = {}, Yt = {}, zs = {}, oe = {}, mn = {};
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
var fa = {};
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
})(fa);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = mn, r = fa;
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
        const k = b[j];
        k.optimizeNames(i, f) || (ue(i, k.names), b.splice(j, 1));
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
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: b, from: j, to: k } = this;
      return `for(${f} ${b}=${j}; ${b}<${k}; ${b}++)` + super.render(i);
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
      const k = this._scope.toName(f);
      return b !== void 0 && j && (this._constants[k.str] = b), this._leafNode(new o(i, k, b)), k;
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
    forRange(i, f, b, j, k = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const G = this._scope.toName(i);
      return this._for(new O(k, G, f, b), () => j(G));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, j = r.varKinds.const) {
      const k = this._scope.toName(i);
      if (this.opts.es5) {
        const G = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${G}.length`, (U) => {
          this.var(k, (0, t._)`${G}[${U}]`), b(k);
        });
      }
      return this._for(new I("of", j, k, f), () => b(k));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, b, j = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, b);
      const k = this._scope.toName(i);
      return this._for(new I("in", j, k, f), () => b(k));
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
        const k = this.name("e");
        this._currNode = j.catch = new he(k), f(k);
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
    return new t._Code(y._items.reduce((k, G) => (G instanceof t.Name && (G = b(G)), G instanceof t._Code ? k.push(...G._items) : k.push(G), k), []));
    function b(k) {
      const G = f[k.str];
      return G === void 0 || i[k.str] !== 1 ? k : (delete i[k.str], G);
    }
    function j(k) {
      return k instanceof t._Code && k._items.some((G) => G instanceof t.Name && i[G.str] === 1 && f[G.str] !== void 0);
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
const fe = oe, G0 = mn;
function H0(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
F.toHash = H0;
function B0(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Eu(e, t), !bu(t, e.self.RULES.all));
}
F.alwaysValidSchema = B0;
function Eu(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || Nu(e, `unknown keyword: "${a}"`);
}
F.checkUnknownRules = Eu;
function bu(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
F.schemaHasRules = bu;
function W0(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
F.schemaHasRulesButRef = W0;
function X0({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, fe._)`${r}`;
  }
  return (0, fe._)`${e}${t}${(0, fe.getProperty)(n)}`;
}
F.schemaRefOrVal = X0;
function J0(e) {
  return Su(decodeURIComponent(e));
}
F.unescapeFragment = J0;
function Y0(e) {
  return encodeURIComponent(To(e));
}
F.escapeFragment = Y0;
function To(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
F.escapeJsonPointer = To;
function Su(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
F.unescapeJsonPointer = Su;
function Q0(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
F.eachItem = Q0;
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
    resultToName: Pu
  }),
  items: uc({
    mergeNames: (e, t, r) => e.if((0, fe._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, fe._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, fe._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, fe._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Pu(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, fe._)`{}`);
  return t !== void 0 && Io(e, r, t), r;
}
F.evaluatedPropsToName = Pu;
function Io(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, fe._)`${t}${(0, fe.getProperty)(n)}`, !0));
}
F.setEvaluated = Io;
const dc = {};
function Z0(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: dc[t.code] || (dc[t.code] = new G0._Code(t.code))
  });
}
F.useFunc = Z0;
var ha;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(ha || (F.Type = ha = {}));
function x0(e, t, r) {
  if (e instanceof fe.Name) {
    const n = t === ha.Num;
    return r ? n ? (0, fe._)`"[" + ${e} + "]"` : (0, fe._)`"['" + ${e} + "']"` : n ? (0, fe._)`"/" + ${e}` : (0, fe._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, fe.getProperty)(e).toString() : "/" + To(e);
}
F.getErrorPath = x0;
function Nu(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
F.checkStrictMode = Nu;
var Tn = {}, fc;
function Ht() {
  if (fc) return Tn;
  fc = 1, Object.defineProperty(Tn, "__esModule", { value: !0 });
  const e = oe, t = {
    // validation function arguments
    data: new e.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new e.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new e.Name("instancePath"),
    parentData: new e.Name("parentData"),
    parentDataProperty: new e.Name("parentDataProperty"),
    rootData: new e.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new e.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new e.Name("vErrors"),
    // null or array of validation errors
    errors: new e.Name("errors"),
    // counter of validation errors
    this: new e.Name("this"),
    // "globals"
    self: new e.Name("self"),
    scope: new e.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new e.Name("json"),
    jsonPos: new e.Name("jsonPos"),
    jsonLen: new e.Name("jsonLen"),
    jsonPart: new e.Name("jsonPart")
  };
  return Tn.default = t, Tn;
}
var hc;
function gs() {
  return hc || (hc = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
    const t = oe, r = F, n = Ht();
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
var mc;
function eg() {
  if (mc) return Yt;
  mc = 1, Object.defineProperty(Yt, "__esModule", { value: !0 }), Yt.boolOrEmptySchema = Yt.topBoolOrEmptySchema = void 0;
  const e = gs(), t = oe, r = Ht(), n = {
    message: "boolean schema is false"
  };
  function s(l) {
    const { gen: c, schema: d, validateName: u } = l;
    d === !1 ? o(l, !1) : typeof d == "object" && d.$async === !0 ? c.return(r.default.data) : (c.assign((0, t._)`${u}.errors`, null), c.return(!0));
  }
  Yt.topBoolOrEmptySchema = s;
  function a(l, c) {
    const { gen: d, schema: u } = l;
    u === !1 ? (d.var(c, !1), o(l)) : d.var(c, !0);
  }
  Yt.boolOrEmptySchema = a;
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
  return Yt;
}
var be = {}, dr = {};
Object.defineProperty(dr, "__esModule", { value: !0 });
dr.getRules = dr.isJSONType = void 0;
const tg = ["string", "number", "integer", "boolean", "null", "object", "array"], rg = new Set(tg);
function ng(e) {
  return typeof e == "string" && rg.has(e);
}
dr.isJSONType = ng;
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
dr.getRules = sg;
var Et = {}, pc;
function Ru() {
  if (pc) return Et;
  pc = 1, Object.defineProperty(Et, "__esModule", { value: !0 }), Et.shouldUseRule = Et.shouldUseGroup = Et.schemaHasRulesForType = void 0;
  function e({ schema: n, self: s }, a) {
    const o = s.RULES.types[a];
    return o && o !== !0 && t(n, o);
  }
  Et.schemaHasRulesForType = e;
  function t(n, s) {
    return s.rules.some((a) => r(n, a));
  }
  Et.shouldUseGroup = t;
  function r(n, s) {
    var a;
    return n[s.keyword] !== void 0 || ((a = s.definition.implements) === null || a === void 0 ? void 0 : a.some((o) => n[o] !== void 0));
  }
  return Et.shouldUseRule = r, Et;
}
Object.defineProperty(be, "__esModule", { value: !0 });
be.reportTypeError = be.checkDataTypes = be.checkDataType = be.coerceAndCheckDataType = be.getJSONTypes = be.getSchemaTypes = be.DataType = void 0;
const ag = dr, og = Ru(), ig = gs(), se = oe, Ou = F;
var Or;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Or || (be.DataType = Or = {}));
function cg(e) {
  const t = Tu(e.type);
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
function Tu(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(ag.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
be.getJSONTypes = Tu;
function lg(e, t) {
  const { gen: r, data: n, opts: s } = e, a = ug(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, og.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const l = jo(t, n, s.strictNumbers, Or.Wrong);
    r.if(l, () => {
      a.length ? dg(e, t, a) : ko(e);
    });
  }
  return o;
}
be.coerceAndCheckDataType = lg;
const Iu = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function ug(e, t) {
  return t ? e.filter((r) => Iu.has(r) || t === "array" && r === "array") : [];
}
function dg(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, se._)`typeof ${s}`), l = n.let("coerced", (0, se._)`undefined`);
  a.coerceTypes === "array" && n.if((0, se._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, se._)`${s}[0]`).assign(o, (0, se._)`typeof ${s}`).if(jo(t, s, a.strictNumbers), () => n.assign(l, s))), n.if((0, se._)`${l} !== undefined`);
  for (const d of r)
    (Iu.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), ko(e), n.endIf(), n.if((0, se._)`${l} !== undefined`, () => {
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
function ma(e, t, r, n = Or.Correct) {
  const s = n === Or.Correct ? se.operators.EQ : se.operators.NEQ;
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
  return n === Or.Correct ? a : (0, se.not)(a);
  function o(l = se.nil) {
    return (0, se.and)((0, se._)`typeof ${t} == "number"`, l, r ? (0, se._)`isFinite(${t})` : se.nil);
  }
}
be.checkDataType = ma;
function jo(e, t, r, n) {
  if (e.length === 1)
    return ma(e[0], t, r, n);
  let s;
  const a = (0, Ou.toHash)(e);
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
function ko(e) {
  const t = mg(e);
  (0, ig.reportError)(t, hg);
}
be.reportTypeError = ko;
function mg(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Ou.schemaRefOrVal)(e, n, "type");
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
var Yr = {}, $c;
function pg() {
  if ($c) return Yr;
  $c = 1, Object.defineProperty(Yr, "__esModule", { value: !0 }), Yr.assignDefaults = void 0;
  const e = oe, t = F;
  function r(s, a) {
    const { properties: o, items: l } = s.schema;
    if (a === "object" && o)
      for (const c in o)
        n(s, c, o[c].default);
    else a === "array" && Array.isArray(l) && l.forEach((c, d) => n(s, d, c.default));
  }
  Yr.assignDefaults = r;
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
  return Yr;
}
var rt = {}, ce = {};
Object.defineProperty(ce, "__esModule", { value: !0 });
ce.validateUnion = ce.validateArray = ce.usePattern = ce.callValidateCode = ce.schemaProperties = ce.allSchemaProperties = ce.noPropertyInData = ce.propertyInData = ce.isOwnProperty = ce.hasPropFunc = ce.reportMissingProp = ce.checkMissingProp = ce.checkReportMissingProp = void 0;
const pe = oe, Ao = F, Ct = Ht(), $g = F;
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
function ju(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, pe._)`Object.prototype.hasOwnProperty`
  });
}
ce.hasPropFunc = ju;
function Co(e, t, r) {
  return (0, pe._)`${ju(e)}.call(${t}, ${r})`;
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
function ku(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ce.allSchemaProperties = ku;
function wg(e, t) {
  return ku(t).filter((r) => !(0, Ao.alwaysValidSchema)(e, t[r]));
}
ce.schemaProperties = wg;
function Eg({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, l, c, d) {
  const u = d ? (0, pe._)`${e}, ${t}, ${n}${s}` : t, h = [
    [Ct.default.instancePath, (0, pe.strConcat)(Ct.default.instancePath, a)],
    [Ct.default.parentData, o.parentData],
    [Ct.default.parentDataProperty, o.parentDataProperty],
    [Ct.default.rootData, Ct.default.rootData]
  ];
  o.opts.dynamicRef && h.push([Ct.default.dynamicAnchors, Ct.default.dynamicAnchors]);
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
        dataPropType: Ao.Type.Num
      }, a), t.if((0, pe.not)(a), l);
    });
  }
}
ce.validateArray = Pg;
function Ng(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, Ao.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
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
var yc;
function Rg() {
  if (yc) return rt;
  yc = 1, Object.defineProperty(rt, "__esModule", { value: !0 }), rt.validateKeywordUsage = rt.validSchemaType = rt.funcKeywordCode = rt.macroKeywordCode = void 0;
  const e = oe, t = Ht(), r = ce, n = gs();
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
  rt.macroKeywordCode = s;
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
  rt.funcKeywordCode = a;
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
  rt.validSchemaType = u;
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
  return rt.validateKeywordUsage = h, rt;
}
var bt = {}, gc;
function Og() {
  if (gc) return bt;
  gc = 1, Object.defineProperty(bt, "__esModule", { value: !0 }), bt.extendSubschemaMode = bt.extendSubschemaData = bt.getSubschema = void 0;
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
  bt.getSubschema = r;
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
  bt.extendSubschemaData = n;
  function s(a, { jtdDiscriminator: o, jtdMetadata: l, compositeRule: c, createErrors: d, allErrors: u }) {
    c !== void 0 && (a.compositeRule = c), d !== void 0 && (a.createErrors = d), u !== void 0 && (a.allErrors = u), a.jtdDiscriminator = o, a.jtdMetadata = l;
  }
  return bt.extendSubschemaMode = s, bt;
}
var Ie = {}, Au = { exports: {} }, Kt = Au.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Jn(t, n, s, e, "", e);
};
Kt.keywords = {
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
Kt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Kt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Kt.skipKeywords = {
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
        if (u in Kt.arrayKeywords)
          for (var w = 0; w < h.length; w++)
            Jn(e, t, r, h[w], s + "/" + u + "/" + w, a, s, u, n, w);
      } else if (u in Kt.propsKeywords) {
        if (h && typeof h == "object")
          for (var $ in h)
            Jn(e, t, r, h[$], s + "/" + u + "/" + Tg($), a, s, u, n, $);
      } else (u in Kt.keywords || e.allKeys && !(u in Kt.skipKeywords)) && Jn(e, t, r, h, s + "/" + u, a, s, u, n);
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
const jg = F, kg = ds, Ag = Ig, Cg = /* @__PURE__ */ new Set([
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
  return typeof e == "boolean" ? !0 : t === !0 ? !pa(e) : t ? Cu(e) <= t : !1;
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
function Cu(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Cg.has(r) && (typeof e[r] == "object" && (0, jg.eachItem)(e[r], (n) => t += Cu(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Du(e, t = "", r) {
  r !== !1 && (t = Tr(t));
  const n = e.parse(t);
  return Mu(e, n);
}
Ie.getFullPath = Du;
function Mu(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ie._getFullPath = Mu;
const Vg = /#\/?$/;
function Tr(e) {
  return e ? e.replace(Vg, "") : "";
}
Ie.normalizeId = Tr;
function Lg(e, t, r) {
  return r = Tr(r), e.resolve(t, r);
}
Ie.resolveUrl = Lg;
const Fg = /^[a-z_][-a-z0-9._]*$/i;
function zg(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Tr(e[r] || t), a = { "": s }, o = Du(n, s, !1), l = {}, c = /* @__PURE__ */ new Set();
  return Ag(e, { allKeys: !0 }, (h, w, $, v) => {
    if (v === void 0)
      return;
    const _ = o + w;
    let g = a[v];
    typeof h[r] == "string" && (g = m.call(this, h[r])), E.call(this, h.$anchor), E.call(this, h.$dynamicAnchor), a[w] = g;
    function m(R) {
      const O = this.opts.uriResolver.resolve;
      if (R = Tr(g ? O(g, R) : R), c.has(R))
        throw u(R);
      c.add(R);
      let I = this.refs[R];
      return typeof I == "string" && (I = this.refs[I]), typeof I == "object" ? d(h, I.schema, R) : R !== Tr(_) && (R[0] === "#" ? (d(h, l[R], R), l[R] = h) : this.refs[R] = _), R;
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
    if (w !== void 0 && !kg(h, w))
      throw u($);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ie.getSchemaRefs = zg;
var _c;
function _s() {
  if (_c) return wt;
  _c = 1, Object.defineProperty(wt, "__esModule", { value: !0 }), wt.getData = wt.KeywordCxt = wt.validateFunctionCode = void 0;
  const e = eg(), t = be, r = Ru(), n = be, s = pg(), a = Rg(), o = Og(), l = oe, c = Ht(), d = Ie, u = F, h = gs();
  function w(N) {
    if (I(N) && (Y(N), O(N))) {
      g(N);
      return;
    }
    $(N, () => (0, e.topBoolOrEmptySchema)(N));
  }
  wt.validateFunctionCode = w;
  function $({ gen: N, validateName: T, schema: A, schemaEnv: M, opts: H }, x) {
    H.code.es5 ? N.func(T, (0, l._)`${c.default.data}, ${c.default.valCxt}`, M.$async, () => {
      N.code((0, l._)`"use strict"; ${E(A, H)}`), _(N, H), N.code(x);
    }) : N.func(T, (0, l._)`${c.default.data}, ${v(H)}`, M.$async, () => N.code(E(A, H)).code(x));
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
    const { schema: T, opts: A, gen: M } = N;
    $(N, () => {
      A.$comment && T.$comment && Q(N), ye(N), M.let(c.default.vErrors, null), M.let(c.default.errors, 0), A.unevaluated && m(N), le(N), B(N);
    });
  }
  function m(N) {
    const { gen: T, validateName: A } = N;
    N.evaluated = T.const("evaluated", (0, l._)`${A}.evaluated`), T.if((0, l._)`${N.evaluated}.dynamicProps`, () => T.assign((0, l._)`${N.evaluated}.props`, (0, l._)`undefined`)), T.if((0, l._)`${N.evaluated}.dynamicItems`, () => T.assign((0, l._)`${N.evaluated}.items`, (0, l._)`undefined`));
  }
  function E(N, T) {
    const A = typeof N == "object" && N[T.schemaId];
    return A && (T.code.source || T.code.process) ? (0, l._)`/*# sourceURL=${A} */` : l.nil;
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
    for (const A in N)
      if (T.RULES.all[A])
        return !0;
    return !1;
  }
  function I(N) {
    return typeof N.schema != "boolean";
  }
  function K(N, T) {
    const { schema: A, gen: M, opts: H } = N;
    H.$comment && A.$comment && Q(N), q(N), J(N);
    const x = M.const("_errs", c.default.errors);
    le(N, x), M.var(T, (0, l._)`${x} === ${c.default.errors}`);
  }
  function Y(N) {
    (0, u.checkUnknownRules)(N), he(N);
  }
  function le(N, T) {
    if (N.opts.jtd)
      return V(N, [], !1, T);
    const A = (0, t.getSchemaTypes)(N.schema), M = (0, t.coerceAndCheckDataType)(N, A);
    V(N, A, !M, T);
  }
  function he(N) {
    const { schema: T, errSchemaPath: A, opts: M, self: H } = N;
    T.$ref && M.ignoreKeywordsWithRef && (0, u.schemaHasRulesButRef)(T, H.RULES) && H.logger.warn(`$ref: keywords ignored in schema at path "${A}"`);
  }
  function ye(N) {
    const { schema: T, opts: A } = N;
    T.default !== void 0 && A.useDefaults && A.strictSchema && (0, u.checkStrictMode)(N, "default is ignored in the schema root");
  }
  function q(N) {
    const T = N.schema[N.opts.schemaId];
    T && (N.baseId = (0, d.resolveUrl)(N.opts.uriResolver, N.baseId, T));
  }
  function J(N) {
    if (N.schema.$async && !N.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function Q({ gen: N, schemaEnv: T, schema: A, errSchemaPath: M, opts: H }) {
    const x = A.$comment;
    if (H.$comment === !0)
      N.code((0, l._)`${c.default.self}.logger.log(${x})`);
    else if (typeof H.$comment == "function") {
      const ge = (0, l.str)`${M}/$comment`, Le = N.scopeValue("root", { ref: T.root });
      N.code((0, l._)`${c.default.self}.opts.$comment(${x}, ${ge}, ${Le}.schema)`);
    }
  }
  function B(N) {
    const { gen: T, schemaEnv: A, validateName: M, ValidationError: H, opts: x } = N;
    A.$async ? T.if((0, l._)`${c.default.errors} === 0`, () => T.return(c.default.data), () => T.throw((0, l._)`new ${H}(${c.default.vErrors})`)) : (T.assign((0, l._)`${M}.errors`, c.default.vErrors), x.unevaluated && ue(N), T.return((0, l._)`${c.default.errors} === 0`));
  }
  function ue({ gen: N, evaluated: T, props: A, items: M }) {
    A instanceof l.Name && N.assign((0, l._)`${T}.props`, A), M instanceof l.Name && N.assign((0, l._)`${T}.items`, M);
  }
  function V(N, T, A, M) {
    const { gen: H, schema: x, data: ge, allErrors: Le, opts: Se, self: Pe } = N, { RULES: _e } = Pe;
    if (x.$ref && (Se.ignoreKeywordsWithRef || !(0, u.schemaHasRulesButRef)(x, _e))) {
      H.block(() => j(N, "$ref", _e.all.$ref.definition));
      return;
    }
    Se.jtd || W(N, T), H.block(() => {
      for (const je of _e.rules)
        ht(je);
      ht(_e.post);
    });
    function ht(je) {
      (0, r.shouldUseGroup)(x, je) && (je.type ? (H.if((0, n.checkDataType)(je.type, ge, Se.strictNumbers)), C(N, je), T.length === 1 && T[0] === je.type && A && (H.else(), (0, n.reportTypeError)(N)), H.endIf()) : C(N, je), Le || H.if((0, l._)`${c.default.errors} === ${M || 0}`));
    }
  }
  function C(N, T) {
    const { gen: A, schema: M, opts: { useDefaults: H } } = N;
    H && (0, s.assignDefaults)(N, T.type), A.block(() => {
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
      T.forEach((A) => {
        y(N.dataTypes, A) || f(N, `type "${A}" not allowed by context "${N.dataTypes.join(",")}"`);
      }), i(N, T);
    }
  }
  function P(N, T) {
    T.length > 1 && !(T.length === 2 && T.includes("null")) && f(N, "use allowUnionTypes to allow union type keyword");
  }
  function p(N, T) {
    const A = N.self.RULES.all;
    for (const M in A) {
      const H = A[M];
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
    const A = [];
    for (const M of N.dataTypes)
      y(T, M) ? A.push(M) : T.includes("integer") && M === "number" && A.push("integer");
    N.dataTypes = A;
  }
  function f(N, T) {
    const A = N.schemaEnv.baseId + N.errSchemaPath;
    T += ` at "${A}" (strictTypes)`, (0, u.checkStrictMode)(N, T, N.opts.strictTypes);
  }
  class b {
    constructor(T, A, M) {
      if ((0, a.validateKeywordUsage)(T, A, M), this.gen = T.gen, this.allErrors = T.allErrors, this.keyword = M, this.data = T.data, this.schema = T.schema[M], this.$data = A.$data && T.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, u.schemaRefOrVal)(T, this.schema, M, this.$data), this.schemaType = A.schemaType, this.parentSchema = T.schema, this.params = {}, this.it = T, this.def = A, this.$data)
        this.schemaCode = T.gen.const("vSchema", U(this.$data, T));
      else if (this.schemaCode = this.schemaValue, !(0, a.validSchemaType)(this.schema, A.schemaType, A.allowUndefined))
        throw new Error(`${M} value must be ${JSON.stringify(A.schemaType)}`);
      ("code" in A ? A.trackErrors : A.errors !== !1) && (this.errsCount = T.gen.const("_errs", c.default.errors));
    }
    result(T, A, M) {
      this.failResult((0, l.not)(T), A, M);
    }
    failResult(T, A, M) {
      this.gen.if(T), M ? M() : this.error(), A ? (this.gen.else(), A(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(T, A) {
      this.failResult((0, l.not)(T), void 0, A);
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
      const { schemaCode: A } = this;
      this.fail((0, l._)`${A} !== undefined && (${(0, l.or)(this.invalid$data(), T)})`);
    }
    error(T, A, M) {
      if (A) {
        this.setParams(A), this._error(T, M), this.setParams({});
        return;
      }
      this._error(T, M);
    }
    _error(T, A) {
      (T ? h.reportExtraError : h.reportError)(this, this.def.error, A);
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
    setParams(T, A) {
      A ? Object.assign(this.params, T) : this.params = T;
    }
    block$data(T, A, M = l.nil) {
      this.gen.block(() => {
        this.check$data(T, M), A();
      });
    }
    check$data(T = l.nil, A = l.nil) {
      if (!this.$data)
        return;
      const { gen: M, schemaCode: H, schemaType: x, def: ge } = this;
      M.if((0, l.or)((0, l._)`${H} === undefined`, A)), T !== l.nil && M.assign(T, !0), (x.length || ge.validateSchema) && (M.elseIf(this.invalid$data()), this.$dataError(), T !== l.nil && M.assign(T, !1)), M.else();
    }
    invalid$data() {
      const { gen: T, schemaCode: A, schemaType: M, def: H, it: x } = this;
      return (0, l.or)(ge(), Le());
      function ge() {
        if (M.length) {
          if (!(A instanceof l.Name))
            throw new Error("ajv implementation error");
          const Se = Array.isArray(M) ? M : [M];
          return (0, l._)`${(0, n.checkDataTypes)(Se, A, x.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return l.nil;
      }
      function Le() {
        if (H.validateSchema) {
          const Se = T.scopeValue("validate$data", { ref: H.validateSchema });
          return (0, l._)`!${Se}(${A})`;
        }
        return l.nil;
      }
    }
    subschema(T, A) {
      const M = (0, o.getSubschema)(this.it, T);
      (0, o.extendSubschemaData)(M, this.it, T), (0, o.extendSubschemaMode)(M, T);
      const H = { ...this.it, ...M, items: void 0, props: void 0 };
      return R(H, A), H;
    }
    mergeEvaluated(T, A) {
      const { it: M, gen: H } = this;
      M.opts.unevaluated && (M.props !== !0 && T.props !== void 0 && (M.props = u.mergeEvaluated.props(H, T.props, M.props, A)), M.items !== !0 && T.items !== void 0 && (M.items = u.mergeEvaluated.items(H, T.items, M.items, A)));
    }
    mergeValidEvaluated(T, A) {
      const { it: M, gen: H } = this;
      if (M.opts.unevaluated && (M.props !== !0 || M.items !== !0))
        return H.if(A, () => this.mergeEvaluated(T, l.Name)), !0;
    }
  }
  wt.KeywordCxt = b;
  function j(N, T, A, M) {
    const H = new b(N, A, T);
    "code" in A ? A.code(H, M) : H.$data && A.validate ? (0, a.funcKeywordCode)(H, A) : "macro" in A ? (0, a.macroKeywordCode)(H, A) : (A.compile || A.validate) && (0, a.funcKeywordCode)(H, A);
  }
  const k = /^\/(?:[^~]|~0|~1)*$/, G = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function U(N, { dataLevel: T, dataNames: A, dataPathArr: M }) {
    let H, x;
    if (N === "")
      return c.default.rootData;
    if (N[0] === "/") {
      if (!k.test(N))
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
      if (x = A[T - _e], !H)
        return x;
    }
    let ge = x;
    const Le = H.split("/");
    for (const Pe of Le)
      Pe && (x = (0, l._)`${x}${(0, l.getProperty)((0, u.unescapeJsonPointer)(Pe))}`, ge = (0, l._)`${ge} && ${x}`);
    return ge;
    function Se(Pe, _e) {
      return `Cannot access ${Pe} ${_e} levels up, current level is ${T}`;
    }
  }
  return wt.getData = U, wt;
}
var In = {}, vc;
function Mo() {
  if (vc) return In;
  vc = 1, Object.defineProperty(In, "__esModule", { value: !0 });
  class e extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return In.default = e, In;
}
var Ur = {};
Object.defineProperty(Ur, "__esModule", { value: !0 });
const Us = Ie;
class Ug extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Us.resolveUrl)(t, r, n), this.missingSchema = (0, Us.normalizeId)((0, Us.getFullPath)(t, this.missingRef));
  }
}
Ur.default = Ug;
var Be = {};
Object.defineProperty(Be, "__esModule", { value: !0 });
Be.resolveSchema = Be.getCompilingSchema = Be.resolveRef = Be.compileSchema = Be.SchemaEnv = void 0;
const nt = oe, qg = Mo(), Qt = Ht(), it = Ie, wc = F, Kg = _s();
class vs {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, it.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Be.SchemaEnv = vs;
function Vo(e) {
  const t = Vu.call(this, e);
  if (t)
    return t;
  const r = (0, it.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new nt.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let l;
  e.$async && (l = o.scopeValue("Error", {
    ref: qg.default,
    code: (0, nt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: Qt.default.data,
    parentData: Qt.default.parentData,
    parentDataProperty: Qt.default.parentDataProperty,
    dataNames: [Qt.default.data],
    dataPathArr: [nt.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, nt.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: l,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: nt.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, nt._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, Kg.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    u = `${o.scopeRefs(Qt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const $ = new Function(`${Qt.default.self}`, `${Qt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(c, { ref: $ }), $.errors = null, $.schema = e.schema, $.schemaEnv = e, e.$async && ($.$async = !0), this.opts.code.source === !0 && ($.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: v, items: _ } = d;
      $.evaluated = {
        props: v instanceof nt.Name ? void 0 : v,
        items: _ instanceof nt.Name ? void 0 : _,
        dynamicProps: v instanceof nt.Name,
        dynamicItems: _ instanceof nt.Name
      }, $.source && ($.source.evaluated = (0, nt.stringify)($.evaluated));
    }
    return e.validate = $, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
Be.compileSchema = Vo;
function Gg(e, t, r) {
  var n;
  r = (0, it.resolveUrl)(this.opts.uriResolver, t, r);
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
Be.resolveRef = Gg;
function Hg(e) {
  return (0, it.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Vo.call(this, e);
}
function Vu(e) {
  for (const t of this._compilations)
    if (Bg(t, e))
      return t;
}
Be.getCompilingSchema = Vu;
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
  const r = this.opts.uriResolver.parse(t), n = (0, it._getFullPath)(this.opts.uriResolver, r);
  let s = (0, it.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return qs.call(this, r, e);
  const a = (0, it.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const l = ws.call(this, e, o);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : qs.call(this, r, l);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Vo.call(this, o), a === (0, it.normalizeId)(t)) {
      const { schema: l } = o, { schemaId: c } = this.opts, d = l[c];
      return d && (s = (0, it.resolveUrl)(this.opts.uriResolver, s, d)), new vs({ schema: l, schemaId: c, root: e, baseId: s });
    }
    return qs.call(this, r, o);
  }
}
Be.resolveSchema = ws;
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
    const c = r[(0, wc.unescapeFragment)(l)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !Xg.has(l) && d && (t = (0, it.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, wc.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, it.resolveUrl)(this.opts.uriResolver, t, r.$ref);
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
const Lu = cu;
Lu.code = 'require("ajv/dist/runtime/uri").default';
Lo.default = Lu;
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
  const n = Mo(), s = Ur, a = dr, o = Be, l = oe, c = Ie, d = be, u = F, h = t_, w = Lo, $ = (P, p) => new RegExp(P, p);
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
    var p, S, y, i, f, b, j, k, G, U, N, T, A, M, H, x, ge, Le, Se, Pe, _e, ht, je, Bt, Wt;
    const xe = P.strict, Xt = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, Gr = Xt === !0 || Xt === void 0 ? 1 : Xt || 0, Hr = (y = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && y !== void 0 ? y : $, Ts = (i = P.uriResolver) !== null && i !== void 0 ? i : w.default;
    return {
      strictSchema: (b = (f = P.strictSchema) !== null && f !== void 0 ? f : xe) !== null && b !== void 0 ? b : !0,
      strictNumbers: (k = (j = P.strictNumbers) !== null && j !== void 0 ? j : xe) !== null && k !== void 0 ? k : !0,
      strictTypes: (U = (G = P.strictTypes) !== null && G !== void 0 ? G : xe) !== null && U !== void 0 ? U : "log",
      strictTuples: (T = (N = P.strictTuples) !== null && N !== void 0 ? N : xe) !== null && T !== void 0 ? T : "log",
      strictRequired: (M = (A = P.strictRequired) !== null && A !== void 0 ? A : xe) !== null && M !== void 0 ? M : !1,
      code: P.code ? { ...P.code, optimize: Gr, regExp: Hr } : { optimize: Gr, regExp: Hr },
      loopRequired: (H = P.loopRequired) !== null && H !== void 0 ? H : E,
      loopEnum: (x = P.loopEnum) !== null && x !== void 0 ? x : E,
      meta: (ge = P.meta) !== null && ge !== void 0 ? ge : !0,
      messages: (Le = P.messages) !== null && Le !== void 0 ? Le : !0,
      inlineRefs: (Se = P.inlineRefs) !== null && Se !== void 0 ? Se : !0,
      schemaId: (Pe = P.schemaId) !== null && Pe !== void 0 ? Pe : "$id",
      addUsedSchema: (_e = P.addUsedSchema) !== null && _e !== void 0 ? _e : !0,
      validateSchema: (ht = P.validateSchema) !== null && ht !== void 0 ? ht : !0,
      validateFormats: (je = P.validateFormats) !== null && je !== void 0 ? je : !0,
      unicodeRegExp: (Bt = P.unicodeRegExp) !== null && Bt !== void 0 ? Bt : !0,
      int32range: (Wt = P.int32range) !== null && Wt !== void 0 ? Wt : !0,
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
          return j.call(this, N), await k.call(this, N.missingSchema), b.call(this, U);
        }
      }
      function j({ missingSchema: U, missingRef: N }) {
        if (this.refs[U])
          throw new Error(`AnySchema ${U} is loaded but ${N} cannot be resolved`);
      }
      async function k(U) {
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
          const k = y[j];
          if (typeof k != "object")
            continue;
          const { $data: G } = k.definition, U = b[j];
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
      let k = this._cache.get(p);
      if (k !== void 0)
        return k;
      y = (0, c.normalizeId)(b || y);
      const G = c.getSchemaRefs.call(this, p, y);
      return k = new o.SchemaEnv({ schema: p, schemaId: j, meta: S, baseId: y, localRefs: G }), this._cache.set(k.schema, k), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = k), i && this.validateSchema(p, !0), k;
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
    let b = i ? f.post : f.rules.find(({ type: k }) => k === S);
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
    p.before ? V.call(this, b, j, p.before) : b.rules.push(j), f.all[P] = j, (y = p.implements) === null || y === void 0 || y.forEach((k) => this.addKeyword(k));
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
})(wu);
var Fo = {}, zo = {}, Uo = {};
Object.defineProperty(Uo, "__esModule", { value: !0 });
const r_ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Uo.default = r_;
var fr = {};
Object.defineProperty(fr, "__esModule", { value: !0 });
fr.callRef = fr.getValidate = void 0;
const n_ = Ur, Ec = ce, He = oe, $r = Ht(), bc = Be, jn = F, s_ = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: l, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = bc.resolveRef.call(c, d, s, r);
    if (u === void 0)
      throw new n_.default(n.opts.uriResolver, s, r);
    if (u instanceof bc.SchemaEnv)
      return w(u);
    return $(u);
    function h() {
      if (a === d)
        return Yn(e, o, a, a.$async);
      const v = t.scopeValue("root", { ref: d });
      return Yn(e, (0, He._)`${v}.validate`, d, d.$async);
    }
    function w(v) {
      const _ = Fu(e, v);
      Yn(e, _, v, v.$async);
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
function Fu(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, He._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
fr.getValidate = Fu;
function Yn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: l, opts: c } = a, d = c.passContext ? $r.default.this : He.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, He._)`await ${(0, Ec.callValidateCode)(e, t, d)}`), $(t), o || s.assign(v, !0);
    }, (_) => {
      s.if((0, He._)`!(${_} instanceof ${a.ValidationError})`, () => s.throw(_)), w(_), o || s.assign(v, !1);
    }), e.ok(v);
  }
  function h() {
    e.result((0, Ec.callValidateCode)(e, t, d), () => $(t), () => w(t));
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
        g.props !== void 0 && (a.props = jn.mergeEvaluated.props(s, g.props, a.props));
      else {
        const m = s.var("props", (0, He._)`${v}.evaluated.props`);
        a.props = jn.mergeEvaluated.props(s, m, a.props, He.Name);
      }
    if (a.items !== !0)
      if (g && !g.dynamicItems)
        g.items !== void 0 && (a.items = jn.mergeEvaluated.items(s, g.items, a.items));
      else {
        const m = s.var("items", (0, He._)`${v}.evaluated.items`);
        a.items = jn.mergeEvaluated.items(s, m, a.items, He.Name);
      }
  }
}
fr.callRef = Yn;
fr.default = s_;
Object.defineProperty(zo, "__esModule", { value: !0 });
const a_ = Uo, o_ = fr, i_ = [
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
const as = oe, Dt = as.operators, os = {
  maximum: { okStr: "<=", ok: Dt.LTE, fail: Dt.GT },
  minimum: { okStr: ">=", ok: Dt.GTE, fail: Dt.LT },
  exclusiveMaximum: { okStr: "<", ok: Dt.LT, fail: Dt.GTE },
  exclusiveMinimum: { okStr: ">", ok: Dt.GT, fail: Dt.LTE }
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
const on = oe, u_ = {
  message: ({ schemaCode: e }) => (0, on.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, on._)`{multipleOf: ${e}}`
}, d_ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: u_,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), l = a ? (0, on._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, on._)`${o} !== parseInt(${o})`;
    e.fail$data((0, on._)`(${n} === 0 || (${o} = ${r}/${n}, ${l}))`);
  }
};
Go.default = d_;
var Ho = {}, Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
function zu(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Bo.default = zu;
zu.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Ho, "__esModule", { value: !0 });
const rr = oe, f_ = F, h_ = Bo, m_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, rr.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, rr._)`{limit: ${e}}`
}, p_ = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: m_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? rr.operators.GT : rr.operators.LT, o = s.opts.unicode === !1 ? (0, rr._)`${r}.length` : (0, rr._)`${(0, f_.useFunc)(e.gen, h_.default)}(${r})`;
    e.fail$data((0, rr._)`${o} ${a} ${n}`);
  }
};
Ho.default = p_;
var Wo = {};
Object.defineProperty(Wo, "__esModule", { value: !0 });
const $_ = ce, y_ = F, br = oe, g_ = {
  message: ({ schemaCode: e }) => (0, br.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, br._)`{pattern: ${e}}`
}, __ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: g_,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e, l = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, br._)`new RegExp` : (0, y_.useFunc)(t, c), u = t.let("valid");
      t.try(() => t.assign(u, (0, br._)`${d}(${a}, ${l}).test(${r})`), () => t.assign(u, !1)), e.fail$data((0, br._)`!${u}`);
    } else {
      const c = (0, $_.usePattern)(e, s);
      e.fail$data((0, br._)`!${c}.test(${r})`);
    }
  }
};
Wo.default = __;
var Xo = {};
Object.defineProperty(Xo, "__esModule", { value: !0 });
const cn = oe, v_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, cn.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, cn._)`{limit: ${e}}`
}, w_ = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: v_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? cn.operators.GT : cn.operators.LT;
    e.fail$data((0, cn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Xo.default = w_;
var Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
const Qr = ce, ln = oe, E_ = F, b_ = {
  message: ({ params: { missingProperty: e } }) => (0, ln.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, ln._)`{missingProperty: ${e}}`
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
        e.block$data(ln.nil, h);
      else
        for (const $ of r)
          (0, Qr.checkReportMissingProp)(e, $);
    }
    function u() {
      const $ = t.let("missing");
      if (c || a) {
        const v = t.let("valid", !0);
        e.block$data(v, () => w($, v)), e.ok(v);
      } else
        t.if((0, Qr.checkMissingProp)(e, r, $)), (0, Qr.reportMissingProp)(e, $), t.else();
    }
    function h() {
      t.forOf("prop", n, ($) => {
        e.setParams({ missingProperty: $ }), t.if((0, Qr.noPropertyInData)(t, s, $, l.ownProperties), () => e.error());
      });
    }
    function w($, v) {
      e.setParams({ missingProperty: $ }), t.forOf($, n, () => {
        t.assign(v, (0, Qr.propertyInData)(t, s, $, l.ownProperties)), t.if((0, ln.not)(v), () => {
          e.error(), t.break();
        });
      }, ln.nil);
    }
  }
};
Jo.default = S_;
var Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
const un = oe, P_ = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, un.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, un._)`{limit: ${e}}`
}, N_ = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: P_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? un.operators.GT : un.operators.LT;
    e.fail$data((0, un._)`${r}.length ${s} ${n}`);
  }
};
Yo.default = N_;
var Qo = {}, gn = {};
Object.defineProperty(gn, "__esModule", { value: !0 });
const Uu = ds;
Uu.code = 'require("ajv/dist/runtime/equal").default';
gn.default = Uu;
Object.defineProperty(Qo, "__esModule", { value: !0 });
const Ks = be, Oe = oe, R_ = F, O_ = gn, T_ = {
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
const $a = oe, j_ = F, k_ = gn, A_ = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, $a._)`{allowedValue: ${e}}`
}, C_ = {
  keyword: "const",
  $data: !0,
  error: A_,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, $a._)`!${(0, j_.useFunc)(t, k_.default)}(${r}, ${s})`) : e.fail((0, $a._)`${a} !== ${r}`);
  }
};
Zo.default = C_;
var xo = {};
Object.defineProperty(xo, "__esModule", { value: !0 });
const en = oe, D_ = F, M_ = gn, V_ = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, en._)`{allowedValues: ${e}}`
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
var ei = {}, qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.validateAdditionalItems = void 0;
const nr = oe, ya = F, Y_ = {
  message: ({ params: { len: e } }) => (0, nr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, nr._)`{limit: ${e}}`
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
    qu(e, n);
  }
};
function qu(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const l = r.const("len", (0, nr._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, nr._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, ya.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, nr._)`${l} <= ${t.length}`);
    r.if((0, nr.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: a, dataProp: u, dataPropType: ya.Type.Num }, d), o.allErrors || r.if((0, nr.not)(d), () => r.break());
    });
  }
}
qr.validateAdditionalItems = qu;
qr.default = Q_;
var ti = {}, Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.validateTuple = void 0;
const Sc = oe, Qn = F, Z_ = ce, x_ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Ku(e, "additionalItems", t);
    r.items = !0, !(0, Qn.alwaysValidSchema)(r, t) && e.ok((0, Z_.validateArray)(e));
  }
};
function Ku(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = Qn.mergeEvaluated.items(n, r.length, l.items));
  const c = n.name("valid"), d = n.const("len", (0, Sc._)`${a}.length`);
  r.forEach((h, w) => {
    (0, Qn.alwaysValidSchema)(l, h) || (n.if((0, Sc._)`${d} > ${w}`, () => e.subschema({
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
Kr.validateTuple = Ku;
Kr.default = x_;
Object.defineProperty(ti, "__esModule", { value: !0 });
const ev = Kr, tv = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, ev.validateTuple)(e, "items")
};
ti.default = tv;
var ri = {};
Object.defineProperty(ri, "__esModule", { value: !0 });
const Pc = oe, rv = F, nv = ce, sv = qr, av = {
  message: ({ params: { len: e } }) => (0, Pc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Pc._)`{limit: ${e}}`
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
const Ze = oe, kn = F, iv = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ze.str)`must contain at least ${e} valid item(s)` : (0, Ze.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ze._)`{minContains: ${e}}` : (0, Ze._)`{minContains: ${e}, maxContains: ${t}}`
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
    const u = t.const("len", (0, Ze._)`${s}.length`);
    if (e.setParams({ min: o, max: l }), l === void 0 && o === 0) {
      (0, kn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && o > l) {
      (0, kn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, kn.alwaysValidSchema)(a, r)) {
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
          dataPropType: kn.Type.Num,
          compositeRule: !0
        }, _), g();
      });
    }
    function v(_) {
      t.code((0, Ze._)`${_}++`), l === void 0 ? t.if((0, Ze._)`${_} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, Ze._)`${_} > ${l}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, Ze._)`${_} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
ni.default = cv;
var Gu = {};
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
})(Gu);
var si = {};
Object.defineProperty(si, "__esModule", { value: !0 });
const Hu = oe, lv = F, uv = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Hu._)`{propertyName: ${e.propertyName}}`
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
      }, a), t.if((0, Hu.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
si.default = dv;
var Es = {};
Object.defineProperty(Es, "__esModule", { value: !0 });
const An = ce, at = oe, fv = Ht(), Cn = F, hv = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, at._)`{additionalProperty: ${e.additionalProperty}}`
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
    const d = (0, An.allSchemaProperties)(n.properties), u = (0, An.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, at._)`${a} === ${fv.default.errors}`);
    function h() {
      t.forIn("key", s, (g) => {
        !d.length && !u.length ? v(g) : t.if(w(g), () => v(g));
      });
    }
    function w(g) {
      let m;
      if (d.length > 8) {
        const E = (0, Cn.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, An.isOwnProperty)(t, E, g);
      } else d.length ? m = (0, at.or)(...d.map((E) => (0, at._)`${g} === ${E}`)) : m = at.nil;
      return u.length && (m = (0, at.or)(m, ...u.map((E) => (0, at._)`${(0, An.usePattern)(e, E)}.test(${g})`))), (0, at.not)(m);
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
      if (typeof r == "object" && !(0, Cn.alwaysValidSchema)(o, r)) {
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
const pv = _s(), Nc = ce, Gs = F, Rc = Es, $v = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Rc.default.code(new pv.KeywordCxt(a, Rc.default, "additionalProperties"));
    const o = (0, Nc.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Gs.mergeEvaluated.props(t, (0, Gs.toHash)(o), a.props));
    const l = o.filter((h) => !(0, Gs.alwaysValidSchema)(a, r[h]));
    if (l.length === 0)
      return;
    const c = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, Nc.propertyInData)(t, s, h, a.opts.ownProperties)), u(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
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
const Oc = ce, Dn = oe, Tc = F, Ic = F, yv = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, l = (0, Oc.allSchemaProperties)(r), c = l.filter((_) => (0, Tc.alwaysValidSchema)(a, r[_]));
    if (l.length === 0 || c.length === l.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, u = t.name("valid");
    a.props !== !0 && !(a.props instanceof Dn.Name) && (a.props = (0, Ic.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    w();
    function w() {
      for (const _ of l)
        d && $(_), a.allErrors ? v(_) : (t.var(u, !0), v(_), t.if(u));
    }
    function $(_) {
      for (const g in d)
        new RegExp(_).test(g) && (0, Tc.checkStrictMode)(a, `property ${g} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function v(_) {
      t.forIn("key", n, (g) => {
        t.if((0, Dn._)`${(0, Oc.usePattern)(e, _)}.test(${g})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: g,
            dataPropType: Ic.Type.Str
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
const is = oe, Bu = F, Rv = {
  message: ({ params: e }) => (0, is.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, is._)`{failingKeyword: ${e.ifClause}}`
}, Ov = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Rv,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Bu.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = jc(n, "then"), a = jc(n, "else");
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
function jc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Bu.alwaysValidSchema)(e, r);
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
const jv = qr, kv = ti, Av = Kr, Cv = ri, Dv = ni, Mv = Gu, Vv = si, Lv = Es, Fv = ai, zv = oi, Uv = ii, qv = ci, Kv = li, Gv = ui, Hv = di, Bv = fi;
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
  return e ? t.push(kv.default, Cv.default) : t.push(jv.default, Av.default), t.push(Dv.default), t;
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
Object.defineProperty(Fo, "__esModule", { value: !0 });
const Zv = zo, xv = qo, ew = ei, tw = hi, kc = Dr, rw = [
  Zv.default,
  xv.default,
  (0, ew.default)(),
  tw.default,
  kc.metadataVocabulary,
  kc.contentVocabulary
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
const _r = oe, ga = bs, Cc = Be, nw = Ur, sw = F, aw = {
  message: ({ params: { discrError: e, tagName: t } }) => e === ga.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, _r._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
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
    const c = t.let("valid", !1), d = t.const("tag", (0, _r._)`${r}${(0, _r.getProperty)(l)}`);
    t.if((0, _r._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: ga.DiscrError.Tag, tag: d, tagName: l })), e.ok(c);
    function u() {
      const $ = w();
      t.if(!1);
      for (const v in $)
        t.elseIf((0, _r._)`${d} === ${v}`), t.assign(c, h($[v]));
      t.else(), e.error(!1, { discrError: ga.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
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
        if (I != null && I.$ref && !(0, sw.schemaHasRulesButRef)(I, a.self.RULES)) {
          const Y = I.$ref;
          if (I = Cc.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, Y), I instanceof Cc.SchemaEnv && (I = I.schema), I === void 0)
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
  const r = wu, n = Fo, s = pi, a = hw, o = ["/properties"], l = "http://json-schema.org/draft-07/schema";
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
  var w = Ur;
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
})(vu);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = _u, n = vu, s = oe, a = new s.Name("fullFormats"), o = new s.Name("fastFormats"), l = (d, u = { keywords: !0 }) => {
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
const $w = /* @__PURE__ */ pl(pw), yw = (e, t, r, n) => {
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
const Dc = (e, t = {}) => {
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
const Pw = "2.0.0", Wu = 256, Nw = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, Rw = 16, Ow = Wu - 6, Tw = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var _n = {
  MAX_LENGTH: Wu,
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
  } = _n, a = Ss;
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
var vn = _a.exports;
const jw = Object.freeze({ loose: !0 }), kw = Object.freeze({}), Aw = (e) => e ? typeof e != "object" ? jw : e : kw;
var $i = Aw;
const Mc = /^[0-9]+$/, Xu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Mc.test(e), n = Mc.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, Cw = (e, t) => Xu(t, e);
var Ju = {
  compareIdentifiers: Xu,
  rcompareIdentifiers: Cw
};
const Mn = Ss, { MAX_LENGTH: Vc, MAX_SAFE_INTEGER: Vn } = _n, { safeRe: Ln, t: Fn } = vn, Dw = $i, { compareIdentifiers: Hs } = Ju;
let Mw = class pt {
  constructor(t, r) {
    if (r = Dw(r), t instanceof pt) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Vc)
      throw new TypeError(
        `version is longer than ${Vc} characters`
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
    if (Mn("SemVer.compare", this.version, this.options, t), !(t instanceof pt)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new pt(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof pt || (t = new pt(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof pt || (t = new pt(t, this.options)), this.prerelease.length && !t.prerelease.length)
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
    t instanceof pt || (t = new pt(t, this.options));
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
var Ve = Mw;
const Lc = Ve, Vw = (e, t, r = !1) => {
  if (e instanceof Lc)
    return e;
  try {
    return new Lc(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var hr = Vw;
const Lw = hr, Fw = (e, t) => {
  const r = Lw(e, t);
  return r ? r.version : null;
};
var zw = Fw;
const Uw = hr, qw = (e, t) => {
  const r = Uw(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var Kw = qw;
const Fc = Ve, Gw = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Fc(
      e instanceof Fc ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var Hw = Gw;
const zc = hr, Bw = (e, t) => {
  const r = zc(e, null, !0), n = zc(t, null, !0), s = r.compare(n);
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
const Xw = Ve, Jw = (e, t) => new Xw(e, t).major;
var Yw = Jw;
const Qw = Ve, Zw = (e, t) => new Qw(e, t).minor;
var xw = Zw;
const eE = Ve, tE = (e, t) => new eE(e, t).patch;
var rE = tE;
const nE = hr, sE = (e, t) => {
  const r = nE(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var aE = sE;
const Uc = Ve, oE = (e, t, r) => new Uc(e, r).compare(new Uc(t, r));
var dt = oE;
const iE = dt, cE = (e, t, r) => iE(t, e, r);
var lE = cE;
const uE = dt, dE = (e, t) => uE(e, t, !0);
var fE = dE;
const qc = Ve, hE = (e, t, r) => {
  const n = new qc(e, r), s = new qc(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var yi = hE;
const mE = yi, pE = (e, t) => e.sort((r, n) => mE(r, n, t));
var $E = pE;
const yE = yi, gE = (e, t) => e.sort((r, n) => yE(n, r, t));
var _E = gE;
const vE = dt, wE = (e, t, r) => vE(e, t, r) > 0;
var Ps = wE;
const EE = dt, bE = (e, t, r) => EE(e, t, r) < 0;
var gi = bE;
const SE = dt, PE = (e, t, r) => SE(e, t, r) === 0;
var Yu = PE;
const NE = dt, RE = (e, t, r) => NE(e, t, r) !== 0;
var Qu = RE;
const OE = dt, TE = (e, t, r) => OE(e, t, r) >= 0;
var _i = TE;
const IE = dt, jE = (e, t, r) => IE(e, t, r) <= 0;
var vi = jE;
const kE = Yu, AE = Qu, CE = Ps, DE = _i, ME = gi, VE = vi, LE = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return kE(e, r, n);
    case "!=":
      return AE(e, r, n);
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
var Zu = LE;
const FE = Ve, zE = hr, { safeRe: zn, t: Un } = vn, UE = (e, t) => {
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
const KE = hr, GE = _n, HE = Ve, BE = (e, t, r) => {
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
var ZE = QE, Bs, Kc;
function ft() {
  if (Kc) return Bs;
  Kc = 1;
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
  const r = ZE, n = new r(), s = $i, a = Ns(), o = Ss, l = Ve, {
    safeRe: c,
    src: d,
    t: u,
    comparatorTrimReplace: h,
    tildeTrimReplace: w,
    caretTrimReplace: $
  } = vn, { FLAG_INCLUDE_PRERELEASE: v, FLAG_LOOSE: _ } = _n, g = new RegExp(d[u.BUILD], "g"), m = (V) => V.value === "<0.0.0-0", E = (V) => V.value === "", R = (V, C) => {
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
      const f = I(p), b = f || I(S), j = b || I(y), k = j;
      return P === "=" && k && (P = ""), i = C.includePrerelease ? "-0" : "", f ? P === ">" || P === "<" ? z = "<0.0.0-0" : z = "*" : P && k ? (b && (S = 0), y = 0, P === ">" ? (P = ">=", b ? (p = +p + 1, S = 0, y = 0) : (S = +S + 1, y = 0)) : P === "<=" && (P = "<", b ? p = +p + 1 : S = +S + 1), P === "<" && (i = "-0"), z = `${P + p}.${S}.${y}${i}`) : b ? z = `>=${p}.0.0${i} <${+p + 1}.0.0-0` : j && (z = `>=${p}.${S}.0${i} <${p}.${+S + 1}.0-0`), o("xRange return", z), z;
    });
  }, J = (V, C) => (o("replaceStars", V, C), V.trim().replace(c[u.STAR], "")), Q = (V, C) => (o("replaceGTE0", V, C), V.trim().replace(c[C.includePrerelease ? u.GTE0PRE : u.GTE0], "")), B = (V) => (C, W, z, P, p, S, y, i, f, b, j, k) => (I(z) ? W = "" : I(P) ? W = `>=${z}.0.0${V ? "-0" : ""}` : I(p) ? W = `>=${z}.${P}.0${V ? "-0" : ""}` : S ? W = `>=${W}` : W = `>=${W}${V ? "-0" : ""}`, I(f) ? i = "" : I(b) ? i = `<${+f + 1}.0.0-0` : I(j) ? i = `<${f}.${+b + 1}.0-0` : k ? i = `<=${f}.${b}.${j}-${k}` : V ? i = `<${f}.${b}.${+j + 1}-0` : i = `<=${i}`, `${W} ${i}`.trim()), ue = (V, C, W) => {
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
var Ws, Gc;
function Ns() {
  if (Gc) return Ws;
  Gc = 1;
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
  const r = $i, { safeRe: n, t: s } = vn, a = Zu, o = Ss, l = Ve, c = ft();
  return Ws;
}
const xE = ft(), eb = (e, t, r) => {
  try {
    t = new xE(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Rs = eb;
const tb = ft(), rb = (e, t) => new tb(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var nb = rb;
const sb = Ve, ab = ft(), ob = (e, t, r) => {
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
const cb = Ve, lb = ft(), ub = (e, t, r) => {
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
const Xs = Ve, fb = ft(), Hc = Ps, hb = (e, t) => {
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
          (!a || Hc(l, a)) && (a = l);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || Hc(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var mb = hb;
const pb = ft(), $b = (e, t) => {
  try {
    return new pb(e, t).range || "*";
  } catch {
    return null;
  }
};
var yb = $b;
const gb = Ve, xu = Ns(), { ANY: _b } = xu, vb = ft(), wb = Rs, Bc = Ps, Wc = gi, Eb = vi, bb = _i, Sb = (e, t, r, n) => {
  e = new gb(e, n), t = new vb(t, n);
  let s, a, o, l, c;
  switch (r) {
    case ">":
      s = Bc, a = Eb, o = Wc, l = ">", c = ">=";
      break;
    case "<":
      s = Wc, a = bb, o = Bc, l = "<", c = "<=";
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
      $.semver === _b && ($ = new xu(">=0.0.0")), h = h || $, w = w || $, s($.semver, h.semver, n) ? h = $ : o($.semver, w.semver, n) && (w = $);
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
const Xc = ft(), jb = (e, t, r) => (e = new Xc(e, r), t = new Xc(t, r), e.intersects(t, r));
var kb = jb;
const Ab = Rs, Cb = dt;
var Db = (e, t, r) => {
  const n = [];
  let s = null, a = null;
  const o = e.sort((u, h) => Cb(u, h, r));
  for (const u of o)
    Ab(u, t, r) ? (a = u, s || (s = u)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const l = [];
  for (const [u, h] of n)
    u === h ? l.push(u) : !h && u === o[0] ? l.push("*") : h ? u === o[0] ? l.push(`<=${h}`) : l.push(`${u} - ${h}`) : l.push(`>=${u}`);
  const c = l.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < d.length ? c : t;
};
const Jc = ft(), Ei = Ns(), { ANY: Js } = Ei, Ys = Rs, bi = dt, Mb = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Jc(e, r), t = new Jc(t, r);
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
}, Vb = [new Ei(">=0.0.0-0")], Yc = [new Ei(">=0.0.0")], Lb = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Js) {
    if (t.length === 1 && t[0].semver === Js)
      return !0;
    r.includePrerelease ? e = Vb : e = Yc;
  }
  if (t.length === 1 && t[0].semver === Js) {
    if (r.includePrerelease)
      return !0;
    t = Yc;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const $ of e)
    $.operator === ">" || $.operator === ">=" ? s = Qc(s, $, r) : $.operator === "<" || $.operator === "<=" ? a = Zc(a, $, r) : n.add($.semver);
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
        if (l = Qc(s, $, r), l === $ && l !== s)
          return !1;
      } else if (s.operator === ">=" && !$.test(s.semver))
        return !1;
    }
    if (a) {
      if (h && $.semver.prerelease && $.semver.prerelease.length && $.semver.major === h.major && $.semver.minor === h.minor && $.semver.patch === h.patch && (h = !1), $.operator === "<" || $.operator === "<=") {
        if (c = Zc(a, $, r), c === $ && c !== a)
          return !1;
      } else if (a.operator === "<=" && !$.test(a.semver))
        return !1;
    }
    if (!$.operator && (a || s) && o !== 0)
      return !1;
  }
  return !(s && d && !a && o !== 0 || a && u && !s && o !== 0 || w || h);
}, Qc = (e, t, r) => {
  if (!e)
    return t;
  const n = bi(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Zc = (e, t, r) => {
  if (!e)
    return t;
  const n = bi(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Fb = Mb;
const Qs = vn, xc = _n, zb = Ve, el = Ju, Ub = hr, qb = zw, Kb = Kw, Gb = Hw, Hb = Ww, Bb = Yw, Wb = xw, Xb = rE, Jb = aE, Yb = dt, Qb = lE, Zb = fE, xb = yi, eS = $E, tS = _E, rS = Ps, nS = gi, sS = Yu, aS = Qu, oS = _i, iS = vi, cS = Zu, lS = qE, uS = YE, dS = Ns(), fS = ft(), hS = Rs, mS = nb, pS = ib, $S = db, yS = mb, gS = yb, _S = wi, vS = Rb, wS = Ib, ES = kb, bS = Db, SS = Fb;
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
  SEMVER_SPEC_VERSION: xc.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: xc.RELEASE_TYPES,
  compareIdentifiers: el.compareIdentifiers,
  rcompareIdentifiers: el.rcompareIdentifiers
};
const yr = /* @__PURE__ */ pl(PS), NS = Object.prototype.toString, RS = "[object Uint8Array]", OS = "[object ArrayBuffer]";
function ed(e, t, r) {
  return e ? e.constructor === t ? !0 : NS.call(e) === r : !1;
}
function td(e) {
  return ed(e, Uint8Array, RS);
}
function TS(e) {
  return ed(e, ArrayBuffer, OS);
}
function IS(e) {
  return td(e) || TS(e);
}
function jS(e) {
  if (!td(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function kS(e) {
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
  return kS(e), qn[t] ?? (qn[t] = new globalThis.TextDecoder(t)), qn[t].decode(e);
}
function AS(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const CS = new globalThis.TextEncoder();
function xs(e) {
  return AS(e), CS.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const tl = "aes-256-cbc", rd = /* @__PURE__ */ new Set([
  "aes-256-cbc",
  "aes-256-gcm",
  "aes-256-ctr"
]), DS = (e) => typeof e == "string" && rd.has(e), St = () => /* @__PURE__ */ Object.create(null), rl = (e) => e !== void 0, ea = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Lt = "__internal__", ta = `${Lt}.migrations.version`;
var zt, Ut, sr, Ke, Ye, ar, or, jr, $t, Ne, nd, sd, ad, od, id, cd, ld, ud;
class MS {
  constructor(t = {}) {
    et(this, Ne);
    Br(this, "path");
    Br(this, "events");
    et(this, zt);
    et(this, Ut);
    et(this, sr);
    et(this, Ke);
    et(this, Ye, {});
    et(this, ar, !1);
    et(this, or);
    et(this, jr);
    et(this, $t);
    Br(this, "_deserialize", (t) => JSON.parse(t));
    Br(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = _t(this, Ne, nd).call(this, t);
    qe(this, Ke, r), _t(this, Ne, sd).call(this, r), _t(this, Ne, od).call(this, r), _t(this, Ne, id).call(this, r), this.events = new EventTarget(), qe(this, Ut, r.encryptionKey), qe(this, sr, r.encryptionAlgorithm ?? tl), this.path = _t(this, Ne, cd).call(this, r), _t(this, Ne, ld).call(this, r), r.watch && this._watch();
  }
  get(t, r) {
    if (ee(this, Ke).accessPropertiesByDotNotation)
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
      throw new TypeError(`Please don't use the ${Lt} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, o) => {
      if (ea(a, o), ee(this, Ke).accessPropertiesByDotNotation)
        wn(n, a, o);
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
    return ee(this, Ke).accessPropertiesByDotNotation ? ks(this.store, t) : t in this.store;
  }
  appendToArray(t, r) {
    ea(t, r);
    const n = ee(this, Ke).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
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
      rl(ee(this, Ye)[r]) && this.set(r, ee(this, Ye)[r]);
  }
  delete(t) {
    const { store: r } = this;
    ee(this, Ke).accessPropertiesByDotNotation ? Pd(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = St();
    for (const r of Object.keys(ee(this, Ye)))
      rl(ee(this, Ye)[r]) && (ea(r, ee(this, Ye)[r]), ee(this, Ke).accessPropertiesByDotNotation ? wn(t, r, ee(this, Ye)[r]) : t[r] = ee(this, Ye)[r]);
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
      const r = te.readFileSync(this.path, ee(this, Ut) ? null : "utf8"), n = this._decryptData(r);
      return ((a) => {
        const o = this._deserialize(a);
        return ee(this, ar) || this._validate(o), Object.assign(St(), o);
      })(n);
    } catch (r) {
      if ((r == null ? void 0 : r.code) === "ENOENT")
        return this._ensureDirectory(), St();
      if (ee(this, Ke).clearInvalidConfig) {
        const n = r;
        if (n.name === "SyntaxError" || (t = n.message) != null && t.startsWith("Config schema violation:") || n.message === "Failed to decrypt config data.")
          return St();
      }
      throw r;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !ks(t, Lt))
      try {
        const r = te.readFileSync(this.path, ee(this, Ut) ? null : "utf8"), n = this._decryptData(r), s = this._deserialize(n);
        ks(s, Lt) && wn(t, Lt, Ti(s, Lt));
      } catch {
      }
    ee(this, ar) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, r]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    ee(this, or) && (ee(this, or).close(), qe(this, or, void 0)), ee(this, jr) && (te.unwatchFile(this.path), qe(this, jr, !1)), qe(this, $t, void 0);
  }
  _decryptData(t) {
    const r = ee(this, Ut);
    if (!r)
      return typeof t == "string" ? t : Kn(t);
    const n = ee(this, sr), s = n === "aes-256-gcm" ? 16 : 0, a = ":".codePointAt(0), o = typeof t == "string" ? t.codePointAt(16) : t[16];
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
      const { ciphertext: v, authenticationTag: _ } = c(h), g = Wr.pbkdf2Sync(r, $, 1e4, 32, "sha512"), m = Wr.createDecipheriv(n, g, d);
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
    if (!ee(this, zt) || ee(this, zt).call(this, t) || !ee(this, zt).errors)
      return;
    const n = ee(this, zt).errors.map(({ instancePath: s, message: a = "" }) => `\`${s.slice(1)}\` ${a}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    te.mkdirSync(ae.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    const n = ee(this, Ut);
    if (n) {
      const s = Wr.randomBytes(16), a = Wr.pbkdf2Sync(n, s, 1e4, 32, "sha512"), o = Wr.createCipheriv(ee(this, sr), a, s), l = Zs([o.update(xs(r)), o.final()]), c = [s, xs(":"), l];
      ee(this, sr) === "aes-256-gcm" && c.push(o.getAuthTag()), r = Zs(c);
    }
    if ($e.env.SNAP)
      te.writeFileSync(this.path, r, { mode: ee(this, Ke).configFileMode });
    else
      try {
        ml(this.path, r, { mode: ee(this, Ke).configFileMode });
      } catch (s) {
        if ((s == null ? void 0 : s.code) === "EXDEV") {
          te.writeFileSync(this.path, r, { mode: ee(this, Ke).configFileMode });
          return;
        }
        throw s;
      }
  }
  _watch() {
    if (this._ensureDirectory(), te.existsSync(this.path) || this._write(St()), $e.platform === "win32" || $e.platform === "darwin") {
      ee(this, $t) ?? qe(this, $t, Dc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = ae.dirname(this.path), r = ae.basename(this.path);
      qe(this, or, te.watch(t, { persistent: !1, encoding: "utf8" }, (n, s) => {
        s && s !== r || typeof ee(this, $t) == "function" && ee(this, $t).call(this);
      }));
    } else
      ee(this, $t) ?? qe(this, $t, Dc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), te.watchFile(this.path, { persistent: !1 }, (t, r) => {
        typeof ee(this, $t) == "function" && ee(this, $t).call(this);
      }), qe(this, jr, !0);
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
    (this._isVersionInRangeFormat(s) || !yr.eq(s, r)) && this._set(ta, r);
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
    return t === Lt || t.startsWith(`${Lt}.`);
  }
  _isVersionInRangeFormat(t) {
    return yr.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && yr.satisfies(r, t) ? !1 : yr.satisfies(n, t) : !(yr.lte(t, r) || yr.gt(t, n));
  }
  _get(t, r) {
    return Ti(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    wn(n, t, r), this.store = n;
  }
}
zt = new WeakMap(), Ut = new WeakMap(), sr = new WeakMap(), Ke = new WeakMap(), Ye = new WeakMap(), ar = new WeakMap(), or = new WeakMap(), jr = new WeakMap(), $t = new WeakMap(), Ne = new WeakSet(), nd = function(t) {
  const r = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (r.encryptionAlgorithm ?? (r.encryptionAlgorithm = tl), !DS(r.encryptionAlgorithm))
    throw new TypeError(`The \`encryptionAlgorithm\` option must be one of: ${[...rd].join(", ")}`);
  if (!r.cwd) {
    if (!r.projectName)
      throw new Error("Please specify the `projectName` option.");
    r.cwd = Td(r.projectName, { suffix: r.projectSuffix }).config;
  }
  return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
}, sd = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const r = $w.default, n = new K0.Ajv2020({
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
  qe(this, zt, n.compile(s)), _t(this, Ne, ad).call(this, t.schema);
}, ad = function(t) {
  const r = Object.entries(t ?? {});
  for (const [n, s] of r) {
    if (!s || typeof s != "object" || !Object.hasOwn(s, "default"))
      continue;
    const { default: a } = s;
    a !== void 0 && (ee(this, Ye)[n] = a);
  }
}, od = function(t) {
  t.defaults && Object.assign(ee(this, Ye), t.defaults);
}, id = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, cd = function(t) {
  const r = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = r ? `.${r}` : "";
  return ae.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
}, ld = function(t) {
  if (t.migrations) {
    _t(this, Ne, ud).call(this, t), this._validate(this.store);
    return;
  }
  const r = this.store, n = Object.assign(St(), t.defaults ?? {}, r);
  this._validate(n);
  try {
    Oi.deepEqual(r, n);
  } catch {
    this.store = n;
  }
}, ud = function(t) {
  const { migrations: r, projectVersion: n } = t;
  if (r) {
    if (!n)
      throw new Error("Please specify the `projectVersion` option.");
    qe(this, ar, !0);
    try {
      const s = this.store, a = Object.assign(St(), t.defaults ?? {}, s);
      try {
        Oi.deepEqual(s, a);
      } catch {
        this._write(a);
      }
      this._migrate(r, n, t.beforeEachMigration);
    } finally {
      qe(this, ar, !1);
    }
  }
};
const { app: xn, ipcMain: va, shell: VS } = cl;
let nl = !1;
const sl = () => {
  if (!va || !xn)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: xn.getPath("userData"),
    appVersion: xn.getVersion()
  };
  return nl || (va.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), nl = !0), e;
};
class LS extends MS {
  constructor(t) {
    let r, n;
    if ($e.type === "renderer") {
      const s = cl.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else va && xn && ({ defaultCwd: r, appVersion: n } = sl());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = ae.isAbsolute(t.cwd) ? t.cwd : ae.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    sl();
  }
  async openInEditor() {
    const t = await VS.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const dd = ae.dirname(Ed(import.meta.url));
process.env.APP_ROOT = ae.join(dd, "../..");
const c1 = ae.join(process.env.APP_ROOT, "dist-electron"), fd = ae.join(process.env.APP_ROOT, "dist"), pn = process.env.VITE_DEV_SERVER_URL;
process.env.VITE_PUBLIC = pn ? ae.join(process.env.APP_ROOT, "public") : fd;
Ea.release().startsWith("6.1") && Ue.disableHardwareAcceleration();
process.platform === "win32" && Ue.setAppUserModelId(Ue.getName());
Ue.requestSingleInstanceLock() || (Ue.quit(), process.exit(0));
const FS = new LS({
  name: "planner-data",
  defaults: {
    shortPlans: [],
    shortTasks: [],
    longTasks: [],
    notifiedTaskIds: []
  }
}), Pt = FS;
let D = null, ct = null, mt = null, dn = null, Si = !0, Os = !1, al = "top-right", Sr = null, Pr = null, cs = !1;
const hd = ae.join(dd, "../preload/index.mjs"), md = ae.join(fd, "index.html");
function zS(e, t) {
  const { workArea: r } = fn.getDisplayMatching(e.getBounds()), n = 0, s = e.getBounds(), a = r.x + n, o = r.x + r.width - s.width - n, l = r.y + n, c = r.y + r.height - s.height - n;
  return {
    x: t.endsWith("right") ? o : a,
    y: t.startsWith("bottom") ? c : l
  };
}
function Ir(e, t = al) {
  const r = zS(e, t), n = Math.round(r.x), s = Math.round(r.y), a = e.getBounds();
  al = t, !(Math.abs(a.x - n) <= 1 && Math.abs(a.y - s) <= 1) && (Pr && clearTimeout(Pr), cs = !0, e.setPosition(n, s, !1), Pr = setTimeout(() => {
    cs = !1, Pr = null;
  }, 160));
}
function US(e) {
  const t = e.getBounds(), { workArea: r } = fn.getDisplayMatching(t), n = t.x + t.width / 2, s = t.y + t.height / 2, a = n < r.x + r.width / 2 ? "left" : "right";
  return `${s < r.y + r.height / 2 ? "top" : "bottom"}-${a}`;
}
function qS(e) {
  cs || (Sr && clearTimeout(Sr), Sr = setTimeout(() => {
    Sr = null, e.isDestroyed() || Ir(e, US(e));
  }, 520));
}
function ut(e = !1) {
  !D || D.isDestroyed() || (Si = !0, D.setSkipTaskbar(!0), D.setFocusable(!0), D.setIgnoreMouseEvents(!1), Ir(D), e ? (D.show(), D.setSkipTaskbar(!0), D.moveTop(), D.focus()) : (D.showInactive(), D.setSkipTaskbar(!0)));
}
function ol() {
  !D || D.isDestroyed() || (D.setAlwaysOnTop(!0, "floating"), D.show(), D.moveTop(), D.focus(), setTimeout(() => {
    D && !D.isDestroyed() && D.setAlwaysOnTop(!1);
  }, 1500));
}
function Xe() {
  if (!ct) return;
  const e = !!(D && !D.isDestroyed() && D.isVisible()), t = wd.buildFromTemplate([
    {
      label: e ? "隐藏窗口" : "显示窗口",
      click: () => {
        !D || D.isDestroyed() || (D.isVisible() ? D.hide() : ut(!0), Xe());
      }
    },
    { type: "separator" },
    {
      label: "退出",
      click: () => {
        Os = !0, Ue.quit();
      }
    }
  ]);
  ct.setToolTip("计划小组件"), ct.setContextMenu(t);
}
function ir(e, t = !1) {
  !D || D.isDestroyed() || (Si = e, D.setAlwaysOnTop(!1), D.setVisibleOnAllWorkspaces(!1), D.setSkipTaskbar(!0), D.setFocusable(e), D.setIgnoreMouseEvents(!e, { forward: !0 }), e ? ut(t) : D.isVisible() && (D.blur(), ut(!1)), D.webContents.isDestroyed() || D.webContents.send("planner:interactive-changed", e), Xe());
}
function KS() {
  if (ct) return;
  const e = ae.join(process.env.VITE_PUBLIC, "favicon.ico"), t = gd.createFromPath(e);
  ct = new _d(t.isEmpty() ? e : t), ct.on("click", () => {
    !D || D.isDestroyed() || (D.isVisible() ? D.hide() : ut(!0), Xe());
  }), ct.on("double-click", () => {
    !D || D.isDestroyed() || (ut(!0), Xe());
  }), Xe();
}
function GS() {
  if (mt && !mt.isDestroyed()) return;
  const { bounds: e } = fn.getDisplayNearestPoint(fn.getCursorScreenPoint());
  mt = new wa({
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
      preload: hd,
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), mt.setIgnoreMouseEvents(!0, { forward: !0 }), pn ? mt.loadURL(`${pn}#celebrate`) : mt.loadFile(md, { hash: "celebrate" }), setTimeout(() => {
    mt && !mt.isDestroyed() && mt.close(), mt = null;
  }, 2200);
}
function il() {
  if (!Ni.isSupported()) return;
  const e = Date.now(), t = 5 * 60 * 1e3, r = Pt.get("shortTasks"), n = new Set(Pt.get("notifiedTaskIds"));
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
  Pt.set("notifiedTaskIds", [...n]);
}
function HS() {
  dn && clearInterval(dn), il(), dn = setInterval(il, 60 * 1e3);
}
function BS() {
  process.platform === "win32" && Ue.isPackaged && Ue.setLoginItemSettings({
    openAtLogin: !0,
    openAsHidden: !0,
    path: process.execPath,
    args: ["--hidden"]
  });
}
function WS() {
  Mt.handle("planner:get-data", () => Pt.store), Mt.handle("planner:save-short-plans", (e, t) => (Pt.set("shortPlans", t), t)), Mt.handle("planner:save-short-tasks", (e, t) => {
    Pt.set("shortTasks", t);
    const r = new Set(t.filter((s) => !s.completed).map((s) => s.id)), n = Pt.get("notifiedTaskIds").filter((s) => r.has(s));
    return Pt.set("notifiedTaskIds", n), t;
  }), Mt.handle("planner:save-long-tasks", (e, t) => (Pt.set("longTasks", t), t)), Mt.on("planner:celebrate", () => {
    GS();
  }), Mt.on("planner:set-interactive", (e, t) => {
    ir(t, t);
  }), Mt.handle("planner:toggle-widget", () => !D || D.isDestroyed() ? !1 : D.isVisible() ? (D.hide(), Xe(), !1) : (ut(!0), Xe(), !0));
}
async function pd() {
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
      preload: hd,
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), D.setSkipTaskbar(!0), Ir(D), pn ? D.loadURL(pn) : D.loadFile(md), D.once("ready-to-show", () => {
    e ? Xe() : (ir(!0, !0), ol());
  }), setTimeout(() => {
    D && !D.isDestroyed() && !e && (ir(!0, !0), ol());
  }, 1200), D.webContents.on("did-finish-load", () => {
    D == null || D.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString()), e || (ut(!0), ir(!0, !0)), Xe();
  }), D.on("show", () => {
    D && (D.setAlwaysOnTop(!1), D.setSkipTaskbar(!0), Ir(D), Xe());
  }), D.on("hide", Xe), D.on("resize", () => {
    D && Ir(D);
  }), D.on("move", () => {
    D && !D.isDestroyed() && !cs && qS(D), Xe();
  }), D.on("close", (t) => {
    Os || (t.preventDefault(), D == null || D.hide());
  }), D.webContents.setWindowOpenHandler(({ url: t }) => (t.startsWith("https:") && vd.openExternal(t), { action: "deny" }));
}
Ue.whenReady().then(() => {
  BS(), WS(), KS(), pd(), HS(), fn.on("display-metrics-changed", () => {
    D && !D.isDestroyed() && Ir(D);
  }), ll.register("CommandOrControl+Shift+T", () => {
    !D || D.isDestroyed() || (D.isVisible() ? (D.hide(), Xe()) : ut(!0));
  });
});
Ue.on("before-quit", () => {
  Os = !0;
});
Ue.on("window-all-closed", () => {
  process.platform !== "darwin" && Os && Ue.quit();
});
Ue.on("will-quit", () => {
  dn && clearInterval(dn), Sr && clearTimeout(Sr), Pr && clearTimeout(Pr), ll.unregisterAll(), ct == null || ct.destroy(), ct = null;
});
Ue.on("second-instance", () => {
  D && !D.isDestroyed() && (D.isMinimized() && D.restore(), ut(!0), ir(!0, !0));
});
Ue.on("activate", () => {
  wa.getAllWindows().length ? (ut(!0), ir(!0, !0)) : pd();
});
Mt.handle("open-win", async (e, t) => {
  !D || D.isDestroyed() || (D.isVisible() || ut(!0), typeof t == "string" && t === "toggle-widget" && ir(!Si, !0));
});
export {
  c1 as MAIN_DIST,
  fd as RENDERER_DIST,
  pn as VITE_DEV_SERVER_URL
};
