var Ou = Object.defineProperty;
var Lu = (r, t, e) => t in r ? Ou(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var nn = (r, t, e) => (Lu(r, typeof t != "symbol" ? t + "" : t, e), e);
import { listDrawingTools as Wn, getTool as Ml, getEditor as va, ShapeType as jn, fillDefaults as Nu, createImageAnnotatorState as ku, initKeyboardCommands as Uu, registerTool as Gu, registerEditor as Hu, createImageAnnotator as Vu, W3CImageFormat as Xu } from "@annotorious/annotorious";
import Ts from "openseadragon";
var xa = Object.prototype.hasOwnProperty;
function pr(r, t) {
  var e, i;
  if (r === t)
    return !0;
  if (r && t && (e = r.constructor) === t.constructor) {
    if (e === Date)
      return r.getTime() === t.getTime();
    if (e === RegExp)
      return r.toString() === t.toString();
    if (e === Array) {
      if ((i = r.length) === t.length)
        for (; i-- && pr(r[i], t[i]); )
          ;
      return i === -1;
    }
    if (!e || typeof r == "object") {
      i = 0;
      for (e in r)
        if (xa.call(r, e) && ++i && !xa.call(t, e) || !(e in t) || !pr(r[e], t[e]))
          return !1;
      return Object.keys(t).length === i;
    }
  }
  return r !== r && t !== t;
}
var Qo = /* @__PURE__ */ ((r) => (r.EDIT = "EDIT", r.SELECT = "SELECT", r.NONE = "NONE", r))(Qo || {});
let Ni;
const zu = new Uint8Array(16);
function Wu() {
  if (!Ni && (Ni = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !Ni))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return Ni(zu);
}
const Dt = [];
for (let r = 0; r < 256; ++r)
  Dt.push((r + 256).toString(16).slice(1));
function ju(r, t = 0) {
  return Dt[r[t + 0]] + Dt[r[t + 1]] + Dt[r[t + 2]] + Dt[r[t + 3]] + "-" + Dt[r[t + 4]] + Dt[r[t + 5]] + "-" + Dt[r[t + 6]] + Dt[r[t + 7]] + "-" + Dt[r[t + 8]] + Dt[r[t + 9]] + "-" + Dt[r[t + 10]] + Dt[r[t + 11]] + Dt[r[t + 12]] + Dt[r[t + 13]] + Dt[r[t + 14]] + Dt[r[t + 15]];
}
const $u = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), ba = {
  randomUUID: $u
};
function Yu(r, t, e) {
  if (ba.randomUUID && !t && !r)
    return ba.randomUUID();
  r = r || {};
  const i = r.random || (r.rng || Wu)();
  if (i[6] = i[6] & 15 | 64, i[8] = i[8] & 63 | 128, t) {
    e = e || 0;
    for (let s = 0; s < 16; ++s)
      t[e + s] = i[s];
    return t;
  }
  return ju(i);
}
const qu = (r, t, e, i) => ({
  id: Yu(),
  annotation: r.id,
  created: e || /* @__PURE__ */ new Date(),
  creator: i,
  ...t
}), Ku = (r, t) => {
  const e = new Set(r.bodies.map((i) => i.id));
  return t.bodies.filter((i) => !e.has(i.id));
}, Zu = (r, t) => {
  const e = new Set(t.bodies.map((i) => i.id));
  return r.bodies.filter((i) => !e.has(i.id));
}, Qu = (r, t) => t.bodies.map((e) => {
  const i = r.bodies.find((s) => s.id === e.id);
  return { newBody: e, oldBody: i && !pr(i, e) ? i : void 0 };
}).filter(({ oldBody: e }) => e), Ju = (r, t) => !pr(r.target, t.target), td = (r, t) => {
  const e = Ku(r, t), i = Zu(r, t), s = Qu(r, t);
  return {
    oldValue: r,
    newValue: t,
    bodiesCreated: e.length > 0 ? e : void 0,
    bodiesDeleted: i.length > 0 ? i : void 0,
    bodiesUpdated: s.length > 0 ? s : void 0,
    targetUpdated: Ju(r, t) ? { oldTarget: r.target, newTarget: t.target } : void 0
  };
};
var ze = /* @__PURE__ */ ((r) => (r.LOCAL = "LOCAL", r.REMOTE = "REMOTE", r))(ze || {});
const ed = (r, t) => {
  const e = new Set((r.created || []).map((u) => u.id)), i = new Set((r.updated || []).map(({ newValue: u }) => u.id)), s = new Set((t.created || []).map((u) => u.id)), n = new Set((t.deleted || []).map((u) => u.id)), o = new Set((t.updated || []).map(({ oldValue: u }) => u.id)), a = new Set((t.updated || []).filter(({ oldValue: u }) => e.has(u.id) || i.has(u.id)).map(({ oldValue: u }) => u.id)), h = [
    ...(r.created || []).filter((u) => !n.has(u.id)).map((u) => o.has(u.id) ? t.updated.find(({ oldValue: d }) => d.id === u.id).newValue : u),
    ...t.created || []
  ], l = [
    ...(r.deleted || []).filter((u) => !s.has(u.id)),
    ...(t.deleted || []).filter((u) => !e.has(u.id))
  ], c = [
    ...(r.updated || []).filter(({ newValue: u }) => !n.has(u.id)).map((u) => {
      const { oldValue: d, newValue: f } = u;
      if (o.has(f.id)) {
        const p = t.updated.find((m) => m.oldValue.id === f.id).newValue;
        return td(d, p);
      } else
        return u;
    }),
    ...(t.updated || []).filter(({ oldValue: u }) => !a.has(u.id))
  ];
  return { created: h, deleted: l, updated: c };
};
let rd = () => ({
  emit(r, ...t) {
    let e = this.events[r] || [];
    for (let i = 0, s = e.length; i < s; i++)
      e[i](...t);
  },
  events: {},
  on(r, t) {
    var e;
    return (e = this.events[r]) != null && e.push(t) || (this.events[r] = [t]), () => {
      var i;
      this.events[r] = (i = this.events[r]) == null ? void 0 : i.filter((s) => t !== s);
    };
  }
});
const id = 250, sd = (r) => {
  const t = rd(), e = [];
  let i = -1, s = !1, n = 0;
  const o = (f) => {
    if (!s) {
      const { changes: p } = f, m = performance.now();
      if (m - n > id)
        e.splice(i + 1), e.push(p), i = e.length - 1;
      else {
        const g = e.length - 1;
        e[g] = ed(e[g], p);
      }
      n = m;
    }
    s = !1;
  };
  r.observe(o, { origin: ze.LOCAL });
  const a = (f) => (f == null ? void 0 : f.length) > 0 && r.bulkDeleteAnnotation(f), h = (f) => (f == null ? void 0 : f.length) > 0 && r.bulkAddAnnotation(f, !1), l = (f) => (f == null ? void 0 : f.length) > 0 && r.bulkUpdateAnnotation(f.map(({ oldValue: p }) => p)), c = (f) => (f == null ? void 0 : f.length) > 0 && r.bulkUpdateAnnotation(f.map(({ newValue: p }) => p)), u = (f) => (f == null ? void 0 : f.length) > 0 && r.bulkAddAnnotation(f, !1), d = (f) => (f == null ? void 0 : f.length) > 0 && r.bulkDeleteAnnotation(f);
  return {
    canRedo: () => e.length - 1 > i,
    canUndo: () => i > -1,
    destroy: () => r.unobserve(o),
    on: (f, p) => t.on(f, p),
    redo: () => {
      if (e.length - 1 > i) {
        s = !0;
        const { created: f, updated: p, deleted: m } = e[i + 1];
        h(f), c(p), d(m), t.emit("redo", e[i + 1]), i += 1;
      }
    },
    undo: () => {
      if (i > -1) {
        s = !0;
        const { created: f, updated: p, deleted: m } = e[i];
        a(f), l(p), u(m), t.emit("undo", e[i]), i -= 1;
      }
    }
  };
}, nd = (r, t, e, i) => {
  const { store: s, selection: n, hover: o, viewport: a } = r, h = /* @__PURE__ */ new Map();
  let l = [], c, u;
  const d = (y, v) => {
    h.has(y) ? h.get(y).push(v) : h.set(y, [v]);
  }, f = (y, v) => {
    const _ = h.get(y);
    _ && _.indexOf(v) > 0 && _.splice(_.indexOf(v), 1);
  }, p = (y, v, _) => {
    h.has(y) && setTimeout(() => {
      h.get(y).forEach((x) => {
        if (e) {
          const T = Array.isArray(v) ? v.map((w) => e.serialize(w)) : e.serialize(v), C = _ ? _ instanceof PointerEvent ? _ : e.serialize(_) : void 0;
          x(T, C);
        } else
          x(v, _);
      });
    }, 1);
  }, m = () => {
    const { selected: y } = n, v = y.map(({ id: _ }) => s.getAnnotation(_));
    v.forEach((_) => {
      const x = l.find((T) => T.id === _.id);
      (!x || !pr(x, _)) && p("updateAnnotation", _, x);
    }), l = l.map((_) => v.find(({ id: T }) => T === _.id) || _);
  };
  n.subscribe(({ selected: y }) => {
    if (!(l.length === 0 && y.length === 0)) {
      if (l.length === 0 && y.length > 0)
        l = y.map(({ id: v }) => s.getAnnotation(v));
      else if (l.length > 0 && y.length === 0)
        l.forEach((v) => {
          const _ = s.getAnnotation(v.id);
          _ && !pr(_, v) && p("updateAnnotation", _, v);
        }), l = [];
      else {
        const v = new Set(l.map((x) => x.id)), _ = new Set(y.map(({ id: x }) => x));
        l.filter((x) => !_.has(x.id)).forEach((x) => {
          const T = s.getAnnotation(x.id);
          T && !pr(T, x) && p("updateAnnotation", T, x);
        }), l = [
          // Remove annotations that were deselected
          ...l.filter((x) => _.has(x.id)),
          // Add editable annotations that were selected
          ...y.filter(({ id: x }) => !v.has(x)).map(({ id: x }) => s.getAnnotation(x))
        ];
      }
      p("selectionChanged", l);
    }
  }), o.subscribe((y) => {
    !c && y ? p("mouseEnterAnnotation", s.getAnnotation(y)) : c && !y ? p("mouseLeaveAnnotation", s.getAnnotation(c)) : c && y && (p("mouseLeaveAnnotation", s.getAnnotation(c)), p("mouseEnterAnnotation", s.getAnnotation(y))), c = y;
  }), a == null || a.subscribe((y) => p("viewportIntersect", y.map(s.getAnnotation))), s.observe((y) => {
    i && (u && clearTimeout(u), u = setTimeout(m, 1e3));
    const { created: v, deleted: _ } = y.changes;
    v.forEach((x) => p("createAnnotation", x)), _.forEach((x) => p("deleteAnnotation", x)), y.changes.updated.filter((x) => [
      ...x.bodiesCreated || [],
      ...x.bodiesDeleted || [],
      ...x.bodiesUpdated || []
    ].length > 0).forEach(({ oldValue: x, newValue: T }) => {
      const C = l.find((w) => w.id === x.id) || x;
      l = l.map((w) => w.id === x.id ? T : w), p("updateAnnotation", T, C);
    });
  }, { origin: ze.LOCAL }), s.observe((y) => {
    if (l) {
      const v = new Set(l.map((x) => x.id)), _ = y.changes.updated.filter(({ newValue: x }) => v.has(x.id)).map(({ newValue: x }) => x);
      _.length > 0 && (l = l.map((x) => _.find((C) => C.id === x.id) || x));
    }
  }, { origin: ze.REMOTE });
  const g = (y) => (v) => {
    const { created: _, deleted: x, updated: T } = v;
    _.forEach((C) => p("createAnnotation", C)), x.forEach((C) => p("deleteAnnotation", C)), y ? T.forEach((C) => p("updateAnnotation", C.oldValue, C.newValue)) : T.forEach((C) => p("updateAnnotation", C.newValue, C.oldValue));
  };
  return t.on("undo", g(!0)), t.on("redo", g(!1)), { on: d, off: f, emit: p };
}, od = (r) => (t) => t.reduce((e, i) => {
  const { parsed: s, error: n } = r.parse(i);
  return n ? {
    parsed: e.parsed,
    failed: [...e.failed, i]
  } : {
    parsed: [...e.parsed, s],
    failed: e.failed
  };
}, { parsed: [], failed: [] }), ad = (r, t, e) => {
  const { store: i, selection: s } = r, n = (g) => {
    if (e) {
      const { parsed: y, error: v } = e.parse(g);
      y ? i.addAnnotation(y, ze.REMOTE) : console.error(v);
    } else
      i.addAnnotation(g, ze.REMOTE);
  }, o = () => s.clear(), a = () => i.clear(), h = (g) => {
    const y = i.getAnnotation(g);
    return e && y ? e.serialize(y) : y;
  }, l = () => e ? i.all().map(e.serialize) : i.all(), c = () => {
    var g;
    const y = (((g = s.selected) == null ? void 0 : g.map((v) => v.id)) || []).map((v) => i.getAnnotation(v));
    return e ? y.map(e.serialize) : y;
  }, u = (g) => fetch(g).then((y) => y.json()).then((y) => (f(y), y)), d = (g) => {
    if (typeof g == "string") {
      const y = i.getAnnotation(g);
      return i.deleteAnnotation(g), e ? e.serialize(y) : y;
    } else {
      const y = e ? e.parse(g).parsed : g;
      return i.deleteAnnotation(y), g;
    }
  }, f = (g) => {
    if (e) {
      const { parsed: y, failed: v } = od(e)(g);
      v.length > 0 && console.warn(`Discarded ${v.length} invalid annotations`, v), i.bulkAddAnnotation(y, !0, ze.REMOTE);
    } else
      i.bulkAddAnnotation(g, !0, ze.REMOTE);
  }, p = (g) => {
    g ? s.setSelected(g) : s.clear();
  }, m = (g) => {
    if (e) {
      const y = e.parse(g).parsed, v = e.serialize(i.getAnnotation(y.id));
      return i.updateAnnotation(y), v;
    } else {
      const y = i.getAnnotation(g.id);
      return i.updateAnnotation(g), y;
    }
  };
  return {
    addAnnotation: n,
    cancelSelected: o,
    canRedo: t.canRedo,
    canUndo: t.canUndo,
    clearAnnotations: a,
    getAnnotationById: h,
    getAnnotations: l,
    getSelected: c,
    loadAnnotations: u,
    redo: t.redo,
    removeAnnotation: d,
    setAnnotations: f,
    setSelected: p,
    undo: t.undo,
    updateAnnotation: m
  };
};
let hd = (r) => crypto.getRandomValues(new Uint8Array(r)), ld = (r, t, e) => {
  let i = (2 << Math.log(r.length - 1) / Math.LN2) - 1, s = -~(1.6 * i * t / r.length);
  return (n = t) => {
    let o = "";
    for (; ; ) {
      let a = e(s), h = s;
      for (; h--; )
        if (o += r[a[h] & i] || "", o.length === n)
          return o;
    }
  };
}, cd = (r, t = 21) => ld(r, t, hd), ud = (r = 21) => crypto.getRandomValues(new Uint8Array(r)).reduce((t, e) => (e &= 63, e < 36 ? t += e.toString(36) : e < 62 ? t += (e - 26).toString(36).toUpperCase() : e > 62 ? t += "-" : t += "_", t), "");
const dd = () => ({ isGuest: !0, id: cd("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_", 20)() }), fd = [
  "#ff7c00",
  // orange
  "#1ac938",
  // green
  "#e8000b",
  // red
  "#8b2be2",
  // purple
  "#9f4800",
  // brown
  "#f14cc1",
  // pink
  "#ffc400",
  // khaki
  "#00d7ff",
  // cyan
  "#023eff"
  // blue
], pd = () => {
  const r = [...fd];
  return { assignRandomColor: () => {
    const t = Math.floor(Math.random() * r.length), e = r[t];
    return r.splice(t, 1), e;
  }, releaseColor: (t) => r.push(t) };
};
ud();
function qe() {
}
function md(r, t) {
  for (const e in t)
    r[e] = t[e];
  return (
    /** @type {T & S} */
    r
  );
}
function Bl(r) {
  return r();
}
function Ta() {
  return /* @__PURE__ */ Object.create(null);
}
function Le(r) {
  r.forEach(Bl);
}
function bt(r) {
  return typeof r == "function";
}
function Ut(r, t) {
  return r != r ? t == t : r !== t || r && typeof r == "object" || typeof r == "function";
}
function gd(r) {
  return Object.keys(r).length === 0;
}
function yd(r, ...t) {
  if (r == null) {
    for (const i of t)
      i(void 0);
    return qe;
  }
  const e = r.subscribe(...t);
  return e.unsubscribe ? () => e.unsubscribe() : e;
}
function $n(r, t, e) {
  r.$$.on_destroy.push(yd(t, e));
}
function Dl(r, t, e, i) {
  if (r) {
    const s = Fl(r, t, e, i);
    return r[0](s);
  }
}
function Fl(r, t, e, i) {
  return r[1] && i ? md(e.ctx.slice(), r[1](i(t))) : e.ctx;
}
function Ol(r, t, e, i) {
  if (r[2] && i) {
    const s = r[2](i(e));
    if (t.dirty === void 0)
      return s;
    if (typeof s == "object") {
      const n = [], o = Math.max(t.dirty.length, s.length);
      for (let a = 0; a < o; a += 1)
        n[a] = t.dirty[a] | s[a];
      return n;
    }
    return t.dirty | s;
  }
  return t.dirty;
}
function Ll(r, t, e, i, s, n) {
  if (s) {
    const o = Fl(t, e, i, n);
    r.p(o, s);
  }
}
function Nl(r) {
  if (r.ctx.length > 32) {
    const t = [], e = r.ctx.length / 32;
    for (let i = 0; i < e; i++)
      t[i] = -1;
    return t;
  }
  return -1;
}
const _d = typeof window < "u" ? window : typeof globalThis < "u" ? globalThis : (
  // @ts-ignore Node typings have this
  global
);
function mr(r, t) {
  r.appendChild(t);
}
function Q(r, t, e) {
  r.insertBefore(t, e || null);
}
function Z(r) {
  r.parentNode && r.parentNode.removeChild(r);
}
function Jo(r, t) {
  for (let e = 0; e < r.length; e += 1)
    r[e] && r[e].d(t);
}
function ut(r) {
  return document.createElementNS("http://www.w3.org/2000/svg", r);
}
function ta(r) {
  return document.createTextNode(r);
}
function Nt() {
  return ta(" ");
}
function Er() {
  return ta("");
}
function wt(r, t, e, i) {
  return r.addEventListener(t, e, i), () => r.removeEventListener(t, e, i);
}
function b(r, t, e) {
  e == null ? r.removeAttribute(t) : r.getAttribute(t) !== e && r.setAttribute(t, e);
}
function vd(r) {
  return Array.from(r.childNodes);
}
function xd(r, t) {
  t = "" + t, r.data !== t && (r.data = /** @type {string} */
  t);
}
function Ea(r, t, e) {
  r.classList.toggle(t, !!e);
}
function bd(r, t, { bubbles: e = !1, cancelable: i = !1 } = {}) {
  return new CustomEvent(r, { detail: t, bubbles: e, cancelable: i });
}
let Si;
function xi(r) {
  Si = r;
}
function ea() {
  if (!Si)
    throw new Error("Function called outside component initialization");
  return Si;
}
function Xs(r) {
  ea().$$.on_mount.push(r);
}
function Td(r) {
  ea().$$.on_destroy.push(r);
}
function zs() {
  const r = ea();
  return (t, e, { cancelable: i = !1 } = {}) => {
    const s = r.$$.callbacks[t];
    if (s) {
      const n = bd(
        /** @type {string} */
        t,
        e,
        { cancelable: i }
      );
      return s.slice().forEach((o) => {
        o.call(r, n);
      }), !n.defaultPrevented;
    }
    return !0;
  };
}
function ee(r, t) {
  const e = r.$$.callbacks[t.type];
  e && e.slice().forEach((i) => i.call(this, t));
}
const Fr = [], Es = [];
let zr = [];
const wa = [], Ed = /* @__PURE__ */ Promise.resolve();
let Yn = !1;
function wd() {
  Yn || (Yn = !0, Ed.then(kl));
}
function qn(r) {
  zr.push(r);
}
const on = /* @__PURE__ */ new Set();
let Ir = 0;
function kl() {
  if (Ir !== 0)
    return;
  const r = Si;
  do {
    try {
      for (; Ir < Fr.length; ) {
        const t = Fr[Ir];
        Ir++, xi(t), Ad(t.$$);
      }
    } catch (t) {
      throw Fr.length = 0, Ir = 0, t;
    }
    for (xi(null), Fr.length = 0, Ir = 0; Es.length; )
      Es.pop()();
    for (let t = 0; t < zr.length; t += 1) {
      const e = zr[t];
      on.has(e) || (on.add(e), e());
    }
    zr.length = 0;
  } while (Fr.length);
  for (; wa.length; )
    wa.pop()();
  Yn = !1, on.clear(), xi(r);
}
function Ad(r) {
  if (r.fragment !== null) {
    r.update(), Le(r.before_update);
    const t = r.dirty;
    r.dirty = [-1], r.fragment && r.fragment.p(r.ctx, t), r.after_update.forEach(qn);
  }
}
function Sd(r) {
  const t = [], e = [];
  zr.forEach((i) => r.indexOf(i) === -1 ? t.push(i) : e.push(i)), e.forEach((i) => i()), zr = t;
}
const cs = /* @__PURE__ */ new Set();
let fr;
function Je() {
  fr = {
    r: 0,
    c: [],
    p: fr
    // parent group
  };
}
function tr() {
  fr.r || Le(fr.c), fr = fr.p;
}
function ot(r, t) {
  r && r.i && (cs.delete(r), r.i(t));
}
function ft(r, t, e, i) {
  if (r && r.o) {
    if (cs.has(r))
      return;
    cs.add(r), fr.c.push(() => {
      cs.delete(r), i && (e && r.d(1), i());
    }), r.o(t);
  } else
    i && i();
}
function Zr(r) {
  return (r == null ? void 0 : r.length) !== void 0 ? r : Array.from(r);
}
function re(r) {
  r && r.c();
}
function Kt(r, t, e) {
  const { fragment: i, after_update: s } = r.$$;
  i && i.m(t, e), qn(() => {
    const n = r.$$.on_mount.map(Bl).filter(bt);
    r.$$.on_destroy ? r.$$.on_destroy.push(...n) : Le(n), r.$$.on_mount = [];
  }), s.forEach(qn);
}
function Zt(r, t) {
  const e = r.$$;
  e.fragment !== null && (Sd(e.after_update), Le(e.on_destroy), e.fragment && e.fragment.d(t), e.on_destroy = e.fragment = null, e.ctx = []);
}
function Id(r, t) {
  r.$$.dirty[0] === -1 && (Fr.push(r), wd(), r.$$.dirty.fill(0)), r.$$.dirty[t / 31 | 0] |= 1 << t % 31;
}
function Vt(r, t, e, i, s, n, o = null, a = [-1]) {
  const h = Si;
  xi(r);
  const l = r.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: n,
    update: qe,
    not_equal: s,
    bound: Ta(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(t.context || (h ? h.$$.context : [])),
    // everything else
    callbacks: Ta(),
    dirty: a,
    skip_bound: !1,
    root: t.target || h.$$.root
  };
  o && o(l.root);
  let c = !1;
  if (l.ctx = e ? e(r, t.props || {}, (u, d, ...f) => {
    const p = f.length ? f[0] : d;
    return l.ctx && s(l.ctx[u], l.ctx[u] = p) && (!l.skip_bound && l.bound[u] && l.bound[u](p), c && Id(r, u)), d;
  }) : [], l.update(), c = !0, Le(l.before_update), l.fragment = i ? i(l.ctx) : !1, t.target) {
    if (t.hydrate) {
      const u = vd(t.target);
      l.fragment && l.fragment.l(u), u.forEach(Z);
    } else
      l.fragment && l.fragment.c();
    t.intro && ot(r.$$.fragment), Kt(r, t.target, t.anchor), kl();
  }
  xi(h);
}
class Xt {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    nn(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    nn(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    Zt(this, 1), this.$destroy = qe;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(t, e) {
    if (!bt(e))
      return qe;
    const i = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return i.push(e), () => {
      const s = i.indexOf(e);
      s !== -1 && i.splice(s, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(t) {
    this.$$set && !gd(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
}
const Cd = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Cd);
var wr = /* @__PURE__ */ ((r) => (r[r.WEBGL_LEGACY = 0] = "WEBGL_LEGACY", r[r.WEBGL = 1] = "WEBGL", r[r.WEBGL2 = 2] = "WEBGL2", r))(wr || {}), Ul = /* @__PURE__ */ ((r) => (r[r.UNKNOWN = 0] = "UNKNOWN", r[r.WEBGL = 1] = "WEBGL", r[r.CANVAS = 2] = "CANVAS", r))(Ul || {}), Kn = /* @__PURE__ */ ((r) => (r[r.COLOR = 16384] = "COLOR", r[r.DEPTH = 256] = "DEPTH", r[r.STENCIL = 1024] = "STENCIL", r))(Kn || {}), K = /* @__PURE__ */ ((r) => (r[r.NORMAL = 0] = "NORMAL", r[r.ADD = 1] = "ADD", r[r.MULTIPLY = 2] = "MULTIPLY", r[r.SCREEN = 3] = "SCREEN", r[r.OVERLAY = 4] = "OVERLAY", r[r.DARKEN = 5] = "DARKEN", r[r.LIGHTEN = 6] = "LIGHTEN", r[r.COLOR_DODGE = 7] = "COLOR_DODGE", r[r.COLOR_BURN = 8] = "COLOR_BURN", r[r.HARD_LIGHT = 9] = "HARD_LIGHT", r[r.SOFT_LIGHT = 10] = "SOFT_LIGHT", r[r.DIFFERENCE = 11] = "DIFFERENCE", r[r.EXCLUSION = 12] = "EXCLUSION", r[r.HUE = 13] = "HUE", r[r.SATURATION = 14] = "SATURATION", r[r.COLOR = 15] = "COLOR", r[r.LUMINOSITY = 16] = "LUMINOSITY", r[r.NORMAL_NPM = 17] = "NORMAL_NPM", r[r.ADD_NPM = 18] = "ADD_NPM", r[r.SCREEN_NPM = 19] = "SCREEN_NPM", r[r.NONE = 20] = "NONE", r[r.SRC_OVER = 0] = "SRC_OVER", r[r.SRC_IN = 21] = "SRC_IN", r[r.SRC_OUT = 22] = "SRC_OUT", r[r.SRC_ATOP = 23] = "SRC_ATOP", r[r.DST_OVER = 24] = "DST_OVER", r[r.DST_IN = 25] = "DST_IN", r[r.DST_OUT = 26] = "DST_OUT", r[r.DST_ATOP = 27] = "DST_ATOP", r[r.ERASE = 26] = "ERASE", r[r.SUBTRACT = 28] = "SUBTRACT", r[r.XOR = 29] = "XOR", r))(K || {}), be = /* @__PURE__ */ ((r) => (r[r.POINTS = 0] = "POINTS", r[r.LINES = 1] = "LINES", r[r.LINE_LOOP = 2] = "LINE_LOOP", r[r.LINE_STRIP = 3] = "LINE_STRIP", r[r.TRIANGLES = 4] = "TRIANGLES", r[r.TRIANGLE_STRIP = 5] = "TRIANGLE_STRIP", r[r.TRIANGLE_FAN = 6] = "TRIANGLE_FAN", r))(be || {}), F = /* @__PURE__ */ ((r) => (r[r.RGBA = 6408] = "RGBA", r[r.RGB = 6407] = "RGB", r[r.RG = 33319] = "RG", r[r.RED = 6403] = "RED", r[r.RGBA_INTEGER = 36249] = "RGBA_INTEGER", r[r.RGB_INTEGER = 36248] = "RGB_INTEGER", r[r.RG_INTEGER = 33320] = "RG_INTEGER", r[r.RED_INTEGER = 36244] = "RED_INTEGER", r[r.ALPHA = 6406] = "ALPHA", r[r.LUMINANCE = 6409] = "LUMINANCE", r[r.LUMINANCE_ALPHA = 6410] = "LUMINANCE_ALPHA", r[r.DEPTH_COMPONENT = 6402] = "DEPTH_COMPONENT", r[r.DEPTH_STENCIL = 34041] = "DEPTH_STENCIL", r))(F || {}), Wr = /* @__PURE__ */ ((r) => (r[r.TEXTURE_2D = 3553] = "TEXTURE_2D", r[r.TEXTURE_CUBE_MAP = 34067] = "TEXTURE_CUBE_MAP", r[r.TEXTURE_2D_ARRAY = 35866] = "TEXTURE_2D_ARRAY", r[r.TEXTURE_CUBE_MAP_POSITIVE_X = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X", r[r.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X", r[r.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y", r[r.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y", r[r.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z", r[r.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z", r))(Wr || {}), $ = /* @__PURE__ */ ((r) => (r[r.UNSIGNED_BYTE = 5121] = "UNSIGNED_BYTE", r[r.UNSIGNED_SHORT = 5123] = "UNSIGNED_SHORT", r[r.UNSIGNED_SHORT_5_6_5 = 33635] = "UNSIGNED_SHORT_5_6_5", r[r.UNSIGNED_SHORT_4_4_4_4 = 32819] = "UNSIGNED_SHORT_4_4_4_4", r[r.UNSIGNED_SHORT_5_5_5_1 = 32820] = "UNSIGNED_SHORT_5_5_5_1", r[r.UNSIGNED_INT = 5125] = "UNSIGNED_INT", r[r.UNSIGNED_INT_10F_11F_11F_REV = 35899] = "UNSIGNED_INT_10F_11F_11F_REV", r[r.UNSIGNED_INT_2_10_10_10_REV = 33640] = "UNSIGNED_INT_2_10_10_10_REV", r[r.UNSIGNED_INT_24_8 = 34042] = "UNSIGNED_INT_24_8", r[r.UNSIGNED_INT_5_9_9_9_REV = 35902] = "UNSIGNED_INT_5_9_9_9_REV", r[r.BYTE = 5120] = "BYTE", r[r.SHORT = 5122] = "SHORT", r[r.INT = 5124] = "INT", r[r.FLOAT = 5126] = "FLOAT", r[r.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV", r[r.HALF_FLOAT = 36193] = "HALF_FLOAT", r))($ || {}), U = /* @__PURE__ */ ((r) => (r[r.FLOAT = 0] = "FLOAT", r[r.INT = 1] = "INT", r[r.UINT = 2] = "UINT", r))(U || {}), Pe = /* @__PURE__ */ ((r) => (r[r.NEAREST = 0] = "NEAREST", r[r.LINEAR = 1] = "LINEAR", r))(Pe || {}), Ye = /* @__PURE__ */ ((r) => (r[r.CLAMP = 33071] = "CLAMP", r[r.REPEAT = 10497] = "REPEAT", r[r.MIRRORED_REPEAT = 33648] = "MIRRORED_REPEAT", r))(Ye || {}), we = /* @__PURE__ */ ((r) => (r[r.OFF = 0] = "OFF", r[r.POW2 = 1] = "POW2", r[r.ON = 2] = "ON", r[r.ON_MANUAL = 3] = "ON_MANUAL", r))(we || {}), Ht = /* @__PURE__ */ ((r) => (r[r.NPM = 0] = "NPM", r[r.UNPACK = 1] = "UNPACK", r[r.PMA = 2] = "PMA", r[r.NO_PREMULTIPLIED_ALPHA = 0] = "NO_PREMULTIPLIED_ALPHA", r[r.PREMULTIPLY_ON_UPLOAD = 1] = "PREMULTIPLY_ON_UPLOAD", r[r.PREMULTIPLIED_ALPHA = 2] = "PREMULTIPLIED_ALPHA", r))(Ht || {}), ve = /* @__PURE__ */ ((r) => (r[r.NO = 0] = "NO", r[r.YES = 1] = "YES", r[r.AUTO = 2] = "AUTO", r[r.BLEND = 0] = "BLEND", r[r.CLEAR = 1] = "CLEAR", r[r.BLIT = 2] = "BLIT", r))(ve || {}), ra = /* @__PURE__ */ ((r) => (r[r.AUTO = 0] = "AUTO", r[r.MANUAL = 1] = "MANUAL", r))(ra || {}), Jt = /* @__PURE__ */ ((r) => (r.LOW = "lowp", r.MEDIUM = "mediump", r.HIGH = "highp", r))(Jt || {}), Ct = /* @__PURE__ */ ((r) => (r[r.NONE = 0] = "NONE", r[r.SCISSOR = 1] = "SCISSOR", r[r.STENCIL = 2] = "STENCIL", r[r.SPRITE = 3] = "SPRITE", r[r.COLOR = 4] = "COLOR", r))(Ct || {}), It = /* @__PURE__ */ ((r) => (r[r.NONE = 0] = "NONE", r[r.LOW = 2] = "LOW", r[r.MEDIUM = 4] = "MEDIUM", r[r.HIGH = 8] = "HIGH", r))(It || {}), Te = /* @__PURE__ */ ((r) => (r[r.ELEMENT_ARRAY_BUFFER = 34963] = "ELEMENT_ARRAY_BUFFER", r[r.ARRAY_BUFFER = 34962] = "ARRAY_BUFFER", r[r.UNIFORM_BUFFER = 35345] = "UNIFORM_BUFFER", r))(Te || {});
const Rd = {
  /**
   * Creates a canvas element of the given size.
   * This canvas is created using the browser's native canvas element.
   * @param width - width of the canvas
   * @param height - height of the canvas
   */
  createCanvas: (r, t) => {
    const e = document.createElement("canvas");
    return e.width = r, e.height = t, e;
  },
  getCanvasRenderingContext2D: () => CanvasRenderingContext2D,
  getWebGLRenderingContext: () => WebGLRenderingContext,
  getNavigator: () => navigator,
  getBaseUrl: () => document.baseURI ?? window.location.href,
  getFontFaceSet: () => document.fonts,
  fetch: (r, t) => fetch(r, t),
  parseXML: (r) => new DOMParser().parseFromString(r, "text/xml")
}, H = {
  /**
   * This adapter is used to call methods that are platform dependent.
   * For example `document.createElement` only runs on the web but fails in node environments.
   * This allows us to support more platforms by abstracting away specific implementations per platform.
   *
   * By default the adapter is set to work in the browser. However you can create your own
   * by implementing the `IAdapter` interface. See `IAdapter` for more information.
   * @name ADAPTER
   * @memberof PIXI.settings
   * @type {PIXI.IAdapter}
   * @default PIXI.BrowserAdapter
   */
  ADAPTER: Rd,
  /**
   * Default resolution / device pixel ratio of the renderer.
   * @static
   * @name RESOLUTION
   * @memberof PIXI.settings
   * @type {number}
   * @default 1
   */
  RESOLUTION: 1,
  /**
   * Enables bitmap creation before image load. This feature is experimental.
   * @static
   * @name CREATE_IMAGE_BITMAP
   * @memberof PIXI.settings
   * @type {boolean}
   * @default false
   */
  CREATE_IMAGE_BITMAP: !1,
  /**
   * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
   * Advantages can include sharper image quality (like text) and faster rendering on canvas.
   * The main disadvantage is movement of objects may appear less smooth.
   * @static
   * @memberof PIXI.settings
   * @type {boolean}
   * @default false
   */
  ROUND_PIXELS: !1
};
var an = /iPhone/i, Aa = /iPod/i, Sa = /iPad/i, Ia = /\biOS-universal(?:.+)Mac\b/i, hn = /\bAndroid(?:.+)Mobile\b/i, Ca = /Android/i, Cr = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i, ki = /Silk/i, Se = /Windows Phone/i, Ra = /\bWindows(?:.+)ARM\b/i, Pa = /BlackBerry/i, Ma = /BB10/i, Ba = /Opera Mini/i, Da = /\b(CriOS|Chrome)(?:.+)Mobile/i, Fa = /Mobile(?:.+)Firefox\b/i, Oa = function(r) {
  return typeof r < "u" && r.platform === "MacIntel" && typeof r.maxTouchPoints == "number" && r.maxTouchPoints > 1 && typeof MSStream > "u";
};
function Pd(r) {
  return function(t) {
    return t.test(r);
  };
}
function La(r) {
  var t = {
    userAgent: "",
    platform: "",
    maxTouchPoints: 0
  };
  !r && typeof navigator < "u" ? t = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints || 0
  } : typeof r == "string" ? t.userAgent = r : r && r.userAgent && (t = {
    userAgent: r.userAgent,
    platform: r.platform,
    maxTouchPoints: r.maxTouchPoints || 0
  });
  var e = t.userAgent, i = e.split("[FBAN");
  typeof i[1] < "u" && (e = i[0]), i = e.split("Twitter"), typeof i[1] < "u" && (e = i[0]);
  var s = Pd(e), n = {
    apple: {
      phone: s(an) && !s(Se),
      ipod: s(Aa),
      tablet: !s(an) && (s(Sa) || Oa(t)) && !s(Se),
      universal: s(Ia),
      device: (s(an) || s(Aa) || s(Sa) || s(Ia) || Oa(t)) && !s(Se)
    },
    amazon: {
      phone: s(Cr),
      tablet: !s(Cr) && s(ki),
      device: s(Cr) || s(ki)
    },
    android: {
      phone: !s(Se) && s(Cr) || !s(Se) && s(hn),
      tablet: !s(Se) && !s(Cr) && !s(hn) && (s(ki) || s(Ca)),
      device: !s(Se) && (s(Cr) || s(ki) || s(hn) || s(Ca)) || s(/\bokhttp\b/i)
    },
    windows: {
      phone: s(Se),
      tablet: s(Ra),
      device: s(Se) || s(Ra)
    },
    other: {
      blackberry: s(Pa),
      blackberry10: s(Ma),
      opera: s(Ba),
      firefox: s(Fa),
      chrome: s(Da),
      device: s(Pa) || s(Ma) || s(Ba) || s(Fa) || s(Da)
    },
    any: !1,
    phone: !1,
    tablet: !1
  };
  return n.any = n.apple.device || n.android.device || n.windows.device || n.other.device, n.phone = n.apple.phone || n.android.phone || n.windows.phone, n.tablet = n.apple.tablet || n.android.tablet || n.windows.tablet, n;
}
const Md = La.default ?? La, Me = Md(globalThis.navigator);
H.RETINA_PREFIX = /@([0-9\.]+)x/;
H.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = !1;
var us = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Gl(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function Bd(r) {
  if (r.__esModule)
    return r;
  var t = r.default;
  if (typeof t == "function") {
    var e = function i() {
      return this instanceof i ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    e.prototype = t.prototype;
  } else
    e = {};
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(r).forEach(function(i) {
    var s = Object.getOwnPropertyDescriptor(r, i);
    Object.defineProperty(e, i, s.get ? s : {
      enumerable: !0,
      get: function() {
        return r[i];
      }
    });
  }), e;
}
var Hl = { exports: {} };
(function(r) {
  var t = Object.prototype.hasOwnProperty, e = "~";
  function i() {
  }
  Object.create && (i.prototype = /* @__PURE__ */ Object.create(null), new i().__proto__ || (e = !1));
  function s(h, l, c) {
    this.fn = h, this.context = l, this.once = c || !1;
  }
  function n(h, l, c, u, d) {
    if (typeof c != "function")
      throw new TypeError("The listener must be a function");
    var f = new s(c, u || h, d), p = e ? e + l : l;
    return h._events[p] ? h._events[p].fn ? h._events[p] = [h._events[p], f] : h._events[p].push(f) : (h._events[p] = f, h._eventsCount++), h;
  }
  function o(h, l) {
    --h._eventsCount === 0 ? h._events = new i() : delete h._events[l];
  }
  function a() {
    this._events = new i(), this._eventsCount = 0;
  }
  a.prototype.eventNames = function() {
    var l = [], c, u;
    if (this._eventsCount === 0)
      return l;
    for (u in c = this._events)
      t.call(c, u) && l.push(e ? u.slice(1) : u);
    return Object.getOwnPropertySymbols ? l.concat(Object.getOwnPropertySymbols(c)) : l;
  }, a.prototype.listeners = function(l) {
    var c = e ? e + l : l, u = this._events[c];
    if (!u)
      return [];
    if (u.fn)
      return [u.fn];
    for (var d = 0, f = u.length, p = new Array(f); d < f; d++)
      p[d] = u[d].fn;
    return p;
  }, a.prototype.listenerCount = function(l) {
    var c = e ? e + l : l, u = this._events[c];
    return u ? u.fn ? 1 : u.length : 0;
  }, a.prototype.emit = function(l, c, u, d, f, p) {
    var m = e ? e + l : l;
    if (!this._events[m])
      return !1;
    var g = this._events[m], y = arguments.length, v, _;
    if (g.fn) {
      switch (g.once && this.removeListener(l, g.fn, void 0, !0), y) {
        case 1:
          return g.fn.call(g.context), !0;
        case 2:
          return g.fn.call(g.context, c), !0;
        case 3:
          return g.fn.call(g.context, c, u), !0;
        case 4:
          return g.fn.call(g.context, c, u, d), !0;
        case 5:
          return g.fn.call(g.context, c, u, d, f), !0;
        case 6:
          return g.fn.call(g.context, c, u, d, f, p), !0;
      }
      for (_ = 1, v = new Array(y - 1); _ < y; _++)
        v[_ - 1] = arguments[_];
      g.fn.apply(g.context, v);
    } else {
      var x = g.length, T;
      for (_ = 0; _ < x; _++)
        switch (g[_].once && this.removeListener(l, g[_].fn, void 0, !0), y) {
          case 1:
            g[_].fn.call(g[_].context);
            break;
          case 2:
            g[_].fn.call(g[_].context, c);
            break;
          case 3:
            g[_].fn.call(g[_].context, c, u);
            break;
          case 4:
            g[_].fn.call(g[_].context, c, u, d);
            break;
          default:
            if (!v)
              for (T = 1, v = new Array(y - 1); T < y; T++)
                v[T - 1] = arguments[T];
            g[_].fn.apply(g[_].context, v);
        }
    }
    return !0;
  }, a.prototype.on = function(l, c, u) {
    return n(this, l, c, u, !1);
  }, a.prototype.once = function(l, c, u) {
    return n(this, l, c, u, !0);
  }, a.prototype.removeListener = function(l, c, u, d) {
    var f = e ? e + l : l;
    if (!this._events[f])
      return this;
    if (!c)
      return o(this, f), this;
    var p = this._events[f];
    if (p.fn)
      p.fn === c && (!d || p.once) && (!u || p.context === u) && o(this, f);
    else {
      for (var m = 0, g = [], y = p.length; m < y; m++)
        (p[m].fn !== c || d && !p[m].once || u && p[m].context !== u) && g.push(p[m]);
      g.length ? this._events[f] = g.length === 1 ? g[0] : g : o(this, f);
    }
    return this;
  }, a.prototype.removeAllListeners = function(l) {
    var c;
    return l ? (c = e ? e + l : l, this._events[c] && o(this, c)) : (this._events = new i(), this._eventsCount = 0), this;
  }, a.prototype.off = a.prototype.removeListener, a.prototype.addListener = a.prototype.on, a.prefixed = e, a.EventEmitter = a, r.exports = a;
})(Hl);
var Dd = Hl.exports;
const Bi = /* @__PURE__ */ Gl(Dd);
var ia = { exports: {} };
ia.exports = Ws;
ia.exports.default = Ws;
function Ws(r, t, e) {
  e = e || 2;
  var i = t && t.length, s = i ? t[0] * e : r.length, n = Vl(r, 0, s, e, !0), o = [];
  if (!n || n.next === n.prev)
    return o;
  var a, h, l, c, u, d, f;
  if (i && (n = kd(r, t, n, e)), r.length > 80 * e) {
    a = l = r[0], h = c = r[1];
    for (var p = e; p < s; p += e)
      u = r[p], d = r[p + 1], u < a && (a = u), d < h && (h = d), u > l && (l = u), d > c && (c = d);
    f = Math.max(l - a, c - h), f = f !== 0 ? 32767 / f : 0;
  }
  return Ii(n, o, e, a, h, f, 0), o;
}
function Vl(r, t, e, i, s) {
  var n, o;
  if (s === Jn(r, t, e, i) > 0)
    for (n = t; n < e; n += i)
      o = Na(n, r[n], r[n + 1], o);
  else
    for (n = e - i; n >= t; n -= i)
      o = Na(n, r[n], r[n + 1], o);
  return o && js(o, o.next) && (Ri(o), o = o.next), o;
}
function xr(r, t) {
  if (!r)
    return r;
  t || (t = r);
  var e = r, i;
  do
    if (i = !1, !e.steiner && (js(e, e.next) || Tt(e.prev, e, e.next) === 0)) {
      if (Ri(e), e = t = e.prev, e === e.next)
        break;
      i = !0;
    } else
      e = e.next;
  while (i || e !== t);
  return t;
}
function Ii(r, t, e, i, s, n, o) {
  if (r) {
    !o && n && Xd(r, i, s, n);
    for (var a = r, h, l; r.prev !== r.next; ) {
      if (h = r.prev, l = r.next, n ? Od(r, i, s, n) : Fd(r)) {
        t.push(h.i / e | 0), t.push(r.i / e | 0), t.push(l.i / e | 0), Ri(r), r = l.next, a = l.next;
        continue;
      }
      if (r = l, r === a) {
        o ? o === 1 ? (r = Ld(xr(r), t, e), Ii(r, t, e, i, s, n, 2)) : o === 2 && Nd(r, t, e, i, s, n) : Ii(xr(r), t, e, i, s, n, 1);
        break;
      }
    }
  }
}
function Fd(r) {
  var t = r.prev, e = r, i = r.next;
  if (Tt(t, e, i) >= 0)
    return !1;
  for (var s = t.x, n = e.x, o = i.x, a = t.y, h = e.y, l = i.y, c = s < n ? s < o ? s : o : n < o ? n : o, u = a < h ? a < l ? a : l : h < l ? h : l, d = s > n ? s > o ? s : o : n > o ? n : o, f = a > h ? a > l ? a : l : h > l ? h : l, p = i.next; p !== t; ) {
    if (p.x >= c && p.x <= d && p.y >= u && p.y <= f && Vr(s, a, n, h, o, l, p.x, p.y) && Tt(p.prev, p, p.next) >= 0)
      return !1;
    p = p.next;
  }
  return !0;
}
function Od(r, t, e, i) {
  var s = r.prev, n = r, o = r.next;
  if (Tt(s, n, o) >= 0)
    return !1;
  for (var a = s.x, h = n.x, l = o.x, c = s.y, u = n.y, d = o.y, f = a < h ? a < l ? a : l : h < l ? h : l, p = c < u ? c < d ? c : d : u < d ? u : d, m = a > h ? a > l ? a : l : h > l ? h : l, g = c > u ? c > d ? c : d : u > d ? u : d, y = Zn(f, p, t, e, i), v = Zn(m, g, t, e, i), _ = r.prevZ, x = r.nextZ; _ && _.z >= y && x && x.z <= v; ) {
    if (_.x >= f && _.x <= m && _.y >= p && _.y <= g && _ !== s && _ !== o && Vr(a, c, h, u, l, d, _.x, _.y) && Tt(_.prev, _, _.next) >= 0 || (_ = _.prevZ, x.x >= f && x.x <= m && x.y >= p && x.y <= g && x !== s && x !== o && Vr(a, c, h, u, l, d, x.x, x.y) && Tt(x.prev, x, x.next) >= 0))
      return !1;
    x = x.nextZ;
  }
  for (; _ && _.z >= y; ) {
    if (_.x >= f && _.x <= m && _.y >= p && _.y <= g && _ !== s && _ !== o && Vr(a, c, h, u, l, d, _.x, _.y) && Tt(_.prev, _, _.next) >= 0)
      return !1;
    _ = _.prevZ;
  }
  for (; x && x.z <= v; ) {
    if (x.x >= f && x.x <= m && x.y >= p && x.y <= g && x !== s && x !== o && Vr(a, c, h, u, l, d, x.x, x.y) && Tt(x.prev, x, x.next) >= 0)
      return !1;
    x = x.nextZ;
  }
  return !0;
}
function Ld(r, t, e) {
  var i = r;
  do {
    var s = i.prev, n = i.next.next;
    !js(s, n) && Xl(s, i, i.next, n) && Ci(s, n) && Ci(n, s) && (t.push(s.i / e | 0), t.push(i.i / e | 0), t.push(n.i / e | 0), Ri(i), Ri(i.next), i = r = n), i = i.next;
  } while (i !== r);
  return xr(i);
}
function Nd(r, t, e, i, s, n) {
  var o = r;
  do {
    for (var a = o.next.next; a !== o.prev; ) {
      if (o.i !== a.i && jd(o, a)) {
        var h = zl(o, a);
        o = xr(o, o.next), h = xr(h, h.next), Ii(o, t, e, i, s, n, 0), Ii(h, t, e, i, s, n, 0);
        return;
      }
      a = a.next;
    }
    o = o.next;
  } while (o !== r);
}
function kd(r, t, e, i) {
  var s = [], n, o, a, h, l;
  for (n = 0, o = t.length; n < o; n++)
    a = t[n] * i, h = n < o - 1 ? t[n + 1] * i : r.length, l = Vl(r, a, h, i, !1), l === l.next && (l.steiner = !0), s.push(Wd(l));
  for (s.sort(Ud), n = 0; n < s.length; n++)
    e = Gd(s[n], e);
  return e;
}
function Ud(r, t) {
  return r.x - t.x;
}
function Gd(r, t) {
  var e = Hd(r, t);
  if (!e)
    return t;
  var i = zl(e, r);
  return xr(i, i.next), xr(e, e.next);
}
function Hd(r, t) {
  var e = t, i = r.x, s = r.y, n = -1 / 0, o;
  do {
    if (s <= e.y && s >= e.next.y && e.next.y !== e.y) {
      var a = e.x + (s - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
      if (a <= i && a > n && (n = a, o = e.x < e.next.x ? e : e.next, a === i))
        return o;
    }
    e = e.next;
  } while (e !== t);
  if (!o)
    return null;
  var h = o, l = o.x, c = o.y, u = 1 / 0, d;
  e = o;
  do
    i >= e.x && e.x >= l && i !== e.x && Vr(s < c ? i : n, s, l, c, s < c ? n : i, s, e.x, e.y) && (d = Math.abs(s - e.y) / (i - e.x), Ci(e, r) && (d < u || d === u && (e.x > o.x || e.x === o.x && Vd(o, e))) && (o = e, u = d)), e = e.next;
  while (e !== h);
  return o;
}
function Vd(r, t) {
  return Tt(r.prev, r, t.prev) < 0 && Tt(t.next, r, r.next) < 0;
}
function Xd(r, t, e, i) {
  var s = r;
  do
    s.z === 0 && (s.z = Zn(s.x, s.y, t, e, i)), s.prevZ = s.prev, s.nextZ = s.next, s = s.next;
  while (s !== r);
  s.prevZ.nextZ = null, s.prevZ = null, zd(s);
}
function zd(r) {
  var t, e, i, s, n, o, a, h, l = 1;
  do {
    for (e = r, r = null, n = null, o = 0; e; ) {
      for (o++, i = e, a = 0, t = 0; t < l && (a++, i = i.nextZ, !!i); t++)
        ;
      for (h = l; a > 0 || h > 0 && i; )
        a !== 0 && (h === 0 || !i || e.z <= i.z) ? (s = e, e = e.nextZ, a--) : (s = i, i = i.nextZ, h--), n ? n.nextZ = s : r = s, s.prevZ = n, n = s;
      e = i;
    }
    n.nextZ = null, l *= 2;
  } while (o > 1);
  return r;
}
function Zn(r, t, e, i, s) {
  return r = (r - e) * s | 0, t = (t - i) * s | 0, r = (r | r << 8) & 16711935, r = (r | r << 4) & 252645135, r = (r | r << 2) & 858993459, r = (r | r << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, r | t << 1;
}
function Wd(r) {
  var t = r, e = r;
  do
    (t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next;
  while (t !== r);
  return e;
}
function Vr(r, t, e, i, s, n, o, a) {
  return (s - o) * (t - a) >= (r - o) * (n - a) && (r - o) * (i - a) >= (e - o) * (t - a) && (e - o) * (n - a) >= (s - o) * (i - a);
}
function jd(r, t) {
  return r.next.i !== t.i && r.prev.i !== t.i && !$d(r, t) && // dones't intersect other edges
  (Ci(r, t) && Ci(t, r) && Yd(r, t) && // locally visible
  (Tt(r.prev, r, t.prev) || Tt(r, t.prev, t)) || // does not create opposite-facing sectors
  js(r, t) && Tt(r.prev, r, r.next) > 0 && Tt(t.prev, t, t.next) > 0);
}
function Tt(r, t, e) {
  return (t.y - r.y) * (e.x - t.x) - (t.x - r.x) * (e.y - t.y);
}
function js(r, t) {
  return r.x === t.x && r.y === t.y;
}
function Xl(r, t, e, i) {
  var s = Gi(Tt(r, t, e)), n = Gi(Tt(r, t, i)), o = Gi(Tt(e, i, r)), a = Gi(Tt(e, i, t));
  return !!(s !== n && o !== a || s === 0 && Ui(r, e, t) || n === 0 && Ui(r, i, t) || o === 0 && Ui(e, r, i) || a === 0 && Ui(e, t, i));
}
function Ui(r, t, e) {
  return t.x <= Math.max(r.x, e.x) && t.x >= Math.min(r.x, e.x) && t.y <= Math.max(r.y, e.y) && t.y >= Math.min(r.y, e.y);
}
function Gi(r) {
  return r > 0 ? 1 : r < 0 ? -1 : 0;
}
function $d(r, t) {
  var e = r;
  do {
    if (e.i !== r.i && e.next.i !== r.i && e.i !== t.i && e.next.i !== t.i && Xl(e, e.next, r, t))
      return !0;
    e = e.next;
  } while (e !== r);
  return !1;
}
function Ci(r, t) {
  return Tt(r.prev, r, r.next) < 0 ? Tt(r, t, r.next) >= 0 && Tt(r, r.prev, t) >= 0 : Tt(r, t, r.prev) < 0 || Tt(r, r.next, t) < 0;
}
function Yd(r, t) {
  var e = r, i = !1, s = (r.x + t.x) / 2, n = (r.y + t.y) / 2;
  do
    e.y > n != e.next.y > n && e.next.y !== e.y && s < (e.next.x - e.x) * (n - e.y) / (e.next.y - e.y) + e.x && (i = !i), e = e.next;
  while (e !== r);
  return i;
}
function zl(r, t) {
  var e = new Qn(r.i, r.x, r.y), i = new Qn(t.i, t.x, t.y), s = r.next, n = t.prev;
  return r.next = t, t.prev = r, e.next = s, s.prev = e, i.next = e, e.prev = i, n.next = i, i.prev = n, i;
}
function Na(r, t, e, i) {
  var s = new Qn(r, t, e);
  return i ? (s.next = i.next, s.prev = i, i.next.prev = s, i.next = s) : (s.prev = s, s.next = s), s;
}
function Ri(r) {
  r.next.prev = r.prev, r.prev.next = r.next, r.prevZ && (r.prevZ.nextZ = r.nextZ), r.nextZ && (r.nextZ.prevZ = r.prevZ);
}
function Qn(r, t, e) {
  this.i = r, this.x = t, this.y = e, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = !1;
}
Ws.deviation = function(r, t, e, i) {
  var s = t && t.length, n = s ? t[0] * e : r.length, o = Math.abs(Jn(r, 0, n, e));
  if (s)
    for (var a = 0, h = t.length; a < h; a++) {
      var l = t[a] * e, c = a < h - 1 ? t[a + 1] * e : r.length;
      o -= Math.abs(Jn(r, l, c, e));
    }
  var u = 0;
  for (a = 0; a < i.length; a += 3) {
    var d = i[a] * e, f = i[a + 1] * e, p = i[a + 2] * e;
    u += Math.abs(
      (r[d] - r[p]) * (r[f + 1] - r[d + 1]) - (r[d] - r[f]) * (r[p + 1] - r[d + 1])
    );
  }
  return o === 0 && u === 0 ? 0 : Math.abs((u - o) / o);
};
function Jn(r, t, e, i) {
  for (var s = 0, n = t, o = e - i; n < e; n += i)
    s += (r[o] - r[n]) * (r[n + 1] + r[o + 1]), o = n;
  return s;
}
Ws.flatten = function(r) {
  for (var t = r[0][0].length, e = { vertices: [], holes: [], dimensions: t }, i = 0, s = 0; s < r.length; s++) {
    for (var n = 0; n < r[s].length; n++)
      for (var o = 0; o < t; o++)
        e.vertices.push(r[s][n][o]);
    s > 0 && (i += r[s - 1].length, e.holes.push(i));
  }
  return e;
};
var qd = ia.exports;
const Kd = /* @__PURE__ */ Gl(qd);
var ws = { exports: {} };
/*! https://mths.be/punycode v1.4.1 by @mathias */
ws.exports;
(function(r, t) {
  (function(e) {
    var i = t && !t.nodeType && t, s = r && !r.nodeType && r, n = typeof us == "object" && us;
    (n.global === n || n.window === n || n.self === n) && (e = n);
    var o, a = 2147483647, h = 36, l = 1, c = 26, u = 38, d = 700, f = 72, p = 128, m = "-", g = /^xn--/, y = /[^\x20-\x7E]/, v = /[\x2E\u3002\uFF0E\uFF61]/g, _ = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    }, x = h - l, T = Math.floor, C = String.fromCharCode, w;
    function I(B) {
      throw new RangeError(_[B]);
    }
    function S(B, L) {
      for (var Y = B.length, nt = []; Y--; )
        nt[Y] = L(B[Y]);
      return nt;
    }
    function P(B, L) {
      var Y = B.split("@"), nt = "";
      Y.length > 1 && (nt = Y[0] + "@", B = Y[1]), B = B.replace(v, ".");
      var at = B.split("."), mt = S(at, L).join(".");
      return nt + mt;
    }
    function O(B) {
      for (var L = [], Y = 0, nt = B.length, at, mt; Y < nt; )
        at = B.charCodeAt(Y++), at >= 55296 && at <= 56319 && Y < nt ? (mt = B.charCodeAt(Y++), (mt & 64512) == 56320 ? L.push(((at & 1023) << 10) + (mt & 1023) + 65536) : (L.push(at), Y--)) : L.push(at);
      return L;
    }
    function M(B) {
      return S(B, function(L) {
        var Y = "";
        return L > 65535 && (L -= 65536, Y += C(L >>> 10 & 1023 | 55296), L = 56320 | L & 1023), Y += C(L), Y;
      }).join("");
    }
    function E(B) {
      return B - 48 < 10 ? B - 22 : B - 65 < 26 ? B - 65 : B - 97 < 26 ? B - 97 : h;
    }
    function A(B, L) {
      return B + 22 + 75 * (B < 26) - ((L != 0) << 5);
    }
    function R(B, L, Y) {
      var nt = 0;
      for (B = Y ? T(B / d) : B >> 1, B += T(B / L); B > x * c >> 1; nt += h)
        B = T(B / x);
      return T(nt + (x + 1) * B / (B + u));
    }
    function X(B) {
      var L = [], Y = B.length, nt, at = 0, mt = p, rt = f, gt, _t, St, et, ct, dt, vt, zt, ht;
      for (gt = B.lastIndexOf(m), gt < 0 && (gt = 0), _t = 0; _t < gt; ++_t)
        B.charCodeAt(_t) >= 128 && I("not-basic"), L.push(B.charCodeAt(_t));
      for (St = gt > 0 ? gt + 1 : 0; St < Y; ) {
        for (et = at, ct = 1, dt = h; St >= Y && I("invalid-input"), vt = E(B.charCodeAt(St++)), (vt >= h || vt > T((a - at) / ct)) && I("overflow"), at += vt * ct, zt = dt <= rt ? l : dt >= rt + c ? c : dt - rt, !(vt < zt); dt += h)
          ht = h - zt, ct > T(a / ht) && I("overflow"), ct *= ht;
        nt = L.length + 1, rt = R(at - et, nt, et == 0), T(at / nt) > a - mt && I("overflow"), mt += T(at / nt), at %= nt, L.splice(at++, 0, mt);
      }
      return M(L);
    }
    function D(B) {
      var L, Y, nt, at, mt, rt, gt, _t, St, et, ct, dt = [], vt, zt, ht, V;
      for (B = O(B), vt = B.length, L = p, Y = 0, mt = f, rt = 0; rt < vt; ++rt)
        ct = B[rt], ct < 128 && dt.push(C(ct));
      for (nt = at = dt.length, at && dt.push(m); nt < vt; ) {
        for (gt = a, rt = 0; rt < vt; ++rt)
          ct = B[rt], ct >= L && ct < gt && (gt = ct);
        for (zt = nt + 1, gt - L > T((a - Y) / zt) && I("overflow"), Y += (gt - L) * zt, L = gt, rt = 0; rt < vt; ++rt)
          if (ct = B[rt], ct < L && ++Y > a && I("overflow"), ct == L) {
            for (_t = Y, St = h; et = St <= mt ? l : St >= mt + c ? c : St - mt, !(_t < et); St += h)
              V = _t - et, ht = h - et, dt.push(
                C(A(et + V % ht, 0))
              ), _t = T(V / ht);
            dt.push(C(A(_t, 0))), mt = R(Y, zt, nt == at), Y = 0, ++nt;
          }
        ++Y, ++L;
      }
      return dt.join("");
    }
    function N(B) {
      return P(B, function(L) {
        return g.test(L) ? X(L.slice(4).toLowerCase()) : L;
      });
    }
    function q(B) {
      return P(B, function(L) {
        return y.test(L) ? "xn--" + D(L) : L;
      });
    }
    if (o = {
      /**
       * A string representing the current Punycode.js version number.
       * @memberOf punycode
       * @type String
       */
      version: "1.4.1",
      /**
       * An object of methods to convert from JavaScript's internal character
       * representation (UCS-2) to Unicode code points, and back.
       * @see <https://mathiasbynens.be/notes/javascript-encoding>
       * @memberOf punycode
       * @type Object
       */
      ucs2: {
        decode: O,
        encode: M
      },
      decode: X,
      encode: D,
      toASCII: q,
      toUnicode: N
    }, i && s)
      if (r.exports == i)
        s.exports = o;
      else
        for (w in o)
          o.hasOwnProperty(w) && (i[w] = o[w]);
    else
      e.punycode = o;
  })(us);
})(ws, ws.exports);
var Zd = ws.exports, Qd = function() {
  if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
    return !1;
  if (typeof Symbol.iterator == "symbol")
    return !0;
  var t = {}, e = Symbol("test"), i = Object(e);
  if (typeof e == "string" || Object.prototype.toString.call(e) !== "[object Symbol]" || Object.prototype.toString.call(i) !== "[object Symbol]")
    return !1;
  var s = 42;
  t[e] = s;
  for (e in t)
    return !1;
  if (typeof Object.keys == "function" && Object.keys(t).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(t).length !== 0)
    return !1;
  var n = Object.getOwnPropertySymbols(t);
  if (n.length !== 1 || n[0] !== e || !Object.prototype.propertyIsEnumerable.call(t, e))
    return !1;
  if (typeof Object.getOwnPropertyDescriptor == "function") {
    var o = Object.getOwnPropertyDescriptor(t, e);
    if (o.value !== s || o.enumerable !== !0)
      return !1;
  }
  return !0;
}, ka = typeof Symbol < "u" && Symbol, Jd = Qd, tf = function() {
  return typeof ka != "function" || typeof Symbol != "function" || typeof ka("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : Jd();
}, Ua = {
  foo: {}
}, ef = Object, rf = function() {
  return { __proto__: Ua }.foo === Ua.foo && !({ __proto__: null } instanceof ef);
}, sf = "Function.prototype.bind called on incompatible ", nf = Object.prototype.toString, of = Math.max, af = "[object Function]", Ga = function(t, e) {
  for (var i = [], s = 0; s < t.length; s += 1)
    i[s] = t[s];
  for (var n = 0; n < e.length; n += 1)
    i[n + t.length] = e[n];
  return i;
}, hf = function(t, e) {
  for (var i = [], s = e || 0, n = 0; s < t.length; s += 1, n += 1)
    i[n] = t[s];
  return i;
}, lf = function(r, t) {
  for (var e = "", i = 0; i < r.length; i += 1)
    e += r[i], i + 1 < r.length && (e += t);
  return e;
}, cf = function(t) {
  var e = this;
  if (typeof e != "function" || nf.apply(e) !== af)
    throw new TypeError(sf + e);
  for (var i = hf(arguments, 1), s, n = function() {
    if (this instanceof s) {
      var c = e.apply(
        this,
        Ga(i, arguments)
      );
      return Object(c) === c ? c : this;
    }
    return e.apply(
      t,
      Ga(i, arguments)
    );
  }, o = of(0, e.length - i.length), a = [], h = 0; h < o; h++)
    a[h] = "$" + h;
  if (s = Function("binder", "return function (" + lf(a, ",") + "){ return binder.apply(this,arguments); }")(n), e.prototype) {
    var l = function() {
    };
    l.prototype = e.prototype, s.prototype = new l(), l.prototype = null;
  }
  return s;
}, uf = cf, sa = Function.prototype.bind || uf, df = Function.prototype.call, ff = Object.prototype.hasOwnProperty, pf = sa, mf = pf.call(df, ff), st, Qr = SyntaxError, Wl = Function, jr = TypeError, ln = function(r) {
  try {
    return Wl('"use strict"; return (' + r + ").constructor;")();
  } catch {
  }
}, gr = Object.getOwnPropertyDescriptor;
if (gr)
  try {
    gr({}, "");
  } catch {
    gr = null;
  }
var cn = function() {
  throw new jr();
}, gf = gr ? function() {
  try {
    return arguments.callee, cn;
  } catch {
    try {
      return gr(arguments, "callee").get;
    } catch {
      return cn;
    }
  }
}() : cn, Rr = tf(), yf = rf(), Mt = Object.getPrototypeOf || (yf ? function(r) {
  return r.__proto__;
} : null), Or = {}, _f = typeof Uint8Array > "u" || !Mt ? st : Mt(Uint8Array), yr = {
  "%AggregateError%": typeof AggregateError > "u" ? st : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer > "u" ? st : ArrayBuffer,
  "%ArrayIteratorPrototype%": Rr && Mt ? Mt([][Symbol.iterator]()) : st,
  "%AsyncFromSyncIteratorPrototype%": st,
  "%AsyncFunction%": Or,
  "%AsyncGenerator%": Or,
  "%AsyncGeneratorFunction%": Or,
  "%AsyncIteratorPrototype%": Or,
  "%Atomics%": typeof Atomics > "u" ? st : Atomics,
  "%BigInt%": typeof BigInt > "u" ? st : BigInt,
  "%BigInt64Array%": typeof BigInt64Array > "u" ? st : BigInt64Array,
  "%BigUint64Array%": typeof BigUint64Array > "u" ? st : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView > "u" ? st : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": Error,
  "%eval%": eval,
  // eslint-disable-line no-eval
  "%EvalError%": EvalError,
  "%Float32Array%": typeof Float32Array > "u" ? st : Float32Array,
  "%Float64Array%": typeof Float64Array > "u" ? st : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? st : FinalizationRegistry,
  "%Function%": Wl,
  "%GeneratorFunction%": Or,
  "%Int8Array%": typeof Int8Array > "u" ? st : Int8Array,
  "%Int16Array%": typeof Int16Array > "u" ? st : Int16Array,
  "%Int32Array%": typeof Int32Array > "u" ? st : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": Rr && Mt ? Mt(Mt([][Symbol.iterator]())) : st,
  "%JSON%": typeof JSON == "object" ? JSON : st,
  "%Map%": typeof Map > "u" ? st : Map,
  "%MapIteratorPrototype%": typeof Map > "u" || !Rr || !Mt ? st : Mt((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": Object,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise > "u" ? st : Promise,
  "%Proxy%": typeof Proxy > "u" ? st : Proxy,
  "%RangeError%": RangeError,
  "%ReferenceError%": ReferenceError,
  "%Reflect%": typeof Reflect > "u" ? st : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set > "u" ? st : Set,
  "%SetIteratorPrototype%": typeof Set > "u" || !Rr || !Mt ? st : Mt((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? st : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": Rr && Mt ? Mt(""[Symbol.iterator]()) : st,
  "%Symbol%": Rr ? Symbol : st,
  "%SyntaxError%": Qr,
  "%ThrowTypeError%": gf,
  "%TypedArray%": _f,
  "%TypeError%": jr,
  "%Uint8Array%": typeof Uint8Array > "u" ? st : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? st : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array > "u" ? st : Uint16Array,
  "%Uint32Array%": typeof Uint32Array > "u" ? st : Uint32Array,
  "%URIError%": URIError,
  "%WeakMap%": typeof WeakMap > "u" ? st : WeakMap,
  "%WeakRef%": typeof WeakRef > "u" ? st : WeakRef,
  "%WeakSet%": typeof WeakSet > "u" ? st : WeakSet
};
if (Mt)
  try {
    null.error;
  } catch (r) {
    var vf = Mt(Mt(r));
    yr["%Error.prototype%"] = vf;
  }
var xf = function r(t) {
  var e;
  if (t === "%AsyncFunction%")
    e = ln("async function () {}");
  else if (t === "%GeneratorFunction%")
    e = ln("function* () {}");
  else if (t === "%AsyncGeneratorFunction%")
    e = ln("async function* () {}");
  else if (t === "%AsyncGenerator%") {
    var i = r("%AsyncGeneratorFunction%");
    i && (e = i.prototype);
  } else if (t === "%AsyncIteratorPrototype%") {
    var s = r("%AsyncGenerator%");
    s && Mt && (e = Mt(s.prototype));
  }
  return yr[t] = e, e;
}, Ha = {
  "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
  "%ArrayPrototype%": ["Array", "prototype"],
  "%ArrayProto_entries%": ["Array", "prototype", "entries"],
  "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
  "%ArrayProto_keys%": ["Array", "prototype", "keys"],
  "%ArrayProto_values%": ["Array", "prototype", "values"],
  "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
  "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
  "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
  "%BooleanPrototype%": ["Boolean", "prototype"],
  "%DataViewPrototype%": ["DataView", "prototype"],
  "%DatePrototype%": ["Date", "prototype"],
  "%ErrorPrototype%": ["Error", "prototype"],
  "%EvalErrorPrototype%": ["EvalError", "prototype"],
  "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
  "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
  "%FunctionPrototype%": ["Function", "prototype"],
  "%Generator%": ["GeneratorFunction", "prototype"],
  "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
  "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
  "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
  "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
  "%JSONParse%": ["JSON", "parse"],
  "%JSONStringify%": ["JSON", "stringify"],
  "%MapPrototype%": ["Map", "prototype"],
  "%NumberPrototype%": ["Number", "prototype"],
  "%ObjectPrototype%": ["Object", "prototype"],
  "%ObjProto_toString%": ["Object", "prototype", "toString"],
  "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
  "%PromisePrototype%": ["Promise", "prototype"],
  "%PromiseProto_then%": ["Promise", "prototype", "then"],
  "%Promise_all%": ["Promise", "all"],
  "%Promise_reject%": ["Promise", "reject"],
  "%Promise_resolve%": ["Promise", "resolve"],
  "%RangeErrorPrototype%": ["RangeError", "prototype"],
  "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
  "%RegExpPrototype%": ["RegExp", "prototype"],
  "%SetPrototype%": ["Set", "prototype"],
  "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
  "%StringPrototype%": ["String", "prototype"],
  "%SymbolPrototype%": ["Symbol", "prototype"],
  "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
  "%TypedArrayPrototype%": ["TypedArray", "prototype"],
  "%TypeErrorPrototype%": ["TypeError", "prototype"],
  "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
  "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
  "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
  "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
  "%URIErrorPrototype%": ["URIError", "prototype"],
  "%WeakMapPrototype%": ["WeakMap", "prototype"],
  "%WeakSetPrototype%": ["WeakSet", "prototype"]
}, Di = sa, As = mf, bf = Di.call(Function.call, Array.prototype.concat), Tf = Di.call(Function.apply, Array.prototype.splice), Va = Di.call(Function.call, String.prototype.replace), Ss = Di.call(Function.call, String.prototype.slice), Ef = Di.call(Function.call, RegExp.prototype.exec), wf = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, Af = /\\(\\)?/g, Sf = function(t) {
  var e = Ss(t, 0, 1), i = Ss(t, -1);
  if (e === "%" && i !== "%")
    throw new Qr("invalid intrinsic syntax, expected closing `%`");
  if (i === "%" && e !== "%")
    throw new Qr("invalid intrinsic syntax, expected opening `%`");
  var s = [];
  return Va(t, wf, function(n, o, a, h) {
    s[s.length] = a ? Va(h, Af, "$1") : o || n;
  }), s;
}, If = function(t, e) {
  var i = t, s;
  if (As(Ha, i) && (s = Ha[i], i = "%" + s[0] + "%"), As(yr, i)) {
    var n = yr[i];
    if (n === Or && (n = xf(i)), typeof n > "u" && !e)
      throw new jr("intrinsic " + t + " exists, but is not available. Please file an issue!");
    return {
      alias: s,
      name: i,
      value: n
    };
  }
  throw new Qr("intrinsic " + t + " does not exist!");
}, Ar = function(t, e) {
  if (typeof t != "string" || t.length === 0)
    throw new jr("intrinsic name must be a non-empty string");
  if (arguments.length > 1 && typeof e != "boolean")
    throw new jr('"allowMissing" argument must be a boolean');
  if (Ef(/^%?[^%]*%?$/, t) === null)
    throw new Qr("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  var i = Sf(t), s = i.length > 0 ? i[0] : "", n = If("%" + s + "%", e), o = n.name, a = n.value, h = !1, l = n.alias;
  l && (s = l[0], Tf(i, bf([0, 1], l)));
  for (var c = 1, u = !0; c < i.length; c += 1) {
    var d = i[c], f = Ss(d, 0, 1), p = Ss(d, -1);
    if ((f === '"' || f === "'" || f === "`" || p === '"' || p === "'" || p === "`") && f !== p)
      throw new Qr("property names with quotes must have matching quotes");
    if ((d === "constructor" || !u) && (h = !0), s += "." + d, o = "%" + s + "%", As(yr, o))
      a = yr[o];
    else if (a != null) {
      if (!(d in a)) {
        if (!e)
          throw new jr("base intrinsic for " + t + " exists, but the property is not available.");
        return;
      }
      if (gr && c + 1 >= i.length) {
        var m = gr(a, d);
        u = !!m, u && "get" in m && !("originalValue" in m.get) ? a = m.get : a = a[d];
      } else
        u = As(a, d), a = a[d];
      u && !h && (yr[o] = a);
    }
  }
  return a;
}, jl = { exports: {} }, Cf = Ar, to = Cf("%Object.defineProperty%", !0), eo = function() {
  if (to)
    try {
      return to({}, "a", { value: 1 }), !0;
    } catch {
      return !1;
    }
  return !1;
};
eo.hasArrayLengthDefineBug = function() {
  if (!eo())
    return null;
  try {
    return to([], "length", { value: 1 }).length !== 1;
  } catch {
    return !0;
  }
};
var $l = eo, Rf = Ar, ds = Rf("%Object.getOwnPropertyDescriptor%", !0);
if (ds)
  try {
    ds([], "length");
  } catch {
    ds = null;
  }
var Yl = ds, Pf = $l(), na = Ar, bi = Pf && na("%Object.defineProperty%", !0);
if (bi)
  try {
    bi({}, "a", { value: 1 });
  } catch {
    bi = !1;
  }
var Mf = na("%SyntaxError%"), Pr = na("%TypeError%"), Xa = Yl, Bf = function(t, e, i) {
  if (!t || typeof t != "object" && typeof t != "function")
    throw new Pr("`obj` must be an object or a function`");
  if (typeof e != "string" && typeof e != "symbol")
    throw new Pr("`property` must be a string or a symbol`");
  if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null)
    throw new Pr("`nonEnumerable`, if provided, must be a boolean or null");
  if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null)
    throw new Pr("`nonWritable`, if provided, must be a boolean or null");
  if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null)
    throw new Pr("`nonConfigurable`, if provided, must be a boolean or null");
  if (arguments.length > 6 && typeof arguments[6] != "boolean")
    throw new Pr("`loose`, if provided, must be a boolean");
  var s = arguments.length > 3 ? arguments[3] : null, n = arguments.length > 4 ? arguments[4] : null, o = arguments.length > 5 ? arguments[5] : null, a = arguments.length > 6 ? arguments[6] : !1, h = !!Xa && Xa(t, e);
  if (bi)
    bi(t, e, {
      configurable: o === null && h ? h.configurable : !o,
      enumerable: s === null && h ? h.enumerable : !s,
      value: i,
      writable: n === null && h ? h.writable : !n
    });
  else if (a || !s && !n && !o)
    t[e] = i;
  else
    throw new Mf("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
}, ql = Ar, za = Bf, Df = $l(), Wa = Yl, ja = ql("%TypeError%"), Ff = ql("%Math.floor%"), Of = function(t, e) {
  if (typeof t != "function")
    throw new ja("`fn` is not a function");
  if (typeof e != "number" || e < 0 || e > 4294967295 || Ff(e) !== e)
    throw new ja("`length` must be a positive 32-bit integer");
  var i = arguments.length > 2 && !!arguments[2], s = !0, n = !0;
  if ("length" in t && Wa) {
    var o = Wa(t, "length");
    o && !o.configurable && (s = !1), o && !o.writable && (n = !1);
  }
  return (s || n || !i) && (Df ? za(t, "length", e, !0, !0) : za(t, "length", e)), t;
};
(function(r) {
  var t = sa, e = Ar, i = Of, s = e("%TypeError%"), n = e("%Function.prototype.apply%"), o = e("%Function.prototype.call%"), a = e("%Reflect.apply%", !0) || t.call(o, n), h = e("%Object.defineProperty%", !0), l = e("%Math.max%");
  if (h)
    try {
      h({}, "a", { value: 1 });
    } catch {
      h = null;
    }
  r.exports = function(d) {
    if (typeof d != "function")
      throw new s("a function is required");
    var f = a(t, o, arguments);
    return i(
      f,
      1 + l(0, d.length - (arguments.length - 1)),
      !0
    );
  };
  var c = function() {
    return a(t, n, arguments);
  };
  h ? h(r.exports, "apply", { value: c }) : r.exports.apply = c;
})(jl);
var Lf = jl.exports, Kl = Ar, Zl = Lf, Nf = Zl(Kl("String.prototype.indexOf")), kf = function(t, e) {
  var i = Kl(t, !!e);
  return typeof i == "function" && Nf(t, ".prototype.") > -1 ? Zl(i) : i;
};
const Uf = {}, Gf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Uf
}, Symbol.toStringTag, { value: "Module" })), Hf = /* @__PURE__ */ Bd(Gf);
var oa = typeof Map == "function" && Map.prototype, un = Object.getOwnPropertyDescriptor && oa ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null, Is = oa && un && typeof un.get == "function" ? un.get : null, $a = oa && Map.prototype.forEach, aa = typeof Set == "function" && Set.prototype, dn = Object.getOwnPropertyDescriptor && aa ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null, Cs = aa && dn && typeof dn.get == "function" ? dn.get : null, Ya = aa && Set.prototype.forEach, Vf = typeof WeakMap == "function" && WeakMap.prototype, Ti = Vf ? WeakMap.prototype.has : null, Xf = typeof WeakSet == "function" && WeakSet.prototype, Ei = Xf ? WeakSet.prototype.has : null, zf = typeof WeakRef == "function" && WeakRef.prototype, qa = zf ? WeakRef.prototype.deref : null, Wf = Boolean.prototype.valueOf, jf = Object.prototype.toString, $f = Function.prototype.toString, Yf = String.prototype.match, ha = String.prototype.slice, We = String.prototype.replace, qf = String.prototype.toUpperCase, Ka = String.prototype.toLowerCase, Ql = RegExp.prototype.test, Za = Array.prototype.concat, xe = Array.prototype.join, Kf = Array.prototype.slice, Qa = Math.floor, ro = typeof BigInt == "function" ? BigInt.prototype.valueOf : null, fn = Object.getOwnPropertySymbols, io = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Symbol.prototype.toString : null, Jr = typeof Symbol == "function" && typeof Symbol.iterator == "object", kt = typeof Symbol == "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === Jr || !0) ? Symbol.toStringTag : null, Jl = Object.prototype.propertyIsEnumerable, Ja = (typeof Reflect == "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(r) {
  return r.__proto__;
} : null);
function th(r, t) {
  if (r === 1 / 0 || r === -1 / 0 || r !== r || r && r > -1e3 && r < 1e3 || Ql.call(/e/, t))
    return t;
  var e = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof r == "number") {
    var i = r < 0 ? -Qa(-r) : Qa(r);
    if (i !== r) {
      var s = String(i), n = ha.call(t, s.length + 1);
      return We.call(s, e, "$&_") + "." + We.call(We.call(n, /([0-9]{3})/g, "$&_"), /_$/, "");
    }
  }
  return We.call(t, e, "$&_");
}
var so = Hf, eh = so.custom, rh = ec(eh) ? eh : null, Zf = function r(t, e, i, s) {
  var n = e || {};
  if (Ge(n, "quoteStyle") && n.quoteStyle !== "single" && n.quoteStyle !== "double")
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  if (Ge(n, "maxStringLength") && (typeof n.maxStringLength == "number" ? n.maxStringLength < 0 && n.maxStringLength !== 1 / 0 : n.maxStringLength !== null))
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  var o = Ge(n, "customInspect") ? n.customInspect : !0;
  if (typeof o != "boolean" && o !== "symbol")
    throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
  if (Ge(n, "indent") && n.indent !== null && n.indent !== "	" && !(parseInt(n.indent, 10) === n.indent && n.indent > 0))
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  if (Ge(n, "numericSeparator") && typeof n.numericSeparator != "boolean")
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  var a = n.numericSeparator;
  if (typeof t > "u")
    return "undefined";
  if (t === null)
    return "null";
  if (typeof t == "boolean")
    return t ? "true" : "false";
  if (typeof t == "string")
    return ic(t, n);
  if (typeof t == "number") {
    if (t === 0)
      return 1 / 0 / t > 0 ? "0" : "-0";
    var h = String(t);
    return a ? th(t, h) : h;
  }
  if (typeof t == "bigint") {
    var l = String(t) + "n";
    return a ? th(t, l) : l;
  }
  var c = typeof n.depth > "u" ? 5 : n.depth;
  if (typeof i > "u" && (i = 0), i >= c && c > 0 && typeof t == "object")
    return no(t) ? "[Array]" : "[Object]";
  var u = mp(n, i);
  if (typeof s > "u")
    s = [];
  else if (rc(s, t) >= 0)
    return "[Circular]";
  function d(E, A, R) {
    if (A && (s = Kf.call(s), s.push(A)), R) {
      var X = {
        depth: n.depth
      };
      return Ge(n, "quoteStyle") && (X.quoteStyle = n.quoteStyle), r(E, X, i + 1, s);
    }
    return r(E, n, i + 1, s);
  }
  if (typeof t == "function" && !ih(t)) {
    var f = op(t), p = Hi(t, d);
    return "[Function" + (f ? ": " + f : " (anonymous)") + "]" + (p.length > 0 ? " { " + xe.call(p, ", ") + " }" : "");
  }
  if (ec(t)) {
    var m = Jr ? We.call(String(t), /^(Symbol\(.*\))_[^)]*$/, "$1") : io.call(t);
    return typeof t == "object" && !Jr ? ni(m) : m;
  }
  if (dp(t)) {
    for (var g = "<" + Ka.call(String(t.nodeName)), y = t.attributes || [], v = 0; v < y.length; v++)
      g += " " + y[v].name + "=" + tc(Qf(y[v].value), "double", n);
    return g += ">", t.childNodes && t.childNodes.length && (g += "..."), g += "</" + Ka.call(String(t.nodeName)) + ">", g;
  }
  if (no(t)) {
    if (t.length === 0)
      return "[]";
    var _ = Hi(t, d);
    return u && !pp(_) ? "[" + oo(_, u) + "]" : "[ " + xe.call(_, ", ") + " ]";
  }
  if (tp(t)) {
    var x = Hi(t, d);
    return !("cause" in Error.prototype) && "cause" in t && !Jl.call(t, "cause") ? "{ [" + String(t) + "] " + xe.call(Za.call("[cause]: " + d(t.cause), x), ", ") + " }" : x.length === 0 ? "[" + String(t) + "]" : "{ [" + String(t) + "] " + xe.call(x, ", ") + " }";
  }
  if (typeof t == "object" && o) {
    if (rh && typeof t[rh] == "function" && so)
      return so(t, { depth: c - i });
    if (o !== "symbol" && typeof t.inspect == "function")
      return t.inspect();
  }
  if (ap(t)) {
    var T = [];
    return $a && $a.call(t, function(E, A) {
      T.push(d(A, t, !0) + " => " + d(E, t));
    }), sh("Map", Is.call(t), T, u);
  }
  if (cp(t)) {
    var C = [];
    return Ya && Ya.call(t, function(E) {
      C.push(d(E, t));
    }), sh("Set", Cs.call(t), C, u);
  }
  if (hp(t))
    return pn("WeakMap");
  if (up(t))
    return pn("WeakSet");
  if (lp(t))
    return pn("WeakRef");
  if (rp(t))
    return ni(d(Number(t)));
  if (sp(t))
    return ni(d(ro.call(t)));
  if (ip(t))
    return ni(Wf.call(t));
  if (ep(t))
    return ni(d(String(t)));
  if (typeof window < "u" && t === window)
    return "{ [object Window] }";
  if (t === us)
    return "{ [object globalThis] }";
  if (!Jf(t) && !ih(t)) {
    var w = Hi(t, d), I = Ja ? Ja(t) === Object.prototype : t instanceof Object || t.constructor === Object, S = t instanceof Object ? "" : "null prototype", P = !I && kt && Object(t) === t && kt in t ? ha.call(er(t), 8, -1) : S ? "Object" : "", O = I || typeof t.constructor != "function" ? "" : t.constructor.name ? t.constructor.name + " " : "", M = O + (P || S ? "[" + xe.call(Za.call([], P || [], S || []), ": ") + "] " : "");
    return w.length === 0 ? M + "{}" : u ? M + "{" + oo(w, u) + "}" : M + "{ " + xe.call(w, ", ") + " }";
  }
  return String(t);
};
function tc(r, t, e) {
  var i = (e.quoteStyle || t) === "double" ? '"' : "'";
  return i + r + i;
}
function Qf(r) {
  return We.call(String(r), /"/g, "&quot;");
}
function no(r) {
  return er(r) === "[object Array]" && (!kt || !(typeof r == "object" && kt in r));
}
function Jf(r) {
  return er(r) === "[object Date]" && (!kt || !(typeof r == "object" && kt in r));
}
function ih(r) {
  return er(r) === "[object RegExp]" && (!kt || !(typeof r == "object" && kt in r));
}
function tp(r) {
  return er(r) === "[object Error]" && (!kt || !(typeof r == "object" && kt in r));
}
function ep(r) {
  return er(r) === "[object String]" && (!kt || !(typeof r == "object" && kt in r));
}
function rp(r) {
  return er(r) === "[object Number]" && (!kt || !(typeof r == "object" && kt in r));
}
function ip(r) {
  return er(r) === "[object Boolean]" && (!kt || !(typeof r == "object" && kt in r));
}
function ec(r) {
  if (Jr)
    return r && typeof r == "object" && r instanceof Symbol;
  if (typeof r == "symbol")
    return !0;
  if (!r || typeof r != "object" || !io)
    return !1;
  try {
    return io.call(r), !0;
  } catch {
  }
  return !1;
}
function sp(r) {
  if (!r || typeof r != "object" || !ro)
    return !1;
  try {
    return ro.call(r), !0;
  } catch {
  }
  return !1;
}
var np = Object.prototype.hasOwnProperty || function(r) {
  return r in this;
};
function Ge(r, t) {
  return np.call(r, t);
}
function er(r) {
  return jf.call(r);
}
function op(r) {
  if (r.name)
    return r.name;
  var t = Yf.call($f.call(r), /^function\s*([\w$]+)/);
  return t ? t[1] : null;
}
function rc(r, t) {
  if (r.indexOf)
    return r.indexOf(t);
  for (var e = 0, i = r.length; e < i; e++)
    if (r[e] === t)
      return e;
  return -1;
}
function ap(r) {
  if (!Is || !r || typeof r != "object")
    return !1;
  try {
    Is.call(r);
    try {
      Cs.call(r);
    } catch {
      return !0;
    }
    return r instanceof Map;
  } catch {
  }
  return !1;
}
function hp(r) {
  if (!Ti || !r || typeof r != "object")
    return !1;
  try {
    Ti.call(r, Ti);
    try {
      Ei.call(r, Ei);
    } catch {
      return !0;
    }
    return r instanceof WeakMap;
  } catch {
  }
  return !1;
}
function lp(r) {
  if (!qa || !r || typeof r != "object")
    return !1;
  try {
    return qa.call(r), !0;
  } catch {
  }
  return !1;
}
function cp(r) {
  if (!Cs || !r || typeof r != "object")
    return !1;
  try {
    Cs.call(r);
    try {
      Is.call(r);
    } catch {
      return !0;
    }
    return r instanceof Set;
  } catch {
  }
  return !1;
}
function up(r) {
  if (!Ei || !r || typeof r != "object")
    return !1;
  try {
    Ei.call(r, Ei);
    try {
      Ti.call(r, Ti);
    } catch {
      return !0;
    }
    return r instanceof WeakSet;
  } catch {
  }
  return !1;
}
function dp(r) {
  return !r || typeof r != "object" ? !1 : typeof HTMLElement < "u" && r instanceof HTMLElement ? !0 : typeof r.nodeName == "string" && typeof r.getAttribute == "function";
}
function ic(r, t) {
  if (r.length > t.maxStringLength) {
    var e = r.length - t.maxStringLength, i = "... " + e + " more character" + (e > 1 ? "s" : "");
    return ic(ha.call(r, 0, t.maxStringLength), t) + i;
  }
  var s = We.call(We.call(r, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, fp);
  return tc(s, "single", t);
}
function fp(r) {
  var t = r.charCodeAt(0), e = {
    8: "b",
    9: "t",
    10: "n",
    12: "f",
    13: "r"
  }[t];
  return e ? "\\" + e : "\\x" + (t < 16 ? "0" : "") + qf.call(t.toString(16));
}
function ni(r) {
  return "Object(" + r + ")";
}
function pn(r) {
  return r + " { ? }";
}
function sh(r, t, e, i) {
  var s = i ? oo(e, i) : xe.call(e, ", ");
  return r + " (" + t + ") {" + s + "}";
}
function pp(r) {
  for (var t = 0; t < r.length; t++)
    if (rc(r[t], `
`) >= 0)
      return !1;
  return !0;
}
function mp(r, t) {
  var e;
  if (r.indent === "	")
    e = "	";
  else if (typeof r.indent == "number" && r.indent > 0)
    e = xe.call(Array(r.indent + 1), " ");
  else
    return null;
  return {
    base: e,
    prev: xe.call(Array(t + 1), e)
  };
}
function oo(r, t) {
  if (r.length === 0)
    return "";
  var e = `
` + t.prev + t.base;
  return e + xe.call(r, "," + e) + `
` + t.prev;
}
function Hi(r, t) {
  var e = no(r), i = [];
  if (e) {
    i.length = r.length;
    for (var s = 0; s < r.length; s++)
      i[s] = Ge(r, s) ? t(r[s], r) : "";
  }
  var n = typeof fn == "function" ? fn(r) : [], o;
  if (Jr) {
    o = {};
    for (var a = 0; a < n.length; a++)
      o["$" + n[a]] = n[a];
  }
  for (var h in r)
    Ge(r, h) && (e && String(Number(h)) === h && h < r.length || Jr && o["$" + h] instanceof Symbol || (Ql.call(/[^\w$]/, h) ? i.push(t(h, r) + ": " + t(r[h], r)) : i.push(h + ": " + t(r[h], r))));
  if (typeof fn == "function")
    for (var l = 0; l < n.length; l++)
      Jl.call(r, n[l]) && i.push("[" + t(n[l]) + "]: " + t(r[n[l]], r));
  return i;
}
var la = Ar, ri = kf, gp = Zf, yp = la("%TypeError%"), Vi = la("%WeakMap%", !0), Xi = la("%Map%", !0), _p = ri("WeakMap.prototype.get", !0), vp = ri("WeakMap.prototype.set", !0), xp = ri("WeakMap.prototype.has", !0), bp = ri("Map.prototype.get", !0), Tp = ri("Map.prototype.set", !0), Ep = ri("Map.prototype.has", !0), ca = function(r, t) {
  for (var e = r, i; (i = e.next) !== null; e = i)
    if (i.key === t)
      return e.next = i.next, i.next = r.next, r.next = i, i;
}, wp = function(r, t) {
  var e = ca(r, t);
  return e && e.value;
}, Ap = function(r, t, e) {
  var i = ca(r, t);
  i ? i.value = e : r.next = {
    // eslint-disable-line no-param-reassign
    key: t,
    next: r.next,
    value: e
  };
}, Sp = function(r, t) {
  return !!ca(r, t);
}, Ip = function() {
  var t, e, i, s = {
    assert: function(n) {
      if (!s.has(n))
        throw new yp("Side channel does not contain " + gp(n));
    },
    get: function(n) {
      if (Vi && n && (typeof n == "object" || typeof n == "function")) {
        if (t)
          return _p(t, n);
      } else if (Xi) {
        if (e)
          return bp(e, n);
      } else if (i)
        return wp(i, n);
    },
    has: function(n) {
      if (Vi && n && (typeof n == "object" || typeof n == "function")) {
        if (t)
          return xp(t, n);
      } else if (Xi) {
        if (e)
          return Ep(e, n);
      } else if (i)
        return Sp(i, n);
      return !1;
    },
    set: function(n, o) {
      Vi && n && (typeof n == "object" || typeof n == "function") ? (t || (t = new Vi()), vp(t, n, o)) : Xi ? (e || (e = new Xi()), Tp(e, n, o)) : (i || (i = { key: {}, next: null }), Ap(i, n, o));
    }
  };
  return s;
}, Cp = String.prototype.replace, Rp = /%20/g, mn = {
  RFC1738: "RFC1738",
  RFC3986: "RFC3986"
}, ua = {
  default: mn.RFC3986,
  formatters: {
    RFC1738: function(r) {
      return Cp.call(r, Rp, "+");
    },
    RFC3986: function(r) {
      return String(r);
    }
  },
  RFC1738: mn.RFC1738,
  RFC3986: mn.RFC3986
}, Pp = ua, gn = Object.prototype.hasOwnProperty, ur = Array.isArray, pe = function() {
  for (var r = [], t = 0; t < 256; ++t)
    r.push("%" + ((t < 16 ? "0" : "") + t.toString(16)).toUpperCase());
  return r;
}(), Mp = function(t) {
  for (; t.length > 1; ) {
    var e = t.pop(), i = e.obj[e.prop];
    if (ur(i)) {
      for (var s = [], n = 0; n < i.length; ++n)
        typeof i[n] < "u" && s.push(i[n]);
      e.obj[e.prop] = s;
    }
  }
}, sc = function(t, e) {
  for (var i = e && e.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, s = 0; s < t.length; ++s)
    typeof t[s] < "u" && (i[s] = t[s]);
  return i;
}, Bp = function r(t, e, i) {
  if (!e)
    return t;
  if (typeof e != "object") {
    if (ur(t))
      t.push(e);
    else if (t && typeof t == "object")
      (i && (i.plainObjects || i.allowPrototypes) || !gn.call(Object.prototype, e)) && (t[e] = !0);
    else
      return [t, e];
    return t;
  }
  if (!t || typeof t != "object")
    return [t].concat(e);
  var s = t;
  return ur(t) && !ur(e) && (s = sc(t, i)), ur(t) && ur(e) ? (e.forEach(function(n, o) {
    if (gn.call(t, o)) {
      var a = t[o];
      a && typeof a == "object" && n && typeof n == "object" ? t[o] = r(a, n, i) : t.push(n);
    } else
      t[o] = n;
  }), t) : Object.keys(e).reduce(function(n, o) {
    var a = e[o];
    return gn.call(n, o) ? n[o] = r(n[o], a, i) : n[o] = a, n;
  }, s);
}, Dp = function(t, e) {
  return Object.keys(e).reduce(function(i, s) {
    return i[s] = e[s], i;
  }, t);
}, Fp = function(r, t, e) {
  var i = r.replace(/\+/g, " ");
  if (e === "iso-8859-1")
    return i.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(i);
  } catch {
    return i;
  }
}, Op = function(t, e, i, s, n) {
  if (t.length === 0)
    return t;
  var o = t;
  if (typeof t == "symbol" ? o = Symbol.prototype.toString.call(t) : typeof t != "string" && (o = String(t)), i === "iso-8859-1")
    return escape(o).replace(/%u[0-9a-f]{4}/gi, function(c) {
      return "%26%23" + parseInt(c.slice(2), 16) + "%3B";
    });
  for (var a = "", h = 0; h < o.length; ++h) {
    var l = o.charCodeAt(h);
    if (l === 45 || l === 46 || l === 95 || l === 126 || l >= 48 && l <= 57 || l >= 65 && l <= 90 || l >= 97 && l <= 122 || n === Pp.RFC1738 && (l === 40 || l === 41)) {
      a += o.charAt(h);
      continue;
    }
    if (l < 128) {
      a = a + pe[l];
      continue;
    }
    if (l < 2048) {
      a = a + (pe[192 | l >> 6] + pe[128 | l & 63]);
      continue;
    }
    if (l < 55296 || l >= 57344) {
      a = a + (pe[224 | l >> 12] + pe[128 | l >> 6 & 63] + pe[128 | l & 63]);
      continue;
    }
    h += 1, l = 65536 + ((l & 1023) << 10 | o.charCodeAt(h) & 1023), a += pe[240 | l >> 18] + pe[128 | l >> 12 & 63] + pe[128 | l >> 6 & 63] + pe[128 | l & 63];
  }
  return a;
}, Lp = function(t) {
  for (var e = [{ obj: { o: t }, prop: "o" }], i = [], s = 0; s < e.length; ++s)
    for (var n = e[s], o = n.obj[n.prop], a = Object.keys(o), h = 0; h < a.length; ++h) {
      var l = a[h], c = o[l];
      typeof c == "object" && c !== null && i.indexOf(c) === -1 && (e.push({ obj: o, prop: l }), i.push(c));
    }
  return Mp(e), t;
}, Np = function(t) {
  return Object.prototype.toString.call(t) === "[object RegExp]";
}, kp = function(t) {
  return !t || typeof t != "object" ? !1 : !!(t.constructor && t.constructor.isBuffer && t.constructor.isBuffer(t));
}, Up = function(t, e) {
  return [].concat(t, e);
}, Gp = function(t, e) {
  if (ur(t)) {
    for (var i = [], s = 0; s < t.length; s += 1)
      i.push(e(t[s]));
    return i;
  }
  return e(t);
}, nc = {
  arrayToObject: sc,
  assign: Dp,
  combine: Up,
  compact: Lp,
  decode: Fp,
  encode: Op,
  isBuffer: kp,
  isRegExp: Np,
  maybeMap: Gp,
  merge: Bp
}, oc = Ip, fs = nc, wi = ua, Hp = Object.prototype.hasOwnProperty, nh = {
  brackets: function(t) {
    return t + "[]";
  },
  comma: "comma",
  indices: function(t, e) {
    return t + "[" + e + "]";
  },
  repeat: function(t) {
    return t;
  }
}, Re = Array.isArray, Vp = Array.prototype.push, ac = function(r, t) {
  Vp.apply(r, Re(t) ? t : [t]);
}, Xp = Date.prototype.toISOString, oh = wi.default, Lt = {
  addQueryPrefix: !1,
  allowDots: !1,
  charset: "utf-8",
  charsetSentinel: !1,
  delimiter: "&",
  encode: !0,
  encoder: fs.encode,
  encodeValuesOnly: !1,
  format: oh,
  formatter: wi.formatters[oh],
  // deprecated
  indices: !1,
  serializeDate: function(t) {
    return Xp.call(t);
  },
  skipNulls: !1,
  strictNullHandling: !1
}, zp = function(t) {
  return typeof t == "string" || typeof t == "number" || typeof t == "boolean" || typeof t == "symbol" || typeof t == "bigint";
}, yn = {}, Wp = function r(t, e, i, s, n, o, a, h, l, c, u, d, f, p, m, g) {
  for (var y = t, v = g, _ = 0, x = !1; (v = v.get(yn)) !== void 0 && !x; ) {
    var T = v.get(t);
    if (_ += 1, typeof T < "u") {
      if (T === _)
        throw new RangeError("Cyclic object value");
      x = !0;
    }
    typeof v.get(yn) > "u" && (_ = 0);
  }
  if (typeof h == "function" ? y = h(e, y) : y instanceof Date ? y = u(y) : i === "comma" && Re(y) && (y = fs.maybeMap(y, function(X) {
    return X instanceof Date ? u(X) : X;
  })), y === null) {
    if (n)
      return a && !p ? a(e, Lt.encoder, m, "key", d) : e;
    y = "";
  }
  if (zp(y) || fs.isBuffer(y)) {
    if (a) {
      var C = p ? e : a(e, Lt.encoder, m, "key", d);
      return [f(C) + "=" + f(a(y, Lt.encoder, m, "value", d))];
    }
    return [f(e) + "=" + f(String(y))];
  }
  var w = [];
  if (typeof y > "u")
    return w;
  var I;
  if (i === "comma" && Re(y))
    p && a && (y = fs.maybeMap(y, a)), I = [{ value: y.length > 0 ? y.join(",") || null : void 0 }];
  else if (Re(h))
    I = h;
  else {
    var S = Object.keys(y);
    I = l ? S.sort(l) : S;
  }
  for (var P = s && Re(y) && y.length === 1 ? e + "[]" : e, O = 0; O < I.length; ++O) {
    var M = I[O], E = typeof M == "object" && typeof M.value < "u" ? M.value : y[M];
    if (!(o && E === null)) {
      var A = Re(y) ? typeof i == "function" ? i(P, M) : P : P + (c ? "." + M : "[" + M + "]");
      g.set(t, _);
      var R = oc();
      R.set(yn, g), ac(w, r(
        E,
        A,
        i,
        s,
        n,
        o,
        i === "comma" && p && Re(y) ? null : a,
        h,
        l,
        c,
        u,
        d,
        f,
        p,
        m,
        R
      ));
    }
  }
  return w;
}, jp = function(t) {
  if (!t)
    return Lt;
  if (t.encoder !== null && typeof t.encoder < "u" && typeof t.encoder != "function")
    throw new TypeError("Encoder has to be a function.");
  var e = t.charset || Lt.charset;
  if (typeof t.charset < "u" && t.charset !== "utf-8" && t.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var i = wi.default;
  if (typeof t.format < "u") {
    if (!Hp.call(wi.formatters, t.format))
      throw new TypeError("Unknown format option provided.");
    i = t.format;
  }
  var s = wi.formatters[i], n = Lt.filter;
  return (typeof t.filter == "function" || Re(t.filter)) && (n = t.filter), {
    addQueryPrefix: typeof t.addQueryPrefix == "boolean" ? t.addQueryPrefix : Lt.addQueryPrefix,
    allowDots: typeof t.allowDots > "u" ? Lt.allowDots : !!t.allowDots,
    charset: e,
    charsetSentinel: typeof t.charsetSentinel == "boolean" ? t.charsetSentinel : Lt.charsetSentinel,
    delimiter: typeof t.delimiter > "u" ? Lt.delimiter : t.delimiter,
    encode: typeof t.encode == "boolean" ? t.encode : Lt.encode,
    encoder: typeof t.encoder == "function" ? t.encoder : Lt.encoder,
    encodeValuesOnly: typeof t.encodeValuesOnly == "boolean" ? t.encodeValuesOnly : Lt.encodeValuesOnly,
    filter: n,
    format: i,
    formatter: s,
    serializeDate: typeof t.serializeDate == "function" ? t.serializeDate : Lt.serializeDate,
    skipNulls: typeof t.skipNulls == "boolean" ? t.skipNulls : Lt.skipNulls,
    sort: typeof t.sort == "function" ? t.sort : null,
    strictNullHandling: typeof t.strictNullHandling == "boolean" ? t.strictNullHandling : Lt.strictNullHandling
  };
}, $p = function(r, t) {
  var e = r, i = jp(t), s, n;
  typeof i.filter == "function" ? (n = i.filter, e = n("", e)) : Re(i.filter) && (n = i.filter, s = n);
  var o = [];
  if (typeof e != "object" || e === null)
    return "";
  var a;
  t && t.arrayFormat in nh ? a = t.arrayFormat : t && "indices" in t ? a = t.indices ? "indices" : "repeat" : a = "indices";
  var h = nh[a];
  if (t && "commaRoundTrip" in t && typeof t.commaRoundTrip != "boolean")
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  var l = h === "comma" && t && t.commaRoundTrip;
  s || (s = Object.keys(e)), i.sort && s.sort(i.sort);
  for (var c = oc(), u = 0; u < s.length; ++u) {
    var d = s[u];
    i.skipNulls && e[d] === null || ac(o, Wp(
      e[d],
      d,
      h,
      l,
      i.strictNullHandling,
      i.skipNulls,
      i.encode ? i.encoder : null,
      i.filter,
      i.sort,
      i.allowDots,
      i.serializeDate,
      i.format,
      i.formatter,
      i.encodeValuesOnly,
      i.charset,
      c
    ));
  }
  var f = o.join(i.delimiter), p = i.addQueryPrefix === !0 ? "?" : "";
  return i.charsetSentinel && (i.charset === "iso-8859-1" ? p += "utf8=%26%2310003%3B&" : p += "utf8=%E2%9C%93&"), f.length > 0 ? p + f : "";
}, ti = nc, ao = Object.prototype.hasOwnProperty, Yp = Array.isArray, Pt = {
  allowDots: !1,
  allowPrototypes: !1,
  allowSparse: !1,
  arrayLimit: 20,
  charset: "utf-8",
  charsetSentinel: !1,
  comma: !1,
  decoder: ti.decode,
  delimiter: "&",
  depth: 5,
  ignoreQueryPrefix: !1,
  interpretNumericEntities: !1,
  parameterLimit: 1e3,
  parseArrays: !0,
  plainObjects: !1,
  strictNullHandling: !1
}, qp = function(r) {
  return r.replace(/&#(\d+);/g, function(t, e) {
    return String.fromCharCode(parseInt(e, 10));
  });
}, hc = function(r, t) {
  return r && typeof r == "string" && t.comma && r.indexOf(",") > -1 ? r.split(",") : r;
}, Kp = "utf8=%26%2310003%3B", Zp = "utf8=%E2%9C%93", Qp = function(t, e) {
  var i = { __proto__: null }, s = e.ignoreQueryPrefix ? t.replace(/^\?/, "") : t, n = e.parameterLimit === 1 / 0 ? void 0 : e.parameterLimit, o = s.split(e.delimiter, n), a = -1, h, l = e.charset;
  if (e.charsetSentinel)
    for (h = 0; h < o.length; ++h)
      o[h].indexOf("utf8=") === 0 && (o[h] === Zp ? l = "utf-8" : o[h] === Kp && (l = "iso-8859-1"), a = h, h = o.length);
  for (h = 0; h < o.length; ++h)
    if (h !== a) {
      var c = o[h], u = c.indexOf("]="), d = u === -1 ? c.indexOf("=") : u + 1, f, p;
      d === -1 ? (f = e.decoder(c, Pt.decoder, l, "key"), p = e.strictNullHandling ? null : "") : (f = e.decoder(c.slice(0, d), Pt.decoder, l, "key"), p = ti.maybeMap(
        hc(c.slice(d + 1), e),
        function(m) {
          return e.decoder(m, Pt.decoder, l, "value");
        }
      )), p && e.interpretNumericEntities && l === "iso-8859-1" && (p = qp(p)), c.indexOf("[]=") > -1 && (p = Yp(p) ? [p] : p), ao.call(i, f) ? i[f] = ti.combine(i[f], p) : i[f] = p;
    }
  return i;
}, Jp = function(r, t, e, i) {
  for (var s = i ? t : hc(t, e), n = r.length - 1; n >= 0; --n) {
    var o, a = r[n];
    if (a === "[]" && e.parseArrays)
      o = [].concat(s);
    else {
      o = e.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
      var h = a.charAt(0) === "[" && a.charAt(a.length - 1) === "]" ? a.slice(1, -1) : a, l = parseInt(h, 10);
      !e.parseArrays && h === "" ? o = { 0: s } : !isNaN(l) && a !== h && String(l) === h && l >= 0 && e.parseArrays && l <= e.arrayLimit ? (o = [], o[l] = s) : h !== "__proto__" && (o[h] = s);
    }
    s = o;
  }
  return s;
}, tm = function(t, e, i, s) {
  if (t) {
    var n = i.allowDots ? t.replace(/\.([^.[]+)/g, "[$1]") : t, o = /(\[[^[\]]*])/, a = /(\[[^[\]]*])/g, h = i.depth > 0 && o.exec(n), l = h ? n.slice(0, h.index) : n, c = [];
    if (l) {
      if (!i.plainObjects && ao.call(Object.prototype, l) && !i.allowPrototypes)
        return;
      c.push(l);
    }
    for (var u = 0; i.depth > 0 && (h = a.exec(n)) !== null && u < i.depth; ) {
      if (u += 1, !i.plainObjects && ao.call(Object.prototype, h[1].slice(1, -1)) && !i.allowPrototypes)
        return;
      c.push(h[1]);
    }
    return h && c.push("[" + n.slice(h.index) + "]"), Jp(c, e, i, s);
  }
}, em = function(t) {
  if (!t)
    return Pt;
  if (t.decoder !== null && t.decoder !== void 0 && typeof t.decoder != "function")
    throw new TypeError("Decoder has to be a function.");
  if (typeof t.charset < "u" && t.charset !== "utf-8" && t.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var e = typeof t.charset > "u" ? Pt.charset : t.charset;
  return {
    allowDots: typeof t.allowDots > "u" ? Pt.allowDots : !!t.allowDots,
    allowPrototypes: typeof t.allowPrototypes == "boolean" ? t.allowPrototypes : Pt.allowPrototypes,
    allowSparse: typeof t.allowSparse == "boolean" ? t.allowSparse : Pt.allowSparse,
    arrayLimit: typeof t.arrayLimit == "number" ? t.arrayLimit : Pt.arrayLimit,
    charset: e,
    charsetSentinel: typeof t.charsetSentinel == "boolean" ? t.charsetSentinel : Pt.charsetSentinel,
    comma: typeof t.comma == "boolean" ? t.comma : Pt.comma,
    decoder: typeof t.decoder == "function" ? t.decoder : Pt.decoder,
    delimiter: typeof t.delimiter == "string" || ti.isRegExp(t.delimiter) ? t.delimiter : Pt.delimiter,
    // eslint-disable-next-line no-implicit-coercion, no-extra-parens
    depth: typeof t.depth == "number" || t.depth === !1 ? +t.depth : Pt.depth,
    ignoreQueryPrefix: t.ignoreQueryPrefix === !0,
    interpretNumericEntities: typeof t.interpretNumericEntities == "boolean" ? t.interpretNumericEntities : Pt.interpretNumericEntities,
    parameterLimit: typeof t.parameterLimit == "number" ? t.parameterLimit : Pt.parameterLimit,
    parseArrays: t.parseArrays !== !1,
    plainObjects: typeof t.plainObjects == "boolean" ? t.plainObjects : Pt.plainObjects,
    strictNullHandling: typeof t.strictNullHandling == "boolean" ? t.strictNullHandling : Pt.strictNullHandling
  };
}, rm = function(r, t) {
  var e = em(t);
  if (r === "" || r === null || typeof r > "u")
    return e.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (var i = typeof r == "string" ? Qp(r, e) : r, s = e.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, n = Object.keys(i), o = 0; o < n.length; ++o) {
    var a = n[o], h = tm(a, i[a], e, typeof r == "string");
    s = ti.merge(s, h, e);
  }
  return e.allowSparse === !0 ? s : ti.compact(s);
}, im = $p, sm = rm, nm = ua, om = {
  formats: nm,
  parse: sm,
  stringify: im
}, am = Zd;
function Fe() {
  this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null;
}
var hm = /^([a-z0-9.+-]+:)/i, lm = /:[0-9]*$/, cm = /^(\/\/?(?!\/)[^?\s]*)(\?[^\s]*)?$/, um = [
  "<",
  ">",
  '"',
  "`",
  " ",
  "\r",
  `
`,
  "	"
], dm = [
  "{",
  "}",
  "|",
  "\\",
  "^",
  "`"
].concat(um), ho = ["'"].concat(dm), ah = [
  "%",
  "/",
  "?",
  ";",
  "#"
].concat(ho), hh = [
  "/",
  "?",
  "#"
], fm = 255, lh = /^[+a-z0-9A-Z_-]{0,63}$/, pm = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, mm = {
  javascript: !0,
  "javascript:": !0
}, lo = {
  javascript: !0,
  "javascript:": !0
}, $r = {
  http: !0,
  https: !0,
  ftp: !0,
  gopher: !0,
  file: !0,
  "http:": !0,
  "https:": !0,
  "ftp:": !0,
  "gopher:": !0,
  "file:": !0
}, co = om;
function gm(r, t, e) {
  if (r && typeof r == "object" && r instanceof Fe)
    return r;
  var i = new Fe();
  return i.parse(r, t, e), i;
}
Fe.prototype.parse = function(r, t, e) {
  if (typeof r != "string")
    throw new TypeError("Parameter 'url' must be a string, not " + typeof r);
  var i = r.indexOf("?"), s = i !== -1 && i < r.indexOf("#") ? "?" : "#", n = r.split(s), o = /\\/g;
  n[0] = n[0].replace(o, "/"), r = n.join(s);
  var a = r;
  if (a = a.trim(), !e && r.split("#").length === 1) {
    var h = cm.exec(a);
    if (h)
      return this.path = a, this.href = a, this.pathname = h[1], h[2] ? (this.search = h[2], t ? this.query = co.parse(this.search.substr(1)) : this.query = this.search.substr(1)) : t && (this.search = "", this.query = {}), this;
  }
  var l = hm.exec(a);
  if (l) {
    l = l[0];
    var c = l.toLowerCase();
    this.protocol = c, a = a.substr(l.length);
  }
  if (e || l || a.match(/^\/\/[^@/]+@[^@/]+/)) {
    var u = a.substr(0, 2) === "//";
    u && !(l && lo[l]) && (a = a.substr(2), this.slashes = !0);
  }
  if (!lo[l] && (u || l && !$r[l])) {
    for (var d = -1, f = 0; f < hh.length; f++) {
      var p = a.indexOf(hh[f]);
      p !== -1 && (d === -1 || p < d) && (d = p);
    }
    var m, g;
    d === -1 ? g = a.lastIndexOf("@") : g = a.lastIndexOf("@", d), g !== -1 && (m = a.slice(0, g), a = a.slice(g + 1), this.auth = decodeURIComponent(m)), d = -1;
    for (var f = 0; f < ah.length; f++) {
      var p = a.indexOf(ah[f]);
      p !== -1 && (d === -1 || p < d) && (d = p);
    }
    d === -1 && (d = a.length), this.host = a.slice(0, d), a = a.slice(d), this.parseHost(), this.hostname = this.hostname || "";
    var y = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!y)
      for (var v = this.hostname.split(/\./), f = 0, _ = v.length; f < _; f++) {
        var x = v[f];
        if (x && !x.match(lh)) {
          for (var T = "", C = 0, w = x.length; C < w; C++)
            x.charCodeAt(C) > 127 ? T += "x" : T += x[C];
          if (!T.match(lh)) {
            var I = v.slice(0, f), S = v.slice(f + 1), P = x.match(pm);
            P && (I.push(P[1]), S.unshift(P[2])), S.length && (a = "/" + S.join(".") + a), this.hostname = I.join(".");
            break;
          }
        }
      }
    this.hostname.length > fm ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), y || (this.hostname = am.toASCII(this.hostname));
    var O = this.port ? ":" + this.port : "", M = this.hostname || "";
    this.host = M + O, this.href += this.host, y && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), a[0] !== "/" && (a = "/" + a));
  }
  if (!mm[c])
    for (var f = 0, _ = ho.length; f < _; f++) {
      var E = ho[f];
      if (a.indexOf(E) !== -1) {
        var A = encodeURIComponent(E);
        A === E && (A = escape(E)), a = a.split(E).join(A);
      }
    }
  var R = a.indexOf("#");
  R !== -1 && (this.hash = a.substr(R), a = a.slice(0, R));
  var X = a.indexOf("?");
  if (X !== -1 ? (this.search = a.substr(X), this.query = a.substr(X + 1), t && (this.query = co.parse(this.query)), a = a.slice(0, X)) : t && (this.search = "", this.query = {}), a && (this.pathname = a), $r[c] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
    var O = this.pathname || "", D = this.search || "";
    this.path = O + D;
  }
  return this.href = this.format(), this;
};
Fe.prototype.format = function() {
  var r = this.auth || "";
  r && (r = encodeURIComponent(r), r = r.replace(/%3A/i, ":"), r += "@");
  var t = this.protocol || "", e = this.pathname || "", i = this.hash || "", s = !1, n = "";
  this.host ? s = r + this.host : this.hostname && (s = r + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]"), this.port && (s += ":" + this.port)), this.query && typeof this.query == "object" && Object.keys(this.query).length && (n = co.stringify(this.query, {
    arrayFormat: "repeat",
    addQueryPrefix: !1
  }));
  var o = this.search || n && "?" + n || "";
  return t && t.substr(-1) !== ":" && (t += ":"), this.slashes || (!t || $r[t]) && s !== !1 ? (s = "//" + (s || ""), e && e.charAt(0) !== "/" && (e = "/" + e)) : s || (s = ""), i && i.charAt(0) !== "#" && (i = "#" + i), o && o.charAt(0) !== "?" && (o = "?" + o), e = e.replace(/[?#]/g, function(a) {
    return encodeURIComponent(a);
  }), o = o.replace("#", "%23"), t + s + e + o + i;
};
Fe.prototype.resolve = function(r) {
  return this.resolveObject(gm(r, !1, !0)).format();
};
Fe.prototype.resolveObject = function(r) {
  if (typeof r == "string") {
    var t = new Fe();
    t.parse(r, !1, !0), r = t;
  }
  for (var e = new Fe(), i = Object.keys(this), s = 0; s < i.length; s++) {
    var n = i[s];
    e[n] = this[n];
  }
  if (e.hash = r.hash, r.href === "")
    return e.href = e.format(), e;
  if (r.slashes && !r.protocol) {
    for (var o = Object.keys(r), a = 0; a < o.length; a++) {
      var h = o[a];
      h !== "protocol" && (e[h] = r[h]);
    }
    return $r[e.protocol] && e.hostname && !e.pathname && (e.pathname = "/", e.path = e.pathname), e.href = e.format(), e;
  }
  if (r.protocol && r.protocol !== e.protocol) {
    if (!$r[r.protocol]) {
      for (var l = Object.keys(r), c = 0; c < l.length; c++) {
        var u = l[c];
        e[u] = r[u];
      }
      return e.href = e.format(), e;
    }
    if (e.protocol = r.protocol, !r.host && !lo[r.protocol]) {
      for (var _ = (r.pathname || "").split("/"); _.length && !(r.host = _.shift()); )
        ;
      r.host || (r.host = ""), r.hostname || (r.hostname = ""), _[0] !== "" && _.unshift(""), _.length < 2 && _.unshift(""), e.pathname = _.join("/");
    } else
      e.pathname = r.pathname;
    if (e.search = r.search, e.query = r.query, e.host = r.host || "", e.auth = r.auth, e.hostname = r.hostname || r.host, e.port = r.port, e.pathname || e.search) {
      var d = e.pathname || "", f = e.search || "";
      e.path = d + f;
    }
    return e.slashes = e.slashes || r.slashes, e.href = e.format(), e;
  }
  var p = e.pathname && e.pathname.charAt(0) === "/", m = r.host || r.pathname && r.pathname.charAt(0) === "/", g = m || p || e.host && r.pathname, y = g, v = e.pathname && e.pathname.split("/") || [], _ = r.pathname && r.pathname.split("/") || [], x = e.protocol && !$r[e.protocol];
  if (x && (e.hostname = "", e.port = null, e.host && (v[0] === "" ? v[0] = e.host : v.unshift(e.host)), e.host = "", r.protocol && (r.hostname = null, r.port = null, r.host && (_[0] === "" ? _[0] = r.host : _.unshift(r.host)), r.host = null), g = g && (_[0] === "" || v[0] === "")), m)
    e.host = r.host || r.host === "" ? r.host : e.host, e.hostname = r.hostname || r.hostname === "" ? r.hostname : e.hostname, e.search = r.search, e.query = r.query, v = _;
  else if (_.length)
    v || (v = []), v.pop(), v = v.concat(_), e.search = r.search, e.query = r.query;
  else if (r.search != null) {
    if (x) {
      e.host = v.shift(), e.hostname = e.host;
      var T = e.host && e.host.indexOf("@") > 0 ? e.host.split("@") : !1;
      T && (e.auth = T.shift(), e.hostname = T.shift(), e.host = e.hostname);
    }
    return e.search = r.search, e.query = r.query, (e.pathname !== null || e.search !== null) && (e.path = (e.pathname ? e.pathname : "") + (e.search ? e.search : "")), e.href = e.format(), e;
  }
  if (!v.length)
    return e.pathname = null, e.search ? e.path = "/" + e.search : e.path = null, e.href = e.format(), e;
  for (var C = v.slice(-1)[0], w = (e.host || r.host || v.length > 1) && (C === "." || C === "..") || C === "", I = 0, S = v.length; S >= 0; S--)
    C = v[S], C === "." ? v.splice(S, 1) : C === ".." ? (v.splice(S, 1), I++) : I && (v.splice(S, 1), I--);
  if (!g && !y)
    for (; I--; I)
      v.unshift("..");
  g && v[0] !== "" && (!v[0] || v[0].charAt(0) !== "/") && v.unshift(""), w && v.join("/").substr(-1) !== "/" && v.push("");
  var P = v[0] === "" || v[0] && v[0].charAt(0) === "/";
  if (x) {
    e.hostname = P ? "" : v.length ? v.shift() : "", e.host = e.hostname;
    var T = e.host && e.host.indexOf("@") > 0 ? e.host.split("@") : !1;
    T && (e.auth = T.shift(), e.hostname = T.shift(), e.host = e.hostname);
  }
  return g = g || e.host && v.length, g && !P && v.unshift(""), v.length > 0 ? e.pathname = v.join("/") : (e.pathname = null, e.path = null), (e.pathname !== null || e.search !== null) && (e.path = (e.pathname ? e.pathname : "") + (e.search ? e.search : "")), e.auth = r.auth || e.auth, e.slashes = e.slashes || r.slashes, e.href = e.format(), e;
};
Fe.prototype.parseHost = function() {
  var r = this.host, t = lm.exec(r);
  t && (t = t[0], t !== ":" && (this.port = t.substr(1)), r = r.substr(0, r.length - t.length)), r && (this.hostname = r);
};
const ch = {};
function it(r, t, e = 3) {
  if (ch[t])
    return;
  let i = new Error().stack;
  typeof i > "u" ? console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${r}`) : (i = i.split(`
`).splice(e).join(`
`), console.groupCollapsed ? (console.groupCollapsed(
    "%cPixiJS Deprecation Warning: %c%s",
    "color:#614108;background:#fffbe6",
    "font-weight:normal;color:#614108;background:#fffbe6",
    `${t}
Deprecated since v${r}`
  ), console.warn(i), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${r}`), console.warn(i))), ch[t] = !0;
}
function ie(r) {
  if (typeof r != "string")
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(r)}`);
}
function oi(r) {
  return r.split("?")[0].split("#")[0];
}
function ym(r) {
  return r.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function _m(r, t, e) {
  return r.replace(new RegExp(ym(t), "g"), e);
}
function vm(r, t) {
  let e = "", i = 0, s = -1, n = 0, o = -1;
  for (let a = 0; a <= r.length; ++a) {
    if (a < r.length)
      o = r.charCodeAt(a);
    else {
      if (o === 47)
        break;
      o = 47;
    }
    if (o === 47) {
      if (!(s === a - 1 || n === 1))
        if (s !== a - 1 && n === 2) {
          if (e.length < 2 || i !== 2 || e.charCodeAt(e.length - 1) !== 46 || e.charCodeAt(e.length - 2) !== 46) {
            if (e.length > 2) {
              const h = e.lastIndexOf("/");
              if (h !== e.length - 1) {
                h === -1 ? (e = "", i = 0) : (e = e.slice(0, h), i = e.length - 1 - e.lastIndexOf("/")), s = a, n = 0;
                continue;
              }
            } else if (e.length === 2 || e.length === 1) {
              e = "", i = 0, s = a, n = 0;
              continue;
            }
          }
          t && (e.length > 0 ? e += "/.." : e = "..", i = 2);
        } else
          e.length > 0 ? e += `/${r.slice(s + 1, a)}` : e = r.slice(s + 1, a), i = a - s - 1;
      s = a, n = 0;
    } else
      o === 46 && n !== -1 ? ++n : n = -1;
  }
  return e;
}
const Rt = {
  /**
   * Converts a path to posix format.
   * @param path - The path to convert to posix
   */
  toPosix(r) {
    return _m(r, "\\", "/");
  },
  /**
   * Checks if the path is a URL e.g. http://, https://
   * @param path - The path to check
   */
  isUrl(r) {
    return /^https?:/.test(this.toPosix(r));
  },
  /**
   * Checks if the path is a data URL
   * @param path - The path to check
   */
  isDataUrl(r) {
    return /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(r);
  },
  /**
   * Checks if the path is a blob URL
   * @param path - The path to check
   */
  isBlobUrl(r) {
    return r.startsWith("blob:");
  },
  /**
   * Checks if the path has a protocol e.g. http://, https://, file:///, data:, blob:, C:/
   * This will return true for windows file paths
   * @param path - The path to check
   */
  hasProtocol(r) {
    return /^[^/:]+:/.test(this.toPosix(r));
  },
  /**
   * Returns the protocol of the path e.g. http://, https://, file:///, data:, blob:, C:/
   * @param path - The path to get the protocol from
   */
  getProtocol(r) {
    ie(r), r = this.toPosix(r);
    const t = /^file:\/\/\//.exec(r);
    if (t)
      return t[0];
    const e = /^[^/:]+:\/{0,2}/.exec(r);
    return e ? e[0] : "";
  },
  /**
   * Converts URL to an absolute path.
   * When loading from a Web Worker, we must use absolute paths.
   * If the URL is already absolute we return it as is
   * If it's not, we convert it
   * @param url - The URL to test
   * @param customBaseUrl - The base URL to use
   * @param customRootUrl - The root URL to use
   */
  toAbsolute(r, t, e) {
    if (ie(r), this.isDataUrl(r) || this.isBlobUrl(r))
      return r;
    const i = oi(this.toPosix(t ?? H.ADAPTER.getBaseUrl())), s = oi(this.toPosix(e ?? this.rootname(i)));
    return r = this.toPosix(r), r.startsWith("/") ? Rt.join(s, r.slice(1)) : this.isAbsolute(r) ? r : this.join(i, r);
  },
  /**
   * Normalizes the given path, resolving '..' and '.' segments
   * @param path - The path to normalize
   */
  normalize(r) {
    if (ie(r), r.length === 0)
      return ".";
    if (this.isDataUrl(r) || this.isBlobUrl(r))
      return r;
    r = this.toPosix(r);
    let t = "";
    const e = r.startsWith("/");
    this.hasProtocol(r) && (t = this.rootname(r), r = r.slice(t.length));
    const i = r.endsWith("/");
    return r = vm(r, !1), r.length > 0 && i && (r += "/"), e ? `/${r}` : t + r;
  },
  /**
   * Determines if path is an absolute path.
   * Absolute paths can be urls, data urls, or paths on disk
   * @param path - The path to test
   */
  isAbsolute(r) {
    return ie(r), r = this.toPosix(r), this.hasProtocol(r) ? !0 : r.startsWith("/");
  },
  /**
   * Joins all given path segments together using the platform-specific separator as a delimiter,
   * then normalizes the resulting path
   * @param segments - The segments of the path to join
   */
  join(...r) {
    if (r.length === 0)
      return ".";
    let t;
    for (let e = 0; e < r.length; ++e) {
      const i = r[e];
      if (ie(i), i.length > 0)
        if (t === void 0)
          t = i;
        else {
          const s = r[e - 1] ?? "";
          this.joinExtensions.includes(this.extname(s).toLowerCase()) ? t += `/../${i}` : t += `/${i}`;
        }
    }
    return t === void 0 ? "." : this.normalize(t);
  },
  /**
   * Returns the directory name of a path
   * @param path - The path to parse
   */
  dirname(r) {
    if (ie(r), r.length === 0)
      return ".";
    r = this.toPosix(r);
    let t = r.charCodeAt(0);
    const e = t === 47;
    let i = -1, s = !0;
    const n = this.getProtocol(r), o = r;
    r = r.slice(n.length);
    for (let a = r.length - 1; a >= 1; --a)
      if (t = r.charCodeAt(a), t === 47) {
        if (!s) {
          i = a;
          break;
        }
      } else
        s = !1;
    return i === -1 ? e ? "/" : this.isUrl(o) ? n + r : n : e && i === 1 ? "//" : n + r.slice(0, i);
  },
  /**
   * Returns the root of the path e.g. /, C:/, file:///, http://domain.com/
   * @param path - The path to parse
   */
  rootname(r) {
    ie(r), r = this.toPosix(r);
    let t = "";
    if (r.startsWith("/") ? t = "/" : t = this.getProtocol(r), this.isUrl(r)) {
      const e = r.indexOf("/", t.length);
      e !== -1 ? t = r.slice(0, e) : t = r, t.endsWith("/") || (t += "/");
    }
    return t;
  },
  /**
   * Returns the last portion of a path
   * @param path - The path to test
   * @param ext - Optional extension to remove
   */
  basename(r, t) {
    ie(r), t && ie(t), r = oi(this.toPosix(r));
    let e = 0, i = -1, s = !0, n;
    if (t !== void 0 && t.length > 0 && t.length <= r.length) {
      if (t.length === r.length && t === r)
        return "";
      let o = t.length - 1, a = -1;
      for (n = r.length - 1; n >= 0; --n) {
        const h = r.charCodeAt(n);
        if (h === 47) {
          if (!s) {
            e = n + 1;
            break;
          }
        } else
          a === -1 && (s = !1, a = n + 1), o >= 0 && (h === t.charCodeAt(o) ? --o === -1 && (i = n) : (o = -1, i = a));
      }
      return e === i ? i = a : i === -1 && (i = r.length), r.slice(e, i);
    }
    for (n = r.length - 1; n >= 0; --n)
      if (r.charCodeAt(n) === 47) {
        if (!s) {
          e = n + 1;
          break;
        }
      } else
        i === -1 && (s = !1, i = n + 1);
    return i === -1 ? "" : r.slice(e, i);
  },
  /**
   * Returns the extension of the path, from the last occurrence of the . (period) character to end of string in the last
   * portion of the path. If there is no . in the last portion of the path, or if there are no . characters other than
   * the first character of the basename of path, an empty string is returned.
   * @param path - The path to parse
   */
  extname(r) {
    ie(r), r = oi(this.toPosix(r));
    let t = -1, e = 0, i = -1, s = !0, n = 0;
    for (let o = r.length - 1; o >= 0; --o) {
      const a = r.charCodeAt(o);
      if (a === 47) {
        if (!s) {
          e = o + 1;
          break;
        }
        continue;
      }
      i === -1 && (s = !1, i = o + 1), a === 46 ? t === -1 ? t = o : n !== 1 && (n = 1) : t !== -1 && (n = -1);
    }
    return t === -1 || i === -1 || n === 0 || n === 1 && t === i - 1 && t === e + 1 ? "" : r.slice(t, i);
  },
  /**
   * Parses a path into an object containing the 'root', `dir`, `base`, `ext`, and `name` properties.
   * @param path - The path to parse
   */
  parse(r) {
    ie(r);
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (r.length === 0)
      return t;
    r = oi(this.toPosix(r));
    let e = r.charCodeAt(0);
    const i = this.isAbsolute(r);
    let s;
    t.root = this.rootname(r), i || this.hasProtocol(r) ? s = 1 : s = 0;
    let n = -1, o = 0, a = -1, h = !0, l = r.length - 1, c = 0;
    for (; l >= s; --l) {
      if (e = r.charCodeAt(l), e === 47) {
        if (!h) {
          o = l + 1;
          break;
        }
        continue;
      }
      a === -1 && (h = !1, a = l + 1), e === 46 ? n === -1 ? n = l : c !== 1 && (c = 1) : n !== -1 && (c = -1);
    }
    return n === -1 || a === -1 || c === 0 || c === 1 && n === a - 1 && n === o + 1 ? a !== -1 && (o === 0 && i ? t.base = t.name = r.slice(1, a) : t.base = t.name = r.slice(o, a)) : (o === 0 && i ? (t.name = r.slice(1, n), t.base = r.slice(1, a)) : (t.name = r.slice(o, n), t.base = r.slice(o, a)), t.ext = r.slice(n, a)), t.dir = this.dirname(r), t;
  },
  sep: "/",
  delimiter: ":",
  joinExtensions: [".html"]
};
let _n;
async function xm() {
  return _n ?? (_n = (async () => {
    var n;
    const r = document.createElement("canvas").getContext("webgl");
    if (!r)
      return Ht.UNPACK;
    const t = await new Promise((o) => {
      const a = document.createElement("video");
      a.onloadeddata = () => o(a), a.onerror = () => o(null), a.autoplay = !1, a.crossOrigin = "anonymous", a.preload = "auto", a.src = "data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHTEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEXTbuMU6uEHFO7a1OsggG97AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBEAAAAAAAAFlSua8yuAQAAAAAAAEPXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA5g4EBI+ODhAJiWgDglLCBArqBApqBAlPAgQFVsIRVuYEBElTDZ9Vzc9JjwItjxYgAAAAAAAAAAWfInEWjh0VOQ09ERVJEh49MYXZjIGxpYnZweC12cDlnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjA0MDAwMDAwMAAAH0O2dcfngQCgwqGggQAAAIJJg0IAABAAFgA4JBwYSgAAICAAEb///4r+AAB1oZ2mm+6BAaWWgkmDQgAAEAAWADgkHBhKAAAgIABIQBxTu2uRu4+zgQC3iveBAfGCAXHwgQM=", a.load();
    });
    if (!t)
      return Ht.UNPACK;
    const e = r.createTexture();
    r.bindTexture(r.TEXTURE_2D, e);
    const i = r.createFramebuffer();
    r.bindFramebuffer(r.FRAMEBUFFER, i), r.framebufferTexture2D(
      r.FRAMEBUFFER,
      r.COLOR_ATTACHMENT0,
      r.TEXTURE_2D,
      e,
      0
    ), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL, r.NONE), r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, r.RGBA, r.UNSIGNED_BYTE, t);
    const s = new Uint8Array(4);
    return r.readPixels(0, 0, 1, 1, r.RGBA, r.UNSIGNED_BYTE, s), r.deleteFramebuffer(i), r.deleteTexture(e), (n = r.getExtension("WEBGL_lose_context")) == null || n.loseContext(), s[0] <= s[3] ? Ht.PMA : Ht.UNPACK;
  })()), _n;
}
let vn;
function bm() {
  return typeof vn > "u" && (vn = function() {
    var t;
    const r = {
      stencil: !0,
      failIfMajorPerformanceCaveat: H.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
    };
    try {
      if (!H.ADAPTER.getWebGLRenderingContext())
        return !1;
      const e = H.ADAPTER.createCanvas();
      let i = e.getContext("webgl", r) || e.getContext("experimental-webgl", r);
      const s = !!((t = i == null ? void 0 : i.getContextAttributes()) != null && t.stencil);
      if (i) {
        const n = i.getExtension("WEBGL_lose_context");
        n && n.loseContext();
      }
      return i = null, s;
    } catch {
      return !1;
    }
  }()), vn;
}
var Tm = { grad: 0.9, turn: 360, rad: 360 / (2 * Math.PI) }, Ie = function(r) {
  return typeof r == "string" ? r.length > 0 : typeof r == "number";
}, Bt = function(r, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = Math.pow(10, t)), Math.round(e * r) / e + 0;
}, te = function(r, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = 1), r > e ? e : r > t ? r : t;
}, lc = function(r) {
  return (r = isFinite(r) ? r % 360 : 0) > 0 ? r : r + 360;
}, uh = function(r) {
  return { r: te(r.r, 0, 255), g: te(r.g, 0, 255), b: te(r.b, 0, 255), a: te(r.a) };
}, xn = function(r) {
  return { r: Bt(r.r), g: Bt(r.g), b: Bt(r.b), a: Bt(r.a, 3) };
}, Em = /^#([0-9a-f]{3,8})$/i, zi = function(r) {
  var t = r.toString(16);
  return t.length < 2 ? "0" + t : t;
}, cc = function(r) {
  var t = r.r, e = r.g, i = r.b, s = r.a, n = Math.max(t, e, i), o = n - Math.min(t, e, i), a = o ? n === t ? (e - i) / o : n === e ? 2 + (i - t) / o : 4 + (t - e) / o : 0;
  return { h: 60 * (a < 0 ? a + 6 : a), s: n ? o / n * 100 : 0, v: n / 255 * 100, a: s };
}, uc = function(r) {
  var t = r.h, e = r.s, i = r.v, s = r.a;
  t = t / 360 * 6, e /= 100, i /= 100;
  var n = Math.floor(t), o = i * (1 - e), a = i * (1 - (t - n) * e), h = i * (1 - (1 - t + n) * e), l = n % 6;
  return { r: 255 * [i, a, o, o, h, i][l], g: 255 * [h, i, i, a, o, o][l], b: 255 * [o, o, h, i, i, a][l], a: s };
}, dh = function(r) {
  return { h: lc(r.h), s: te(r.s, 0, 100), l: te(r.l, 0, 100), a: te(r.a) };
}, fh = function(r) {
  return { h: Bt(r.h), s: Bt(r.s), l: Bt(r.l), a: Bt(r.a, 3) };
}, ph = function(r) {
  return uc((e = (t = r).s, { h: t.h, s: (e *= ((i = t.l) < 50 ? i : 100 - i) / 100) > 0 ? 2 * e / (i + e) * 100 : 0, v: i + e, a: t.a }));
  var t, e, i;
}, Ai = function(r) {
  return { h: (t = cc(r)).h, s: (s = (200 - (e = t.s)) * (i = t.v) / 100) > 0 && s < 200 ? e * i / 100 / (s <= 100 ? s : 200 - s) * 100 : 0, l: s / 2, a: t.a };
  var t, e, i, s;
}, wm = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Am = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Sm = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Im = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, uo = { string: [[function(r) {
  var t = Em.exec(r);
  return t ? (r = t[1]).length <= 4 ? { r: parseInt(r[0] + r[0], 16), g: parseInt(r[1] + r[1], 16), b: parseInt(r[2] + r[2], 16), a: r.length === 4 ? Bt(parseInt(r[3] + r[3], 16) / 255, 2) : 1 } : r.length === 6 || r.length === 8 ? { r: parseInt(r.substr(0, 2), 16), g: parseInt(r.substr(2, 2), 16), b: parseInt(r.substr(4, 2), 16), a: r.length === 8 ? Bt(parseInt(r.substr(6, 2), 16) / 255, 2) : 1 } : null : null;
}, "hex"], [function(r) {
  var t = Sm.exec(r) || Im.exec(r);
  return t ? t[2] !== t[4] || t[4] !== t[6] ? null : uh({ r: Number(t[1]) / (t[2] ? 100 / 255 : 1), g: Number(t[3]) / (t[4] ? 100 / 255 : 1), b: Number(t[5]) / (t[6] ? 100 / 255 : 1), a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1) }) : null;
}, "rgb"], [function(r) {
  var t = wm.exec(r) || Am.exec(r);
  if (!t)
    return null;
  var e, i, s = dh({ h: (e = t[1], i = t[2], i === void 0 && (i = "deg"), Number(e) * (Tm[i] || 1)), s: Number(t[3]), l: Number(t[4]), a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1) });
  return ph(s);
}, "hsl"]], object: [[function(r) {
  var t = r.r, e = r.g, i = r.b, s = r.a, n = s === void 0 ? 1 : s;
  return Ie(t) && Ie(e) && Ie(i) ? uh({ r: Number(t), g: Number(e), b: Number(i), a: Number(n) }) : null;
}, "rgb"], [function(r) {
  var t = r.h, e = r.s, i = r.l, s = r.a, n = s === void 0 ? 1 : s;
  if (!Ie(t) || !Ie(e) || !Ie(i))
    return null;
  var o = dh({ h: Number(t), s: Number(e), l: Number(i), a: Number(n) });
  return ph(o);
}, "hsl"], [function(r) {
  var t = r.h, e = r.s, i = r.v, s = r.a, n = s === void 0 ? 1 : s;
  if (!Ie(t) || !Ie(e) || !Ie(i))
    return null;
  var o = function(a) {
    return { h: lc(a.h), s: te(a.s, 0, 100), v: te(a.v, 0, 100), a: te(a.a) };
  }({ h: Number(t), s: Number(e), v: Number(i), a: Number(n) });
  return uc(o);
}, "hsv"]] }, mh = function(r, t) {
  for (var e = 0; e < t.length; e++) {
    var i = t[e][0](r);
    if (i)
      return [i, t[e][1]];
  }
  return [null, void 0];
}, Cm = function(r) {
  return typeof r == "string" ? mh(r.trim(), uo.string) : typeof r == "object" && r !== null ? mh(r, uo.object) : [null, void 0];
}, bn = function(r, t) {
  var e = Ai(r);
  return { h: e.h, s: te(e.s + 100 * t, 0, 100), l: e.l, a: e.a };
}, Tn = function(r) {
  return (299 * r.r + 587 * r.g + 114 * r.b) / 1e3 / 255;
}, gh = function(r, t) {
  var e = Ai(r);
  return { h: e.h, s: e.s, l: te(e.l + 100 * t, 0, 100), a: e.a };
}, fo = function() {
  function r(t) {
    this.parsed = Cm(t)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
  }
  return r.prototype.isValid = function() {
    return this.parsed !== null;
  }, r.prototype.brightness = function() {
    return Bt(Tn(this.rgba), 2);
  }, r.prototype.isDark = function() {
    return Tn(this.rgba) < 0.5;
  }, r.prototype.isLight = function() {
    return Tn(this.rgba) >= 0.5;
  }, r.prototype.toHex = function() {
    return t = xn(this.rgba), e = t.r, i = t.g, s = t.b, o = (n = t.a) < 1 ? zi(Bt(255 * n)) : "", "#" + zi(e) + zi(i) + zi(s) + o;
    var t, e, i, s, n, o;
  }, r.prototype.toRgb = function() {
    return xn(this.rgba);
  }, r.prototype.toRgbString = function() {
    return t = xn(this.rgba), e = t.r, i = t.g, s = t.b, (n = t.a) < 1 ? "rgba(" + e + ", " + i + ", " + s + ", " + n + ")" : "rgb(" + e + ", " + i + ", " + s + ")";
    var t, e, i, s, n;
  }, r.prototype.toHsl = function() {
    return fh(Ai(this.rgba));
  }, r.prototype.toHslString = function() {
    return t = fh(Ai(this.rgba)), e = t.h, i = t.s, s = t.l, (n = t.a) < 1 ? "hsla(" + e + ", " + i + "%, " + s + "%, " + n + ")" : "hsl(" + e + ", " + i + "%, " + s + "%)";
    var t, e, i, s, n;
  }, r.prototype.toHsv = function() {
    return t = cc(this.rgba), { h: Bt(t.h), s: Bt(t.s), v: Bt(t.v), a: Bt(t.a, 3) };
    var t;
  }, r.prototype.invert = function() {
    return me({ r: 255 - (t = this.rgba).r, g: 255 - t.g, b: 255 - t.b, a: t.a });
    var t;
  }, r.prototype.saturate = function(t) {
    return t === void 0 && (t = 0.1), me(bn(this.rgba, t));
  }, r.prototype.desaturate = function(t) {
    return t === void 0 && (t = 0.1), me(bn(this.rgba, -t));
  }, r.prototype.grayscale = function() {
    return me(bn(this.rgba, -1));
  }, r.prototype.lighten = function(t) {
    return t === void 0 && (t = 0.1), me(gh(this.rgba, t));
  }, r.prototype.darken = function(t) {
    return t === void 0 && (t = 0.1), me(gh(this.rgba, -t));
  }, r.prototype.rotate = function(t) {
    return t === void 0 && (t = 15), this.hue(this.hue() + t);
  }, r.prototype.alpha = function(t) {
    return typeof t == "number" ? me({ r: (e = this.rgba).r, g: e.g, b: e.b, a: t }) : Bt(this.rgba.a, 3);
    var e;
  }, r.prototype.hue = function(t) {
    var e = Ai(this.rgba);
    return typeof t == "number" ? me({ h: t, s: e.s, l: e.l, a: e.a }) : Bt(e.h);
  }, r.prototype.isEqual = function(t) {
    return this.toHex() === me(t).toHex();
  }, r;
}(), me = function(r) {
  return r instanceof fo ? r : new fo(r);
}, yh = [], Rm = function(r) {
  r.forEach(function(t) {
    yh.indexOf(t) < 0 && (t(fo, uo), yh.push(t));
  });
};
function Pm(r, t) {
  var e = { white: "#ffffff", bisque: "#ffe4c4", blue: "#0000ff", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", antiquewhite: "#faebd7", aqua: "#00ffff", azure: "#f0ffff", whitesmoke: "#f5f5f5", papayawhip: "#ffefd5", plum: "#dda0dd", blanchedalmond: "#ffebcd", black: "#000000", gold: "#ffd700", goldenrod: "#daa520", gainsboro: "#dcdcdc", cornsilk: "#fff8dc", cornflowerblue: "#6495ed", burlywood: "#deb887", aquamarine: "#7fffd4", beige: "#f5f5dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkkhaki: "#bdb76b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", peachpuff: "#ffdab9", darkmagenta: "#8b008b", darkred: "#8b0000", darkorchid: "#9932cc", darkorange: "#ff8c00", darkslateblue: "#483d8b", gray: "#808080", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", deeppink: "#ff1493", deepskyblue: "#00bfff", wheat: "#f5deb3", firebrick: "#b22222", floralwhite: "#fffaf0", ghostwhite: "#f8f8ff", darkviolet: "#9400d3", magenta: "#ff00ff", green: "#008000", dodgerblue: "#1e90ff", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", blueviolet: "#8a2be2", forestgreen: "#228b22", lawngreen: "#7cfc00", indianred: "#cd5c5c", indigo: "#4b0082", fuchsia: "#ff00ff", brown: "#a52a2a", maroon: "#800000", mediumblue: "#0000cd", lightcoral: "#f08080", darkturquoise: "#00ced1", lightcyan: "#e0ffff", ivory: "#fffff0", lightyellow: "#ffffe0", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", linen: "#faf0e6", mediumaquamarine: "#66cdaa", lemonchiffon: "#fffacd", lime: "#00ff00", khaki: "#f0e68c", mediumseagreen: "#3cb371", limegreen: "#32cd32", mediumspringgreen: "#00fa9a", lightskyblue: "#87cefa", lightblue: "#add8e6", midnightblue: "#191970", lightpink: "#ffb6c1", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", mintcream: "#f5fffa", lightslategray: "#778899", lightslategrey: "#778899", navajowhite: "#ffdead", navy: "#000080", mediumvioletred: "#c71585", powderblue: "#b0e0e6", palegoldenrod: "#eee8aa", oldlace: "#fdf5e6", paleturquoise: "#afeeee", mediumturquoise: "#48d1cc", mediumorchid: "#ba55d3", rebeccapurple: "#663399", lightsteelblue: "#b0c4de", mediumslateblue: "#7b68ee", thistle: "#d8bfd8", tan: "#d2b48c", orchid: "#da70d6", mediumpurple: "#9370db", purple: "#800080", pink: "#ffc0cb", skyblue: "#87ceeb", springgreen: "#00ff7f", palegreen: "#98fb98", red: "#ff0000", yellow: "#ffff00", slateblue: "#6a5acd", lavenderblush: "#fff0f5", peru: "#cd853f", palevioletred: "#db7093", violet: "#ee82ee", teal: "#008080", slategray: "#708090", slategrey: "#708090", aliceblue: "#f0f8ff", darkseagreen: "#8fbc8f", darkolivegreen: "#556b2f", greenyellow: "#adff2f", seagreen: "#2e8b57", seashell: "#fff5ee", tomato: "#ff6347", silver: "#c0c0c0", sienna: "#a0522d", lavender: "#e6e6fa", lightgreen: "#90ee90", orange: "#ffa500", orangered: "#ff4500", steelblue: "#4682b4", royalblue: "#4169e1", turquoise: "#40e0d0", yellowgreen: "#9acd32", salmon: "#fa8072", saddlebrown: "#8b4513", sandybrown: "#f4a460", rosybrown: "#bc8f8f", darksalmon: "#e9967a", lightgoldenrodyellow: "#fafad2", snow: "#fffafa", lightgrey: "#d3d3d3", lightgray: "#d3d3d3", dimgray: "#696969", dimgrey: "#696969", olivedrab: "#6b8e23", olive: "#808000" }, i = {};
  for (var s in e)
    i[e[s]] = s;
  var n = {};
  r.prototype.toName = function(o) {
    if (!(this.rgba.a || this.rgba.r || this.rgba.g || this.rgba.b))
      return "transparent";
    var a, h, l = i[this.toHex()];
    if (l)
      return l;
    if (o != null && o.closest) {
      var c = this.toRgb(), u = 1 / 0, d = "black";
      if (!n.length)
        for (var f in e)
          n[f] = new r(e[f]).toRgb();
      for (var p in e) {
        var m = (a = c, h = n[p], Math.pow(a.r - h.r, 2) + Math.pow(a.g - h.g, 2) + Math.pow(a.b - h.b, 2));
        m < u && (u = m, d = p);
      }
      return d;
    }
  }, t.string.push([function(o) {
    var a = o.toLowerCase(), h = a === "transparent" ? "#0000" : e[a];
    return h ? new r(h).toRgb() : null;
  }, "name"]);
}
Rm([Pm]);
const Lr = class ps {
  /**
   * @param {PIXI.ColorSource} value - Optional value to use, if not provided, white is used.
   */
  constructor(t = 16777215) {
    this._value = null, this._components = new Float32Array(4), this._components.fill(1), this._int = 16777215, this.value = t;
  }
  /** Get red component (0 - 1) */
  get red() {
    return this._components[0];
  }
  /** Get green component (0 - 1) */
  get green() {
    return this._components[1];
  }
  /** Get blue component (0 - 1) */
  get blue() {
    return this._components[2];
  }
  /** Get alpha component (0 - 1) */
  get alpha() {
    return this._components[3];
  }
  /**
   * Set the value, suitable for chaining
   * @param value
   * @see PIXI.Color.value
   */
  setValue(t) {
    return this.value = t, this;
  }
  /**
   * The current color source.
   *
   * When setting:
   * - Setting to an instance of `Color` will copy its color source and components.
   * - Otherwise, `Color` will try to normalize the color source and set the components.
   *   If the color source is invalid, an `Error` will be thrown and the `Color` will left unchanged.
   *
   * Note: The `null` in the setter's parameter type is added to match the TypeScript rule: return type of getter
   * must be assignable to its setter's parameter type. Setting `value` to `null` will throw an `Error`.
   *
   * When getting:
   * - A return value of `null` means the previous value was overridden (e.g., {@link PIXI.Color.multiply multiply},
   *   {@link PIXI.Color.premultiply premultiply} or {@link PIXI.Color.round round}).
   * - Otherwise, the color source used when setting is returned.
   * @type {PIXI.ColorSource}
   */
  set value(t) {
    if (t instanceof ps)
      this._value = this.cloneSource(t._value), this._int = t._int, this._components.set(t._components);
    else {
      if (t === null)
        throw new Error("Cannot set PIXI.Color#value to null");
      (this._value === null || !this.isSourceEqual(this._value, t)) && (this.normalize(t), this._value = this.cloneSource(t));
    }
  }
  get value() {
    return this._value;
  }
  /**
   * Copy a color source internally.
   * @param value - Color source
   */
  cloneSource(t) {
    return typeof t == "string" || typeof t == "number" || t instanceof Number || t === null ? t : Array.isArray(t) || ArrayBuffer.isView(t) ? t.slice(0) : typeof t == "object" && t !== null ? { ...t } : t;
  }
  /**
   * Equality check for color sources.
   * @param value1 - First color source
   * @param value2 - Second color source
   * @returns `true` if the color sources are equal, `false` otherwise.
   */
  isSourceEqual(t, e) {
    const i = typeof t;
    if (i !== typeof e)
      return !1;
    if (i === "number" || i === "string" || t instanceof Number)
      return t === e;
    if (Array.isArray(t) && Array.isArray(e) || ArrayBuffer.isView(t) && ArrayBuffer.isView(e))
      return t.length !== e.length ? !1 : t.every((s, n) => s === e[n]);
    if (t !== null && e !== null) {
      const s = Object.keys(t), n = Object.keys(e);
      return s.length !== n.length ? !1 : s.every((o) => t[o] === e[o]);
    }
    return t === e;
  }
  /**
   * Convert to a RGBA color object.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toRgb(); // returns { r: 1, g: 1, b: 1, a: 1 }
   */
  toRgba() {
    const [t, e, i, s] = this._components;
    return { r: t, g: e, b: i, a: s };
  }
  /**
   * Convert to a RGB color object.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toRgb(); // returns { r: 1, g: 1, b: 1 }
   */
  toRgb() {
    const [t, e, i] = this._components;
    return { r: t, g: e, b: i };
  }
  /** Convert to a CSS-style rgba string: `rgba(255,255,255,1.0)`. */
  toRgbaString() {
    const [t, e, i] = this.toUint8RgbArray();
    return `rgba(${t},${e},${i},${this.alpha})`;
  }
  toUint8RgbArray(t) {
    const [e, i, s] = this._components;
    return t = t ?? [], t[0] = Math.round(e * 255), t[1] = Math.round(i * 255), t[2] = Math.round(s * 255), t;
  }
  toRgbArray(t) {
    t = t ?? [];
    const [e, i, s] = this._components;
    return t[0] = e, t[1] = i, t[2] = s, t;
  }
  /**
   * Convert to a hexadecimal number.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toNumber(); // returns 16777215
   */
  toNumber() {
    return this._int;
  }
  /**
   * Convert to a hexadecimal number in little endian format (e.g., BBGGRR).
   * @example
   * import { Color } from 'pixi.js';
   * new Color(0xffcc99).toLittleEndianNumber(); // returns 0x99ccff
   * @returns {number} - The color as a number in little endian format.
   */
  toLittleEndianNumber() {
    const t = this._int;
    return (t >> 16) + (t & 65280) + ((t & 255) << 16);
  }
  /**
   * Multiply with another color. This action is destructive, and will
   * override the previous `value` property to be `null`.
   * @param {PIXI.ColorSource} value - The color to multiply by.
   */
  multiply(t) {
    const [e, i, s, n] = ps.temp.setValue(t)._components;
    return this._components[0] *= e, this._components[1] *= i, this._components[2] *= s, this._components[3] *= n, this.refreshInt(), this._value = null, this;
  }
  /**
   * Converts color to a premultiplied alpha format. This action is destructive, and will
   * override the previous `value` property to be `null`.
   * @param alpha - The alpha to multiply by.
   * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels.
   * @returns {PIXI.Color} - Itself.
   */
  premultiply(t, e = !0) {
    return e && (this._components[0] *= t, this._components[1] *= t, this._components[2] *= t), this._components[3] = t, this.refreshInt(), this._value = null, this;
  }
  /**
   * Premultiplies alpha with current color.
   * @param {number} alpha - The alpha to multiply by.
   * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels.
   * @returns {number} tint multiplied by alpha
   */
  toPremultiplied(t, e = !0) {
    if (t === 1)
      return (255 << 24) + this._int;
    if (t === 0)
      return e ? 0 : this._int;
    let i = this._int >> 16 & 255, s = this._int >> 8 & 255, n = this._int & 255;
    return e && (i = i * t + 0.5 | 0, s = s * t + 0.5 | 0, n = n * t + 0.5 | 0), (t * 255 << 24) + (i << 16) + (s << 8) + n;
  }
  /**
   * Convert to a hexidecimal string.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toHex(); // returns "#ffffff"
   */
  toHex() {
    const t = this._int.toString(16);
    return `#${"000000".substring(0, 6 - t.length) + t}`;
  }
  /**
   * Convert to a hexidecimal string with alpha.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toHexa(); // returns "#ffffffff"
   */
  toHexa() {
    const t = Math.round(this._components[3] * 255).toString(16);
    return this.toHex() + "00".substring(0, 2 - t.length) + t;
  }
  /**
   * Set alpha, suitable for chaining.
   * @param alpha
   */
  setAlpha(t) {
    return this._components[3] = this._clamp(t), this;
  }
  /**
   * Rounds the specified color according to the step. This action is destructive, and will
   * override the previous `value` property to be `null`. The alpha component is not rounded.
   * @param steps - Number of steps which will be used as a cap when rounding colors
   * @deprecated since 7.3.0
   */
  round(t) {
    const [e, i, s] = this._components;
    return this._components[0] = Math.round(e * t) / t, this._components[1] = Math.round(i * t) / t, this._components[2] = Math.round(s * t) / t, this.refreshInt(), this._value = null, this;
  }
  toArray(t) {
    t = t ?? [];
    const [e, i, s, n] = this._components;
    return t[0] = e, t[1] = i, t[2] = s, t[3] = n, t;
  }
  /**
   * Normalize the input value into rgba
   * @param value - Input value
   */
  normalize(t) {
    let e, i, s, n;
    if ((typeof t == "number" || t instanceof Number) && t >= 0 && t <= 16777215) {
      const o = t;
      e = (o >> 16 & 255) / 255, i = (o >> 8 & 255) / 255, s = (o & 255) / 255, n = 1;
    } else if ((Array.isArray(t) || t instanceof Float32Array) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t), [e, i, s, n = 1] = t;
    else if ((t instanceof Uint8Array || t instanceof Uint8ClampedArray) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t, 0, 255), [e, i, s, n = 255] = t, e /= 255, i /= 255, s /= 255, n /= 255;
    else if (typeof t == "string" || typeof t == "object") {
      if (typeof t == "string") {
        const a = ps.HEX_PATTERN.exec(t);
        a && (t = `#${a[2]}`);
      }
      const o = me(t);
      o.isValid() && ({ r: e, g: i, b: s, a: n } = o.rgba, e /= 255, i /= 255, s /= 255);
    }
    if (e !== void 0)
      this._components[0] = e, this._components[1] = i, this._components[2] = s, this._components[3] = n, this.refreshInt();
    else
      throw new Error(`Unable to convert color ${t}`);
  }
  /** Refresh the internal color rgb number */
  refreshInt() {
    this._clamp(this._components);
    const [t, e, i] = this._components;
    this._int = (t * 255 << 16) + (e * 255 << 8) + (i * 255 | 0);
  }
  /**
   * Clamps values to a range. Will override original values
   * @param value - Value(s) to clamp
   * @param min - Minimum value
   * @param max - Maximum value
   */
  _clamp(t, e = 0, i = 1) {
    return typeof t == "number" ? Math.min(Math.max(t, e), i) : (t.forEach((s, n) => {
      t[n] = Math.min(Math.max(s, e), i);
    }), t);
  }
};
Lr.shared = new Lr(), /**
* Temporary Color object for static uses internally.
* As to not conflict with Color.shared.
* @ignore
*/
Lr.temp = new Lr(), /** Pattern for hex strings */
Lr.HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}([a-f0-9]{2})?)$/i;
let pt = Lr;
function Mm(r) {
  return it("7.2.0", "utils.hex2string is deprecated, use Color#toHex instead"), pt.shared.setValue(r).toHex();
}
function Bm(r) {
  return it("7.2.0", "utils.rgb2hex is deprecated, use Color#toNumber instead"), pt.shared.setValue(r).toNumber();
}
function Dm() {
  const r = [], t = [];
  for (let i = 0; i < 32; i++)
    r[i] = i, t[i] = i;
  r[K.NORMAL_NPM] = K.NORMAL, r[K.ADD_NPM] = K.ADD, r[K.SCREEN_NPM] = K.SCREEN, t[K.NORMAL] = K.NORMAL_NPM, t[K.ADD] = K.ADD_NPM, t[K.SCREEN] = K.SCREEN_NPM;
  const e = [];
  return e.push(t), e.push(r), e;
}
const dc = Dm();
function fc(r, t) {
  return dc[t ? 1 : 0][r];
}
function Fm(r, t = null) {
  const e = r * 6;
  if (t = t || new Uint16Array(e), t.length !== e)
    throw new Error(`Out buffer length is incorrect, got ${t.length} and expected ${e}`);
  for (let i = 0, s = 0; i < e; i += 6, s += 4)
    t[i + 0] = s + 0, t[i + 1] = s + 1, t[i + 2] = s + 2, t[i + 3] = s + 0, t[i + 4] = s + 2, t[i + 5] = s + 3;
  return t;
}
function pc(r) {
  if (r.BYTES_PER_ELEMENT === 4)
    return r instanceof Float32Array ? "Float32Array" : r instanceof Uint32Array ? "Uint32Array" : "Int32Array";
  if (r.BYTES_PER_ELEMENT === 2) {
    if (r instanceof Uint16Array)
      return "Uint16Array";
  } else if (r.BYTES_PER_ELEMENT === 1 && r instanceof Uint8Array)
    return "Uint8Array";
  return null;
}
function Rs(r) {
  return r += r === 0 ? 1 : 0, --r, r |= r >>> 1, r |= r >>> 2, r |= r >>> 4, r |= r >>> 8, r |= r >>> 16, r + 1;
}
function _h(r) {
  return !(r & r - 1) && !!r;
}
function vh(r) {
  let t = (r > 65535 ? 1 : 0) << 4;
  r >>>= t;
  let e = (r > 255 ? 1 : 0) << 3;
  return r >>>= e, t |= e, e = (r > 15 ? 1 : 0) << 2, r >>>= e, t |= e, e = (r > 3 ? 1 : 0) << 1, r >>>= e, t |= e, t | r >> 1;
}
function Yr(r, t, e) {
  const i = r.length;
  let s;
  if (t >= i || e === 0)
    return;
  e = t + e > i ? i - t : e;
  const n = i - e;
  for (s = t; s < n; ++s)
    r[s] = r[s + e];
  r.length = n;
}
function je(r) {
  return r === 0 ? 0 : r < 0 ? -1 : 1;
}
let Om = 0;
function br() {
  return ++Om;
}
const po = class {
  /**
   * @param left - The left coordinate value of the bounding box.
   * @param top - The top coordinate value of the bounding box.
   * @param right - The right coordinate value of the bounding box.
   * @param bottom - The bottom coordinate value of the bounding box.
   */
  constructor(r, t, e, i) {
    this.left = r, this.top = t, this.right = e, this.bottom = i;
  }
  /** The width of the bounding box. */
  get width() {
    return this.right - this.left;
  }
  /** The height of the bounding box. */
  get height() {
    return this.bottom - this.top;
  }
  /** Determines whether the BoundingBox is empty. */
  isEmpty() {
    return this.left === this.right || this.top === this.bottom;
  }
};
po.EMPTY = new po(0, 0, 0, 0);
let xh = po;
const bh = {}, ge = /* @__PURE__ */ Object.create(null), Ne = /* @__PURE__ */ Object.create(null);
class Lm {
  /**
   * @param width - the width for the newly created canvas
   * @param height - the height for the newly created canvas
   * @param {number} [resolution=PIXI.settings.RESOLUTION] - The resolution / device pixel ratio of the canvas
   */
  constructor(t, e, i) {
    this._canvas = H.ADAPTER.createCanvas(), this._context = this._canvas.getContext("2d"), this.resolution = i || H.RESOLUTION, this.resize(t, e);
  }
  /**
   * Clears the canvas that was created by the CanvasRenderTarget class.
   * @private
   */
  clear() {
    this._checkDestroyed(), this._context.setTransform(1, 0, 0, 1, 0, 0), this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }
  /**
   * Resizes the canvas to the specified width and height.
   * @param desiredWidth - the desired width of the canvas
   * @param desiredHeight - the desired height of the canvas
   */
  resize(t, e) {
    this._checkDestroyed(), this._canvas.width = Math.round(t * this.resolution), this._canvas.height = Math.round(e * this.resolution);
  }
  /** Destroys this canvas. */
  destroy() {
    this._context = null, this._canvas = null;
  }
  /**
   * The width of the canvas buffer in pixels.
   * @member {number}
   */
  get width() {
    return this._checkDestroyed(), this._canvas.width;
  }
  set width(t) {
    this._checkDestroyed(), this._canvas.width = Math.round(t);
  }
  /**
   * The height of the canvas buffer in pixels.
   * @member {number}
   */
  get height() {
    return this._checkDestroyed(), this._canvas.height;
  }
  set height(t) {
    this._checkDestroyed(), this._canvas.height = Math.round(t);
  }
  /** The Canvas object that belongs to this CanvasRenderTarget. */
  get canvas() {
    return this._checkDestroyed(), this._canvas;
  }
  /** A CanvasRenderingContext2D object representing a two-dimensional rendering context. */
  get context() {
    return this._checkDestroyed(), this._context;
  }
  _checkDestroyed() {
    if (this._canvas === null)
      throw new TypeError("The CanvasRenderTarget has already been destroyed");
  }
}
function Th(r, t, e) {
  for (let i = 0, s = 4 * e * t; i < t; ++i, s += 4)
    if (r[s + 3] !== 0)
      return !1;
  return !0;
}
function Eh(r, t, e, i, s) {
  const n = 4 * t;
  for (let o = i, a = i * n + 4 * e; o <= s; ++o, a += n)
    if (r[a + 3] !== 0)
      return !1;
  return !0;
}
function Nm(r) {
  const { width: t, height: e } = r, i = r.getContext("2d", {
    willReadFrequently: !0
  });
  if (i === null)
    throw new TypeError("Failed to get canvas 2D context");
  const s = i.getImageData(0, 0, t, e).data;
  let n = 0, o = 0, a = t - 1, h = e - 1;
  for (; o < e && Th(s, t, o); )
    ++o;
  if (o === e)
    return xh.EMPTY;
  for (; Th(s, t, h); )
    --h;
  for (; Eh(s, t, n, o, h); )
    ++n;
  for (; Eh(s, t, a, o, h); )
    --a;
  return ++a, ++h, new xh(n, o, a, h);
}
function km(r) {
  const t = Nm(r), { width: e, height: i } = t;
  let s = null;
  if (!t.isEmpty()) {
    const n = r.getContext("2d");
    if (n === null)
      throw new TypeError("Failed to get canvas 2D context");
    s = n.getImageData(
      t.left,
      t.top,
      e,
      i
    );
  }
  return { width: e, height: i, data: s };
}
function Um(r, t = globalThis.location) {
  if (r.startsWith("data:"))
    return "";
  t = t || globalThis.location;
  const e = new URL(r, document.baseURI);
  return e.hostname !== t.hostname || e.port !== t.port || e.protocol !== t.protocol ? "anonymous" : "";
}
function Oe(r, t = 1) {
  var i;
  const e = (i = H.RETINA_PREFIX) == null ? void 0 : i.exec(r);
  return e ? parseFloat(e[1]) : t;
}
var k = /* @__PURE__ */ ((r) => (r.Renderer = "renderer", r.Application = "application", r.RendererSystem = "renderer-webgl-system", r.RendererPlugin = "renderer-webgl-plugin", r.CanvasRendererSystem = "renderer-canvas-system", r.CanvasRendererPlugin = "renderer-canvas-plugin", r.Asset = "asset", r.LoadParser = "load-parser", r.ResolveParser = "resolve-parser", r.CacheParser = "cache-parser", r.DetectionParser = "detection-parser", r))(k || {});
const mo = (r) => {
  if (typeof r == "function" || typeof r == "object" && r.extension) {
    if (!r.extension)
      throw new Error("Extension class must have an extension object");
    r = { ...typeof r.extension != "object" ? { type: r.extension } : r.extension, ref: r };
  }
  if (typeof r == "object")
    r = { ...r };
  else
    throw new Error("Invalid extension type");
  return typeof r.type == "string" && (r.type = [r.type]), r;
}, wh = (r, t) => mo(r).priority ?? t, z = {
  /** @ignore */
  _addHandlers: {},
  /** @ignore */
  _removeHandlers: {},
  /** @ignore */
  _queue: {},
  /**
   * Remove extensions from PixiJS.
   * @param extensions - Extensions to be removed.
   * @returns {PIXI.extensions} For chaining.
   */
  remove(...r) {
    return r.map(mo).forEach((t) => {
      t.type.forEach((e) => {
        var i, s;
        return (s = (i = this._removeHandlers)[e]) == null ? void 0 : s.call(i, t);
      });
    }), this;
  },
  /**
   * Register new extensions with PixiJS.
   * @param extensions - The spread of extensions to add to PixiJS.
   * @returns {PIXI.extensions} For chaining.
   */
  add(...r) {
    return r.map(mo).forEach((t) => {
      t.type.forEach((e) => {
        const i = this._addHandlers, s = this._queue;
        i[e] ? i[e](t) : (s[e] = s[e] || [], s[e].push(t));
      });
    }), this;
  },
  /**
   * Internal method to handle extensions by name.
   * @param type - The extension type.
   * @param onAdd  - Function for handling when extensions are added/registered passes {@link PIXI.ExtensionFormat}.
   * @param onRemove  - Function for handling when extensions are removed/unregistered passes {@link PIXI.ExtensionFormat}.
   * @returns {PIXI.extensions} For chaining.
   */
  handle(r, t, e) {
    const i = this._addHandlers, s = this._removeHandlers;
    if (i[r] || s[r])
      throw new Error(`Extension type ${r} already has a handler`);
    i[r] = t, s[r] = e;
    const n = this._queue;
    return n[r] && (n[r].forEach((o) => t(o)), delete n[r]), this;
  },
  /**
   * Handle a type, but using a map by `name` property.
   * @param type - Type of extension to handle.
   * @param map - The object map of named extensions.
   * @returns {PIXI.extensions} For chaining.
   */
  handleByMap(r, t) {
    return this.handle(
      r,
      (e) => {
        t[e.name] = e.ref;
      },
      (e) => {
        delete t[e.name];
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions.
   * @param type - Type of extension to handle.
   * @param list - The list of extensions.
   * @param defaultPriority - The default priority to use if none is specified.
   * @returns {PIXI.extensions} For chaining.
   */
  handleByList(r, t, e = -1) {
    return this.handle(
      r,
      (i) => {
        t.includes(i.ref) || (t.push(i.ref), t.sort((s, n) => wh(n, e) - wh(s, e)));
      },
      (i) => {
        const s = t.indexOf(i.ref);
        s !== -1 && t.splice(s, 1);
      }
    );
  }
};
class go {
  constructor(t) {
    typeof t == "number" ? this.rawBinaryData = new ArrayBuffer(t) : t instanceof Uint8Array ? this.rawBinaryData = t.buffer : this.rawBinaryData = t, this.uint32View = new Uint32Array(this.rawBinaryData), this.float32View = new Float32Array(this.rawBinaryData);
  }
  /** View on the raw binary data as a `Int8Array`. */
  get int8View() {
    return this._int8View || (this._int8View = new Int8Array(this.rawBinaryData)), this._int8View;
  }
  /** View on the raw binary data as a `Uint8Array`. */
  get uint8View() {
    return this._uint8View || (this._uint8View = new Uint8Array(this.rawBinaryData)), this._uint8View;
  }
  /**  View on the raw binary data as a `Int16Array`. */
  get int16View() {
    return this._int16View || (this._int16View = new Int16Array(this.rawBinaryData)), this._int16View;
  }
  /** View on the raw binary data as a `Uint16Array`. */
  get uint16View() {
    return this._uint16View || (this._uint16View = new Uint16Array(this.rawBinaryData)), this._uint16View;
  }
  /** View on the raw binary data as a `Int32Array`. */
  get int32View() {
    return this._int32View || (this._int32View = new Int32Array(this.rawBinaryData)), this._int32View;
  }
  /**
   * Returns the view of the given type.
   * @param type - One of `int8`, `uint8`, `int16`,
   *    `uint16`, `int32`, `uint32`, and `float32`.
   * @returns - typed array of given type
   */
  view(t) {
    return this[`${t}View`];
  }
  /** Destroys all buffer references. Do not use after calling this. */
  destroy() {
    this.rawBinaryData = null, this._int8View = null, this._uint8View = null, this._int16View = null, this._uint16View = null, this._int32View = null, this.uint32View = null, this.float32View = null;
  }
  static sizeOf(t) {
    switch (t) {
      case "int8":
      case "uint8":
        return 1;
      case "int16":
      case "uint16":
        return 2;
      case "int32":
      case "uint32":
      case "float32":
        return 4;
      default:
        throw new Error(`${t} isn't a valid view type`);
    }
  }
}
const Gm = [
  "precision mediump float;",
  "void main(void){",
  "float test = 0.1;",
  "%forloop%",
  "gl_FragColor = vec4(0.0);",
  "}"
].join(`
`);
function Hm(r) {
  let t = "";
  for (let e = 0; e < r; ++e)
    e > 0 && (t += `
else `), e < r - 1 && (t += `if(test == ${e}.0){}`);
  return t;
}
function Vm(r, t) {
  if (r === 0)
    throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
  const e = t.createShader(t.FRAGMENT_SHADER);
  for (; ; ) {
    const i = Gm.replace(/%forloop%/gi, Hm(r));
    if (t.shaderSource(e, i), t.compileShader(e), !t.getShaderParameter(e, t.COMPILE_STATUS))
      r = r / 2 | 0;
    else
      break;
  }
  return r;
}
const En = 0, wn = 1, An = 2, Sn = 3, In = 4, Cn = 5;
class Ae {
  constructor() {
    this.data = 0, this.blendMode = K.NORMAL, this.polygonOffset = 0, this.blend = !0, this.depthMask = !0;
  }
  /**
   * Activates blending of the computed fragment color values.
   * @default true
   */
  get blend() {
    return !!(this.data & 1 << En);
  }
  set blend(t) {
    !!(this.data & 1 << En) !== t && (this.data ^= 1 << En);
  }
  /**
   * Activates adding an offset to depth values of polygon's fragments
   * @default false
   */
  get offsets() {
    return !!(this.data & 1 << wn);
  }
  set offsets(t) {
    !!(this.data & 1 << wn) !== t && (this.data ^= 1 << wn);
  }
  /**
   * Activates culling of polygons.
   * @default false
   */
  get culling() {
    return !!(this.data & 1 << An);
  }
  set culling(t) {
    !!(this.data & 1 << An) !== t && (this.data ^= 1 << An);
  }
  /**
   * Activates depth comparisons and updates to the depth buffer.
   * @default false
   */
  get depthTest() {
    return !!(this.data & 1 << Sn);
  }
  set depthTest(t) {
    !!(this.data & 1 << Sn) !== t && (this.data ^= 1 << Sn);
  }
  /**
   * Enables or disables writing to the depth buffer.
   * @default true
   */
  get depthMask() {
    return !!(this.data & 1 << Cn);
  }
  set depthMask(t) {
    !!(this.data & 1 << Cn) !== t && (this.data ^= 1 << Cn);
  }
  /**
   * Specifies whether or not front or back-facing polygons can be culled.
   * @default false
   */
  get clockwiseFrontFace() {
    return !!(this.data & 1 << In);
  }
  set clockwiseFrontFace(t) {
    !!(this.data & 1 << In) !== t && (this.data ^= 1 << In);
  }
  /**
   * The blend mode to be applied when this state is set. Apply a value of `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
   * Setting this mode to anything other than NO_BLEND will automatically switch blending on.
   * @default PIXI.BLEND_MODES.NORMAL
   */
  get blendMode() {
    return this._blendMode;
  }
  set blendMode(t) {
    this.blend = t !== K.NONE, this._blendMode = t;
  }
  /**
   * The polygon offset. Setting this property to anything other than 0 will automatically enable polygon offset fill.
   * @default 0
   */
  get polygonOffset() {
    return this._polygonOffset;
  }
  set polygonOffset(t) {
    this.offsets = !!t, this._polygonOffset = t;
  }
  static for2d() {
    const t = new Ae();
    return t.depthTest = !1, t.blend = !0, t;
  }
}
Ae.prototype.toString = function() {
  return `[@pixi/core:State blendMode=${this.blendMode} clockwiseFrontFace=${this.clockwiseFrontFace} culling=${this.culling} depthMask=${this.depthMask} polygonOffset=${this.polygonOffset}]`;
};
const yo = [];
function mc(r, t) {
  if (!r)
    return null;
  let e = "";
  if (typeof r == "string") {
    const i = /\.(\w{3,4})(?:$|\?|#)/i.exec(r);
    i && (e = i[1].toLowerCase());
  }
  for (let i = yo.length - 1; i >= 0; --i) {
    const s = yo[i];
    if (s.test && s.test(r, e))
      return new s(r, t);
  }
  throw new Error("Unrecognized source type to auto-detect Resource");
}
class ce {
  /**
   * @param name - The function name that will be executed on the listeners added to this Runner.
   */
  constructor(t) {
    this.items = [], this._name = t, this._aliasCount = 0;
  }
  /* eslint-disable jsdoc/require-param, jsdoc/check-param-names */
  /**
   * Dispatch/Broadcast Runner to all listeners added to the queue.
   * @param {...any} params - (optional) parameters to pass to each listener
   */
  /*  eslint-enable jsdoc/require-param, jsdoc/check-param-names */
  emit(t, e, i, s, n, o, a, h) {
    if (arguments.length > 8)
      throw new Error("max arguments reached");
    const { name: l, items: c } = this;
    this._aliasCount++;
    for (let u = 0, d = c.length; u < d; u++)
      c[u][l](t, e, i, s, n, o, a, h);
    return c === this.items && this._aliasCount--, this;
  }
  ensureNonAliasedItems() {
    this._aliasCount > 0 && this.items.length > 1 && (this._aliasCount = 0, this.items = this.items.slice(0));
  }
  /**
   * Add a listener to the Runner
   *
   * Runners do not need to have scope or functions passed to them.
   * All that is required is to pass the listening object and ensure that it has contains a function that has the same name
   * as the name provided to the Runner when it was created.
   *
   * E.g. A listener passed to this Runner will require a 'complete' function.
   *
   * ```js
   * import { Runner } from '@pixi/runner';
   *
   * const complete = new Runner('complete');
   * ```
   *
   * The scope used will be the object itself.
   * @param {any} item - The object that will be listening.
   */
  add(t) {
    return t[this._name] && (this.ensureNonAliasedItems(), this.remove(t), this.items.push(t)), this;
  }
  /**
   * Remove a single listener from the dispatch queue.
   * @param {any} item - The listener that you would like to remove.
   */
  remove(t) {
    const e = this.items.indexOf(t);
    return e !== -1 && (this.ensureNonAliasedItems(), this.items.splice(e, 1)), this;
  }
  /**
   * Check to see if the listener is already in the Runner
   * @param {any} item - The listener that you would like to check.
   */
  contains(t) {
    return this.items.includes(t);
  }
  /** Remove all listeners from the Runner */
  removeAll() {
    return this.ensureNonAliasedItems(), this.items.length = 0, this;
  }
  /** Remove all references, don't use after this. */
  destroy() {
    this.removeAll(), this.items = null, this._name = null;
  }
  /**
   * `true` if there are no this Runner contains no listeners
   * @readonly
   */
  get empty() {
    return this.items.length === 0;
  }
  /**
   * The name of the runner.
   * @readonly
   */
  get name() {
    return this._name;
  }
}
Object.defineProperties(ce.prototype, {
  /**
   * Alias for `emit`
   * @memberof PIXI.Runner#
   * @method dispatch
   * @see PIXI.Runner#emit
   */
  dispatch: { value: ce.prototype.emit },
  /**
   * Alias for `emit`
   * @memberof PIXI.Runner#
   * @method run
   * @see PIXI.Runner#emit
   */
  run: { value: ce.prototype.emit }
});
class Pi {
  /**
   * @param width - Width of the resource
   * @param height - Height of the resource
   */
  constructor(t = 0, e = 0) {
    this._width = t, this._height = e, this.destroyed = !1, this.internal = !1, this.onResize = new ce("setRealSize"), this.onUpdate = new ce("update"), this.onError = new ce("onError");
  }
  /**
   * Bind to a parent BaseTexture
   * @param baseTexture - Parent texture
   */
  bind(t) {
    this.onResize.add(t), this.onUpdate.add(t), this.onError.add(t), (this._width || this._height) && this.onResize.emit(this._width, this._height);
  }
  /**
   * Unbind to a parent BaseTexture
   * @param baseTexture - Parent texture
   */
  unbind(t) {
    this.onResize.remove(t), this.onUpdate.remove(t), this.onError.remove(t);
  }
  /**
   * Trigger a resize event
   * @param width - X dimension
   * @param height - Y dimension
   */
  resize(t, e) {
    (t !== this._width || e !== this._height) && (this._width = t, this._height = e, this.onResize.emit(t, e));
  }
  /**
   * Has been validated
   * @readonly
   */
  get valid() {
    return !!this._width && !!this._height;
  }
  /** Has been updated trigger event. */
  update() {
    this.destroyed || this.onUpdate.emit();
  }
  /**
   * This can be overridden to start preloading a resource
   * or do any other prepare step.
   * @protected
   * @returns Handle the validate event
   */
  load() {
    return Promise.resolve(this);
  }
  /**
   * The width of the resource.
   * @readonly
   */
  get width() {
    return this._width;
  }
  /**
   * The height of the resource.
   * @readonly
   */
  get height() {
    return this._height;
  }
  /**
   * Set the style, optional to override
   * @param _renderer - yeah, renderer!
   * @param _baseTexture - the texture
   * @param _glTexture - texture instance for this webgl context
   * @returns - `true` is success
   */
  style(t, e, i) {
    return !1;
  }
  /** Clean up anything, this happens when destroying is ready. */
  dispose() {
  }
  /**
   * Call when destroying resource, unbind any BaseTexture object
   * before calling this method, as reference counts are maintained
   * internally.
   */
  destroy() {
    this.destroyed || (this.destroyed = !0, this.dispose(), this.onError.removeAll(), this.onError = null, this.onResize.removeAll(), this.onResize = null, this.onUpdate.removeAll(), this.onUpdate = null);
  }
  /**
   * Abstract, used to auto-detect resource type.
   * @param {*} _source - The source object
   * @param {string} _extension - The extension of source, if set
   */
  static test(t, e) {
    return !1;
  }
}
class $s extends Pi {
  /**
   * @param source - Source buffer
   * @param options - Options
   * @param {number} options.width - Width of the texture
   * @param {number} options.height - Height of the texture
   * @param {1|2|4|8} [options.unpackAlignment=4] - The alignment of the pixel rows.
   */
  constructor(t, e) {
    const { width: i, height: s } = e || {};
    if (!i || !s)
      throw new Error("BufferResource width or height invalid");
    super(i, s), this.data = t, this.unpackAlignment = e.unpackAlignment ?? 4;
  }
  /**
   * Upload the texture to the GPU.
   * @param renderer - Upload to the renderer
   * @param baseTexture - Reference to parent texture
   * @param glTexture - glTexture
   * @returns - true is success
   */
  upload(t, e, i) {
    const s = t.gl;
    s.pixelStorei(s.UNPACK_ALIGNMENT, this.unpackAlignment), s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e.alphaMode === Ht.UNPACK);
    const n = e.realWidth, o = e.realHeight;
    return i.width === n && i.height === o ? s.texSubImage2D(
      e.target,
      0,
      0,
      0,
      n,
      o,
      e.format,
      i.type,
      this.data
    ) : (i.width = n, i.height = o, s.texImage2D(
      e.target,
      0,
      i.internalFormat,
      n,
      o,
      0,
      e.format,
      i.type,
      this.data
    )), !0;
  }
  /** Destroy and don't use after this. */
  dispose() {
    this.data = null;
  }
  /**
   * Used to auto-detect the type of resource.
   * @param {*} source - The source object
   * @returns {boolean} `true` if buffer source
   */
  static test(t) {
    return t === null || t instanceof Int8Array || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array;
  }
}
const Xm = {
  scaleMode: Pe.NEAREST,
  alphaMode: Ht.NPM
}, _o = class Nr extends Bi {
  /**
   * @param {PIXI.Resource|HTMLImageElement|HTMLVideoElement|ImageBitmap|ICanvas|string} [resource=null] -
   *        The current resource to use, for things that aren't Resource objects, will be converted
   *        into a Resource.
   * @param options - Collection of options, default options inherited from {@link PIXI.BaseTexture.defaultOptions}.
   * @param {PIXI.MIPMAP_MODES} [options.mipmap] - If mipmapping is enabled for texture
   * @param {number} [options.anisotropicLevel] - Anisotropic filtering level of texture
   * @param {PIXI.WRAP_MODES} [options.wrapMode] - Wrap mode for textures
   * @param {PIXI.SCALE_MODES} [options.scaleMode] - Default scale mode, linear, nearest
   * @param {PIXI.FORMATS} [options.format] - GL format type
   * @param {PIXI.TYPES} [options.type] - GL data type
   * @param {PIXI.TARGETS} [options.target] - GL texture target
   * @param {PIXI.ALPHA_MODES} [options.alphaMode] - Pre multiply the image alpha
   * @param {number} [options.width=0] - Width of the texture
   * @param {number} [options.height=0] - Height of the texture
   * @param {number} [options.resolution=PIXI.settings.RESOLUTION] - Resolution of the base texture
   * @param {object} [options.resourceOptions] - Optional resource options,
   *        see {@link PIXI.autoDetectResource autoDetectResource}
   */
  constructor(t = null, e = null) {
    super(), e = Object.assign({}, Nr.defaultOptions, e);
    const {
      alphaMode: i,
      mipmap: s,
      anisotropicLevel: n,
      scaleMode: o,
      width: a,
      height: h,
      wrapMode: l,
      format: c,
      type: u,
      target: d,
      resolution: f,
      resourceOptions: p
    } = e;
    t && !(t instanceof Pi) && (t = mc(t, p), t.internal = !0), this.resolution = f || H.RESOLUTION, this.width = Math.round((a || 0) * this.resolution) / this.resolution, this.height = Math.round((h || 0) * this.resolution) / this.resolution, this._mipmap = s, this.anisotropicLevel = n, this._wrapMode = l, this._scaleMode = o, this.format = c, this.type = u, this.target = d, this.alphaMode = i, this.uid = br(), this.touched = 0, this.isPowerOfTwo = !1, this._refreshPOT(), this._glTextures = {}, this.dirtyId = 0, this.dirtyStyleId = 0, this.cacheId = null, this.valid = a > 0 && h > 0, this.textureCacheIds = [], this.destroyed = !1, this.resource = null, this._batchEnabled = 0, this._batchLocation = 0, this.parentTextureArray = null, this.setResource(t);
  }
  /**
   * Pixel width of the source of this texture
   * @readonly
   */
  get realWidth() {
    return Math.round(this.width * this.resolution);
  }
  /**
   * Pixel height of the source of this texture
   * @readonly
   */
  get realHeight() {
    return Math.round(this.height * this.resolution);
  }
  /**
   * Mipmap mode of the texture, affects downscaled images
   * @default PIXI.MIPMAP_MODES.POW2
   */
  get mipmap() {
    return this._mipmap;
  }
  set mipmap(t) {
    this._mipmap !== t && (this._mipmap = t, this.dirtyStyleId++);
  }
  /**
   * The scale mode to apply when scaling this texture
   * @default PIXI.SCALE_MODES.LINEAR
   */
  get scaleMode() {
    return this._scaleMode;
  }
  set scaleMode(t) {
    this._scaleMode !== t && (this._scaleMode = t, this.dirtyStyleId++);
  }
  /**
   * How the texture wraps
   * @default PIXI.WRAP_MODES.CLAMP
   */
  get wrapMode() {
    return this._wrapMode;
  }
  set wrapMode(t) {
    this._wrapMode !== t && (this._wrapMode = t, this.dirtyStyleId++);
  }
  /**
   * Changes style options of BaseTexture
   * @param scaleMode - Pixi scalemode
   * @param mipmap - enable mipmaps
   * @returns - this
   */
  setStyle(t, e) {
    let i;
    return t !== void 0 && t !== this.scaleMode && (this.scaleMode = t, i = !0), e !== void 0 && e !== this.mipmap && (this.mipmap = e, i = !0), i && this.dirtyStyleId++, this;
  }
  /**
   * Changes w/h/resolution. Texture becomes valid if width and height are greater than zero.
   * @param desiredWidth - Desired visual width
   * @param desiredHeight - Desired visual height
   * @param resolution - Optionally set resolution
   * @returns - this
   */
  setSize(t, e, i) {
    return i = i || this.resolution, this.setRealSize(t * i, e * i, i);
  }
  /**
   * Sets real size of baseTexture, preserves current resolution.
   * @param realWidth - Full rendered width
   * @param realHeight - Full rendered height
   * @param resolution - Optionally set resolution
   * @returns - this
   */
  setRealSize(t, e, i) {
    return this.resolution = i || this.resolution, this.width = Math.round(t) / this.resolution, this.height = Math.round(e) / this.resolution, this._refreshPOT(), this.update(), this;
  }
  /**
   * Refresh check for isPowerOfTwo texture based on size
   * @private
   */
  _refreshPOT() {
    this.isPowerOfTwo = _h(this.realWidth) && _h(this.realHeight);
  }
  /**
   * Changes resolution
   * @param resolution - res
   * @returns - this
   */
  setResolution(t) {
    const e = this.resolution;
    return e === t ? this : (this.resolution = t, this.valid && (this.width = Math.round(this.width * e) / t, this.height = Math.round(this.height * e) / t, this.emit("update", this)), this._refreshPOT(), this);
  }
  /**
   * Sets the resource if it wasn't set. Throws error if resource already present
   * @param resource - that is managing this BaseTexture
   * @returns - this
   */
  setResource(t) {
    if (this.resource === t)
      return this;
    if (this.resource)
      throw new Error("Resource can be set only once");
    return t.bind(this), this.resource = t, this;
  }
  /** Invalidates the object. Texture becomes valid if width and height are greater than zero. */
  update() {
    this.valid ? (this.dirtyId++, this.dirtyStyleId++, this.emit("update", this)) : this.width > 0 && this.height > 0 && (this.valid = !0, this.emit("loaded", this), this.emit("update", this));
  }
  /**
   * Handle errors with resources.
   * @private
   * @param event - Error event emitted.
   */
  onError(t) {
    this.emit("error", this, t);
  }
  /**
   * Destroys this base texture.
   * The method stops if resource doesn't want this texture to be destroyed.
   * Removes texture from all caches.
   * @fires PIXI.BaseTexture#destroyed
   */
  destroy() {
    this.resource && (this.resource.unbind(this), this.resource.internal && this.resource.destroy(), this.resource = null), this.cacheId && (delete Ne[this.cacheId], delete ge[this.cacheId], this.cacheId = null), this.valid = !1, this.dispose(), Nr.removeFromCache(this), this.textureCacheIds = null, this.destroyed = !0, this.emit("destroyed", this), this.removeAllListeners();
  }
  /**
   * Frees the texture from WebGL memory without destroying this texture object.
   * This means you can still use the texture later which will upload it to GPU
   * memory again.
   * @fires PIXI.BaseTexture#dispose
   */
  dispose() {
    this.emit("dispose", this);
  }
  /** Utility function for BaseTexture|Texture cast. */
  castToBaseTexture() {
    return this;
  }
  /**
   * Helper function that creates a base texture based on the source you provide.
   * The source can be - image url, image element, canvas element. If the
   * source is an image url or an image element and not in the base texture
   * cache, it will be created and loaded.
   * @static
   * @param {HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas|string|string[]} source - The
   *        source to create base texture from.
   * @param options - See {@link PIXI.BaseTexture}'s constructor for options.
   * @param {string} [options.pixiIdPrefix=pixiid] - If a source has no id, this is the prefix of the generated id
   * @param {boolean} [strict] - Enforce strict-mode, see {@link PIXI.settings.STRICT_TEXTURE_CACHE}.
   * @returns {PIXI.BaseTexture} The new base texture.
   */
  static from(t, e, i = H.STRICT_TEXTURE_CACHE) {
    const s = typeof t == "string";
    let n = null;
    if (s)
      n = t;
    else {
      if (!t._pixiId) {
        const a = (e == null ? void 0 : e.pixiIdPrefix) || "pixiid";
        t._pixiId = `${a}_${br()}`;
      }
      n = t._pixiId;
    }
    let o = Ne[n];
    if (s && i && !o)
      throw new Error(`The cacheId "${n}" does not exist in BaseTextureCache.`);
    return o || (o = new Nr(t, e), o.cacheId = n, Nr.addToCache(o, n)), o;
  }
  /**
   * Create a new Texture with a BufferResource from a typed array.
   * @param buffer - The optional array to use. If no data is provided, a new Float32Array is created.
   * @param width - Width of the resource
   * @param height - Height of the resource
   * @param options - See {@link PIXI.BaseTexture}'s constructor for options.
   *        Default properties are different from the constructor's defaults.
   * @param {PIXI.FORMATS} [options.format] - The format is not given, the type is inferred from the
   *        type of the buffer: `RGBA` if Float32Array, Int8Array, Uint8Array, or Uint8ClampedArray,
   *        otherwise `RGBA_INTEGER`.
   * @param {PIXI.TYPES} [options.type] - The type is not given, the type is inferred from the
   *        type of the buffer. Maps Float32Array to `FLOAT`, Int32Array to `INT`, Uint32Array to
   *        `UNSIGNED_INT`, Int16Array to `SHORT`, Uint16Array to `UNSIGNED_SHORT`, Int8Array to `BYTE`,
   *        Uint8Array/Uint8ClampedArray to `UNSIGNED_BYTE`.
   * @param {PIXI.ALPHA_MODES} [options.alphaMode=PIXI.ALPHA_MODES.NPM]
   * @param {PIXI.SCALE_MODES} [options.scaleMode=PIXI.SCALE_MODES.NEAREST]
   * @returns - The resulting new BaseTexture
   */
  static fromBuffer(t, e, i, s) {
    t = t || new Float32Array(e * i * 4);
    const n = new $s(t, { width: e, height: i, ...s == null ? void 0 : s.resourceOptions });
    let o, a;
    return t instanceof Float32Array ? (o = F.RGBA, a = $.FLOAT) : t instanceof Int32Array ? (o = F.RGBA_INTEGER, a = $.INT) : t instanceof Uint32Array ? (o = F.RGBA_INTEGER, a = $.UNSIGNED_INT) : t instanceof Int16Array ? (o = F.RGBA_INTEGER, a = $.SHORT) : t instanceof Uint16Array ? (o = F.RGBA_INTEGER, a = $.UNSIGNED_SHORT) : t instanceof Int8Array ? (o = F.RGBA, a = $.BYTE) : (o = F.RGBA, a = $.UNSIGNED_BYTE), n.internal = !0, new Nr(n, Object.assign({}, Xm, { type: a, format: o }, s));
  }
  /**
   * Adds a BaseTexture to the global BaseTextureCache. This cache is shared across the whole PIXI object.
   * @param {PIXI.BaseTexture} baseTexture - The BaseTexture to add to the cache.
   * @param {string} id - The id that the BaseTexture will be stored against.
   */
  static addToCache(t, e) {
    e && (t.textureCacheIds.includes(e) || t.textureCacheIds.push(e), Ne[e] && Ne[e] !== t && console.warn(`BaseTexture added to the cache with an id [${e}] that already had an entry`), Ne[e] = t);
  }
  /**
   * Remove a BaseTexture from the global BaseTextureCache.
   * @param {string|PIXI.BaseTexture} baseTexture - id of a BaseTexture to be removed, or a BaseTexture instance itself.
   * @returns {PIXI.BaseTexture|null} The BaseTexture that was removed.
   */
  static removeFromCache(t) {
    if (typeof t == "string") {
      const e = Ne[t];
      if (e) {
        const i = e.textureCacheIds.indexOf(t);
        return i > -1 && e.textureCacheIds.splice(i, 1), delete Ne[t], e;
      }
    } else if (t != null && t.textureCacheIds) {
      for (let e = 0; e < t.textureCacheIds.length; ++e)
        delete Ne[t.textureCacheIds[e]];
      return t.textureCacheIds.length = 0, t;
    }
    return null;
  }
};
_o.defaultOptions = {
  /**
   * If mipmapping is enabled for texture.
   * @type {PIXI.MIPMAP_MODES}
   * @default PIXI.MIPMAP_MODES.POW2
   */
  mipmap: we.POW2,
  /** Anisotropic filtering level of texture */
  anisotropicLevel: 0,
  /**
   * Default scale mode, linear, nearest.
   * @type {PIXI.SCALE_MODES}
   * @default PIXI.SCALE_MODES.LINEAR
   */
  scaleMode: Pe.LINEAR,
  /**
   * Wrap mode for textures.
   * @type {PIXI.WRAP_MODES}
   * @default PIXI.WRAP_MODES.CLAMP
   */
  wrapMode: Ye.CLAMP,
  /**
   * Pre multiply the image alpha
   * @type {PIXI.ALPHA_MODES}
   * @default PIXI.ALPHA_MODES.UNPACK
   */
  alphaMode: Ht.UNPACK,
  /**
   * GL texture target
   * @type {PIXI.TARGETS}
   * @default PIXI.TARGETS.TEXTURE_2D
   */
  target: Wr.TEXTURE_2D,
  /**
   * GL format type
   * @type {PIXI.FORMATS}
   * @default PIXI.FORMATS.RGBA
   */
  format: F.RGBA,
  /**
   * GL data type
   * @type {PIXI.TYPES}
   * @default PIXI.TYPES.UNSIGNED_BYTE
   */
  type: $.UNSIGNED_BYTE
}, /** Global number of the texture batch, used by multi-texture renderers. */
_o._globalBatch = 0;
let J = _o;
class vo {
  constructor() {
    this.texArray = null, this.blend = 0, this.type = be.TRIANGLES, this.start = 0, this.size = 0, this.data = null;
  }
}
let zm = 0;
class At {
  /**
   * @param {PIXI.IArrayBuffer} data - the data to store in the buffer.
   * @param _static - `true` for static buffer
   * @param index - `true` for index buffer
   */
  constructor(t, e = !0, i = !1) {
    this.data = t || new Float32Array(1), this._glBuffers = {}, this._updateID = 0, this.index = i, this.static = e, this.id = zm++, this.disposeRunner = new ce("disposeBuffer");
  }
  // TODO could explore flagging only a partial upload?
  /**
   * Flags this buffer as requiring an upload to the GPU.
   * @param {PIXI.IArrayBuffer|number[]} [data] - the data to update in the buffer.
   */
  update(t) {
    t instanceof Array && (t = new Float32Array(t)), this.data = t || this.data, this._updateID++;
  }
  /** Disposes WebGL resources that are connected to this geometry. */
  dispose() {
    this.disposeRunner.emit(this, !1);
  }
  /** Destroys the buffer. */
  destroy() {
    this.dispose(), this.data = null;
  }
  /**
   * Flags whether this is an index buffer.
   *
   * Index buffers are of type `ELEMENT_ARRAY_BUFFER`. Note that setting this property to false will make
   * the buffer of type `ARRAY_BUFFER`.
   *
   * For backwards compatibility.
   */
  set index(t) {
    this.type = t ? Te.ELEMENT_ARRAY_BUFFER : Te.ARRAY_BUFFER;
  }
  get index() {
    return this.type === Te.ELEMENT_ARRAY_BUFFER;
  }
  /**
   * Helper function that creates a buffer based on an array or TypedArray
   * @param {ArrayBufferView | number[]} data - the TypedArray that the buffer will store. If this is a regular Array it will be converted to a Float32Array.
   * @returns - A new Buffer based on the data provided.
   */
  static from(t) {
    return t instanceof Array && (t = new Float32Array(t)), new At(t);
  }
}
class Ps {
  /**
   * @param buffer - the id of the buffer that this attribute will look for
   * @param size - the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2.
   * @param normalized - should the data be normalized.
   * @param {PIXI.TYPES} [type=PIXI.TYPES.FLOAT] - what type of number is the attribute. Check {@link PIXI.TYPES} to see the ones available
   * @param [stride=0] - How far apart, in bytes, the start of each value is. (used for interleaving data)
   * @param [start=0] - How far into the array to start reading values (used for interleaving data)
   * @param [instance=false] - Whether the geometry is instanced.
   * @param [divisor=1] - Divisor to use when doing instanced rendering
   */
  constructor(t, e = 0, i = !1, s = $.FLOAT, n, o, a, h = 1) {
    this.buffer = t, this.size = e, this.normalized = i, this.type = s, this.stride = n, this.start = o, this.instance = a, this.divisor = h;
  }
  /** Destroys the Attribute. */
  destroy() {
    this.buffer = null;
  }
  /**
   * Helper function that creates an Attribute based on the information provided
   * @param buffer - the id of the buffer that this attribute will look for
   * @param [size=0] - the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2
   * @param [normalized=false] - should the data be normalized.
   * @param [type=PIXI.TYPES.FLOAT] - what type of number is the attribute. Check {@link PIXI.TYPES} to see the ones available
   * @param [stride=0] - How far apart, in bytes, the start of each value is. (used for interleaving data)
   * @returns - A new {@link PIXI.Attribute} based on the information provided
   */
  static from(t, e, i, s, n) {
    return new Ps(t, e, i, s, n);
  }
}
const Wm = {
  Float32Array,
  Uint32Array,
  Int32Array,
  Uint8Array
};
function jm(r, t) {
  let e = 0, i = 0;
  const s = {};
  for (let h = 0; h < r.length; h++)
    i += t[h], e += r[h].length;
  const n = new ArrayBuffer(e * 4);
  let o = null, a = 0;
  for (let h = 0; h < r.length; h++) {
    const l = t[h], c = r[h], u = pc(c);
    s[u] || (s[u] = new Wm[u](n)), o = s[u];
    for (let d = 0; d < c.length; d++) {
      const f = (d / l | 0) * i + a, p = d % l;
      o[f + p] = c[d];
    }
    a += l;
  }
  return new Float32Array(n);
}
const Ah = { 5126: 4, 5123: 2, 5121: 1 };
let $m = 0;
const Ym = {
  Float32Array,
  Uint32Array,
  Int32Array,
  Uint8Array,
  Uint16Array
};
class Ke {
  /**
   * @param buffers - An array of buffers. optional.
   * @param attributes - Of the geometry, optional structure of the attributes layout
   */
  constructor(t = [], e = {}) {
    this.buffers = t, this.indexBuffer = null, this.attributes = e, this.glVertexArrayObjects = {}, this.id = $m++, this.instanced = !1, this.instanceCount = 1, this.disposeRunner = new ce("disposeGeometry"), this.refCount = 0;
  }
  /**
   *
   * Adds an attribute to the geometry
   * Note: `stride` and `start` should be `undefined` if you dont know them, not 0!
   * @param id - the name of the attribute (matching up to a shader)
   * @param {PIXI.Buffer|number[]} buffer - the buffer that holds the data of the attribute . You can also provide an Array and a buffer will be created from it.
   * @param size - the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2
   * @param normalized - should the data be normalized.
   * @param [type=PIXI.TYPES.FLOAT] - what type of number is the attribute. Check {@link PIXI.TYPES} to see the ones available
   * @param [stride=0] - How far apart, in bytes, the start of each value is. (used for interleaving data)
   * @param [start=0] - How far into the array to start reading values (used for interleaving data)
   * @param instance - Instancing flag
   * @returns - Returns self, useful for chaining.
   */
  addAttribute(t, e, i = 0, s = !1, n, o, a, h = !1) {
    if (!e)
      throw new Error("You must pass a buffer when creating an attribute");
    e instanceof At || (e instanceof Array && (e = new Float32Array(e)), e = new At(e));
    const l = t.split("|");
    if (l.length > 1) {
      for (let u = 0; u < l.length; u++)
        this.addAttribute(l[u], e, i, s, n);
      return this;
    }
    let c = this.buffers.indexOf(e);
    return c === -1 && (this.buffers.push(e), c = this.buffers.length - 1), this.attributes[t] = new Ps(c, i, s, n, o, a, h), this.instanced = this.instanced || h, this;
  }
  /**
   * Returns the requested attribute.
   * @param id - The name of the attribute required
   * @returns - The attribute requested.
   */
  getAttribute(t) {
    return this.attributes[t];
  }
  /**
   * Returns the requested buffer.
   * @param id - The name of the buffer required.
   * @returns - The buffer requested.
   */
  getBuffer(t) {
    return this.buffers[this.getAttribute(t).buffer];
  }
  /**
   *
   * Adds an index buffer to the geometry
   * The index buffer contains integers, three for each triangle in the geometry, which reference the various attribute buffers (position, colour, UV coordinates, other UV coordinates, normal, …). There is only ONE index buffer.
   * @param {PIXI.Buffer|number[]} [buffer] - The buffer that holds the data of the index buffer. You can also provide an Array and a buffer will be created from it.
   * @returns - Returns self, useful for chaining.
   */
  addIndex(t) {
    return t instanceof At || (t instanceof Array && (t = new Uint16Array(t)), t = new At(t)), t.type = Te.ELEMENT_ARRAY_BUFFER, this.indexBuffer = t, this.buffers.includes(t) || this.buffers.push(t), this;
  }
  /**
   * Returns the index buffer
   * @returns - The index buffer.
   */
  getIndex() {
    return this.indexBuffer;
  }
  /**
   * This function modifies the structure so that all current attributes become interleaved into a single buffer
   * This can be useful if your model remains static as it offers a little performance boost
   * @returns - Returns self, useful for chaining.
   */
  interleave() {
    if (this.buffers.length === 1 || this.buffers.length === 2 && this.indexBuffer)
      return this;
    const t = [], e = [], i = new At();
    let s;
    for (s in this.attributes) {
      const n = this.attributes[s], o = this.buffers[n.buffer];
      t.push(o.data), e.push(n.size * Ah[n.type] / 4), n.buffer = 0;
    }
    for (i.data = jm(t, e), s = 0; s < this.buffers.length; s++)
      this.buffers[s] !== this.indexBuffer && this.buffers[s].destroy();
    return this.buffers = [i], this.indexBuffer && this.buffers.push(this.indexBuffer), this;
  }
  /** Get the size of the geometries, in vertices. */
  getSize() {
    for (const t in this.attributes) {
      const e = this.attributes[t];
      return this.buffers[e.buffer].data.length / (e.stride / 4 || e.size);
    }
    return 0;
  }
  /** Disposes WebGL resources that are connected to this geometry. */
  dispose() {
    this.disposeRunner.emit(this, !1);
  }
  /** Destroys the geometry. */
  destroy() {
    this.dispose(), this.buffers = null, this.indexBuffer = null, this.attributes = null;
  }
  /**
   * Returns a clone of the geometry.
   * @returns - A new clone of this geometry.
   */
  clone() {
    const t = new Ke();
    for (let e = 0; e < this.buffers.length; e++)
      t.buffers[e] = new At(this.buffers[e].data.slice(0));
    for (const e in this.attributes) {
      const i = this.attributes[e];
      t.attributes[e] = new Ps(
        i.buffer,
        i.size,
        i.normalized,
        i.type,
        i.stride,
        i.start,
        i.instance
      );
    }
    return this.indexBuffer && (t.indexBuffer = t.buffers[this.buffers.indexOf(this.indexBuffer)], t.indexBuffer.type = Te.ELEMENT_ARRAY_BUFFER), t;
  }
  /**
   * Merges an array of geometries into a new single one.
   *
   * Geometry attribute styles must match for this operation to work.
   * @param geometries - array of geometries to merge
   * @returns - Shiny new geometry!
   */
  static merge(t) {
    const e = new Ke(), i = [], s = [], n = [];
    let o;
    for (let a = 0; a < t.length; a++) {
      o = t[a];
      for (let h = 0; h < o.buffers.length; h++)
        s[h] = s[h] || 0, s[h] += o.buffers[h].data.length, n[h] = 0;
    }
    for (let a = 0; a < o.buffers.length; a++)
      i[a] = new Ym[pc(o.buffers[a].data)](s[a]), e.buffers[a] = new At(i[a]);
    for (let a = 0; a < t.length; a++) {
      o = t[a];
      for (let h = 0; h < o.buffers.length; h++)
        i[h].set(o.buffers[h].data, n[h]), n[h] += o.buffers[h].data.length;
    }
    if (e.attributes = o.attributes, o.indexBuffer) {
      e.indexBuffer = e.buffers[o.buffers.indexOf(o.indexBuffer)], e.indexBuffer.type = Te.ELEMENT_ARRAY_BUFFER;
      let a = 0, h = 0, l = 0, c = 0;
      for (let u = 0; u < o.buffers.length; u++)
        if (o.buffers[u] !== o.indexBuffer) {
          c = u;
          break;
        }
      for (const u in o.attributes) {
        const d = o.attributes[u];
        (d.buffer | 0) === c && (h += d.size * Ah[d.type] / 4);
      }
      for (let u = 0; u < t.length; u++) {
        const d = t[u].indexBuffer.data;
        for (let f = 0; f < d.length; f++)
          e.indexBuffer.data[f + l] += a;
        a += t[u].buffers[c].data.length / h, l += d.length;
      }
    }
    return e;
  }
}
class gc extends Ke {
  /**
   * @param {boolean} [_static=false] - Optimization flag, where `false`
   *        is updated every frame, `true` doesn't change frame-to-frame.
   */
  constructor(t = !1) {
    super(), this._buffer = new At(null, t, !1), this._indexBuffer = new At(null, t, !0), this.addAttribute("aVertexPosition", this._buffer, 2, !1, $.FLOAT).addAttribute("aTextureCoord", this._buffer, 2, !1, $.FLOAT).addAttribute("aColor", this._buffer, 4, !0, $.UNSIGNED_BYTE).addAttribute("aTextureId", this._buffer, 1, !0, $.FLOAT).addIndex(this._indexBuffer);
  }
}
const Ms = Math.PI * 2, qm = 180 / Math.PI, Km = Math.PI / 180;
var Ot = /* @__PURE__ */ ((r) => (r[r.POLY = 0] = "POLY", r[r.RECT = 1] = "RECT", r[r.CIRC = 2] = "CIRC", r[r.ELIP = 3] = "ELIP", r[r.RREC = 4] = "RREC", r))(Ot || {});
class lt {
  /**
   * Creates a new `Point`
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(t = 0, e = 0) {
    this.x = 0, this.y = 0, this.x = t, this.y = e;
  }
  /**
   * Creates a clone of this point
   * @returns A clone of this point
   */
  clone() {
    return new lt(this.x, this.y);
  }
  /**
   * Copies `x` and `y` from the given point into this point
   * @param p - The point to copy from
   * @returns The point instance itself
   */
  copyFrom(t) {
    return this.set(t.x, t.y), this;
  }
  /**
   * Copies this point's x and y into the given point (`p`).
   * @param p - The point to copy to. Can be any of type that is or extends `IPointData`
   * @returns The point (`p`) with values updated
   */
  copyTo(t) {
    return t.set(this.x, this.y), t;
  }
  /**
   * Accepts another point (`p`) and returns `true` if the given point is equal to this point
   * @param p - The point to check
   * @returns Returns `true` if both `x` and `y` are equal
   */
  equals(t) {
    return t.x === this.x && t.y === this.y;
  }
  /**
   * Sets the point to a new `x` and `y` position.
   * If `y` is omitted, both `x` and `y` will be set to `x`.
   * @param {number} [x=0] - position of the point on the `x` axis
   * @param {number} [y=x] - position of the point on the `y` axis
   * @returns The point instance itself
   */
  set(t = 0, e = t) {
    return this.x = t, this.y = e, this;
  }
}
lt.prototype.toString = function() {
  return `[@pixi/math:Point x=${this.x} y=${this.y}]`;
};
const Wi = [new lt(), new lt(), new lt(), new lt()];
class tt {
  /**
   * @param x - The X coordinate of the upper-left corner of the rectangle
   * @param y - The Y coordinate of the upper-left corner of the rectangle
   * @param width - The overall width of the rectangle
   * @param height - The overall height of the rectangle
   */
  constructor(t = 0, e = 0, i = 0, s = 0) {
    this.x = Number(t), this.y = Number(e), this.width = Number(i), this.height = Number(s), this.type = Ot.RECT;
  }
  /** Returns the left edge of the rectangle. */
  get left() {
    return this.x;
  }
  /** Returns the right edge of the rectangle. */
  get right() {
    return this.x + this.width;
  }
  /** Returns the top edge of the rectangle. */
  get top() {
    return this.y;
  }
  /** Returns the bottom edge of the rectangle. */
  get bottom() {
    return this.y + this.height;
  }
  /** A constant empty rectangle. */
  static get EMPTY() {
    return new tt(0, 0, 0, 0);
  }
  /**
   * Creates a clone of this Rectangle
   * @returns a copy of the rectangle
   */
  clone() {
    return new tt(this.x, this.y, this.width, this.height);
  }
  /**
   * Copies another rectangle to this one.
   * @param rectangle - The rectangle to copy from.
   * @returns Returns itself.
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
  }
  /**
   * Copies this rectangle to another one.
   * @param rectangle - The rectangle to copy to.
   * @returns Returns given parameter.
   */
  copyTo(t) {
    return t.x = this.x, t.y = this.y, t.width = this.width, t.height = this.height, t;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this Rectangle
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Rectangle
   */
  contains(t, e) {
    return this.width <= 0 || this.height <= 0 ? !1 : t >= this.x && t < this.x + this.width && e >= this.y && e < this.y + this.height;
  }
  /**
   * Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
   * Returns true only if the area of the intersection is >0, this means that Rectangles
   * sharing a side are not overlapping. Another side effect is that an arealess rectangle
   * (width or height equal to zero) can't intersect any other rectangle.
   * @param {Rectangle} other - The Rectangle to intersect with `this`.
   * @param {Matrix} transform - The transformation matrix of `other`.
   * @returns {boolean} A value of `true` if the transformed `other` Rectangle intersects with `this`; otherwise `false`.
   */
  intersects(t, e) {
    if (!e) {
      const I = this.x < t.x ? t.x : this.x;
      if ((this.right > t.right ? t.right : this.right) <= I)
        return !1;
      const S = this.y < t.y ? t.y : this.y;
      return (this.bottom > t.bottom ? t.bottom : this.bottom) > S;
    }
    const i = this.left, s = this.right, n = this.top, o = this.bottom;
    if (s <= i || o <= n)
      return !1;
    const a = Wi[0].set(t.left, t.top), h = Wi[1].set(t.left, t.bottom), l = Wi[2].set(t.right, t.top), c = Wi[3].set(t.right, t.bottom);
    if (l.x <= a.x || h.y <= a.y)
      return !1;
    const u = Math.sign(e.a * e.d - e.b * e.c);
    if (u === 0 || (e.apply(a, a), e.apply(h, h), e.apply(l, l), e.apply(c, c), Math.max(a.x, h.x, l.x, c.x) <= i || Math.min(a.x, h.x, l.x, c.x) >= s || Math.max(a.y, h.y, l.y, c.y) <= n || Math.min(a.y, h.y, l.y, c.y) >= o))
      return !1;
    const d = u * (h.y - a.y), f = u * (a.x - h.x), p = d * i + f * n, m = d * s + f * n, g = d * i + f * o, y = d * s + f * o;
    if (Math.max(p, m, g, y) <= d * a.x + f * a.y || Math.min(p, m, g, y) >= d * c.x + f * c.y)
      return !1;
    const v = u * (a.y - l.y), _ = u * (l.x - a.x), x = v * i + _ * n, T = v * s + _ * n, C = v * i + _ * o, w = v * s + _ * o;
    return !(Math.max(x, T, C, w) <= v * a.x + _ * a.y || Math.min(x, T, C, w) >= v * c.x + _ * c.y);
  }
  /**
   * Pads the rectangle making it grow in all directions.
   * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
   * @param paddingX - The horizontal padding amount.
   * @param paddingY - The vertical padding amount.
   * @returns Returns itself.
   */
  pad(t = 0, e = t) {
    return this.x -= t, this.y -= e, this.width += t * 2, this.height += e * 2, this;
  }
  /**
   * Fits this rectangle around the passed one.
   * @param rectangle - The rectangle to fit.
   * @returns Returns itself.
   */
  fit(t) {
    const e = Math.max(this.x, t.x), i = Math.min(this.x + this.width, t.x + t.width), s = Math.max(this.y, t.y), n = Math.min(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = Math.max(i - e, 0), this.y = s, this.height = Math.max(n - s, 0), this;
  }
  /**
   * Enlarges rectangle that way its corners lie on grid
   * @param resolution - resolution
   * @param eps - precision
   * @returns Returns itself.
   */
  ceil(t = 1, e = 1e-3) {
    const i = Math.ceil((this.x + this.width - e) * t) / t, s = Math.ceil((this.y + this.height - e) * t) / t;
    return this.x = Math.floor((this.x + e) * t) / t, this.y = Math.floor((this.y + e) * t) / t, this.width = i - this.x, this.height = s - this.y, this;
  }
  /**
   * Enlarges this rectangle to include the passed rectangle.
   * @param rectangle - The rectangle to include.
   * @returns Returns itself.
   */
  enlarge(t) {
    const e = Math.min(this.x, t.x), i = Math.max(this.x + this.width, t.x + t.width), s = Math.min(this.y, t.y), n = Math.max(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = i - e, this.y = s, this.height = n - s, this;
  }
}
tt.prototype.toString = function() {
  return `[@pixi/math:Rectangle x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
};
class Ys {
  /**
   * @param x - The X coordinate of the center of this circle
   * @param y - The Y coordinate of the center of this circle
   * @param radius - The radius of the circle
   */
  constructor(t = 0, e = 0, i = 0) {
    this.x = t, this.y = e, this.radius = i, this.type = Ot.CIRC;
  }
  /**
   * Creates a clone of this Circle instance
   * @returns A copy of the Circle
   */
  clone() {
    return new Ys(this.x, this.y, this.radius);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this circle
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Circle
   */
  contains(t, e) {
    if (this.radius <= 0)
      return !1;
    const i = this.radius * this.radius;
    let s = this.x - t, n = this.y - e;
    return s *= s, n *= n, s + n <= i;
  }
  /**
   * Returns the framing rectangle of the circle as a Rectangle object
   * @returns The framing rectangle
   */
  getBounds() {
    return new tt(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
  }
}
Ys.prototype.toString = function() {
  return `[@pixi/math:Circle x=${this.x} y=${this.y} radius=${this.radius}]`;
};
class qs {
  /**
   * @param x - The X coordinate of the center of this ellipse
   * @param y - The Y coordinate of the center of this ellipse
   * @param halfWidth - The half width of this ellipse
   * @param halfHeight - The half height of this ellipse
   */
  constructor(t = 0, e = 0, i = 0, s = 0) {
    this.x = t, this.y = e, this.width = i, this.height = s, this.type = Ot.ELIP;
  }
  /**
   * Creates a clone of this Ellipse instance
   * @returns {PIXI.Ellipse} A copy of the ellipse
   */
  clone() {
    return new qs(this.x, this.y, this.width, this.height);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this ellipse
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coords are within this ellipse
   */
  contains(t, e) {
    if (this.width <= 0 || this.height <= 0)
      return !1;
    let i = (t - this.x) / this.width, s = (e - this.y) / this.height;
    return i *= i, s *= s, i + s <= 1;
  }
  /**
   * Returns the framing rectangle of the ellipse as a Rectangle object
   * @returns The framing rectangle
   */
  getBounds() {
    return new tt(this.x - this.width, this.y - this.height, this.width, this.height);
  }
}
qs.prototype.toString = function() {
  return `[@pixi/math:Ellipse x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
};
class _r {
  /**
   * @param {PIXI.IPointData[]|number[]} points - This can be an array of Points
   *  that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or
   *  the arguments passed can be all the points of the polygon e.g.
   *  `new Polygon(new Point(), new Point(), ...)`, or the arguments passed can be flat
   *  x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
   */
  constructor(...t) {
    let e = Array.isArray(t[0]) ? t[0] : t;
    if (typeof e[0] != "number") {
      const i = [];
      for (let s = 0, n = e.length; s < n; s++)
        i.push(e[s].x, e[s].y);
      e = i;
    }
    this.points = e, this.type = Ot.POLY, this.closeStroke = !0;
  }
  /**
   * Creates a clone of this polygon.
   * @returns - A copy of the polygon.
   */
  clone() {
    const t = this.points.slice(), e = new _r(t);
    return e.closeStroke = this.closeStroke, e;
  }
  /**
   * Checks whether the x and y coordinates passed to this function are contained within this polygon.
   * @param x - The X coordinate of the point to test.
   * @param y - The Y coordinate of the point to test.
   * @returns - Whether the x/y coordinates are within this polygon.
   */
  contains(t, e) {
    let i = !1;
    const s = this.points.length / 2;
    for (let n = 0, o = s - 1; n < s; o = n++) {
      const a = this.points[n * 2], h = this.points[n * 2 + 1], l = this.points[o * 2], c = this.points[o * 2 + 1];
      h > e != c > e && t < (l - a) * ((e - h) / (c - h)) + a && (i = !i);
    }
    return i;
  }
}
_r.prototype.toString = function() {
  return `[@pixi/math:PolygoncloseStroke=${this.closeStroke}points=${this.points.reduce((r, t) => `${r}, ${t}`, "")}]`;
};
class Ks {
  /**
   * @param x - The X coordinate of the upper-left corner of the rounded rectangle
   * @param y - The Y coordinate of the upper-left corner of the rounded rectangle
   * @param width - The overall width of this rounded rectangle
   * @param height - The overall height of this rounded rectangle
   * @param radius - Controls the radius of the rounded corners
   */
  constructor(t = 0, e = 0, i = 0, s = 0, n = 20) {
    this.x = t, this.y = e, this.width = i, this.height = s, this.radius = n, this.type = Ot.RREC;
  }
  /**
   * Creates a clone of this Rounded Rectangle.
   * @returns - A copy of the rounded rectangle.
   */
  clone() {
    return new Ks(this.x, this.y, this.width, this.height, this.radius);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this Rounded Rectangle
   * @param x - The X coordinate of the point to test.
   * @param y - The Y coordinate of the point to test.
   * @returns - Whether the x/y coordinates are within this Rounded Rectangle.
   */
  contains(t, e) {
    if (this.width <= 0 || this.height <= 0)
      return !1;
    if (t >= this.x && t <= this.x + this.width && e >= this.y && e <= this.y + this.height) {
      const i = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
      if (e >= this.y + i && e <= this.y + this.height - i || t >= this.x + i && t <= this.x + this.width - i)
        return !0;
      let s = t - (this.x + i), n = e - (this.y + i);
      const o = i * i;
      if (s * s + n * n <= o || (s = t - (this.x + this.width - i), s * s + n * n <= o) || (n = e - (this.y + this.height - i), s * s + n * n <= o) || (s = t - (this.x + i), s * s + n * n <= o))
        return !0;
    }
    return !1;
  }
}
Ks.prototype.toString = function() {
  return `[@pixi/math:RoundedRectangle x=${this.x} y=${this.y}width=${this.width} height=${this.height} radius=${this.radius}]`;
};
class yt {
  /**
   * @param a - x scale
   * @param b - y skew
   * @param c - x skew
   * @param d - y scale
   * @param tx - x translation
   * @param ty - y translation
   */
  constructor(t = 1, e = 0, i = 0, s = 1, n = 0, o = 0) {
    this.array = null, this.a = t, this.b = e, this.c = i, this.d = s, this.tx = n, this.ty = o;
  }
  /**
   * Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:
   *
   * a = array[0]
   * b = array[1]
   * c = array[3]
   * d = array[4]
   * tx = array[2]
   * ty = array[5]
   * @param array - The array that the matrix will be populated from.
   */
  fromArray(t) {
    this.a = t[0], this.b = t[1], this.c = t[3], this.d = t[4], this.tx = t[2], this.ty = t[5];
  }
  /**
   * Sets the matrix properties.
   * @param a - Matrix component
   * @param b - Matrix component
   * @param c - Matrix component
   * @param d - Matrix component
   * @param tx - Matrix component
   * @param ty - Matrix component
   * @returns This matrix. Good for chaining method calls.
   */
  set(t, e, i, s, n, o) {
    return this.a = t, this.b = e, this.c = i, this.d = s, this.tx = n, this.ty = o, this;
  }
  /**
   * Creates an array from the current Matrix object.
   * @param transpose - Whether we need to transpose the matrix or not
   * @param [out=new Float32Array(9)] - If provided the array will be assigned to out
   * @returns The newly created array which contains the matrix
   */
  toArray(t, e) {
    this.array || (this.array = new Float32Array(9));
    const i = e || this.array;
    return t ? (i[0] = this.a, i[1] = this.b, i[2] = 0, i[3] = this.c, i[4] = this.d, i[5] = 0, i[6] = this.tx, i[7] = this.ty, i[8] = 1) : (i[0] = this.a, i[1] = this.c, i[2] = this.tx, i[3] = this.b, i[4] = this.d, i[5] = this.ty, i[6] = 0, i[7] = 0, i[8] = 1), i;
  }
  /**
   * Get a new position with the current transformation applied.
   * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
   * @param pos - The origin
   * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
   * @returns {PIXI.Point} The new point, transformed through this matrix
   */
  apply(t, e) {
    e = e || new lt();
    const i = t.x, s = t.y;
    return e.x = this.a * i + this.c * s + this.tx, e.y = this.b * i + this.d * s + this.ty, e;
  }
  /**
   * Get a new position with the inverse of the current transformation applied.
   * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
   * @param pos - The origin
   * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
   * @returns {PIXI.Point} The new point, inverse-transformed through this matrix
   */
  applyInverse(t, e) {
    e = e || new lt();
    const i = 1 / (this.a * this.d + this.c * -this.b), s = t.x, n = t.y;
    return e.x = this.d * i * s + -this.c * i * n + (this.ty * this.c - this.tx * this.d) * i, e.y = this.a * i * n + -this.b * i * s + (-this.ty * this.a + this.tx * this.b) * i, e;
  }
  /**
   * Translates the matrix on the x and y.
   * @param x - How much to translate x by
   * @param y - How much to translate y by
   * @returns This matrix. Good for chaining method calls.
   */
  translate(t, e) {
    return this.tx += t, this.ty += e, this;
  }
  /**
   * Applies a scale transformation to the matrix.
   * @param x - The amount to scale horizontally
   * @param y - The amount to scale vertically
   * @returns This matrix. Good for chaining method calls.
   */
  scale(t, e) {
    return this.a *= t, this.d *= e, this.c *= t, this.b *= e, this.tx *= t, this.ty *= e, this;
  }
  /**
   * Applies a rotation transformation to the matrix.
   * @param angle - The angle in radians.
   * @returns This matrix. Good for chaining method calls.
   */
  rotate(t) {
    const e = Math.cos(t), i = Math.sin(t), s = this.a, n = this.c, o = this.tx;
    return this.a = s * e - this.b * i, this.b = s * i + this.b * e, this.c = n * e - this.d * i, this.d = n * i + this.d * e, this.tx = o * e - this.ty * i, this.ty = o * i + this.ty * e, this;
  }
  /**
   * Appends the given Matrix to this Matrix.
   * @param matrix - The matrix to append.
   * @returns This matrix. Good for chaining method calls.
   */
  append(t) {
    const e = this.a, i = this.b, s = this.c, n = this.d;
    return this.a = t.a * e + t.b * s, this.b = t.a * i + t.b * n, this.c = t.c * e + t.d * s, this.d = t.c * i + t.d * n, this.tx = t.tx * e + t.ty * s + this.tx, this.ty = t.tx * i + t.ty * n + this.ty, this;
  }
  /**
   * Sets the matrix based on all the available properties
   * @param x - Position on the x axis
   * @param y - Position on the y axis
   * @param pivotX - Pivot on the x axis
   * @param pivotY - Pivot on the y axis
   * @param scaleX - Scale on the x axis
   * @param scaleY - Scale on the y axis
   * @param rotation - Rotation in radians
   * @param skewX - Skew on the x axis
   * @param skewY - Skew on the y axis
   * @returns This matrix. Good for chaining method calls.
   */
  setTransform(t, e, i, s, n, o, a, h, l) {
    return this.a = Math.cos(a + l) * n, this.b = Math.sin(a + l) * n, this.c = -Math.sin(a - h) * o, this.d = Math.cos(a - h) * o, this.tx = t - (i * this.a + s * this.c), this.ty = e - (i * this.b + s * this.d), this;
  }
  /**
   * Prepends the given Matrix to this Matrix.
   * @param matrix - The matrix to prepend
   * @returns This matrix. Good for chaining method calls.
   */
  prepend(t) {
    const e = this.tx;
    if (t.a !== 1 || t.b !== 0 || t.c !== 0 || t.d !== 1) {
      const i = this.a, s = this.c;
      this.a = i * t.a + this.b * t.c, this.b = i * t.b + this.b * t.d, this.c = s * t.a + this.d * t.c, this.d = s * t.b + this.d * t.d;
    }
    return this.tx = e * t.a + this.ty * t.c + t.tx, this.ty = e * t.b + this.ty * t.d + t.ty, this;
  }
  /**
   * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
   * @param transform - The transform to apply the properties to.
   * @returns The transform with the newly applied properties
   */
  decompose(t) {
    const e = this.a, i = this.b, s = this.c, n = this.d, o = t.pivot, a = -Math.atan2(-s, n), h = Math.atan2(i, e), l = Math.abs(a + h);
    return l < 1e-5 || Math.abs(Ms - l) < 1e-5 ? (t.rotation = h, t.skew.x = t.skew.y = 0) : (t.rotation = 0, t.skew.x = a, t.skew.y = h), t.scale.x = Math.sqrt(e * e + i * i), t.scale.y = Math.sqrt(s * s + n * n), t.position.x = this.tx + (o.x * e + o.y * s), t.position.y = this.ty + (o.x * i + o.y * n), t;
  }
  /**
   * Inverts this matrix
   * @returns This matrix. Good for chaining method calls.
   */
  invert() {
    const t = this.a, e = this.b, i = this.c, s = this.d, n = this.tx, o = t * s - e * i;
    return this.a = s / o, this.b = -e / o, this.c = -i / o, this.d = t / o, this.tx = (i * this.ty - s * n) / o, this.ty = -(t * this.ty - e * n) / o, this;
  }
  /**
   * Resets this Matrix to an identity (default) matrix.
   * @returns This matrix. Good for chaining method calls.
   */
  identity() {
    return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this;
  }
  /**
   * Creates a new Matrix object with the same values as this one.
   * @returns A copy of this matrix. Good for chaining method calls.
   */
  clone() {
    const t = new yt();
    return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
  }
  /**
   * Changes the values of the given matrix to be the same as the ones in this matrix
   * @param matrix - The matrix to copy to.
   * @returns The matrix given in parameter with its values updated.
   */
  copyTo(t) {
    return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
  }
  /**
   * Changes the values of the matrix to be the same as the ones in given matrix
   * @param {PIXI.Matrix} matrix - The matrix to copy from.
   * @returns {PIXI.Matrix} this
   */
  copyFrom(t) {
    return this.a = t.a, this.b = t.b, this.c = t.c, this.d = t.d, this.tx = t.tx, this.ty = t.ty, this;
  }
  /**
   * A default (identity) matrix
   * @readonly
   */
  static get IDENTITY() {
    return new yt();
  }
  /**
   * A temp matrix
   * @readonly
   */
  static get TEMP_MATRIX() {
    return new yt();
  }
}
yt.prototype.toString = function() {
  return `[@pixi/math:Matrix a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty}]`;
};
const nr = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1], or = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1], ar = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1], hr = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1], xo = [], yc = [], ji = Math.sign;
function Zm() {
  for (let r = 0; r < 16; r++) {
    const t = [];
    xo.push(t);
    for (let e = 0; e < 16; e++) {
      const i = ji(nr[r] * nr[e] + ar[r] * or[e]), s = ji(or[r] * nr[e] + hr[r] * or[e]), n = ji(nr[r] * ar[e] + ar[r] * hr[e]), o = ji(or[r] * ar[e] + hr[r] * hr[e]);
      for (let a = 0; a < 16; a++)
        if (nr[a] === i && or[a] === s && ar[a] === n && hr[a] === o) {
          t.push(a);
          break;
        }
    }
  }
  for (let r = 0; r < 16; r++) {
    const t = new yt();
    t.set(nr[r], or[r], ar[r], hr[r], 0, 0), yc.push(t);
  }
}
Zm();
const xt = {
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 0°       | East      |
   * @readonly
   */
  E: 0,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 45°↻     | Southeast |
   * @readonly
   */
  SE: 1,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 90°↻     | South     |
   * @readonly
   */
  S: 2,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 135°↻    | Southwest |
   * @readonly
   */
  SW: 3,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 180°     | West      |
   * @readonly
   */
  W: 4,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -135°/225°↻ | Northwest    |
   * @readonly
   */
  NW: 5,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -90°/270°↻  | North        |
   * @readonly
   */
  N: 6,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -45°/315°↻  | Northeast    |
   * @readonly
   */
  NE: 7,
  /**
   * Reflection about Y-axis.
   * @readonly
   */
  MIRROR_VERTICAL: 8,
  /**
   * Reflection about the main diagonal.
   * @readonly
   */
  MAIN_DIAGONAL: 10,
  /**
   * Reflection about X-axis.
   * @readonly
   */
  MIRROR_HORIZONTAL: 12,
  /**
   * Reflection about reverse diagonal.
   * @readonly
   */
  REVERSE_DIAGONAL: 14,
  /**
   * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
   * @returns {PIXI.GD8Symmetry} The X-component of the U-axis
   *    after rotating the axes.
   */
  uX: (r) => nr[r],
  /**
   * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
   * @returns {PIXI.GD8Symmetry} The Y-component of the U-axis
   *    after rotating the axes.
   */
  uY: (r) => or[r],
  /**
   * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
   * @returns {PIXI.GD8Symmetry} The X-component of the V-axis
   *    after rotating the axes.
   */
  vX: (r) => ar[r],
  /**
   * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
   * @returns {PIXI.GD8Symmetry} The Y-component of the V-axis
   *    after rotating the axes.
   */
  vY: (r) => hr[r],
  /**
   * @param {PIXI.GD8Symmetry} rotation - symmetry whose opposite
   *   is needed. Only rotations have opposite symmetries while
   *   reflections don't.
   * @returns {PIXI.GD8Symmetry} The opposite symmetry of `rotation`
   */
  inv: (r) => r & 8 ? r & 15 : -r & 7,
  /**
   * Composes the two D8 operations.
   *
   * Taking `^` as reflection:
   *
   * |       | E=0 | S=2 | W=4 | N=6 | E^=8 | S^=10 | W^=12 | N^=14 |
   * |-------|-----|-----|-----|-----|------|-------|-------|-------|
   * | E=0   | E   | S   | W   | N   | E^   | S^    | W^    | N^    |
   * | S=2   | S   | W   | N   | E   | S^   | W^    | N^    | E^    |
   * | W=4   | W   | N   | E   | S   | W^   | N^    | E^    | S^    |
   * | N=6   | N   | E   | S   | W   | N^   | E^    | S^    | W^    |
   * | E^=8  | E^  | N^  | W^  | S^  | E    | N     | W     | S     |
   * | S^=10 | S^  | E^  | N^  | W^  | S    | E     | N     | W     |
   * | W^=12 | W^  | S^  | E^  | N^  | W    | S     | E     | N     |
   * | N^=14 | N^  | W^  | S^  | E^  | N    | W     | S     | E     |
   *
   * [This is a Cayley table]{@link https://en.wikipedia.org/wiki/Cayley_table}
   * @param {PIXI.GD8Symmetry} rotationSecond - Second operation, which
   *   is the row in the above cayley table.
   * @param {PIXI.GD8Symmetry} rotationFirst - First operation, which
   *   is the column in the above cayley table.
   * @returns {PIXI.GD8Symmetry} Composed operation
   */
  add: (r, t) => xo[r][t],
  /**
   * Reverse of `add`.
   * @param {PIXI.GD8Symmetry} rotationSecond - Second operation
   * @param {PIXI.GD8Symmetry} rotationFirst - First operation
   * @returns {PIXI.GD8Symmetry} Result
   */
  sub: (r, t) => xo[r][xt.inv(t)],
  /**
   * Adds 180 degrees to rotation, which is a commutative
   * operation.
   * @param {number} rotation - The number to rotate.
   * @returns {number} Rotated number
   */
  rotate180: (r) => r ^ 4,
  /**
   * Checks if the rotation angle is vertical, i.e. south
   * or north. It doesn't work for reflections.
   * @param {PIXI.GD8Symmetry} rotation - The number to check.
   * @returns {boolean} Whether or not the direction is vertical
   */
  isVertical: (r) => (r & 3) === 2,
  // rotation % 4 === 2
  /**
   * Approximates the vector `V(dx,dy)` into one of the
   * eight directions provided by `groupD8`.
   * @param {number} dx - X-component of the vector
   * @param {number} dy - Y-component of the vector
   * @returns {PIXI.GD8Symmetry} Approximation of the vector into
   *  one of the eight symmetries.
   */
  byDirection: (r, t) => Math.abs(r) * 2 <= Math.abs(t) ? t >= 0 ? xt.S : xt.N : Math.abs(t) * 2 <= Math.abs(r) ? r > 0 ? xt.E : xt.W : t > 0 ? r > 0 ? xt.SE : xt.SW : r > 0 ? xt.NE : xt.NW,
  /**
   * Helps sprite to compensate texture packer rotation.
   * @param {PIXI.Matrix} matrix - sprite world matrix
   * @param {PIXI.GD8Symmetry} rotation - The rotation factor to use.
   * @param {number} tx - sprite anchoring
   * @param {number} ty - sprite anchoring
   */
  matrixAppendRotationInv: (r, t, e = 0, i = 0) => {
    const s = yc[xt.inv(t)];
    s.tx = e, s.ty = i, r.append(s);
  }
};
class Be {
  /**
   * Creates a new `ObservablePoint`
   * @param cb - callback function triggered when `x` and/or `y` are changed
   * @param scope - owner of callback
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(t, e, i = 0, s = 0) {
    this._x = i, this._y = s, this.cb = t, this.scope = e;
  }
  /**
   * Creates a clone of this point.
   * The callback and scope params can be overridden otherwise they will default
   * to the clone object's values.
   * @override
   * @param cb - The callback function triggered when `x` and/or `y` are changed
   * @param scope - The owner of the callback
   * @returns a copy of this observable point
   */
  clone(t = this.cb, e = this.scope) {
    return new Be(t, e, this._x, this._y);
  }
  /**
   * Sets the point to a new `x` and `y` position.
   * If `y` is omitted, both `x` and `y` will be set to `x`.
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=x] - position of the point on the y axis
   * @returns The observable point instance itself
   */
  set(t = 0, e = t) {
    return (this._x !== t || this._y !== e) && (this._x = t, this._y = e, this.cb.call(this.scope)), this;
  }
  /**
   * Copies x and y from the given point (`p`)
   * @param p - The point to copy from. Can be any of type that is or extends `IPointData`
   * @returns The observable point instance itself
   */
  copyFrom(t) {
    return (this._x !== t.x || this._y !== t.y) && (this._x = t.x, this._y = t.y, this.cb.call(this.scope)), this;
  }
  /**
   * Copies this point's x and y into that of the given point (`p`)
   * @param p - The point to copy to. Can be any of type that is or extends `IPointData`
   * @returns The point (`p`) with values updated
   */
  copyTo(t) {
    return t.set(this._x, this._y), t;
  }
  /**
   * Accepts another point (`p`) and returns `true` if the given point is equal to this point
   * @param p - The point to check
   * @returns Returns `true` if both `x` and `y` are equal
   */
  equals(t) {
    return t.x === this._x && t.y === this._y;
  }
  /** Position of the observable point on the x axis. */
  get x() {
    return this._x;
  }
  set x(t) {
    this._x !== t && (this._x = t, this.cb.call(this.scope));
  }
  /** Position of the observable point on the y axis. */
  get y() {
    return this._y;
  }
  set y(t) {
    this._y !== t && (this._y = t, this.cb.call(this.scope));
  }
}
Be.prototype.toString = function() {
  return `[@pixi/math:ObservablePoint x=${this.x} y=${this.y} scope=${this.scope}]`;
};
const bo = class {
  constructor() {
    this.worldTransform = new yt(), this.localTransform = new yt(), this.position = new Be(this.onChange, this, 0, 0), this.scale = new Be(this.onChange, this, 1, 1), this.pivot = new Be(this.onChange, this, 0, 0), this.skew = new Be(this.updateSkew, this, 0, 0), this._rotation = 0, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._localID = 0, this._currentLocalID = 0, this._worldID = 0, this._parentID = 0;
  }
  /** Called when a value changes. */
  onChange() {
    this._localID++;
  }
  /** Called when the skew or the rotation changes. */
  updateSkew() {
    this._cx = Math.cos(this._rotation + this.skew.y), this._sx = Math.sin(this._rotation + this.skew.y), this._cy = -Math.sin(this._rotation - this.skew.x), this._sy = Math.cos(this._rotation - this.skew.x), this._localID++;
  }
  /** Updates the local transformation matrix. */
  updateLocalTransform() {
    const r = this.localTransform;
    this._localID !== this._currentLocalID && (r.a = this._cx * this.scale.x, r.b = this._sx * this.scale.x, r.c = this._cy * this.scale.y, r.d = this._sy * this.scale.y, r.tx = this.position.x - (this.pivot.x * r.a + this.pivot.y * r.c), r.ty = this.position.y - (this.pivot.x * r.b + this.pivot.y * r.d), this._currentLocalID = this._localID, this._parentID = -1);
  }
  /**
   * Updates the local and the world transformation matrices.
   * @param parentTransform - The parent transform
   */
  updateTransform(r) {
    const t = this.localTransform;
    if (this._localID !== this._currentLocalID && (t.a = this._cx * this.scale.x, t.b = this._sx * this.scale.x, t.c = this._cy * this.scale.y, t.d = this._sy * this.scale.y, t.tx = this.position.x - (this.pivot.x * t.a + this.pivot.y * t.c), t.ty = this.position.y - (this.pivot.x * t.b + this.pivot.y * t.d), this._currentLocalID = this._localID, this._parentID = -1), this._parentID !== r._worldID) {
      const e = r.worldTransform, i = this.worldTransform;
      i.a = t.a * e.a + t.b * e.c, i.b = t.a * e.b + t.b * e.d, i.c = t.c * e.a + t.d * e.c, i.d = t.c * e.b + t.d * e.d, i.tx = t.tx * e.a + t.ty * e.c + e.tx, i.ty = t.tx * e.b + t.ty * e.d + e.ty, this._parentID = r._worldID, this._worldID++;
    }
  }
  /**
   * Decomposes a matrix and sets the transforms properties based on it.
   * @param matrix - The matrix to decompose
   */
  setFromMatrix(r) {
    r.decompose(this), this._localID++;
  }
  /** The rotation of the object in radians. */
  get rotation() {
    return this._rotation;
  }
  set rotation(r) {
    this._rotation !== r && (this._rotation = r, this.updateSkew());
  }
};
bo.IDENTITY = new bo();
let da = bo;
da.prototype.toString = function() {
  return `[@pixi/math:Transform position=(${this.position.x}, ${this.position.y}) rotation=${this.rotation} scale=(${this.scale.x}, ${this.scale.y}) skew=(${this.skew.x}, ${this.skew.y}) ]`;
};
var Qm = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void){
   gl_FragColor *= texture2D(uSampler, vTextureCoord);
}`, Jm = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void){
   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
   vTextureCoord = aTextureCoord;
}
`;
function Sh(r, t, e) {
  const i = r.createShader(t);
  return r.shaderSource(i, e), r.compileShader(i), i;
}
function Rn(r) {
  const t = new Array(r);
  for (let e = 0; e < t.length; e++)
    t[e] = !1;
  return t;
}
function _c(r, t) {
  switch (r) {
    case "float":
      return 0;
    case "vec2":
      return new Float32Array(2 * t);
    case "vec3":
      return new Float32Array(3 * t);
    case "vec4":
      return new Float32Array(4 * t);
    case "int":
    case "uint":
    case "sampler2D":
    case "sampler2DArray":
      return 0;
    case "ivec2":
      return new Int32Array(2 * t);
    case "ivec3":
      return new Int32Array(3 * t);
    case "ivec4":
      return new Int32Array(4 * t);
    case "uvec2":
      return new Uint32Array(2 * t);
    case "uvec3":
      return new Uint32Array(3 * t);
    case "uvec4":
      return new Uint32Array(4 * t);
    case "bool":
      return !1;
    case "bvec2":
      return Rn(2 * t);
    case "bvec3":
      return Rn(3 * t);
    case "bvec4":
      return Rn(4 * t);
    case "mat2":
      return new Float32Array([
        1,
        0,
        0,
        1
      ]);
    case "mat3":
      return new Float32Array([
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ]);
    case "mat4":
      return new Float32Array([
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ]);
  }
  return null;
}
const qr = [
  // a float cache layer
  {
    test: (r) => r.type === "float" && r.size === 1 && !r.isArray,
    code: (r) => `
            if(uv["${r}"] !== ud["${r}"].value)
            {
                ud["${r}"].value = uv["${r}"]
                gl.uniform1f(ud["${r}"].location, uv["${r}"])
            }
            `
  },
  // handling samplers
  {
    test: (r, t) => (
      // eslint-disable-next-line max-len,no-eq-null,eqeqeq
      (r.type === "sampler2D" || r.type === "samplerCube" || r.type === "sampler2DArray") && r.size === 1 && !r.isArray && (t == null || t.castToBaseTexture !== void 0)
    ),
    code: (r) => `t = syncData.textureCount++;

            renderer.texture.bind(uv["${r}"], t);

            if(ud["${r}"].value !== t)
            {
                ud["${r}"].value = t;
                gl.uniform1i(ud["${r}"].location, t);
; // eslint-disable-line max-len
            }`
  },
  // uploading pixi matrix object to mat3
  {
    test: (r, t) => r.type === "mat3" && r.size === 1 && !r.isArray && t.a !== void 0,
    code: (r) => (
      // TODO and some smart caching dirty ids here!
      `
            gl.uniformMatrix3fv(ud["${r}"].location, false, uv["${r}"].toArray(true));
            `
    ),
    codeUbo: (r) => `
                var ${r}_matrix = uv.${r}.toArray(true);

                data[offset] = ${r}_matrix[0];
                data[offset+1] = ${r}_matrix[1];
                data[offset+2] = ${r}_matrix[2];
        
                data[offset + 4] = ${r}_matrix[3];
                data[offset + 5] = ${r}_matrix[4];
                data[offset + 6] = ${r}_matrix[5];
        
                data[offset + 8] = ${r}_matrix[6];
                data[offset + 9] = ${r}_matrix[7];
                data[offset + 10] = ${r}_matrix[8];
            `
  },
  // uploading a pixi point as a vec2 with caching layer
  {
    test: (r, t) => r.type === "vec2" && r.size === 1 && !r.isArray && t.x !== void 0,
    code: (r) => `
                cv = ud["${r}"].value;
                v = uv["${r}"];

                if(cv[0] !== v.x || cv[1] !== v.y)
                {
                    cv[0] = v.x;
                    cv[1] = v.y;
                    gl.uniform2f(ud["${r}"].location, v.x, v.y);
                }`,
    codeUbo: (r) => `
                v = uv.${r};

                data[offset] = v.x;
                data[offset+1] = v.y;
            `
  },
  // caching layer for a vec2
  {
    test: (r) => r.type === "vec2" && r.size === 1 && !r.isArray,
    code: (r) => `
                cv = ud["${r}"].value;
                v = uv["${r}"];

                if(cv[0] !== v[0] || cv[1] !== v[1])
                {
                    cv[0] = v[0];
                    cv[1] = v[1];
                    gl.uniform2f(ud["${r}"].location, v[0], v[1]);
                }
            `
  },
  // upload a pixi rectangle as a vec4 with caching layer
  {
    test: (r, t) => r.type === "vec4" && r.size === 1 && !r.isArray && t.width !== void 0,
    code: (r) => `
                cv = ud["${r}"].value;
                v = uv["${r}"];

                if(cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height)
                {
                    cv[0] = v.x;
                    cv[1] = v.y;
                    cv[2] = v.width;
                    cv[3] = v.height;
                    gl.uniform4f(ud["${r}"].location, v.x, v.y, v.width, v.height)
                }`,
    codeUbo: (r) => `
                    v = uv.${r};

                    data[offset] = v.x;
                    data[offset+1] = v.y;
                    data[offset+2] = v.width;
                    data[offset+3] = v.height;
                `
  },
  // upload a pixi color as vec4 with caching layer
  {
    test: (r, t) => r.type === "vec4" && r.size === 1 && !r.isArray && t.red !== void 0,
    code: (r) => `
                cv = ud["${r}"].value;
                v = uv["${r}"];

                if(cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.alpha)
                {
                    cv[0] = v.red;
                    cv[1] = v.green;
                    cv[2] = v.blue;
                    cv[3] = v.alpha;
                    gl.uniform4f(ud["${r}"].location, v.red, v.green, v.blue, v.alpha)
                }`,
    codeUbo: (r) => `
                    v = uv.${r};

                    data[offset] = v.red;
                    data[offset+1] = v.green;
                    data[offset+2] = v.blue;
                    data[offset+3] = v.alpha;
                `
  },
  // upload a pixi color as a vec3 with caching layer
  {
    test: (r, t) => r.type === "vec3" && r.size === 1 && !r.isArray && t.red !== void 0,
    code: (r) => `
                cv = ud["${r}"].value;
                v = uv["${r}"];

                if(cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.a)
                {
                    cv[0] = v.red;
                    cv[1] = v.green;
                    cv[2] = v.blue;
    
                    gl.uniform3f(ud["${r}"].location, v.red, v.green, v.blue)
                }`,
    codeUbo: (r) => `
                    v = uv.${r};

                    data[offset] = v.red;
                    data[offset+1] = v.green;
                    data[offset+2] = v.blue;
                `
  },
  // a caching layer for vec4 uploading
  {
    test: (r) => r.type === "vec4" && r.size === 1 && !r.isArray,
    code: (r) => `
                cv = ud["${r}"].value;
                v = uv["${r}"];

                if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
                {
                    cv[0] = v[0];
                    cv[1] = v[1];
                    cv[2] = v[2];
                    cv[3] = v[3];

                    gl.uniform4f(ud["${r}"].location, v[0], v[1], v[2], v[3])
                }`
  }
], tg = {
  float: `
    if (cv !== v)
    {
        cu.value = v;
        gl.uniform1f(location, v);
    }`,
  vec2: `
    if (cv[0] !== v[0] || cv[1] !== v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2f(location, v[0], v[1])
    }`,
  vec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3f(location, v[0], v[1], v[2])
    }`,
  vec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4f(location, v[0], v[1], v[2], v[3]);
    }`,
  int: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1i(location, v);
    }`,
  ivec2: `
    if (cv[0] !== v[0] || cv[1] !== v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2i(location, v[0], v[1]);
    }`,
  ivec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3i(location, v[0], v[1], v[2]);
    }`,
  ivec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4i(location, v[0], v[1], v[2], v[3]);
    }`,
  uint: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1ui(location, v);
    }`,
  uvec2: `
    if (cv[0] !== v[0] || cv[1] !== v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2ui(location, v[0], v[1]);
    }`,
  uvec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3ui(location, v[0], v[1], v[2]);
    }`,
  uvec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4ui(location, v[0], v[1], v[2], v[3]);
    }`,
  bool: `
    if (cv !== v)
    {
        cu.value = v;
        gl.uniform1i(location, v);
    }`,
  bvec2: `
    if (cv[0] != v[0] || cv[1] != v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2i(location, v[0], v[1]);
    }`,
  bvec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3i(location, v[0], v[1], v[2]);
    }`,
  bvec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4i(location, v[0], v[1], v[2], v[3]);
    }`,
  mat2: "gl.uniformMatrix2fv(location, false, v)",
  mat3: "gl.uniformMatrix3fv(location, false, v)",
  mat4: "gl.uniformMatrix4fv(location, false, v)",
  sampler2D: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1i(location, v);
    }`,
  samplerCube: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1i(location, v);
    }`,
  sampler2DArray: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1i(location, v);
    }`
}, eg = {
  float: "gl.uniform1fv(location, v)",
  vec2: "gl.uniform2fv(location, v)",
  vec3: "gl.uniform3fv(location, v)",
  vec4: "gl.uniform4fv(location, v)",
  mat4: "gl.uniformMatrix4fv(location, false, v)",
  mat3: "gl.uniformMatrix3fv(location, false, v)",
  mat2: "gl.uniformMatrix2fv(location, false, v)",
  int: "gl.uniform1iv(location, v)",
  ivec2: "gl.uniform2iv(location, v)",
  ivec3: "gl.uniform3iv(location, v)",
  ivec4: "gl.uniform4iv(location, v)",
  uint: "gl.uniform1uiv(location, v)",
  uvec2: "gl.uniform2uiv(location, v)",
  uvec3: "gl.uniform3uiv(location, v)",
  uvec4: "gl.uniform4uiv(location, v)",
  bool: "gl.uniform1iv(location, v)",
  bvec2: "gl.uniform2iv(location, v)",
  bvec3: "gl.uniform3iv(location, v)",
  bvec4: "gl.uniform4iv(location, v)",
  sampler2D: "gl.uniform1iv(location, v)",
  samplerCube: "gl.uniform1iv(location, v)",
  sampler2DArray: "gl.uniform1iv(location, v)"
};
function rg(r, t) {
  var i;
  const e = [`
        var v = null;
        var cv = null;
        var cu = null;
        var t = 0;
        var gl = renderer.gl;
    `];
  for (const s in r.uniforms) {
    const n = t[s];
    if (!n) {
      ((i = r.uniforms[s]) == null ? void 0 : i.group) === !0 && (r.uniforms[s].ubo ? e.push(`
                        renderer.shader.syncUniformBufferGroup(uv.${s}, '${s}');
                    `) : e.push(`
                        renderer.shader.syncUniformGroup(uv.${s}, syncData);
                    `));
      continue;
    }
    const o = r.uniforms[s];
    let a = !1;
    for (let h = 0; h < qr.length; h++)
      if (qr[h].test(n, o)) {
        e.push(qr[h].code(s, o)), a = !0;
        break;
      }
    if (!a) {
      const h = (n.size === 1 && !n.isArray ? tg : eg)[n.type].replace("location", `ud["${s}"].location`);
      e.push(`
            cu = ud["${s}"];
            cv = cu.value;
            v = uv["${s}"];
            ${h};`);
    }
  }
  return new Function("ud", "uv", "renderer", "syncData", e.join(`
`));
}
const vc = {};
let Mr = vc;
function ig() {
  if (Mr === vc || Mr != null && Mr.isContextLost()) {
    const r = H.ADAPTER.createCanvas();
    let t;
    H.PREFER_ENV >= wr.WEBGL2 && (t = r.getContext("webgl2", {})), t || (t = r.getContext("webgl", {}) || r.getContext("experimental-webgl", {}), t ? t.getExtension("WEBGL_draw_buffers") : t = null), Mr = t;
  }
  return Mr;
}
let $i;
function sg() {
  if (!$i) {
    $i = Jt.MEDIUM;
    const r = ig();
    if (r && r.getShaderPrecisionFormat) {
      const t = r.getShaderPrecisionFormat(r.FRAGMENT_SHADER, r.HIGH_FLOAT);
      t && ($i = t.precision ? Jt.HIGH : Jt.MEDIUM);
    }
  }
  return $i;
}
function Ih(r, t) {
  const e = r.getShaderSource(t).split(`
`).map((l, c) => `${c}: ${l}`), i = r.getShaderInfoLog(t), s = i.split(`
`), n = {}, o = s.map((l) => parseFloat(l.replace(/^ERROR\: 0\:([\d]+)\:.*$/, "$1"))).filter((l) => l && !n[l] ? (n[l] = !0, !0) : !1), a = [""];
  o.forEach((l) => {
    e[l - 1] = `%c${e[l - 1]}%c`, a.push("background: #FF0000; color:#FFFFFF; font-size: 10px", "font-size: 10px");
  });
  const h = e.join(`
`);
  a[0] = h, console.error(i), console.groupCollapsed("click to view full shader code"), console.warn(...a), console.groupEnd();
}
function ng(r, t, e, i) {
  r.getProgramParameter(t, r.LINK_STATUS) || (r.getShaderParameter(e, r.COMPILE_STATUS) || Ih(r, e), r.getShaderParameter(i, r.COMPILE_STATUS) || Ih(r, i), console.error("PixiJS Error: Could not initialize shader."), r.getProgramInfoLog(t) !== "" && console.warn("PixiJS Warning: gl.getProgramInfoLog()", r.getProgramInfoLog(t)));
}
const og = {
  float: 1,
  vec2: 2,
  vec3: 3,
  vec4: 4,
  int: 1,
  ivec2: 2,
  ivec3: 3,
  ivec4: 4,
  uint: 1,
  uvec2: 2,
  uvec3: 3,
  uvec4: 4,
  bool: 1,
  bvec2: 2,
  bvec3: 3,
  bvec4: 4,
  mat2: 4,
  mat3: 9,
  mat4: 16,
  sampler2D: 1
};
function xc(r) {
  return og[r];
}
let Yi = null;
const Ch = {
  FLOAT: "float",
  FLOAT_VEC2: "vec2",
  FLOAT_VEC3: "vec3",
  FLOAT_VEC4: "vec4",
  INT: "int",
  INT_VEC2: "ivec2",
  INT_VEC3: "ivec3",
  INT_VEC4: "ivec4",
  UNSIGNED_INT: "uint",
  UNSIGNED_INT_VEC2: "uvec2",
  UNSIGNED_INT_VEC3: "uvec3",
  UNSIGNED_INT_VEC4: "uvec4",
  BOOL: "bool",
  BOOL_VEC2: "bvec2",
  BOOL_VEC3: "bvec3",
  BOOL_VEC4: "bvec4",
  FLOAT_MAT2: "mat2",
  FLOAT_MAT3: "mat3",
  FLOAT_MAT4: "mat4",
  SAMPLER_2D: "sampler2D",
  INT_SAMPLER_2D: "sampler2D",
  UNSIGNED_INT_SAMPLER_2D: "sampler2D",
  SAMPLER_CUBE: "samplerCube",
  INT_SAMPLER_CUBE: "samplerCube",
  UNSIGNED_INT_SAMPLER_CUBE: "samplerCube",
  SAMPLER_2D_ARRAY: "sampler2DArray",
  INT_SAMPLER_2D_ARRAY: "sampler2DArray",
  UNSIGNED_INT_SAMPLER_2D_ARRAY: "sampler2DArray"
};
function bc(r, t) {
  if (!Yi) {
    const e = Object.keys(Ch);
    Yi = {};
    for (let i = 0; i < e.length; ++i) {
      const s = e[i];
      Yi[r[s]] = Ch[s];
    }
  }
  return Yi[t];
}
function Rh(r, t, e) {
  if (r.substring(0, 9) !== "precision") {
    let i = t;
    return t === Jt.HIGH && e !== Jt.HIGH && (i = Jt.MEDIUM), `precision ${i} float;
${r}`;
  } else if (e !== Jt.HIGH && r.substring(0, 15) === "precision highp")
    return r.replace("precision highp", "precision mediump");
  return r;
}
let ai;
function ag() {
  if (typeof ai == "boolean")
    return ai;
  try {
    ai = new Function("param1", "param2", "param3", "return param1[param2] === param3;")({ a: "b" }, "a", "b") === !0;
  } catch {
    ai = !1;
  }
  return ai;
}
let hg = 0;
const qi = {}, To = class kr {
  /**
   * @param vertexSrc - The source of the vertex shader.
   * @param fragmentSrc - The source of the fragment shader.
   * @param name - Name for shader
   * @param extra - Extra data for shader
   */
  constructor(t, e, i = "pixi-shader", s = {}) {
    this.extra = {}, this.id = hg++, this.vertexSrc = t || kr.defaultVertexSrc, this.fragmentSrc = e || kr.defaultFragmentSrc, this.vertexSrc = this.vertexSrc.trim(), this.fragmentSrc = this.fragmentSrc.trim(), this.extra = s, this.vertexSrc.substring(0, 8) !== "#version" && (i = i.replace(/\s+/g, "-"), qi[i] ? (qi[i]++, i += `-${qi[i]}`) : qi[i] = 1, this.vertexSrc = `#define SHADER_NAME ${i}
${this.vertexSrc}`, this.fragmentSrc = `#define SHADER_NAME ${i}
${this.fragmentSrc}`, this.vertexSrc = Rh(
      this.vertexSrc,
      kr.defaultVertexPrecision,
      Jt.HIGH
    ), this.fragmentSrc = Rh(
      this.fragmentSrc,
      kr.defaultFragmentPrecision,
      sg()
    )), this.glPrograms = {}, this.syncUniforms = null;
  }
  /**
   * The default vertex shader source.
   * @readonly
   */
  static get defaultVertexSrc() {
    return Jm;
  }
  /**
   * The default fragment shader source.
   * @readonly
   */
  static get defaultFragmentSrc() {
    return Qm;
  }
  /**
   * A short hand function to create a program based of a vertex and fragment shader.
   *
   * This method will also check to see if there is a cached program.
   * @param vertexSrc - The source of the vertex shader.
   * @param fragmentSrc - The source of the fragment shader.
   * @param name - Name for shader
   * @returns A shiny new PixiJS shader program!
   */
  static from(t, e, i) {
    const s = t + e;
    let n = bh[s];
    return n || (bh[s] = n = new kr(t, e, i)), n;
  }
};
To.defaultVertexPrecision = Jt.HIGH, /**
* Default specify float precision in fragment shader.
* iOS is best set at highp due to https://github.com/pixijs/pixijs/issues/3742
* @static
* @type {PIXI.PRECISION}
* @default PIXI.PRECISION.MEDIUM
*/
To.defaultFragmentPrecision = Me.apple.device ? Jt.HIGH : Jt.MEDIUM;
let De = To, lg = 0;
class ue {
  /**
   * @param {object | Buffer} [uniforms] - Custom uniforms to use to augment the built-in ones. Or a pixi buffer.
   * @param isStatic - Uniforms wont be changed after creation.
   * @param isUbo - If true, will treat this uniform group as a uniform buffer object.
   */
  constructor(t, e, i) {
    this.group = !0, this.syncUniforms = {}, this.dirtyId = 0, this.id = lg++, this.static = !!e, this.ubo = !!i, t instanceof At ? (this.buffer = t, this.buffer.type = Te.UNIFORM_BUFFER, this.autoManage = !1, this.ubo = !0) : (this.uniforms = t, this.ubo && (this.buffer = new At(new Float32Array(1)), this.buffer.type = Te.UNIFORM_BUFFER, this.autoManage = !0));
  }
  update() {
    this.dirtyId++, !this.autoManage && this.buffer && this.buffer.update();
  }
  add(t, e, i) {
    if (!this.ubo)
      this.uniforms[t] = new ue(e, i);
    else
      throw new Error("[UniformGroup] uniform groups in ubo mode cannot be modified, or have uniform groups nested in them");
  }
  static from(t, e, i) {
    return new ue(t, e, i);
  }
  /**
   * A short hand function for creating a static UBO UniformGroup.
   * @param uniforms - the ubo item
   * @param _static - should this be updated each time it is used? defaults to true here!
   */
  static uboFrom(t, e) {
    return new ue(t, e ?? !0, !0);
  }
}
class Ee {
  /**
   * @param program - The program the shader will use.
   * @param uniforms - Custom uniforms to use to augment the built-in ones.
   */
  constructor(t, e) {
    this.uniformBindCount = 0, this.program = t, e ? e instanceof ue ? this.uniformGroup = e : this.uniformGroup = new ue(e) : this.uniformGroup = new ue({}), this.disposeRunner = new ce("disposeShader");
  }
  // TODO move to shader system..
  checkUniformExists(t, e) {
    if (e.uniforms[t])
      return !0;
    for (const i in e.uniforms) {
      const s = e.uniforms[i];
      if (s.group === !0 && this.checkUniformExists(t, s))
        return !0;
    }
    return !1;
  }
  destroy() {
    this.uniformGroup = null, this.disposeRunner.emit(this), this.disposeRunner.destroy();
  }
  /**
   * Shader uniform values, shortcut for `uniformGroup.uniforms`.
   * @readonly
   */
  get uniforms() {
    return this.uniformGroup.uniforms;
  }
  /**
   * A short hand function to create a shader based of a vertex and fragment shader.
   * @param vertexSrc - The source of the vertex shader.
   * @param fragmentSrc - The source of the fragment shader.
   * @param uniforms - Custom uniforms to use to augment the built-in ones.
   * @returns A shiny new PixiJS shader!
   */
  static from(t, e, i) {
    const s = De.from(t, e);
    return new Ee(s, i);
  }
}
class cg {
  /**
   * @param vertexSrc - Vertex shader
   * @param fragTemplate - Fragment shader template
   */
  constructor(t, e) {
    if (this.vertexSrc = t, this.fragTemplate = e, this.programCache = {}, this.defaultGroupCache = {}, !e.includes("%count%"))
      throw new Error('Fragment template must contain "%count%".');
    if (!e.includes("%forloop%"))
      throw new Error('Fragment template must contain "%forloop%".');
  }
  generateShader(t) {
    if (!this.programCache[t]) {
      const i = new Int32Array(t);
      for (let n = 0; n < t; n++)
        i[n] = n;
      this.defaultGroupCache[t] = ue.from({ uSamplers: i }, !0);
      let s = this.fragTemplate;
      s = s.replace(/%count%/gi, `${t}`), s = s.replace(/%forloop%/gi, this.generateSampleSrc(t)), this.programCache[t] = new De(this.vertexSrc, s);
    }
    const e = {
      tint: new Float32Array([1, 1, 1, 1]),
      translationMatrix: new yt(),
      default: this.defaultGroupCache[t]
    };
    return new Ee(this.programCache[t], e);
  }
  generateSampleSrc(t) {
    let e = "";
    e += `
`, e += `
`;
    for (let i = 0; i < t; i++)
      i > 0 && (e += `
else `), i < t - 1 && (e += `if(vTextureId < ${i}.5)`), e += `
{`, e += `
	color = texture2D(uSamplers[${i}], vTextureCoord);`, e += `
}`;
    return e += `
`, e += `
`, e;
  }
}
class Eo {
  constructor() {
    this.elements = [], this.ids = [], this.count = 0;
  }
  clear() {
    for (let t = 0; t < this.count; t++)
      this.elements[t] = null;
    this.count = 0;
  }
}
function ug() {
  return !Me.apple.device;
}
function dg(r) {
  let t = !0;
  const e = H.ADAPTER.getNavigator();
  if (Me.tablet || Me.phone) {
    if (Me.apple.device) {
      const i = e.userAgent.match(/OS (\d+)_(\d+)?/);
      i && parseInt(i[1], 10) < 11 && (t = !1);
    }
    if (Me.android.device) {
      const i = e.userAgent.match(/Android\s([0-9.]*)/);
      i && parseInt(i[1], 10) < 7 && (t = !1);
    }
  }
  return t ? r : 4;
}
class Zs {
  /**
   * @param renderer - The renderer this manager works for.
   */
  constructor(t) {
    this.renderer = t;
  }
  /** Stub method that should be used to empty the current batch by rendering objects now. */
  flush() {
  }
  /** Generic destruction method that frees all resources. This should be called by subclasses. */
  destroy() {
    this.renderer = null;
  }
  /**
   * Stub method that initializes any state required before
   * rendering starts. It is different from the `prerender`
   * signal, which occurs every frame, in that it is called
   * whenever an object requests _this_ renderer specifically.
   */
  start() {
  }
  /** Stops the renderer. It should free up any state and become dormant. */
  stop() {
    this.flush();
  }
  /**
   * Keeps the object to render. It doesn't have to be
   * rendered immediately.
   * @param {PIXI.DisplayObject} _object - The object to render.
   */
  render(t) {
  }
}
var fg = `varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;
uniform sampler2D uSamplers[%count%];

void main(void){
    vec4 color;
    %forloop%
    gl_FragColor = color * vColor;
}
`, pg = `precision highp float;
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aColor;
attribute float aTextureId;

uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;
uniform vec4 tint;

varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;

void main(void){
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = aTextureCoord;
    vTextureId = aTextureId;
    vColor = aColor * tint;
}
`;
const fi = class ne extends Zs {
  /**
   * This will hook onto the renderer's `contextChange`
   * and `prerender` signals.
   * @param {PIXI.Renderer} renderer - The renderer this works for.
   */
  constructor(t) {
    super(t), this.setShaderGenerator(), this.geometryClass = gc, this.vertexSize = 6, this.state = Ae.for2d(), this.size = ne.defaultBatchSize * 4, this._vertexCount = 0, this._indexCount = 0, this._bufferedElements = [], this._bufferedTextures = [], this._bufferSize = 0, this._shader = null, this._packedGeometries = [], this._packedGeometryPoolSize = 2, this._flushId = 0, this._aBuffers = {}, this._iBuffers = {}, this.maxTextures = 1, this.renderer.on("prerender", this.onPrerender, this), t.runners.contextChange.add(this), this._dcIndex = 0, this._aIndex = 0, this._iIndex = 0, this._attributeBuffer = null, this._indexBuffer = null, this._tempBoundTextures = [];
  }
  /**
   * The maximum textures that this device supports.
   * @static
   * @default 32
   */
  static get defaultMaxTextures() {
    return this._defaultMaxTextures = this._defaultMaxTextures ?? dg(32), this._defaultMaxTextures;
  }
  static set defaultMaxTextures(t) {
    this._defaultMaxTextures = t;
  }
  /**
   * Can we upload the same buffer in a single frame?
   * @static
   */
  static get canUploadSameBuffer() {
    return this._canUploadSameBuffer = this._canUploadSameBuffer ?? ug(), this._canUploadSameBuffer;
  }
  static set canUploadSameBuffer(t) {
    this._canUploadSameBuffer = t;
  }
  /**
   * @see PIXI.BatchRenderer#maxTextures
   * @deprecated since 7.1.0
   * @readonly
   */
  get MAX_TEXTURES() {
    return it("7.1.0", "BatchRenderer#MAX_TEXTURES renamed to BatchRenderer#maxTextures"), this.maxTextures;
  }
  /**
   * The default vertex shader source
   * @readonly
   */
  static get defaultVertexSrc() {
    return pg;
  }
  /**
   * The default fragment shader source
   * @readonly
   */
  static get defaultFragmentTemplate() {
    return fg;
  }
  /**
   * Set the shader generator.
   * @param {object} [options]
   * @param {string} [options.vertex=PIXI.BatchRenderer.defaultVertexSrc] - Vertex shader source
   * @param {string} [options.fragment=PIXI.BatchRenderer.defaultFragmentTemplate] - Fragment shader template
   */
  setShaderGenerator({
    vertex: t = ne.defaultVertexSrc,
    fragment: e = ne.defaultFragmentTemplate
  } = {}) {
    this.shaderGenerator = new cg(t, e);
  }
  /**
   * Handles the `contextChange` signal.
   *
   * It calculates `this.maxTextures` and allocating the packed-geometry object pool.
   */
  contextChange() {
    const t = this.renderer.gl;
    H.PREFER_ENV === wr.WEBGL_LEGACY ? this.maxTextures = 1 : (this.maxTextures = Math.min(
      t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),
      ne.defaultMaxTextures
    ), this.maxTextures = Vm(
      this.maxTextures,
      t
    )), this._shader = this.shaderGenerator.generateShader(this.maxTextures);
    for (let e = 0; e < this._packedGeometryPoolSize; e++)
      this._packedGeometries[e] = new this.geometryClass();
    this.initFlushBuffers();
  }
  /** Makes sure that static and dynamic flush pooled objects have correct dimensions. */
  initFlushBuffers() {
    const {
      _drawCallPool: t,
      _textureArrayPool: e
    } = ne, i = this.size / 4, s = Math.floor(i / this.maxTextures) + 1;
    for (; t.length < i; )
      t.push(new vo());
    for (; e.length < s; )
      e.push(new Eo());
    for (let n = 0; n < this.maxTextures; n++)
      this._tempBoundTextures[n] = null;
  }
  /** Handles the `prerender` signal. It ensures that flushes start from the first geometry object again. */
  onPrerender() {
    this._flushId = 0;
  }
  /**
   * Buffers the "batchable" object. It need not be rendered immediately.
   * @param {PIXI.DisplayObject} element - the element to render when
   *    using this renderer
   */
  render(t) {
    t._texture.valid && (this._vertexCount + t.vertexData.length / 2 > this.size && this.flush(), this._vertexCount += t.vertexData.length / 2, this._indexCount += t.indices.length, this._bufferedTextures[this._bufferSize] = t._texture.baseTexture, this._bufferedElements[this._bufferSize++] = t);
  }
  buildTexturesAndDrawCalls() {
    const {
      _bufferedTextures: t,
      maxTextures: e
    } = this, i = ne._textureArrayPool, s = this.renderer.batch, n = this._tempBoundTextures, o = this.renderer.textureGC.count;
    let a = ++J._globalBatch, h = 0, l = i[0], c = 0;
    s.copyBoundTextures(n, e);
    for (let u = 0; u < this._bufferSize; ++u) {
      const d = t[u];
      t[u] = null, d._batchEnabled !== a && (l.count >= e && (s.boundArray(l, n, a, e), this.buildDrawCalls(l, c, u), c = u, l = i[++h], ++a), d._batchEnabled = a, d.touched = o, l.elements[l.count++] = d);
    }
    l.count > 0 && (s.boundArray(l, n, a, e), this.buildDrawCalls(l, c, this._bufferSize), ++h, ++a);
    for (let u = 0; u < n.length; u++)
      n[u] = null;
    J._globalBatch = a;
  }
  /**
   * Populating drawcalls for rendering
   * @param texArray
   * @param start
   * @param finish
   */
  buildDrawCalls(t, e, i) {
    const {
      _bufferedElements: s,
      _attributeBuffer: n,
      _indexBuffer: o,
      vertexSize: a
    } = this, h = ne._drawCallPool;
    let l = this._dcIndex, c = this._aIndex, u = this._iIndex, d = h[l];
    d.start = this._iIndex, d.texArray = t;
    for (let f = e; f < i; ++f) {
      const p = s[f], m = p._texture.baseTexture, g = dc[m.alphaMode ? 1 : 0][p.blendMode];
      s[f] = null, e < f && d.blend !== g && (d.size = u - d.start, e = f, d = h[++l], d.texArray = t, d.start = u), this.packInterleavedGeometry(p, n, o, c, u), c += p.vertexData.length / 2 * a, u += p.indices.length, d.blend = g;
    }
    e < i && (d.size = u - d.start, ++l), this._dcIndex = l, this._aIndex = c, this._iIndex = u;
  }
  /**
   * Bind textures for current rendering
   * @param texArray
   */
  bindAndClearTexArray(t) {
    const e = this.renderer.texture;
    for (let i = 0; i < t.count; i++)
      e.bind(t.elements[i], t.ids[i]), t.elements[i] = null;
    t.count = 0;
  }
  updateGeometry() {
    const {
      _packedGeometries: t,
      _attributeBuffer: e,
      _indexBuffer: i
    } = this;
    ne.canUploadSameBuffer ? (t[this._flushId]._buffer.update(e.rawBinaryData), t[this._flushId]._indexBuffer.update(i), this.renderer.geometry.updateBuffers()) : (this._packedGeometryPoolSize <= this._flushId && (this._packedGeometryPoolSize++, t[this._flushId] = new this.geometryClass()), t[this._flushId]._buffer.update(e.rawBinaryData), t[this._flushId]._indexBuffer.update(i), this.renderer.geometry.bind(t[this._flushId]), this.renderer.geometry.updateBuffers(), this._flushId++);
  }
  drawBatches() {
    const t = this._dcIndex, { gl: e, state: i } = this.renderer, s = ne._drawCallPool;
    let n = null;
    for (let o = 0; o < t; o++) {
      const { texArray: a, type: h, size: l, start: c, blend: u } = s[o];
      n !== a && (n = a, this.bindAndClearTexArray(a)), this.state.blendMode = u, i.set(this.state), e.drawElements(h, l, e.UNSIGNED_SHORT, c * 2);
    }
  }
  /** Renders the content _now_ and empties the current batch. */
  flush() {
    this._vertexCount !== 0 && (this._attributeBuffer = this.getAttributeBuffer(this._vertexCount), this._indexBuffer = this.getIndexBuffer(this._indexCount), this._aIndex = 0, this._iIndex = 0, this._dcIndex = 0, this.buildTexturesAndDrawCalls(), this.updateGeometry(), this.drawBatches(), this._bufferSize = 0, this._vertexCount = 0, this._indexCount = 0);
  }
  /** Starts a new sprite batch. */
  start() {
    this.renderer.state.set(this.state), this.renderer.texture.ensureSamplerType(this.maxTextures), this.renderer.shader.bind(this._shader), ne.canUploadSameBuffer && this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
  }
  /** Stops and flushes the current batch. */
  stop() {
    this.flush();
  }
  /** Destroys this `BatchRenderer`. It cannot be used again. */
  destroy() {
    for (let t = 0; t < this._packedGeometryPoolSize; t++)
      this._packedGeometries[t] && this._packedGeometries[t].destroy();
    this.renderer.off("prerender", this.onPrerender, this), this._aBuffers = null, this._iBuffers = null, this._packedGeometries = null, this._attributeBuffer = null, this._indexBuffer = null, this._shader && (this._shader.destroy(), this._shader = null), super.destroy();
  }
  /**
   * Fetches an attribute buffer from `this._aBuffers` that can hold atleast `size` floats.
   * @param size - minimum capacity required
   * @returns - buffer than can hold atleast `size` floats
   */
  getAttributeBuffer(t) {
    const e = Rs(Math.ceil(t / 8)), i = vh(e), s = e * 8;
    this._aBuffers.length <= i && (this._iBuffers.length = i + 1);
    let n = this._aBuffers[s];
    return n || (this._aBuffers[s] = n = new go(s * this.vertexSize * 4)), n;
  }
  /**
   * Fetches an index buffer from `this._iBuffers` that can
   * have at least `size` capacity.
   * @param size - minimum required capacity
   * @returns - buffer that can fit `size` indices.
   */
  getIndexBuffer(t) {
    const e = Rs(Math.ceil(t / 12)), i = vh(e), s = e * 12;
    this._iBuffers.length <= i && (this._iBuffers.length = i + 1);
    let n = this._iBuffers[i];
    return n || (this._iBuffers[i] = n = new Uint16Array(s)), n;
  }
  /**
   * Takes the four batching parameters of `element`, interleaves
   * and pushes them into the batching attribute/index buffers given.
   *
   * It uses these properties: `vertexData` `uvs`, `textureId` and
   * `indicies`. It also uses the "tint" of the base-texture, if
   * present.
   * @param {PIXI.DisplayObject} element - element being rendered
   * @param attributeBuffer - attribute buffer.
   * @param indexBuffer - index buffer
   * @param aIndex - number of floats already in the attribute buffer
   * @param iIndex - number of indices already in `indexBuffer`
   */
  packInterleavedGeometry(t, e, i, s, n) {
    const {
      uint32View: o,
      float32View: a
    } = e, h = s / this.vertexSize, l = t.uvs, c = t.indices, u = t.vertexData, d = t._texture.baseTexture._batchLocation, f = Math.min(t.worldAlpha, 1), p = pt.shared.setValue(t._tintRGB).toPremultiplied(f, t._texture.baseTexture.alphaMode > 0);
    for (let m = 0; m < u.length; m += 2)
      a[s++] = u[m], a[s++] = u[m + 1], a[s++] = l[m], a[s++] = l[m + 1], o[s++] = p, a[s++] = d;
    for (let m = 0; m < c.length; m++)
      i[n++] = h + c[m];
  }
};
fi.defaultBatchSize = 4096, /** @ignore */
fi.extension = {
  name: "batch",
  type: k.RendererPlugin
}, /**
* Pool of `BatchDrawCall` objects that `flush` used
* to create "batches" of the objects being rendered.
*
* These are never re-allocated again.
* Shared between all batch renderers because it can be only one "flush" working at the moment.
* @member {PIXI.BatchDrawCall[]}
*/
fi._drawCallPool = [], /**
* Pool of `BatchDrawCall` objects that `flush` used
* to create "batches" of the objects being rendered.
*
* These are never re-allocated again.
* Shared between all batch renderers because it can be only one "flush" working at the moment.
* @member {PIXI.BatchTextureArray[]}
*/
fi._textureArrayPool = [];
let lr = fi;
z.add(lr);
var mg = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void){
   gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`, gg = `attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`;
const wo = class pi extends Ee {
  /**
   * @param vertexSrc - The source of the vertex shader.
   * @param fragmentSrc - The source of the fragment shader.
   * @param uniforms - Custom uniforms to use to augment the built-in ones.
   */
  constructor(t, e, i) {
    const s = De.from(
      t || pi.defaultVertexSrc,
      e || pi.defaultFragmentSrc
    );
    super(s, i), this.padding = 0, this.resolution = pi.defaultResolution, this.multisample = pi.defaultMultisample, this.enabled = !0, this.autoFit = !0, this.state = new Ae();
  }
  /**
   * Applies the filter
   * @param {PIXI.FilterSystem} filterManager - The renderer to retrieve the filter from
   * @param {PIXI.RenderTexture} input - The input render target.
   * @param {PIXI.RenderTexture} output - The target to output to.
   * @param {PIXI.CLEAR_MODES} [clearMode] - Should the output be cleared before rendering to it.
   * @param {object} [_currentState] - It's current state of filter.
   *        There are some useful properties in the currentState :
   *        target, filters, sourceFrame, destinationFrame, renderTarget, resolution
   */
  apply(t, e, i, s, n) {
    t.applyFilter(this, e, i, s);
  }
  /**
   * Sets the blend mode of the filter.
   * @default PIXI.BLEND_MODES.NORMAL
   */
  get blendMode() {
    return this.state.blendMode;
  }
  set blendMode(t) {
    this.state.blendMode = t;
  }
  /**
   * The resolution of the filter. Setting this to be lower will lower the quality but
   * increase the performance of the filter.
   * If set to `null` or `0`, the resolution of the current render target is used.
   * @default PIXI.Filter.defaultResolution
   */
  get resolution() {
    return this._resolution;
  }
  set resolution(t) {
    this._resolution = t;
  }
  /**
   * The default vertex shader source
   * @readonly
   */
  static get defaultVertexSrc() {
    return gg;
  }
  /**
   * The default fragment shader source
   * @readonly
   */
  static get defaultFragmentSrc() {
    return mg;
  }
};
wo.defaultResolution = 1, /**
* Default filter samples for any filter.
* @static
* @type {PIXI.MSAA_QUALITY|null}
* @default PIXI.MSAA_QUALITY.NONE
*/
wo.defaultMultisample = It.NONE;
let Gt = wo;
class Bs {
  constructor() {
    this.clearBeforeRender = !0, this._backgroundColor = new pt(0), this.alpha = 1;
  }
  /**
   * initiates the background system
   * @param {PIXI.IRendererOptions} options - the options for the background colors
   */
  init(t) {
    this.clearBeforeRender = t.clearBeforeRender;
    const { backgroundColor: e, background: i, backgroundAlpha: s } = t, n = i ?? e;
    n !== void 0 && (this.color = n), this.alpha = s;
  }
  /**
   * The background color to fill if not transparent.
   * @member {PIXI.ColorSource}
   */
  get color() {
    return this._backgroundColor.value;
  }
  set color(t) {
    this._backgroundColor.setValue(t);
  }
  /**
   * The background color alpha. Setting this to 0 will make the canvas transparent.
   * @member {number}
   */
  get alpha() {
    return this._backgroundColor.alpha;
  }
  set alpha(t) {
    this._backgroundColor.setAlpha(t);
  }
  /** The background color object. */
  get backgroundColor() {
    return this._backgroundColor;
  }
  destroy() {
  }
}
Bs.defaultOptions = {
  /**
   * {@link PIXI.IRendererOptions.backgroundAlpha}
   * @default 1
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  backgroundAlpha: 1,
  /**
   * {@link PIXI.IRendererOptions.backgroundColor}
   * @default 0x000000
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  backgroundColor: 0,
  /**
   * {@link PIXI.IRendererOptions.clearBeforeRender}
   * @default true
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  clearBeforeRender: !0
}, /** @ignore */
Bs.extension = {
  type: [
    k.RendererSystem,
    k.CanvasRendererSystem
  ],
  name: "background"
};
z.add(Bs);
class Tc {
  /**
   * @param renderer - The renderer this System works for.
   */
  constructor(t) {
    this.renderer = t, this.emptyRenderer = new Zs(t), this.currentRenderer = this.emptyRenderer;
  }
  /**
   * Changes the current renderer to the one given in parameter
   * @param objectRenderer - The object renderer to use.
   */
  setObjectRenderer(t) {
    this.currentRenderer !== t && (this.currentRenderer.stop(), this.currentRenderer = t, this.currentRenderer.start());
  }
  /**
   * This should be called if you wish to do some custom rendering
   * It will basically render anything that may be batched up such as sprites
   */
  flush() {
    this.setObjectRenderer(this.emptyRenderer);
  }
  /** Reset the system to an empty renderer */
  reset() {
    this.setObjectRenderer(this.emptyRenderer);
  }
  /**
   * Handy function for batch renderers: copies bound textures in first maxTextures locations to array
   * sets actual _batchLocation for them
   * @param arr - arr copy destination
   * @param maxTextures - number of copied elements
   */
  copyBoundTextures(t, e) {
    const { boundTextures: i } = this.renderer.texture;
    for (let s = e - 1; s >= 0; --s)
      t[s] = i[s] || null, t[s] && (t[s]._batchLocation = s);
  }
  /**
   * Assigns batch locations to textures in array based on boundTextures state.
   * All textures in texArray should have `_batchEnabled = _batchId`,
   * and their count should be less than `maxTextures`.
   * @param texArray - textures to bound
   * @param boundTextures - current state of bound textures
   * @param batchId - marker for _batchEnabled param of textures in texArray
   * @param maxTextures - number of texture locations to manipulate
   */
  boundArray(t, e, i, s) {
    const { elements: n, ids: o, count: a } = t;
    let h = 0;
    for (let l = 0; l < a; l++) {
      const c = n[l], u = c._batchLocation;
      if (u >= 0 && u < s && e[u] === c) {
        o[l] = u;
        continue;
      }
      for (; h < s; ) {
        const d = e[h];
        if (d && d._batchEnabled === i && d._batchLocation === h) {
          h++;
          continue;
        }
        o[l] = h, c._batchLocation = h, e[h] = c;
        break;
      }
    }
  }
  /**
   * @ignore
   */
  destroy() {
    this.renderer = null;
  }
}
Tc.extension = {
  type: k.RendererSystem,
  name: "batch"
};
z.add(Tc);
let Ph = 0;
class Ds {
  /** @param renderer - The renderer this System works for. */
  constructor(t) {
    this.renderer = t, this.webGLVersion = 1, this.extensions = {}, this.supports = {
      uint32Indices: !1
    }, this.handleContextLost = this.handleContextLost.bind(this), this.handleContextRestored = this.handleContextRestored.bind(this);
  }
  /**
   * `true` if the context is lost
   * @readonly
   */
  get isLost() {
    return !this.gl || this.gl.isContextLost();
  }
  /**
   * Handles the context change event.
   * @param {WebGLRenderingContext} gl - New WebGL context.
   */
  contextChange(t) {
    this.gl = t, this.renderer.gl = t, this.renderer.CONTEXT_UID = Ph++;
  }
  init(t) {
    if (t.context)
      this.initFromContext(t.context);
    else {
      const e = this.renderer.background.alpha < 1, i = t.premultipliedAlpha;
      this.preserveDrawingBuffer = t.preserveDrawingBuffer, this.useContextAlpha = t.useContextAlpha, this.powerPreference = t.powerPreference, this.initFromOptions({
        alpha: e,
        premultipliedAlpha: i,
        antialias: t.antialias,
        stencil: !0,
        preserveDrawingBuffer: t.preserveDrawingBuffer,
        powerPreference: t.powerPreference
      });
    }
  }
  /**
   * Initializes the context.
   * @protected
   * @param {WebGLRenderingContext} gl - WebGL context
   */
  initFromContext(t) {
    this.gl = t, this.validateContext(t), this.renderer.gl = t, this.renderer.CONTEXT_UID = Ph++, this.renderer.runners.contextChange.emit(t);
    const e = this.renderer.view;
    e.addEventListener !== void 0 && (e.addEventListener("webglcontextlost", this.handleContextLost, !1), e.addEventListener("webglcontextrestored", this.handleContextRestored, !1));
  }
  /**
   * Initialize from context options
   * @protected
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
   * @param {object} options - context attributes
   */
  initFromOptions(t) {
    const e = this.createContext(this.renderer.view, t);
    this.initFromContext(e);
  }
  /**
   * Helper class to create a WebGL Context
   * @param canvas - the canvas element that we will get the context from
   * @param options - An options object that gets passed in to the canvas element containing the
   *    context attributes
   * @see https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement/getContext
   * @returns {WebGLRenderingContext} the WebGL context
   */
  createContext(t, e) {
    let i;
    if (H.PREFER_ENV >= wr.WEBGL2 && (i = t.getContext("webgl2", e)), i)
      this.webGLVersion = 2;
    else if (this.webGLVersion = 1, i = t.getContext("webgl", e) || t.getContext("experimental-webgl", e), !i)
      throw new Error("This browser does not support WebGL. Try using the canvas renderer");
    return this.gl = i, this.getExtensions(), this.gl;
  }
  /** Auto-populate the {@link PIXI.ContextSystem.extensions extensions}. */
  getExtensions() {
    const { gl: t } = this, e = {
      loseContext: t.getExtension("WEBGL_lose_context"),
      anisotropicFiltering: t.getExtension("EXT_texture_filter_anisotropic"),
      floatTextureLinear: t.getExtension("OES_texture_float_linear"),
      s3tc: t.getExtension("WEBGL_compressed_texture_s3tc"),
      s3tc_sRGB: t.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
      // eslint-disable-line camelcase
      etc: t.getExtension("WEBGL_compressed_texture_etc"),
      etc1: t.getExtension("WEBGL_compressed_texture_etc1"),
      pvrtc: t.getExtension("WEBGL_compressed_texture_pvrtc") || t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
      atc: t.getExtension("WEBGL_compressed_texture_atc"),
      astc: t.getExtension("WEBGL_compressed_texture_astc")
    };
    this.webGLVersion === 1 ? Object.assign(this.extensions, e, {
      drawBuffers: t.getExtension("WEBGL_draw_buffers"),
      depthTexture: t.getExtension("WEBGL_depth_texture"),
      vertexArrayObject: t.getExtension("OES_vertex_array_object") || t.getExtension("MOZ_OES_vertex_array_object") || t.getExtension("WEBKIT_OES_vertex_array_object"),
      uint32ElementIndex: t.getExtension("OES_element_index_uint"),
      // Floats and half-floats
      floatTexture: t.getExtension("OES_texture_float"),
      floatTextureLinear: t.getExtension("OES_texture_float_linear"),
      textureHalfFloat: t.getExtension("OES_texture_half_float"),
      textureHalfFloatLinear: t.getExtension("OES_texture_half_float_linear")
    }) : this.webGLVersion === 2 && Object.assign(this.extensions, e, {
      // Floats and half-floats
      colorBufferFloat: t.getExtension("EXT_color_buffer_float")
    });
  }
  /**
   * Handles a lost webgl context
   * @param {WebGLContextEvent} event - The context lost event.
   */
  handleContextLost(t) {
    t.preventDefault(), setTimeout(() => {
      this.gl.isContextLost() && this.extensions.loseContext && this.extensions.loseContext.restoreContext();
    }, 0);
  }
  /** Handles a restored webgl context. */
  handleContextRestored() {
    this.renderer.runners.contextChange.emit(this.gl);
  }
  destroy() {
    const t = this.renderer.view;
    this.renderer = null, t.removeEventListener !== void 0 && (t.removeEventListener("webglcontextlost", this.handleContextLost), t.removeEventListener("webglcontextrestored", this.handleContextRestored)), this.gl.useProgram(null), this.extensions.loseContext && this.extensions.loseContext.loseContext();
  }
  /** Handle the post-render runner event. */
  postrender() {
    this.renderer.objectRenderer.renderingToScreen && this.gl.flush();
  }
  /**
   * Validate context.
   * @param {WebGLRenderingContext} gl - Render context.
   */
  validateContext(t) {
    const e = t.getContextAttributes(), i = "WebGL2RenderingContext" in globalThis && t instanceof globalThis.WebGL2RenderingContext;
    i && (this.webGLVersion = 2), e && !e.stencil && console.warn("Provided WebGL context does not have a stencil buffer, masks may not render correctly");
    const s = i || !!t.getExtension("OES_element_index_uint");
    this.supports.uint32Indices = s, s || console.warn("Provided WebGL context does not support 32 index buffer, complex graphics may not render correctly");
  }
}
Ds.defaultOptions = {
  /**
   * {@link PIXI.IRendererOptions.context}
   * @default null
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  context: null,
  /**
   * {@link PIXI.IRendererOptions.antialias}
   * @default false
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  antialias: !1,
  /**
   * {@link PIXI.IRendererOptions.premultipliedAlpha}
   * @default true
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  premultipliedAlpha: !0,
  /**
   * {@link PIXI.IRendererOptions.preserveDrawingBuffer}
   * @default false
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  preserveDrawingBuffer: !1,
  /**
   * {@link PIXI.IRendererOptions.powerPreference}
   * @default default
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  powerPreference: "default"
}, /** @ignore */
Ds.extension = {
  type: k.RendererSystem,
  name: "context"
};
z.add(Ds);
class Ao {
  /**
   * @param width - Width of the frame buffer
   * @param height - Height of the frame buffer
   */
  constructor(t, e) {
    if (this.width = Math.round(t), this.height = Math.round(e), !this.width || !this.height)
      throw new Error("Framebuffer width or height is zero");
    this.stencil = !1, this.depth = !1, this.dirtyId = 0, this.dirtyFormat = 0, this.dirtySize = 0, this.depthTexture = null, this.colorTextures = [], this.glFramebuffers = {}, this.disposeRunner = new ce("disposeFramebuffer"), this.multisample = It.NONE;
  }
  /**
   * Reference to the colorTexture.
   * @readonly
   */
  get colorTexture() {
    return this.colorTextures[0];
  }
  /**
   * Add texture to the colorTexture array.
   * @param index - Index of the array to add the texture to
   * @param texture - Texture to add to the array
   */
  addColorTexture(t = 0, e) {
    return this.colorTextures[t] = e || new J(null, {
      scaleMode: Pe.NEAREST,
      resolution: 1,
      mipmap: we.OFF,
      width: this.width,
      height: this.height
    }), this.dirtyId++, this.dirtyFormat++, this;
  }
  /**
   * Add a depth texture to the frame buffer.
   * @param texture - Texture to add.
   */
  addDepthTexture(t) {
    return this.depthTexture = t || new J(null, {
      scaleMode: Pe.NEAREST,
      resolution: 1,
      width: this.width,
      height: this.height,
      mipmap: we.OFF,
      format: F.DEPTH_COMPONENT,
      type: $.UNSIGNED_SHORT
    }), this.dirtyId++, this.dirtyFormat++, this;
  }
  /** Enable depth on the frame buffer. */
  enableDepth() {
    return this.depth = !0, this.dirtyId++, this.dirtyFormat++, this;
  }
  /** Enable stencil on the frame buffer. */
  enableStencil() {
    return this.stencil = !0, this.dirtyId++, this.dirtyFormat++, this;
  }
  /**
   * Resize the frame buffer
   * @param width - Width of the frame buffer to resize to
   * @param height - Height of the frame buffer to resize to
   */
  resize(t, e) {
    if (t = Math.round(t), e = Math.round(e), !t || !e)
      throw new Error("Framebuffer width and height must not be zero");
    if (!(t === this.width && e === this.height)) {
      this.width = t, this.height = e, this.dirtyId++, this.dirtySize++;
      for (let i = 0; i < this.colorTextures.length; i++) {
        const s = this.colorTextures[i], n = s.resolution;
        s.setSize(t / n, e / n);
      }
      if (this.depthTexture) {
        const i = this.depthTexture.resolution;
        this.depthTexture.setSize(t / i, e / i);
      }
    }
  }
  /** Disposes WebGL resources that are connected to this geometry. */
  dispose() {
    this.disposeRunner.emit(this, !1);
  }
  /** Destroys and removes the depth texture added to this framebuffer. */
  destroyDepthTexture() {
    this.depthTexture && (this.depthTexture.destroy(), this.depthTexture = null, ++this.dirtyId, ++this.dirtyFormat);
  }
}
class Ec extends J {
  /**
   * @param options
   * @param {number} [options.width=100] - The width of the base render texture.
   * @param {number} [options.height=100] - The height of the base render texture.
   * @param {PIXI.SCALE_MODES} [options.scaleMode=PIXI.BaseTexture.defaultOptions.scaleMode] - See {@link PIXI.SCALE_MODES}
   *   for possible values.
   * @param {number} [options.resolution=PIXI.settings.RESOLUTION] - The resolution / device pixel ratio
   *   of the texture being generated.
   * @param {PIXI.MSAA_QUALITY} [options.multisample=PIXI.MSAA_QUALITY.NONE] - The number of samples of the frame buffer.
   */
  constructor(t = {}) {
    if (typeof t == "number") {
      const e = arguments[0], i = arguments[1], s = arguments[2], n = arguments[3];
      t = { width: e, height: i, scaleMode: s, resolution: n };
    }
    t.width = t.width ?? 100, t.height = t.height ?? 100, t.multisample ?? (t.multisample = It.NONE), super(null, t), this.mipmap = we.OFF, this.valid = !0, this._clear = new pt([0, 0, 0, 0]), this.framebuffer = new Ao(this.realWidth, this.realHeight).addColorTexture(0, this), this.framebuffer.multisample = t.multisample, this.maskStack = [], this.filterStack = [{}];
  }
  /** Color when clearning the texture. */
  set clearColor(t) {
    this._clear.setValue(t);
  }
  get clearColor() {
    return this._clear.value;
  }
  /**
   * Color object when clearning the texture.
   * @readonly
   * @since 7.2.0
   */
  get clear() {
    return this._clear;
  }
  /**
   * Shortcut to `this.framebuffer.multisample`.
   * @default PIXI.MSAA_QUALITY.NONE
   */
  get multisample() {
    return this.framebuffer.multisample;
  }
  set multisample(t) {
    this.framebuffer.multisample = t;
  }
  /**
   * Resizes the BaseRenderTexture.
   * @param desiredWidth - The desired width to resize to.
   * @param desiredHeight - The desired height to resize to.
   */
  resize(t, e) {
    this.framebuffer.resize(t * this.resolution, e * this.resolution), this.setRealSize(this.framebuffer.width, this.framebuffer.height);
  }
  /**
   * Frees the texture and framebuffer from WebGL memory without destroying this texture object.
   * This means you can still use the texture later which will upload it to GPU
   * memory again.
   * @fires PIXI.BaseTexture#dispose
   */
  dispose() {
    this.framebuffer.dispose(), super.dispose();
  }
  /** Destroys this texture. */
  destroy() {
    super.destroy(), this.framebuffer.destroyDepthTexture(), this.framebuffer = null;
  }
}
class Ze extends Pi {
  /**
   * @param {HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas} source
   */
  constructor(t) {
    const e = t, i = e.naturalWidth || e.videoWidth || e.width, s = e.naturalHeight || e.videoHeight || e.height;
    super(i, s), this.source = t, this.noSubImage = !1;
  }
  /**
   * Set cross origin based detecting the url and the crossorigin
   * @param element - Element to apply crossOrigin
   * @param url - URL to check
   * @param crossorigin - Cross origin value to use
   */
  static crossOrigin(t, e, i) {
    i === void 0 && !e.startsWith("data:") ? t.crossOrigin = Um(e) : i !== !1 && (t.crossOrigin = typeof i == "string" ? i : "anonymous");
  }
  /**
   * Upload the texture to the GPU.
   * @param renderer - Upload to the renderer
   * @param baseTexture - Reference to parent texture
   * @param glTexture
   * @param {HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas} [source] - (optional)
   * @returns - true is success
   */
  upload(t, e, i, s) {
    const n = t.gl, o = e.realWidth, a = e.realHeight;
    if (s = s || this.source, typeof HTMLImageElement < "u" && s instanceof HTMLImageElement) {
      if (!s.complete || s.naturalWidth === 0)
        return !1;
    } else if (typeof HTMLVideoElement < "u" && s instanceof HTMLVideoElement && s.readyState <= 1)
      return !1;
    return n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e.alphaMode === Ht.UNPACK), !this.noSubImage && e.target === n.TEXTURE_2D && i.width === o && i.height === a ? n.texSubImage2D(n.TEXTURE_2D, 0, 0, 0, e.format, i.type, s) : (i.width = o, i.height = a, n.texImage2D(e.target, 0, i.internalFormat, e.format, i.type, s)), !0;
  }
  /**
   * Checks if source width/height was changed, resize can cause extra baseTexture update.
   * Triggers one update in any case.
   */
  update() {
    if (this.destroyed)
      return;
    const t = this.source, e = t.naturalWidth || t.videoWidth || t.width, i = t.naturalHeight || t.videoHeight || t.height;
    this.resize(e, i), super.update();
  }
  /** Destroy this {@link PIXI.BaseImageResource} */
  dispose() {
    this.source = null;
  }
}
class wc extends Ze {
  /**
   * @param source - image source or URL
   * @param options
   * @param {boolean} [options.autoLoad=true] - start loading process
   * @param {boolean} [options.createBitmap=PIXI.settings.CREATE_IMAGE_BITMAP] - whether its required to create
   *        a bitmap before upload
   * @param {boolean} [options.crossorigin=true] - Load image using cross origin
   * @param {PIXI.ALPHA_MODES} [options.alphaMode=PIXI.ALPHA_MODES.UNPACK] - Premultiply image alpha in bitmap
   */
  constructor(t, e) {
    if (e = e || {}, typeof t == "string") {
      const i = new Image();
      Ze.crossOrigin(i, t, e.crossorigin), i.src = t, t = i;
    }
    super(t), !t.complete && this._width && this._height && (this._width = 0, this._height = 0), this.url = t.src, this._process = null, this.preserveBitmap = !1, this.createBitmap = (e.createBitmap ?? H.CREATE_IMAGE_BITMAP) && !!globalThis.createImageBitmap, this.alphaMode = typeof e.alphaMode == "number" ? e.alphaMode : null, this.bitmap = null, this._load = null, e.autoLoad !== !1 && this.load();
  }
  /**
   * Returns a promise when image will be loaded and processed.
   * @param createBitmap - whether process image into bitmap
   */
  load(t) {
    return this._load ? this._load : (t !== void 0 && (this.createBitmap = t), this._load = new Promise((e, i) => {
      const s = this.source;
      this.url = s.src;
      const n = () => {
        this.destroyed || (s.onload = null, s.onerror = null, this.update(), this._load = null, this.createBitmap ? e(this.process()) : e(this));
      };
      s.complete && s.src ? n() : (s.onload = n, s.onerror = (o) => {
        i(o), this.onError.emit(o);
      });
    }), this._load);
  }
  /**
   * Called when we need to convert image into BitmapImage.
   * Can be called multiple times, real promise is cached inside.
   * @returns - Cached promise to fill that bitmap
   */
  process() {
    const t = this.source;
    if (this._process !== null)
      return this._process;
    if (this.bitmap !== null || !globalThis.createImageBitmap)
      return Promise.resolve(this);
    const e = globalThis.createImageBitmap, i = !t.crossOrigin || t.crossOrigin === "anonymous";
    return this._process = fetch(
      t.src,
      {
        mode: i ? "cors" : "no-cors"
      }
    ).then((s) => s.blob()).then((s) => e(
      s,
      0,
      0,
      t.width,
      t.height,
      {
        premultiplyAlpha: this.alphaMode === null || this.alphaMode === Ht.UNPACK ? "premultiply" : "none"
      }
    )).then((s) => this.destroyed ? Promise.reject() : (this.bitmap = s, this.update(), this._process = null, Promise.resolve(this))), this._process;
  }
  /**
   * Upload the image resource to GPU.
   * @param renderer - Renderer to upload to
   * @param baseTexture - BaseTexture for this resource
   * @param glTexture - GLTexture to use
   * @returns {boolean} true is success
   */
  upload(t, e, i) {
    if (typeof this.alphaMode == "number" && (e.alphaMode = this.alphaMode), !this.createBitmap)
      return super.upload(t, e, i);
    if (!this.bitmap && (this.process(), !this.bitmap))
      return !1;
    if (super.upload(t, e, i, this.bitmap), !this.preserveBitmap) {
      let s = !0;
      const n = e._glTextures;
      for (const o in n) {
        const a = n[o];
        if (a !== i && a.dirtyId !== e.dirtyId) {
          s = !1;
          break;
        }
      }
      s && (this.bitmap.close && this.bitmap.close(), this.bitmap = null);
    }
    return !0;
  }
  /** Destroys this resource. */
  dispose() {
    this.source.onload = null, this.source.onerror = null, super.dispose(), this.bitmap && (this.bitmap.close(), this.bitmap = null), this._process = null, this._load = null;
  }
  /**
   * Used to auto-detect the type of resource.
   * @param {*} source - The source object
   * @returns {boolean} `true` if current environment support HTMLImageElement, and source is string or HTMLImageElement
   */
  static test(t) {
    return typeof HTMLImageElement < "u" && (typeof t == "string" || t instanceof HTMLImageElement);
  }
}
class fa {
  constructor() {
    this.x0 = 0, this.y0 = 0, this.x1 = 1, this.y1 = 0, this.x2 = 1, this.y2 = 1, this.x3 = 0, this.y3 = 1, this.uvsFloat32 = new Float32Array(8);
  }
  /**
   * Sets the texture Uvs based on the given frame information.
   * @protected
   * @param frame - The frame of the texture
   * @param baseFrame - The base frame of the texture
   * @param rotate - Rotation of frame, see {@link PIXI.groupD8}
   */
  set(t, e, i) {
    const s = e.width, n = e.height;
    if (i) {
      const o = t.width / 2 / s, a = t.height / 2 / n, h = t.x / s + o, l = t.y / n + a;
      i = xt.add(i, xt.NW), this.x0 = h + o * xt.uX(i), this.y0 = l + a * xt.uY(i), i = xt.add(i, 2), this.x1 = h + o * xt.uX(i), this.y1 = l + a * xt.uY(i), i = xt.add(i, 2), this.x2 = h + o * xt.uX(i), this.y2 = l + a * xt.uY(i), i = xt.add(i, 2), this.x3 = h + o * xt.uX(i), this.y3 = l + a * xt.uY(i);
    } else
      this.x0 = t.x / s, this.y0 = t.y / n, this.x1 = (t.x + t.width) / s, this.y1 = t.y / n, this.x2 = (t.x + t.width) / s, this.y2 = (t.y + t.height) / n, this.x3 = t.x / s, this.y3 = (t.y + t.height) / n;
    this.uvsFloat32[0] = this.x0, this.uvsFloat32[1] = this.y0, this.uvsFloat32[2] = this.x1, this.uvsFloat32[3] = this.y1, this.uvsFloat32[4] = this.x2, this.uvsFloat32[5] = this.y2, this.uvsFloat32[6] = this.x3, this.uvsFloat32[7] = this.y3;
  }
}
fa.prototype.toString = function() {
  return `[@pixi/core:TextureUvs x0=${this.x0} y0=${this.y0} x1=${this.x1} y1=${this.y1} x2=${this.x2} y2=${this.y2} x3=${this.x3} y3=${this.y3}]`;
};
const Mh = new fa();
function Ki(r) {
  r.destroy = function() {
  }, r.on = function() {
  }, r.once = function() {
  }, r.emit = function() {
  };
}
class j extends Bi {
  /**
   * @param baseTexture - The base texture source to create the texture from
   * @param frame - The rectangle frame of the texture to show
   * @param orig - The area of original texture
   * @param trim - Trimmed rectangle of original texture
   * @param rotate - indicates how the texture was rotated by texture packer. See {@link PIXI.groupD8}
   * @param anchor - Default anchor point used for sprite placement / rotation
   * @param borders - Default borders used for 9-slice scaling. See {@link PIXI.NineSlicePlane}
   */
  constructor(t, e, i, s, n, o, a) {
    if (super(), this.noFrame = !1, e || (this.noFrame = !0, e = new tt(0, 0, 1, 1)), t instanceof j && (t = t.baseTexture), this.baseTexture = t, this._frame = e, this.trim = s, this.valid = !1, this.destroyed = !1, this._uvs = Mh, this.uvMatrix = null, this.orig = i || e, this._rotate = Number(n || 0), n === !0)
      this._rotate = 2;
    else if (this._rotate % 2 !== 0)
      throw new Error("attempt to use diamond-shaped UVs. If you are sure, set rotation manually");
    this.defaultAnchor = o ? new lt(o.x, o.y) : new lt(0, 0), this.defaultBorders = a, this._updateID = 0, this.textureCacheIds = [], t.valid ? this.noFrame ? t.valid && this.onBaseTextureUpdated(t) : this.frame = e : t.once("loaded", this.onBaseTextureUpdated, this), this.noFrame && t.on("update", this.onBaseTextureUpdated, this);
  }
  /**
   * Updates this texture on the gpu.
   *
   * Calls the TextureResource update.
   *
   * If you adjusted `frame` manually, please call `updateUvs()` instead.
   */
  update() {
    this.baseTexture.resource && this.baseTexture.resource.update();
  }
  /**
   * Called when the base texture is updated
   * @protected
   * @param baseTexture - The base texture.
   */
  onBaseTextureUpdated(t) {
    if (this.noFrame) {
      if (!this.baseTexture.valid)
        return;
      this._frame.width = t.width, this._frame.height = t.height, this.valid = !0, this.updateUvs();
    } else
      this.frame = this._frame;
    this.emit("update", this);
  }
  /**
   * Destroys this texture
   * @param [destroyBase=false] - Whether to destroy the base texture as well
   * @fires PIXI.Texture#destroyed
   */
  destroy(t) {
    if (this.baseTexture) {
      if (t) {
        const { resource: e } = this.baseTexture;
        e != null && e.url && ge[e.url] && j.removeFromCache(e.url), this.baseTexture.destroy();
      }
      this.baseTexture.off("loaded", this.onBaseTextureUpdated, this), this.baseTexture.off("update", this.onBaseTextureUpdated, this), this.baseTexture = null;
    }
    this._frame = null, this._uvs = null, this.trim = null, this.orig = null, this.valid = !1, j.removeFromCache(this), this.textureCacheIds = null, this.destroyed = !0, this.emit("destroyed", this), this.removeAllListeners();
  }
  /**
   * Creates a new texture object that acts the same as this one.
   * @returns - The new texture
   */
  clone() {
    var s;
    const t = this._frame.clone(), e = this._frame === this.orig ? t : this.orig.clone(), i = new j(
      this.baseTexture,
      !this.noFrame && t,
      e,
      (s = this.trim) == null ? void 0 : s.clone(),
      this.rotate,
      this.defaultAnchor,
      this.defaultBorders
    );
    return this.noFrame && (i._frame = t), i;
  }
  /**
   * Updates the internal WebGL UV cache. Use it after you change `frame` or `trim` of the texture.
   * Call it after changing the frame
   */
  updateUvs() {
    this._uvs === Mh && (this._uvs = new fa()), this._uvs.set(this._frame, this.baseTexture, this.rotate), this._updateID++;
  }
  /**
   * Helper function that creates a new Texture based on the source you provide.
   * The source can be - frame id, image url, video url, canvas element, video element, base texture
   * @param {string|PIXI.BaseTexture|HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas} source -
   *        Source or array of sources to create texture from
   * @param options - See {@link PIXI.BaseTexture}'s constructor for options.
   * @param {string} [options.pixiIdPrefix=pixiid] - If a source has no id, this is the prefix of the generated id
   * @param {boolean} [strict] - Enforce strict-mode, see {@link PIXI.settings.STRICT_TEXTURE_CACHE}.
   * @returns {PIXI.Texture} The newly created texture
   */
  static from(t, e = {}, i = H.STRICT_TEXTURE_CACHE) {
    const s = typeof t == "string";
    let n = null;
    if (s)
      n = t;
    else if (t instanceof J) {
      if (!t.cacheId) {
        const a = (e == null ? void 0 : e.pixiIdPrefix) || "pixiid";
        t.cacheId = `${a}-${br()}`, J.addToCache(t, t.cacheId);
      }
      n = t.cacheId;
    } else {
      if (!t._pixiId) {
        const a = (e == null ? void 0 : e.pixiIdPrefix) || "pixiid";
        t._pixiId = `${a}_${br()}`;
      }
      n = t._pixiId;
    }
    let o = ge[n];
    if (s && i && !o)
      throw new Error(`The cacheId "${n}" does not exist in TextureCache.`);
    return !o && !(t instanceof J) ? (e.resolution || (e.resolution = Oe(t)), o = new j(new J(t, e)), o.baseTexture.cacheId = n, J.addToCache(o.baseTexture, n), j.addToCache(o, n)) : !o && t instanceof J && (o = new j(t), j.addToCache(o, n)), o;
  }
  /**
   * Useful for loading textures via URLs. Use instead of `Texture.from` because
   * it does a better job of handling failed URLs more effectively. This also ignores
   * `PIXI.settings.STRICT_TEXTURE_CACHE`. Works for Videos, SVGs, Images.
   * @param url - The remote URL or array of URLs to load.
   * @param options - Optional options to include
   * @returns - A Promise that resolves to a Texture.
   */
  static fromURL(t, e) {
    const i = Object.assign({ autoLoad: !1 }, e == null ? void 0 : e.resourceOptions), s = j.from(t, Object.assign({ resourceOptions: i }, e), !1), n = s.baseTexture.resource;
    return s.baseTexture.valid ? Promise.resolve(s) : n.load().then(() => Promise.resolve(s));
  }
  /**
   * Create a new Texture with a BufferResource from a typed array.
   * @param buffer - The optional array to use. If no data is provided, a new Float32Array is created.
   * @param width - Width of the resource
   * @param height - Height of the resource
   * @param options - See {@link PIXI.BaseTexture}'s constructor for options.
   *        Default properties are different from the constructor's defaults.
   * @param {PIXI.FORMATS} [options.format] - The format is not given, the type is inferred from the
   *        type of the buffer: `RGBA` if Float32Array, Int8Array, Uint8Array, or Uint8ClampedArray,
   *        otherwise `RGBA_INTEGER`.
   * @param {PIXI.TYPES} [options.type] - The type is not given, the type is inferred from the
   *        type of the buffer. Maps Float32Array to `FLOAT`, Int32Array to `INT`, Uint32Array to
   *        `UNSIGNED_INT`, Int16Array to `SHORT`, Uint16Array to `UNSIGNED_SHORT`, Int8Array to `BYTE`,
   *        Uint8Array/Uint8ClampedArray to `UNSIGNED_BYTE`.
   * @param {PIXI.ALPHA_MODES} [options.alphaMode=PIXI.ALPHA_MODES.NPM]
   * @param {PIXI.SCALE_MODES} [options.scaleMode=PIXI.SCALE_MODES.NEAREST]
   * @returns - The resulting new BaseTexture
   */
  static fromBuffer(t, e, i, s) {
    return new j(J.fromBuffer(t, e, i, s));
  }
  /**
   * Create a texture from a source and add to the cache.
   * @param {HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas|string} source - The input source.
   * @param imageUrl - File name of texture, for cache and resolving resolution.
   * @param name - Human readable name for the texture cache. If no name is
   *        specified, only `imageUrl` will be used as the cache ID.
   * @param options
   * @returns - Output texture
   */
  static fromLoader(t, e, i, s) {
    const n = new J(t, Object.assign({
      scaleMode: J.defaultOptions.scaleMode,
      resolution: Oe(e)
    }, s)), { resource: o } = n;
    o instanceof wc && (o.url = e);
    const a = new j(n);
    return i || (i = e), J.addToCache(a.baseTexture, i), j.addToCache(a, i), i !== e && (J.addToCache(a.baseTexture, e), j.addToCache(a, e)), a.baseTexture.valid ? Promise.resolve(a) : new Promise((h) => {
      a.baseTexture.once("loaded", () => h(a));
    });
  }
  /**
   * Adds a Texture to the global TextureCache. This cache is shared across the whole PIXI object.
   * @param texture - The Texture to add to the cache.
   * @param id - The id that the Texture will be stored against.
   */
  static addToCache(t, e) {
    e && (t.textureCacheIds.includes(e) || t.textureCacheIds.push(e), ge[e] && ge[e] !== t && console.warn(`Texture added to the cache with an id [${e}] that already had an entry`), ge[e] = t);
  }
  /**
   * Remove a Texture from the global TextureCache.
   * @param texture - id of a Texture to be removed, or a Texture instance itself
   * @returns - The Texture that was removed
   */
  static removeFromCache(t) {
    if (typeof t == "string") {
      const e = ge[t];
      if (e) {
        const i = e.textureCacheIds.indexOf(t);
        return i > -1 && e.textureCacheIds.splice(i, 1), delete ge[t], e;
      }
    } else if (t != null && t.textureCacheIds) {
      for (let e = 0; e < t.textureCacheIds.length; ++e)
        ge[t.textureCacheIds[e]] === t && delete ge[t.textureCacheIds[e]];
      return t.textureCacheIds.length = 0, t;
    }
    return null;
  }
  /**
   * Returns resolution of baseTexture
   * @readonly
   */
  get resolution() {
    return this.baseTexture.resolution;
  }
  /**
   * The frame specifies the region of the base texture that this texture uses.
   * Please call `updateUvs()` after you change coordinates of `frame` manually.
   */
  get frame() {
    return this._frame;
  }
  set frame(t) {
    this._frame = t, this.noFrame = !1;
    const { x: e, y: i, width: s, height: n } = t, o = e + s > this.baseTexture.width, a = i + n > this.baseTexture.height;
    if (o || a) {
      const h = o && a ? "and" : "or", l = `X: ${e} + ${s} = ${e + s} > ${this.baseTexture.width}`, c = `Y: ${i} + ${n} = ${i + n} > ${this.baseTexture.height}`;
      throw new Error(`Texture Error: frame does not fit inside the base Texture dimensions: ${l} ${h} ${c}`);
    }
    this.valid = s && n && this.baseTexture.valid, !this.trim && !this.rotate && (this.orig = t), this.valid && this.updateUvs();
  }
  /**
   * Indicates whether the texture is rotated inside the atlas
   * set to 2 to compensate for texture packer rotation
   * set to 6 to compensate for spine packer rotation
   * can be used to rotate or mirror sprites
   * See {@link PIXI.groupD8} for explanation
   */
  get rotate() {
    return this._rotate;
  }
  set rotate(t) {
    this._rotate = t, this.valid && this.updateUvs();
  }
  /** The width of the Texture in pixels. */
  get width() {
    return this.orig.width;
  }
  /** The height of the Texture in pixels. */
  get height() {
    return this.orig.height;
  }
  /** Utility function for BaseTexture|Texture cast. */
  castToBaseTexture() {
    return this.baseTexture;
  }
  /** An empty texture, used often to not have to create multiple empty textures. Can not be destroyed. */
  static get EMPTY() {
    return j._EMPTY || (j._EMPTY = new j(new J()), Ki(j._EMPTY), Ki(j._EMPTY.baseTexture)), j._EMPTY;
  }
  /** A white texture of 16x16 size, used for graphics and other things Can not be destroyed. */
  static get WHITE() {
    if (!j._WHITE) {
      const t = H.ADAPTER.createCanvas(16, 16), e = t.getContext("2d");
      t.width = 16, t.height = 16, e.fillStyle = "white", e.fillRect(0, 0, 16, 16), j._WHITE = new j(J.from(t)), Ki(j._WHITE), Ki(j._WHITE.baseTexture);
    }
    return j._WHITE;
  }
}
class Sr extends j {
  /**
   * @param baseRenderTexture - The base texture object that this texture uses.
   * @param frame - The rectangle frame of the texture to show.
   */
  constructor(t, e) {
    super(t, e), this.valid = !0, this.filterFrame = null, this.filterPoolKey = null, this.updateUvs();
  }
  /**
   * Shortcut to `this.baseTexture.framebuffer`, saves baseTexture cast.
   * @readonly
   */
  get framebuffer() {
    return this.baseTexture.framebuffer;
  }
  /**
   * Shortcut to `this.framebuffer.multisample`.
   * @default PIXI.MSAA_QUALITY.NONE
   */
  get multisample() {
    return this.framebuffer.multisample;
  }
  set multisample(t) {
    this.framebuffer.multisample = t;
  }
  /**
   * Resizes the RenderTexture.
   * @param desiredWidth - The desired width to resize to.
   * @param desiredHeight - The desired height to resize to.
   * @param resizeBaseTexture - Should the baseTexture.width and height values be resized as well?
   */
  resize(t, e, i = !0) {
    const s = this.baseTexture.resolution, n = Math.round(t * s) / s, o = Math.round(e * s) / s;
    this.valid = n > 0 && o > 0, this._frame.width = this.orig.width = n, this._frame.height = this.orig.height = o, i && this.baseTexture.resize(n, o), this.updateUvs();
  }
  /**
   * Changes the resolution of baseTexture, but does not change framebuffer size.
   * @param resolution - The new resolution to apply to RenderTexture
   */
  setResolution(t) {
    const { baseTexture: e } = this;
    e.resolution !== t && (e.setResolution(t), this.resize(e.width, e.height, !1));
  }
  /**
   * A short hand way of creating a render texture.
   * @param options - Options
   * @param {number} [options.width=100] - The width of the render texture
   * @param {number} [options.height=100] - The height of the render texture
   * @param {PIXI.SCALE_MODES} [options.scaleMode=PIXI.BaseTexture.defaultOptions.scaleMode] - See {@link PIXI.SCALE_MODES}
   *    for possible values
   * @param {number} [options.resolution=PIXI.settings.RESOLUTION] - The resolution / device pixel ratio of the texture
   *    being generated
   * @param {PIXI.MSAA_QUALITY} [options.multisample=PIXI.MSAA_QUALITY.NONE] - The number of samples of the frame buffer
   * @returns The new render texture
   */
  static create(t) {
    return new Sr(new Ec(t));
  }
}
class Ac {
  /**
   * @param textureOptions - options that will be passed to BaseRenderTexture constructor
   * @param {PIXI.SCALE_MODES} [textureOptions.scaleMode] - See {@link PIXI.SCALE_MODES} for possible values.
   */
  constructor(t) {
    this.texturePool = {}, this.textureOptions = t || {}, this.enableFullScreen = !1, this._pixelsWidth = 0, this._pixelsHeight = 0;
  }
  /**
   * Creates texture with params that were specified in pool constructor.
   * @param realWidth - Width of texture in pixels.
   * @param realHeight - Height of texture in pixels.
   * @param multisample - Number of samples of the framebuffer.
   */
  createTexture(t, e, i = It.NONE) {
    const s = new Ec(Object.assign({
      width: t,
      height: e,
      resolution: 1,
      multisample: i
    }, this.textureOptions));
    return new Sr(s);
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param minWidth - The minimum width of the render texture.
   * @param minHeight - The minimum height of the render texture.
   * @param resolution - The resolution of the render texture.
   * @param multisample - Number of samples of the render texture.
   * @returns The new render texture.
   */
  getOptimalTexture(t, e, i = 1, s = It.NONE) {
    let n;
    t = Math.max(Math.ceil(t * i - 1e-6), 1), e = Math.max(Math.ceil(e * i - 1e-6), 1), !this.enableFullScreen || t !== this._pixelsWidth || e !== this._pixelsHeight ? (t = Rs(t), e = Rs(e), n = ((t & 65535) << 16 | e & 65535) >>> 0, s > 1 && (n += s * 4294967296)) : n = s > 1 ? -s : -1, this.texturePool[n] || (this.texturePool[n] = []);
    let o = this.texturePool[n].pop();
    return o || (o = this.createTexture(t, e, s)), o.filterPoolKey = n, o.setResolution(i), o;
  }
  /**
   * Gets extra texture of the same size as input renderTexture
   *
   * `getFilterTexture(input, 0.5)` or `getFilterTexture(0.5, input)`
   * @param input - renderTexture from which size and resolution will be copied
   * @param resolution - override resolution of the renderTexture
   *  It overrides, it does not multiply
   * @param multisample - number of samples of the renderTexture
   */
  getFilterTexture(t, e, i) {
    const s = this.getOptimalTexture(
      t.width,
      t.height,
      e || t.resolution,
      i || It.NONE
    );
    return s.filterFrame = t.filterFrame, s;
  }
  /**
   * Place a render texture back into the pool.
   * @param renderTexture - The renderTexture to free
   */
  returnTexture(t) {
    const e = t.filterPoolKey;
    t.filterFrame = null, this.texturePool[e].push(t);
  }
  /**
   * Alias for returnTexture, to be compliant with FilterSystem interface.
   * @param renderTexture - The renderTexture to free
   */
  returnFilterTexture(t) {
    this.returnTexture(t);
  }
  /**
   * Clears the pool.
   * @param destroyTextures - Destroy all stored textures.
   */
  clear(t) {
    if (t = t !== !1, t)
      for (const e in this.texturePool) {
        const i = this.texturePool[e];
        if (i)
          for (let s = 0; s < i.length; s++)
            i[s].destroy(!0);
      }
    this.texturePool = {};
  }
  /**
   * If screen size was changed, drops all screen-sized textures,
   * sets new screen size, sets `enableFullScreen` to true
   *
   * Size is measured in pixels, `renderer.view` can be passed here, not `renderer.screen`
   * @param size - Initial size of screen.
   */
  setScreenSize(t) {
    if (!(t.width === this._pixelsWidth && t.height === this._pixelsHeight)) {
      this.enableFullScreen = t.width > 0 && t.height > 0;
      for (const e in this.texturePool) {
        if (!(Number(e) < 0))
          continue;
        const i = this.texturePool[e];
        if (i)
          for (let s = 0; s < i.length; s++)
            i[s].destroy(!0);
        this.texturePool[e] = [];
      }
      this._pixelsWidth = t.width, this._pixelsHeight = t.height;
    }
  }
}
Ac.SCREEN_KEY = -1;
class yg extends Ke {
  constructor() {
    super(), this.addAttribute("aVertexPosition", new Float32Array([
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1
    ])).addIndex([0, 1, 3, 2]);
  }
}
class Sc extends Ke {
  constructor() {
    super(), this.vertices = new Float32Array([
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      1
    ]), this.uvs = new Float32Array([
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1
    ]), this.vertexBuffer = new At(this.vertices), this.uvBuffer = new At(this.uvs), this.addAttribute("aVertexPosition", this.vertexBuffer).addAttribute("aTextureCoord", this.uvBuffer).addIndex([0, 1, 2, 0, 2, 3]);
  }
  /**
   * Maps two Rectangle to the quad.
   * @param targetTextureFrame - The first rectangle
   * @param destinationFrame - The second rectangle
   * @returns - Returns itself.
   */
  map(t, e) {
    let i = 0, s = 0;
    return this.uvs[0] = i, this.uvs[1] = s, this.uvs[2] = i + e.width / t.width, this.uvs[3] = s, this.uvs[4] = i + e.width / t.width, this.uvs[5] = s + e.height / t.height, this.uvs[6] = i, this.uvs[7] = s + e.height / t.height, i = e.x, s = e.y, this.vertices[0] = i, this.vertices[1] = s, this.vertices[2] = i + e.width, this.vertices[3] = s, this.vertices[4] = i + e.width, this.vertices[5] = s + e.height, this.vertices[6] = i, this.vertices[7] = s + e.height, this.invalidate(), this;
  }
  /**
   * Legacy upload method, just marks buffers dirty.
   * @returns - Returns itself.
   */
  invalidate() {
    return this.vertexBuffer._updateID++, this.uvBuffer._updateID++, this;
  }
}
class _g {
  constructor() {
    this.renderTexture = null, this.target = null, this.legacy = !1, this.resolution = 1, this.multisample = It.NONE, this.sourceFrame = new tt(), this.destinationFrame = new tt(), this.bindingSourceFrame = new tt(), this.bindingDestinationFrame = new tt(), this.filters = [], this.transform = null;
  }
  /** Clears the state */
  clear() {
    this.target = null, this.filters = null, this.renderTexture = null;
  }
}
const Zi = [new lt(), new lt(), new lt(), new lt()], Pn = new yt();
class Ic {
  /**
   * @param renderer - The renderer this System works for.
   */
  constructor(t) {
    this.renderer = t, this.defaultFilterStack = [{}], this.texturePool = new Ac(), this.statePool = [], this.quad = new yg(), this.quadUv = new Sc(), this.tempRect = new tt(), this.activeState = {}, this.globalUniforms = new ue({
      outputFrame: new tt(),
      inputSize: new Float32Array(4),
      inputPixel: new Float32Array(4),
      inputClamp: new Float32Array(4),
      resolution: 1,
      // legacy variables
      filterArea: new Float32Array(4),
      filterClamp: new Float32Array(4)
    }, !0), this.forceClear = !1, this.useMaxPadding = !1;
  }
  init() {
    this.texturePool.setScreenSize(this.renderer.view);
  }
  /**
   * Pushes a set of filters to be applied later to the system. This will redirect further rendering into an
   * input render-texture for the rest of the filtering pipeline.
   * @param {PIXI.DisplayObject} target - The target of the filter to render.
   * @param filters - The filters to apply.
   */
  push(t, e) {
    const i = this.renderer, s = this.defaultFilterStack, n = this.statePool.pop() || new _g(), o = i.renderTexture;
    let a, h;
    if (o.current) {
      const g = o.current;
      a = g.resolution, h = g.multisample;
    } else
      a = i.resolution, h = i.multisample;
    let l = e[0].resolution || a, c = e[0].multisample ?? h, u = e[0].padding, d = e[0].autoFit, f = e[0].legacy ?? !0;
    for (let g = 1; g < e.length; g++) {
      const y = e[g];
      l = Math.min(l, y.resolution || a), c = Math.min(c, y.multisample ?? h), u = this.useMaxPadding ? Math.max(u, y.padding) : u + y.padding, d = d && y.autoFit, f = f || (y.legacy ?? !0);
    }
    s.length === 1 && (this.defaultFilterStack[0].renderTexture = o.current), s.push(n), n.resolution = l, n.multisample = c, n.legacy = f, n.target = t, n.sourceFrame.copyFrom(t.filterArea || t.getBounds(!0)), n.sourceFrame.pad(u);
    const p = this.tempRect.copyFrom(o.sourceFrame);
    i.projection.transform && this.transformAABB(
      Pn.copyFrom(i.projection.transform).invert(),
      p
    ), d ? (n.sourceFrame.fit(p), (n.sourceFrame.width <= 0 || n.sourceFrame.height <= 0) && (n.sourceFrame.width = 0, n.sourceFrame.height = 0)) : n.sourceFrame.intersects(p) || (n.sourceFrame.width = 0, n.sourceFrame.height = 0), this.roundFrame(
      n.sourceFrame,
      o.current ? o.current.resolution : i.resolution,
      o.sourceFrame,
      o.destinationFrame,
      i.projection.transform
    ), n.renderTexture = this.getOptimalFilterTexture(
      n.sourceFrame.width,
      n.sourceFrame.height,
      l,
      c
    ), n.filters = e, n.destinationFrame.width = n.renderTexture.width, n.destinationFrame.height = n.renderTexture.height;
    const m = this.tempRect;
    m.x = 0, m.y = 0, m.width = n.sourceFrame.width, m.height = n.sourceFrame.height, n.renderTexture.filterFrame = n.sourceFrame, n.bindingSourceFrame.copyFrom(o.sourceFrame), n.bindingDestinationFrame.copyFrom(o.destinationFrame), n.transform = i.projection.transform, i.projection.transform = null, o.bind(n.renderTexture, n.sourceFrame, m), i.framebuffer.clear(0, 0, 0, 0);
  }
  /** Pops off the filter and applies it. */
  pop() {
    const t = this.defaultFilterStack, e = t.pop(), i = e.filters;
    this.activeState = e;
    const s = this.globalUniforms.uniforms;
    s.outputFrame = e.sourceFrame, s.resolution = e.resolution;
    const n = s.inputSize, o = s.inputPixel, a = s.inputClamp;
    if (n[0] = e.destinationFrame.width, n[1] = e.destinationFrame.height, n[2] = 1 / n[0], n[3] = 1 / n[1], o[0] = Math.round(n[0] * e.resolution), o[1] = Math.round(n[1] * e.resolution), o[2] = 1 / o[0], o[3] = 1 / o[1], a[0] = 0.5 * o[2], a[1] = 0.5 * o[3], a[2] = e.sourceFrame.width * n[2] - 0.5 * o[2], a[3] = e.sourceFrame.height * n[3] - 0.5 * o[3], e.legacy) {
      const l = s.filterArea;
      l[0] = e.destinationFrame.width, l[1] = e.destinationFrame.height, l[2] = e.sourceFrame.x, l[3] = e.sourceFrame.y, s.filterClamp = s.inputClamp;
    }
    this.globalUniforms.update();
    const h = t[t.length - 1];
    if (this.renderer.framebuffer.blit(), i.length === 1)
      i[0].apply(this, e.renderTexture, h.renderTexture, ve.BLEND, e), this.returnFilterTexture(e.renderTexture);
    else {
      let l = e.renderTexture, c = this.getOptimalFilterTexture(
        l.width,
        l.height,
        e.resolution
      );
      c.filterFrame = l.filterFrame;
      let u = 0;
      for (u = 0; u < i.length - 1; ++u) {
        u === 1 && e.multisample > 1 && (c = this.getOptimalFilterTexture(
          l.width,
          l.height,
          e.resolution
        ), c.filterFrame = l.filterFrame), i[u].apply(this, l, c, ve.CLEAR, e);
        const d = l;
        l = c, c = d;
      }
      i[u].apply(this, l, h.renderTexture, ve.BLEND, e), u > 1 && e.multisample > 1 && this.returnFilterTexture(e.renderTexture), this.returnFilterTexture(l), this.returnFilterTexture(c);
    }
    e.clear(), this.statePool.push(e);
  }
  /**
   * Binds a renderTexture with corresponding `filterFrame`, clears it if mode corresponds.
   * @param filterTexture - renderTexture to bind, should belong to filter pool or filter stack
   * @param clearMode - clearMode, by default its CLEAR/YES. See {@link PIXI.CLEAR_MODES}
   */
  bindAndClear(t, e = ve.CLEAR) {
    const {
      renderTexture: i,
      state: s
    } = this.renderer;
    if (t === this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture ? this.renderer.projection.transform = this.activeState.transform : this.renderer.projection.transform = null, t == null ? void 0 : t.filterFrame) {
      const o = this.tempRect;
      o.x = 0, o.y = 0, o.width = t.filterFrame.width, o.height = t.filterFrame.height, i.bind(t, t.filterFrame, o);
    } else
      t !== this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture ? i.bind(t) : this.renderer.renderTexture.bind(
        t,
        this.activeState.bindingSourceFrame,
        this.activeState.bindingDestinationFrame
      );
    const n = s.stateId & 1 || this.forceClear;
    (e === ve.CLEAR || e === ve.BLIT && n) && this.renderer.framebuffer.clear(0, 0, 0, 0);
  }
  /**
   * Draws a filter using the default rendering process.
   *
   * This should be called only by {@link PIXI.Filter#apply}.
   * @param filter - The filter to draw.
   * @param input - The input render target.
   * @param output - The target to output to.
   * @param clearMode - Should the output be cleared before rendering to it
   */
  applyFilter(t, e, i, s) {
    const n = this.renderer;
    n.state.set(t.state), this.bindAndClear(i, s), t.uniforms.uSampler = e, t.uniforms.filterGlobals = this.globalUniforms, n.shader.bind(t), t.legacy = !!t.program.attributeData.aTextureCoord, t.legacy ? (this.quadUv.map(e._frame, e.filterFrame), n.geometry.bind(this.quadUv), n.geometry.draw(be.TRIANGLES)) : (n.geometry.bind(this.quad), n.geometry.draw(be.TRIANGLE_STRIP));
  }
  /**
   * Multiply _input normalized coordinates_ to this matrix to get _sprite texture normalized coordinates_.
   *
   * Use `outputMatrix * vTextureCoord` in the shader.
   * @param outputMatrix - The matrix to output to.
   * @param {PIXI.Sprite} sprite - The sprite to map to.
   * @returns The mapped matrix.
   */
  calculateSpriteMatrix(t, e) {
    const { sourceFrame: i, destinationFrame: s } = this.activeState, { orig: n } = e._texture, o = t.set(
      s.width,
      0,
      0,
      s.height,
      i.x,
      i.y
    ), a = e.worldTransform.copyTo(yt.TEMP_MATRIX);
    return a.invert(), o.prepend(a), o.scale(1 / n.width, 1 / n.height), o.translate(e.anchor.x, e.anchor.y), o;
  }
  /** Destroys this Filter System. */
  destroy() {
    this.renderer = null, this.texturePool.clear(!1);
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param minWidth - The minimum width of the render texture in real pixels.
   * @param minHeight - The minimum height of the render texture in real pixels.
   * @param resolution - The resolution of the render texture.
   * @param multisample - Number of samples of the render texture.
   * @returns - The new render texture.
   */
  getOptimalFilterTexture(t, e, i = 1, s = It.NONE) {
    return this.texturePool.getOptimalTexture(t, e, i, s);
  }
  /**
   * Gets extra render texture to use inside current filter
   * To be compliant with older filters, you can use params in any order
   * @param input - renderTexture from which size and resolution will be copied
   * @param resolution - override resolution of the renderTexture
   * @param multisample - number of samples of the renderTexture
   */
  getFilterTexture(t, e, i) {
    if (typeof t == "number") {
      const n = t;
      t = e, e = n;
    }
    t = t || this.activeState.renderTexture;
    const s = this.texturePool.getOptimalTexture(
      t.width,
      t.height,
      e || t.resolution,
      i || It.NONE
    );
    return s.filterFrame = t.filterFrame, s;
  }
  /**
   * Frees a render texture back into the pool.
   * @param renderTexture - The renderTarget to free
   */
  returnFilterTexture(t) {
    this.texturePool.returnTexture(t);
  }
  /** Empties the texture pool. */
  emptyPool() {
    this.texturePool.clear(!0);
  }
  /** Calls `texturePool.resize()`, affects fullScreen renderTextures. */
  resize() {
    this.texturePool.setScreenSize(this.renderer.view);
  }
  /**
   * @param matrix - first param
   * @param rect - second param
   */
  transformAABB(t, e) {
    const i = Zi[0], s = Zi[1], n = Zi[2], o = Zi[3];
    i.set(e.left, e.top), s.set(e.left, e.bottom), n.set(e.right, e.top), o.set(e.right, e.bottom), t.apply(i, i), t.apply(s, s), t.apply(n, n), t.apply(o, o);
    const a = Math.min(i.x, s.x, n.x, o.x), h = Math.min(i.y, s.y, n.y, o.y), l = Math.max(i.x, s.x, n.x, o.x), c = Math.max(i.y, s.y, n.y, o.y);
    e.x = a, e.y = h, e.width = l - a, e.height = c - h;
  }
  roundFrame(t, e, i, s, n) {
    if (!(t.width <= 0 || t.height <= 0 || i.width <= 0 || i.height <= 0)) {
      if (n) {
        const { a: o, b: a, c: h, d: l } = n;
        if ((Math.abs(a) > 1e-4 || Math.abs(h) > 1e-4) && (Math.abs(o) > 1e-4 || Math.abs(l) > 1e-4))
          return;
      }
      n = n ? Pn.copyFrom(n) : Pn.identity(), n.translate(-i.x, -i.y).scale(
        s.width / i.width,
        s.height / i.height
      ).translate(s.x, s.y), this.transformAABB(n, t), t.ceil(e), this.transformAABB(n.invert(), t);
    }
  }
}
Ic.extension = {
  type: k.RendererSystem,
  name: "filter"
};
z.add(Ic);
class vg {
  constructor(t) {
    this.framebuffer = t, this.stencil = null, this.dirtyId = -1, this.dirtyFormat = -1, this.dirtySize = -1, this.multisample = It.NONE, this.msaaBuffer = null, this.blitFramebuffer = null, this.mipLevel = 0;
  }
}
const xg = new tt();
class Cc {
  /**
   * @param renderer - The renderer this System works for.
   */
  constructor(t) {
    this.renderer = t, this.managedFramebuffers = [], this.unknownFramebuffer = new Ao(10, 10), this.msaaSamples = null;
  }
  /** Sets up the renderer context and necessary buffers. */
  contextChange() {
    this.disposeAll(!0);
    const t = this.gl = this.renderer.gl;
    if (this.CONTEXT_UID = this.renderer.CONTEXT_UID, this.current = this.unknownFramebuffer, this.viewport = new tt(), this.hasMRT = !0, this.writeDepthTexture = !0, this.renderer.context.webGLVersion === 1) {
      let e = this.renderer.context.extensions.drawBuffers, i = this.renderer.context.extensions.depthTexture;
      H.PREFER_ENV === wr.WEBGL_LEGACY && (e = null, i = null), e ? t.drawBuffers = (s) => e.drawBuffersWEBGL(s) : (this.hasMRT = !1, t.drawBuffers = () => {
      }), i || (this.writeDepthTexture = !1);
    } else
      this.msaaSamples = t.getInternalformatParameter(t.RENDERBUFFER, t.RGBA8, t.SAMPLES);
  }
  /**
   * Bind a framebuffer.
   * @param framebuffer
   * @param frame - frame, default is framebuffer size
   * @param mipLevel - optional mip level to set on the framebuffer - defaults to 0
   */
  bind(t, e, i = 0) {
    const { gl: s } = this;
    if (t) {
      const n = t.glFramebuffers[this.CONTEXT_UID] || this.initFramebuffer(t);
      this.current !== t && (this.current = t, s.bindFramebuffer(s.FRAMEBUFFER, n.framebuffer)), n.mipLevel !== i && (t.dirtyId++, t.dirtyFormat++, n.mipLevel = i), n.dirtyId !== t.dirtyId && (n.dirtyId = t.dirtyId, n.dirtyFormat !== t.dirtyFormat ? (n.dirtyFormat = t.dirtyFormat, n.dirtySize = t.dirtySize, this.updateFramebuffer(t, i)) : n.dirtySize !== t.dirtySize && (n.dirtySize = t.dirtySize, this.resizeFramebuffer(t)));
      for (let o = 0; o < t.colorTextures.length; o++) {
        const a = t.colorTextures[o];
        this.renderer.texture.unbind(a.parentTextureArray || a);
      }
      if (t.depthTexture && this.renderer.texture.unbind(t.depthTexture), e) {
        const o = e.width >> i, a = e.height >> i, h = o / e.width;
        this.setViewport(
          e.x * h,
          e.y * h,
          o,
          a
        );
      } else {
        const o = t.width >> i, a = t.height >> i;
        this.setViewport(0, 0, o, a);
      }
    } else
      this.current && (this.current = null, s.bindFramebuffer(s.FRAMEBUFFER, null)), e ? this.setViewport(e.x, e.y, e.width, e.height) : this.setViewport(0, 0, this.renderer.width, this.renderer.height);
  }
  /**
   * Set the WebGLRenderingContext's viewport.
   * @param x - X position of viewport
   * @param y - Y position of viewport
   * @param width - Width of viewport
   * @param height - Height of viewport
   */
  setViewport(t, e, i, s) {
    const n = this.viewport;
    t = Math.round(t), e = Math.round(e), i = Math.round(i), s = Math.round(s), (n.width !== i || n.height !== s || n.x !== t || n.y !== e) && (n.x = t, n.y = e, n.width = i, n.height = s, this.gl.viewport(t, e, i, s));
  }
  /**
   * Get the size of the current width and height. Returns object with `width` and `height` values.
   * @readonly
   */
  get size() {
    return this.current ? { x: 0, y: 0, width: this.current.width, height: this.current.height } : { x: 0, y: 0, width: this.renderer.width, height: this.renderer.height };
  }
  /**
   * Clear the color of the context
   * @param r - Red value from 0 to 1
   * @param g - Green value from 0 to 1
   * @param b - Blue value from 0 to 1
   * @param a - Alpha value from 0 to 1
   * @param {PIXI.BUFFER_BITS} [mask=BUFFER_BITS.COLOR | BUFFER_BITS.DEPTH] - Bitwise OR of masks
   *  that indicate the buffers to be cleared, by default COLOR and DEPTH buffers.
   */
  clear(t, e, i, s, n = Kn.COLOR | Kn.DEPTH) {
    const { gl: o } = this;
    o.clearColor(t, e, i, s), o.clear(n);
  }
  /**
   * Initialize framebuffer for this context
   * @protected
   * @param framebuffer
   * @returns - created GLFramebuffer
   */
  initFramebuffer(t) {
    const { gl: e } = this, i = new vg(e.createFramebuffer());
    return i.multisample = this.detectSamples(t.multisample), t.glFramebuffers[this.CONTEXT_UID] = i, this.managedFramebuffers.push(t), t.disposeRunner.add(this), i;
  }
  /**
   * Resize the framebuffer
   * @param framebuffer
   * @protected
   */
  resizeFramebuffer(t) {
    const { gl: e } = this, i = t.glFramebuffers[this.CONTEXT_UID];
    if (i.stencil) {
      e.bindRenderbuffer(e.RENDERBUFFER, i.stencil);
      let o;
      this.renderer.context.webGLVersion === 1 ? o = e.DEPTH_STENCIL : t.depth && t.stencil ? o = e.DEPTH24_STENCIL8 : t.depth ? o = e.DEPTH_COMPONENT24 : o = e.STENCIL_INDEX8, i.msaaBuffer ? e.renderbufferStorageMultisample(
        e.RENDERBUFFER,
        i.multisample,
        o,
        t.width,
        t.height
      ) : e.renderbufferStorage(e.RENDERBUFFER, o, t.width, t.height);
    }
    const s = t.colorTextures;
    let n = s.length;
    e.drawBuffers || (n = Math.min(n, 1));
    for (let o = 0; o < n; o++) {
      const a = s[o], h = a.parentTextureArray || a;
      this.renderer.texture.bind(h, 0), o === 0 && i.msaaBuffer && (e.bindRenderbuffer(e.RENDERBUFFER, i.msaaBuffer), e.renderbufferStorageMultisample(
        e.RENDERBUFFER,
        i.multisample,
        h._glTextures[this.CONTEXT_UID].internalFormat,
        t.width,
        t.height
      ));
    }
    t.depthTexture && this.writeDepthTexture && this.renderer.texture.bind(t.depthTexture, 0);
  }
  /**
   * Update the framebuffer
   * @param framebuffer
   * @param mipLevel
   * @protected
   */
  updateFramebuffer(t, e) {
    const { gl: i } = this, s = t.glFramebuffers[this.CONTEXT_UID], n = t.colorTextures;
    let o = n.length;
    i.drawBuffers || (o = Math.min(o, 1)), s.multisample > 1 && this.canMultisampleFramebuffer(t) ? s.msaaBuffer = s.msaaBuffer || i.createRenderbuffer() : s.msaaBuffer && (i.deleteRenderbuffer(s.msaaBuffer), s.msaaBuffer = null, s.blitFramebuffer && (s.blitFramebuffer.dispose(), s.blitFramebuffer = null));
    const a = [];
    for (let h = 0; h < o; h++) {
      const l = n[h], c = l.parentTextureArray || l;
      this.renderer.texture.bind(c, 0), h === 0 && s.msaaBuffer ? (i.bindRenderbuffer(i.RENDERBUFFER, s.msaaBuffer), i.renderbufferStorageMultisample(
        i.RENDERBUFFER,
        s.multisample,
        c._glTextures[this.CONTEXT_UID].internalFormat,
        t.width,
        t.height
      ), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.RENDERBUFFER, s.msaaBuffer)) : (i.framebufferTexture2D(
        i.FRAMEBUFFER,
        i.COLOR_ATTACHMENT0 + h,
        l.target,
        c._glTextures[this.CONTEXT_UID].texture,
        e
      ), a.push(i.COLOR_ATTACHMENT0 + h));
    }
    if (a.length > 1 && i.drawBuffers(a), t.depthTexture && this.writeDepthTexture) {
      const h = t.depthTexture;
      this.renderer.texture.bind(h, 0), i.framebufferTexture2D(
        i.FRAMEBUFFER,
        i.DEPTH_ATTACHMENT,
        i.TEXTURE_2D,
        h._glTextures[this.CONTEXT_UID].texture,
        e
      );
    }
    if ((t.stencil || t.depth) && !(t.depthTexture && this.writeDepthTexture)) {
      s.stencil = s.stencil || i.createRenderbuffer();
      let h, l;
      this.renderer.context.webGLVersion === 1 ? (h = i.DEPTH_STENCIL_ATTACHMENT, l = i.DEPTH_STENCIL) : t.depth && t.stencil ? (h = i.DEPTH_STENCIL_ATTACHMENT, l = i.DEPTH24_STENCIL8) : t.depth ? (h = i.DEPTH_ATTACHMENT, l = i.DEPTH_COMPONENT24) : (h = i.STENCIL_ATTACHMENT, l = i.STENCIL_INDEX8), i.bindRenderbuffer(i.RENDERBUFFER, s.stencil), s.msaaBuffer ? i.renderbufferStorageMultisample(
        i.RENDERBUFFER,
        s.multisample,
        l,
        t.width,
        t.height
      ) : i.renderbufferStorage(i.RENDERBUFFER, l, t.width, t.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, h, i.RENDERBUFFER, s.stencil);
    } else
      s.stencil && (i.deleteRenderbuffer(s.stencil), s.stencil = null);
  }
  /**
   * Returns true if the frame buffer can be multisampled.
   * @param framebuffer
   */
  canMultisampleFramebuffer(t) {
    return this.renderer.context.webGLVersion !== 1 && t.colorTextures.length <= 1 && !t.depthTexture;
  }
  /**
   * Detects number of samples that is not more than a param but as close to it as possible
   * @param samples - number of samples
   * @returns - recommended number of samples
   */
  detectSamples(t) {
    const { msaaSamples: e } = this;
    let i = It.NONE;
    if (t <= 1 || e === null)
      return i;
    for (let s = 0; s < e.length; s++)
      if (e[s] <= t) {
        i = e[s];
        break;
      }
    return i === 1 && (i = It.NONE), i;
  }
  /**
   * Only works with WebGL2
   *
   * blits framebuffer to another of the same or bigger size
   * after that target framebuffer is bound
   *
   * Fails with WebGL warning if blits multisample framebuffer to different size
   * @param framebuffer - by default it blits "into itself", from renderBuffer to texture.
   * @param sourcePixels - source rectangle in pixels
   * @param destPixels - dest rectangle in pixels, assumed to be the same as sourcePixels
   */
  blit(t, e, i) {
    const { current: s, renderer: n, gl: o, CONTEXT_UID: a } = this;
    if (n.context.webGLVersion !== 2 || !s)
      return;
    const h = s.glFramebuffers[a];
    if (!h)
      return;
    if (!t) {
      if (!h.msaaBuffer)
        return;
      const c = s.colorTextures[0];
      if (!c)
        return;
      h.blitFramebuffer || (h.blitFramebuffer = new Ao(s.width, s.height), h.blitFramebuffer.addColorTexture(0, c)), t = h.blitFramebuffer, t.colorTextures[0] !== c && (t.colorTextures[0] = c, t.dirtyId++, t.dirtyFormat++), (t.width !== s.width || t.height !== s.height) && (t.width = s.width, t.height = s.height, t.dirtyId++, t.dirtySize++);
    }
    e || (e = xg, e.width = s.width, e.height = s.height), i || (i = e);
    const l = e.width === i.width && e.height === i.height;
    this.bind(t), o.bindFramebuffer(o.READ_FRAMEBUFFER, h.framebuffer), o.blitFramebuffer(
      e.left,
      e.top,
      e.right,
      e.bottom,
      i.left,
      i.top,
      i.right,
      i.bottom,
      o.COLOR_BUFFER_BIT,
      l ? o.NEAREST : o.LINEAR
    ), o.bindFramebuffer(o.READ_FRAMEBUFFER, t.glFramebuffers[this.CONTEXT_UID].framebuffer);
  }
  /**
   * Disposes framebuffer.
   * @param framebuffer - framebuffer that has to be disposed of
   * @param contextLost - If context was lost, we suppress all delete function calls
   */
  disposeFramebuffer(t, e) {
    const i = t.glFramebuffers[this.CONTEXT_UID], s = this.gl;
    if (!i)
      return;
    delete t.glFramebuffers[this.CONTEXT_UID];
    const n = this.managedFramebuffers.indexOf(t);
    n >= 0 && this.managedFramebuffers.splice(n, 1), t.disposeRunner.remove(this), e || (s.deleteFramebuffer(i.framebuffer), i.msaaBuffer && s.deleteRenderbuffer(i.msaaBuffer), i.stencil && s.deleteRenderbuffer(i.stencil)), i.blitFramebuffer && this.disposeFramebuffer(i.blitFramebuffer, e);
  }
  /**
   * Disposes all framebuffers, but not textures bound to them.
   * @param [contextLost=false] - If context was lost, we suppress all delete function calls
   */
  disposeAll(t) {
    const e = this.managedFramebuffers;
    this.managedFramebuffers = [];
    for (let i = 0; i < e.length; i++)
      this.disposeFramebuffer(e[i], t);
  }
  /**
   * Forcing creation of stencil buffer for current framebuffer, if it wasn't done before.
   * Used by MaskSystem, when its time to use stencil mask for Graphics element.
   *
   * Its an alternative for public lazy `framebuffer.enableStencil`, in case we need stencil without rebind.
   * @private
   */
  forceStencil() {
    const t = this.current;
    if (!t)
      return;
    const e = t.glFramebuffers[this.CONTEXT_UID];
    if (!e || e.stencil && t.stencil)
      return;
    t.stencil = !0;
    const i = t.width, s = t.height, n = this.gl, o = e.stencil = n.createRenderbuffer();
    n.bindRenderbuffer(n.RENDERBUFFER, o);
    let a, h;
    this.renderer.context.webGLVersion === 1 ? (a = n.DEPTH_STENCIL_ATTACHMENT, h = n.DEPTH_STENCIL) : t.depth ? (a = n.DEPTH_STENCIL_ATTACHMENT, h = n.DEPTH24_STENCIL8) : (a = n.STENCIL_ATTACHMENT, h = n.STENCIL_INDEX8), e.msaaBuffer ? n.renderbufferStorageMultisample(n.RENDERBUFFER, e.multisample, h, i, s) : n.renderbufferStorage(n.RENDERBUFFER, h, i, s), n.framebufferRenderbuffer(n.FRAMEBUFFER, a, n.RENDERBUFFER, o);
  }
  /** Resets framebuffer stored state, binds screen framebuffer. Should be called before renderTexture reset(). */
  reset() {
    this.current = this.unknownFramebuffer, this.viewport = new tt();
  }
  destroy() {
    this.renderer = null;
  }
}
Cc.extension = {
  type: k.RendererSystem,
  name: "framebuffer"
};
z.add(Cc);
const Mn = { 5126: 4, 5123: 2, 5121: 1 };
class Rc {
  /** @param renderer - The renderer this System works for. */
  constructor(t) {
    this.renderer = t, this._activeGeometry = null, this._activeVao = null, this.hasVao = !0, this.hasInstance = !0, this.canUseUInt32ElementIndex = !1, this.managedGeometries = {};
  }
  /** Sets up the renderer context and necessary buffers. */
  contextChange() {
    this.disposeAll(!0);
    const t = this.gl = this.renderer.gl, e = this.renderer.context;
    if (this.CONTEXT_UID = this.renderer.CONTEXT_UID, e.webGLVersion !== 2) {
      let i = this.renderer.context.extensions.vertexArrayObject;
      H.PREFER_ENV === wr.WEBGL_LEGACY && (i = null), i ? (t.createVertexArray = () => i.createVertexArrayOES(), t.bindVertexArray = (s) => i.bindVertexArrayOES(s), t.deleteVertexArray = (s) => i.deleteVertexArrayOES(s)) : (this.hasVao = !1, t.createVertexArray = () => null, t.bindVertexArray = () => null, t.deleteVertexArray = () => null);
    }
    if (e.webGLVersion !== 2) {
      const i = t.getExtension("ANGLE_instanced_arrays");
      i ? (t.vertexAttribDivisor = (s, n) => i.vertexAttribDivisorANGLE(s, n), t.drawElementsInstanced = (s, n, o, a, h) => i.drawElementsInstancedANGLE(s, n, o, a, h), t.drawArraysInstanced = (s, n, o, a) => i.drawArraysInstancedANGLE(s, n, o, a)) : this.hasInstance = !1;
    }
    this.canUseUInt32ElementIndex = e.webGLVersion === 2 || !!e.extensions.uint32ElementIndex;
  }
  /**
   * Binds geometry so that is can be drawn. Creating a Vao if required
   * @param geometry - Instance of geometry to bind.
   * @param shader - Instance of shader to use vao for.
   */
  bind(t, e) {
    e = e || this.renderer.shader.shader;
    const { gl: i } = this;
    let s = t.glVertexArrayObjects[this.CONTEXT_UID], n = !1;
    s || (this.managedGeometries[t.id] = t, t.disposeRunner.add(this), t.glVertexArrayObjects[this.CONTEXT_UID] = s = {}, n = !0);
    const o = s[e.program.id] || this.initGeometryVao(t, e, n);
    this._activeGeometry = t, this._activeVao !== o && (this._activeVao = o, this.hasVao ? i.bindVertexArray(o) : this.activateVao(t, e.program)), this.updateBuffers();
  }
  /** Reset and unbind any active VAO and geometry. */
  reset() {
    this.unbind();
  }
  /** Update buffers of the currently bound geometry. */
  updateBuffers() {
    const t = this._activeGeometry, e = this.renderer.buffer;
    for (let i = 0; i < t.buffers.length; i++) {
      const s = t.buffers[i];
      e.update(s);
    }
  }
  /**
   * Check compatibility between a geometry and a program
   * @param geometry - Geometry instance.
   * @param program - Program instance.
   */
  checkCompatibility(t, e) {
    const i = t.attributes, s = e.attributeData;
    for (const n in s)
      if (!i[n])
        throw new Error(`shader and geometry incompatible, geometry missing the "${n}" attribute`);
  }
  /**
   * Takes a geometry and program and generates a unique signature for them.
   * @param geometry - To get signature from.
   * @param program - To test geometry against.
   * @returns - Unique signature of the geometry and program
   */
  getSignature(t, e) {
    const i = t.attributes, s = e.attributeData, n = ["g", t.id];
    for (const o in i)
      s[o] && n.push(o, s[o].location);
    return n.join("-");
  }
  /**
   * Creates or gets Vao with the same structure as the geometry and stores it on the geometry.
   * If vao is created, it is bound automatically. We use a shader to infer what and how to set up the
   * attribute locations.
   * @param geometry - Instance of geometry to to generate Vao for.
   * @param shader - Instance of the shader.
   * @param incRefCount - Increment refCount of all geometry buffers.
   */
  initGeometryVao(t, e, i = !0) {
    const s = this.gl, n = this.CONTEXT_UID, o = this.renderer.buffer, a = e.program;
    a.glPrograms[n] || this.renderer.shader.generateProgram(e), this.checkCompatibility(t, a);
    const h = this.getSignature(t, a), l = t.glVertexArrayObjects[this.CONTEXT_UID];
    let c = l[h];
    if (c)
      return l[a.id] = c, c;
    const u = t.buffers, d = t.attributes, f = {}, p = {};
    for (const m in u)
      f[m] = 0, p[m] = 0;
    for (const m in d)
      !d[m].size && a.attributeData[m] ? d[m].size = a.attributeData[m].size : d[m].size || console.warn(`PIXI Geometry attribute '${m}' size cannot be determined (likely the bound shader does not have the attribute)`), f[d[m].buffer] += d[m].size * Mn[d[m].type];
    for (const m in d) {
      const g = d[m], y = g.size;
      g.stride === void 0 && (f[g.buffer] === y * Mn[g.type] ? g.stride = 0 : g.stride = f[g.buffer]), g.start === void 0 && (g.start = p[g.buffer], p[g.buffer] += y * Mn[g.type]);
    }
    c = s.createVertexArray(), s.bindVertexArray(c);
    for (let m = 0; m < u.length; m++) {
      const g = u[m];
      o.bind(g), i && g._glBuffers[n].refCount++;
    }
    return this.activateVao(t, a), l[a.id] = c, l[h] = c, s.bindVertexArray(null), o.unbind(Te.ARRAY_BUFFER), c;
  }
  /**
   * Disposes geometry.
   * @param geometry - Geometry with buffers. Only VAO will be disposed
   * @param [contextLost=false] - If context was lost, we suppress deleteVertexArray
   */
  disposeGeometry(t, e) {
    var a;
    if (!this.managedGeometries[t.id])
      return;
    delete this.managedGeometries[t.id];
    const i = t.glVertexArrayObjects[this.CONTEXT_UID], s = this.gl, n = t.buffers, o = (a = this.renderer) == null ? void 0 : a.buffer;
    if (t.disposeRunner.remove(this), !!i) {
      if (o)
        for (let h = 0; h < n.length; h++) {
          const l = n[h]._glBuffers[this.CONTEXT_UID];
          l && (l.refCount--, l.refCount === 0 && !e && o.dispose(n[h], e));
        }
      if (!e) {
        for (const h in i)
          if (h[0] === "g") {
            const l = i[h];
            this._activeVao === l && this.unbind(), s.deleteVertexArray(l);
          }
      }
      delete t.glVertexArrayObjects[this.CONTEXT_UID];
    }
  }
  /**
   * Dispose all WebGL resources of all managed geometries.
   * @param [contextLost=false] - If context was lost, we suppress `gl.delete` calls
   */
  disposeAll(t) {
    const e = Object.keys(this.managedGeometries);
    for (let i = 0; i < e.length; i++)
      this.disposeGeometry(this.managedGeometries[e[i]], t);
  }
  /**
   * Activate vertex array object.
   * @param geometry - Geometry instance.
   * @param program - Shader program instance.
   */
  activateVao(t, e) {
    const i = this.gl, s = this.CONTEXT_UID, n = this.renderer.buffer, o = t.buffers, a = t.attributes;
    t.indexBuffer && n.bind(t.indexBuffer);
    let h = null;
    for (const l in a) {
      const c = a[l], u = o[c.buffer], d = u._glBuffers[s];
      if (e.attributeData[l]) {
        h !== d && (n.bind(u), h = d);
        const f = e.attributeData[l].location;
        if (i.enableVertexAttribArray(f), i.vertexAttribPointer(
          f,
          c.size,
          c.type || i.FLOAT,
          c.normalized,
          c.stride,
          c.start
        ), c.instance)
          if (this.hasInstance)
            i.vertexAttribDivisor(f, c.divisor);
          else
            throw new Error("geometry error, GPU Instancing is not supported on this device");
      }
    }
  }
  /**
   * Draws the currently bound geometry.
   * @param type - The type primitive to render.
   * @param size - The number of elements to be rendered. If not specified, all vertices after the
   *  starting vertex will be drawn.
   * @param start - The starting vertex in the geometry to start drawing from. If not specified,
   *  drawing will start from the first vertex.
   * @param instanceCount - The number of instances of the set of elements to execute. If not specified,
   *  all instances will be drawn.
   */
  draw(t, e, i, s) {
    const { gl: n } = this, o = this._activeGeometry;
    if (o.indexBuffer) {
      const a = o.indexBuffer.data.BYTES_PER_ELEMENT, h = a === 2 ? n.UNSIGNED_SHORT : n.UNSIGNED_INT;
      a === 2 || a === 4 && this.canUseUInt32ElementIndex ? o.instanced ? n.drawElementsInstanced(t, e || o.indexBuffer.data.length, h, (i || 0) * a, s || 1) : n.drawElements(t, e || o.indexBuffer.data.length, h, (i || 0) * a) : console.warn("unsupported index buffer type: uint32");
    } else
      o.instanced ? n.drawArraysInstanced(t, i, e || o.getSize(), s || 1) : n.drawArrays(t, i, e || o.getSize());
    return this;
  }
  /** Unbind/reset everything. */
  unbind() {
    this.gl.bindVertexArray(null), this._activeVao = null, this._activeGeometry = null;
  }
  destroy() {
    this.renderer = null;
  }
}
Rc.extension = {
  type: k.RendererSystem,
  name: "geometry"
};
z.add(Rc);
const Bh = new yt();
class Pc {
  /**
   * @param texture - observed texture
   * @param clampMargin - Changes frame clamping, 0.5 by default. Use -0.5 for extra border.
   */
  constructor(t, e) {
    this._texture = t, this.mapCoord = new yt(), this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._textureID = -1, this._updateID = 0, this.clampOffset = 0, this.clampMargin = typeof e > "u" ? 0.5 : e, this.isSimple = !1;
  }
  /** Texture property. */
  get texture() {
    return this._texture;
  }
  set texture(t) {
    this._texture = t, this._textureID = -1;
  }
  /**
   * Multiplies uvs array to transform
   * @param uvs - mesh uvs
   * @param [out=uvs] - output
   * @returns - output
   */
  multiplyUvs(t, e) {
    e === void 0 && (e = t);
    const i = this.mapCoord;
    for (let s = 0; s < t.length; s += 2) {
      const n = t[s], o = t[s + 1];
      e[s] = n * i.a + o * i.c + i.tx, e[s + 1] = n * i.b + o * i.d + i.ty;
    }
    return e;
  }
  /**
   * Updates matrices if texture was changed.
   * @param [forceUpdate=false] - if true, matrices will be updated any case
   * @returns - Whether or not it was updated
   */
  update(t) {
    const e = this._texture;
    if (!e || !e.valid || !t && this._textureID === e._updateID)
      return !1;
    this._textureID = e._updateID, this._updateID++;
    const i = e._uvs;
    this.mapCoord.set(i.x1 - i.x0, i.y1 - i.y0, i.x3 - i.x0, i.y3 - i.y0, i.x0, i.y0);
    const s = e.orig, n = e.trim;
    n && (Bh.set(
      s.width / n.width,
      0,
      0,
      s.height / n.height,
      -n.x / n.width,
      -n.y / n.height
    ), this.mapCoord.append(Bh));
    const o = e.baseTexture, a = this.uClampFrame, h = this.clampMargin / o.resolution, l = this.clampOffset;
    return a[0] = (e._frame.x + h + l) / o.width, a[1] = (e._frame.y + h + l) / o.height, a[2] = (e._frame.x + e._frame.width - h + l) / o.width, a[3] = (e._frame.y + e._frame.height - h + l) / o.height, this.uClampOffset[0] = l / o.realWidth, this.uClampOffset[1] = l / o.realHeight, this.isSimple = e._frame.width === o.width && e._frame.height === o.height && e.rotate === 0, !0;
  }
}
var bg = `varying vec2 vMaskCoord;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D mask;
uniform float alpha;
uniform float npmAlpha;
uniform vec4 maskClamp;

void main(void)
{
    float clip = step(3.5,
        step(maskClamp.x, vMaskCoord.x) +
        step(maskClamp.y, vMaskCoord.y) +
        step(vMaskCoord.x, maskClamp.z) +
        step(vMaskCoord.y, maskClamp.w));

    vec4 original = texture2D(uSampler, vTextureCoord);
    vec4 masky = texture2D(mask, vMaskCoord);
    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);

    original *= (alphaMul * masky.r * alpha * clip);

    gl_FragColor = original;
}
`, Tg = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform mat3 otherMatrix;

varying vec2 vMaskCoord;
varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = aTextureCoord;
    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;
}
`;
class Eg extends Gt {
  /** @ignore */
  constructor(t, e, i) {
    let s = null;
    typeof t != "string" && e === void 0 && i === void 0 && (s = t, t = void 0, e = void 0, i = void 0), super(t || Tg, e || bg, i), this.maskSprite = s, this.maskMatrix = new yt();
  }
  /**
   * Sprite mask
   * @type {PIXI.DisplayObject}
   */
  get maskSprite() {
    return this._maskSprite;
  }
  set maskSprite(t) {
    this._maskSprite = t, this._maskSprite && (this._maskSprite.renderable = !1);
  }
  /**
   * Applies the filter
   * @param filterManager - The renderer to retrieve the filter from
   * @param input - The input render target.
   * @param output - The target to output to.
   * @param clearMode - Should the output be cleared before rendering to it.
   */
  apply(t, e, i, s) {
    const n = this._maskSprite, o = n._texture;
    o.valid && (o.uvMatrix || (o.uvMatrix = new Pc(o, 0)), o.uvMatrix.update(), this.uniforms.npmAlpha = o.baseTexture.alphaMode ? 0 : 1, this.uniforms.mask = o, this.uniforms.otherMatrix = t.calculateSpriteMatrix(this.maskMatrix, n).prepend(o.uvMatrix.mapCoord), this.uniforms.alpha = n.worldAlpha, this.uniforms.maskClamp = o.uvMatrix.uClampFrame, t.applyFilter(this, e, i, s));
  }
}
class wg {
  /**
   * Create MaskData
   * @param {PIXI.DisplayObject} [maskObject=null] - object that describes the mask
   */
  constructor(t = null) {
    this.type = Ct.NONE, this.autoDetect = !0, this.maskObject = t || null, this.pooled = !1, this.isMaskData = !0, this.resolution = null, this.multisample = Gt.defaultMultisample, this.enabled = !0, this.colorMask = 15, this._filters = null, this._stencilCounter = 0, this._scissorCounter = 0, this._scissorRect = null, this._scissorRectLocal = null, this._colorMask = 15, this._target = null;
  }
  /**
   * The sprite mask filter.
   * If set to `null`, the default sprite mask filter is used.
   * @default null
   */
  get filter() {
    return this._filters ? this._filters[0] : null;
  }
  set filter(t) {
    t ? this._filters ? this._filters[0] = t : this._filters = [t] : this._filters = null;
  }
  /** Resets the mask data after popMask(). */
  reset() {
    this.pooled && (this.maskObject = null, this.type = Ct.NONE, this.autoDetect = !0), this._target = null, this._scissorRectLocal = null;
  }
  /**
   * Copies counters from maskData above, called from pushMask().
   * @param maskAbove
   */
  copyCountersOrReset(t) {
    t ? (this._stencilCounter = t._stencilCounter, this._scissorCounter = t._scissorCounter, this._scissorRect = t._scissorRect) : (this._stencilCounter = 0, this._scissorCounter = 0, this._scissorRect = null);
  }
}
class Mc {
  /**
   * @param renderer - The renderer this System works for.
   */
  constructor(t) {
    this.renderer = t, this.enableScissor = !0, this.alphaMaskPool = [], this.maskDataPool = [], this.maskStack = [], this.alphaMaskIndex = 0;
  }
  /**
   * Changes the mask stack that is used by this System.
   * @param maskStack - The mask stack
   */
  setMaskStack(t) {
    this.maskStack = t, this.renderer.scissor.setMaskStack(t), this.renderer.stencil.setMaskStack(t);
  }
  /**
   * Enables the mask and appends it to the current mask stack.
   *
   * NOTE: The batch renderer should be flushed beforehand to prevent pending renders from being masked.
   * @param {PIXI.DisplayObject} target - Display Object to push the mask to
   * @param {PIXI.MaskData|PIXI.Sprite|PIXI.Graphics|PIXI.DisplayObject} maskDataOrTarget - The masking data.
   */
  push(t, e) {
    let i = e;
    if (!i.isMaskData) {
      const n = this.maskDataPool.pop() || new wg();
      n.pooled = !0, n.maskObject = e, i = n;
    }
    const s = this.maskStack.length !== 0 ? this.maskStack[this.maskStack.length - 1] : null;
    if (i.copyCountersOrReset(s), i._colorMask = s ? s._colorMask : 15, i.autoDetect && this.detect(i), i._target = t, i.type !== Ct.SPRITE && this.maskStack.push(i), i.enabled)
      switch (i.type) {
        case Ct.SCISSOR:
          this.renderer.scissor.push(i);
          break;
        case Ct.STENCIL:
          this.renderer.stencil.push(i);
          break;
        case Ct.SPRITE:
          i.copyCountersOrReset(null), this.pushSpriteMask(i);
          break;
        case Ct.COLOR:
          this.pushColorMask(i);
          break;
      }
    i.type === Ct.SPRITE && this.maskStack.push(i);
  }
  /**
   * Removes the last mask from the mask stack and doesn't return it.
   *
   * NOTE: The batch renderer should be flushed beforehand to render the masked contents before the mask is removed.
   * @param {PIXI.IMaskTarget} target - Display Object to pop the mask from
   */
  pop(t) {
    const e = this.maskStack.pop();
    if (!(!e || e._target !== t)) {
      if (e.enabled)
        switch (e.type) {
          case Ct.SCISSOR:
            this.renderer.scissor.pop(e);
            break;
          case Ct.STENCIL:
            this.renderer.stencil.pop(e.maskObject);
            break;
          case Ct.SPRITE:
            this.popSpriteMask(e);
            break;
          case Ct.COLOR:
            this.popColorMask(e);
            break;
        }
      if (e.reset(), e.pooled && this.maskDataPool.push(e), this.maskStack.length !== 0) {
        const i = this.maskStack[this.maskStack.length - 1];
        i.type === Ct.SPRITE && i._filters && (i._filters[0].maskSprite = i.maskObject);
      }
    }
  }
  /**
   * Sets type of MaskData based on its maskObject.
   * @param maskData
   */
  detect(t) {
    const e = t.maskObject;
    e ? e.isSprite ? t.type = Ct.SPRITE : this.enableScissor && this.renderer.scissor.testScissor(t) ? t.type = Ct.SCISSOR : t.type = Ct.STENCIL : t.type = Ct.COLOR;
  }
  /**
   * Applies the Mask and adds it to the current filter stack.
   * @param maskData - Sprite to be used as the mask.
   */
  pushSpriteMask(t) {
    const { maskObject: e } = t, i = t._target;
    let s = t._filters;
    s || (s = this.alphaMaskPool[this.alphaMaskIndex], s || (s = this.alphaMaskPool[this.alphaMaskIndex] = [new Eg()])), s[0].resolution = t.resolution, s[0].multisample = t.multisample, s[0].maskSprite = e;
    const n = i.filterArea;
    i.filterArea = e.getBounds(!0), this.renderer.filter.push(i, s), i.filterArea = n, t._filters || this.alphaMaskIndex++;
  }
  /**
   * Removes the last filter from the filter stack and doesn't return it.
   * @param maskData - Sprite to be used as the mask.
   */
  popSpriteMask(t) {
    this.renderer.filter.pop(), t._filters ? t._filters[0].maskSprite = null : (this.alphaMaskIndex--, this.alphaMaskPool[this.alphaMaskIndex][0].maskSprite = null);
  }
  /**
   * Pushes the color mask.
   * @param maskData - The mask data
   */
  pushColorMask(t) {
    const e = t._colorMask, i = t._colorMask = e & t.colorMask;
    i !== e && this.renderer.gl.colorMask(
      (i & 1) !== 0,
      (i & 2) !== 0,
      (i & 4) !== 0,
      (i & 8) !== 0
    );
  }
  /**
   * Pops the color mask.
   * @param maskData - The mask data
   */
  popColorMask(t) {
    const e = t._colorMask, i = this.maskStack.length > 0 ? this.maskStack[this.maskStack.length - 1]._colorMask : 15;
    i !== e && this.renderer.gl.colorMask(
      (i & 1) !== 0,
      (i & 2) !== 0,
      (i & 4) !== 0,
      (i & 8) !== 0
    );
  }
  destroy() {
    this.renderer = null;
  }
}
Mc.extension = {
  type: k.RendererSystem,
  name: "mask"
};
z.add(Mc);
class Bc {
  /**
   * @param renderer - The renderer this System works for.
   */
  constructor(t) {
    this.renderer = t, this.maskStack = [], this.glConst = 0;
  }
  /** Gets count of masks of certain type. */
  getStackLength() {
    return this.maskStack.length;
  }
  /**
   * Changes the mask stack that is used by this System.
   * @param {PIXI.MaskData[]} maskStack - The mask stack
   */
  setMaskStack(t) {
    const { gl: e } = this.renderer, i = this.getStackLength();
    this.maskStack = t;
    const s = this.getStackLength();
    s !== i && (s === 0 ? e.disable(this.glConst) : (e.enable(this.glConst), this._useCurrent()));
  }
  /**
   * Setup renderer to use the current mask data.
   * @private
   */
  _useCurrent() {
  }
  /** Destroys the mask stack. */
  destroy() {
    this.renderer = null, this.maskStack = null;
  }
}
const Dh = new yt(), Fh = [], Dc = class ms extends Bc {
  /**
   * @param {PIXI.Renderer} renderer - The renderer this System works for.
   */
  constructor(t) {
    super(t), this.glConst = H.ADAPTER.getWebGLRenderingContext().SCISSOR_TEST;
  }
  getStackLength() {
    const t = this.maskStack[this.maskStack.length - 1];
    return t ? t._scissorCounter : 0;
  }
  /**
   * evaluates _boundsTransformed, _scissorRect for MaskData
   * @param maskData
   */
  calcScissorRect(t) {
    if (t._scissorRectLocal)
      return;
    const e = t._scissorRect, { maskObject: i } = t, { renderer: s } = this, n = s.renderTexture, o = i.getBounds(!0, Fh.pop() ?? new tt());
    this.roundFrameToPixels(
      o,
      n.current ? n.current.resolution : s.resolution,
      n.sourceFrame,
      n.destinationFrame,
      s.projection.transform
    ), e && o.fit(e), t._scissorRectLocal = o;
  }
  static isMatrixRotated(t) {
    if (!t)
      return !1;
    const { a: e, b: i, c: s, d: n } = t;
    return (Math.abs(i) > 1e-4 || Math.abs(s) > 1e-4) && (Math.abs(e) > 1e-4 || Math.abs(n) > 1e-4);
  }
  /**
   * Test, whether the object can be scissor mask with current renderer projection.
   * Calls "calcScissorRect()" if its true.
   * @param maskData - mask data
   * @returns whether Whether the object can be scissor mask
   */
  testScissor(t) {
    const { maskObject: e } = t;
    if (!e.isFastRect || !e.isFastRect() || ms.isMatrixRotated(e.worldTransform) || ms.isMatrixRotated(this.renderer.projection.transform))
      return !1;
    this.calcScissorRect(t);
    const i = t._scissorRectLocal;
    return i.width > 0 && i.height > 0;
  }
  roundFrameToPixels(t, e, i, s, n) {
    ms.isMatrixRotated(n) || (n = n ? Dh.copyFrom(n) : Dh.identity(), n.translate(-i.x, -i.y).scale(
      s.width / i.width,
      s.height / i.height
    ).translate(s.x, s.y), this.renderer.filter.transformAABB(n, t), t.fit(s), t.x = Math.round(t.x * e), t.y = Math.round(t.y * e), t.width = Math.round(t.width * e), t.height = Math.round(t.height * e));
  }
  /**
   * Applies the Mask and adds it to the current stencil stack.
   * @author alvin
   * @param maskData - The mask data.
   */
  push(t) {
    t._scissorRectLocal || this.calcScissorRect(t);
    const { gl: e } = this.renderer;
    t._scissorRect || e.enable(e.SCISSOR_TEST), t._scissorCounter++, t._scissorRect = t._scissorRectLocal, this._useCurrent();
  }
  /**
   * This should be called after a mask is popped off the mask stack. It will rebind the scissor box to be latest with the
   * last mask in the stack.
   *
   * This can also be called when you directly modify the scissor box and want to restore PixiJS state.
   * @param maskData - The mask data.
   */
  pop(t) {
    const { gl: e } = this.renderer;
    t && Fh.push(t._scissorRectLocal), this.getStackLength() > 0 ? this._useCurrent() : e.disable(e.SCISSOR_TEST);
  }
  /**
   * Setup renderer to use the current scissor data.
   * @private
   */
  _useCurrent() {
    const t = this.maskStack[this.maskStack.length - 1]._scissorRect;
    let e;
    this.renderer.renderTexture.current ? e = t.y : e = this.renderer.height - t.height - t.y, this.renderer.gl.scissor(t.x, e, t.width, t.height);
  }
};
Dc.extension = {
  type: k.RendererSystem,
  name: "scissor"
};
let Ag = Dc;
z.add(Ag);
class Fc extends Bc {
  /**
   * @param renderer - The renderer this System works for.
   */
  constructor(t) {
    super(t), this.glConst = H.ADAPTER.getWebGLRenderingContext().STENCIL_TEST;
  }
  getStackLength() {
    const t = this.maskStack[this.maskStack.length - 1];
    return t ? t._stencilCounter : 0;
  }
  /**
   * Applies the Mask and adds it to the current stencil stack.
   * @param maskData - The mask data
   */
  push(t) {
    const e = t.maskObject, { gl: i } = this.renderer, s = t._stencilCounter;
    s === 0 && (this.renderer.framebuffer.forceStencil(), i.clearStencil(0), i.clear(i.STENCIL_BUFFER_BIT), i.enable(i.STENCIL_TEST)), t._stencilCounter++;
    const n = t._colorMask;
    n !== 0 && (t._colorMask = 0, i.colorMask(!1, !1, !1, !1)), i.stencilFunc(i.EQUAL, s, 4294967295), i.stencilOp(i.KEEP, i.KEEP, i.INCR), e.renderable = !0, e.render(this.renderer), this.renderer.batch.flush(), e.renderable = !1, n !== 0 && (t._colorMask = n, i.colorMask(
      (n & 1) !== 0,
      (n & 2) !== 0,
      (n & 4) !== 0,
      (n & 8) !== 0
    )), this._useCurrent();
  }
  /**
   * Pops stencil mask. MaskData is already removed from stack
   * @param {PIXI.DisplayObject} maskObject - object of popped mask data
   */
  pop(t) {
    const e = this.renderer.gl;
    if (this.getStackLength() === 0)
      e.disable(e.STENCIL_TEST);
    else {
      const i = this.maskStack.length !== 0 ? this.maskStack[this.maskStack.length - 1] : null, s = i ? i._colorMask : 15;
      s !== 0 && (i._colorMask = 0, e.colorMask(!1, !1, !1, !1)), e.stencilOp(e.KEEP, e.KEEP, e.DECR), t.renderable = !0, t.render(this.renderer), this.renderer.batch.flush(), t.renderable = !1, s !== 0 && (i._colorMask = s, e.colorMask(
        (s & 1) !== 0,
        (s & 2) !== 0,
        (s & 4) !== 0,
        (s & 8) !== 0
      )), this._useCurrent();
    }
  }
  /**
   * Setup renderer to use the current stencil data.
   * @private
   */
  _useCurrent() {
    const t = this.renderer.gl;
    t.stencilFunc(t.EQUAL, this.getStackLength(), 4294967295), t.stencilOp(t.KEEP, t.KEEP, t.KEEP);
  }
}
Fc.extension = {
  type: k.RendererSystem,
  name: "stencil"
};
z.add(Fc);
class Oc {
  constructor(t) {
    this.renderer = t, this.plugins = {}, Object.defineProperties(this.plugins, {
      extract: {
        enumerable: !1,
        get() {
          return it("7.0.0", "renderer.plugins.extract has moved to renderer.extract"), t.extract;
        }
      },
      prepare: {
        enumerable: !1,
        get() {
          return it("7.0.0", "renderer.plugins.prepare has moved to renderer.prepare"), t.prepare;
        }
      },
      interaction: {
        enumerable: !1,
        get() {
          return it("7.0.0", "renderer.plugins.interaction has been deprecated, use renderer.events"), t.events;
        }
      }
    });
  }
  /**
   * Initialize the plugins.
   * @protected
   */
  init() {
    const t = this.rendererPlugins;
    for (const e in t)
      this.plugins[e] = new t[e](this.renderer);
  }
  destroy() {
    for (const t in this.plugins)
      this.plugins[t].destroy(), this.plugins[t] = null;
  }
}
Oc.extension = {
  type: [
    k.RendererSystem,
    k.CanvasRendererSystem
  ],
  name: "_plugin"
};
z.add(Oc);
class Lc {
  /** @param renderer - The renderer this System works for. */
  constructor(t) {
    this.renderer = t, this.destinationFrame = null, this.sourceFrame = null, this.defaultFrame = null, this.projectionMatrix = new yt(), this.transform = null;
  }
  /**
   * Updates the projection-matrix based on the sourceFrame → destinationFrame mapping provided.
   *
   * NOTE: It is expected you call `renderer.framebuffer.setViewport(destinationFrame)` after this. This is because
   * the framebuffer viewport converts shader vertex output in normalized device coordinates to window coordinates.
   *
   * NOTE-2: {@link PIXI.RenderTextureSystem#bind} updates the projection-matrix when you bind a render-texture.
   * It is expected
   * that you dirty the current bindings when calling this manually.
   * @param destinationFrame - The rectangle in the render-target to render the contents into. If rendering to the canvas,
   *  the origin is on the top-left; if rendering to a render-texture, the origin is on the bottom-left.
   * @param sourceFrame - The rectangle in world space that contains the contents being rendered.
   * @param resolution - The resolution of the render-target, which is the ratio of
   *  world-space (or CSS) pixels to physical pixels.
   * @param root - Whether the render-target is the screen. This is required because rendering to textures
   *  is y-flipped (i.e. upside down relative to the screen).
   */
  update(t, e, i, s) {
    this.destinationFrame = t || this.destinationFrame || this.defaultFrame, this.sourceFrame = e || this.sourceFrame || t, this.calculateProjection(this.destinationFrame, this.sourceFrame, i, s), this.transform && this.projectionMatrix.append(this.transform);
    const n = this.renderer;
    n.globalUniforms.uniforms.projectionMatrix = this.projectionMatrix, n.globalUniforms.update(), n.shader.shader && n.shader.syncUniformGroup(n.shader.shader.uniforms.globals);
  }
  /**
   * Calculates the `projectionMatrix` to map points inside `sourceFrame` to inside `destinationFrame`.
   * @param _destinationFrame - The destination frame in the render-target.
   * @param sourceFrame - The source frame in world space.
   * @param _resolution - The render-target's resolution, i.e. ratio of CSS to physical pixels.
   * @param root - Whether rendering into the screen. Otherwise, if rendering to a framebuffer, the projection
   *  is y-flipped.
   */
  calculateProjection(t, e, i, s) {
    const n = this.projectionMatrix, o = s ? -1 : 1;
    n.identity(), n.a = 1 / e.width * 2, n.d = o * (1 / e.height * 2), n.tx = -1 - e.x * n.a, n.ty = -o - e.y * n.d;
  }
  /**
   * Sets the transform of the active render target to the given matrix.
   * @param _matrix - The transformation matrix
   */
  setTransform(t) {
  }
  destroy() {
    this.renderer = null;
  }
}
Lc.extension = {
  type: k.RendererSystem,
  name: "projection"
};
z.add(Lc);
const Sg = new da(), Oh = new tt();
class Nc {
  constructor(t) {
    this.renderer = t, this._tempMatrix = new yt();
  }
  /**
   * A Useful function that returns a texture of the display object that can then be used to create sprites
   * This can be quite useful if your displayObject is complicated and needs to be reused multiple times.
   * @param displayObject - The displayObject the object will be generated from.
   * @param {IGenerateTextureOptions} options - Generate texture options.
   * @param {PIXI.Rectangle} options.region - The region of the displayObject, that shall be rendered,
   *        if no region is specified, defaults to the local bounds of the displayObject.
   * @param {number} [options.resolution] - If not given, the renderer's resolution is used.
   * @param {PIXI.MSAA_QUALITY} [options.multisample] - If not given, the renderer's multisample is used.
   * @returns a shiny new texture of the display object passed in
   */
  generateTexture(t, e) {
    const { region: i, ...s } = e || {}, n = (i == null ? void 0 : i.copyTo(Oh)) || t.getLocalBounds(Oh, !0), o = s.resolution || this.renderer.resolution;
    n.width = Math.max(n.width, 1 / o), n.height = Math.max(n.height, 1 / o), s.width = n.width, s.height = n.height, s.resolution = o, s.multisample ?? (s.multisample = this.renderer.multisample);
    const a = Sr.create(s);
    this._tempMatrix.tx = -n.x, this._tempMatrix.ty = -n.y;
    const h = t.transform;
    return t.transform = Sg, this.renderer.render(t, {
      renderTexture: a,
      transform: this._tempMatrix,
      skipUpdateTransform: !!t.parent,
      blit: !0
    }), t.transform = h, a;
  }
  destroy() {
  }
}
Nc.extension = {
  type: [
    k.RendererSystem,
    k.CanvasRendererSystem
  ],
  name: "textureGenerator"
};
z.add(Nc);
const ir = new tt(), hi = new tt();
class kc {
  /**
   * @param renderer - The renderer this System works for.
   */
  constructor(t) {
    this.renderer = t, this.defaultMaskStack = [], this.current = null, this.sourceFrame = new tt(), this.destinationFrame = new tt(), this.viewportFrame = new tt();
  }
  contextChange() {
    var e;
    const t = (e = this.renderer) == null ? void 0 : e.gl.getContextAttributes();
    this._rendererPremultipliedAlpha = !!(t && t.alpha && t.premultipliedAlpha);
  }
  /**
   * Bind the current render texture.
   * @param renderTexture - RenderTexture to bind, by default its `null` - the screen.
   * @param sourceFrame - Part of world that is mapped to the renderTexture.
   * @param destinationFrame - Part of renderTexture, by default it has the same size as sourceFrame.
   */
  bind(t = null, e, i) {
    const s = this.renderer;
    this.current = t;
    let n, o, a;
    t ? (n = t.baseTexture, a = n.resolution, e || (ir.width = t.frame.width, ir.height = t.frame.height, e = ir), i || (hi.x = t.frame.x, hi.y = t.frame.y, hi.width = e.width, hi.height = e.height, i = hi), o = n.framebuffer) : (a = s.resolution, e || (ir.width = s._view.screen.width, ir.height = s._view.screen.height, e = ir), i || (i = ir, i.width = e.width, i.height = e.height));
    const h = this.viewportFrame;
    h.x = i.x * a, h.y = i.y * a, h.width = i.width * a, h.height = i.height * a, t || (h.y = s.view.height - (h.y + h.height)), h.ceil(), this.renderer.framebuffer.bind(o, h), this.renderer.projection.update(i, e, a, !o), t ? this.renderer.mask.setMaskStack(n.maskStack) : this.renderer.mask.setMaskStack(this.defaultMaskStack), this.sourceFrame.copyFrom(e), this.destinationFrame.copyFrom(i);
  }
  /**
   * Erases the render texture and fills the drawing area with a colour.
   * @param clearColor - The color as rgba, default to use the renderer backgroundColor
   * @param [mask=BUFFER_BITS.COLOR | BUFFER_BITS.DEPTH] - Bitwise OR of masks
   *  that indicate the buffers to be cleared, by default COLOR and DEPTH buffers.
   */
  clear(t, e) {
    const i = this.current ? this.current.baseTexture.clear : this.renderer.background.backgroundColor, s = pt.shared.setValue(t || i);
    (this.current && this.current.baseTexture.alphaMode > 0 || !this.current && this._rendererPremultipliedAlpha) && s.premultiply(s.alpha);
    const n = this.destinationFrame, o = this.current ? this.current.baseTexture : this.renderer._view.screen, a = n.width !== o.width || n.height !== o.height;
    if (a) {
      let { x: h, y: l, width: c, height: u } = this.viewportFrame;
      h = Math.round(h), l = Math.round(l), c = Math.round(c), u = Math.round(u), this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST), this.renderer.gl.scissor(h, l, c, u);
    }
    this.renderer.framebuffer.clear(s.red, s.green, s.blue, s.alpha, e), a && this.renderer.scissor.pop();
  }
  resize() {
    this.bind(null);
  }
  /** Resets render-texture state. */
  reset() {
    this.bind(null);
  }
  destroy() {
    this.renderer = null;
  }
}
kc.extension = {
  type: k.RendererSystem,
  name: "renderTexture"
};
z.add(kc);
class Ig {
  /**
   * Makes a new Pixi program.
   * @param program - webgl program
   * @param uniformData - uniforms
   */
  constructor(t, e) {
    this.program = t, this.uniformData = e, this.uniformGroups = {}, this.uniformDirtyGroups = {}, this.uniformBufferBindings = {};
  }
  /** Destroys this program. */
  destroy() {
    this.uniformData = null, this.uniformGroups = null, this.uniformDirtyGroups = null, this.uniformBufferBindings = null, this.program = null;
  }
}
function Cg(r, t) {
  const e = {}, i = t.getProgramParameter(r, t.ACTIVE_ATTRIBUTES);
  for (let s = 0; s < i; s++) {
    const n = t.getActiveAttrib(r, s);
    if (n.name.startsWith("gl_"))
      continue;
    const o = bc(t, n.type), a = {
      type: o,
      name: n.name,
      size: xc(o),
      location: t.getAttribLocation(r, n.name)
    };
    e[n.name] = a;
  }
  return e;
}
function Rg(r, t) {
  const e = {}, i = t.getProgramParameter(r, t.ACTIVE_UNIFORMS);
  for (let s = 0; s < i; s++) {
    const n = t.getActiveUniform(r, s), o = n.name.replace(/\[.*?\]$/, ""), a = !!n.name.match(/\[.*?\]$/), h = bc(t, n.type);
    e[o] = {
      name: o,
      index: s,
      type: h,
      size: n.size,
      isArray: a,
      value: _c(h, n.size)
    };
  }
  return e;
}
function Pg(r, t) {
  var a;
  const e = Sh(r, r.VERTEX_SHADER, t.vertexSrc), i = Sh(r, r.FRAGMENT_SHADER, t.fragmentSrc), s = r.createProgram();
  r.attachShader(s, e), r.attachShader(s, i);
  const n = (a = t.extra) == null ? void 0 : a.transformFeedbackVaryings;
  if (n && (typeof r.transformFeedbackVaryings != "function" ? console.warn("TransformFeedback is not supported but TransformFeedbackVaryings are given.") : r.transformFeedbackVaryings(
    s,
    n.names,
    n.bufferMode === "separate" ? r.SEPARATE_ATTRIBS : r.INTERLEAVED_ATTRIBS
  )), r.linkProgram(s), r.getProgramParameter(s, r.LINK_STATUS) || ng(r, s, e, i), t.attributeData = Cg(s, r), t.uniformData = Rg(s, r), !/^[ \t]*#[ \t]*version[ \t]+300[ \t]+es[ \t]*$/m.test(t.vertexSrc)) {
    const h = Object.keys(t.attributeData);
    h.sort((l, c) => l > c ? 1 : -1);
    for (let l = 0; l < h.length; l++)
      t.attributeData[h[l]].location = l, r.bindAttribLocation(s, l, h[l]);
    r.linkProgram(s);
  }
  r.deleteShader(e), r.deleteShader(i);
  const o = {};
  for (const h in t.uniformData) {
    const l = t.uniformData[h];
    o[h] = {
      location: r.getUniformLocation(s, h),
      value: _c(l.type, l.size)
    };
  }
  return new Ig(s, o);
}
function Mg(r, t, e, i, s) {
  e.buffer.update(s);
}
const Bg = {
  float: `
        data[offset] = v;
    `,
  vec2: `
        data[offset] = v[0];
        data[offset+1] = v[1];
    `,
  vec3: `
        data[offset] = v[0];
        data[offset+1] = v[1];
        data[offset+2] = v[2];

    `,
  vec4: `
        data[offset] = v[0];
        data[offset+1] = v[1];
        data[offset+2] = v[2];
        data[offset+3] = v[3];
    `,
  mat2: `
        data[offset] = v[0];
        data[offset+1] = v[1];

        data[offset+4] = v[2];
        data[offset+5] = v[3];
    `,
  mat3: `
        data[offset] = v[0];
        data[offset+1] = v[1];
        data[offset+2] = v[2];

        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];

        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];
    `,
  mat4: `
        for(var i = 0; i < 16; i++)
        {
            data[offset + i] = v[i];
        }
    `
}, Uc = {
  float: 4,
  vec2: 8,
  vec3: 12,
  vec4: 16,
  int: 4,
  ivec2: 8,
  ivec3: 12,
  ivec4: 16,
  uint: 4,
  uvec2: 8,
  uvec3: 12,
  uvec4: 16,
  bool: 4,
  bvec2: 8,
  bvec3: 12,
  bvec4: 16,
  mat2: 16 * 2,
  mat3: 16 * 3,
  mat4: 16 * 4
};
function Dg(r) {
  const t = r.map((n) => ({
    data: n,
    offset: 0,
    dataLen: 0,
    dirty: 0
  }));
  let e = 0, i = 0, s = 0;
  for (let n = 0; n < t.length; n++) {
    const o = t[n];
    if (e = Uc[o.data.type], o.data.size > 1 && (e = Math.max(e, 16) * o.data.size), o.dataLen = e, i % e !== 0 && i < 16) {
      const a = i % e % 16;
      i += a, s += a;
    }
    i + e > 16 ? (s = Math.ceil(s / 16) * 16, o.offset = s, s += e, i = e) : (o.offset = s, i += e, s += e);
  }
  return s = Math.ceil(s / 16) * 16, { uboElements: t, size: s };
}
function Fg(r, t) {
  const e = [];
  for (const i in r)
    t[i] && e.push(t[i]);
  return e.sort((i, s) => i.index - s.index), e;
}
function Og(r, t) {
  if (!r.autoManage)
    return { size: 0, syncFunc: Mg };
  const e = Fg(r.uniforms, t), { uboElements: i, size: s } = Dg(e), n = [`
    var v = null;
    var v2 = null;
    var cv = null;
    var t = 0;
    var gl = renderer.gl
    var index = 0;
    var data = buffer.data;
    `];
  for (let o = 0; o < i.length; o++) {
    const a = i[o], h = r.uniforms[a.data.name], l = a.data.name;
    let c = !1;
    for (let u = 0; u < qr.length; u++) {
      const d = qr[u];
      if (d.codeUbo && d.test(a.data, h)) {
        n.push(
          `offset = ${a.offset / 4};`,
          qr[u].codeUbo(a.data.name, h)
        ), c = !0;
        break;
      }
    }
    if (!c)
      if (a.data.size > 1) {
        const u = xc(a.data.type), d = Math.max(Uc[a.data.type] / 16, 1), f = u / d, p = (4 - f % 4) % 4;
        n.push(`
                cv = ud.${l}.value;
                v = uv.${l};
                offset = ${a.offset / 4};

                t = 0;

                for(var i=0; i < ${a.data.size * d}; i++)
                {
                    for(var j = 0; j < ${f}; j++)
                    {
                        data[offset++] = v[t++];
                    }
                    offset += ${p};
                }

                `);
      } else {
        const u = Bg[a.data.type];
        n.push(`
                cv = ud.${l}.value;
                v = uv.${l};
                offset = ${a.offset / 4};
                ${u};
                `);
      }
  }
  return n.push(`
       renderer.buffer.update(buffer);
    `), {
    size: s,
    // eslint-disable-next-line no-new-func
    syncFunc: new Function(
      "ud",
      "uv",
      "renderer",
      "syncData",
      "buffer",
      n.join(`
`)
    )
  };
}
let Lg = 0;
const Qi = { textureCount: 0, uboCount: 0 };
class Gc {
  /** @param renderer - The renderer this System works for. */
  constructor(t) {
    this.destroyed = !1, this.renderer = t, this.systemCheck(), this.gl = null, this.shader = null, this.program = null, this.cache = {}, this._uboCache = {}, this.id = Lg++;
  }
  /**
   * Overrideable function by `@pixi/unsafe-eval` to silence
   * throwing an error if platform doesn't support unsafe-evals.
   * @private
   */
  systemCheck() {
    if (!ag())
      throw new Error("Current environment does not allow unsafe-eval, please use @pixi/unsafe-eval module to enable support.");
  }
  contextChange(t) {
    this.gl = t, this.reset();
  }
  /**
   * Changes the current shader to the one given in parameter.
   * @param shader - the new shader
   * @param dontSync - false if the shader should automatically sync its uniforms.
   * @returns the glProgram that belongs to the shader.
   */
  bind(t, e) {
    t.disposeRunner.add(this), t.uniforms.globals = this.renderer.globalUniforms;
    const i = t.program, s = i.glPrograms[this.renderer.CONTEXT_UID] || this.generateProgram(t);
    return this.shader = t, this.program !== i && (this.program = i, this.gl.useProgram(s.program)), e || (Qi.textureCount = 0, Qi.uboCount = 0, this.syncUniformGroup(t.uniformGroup, Qi)), s;
  }
  /**
   * Uploads the uniforms values to the currently bound shader.
   * @param uniforms - the uniforms values that be applied to the current shader
   */
  setUniforms(t) {
    const e = this.shader.program, i = e.glPrograms[this.renderer.CONTEXT_UID];
    e.syncUniforms(i.uniformData, t, this.renderer);
  }
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  /**
   * Syncs uniforms on the group
   * @param group - the uniform group to sync
   * @param syncData - this is data that is passed to the sync function and any nested sync functions
   */
  syncUniformGroup(t, e) {
    const i = this.getGlProgram();
    (!t.static || t.dirtyId !== i.uniformDirtyGroups[t.id]) && (i.uniformDirtyGroups[t.id] = t.dirtyId, this.syncUniforms(t, i, e));
  }
  /**
   * Overrideable by the @pixi/unsafe-eval package to use static syncUniforms instead.
   * @param group
   * @param glProgram
   * @param syncData
   */
  syncUniforms(t, e, i) {
    (t.syncUniforms[this.shader.program.id] || this.createSyncGroups(t))(e.uniformData, t.uniforms, this.renderer, i);
  }
  createSyncGroups(t) {
    const e = this.getSignature(t, this.shader.program.uniformData, "u");
    return this.cache[e] || (this.cache[e] = rg(t, this.shader.program.uniformData)), t.syncUniforms[this.shader.program.id] = this.cache[e], t.syncUniforms[this.shader.program.id];
  }
  /**
   * Syncs uniform buffers
   * @param group - the uniform buffer group to sync
   * @param name - the name of the uniform buffer
   */
  syncUniformBufferGroup(t, e) {
    const i = this.getGlProgram();
    if (!t.static || t.dirtyId !== 0 || !i.uniformGroups[t.id]) {
      t.dirtyId = 0;
      const s = i.uniformGroups[t.id] || this.createSyncBufferGroup(t, i, e);
      t.buffer.update(), s(
        i.uniformData,
        t.uniforms,
        this.renderer,
        Qi,
        t.buffer
      );
    }
    this.renderer.buffer.bindBufferBase(t.buffer, i.uniformBufferBindings[e]);
  }
  /**
   * Will create a function that uploads a uniform buffer using the STD140 standard.
   * The upload function will then be cached for future calls
   * If a group is manually managed, then a simple upload function is generated
   * @param group - the uniform buffer group to sync
   * @param glProgram - the gl program to attach the uniform bindings to
   * @param name - the name of the uniform buffer (must exist on the shader)
   */
  createSyncBufferGroup(t, e, i) {
    const { gl: s } = this.renderer;
    this.renderer.buffer.bind(t.buffer);
    const n = this.gl.getUniformBlockIndex(e.program, i);
    e.uniformBufferBindings[i] = this.shader.uniformBindCount, s.uniformBlockBinding(e.program, n, this.shader.uniformBindCount), this.shader.uniformBindCount++;
    const o = this.getSignature(t, this.shader.program.uniformData, "ubo");
    let a = this._uboCache[o];
    if (a || (a = this._uboCache[o] = Og(t, this.shader.program.uniformData)), t.autoManage) {
      const h = new Float32Array(a.size / 4);
      t.buffer.update(h);
    }
    return e.uniformGroups[t.id] = a.syncFunc, e.uniformGroups[t.id];
  }
  /**
   * Takes a uniform group and data and generates a unique signature for them.
   * @param group - The uniform group to get signature of
   * @param group.uniforms
   * @param uniformData - Uniform information generated by the shader
   * @param preFix
   * @returns Unique signature of the uniform group
   */
  getSignature(t, e, i) {
    const s = t.uniforms, n = [`${i}-`];
    for (const o in s)
      n.push(o), e[o] && n.push(e[o].type);
    return n.join("-");
  }
  /**
   * Returns the underlying GLShade rof the currently bound shader.
   *
   * This can be handy for when you to have a little more control over the setting of your uniforms.
   * @returns The glProgram for the currently bound Shader for this context
   */
  getGlProgram() {
    return this.shader ? this.shader.program.glPrograms[this.renderer.CONTEXT_UID] : null;
  }
  /**
   * Generates a glProgram version of the Shader provided.
   * @param shader - The shader that the glProgram will be based on.
   * @returns A shiny new glProgram!
   */
  generateProgram(t) {
    const e = this.gl, i = t.program, s = Pg(e, i);
    return i.glPrograms[this.renderer.CONTEXT_UID] = s, s;
  }
  /** Resets ShaderSystem state, does not affect WebGL state. */
  reset() {
    this.program = null, this.shader = null;
  }
  /**
   * Disposes shader.
   * If disposing one equals with current shader, set current as null.
   * @param shader - Shader object
   */
  disposeShader(t) {
    this.shader === t && (this.shader = null);
  }
  /** Destroys this System and removes all its textures. */
  destroy() {
    this.renderer = null, this.destroyed = !0;
  }
}
Gc.extension = {
  type: k.RendererSystem,
  name: "shader"
};
z.add(Gc);
class Fs {
  constructor(t) {
    this.renderer = t;
  }
  /**
   * It all starts here! This initiates every system, passing in the options for any system by name.
   * @param options - the config for the renderer and all its systems
   */
  run(t) {
    const { renderer: e } = this;
    e.runners.init.emit(e.options), t.hello && console.log(`PixiJS 7.3.3 - ${e.rendererLogId} - https://pixijs.com`), e.resize(e.screen.width, e.screen.height);
  }
  destroy() {
  }
}
Fs.defaultOptions = {
  /**
   * {@link PIXI.IRendererOptions.hello}
   * @default false
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  hello: !1
}, /** @ignore */
Fs.extension = {
  type: [
    k.RendererSystem,
    k.CanvasRendererSystem
  ],
  name: "startup"
};
z.add(Fs);
function Ng(r, t = []) {
  return t[K.NORMAL] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.ADD] = [r.ONE, r.ONE], t[K.MULTIPLY] = [r.DST_COLOR, r.ONE_MINUS_SRC_ALPHA, r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.SCREEN] = [r.ONE, r.ONE_MINUS_SRC_COLOR, r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.OVERLAY] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.DARKEN] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.LIGHTEN] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.COLOR_DODGE] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.COLOR_BURN] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.HARD_LIGHT] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.SOFT_LIGHT] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.DIFFERENCE] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.EXCLUSION] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.HUE] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.SATURATION] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.COLOR] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.LUMINOSITY] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.NONE] = [0, 0], t[K.NORMAL_NPM] = [r.SRC_ALPHA, r.ONE_MINUS_SRC_ALPHA, r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.ADD_NPM] = [r.SRC_ALPHA, r.ONE, r.ONE, r.ONE], t[K.SCREEN_NPM] = [r.SRC_ALPHA, r.ONE_MINUS_SRC_COLOR, r.ONE, r.ONE_MINUS_SRC_ALPHA], t[K.SRC_IN] = [r.DST_ALPHA, r.ZERO], t[K.SRC_OUT] = [r.ONE_MINUS_DST_ALPHA, r.ZERO], t[K.SRC_ATOP] = [r.DST_ALPHA, r.ONE_MINUS_SRC_ALPHA], t[K.DST_OVER] = [r.ONE_MINUS_DST_ALPHA, r.ONE], t[K.DST_IN] = [r.ZERO, r.SRC_ALPHA], t[K.DST_OUT] = [r.ZERO, r.ONE_MINUS_SRC_ALPHA], t[K.DST_ATOP] = [r.ONE_MINUS_DST_ALPHA, r.SRC_ALPHA], t[K.XOR] = [r.ONE_MINUS_DST_ALPHA, r.ONE_MINUS_SRC_ALPHA], t[K.SUBTRACT] = [r.ONE, r.ONE, r.ONE, r.ONE, r.FUNC_REVERSE_SUBTRACT, r.FUNC_ADD], t;
}
const kg = 0, Ug = 1, Gg = 2, Hg = 3, Vg = 4, Xg = 5, Hc = class So {
  constructor() {
    this.gl = null, this.stateId = 0, this.polygonOffset = 0, this.blendMode = K.NONE, this._blendEq = !1, this.map = [], this.map[kg] = this.setBlend, this.map[Ug] = this.setOffset, this.map[Gg] = this.setCullFace, this.map[Hg] = this.setDepthTest, this.map[Vg] = this.setFrontFace, this.map[Xg] = this.setDepthMask, this.checks = [], this.defaultState = new Ae(), this.defaultState.blend = !0;
  }
  contextChange(t) {
    this.gl = t, this.blendModes = Ng(t), this.set(this.defaultState), this.reset();
  }
  /**
   * Sets the current state
   * @param {*} state - The state to set.
   */
  set(t) {
    if (t = t || this.defaultState, this.stateId !== t.data) {
      let e = this.stateId ^ t.data, i = 0;
      for (; e; )
        e & 1 && this.map[i].call(this, !!(t.data & 1 << i)), e = e >> 1, i++;
      this.stateId = t.data;
    }
    for (let e = 0; e < this.checks.length; e++)
      this.checks[e](this, t);
  }
  /**
   * Sets the state, when previous state is unknown.
   * @param {*} state - The state to set
   */
  forceState(t) {
    t = t || this.defaultState;
    for (let e = 0; e < this.map.length; e++)
      this.map[e].call(this, !!(t.data & 1 << e));
    for (let e = 0; e < this.checks.length; e++)
      this.checks[e](this, t);
    this.stateId = t.data;
  }
  /**
   * Sets whether to enable or disable blending.
   * @param value - Turn on or off WebGl blending.
   */
  setBlend(t) {
    this.updateCheck(So.checkBlendMode, t), this.gl[t ? "enable" : "disable"](this.gl.BLEND);
  }
  /**
   * Sets whether to enable or disable polygon offset fill.
   * @param value - Turn on or off webgl polygon offset testing.
   */
  setOffset(t) {
    this.updateCheck(So.checkPolygonOffset, t), this.gl[t ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL);
  }
  /**
   * Sets whether to enable or disable depth test.
   * @param value - Turn on or off webgl depth testing.
   */
  setDepthTest(t) {
    this.gl[t ? "enable" : "disable"](this.gl.DEPTH_TEST);
  }
  /**
   * Sets whether to enable or disable depth mask.
   * @param value - Turn on or off webgl depth mask.
   */
  setDepthMask(t) {
    this.gl.depthMask(t);
  }
  /**
   * Sets whether to enable or disable cull face.
   * @param {boolean} value - Turn on or off webgl cull face.
   */
  setCullFace(t) {
    this.gl[t ? "enable" : "disable"](this.gl.CULL_FACE);
  }
  /**
   * Sets the gl front face.
   * @param {boolean} value - true is clockwise and false is counter-clockwise
   */
  setFrontFace(t) {
    this.gl.frontFace(this.gl[t ? "CW" : "CCW"]);
  }
  /**
   * Sets the blend mode.
   * @param {number} value - The blend mode to set to.
   */
  setBlendMode(t) {
    if (t === this.blendMode)
      return;
    this.blendMode = t;
    const e = this.blendModes[t], i = this.gl;
    e.length === 2 ? i.blendFunc(e[0], e[1]) : i.blendFuncSeparate(e[0], e[1], e[2], e[3]), e.length === 6 ? (this._blendEq = !0, i.blendEquationSeparate(e[4], e[5])) : this._blendEq && (this._blendEq = !1, i.blendEquationSeparate(i.FUNC_ADD, i.FUNC_ADD));
  }
  /**
   * Sets the polygon offset.
   * @param {number} value - the polygon offset
   * @param {number} scale - the polygon offset scale
   */
  setPolygonOffset(t, e) {
    this.gl.polygonOffset(t, e);
  }
  // used
  /** Resets all the logic and disables the VAOs. */
  reset() {
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, !1), this.forceState(this.defaultState), this._blendEq = !0, this.blendMode = -1, this.setBlendMode(0);
  }
  /**
   * Checks to see which updates should be checked based on which settings have been activated.
   *
   * For example, if blend is enabled then we should check the blend modes each time the state is changed
   * or if polygon fill is activated then we need to check if the polygon offset changes.
   * The idea is that we only check what we have too.
   * @param func - the checking function to add or remove
   * @param value - should the check function be added or removed.
   */
  updateCheck(t, e) {
    const i = this.checks.indexOf(t);
    e && i === -1 ? this.checks.push(t) : !e && i !== -1 && this.checks.splice(i, 1);
  }
  /**
   * A private little wrapper function that we call to check the blend mode.
   * @param system - the System to perform the state check on
   * @param state - the state that the blendMode will pulled from
   */
  static checkBlendMode(t, e) {
    t.setBlendMode(e.blendMode);
  }
  /**
   * A private little wrapper function that we call to check the polygon offset.
   * @param system - the System to perform the state check on
   * @param state - the state that the blendMode will pulled from
   */
  static checkPolygonOffset(t, e) {
    t.setPolygonOffset(1, e.polygonOffset);
  }
  /**
   * @ignore
   */
  destroy() {
    this.gl = null;
  }
};
Hc.extension = {
  type: k.RendererSystem,
  name: "state"
};
let zg = Hc;
z.add(zg);
class Wg extends Bi {
  constructor() {
    super(...arguments), this.runners = {}, this._systemsHash = {};
  }
  /**
   * Set up a system with a collection of SystemClasses and runners.
   * Systems are attached dynamically to this class when added.
   * @param config - the config for the system manager
   */
  setup(t) {
    this.addRunners(...t.runners);
    const e = (t.priority ?? []).filter((s) => t.systems[s]), i = [
      ...e,
      ...Object.keys(t.systems).filter((s) => !e.includes(s))
    ];
    for (const s of i)
      this.addSystem(t.systems[s], s);
  }
  /**
   * Create a bunch of runners based of a collection of ids
   * @param runnerIds - the runner ids to add
   */
  addRunners(...t) {
    t.forEach((e) => {
      this.runners[e] = new ce(e);
    });
  }
  /**
   * Add a new system to the renderer.
   * @param ClassRef - Class reference
   * @param name - Property name for system, if not specified
   *        will use a static `name` property on the class itself. This
   *        name will be assigned as s property on the Renderer so make
   *        sure it doesn't collide with properties on Renderer.
   * @returns Return instance of renderer
   */
  addSystem(t, e) {
    const i = new t(this);
    if (this[e])
      throw new Error(`Whoops! The name "${e}" is already in use`);
    this[e] = i, this._systemsHash[e] = i;
    for (const s in this.runners)
      this.runners[s].add(i);
    return this;
  }
  /**
   * A function that will run a runner and call the runners function but pass in different options
   * to each system based on there name.
   *
   * E.g. If you have two systems added called `systemA` and `systemB` you could call do the following:
   *
   * ```js
   * system.emitWithCustomOptions(init, {
   *     systemA: {...optionsForA},
   *     systemB: {...optionsForB},
   * });
   * ```
   *
   * `init` would be called on system A passing `optionsForA` and on system B passing `optionsForB`.
   * @param runner - the runner to target
   * @param options - key value options for each system
   */
  emitWithCustomOptions(t, e) {
    const i = Object.keys(this._systemsHash);
    t.items.forEach((s) => {
      const n = i.find((o) => this._systemsHash[o] === s);
      s[t.name](e[n]);
    });
  }
  /** destroy the all runners and systems. Its apps job to */
  destroy() {
    Object.values(this.runners).forEach((t) => {
      t.destroy();
    }), this._systemsHash = {};
  }
  // TODO implement!
  // removeSystem(ClassRef: ISystemConstructor, name: string): void
  // {
  // }
}
const mi = class gs {
  /** @param renderer - The renderer this System works for. */
  constructor(t) {
    this.renderer = t, this.count = 0, this.checkCount = 0, this.maxIdle = gs.defaultMaxIdle, this.checkCountMax = gs.defaultCheckCountMax, this.mode = gs.defaultMode;
  }
  /**
   * Checks to see when the last time a texture was used.
   * If the texture has not been used for a specified amount of time, it will be removed from the GPU.
   */
  postrender() {
    this.renderer.objectRenderer.renderingToScreen && (this.count++, this.mode !== ra.MANUAL && (this.checkCount++, this.checkCount > this.checkCountMax && (this.checkCount = 0, this.run())));
  }
  /**
   * Checks to see when the last time a texture was used.
   * If the texture has not been used for a specified amount of time, it will be removed from the GPU.
   */
  run() {
    const t = this.renderer.texture, e = t.managedTextures;
    let i = !1;
    for (let s = 0; s < e.length; s++) {
      const n = e[s];
      n.resource && this.count - n.touched > this.maxIdle && (t.destroyTexture(n, !0), e[s] = null, i = !0);
    }
    if (i) {
      let s = 0;
      for (let n = 0; n < e.length; n++)
        e[n] !== null && (e[s++] = e[n]);
      e.length = s;
    }
  }
  /**
   * Removes all the textures within the specified displayObject and its children from the GPU.
   * @param {PIXI.DisplayObject} displayObject - the displayObject to remove the textures from.
   */
  unload(t) {
    const e = this.renderer.texture, i = t._texture;
    i && !i.framebuffer && e.destroyTexture(i);
    for (let s = t.children.length - 1; s >= 0; s--)
      this.unload(t.children[s]);
  }
  destroy() {
    this.renderer = null;
  }
};
mi.defaultMode = ra.AUTO, /**
* Default maximum idle frames before a texture is destroyed by garbage collection.
* @static
* @default 3600
* @see PIXI.TextureGCSystem#maxIdle
*/
mi.defaultMaxIdle = 60 * 60, /**
* Default frames between two garbage collections.
* @static
* @default 600
* @see PIXI.TextureGCSystem#checkCountMax
*/
mi.defaultCheckCountMax = 60 * 10, /** @ignore */
mi.extension = {
  type: k.RendererSystem,
  name: "textureGC"
};
let cr = mi;
z.add(cr);
class Bn {
  constructor(t) {
    this.texture = t, this.width = -1, this.height = -1, this.dirtyId = -1, this.dirtyStyleId = -1, this.mipmap = !1, this.wrapMode = 33071, this.type = $.UNSIGNED_BYTE, this.internalFormat = F.RGBA, this.samplerType = 0;
  }
}
function jg(r) {
  let t;
  return "WebGL2RenderingContext" in globalThis && r instanceof globalThis.WebGL2RenderingContext ? t = {
    [r.RGB]: U.FLOAT,
    [r.RGBA]: U.FLOAT,
    [r.ALPHA]: U.FLOAT,
    [r.LUMINANCE]: U.FLOAT,
    [r.LUMINANCE_ALPHA]: U.FLOAT,
    [r.R8]: U.FLOAT,
    [r.R8_SNORM]: U.FLOAT,
    [r.RG8]: U.FLOAT,
    [r.RG8_SNORM]: U.FLOAT,
    [r.RGB8]: U.FLOAT,
    [r.RGB8_SNORM]: U.FLOAT,
    [r.RGB565]: U.FLOAT,
    [r.RGBA4]: U.FLOAT,
    [r.RGB5_A1]: U.FLOAT,
    [r.RGBA8]: U.FLOAT,
    [r.RGBA8_SNORM]: U.FLOAT,
    [r.RGB10_A2]: U.FLOAT,
    [r.RGB10_A2UI]: U.FLOAT,
    [r.SRGB8]: U.FLOAT,
    [r.SRGB8_ALPHA8]: U.FLOAT,
    [r.R16F]: U.FLOAT,
    [r.RG16F]: U.FLOAT,
    [r.RGB16F]: U.FLOAT,
    [r.RGBA16F]: U.FLOAT,
    [r.R32F]: U.FLOAT,
    [r.RG32F]: U.FLOAT,
    [r.RGB32F]: U.FLOAT,
    [r.RGBA32F]: U.FLOAT,
    [r.R11F_G11F_B10F]: U.FLOAT,
    [r.RGB9_E5]: U.FLOAT,
    [r.R8I]: U.INT,
    [r.R8UI]: U.UINT,
    [r.R16I]: U.INT,
    [r.R16UI]: U.UINT,
    [r.R32I]: U.INT,
    [r.R32UI]: U.UINT,
    [r.RG8I]: U.INT,
    [r.RG8UI]: U.UINT,
    [r.RG16I]: U.INT,
    [r.RG16UI]: U.UINT,
    [r.RG32I]: U.INT,
    [r.RG32UI]: U.UINT,
    [r.RGB8I]: U.INT,
    [r.RGB8UI]: U.UINT,
    [r.RGB16I]: U.INT,
    [r.RGB16UI]: U.UINT,
    [r.RGB32I]: U.INT,
    [r.RGB32UI]: U.UINT,
    [r.RGBA8I]: U.INT,
    [r.RGBA8UI]: U.UINT,
    [r.RGBA16I]: U.INT,
    [r.RGBA16UI]: U.UINT,
    [r.RGBA32I]: U.INT,
    [r.RGBA32UI]: U.UINT,
    [r.DEPTH_COMPONENT16]: U.FLOAT,
    [r.DEPTH_COMPONENT24]: U.FLOAT,
    [r.DEPTH_COMPONENT32F]: U.FLOAT,
    [r.DEPTH_STENCIL]: U.FLOAT,
    [r.DEPTH24_STENCIL8]: U.FLOAT,
    [r.DEPTH32F_STENCIL8]: U.FLOAT
  } : t = {
    [r.RGB]: U.FLOAT,
    [r.RGBA]: U.FLOAT,
    [r.ALPHA]: U.FLOAT,
    [r.LUMINANCE]: U.FLOAT,
    [r.LUMINANCE_ALPHA]: U.FLOAT,
    [r.DEPTH_STENCIL]: U.FLOAT
  }, t;
}
function $g(r) {
  let t;
  return "WebGL2RenderingContext" in globalThis && r instanceof globalThis.WebGL2RenderingContext ? t = {
    [$.UNSIGNED_BYTE]: {
      [F.RGBA]: r.RGBA8,
      [F.RGB]: r.RGB8,
      [F.RG]: r.RG8,
      [F.RED]: r.R8,
      [F.RGBA_INTEGER]: r.RGBA8UI,
      [F.RGB_INTEGER]: r.RGB8UI,
      [F.RG_INTEGER]: r.RG8UI,
      [F.RED_INTEGER]: r.R8UI,
      [F.ALPHA]: r.ALPHA,
      [F.LUMINANCE]: r.LUMINANCE,
      [F.LUMINANCE_ALPHA]: r.LUMINANCE_ALPHA
    },
    [$.BYTE]: {
      [F.RGBA]: r.RGBA8_SNORM,
      [F.RGB]: r.RGB8_SNORM,
      [F.RG]: r.RG8_SNORM,
      [F.RED]: r.R8_SNORM,
      [F.RGBA_INTEGER]: r.RGBA8I,
      [F.RGB_INTEGER]: r.RGB8I,
      [F.RG_INTEGER]: r.RG8I,
      [F.RED_INTEGER]: r.R8I
    },
    [$.UNSIGNED_SHORT]: {
      [F.RGBA_INTEGER]: r.RGBA16UI,
      [F.RGB_INTEGER]: r.RGB16UI,
      [F.RG_INTEGER]: r.RG16UI,
      [F.RED_INTEGER]: r.R16UI,
      [F.DEPTH_COMPONENT]: r.DEPTH_COMPONENT16
    },
    [$.SHORT]: {
      [F.RGBA_INTEGER]: r.RGBA16I,
      [F.RGB_INTEGER]: r.RGB16I,
      [F.RG_INTEGER]: r.RG16I,
      [F.RED_INTEGER]: r.R16I
    },
    [$.UNSIGNED_INT]: {
      [F.RGBA_INTEGER]: r.RGBA32UI,
      [F.RGB_INTEGER]: r.RGB32UI,
      [F.RG_INTEGER]: r.RG32UI,
      [F.RED_INTEGER]: r.R32UI,
      [F.DEPTH_COMPONENT]: r.DEPTH_COMPONENT24
    },
    [$.INT]: {
      [F.RGBA_INTEGER]: r.RGBA32I,
      [F.RGB_INTEGER]: r.RGB32I,
      [F.RG_INTEGER]: r.RG32I,
      [F.RED_INTEGER]: r.R32I
    },
    [$.FLOAT]: {
      [F.RGBA]: r.RGBA32F,
      [F.RGB]: r.RGB32F,
      [F.RG]: r.RG32F,
      [F.RED]: r.R32F,
      [F.DEPTH_COMPONENT]: r.DEPTH_COMPONENT32F
    },
    [$.HALF_FLOAT]: {
      [F.RGBA]: r.RGBA16F,
      [F.RGB]: r.RGB16F,
      [F.RG]: r.RG16F,
      [F.RED]: r.R16F
    },
    [$.UNSIGNED_SHORT_5_6_5]: {
      [F.RGB]: r.RGB565
    },
    [$.UNSIGNED_SHORT_4_4_4_4]: {
      [F.RGBA]: r.RGBA4
    },
    [$.UNSIGNED_SHORT_5_5_5_1]: {
      [F.RGBA]: r.RGB5_A1
    },
    [$.UNSIGNED_INT_2_10_10_10_REV]: {
      [F.RGBA]: r.RGB10_A2,
      [F.RGBA_INTEGER]: r.RGB10_A2UI
    },
    [$.UNSIGNED_INT_10F_11F_11F_REV]: {
      [F.RGB]: r.R11F_G11F_B10F
    },
    [$.UNSIGNED_INT_5_9_9_9_REV]: {
      [F.RGB]: r.RGB9_E5
    },
    [$.UNSIGNED_INT_24_8]: {
      [F.DEPTH_STENCIL]: r.DEPTH24_STENCIL8
    },
    [$.FLOAT_32_UNSIGNED_INT_24_8_REV]: {
      [F.DEPTH_STENCIL]: r.DEPTH32F_STENCIL8
    }
  } : t = {
    [$.UNSIGNED_BYTE]: {
      [F.RGBA]: r.RGBA,
      [F.RGB]: r.RGB,
      [F.ALPHA]: r.ALPHA,
      [F.LUMINANCE]: r.LUMINANCE,
      [F.LUMINANCE_ALPHA]: r.LUMINANCE_ALPHA
    },
    [$.UNSIGNED_SHORT_5_6_5]: {
      [F.RGB]: r.RGB
    },
    [$.UNSIGNED_SHORT_4_4_4_4]: {
      [F.RGBA]: r.RGBA
    },
    [$.UNSIGNED_SHORT_5_5_5_1]: {
      [F.RGBA]: r.RGBA
    }
  }, t;
}
class Vc {
  /**
   * @param renderer - The renderer this system works for.
   */
  constructor(t) {
    this.renderer = t, this.boundTextures = [], this.currentLocation = -1, this.managedTextures = [], this._unknownBoundTextures = !1, this.unknownTexture = new J(), this.hasIntegerTextures = !1;
  }
  /** Sets up the renderer context and necessary buffers. */
  contextChange() {
    const t = this.gl = this.renderer.gl;
    this.CONTEXT_UID = this.renderer.CONTEXT_UID, this.webGLVersion = this.renderer.context.webGLVersion, this.internalFormats = $g(t), this.samplerTypes = jg(t);
    const e = t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS);
    this.boundTextures.length = e;
    for (let s = 0; s < e; s++)
      this.boundTextures[s] = null;
    this.emptyTextures = {};
    const i = new Bn(t.createTexture());
    t.bindTexture(t.TEXTURE_2D, i.texture), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, 1, 1, 0, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(4)), this.emptyTextures[t.TEXTURE_2D] = i, this.emptyTextures[t.TEXTURE_CUBE_MAP] = new Bn(t.createTexture()), t.bindTexture(t.TEXTURE_CUBE_MAP, this.emptyTextures[t.TEXTURE_CUBE_MAP].texture);
    for (let s = 0; s < 6; s++)
      t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + s, 0, t.RGBA, 1, 1, 0, t.RGBA, t.UNSIGNED_BYTE, null);
    t.texParameteri(t.TEXTURE_CUBE_MAP, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_CUBE_MAP, t.TEXTURE_MIN_FILTER, t.LINEAR);
    for (let s = 0; s < this.boundTextures.length; s++)
      this.bind(null, s);
  }
  /**
   * Bind a texture to a specific location
   *
   * If you want to unbind something, please use `unbind(texture)` instead of `bind(null, textureLocation)`
   * @param texture - Texture to bind
   * @param [location=0] - Location to bind at
   */
  bind(t, e = 0) {
    const { gl: i } = this;
    if (t = t == null ? void 0 : t.castToBaseTexture(), (t == null ? void 0 : t.valid) && !t.parentTextureArray) {
      t.touched = this.renderer.textureGC.count;
      const s = t._glTextures[this.CONTEXT_UID] || this.initTexture(t);
      this.boundTextures[e] !== t && (this.currentLocation !== e && (this.currentLocation = e, i.activeTexture(i.TEXTURE0 + e)), i.bindTexture(t.target, s.texture)), s.dirtyId !== t.dirtyId ? (this.currentLocation !== e && (this.currentLocation = e, i.activeTexture(i.TEXTURE0 + e)), this.updateTexture(t)) : s.dirtyStyleId !== t.dirtyStyleId && this.updateTextureStyle(t), this.boundTextures[e] = t;
    } else
      this.currentLocation !== e && (this.currentLocation = e, i.activeTexture(i.TEXTURE0 + e)), i.bindTexture(i.TEXTURE_2D, this.emptyTextures[i.TEXTURE_2D].texture), this.boundTextures[e] = null;
  }
  /** Resets texture location and bound textures Actual `bind(null, i)` calls will be performed at next `unbind()` call */
  reset() {
    this._unknownBoundTextures = !0, this.hasIntegerTextures = !1, this.currentLocation = -1;
    for (let t = 0; t < this.boundTextures.length; t++)
      this.boundTextures[t] = this.unknownTexture;
  }
  /**
   * Unbind a texture.
   * @param texture - Texture to bind
   */
  unbind(t) {
    const { gl: e, boundTextures: i } = this;
    if (this._unknownBoundTextures) {
      this._unknownBoundTextures = !1;
      for (let s = 0; s < i.length; s++)
        i[s] === this.unknownTexture && this.bind(null, s);
    }
    for (let s = 0; s < i.length; s++)
      i[s] === t && (this.currentLocation !== s && (e.activeTexture(e.TEXTURE0 + s), this.currentLocation = s), e.bindTexture(t.target, this.emptyTextures[t.target].texture), i[s] = null);
  }
  /**
   * Ensures that current boundTextures all have FLOAT sampler type,
   * see {@link PIXI.SAMPLER_TYPES} for explanation.
   * @param maxTextures - number of locations to check
   */
  ensureSamplerType(t) {
    const { boundTextures: e, hasIntegerTextures: i, CONTEXT_UID: s } = this;
    if (i)
      for (let n = t - 1; n >= 0; --n) {
        const o = e[n];
        o && o._glTextures[s].samplerType !== U.FLOAT && this.renderer.texture.unbind(o);
      }
  }
  /**
   * Initialize a texture
   * @private
   * @param texture - Texture to initialize
   */
  initTexture(t) {
    const e = new Bn(this.gl.createTexture());
    return e.dirtyId = -1, t._glTextures[this.CONTEXT_UID] = e, this.managedTextures.push(t), t.on("dispose", this.destroyTexture, this), e;
  }
  initTextureType(t, e) {
    var i;
    e.internalFormat = ((i = this.internalFormats[t.type]) == null ? void 0 : i[t.format]) ?? t.format, e.samplerType = this.samplerTypes[e.internalFormat] ?? U.FLOAT, this.webGLVersion === 2 && t.type === $.HALF_FLOAT ? e.type = this.gl.HALF_FLOAT : e.type = t.type;
  }
  /**
   * Update a texture
   * @private
   * @param {PIXI.BaseTexture} texture - Texture to initialize
   */
  updateTexture(t) {
    var s;
    const e = t._glTextures[this.CONTEXT_UID];
    if (!e)
      return;
    const i = this.renderer;
    if (this.initTextureType(t, e), (s = t.resource) == null ? void 0 : s.upload(i, t, e))
      e.samplerType !== U.FLOAT && (this.hasIntegerTextures = !0);
    else {
      const n = t.realWidth, o = t.realHeight, a = i.gl;
      (e.width !== n || e.height !== o || e.dirtyId < 0) && (e.width = n, e.height = o, a.texImage2D(
        t.target,
        0,
        e.internalFormat,
        n,
        o,
        0,
        t.format,
        e.type,
        null
      ));
    }
    t.dirtyStyleId !== e.dirtyStyleId && this.updateTextureStyle(t), e.dirtyId = t.dirtyId;
  }
  /**
   * Deletes the texture from WebGL
   * @private
   * @param texture - the texture to destroy
   * @param [skipRemove=false] - Whether to skip removing the texture from the TextureManager.
   */
  destroyTexture(t, e) {
    const { gl: i } = this;
    if (t = t.castToBaseTexture(), t._glTextures[this.CONTEXT_UID] && (this.unbind(t), i.deleteTexture(t._glTextures[this.CONTEXT_UID].texture), t.off("dispose", this.destroyTexture, this), delete t._glTextures[this.CONTEXT_UID], !e)) {
      const s = this.managedTextures.indexOf(t);
      s !== -1 && Yr(this.managedTextures, s, 1);
    }
  }
  /**
   * Update texture style such as mipmap flag
   * @private
   * @param {PIXI.BaseTexture} texture - Texture to update
   */
  updateTextureStyle(t) {
    var i;
    const e = t._glTextures[this.CONTEXT_UID];
    e && ((t.mipmap === we.POW2 || this.webGLVersion !== 2) && !t.isPowerOfTwo ? e.mipmap = !1 : e.mipmap = t.mipmap >= 1, this.webGLVersion !== 2 && !t.isPowerOfTwo ? e.wrapMode = Ye.CLAMP : e.wrapMode = t.wrapMode, (i = t.resource) != null && i.style(this.renderer, t, e) || this.setStyle(t, e), e.dirtyStyleId = t.dirtyStyleId);
  }
  /**
   * Set style for texture
   * @private
   * @param texture - Texture to update
   * @param glTexture
   */
  setStyle(t, e) {
    const i = this.gl;
    if (e.mipmap && t.mipmap !== we.ON_MANUAL && i.generateMipmap(t.target), i.texParameteri(t.target, i.TEXTURE_WRAP_S, e.wrapMode), i.texParameteri(t.target, i.TEXTURE_WRAP_T, e.wrapMode), e.mipmap) {
      i.texParameteri(t.target, i.TEXTURE_MIN_FILTER, t.scaleMode === Pe.LINEAR ? i.LINEAR_MIPMAP_LINEAR : i.NEAREST_MIPMAP_NEAREST);
      const s = this.renderer.context.extensions.anisotropicFiltering;
      if (s && t.anisotropicLevel > 0 && t.scaleMode === Pe.LINEAR) {
        const n = Math.min(t.anisotropicLevel, i.getParameter(s.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
        i.texParameterf(t.target, s.TEXTURE_MAX_ANISOTROPY_EXT, n);
      }
    } else
      i.texParameteri(t.target, i.TEXTURE_MIN_FILTER, t.scaleMode === Pe.LINEAR ? i.LINEAR : i.NEAREST);
    i.texParameteri(t.target, i.TEXTURE_MAG_FILTER, t.scaleMode === Pe.LINEAR ? i.LINEAR : i.NEAREST);
  }
  destroy() {
    this.renderer = null;
  }
}
Vc.extension = {
  type: k.RendererSystem,
  name: "texture"
};
z.add(Vc);
class Xc {
  /**
   * @param renderer - The renderer this System works for.
   */
  constructor(t) {
    this.renderer = t;
  }
  /** Sets up the renderer context and necessary buffers. */
  contextChange() {
    this.gl = this.renderer.gl, this.CONTEXT_UID = this.renderer.CONTEXT_UID;
  }
  /**
   * Bind TransformFeedback and buffers
   * @param transformFeedback - TransformFeedback to bind
   */
  bind(t) {
    const { gl: e, CONTEXT_UID: i } = this, s = t._glTransformFeedbacks[i] || this.createGLTransformFeedback(t);
    e.bindTransformFeedback(e.TRANSFORM_FEEDBACK, s);
  }
  /** Unbind TransformFeedback */
  unbind() {
    const { gl: t } = this;
    t.bindTransformFeedback(t.TRANSFORM_FEEDBACK, null);
  }
  /**
   * Begin TransformFeedback
   * @param drawMode - DrawMode for TransformFeedback
   * @param shader - A Shader used by TransformFeedback. Current bound shader will be used if not provided.
   */
  beginTransformFeedback(t, e) {
    const { gl: i, renderer: s } = this;
    e && s.shader.bind(e), i.beginTransformFeedback(t);
  }
  /** End TransformFeedback */
  endTransformFeedback() {
    const { gl: t } = this;
    t.endTransformFeedback();
  }
  /**
   * Create TransformFeedback and bind buffers
   * @param tf - TransformFeedback
   * @returns WebGLTransformFeedback
   */
  createGLTransformFeedback(t) {
    const { gl: e, renderer: i, CONTEXT_UID: s } = this, n = e.createTransformFeedback();
    t._glTransformFeedbacks[s] = n, e.bindTransformFeedback(e.TRANSFORM_FEEDBACK, n);
    for (let o = 0; o < t.buffers.length; o++) {
      const a = t.buffers[o];
      a && (i.buffer.update(a), a._glBuffers[s].refCount++, e.bindBufferBase(e.TRANSFORM_FEEDBACK_BUFFER, o, a._glBuffers[s].buffer || null));
    }
    return e.bindTransformFeedback(e.TRANSFORM_FEEDBACK, null), t.disposeRunner.add(this), n;
  }
  /**
   * Disposes TransfromFeedback
   * @param {PIXI.TransformFeedback} tf - TransformFeedback
   * @param {boolean} [contextLost=false] - If context was lost, we suppress delete TransformFeedback
   */
  disposeTransformFeedback(t, e) {
    const i = t._glTransformFeedbacks[this.CONTEXT_UID], s = this.gl;
    t.disposeRunner.remove(this);
    const n = this.renderer.buffer;
    if (n)
      for (let o = 0; o < t.buffers.length; o++) {
        const a = t.buffers[o];
        if (!a)
          continue;
        const h = a._glBuffers[this.CONTEXT_UID];
        h && (h.refCount--, h.refCount === 0 && !e && n.dispose(a, e));
      }
    i && (e || s.deleteTransformFeedback(i), delete t._glTransformFeedbacks[this.CONTEXT_UID]);
  }
  destroy() {
    this.renderer = null;
  }
}
Xc.extension = {
  type: k.RendererSystem,
  name: "transformFeedback"
};
z.add(Xc);
class Os {
  constructor(t) {
    this.renderer = t;
  }
  /**
   * initiates the view system
   * @param {PIXI.ViewOptions} options - the options for the view
   */
  init(t) {
    this.screen = new tt(0, 0, t.width, t.height), this.element = t.view || H.ADAPTER.createCanvas(), this.resolution = t.resolution || H.RESOLUTION, this.autoDensity = !!t.autoDensity;
  }
  /**
   * Resizes the screen and canvas to the specified dimensions.
   * @param desiredScreenWidth - The new width of the screen.
   * @param desiredScreenHeight - The new height of the screen.
   */
  resizeView(t, e) {
    this.element.width = Math.round(t * this.resolution), this.element.height = Math.round(e * this.resolution);
    const i = this.element.width / this.resolution, s = this.element.height / this.resolution;
    this.screen.width = i, this.screen.height = s, this.autoDensity && (this.element.style.width = `${i}px`, this.element.style.height = `${s}px`), this.renderer.emit("resize", i, s), this.renderer.runners.resize.emit(this.screen.width, this.screen.height);
  }
  /**
   * Destroys this System and optionally removes the canvas from the dom.
   * @param {boolean} [removeView=false] - Whether to remove the canvas from the DOM.
   */
  destroy(t) {
    var e;
    t && ((e = this.element.parentNode) == null || e.removeChild(this.element)), this.renderer = null, this.element = null, this.screen = null;
  }
}
Os.defaultOptions = {
  /**
   * {@link PIXI.IRendererOptions.width}
   * @default 800
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  width: 800,
  /**
   * {@link PIXI.IRendererOptions.height}
   * @default 600
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  height: 600,
  /**
   * {@link PIXI.IRendererOptions.resolution}
   * @type {number}
   * @default PIXI.settings.RESOLUTION
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  resolution: void 0,
  /**
   * {@link PIXI.IRendererOptions.autoDensity}
   * @default false
   * @memberof PIXI.settings.RENDER_OPTIONS
   */
  autoDensity: !1
}, /** @ignore */
Os.extension = {
  type: [
    k.RendererSystem,
    k.CanvasRendererSystem
  ],
  name: "_view"
};
z.add(Os);
H.PREFER_ENV = wr.WEBGL2;
H.STRICT_TEXTURE_CACHE = !1;
H.RENDER_OPTIONS = {
  ...Ds.defaultOptions,
  ...Bs.defaultOptions,
  ...Os.defaultOptions,
  ...Fs.defaultOptions
};
Object.defineProperties(H, {
  /**
   * @static
   * @name WRAP_MODE
   * @memberof PIXI.settings
   * @type {PIXI.WRAP_MODES}
   * @deprecated since 7.1.0
   * @see PIXI.BaseTexture.defaultOptions.wrapMode
   */
  WRAP_MODE: {
    get() {
      return J.defaultOptions.wrapMode;
    },
    set(r) {
      it("7.1.0", "settings.WRAP_MODE is deprecated, use BaseTexture.defaultOptions.wrapMode"), J.defaultOptions.wrapMode = r;
    }
  },
  /**
   * @static
   * @name SCALE_MODE
   * @memberof PIXI.settings
   * @type {PIXI.SCALE_MODES}
   * @deprecated since 7.1.0
   * @see PIXI.BaseTexture.defaultOptions.scaleMode
   */
  SCALE_MODE: {
    get() {
      return J.defaultOptions.scaleMode;
    },
    set(r) {
      it("7.1.0", "settings.SCALE_MODE is deprecated, use BaseTexture.defaultOptions.scaleMode"), J.defaultOptions.scaleMode = r;
    }
  },
  /**
   * @static
   * @name MIPMAP_TEXTURES
   * @memberof PIXI.settings
   * @type {PIXI.MIPMAP_MODES}
   * @deprecated since 7.1.0
   * @see PIXI.BaseTexture.defaultOptions.mipmap
   */
  MIPMAP_TEXTURES: {
    get() {
      return J.defaultOptions.mipmap;
    },
    set(r) {
      it("7.1.0", "settings.MIPMAP_TEXTURES is deprecated, use BaseTexture.defaultOptions.mipmap"), J.defaultOptions.mipmap = r;
    }
    // MIPMAP_MODES.POW2,
  },
  /**
   * @static
   * @name ANISOTROPIC_LEVEL
   * @memberof PIXI.settings
   * @type {number}
   * @deprecated since 7.1.0
   * @see PIXI.BaseTexture.defaultOptions.anisotropicLevel
   */
  ANISOTROPIC_LEVEL: {
    get() {
      return J.defaultOptions.anisotropicLevel;
    },
    set(r) {
      it(
        "7.1.0",
        "settings.ANISOTROPIC_LEVEL is deprecated, use BaseTexture.defaultOptions.anisotropicLevel"
      ), J.defaultOptions.anisotropicLevel = r;
    }
  },
  /**
   * Default filter resolution.
   * @static
   * @name FILTER_RESOLUTION
   * @memberof PIXI.settings
   * @deprecated since 7.1.0
   * @type {number|null}
   * @see PIXI.Filter.defaultResolution
   */
  FILTER_RESOLUTION: {
    get() {
      return it("7.1.0", "settings.FILTER_RESOLUTION is deprecated, use Filter.defaultResolution"), Gt.defaultResolution;
    },
    set(r) {
      Gt.defaultResolution = r;
    }
  },
  /**
   * Default filter samples.
   * @static
   * @name FILTER_MULTISAMPLE
   * @memberof PIXI.settings
   * @deprecated since 7.1.0
   * @type {PIXI.MSAA_QUALITY}
   * @see PIXI.Filter.defaultMultisample
   */
  FILTER_MULTISAMPLE: {
    get() {
      return it("7.1.0", "settings.FILTER_MULTISAMPLE is deprecated, use Filter.defaultMultisample"), Gt.defaultMultisample;
    },
    set(r) {
      Gt.defaultMultisample = r;
    }
  },
  /**
   * The maximum textures that this device supports.
   * @static
   * @name SPRITE_MAX_TEXTURES
   * @memberof PIXI.settings
   * @deprecated since 7.1.0
   * @see PIXI.BatchRenderer.defaultMaxTextures
   * @type {number}
   */
  SPRITE_MAX_TEXTURES: {
    get() {
      return lr.defaultMaxTextures;
    },
    set(r) {
      it("7.1.0", "settings.SPRITE_MAX_TEXTURES is deprecated, use BatchRenderer.defaultMaxTextures"), lr.defaultMaxTextures = r;
    }
  },
  /**
   * The default sprite batch size.
   *
   * The default aims to balance desktop and mobile devices.
   * @static
   * @name SPRITE_BATCH_SIZE
   * @memberof PIXI.settings
   * @see PIXI.BatchRenderer.defaultBatchSize
   * @deprecated since 7.1.0
   * @type {number}
   */
  SPRITE_BATCH_SIZE: {
    get() {
      return lr.defaultBatchSize;
    },
    set(r) {
      it("7.1.0", "settings.SPRITE_BATCH_SIZE is deprecated, use BatchRenderer.defaultBatchSize"), lr.defaultBatchSize = r;
    }
  },
  /**
   * Can we upload the same buffer in a single frame?
   * @static
   * @name CAN_UPLOAD_SAME_BUFFER
   * @memberof PIXI.settings
   * @see PIXI.BatchRenderer.canUploadSameBuffer
   * @deprecated since 7.1.0
   * @type {boolean}
   */
  CAN_UPLOAD_SAME_BUFFER: {
    get() {
      return lr.canUploadSameBuffer;
    },
    set(r) {
      it("7.1.0", "settings.CAN_UPLOAD_SAME_BUFFER is deprecated, use BatchRenderer.canUploadSameBuffer"), lr.canUploadSameBuffer = r;
    }
  },
  /**
   * Default Garbage Collection mode.
   * @static
   * @name GC_MODE
   * @memberof PIXI.settings
   * @type {PIXI.GC_MODES}
   * @deprecated since 7.1.0
   * @see PIXI.TextureGCSystem.defaultMode
   */
  GC_MODE: {
    get() {
      return cr.defaultMode;
    },
    set(r) {
      it("7.1.0", "settings.GC_MODE is deprecated, use TextureGCSystem.defaultMode"), cr.defaultMode = r;
    }
  },
  /**
   * Default Garbage Collection max idle.
   * @static
   * @name GC_MAX_IDLE
   * @memberof PIXI.settings
   * @type {number}
   * @deprecated since 7.1.0
   * @see PIXI.TextureGCSystem.defaultMaxIdle
   */
  GC_MAX_IDLE: {
    get() {
      return cr.defaultMaxIdle;
    },
    set(r) {
      it("7.1.0", "settings.GC_MAX_IDLE is deprecated, use TextureGCSystem.defaultMaxIdle"), cr.defaultMaxIdle = r;
    }
  },
  /**
   * Default Garbage Collection maximum check count.
   * @static
   * @name GC_MAX_CHECK_COUNT
   * @memberof PIXI.settings
   * @type {number}
   * @deprecated since 7.1.0
   * @see PIXI.TextureGCSystem.defaultCheckCountMax
   */
  GC_MAX_CHECK_COUNT: {
    get() {
      return cr.defaultCheckCountMax;
    },
    set(r) {
      it("7.1.0", "settings.GC_MAX_CHECK_COUNT is deprecated, use TextureGCSystem.defaultCheckCountMax"), cr.defaultCheckCountMax = r;
    }
  },
  /**
   * Default specify float precision in vertex shader.
   * @static
   * @name PRECISION_VERTEX
   * @memberof PIXI.settings
   * @type {PIXI.PRECISION}
   * @deprecated since 7.1.0
   * @see PIXI.Program.defaultVertexPrecision
   */
  PRECISION_VERTEX: {
    get() {
      return De.defaultVertexPrecision;
    },
    set(r) {
      it("7.1.0", "settings.PRECISION_VERTEX is deprecated, use Program.defaultVertexPrecision"), De.defaultVertexPrecision = r;
    }
  },
  /**
   * Default specify float precision in fragment shader.
   * @static
   * @name PRECISION_FRAGMENT
   * @memberof PIXI.settings
   * @type {PIXI.PRECISION}
   * @deprecated since 7.1.0
   * @see PIXI.Program.defaultFragmentPrecision
   */
  PRECISION_FRAGMENT: {
    get() {
      return De.defaultFragmentPrecision;
    },
    set(r) {
      it("7.1.0", "settings.PRECISION_FRAGMENT is deprecated, use Program.defaultFragmentPrecision"), De.defaultFragmentPrecision = r;
    }
  }
});
var Tr = /* @__PURE__ */ ((r) => (r[r.INTERACTION = 50] = "INTERACTION", r[r.HIGH = 25] = "HIGH", r[r.NORMAL = 0] = "NORMAL", r[r.LOW = -25] = "LOW", r[r.UTILITY = -50] = "UTILITY", r))(Tr || {});
class Dn {
  /**
   * Constructor
   * @private
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param priority - The priority for emitting
   * @param once - If the handler should fire once
   */
  constructor(t, e = null, i = 0, s = !1) {
    this.next = null, this.previous = null, this._destroyed = !1, this.fn = t, this.context = e, this.priority = i, this.once = s;
  }
  /**
   * Simple compare function to figure out if a function and context match.
   * @private
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @returns `true` if the listener match the arguments
   */
  match(t, e = null) {
    return this.fn === t && this.context === e;
  }
  /**
   * Emit by calling the current function.
   * @private
   * @param deltaTime - time since the last emit.
   * @returns Next ticker
   */
  emit(t) {
    this.fn && (this.context ? this.fn.call(this.context, t) : this.fn(t));
    const e = this.next;
    return this.once && this.destroy(!0), this._destroyed && (this.next = null), e;
  }
  /**
   * Connect to the list.
   * @private
   * @param previous - Input node, previous listener
   */
  connect(t) {
    this.previous = t, t.next && (t.next.previous = this), this.next = t.next, t.next = this;
  }
  /**
   * Destroy and don't use after this.
   * @private
   * @param hard - `true` to remove the `next` reference, this
   *        is considered a hard destroy. Soft destroy maintains the next reference.
   * @returns The listener to redirect while emitting or removing.
   */
  destroy(t = !1) {
    this._destroyed = !0, this.fn = null, this.context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
    const e = this.next;
    return this.next = t ? null : e, this.previous = null, e;
  }
}
const zc = class Wt {
  constructor() {
    this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new Dn(null, null, 1 / 0), this.deltaMS = 1 / Wt.targetFPMS, this.elapsedMS = 1 / Wt.targetFPMS, this._tick = (t) => {
      this._requestId = null, this.started && (this.update(t), this.started && this._requestId === null && this._head.next && (this._requestId = requestAnimationFrame(this._tick)));
    };
  }
  /**
   * Conditionally requests a new animation frame.
   * If a frame has not already been requested, and if the internal
   * emitter has listeners, a new frame is requested.
   * @private
   */
  _requestIfNeeded() {
    this._requestId === null && this._head.next && (this.lastTime = performance.now(), this._lastFrame = this.lastTime, this._requestId = requestAnimationFrame(this._tick));
  }
  /**
   * Conditionally cancels a pending animation frame.
   * @private
   */
  _cancelIfNeeded() {
    this._requestId !== null && (cancelAnimationFrame(this._requestId), this._requestId = null);
  }
  /**
   * Conditionally requests a new animation frame.
   * If the ticker has been started it checks if a frame has not already
   * been requested, and if the internal emitter has listeners. If these
   * conditions are met, a new frame is requested. If the ticker has not
   * been started, but autoStart is `true`, then the ticker starts now,
   * and continues with the previous conditions to request a new frame.
   * @private
   */
  _startIfPossible() {
    this.started ? this._requestIfNeeded() : this.autoStart && this.start();
  }
  /**
   * Register a handler for tick events. Calls continuously unless
   * it is removed or the ticker is stopped.
   * @param fn - The listener function to be added for updates
   * @param context - The listener context
   * @param {number} [priority=PIXI.UPDATE_PRIORITY.NORMAL] - The priority for emitting
   * @returns This instance of a ticker
   */
  add(t, e, i = Tr.NORMAL) {
    return this._addListener(new Dn(t, e, i));
  }
  /**
   * Add a handler for the tick event which is only execute once.
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param {number} [priority=PIXI.UPDATE_PRIORITY.NORMAL] - The priority for emitting
   * @returns This instance of a ticker
   */
  addOnce(t, e, i = Tr.NORMAL) {
    return this._addListener(new Dn(t, e, i, !0));
  }
  /**
   * Internally adds the event handler so that it can be sorted by priority.
   * Priority allows certain handler (user, AnimatedSprite, Interaction) to be run
   * before the rendering.
   * @private
   * @param listener - Current listener being added.
   * @returns This instance of a ticker
   */
  _addListener(t) {
    let e = this._head.next, i = this._head;
    if (!e)
      t.connect(i);
    else {
      for (; e; ) {
        if (t.priority > e.priority) {
          t.connect(i);
          break;
        }
        i = e, e = e.next;
      }
      t.previous || t.connect(i);
    }
    return this._startIfPossible(), this;
  }
  /**
   * Removes any handlers matching the function and context parameters.
   * If no handlers are left after removing, then it cancels the animation frame.
   * @param fn - The listener function to be removed
   * @param context - The listener context to be removed
   * @returns This instance of a ticker
   */
  remove(t, e) {
    let i = this._head.next;
    for (; i; )
      i.match(t, e) ? i = i.destroy() : i = i.next;
    return this._head.next || this._cancelIfNeeded(), this;
  }
  /**
   * The number of listeners on this ticker, calculated by walking through linked list
   * @readonly
   * @member {number}
   */
  get count() {
    if (!this._head)
      return 0;
    let t = 0, e = this._head;
    for (; e = e.next; )
      t++;
    return t;
  }
  /** Starts the ticker. If the ticker has listeners a new animation frame is requested at this point. */
  start() {
    this.started || (this.started = !0, this._requestIfNeeded());
  }
  /** Stops the ticker. If the ticker has requested an animation frame it is canceled at this point. */
  stop() {
    this.started && (this.started = !1, this._cancelIfNeeded());
  }
  /** Destroy the ticker and don't use after this. Calling this method removes all references to internal events. */
  destroy() {
    if (!this._protected) {
      this.stop();
      let t = this._head.next;
      for (; t; )
        t = t.destroy(!0);
      this._head.destroy(), this._head = null;
    }
  }
  /**
   * Triggers an update. An update entails setting the
   * current {@link PIXI.Ticker#elapsedMS},
   * the current {@link PIXI.Ticker#deltaTime},
   * invoking all listeners with current deltaTime,
   * and then finally setting {@link PIXI.Ticker#lastTime}
   * with the value of currentTime that was provided.
   * This method will be called automatically by animation
   * frame callbacks if the ticker instance has been started
   * and listeners are added.
   * @param {number} [currentTime=performance.now()] - the current time of execution
   */
  update(t = performance.now()) {
    let e;
    if (t > this.lastTime) {
      if (e = this.elapsedMS = t - this.lastTime, e > this._maxElapsedMS && (e = this._maxElapsedMS), e *= this.speed, this._minElapsedMS) {
        const n = t - this._lastFrame | 0;
        if (n < this._minElapsedMS)
          return;
        this._lastFrame = t - n % this._minElapsedMS;
      }
      this.deltaMS = e, this.deltaTime = this.deltaMS * Wt.targetFPMS;
      const i = this._head;
      let s = i.next;
      for (; s; )
        s = s.emit(this.deltaTime);
      i.next || this._cancelIfNeeded();
    } else
      this.deltaTime = this.deltaMS = this.elapsedMS = 0;
    this.lastTime = t;
  }
  /**
   * The frames per second at which this ticker is running.
   * The default is approximately 60 in most modern browsers.
   * **Note:** This does not factor in the value of
   * {@link PIXI.Ticker#speed}, which is specific
   * to scaling {@link PIXI.Ticker#deltaTime}.
   * @member {number}
   * @readonly
   */
  get FPS() {
    return 1e3 / this.elapsedMS;
  }
  /**
   * Manages the maximum amount of milliseconds allowed to
   * elapse between invoking {@link PIXI.Ticker#update}.
   * This value is used to cap {@link PIXI.Ticker#deltaTime},
   * but does not effect the measured value of {@link PIXI.Ticker#FPS}.
   * When setting this property it is clamped to a value between
   * `0` and `Ticker.targetFPMS * 1000`.
   * @member {number}
   * @default 10
   */
  get minFPS() {
    return 1e3 / this._maxElapsedMS;
  }
  set minFPS(t) {
    const e = Math.min(this.maxFPS, t), i = Math.min(Math.max(0, e) / 1e3, Wt.targetFPMS);
    this._maxElapsedMS = 1 / i;
  }
  /**
   * Manages the minimum amount of milliseconds required to
   * elapse between invoking {@link PIXI.Ticker#update}.
   * This will effect the measured value of {@link PIXI.Ticker#FPS}.
   * If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
   * Otherwise it will be at least `minFPS`
   * @member {number}
   * @default 0
   */
  get maxFPS() {
    return this._minElapsedMS ? Math.round(1e3 / this._minElapsedMS) : 0;
  }
  set maxFPS(t) {
    if (t === 0)
      this._minElapsedMS = 0;
    else {
      const e = Math.max(this.minFPS, t);
      this._minElapsedMS = 1 / (e / 1e3);
    }
  }
  /**
   * The shared ticker instance used by {@link PIXI.AnimatedSprite} and by
   * {@link PIXI.VideoResource} to update animation frames / video textures.
   *
   * It may also be used by {@link PIXI.Application} if created with the `sharedTicker` option property set to true.
   *
   * The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
   * Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.
   * @example
   * import { Ticker } from 'pixi.js';
   *
   * const ticker = Ticker.shared;
   * // Set this to prevent starting this ticker when listeners are added.
   * // By default this is true only for the PIXI.Ticker.shared instance.
   * ticker.autoStart = false;
   *
   * // FYI, call this to ensure the ticker is stopped. It should be stopped
   * // if you have not attempted to render anything yet.
   * ticker.stop();
   *
   * // Call this when you are ready for a running shared ticker.
   * ticker.start();
   * @example
   * import { autoDetectRenderer, Container } from 'pixi.js';
   *
   * // You may use the shared ticker to render...
   * const renderer = autoDetectRenderer();
   * const stage = new Container();
   * document.body.appendChild(renderer.view);
   * ticker.add((time) => renderer.render(stage));
   *
   * // Or you can just update it manually.
   * ticker.autoStart = false;
   * ticker.stop();
   * const animate = (time) => {
   *     ticker.update(time);
   *     renderer.render(stage);
   *     requestAnimationFrame(animate);
   * };
   * animate(performance.now());
   * @member {PIXI.Ticker}
   * @static
   */
  static get shared() {
    if (!Wt._shared) {
      const t = Wt._shared = new Wt();
      t.autoStart = !0, t._protected = !0;
    }
    return Wt._shared;
  }
  /**
   * The system ticker instance used by {@link PIXI.BasePrepare} for core timing
   * functionality that shouldn't usually need to be paused, unlike the `shared`
   * ticker which drives visual animations and rendering which may want to be paused.
   *
   * The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
   * @member {PIXI.Ticker}
   * @static
   */
  static get system() {
    if (!Wt._system) {
      const t = Wt._system = new Wt();
      t.autoStart = !0, t._protected = !0;
    }
    return Wt._system;
  }
};
zc.targetFPMS = 0.06;
let Yt = zc;
Object.defineProperties(H, {
  /**
   * Target frames per millisecond.
   * @static
   * @name TARGET_FPMS
   * @memberof PIXI.settings
   * @type {number}
   * @deprecated since 7.1.0
   * @see PIXI.Ticker.targetFPMS
   */
  TARGET_FPMS: {
    get() {
      return Yt.targetFPMS;
    },
    set(r) {
      it("7.1.0", "settings.TARGET_FPMS is deprecated, use Ticker.targetFPMS"), Yt.targetFPMS = r;
    }
  }
});
class Wc {
  /**
   * Initialize the plugin with scope of application instance
   * @static
   * @private
   * @param {object} [options] - See application options
   */
  static init(t) {
    t = Object.assign({
      autoStart: !0,
      sharedTicker: !1
    }, t), Object.defineProperty(
      this,
      "ticker",
      {
        set(e) {
          this._ticker && this._ticker.remove(this.render, this), this._ticker = e, e && e.add(this.render, this, Tr.LOW);
        },
        get() {
          return this._ticker;
        }
      }
    ), this.stop = () => {
      this._ticker.stop();
    }, this.start = () => {
      this._ticker.start();
    }, this._ticker = null, this.ticker = t.sharedTicker ? Yt.shared : new Yt(), t.autoStart && this.start();
  }
  /**
   * Clean up the ticker, scoped to application.
   * @static
   * @private
   */
  static destroy() {
    if (this._ticker) {
      const t = this._ticker;
      this.ticker = null, t.destroy();
    }
  }
}
Wc.extension = k.Application;
z.add(Wc);
const jc = [];
z.handleByList(k.Renderer, jc);
function $c(r) {
  for (const t of jc)
    if (t.test(r))
      return new t(r);
  throw new Error("Unable to auto-detect a suitable renderer.");
}
var Yg = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`, qg = `attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`;
const Kg = Yg, Yc = qg;
class qc {
  constructor(t) {
    this.renderer = t;
  }
  contextChange(t) {
    let e;
    if (this.renderer.context.webGLVersion === 1) {
      const i = t.getParameter(t.FRAMEBUFFER_BINDING);
      t.bindFramebuffer(t.FRAMEBUFFER, null), e = t.getParameter(t.SAMPLES), t.bindFramebuffer(t.FRAMEBUFFER, i);
    } else {
      const i = t.getParameter(t.DRAW_FRAMEBUFFER_BINDING);
      t.bindFramebuffer(t.DRAW_FRAMEBUFFER, null), e = t.getParameter(t.SAMPLES), t.bindFramebuffer(t.DRAW_FRAMEBUFFER, i);
    }
    e >= It.HIGH ? this.multisample = It.HIGH : e >= It.MEDIUM ? this.multisample = It.MEDIUM : e >= It.LOW ? this.multisample = It.LOW : this.multisample = It.NONE;
  }
  destroy() {
  }
}
qc.extension = {
  type: k.RendererSystem,
  name: "_multisample"
};
z.add(qc);
class Zg {
  constructor(t) {
    this.buffer = t || null, this.updateID = -1, this.byteLength = -1, this.refCount = 0;
  }
}
class Kc {
  /**
   * @param {PIXI.Renderer} renderer - The renderer this System works for.
   */
  constructor(t) {
    this.renderer = t, this.managedBuffers = {}, this.boundBufferBases = {};
  }
  /**
   * @ignore
   */
  destroy() {
    this.renderer = null;
  }
  /** Sets up the renderer context and necessary buffers. */
  contextChange() {
    this.disposeAll(!0), this.gl = this.renderer.gl, this.CONTEXT_UID = this.renderer.CONTEXT_UID;
  }
  /**
   * This binds specified buffer. On first run, it will create the webGL buffers for the context too
   * @param buffer - the buffer to bind to the renderer
   */
  bind(t) {
    const { gl: e, CONTEXT_UID: i } = this, s = t._glBuffers[i] || this.createGLBuffer(t);
    e.bindBuffer(t.type, s.buffer);
  }
  unbind(t) {
    const { gl: e } = this;
    e.bindBuffer(t, null);
  }
  /**
   * Binds an uniform buffer to at the given index.
   *
   * A cache is used so a buffer will not be bound again if already bound.
   * @param buffer - the buffer to bind
   * @param index - the base index to bind it to.
   */
  bindBufferBase(t, e) {
    const { gl: i, CONTEXT_UID: s } = this;
    if (this.boundBufferBases[e] !== t) {
      const n = t._glBuffers[s] || this.createGLBuffer(t);
      this.boundBufferBases[e] = t, i.bindBufferBase(i.UNIFORM_BUFFER, e, n.buffer);
    }
  }
  /**
   * Binds a buffer whilst also binding its range.
   * This will make the buffer start from the offset supplied rather than 0 when it is read.
   * @param buffer - the buffer to bind
   * @param index - the base index to bind at, defaults to 0
   * @param offset - the offset to bind at (this is blocks of 256). 0 = 0, 1 = 256, 2 = 512 etc
   */
  bindBufferRange(t, e, i) {
    const { gl: s, CONTEXT_UID: n } = this;
    i = i || 0;
    const o = t._glBuffers[n] || this.createGLBuffer(t);
    s.bindBufferRange(s.UNIFORM_BUFFER, e || 0, o.buffer, i * 256, 256);
  }
  /**
   * Will ensure the data in the buffer is uploaded to the GPU.
   * @param {PIXI.Buffer} buffer - the buffer to update
   */
  update(t) {
    const { gl: e, CONTEXT_UID: i } = this, s = t._glBuffers[i] || this.createGLBuffer(t);
    if (t._updateID !== s.updateID)
      if (s.updateID = t._updateID, e.bindBuffer(t.type, s.buffer), s.byteLength >= t.data.byteLength)
        e.bufferSubData(t.type, 0, t.data);
      else {
        const n = t.static ? e.STATIC_DRAW : e.DYNAMIC_DRAW;
        s.byteLength = t.data.byteLength, e.bufferData(t.type, t.data, n);
      }
  }
  /**
   * Disposes buffer
   * @param {PIXI.Buffer} buffer - buffer with data
   * @param {boolean} [contextLost=false] - If context was lost, we suppress deleteVertexArray
   */
  dispose(t, e) {
    if (!this.managedBuffers[t.id])
      return;
    delete this.managedBuffers[t.id];
    const i = t._glBuffers[this.CONTEXT_UID], s = this.gl;
    t.disposeRunner.remove(this), i && (e || s.deleteBuffer(i.buffer), delete t._glBuffers[this.CONTEXT_UID]);
  }
  /**
   * dispose all WebGL resources of all managed buffers
   * @param {boolean} [contextLost=false] - If context was lost, we suppress `gl.delete` calls
   */
  disposeAll(t) {
    const e = Object.keys(this.managedBuffers);
    for (let i = 0; i < e.length; i++)
      this.dispose(this.managedBuffers[e[i]], t);
  }
  /**
   * creates and attaches a GLBuffer object tied to the current context.
   * @param buffer
   * @protected
   */
  createGLBuffer(t) {
    const { CONTEXT_UID: e, gl: i } = this;
    return t._glBuffers[e] = new Zg(i.createBuffer()), this.managedBuffers[t.id] = t, t.disposeRunner.add(this), t._glBuffers[e];
  }
}
Kc.extension = {
  type: k.RendererSystem,
  name: "buffer"
};
z.add(Kc);
class Zc {
  // renderers scene graph!
  constructor(t) {
    this.renderer = t;
  }
  /**
   * Renders the object to its WebGL view.
   * @param displayObject - The object to be rendered.
   * @param options - the options to be passed to the renderer
   */
  render(t, e) {
    const i = this.renderer;
    let s, n, o, a;
    if (e && (s = e.renderTexture, n = e.clear, o = e.transform, a = e.skipUpdateTransform), this.renderingToScreen = !s, i.runners.prerender.emit(), i.emit("prerender"), i.projection.transform = o, !i.context.isLost) {
      if (s || (this.lastObjectRendered = t), !a) {
        const h = t.enableTempParent();
        t.updateTransform(), t.disableTempParent(h);
      }
      i.renderTexture.bind(s), i.batch.currentRenderer.start(), (n ?? i.background.clearBeforeRender) && i.renderTexture.clear(), t.render(i), i.batch.currentRenderer.flush(), s && (e.blit && i.framebuffer.blit(), s.baseTexture.update()), i.runners.postrender.emit(), i.projection.transform = null, i.emit("postrender");
    }
  }
  destroy() {
    this.renderer = null, this.lastObjectRendered = null;
  }
}
Zc.extension = {
  type: k.RendererSystem,
  name: "objectRenderer"
};
z.add(Zc);
const ys = class Io extends Wg {
  /**
   * @param {PIXI.IRendererOptions} [options] - See {@link PIXI.settings.RENDER_OPTIONS} for defaults.
   */
  constructor(t) {
    super(), this.type = Ul.WEBGL, t = Object.assign({}, H.RENDER_OPTIONS, t), this.gl = null, this.CONTEXT_UID = 0, this.globalUniforms = new ue({
      projectionMatrix: new yt()
    }, !0);
    const e = {
      runners: [
        "init",
        "destroy",
        "contextChange",
        "resolutionChange",
        "reset",
        "update",
        "postrender",
        "prerender",
        "resize"
      ],
      systems: Io.__systems,
      priority: [
        "_view",
        "textureGenerator",
        "background",
        "_plugin",
        "startup",
        // low level WebGL systems
        "context",
        "state",
        "texture",
        "buffer",
        "geometry",
        "framebuffer",
        "transformFeedback",
        // high level pixi specific rendering
        "mask",
        "scissor",
        "stencil",
        "projection",
        "textureGC",
        "filter",
        "renderTexture",
        "batch",
        "objectRenderer",
        "_multisample"
      ]
    };
    this.setup(e), "useContextAlpha" in t && (it("7.0.0", "options.useContextAlpha is deprecated, use options.premultipliedAlpha and options.backgroundAlpha instead"), t.premultipliedAlpha = t.useContextAlpha && t.useContextAlpha !== "notMultiplied", t.backgroundAlpha = t.useContextAlpha === !1 ? 1 : t.backgroundAlpha), this._plugin.rendererPlugins = Io.__plugins, this.options = t, this.startup.run(this.options);
  }
  /**
   * Create renderer if WebGL is available. Overrideable
   * by the **@pixi/canvas-renderer** package to allow fallback.
   * throws error if WebGL is not available.
   * @param options
   * @private
   */
  static test(t) {
    return t != null && t.forceCanvas ? !1 : bm();
  }
  /**
   * Renders the object to its WebGL view.
   * @param displayObject - The object to be rendered.
   * @param {object} [options] - Object to use for render options.
   * @param {PIXI.RenderTexture} [options.renderTexture] - The render texture to render to.
   * @param {boolean} [options.clear=true] - Should the canvas be cleared before the new render.
   * @param {PIXI.Matrix} [options.transform] - A transform to apply to the render texture before rendering.
   * @param {boolean} [options.skipUpdateTransform=false] - Should we skip the update transform pass?
   */
  render(t, e) {
    this.objectRenderer.render(t, e);
  }
  /**
   * Resizes the WebGL view to the specified width and height.
   * @param desiredScreenWidth - The desired width of the screen.
   * @param desiredScreenHeight - The desired height of the screen.
   */
  resize(t, e) {
    this._view.resizeView(t, e);
  }
  /**
   * Resets the WebGL state so you can render things however you fancy!
   * @returns Returns itself.
   */
  reset() {
    return this.runners.reset.emit(), this;
  }
  /** Clear the frame buffer. */
  clear() {
    this.renderTexture.bind(), this.renderTexture.clear();
  }
  /**
   * Removes everything from the renderer (event listeners, spritebatch, etc...)
   * @param [removeView=false] - Removes the Canvas element from the DOM.
   *  See: https://github.com/pixijs/pixijs/issues/2233
   */
  destroy(t = !1) {
    this.runners.destroy.items.reverse(), this.emitWithCustomOptions(this.runners.destroy, {
      _view: t
    }), super.destroy();
  }
  /** Collection of plugins */
  get plugins() {
    return this._plugin.plugins;
  }
  /** The number of msaa samples of the canvas. */
  get multisample() {
    return this._multisample.multisample;
  }
  /**
   * Same as view.width, actual number of pixels in the canvas by horizontal.
   * @member {number}
   * @readonly
   * @default 800
   */
  get width() {
    return this._view.element.width;
  }
  /**
   * Same as view.height, actual number of pixels in the canvas by vertical.
   * @default 600
   */
  get height() {
    return this._view.element.height;
  }
  /** The resolution / device pixel ratio of the renderer. */
  get resolution() {
    return this._view.resolution;
  }
  set resolution(t) {
    this._view.resolution = t, this.runners.resolutionChange.emit(t);
  }
  /** Whether CSS dimensions of canvas view should be resized to screen dimensions automatically. */
  get autoDensity() {
    return this._view.autoDensity;
  }
  /** The canvas element that everything is drawn to.*/
  get view() {
    return this._view.element;
  }
  /**
   * Measurements of the screen. (0, 0, screenWidth, screenHeight).
   *
   * Its safe to use as filterArea or hitArea for the whole stage.
   * @member {PIXI.Rectangle}
   */
  get screen() {
    return this._view.screen;
  }
  /** the last object rendered by the renderer. Useful for other plugins like interaction managers */
  get lastObjectRendered() {
    return this.objectRenderer.lastObjectRendered;
  }
  /** Flag if we are rendering to the screen vs renderTexture */
  get renderingToScreen() {
    return this.objectRenderer.renderingToScreen;
  }
  /** When logging Pixi to the console, this is the name we will show */
  get rendererLogId() {
    return `WebGL ${this.context.webGLVersion}`;
  }
  /**
   * This sets weather the screen is totally cleared between each frame withthe background color and alpha
   * @deprecated since 7.0.0
   */
  get clearBeforeRender() {
    return it("7.0.0", "renderer.clearBeforeRender has been deprecated, please use renderer.background.clearBeforeRender instead."), this.background.clearBeforeRender;
  }
  /**
   * Pass-thru setting for the canvas' context `alpha` property. This is typically
   * not something you need to fiddle with. If you want transparency, use `backgroundAlpha`.
   * @deprecated since 7.0.0
   * @member {boolean}
   */
  get useContextAlpha() {
    return it("7.0.0", "renderer.useContextAlpha has been deprecated, please use renderer.context.premultipliedAlpha instead."), this.context.useContextAlpha;
  }
  /**
   * readonly drawing buffer preservation
   * we can only know this if Pixi created the context
   * @deprecated since 7.0.0
   */
  get preserveDrawingBuffer() {
    return it("7.0.0", "renderer.preserveDrawingBuffer has been deprecated, we cannot truly know this unless pixi created the context"), this.context.preserveDrawingBuffer;
  }
  /**
   * The background color to fill if not transparent
   * @member {number}
   * @deprecated since 7.0.0
   */
  get backgroundColor() {
    return it("7.0.0", "renderer.backgroundColor has been deprecated, use renderer.background.color instead."), this.background.color;
  }
  set backgroundColor(t) {
    it("7.0.0", "renderer.backgroundColor has been deprecated, use renderer.background.color instead."), this.background.color = t;
  }
  /**
   * The background color alpha. Setting this to 0 will make the canvas transparent.
   * @member {number}
   * @deprecated since 7.0.0
   */
  get backgroundAlpha() {
    return it("7.0.0", "renderer.backgroundAlpha has been deprecated, use renderer.background.alpha instead."), this.background.alpha;
  }
  /**
   * @deprecated since 7.0.0
   */
  set backgroundAlpha(t) {
    it("7.0.0", "renderer.backgroundAlpha has been deprecated, use renderer.background.alpha instead."), this.background.alpha = t;
  }
  /**
   * @deprecated since 7.0.0
   */
  get powerPreference() {
    return it("7.0.0", "renderer.powerPreference has been deprecated, we can only know this if pixi creates the context"), this.context.powerPreference;
  }
  /**
   * Useful function that returns a texture of the display object that can then be used to create sprites
   * This can be quite useful if your displayObject is complicated and needs to be reused multiple times.
   * @param displayObject - The displayObject the object will be generated from.
   * @param {IGenerateTextureOptions} options - Generate texture options.
   * @param {PIXI.Rectangle} options.region - The region of the displayObject, that shall be rendered,
   *        if no region is specified, defaults to the local bounds of the displayObject.
   * @param {number} [options.resolution] - If not given, the renderer's resolution is used.
   * @param {PIXI.MSAA_QUALITY} [options.multisample] - If not given, the renderer's multisample is used.
   * @returns A texture of the graphics object.
   */
  generateTexture(t, e) {
    return this.textureGenerator.generateTexture(t, e);
  }
};
ys.extension = {
  type: k.Renderer,
  priority: 1
}, /**
* Collection of installed plugins. These are included by default in PIXI, but can be excluded
* by creating a custom build. Consult the README for more information about creating custom
* builds and excluding plugins.
* @private
*/
ys.__plugins = {}, /**
* The collection of installed systems.
* @private
*/
ys.__systems = {};
let pa = ys;
z.handleByMap(k.RendererPlugin, pa.__plugins);
z.handleByMap(k.RendererSystem, pa.__systems);
z.add(pa);
class Qc extends Pi {
  /**
   * @param length
   * @param options - Options to for Resource constructor
   * @param {number} [options.width] - Width of the resource
   * @param {number} [options.height] - Height of the resource
   */
  constructor(t, e) {
    const { width: i, height: s } = e || {};
    super(i, s), this.items = [], this.itemDirtyIds = [];
    for (let n = 0; n < t; n++) {
      const o = new J();
      this.items.push(o), this.itemDirtyIds.push(-2);
    }
    this.length = t, this._load = null, this.baseTexture = null;
  }
  /**
   * Used from ArrayResource and CubeResource constructors.
   * @param resources - Can be resources, image elements, canvas, etc. ,
   *  length should be same as constructor length
   * @param options - Detect options for resources
   */
  initFromArray(t, e) {
    for (let i = 0; i < this.length; i++)
      t[i] && (t[i].castToBaseTexture ? this.addBaseTextureAt(t[i].castToBaseTexture(), i) : t[i] instanceof Pi ? this.addResourceAt(t[i], i) : this.addResourceAt(mc(t[i], e), i));
  }
  /** Destroy this BaseImageResource. */
  dispose() {
    for (let t = 0, e = this.length; t < e; t++)
      this.items[t].destroy();
    this.items = null, this.itemDirtyIds = null, this._load = null;
  }
  /**
   * Set a resource by ID
   * @param resource
   * @param index - Zero-based index of resource to set
   * @returns - Instance for chaining
   */
  addResourceAt(t, e) {
    if (!this.items[e])
      throw new Error(`Index ${e} is out of bounds`);
    return t.valid && !this.valid && this.resize(t.width, t.height), this.items[e].setResource(t), this;
  }
  /**
   * Set the parent base texture.
   * @param baseTexture
   */
  bind(t) {
    if (this.baseTexture !== null)
      throw new Error("Only one base texture per TextureArray is allowed");
    super.bind(t);
    for (let e = 0; e < this.length; e++)
      this.items[e].parentTextureArray = t, this.items[e].on("update", t.update, t);
  }
  /**
   * Unset the parent base texture.
   * @param baseTexture
   */
  unbind(t) {
    super.unbind(t);
    for (let e = 0; e < this.length; e++)
      this.items[e].parentTextureArray = null, this.items[e].off("update", t.update, t);
  }
  /**
   * Load all the resources simultaneously
   * @returns - When load is resolved
   */
  load() {
    if (this._load)
      return this._load;
    const t = this.items.map((e) => e.resource).filter((e) => e).map((e) => e.load());
    return this._load = Promise.all(t).then(
      () => {
        const { realWidth: e, realHeight: i } = this.items[0];
        return this.resize(e, i), this.update(), Promise.resolve(this);
      }
    ), this._load;
  }
}
class Qg extends Qc {
  /**
   * @param source - Number of items in array or the collection
   *        of image URLs to use. Can also be resources, image elements, canvas, etc.
   * @param options - Options to apply to {@link PIXI.autoDetectResource}
   * @param {number} [options.width] - Width of the resource
   * @param {number} [options.height] - Height of the resource
   */
  constructor(t, e) {
    const { width: i, height: s } = e || {};
    let n, o;
    Array.isArray(t) ? (n = t, o = t.length) : o = t, super(o, { width: i, height: s }), n && this.initFromArray(n, e);
  }
  /**
   * Set a baseTexture by ID,
   * ArrayResource just takes resource from it, nothing more
   * @param baseTexture
   * @param index - Zero-based index of resource to set
   * @returns - Instance for chaining
   */
  addBaseTextureAt(t, e) {
    if (t.resource)
      this.addResourceAt(t.resource, e);
    else
      throw new Error("ArrayResource does not support RenderTexture");
    return this;
  }
  /**
   * Add binding
   * @param baseTexture
   */
  bind(t) {
    super.bind(t), t.target = Wr.TEXTURE_2D_ARRAY;
  }
  /**
   * Upload the resources to the GPU.
   * @param renderer
   * @param texture
   * @param glTexture
   * @returns - whether texture was uploaded
   */
  upload(t, e, i) {
    const { length: s, itemDirtyIds: n, items: o } = this, { gl: a } = t;
    i.dirtyId < 0 && a.texImage3D(
      a.TEXTURE_2D_ARRAY,
      0,
      i.internalFormat,
      this._width,
      this._height,
      s,
      0,
      e.format,
      i.type,
      null
    );
    for (let h = 0; h < s; h++) {
      const l = o[h];
      n[h] < l.dirtyId && (n[h] = l.dirtyId, l.valid && a.texSubImage3D(
        a.TEXTURE_2D_ARRAY,
        0,
        0,
        // xoffset
        0,
        // yoffset
        h,
        // zoffset
        l.resource.width,
        l.resource.height,
        1,
        e.format,
        i.type,
        l.resource.source
      ));
    }
    return !0;
  }
}
class Jg extends Ze {
  /**
   * @param source - Canvas element to use
   */
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(t) {
    super(t);
  }
  /**
   * Used to auto-detect the type of resource.
   * @param {*} source - The source object
   * @returns {boolean} `true` if source is HTMLCanvasElement or OffscreenCanvas
   */
  static test(t) {
    const { OffscreenCanvas: e } = globalThis;
    return e && t instanceof e ? !0 : globalThis.HTMLCanvasElement && t instanceof HTMLCanvasElement;
  }
}
const Jc = class gi extends Qc {
  /**
   * @param {Array<string|PIXI.Resource>} [source] - Collection of URLs or resources
   *        to use as the sides of the cube.
   * @param options - ImageResource options
   * @param {number} [options.width] - Width of resource
   * @param {number} [options.height] - Height of resource
   * @param {number} [options.autoLoad=true] - Whether to auto-load resources
   * @param {number} [options.linkBaseTexture=true] - In case BaseTextures are supplied,
   *   whether to copy them or use
   */
  constructor(t, e) {
    const { width: i, height: s, autoLoad: n, linkBaseTexture: o } = e || {};
    if (t && t.length !== gi.SIDES)
      throw new Error(`Invalid length. Got ${t.length}, expected 6`);
    super(6, { width: i, height: s });
    for (let a = 0; a < gi.SIDES; a++)
      this.items[a].target = Wr.TEXTURE_CUBE_MAP_POSITIVE_X + a;
    this.linkBaseTexture = o !== !1, t && this.initFromArray(t, e), n !== !1 && this.load();
  }
  /**
   * Add binding.
   * @param baseTexture - parent base texture
   */
  bind(t) {
    super.bind(t), t.target = Wr.TEXTURE_CUBE_MAP;
  }
  addBaseTextureAt(t, e, i) {
    if (i === void 0 && (i = this.linkBaseTexture), !this.items[e])
      throw new Error(`Index ${e} is out of bounds`);
    if (!this.linkBaseTexture || t.parentTextureArray || Object.keys(t._glTextures).length > 0)
      if (t.resource)
        this.addResourceAt(t.resource, e);
      else
        throw new Error("CubeResource does not support copying of renderTexture.");
    else
      t.target = Wr.TEXTURE_CUBE_MAP_POSITIVE_X + e, t.parentTextureArray = this.baseTexture, this.items[e] = t;
    return t.valid && !this.valid && this.resize(t.realWidth, t.realHeight), this.items[e] = t, this;
  }
  /**
   * Upload the resource
   * @param renderer
   * @param _baseTexture
   * @param glTexture
   * @returns {boolean} true is success
   */
  upload(t, e, i) {
    const s = this.itemDirtyIds;
    for (let n = 0; n < gi.SIDES; n++) {
      const o = this.items[n];
      (s[n] < o.dirtyId || i.dirtyId < e.dirtyId) && (o.valid && o.resource ? (o.resource.upload(t, o, i), s[n] = o.dirtyId) : s[n] < -1 && (t.gl.texImage2D(
        o.target,
        0,
        i.internalFormat,
        e.realWidth,
        e.realHeight,
        0,
        e.format,
        i.type,
        null
      ), s[n] = -1));
    }
    return !0;
  }
  /**
   * Used to auto-detect the type of resource.
   * @param {*} source - The source object
   * @returns {boolean} `true` if source is an array of 6 elements
   */
  static test(t) {
    return Array.isArray(t) && t.length === gi.SIDES;
  }
};
Jc.SIDES = 6;
let t0 = Jc;
class Xr extends Ze {
  /**
   * @param source - ImageBitmap or URL to use.
   * @param options - Options to use.
   */
  constructor(t, e) {
    e = e || {};
    let i, s, n;
    typeof t == "string" ? (i = Xr.EMPTY, s = t, n = !0) : (i = t, s = null, n = !1), super(i), this.url = s, this.crossOrigin = e.crossOrigin ?? !0, this.alphaMode = typeof e.alphaMode == "number" ? e.alphaMode : null, this.ownsImageBitmap = e.ownsImageBitmap ?? n, this._load = null, e.autoLoad !== !1 && this.load();
  }
  load() {
    return this._load ? this._load : (this._load = new Promise(async (t, e) => {
      if (this.url === null) {
        t(this);
        return;
      }
      try {
        const i = await H.ADAPTER.fetch(this.url, {
          mode: this.crossOrigin ? "cors" : "no-cors"
        });
        if (this.destroyed)
          return;
        const s = await i.blob();
        if (this.destroyed)
          return;
        const n = await createImageBitmap(s, {
          premultiplyAlpha: this.alphaMode === null || this.alphaMode === Ht.UNPACK ? "premultiply" : "none"
        });
        if (this.destroyed) {
          n.close();
          return;
        }
        this.source = n, this.update(), t(this);
      } catch (i) {
        if (this.destroyed)
          return;
        e(i), this.onError.emit(i);
      }
    }), this._load);
  }
  /**
   * Upload the image bitmap resource to GPU.
   * @param renderer - Renderer to upload to
   * @param baseTexture - BaseTexture for this resource
   * @param glTexture - GLTexture to use
   * @returns {boolean} true is success
   */
  upload(t, e, i) {
    return this.source instanceof ImageBitmap ? (typeof this.alphaMode == "number" && (e.alphaMode = this.alphaMode), super.upload(t, e, i)) : (this.load(), !1);
  }
  /** Destroys this resource. */
  dispose() {
    this.ownsImageBitmap && this.source instanceof ImageBitmap && this.source.close(), super.dispose(), this._load = null;
  }
  /**
   * Used to auto-detect the type of resource.
   * @param {*} source - The source object
   * @returns {boolean} `true` if current environment support ImageBitmap, and source is string or ImageBitmap
   */
  static test(t) {
    return !!globalThis.createImageBitmap && typeof ImageBitmap < "u" && (typeof t == "string" || t instanceof ImageBitmap);
  }
  /**
   * ImageBitmap cannot be created synchronously, so a empty placeholder canvas is needed when loading from URLs.
   * Only for internal usage.
   * @returns The cached placeholder canvas.
   */
  static get EMPTY() {
    return Xr._EMPTY = Xr._EMPTY ?? H.ADAPTER.createCanvas(0, 0), Xr._EMPTY;
  }
}
const Co = class _s extends Ze {
  /**
   * @param sourceBase64 - Base64 encoded SVG element or URL for SVG file.
   * @param {object} [options] - Options to use
   * @param {number} [options.scale=1] - Scale to apply to SVG. Overridden by...
   * @param {number} [options.width] - Rasterize SVG this wide. Aspect ratio preserved if height not specified.
   * @param {number} [options.height] - Rasterize SVG this high. Aspect ratio preserved if width not specified.
   * @param {boolean} [options.autoLoad=true] - Start loading right away.
   */
  constructor(t, e) {
    e = e || {}, super(H.ADAPTER.createCanvas()), this._width = 0, this._height = 0, this.svg = t, this.scale = e.scale || 1, this._overrideWidth = e.width, this._overrideHeight = e.height, this._resolve = null, this._crossorigin = e.crossorigin, this._load = null, e.autoLoad !== !1 && this.load();
  }
  load() {
    return this._load ? this._load : (this._load = new Promise((t) => {
      if (this._resolve = () => {
        this.update(), t(this);
      }, _s.SVG_XML.test(this.svg.trim())) {
        if (!btoa)
          throw new Error("Your browser doesn't support base64 conversions.");
        this.svg = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(this.svg)))}`;
      }
      this._loadSvg();
    }), this._load);
  }
  /** Loads an SVG image from `imageUrl` or `data URL`. */
  _loadSvg() {
    const t = new Image();
    Ze.crossOrigin(t, this.svg, this._crossorigin), t.src = this.svg, t.onerror = (e) => {
      this._resolve && (t.onerror = null, this.onError.emit(e));
    }, t.onload = () => {
      if (!this._resolve)
        return;
      const e = t.width, i = t.height;
      if (!e || !i)
        throw new Error("The SVG image must have width and height defined (in pixels), canvas API needs them.");
      let s = e * this.scale, n = i * this.scale;
      (this._overrideWidth || this._overrideHeight) && (s = this._overrideWidth || this._overrideHeight / i * e, n = this._overrideHeight || this._overrideWidth / e * i), s = Math.round(s), n = Math.round(n);
      const o = this.source;
      o.width = s, o.height = n, o._pixiId = `canvas_${br()}`, o.getContext("2d").drawImage(t, 0, 0, e, i, 0, 0, s, n), this._resolve(), this._resolve = null;
    };
  }
  /**
   * Get size from an svg string using a regular expression.
   * @param svgString - a serialized svg element
   * @returns - image extension
   */
  static getSize(t) {
    const e = _s.SVG_SIZE.exec(t), i = {};
    return e && (i[e[1]] = Math.round(parseFloat(e[3])), i[e[5]] = Math.round(parseFloat(e[7]))), i;
  }
  /** Destroys this texture. */
  dispose() {
    super.dispose(), this._resolve = null, this._crossorigin = null;
  }
  /**
   * Used to auto-detect the type of resource.
   * @param {*} source - The source object
   * @param {string} extension - The extension of source, if set
   * @returns {boolean} - If the source is a SVG source or data file
   */
  static test(t, e) {
    return e === "svg" || typeof t == "string" && t.startsWith("data:image/svg+xml") || typeof t == "string" && _s.SVG_XML.test(t);
  }
  // eslint-disable-line max-len
};
Co.SVG_XML = /^(<\?xml[^?]+\?>)?\s*(<!--[^(-->)]*-->)?\s*\<svg/m, /**
* Regular expression for SVG size.
* @example &lt;svg width="100" height="100"&gt;&lt;/svg&gt;
* @readonly
*/
Co.SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i;
let Ro = Co;
const Po = class Mo extends Ze {
  /**
   * @param {HTMLVideoElement|object|string|Array<string|object>} source - Video element to use.
   * @param {object} [options] - Options to use
   * @param {boolean} [options.autoLoad=true] - Start loading the video immediately
   * @param {boolean} [options.autoPlay=true] - Start playing video immediately
   * @param {number} [options.updateFPS=0] - How many times a second to update the texture from the video.
   * Leave at 0 to update at every render.
   * @param {boolean} [options.crossorigin=true] - Load image using cross origin
   * @param {boolean} [options.loop=false] - Loops the video
   * @param {boolean} [options.muted=false] - Mutes the video audio, useful for autoplay
   * @param {boolean} [options.playsinline=true] - Prevents opening the video on mobile devices
   */
  constructor(t, e) {
    if (e = e || {}, !(t instanceof HTMLVideoElement)) {
      const i = document.createElement("video");
      e.autoLoad !== !1 && i.setAttribute("preload", "auto"), e.playsinline !== !1 && (i.setAttribute("webkit-playsinline", ""), i.setAttribute("playsinline", "")), e.muted === !0 && (i.setAttribute("muted", ""), i.muted = !0), e.loop === !0 && i.setAttribute("loop", ""), e.autoPlay !== !1 && i.setAttribute("autoplay", ""), typeof t == "string" && (t = [t]);
      const s = t[0].src || t[0];
      Ze.crossOrigin(i, s, e.crossorigin);
      for (let n = 0; n < t.length; ++n) {
        const o = document.createElement("source");
        let { src: a, mime: h } = t[n];
        if (a = a || t[n], a.startsWith("data:"))
          h = a.slice(5, a.indexOf(";"));
        else if (!a.startsWith("blob:")) {
          const l = a.split("?").shift().toLowerCase(), c = l.slice(l.lastIndexOf(".") + 1);
          h = h || Mo.MIME_TYPES[c] || `video/${c}`;
        }
        o.src = a, h && (o.type = h), i.appendChild(o);
      }
      t = i;
    }
    super(t), this.noSubImage = !0, this._autoUpdate = !0, this._isConnectedToTicker = !1, this._updateFPS = e.updateFPS || 0, this._msToNextUpdate = 0, this.autoPlay = e.autoPlay !== !1, this._videoFrameRequestCallback = this._videoFrameRequestCallback.bind(this), this._videoFrameRequestCallbackHandle = null, this._load = null, this._resolve = null, this._reject = null, this._onCanPlay = this._onCanPlay.bind(this), this._onError = this._onError.bind(this), this._onPlayStart = this._onPlayStart.bind(this), this._onPlayStop = this._onPlayStop.bind(this), this._onSeeked = this._onSeeked.bind(this), e.autoLoad !== !1 && this.load();
  }
  /**
   * Trigger updating of the texture.
   * @param _deltaTime - time delta since last tick
   */
  update(t = 0) {
    if (!this.destroyed) {
      if (this._updateFPS) {
        const e = Yt.shared.elapsedMS * this.source.playbackRate;
        this._msToNextUpdate = Math.floor(this._msToNextUpdate - e);
      }
      (!this._updateFPS || this._msToNextUpdate <= 0) && (super.update(
        /* deltaTime*/
      ), this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0);
    }
  }
  _videoFrameRequestCallback() {
    this.update(), this.destroyed ? this._videoFrameRequestCallbackHandle = null : this._videoFrameRequestCallbackHandle = this.source.requestVideoFrameCallback(
      this._videoFrameRequestCallback
    );
  }
  /**
   * Start preloading the video resource.
   * @returns {Promise<void>} Handle the validate event
   */
  load() {
    if (this._load)
      return this._load;
    const t = this.source;
    return (t.readyState === t.HAVE_ENOUGH_DATA || t.readyState === t.HAVE_FUTURE_DATA) && t.width && t.height && (t.complete = !0), t.addEventListener("play", this._onPlayStart), t.addEventListener("pause", this._onPlayStop), t.addEventListener("seeked", this._onSeeked), this._isSourceReady() ? this._onCanPlay() : (t.addEventListener("canplay", this._onCanPlay), t.addEventListener("canplaythrough", this._onCanPlay), t.addEventListener("error", this._onError, !0)), this._load = new Promise((e, i) => {
      this.valid ? e(this) : (this._resolve = e, this._reject = i, t.load());
    }), this._load;
  }
  /**
   * Handle video error events.
   * @param event
   */
  _onError(t) {
    this.source.removeEventListener("error", this._onError, !0), this.onError.emit(t), this._reject && (this._reject(t), this._reject = null, this._resolve = null);
  }
  /**
   * Returns true if the underlying source is playing.
   * @returns - True if playing.
   */
  _isSourcePlaying() {
    const t = this.source;
    return !t.paused && !t.ended;
  }
  /**
   * Returns true if the underlying source is ready for playing.
   * @returns - True if ready.
   */
  _isSourceReady() {
    return this.source.readyState > 2;
  }
  /** Runs the update loop when the video is ready to play. */
  _onPlayStart() {
    this.valid || this._onCanPlay(), this._configureAutoUpdate();
  }
  /** Fired when a pause event is triggered, stops the update loop. */
  _onPlayStop() {
    this._configureAutoUpdate();
  }
  /** Fired when the video is completed seeking to the current playback position. */
  _onSeeked() {
    this._autoUpdate && !this._isSourcePlaying() && (this._msToNextUpdate = 0, this.update(), this._msToNextUpdate = 0);
  }
  /** Fired when the video is loaded and ready to play. */
  _onCanPlay() {
    const t = this.source;
    t.removeEventListener("canplay", this._onCanPlay), t.removeEventListener("canplaythrough", this._onCanPlay);
    const e = this.valid;
    this._msToNextUpdate = 0, this.update(), this._msToNextUpdate = 0, !e && this._resolve && (this._resolve(this), this._resolve = null, this._reject = null), this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && t.play();
  }
  /** Destroys this texture. */
  dispose() {
    this._configureAutoUpdate();
    const t = this.source;
    t && (t.removeEventListener("play", this._onPlayStart), t.removeEventListener("pause", this._onPlayStop), t.removeEventListener("seeked", this._onSeeked), t.removeEventListener("canplay", this._onCanPlay), t.removeEventListener("canplaythrough", this._onCanPlay), t.removeEventListener("error", this._onError, !0), t.pause(), t.src = "", t.load()), super.dispose();
  }
  /** Should the base texture automatically update itself, set to true by default. */
  get autoUpdate() {
    return this._autoUpdate;
  }
  set autoUpdate(t) {
    t !== this._autoUpdate && (this._autoUpdate = t, this._configureAutoUpdate());
  }
  /**
   * How many times a second to update the texture from the video. Leave at 0 to update at every render.
   * A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.
   */
  get updateFPS() {
    return this._updateFPS;
  }
  set updateFPS(t) {
    t !== this._updateFPS && (this._updateFPS = t, this._configureAutoUpdate());
  }
  _configureAutoUpdate() {
    this._autoUpdate && this._isSourcePlaying() ? !this._updateFPS && this.source.requestVideoFrameCallback ? (this._isConnectedToTicker && (Yt.shared.remove(this.update, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0), this._videoFrameRequestCallbackHandle === null && (this._videoFrameRequestCallbackHandle = this.source.requestVideoFrameCallback(
      this._videoFrameRequestCallback
    ))) : (this._videoFrameRequestCallbackHandle !== null && (this.source.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker || (Yt.shared.add(this.update, this), this._isConnectedToTicker = !0, this._msToNextUpdate = 0)) : (this._videoFrameRequestCallbackHandle !== null && (this.source.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker && (Yt.shared.remove(this.update, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0));
  }
  /**
   * Used to auto-detect the type of resource.
   * @param {*} source - The source object
   * @param {string} extension - The extension of source, if set
   * @returns {boolean} `true` if video source
   */
  static test(t, e) {
    return globalThis.HTMLVideoElement && t instanceof HTMLVideoElement || Mo.TYPES.includes(e);
  }
};
Po.TYPES = ["mp4", "m4v", "webm", "ogg", "ogv", "h264", "avi", "mov"], /**
* Map of video MIME types that can't be directly derived from file extensions.
* @readonly
*/
Po.MIME_TYPES = {
  ogv: "video/ogg",
  mov: "video/quicktime",
  m4v: "video/mp4"
};
let tu = Po;
yo.push(
  Xr,
  wc,
  Jg,
  tu,
  Ro,
  $s,
  t0,
  Qg
);
class Ls {
  constructor() {
    this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.rect = null, this.updateID = -1;
  }
  /**
   * Checks if bounds are empty.
   * @returns - True if empty.
   */
  isEmpty() {
    return this.minX > this.maxX || this.minY > this.maxY;
  }
  /** Clears the bounds and resets. */
  clear() {
    this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0;
  }
  /**
   * Can return Rectangle.EMPTY constant, either construct new rectangle, either use your rectangle
   * It is not guaranteed that it will return tempRect
   * @param rect - Temporary object will be used if AABB is not empty
   * @returns - A rectangle of the bounds
   */
  getRectangle(t) {
    return this.minX > this.maxX || this.minY > this.maxY ? tt.EMPTY : (t = t || new tt(0, 0, 1, 1), t.x = this.minX, t.y = this.minY, t.width = this.maxX - this.minX, t.height = this.maxY - this.minY, t);
  }
  /**
   * This function should be inlined when its possible.
   * @param point - The point to add.
   */
  addPoint(t) {
    this.minX = Math.min(this.minX, t.x), this.maxX = Math.max(this.maxX, t.x), this.minY = Math.min(this.minY, t.y), this.maxY = Math.max(this.maxY, t.y);
  }
  /**
   * Adds a point, after transformed. This should be inlined when its possible.
   * @param matrix
   * @param point
   */
  addPointMatrix(t, e) {
    const { a: i, b: s, c: n, d: o, tx: a, ty: h } = t, l = i * e.x + n * e.y + a, c = s * e.x + o * e.y + h;
    this.minX = Math.min(this.minX, l), this.maxX = Math.max(this.maxX, l), this.minY = Math.min(this.minY, c), this.maxY = Math.max(this.maxY, c);
  }
  /**
   * Adds a quad, not transformed
   * @param vertices - The verts to add.
   */
  addQuad(t) {
    let e = this.minX, i = this.minY, s = this.maxX, n = this.maxY, o = t[0], a = t[1];
    e = o < e ? o : e, i = a < i ? a : i, s = o > s ? o : s, n = a > n ? a : n, o = t[2], a = t[3], e = o < e ? o : e, i = a < i ? a : i, s = o > s ? o : s, n = a > n ? a : n, o = t[4], a = t[5], e = o < e ? o : e, i = a < i ? a : i, s = o > s ? o : s, n = a > n ? a : n, o = t[6], a = t[7], e = o < e ? o : e, i = a < i ? a : i, s = o > s ? o : s, n = a > n ? a : n, this.minX = e, this.minY = i, this.maxX = s, this.maxY = n;
  }
  /**
   * Adds sprite frame, transformed.
   * @param transform - transform to apply
   * @param x0 - left X of frame
   * @param y0 - top Y of frame
   * @param x1 - right X of frame
   * @param y1 - bottom Y of frame
   */
  addFrame(t, e, i, s, n) {
    this.addFrameMatrix(t.worldTransform, e, i, s, n);
  }
  /**
   * Adds sprite frame, multiplied by matrix
   * @param matrix - matrix to apply
   * @param x0 - left X of frame
   * @param y0 - top Y of frame
   * @param x1 - right X of frame
   * @param y1 - bottom Y of frame
   */
  addFrameMatrix(t, e, i, s, n) {
    const o = t.a, a = t.b, h = t.c, l = t.d, c = t.tx, u = t.ty;
    let d = this.minX, f = this.minY, p = this.maxX, m = this.maxY, g = o * e + h * i + c, y = a * e + l * i + u;
    d = g < d ? g : d, f = y < f ? y : f, p = g > p ? g : p, m = y > m ? y : m, g = o * s + h * i + c, y = a * s + l * i + u, d = g < d ? g : d, f = y < f ? y : f, p = g > p ? g : p, m = y > m ? y : m, g = o * e + h * n + c, y = a * e + l * n + u, d = g < d ? g : d, f = y < f ? y : f, p = g > p ? g : p, m = y > m ? y : m, g = o * s + h * n + c, y = a * s + l * n + u, d = g < d ? g : d, f = y < f ? y : f, p = g > p ? g : p, m = y > m ? y : m, this.minX = d, this.minY = f, this.maxX = p, this.maxY = m;
  }
  /**
   * Adds screen vertices from array
   * @param vertexData - calculated vertices
   * @param beginOffset - begin offset
   * @param endOffset - end offset, excluded
   */
  addVertexData(t, e, i) {
    let s = this.minX, n = this.minY, o = this.maxX, a = this.maxY;
    for (let h = e; h < i; h += 2) {
      const l = t[h], c = t[h + 1];
      s = l < s ? l : s, n = c < n ? c : n, o = l > o ? l : o, a = c > a ? c : a;
    }
    this.minX = s, this.minY = n, this.maxX = o, this.maxY = a;
  }
  /**
   * Add an array of mesh vertices
   * @param transform - mesh transform
   * @param vertices - mesh coordinates in array
   * @param beginOffset - begin offset
   * @param endOffset - end offset, excluded
   */
  addVertices(t, e, i, s) {
    this.addVerticesMatrix(t.worldTransform, e, i, s);
  }
  /**
   * Add an array of mesh vertices.
   * @param matrix - mesh matrix
   * @param vertices - mesh coordinates in array
   * @param beginOffset - begin offset
   * @param endOffset - end offset, excluded
   * @param padX - x padding
   * @param padY - y padding
   */
  addVerticesMatrix(t, e, i, s, n = 0, o = n) {
    const a = t.a, h = t.b, l = t.c, c = t.d, u = t.tx, d = t.ty;
    let f = this.minX, p = this.minY, m = this.maxX, g = this.maxY;
    for (let y = i; y < s; y += 2) {
      const v = e[y], _ = e[y + 1], x = a * v + l * _ + u, T = c * _ + h * v + d;
      f = Math.min(f, x - n), m = Math.max(m, x + n), p = Math.min(p, T - o), g = Math.max(g, T + o);
    }
    this.minX = f, this.minY = p, this.maxX = m, this.maxY = g;
  }
  /**
   * Adds other {@link PIXI.Bounds}.
   * @param bounds - The Bounds to be added
   */
  addBounds(t) {
    const e = this.minX, i = this.minY, s = this.maxX, n = this.maxY;
    this.minX = t.minX < e ? t.minX : e, this.minY = t.minY < i ? t.minY : i, this.maxX = t.maxX > s ? t.maxX : s, this.maxY = t.maxY > n ? t.maxY : n;
  }
  /**
   * Adds other Bounds, masked with Bounds.
   * @param bounds - The Bounds to be added.
   * @param mask - TODO
   */
  addBoundsMask(t, e) {
    const i = t.minX > e.minX ? t.minX : e.minX, s = t.minY > e.minY ? t.minY : e.minY, n = t.maxX < e.maxX ? t.maxX : e.maxX, o = t.maxY < e.maxY ? t.maxY : e.maxY;
    if (i <= n && s <= o) {
      const a = this.minX, h = this.minY, l = this.maxX, c = this.maxY;
      this.minX = i < a ? i : a, this.minY = s < h ? s : h, this.maxX = n > l ? n : l, this.maxY = o > c ? o : c;
    }
  }
  /**
   * Adds other Bounds, multiplied by matrix. Bounds shouldn't be empty.
   * @param bounds - other bounds
   * @param matrix - multiplicator
   */
  addBoundsMatrix(t, e) {
    this.addFrameMatrix(e, t.minX, t.minY, t.maxX, t.maxY);
  }
  /**
   * Adds other Bounds, masked with Rectangle.
   * @param bounds - TODO
   * @param area - TODO
   */
  addBoundsArea(t, e) {
    const i = t.minX > e.x ? t.minX : e.x, s = t.minY > e.y ? t.minY : e.y, n = t.maxX < e.x + e.width ? t.maxX : e.x + e.width, o = t.maxY < e.y + e.height ? t.maxY : e.y + e.height;
    if (i <= n && s <= o) {
      const a = this.minX, h = this.minY, l = this.maxX, c = this.maxY;
      this.minX = i < a ? i : a, this.minY = s < h ? s : h, this.maxX = n > l ? n : l, this.maxY = o > c ? o : c;
    }
  }
  /**
   * Pads bounds object, making it grow in all directions.
   * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
   * @param paddingX - The horizontal padding amount.
   * @param paddingY - The vertical padding amount.
   */
  pad(t = 0, e = t) {
    this.isEmpty() || (this.minX -= t, this.maxX += t, this.minY -= e, this.maxY += e);
  }
  /**
   * Adds padded frame. (x0, y0) should be strictly less than (x1, y1)
   * @param x0 - left X of frame
   * @param y0 - top Y of frame
   * @param x1 - right X of frame
   * @param y1 - bottom Y of frame
   * @param padX - padding X
   * @param padY - padding Y
   */
  addFramePad(t, e, i, s, n, o) {
    t -= n, e -= o, i += n, s += o, this.minX = this.minX < t ? this.minX : t, this.maxX = this.maxX > i ? this.maxX : i, this.minY = this.minY < e ? this.minY : e, this.maxY = this.maxY > s ? this.maxY : s;
  }
}
class Et extends Bi {
  constructor() {
    super(), this.tempDisplayObjectParent = null, this.transform = new da(), this.alpha = 1, this.visible = !0, this.renderable = !0, this.cullable = !1, this.cullArea = null, this.parent = null, this.worldAlpha = 1, this._lastSortedIndex = 0, this._zIndex = 0, this.filterArea = null, this.filters = null, this._enabledFilters = null, this._bounds = new Ls(), this._localBounds = null, this._boundsID = 0, this._boundsRect = null, this._localBoundsRect = null, this._mask = null, this._maskRefCount = 0, this._destroyed = !1, this.isSprite = !1, this.isMask = !1;
  }
  /**
   * Mixes all enumerable properties and methods from a source object to DisplayObject.
   * @param source - The source of properties and methods to mix in.
   */
  static mixin(t) {
    const e = Object.keys(t);
    for (let i = 0; i < e.length; ++i) {
      const s = e[i];
      Object.defineProperty(
        Et.prototype,
        s,
        Object.getOwnPropertyDescriptor(t, s)
      );
    }
  }
  /**
   * Fired when this DisplayObject is added to a Container.
   * @instance
   * @event added
   * @param {PIXI.Container} container - The container added to.
   */
  /**
   * Fired when this DisplayObject is removed from a Container.
   * @instance
   * @event removed
   * @param {PIXI.Container} container - The container removed from.
   */
  /**
   * Fired when this DisplayObject is destroyed. This event is emitted once
   * destroy is finished.
   * @instance
   * @event destroyed
   */
  /** Readonly flag for destroyed display objects. */
  get destroyed() {
    return this._destroyed;
  }
  /** Recursively updates transform of all objects from the root to this one internal function for toLocal() */
  _recursivePostUpdateTransform() {
    this.parent ? (this.parent._recursivePostUpdateTransform(), this.transform.updateTransform(this.parent.transform)) : this.transform.updateTransform(this._tempDisplayObjectParent.transform);
  }
  /** Updates the object transform for rendering. TODO - Optimization pass! */
  updateTransform() {
    this._boundsID++, this.transform.updateTransform(this.parent.transform), this.worldAlpha = this.alpha * this.parent.worldAlpha;
  }
  /**
   * Calculates and returns the (world) bounds of the display object as a [Rectangle]{@link PIXI.Rectangle}.
   *
   * This method is expensive on containers with a large subtree (like the stage). This is because the bounds
   * of a container depend on its children's bounds, which recursively causes all bounds in the subtree to
   * be recalculated. The upside, however, is that calling `getBounds` once on a container will indeed update
   * the bounds of all children (the whole subtree, in fact). This side effect should be exploited by using
   * `displayObject._bounds.getRectangle()` when traversing through all the bounds in a scene graph. Otherwise,
   * calling `getBounds` on each object in a subtree will cause the total cost to increase quadratically as
   * its height increases.
   *
   * The transforms of all objects in a container's **subtree** and of all **ancestors** are updated.
   * The world bounds of all display objects in a container's **subtree** will also be recalculated.
   *
   * The `_bounds` object stores the last calculation of the bounds. You can use to entirely skip bounds
   * calculation if needed.
   *
   * ```js
   * const lastCalculatedBounds = displayObject._bounds.getRectangle(optionalRect);
   * ```
   *
   * Do know that usage of `getLocalBounds` can corrupt the `_bounds` of children (the whole subtree, actually). This
   * is a known issue that has not been solved. See [getLocalBounds]{@link PIXI.DisplayObject#getLocalBounds} for more
   * details.
   *
   * `getBounds` should be called with `skipUpdate` equal to `true` in a render() call. This is because the transforms
   * are guaranteed to be update-to-date. In fact, recalculating inside a render() call may cause corruption in certain
   * cases.
   * @param skipUpdate - Setting to `true` will stop the transforms of the scene graph from
   *  being updated. This means the calculation returned MAY be out of date BUT will give you a
   *  nice performance boost.
   * @param rect - Optional rectangle to store the result of the bounds calculation.
   * @returns - The minimum axis-aligned rectangle in world space that fits around this object.
   */
  getBounds(t, e) {
    return t || (this.parent ? (this._recursivePostUpdateTransform(), this.updateTransform()) : (this.parent = this._tempDisplayObjectParent, this.updateTransform(), this.parent = null)), this._bounds.updateID !== this._boundsID && (this.calculateBounds(), this._bounds.updateID = this._boundsID), e || (this._boundsRect || (this._boundsRect = new tt()), e = this._boundsRect), this._bounds.getRectangle(e);
  }
  /**
   * Retrieves the local bounds of the displayObject as a rectangle object.
   * @param rect - Optional rectangle to store the result of the bounds calculation.
   * @returns - The rectangular bounding area.
   */
  getLocalBounds(t) {
    t || (this._localBoundsRect || (this._localBoundsRect = new tt()), t = this._localBoundsRect), this._localBounds || (this._localBounds = new Ls());
    const e = this.transform, i = this.parent;
    this.parent = null, this._tempDisplayObjectParent.worldAlpha = (i == null ? void 0 : i.worldAlpha) ?? 1, this.transform = this._tempDisplayObjectParent.transform;
    const s = this._bounds, n = this._boundsID;
    this._bounds = this._localBounds;
    const o = this.getBounds(!1, t);
    return this.parent = i, this.transform = e, this._bounds = s, this._bounds.updateID += this._boundsID - n, o;
  }
  /**
   * Calculates the global position of the display object.
   * @param position - The world origin to calculate from.
   * @param point - A Point object in which to store the value, optional
   *  (otherwise will create a new Point).
   * @param skipUpdate - Should we skip the update transform.
   * @returns - A point object representing the position of this object.
   */
  toGlobal(t, e, i = !1) {
    return i || (this._recursivePostUpdateTransform(), this.parent ? this.displayObjectUpdateTransform() : (this.parent = this._tempDisplayObjectParent, this.displayObjectUpdateTransform(), this.parent = null)), this.worldTransform.apply(t, e);
  }
  /**
   * Calculates the local position of the display object relative to another point.
   * @param position - The world origin to calculate from.
   * @param from - The DisplayObject to calculate the global position from.
   * @param point - A Point object in which to store the value, optional
   *  (otherwise will create a new Point).
   * @param skipUpdate - Should we skip the update transform
   * @returns - A point object representing the position of this object
   */
  toLocal(t, e, i, s) {
    return e && (t = e.toGlobal(t, i, s)), s || (this._recursivePostUpdateTransform(), this.parent ? this.displayObjectUpdateTransform() : (this.parent = this._tempDisplayObjectParent, this.displayObjectUpdateTransform(), this.parent = null)), this.worldTransform.applyInverse(t, i);
  }
  /**
   * Set the parent Container of this DisplayObject.
   * @param container - The Container to add this DisplayObject to.
   * @returns - The Container that this DisplayObject was added to.
   */
  setParent(t) {
    if (!t || !t.addChild)
      throw new Error("setParent: Argument must be a Container");
    return t.addChild(this), t;
  }
  /** Remove the DisplayObject from its parent Container. If the DisplayObject has no parent, do nothing. */
  removeFromParent() {
    var t;
    (t = this.parent) == null || t.removeChild(this);
  }
  /**
   * Convenience function to set the position, scale, skew and pivot at once.
   * @param x - The X position
   * @param y - The Y position
   * @param scaleX - The X scale value
   * @param scaleY - The Y scale value
   * @param rotation - The rotation
   * @param skewX - The X skew value
   * @param skewY - The Y skew value
   * @param pivotX - The X pivot value
   * @param pivotY - The Y pivot value
   * @returns - The DisplayObject instance
   */
  setTransform(t = 0, e = 0, i = 1, s = 1, n = 0, o = 0, a = 0, h = 0, l = 0) {
    return this.position.x = t, this.position.y = e, this.scale.x = i || 1, this.scale.y = s || 1, this.rotation = n, this.skew.x = o, this.skew.y = a, this.pivot.x = h, this.pivot.y = l, this;
  }
  /**
   * Base destroy method for generic display objects. This will automatically
   * remove the display object from its parent Container as well as remove
   * all current event listeners and internal references. Do not use a DisplayObject
   * after calling `destroy()`.
   * @param _options
   */
  destroy(t) {
    this.removeFromParent(), this._destroyed = !0, this.transform = null, this.parent = null, this._bounds = null, this.mask = null, this.cullArea = null, this.filters = null, this.filterArea = null, this.hitArea = null, this.eventMode = "auto", this.interactiveChildren = !1, this.emit("destroyed"), this.removeAllListeners();
  }
  /**
   * @protected
   * @member {PIXI.Container}
   */
  get _tempDisplayObjectParent() {
    return this.tempDisplayObjectParent === null && (this.tempDisplayObjectParent = new e0()), this.tempDisplayObjectParent;
  }
  /**
   * Used in Renderer, cacheAsBitmap and other places where you call an `updateTransform` on root.
   *
   * ```js
   * const cacheParent = elem.enableTempParent();
   * elem.updateTransform();
   * elem.disableTempParent(cacheParent);
   * ```
   * @returns - Current parent
   */
  enableTempParent() {
    const t = this.parent;
    return this.parent = this._tempDisplayObjectParent, t;
  }
  /**
   * Pair method for `enableTempParent`
   * @param cacheParent - Actual parent of element
   */
  disableTempParent(t) {
    this.parent = t;
  }
  /**
   * The position of the displayObject on the x axis relative to the local coordinates of the parent.
   * An alias to position.x
   */
  get x() {
    return this.position.x;
  }
  set x(t) {
    this.transform.position.x = t;
  }
  /**
   * The position of the displayObject on the y axis relative to the local coordinates of the parent.
   * An alias to position.y
   */
  get y() {
    return this.position.y;
  }
  set y(t) {
    this.transform.position.y = t;
  }
  /**
   * Current transform of the object based on world (parent) factors.
   * @readonly
   */
  get worldTransform() {
    return this.transform.worldTransform;
  }
  /**
   * Current transform of the object based on local factors: position, scale, other stuff.
   * @readonly
   */
  get localTransform() {
    return this.transform.localTransform;
  }
  /**
   * The coordinate of the object relative to the local coordinates of the parent.
   * @since 4.0.0
   */
  get position() {
    return this.transform.position;
  }
  set position(t) {
    this.transform.position.copyFrom(t);
  }
  /**
   * The scale factors of this object along the local coordinate axes.
   *
   * The default scale is (1, 1).
   * @since 4.0.0
   */
  get scale() {
    return this.transform.scale;
  }
  set scale(t) {
    this.transform.scale.copyFrom(t);
  }
  /**
   * The center of rotation, scaling, and skewing for this display object in its local space. The `position`
   * is the projection of `pivot` in the parent's local space.
   *
   * By default, the pivot is the origin (0, 0).
   * @since 4.0.0
   */
  get pivot() {
    return this.transform.pivot;
  }
  set pivot(t) {
    this.transform.pivot.copyFrom(t);
  }
  /**
   * The skew factor for the object in radians.
   * @since 4.0.0
   */
  get skew() {
    return this.transform.skew;
  }
  set skew(t) {
    this.transform.skew.copyFrom(t);
  }
  /**
   * The rotation of the object in radians.
   * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
   */
  get rotation() {
    return this.transform.rotation;
  }
  set rotation(t) {
    this.transform.rotation = t;
  }
  /**
   * The angle of the object in degrees.
   * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
   */
  get angle() {
    return this.transform.rotation * qm;
  }
  set angle(t) {
    this.transform.rotation = t * Km;
  }
  /**
   * The zIndex of the displayObject.
   *
   * If a container has the sortableChildren property set to true, children will be automatically
   * sorted by zIndex value; a higher value will mean it will be moved towards the end of the array,
   * and thus rendered on top of other display objects within the same container.
   * @see PIXI.Container#sortableChildren
   */
  get zIndex() {
    return this._zIndex;
  }
  set zIndex(t) {
    this._zIndex !== t && (this._zIndex = t, this.parent && (this.parent.sortDirty = !0));
  }
  /**
   * Indicates if the object is globally visible.
   * @readonly
   */
  get worldVisible() {
    let t = this;
    do {
      if (!t.visible)
        return !1;
      t = t.parent;
    } while (t);
    return !0;
  }
  /**
   * Sets a mask for the displayObject. A mask is an object that limits the visibility of an
   * object to the shape of the mask applied to it. In PixiJS a regular mask must be a
   * {@link PIXI.Graphics} or a {@link PIXI.Sprite} object. This allows for much faster masking in canvas as it
   * utilities shape clipping. Furthermore, a mask of an object must be in the subtree of its parent.
   * Otherwise, `getLocalBounds` may calculate incorrect bounds, which makes the container's width and height wrong.
   * To remove a mask, set this property to `null`.
   *
   * For sprite mask both alpha and red channel are used. Black mask is the same as transparent mask.
   * @example
   * import { Graphics, Sprite } from 'pixi.js';
   *
   * const graphics = new Graphics();
   * graphics.beginFill(0xFF3300);
   * graphics.drawRect(50, 250, 100, 100);
   * graphics.endFill();
   *
   * const sprite = new Sprite(texture);
   * sprite.mask = graphics;
   * @todo At the moment, CanvasRenderer doesn't support Sprite as mask.
   */
  get mask() {
    return this._mask;
  }
  set mask(t) {
    if (this._mask !== t) {
      if (this._mask) {
        const e = this._mask.isMaskData ? this._mask.maskObject : this._mask;
        e && (e._maskRefCount--, e._maskRefCount === 0 && (e.renderable = !0, e.isMask = !1));
      }
      if (this._mask = t, this._mask) {
        const e = this._mask.isMaskData ? this._mask.maskObject : this._mask;
        e && (e._maskRefCount === 0 && (e.renderable = !1, e.isMask = !0), e._maskRefCount++);
      }
    }
  }
}
class e0 extends Et {
  constructor() {
    super(...arguments), this.sortDirty = null;
  }
}
Et.prototype.displayObjectUpdateTransform = Et.prototype.updateTransform;
const r0 = new yt();
function i0(r, t) {
  return r.zIndex === t.zIndex ? r._lastSortedIndex - t._lastSortedIndex : r.zIndex - t.zIndex;
}
const eu = class Bo extends Et {
  constructor() {
    super(), this.children = [], this.sortableChildren = Bo.defaultSortableChildren, this.sortDirty = !1;
  }
  /**
   * Overridable method that can be used by Container subclasses whenever the children array is modified.
   * @param _length
   */
  onChildrenChange(t) {
  }
  /**
   * Adds one or more children to the container.
   *
   * Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
   * @param {...PIXI.DisplayObject} children - The DisplayObject(s) to add to the container
   * @returns {PIXI.DisplayObject} - The first child that was added.
   */
  addChild(...t) {
    if (t.length > 1)
      for (let e = 0; e < t.length; e++)
        this.addChild(t[e]);
    else {
      const e = t[0];
      e.parent && e.parent.removeChild(e), e.parent = this, this.sortDirty = !0, e.transform._parentID = -1, this.children.push(e), this._boundsID++, this.onChildrenChange(this.children.length - 1), this.emit("childAdded", e, this, this.children.length - 1), e.emit("added", this);
    }
    return t[0];
  }
  /**
   * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown.
   * If the child is already in this container, it will be moved to the specified index.
   * @param {PIXI.DisplayObject} child - The child to add.
   * @param {number} index - The absolute index where the child will be positioned at the end of the operation.
   * @returns {PIXI.DisplayObject} The child that was added.
   */
  addChildAt(t, e) {
    if (e < 0 || e > this.children.length)
      throw new Error(`${t}addChildAt: The index ${e} supplied is out of bounds ${this.children.length}`);
    return t.parent && t.parent.removeChild(t), t.parent = this, this.sortDirty = !0, t.transform._parentID = -1, this.children.splice(e, 0, t), this._boundsID++, this.onChildrenChange(e), t.emit("added", this), this.emit("childAdded", t, this, e), t;
  }
  /**
   * Swaps the position of 2 Display Objects within this container.
   * @param child - First display object to swap
   * @param child2 - Second display object to swap
   */
  swapChildren(t, e) {
    if (t === e)
      return;
    const i = this.getChildIndex(t), s = this.getChildIndex(e);
    this.children[i] = e, this.children[s] = t, this.onChildrenChange(i < s ? i : s);
  }
  /**
   * Returns the index position of a child DisplayObject instance
   * @param child - The DisplayObject instance to identify
   * @returns - The index position of the child display object to identify
   */
  getChildIndex(t) {
    const e = this.children.indexOf(t);
    if (e === -1)
      throw new Error("The supplied DisplayObject must be a child of the caller");
    return e;
  }
  /**
   * Changes the position of an existing child in the display object container
   * @param child - The child DisplayObject instance for which you want to change the index number
   * @param index - The resulting index number for the child display object
   */
  setChildIndex(t, e) {
    if (e < 0 || e >= this.children.length)
      throw new Error(`The index ${e} supplied is out of bounds ${this.children.length}`);
    const i = this.getChildIndex(t);
    Yr(this.children, i, 1), this.children.splice(e, 0, t), this.onChildrenChange(e);
  }
  /**
   * Returns the child at the specified index
   * @param index - The index to get the child at
   * @returns - The child at the given index, if any.
   */
  getChildAt(t) {
    if (t < 0 || t >= this.children.length)
      throw new Error(`getChildAt: Index (${t}) does not exist.`);
    return this.children[t];
  }
  /**
   * Removes one or more children from the container.
   * @param {...PIXI.DisplayObject} children - The DisplayObject(s) to remove
   * @returns {PIXI.DisplayObject} The first child that was removed.
   */
  removeChild(...t) {
    if (t.length > 1)
      for (let e = 0; e < t.length; e++)
        this.removeChild(t[e]);
    else {
      const e = t[0], i = this.children.indexOf(e);
      if (i === -1)
        return null;
      e.parent = null, e.transform._parentID = -1, Yr(this.children, i, 1), this._boundsID++, this.onChildrenChange(i), e.emit("removed", this), this.emit("childRemoved", e, this, i);
    }
    return t[0];
  }
  /**
   * Removes a child from the specified index position.
   * @param index - The index to get the child from
   * @returns The child that was removed.
   */
  removeChildAt(t) {
    const e = this.getChildAt(t);
    return e.parent = null, e.transform._parentID = -1, Yr(this.children, t, 1), this._boundsID++, this.onChildrenChange(t), e.emit("removed", this), this.emit("childRemoved", e, this, t), e;
  }
  /**
   * Removes all children from this container that are within the begin and end indexes.
   * @param beginIndex - The beginning position.
   * @param endIndex - The ending position. Default value is size of the container.
   * @returns - List of removed children
   */
  removeChildren(t = 0, e = this.children.length) {
    const i = t, s = e, n = s - i;
    let o;
    if (n > 0 && n <= s) {
      o = this.children.splice(i, n);
      for (let a = 0; a < o.length; ++a)
        o[a].parent = null, o[a].transform && (o[a].transform._parentID = -1);
      this._boundsID++, this.onChildrenChange(t);
      for (let a = 0; a < o.length; ++a)
        o[a].emit("removed", this), this.emit("childRemoved", o[a], this, a);
      return o;
    } else if (n === 0 && this.children.length === 0)
      return [];
    throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
  }
  /** Sorts children by zIndex. Previous order is maintained for 2 children with the same zIndex. */
  sortChildren() {
    let t = !1;
    for (let e = 0, i = this.children.length; e < i; ++e) {
      const s = this.children[e];
      s._lastSortedIndex = e, !t && s.zIndex !== 0 && (t = !0);
    }
    t && this.children.length > 1 && this.children.sort(i0), this.sortDirty = !1;
  }
  /** Updates the transform on all children of this container for rendering. */
  updateTransform() {
    this.sortableChildren && this.sortDirty && this.sortChildren(), this._boundsID++, this.transform.updateTransform(this.parent.transform), this.worldAlpha = this.alpha * this.parent.worldAlpha;
    for (let t = 0, e = this.children.length; t < e; ++t) {
      const i = this.children[t];
      i.visible && i.updateTransform();
    }
  }
  /**
   * Recalculates the bounds of the container.
   *
   * This implementation will automatically fit the children's bounds into the calculation. Each child's bounds
   * is limited to its mask's bounds or filterArea, if any is applied.
   */
  calculateBounds() {
    this._bounds.clear(), this._calculateBounds();
    for (let t = 0; t < this.children.length; t++) {
      const e = this.children[t];
      if (!(!e.visible || !e.renderable))
        if (e.calculateBounds(), e._mask) {
          const i = e._mask.isMaskData ? e._mask.maskObject : e._mask;
          i ? (i.calculateBounds(), this._bounds.addBoundsMask(e._bounds, i._bounds)) : this._bounds.addBounds(e._bounds);
        } else
          e.filterArea ? this._bounds.addBoundsArea(e._bounds, e.filterArea) : this._bounds.addBounds(e._bounds);
    }
    this._bounds.updateID = this._boundsID;
  }
  /**
   * Retrieves the local bounds of the displayObject as a rectangle object.
   *
   * Calling `getLocalBounds` may invalidate the `_bounds` of the whole subtree below. If using it inside a render()
   * call, it is advised to call `getBounds()` immediately after to recalculate the world bounds of the subtree.
   * @param rect - Optional rectangle to store the result of the bounds calculation.
   * @param skipChildrenUpdate - Setting to `true` will stop re-calculation of children transforms,
   *  it was default behaviour of pixi 4.0-5.2 and caused many problems to users.
   * @returns - The rectangular bounding area.
   */
  getLocalBounds(t, e = !1) {
    const i = super.getLocalBounds(t);
    if (!e)
      for (let s = 0, n = this.children.length; s < n; ++s) {
        const o = this.children[s];
        o.visible && o.updateTransform();
      }
    return i;
  }
  /**
   * Recalculates the content bounds of this object. This should be overriden to
   * calculate the bounds of this specific object (not including children).
   * @protected
   */
  _calculateBounds() {
  }
  /**
   * Renders this object and its children with culling.
   * @protected
   * @param {PIXI.Renderer} renderer - The renderer
   */
  _renderWithCulling(t) {
    const e = t.renderTexture.sourceFrame;
    if (!(e.width > 0 && e.height > 0))
      return;
    let i, s;
    this.cullArea ? (i = this.cullArea, s = this.worldTransform) : this._render !== Bo.prototype._render && (i = this.getBounds(!0));
    const n = t.projection.transform;
    if (n && (s ? (s = r0.copyFrom(s), s.prepend(n)) : s = n), i && e.intersects(i, s))
      this._render(t);
    else if (this.cullArea)
      return;
    for (let o = 0, a = this.children.length; o < a; ++o) {
      const h = this.children[o], l = h.cullable;
      h.cullable = l || !this.cullArea, h.render(t), h.cullable = l;
    }
  }
  /**
   * Renders the object using the WebGL renderer.
   *
   * The [_render]{@link PIXI.Container#_render} method is be overriden for rendering the contents of the
   * container itself. This `render` method will invoke it, and also invoke the `render` methods of all
   * children afterward.
   *
   * If `renderable` or `visible` is false or if `worldAlpha` is not positive or if `cullable` is true and
   * the bounds of this object are out of frame, this implementation will entirely skip rendering.
   * See {@link PIXI.DisplayObject} for choosing between `renderable` or `visible`. Generally,
   * setting alpha to zero is not recommended for purely skipping rendering.
   *
   * When your scene becomes large (especially when it is larger than can be viewed in a single screen), it is
   * advised to employ **culling** to automatically skip rendering objects outside of the current screen.
   * See [cullable]{@link PIXI.DisplayObject#cullable} and [cullArea]{@link PIXI.DisplayObject#cullArea}.
   * Other culling methods might be better suited for a large number static objects; see
   * [@pixi-essentials/cull]{@link https://www.npmjs.com/package/@pixi-essentials/cull} and
   * [pixi-cull]{@link https://www.npmjs.com/package/pixi-cull}.
   *
   * The [renderAdvanced]{@link PIXI.Container#renderAdvanced} method is internally used when when masking or
   * filtering is applied on a container. This does, however, break batching and can affect performance when
   * masking and filtering is applied extensively throughout the scene graph.
   * @param renderer - The renderer
   */
  render(t) {
    var e;
    if (!(!this.visible || this.worldAlpha <= 0 || !this.renderable))
      if (this._mask || (e = this.filters) != null && e.length)
        this.renderAdvanced(t);
      else if (this.cullable)
        this._renderWithCulling(t);
      else {
        this._render(t);
        for (let i = 0, s = this.children.length; i < s; ++i)
          this.children[i].render(t);
      }
  }
  /**
   * Render the object using the WebGL renderer and advanced features.
   * @param renderer - The renderer
   */
  renderAdvanced(t) {
    var n, o, a;
    const e = this.filters, i = this._mask;
    if (e) {
      this._enabledFilters || (this._enabledFilters = []), this._enabledFilters.length = 0;
      for (let h = 0; h < e.length; h++)
        e[h].enabled && this._enabledFilters.push(e[h]);
    }
    const s = e && ((n = this._enabledFilters) == null ? void 0 : n.length) || i && (!i.isMaskData || i.enabled && (i.autoDetect || i.type !== Ct.NONE));
    if (s && t.batch.flush(), e && ((o = this._enabledFilters) != null && o.length) && t.filter.push(this, this._enabledFilters), i && t.mask.push(this, this._mask), this.cullable)
      this._renderWithCulling(t);
    else {
      this._render(t);
      for (let h = 0, l = this.children.length; h < l; ++h)
        this.children[h].render(t);
    }
    s && t.batch.flush(), i && t.mask.pop(this), e && ((a = this._enabledFilters) != null && a.length) && t.filter.pop();
  }
  /**
   * To be overridden by the subclasses.
   * @param _renderer - The renderer
   */
  _render(t) {
  }
  /**
   * Removes all internal references and listeners as well as removes children from the display list.
   * Do not use a Container after calling `destroy`.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
   *  method called as well. 'options' will be passed on to those calls.
   * @param {boolean} [options.texture=false] - Only used for child Sprites if options.children is set to true
   *  Should it destroy the texture of the child sprite
   * @param {boolean} [options.baseTexture=false] - Only used for child Sprites if options.children is set to true
   *  Should it destroy the base texture of the child sprite
   */
  destroy(t) {
    super.destroy(), this.sortDirty = !1;
    const e = typeof t == "boolean" ? t : t == null ? void 0 : t.children, i = this.removeChildren(0, this.children.length);
    if (e)
      for (let s = 0; s < i.length; ++s)
        i[s].destroy(t);
  }
  /** The width of the Container, setting this will actually modify the scale to achieve the value set. */
  get width() {
    return this.scale.x * this.getLocalBounds().width;
  }
  set width(t) {
    const e = this.getLocalBounds().width;
    e !== 0 ? this.scale.x = t / e : this.scale.x = 1, this._width = t;
  }
  /** The height of the Container, setting this will actually modify the scale to achieve the value set. */
  get height() {
    return this.scale.y * this.getLocalBounds().height;
  }
  set height(t) {
    const e = this.getLocalBounds().height;
    e !== 0 ? this.scale.y = t / e : this.scale.y = 1, this._height = t;
  }
};
eu.defaultSortableChildren = !1;
let de = eu;
de.prototype.containerUpdateTransform = de.prototype.updateTransform;
Object.defineProperties(H, {
  /**
   * Sets the default value for the container property 'sortableChildren'.
   * @static
   * @name SORTABLE_CHILDREN
   * @memberof PIXI.settings
   * @deprecated since 7.1.0
   * @type {boolean}
   * @see PIXI.Container.defaultSortableChildren
   */
  SORTABLE_CHILDREN: {
    get() {
      return de.defaultSortableChildren;
    },
    set(r) {
      it("7.1.0", "settings.SORTABLE_CHILDREN is deprecated, use Container.defaultSortableChildren"), de.defaultSortableChildren = r;
    }
  }
});
const li = new lt(), s0 = new Uint16Array([0, 1, 2, 0, 2, 3]);
class ii extends de {
  /** @param texture - The texture for this sprite. */
  constructor(t) {
    super(), this._anchor = new Be(
      this._onAnchorUpdate,
      this,
      t ? t.defaultAnchor.x : 0,
      t ? t.defaultAnchor.y : 0
    ), this._texture = null, this._width = 0, this._height = 0, this._tintColor = new pt(16777215), this._tintRGB = null, this.tint = 16777215, this.blendMode = K.NORMAL, this._cachedTint = 16777215, this.uvs = null, this.texture = t || j.EMPTY, this.vertexData = new Float32Array(8), this.vertexTrimmedData = null, this._transformID = -1, this._textureID = -1, this._transformTrimmedID = -1, this._textureTrimmedID = -1, this.indices = s0, this.pluginName = "batch", this.isSprite = !0, this._roundPixels = H.ROUND_PIXELS;
  }
  /** When the texture is updated, this event will fire to update the scale and frame. */
  _onTextureUpdate() {
    this._textureID = -1, this._textureTrimmedID = -1, this._cachedTint = 16777215, this._width && (this.scale.x = je(this.scale.x) * this._width / this._texture.orig.width), this._height && (this.scale.y = je(this.scale.y) * this._height / this._texture.orig.height);
  }
  /** Called when the anchor position updates. */
  _onAnchorUpdate() {
    this._transformID = -1, this._transformTrimmedID = -1;
  }
  /** Calculates worldTransform * vertices, store it in vertexData. */
  calculateVertices() {
    const t = this._texture;
    if (this._transformID === this.transform._worldID && this._textureID === t._updateID)
      return;
    this._textureID !== t._updateID && (this.uvs = this._texture._uvs.uvsFloat32), this._transformID = this.transform._worldID, this._textureID = t._updateID;
    const e = this.transform.worldTransform, i = e.a, s = e.b, n = e.c, o = e.d, a = e.tx, h = e.ty, l = this.vertexData, c = t.trim, u = t.orig, d = this._anchor;
    let f = 0, p = 0, m = 0, g = 0;
    if (c ? (p = c.x - d._x * u.width, f = p + c.width, g = c.y - d._y * u.height, m = g + c.height) : (p = -d._x * u.width, f = p + u.width, g = -d._y * u.height, m = g + u.height), l[0] = i * p + n * g + a, l[1] = o * g + s * p + h, l[2] = i * f + n * g + a, l[3] = o * g + s * f + h, l[4] = i * f + n * m + a, l[5] = o * m + s * f + h, l[6] = i * p + n * m + a, l[7] = o * m + s * p + h, this._roundPixels) {
      const y = H.RESOLUTION;
      for (let v = 0; v < l.length; ++v)
        l[v] = Math.round(l[v] * y) / y;
    }
  }
  /**
   * Calculates worldTransform * vertices for a non texture with a trim. store it in vertexTrimmedData.
   *
   * This is used to ensure that the true width and height of a trimmed texture is respected.
   */
  calculateTrimmedVertices() {
    if (!this.vertexTrimmedData)
      this.vertexTrimmedData = new Float32Array(8);
    else if (this._transformTrimmedID === this.transform._worldID && this._textureTrimmedID === this._texture._updateID)
      return;
    this._transformTrimmedID = this.transform._worldID, this._textureTrimmedID = this._texture._updateID;
    const t = this._texture, e = this.vertexTrimmedData, i = t.orig, s = this._anchor, n = this.transform.worldTransform, o = n.a, a = n.b, h = n.c, l = n.d, c = n.tx, u = n.ty, d = -s._x * i.width, f = d + i.width, p = -s._y * i.height, m = p + i.height;
    if (e[0] = o * d + h * p + c, e[1] = l * p + a * d + u, e[2] = o * f + h * p + c, e[3] = l * p + a * f + u, e[4] = o * f + h * m + c, e[5] = l * m + a * f + u, e[6] = o * d + h * m + c, e[7] = l * m + a * d + u, this._roundPixels) {
      const g = H.RESOLUTION;
      for (let y = 0; y < e.length; ++y)
        e[y] = Math.round(e[y] * g) / g;
    }
  }
  /**
   *
   * Renders the object using the WebGL renderer
   * @param renderer - The webgl renderer to use.
   */
  _render(t) {
    this.calculateVertices(), t.batch.setObjectRenderer(t.plugins[this.pluginName]), t.plugins[this.pluginName].render(this);
  }
  /** Updates the bounds of the sprite. */
  _calculateBounds() {
    const t = this._texture.trim, e = this._texture.orig;
    !t || t.width === e.width && t.height === e.height ? (this.calculateVertices(), this._bounds.addQuad(this.vertexData)) : (this.calculateTrimmedVertices(), this._bounds.addQuad(this.vertexTrimmedData));
  }
  /**
   * Gets the local bounds of the sprite object.
   * @param rect - Optional output rectangle.
   * @returns The bounds.
   */
  getLocalBounds(t) {
    return this.children.length === 0 ? (this._localBounds || (this._localBounds = new Ls()), this._localBounds.minX = this._texture.orig.width * -this._anchor._x, this._localBounds.minY = this._texture.orig.height * -this._anchor._y, this._localBounds.maxX = this._texture.orig.width * (1 - this._anchor._x), this._localBounds.maxY = this._texture.orig.height * (1 - this._anchor._y), t || (this._localBoundsRect || (this._localBoundsRect = new tt()), t = this._localBoundsRect), this._localBounds.getRectangle(t)) : super.getLocalBounds.call(this, t);
  }
  /**
   * Tests if a point is inside this sprite
   * @param point - the point to test
   * @returns The result of the test
   */
  containsPoint(t) {
    this.worldTransform.applyInverse(t, li);
    const e = this._texture.orig.width, i = this._texture.orig.height, s = -e * this.anchor.x;
    let n = 0;
    return li.x >= s && li.x < s + e && (n = -i * this.anchor.y, li.y >= n && li.y < n + i);
  }
  /**
   * Destroys this sprite and optionally its texture and children.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param [options.children=false] - if set to true, all the children will have their destroy
   *      method called as well. 'options' will be passed on to those calls.
   * @param [options.texture=false] - Should it destroy the current texture of the sprite as well
   * @param [options.baseTexture=false] - Should it destroy the base texture of the sprite as well
   */
  destroy(t) {
    if (super.destroy(t), this._texture.off("update", this._onTextureUpdate, this), this._anchor = null, typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const e = typeof t == "boolean" ? t : t == null ? void 0 : t.baseTexture;
      this._texture.destroy(!!e);
    }
    this._texture = null;
  }
  // some helper functions..
  /**
   * Helper function that creates a new sprite based on the source you provide.
   * The source can be - frame id, image url, video url, canvas element, video element, base texture
   * @param {string|PIXI.Texture|HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas} source
   *     - Source to create texture from
   * @param {object} [options] - See {@link PIXI.BaseTexture}'s constructor for options.
   * @returns The newly created sprite
   */
  static from(t, e) {
    const i = t instanceof j ? t : j.from(t, e);
    return new ii(i);
  }
  /**
   * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
   *
   * Advantages can include sharper image quality (like text) and faster rendering on canvas.
   * The main disadvantage is movement of objects may appear less smooth.
   *
   * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}.
   * @default false
   */
  set roundPixels(t) {
    this._roundPixels !== t && (this._transformID = -1, this._transformTrimmedID = -1), this._roundPixels = t;
  }
  get roundPixels() {
    return this._roundPixels;
  }
  /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
  get width() {
    return Math.abs(this.scale.x) * this._texture.orig.width;
  }
  set width(t) {
    const e = je(this.scale.x) || 1;
    this.scale.x = e * t / this._texture.orig.width, this._width = t;
  }
  /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
  get height() {
    return Math.abs(this.scale.y) * this._texture.orig.height;
  }
  set height(t) {
    const e = je(this.scale.y) || 1;
    this.scale.y = e * t / this._texture.orig.height, this._height = t;
  }
  /**
   * The anchor sets the origin point of the sprite. The default value is taken from the {@link PIXI.Texture|Texture}
   * and passed to the constructor.
   *
   * The default is `(0,0)`, this means the sprite's origin is the top left.
   *
   * Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
   *
   * Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
   *
   * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
   * @example
   * import { Sprite } from 'pixi.js';
   *
   * const sprite = new Sprite(Texture.WHITE);
   * sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(t) {
    this._anchor.copyFrom(t);
  }
  /**
   * The tint applied to the sprite. This is a hex value.
   *
   * A value of 0xFFFFFF will remove any tint effect.
   * @default 0xFFFFFF
   */
  get tint() {
    return this._tintColor.value;
  }
  set tint(t) {
    this._tintColor.setValue(t), this._tintRGB = this._tintColor.toLittleEndianNumber();
  }
  /**
   * Get the tint as a RGB integer.
   * @ignore
   */
  get tintValue() {
    return this._tintColor.toNumber();
  }
  /** The texture that the sprite is using. */
  get texture() {
    return this._texture;
  }
  set texture(t) {
    this._texture !== t && (this._texture && this._texture.off("update", this._onTextureUpdate, this), this._texture = t || j.EMPTY, this._cachedTint = 16777215, this._textureID = -1, this._textureTrimmedID = -1, t && (t.baseTexture.valid ? this._onTextureUpdate() : t.once("update", this._onTextureUpdate, this)));
  }
}
const ru = new yt();
Et.prototype._cacheAsBitmap = !1;
Et.prototype._cacheData = null;
Et.prototype._cacheAsBitmapResolution = null;
Et.prototype._cacheAsBitmapMultisample = null;
class n0 {
  constructor() {
    this.textureCacheId = null, this.originalRender = null, this.originalRenderCanvas = null, this.originalCalculateBounds = null, this.originalGetLocalBounds = null, this.originalUpdateTransform = null, this.originalDestroy = null, this.originalMask = null, this.originalFilterArea = null, this.originalContainsPoint = null, this.sprite = null;
  }
}
Object.defineProperties(Et.prototype, {
  /**
   * The resolution to use for cacheAsBitmap. By default this will use the renderer's resolution
   * but can be overriden for performance. Lower values will reduce memory usage at the expense
   * of render quality. A falsey value of `null` or `0` will default to the renderer's resolution.
   * If `cacheAsBitmap` is set to `true`, this will re-render with the new resolution.
   * @member {number|null} cacheAsBitmapResolution
   * @memberof PIXI.DisplayObject#
   * @default null
   */
  cacheAsBitmapResolution: {
    get() {
      return this._cacheAsBitmapResolution;
    },
    set(r) {
      r !== this._cacheAsBitmapResolution && (this._cacheAsBitmapResolution = r, this.cacheAsBitmap && (this.cacheAsBitmap = !1, this.cacheAsBitmap = !0));
    }
  },
  /**
   * The number of samples to use for cacheAsBitmap. If set to `null`, the renderer's
   * sample count is used.
   * If `cacheAsBitmap` is set to `true`, this will re-render with the new number of samples.
   * @member {number|null} cacheAsBitmapMultisample
   * @memberof PIXI.DisplayObject#
   * @default null
   */
  cacheAsBitmapMultisample: {
    get() {
      return this._cacheAsBitmapMultisample;
    },
    set(r) {
      r !== this._cacheAsBitmapMultisample && (this._cacheAsBitmapMultisample = r, this.cacheAsBitmap && (this.cacheAsBitmap = !1, this.cacheAsBitmap = !0));
    }
  },
  /**
   * Set this to true if you want this display object to be cached as a bitmap.
   * This basically takes a snapshot of the display object as it is at that moment. It can
   * provide a performance benefit for complex static displayObjects.
   * To remove simply set this property to `false`
   *
   * IMPORTANT GOTCHA - Make sure that all your textures are preloaded BEFORE setting this property to true
   * as it will take a snapshot of what is currently there. If the textures have not loaded then they will not appear.
   * @member {boolean}
   * @memberof PIXI.DisplayObject#
   */
  cacheAsBitmap: {
    get() {
      return this._cacheAsBitmap;
    },
    set(r) {
      if (this._cacheAsBitmap === r)
        return;
      this._cacheAsBitmap = r;
      let t;
      r ? (this._cacheData || (this._cacheData = new n0()), t = this._cacheData, t.originalRender = this.render, t.originalRenderCanvas = this.renderCanvas, t.originalUpdateTransform = this.updateTransform, t.originalCalculateBounds = this.calculateBounds, t.originalGetLocalBounds = this.getLocalBounds, t.originalDestroy = this.destroy, t.originalContainsPoint = this.containsPoint, t.originalMask = this._mask, t.originalFilterArea = this.filterArea, this.render = this._renderCached, this.renderCanvas = this._renderCachedCanvas, this.destroy = this._cacheAsBitmapDestroy) : (t = this._cacheData, t.sprite && this._destroyCachedDisplayObject(), this.render = t.originalRender, this.renderCanvas = t.originalRenderCanvas, this.calculateBounds = t.originalCalculateBounds, this.getLocalBounds = t.originalGetLocalBounds, this.destroy = t.originalDestroy, this.updateTransform = t.originalUpdateTransform, this.containsPoint = t.originalContainsPoint, this._mask = t.originalMask, this.filterArea = t.originalFilterArea);
    }
  }
});
Et.prototype._renderCached = function(r) {
  !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObject(r), this._cacheData.sprite.transform._worldID = this.transform._worldID, this._cacheData.sprite.worldAlpha = this.worldAlpha, this._cacheData.sprite._render(r));
};
Et.prototype._initCachedDisplayObject = function(r) {
  var d, f;
  if ((d = this._cacheData) != null && d.sprite)
    return;
  const t = this.alpha;
  this.alpha = 1, r.batch.flush();
  const e = this.getLocalBounds(new tt(), !0);
  if ((f = this.filters) != null && f.length) {
    const p = this.filters[0].padding;
    e.pad(p);
  }
  const i = this.cacheAsBitmapResolution || r.resolution;
  e.ceil(i), e.width = Math.max(e.width, 1 / i), e.height = Math.max(e.height, 1 / i);
  const s = r.renderTexture.current, n = r.renderTexture.sourceFrame.clone(), o = r.renderTexture.destinationFrame.clone(), a = r.projection.transform, h = Sr.create({
    width: e.width,
    height: e.height,
    resolution: i,
    multisample: this.cacheAsBitmapMultisample ?? r.multisample
  }), l = `cacheAsBitmap_${br()}`;
  this._cacheData.textureCacheId = l, J.addToCache(h.baseTexture, l), j.addToCache(h, l);
  const c = this.transform.localTransform.copyTo(ru).invert().translate(-e.x, -e.y);
  this.render = this._cacheData.originalRender, r.render(this, { renderTexture: h, clear: !0, transform: c, skipUpdateTransform: !1 }), r.framebuffer.blit(), r.projection.transform = a, r.renderTexture.bind(s, n, o), this.render = this._renderCached, this.updateTransform = this.displayObjectUpdateTransform, this.calculateBounds = this._calculateCachedBounds, this.getLocalBounds = this._getCachedLocalBounds, this._mask = null, this.filterArea = null, this.alpha = t;
  const u = new ii(h);
  u.transform.worldTransform = this.transform.worldTransform, u.anchor.x = -(e.x / e.width), u.anchor.y = -(e.y / e.height), u.alpha = t, u._bounds = this._bounds, this._cacheData.sprite = u, this.transform._parentID = -1, this.parent ? this.updateTransform() : (this.enableTempParent(), this.updateTransform(), this.disableTempParent(null)), this.containsPoint = u.containsPoint.bind(u);
};
Et.prototype._renderCachedCanvas = function(r) {
  !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObjectCanvas(r), this._cacheData.sprite.worldAlpha = this.worldAlpha, this._cacheData.sprite._renderCanvas(r));
};
Et.prototype._initCachedDisplayObjectCanvas = function(r) {
  var c;
  if ((c = this._cacheData) != null && c.sprite)
    return;
  const t = this.getLocalBounds(new tt(), !0), e = this.alpha;
  this.alpha = 1;
  const i = r.canvasContext.activeContext, s = r._projTransform, n = this.cacheAsBitmapResolution || r.resolution;
  t.ceil(n), t.width = Math.max(t.width, 1 / n), t.height = Math.max(t.height, 1 / n);
  const o = Sr.create({
    width: t.width,
    height: t.height,
    resolution: n
  }), a = `cacheAsBitmap_${br()}`;
  this._cacheData.textureCacheId = a, J.addToCache(o.baseTexture, a), j.addToCache(o, a);
  const h = ru;
  this.transform.localTransform.copyTo(h), h.invert(), h.tx -= t.x, h.ty -= t.y, this.renderCanvas = this._cacheData.originalRenderCanvas, r.render(this, { renderTexture: o, clear: !0, transform: h, skipUpdateTransform: !1 }), r.canvasContext.activeContext = i, r._projTransform = s, this.renderCanvas = this._renderCachedCanvas, this.updateTransform = this.displayObjectUpdateTransform, this.calculateBounds = this._calculateCachedBounds, this.getLocalBounds = this._getCachedLocalBounds, this._mask = null, this.filterArea = null, this.alpha = e;
  const l = new ii(o);
  l.transform.worldTransform = this.transform.worldTransform, l.anchor.x = -(t.x / t.width), l.anchor.y = -(t.y / t.height), l.alpha = e, l._bounds = this._bounds, this._cacheData.sprite = l, this.transform._parentID = -1, this.parent ? this.updateTransform() : (this.parent = r._tempDisplayObjectParent, this.updateTransform(), this.parent = null), this.containsPoint = l.containsPoint.bind(l);
};
Et.prototype._calculateCachedBounds = function() {
  this._bounds.clear(), this._cacheData.sprite.transform._worldID = this.transform._worldID, this._cacheData.sprite._calculateBounds(), this._bounds.updateID = this._boundsID;
};
Et.prototype._getCachedLocalBounds = function() {
  return this._cacheData.sprite.getLocalBounds(null);
};
Et.prototype._destroyCachedDisplayObject = function() {
  this._cacheData.sprite._texture.destroy(!0), this._cacheData.sprite = null, J.removeFromCache(this._cacheData.textureCacheId), j.removeFromCache(this._cacheData.textureCacheId), this._cacheData.textureCacheId = null;
};
Et.prototype._cacheAsBitmapDestroy = function(r) {
  this.cacheAsBitmap = !1, this.destroy(r);
};
Et.prototype.name = null;
de.prototype.getChildByName = function(r, t) {
  for (let e = 0, i = this.children.length; e < i; e++)
    if (this.children[e].name === r)
      return this.children[e];
  if (t)
    for (let e = 0, i = this.children.length; e < i; e++) {
      const s = this.children[e];
      if (!s.getChildByName)
        continue;
      const n = s.getChildByName(r, !0);
      if (n)
        return n;
    }
  return null;
};
Et.prototype.getGlobalPosition = function(r = new lt(), t = !1) {
  return this.parent ? this.parent.toGlobal(this.position, r, t) : (r.x = this.position.x, r.y = this.position.y), r;
};
var o0 = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float uAlpha;

void main(void)
{
   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;
}
`;
class a0 extends Gt {
  /**
   * @param alpha - Amount of alpha from 0 to 1, where 0 is transparent
   */
  constructor(t = 1) {
    super(Kg, o0, { uAlpha: 1 }), this.alpha = t;
  }
  /**
   * Coefficient for alpha multiplication
   * @default 1
   */
  get alpha() {
    return this.uniforms.uAlpha;
  }
  set alpha(t) {
    this.uniforms.uAlpha = t;
  }
}
const h0 = {
  5: [0.153388, 0.221461, 0.250301],
  7: [0.071303, 0.131514, 0.189879, 0.214607],
  9: [0.028532, 0.067234, 0.124009, 0.179044, 0.20236],
  11: [93e-4, 0.028002, 0.065984, 0.121703, 0.175713, 0.198596],
  13: [2406e-6, 9255e-6, 0.027867, 0.065666, 0.121117, 0.174868, 0.197641],
  15: [489e-6, 2403e-6, 9246e-6, 0.02784, 0.065602, 0.120999, 0.174697, 0.197448]
}, l0 = [
  "varying vec2 vBlurTexCoords[%size%];",
  "uniform sampler2D uSampler;",
  "void main(void)",
  "{",
  "    gl_FragColor = vec4(0.0);",
  "    %blur%",
  "}"
].join(`
`);
function c0(r) {
  const t = h0[r], e = t.length;
  let i = l0, s = "";
  const n = "gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;";
  let o;
  for (let a = 0; a < r; a++) {
    let h = n.replace("%index%", a.toString());
    o = a, a >= e && (o = r - a - 1), h = h.replace("%value%", t[o].toString()), s += h, s += `
`;
  }
  return i = i.replace("%blur%", s), i = i.replace("%size%", r.toString()), i;
}
const u0 = `
    attribute vec2 aVertexPosition;

    uniform mat3 projectionMatrix;

    uniform float strength;

    varying vec2 vBlurTexCoords[%size%];

    uniform vec4 inputSize;
    uniform vec4 outputFrame;

    vec4 filterVertexPosition( void )
    {
        vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

        return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
    }

    vec2 filterTextureCoord( void )
    {
        return aVertexPosition * (outputFrame.zw * inputSize.zw);
    }

    void main(void)
    {
        gl_Position = filterVertexPosition();

        vec2 textureCoord = filterTextureCoord();
        %blur%
    }`;
function d0(r, t) {
  const e = Math.ceil(r / 2);
  let i = u0, s = "", n;
  t ? n = "vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * strength, 0.0);" : n = "vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * strength);";
  for (let o = 0; o < r; o++) {
    let a = n.replace("%index%", o.toString());
    a = a.replace("%sampleIndex%", `${o - (e - 1)}.0`), s += a, s += `
`;
  }
  return i = i.replace("%blur%", s), i = i.replace("%size%", r.toString()), i;
}
class Do extends Gt {
  /**
   * @param horizontal - Do pass along the x-axis (`true`) or y-axis (`false`).
   * @param strength - The strength of the blur filter.
   * @param quality - The quality of the blur filter.
   * @param {number|null} [resolution=PIXI.Filter.defaultResolution] - The resolution of the blur filter.
   * @param kernelSize - The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15.
   */
  constructor(t, e = 8, i = 4, s = Gt.defaultResolution, n = 5) {
    const o = d0(n, t), a = c0(n);
    super(
      // vertex shader
      o,
      // fragment shader
      a
    ), this.horizontal = t, this.resolution = s, this._quality = 0, this.quality = i, this.blur = e;
  }
  /**
   * Applies the filter.
   * @param filterManager - The manager.
   * @param input - The input target.
   * @param output - The output target.
   * @param clearMode - How to clear
   */
  apply(t, e, i, s) {
    if (i ? this.horizontal ? this.uniforms.strength = 1 / i.width * (i.width / e.width) : this.uniforms.strength = 1 / i.height * (i.height / e.height) : this.horizontal ? this.uniforms.strength = 1 / t.renderer.width * (t.renderer.width / e.width) : this.uniforms.strength = 1 / t.renderer.height * (t.renderer.height / e.height), this.uniforms.strength *= this.strength, this.uniforms.strength /= this.passes, this.passes === 1)
      t.applyFilter(this, e, i, s);
    else {
      const n = t.getFilterTexture(), o = t.renderer;
      let a = e, h = n;
      this.state.blend = !1, t.applyFilter(this, a, h, ve.CLEAR);
      for (let l = 1; l < this.passes - 1; l++) {
        t.bindAndClear(a, ve.BLIT), this.uniforms.uSampler = h;
        const c = h;
        h = a, a = c, o.shader.bind(this), o.geometry.draw(5);
      }
      this.state.blend = !0, t.applyFilter(this, h, i, s), t.returnFilterTexture(n);
    }
  }
  /**
   * Sets the strength of both the blur.
   * @default 16
   */
  get blur() {
    return this.strength;
  }
  set blur(t) {
    this.padding = 1 + Math.abs(t) * 2, this.strength = t;
  }
  /**
   * Sets the quality of the blur by modifying the number of passes. More passes means higher
   * quality bluring but the lower the performance.
   * @default 4
   */
  get quality() {
    return this._quality;
  }
  set quality(t) {
    this._quality = t, this.passes = t;
  }
}
class f0 extends Gt {
  /**
   * @param strength - The strength of the blur filter.
   * @param quality - The quality of the blur filter.
   * @param {number|null} [resolution=PIXI.Filter.defaultResolution] - The resolution of the blur filter.
   * @param kernelSize - The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15.
   */
  constructor(t = 8, e = 4, i = Gt.defaultResolution, s = 5) {
    super(), this._repeatEdgePixels = !1, this.blurXFilter = new Do(!0, t, e, i, s), this.blurYFilter = new Do(!1, t, e, i, s), this.resolution = i, this.quality = e, this.blur = t, this.repeatEdgePixels = !1;
  }
  /**
   * Applies the filter.
   * @param filterManager - The manager.
   * @param input - The input target.
   * @param output - The output target.
   * @param clearMode - How to clear
   */
  apply(t, e, i, s) {
    const n = Math.abs(this.blurXFilter.strength), o = Math.abs(this.blurYFilter.strength);
    if (n && o) {
      const a = t.getFilterTexture();
      this.blurXFilter.apply(t, e, a, ve.CLEAR), this.blurYFilter.apply(t, a, i, s), t.returnFilterTexture(a);
    } else
      o ? this.blurYFilter.apply(t, e, i, s) : this.blurXFilter.apply(t, e, i, s);
  }
  updatePadding() {
    this._repeatEdgePixels ? this.padding = 0 : this.padding = Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength)) * 2;
  }
  /**
   * Sets the strength of both the blurX and blurY properties simultaneously
   * @default 2
   */
  get blur() {
    return this.blurXFilter.blur;
  }
  set blur(t) {
    this.blurXFilter.blur = this.blurYFilter.blur = t, this.updatePadding();
  }
  /**
   * Sets the number of passes for blur. More passes means higher quality bluring.
   * @default 1
   */
  get quality() {
    return this.blurXFilter.quality;
  }
  set quality(t) {
    this.blurXFilter.quality = this.blurYFilter.quality = t;
  }
  /**
   * Sets the strength of the blurX property
   * @default 2
   */
  get blurX() {
    return this.blurXFilter.blur;
  }
  set blurX(t) {
    this.blurXFilter.blur = t, this.updatePadding();
  }
  /**
   * Sets the strength of the blurY property
   * @default 2
   */
  get blurY() {
    return this.blurYFilter.blur;
  }
  set blurY(t) {
    this.blurYFilter.blur = t, this.updatePadding();
  }
  /**
   * Sets the blendmode of the filter
   * @default PIXI.BLEND_MODES.NORMAL
   */
  get blendMode() {
    return this.blurYFilter.blendMode;
  }
  set blendMode(t) {
    this.blurYFilter.blendMode = t;
  }
  /**
   * If set to true the edge of the target will be clamped
   * @default false
   */
  get repeatEdgePixels() {
    return this._repeatEdgePixels;
  }
  set repeatEdgePixels(t) {
    this._repeatEdgePixels = t, this.updatePadding();
  }
}
var p0 = `varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float m[20];
uniform float uAlpha;

void main(void)
{
    vec4 c = texture2D(uSampler, vTextureCoord);

    if (uAlpha == 0.0) {
        gl_FragColor = c;
        return;
    }

    // Un-premultiply alpha before applying the color matrix. See issue #3539.
    if (c.a > 0.0) {
      c.rgb /= c.a;
    }

    vec4 result;

    result.r = (m[0] * c.r);
        result.r += (m[1] * c.g);
        result.r += (m[2] * c.b);
        result.r += (m[3] * c.a);
        result.r += m[4];

    result.g = (m[5] * c.r);
        result.g += (m[6] * c.g);
        result.g += (m[7] * c.b);
        result.g += (m[8] * c.a);
        result.g += m[9];

    result.b = (m[10] * c.r);
       result.b += (m[11] * c.g);
       result.b += (m[12] * c.b);
       result.b += (m[13] * c.a);
       result.b += m[14];

    result.a = (m[15] * c.r);
       result.a += (m[16] * c.g);
       result.a += (m[17] * c.b);
       result.a += (m[18] * c.a);
       result.a += m[19];

    vec3 rgb = mix(c.rgb, result.rgb, uAlpha);

    // Premultiply alpha again.
    rgb *= result.a;

    gl_FragColor = vec4(rgb, result.a);
}
`;
class Fo extends Gt {
  constructor() {
    const t = {
      m: new Float32Array([
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ]),
      uAlpha: 1
    };
    super(Yc, p0, t), this.alpha = 1;
  }
  /**
   * Transforms current matrix and set the new one
   * @param {number[]} matrix - 5x4 matrix
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  _loadMatrix(t, e = !1) {
    let i = t;
    e && (this._multiply(i, this.uniforms.m, t), i = this._colorMatrix(i)), this.uniforms.m = i;
  }
  /**
   * Multiplies two mat5's
   * @private
   * @param out - 5x4 matrix the receiving matrix
   * @param a - 5x4 matrix the first operand
   * @param b - 5x4 matrix the second operand
   * @returns {number[]} 5x4 matrix
   */
  _multiply(t, e, i) {
    return t[0] = e[0] * i[0] + e[1] * i[5] + e[2] * i[10] + e[3] * i[15], t[1] = e[0] * i[1] + e[1] * i[6] + e[2] * i[11] + e[3] * i[16], t[2] = e[0] * i[2] + e[1] * i[7] + e[2] * i[12] + e[3] * i[17], t[3] = e[0] * i[3] + e[1] * i[8] + e[2] * i[13] + e[3] * i[18], t[4] = e[0] * i[4] + e[1] * i[9] + e[2] * i[14] + e[3] * i[19] + e[4], t[5] = e[5] * i[0] + e[6] * i[5] + e[7] * i[10] + e[8] * i[15], t[6] = e[5] * i[1] + e[6] * i[6] + e[7] * i[11] + e[8] * i[16], t[7] = e[5] * i[2] + e[6] * i[7] + e[7] * i[12] + e[8] * i[17], t[8] = e[5] * i[3] + e[6] * i[8] + e[7] * i[13] + e[8] * i[18], t[9] = e[5] * i[4] + e[6] * i[9] + e[7] * i[14] + e[8] * i[19] + e[9], t[10] = e[10] * i[0] + e[11] * i[5] + e[12] * i[10] + e[13] * i[15], t[11] = e[10] * i[1] + e[11] * i[6] + e[12] * i[11] + e[13] * i[16], t[12] = e[10] * i[2] + e[11] * i[7] + e[12] * i[12] + e[13] * i[17], t[13] = e[10] * i[3] + e[11] * i[8] + e[12] * i[13] + e[13] * i[18], t[14] = e[10] * i[4] + e[11] * i[9] + e[12] * i[14] + e[13] * i[19] + e[14], t[15] = e[15] * i[0] + e[16] * i[5] + e[17] * i[10] + e[18] * i[15], t[16] = e[15] * i[1] + e[16] * i[6] + e[17] * i[11] + e[18] * i[16], t[17] = e[15] * i[2] + e[16] * i[7] + e[17] * i[12] + e[18] * i[17], t[18] = e[15] * i[3] + e[16] * i[8] + e[17] * i[13] + e[18] * i[18], t[19] = e[15] * i[4] + e[16] * i[9] + e[17] * i[14] + e[18] * i[19] + e[19], t;
  }
  /**
   * Create a Float32 Array and normalize the offset component to 0-1
   * @param {number[]} matrix - 5x4 matrix
   * @returns {number[]} 5x4 matrix with all values between 0-1
   */
  _colorMatrix(t) {
    const e = new Float32Array(t);
    return e[4] /= 255, e[9] /= 255, e[14] /= 255, e[19] /= 255, e;
  }
  /**
   * Adjusts brightness
   * @param b - value of the brigthness (0-1, where 0 is black)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  brightness(t, e) {
    const i = [
      t,
      0,
      0,
      0,
      0,
      0,
      t,
      0,
      0,
      0,
      0,
      0,
      t,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(i, e);
  }
  /**
   * Sets each channel on the diagonal of the color matrix.
   * This can be used to achieve a tinting effect on Containers similar to the tint field of some
   * display objects like Sprite, Text, Graphics, and Mesh.
   * @param color - Color of the tint. This is a hex value.
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  tint(t, e) {
    const [i, s, n] = pt.shared.setValue(t).toArray(), o = [
      i,
      0,
      0,
      0,
      0,
      0,
      s,
      0,
      0,
      0,
      0,
      0,
      n,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(o, e);
  }
  /**
   * Set the matrices in grey scales
   * @param scale - value of the grey (0-1, where 0 is black)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  greyscale(t, e) {
    const i = [
      t,
      t,
      t,
      0,
      0,
      t,
      t,
      t,
      0,
      0,
      t,
      t,
      t,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(i, e);
  }
  /**
   * Set the black and white matrice.
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  blackAndWhite(t) {
    const e = [
      0.3,
      0.6,
      0.1,
      0,
      0,
      0.3,
      0.6,
      0.1,
      0,
      0,
      0.3,
      0.6,
      0.1,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * Set the hue property of the color
   * @param rotation - in degrees
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  hue(t, e) {
    t = (t || 0) / 180 * Math.PI;
    const i = Math.cos(t), s = Math.sin(t), n = Math.sqrt, o = 1 / 3, a = n(o), h = i + (1 - i) * o, l = o * (1 - i) - a * s, c = o * (1 - i) + a * s, u = o * (1 - i) + a * s, d = i + o * (1 - i), f = o * (1 - i) - a * s, p = o * (1 - i) - a * s, m = o * (1 - i) + a * s, g = i + o * (1 - i), y = [
      h,
      l,
      c,
      0,
      0,
      u,
      d,
      f,
      0,
      0,
      p,
      m,
      g,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(y, e);
  }
  /**
   * Set the contrast matrix, increase the separation between dark and bright
   * Increase contrast : shadows darker and highlights brighter
   * Decrease contrast : bring the shadows up and the highlights down
   * @param amount - value of the contrast (0-1)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  contrast(t, e) {
    const i = (t || 0) + 1, s = -0.5 * (i - 1), n = [
      i,
      0,
      0,
      0,
      s,
      0,
      i,
      0,
      0,
      s,
      0,
      0,
      i,
      0,
      s,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(n, e);
  }
  /**
   * Set the saturation matrix, increase the separation between colors
   * Increase saturation : increase contrast, brightness, and sharpness
   * @param amount - The saturation amount (0-1)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  saturate(t = 0, e) {
    const i = t * 2 / 3 + 1, s = (i - 1) * -0.5, n = [
      i,
      s,
      s,
      0,
      0,
      s,
      i,
      s,
      0,
      0,
      s,
      s,
      i,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(n, e);
  }
  /** Desaturate image (remove color) Call the saturate function */
  desaturate() {
    this.saturate(-1);
  }
  /**
   * Negative image (inverse of classic rgb matrix)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  negative(t) {
    const e = [
      -1,
      0,
      0,
      1,
      0,
      0,
      -1,
      0,
      1,
      0,
      0,
      0,
      -1,
      1,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * Sepia image
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  sepia(t) {
    const e = [
      0.393,
      0.7689999,
      0.18899999,
      0,
      0,
      0.349,
      0.6859999,
      0.16799999,
      0,
      0,
      0.272,
      0.5339999,
      0.13099999,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * Color motion picture process invented in 1916 (thanks Dominic Szablewski)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  technicolor(t) {
    const e = [
      1.9125277891456083,
      -0.8545344976951645,
      -0.09155508482755585,
      0,
      11.793603434377337,
      -0.3087833385928097,
      1.7658908555458428,
      -0.10601743074722245,
      0,
      -70.35205161461398,
      -0.231103377548616,
      -0.7501899197440212,
      1.847597816108189,
      0,
      30.950940869491138,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * Polaroid filter
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  polaroid(t) {
    const e = [
      1.438,
      -0.062,
      -0.062,
      0,
      0,
      -0.122,
      1.378,
      -0.122,
      0,
      0,
      -0.016,
      -0.016,
      1.483,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * Filter who transforms : Red -> Blue and Blue -> Red
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  toBGR(t) {
    const e = [
      0,
      0,
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * Color reversal film introduced by Eastman Kodak in 1935. (thanks Dominic Szablewski)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  kodachrome(t) {
    const e = [
      1.1285582396593525,
      -0.3967382283601348,
      -0.03992559172921793,
      0,
      63.72958762196502,
      -0.16404339962244616,
      1.0835251566291304,
      -0.05498805115633132,
      0,
      24.732407896706203,
      -0.16786010706155763,
      -0.5603416277695248,
      1.6014850761964943,
      0,
      35.62982807460946,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * Brown delicious browni filter (thanks Dominic Szablewski)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  browni(t) {
    const e = [
      0.5997023498159715,
      0.34553243048391263,
      -0.2708298674538042,
      0,
      47.43192855600873,
      -0.037703249837783157,
      0.8609577587992641,
      0.15059552388459913,
      0,
      -36.96841498319127,
      0.24113635128153335,
      -0.07441037908422492,
      0.44972182064877153,
      0,
      -7.562075277591283,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * Vintage filter (thanks Dominic Szablewski)
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  vintage(t) {
    const e = [
      0.6279345635605994,
      0.3202183420819367,
      -0.03965408211312453,
      0,
      9.651285835294123,
      0.02578397704808868,
      0.6441188644374771,
      0.03259127616149294,
      0,
      7.462829176470591,
      0.0466055556782719,
      -0.0851232987247891,
      0.5241648018700465,
      0,
      5.159190588235296,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /**
   * We don't know exactly what it does, kind of gradient map, but funny to play with!
   * @param desaturation - Tone values.
   * @param toned - Tone values.
   * @param lightColor - Tone values, example: `0xFFE580`
   * @param darkColor - Tone values, example: `0xFFE580`
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  colorTone(t, e, i, s, n) {
    t = t || 0.2, e = e || 0.15, i = i || 16770432, s = s || 3375104;
    const o = pt.shared, [a, h, l] = o.setValue(i).toArray(), [c, u, d] = o.setValue(s).toArray(), f = [
      0.3,
      0.59,
      0.11,
      0,
      0,
      a,
      h,
      l,
      t,
      0,
      c,
      u,
      d,
      e,
      0,
      a - c,
      h - u,
      l - d,
      0,
      0
    ];
    this._loadMatrix(f, n);
  }
  /**
   * Night effect
   * @param intensity - The intensity of the night effect.
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  night(t, e) {
    t = t || 0.1;
    const i = [
      t * -2,
      -t,
      0,
      0,
      0,
      -t,
      0,
      t,
      0,
      0,
      0,
      t,
      t * 2,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(i, e);
  }
  /**
   * Predator effect
   *
   * Erase the current matrix by setting a new indepent one
   * @param amount - how much the predator feels his future victim
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  predator(t, e) {
    const i = [
      // row 1
      11.224130630493164 * t,
      -4.794486999511719 * t,
      -2.8746118545532227 * t,
      0 * t,
      0.40342438220977783 * t,
      // row 2
      -3.6330697536468506 * t,
      9.193157196044922 * t,
      -2.951810836791992 * t,
      0 * t,
      -1.316135048866272 * t,
      // row 3
      -3.2184197902679443 * t,
      -4.2375030517578125 * t,
      7.476448059082031 * t,
      0 * t,
      0.8044459223747253 * t,
      // row 4
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(i, e);
  }
  /**
   * LSD effect
   *
   * Multiply the current matrix
   * @param multiply - if true, current matrix and matrix are multiplied. If false,
   *  just set the current matrix with @param matrix
   */
  lsd(t) {
    const e = [
      2,
      -0.4,
      0.5,
      0,
      0,
      -0.5,
      2,
      -0.4,
      0,
      0,
      -0.4,
      -0.5,
      3,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(e, t);
  }
  /** Erase the current matrix by setting the default one. */
  reset() {
    const t = [
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
    this._loadMatrix(t, !1);
  }
  /**
   * The matrix of the color matrix filter
   * @member {number[]}
   * @default [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]
   */
  get matrix() {
    return this.uniforms.m;
  }
  set matrix(t) {
    this.uniforms.m = t;
  }
  /**
   * The opacity value to use when mixing the original and resultant colors.
   *
   * When the value is 0, the original color is used without modification.
   * When the value is 1, the result color is used.
   * When in the range (0, 1) the color is interpolated between the original and result by this amount.
   * @default 1
   */
  get alpha() {
    return this.uniforms.uAlpha;
  }
  set alpha(t) {
    this.uniforms.uAlpha = t;
  }
}
Fo.prototype.grayscale = Fo.prototype.greyscale;
var m0 = `varying vec2 vFilterCoord;
varying vec2 vTextureCoord;

uniform vec2 scale;
uniform mat2 rotation;
uniform sampler2D uSampler;
uniform sampler2D mapSampler;

uniform highp vec4 inputSize;
uniform vec4 inputClamp;

void main(void)
{
  vec4 map =  texture2D(mapSampler, vFilterCoord);

  map -= 0.5;
  map.xy = scale * inputSize.zw * (rotation * map.xy);

  gl_FragColor = texture2D(uSampler, clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), inputClamp.xy, inputClamp.zw));
}
`, g0 = `attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;
uniform mat3 filterMatrix;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void)
{
	gl_Position = filterVertexPosition();
	vTextureCoord = filterTextureCoord();
	vFilterCoord = ( filterMatrix * vec3( vTextureCoord, 1.0)  ).xy;
}
`;
class y0 extends Gt {
  /**
   * @param {PIXI.Sprite} sprite - The sprite used for the displacement map. (make sure its added to the scene!)
   * @param scale - The scale of the displacement
   */
  constructor(t, e) {
    const i = new yt();
    t.renderable = !1, super(g0, m0, {
      mapSampler: t._texture,
      filterMatrix: i,
      scale: { x: 1, y: 1 },
      rotation: new Float32Array([1, 0, 0, 1])
    }), this.maskSprite = t, this.maskMatrix = i, e == null && (e = 20), this.scale = new lt(e, e);
  }
  /**
   * Applies the filter.
   * @param filterManager - The manager.
   * @param input - The input target.
   * @param output - The output target.
   * @param clearMode - clearMode.
   */
  apply(t, e, i, s) {
    this.uniforms.filterMatrix = t.calculateSpriteMatrix(this.maskMatrix, this.maskSprite), this.uniforms.scale.x = this.scale.x, this.uniforms.scale.y = this.scale.y;
    const n = this.maskSprite.worldTransform, o = Math.sqrt(n.a * n.a + n.b * n.b), a = Math.sqrt(n.c * n.c + n.d * n.d);
    o !== 0 && a !== 0 && (this.uniforms.rotation[0] = n.a / o, this.uniforms.rotation[1] = n.b / o, this.uniforms.rotation[2] = n.c / a, this.uniforms.rotation[3] = n.d / a), t.applyFilter(this, e, i, s);
  }
  /** The texture used for the displacement map. Must be power of 2 sized texture. */
  get map() {
    return this.uniforms.mapSampler;
  }
  set map(t) {
    this.uniforms.mapSampler = t;
  }
}
var _0 = `varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

varying vec2 vFragCoord;
uniform sampler2D uSampler;
uniform highp vec4 inputSize;


/**
 Basic FXAA implementation based on the code on geeks3d.com with the
 modification that the texture2DLod stuff was removed since it's
 unsupported by WebGL.

 --

 From:
 https://github.com/mitsuhiko/webgl-meincraft

 Copyright (c) 2011 by Armin Ronacher.

 Some rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are
 met:

 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above
 copyright notice, this list of conditions and the following
 disclaimer in the documentation and/or other materials provided
 with the distribution.

 * The names of the contributors may not be used to endorse or
 promote products derived from this software without specific
 prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#ifndef FXAA_REDUCE_MIN
#define FXAA_REDUCE_MIN   (1.0/ 128.0)
#endif
#ifndef FXAA_REDUCE_MUL
#define FXAA_REDUCE_MUL   (1.0 / 8.0)
#endif
#ifndef FXAA_SPAN_MAX
#define FXAA_SPAN_MAX     8.0
#endif

//optimized version for mobile, where dependent
//texture reads can be a bottleneck
vec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 inverseVP,
          vec2 v_rgbNW, vec2 v_rgbNE,
          vec2 v_rgbSW, vec2 v_rgbSE,
          vec2 v_rgbM) {
    vec4 color;
    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;
    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;
    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;
    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;
    vec4 texColor = texture2D(tex, v_rgbM);
    vec3 rgbM  = texColor.xyz;
    vec3 luma = vec3(0.299, 0.587, 0.114);
    float lumaNW = dot(rgbNW, luma);
    float lumaNE = dot(rgbNE, luma);
    float lumaSW = dot(rgbSW, luma);
    float lumaSE = dot(rgbSE, luma);
    float lumaM  = dot(rgbM,  luma);
    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

    mediump vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *
                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);

    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),
              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
                  dir * rcpDirMin)) * inverseVP;

    vec3 rgbA = 0.5 * (
                       texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +
                       texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);
    vec3 rgbB = rgbA * 0.5 + 0.25 * (
                                     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +
                                     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);

    float lumaB = dot(rgbB, luma);
    if ((lumaB < lumaMin) || (lumaB > lumaMax))
        color = vec4(rgbA, texColor.a);
    else
        color = vec4(rgbB, texColor.a);
    return color;
}

void main() {

      vec4 color;

      color = fxaa(uSampler, vFragCoord, inputSize.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);

      gl_FragColor = color;
}
`, v0 = `
attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;

varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

varying vec2 vFragCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

void texcoords(vec2 fragCoord, vec2 inverseVP,
               out vec2 v_rgbNW, out vec2 v_rgbNE,
               out vec2 v_rgbSW, out vec2 v_rgbSE,
               out vec2 v_rgbM) {
    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;
    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;
    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;
    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;
    v_rgbM = vec2(fragCoord * inverseVP);
}

void main(void) {

   gl_Position = filterVertexPosition();

   vFragCoord = aVertexPosition * outputFrame.zw;

   texcoords(vFragCoord, inputSize.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
}
`;
class x0 extends Gt {
  constructor() {
    super(v0, _0);
  }
}
var b0 = `precision highp float;

varying vec2 vTextureCoord;
varying vec4 vColor;

uniform float uNoise;
uniform float uSeed;
uniform sampler2D uSampler;

float rand(vec2 co)
{
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
    vec4 color = texture2D(uSampler, vTextureCoord);
    float randomValue = rand(gl_FragCoord.xy * uSeed);
    float diff = (randomValue - 0.5) * uNoise;

    // Un-premultiply alpha before applying the color matrix. See issue #3539.
    if (color.a > 0.0) {
        color.rgb /= color.a;
    }

    color.r += diff;
    color.g += diff;
    color.b += diff;

    // Premultiply alpha again.
    color.rgb *= color.a;

    gl_FragColor = color;
}
`;
class T0 extends Gt {
  /**
   * @param {number} [noise=0.5] - The noise intensity, should be a normalized value in the range [0, 1].
   * @param {number} [seed] - A random seed for the noise generation. Default is `Math.random()`.
   */
  constructor(t = 0.5, e = Math.random()) {
    super(Yc, b0, {
      uNoise: 0,
      uSeed: 0
    }), this.noise = t, this.seed = e;
  }
  /**
   * The amount of noise to apply, this value should be in the range (0, 1].
   * @default 0.5
   */
  get noise() {
    return this.uniforms.uNoise;
  }
  set noise(t) {
    this.uniforms.uNoise = t;
  }
  /** A seed value to apply to the random noise generation. `Math.random()` is a good value to use. */
  get seed() {
    return this.uniforms.uSeed;
  }
  set seed(t) {
    this.uniforms.uSeed = t;
  }
}
const Lh = {
  /**
   * @class
   * @memberof PIXI.filters
   * @deprecated since 7.1.0
   * @see PIXI.AlphaFilter
   */
  AlphaFilter: a0,
  /**
   * @class
   * @memberof PIXI.filters
   * @deprecated since 7.1.0
   * @see PIXI.BlurFilter
   */
  BlurFilter: f0,
  /**
   * @class
   * @memberof PIXI.filters
   * @deprecated since 7.1.0
   * @see PIXI.BlurFilterPass
   */
  BlurFilterPass: Do,
  /**
   * @class
   * @memberof PIXI.filters
   * @deprecated since 7.1.0
   * @see PIXI.ColorMatrixFilter
   */
  ColorMatrixFilter: Fo,
  /**
   * @class
   * @memberof PIXI.filters
   * @deprecated since 7.1.0
   * @see PIXI.DisplacementFilter
   */
  DisplacementFilter: y0,
  /**
   * @class
   * @memberof PIXI.filters
   * @deprecated since 7.1.0
   * @see PIXI.FXAAFilter
   */
  FXAAFilter: x0,
  /**
   * @class
   * @memberof PIXI.filters
   * @deprecated since 7.1.0
   * @see PIXI.NoiseFilter
   */
  NoiseFilter: T0
};
Object.entries(Lh).forEach(([r, t]) => {
  Object.defineProperty(Lh, r, {
    get() {
      return it("7.1.0", `filters.${r} has moved to ${r}`), t;
    }
  });
});
class E0 {
  constructor() {
    this.interactionFrequency = 10, this._deltaTime = 0, this._didMove = !1, this.tickerAdded = !1, this._pauseUpdate = !0;
  }
  /**
   * Initializes the event ticker.
   * @param events - The event system.
   */
  init(t) {
    this.removeTickerListener(), this.events = t, this.interactionFrequency = 10, this._deltaTime = 0, this._didMove = !1, this.tickerAdded = !1, this._pauseUpdate = !0;
  }
  /** Whether to pause the update checks or not. */
  get pauseUpdate() {
    return this._pauseUpdate;
  }
  set pauseUpdate(t) {
    this._pauseUpdate = t;
  }
  /** Adds the ticker listener. */
  addTickerListener() {
    this.tickerAdded || !this.domElement || (Yt.system.add(this.tickerUpdate, this, Tr.INTERACTION), this.tickerAdded = !0);
  }
  /** Removes the ticker listener. */
  removeTickerListener() {
    this.tickerAdded && (Yt.system.remove(this.tickerUpdate, this), this.tickerAdded = !1);
  }
  /** Sets flag to not fire extra events when the user has already moved there mouse */
  pointerMoved() {
    this._didMove = !0;
  }
  /** Updates the state of interactive objects. */
  update() {
    if (!this.domElement || this._pauseUpdate)
      return;
    if (this._didMove) {
      this._didMove = !1;
      return;
    }
    const t = this.events.rootPointerEvent;
    this.events.supportsTouchEvents && t.pointerType === "touch" || globalThis.document.dispatchEvent(new PointerEvent("pointermove", {
      clientX: t.clientX,
      clientY: t.clientY
    }));
  }
  /**
   * Updates the state of interactive objects if at least {@link PIXI.EventsTicker#interactionFrequency}
   * milliseconds have passed since the last invocation.
   *
   * Invoked by a throttled ticker update from {@link PIXI.Ticker.system}.
   * @param deltaTime - time delta since the last call
   */
  tickerUpdate(t) {
    this._deltaTime += t, !(this._deltaTime < this.interactionFrequency) && (this._deltaTime = 0, this.update());
  }
}
const Ve = new E0();
class Fi {
  /**
   * @param manager - The event boundary which manages this event. Propagation can only occur
   *  within the boundary's jurisdiction.
   */
  constructor(t) {
    this.bubbles = !0, this.cancelBubble = !0, this.cancelable = !1, this.composed = !1, this.defaultPrevented = !1, this.eventPhase = Fi.prototype.NONE, this.propagationStopped = !1, this.propagationImmediatelyStopped = !1, this.layer = new lt(), this.page = new lt(), this.NONE = 0, this.CAPTURING_PHASE = 1, this.AT_TARGET = 2, this.BUBBLING_PHASE = 3, this.manager = t;
  }
  /** @readonly */
  get layerX() {
    return this.layer.x;
  }
  /** @readonly */
  get layerY() {
    return this.layer.y;
  }
  /** @readonly */
  get pageX() {
    return this.page.x;
  }
  /** @readonly */
  get pageY() {
    return this.page.y;
  }
  /**
   * Fallback for the deprecated @code{PIXI.InteractionEvent.data}.
   * @deprecated since 7.0.0
   */
  get data() {
    return this;
  }
  /** The propagation path for this event. Alias for {@link PIXI.EventBoundary.propagationPath}. */
  composedPath() {
    return this.manager && (!this.path || this.path[this.path.length - 1] !== this.target) && (this.path = this.target ? this.manager.propagationPath(this.target) : []), this.path;
  }
  /**
   * Unimplemented method included for implementing the DOM interface {@code Event}. It will throw an {@code Error}.
   * @deprecated
   * @param _type
   * @param _bubbles
   * @param _cancelable
   */
  initEvent(t, e, i) {
    throw new Error("initEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
  }
  /**
   * Unimplemented method included for implementing the DOM interface {@code UIEvent}. It will throw an {@code Error}.
   * @deprecated
   * @param _typeArg
   * @param _bubblesArg
   * @param _cancelableArg
   * @param _viewArg
   * @param _detailArg
   */
  initUIEvent(t, e, i, s, n) {
    throw new Error("initUIEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
  }
  /** Prevent default behavior of PixiJS and the user agent. */
  preventDefault() {
    this.nativeEvent instanceof Event && this.nativeEvent.cancelable && this.nativeEvent.preventDefault(), this.defaultPrevented = !0;
  }
  /**
   * Stop this event from propagating to any addition listeners, including on the
   * {@link PIXI.FederatedEventTarget.currentTarget currentTarget} and also the following
   * event targets on the propagation path.
   */
  stopImmediatePropagation() {
    this.propagationImmediatelyStopped = !0;
  }
  /**
   * Stop this event from propagating to the next {@link PIXI.FederatedEventTarget}. The rest of the listeners
   * on the {@link PIXI.FederatedEventTarget.currentTarget currentTarget} will still be notified.
   */
  stopPropagation() {
    this.propagationStopped = !0;
  }
}
class Ns extends Fi {
  constructor() {
    super(...arguments), this.client = new lt(), this.movement = new lt(), this.offset = new lt(), this.global = new lt(), this.screen = new lt();
  }
  /** @readonly */
  get clientX() {
    return this.client.x;
  }
  /** @readonly */
  get clientY() {
    return this.client.y;
  }
  /**
   * Alias for {@link PIXI.FederatedMouseEvent.clientX this.clientX}.
   * @readonly
   */
  get x() {
    return this.clientX;
  }
  /**
   * Alias for {@link PIXI.FederatedMouseEvent.clientY this.clientY}.
   * @readonly
   */
  get y() {
    return this.clientY;
  }
  /** @readonly */
  get movementX() {
    return this.movement.x;
  }
  /** @readonly */
  get movementY() {
    return this.movement.y;
  }
  /** @readonly */
  get offsetX() {
    return this.offset.x;
  }
  /** @readonly */
  get offsetY() {
    return this.offset.y;
  }
  /** @readonly */
  get globalX() {
    return this.global.x;
  }
  /** @readonly */
  get globalY() {
    return this.global.y;
  }
  /**
   * The pointer coordinates in the renderer's screen. Alias for {@code screen.x}.
   * @readonly
   */
  get screenX() {
    return this.screen.x;
  }
  /**
   * The pointer coordinates in the renderer's screen. Alias for {@code screen.y}.
   * @readonly
   */
  get screenY() {
    return this.screen.y;
  }
  /**
   * This will return the local coordinates of the specified displayObject for this InteractionData
   * @param {PIXI.DisplayObject} displayObject - The DisplayObject that you would like the local
   *  coords off
   * @param {PIXI.IPointData} point - A Point object in which to store the value, optional (otherwise
   *  will create a new point)
   * @param {PIXI.IPointData} globalPos - A Point object containing your custom global coords, optional
   *  (otherwise will use the current global coords)
   * @returns - A point containing the coordinates of the InteractionData position relative
   *  to the DisplayObject
   */
  getLocalPosition(t, e, i) {
    return t.worldTransform.applyInverse(i || this.global, e);
  }
  /**
   * Whether the modifier key was pressed when this event natively occurred.
   * @param key - The modifier key.
   */
  getModifierState(t) {
    return "getModifierState" in this.nativeEvent && this.nativeEvent.getModifierState(t);
  }
  /**
   * Not supported.
   * @param _typeArg
   * @param _canBubbleArg
   * @param _cancelableArg
   * @param _viewArg
   * @param _detailArg
   * @param _screenXArg
   * @param _screenYArg
   * @param _clientXArg
   * @param _clientYArg
   * @param _ctrlKeyArg
   * @param _altKeyArg
   * @param _shiftKeyArg
   * @param _metaKeyArg
   * @param _buttonArg
   * @param _relatedTargetArg
   * @deprecated since 7.0.0
   */
  // eslint-disable-next-line max-params
  initMouseEvent(t, e, i, s, n, o, a, h, l, c, u, d, f, p, m) {
    throw new Error("Method not implemented.");
  }
}
class oe extends Ns {
  constructor() {
    super(...arguments), this.width = 0, this.height = 0, this.isPrimary = !1;
  }
  // Only included for completeness for now
  getCoalescedEvents() {
    return this.type === "pointermove" || this.type === "mousemove" || this.type === "touchmove" ? [this] : [];
  }
  // Only included for completeness for now
  getPredictedEvents() {
    throw new Error("getPredictedEvents is not supported!");
  }
}
class Kr extends Ns {
  constructor() {
    super(...arguments), this.DOM_DELTA_PIXEL = 0, this.DOM_DELTA_LINE = 1, this.DOM_DELTA_PAGE = 2;
  }
}
Kr.DOM_DELTA_PIXEL = 0, /** Units specified in lines. */
Kr.DOM_DELTA_LINE = 1, /** Units specified in pages. */
Kr.DOM_DELTA_PAGE = 2;
const w0 = 2048, A0 = new lt(), Fn = new lt();
class S0 {
  /**
   * @param rootTarget - The holder of the event boundary.
   */
  constructor(t) {
    this.dispatch = new Bi(), this.moveOnAll = !1, this.enableGlobalMoveEvents = !0, this.mappingState = {
      trackingData: {}
    }, this.eventPool = /* @__PURE__ */ new Map(), this._allInteractiveElements = [], this._hitElements = [], this._isPointerMoveEvent = !1, this.rootTarget = t, this.hitPruneFn = this.hitPruneFn.bind(this), this.hitTestFn = this.hitTestFn.bind(this), this.mapPointerDown = this.mapPointerDown.bind(this), this.mapPointerMove = this.mapPointerMove.bind(this), this.mapPointerOut = this.mapPointerOut.bind(this), this.mapPointerOver = this.mapPointerOver.bind(this), this.mapPointerUp = this.mapPointerUp.bind(this), this.mapPointerUpOutside = this.mapPointerUpOutside.bind(this), this.mapWheel = this.mapWheel.bind(this), this.mappingTable = {}, this.addEventMapping("pointerdown", this.mapPointerDown), this.addEventMapping("pointermove", this.mapPointerMove), this.addEventMapping("pointerout", this.mapPointerOut), this.addEventMapping("pointerleave", this.mapPointerOut), this.addEventMapping("pointerover", this.mapPointerOver), this.addEventMapping("pointerup", this.mapPointerUp), this.addEventMapping("pointerupoutside", this.mapPointerUpOutside), this.addEventMapping("wheel", this.mapWheel);
  }
  /**
   * Adds an event mapping for the event `type` handled by `fn`.
   *
   * Event mappings can be used to implement additional or custom events. They take an event
   * coming from the upstream scene (or directly from the {@link PIXI.EventSystem}) and dispatch new downstream events
   * generally trickling down and bubbling up to {@link PIXI.EventBoundary.rootTarget this.rootTarget}.
   *
   * To modify the semantics of existing events, the built-in mapping methods of EventBoundary should be overridden
   * instead.
   * @param type - The type of upstream event to map.
   * @param fn - The mapping method. The context of this function must be bound manually, if desired.
   */
  addEventMapping(t, e) {
    this.mappingTable[t] || (this.mappingTable[t] = []), this.mappingTable[t].push({
      fn: e,
      priority: 0
    }), this.mappingTable[t].sort((i, s) => i.priority - s.priority);
  }
  /**
   * Dispatches the given event
   * @param e
   * @param type
   */
  dispatchEvent(t, e) {
    t.propagationStopped = !1, t.propagationImmediatelyStopped = !1, this.propagate(t, e), this.dispatch.emit(e || t.type, t);
  }
  /**
   * Maps the given upstream event through the event boundary and propagates it downstream.
   * @param e
   */
  mapEvent(t) {
    if (!this.rootTarget)
      return;
    const e = this.mappingTable[t.type];
    if (e)
      for (let i = 0, s = e.length; i < s; i++)
        e[i].fn(t);
    else
      console.warn(`[EventBoundary]: Event mapping not defined for ${t.type}`);
  }
  /**
   * Finds the DisplayObject that is the target of a event at the given coordinates.
   *
   * The passed (x,y) coordinates are in the world space above this event boundary.
   * @param x
   * @param y
   */
  hitTest(t, e) {
    Ve.pauseUpdate = !0;
    const i = this._isPointerMoveEvent && this.enableGlobalMoveEvents ? "hitTestMoveRecursive" : "hitTestRecursive", s = this[i](
      this.rootTarget,
      this.rootTarget.eventMode,
      A0.set(t, e),
      this.hitTestFn,
      this.hitPruneFn
    );
    return s && s[0];
  }
  /**
   * Propagate the passed event from from {@link PIXI.EventBoundary.rootTarget this.rootTarget} to its
   * target {@code e.target}.
   * @param e - The event to propagate.
   * @param type
   */
  propagate(t, e) {
    if (!t.target)
      return;
    const i = t.composedPath();
    t.eventPhase = t.CAPTURING_PHASE;
    for (let s = 0, n = i.length - 1; s < n; s++)
      if (t.currentTarget = i[s], this.notifyTarget(t, e), t.propagationStopped || t.propagationImmediatelyStopped)
        return;
    if (t.eventPhase = t.AT_TARGET, t.currentTarget = t.target, this.notifyTarget(t, e), !(t.propagationStopped || t.propagationImmediatelyStopped)) {
      t.eventPhase = t.BUBBLING_PHASE;
      for (let s = i.length - 2; s >= 0; s--)
        if (t.currentTarget = i[s], this.notifyTarget(t, e), t.propagationStopped || t.propagationImmediatelyStopped)
          return;
    }
  }
  /**
   * Emits the event {@code e} to all interactive display objects. The event is propagated in the bubbling phase always.
   *
   * This is used in the `globalpointermove` event.
   * @param e - The emitted event.
   * @param type - The listeners to notify.
   * @param targets - The targets to notify.
   */
  all(t, e, i = this._allInteractiveElements) {
    if (i.length === 0)
      return;
    t.eventPhase = t.BUBBLING_PHASE;
    const s = Array.isArray(e) ? e : [e];
    for (let n = i.length - 1; n >= 0; n--)
      s.forEach((o) => {
        t.currentTarget = i[n], this.notifyTarget(t, o);
      });
  }
  /**
   * Finds the propagation path from {@link PIXI.EventBoundary.rootTarget rootTarget} to the passed
   * {@code target}. The last element in the path is {@code target}.
   * @param target
   */
  propagationPath(t) {
    const e = [t];
    for (let i = 0; i < w0 && t !== this.rootTarget; i++) {
      if (!t.parent)
        throw new Error("Cannot find propagation path to disconnected target");
      e.push(t.parent), t = t.parent;
    }
    return e.reverse(), e;
  }
  hitTestMoveRecursive(t, e, i, s, n, o = !1) {
    let a = !1;
    if (this._interactivePrune(t))
      return null;
    if ((t.eventMode === "dynamic" || e === "dynamic") && (Ve.pauseUpdate = !1), t.interactiveChildren && t.children) {
      const c = t.children;
      for (let u = c.length - 1; u >= 0; u--) {
        const d = c[u], f = this.hitTestMoveRecursive(
          d,
          this._isInteractive(e) ? e : d.eventMode,
          i,
          s,
          n,
          o || n(t, i)
        );
        if (f) {
          if (f.length > 0 && !f[f.length - 1].parent)
            continue;
          const p = t.isInteractive();
          (f.length > 0 || p) && (p && this._allInteractiveElements.push(t), f.push(t)), this._hitElements.length === 0 && (this._hitElements = f), a = !0;
        }
      }
    }
    const h = this._isInteractive(e), l = t.isInteractive();
    return h && l && this._allInteractiveElements.push(t), o || this._hitElements.length > 0 ? null : a ? this._hitElements : h && !n(t, i) && s(t, i) ? l ? [t] : [] : null;
  }
  /**
   * Recursive implementation for {@link PIXI.EventBoundary.hitTest hitTest}.
   * @param currentTarget - The DisplayObject that is to be hit tested.
   * @param eventMode - The event mode for the `currentTarget` or one of its parents.
   * @param location - The location that is being tested for overlap.
   * @param testFn - Callback that determines whether the target passes hit testing. This callback
   *  can assume that `pruneFn` failed to prune the display object.
   * @param pruneFn - Callback that determiness whether the target and all of its children
   *  cannot pass the hit test. It is used as a preliminary optimization to prune entire subtrees
   *  of the scene graph.
   * @returns An array holding the hit testing target and all its ancestors in order. The first element
   *  is the target itself and the last is {@link PIXI.EventBoundary.rootTarget rootTarget}. This is the opposite
   *  order w.r.t. the propagation path. If no hit testing target is found, null is returned.
   */
  hitTestRecursive(t, e, i, s, n) {
    if (this._interactivePrune(t) || n(t, i))
      return null;
    if ((t.eventMode === "dynamic" || e === "dynamic") && (Ve.pauseUpdate = !1), t.interactiveChildren && t.children) {
      const h = t.children;
      for (let l = h.length - 1; l >= 0; l--) {
        const c = h[l], u = this.hitTestRecursive(
          c,
          this._isInteractive(e) ? e : c.eventMode,
          i,
          s,
          n
        );
        if (u) {
          if (u.length > 0 && !u[u.length - 1].parent)
            continue;
          const d = t.isInteractive();
          return (u.length > 0 || d) && u.push(t), u;
        }
      }
    }
    const o = this._isInteractive(e), a = t.isInteractive();
    return o && s(t, i) ? a ? [t] : [] : null;
  }
  _isInteractive(t) {
    return t === "static" || t === "dynamic";
  }
  _interactivePrune(t) {
    return !!(!t || t.isMask || !t.visible || !t.renderable || t.eventMode === "none" || t.eventMode === "passive" && !t.interactiveChildren || t.isMask);
  }
  /**
   * Checks whether the display object or any of its children cannot pass the hit test at all.
   *
   * {@link PIXI.EventBoundary}'s implementation uses the {@link PIXI.DisplayObject.hitArea hitArea}
   * and {@link PIXI.DisplayObject._mask} for pruning.
   * @param displayObject
   * @param location
   */
  hitPruneFn(t, e) {
    var i;
    if (t.hitArea && (t.worldTransform.applyInverse(e, Fn), !t.hitArea.contains(Fn.x, Fn.y)))
      return !0;
    if (t._mask) {
      const s = t._mask.isMaskData ? t._mask.maskObject : t._mask;
      if (s && !((i = s.containsPoint) != null && i.call(s, e)))
        return !0;
    }
    return !1;
  }
  /**
   * Checks whether the display object passes hit testing for the given location.
   * @param displayObject
   * @param location
   * @returns - Whether `displayObject` passes hit testing for `location`.
   */
  hitTestFn(t, e) {
    return t.eventMode === "passive" ? !1 : t.hitArea ? !0 : t.containsPoint ? t.containsPoint(e) : !1;
  }
  /**
   * Notify all the listeners to the event's `currentTarget`.
   *
   * If the `currentTarget` contains the property `on<type>`, then it is called here,
   * simulating the behavior from version 6.x and prior.
   * @param e - The event passed to the target.
   * @param type
   */
  notifyTarget(t, e) {
    var n, o;
    e = e ?? t.type;
    const i = `on${e}`;
    (o = (n = t.currentTarget)[i]) == null || o.call(n, t);
    const s = t.eventPhase === t.CAPTURING_PHASE || t.eventPhase === t.AT_TARGET ? `${e}capture` : e;
    this.notifyListeners(t, s), t.eventPhase === t.AT_TARGET && this.notifyListeners(t, e);
  }
  /**
   * Maps the upstream `pointerdown` events to a downstream `pointerdown` event.
   *
   * `touchstart`, `rightdown`, `mousedown` events are also dispatched for specific pointer types.
   * @param from
   */
  mapPointerDown(t) {
    if (!(t instanceof oe)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const e = this.createPointerEvent(t);
    if (this.dispatchEvent(e, "pointerdown"), e.pointerType === "touch")
      this.dispatchEvent(e, "touchstart");
    else if (e.pointerType === "mouse" || e.pointerType === "pen") {
      const s = e.button === 2;
      this.dispatchEvent(e, s ? "rightdown" : "mousedown");
    }
    const i = this.trackingData(t.pointerId);
    i.pressTargetsByButton[t.button] = e.composedPath(), this.freeEvent(e);
  }
  /**
   * Maps the upstream `pointermove` to downstream `pointerout`, `pointerover`, and `pointermove` events, in that order.
   *
   * The tracking data for the specific pointer has an updated `overTarget`. `mouseout`, `mouseover`,
   * `mousemove`, and `touchmove` events are fired as well for specific pointer types.
   * @param from - The upstream `pointermove` event.
   */
  mapPointerMove(t) {
    var h, l;
    if (!(t instanceof oe)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    this._allInteractiveElements.length = 0, this._hitElements.length = 0, this._isPointerMoveEvent = !0;
    const e = this.createPointerEvent(t);
    this._isPointerMoveEvent = !1;
    const i = e.pointerType === "mouse" || e.pointerType === "pen", s = this.trackingData(t.pointerId), n = this.findMountedTarget(s.overTargets);
    if (((h = s.overTargets) == null ? void 0 : h.length) > 0 && n !== e.target) {
      const c = t.type === "mousemove" ? "mouseout" : "pointerout", u = this.createPointerEvent(t, c, n);
      if (this.dispatchEvent(u, "pointerout"), i && this.dispatchEvent(u, "mouseout"), !e.composedPath().includes(n)) {
        const d = this.createPointerEvent(t, "pointerleave", n);
        for (d.eventPhase = d.AT_TARGET; d.target && !e.composedPath().includes(d.target); )
          d.currentTarget = d.target, this.notifyTarget(d), i && this.notifyTarget(d, "mouseleave"), d.target = d.target.parent;
        this.freeEvent(d);
      }
      this.freeEvent(u);
    }
    if (n !== e.target) {
      const c = t.type === "mousemove" ? "mouseover" : "pointerover", u = this.clonePointerEvent(e, c);
      this.dispatchEvent(u, "pointerover"), i && this.dispatchEvent(u, "mouseover");
      let d = n == null ? void 0 : n.parent;
      for (; d && d !== this.rootTarget.parent && d !== e.target; )
        d = d.parent;
      if (!d || d === this.rootTarget.parent) {
        const f = this.clonePointerEvent(e, "pointerenter");
        for (f.eventPhase = f.AT_TARGET; f.target && f.target !== n && f.target !== this.rootTarget.parent; )
          f.currentTarget = f.target, this.notifyTarget(f), i && this.notifyTarget(f, "mouseenter"), f.target = f.target.parent;
        this.freeEvent(f);
      }
      this.freeEvent(u);
    }
    const o = [], a = this.enableGlobalMoveEvents ?? !0;
    this.moveOnAll ? o.push("pointermove") : this.dispatchEvent(e, "pointermove"), a && o.push("globalpointermove"), e.pointerType === "touch" && (this.moveOnAll ? o.splice(1, 0, "touchmove") : this.dispatchEvent(e, "touchmove"), a && o.push("globaltouchmove")), i && (this.moveOnAll ? o.splice(1, 0, "mousemove") : this.dispatchEvent(e, "mousemove"), a && o.push("globalmousemove"), this.cursor = (l = e.target) == null ? void 0 : l.cursor), o.length > 0 && this.all(e, o), this._allInteractiveElements.length = 0, this._hitElements.length = 0, s.overTargets = e.composedPath(), this.freeEvent(e);
  }
  /**
   * Maps the upstream `pointerover` to downstream `pointerover` and `pointerenter` events, in that order.
   *
   * The tracking data for the specific pointer gets a new `overTarget`.
   * @param from - The upstream `pointerover` event.
   */
  mapPointerOver(t) {
    var o;
    if (!(t instanceof oe)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const e = this.trackingData(t.pointerId), i = this.createPointerEvent(t), s = i.pointerType === "mouse" || i.pointerType === "pen";
    this.dispatchEvent(i, "pointerover"), s && this.dispatchEvent(i, "mouseover"), i.pointerType === "mouse" && (this.cursor = (o = i.target) == null ? void 0 : o.cursor);
    const n = this.clonePointerEvent(i, "pointerenter");
    for (n.eventPhase = n.AT_TARGET; n.target && n.target !== this.rootTarget.parent; )
      n.currentTarget = n.target, this.notifyTarget(n), s && this.notifyTarget(n, "mouseenter"), n.target = n.target.parent;
    e.overTargets = i.composedPath(), this.freeEvent(i), this.freeEvent(n);
  }
  /**
   * Maps the upstream `pointerout` to downstream `pointerout`, `pointerleave` events, in that order.
   *
   * The tracking data for the specific pointer is cleared of a `overTarget`.
   * @param from - The upstream `pointerout` event.
   */
  mapPointerOut(t) {
    if (!(t instanceof oe)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const e = this.trackingData(t.pointerId);
    if (e.overTargets) {
      const i = t.pointerType === "mouse" || t.pointerType === "pen", s = this.findMountedTarget(e.overTargets), n = this.createPointerEvent(t, "pointerout", s);
      this.dispatchEvent(n), i && this.dispatchEvent(n, "mouseout");
      const o = this.createPointerEvent(t, "pointerleave", s);
      for (o.eventPhase = o.AT_TARGET; o.target && o.target !== this.rootTarget.parent; )
        o.currentTarget = o.target, this.notifyTarget(o), i && this.notifyTarget(o, "mouseleave"), o.target = o.target.parent;
      e.overTargets = null, this.freeEvent(n), this.freeEvent(o);
    }
    this.cursor = null;
  }
  /**
   * Maps the upstream `pointerup` event to downstream `pointerup`, `pointerupoutside`,
   * and `click`/`rightclick`/`pointertap` events, in that order.
   *
   * The `pointerupoutside` event bubbles from the original `pointerdown` target to the most specific
   * ancestor of the `pointerdown` and `pointerup` targets, which is also the `click` event's target. `touchend`,
   * `rightup`, `mouseup`, `touchendoutside`, `rightupoutside`, `mouseupoutside`, and `tap` are fired as well for
   * specific pointer types.
   * @param from - The upstream `pointerup` event.
   */
  mapPointerUp(t) {
    if (!(t instanceof oe)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const e = performance.now(), i = this.createPointerEvent(t);
    if (this.dispatchEvent(i, "pointerup"), i.pointerType === "touch")
      this.dispatchEvent(i, "touchend");
    else if (i.pointerType === "mouse" || i.pointerType === "pen") {
      const a = i.button === 2;
      this.dispatchEvent(i, a ? "rightup" : "mouseup");
    }
    const s = this.trackingData(t.pointerId), n = this.findMountedTarget(s.pressTargetsByButton[t.button]);
    let o = n;
    if (n && !i.composedPath().includes(n)) {
      let a = n;
      for (; a && !i.composedPath().includes(a); ) {
        if (i.currentTarget = a, this.notifyTarget(i, "pointerupoutside"), i.pointerType === "touch")
          this.notifyTarget(i, "touchendoutside");
        else if (i.pointerType === "mouse" || i.pointerType === "pen") {
          const h = i.button === 2;
          this.notifyTarget(i, h ? "rightupoutside" : "mouseupoutside");
        }
        a = a.parent;
      }
      delete s.pressTargetsByButton[t.button], o = a;
    }
    if (o) {
      const a = this.clonePointerEvent(i, "click");
      a.target = o, a.path = null, s.clicksByButton[t.button] || (s.clicksByButton[t.button] = {
        clickCount: 0,
        target: a.target,
        timeStamp: e
      });
      const h = s.clicksByButton[t.button];
      if (h.target === a.target && e - h.timeStamp < 200 ? ++h.clickCount : h.clickCount = 1, h.target = a.target, h.timeStamp = e, a.detail = h.clickCount, a.pointerType === "mouse") {
        const l = a.button === 2;
        this.dispatchEvent(a, l ? "rightclick" : "click");
      } else
        a.pointerType === "touch" && this.dispatchEvent(a, "tap");
      this.dispatchEvent(a, "pointertap"), this.freeEvent(a);
    }
    this.freeEvent(i);
  }
  /**
   * Maps the upstream `pointerupoutside` event to a downstream `pointerupoutside` event, bubbling from the original
   * `pointerdown` target to `rootTarget`.
   *
   * (The most specific ancestor of the `pointerdown` event and the `pointerup` event must the
   * `{@link PIXI.EventBoundary}'s root because the `pointerup` event occurred outside of the boundary.)
   *
   * `touchendoutside`, `mouseupoutside`, and `rightupoutside` events are fired as well for specific pointer
   * types. The tracking data for the specific pointer is cleared of a `pressTarget`.
   * @param from - The upstream `pointerupoutside` event.
   */
  mapPointerUpOutside(t) {
    if (!(t instanceof oe)) {
      console.warn("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const e = this.trackingData(t.pointerId), i = this.findMountedTarget(e.pressTargetsByButton[t.button]), s = this.createPointerEvent(t);
    if (i) {
      let n = i;
      for (; n; )
        s.currentTarget = n, this.notifyTarget(s, "pointerupoutside"), s.pointerType === "touch" ? this.notifyTarget(s, "touchendoutside") : (s.pointerType === "mouse" || s.pointerType === "pen") && this.notifyTarget(s, s.button === 2 ? "rightupoutside" : "mouseupoutside"), n = n.parent;
      delete e.pressTargetsByButton[t.button];
    }
    this.freeEvent(s);
  }
  /**
   * Maps the upstream `wheel` event to a downstream `wheel` event.
   * @param from - The upstream `wheel` event.
   */
  mapWheel(t) {
    if (!(t instanceof Kr)) {
      console.warn("EventBoundary cannot map a non-wheel event as a wheel event");
      return;
    }
    const e = this.createWheelEvent(t);
    this.dispatchEvent(e), this.freeEvent(e);
  }
  /**
   * Finds the most specific event-target in the given propagation path that is still mounted in the scene graph.
   *
   * This is used to find the correct `pointerup` and `pointerout` target in the case that the original `pointerdown`
   * or `pointerover` target was unmounted from the scene graph.
   * @param propagationPath - The propagation path was valid in the past.
   * @returns - The most specific event-target still mounted at the same location in the scene graph.
   */
  findMountedTarget(t) {
    if (!t)
      return null;
    let e = t[0];
    for (let i = 1; i < t.length && t[i].parent === e; i++)
      e = t[i];
    return e;
  }
  /**
   * Creates an event whose {@code originalEvent} is {@code from}, with an optional `type` and `target` override.
   *
   * The event is allocated using {@link PIXI.EventBoundary#allocateEvent this.allocateEvent}.
   * @param from - The {@code originalEvent} for the returned event.
   * @param [type=from.type] - The type of the returned event.
   * @param target - The target of the returned event.
   */
  createPointerEvent(t, e, i) {
    const s = this.allocateEvent(oe);
    return this.copyPointerData(t, s), this.copyMouseData(t, s), this.copyData(t, s), s.nativeEvent = t.nativeEvent, s.originalEvent = t, s.target = i ?? this.hitTest(s.global.x, s.global.y) ?? this._hitElements[0], typeof e == "string" && (s.type = e), s;
  }
  /**
   * Creates a wheel event whose {@code originalEvent} is {@code from}.
   *
   * The event is allocated using {@link PIXI.EventBoundary#allocateEvent this.allocateEvent}.
   * @param from - The upstream wheel event.
   */
  createWheelEvent(t) {
    const e = this.allocateEvent(Kr);
    return this.copyWheelData(t, e), this.copyMouseData(t, e), this.copyData(t, e), e.nativeEvent = t.nativeEvent, e.originalEvent = t, e.target = this.hitTest(e.global.x, e.global.y), e;
  }
  /**
   * Clones the event {@code from}, with an optional {@code type} override.
   *
   * The event is allocated using {@link PIXI.EventBoundary#allocateEvent this.allocateEvent}.
   * @param from - The event to clone.
   * @param [type=from.type] - The type of the returned event.
   */
  clonePointerEvent(t, e) {
    const i = this.allocateEvent(oe);
    return i.nativeEvent = t.nativeEvent, i.originalEvent = t.originalEvent, this.copyPointerData(t, i), this.copyMouseData(t, i), this.copyData(t, i), i.target = t.target, i.path = t.composedPath().slice(), i.type = e ?? i.type, i;
  }
  /**
   * Copies wheel {@link PIXI.FederatedWheelEvent} data from {@code from} into {@code to}.
   *
   * The following properties are copied:
   * + deltaMode
   * + deltaX
   * + deltaY
   * + deltaZ
   * @param from
   * @param to
   */
  copyWheelData(t, e) {
    e.deltaMode = t.deltaMode, e.deltaX = t.deltaX, e.deltaY = t.deltaY, e.deltaZ = t.deltaZ;
  }
  /**
   * Copies pointer {@link PIXI.FederatedPointerEvent} data from {@code from} into {@code to}.
   *
   * The following properties are copied:
   * + pointerId
   * + width
   * + height
   * + isPrimary
   * + pointerType
   * + pressure
   * + tangentialPressure
   * + tiltX
   * + tiltY
   * @param from
   * @param to
   */
  copyPointerData(t, e) {
    t instanceof oe && e instanceof oe && (e.pointerId = t.pointerId, e.width = t.width, e.height = t.height, e.isPrimary = t.isPrimary, e.pointerType = t.pointerType, e.pressure = t.pressure, e.tangentialPressure = t.tangentialPressure, e.tiltX = t.tiltX, e.tiltY = t.tiltY, e.twist = t.twist);
  }
  /**
   * Copies mouse {@link PIXI.FederatedMouseEvent} data from {@code from} to {@code to}.
   *
   * The following properties are copied:
   * + altKey
   * + button
   * + buttons
   * + clientX
   * + clientY
   * + metaKey
   * + movementX
   * + movementY
   * + pageX
   * + pageY
   * + x
   * + y
   * + screen
   * + shiftKey
   * + global
   * @param from
   * @param to
   */
  copyMouseData(t, e) {
    t instanceof Ns && e instanceof Ns && (e.altKey = t.altKey, e.button = t.button, e.buttons = t.buttons, e.client.copyFrom(t.client), e.ctrlKey = t.ctrlKey, e.metaKey = t.metaKey, e.movement.copyFrom(t.movement), e.screen.copyFrom(t.screen), e.shiftKey = t.shiftKey, e.global.copyFrom(t.global));
  }
  /**
   * Copies base {@link PIXI.FederatedEvent} data from {@code from} into {@code to}.
   *
   * The following properties are copied:
   * + isTrusted
   * + srcElement
   * + timeStamp
   * + type
   * @param from - The event to copy data from.
   * @param to - The event to copy data into.
   */
  copyData(t, e) {
    e.isTrusted = t.isTrusted, e.srcElement = t.srcElement, e.timeStamp = performance.now(), e.type = t.type, e.detail = t.detail, e.view = t.view, e.which = t.which, e.layer.copyFrom(t.layer), e.page.copyFrom(t.page);
  }
  /**
   * @param id - The pointer ID.
   * @returns The tracking data stored for the given pointer. If no data exists, a blank
   *  state will be created.
   */
  trackingData(t) {
    return this.mappingState.trackingData[t] || (this.mappingState.trackingData[t] = {
      pressTargetsByButton: {},
      clicksByButton: {},
      overTarget: null
    }), this.mappingState.trackingData[t];
  }
  /**
   * Allocate a specific type of event from {@link PIXI.EventBoundary#eventPool this.eventPool}.
   *
   * This allocation is constructor-agnostic, as long as it only takes one argument - this event
   * boundary.
   * @param constructor - The event's constructor.
   */
  allocateEvent(t) {
    this.eventPool.has(t) || this.eventPool.set(t, []);
    const e = this.eventPool.get(t).pop() || new t(this);
    return e.eventPhase = e.NONE, e.currentTarget = null, e.path = null, e.target = null, e;
  }
  /**
   * Frees the event and puts it back into the event pool.
   *
   * It is illegal to reuse the event until it is allocated again, using `this.allocateEvent`.
   *
   * It is also advised that events not allocated from {@link PIXI.EventBoundary#allocateEvent this.allocateEvent}
   * not be freed. This is because of the possibility that the same event is freed twice, which can cause
   * it to be allocated twice & result in overwriting.
   * @param event - The event to be freed.
   * @throws Error if the event is managed by another event boundary.
   */
  freeEvent(t) {
    if (t.manager !== this)
      throw new Error("It is illegal to free an event not managed by this EventBoundary!");
    const e = t.constructor;
    this.eventPool.has(e) || this.eventPool.set(e, []), this.eventPool.get(e).push(t);
  }
  /**
   * Similar to {@link PIXI.EventEmitter.emit}, except it stops if the `propagationImmediatelyStopped` flag
   * is set on the event.
   * @param e - The event to call each listener with.
   * @param type - The event key.
   */
  notifyListeners(t, e) {
    const i = t.currentTarget._events[e];
    if (i && t.currentTarget.isInteractive())
      if ("fn" in i)
        i.once && t.currentTarget.removeListener(e, i.fn, void 0, !0), i.fn.call(i.context, t);
      else
        for (let s = 0, n = i.length; s < n && !t.propagationImmediatelyStopped; s++)
          i[s].once && t.currentTarget.removeListener(e, i[s].fn, void 0, !0), i[s].fn.call(i[s].context, t);
  }
}
const I0 = 1, C0 = {
  touchstart: "pointerdown",
  touchend: "pointerup",
  touchendoutside: "pointerupoutside",
  touchmove: "pointermove",
  touchcancel: "pointercancel"
}, Oo = class Lo {
  /**
   * @param {PIXI.Renderer} renderer
   */
  constructor(t) {
    this.supportsTouchEvents = "ontouchstart" in globalThis, this.supportsPointerEvents = !!globalThis.PointerEvent, this.domElement = null, this.resolution = 1, this.renderer = t, this.rootBoundary = new S0(null), Ve.init(this), this.autoPreventDefault = !0, this.eventsAdded = !1, this.rootPointerEvent = new oe(null), this.rootWheelEvent = new Kr(null), this.cursorStyles = {
      default: "inherit",
      pointer: "pointer"
    }, this.features = new Proxy({ ...Lo.defaultEventFeatures }, {
      set: (e, i, s) => (i === "globalMove" && (this.rootBoundary.enableGlobalMoveEvents = s), e[i] = s, !0)
    }), this.onPointerDown = this.onPointerDown.bind(this), this.onPointerMove = this.onPointerMove.bind(this), this.onPointerUp = this.onPointerUp.bind(this), this.onPointerOverOut = this.onPointerOverOut.bind(this), this.onWheel = this.onWheel.bind(this);
  }
  /**
   * The default interaction mode for all display objects.
   * @see PIXI.DisplayObject.eventMode
   * @type {PIXI.EventMode}
   * @readonly
   * @since 7.2.0
   */
  static get defaultEventMode() {
    return this._defaultEventMode;
  }
  /**
   * Runner init called, view is available at this point.
   * @ignore
   */
  init(t) {
    const { view: e, resolution: i } = this.renderer;
    this.setTargetElement(e), this.resolution = i, Lo._defaultEventMode = t.eventMode ?? "auto", Object.assign(this.features, t.eventFeatures ?? {}), this.rootBoundary.enableGlobalMoveEvents = this.features.globalMove;
  }
  /**
   * Handle changing resolution.
   * @ignore
   */
  resolutionChange(t) {
    this.resolution = t;
  }
  /** Destroys all event listeners and detaches the renderer. */
  destroy() {
    this.setTargetElement(null), this.renderer = null;
  }
  /**
   * Sets the current cursor mode, handling any callbacks or CSS style changes.
   * @param mode - cursor mode, a key from the cursorStyles dictionary
   */
  setCursor(t) {
    t = t || "default";
    let e = !0;
    if (globalThis.OffscreenCanvas && this.domElement instanceof OffscreenCanvas && (e = !1), this.currentCursor === t)
      return;
    this.currentCursor = t;
    const i = this.cursorStyles[t];
    if (i)
      switch (typeof i) {
        case "string":
          e && (this.domElement.style.cursor = i);
          break;
        case "function":
          i(t);
          break;
        case "object":
          e && Object.assign(this.domElement.style, i);
          break;
      }
    else
      e && typeof t == "string" && !Object.prototype.hasOwnProperty.call(this.cursorStyles, t) && (this.domElement.style.cursor = t);
  }
  /**
   * The global pointer event.
   * Useful for getting the pointer position without listening to events.
   * @since 7.2.0
   */
  get pointer() {
    return this.rootPointerEvent;
  }
  /**
   * Event handler for pointer down events on {@link PIXI.EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  onPointerDown(t) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    const e = this.normalizeToPointerData(t);
    this.autoPreventDefault && e[0].isNormalized && (t.cancelable || !("cancelable" in t)) && t.preventDefault();
    for (let i = 0, s = e.length; i < s; i++) {
      const n = e[i], o = this.bootstrapEvent(this.rootPointerEvent, n);
      this.rootBoundary.mapEvent(o);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer move events on on {@link PIXI.EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch events.
   */
  onPointerMove(t) {
    if (!this.features.move)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, Ve.pointerMoved();
    const e = this.normalizeToPointerData(t);
    for (let i = 0, s = e.length; i < s; i++) {
      const n = this.bootstrapEvent(this.rootPointerEvent, e[i]);
      this.rootBoundary.mapEvent(n);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer up events on {@link PIXI.EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  onPointerUp(t) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    let e = t.target;
    t.composedPath && t.composedPath().length > 0 && (e = t.composedPath()[0]);
    const i = e !== this.domElement ? "outside" : "", s = this.normalizeToPointerData(t);
    for (let n = 0, o = s.length; n < o; n++) {
      const a = this.bootstrapEvent(this.rootPointerEvent, s[n]);
      a.type += i, this.rootBoundary.mapEvent(a);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer over & out events on {@link PIXI.EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  onPointerOverOut(t) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    const e = this.normalizeToPointerData(t);
    for (let i = 0, s = e.length; i < s; i++) {
      const n = this.bootstrapEvent(this.rootPointerEvent, e[i]);
      this.rootBoundary.mapEvent(n);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Passive handler for `wheel` events on {@link PIXI.EventSystem.domElement this.domElement}.
   * @param nativeEvent - The native wheel event.
   */
  onWheel(t) {
    if (!this.features.wheel)
      return;
    const e = this.normalizeWheelEvent(t);
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, this.rootBoundary.mapEvent(e);
  }
  /**
   * Sets the {@link PIXI.EventSystem#domElement domElement} and binds event listeners.
   *
   * To deregister the current DOM element without setting a new one, pass {@code null}.
   * @param element - The new DOM element.
   */
  setTargetElement(t) {
    this.removeEvents(), this.domElement = t, Ve.domElement = t, this.addEvents();
  }
  /** Register event listeners on {@link PIXI.Renderer#domElement this.domElement}. */
  addEvents() {
    if (this.eventsAdded || !this.domElement)
      return;
    Ve.addTickerListener();
    const t = this.domElement.style;
    t && (globalThis.navigator.msPointerEnabled ? (t.msContentZooming = "none", t.msTouchAction = "none") : this.supportsPointerEvents && (t.touchAction = "none")), this.supportsPointerEvents ? (globalThis.document.addEventListener("pointermove", this.onPointerMove, !0), this.domElement.addEventListener("pointerdown", this.onPointerDown, !0), this.domElement.addEventListener("pointerleave", this.onPointerOverOut, !0), this.domElement.addEventListener("pointerover", this.onPointerOverOut, !0), globalThis.addEventListener("pointerup", this.onPointerUp, !0)) : (globalThis.document.addEventListener("mousemove", this.onPointerMove, !0), this.domElement.addEventListener("mousedown", this.onPointerDown, !0), this.domElement.addEventListener("mouseout", this.onPointerOverOut, !0), this.domElement.addEventListener("mouseover", this.onPointerOverOut, !0), globalThis.addEventListener("mouseup", this.onPointerUp, !0), this.supportsTouchEvents && (this.domElement.addEventListener("touchstart", this.onPointerDown, !0), this.domElement.addEventListener("touchend", this.onPointerUp, !0), this.domElement.addEventListener("touchmove", this.onPointerMove, !0))), this.domElement.addEventListener("wheel", this.onWheel, {
      passive: !0,
      capture: !0
    }), this.eventsAdded = !0;
  }
  /** Unregister event listeners on {@link PIXI.EventSystem#domElement this.domElement}. */
  removeEvents() {
    if (!this.eventsAdded || !this.domElement)
      return;
    Ve.removeTickerListener();
    const t = this.domElement.style;
    globalThis.navigator.msPointerEnabled ? (t.msContentZooming = "", t.msTouchAction = "") : this.supportsPointerEvents && (t.touchAction = ""), this.supportsPointerEvents ? (globalThis.document.removeEventListener("pointermove", this.onPointerMove, !0), this.domElement.removeEventListener("pointerdown", this.onPointerDown, !0), this.domElement.removeEventListener("pointerleave", this.onPointerOverOut, !0), this.domElement.removeEventListener("pointerover", this.onPointerOverOut, !0), globalThis.removeEventListener("pointerup", this.onPointerUp, !0)) : (globalThis.document.removeEventListener("mousemove", this.onPointerMove, !0), this.domElement.removeEventListener("mousedown", this.onPointerDown, !0), this.domElement.removeEventListener("mouseout", this.onPointerOverOut, !0), this.domElement.removeEventListener("mouseover", this.onPointerOverOut, !0), globalThis.removeEventListener("mouseup", this.onPointerUp, !0), this.supportsTouchEvents && (this.domElement.removeEventListener("touchstart", this.onPointerDown, !0), this.domElement.removeEventListener("touchend", this.onPointerUp, !0), this.domElement.removeEventListener("touchmove", this.onPointerMove, !0))), this.domElement.removeEventListener("wheel", this.onWheel, !0), this.domElement = null, this.eventsAdded = !1;
  }
  /**
   * Maps x and y coords from a DOM object and maps them correctly to the PixiJS view. The
   * resulting value is stored in the point. This takes into account the fact that the DOM
   * element could be scaled and positioned anywhere on the screen.
   * @param  {PIXI.IPointData} point - the point that the result will be stored in
   * @param  {number} x - the x coord of the position to map
   * @param  {number} y - the y coord of the position to map
   */
  mapPositionToPoint(t, e, i) {
    const s = this.domElement.isConnected ? this.domElement.getBoundingClientRect() : {
      x: 0,
      y: 0,
      width: this.domElement.width,
      height: this.domElement.height,
      left: 0,
      top: 0
    }, n = 1 / this.resolution;
    t.x = (e - s.left) * (this.domElement.width / s.width) * n, t.y = (i - s.top) * (this.domElement.height / s.height) * n;
  }
  /**
   * Ensures that the original event object contains all data that a regular pointer event would have
   * @param event - The original event data from a touch or mouse event
   * @returns An array containing a single normalized pointer event, in the case of a pointer
   *  or mouse event, or a multiple normalized pointer events if there are multiple changed touches
   */
  normalizeToPointerData(t) {
    const e = [];
    if (this.supportsTouchEvents && t instanceof TouchEvent)
      for (let i = 0, s = t.changedTouches.length; i < s; i++) {
        const n = t.changedTouches[i];
        typeof n.button > "u" && (n.button = 0), typeof n.buttons > "u" && (n.buttons = 1), typeof n.isPrimary > "u" && (n.isPrimary = t.touches.length === 1 && t.type === "touchstart"), typeof n.width > "u" && (n.width = n.radiusX || 1), typeof n.height > "u" && (n.height = n.radiusY || 1), typeof n.tiltX > "u" && (n.tiltX = 0), typeof n.tiltY > "u" && (n.tiltY = 0), typeof n.pointerType > "u" && (n.pointerType = "touch"), typeof n.pointerId > "u" && (n.pointerId = n.identifier || 0), typeof n.pressure > "u" && (n.pressure = n.force || 0.5), typeof n.twist > "u" && (n.twist = 0), typeof n.tangentialPressure > "u" && (n.tangentialPressure = 0), typeof n.layerX > "u" && (n.layerX = n.offsetX = n.clientX), typeof n.layerY > "u" && (n.layerY = n.offsetY = n.clientY), n.isNormalized = !0, n.type = t.type, e.push(n);
      }
    else if (!globalThis.MouseEvent || t instanceof MouseEvent && (!this.supportsPointerEvents || !(t instanceof globalThis.PointerEvent))) {
      const i = t;
      typeof i.isPrimary > "u" && (i.isPrimary = !0), typeof i.width > "u" && (i.width = 1), typeof i.height > "u" && (i.height = 1), typeof i.tiltX > "u" && (i.tiltX = 0), typeof i.tiltY > "u" && (i.tiltY = 0), typeof i.pointerType > "u" && (i.pointerType = "mouse"), typeof i.pointerId > "u" && (i.pointerId = I0), typeof i.pressure > "u" && (i.pressure = 0.5), typeof i.twist > "u" && (i.twist = 0), typeof i.tangentialPressure > "u" && (i.tangentialPressure = 0), i.isNormalized = !0, e.push(i);
    } else
      e.push(t);
    return e;
  }
  /**
   * Normalizes the native {@link https://w3c.github.io/uievents/#interface-wheelevent WheelEvent}.
   *
   * The returned {@link PIXI.FederatedWheelEvent} is a shared instance. It will not persist across
   * multiple native wheel events.
   * @param nativeEvent - The native wheel event that occurred on the canvas.
   * @returns A federated wheel event.
   */
  normalizeWheelEvent(t) {
    const e = this.rootWheelEvent;
    return this.transferMouseData(e, t), e.deltaX = t.deltaX, e.deltaY = t.deltaY, e.deltaZ = t.deltaZ, e.deltaMode = t.deltaMode, this.mapPositionToPoint(e.screen, t.clientX, t.clientY), e.global.copyFrom(e.screen), e.offset.copyFrom(e.screen), e.nativeEvent = t, e.type = t.type, e;
  }
  /**
   * Normalizes the `nativeEvent` into a federateed {@link PIXI.FederatedPointerEvent}.
   * @param event
   * @param nativeEvent
   */
  bootstrapEvent(t, e) {
    return t.originalEvent = null, t.nativeEvent = e, t.pointerId = e.pointerId, t.width = e.width, t.height = e.height, t.isPrimary = e.isPrimary, t.pointerType = e.pointerType, t.pressure = e.pressure, t.tangentialPressure = e.tangentialPressure, t.tiltX = e.tiltX, t.tiltY = e.tiltY, t.twist = e.twist, this.transferMouseData(t, e), this.mapPositionToPoint(t.screen, e.clientX, e.clientY), t.global.copyFrom(t.screen), t.offset.copyFrom(t.screen), t.isTrusted = e.isTrusted, t.type === "pointerleave" && (t.type = "pointerout"), t.type.startsWith("mouse") && (t.type = t.type.replace("mouse", "pointer")), t.type.startsWith("touch") && (t.type = C0[t.type] || t.type), t;
  }
  /**
   * Transfers base & mouse event data from the {@code nativeEvent} to the federated event.
   * @param event
   * @param nativeEvent
   */
  transferMouseData(t, e) {
    t.isTrusted = e.isTrusted, t.srcElement = e.srcElement, t.timeStamp = performance.now(), t.type = e.type, t.altKey = e.altKey, t.button = e.button, t.buttons = e.buttons, t.client.x = e.clientX, t.client.y = e.clientY, t.ctrlKey = e.ctrlKey, t.metaKey = e.metaKey, t.movement.x = e.movementX, t.movement.y = e.movementY, t.page.x = e.pageX, t.page.y = e.pageY, t.relatedTarget = null, t.shiftKey = e.shiftKey;
  }
};
Oo.extension = {
  name: "events",
  type: [
    k.RendererSystem,
    k.CanvasRendererSystem
  ]
}, /**
* The event features that are enabled by the EventSystem
* This option only is available when using **@pixi/events** package
* (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
* @since 7.2.0
*/
Oo.defaultEventFeatures = {
  move: !0,
  globalMove: !0,
  click: !0,
  wheel: !0
};
let No = Oo;
z.add(No);
function Nh(r) {
  return r === "dynamic" || r === "static";
}
const R0 = {
  /**
   * Property-based event handler for the `click` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onclick = (event) => {
   *  //some function here that happens on click
   * }
   */
  onclick: null,
  /**
   * Property-based event handler for the `mousedown` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onmousedown = (event) => {
   *  //some function here that happens on mousedown
   * }
   */
  onmousedown: null,
  /**
   * Property-based event handler for the `mouseenter` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onmouseenter = (event) => {
   *  //some function here that happens on mouseenter
   * }
   */
  onmouseenter: null,
  /**
   * Property-based event handler for the `mouseleave` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onmouseleave = (event) => {
   *  //some function here that happens on mouseleave
   * }
   */
  onmouseleave: null,
  /**
   * Property-based event handler for the `mousemove` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onmousemove = (event) => {
   *  //some function here that happens on mousemove
   * }
   */
  onmousemove: null,
  /**
   * Property-based event handler for the `globalmousemove` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onglobalmousemove = (event) => {
   *  //some function here that happens on globalmousemove
   * }
   */
  onglobalmousemove: null,
  /**
   * Property-based event handler for the `mouseout` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onmouseout = (event) => {
   *  //some function here that happens on mouseout
   * }
   */
  onmouseout: null,
  /**
   * Property-based event handler for the `mouseover` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onmouseover = (event) => {
   *  //some function here that happens on mouseover
   * }
   */
  onmouseover: null,
  /**
   * Property-based event handler for the `mouseup` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onmouseup = (event) => {
   *  //some function here that happens on mouseup
   * }
   */
  onmouseup: null,
  /**
   * Property-based event handler for the `mouseupoutside` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onmouseupoutside = (event) => {
   *  //some function here that happens on mouseupoutside
   * }
   */
  onmouseupoutside: null,
  /**
   * Property-based event handler for the `pointercancel` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onpointercancel = (event) => {
   *  //some function here that happens on pointercancel
   * }
   */
  onpointercancel: null,
  /**
   * Property-based event handler for the `pointerdown` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onpointerdown = (event) => {
   *  //some function here that happens on pointerdown
   * }
   */
  onpointerdown: null,
  /**
   * Property-based event handler for the `pointerenter` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onpointerenter = (event) => {
   *  //some function here that happens on pointerenter
   * }
   */
  onpointerenter: null,
  /**
   * Property-based event handler for the `pointerleave` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onpointerleave = (event) => {
   *  //some function here that happens on pointerleave
   * }
   */
  onpointerleave: null,
  /**
   * Property-based event handler for the `pointermove` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onpointermove = (event) => {
   *  //some function here that happens on pointermove
   * }
   */
  onpointermove: null,
  /**
   * Property-based event handler for the `globalpointermove` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onglobalpointermove = (event) => {
   *  //some function here that happens on globalpointermove
   * }
   */
  onglobalpointermove: null,
  /**
   * Property-based event handler for the `pointerout` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onpointerout = (event) => {
   *  //some function here that happens on pointerout
   * }
   */
  onpointerout: null,
  /**
   * Property-based event handler for the `pointerover` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onpointerover = (event) => {
   *  //some function here that happens on pointerover
   * }
   */
  onpointerover: null,
  /**
   * Property-based event handler for the `pointertap` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onpointertap = (event) => {
   *  //some function here that happens on pointertap
   * }
   */
  onpointertap: null,
  /**
   * Property-based event handler for the `pointerup` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onpointerup = (event) => {
   *  //some function here that happens on pointerup
   * }
   */
  onpointerup: null,
  /**
   * Property-based event handler for the `pointerupoutside` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onpointerupoutside = (event) => {
   *  //some function here that happens on pointerupoutside
   * }
   */
  onpointerupoutside: null,
  /**
   * Property-based event handler for the `rightclick` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onrightclick = (event) => {
   *  //some function here that happens on rightclick
   * }
   */
  onrightclick: null,
  /**
   * Property-based event handler for the `rightdown` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onrightdown = (event) => {
   *  //some function here that happens on rightdown
   * }
   */
  onrightdown: null,
  /**
   * Property-based event handler for the `rightup` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onrightup = (event) => {
   *  //some function here that happens on rightup
   * }
   */
  onrightup: null,
  /**
   * Property-based event handler for the `rightupoutside` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onrightupoutside = (event) => {
   *  //some function here that happens on rightupoutside
   * }
   */
  onrightupoutside: null,
  /**
   * Property-based event handler for the `tap` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.ontap = (event) => {
   *  //some function here that happens on tap
   * }
   */
  ontap: null,
  /**
   * Property-based event handler for the `touchcancel` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.ontouchcancel = (event) => {
   *  //some function here that happens on touchcancel
   * }
   */
  ontouchcancel: null,
  /**
   * Property-based event handler for the `touchend` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.ontouchend = (event) => {
   *  //some function here that happens on touchend
   * }
   */
  ontouchend: null,
  /**
   * Property-based event handler for the `touchendoutside` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.ontouchendoutside = (event) => {
   *  //some function here that happens on touchendoutside
   * }
   */
  ontouchendoutside: null,
  /**
   * Property-based event handler for the `touchmove` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.ontouchmove = (event) => {
   *  //some function here that happens on touchmove
   * }
   */
  ontouchmove: null,
  /**
   * Property-based event handler for the `globaltouchmove` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onglobaltouchmove = (event) => {
   *  //some function here that happens on globaltouchmove
   * }
   */
  onglobaltouchmove: null,
  /**
   * Property-based event handler for the `touchstart` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.ontouchstart = (event) => {
   *  //some function here that happens on touchstart
   * }
   */
  ontouchstart: null,
  /**
   * Property-based event handler for the `wheel` event.
   * @memberof PIXI.DisplayObject#
   * @default null
   * @example
   * this.onwheel = (event) => {
   *  //some function here that happens on wheel
   * }
   */
  onwheel: null,
  /**
   * @ignore
   */
  _internalInteractive: void 0,
  /**
   * Enable interaction events for the DisplayObject. Touch, pointer and mouse
   * @memberof PIXI.DisplayObject#
   */
  get interactive() {
    return this._internalInteractive ?? Nh(No.defaultEventMode);
  },
  set interactive(r) {
    it(
      "7.2.0",
      // eslint-disable-next-line max-len
      "Setting interactive is deprecated, use eventMode = 'none'/'passive'/'auto'/'static'/'dynamic' instead."
    ), this._internalInteractive = r, this.eventMode = r ? "static" : "auto";
  },
  /**
   * @ignore
   */
  _internalEventMode: void 0,
  /**
   * Enable interaction events for the DisplayObject. Touch, pointer and mouse.
   * This now replaces the `interactive` property.
   * There are 5 types of interaction settings:
   * - `'none'`: Ignores all interaction events, even on its children.
   * - `'passive'`: Does not emit events and ignores all hit testing on itself and non-interactive children.
   * Interactive children will still emit events.
   * - `'auto'`: Does not emit events but is hit tested if parent is interactive. Same as `interactive = false` in v7
   * - `'static'`: Emit events and is hit tested. Same as `interaction = true` in v7
   * - `'dynamic'`: Emits events and is hit tested but will also receive mock interaction events fired from a ticker to
   * allow for interaction when the mouse isn't moving
   * @example
   * import { Sprite } from 'pixi.js';
   *
   * const sprite = new Sprite(texture);
   * sprite.eventMode = 'static';
   * sprite.on('tap', (event) => {
   *     // Handle event
   * });
   * @memberof PIXI.DisplayObject#
   * @since 7.2.0
   */
  get eventMode() {
    return this._internalEventMode ?? No.defaultEventMode;
  },
  set eventMode(r) {
    this._internalInteractive = Nh(r), this._internalEventMode = r;
  },
  /**
   * Determines if the displayObject is interactive or not
   * @returns {boolean} Whether the displayObject is interactive or not
   * @memberof PIXI.DisplayObject#
   * @since 7.2.0
   * @example
   * import { Sprite } from 'pixi.js';
   * const sprite = new Sprite(texture);
   * sprite.eventMode = 'static';
   * sprite.isInteractive(); // true
   *
   * sprite.eventMode = 'dynamic';
   * sprite.isInteractive(); // true
   *
   * sprite.eventMode = 'none';
   * sprite.isInteractive(); // false
   *
   * sprite.eventMode = 'passive';
   * sprite.isInteractive(); // false
   *
   * sprite.eventMode = 'auto';
   * sprite.isInteractive(); // false
   */
  isInteractive() {
    return this.eventMode === "static" || this.eventMode === "dynamic";
  },
  /**
   * Determines if the children to the displayObject can be clicked/touched
   * Setting this to false allows PixiJS to bypass a recursive `hitTest` function
   * @memberof PIXI.Container#
   */
  interactiveChildren: !0,
  /**
   * Interaction shape. Children will be hit first, then this shape will be checked.
   * Setting this will cause this shape to be checked in hit tests rather than the displayObject's bounds.
   * @example
   * import { Rectangle, Sprite } from 'pixi.js';
   *
   * const sprite = new Sprite(texture);
   * sprite.interactive = true;
   * sprite.hitArea = new Rectangle(0, 0, 100, 100);
   * @member {PIXI.IHitArea}
   * @memberof PIXI.DisplayObject#
   */
  hitArea: null,
  /**
   * Unlike `on` or `addListener` which are methods from EventEmitter, `addEventListener`
   * seeks to be compatible with the DOM's `addEventListener` with support for options.
   * **IMPORTANT:** _Only_ available if using the `@pixi/events` package.
   * @memberof PIXI.DisplayObject
   * @param type - The type of event to listen to.
   * @param listener - The listener callback or object.
   * @param options - Listener options, used for capture phase.
   * @example
   * // Tell the user whether they did a single, double, triple, or nth click.
   * button.addEventListener('click', {
   *     handleEvent(e): {
   *         let prefix;
   *
   *         switch (e.detail) {
   *             case 1: prefix = 'single'; break;
   *             case 2: prefix = 'double'; break;
   *             case 3: prefix = 'triple'; break;
   *             default: prefix = e.detail + 'th'; break;
   *         }
   *
   *         console.log('That was a ' + prefix + 'click');
   *     }
   * });
   *
   * // But skip the first click!
   * button.parent.addEventListener('click', function blockClickOnce(e) {
   *     e.stopImmediatePropagation();
   *     button.parent.removeEventListener('click', blockClickOnce, true);
   * }, {
   *     capture: true,
   * });
   */
  addEventListener(r, t, e) {
    const i = typeof e == "boolean" && e || typeof e == "object" && e.capture, s = typeof t == "function" ? void 0 : t;
    r = i ? `${r}capture` : r, t = typeof t == "function" ? t : t.handleEvent, this.on(r, t, s);
  },
  /**
   * Unlike `off` or `removeListener` which are methods from EventEmitter, `removeEventListener`
   * seeks to be compatible with the DOM's `removeEventListener` with support for options.
   * **IMPORTANT:** _Only_ available if using the `@pixi/events` package.
   * @memberof PIXI.DisplayObject
   * @param type - The type of event the listener is bound to.
   * @param listener - The listener callback or object.
   * @param options - The original listener options. This is required to deregister a capture phase listener.
   */
  removeEventListener(r, t, e) {
    const i = typeof e == "boolean" && e || typeof e == "object" && e.capture, s = typeof t == "function" ? void 0 : t;
    r = i ? `${r}capture` : r, t = typeof t == "function" ? t : t.handleEvent, this.off(r, t, s);
  },
  /**
   * Dispatch the event on this {@link PIXI.DisplayObject} using the event's {@link PIXI.EventBoundary}.
   *
   * The target of the event is set to `this` and the `defaultPrevented` flag is cleared before dispatch.
   *
   * **IMPORTANT:** _Only_ available if using the `@pixi/events` package.
   * @memberof PIXI.DisplayObject
   * @param e - The event to dispatch.
   * @returns Whether the {@link PIXI.FederatedEvent.preventDefault preventDefault}() method was not invoked.
   * @example
   * // Reuse a click event!
   * button.dispatchEvent(clickEvent);
   */
  dispatchEvent(r) {
    if (!(r instanceof Fi))
      throw new Error("DisplayObject cannot propagate events outside of the Federated Events API");
    return r.defaultPrevented = !1, r.path = null, r.target = this, r.manager.dispatchEvent(r), !r.defaultPrevented;
  }
};
Et.mixin(R0);
const P0 = {
  /**
   *  Flag for if the object is accessible. If true AccessibilityManager will overlay a
   *   shadow div with attributes set
   * @member {boolean}
   * @memberof PIXI.DisplayObject#
   */
  accessible: !1,
  /**
   * Sets the title attribute of the shadow div
   * If accessibleTitle AND accessibleHint has not been this will default to 'displayObject [tabIndex]'
   * @member {?string}
   * @memberof PIXI.DisplayObject#
   */
  accessibleTitle: null,
  /**
   * Sets the aria-label attribute of the shadow div
   * @member {string}
   * @memberof PIXI.DisplayObject#
   */
  accessibleHint: null,
  /**
   * @member {number}
   * @memberof PIXI.DisplayObject#
   * @private
   * @todo Needs docs.
   */
  tabIndex: 0,
  /**
   * @member {boolean}
   * @memberof PIXI.DisplayObject#
   * @todo Needs docs.
   */
  _accessibleActive: !1,
  /**
   * @member {boolean}
   * @memberof PIXI.DisplayObject#
   * @todo Needs docs.
   */
  _accessibleDiv: null,
  /**
   * Specify the type of div the accessible layer is. Screen readers treat the element differently
   * depending on this type. Defaults to button.
   * @member {string}
   * @memberof PIXI.DisplayObject#
   * @default 'button'
   */
  accessibleType: "button",
  /**
   * Specify the pointer-events the accessible div will use
   * Defaults to auto.
   * @member {string}
   * @memberof PIXI.DisplayObject#
   * @default 'auto'
   */
  accessiblePointerEvents: "auto",
  /**
   * Setting to false will prevent any children inside this container to
   * be accessible. Defaults to true.
   * @member {boolean}
   * @memberof PIXI.DisplayObject#
   * @default true
   */
  accessibleChildren: !0,
  renderId: -1
};
Et.mixin(P0);
const M0 = 9, Ji = 100, B0 = 0, D0 = 0, kh = 2, Uh = 1, F0 = -1e3, O0 = -1e3, L0 = 2;
class iu {
  // 2fps
  /**
   * @param {PIXI.CanvasRenderer|PIXI.Renderer} renderer - A reference to the current renderer
   */
  constructor(t) {
    this.debug = !1, this._isActive = !1, this._isMobileAccessibility = !1, this.pool = [], this.renderId = 0, this.children = [], this.androidUpdateCount = 0, this.androidUpdateFrequency = 500, this._hookDiv = null, (Me.tablet || Me.phone) && this.createTouchHook();
    const e = document.createElement("div");
    e.style.width = `${Ji}px`, e.style.height = `${Ji}px`, e.style.position = "absolute", e.style.top = `${B0}px`, e.style.left = `${D0}px`, e.style.zIndex = kh.toString(), this.div = e, this.renderer = t, this._onKeyDown = this._onKeyDown.bind(this), this._onMouseMove = this._onMouseMove.bind(this), globalThis.addEventListener("keydown", this._onKeyDown, !1);
  }
  /**
   * Value of `true` if accessibility is currently active and accessibility layers are showing.
   * @member {boolean}
   * @readonly
   */
  get isActive() {
    return this._isActive;
  }
  /**
   * Value of `true` if accessibility is enabled for touch devices.
   * @member {boolean}
   * @readonly
   */
  get isMobileAccessibility() {
    return this._isMobileAccessibility;
  }
  /**
   * Creates the touch hooks.
   * @private
   */
  createTouchHook() {
    const t = document.createElement("button");
    t.style.width = `${Uh}px`, t.style.height = `${Uh}px`, t.style.position = "absolute", t.style.top = `${F0}px`, t.style.left = `${O0}px`, t.style.zIndex = L0.toString(), t.style.backgroundColor = "#FF0000", t.title = "select to enable accessibility for this content", t.addEventListener("focus", () => {
      this._isMobileAccessibility = !0, this.activate(), this.destroyTouchHook();
    }), document.body.appendChild(t), this._hookDiv = t;
  }
  /**
   * Destroys the touch hooks.
   * @private
   */
  destroyTouchHook() {
    this._hookDiv && (document.body.removeChild(this._hookDiv), this._hookDiv = null);
  }
  /**
   * Activating will cause the Accessibility layer to be shown.
   * This is called when a user presses the tab key.
   * @private
   */
  activate() {
    var t;
    this._isActive || (this._isActive = !0, globalThis.document.addEventListener("mousemove", this._onMouseMove, !0), globalThis.removeEventListener("keydown", this._onKeyDown, !1), this.renderer.on("postrender", this.update, this), (t = this.renderer.view.parentNode) == null || t.appendChild(this.div));
  }
  /**
   * Deactivating will cause the Accessibility layer to be hidden.
   * This is called when a user moves the mouse.
   * @private
   */
  deactivate() {
    var t;
    !this._isActive || this._isMobileAccessibility || (this._isActive = !1, globalThis.document.removeEventListener("mousemove", this._onMouseMove, !0), globalThis.addEventListener("keydown", this._onKeyDown, !1), this.renderer.off("postrender", this.update), (t = this.div.parentNode) == null || t.removeChild(this.div));
  }
  /**
   * This recursive function will run through the scene graph and add any new accessible objects to the DOM layer.
   * @private
   * @param {PIXI.Container} displayObject - The DisplayObject to check.
   */
  updateAccessibleObjects(t) {
    if (!t.visible || !t.accessibleChildren)
      return;
    t.accessible && t.isInteractive() && (t._accessibleActive || this.addChild(t), t.renderId = this.renderId);
    const e = t.children;
    if (e)
      for (let i = 0; i < e.length; i++)
        this.updateAccessibleObjects(e[i]);
  }
  /**
   * Before each render this function will ensure that all divs are mapped correctly to their DisplayObjects.
   * @private
   */
  update() {
    const t = performance.now();
    if (Me.android.device && t < this.androidUpdateCount || (this.androidUpdateCount = t + this.androidUpdateFrequency, !this.renderer.renderingToScreen))
      return;
    this.renderer.lastObjectRendered && this.updateAccessibleObjects(this.renderer.lastObjectRendered);
    const { x: e, y: i, width: s, height: n } = this.renderer.view.getBoundingClientRect(), { width: o, height: a, resolution: h } = this.renderer, l = s / o * h, c = n / a * h;
    let u = this.div;
    u.style.left = `${e}px`, u.style.top = `${i}px`, u.style.width = `${o}px`, u.style.height = `${a}px`;
    for (let d = 0; d < this.children.length; d++) {
      const f = this.children[d];
      if (f.renderId !== this.renderId)
        f._accessibleActive = !1, Yr(this.children, d, 1), this.div.removeChild(f._accessibleDiv), this.pool.push(f._accessibleDiv), f._accessibleDiv = null, d--;
      else {
        u = f._accessibleDiv;
        let p = f.hitArea;
        const m = f.worldTransform;
        f.hitArea ? (u.style.left = `${(m.tx + p.x * m.a) * l}px`, u.style.top = `${(m.ty + p.y * m.d) * c}px`, u.style.width = `${p.width * m.a * l}px`, u.style.height = `${p.height * m.d * c}px`) : (p = f.getBounds(), this.capHitArea(p), u.style.left = `${p.x * l}px`, u.style.top = `${p.y * c}px`, u.style.width = `${p.width * l}px`, u.style.height = `${p.height * c}px`, u.title !== f.accessibleTitle && f.accessibleTitle !== null && (u.title = f.accessibleTitle), u.getAttribute("aria-label") !== f.accessibleHint && f.accessibleHint !== null && u.setAttribute("aria-label", f.accessibleHint)), (f.accessibleTitle !== u.title || f.tabIndex !== u.tabIndex) && (u.title = f.accessibleTitle, u.tabIndex = f.tabIndex, this.debug && this.updateDebugHTML(u));
      }
    }
    this.renderId++;
  }
  /**
   * private function that will visually add the information to the
   * accessability div
   * @param {HTMLElement} div -
   */
  updateDebugHTML(t) {
    t.innerHTML = `type: ${t.type}</br> title : ${t.title}</br> tabIndex: ${t.tabIndex}`;
  }
  /**
   * Adjust the hit area based on the bounds of a display object
   * @param {PIXI.Rectangle} hitArea - Bounds of the child
   */
  capHitArea(t) {
    t.x < 0 && (t.width += t.x, t.x = 0), t.y < 0 && (t.height += t.y, t.y = 0);
    const { width: e, height: i } = this.renderer;
    t.x + t.width > e && (t.width = e - t.x), t.y + t.height > i && (t.height = i - t.y);
  }
  /**
   * Adds a DisplayObject to the accessibility manager
   * @private
   * @param {PIXI.DisplayObject} displayObject - The child to make accessible.
   */
  addChild(t) {
    let e = this.pool.pop();
    e || (e = document.createElement("button"), e.style.width = `${Ji}px`, e.style.height = `${Ji}px`, e.style.backgroundColor = this.debug ? "rgba(255,255,255,0.5)" : "transparent", e.style.position = "absolute", e.style.zIndex = kh.toString(), e.style.borderStyle = "none", navigator.userAgent.toLowerCase().includes("chrome") ? e.setAttribute("aria-live", "off") : e.setAttribute("aria-live", "polite"), navigator.userAgent.match(/rv:.*Gecko\//) ? e.setAttribute("aria-relevant", "additions") : e.setAttribute("aria-relevant", "text"), e.addEventListener("click", this._onClick.bind(this)), e.addEventListener("focus", this._onFocus.bind(this)), e.addEventListener("focusout", this._onFocusOut.bind(this))), e.style.pointerEvents = t.accessiblePointerEvents, e.type = t.accessibleType, t.accessibleTitle && t.accessibleTitle !== null ? e.title = t.accessibleTitle : (!t.accessibleHint || t.accessibleHint === null) && (e.title = `displayObject ${t.tabIndex}`), t.accessibleHint && t.accessibleHint !== null && e.setAttribute("aria-label", t.accessibleHint), this.debug && this.updateDebugHTML(e), t._accessibleActive = !0, t._accessibleDiv = e, e.displayObject = t, this.children.push(t), this.div.appendChild(t._accessibleDiv), t._accessibleDiv.tabIndex = t.tabIndex;
  }
  /**
   * Dispatch events with the EventSystem.
   * @param e
   * @param type
   * @private
   */
  _dispatchEvent(t, e) {
    const { displayObject: i } = t.target, s = this.renderer.events.rootBoundary, n = Object.assign(new Fi(s), { target: i });
    s.rootTarget = this.renderer.lastObjectRendered, e.forEach((o) => s.dispatchEvent(n, o));
  }
  /**
   * Maps the div button press to pixi's EventSystem (click)
   * @private
   * @param {MouseEvent} e - The click event.
   */
  _onClick(t) {
    this._dispatchEvent(t, ["click", "pointertap", "tap"]);
  }
  /**
   * Maps the div focus events to pixi's EventSystem (mouseover)
   * @private
   * @param {FocusEvent} e - The focus event.
   */
  _onFocus(t) {
    t.target.getAttribute("aria-live") || t.target.setAttribute("aria-live", "assertive"), this._dispatchEvent(t, ["mouseover"]);
  }
  /**
   * Maps the div focus events to pixi's EventSystem (mouseout)
   * @private
   * @param {FocusEvent} e - The focusout event.
   */
  _onFocusOut(t) {
    t.target.getAttribute("aria-live") || t.target.setAttribute("aria-live", "polite"), this._dispatchEvent(t, ["mouseout"]);
  }
  /**
   * Is called when a key is pressed
   * @private
   * @param {KeyboardEvent} e - The keydown event.
   */
  _onKeyDown(t) {
    t.keyCode === M0 && this.activate();
  }
  /**
   * Is called when the mouse moves across the renderer element
   * @private
   * @param {MouseEvent} e - The mouse event.
   */
  _onMouseMove(t) {
    t.movementX === 0 && t.movementY === 0 || this.deactivate();
  }
  /** Destroys the accessibility manager */
  destroy() {
    this.destroyTouchHook(), this.div = null, globalThis.document.removeEventListener("mousemove", this._onMouseMove, !0), globalThis.removeEventListener("keydown", this._onKeyDown), this.pool = null, this.children = null, this.renderer = null;
  }
}
iu.extension = {
  name: "accessibility",
  type: [
    k.RendererPlugin,
    k.CanvasRendererPlugin
  ]
};
z.add(iu);
const su = class ko {
  /**
   * @param options - The optional application and renderer parameters.
   */
  constructor(t) {
    this.stage = new de(), t = Object.assign({
      forceCanvas: !1
    }, t), this.renderer = $c(t), ko._plugins.forEach((e) => {
      e.init.call(this, t);
    });
  }
  /** Render the current stage. */
  render() {
    this.renderer.render(this.stage);
  }
  /**
   * Reference to the renderer's canvas element.
   * @member {PIXI.ICanvas}
   * @readonly
   */
  get view() {
    var t;
    return (t = this.renderer) == null ? void 0 : t.view;
  }
  /**
   * Reference to the renderer's screen rectangle. Its safe to use as `filterArea` or `hitArea` for the whole screen.
   * @member {PIXI.Rectangle}
   * @readonly
   */
  get screen() {
    var t;
    return (t = this.renderer) == null ? void 0 : t.screen;
  }
  /**
   * Destroy and don't use after this.
   * @param {boolean} [removeView=false] - Automatically remove canvas from DOM.
   * @param {object|boolean} [stageOptions] - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [stageOptions.children=false] - if set to true, all the children will have their destroy
   *  method called as well. 'stageOptions' will be passed on to those calls.
   * @param {boolean} [stageOptions.texture=false] - Only used for child Sprites if stageOptions.children is set
   *  to true. Should it destroy the texture of the child sprite
   * @param {boolean} [stageOptions.baseTexture=false] - Only used for child Sprites if stageOptions.children is set
   *  to true. Should it destroy the base texture of the child sprite
   */
  destroy(t, e) {
    const i = ko._plugins.slice(0);
    i.reverse(), i.forEach((s) => {
      s.destroy.call(this);
    }), this.stage.destroy(e), this.stage = null, this.renderer.destroy(t), this.renderer = null;
  }
};
su._plugins = [];
let N0 = su;
z.handleByList(k.Application, N0._plugins);
class nu {
  /**
   * Initialize the plugin with scope of application instance
   * @static
   * @private
   * @param {object} [options] - See application options
   */
  static init(t) {
    Object.defineProperty(
      this,
      "resizeTo",
      /**
       * The HTML element or window to automatically resize the
       * renderer's view element to match width and height.
       * @member {Window|HTMLElement}
       * @name resizeTo
       * @memberof PIXI.Application#
       */
      {
        set(e) {
          globalThis.removeEventListener("resize", this.queueResize), this._resizeTo = e, e && (globalThis.addEventListener("resize", this.queueResize), this.resize());
        },
        get() {
          return this._resizeTo;
        }
      }
    ), this.queueResize = () => {
      this._resizeTo && (this.cancelResize(), this._resizeId = requestAnimationFrame(() => this.resize()));
    }, this.cancelResize = () => {
      this._resizeId && (cancelAnimationFrame(this._resizeId), this._resizeId = null);
    }, this.resize = () => {
      if (!this._resizeTo)
        return;
      this.cancelResize();
      let e, i;
      if (this._resizeTo === globalThis.window)
        e = globalThis.innerWidth, i = globalThis.innerHeight;
      else {
        const { clientWidth: s, clientHeight: n } = this._resizeTo;
        e = s, i = n;
      }
      this.renderer.resize(e, i), this.render();
    }, this._resizeId = null, this._resizeTo = null, this.resizeTo = t.resizeTo || null;
  }
  /**
   * Clean up the ticker, scoped to application
   * @static
   * @private
   */
  static destroy() {
    globalThis.removeEventListener("resize", this.queueResize), this.cancelResize(), this.cancelResize = null, this.queueResize = null, this.resizeTo = null, this.resize = null;
  }
}
nu.extension = k.Application;
z.add(nu);
const Gh = {
  loader: k.LoadParser,
  resolver: k.ResolveParser,
  cache: k.CacheParser,
  detection: k.DetectionParser
};
z.handle(k.Asset, (r) => {
  const t = r.ref;
  Object.entries(Gh).filter(([e]) => !!t[e]).forEach(([e, i]) => z.add(Object.assign(
    t[e],
    // Allow the function to optionally define it's own
    // ExtensionMetadata, the use cases here is priority for LoaderParsers
    { extension: t[e].extension ?? i }
  )));
}, (r) => {
  const t = r.ref;
  Object.keys(Gh).filter((e) => !!t[e]).forEach((e) => z.remove(t[e]));
});
class k0 {
  /**
   * @param loader
   * @param verbose - should the loader log to the console
   */
  constructor(t, e = !1) {
    this._loader = t, this._assetList = [], this._isLoading = !1, this._maxConcurrent = 1, this.verbose = e;
  }
  /**
   * Adds an array of assets to load.
   * @param assetUrls - assets to load
   */
  add(t) {
    t.forEach((e) => {
      this._assetList.push(e);
    }), this.verbose && console.log("[BackgroundLoader] assets: ", this._assetList), this._isActive && !this._isLoading && this._next();
  }
  /**
   * Loads the next set of assets. Will try to load as many assets as it can at the same time.
   *
   * The max assets it will try to load at one time will be 4.
   */
  async _next() {
    if (this._assetList.length && this._isActive) {
      this._isLoading = !0;
      const t = [], e = Math.min(this._assetList.length, this._maxConcurrent);
      for (let i = 0; i < e; i++)
        t.push(this._assetList.pop());
      await this._loader.load(t), this._isLoading = !1, this._next();
    }
  }
  /**
   * Activate/Deactivate the loading. If set to true then it will immediately continue to load the next asset.
   * @returns whether the class is active
   */
  get active() {
    return this._isActive;
  }
  set active(t) {
    this._isActive !== t && (this._isActive = t, t && !this._isLoading && this._next());
  }
}
function si(r, t) {
  if (Array.isArray(t)) {
    for (const e of t)
      if (r.startsWith(`data:${e}`))
        return !0;
    return !1;
  }
  return r.startsWith(`data:${t}`);
}
function rr(r, t) {
  const e = r.split("?")[0], i = Rt.extname(e).toLowerCase();
  return Array.isArray(t) ? t.includes(i) : i === t;
}
const le = (r, t, e = !1) => (Array.isArray(r) || (r = [r]), t ? r.map((i) => typeof i == "string" || e ? t(i) : i) : r), Uo = (r, t) => {
  const e = t.split("?")[1];
  return e && (r += `?${e}`), r;
};
function ou(r, t, e, i, s) {
  const n = t[e];
  for (let o = 0; o < n.length; o++) {
    const a = n[o];
    e < t.length - 1 ? ou(r.replace(i[e], a), t, e + 1, i, s) : s.push(r.replace(i[e], a));
  }
}
function U0(r) {
  const t = /\{(.*?)\}/g, e = r.match(t), i = [];
  if (e) {
    const s = [];
    e.forEach((n) => {
      const o = n.substring(1, n.length - 1).split(",");
      s.push(o);
    }), ou(r, s, 0, e, i);
  } else
    i.push(r);
  return i;
}
const ks = (r) => !Array.isArray(r);
class G0 {
  constructor() {
    this._parsers = [], this._cache = /* @__PURE__ */ new Map(), this._cacheMap = /* @__PURE__ */ new Map();
  }
  /** Clear all entries. */
  reset() {
    this._cacheMap.clear(), this._cache.clear();
  }
  /**
   * Check if the key exists
   * @param key - The key to check
   */
  has(t) {
    return this._cache.has(t);
  }
  /**
   * Fetch entry by key
   * @param key - The key of the entry to get
   */
  get(t) {
    const e = this._cache.get(t);
    return e || console.warn(`[Assets] Asset id ${t} was not found in the Cache`), e;
  }
  /**
   * Set a value by key or keys name
   * @param key - The key or keys to set
   * @param value - The value to store in the cache or from which cacheable assets will be derived.
   */
  set(t, e) {
    const i = le(t);
    let s;
    for (let a = 0; a < this.parsers.length; a++) {
      const h = this.parsers[a];
      if (h.test(e)) {
        s = h.getCacheableAssets(i, e);
        break;
      }
    }
    s || (s = {}, i.forEach((a) => {
      s[a] = e;
    }));
    const n = Object.keys(s), o = {
      cacheKeys: n,
      keys: i
    };
    if (i.forEach((a) => {
      this._cacheMap.set(a, o);
    }), n.forEach((a) => {
      this._cache.has(a) && this._cache.get(a) !== e && console.warn("[Cache] already has key:", a), this._cache.set(a, s[a]);
    }), e instanceof j) {
      const a = e;
      i.forEach((h) => {
        a.baseTexture !== j.EMPTY.baseTexture && J.addToCache(a.baseTexture, h), j.addToCache(a, h);
      });
    }
  }
  /**
   * Remove entry by key
   *
   * This function will also remove any associated alias from the cache also.
   * @param key - The key of the entry to remove
   */
  remove(t) {
    if (!this._cacheMap.has(t)) {
      console.warn(`[Assets] Asset id ${t} was not found in the Cache`);
      return;
    }
    const e = this._cacheMap.get(t);
    e.cacheKeys.forEach((i) => {
      this._cache.delete(i);
    }), e.keys.forEach((i) => {
      this._cacheMap.delete(i);
    });
  }
  /** All loader parsers registered */
  get parsers() {
    return this._parsers;
  }
}
const dr = new G0();
class H0 {
  constructor() {
    this._parsers = [], this._parsersValidated = !1, this.parsers = new Proxy(this._parsers, {
      set: (t, e, i) => (this._parsersValidated = !1, t[e] = i, !0)
    }), this.promiseCache = {};
  }
  /** function used for testing */
  reset() {
    this._parsersValidated = !1, this.promiseCache = {};
  }
  /**
   * Used internally to generate a promise for the asset to be loaded.
   * @param url - The URL to be loaded
   * @param data - any custom additional information relevant to the asset being loaded
   * @returns - a promise that will resolve to an Asset for example a Texture of a JSON object
   */
  _getLoadPromiseAndParser(t, e) {
    const i = {
      promise: null,
      parser: null
    };
    return i.promise = (async () => {
      var o, a;
      let s = null, n = null;
      if (e.loadParser && (n = this._parserHash[e.loadParser], n || console.warn(`[Assets] specified load parser "${e.loadParser}" not found while loading ${t}`)), !n) {
        for (let h = 0; h < this.parsers.length; h++) {
          const l = this.parsers[h];
          if (l.load && ((o = l.test) != null && o.call(l, t, e, this))) {
            n = l;
            break;
          }
        }
        if (!n)
          return console.warn(`[Assets] ${t} could not be loaded as we don't know how to parse it, ensure the correct parser has been added`), null;
      }
      s = await n.load(t, e, this), i.parser = n;
      for (let h = 0; h < this.parsers.length; h++) {
        const l = this.parsers[h];
        l.parse && l.parse && await ((a = l.testParse) == null ? void 0 : a.call(l, s, e, this)) && (s = await l.parse(s, e, this) || s, i.parser = l);
      }
      return s;
    })(), i;
  }
  async load(t, e) {
    this._parsersValidated || this._validateParsers();
    let i = 0;
    const s = {}, n = ks(t), o = le(t, (l) => ({
      alias: [l],
      src: l
    })), a = o.length, h = o.map(async (l) => {
      const c = Rt.toAbsolute(l.src);
      if (!s[l.src])
        try {
          this.promiseCache[c] || (this.promiseCache[c] = this._getLoadPromiseAndParser(c, l)), s[l.src] = await this.promiseCache[c].promise, e && e(++i / a);
        } catch (u) {
          throw delete this.promiseCache[c], delete s[l.src], new Error(`[Loader.load] Failed to load ${c}.
${u}`);
        }
    });
    return await Promise.all(h), n ? s[o[0].src] : s;
  }
  /**
   * Unloads one or more assets. Any unloaded assets will be destroyed, freeing up memory for your app.
   * The parser that created the asset, will be the one that unloads it.
   * @example
   * // Single asset:
   * const asset = await Loader.load('cool.png');
   *
   * await Loader.unload('cool.png');
   *
   * console.log(asset.destroyed); // true
   * @param assetsToUnloadIn - urls that you want to unload, or a single one!
   */
  async unload(t) {
    const e = le(t, (i) => ({
      alias: [i],
      src: i
    })).map(async (i) => {
      var o, a;
      const s = Rt.toAbsolute(i.src), n = this.promiseCache[s];
      if (n) {
        const h = await n.promise;
        delete this.promiseCache[s], (a = (o = n.parser) == null ? void 0 : o.unload) == null || a.call(o, h, i, this);
      }
    });
    await Promise.all(e);
  }
  /** validates our parsers, right now it only checks for name conflicts but we can add more here as required! */
  _validateParsers() {
    this._parsersValidated = !0, this._parserHash = this._parsers.filter((t) => t.name).reduce((t, e) => (t[e.name] && console.warn(`[Assets] loadParser name conflict "${e.name}"`), { ...t, [e.name]: e }), {});
  }
}
var fe = /* @__PURE__ */ ((r) => (r[r.Low = 0] = "Low", r[r.Normal = 1] = "Normal", r[r.High = 2] = "High", r))(fe || {});
const V0 = ".json", X0 = "application/json", z0 = {
  extension: {
    type: k.LoadParser,
    priority: fe.Low
  },
  name: "loadJson",
  test(r) {
    return si(r, X0) || rr(r, V0);
  },
  async load(r) {
    return await (await H.ADAPTER.fetch(r)).json();
  }
};
z.add(z0);
const W0 = ".txt", j0 = "text/plain", $0 = {
  name: "loadTxt",
  extension: {
    type: k.LoadParser,
    priority: fe.Low
  },
  test(r) {
    return si(r, j0) || rr(r, W0);
  },
  async load(r) {
    return await (await H.ADAPTER.fetch(r)).text();
  }
};
z.add($0);
const Y0 = [
  "normal",
  "bold",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900"
], q0 = [".ttf", ".otf", ".woff", ".woff2"], K0 = [
  "font/ttf",
  "font/otf",
  "font/woff",
  "font/woff2"
], Z0 = /^(--|-?[A-Z_])[0-9A-Z_-]*$/i;
function Q0(r) {
  const t = Rt.extname(r), e = Rt.basename(r, t).replace(/(-|_)/g, " ").toLowerCase().split(" ").map((n) => n.charAt(0).toUpperCase() + n.slice(1));
  let i = e.length > 0;
  for (const n of e)
    if (!n.match(Z0)) {
      i = !1;
      break;
    }
  let s = e.join(" ");
  return i || (s = `"${s.replace(/[\\"]/g, "\\$&")}"`), s;
}
const J0 = /^[0-9A-Za-z%:/?#\[\]@!\$&'()\*\+,;=\-._~]*$/;
function ty(r) {
  return J0.test(r) ? r : encodeURI(r);
}
const ey = {
  extension: {
    type: k.LoadParser,
    priority: fe.Low
  },
  name: "loadWebFont",
  test(r) {
    return si(r, K0) || rr(r, q0);
  },
  async load(r, t) {
    var i, s, n;
    const e = H.ADAPTER.getFontFaceSet();
    if (e) {
      const o = [], a = ((i = t.data) == null ? void 0 : i.family) ?? Q0(r), h = ((n = (s = t.data) == null ? void 0 : s.weights) == null ? void 0 : n.filter((c) => Y0.includes(c))) ?? ["normal"], l = t.data ?? {};
      for (let c = 0; c < h.length; c++) {
        const u = h[c], d = new FontFace(a, `url(${ty(r)})`, {
          ...l,
          weight: u
        });
        await d.load(), e.add(d), o.push(d);
      }
      return o.length === 1 ? o[0] : o;
    }
    return console.warn("[loadWebFont] FontFace API is not supported. Skipping loading font"), null;
  },
  unload(r) {
    (Array.isArray(r) ? r : [r]).forEach((t) => H.ADAPTER.getFontFaceSet().delete(t));
  }
};
z.add(ey);
let Hh = 0, On;
const ry = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", iy = {
  id: "checkImageBitmap",
  code: `
    async function checkImageBitmap()
    {
        try
        {
            if (typeof createImageBitmap !== 'function') return false;

            const response = await fetch('${ry}');
            const imageBlob =  await response.blob();
            const imageBitmap = await createImageBitmap(imageBlob);

            return imageBitmap.width === 1 && imageBitmap.height === 1;
        }
        catch (e)
        {
            return false;
        }
    }
    checkImageBitmap().then((result) => { self.postMessage(result); });
    `
}, sy = {
  id: "loadImageBitmap",
  code: `
    async function loadImageBitmap(url)
    {
        const response = await fetch(url);

        if (!response.ok)
        {
            throw new Error(\`[WorkerManager.loadImageBitmap] Failed to fetch \${url}: \`
                + \`\${response.status} \${response.statusText}\`);
        }

        const imageBlob =  await response.blob();
        const imageBitmap = await createImageBitmap(imageBlob);

        return imageBitmap;
    }
    self.onmessage = async (event) =>
    {
        try
        {
            const imageBitmap = await loadImageBitmap(event.data.data[0]);

            self.postMessage({
                data: imageBitmap,
                uuid: event.data.uuid,
                id: event.data.id,
            }, [imageBitmap]);
        }
        catch(e)
        {
            self.postMessage({
                error: e,
                uuid: event.data.uuid,
                id: event.data.id,
            });
        }
    };`
};
let Ln;
class ny {
  constructor() {
    this._initialized = !1, this._createdWorkers = 0, this.workerPool = [], this.queue = [], this.resolveHash = {};
  }
  isImageBitmapSupported() {
    return this._isImageBitmapSupported !== void 0 ? this._isImageBitmapSupported : (this._isImageBitmapSupported = new Promise((t) => {
      const e = URL.createObjectURL(new Blob(
        [iy.code],
        { type: "application/javascript" }
      )), i = new Worker(e);
      i.addEventListener("message", (s) => {
        i.terminate(), URL.revokeObjectURL(e), t(s.data);
      });
    }), this._isImageBitmapSupported);
  }
  loadImageBitmap(t) {
    return this._run("loadImageBitmap", [t]);
  }
  async _initWorkers() {
    this._initialized || (this._initialized = !0);
  }
  getWorker() {
    On === void 0 && (On = navigator.hardwareConcurrency || 4);
    let t = this.workerPool.pop();
    return !t && this._createdWorkers < On && (Ln || (Ln = URL.createObjectURL(new Blob([sy.code], { type: "application/javascript" }))), this._createdWorkers++, t = new Worker(Ln), t.addEventListener("message", (e) => {
      this.complete(e.data), this.returnWorker(e.target), this.next();
    })), t;
  }
  returnWorker(t) {
    this.workerPool.push(t);
  }
  complete(t) {
    t.error !== void 0 ? this.resolveHash[t.uuid].reject(t.error) : this.resolveHash[t.uuid].resolve(t.data), this.resolveHash[t.uuid] = null;
  }
  async _run(t, e) {
    await this._initWorkers();
    const i = new Promise((s, n) => {
      this.queue.push({ id: t, arguments: e, resolve: s, reject: n });
    });
    return this.next(), i;
  }
  next() {
    if (!this.queue.length)
      return;
    const t = this.getWorker();
    if (!t)
      return;
    const e = this.queue.pop(), i = e.id;
    this.resolveHash[Hh] = { resolve: e.resolve, reject: e.reject }, t.postMessage({
      data: e.arguments,
      uuid: Hh++,
      id: i
    });
  }
}
const Vh = new ny();
function Oi(r, t, e) {
  r.resource.internal = !0;
  const i = new j(r), s = () => {
    delete t.promiseCache[e], dr.has(e) && dr.remove(e);
  };
  return i.baseTexture.once("destroyed", () => {
    e in t.promiseCache && (console.warn("[Assets] A BaseTexture managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the BaseTexture."), s());
  }), i.once("destroyed", () => {
    r.destroyed || (console.warn("[Assets] A Texture managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the Texture."), s());
  }), i;
}
const oy = [".jpeg", ".jpg", ".png", ".webp", ".avif"], ay = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
];
async function hy(r) {
  const t = await H.ADAPTER.fetch(r);
  if (!t.ok)
    throw new Error(`[loadImageBitmap] Failed to fetch ${r}: ${t.status} ${t.statusText}`);
  const e = await t.blob();
  return await createImageBitmap(e);
}
const Qs = {
  name: "loadTextures",
  extension: {
    type: k.LoadParser,
    priority: fe.High
  },
  config: {
    preferWorkers: !0,
    preferCreateImageBitmap: !0,
    crossOrigin: "anonymous"
  },
  test(r) {
    return si(r, ay) || rr(r, oy);
  },
  async load(r, t, e) {
    var a;
    const i = globalThis.createImageBitmap && this.config.preferCreateImageBitmap;
    let s;
    i ? this.config.preferWorkers && await Vh.isImageBitmapSupported() ? s = await Vh.loadImageBitmap(r) : s = await hy(r) : s = await new Promise((h, l) => {
      const c = new Image();
      c.crossOrigin = this.config.crossOrigin, c.src = r, c.complete ? h(c) : (c.onload = () => h(c), c.onerror = (u) => l(u));
    });
    const n = { ...t.data };
    n.resolution ?? (n.resolution = Oe(r)), i && ((a = n.resourceOptions) == null ? void 0 : a.ownsImageBitmap) === void 0 && (n.resourceOptions = { ...n.resourceOptions }, n.resourceOptions.ownsImageBitmap = !0);
    const o = new J(s, n);
    return o.resource.src = r, Oi(o, e, r);
  },
  unload(r) {
    r.destroy(!0);
  }
};
z.add(Qs);
const ly = ".svg", cy = "image/svg+xml", uy = {
  extension: {
    type: k.LoadParser,
    priority: fe.High
  },
  name: "loadSVG",
  test(r) {
    return si(r, cy) || rr(r, ly);
  },
  async testParse(r) {
    return Ro.test(r);
  },
  async parse(r, t, e) {
    var n;
    const i = new Ro(r, (n = t == null ? void 0 : t.data) == null ? void 0 : n.resourceOptions);
    await i.load();
    const s = new J(i, {
      resolution: Oe(r),
      ...t == null ? void 0 : t.data
    });
    return s.resource.src = t.src, Oi(s, e, t.src);
  },
  async load(r, t) {
    return (await H.ADAPTER.fetch(r)).text();
  },
  unload: Qs.unload
};
z.add(uy);
const dy = [".mp4", ".m4v", ".webm", ".ogv"], fy = [
  "video/mp4",
  "video/webm",
  "video/ogg"
], py = {
  name: "loadVideo",
  extension: {
    type: k.LoadParser,
    priority: fe.High
  },
  config: {
    defaultAutoPlay: !0
  },
  test(r) {
    return si(r, fy) || rr(r, dy);
  },
  async load(r, t, e) {
    var o;
    let i;
    const s = await (await H.ADAPTER.fetch(r)).blob(), n = URL.createObjectURL(s);
    try {
      const a = {
        autoPlay: this.config.defaultAutoPlay,
        ...(o = t == null ? void 0 : t.data) == null ? void 0 : o.resourceOptions
      }, h = new tu(n, a);
      await h.load();
      const l = new J(h, {
        alphaMode: await xm(),
        resolution: Oe(r),
        ...t == null ? void 0 : t.data
      });
      l.resource.src = r, i = Oi(l, e, r), i.baseTexture.once("destroyed", () => {
        URL.revokeObjectURL(n);
      });
    } catch (a) {
      throw URL.revokeObjectURL(n), a;
    }
    return i;
  },
  unload(r) {
    r.destroy(!0);
  }
};
z.add(py);
class my {
  constructor() {
    this._defaultBundleIdentifierOptions = {
      connector: "-",
      createBundleAssetId: (t, e) => `${t}${this._bundleIdConnector}${e}`,
      extractAssetIdFromBundle: (t, e) => e.replace(`${t}${this._bundleIdConnector}`, "")
    }, this._bundleIdConnector = this._defaultBundleIdentifierOptions.connector, this._createBundleAssetId = this._defaultBundleIdentifierOptions.createBundleAssetId, this._extractAssetIdFromBundle = this._defaultBundleIdentifierOptions.extractAssetIdFromBundle, this._assetMap = {}, this._preferredOrder = [], this._parsers = [], this._resolverHash = {}, this._bundles = {};
  }
  /**
   * Override how the resolver deals with generating bundle ids.
   * must be called before any bundles are added
   * @param bundleIdentifier - the bundle identifier options
   */
  setBundleIdentifier(t) {
    if (this._bundleIdConnector = t.connector ?? this._bundleIdConnector, this._createBundleAssetId = t.createBundleAssetId ?? this._createBundleAssetId, this._extractAssetIdFromBundle = t.extractAssetIdFromBundle ?? this._extractAssetIdFromBundle, this._extractAssetIdFromBundle("foo", this._createBundleAssetId("foo", "bar")) !== "bar")
      throw new Error("[Resolver] GenerateBundleAssetId are not working correctly");
  }
  /**
   * Let the resolver know which assets you prefer to use when resolving assets.
   * Multiple prefer user defined rules can be added.
   * @example
   * resolver.prefer({
   *     // first look for something with the correct format, and then then correct resolution
   *     priority: ['format', 'resolution'],
   *     params:{
   *         format:'webp', // prefer webp images
   *         resolution: 2, // prefer a resolution of 2
   *     }
   * })
   * resolver.add('foo', ['bar@2x.webp', 'bar@2x.png', 'bar.webp', 'bar.png']);
   * resolver.resolveUrl('foo') // => 'bar@2x.webp'
   * @param preferOrders - the prefer options
   */
  prefer(...t) {
    t.forEach((e) => {
      this._preferredOrder.push(e), e.priority || (e.priority = Object.keys(e.params));
    }), this._resolverHash = {};
  }
  /**
   * Set the base path to prepend to all urls when resolving
   * @example
   * resolver.basePath = 'https://home.com/';
   * resolver.add('foo', 'bar.ong');
   * resolver.resolveUrl('foo', 'bar.png'); // => 'https://home.com/bar.png'
   * @param basePath - the base path to use
   */
  set basePath(t) {
    this._basePath = t;
  }
  get basePath() {
    return this._basePath;
  }
  /**
   * Set the root path for root-relative URLs. By default the `basePath`'s root is used. If no `basePath` is set, then the
   * default value for browsers is `window.location.origin`
   * @example
   * // Application hosted on https://home.com/some-path/index.html
   * resolver.basePath = 'https://home.com/some-path/';
   * resolver.rootPath = 'https://home.com/';
   * resolver.add('foo', '/bar.png');
   * resolver.resolveUrl('foo', '/bar.png'); // => 'https://home.com/bar.png'
   * @param rootPath - the root path to use
   */
  set rootPath(t) {
    this._rootPath = t;
  }
  get rootPath() {
    return this._rootPath;
  }
  /**
   * All the active URL parsers that help the parser to extract information and create
   * an asset object-based on parsing the URL itself.
   *
   * Can be added using the extensions API
   * @example
   * resolver.add('foo', [
   *     {
   *         resolution: 2,
   *         format: 'png',
   *         src: 'image@2x.png',
   *     },
   *     {
   *         resolution:1,
   *         format:'png',
   *         src: 'image.png',
   *     },
   * ]);
   *
   * // With a url parser the information such as resolution and file format could extracted from the url itself:
   * extensions.add({
   *     extension: ExtensionType.ResolveParser,
   *     test: loadTextures.test, // test if url ends in an image
   *     parse: (value: string) =>
   *     ({
   *         resolution: parseFloat(settings.RETINA_PREFIX.exec(value)?.[1] ?? '1'),
   *         format: value.split('.').pop(),
   *         src: value,
   *     }),
   * });
   *
   * // Now resolution and format can be extracted from the url
   * resolver.add('foo', [
   *     'image@2x.png',
   *     'image.png',
   * ]);
   */
  get parsers() {
    return this._parsers;
  }
  /** Used for testing, this resets the resolver to its initial state */
  reset() {
    this.setBundleIdentifier(this._defaultBundleIdentifierOptions), this._assetMap = {}, this._preferredOrder = [], this._resolverHash = {}, this._rootPath = null, this._basePath = null, this._manifest = null, this._bundles = {}, this._defaultSearchParams = null;
  }
  /**
   * Sets the default URL search parameters for the URL resolver. The urls can be specified as a string or an object.
   * @param searchParams - the default url parameters to append when resolving urls
   */
  setDefaultSearchParams(t) {
    if (typeof t == "string")
      this._defaultSearchParams = t;
    else {
      const e = t;
      this._defaultSearchParams = Object.keys(e).map((i) => `${encodeURIComponent(i)}=${encodeURIComponent(e[i])}`).join("&");
    }
  }
  /**
   * Returns the aliases for a given asset
   * @param asset - the asset to get the aliases for
   */
  getAlias(t) {
    const { alias: e, name: i, src: s, srcs: n } = t;
    return le(
      e || i || s || n,
      (o) => typeof o == "string" ? o : Array.isArray(o) ? o.map((a) => (a == null ? void 0 : a.src) ?? (a == null ? void 0 : a.srcs) ?? a) : o != null && o.src || o != null && o.srcs ? o.src ?? o.srcs : o,
      !0
    );
  }
  /**
   * Add a manifest to the asset resolver. This is a nice way to add all the asset information in one go.
   * generally a manifest would be built using a tool.
   * @param manifest - the manifest to add to the resolver
   */
  addManifest(t) {
    this._manifest && console.warn("[Resolver] Manifest already exists, this will be overwritten"), this._manifest = t, t.bundles.forEach((e) => {
      this.addBundle(e.name, e.assets);
    });
  }
  /**
   * This adds a bundle of assets in one go so that you can resolve them as a group.
   * For example you could add a bundle for each screen in you pixi app
   * @example
   * resolver.addBundle('animals', {
   *     bunny: 'bunny.png',
   *     chicken: 'chicken.png',
   *     thumper: 'thumper.png',
   * });
   *
   * const resolvedAssets = await resolver.resolveBundle('animals');
   * @param bundleId - The id of the bundle to add
   * @param assets - A record of the asset or assets that will be chosen from when loading via the specified key
   */
  addBundle(t, e) {
    const i = [];
    Array.isArray(e) ? e.forEach((s) => {
      const n = s.src ?? s.srcs, o = s.alias ?? s.name;
      let a;
      if (typeof o == "string") {
        const h = this._createBundleAssetId(t, o);
        i.push(h), a = [o, h];
      } else {
        const h = o.map((l) => this._createBundleAssetId(t, l));
        i.push(...h), a = [...o, ...h];
      }
      this.add({
        ...s,
        alias: a,
        src: n
      });
    }) : Object.keys(e).forEach((s) => {
      const n = [s, this._createBundleAssetId(t, s)];
      if (typeof e[s] == "string")
        this.add({
          alias: n,
          src: e[s]
        });
      else if (Array.isArray(e[s]))
        this.add({
          alias: n,
          src: e[s]
        });
      else {
        const o = e[s], a = o.src ?? o.srcs;
        this.add({
          ...o,
          alias: n,
          src: Array.isArray(a) ? a : [a]
        });
      }
      i.push(...n);
    }), this._bundles[t] = i;
  }
  add(t, e, i, s, n) {
    const o = [];
    typeof t == "string" || Array.isArray(t) && typeof t[0] == "string" ? (it("7.2.0", `Assets.add now uses an object instead of individual parameters.
Please use Assets.add({ alias, src, data, format, loadParser }) instead.`), o.push({ alias: t, src: e, data: i, format: s, loadParser: n })) : Array.isArray(t) ? o.push(...t) : o.push(t);
    let a;
    a = (h) => {
      this.hasKey(h) && console.warn(`[Resolver] already has key: ${h} overwriting`);
    }, le(o).forEach((h) => {
      const { src: l, srcs: c } = h;
      let { data: u, format: d, loadParser: f } = h;
      const p = le(l || c).map((y) => typeof y == "string" ? U0(y) : Array.isArray(y) ? y : [y]), m = this.getAlias(h);
      Array.isArray(m) ? m.forEach(a) : a(m);
      const g = [];
      p.forEach((y) => {
        y.forEach((v) => {
          let _ = {};
          if (typeof v != "object") {
            _.src = v;
            for (let x = 0; x < this._parsers.length; x++) {
              const T = this._parsers[x];
              if (T.test(v)) {
                _ = T.parse(v);
                break;
              }
            }
          } else
            u = v.data ?? u, d = v.format ?? d, f = v.loadParser ?? f, _ = {
              ..._,
              ...v
            };
          if (!m)
            throw new Error(`[Resolver] alias is undefined for this asset: ${_.src}`);
          _ = this.buildResolvedAsset(_, {
            aliases: m,
            data: u,
            format: d,
            loadParser: f
          }), g.push(_);
        });
      }), m.forEach((y) => {
        this._assetMap[y] = g;
      });
    });
  }
  // TODO: this needs an overload like load did in Assets
  /**
   * If the resolver has had a manifest set via setManifest, this will return the assets urls for
   * a given bundleId or bundleIds.
   * @example
   * // Manifest Example
   * const manifest = {
   *     bundles: [
   *         {
   *             name: 'load-screen',
   *             assets: [
   *                 {
   *                     alias: 'background',
   *                     src: 'sunset.png',
   *                 },
   *                 {
   *                     alias: 'bar',
   *                     src: 'load-bar.{png,webp}',
   *                 },
   *             ],
   *         },
   *         {
   *             name: 'game-screen',
   *             assets: [
   *                 {
   *                     alias: 'character',
   *                     src: 'robot.png',
   *                 },
   *                 {
   *                     alias: 'enemy',
   *                     src: 'bad-guy.png',
   *                 },
   *             ],
   *         },
   *     ]
   * };
   *
   * resolver.setManifest(manifest);
   * const resolved = resolver.resolveBundle('load-screen');
   * @param bundleIds - The bundle ids to resolve
   * @returns All the bundles assets or a hash of assets for each bundle specified
   */
  resolveBundle(t) {
    const e = ks(t);
    t = le(t);
    const i = {};
    return t.forEach((s) => {
      const n = this._bundles[s];
      if (n) {
        const o = this.resolve(n), a = {};
        for (const h in o) {
          const l = o[h];
          a[this._extractAssetIdFromBundle(s, h)] = l;
        }
        i[s] = a;
      }
    }), e ? i[t[0]] : i;
  }
  /**
   * Does exactly what resolve does, but returns just the URL rather than the whole asset object
   * @param key - The key or keys to resolve
   * @returns - The URLs associated with the key(s)
   */
  resolveUrl(t) {
    const e = this.resolve(t);
    if (typeof t != "string") {
      const i = {};
      for (const s in e)
        i[s] = e[s].src;
      return i;
    }
    return e.src;
  }
  resolve(t) {
    const e = ks(t);
    t = le(t);
    const i = {};
    return t.forEach((s) => {
      if (!this._resolverHash[s])
        if (this._assetMap[s]) {
          let n = this._assetMap[s];
          const o = n[0], a = this._getPreferredOrder(n);
          a == null || a.priority.forEach((h) => {
            a.params[h].forEach((l) => {
              const c = n.filter((u) => u[h] ? u[h] === l : !1);
              c.length && (n = c);
            });
          }), this._resolverHash[s] = n[0] ?? o;
        } else
          this._resolverHash[s] = this.buildResolvedAsset({
            alias: [s],
            src: s
          }, {});
      i[s] = this._resolverHash[s];
    }), e ? i[t[0]] : i;
  }
  /**
   * Checks if an asset with a given key exists in the resolver
   * @param key - The key of the asset
   */
  hasKey(t) {
    return !!this._assetMap[t];
  }
  /**
   * Checks if a bundle with the given key exists in the resolver
   * @param key - The key of the bundle
   */
  hasBundle(t) {
    return !!this._bundles[t];
  }
  /**
   * Internal function for figuring out what prefer criteria an asset should use.
   * @param assets
   */
  _getPreferredOrder(t) {
    for (let e = 0; e < t.length; e++) {
      const i = t[0], s = this._preferredOrder.find((n) => n.params.format.includes(i.format));
      if (s)
        return s;
    }
    return this._preferredOrder[0];
  }
  /**
   * Appends the default url parameters to the url
   * @param url - The url to append the default parameters to
   * @returns - The url with the default parameters appended
   */
  _appendDefaultSearchParams(t) {
    if (!this._defaultSearchParams)
      return t;
    const e = /\?/.test(t) ? "&" : "?";
    return `${t}${e}${this._defaultSearchParams}`;
  }
  buildResolvedAsset(t, e) {
    const { aliases: i, data: s, loadParser: n, format: o } = e;
    return (this._basePath || this._rootPath) && (t.src = Rt.toAbsolute(t.src, this._basePath, this._rootPath)), t.alias = i ?? t.alias ?? [t.src], t.src = this._appendDefaultSearchParams(t.src), t.data = { ...s || {}, ...t.data }, t.loadParser = n ?? t.loadParser, t.format = o ?? Rt.extname(t.src).slice(1), t.srcs = t.src, t.name = t.alias, t;
  }
}
class gy {
  constructor() {
    this._detections = [], this._initialized = !1, this.resolver = new my(), this.loader = new H0(), this.cache = dr, this._backgroundLoader = new k0(this.loader), this._backgroundLoader.active = !0, this.reset();
  }
  /**
   * Best practice is to call this function before any loading commences
   * Initiating is the best time to add any customization to the way things are loaded.
   *
   * you do not need to call this for the Asset class to work, only if you want to set any initial properties
   * @param options - options to initialize the Asset manager with
   */
  async init(t = {}) {
    var n, o;
    if (this._initialized) {
      console.warn("[Assets]AssetManager already initialized, did you load before calling this Assets.init()?");
      return;
    }
    if (this._initialized = !0, t.defaultSearchParams && this.resolver.setDefaultSearchParams(t.defaultSearchParams), t.basePath && (this.resolver.basePath = t.basePath), t.bundleIdentifier && this.resolver.setBundleIdentifier(t.bundleIdentifier), t.manifest) {
      let a = t.manifest;
      typeof a == "string" && (a = await this.load(a)), this.resolver.addManifest(a);
    }
    const e = ((n = t.texturePreference) == null ? void 0 : n.resolution) ?? 1, i = typeof e == "number" ? [e] : e, s = await this._detectFormats({
      preferredFormats: (o = t.texturePreference) == null ? void 0 : o.format,
      skipDetections: t.skipDetections,
      detections: this._detections
    });
    this.resolver.prefer({
      params: {
        format: s,
        resolution: i
      }
    }), t.preferences && this.setPreferences(t.preferences);
  }
  add(t, e, i, s, n) {
    this.resolver.add(t, e, i, s, n);
  }
  async load(t, e) {
    this._initialized || await this.init();
    const i = ks(t), s = le(t).map((a) => {
      if (typeof a != "string") {
        const h = this.resolver.getAlias(a);
        return h.some((l) => !this.resolver.hasKey(l)) && this.add(a), Array.isArray(h) ? h[0] : h;
      }
      return this.resolver.hasKey(a) || this.add({ alias: a, src: a }), a;
    }), n = this.resolver.resolve(s), o = await this._mapLoadToResolve(n, e);
    return i ? o[s[0]] : o;
  }
  /**
   * This adds a bundle of assets in one go so that you can load them as a group.
   * For example you could add a bundle for each screen in you pixi app
   * @example
   * import { Assets } from 'pixi.js';
   *
   * Assets.addBundle('animals', {
   *     bunny: 'bunny.png',
   *     chicken: 'chicken.png',
   *     thumper: 'thumper.png',
   * });
   *
   * const assets = await Assets.loadBundle('animals');
   * @param bundleId - the id of the bundle to add
   * @param assets - a record of the asset or assets that will be chosen from when loading via the specified key
   */
  addBundle(t, e) {
    this.resolver.addBundle(t, e);
  }
  /**
   * Bundles are a way to load multiple assets at once.
   * If a manifest has been provided to the init function then you can load a bundle, or bundles.
   * you can also add bundles via `addBundle`
   * @example
   * import { Assets } from 'pixi.js';
   *
   * // Manifest Example
   * const manifest = {
   *     bundles: [
   *         {
   *             name: 'load-screen',
   *             assets: [
   *                 {
   *                     alias: 'background',
   *                     src: 'sunset.png',
   *                 },
   *                 {
   *                     alias: 'bar',
   *                     src: 'load-bar.{png,webp}',
   *                 },
   *             ],
   *         },
   *         {
   *             name: 'game-screen',
   *             assets: [
   *                 {
   *                     alias: 'character',
   *                     src: 'robot.png',
   *                 },
   *                 {
   *                     alias: 'enemy',
   *                     src: 'bad-guy.png',
   *                 },
   *             ],
   *         },
   *     ]
   * };
   *
   * await Assets.init({ manifest });
   *
   * // Load a bundle...
   * loadScreenAssets = await Assets.loadBundle('load-screen');
   * // Load another bundle...
   * gameScreenAssets = await Assets.loadBundle('game-screen');
   * @param bundleIds - the bundle id or ids to load
   * @param onProgress - Optional function that is called when progress on asset loading is made.
   * The function is passed a single parameter, `progress`, which represents the percentage (0.0 - 1.0)
   * of the assets loaded. Do not use this function to detect when assets are complete and available,
   * instead use the Promise returned by this function.
   * @returns all the bundles assets or a hash of assets for each bundle specified
   */
  async loadBundle(t, e) {
    this._initialized || await this.init();
    let i = !1;
    typeof t == "string" && (i = !0, t = [t]);
    const s = this.resolver.resolveBundle(t), n = {}, o = Object.keys(s);
    let a = 0, h = 0;
    const l = () => {
      e == null || e(++a / h);
    }, c = o.map((u) => {
      const d = s[u];
      return h += Object.keys(d).length, this._mapLoadToResolve(d, l).then((f) => {
        n[u] = f;
      });
    });
    return await Promise.all(c), i ? n[t[0]] : n;
  }
  /**
   * Initiate a background load of some assets. It will passively begin to load these assets in the background.
   * So when you actually come to loading them you will get a promise that resolves to the loaded assets immediately
   *
   * An example of this might be that you would background load game assets after your inital load.
   * then when you got to actually load your game screen assets when a player goes to the game - the loading
   * would already have stared or may even be complete, saving you having to show an interim load bar.
   * @example
   * import { Assets } from 'pixi.js';
   *
   * Assets.backgroundLoad('bunny.png');
   *
   * // later on in your app...
   * await Assets.loadBundle('bunny.png'); // Will resolve quicker as loading may have completed!
   * @param urls - the url / urls you want to background load
   */
  async backgroundLoad(t) {
    this._initialized || await this.init(), typeof t == "string" && (t = [t]);
    const e = this.resolver.resolve(t);
    this._backgroundLoader.add(Object.values(e));
  }
  /**
   * Initiate a background of a bundle, works exactly like backgroundLoad but for bundles.
   * this can only be used if the loader has been initiated with a manifest
   * @example
   * import { Assets } from 'pixi.js';
   *
   * await Assets.init({
   *     manifest: {
   *         bundles: [
   *             {
   *                 name: 'load-screen',
   *                 assets: [...],
   *             },
   *             ...
   *         ],
   *     },
   * });
   *
   * Assets.backgroundLoadBundle('load-screen');
   *
   * // Later on in your app...
   * await Assets.loadBundle('load-screen'); // Will resolve quicker as loading may have completed!
   * @param bundleIds - the bundleId / bundleIds you want to background load
   */
  async backgroundLoadBundle(t) {
    this._initialized || await this.init(), typeof t == "string" && (t = [t]);
    const e = this.resolver.resolveBundle(t);
    Object.values(e).forEach((i) => {
      this._backgroundLoader.add(Object.values(i));
    });
  }
  /**
   * Only intended for development purposes.
   * This will wipe the resolver and caches.
   * You will need to reinitialize the Asset
   */
  reset() {
    this.resolver.reset(), this.loader.reset(), this.cache.reset(), this._initialized = !1;
  }
  get(t) {
    if (typeof t == "string")
      return dr.get(t);
    const e = {};
    for (let i = 0; i < t.length; i++)
      e[i] = dr.get(t[i]);
    return e;
  }
  /**
   * helper function to map resolved assets back to loaded assets
   * @param resolveResults - the resolve results from the resolver
   * @param onProgress - the progress callback
   */
  async _mapLoadToResolve(t, e) {
    const i = Object.values(t), s = Object.keys(t);
    this._backgroundLoader.active = !1;
    const n = await this.loader.load(i, e);
    this._backgroundLoader.active = !0;
    const o = {};
    return i.forEach((a, h) => {
      const l = n[a.src], c = [a.src];
      a.alias && c.push(...a.alias), o[s[h]] = l, dr.set(c, l);
    }), o;
  }
  /**
   * Unload an asset or assets. As the Assets class is responsible for creating the assets via the `load` function
   * this will make sure to destroy any assets and release them from memory.
   * Once unloaded, you will need to load the asset again.
   *
   * Use this to help manage assets if you find that you have a large app and you want to free up memory.
   *
   * - it's up to you as the developer to make sure that textures are not actively being used when you unload them,
   * Pixi won't break but you will end up with missing assets. Not a good look for the user!
   * @example
   * import { Assets } from 'pixi.js';
   *
   * // Load a URL:
   * const myImageTexture = await Assets.load('http://some.url.com/image.png'); // => returns a texture
   *
   * await Assets.unload('http://some.url.com/image.png')
   *
   * // myImageTexture will be destroyed now.
   *
   * // Unload multiple assets:
   * const textures = await Assets.unload(['thumper', 'chicko']);
   * @param urls - the urls to unload
   */
  async unload(t) {
    this._initialized || await this.init();
    const e = le(t).map((s) => typeof s != "string" ? s.src : s), i = this.resolver.resolve(e);
    await this._unloadFromResolved(i);
  }
  /**
   * Bundles are a way to manage multiple assets at once.
   * this will unload all files in a bundle.
   *
   * once a bundle has been unloaded, you need to load it again to have access to the assets.
   * @example
   * import { Assets } from 'pixi.js';
   *
   * Assets.addBundle({
   *     'thumper': 'http://some.url.com/thumper.png',
   * })
   *
   * const assets = await Assets.loadBundle('thumper');
   *
   * // Now to unload...
   *
   * await Assets.unloadBundle('thumper');
   *
   * // All assets in the assets object will now have been destroyed and purged from the cache
   * @param bundleIds - the bundle id or ids to unload
   */
  async unloadBundle(t) {
    this._initialized || await this.init(), t = le(t);
    const e = this.resolver.resolveBundle(t), i = Object.keys(e).map((s) => this._unloadFromResolved(e[s]));
    await Promise.all(i);
  }
  async _unloadFromResolved(t) {
    const e = Object.values(t);
    e.forEach((i) => {
      dr.remove(i.src);
    }), await this.loader.unload(e);
  }
  /**
   * Detects the supported formats for the browser, and returns an array of supported formats, respecting
   * the users preferred formats order.
   * @param options - the options to use when detecting formats
   * @param options.preferredFormats - the preferred formats to use
   * @param options.skipDetections - if we should skip the detections altogether
   * @param options.detections - the detections to use
   * @returns - the detected formats
   */
  async _detectFormats(t) {
    let e = [];
    t.preferredFormats && (e = Array.isArray(t.preferredFormats) ? t.preferredFormats : [t.preferredFormats]);
    for (const i of t.detections)
      t.skipDetections || await i.test() ? e = await i.add(e) : t.skipDetections || (e = await i.remove(e));
    return e = e.filter((i, s) => e.indexOf(i) === s), e;
  }
  /** All the detection parsers currently added to the Assets class. */
  get detections() {
    return this._detections;
  }
  /**
   * @deprecated since 7.2.0
   * @see {@link Assets.setPreferences}
   */
  get preferWorkers() {
    return Qs.config.preferWorkers;
  }
  set preferWorkers(t) {
    it("7.2.0", "Assets.prefersWorkers is deprecated, use Assets.setPreferences({ preferWorkers: true }) instead."), this.setPreferences({ preferWorkers: t });
  }
  /**
   * General setter for preferences. This is a helper function to set preferences on all parsers.
   * @param preferences - the preferences to set
   */
  setPreferences(t) {
    this.loader.parsers.forEach((e) => {
      e.config && Object.keys(e.config).filter((i) => i in t).forEach((i) => {
        e.config[i] = t[i];
      });
    });
  }
}
const ts = new gy();
z.handleByList(k.LoadParser, ts.loader.parsers).handleByList(k.ResolveParser, ts.resolver.parsers).handleByList(k.CacheParser, ts.cache.parsers).handleByList(k.DetectionParser, ts.detections);
const yy = {
  extension: k.CacheParser,
  test: (r) => Array.isArray(r) && r.every((t) => t instanceof j),
  getCacheableAssets: (r, t) => {
    const e = {};
    return r.forEach((i) => {
      t.forEach((s, n) => {
        e[i + (n === 0 ? "" : n + 1)] = s;
      });
    }), e;
  }
};
z.add(yy);
async function au(r) {
  if ("Image" in globalThis)
    return new Promise((t) => {
      const e = new Image();
      e.onload = () => {
        t(!0);
      }, e.onerror = () => {
        t(!1);
      }, e.src = r;
    });
  if ("createImageBitmap" in globalThis && "fetch" in globalThis) {
    try {
      const t = await (await fetch(r)).blob();
      await createImageBitmap(t);
    } catch {
      return !1;
    }
    return !0;
  }
  return !1;
}
const _y = {
  extension: {
    type: k.DetectionParser,
    priority: 1
  },
  test: async () => au(
    // eslint-disable-next-line max-len
    "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
  ),
  add: async (r) => [...r, "avif"],
  remove: async (r) => r.filter((t) => t !== "avif")
};
z.add(_y);
const vy = {
  extension: {
    type: k.DetectionParser,
    priority: 0
  },
  test: async () => au(
    "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="
  ),
  add: async (r) => [...r, "webp"],
  remove: async (r) => r.filter((t) => t !== "webp")
};
z.add(vy);
const Xh = ["png", "jpg", "jpeg"], xy = {
  extension: {
    type: k.DetectionParser,
    priority: -1
  },
  test: () => Promise.resolve(!0),
  add: async (r) => [...r, ...Xh],
  remove: async (r) => r.filter((t) => !Xh.includes(t))
};
z.add(xy);
const by = "WorkerGlobalScope" in globalThis && globalThis instanceof globalThis.WorkerGlobalScope;
function ma(r) {
  return by ? !1 : document.createElement("video").canPlayType(r) !== "";
}
const Ty = {
  extension: {
    type: k.DetectionParser,
    priority: 0
  },
  test: async () => ma("video/webm"),
  add: async (r) => [...r, "webm"],
  remove: async (r) => r.filter((t) => t !== "webm")
};
z.add(Ty);
const Ey = {
  extension: {
    type: k.DetectionParser,
    priority: 0
  },
  test: async () => ma("video/mp4"),
  add: async (r) => [...r, "mp4", "m4v"],
  remove: async (r) => r.filter((t) => t !== "mp4" && t !== "m4v")
};
z.add(Ey);
const wy = {
  extension: {
    type: k.DetectionParser,
    priority: 0
  },
  test: async () => ma("video/ogg"),
  add: async (r) => [...r, "ogv"],
  remove: async (r) => r.filter((t) => t !== "ogv")
};
z.add(wy);
const Ay = {
  extension: k.ResolveParser,
  test: Qs.test,
  parse: (r) => {
    var t;
    return {
      resolution: parseFloat(((t = H.RETINA_PREFIX.exec(r)) == null ? void 0 : t[1]) ?? "1"),
      format: Rt.extname(r).slice(1),
      src: r
    };
  }
};
z.add(Ay);
var jt = /* @__PURE__ */ ((r) => (r[r.COMPRESSED_RGB_S3TC_DXT1_EXT = 33776] = "COMPRESSED_RGB_S3TC_DXT1_EXT", r[r.COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777] = "COMPRESSED_RGBA_S3TC_DXT1_EXT", r[r.COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778] = "COMPRESSED_RGBA_S3TC_DXT3_EXT", r[r.COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779] = "COMPRESSED_RGBA_S3TC_DXT5_EXT", r[r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 35917] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT", r[r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 35918] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT", r[r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 35919] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT", r[r.COMPRESSED_SRGB_S3TC_DXT1_EXT = 35916] = "COMPRESSED_SRGB_S3TC_DXT1_EXT", r[r.COMPRESSED_R11_EAC = 37488] = "COMPRESSED_R11_EAC", r[r.COMPRESSED_SIGNED_R11_EAC = 37489] = "COMPRESSED_SIGNED_R11_EAC", r[r.COMPRESSED_RG11_EAC = 37490] = "COMPRESSED_RG11_EAC", r[r.COMPRESSED_SIGNED_RG11_EAC = 37491] = "COMPRESSED_SIGNED_RG11_EAC", r[r.COMPRESSED_RGB8_ETC2 = 37492] = "COMPRESSED_RGB8_ETC2", r[r.COMPRESSED_RGBA8_ETC2_EAC = 37496] = "COMPRESSED_RGBA8_ETC2_EAC", r[r.COMPRESSED_SRGB8_ETC2 = 37493] = "COMPRESSED_SRGB8_ETC2", r[r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 37497] = "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC", r[r.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37494] = "COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2", r[r.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37495] = "COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2", r[r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 35840] = "COMPRESSED_RGB_PVRTC_4BPPV1_IMG", r[r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 35842] = "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG", r[r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 35841] = "COMPRESSED_RGB_PVRTC_2BPPV1_IMG", r[r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 35843] = "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG", r[r.COMPRESSED_RGB_ETC1_WEBGL = 36196] = "COMPRESSED_RGB_ETC1_WEBGL", r[r.COMPRESSED_RGB_ATC_WEBGL = 35986] = "COMPRESSED_RGB_ATC_WEBGL", r[r.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 35987] = "COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL", r[r.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 34798] = "COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL", r[r.COMPRESSED_RGBA_ASTC_4x4_KHR = 37808] = "COMPRESSED_RGBA_ASTC_4x4_KHR", r))(jt || {});
const Us = {
  // WEBGL_compressed_texture_s3tc
  33776: 0.5,
  33777: 0.5,
  33778: 1,
  33779: 1,
  // WEBGL_compressed_texture_s3tc
  35916: 0.5,
  35917: 0.5,
  35918: 1,
  35919: 1,
  // WEBGL_compressed_texture_etc
  37488: 0.5,
  37489: 0.5,
  37490: 1,
  37491: 1,
  37492: 0.5,
  37496: 1,
  37493: 0.5,
  37497: 1,
  37494: 0.5,
  // ~~
  37495: 0.5,
  // ~~
  // WEBGL_compressed_texture_pvrtc
  35840: 0.5,
  35842: 0.5,
  35841: 0.25,
  35843: 0.25,
  // WEBGL_compressed_texture_etc1
  36196: 0.5,
  // @see https://www.khronos.org/registry/OpenGL/extensions/AMD/AMD_compressed_ATC_texture.txt
  // WEBGL_compressed_texture_atc
  35986: 0.5,
  35987: 1,
  34798: 1,
  // @see https://registry.khronos.org/OpenGL/extensions/KHR/KHR_texture_compression_astc_hdr.txt
  // WEBGL_compressed_texture_astc
  /* eslint-disable-next-line camelcase */
  37808: 1
};
let Ce, Ur;
function zh() {
  Ur = {
    s3tc: Ce.getExtension("WEBGL_compressed_texture_s3tc"),
    s3tc_sRGB: Ce.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
    /* eslint-disable-line camelcase */
    etc: Ce.getExtension("WEBGL_compressed_texture_etc"),
    etc1: Ce.getExtension("WEBGL_compressed_texture_etc1"),
    pvrtc: Ce.getExtension("WEBGL_compressed_texture_pvrtc") || Ce.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
    atc: Ce.getExtension("WEBGL_compressed_texture_atc"),
    astc: Ce.getExtension("WEBGL_compressed_texture_astc")
  };
}
const Sy = {
  extension: {
    type: k.DetectionParser,
    priority: 2
  },
  test: async () => {
    const r = H.ADAPTER.createCanvas().getContext("webgl");
    return r ? (Ce = r, !0) : (console.warn("WebGL not available for compressed textures."), !1);
  },
  add: async (r) => {
    Ur || zh();
    const t = [];
    for (const e in Ur)
      Ur[e] && t.push(e);
    return [...t, ...r];
  },
  remove: async (r) => (Ur || zh(), r.filter((t) => !(t in Ur)))
};
z.add(Sy);
class Iy extends $s {
  /**
   * @param source - The buffer/URL of the texture file.
   * @param {PIXI.IBlobResourceOptions} [options]
   * @param {boolean} [options.autoLoad=false] - Whether to fetch the data immediately;
   *  you can fetch it later via {@link PIXI.BlobResource#load}.
   * @param {number} [options.width=1] - The width in pixels.
   * @param {number} [options.height=1] - The height in pixels.
   * @param {1|2|4|8} [options.unpackAlignment=4] - The alignment of the pixel rows.
   */
  constructor(t, e = { width: 1, height: 1, autoLoad: !0 }) {
    let i, s;
    typeof t == "string" ? (i = t, s = new Uint8Array()) : (i = null, s = t), super(s, e), this.origin = i, this.buffer = s ? new go(s) : null, this._load = null, this.loaded = !1, this.origin !== null && e.autoLoad !== !1 && this.load(), this.origin === null && this.buffer && (this._load = Promise.resolve(this), this.loaded = !0, this.onBlobLoaded(this.buffer.rawBinaryData));
  }
  onBlobLoaded(t) {
  }
  /** Loads the blob */
  load() {
    return this._load ? this._load : (this._load = fetch(this.origin).then((t) => t.blob()).then((t) => t.arrayBuffer()).then((t) => (this.data = new Uint32Array(t), this.buffer = new go(t), this.loaded = !0, this.onBlobLoaded(t), this.update(), this)), this._load);
  }
}
class vr extends Iy {
  /**
   * @param source - the buffer/URL holding the compressed texture data
   * @param options
   * @param {PIXI.INTERNAL_FORMATS} options.format - the compression format
   * @param {number} options.width - the image width in pixels.
   * @param {number} options.height - the image height in pixels.
   * @param {number} [options.level=1] - the mipmap levels stored in the compressed texture, including level 0.
   * @param {number} [options.levelBuffers] - the buffers for each mipmap level. `CompressedTextureResource` can allows you
   *      to pass `null` for `source`, for cases where each level is stored in non-contiguous memory.
   */
  constructor(t, e) {
    super(t, e), this.format = e.format, this.levels = e.levels || 1, this._width = e.width, this._height = e.height, this._extension = vr._formatToExtension(this.format), (e.levelBuffers || this.buffer) && (this._levelBuffers = e.levelBuffers || vr._createLevelBuffers(
      t instanceof Uint8Array ? t : this.buffer.uint8View,
      this.format,
      this.levels,
      4,
      4,
      // PVRTC has 8x4 blocks in 2bpp mode
      this.width,
      this.height
    ));
  }
  /**
   * @override
   * @param renderer - A reference to the current renderer
   * @param _texture - the texture
   * @param _glTexture - texture instance for this webgl context
   */
  upload(t, e, i) {
    const s = t.gl;
    if (!t.context.extensions[this._extension])
      throw new Error(`${this._extension} textures are not supported on the current machine`);
    if (!this._levelBuffers)
      return !1;
    s.pixelStorei(s.UNPACK_ALIGNMENT, 4);
    for (let n = 0, o = this.levels; n < o; n++) {
      const { levelID: a, levelWidth: h, levelHeight: l, levelBuffer: c } = this._levelBuffers[n];
      s.compressedTexImage2D(s.TEXTURE_2D, a, this.format, h, l, 0, c);
    }
    return !0;
  }
  /** @protected */
  onBlobLoaded() {
    this._levelBuffers = vr._createLevelBuffers(
      this.buffer.uint8View,
      this.format,
      this.levels,
      4,
      4,
      // PVRTC has 8x4 blocks in 2bpp mode
      this.width,
      this.height
    );
  }
  /**
   * Returns the key (to ContextSystem#extensions) for the WebGL extension supporting the compression format
   * @private
   * @param format - the compression format to get the extension for.
   */
  static _formatToExtension(t) {
    if (t >= 33776 && t <= 33779)
      return "s3tc";
    if (t >= 37488 && t <= 37497)
      return "etc";
    if (t >= 35840 && t <= 35843)
      return "pvrtc";
    if (t >= 36196)
      return "etc1";
    if (t >= 35986 && t <= 34798)
      return "atc";
    throw new Error("Invalid (compressed) texture format given!");
  }
  /**
   * Pre-creates buffer views for each mipmap level
   * @private
   * @param buffer -
   * @param format - compression formats
   * @param levels - mipmap levels
   * @param blockWidth -
   * @param blockHeight -
   * @param imageWidth - width of the image in pixels
   * @param imageHeight - height of the image in pixels
   */
  static _createLevelBuffers(t, e, i, s, n, o, a) {
    const h = new Array(i);
    let l = t.byteOffset, c = o, u = a, d = c + s - 1 & ~(s - 1), f = u + n - 1 & ~(n - 1), p = d * f * Us[e];
    for (let m = 0; m < i; m++)
      h[m] = {
        levelID: m,
        levelWidth: i > 1 ? c : d,
        levelHeight: i > 1 ? u : f,
        levelBuffer: new Uint8Array(t.buffer, l, p)
      }, l += p, c = c >> 1 || 1, u = u >> 1 || 1, d = c + s - 1 & ~(s - 1), f = u + n - 1 & ~(n - 1), p = d * f * Us[e];
    return h;
  }
}
const Nn = 4, es = 124, Cy = 32, Wh = 20, Ry = 542327876, rs = {
  SIZE: 1,
  FLAGS: 2,
  HEIGHT: 3,
  WIDTH: 4,
  MIPMAP_COUNT: 7,
  PIXEL_FORMAT: 19
}, Py = {
  SIZE: 0,
  FLAGS: 1,
  FOURCC: 2,
  RGB_BITCOUNT: 3,
  R_BIT_MASK: 4,
  G_BIT_MASK: 5,
  B_BIT_MASK: 6,
  A_BIT_MASK: 7
}, is = {
  DXGI_FORMAT: 0,
  RESOURCE_DIMENSION: 1,
  MISC_FLAG: 2,
  ARRAY_SIZE: 3,
  MISC_FLAGS2: 4
}, My = 1, By = 2, Dy = 4, Fy = 64, Oy = 512, Ly = 131072, Ny = 827611204, ky = 861165636, Uy = 894720068, Gy = 808540228, Hy = 4, Vy = {
  [Ny]: jt.COMPRESSED_RGBA_S3TC_DXT1_EXT,
  [ky]: jt.COMPRESSED_RGBA_S3TC_DXT3_EXT,
  [Uy]: jt.COMPRESSED_RGBA_S3TC_DXT5_EXT
}, Xy = {
  // WEBGL_compressed_texture_s3tc
  70: jt.COMPRESSED_RGBA_S3TC_DXT1_EXT,
  71: jt.COMPRESSED_RGBA_S3TC_DXT1_EXT,
  73: jt.COMPRESSED_RGBA_S3TC_DXT3_EXT,
  74: jt.COMPRESSED_RGBA_S3TC_DXT3_EXT,
  76: jt.COMPRESSED_RGBA_S3TC_DXT5_EXT,
  77: jt.COMPRESSED_RGBA_S3TC_DXT5_EXT,
  // WEBGL_compressed_texture_s3tc_srgb
  72: jt.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT,
  75: jt.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT,
  78: jt.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT
};
function zy(r) {
  const t = new Uint32Array(r);
  if (t[0] !== Ry)
    throw new Error("Invalid DDS file magic word");
  const e = new Uint32Array(r, 0, es / Uint32Array.BYTES_PER_ELEMENT), i = e[rs.HEIGHT], s = e[rs.WIDTH], n = e[rs.MIPMAP_COUNT], o = new Uint32Array(
    r,
    rs.PIXEL_FORMAT * Uint32Array.BYTES_PER_ELEMENT,
    Cy / Uint32Array.BYTES_PER_ELEMENT
  ), a = o[My];
  if (a & Dy) {
    const h = o[Py.FOURCC];
    if (h !== Gy) {
      const v = Vy[h], _ = Nn + es, x = new Uint8Array(r, _);
      return [new vr(x, {
        format: v,
        width: s,
        height: i,
        levels: n
        // CompressedTextureResource will separate the levelBuffers for us!
      })];
    }
    const l = Nn + es, c = new Uint32Array(
      t.buffer,
      l,
      Wh / Uint32Array.BYTES_PER_ELEMENT
    ), u = c[is.DXGI_FORMAT], d = c[is.RESOURCE_DIMENSION], f = c[is.MISC_FLAG], p = c[is.ARRAY_SIZE], m = Xy[u];
    if (m === void 0)
      throw new Error(`DDSParser cannot parse texture data with DXGI format ${u}`);
    if (f === Hy)
      throw new Error("DDSParser does not support cubemap textures");
    if (d === 6)
      throw new Error("DDSParser does not supported 3D texture data");
    const g = new Array(), y = Nn + es + Wh;
    if (p === 1)
      g.push(new Uint8Array(r, y));
    else {
      const v = Us[m];
      let _ = 0, x = s, T = i;
      for (let w = 0; w < n; w++) {
        const I = Math.max(1, x + 3 & -4), S = Math.max(1, T + 3 & -4), P = I * S * v;
        _ += P, x = x >>> 1, T = T >>> 1;
      }
      let C = y;
      for (let w = 0; w < p; w++)
        g.push(new Uint8Array(r, C, _)), C += _;
    }
    return g.map((v) => new vr(v, {
      format: m,
      width: s,
      height: i,
      levels: n
    }));
  }
  throw a & Fy ? new Error("DDSParser does not support uncompressed texture data.") : a & Oy ? new Error("DDSParser does not supported YUV uncompressed texture data.") : a & Ly ? new Error("DDSParser does not support single-channel (lumninance) texture data!") : a & By ? new Error("DDSParser does not support single-channel (alpha) texture data!") : new Error("DDSParser failed to load a texture file due to an unknown reason!");
}
const jh = [171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10], Wy = 67305985, se = {
  FILE_IDENTIFIER: 0,
  ENDIANNESS: 12,
  GL_TYPE: 16,
  GL_TYPE_SIZE: 20,
  GL_FORMAT: 24,
  GL_INTERNAL_FORMAT: 28,
  GL_BASE_INTERNAL_FORMAT: 32,
  PIXEL_WIDTH: 36,
  PIXEL_HEIGHT: 40,
  PIXEL_DEPTH: 44,
  NUMBER_OF_ARRAY_ELEMENTS: 48,
  NUMBER_OF_FACES: 52,
  NUMBER_OF_MIPMAP_LEVELS: 56,
  BYTES_OF_KEY_VALUE_DATA: 60
}, Go = 64, $h = {
  [$.UNSIGNED_BYTE]: 1,
  [$.UNSIGNED_SHORT]: 2,
  [$.INT]: 4,
  [$.UNSIGNED_INT]: 4,
  [$.FLOAT]: 4,
  [$.HALF_FLOAT]: 8
}, jy = {
  [F.RGBA]: 4,
  [F.RGB]: 3,
  [F.RG]: 2,
  [F.RED]: 1,
  [F.LUMINANCE]: 1,
  [F.LUMINANCE_ALPHA]: 2,
  [F.ALPHA]: 1
}, $y = {
  [$.UNSIGNED_SHORT_4_4_4_4]: 2,
  [$.UNSIGNED_SHORT_5_5_5_1]: 2,
  [$.UNSIGNED_SHORT_5_6_5]: 2
};
function Yy(r, t, e = !1) {
  const i = new DataView(t);
  if (!qy(r, i))
    return null;
  const s = i.getUint32(se.ENDIANNESS, !0) === Wy, n = i.getUint32(se.GL_TYPE, s), o = i.getUint32(se.GL_FORMAT, s), a = i.getUint32(se.GL_INTERNAL_FORMAT, s), h = i.getUint32(se.PIXEL_WIDTH, s), l = i.getUint32(se.PIXEL_HEIGHT, s) || 1, c = i.getUint32(se.PIXEL_DEPTH, s) || 1, u = i.getUint32(se.NUMBER_OF_ARRAY_ELEMENTS, s) || 1, d = i.getUint32(se.NUMBER_OF_FACES, s), f = i.getUint32(se.NUMBER_OF_MIPMAP_LEVELS, s), p = i.getUint32(se.BYTES_OF_KEY_VALUE_DATA, s);
  if (l === 0 || c !== 1)
    throw new Error("Only 2D textures are supported");
  if (d !== 1)
    throw new Error("CubeTextures are not supported by KTXLoader yet!");
  if (u !== 1)
    throw new Error("WebGL does not support array textures");
  const m = 4, g = 4, y = h + 3 & -4, v = l + 3 & -4, _ = new Array(u);
  let x = h * l;
  n === 0 && (x = y * v);
  let T;
  if (n !== 0 ? $h[n] ? T = $h[n] * jy[o] : T = $y[n] : T = Us[a], T === void 0)
    throw new Error("Unable to resolve the pixel format stored in the *.ktx file!");
  const C = e ? Zy(i, p, s) : null;
  let w = x * T, I = h, S = l, P = y, O = v, M = Go + p;
  for (let E = 0; E < f; E++) {
    const A = i.getUint32(M, s);
    let R = M + 4;
    for (let X = 0; X < u; X++) {
      let D = _[X];
      D || (D = _[X] = new Array(f)), D[E] = {
        levelID: E,
        // don't align mipWidth when texture not compressed! (glType not zero)
        levelWidth: f > 1 || n !== 0 ? I : P,
        levelHeight: f > 1 || n !== 0 ? S : O,
        levelBuffer: new Uint8Array(t, R, w)
      }, R += w;
    }
    M += A + 4, M = M % 4 !== 0 ? M + 4 - M % 4 : M, I = I >> 1 || 1, S = S >> 1 || 1, P = I + m - 1 & ~(m - 1), O = S + g - 1 & ~(g - 1), w = P * O * T;
  }
  return n !== 0 ? {
    uncompressed: _.map((E) => {
      let A = E[0].levelBuffer, R = !1;
      return n === $.FLOAT ? A = new Float32Array(
        E[0].levelBuffer.buffer,
        E[0].levelBuffer.byteOffset,
        E[0].levelBuffer.byteLength / 4
      ) : n === $.UNSIGNED_INT ? (R = !0, A = new Uint32Array(
        E[0].levelBuffer.buffer,
        E[0].levelBuffer.byteOffset,
        E[0].levelBuffer.byteLength / 4
      )) : n === $.INT && (R = !0, A = new Int32Array(
        E[0].levelBuffer.buffer,
        E[0].levelBuffer.byteOffset,
        E[0].levelBuffer.byteLength / 4
      )), {
        resource: new $s(
          A,
          {
            width: E[0].levelWidth,
            height: E[0].levelHeight
          }
        ),
        type: n,
        format: R ? Ky(o) : o
      };
    }),
    kvData: C
  } : {
    compressed: _.map((E) => new vr(null, {
      format: a,
      width: h,
      height: l,
      levels: f,
      levelBuffers: E
    })),
    kvData: C
  };
}
function qy(r, t) {
  for (let e = 0; e < jh.length; e++)
    if (t.getUint8(e) !== jh[e])
      return console.error(`${r} is not a valid *.ktx file!`), !1;
  return !0;
}
function Ky(r) {
  switch (r) {
    case F.RGBA:
      return F.RGBA_INTEGER;
    case F.RGB:
      return F.RGB_INTEGER;
    case F.RG:
      return F.RG_INTEGER;
    case F.RED:
      return F.RED_INTEGER;
    default:
      return r;
  }
}
function Zy(r, t, e) {
  const i = /* @__PURE__ */ new Map();
  let s = 0;
  for (; s < t; ) {
    const n = r.getUint32(Go + s, e), o = Go + s + 4, a = 3 - (n + 3) % 4;
    if (n === 0 || n > t - s) {
      console.error("KTXLoader: keyAndValueByteSize out of bounds");
      break;
    }
    let h = 0;
    for (; h < n && r.getUint8(o + h) !== 0; h++)
      ;
    if (h === -1) {
      console.error("KTXLoader: Failed to find null byte terminating kvData key");
      break;
    }
    const l = new TextDecoder().decode(
      new Uint8Array(r.buffer, o, h)
    ), c = new DataView(
      r.buffer,
      o + h + 1,
      n - h - 1
    );
    i.set(l, c), s += 4 + n + a;
  }
  return i;
}
const Qy = {
  extension: {
    type: k.LoadParser,
    priority: fe.High
  },
  name: "loadDDS",
  test(r) {
    return rr(r, ".dds");
  },
  async load(r, t, e) {
    const i = await (await H.ADAPTER.fetch(r)).arrayBuffer(), s = zy(i).map((n) => {
      const o = new J(n, {
        mipmap: we.OFF,
        alphaMode: Ht.NO_PREMULTIPLIED_ALPHA,
        resolution: Oe(r),
        ...t.data
      });
      return Oi(o, e, r);
    });
    return s.length === 1 ? s[0] : s;
  },
  unload(r) {
    Array.isArray(r) ? r.forEach((t) => t.destroy(!0)) : r.destroy(!0);
  }
};
z.add(Qy);
const Jy = {
  extension: {
    type: k.LoadParser,
    priority: fe.High
  },
  name: "loadKTX",
  test(r) {
    return rr(r, ".ktx");
  },
  async load(r, t, e) {
    const i = await (await H.ADAPTER.fetch(r)).arrayBuffer(), { compressed: s, uncompressed: n, kvData: o } = Yy(r, i), a = s ?? n, h = {
      mipmap: we.OFF,
      alphaMode: Ht.NO_PREMULTIPLIED_ALPHA,
      resolution: Oe(r),
      ...t.data
    }, l = a.map((c) => {
      a === n && Object.assign(h, {
        type: c.type,
        format: c.format
      });
      const u = c.resource ?? c, d = new J(u, h);
      return d.ktxKeyValueData = o, Oi(d, e, r);
    });
    return l.length === 1 ? l[0] : l;
  },
  unload(r) {
    Array.isArray(r) ? r.forEach((t) => t.destroy(!0)) : r.destroy(!0);
  }
};
z.add(Jy);
const t_ = {
  extension: k.ResolveParser,
  test: (r) => {
    const t = Rt.extname(r).slice(1);
    return ["basis", "ktx", "dds"].includes(t);
  },
  parse: (r) => {
    var e, i;
    const t = Rt.extname(r).slice(1);
    if (t === "ktx") {
      const s = [
        ".s3tc.ktx",
        ".s3tc_sRGB.ktx",
        ".etc.ktx",
        ".etc1.ktx",
        ".pvrt.ktx",
        ".atc.ktx",
        ".astc.ktx"
      ];
      if (s.some((n) => r.endsWith(n)))
        return {
          resolution: parseFloat(((e = H.RETINA_PREFIX.exec(r)) == null ? void 0 : e[1]) ?? "1"),
          format: s.find((n) => r.endsWith(n)),
          src: r
        };
    }
    return {
      resolution: parseFloat(((i = H.RETINA_PREFIX.exec(r)) == null ? void 0 : i[1]) ?? "1"),
      format: t,
      src: r
    };
  }
};
z.add(t_);
const ss = new tt(), e_ = 4, hu = class yi {
  /**
   * @param renderer - A reference to the current renderer
   */
  constructor(t) {
    this.renderer = t, this._rendererPremultipliedAlpha = !1;
  }
  contextChange() {
    var e;
    const t = (e = this.renderer) == null ? void 0 : e.gl.getContextAttributes();
    this._rendererPremultipliedAlpha = !!(t && t.alpha && t.premultipliedAlpha);
  }
  /**
   * Will return a HTML Image of the target
   * @param target - A displayObject or renderTexture
   *  to convert. If left empty will use the main renderer
   * @param format - Image format, e.g. "image/jpeg" or "image/webp".
   * @param quality - JPEG or Webp compression from 0 to 1. Default is 0.92.
   * @param frame - The frame the extraction is restricted to.
   * @returns - HTML Image of the target
   */
  async image(t, e, i, s) {
    const n = new Image();
    return n.src = await this.base64(t, e, i, s), n;
  }
  /**
   * Will return a base64 encoded string of this target. It works by calling
   *  `Extract.canvas` and then running toDataURL on that.
   * @param target - A displayObject or renderTexture
   *  to convert. If left empty will use the main renderer
   * @param format - Image format, e.g. "image/jpeg" or "image/webp".
   * @param quality - JPEG or Webp compression from 0 to 1. Default is 0.92.
   * @param frame - The frame the extraction is restricted to.
   * @returns - A base64 encoded string of the texture.
   */
  async base64(t, e, i, s) {
    const n = this.canvas(t, s);
    if (n.toBlob !== void 0)
      return new Promise((o, a) => {
        n.toBlob((h) => {
          if (!h) {
            a(new Error("ICanvas.toBlob failed!"));
            return;
          }
          const l = new FileReader();
          l.onload = () => o(l.result), l.onerror = a, l.readAsDataURL(h);
        }, e, i);
      });
    if (n.toDataURL !== void 0)
      return n.toDataURL(e, i);
    if (n.convertToBlob !== void 0) {
      const o = await n.convertToBlob({ type: e, quality: i });
      return new Promise((a, h) => {
        const l = new FileReader();
        l.onload = () => a(l.result), l.onerror = h, l.readAsDataURL(o);
      });
    }
    throw new Error("Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented");
  }
  /**
   * Creates a Canvas element, renders this target to it and then returns it.
   * @param target - A displayObject or renderTexture
   *  to convert. If left empty will use the main renderer
   * @param frame - The frame the extraction is restricted to.
   * @returns - A Canvas element with the texture rendered on.
   */
  canvas(t, e) {
    const { pixels: i, width: s, height: n, flipY: o, premultipliedAlpha: a } = this._rawPixels(t, e);
    o && yi._flipY(i, s, n), a && yi._unpremultiplyAlpha(i);
    const h = new Lm(s, n, 1), l = new ImageData(new Uint8ClampedArray(i.buffer), s, n);
    return h.context.putImageData(l, 0, 0), h.canvas;
  }
  /**
   * Will return a one-dimensional array containing the pixel data of the entire texture in RGBA
   * order, with integer values between 0 and 255 (included).
   * @param target - A displayObject or renderTexture
   *  to convert. If left empty will use the main renderer
   * @param frame - The frame the extraction is restricted to.
   * @returns - One-dimensional array containing the pixel data of the entire texture
   */
  pixels(t, e) {
    const { pixels: i, width: s, height: n, flipY: o, premultipliedAlpha: a } = this._rawPixels(t, e);
    return o && yi._flipY(i, s, n), a && yi._unpremultiplyAlpha(i), i;
  }
  _rawPixels(t, e) {
    const i = this.renderer;
    if (!i)
      throw new Error("The Extract has already been destroyed");
    let s, n = !1, o = !1, a, h = !1;
    t && (t instanceof Sr ? a = t : (a = i.generateTexture(t, {
      region: e,
      resolution: i.resolution,
      multisample: i.multisample
    }), h = !0, e && (ss.width = e.width, ss.height = e.height, e = ss)));
    const l = i.gl;
    if (a) {
      if (s = a.baseTexture.resolution, e = e ?? a.frame, n = !1, o = a.baseTexture.alphaMode > 0 && a.baseTexture.format === F.RGBA, !h) {
        i.renderTexture.bind(a);
        const f = a.framebuffer.glFramebuffers[i.CONTEXT_UID];
        f.blitFramebuffer && i.framebuffer.bind(f.blitFramebuffer);
      }
    } else
      s = i.resolution, e || (e = ss, e.width = i.width / s, e.height = i.height / s), n = !0, o = this._rendererPremultipliedAlpha, i.renderTexture.bind();
    const c = Math.max(Math.round(e.width * s), 1), u = Math.max(Math.round(e.height * s), 1), d = new Uint8Array(e_ * c * u);
    return l.readPixels(
      Math.round(e.x * s),
      Math.round(e.y * s),
      c,
      u,
      l.RGBA,
      l.UNSIGNED_BYTE,
      d
    ), h && (a == null || a.destroy(!0)), { pixels: d, width: c, height: u, flipY: n, premultipliedAlpha: o };
  }
  /** Destroys the extract. */
  destroy() {
    this.renderer = null;
  }
  static _flipY(t, e, i) {
    const s = e << 2, n = i >> 1, o = new Uint8Array(s);
    for (let a = 0; a < n; a++) {
      const h = a * s, l = (i - a - 1) * s;
      o.set(t.subarray(h, h + s)), t.copyWithin(h, l, l + s), t.set(o, l);
    }
  }
  static _unpremultiplyAlpha(t) {
    t instanceof Uint8ClampedArray && (t = new Uint8Array(t.buffer));
    const e = t.length;
    for (let i = 0; i < e; i += 4) {
      const s = t[i + 3];
      if (s !== 0) {
        const n = 255.001 / s;
        t[i] = t[i] * n + 0.5, t[i + 1] = t[i + 1] * n + 0.5, t[i + 2] = t[i + 2] * n + 0.5;
      }
    }
  }
};
hu.extension = {
  name: "extract",
  type: k.RendererSystem
};
let r_ = hu;
z.add(r_);
const Gs = {
  build(r) {
    const t = r.points;
    let e, i, s, n, o, a;
    if (r.type === Ot.CIRC) {
      const p = r.shape;
      e = p.x, i = p.y, o = a = p.radius, s = n = 0;
    } else if (r.type === Ot.ELIP) {
      const p = r.shape;
      e = p.x, i = p.y, o = p.width, a = p.height, s = n = 0;
    } else {
      const p = r.shape, m = p.width / 2, g = p.height / 2;
      e = p.x + m, i = p.y + g, o = a = Math.max(0, Math.min(p.radius, Math.min(m, g))), s = m - o, n = g - a;
    }
    if (!(o >= 0 && a >= 0 && s >= 0 && n >= 0)) {
      t.length = 0;
      return;
    }
    const h = Math.ceil(2.3 * Math.sqrt(o + a)), l = h * 8 + (s ? 4 : 0) + (n ? 4 : 0);
    if (t.length = l, l === 0)
      return;
    if (h === 0) {
      t.length = 8, t[0] = t[6] = e + s, t[1] = t[3] = i + n, t[2] = t[4] = e - s, t[5] = t[7] = i - n;
      return;
    }
    let c = 0, u = h * 4 + (s ? 2 : 0) + 2, d = u, f = l;
    {
      const p = s + o, m = n, g = e + p, y = e - p, v = i + m;
      if (t[c++] = g, t[c++] = v, t[--u] = v, t[--u] = y, n) {
        const _ = i - m;
        t[d++] = y, t[d++] = _, t[--f] = _, t[--f] = g;
      }
    }
    for (let p = 1; p < h; p++) {
      const m = Math.PI / 2 * (p / h), g = s + Math.cos(m) * o, y = n + Math.sin(m) * a, v = e + g, _ = e - g, x = i + y, T = i - y;
      t[c++] = v, t[c++] = x, t[--u] = x, t[--u] = _, t[d++] = _, t[d++] = T, t[--f] = T, t[--f] = v;
    }
    {
      const p = s, m = n + a, g = e + p, y = e - p, v = i + m, _ = i - m;
      t[c++] = g, t[c++] = v, t[--f] = _, t[--f] = g, s && (t[c++] = y, t[c++] = v, t[--f] = _, t[--f] = y);
    }
  },
  triangulate(r, t) {
    const e = r.points, i = t.points, s = t.indices;
    if (e.length === 0)
      return;
    let n = i.length / 2;
    const o = n;
    let a, h;
    if (r.type !== Ot.RREC) {
      const c = r.shape;
      a = c.x, h = c.y;
    } else {
      const c = r.shape;
      a = c.x + c.width / 2, h = c.y + c.height / 2;
    }
    const l = r.matrix;
    i.push(
      r.matrix ? l.a * a + l.c * h + l.tx : a,
      r.matrix ? l.b * a + l.d * h + l.ty : h
    ), n++, i.push(e[0], e[1]);
    for (let c = 2; c < e.length; c += 2)
      i.push(e[c], e[c + 1]), s.push(n++, o, n);
    s.push(o + 1, o, n);
  }
};
function Yh(r, t = !1) {
  const e = r.length;
  if (e < 6)
    return;
  let i = 0;
  for (let s = 0, n = r[e - 2], o = r[e - 1]; s < e; s += 2) {
    const a = r[s], h = r[s + 1];
    i += (a - n) * (h + o), n = a, o = h;
  }
  if (!t && i > 0 || t && i <= 0) {
    const s = e / 2;
    for (let n = s + s % 2; n < e; n += 2) {
      const o = e - n - 2, a = e - n - 1, h = n, l = n + 1;
      [r[o], r[h]] = [r[h], r[o]], [r[a], r[l]] = [r[l], r[a]];
    }
  }
}
const lu = {
  build(r) {
    r.points = r.shape.points.slice();
  },
  triangulate(r, t) {
    let e = r.points;
    const i = r.holes, s = t.points, n = t.indices;
    if (e.length >= 6) {
      Yh(e, !1);
      const o = [];
      for (let l = 0; l < i.length; l++) {
        const c = i[l];
        Yh(c.points, !0), o.push(e.length / 2), e = e.concat(c.points);
      }
      const a = Kd(e, o, 2);
      if (!a)
        return;
      const h = s.length / 2;
      for (let l = 0; l < a.length; l += 3)
        n.push(a[l] + h), n.push(a[l + 1] + h), n.push(a[l + 2] + h);
      for (let l = 0; l < e.length; l++)
        s.push(e[l]);
    }
  }
}, i_ = {
  build(r) {
    const t = r.shape, e = t.x, i = t.y, s = t.width, n = t.height, o = r.points;
    o.length = 0, s >= 0 && n >= 0 && o.push(
      e,
      i,
      e + s,
      i,
      e + s,
      i + n,
      e,
      i + n
    );
  },
  triangulate(r, t) {
    const e = r.points, i = t.points;
    if (e.length === 0)
      return;
    const s = i.length / 2;
    i.push(
      e[0],
      e[1],
      e[2],
      e[3],
      e[6],
      e[7],
      e[4],
      e[5]
    ), t.indices.push(
      s,
      s + 1,
      s + 2,
      s + 1,
      s + 2,
      s + 3
    );
  }
}, s_ = {
  build(r) {
    Gs.build(r);
  },
  triangulate(r, t) {
    Gs.triangulate(r, t);
  }
};
var $t = /* @__PURE__ */ ((r) => (r.MITER = "miter", r.BEVEL = "bevel", r.ROUND = "round", r))($t || {}), $e = /* @__PURE__ */ ((r) => (r.BUTT = "butt", r.ROUND = "round", r.SQUARE = "square", r))($e || {});
const ei = {
  adaptive: !0,
  maxLength: 10,
  minSegments: 8,
  maxSegments: 2048,
  epsilon: 1e-4,
  _segmentsCount(r, t = 20) {
    if (!this.adaptive || !r || isNaN(r))
      return t;
    let e = Math.ceil(r / this.maxLength);
    return e < this.minSegments ? e = this.minSegments : e > this.maxSegments && (e = this.maxSegments), e;
  }
};
class qh {
  /**
   * Calculate information of the arc for {@link PIXI.Graphics.arcTo}.
   * @private
   * @param x1 - The x-coordinate of the first control point of the arc
   * @param y1 - The y-coordinate of the first control point of the arc
   * @param x2 - The x-coordinate of the second control point of the arc
   * @param y2 - The y-coordinate of the second control point of the arc
   * @param radius - The radius of the arc
   * @param points - Collection of points to add to
   * @returns - If the arc length is valid, return center of circle, radius and other info otherwise `null`.
   */
  static curveTo(t, e, i, s, n, o) {
    const a = o[o.length - 2], h = o[o.length - 1] - e, l = a - t, c = s - e, u = i - t, d = Math.abs(h * u - l * c);
    if (d < 1e-8 || n === 0)
      return (o[o.length - 2] !== t || o[o.length - 1] !== e) && o.push(t, e), null;
    const f = h * h + l * l, p = c * c + u * u, m = h * c + l * u, g = n * Math.sqrt(f) / d, y = n * Math.sqrt(p) / d, v = g * m / f, _ = y * m / p, x = g * u + y * l, T = g * c + y * h, C = l * (y + v), w = h * (y + v), I = u * (g + _), S = c * (g + _), P = Math.atan2(w - T, C - x), O = Math.atan2(S - T, I - x);
    return {
      cx: x + t,
      cy: T + e,
      radius: n,
      startAngle: P,
      endAngle: O,
      anticlockwise: l * c > u * h
    };
  }
  /**
   * The arc method creates an arc/curve (used to create circles, or parts of circles).
   * @private
   * @param _startX - Start x location of arc
   * @param _startY - Start y location of arc
   * @param cx - The x-coordinate of the center of the circle
   * @param cy - The y-coordinate of the center of the circle
   * @param radius - The radius of the circle
   * @param startAngle - The starting angle, in radians (0 is at the 3 o'clock position
   *  of the arc's circle)
   * @param endAngle - The ending angle, in radians
   * @param _anticlockwise - Specifies whether the drawing should be
   *  counter-clockwise or clockwise. False is default, and indicates clockwise, while true
   *  indicates counter-clockwise.
   * @param points - Collection of points to add to
   */
  static arc(t, e, i, s, n, o, a, h, l) {
    const c = a - o, u = ei._segmentsCount(
      Math.abs(c) * n,
      Math.ceil(Math.abs(c) / Ms) * 40
    ), d = c / (u * 2), f = d * 2, p = Math.cos(d), m = Math.sin(d), g = u - 1, y = g % 1 / g;
    for (let v = 0; v <= g; ++v) {
      const _ = v + y * v, x = d + o + f * _, T = Math.cos(x), C = -Math.sin(x);
      l.push(
        (p * T + m * C) * n + i,
        (p * -C + m * T) * n + s
      );
    }
  }
}
class n_ {
  constructor() {
    this.reset();
  }
  /**
   * Begin batch part.
   * @param style
   * @param startIndex
   * @param attribStart
   */
  begin(t, e, i) {
    this.reset(), this.style = t, this.start = e, this.attribStart = i;
  }
  /**
   * End batch part.
   * @param endIndex
   * @param endAttrib
   */
  end(t, e) {
    this.attribSize = e - this.attribStart, this.size = t - this.start;
  }
  reset() {
    this.style = null, this.size = 0, this.start = 0, this.attribStart = 0, this.attribSize = 0;
  }
}
class ga {
  /**
   * Calculate length of bezier curve.
   * Analytical solution is impossible, since it involves an integral that does not integrate in general.
   * Therefore numerical solution is used.
   * @private
   * @param fromX - Starting point x
   * @param fromY - Starting point y
   * @param cpX - Control point x
   * @param cpY - Control point y
   * @param cpX2 - Second Control point x
   * @param cpY2 - Second Control point y
   * @param toX - Destination point x
   * @param toY - Destination point y
   * @returns - Length of bezier curve
   */
  static curveLength(t, e, i, s, n, o, a, h) {
    let l = 0, c = 0, u = 0, d = 0, f = 0, p = 0, m = 0, g = 0, y = 0, v = 0, _ = 0, x = t, T = e;
    for (let C = 1; C <= 10; ++C)
      c = C / 10, u = c * c, d = u * c, f = 1 - c, p = f * f, m = p * f, g = m * t + 3 * p * c * i + 3 * f * u * n + d * a, y = m * e + 3 * p * c * s + 3 * f * u * o + d * h, v = x - g, _ = T - y, x = g, T = y, l += Math.sqrt(v * v + _ * _);
    return l;
  }
  /**
   * Calculate the points for a bezier curve and then draws it.
   *
   * Ignored from docs since it is not directly exposed.
   * @ignore
   * @param cpX - Control point x
   * @param cpY - Control point y
   * @param cpX2 - Second Control point x
   * @param cpY2 - Second Control point y
   * @param toX - Destination point x
   * @param toY - Destination point y
   * @param points - Path array to push points into
   */
  static curveTo(t, e, i, s, n, o, a) {
    const h = a[a.length - 2], l = a[a.length - 1];
    a.length -= 2;
    const c = ei._segmentsCount(
      ga.curveLength(h, l, t, e, i, s, n, o)
    );
    let u = 0, d = 0, f = 0, p = 0, m = 0;
    a.push(h, l);
    for (let g = 1, y = 0; g <= c; ++g)
      y = g / c, u = 1 - y, d = u * u, f = d * u, p = y * y, m = p * y, a.push(
        f * h + 3 * d * y * t + 3 * u * p * i + m * n,
        f * l + 3 * d * y * e + 3 * u * p * s + m * o
      );
  }
}
function Kh(r, t, e, i, s, n, o, a) {
  const h = r - e * s, l = t - i * s, c = r + e * n, u = t + i * n;
  let d, f;
  o ? (d = i, f = -e) : (d = -i, f = e);
  const p = h + d, m = l + f, g = c + d, y = u + f;
  return a.push(
    p,
    m,
    g,
    y
  ), 2;
}
function sr(r, t, e, i, s, n, o, a) {
  const h = e - r, l = i - t;
  let c = Math.atan2(h, l), u = Math.atan2(s - r, n - t);
  a && c < u ? c += Math.PI * 2 : !a && c > u && (u += Math.PI * 2);
  let d = c;
  const f = u - c, p = Math.abs(f), m = Math.sqrt(h * h + l * l), g = (15 * p * Math.sqrt(m) / Math.PI >> 0) + 1, y = f / g;
  if (d += y, a) {
    o.push(
      r,
      t,
      e,
      i
    );
    for (let v = 1, _ = d; v < g; v++, _ += y)
      o.push(
        r,
        t,
        r + Math.sin(_) * m,
        t + Math.cos(_) * m
      );
    o.push(
      r,
      t,
      s,
      n
    );
  } else {
    o.push(
      e,
      i,
      r,
      t
    );
    for (let v = 1, _ = d; v < g; v++, _ += y)
      o.push(
        r + Math.sin(_) * m,
        t + Math.cos(_) * m,
        r,
        t
      );
    o.push(
      s,
      n,
      r,
      t
    );
  }
  return g * 2;
}
function o_(r, t) {
  const e = r.shape;
  let i = r.points || e.points.slice();
  const s = t.closePointEps;
  if (i.length === 0)
    return;
  const n = r.lineStyle, o = new lt(i[0], i[1]), a = new lt(i[i.length - 2], i[i.length - 1]), h = e.type !== Ot.POLY || e.closeStroke, l = Math.abs(o.x - a.x) < s && Math.abs(o.y - a.y) < s;
  if (h) {
    i = i.slice(), l && (i.pop(), i.pop(), a.set(i[i.length - 2], i[i.length - 1]));
    const D = (o.x + a.x) * 0.5, N = (a.y + o.y) * 0.5;
    i.unshift(D, N), i.push(D, N);
  }
  const c = t.points, u = i.length / 2;
  let d = i.length;
  const f = c.length / 2, p = n.width / 2, m = p * p, g = n.miterLimit * n.miterLimit;
  let y = i[0], v = i[1], _ = i[2], x = i[3], T = 0, C = 0, w = -(v - x), I = y - _, S = 0, P = 0, O = Math.sqrt(w * w + I * I);
  w /= O, I /= O, w *= p, I *= p;
  const M = n.alignment, E = (1 - M) * 2, A = M * 2;
  h || (n.cap === $e.ROUND ? d += sr(
    y - w * (E - A) * 0.5,
    v - I * (E - A) * 0.5,
    y - w * E,
    v - I * E,
    y + w * A,
    v + I * A,
    c,
    !0
  ) + 2 : n.cap === $e.SQUARE && (d += Kh(y, v, w, I, E, A, !0, c))), c.push(
    y - w * E,
    v - I * E,
    y + w * A,
    v + I * A
  );
  for (let D = 1; D < u - 1; ++D) {
    y = i[(D - 1) * 2], v = i[(D - 1) * 2 + 1], _ = i[D * 2], x = i[D * 2 + 1], T = i[(D + 1) * 2], C = i[(D + 1) * 2 + 1], w = -(v - x), I = y - _, O = Math.sqrt(w * w + I * I), w /= O, I /= O, w *= p, I *= p, S = -(x - C), P = _ - T, O = Math.sqrt(S * S + P * P), S /= O, P /= O, S *= p, P *= p;
    const N = _ - y, q = v - x, B = _ - T, L = C - x, Y = N * B + q * L, nt = q * B - L * N, at = nt < 0;
    if (Math.abs(nt) < 1e-3 * Math.abs(Y)) {
      c.push(
        _ - w * E,
        x - I * E,
        _ + w * A,
        x + I * A
      ), Y >= 0 && (n.join === $t.ROUND ? d += sr(
        _,
        x,
        _ - w * E,
        x - I * E,
        _ - S * E,
        x - P * E,
        c,
        !1
      ) + 4 : d += 2, c.push(
        _ - S * A,
        x - P * A,
        _ + S * E,
        x + P * E
      ));
      continue;
    }
    const mt = (-w + y) * (-I + x) - (-w + _) * (-I + v), rt = (-S + T) * (-P + x) - (-S + _) * (-P + C), gt = (N * rt - B * mt) / nt, _t = (L * mt - q * rt) / nt, St = (gt - _) * (gt - _) + (_t - x) * (_t - x), et = _ + (gt - _) * E, ct = x + (_t - x) * E, dt = _ - (gt - _) * A, vt = x - (_t - x) * A, zt = Math.min(N * N + q * q, B * B + L * L), ht = at ? E : A, V = zt + ht * ht * m, Fu = St <= V;
    let Li = n.join;
    if (Li === $t.MITER && St / m > g && (Li = $t.BEVEL), Fu)
      switch (Li) {
        case $t.MITER: {
          c.push(
            et,
            ct,
            dt,
            vt
          );
          break;
        }
        case $t.BEVEL: {
          at ? c.push(
            et,
            ct,
            // inner miter point
            _ + w * A,
            x + I * A,
            // first segment's outer vertex
            et,
            ct,
            // inner miter point
            _ + S * A,
            x + P * A
          ) : c.push(
            _ - w * E,
            x - I * E,
            // first segment's inner vertex
            dt,
            vt,
            // outer miter point
            _ - S * E,
            x - P * E,
            // second segment's outer vertex
            dt,
            vt
          ), d += 2;
          break;
        }
        case $t.ROUND: {
          at ? (c.push(
            et,
            ct,
            _ + w * A,
            x + I * A
          ), d += sr(
            _,
            x,
            _ + w * A,
            x + I * A,
            _ + S * A,
            x + P * A,
            c,
            !0
          ) + 4, c.push(
            et,
            ct,
            _ + S * A,
            x + P * A
          )) : (c.push(
            _ - w * E,
            x - I * E,
            dt,
            vt
          ), d += sr(
            _,
            x,
            _ - w * E,
            x - I * E,
            _ - S * E,
            x - P * E,
            c,
            !1
          ) + 4, c.push(
            _ - S * E,
            x - P * E,
            dt,
            vt
          ));
          break;
        }
      }
    else {
      switch (c.push(
        _ - w * E,
        x - I * E,
        // first segment's inner vertex
        _ + w * A,
        x + I * A
      ), Li) {
        case $t.MITER: {
          at ? c.push(
            dt,
            vt,
            // inner miter point
            dt,
            vt
          ) : c.push(
            et,
            ct,
            // outer miter point
            et,
            ct
          ), d += 2;
          break;
        }
        case $t.ROUND: {
          at ? d += sr(
            _,
            x,
            _ + w * A,
            x + I * A,
            _ + S * A,
            x + P * A,
            c,
            !0
          ) + 2 : d += sr(
            _,
            x,
            _ - w * E,
            x - I * E,
            _ - S * E,
            x - P * E,
            c,
            !1
          ) + 2;
          break;
        }
      }
      c.push(
        _ - S * E,
        x - P * E,
        // second segment's inner vertex
        _ + S * A,
        x + P * A
      ), d += 2;
    }
  }
  y = i[(u - 2) * 2], v = i[(u - 2) * 2 + 1], _ = i[(u - 1) * 2], x = i[(u - 1) * 2 + 1], w = -(v - x), I = y - _, O = Math.sqrt(w * w + I * I), w /= O, I /= O, w *= p, I *= p, c.push(
    _ - w * E,
    x - I * E,
    _ + w * A,
    x + I * A
  ), h || (n.cap === $e.ROUND ? d += sr(
    _ - w * (E - A) * 0.5,
    x - I * (E - A) * 0.5,
    _ - w * E,
    x - I * E,
    _ + w * A,
    x + I * A,
    c,
    !1
  ) + 2 : n.cap === $e.SQUARE && (d += Kh(_, x, w, I, E, A, !1, c)));
  const R = t.indices, X = ei.epsilon * ei.epsilon;
  for (let D = f; D < d + f - 2; ++D)
    y = c[D * 2], v = c[D * 2 + 1], _ = c[(D + 1) * 2], x = c[(D + 1) * 2 + 1], T = c[(D + 2) * 2], C = c[(D + 2) * 2 + 1], !(Math.abs(y * (x - C) + _ * (C - v) + T * (v - x)) < X) && R.push(D, D + 1, D + 2);
}
function a_(r, t) {
  let e = 0;
  const i = r.shape, s = r.points || i.points, n = i.type !== Ot.POLY || i.closeStroke;
  if (s.length === 0)
    return;
  const o = t.points, a = t.indices, h = s.length / 2, l = o.length / 2;
  let c = l;
  for (o.push(s[0], s[1]), e = 1; e < h; e++)
    o.push(s[e * 2], s[e * 2 + 1]), a.push(c, c + 1), c++;
  n && a.push(c, l);
}
function Zh(r, t) {
  r.lineStyle.native ? a_(r, t) : o_(r, t);
}
class ya {
  /**
   * Calculate length of quadratic curve
   * @see {@link http://www.malczak.linuxpl.com/blog/quadratic-bezier-curve-length/}
   * for the detailed explanation of math behind this.
   * @private
   * @param fromX - x-coordinate of curve start point
   * @param fromY - y-coordinate of curve start point
   * @param cpX - x-coordinate of curve control point
   * @param cpY - y-coordinate of curve control point
   * @param toX - x-coordinate of curve end point
   * @param toY - y-coordinate of curve end point
   * @returns - Length of quadratic curve
   */
  static curveLength(t, e, i, s, n, o) {
    const a = t - 2 * i + n, h = e - 2 * s + o, l = 2 * i - 2 * t, c = 2 * s - 2 * e, u = 4 * (a * a + h * h), d = 4 * (a * l + h * c), f = l * l + c * c, p = 2 * Math.sqrt(u + d + f), m = Math.sqrt(u), g = 2 * u * m, y = 2 * Math.sqrt(f), v = d / m;
    return (g * p + m * d * (p - y) + (4 * f * u - d * d) * Math.log((2 * m + v + p) / (v + y))) / (4 * g);
  }
  /**
   * Calculate the points for a quadratic bezier curve and then draws it.
   * Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
   * @private
   * @param cpX - Control point x
   * @param cpY - Control point y
   * @param toX - Destination point x
   * @param toY - Destination point y
   * @param points - Points to add segments to.
   */
  static curveTo(t, e, i, s, n) {
    const o = n[n.length - 2], a = n[n.length - 1], h = ei._segmentsCount(
      ya.curveLength(o, a, t, e, i, s)
    );
    let l = 0, c = 0;
    for (let u = 1; u <= h; ++u) {
      const d = u / h;
      l = o + (t - o) * d, c = a + (e - a) * d, n.push(
        l + (t + (i - t) * d - l) * d,
        c + (e + (s - e) * d - c) * d
      );
    }
  }
}
const kn = {
  [Ot.POLY]: lu,
  [Ot.CIRC]: Gs,
  [Ot.ELIP]: Gs,
  [Ot.RECT]: i_,
  [Ot.RREC]: s_
}, Qh = [], ns = [];
class Hs {
  /**
   * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - The shape object to draw.
   * @param fillStyle - the width of the line to draw
   * @param lineStyle - the color of the line to draw
   * @param matrix - Transform matrix
   */
  constructor(t, e = null, i = null, s = null) {
    this.points = [], this.holes = [], this.shape = t, this.lineStyle = i, this.fillStyle = e, this.matrix = s, this.type = t.type;
  }
  /**
   * Creates a new GraphicsData object with the same values as this one.
   * @returns - Cloned GraphicsData object
   */
  clone() {
    return new Hs(
      this.shape,
      this.fillStyle,
      this.lineStyle,
      this.matrix
    );
  }
  /** Destroys the Graphics data. */
  destroy() {
    this.shape = null, this.holes.length = 0, this.holes = null, this.points.length = 0, this.points = null, this.lineStyle = null, this.fillStyle = null;
  }
}
const Br = new lt(), cu = class uu extends gc {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super(), this.closePointEps = 1e-4, this.boundsPadding = 0, this.uvsFloat32 = null, this.indicesUint16 = null, this.batchable = !1, this.points = [], this.colors = [], this.uvs = [], this.indices = [], this.textureIds = [], this.graphicsData = [], this.drawCalls = [], this.batchDirty = -1, this.batches = [], this.dirty = 0, this.cacheDirty = -1, this.clearDirty = 0, this.shapeIndex = 0, this._bounds = new Ls(), this.boundsDirty = -1;
  }
  /**
   * Get the current bounds of the graphic geometry.
   *
   * Since 6.5.0, bounds of the graphics geometry are calculated based on the vertices of generated geometry.
   * Since shapes or strokes with full transparency (`alpha: 0`) will not generate geometry, they are not considered
   * when calculating bounds for the graphics geometry. See PR [#8343]{@link https://github.com/pixijs/pixijs/pull/8343}
   * and issue [#8623]{@link https://github.com/pixijs/pixijs/pull/8623}.
   * @readonly
   */
  get bounds() {
    return this.updateBatches(), this.boundsDirty !== this.dirty && (this.boundsDirty = this.dirty, this.calculateBounds()), this._bounds;
  }
  /** Call if you changed graphicsData manually. Empties all batch buffers. */
  invalidate() {
    this.boundsDirty = -1, this.dirty++, this.batchDirty++, this.shapeIndex = 0, this.points.length = 0, this.colors.length = 0, this.uvs.length = 0, this.indices.length = 0, this.textureIds.length = 0;
    for (let t = 0; t < this.drawCalls.length; t++)
      this.drawCalls[t].texArray.clear(), ns.push(this.drawCalls[t]);
    this.drawCalls.length = 0;
    for (let t = 0; t < this.batches.length; t++) {
      const e = this.batches[t];
      e.reset(), Qh.push(e);
    }
    this.batches.length = 0;
  }
  /**
   * Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
   * @returns - This GraphicsGeometry object. Good for chaining method calls
   */
  clear() {
    return this.graphicsData.length > 0 && (this.invalidate(), this.clearDirty++, this.graphicsData.length = 0), this;
  }
  /**
   * Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.
   * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - The shape object to draw.
   * @param fillStyle - Defines style of the fill.
   * @param lineStyle - Defines style of the lines.
   * @param matrix - Transform applied to the points of the shape.
   * @returns - Returns geometry for chaining.
   */
  drawShape(t, e = null, i = null, s = null) {
    const n = new Hs(t, e, i, s);
    return this.graphicsData.push(n), this.dirty++, this;
  }
  /**
   * Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.
   * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - The shape object to draw.
   * @param matrix - Transform applied to the points of the shape.
   * @returns - Returns geometry for chaining.
   */
  drawHole(t, e = null) {
    if (!this.graphicsData.length)
      return null;
    const i = new Hs(t, null, null, e), s = this.graphicsData[this.graphicsData.length - 1];
    return i.lineStyle = s.lineStyle, s.holes.push(i), this.dirty++, this;
  }
  /** Destroys the GraphicsGeometry object. */
  destroy() {
    super.destroy();
    for (let t = 0; t < this.graphicsData.length; ++t)
      this.graphicsData[t].destroy();
    this.points.length = 0, this.points = null, this.colors.length = 0, this.colors = null, this.uvs.length = 0, this.uvs = null, this.indices.length = 0, this.indices = null, this.indexBuffer.destroy(), this.indexBuffer = null, this.graphicsData.length = 0, this.graphicsData = null, this.drawCalls.length = 0, this.drawCalls = null, this.batches.length = 0, this.batches = null, this._bounds = null;
  }
  /**
   * Check to see if a point is contained within this geometry.
   * @param point - Point to check if it's contained.
   * @returns {boolean} `true` if the point is contained within geometry.
   */
  containsPoint(t) {
    const e = this.graphicsData;
    for (let i = 0; i < e.length; ++i) {
      const s = e[i];
      if (s.fillStyle.visible && s.shape && (s.matrix ? s.matrix.applyInverse(t, Br) : Br.copyFrom(t), s.shape.contains(Br.x, Br.y))) {
        let n = !1;
        if (s.holes) {
          for (let o = 0; o < s.holes.length; o++)
            if (s.holes[o].shape.contains(Br.x, Br.y)) {
              n = !0;
              break;
            }
        }
        if (!n)
          return !0;
      }
    }
    return !1;
  }
  /**
   * Generates intermediate batch data. Either gets converted to drawCalls
   * or used to convert to batch objects directly by the Graphics object.
   */
  updateBatches() {
    if (!this.graphicsData.length) {
      this.batchable = !0;
      return;
    }
    if (!this.validateBatching())
      return;
    this.cacheDirty = this.dirty;
    const t = this.uvs, e = this.graphicsData;
    let i = null, s = null;
    this.batches.length > 0 && (i = this.batches[this.batches.length - 1], s = i.style);
    for (let h = this.shapeIndex; h < e.length; h++) {
      this.shapeIndex++;
      const l = e[h], c = l.fillStyle, u = l.lineStyle;
      kn[l.type].build(l), l.matrix && this.transformPoints(l.points, l.matrix), (c.visible || u.visible) && this.processHoles(l.holes);
      for (let d = 0; d < 2; d++) {
        const f = d === 0 ? c : u;
        if (!f.visible)
          continue;
        const p = f.texture.baseTexture, m = this.indices.length, g = this.points.length / 2;
        p.wrapMode = Ye.REPEAT, d === 0 ? this.processFill(l) : this.processLine(l);
        const y = this.points.length / 2 - g;
        y !== 0 && (i && !this._compareStyles(s, f) && (i.end(m, g), i = null), i || (i = Qh.pop() || new n_(), i.begin(f, m, g), this.batches.push(i), s = f), this.addUvs(this.points, t, f.texture, g, y, f.matrix));
      }
    }
    const n = this.indices.length, o = this.points.length / 2;
    if (i && i.end(n, o), this.batches.length === 0) {
      this.batchable = !0;
      return;
    }
    const a = o > 65535;
    this.indicesUint16 && this.indices.length === this.indicesUint16.length && a === this.indicesUint16.BYTES_PER_ELEMENT > 2 ? this.indicesUint16.set(this.indices) : this.indicesUint16 = a ? new Uint32Array(this.indices) : new Uint16Array(this.indices), this.batchable = this.isBatchable(), this.batchable ? this.packBatches() : this.buildDrawCalls();
  }
  /**
   * Affinity check
   * @param styleA
   * @param styleB
   */
  _compareStyles(t, e) {
    return !(!t || !e || t.texture.baseTexture !== e.texture.baseTexture || t.color + t.alpha !== e.color + e.alpha || !!t.native != !!e.native);
  }
  /** Test geometry for batching process. */
  validateBatching() {
    if (this.dirty === this.cacheDirty || !this.graphicsData.length)
      return !1;
    for (let t = 0, e = this.graphicsData.length; t < e; t++) {
      const i = this.graphicsData[t], s = i.fillStyle, n = i.lineStyle;
      if (s && !s.texture.baseTexture.valid || n && !n.texture.baseTexture.valid)
        return !1;
    }
    return !0;
  }
  /** Offset the indices so that it works with the batcher. */
  packBatches() {
    this.batchDirty++, this.uvsFloat32 = new Float32Array(this.uvs);
    const t = this.batches;
    for (let e = 0, i = t.length; e < i; e++) {
      const s = t[e];
      for (let n = 0; n < s.size; n++) {
        const o = s.start + n;
        this.indicesUint16[o] = this.indicesUint16[o] - s.attribStart;
      }
    }
  }
  /**
   * Checks to see if this graphics geometry can be batched.
   * Currently it needs to be small enough and not contain any native lines.
   */
  isBatchable() {
    if (this.points.length > 65535 * 2)
      return !1;
    const t = this.batches;
    for (let e = 0; e < t.length; e++)
      if (t[e].style.native)
        return !1;
    return this.points.length < uu.BATCHABLE_SIZE * 2;
  }
  /** Converts intermediate batches data to drawCalls. */
  buildDrawCalls() {
    let t = ++J._globalBatch;
    for (let u = 0; u < this.drawCalls.length; u++)
      this.drawCalls[u].texArray.clear(), ns.push(this.drawCalls[u]);
    this.drawCalls.length = 0;
    const e = this.colors, i = this.textureIds;
    let s = ns.pop();
    s || (s = new vo(), s.texArray = new Eo()), s.texArray.count = 0, s.start = 0, s.size = 0, s.type = be.TRIANGLES;
    let n = 0, o = null, a = 0, h = !1, l = be.TRIANGLES, c = 0;
    this.drawCalls.push(s);
    for (let u = 0; u < this.batches.length; u++) {
      const d = this.batches[u], f = 8, p = d.style, m = p.texture.baseTexture;
      h !== !!p.native && (h = !!p.native, l = h ? be.LINES : be.TRIANGLES, o = null, n = f, t++), o !== m && (o = m, m._batchEnabled !== t && (n === f && (t++, n = 0, s.size > 0 && (s = ns.pop(), s || (s = new vo(), s.texArray = new Eo()), this.drawCalls.push(s)), s.start = c, s.size = 0, s.texArray.count = 0, s.type = l), m.touched = 1, m._batchEnabled = t, m._batchLocation = n, m.wrapMode = Ye.REPEAT, s.texArray.elements[s.texArray.count++] = m, n++)), s.size += d.size, c += d.size, a = m._batchLocation, this.addColors(e, p.color, p.alpha, d.attribSize, d.attribStart), this.addTextureIds(i, a, d.attribSize, d.attribStart);
    }
    J._globalBatch = t, this.packAttributes();
  }
  /** Packs attributes to single buffer. */
  packAttributes() {
    const t = this.points, e = this.uvs, i = this.colors, s = this.textureIds, n = new ArrayBuffer(t.length * 3 * 4), o = new Float32Array(n), a = new Uint32Array(n);
    let h = 0;
    for (let l = 0; l < t.length / 2; l++)
      o[h++] = t[l * 2], o[h++] = t[l * 2 + 1], o[h++] = e[l * 2], o[h++] = e[l * 2 + 1], a[h++] = i[l], o[h++] = s[l];
    this._buffer.update(n), this._indexBuffer.update(this.indicesUint16);
  }
  /**
   * Process fill part of Graphics.
   * @param data
   */
  processFill(t) {
    t.holes.length ? lu.triangulate(t, this) : kn[t.type].triangulate(t, this);
  }
  /**
   * Process line part of Graphics.
   * @param data
   */
  processLine(t) {
    Zh(t, this);
    for (let e = 0; e < t.holes.length; e++)
      Zh(t.holes[e], this);
  }
  /**
   * Process the holes data.
   * @param holes
   */
  processHoles(t) {
    for (let e = 0; e < t.length; e++) {
      const i = t[e];
      kn[i.type].build(i), i.matrix && this.transformPoints(i.points, i.matrix);
    }
  }
  /** Update the local bounds of the object. Expensive to use performance-wise. */
  calculateBounds() {
    const t = this._bounds;
    t.clear(), t.addVertexData(this.points, 0, this.points.length), t.pad(this.boundsPadding, this.boundsPadding);
  }
  /**
   * Transform points using matrix.
   * @param points - Points to transform
   * @param matrix - Transform matrix
   */
  transformPoints(t, e) {
    for (let i = 0; i < t.length / 2; i++) {
      const s = t[i * 2], n = t[i * 2 + 1];
      t[i * 2] = e.a * s + e.c * n + e.tx, t[i * 2 + 1] = e.b * s + e.d * n + e.ty;
    }
  }
  /**
   * Add colors.
   * @param colors - List of colors to add to
   * @param color - Color to add
   * @param alpha - Alpha to use
   * @param size - Number of colors to add
   * @param offset
   */
  addColors(t, e, i, s, n = 0) {
    const o = pt.shared.setValue(e).toLittleEndianNumber(), a = pt.shared.setValue(o).toPremultiplied(i);
    t.length = Math.max(t.length, n + s);
    for (let h = 0; h < s; h++)
      t[n + h] = a;
  }
  /**
   * Add texture id that the shader/fragment wants to use.
   * @param textureIds
   * @param id
   * @param size
   * @param offset
   */
  addTextureIds(t, e, i, s = 0) {
    t.length = Math.max(t.length, s + i);
    for (let n = 0; n < i; n++)
      t[s + n] = e;
  }
  /**
   * Generates the UVs for a shape.
   * @param verts - Vertices
   * @param uvs - UVs
   * @param texture - Reference to Texture
   * @param start - Index buffer start index.
   * @param size - The size/length for index buffer.
   * @param matrix - Optional transform for all points.
   */
  addUvs(t, e, i, s, n, o = null) {
    let a = 0;
    const h = e.length, l = i.frame;
    for (; a < n; ) {
      let u = t[(s + a) * 2], d = t[(s + a) * 2 + 1];
      if (o) {
        const f = o.a * u + o.c * d + o.tx;
        d = o.b * u + o.d * d + o.ty, u = f;
      }
      a++, e.push(u / l.width, d / l.height);
    }
    const c = i.baseTexture;
    (l.width < c.width || l.height < c.height) && this.adjustUvs(e, i, h, n);
  }
  /**
   * Modify uvs array according to position of texture region
   * Does not work with rotated or trimmed textures
   * @param uvs - array
   * @param texture - region
   * @param start - starting index for uvs
   * @param size - how many points to adjust
   */
  adjustUvs(t, e, i, s) {
    const n = e.baseTexture, o = 1e-6, a = i + s * 2, h = e.frame, l = h.width / n.width, c = h.height / n.height;
    let u = h.x / h.width, d = h.y / h.height, f = Math.floor(t[i] + o), p = Math.floor(t[i + 1] + o);
    for (let m = i + 2; m < a; m += 2)
      f = Math.min(f, Math.floor(t[m] + o)), p = Math.min(p, Math.floor(t[m + 1] + o));
    u -= f, d -= p;
    for (let m = i; m < a; m += 2)
      t[m] = (t[m] + u) * l, t[m + 1] = (t[m + 1] + d) * c;
  }
};
cu.BATCHABLE_SIZE = 100;
let h_ = cu;
class Js {
  constructor() {
    this.color = 16777215, this.alpha = 1, this.texture = j.WHITE, this.matrix = null, this.visible = !1, this.reset();
  }
  /** Clones the object */
  clone() {
    const t = new Js();
    return t.color = this.color, t.alpha = this.alpha, t.texture = this.texture, t.matrix = this.matrix, t.visible = this.visible, t;
  }
  /** Reset */
  reset() {
    this.color = 16777215, this.alpha = 1, this.texture = j.WHITE, this.matrix = null, this.visible = !1;
  }
  /** Destroy and don't use after this. */
  destroy() {
    this.texture = null, this.matrix = null;
  }
}
class _a extends Js {
  constructor() {
    super(...arguments), this.width = 0, this.alignment = 0.5, this.native = !1, this.cap = $e.BUTT, this.join = $t.MITER, this.miterLimit = 10;
  }
  /** Clones the object. */
  clone() {
    const t = new _a();
    return t.color = this.color, t.alpha = this.alpha, t.texture = this.texture, t.matrix = this.matrix, t.visible = this.visible, t.width = this.width, t.alignment = this.alignment, t.native = this.native, t.cap = this.cap, t.join = this.join, t.miterLimit = this.miterLimit, t;
  }
  /** Reset the line style to default. */
  reset() {
    super.reset(), this.color = 0, this.alignment = 0.5, this.width = 0, this.native = !1, this.cap = $e.BUTT, this.join = $t.MITER, this.miterLimit = 10;
  }
}
const Un = {}, Ho = class vs extends de {
  /**
   * @param geometry - Geometry to use, if omitted will create a new GraphicsGeometry instance.
   */
  constructor(t = null) {
    super(), this.shader = null, this.pluginName = "batch", this.currentPath = null, this.batches = [], this.batchTint = -1, this.batchDirty = -1, this.vertexData = null, this._fillStyle = new Js(), this._lineStyle = new _a(), this._matrix = null, this._holeMode = !1, this.state = Ae.for2d(), this._geometry = t || new h_(), this._geometry.refCount++, this._transformID = -1, this._tintColor = new pt(16777215), this.blendMode = K.NORMAL;
  }
  /**
   * Includes vertex positions, face indices, normals, colors, UVs, and
   * custom attributes within buffers, reducing the cost of passing all
   * this data to the GPU. Can be shared between multiple Mesh or Graphics objects.
   * @readonly
   */
  get geometry() {
    return this._geometry;
  }
  /**
   * Creates a new Graphics object with the same values as this one.
   * Note that only the geometry of the object is cloned, not its transform (position,scale,etc)
   * @returns - A clone of the graphics object
   */
  clone() {
    return this.finishPoly(), new vs(this._geometry);
  }
  /**
   * The blend mode to be applied to the graphic shape. Apply a value of
   * `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.  Note that, since each
   * primitive in the GraphicsGeometry list is rendered sequentially, modes
   * such as `PIXI.BLEND_MODES.ADD` and `PIXI.BLEND_MODES.MULTIPLY` will
   * be applied per-primitive.
   * @default PIXI.BLEND_MODES.NORMAL
   */
  set blendMode(t) {
    this.state.blendMode = t;
  }
  get blendMode() {
    return this.state.blendMode;
  }
  /**
   * The tint applied to each graphic shape. This is a hex value. A value of
   * 0xFFFFFF will remove any tint effect.
   * @default 0xFFFFFF
   */
  get tint() {
    return this._tintColor.value;
  }
  set tint(t) {
    this._tintColor.setValue(t);
  }
  /**
   * The current fill style.
   * @readonly
   */
  get fill() {
    return this._fillStyle;
  }
  /**
   * The current line style.
   * @readonly
   */
  get line() {
    return this._lineStyle;
  }
  lineStyle(t = null, e = 0, i, s = 0.5, n = !1) {
    return typeof t == "number" && (t = { width: t, color: e, alpha: i, alignment: s, native: n }), this.lineTextureStyle(t);
  }
  /**
   * Like line style but support texture for line fill.
   * @param [options] - Collection of options for setting line style.
   * @param {number} [options.width=0] - width of the line to draw, will update the objects stored style
   * @param {PIXI.Texture} [options.texture=PIXI.Texture.WHITE] - Texture to use
   * @param {PIXI.ColorSource} [options.color=0x0] - color of the line to draw, will update the objects stored style.
   *  Default 0xFFFFFF if texture present.
   * @param {number} [options.alpha=1] - alpha of the line to draw, will update the objects stored style
   * @param {PIXI.Matrix} [options.matrix=null] - Texture matrix to transform texture
   * @param {number} [options.alignment=0.5] - alignment of the line to draw, (0 = inner, 0.5 = middle, 1 = outer).
   *        WebGL only.
   * @param {boolean} [options.native=false] - If true the lines will be draw using LINES instead of TRIANGLE_STRIP
   * @param {PIXI.LINE_CAP}[options.cap=PIXI.LINE_CAP.BUTT] - line cap style
   * @param {PIXI.LINE_JOIN}[options.join=PIXI.LINE_JOIN.MITER] - line join style
   * @param {number}[options.miterLimit=10] - miter limit ratio
   * @returns {PIXI.Graphics} This Graphics object. Good for chaining method calls
   */
  lineTextureStyle(t) {
    const e = {
      width: 0,
      texture: j.WHITE,
      color: t != null && t.texture ? 16777215 : 0,
      matrix: null,
      alignment: 0.5,
      native: !1,
      cap: $e.BUTT,
      join: $t.MITER,
      miterLimit: 10
    };
    t = Object.assign(e, t), this.normalizeColor(t), this.currentPath && this.startPoly();
    const i = t.width > 0 && t.alpha > 0;
    return i ? (t.matrix && (t.matrix = t.matrix.clone(), t.matrix.invert()), Object.assign(this._lineStyle, { visible: i }, t)) : this._lineStyle.reset(), this;
  }
  /**
   * Start a polygon object internally.
   * @protected
   */
  startPoly() {
    if (this.currentPath) {
      const t = this.currentPath.points, e = this.currentPath.points.length;
      e > 2 && (this.drawShape(this.currentPath), this.currentPath = new _r(), this.currentPath.closeStroke = !1, this.currentPath.points.push(t[e - 2], t[e - 1]));
    } else
      this.currentPath = new _r(), this.currentPath.closeStroke = !1;
  }
  /**
   * Finish the polygon object.
   * @protected
   */
  finishPoly() {
    this.currentPath && (this.currentPath.points.length > 2 ? (this.drawShape(this.currentPath), this.currentPath = null) : this.currentPath.points.length = 0);
  }
  /**
   * Moves the current drawing position to x, y.
   * @param x - the X coordinate to move to
   * @param y - the Y coordinate to move to
   * @returns - This Graphics object. Good for chaining method calls
   */
  moveTo(t, e) {
    return this.startPoly(), this.currentPath.points[0] = t, this.currentPath.points[1] = e, this;
  }
  /**
   * Draws a line using the current line style from the current drawing position to (x, y);
   * The current drawing position is then set to (x, y).
   * @param x - the X coordinate to draw to
   * @param y - the Y coordinate to draw to
   * @returns - This Graphics object. Good for chaining method calls
   */
  lineTo(t, e) {
    this.currentPath || this.moveTo(0, 0);
    const i = this.currentPath.points, s = i[i.length - 2], n = i[i.length - 1];
    return (s !== t || n !== e) && i.push(t, e), this;
  }
  /**
   * Initialize the curve
   * @param x
   * @param y
   */
  _initCurve(t = 0, e = 0) {
    this.currentPath ? this.currentPath.points.length === 0 && (this.currentPath.points = [t, e]) : this.moveTo(t, e);
  }
  /**
   * Calculate the points for a quadratic bezier curve and then draws it.
   * Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
   * @param cpX - Control point x
   * @param cpY - Control point y
   * @param toX - Destination point x
   * @param toY - Destination point y
   * @returns - This Graphics object. Good for chaining method calls
   */
  quadraticCurveTo(t, e, i, s) {
    this._initCurve();
    const n = this.currentPath.points;
    return n.length === 0 && this.moveTo(0, 0), ya.curveTo(t, e, i, s, n), this;
  }
  /**
   * Calculate the points for a bezier curve and then draws it.
   * @param cpX - Control point x
   * @param cpY - Control point y
   * @param cpX2 - Second Control point x
   * @param cpY2 - Second Control point y
   * @param toX - Destination point x
   * @param toY - Destination point y
   * @returns This Graphics object. Good for chaining method calls
   */
  bezierCurveTo(t, e, i, s, n, o) {
    return this._initCurve(), ga.curveTo(t, e, i, s, n, o, this.currentPath.points), this;
  }
  /**
   * The `arcTo` method creates an arc/curve between two tangents on the canvas.
   * The first tangent is from the start point to the first control point,
   * and the second tangent is from the first control point to the second control point.
   * Note that the second control point is not necessarily the end point of the arc.
   *
   * "borrowed" from https://code.google.com/p/fxcanvas/ - thanks google!
   * @param x1 - The x-coordinate of the first control point of the arc
   * @param y1 - The y-coordinate of the first control point of the arc
   * @param x2 - The x-coordinate of the second control point of the arc
   * @param y2 - The y-coordinate of the second control point of the arc
   * @param radius - The radius of the arc
   * @returns - This Graphics object. Good for chaining method calls
   */
  arcTo(t, e, i, s, n) {
    this._initCurve(t, e);
    const o = this.currentPath.points, a = qh.curveTo(t, e, i, s, n, o);
    if (a) {
      const { cx: h, cy: l, radius: c, startAngle: u, endAngle: d, anticlockwise: f } = a;
      this.arc(h, l, c, u, d, f);
    }
    return this;
  }
  /**
   * The arc method creates an arc/curve (used to create circles, or parts of circles).
   * @param cx - The x-coordinate of the center of the circle
   * @param cy - The y-coordinate of the center of the circle
   * @param radius - The radius of the circle
   * @param startAngle - The starting angle, in radians (0 is at the 3 o'clock position
   *  of the arc's circle)
   * @param endAngle - The ending angle, in radians
   * @param anticlockwise - Specifies whether the drawing should be
   *  counter-clockwise or clockwise. False is default, and indicates clockwise, while true
   *  indicates counter-clockwise.
   * @returns - This Graphics object. Good for chaining method calls
   */
  arc(t, e, i, s, n, o = !1) {
    if (s === n)
      return this;
    if (!o && n <= s ? n += Ms : o && s <= n && (s += Ms), n - s === 0)
      return this;
    const a = t + Math.cos(s) * i, h = e + Math.sin(s) * i, l = this._geometry.closePointEps;
    let c = this.currentPath ? this.currentPath.points : null;
    if (c) {
      const u = Math.abs(c[c.length - 2] - a), d = Math.abs(c[c.length - 1] - h);
      u < l && d < l || c.push(a, h);
    } else
      this.moveTo(a, h), c = this.currentPath.points;
    return qh.arc(a, h, t, e, i, s, n, o, c), this;
  }
  /**
   * Specifies a simple one-color fill that subsequent calls to other Graphics methods
   * (such as lineTo() or drawCircle()) use when drawing.
   * @param {PIXI.ColorSource} color - the color of the fill
   * @param alpha - the alpha of the fill, will override the color's alpha
   * @returns - This Graphics object. Suitable for chaining method calls
   */
  beginFill(t = 0, e) {
    return this.beginTextureFill({ texture: j.WHITE, color: t, alpha: e });
  }
  /**
   * Normalize the color input from options for line style or fill
   * @param {PIXI.IFillStyleOptions} options - Fill style object.
   */
  normalizeColor(t) {
    const e = pt.shared.setValue(t.color ?? 0);
    t.color = e.toNumber(), t.alpha ?? (t.alpha = e.alpha);
  }
  /**
   * Begin the texture fill.
   * Note: The wrap mode of the texture is forced to REPEAT on render.
   * @param options - Fill style object.
   * @param {PIXI.Texture} [options.texture=PIXI.Texture.WHITE] - Texture to fill
   * @param {PIXI.ColorSource} [options.color=0xffffff] - Background to fill behind texture
   * @param {number} [options.alpha] - Alpha of fill, overrides the color's alpha
   * @param {PIXI.Matrix} [options.matrix=null] - Transform matrix
   * @returns {PIXI.Graphics} This Graphics object. Good for chaining method calls
   */
  beginTextureFill(t) {
    const e = {
      texture: j.WHITE,
      color: 16777215,
      matrix: null
    };
    t = Object.assign(e, t), this.normalizeColor(t), this.currentPath && this.startPoly();
    const i = t.alpha > 0;
    return i ? (t.matrix && (t.matrix = t.matrix.clone(), t.matrix.invert()), Object.assign(this._fillStyle, { visible: i }, t)) : this._fillStyle.reset(), this;
  }
  /**
   * Applies a fill to the lines and shapes that were added since the last call to the beginFill() method.
   * @returns - This Graphics object. Good for chaining method calls
   */
  endFill() {
    return this.finishPoly(), this._fillStyle.reset(), this;
  }
  /**
   * Draws a rectangle shape.
   * @param x - The X coord of the top-left of the rectangle
   * @param y - The Y coord of the top-left of the rectangle
   * @param width - The width of the rectangle
   * @param height - The height of the rectangle
   * @returns - This Graphics object. Good for chaining method calls
   */
  drawRect(t, e, i, s) {
    return this.drawShape(new tt(t, e, i, s));
  }
  /**
   * Draw a rectangle shape with rounded/beveled corners.
   * @param x - The X coord of the top-left of the rectangle
   * @param y - The Y coord of the top-left of the rectangle
   * @param width - The width of the rectangle
   * @param height - The height of the rectangle
   * @param radius - Radius of the rectangle corners
   * @returns - This Graphics object. Good for chaining method calls
   */
  drawRoundedRect(t, e, i, s, n) {
    return this.drawShape(new Ks(t, e, i, s, n));
  }
  /**
   * Draws a circle.
   * @param x - The X coordinate of the center of the circle
   * @param y - The Y coordinate of the center of the circle
   * @param radius - The radius of the circle
   * @returns - This Graphics object. Good for chaining method calls
   */
  drawCircle(t, e, i) {
    return this.drawShape(new Ys(t, e, i));
  }
  /**
   * Draws an ellipse.
   * @param x - The X coordinate of the center of the ellipse
   * @param y - The Y coordinate of the center of the ellipse
   * @param width - The half width of the ellipse
   * @param height - The half height of the ellipse
   * @returns - This Graphics object. Good for chaining method calls
   */
  drawEllipse(t, e, i, s) {
    return this.drawShape(new qs(t, e, i, s));
  }
  /**
   * Draws a polygon using the given path.
   * @param {number[]|PIXI.IPointData[]|PIXI.Polygon} path - The path data used to construct the polygon.
   * @returns - This Graphics object. Good for chaining method calls
   */
  drawPolygon(...t) {
    let e, i = !0;
    const s = t[0];
    s.points ? (i = s.closeStroke, e = s.points) : Array.isArray(t[0]) ? e = t[0] : e = t;
    const n = new _r(e);
    return n.closeStroke = i, this.drawShape(n), this;
  }
  /**
   * Draw any shape.
   * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - Shape to draw
   * @returns - This Graphics object. Good for chaining method calls
   */
  drawShape(t) {
    return this._holeMode ? this._geometry.drawHole(t, this._matrix) : this._geometry.drawShape(
      t,
      this._fillStyle.clone(),
      this._lineStyle.clone(),
      this._matrix
    ), this;
  }
  /**
   * Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
   * @returns - This Graphics object. Good for chaining method calls
   */
  clear() {
    return this._geometry.clear(), this._lineStyle.reset(), this._fillStyle.reset(), this._boundsID++, this._matrix = null, this._holeMode = !1, this.currentPath = null, this;
  }
  /**
   * True if graphics consists of one rectangle, and thus, can be drawn like a Sprite and
   * masked with gl.scissor.
   * @returns - True if only 1 rect.
   */
  isFastRect() {
    const t = this._geometry.graphicsData;
    return t.length === 1 && t[0].shape.type === Ot.RECT && !t[0].matrix && !t[0].holes.length && !(t[0].lineStyle.visible && t[0].lineStyle.width);
  }
  /**
   * Renders the object using the WebGL renderer
   * @param renderer - The renderer
   */
  _render(t) {
    this.finishPoly();
    const e = this._geometry;
    e.updateBatches(), e.batchable ? (this.batchDirty !== e.batchDirty && this._populateBatches(), this._renderBatched(t)) : (t.batch.flush(), this._renderDirect(t));
  }
  /** Populating batches for rendering. */
  _populateBatches() {
    const t = this._geometry, e = this.blendMode, i = t.batches.length;
    this.batchTint = -1, this._transformID = -1, this.batchDirty = t.batchDirty, this.batches.length = i, this.vertexData = new Float32Array(t.points);
    for (let s = 0; s < i; s++) {
      const n = t.batches[s], o = n.style.color, a = new Float32Array(
        this.vertexData.buffer,
        n.attribStart * 4 * 2,
        n.attribSize * 2
      ), h = new Float32Array(
        t.uvsFloat32.buffer,
        n.attribStart * 4 * 2,
        n.attribSize * 2
      ), l = new Uint16Array(
        t.indicesUint16.buffer,
        n.start * 2,
        n.size
      ), c = {
        vertexData: a,
        blendMode: e,
        indices: l,
        uvs: h,
        _batchRGB: pt.shared.setValue(o).toRgbArray(),
        _tintRGB: o,
        _texture: n.style.texture,
        alpha: n.style.alpha,
        worldAlpha: 1
      };
      this.batches[s] = c;
    }
  }
  /**
   * Renders the batches using the BathedRenderer plugin
   * @param renderer - The renderer
   */
  _renderBatched(t) {
    if (this.batches.length) {
      t.batch.setObjectRenderer(t.plugins[this.pluginName]), this.calculateVertices(), this.calculateTints();
      for (let e = 0, i = this.batches.length; e < i; e++) {
        const s = this.batches[e];
        s.worldAlpha = this.worldAlpha * s.alpha, t.plugins[this.pluginName].render(s);
      }
    }
  }
  /**
   * Renders the graphics direct
   * @param renderer - The renderer
   */
  _renderDirect(t) {
    const e = this._resolveDirectShader(t), i = this._geometry, s = this.worldAlpha, n = e.uniforms, o = i.drawCalls;
    n.translationMatrix = this.transform.worldTransform, pt.shared.setValue(this._tintColor).premultiply(s).toArray(n.tint), t.shader.bind(e), t.geometry.bind(i, e), t.state.set(this.state);
    for (let a = 0, h = o.length; a < h; a++)
      this._renderDrawCallDirect(t, i.drawCalls[a]);
  }
  /**
   * Renders specific DrawCall
   * @param renderer
   * @param drawCall
   */
  _renderDrawCallDirect(t, e) {
    const { texArray: i, type: s, size: n, start: o } = e, a = i.count;
    for (let h = 0; h < a; h++)
      t.texture.bind(i.elements[h], h);
    t.geometry.draw(s, n, o);
  }
  /**
   * Resolves shader for direct rendering
   * @param renderer - The renderer
   */
  _resolveDirectShader(t) {
    let e = this.shader;
    const i = this.pluginName;
    if (!e) {
      if (!Un[i]) {
        const { maxTextures: s } = t.plugins[i], n = new Int32Array(s);
        for (let h = 0; h < s; h++)
          n[h] = h;
        const o = {
          tint: new Float32Array([1, 1, 1, 1]),
          translationMatrix: new yt(),
          default: ue.from({ uSamplers: n }, !0)
        }, a = t.plugins[i]._shader.program;
        Un[i] = new Ee(a, o);
      }
      e = Un[i];
    }
    return e;
  }
  /**
   * Retrieves the bounds of the graphic shape as a rectangle object.
   * @see PIXI.GraphicsGeometry#bounds
   */
  _calculateBounds() {
    this.finishPoly();
    const t = this._geometry;
    if (!t.graphicsData.length)
      return;
    const { minX: e, minY: i, maxX: s, maxY: n } = t.bounds;
    this._bounds.addFrame(this.transform, e, i, s, n);
  }
  /**
   * Tests if a point is inside this graphics object
   * @param point - the point to test
   * @returns - the result of the test
   */
  containsPoint(t) {
    return this.worldTransform.applyInverse(t, vs._TEMP_POINT), this._geometry.containsPoint(vs._TEMP_POINT);
  }
  /** Recalculate the tint by applying tint to batches using Graphics tint. */
  calculateTints() {
    if (this.batchTint !== this.tint) {
      this.batchTint = this._tintColor.toNumber();
      for (let t = 0; t < this.batches.length; t++) {
        const e = this.batches[t];
        e._tintRGB = pt.shared.setValue(this._tintColor).multiply(e._batchRGB).toLittleEndianNumber();
      }
    }
  }
  /** If there's a transform update or a change to the shape of the geometry, recalculate the vertices. */
  calculateVertices() {
    const t = this.transform._worldID;
    if (this._transformID === t)
      return;
    this._transformID = t;
    const e = this.transform.worldTransform, i = e.a, s = e.b, n = e.c, o = e.d, a = e.tx, h = e.ty, l = this._geometry.points, c = this.vertexData;
    let u = 0;
    for (let d = 0; d < l.length; d += 2) {
      const f = l[d], p = l[d + 1];
      c[u++] = i * f + n * p + a, c[u++] = o * p + s * f + h;
    }
  }
  /**
   * Closes the current path.
   * @returns - Returns itself.
   */
  closePath() {
    const t = this.currentPath;
    return t && (t.closeStroke = !0, this.finishPoly()), this;
  }
  /**
   * Apply a matrix to the positional data.
   * @param matrix - Matrix to use for transform current shape.
   * @returns - Returns itself.
   */
  setMatrix(t) {
    return this._matrix = t, this;
  }
  /**
   * Begin adding holes to the last draw shape
   * IMPORTANT: holes must be fully inside a shape to work
   * Also weirdness ensues if holes overlap!
   * Ellipses, Circles, Rectangles and Rounded Rectangles cannot be holes or host for holes in CanvasRenderer,
   * please use `moveTo` `lineTo`, `quadraticCurveTo` if you rely on pixi-legacy bundle.
   * @returns - Returns itself.
   */
  beginHole() {
    return this.finishPoly(), this._holeMode = !0, this;
  }
  /**
   * End adding holes to the last draw shape.
   * @returns - Returns itself.
   */
  endHole() {
    return this.finishPoly(), this._holeMode = !1, this;
  }
  /**
   * Destroys the Graphics object.
   * @param options - Options parameter. A boolean will act as if all
   *  options have been set to that value
   * @param {boolean} [options.children=false] - if set to true, all the children will have
   *  their destroy method called as well. 'options' will be passed on to those calls.
   * @param {boolean} [options.texture=false] - Only used for child Sprites if options.children is set to true
   *  Should it destroy the texture of the child sprite
   * @param {boolean} [options.baseTexture=false] - Only used for child Sprites if options.children is set to true
   *  Should it destroy the base texture of the child sprite
   */
  destroy(t) {
    this._geometry.refCount--, this._geometry.refCount === 0 && this._geometry.dispose(), this._matrix = null, this.currentPath = null, this._lineStyle.destroy(), this._lineStyle = null, this._fillStyle.destroy(), this._fillStyle = null, this._geometry = null, this.shader = null, this.vertexData = null, this.batches.length = 0, this.batches = null, super.destroy(t);
  }
};
Ho.curves = ei, /**
* Temporary point to use for containsPoint.
* @private
*/
Ho._TEMP_POINT = new lt();
let Mi = Ho;
class l_ {
  /**
   * @param uvBuffer - Buffer with normalized uv's
   * @param uvMatrix - Material UV matrix
   */
  constructor(t, e) {
    this.uvBuffer = t, this.uvMatrix = e, this.data = null, this._bufferUpdateId = -1, this._textureUpdateId = -1, this._updateID = 0;
  }
  /**
   * Updates
   * @param forceUpdate - force the update
   */
  update(t) {
    if (!t && this._bufferUpdateId === this.uvBuffer._updateID && this._textureUpdateId === this.uvMatrix._updateID)
      return;
    this._bufferUpdateId = this.uvBuffer._updateID, this._textureUpdateId = this.uvMatrix._updateID;
    const e = this.uvBuffer.data;
    (!this.data || this.data.length !== e.length) && (this.data = new Float32Array(e.length)), this.uvMatrix.multiplyUvs(e, this.data), this._updateID++;
  }
}
const Gn = new lt(), Jh = new _r(), du = class fu extends de {
  /**
   * @param geometry - The geometry the mesh will use.
   * @param {PIXI.MeshMaterial} shader - The shader the mesh will use.
   * @param state - The state that the WebGL context is required to be in to render the mesh
   *        if no state is provided, uses {@link PIXI.State.for2d} to create a 2D state for PixiJS.
   * @param drawMode - The drawMode, can be any of the {@link PIXI.DRAW_MODES} constants.
   */
  constructor(t, e, i, s = be.TRIANGLES) {
    super(), this.geometry = t, this.shader = e, this.state = i || Ae.for2d(), this.drawMode = s, this.start = 0, this.size = 0, this.uvs = null, this.indices = null, this.vertexData = new Float32Array(1), this.vertexDirty = -1, this._transformID = -1, this._roundPixels = H.ROUND_PIXELS, this.batchUvs = null;
  }
  /**
   * Includes vertex positions, face indices, normals, colors, UVs, and
   * custom attributes within buffers, reducing the cost of passing all
   * this data to the GPU. Can be shared between multiple Mesh objects.
   */
  get geometry() {
    return this._geometry;
  }
  set geometry(t) {
    this._geometry !== t && (this._geometry && (this._geometry.refCount--, this._geometry.refCount === 0 && this._geometry.dispose()), this._geometry = t, this._geometry && this._geometry.refCount++, this.vertexDirty = -1);
  }
  /**
   * To change mesh uv's, change its uvBuffer data and increment its _updateID.
   * @readonly
   */
  get uvBuffer() {
    return this.geometry.buffers[1];
  }
  /**
   * To change mesh vertices, change its uvBuffer data and increment its _updateID.
   * Incrementing _updateID is optional because most of Mesh objects do it anyway.
   * @readonly
   */
  get verticesBuffer() {
    return this.geometry.buffers[0];
  }
  /** Alias for {@link PIXI.Mesh#shader}. */
  set material(t) {
    this.shader = t;
  }
  get material() {
    return this.shader;
  }
  /**
   * The blend mode to be applied to the Mesh. Apply a value of
   * `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
   * @default PIXI.BLEND_MODES.NORMAL;
   */
  set blendMode(t) {
    this.state.blendMode = t;
  }
  get blendMode() {
    return this.state.blendMode;
  }
  /**
   * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
   * Advantages can include sharper image quality (like text) and faster rendering on canvas.
   * The main disadvantage is movement of objects may appear less smooth.
   * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}
   * @default false
   */
  set roundPixels(t) {
    this._roundPixels !== t && (this._transformID = -1), this._roundPixels = t;
  }
  get roundPixels() {
    return this._roundPixels;
  }
  /**
   * The multiply tint applied to the Mesh. This is a hex value. A value of
   * `0xFFFFFF` will remove any tint effect.
   *
   * Null for non-MeshMaterial shaders
   * @default 0xFFFFFF
   */
  get tint() {
    return "tint" in this.shader ? this.shader.tint : null;
  }
  set tint(t) {
    this.shader.tint = t;
  }
  /**
   * The tint color as a RGB integer
   * @ignore
   */
  get tintValue() {
    return this.shader.tintValue;
  }
  /** The texture that the Mesh uses. Null for non-MeshMaterial shaders */
  get texture() {
    return "texture" in this.shader ? this.shader.texture : null;
  }
  set texture(t) {
    this.shader.texture = t;
  }
  /**
   * Standard renderer draw.
   * @param renderer - Instance to renderer.
   */
  _render(t) {
    const e = this.geometry.buffers[0].data;
    this.shader.batchable && this.drawMode === be.TRIANGLES && e.length < fu.BATCHABLE_SIZE * 2 ? this._renderToBatch(t) : this._renderDefault(t);
  }
  /**
   * Standard non-batching way of rendering.
   * @param renderer - Instance to renderer.
   */
  _renderDefault(t) {
    const e = this.shader;
    e.alpha = this.worldAlpha, e.update && e.update(), t.batch.flush(), e.uniforms.translationMatrix = this.transform.worldTransform.toArray(!0), t.shader.bind(e), t.state.set(this.state), t.geometry.bind(this.geometry, e), t.geometry.draw(this.drawMode, this.size, this.start, this.geometry.instanceCount);
  }
  /**
   * Rendering by using the Batch system.
   * @param renderer - Instance to renderer.
   */
  _renderToBatch(t) {
    const e = this.geometry, i = this.shader;
    i.uvMatrix && (i.uvMatrix.update(), this.calculateUvs()), this.calculateVertices(), this.indices = e.indexBuffer.data, this._tintRGB = i._tintRGB, this._texture = i.texture;
    const s = this.material.pluginName;
    t.batch.setObjectRenderer(t.plugins[s]), t.plugins[s].render(this);
  }
  /** Updates vertexData field based on transform and vertices. */
  calculateVertices() {
    const t = this.geometry.buffers[0], e = t.data, i = t._updateID;
    if (i === this.vertexDirty && this._transformID === this.transform._worldID)
      return;
    this._transformID = this.transform._worldID, this.vertexData.length !== e.length && (this.vertexData = new Float32Array(e.length));
    const s = this.transform.worldTransform, n = s.a, o = s.b, a = s.c, h = s.d, l = s.tx, c = s.ty, u = this.vertexData;
    for (let d = 0; d < u.length / 2; d++) {
      const f = e[d * 2], p = e[d * 2 + 1];
      u[d * 2] = n * f + a * p + l, u[d * 2 + 1] = o * f + h * p + c;
    }
    if (this._roundPixels) {
      const d = H.RESOLUTION;
      for (let f = 0; f < u.length; ++f)
        u[f] = Math.round(u[f] * d) / d;
    }
    this.vertexDirty = i;
  }
  /** Updates uv field based on from geometry uv's or batchUvs. */
  calculateUvs() {
    const t = this.geometry.buffers[1], e = this.shader;
    e.uvMatrix.isSimple ? this.uvs = t.data : (this.batchUvs || (this.batchUvs = new l_(t, e.uvMatrix)), this.batchUvs.update(), this.uvs = this.batchUvs.data);
  }
  /**
   * Updates the bounds of the mesh as a rectangle. The bounds calculation takes the worldTransform into account.
   * there must be a aVertexPosition attribute present in the geometry for bounds to be calculated correctly.
   */
  _calculateBounds() {
    this.calculateVertices(), this._bounds.addVertexData(this.vertexData, 0, this.vertexData.length);
  }
  /**
   * Tests if a point is inside this mesh. Works only for PIXI.DRAW_MODES.TRIANGLES.
   * @param point - The point to test.
   * @returns - The result of the test.
   */
  containsPoint(t) {
    if (!this.getBounds().contains(t.x, t.y))
      return !1;
    this.worldTransform.applyInverse(t, Gn);
    const e = this.geometry.getBuffer("aVertexPosition").data, i = Jh.points, s = this.geometry.getIndex().data, n = s.length, o = this.drawMode === 4 ? 3 : 1;
    for (let a = 0; a + 2 < n; a += o) {
      const h = s[a] * 2, l = s[a + 1] * 2, c = s[a + 2] * 2;
      if (i[0] = e[h], i[1] = e[h + 1], i[2] = e[l], i[3] = e[l + 1], i[4] = e[c], i[5] = e[c + 1], Jh.contains(Gn.x, Gn.y))
        return !0;
    }
    return !1;
  }
  destroy(t) {
    super.destroy(t), this._cachedTexture && (this._cachedTexture.destroy(), this._cachedTexture = null), this.geometry = null, this.shader = null, this.state = null, this.uvs = null, this.indices = null, this.vertexData = null;
  }
};
du.BATCHABLE_SIZE = 100;
let tl = du;
class c_ extends Ke {
  /**
   * @param {Float32Array|number[]} [vertices] - Positional data on geometry.
   * @param {Float32Array|number[]} [uvs] - Texture UVs.
   * @param {Uint16Array|number[]} [index] - IndexBuffer
   */
  constructor(t, e, i) {
    super();
    const s = new At(t), n = new At(e, !0), o = new At(i, !0, !0);
    this.addAttribute("aVertexPosition", s, 2, !1, $.FLOAT).addAttribute("aTextureCoord", n, 2, !1, $.FLOAT).addIndex(o), this._updateId = -1;
  }
  /**
   * If the vertex position is updated.
   * @readonly
   * @private
   */
  get vertexDirtyId() {
    return this.buffers[0]._updateID;
  }
}
var u_ = `varying vec2 vTextureCoord;
uniform vec4 uColor;

uniform sampler2D uSampler;

void main(void)
{
    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;
}
`, d_ = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;
uniform mat3 uTextureMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;
}
`;
class el extends Ee {
  /**
   * @param uSampler - Texture that material uses to render.
   * @param options - Additional options
   * @param {number} [options.alpha=1] - Default alpha.
   * @param {PIXI.ColorSource} [options.tint=0xFFFFFF] - Default tint.
   * @param {string} [options.pluginName='batch'] - Renderer plugin for batching.
   * @param {PIXI.Program} [options.program=0xFFFFFF] - Custom program.
   * @param {object} [options.uniforms] - Custom uniforms.
   */
  constructor(t, e) {
    const i = {
      uSampler: t,
      alpha: 1,
      uTextureMatrix: yt.IDENTITY,
      uColor: new Float32Array([1, 1, 1, 1])
    };
    e = Object.assign({
      tint: 16777215,
      alpha: 1,
      pluginName: "batch"
    }, e), e.uniforms && Object.assign(i, e.uniforms), super(e.program || De.from(d_, u_), i), this._colorDirty = !1, this.uvMatrix = new Pc(t), this.batchable = e.program === void 0, this.pluginName = e.pluginName, this._tintColor = new pt(e.tint), this._tintRGB = this._tintColor.toLittleEndianNumber(), this._colorDirty = !0, this.alpha = e.alpha;
  }
  /** Reference to the texture being rendered. */
  get texture() {
    return this.uniforms.uSampler;
  }
  set texture(t) {
    this.uniforms.uSampler !== t && (!this.uniforms.uSampler.baseTexture.alphaMode != !t.baseTexture.alphaMode && (this._colorDirty = !0), this.uniforms.uSampler = t, this.uvMatrix.texture = t);
  }
  /**
   * This gets automatically set by the object using this.
   * @default 1
   */
  set alpha(t) {
    t !== this._alpha && (this._alpha = t, this._colorDirty = !0);
  }
  get alpha() {
    return this._alpha;
  }
  /**
   * Multiply tint for the material.
   * @default 0xFFFFFF
   */
  set tint(t) {
    t !== this.tint && (this._tintColor.setValue(t), this._tintRGB = this._tintColor.toLittleEndianNumber(), this._colorDirty = !0);
  }
  get tint() {
    return this._tintColor.value;
  }
  /**
   * Get the internal number from tint color
   * @ignore
   */
  get tintValue() {
    return this._tintColor.toNumber();
  }
  /** Gets called automatically by the Mesh. Intended to be overridden for custom {@link PIXI.MeshMaterial} objects. */
  update() {
    if (this._colorDirty) {
      this._colorDirty = !1;
      const t = this.texture.baseTexture.alphaMode;
      pt.shared.setValue(this._tintColor).premultiply(this._alpha, t).toArray(this.uniforms.uColor);
    }
    this.uvMatrix.update() && (this.uniforms.uTextureMatrix = this.uvMatrix.mapCoord);
  }
}
class rl {
  /**
   * @param {object} properties - The properties to upload.
   * @param {boolean[]} dynamicPropertyFlags - Flags for which properties are dynamic.
   * @param {number} size - The size of the batch.
   */
  constructor(t, e, i) {
    this.geometry = new Ke(), this.indexBuffer = null, this.size = i, this.dynamicProperties = [], this.staticProperties = [];
    for (let s = 0; s < t.length; ++s) {
      let n = t[s];
      n = {
        attributeName: n.attributeName,
        size: n.size,
        uploadFunction: n.uploadFunction,
        type: n.type || $.FLOAT,
        offset: n.offset
      }, e[s] ? this.dynamicProperties.push(n) : this.staticProperties.push(n);
    }
    this.staticStride = 0, this.staticBuffer = null, this.staticData = null, this.staticDataUint32 = null, this.dynamicStride = 0, this.dynamicBuffer = null, this.dynamicData = null, this.dynamicDataUint32 = null, this._updateID = 0, this.initBuffers();
  }
  /** Sets up the renderer context and necessary buffers. */
  initBuffers() {
    const t = this.geometry;
    let e = 0;
    this.indexBuffer = new At(Fm(this.size), !0, !0), t.addIndex(this.indexBuffer), this.dynamicStride = 0;
    for (let o = 0; o < this.dynamicProperties.length; ++o) {
      const a = this.dynamicProperties[o];
      a.offset = e, e += a.size, this.dynamicStride += a.size;
    }
    const i = new ArrayBuffer(this.size * this.dynamicStride * 4 * 4);
    this.dynamicData = new Float32Array(i), this.dynamicDataUint32 = new Uint32Array(i), this.dynamicBuffer = new At(this.dynamicData, !1, !1);
    let s = 0;
    this.staticStride = 0;
    for (let o = 0; o < this.staticProperties.length; ++o) {
      const a = this.staticProperties[o];
      a.offset = s, s += a.size, this.staticStride += a.size;
    }
    const n = new ArrayBuffer(this.size * this.staticStride * 4 * 4);
    this.staticData = new Float32Array(n), this.staticDataUint32 = new Uint32Array(n), this.staticBuffer = new At(this.staticData, !0, !1);
    for (let o = 0; o < this.dynamicProperties.length; ++o) {
      const a = this.dynamicProperties[o];
      t.addAttribute(
        a.attributeName,
        this.dynamicBuffer,
        0,
        a.type === $.UNSIGNED_BYTE,
        a.type,
        this.dynamicStride * 4,
        a.offset * 4
      );
    }
    for (let o = 0; o < this.staticProperties.length; ++o) {
      const a = this.staticProperties[o];
      t.addAttribute(
        a.attributeName,
        this.staticBuffer,
        0,
        a.type === $.UNSIGNED_BYTE,
        a.type,
        this.staticStride * 4,
        a.offset * 4
      );
    }
  }
  /**
   * Uploads the dynamic properties.
   * @param children - The children to upload.
   * @param startIndex - The index to start at.
   * @param amount - The number to upload.
   */
  uploadDynamic(t, e, i) {
    for (let s = 0; s < this.dynamicProperties.length; s++) {
      const n = this.dynamicProperties[s];
      n.uploadFunction(
        t,
        e,
        i,
        n.type === $.UNSIGNED_BYTE ? this.dynamicDataUint32 : this.dynamicData,
        this.dynamicStride,
        n.offset
      );
    }
    this.dynamicBuffer._updateID++;
  }
  /**
   * Uploads the static properties.
   * @param children - The children to upload.
   * @param startIndex - The index to start at.
   * @param amount - The number to upload.
   */
  uploadStatic(t, e, i) {
    for (let s = 0; s < this.staticProperties.length; s++) {
      const n = this.staticProperties[s];
      n.uploadFunction(
        t,
        e,
        i,
        n.type === $.UNSIGNED_BYTE ? this.staticDataUint32 : this.staticData,
        this.staticStride,
        n.offset
      );
    }
    this.staticBuffer._updateID++;
  }
  /** Destroys the ParticleBuffer. */
  destroy() {
    this.indexBuffer = null, this.dynamicProperties = null, this.dynamicBuffer = null, this.dynamicData = null, this.dynamicDataUint32 = null, this.staticProperties = null, this.staticBuffer = null, this.staticData = null, this.staticDataUint32 = null, this.geometry.destroy();
  }
}
var f_ = `varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

void main(void){
    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;
    gl_FragColor = color;
}`, p_ = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aColor;

attribute vec2 aPositionCoord;
attribute float aRotation;

uniform mat3 translationMatrix;
uniform vec4 uColor;

varying vec2 vTextureCoord;
varying vec4 vColor;

void main(void){
    float x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);
    float y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);

    vec2 v = vec2(x, y);
    v = v + aPositionCoord;

    gl_Position = vec4((translationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = aTextureCoord;
    vColor = aColor * uColor;
}
`;
class pu extends Zs {
  /**
   * @param renderer - The renderer this sprite batch works for.
   */
  constructor(t) {
    super(t), this.shader = null, this.properties = null, this.tempMatrix = new yt(), this.properties = [
      // verticesData
      {
        attributeName: "aVertexPosition",
        size: 2,
        uploadFunction: this.uploadVertices,
        offset: 0
      },
      // positionData
      {
        attributeName: "aPositionCoord",
        size: 2,
        uploadFunction: this.uploadPosition,
        offset: 0
      },
      // rotationData
      {
        attributeName: "aRotation",
        size: 1,
        uploadFunction: this.uploadRotation,
        offset: 0
      },
      // uvsData
      {
        attributeName: "aTextureCoord",
        size: 2,
        uploadFunction: this.uploadUvs,
        offset: 0
      },
      // tintData
      {
        attributeName: "aColor",
        size: 1,
        type: $.UNSIGNED_BYTE,
        uploadFunction: this.uploadTint,
        offset: 0
      }
    ], this.shader = Ee.from(p_, f_, {}), this.state = Ae.for2d();
  }
  /**
   * Renders the particle container object.
   * @param container - The container to render using this ParticleRenderer.
   */
  render(t) {
    const e = t.children, i = t._maxSize, s = t._batchSize, n = this.renderer;
    let o = e.length;
    if (o === 0)
      return;
    o > i && !t.autoResize && (o = i);
    let a = t._buffers;
    a || (a = t._buffers = this.generateBuffers(t));
    const h = e[0]._texture.baseTexture, l = h.alphaMode > 0;
    this.state.blendMode = fc(t.blendMode, l), n.state.set(this.state);
    const c = n.gl, u = t.worldTransform.copyTo(this.tempMatrix);
    u.prepend(n.globalUniforms.uniforms.projectionMatrix), this.shader.uniforms.translationMatrix = u.toArray(!0), this.shader.uniforms.uColor = pt.shared.setValue(t.tintRgb).premultiply(t.worldAlpha, l).toArray(this.shader.uniforms.uColor), this.shader.uniforms.uSampler = h, this.renderer.shader.bind(this.shader);
    let d = !1;
    for (let f = 0, p = 0; f < o; f += s, p += 1) {
      let m = o - f;
      m > s && (m = s), p >= a.length && a.push(this._generateOneMoreBuffer(t));
      const g = a[p];
      g.uploadDynamic(e, f, m);
      const y = t._bufferUpdateIDs[p] || 0;
      d = d || g._updateID < y, d && (g._updateID = t._updateID, g.uploadStatic(e, f, m)), n.geometry.bind(g.geometry), c.drawElements(c.TRIANGLES, m * 6, c.UNSIGNED_SHORT, 0);
    }
  }
  /**
   * Creates one particle buffer for each child in the container we want to render and updates internal properties.
   * @param container - The container to render using this ParticleRenderer
   * @returns - The buffers
   */
  generateBuffers(t) {
    const e = [], i = t._maxSize, s = t._batchSize, n = t._properties;
    for (let o = 0; o < i; o += s)
      e.push(new rl(this.properties, n, s));
    return e;
  }
  /**
   * Creates one more particle buffer, because container has autoResize feature.
   * @param container - The container to render using this ParticleRenderer
   * @returns - The generated buffer
   */
  _generateOneMoreBuffer(t) {
    const e = t._batchSize, i = t._properties;
    return new rl(this.properties, i, e);
  }
  /**
   * Uploads the vertices.
   * @param children - the array of sprites to render
   * @param startIndex - the index to start from in the children array
   * @param amount - the amount of children that will have their vertices uploaded
   * @param array - The vertices to upload.
   * @param stride - Stride to use for iteration.
   * @param offset - Offset to start at.
   */
  uploadVertices(t, e, i, s, n, o) {
    let a = 0, h = 0, l = 0, c = 0;
    for (let u = 0; u < i; ++u) {
      const d = t[e + u], f = d._texture, p = d.scale.x, m = d.scale.y, g = f.trim, y = f.orig;
      g ? (h = g.x - d.anchor.x * y.width, a = h + g.width, c = g.y - d.anchor.y * y.height, l = c + g.height) : (a = y.width * (1 - d.anchor.x), h = y.width * -d.anchor.x, l = y.height * (1 - d.anchor.y), c = y.height * -d.anchor.y), s[o] = h * p, s[o + 1] = c * m, s[o + n] = a * p, s[o + n + 1] = c * m, s[o + n * 2] = a * p, s[o + n * 2 + 1] = l * m, s[o + n * 3] = h * p, s[o + n * 3 + 1] = l * m, o += n * 4;
    }
  }
  /**
   * Uploads the position.
   * @param children - the array of sprites to render
   * @param startIndex - the index to start from in the children array
   * @param amount - the amount of children that will have their positions uploaded
   * @param array - The vertices to upload.
   * @param stride - Stride to use for iteration.
   * @param offset - Offset to start at.
   */
  uploadPosition(t, e, i, s, n, o) {
    for (let a = 0; a < i; a++) {
      const h = t[e + a].position;
      s[o] = h.x, s[o + 1] = h.y, s[o + n] = h.x, s[o + n + 1] = h.y, s[o + n * 2] = h.x, s[o + n * 2 + 1] = h.y, s[o + n * 3] = h.x, s[o + n * 3 + 1] = h.y, o += n * 4;
    }
  }
  /**
   * Uploads the rotation.
   * @param children - the array of sprites to render
   * @param startIndex - the index to start from in the children array
   * @param amount - the amount of children that will have their rotation uploaded
   * @param array - The vertices to upload.
   * @param stride - Stride to use for iteration.
   * @param offset - Offset to start at.
   */
  uploadRotation(t, e, i, s, n, o) {
    for (let a = 0; a < i; a++) {
      const h = t[e + a].rotation;
      s[o] = h, s[o + n] = h, s[o + n * 2] = h, s[o + n * 3] = h, o += n * 4;
    }
  }
  /**
   * Uploads the UVs.
   * @param children - the array of sprites to render
   * @param startIndex - the index to start from in the children array
   * @param amount - the amount of children that will have their rotation uploaded
   * @param array - The vertices to upload.
   * @param stride - Stride to use for iteration.
   * @param offset - Offset to start at.
   */
  uploadUvs(t, e, i, s, n, o) {
    for (let a = 0; a < i; ++a) {
      const h = t[e + a]._texture._uvs;
      h ? (s[o] = h.x0, s[o + 1] = h.y0, s[o + n] = h.x1, s[o + n + 1] = h.y1, s[o + n * 2] = h.x2, s[o + n * 2 + 1] = h.y2, s[o + n * 3] = h.x3, s[o + n * 3 + 1] = h.y3, o += n * 4) : (s[o] = 0, s[o + 1] = 0, s[o + n] = 0, s[o + n + 1] = 0, s[o + n * 2] = 0, s[o + n * 2 + 1] = 0, s[o + n * 3] = 0, s[o + n * 3 + 1] = 0, o += n * 4);
    }
  }
  /**
   * Uploads the tint.
   * @param children - the array of sprites to render
   * @param startIndex - the index to start from in the children array
   * @param amount - the amount of children that will have their rotation uploaded
   * @param array - The vertices to upload.
   * @param stride - Stride to use for iteration.
   * @param offset - Offset to start at.
   */
  uploadTint(t, e, i, s, n, o) {
    for (let a = 0; a < i; ++a) {
      const h = t[e + a], l = pt.shared.setValue(h._tintRGB).toPremultiplied(h.alpha, h.texture.baseTexture.alphaMode > 0);
      s[o] = l, s[o + n] = l, s[o + n * 2] = l, s[o + n * 3] = l, o += n * 4;
    }
  }
  /** Destroys the ParticleRenderer. */
  destroy() {
    super.destroy(), this.shader && (this.shader.destroy(), this.shader = null), this.tempMatrix = null;
  }
}
pu.extension = {
  name: "particle",
  type: k.RendererPlugin
};
z.add(pu);
var tn = /* @__PURE__ */ ((r) => (r[r.LINEAR_VERTICAL = 0] = "LINEAR_VERTICAL", r[r.LINEAR_HORIZONTAL = 1] = "LINEAR_HORIZONTAL", r))(tn || {});
const os = {
  // TextMetrics requires getImageData readback for measuring fonts.
  willReadFrequently: !0
}, ye = class W {
  /**
   * Checking that we can use modern canvas 2D API.
   *
   * Note: This is an unstable API, Chrome < 94 use `textLetterSpacing`, later versions use `letterSpacing`.
   * @see PIXI.TextMetrics.experimentalLetterSpacing
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/letterSpacing
   * @see https://developer.chrome.com/origintrials/#/view_trial/3585991203293757441
   */
  static get experimentalLetterSpacingSupported() {
    let t = W._experimentalLetterSpacingSupported;
    if (t !== void 0) {
      const e = H.ADAPTER.getCanvasRenderingContext2D().prototype;
      t = W._experimentalLetterSpacingSupported = "letterSpacing" in e || "textLetterSpacing" in e;
    }
    return t;
  }
  /**
   * @param text - the text that was measured
   * @param style - the style that was measured
   * @param width - the measured width of the text
   * @param height - the measured height of the text
   * @param lines - an array of the lines of text broken by new lines and wrapping if specified in style
   * @param lineWidths - an array of the line widths for each line matched to `lines`
   * @param lineHeight - the measured line height for this style
   * @param maxLineWidth - the maximum line width for all measured lines
   * @param {PIXI.IFontMetrics} fontProperties - the font properties object from TextMetrics.measureFont
   */
  constructor(t, e, i, s, n, o, a, h, l) {
    this.text = t, this.style = e, this.width = i, this.height = s, this.lines = n, this.lineWidths = o, this.lineHeight = a, this.maxLineWidth = h, this.fontProperties = l;
  }
  /**
   * Measures the supplied string of text and returns a Rectangle.
   * @param text - The text to measure.
   * @param style - The text style to use for measuring
   * @param wordWrap - Override for if word-wrap should be applied to the text.
   * @param canvas - optional specification of the canvas to use for measuring.
   * @returns Measured width and height of the text.
   */
  static measureText(t, e, i, s = W._canvas) {
    i = i ?? e.wordWrap;
    const n = e.toFontString(), o = W.measureFont(n);
    o.fontSize === 0 && (o.fontSize = e.fontSize, o.ascent = e.fontSize);
    const a = s.getContext("2d", os);
    a.font = n;
    const h = (i ? W.wordWrap(t, e, s) : t).split(/(?:\r\n|\r|\n)/), l = new Array(h.length);
    let c = 0;
    for (let p = 0; p < h.length; p++) {
      const m = W._measureText(h[p], e.letterSpacing, a);
      l[p] = m, c = Math.max(c, m);
    }
    let u = c + e.strokeThickness;
    e.dropShadow && (u += e.dropShadowDistance);
    const d = e.lineHeight || o.fontSize + e.strokeThickness;
    let f = Math.max(d, o.fontSize + e.strokeThickness * 2) + e.leading + (h.length - 1) * (d + e.leading);
    return e.dropShadow && (f += e.dropShadowDistance), new W(
      t,
      e,
      u,
      f,
      h,
      l,
      d + e.leading,
      c,
      o
    );
  }
  static _measureText(t, e, i) {
    let s = !1;
    W.experimentalLetterSpacingSupported && (W.experimentalLetterSpacing ? (i.letterSpacing = `${e}px`, i.textLetterSpacing = `${e}px`, s = !0) : (i.letterSpacing = "0px", i.textLetterSpacing = "0px"));
    let n = i.measureText(t).width;
    return n > 0 && (s ? n -= e : n += (W.graphemeSegmenter(t).length - 1) * e), n;
  }
  /**
   * Applies newlines to a string to have it optimally fit into the horizontal
   * bounds set by the Text object's wordWrapWidth property.
   * @param text - String to apply word wrapping to
   * @param style - the style to use when wrapping
   * @param canvas - optional specification of the canvas to use for measuring.
   * @returns New string with new lines applied where required
   */
  static wordWrap(t, e, i = W._canvas) {
    const s = i.getContext("2d", os);
    let n = 0, o = "", a = "";
    const h = /* @__PURE__ */ Object.create(null), { letterSpacing: l, whiteSpace: c } = e, u = W.collapseSpaces(c), d = W.collapseNewlines(c);
    let f = !u;
    const p = e.wordWrapWidth + l, m = W.tokenize(t);
    for (let g = 0; g < m.length; g++) {
      let y = m[g];
      if (W.isNewline(y)) {
        if (!d) {
          a += W.addLine(o), f = !u, o = "", n = 0;
          continue;
        }
        y = " ";
      }
      if (u) {
        const _ = W.isBreakingSpace(y), x = W.isBreakingSpace(o[o.length - 1]);
        if (_ && x)
          continue;
      }
      const v = W.getFromCache(y, l, h, s);
      if (v > p)
        if (o !== "" && (a += W.addLine(o), o = "", n = 0), W.canBreakWords(y, e.breakWords)) {
          const _ = W.wordWrapSplit(y);
          for (let x = 0; x < _.length; x++) {
            let T = _[x], C = T, w = 1;
            for (; _[x + w]; ) {
              const S = _[x + w];
              if (!W.canBreakChars(C, S, y, x, e.breakWords))
                T += S;
              else
                break;
              C = S, w++;
            }
            x += w - 1;
            const I = W.getFromCache(T, l, h, s);
            I + n > p && (a += W.addLine(o), f = !1, o = "", n = 0), o += T, n += I;
          }
        } else {
          o.length > 0 && (a += W.addLine(o), o = "", n = 0);
          const _ = g === m.length - 1;
          a += W.addLine(y, !_), f = !1, o = "", n = 0;
        }
      else
        v + n > p && (f = !1, a += W.addLine(o), o = "", n = 0), (o.length > 0 || !W.isBreakingSpace(y) || f) && (o += y, n += v);
    }
    return a += W.addLine(o, !1), a;
  }
  /**
   * Convienience function for logging each line added during the wordWrap method.
   * @param line    - The line of text to add
   * @param newLine - Add new line character to end
   * @returns A formatted line
   */
  static addLine(t, e = !0) {
    return t = W.trimRight(t), t = e ? `${t}
` : t, t;
  }
  /**
   * Gets & sets the widths of calculated characters in a cache object
   * @param key            - The key
   * @param letterSpacing  - The letter spacing
   * @param cache          - The cache
   * @param context        - The canvas context
   * @returns The from cache.
   */
  static getFromCache(t, e, i, s) {
    let n = i[t];
    return typeof n != "number" && (n = W._measureText(t, e, s) + e, i[t] = n), n;
  }
  /**
   * Determines whether we should collapse breaking spaces.
   * @param whiteSpace - The TextStyle property whiteSpace
   * @returns Should collapse
   */
  static collapseSpaces(t) {
    return t === "normal" || t === "pre-line";
  }
  /**
   * Determines whether we should collapse newLine chars.
   * @param whiteSpace - The white space
   * @returns should collapse
   */
  static collapseNewlines(t) {
    return t === "normal";
  }
  /**
   * Trims breaking whitespaces from string.
   * @param text - The text
   * @returns Trimmed string
   */
  static trimRight(t) {
    if (typeof t != "string")
      return "";
    for (let e = t.length - 1; e >= 0; e--) {
      const i = t[e];
      if (!W.isBreakingSpace(i))
        break;
      t = t.slice(0, -1);
    }
    return t;
  }
  /**
   * Determines if char is a newline.
   * @param char - The character
   * @returns True if newline, False otherwise.
   */
  static isNewline(t) {
    return typeof t != "string" ? !1 : W._newlines.includes(t.charCodeAt(0));
  }
  /**
   * Determines if char is a breaking whitespace.
   *
   * It allows one to determine whether char should be a breaking whitespace
   * For example certain characters in CJK langs or numbers.
   * It must return a boolean.
   * @param char - The character
   * @param [_nextChar] - The next character
   * @returns True if whitespace, False otherwise.
   */
  static isBreakingSpace(t, e) {
    return typeof t != "string" ? !1 : W._breakingSpaces.includes(t.charCodeAt(0));
  }
  /**
   * Splits a string into words, breaking-spaces and newLine characters
   * @param text - The text
   * @returns A tokenized array
   */
  static tokenize(t) {
    const e = [];
    let i = "";
    if (typeof t != "string")
      return e;
    for (let s = 0; s < t.length; s++) {
      const n = t[s], o = t[s + 1];
      if (W.isBreakingSpace(n, o) || W.isNewline(n)) {
        i !== "" && (e.push(i), i = ""), e.push(n);
        continue;
      }
      i += n;
    }
    return i !== "" && e.push(i), e;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It allows one to customise which words should break
   * Examples are if the token is CJK or numbers.
   * It must return a boolean.
   * @param _token - The token
   * @param breakWords - The style attr break words
   * @returns Whether to break word or not
   */
  static canBreakWords(t, e) {
    return e;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It allows one to determine whether a pair of characters
   * should be broken by newlines
   * For example certain characters in CJK langs or numbers.
   * It must return a boolean.
   * @param _char - The character
   * @param _nextChar - The next character
   * @param _token - The token/word the characters are from
   * @param _index - The index in the token of the char
   * @param _breakWords - The style attr break words
   * @returns whether to break word or not
   */
  static canBreakChars(t, e, i, s, n) {
    return !0;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It is called when a token (usually a word) has to be split into separate pieces
   * in order to determine the point to break a word.
   * It must return an array of characters.
   * @param token - The token to split
   * @returns The characters of the token
   * @see TextMetrics.graphemeSegmenter
   */
  static wordWrapSplit(t) {
    return W.graphemeSegmenter(t);
  }
  /**
   * Calculates the ascent, descent and fontSize of a given font-style
   * @param font - String representing the style of the font
   * @returns Font properties object
   */
  static measureFont(t) {
    if (W._fonts[t])
      return W._fonts[t];
    const e = {
      ascent: 0,
      descent: 0,
      fontSize: 0
    }, i = W._canvas, s = W._context;
    s.font = t;
    const n = W.METRICS_STRING + W.BASELINE_SYMBOL, o = Math.ceil(s.measureText(n).width);
    let a = Math.ceil(s.measureText(W.BASELINE_SYMBOL).width);
    const h = Math.ceil(W.HEIGHT_MULTIPLIER * a);
    if (a = a * W.BASELINE_MULTIPLIER | 0, o === 0 || h === 0)
      return W._fonts[t] = e, e;
    i.width = o, i.height = h, s.fillStyle = "#f00", s.fillRect(0, 0, o, h), s.font = t, s.textBaseline = "alphabetic", s.fillStyle = "#000", s.fillText(n, 0, a);
    const l = s.getImageData(0, 0, o, h).data, c = l.length, u = o * 4;
    let d = 0, f = 0, p = !1;
    for (d = 0; d < a; ++d) {
      for (let m = 0; m < u; m += 4)
        if (l[f + m] !== 255) {
          p = !0;
          break;
        }
      if (!p)
        f += u;
      else
        break;
    }
    for (e.ascent = a - d, f = c - u, p = !1, d = h; d > a; --d) {
      for (let m = 0; m < u; m += 4)
        if (l[f + m] !== 255) {
          p = !0;
          break;
        }
      if (!p)
        f -= u;
      else
        break;
    }
    return e.descent = d - a, e.fontSize = e.ascent + e.descent, W._fonts[t] = e, e;
  }
  /**
   * Clear font metrics in metrics cache.
   * @param {string} [font] - font name. If font name not set then clear cache for all fonts.
   */
  static clearMetrics(t = "") {
    t ? delete W._fonts[t] : W._fonts = {};
  }
  /**
   * Cached canvas element for measuring text
   * TODO: this should be private, but isn't because of backward compat, will fix later.
   * @ignore
   */
  static get _canvas() {
    var t;
    if (!W.__canvas) {
      let e;
      try {
        const i = new OffscreenCanvas(0, 0);
        if ((t = i.getContext("2d", os)) != null && t.measureText)
          return W.__canvas = i, i;
        e = H.ADAPTER.createCanvas();
      } catch {
        e = H.ADAPTER.createCanvas();
      }
      e.width = e.height = 10, W.__canvas = e;
    }
    return W.__canvas;
  }
  /**
   * TODO: this should be private, but isn't because of backward compat, will fix later.
   * @ignore
   */
  static get _context() {
    return W.__context || (W.__context = W._canvas.getContext("2d", os)), W.__context;
  }
};
ye.METRICS_STRING = "|ÉqÅ", /** Baseline symbol for calculate font metrics. */
ye.BASELINE_SYMBOL = "M", /** Baseline multiplier for calculate font metrics. */
ye.BASELINE_MULTIPLIER = 1.4, /** Height multiplier for setting height of canvas to calculate font metrics. */
ye.HEIGHT_MULTIPLIER = 2, /**
* A Unicode "character", or "grapheme cluster", can be composed of multiple Unicode code points,
* such as letters with diacritical marks (e.g. `'\u0065\u0301'`, letter e with acute)
* or emojis with modifiers (e.g. `'\uD83E\uDDD1\u200D\uD83D\uDCBB'`, technologist).
* The new `Intl.Segmenter` API in ES2022 can split the string into grapheme clusters correctly. If it is not available,
* PixiJS will fallback to use the iterator of String, which can only spilt the string into code points.
* If you want to get full functionality in environments that don't support `Intl.Segmenter` (such as Firefox),
* you can use other libraries such as [grapheme-splitter]{@link https://www.npmjs.com/package/grapheme-splitter}
* or [graphemer]{@link https://www.npmjs.com/package/graphemer} to create a polyfill. Since these libraries can be
* relatively large in size to handle various Unicode grapheme clusters properly, PixiJS won't use them directly.
*/
ye.graphemeSegmenter = (() => {
  if (typeof (Intl == null ? void 0 : Intl.Segmenter) == "function") {
    const r = new Intl.Segmenter();
    return (t) => [...r.segment(t)].map((e) => e.segment);
  }
  return (r) => [...r];
})(), /**
* New rendering behavior for letter-spacing which uses Chrome's new native API. This will
* lead to more accurate letter-spacing results because it does not try to manually draw
* each character. However, this Chrome API is experimental and may not serve all cases yet.
* @see PIXI.TextMetrics.experimentalLetterSpacingSupported
*/
ye.experimentalLetterSpacing = !1, /** Cache of {@see PIXI.TextMetrics.FontMetrics} objects. */
ye._fonts = {}, /** Cache of new line chars. */
ye._newlines = [
  10,
  // line feed
  13
  // carriage return
], /** Cache of breaking spaces. */
ye._breakingSpaces = [
  9,
  // character tabulation
  32,
  // space
  8192,
  // en quad
  8193,
  // em quad
  8194,
  // en space
  8195,
  // em space
  8196,
  // three-per-em space
  8197,
  // four-per-em space
  8198,
  // six-per-em space
  8200,
  // punctuation space
  8201,
  // thin space
  8202,
  // hair space
  8287,
  // medium mathematical space
  12288
  // ideographic space
];
let He = ye;
const m_ = [
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui"
], mu = class _i {
  /**
   * @param style - TextStyle properties to be set on the text. See {@link PIXI.TextStyle.defaultStyle}
   *       for the default values.
   */
  constructor(t) {
    this.styleID = 0, this.reset(), Vn(this, t, t);
  }
  /**
   * Creates a new TextStyle object with the same values as this one.
   * Note that the only the properties of the object are cloned.
   *
   * @return New cloned TextStyle object
   */
  clone() {
    const t = {};
    return Vn(t, this, _i.defaultStyle), new _i(t);
  }
  /** Resets all properties to the defaults specified in TextStyle.prototype._default */
  reset() {
    Vn(this, _i.defaultStyle, _i.defaultStyle);
  }
  /**
   * Alignment for multiline text, does not affect single line text.
   *
   * @member {'left'|'center'|'right'|'justify'}
   */
  get align() {
    return this._align;
  }
  set align(t) {
    this._align !== t && (this._align = t, this.styleID++);
  }
  /** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true. */
  get breakWords() {
    return this._breakWords;
  }
  set breakWords(t) {
    this._breakWords !== t && (this._breakWords = t, this.styleID++);
  }
  /** Set a drop shadow for the text. */
  get dropShadow() {
    return this._dropShadow;
  }
  set dropShadow(t) {
    this._dropShadow !== t && (this._dropShadow = t, this.styleID++);
  }
  /** Set alpha for the drop shadow. */
  get dropShadowAlpha() {
    return this._dropShadowAlpha;
  }
  set dropShadowAlpha(t) {
    this._dropShadowAlpha !== t && (this._dropShadowAlpha = t, this.styleID++);
  }
  /** Set a angle of the drop shadow. */
  get dropShadowAngle() {
    return this._dropShadowAngle;
  }
  set dropShadowAngle(t) {
    this._dropShadowAngle !== t && (this._dropShadowAngle = t, this.styleID++);
  }
  /** Set a shadow blur radius. */
  get dropShadowBlur() {
    return this._dropShadowBlur;
  }
  set dropShadowBlur(t) {
    this._dropShadowBlur !== t && (this._dropShadowBlur = t, this.styleID++);
  }
  /** A fill style to be used on the dropshadow e.g., 'red', '#00FF00'. */
  get dropShadowColor() {
    return this._dropShadowColor;
  }
  set dropShadowColor(t) {
    const e = Hn(t);
    this._dropShadowColor !== e && (this._dropShadowColor = e, this.styleID++);
  }
  /** Set a distance of the drop shadow. */
  get dropShadowDistance() {
    return this._dropShadowDistance;
  }
  set dropShadowDistance(t) {
    this._dropShadowDistance !== t && (this._dropShadowDistance = t, this.styleID++);
  }
  /**
   * A canvas fillstyle that will be used on the text e.g., 'red', '#00FF00'.
   *
   * Can be an array to create a gradient e.g., `['#000000','#FFFFFF']`
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
   *
   * @member {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
   */
  get fill() {
    return this._fill;
  }
  set fill(t) {
    const e = Hn(t);
    this._fill !== e && (this._fill = e, this.styleID++);
  }
  /**
   * If fill is an array of colours to create a gradient, this can change the type/direction of the gradient.
   *
   * @type {PIXI.TEXT_GRADIENT}
   */
  get fillGradientType() {
    return this._fillGradientType;
  }
  set fillGradientType(t) {
    this._fillGradientType !== t && (this._fillGradientType = t, this.styleID++);
  }
  /**
   * If fill is an array of colours to create a gradient, this array can set the stop points
   * (numbers between 0 and 1) for the color, overriding the default behaviour of evenly spacing them.
   */
  get fillGradientStops() {
    return this._fillGradientStops;
  }
  set fillGradientStops(t) {
    g_(this._fillGradientStops, t) || (this._fillGradientStops = t, this.styleID++);
  }
  /**
   * The font family, can be a single font name, or a list of names where the first
   * is the preferred font.
   */
  get fontFamily() {
    return this._fontFamily;
  }
  set fontFamily(t) {
    this.fontFamily !== t && (this._fontFamily = t, this.styleID++);
  }
  /**
   * The font size
   * (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em')
   */
  get fontSize() {
    return this._fontSize;
  }
  set fontSize(t) {
    this._fontSize !== t && (this._fontSize = t, this.styleID++);
  }
  /**
   * The font style.
   *
   * @member {'normal'|'italic'|'oblique'}
   */
  get fontStyle() {
    return this._fontStyle;
  }
  set fontStyle(t) {
    this._fontStyle !== t && (this._fontStyle = t, this.styleID++);
  }
  /**
   * The font variant.
   *
   * @member {'normal'|'small-caps'}
   */
  get fontVariant() {
    return this._fontVariant;
  }
  set fontVariant(t) {
    this._fontVariant !== t && (this._fontVariant = t, this.styleID++);
  }
  /**
   * The font weight.
   *
   * @member {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
   */
  get fontWeight() {
    return this._fontWeight;
  }
  set fontWeight(t) {
    this._fontWeight !== t && (this._fontWeight = t, this.styleID++);
  }
  /** The amount of spacing between letters, default is 0. */
  get letterSpacing() {
    return this._letterSpacing;
  }
  set letterSpacing(t) {
    this._letterSpacing !== t && (this._letterSpacing = t, this.styleID++);
  }
  /** The line height, a number that represents the vertical space that a letter uses. */
  get lineHeight() {
    return this._lineHeight;
  }
  set lineHeight(t) {
    this._lineHeight !== t && (this._lineHeight = t, this.styleID++);
  }
  /** The space between lines. */
  get leading() {
    return this._leading;
  }
  set leading(t) {
    this._leading !== t && (this._leading = t, this.styleID++);
  }
  /**
   * The lineJoin property sets the type of corner created, it can resolve spiked text issues.
   * Default is 'miter' (creates a sharp corner).
   *
   * @member {'miter'|'round'|'bevel'}
   */
  get lineJoin() {
    return this._lineJoin;
  }
  set lineJoin(t) {
    this._lineJoin !== t && (this._lineJoin = t, this.styleID++);
  }
  /**
   * The miter limit to use when using the 'miter' lineJoin mode.
   *
   * This can reduce or increase the spikiness of rendered text.
   */
  get miterLimit() {
    return this._miterLimit;
  }
  set miterLimit(t) {
    this._miterLimit !== t && (this._miterLimit = t, this.styleID++);
  }
  /**
   * Occasionally some fonts are cropped. Adding some padding will prevent this from happening
   * by adding padding to all sides of the text.
   */
  get padding() {
    return this._padding;
  }
  set padding(t) {
    this._padding !== t && (this._padding = t, this.styleID++);
  }
  /**
   * A canvas fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'
   */
  get stroke() {
    return this._stroke;
  }
  set stroke(t) {
    const e = Hn(t);
    this._stroke !== e && (this._stroke = e, this.styleID++);
  }
  /**
   * A number that represents the thickness of the stroke.
   *
   * @default 0
   */
  get strokeThickness() {
    return this._strokeThickness;
  }
  set strokeThickness(t) {
    this._strokeThickness !== t && (this._strokeThickness = t, this.styleID++);
  }
  /**
   * The baseline of the text that is rendered.
   *
   * @member {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
   */
  get textBaseline() {
    return this._textBaseline;
  }
  set textBaseline(t) {
    this._textBaseline !== t && (this._textBaseline = t, this.styleID++);
  }
  /** Trim transparent borders. */
  get trim() {
    return this._trim;
  }
  set trim(t) {
    this._trim !== t && (this._trim = t, this.styleID++);
  }
  /**
   * How newlines and spaces should be handled.
   * Default is 'pre' (preserve, preserve).
   *
   *  value       | New lines     |   Spaces
   *  ---         | ---           |   ---
   * 'normal'     | Collapse      |   Collapse
   * 'pre'        | Preserve      |   Preserve
   * 'pre-line'   | Preserve      |   Collapse
   *
   * @member {'normal'|'pre'|'pre-line'}
   */
  get whiteSpace() {
    return this._whiteSpace;
  }
  set whiteSpace(t) {
    this._whiteSpace !== t && (this._whiteSpace = t, this.styleID++);
  }
  /** Indicates if word wrap should be used. */
  get wordWrap() {
    return this._wordWrap;
  }
  set wordWrap(t) {
    this._wordWrap !== t && (this._wordWrap = t, this.styleID++);
  }
  /** The width at which text will wrap, it needs wordWrap to be set to true. */
  get wordWrapWidth() {
    return this._wordWrapWidth;
  }
  set wordWrapWidth(t) {
    this._wordWrapWidth !== t && (this._wordWrapWidth = t, this.styleID++);
  }
  /**
   * Generates a font style string to use for `TextMetrics.measureFont()`.
   *
   * @return Font style string, for passing to `TextMetrics.measureFont()`
   */
  toFontString() {
    const t = typeof this.fontSize == "number" ? `${this.fontSize}px` : this.fontSize;
    let e = this.fontFamily;
    Array.isArray(this.fontFamily) || (e = this.fontFamily.split(","));
    for (let i = e.length - 1; i >= 0; i--) {
      let s = e[i].trim();
      !/([\"\'])[^\'\"]+\1/.test(s) && !m_.includes(s) && (s = `"${s}"`), e[i] = s;
    }
    return `${this.fontStyle} ${this.fontVariant} ${this.fontWeight} ${t} ${e.join(",")}`;
  }
};
mu.defaultStyle = {
  /**
   * See {@link PIXI.TextStyle.align}
   * @type {'left'|'center'|'right'|'justify'}
   */
  align: "left",
  /** See {@link PIXI.TextStyle.breakWords} */
  breakWords: !1,
  /** See {@link PIXI.TextStyle.dropShadow} */
  dropShadow: !1,
  /** See {@link PIXI.TextStyle.dropShadowAlpha} */
  dropShadowAlpha: 1,
  /**
   * See {@link PIXI.TextStyle.dropShadowAngle}
   * @type {number}
   * @default Math.PI / 6
   */
  dropShadowAngle: Math.PI / 6,
  /** See {@link PIXI.TextStyle.dropShadowBlur} */
  dropShadowBlur: 0,
  /**
   * See {@link PIXI.TextStyle.dropShadowColor}
   * @type {string|number}
   */
  dropShadowColor: "black",
  /** See {@link PIXI.TextStyle.dropShadowDistance} */
  dropShadowDistance: 5,
  /**
   * See {@link PIXI.TextStyle.fill}
   * @type {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
   */
  fill: "black",
  /**
   * See {@link PIXI.TextStyle.fillGradientType}
   * @type {PIXI.TEXT_GRADIENT}
   * @default PIXI.TEXT_GRADIENT.LINEAR_VERTICAL
   */
  fillGradientType: tn.LINEAR_VERTICAL,
  /**
   * See {@link PIXI.TextStyle.fillGradientStops}
   * @type {number[]}
   * @default []
   */
  fillGradientStops: [],
  /**
   * See {@link PIXI.TextStyle.fontFamily}
   * @type {string|string[]}
   */
  fontFamily: "Arial",
  /**
   * See {@link PIXI.TextStyle.fontSize}
   * @type {number|string} 
   */
  fontSize: 26,
  /**
   * See {@link PIXI.TextStyle.fontStyle}
   * @type {'normal'|'italic'|'oblique'}
   */
  fontStyle: "normal",
  /**
   * See {@link PIXI.TextStyle.fontVariant}
   * @type {'normal'|'small-caps'}
   */
  fontVariant: "normal",
  /**
   * See {@link PIXI.TextStyle.fontWeight}
   * @type {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
   */
  fontWeight: "normal",
  /** See {@link PIXI.TextStyle.leading} */
  leading: 0,
  /** See {@link PIXI.TextStyle.letterSpacing} */
  letterSpacing: 0,
  /** See {@link PIXI.TextStyle.lineHeight} */
  lineHeight: 0,
  /**
   * See {@link PIXI.TextStyle.lineJoin}
   * @type {'miter'|'round'|'bevel'}
   */
  lineJoin: "miter",
  /** See {@link PIXI.TextStyle.miterLimit} */
  miterLimit: 10,
  /** See {@link PIXI.TextStyle.padding} */
  padding: 0,
  /**
   * See {@link PIXI.TextStyle.stroke}
   * @type {string|number}
   */
  stroke: "black",
  /** See {@link PIXI.TextStyle.strokeThickness} */
  strokeThickness: 0,
  /**
   * See {@link PIXI.TextStyle.textBaseline} 
   * @type {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
   */
  textBaseline: "alphabetic",
  /** See {@link PIXI.TextStyle.trim} */
  trim: !1,
  /**
   * See {@link PIXI.TextStyle.whiteSpace}
   * @type {'normal'|'pre'|'pre-line'}
   */
  whiteSpace: "pre",
  /** See {@link PIXI.TextStyle.wordWrap} */
  wordWrap: !1,
  /** See {@link PIXI.TextStyle.wordWrapWidth} */
  wordWrapWidth: 100
};
let Qe = mu;
function Hn(r) {
  const t = pt.shared, e = (i) => {
    const s = t.setValue(i);
    return s.alpha === 1 ? s.toHex() : s.toRgbaString();
  };
  return Array.isArray(r) ? r.map(e) : e(r);
}
function g_(r, t) {
  if (!Array.isArray(r) || !Array.isArray(t) || r.length !== t.length)
    return !1;
  for (let e = 0; e < r.length; ++e)
    if (r[e] !== t[e])
      return !1;
  return !0;
}
function Vn(r, t, e) {
  for (const i in e)
    Array.isArray(t[i]) ? r[i] = t[i].slice() : r[i] = t[i];
}
const y_ = {
  texture: !0,
  children: !1,
  baseTexture: !0
}, gu = class Vo extends ii {
  /**
   * @param text - The string that you would like the text to display
   * @param style - The style parameters
   * @param canvas - The canvas element for drawing text
   */
  constructor(t, e, i) {
    let s = !1;
    i || (i = H.ADAPTER.createCanvas(), s = !0), i.width = 3, i.height = 3;
    const n = j.from(i);
    n.orig = new tt(), n.trim = new tt(), super(n), this._ownCanvas = s, this.canvas = i, this.context = i.getContext("2d", {
      // required for trimming to work without warnings
      willReadFrequently: !0
    }), this._resolution = Vo.defaultResolution ?? H.RESOLUTION, this._autoResolution = Vo.defaultAutoResolution, this._text = null, this._style = null, this._styleListener = null, this._font = "", this.text = t, this.style = e, this.localStyleID = -1;
  }
  /**
   * @see PIXI.TextMetrics.experimentalLetterSpacing
   * @deprecated since 7.1.0
   */
  static get experimentalLetterSpacing() {
    return He.experimentalLetterSpacing;
  }
  static set experimentalLetterSpacing(t) {
    it(
      "7.1.0",
      "Text.experimentalLetterSpacing is deprecated, use TextMetrics.experimentalLetterSpacing"
    ), He.experimentalLetterSpacing = t;
  }
  /**
   * Renders text to its canvas, and updates its texture.
   *
   * By default this is used internally to ensure the texture is correct before rendering,
   * but it can be used called externally, for example from this class to 'pre-generate' the texture from a piece of text,
   * and then shared across multiple Sprites.
   * @param respectDirty - Whether to abort updating the text if the Text isn't dirty and the function is called.
   */
  updateText(t) {
    const e = this._style;
    if (this.localStyleID !== e.styleID && (this.dirty = !0, this.localStyleID = e.styleID), !this.dirty && t)
      return;
    this._font = this._style.toFontString();
    const i = this.context, s = He.measureText(this._text || " ", this._style, this._style.wordWrap, this.canvas), n = s.width, o = s.height, a = s.lines, h = s.lineHeight, l = s.lineWidths, c = s.maxLineWidth, u = s.fontProperties;
    this.canvas.width = Math.ceil(Math.ceil(Math.max(1, n) + e.padding * 2) * this._resolution), this.canvas.height = Math.ceil(Math.ceil(Math.max(1, o) + e.padding * 2) * this._resolution), i.scale(this._resolution, this._resolution), i.clearRect(0, 0, this.canvas.width, this.canvas.height), i.font = this._font, i.lineWidth = e.strokeThickness, i.textBaseline = e.textBaseline, i.lineJoin = e.lineJoin, i.miterLimit = e.miterLimit;
    let d, f;
    const p = e.dropShadow ? 2 : 1;
    for (let m = 0; m < p; ++m) {
      const g = e.dropShadow && m === 0, y = g ? Math.ceil(Math.max(1, o) + e.padding * 2) : 0, v = y * this._resolution;
      if (g) {
        i.fillStyle = "black", i.strokeStyle = "black";
        const x = e.dropShadowColor, T = e.dropShadowBlur * this._resolution, C = e.dropShadowDistance * this._resolution;
        i.shadowColor = pt.shared.setValue(x).setAlpha(e.dropShadowAlpha).toRgbaString(), i.shadowBlur = T, i.shadowOffsetX = Math.cos(e.dropShadowAngle) * C, i.shadowOffsetY = Math.sin(e.dropShadowAngle) * C + v;
      } else
        i.fillStyle = this._generateFillStyle(e, a, s), i.strokeStyle = e.stroke, i.shadowColor = "black", i.shadowBlur = 0, i.shadowOffsetX = 0, i.shadowOffsetY = 0;
      let _ = (h - u.fontSize) / 2;
      h - u.fontSize < 0 && (_ = 0);
      for (let x = 0; x < a.length; x++)
        d = e.strokeThickness / 2, f = e.strokeThickness / 2 + x * h + u.ascent + _, e.align === "right" ? d += c - l[x] : e.align === "center" && (d += (c - l[x]) / 2), e.stroke && e.strokeThickness && this.drawLetterSpacing(
          a[x],
          d + e.padding,
          f + e.padding - y,
          !0
        ), e.fill && this.drawLetterSpacing(
          a[x],
          d + e.padding,
          f + e.padding - y
        );
    }
    this.updateTexture();
  }
  /**
   * Render the text with letter-spacing.
   * @param text - The text to draw
   * @param x - Horizontal position to draw the text
   * @param y - Vertical position to draw the text
   * @param isStroke - Is this drawing for the outside stroke of the
   *  text? If not, it's for the inside fill
   */
  drawLetterSpacing(t, e, i, s = !1) {
    const n = this._style.letterSpacing;
    let o = !1;
    if (He.experimentalLetterSpacingSupported && (He.experimentalLetterSpacing ? (this.context.letterSpacing = `${n}px`, this.context.textLetterSpacing = `${n}px`, o = !0) : (this.context.letterSpacing = "0px", this.context.textLetterSpacing = "0px")), n === 0 || o) {
      s ? this.context.strokeText(t, e, i) : this.context.fillText(t, e, i);
      return;
    }
    let a = e;
    const h = He.graphemeSegmenter(t);
    let l = this.context.measureText(t).width, c = 0;
    for (let u = 0; u < h.length; ++u) {
      const d = h[u];
      s ? this.context.strokeText(d, a, i) : this.context.fillText(d, a, i);
      let f = "";
      for (let p = u + 1; p < h.length; ++p)
        f += h[p];
      c = this.context.measureText(f).width, a += l - c + n, l = c;
    }
  }
  /** Updates texture size based on canvas size. */
  updateTexture() {
    const t = this.canvas;
    if (this._style.trim) {
      const o = km(t);
      o.data && (t.width = o.width, t.height = o.height, this.context.putImageData(o.data, 0, 0));
    }
    const e = this._texture, i = this._style, s = i.trim ? 0 : i.padding, n = e.baseTexture;
    e.trim.width = e._frame.width = t.width / this._resolution, e.trim.height = e._frame.height = t.height / this._resolution, e.trim.x = -s, e.trim.y = -s, e.orig.width = e._frame.width - s * 2, e.orig.height = e._frame.height - s * 2, this._onTextureUpdate(), n.setRealSize(t.width, t.height, this._resolution), e.updateUvs(), this.dirty = !1;
  }
  /**
   * Renders the object using the WebGL renderer
   * @param renderer - The renderer
   */
  _render(t) {
    this._autoResolution && this._resolution !== t.resolution && (this._resolution = t.resolution, this.dirty = !0), this.updateText(!0), super._render(t);
  }
  /** Updates the transform on all children of this container for rendering. */
  updateTransform() {
    this.updateText(!0), super.updateTransform();
  }
  getBounds(t, e) {
    return this.updateText(!0), this._textureID === -1 && (t = !1), super.getBounds(t, e);
  }
  /**
   * Gets the local bounds of the text object.
   * @param rect - The output rectangle.
   * @returns The bounds.
   */
  getLocalBounds(t) {
    return this.updateText(!0), super.getLocalBounds.call(this, t);
  }
  /** Calculates the bounds of the Text as a rectangle. The bounds calculation takes the worldTransform into account. */
  _calculateBounds() {
    this.calculateVertices(), this._bounds.addQuad(this.vertexData);
  }
  /**
   * Generates the fill style. Can automatically generate a gradient based on the fill style being an array
   * @param style - The style.
   * @param lines - The lines of text.
   * @param metrics
   * @returns The fill style
   */
  _generateFillStyle(t, e, i) {
    const s = t.fill;
    if (Array.isArray(s)) {
      if (s.length === 1)
        return s[0];
    } else
      return s;
    let n;
    const o = t.dropShadow ? t.dropShadowDistance : 0, a = t.padding || 0, h = this.canvas.width / this._resolution - o - a * 2, l = this.canvas.height / this._resolution - o - a * 2, c = s.slice(), u = t.fillGradientStops.slice();
    if (!u.length) {
      const d = c.length + 1;
      for (let f = 1; f < d; ++f)
        u.push(f / d);
    }
    if (c.unshift(s[0]), u.unshift(0), c.push(s[s.length - 1]), u.push(1), t.fillGradientType === tn.LINEAR_VERTICAL) {
      n = this.context.createLinearGradient(h / 2, a, h / 2, l + a);
      const d = i.fontProperties.fontSize + t.strokeThickness;
      for (let f = 0; f < e.length; f++) {
        const p = i.lineHeight * (f - 1) + d, m = i.lineHeight * f;
        let g = m;
        f > 0 && p > m && (g = (m + p) / 2);
        const y = m + d, v = i.lineHeight * (f + 1);
        let _ = y;
        f + 1 < e.length && v < y && (_ = (y + v) / 2);
        const x = (_ - g) / l;
        for (let T = 0; T < c.length; T++) {
          let C = 0;
          typeof u[T] == "number" ? C = u[T] : C = T / c.length;
          let w = Math.min(1, Math.max(
            0,
            g / l + C * x
          ));
          w = Number(w.toFixed(5)), n.addColorStop(w, c[T]);
        }
      }
    } else {
      n = this.context.createLinearGradient(a, l / 2, h + a, l / 2);
      const d = c.length + 1;
      let f = 1;
      for (let p = 0; p < c.length; p++) {
        let m;
        typeof u[p] == "number" ? m = u[p] : m = f / d, n.addColorStop(m, c[p]), f++;
      }
    }
    return n;
  }
  /**
   * Destroys this text object.
   *
   * Note* Unlike a Sprite, a Text object will automatically destroy its baseTexture and texture as
   * the majority of the time the texture will not be shared with any other Sprites.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.children=false] - if set to true, all the children will have their
   *  destroy method called as well. 'options' will be passed on to those calls.
   * @param {boolean} [options.texture=true] - Should it destroy the current texture of the sprite as well
   * @param {boolean} [options.baseTexture=true] - Should it destroy the base texture of the sprite as well
   */
  destroy(t) {
    typeof t == "boolean" && (t = { children: t }), t = Object.assign({}, y_, t), super.destroy(t), this._ownCanvas && (this.canvas.height = this.canvas.width = 0), this.context = null, this.canvas = null, this._style = null;
  }
  /** The width of the Text, setting this will actually modify the scale to achieve the value set. */
  get width() {
    return this.updateText(!0), Math.abs(this.scale.x) * this._texture.orig.width;
  }
  set width(t) {
    this.updateText(!0);
    const e = je(this.scale.x) || 1;
    this.scale.x = e * t / this._texture.orig.width, this._width = t;
  }
  /** The height of the Text, setting this will actually modify the scale to achieve the value set. */
  get height() {
    return this.updateText(!0), Math.abs(this.scale.y) * this._texture.orig.height;
  }
  set height(t) {
    this.updateText(!0);
    const e = je(this.scale.y) || 1;
    this.scale.y = e * t / this._texture.orig.height, this._height = t;
  }
  /**
   * Set the style of the text.
   *
   * Set up an event listener to listen for changes on the style object and mark the text as dirty.
   *
   * If setting the `style` can also be partial {@link PIXI.ITextStyle}.
   */
  get style() {
    return this._style;
  }
  set style(t) {
    t = t || {}, t instanceof Qe ? this._style = t : this._style = new Qe(t), this.localStyleID = -1, this.dirty = !0;
  }
  /** Set the copy for the text object. To split a line you can use '\n'. */
  get text() {
    return this._text;
  }
  set text(t) {
    t = String(t ?? ""), this._text !== t && (this._text = t, this.dirty = !0);
  }
  /**
   * The resolution / device pixel ratio of the canvas.
   *
   * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
   * @default 1
   */
  get resolution() {
    return this._resolution;
  }
  set resolution(t) {
    this._autoResolution = !1, this._resolution !== t && (this._resolution = t, this.dirty = !0);
  }
};
gu.defaultAutoResolution = !0;
let yu = gu;
class __ {
  /**
   * @param maxItemsPerFrame - The maximum number of items that can be prepared each frame.
   */
  constructor(t) {
    this.maxItemsPerFrame = t, this.itemsLeft = 0;
  }
  /** Resets any counting properties to start fresh on a new frame. */
  beginFrame() {
    this.itemsLeft = this.maxItemsPerFrame;
  }
  /**
   * Checks to see if another item can be uploaded. This should only be called once per item.
   * @returns If the item is allowed to be uploaded.
   */
  allowedToUpload() {
    return this.itemsLeft-- > 0;
  }
}
function v_(r, t) {
  var i;
  let e = !1;
  if ((i = r == null ? void 0 : r._textures) != null && i.length) {
    for (let s = 0; s < r._textures.length; s++)
      if (r._textures[s] instanceof j) {
        const n = r._textures[s].baseTexture;
        t.includes(n) || (t.push(n), e = !0);
      }
  }
  return e;
}
function x_(r, t) {
  if (r.baseTexture instanceof J) {
    const e = r.baseTexture;
    return t.includes(e) || t.push(e), !0;
  }
  return !1;
}
function b_(r, t) {
  if (r._texture && r._texture instanceof j) {
    const e = r._texture.baseTexture;
    return t.includes(e) || t.push(e), !0;
  }
  return !1;
}
function T_(r, t) {
  return t instanceof yu ? (t.updateText(!0), !0) : !1;
}
function E_(r, t) {
  if (t instanceof Qe) {
    const e = t.toFontString();
    return He.measureFont(e), !0;
  }
  return !1;
}
function w_(r, t) {
  if (r instanceof yu) {
    t.includes(r.style) || t.push(r.style), t.includes(r) || t.push(r);
    const e = r._texture.baseTexture;
    return t.includes(e) || t.push(e), !0;
  }
  return !1;
}
function A_(r, t) {
  return r instanceof Qe ? (t.includes(r) || t.push(r), !0) : !1;
}
const _u = class vu {
  /**
   * @param {PIXI.IRenderer} renderer - A reference to the current renderer
   */
  constructor(t) {
    this.limiter = new __(vu.uploadsPerFrame), this.renderer = t, this.uploadHookHelper = null, this.queue = [], this.addHooks = [], this.uploadHooks = [], this.completes = [], this.ticking = !1, this.delayedTick = () => {
      this.queue && this.prepareItems();
    }, this.registerFindHook(w_), this.registerFindHook(A_), this.registerFindHook(v_), this.registerFindHook(x_), this.registerFindHook(b_), this.registerUploadHook(T_), this.registerUploadHook(E_);
  }
  /**
   * Upload all the textures and graphics to the GPU.
   * @method PIXI.BasePrepare#upload
   * @param {PIXI.DisplayObject|PIXI.Container|PIXI.BaseTexture|PIXI.Texture|PIXI.Graphics|PIXI.Text} [item] -
   *        Container or display object to search for items to upload or the items to upload themselves,
   *        or optionally ommitted, if items have been added using {@link PIXI.BasePrepare#add `prepare.add`}.
   */
  upload(t) {
    return new Promise((e) => {
      t && this.add(t), this.queue.length ? (this.completes.push(e), this.ticking || (this.ticking = !0, Yt.system.addOnce(this.tick, this, Tr.UTILITY))) : e();
    });
  }
  /**
   * Handle tick update
   * @private
   */
  tick() {
    setTimeout(this.delayedTick, 0);
  }
  /**
   * Actually prepare items. This is handled outside of the tick because it will take a while
   * and we do NOT want to block the current animation frame from rendering.
   * @private
   */
  prepareItems() {
    for (this.limiter.beginFrame(); this.queue.length && this.limiter.allowedToUpload(); ) {
      const t = this.queue[0];
      let e = !1;
      if (t && !t._destroyed) {
        for (let i = 0, s = this.uploadHooks.length; i < s; i++)
          if (this.uploadHooks[i](this.uploadHookHelper, t)) {
            this.queue.shift(), e = !0;
            break;
          }
      }
      e || this.queue.shift();
    }
    if (this.queue.length)
      Yt.system.addOnce(this.tick, this, Tr.UTILITY);
    else {
      this.ticking = !1;
      const t = this.completes.slice(0);
      this.completes.length = 0;
      for (let e = 0, i = t.length; e < i; e++)
        t[e]();
    }
  }
  /**
   * Adds hooks for finding items.
   * @param {Function} addHook - Function call that takes two parameters: `item:*, queue:Array`
   *          function must return `true` if it was able to add item to the queue.
   * @returns Instance of plugin for chaining.
   */
  registerFindHook(t) {
    return t && this.addHooks.push(t), this;
  }
  /**
   * Adds hooks for uploading items.
   * @param {Function} uploadHook - Function call that takes two parameters: `prepare:CanvasPrepare, item:*` and
   *          function must return `true` if it was able to handle upload of item.
   * @returns Instance of plugin for chaining.
   */
  registerUploadHook(t) {
    return t && this.uploadHooks.push(t), this;
  }
  /**
   * Manually add an item to the uploading queue.
   * @param {PIXI.DisplayObject|PIXI.Container|PIXI.BaseTexture|PIXI.Texture|PIXI.Graphics|PIXI.Text|*} item - Object to
   *        add to the queue
   * @returns Instance of plugin for chaining.
   */
  add(t) {
    for (let e = 0, i = this.addHooks.length; e < i && !this.addHooks[e](t, this.queue); e++)
      ;
    if (t instanceof de)
      for (let e = t.children.length - 1; e >= 0; e--)
        this.add(t.children[e]);
    return this;
  }
  /** Destroys the plugin, don't use after this. */
  destroy() {
    this.ticking && Yt.system.remove(this.tick, this), this.ticking = !1, this.addHooks = null, this.uploadHooks = null, this.renderer = null, this.completes = null, this.queue = null, this.limiter = null, this.uploadHookHelper = null;
  }
};
_u.uploadsPerFrame = 4;
let Xo = _u;
Object.defineProperties(H, {
  /**
   * Default number of uploads per frame using prepare plugin.
   * @static
   * @memberof PIXI.settings
   * @name UPLOADS_PER_FRAME
   * @deprecated since 7.1.0
   * @see PIXI.BasePrepare.uploadsPerFrame
   * @type {number}
   */
  UPLOADS_PER_FRAME: {
    get() {
      return Xo.uploadsPerFrame;
    },
    set(r) {
      it("7.1.0", "settings.UPLOADS_PER_FRAME is deprecated, use prepare.BasePrepare.uploadsPerFrame"), Xo.uploadsPerFrame = r;
    }
  }
});
function xu(r, t) {
  return t instanceof J ? (t._glTextures[r.CONTEXT_UID] || r.texture.bind(t), !0) : !1;
}
function S_(r, t) {
  if (!(t instanceof Mi))
    return !1;
  const { geometry: e } = t;
  t.finishPoly(), e.updateBatches();
  const { batches: i } = e;
  for (let s = 0; s < i.length; s++) {
    const { texture: n } = i[s].style;
    n && xu(r, n.baseTexture);
  }
  return e.batchable || r.geometry.bind(e, t._resolveDirectShader(r)), !0;
}
function I_(r, t) {
  return r instanceof Mi ? (t.push(r), !0) : !1;
}
class bu extends Xo {
  /**
   * @param {PIXI.Renderer} renderer - A reference to the current renderer
   */
  constructor(t) {
    super(t), this.uploadHookHelper = this.renderer, this.registerFindHook(I_), this.registerUploadHook(xu), this.registerUploadHook(S_);
  }
}
bu.extension = {
  name: "prepare",
  type: k.RendererSystem
};
z.add(bu);
var C_ = `#version 300 es
#define SHADER_NAME Tiling-Sprite-100

precision lowp float;

in vec2 vTextureCoord;

out vec4 fragmentColor;

uniform sampler2D uSampler;
uniform vec4 uColor;
uniform mat3 uMapCoord;
uniform vec4 uClampFrame;
uniform vec2 uClampOffset;

void main(void)
{
    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);
    coord = (uMapCoord * vec3(coord, 1.0)).xy;
    vec2 unclamped = coord;
    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

    vec4 texSample = texture(uSampler, coord, unclamped == coord ? 0.0f : -32.0f);// lod-bias very negative to force lod 0

    fragmentColor = texSample * uColor;
}
`, R_ = `#version 300 es
#define SHADER_NAME Tiling-Sprite-300

precision lowp float;

in vec2 aVertexPosition;
in vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;
uniform mat3 uTransform;

out vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;
}
`, P_ = `#version 100
#ifdef GL_EXT_shader_texture_lod
    #extension GL_EXT_shader_texture_lod : enable
#endif
#define SHADER_NAME Tiling-Sprite-100

precision lowp float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec4 uColor;
uniform mat3 uMapCoord;
uniform vec4 uClampFrame;
uniform vec2 uClampOffset;

void main(void)
{
    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);
    coord = (uMapCoord * vec3(coord, 1.0)).xy;
    vec2 unclamped = coord;
    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

    #ifdef GL_EXT_shader_texture_lod
        vec4 texSample = unclamped == coord
            ? texture2D(uSampler, coord) 
            : texture2DLodEXT(uSampler, coord, 0);
    #else
        vec4 texSample = texture2D(uSampler, coord);
    #endif

    gl_FragColor = texSample * uColor;
}
`, il = `#version 100
#define SHADER_NAME Tiling-Sprite-100

precision lowp float;

attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;
uniform mat3 uTransform;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;
}
`, M_ = `#version 100
#define SHADER_NAME Tiling-Sprite-Simple-100

precision lowp float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec4 uColor;

void main(void)
{
    vec4 texSample = texture2D(uSampler, vTextureCoord);
    gl_FragColor = texSample * uColor;
}
`;
const as = new yt();
class Tu extends Zs {
  /**
   * constructor for renderer
   * @param {PIXI.Renderer} renderer - The renderer this tiling awesomeness works for.
   */
  constructor(t) {
    super(t), t.runners.contextChange.add(this), this.quad = new Sc(), this.state = Ae.for2d();
  }
  /** Creates shaders when context is initialized. */
  contextChange() {
    const t = this.renderer, e = { globals: t.globalUniforms };
    this.simpleShader = Ee.from(il, M_, e), this.shader = t.context.webGLVersion > 1 ? Ee.from(R_, C_, e) : Ee.from(il, P_, e);
  }
  /**
   * @param {PIXI.TilingSprite} ts - tilingSprite to be rendered
   */
  render(t) {
    const e = this.renderer, i = this.quad;
    let s = i.vertices;
    s[0] = s[6] = t._width * -t.anchor.x, s[1] = s[3] = t._height * -t.anchor.y, s[2] = s[4] = t._width * (1 - t.anchor.x), s[5] = s[7] = t._height * (1 - t.anchor.y);
    const n = t.uvRespectAnchor ? t.anchor.x : 0, o = t.uvRespectAnchor ? t.anchor.y : 0;
    s = i.uvs, s[0] = s[6] = -n, s[1] = s[3] = -o, s[2] = s[4] = 1 - n, s[5] = s[7] = 1 - o, i.invalidate();
    const a = t._texture, h = a.baseTexture, l = h.alphaMode > 0, c = t.tileTransform.localTransform, u = t.uvMatrix;
    let d = h.isPowerOfTwo && a.frame.width === h.width && a.frame.height === h.height;
    d && (h._glTextures[e.CONTEXT_UID] ? d = h.wrapMode !== Ye.CLAMP : h.wrapMode === Ye.CLAMP && (h.wrapMode = Ye.REPEAT));
    const f = d ? this.simpleShader : this.shader, p = a.width, m = a.height, g = t._width, y = t._height;
    as.set(
      c.a * p / g,
      c.b * p / y,
      c.c * m / g,
      c.d * m / y,
      c.tx / g,
      c.ty / y
    ), as.invert(), d ? as.prepend(u.mapCoord) : (f.uniforms.uMapCoord = u.mapCoord.toArray(!0), f.uniforms.uClampFrame = u.uClampFrame, f.uniforms.uClampOffset = u.uClampOffset), f.uniforms.uTransform = as.toArray(!0), f.uniforms.uColor = pt.shared.setValue(t.tint).premultiply(t.worldAlpha, l).toArray(f.uniforms.uColor), f.uniforms.translationMatrix = t.transform.worldTransform.toArray(!0), f.uniforms.uSampler = a, e.shader.bind(f), e.geometry.bind(i), this.state.blendMode = fc(t.blendMode, l), e.state.set(this.state), e.geometry.draw(this.renderer.gl.TRIANGLES, 6, 0);
  }
}
Tu.extension = {
  name: "tilingSprite",
  type: k.RendererPlugin
};
z.add(Tu);
const Eu = class vi {
  /**
   * @param texture - Reference to the source BaseTexture object.
   * @param {object} data - Spritesheet image data.
   * @param resolutionFilename - The filename to consider when determining
   *        the resolution of the spritesheet. If not provided, the imageUrl will
   *        be used on the BaseTexture.
   */
  constructor(t, e, i = null) {
    this.linkedSheets = [], this._texture = t instanceof j ? t : null, this.baseTexture = t instanceof J ? t : this._texture.baseTexture, this.textures = {}, this.animations = {}, this.data = e;
    const s = this.baseTexture.resource;
    this.resolution = this._updateResolution(i || (s ? s.url : null)), this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
  }
  /**
   * Generate the resolution from the filename or fallback
   * to the meta.scale field of the JSON data.
   * @param resolutionFilename - The filename to use for resolving
   *        the default resolution.
   * @returns Resolution to use for spritesheet.
   */
  _updateResolution(t = null) {
    const { scale: e } = this.data.meta;
    let i = Oe(t, null);
    return i === null && (i = typeof e == "number" ? e : parseFloat(e ?? "1")), i !== 1 && this.baseTexture.setResolution(i), i;
  }
  /**
   * Parser spritesheet from loaded data. This is done asynchronously
   * to prevent creating too many Texture within a single process.
   * @method PIXI.Spritesheet#parse
   */
  parse() {
    return new Promise((t) => {
      this._callback = t, this._batchIndex = 0, this._frameKeys.length <= vi.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch();
    });
  }
  /**
   * Process a batch of frames
   * @param initialFrameIndex - The index of frame to start.
   */
  _processFrames(t) {
    let e = t;
    const i = vi.BATCH_SIZE;
    for (; e - t < i && e < this._frameKeys.length; ) {
      const s = this._frameKeys[e], n = this._frames[s], o = n.frame;
      if (o) {
        let a = null, h = null;
        const l = n.trimmed !== !1 && n.sourceSize ? n.sourceSize : n.frame, c = new tt(
          0,
          0,
          Math.floor(l.w) / this.resolution,
          Math.floor(l.h) / this.resolution
        );
        n.rotated ? a = new tt(
          Math.floor(o.x) / this.resolution,
          Math.floor(o.y) / this.resolution,
          Math.floor(o.h) / this.resolution,
          Math.floor(o.w) / this.resolution
        ) : a = new tt(
          Math.floor(o.x) / this.resolution,
          Math.floor(o.y) / this.resolution,
          Math.floor(o.w) / this.resolution,
          Math.floor(o.h) / this.resolution
        ), n.trimmed !== !1 && n.spriteSourceSize && (h = new tt(
          Math.floor(n.spriteSourceSize.x) / this.resolution,
          Math.floor(n.spriteSourceSize.y) / this.resolution,
          Math.floor(o.w) / this.resolution,
          Math.floor(o.h) / this.resolution
        )), this.textures[s] = new j(
          this.baseTexture,
          a,
          c,
          h,
          n.rotated ? 2 : 0,
          n.anchor,
          n.borders
        ), j.addToCache(this.textures[s], s.toString());
      }
      e++;
    }
  }
  /** Parse animations config. */
  _processAnimations() {
    const t = this.data.animations || {};
    for (const e in t) {
      this.animations[e] = [];
      for (let i = 0; i < t[e].length; i++) {
        const s = t[e][i];
        this.animations[e].push(this.textures[s]);
      }
    }
  }
  /** The parse has completed. */
  _parseComplete() {
    const t = this._callback;
    this._callback = null, this._batchIndex = 0, t.call(this, this.textures);
  }
  /** Begin the next batch of textures. */
  _nextBatch() {
    this._processFrames(this._batchIndex * vi.BATCH_SIZE), this._batchIndex++, setTimeout(() => {
      this._batchIndex * vi.BATCH_SIZE < this._frameKeys.length ? this._nextBatch() : (this._processAnimations(), this._parseComplete());
    }, 0);
  }
  /**
   * Destroy Spritesheet and don't use after this.
   * @param {boolean} [destroyBase=false] - Whether to destroy the base texture as well
   */
  destroy(t = !1) {
    var e;
    for (const i in this.textures)
      this.textures[i].destroy();
    this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, t && ((e = this._texture) == null || e.destroy(), this.baseTexture.destroy()), this._texture = null, this.baseTexture = null, this.linkedSheets = [];
  }
};
Eu.BATCH_SIZE = 1e3;
let sl = Eu;
const B_ = ["jpg", "png", "jpeg", "avif", "webp"];
function wu(r, t, e) {
  const i = {};
  if (r.forEach((s) => {
    i[s] = t;
  }), Object.keys(t.textures).forEach((s) => {
    i[s] = t.textures[s];
  }), !e) {
    const s = Rt.dirname(r[0]);
    t.linkedSheets.forEach((n, o) => {
      const a = wu([`${s}/${t.data.meta.related_multi_packs[o]}`], n, !0);
      Object.assign(i, a);
    });
  }
  return i;
}
const D_ = {
  extension: k.Asset,
  /** Handle the caching of the related Spritesheet Textures */
  cache: {
    test: (r) => r instanceof sl,
    getCacheableAssets: (r, t) => wu(r, t, !1)
  },
  /** Resolve the the resolution of the asset. */
  resolver: {
    test: (r) => {
      const t = r.split("?")[0].split("."), e = t.pop(), i = t.pop();
      return e === "json" && B_.includes(i);
    },
    parse: (r) => {
      var e;
      const t = r.split(".");
      return {
        resolution: parseFloat(((e = H.RETINA_PREFIX.exec(r)) == null ? void 0 : e[1]) ?? "1"),
        format: t[t.length - 2],
        src: r
      };
    }
  },
  /**
   * Loader plugin that parses sprite sheets!
   * once the JSON has been loaded this checks to see if the JSON is spritesheet data.
   * If it is, we load the spritesheets image and parse the data into PIXI.Spritesheet
   * All textures in the sprite sheet are then added to the cache
   * @ignore
   */
  loader: {
    name: "spritesheetLoader",
    extension: {
      type: k.LoadParser,
      priority: fe.Normal
    },
    async testParse(r, t) {
      return Rt.extname(t.src).toLowerCase() === ".json" && !!r.frames;
    },
    async parse(r, t, e) {
      var h, l;
      let i = Rt.dirname(t.src);
      i && i.lastIndexOf("/") !== i.length - 1 && (i += "/");
      let s = i + r.meta.image;
      s = Uo(s, t.src);
      const n = (await e.load([s]))[s], o = new sl(
        n.baseTexture,
        r,
        t.src
      );
      await o.parse();
      const a = (h = r == null ? void 0 : r.meta) == null ? void 0 : h.related_multi_packs;
      if (Array.isArray(a)) {
        const c = [];
        for (const d of a) {
          if (typeof d != "string")
            continue;
          let f = i + d;
          (l = t.data) != null && l.ignoreMultiPack || (f = Uo(f, t.src), c.push(e.load({
            src: f,
            data: {
              ignoreMultiPack: !0
            }
          })));
        }
        const u = await Promise.all(c);
        o.linkedSheets = u, u.forEach((d) => {
          d.linkedSheets = [o].concat(o.linkedSheets.filter((f) => f !== d));
        });
      }
      return o;
    },
    unload(r) {
      r.destroy(!0);
    }
  }
};
z.add(D_);
class Vs {
  constructor() {
    this.info = [], this.common = [], this.page = [], this.char = [], this.kerning = [], this.distanceField = [];
  }
}
class xs {
  /**
   * Check if resource refers to txt font data.
   * @param data
   * @returns - True if resource could be treated as font data, false otherwise.
   */
  static test(t) {
    return typeof t == "string" && t.startsWith("info face=");
  }
  /**
   * Convert text font data to a javascript object.
   * @param txt - Raw string data to be converted
   * @returns - Parsed font data
   */
  static parse(t) {
    const e = t.match(/^[a-z]+\s+.+$/gm), i = {
      info: [],
      common: [],
      page: [],
      char: [],
      chars: [],
      kerning: [],
      kernings: [],
      distanceField: []
    };
    for (const n in e) {
      const o = e[n].match(/^[a-z]+/gm)[0], a = e[n].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm), h = {};
      for (const l in a) {
        const c = a[l].split("="), u = c[0], d = c[1].replace(/"/gm, ""), f = parseFloat(d), p = isNaN(f) ? d : f;
        h[u] = p;
      }
      i[o].push(h);
    }
    const s = new Vs();
    return i.info.forEach((n) => s.info.push({
      face: n.face,
      size: parseInt(n.size, 10)
    })), i.common.forEach((n) => s.common.push({
      lineHeight: parseInt(n.lineHeight, 10)
    })), i.page.forEach((n) => s.page.push({
      id: parseInt(n.id, 10),
      file: n.file
    })), i.char.forEach((n) => s.char.push({
      id: parseInt(n.id, 10),
      page: parseInt(n.page, 10),
      x: parseInt(n.x, 10),
      y: parseInt(n.y, 10),
      width: parseInt(n.width, 10),
      height: parseInt(n.height, 10),
      xoffset: parseInt(n.xoffset, 10),
      yoffset: parseInt(n.yoffset, 10),
      xadvance: parseInt(n.xadvance, 10)
    })), i.kerning.forEach((n) => s.kerning.push({
      first: parseInt(n.first, 10),
      second: parseInt(n.second, 10),
      amount: parseInt(n.amount, 10)
    })), i.distanceField.forEach((n) => s.distanceField.push({
      distanceRange: parseInt(n.distanceRange, 10),
      fieldType: n.fieldType
    })), s;
  }
}
class zo {
  /**
   * Check if resource refers to xml font data.
   * @param data
   * @returns - True if resource could be treated as font data, false otherwise.
   */
  static test(t) {
    const e = t;
    return typeof t != "string" && "getElementsByTagName" in t && e.getElementsByTagName("page").length && e.getElementsByTagName("info")[0].getAttribute("face") !== null;
  }
  /**
   * Convert the XML into BitmapFontData that we can use.
   * @param xml
   * @returns - Data to use for BitmapFont
   */
  static parse(t) {
    const e = new Vs(), i = t.getElementsByTagName("info"), s = t.getElementsByTagName("common"), n = t.getElementsByTagName("page"), o = t.getElementsByTagName("char"), a = t.getElementsByTagName("kerning"), h = t.getElementsByTagName("distanceField");
    for (let l = 0; l < i.length; l++)
      e.info.push({
        face: i[l].getAttribute("face"),
        size: parseInt(i[l].getAttribute("size"), 10)
      });
    for (let l = 0; l < s.length; l++)
      e.common.push({
        lineHeight: parseInt(s[l].getAttribute("lineHeight"), 10)
      });
    for (let l = 0; l < n.length; l++)
      e.page.push({
        id: parseInt(n[l].getAttribute("id"), 10) || 0,
        file: n[l].getAttribute("file")
      });
    for (let l = 0; l < o.length; l++) {
      const c = o[l];
      e.char.push({
        id: parseInt(c.getAttribute("id"), 10),
        page: parseInt(c.getAttribute("page"), 10) || 0,
        x: parseInt(c.getAttribute("x"), 10),
        y: parseInt(c.getAttribute("y"), 10),
        width: parseInt(c.getAttribute("width"), 10),
        height: parseInt(c.getAttribute("height"), 10),
        xoffset: parseInt(c.getAttribute("xoffset"), 10),
        yoffset: parseInt(c.getAttribute("yoffset"), 10),
        xadvance: parseInt(c.getAttribute("xadvance"), 10)
      });
    }
    for (let l = 0; l < a.length; l++)
      e.kerning.push({
        first: parseInt(a[l].getAttribute("first"), 10),
        second: parseInt(a[l].getAttribute("second"), 10),
        amount: parseInt(a[l].getAttribute("amount"), 10)
      });
    for (let l = 0; l < h.length; l++)
      e.distanceField.push({
        fieldType: h[l].getAttribute("fieldType"),
        distanceRange: parseInt(h[l].getAttribute("distanceRange"), 10)
      });
    return e;
  }
}
class Wo {
  /**
   * Check if resource refers to text xml font data.
   * @param data
   * @returns - True if resource could be treated as font data, false otherwise.
   */
  static test(t) {
    return typeof t == "string" && t.includes("<font>") ? zo.test(H.ADAPTER.parseXML(t)) : !1;
  }
  /**
   * Convert the text XML into BitmapFontData that we can use.
   * @param xmlTxt
   * @returns - Data to use for BitmapFont
   */
  static parse(t) {
    return zo.parse(H.ADAPTER.parseXML(t));
  }
}
const Xn = [
  xs,
  zo,
  Wo
];
function F_(r) {
  for (let t = 0; t < Xn.length; t++)
    if (Xn[t].test(r))
      return Xn[t];
  return null;
}
function O_(r, t, e, i, s, n) {
  const o = e.fill;
  if (Array.isArray(o)) {
    if (o.length === 1)
      return o[0];
  } else
    return o;
  let a;
  const h = e.dropShadow ? e.dropShadowDistance : 0, l = e.padding || 0, c = r.width / i - h - l * 2, u = r.height / i - h - l * 2, d = o.slice(), f = e.fillGradientStops.slice();
  if (!f.length) {
    const p = d.length + 1;
    for (let m = 1; m < p; ++m)
      f.push(m / p);
  }
  if (d.unshift(o[0]), f.unshift(0), d.push(o[o.length - 1]), f.push(1), e.fillGradientType === tn.LINEAR_VERTICAL) {
    a = t.createLinearGradient(c / 2, l, c / 2, u + l);
    let p = 0;
    const m = (n.fontProperties.fontSize + e.strokeThickness) / u;
    for (let g = 0; g < s.length; g++) {
      const y = n.lineHeight * g;
      for (let v = 0; v < d.length; v++) {
        let _ = 0;
        typeof f[v] == "number" ? _ = f[v] : _ = v / d.length;
        const x = y / u + _ * m;
        let T = Math.max(p, x);
        T = Math.min(T, 1), a.addColorStop(T, d[v]), p = T;
      }
    }
  } else {
    a = t.createLinearGradient(l, u / 2, c + l, u / 2);
    const p = d.length + 1;
    let m = 1;
    for (let g = 0; g < d.length; g++) {
      let y;
      typeof f[g] == "number" ? y = f[g] : y = m / p, a.addColorStop(y, d[g]), m++;
    }
  }
  return a;
}
function L_(r, t, e, i, s, n, o) {
  const a = e.text, h = e.fontProperties;
  t.translate(i, s), t.scale(n, n);
  const l = o.strokeThickness / 2, c = -(o.strokeThickness / 2);
  if (t.font = o.toFontString(), t.lineWidth = o.strokeThickness, t.textBaseline = o.textBaseline, t.lineJoin = o.lineJoin, t.miterLimit = o.miterLimit, t.fillStyle = O_(r, t, o, n, [a], e), t.strokeStyle = o.stroke, o.dropShadow) {
    const u = o.dropShadowColor, d = o.dropShadowBlur * n, f = o.dropShadowDistance * n;
    t.shadowColor = pt.shared.setValue(u).setAlpha(o.dropShadowAlpha).toRgbaString(), t.shadowBlur = d, t.shadowOffsetX = Math.cos(o.dropShadowAngle) * f, t.shadowOffsetY = Math.sin(o.dropShadowAngle) * f;
  } else
    t.shadowColor = "black", t.shadowBlur = 0, t.shadowOffsetX = 0, t.shadowOffsetY = 0;
  o.stroke && o.strokeThickness && t.strokeText(a, l, c + e.lineHeight - h.descent), o.fill && t.fillText(a, l, c + e.lineHeight - h.descent), t.setTransform(1, 0, 0, 1, 0, 0), t.fillStyle = "rgba(0, 0, 0, 0)";
}
function bs(r) {
  return r.codePointAt ? r.codePointAt(0) : r.charCodeAt(0);
}
function Au(r) {
  return Array.from ? Array.from(r) : r.split("");
}
function N_(r) {
  typeof r == "string" && (r = [r]);
  const t = [];
  for (let e = 0, i = r.length; e < i; e++) {
    const s = r[e];
    if (Array.isArray(s)) {
      if (s.length !== 2)
        throw new Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${s.length}.`);
      const n = s[0].charCodeAt(0), o = s[1].charCodeAt(0);
      if (o < n)
        throw new Error("[BitmapFont]: Invalid character range.");
      for (let a = n, h = o; a <= h; a++)
        t.push(String.fromCharCode(a));
    } else
      t.push(...Au(s));
  }
  if (t.length === 0)
    throw new Error("[BitmapFont]: Empty set when resolving characters.");
  return t;
}
const ke = class _e {
  /**
   * @param data
   * @param textures
   * @param ownsTextures - Setting to `true` will destroy page textures
   *        when the font is uninstalled.
   */
  constructor(t, e, i) {
    var c;
    const [s] = t.info, [n] = t.common, [o] = t.page, [a] = t.distanceField, h = Oe(o.file), l = {};
    this._ownsTextures = i, this.font = s.face, this.size = s.size, this.lineHeight = n.lineHeight / h, this.chars = {}, this.pageTextures = l;
    for (let u = 0; u < t.page.length; u++) {
      const { id: d, file: f } = t.page[u];
      l[d] = e instanceof Array ? e[u] : e[f], a != null && a.fieldType && a.fieldType !== "none" && (l[d].baseTexture.alphaMode = Ht.NO_PREMULTIPLIED_ALPHA, l[d].baseTexture.mipmap = we.OFF);
    }
    for (let u = 0; u < t.char.length; u++) {
      const { id: d, page: f } = t.char[u];
      let { x: p, y: m, width: g, height: y, xoffset: v, yoffset: _, xadvance: x } = t.char[u];
      p /= h, m /= h, g /= h, y /= h, v /= h, _ /= h, x /= h;
      const T = new tt(
        p + l[f].frame.x / h,
        m + l[f].frame.y / h,
        g,
        y
      );
      this.chars[d] = {
        xOffset: v,
        yOffset: _,
        xAdvance: x,
        kerning: {},
        texture: new j(
          l[f].baseTexture,
          T
        ),
        page: f
      };
    }
    for (let u = 0; u < t.kerning.length; u++) {
      let { first: d, second: f, amount: p } = t.kerning[u];
      d /= h, f /= h, p /= h, this.chars[f] && (this.chars[f].kerning[d] = p);
    }
    this.distanceFieldRange = a == null ? void 0 : a.distanceRange, this.distanceFieldType = ((c = a == null ? void 0 : a.fieldType) == null ? void 0 : c.toLowerCase()) ?? "none";
  }
  /** Remove references to created glyph textures. */
  destroy() {
    for (const t in this.chars)
      this.chars[t].texture.destroy(), this.chars[t].texture = null;
    for (const t in this.pageTextures)
      this._ownsTextures && this.pageTextures[t].destroy(!0), this.pageTextures[t] = null;
    this.chars = null, this.pageTextures = null;
  }
  /**
   * Register a new bitmap font.
   * @param data - The
   *        characters map that could be provided as xml or raw string.
   * @param textures - List of textures for each page.
   * @param ownsTextures - Set to `true` to destroy page textures
   *        when the font is uninstalled. By default fonts created with
   *        `BitmapFont.from` or from the `BitmapFontLoader` are `true`.
   * @returns {PIXI.BitmapFont} Result font object with font, size, lineHeight
   *         and char fields.
   */
  static install(t, e, i) {
    let s;
    if (t instanceof Vs)
      s = t;
    else {
      const o = F_(t);
      if (!o)
        throw new Error("Unrecognized data format for font.");
      s = o.parse(t);
    }
    e instanceof j && (e = [e]);
    const n = new _e(s, e, i);
    return _e.available[n.font] = n, n;
  }
  /**
   * Remove bitmap font by name.
   * @param name - Name of the font to uninstall.
   */
  static uninstall(t) {
    const e = _e.available[t];
    if (!e)
      throw new Error(`No font found named '${t}'`);
    e.destroy(), delete _e.available[t];
  }
  /**
   * Generates a bitmap-font for the given style and character set. This does not support
   * kernings yet. With `style` properties, only the following non-layout properties are used:
   *
   * - {@link PIXI.TextStyle#dropShadow|dropShadow}
   * - {@link PIXI.TextStyle#dropShadowDistance|dropShadowDistance}
   * - {@link PIXI.TextStyle#dropShadowColor|dropShadowColor}
   * - {@link PIXI.TextStyle#dropShadowBlur|dropShadowBlur}
   * - {@link PIXI.TextStyle#dropShadowAngle|dropShadowAngle}
   * - {@link PIXI.TextStyle#fill|fill}
   * - {@link PIXI.TextStyle#fillGradientStops|fillGradientStops}
   * - {@link PIXI.TextStyle#fillGradientType|fillGradientType}
   * - {@link PIXI.TextStyle#fontFamily|fontFamily}
   * - {@link PIXI.TextStyle#fontSize|fontSize}
   * - {@link PIXI.TextStyle#fontVariant|fontVariant}
   * - {@link PIXI.TextStyle#fontWeight|fontWeight}
   * - {@link PIXI.TextStyle#lineJoin|lineJoin}
   * - {@link PIXI.TextStyle#miterLimit|miterLimit}
   * - {@link PIXI.TextStyle#stroke|stroke}
   * - {@link PIXI.TextStyle#strokeThickness|strokeThickness}
   * - {@link PIXI.TextStyle#textBaseline|textBaseline}
   * @param name - The name of the custom font to use with BitmapText.
   * @param textStyle - Style options to render with BitmapFont.
   * @param options - Setup options for font or name of the font.
   * @returns Font generated by style options.
   * @example
   * import { BitmapFont, BitmapText } from 'pixi.js';
   *
   * BitmapFont.from('TitleFont', {
   *     fontFamily: 'Arial',
   *     fontSize: 12,
   *     strokeThickness: 2,
   *     fill: 'purple',
   * });
   *
   * const title = new BitmapText('This is the title', { fontName: 'TitleFont' });
   */
  static from(t, e, i) {
    if (!t)
      throw new Error("[BitmapFont] Property `name` is required.");
    const {
      chars: s,
      padding: n,
      resolution: o,
      textureWidth: a,
      textureHeight: h,
      ...l
    } = Object.assign({}, _e.defaultOptions, i), c = N_(s), u = e instanceof Qe ? e : new Qe(e), d = a, f = new Vs();
    f.info[0] = {
      face: u.fontFamily,
      size: u.fontSize
    }, f.common[0] = {
      lineHeight: u.fontSize
    };
    let p = 0, m = 0, g, y, v, _ = 0;
    const x = [];
    for (let C = 0; C < c.length; C++) {
      g || (g = H.ADAPTER.createCanvas(), g.width = a, g.height = h, y = g.getContext("2d"), v = new J(g, { resolution: o, ...l }), x.push(new j(v)), f.page.push({
        id: x.length - 1,
        file: ""
      }));
      const w = c[C], I = He.measureText(w, u, !1, g), S = I.width, P = Math.ceil(I.height), O = Math.ceil((u.fontStyle === "italic" ? 2 : 1) * S);
      if (m >= h - P * o) {
        if (m === 0)
          throw new Error(`[BitmapFont] textureHeight ${h}px is too small (fontFamily: '${u.fontFamily}', fontSize: ${u.fontSize}px, char: '${w}')`);
        --C, g = null, y = null, v = null, m = 0, p = 0, _ = 0;
        continue;
      }
      if (_ = Math.max(P + I.fontProperties.descent, _), O * o + p >= d) {
        if (p === 0)
          throw new Error(`[BitmapFont] textureWidth ${a}px is too small (fontFamily: '${u.fontFamily}', fontSize: ${u.fontSize}px, char: '${w}')`);
        --C, m += _ * o, m = Math.ceil(m), p = 0, _ = 0;
        continue;
      }
      L_(g, y, I, p, m, o, u);
      const M = bs(I.text);
      f.char.push({
        id: M,
        page: x.length - 1,
        x: p / o,
        y: m / o,
        width: O,
        height: P,
        xoffset: 0,
        yoffset: 0,
        xadvance: S - (u.dropShadow ? u.dropShadowDistance : 0) - (u.stroke ? u.strokeThickness : 0)
      }), p += (O + 2 * n) * o, p = Math.ceil(p);
    }
    if (!(i != null && i.skipKerning))
      for (let C = 0, w = c.length; C < w; C++) {
        const I = c[C];
        for (let S = 0; S < w; S++) {
          const P = c[S], O = y.measureText(I).width, M = y.measureText(P).width, E = y.measureText(I + P).width - (O + M);
          E && f.kerning.push({
            first: bs(I),
            second: bs(P),
            amount: E
          });
        }
      }
    const T = new _e(f, x, !0);
    return _e.available[t] !== void 0 && _e.uninstall(t), _e.available[t] = T, T;
  }
};
ke.ALPHA = [["a", "z"], ["A", "Z"], " "], /**
* This character set includes all decimal digits (from 0 to 9).
* @type {string[][]}
* @example
* BitmapFont.from('ExampleFont', style, { chars: BitmapFont.NUMERIC })
*/
ke.NUMERIC = [["0", "9"]], /**
* This character set is the union of `BitmapFont.ALPHA` and `BitmapFont.NUMERIC`.
* @type {string[][]}
*/
ke.ALPHANUMERIC = [["a", "z"], ["A", "Z"], ["0", "9"], " "], /**
* This character set consists of all the ASCII table.
* @member {string[][]}
* @see http://www.asciitable.com/
*/
ke.ASCII = [[" ", "~"]], /**
* Collection of default options when using `BitmapFont.from`.
* @property {number} [resolution=1] -
* @property {number} [textureWidth=512] -
* @property {number} [textureHeight=512] -
* @property {number} [padding=4] -
* @property {string|string[]|string[][]} chars = PIXI.BitmapFont.ALPHANUMERIC
*/
ke.defaultOptions = {
  resolution: 1,
  textureWidth: 512,
  textureHeight: 512,
  padding: 4,
  chars: ke.ALPHANUMERIC
}, /** Collection of available/installed fonts. */
ke.available = {};
let Ue = ke;
var k_ = `// Pixi texture info\r
varying vec2 vTextureCoord;\r
uniform sampler2D uSampler;\r
\r
// Tint\r
uniform vec4 uColor;\r
\r
// on 2D applications fwidth is screenScale / glyphAtlasScale * distanceFieldRange\r
uniform float uFWidth;\r
\r
void main(void) {\r
\r
  // To stack MSDF and SDF we need a non-pre-multiplied-alpha texture.\r
  vec4 texColor = texture2D(uSampler, vTextureCoord);\r
\r
  // MSDF\r
  float median = texColor.r + texColor.g + texColor.b -\r
                  min(texColor.r, min(texColor.g, texColor.b)) -\r
                  max(texColor.r, max(texColor.g, texColor.b));\r
  // SDF\r
  median = min(median, texColor.a);\r
\r
  float screenPxDistance = uFWidth * (median - 0.5);\r
  float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);\r
  if (median < 0.01) {\r
    alpha = 0.0;\r
  } else if (median > 0.99) {\r
    alpha = 1.0;\r
  }\r
\r
  // Gamma correction for coverage-like alpha\r
  float luma = dot(uColor.rgb, vec3(0.299, 0.587, 0.114));\r
  float gamma = mix(1.0, 1.0 / 2.2, luma);\r
  float coverage = pow(uColor.a * alpha, gamma);  \r
\r
  // NPM Textures, NPM outputs\r
  gl_FragColor = vec4(uColor.rgb, coverage);\r
}\r
`, U_ = `// Mesh material default fragment\r
attribute vec2 aVertexPosition;\r
attribute vec2 aTextureCoord;\r
\r
uniform mat3 projectionMatrix;\r
uniform mat3 translationMatrix;\r
uniform mat3 uTextureMatrix;\r
\r
varying vec2 vTextureCoord;\r
\r
void main(void)\r
{\r
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r
\r
    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;\r
}\r
`;
const nl = [], ol = [], al = [], G_ = class Su extends de {
  /**
   * @param text - A string that you would like the text to display.
   * @param style - The style parameters.
   * @param {string} style.fontName - The installed BitmapFont name.
   * @param {number} [style.fontSize] - The size of the font in pixels, e.g. 24. If undefined,
   *.     this will default to the BitmapFont size.
   * @param {string} [style.align='left'] - Alignment for multiline text ('left', 'center', 'right' or 'justify'),
   *      does not affect single line text.
   * @param {PIXI.ColorSource} [style.tint=0xFFFFFF] - The tint color.
   * @param {number} [style.letterSpacing=0] - The amount of spacing between letters.
   * @param {number} [style.maxWidth=0] - The max width of the text before line wrapping.
   */
  constructor(t, e = {}) {
    super();
    const { align: i, tint: s, maxWidth: n, letterSpacing: o, fontName: a, fontSize: h } = Object.assign(
      {},
      Su.styleDefaults,
      e
    );
    if (!Ue.available[a])
      throw new Error(`Missing BitmapFont "${a}"`);
    this._activePagesMeshData = [], this._textWidth = 0, this._textHeight = 0, this._align = i, this._tintColor = new pt(s), this._font = void 0, this._fontName = a, this._fontSize = h, this.text = t, this._maxWidth = n, this._maxLineHeight = 0, this._letterSpacing = o, this._anchor = new Be(() => {
      this.dirty = !0;
    }, this, 0, 0), this._roundPixels = H.ROUND_PIXELS, this.dirty = !0, this._resolution = H.RESOLUTION, this._autoResolution = !0, this._textureCache = {};
  }
  /** Renders text and updates it when needed. This should only be called if the BitmapFont is regenerated. */
  updateText() {
    var O;
    const t = Ue.available[this._fontName], e = this.fontSize, i = e / t.size, s = new lt(), n = [], o = [], a = [], h = this._text.replace(/(?:\r\n|\r)/g, `
`) || " ", l = Au(h), c = this._maxWidth * t.size / e, u = t.distanceFieldType === "none" ? nl : ol;
    let d = null, f = 0, p = 0, m = 0, g = -1, y = 0, v = 0, _ = 0, x = 0;
    for (let M = 0; M < l.length; M++) {
      const E = l[M], A = bs(E);
      if (/(?:\s)/.test(E) && (g = M, y = f, x++), E === "\r" || E === `
`) {
        o.push(f), a.push(-1), p = Math.max(p, f), ++m, ++v, s.x = 0, s.y += t.lineHeight, d = null, x = 0;
        continue;
      }
      const R = t.chars[A];
      if (!R)
        continue;
      d && R.kerning[d] && (s.x += R.kerning[d]);
      const X = al.pop() || {
        texture: j.EMPTY,
        line: 0,
        charCode: 0,
        prevSpaces: 0,
        position: new lt()
      };
      X.texture = R.texture, X.line = m, X.charCode = A, X.position.x = Math.round(s.x + R.xOffset + this._letterSpacing / 2), X.position.y = Math.round(s.y + R.yOffset), X.prevSpaces = x, n.push(X), f = X.position.x + Math.max(R.xAdvance - R.xOffset, R.texture.orig.width), s.x += R.xAdvance + this._letterSpacing, _ = Math.max(_, R.yOffset + R.texture.height), d = A, g !== -1 && c > 0 && s.x > c && (++v, Yr(n, 1 + g - v, 1 + M - g), M = g, g = -1, o.push(y), a.push(n.length > 0 ? n[n.length - 1].prevSpaces : 0), p = Math.max(p, y), m++, s.x = 0, s.y += t.lineHeight, d = null, x = 0);
    }
    const T = l[l.length - 1];
    T !== "\r" && T !== `
` && (/(?:\s)/.test(T) && (f = y), o.push(f), p = Math.max(p, f), a.push(-1));
    const C = [];
    for (let M = 0; M <= m; M++) {
      let E = 0;
      this._align === "right" ? E = p - o[M] : this._align === "center" ? E = (p - o[M]) / 2 : this._align === "justify" && (E = a[M] < 0 ? 0 : (p - o[M]) / a[M]), C.push(E);
    }
    const w = n.length, I = {}, S = [], P = this._activePagesMeshData;
    u.push(...P);
    for (let M = 0; M < w; M++) {
      const E = n[M].texture, A = E.baseTexture.uid;
      if (!I[A]) {
        let R = u.pop();
        if (!R) {
          const D = new c_();
          let N, q;
          t.distanceFieldType === "none" ? (N = new el(j.EMPTY), q = K.NORMAL) : (N = new el(
            j.EMPTY,
            { program: De.from(U_, k_), uniforms: { uFWidth: 0 } }
          ), q = K.NORMAL_NPM);
          const B = new tl(D, N);
          B.blendMode = q, R = {
            index: 0,
            indexCount: 0,
            vertexCount: 0,
            uvsCount: 0,
            total: 0,
            mesh: B,
            vertices: null,
            uvs: null,
            indices: null
          };
        }
        R.index = 0, R.indexCount = 0, R.vertexCount = 0, R.uvsCount = 0, R.total = 0;
        const { _textureCache: X } = this;
        X[A] = X[A] || new j(E.baseTexture), R.mesh.texture = X[A], R.mesh.tint = this._tintColor.value, S.push(R), I[A] = R;
      }
      I[A].total++;
    }
    for (let M = 0; M < P.length; M++)
      S.includes(P[M]) || this.removeChild(P[M].mesh);
    for (let M = 0; M < S.length; M++)
      S[M].mesh.parent !== this && this.addChild(S[M].mesh);
    this._activePagesMeshData = S;
    for (const M in I) {
      const E = I[M], A = E.total;
      if (!(((O = E.indices) == null ? void 0 : O.length) > 6 * A) || E.vertices.length < tl.BATCHABLE_SIZE * 2)
        E.vertices = new Float32Array(4 * 2 * A), E.uvs = new Float32Array(4 * 2 * A), E.indices = new Uint16Array(6 * A);
      else {
        const R = E.total, X = E.vertices;
        for (let D = R * 4 * 2; D < X.length; D++)
          X[D] = 0;
      }
      E.mesh.size = 6 * A;
    }
    for (let M = 0; M < w; M++) {
      const E = n[M];
      let A = E.position.x + C[E.line] * (this._align === "justify" ? E.prevSpaces : 1);
      this._roundPixels && (A = Math.round(A));
      const R = A * i, X = E.position.y * i, D = E.texture, N = I[D.baseTexture.uid], q = D.frame, B = D._uvs, L = N.index++;
      N.indices[L * 6 + 0] = 0 + L * 4, N.indices[L * 6 + 1] = 1 + L * 4, N.indices[L * 6 + 2] = 2 + L * 4, N.indices[L * 6 + 3] = 0 + L * 4, N.indices[L * 6 + 4] = 2 + L * 4, N.indices[L * 6 + 5] = 3 + L * 4, N.vertices[L * 8 + 0] = R, N.vertices[L * 8 + 1] = X, N.vertices[L * 8 + 2] = R + q.width * i, N.vertices[L * 8 + 3] = X, N.vertices[L * 8 + 4] = R + q.width * i, N.vertices[L * 8 + 5] = X + q.height * i, N.vertices[L * 8 + 6] = R, N.vertices[L * 8 + 7] = X + q.height * i, N.uvs[L * 8 + 0] = B.x0, N.uvs[L * 8 + 1] = B.y0, N.uvs[L * 8 + 2] = B.x1, N.uvs[L * 8 + 3] = B.y1, N.uvs[L * 8 + 4] = B.x2, N.uvs[L * 8 + 5] = B.y2, N.uvs[L * 8 + 6] = B.x3, N.uvs[L * 8 + 7] = B.y3;
    }
    this._textWidth = p * i, this._textHeight = (s.y + t.lineHeight) * i;
    for (const M in I) {
      const E = I[M];
      if (this.anchor.x !== 0 || this.anchor.y !== 0) {
        let D = 0;
        const N = this._textWidth * this.anchor.x, q = this._textHeight * this.anchor.y;
        for (let B = 0; B < E.total; B++)
          E.vertices[D++] -= N, E.vertices[D++] -= q, E.vertices[D++] -= N, E.vertices[D++] -= q, E.vertices[D++] -= N, E.vertices[D++] -= q, E.vertices[D++] -= N, E.vertices[D++] -= q;
      }
      this._maxLineHeight = _ * i;
      const A = E.mesh.geometry.getBuffer("aVertexPosition"), R = E.mesh.geometry.getBuffer("aTextureCoord"), X = E.mesh.geometry.getIndex();
      A.data = E.vertices, R.data = E.uvs, X.data = E.indices, A.update(), R.update(), X.update();
    }
    for (let M = 0; M < n.length; M++)
      al.push(n[M]);
    this._font = t, this.dirty = !1;
  }
  updateTransform() {
    this.validate(), this.containerUpdateTransform();
  }
  _render(t) {
    this._autoResolution && this._resolution !== t.resolution && (this._resolution = t.resolution, this.dirty = !0);
    const { distanceFieldRange: e, distanceFieldType: i, size: s } = Ue.available[this._fontName];
    if (i !== "none") {
      const { a: n, b: o, c: a, d: h } = this.worldTransform, l = Math.sqrt(n * n + o * o), c = Math.sqrt(a * a + h * h), u = (Math.abs(l) + Math.abs(c)) / 2, d = this.fontSize / s, f = t._view.resolution;
      for (const p of this._activePagesMeshData)
        p.mesh.shader.uniforms.uFWidth = u * e * d * f;
    }
    super._render(t);
  }
  /**
   * Validates text before calling parent's getLocalBounds
   * @returns - The rectangular bounding area
   */
  getLocalBounds() {
    return this.validate(), super.getLocalBounds();
  }
  /**
   * Updates text when needed
   * @private
   */
  validate() {
    const t = Ue.available[this._fontName];
    if (!t)
      throw new Error(`Missing BitmapFont "${this._fontName}"`);
    this._font !== t && (this.dirty = !0), this.dirty && this.updateText();
  }
  /**
   * The tint of the BitmapText object.
   * @default 0xffffff
   */
  get tint() {
    return this._tintColor.value;
  }
  set tint(t) {
    if (this.tint !== t) {
      this._tintColor.setValue(t);
      for (let e = 0; e < this._activePagesMeshData.length; e++)
        this._activePagesMeshData[e].mesh.tint = t;
    }
  }
  /**
   * The alignment of the BitmapText object.
   * @member {string}
   * @default 'left'
   */
  get align() {
    return this._align;
  }
  set align(t) {
    this._align !== t && (this._align = t, this.dirty = !0);
  }
  /** The name of the BitmapFont. */
  get fontName() {
    return this._fontName;
  }
  set fontName(t) {
    if (!Ue.available[t])
      throw new Error(`Missing BitmapFont "${t}"`);
    this._fontName !== t && (this._fontName = t, this.dirty = !0);
  }
  /** The size of the font to display. */
  get fontSize() {
    return this._fontSize ?? Ue.available[this._fontName].size;
  }
  set fontSize(t) {
    this._fontSize !== t && (this._fontSize = t, this.dirty = !0);
  }
  /**
   * The anchor sets the origin point of the text.
   *
   * The default is `(0,0)`, this means the text's origin is the top left.
   *
   * Setting the anchor to `(0.5,0.5)` means the text's origin is centered.
   *
   * Setting the anchor to `(1,1)` would mean the text's origin point will be the bottom right corner.
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(t) {
    typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
  }
  /** The text of the BitmapText object. */
  get text() {
    return this._text;
  }
  set text(t) {
    t = String(t ?? ""), this._text !== t && (this._text = t, this.dirty = !0);
  }
  /**
   * The max width of this bitmap text in pixels. If the text provided is longer than the
   * value provided, line breaks will be automatically inserted in the last whitespace.
   * Disable by setting the value to 0.
   */
  get maxWidth() {
    return this._maxWidth;
  }
  set maxWidth(t) {
    this._maxWidth !== t && (this._maxWidth = t, this.dirty = !0);
  }
  /**
   * The max line height. This is useful when trying to use the total height of the Text,
   * i.e. when trying to vertically align.
   * @readonly
   */
  get maxLineHeight() {
    return this.validate(), this._maxLineHeight;
  }
  /**
   * The width of the overall text, different from fontSize,
   * which is defined in the style object.
   * @readonly
   */
  get textWidth() {
    return this.validate(), this._textWidth;
  }
  /** Additional space between characters. */
  get letterSpacing() {
    return this._letterSpacing;
  }
  set letterSpacing(t) {
    this._letterSpacing !== t && (this._letterSpacing = t, this.dirty = !0);
  }
  /**
   * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
   * Advantages can include sharper image quality (like text) and faster rendering on canvas.
   * The main disadvantage is movement of objects may appear less smooth.
   * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}
   * @default PIXI.settings.ROUND_PIXELS
   */
  get roundPixels() {
    return this._roundPixels;
  }
  set roundPixels(t) {
    t !== this._roundPixels && (this._roundPixels = t, this.dirty = !0);
  }
  /**
   * The height of the overall text, different from fontSize,
   * which is defined in the style object.
   * @readonly
   */
  get textHeight() {
    return this.validate(), this._textHeight;
  }
  /**
   * The resolution / device pixel ratio of the canvas.
   *
   * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
   * @default 1
   */
  get resolution() {
    return this._resolution;
  }
  set resolution(t) {
    this._autoResolution = !1, this._resolution !== t && (this._resolution = t, this.dirty = !0);
  }
  destroy(t) {
    const { _textureCache: e } = this, i = Ue.available[this._fontName].distanceFieldType === "none" ? nl : ol;
    i.push(...this._activePagesMeshData);
    for (const s of this._activePagesMeshData)
      this.removeChild(s.mesh);
    this._activePagesMeshData = [], i.filter((s) => e[s.mesh.texture.baseTexture.uid]).forEach((s) => {
      s.mesh.texture = j.EMPTY;
    });
    for (const s in e)
      e[s].destroy(), delete e[s];
    this._font = null, this._tintColor = null, this._textureCache = null, super.destroy(t);
  }
};
G_.styleDefaults = {
  align: "left",
  tint: 16777215,
  maxWidth: 0,
  letterSpacing: 0
};
const H_ = [".xml", ".fnt"], V_ = {
  extension: {
    type: k.LoadParser,
    priority: fe.Normal
  },
  name: "loadBitmapFont",
  test(r) {
    return H_.includes(Rt.extname(r).toLowerCase());
  },
  async testParse(r) {
    return xs.test(r) || Wo.test(r);
  },
  async parse(r, t, e) {
    const i = xs.test(r) ? xs.parse(r) : Wo.parse(r), { src: s } = t, { page: n } = i, o = [];
    for (let l = 0; l < n.length; ++l) {
      const c = n[l].file;
      let u = Rt.join(Rt.dirname(s), c);
      u = Uo(u, s), o.push(u);
    }
    const a = await e.load(o), h = o.map((l) => a[l]);
    return Ue.install(i, h, !0);
  },
  async load(r, t) {
    return (await H.ADAPTER.fetch(r)).text();
  },
  unload(r) {
    r.destroy();
  }
};
z.add(V_);
const jo = class Gr extends Qe {
  constructor() {
    super(...arguments), this._fonts = [], this._overrides = [], this._stylesheet = "", this.fontsDirty = !1;
  }
  /**
   * Convert a TextStyle to HTMLTextStyle
   * @param originalStyle
   * @example
   * import {TextStyle } from 'pixi.js';
   * import {HTMLTextStyle} from '@pixi/text-html';
   * const style = new TextStyle();
   * const htmlStyle = HTMLTextStyle.from(style);
   */
  static from(t) {
    return new Gr(
      Object.keys(Gr.defaultOptions).reduce((e, i) => ({ ...e, [i]: t[i] }), {})
    );
  }
  /** Clear the current font */
  cleanFonts() {
    this._fonts.length > 0 && (this._fonts.forEach((t) => {
      URL.revokeObjectURL(t.src), t.refs--, t.refs === 0 && (t.fontFace && document.fonts.delete(t.fontFace), delete Gr.availableFonts[t.originalUrl]);
    }), this.fontFamily = "Arial", this._fonts.length = 0, this.styleID++, this.fontsDirty = !0);
  }
  /**
   * Because of how HTMLText renders, fonts need to be imported
   * @param url
   * @param options
   */
  loadFont(t, e = {}) {
    const { availableFonts: i } = Gr;
    if (i[t]) {
      const s = i[t];
      return this._fonts.push(s), s.refs++, this.styleID++, this.fontsDirty = !0, Promise.resolve();
    }
    return H.ADAPTER.fetch(t).then((s) => s.blob()).then(async (s) => new Promise((n, o) => {
      const a = URL.createObjectURL(s), h = new FileReader();
      h.onload = () => n([a, h.result]), h.onerror = o, h.readAsDataURL(s);
    })).then(async ([s, n]) => {
      const o = Object.assign({
        family: Rt.basename(t, Rt.extname(t)),
        weight: "normal",
        style: "normal",
        display: "auto",
        src: s,
        dataSrc: n,
        refs: 1,
        originalUrl: t,
        fontFace: null
      }, e);
      i[t] = o, this._fonts.push(o), this.styleID++;
      const a = new FontFace(o.family, `url(${o.src})`, {
        weight: o.weight,
        style: o.style,
        display: o.display
      });
      o.fontFace = a, await a.load(), document.fonts.add(a), await document.fonts.ready, this.styleID++, this.fontsDirty = !0;
    });
  }
  /**
   * Add a style override, this can be any CSS property
   * it will override any built-in style. This is the
   * property and the value as a string (e.g., `color: red`).
   * This will override any other internal style.
   * @param {string} value - CSS style(s) to add.
   * @example
   * style.addOverride('background-color: red');
   */
  addOverride(...t) {
    const e = t.filter((i) => !this._overrides.includes(i));
    e.length > 0 && (this._overrides.push(...e), this.styleID++);
  }
  /**
   * Remove any overrides that match the value.
   * @param {string} value - CSS style to remove.
   * @example
   * style.removeOverride('background-color: red');
   */
  removeOverride(...t) {
    const e = t.filter((i) => this._overrides.includes(i));
    e.length > 0 && (this._overrides = this._overrides.filter((i) => !e.includes(i)), this.styleID++);
  }
  /**
   * Internally converts all of the style properties into CSS equivalents.
   * @param scale
   * @returns The CSS style string, for setting `style` property of root HTMLElement.
   */
  toCSS(t) {
    return [
      `transform: scale(${t})`,
      "transform-origin: top left",
      "display: inline-block",
      `color: ${this.normalizeColor(this.fill)}`,
      `font-size: ${this.fontSize}px`,
      `font-family: ${this.fontFamily}`,
      `font-weight: ${this.fontWeight}`,
      `font-style: ${this.fontStyle}`,
      `font-variant: ${this.fontVariant}`,
      `letter-spacing: ${this.letterSpacing}px`,
      `text-align: ${this.align}`,
      `padding: ${this.padding}px`,
      `white-space: ${this.whiteSpace}`,
      ...this.lineHeight ? [`line-height: ${this.lineHeight}px`] : [],
      ...this.wordWrap ? [
        `word-wrap: ${this.breakWords ? "break-all" : "break-word"}`,
        `max-width: ${this.wordWrapWidth}px`
      ] : [],
      ...this.strokeThickness ? [
        `-webkit-text-stroke-width: ${this.strokeThickness}px`,
        `-webkit-text-stroke-color: ${this.normalizeColor(this.stroke)}`,
        `text-stroke-width: ${this.strokeThickness}px`,
        `text-stroke-color: ${this.normalizeColor(this.stroke)}`,
        "paint-order: stroke"
      ] : [],
      ...this.dropShadow ? [this.dropShadowToCSS()] : [],
      ...this._overrides
    ].join(";");
  }
  /** Get the font CSS styles from the loaded font, If available. */
  toGlobalCSS() {
    return this._fonts.reduce((t, e) => `${t}
            @font-face {
                font-family: "${e.family}";
                src: url('${e.dataSrc}');
                font-weight: ${e.weight};
                font-style: ${e.style};
                font-display: ${e.display};
            }`, this._stylesheet);
  }
  /** Internal stylesheet contents, useful for creating rules for rendering */
  get stylesheet() {
    return this._stylesheet;
  }
  set stylesheet(t) {
    this._stylesheet !== t && (this._stylesheet = t, this.styleID++);
  }
  /**
   * Convert numerical colors into hex-strings
   * @param color
   */
  normalizeColor(t) {
    return Array.isArray(t) && (t = Bm(t)), typeof t == "number" ? Mm(t) : t;
  }
  /** Convert the internal drop-shadow settings to CSS text-shadow */
  dropShadowToCSS() {
    let t = this.normalizeColor(this.dropShadowColor);
    const e = this.dropShadowAlpha, i = Math.round(Math.cos(this.dropShadowAngle) * this.dropShadowDistance), s = Math.round(Math.sin(this.dropShadowAngle) * this.dropShadowDistance);
    t.startsWith("#") && e < 1 && (t += (e * 255 | 0).toString(16).padStart(2, "0"));
    const n = `${i}px ${s}px`;
    return this.dropShadowBlur > 0 ? `text-shadow: ${n} ${this.dropShadowBlur}px ${t}` : `text-shadow: ${n} ${t}`;
  }
  /** Resets all properties to the defaults specified in TextStyle.prototype._default */
  reset() {
    Object.assign(this, Gr.defaultOptions);
  }
  /**
   * Called after the image is loaded but before drawing to the canvas.
   * Mostly used to handle Safari's font loading bug.
   * @ignore
   */
  onBeforeDraw() {
    const { fontsDirty: t } = this;
    return this.fontsDirty = !1, this.isSafari && this._fonts.length > 0 && t ? new Promise((e) => setTimeout(e, 100)) : Promise.resolve();
  }
  /**
   * Proving that Safari is the new IE
   * @ignore
   */
  get isSafari() {
    const { userAgent: t } = H.ADAPTER.getNavigator();
    return /^((?!chrome|android).)*safari/i.test(t);
  }
  set fillGradientStops(t) {
    console.warn("[HTMLTextStyle] fillGradientStops is not supported by HTMLText");
  }
  get fillGradientStops() {
    return super.fillGradientStops;
  }
  set fillGradientType(t) {
    console.warn("[HTMLTextStyle] fillGradientType is not supported by HTMLText");
  }
  get fillGradientType() {
    return super.fillGradientType;
  }
  set miterLimit(t) {
    console.warn("[HTMLTextStyle] miterLimit is not supported by HTMLText");
  }
  get miterLimit() {
    return super.miterLimit;
  }
  set trim(t) {
    console.warn("[HTMLTextStyle] trim is not supported by HTMLText");
  }
  get trim() {
    return super.trim;
  }
  set textBaseline(t) {
    console.warn("[HTMLTextStyle] textBaseline is not supported by HTMLText");
  }
  get textBaseline() {
    return super.textBaseline;
  }
  set leading(t) {
    console.warn("[HTMLTextStyle] leading is not supported by HTMLText");
  }
  get leading() {
    return super.leading;
  }
  set lineJoin(t) {
    console.warn("[HTMLTextStyle] lineJoin is not supported by HTMLText");
  }
  get lineJoin() {
    return super.lineJoin;
  }
};
jo.availableFonts = {}, /**
* List of default options, these are largely the same as TextStyle,
* with the exception of whiteSpace, which is set to 'normal' by default.
*/
jo.defaultOptions = {
  /** Align */
  align: "left",
  /** Break words */
  breakWords: !1,
  /** Drop shadow */
  dropShadow: !1,
  /** Drop shadow alpha */
  dropShadowAlpha: 1,
  /**
   * Drop shadow angle
   * @type {number}
   * @default Math.PI / 6
   */
  dropShadowAngle: Math.PI / 6,
  /** Drop shadow blur */
  dropShadowBlur: 0,
  /** Drop shadow color */
  dropShadowColor: "black",
  /** Drop shadow distance */
  dropShadowDistance: 5,
  /** Fill */
  fill: "black",
  /** Font family */
  fontFamily: "Arial",
  /** Font size */
  fontSize: 26,
  /** Font style */
  fontStyle: "normal",
  /** Font variant */
  fontVariant: "normal",
  /** Font weight */
  fontWeight: "normal",
  /** Letter spacing */
  letterSpacing: 0,
  /** Line height */
  lineHeight: 0,
  /** Padding */
  padding: 0,
  /** Stroke */
  stroke: "black",
  /** Stroke thickness */
  strokeThickness: 0,
  /** White space */
  whiteSpace: "normal",
  /** Word wrap */
  wordWrap: !1,
  /** Word wrap width */
  wordWrapWidth: 100
};
let zn = jo;
const hs = class Hr extends ii {
  /**
   * @param {string} [text] - Text contents
   * @param {PIXI.HTMLTextStyle|PIXI.TextStyle|PIXI.ITextStyle} [style] - Style setting to use.
   *        Strongly recommend using an HTMLTextStyle object. Providing a PIXI.TextStyle
   *        will convert the TextStyle to an HTMLTextStyle and will no longer be linked.
   */
  constructor(t = "", e = {}) {
    super(j.EMPTY), this._text = null, this._style = null, this._autoResolution = !0, this.localStyleID = -1, this.dirty = !1, this._updateID = 0, this.ownsStyle = !1;
    const i = new Image(), s = j.from(i, {
      scaleMode: H.SCALE_MODE,
      resourceOptions: {
        autoLoad: !1
      }
    });
    s.orig = new tt(), s.trim = new tt(), this.texture = s;
    const n = "http://www.w3.org/2000/svg", o = "http://www.w3.org/1999/xhtml", a = document.createElementNS(n, "svg"), h = document.createElementNS(n, "foreignObject"), l = document.createElementNS(o, "div"), c = document.createElementNS(o, "style");
    h.setAttribute("width", "10000"), h.setAttribute("height", "10000"), h.style.overflow = "hidden", a.appendChild(h), this.maxWidth = Hr.defaultMaxWidth, this.maxHeight = Hr.defaultMaxHeight, this._domElement = l, this._styleElement = c, this._svgRoot = a, this._foreignObject = h, this._foreignObject.appendChild(c), this._foreignObject.appendChild(l), this._image = i, this._loadImage = new Image(), this._autoResolution = Hr.defaultAutoResolution, this._resolution = Hr.defaultResolution ?? H.RESOLUTION, this.text = t, this.style = e;
  }
  /**
   * Calculate the size of the output text without actually drawing it.
   * This includes the `padding` in the `style` object.
   * This can be used as a fast-pass to do things like text-fitting.
   * @param {object} [overrides] - Overrides for the text, style, and resolution.
   * @param {string} [overrides.text] - The text to measure, if not specified, the current text is used.
   * @param {PIXI.HTMLTextStyle} [overrides.style] - The style to measure, if not specified, the current style is used.
   * @param {number} [overrides.resolution] - The resolution to measure, if not specified, the current resolution is used.
   * @returns {PIXI.ISize} Width and height of the measured text.
   */
  measureText(t) {
    var c, u;
    const { text: e, style: i, resolution: s } = Object.assign({
      text: this._text,
      style: this._style,
      resolution: this._resolution
    }, t);
    Object.assign(this._domElement, {
      innerHTML: e,
      style: i.toCSS(s)
    }), this._styleElement.textContent = i.toGlobalCSS(), document.body.appendChild(this._svgRoot);
    const n = this._domElement.getBoundingClientRect();
    this._svgRoot.remove();
    const { width: o, height: a } = n;
    (o > this.maxWidth || a > this.maxHeight) && console.warn("[HTMLText] Large expanse of text, increase HTMLText.maxWidth or HTMLText.maxHeight property.");
    const h = Math.min(this.maxWidth, Math.ceil(o)), l = Math.min(this.maxHeight, Math.ceil(a));
    return this._svgRoot.setAttribute("width", h.toString()), this._svgRoot.setAttribute("height", l.toString()), e !== this._text && (this._domElement.innerHTML = this._text), i !== this._style && (Object.assign(this._domElement, { style: (c = this._style) == null ? void 0 : c.toCSS(s) }), this._styleElement.textContent = (u = this._style) == null ? void 0 : u.toGlobalCSS()), {
      width: h + i.padding * 2,
      height: l + i.padding * 2
    };
  }
  /**
   * Manually refresh the text.
   * @public
   * @param {boolean} respectDirty - Whether to abort updating the
   *        text if the Text isn't dirty and the function is called.
   */
  async updateText(t = !0) {
    const { style: e, _image: i, _loadImage: s } = this;
    if (this.localStyleID !== e.styleID && (this.dirty = !0, this.localStyleID = e.styleID), !this.dirty && t)
      return;
    const { width: n, height: o } = this.measureText();
    i.width = s.width = Math.ceil(Math.max(1, n)), i.height = s.height = Math.ceil(Math.max(1, o)), this._updateID++;
    const a = this._updateID;
    await new Promise((h) => {
      s.onload = async () => {
        if (a < this._updateID) {
          h();
          return;
        }
        await e.onBeforeDraw(), i.src = s.src, s.onload = null, s.src = "", this.updateTexture(), h();
      };
      const l = new XMLSerializer().serializeToString(this._svgRoot);
      s.src = `data:image/svg+xml;charset=utf8,${encodeURIComponent(l)}`;
    });
  }
  /** The raw image element that is rendered under-the-hood. */
  get source() {
    return this._image;
  }
  /**
   * Update the texture resource.
   * @private
   */
  updateTexture() {
    const { style: t, texture: e, _image: i, resolution: s } = this, { padding: n } = t, { baseTexture: o } = e;
    e.trim.width = e._frame.width = i.width / s, e.trim.height = e._frame.height = i.height / s, e.trim.x = -n, e.trim.y = -n, e.orig.width = e._frame.width - n * 2, e.orig.height = e._frame.height - n * 2, this._onTextureUpdate(), o.setRealSize(i.width, i.height, s), this.dirty = !1;
  }
  /**
   * Renders the object using the WebGL renderer
   * @param {PIXI.Renderer} renderer - The renderer
   * @private
   */
  _render(t) {
    this._autoResolution && this._resolution !== t.resolution && (this._resolution = t.resolution, this.dirty = !0), this.updateText(!0), super._render(t);
  }
  /**
   * Renders the object using the Canvas Renderer.
   * @private
   * @param {PIXI.CanvasRenderer} renderer - The renderer
   */
  _renderCanvas(t) {
    this._autoResolution && this._resolution !== t.resolution && (this._resolution = t.resolution, this.dirty = !0), this.updateText(!0), super._renderCanvas(t);
  }
  /**
   * Get the local bounds.
   * @param {PIXI.Rectangle} rect - Input rectangle.
   * @returns {PIXI.Rectangle} Local bounds
   */
  getLocalBounds(t) {
    return this.updateText(!0), super.getLocalBounds(t);
  }
  _calculateBounds() {
    this.updateText(!0), this.calculateVertices(), this._bounds.addQuad(this.vertexData);
  }
  /**
   * Handle dirty style changes
   * @private
   */
  _onStyleChange() {
    this.dirty = !0;
  }
  /**
   * Destroy this Text object. Don't use after calling.
   * @param {boolean|object} options - Same as Sprite destroy options.
   */
  destroy(t) {
    var i, s, n, o, a;
    typeof t == "boolean" && (t = { children: t }), t = Object.assign({}, Hr.defaultDestroyOptions, t), super.destroy(t);
    const e = null;
    this.ownsStyle && ((i = this._style) == null || i.cleanFonts()), this._style = e, (s = this._svgRoot) == null || s.remove(), this._svgRoot = e, (n = this._domElement) == null || n.remove(), this._domElement = e, (o = this._foreignObject) == null || o.remove(), this._foreignObject = e, (a = this._styleElement) == null || a.remove(), this._styleElement = e, this._loadImage.src = "", this._loadImage.onload = null, this._loadImage = e, this._image.src = "", this._image = e;
  }
  /**
   * Get the width in pixels.
   * @member {number}
   */
  get width() {
    return this.updateText(!0), Math.abs(this.scale.x) * this._image.width / this.resolution;
  }
  set width(t) {
    this.updateText(!0);
    const e = je(this.scale.x) || 1;
    this.scale.x = e * t / this._image.width / this.resolution, this._width = t;
  }
  /**
   * Get the height in pixels.
   * @member {number}
   */
  get height() {
    return this.updateText(!0), Math.abs(this.scale.y) * this._image.height / this.resolution;
  }
  set height(t) {
    this.updateText(!0);
    const e = je(this.scale.y) || 1;
    this.scale.y = e * t / this._image.height / this.resolution, this._height = t;
  }
  /** The base style to render with text. */
  get style() {
    return this._style;
  }
  set style(t) {
    this._style !== t && (t = t || {}, t instanceof zn ? (this.ownsStyle = !1, this._style = t) : t instanceof Qe ? (console.warn("[HTMLText] Cloning TextStyle, if this is not what you want, use HTMLTextStyle"), this.ownsStyle = !0, this._style = zn.from(t)) : (this.ownsStyle = !0, this._style = new zn(t)), this.localStyleID = -1, this.dirty = !0);
  }
  /**
   * Contents of text. This can be HTML text and include tags.
   * @example
   * const text = new HTMLText('This is a <em>styled</em> text!');
   * @member {string}
   */
  get text() {
    return this._text;
  }
  set text(t) {
    t = String(t === "" || t === null || t === void 0 ? " " : t), t = this.sanitiseText(t), this._text !== t && (this._text = t, this.dirty = !0);
  }
  /**
   * The resolution / device pixel ratio of the canvas.
   * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
   * @member {number}
   * @default 1
   */
  get resolution() {
    return this._resolution;
  }
  set resolution(t) {
    this._autoResolution = !1, this._resolution !== t && (this._resolution = t, this.dirty = !0);
  }
  /**
   * Sanitise text - replace `<br>` with `<br/>`, `&nbsp;` with `&#160;`
   * @param text
   * @see https://www.sitepoint.com/community/t/xhtml-1-0-transitional-xml-parsing-error-entity-nbsp-not-defined/3392/3
   */
  sanitiseText(t) {
    return t.replace(/<br>/gi, "<br/>").replace(/<hr>/gi, "<hr/>").replace(/&nbsp;/gi, "&#160;");
  }
};
hs.defaultDestroyOptions = {
  texture: !0,
  children: !1,
  baseTexture: !0
}, /** Default maxWidth, set at construction */
hs.defaultMaxWidth = 2024, /** Default maxHeight, set at construction */
hs.defaultMaxHeight = 2024, /** Default autoResolution for all HTMLText objects */
hs.defaultAutoResolution = !0;
var X_ = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, hl = {}, z_ = {
  get exports() {
    return hl;
  },
  set exports(r) {
    hl = r;
  }
};
/*!
 * d-path-parser - v1.0.0
 * by Massimo Artizzu (MaxArt2501)
 *
 * https://github.com/MaxArt2501/d-path-parser
 *
 * Licensed under the MIT License
 * See LICENSE for details
 */
(function(r, t) {
  (function(e, i) {
    r.exports = i();
  })(X_, function() {
    return function(i) {
      for (var s = {
        command: /\s*([achlmqstvz])/gi,
        number: /\s*([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/gi,
        comma: /\s*(?:(,)|\s)/g,
        flag: /\s*([01])/g
      }, n = {
        number: function(m) {
          return +f("number", m);
        },
        "coordinate pair": function(m) {
          var g = f("number", m);
          if (g === null && !m)
            return null;
          f("comma");
          var y = f("number", !0);
          return { x: +g, y: +y };
        },
        "arc definition": function(m) {
          var g = n["coordinate pair"](m);
          if (!g && !m)
            return null;
          f("comma");
          var y = +f("number", !0);
          f("comma", !0);
          var v = !!+f("flag", !0);
          f("comma");
          var _ = !!+f("flag", !0);
          f("comma");
          var x = n["coordinate pair"](!0);
          return {
            radii: g,
            rotation: y,
            large: v,
            clockwise: _,
            end: x
          };
        }
      }, o = 0, a = []; o < i.length; ) {
        var h = f("command"), l = h.toUpperCase(), c = h !== l, u;
        switch (l) {
          case "M":
            u = p("coordinate pair").map(function(m, g) {
              return g === 1 && (h = c ? "l" : "L"), d({ end: m });
            });
            break;
          case "L":
          case "T":
            u = p("coordinate pair").map(function(m) {
              return d({ end: m });
            });
            break;
          case "C":
            if (u = p("coordinate pair"), u.length % 3)
              throw Error("Expected coordinate pair triplet at position " + o);
            u = u.reduce(function(m, g, y) {
              var v = y % 3;
              if (!v)
                m.push(d({ cp1: g }));
              else {
                var _ = m[m.length - 1];
                _[v === 1 ? "cp2" : "end"] = g;
              }
              return m;
            }, []);
            break;
          case "Q":
          case "S":
            if (u = p("coordinate pair"), u.length & 1)
              throw Error("Expected coordinate pair couple at position " + o);
            u = u.reduce(function(m, g, y) {
              var v = y & 1;
              if (!v)
                m.push(d({ cp: g }));
              else {
                var _ = m[m.length - 1];
                _.end = g;
              }
              return m;
            }, []);
            break;
          case "H":
          case "V":
            u = p("number").map(function(m) {
              return d({ value: m });
            });
            break;
          case "A":
            u = p("arc definition").map(d);
            break;
          case "Z":
            u = [{ code: "Z" }];
            break;
        }
        a.push.apply(a, u);
      }
      return a;
      function d(m) {
        return m.code = h, m.relative = c, m;
      }
      function f(m, g) {
        s[m].lastIndex = o;
        var y = s[m].exec(i);
        if (!y || y.index !== o) {
          if (!g)
            return null;
          throw Error("Expected " + m + " at position " + o);
        }
        return o = s[m].lastIndex, y[1];
      }
      function p(m) {
        for (var g = [], y, v = !0; y = n[m](v); )
          g.push(y), v = !!f("comma");
        return g;
      }
    };
  });
})(z_);
var W_ = {
  aliceblue: "f0f8ff",
  antiquewhite: "faebd7",
  aqua: "0ff",
  aquamarine: "7fffd4",
  azure: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "000",
  blanchedalmond: "ffebcd",
  blue: "00f",
  blueviolet: "8a2be2",
  brown: "a52a2a",
  burlywood: "deb887",
  burntsienna: "ea7e5d",
  cadetblue: "5f9ea0",
  chartreuse: "7fff00",
  chocolate: "d2691e",
  coral: "ff7f50",
  cornflowerblue: "6495ed",
  cornsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "0ff",
  darkblue: "00008b",
  darkcyan: "008b8b",
  darkgoldenrod: "b8860b",
  darkgray: "a9a9a9",
  darkgreen: "006400",
  darkgrey: "a9a9a9",
  darkkhaki: "bdb76b",
  darkmagenta: "8b008b",
  darkolivegreen: "556b2f",
  darkorange: "ff8c00",
  darkorchid: "9932cc",
  darkred: "8b0000",
  darksalmon: "e9967a",
  darkseagreen: "8fbc8f",
  darkslateblue: "483d8b",
  darkslategray: "2f4f4f",
  darkslategrey: "2f4f4f",
  darkturquoise: "00ced1",
  darkviolet: "9400d3",
  deeppink: "ff1493",
  deepskyblue: "00bfff",
  dimgray: "696969",
  dimgrey: "696969",
  dodgerblue: "1e90ff",
  firebrick: "b22222",
  floralwhite: "fffaf0",
  forestgreen: "228b22",
  fuchsia: "f0f",
  gainsboro: "dcdcdc",
  ghostwhite: "f8f8ff",
  gold: "ffd700",
  goldenrod: "daa520",
  gray: "808080",
  green: "008000",
  greenyellow: "adff2f",
  grey: "808080",
  honeydew: "f0fff0",
  hotpink: "ff69b4",
  indianred: "cd5c5c",
  indigo: "4b0082",
  ivory: "fffff0",
  khaki: "f0e68c",
  lavender: "e6e6fa",
  lavenderblush: "fff0f5",
  lawngreen: "7cfc00",
  lemonchiffon: "fffacd",
  lightblue: "add8e6",
  lightcoral: "f08080",
  lightcyan: "e0ffff",
  lightgoldenrodyellow: "fafad2",
  lightgray: "d3d3d3",
  lightgreen: "90ee90",
  lightgrey: "d3d3d3",
  lightpink: "ffb6c1",
  lightsalmon: "ffa07a",
  lightseagreen: "20b2aa",
  lightskyblue: "87cefa",
  lightslategray: "789",
  lightslategrey: "789",
  lightsteelblue: "b0c4de",
  lightyellow: "ffffe0",
  lime: "0f0",
  limegreen: "32cd32",
  linen: "faf0e6",
  magenta: "f0f",
  maroon: "800000",
  mediumaquamarine: "66cdaa",
  mediumblue: "0000cd",
  mediumorchid: "ba55d3",
  mediumpurple: "9370db",
  mediumseagreen: "3cb371",
  mediumslateblue: "7b68ee",
  mediumspringgreen: "00fa9a",
  mediumturquoise: "48d1cc",
  mediumvioletred: "c71585",
  midnightblue: "191970",
  mintcream: "f5fffa",
  mistyrose: "ffe4e1",
  moccasin: "ffe4b5",
  navajowhite: "ffdead",
  navy: "000080",
  oldlace: "fdf5e6",
  olive: "808000",
  olivedrab: "6b8e23",
  orange: "ffa500",
  orangered: "ff4500",
  orchid: "da70d6",
  palegoldenrod: "eee8aa",
  palegreen: "98fb98",
  paleturquoise: "afeeee",
  palevioletred: "db7093",
  papayawhip: "ffefd5",
  peachpuff: "ffdab9",
  peru: "cd853f",
  pink: "ffc0cb",
  plum: "dda0dd",
  powderblue: "b0e0e6",
  purple: "800080",
  rebeccapurple: "663399",
  red: "f00",
  rosybrown: "bc8f8f",
  royalblue: "4169e1",
  saddlebrown: "8b4513",
  salmon: "fa8072",
  sandybrown: "f4a460",
  seagreen: "2e8b57",
  seashell: "fff5ee",
  sienna: "a0522d",
  silver: "c0c0c0",
  skyblue: "87ceeb",
  slateblue: "6a5acd",
  slategray: "708090",
  slategrey: "708090",
  snow: "fffafa",
  springgreen: "00ff7f",
  steelblue: "4682b4",
  tan: "d2b48c",
  teal: "008080",
  thistle: "d8bfd8",
  tomato: "ff6347",
  turquoise: "40e0d0",
  violet: "ee82ee",
  wheat: "f5deb3",
  white: "fff",
  whitesmoke: "f5f5f5",
  yellow: "ff0",
  yellowgreen: "9acd32"
};
j_(W_);
function j_(r) {
  var t = {};
  for (var e in r)
    r.hasOwnProperty(e) && (t[r[e]] = e);
  return t;
}
var qt = /* @__PURE__ */ ((r) => (r.ELLIPSE = "ELLIPSE", r.POLYGON = "POLYGON", r.RECTANGLE = "RECTANGLE", r.FREEHAND = "FREEHAND", r))(qt || {});
const en = (r, t) => t, Iu = (r) => {
  let t = 1 / 0, e = 1 / 0, i = -1 / 0, s = -1 / 0;
  return r.forEach(([n, o]) => {
    t = Math.min(t, n), e = Math.min(e, o), i = Math.max(i, n), s = Math.max(s, o);
  }), { minX: t, minY: e, maxX: i, maxY: s };
}, $_ = {
  area: (r) => Math.PI * r.geometry.rx * r.geometry.ry,
  intersects: (r, t, e) => {
    const { cx: i, cy: s, rx: n, ry: o } = r.geometry, a = 0, h = Math.cos(a), l = Math.sin(a), c = t - i, u = e - s, d = h * c + l * u, f = l * c - h * u;
    return d * d / (n * n) + f * f / (o * o) <= 1;
  }
};
en(qt.ELLIPSE, $_);
const Y_ = {
  area: (r) => {
    const { points: t } = r.geometry;
    let e = 0, i = t.length - 1;
    for (let s = 0; s < t.length; s++)
      e += (t[i][0] + t[s][0]) * (t[i][1] - t[s][1]), i = s;
    return Math.abs(0.5 * e);
  },
  intersects: (r, t, e) => {
    const { points: i } = r.geometry;
    let s = !1;
    for (let n = 0, o = i.length - 1; n < i.length; o = n++) {
      const a = i[n][0], h = i[n][1], l = i[o][0], c = i[o][1];
      h > e != c > e && t < (l - a) * (e - h) / (c - h) + a && (s = !s);
    }
    return s;
  }
};
en(qt.POLYGON, Y_);
const q_ = {
  area: (r) => r.geometry.w * r.geometry.h,
  intersects: (r, t, e) => t >= r.geometry.x && t <= r.geometry.x + r.geometry.w && e >= r.geometry.y && e <= r.geometry.y + r.geometry.h
};
en(qt.RECTANGLE, q_);
const K_ = {
  area: (r) => {
    const { points: t } = r.geometry;
    let e = 0, i = t.length - 1;
    for (let s = 0; s < t.length; s++)
      e += (t[i][0] + t[s][0]) * (t[i][1] - t[s][1]), i = s;
    return Math.abs(0.5 * e);
  },
  intersects: (r, t, e) => {
    const { points: i } = r.geometry;
    let s = !1;
    for (let n = 0, o = i.length - 1; n < i.length; o = n++) {
      const a = i[n][0], h = i[n][1], l = i[o][0], c = i[o][1];
      h > e != c > e && t < (l - a) * (e - h) / (c - h) + a && (s = !s);
    }
    return s;
  }
};
en(qt.FREEHAND, K_);
function ll(r, t, e, i = (s) => s) {
  return r * i(0.5 - t * (0.5 - e));
}
function Z_(r) {
  return [-r[0], -r[1]];
}
function he(r, t) {
  return [r[0] + t[0], r[1] + t[1]];
}
function Qt(r, t) {
  return [r[0] - t[0], r[1] - t[1]];
}
function ae(r, t) {
  return [r[0] * t, r[1] * t];
}
function Q_(r, t) {
  return [r[0] / t, r[1] / t];
}
function ci(r) {
  return [r[1], -r[0]];
}
function cl(r, t) {
  return r[0] * t[0] + r[1] * t[1];
}
function J_(r, t) {
  return r[0] === t[0] && r[1] === t[1];
}
function tv(r) {
  return Math.hypot(r[0], r[1]);
}
function ev(r) {
  return r[0] * r[0] + r[1] * r[1];
}
function ul(r, t) {
  return ev(Qt(r, t));
}
function Cu(r) {
  return Q_(r, tv(r));
}
function rv(r, t) {
  return Math.hypot(r[1] - t[1], r[0] - t[0]);
}
function ui(r, t, e) {
  let i = Math.sin(e), s = Math.cos(e), n = r[0] - t[0], o = r[1] - t[1], a = n * s - o * i, h = n * i + o * s;
  return [a + t[0], h + t[1]];
}
function $o(r, t, e) {
  return he(r, ae(Qt(t, r), e));
}
function dl(r, t, e) {
  return he(r, ae(t, e));
}
var { min: Dr, PI: iv } = Math, fl = 0.275, di = iv + 1e-4;
function sv(r, t = {}) {
  let { size: e = 16, smoothing: i = 0.5, thinning: s = 0.5, simulatePressure: n = !0, easing: o = (D) => D, start: a = {}, end: h = {}, last: l = !1 } = t, { cap: c = !0, easing: u = (D) => D * (2 - D) } = a, { cap: d = !0, easing: f = (D) => --D * D * D + 1 } = h;
  if (r.length === 0 || e <= 0)
    return [];
  let p = r[r.length - 1].runningLength, m = a.taper === !1 ? 0 : a.taper === !0 ? Math.max(e, p) : a.taper, g = h.taper === !1 ? 0 : h.taper === !0 ? Math.max(e, p) : h.taper, y = Math.pow(e * i, 2), v = [], _ = [], x = r.slice(0, 10).reduce((D, N) => {
    let q = N.pressure;
    if (n) {
      let B = Dr(1, N.distance / e), L = Dr(1, 1 - B);
      q = Dr(1, D + (L - D) * (B * fl));
    }
    return (D + q) / 2;
  }, r[0].pressure), T = ll(e, s, r[r.length - 1].pressure, o), C, w = r[0].vector, I = r[0].point, S = I, P = I, O = S, M = !1;
  for (let D = 0; D < r.length; D++) {
    let { pressure: N } = r[D], { point: q, vector: B, distance: L, runningLength: Y } = r[D];
    if (D < r.length - 1 && p - Y < 3)
      continue;
    if (s) {
      if (n) {
        let et = Dr(1, L / e), ct = Dr(1, 1 - et);
        N = Dr(1, x + (ct - x) * (et * fl));
      }
      T = ll(e, s, N, o);
    } else
      T = e / 2;
    C === void 0 && (C = T);
    let nt = Y < m ? u(Y / m) : 1, at = p - Y < g ? f((p - Y) / g) : 1;
    T = Math.max(0.01, T * Math.min(nt, at));
    let mt = (D < r.length - 1 ? r[D + 1] : r[D]).vector, rt = D < r.length - 1 ? cl(B, mt) : 1, gt = cl(B, w) < 0 && !M, _t = rt !== null && rt < 0;
    if (gt || _t) {
      let et = ae(ci(w), T);
      for (let ct = 1 / 13, dt = 0; dt <= 1; dt += ct)
        P = ui(Qt(q, et), q, di * dt), v.push(P), O = ui(he(q, et), q, di * -dt), _.push(O);
      I = P, S = O, _t && (M = !0);
      continue;
    }
    if (M = !1, D === r.length - 1) {
      let et = ae(ci(B), T);
      v.push(Qt(q, et)), _.push(he(q, et));
      continue;
    }
    let St = ae(ci($o(mt, B, rt)), T);
    P = Qt(q, St), (D <= 1 || ul(I, P) > y) && (v.push(P), I = P), O = he(q, St), (D <= 1 || ul(S, O) > y) && (_.push(O), S = O), x = N, w = B;
  }
  let E = r[0].point.slice(0, 2), A = r.length > 1 ? r[r.length - 1].point.slice(0, 2) : he(r[0].point, [1, 1]), R = [], X = [];
  if (r.length === 1) {
    if (!(m || g) || l) {
      let D = dl(E, Cu(ci(Qt(E, A))), -(C || T)), N = [];
      for (let q = 1 / 13, B = q; B <= 1; B += q)
        N.push(ui(D, E, di * 2 * B));
      return N;
    }
  } else {
    if (!(m || g && r.length === 1))
      if (c)
        for (let N = 1 / 13, q = N; q <= 1; q += N) {
          let B = ui(_[0], E, di * q);
          R.push(B);
        }
      else {
        let N = Qt(v[0], _[0]), q = ae(N, 0.5), B = ae(N, 0.51);
        R.push(Qt(E, q), Qt(E, B), he(E, B), he(E, q));
      }
    let D = ci(Z_(r[r.length - 1].vector));
    if (g || m && r.length === 1)
      X.push(A);
    else if (d) {
      let N = dl(A, D, T);
      for (let q = 1 / 29, B = q; B < 1; B += q)
        X.push(ui(N, A, di * 3 * B));
    } else
      X.push(he(A, ae(D, T)), he(A, ae(D, T * 0.99)), Qt(A, ae(D, T * 0.99)), Qt(A, ae(D, T)));
  }
  return v.concat(X, _.reverse(), R);
}
function nv(r, t = {}) {
  var e;
  let { streamline: i = 0.5, size: s = 16, last: n = !1 } = t;
  if (r.length === 0)
    return [];
  let o = 0.15 + (1 - i) * 0.85, a = Array.isArray(r[0]) ? r : r.map(({ x: f, y: p, pressure: m = 0.5 }) => [f, p, m]);
  if (a.length === 2) {
    let f = a[1];
    a = a.slice(0, -1);
    for (let p = 1; p < 5; p++)
      a.push($o(a[0], f, p / 4));
  }
  a.length === 1 && (a = [...a, [...he(a[0], [1, 1]), ...a[0].slice(2)]]);
  let h = [{ point: [a[0][0], a[0][1]], pressure: a[0][2] >= 0 ? a[0][2] : 0.25, vector: [1, 1], distance: 0, runningLength: 0 }], l = !1, c = 0, u = h[0], d = a.length - 1;
  for (let f = 1; f < a.length; f++) {
    let p = n && f === d ? a[f].slice(0, 2) : $o(u.point, a[f], o);
    if (J_(u.point, p))
      continue;
    let m = rv(p, u.point);
    if (c += m, f < d && !l) {
      if (c < s)
        continue;
      l = !0;
    }
    u = { point: p, pressure: a[f][2] >= 0 ? a[f][2] : 0.5, vector: Cu(Qt(u.point, p)), distance: m, runningLength: c }, h.push(u);
  }
  return h[0].vector = ((e = h[1]) == null ? void 0 : e.vector) || [0, 0], h;
}
function Ru(r, t = {}) {
  return sv(nv(r, t), t);
}
function ov(r, t) {
  var e = r[0] - t[0], i = r[1] - t[1];
  return e * e + i * i;
}
function av(r, t, e) {
  var i = t[0], s = t[1], n = e[0] - i, o = e[1] - s;
  if (n !== 0 || o !== 0) {
    var a = ((r[0] - i) * n + (r[1] - s) * o) / (n * n + o * o);
    a > 1 ? (i = e[0], s = e[1]) : a > 0 && (i += n * a, s += o * a);
  }
  return n = r[0] - i, o = r[1] - s, n * n + o * o;
}
function hv(r, t) {
  for (var e = r[0], i = [e], s, n = 1, o = r.length; n < o; n++)
    s = r[n], ov(s, e) > t && (i.push(s), e = s);
  return e !== s && i.push(s), i;
}
function Yo(r, t, e, i, s) {
  for (var n = i, o, a = t + 1; a < e; a++) {
    var h = av(r[a], r[t], r[e]);
    h > n && (o = a, n = h);
  }
  n > i && (o - t > 1 && Yo(r, t, o, i, s), s.push(r[o]), e - o > 1 && Yo(r, o, e, i, s));
}
function lv(r, t) {
  var e = r.length - 1, i = [r[0]];
  return Yo(r, 0, e, t, i), i.push(r[e]), i;
}
function cv(r, t, e) {
  if (r.length <= 2)
    return r;
  var i = t !== void 0 ? t * t : 1;
  return r = e ? r : hv(r, i), r = lv(r, i), r;
}
const uv = {
  size: 4,
  thinning: 0.3,
  smoothing: 0.5,
  streamline: 0.5,
  easing: (r) => r,
  start: {
    taper: 0,
    easing: (r) => r,
    cap: !0
  },
  end: {
    taper: 0,
    easing: (r) => r,
    cap: !0
  }
};
function dv(r) {
  if (!r.length)
    return "";
  const t = r.reduce(
    (e, [i, s], n, o) => {
      const [a, h] = o[(n + 1) % o.length];
      return e.push(i, s, (i + a) / 2, (s + h) / 2), e;
    },
    ["M", ...r[0], "Q"]
  );
  return t.push("Z"), t.join(" ");
}
function fv(r, t, e = !1) {
  const i = Ru(r, t);
  return dv(
    e ? cv(i, 0.25) : i
  );
}
let ls;
const pv = new Uint8Array(16);
function mv() {
  if (!ls && (ls = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !ls))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return ls(pv);
}
const Ft = [];
for (let r = 0; r < 256; ++r)
  Ft.push((r + 256).toString(16).slice(1));
function gv(r, t = 0) {
  return Ft[r[t + 0]] + Ft[r[t + 1]] + Ft[r[t + 2]] + Ft[r[t + 3]] + "-" + Ft[r[t + 4]] + Ft[r[t + 5]] + "-" + Ft[r[t + 6]] + Ft[r[t + 7]] + "-" + Ft[r[t + 8]] + Ft[r[t + 9]] + "-" + Ft[r[t + 10]] + Ft[r[t + 11]] + Ft[r[t + 12]] + Ft[r[t + 13]] + Ft[r[t + 14]] + Ft[r[t + 15]];
}
const yv = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), pl = {
  randomUUID: yv
};
function _v(r, t, e) {
  if (pl.randomUUID && !t && !r)
    return pl.randomUUID();
  r = r || {};
  const i = r.random || (r.rng || mv)();
  if (i[6] = i[6] & 15 | 64, i[8] = i[8] & 63 | 128, t) {
    e = e || 0;
    for (let s = 0; s < 16; ++s)
      t[e + s] = i[s];
    return t;
  }
  return gv(i);
}
function ml(r, t, e) {
  const i = r.slice();
  return i[11] = t[e], i[13] = e, i;
}
function gl(r) {
  let t, e, i, s, n;
  return {
    c() {
      t = ut("rect"), b(t, "class", "a9s-corner-handle"), b(t, "x", e = /*point*/
      r[11][0] - /*handleSize*/
      r[3] / 2), b(t, "y", i = /*point*/
      r[11][1] - /*handleSize*/
      r[3] / 2), b(
        t,
        "height",
        /*handleSize*/
        r[3]
      ), b(
        t,
        "width",
        /*handleSize*/
        r[3]
      );
    },
    m(o, a) {
      Q(o, t, a), s || (n = wt(t, "pointerdown", function() {
        bt(
          /*grab*/
          r[10](G(
            /*idx*/
            r[13]
          ))
        ) && r[10](G(
          /*idx*/
          r[13]
        )).apply(this, arguments);
      }), s = !0);
    },
    p(o, a) {
      r = o, a & /*geom, handleSize*/
      24 && e !== (e = /*point*/
      r[11][0] - /*handleSize*/
      r[3] / 2) && b(t, "x", e), a & /*geom, handleSize*/
      24 && i !== (i = /*point*/
      r[11][1] - /*handleSize*/
      r[3] / 2) && b(t, "y", i), a & /*handleSize*/
      8 && b(
        t,
        "height",
        /*handleSize*/
        r[3]
      ), a & /*handleSize*/
      8 && b(
        t,
        "width",
        /*handleSize*/
        r[3]
      );
    },
    d(o) {
      o && Z(t), s = !1, n();
    }
  };
}
function vv(r) {
  let t, e, i, s, n, o, a, h, l, c, u = Zr(
    /*geom*/
    r[4].points
  ), d = [];
  for (let f = 0; f < u.length; f += 1)
    d[f] = gl(ml(r, u, f));
  return {
    c() {
      t = ut("polygon"), s = Nt(), n = ut("polygon"), a = Nt();
      for (let f = 0; f < d.length; f += 1)
        d[f].c();
      h = Er(), b(t, "class", "a9s-outer"), b(t, "style", e = /*computedStyle*/
      r[1] ? "display:none;" : void 0), b(t, "points", i = /*geom*/
      r[4].points.map(yl).join(" ")), b(n, "class", "a9s-inner a9s-shape-handle"), b(
        n,
        "style",
        /*computedStyle*/
        r[1]
      ), b(n, "points", o = /*geom*/
      r[4].points.map(_l).join(" "));
    },
    m(f, p) {
      Q(f, t, p), Q(f, s, p), Q(f, n, p), Q(f, a, p);
      for (let m = 0; m < d.length; m += 1)
        d[m] && d[m].m(f, p);
      Q(f, h, p), l || (c = [
        wt(t, "pointerdown", function() {
          bt(
            /*grab*/
            r[10](G.SHAPE)
          ) && r[10](G.SHAPE).apply(this, arguments);
        }),
        wt(n, "pointerdown", function() {
          bt(
            /*grab*/
            r[10](G.SHAPE)
          ) && r[10](G.SHAPE).apply(this, arguments);
        })
      ], l = !0);
    },
    p(f, p) {
      if (r = f, p & /*computedStyle*/
      2 && e !== (e = /*computedStyle*/
      r[1] ? "display:none;" : void 0) && b(t, "style", e), p & /*geom*/
      16 && i !== (i = /*geom*/
      r[4].points.map(yl).join(" ")) && b(t, "points", i), p & /*computedStyle*/
      2 && b(
        n,
        "style",
        /*computedStyle*/
        r[1]
      ), p & /*geom*/
      16 && o !== (o = /*geom*/
      r[4].points.map(_l).join(" ")) && b(n, "points", o), p & /*geom, handleSize, grab*/
      1048) {
        u = Zr(
          /*geom*/
          r[4].points
        );
        let m;
        for (m = 0; m < u.length; m += 1) {
          const g = ml(r, u, m);
          d[m] ? d[m].p(g, p) : (d[m] = gl(g), d[m].c(), d[m].m(h.parentNode, h));
        }
        for (; m < d.length; m += 1)
          d[m].d(1);
        d.length = u.length;
      }
    },
    d(f) {
      f && (Z(t), Z(s), Z(n), Z(a), Z(h)), Jo(d, f), l = !1, Le(c);
    }
  };
}
function xv(r) {
  let t, e;
  return t = new rn({
    props: {
      shape: (
        /*shape*/
        r[0]
      ),
      transform: (
        /*transform*/
        r[2]
      ),
      editor: (
        /*editor*/
        r[5]
      ),
      $$slots: {
        default: [
          vv,
          ({ grab: i }) => ({ 10: i }),
          ({ grab: i }) => i ? 1024 : 0
        ]
      },
      $$scope: { ctx: r }
    }
  }), t.$on(
    "change",
    /*change_handler*/
    r[7]
  ), t.$on(
    "grab",
    /*grab_handler*/
    r[8]
  ), t.$on(
    "release",
    /*release_handler*/
    r[9]
  ), {
    c() {
      re(t.$$.fragment);
    },
    m(i, s) {
      Kt(t, i, s), e = !0;
    },
    p(i, [s]) {
      const n = {};
      s & /*shape*/
      1 && (n.shape = /*shape*/
      i[0]), s & /*transform*/
      4 && (n.transform = /*transform*/
      i[2]), s & /*$$scope, geom, handleSize, grab, computedStyle*/
      17434 && (n.$$scope = { dirty: s, ctx: i }), t.$set(n);
    },
    i(i) {
      e || (ot(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Zt(t, i);
    }
  };
}
const yl = (r) => r.join(","), _l = (r) => r.join(",");
function bv(r, t, e) {
  let i, s, { shape: n } = t, { computedStyle: o = void 0 } = t, { transform: a } = t, { viewportScale: h = 1 } = t;
  const l = (f, p, m) => {
    let g;
    p === G.SHAPE ? g = f.geometry.points.map(([v, _]) => [v + m[0], _ + m[1]]) : g = f.geometry.points.map(([v, _], x) => p === G(x) ? [v + m[0], _ + m[1]] : [v, _]);
    const y = Iu(g);
    return { ...f, geometry: { points: g, bounds: y } };
  };
  function c(f) {
    ee.call(this, r, f);
  }
  function u(f) {
    ee.call(this, r, f);
  }
  function d(f) {
    ee.call(this, r, f);
  }
  return r.$$set = (f) => {
    "shape" in f && e(0, n = f.shape), "computedStyle" in f && e(1, o = f.computedStyle), "transform" in f && e(2, a = f.transform), "viewportScale" in f && e(6, h = f.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*shape*/
    1 && e(4, i = n.geometry), r.$$.dirty & /*viewportScale*/
    64 && e(3, s = 10 / h);
  }, [
    n,
    o,
    a,
    s,
    i,
    l,
    h,
    c,
    u,
    d
  ];
}
class Tv extends Xt {
  constructor(t) {
    super(), Vt(this, t, bv, xv, Ut, {
      shape: 0,
      computedStyle: 1,
      transform: 2,
      viewportScale: 6
    });
  }
}
function Ev(r) {
  let t, e, i, s, n, o, a, h, l, c, u, d, f, p, m, g, y, v, _, x, T, C, w, I, S, P, O, M, E, A, R, X, D, N, q, B, L, Y, nt, at, mt, rt, gt, _t, St, et, ct, dt, vt, zt;
  return {
    c() {
      t = ut("rect"), a = Nt(), h = ut("rect"), f = Nt(), p = ut("rect"), v = Nt(), _ = ut("rect"), w = Nt(), I = ut("rect"), M = Nt(), E = ut("rect"), D = Nt(), N = ut("rect"), L = Nt(), Y = ut("rect"), mt = Nt(), rt = ut("rect"), St = Nt(), et = ut("rect"), b(t, "class", "a9s-outer"), b(t, "style", e = /*computedStyle*/
      r[1] ? "display:none;" : void 0), b(t, "x", i = /*geom*/
      r[4].x), b(t, "y", s = /*geom*/
      r[4].y), b(t, "width", n = /*geom*/
      r[4].w), b(t, "height", o = /*geom*/
      r[4].h), b(h, "class", "a9s-inner a9s-shape-handle"), b(
        h,
        "style",
        /*computedStyle*/
        r[1]
      ), b(h, "x", l = /*geom*/
      r[4].x), b(h, "y", c = /*geom*/
      r[4].y), b(h, "width", u = /*geom*/
      r[4].w), b(h, "height", d = /*geom*/
      r[4].h), b(p, "class", "a9s-edge-handle a9s-edge-handle-top"), b(p, "x", m = /*geom*/
      r[4].x), b(p, "y", g = /*geom*/
      r[4].y), b(p, "height", 1), b(p, "width", y = /*geom*/
      r[4].w), b(_, "class", "a9s-edge-handle a9s-edge-handle-right"), b(_, "x", x = /*geom*/
      r[4].x + /*geom*/
      r[4].w), b(_, "y", T = /*geom*/
      r[4].y), b(_, "height", C = /*geom*/
      r[4].h), b(_, "width", 1), b(I, "class", "a9s-edge-handle a9s-edge-handle-bottom"), b(I, "x", S = /*geom*/
      r[4].x), b(I, "y", P = /*geom*/
      r[4].y + /*geom*/
      r[4].h), b(I, "height", 1), b(I, "width", O = /*geom*/
      r[4].w), b(E, "class", "a9s-edge-handle a9s-edge-handle-left"), b(E, "x", A = /*geom*/
      r[4].x), b(E, "y", R = /*geom*/
      r[4].y), b(E, "height", X = /*geom*/
      r[4].h), b(E, "width", 1), b(N, "class", "a9s-corner-handle a9s-corner-handle-topleft"), b(N, "x", q = /*geom*/
      r[4].x - /*handleSize*/
      r[3] / 2), b(N, "y", B = /*geom*/
      r[4].y - /*handleSize*/
      r[3] / 2), b(
        N,
        "height",
        /*handleSize*/
        r[3]
      ), b(
        N,
        "width",
        /*handleSize*/
        r[3]
      ), b(Y, "class", "a9s-corner-handle a9s-corner-handle-topright"), b(Y, "x", nt = /*geom*/
      r[4].x + /*geom*/
      r[4].w - /*handleSize*/
      r[3] / 2), b(Y, "y", at = /*geom*/
      r[4].y - /*handleSize*/
      r[3] / 2), b(
        Y,
        "height",
        /*handleSize*/
        r[3]
      ), b(
        Y,
        "width",
        /*handleSize*/
        r[3]
      ), b(rt, "class", "a9s-corner-handle a9s-corner-handle-bottomright"), b(rt, "x", gt = /*geom*/
      r[4].x + /*geom*/
      r[4].w - /*handleSize*/
      r[3] / 2), b(rt, "y", _t = /*geom*/
      r[4].y + /*geom*/
      r[4].h - /*handleSize*/
      r[3] / 2), b(
        rt,
        "height",
        /*handleSize*/
        r[3]
      ), b(
        rt,
        "width",
        /*handleSize*/
        r[3]
      ), b(et, "class", "a9s-corner-handle a9s-corner-handle-bottomleft"), b(et, "x", ct = /*geom*/
      r[4].x - /*handleSize*/
      r[3] / 2), b(et, "y", dt = /*geom*/
      r[4].y + /*geom*/
      r[4].h - /*handleSize*/
      r[3] / 2), b(
        et,
        "height",
        /*handleSize*/
        r[3]
      ), b(
        et,
        "width",
        /*handleSize*/
        r[3]
      );
    },
    m(ht, V) {
      Q(ht, t, V), Q(ht, a, V), Q(ht, h, V), Q(ht, f, V), Q(ht, p, V), Q(ht, v, V), Q(ht, _, V), Q(ht, w, V), Q(ht, I, V), Q(ht, M, V), Q(ht, E, V), Q(ht, D, V), Q(ht, N, V), Q(ht, L, V), Q(ht, Y, V), Q(ht, mt, V), Q(ht, rt, V), Q(ht, St, V), Q(ht, et, V), vt || (zt = [
        wt(t, "pointerdown", function() {
          bt(
            /*grab*/
            r[10](G.SHAPE)
          ) && r[10](G.SHAPE).apply(this, arguments);
        }),
        wt(h, "pointerdown", function() {
          bt(
            /*grab*/
            r[10](G.SHAPE)
          ) && r[10](G.SHAPE).apply(this, arguments);
        }),
        wt(p, "pointerdown", function() {
          bt(
            /*grab*/
            r[10](G.TOP)
          ) && r[10](G.TOP).apply(this, arguments);
        }),
        wt(_, "pointerdown", function() {
          bt(
            /*grab*/
            r[10](G.RIGHT)
          ) && r[10](G.RIGHT).apply(this, arguments);
        }),
        wt(I, "pointerdown", function() {
          bt(
            /*grab*/
            r[10](G.BOTTOM)
          ) && r[10](G.BOTTOM).apply(this, arguments);
        }),
        wt(E, "pointerdown", function() {
          bt(
            /*grab*/
            r[10](G.LEFT)
          ) && r[10](G.LEFT).apply(this, arguments);
        }),
        wt(N, "pointerdown", function() {
          bt(
            /*grab*/
            r[10](G.TOP_LEFT)
          ) && r[10](G.TOP_LEFT).apply(this, arguments);
        }),
        wt(Y, "pointerdown", function() {
          bt(
            /*grab*/
            r[10](G.TOP_RIGHT)
          ) && r[10](G.TOP_RIGHT).apply(this, arguments);
        }),
        wt(rt, "pointerdown", function() {
          bt(
            /*grab*/
            r[10](G.BOTTOM_RIGHT)
          ) && r[10](G.BOTTOM_RIGHT).apply(this, arguments);
        }),
        wt(et, "pointerdown", function() {
          bt(
            /*grab*/
            r[10](G.BOTTOM_LEFT)
          ) && r[10](G.BOTTOM_LEFT).apply(this, arguments);
        })
      ], vt = !0);
    },
    p(ht, V) {
      r = ht, V & /*computedStyle*/
      2 && e !== (e = /*computedStyle*/
      r[1] ? "display:none;" : void 0) && b(t, "style", e), V & /*geom*/
      16 && i !== (i = /*geom*/
      r[4].x) && b(t, "x", i), V & /*geom*/
      16 && s !== (s = /*geom*/
      r[4].y) && b(t, "y", s), V & /*geom*/
      16 && n !== (n = /*geom*/
      r[4].w) && b(t, "width", n), V & /*geom*/
      16 && o !== (o = /*geom*/
      r[4].h) && b(t, "height", o), V & /*computedStyle*/
      2 && b(
        h,
        "style",
        /*computedStyle*/
        r[1]
      ), V & /*geom*/
      16 && l !== (l = /*geom*/
      r[4].x) && b(h, "x", l), V & /*geom*/
      16 && c !== (c = /*geom*/
      r[4].y) && b(h, "y", c), V & /*geom*/
      16 && u !== (u = /*geom*/
      r[4].w) && b(h, "width", u), V & /*geom*/
      16 && d !== (d = /*geom*/
      r[4].h) && b(h, "height", d), V & /*geom*/
      16 && m !== (m = /*geom*/
      r[4].x) && b(p, "x", m), V & /*geom*/
      16 && g !== (g = /*geom*/
      r[4].y) && b(p, "y", g), V & /*geom*/
      16 && y !== (y = /*geom*/
      r[4].w) && b(p, "width", y), V & /*geom*/
      16 && x !== (x = /*geom*/
      r[4].x + /*geom*/
      r[4].w) && b(_, "x", x), V & /*geom*/
      16 && T !== (T = /*geom*/
      r[4].y) && b(_, "y", T), V & /*geom*/
      16 && C !== (C = /*geom*/
      r[4].h) && b(_, "height", C), V & /*geom*/
      16 && S !== (S = /*geom*/
      r[4].x) && b(I, "x", S), V & /*geom*/
      16 && P !== (P = /*geom*/
      r[4].y + /*geom*/
      r[4].h) && b(I, "y", P), V & /*geom*/
      16 && O !== (O = /*geom*/
      r[4].w) && b(I, "width", O), V & /*geom*/
      16 && A !== (A = /*geom*/
      r[4].x) && b(E, "x", A), V & /*geom*/
      16 && R !== (R = /*geom*/
      r[4].y) && b(E, "y", R), V & /*geom*/
      16 && X !== (X = /*geom*/
      r[4].h) && b(E, "height", X), V & /*geom, handleSize*/
      24 && q !== (q = /*geom*/
      r[4].x - /*handleSize*/
      r[3] / 2) && b(N, "x", q), V & /*geom, handleSize*/
      24 && B !== (B = /*geom*/
      r[4].y - /*handleSize*/
      r[3] / 2) && b(N, "y", B), V & /*handleSize*/
      8 && b(
        N,
        "height",
        /*handleSize*/
        r[3]
      ), V & /*handleSize*/
      8 && b(
        N,
        "width",
        /*handleSize*/
        r[3]
      ), V & /*geom, handleSize*/
      24 && nt !== (nt = /*geom*/
      r[4].x + /*geom*/
      r[4].w - /*handleSize*/
      r[3] / 2) && b(Y, "x", nt), V & /*geom, handleSize*/
      24 && at !== (at = /*geom*/
      r[4].y - /*handleSize*/
      r[3] / 2) && b(Y, "y", at), V & /*handleSize*/
      8 && b(
        Y,
        "height",
        /*handleSize*/
        r[3]
      ), V & /*handleSize*/
      8 && b(
        Y,
        "width",
        /*handleSize*/
        r[3]
      ), V & /*geom, handleSize*/
      24 && gt !== (gt = /*geom*/
      r[4].x + /*geom*/
      r[4].w - /*handleSize*/
      r[3] / 2) && b(rt, "x", gt), V & /*geom, handleSize*/
      24 && _t !== (_t = /*geom*/
      r[4].y + /*geom*/
      r[4].h - /*handleSize*/
      r[3] / 2) && b(rt, "y", _t), V & /*handleSize*/
      8 && b(
        rt,
        "height",
        /*handleSize*/
        r[3]
      ), V & /*handleSize*/
      8 && b(
        rt,
        "width",
        /*handleSize*/
        r[3]
      ), V & /*geom, handleSize*/
      24 && ct !== (ct = /*geom*/
      r[4].x - /*handleSize*/
      r[3] / 2) && b(et, "x", ct), V & /*geom, handleSize*/
      24 && dt !== (dt = /*geom*/
      r[4].y + /*geom*/
      r[4].h - /*handleSize*/
      r[3] / 2) && b(et, "y", dt), V & /*handleSize*/
      8 && b(
        et,
        "height",
        /*handleSize*/
        r[3]
      ), V & /*handleSize*/
      8 && b(
        et,
        "width",
        /*handleSize*/
        r[3]
      );
    },
    d(ht) {
      ht && (Z(t), Z(a), Z(h), Z(f), Z(p), Z(v), Z(_), Z(w), Z(I), Z(M), Z(E), Z(D), Z(N), Z(L), Z(Y), Z(mt), Z(rt), Z(St), Z(et)), vt = !1, Le(zt);
    }
  };
}
function wv(r) {
  let t, e;
  return t = new rn({
    props: {
      shape: (
        /*shape*/
        r[0]
      ),
      transform: (
        /*transform*/
        r[2]
      ),
      editor: (
        /*editor*/
        r[5]
      ),
      $$slots: {
        default: [
          Ev,
          ({ grab: i }) => ({ 10: i }),
          ({ grab: i }) => i ? 1024 : 0
        ]
      },
      $$scope: { ctx: r }
    }
  }), t.$on(
    "grab",
    /*grab_handler*/
    r[7]
  ), t.$on(
    "change",
    /*change_handler*/
    r[8]
  ), t.$on(
    "release",
    /*release_handler*/
    r[9]
  ), {
    c() {
      re(t.$$.fragment);
    },
    m(i, s) {
      Kt(t, i, s), e = !0;
    },
    p(i, [s]) {
      const n = {};
      s & /*shape*/
      1 && (n.shape = /*shape*/
      i[0]), s & /*transform*/
      4 && (n.transform = /*transform*/
      i[2]), s & /*$$scope, geom, handleSize, grab, computedStyle*/
      3098 && (n.$$scope = { dirty: s, ctx: i }), t.$set(n);
    },
    i(i) {
      e || (ot(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Zt(t, i);
    }
  };
}
function Av(r, t, e) {
  let i, s, { shape: n } = t, { computedStyle: o = void 0 } = t, { transform: a } = t, { viewportScale: h = 1 } = t;
  const l = (f, p, m) => {
    const g = f.geometry.bounds;
    let [y, v] = [g.minX, g.minY], [_, x] = [g.maxX, g.maxY];
    const [T, C] = m;
    if (p === G.SHAPE)
      y += T, _ += T, v += C, x += C;
    else {
      switch (p) {
        case G.TOP:
        case G.TOP_LEFT:
        case G.TOP_RIGHT: {
          v += C;
          break;
        }
        case G.BOTTOM:
        case G.BOTTOM_LEFT:
        case G.BOTTOM_RIGHT: {
          x += C;
          break;
        }
      }
      switch (p) {
        case G.LEFT:
        case G.TOP_LEFT:
        case G.BOTTOM_LEFT: {
          y += T;
          break;
        }
        case G.RIGHT:
        case G.TOP_RIGHT:
        case G.BOTTOM_RIGHT: {
          _ += T;
          break;
        }
      }
    }
    const w = Math.min(y, _), I = Math.min(v, x), S = Math.abs(_ - y), P = Math.abs(x - v);
    return {
      ...f,
      geometry: {
        x: w,
        y: I,
        w: S,
        h: P,
        bounds: {
          minX: w,
          minY: I,
          maxX: w + S,
          maxY: I + P
        }
      }
    };
  };
  function c(f) {
    ee.call(this, r, f);
  }
  function u(f) {
    ee.call(this, r, f);
  }
  function d(f) {
    ee.call(this, r, f);
  }
  return r.$$set = (f) => {
    "shape" in f && e(0, n = f.shape), "computedStyle" in f && e(1, o = f.computedStyle), "transform" in f && e(2, a = f.transform), "viewportScale" in f && e(6, h = f.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*shape*/
    1 && e(4, i = n.geometry), r.$$.dirty & /*viewportScale*/
    64 && e(3, s = 10 / h);
  }, [
    n,
    o,
    a,
    s,
    i,
    l,
    h,
    c,
    u,
    d
  ];
}
class Sv extends Xt {
  constructor(t) {
    super(), Vt(this, t, Av, wv, Ut, {
      shape: 0,
      computedStyle: 1,
      transform: 2,
      viewportScale: 6
    });
  }
}
function Iv(r) {
  let t, e, i, s, n, o, a, h, l, c, u, d, f, p, m, g, y, v, _, x, T, C, w, I, S, P, O, M, E;
  return {
    c() {
      t = ut("ellipse"), o = Nt(), a = ut("ellipse"), d = Nt(), f = ut("rect"), g = Nt(), y = ut("rect"), x = Nt(), T = ut("rect"), I = Nt(), S = ut("rect"), b(t, "class", "a9s-outer"), b(t, "cx", e = /*geom*/
      r[3].cx), b(t, "cy", i = /*geom*/
      r[3].cy), b(t, "rx", s = /*geom*/
      r[3].rx), b(t, "ry", n = /*geom*/
      r[3].ry), b(a, "class", "a9s-inner a9s-shape-handle"), b(a, "cx", h = /*geom*/
      r[3].cx), b(a, "cy", l = /*geom*/
      r[3].cy), b(a, "rx", c = /*geom*/
      r[3].rx), b(a, "ry", u = /*geom*/
      r[3].ry), b(f, "class", "a9s-corner-handle a9s-corner-top"), b(f, "x", p = /*geom*/
      r[3].cx - /*handleSize*/
      r[2] / 2), b(f, "y", m = /*geom*/
      r[3].cy - /*handleSize*/
      r[2] / 2 - /*geom*/
      r[3].ry), b(
        f,
        "height",
        /*handleSize*/
        r[2]
      ), b(
        f,
        "width",
        /*handleSize*/
        r[2]
      ), b(y, "class", "a9s-corner-handle a9s-corner-handle-right"), b(y, "x", v = /*geom*/
      r[3].cx + /*geom*/
      r[3].rx - /*handleSize*/
      r[2] / 2), b(y, "y", _ = /*geom*/
      r[3].cy - /*handleSize*/
      r[2] / 2), b(
        y,
        "height",
        /*handleSize*/
        r[2]
      ), b(
        y,
        "width",
        /*handleSize*/
        r[2]
      ), b(T, "class", "a9s-corner-handle a9s-corner-handle-bottom"), b(T, "x", C = /*geom*/
      r[3].cx - /*handleSize*/
      r[2] / 2), b(T, "y", w = /*geom*/
      r[3].cy + /*geom*/
      r[3].ry - /*handleSize*/
      r[2] / 2), b(
        T,
        "height",
        /*handleSize*/
        r[2]
      ), b(
        T,
        "width",
        /*handleSize*/
        r[2]
      ), b(S, "class", "a9s-corner-handle a9s-corner-handle-left"), b(S, "x", P = /*geom*/
      r[3].cx - /*geom*/
      r[3].rx - /*handleSize*/
      r[2] / 2), b(S, "y", O = /*geom*/
      r[3].cy - /*handleSize*/
      r[2] / 2), b(
        S,
        "height",
        /*handleSize*/
        r[2]
      ), b(
        S,
        "width",
        /*handleSize*/
        r[2]
      );
    },
    m(A, R) {
      Q(A, t, R), Q(A, o, R), Q(A, a, R), Q(A, d, R), Q(A, f, R), Q(A, g, R), Q(A, y, R), Q(A, x, R), Q(A, T, R), Q(A, I, R), Q(A, S, R), M || (E = [
        wt(t, "pointerdown", function() {
          bt(
            /*grab*/
            r[9](G.SHAPE)
          ) && r[9](G.SHAPE).apply(this, arguments);
        }),
        wt(a, "pointerdown", function() {
          bt(
            /*grab*/
            r[9](G.SHAPE)
          ) && r[9](G.SHAPE).apply(this, arguments);
        }),
        wt(f, "pointerdown", function() {
          bt(
            /*grab*/
            r[9](G.TOP)
          ) && r[9](G.TOP).apply(this, arguments);
        }),
        wt(y, "pointerdown", function() {
          bt(
            /*grab*/
            r[9](G.RIGHT)
          ) && r[9](G.RIGHT).apply(this, arguments);
        }),
        wt(T, "pointerdown", function() {
          bt(
            /*grab*/
            r[9](G.BOTTOM)
          ) && r[9](G.BOTTOM).apply(this, arguments);
        }),
        wt(S, "pointerdown", function() {
          bt(
            /*grab*/
            r[9](G.LEFT)
          ) && r[9](G.LEFT).apply(this, arguments);
        })
      ], M = !0);
    },
    p(A, R) {
      r = A, R & /*geom*/
      8 && e !== (e = /*geom*/
      r[3].cx) && b(t, "cx", e), R & /*geom*/
      8 && i !== (i = /*geom*/
      r[3].cy) && b(t, "cy", i), R & /*geom*/
      8 && s !== (s = /*geom*/
      r[3].rx) && b(t, "rx", s), R & /*geom*/
      8 && n !== (n = /*geom*/
      r[3].ry) && b(t, "ry", n), R & /*geom*/
      8 && h !== (h = /*geom*/
      r[3].cx) && b(a, "cx", h), R & /*geom*/
      8 && l !== (l = /*geom*/
      r[3].cy) && b(a, "cy", l), R & /*geom*/
      8 && c !== (c = /*geom*/
      r[3].rx) && b(a, "rx", c), R & /*geom*/
      8 && u !== (u = /*geom*/
      r[3].ry) && b(a, "ry", u), R & /*geom, handleSize*/
      12 && p !== (p = /*geom*/
      r[3].cx - /*handleSize*/
      r[2] / 2) && b(f, "x", p), R & /*geom, handleSize*/
      12 && m !== (m = /*geom*/
      r[3].cy - /*handleSize*/
      r[2] / 2 - /*geom*/
      r[3].ry) && b(f, "y", m), R & /*handleSize*/
      4 && b(
        f,
        "height",
        /*handleSize*/
        r[2]
      ), R & /*handleSize*/
      4 && b(
        f,
        "width",
        /*handleSize*/
        r[2]
      ), R & /*geom, handleSize*/
      12 && v !== (v = /*geom*/
      r[3].cx + /*geom*/
      r[3].rx - /*handleSize*/
      r[2] / 2) && b(y, "x", v), R & /*geom, handleSize*/
      12 && _ !== (_ = /*geom*/
      r[3].cy - /*handleSize*/
      r[2] / 2) && b(y, "y", _), R & /*handleSize*/
      4 && b(
        y,
        "height",
        /*handleSize*/
        r[2]
      ), R & /*handleSize*/
      4 && b(
        y,
        "width",
        /*handleSize*/
        r[2]
      ), R & /*geom, handleSize*/
      12 && C !== (C = /*geom*/
      r[3].cx - /*handleSize*/
      r[2] / 2) && b(T, "x", C), R & /*geom, handleSize*/
      12 && w !== (w = /*geom*/
      r[3].cy + /*geom*/
      r[3].ry - /*handleSize*/
      r[2] / 2) && b(T, "y", w), R & /*handleSize*/
      4 && b(
        T,
        "height",
        /*handleSize*/
        r[2]
      ), R & /*handleSize*/
      4 && b(
        T,
        "width",
        /*handleSize*/
        r[2]
      ), R & /*geom, handleSize*/
      12 && P !== (P = /*geom*/
      r[3].cx - /*geom*/
      r[3].rx - /*handleSize*/
      r[2] / 2) && b(S, "x", P), R & /*geom, handleSize*/
      12 && O !== (O = /*geom*/
      r[3].cy - /*handleSize*/
      r[2] / 2) && b(S, "y", O), R & /*handleSize*/
      4 && b(
        S,
        "height",
        /*handleSize*/
        r[2]
      ), R & /*handleSize*/
      4 && b(
        S,
        "width",
        /*handleSize*/
        r[2]
      );
    },
    d(A) {
      A && (Z(t), Z(o), Z(a), Z(d), Z(f), Z(g), Z(y), Z(x), Z(T), Z(I), Z(S)), M = !1, Le(E);
    }
  };
}
function Cv(r) {
  let t, e;
  return t = new rn({
    props: {
      shape: (
        /*shape*/
        r[0]
      ),
      transform: (
        /*transform*/
        r[1]
      ),
      editor: (
        /*editor*/
        r[4]
      ),
      $$slots: {
        default: [
          Iv,
          ({ grab: i }) => ({ 9: i }),
          ({ grab: i }) => i ? 512 : 0
        ]
      },
      $$scope: { ctx: r }
    }
  }), t.$on(
    "grab",
    /*grab_handler*/
    r[6]
  ), t.$on(
    "change",
    /*change_handler*/
    r[7]
  ), t.$on(
    "release",
    /*release_handler*/
    r[8]
  ), {
    c() {
      re(t.$$.fragment);
    },
    m(i, s) {
      Kt(t, i, s), e = !0;
    },
    p(i, [s]) {
      const n = {};
      s & /*shape*/
      1 && (n.shape = /*shape*/
      i[0]), s & /*transform*/
      2 && (n.transform = /*transform*/
      i[1]), s & /*$$scope, geom, handleSize, grab*/
      1548 && (n.$$scope = { dirty: s, ctx: i }), t.$set(n);
    },
    i(i) {
      e || (ot(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Zt(t, i);
    }
  };
}
function Rv(r, t, e) {
  let i, s, { shape: n } = t, { transform: o } = t, { viewportScale: a = 1 } = t;
  const h = (d, f, p) => {
    const m = d.geometry.bounds;
    let [g, y] = [m.minX, m.minY], [v, _] = [m.maxX, m.maxY];
    const [x, T] = p;
    if (f === G.SHAPE)
      g += x, v += x, y += T, _ += T;
    else
      switch (f) {
        case G.TOP: {
          y += T;
          break;
        }
        case G.BOTTOM: {
          _ += T;
          break;
        }
        case G.LEFT: {
          g += x;
          break;
        }
        case G.RIGHT: {
          v += x;
          break;
        }
      }
    const C = Math.min(g, v), w = Math.min(y, _), I = Math.abs(v - g), S = Math.abs(_ - y), P = (g + v) / 2, O = (y + _) / 2, M = I / 2, E = S / 2;
    return {
      ...d,
      geometry: {
        ...d.geometry,
        cx: P,
        cy: O,
        rx: M,
        ry: E,
        bounds: {
          minX: C,
          minY: w,
          maxX: C + I,
          maxY: w + S
        }
      }
    };
  };
  function l(d) {
    ee.call(this, r, d);
  }
  function c(d) {
    ee.call(this, r, d);
  }
  function u(d) {
    ee.call(this, r, d);
  }
  return r.$$set = (d) => {
    "shape" in d && e(0, n = d.shape), "transform" in d && e(1, o = d.transform), "viewportScale" in d && e(5, a = d.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*shape*/
    1 && e(3, i = n.geometry), r.$$.dirty & /*viewportScale*/
    32 && e(2, s = 10 / a);
  }, [
    n,
    o,
    s,
    i,
    h,
    a,
    l,
    c,
    u
  ];
}
class Pv extends Xt {
  constructor(t) {
    super(), Vt(this, t, Rv, Cv, Ut, { shape: 0, transform: 1, viewportScale: 5 });
  }
}
const Pu = (r, t, e) => {
  const i = typeof t == "function" ? t(r) : t;
  if (i) {
    const { fill: s, fillOpacity: n } = i;
    let o = "", a;
    return s && (o += `fill:${s};stroke:${s};`), e && (a = e.fillOpacity), o += `fill-opacity:${a || n || "0.25"};`, o;
  }
};
function Mv(r) {
  let t, e, i;
  return {
    c() {
      t = ut("path"), b(t, "class", "a9s-shape-handle"), b(
        t,
        "style",
        /*computedStyle*/
        r[3]
      ), b(
        t,
        "d",
        /*pathData*/
        r[2]
      );
    },
    m(s, n) {
      Q(s, t, n), e || (i = wt(t, "pointerdown", function() {
        bt(
          /*grab*/
          r[14](G.SHAPE)
        ) && r[14](G.SHAPE).apply(this, arguments);
      }), e = !0);
    },
    p(s, n) {
      r = s, n & /*computedStyle*/
      8 && b(
        t,
        "style",
        /*computedStyle*/
        r[3]
      ), n & /*pathData*/
      4 && b(
        t,
        "d",
        /*pathData*/
        r[2]
      );
    },
    d(s) {
      s && Z(t), e = !1, i();
    }
  };
}
function Bv(r) {
  let t, e;
  return t = new rn({
    props: {
      shape: (
        /*shape*/
        r[0]
      ),
      transform: (
        /*transform*/
        r[1]
      ),
      editor: (
        /*editor*/
        r[4]
      ),
      $$slots: {
        default: [
          Mv,
          ({ grab: i }) => ({ 14: i }),
          ({ grab: i }) => i ? 16384 : 0
        ]
      },
      $$scope: { ctx: r }
    }
  }), t.$on(
    "change",
    /*change_handler*/
    r[9]
  ), t.$on(
    "grab",
    /*grab_handler*/
    r[10]
  ), t.$on(
    "release",
    /*release_handler*/
    r[11]
  ), {
    c() {
      re(t.$$.fragment);
    },
    m(i, s) {
      Kt(t, i, s), e = !0;
    },
    p(i, [s]) {
      const n = {};
      s & /*shape*/
      1 && (n.shape = /*shape*/
      i[0]), s & /*transform*/
      2 && (n.transform = /*transform*/
      i[1]), s & /*$$scope, computedStyle, pathData, grab*/
      49164 && (n.$$scope = { dirty: s, ctx: i }), t.$set(n);
    },
    i(i) {
      e || (ot(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Zt(t, i);
    }
  };
}
function Dv(r, t, e) {
  let i, s, n, { shape: o } = t, { annotation: a } = t, { transform: h } = t, { viewportScale: l = 1 } = t, { style: c = void 0 } = t, u = { fillOpacity: 1 };
  const d = (g, y, v) => {
    let _;
    y === G.SHAPE && (_ = g.geometry.points.map(([T, C, w]) => [T + v[0], C + v[1], w]));
    const x = Iu(_.map((T) => [T[0], T[1]]));
    return { ...g, geometry: { points: _, bounds: x } };
  };
  function f(g) {
    ee.call(this, r, g);
  }
  function p(g) {
    ee.call(this, r, g);
  }
  function m(g) {
    ee.call(this, r, g);
  }
  return r.$$set = (g) => {
    "shape" in g && e(0, o = g.shape), "annotation" in g && e(5, a = g.annotation), "transform" in g && e(1, h = g.transform), "viewportScale" in g && e(6, l = g.viewportScale), "style" in g && e(7, c = g.style);
  }, r.$$.update = () => {
    r.$$.dirty & /*shape*/
    1 && e(8, i = o.geometry), r.$$.dirty & /*viewportScale*/
    64, r.$$.dirty & /*annotation, style*/
    160 && e(3, s = Pu(a, c, u)), r.$$.dirty & /*geom*/
    256 && e(2, n = fv(i.points, uv, !0));
  }, [
    o,
    h,
    n,
    s,
    d,
    a,
    l,
    c,
    i,
    f,
    p,
    m
  ];
}
class Fv extends Xt {
  constructor(t) {
    super(), Vt(this, t, Dv, Bv, Ut, {
      shape: 0,
      annotation: 5,
      transform: 1,
      viewportScale: 6,
      style: 7
    });
  }
}
qt.RECTANGLE, qt.POLYGON, qt.ELLIPSE, qt.FREEHAND;
const G = (r) => `HANDLE-${r}`;
G.SHAPE = "SHAPE";
G.TOP = "TOP";
G.RIGHT = "RIGHT";
G.BOTTOM = "BOTTOM";
G.LEFT = "LEFT";
G.TOP_LEFT = "TOP_LEFT";
G.TOP_RIGHT = "TOP_RIGHT";
G.BOTTOM_RIGHT = "BOTTOM_RIGHT";
G.BOTTOM_LEFT = "BOTTOM_LEFT";
const Ov = (r) => ({}), vl = (r) => ({ grab: (
  /*onGrab*/
  r[0]
) });
function Lv(r) {
  let t, e, i, s;
  const n = (
    /*#slots*/
    r[7].default
  ), o = Dl(
    n,
    r,
    /*$$scope*/
    r[6],
    vl
  );
  return {
    c() {
      t = ut("g"), o && o.c(), b(t, "class", "a9s-annotation selected");
    },
    m(a, h) {
      Q(a, t, h), o && o.m(t, null), e = !0, i || (s = [
        wt(
          t,
          "pointerup",
          /*onRelease*/
          r[2]
        ),
        wt(
          t,
          "pointermove",
          /*onPointerMove*/
          r[1]
        )
      ], i = !0);
    },
    p(a, [h]) {
      o && o.p && (!e || h & /*$$scope*/
      64) && Ll(
        o,
        n,
        a,
        /*$$scope*/
        a[6],
        e ? Ol(
          n,
          /*$$scope*/
          a[6],
          h,
          Ov
        ) : Nl(
          /*$$scope*/
          a[6]
        ),
        vl
      );
    },
    i(a) {
      e || (ot(o, a), e = !0);
    },
    o(a) {
      ft(o, a), e = !1;
    },
    d(a) {
      a && Z(t), o && o.d(a), i = !1, Le(s);
    }
  };
}
function Nv(r, t, e) {
  let { $$slots: i = {}, $$scope: s } = t;
  const n = zs();
  let { shape: o } = t, { editor: a } = t, { transform: h } = t, l = null, c, u = null;
  const d = (m) => (g) => {
    l = m, c = h.elementToImage(g.offsetX, g.offsetY), u = o, g.target.setPointerCapture(g.pointerId), n("grab");
  }, f = (m) => {
    if (l) {
      const [g, y] = h.elementToImage(m.offsetX, m.offsetY), v = [g - c[0], y - c[1]];
      e(3, o = a(u, l, v)), n("change", o);
    }
  }, p = (m) => {
    m.target.releasePointerCapture(m.pointerId), l = null, u = o, n("release");
  };
  return r.$$set = (m) => {
    "shape" in m && e(3, o = m.shape), "editor" in m && e(4, a = m.editor), "transform" in m && e(5, h = m.transform), "$$scope" in m && e(6, s = m.$$scope);
  }, [d, f, p, o, a, h, s, i];
}
class rn extends Xt {
  constructor(t) {
    super(), Vt(this, t, Nv, Lv, Ut, { shape: 3, editor: 4, transform: 5 });
  }
}
function kv(r, t, e) {
  let i;
  const s = zs();
  let { annotation: n } = t, { editor: o } = t, { style: a = void 0 } = t, { target: h } = t, { transform: l } = t, { viewportScale: c } = t, u;
  return Xs(() => (e(6, u = new o({
    target: h,
    props: {
      shape: n.target.selector,
      computedStyle: i,
      transform: l,
      viewportScale: c
    }
  })), u.$on("change", (d) => {
    u.$$set({ shape: d.detail }), s("change", d.detail);
  }), u.$on("grab", (d) => s("grab", d.detail)), u.$on("release", (d) => s("release", d.detail)), () => {
    u.$destroy();
  })), r.$$set = (d) => {
    "annotation" in d && e(0, n = d.annotation), "editor" in d && e(1, o = d.editor), "style" in d && e(2, a = d.style), "target" in d && e(3, h = d.target), "transform" in d && e(4, l = d.transform), "viewportScale" in d && e(5, c = d.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*annotation, style*/
    5 && (i = Pu(n, a)), r.$$.dirty & /*annotation, editorComponent*/
    65 && n && (u == null || u.$set({ shape: n.target.selector })), r.$$.dirty & /*editorComponent, transform*/
    80 && u && u.$set({ transform: l }), r.$$.dirty & /*editorComponent, viewportScale*/
    96 && u && u.$set({ viewportScale: c });
  }, [n, o, a, h, l, c, u];
}
class Uv extends Xt {
  constructor(t) {
    super(), Vt(this, t, kv, null, Ut, {
      annotation: 0,
      editor: 1,
      style: 2,
      target: 3,
      transform: 4,
      viewportScale: 5
    });
  }
}
const Gv = (r) => {
  let t, e;
  if (r.nodeName === "CANVAS")
    t = r, e = t.getContext("2d", { willReadFrequently: !0 });
  else {
    const s = r;
    t = document.createElement("canvas"), t.width = s.width, t.height = s.height, e = t.getContext("2d", { willReadFrequently: !0 }), e.drawImage(s, 0, 0, s.width, s.height);
  }
  let i = 0;
  for (let s = 1; s < 10; s++)
    for (let n = 1; n < 10; n++) {
      const o = Math.round(n * t.width / 10), a = Math.round(s * t.height / 10), h = e.getImageData(o, a, 1, 1).data, l = (0.299 * h[0] + 0.587 * h[1] + 0.114 * h[2]) / 255;
      i += l;
    }
  return i / 81;
}, Hv = (r) => {
  const t = Gv(r), e = t > 0.6 ? "dark" : "light";
  return console.log(`[Annotorious] Image brightness: ${t.toFixed(1)}. Setting ${e} theme.`), e;
};
navigator.userAgent.indexOf("Mac OS X");
function Vv(r, t) {
  var e = r[0] - t[0], i = r[1] - t[1];
  return e * e + i * i;
}
function Xv(r, t, e) {
  var i = t[0], s = t[1], n = e[0] - i, o = e[1] - s;
  if (n !== 0 || o !== 0) {
    var a = ((r[0] - i) * n + (r[1] - s) * o) / (n * n + o * o);
    a > 1 ? (i = e[0], s = e[1]) : a > 0 && (i += n * a, s += o * a);
  }
  return n = r[0] - i, o = r[1] - s, n * n + o * o;
}
function zv(r, t) {
  for (var e = r[0], i = [e], s, n = 1, o = r.length; n < o; n++)
    s = r[n], Vv(s, e) > t && (i.push(s), e = s);
  return e !== s && i.push(s), i;
}
function qo(r, t, e, i, s) {
  for (var n = i, o, a = t + 1; a < e; a++) {
    var h = Xv(r[a], r[t], r[e]);
    h > n && (o = a, n = h);
  }
  n > i && (o - t > 1 && qo(r, t, o, i, s), s.push(r[o]), e - o > 1 && qo(r, o, e, i, s));
}
function Wv(r, t) {
  var e = r.length - 1, i = [r[0]];
  return qo(r, 0, e, t, i), i.push(r[e]), i;
}
function jv(r, t, e) {
  if (r.length <= 2)
    return r;
  var i = t !== void 0 ? t * t : 1;
  return r = e ? r : zv(r, i), r = Wv(r, i), r;
}
const $v = {
  size: 4,
  thinning: 0.3,
  smoothing: 0.5,
  streamline: 0.5,
  easing: (r) => r,
  start: {
    taper: 0,
    easing: (r) => r,
    cap: !0
  },
  end: {
    taper: 0,
    easing: (r) => r,
    cap: !0
  }
};
function Yv(r, t = !0) {
  if (!r.length)
    return [];
  const e = [["M", ...r[0]]];
  for (let i = 0; i < r.length; i++) {
    const [s, n] = r[i];
    e.push(["L", s, n]);
  }
  return r.length > 2 && e.push(["Z"]), e;
}
function qv(r, t, e) {
  const i = Ru(r, t);
  return Yv(
    e ? jv(i, 1) : i
  );
}
const Kv = 1733608, Zv = 0.25;
let Xe = !1, Ko;
const Zo = (r) => {
  const t = {
    tint: r != null && r.fill ? new pt(r.fill).toHex() : Kv,
    alpha: (r == null ? void 0 : r.fillOpacity) === void 0 ? Zv : Math.min(r.fillOpacity, 1)
  }, e = {
    tint: (r == null ? void 0 : r.stroke) && new pt(r.stroke).toHex(),
    alpha: (r == null ? void 0 : r.strokeOpacity) === void 0 ? r.stroke ? 1 : 0 : Math.min(r.strokeOpacity, 1),
    lineWidth: r != null && r.stroke ? (r == null ? void 0 : r.strokeWidth) || 1 : 0
  };
  return { fillStyle: t, strokeStyle: e };
}, sn = (r) => (t, e, i) => {
  const { fillStyle: s, strokeStyle: n } = Zo(i), o = new Mi();
  o.beginFill(16776960, 1), r(e, o), o.endFill(), o.tint = s.tint, o.alpha = s.alpha, t.addChild(o);
  const a = new Mi();
  return a.lineStyle({
    width: 4 * n.lineWidth / Ko,
    color: 255,
    alpha: 1,
    alignment: 1,
    native: !0,
    join: $t.MITER,
    miterLimit: 500
  }), r(e, a), a.tint = n.tint, a.alpha = n.alpha, t.addChild(a), {
    fill: o,
    stroke: a,
    strokeWidth: n.lineWidth
  };
}, Qv = sn((r, t) => {
  qv(
    r.geometry.points,
    $v,
    !1
  ).forEach((i) => {
    const [s, ...n] = i;
    switch (s) {
      case "M":
        t.moveTo(n[0], n[1]);
        break;
      case "L":
        t.beginFill(255, 1), t.lineTo(n[0], n[1]), t.moveTo(n[0], n[1]);
        break;
      case "C":
        t.bezierCurveTo(
          n[0],
          n[1],
          n[2],
          n[3],
          n[4],
          n[5]
        );
        break;
      case "Q":
        t.quadraticCurveTo(n[0], n[1], n[2], n[3]), t.moveTo(n[0], n[1]);
        break;
      case "Z":
        t.closePath();
        break;
      default:
        console.warn(`Unhandled path command: ${s}`);
        break;
    }
  });
}), Jv = sn((r, t) => {
  const { cx: e, cy: i, rx: s, ry: n } = r.geometry;
  t.drawEllipse(e, i, s, n);
}), t1 = sn((r, t) => {
  const e = r.geometry.points.reduce(
    (i, s) => [...i, ...s],
    []
  );
  t.drawPolygon(e);
}), e1 = sn((r, t) => {
  const { x: e, y: i, w: s, h: n } = r.geometry;
  t.drawRoundedRect(e, i, s, n, 4);
}), r1 = (r, t, e, i) => () => {
  const s = r.viewport.viewportToImageRectangle(
    r.viewport.getBounds(!0)
  ), n = r.viewport.getContainerSize().x, a = r.viewport.getZoom(!0) * n / r.world.getContentFactor();
  a !== Ko && !Xe && (Xe = !0, e.forEach(({ stroke: f, strokeWidth: p }) => {
    const { lineStyle: m } = f.geometry.graphicsData[0];
    p > 1 ? (Xe = !1, m.width = p / a, f.geometry.invalidate()) : p === 1 && !m.native && (m.width = 1, m.native = !0, f.geometry.invalidate());
  })), Ko = a;
  const h = Math.PI * r.viewport.getRotation() / 180, l = -s.x * a, c = -s.y * a;
  let u, d;
  h > 0 && h <= Math.PI / 2 ? (u = s.height * a, d = 0) : h > Math.PI / 2 && h <= Math.PI ? (u = s.width * a, d = s.height * a) : h > Math.PI && h <= Math.PI * 1.5 ? (u = 0, d = s.width * a) : (u = 0, d = 0), t.position.x = u + l * Math.cos(h) - c * Math.sin(h), t.position.y = d + l * Math.sin(h) + c * Math.cos(h), t.scale.set(a, a), t.rotation = h, i.render(t);
}, i1 = (r, t) => {
  const e = new Mi(), i = $c({
    width: t.width,
    height: t.height,
    backgroundAlpha: 0,
    view: t,
    antialias: !0,
    resolution: 2
  }), s = /* @__PURE__ */ new Map();
  let n = /* @__PURE__ */ new Set(), o;
  const a = (m) => {
    Xe = !1;
    const { selector: g } = m.target, y = typeof o == "function" ? o(m) : o;
    let v;
    g.type === qt.RECTANGLE ? v = e1(e, g, y) : g.type === qt.POLYGON ? v = t1(e, g, y) : g.type === qt.FREEHAND ? v = Qv(e, g, y) : g.type === qt.ELLIPSE ? v = Jv(e, g, y) : console.warn(`Unsupported shape type: ${g.type}`), v && s.set(m.id, { annotation: m, ...v });
  }, h = (m) => {
    const g = s.get(m.id);
    g && (s.delete(m.id), g.fill.destroy(), g.stroke.destroy());
  }, l = (m, g) => {
    Xe = !1;
    const y = s.get(m.id);
    y && (s.delete(m.id), y.fill.destroy(), y.stroke.destroy(), a(g));
  }, c = (m, g) => {
    i.resize(m, g), i.render(e);
  }, u = (m) => {
    Xe = !1;
    const { children: g } = e;
    s.forEach(({ fill: y, stroke: v, annotation: _ }) => {
      const x = m ? n.has(_.id) || m(_) : !0;
      x && !g.includes(y) ? (e.addChild(y), e.addChild(v)) : !x && g.includes(y) && (e.removeChild(y), e.removeChild(v));
    }), i.render(e);
  }, d = (m) => {
    const { selected: g } = m;
    n = new Set(g.map((y) => y.id));
  }, f = (m) => {
    if (typeof m == "function")
      s.forEach(
        ({ annotation: g, fill: y, stroke: v, strokeWidth: _ }, x) => {
          _ > 1 && (Xe = !1);
          const { fillStyle: T, strokeStyle: C } = Zo(m(g));
          y.tint = T.tint, y.alpha = T.alpha, v.tint = C.tint, v.alpha = C.alpha, s.set(g.id, {
            annotation: g,
            fill: y,
            stroke: v,
            strokeWidth: _
          });
        }
      );
    else {
      const { fillStyle: g, strokeStyle: y } = Zo(m);
      y.lineWidth > 1 && (Xe = !1), s.forEach(
        ({ annotation: v, fill: _, stroke: x, strokeWidth: T }, C) => {
          _.tint = g.tint, _.alpha = g.alpha, x.tint = y.tint, x.alpha = y.alpha, s.set(v.id, {
            annotation: v,
            fill: _,
            stroke: x,
            strokeWidth: T
          });
        }
      );
    }
    o = m, i.render(e);
  };
  return {
    addAnnotation: a,
    destroy: () => i.destroy(),
    redraw: r1(r, e, s, i),
    removeAnnotation: h,
    resize: c,
    setFilter: u,
    setSelected: d,
    setStyle: f,
    updateAnnotation: l
  };
};
function s1(r, t, e) {
  let i, s, { filter: n = void 0 } = t, { state: o } = t, { style: a = void 0 } = t, { viewer: h } = t;
  const { store: l, hover: c, selection: u, viewport: d } = o;
  $n(r, c, (T) => e(10, i = T)), $n(r, u, (T) => e(7, s = T));
  const f = zs();
  let p, m = !1;
  const g = (T) => {
    const C = new Ts.Point(T.x, T.y), { x: w, y: I } = h.viewport.pointFromPixel(C);
    return h.viewport.viewportToImageCoordinates(w, I);
  }, y = (T) => (C) => {
    const { x: w, y: I } = g(new Ts.Point(C.offsetX, C.offsetY)), S = l.getAt(w, I);
    S && (!n || n(S)) ? (T.classList.add("hover"), i !== S.id && c.set(S.id)) : (T.classList.remove("hover"), i && c.set(null));
  }, v = (T) => {
    const C = T.originalEvent;
    if (!m) {
      const { x: w, y: I } = g(T.position), S = l.getAt(w, I);
      S ? f("click", { originalEvent: C, annotation: S }) : f("click", { originalEvent: C });
    }
    m = !1;
  }, _ = () => m = !0;
  let x;
  return Xs(() => {
    const { offsetWidth: T, offsetHeight: C } = h.canvas, w = document.createElement("canvas");
    w.width = T, w.height = C, w.className = "a9s-gl-canvas", h.element.querySelector(".openseadragon-canvas").appendChild(w), e(6, p = i1(h, w));
    const I = y(w);
    w.addEventListener("pointermove", I), new ResizeObserver((O) => {
      try {
        const { width: M, height: E } = O[0].contentRect;
        w.width = M, w.height = E, p.resize(M, E);
      } catch {
        console.warn("WebGL canvas already disposed");
      }
    }).observe(w);
    const P = () => {
      const O = h.viewport.getBounds();
      x = h.viewport.viewportToImageRectangle(O);
      const { x: M, y: E, width: A, height: R } = x, X = l.getIntersecting(M, E, A, R);
      d.set(X.map((D) => D.id));
    };
    return h.addHandler("canvas-drag", _), h.addHandler("canvas-release", v), h.addHandler("update-viewport", p.redraw), h.addHandler("animation-finish", P), () => {
      w.removeEventListener("pointermove", I), h.removeHandler("canvas-drag", _), h.removeHandler("canvas-release", v), h.removeHandler("update-viewport", p.redraw), h.removeHandler("animation-finish", P), p.destroy(), w.parentNode.removeChild(w);
    };
  }), l.observe((T) => {
    const { created: C, updated: w, deleted: I } = T.changes;
    if (C.forEach((S) => p.addAnnotation(S)), w.forEach(({ oldValue: S, newValue: P }) => p.updateAnnotation(S, P)), I.forEach((S) => p.removeAnnotation(S)), x) {
      const { x: S, y: P, width: O, height: M } = x, E = l.getIntersecting(S, P, O, M);
      d.set(E.map((A) => A.id));
    } else
      d.set(l.all().map((S) => S.id));
    p.redraw();
  }), r.$$set = (T) => {
    "filter" in T && e(2, n = T.filter), "state" in T && e(3, o = T.state), "style" in T && e(4, a = T.style), "viewer" in T && e(5, h = T.viewer);
  }, r.$$.update = () => {
    r.$$.dirty & /*stage, filter*/
    68 && (p == null || p.setFilter(n)), r.$$.dirty & /*stage, $selection*/
    192 && (p == null || p.setSelected(s)), r.$$.dirty & /*stage, style*/
    80 && (p == null || p.setStyle(a));
  }, [c, u, n, o, a, h, p, s];
}
class n1 extends Xt {
  constructor(t) {
    super(), Vt(this, t, s1, null, Ut, { filter: 2, state: 3, style: 4, viewer: 5 });
  }
}
const o1 = (r) => ({
  transform: r & /*layerTransform*/
  2,
  scale: r & /*scale*/
  1
}), xl = (r) => ({
  transform: (
    /*layerTransform*/
    r[1]
  ),
  scale: (
    /*scale*/
    r[0]
  )
});
function a1(r) {
  let t;
  const e = (
    /*#slots*/
    r[4].default
  ), i = Dl(
    e,
    r,
    /*$$scope*/
    r[3],
    xl
  );
  return {
    c() {
      i && i.c();
    },
    m(s, n) {
      i && i.m(s, n), t = !0;
    },
    p(s, [n]) {
      i && i.p && (!t || n & /*$$scope, layerTransform, scale*/
      11) && Ll(
        i,
        e,
        s,
        /*$$scope*/
        s[3],
        t ? Ol(
          e,
          /*$$scope*/
          s[3],
          n,
          o1
        ) : Nl(
          /*$$scope*/
          s[3]
        ),
        xl
      );
    },
    i(s) {
      t || (ot(i, s), t = !0);
    },
    o(s) {
      ft(i, s), t = !1;
    },
    d(s) {
      i && i.d(s);
    }
  };
}
function h1(r, t, e) {
  let { $$slots: i = {}, $$scope: s } = t, { viewer: n } = t, o = 1, a;
  const h = () => {
    const l = n.viewport.getContainerSize().x, c = n.viewport.getZoom(!0), u = n.viewport.getFlip(), d = n.viewport.pixelFromPoint(new Ts.Point(0, 0), !0);
    u && (d.x = l - d.x);
    const f = c * l / n.world.getContentFactor(), p = u ? -f : f, m = n.viewport.getRotation();
    e(1, a = `translate(${d.x}, ${d.y}) scale(${p}, ${f}) rotate(${m})`), e(0, o = c * l / n.world.getContentFactor());
  };
  return Xs(() => (n.addHandler("update-viewport", h), () => {
    n.removeHandler("update-viewport", h);
  })), r.$$set = (l) => {
    "viewer" in l && e(2, n = l.viewer), "$$scope" in l && e(3, s = l.$$scope);
  }, [o, a, n, s, i];
}
class Mu extends Xt {
  constructor(t) {
    super(), Vt(this, t, h1, a1, Ut, { viewer: 2 });
  }
}
function l1(r, t, e) {
  const i = zs();
  let { drawingMode: s } = t, { target: n } = t, { tool: o } = t, { transform: a } = t, { viewer: h } = t, { viewportScale: l } = t, c;
  return Xs(() => {
    const u = n.closest("svg"), d = [], f = (p, m, g) => {
      if (u.addEventListener(p, m, g), d.push(() => u.removeEventListener(p, m, g)), p === "pointerup" || p === "dblclick") {
        const y = (_) => {
          const { originalEvent: x } = _;
          m(x);
        }, v = p === "pointerup" ? "canvas-click" : "canvas-double-click";
        h.addHandler(v, y), d.push(() => h.removeHandler(v, y));
      } else if (p === "pointermove") {
        const y = (v) => {
          const { originalEvent: _ } = v;
          m(_);
        };
        h.addHandler("canvas-drag", y), d.push(() => h.removeHandler("canvas-drag", y));
      }
    };
    return e(6, c = new o({
      target: n,
      props: {
        addEventListener: f,
        drawingMode: s,
        transform: a,
        viewportScale: l
      }
    })), c.$on("create", (p) => i("create", p.detail)), () => {
      d.forEach((p) => p()), c.$destroy();
    };
  }), r.$$set = (u) => {
    "drawingMode" in u && e(0, s = u.drawingMode), "target" in u && e(1, n = u.target), "tool" in u && e(2, o = u.tool), "transform" in u && e(3, a = u.transform), "viewer" in u && e(4, h = u.viewer), "viewportScale" in u && e(5, l = u.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*toolComponent, transform*/
    72 && c && c.$set({ transform: a }), r.$$.dirty & /*toolComponent, viewportScale*/
    96 && c && c.$set({ viewportScale: l });
  }, [s, n, o, a, h, l, c];
}
class c1 extends Xt {
  constructor(t) {
    super(), Vt(this, t, l1, null, Ut, {
      drawingMode: 0,
      target: 1,
      tool: 2,
      transform: 3,
      viewer: 4,
      viewportScale: 5
    });
  }
}
function bl(r, t, e) {
  const i = r.slice();
  return i[24] = t[e], i;
}
function u1(r) {
  let t = (
    /*toolName*/
    r[1]
  ), e, i, s = Tl(r);
  return {
    c() {
      s.c(), e = Er();
    },
    m(n, o) {
      s.m(n, o), Q(n, e, o), i = !0;
    },
    p(n, o) {
      o & /*toolName*/
      2 && Ut(t, t = /*toolName*/
      n[1]) ? (Je(), ft(s, 1, 1, qe), tr(), s = Tl(n), s.c(), ot(s, 1), s.m(e.parentNode, e)) : s.p(n, o);
    },
    i(n) {
      i || (ot(s), i = !0);
    },
    o(n) {
      ft(s), i = !1;
    },
    d(n) {
      n && Z(e), s.d(n);
    }
  };
}
function d1(r) {
  let t, e, i = Zr(
    /*editableAnnotations*/
    r[5]
  ), s = [];
  for (let o = 0; o < i.length; o += 1)
    s[o] = wl(bl(r, i, o));
  const n = (o) => ft(s[o], 1, 1, () => {
    s[o] = null;
  });
  return {
    c() {
      for (let o = 0; o < s.length; o += 1)
        s[o].c();
      t = Er();
    },
    m(o, a) {
      for (let h = 0; h < s.length; h += 1)
        s[h] && s[h].m(o, a);
      Q(o, t, a), e = !0;
    },
    p(o, a) {
      if (a & /*editableAnnotations, drawingEl, toolTransform, scale, onGrab, onChangeSelected, onRelease*/
      8392496) {
        i = Zr(
          /*editableAnnotations*/
          o[5]
        );
        let h;
        for (h = 0; h < i.length; h += 1) {
          const l = bl(o, i, h);
          s[h] ? (s[h].p(l, a), ot(s[h], 1)) : (s[h] = wl(l), s[h].c(), ot(s[h], 1), s[h].m(t.parentNode, t));
        }
        for (Je(), h = i.length; h < s.length; h += 1)
          n(h);
        tr();
      }
    },
    i(o) {
      if (!e) {
        for (let a = 0; a < i.length; a += 1)
          ot(s[a]);
        e = !0;
      }
    },
    o(o) {
      s = s.filter(Boolean);
      for (let a = 0; a < s.length; a += 1)
        ft(s[a]);
      e = !1;
    },
    d(o) {
      o && Z(t), Jo(s, o);
    }
  };
}
function Tl(r) {
  let t, e;
  return t = new c1({
    props: {
      target: (
        /*drawingEl*/
        r[4]
      ),
      tool: (
        /*tool*/
        r[6]
      ),
      drawingMode: (
        /*drawingMode*/
        r[3]
      ),
      transform: { elementToImage: (
        /*toolTransform*/
        r[8]
      ) },
      viewer: (
        /*viewer*/
        r[2]
      ),
      viewportScale: (
        /*scale*/
        r[23]
      )
    }
  }), t.$on(
    "create",
    /*onSelectionCreated*/
    r[12]
  ), {
    c() {
      re(t.$$.fragment);
    },
    m(i, s) {
      Kt(t, i, s), e = !0;
    },
    p(i, s) {
      const n = {};
      s & /*drawingEl*/
      16 && (n.target = /*drawingEl*/
      i[4]), s & /*tool*/
      64 && (n.tool = /*tool*/
      i[6]), s & /*drawingMode*/
      8 && (n.drawingMode = /*drawingMode*/
      i[3]), s & /*viewer*/
      4 && (n.viewer = /*viewer*/
      i[2]), s & /*scale*/
      8388608 && (n.viewportScale = /*scale*/
      i[23]), t.$set(n);
    },
    i(i) {
      e || (ot(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Zt(t, i);
    }
  };
}
function El(r) {
  let t, e;
  return t = new Uv({
    props: {
      target: (
        /*drawingEl*/
        r[4]
      ),
      editor: va(
        /*editable*/
        r[24].target.selector
      ),
      annotation: (
        /*editable*/
        r[24]
      ),
      transform: { elementToImage: (
        /*toolTransform*/
        r[8]
      ) },
      viewportScale: (
        /*scale*/
        r[23]
      )
    }
  }), t.$on(
    "grab",
    /*onGrab*/
    r[9]
  ), t.$on("change", function() {
    bt(
      /*onChangeSelected*/
      r[11](
        /*editable*/
        r[24]
      )
    ) && r[11](
      /*editable*/
      r[24]
    ).apply(this, arguments);
  }), t.$on(
    "release",
    /*onRelease*/
    r[10]
  ), {
    c() {
      re(t.$$.fragment);
    },
    m(i, s) {
      Kt(t, i, s), e = !0;
    },
    p(i, s) {
      r = i;
      const n = {};
      s & /*drawingEl*/
      16 && (n.target = /*drawingEl*/
      r[4]), s & /*editableAnnotations*/
      32 && (n.editor = va(
        /*editable*/
        r[24].target.selector
      )), s & /*editableAnnotations*/
      32 && (n.annotation = /*editable*/
      r[24]), s & /*scale*/
      8388608 && (n.viewportScale = /*scale*/
      r[23]), t.$set(n);
    },
    i(i) {
      e || (ot(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Zt(t, i);
    }
  };
}
function wl(r) {
  let t = (
    /*editable*/
    r[24].id
  ), e, i, s = El(r);
  return {
    c() {
      s.c(), e = Er();
    },
    m(n, o) {
      s.m(n, o), Q(n, e, o), i = !0;
    },
    p(n, o) {
      o & /*editableAnnotations*/
      32 && Ut(t, t = /*editable*/
      n[24].id) ? (Je(), ft(s, 1, 1, qe), tr(), s = El(n), s.c(), ot(s, 1), s.m(e.parentNode, e)) : s.p(n, o);
    },
    i(n) {
      i || (ot(s), i = !0);
    },
    o(n) {
      ft(s), i = !1;
    },
    d(n) {
      n && Z(e), s.d(n);
    }
  };
}
function f1(r) {
  let t, e, i, s, n, o;
  const a = [d1, u1], h = [];
  function l(c, u) {
    return (
      /*drawingEl*/
      c[4] && /*editableAnnotations*/
      c[5] ? 0 : (
        /*drawingEl*/
        c[4] && /*tool*/
        c[6] && /*drawingEnabled*/
        c[0] ? 1 : -1
      )
    );
  }
  return ~(i = l(r)) && (s = h[i] = a[i](r)), {
    c() {
      t = ut("svg"), e = ut("g"), s && s.c(), b(e, "transform", n = /*transform*/
      r[22]), b(e, "class", "svelte-190cqdf"), b(t, "class", "a9s-annotationlayer a9s-osd-drawinglayer svelte-190cqdf"), Ea(
        t,
        "drawing",
        /*drawingEnabled*/
        r[0]
      );
    },
    m(c, u) {
      Q(c, t, u), mr(t, e), ~i && h[i].m(e, null), r[18](e), o = !0;
    },
    p(c, u) {
      let d = i;
      i = l(c), i === d ? ~i && h[i].p(c, u) : (s && (Je(), ft(h[d], 1, 1, () => {
        h[d] = null;
      }), tr()), ~i ? (s = h[i], s ? s.p(c, u) : (s = h[i] = a[i](c), s.c()), ot(s, 1), s.m(e, null)) : s = null), (!o || u & /*transform*/
      4194304 && n !== (n = /*transform*/
      c[22])) && b(e, "transform", n), (!o || u & /*drawingEnabled*/
      1) && Ea(
        t,
        "drawing",
        /*drawingEnabled*/
        c[0]
      );
    },
    i(c) {
      o || (ot(s), o = !0);
    },
    o(c) {
      ft(s), o = !1;
    },
    d(c) {
      c && Z(t), ~i && h[i].d(), r[18](null);
    }
  };
}
function p1(r) {
  let t, e;
  return t = new Mu({
    props: {
      viewer: (
        /*viewer*/
        r[2]
      ),
      $$slots: {
        default: [
          f1,
          ({ transform: i, scale: s }) => ({ 22: i, 23: s }),
          ({ transform: i, scale: s }) => (i ? 4194304 : 0) | (s ? 8388608 : 0)
        ]
      },
      $$scope: { ctx: r }
    }
  }), {
    c() {
      re(t.$$.fragment);
    },
    m(i, s) {
      Kt(t, i, s), e = !0;
    },
    p(i, [s]) {
      const n = {};
      s & /*viewer*/
      4 && (n.viewer = /*viewer*/
      i[2]), s & /*$$scope, drawingEnabled, transform, drawingEl, editableAnnotations, scale, toolName, tool, drawingMode, viewer*/
      146800767 && (n.$$scope = { dirty: s, ctx: i }), t.$set(n);
    },
    i(i) {
      e || (ot(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Zt(t, i);
    }
  };
}
function m1(r, t, e) {
  let i, s, n, o, { drawingEnabled: a } = t, { preferredDrawingMode: h } = t, { state: l } = t, { toolName: c = Wn().length > 0 ? Wn()[0] : void 0 } = t, { user: u } = t, { viewer: d } = t, f;
  const { store: p, selection: m } = l;
  $n(r, m, (S) => e(17, o = S));
  let g = null, y = null;
  const v = (S) => {
    p.unobserve(g);
    const P = S.filter(({ editable: O }) => O).map(({ id: O }) => O);
    P.length > 0 ? (e(5, y = P.map((O) => p.getAnnotation(O))), g = (O) => {
      const { updated: M } = O.changes;
      e(5, y = M.map((E) => E.newValue));
    }, p.observe(g, { annotations: P })) : e(5, y = null);
  }, _ = (S, P) => {
    const { x: O, y: M } = d.viewport.viewerElementToImageCoordinates(new Ts.Point(S, P));
    return [O, M];
  }, x = () => d.setMouseNavEnabled(!1), T = () => d.setMouseNavEnabled(!0), C = (S) => (P) => {
    var A;
    const { target: O } = S, M = 10 * 60 * 1e3, E = ((A = O.creator) == null ? void 0 : A.id) !== u.id || !O.created || (/* @__PURE__ */ new Date()).getTime() - O.created.getTime() > M;
    p.updateTarget({
      ...O,
      selector: P.detail,
      created: E ? O.created : /* @__PURE__ */ new Date(),
      updated: E ? /* @__PURE__ */ new Date() : null,
      updatedBy: E ? u : null
    });
  }, w = (S) => {
    const P = _v(), O = {
      id: P,
      bodies: [],
      target: {
        annotation: P,
        selector: S.detail,
        creator: u,
        created: /* @__PURE__ */ new Date()
      }
    };
    p.addAnnotation(O), m.setSelected(O.id), d.setMouseNavEnabled(!0);
  };
  function I(S) {
    Es[S ? "unshift" : "push"](() => {
      f = S, e(4, f);
    });
  }
  return r.$$set = (S) => {
    "drawingEnabled" in S && e(0, a = S.drawingEnabled), "preferredDrawingMode" in S && e(13, h = S.preferredDrawingMode), "state" in S && e(14, l = S.state), "toolName" in S && e(1, c = S.toolName), "user" in S && e(15, u = S.user), "viewer" in S && e(2, d = S.viewer);
  }, r.$$.update = () => {
    r.$$.dirty & /*toolName*/
    2 && e(6, { tool: i, opts: s } = Ml(c), i, (e(16, s), e(1, c))), r.$$.dirty & /*opts, preferredDrawingMode*/
    73728 && e(3, n = (s == null ? void 0 : s.drawingMode) || h), r.$$.dirty & /*drawingEnabled, drawingMode, viewer*/
    13 && (a && n === "drag" ? d.setMouseNavEnabled(!1) : d.setMouseNavEnabled(!0)), r.$$.dirty & /*drawingEnabled*/
    1 && a && m.clear(), r.$$.dirty & /*$selection, drawingMode, drawingEnabled, viewer*/
    131085 && o.selected.length === 0 && n === "drag" && a && d.setMouseNavEnabled(!1), r.$$.dirty & /*$selection*/
    131072 && v(o.selected);
  }, [
    a,
    c,
    d,
    n,
    f,
    y,
    i,
    m,
    _,
    x,
    T,
    C,
    w,
    h,
    l,
    u,
    s,
    o,
    I
  ];
}
class g1 extends Xt {
  constructor(t) {
    super(), Vt(this, t, m1, p1, Ut, {
      drawingEnabled: 0,
      preferredDrawingMode: 13,
      state: 14,
      toolName: 1,
      user: 15,
      viewer: 2
    });
  }
}
function y1(r) {
  let t, e, i, s, n, o, a, h = (
    /*user*/
    r[2].appearance.label + ""
  ), l, c, u, d;
  return {
    c() {
      t = ut("g"), e = ut("rect"), a = ut("text"), l = ta(h), b(e, "class", "a9s-presence-label-bg svelte-1rehw2p"), b(
        e,
        "x",
        /*x*/
        r[0]
      ), b(e, "y", i = /*y*/
      r[1] - 18 / /*scale*/
      r[3]), b(e, "height", s = 18 / /*scale*/
      r[3]), b(e, "fill", n = /*user*/
      r[2].appearance.color), b(e, "stroke", o = /*user*/
      r[2].appearance.color), b(a, "font-size", c = 12 / /*scale*/
      r[3]), b(a, "x", u = /*x*/
      r[0] + Math.round(5 / /*scale*/
      r[3])), b(a, "y", d = /*y*/
      r[1] - 5 / /*scale*/
      r[3]), b(a, "class", "svelte-1rehw2p"), b(t, "class", "a9s-presence-label");
    },
    m(f, p) {
      Q(f, t, p), mr(t, e), mr(t, a), mr(a, l), r[6](t);
    },
    p(f, [p]) {
      p & /*x*/
      1 && b(
        e,
        "x",
        /*x*/
        f[0]
      ), p & /*y, scale*/
      10 && i !== (i = /*y*/
      f[1] - 18 / /*scale*/
      f[3]) && b(e, "y", i), p & /*scale*/
      8 && s !== (s = 18 / /*scale*/
      f[3]) && b(e, "height", s), p & /*user*/
      4 && n !== (n = /*user*/
      f[2].appearance.color) && b(e, "fill", n), p & /*user*/
      4 && o !== (o = /*user*/
      f[2].appearance.color) && b(e, "stroke", o), p & /*user*/
      4 && h !== (h = /*user*/
      f[2].appearance.label + "") && xd(l, h), p & /*scale*/
      8 && c !== (c = 12 / /*scale*/
      f[3]) && b(a, "font-size", c), p & /*x, scale*/
      9 && u !== (u = /*x*/
      f[0] + Math.round(5 / /*scale*/
      f[3])) && b(a, "x", u), p & /*y, scale*/
      10 && d !== (d = /*y*/
      f[1] - 5 / /*scale*/
      f[3]) && b(a, "y", d);
    },
    i: qe,
    o: qe,
    d(f) {
      f && Z(t), r[6](null);
    }
  };
}
function _1(r, t, e) {
  let { x: i } = t, { y: s } = t, { user: n } = t, { scale: o } = t, { hAlign: a = null } = t, h;
  const l = (u) => {
    const d = h.querySelector("text"), f = h.querySelector("rect"), p = d.getBBox().width + 10 / u;
    a === "CENTER" && h.setAttribute("style", `transform: translateX(-${p / 2}px)`), f.setAttribute("width", `${p}`);
  };
  function c(u) {
    Es[u ? "unshift" : "push"](() => {
      h = u, e(4, h);
    });
  }
  return r.$$set = (u) => {
    "x" in u && e(0, i = u.x), "y" in u && e(1, s = u.y), "user" in u && e(2, n = u.user), "scale" in u && e(3, o = u.scale), "hAlign" in u && e(5, a = u.hAlign);
  }, r.$$.update = () => {
    r.$$.dirty & /*g, scale*/
    24 && h && l(o);
  }, [i, s, n, o, h, a, c];
}
class Bu extends Xt {
  constructor(t) {
    super(), Vt(this, t, _1, y1, Ut, { x: 0, y: 1, user: 2, scale: 3, hAlign: 5 });
  }
}
function v1(r) {
  let t, e, i, s, n, o;
  return e = new Bu({
    props: {
      scale: (
        /*scale*/
        r[1]
      ),
      user: (
        /*user*/
        r[0]
      ),
      x: (
        /*origin*/
        r[3][0]
      ),
      y: (
        /*origin*/
        r[3][1]
      ),
      hAlign: "CENTER"
    }
  }), {
    c() {
      t = ut("g"), re(e.$$.fragment), i = ut("polygon"), b(i, "class", "a9s-presence-shape a9s-presence-polygon svelte-fgq4n0"), b(i, "stroke", s = /*user*/
      r[0].appearance.color), b(i, "fill", "transparent"), b(i, "points", n = /*geom*/
      r[2].points.map(Al).join(" ")), b(t, "class", "a9s-presence-overlay");
    },
    m(a, h) {
      Q(a, t, h), Kt(e, t, null), mr(t, i), o = !0;
    },
    p(a, [h]) {
      const l = {};
      h & /*scale*/
      2 && (l.scale = /*scale*/
      a[1]), h & /*user*/
      1 && (l.user = /*user*/
      a[0]), h & /*origin*/
      8 && (l.x = /*origin*/
      a[3][0]), h & /*origin*/
      8 && (l.y = /*origin*/
      a[3][1]), e.$set(l), (!o || h & /*user*/
      1 && s !== (s = /*user*/
      a[0].appearance.color)) && b(i, "stroke", s), (!o || h & /*geom*/
      4 && n !== (n = /*geom*/
      a[2].points.map(Al).join(" "))) && b(i, "points", n);
    },
    i(a) {
      o || (ot(e.$$.fragment, a), o = !0);
    },
    o(a) {
      ft(e.$$.fragment, a), o = !1;
    },
    d(a) {
      a && Z(t), Zt(e);
    }
  };
}
const Al = (r) => r.join(",");
function x1(r, t, e) {
  let i, s, { annotation: n } = t, { user: o } = t, { scale: a } = t;
  const h = (l) => {
    let [c, ...u] = l.points;
    return u.forEach(([d, f]) => {
      f < c[1] && (c = [d, f]);
    }), c;
  };
  return r.$$set = (l) => {
    "annotation" in l && e(4, n = l.annotation), "user" in l && e(0, o = l.user), "scale" in l && e(1, a = l.scale);
  }, r.$$.update = () => {
    r.$$.dirty & /*annotation*/
    16 && e(2, i = n.target.selector.geometry), r.$$.dirty & /*geom*/
    4 && e(3, s = h(i));
  }, [o, a, i, s, n];
}
class b1 extends Xt {
  constructor(t) {
    super(), Vt(this, t, x1, v1, Ut, { annotation: 4, user: 0, scale: 1 });
  }
}
function T1(r) {
  let t, e, i, s, n, o, a, h, l;
  return e = new Bu({
    props: {
      scale: (
        /*scale*/
        r[1]
      ),
      user: (
        /*user*/
        r[0]
      ),
      x: (
        /*geom*/
        r[2].x
      ),
      y: (
        /*geom*/
        r[2].y
      )
    }
  }), {
    c() {
      t = ut("g"), re(e.$$.fragment), i = ut("rect"), b(i, "class", "a9s-presence-shape a9s-presence-rectangle svelte-gze948"), b(i, "stroke", s = /*user*/
      r[0].appearance.color), b(i, "fill", "transparent"), b(i, "x", n = /*geom*/
      r[2].x), b(i, "y", o = /*geom*/
      r[2].y), b(i, "width", a = /*geom*/
      r[2].w), b(i, "height", h = /*geom*/
      r[2].h), b(t, "class", "a9s-presence-overlay");
    },
    m(c, u) {
      Q(c, t, u), Kt(e, t, null), mr(t, i), l = !0;
    },
    p(c, [u]) {
      const d = {};
      u & /*scale*/
      2 && (d.scale = /*scale*/
      c[1]), u & /*user*/
      1 && (d.user = /*user*/
      c[0]), u & /*geom*/
      4 && (d.x = /*geom*/
      c[2].x), u & /*geom*/
      4 && (d.y = /*geom*/
      c[2].y), e.$set(d), (!l || u & /*user*/
      1 && s !== (s = /*user*/
      c[0].appearance.color)) && b(i, "stroke", s), (!l || u & /*geom*/
      4 && n !== (n = /*geom*/
      c[2].x)) && b(i, "x", n), (!l || u & /*geom*/
      4 && o !== (o = /*geom*/
      c[2].y)) && b(i, "y", o), (!l || u & /*geom*/
      4 && a !== (a = /*geom*/
      c[2].w)) && b(i, "width", a), (!l || u & /*geom*/
      4 && h !== (h = /*geom*/
      c[2].h)) && b(i, "height", h);
    },
    i(c) {
      l || (ot(e.$$.fragment, c), l = !0);
    },
    o(c) {
      ft(e.$$.fragment, c), l = !1;
    },
    d(c) {
      c && Z(t), Zt(e);
    }
  };
}
function E1(r, t, e) {
  let i, { annotation: s } = t, { user: n } = t, { scale: o } = t;
  return r.$$set = (a) => {
    "annotation" in a && e(3, s = a.annotation), "user" in a && e(0, n = a.user), "scale" in a && e(1, o = a.scale);
  }, r.$$.update = () => {
    r.$$.dirty & /*annotation*/
    8 && e(2, i = s.target.selector.geometry);
  }, [n, o, i, s];
}
class w1 extends Xt {
  constructor(t) {
    super(), Vt(this, t, E1, T1, Ut, { annotation: 3, user: 0, scale: 1 });
  }
}
const { Boolean: A1 } = _d;
function Sl(r, t, e) {
  const i = r.slice();
  return i[8] = t[e], i;
}
function Il(r) {
  let t, e;
  return t = new Mu({
    props: {
      viewer: (
        /*viewer*/
        r[0]
      ),
      $$slots: {
        default: [
          C1,
          ({ transform: i, scale: s }) => ({ 6: i, 7: s }),
          ({ transform: i, scale: s }) => (i ? 64 : 0) | (s ? 128 : 0)
        ]
      },
      $$scope: { ctx: r }
    }
  }), {
    c() {
      re(t.$$.fragment);
    },
    m(i, s) {
      Kt(t, i, s), e = !0;
    },
    p(i, s) {
      const n = {};
      s & /*viewer*/
      1 && (n.viewer = /*viewer*/
      i[0]), s & /*$$scope, transform, trackedAnnotations, scale*/
      2244 && (n.$$scope = { dirty: s, ctx: i }), t.$set(n);
    },
    i(i) {
      e || (ot(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Zt(t, i);
    }
  };
}
function Cl(r) {
  let t, e, i = Zr(
    /*trackedAnnotations*/
    r[2]
  ), s = [];
  for (let o = 0; o < i.length; o += 1)
    s[o] = Rl(Sl(r, i, o));
  const n = (o) => ft(s[o], 1, 1, () => {
    s[o] = null;
  });
  return {
    c() {
      for (let o = 0; o < s.length; o += 1)
        s[o].c();
      t = Er();
    },
    m(o, a) {
      for (let h = 0; h < s.length; h += 1)
        s[h] && s[h].m(o, a);
      Q(o, t, a), e = !0;
    },
    p(o, a) {
      if (a & /*trackedAnnotations, scale*/
      132) {
        i = Zr(
          /*trackedAnnotations*/
          o[2]
        );
        let h;
        for (h = 0; h < i.length; h += 1) {
          const l = Sl(o, i, h);
          s[h] ? (s[h].p(l, a), ot(s[h], 1)) : (s[h] = Rl(l), s[h].c(), ot(s[h], 1), s[h].m(t.parentNode, t));
        }
        for (Je(), h = i.length; h < s.length; h += 1)
          n(h);
        tr();
      }
    },
    i(o) {
      if (!e) {
        for (let a = 0; a < i.length; a += 1)
          ot(s[a]);
        e = !0;
      }
    },
    o(o) {
      s = s.filter(A1);
      for (let a = 0; a < s.length; a += 1)
        ft(s[a]);
      e = !1;
    },
    d(o) {
      o && Z(t), Jo(s, o);
    }
  };
}
function S1(r) {
  let t, e;
  return t = new b1({
    props: {
      annotation: (
        /*tracked*/
        r[8].annotation
      ),
      user: (
        /*tracked*/
        r[8].selectedBy
      ),
      scale: (
        /*scale*/
        r[7]
      )
    }
  }), {
    c() {
      re(t.$$.fragment);
    },
    m(i, s) {
      Kt(t, i, s), e = !0;
    },
    p(i, s) {
      const n = {};
      s & /*trackedAnnotations*/
      4 && (n.annotation = /*tracked*/
      i[8].annotation), s & /*trackedAnnotations*/
      4 && (n.user = /*tracked*/
      i[8].selectedBy), s & /*scale*/
      128 && (n.scale = /*scale*/
      i[7]), t.$set(n);
    },
    i(i) {
      e || (ot(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Zt(t, i);
    }
  };
}
function I1(r) {
  let t, e;
  return t = new w1({
    props: {
      annotation: (
        /*tracked*/
        r[8].annotation
      ),
      user: (
        /*tracked*/
        r[8].selectedBy
      ),
      scale: (
        /*scale*/
        r[7]
      )
    }
  }), {
    c() {
      re(t.$$.fragment);
    },
    m(i, s) {
      Kt(t, i, s), e = !0;
    },
    p(i, s) {
      const n = {};
      s & /*trackedAnnotations*/
      4 && (n.annotation = /*tracked*/
      i[8].annotation), s & /*trackedAnnotations*/
      4 && (n.user = /*tracked*/
      i[8].selectedBy), s & /*scale*/
      128 && (n.scale = /*scale*/
      i[7]), t.$set(n);
    },
    i(i) {
      e || (ot(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Zt(t, i);
    }
  };
}
function Rl(r) {
  let t, e, i, s;
  const n = [I1, S1], o = [];
  function a(h, l) {
    return (
      /*tracked*/
      h[8].annotation.target.selector.type === jn.RECTANGLE ? 0 : (
        /*tracked*/
        h[8].annotation.target.selector.type === jn.POLYGON ? 1 : -1
      )
    );
  }
  return ~(t = a(r)) && (e = o[t] = n[t](r)), {
    c() {
      e && e.c(), i = Er();
    },
    m(h, l) {
      ~t && o[t].m(h, l), Q(h, i, l), s = !0;
    },
    p(h, l) {
      let c = t;
      t = a(h), t === c ? ~t && o[t].p(h, l) : (e && (Je(), ft(o[c], 1, 1, () => {
        o[c] = null;
      }), tr()), ~t ? (e = o[t], e ? e.p(h, l) : (e = o[t] = n[t](h), e.c()), ot(e, 1), e.m(i.parentNode, i)) : e = null);
    },
    i(h) {
      s || (ot(e), s = !0);
    },
    o(h) {
      ft(e), s = !1;
    },
    d(h) {
      h && Z(i), ~t && o[t].d(h);
    }
  };
}
function C1(r) {
  let t, e, i, s, n = (
    /*trackedAnnotations*/
    r[2].length > 0 && Cl(r)
  );
  return {
    c() {
      t = ut("svg"), e = ut("g"), n && n.c(), b(e, "transform", i = /*transform*/
      r[6]), b(t, "class", "a9s-osd-presencelayer svelte-1krwc4m");
    },
    m(o, a) {
      Q(o, t, a), mr(t, e), n && n.m(e, null), s = !0;
    },
    p(o, a) {
      /*trackedAnnotations*/
      o[2].length > 0 ? n ? (n.p(o, a), a & /*trackedAnnotations*/
      4 && ot(n, 1)) : (n = Cl(o), n.c(), ot(n, 1), n.m(e, null)) : n && (Je(), ft(n, 1, 1, () => {
        n = null;
      }), tr()), (!s || a & /*transform*/
      64 && i !== (i = /*transform*/
      o[6])) && b(e, "transform", i);
    },
    i(o) {
      s || (ot(n), s = !0);
    },
    o(o) {
      ft(n), s = !1;
    },
    d(o) {
      o && Z(t), n && n.d();
    }
  };
}
function R1(r) {
  let t = !!/*provider*/
  r[1], e, i, s = t && Il(r);
  return {
    c() {
      s && s.c(), e = Er();
    },
    m(n, o) {
      s && s.m(n, o), Q(n, e, o), i = !0;
    },
    p(n, [o]) {
      o & /*provider*/
      2 && (t = !!/*provider*/
      n[1]), t ? s ? (s.p(n, o), o & /*provider*/
      2 && ot(s, 1)) : (s = Il(n), s.c(), ot(s, 1), s.m(e.parentNode, e)) : s && (Je(), ft(s, 1, 1, () => {
        s = null;
      }), tr());
    },
    i(n) {
      i || (ot(s), i = !0);
    },
    o(n) {
      ft(s), i = !1;
    },
    d(n) {
      n && Z(e), s && s.d(n);
    }
  };
}
function P1(r, t, e) {
  let { store: i } = t, { viewer: s } = t, { provider: n = null } = t, o = [], a = null;
  const h = (l, c) => {
    e(2, o = [
      ...o.filter(({ selectedBy: u }) => u.presenceKey !== l.presenceKey),
      ...(c || []).map((u) => ({
        // Warning - could be undefined!
        annotation: i.getAnnotation(u),
        selectedBy: l
      }))
    ].filter(({ annotation: u }) => (u || console.warn("Selection event on unknown annotation"), !!u))), a && i.unobserve(a), a = (u) => {
      const { deleted: d, updated: f } = u.changes, p = new Set(d.map((g) => g.id)), m = o.filter(({ annotation: g }) => !p.has(g.id)).map((g) => {
        const y = f.find((v) => v.oldValue.id === g.annotation.id);
        return y ? {
          selectedBy: g.selectedBy,
          annotation: y.newValue
        } : g;
      });
      e(2, o = m);
    }, i.observe(a, {
      annotations: o.map((u) => u.annotation.id)
    });
  };
  return Td(() => {
    a && i.unobserve(a);
  }), r.$$set = (l) => {
    "store" in l && e(3, i = l.store), "viewer" in l && e(0, s = l.viewer), "provider" in l && e(1, n = l.provider);
  }, r.$$.update = () => {
    r.$$.dirty & /*provider*/
    2 && n && n.on("selectionChange", h);
  }, [s, n, o, i];
}
class M1 extends Xt {
  constructor(t) {
    super(), Vt(this, t, P1, R1, Ut, { store: 3, viewer: 0, provider: 1 });
  }
}
const Pl = (r, t) => {
  t === "auto" ? r.addHandler("open", (e) => {
    const i = r.world.getItemCount();
    r.world.getItemAt(i - 1).addOnceHandler("fully-loaded-change", (n) => {
      const { fullyLoaded: o } = n;
      if (o) {
        const a = r.canvas.querySelector("canvas"), h = Hv(a);
        r.element.setAttribute("data-theme", h);
      }
    });
  }) : r.element.setAttribute("data-theme", t);
}, Du = (r, t, e) => (i, s = {}) => {
  const n = typeof i == "string" ? i : i.id, o = t.getAnnotation(n);
  if (!o)
    return;
  const a = r.container.getBoundingClientRect(), { padding: h } = s;
  let [l, c, u, d] = h ? Array.isArray(h) ? h : [h, h, h, h] : [0, 0, 0, 0];
  l = l / a.height, c = c / a.width, u = u / a.height, d = d / a.width;
  const { minX: f, minY: p, maxX: m, maxY: g } = o.target.selector.geometry.bounds, y = m - f, v = g - p, _ = f - d * y, x = p - l * v, T = y + (c + d) * y, C = v + (l + u) * v, w = r.viewport.imageToViewportRectangle(_, x, T, C);
  r.viewport[e](w, s.immediately);
}, B1 = (r, t) => Du(r, t, "fitBounds"), D1 = (r, t) => Du(r, t, "fitBoundsWithConstraints"), N1 = (r, t = {}) => {
  const e = Nu(t, {
    drawingEnabled: !1,
    drawingMode: "click",
    pointerSelectAction: Qo.EDIT,
    theme: "light"
  }), i = ku(e), { hover: s, selection: n, store: o } = i, a = sd(o), h = nd(
    i,
    a,
    e.adapter,
    e.autoSave
  );
  let l = dd(), c = e.drawingEnabled, u = e.drawingMode;
  const d = Uu(a, r.element), f = new n1({
    target: r.element,
    props: {
      state: i,
      viewer: r,
      style: e.style
    }
  }), p = new M1({
    target: r.element.querySelector(".openseadragon-canvas"),
    props: {
      store: o,
      viewer: r,
      provider: null
    }
  }), m = new g1({
    target: r.element.querySelector(".openseadragon-canvas"),
    props: {
      drawingEnabled: c,
      preferredDrawingMode: u,
      state: i,
      user: l,
      viewer: r
    }
  });
  f.$on("click", (A) => {
    const { originalEvent: R, annotation: X } = A.detail;
    X && !(u === "click" && c) ? n.clickSelect(X.id, R) : n.isEmpty() || n.clear();
  }), r.element.addEventListener("pointerdown", (A) => {
    if (s.current) {
      const R = o.getAnnotation(s.current);
      h.emit("clickAnnotation", R, A);
    }
  }), Pl(r, e.theme);
  const g = ad(i, a, e.adapter), y = () => {
    f.$destroy(), p.$destroy(), m.$destroy(), d.destroy(), a.destroy();
  }, v = B1(r, o), _ = D1(r, o), x = () => l, T = (A, R, X) => Gu(A, R, X), C = (A, R) => Hu(A, R), w = (A) => {
    if (!Ml(A))
      throw `No drawing tool named ${A}`;
    m.$set({ toolName: A });
  }, I = (A) => {
    c = A, m.$set({ drawingEnabled: c });
  }, S = (A) => (
    // @ts-ignore
    f.$set({ filter: A })
  ), P = (A) => f.$set({ style: A }), O = (A) => p.$set({ provider: A }), M = (A) => Pl(r, A), E = (A) => {
    l = A, m.$set({ user: A });
  };
  return {
    ...g,
    destroy: y,
    fitBounds: v,
    fitBoundsWithConstraints: _,
    getUser: x,
    listDrawingTools: Wn,
    on: h.on,
    off: h.off,
    registerDrawingTool: T,
    registerShapeEditor: C,
    setDrawingEnabled: I,
    setDrawingTool: w,
    setFilter: S,
    setPresenceProvider: O,
    setStyle: P,
    setTheme: M,
    setUser: E,
    state: i,
    viewer: r
  };
}, k1 = pd, U1 = Qo, G1 = qu, H1 = Vu, V1 = jn, X1 = Xu;
export {
  U1 as PointerSelectAction,
  V1 as ShapeType,
  X1 as W3CImageFormat,
  G1 as createBody,
  H1 as createImageAnnotator,
  N1 as createOSDAnnotator,
  k1 as defaultColorProvider
};
//# sourceMappingURL=annotorious-openseadragon.es.js.map
