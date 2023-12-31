import { listDrawingTools as ma, getTool as Qu, getEditor as zo, ShapeType as ba, fillDefaults as wl, createImageAnnotatorState as Sl, initKeyboardCommands as Pl, registerTool as Al, registerEditor as Rl, createImageAnnotator as Ol, W3CImageFormat as Il } from "@annotorious/annotorious";
import tn from "openseadragon";
var Wo = Object.prototype.hasOwnProperty;
function Qe(r, t) {
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
        for (; i-- && Qe(r[i], t[i]); )
          ;
      return i === -1;
    }
    if (!e || typeof r == "object") {
      i = 0;
      for (e in r)
        if (Wo.call(r, e) && ++i && !Wo.call(t, e) || !(e in t) || !Qe(r[e], t[e]))
          return !1;
      return Object.keys(t).length === i;
    }
  }
  return r !== r && t !== t;
}
var xo = /* @__PURE__ */ ((r) => (r.EDIT = "EDIT", r.SELECT = "SELECT", r.NONE = "NONE", r))(xo || {});
let gi;
const Cl = new Uint8Array(16);
function Ml() {
  if (!gi && (gi = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !gi))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return gi(Cl);
}
const Ft = [];
for (let r = 0; r < 256; ++r)
  Ft.push((r + 256).toString(16).slice(1));
function Dl(r, t = 0) {
  return Ft[r[t + 0]] + Ft[r[t + 1]] + Ft[r[t + 2]] + Ft[r[t + 3]] + "-" + Ft[r[t + 4]] + Ft[r[t + 5]] + "-" + Ft[r[t + 6]] + Ft[r[t + 7]] + "-" + Ft[r[t + 8]] + Ft[r[t + 9]] + "-" + Ft[r[t + 10]] + Ft[r[t + 11]] + Ft[r[t + 12]] + Ft[r[t + 13]] + Ft[r[t + 14]] + Ft[r[t + 15]];
}
const Fl = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), Yo = {
  randomUUID: Fl
};
function Nl(r, t, e) {
  if (Yo.randomUUID && !t && !r)
    return Yo.randomUUID();
  r = r || {};
  const i = r.random || (r.rng || Ml)();
  if (i[6] = i[6] & 15 | 64, i[8] = i[8] & 63 | 128, t) {
    e = e || 0;
    for (let n = 0; n < 16; ++n)
      t[e + n] = i[n];
    return t;
  }
  return Dl(i);
}
const Bl = (r, t, e, i) => ({
  id: Nl(),
  annotation: r.id,
  created: e || /* @__PURE__ */ new Date(),
  creator: i,
  ...t
}), Ll = (r, t) => {
  const e = new Set(r.bodies.map((i) => i.id));
  return t.bodies.filter((i) => !e.has(i.id));
}, Ul = (r, t) => {
  const e = new Set(t.bodies.map((i) => i.id));
  return r.bodies.filter((i) => !e.has(i.id));
}, Gl = (r, t) => t.bodies.map((e) => {
  const i = r.bodies.find((n) => n.id === e.id);
  return { newBody: e, oldBody: i && !Qe(i, e) ? i : void 0 };
}).filter(({ oldBody: e }) => e), kl = (r, t) => !Qe(r.target, t.target), Hl = (r, t) => {
  const e = Ll(r, t), i = Ul(r, t), n = Gl(r, t);
  return {
    oldValue: r,
    newValue: t,
    bodiesCreated: e.length > 0 ? e : void 0,
    bodiesDeleted: i.length > 0 ? i : void 0,
    bodiesUpdated: n.length > 0 ? n : void 0,
    targetUpdated: kl(r, t) ? { oldTarget: r.target, newTarget: t.target } : void 0
  };
};
var Ce = /* @__PURE__ */ ((r) => (r.LOCAL = "LOCAL", r.REMOTE = "REMOTE", r))(Ce || {});
const Xl = (r, t) => {
  const e = new Set((r.created || []).map((f) => f.id)), i = new Set((r.updated || []).map(({ newValue: f }) => f.id)), n = new Set((t.created || []).map((f) => f.id)), a = new Set((t.deleted || []).map((f) => f.id)), o = new Set((t.updated || []).map(({ oldValue: f }) => f.id)), s = new Set((t.updated || []).filter(({ oldValue: f }) => e.has(f.id) || i.has(f.id)).map(({ oldValue: f }) => f.id)), u = [
    ...(r.created || []).filter((f) => !a.has(f.id)).map((f) => o.has(f.id) ? t.updated.find(({ oldValue: c }) => c.id === f.id).newValue : f),
    ...t.created || []
  ], h = [
    ...(r.deleted || []).filter((f) => !n.has(f.id)),
    ...(t.deleted || []).filter((f) => !e.has(f.id))
  ], l = [
    ...(r.updated || []).filter(({ newValue: f }) => !a.has(f.id)).map((f) => {
      const { oldValue: c, newValue: d } = f;
      if (o.has(d.id)) {
        const p = t.updated.find((_) => _.oldValue.id === d.id).newValue;
        return Hl(c, p);
      } else
        return f;
    }),
    ...(t.updated || []).filter(({ oldValue: f }) => !s.has(f.id))
  ];
  return { created: u, deleted: h, updated: l };
};
let jl = () => ({
  emit(r, ...t) {
    let e = this.events[r] || [];
    for (let i = 0, n = e.length; i < n; i++)
      e[i](...t);
  },
  events: {},
  on(r, t) {
    var e;
    return (e = this.events[r]) != null && e.push(t) || (this.events[r] = [t]), () => {
      var i;
      this.events[r] = (i = this.events[r]) == null ? void 0 : i.filter((n) => t !== n);
    };
  }
});
const Vl = 250, zl = (r) => {
  const t = jl(), e = [];
  let i = -1, n = !1, a = 0;
  const o = (d) => {
    if (!n) {
      const { changes: p } = d, _ = performance.now();
      if (_ - a > Vl)
        e.splice(i + 1), e.push(p), i = e.length - 1;
      else {
        const v = e.length - 1;
        e[v] = Xl(e[v], p);
      }
      a = _;
    }
    n = !1;
  };
  r.observe(o, { origin: Ce.LOCAL });
  const s = (d) => (d == null ? void 0 : d.length) > 0 && r.bulkDeleteAnnotation(d), u = (d) => (d == null ? void 0 : d.length) > 0 && r.bulkAddAnnotation(d, !1), h = (d) => (d == null ? void 0 : d.length) > 0 && r.bulkUpdateAnnotation(d.map(({ oldValue: p }) => p)), l = (d) => (d == null ? void 0 : d.length) > 0 && r.bulkUpdateAnnotation(d.map(({ newValue: p }) => p)), f = (d) => (d == null ? void 0 : d.length) > 0 && r.bulkAddAnnotation(d, !1), c = (d) => (d == null ? void 0 : d.length) > 0 && r.bulkDeleteAnnotation(d);
  return {
    canRedo: () => e.length - 1 > i,
    canUndo: () => i > -1,
    destroy: () => r.unobserve(o),
    on: (d, p) => t.on(d, p),
    redo: () => {
      if (e.length - 1 > i) {
        n = !0;
        const { created: d, updated: p, deleted: _ } = e[i + 1];
        u(d), l(p), c(_), t.emit("redo", e[i + 1]), i += 1;
      }
    },
    undo: () => {
      if (i > -1) {
        n = !0;
        const { created: d, updated: p, deleted: _ } = e[i];
        s(d), h(p), f(_), t.emit("undo", e[i]), i -= 1;
      }
    }
  };
}, Wl = (r, t, e, i) => {
  const { store: n, selection: a, hover: o, viewport: s } = r, u = /* @__PURE__ */ new Map();
  let h = [], l, f;
  const c = (y, g) => {
    u.has(y) ? u.get(y).push(g) : u.set(y, [g]);
  }, d = (y, g) => {
    const m = u.get(y);
    m && m.indexOf(g) > 0 && m.splice(m.indexOf(g), 1);
  }, p = (y, g, m) => {
    u.has(y) && setTimeout(() => {
      u.get(y).forEach((E) => {
        if (e) {
          const b = Array.isArray(g) ? g.map((S) => e.serialize(S)) : e.serialize(g), x = m ? m instanceof PointerEvent ? m : e.serialize(m) : void 0;
          E(b, x);
        } else
          E(g, m);
      });
    }, 1);
  }, _ = () => {
    const { selected: y } = a, g = y.map(({ id: m }) => n.getAnnotation(m));
    g.forEach((m) => {
      const E = h.find((b) => b.id === m.id);
      (!E || !Qe(E, m)) && p("updateAnnotation", m, E);
    }), h = h.map((m) => g.find(({ id: b }) => b === m.id) || m);
  };
  a.subscribe(({ selected: y }) => {
    if (!(h.length === 0 && y.length === 0)) {
      if (h.length === 0 && y.length > 0)
        h = y.map(({ id: g }) => n.getAnnotation(g));
      else if (h.length > 0 && y.length === 0)
        h.forEach((g) => {
          const m = n.getAnnotation(g.id);
          m && !Qe(m, g) && p("updateAnnotation", m, g);
        }), h = [];
      else {
        const g = new Set(h.map((E) => E.id)), m = new Set(y.map(({ id: E }) => E));
        h.filter((E) => !m.has(E.id)).forEach((E) => {
          const b = n.getAnnotation(E.id);
          b && !Qe(b, E) && p("updateAnnotation", b, E);
        }), h = [
          // Remove annotations that were deselected
          ...h.filter((E) => m.has(E.id)),
          // Add editable annotations that were selected
          ...y.filter(({ id: E }) => !g.has(E)).map(({ id: E }) => n.getAnnotation(E))
        ];
      }
      p("selectionChanged", h);
    }
  }), o.subscribe((y) => {
    !l && y ? p("mouseEnterAnnotation", n.getAnnotation(y)) : l && !y ? p("mouseLeaveAnnotation", n.getAnnotation(l)) : l && y && (p("mouseLeaveAnnotation", n.getAnnotation(l)), p("mouseEnterAnnotation", n.getAnnotation(y))), l = y;
  }), s == null || s.subscribe((y) => p("viewportIntersect", y.map(n.getAnnotation))), n.observe((y) => {
    i && (f && clearTimeout(f), f = setTimeout(_, 1e3));
    const { created: g, deleted: m } = y.changes;
    g.forEach((E) => p("createAnnotation", E)), m.forEach((E) => p("deleteAnnotation", E)), y.changes.updated.filter((E) => [
      ...E.bodiesCreated || [],
      ...E.bodiesDeleted || [],
      ...E.bodiesUpdated || []
    ].length > 0).forEach(({ oldValue: E, newValue: b }) => {
      const x = h.find((S) => S.id === E.id) || E;
      h = h.map((S) => S.id === E.id ? b : S), p("updateAnnotation", b, x);
    });
  }, { origin: Ce.LOCAL }), n.observe((y) => {
    if (h) {
      const g = new Set(h.map((E) => E.id)), m = y.changes.updated.filter(({ newValue: E }) => g.has(E.id)).map(({ newValue: E }) => E);
      m.length > 0 && (h = h.map((E) => m.find((x) => x.id === E.id) || E));
    }
  }, { origin: Ce.REMOTE });
  const v = (y) => (g) => {
    const { created: m, deleted: E, updated: b } = g;
    m.forEach((x) => p("createAnnotation", x)), E.forEach((x) => p("deleteAnnotation", x)), y ? b.forEach((x) => p("updateAnnotation", x.oldValue, x.newValue)) : b.forEach((x) => p("updateAnnotation", x.newValue, x.oldValue));
  };
  return t.on("undo", v(!0)), t.on("redo", v(!1)), { on: c, off: d, emit: p };
}, Yl = (r) => (t) => t.reduce((e, i) => {
  const { parsed: n, error: a } = r.parse(i);
  return a ? {
    parsed: e.parsed,
    failed: [...e.failed, i]
  } : {
    parsed: [...e.parsed, n],
    failed: e.failed
  };
}, { parsed: [], failed: [] }), ql = (r, t, e) => {
  const { store: i, selection: n } = r, a = (v) => {
    if (e) {
      const { parsed: y, error: g } = e.parse(v);
      y ? i.addAnnotation(y, Ce.REMOTE) : console.error(g);
    } else
      i.addAnnotation(v, Ce.REMOTE);
  }, o = () => n.clear(), s = () => i.clear(), u = (v) => {
    const y = i.getAnnotation(v);
    return e && y ? e.serialize(y) : y;
  }, h = () => e ? i.all().map(e.serialize) : i.all(), l = () => {
    var v;
    const y = (((v = n.selected) == null ? void 0 : v.map((g) => g.id)) || []).map((g) => i.getAnnotation(g));
    return e ? y.map(e.serialize) : y;
  }, f = (v) => fetch(v).then((y) => y.json()).then((y) => (d(y), y)), c = (v) => {
    if (typeof v == "string") {
      const y = i.getAnnotation(v);
      return i.deleteAnnotation(v), e ? e.serialize(y) : y;
    } else {
      const y = e ? e.parse(v).parsed : v;
      return i.deleteAnnotation(y), v;
    }
  }, d = (v) => {
    if (e) {
      const { parsed: y, failed: g } = Yl(e)(v);
      g.length > 0 && console.warn(`Discarded ${g.length} invalid annotations`, g), i.bulkAddAnnotation(y, !0, Ce.REMOTE);
    } else
      i.bulkAddAnnotation(v, !0, Ce.REMOTE);
  }, p = (v) => {
    v ? n.setSelected(v) : n.clear();
  }, _ = (v) => {
    if (e) {
      const y = e.parse(v).parsed, g = e.serialize(i.getAnnotation(y.id));
      return i.updateAnnotation(y), g;
    } else {
      const y = i.getAnnotation(v.id);
      return i.updateAnnotation(v), y;
    }
  };
  return {
    addAnnotation: a,
    cancelSelected: o,
    canRedo: t.canRedo,
    canUndo: t.canUndo,
    clearAnnotations: s,
    getAnnotationById: u,
    getAnnotations: h,
    getSelected: l,
    loadAnnotations: f,
    redo: t.redo,
    removeAnnotation: c,
    setAnnotations: d,
    setSelected: p,
    undo: t.undo,
    updateAnnotation: _
  };
};
let Zl = (r) => crypto.getRandomValues(new Uint8Array(r)), Kl = (r, t, e) => {
  let i = (2 << Math.log(r.length - 1) / Math.LN2) - 1, n = -~(1.6 * i * t / r.length);
  return (a = t) => {
    let o = "";
    for (; ; ) {
      let s = e(n), u = n;
      for (; u--; )
        if (o += r[s[u] & i] || "", o.length === a)
          return o;
    }
  };
}, $l = (r, t = 21) => Kl(r, t, Zl), Ql = (r = 21) => crypto.getRandomValues(new Uint8Array(r)).reduce((t, e) => (e &= 63, e < 36 ? t += e.toString(36) : e < 62 ? t += (e - 26).toString(36).toUpperCase() : e > 62 ? t += "-" : t += "_", t), "");
const Jl = () => ({ isGuest: !0, id: $l("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_", 20)() }), tf = [
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
], ef = () => {
  const r = [...tf];
  return { assignRandomColor: () => {
    const t = Math.floor(Math.random() * r.length), e = r[t];
    return r.splice(t, 1), e;
  }, releaseColor: (t) => r.push(t) };
};
Ql();
function Ne() {
}
function rf(r, t) {
  for (const e in t)
    r[e] = t[e];
  return r;
}
function Ju(r) {
  return r();
}
function qo() {
  return /* @__PURE__ */ Object.create(null);
}
function Se(r) {
  r.forEach(Ju);
}
function Tt(r) {
  return typeof r == "function";
}
function Ht(r, t) {
  return r != r ? t == t : r !== t || r && typeof r == "object" || typeof r == "function";
}
function nf(r) {
  return Object.keys(r).length === 0;
}
function af(r, ...t) {
  if (r == null)
    return Ne;
  const e = r.subscribe(...t);
  return e.unsubscribe ? () => e.unsubscribe() : e;
}
function Ea(r, t, e) {
  r.$$.on_destroy.push(af(t, e));
}
function th(r, t, e, i) {
  if (r) {
    const n = eh(r, t, e, i);
    return r[0](n);
  }
}
function eh(r, t, e, i) {
  return r[1] && i ? rf(e.ctx.slice(), r[1](i(t))) : e.ctx;
}
function rh(r, t, e, i) {
  if (r[2] && i) {
    const n = r[2](i(e));
    if (t.dirty === void 0)
      return n;
    if (typeof n == "object") {
      const a = [], o = Math.max(t.dirty.length, n.length);
      for (let s = 0; s < o; s += 1)
        a[s] = t.dirty[s] | n[s];
      return a;
    }
    return t.dirty | n;
  }
  return t.dirty;
}
function ih(r, t, e, i, n, a) {
  if (n) {
    const o = eh(t, e, i, a);
    r.p(o, n);
  }
}
function nh(r) {
  if (r.ctx.length > 32) {
    const t = [], e = r.ctx.length / 32;
    for (let i = 0; i < e; i++)
      t[i] = -1;
    return t;
  }
  return -1;
}
const of = typeof window < "u" ? window : typeof globalThis < "u" ? globalThis : global;
function Je(r, t) {
  r.appendChild(t);
}
function q(r, t, e) {
  r.insertBefore(t, e || null);
}
function Y(r) {
  r.parentNode && r.parentNode.removeChild(r);
}
function wo(r, t) {
  for (let e = 0; e < r.length; e += 1)
    r[e] && r[e].d(t);
}
function ut(r) {
  return document.createElementNS("http://www.w3.org/2000/svg", r);
}
function So(r) {
  return document.createTextNode(r);
}
function Gt() {
  return So(" ");
}
function ur() {
  return So("");
}
function St(r, t, e, i) {
  return r.addEventListener(t, e, i), () => r.removeEventListener(t, e, i);
}
function T(r, t, e) {
  e == null ? r.removeAttribute(t) : r.getAttribute(t) !== e && r.setAttribute(t, e);
}
function sf(r) {
  return Array.from(r.childNodes);
}
function uf(r, t) {
  t = "" + t, r.data !== t && (r.data = t);
}
function Zo(r, t, e) {
  r.classList[e ? "add" : "remove"](t);
}
function hf(r, t, { bubbles: e = !1, cancelable: i = !1 } = {}) {
  const n = document.createEvent("CustomEvent");
  return n.initCustomEvent(r, e, i, t), n;
}
let ti;
function qr(r) {
  ti = r;
}
function Po() {
  if (!ti)
    throw new Error("Function called outside component initialization");
  return ti;
}
function bn(r) {
  Po().$$.on_mount.push(r);
}
function lf(r) {
  Po().$$.on_destroy.push(r);
}
function En() {
  const r = Po();
  return (t, e, { cancelable: i = !1 } = {}) => {
    const n = r.$$.callbacks[t];
    if (n) {
      const a = hf(t, e, { cancelable: i });
      return n.slice().forEach((o) => {
        o.call(r, a);
      }), !a.defaultPrevented;
    }
    return !0;
  };
}
function Zt(r, t) {
  const e = r.$$.callbacks[t.type];
  e && e.slice().forEach((i) => i.call(this, t));
}
const mr = [], en = [];
let Sr = [];
const Ko = [], ff = /* @__PURE__ */ Promise.resolve();
let Ta = !1;
function cf() {
  Ta || (Ta = !0, ff.then(ah));
}
function xa(r) {
  Sr.push(r);
}
const Cn = /* @__PURE__ */ new Set();
let cr = 0;
function ah() {
  if (cr !== 0)
    return;
  const r = ti;
  do {
    try {
      for (; cr < mr.length; ) {
        const t = mr[cr];
        cr++, qr(t), df(t.$$);
      }
    } catch (t) {
      throw mr.length = 0, cr = 0, t;
    }
    for (qr(null), mr.length = 0, cr = 0; en.length; )
      en.pop()();
    for (let t = 0; t < Sr.length; t += 1) {
      const e = Sr[t];
      Cn.has(e) || (Cn.add(e), e());
    }
    Sr.length = 0;
  } while (mr.length);
  for (; Ko.length; )
    Ko.pop()();
  Ta = !1, Cn.clear(), qr(r);
}
function df(r) {
  if (r.fragment !== null) {
    r.update(), Se(r.before_update);
    const t = r.dirty;
    r.dirty = [-1], r.fragment && r.fragment.p(r.ctx, t), r.after_update.forEach(xa);
  }
}
function pf(r) {
  const t = [], e = [];
  Sr.forEach((i) => r.indexOf(i) === -1 ? t.push(i) : e.push(i)), e.forEach((i) => i()), Sr = t;
}
const qi = /* @__PURE__ */ new Set();
let $e;
function Le() {
  $e = {
    r: 0,
    c: [],
    p: $e
    // parent group
  };
}
function Ue() {
  $e.r || Se($e.c), $e = $e.p;
}
function at(r, t) {
  r && r.i && (qi.delete(r), r.i(t));
}
function ft(r, t, e, i) {
  if (r && r.o) {
    if (qi.has(r))
      return;
    qi.add(r), $e.c.push(() => {
      qi.delete(r), i && (e && r.d(1), i());
    }), r.o(t);
  } else
    i && i();
}
function Kt(r) {
  r && r.c();
}
function Wt(r, t, e, i) {
  const { fragment: n, after_update: a } = r.$$;
  n && n.m(t, e), i || xa(() => {
    const o = r.$$.on_mount.map(Ju).filter(Tt);
    r.$$.on_destroy ? r.$$.on_destroy.push(...o) : Se(o), r.$$.on_mount = [];
  }), a.forEach(xa);
}
function Yt(r, t) {
  const e = r.$$;
  e.fragment !== null && (pf(e.after_update), Se(e.on_destroy), e.fragment && e.fragment.d(t), e.on_destroy = e.fragment = null, e.ctx = []);
}
function vf(r, t) {
  r.$$.dirty[0] === -1 && (mr.push(r), cf(), r.$$.dirty.fill(0)), r.$$.dirty[t / 31 | 0] |= 1 << t % 31;
}
function Xt(r, t, e, i, n, a, o, s = [-1]) {
  const u = ti;
  qr(r);
  const h = r.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: a,
    update: Ne,
    not_equal: n,
    bound: qo(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(t.context || (u ? u.$$.context : [])),
    // everything else
    callbacks: qo(),
    dirty: s,
    skip_bound: !1,
    root: t.target || u.$$.root
  };
  o && o(h.root);
  let l = !1;
  if (h.ctx = e ? e(r, t.props || {}, (f, c, ...d) => {
    const p = d.length ? d[0] : c;
    return h.ctx && n(h.ctx[f], h.ctx[f] = p) && (!h.skip_bound && h.bound[f] && h.bound[f](p), l && vf(r, f)), c;
  }) : [], h.update(), l = !0, Se(h.before_update), h.fragment = i ? i(h.ctx) : !1, t.target) {
    if (t.hydrate) {
      const f = sf(t.target);
      h.fragment && h.fragment.l(f), f.forEach(Y);
    } else
      h.fragment && h.fragment.c();
    t.intro && at(r.$$.fragment), Wt(r, t.target, t.anchor, t.customElement), ah();
  }
  qr(u);
}
class jt {
  $destroy() {
    Yt(this, 1), this.$destroy = Ne;
  }
  $on(t, e) {
    if (!Tt(e))
      return Ne;
    const i = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return i.push(e), () => {
      const n = i.indexOf(e);
      n !== -1 && i.splice(n, 1);
    };
  }
  $set(t) {
    this.$$set && !nf(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
}
function _f(r) {
  var t = this.constructor;
  return this.then(
    function(e) {
      return t.resolve(r()).then(function() {
        return e;
      });
    },
    function(e) {
      return t.resolve(r()).then(function() {
        return t.reject(e);
      });
    }
  );
}
function yf(r) {
  var t = this;
  return new t(function(e, i) {
    if (!(r && typeof r.length < "u"))
      return i(
        new TypeError(
          typeof r + " " + r + " is not iterable(cannot read property Symbol(Symbol.iterator))"
        )
      );
    var n = Array.prototype.slice.call(r);
    if (n.length === 0)
      return e([]);
    var a = n.length;
    function o(u, h) {
      if (h && (typeof h == "object" || typeof h == "function")) {
        var l = h.then;
        if (typeof l == "function") {
          l.call(
            h,
            function(f) {
              o(u, f);
            },
            function(f) {
              n[u] = { status: "rejected", reason: f }, --a === 0 && e(n);
            }
          );
          return;
        }
      }
      n[u] = { status: "fulfilled", value: h }, --a === 0 && e(n);
    }
    for (var s = 0; s < n.length; s++)
      o(s, n[s]);
  });
}
function oh(r, t) {
  this.name = "AggregateError", this.errors = r, this.message = t || "";
}
oh.prototype = Error.prototype;
function gf(r) {
  var t = this;
  return new t(function(e, i) {
    if (!(r && typeof r.length < "u"))
      return i(new TypeError("Promise.any accepts an array"));
    var n = Array.prototype.slice.call(r);
    if (n.length === 0)
      return i();
    for (var a = [], o = 0; o < n.length; o++)
      try {
        t.resolve(n[o]).then(e).catch(function(s) {
          a.push(s), a.length === n.length && i(
            new oh(
              a,
              "All promises were rejected"
            )
          );
        });
      } catch (s) {
        i(s);
      }
  });
}
var mf = setTimeout;
function sh(r) {
  return !!(r && typeof r.length < "u");
}
function bf() {
}
function Ef(r, t) {
  return function() {
    r.apply(t, arguments);
  };
}
function wt(r) {
  if (!(this instanceof wt))
    throw new TypeError("Promises must be constructed via new");
  if (typeof r != "function")
    throw new TypeError("not a function");
  this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], hh(r, this);
}
function uh(r, t) {
  for (; r._state === 3; )
    r = r._value;
  if (r._state === 0) {
    r._deferreds.push(t);
    return;
  }
  r._handled = !0, wt._immediateFn(function() {
    var e = r._state === 1 ? t.onFulfilled : t.onRejected;
    if (e === null) {
      (r._state === 1 ? wa : ei)(t.promise, r._value);
      return;
    }
    var i;
    try {
      i = e(r._value);
    } catch (n) {
      ei(t.promise, n);
      return;
    }
    wa(t.promise, i);
  });
}
function wa(r, t) {
  try {
    if (t === r)
      throw new TypeError("A promise cannot be resolved with itself.");
    if (t && (typeof t == "object" || typeof t == "function")) {
      var e = t.then;
      if (t instanceof wt) {
        r._state = 3, r._value = t, Sa(r);
        return;
      } else if (typeof e == "function") {
        hh(Ef(e, t), r);
        return;
      }
    }
    r._state = 1, r._value = t, Sa(r);
  } catch (i) {
    ei(r, i);
  }
}
function ei(r, t) {
  r._state = 2, r._value = t, Sa(r);
}
function Sa(r) {
  r._state === 2 && r._deferreds.length === 0 && wt._immediateFn(function() {
    r._handled || wt._unhandledRejectionFn(r._value);
  });
  for (var t = 0, e = r._deferreds.length; t < e; t++)
    uh(r, r._deferreds[t]);
  r._deferreds = null;
}
function Tf(r, t, e) {
  this.onFulfilled = typeof r == "function" ? r : null, this.onRejected = typeof t == "function" ? t : null, this.promise = e;
}
function hh(r, t) {
  var e = !1;
  try {
    r(
      function(i) {
        e || (e = !0, wa(t, i));
      },
      function(i) {
        e || (e = !0, ei(t, i));
      }
    );
  } catch (i) {
    if (e)
      return;
    e = !0, ei(t, i);
  }
}
wt.prototype.catch = function(r) {
  return this.then(null, r);
};
wt.prototype.then = function(r, t) {
  var e = new this.constructor(bf);
  return uh(this, new Tf(r, t, e)), e;
};
wt.prototype.finally = _f;
wt.all = function(r) {
  return new wt(function(t, e) {
    if (!sh(r))
      return e(new TypeError("Promise.all accepts an array"));
    var i = Array.prototype.slice.call(r);
    if (i.length === 0)
      return t([]);
    var n = i.length;
    function a(s, u) {
      try {
        if (u && (typeof u == "object" || typeof u == "function")) {
          var h = u.then;
          if (typeof h == "function") {
            h.call(
              u,
              function(l) {
                a(s, l);
              },
              e
            );
            return;
          }
        }
        i[s] = u, --n === 0 && t(i);
      } catch (l) {
        e(l);
      }
    }
    for (var o = 0; o < i.length; o++)
      a(o, i[o]);
  });
};
wt.any = gf;
wt.allSettled = yf;
wt.resolve = function(r) {
  return r && typeof r == "object" && r.constructor === wt ? r : new wt(function(t) {
    t(r);
  });
};
wt.reject = function(r) {
  return new wt(function(t, e) {
    e(r);
  });
};
wt.race = function(r) {
  return new wt(function(t, e) {
    if (!sh(r))
      return e(new TypeError("Promise.race accepts an array"));
    for (var i = 0, n = r.length; i < n; i++)
      wt.resolve(r[i]).then(t, e);
  });
};
wt._immediateFn = // @ts-ignore
typeof setImmediate == "function" && function(r) {
  setImmediate(r);
} || function(r) {
  mf(r, 0);
};
wt._unhandledRejectionFn = function(t) {
  typeof console < "u" && console && console.warn("Possible Unhandled Promise Rejection:", t);
};
var Zi = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Tn(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function xf(r) {
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
    var n = Object.getOwnPropertyDescriptor(r, i);
    Object.defineProperty(e, i, n.get ? n : {
      enumerable: !0,
      get: function() {
        return r[i];
      }
    });
  }), e;
}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var $o = Object.getOwnPropertySymbols, wf = Object.prototype.hasOwnProperty, Sf = Object.prototype.propertyIsEnumerable;
function Pf(r) {
  if (r == null)
    throw new TypeError("Object.assign cannot be called with null or undefined");
  return Object(r);
}
function Af() {
  try {
    if (!Object.assign)
      return !1;
    var r = new String("abc");
    if (r[5] = "de", Object.getOwnPropertyNames(r)[0] === "5")
      return !1;
    for (var t = {}, e = 0; e < 10; e++)
      t["_" + String.fromCharCode(e)] = e;
    var i = Object.getOwnPropertyNames(t).map(function(a) {
      return t[a];
    });
    if (i.join("") !== "0123456789")
      return !1;
    var n = {};
    return "abcdefghijklmnopqrst".split("").forEach(function(a) {
      n[a] = a;
    }), Object.keys(Object.assign({}, n)).join("") === "abcdefghijklmnopqrst";
  } catch {
    return !1;
  }
}
var Rf = Af() ? Object.assign : function(r, t) {
  for (var e, i = Pf(r), n, a = 1; a < arguments.length; a++) {
    e = Object(arguments[a]);
    for (var o in e)
      wf.call(e, o) && (i[o] = e[o]);
    if ($o) {
      n = $o(e);
      for (var s = 0; s < n.length; s++)
        Sf.call(e, n[s]) && (i[n[s]] = e[n[s]]);
    }
  }
  return i;
};
const Of = /* @__PURE__ */ Tn(Rf);
/*!
 * @pixi/polyfill - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/polyfill is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
typeof globalThis > "u" && (typeof self < "u" ? self.globalThis = self : typeof global < "u" && (global.globalThis = global));
globalThis.Promise || (globalThis.Promise = wt);
Object.assign || (Object.assign = Of);
var If = 16;
Date.now && Date.prototype.getTime || (Date.now = function() {
  return (/* @__PURE__ */ new Date()).getTime();
});
if (!(globalThis.performance && globalThis.performance.now)) {
  var Cf = Date.now();
  globalThis.performance || (globalThis.performance = {}), globalThis.performance.now = function() {
    return Date.now() - Cf;
  };
}
var Mn = Date.now(), Qo = ["ms", "moz", "webkit", "o"];
for (var Dn = 0; Dn < Qo.length && !globalThis.requestAnimationFrame; ++Dn) {
  var Fn = Qo[Dn];
  globalThis.requestAnimationFrame = globalThis[Fn + "RequestAnimationFrame"], globalThis.cancelAnimationFrame = globalThis[Fn + "CancelAnimationFrame"] || globalThis[Fn + "CancelRequestAnimationFrame"];
}
globalThis.requestAnimationFrame || (globalThis.requestAnimationFrame = function(r) {
  if (typeof r != "function")
    throw new TypeError(r + "is not a function");
  var t = Date.now(), e = If + Mn - t;
  return e < 0 && (e = 0), Mn = t, globalThis.self.setTimeout(function() {
    Mn = Date.now(), r(performance.now());
  }, e);
});
globalThis.cancelAnimationFrame || (globalThis.cancelAnimationFrame = function(r) {
  return clearTimeout(r);
});
Math.sign || (Math.sign = function(t) {
  return t = Number(t), t === 0 || isNaN(t) ? t : t > 0 ? 1 : -1;
});
Number.isInteger || (Number.isInteger = function(t) {
  return typeof t == "number" && isFinite(t) && Math.floor(t) === t;
});
globalThis.ArrayBuffer || (globalThis.ArrayBuffer = Array);
globalThis.Float32Array || (globalThis.Float32Array = Array);
globalThis.Uint32Array || (globalThis.Uint32Array = Array);
globalThis.Uint16Array || (globalThis.Uint16Array = Array);
globalThis.Uint8Array || (globalThis.Uint8Array = Array);
globalThis.Int32Array || (globalThis.Int32Array = Array);
/*!
 * @pixi/constants - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/constants is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var xe;
(function(r) {
  r[r.WEBGL_LEGACY = 0] = "WEBGL_LEGACY", r[r.WEBGL = 1] = "WEBGL", r[r.WEBGL2 = 2] = "WEBGL2";
})(xe || (xe = {}));
var ri;
(function(r) {
  r[r.UNKNOWN = 0] = "UNKNOWN", r[r.WEBGL = 1] = "WEBGL", r[r.CANVAS = 2] = "CANVAS";
})(ri || (ri = {}));
var rn;
(function(r) {
  r[r.COLOR = 16384] = "COLOR", r[r.DEPTH = 256] = "DEPTH", r[r.STENCIL = 1024] = "STENCIL";
})(rn || (rn = {}));
var z;
(function(r) {
  r[r.NORMAL = 0] = "NORMAL", r[r.ADD = 1] = "ADD", r[r.MULTIPLY = 2] = "MULTIPLY", r[r.SCREEN = 3] = "SCREEN", r[r.OVERLAY = 4] = "OVERLAY", r[r.DARKEN = 5] = "DARKEN", r[r.LIGHTEN = 6] = "LIGHTEN", r[r.COLOR_DODGE = 7] = "COLOR_DODGE", r[r.COLOR_BURN = 8] = "COLOR_BURN", r[r.HARD_LIGHT = 9] = "HARD_LIGHT", r[r.SOFT_LIGHT = 10] = "SOFT_LIGHT", r[r.DIFFERENCE = 11] = "DIFFERENCE", r[r.EXCLUSION = 12] = "EXCLUSION", r[r.HUE = 13] = "HUE", r[r.SATURATION = 14] = "SATURATION", r[r.COLOR = 15] = "COLOR", r[r.LUMINOSITY = 16] = "LUMINOSITY", r[r.NORMAL_NPM = 17] = "NORMAL_NPM", r[r.ADD_NPM = 18] = "ADD_NPM", r[r.SCREEN_NPM = 19] = "SCREEN_NPM", r[r.NONE = 20] = "NONE", r[r.SRC_OVER = 0] = "SRC_OVER", r[r.SRC_IN = 21] = "SRC_IN", r[r.SRC_OUT = 22] = "SRC_OUT", r[r.SRC_ATOP = 23] = "SRC_ATOP", r[r.DST_OVER = 24] = "DST_OVER", r[r.DST_IN = 25] = "DST_IN", r[r.DST_OUT = 26] = "DST_OUT", r[r.DST_ATOP = 27] = "DST_ATOP", r[r.ERASE = 26] = "ERASE", r[r.SUBTRACT = 28] = "SUBTRACT", r[r.XOR = 29] = "XOR";
})(z || (z = {}));
var ie;
(function(r) {
  r[r.POINTS = 0] = "POINTS", r[r.LINES = 1] = "LINES", r[r.LINE_LOOP = 2] = "LINE_LOOP", r[r.LINE_STRIP = 3] = "LINE_STRIP", r[r.TRIANGLES = 4] = "TRIANGLES", r[r.TRIANGLE_STRIP = 5] = "TRIANGLE_STRIP", r[r.TRIANGLE_FAN = 6] = "TRIANGLE_FAN";
})(ie || (ie = {}));
var B;
(function(r) {
  r[r.RGBA = 6408] = "RGBA", r[r.RGB = 6407] = "RGB", r[r.RG = 33319] = "RG", r[r.RED = 6403] = "RED", r[r.RGBA_INTEGER = 36249] = "RGBA_INTEGER", r[r.RGB_INTEGER = 36248] = "RGB_INTEGER", r[r.RG_INTEGER = 33320] = "RG_INTEGER", r[r.RED_INTEGER = 36244] = "RED_INTEGER", r[r.ALPHA = 6406] = "ALPHA", r[r.LUMINANCE = 6409] = "LUMINANCE", r[r.LUMINANCE_ALPHA = 6410] = "LUMINANCE_ALPHA", r[r.DEPTH_COMPONENT = 6402] = "DEPTH_COMPONENT", r[r.DEPTH_STENCIL = 34041] = "DEPTH_STENCIL";
})(B || (B = {}));
var tr;
(function(r) {
  r[r.TEXTURE_2D = 3553] = "TEXTURE_2D", r[r.TEXTURE_CUBE_MAP = 34067] = "TEXTURE_CUBE_MAP", r[r.TEXTURE_2D_ARRAY = 35866] = "TEXTURE_2D_ARRAY", r[r.TEXTURE_CUBE_MAP_POSITIVE_X = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X", r[r.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X", r[r.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y", r[r.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y", r[r.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z", r[r.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
})(tr || (tr = {}));
var V;
(function(r) {
  r[r.UNSIGNED_BYTE = 5121] = "UNSIGNED_BYTE", r[r.UNSIGNED_SHORT = 5123] = "UNSIGNED_SHORT", r[r.UNSIGNED_SHORT_5_6_5 = 33635] = "UNSIGNED_SHORT_5_6_5", r[r.UNSIGNED_SHORT_4_4_4_4 = 32819] = "UNSIGNED_SHORT_4_4_4_4", r[r.UNSIGNED_SHORT_5_5_5_1 = 32820] = "UNSIGNED_SHORT_5_5_5_1", r[r.UNSIGNED_INT = 5125] = "UNSIGNED_INT", r[r.UNSIGNED_INT_10F_11F_11F_REV = 35899] = "UNSIGNED_INT_10F_11F_11F_REV", r[r.UNSIGNED_INT_2_10_10_10_REV = 33640] = "UNSIGNED_INT_2_10_10_10_REV", r[r.UNSIGNED_INT_24_8 = 34042] = "UNSIGNED_INT_24_8", r[r.UNSIGNED_INT_5_9_9_9_REV = 35902] = "UNSIGNED_INT_5_9_9_9_REV", r[r.BYTE = 5120] = "BYTE", r[r.SHORT = 5122] = "SHORT", r[r.INT = 5124] = "INT", r[r.FLOAT = 5126] = "FLOAT", r[r.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV", r[r.HALF_FLOAT = 36193] = "HALF_FLOAT";
})(V || (V = {}));
var nn;
(function(r) {
  r[r.FLOAT = 0] = "FLOAT", r[r.INT = 1] = "INT", r[r.UINT = 2] = "UINT";
})(nn || (nn = {}));
var fe;
(function(r) {
  r[r.NEAREST = 0] = "NEAREST", r[r.LINEAR = 1] = "LINEAR";
})(fe || (fe = {}));
var de;
(function(r) {
  r[r.CLAMP = 33071] = "CLAMP", r[r.REPEAT = 10497] = "REPEAT", r[r.MIRRORED_REPEAT = 33648] = "MIRRORED_REPEAT";
})(de || (de = {}));
var oe;
(function(r) {
  r[r.OFF = 0] = "OFF", r[r.POW2 = 1] = "POW2", r[r.ON = 2] = "ON", r[r.ON_MANUAL = 3] = "ON_MANUAL";
})(oe || (oe = {}));
var se;
(function(r) {
  r[r.NPM = 0] = "NPM", r[r.UNPACK = 1] = "UNPACK", r[r.PMA = 2] = "PMA", r[r.NO_PREMULTIPLIED_ALPHA = 0] = "NO_PREMULTIPLIED_ALPHA", r[r.PREMULTIPLY_ON_UPLOAD = 1] = "PREMULTIPLY_ON_UPLOAD", r[r.PREMULTIPLY_ALPHA = 2] = "PREMULTIPLY_ALPHA", r[r.PREMULTIPLIED_ALPHA = 2] = "PREMULTIPLIED_ALPHA";
})(se || (se = {}));
var re;
(function(r) {
  r[r.NO = 0] = "NO", r[r.YES = 1] = "YES", r[r.AUTO = 2] = "AUTO", r[r.BLEND = 0] = "BLEND", r[r.CLEAR = 1] = "CLEAR", r[r.BLIT = 2] = "BLIT";
})(re || (re = {}));
var an;
(function(r) {
  r[r.AUTO = 0] = "AUTO", r[r.MANUAL = 1] = "MANUAL";
})(an || (an = {}));
var Vt;
(function(r) {
  r.LOW = "lowp", r.MEDIUM = "mediump", r.HIGH = "highp";
})(Vt || (Vt = {}));
var Rt;
(function(r) {
  r[r.NONE = 0] = "NONE", r[r.SCISSOR = 1] = "SCISSOR", r[r.STENCIL = 2] = "STENCIL", r[r.SPRITE = 3] = "SPRITE", r[r.COLOR = 4] = "COLOR";
})(Rt || (Rt = {}));
var Jo;
(function(r) {
  r[r.RED = 1] = "RED", r[r.GREEN = 2] = "GREEN", r[r.BLUE = 4] = "BLUE", r[r.ALPHA = 8] = "ALPHA";
})(Jo || (Jo = {}));
var bt;
(function(r) {
  r[r.NONE = 0] = "NONE", r[r.LOW = 2] = "LOW", r[r.MEDIUM = 4] = "MEDIUM", r[r.HIGH = 8] = "HIGH";
})(bt || (bt = {}));
var pe;
(function(r) {
  r[r.ELEMENT_ARRAY_BUFFER = 34963] = "ELEMENT_ARRAY_BUFFER", r[r.ARRAY_BUFFER = 34962] = "ARRAY_BUFFER", r[r.UNIFORM_BUFFER = 35345] = "UNIFORM_BUFFER";
})(pe || (pe = {}));
/*!
 * @pixi/settings - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/settings is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var Mf = {
  /**
   * Creates a canvas element of the given size.
   * This canvas is created using the browser's native canvas element.
   * @param width - width of the canvas
   * @param height - height of the canvas
   */
  createCanvas: function(r, t) {
    var e = document.createElement("canvas");
    return e.width = r, e.height = t, e;
  },
  getWebGLRenderingContext: function() {
    return WebGLRenderingContext;
  },
  getNavigator: function() {
    return navigator;
  },
  getBaseUrl: function() {
    var r;
    return (r = document.baseURI) !== null && r !== void 0 ? r : window.location.href;
  },
  fetch: function(r, t) {
    return fetch(r, t);
  }
}, Nn = /iPhone/i, ts = /iPod/i, es = /iPad/i, rs = /\biOS-universal(?:.+)Mac\b/i, Bn = /\bAndroid(?:.+)Mobile\b/i, is = /Android/i, dr = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i, mi = /Silk/i, ye = /Windows Phone/i, ns = /\bWindows(?:.+)ARM\b/i, as = /BlackBerry/i, os = /BB10/i, ss = /Opera Mini/i, us = /\b(CriOS|Chrome)(?:.+)Mobile/i, hs = /Mobile(?:.+)Firefox\b/i, ls = function(r) {
  return typeof r < "u" && r.platform === "MacIntel" && typeof r.maxTouchPoints == "number" && r.maxTouchPoints > 1 && typeof MSStream > "u";
};
function Df(r) {
  return function(t) {
    return t.test(r);
  };
}
function Ff(r) {
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
  var n = Df(e), a = {
    apple: {
      phone: n(Nn) && !n(ye),
      ipod: n(ts),
      tablet: !n(Nn) && (n(es) || ls(t)) && !n(ye),
      universal: n(rs),
      device: (n(Nn) || n(ts) || n(es) || n(rs) || ls(t)) && !n(ye)
    },
    amazon: {
      phone: n(dr),
      tablet: !n(dr) && n(mi),
      device: n(dr) || n(mi)
    },
    android: {
      phone: !n(ye) && n(dr) || !n(ye) && n(Bn),
      tablet: !n(ye) && !n(dr) && !n(Bn) && (n(mi) || n(is)),
      device: !n(ye) && (n(dr) || n(mi) || n(Bn) || n(is)) || n(/\bokhttp\b/i)
    },
    windows: {
      phone: n(ye),
      tablet: n(ns),
      device: n(ye) || n(ns)
    },
    other: {
      blackberry: n(as),
      blackberry10: n(os),
      opera: n(ss),
      firefox: n(hs),
      chrome: n(us),
      device: n(as) || n(os) || n(ss) || n(hs) || n(us)
    },
    any: !1,
    phone: !1,
    tablet: !1
  };
  return a.any = a.apple.device || a.android.device || a.windows.device || a.other.device, a.phone = a.apple.phone || a.android.phone || a.windows.phone, a.tablet = a.apple.tablet || a.android.tablet || a.windows.tablet, a;
}
var ce = Ff(globalThis.navigator);
function Nf() {
  return !ce.apple.device;
}
function Bf(r) {
  var t = !0;
  if (ce.tablet || ce.phone) {
    if (ce.apple.device) {
      var e = navigator.userAgent.match(/OS (\d+)_(\d+)?/);
      if (e) {
        var i = parseInt(e[1], 10);
        i < 11 && (t = !1);
      }
    }
    if (ce.android.device) {
      var e = navigator.userAgent.match(/Android\s([0-9.]*)/);
      if (e) {
        var i = parseInt(e[1], 10);
        i < 7 && (t = !1);
      }
    }
  }
  return t ? r : 4;
}
var k = {
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
  ADAPTER: Mf,
  /**
   * If set to true WebGL will attempt make textures mimpaped by default.
   * Mipmapping will only succeed if the base texture uploaded has power of two dimensions.
   * @static
   * @name MIPMAP_TEXTURES
   * @memberof PIXI.settings
   * @type {PIXI.MIPMAP_MODES}
   * @default PIXI.MIPMAP_MODES.POW2
   */
  MIPMAP_TEXTURES: oe.POW2,
  /**
   * Default anisotropic filtering level of textures.
   * Usually from 0 to 16
   * @static
   * @name ANISOTROPIC_LEVEL
   * @memberof PIXI.settings
   * @type {number}
   * @default 0
   */
  ANISOTROPIC_LEVEL: 0,
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
   * Default filter resolution.
   * @static
   * @name FILTER_RESOLUTION
   * @memberof PIXI.settings
   * @type {number}
   * @default 1
   */
  FILTER_RESOLUTION: 1,
  /**
   * Default filter samples.
   * @static
   * @name FILTER_MULTISAMPLE
   * @memberof PIXI.settings
   * @type {PIXI.MSAA_QUALITY}
   * @default PIXI.MSAA_QUALITY.NONE
   */
  FILTER_MULTISAMPLE: bt.NONE,
  /**
   * The maximum textures that this device supports.
   * @static
   * @name SPRITE_MAX_TEXTURES
   * @memberof PIXI.settings
   * @type {number}
   * @default 32
   */
  SPRITE_MAX_TEXTURES: Bf(32),
  // TODO: maybe change to SPRITE.BATCH_SIZE: 2000
  // TODO: maybe add PARTICLE.BATCH_SIZE: 15000
  /**
   * The default sprite batch size.
   *
   * The default aims to balance desktop and mobile devices.
   * @static
   * @name SPRITE_BATCH_SIZE
   * @memberof PIXI.settings
   * @type {number}
   * @default 4096
   */
  SPRITE_BATCH_SIZE: 4096,
  /**
   * The default render options if none are supplied to {@link PIXI.Renderer}
   * or {@link PIXI.CanvasRenderer}.
   * @static
   * @name RENDER_OPTIONS
   * @memberof PIXI.settings
   * @type {object}
   * @property {boolean} [antialias=false] - {@link PIXI.IRendererOptions.antialias}
   * @property {boolean} [autoDensity=false] - {@link PIXI.IRendererOptions.autoDensity}
   * @property {number} [backgroundAlpha=1] - {@link PIXI.IRendererOptions.backgroundAlpha}
   * @property {number} [backgroundColor=0x000000] - {@link PIXI.IRendererOptions.backgroundColor}
   * @property {boolean} [clearBeforeRender=true] - {@link PIXI.IRendererOptions.clearBeforeRender}
   * @property {number} [height=600] - {@link PIXI.IRendererOptions.height}
   * @property {boolean} [preserveDrawingBuffer=false] - {@link PIXI.IRendererOptions.preserveDrawingBuffer}
   * @property {boolean|'notMultiplied'} [useContextAlpha=true] - {@link PIXI.IRendererOptions.useContextAlpha}
   * @property {HTMLCanvasElement} [view=null] - {@link PIXI.IRendererOptions.view}
   * @property {number} [width=800] - {@link PIXI.IRendererOptions.width}
   */
  RENDER_OPTIONS: {
    view: null,
    width: 800,
    height: 600,
    autoDensity: !1,
    backgroundColor: 0,
    backgroundAlpha: 1,
    useContextAlpha: !0,
    clearBeforeRender: !0,
    antialias: !1,
    preserveDrawingBuffer: !1
  },
  /**
   * Default Garbage Collection mode.
   * @static
   * @name GC_MODE
   * @memberof PIXI.settings
   * @type {PIXI.GC_MODES}
   * @default PIXI.GC_MODES.AUTO
   */
  GC_MODE: an.AUTO,
  /**
   * Default Garbage Collection max idle.
   * @static
   * @name GC_MAX_IDLE
   * @memberof PIXI.settings
   * @type {number}
   * @default 3600
   */
  GC_MAX_IDLE: 60 * 60,
  /**
   * Default Garbage Collection maximum check count.
   * @static
   * @name GC_MAX_CHECK_COUNT
   * @memberof PIXI.settings
   * @type {number}
   * @default 600
   */
  GC_MAX_CHECK_COUNT: 60 * 10,
  /**
   * Default wrap modes that are supported by pixi.
   * @static
   * @name WRAP_MODE
   * @memberof PIXI.settings
   * @type {PIXI.WRAP_MODES}
   * @default PIXI.WRAP_MODES.CLAMP
   */
  WRAP_MODE: de.CLAMP,
  /**
   * Default scale mode for textures.
   * @static
   * @name SCALE_MODE
   * @memberof PIXI.settings
   * @type {PIXI.SCALE_MODES}
   * @default PIXI.SCALE_MODES.LINEAR
   */
  SCALE_MODE: fe.LINEAR,
  /**
   * Default specify float precision in vertex shader.
   * @static
   * @name PRECISION_VERTEX
   * @memberof PIXI.settings
   * @type {PIXI.PRECISION}
   * @default PIXI.PRECISION.HIGH
   */
  PRECISION_VERTEX: Vt.HIGH,
  /**
   * Default specify float precision in fragment shader.
   * iOS is best set at highp due to https://github.com/pixijs/pixi.js/issues/3742
   * @static
   * @name PRECISION_FRAGMENT
   * @memberof PIXI.settings
   * @type {PIXI.PRECISION}
   * @default PIXI.PRECISION.MEDIUM
   */
  PRECISION_FRAGMENT: ce.apple.device ? Vt.HIGH : Vt.MEDIUM,
  /**
   * Can we upload the same buffer in a single frame?
   * @static
   * @name CAN_UPLOAD_SAME_BUFFER
   * @memberof PIXI.settings
   * @type {boolean}
   */
  CAN_UPLOAD_SAME_BUFFER: Nf(),
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
   * @constant
   * @memberof PIXI.settings
   * @type {boolean}
   * @default false
   */
  ROUND_PIXELS: !1
}, lh = { exports: {} };
(function(r) {
  var t = Object.prototype.hasOwnProperty, e = "~";
  function i() {
  }
  Object.create && (i.prototype = /* @__PURE__ */ Object.create(null), new i().__proto__ || (e = !1));
  function n(u, h, l) {
    this.fn = u, this.context = h, this.once = l || !1;
  }
  function a(u, h, l, f, c) {
    if (typeof l != "function")
      throw new TypeError("The listener must be a function");
    var d = new n(l, f || u, c), p = e ? e + h : h;
    return u._events[p] ? u._events[p].fn ? u._events[p] = [u._events[p], d] : u._events[p].push(d) : (u._events[p] = d, u._eventsCount++), u;
  }
  function o(u, h) {
    --u._eventsCount === 0 ? u._events = new i() : delete u._events[h];
  }
  function s() {
    this._events = new i(), this._eventsCount = 0;
  }
  s.prototype.eventNames = function() {
    var h = [], l, f;
    if (this._eventsCount === 0)
      return h;
    for (f in l = this._events)
      t.call(l, f) && h.push(e ? f.slice(1) : f);
    return Object.getOwnPropertySymbols ? h.concat(Object.getOwnPropertySymbols(l)) : h;
  }, s.prototype.listeners = function(h) {
    var l = e ? e + h : h, f = this._events[l];
    if (!f)
      return [];
    if (f.fn)
      return [f.fn];
    for (var c = 0, d = f.length, p = new Array(d); c < d; c++)
      p[c] = f[c].fn;
    return p;
  }, s.prototype.listenerCount = function(h) {
    var l = e ? e + h : h, f = this._events[l];
    return f ? f.fn ? 1 : f.length : 0;
  }, s.prototype.emit = function(h, l, f, c, d, p) {
    var _ = e ? e + h : h;
    if (!this._events[_])
      return !1;
    var v = this._events[_], y = arguments.length, g, m;
    if (v.fn) {
      switch (v.once && this.removeListener(h, v.fn, void 0, !0), y) {
        case 1:
          return v.fn.call(v.context), !0;
        case 2:
          return v.fn.call(v.context, l), !0;
        case 3:
          return v.fn.call(v.context, l, f), !0;
        case 4:
          return v.fn.call(v.context, l, f, c), !0;
        case 5:
          return v.fn.call(v.context, l, f, c, d), !0;
        case 6:
          return v.fn.call(v.context, l, f, c, d, p), !0;
      }
      for (m = 1, g = new Array(y - 1); m < y; m++)
        g[m - 1] = arguments[m];
      v.fn.apply(v.context, g);
    } else {
      var E = v.length, b;
      for (m = 0; m < E; m++)
        switch (v[m].once && this.removeListener(h, v[m].fn, void 0, !0), y) {
          case 1:
            v[m].fn.call(v[m].context);
            break;
          case 2:
            v[m].fn.call(v[m].context, l);
            break;
          case 3:
            v[m].fn.call(v[m].context, l, f);
            break;
          case 4:
            v[m].fn.call(v[m].context, l, f, c);
            break;
          default:
            if (!g)
              for (b = 1, g = new Array(y - 1); b < y; b++)
                g[b - 1] = arguments[b];
            v[m].fn.apply(v[m].context, g);
        }
    }
    return !0;
  }, s.prototype.on = function(h, l, f) {
    return a(this, h, l, f, !1);
  }, s.prototype.once = function(h, l, f) {
    return a(this, h, l, f, !0);
  }, s.prototype.removeListener = function(h, l, f, c) {
    var d = e ? e + h : h;
    if (!this._events[d])
      return this;
    if (!l)
      return o(this, d), this;
    var p = this._events[d];
    if (p.fn)
      p.fn === l && (!c || p.once) && (!f || p.context === f) && o(this, d);
    else {
      for (var _ = 0, v = [], y = p.length; _ < y; _++)
        (p[_].fn !== l || c && !p[_].once || f && p[_].context !== f) && v.push(p[_]);
      v.length ? this._events[d] = v.length === 1 ? v[0] : v : o(this, d);
    }
    return this;
  }, s.prototype.removeAllListeners = function(h) {
    var l;
    return h ? (l = e ? e + h : h, this._events[l] && o(this, l)) : (this._events = new i(), this._eventsCount = 0), this;
  }, s.prototype.off = s.prototype.removeListener, s.prototype.addListener = s.prototype.on, s.prefixed = e, s.EventEmitter = s, r.exports = s;
})(lh);
var Lf = lh.exports;
const fi = /* @__PURE__ */ Tn(Lf);
var Ao = { exports: {} };
Ao.exports = xn;
Ao.exports.default = xn;
function xn(r, t, e) {
  e = e || 2;
  var i = t && t.length, n = i ? t[0] * e : r.length, a = fh(r, 0, n, e, !0), o = [];
  if (!a || a.next === a.prev)
    return o;
  var s, u, h, l, f, c, d;
  if (i && (a = Xf(r, t, a, e)), r.length > 80 * e) {
    s = h = r[0], u = l = r[1];
    for (var p = e; p < n; p += e)
      f = r[p], c = r[p + 1], f < s && (s = f), c < u && (u = c), f > h && (h = f), c > l && (l = c);
    d = Math.max(h - s, l - u), d = d !== 0 ? 32767 / d : 0;
  }
  return ii(a, o, e, s, u, d, 0), o;
}
function fh(r, t, e, i, n) {
  var a, o;
  if (n === Ra(r, t, e, i) > 0)
    for (a = t; a < e; a += i)
      o = fs(a, r[a], r[a + 1], o);
  else
    for (a = e - i; a >= t; a -= i)
      o = fs(a, r[a], r[a + 1], o);
  return o && wn(o, o.next) && (ai(o), o = o.next), o;
}
function nr(r, t) {
  if (!r)
    return r;
  t || (t = r);
  var e = r, i;
  do
    if (i = !1, !e.steiner && (wn(e, e.next) || xt(e.prev, e, e.next) === 0)) {
      if (ai(e), e = t = e.prev, e === e.next)
        break;
      i = !0;
    } else
      e = e.next;
  while (i || e !== t);
  return t;
}
function ii(r, t, e, i, n, a, o) {
  if (r) {
    !o && a && Yf(r, i, n, a);
    for (var s = r, u, h; r.prev !== r.next; ) {
      if (u = r.prev, h = r.next, a ? Gf(r, i, n, a) : Uf(r)) {
        t.push(u.i / e | 0), t.push(r.i / e | 0), t.push(h.i / e | 0), ai(r), r = h.next, s = h.next;
        continue;
      }
      if (r = h, r === s) {
        o ? o === 1 ? (r = kf(nr(r), t, e), ii(r, t, e, i, n, a, 2)) : o === 2 && Hf(r, t, e, i, n, a) : ii(nr(r), t, e, i, n, a, 1);
        break;
      }
    }
  }
}
function Uf(r) {
  var t = r.prev, e = r, i = r.next;
  if (xt(t, e, i) >= 0)
    return !1;
  for (var n = t.x, a = e.x, o = i.x, s = t.y, u = e.y, h = i.y, l = n < a ? n < o ? n : o : a < o ? a : o, f = s < u ? s < h ? s : h : u < h ? u : h, c = n > a ? n > o ? n : o : a > o ? a : o, d = s > u ? s > h ? s : h : u > h ? u : h, p = i.next; p !== t; ) {
    if (p.x >= l && p.x <= c && p.y >= f && p.y <= d && Er(n, s, a, u, o, h, p.x, p.y) && xt(p.prev, p, p.next) >= 0)
      return !1;
    p = p.next;
  }
  return !0;
}
function Gf(r, t, e, i) {
  var n = r.prev, a = r, o = r.next;
  if (xt(n, a, o) >= 0)
    return !1;
  for (var s = n.x, u = a.x, h = o.x, l = n.y, f = a.y, c = o.y, d = s < u ? s < h ? s : h : u < h ? u : h, p = l < f ? l < c ? l : c : f < c ? f : c, _ = s > u ? s > h ? s : h : u > h ? u : h, v = l > f ? l > c ? l : c : f > c ? f : c, y = Pa(d, p, t, e, i), g = Pa(_, v, t, e, i), m = r.prevZ, E = r.nextZ; m && m.z >= y && E && E.z <= g; ) {
    if (m.x >= d && m.x <= _ && m.y >= p && m.y <= v && m !== n && m !== o && Er(s, l, u, f, h, c, m.x, m.y) && xt(m.prev, m, m.next) >= 0 || (m = m.prevZ, E.x >= d && E.x <= _ && E.y >= p && E.y <= v && E !== n && E !== o && Er(s, l, u, f, h, c, E.x, E.y) && xt(E.prev, E, E.next) >= 0))
      return !1;
    E = E.nextZ;
  }
  for (; m && m.z >= y; ) {
    if (m.x >= d && m.x <= _ && m.y >= p && m.y <= v && m !== n && m !== o && Er(s, l, u, f, h, c, m.x, m.y) && xt(m.prev, m, m.next) >= 0)
      return !1;
    m = m.prevZ;
  }
  for (; E && E.z <= g; ) {
    if (E.x >= d && E.x <= _ && E.y >= p && E.y <= v && E !== n && E !== o && Er(s, l, u, f, h, c, E.x, E.y) && xt(E.prev, E, E.next) >= 0)
      return !1;
    E = E.nextZ;
  }
  return !0;
}
function kf(r, t, e) {
  var i = r;
  do {
    var n = i.prev, a = i.next.next;
    !wn(n, a) && ch(n, i, i.next, a) && ni(n, a) && ni(a, n) && (t.push(n.i / e | 0), t.push(i.i / e | 0), t.push(a.i / e | 0), ai(i), ai(i.next), i = r = a), i = i.next;
  } while (i !== r);
  return nr(i);
}
function Hf(r, t, e, i, n, a) {
  var o = r;
  do {
    for (var s = o.next.next; s !== o.prev; ) {
      if (o.i !== s.i && Kf(o, s)) {
        var u = dh(o, s);
        o = nr(o, o.next), u = nr(u, u.next), ii(o, t, e, i, n, a, 0), ii(u, t, e, i, n, a, 0);
        return;
      }
      s = s.next;
    }
    o = o.next;
  } while (o !== r);
}
function Xf(r, t, e, i) {
  var n = [], a, o, s, u, h;
  for (a = 0, o = t.length; a < o; a++)
    s = t[a] * i, u = a < o - 1 ? t[a + 1] * i : r.length, h = fh(r, s, u, i, !1), h === h.next && (h.steiner = !0), n.push(Zf(h));
  for (n.sort(jf), a = 0; a < n.length; a++)
    e = Vf(n[a], e);
  return e;
}
function jf(r, t) {
  return r.x - t.x;
}
function Vf(r, t) {
  var e = zf(r, t);
  if (!e)
    return t;
  var i = dh(e, r);
  return nr(i, i.next), nr(e, e.next);
}
function zf(r, t) {
  var e = t, i = r.x, n = r.y, a = -1 / 0, o;
  do {
    if (n <= e.y && n >= e.next.y && e.next.y !== e.y) {
      var s = e.x + (n - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
      if (s <= i && s > a && (a = s, o = e.x < e.next.x ? e : e.next, s === i))
        return o;
    }
    e = e.next;
  } while (e !== t);
  if (!o)
    return null;
  var u = o, h = o.x, l = o.y, f = 1 / 0, c;
  e = o;
  do
    i >= e.x && e.x >= h && i !== e.x && Er(n < l ? i : a, n, h, l, n < l ? a : i, n, e.x, e.y) && (c = Math.abs(n - e.y) / (i - e.x), ni(e, r) && (c < f || c === f && (e.x > o.x || e.x === o.x && Wf(o, e))) && (o = e, f = c)), e = e.next;
  while (e !== u);
  return o;
}
function Wf(r, t) {
  return xt(r.prev, r, t.prev) < 0 && xt(t.next, r, r.next) < 0;
}
function Yf(r, t, e, i) {
  var n = r;
  do
    n.z === 0 && (n.z = Pa(n.x, n.y, t, e, i)), n.prevZ = n.prev, n.nextZ = n.next, n = n.next;
  while (n !== r);
  n.prevZ.nextZ = null, n.prevZ = null, qf(n);
}
function qf(r) {
  var t, e, i, n, a, o, s, u, h = 1;
  do {
    for (e = r, r = null, a = null, o = 0; e; ) {
      for (o++, i = e, s = 0, t = 0; t < h && (s++, i = i.nextZ, !!i); t++)
        ;
      for (u = h; s > 0 || u > 0 && i; )
        s !== 0 && (u === 0 || !i || e.z <= i.z) ? (n = e, e = e.nextZ, s--) : (n = i, i = i.nextZ, u--), a ? a.nextZ = n : r = n, n.prevZ = a, a = n;
      e = i;
    }
    a.nextZ = null, h *= 2;
  } while (o > 1);
  return r;
}
function Pa(r, t, e, i, n) {
  return r = (r - e) * n | 0, t = (t - i) * n | 0, r = (r | r << 8) & 16711935, r = (r | r << 4) & 252645135, r = (r | r << 2) & 858993459, r = (r | r << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, r | t << 1;
}
function Zf(r) {
  var t = r, e = r;
  do
    (t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next;
  while (t !== r);
  return e;
}
function Er(r, t, e, i, n, a, o, s) {
  return (n - o) * (t - s) >= (r - o) * (a - s) && (r - o) * (i - s) >= (e - o) * (t - s) && (e - o) * (a - s) >= (n - o) * (i - s);
}
function Kf(r, t) {
  return r.next.i !== t.i && r.prev.i !== t.i && !$f(r, t) && // dones't intersect other edges
  (ni(r, t) && ni(t, r) && Qf(r, t) && // locally visible
  (xt(r.prev, r, t.prev) || xt(r, t.prev, t)) || // does not create opposite-facing sectors
  wn(r, t) && xt(r.prev, r, r.next) > 0 && xt(t.prev, t, t.next) > 0);
}
function xt(r, t, e) {
  return (t.y - r.y) * (e.x - t.x) - (t.x - r.x) * (e.y - t.y);
}
function wn(r, t) {
  return r.x === t.x && r.y === t.y;
}
function ch(r, t, e, i) {
  var n = Ei(xt(r, t, e)), a = Ei(xt(r, t, i)), o = Ei(xt(e, i, r)), s = Ei(xt(e, i, t));
  return !!(n !== a && o !== s || n === 0 && bi(r, e, t) || a === 0 && bi(r, i, t) || o === 0 && bi(e, r, i) || s === 0 && bi(e, t, i));
}
function bi(r, t, e) {
  return t.x <= Math.max(r.x, e.x) && t.x >= Math.min(r.x, e.x) && t.y <= Math.max(r.y, e.y) && t.y >= Math.min(r.y, e.y);
}
function Ei(r) {
  return r > 0 ? 1 : r < 0 ? -1 : 0;
}
function $f(r, t) {
  var e = r;
  do {
    if (e.i !== r.i && e.next.i !== r.i && e.i !== t.i && e.next.i !== t.i && ch(e, e.next, r, t))
      return !0;
    e = e.next;
  } while (e !== r);
  return !1;
}
function ni(r, t) {
  return xt(r.prev, r, r.next) < 0 ? xt(r, t, r.next) >= 0 && xt(r, r.prev, t) >= 0 : xt(r, t, r.prev) < 0 || xt(r, r.next, t) < 0;
}
function Qf(r, t) {
  var e = r, i = !1, n = (r.x + t.x) / 2, a = (r.y + t.y) / 2;
  do
    e.y > a != e.next.y > a && e.next.y !== e.y && n < (e.next.x - e.x) * (a - e.y) / (e.next.y - e.y) + e.x && (i = !i), e = e.next;
  while (e !== r);
  return i;
}
function dh(r, t) {
  var e = new Aa(r.i, r.x, r.y), i = new Aa(t.i, t.x, t.y), n = r.next, a = t.prev;
  return r.next = t, t.prev = r, e.next = n, n.prev = e, i.next = e, e.prev = i, a.next = i, i.prev = a, i;
}
function fs(r, t, e, i) {
  var n = new Aa(r, t, e);
  return i ? (n.next = i.next, n.prev = i, i.next.prev = n, i.next = n) : (n.prev = n, n.next = n), n;
}
function ai(r) {
  r.next.prev = r.prev, r.prev.next = r.next, r.prevZ && (r.prevZ.nextZ = r.nextZ), r.nextZ && (r.nextZ.prevZ = r.prevZ);
}
function Aa(r, t, e) {
  this.i = r, this.x = t, this.y = e, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = !1;
}
xn.deviation = function(r, t, e, i) {
  var n = t && t.length, a = n ? t[0] * e : r.length, o = Math.abs(Ra(r, 0, a, e));
  if (n)
    for (var s = 0, u = t.length; s < u; s++) {
      var h = t[s] * e, l = s < u - 1 ? t[s + 1] * e : r.length;
      o -= Math.abs(Ra(r, h, l, e));
    }
  var f = 0;
  for (s = 0; s < i.length; s += 3) {
    var c = i[s] * e, d = i[s + 1] * e, p = i[s + 2] * e;
    f += Math.abs(
      (r[c] - r[p]) * (r[d + 1] - r[c + 1]) - (r[c] - r[d]) * (r[p + 1] - r[c + 1])
    );
  }
  return o === 0 && f === 0 ? 0 : Math.abs((f - o) / o);
};
function Ra(r, t, e, i) {
  for (var n = 0, a = t, o = e - i; a < e; a += i)
    n += (r[o] - r[a]) * (r[a + 1] + r[o + 1]), o = a;
  return n;
}
xn.flatten = function(r) {
  for (var t = r[0][0].length, e = { vertices: [], holes: [], dimensions: t }, i = 0, n = 0; n < r.length; n++) {
    for (var a = 0; a < r[n].length; a++)
      for (var o = 0; o < t; o++)
        e.vertices.push(r[n][a][o]);
    n > 0 && (i += r[n - 1].length, e.holes.push(i));
  }
  return e;
};
var Jf = Ao.exports;
const ph = /* @__PURE__ */ Tn(Jf);
var on = { exports: {} };
/*! https://mths.be/punycode v1.4.1 by @mathias */
on.exports;
(function(r, t) {
  (function(e) {
    var i = t && !t.nodeType && t, n = r && !r.nodeType && r, a = typeof Zi == "object" && Zi;
    (a.global === a || a.window === a || a.self === a) && (e = a);
    var o, s = 2147483647, u = 36, h = 1, l = 26, f = 38, c = 700, d = 72, p = 128, _ = "-", v = /^xn--/, y = /[^\x20-\x7E]/, g = /[\x2E\u3002\uFF0E\uFF61]/g, m = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    }, E = u - h, b = Math.floor, x = String.fromCharCode, S;
    function A(C) {
      throw new RangeError(m[C]);
    }
    function w(C, M) {
      for (var j = C.length, J = []; j--; )
        J[j] = M(C[j]);
      return J;
    }
    function P(C, M) {
      var j = C.split("@"), J = "";
      j.length > 1 && (J = j[0] + "@", C = j[1]), C = C.replace(g, ".");
      var tt = C.split("."), dt = w(tt, M).join(".");
      return J + dt;
    }
    function O(C) {
      for (var M = [], j = 0, J = C.length, tt, dt; j < J; )
        tt = C.charCodeAt(j++), tt >= 55296 && tt <= 56319 && j < J ? (dt = C.charCodeAt(j++), (dt & 64512) == 56320 ? M.push(((tt & 1023) << 10) + (dt & 1023) + 65536) : (M.push(tt), j--)) : M.push(tt);
      return M;
    }
    function F(C) {
      return w(C, function(M) {
        var j = "";
        return M > 65535 && (M -= 65536, j += x(M >>> 10 & 1023 | 55296), M = 56320 | M & 1023), j += x(M), j;
      }).join("");
    }
    function D(C) {
      return C - 48 < 10 ? C - 22 : C - 65 < 26 ? C - 65 : C - 97 < 26 ? C - 97 : u;
    }
    function I(C, M) {
      return C + 22 + 75 * (C < 26) - ((M != 0) << 5);
    }
    function R(C, M, j) {
      var J = 0;
      for (C = j ? b(C / c) : C >> 1, C += b(C / M); C > E * l >> 1; J += u)
        C = b(C / E);
      return b(J + (E + 1) * C / (C + f));
    }
    function N(C) {
      var M = [], j = C.length, J, tt = 0, dt = p, $ = d, ht, _t, mt, Z, et, nt, pt, rt, X;
      for (ht = C.lastIndexOf(_), ht < 0 && (ht = 0), _t = 0; _t < ht; ++_t)
        C.charCodeAt(_t) >= 128 && A("not-basic"), M.push(C.charCodeAt(_t));
      for (mt = ht > 0 ? ht + 1 : 0; mt < j; ) {
        for (Z = tt, et = 1, nt = u; mt >= j && A("invalid-input"), pt = D(C.charCodeAt(mt++)), (pt >= u || pt > b((s - tt) / et)) && A("overflow"), tt += pt * et, rt = nt <= $ ? h : nt >= $ + l ? l : nt - $, !(pt < rt); nt += u)
          X = u - rt, et > b(s / X) && A("overflow"), et *= X;
        J = M.length + 1, $ = R(tt - Z, J, Z == 0), b(tt / J) > s - dt && A("overflow"), dt += b(tt / J), tt %= J, M.splice(tt++, 0, dt);
      }
      return F(M);
    }
    function L(C) {
      var M, j, J, tt, dt, $, ht, _t, mt, Z, et, nt = [], pt, rt, X, U;
      for (C = O(C), pt = C.length, M = p, j = 0, dt = d, $ = 0; $ < pt; ++$)
        et = C[$], et < 128 && nt.push(x(et));
      for (J = tt = nt.length, tt && nt.push(_); J < pt; ) {
        for (ht = s, $ = 0; $ < pt; ++$)
          et = C[$], et >= M && et < ht && (ht = et);
        for (rt = J + 1, ht - M > b((s - j) / rt) && A("overflow"), j += (ht - M) * rt, M = ht, $ = 0; $ < pt; ++$)
          if (et = C[$], et < M && ++j > s && A("overflow"), et == M) {
            for (_t = j, mt = u; Z = mt <= dt ? h : mt >= dt + l ? l : mt - dt, !(_t < Z); mt += u)
              U = _t - Z, X = u - Z, nt.push(
                x(I(Z + U % X, 0))
              ), _t = b(U / X);
            nt.push(x(I(_t, 0))), dt = R(j, rt, J == tt), j = 0, ++J;
          }
        ++j, ++M;
      }
      return nt.join("");
    }
    function W(C) {
      return P(C, function(M) {
        return v.test(M) ? N(M.slice(4).toLowerCase()) : M;
      });
    }
    function H(C) {
      return P(C, function(M) {
        return y.test(M) ? "xn--" + L(M) : M;
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
        encode: F
      },
      decode: N,
      encode: L,
      toASCII: H,
      toUnicode: W
    }, i && n)
      if (r.exports == i)
        n.exports = o;
      else
        for (S in o)
          o.hasOwnProperty(S) && (i[S] = o[S]);
    else
      e.punycode = o;
  })(Zi);
})(on, on.exports);
var tc = on.exports, ec = function() {
  if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
    return !1;
  if (typeof Symbol.iterator == "symbol")
    return !0;
  var t = {}, e = Symbol("test"), i = Object(e);
  if (typeof e == "string" || Object.prototype.toString.call(e) !== "[object Symbol]" || Object.prototype.toString.call(i) !== "[object Symbol]")
    return !1;
  var n = 42;
  t[e] = n;
  for (e in t)
    return !1;
  if (typeof Object.keys == "function" && Object.keys(t).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(t).length !== 0)
    return !1;
  var a = Object.getOwnPropertySymbols(t);
  if (a.length !== 1 || a[0] !== e || !Object.prototype.propertyIsEnumerable.call(t, e))
    return !1;
  if (typeof Object.getOwnPropertyDescriptor == "function") {
    var o = Object.getOwnPropertyDescriptor(t, e);
    if (o.value !== n || o.enumerable !== !0)
      return !1;
  }
  return !0;
}, cs = typeof Symbol < "u" && Symbol, rc = ec, ic = function() {
  return typeof cs != "function" || typeof Symbol != "function" || typeof cs("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : rc();
}, ds = {
  foo: {}
}, nc = Object, ac = function() {
  return { __proto__: ds }.foo === ds.foo && !({ __proto__: null } instanceof nc);
}, oc = "Function.prototype.bind called on incompatible ", sc = Object.prototype.toString, uc = Math.max, hc = "[object Function]", ps = function(t, e) {
  for (var i = [], n = 0; n < t.length; n += 1)
    i[n] = t[n];
  for (var a = 0; a < e.length; a += 1)
    i[a + t.length] = e[a];
  return i;
}, lc = function(t, e) {
  for (var i = [], n = e || 0, a = 0; n < t.length; n += 1, a += 1)
    i[a] = t[n];
  return i;
}, fc = function(r, t) {
  for (var e = "", i = 0; i < r.length; i += 1)
    e += r[i], i + 1 < r.length && (e += t);
  return e;
}, cc = function(t) {
  var e = this;
  if (typeof e != "function" || sc.apply(e) !== hc)
    throw new TypeError(oc + e);
  for (var i = lc(arguments, 1), n, a = function() {
    if (this instanceof n) {
      var l = e.apply(
        this,
        ps(i, arguments)
      );
      return Object(l) === l ? l : this;
    }
    return e.apply(
      t,
      ps(i, arguments)
    );
  }, o = uc(0, e.length - i.length), s = [], u = 0; u < o; u++)
    s[u] = "$" + u;
  if (n = Function("binder", "return function (" + fc(s, ",") + "){ return binder.apply(this,arguments); }")(a), e.prototype) {
    var h = function() {
    };
    h.prototype = e.prototype, n.prototype = new h(), h.prototype = null;
  }
  return n;
}, dc = cc, Ro = Function.prototype.bind || dc, pc = Function.prototype.call, vc = Object.prototype.hasOwnProperty, _c = Ro, yc = _c.call(pc, vc), it, Ir = SyntaxError, vh = Function, Pr = TypeError, Ln = function(r) {
  try {
    return vh('"use strict"; return (' + r + ").constructor;")();
  } catch {
  }
}, er = Object.getOwnPropertyDescriptor;
if (er)
  try {
    er({}, "");
  } catch {
    er = null;
  }
var Un = function() {
  throw new Pr();
}, gc = er ? function() {
  try {
    return arguments.callee, Un;
  } catch {
    try {
      return er(arguments, "callee").get;
    } catch {
      return Un;
    }
  }
}() : Un, pr = ic(), mc = ac(), Mt = Object.getPrototypeOf || (mc ? function(r) {
  return r.__proto__;
} : null), br = {}, bc = typeof Uint8Array > "u" || !Mt ? it : Mt(Uint8Array), rr = {
  "%AggregateError%": typeof AggregateError > "u" ? it : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer > "u" ? it : ArrayBuffer,
  "%ArrayIteratorPrototype%": pr && Mt ? Mt([][Symbol.iterator]()) : it,
  "%AsyncFromSyncIteratorPrototype%": it,
  "%AsyncFunction%": br,
  "%AsyncGenerator%": br,
  "%AsyncGeneratorFunction%": br,
  "%AsyncIteratorPrototype%": br,
  "%Atomics%": typeof Atomics > "u" ? it : Atomics,
  "%BigInt%": typeof BigInt > "u" ? it : BigInt,
  "%BigInt64Array%": typeof BigInt64Array > "u" ? it : BigInt64Array,
  "%BigUint64Array%": typeof BigUint64Array > "u" ? it : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView > "u" ? it : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": Error,
  "%eval%": eval,
  // eslint-disable-line no-eval
  "%EvalError%": EvalError,
  "%Float32Array%": typeof Float32Array > "u" ? it : Float32Array,
  "%Float64Array%": typeof Float64Array > "u" ? it : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? it : FinalizationRegistry,
  "%Function%": vh,
  "%GeneratorFunction%": br,
  "%Int8Array%": typeof Int8Array > "u" ? it : Int8Array,
  "%Int16Array%": typeof Int16Array > "u" ? it : Int16Array,
  "%Int32Array%": typeof Int32Array > "u" ? it : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": pr && Mt ? Mt(Mt([][Symbol.iterator]())) : it,
  "%JSON%": typeof JSON == "object" ? JSON : it,
  "%Map%": typeof Map > "u" ? it : Map,
  "%MapIteratorPrototype%": typeof Map > "u" || !pr || !Mt ? it : Mt((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": Object,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise > "u" ? it : Promise,
  "%Proxy%": typeof Proxy > "u" ? it : Proxy,
  "%RangeError%": RangeError,
  "%ReferenceError%": ReferenceError,
  "%Reflect%": typeof Reflect > "u" ? it : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set > "u" ? it : Set,
  "%SetIteratorPrototype%": typeof Set > "u" || !pr || !Mt ? it : Mt((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? it : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": pr && Mt ? Mt(""[Symbol.iterator]()) : it,
  "%Symbol%": pr ? Symbol : it,
  "%SyntaxError%": Ir,
  "%ThrowTypeError%": gc,
  "%TypedArray%": bc,
  "%TypeError%": Pr,
  "%Uint8Array%": typeof Uint8Array > "u" ? it : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? it : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array > "u" ? it : Uint16Array,
  "%Uint32Array%": typeof Uint32Array > "u" ? it : Uint32Array,
  "%URIError%": URIError,
  "%WeakMap%": typeof WeakMap > "u" ? it : WeakMap,
  "%WeakRef%": typeof WeakRef > "u" ? it : WeakRef,
  "%WeakSet%": typeof WeakSet > "u" ? it : WeakSet
};
if (Mt)
  try {
    null.error;
  } catch (r) {
    var Ec = Mt(Mt(r));
    rr["%Error.prototype%"] = Ec;
  }
var Tc = function r(t) {
  var e;
  if (t === "%AsyncFunction%")
    e = Ln("async function () {}");
  else if (t === "%GeneratorFunction%")
    e = Ln("function* () {}");
  else if (t === "%AsyncGeneratorFunction%")
    e = Ln("async function* () {}");
  else if (t === "%AsyncGenerator%") {
    var i = r("%AsyncGeneratorFunction%");
    i && (e = i.prototype);
  } else if (t === "%AsyncIteratorPrototype%") {
    var n = r("%AsyncGenerator%");
    n && Mt && (e = Mt(n.prototype));
  }
  return rr[t] = e, e;
}, vs = {
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
}, ci = Ro, sn = yc, xc = ci.call(Function.call, Array.prototype.concat), wc = ci.call(Function.apply, Array.prototype.splice), _s = ci.call(Function.call, String.prototype.replace), un = ci.call(Function.call, String.prototype.slice), Sc = ci.call(Function.call, RegExp.prototype.exec), Pc = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, Ac = /\\(\\)?/g, Rc = function(t) {
  var e = un(t, 0, 1), i = un(t, -1);
  if (e === "%" && i !== "%")
    throw new Ir("invalid intrinsic syntax, expected closing `%`");
  if (i === "%" && e !== "%")
    throw new Ir("invalid intrinsic syntax, expected opening `%`");
  var n = [];
  return _s(t, Pc, function(a, o, s, u) {
    n[n.length] = s ? _s(u, Ac, "$1") : o || a;
  }), n;
}, Oc = function(t, e) {
  var i = t, n;
  if (sn(vs, i) && (n = vs[i], i = "%" + n[0] + "%"), sn(rr, i)) {
    var a = rr[i];
    if (a === br && (a = Tc(i)), typeof a > "u" && !e)
      throw new Pr("intrinsic " + t + " exists, but is not available. Please file an issue!");
    return {
      alias: n,
      name: i,
      value: a
    };
  }
  throw new Ir("intrinsic " + t + " does not exist!");
}, hr = function(t, e) {
  if (typeof t != "string" || t.length === 0)
    throw new Pr("intrinsic name must be a non-empty string");
  if (arguments.length > 1 && typeof e != "boolean")
    throw new Pr('"allowMissing" argument must be a boolean');
  if (Sc(/^%?[^%]*%?$/, t) === null)
    throw new Ir("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  var i = Rc(t), n = i.length > 0 ? i[0] : "", a = Oc("%" + n + "%", e), o = a.name, s = a.value, u = !1, h = a.alias;
  h && (n = h[0], wc(i, xc([0, 1], h)));
  for (var l = 1, f = !0; l < i.length; l += 1) {
    var c = i[l], d = un(c, 0, 1), p = un(c, -1);
    if ((d === '"' || d === "'" || d === "`" || p === '"' || p === "'" || p === "`") && d !== p)
      throw new Ir("property names with quotes must have matching quotes");
    if ((c === "constructor" || !f) && (u = !0), n += "." + c, o = "%" + n + "%", sn(rr, o))
      s = rr[o];
    else if (s != null) {
      if (!(c in s)) {
        if (!e)
          throw new Pr("base intrinsic for " + t + " exists, but the property is not available.");
        return;
      }
      if (er && l + 1 >= i.length) {
        var _ = er(s, c);
        f = !!_, f && "get" in _ && !("originalValue" in _.get) ? s = _.get : s = s[c];
      } else
        f = sn(s, c), s = s[c];
      f && !u && (rr[o] = s);
    }
  }
  return s;
}, _h = { exports: {} }, Ic = hr, Oa = Ic("%Object.defineProperty%", !0), Ia = function() {
  if (Oa)
    try {
      return Oa({}, "a", { value: 1 }), !0;
    } catch {
      return !1;
    }
  return !1;
};
Ia.hasArrayLengthDefineBug = function() {
  if (!Ia())
    return null;
  try {
    return Oa([], "length", { value: 1 }).length !== 1;
  } catch {
    return !0;
  }
};
var yh = Ia, Cc = hr, Ki = Cc("%Object.getOwnPropertyDescriptor%", !0);
if (Ki)
  try {
    Ki([], "length");
  } catch {
    Ki = null;
  }
var gh = Ki, Mc = yh(), Oo = hr, Zr = Mc && Oo("%Object.defineProperty%", !0);
if (Zr)
  try {
    Zr({}, "a", { value: 1 });
  } catch {
    Zr = !1;
  }
var Dc = Oo("%SyntaxError%"), vr = Oo("%TypeError%"), ys = gh, Fc = function(t, e, i) {
  if (!t || typeof t != "object" && typeof t != "function")
    throw new vr("`obj` must be an object or a function`");
  if (typeof e != "string" && typeof e != "symbol")
    throw new vr("`property` must be a string or a symbol`");
  if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null)
    throw new vr("`nonEnumerable`, if provided, must be a boolean or null");
  if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null)
    throw new vr("`nonWritable`, if provided, must be a boolean or null");
  if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null)
    throw new vr("`nonConfigurable`, if provided, must be a boolean or null");
  if (arguments.length > 6 && typeof arguments[6] != "boolean")
    throw new vr("`loose`, if provided, must be a boolean");
  var n = arguments.length > 3 ? arguments[3] : null, a = arguments.length > 4 ? arguments[4] : null, o = arguments.length > 5 ? arguments[5] : null, s = arguments.length > 6 ? arguments[6] : !1, u = !!ys && ys(t, e);
  if (Zr)
    Zr(t, e, {
      configurable: o === null && u ? u.configurable : !o,
      enumerable: n === null && u ? u.enumerable : !n,
      value: i,
      writable: a === null && u ? u.writable : !a
    });
  else if (s || !n && !a && !o)
    t[e] = i;
  else
    throw new Dc("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
}, mh = hr, gs = Fc, Nc = yh(), ms = gh, bs = mh("%TypeError%"), Bc = mh("%Math.floor%"), Lc = function(t, e) {
  if (typeof t != "function")
    throw new bs("`fn` is not a function");
  if (typeof e != "number" || e < 0 || e > 4294967295 || Bc(e) !== e)
    throw new bs("`length` must be a positive 32-bit integer");
  var i = arguments.length > 2 && !!arguments[2], n = !0, a = !0;
  if ("length" in t && ms) {
    var o = ms(t, "length");
    o && !o.configurable && (n = !1), o && !o.writable && (a = !1);
  }
  return (n || a || !i) && (Nc ? gs(t, "length", e, !0, !0) : gs(t, "length", e)), t;
};
(function(r) {
  var t = Ro, e = hr, i = Lc, n = e("%TypeError%"), a = e("%Function.prototype.apply%"), o = e("%Function.prototype.call%"), s = e("%Reflect.apply%", !0) || t.call(o, a), u = e("%Object.defineProperty%", !0), h = e("%Math.max%");
  if (u)
    try {
      u({}, "a", { value: 1 });
    } catch {
      u = null;
    }
  r.exports = function(c) {
    if (typeof c != "function")
      throw new n("a function is required");
    var d = s(t, o, arguments);
    return i(
      d,
      1 + h(0, c.length - (arguments.length - 1)),
      !0
    );
  };
  var l = function() {
    return s(t, a, arguments);
  };
  u ? u(r.exports, "apply", { value: l }) : r.exports.apply = l;
})(_h);
var Uc = _h.exports, bh = hr, Eh = Uc, Gc = Eh(bh("String.prototype.indexOf")), kc = function(t, e) {
  var i = bh(t, !!e);
  return typeof i == "function" && Gc(t, ".prototype.") > -1 ? Eh(i) : i;
};
const Hc = {}, Xc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Hc
}, Symbol.toStringTag, { value: "Module" })), jc = /* @__PURE__ */ xf(Xc);
var Io = typeof Map == "function" && Map.prototype, Gn = Object.getOwnPropertyDescriptor && Io ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null, hn = Io && Gn && typeof Gn.get == "function" ? Gn.get : null, Es = Io && Map.prototype.forEach, Co = typeof Set == "function" && Set.prototype, kn = Object.getOwnPropertyDescriptor && Co ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null, ln = Co && kn && typeof kn.get == "function" ? kn.get : null, Ts = Co && Set.prototype.forEach, Vc = typeof WeakMap == "function" && WeakMap.prototype, Kr = Vc ? WeakMap.prototype.has : null, zc = typeof WeakSet == "function" && WeakSet.prototype, $r = zc ? WeakSet.prototype.has : null, Wc = typeof WeakRef == "function" && WeakRef.prototype, xs = Wc ? WeakRef.prototype.deref : null, Yc = Boolean.prototype.valueOf, qc = Object.prototype.toString, Zc = Function.prototype.toString, Kc = String.prototype.match, Mo = String.prototype.slice, Me = String.prototype.replace, $c = String.prototype.toUpperCase, ws = String.prototype.toLowerCase, Th = RegExp.prototype.test, Ss = Array.prototype.concat, le = Array.prototype.join, Qc = Array.prototype.slice, Ps = Math.floor, Ca = typeof BigInt == "function" ? BigInt.prototype.valueOf : null, Hn = Object.getOwnPropertySymbols, Ma = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Symbol.prototype.toString : null, Cr = typeof Symbol == "function" && typeof Symbol.iterator == "object", kt = typeof Symbol == "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === Cr || "symbol") ? Symbol.toStringTag : null, xh = Object.prototype.propertyIsEnumerable, As = (typeof Reflect == "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(r) {
  return r.__proto__;
} : null);
function Rs(r, t) {
  if (r === 1 / 0 || r === -1 / 0 || r !== r || r && r > -1e3 && r < 1e3 || Th.call(/e/, t))
    return t;
  var e = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof r == "number") {
    var i = r < 0 ? -Ps(-r) : Ps(r);
    if (i !== r) {
      var n = String(i), a = Mo.call(t, n.length + 1);
      return Me.call(n, e, "$&_") + "." + Me.call(Me.call(a, /([0-9]{3})/g, "$&_"), /_$/, "");
    }
  }
  return Me.call(t, e, "$&_");
}
var Da = jc, Os = Da.custom, Is = Sh(Os) ? Os : null, Jc = function r(t, e, i, n) {
  var a = e || {};
  if (Oe(a, "quoteStyle") && a.quoteStyle !== "single" && a.quoteStyle !== "double")
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  if (Oe(a, "maxStringLength") && (typeof a.maxStringLength == "number" ? a.maxStringLength < 0 && a.maxStringLength !== 1 / 0 : a.maxStringLength !== null))
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  var o = Oe(a, "customInspect") ? a.customInspect : !0;
  if (typeof o != "boolean" && o !== "symbol")
    throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
  if (Oe(a, "indent") && a.indent !== null && a.indent !== "	" && !(parseInt(a.indent, 10) === a.indent && a.indent > 0))
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  if (Oe(a, "numericSeparator") && typeof a.numericSeparator != "boolean")
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  var s = a.numericSeparator;
  if (typeof t > "u")
    return "undefined";
  if (t === null)
    return "null";
  if (typeof t == "boolean")
    return t ? "true" : "false";
  if (typeof t == "string")
    return Ah(t, a);
  if (typeof t == "number") {
    if (t === 0)
      return 1 / 0 / t > 0 ? "0" : "-0";
    var u = String(t);
    return s ? Rs(t, u) : u;
  }
  if (typeof t == "bigint") {
    var h = String(t) + "n";
    return s ? Rs(t, h) : h;
  }
  var l = typeof a.depth > "u" ? 5 : a.depth;
  if (typeof i > "u" && (i = 0), i >= l && l > 0 && typeof t == "object")
    return Fa(t) ? "[Array]" : "[Object]";
  var f = yd(a, i);
  if (typeof n > "u")
    n = [];
  else if (Ph(n, t) >= 0)
    return "[Circular]";
  function c(D, I, R) {
    if (I && (n = Qc.call(n), n.push(I)), R) {
      var N = {
        depth: a.depth
      };
      return Oe(a, "quoteStyle") && (N.quoteStyle = a.quoteStyle), r(D, N, i + 1, n);
    }
    return r(D, a, i + 1, n);
  }
  if (typeof t == "function" && !Cs(t)) {
    var d = ud(t), p = Ti(t, c);
    return "[Function" + (d ? ": " + d : " (anonymous)") + "]" + (p.length > 0 ? " { " + le.call(p, ", ") + " }" : "");
  }
  if (Sh(t)) {
    var _ = Cr ? Me.call(String(t), /^(Symbol\(.*\))_[^)]*$/, "$1") : Ma.call(t);
    return typeof t == "object" && !Cr ? Lr(_) : _;
  }
  if (pd(t)) {
    for (var v = "<" + ws.call(String(t.nodeName)), y = t.attributes || [], g = 0; g < y.length; g++)
      v += " " + y[g].name + "=" + wh(td(y[g].value), "double", a);
    return v += ">", t.childNodes && t.childNodes.length && (v += "..."), v += "</" + ws.call(String(t.nodeName)) + ">", v;
  }
  if (Fa(t)) {
    if (t.length === 0)
      return "[]";
    var m = Ti(t, c);
    return f && !_d(m) ? "[" + Na(m, f) + "]" : "[ " + le.call(m, ", ") + " ]";
  }
  if (rd(t)) {
    var E = Ti(t, c);
    return !("cause" in Error.prototype) && "cause" in t && !xh.call(t, "cause") ? "{ [" + String(t) + "] " + le.call(Ss.call("[cause]: " + c(t.cause), E), ", ") + " }" : E.length === 0 ? "[" + String(t) + "]" : "{ [" + String(t) + "] " + le.call(E, ", ") + " }";
  }
  if (typeof t == "object" && o) {
    if (Is && typeof t[Is] == "function" && Da)
      return Da(t, { depth: l - i });
    if (o !== "symbol" && typeof t.inspect == "function")
      return t.inspect();
  }
  if (hd(t)) {
    var b = [];
    return Es && Es.call(t, function(D, I) {
      b.push(c(I, t, !0) + " => " + c(D, t));
    }), Ms("Map", hn.call(t), b, f);
  }
  if (cd(t)) {
    var x = [];
    return Ts && Ts.call(t, function(D) {
      x.push(c(D, t));
    }), Ms("Set", ln.call(t), x, f);
  }
  if (ld(t))
    return Xn("WeakMap");
  if (dd(t))
    return Xn("WeakSet");
  if (fd(t))
    return Xn("WeakRef");
  if (nd(t))
    return Lr(c(Number(t)));
  if (od(t))
    return Lr(c(Ca.call(t)));
  if (ad(t))
    return Lr(Yc.call(t));
  if (id(t))
    return Lr(c(String(t)));
  if (typeof window < "u" && t === window)
    return "{ [object Window] }";
  if (t === Zi)
    return "{ [object globalThis] }";
  if (!ed(t) && !Cs(t)) {
    var S = Ti(t, c), A = As ? As(t) === Object.prototype : t instanceof Object || t.constructor === Object, w = t instanceof Object ? "" : "null prototype", P = !A && kt && Object(t) === t && kt in t ? Mo.call(Ge(t), 8, -1) : w ? "Object" : "", O = A || typeof t.constructor != "function" ? "" : t.constructor.name ? t.constructor.name + " " : "", F = O + (P || w ? "[" + le.call(Ss.call([], P || [], w || []), ": ") + "] " : "");
    return S.length === 0 ? F + "{}" : f ? F + "{" + Na(S, f) + "}" : F + "{ " + le.call(S, ", ") + " }";
  }
  return String(t);
};
function wh(r, t, e) {
  var i = (e.quoteStyle || t) === "double" ? '"' : "'";
  return i + r + i;
}
function td(r) {
  return Me.call(String(r), /"/g, "&quot;");
}
function Fa(r) {
  return Ge(r) === "[object Array]" && (!kt || !(typeof r == "object" && kt in r));
}
function ed(r) {
  return Ge(r) === "[object Date]" && (!kt || !(typeof r == "object" && kt in r));
}
function Cs(r) {
  return Ge(r) === "[object RegExp]" && (!kt || !(typeof r == "object" && kt in r));
}
function rd(r) {
  return Ge(r) === "[object Error]" && (!kt || !(typeof r == "object" && kt in r));
}
function id(r) {
  return Ge(r) === "[object String]" && (!kt || !(typeof r == "object" && kt in r));
}
function nd(r) {
  return Ge(r) === "[object Number]" && (!kt || !(typeof r == "object" && kt in r));
}
function ad(r) {
  return Ge(r) === "[object Boolean]" && (!kt || !(typeof r == "object" && kt in r));
}
function Sh(r) {
  if (Cr)
    return r && typeof r == "object" && r instanceof Symbol;
  if (typeof r == "symbol")
    return !0;
  if (!r || typeof r != "object" || !Ma)
    return !1;
  try {
    return Ma.call(r), !0;
  } catch {
  }
  return !1;
}
function od(r) {
  if (!r || typeof r != "object" || !Ca)
    return !1;
  try {
    return Ca.call(r), !0;
  } catch {
  }
  return !1;
}
var sd = Object.prototype.hasOwnProperty || function(r) {
  return r in this;
};
function Oe(r, t) {
  return sd.call(r, t);
}
function Ge(r) {
  return qc.call(r);
}
function ud(r) {
  if (r.name)
    return r.name;
  var t = Kc.call(Zc.call(r), /^function\s*([\w$]+)/);
  return t ? t[1] : null;
}
function Ph(r, t) {
  if (r.indexOf)
    return r.indexOf(t);
  for (var e = 0, i = r.length; e < i; e++)
    if (r[e] === t)
      return e;
  return -1;
}
function hd(r) {
  if (!hn || !r || typeof r != "object")
    return !1;
  try {
    hn.call(r);
    try {
      ln.call(r);
    } catch {
      return !0;
    }
    return r instanceof Map;
  } catch {
  }
  return !1;
}
function ld(r) {
  if (!Kr || !r || typeof r != "object")
    return !1;
  try {
    Kr.call(r, Kr);
    try {
      $r.call(r, $r);
    } catch {
      return !0;
    }
    return r instanceof WeakMap;
  } catch {
  }
  return !1;
}
function fd(r) {
  if (!xs || !r || typeof r != "object")
    return !1;
  try {
    return xs.call(r), !0;
  } catch {
  }
  return !1;
}
function cd(r) {
  if (!ln || !r || typeof r != "object")
    return !1;
  try {
    ln.call(r);
    try {
      hn.call(r);
    } catch {
      return !0;
    }
    return r instanceof Set;
  } catch {
  }
  return !1;
}
function dd(r) {
  if (!$r || !r || typeof r != "object")
    return !1;
  try {
    $r.call(r, $r);
    try {
      Kr.call(r, Kr);
    } catch {
      return !0;
    }
    return r instanceof WeakSet;
  } catch {
  }
  return !1;
}
function pd(r) {
  return !r || typeof r != "object" ? !1 : typeof HTMLElement < "u" && r instanceof HTMLElement ? !0 : typeof r.nodeName == "string" && typeof r.getAttribute == "function";
}
function Ah(r, t) {
  if (r.length > t.maxStringLength) {
    var e = r.length - t.maxStringLength, i = "... " + e + " more character" + (e > 1 ? "s" : "");
    return Ah(Mo.call(r, 0, t.maxStringLength), t) + i;
  }
  var n = Me.call(Me.call(r, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, vd);
  return wh(n, "single", t);
}
function vd(r) {
  var t = r.charCodeAt(0), e = {
    8: "b",
    9: "t",
    10: "n",
    12: "f",
    13: "r"
  }[t];
  return e ? "\\" + e : "\\x" + (t < 16 ? "0" : "") + $c.call(t.toString(16));
}
function Lr(r) {
  return "Object(" + r + ")";
}
function Xn(r) {
  return r + " { ? }";
}
function Ms(r, t, e, i) {
  var n = i ? Na(e, i) : le.call(e, ", ");
  return r + " (" + t + ") {" + n + "}";
}
function _d(r) {
  for (var t = 0; t < r.length; t++)
    if (Ph(r[t], `
`) >= 0)
      return !1;
  return !0;
}
function yd(r, t) {
  var e;
  if (r.indent === "	")
    e = "	";
  else if (typeof r.indent == "number" && r.indent > 0)
    e = le.call(Array(r.indent + 1), " ");
  else
    return null;
  return {
    base: e,
    prev: le.call(Array(t + 1), e)
  };
}
function Na(r, t) {
  if (r.length === 0)
    return "";
  var e = `
` + t.prev + t.base;
  return e + le.call(r, "," + e) + `
` + t.prev;
}
function Ti(r, t) {
  var e = Fa(r), i = [];
  if (e) {
    i.length = r.length;
    for (var n = 0; n < r.length; n++)
      i[n] = Oe(r, n) ? t(r[n], r) : "";
  }
  var a = typeof Hn == "function" ? Hn(r) : [], o;
  if (Cr) {
    o = {};
    for (var s = 0; s < a.length; s++)
      o["$" + a[s]] = a[s];
  }
  for (var u in r)
    Oe(r, u) && (e && String(Number(u)) === u && u < r.length || Cr && o["$" + u] instanceof Symbol || (Th.call(/[^\w$]/, u) ? i.push(t(u, r) + ": " + t(r[u], r)) : i.push(u + ": " + t(r[u], r))));
  if (typeof Hn == "function")
    for (var h = 0; h < a.length; h++)
      xh.call(r, a[h]) && i.push("[" + t(a[h]) + "]: " + t(r[a[h]], r));
  return i;
}
var Do = hr, Nr = kc, gd = Jc, md = Do("%TypeError%"), xi = Do("%WeakMap%", !0), wi = Do("%Map%", !0), bd = Nr("WeakMap.prototype.get", !0), Ed = Nr("WeakMap.prototype.set", !0), Td = Nr("WeakMap.prototype.has", !0), xd = Nr("Map.prototype.get", !0), wd = Nr("Map.prototype.set", !0), Sd = Nr("Map.prototype.has", !0), Fo = function(r, t) {
  for (var e = r, i; (i = e.next) !== null; e = i)
    if (i.key === t)
      return e.next = i.next, i.next = r.next, r.next = i, i;
}, Pd = function(r, t) {
  var e = Fo(r, t);
  return e && e.value;
}, Ad = function(r, t, e) {
  var i = Fo(r, t);
  i ? i.value = e : r.next = {
    // eslint-disable-line no-param-reassign
    key: t,
    next: r.next,
    value: e
  };
}, Rd = function(r, t) {
  return !!Fo(r, t);
}, Od = function() {
  var t, e, i, n = {
    assert: function(a) {
      if (!n.has(a))
        throw new md("Side channel does not contain " + gd(a));
    },
    get: function(a) {
      if (xi && a && (typeof a == "object" || typeof a == "function")) {
        if (t)
          return bd(t, a);
      } else if (wi) {
        if (e)
          return xd(e, a);
      } else if (i)
        return Pd(i, a);
    },
    has: function(a) {
      if (xi && a && (typeof a == "object" || typeof a == "function")) {
        if (t)
          return Td(t, a);
      } else if (wi) {
        if (e)
          return Sd(e, a);
      } else if (i)
        return Rd(i, a);
      return !1;
    },
    set: function(a, o) {
      xi && a && (typeof a == "object" || typeof a == "function") ? (t || (t = new xi()), Ed(t, a, o)) : wi ? (e || (e = new wi()), wd(e, a, o)) : (i || (i = { key: {}, next: null }), Ad(i, a, o));
    }
  };
  return n;
}, Id = String.prototype.replace, Cd = /%20/g, jn = {
  RFC1738: "RFC1738",
  RFC3986: "RFC3986"
}, No = {
  default: jn.RFC3986,
  formatters: {
    RFC1738: function(r) {
      return Id.call(r, Cd, "+");
    },
    RFC3986: function(r) {
      return String(r);
    }
  },
  RFC1738: jn.RFC1738,
  RFC3986: jn.RFC3986
}, Md = No, Vn = Object.prototype.hasOwnProperty, Ke = Array.isArray, he = function() {
  for (var r = [], t = 0; t < 256; ++t)
    r.push("%" + ((t < 16 ? "0" : "") + t.toString(16)).toUpperCase());
  return r;
}(), Dd = function(t) {
  for (; t.length > 1; ) {
    var e = t.pop(), i = e.obj[e.prop];
    if (Ke(i)) {
      for (var n = [], a = 0; a < i.length; ++a)
        typeof i[a] < "u" && n.push(i[a]);
      e.obj[e.prop] = n;
    }
  }
}, Rh = function(t, e) {
  for (var i = e && e.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, n = 0; n < t.length; ++n)
    typeof t[n] < "u" && (i[n] = t[n]);
  return i;
}, Fd = function r(t, e, i) {
  if (!e)
    return t;
  if (typeof e != "object") {
    if (Ke(t))
      t.push(e);
    else if (t && typeof t == "object")
      (i && (i.plainObjects || i.allowPrototypes) || !Vn.call(Object.prototype, e)) && (t[e] = !0);
    else
      return [t, e];
    return t;
  }
  if (!t || typeof t != "object")
    return [t].concat(e);
  var n = t;
  return Ke(t) && !Ke(e) && (n = Rh(t, i)), Ke(t) && Ke(e) ? (e.forEach(function(a, o) {
    if (Vn.call(t, o)) {
      var s = t[o];
      s && typeof s == "object" && a && typeof a == "object" ? t[o] = r(s, a, i) : t.push(a);
    } else
      t[o] = a;
  }), t) : Object.keys(e).reduce(function(a, o) {
    var s = e[o];
    return Vn.call(a, o) ? a[o] = r(a[o], s, i) : a[o] = s, a;
  }, n);
}, Nd = function(t, e) {
  return Object.keys(e).reduce(function(i, n) {
    return i[n] = e[n], i;
  }, t);
}, Bd = function(r, t, e) {
  var i = r.replace(/\+/g, " ");
  if (e === "iso-8859-1")
    return i.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(i);
  } catch {
    return i;
  }
}, Ld = function(t, e, i, n, a) {
  if (t.length === 0)
    return t;
  var o = t;
  if (typeof t == "symbol" ? o = Symbol.prototype.toString.call(t) : typeof t != "string" && (o = String(t)), i === "iso-8859-1")
    return escape(o).replace(/%u[0-9a-f]{4}/gi, function(l) {
      return "%26%23" + parseInt(l.slice(2), 16) + "%3B";
    });
  for (var s = "", u = 0; u < o.length; ++u) {
    var h = o.charCodeAt(u);
    if (h === 45 || h === 46 || h === 95 || h === 126 || h >= 48 && h <= 57 || h >= 65 && h <= 90 || h >= 97 && h <= 122 || a === Md.RFC1738 && (h === 40 || h === 41)) {
      s += o.charAt(u);
      continue;
    }
    if (h < 128) {
      s = s + he[h];
      continue;
    }
    if (h < 2048) {
      s = s + (he[192 | h >> 6] + he[128 | h & 63]);
      continue;
    }
    if (h < 55296 || h >= 57344) {
      s = s + (he[224 | h >> 12] + he[128 | h >> 6 & 63] + he[128 | h & 63]);
      continue;
    }
    u += 1, h = 65536 + ((h & 1023) << 10 | o.charCodeAt(u) & 1023), s += he[240 | h >> 18] + he[128 | h >> 12 & 63] + he[128 | h >> 6 & 63] + he[128 | h & 63];
  }
  return s;
}, Ud = function(t) {
  for (var e = [{ obj: { o: t }, prop: "o" }], i = [], n = 0; n < e.length; ++n)
    for (var a = e[n], o = a.obj[a.prop], s = Object.keys(o), u = 0; u < s.length; ++u) {
      var h = s[u], l = o[h];
      typeof l == "object" && l !== null && i.indexOf(l) === -1 && (e.push({ obj: o, prop: h }), i.push(l));
    }
  return Dd(e), t;
}, Gd = function(t) {
  return Object.prototype.toString.call(t) === "[object RegExp]";
}, kd = function(t) {
  return !t || typeof t != "object" ? !1 : !!(t.constructor && t.constructor.isBuffer && t.constructor.isBuffer(t));
}, Hd = function(t, e) {
  return [].concat(t, e);
}, Xd = function(t, e) {
  if (Ke(t)) {
    for (var i = [], n = 0; n < t.length; n += 1)
      i.push(e(t[n]));
    return i;
  }
  return e(t);
}, Oh = {
  arrayToObject: Rh,
  assign: Nd,
  combine: Hd,
  compact: Ud,
  decode: Bd,
  encode: Ld,
  isBuffer: kd,
  isRegExp: Gd,
  maybeMap: Xd,
  merge: Fd
}, Ih = Od, $i = Oh, Qr = No, jd = Object.prototype.hasOwnProperty, Ds = {
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
}, be = Array.isArray, Vd = Array.prototype.push, Ch = function(r, t) {
  Vd.apply(r, be(t) ? t : [t]);
}, zd = Date.prototype.toISOString, Fs = Qr.default, Ut = {
  addQueryPrefix: !1,
  allowDots: !1,
  charset: "utf-8",
  charsetSentinel: !1,
  delimiter: "&",
  encode: !0,
  encoder: $i.encode,
  encodeValuesOnly: !1,
  format: Fs,
  formatter: Qr.formatters[Fs],
  // deprecated
  indices: !1,
  serializeDate: function(t) {
    return zd.call(t);
  },
  skipNulls: !1,
  strictNullHandling: !1
}, Wd = function(t) {
  return typeof t == "string" || typeof t == "number" || typeof t == "boolean" || typeof t == "symbol" || typeof t == "bigint";
}, zn = {}, Yd = function r(t, e, i, n, a, o, s, u, h, l, f, c, d, p, _, v) {
  for (var y = t, g = v, m = 0, E = !1; (g = g.get(zn)) !== void 0 && !E; ) {
    var b = g.get(t);
    if (m += 1, typeof b < "u") {
      if (b === m)
        throw new RangeError("Cyclic object value");
      E = !0;
    }
    typeof g.get(zn) > "u" && (m = 0);
  }
  if (typeof u == "function" ? y = u(e, y) : y instanceof Date ? y = f(y) : i === "comma" && be(y) && (y = $i.maybeMap(y, function(N) {
    return N instanceof Date ? f(N) : N;
  })), y === null) {
    if (a)
      return s && !p ? s(e, Ut.encoder, _, "key", c) : e;
    y = "";
  }
  if (Wd(y) || $i.isBuffer(y)) {
    if (s) {
      var x = p ? e : s(e, Ut.encoder, _, "key", c);
      return [d(x) + "=" + d(s(y, Ut.encoder, _, "value", c))];
    }
    return [d(e) + "=" + d(String(y))];
  }
  var S = [];
  if (typeof y > "u")
    return S;
  var A;
  if (i === "comma" && be(y))
    p && s && (y = $i.maybeMap(y, s)), A = [{ value: y.length > 0 ? y.join(",") || null : void 0 }];
  else if (be(u))
    A = u;
  else {
    var w = Object.keys(y);
    A = h ? w.sort(h) : w;
  }
  for (var P = n && be(y) && y.length === 1 ? e + "[]" : e, O = 0; O < A.length; ++O) {
    var F = A[O], D = typeof F == "object" && typeof F.value < "u" ? F.value : y[F];
    if (!(o && D === null)) {
      var I = be(y) ? typeof i == "function" ? i(P, F) : P : P + (l ? "." + F : "[" + F + "]");
      v.set(t, m);
      var R = Ih();
      R.set(zn, v), Ch(S, r(
        D,
        I,
        i,
        n,
        a,
        o,
        i === "comma" && p && be(y) ? null : s,
        u,
        h,
        l,
        f,
        c,
        d,
        p,
        _,
        R
      ));
    }
  }
  return S;
}, qd = function(t) {
  if (!t)
    return Ut;
  if (t.encoder !== null && typeof t.encoder < "u" && typeof t.encoder != "function")
    throw new TypeError("Encoder has to be a function.");
  var e = t.charset || Ut.charset;
  if (typeof t.charset < "u" && t.charset !== "utf-8" && t.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var i = Qr.default;
  if (typeof t.format < "u") {
    if (!jd.call(Qr.formatters, t.format))
      throw new TypeError("Unknown format option provided.");
    i = t.format;
  }
  var n = Qr.formatters[i], a = Ut.filter;
  return (typeof t.filter == "function" || be(t.filter)) && (a = t.filter), {
    addQueryPrefix: typeof t.addQueryPrefix == "boolean" ? t.addQueryPrefix : Ut.addQueryPrefix,
    allowDots: typeof t.allowDots > "u" ? Ut.allowDots : !!t.allowDots,
    charset: e,
    charsetSentinel: typeof t.charsetSentinel == "boolean" ? t.charsetSentinel : Ut.charsetSentinel,
    delimiter: typeof t.delimiter > "u" ? Ut.delimiter : t.delimiter,
    encode: typeof t.encode == "boolean" ? t.encode : Ut.encode,
    encoder: typeof t.encoder == "function" ? t.encoder : Ut.encoder,
    encodeValuesOnly: typeof t.encodeValuesOnly == "boolean" ? t.encodeValuesOnly : Ut.encodeValuesOnly,
    filter: a,
    format: i,
    formatter: n,
    serializeDate: typeof t.serializeDate == "function" ? t.serializeDate : Ut.serializeDate,
    skipNulls: typeof t.skipNulls == "boolean" ? t.skipNulls : Ut.skipNulls,
    sort: typeof t.sort == "function" ? t.sort : null,
    strictNullHandling: typeof t.strictNullHandling == "boolean" ? t.strictNullHandling : Ut.strictNullHandling
  };
}, Zd = function(r, t) {
  var e = r, i = qd(t), n, a;
  typeof i.filter == "function" ? (a = i.filter, e = a("", e)) : be(i.filter) && (a = i.filter, n = a);
  var o = [];
  if (typeof e != "object" || e === null)
    return "";
  var s;
  t && t.arrayFormat in Ds ? s = t.arrayFormat : t && "indices" in t ? s = t.indices ? "indices" : "repeat" : s = "indices";
  var u = Ds[s];
  if (t && "commaRoundTrip" in t && typeof t.commaRoundTrip != "boolean")
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  var h = u === "comma" && t && t.commaRoundTrip;
  n || (n = Object.keys(e)), i.sort && n.sort(i.sort);
  for (var l = Ih(), f = 0; f < n.length; ++f) {
    var c = n[f];
    i.skipNulls && e[c] === null || Ch(o, Yd(
      e[c],
      c,
      u,
      h,
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
      l
    ));
  }
  var d = o.join(i.delimiter), p = i.addQueryPrefix === !0 ? "?" : "";
  return i.charsetSentinel && (i.charset === "iso-8859-1" ? p += "utf8=%26%2310003%3B&" : p += "utf8=%E2%9C%93&"), d.length > 0 ? p + d : "";
}, Mr = Oh, Ba = Object.prototype.hasOwnProperty, Kd = Array.isArray, Ct = {
  allowDots: !1,
  allowPrototypes: !1,
  allowSparse: !1,
  arrayLimit: 20,
  charset: "utf-8",
  charsetSentinel: !1,
  comma: !1,
  decoder: Mr.decode,
  delimiter: "&",
  depth: 5,
  ignoreQueryPrefix: !1,
  interpretNumericEntities: !1,
  parameterLimit: 1e3,
  parseArrays: !0,
  plainObjects: !1,
  strictNullHandling: !1
}, $d = function(r) {
  return r.replace(/&#(\d+);/g, function(t, e) {
    return String.fromCharCode(parseInt(e, 10));
  });
}, Mh = function(r, t) {
  return r && typeof r == "string" && t.comma && r.indexOf(",") > -1 ? r.split(",") : r;
}, Qd = "utf8=%26%2310003%3B", Jd = "utf8=%E2%9C%93", tp = function(t, e) {
  var i = { __proto__: null }, n = e.ignoreQueryPrefix ? t.replace(/^\?/, "") : t, a = e.parameterLimit === 1 / 0 ? void 0 : e.parameterLimit, o = n.split(e.delimiter, a), s = -1, u, h = e.charset;
  if (e.charsetSentinel)
    for (u = 0; u < o.length; ++u)
      o[u].indexOf("utf8=") === 0 && (o[u] === Jd ? h = "utf-8" : o[u] === Qd && (h = "iso-8859-1"), s = u, u = o.length);
  for (u = 0; u < o.length; ++u)
    if (u !== s) {
      var l = o[u], f = l.indexOf("]="), c = f === -1 ? l.indexOf("=") : f + 1, d, p;
      c === -1 ? (d = e.decoder(l, Ct.decoder, h, "key"), p = e.strictNullHandling ? null : "") : (d = e.decoder(l.slice(0, c), Ct.decoder, h, "key"), p = Mr.maybeMap(
        Mh(l.slice(c + 1), e),
        function(_) {
          return e.decoder(_, Ct.decoder, h, "value");
        }
      )), p && e.interpretNumericEntities && h === "iso-8859-1" && (p = $d(p)), l.indexOf("[]=") > -1 && (p = Kd(p) ? [p] : p), Ba.call(i, d) ? i[d] = Mr.combine(i[d], p) : i[d] = p;
    }
  return i;
}, ep = function(r, t, e, i) {
  for (var n = i ? t : Mh(t, e), a = r.length - 1; a >= 0; --a) {
    var o, s = r[a];
    if (s === "[]" && e.parseArrays)
      o = [].concat(n);
    else {
      o = e.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
      var u = s.charAt(0) === "[" && s.charAt(s.length - 1) === "]" ? s.slice(1, -1) : s, h = parseInt(u, 10);
      !e.parseArrays && u === "" ? o = { 0: n } : !isNaN(h) && s !== u && String(h) === u && h >= 0 && e.parseArrays && h <= e.arrayLimit ? (o = [], o[h] = n) : u !== "__proto__" && (o[u] = n);
    }
    n = o;
  }
  return n;
}, rp = function(t, e, i, n) {
  if (t) {
    var a = i.allowDots ? t.replace(/\.([^.[]+)/g, "[$1]") : t, o = /(\[[^[\]]*])/, s = /(\[[^[\]]*])/g, u = i.depth > 0 && o.exec(a), h = u ? a.slice(0, u.index) : a, l = [];
    if (h) {
      if (!i.plainObjects && Ba.call(Object.prototype, h) && !i.allowPrototypes)
        return;
      l.push(h);
    }
    for (var f = 0; i.depth > 0 && (u = s.exec(a)) !== null && f < i.depth; ) {
      if (f += 1, !i.plainObjects && Ba.call(Object.prototype, u[1].slice(1, -1)) && !i.allowPrototypes)
        return;
      l.push(u[1]);
    }
    return u && l.push("[" + a.slice(u.index) + "]"), ep(l, e, i, n);
  }
}, ip = function(t) {
  if (!t)
    return Ct;
  if (t.decoder !== null && t.decoder !== void 0 && typeof t.decoder != "function")
    throw new TypeError("Decoder has to be a function.");
  if (typeof t.charset < "u" && t.charset !== "utf-8" && t.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var e = typeof t.charset > "u" ? Ct.charset : t.charset;
  return {
    allowDots: typeof t.allowDots > "u" ? Ct.allowDots : !!t.allowDots,
    allowPrototypes: typeof t.allowPrototypes == "boolean" ? t.allowPrototypes : Ct.allowPrototypes,
    allowSparse: typeof t.allowSparse == "boolean" ? t.allowSparse : Ct.allowSparse,
    arrayLimit: typeof t.arrayLimit == "number" ? t.arrayLimit : Ct.arrayLimit,
    charset: e,
    charsetSentinel: typeof t.charsetSentinel == "boolean" ? t.charsetSentinel : Ct.charsetSentinel,
    comma: typeof t.comma == "boolean" ? t.comma : Ct.comma,
    decoder: typeof t.decoder == "function" ? t.decoder : Ct.decoder,
    delimiter: typeof t.delimiter == "string" || Mr.isRegExp(t.delimiter) ? t.delimiter : Ct.delimiter,
    // eslint-disable-next-line no-implicit-coercion, no-extra-parens
    depth: typeof t.depth == "number" || t.depth === !1 ? +t.depth : Ct.depth,
    ignoreQueryPrefix: t.ignoreQueryPrefix === !0,
    interpretNumericEntities: typeof t.interpretNumericEntities == "boolean" ? t.interpretNumericEntities : Ct.interpretNumericEntities,
    parameterLimit: typeof t.parameterLimit == "number" ? t.parameterLimit : Ct.parameterLimit,
    parseArrays: t.parseArrays !== !1,
    plainObjects: typeof t.plainObjects == "boolean" ? t.plainObjects : Ct.plainObjects,
    strictNullHandling: typeof t.strictNullHandling == "boolean" ? t.strictNullHandling : Ct.strictNullHandling
  };
}, np = function(r, t) {
  var e = ip(t);
  if (r === "" || r === null || typeof r > "u")
    return e.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (var i = typeof r == "string" ? tp(r, e) : r, n = e.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, a = Object.keys(i), o = 0; o < a.length; ++o) {
    var s = a[o], u = rp(s, i[s], e, typeof r == "string");
    n = Mr.merge(n, u, e);
  }
  return e.allowSparse === !0 ? n : Mr.compact(n);
}, ap = Zd, op = np, sp = No, up = {
  formats: sp,
  parse: op,
  stringify: ap
}, hp = tc;
function ne() {
  this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null;
}
var lp = /^([a-z0-9.+-]+:)/i, fp = /:[0-9]*$/, cp = /^(\/\/?(?!\/)[^?\s]*)(\?[^\s]*)?$/, dp = [
  "<",
  ">",
  '"',
  "`",
  " ",
  "\r",
  `
`,
  "	"
], pp = [
  "{",
  "}",
  "|",
  "\\",
  "^",
  "`"
].concat(dp), La = ["'"].concat(pp), Ns = [
  "%",
  "/",
  "?",
  ";",
  "#"
].concat(La), Bs = [
  "/",
  "?",
  "#"
], vp = 255, Ls = /^[+a-z0-9A-Z_-]{0,63}$/, _p = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, yp = {
  javascript: !0,
  "javascript:": !0
}, Ua = {
  javascript: !0,
  "javascript:": !0
}, Ar = {
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
}, Ga = up;
function Sn(r, t, e) {
  if (r && typeof r == "object" && r instanceof ne)
    return r;
  var i = new ne();
  return i.parse(r, t, e), i;
}
ne.prototype.parse = function(r, t, e) {
  if (typeof r != "string")
    throw new TypeError("Parameter 'url' must be a string, not " + typeof r);
  var i = r.indexOf("?"), n = i !== -1 && i < r.indexOf("#") ? "?" : "#", a = r.split(n), o = /\\/g;
  a[0] = a[0].replace(o, "/"), r = a.join(n);
  var s = r;
  if (s = s.trim(), !e && r.split("#").length === 1) {
    var u = cp.exec(s);
    if (u)
      return this.path = s, this.href = s, this.pathname = u[1], u[2] ? (this.search = u[2], t ? this.query = Ga.parse(this.search.substr(1)) : this.query = this.search.substr(1)) : t && (this.search = "", this.query = {}), this;
  }
  var h = lp.exec(s);
  if (h) {
    h = h[0];
    var l = h.toLowerCase();
    this.protocol = l, s = s.substr(h.length);
  }
  if (e || h || s.match(/^\/\/[^@/]+@[^@/]+/)) {
    var f = s.substr(0, 2) === "//";
    f && !(h && Ua[h]) && (s = s.substr(2), this.slashes = !0);
  }
  if (!Ua[h] && (f || h && !Ar[h])) {
    for (var c = -1, d = 0; d < Bs.length; d++) {
      var p = s.indexOf(Bs[d]);
      p !== -1 && (c === -1 || p < c) && (c = p);
    }
    var _, v;
    c === -1 ? v = s.lastIndexOf("@") : v = s.lastIndexOf("@", c), v !== -1 && (_ = s.slice(0, v), s = s.slice(v + 1), this.auth = decodeURIComponent(_)), c = -1;
    for (var d = 0; d < Ns.length; d++) {
      var p = s.indexOf(Ns[d]);
      p !== -1 && (c === -1 || p < c) && (c = p);
    }
    c === -1 && (c = s.length), this.host = s.slice(0, c), s = s.slice(c), this.parseHost(), this.hostname = this.hostname || "";
    var y = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!y)
      for (var g = this.hostname.split(/\./), d = 0, m = g.length; d < m; d++) {
        var E = g[d];
        if (E && !E.match(Ls)) {
          for (var b = "", x = 0, S = E.length; x < S; x++)
            E.charCodeAt(x) > 127 ? b += "x" : b += E[x];
          if (!b.match(Ls)) {
            var A = g.slice(0, d), w = g.slice(d + 1), P = E.match(_p);
            P && (A.push(P[1]), w.unshift(P[2])), w.length && (s = "/" + w.join(".") + s), this.hostname = A.join(".");
            break;
          }
        }
      }
    this.hostname.length > vp ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), y || (this.hostname = hp.toASCII(this.hostname));
    var O = this.port ? ":" + this.port : "", F = this.hostname || "";
    this.host = F + O, this.href += this.host, y && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), s[0] !== "/" && (s = "/" + s));
  }
  if (!yp[l])
    for (var d = 0, m = La.length; d < m; d++) {
      var D = La[d];
      if (s.indexOf(D) !== -1) {
        var I = encodeURIComponent(D);
        I === D && (I = escape(D)), s = s.split(D).join(I);
      }
    }
  var R = s.indexOf("#");
  R !== -1 && (this.hash = s.substr(R), s = s.slice(0, R));
  var N = s.indexOf("?");
  if (N !== -1 ? (this.search = s.substr(N), this.query = s.substr(N + 1), t && (this.query = Ga.parse(this.query)), s = s.slice(0, N)) : t && (this.search = "", this.query = {}), s && (this.pathname = s), Ar[l] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
    var O = this.pathname || "", L = this.search || "";
    this.path = O + L;
  }
  return this.href = this.format(), this;
};
function gp(r) {
  return typeof r == "string" && (r = Sn(r)), r instanceof ne ? r.format() : ne.prototype.format.call(r);
}
ne.prototype.format = function() {
  var r = this.auth || "";
  r && (r = encodeURIComponent(r), r = r.replace(/%3A/i, ":"), r += "@");
  var t = this.protocol || "", e = this.pathname || "", i = this.hash || "", n = !1, a = "";
  this.host ? n = r + this.host : this.hostname && (n = r + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]"), this.port && (n += ":" + this.port)), this.query && typeof this.query == "object" && Object.keys(this.query).length && (a = Ga.stringify(this.query, {
    arrayFormat: "repeat",
    addQueryPrefix: !1
  }));
  var o = this.search || a && "?" + a || "";
  return t && t.substr(-1) !== ":" && (t += ":"), this.slashes || (!t || Ar[t]) && n !== !1 ? (n = "//" + (n || ""), e && e.charAt(0) !== "/" && (e = "/" + e)) : n || (n = ""), i && i.charAt(0) !== "#" && (i = "#" + i), o && o.charAt(0) !== "?" && (o = "?" + o), e = e.replace(/[?#]/g, function(s) {
    return encodeURIComponent(s);
  }), o = o.replace("#", "%23"), t + n + e + o + i;
};
function mp(r, t) {
  return Sn(r, !1, !0).resolve(t);
}
ne.prototype.resolve = function(r) {
  return this.resolveObject(Sn(r, !1, !0)).format();
};
ne.prototype.resolveObject = function(r) {
  if (typeof r == "string") {
    var t = new ne();
    t.parse(r, !1, !0), r = t;
  }
  for (var e = new ne(), i = Object.keys(this), n = 0; n < i.length; n++) {
    var a = i[n];
    e[a] = this[a];
  }
  if (e.hash = r.hash, r.href === "")
    return e.href = e.format(), e;
  if (r.slashes && !r.protocol) {
    for (var o = Object.keys(r), s = 0; s < o.length; s++) {
      var u = o[s];
      u !== "protocol" && (e[u] = r[u]);
    }
    return Ar[e.protocol] && e.hostname && !e.pathname && (e.pathname = "/", e.path = e.pathname), e.href = e.format(), e;
  }
  if (r.protocol && r.protocol !== e.protocol) {
    if (!Ar[r.protocol]) {
      for (var h = Object.keys(r), l = 0; l < h.length; l++) {
        var f = h[l];
        e[f] = r[f];
      }
      return e.href = e.format(), e;
    }
    if (e.protocol = r.protocol, !r.host && !Ua[r.protocol]) {
      for (var m = (r.pathname || "").split("/"); m.length && !(r.host = m.shift()); )
        ;
      r.host || (r.host = ""), r.hostname || (r.hostname = ""), m[0] !== "" && m.unshift(""), m.length < 2 && m.unshift(""), e.pathname = m.join("/");
    } else
      e.pathname = r.pathname;
    if (e.search = r.search, e.query = r.query, e.host = r.host || "", e.auth = r.auth, e.hostname = r.hostname || r.host, e.port = r.port, e.pathname || e.search) {
      var c = e.pathname || "", d = e.search || "";
      e.path = c + d;
    }
    return e.slashes = e.slashes || r.slashes, e.href = e.format(), e;
  }
  var p = e.pathname && e.pathname.charAt(0) === "/", _ = r.host || r.pathname && r.pathname.charAt(0) === "/", v = _ || p || e.host && r.pathname, y = v, g = e.pathname && e.pathname.split("/") || [], m = r.pathname && r.pathname.split("/") || [], E = e.protocol && !Ar[e.protocol];
  if (E && (e.hostname = "", e.port = null, e.host && (g[0] === "" ? g[0] = e.host : g.unshift(e.host)), e.host = "", r.protocol && (r.hostname = null, r.port = null, r.host && (m[0] === "" ? m[0] = r.host : m.unshift(r.host)), r.host = null), v = v && (m[0] === "" || g[0] === "")), _)
    e.host = r.host || r.host === "" ? r.host : e.host, e.hostname = r.hostname || r.hostname === "" ? r.hostname : e.hostname, e.search = r.search, e.query = r.query, g = m;
  else if (m.length)
    g || (g = []), g.pop(), g = g.concat(m), e.search = r.search, e.query = r.query;
  else if (r.search != null) {
    if (E) {
      e.host = g.shift(), e.hostname = e.host;
      var b = e.host && e.host.indexOf("@") > 0 ? e.host.split("@") : !1;
      b && (e.auth = b.shift(), e.hostname = b.shift(), e.host = e.hostname);
    }
    return e.search = r.search, e.query = r.query, (e.pathname !== null || e.search !== null) && (e.path = (e.pathname ? e.pathname : "") + (e.search ? e.search : "")), e.href = e.format(), e;
  }
  if (!g.length)
    return e.pathname = null, e.search ? e.path = "/" + e.search : e.path = null, e.href = e.format(), e;
  for (var x = g.slice(-1)[0], S = (e.host || r.host || g.length > 1) && (x === "." || x === "..") || x === "", A = 0, w = g.length; w >= 0; w--)
    x = g[w], x === "." ? g.splice(w, 1) : x === ".." ? (g.splice(w, 1), A++) : A && (g.splice(w, 1), A--);
  if (!v && !y)
    for (; A--; A)
      g.unshift("..");
  v && g[0] !== "" && (!g[0] || g[0].charAt(0) !== "/") && g.unshift(""), S && g.join("/").substr(-1) !== "/" && g.push("");
  var P = g[0] === "" || g[0] && g[0].charAt(0) === "/";
  if (E) {
    e.hostname = P ? "" : g.length ? g.shift() : "", e.host = e.hostname;
    var b = e.host && e.host.indexOf("@") > 0 ? e.host.split("@") : !1;
    b && (e.auth = b.shift(), e.hostname = b.shift(), e.host = e.hostname);
  }
  return v = v || e.host && g.length, v && !P && g.unshift(""), g.length > 0 ? e.pathname = g.join("/") : (e.pathname = null, e.path = null), (e.pathname !== null || e.search !== null) && (e.path = (e.pathname ? e.pathname : "") + (e.search ? e.search : "")), e.auth = r.auth || e.auth, e.slashes = e.slashes || r.slashes, e.href = e.format(), e;
};
ne.prototype.parseHost = function() {
  var r = this.host, t = fp.exec(r);
  t && (t = t[0], t !== ":" && (this.port = t.substr(1)), r = r.substr(0, r.length - t.length)), r && (this.hostname = r);
};
var bp = Sn, Ep = mp, Tp = gp;
/*!
 * @pixi/utils - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/utils is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var Tr = {
  parse: bp,
  format: Tp,
  resolve: Ep
};
k.RETINA_PREFIX = /@([0-9\.]+)x/;
k.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = !1;
var Us = !1, Gs = "6.5.10";
function xp(r) {
  var t;
  if (!Us) {
    if (k.ADAPTER.getNavigator().userAgent.toLowerCase().indexOf("chrome") > -1) {
      var e = [
        `
 %c %c %c PixiJS ` + Gs + " - ✰ " + r + ` ✰  %c  %c  http://www.pixijs.com/  %c %c ♥%c♥%c♥ 

`,
        "background: #ff66a5; padding:5px 0;",
        "background: #ff66a5; padding:5px 0;",
        "color: #ff66a5; background: #030307; padding:5px 0;",
        "background: #ff66a5; padding:5px 0;",
        "background: #ffc3dc; padding:5px 0;",
        "background: #ff66a5; padding:5px 0;",
        "color: #ff2424; background: #fff; padding:5px 0;",
        "color: #ff2424; background: #fff; padding:5px 0;",
        "color: #ff2424; background: #fff; padding:5px 0;"
      ];
      (t = globalThis.console).log.apply(t, e);
    } else
      globalThis.console && globalThis.console.log("PixiJS " + Gs + " - " + r + " - http://www.pixijs.com/");
    Us = !0;
  }
}
var Wn;
function wp() {
  return typeof Wn > "u" && (Wn = function() {
    var t = {
      stencil: !0,
      failIfMajorPerformanceCaveat: k.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
    };
    try {
      if (!k.ADAPTER.getWebGLRenderingContext())
        return !1;
      var e = k.ADAPTER.createCanvas(), i = e.getContext("webgl", t) || e.getContext("experimental-webgl", t), n = !!(i && i.getContextAttributes().stencil);
      if (i) {
        var a = i.getExtension("WEBGL_lose_context");
        a && a.loseContext();
      }
      return i = null, n;
    } catch {
      return !1;
    }
  }()), Wn;
}
var Sp = "#f0f8ff", Pp = "#faebd7", Ap = "#00ffff", Rp = "#7fffd4", Op = "#f0ffff", Ip = "#f5f5dc", Cp = "#ffe4c4", Mp = "#000000", Dp = "#ffebcd", Fp = "#0000ff", Np = "#8a2be2", Bp = "#a52a2a", Lp = "#deb887", Up = "#5f9ea0", Gp = "#7fff00", kp = "#d2691e", Hp = "#ff7f50", Xp = "#6495ed", jp = "#fff8dc", Vp = "#dc143c", zp = "#00ffff", Wp = "#00008b", Yp = "#008b8b", qp = "#b8860b", Zp = "#a9a9a9", Kp = "#006400", $p = "#a9a9a9", Qp = "#bdb76b", Jp = "#8b008b", tv = "#556b2f", ev = "#ff8c00", rv = "#9932cc", iv = "#8b0000", nv = "#e9967a", av = "#8fbc8f", ov = "#483d8b", sv = "#2f4f4f", uv = "#2f4f4f", hv = "#00ced1", lv = "#9400d3", fv = "#ff1493", cv = "#00bfff", dv = "#696969", pv = "#696969", vv = "#1e90ff", _v = "#b22222", yv = "#fffaf0", gv = "#228b22", mv = "#ff00ff", bv = "#dcdcdc", Ev = "#f8f8ff", Tv = "#daa520", xv = "#ffd700", wv = "#808080", Sv = "#008000", Pv = "#adff2f", Av = "#808080", Rv = "#f0fff0", Ov = "#ff69b4", Iv = "#cd5c5c", Cv = "#4b0082", Mv = "#fffff0", Dv = "#f0e68c", Fv = "#fff0f5", Nv = "#e6e6fa", Bv = "#7cfc00", Lv = "#fffacd", Uv = "#add8e6", Gv = "#f08080", kv = "#e0ffff", Hv = "#fafad2", Xv = "#d3d3d3", jv = "#90ee90", Vv = "#d3d3d3", zv = "#ffb6c1", Wv = "#ffa07a", Yv = "#20b2aa", qv = "#87cefa", Zv = "#778899", Kv = "#778899", $v = "#b0c4de", Qv = "#ffffe0", Jv = "#00ff00", t_ = "#32cd32", e_ = "#faf0e6", r_ = "#ff00ff", i_ = "#800000", n_ = "#66cdaa", a_ = "#0000cd", o_ = "#ba55d3", s_ = "#9370db", u_ = "#3cb371", h_ = "#7b68ee", l_ = "#00fa9a", f_ = "#48d1cc", c_ = "#c71585", d_ = "#191970", p_ = "#f5fffa", v_ = "#ffe4e1", __ = "#ffe4b5", y_ = "#ffdead", g_ = "#000080", m_ = "#fdf5e6", b_ = "#808000", E_ = "#6b8e23", T_ = "#ffa500", x_ = "#ff4500", w_ = "#da70d6", S_ = "#eee8aa", P_ = "#98fb98", A_ = "#afeeee", R_ = "#db7093", O_ = "#ffefd5", I_ = "#ffdab9", C_ = "#cd853f", M_ = "#ffc0cb", D_ = "#dda0dd", F_ = "#b0e0e6", N_ = "#800080", B_ = "#663399", L_ = "#ff0000", U_ = "#bc8f8f", G_ = "#4169e1", k_ = "#8b4513", H_ = "#fa8072", X_ = "#f4a460", j_ = "#2e8b57", V_ = "#fff5ee", z_ = "#a0522d", W_ = "#c0c0c0", Y_ = "#87ceeb", q_ = "#6a5acd", Z_ = "#708090", K_ = "#708090", $_ = "#fffafa", Q_ = "#00ff7f", J_ = "#4682b4", ty = "#d2b48c", ey = "#008080", ry = "#d8bfd8", iy = "#ff6347", ny = "#40e0d0", ay = "#ee82ee", oy = "#f5deb3", sy = "#ffffff", uy = "#f5f5f5", hy = "#ffff00", ly = "#9acd32", fy = {
  aliceblue: Sp,
  antiquewhite: Pp,
  aqua: Ap,
  aquamarine: Rp,
  azure: Op,
  beige: Ip,
  bisque: Cp,
  black: Mp,
  blanchedalmond: Dp,
  blue: Fp,
  blueviolet: Np,
  brown: Bp,
  burlywood: Lp,
  cadetblue: Up,
  chartreuse: Gp,
  chocolate: kp,
  coral: Hp,
  cornflowerblue: Xp,
  cornsilk: jp,
  crimson: Vp,
  cyan: zp,
  darkblue: Wp,
  darkcyan: Yp,
  darkgoldenrod: qp,
  darkgray: Zp,
  darkgreen: Kp,
  darkgrey: $p,
  darkkhaki: Qp,
  darkmagenta: Jp,
  darkolivegreen: tv,
  darkorange: ev,
  darkorchid: rv,
  darkred: iv,
  darksalmon: nv,
  darkseagreen: av,
  darkslateblue: ov,
  darkslategray: sv,
  darkslategrey: uv,
  darkturquoise: hv,
  darkviolet: lv,
  deeppink: fv,
  deepskyblue: cv,
  dimgray: dv,
  dimgrey: pv,
  dodgerblue: vv,
  firebrick: _v,
  floralwhite: yv,
  forestgreen: gv,
  fuchsia: mv,
  gainsboro: bv,
  ghostwhite: Ev,
  goldenrod: Tv,
  gold: xv,
  gray: wv,
  green: Sv,
  greenyellow: Pv,
  grey: Av,
  honeydew: Rv,
  hotpink: Ov,
  indianred: Iv,
  indigo: Cv,
  ivory: Mv,
  khaki: Dv,
  lavenderblush: Fv,
  lavender: Nv,
  lawngreen: Bv,
  lemonchiffon: Lv,
  lightblue: Uv,
  lightcoral: Gv,
  lightcyan: kv,
  lightgoldenrodyellow: Hv,
  lightgray: Xv,
  lightgreen: jv,
  lightgrey: Vv,
  lightpink: zv,
  lightsalmon: Wv,
  lightseagreen: Yv,
  lightskyblue: qv,
  lightslategray: Zv,
  lightslategrey: Kv,
  lightsteelblue: $v,
  lightyellow: Qv,
  lime: Jv,
  limegreen: t_,
  linen: e_,
  magenta: r_,
  maroon: i_,
  mediumaquamarine: n_,
  mediumblue: a_,
  mediumorchid: o_,
  mediumpurple: s_,
  mediumseagreen: u_,
  mediumslateblue: h_,
  mediumspringgreen: l_,
  mediumturquoise: f_,
  mediumvioletred: c_,
  midnightblue: d_,
  mintcream: p_,
  mistyrose: v_,
  moccasin: __,
  navajowhite: y_,
  navy: g_,
  oldlace: m_,
  olive: b_,
  olivedrab: E_,
  orange: T_,
  orangered: x_,
  orchid: w_,
  palegoldenrod: S_,
  palegreen: P_,
  paleturquoise: A_,
  palevioletred: R_,
  papayawhip: O_,
  peachpuff: I_,
  peru: C_,
  pink: M_,
  plum: D_,
  powderblue: F_,
  purple: N_,
  rebeccapurple: B_,
  red: L_,
  rosybrown: U_,
  royalblue: G_,
  saddlebrown: k_,
  salmon: H_,
  sandybrown: X_,
  seagreen: j_,
  seashell: V_,
  sienna: z_,
  silver: W_,
  skyblue: Y_,
  slateblue: q_,
  slategray: Z_,
  slategrey: K_,
  snow: $_,
  springgreen: Q_,
  steelblue: J_,
  tan: ty,
  teal: ey,
  thistle: ry,
  tomato: iy,
  turquoise: ny,
  violet: ay,
  wheat: oy,
  white: sy,
  whitesmoke: uy,
  yellow: hy,
  yellowgreen: ly
};
function Dr(r, t) {
  return t === void 0 && (t = []), t[0] = (r >> 16 & 255) / 255, t[1] = (r >> 8 & 255) / 255, t[2] = (r & 255) / 255, t;
}
function Dh(r) {
  var t = r.toString(16);
  return t = "000000".substring(0, 6 - t.length) + t, "#" + t;
}
function fn(r) {
  return typeof r == "string" && (r = fy[r.toLowerCase()] || r, r[0] === "#" && (r = r.slice(1))), parseInt(r, 16);
}
function cy() {
  for (var r = [], t = [], e = 0; e < 32; e++)
    r[e] = e, t[e] = e;
  r[z.NORMAL_NPM] = z.NORMAL, r[z.ADD_NPM] = z.ADD, r[z.SCREEN_NPM] = z.SCREEN, t[z.NORMAL] = z.NORMAL_NPM, t[z.ADD] = z.ADD_NPM, t[z.SCREEN] = z.SCREEN_NPM;
  var i = [];
  return i.push(t), i.push(r), i;
}
var Fh = cy();
function Nh(r, t) {
  return Fh[t ? 1 : 0][r];
}
function dy(r, t, e, i) {
  return e = e || new Float32Array(4), i || i === void 0 ? (e[0] = r[0] * t, e[1] = r[1] * t, e[2] = r[2] * t) : (e[0] = r[0], e[1] = r[1], e[2] = r[2]), e[3] = t, e;
}
function Bo(r, t) {
  if (t === 1)
    return (t * 255 << 24) + r;
  if (t === 0)
    return 0;
  var e = r >> 16 & 255, i = r >> 8 & 255, n = r & 255;
  return e = e * t + 0.5 | 0, i = i * t + 0.5 | 0, n = n * t + 0.5 | 0, (t * 255 << 24) + (e << 16) + (i << 8) + n;
}
function Bh(r, t, e, i) {
  return e = e || new Float32Array(4), e[0] = (r >> 16 & 255) / 255, e[1] = (r >> 8 & 255) / 255, e[2] = (r & 255) / 255, (i || i === void 0) && (e[0] *= t, e[1] *= t, e[2] *= t), e[3] = t, e;
}
function py(r, t) {
  t === void 0 && (t = null);
  var e = r * 6;
  if (t = t || new Uint16Array(e), t.length !== e)
    throw new Error("Out buffer length is incorrect, got " + t.length + " and expected " + e);
  for (var i = 0, n = 0; i < e; i += 6, n += 4)
    t[i + 0] = n + 0, t[i + 1] = n + 1, t[i + 2] = n + 2, t[i + 3] = n + 0, t[i + 4] = n + 2, t[i + 5] = n + 3;
  return t;
}
function Lh(r) {
  if (r.BYTES_PER_ELEMENT === 4)
    return r instanceof Float32Array ? "Float32Array" : r instanceof Uint32Array ? "Uint32Array" : "Int32Array";
  if (r.BYTES_PER_ELEMENT === 2) {
    if (r instanceof Uint16Array)
      return "Uint16Array";
  } else if (r.BYTES_PER_ELEMENT === 1 && r instanceof Uint8Array)
    return "Uint8Array";
  return null;
}
function cn(r) {
  return r += r === 0 ? 1 : 0, --r, r |= r >>> 1, r |= r >>> 2, r |= r >>> 4, r |= r >>> 8, r |= r >>> 16, r + 1;
}
function ks(r) {
  return !(r & r - 1) && !!r;
}
function Hs(r) {
  var t = (r > 65535 ? 1 : 0) << 4;
  r >>>= t;
  var e = (r > 255 ? 1 : 0) << 3;
  return r >>>= e, t |= e, e = (r > 15 ? 1 : 0) << 2, r >>>= e, t |= e, e = (r > 3 ? 1 : 0) << 1, r >>>= e, t |= e, t | r >> 1;
}
function Rr(r, t, e) {
  var i = r.length, n;
  if (!(t >= i || e === 0)) {
    e = t + e > i ? i - t : e;
    var a = i - e;
    for (n = t; n < a; ++n)
      r[n] = r[n + e];
    r.length = a;
  }
}
function xr(r) {
  return r === 0 ? 0 : r < 0 ? -1 : 1;
}
var vy = 0;
function ar() {
  return ++vy;
}
var Xs = {};
function ae(r, t, e) {
  if (e === void 0 && (e = 3), !Xs[t]) {
    var i = new Error().stack;
    typeof i > "u" ? console.warn("PixiJS Deprecation Warning: ", t + `
Deprecated since v` + r) : (i = i.split(`
`).splice(e).join(`
`), console.groupCollapsed ? (console.groupCollapsed("%cPixiJS Deprecation Warning: %c%s", "color:#614108;background:#fffbe6", "font-weight:normal;color:#614108;background:#fffbe6", t + `
Deprecated since v` + r), console.warn(i), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", t + `
Deprecated since v` + r), console.warn(i))), Xs[t] = !0;
  }
}
var js = {}, me = /* @__PURE__ */ Object.create(null), He = /* @__PURE__ */ Object.create(null), Vs = (
  /** @class */
  function() {
    function r(t, e, i) {
      this.canvas = k.ADAPTER.createCanvas(), this.context = this.canvas.getContext("2d"), this.resolution = i || k.RESOLUTION, this.resize(t, e);
    }
    return r.prototype.clear = function() {
      this.context.setTransform(1, 0, 0, 1, 0, 0), this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }, r.prototype.resize = function(t, e) {
      this.canvas.width = Math.round(t * this.resolution), this.canvas.height = Math.round(e * this.resolution);
    }, r.prototype.destroy = function() {
      this.context = null, this.canvas = null;
    }, Object.defineProperty(r.prototype, "width", {
      /**
       * The width of the canvas buffer in pixels.
       * @member {number}
       */
      get: function() {
        return this.canvas.width;
      },
      set: function(t) {
        this.canvas.width = Math.round(t);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "height", {
      /**
       * The height of the canvas buffer in pixels.
       * @member {number}
       */
      get: function() {
        return this.canvas.height;
      },
      set: function(t) {
        this.canvas.height = Math.round(t);
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
);
function _y(r) {
  var t = r.width, e = r.height, i = r.getContext("2d", {
    willReadFrequently: !0
  }), n = i.getImageData(0, 0, t, e), a = n.data, o = a.length, s = {
    top: null,
    left: null,
    right: null,
    bottom: null
  }, u = null, h, l, f;
  for (h = 0; h < o; h += 4)
    a[h + 3] !== 0 && (l = h / 4 % t, f = ~~(h / 4 / t), s.top === null && (s.top = f), (s.left === null || l < s.left) && (s.left = l), (s.right === null || s.right < l) && (s.right = l + 1), (s.bottom === null || s.bottom < f) && (s.bottom = f));
  return s.top !== null && (t = s.right - s.left, e = s.bottom - s.top + 1, u = i.getImageData(s.left, s.top, t, e)), {
    height: e,
    width: t,
    data: u
  };
}
var Si;
function yy(r, t) {
  if (t === void 0 && (t = globalThis.location), r.indexOf("data:") === 0)
    return "";
  t = t || globalThis.location, Si || (Si = document.createElement("a")), Si.href = r;
  var e = Tr.parse(Si.href), i = !e.port && t.port === "" || e.port === t.port;
  return e.hostname !== t.hostname || !i || e.protocol !== t.protocol ? "anonymous" : "";
}
function dn(r, t) {
  var e = k.RETINA_PREFIX.exec(r);
  return e ? parseFloat(e[1]) : t !== void 0 ? t : 1;
}
/*!
 * @pixi/math - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/math is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var pn = Math.PI * 2, gy = 180 / Math.PI, my = Math.PI / 180, Dt;
(function(r) {
  r[r.POLY = 0] = "POLY", r[r.RECT = 1] = "RECT", r[r.CIRC = 2] = "CIRC", r[r.ELIP = 3] = "ELIP", r[r.RREC = 4] = "RREC";
})(Dt || (Dt = {}));
var gt = (
  /** @class */
  function() {
    function r(t, e) {
      t === void 0 && (t = 0), e === void 0 && (e = 0), this.x = 0, this.y = 0, this.x = t, this.y = e;
    }
    return r.prototype.clone = function() {
      return new r(this.x, this.y);
    }, r.prototype.copyFrom = function(t) {
      return this.set(t.x, t.y), this;
    }, r.prototype.copyTo = function(t) {
      return t.set(this.x, this.y), t;
    }, r.prototype.equals = function(t) {
      return t.x === this.x && t.y === this.y;
    }, r.prototype.set = function(t, e) {
      return t === void 0 && (t = 0), e === void 0 && (e = t), this.x = t, this.y = e, this;
    }, r.prototype.toString = function() {
      return "[@pixi/math:Point x=" + this.x + " y=" + this.y + "]";
    }, r;
  }()
), Pi = [new gt(), new gt(), new gt(), new gt()], st = (
  /** @class */
  function() {
    function r(t, e, i, n) {
      t === void 0 && (t = 0), e === void 0 && (e = 0), i === void 0 && (i = 0), n === void 0 && (n = 0), this.x = Number(t), this.y = Number(e), this.width = Number(i), this.height = Number(n), this.type = Dt.RECT;
    }
    return Object.defineProperty(r.prototype, "left", {
      /** Returns the left edge of the rectangle. */
      get: function() {
        return this.x;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "right", {
      /** Returns the right edge of the rectangle. */
      get: function() {
        return this.x + this.width;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "top", {
      /** Returns the top edge of the rectangle. */
      get: function() {
        return this.y;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "bottom", {
      /** Returns the bottom edge of the rectangle. */
      get: function() {
        return this.y + this.height;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "EMPTY", {
      /** A constant empty rectangle. */
      get: function() {
        return new r(0, 0, 0, 0);
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.clone = function() {
      return new r(this.x, this.y, this.width, this.height);
    }, r.prototype.copyFrom = function(t) {
      return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
    }, r.prototype.copyTo = function(t) {
      return t.x = this.x, t.y = this.y, t.width = this.width, t.height = this.height, t;
    }, r.prototype.contains = function(t, e) {
      return this.width <= 0 || this.height <= 0 ? !1 : t >= this.x && t < this.x + this.width && e >= this.y && e < this.y + this.height;
    }, r.prototype.intersects = function(t, e) {
      if (!e) {
        var i = this.x < t.x ? t.x : this.x, n = this.right > t.right ? t.right : this.right;
        if (n <= i)
          return !1;
        var a = this.y < t.y ? t.y : this.y, o = this.bottom > t.bottom ? t.bottom : this.bottom;
        return o > a;
      }
      var s = this.left, u = this.right, h = this.top, l = this.bottom;
      if (u <= s || l <= h)
        return !1;
      var f = Pi[0].set(t.left, t.top), c = Pi[1].set(t.left, t.bottom), d = Pi[2].set(t.right, t.top), p = Pi[3].set(t.right, t.bottom);
      if (d.x <= f.x || c.y <= f.y)
        return !1;
      var _ = Math.sign(e.a * e.d - e.b * e.c);
      if (_ === 0 || (e.apply(f, f), e.apply(c, c), e.apply(d, d), e.apply(p, p), Math.max(f.x, c.x, d.x, p.x) <= s || Math.min(f.x, c.x, d.x, p.x) >= u || Math.max(f.y, c.y, d.y, p.y) <= h || Math.min(f.y, c.y, d.y, p.y) >= l))
        return !1;
      var v = _ * (c.y - f.y), y = _ * (f.x - c.x), g = v * s + y * h, m = v * u + y * h, E = v * s + y * l, b = v * u + y * l;
      if (Math.max(g, m, E, b) <= v * f.x + y * f.y || Math.min(g, m, E, b) >= v * p.x + y * p.y)
        return !1;
      var x = _ * (f.y - d.y), S = _ * (d.x - f.x), A = x * s + S * h, w = x * u + S * h, P = x * s + S * l, O = x * u + S * l;
      return !(Math.max(A, w, P, O) <= x * f.x + S * f.y || Math.min(A, w, P, O) >= x * p.x + S * p.y);
    }, r.prototype.pad = function(t, e) {
      return t === void 0 && (t = 0), e === void 0 && (e = t), this.x -= t, this.y -= e, this.width += t * 2, this.height += e * 2, this;
    }, r.prototype.fit = function(t) {
      var e = Math.max(this.x, t.x), i = Math.min(this.x + this.width, t.x + t.width), n = Math.max(this.y, t.y), a = Math.min(this.y + this.height, t.y + t.height);
      return this.x = e, this.width = Math.max(i - e, 0), this.y = n, this.height = Math.max(a - n, 0), this;
    }, r.prototype.ceil = function(t, e) {
      t === void 0 && (t = 1), e === void 0 && (e = 1e-3);
      var i = Math.ceil((this.x + this.width - e) * t) / t, n = Math.ceil((this.y + this.height - e) * t) / t;
      return this.x = Math.floor((this.x + e) * t) / t, this.y = Math.floor((this.y + e) * t) / t, this.width = i - this.x, this.height = n - this.y, this;
    }, r.prototype.enlarge = function(t) {
      var e = Math.min(this.x, t.x), i = Math.max(this.x + this.width, t.x + t.width), n = Math.min(this.y, t.y), a = Math.max(this.y + this.height, t.y + t.height);
      return this.x = e, this.width = i - e, this.y = n, this.height = a - n, this;
    }, r.prototype.toString = function() {
      return "[@pixi/math:Rectangle x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + "]";
    }, r;
  }()
), by = (
  /** @class */
  function() {
    function r(t, e, i) {
      t === void 0 && (t = 0), e === void 0 && (e = 0), i === void 0 && (i = 0), this.x = t, this.y = e, this.radius = i, this.type = Dt.CIRC;
    }
    return r.prototype.clone = function() {
      return new r(this.x, this.y, this.radius);
    }, r.prototype.contains = function(t, e) {
      if (this.radius <= 0)
        return !1;
      var i = this.radius * this.radius, n = this.x - t, a = this.y - e;
      return n *= n, a *= a, n + a <= i;
    }, r.prototype.getBounds = function() {
      return new st(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }, r.prototype.toString = function() {
      return "[@pixi/math:Circle x=" + this.x + " y=" + this.y + " radius=" + this.radius + "]";
    }, r;
  }()
), Ey = (
  /** @class */
  function() {
    function r(t, e, i, n) {
      t === void 0 && (t = 0), e === void 0 && (e = 0), i === void 0 && (i = 0), n === void 0 && (n = 0), this.x = t, this.y = e, this.width = i, this.height = n, this.type = Dt.ELIP;
    }
    return r.prototype.clone = function() {
      return new r(this.x, this.y, this.width, this.height);
    }, r.prototype.contains = function(t, e) {
      if (this.width <= 0 || this.height <= 0)
        return !1;
      var i = (t - this.x) / this.width, n = (e - this.y) / this.height;
      return i *= i, n *= n, i + n <= 1;
    }, r.prototype.getBounds = function() {
      return new st(this.x - this.width, this.y - this.height, this.width, this.height);
    }, r.prototype.toString = function() {
      return "[@pixi/math:Ellipse x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + "]";
    }, r;
  }()
), Qi = (
  /** @class */
  function() {
    function r() {
      for (var t = arguments, e = [], i = 0; i < arguments.length; i++)
        e[i] = t[i];
      var n = Array.isArray(e[0]) ? e[0] : e;
      if (typeof n[0] != "number") {
        for (var a = [], o = 0, s = n.length; o < s; o++)
          a.push(n[o].x, n[o].y);
        n = a;
      }
      this.points = n, this.type = Dt.POLY, this.closeStroke = !0;
    }
    return r.prototype.clone = function() {
      var t = this.points.slice(), e = new r(t);
      return e.closeStroke = this.closeStroke, e;
    }, r.prototype.contains = function(t, e) {
      for (var i = !1, n = this.points.length / 2, a = 0, o = n - 1; a < n; o = a++) {
        var s = this.points[a * 2], u = this.points[a * 2 + 1], h = this.points[o * 2], l = this.points[o * 2 + 1], f = u > e != l > e && t < (h - s) * ((e - u) / (l - u)) + s;
        f && (i = !i);
      }
      return i;
    }, r.prototype.toString = function() {
      return "[@pixi/math:Polygon" + ("closeStroke=" + this.closeStroke) + ("points=" + this.points.reduce(function(t, e) {
        return t + ", " + e;
      }, "") + "]");
    }, r;
  }()
), Ty = (
  /** @class */
  function() {
    function r(t, e, i, n, a) {
      t === void 0 && (t = 0), e === void 0 && (e = 0), i === void 0 && (i = 0), n === void 0 && (n = 0), a === void 0 && (a = 20), this.x = t, this.y = e, this.width = i, this.height = n, this.radius = a, this.type = Dt.RREC;
    }
    return r.prototype.clone = function() {
      return new r(this.x, this.y, this.width, this.height, this.radius);
    }, r.prototype.contains = function(t, e) {
      if (this.width <= 0 || this.height <= 0)
        return !1;
      if (t >= this.x && t <= this.x + this.width && e >= this.y && e <= this.y + this.height) {
        var i = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
        if (e >= this.y + i && e <= this.y + this.height - i || t >= this.x + i && t <= this.x + this.width - i)
          return !0;
        var n = t - (this.x + i), a = e - (this.y + i), o = i * i;
        if (n * n + a * a <= o || (n = t - (this.x + this.width - i), n * n + a * a <= o) || (a = e - (this.y + this.height - i), n * n + a * a <= o) || (n = t - (this.x + i), n * n + a * a <= o))
          return !0;
      }
      return !1;
    }, r.prototype.toString = function() {
      return "[@pixi/math:RoundedRectangle x=" + this.x + " y=" + this.y + ("width=" + this.width + " height=" + this.height + " radius=" + this.radius + "]");
    }, r;
  }()
), wr = (
  /** @class */
  function() {
    function r(t, e, i, n) {
      i === void 0 && (i = 0), n === void 0 && (n = 0), this._x = i, this._y = n, this.cb = t, this.scope = e;
    }
    return r.prototype.clone = function(t, e) {
      return t === void 0 && (t = this.cb), e === void 0 && (e = this.scope), new r(t, e, this._x, this._y);
    }, r.prototype.set = function(t, e) {
      return t === void 0 && (t = 0), e === void 0 && (e = t), (this._x !== t || this._y !== e) && (this._x = t, this._y = e, this.cb.call(this.scope)), this;
    }, r.prototype.copyFrom = function(t) {
      return (this._x !== t.x || this._y !== t.y) && (this._x = t.x, this._y = t.y, this.cb.call(this.scope)), this;
    }, r.prototype.copyTo = function(t) {
      return t.set(this._x, this._y), t;
    }, r.prototype.equals = function(t) {
      return t.x === this._x && t.y === this._y;
    }, r.prototype.toString = function() {
      return "[@pixi/math:ObservablePoint x=0 y=0 scope=" + this.scope + "]";
    }, Object.defineProperty(r.prototype, "x", {
      /** Position of the observable point on the x axis. */
      get: function() {
        return this._x;
      },
      set: function(t) {
        this._x !== t && (this._x = t, this.cb.call(this.scope));
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "y", {
      /** Position of the observable point on the y axis. */
      get: function() {
        return this._y;
      },
      set: function(t) {
        this._y !== t && (this._y = t, this.cb.call(this.scope));
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
), It = (
  /** @class */
  function() {
    function r(t, e, i, n, a, o) {
      t === void 0 && (t = 1), e === void 0 && (e = 0), i === void 0 && (i = 0), n === void 0 && (n = 1), a === void 0 && (a = 0), o === void 0 && (o = 0), this.array = null, this.a = t, this.b = e, this.c = i, this.d = n, this.tx = a, this.ty = o;
    }
    return r.prototype.fromArray = function(t) {
      this.a = t[0], this.b = t[1], this.c = t[3], this.d = t[4], this.tx = t[2], this.ty = t[5];
    }, r.prototype.set = function(t, e, i, n, a, o) {
      return this.a = t, this.b = e, this.c = i, this.d = n, this.tx = a, this.ty = o, this;
    }, r.prototype.toArray = function(t, e) {
      this.array || (this.array = new Float32Array(9));
      var i = e || this.array;
      return t ? (i[0] = this.a, i[1] = this.b, i[2] = 0, i[3] = this.c, i[4] = this.d, i[5] = 0, i[6] = this.tx, i[7] = this.ty, i[8] = 1) : (i[0] = this.a, i[1] = this.c, i[2] = this.tx, i[3] = this.b, i[4] = this.d, i[5] = this.ty, i[6] = 0, i[7] = 0, i[8] = 1), i;
    }, r.prototype.apply = function(t, e) {
      e = e || new gt();
      var i = t.x, n = t.y;
      return e.x = this.a * i + this.c * n + this.tx, e.y = this.b * i + this.d * n + this.ty, e;
    }, r.prototype.applyInverse = function(t, e) {
      e = e || new gt();
      var i = 1 / (this.a * this.d + this.c * -this.b), n = t.x, a = t.y;
      return e.x = this.d * i * n + -this.c * i * a + (this.ty * this.c - this.tx * this.d) * i, e.y = this.a * i * a + -this.b * i * n + (-this.ty * this.a + this.tx * this.b) * i, e;
    }, r.prototype.translate = function(t, e) {
      return this.tx += t, this.ty += e, this;
    }, r.prototype.scale = function(t, e) {
      return this.a *= t, this.d *= e, this.c *= t, this.b *= e, this.tx *= t, this.ty *= e, this;
    }, r.prototype.rotate = function(t) {
      var e = Math.cos(t), i = Math.sin(t), n = this.a, a = this.c, o = this.tx;
      return this.a = n * e - this.b * i, this.b = n * i + this.b * e, this.c = a * e - this.d * i, this.d = a * i + this.d * e, this.tx = o * e - this.ty * i, this.ty = o * i + this.ty * e, this;
    }, r.prototype.append = function(t) {
      var e = this.a, i = this.b, n = this.c, a = this.d;
      return this.a = t.a * e + t.b * n, this.b = t.a * i + t.b * a, this.c = t.c * e + t.d * n, this.d = t.c * i + t.d * a, this.tx = t.tx * e + t.ty * n + this.tx, this.ty = t.tx * i + t.ty * a + this.ty, this;
    }, r.prototype.setTransform = function(t, e, i, n, a, o, s, u, h) {
      return this.a = Math.cos(s + h) * a, this.b = Math.sin(s + h) * a, this.c = -Math.sin(s - u) * o, this.d = Math.cos(s - u) * o, this.tx = t - (i * this.a + n * this.c), this.ty = e - (i * this.b + n * this.d), this;
    }, r.prototype.prepend = function(t) {
      var e = this.tx;
      if (t.a !== 1 || t.b !== 0 || t.c !== 0 || t.d !== 1) {
        var i = this.a, n = this.c;
        this.a = i * t.a + this.b * t.c, this.b = i * t.b + this.b * t.d, this.c = n * t.a + this.d * t.c, this.d = n * t.b + this.d * t.d;
      }
      return this.tx = e * t.a + this.ty * t.c + t.tx, this.ty = e * t.b + this.ty * t.d + t.ty, this;
    }, r.prototype.decompose = function(t) {
      var e = this.a, i = this.b, n = this.c, a = this.d, o = t.pivot, s = -Math.atan2(-n, a), u = Math.atan2(i, e), h = Math.abs(s + u);
      return h < 1e-5 || Math.abs(pn - h) < 1e-5 ? (t.rotation = u, t.skew.x = t.skew.y = 0) : (t.rotation = 0, t.skew.x = s, t.skew.y = u), t.scale.x = Math.sqrt(e * e + i * i), t.scale.y = Math.sqrt(n * n + a * a), t.position.x = this.tx + (o.x * e + o.y * n), t.position.y = this.ty + (o.x * i + o.y * a), t;
    }, r.prototype.invert = function() {
      var t = this.a, e = this.b, i = this.c, n = this.d, a = this.tx, o = t * n - e * i;
      return this.a = n / o, this.b = -e / o, this.c = -i / o, this.d = t / o, this.tx = (i * this.ty - n * a) / o, this.ty = -(t * this.ty - e * a) / o, this;
    }, r.prototype.identity = function() {
      return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this;
    }, r.prototype.clone = function() {
      var t = new r();
      return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
    }, r.prototype.copyTo = function(t) {
      return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
    }, r.prototype.copyFrom = function(t) {
      return this.a = t.a, this.b = t.b, this.c = t.c, this.d = t.d, this.tx = t.tx, this.ty = t.ty, this;
    }, r.prototype.toString = function() {
      return "[@pixi/math:Matrix a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + "]";
    }, Object.defineProperty(r, "IDENTITY", {
      /**
       * A default (identity) matrix
       * @readonly
       */
      get: function() {
        return new r();
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "TEMP_MATRIX", {
      /**
       * A temp matrix
       * @readonly
       */
      get: function() {
        return new r();
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
), We = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1], Ye = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1], qe = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1], Ze = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1], ka = [], Uh = [], Ai = Math.sign;
function xy() {
  for (var r = 0; r < 16; r++) {
    var t = [];
    ka.push(t);
    for (var e = 0; e < 16; e++)
      for (var i = Ai(We[r] * We[e] + qe[r] * Ye[e]), n = Ai(Ye[r] * We[e] + Ze[r] * Ye[e]), a = Ai(We[r] * qe[e] + qe[r] * Ze[e]), o = Ai(Ye[r] * qe[e] + Ze[r] * Ze[e]), s = 0; s < 16; s++)
        if (We[s] === i && Ye[s] === n && qe[s] === a && Ze[s] === o) {
          t.push(s);
          break;
        }
  }
  for (var r = 0; r < 16; r++) {
    var u = new It();
    u.set(We[r], Ye[r], qe[r], Ze[r], 0, 0), Uh.push(u);
  }
}
xy();
var Et = {
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 0°       | East      |
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  E: 0,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 45°↻     | Southeast |
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  SE: 1,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 90°↻     | South     |
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  S: 2,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 135°↻    | Southwest |
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  SW: 3,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 180°     | West      |
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  W: 4,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -135°/225°↻ | Northwest    |
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  NW: 5,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -90°/270°↻  | North        |
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  N: 6,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -45°/315°↻  | Northeast    |
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  NE: 7,
  /**
   * Reflection about Y-axis.
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  MIRROR_VERTICAL: 8,
  /**
   * Reflection about the main diagonal.
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  MAIN_DIAGONAL: 10,
  /**
   * Reflection about X-axis.
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  MIRROR_HORIZONTAL: 12,
  /**
   * Reflection about reverse diagonal.
   * @memberof PIXI.groupD8
   * @constant {PIXI.GD8Symmetry}
   */
  REVERSE_DIAGONAL: 14,
  /**
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
   * @returns {PIXI.GD8Symmetry} The X-component of the U-axis
   *    after rotating the axes.
   */
  uX: function(r) {
    return We[r];
  },
  /**
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
   * @returns {PIXI.GD8Symmetry} The Y-component of the U-axis
   *    after rotating the axes.
   */
  uY: function(r) {
    return Ye[r];
  },
  /**
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
   * @returns {PIXI.GD8Symmetry} The X-component of the V-axis
   *    after rotating the axes.
   */
  vX: function(r) {
    return qe[r];
  },
  /**
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
   * @returns {PIXI.GD8Symmetry} The Y-component of the V-axis
   *    after rotating the axes.
   */
  vY: function(r) {
    return Ze[r];
  },
  /**
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} rotation - symmetry whose opposite
   *   is needed. Only rotations have opposite symmetries while
   *   reflections don't.
   * @returns {PIXI.GD8Symmetry} The opposite symmetry of `rotation`
   */
  inv: function(r) {
    return r & 8 ? r & 15 : -r & 7;
  },
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
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} rotationSecond - Second operation, which
   *   is the row in the above cayley table.
   * @param {PIXI.GD8Symmetry} rotationFirst - First operation, which
   *   is the column in the above cayley table.
   * @returns {PIXI.GD8Symmetry} Composed operation
   */
  add: function(r, t) {
    return ka[r][t];
  },
  /**
   * Reverse of `add`.
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} rotationSecond - Second operation
   * @param {PIXI.GD8Symmetry} rotationFirst - First operation
   * @returns {PIXI.GD8Symmetry} Result
   */
  sub: function(r, t) {
    return ka[r][Et.inv(t)];
  },
  /**
   * Adds 180 degrees to rotation, which is a commutative
   * operation.
   * @memberof PIXI.groupD8
   * @param {number} rotation - The number to rotate.
   * @returns {number} Rotated number
   */
  rotate180: function(r) {
    return r ^ 4;
  },
  /**
   * Checks if the rotation angle is vertical, i.e. south
   * or north. It doesn't work for reflections.
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} rotation - The number to check.
   * @returns {boolean} Whether or not the direction is vertical
   */
  isVertical: function(r) {
    return (r & 3) === 2;
  },
  /**
   * Approximates the vector `V(dx,dy)` into one of the
   * eight directions provided by `groupD8`.
   * @memberof PIXI.groupD8
   * @param {number} dx - X-component of the vector
   * @param {number} dy - Y-component of the vector
   * @returns {PIXI.GD8Symmetry} Approximation of the vector into
   *  one of the eight symmetries.
   */
  byDirection: function(r, t) {
    return Math.abs(r) * 2 <= Math.abs(t) ? t >= 0 ? Et.S : Et.N : Math.abs(t) * 2 <= Math.abs(r) ? r > 0 ? Et.E : Et.W : t > 0 ? r > 0 ? Et.SE : Et.SW : r > 0 ? Et.NE : Et.NW;
  },
  /**
   * Helps sprite to compensate texture packer rotation.
   * @memberof PIXI.groupD8
   * @param {PIXI.Matrix} matrix - sprite world matrix
   * @param {PIXI.GD8Symmetry} rotation - The rotation factor to use.
   * @param {number} tx - sprite anchoring
   * @param {number} ty - sprite anchoring
   */
  matrixAppendRotationInv: function(r, t, e, i) {
    e === void 0 && (e = 0), i === void 0 && (i = 0);
    var n = Uh[Et.inv(t)];
    n.tx = e, n.ty = i, r.append(n);
  }
}, Gh = (
  /** @class */
  function() {
    function r() {
      this.worldTransform = new It(), this.localTransform = new It(), this.position = new wr(this.onChange, this, 0, 0), this.scale = new wr(this.onChange, this, 1, 1), this.pivot = new wr(this.onChange, this, 0, 0), this.skew = new wr(this.updateSkew, this, 0, 0), this._rotation = 0, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._localID = 0, this._currentLocalID = 0, this._worldID = 0, this._parentID = 0;
    }
    return r.prototype.onChange = function() {
      this._localID++;
    }, r.prototype.updateSkew = function() {
      this._cx = Math.cos(this._rotation + this.skew.y), this._sx = Math.sin(this._rotation + this.skew.y), this._cy = -Math.sin(this._rotation - this.skew.x), this._sy = Math.cos(this._rotation - this.skew.x), this._localID++;
    }, r.prototype.toString = function() {
      return "[@pixi/math:Transform " + ("position=(" + this.position.x + ", " + this.position.y + ") ") + ("rotation=" + this.rotation + " ") + ("scale=(" + this.scale.x + ", " + this.scale.y + ") ") + ("skew=(" + this.skew.x + ", " + this.skew.y + ") ") + "]";
    }, r.prototype.updateLocalTransform = function() {
      var t = this.localTransform;
      this._localID !== this._currentLocalID && (t.a = this._cx * this.scale.x, t.b = this._sx * this.scale.x, t.c = this._cy * this.scale.y, t.d = this._sy * this.scale.y, t.tx = this.position.x - (this.pivot.x * t.a + this.pivot.y * t.c), t.ty = this.position.y - (this.pivot.x * t.b + this.pivot.y * t.d), this._currentLocalID = this._localID, this._parentID = -1);
    }, r.prototype.updateTransform = function(t) {
      var e = this.localTransform;
      if (this._localID !== this._currentLocalID && (e.a = this._cx * this.scale.x, e.b = this._sx * this.scale.x, e.c = this._cy * this.scale.y, e.d = this._sy * this.scale.y, e.tx = this.position.x - (this.pivot.x * e.a + this.pivot.y * e.c), e.ty = this.position.y - (this.pivot.x * e.b + this.pivot.y * e.d), this._currentLocalID = this._localID, this._parentID = -1), this._parentID !== t._worldID) {
        var i = t.worldTransform, n = this.worldTransform;
        n.a = e.a * i.a + e.b * i.c, n.b = e.a * i.b + e.b * i.d, n.c = e.c * i.a + e.d * i.c, n.d = e.c * i.b + e.d * i.d, n.tx = e.tx * i.a + e.ty * i.c + i.tx, n.ty = e.tx * i.b + e.ty * i.d + i.ty, this._parentID = t._worldID, this._worldID++;
      }
    }, r.prototype.setFromMatrix = function(t) {
      t.decompose(this), this._localID++;
    }, Object.defineProperty(r.prototype, "rotation", {
      /** The rotation of the object in radians. */
      get: function() {
        return this._rotation;
      },
      set: function(t) {
        this._rotation !== t && (this._rotation = t, this.updateSkew());
      },
      enumerable: !1,
      configurable: !0
    }), r.IDENTITY = new r(), r;
  }()
);
/*!
 * @pixi/display - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/display is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
k.SORTABLE_CHILDREN = !1;
var vn = (
  /** @class */
  function() {
    function r() {
      this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.rect = null, this.updateID = -1;
    }
    return r.prototype.isEmpty = function() {
      return this.minX > this.maxX || this.minY > this.maxY;
    }, r.prototype.clear = function() {
      this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0;
    }, r.prototype.getRectangle = function(t) {
      return this.minX > this.maxX || this.minY > this.maxY ? st.EMPTY : (t = t || new st(0, 0, 1, 1), t.x = this.minX, t.y = this.minY, t.width = this.maxX - this.minX, t.height = this.maxY - this.minY, t);
    }, r.prototype.addPoint = function(t) {
      this.minX = Math.min(this.minX, t.x), this.maxX = Math.max(this.maxX, t.x), this.minY = Math.min(this.minY, t.y), this.maxY = Math.max(this.maxY, t.y);
    }, r.prototype.addPointMatrix = function(t, e) {
      var i = t.a, n = t.b, a = t.c, o = t.d, s = t.tx, u = t.ty, h = i * e.x + a * e.y + s, l = n * e.x + o * e.y + u;
      this.minX = Math.min(this.minX, h), this.maxX = Math.max(this.maxX, h), this.minY = Math.min(this.minY, l), this.maxY = Math.max(this.maxY, l);
    }, r.prototype.addQuad = function(t) {
      var e = this.minX, i = this.minY, n = this.maxX, a = this.maxY, o = t[0], s = t[1];
      e = o < e ? o : e, i = s < i ? s : i, n = o > n ? o : n, a = s > a ? s : a, o = t[2], s = t[3], e = o < e ? o : e, i = s < i ? s : i, n = o > n ? o : n, a = s > a ? s : a, o = t[4], s = t[5], e = o < e ? o : e, i = s < i ? s : i, n = o > n ? o : n, a = s > a ? s : a, o = t[6], s = t[7], e = o < e ? o : e, i = s < i ? s : i, n = o > n ? o : n, a = s > a ? s : a, this.minX = e, this.minY = i, this.maxX = n, this.maxY = a;
    }, r.prototype.addFrame = function(t, e, i, n, a) {
      this.addFrameMatrix(t.worldTransform, e, i, n, a);
    }, r.prototype.addFrameMatrix = function(t, e, i, n, a) {
      var o = t.a, s = t.b, u = t.c, h = t.d, l = t.tx, f = t.ty, c = this.minX, d = this.minY, p = this.maxX, _ = this.maxY, v = o * e + u * i + l, y = s * e + h * i + f;
      c = v < c ? v : c, d = y < d ? y : d, p = v > p ? v : p, _ = y > _ ? y : _, v = o * n + u * i + l, y = s * n + h * i + f, c = v < c ? v : c, d = y < d ? y : d, p = v > p ? v : p, _ = y > _ ? y : _, v = o * e + u * a + l, y = s * e + h * a + f, c = v < c ? v : c, d = y < d ? y : d, p = v > p ? v : p, _ = y > _ ? y : _, v = o * n + u * a + l, y = s * n + h * a + f, c = v < c ? v : c, d = y < d ? y : d, p = v > p ? v : p, _ = y > _ ? y : _, this.minX = c, this.minY = d, this.maxX = p, this.maxY = _;
    }, r.prototype.addVertexData = function(t, e, i) {
      for (var n = this.minX, a = this.minY, o = this.maxX, s = this.maxY, u = e; u < i; u += 2) {
        var h = t[u], l = t[u + 1];
        n = h < n ? h : n, a = l < a ? l : a, o = h > o ? h : o, s = l > s ? l : s;
      }
      this.minX = n, this.minY = a, this.maxX = o, this.maxY = s;
    }, r.prototype.addVertices = function(t, e, i, n) {
      this.addVerticesMatrix(t.worldTransform, e, i, n);
    }, r.prototype.addVerticesMatrix = function(t, e, i, n, a, o) {
      a === void 0 && (a = 0), o === void 0 && (o = a);
      for (var s = t.a, u = t.b, h = t.c, l = t.d, f = t.tx, c = t.ty, d = this.minX, p = this.minY, _ = this.maxX, v = this.maxY, y = i; y < n; y += 2) {
        var g = e[y], m = e[y + 1], E = s * g + h * m + f, b = l * m + u * g + c;
        d = Math.min(d, E - a), _ = Math.max(_, E + a), p = Math.min(p, b - o), v = Math.max(v, b + o);
      }
      this.minX = d, this.minY = p, this.maxX = _, this.maxY = v;
    }, r.prototype.addBounds = function(t) {
      var e = this.minX, i = this.minY, n = this.maxX, a = this.maxY;
      this.minX = t.minX < e ? t.minX : e, this.minY = t.minY < i ? t.minY : i, this.maxX = t.maxX > n ? t.maxX : n, this.maxY = t.maxY > a ? t.maxY : a;
    }, r.prototype.addBoundsMask = function(t, e) {
      var i = t.minX > e.minX ? t.minX : e.minX, n = t.minY > e.minY ? t.minY : e.minY, a = t.maxX < e.maxX ? t.maxX : e.maxX, o = t.maxY < e.maxY ? t.maxY : e.maxY;
      if (i <= a && n <= o) {
        var s = this.minX, u = this.minY, h = this.maxX, l = this.maxY;
        this.minX = i < s ? i : s, this.minY = n < u ? n : u, this.maxX = a > h ? a : h, this.maxY = o > l ? o : l;
      }
    }, r.prototype.addBoundsMatrix = function(t, e) {
      this.addFrameMatrix(e, t.minX, t.minY, t.maxX, t.maxY);
    }, r.prototype.addBoundsArea = function(t, e) {
      var i = t.minX > e.x ? t.minX : e.x, n = t.minY > e.y ? t.minY : e.y, a = t.maxX < e.x + e.width ? t.maxX : e.x + e.width, o = t.maxY < e.y + e.height ? t.maxY : e.y + e.height;
      if (i <= a && n <= o) {
        var s = this.minX, u = this.minY, h = this.maxX, l = this.maxY;
        this.minX = i < s ? i : s, this.minY = n < u ? n : u, this.maxX = a > h ? a : h, this.maxY = o > l ? o : l;
      }
    }, r.prototype.pad = function(t, e) {
      t === void 0 && (t = 0), e === void 0 && (e = t), this.isEmpty() || (this.minX -= t, this.maxX += t, this.minY -= e, this.maxY += e);
    }, r.prototype.addFramePad = function(t, e, i, n, a, o) {
      t -= a, e -= o, i += a, n += o, this.minX = this.minX < t ? this.minX : t, this.maxX = this.maxX > i ? this.maxX : i, this.minY = this.minY < e ? this.minY : e, this.maxY = this.maxY > n ? this.maxY : n;
    }, r;
  }()
);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Ha = function(r, t) {
  return Ha = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, Ha(r, t);
};
function Lo(r, t) {
  Ha(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
var At = (
  /** @class */
  function(r) {
    Lo(t, r);
    function t() {
      var e = r.call(this) || this;
      return e.tempDisplayObjectParent = null, e.transform = new Gh(), e.alpha = 1, e.visible = !0, e.renderable = !0, e.cullable = !1, e.cullArea = null, e.parent = null, e.worldAlpha = 1, e._lastSortedIndex = 0, e._zIndex = 0, e.filterArea = null, e.filters = null, e._enabledFilters = null, e._bounds = new vn(), e._localBounds = null, e._boundsID = 0, e._boundsRect = null, e._localBoundsRect = null, e._mask = null, e._maskRefCount = 0, e._destroyed = !1, e.isSprite = !1, e.isMask = !1, e;
    }
    return t.mixin = function(e) {
      for (var i = Object.keys(e), n = 0; n < i.length; ++n) {
        var a = i[n];
        Object.defineProperty(t.prototype, a, Object.getOwnPropertyDescriptor(e, a));
      }
    }, Object.defineProperty(t.prototype, "destroyed", {
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
      get: function() {
        return this._destroyed;
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype._recursivePostUpdateTransform = function() {
      this.parent ? (this.parent._recursivePostUpdateTransform(), this.transform.updateTransform(this.parent.transform)) : this.transform.updateTransform(this._tempDisplayObjectParent.transform);
    }, t.prototype.updateTransform = function() {
      this._boundsID++, this.transform.updateTransform(this.parent.transform), this.worldAlpha = this.alpha * this.parent.worldAlpha;
    }, t.prototype.getBounds = function(e, i) {
      return e || (this.parent ? (this._recursivePostUpdateTransform(), this.updateTransform()) : (this.parent = this._tempDisplayObjectParent, this.updateTransform(), this.parent = null)), this._bounds.updateID !== this._boundsID && (this.calculateBounds(), this._bounds.updateID = this._boundsID), i || (this._boundsRect || (this._boundsRect = new st()), i = this._boundsRect), this._bounds.getRectangle(i);
    }, t.prototype.getLocalBounds = function(e) {
      e || (this._localBoundsRect || (this._localBoundsRect = new st()), e = this._localBoundsRect), this._localBounds || (this._localBounds = new vn());
      var i = this.transform, n = this.parent;
      this.parent = null, this.transform = this._tempDisplayObjectParent.transform;
      var a = this._bounds, o = this._boundsID;
      this._bounds = this._localBounds;
      var s = this.getBounds(!1, e);
      return this.parent = n, this.transform = i, this._bounds = a, this._bounds.updateID += this._boundsID - o, s;
    }, t.prototype.toGlobal = function(e, i, n) {
      return n === void 0 && (n = !1), n || (this._recursivePostUpdateTransform(), this.parent ? this.displayObjectUpdateTransform() : (this.parent = this._tempDisplayObjectParent, this.displayObjectUpdateTransform(), this.parent = null)), this.worldTransform.apply(e, i);
    }, t.prototype.toLocal = function(e, i, n, a) {
      return i && (e = i.toGlobal(e, n, a)), a || (this._recursivePostUpdateTransform(), this.parent ? this.displayObjectUpdateTransform() : (this.parent = this._tempDisplayObjectParent, this.displayObjectUpdateTransform(), this.parent = null)), this.worldTransform.applyInverse(e, n);
    }, t.prototype.setParent = function(e) {
      if (!e || !e.addChild)
        throw new Error("setParent: Argument must be a Container");
      return e.addChild(this), e;
    }, t.prototype.setTransform = function(e, i, n, a, o, s, u, h, l) {
      return e === void 0 && (e = 0), i === void 0 && (i = 0), n === void 0 && (n = 1), a === void 0 && (a = 1), o === void 0 && (o = 0), s === void 0 && (s = 0), u === void 0 && (u = 0), h === void 0 && (h = 0), l === void 0 && (l = 0), this.position.x = e, this.position.y = i, this.scale.x = n || 1, this.scale.y = a || 1, this.rotation = o, this.skew.x = s, this.skew.y = u, this.pivot.x = h, this.pivot.y = l, this;
    }, t.prototype.destroy = function(e) {
      this.parent && this.parent.removeChild(this), this._destroyed = !0, this.transform = null, this.parent = null, this._bounds = null, this.mask = null, this.cullArea = null, this.filters = null, this.filterArea = null, this.hitArea = null, this.interactive = !1, this.interactiveChildren = !1, this.emit("destroyed"), this.removeAllListeners();
    }, Object.defineProperty(t.prototype, "_tempDisplayObjectParent", {
      /**
       * @protected
       * @member {PIXI.Container}
       */
      get: function() {
        return this.tempDisplayObjectParent === null && (this.tempDisplayObjectParent = new kh()), this.tempDisplayObjectParent;
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.enableTempParent = function() {
      var e = this.parent;
      return this.parent = this._tempDisplayObjectParent, e;
    }, t.prototype.disableTempParent = function(e) {
      this.parent = e;
    }, Object.defineProperty(t.prototype, "x", {
      /**
       * The position of the displayObject on the x axis relative to the local coordinates of the parent.
       * An alias to position.x
       */
      get: function() {
        return this.position.x;
      },
      set: function(e) {
        this.transform.position.x = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "y", {
      /**
       * The position of the displayObject on the y axis relative to the local coordinates of the parent.
       * An alias to position.y
       */
      get: function() {
        return this.position.y;
      },
      set: function(e) {
        this.transform.position.y = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "worldTransform", {
      /**
       * Current transform of the object based on world (parent) factors.
       * @readonly
       */
      get: function() {
        return this.transform.worldTransform;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "localTransform", {
      /**
       * Current transform of the object based on local factors: position, scale, other stuff.
       * @readonly
       */
      get: function() {
        return this.transform.localTransform;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "position", {
      /**
       * The coordinate of the object relative to the local coordinates of the parent.
       * @since 4.0.0
       */
      get: function() {
        return this.transform.position;
      },
      set: function(e) {
        this.transform.position.copyFrom(e);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "scale", {
      /**
       * The scale factors of this object along the local coordinate axes.
       *
       * The default scale is (1, 1).
       * @since 4.0.0
       */
      get: function() {
        return this.transform.scale;
      },
      set: function(e) {
        this.transform.scale.copyFrom(e);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "pivot", {
      /**
       * The center of rotation, scaling, and skewing for this display object in its local space. The `position`
       * is the projection of `pivot` in the parent's local space.
       *
       * By default, the pivot is the origin (0, 0).
       * @since 4.0.0
       */
      get: function() {
        return this.transform.pivot;
      },
      set: function(e) {
        this.transform.pivot.copyFrom(e);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "skew", {
      /**
       * The skew factor for the object in radians.
       * @since 4.0.0
       */
      get: function() {
        return this.transform.skew;
      },
      set: function(e) {
        this.transform.skew.copyFrom(e);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "rotation", {
      /**
       * The rotation of the object in radians.
       * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
       */
      get: function() {
        return this.transform.rotation;
      },
      set: function(e) {
        this.transform.rotation = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "angle", {
      /**
       * The angle of the object in degrees.
       * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
       */
      get: function() {
        return this.transform.rotation * gy;
      },
      set: function(e) {
        this.transform.rotation = e * my;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "zIndex", {
      /**
       * The zIndex of the displayObject.
       *
       * If a container has the sortableChildren property set to true, children will be automatically
       * sorted by zIndex value; a higher value will mean it will be moved towards the end of the array,
       * and thus rendered on top of other display objects within the same container.
       * @see PIXI.Container#sortableChildren
       */
      get: function() {
        return this._zIndex;
      },
      set: function(e) {
        this._zIndex = e, this.parent && (this.parent.sortDirty = !0);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "worldVisible", {
      /**
       * Indicates if the object is globally visible.
       * @readonly
       */
      get: function() {
        var e = this;
        do {
          if (!e.visible)
            return !1;
          e = e.parent;
        } while (e);
        return !0;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "mask", {
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
       * const graphics = new PIXI.Graphics();
       * graphics.beginFill(0xFF3300);
       * graphics.drawRect(50, 250, 100, 100);
       * graphics.endFill();
       *
       * const sprite = new PIXI.Sprite(texture);
       * sprite.mask = graphics;
       * @todo At the moment, PIXI.CanvasRenderer doesn't support PIXI.Sprite as mask.
       */
      get: function() {
        return this._mask;
      },
      set: function(e) {
        if (this._mask !== e) {
          if (this._mask) {
            var i = this._mask.isMaskData ? this._mask.maskObject : this._mask;
            i && (i._maskRefCount--, i._maskRefCount === 0 && (i.renderable = !0, i.isMask = !1));
          }
          if (this._mask = e, this._mask) {
            var i = this._mask.isMaskData ? this._mask.maskObject : this._mask;
            i && (i._maskRefCount === 0 && (i.renderable = !1, i.isMask = !0), i._maskRefCount++);
          }
        }
      },
      enumerable: !1,
      configurable: !0
    }), t;
  }(fi)
), kh = (
  /** @class */
  function(r) {
    Lo(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.sortDirty = null, e;
    }
    return t;
  }(At)
);
At.prototype.displayObjectUpdateTransform = At.prototype.updateTransform;
function wy(r, t) {
  return r.zIndex === t.zIndex ? r._lastSortedIndex - t._lastSortedIndex : r.zIndex - t.zIndex;
}
var ve = (
  /** @class */
  function(r) {
    Lo(t, r);
    function t() {
      var e = r.call(this) || this;
      return e.children = [], e.sortableChildren = k.SORTABLE_CHILDREN, e.sortDirty = !1, e;
    }
    return t.prototype.onChildrenChange = function(e) {
    }, t.prototype.addChild = function() {
      for (var e = arguments, i = [], n = 0; n < arguments.length; n++)
        i[n] = e[n];
      if (i.length > 1)
        for (var a = 0; a < i.length; a++)
          this.addChild(i[a]);
      else {
        var o = i[0];
        o.parent && o.parent.removeChild(o), o.parent = this, this.sortDirty = !0, o.transform._parentID = -1, this.children.push(o), this._boundsID++, this.onChildrenChange(this.children.length - 1), this.emit("childAdded", o, this, this.children.length - 1), o.emit("added", this);
      }
      return i[0];
    }, t.prototype.addChildAt = function(e, i) {
      if (i < 0 || i > this.children.length)
        throw new Error(e + "addChildAt: The index " + i + " supplied is out of bounds " + this.children.length);
      return e.parent && e.parent.removeChild(e), e.parent = this, this.sortDirty = !0, e.transform._parentID = -1, this.children.splice(i, 0, e), this._boundsID++, this.onChildrenChange(i), e.emit("added", this), this.emit("childAdded", e, this, i), e;
    }, t.prototype.swapChildren = function(e, i) {
      if (e !== i) {
        var n = this.getChildIndex(e), a = this.getChildIndex(i);
        this.children[n] = i, this.children[a] = e, this.onChildrenChange(n < a ? n : a);
      }
    }, t.prototype.getChildIndex = function(e) {
      var i = this.children.indexOf(e);
      if (i === -1)
        throw new Error("The supplied DisplayObject must be a child of the caller");
      return i;
    }, t.prototype.setChildIndex = function(e, i) {
      if (i < 0 || i >= this.children.length)
        throw new Error("The index " + i + " supplied is out of bounds " + this.children.length);
      var n = this.getChildIndex(e);
      Rr(this.children, n, 1), this.children.splice(i, 0, e), this.onChildrenChange(i);
    }, t.prototype.getChildAt = function(e) {
      if (e < 0 || e >= this.children.length)
        throw new Error("getChildAt: Index (" + e + ") does not exist.");
      return this.children[e];
    }, t.prototype.removeChild = function() {
      for (var e = arguments, i = [], n = 0; n < arguments.length; n++)
        i[n] = e[n];
      if (i.length > 1)
        for (var a = 0; a < i.length; a++)
          this.removeChild(i[a]);
      else {
        var o = i[0], s = this.children.indexOf(o);
        if (s === -1)
          return null;
        o.parent = null, o.transform._parentID = -1, Rr(this.children, s, 1), this._boundsID++, this.onChildrenChange(s), o.emit("removed", this), this.emit("childRemoved", o, this, s);
      }
      return i[0];
    }, t.prototype.removeChildAt = function(e) {
      var i = this.getChildAt(e);
      return i.parent = null, i.transform._parentID = -1, Rr(this.children, e, 1), this._boundsID++, this.onChildrenChange(e), i.emit("removed", this), this.emit("childRemoved", i, this, e), i;
    }, t.prototype.removeChildren = function(e, i) {
      e === void 0 && (e = 0), i === void 0 && (i = this.children.length);
      var n = e, a = i, o = a - n, s;
      if (o > 0 && o <= a) {
        s = this.children.splice(n, o);
        for (var u = 0; u < s.length; ++u)
          s[u].parent = null, s[u].transform && (s[u].transform._parentID = -1);
        this._boundsID++, this.onChildrenChange(e);
        for (var u = 0; u < s.length; ++u)
          s[u].emit("removed", this), this.emit("childRemoved", s[u], this, u);
        return s;
      } else if (o === 0 && this.children.length === 0)
        return [];
      throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
    }, t.prototype.sortChildren = function() {
      for (var e = !1, i = 0, n = this.children.length; i < n; ++i) {
        var a = this.children[i];
        a._lastSortedIndex = i, !e && a.zIndex !== 0 && (e = !0);
      }
      e && this.children.length > 1 && this.children.sort(wy), this.sortDirty = !1;
    }, t.prototype.updateTransform = function() {
      this.sortableChildren && this.sortDirty && this.sortChildren(), this._boundsID++, this.transform.updateTransform(this.parent.transform), this.worldAlpha = this.alpha * this.parent.worldAlpha;
      for (var e = 0, i = this.children.length; e < i; ++e) {
        var n = this.children[e];
        n.visible && n.updateTransform();
      }
    }, t.prototype.calculateBounds = function() {
      this._bounds.clear(), this._calculateBounds();
      for (var e = 0; e < this.children.length; e++) {
        var i = this.children[e];
        if (!(!i.visible || !i.renderable))
          if (i.calculateBounds(), i._mask) {
            var n = i._mask.isMaskData ? i._mask.maskObject : i._mask;
            n ? (n.calculateBounds(), this._bounds.addBoundsMask(i._bounds, n._bounds)) : this._bounds.addBounds(i._bounds);
          } else
            i.filterArea ? this._bounds.addBoundsArea(i._bounds, i.filterArea) : this._bounds.addBounds(i._bounds);
      }
      this._bounds.updateID = this._boundsID;
    }, t.prototype.getLocalBounds = function(e, i) {
      i === void 0 && (i = !1);
      var n = r.prototype.getLocalBounds.call(this, e);
      if (!i)
        for (var a = 0, o = this.children.length; a < o; ++a) {
          var s = this.children[a];
          s.visible && s.updateTransform();
        }
      return n;
    }, t.prototype._calculateBounds = function() {
    }, t.prototype._renderWithCulling = function(e) {
      var i = e.renderTexture.sourceFrame;
      if (i.width > 0 && i.height > 0) {
        var n, a;
        if (this.cullArea ? (n = this.cullArea, a = this.worldTransform) : this._render !== t.prototype._render && (n = this.getBounds(!0)), n && i.intersects(n, a))
          this._render(e);
        else if (this.cullArea)
          return;
        for (var o = 0, s = this.children.length; o < s; ++o) {
          var u = this.children[o], h = u.cullable;
          u.cullable = h || !this.cullArea, u.render(e), u.cullable = h;
        }
      }
    }, t.prototype.render = function(e) {
      if (!(!this.visible || this.worldAlpha <= 0 || !this.renderable))
        if (this._mask || this.filters && this.filters.length)
          this.renderAdvanced(e);
        else if (this.cullable)
          this._renderWithCulling(e);
        else {
          this._render(e);
          for (var i = 0, n = this.children.length; i < n; ++i)
            this.children[i].render(e);
        }
    }, t.prototype.renderAdvanced = function(e) {
      var i = this.filters, n = this._mask;
      if (i) {
        this._enabledFilters || (this._enabledFilters = []), this._enabledFilters.length = 0;
        for (var a = 0; a < i.length; a++)
          i[a].enabled && this._enabledFilters.push(i[a]);
      }
      var o = i && this._enabledFilters && this._enabledFilters.length || n && (!n.isMaskData || n.enabled && (n.autoDetect || n.type !== Rt.NONE));
      if (o && e.batch.flush(), i && this._enabledFilters && this._enabledFilters.length && e.filter.push(this, this._enabledFilters), n && e.mask.push(this, this._mask), this.cullable)
        this._renderWithCulling(e);
      else {
        this._render(e);
        for (var a = 0, s = this.children.length; a < s; ++a)
          this.children[a].render(e);
      }
      o && e.batch.flush(), n && e.mask.pop(this), i && this._enabledFilters && this._enabledFilters.length && e.filter.pop();
    }, t.prototype._render = function(e) {
    }, t.prototype.destroy = function(e) {
      r.prototype.destroy.call(this), this.sortDirty = !1;
      var i = typeof e == "boolean" ? e : e && e.children, n = this.removeChildren(0, this.children.length);
      if (i)
        for (var a = 0; a < n.length; ++a)
          n[a].destroy(e);
    }, Object.defineProperty(t.prototype, "width", {
      /** The width of the Container, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return this.scale.x * this.getLocalBounds().width;
      },
      set: function(e) {
        var i = this.getLocalBounds().width;
        i !== 0 ? this.scale.x = e / i : this.scale.x = 1, this._width = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "height", {
      /** The height of the Container, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return this.scale.y * this.getLocalBounds().height;
      },
      set: function(e) {
        var i = this.getLocalBounds().height;
        i !== 0 ? this.scale.y = e / i : this.scale.y = 1, this._height = e;
      },
      enumerable: !1,
      configurable: !0
    }), t;
  }(At)
);
ve.prototype.containerUpdateTransform = ve.prototype.updateTransform;
/*!
 * @pixi/extensions - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/extensions is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Jr = function() {
  return Jr = Object.assign || function(t) {
    for (var e = arguments, i, n = 1, a = arguments.length; n < a; n++) {
      i = e[n];
      for (var o in i)
        Object.prototype.hasOwnProperty.call(i, o) && (t[o] = i[o]);
    }
    return t;
  }, Jr.apply(this, arguments);
}, vt;
(function(r) {
  r.Application = "application", r.RendererPlugin = "renderer-webgl-plugin", r.CanvasRendererPlugin = "renderer-canvas-plugin", r.Loader = "loader", r.LoadParser = "load-parser", r.ResolveParser = "resolve-parser", r.CacheParser = "cache-parser", r.DetectionParser = "detection-parser";
})(vt || (vt = {}));
var zs = function(r) {
  if (typeof r == "function" || typeof r == "object" && r.extension) {
    if (!r.extension)
      throw new Error("Extension class must have an extension object");
    var t = typeof r.extension != "object" ? { type: r.extension } : r.extension;
    r = Jr(Jr({}, t), { ref: r });
  }
  if (typeof r == "object")
    r = Jr({}, r);
  else
    throw new Error("Invalid extension type");
  return typeof r.type == "string" && (r.type = [r.type]), r;
}, Pe = {
  /** @ignore */
  _addHandlers: null,
  /** @ignore */
  _removeHandlers: null,
  /** @ignore */
  _queue: {},
  /**
   * Remove extensions from PixiJS.
   * @param extensions - Extensions to be removed.
   * @returns {PIXI.extensions} For chaining.
   */
  remove: function() {
    for (var r = arguments, t = this, e = [], i = 0; i < arguments.length; i++)
      e[i] = r[i];
    return e.map(zs).forEach(function(n) {
      n.type.forEach(function(a) {
        var o, s;
        return (s = (o = t._removeHandlers)[a]) === null || s === void 0 ? void 0 : s.call(o, n);
      });
    }), this;
  },
  /**
   * Register new extensions with PixiJS.
   * @param extensions - The spread of extensions to add to PixiJS.
   * @returns {PIXI.extensions} For chaining.
   */
  add: function() {
    for (var r = arguments, t = this, e = [], i = 0; i < arguments.length; i++)
      e[i] = r[i];
    return e.map(zs).forEach(function(n) {
      n.type.forEach(function(a) {
        var o = t._addHandlers, s = t._queue;
        o[a] ? o[a](n) : (s[a] = s[a] || [], s[a].push(n));
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
  handle: function(r, t, e) {
    var i = this._addHandlers = this._addHandlers || {}, n = this._removeHandlers = this._removeHandlers || {};
    if (i[r] || n[r])
      throw new Error("Extension type " + r + " already has a handler");
    i[r] = t, n[r] = e;
    var a = this._queue;
    return a[r] && (a[r].forEach(function(o) {
      return t(o);
    }), delete a[r]), this;
  },
  /**
   * Handle a type, but using a map by `name` property.
   * @param type - Type of extension to handle.
   * @param map - The object map of named extensions.
   * @returns {PIXI.extensions} For chaining.
   */
  handleByMap: function(r, t) {
    return this.handle(r, function(e) {
      t[e.name] = e.ref;
    }, function(e) {
      delete t[e.name];
    });
  },
  /**
   * Handle a type, but using a list of extensions.
   * @param type - Type of extension to handle.
   * @param list - The list of extensions.
   * @returns {PIXI.extensions} For chaining.
   */
  handleByList: function(r, t) {
    return this.handle(r, function(e) {
      var i, n;
      t.includes(e.ref) || (t.push(e.ref), r === vt.Loader && ((n = (i = e.ref).add) === null || n === void 0 || n.call(i)));
    }, function(e) {
      var i = t.indexOf(e.ref);
      i !== -1 && t.splice(i, 1);
    });
  }
};
/*!
 * @pixi/runner - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/runner is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var Bt = (
  /** @class */
  function() {
    function r(t) {
      this.items = [], this._name = t, this._aliasCount = 0;
    }
    return r.prototype.emit = function(t, e, i, n, a, o, s, u) {
      if (arguments.length > 8)
        throw new Error("max arguments reached");
      var h = this, l = h.name, f = h.items;
      this._aliasCount++;
      for (var c = 0, d = f.length; c < d; c++)
        f[c][l](t, e, i, n, a, o, s, u);
      return f === this.items && this._aliasCount--, this;
    }, r.prototype.ensureNonAliasedItems = function() {
      this._aliasCount > 0 && this.items.length > 1 && (this._aliasCount = 0, this.items = this.items.slice(0));
    }, r.prototype.add = function(t) {
      return t[this._name] && (this.ensureNonAliasedItems(), this.remove(t), this.items.push(t)), this;
    }, r.prototype.remove = function(t) {
      var e = this.items.indexOf(t);
      return e !== -1 && (this.ensureNonAliasedItems(), this.items.splice(e, 1)), this;
    }, r.prototype.contains = function(t) {
      return this.items.indexOf(t) !== -1;
    }, r.prototype.removeAll = function() {
      return this.ensureNonAliasedItems(), this.items.length = 0, this;
    }, r.prototype.destroy = function() {
      this.removeAll(), this.items = null, this._name = null;
    }, Object.defineProperty(r.prototype, "empty", {
      /**
       * `true` if there are no this Runner contains no listeners
       * @readonly
       */
      get: function() {
        return this.items.length === 0;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "name", {
      /**
       * The name of the runner.
       * @readonly
       */
      get: function() {
        return this._name;
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
);
Object.defineProperties(Bt.prototype, {
  /**
   * Alias for `emit`
   * @memberof PIXI.Runner#
   * @method dispatch
   * @see PIXI.Runner#emit
   */
  dispatch: { value: Bt.prototype.emit },
  /**
   * Alias for `emit`
   * @memberof PIXI.Runner#
   * @method run
   * @see PIXI.Runner#emit
   */
  run: { value: Bt.prototype.emit }
});
/*!
 * @pixi/ticker - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/ticker is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
k.TARGET_FPMS = 0.06;
var we;
(function(r) {
  r[r.INTERACTION = 50] = "INTERACTION", r[r.HIGH = 25] = "HIGH", r[r.NORMAL = 0] = "NORMAL", r[r.LOW = -25] = "LOW", r[r.UTILITY = -50] = "UTILITY";
})(we || (we = {}));
var Yn = (
  /** @class */
  function() {
    function r(t, e, i, n) {
      e === void 0 && (e = null), i === void 0 && (i = 0), n === void 0 && (n = !1), this.next = null, this.previous = null, this._destroyed = !1, this.fn = t, this.context = e, this.priority = i, this.once = n;
    }
    return r.prototype.match = function(t, e) {
      return e === void 0 && (e = null), this.fn === t && this.context === e;
    }, r.prototype.emit = function(t) {
      this.fn && (this.context ? this.fn.call(this.context, t) : this.fn(t));
      var e = this.next;
      return this.once && this.destroy(!0), this._destroyed && (this.next = null), e;
    }, r.prototype.connect = function(t) {
      this.previous = t, t.next && (t.next.previous = this), this.next = t.next, t.next = this;
    }, r.prototype.destroy = function(t) {
      t === void 0 && (t = !1), this._destroyed = !0, this.fn = null, this.context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
      var e = this.next;
      return this.next = t ? null : e, this.previous = null, e;
    }, r;
  }()
), Lt = (
  /** @class */
  function() {
    function r() {
      var t = this;
      this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new Yn(null, null, 1 / 0), this.deltaMS = 1 / k.TARGET_FPMS, this.elapsedMS = 1 / k.TARGET_FPMS, this._tick = function(e) {
        t._requestId = null, t.started && (t.update(e), t.started && t._requestId === null && t._head.next && (t._requestId = requestAnimationFrame(t._tick)));
      };
    }
    return r.prototype._requestIfNeeded = function() {
      this._requestId === null && this._head.next && (this.lastTime = performance.now(), this._lastFrame = this.lastTime, this._requestId = requestAnimationFrame(this._tick));
    }, r.prototype._cancelIfNeeded = function() {
      this._requestId !== null && (cancelAnimationFrame(this._requestId), this._requestId = null);
    }, r.prototype._startIfPossible = function() {
      this.started ? this._requestIfNeeded() : this.autoStart && this.start();
    }, r.prototype.add = function(t, e, i) {
      return i === void 0 && (i = we.NORMAL), this._addListener(new Yn(t, e, i));
    }, r.prototype.addOnce = function(t, e, i) {
      return i === void 0 && (i = we.NORMAL), this._addListener(new Yn(t, e, i, !0));
    }, r.prototype._addListener = function(t) {
      var e = this._head.next, i = this._head;
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
    }, r.prototype.remove = function(t, e) {
      for (var i = this._head.next; i; )
        i.match(t, e) ? i = i.destroy() : i = i.next;
      return this._head.next || this._cancelIfNeeded(), this;
    }, Object.defineProperty(r.prototype, "count", {
      /**
       * The number of listeners on this ticker, calculated by walking through linked list
       * @readonly
       * @member {number}
       */
      get: function() {
        if (!this._head)
          return 0;
        for (var t = 0, e = this._head; e = e.next; )
          t++;
        return t;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.start = function() {
      this.started || (this.started = !0, this._requestIfNeeded());
    }, r.prototype.stop = function() {
      this.started && (this.started = !1, this._cancelIfNeeded());
    }, r.prototype.destroy = function() {
      if (!this._protected) {
        this.stop();
        for (var t = this._head.next; t; )
          t = t.destroy(!0);
        this._head.destroy(), this._head = null;
      }
    }, r.prototype.update = function(t) {
      t === void 0 && (t = performance.now());
      var e;
      if (t > this.lastTime) {
        if (e = this.elapsedMS = t - this.lastTime, e > this._maxElapsedMS && (e = this._maxElapsedMS), e *= this.speed, this._minElapsedMS) {
          var i = t - this._lastFrame | 0;
          if (i < this._minElapsedMS)
            return;
          this._lastFrame = t - i % this._minElapsedMS;
        }
        this.deltaMS = e, this.deltaTime = this.deltaMS * k.TARGET_FPMS;
        for (var n = this._head, a = n.next; a; )
          a = a.emit(this.deltaTime);
        n.next || this._cancelIfNeeded();
      } else
        this.deltaTime = this.deltaMS = this.elapsedMS = 0;
      this.lastTime = t;
    }, Object.defineProperty(r.prototype, "FPS", {
      /**
       * The frames per second at which this ticker is running.
       * The default is approximately 60 in most modern browsers.
       * **Note:** This does not factor in the value of
       * {@link PIXI.Ticker#speed}, which is specific
       * to scaling {@link PIXI.Ticker#deltaTime}.
       * @member {number}
       * @readonly
       */
      get: function() {
        return 1e3 / this.elapsedMS;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "minFPS", {
      /**
       * Manages the maximum amount of milliseconds allowed to
       * elapse between invoking {@link PIXI.Ticker#update}.
       * This value is used to cap {@link PIXI.Ticker#deltaTime},
       * but does not effect the measured value of {@link PIXI.Ticker#FPS}.
       * When setting this property it is clamped to a value between
       * `0` and `PIXI.settings.TARGET_FPMS * 1000`.
       * @member {number}
       * @default 10
       */
      get: function() {
        return 1e3 / this._maxElapsedMS;
      },
      set: function(t) {
        var e = Math.min(this.maxFPS, t), i = Math.min(Math.max(0, e) / 1e3, k.TARGET_FPMS);
        this._maxElapsedMS = 1 / i;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "maxFPS", {
      /**
       * Manages the minimum amount of milliseconds required to
       * elapse between invoking {@link PIXI.Ticker#update}.
       * This will effect the measured value of {@link PIXI.Ticker#FPS}.
       * If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
       * Otherwise it will be at least `minFPS`
       * @member {number}
       * @default 0
       */
      get: function() {
        return this._minElapsedMS ? Math.round(1e3 / this._minElapsedMS) : 0;
      },
      set: function(t) {
        if (t === 0)
          this._minElapsedMS = 0;
        else {
          var e = Math.max(this.minFPS, t);
          this._minElapsedMS = 1 / (e / 1e3);
        }
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "shared", {
      /**
       * The shared ticker instance used by {@link PIXI.AnimatedSprite} and by
       * {@link PIXI.VideoResource} to update animation frames / video textures.
       *
       * It may also be used by {@link PIXI.Application} if created with the `sharedTicker` option property set to true.
       *
       * The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
       * Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.
       * @example
       * let ticker = PIXI.Ticker.shared;
       * // Set this to prevent starting this ticker when listeners are added.
       * // By default this is true only for the PIXI.Ticker.shared instance.
       * ticker.autoStart = false;
       * // FYI, call this to ensure the ticker is stopped. It should be stopped
       * // if you have not attempted to render anything yet.
       * ticker.stop();
       * // Call this when you are ready for a running shared ticker.
       * ticker.start();
       * @example
       * // You may use the shared ticker to render...
       * let renderer = PIXI.autoDetectRenderer();
       * let stage = new PIXI.Container();
       * document.body.appendChild(renderer.view);
       * ticker.add(function (time) {
       *     renderer.render(stage);
       * });
       * @example
       * // Or you can just update it manually.
       * ticker.autoStart = false;
       * ticker.stop();
       * function animate(time) {
       *     ticker.update(time);
       *     renderer.render(stage);
       *     requestAnimationFrame(animate);
       * }
       * animate(performance.now());
       * @member {PIXI.Ticker}
       * @static
       */
      get: function() {
        if (!r._shared) {
          var t = r._shared = new r();
          t.autoStart = !0, t._protected = !0;
        }
        return r._shared;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "system", {
      /**
       * The system ticker instance used by {@link PIXI.InteractionManager} and by
       * {@link PIXI.BasePrepare} for core timing functionality that shouldn't usually need to be paused,
       * unlike the `shared` ticker which drives visual animations and rendering which may want to be paused.
       *
       * The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
       * @member {PIXI.Ticker}
       * @static
       */
      get: function() {
        if (!r._system) {
          var t = r._system = new r();
          t.autoStart = !0, t._protected = !0;
        }
        return r._system;
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
), Sy = (
  /** @class */
  function() {
    function r() {
    }
    return r.init = function(t) {
      var e = this;
      t = Object.assign({
        autoStart: !0,
        sharedTicker: !1
      }, t), Object.defineProperty(this, "ticker", {
        set: function(i) {
          this._ticker && this._ticker.remove(this.render, this), this._ticker = i, i && i.add(this.render, this, we.LOW);
        },
        get: function() {
          return this._ticker;
        }
      }), this.stop = function() {
        e._ticker.stop();
      }, this.start = function() {
        e._ticker.start();
      }, this._ticker = null, this.ticker = t.sharedTicker ? Lt.shared : new Lt(), t.autoStart && this.start();
    }, r.destroy = function() {
      if (this._ticker) {
        var t = this._ticker;
        this.ticker = null, t.destroy();
      }
    }, r.extension = vt.Application, r;
  }()
);
/*!
 * @pixi/core - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/core is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
k.PREFER_ENV = ce.any ? xe.WEBGL : xe.WEBGL2;
k.STRICT_TEXTURE_CACHE = !1;
var Xa = [];
function Hh(r, t) {
  if (!r)
    return null;
  var e = "";
  if (typeof r == "string") {
    var i = /\.(\w{3,4})(?:$|\?|#)/i.exec(r);
    i && (e = i[1].toLowerCase());
  }
  for (var n = Xa.length - 1; n >= 0; --n) {
    var a = Xa[n];
    if (a.test && a.test(r, e))
      return new a(r, t);
  }
  throw new Error("Unrecognized source type to auto-detect Resource");
}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var ja = function(r, t) {
  return ja = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, ja(r, t);
};
function yt(r, t) {
  ja(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
var Va = function() {
  return Va = Object.assign || function(t) {
    for (var e = arguments, i, n = 1, a = arguments.length; n < a; n++) {
      i = e[n];
      for (var o in i)
        Object.prototype.hasOwnProperty.call(i, o) && (t[o] = i[o]);
    }
    return t;
  }, Va.apply(this, arguments);
};
function Py(r, t) {
  var e = {};
  for (var i in r)
    Object.prototype.hasOwnProperty.call(r, i) && t.indexOf(i) < 0 && (e[i] = r[i]);
  if (r != null && typeof Object.getOwnPropertySymbols == "function")
    for (var n = 0, i = Object.getOwnPropertySymbols(r); n < i.length; n++)
      t.indexOf(i[n]) < 0 && Object.prototype.propertyIsEnumerable.call(r, i[n]) && (e[i[n]] = r[i[n]]);
  return e;
}
var oi = (
  /** @class */
  function() {
    function r(t, e) {
      t === void 0 && (t = 0), e === void 0 && (e = 0), this._width = t, this._height = e, this.destroyed = !1, this.internal = !1, this.onResize = new Bt("setRealSize"), this.onUpdate = new Bt("update"), this.onError = new Bt("onError");
    }
    return r.prototype.bind = function(t) {
      this.onResize.add(t), this.onUpdate.add(t), this.onError.add(t), (this._width || this._height) && this.onResize.emit(this._width, this._height);
    }, r.prototype.unbind = function(t) {
      this.onResize.remove(t), this.onUpdate.remove(t), this.onError.remove(t);
    }, r.prototype.resize = function(t, e) {
      (t !== this._width || e !== this._height) && (this._width = t, this._height = e, this.onResize.emit(t, e));
    }, Object.defineProperty(r.prototype, "valid", {
      /**
       * Has been validated
       * @readonly
       */
      get: function() {
        return !!this._width && !!this._height;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.update = function() {
      this.destroyed || this.onUpdate.emit();
    }, r.prototype.load = function() {
      return Promise.resolve(this);
    }, Object.defineProperty(r.prototype, "width", {
      /**
       * The width of the resource.
       * @readonly
       */
      get: function() {
        return this._width;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "height", {
      /**
       * The height of the resource.
       * @readonly
       */
      get: function() {
        return this._height;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.style = function(t, e, i) {
      return !1;
    }, r.prototype.dispose = function() {
    }, r.prototype.destroy = function() {
      this.destroyed || (this.destroyed = !0, this.dispose(), this.onError.removeAll(), this.onError = null, this.onResize.removeAll(), this.onResize = null, this.onUpdate.removeAll(), this.onUpdate = null);
    }, r.test = function(t, e) {
      return !1;
    }, r;
  }()
), di = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e, i) {
      var n = this, a = i || {}, o = a.width, s = a.height;
      if (!o || !s)
        throw new Error("BufferResource width or height invalid");
      return n = r.call(this, o, s) || this, n.data = e, n;
    }
    return t.prototype.upload = function(e, i, n) {
      var a = e.gl;
      a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, i.alphaMode === se.UNPACK);
      var o = i.realWidth, s = i.realHeight;
      return n.width === o && n.height === s ? a.texSubImage2D(i.target, 0, 0, 0, o, s, i.format, n.type, this.data) : (n.width = o, n.height = s, a.texImage2D(i.target, 0, n.internalFormat, o, s, 0, i.format, n.type, this.data)), !0;
    }, t.prototype.dispose = function() {
      this.data = null;
    }, t.test = function(e) {
      return e instanceof Float32Array || e instanceof Uint8Array || e instanceof Uint32Array;
    }, t;
  }(oi)
), Ay = {
  scaleMode: fe.NEAREST,
  format: B.RGBA,
  alphaMode: se.NPM
}, ot = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e, i) {
      e === void 0 && (e = null), i === void 0 && (i = null);
      var n = r.call(this) || this;
      i = i || {};
      var a = i.alphaMode, o = i.mipmap, s = i.anisotropicLevel, u = i.scaleMode, h = i.width, l = i.height, f = i.wrapMode, c = i.format, d = i.type, p = i.target, _ = i.resolution, v = i.resourceOptions;
      return e && !(e instanceof oi) && (e = Hh(e, v), e.internal = !0), n.resolution = _ || k.RESOLUTION, n.width = Math.round((h || 0) * n.resolution) / n.resolution, n.height = Math.round((l || 0) * n.resolution) / n.resolution, n._mipmap = o !== void 0 ? o : k.MIPMAP_TEXTURES, n.anisotropicLevel = s !== void 0 ? s : k.ANISOTROPIC_LEVEL, n._wrapMode = f || k.WRAP_MODE, n._scaleMode = u !== void 0 ? u : k.SCALE_MODE, n.format = c || B.RGBA, n.type = d || V.UNSIGNED_BYTE, n.target = p || tr.TEXTURE_2D, n.alphaMode = a !== void 0 ? a : se.UNPACK, n.uid = ar(), n.touched = 0, n.isPowerOfTwo = !1, n._refreshPOT(), n._glTextures = {}, n.dirtyId = 0, n.dirtyStyleId = 0, n.cacheId = null, n.valid = h > 0 && l > 0, n.textureCacheIds = [], n.destroyed = !1, n.resource = null, n._batchEnabled = 0, n._batchLocation = 0, n.parentTextureArray = null, n.setResource(e), n;
    }
    return Object.defineProperty(t.prototype, "realWidth", {
      /**
       * Pixel width of the source of this texture
       * @readonly
       */
      get: function() {
        return Math.round(this.width * this.resolution);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "realHeight", {
      /**
       * Pixel height of the source of this texture
       * @readonly
       */
      get: function() {
        return Math.round(this.height * this.resolution);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "mipmap", {
      /**
       * Mipmap mode of the texture, affects downscaled images
       * @default PIXI.settings.MIPMAP_TEXTURES
       */
      get: function() {
        return this._mipmap;
      },
      set: function(e) {
        this._mipmap !== e && (this._mipmap = e, this.dirtyStyleId++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "scaleMode", {
      /**
       * The scale mode to apply when scaling this texture
       * @default PIXI.settings.SCALE_MODE
       */
      get: function() {
        return this._scaleMode;
      },
      set: function(e) {
        this._scaleMode !== e && (this._scaleMode = e, this.dirtyStyleId++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "wrapMode", {
      /**
       * How the texture wraps
       * @default PIXI.settings.WRAP_MODE
       */
      get: function() {
        return this._wrapMode;
      },
      set: function(e) {
        this._wrapMode !== e && (this._wrapMode = e, this.dirtyStyleId++);
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.setStyle = function(e, i) {
      var n;
      return e !== void 0 && e !== this.scaleMode && (this.scaleMode = e, n = !0), i !== void 0 && i !== this.mipmap && (this.mipmap = i, n = !0), n && this.dirtyStyleId++, this;
    }, t.prototype.setSize = function(e, i, n) {
      return n = n || this.resolution, this.setRealSize(e * n, i * n, n);
    }, t.prototype.setRealSize = function(e, i, n) {
      return this.resolution = n || this.resolution, this.width = Math.round(e) / this.resolution, this.height = Math.round(i) / this.resolution, this._refreshPOT(), this.update(), this;
    }, t.prototype._refreshPOT = function() {
      this.isPowerOfTwo = ks(this.realWidth) && ks(this.realHeight);
    }, t.prototype.setResolution = function(e) {
      var i = this.resolution;
      return i === e ? this : (this.resolution = e, this.valid && (this.width = Math.round(this.width * i) / e, this.height = Math.round(this.height * i) / e, this.emit("update", this)), this._refreshPOT(), this);
    }, t.prototype.setResource = function(e) {
      if (this.resource === e)
        return this;
      if (this.resource)
        throw new Error("Resource can be set only once");
      return e.bind(this), this.resource = e, this;
    }, t.prototype.update = function() {
      this.valid ? (this.dirtyId++, this.dirtyStyleId++, this.emit("update", this)) : this.width > 0 && this.height > 0 && (this.valid = !0, this.emit("loaded", this), this.emit("update", this));
    }, t.prototype.onError = function(e) {
      this.emit("error", this, e);
    }, t.prototype.destroy = function() {
      this.resource && (this.resource.unbind(this), this.resource.internal && this.resource.destroy(), this.resource = null), this.cacheId && (delete He[this.cacheId], delete me[this.cacheId], this.cacheId = null), this.dispose(), t.removeFromCache(this), this.textureCacheIds = null, this.destroyed = !0;
    }, t.prototype.dispose = function() {
      this.emit("dispose", this);
    }, t.prototype.castToBaseTexture = function() {
      return this;
    }, t.from = function(e, i, n) {
      n === void 0 && (n = k.STRICT_TEXTURE_CACHE);
      var a = typeof e == "string", o = null;
      if (a)
        o = e;
      else {
        if (!e._pixiId) {
          var s = i && i.pixiIdPrefix || "pixiid";
          e._pixiId = s + "_" + ar();
        }
        o = e._pixiId;
      }
      var u = He[o];
      if (a && n && !u)
        throw new Error('The cacheId "' + o + '" does not exist in BaseTextureCache.');
      return u || (u = new t(e, i), u.cacheId = o, t.addToCache(u, o)), u;
    }, t.fromBuffer = function(e, i, n, a) {
      e = e || new Float32Array(i * n * 4);
      var o = new di(e, { width: i, height: n }), s = e instanceof Float32Array ? V.FLOAT : V.UNSIGNED_BYTE;
      return new t(o, Object.assign({}, Ay, a || { width: i, height: n, type: s }));
    }, t.addToCache = function(e, i) {
      i && (e.textureCacheIds.indexOf(i) === -1 && e.textureCacheIds.push(i), He[i] && console.warn("BaseTexture added to the cache with an id [" + i + "] that already had an entry"), He[i] = e);
    }, t.removeFromCache = function(e) {
      if (typeof e == "string") {
        var i = He[e];
        if (i) {
          var n = i.textureCacheIds.indexOf(e);
          return n > -1 && i.textureCacheIds.splice(n, 1), delete He[e], i;
        }
      } else if (e && e.textureCacheIds) {
        for (var a = 0; a < e.textureCacheIds.length; ++a)
          delete He[e.textureCacheIds[a]];
        return e.textureCacheIds.length = 0, e;
      }
      return null;
    }, t._globalBatch = 0, t;
  }(fi)
), Xh = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e, i) {
      var n = this, a = i || {}, o = a.width, s = a.height;
      n = r.call(this, o, s) || this, n.items = [], n.itemDirtyIds = [];
      for (var u = 0; u < e; u++) {
        var h = new ot();
        n.items.push(h), n.itemDirtyIds.push(-2);
      }
      return n.length = e, n._load = null, n.baseTexture = null, n;
    }
    return t.prototype.initFromArray = function(e, i) {
      for (var n = 0; n < this.length; n++)
        e[n] && (e[n].castToBaseTexture ? this.addBaseTextureAt(e[n].castToBaseTexture(), n) : e[n] instanceof oi ? this.addResourceAt(e[n], n) : this.addResourceAt(Hh(e[n], i), n));
    }, t.prototype.dispose = function() {
      for (var e = 0, i = this.length; e < i; e++)
        this.items[e].destroy();
      this.items = null, this.itemDirtyIds = null, this._load = null;
    }, t.prototype.addResourceAt = function(e, i) {
      if (!this.items[i])
        throw new Error("Index " + i + " is out of bounds");
      return e.valid && !this.valid && this.resize(e.width, e.height), this.items[i].setResource(e), this;
    }, t.prototype.bind = function(e) {
      if (this.baseTexture !== null)
        throw new Error("Only one base texture per TextureArray is allowed");
      r.prototype.bind.call(this, e);
      for (var i = 0; i < this.length; i++)
        this.items[i].parentTextureArray = e, this.items[i].on("update", e.update, e);
    }, t.prototype.unbind = function(e) {
      r.prototype.unbind.call(this, e);
      for (var i = 0; i < this.length; i++)
        this.items[i].parentTextureArray = null, this.items[i].off("update", e.update, e);
    }, t.prototype.load = function() {
      var e = this;
      if (this._load)
        return this._load;
      var i = this.items.map(function(a) {
        return a.resource;
      }).filter(function(a) {
        return a;
      }), n = i.map(function(a) {
        return a.load();
      });
      return this._load = Promise.all(n).then(function() {
        var a = e.items[0], o = a.realWidth, s = a.realHeight;
        return e.resize(o, s), Promise.resolve(e);
      }), this._load;
    }, t;
  }(oi)
), Ry = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e, i) {
      var n = this, a = i || {}, o = a.width, s = a.height, u, h;
      return Array.isArray(e) ? (u = e, h = e.length) : h = e, n = r.call(this, h, { width: o, height: s }) || this, u && n.initFromArray(u, i), n;
    }
    return t.prototype.addBaseTextureAt = function(e, i) {
      if (e.resource)
        this.addResourceAt(e.resource, i);
      else
        throw new Error("ArrayResource does not support RenderTexture");
      return this;
    }, t.prototype.bind = function(e) {
      r.prototype.bind.call(this, e), e.target = tr.TEXTURE_2D_ARRAY;
    }, t.prototype.upload = function(e, i, n) {
      var a = this, o = a.length, s = a.itemDirtyIds, u = a.items, h = e.gl;
      n.dirtyId < 0 && h.texImage3D(h.TEXTURE_2D_ARRAY, 0, n.internalFormat, this._width, this._height, o, 0, i.format, n.type, null);
      for (var l = 0; l < o; l++) {
        var f = u[l];
        s[l] < f.dirtyId && (s[l] = f.dirtyId, f.valid && h.texSubImage3D(
          h.TEXTURE_2D_ARRAY,
          0,
          0,
          // xoffset
          0,
          // yoffset
          l,
          // zoffset
          f.resource.width,
          f.resource.height,
          1,
          i.format,
          n.type,
          f.resource.source
        ));
      }
      return !0;
    }, t;
  }(Xh)
), Be = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e) {
      var i = this, n = e, a = n.naturalWidth || n.videoWidth || n.width, o = n.naturalHeight || n.videoHeight || n.height;
      return i = r.call(this, a, o) || this, i.source = e, i.noSubImage = !1, i;
    }
    return t.crossOrigin = function(e, i, n) {
      n === void 0 && i.indexOf("data:") !== 0 ? e.crossOrigin = yy(i) : n !== !1 && (e.crossOrigin = typeof n == "string" ? n : "anonymous");
    }, t.prototype.upload = function(e, i, n, a) {
      var o = e.gl, s = i.realWidth, u = i.realHeight;
      if (a = a || this.source, a instanceof HTMLImageElement) {
        if (!a.complete || a.naturalWidth === 0)
          return !1;
      } else if (a instanceof HTMLVideoElement && a.readyState <= 1)
        return !1;
      return o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL, i.alphaMode === se.UNPACK), !this.noSubImage && i.target === o.TEXTURE_2D && n.width === s && n.height === u ? o.texSubImage2D(o.TEXTURE_2D, 0, 0, 0, i.format, n.type, a) : (n.width = s, n.height = u, o.texImage2D(i.target, 0, n.internalFormat, i.format, n.type, a)), !0;
    }, t.prototype.update = function() {
      if (!this.destroyed) {
        var e = this.source, i = e.naturalWidth || e.videoWidth || e.width, n = e.naturalHeight || e.videoHeight || e.height;
        this.resize(i, n), r.prototype.update.call(this);
      }
    }, t.prototype.dispose = function() {
      this.source = null;
    }, t;
  }(oi)
), Oy = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e) {
      return r.call(this, e) || this;
    }
    return t.test = function(e) {
      var i = globalThis.OffscreenCanvas;
      return i && e instanceof i ? !0 : globalThis.HTMLCanvasElement && e instanceof HTMLCanvasElement;
    }, t;
  }(Be)
), Iy = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e, i) {
      var n = this, a = i || {}, o = a.width, s = a.height, u = a.autoLoad, h = a.linkBaseTexture;
      if (e && e.length !== t.SIDES)
        throw new Error("Invalid length. Got " + e.length + ", expected 6");
      n = r.call(this, 6, { width: o, height: s }) || this;
      for (var l = 0; l < t.SIDES; l++)
        n.items[l].target = tr.TEXTURE_CUBE_MAP_POSITIVE_X + l;
      return n.linkBaseTexture = h !== !1, e && n.initFromArray(e, i), u !== !1 && n.load(), n;
    }
    return t.prototype.bind = function(e) {
      r.prototype.bind.call(this, e), e.target = tr.TEXTURE_CUBE_MAP;
    }, t.prototype.addBaseTextureAt = function(e, i, n) {
      if (!this.items[i])
        throw new Error("Index " + i + " is out of bounds");
      if (!this.linkBaseTexture || e.parentTextureArray || Object.keys(e._glTextures).length > 0)
        if (e.resource)
          this.addResourceAt(e.resource, i);
        else
          throw new Error("CubeResource does not support copying of renderTexture.");
      else
        e.target = tr.TEXTURE_CUBE_MAP_POSITIVE_X + i, e.parentTextureArray = this.baseTexture, this.items[i] = e;
      return e.valid && !this.valid && this.resize(e.realWidth, e.realHeight), this.items[i] = e, this;
    }, t.prototype.upload = function(e, i, n) {
      for (var a = this.itemDirtyIds, o = 0; o < t.SIDES; o++) {
        var s = this.items[o];
        (a[o] < s.dirtyId || n.dirtyId < i.dirtyId) && (s.valid && s.resource ? (s.resource.upload(e, s, n), a[o] = s.dirtyId) : a[o] < -1 && (e.gl.texImage2D(s.target, 0, n.internalFormat, i.realWidth, i.realHeight, 0, i.format, n.type, null), a[o] = -1));
      }
      return !0;
    }, t.test = function(e) {
      return Array.isArray(e) && e.length === t.SIDES;
    }, t.SIDES = 6, t;
  }(Xh)
), jh = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e, i) {
      var n = this;
      if (i = i || {}, !(e instanceof HTMLImageElement)) {
        var a = new Image();
        Be.crossOrigin(a, e, i.crossorigin), a.src = e, e = a;
      }
      return n = r.call(this, e) || this, !e.complete && n._width && n._height && (n._width = 0, n._height = 0), n.url = e.src, n._process = null, n.preserveBitmap = !1, n.createBitmap = (i.createBitmap !== void 0 ? i.createBitmap : k.CREATE_IMAGE_BITMAP) && !!globalThis.createImageBitmap, n.alphaMode = typeof i.alphaMode == "number" ? i.alphaMode : null, n.bitmap = null, n._load = null, i.autoLoad !== !1 && n.load(), n;
    }
    return t.prototype.load = function(e) {
      var i = this;
      return this._load ? this._load : (e !== void 0 && (this.createBitmap = e), this._load = new Promise(function(n, a) {
        var o = i.source;
        i.url = o.src;
        var s = function() {
          i.destroyed || (o.onload = null, o.onerror = null, i.resize(o.width, o.height), i._load = null, i.createBitmap ? n(i.process()) : n(i));
        };
        o.complete && o.src ? s() : (o.onload = s, o.onerror = function(u) {
          a(u), i.onError.emit(u);
        });
      }), this._load);
    }, t.prototype.process = function() {
      var e = this, i = this.source;
      if (this._process !== null)
        return this._process;
      if (this.bitmap !== null || !globalThis.createImageBitmap)
        return Promise.resolve(this);
      var n = globalThis.createImageBitmap, a = !i.crossOrigin || i.crossOrigin === "anonymous";
      return this._process = fetch(i.src, {
        mode: a ? "cors" : "no-cors"
      }).then(function(o) {
        return o.blob();
      }).then(function(o) {
        return n(o, 0, 0, i.width, i.height, {
          premultiplyAlpha: e.alphaMode === null || e.alphaMode === se.UNPACK ? "premultiply" : "none"
        });
      }).then(function(o) {
        return e.destroyed ? Promise.reject() : (e.bitmap = o, e.update(), e._process = null, Promise.resolve(e));
      }), this._process;
    }, t.prototype.upload = function(e, i, n) {
      if (typeof this.alphaMode == "number" && (i.alphaMode = this.alphaMode), !this.createBitmap)
        return r.prototype.upload.call(this, e, i, n);
      if (!this.bitmap && (this.process(), !this.bitmap))
        return !1;
      if (r.prototype.upload.call(this, e, i, n, this.bitmap), !this.preserveBitmap) {
        var a = !0, o = i._glTextures;
        for (var s in o) {
          var u = o[s];
          if (u !== n && u.dirtyId !== i.dirtyId) {
            a = !1;
            break;
          }
        }
        a && (this.bitmap.close && this.bitmap.close(), this.bitmap = null);
      }
      return !0;
    }, t.prototype.dispose = function() {
      this.source.onload = null, this.source.onerror = null, r.prototype.dispose.call(this), this.bitmap && (this.bitmap.close(), this.bitmap = null), this._process = null, this._load = null;
    }, t.test = function(e) {
      return typeof e == "string" || e instanceof HTMLImageElement;
    }, t;
  }(Be)
), Cy = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e, i) {
      var n = this;
      return i = i || {}, n = r.call(this, k.ADAPTER.createCanvas()) || this, n._width = 0, n._height = 0, n.svg = e, n.scale = i.scale || 1, n._overrideWidth = i.width, n._overrideHeight = i.height, n._resolve = null, n._crossorigin = i.crossorigin, n._load = null, i.autoLoad !== !1 && n.load(), n;
    }
    return t.prototype.load = function() {
      var e = this;
      return this._load ? this._load : (this._load = new Promise(function(i) {
        if (e._resolve = function() {
          e.resize(e.source.width, e.source.height), i(e);
        }, t.SVG_XML.test(e.svg.trim())) {
          if (!btoa)
            throw new Error("Your browser doesn't support base64 conversions.");
          e.svg = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(e.svg)));
        }
        e._loadSvg();
      }), this._load);
    }, t.prototype._loadSvg = function() {
      var e = this, i = new Image();
      Be.crossOrigin(i, this.svg, this._crossorigin), i.src = this.svg, i.onerror = function(n) {
        e._resolve && (i.onerror = null, e.onError.emit(n));
      }, i.onload = function() {
        if (e._resolve) {
          var n = i.width, a = i.height;
          if (!n || !a)
            throw new Error("The SVG image must have width and height defined (in pixels), canvas API needs them.");
          var o = n * e.scale, s = a * e.scale;
          (e._overrideWidth || e._overrideHeight) && (o = e._overrideWidth || e._overrideHeight / a * n, s = e._overrideHeight || e._overrideWidth / n * a), o = Math.round(o), s = Math.round(s);
          var u = e.source;
          u.width = o, u.height = s, u._pixiId = "canvas_" + ar(), u.getContext("2d").drawImage(i, 0, 0, n, a, 0, 0, o, s), e._resolve(), e._resolve = null;
        }
      };
    }, t.getSize = function(e) {
      var i = t.SVG_SIZE.exec(e), n = {};
      return i && (n[i[1]] = Math.round(parseFloat(i[3])), n[i[5]] = Math.round(parseFloat(i[7]))), n;
    }, t.prototype.dispose = function() {
      r.prototype.dispose.call(this), this._resolve = null, this._crossorigin = null;
    }, t.test = function(e, i) {
      return i === "svg" || typeof e == "string" && e.startsWith("data:image/svg+xml") || typeof e == "string" && t.SVG_XML.test(e);
    }, t.SVG_XML = /^(<\?xml[^?]+\?>)?\s*(<!--[^(-->)]*-->)?\s*\<svg/m, t.SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i, t;
  }(Be)
), My = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e, i) {
      var n = this;
      if (i = i || {}, !(e instanceof HTMLVideoElement)) {
        var a = document.createElement("video");
        a.setAttribute("preload", "auto"), a.setAttribute("webkit-playsinline", ""), a.setAttribute("playsinline", ""), typeof e == "string" && (e = [e]);
        var o = e[0].src || e[0];
        Be.crossOrigin(a, o, i.crossorigin);
        for (var s = 0; s < e.length; ++s) {
          var u = document.createElement("source"), h = e[s], l = h.src, f = h.mime;
          l = l || e[s];
          var c = l.split("?").shift().toLowerCase(), d = c.slice(c.lastIndexOf(".") + 1);
          f = f || t.MIME_TYPES[d] || "video/" + d, u.src = l, u.type = f, a.appendChild(u);
        }
        e = a;
      }
      return n = r.call(this, e) || this, n.noSubImage = !0, n._autoUpdate = !0, n._isConnectedToTicker = !1, n._updateFPS = i.updateFPS || 0, n._msToNextUpdate = 0, n.autoPlay = i.autoPlay !== !1, n._load = null, n._resolve = null, n._onCanPlay = n._onCanPlay.bind(n), n._onError = n._onError.bind(n), i.autoLoad !== !1 && n.load(), n;
    }
    return t.prototype.update = function(e) {
      if (!this.destroyed) {
        var i = Lt.shared.elapsedMS * this.source.playbackRate;
        this._msToNextUpdate = Math.floor(this._msToNextUpdate - i), (!this._updateFPS || this._msToNextUpdate <= 0) && (r.prototype.update.call(this), this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0);
      }
    }, t.prototype.load = function() {
      var e = this;
      if (this._load)
        return this._load;
      var i = this.source;
      return (i.readyState === i.HAVE_ENOUGH_DATA || i.readyState === i.HAVE_FUTURE_DATA) && i.width && i.height && (i.complete = !0), i.addEventListener("play", this._onPlayStart.bind(this)), i.addEventListener("pause", this._onPlayStop.bind(this)), this._isSourceReady() ? this._onCanPlay() : (i.addEventListener("canplay", this._onCanPlay), i.addEventListener("canplaythrough", this._onCanPlay), i.addEventListener("error", this._onError, !0)), this._load = new Promise(function(n) {
        e.valid ? n(e) : (e._resolve = n, i.load());
      }), this._load;
    }, t.prototype._onError = function(e) {
      this.source.removeEventListener("error", this._onError, !0), this.onError.emit(e);
    }, t.prototype._isSourcePlaying = function() {
      var e = this.source;
      return !e.paused && !e.ended && this._isSourceReady();
    }, t.prototype._isSourceReady = function() {
      var e = this.source;
      return e.readyState > 2;
    }, t.prototype._onPlayStart = function() {
      this.valid || this._onCanPlay(), this.autoUpdate && !this._isConnectedToTicker && (Lt.shared.add(this.update, this), this._isConnectedToTicker = !0);
    }, t.prototype._onPlayStop = function() {
      this._isConnectedToTicker && (Lt.shared.remove(this.update, this), this._isConnectedToTicker = !1);
    }, t.prototype._onCanPlay = function() {
      var e = this.source;
      e.removeEventListener("canplay", this._onCanPlay), e.removeEventListener("canplaythrough", this._onCanPlay);
      var i = this.valid;
      this.resize(e.videoWidth, e.videoHeight), !i && this._resolve && (this._resolve(this), this._resolve = null), this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && e.play();
    }, t.prototype.dispose = function() {
      this._isConnectedToTicker && (Lt.shared.remove(this.update, this), this._isConnectedToTicker = !1);
      var e = this.source;
      e && (e.removeEventListener("error", this._onError, !0), e.pause(), e.src = "", e.load()), r.prototype.dispose.call(this);
    }, Object.defineProperty(t.prototype, "autoUpdate", {
      /** Should the base texture automatically update itself, set to true by default. */
      get: function() {
        return this._autoUpdate;
      },
      set: function(e) {
        e !== this._autoUpdate && (this._autoUpdate = e, !this._autoUpdate && this._isConnectedToTicker ? (Lt.shared.remove(this.update, this), this._isConnectedToTicker = !1) : this._autoUpdate && !this._isConnectedToTicker && this._isSourcePlaying() && (Lt.shared.add(this.update, this), this._isConnectedToTicker = !0));
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "updateFPS", {
      /**
       * How many times a second to update the texture from the video. Leave at 0 to update at every render.
       * A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.
       */
      get: function() {
        return this._updateFPS;
      },
      set: function(e) {
        e !== this._updateFPS && (this._updateFPS = e);
      },
      enumerable: !1,
      configurable: !0
    }), t.test = function(e, i) {
      return globalThis.HTMLVideoElement && e instanceof HTMLVideoElement || t.TYPES.indexOf(i) > -1;
    }, t.TYPES = ["mp4", "m4v", "webm", "ogg", "ogv", "h264", "avi", "mov"], t.MIME_TYPES = {
      ogv: "video/ogg",
      mov: "video/quicktime",
      m4v: "video/mp4"
    }, t;
  }(Be)
), Dy = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e) {
      return r.call(this, e) || this;
    }
    return t.test = function(e) {
      return !!globalThis.createImageBitmap && typeof ImageBitmap < "u" && e instanceof ImageBitmap;
    }, t;
  }(Be)
);
Xa.push(jh, Dy, Oy, My, Cy, di, Iy, Ry);
var Fy = (
  /** @class */
  function(r) {
    yt(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.prototype.upload = function(e, i, n) {
      var a = e.gl;
      a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, i.alphaMode === se.UNPACK);
      var o = i.realWidth, s = i.realHeight;
      return n.width === o && n.height === s ? a.texSubImage2D(i.target, 0, 0, 0, o, s, i.format, n.type, this.data) : (n.width = o, n.height = s, a.texImage2D(i.target, 0, n.internalFormat, o, s, 0, i.format, n.type, this.data)), !0;
    }, t;
  }(di)
), za = (
  /** @class */
  function() {
    function r(t, e) {
      this.width = Math.round(t || 100), this.height = Math.round(e || 100), this.stencil = !1, this.depth = !1, this.dirtyId = 0, this.dirtyFormat = 0, this.dirtySize = 0, this.depthTexture = null, this.colorTextures = [], this.glFramebuffers = {}, this.disposeRunner = new Bt("disposeFramebuffer"), this.multisample = bt.NONE;
    }
    return Object.defineProperty(r.prototype, "colorTexture", {
      /**
       * Reference to the colorTexture.
       * @readonly
       */
      get: function() {
        return this.colorTextures[0];
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.addColorTexture = function(t, e) {
      return t === void 0 && (t = 0), this.colorTextures[t] = e || new ot(null, {
        scaleMode: fe.NEAREST,
        resolution: 1,
        mipmap: oe.OFF,
        width: this.width,
        height: this.height
      }), this.dirtyId++, this.dirtyFormat++, this;
    }, r.prototype.addDepthTexture = function(t) {
      return this.depthTexture = t || new ot(new Fy(null, { width: this.width, height: this.height }), {
        scaleMode: fe.NEAREST,
        resolution: 1,
        width: this.width,
        height: this.height,
        mipmap: oe.OFF,
        format: B.DEPTH_COMPONENT,
        type: V.UNSIGNED_SHORT
      }), this.dirtyId++, this.dirtyFormat++, this;
    }, r.prototype.enableDepth = function() {
      return this.depth = !0, this.dirtyId++, this.dirtyFormat++, this;
    }, r.prototype.enableStencil = function() {
      return this.stencil = !0, this.dirtyId++, this.dirtyFormat++, this;
    }, r.prototype.resize = function(t, e) {
      if (t = Math.round(t), e = Math.round(e), !(t === this.width && e === this.height)) {
        this.width = t, this.height = e, this.dirtyId++, this.dirtySize++;
        for (var i = 0; i < this.colorTextures.length; i++) {
          var n = this.colorTextures[i], a = n.resolution;
          n.setSize(t / a, e / a);
        }
        if (this.depthTexture) {
          var a = this.depthTexture.resolution;
          this.depthTexture.setSize(t / a, e / a);
        }
      }
    }, r.prototype.dispose = function() {
      this.disposeRunner.emit(this, !1);
    }, r.prototype.destroyDepthTexture = function() {
      this.depthTexture && (this.depthTexture.destroy(), this.depthTexture = null, ++this.dirtyId, ++this.dirtyFormat);
    }, r;
  }()
), Vh = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e) {
      e === void 0 && (e = {});
      var i = this;
      if (typeof e == "number") {
        var n = arguments[0], a = arguments[1], o = arguments[2], s = arguments[3];
        e = { width: n, height: a, scaleMode: o, resolution: s };
      }
      return e.width = e.width || 100, e.height = e.height || 100, e.multisample = e.multisample !== void 0 ? e.multisample : bt.NONE, i = r.call(this, null, e) || this, i.mipmap = oe.OFF, i.valid = !0, i.clearColor = [0, 0, 0, 0], i.framebuffer = new za(i.realWidth, i.realHeight).addColorTexture(0, i), i.framebuffer.multisample = e.multisample, i.maskStack = [], i.filterStack = [{}], i;
    }
    return t.prototype.resize = function(e, i) {
      this.framebuffer.resize(e * this.resolution, i * this.resolution), this.setRealSize(this.framebuffer.width, this.framebuffer.height);
    }, t.prototype.dispose = function() {
      this.framebuffer.dispose(), r.prototype.dispose.call(this);
    }, t.prototype.destroy = function() {
      r.prototype.destroy.call(this), this.framebuffer.destroyDepthTexture(), this.framebuffer = null;
    }, t;
  }(ot)
), zh = (
  /** @class */
  function() {
    function r() {
      this.x0 = 0, this.y0 = 0, this.x1 = 1, this.y1 = 0, this.x2 = 1, this.y2 = 1, this.x3 = 0, this.y3 = 1, this.uvsFloat32 = new Float32Array(8);
    }
    return r.prototype.set = function(t, e, i) {
      var n = e.width, a = e.height;
      if (i) {
        var o = t.width / 2 / n, s = t.height / 2 / a, u = t.x / n + o, h = t.y / a + s;
        i = Et.add(i, Et.NW), this.x0 = u + o * Et.uX(i), this.y0 = h + s * Et.uY(i), i = Et.add(i, 2), this.x1 = u + o * Et.uX(i), this.y1 = h + s * Et.uY(i), i = Et.add(i, 2), this.x2 = u + o * Et.uX(i), this.y2 = h + s * Et.uY(i), i = Et.add(i, 2), this.x3 = u + o * Et.uX(i), this.y3 = h + s * Et.uY(i);
      } else
        this.x0 = t.x / n, this.y0 = t.y / a, this.x1 = (t.x + t.width) / n, this.y1 = t.y / a, this.x2 = (t.x + t.width) / n, this.y2 = (t.y + t.height) / a, this.x3 = t.x / n, this.y3 = (t.y + t.height) / a;
      this.uvsFloat32[0] = this.x0, this.uvsFloat32[1] = this.y0, this.uvsFloat32[2] = this.x1, this.uvsFloat32[3] = this.y1, this.uvsFloat32[4] = this.x2, this.uvsFloat32[5] = this.y2, this.uvsFloat32[6] = this.x3, this.uvsFloat32[7] = this.y3;
    }, r.prototype.toString = function() {
      return "[@pixi/core:TextureUvs " + ("x0=" + this.x0 + " y0=" + this.y0 + " ") + ("x1=" + this.x1 + " y1=" + this.y1 + " x2=" + this.x2 + " ") + ("y2=" + this.y2 + " x3=" + this.x3 + " y3=" + this.y3) + "]";
    }, r;
  }()
), Ws = new zh();
function Ri(r) {
  r.destroy = function() {
  }, r.on = function() {
  }, r.once = function() {
  }, r.emit = function() {
  };
}
var K = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e, i, n, a, o, s) {
      var u = r.call(this) || this;
      if (u.noFrame = !1, i || (u.noFrame = !0, i = new st(0, 0, 1, 1)), e instanceof t && (e = e.baseTexture), u.baseTexture = e, u._frame = i, u.trim = a, u.valid = !1, u._uvs = Ws, u.uvMatrix = null, u.orig = n || i, u._rotate = Number(o || 0), o === !0)
        u._rotate = 2;
      else if (u._rotate % 2 !== 0)
        throw new Error("attempt to use diamond-shaped UVs. If you are sure, set rotation manually");
      return u.defaultAnchor = s ? new gt(s.x, s.y) : new gt(0, 0), u._updateID = 0, u.textureCacheIds = [], e.valid ? u.noFrame ? e.valid && u.onBaseTextureUpdated(e) : u.frame = i : e.once("loaded", u.onBaseTextureUpdated, u), u.noFrame && e.on("update", u.onBaseTextureUpdated, u), u;
    }
    return t.prototype.update = function() {
      this.baseTexture.resource && this.baseTexture.resource.update();
    }, t.prototype.onBaseTextureUpdated = function(e) {
      if (this.noFrame) {
        if (!this.baseTexture.valid)
          return;
        this._frame.width = e.width, this._frame.height = e.height, this.valid = !0, this.updateUvs();
      } else
        this.frame = this._frame;
      this.emit("update", this);
    }, t.prototype.destroy = function(e) {
      if (this.baseTexture) {
        if (e) {
          var i = this.baseTexture.resource;
          i && i.url && me[i.url] && t.removeFromCache(i.url), this.baseTexture.destroy();
        }
        this.baseTexture.off("loaded", this.onBaseTextureUpdated, this), this.baseTexture.off("update", this.onBaseTextureUpdated, this), this.baseTexture = null;
      }
      this._frame = null, this._uvs = null, this.trim = null, this.orig = null, this.valid = !1, t.removeFromCache(this), this.textureCacheIds = null;
    }, t.prototype.clone = function() {
      var e = this._frame.clone(), i = this._frame === this.orig ? e : this.orig.clone(), n = new t(this.baseTexture, !this.noFrame && e, i, this.trim && this.trim.clone(), this.rotate, this.defaultAnchor);
      return this.noFrame && (n._frame = e), n;
    }, t.prototype.updateUvs = function() {
      this._uvs === Ws && (this._uvs = new zh()), this._uvs.set(this._frame, this.baseTexture, this.rotate), this._updateID++;
    }, t.from = function(e, i, n) {
      i === void 0 && (i = {}), n === void 0 && (n = k.STRICT_TEXTURE_CACHE);
      var a = typeof e == "string", o = null;
      if (a)
        o = e;
      else if (e instanceof ot) {
        if (!e.cacheId) {
          var s = i && i.pixiIdPrefix || "pixiid";
          e.cacheId = s + "-" + ar(), ot.addToCache(e, e.cacheId);
        }
        o = e.cacheId;
      } else {
        if (!e._pixiId) {
          var s = i && i.pixiIdPrefix || "pixiid";
          e._pixiId = s + "_" + ar();
        }
        o = e._pixiId;
      }
      var u = me[o];
      if (a && n && !u)
        throw new Error('The cacheId "' + o + '" does not exist in TextureCache.');
      return !u && !(e instanceof ot) ? (i.resolution || (i.resolution = dn(e)), u = new t(new ot(e, i)), u.baseTexture.cacheId = o, ot.addToCache(u.baseTexture, o), t.addToCache(u, o)) : !u && e instanceof ot && (u = new t(e), t.addToCache(u, o)), u;
    }, t.fromURL = function(e, i) {
      var n = Object.assign({ autoLoad: !1 }, i == null ? void 0 : i.resourceOptions), a = t.from(e, Object.assign({ resourceOptions: n }, i), !1), o = a.baseTexture.resource;
      return a.baseTexture.valid ? Promise.resolve(a) : o.load().then(function() {
        return Promise.resolve(a);
      });
    }, t.fromBuffer = function(e, i, n, a) {
      return new t(ot.fromBuffer(e, i, n, a));
    }, t.fromLoader = function(e, i, n, a) {
      var o = new ot(e, Object.assign({
        scaleMode: k.SCALE_MODE,
        resolution: dn(i)
      }, a)), s = o.resource;
      s instanceof jh && (s.url = i);
      var u = new t(o);
      return n || (n = i), ot.addToCache(u.baseTexture, n), t.addToCache(u, n), n !== i && (ot.addToCache(u.baseTexture, i), t.addToCache(u, i)), u.baseTexture.valid ? Promise.resolve(u) : new Promise(function(h) {
        u.baseTexture.once("loaded", function() {
          return h(u);
        });
      });
    }, t.addToCache = function(e, i) {
      i && (e.textureCacheIds.indexOf(i) === -1 && e.textureCacheIds.push(i), me[i] && console.warn("Texture added to the cache with an id [" + i + "] that already had an entry"), me[i] = e);
    }, t.removeFromCache = function(e) {
      if (typeof e == "string") {
        var i = me[e];
        if (i) {
          var n = i.textureCacheIds.indexOf(e);
          return n > -1 && i.textureCacheIds.splice(n, 1), delete me[e], i;
        }
      } else if (e && e.textureCacheIds) {
        for (var a = 0; a < e.textureCacheIds.length; ++a)
          me[e.textureCacheIds[a]] === e && delete me[e.textureCacheIds[a]];
        return e.textureCacheIds.length = 0, e;
      }
      return null;
    }, Object.defineProperty(t.prototype, "resolution", {
      /**
       * Returns resolution of baseTexture
       * @readonly
       */
      get: function() {
        return this.baseTexture.resolution;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "frame", {
      /**
       * The frame specifies the region of the base texture that this texture uses.
       * Please call `updateUvs()` after you change coordinates of `frame` manually.
       */
      get: function() {
        return this._frame;
      },
      set: function(e) {
        this._frame = e, this.noFrame = !1;
        var i = e.x, n = e.y, a = e.width, o = e.height, s = i + a > this.baseTexture.width, u = n + o > this.baseTexture.height;
        if (s || u) {
          var h = s && u ? "and" : "or", l = "X: " + i + " + " + a + " = " + (i + a) + " > " + this.baseTexture.width, f = "Y: " + n + " + " + o + " = " + (n + o) + " > " + this.baseTexture.height;
          throw new Error("Texture Error: frame does not fit inside the base Texture dimensions: " + (l + " " + h + " " + f));
        }
        this.valid = a && o && this.baseTexture.valid, !this.trim && !this.rotate && (this.orig = e), this.valid && this.updateUvs();
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "rotate", {
      /**
       * Indicates whether the texture is rotated inside the atlas
       * set to 2 to compensate for texture packer rotation
       * set to 6 to compensate for spine packer rotation
       * can be used to rotate or mirror sprites
       * See {@link PIXI.groupD8} for explanation
       */
      get: function() {
        return this._rotate;
      },
      set: function(e) {
        this._rotate = e, this.valid && this.updateUvs();
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "width", {
      /** The width of the Texture in pixels. */
      get: function() {
        return this.orig.width;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "height", {
      /** The height of the Texture in pixels. */
      get: function() {
        return this.orig.height;
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.castToBaseTexture = function() {
      return this.baseTexture;
    }, Object.defineProperty(t, "EMPTY", {
      /** An empty texture, used often to not have to create multiple empty textures. Can not be destroyed. */
      get: function() {
        return t._EMPTY || (t._EMPTY = new t(new ot()), Ri(t._EMPTY), Ri(t._EMPTY.baseTexture)), t._EMPTY;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t, "WHITE", {
      /** A white texture of 16x16 size, used for graphics and other things Can not be destroyed. */
      get: function() {
        if (!t._WHITE) {
          var e = k.ADAPTER.createCanvas(16, 16), i = e.getContext("2d");
          e.width = 16, e.height = 16, i.fillStyle = "white", i.fillRect(0, 0, 16, 16), t._WHITE = new t(ot.from(e)), Ri(t._WHITE), Ri(t._WHITE.baseTexture);
        }
        return t._WHITE;
      },
      enumerable: !1,
      configurable: !0
    }), t;
  }(fi)
), or = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e, i) {
      var n = r.call(this, e, i) || this;
      return n.valid = !0, n.filterFrame = null, n.filterPoolKey = null, n.updateUvs(), n;
    }
    return Object.defineProperty(t.prototype, "framebuffer", {
      /**
       * Shortcut to `this.baseTexture.framebuffer`, saves baseTexture cast.
       * @readonly
       */
      get: function() {
        return this.baseTexture.framebuffer;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "multisample", {
      /**
       * Shortcut to `this.framebuffer.multisample`.
       * @default PIXI.MSAA_QUALITY.NONE
       */
      get: function() {
        return this.framebuffer.multisample;
      },
      set: function(e) {
        this.framebuffer.multisample = e;
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.resize = function(e, i, n) {
      n === void 0 && (n = !0);
      var a = this.baseTexture.resolution, o = Math.round(e * a) / a, s = Math.round(i * a) / a;
      this.valid = o > 0 && s > 0, this._frame.width = this.orig.width = o, this._frame.height = this.orig.height = s, n && this.baseTexture.resize(o, s), this.updateUvs();
    }, t.prototype.setResolution = function(e) {
      var i = this.baseTexture;
      i.resolution !== e && (i.setResolution(e), this.resize(i.width, i.height, !1));
    }, t.create = function(e) {
      for (var i = arguments, n = [], a = 1; a < arguments.length; a++)
        n[a - 1] = i[a];
      return typeof e == "number" && (ae("6.0.0", "Arguments (width, height, scaleMode, resolution) have been deprecated."), e = {
        width: e,
        height: n[0],
        scaleMode: n[1],
        resolution: n[2]
      }), new t(new Vh(e));
    }, t;
  }(K)
), Ny = (
  /** @class */
  function() {
    function r(t) {
      this.texturePool = {}, this.textureOptions = t || {}, this.enableFullScreen = !1, this._pixelsWidth = 0, this._pixelsHeight = 0;
    }
    return r.prototype.createTexture = function(t, e, i) {
      i === void 0 && (i = bt.NONE);
      var n = new Vh(Object.assign({
        width: t,
        height: e,
        resolution: 1,
        multisample: i
      }, this.textureOptions));
      return new or(n);
    }, r.prototype.getOptimalTexture = function(t, e, i, n) {
      i === void 0 && (i = 1), n === void 0 && (n = bt.NONE);
      var a;
      t = Math.ceil(t * i - 1e-6), e = Math.ceil(e * i - 1e-6), !this.enableFullScreen || t !== this._pixelsWidth || e !== this._pixelsHeight ? (t = cn(t), e = cn(e), a = ((t & 65535) << 16 | e & 65535) >>> 0, n > 1 && (a += n * 4294967296)) : a = n > 1 ? -n : -1, this.texturePool[a] || (this.texturePool[a] = []);
      var o = this.texturePool[a].pop();
      return o || (o = this.createTexture(t, e, n)), o.filterPoolKey = a, o.setResolution(i), o;
    }, r.prototype.getFilterTexture = function(t, e, i) {
      var n = this.getOptimalTexture(t.width, t.height, e || t.resolution, i || bt.NONE);
      return n.filterFrame = t.filterFrame, n;
    }, r.prototype.returnTexture = function(t) {
      var e = t.filterPoolKey;
      t.filterFrame = null, this.texturePool[e].push(t);
    }, r.prototype.returnFilterTexture = function(t) {
      this.returnTexture(t);
    }, r.prototype.clear = function(t) {
      if (t = t !== !1, t)
        for (var e in this.texturePool) {
          var i = this.texturePool[e];
          if (i)
            for (var n = 0; n < i.length; n++)
              i[n].destroy(!0);
        }
      this.texturePool = {};
    }, r.prototype.setScreenSize = function(t) {
      if (!(t.width === this._pixelsWidth && t.height === this._pixelsHeight)) {
        this.enableFullScreen = t.width > 0 && t.height > 0;
        for (var e in this.texturePool)
          if (Number(e) < 0) {
            var i = this.texturePool[e];
            if (i)
              for (var n = 0; n < i.length; n++)
                i[n].destroy(!0);
            this.texturePool[e] = [];
          }
        this._pixelsWidth = t.width, this._pixelsHeight = t.height;
      }
    }, r.SCREEN_KEY = -1, r;
  }()
), Ys = (
  /** @class */
  function() {
    function r(t, e, i, n, a, o, s) {
      e === void 0 && (e = 0), i === void 0 && (i = !1), n === void 0 && (n = V.FLOAT), this.buffer = t, this.size = e, this.normalized = i, this.type = n, this.stride = a, this.start = o, this.instance = s;
    }
    return r.prototype.destroy = function() {
      this.buffer = null;
    }, r.from = function(t, e, i, n, a) {
      return new r(t, e, i, n, a);
    }, r;
  }()
), By = 0, Ot = (
  /** @class */
  function() {
    function r(t, e, i) {
      e === void 0 && (e = !0), i === void 0 && (i = !1), this.data = t || new Float32Array(1), this._glBuffers = {}, this._updateID = 0, this.index = i, this.static = e, this.id = By++, this.disposeRunner = new Bt("disposeBuffer");
    }
    return r.prototype.update = function(t) {
      t instanceof Array && (t = new Float32Array(t)), this.data = t || this.data, this._updateID++;
    }, r.prototype.dispose = function() {
      this.disposeRunner.emit(this, !1);
    }, r.prototype.destroy = function() {
      this.dispose(), this.data = null;
    }, Object.defineProperty(r.prototype, "index", {
      get: function() {
        return this.type === pe.ELEMENT_ARRAY_BUFFER;
      },
      /**
       * Flags whether this is an index buffer.
       *
       * Index buffers are of type `ELEMENT_ARRAY_BUFFER`. Note that setting this property to false will make
       * the buffer of type `ARRAY_BUFFER`.
       *
       * For backwards compatibility.
       */
      set: function(t) {
        this.type = t ? pe.ELEMENT_ARRAY_BUFFER : pe.ARRAY_BUFFER;
      },
      enumerable: !1,
      configurable: !0
    }), r.from = function(t) {
      return t instanceof Array && (t = new Float32Array(t)), new r(t);
    }, r;
  }()
), Ly = {
  Float32Array,
  Uint32Array,
  Int32Array,
  Uint8Array
};
function Uy(r, t) {
  for (var e = 0, i = 0, n = {}, a = 0; a < r.length; a++)
    i += t[a], e += r[a].length;
  for (var o = new ArrayBuffer(e * 4), s = null, u = 0, a = 0; a < r.length; a++) {
    var h = t[a], l = r[a], f = Lh(l);
    n[f] || (n[f] = new Ly[f](o)), s = n[f];
    for (var c = 0; c < l.length; c++) {
      var d = (c / h | 0) * i + u, p = c % h;
      s[d + p] = l[c];
    }
    u += h;
  }
  return new Float32Array(o);
}
var qs = { 5126: 4, 5123: 2, 5121: 1 }, Gy = 0, ky = {
  Float32Array,
  Uint32Array,
  Int32Array,
  Uint8Array,
  Uint16Array
}, pi = (
  /** @class */
  function() {
    function r(t, e) {
      t === void 0 && (t = []), e === void 0 && (e = {}), this.buffers = t, this.indexBuffer = null, this.attributes = e, this.glVertexArrayObjects = {}, this.id = Gy++, this.instanced = !1, this.instanceCount = 1, this.disposeRunner = new Bt("disposeGeometry"), this.refCount = 0;
    }
    return r.prototype.addAttribute = function(t, e, i, n, a, o, s, u) {
      if (i === void 0 && (i = 0), n === void 0 && (n = !1), u === void 0 && (u = !1), !e)
        throw new Error("You must pass a buffer when creating an attribute");
      e instanceof Ot || (e instanceof Array && (e = new Float32Array(e)), e = new Ot(e));
      var h = t.split("|");
      if (h.length > 1) {
        for (var l = 0; l < h.length; l++)
          this.addAttribute(h[l], e, i, n, a);
        return this;
      }
      var f = this.buffers.indexOf(e);
      return f === -1 && (this.buffers.push(e), f = this.buffers.length - 1), this.attributes[t] = new Ys(f, i, n, a, o, s, u), this.instanced = this.instanced || u, this;
    }, r.prototype.getAttribute = function(t) {
      return this.attributes[t];
    }, r.prototype.getBuffer = function(t) {
      return this.buffers[this.getAttribute(t).buffer];
    }, r.prototype.addIndex = function(t) {
      return t instanceof Ot || (t instanceof Array && (t = new Uint16Array(t)), t = new Ot(t)), t.type = pe.ELEMENT_ARRAY_BUFFER, this.indexBuffer = t, this.buffers.indexOf(t) === -1 && this.buffers.push(t), this;
    }, r.prototype.getIndex = function() {
      return this.indexBuffer;
    }, r.prototype.interleave = function() {
      if (this.buffers.length === 1 || this.buffers.length === 2 && this.indexBuffer)
        return this;
      var t = [], e = [], i = new Ot(), n;
      for (n in this.attributes) {
        var a = this.attributes[n], o = this.buffers[a.buffer];
        t.push(o.data), e.push(a.size * qs[a.type] / 4), a.buffer = 0;
      }
      for (i.data = Uy(t, e), n = 0; n < this.buffers.length; n++)
        this.buffers[n] !== this.indexBuffer && this.buffers[n].destroy();
      return this.buffers = [i], this.indexBuffer && this.buffers.push(this.indexBuffer), this;
    }, r.prototype.getSize = function() {
      for (var t in this.attributes) {
        var e = this.attributes[t], i = this.buffers[e.buffer];
        return i.data.length / (e.stride / 4 || e.size);
      }
      return 0;
    }, r.prototype.dispose = function() {
      this.disposeRunner.emit(this, !1);
    }, r.prototype.destroy = function() {
      this.dispose(), this.buffers = null, this.indexBuffer = null, this.attributes = null;
    }, r.prototype.clone = function() {
      for (var t = new r(), e = 0; e < this.buffers.length; e++)
        t.buffers[e] = new Ot(this.buffers[e].data.slice(0));
      for (var e in this.attributes) {
        var i = this.attributes[e];
        t.attributes[e] = new Ys(i.buffer, i.size, i.normalized, i.type, i.stride, i.start, i.instance);
      }
      return this.indexBuffer && (t.indexBuffer = t.buffers[this.buffers.indexOf(this.indexBuffer)], t.indexBuffer.type = pe.ELEMENT_ARRAY_BUFFER), t;
    }, r.merge = function(t) {
      for (var e = new r(), i = [], n = [], a = [], o, s = 0; s < t.length; s++) {
        o = t[s];
        for (var u = 0; u < o.buffers.length; u++)
          n[u] = n[u] || 0, n[u] += o.buffers[u].data.length, a[u] = 0;
      }
      for (var s = 0; s < o.buffers.length; s++)
        i[s] = new ky[Lh(o.buffers[s].data)](n[s]), e.buffers[s] = new Ot(i[s]);
      for (var s = 0; s < t.length; s++) {
        o = t[s];
        for (var u = 0; u < o.buffers.length; u++)
          i[u].set(o.buffers[u].data, a[u]), a[u] += o.buffers[u].data.length;
      }
      if (e.attributes = o.attributes, o.indexBuffer) {
        e.indexBuffer = e.buffers[o.buffers.indexOf(o.indexBuffer)], e.indexBuffer.type = pe.ELEMENT_ARRAY_BUFFER;
        for (var h = 0, l = 0, f = 0, c = 0, s = 0; s < o.buffers.length; s++)
          if (o.buffers[s] !== o.indexBuffer) {
            c = s;
            break;
          }
        for (var s in o.attributes) {
          var d = o.attributes[s];
          (d.buffer | 0) === c && (l += d.size * qs[d.type] / 4);
        }
        for (var s = 0; s < t.length; s++) {
          for (var p = t[s].indexBuffer.data, u = 0; u < p.length; u++)
            e.indexBuffer.data[u + f] += h;
          h += t[s].buffers[c].data.length / l, f += p.length;
        }
      }
      return e;
    }, r;
  }()
), Hy = (
  /** @class */
  function(r) {
    yt(t, r);
    function t() {
      var e = r.call(this) || this;
      return e.addAttribute("aVertexPosition", new Float32Array([
        0,
        0,
        1,
        0,
        1,
        1,
        0,
        1
      ])).addIndex([0, 1, 3, 2]), e;
    }
    return t;
  }(pi)
), Wh = (
  /** @class */
  function(r) {
    yt(t, r);
    function t() {
      var e = r.call(this) || this;
      return e.vertices = new Float32Array([
        -1,
        -1,
        1,
        -1,
        1,
        1,
        -1,
        1
      ]), e.uvs = new Float32Array([
        0,
        0,
        1,
        0,
        1,
        1,
        0,
        1
      ]), e.vertexBuffer = new Ot(e.vertices), e.uvBuffer = new Ot(e.uvs), e.addAttribute("aVertexPosition", e.vertexBuffer).addAttribute("aTextureCoord", e.uvBuffer).addIndex([0, 1, 2, 0, 2, 3]), e;
    }
    return t.prototype.map = function(e, i) {
      var n = 0, a = 0;
      return this.uvs[0] = n, this.uvs[1] = a, this.uvs[2] = n + i.width / e.width, this.uvs[3] = a, this.uvs[4] = n + i.width / e.width, this.uvs[5] = a + i.height / e.height, this.uvs[6] = n, this.uvs[7] = a + i.height / e.height, n = i.x, a = i.y, this.vertices[0] = n, this.vertices[1] = a, this.vertices[2] = n + i.width, this.vertices[3] = a, this.vertices[4] = n + i.width, this.vertices[5] = a + i.height, this.vertices[6] = n, this.vertices[7] = a + i.height, this.invalidate(), this;
    }, t.prototype.invalidate = function() {
      return this.vertexBuffer._updateID++, this.uvBuffer._updateID++, this;
    }, t;
  }(pi)
), Xy = 0, ir = (
  /** @class */
  function() {
    function r(t, e, i) {
      this.group = !0, this.syncUniforms = {}, this.dirtyId = 0, this.id = Xy++, this.static = !!e, this.ubo = !!i, t instanceof Ot ? (this.buffer = t, this.buffer.type = pe.UNIFORM_BUFFER, this.autoManage = !1, this.ubo = !0) : (this.uniforms = t, this.ubo && (this.buffer = new Ot(new Float32Array(1)), this.buffer.type = pe.UNIFORM_BUFFER, this.autoManage = !0));
    }
    return r.prototype.update = function() {
      this.dirtyId++, !this.autoManage && this.buffer && this.buffer.update();
    }, r.prototype.add = function(t, e, i) {
      if (!this.ubo)
        this.uniforms[t] = new r(e, i);
      else
        throw new Error("[UniformGroup] uniform groups in ubo mode cannot be modified, or have uniform groups nested in them");
    }, r.from = function(t, e, i) {
      return new r(t, e, i);
    }, r.uboFrom = function(t, e) {
      return new r(t, e ?? !0, !0);
    }, r;
  }()
), jy = (
  /** @class */
  function() {
    function r() {
      this.renderTexture = null, this.target = null, this.legacy = !1, this.resolution = 1, this.multisample = bt.NONE, this.sourceFrame = new st(), this.destinationFrame = new st(), this.bindingSourceFrame = new st(), this.bindingDestinationFrame = new st(), this.filters = [], this.transform = null;
    }
    return r.prototype.clear = function() {
      this.target = null, this.filters = null, this.renderTexture = null;
    }, r;
  }()
), Oi = [new gt(), new gt(), new gt(), new gt()], qn = new It(), Vy = (
  /** @class */
  function() {
    function r(t) {
      this.renderer = t, this.defaultFilterStack = [{}], this.texturePool = new Ny(), this.texturePool.setScreenSize(t.view), this.statePool = [], this.quad = new Hy(), this.quadUv = new Wh(), this.tempRect = new st(), this.activeState = {}, this.globalUniforms = new ir({
        outputFrame: new st(),
        inputSize: new Float32Array(4),
        inputPixel: new Float32Array(4),
        inputClamp: new Float32Array(4),
        resolution: 1,
        // legacy variables
        filterArea: new Float32Array(4),
        filterClamp: new Float32Array(4)
      }, !0), this.forceClear = !1, this.useMaxPadding = !1;
    }
    return r.prototype.push = function(t, e) {
      for (var i, n, a = this.renderer, o = this.defaultFilterStack, s = this.statePool.pop() || new jy(), u = this.renderer.renderTexture, h = e[0].resolution, l = e[0].multisample, f = e[0].padding, c = e[0].autoFit, d = (i = e[0].legacy) !== null && i !== void 0 ? i : !0, p = 1; p < e.length; p++) {
        var _ = e[p];
        h = Math.min(h, _.resolution), l = Math.min(l, _.multisample), f = this.useMaxPadding ? Math.max(f, _.padding) : f + _.padding, c = c && _.autoFit, d = d || ((n = _.legacy) !== null && n !== void 0 ? n : !0);
      }
      o.length === 1 && (this.defaultFilterStack[0].renderTexture = u.current), o.push(s), s.resolution = h, s.multisample = l, s.legacy = d, s.target = t, s.sourceFrame.copyFrom(t.filterArea || t.getBounds(!0)), s.sourceFrame.pad(f);
      var v = this.tempRect.copyFrom(u.sourceFrame);
      a.projection.transform && this.transformAABB(qn.copyFrom(a.projection.transform).invert(), v), c ? (s.sourceFrame.fit(v), (s.sourceFrame.width <= 0 || s.sourceFrame.height <= 0) && (s.sourceFrame.width = 0, s.sourceFrame.height = 0)) : s.sourceFrame.intersects(v) || (s.sourceFrame.width = 0, s.sourceFrame.height = 0), this.roundFrame(s.sourceFrame, u.current ? u.current.resolution : a.resolution, u.sourceFrame, u.destinationFrame, a.projection.transform), s.renderTexture = this.getOptimalFilterTexture(s.sourceFrame.width, s.sourceFrame.height, h, l), s.filters = e, s.destinationFrame.width = s.renderTexture.width, s.destinationFrame.height = s.renderTexture.height;
      var y = this.tempRect;
      y.x = 0, y.y = 0, y.width = s.sourceFrame.width, y.height = s.sourceFrame.height, s.renderTexture.filterFrame = s.sourceFrame, s.bindingSourceFrame.copyFrom(u.sourceFrame), s.bindingDestinationFrame.copyFrom(u.destinationFrame), s.transform = a.projection.transform, a.projection.transform = null, u.bind(s.renderTexture, s.sourceFrame, y), a.framebuffer.clear(0, 0, 0, 0);
    }, r.prototype.pop = function() {
      var t = this.defaultFilterStack, e = t.pop(), i = e.filters;
      this.activeState = e;
      var n = this.globalUniforms.uniforms;
      n.outputFrame = e.sourceFrame, n.resolution = e.resolution;
      var a = n.inputSize, o = n.inputPixel, s = n.inputClamp;
      if (a[0] = e.destinationFrame.width, a[1] = e.destinationFrame.height, a[2] = 1 / a[0], a[3] = 1 / a[1], o[0] = Math.round(a[0] * e.resolution), o[1] = Math.round(a[1] * e.resolution), o[2] = 1 / o[0], o[3] = 1 / o[1], s[0] = 0.5 * o[2], s[1] = 0.5 * o[3], s[2] = e.sourceFrame.width * a[2] - 0.5 * o[2], s[3] = e.sourceFrame.height * a[3] - 0.5 * o[3], e.legacy) {
        var u = n.filterArea;
        u[0] = e.destinationFrame.width, u[1] = e.destinationFrame.height, u[2] = e.sourceFrame.x, u[3] = e.sourceFrame.y, n.filterClamp = n.inputClamp;
      }
      this.globalUniforms.update();
      var h = t[t.length - 1];
      if (this.renderer.framebuffer.blit(), i.length === 1)
        i[0].apply(this, e.renderTexture, h.renderTexture, re.BLEND, e), this.returnFilterTexture(e.renderTexture);
      else {
        var l = e.renderTexture, f = this.getOptimalFilterTexture(l.width, l.height, e.resolution);
        f.filterFrame = l.filterFrame;
        var c = 0;
        for (c = 0; c < i.length - 1; ++c) {
          c === 1 && e.multisample > 1 && (f = this.getOptimalFilterTexture(l.width, l.height, e.resolution), f.filterFrame = l.filterFrame), i[c].apply(this, l, f, re.CLEAR, e);
          var d = l;
          l = f, f = d;
        }
        i[c].apply(this, l, h.renderTexture, re.BLEND, e), c > 1 && e.multisample > 1 && this.returnFilterTexture(e.renderTexture), this.returnFilterTexture(l), this.returnFilterTexture(f);
      }
      e.clear(), this.statePool.push(e);
    }, r.prototype.bindAndClear = function(t, e) {
      e === void 0 && (e = re.CLEAR);
      var i = this.renderer, n = i.renderTexture, a = i.state;
      if (t === this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture ? this.renderer.projection.transform = this.activeState.transform : this.renderer.projection.transform = null, t && t.filterFrame) {
        var o = this.tempRect;
        o.x = 0, o.y = 0, o.width = t.filterFrame.width, o.height = t.filterFrame.height, n.bind(t, t.filterFrame, o);
      } else
        t !== this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture ? n.bind(t) : this.renderer.renderTexture.bind(t, this.activeState.bindingSourceFrame, this.activeState.bindingDestinationFrame);
      var s = a.stateId & 1 || this.forceClear;
      (e === re.CLEAR || e === re.BLIT && s) && this.renderer.framebuffer.clear(0, 0, 0, 0);
    }, r.prototype.applyFilter = function(t, e, i, n) {
      var a = this.renderer;
      a.state.set(t.state), this.bindAndClear(i, n), t.uniforms.uSampler = e, t.uniforms.filterGlobals = this.globalUniforms, a.shader.bind(t), t.legacy = !!t.program.attributeData.aTextureCoord, t.legacy ? (this.quadUv.map(e._frame, e.filterFrame), a.geometry.bind(this.quadUv), a.geometry.draw(ie.TRIANGLES)) : (a.geometry.bind(this.quad), a.geometry.draw(ie.TRIANGLE_STRIP));
    }, r.prototype.calculateSpriteMatrix = function(t, e) {
      var i = this.activeState, n = i.sourceFrame, a = i.destinationFrame, o = e._texture.orig, s = t.set(a.width, 0, 0, a.height, n.x, n.y), u = e.worldTransform.copyTo(It.TEMP_MATRIX);
      return u.invert(), s.prepend(u), s.scale(1 / o.width, 1 / o.height), s.translate(e.anchor.x, e.anchor.y), s;
    }, r.prototype.destroy = function() {
      this.renderer = null, this.texturePool.clear(!1);
    }, r.prototype.getOptimalFilterTexture = function(t, e, i, n) {
      return i === void 0 && (i = 1), n === void 0 && (n = bt.NONE), this.texturePool.getOptimalTexture(t, e, i, n);
    }, r.prototype.getFilterTexture = function(t, e, i) {
      if (typeof t == "number") {
        var n = t;
        t = e, e = n;
      }
      t = t || this.activeState.renderTexture;
      var a = this.texturePool.getOptimalTexture(t.width, t.height, e || t.resolution, i || bt.NONE);
      return a.filterFrame = t.filterFrame, a;
    }, r.prototype.returnFilterTexture = function(t) {
      this.texturePool.returnTexture(t);
    }, r.prototype.emptyPool = function() {
      this.texturePool.clear(!0);
    }, r.prototype.resize = function() {
      this.texturePool.setScreenSize(this.renderer.view);
    }, r.prototype.transformAABB = function(t, e) {
      var i = Oi[0], n = Oi[1], a = Oi[2], o = Oi[3];
      i.set(e.left, e.top), n.set(e.left, e.bottom), a.set(e.right, e.top), o.set(e.right, e.bottom), t.apply(i, i), t.apply(n, n), t.apply(a, a), t.apply(o, o);
      var s = Math.min(i.x, n.x, a.x, o.x), u = Math.min(i.y, n.y, a.y, o.y), h = Math.max(i.x, n.x, a.x, o.x), l = Math.max(i.y, n.y, a.y, o.y);
      e.x = s, e.y = u, e.width = h - s, e.height = l - u;
    }, r.prototype.roundFrame = function(t, e, i, n, a) {
      if (!(t.width <= 0 || t.height <= 0 || i.width <= 0 || i.height <= 0)) {
        if (a) {
          var o = a.a, s = a.b, u = a.c, h = a.d;
          if ((Math.abs(s) > 1e-4 || Math.abs(u) > 1e-4) && (Math.abs(o) > 1e-4 || Math.abs(h) > 1e-4))
            return;
        }
        a = a ? qn.copyFrom(a) : qn.identity(), a.translate(-i.x, -i.y).scale(n.width / i.width, n.height / i.height).translate(n.x, n.y), this.transformAABB(a, t), t.ceil(e), this.transformAABB(a.invert(), t);
      }
    }, r;
  }()
), Pn = (
  /** @class */
  function() {
    function r(t) {
      this.renderer = t;
    }
    return r.prototype.flush = function() {
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r.prototype.start = function() {
    }, r.prototype.stop = function() {
      this.flush();
    }, r.prototype.render = function(t) {
    }, r;
  }()
), zy = (
  /** @class */
  function() {
    function r(t) {
      this.renderer = t, this.emptyRenderer = new Pn(t), this.currentRenderer = this.emptyRenderer;
    }
    return r.prototype.setObjectRenderer = function(t) {
      this.currentRenderer !== t && (this.currentRenderer.stop(), this.currentRenderer = t, this.currentRenderer.start());
    }, r.prototype.flush = function() {
      this.setObjectRenderer(this.emptyRenderer);
    }, r.prototype.reset = function() {
      this.setObjectRenderer(this.emptyRenderer);
    }, r.prototype.copyBoundTextures = function(t, e) {
      for (var i = this.renderer.texture.boundTextures, n = e - 1; n >= 0; --n)
        t[n] = i[n] || null, t[n] && (t[n]._batchLocation = n);
    }, r.prototype.boundArray = function(t, e, i, n) {
      for (var a = t.elements, o = t.ids, s = t.count, u = 0, h = 0; h < s; h++) {
        var l = a[h], f = l._batchLocation;
        if (f >= 0 && f < n && e[f] === l) {
          o[h] = f;
          continue;
        }
        for (; u < n; ) {
          var c = e[u];
          if (c && c._batchEnabled === i && c._batchLocation === u) {
            u++;
            continue;
          }
          o[h] = u, l._batchLocation = u, e[u] = l;
          break;
        }
      }
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), Zs = 0, Wy = (
  /** @class */
  function() {
    function r(t) {
      this.renderer = t, this.webGLVersion = 1, this.extensions = {}, this.supports = {
        uint32Indices: !1
      }, this.handleContextLost = this.handleContextLost.bind(this), this.handleContextRestored = this.handleContextRestored.bind(this), t.view.addEventListener("webglcontextlost", this.handleContextLost, !1), t.view.addEventListener("webglcontextrestored", this.handleContextRestored, !1);
    }
    return Object.defineProperty(r.prototype, "isLost", {
      /**
       * `true` if the context is lost
       * @readonly
       */
      get: function() {
        return !this.gl || this.gl.isContextLost();
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.contextChange = function(t) {
      this.gl = t, this.renderer.gl = t, this.renderer.CONTEXT_UID = Zs++;
    }, r.prototype.initFromContext = function(t) {
      this.gl = t, this.validateContext(t), this.renderer.gl = t, this.renderer.CONTEXT_UID = Zs++, this.renderer.runners.contextChange.emit(t);
    }, r.prototype.initFromOptions = function(t) {
      var e = this.createContext(this.renderer.view, t);
      this.initFromContext(e);
    }, r.prototype.createContext = function(t, e) {
      var i;
      if (k.PREFER_ENV >= xe.WEBGL2 && (i = t.getContext("webgl2", e)), i)
        this.webGLVersion = 2;
      else if (this.webGLVersion = 1, i = t.getContext("webgl", e) || t.getContext("experimental-webgl", e), !i)
        throw new Error("This browser does not support WebGL. Try using the canvas renderer");
      return this.gl = i, this.getExtensions(), this.gl;
    }, r.prototype.getExtensions = function() {
      var t = this.gl, e = {
        loseContext: t.getExtension("WEBGL_lose_context"),
        anisotropicFiltering: t.getExtension("EXT_texture_filter_anisotropic"),
        floatTextureLinear: t.getExtension("OES_texture_float_linear"),
        s3tc: t.getExtension("WEBGL_compressed_texture_s3tc"),
        s3tc_sRGB: t.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
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
    }, r.prototype.handleContextLost = function(t) {
      var e = this;
      t.preventDefault(), setTimeout(function() {
        e.gl.isContextLost() && e.extensions.loseContext && e.extensions.loseContext.restoreContext();
      }, 0);
    }, r.prototype.handleContextRestored = function() {
      this.renderer.runners.contextChange.emit(this.gl);
    }, r.prototype.destroy = function() {
      var t = this.renderer.view;
      this.renderer = null, t.removeEventListener("webglcontextlost", this.handleContextLost), t.removeEventListener("webglcontextrestored", this.handleContextRestored), this.gl.useProgram(null), this.extensions.loseContext && this.extensions.loseContext.loseContext();
    }, r.prototype.postrender = function() {
      this.renderer.renderingToScreen && this.gl.flush();
    }, r.prototype.validateContext = function(t) {
      var e = t.getContextAttributes(), i = "WebGL2RenderingContext" in globalThis && t instanceof globalThis.WebGL2RenderingContext;
      i && (this.webGLVersion = 2), e && !e.stencil && console.warn("Provided WebGL context does not have a stencil buffer, masks may not render correctly");
      var n = i || !!t.getExtension("OES_element_index_uint");
      this.supports.uint32Indices = n, n || console.warn("Provided WebGL context does not support 32 index buffer, complex graphics may not render correctly");
    }, r;
  }()
), Yy = (
  /** @class */
  function() {
    function r(t) {
      this.framebuffer = t, this.stencil = null, this.dirtyId = -1, this.dirtyFormat = -1, this.dirtySize = -1, this.multisample = bt.NONE, this.msaaBuffer = null, this.blitFramebuffer = null, this.mipLevel = 0;
    }
    return r;
  }()
), qy = new st(), Zy = (
  /** @class */
  function() {
    function r(t) {
      this.renderer = t, this.managedFramebuffers = [], this.unknownFramebuffer = new za(10, 10), this.msaaSamples = null;
    }
    return r.prototype.contextChange = function() {
      this.disposeAll(!0);
      var t = this.gl = this.renderer.gl;
      if (this.CONTEXT_UID = this.renderer.CONTEXT_UID, this.current = this.unknownFramebuffer, this.viewport = new st(), this.hasMRT = !0, this.writeDepthTexture = !0, this.renderer.context.webGLVersion === 1) {
        var e = this.renderer.context.extensions.drawBuffers, i = this.renderer.context.extensions.depthTexture;
        k.PREFER_ENV === xe.WEBGL_LEGACY && (e = null, i = null), e ? t.drawBuffers = function(n) {
          return e.drawBuffersWEBGL(n);
        } : (this.hasMRT = !1, t.drawBuffers = function() {
        }), i || (this.writeDepthTexture = !1);
      } else
        this.msaaSamples = t.getInternalformatParameter(t.RENDERBUFFER, t.RGBA8, t.SAMPLES);
    }, r.prototype.bind = function(t, e, i) {
      i === void 0 && (i = 0);
      var n = this.gl;
      if (t) {
        var a = t.glFramebuffers[this.CONTEXT_UID] || this.initFramebuffer(t);
        this.current !== t && (this.current = t, n.bindFramebuffer(n.FRAMEBUFFER, a.framebuffer)), a.mipLevel !== i && (t.dirtyId++, t.dirtyFormat++, a.mipLevel = i), a.dirtyId !== t.dirtyId && (a.dirtyId = t.dirtyId, a.dirtyFormat !== t.dirtyFormat ? (a.dirtyFormat = t.dirtyFormat, a.dirtySize = t.dirtySize, this.updateFramebuffer(t, i)) : a.dirtySize !== t.dirtySize && (a.dirtySize = t.dirtySize, this.resizeFramebuffer(t)));
        for (var o = 0; o < t.colorTextures.length; o++) {
          var s = t.colorTextures[o];
          this.renderer.texture.unbind(s.parentTextureArray || s);
        }
        if (t.depthTexture && this.renderer.texture.unbind(t.depthTexture), e) {
          var u = e.width >> i, h = e.height >> i, l = u / e.width;
          this.setViewport(e.x * l, e.y * l, u, h);
        } else {
          var u = t.width >> i, h = t.height >> i;
          this.setViewport(0, 0, u, h);
        }
      } else
        this.current && (this.current = null, n.bindFramebuffer(n.FRAMEBUFFER, null)), e ? this.setViewport(e.x, e.y, e.width, e.height) : this.setViewport(0, 0, this.renderer.width, this.renderer.height);
    }, r.prototype.setViewport = function(t, e, i, n) {
      var a = this.viewport;
      t = Math.round(t), e = Math.round(e), i = Math.round(i), n = Math.round(n), (a.width !== i || a.height !== n || a.x !== t || a.y !== e) && (a.x = t, a.y = e, a.width = i, a.height = n, this.gl.viewport(t, e, i, n));
    }, Object.defineProperty(r.prototype, "size", {
      /**
       * Get the size of the current width and height. Returns object with `width` and `height` values.
       * @readonly
       */
      get: function() {
        return this.current ? { x: 0, y: 0, width: this.current.width, height: this.current.height } : { x: 0, y: 0, width: this.renderer.width, height: this.renderer.height };
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.clear = function(t, e, i, n, a) {
      a === void 0 && (a = rn.COLOR | rn.DEPTH);
      var o = this.gl;
      o.clearColor(t, e, i, n), o.clear(a);
    }, r.prototype.initFramebuffer = function(t) {
      var e = this.gl, i = new Yy(e.createFramebuffer());
      return i.multisample = this.detectSamples(t.multisample), t.glFramebuffers[this.CONTEXT_UID] = i, this.managedFramebuffers.push(t), t.disposeRunner.add(this), i;
    }, r.prototype.resizeFramebuffer = function(t) {
      var e = this.gl, i = t.glFramebuffers[this.CONTEXT_UID];
      i.msaaBuffer && (e.bindRenderbuffer(e.RENDERBUFFER, i.msaaBuffer), e.renderbufferStorageMultisample(e.RENDERBUFFER, i.multisample, e.RGBA8, t.width, t.height)), i.stencil && (e.bindRenderbuffer(e.RENDERBUFFER, i.stencil), i.msaaBuffer ? e.renderbufferStorageMultisample(e.RENDERBUFFER, i.multisample, e.DEPTH24_STENCIL8, t.width, t.height) : e.renderbufferStorage(e.RENDERBUFFER, e.DEPTH_STENCIL, t.width, t.height));
      var n = t.colorTextures, a = n.length;
      e.drawBuffers || (a = Math.min(a, 1));
      for (var o = 0; o < a; o++) {
        var s = n[o], u = s.parentTextureArray || s;
        this.renderer.texture.bind(u, 0);
      }
      t.depthTexture && this.writeDepthTexture && this.renderer.texture.bind(t.depthTexture, 0);
    }, r.prototype.updateFramebuffer = function(t, e) {
      var i = this.gl, n = t.glFramebuffers[this.CONTEXT_UID], a = t.colorTextures, o = a.length;
      i.drawBuffers || (o = Math.min(o, 1)), n.multisample > 1 && this.canMultisampleFramebuffer(t) ? (n.msaaBuffer = n.msaaBuffer || i.createRenderbuffer(), i.bindRenderbuffer(i.RENDERBUFFER, n.msaaBuffer), i.renderbufferStorageMultisample(i.RENDERBUFFER, n.multisample, i.RGBA8, t.width, t.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.RENDERBUFFER, n.msaaBuffer)) : n.msaaBuffer && (i.deleteRenderbuffer(n.msaaBuffer), n.msaaBuffer = null, n.blitFramebuffer && (n.blitFramebuffer.dispose(), n.blitFramebuffer = null));
      for (var s = [], u = 0; u < o; u++) {
        var h = a[u], l = h.parentTextureArray || h;
        this.renderer.texture.bind(l, 0), !(u === 0 && n.msaaBuffer) && (i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + u, h.target, l._glTextures[this.CONTEXT_UID].texture, e), s.push(i.COLOR_ATTACHMENT0 + u));
      }
      if (s.length > 1 && i.drawBuffers(s), t.depthTexture) {
        var f = this.writeDepthTexture;
        if (f) {
          var c = t.depthTexture;
          this.renderer.texture.bind(c, 0), i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, c._glTextures[this.CONTEXT_UID].texture, e);
        }
      }
      (t.stencil || t.depth) && !(t.depthTexture && this.writeDepthTexture) ? (n.stencil = n.stencil || i.createRenderbuffer(), i.bindRenderbuffer(i.RENDERBUFFER, n.stencil), n.msaaBuffer ? i.renderbufferStorageMultisample(i.RENDERBUFFER, n.multisample, i.DEPTH24_STENCIL8, t.width, t.height) : i.renderbufferStorage(i.RENDERBUFFER, i.DEPTH_STENCIL, t.width, t.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.RENDERBUFFER, n.stencil)) : n.stencil && (i.deleteRenderbuffer(n.stencil), n.stencil = null);
    }, r.prototype.canMultisampleFramebuffer = function(t) {
      return this.renderer.context.webGLVersion !== 1 && t.colorTextures.length <= 1 && !t.depthTexture;
    }, r.prototype.detectSamples = function(t) {
      var e = this.msaaSamples, i = bt.NONE;
      if (t <= 1 || e === null)
        return i;
      for (var n = 0; n < e.length; n++)
        if (e[n] <= t) {
          i = e[n];
          break;
        }
      return i === 1 && (i = bt.NONE), i;
    }, r.prototype.blit = function(t, e, i) {
      var n = this, a = n.current, o = n.renderer, s = n.gl, u = n.CONTEXT_UID;
      if (o.context.webGLVersion === 2 && a) {
        var h = a.glFramebuffers[u];
        if (h) {
          if (!t) {
            if (!h.msaaBuffer)
              return;
            var l = a.colorTextures[0];
            if (!l)
              return;
            h.blitFramebuffer || (h.blitFramebuffer = new za(a.width, a.height), h.blitFramebuffer.addColorTexture(0, l)), t = h.blitFramebuffer, t.colorTextures[0] !== l && (t.colorTextures[0] = l, t.dirtyId++, t.dirtyFormat++), (t.width !== a.width || t.height !== a.height) && (t.width = a.width, t.height = a.height, t.dirtyId++, t.dirtySize++);
          }
          e || (e = qy, e.width = a.width, e.height = a.height), i || (i = e);
          var f = e.width === i.width && e.height === i.height;
          this.bind(t), s.bindFramebuffer(s.READ_FRAMEBUFFER, h.framebuffer), s.blitFramebuffer(e.left, e.top, e.right, e.bottom, i.left, i.top, i.right, i.bottom, s.COLOR_BUFFER_BIT, f ? s.NEAREST : s.LINEAR);
        }
      }
    }, r.prototype.disposeFramebuffer = function(t, e) {
      var i = t.glFramebuffers[this.CONTEXT_UID], n = this.gl;
      if (i) {
        delete t.glFramebuffers[this.CONTEXT_UID];
        var a = this.managedFramebuffers.indexOf(t);
        a >= 0 && this.managedFramebuffers.splice(a, 1), t.disposeRunner.remove(this), e || (n.deleteFramebuffer(i.framebuffer), i.msaaBuffer && n.deleteRenderbuffer(i.msaaBuffer), i.stencil && n.deleteRenderbuffer(i.stencil)), i.blitFramebuffer && i.blitFramebuffer.dispose();
      }
    }, r.prototype.disposeAll = function(t) {
      var e = this.managedFramebuffers;
      this.managedFramebuffers = [];
      for (var i = 0; i < e.length; i++)
        this.disposeFramebuffer(e[i], t);
    }, r.prototype.forceStencil = function() {
      var t = this.current;
      if (t) {
        var e = t.glFramebuffers[this.CONTEXT_UID];
        if (!(!e || e.stencil)) {
          t.stencil = !0;
          var i = t.width, n = t.height, a = this.gl, o = a.createRenderbuffer();
          a.bindRenderbuffer(a.RENDERBUFFER, o), e.msaaBuffer ? a.renderbufferStorageMultisample(a.RENDERBUFFER, e.multisample, a.DEPTH24_STENCIL8, i, n) : a.renderbufferStorage(a.RENDERBUFFER, a.DEPTH_STENCIL, i, n), e.stencil = o, a.framebufferRenderbuffer(a.FRAMEBUFFER, a.DEPTH_STENCIL_ATTACHMENT, a.RENDERBUFFER, o);
        }
      }
    }, r.prototype.reset = function() {
      this.current = this.unknownFramebuffer, this.viewport = new st();
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), Zn = { 5126: 4, 5123: 2, 5121: 1 }, Ky = (
  /** @class */
  function() {
    function r(t) {
      this.renderer = t, this._activeGeometry = null, this._activeVao = null, this.hasVao = !0, this.hasInstance = !0, this.canUseUInt32ElementIndex = !1, this.managedGeometries = {};
    }
    return r.prototype.contextChange = function() {
      this.disposeAll(!0);
      var t = this.gl = this.renderer.gl, e = this.renderer.context;
      if (this.CONTEXT_UID = this.renderer.CONTEXT_UID, e.webGLVersion !== 2) {
        var i = this.renderer.context.extensions.vertexArrayObject;
        k.PREFER_ENV === xe.WEBGL_LEGACY && (i = null), i ? (t.createVertexArray = function() {
          return i.createVertexArrayOES();
        }, t.bindVertexArray = function(a) {
          return i.bindVertexArrayOES(a);
        }, t.deleteVertexArray = function(a) {
          return i.deleteVertexArrayOES(a);
        }) : (this.hasVao = !1, t.createVertexArray = function() {
          return null;
        }, t.bindVertexArray = function() {
          return null;
        }, t.deleteVertexArray = function() {
          return null;
        });
      }
      if (e.webGLVersion !== 2) {
        var n = t.getExtension("ANGLE_instanced_arrays");
        n ? (t.vertexAttribDivisor = function(a, o) {
          return n.vertexAttribDivisorANGLE(a, o);
        }, t.drawElementsInstanced = function(a, o, s, u, h) {
          return n.drawElementsInstancedANGLE(a, o, s, u, h);
        }, t.drawArraysInstanced = function(a, o, s, u) {
          return n.drawArraysInstancedANGLE(a, o, s, u);
        }) : this.hasInstance = !1;
      }
      this.canUseUInt32ElementIndex = e.webGLVersion === 2 || !!e.extensions.uint32ElementIndex;
    }, r.prototype.bind = function(t, e) {
      e = e || this.renderer.shader.shader;
      var i = this.gl, n = t.glVertexArrayObjects[this.CONTEXT_UID], a = !1;
      n || (this.managedGeometries[t.id] = t, t.disposeRunner.add(this), t.glVertexArrayObjects[this.CONTEXT_UID] = n = {}, a = !0);
      var o = n[e.program.id] || this.initGeometryVao(t, e, a);
      this._activeGeometry = t, this._activeVao !== o && (this._activeVao = o, this.hasVao ? i.bindVertexArray(o) : this.activateVao(t, e.program)), this.updateBuffers();
    }, r.prototype.reset = function() {
      this.unbind();
    }, r.prototype.updateBuffers = function() {
      for (var t = this._activeGeometry, e = this.renderer.buffer, i = 0; i < t.buffers.length; i++) {
        var n = t.buffers[i];
        e.update(n);
      }
    }, r.prototype.checkCompatibility = function(t, e) {
      var i = t.attributes, n = e.attributeData;
      for (var a in n)
        if (!i[a])
          throw new Error('shader and geometry incompatible, geometry missing the "' + a + '" attribute');
    }, r.prototype.getSignature = function(t, e) {
      var i = t.attributes, n = e.attributeData, a = ["g", t.id];
      for (var o in i)
        n[o] && a.push(o, n[o].location);
      return a.join("-");
    }, r.prototype.initGeometryVao = function(t, e, i) {
      i === void 0 && (i = !0);
      var n = this.gl, a = this.CONTEXT_UID, o = this.renderer.buffer, s = e.program;
      s.glPrograms[a] || this.renderer.shader.generateProgram(e), this.checkCompatibility(t, s);
      var u = this.getSignature(t, s), h = t.glVertexArrayObjects[this.CONTEXT_UID], l = h[u];
      if (l)
        return h[s.id] = l, l;
      var f = t.buffers, c = t.attributes, d = {}, p = {};
      for (var _ in f)
        d[_] = 0, p[_] = 0;
      for (var _ in c)
        !c[_].size && s.attributeData[_] ? c[_].size = s.attributeData[_].size : c[_].size || console.warn("PIXI Geometry attribute '" + _ + "' size cannot be determined (likely the bound shader does not have the attribute)"), d[c[_].buffer] += c[_].size * Zn[c[_].type];
      for (var _ in c) {
        var v = c[_], y = v.size;
        v.stride === void 0 && (d[v.buffer] === y * Zn[v.type] ? v.stride = 0 : v.stride = d[v.buffer]), v.start === void 0 && (v.start = p[v.buffer], p[v.buffer] += y * Zn[v.type]);
      }
      l = n.createVertexArray(), n.bindVertexArray(l);
      for (var g = 0; g < f.length; g++) {
        var m = f[g];
        o.bind(m), i && m._glBuffers[a].refCount++;
      }
      return this.activateVao(t, s), this._activeVao = l, h[s.id] = l, h[u] = l, l;
    }, r.prototype.disposeGeometry = function(t, e) {
      var i;
      if (this.managedGeometries[t.id]) {
        delete this.managedGeometries[t.id];
        var n = t.glVertexArrayObjects[this.CONTEXT_UID], a = this.gl, o = t.buffers, s = (i = this.renderer) === null || i === void 0 ? void 0 : i.buffer;
        if (t.disposeRunner.remove(this), !!n) {
          if (s)
            for (var u = 0; u < o.length; u++) {
              var h = o[u]._glBuffers[this.CONTEXT_UID];
              h && (h.refCount--, h.refCount === 0 && !e && s.dispose(o[u], e));
            }
          if (!e) {
            for (var l in n)
              if (l[0] === "g") {
                var f = n[l];
                this._activeVao === f && this.unbind(), a.deleteVertexArray(f);
              }
          }
          delete t.glVertexArrayObjects[this.CONTEXT_UID];
        }
      }
    }, r.prototype.disposeAll = function(t) {
      for (var e = Object.keys(this.managedGeometries), i = 0; i < e.length; i++)
        this.disposeGeometry(this.managedGeometries[e[i]], t);
    }, r.prototype.activateVao = function(t, e) {
      var i = this.gl, n = this.CONTEXT_UID, a = this.renderer.buffer, o = t.buffers, s = t.attributes;
      t.indexBuffer && a.bind(t.indexBuffer);
      var u = null;
      for (var h in s) {
        var l = s[h], f = o[l.buffer], c = f._glBuffers[n];
        if (e.attributeData[h]) {
          u !== c && (a.bind(f), u = c);
          var d = e.attributeData[h].location;
          if (i.enableVertexAttribArray(d), i.vertexAttribPointer(d, l.size, l.type || i.FLOAT, l.normalized, l.stride, l.start), l.instance)
            if (this.hasInstance)
              i.vertexAttribDivisor(d, 1);
            else
              throw new Error("geometry error, GPU Instancing is not supported on this device");
        }
      }
    }, r.prototype.draw = function(t, e, i, n) {
      var a = this.gl, o = this._activeGeometry;
      if (o.indexBuffer) {
        var s = o.indexBuffer.data.BYTES_PER_ELEMENT, u = s === 2 ? a.UNSIGNED_SHORT : a.UNSIGNED_INT;
        s === 2 || s === 4 && this.canUseUInt32ElementIndex ? o.instanced ? a.drawElementsInstanced(t, e || o.indexBuffer.data.length, u, (i || 0) * s, n || 1) : a.drawElements(t, e || o.indexBuffer.data.length, u, (i || 0) * s) : console.warn("unsupported index buffer type: uint32");
      } else
        o.instanced ? a.drawArraysInstanced(t, i, e || o.getSize(), n || 1) : a.drawArrays(t, i, e || o.getSize());
      return this;
    }, r.prototype.unbind = function() {
      this.gl.bindVertexArray(null), this._activeVao = null, this._activeGeometry = null;
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), $y = (
  /** @class */
  function() {
    function r(t) {
      t === void 0 && (t = null), this.type = Rt.NONE, this.autoDetect = !0, this.maskObject = t || null, this.pooled = !1, this.isMaskData = !0, this.resolution = null, this.multisample = k.FILTER_MULTISAMPLE, this.enabled = !0, this.colorMask = 15, this._filters = null, this._stencilCounter = 0, this._scissorCounter = 0, this._scissorRect = null, this._scissorRectLocal = null, this._colorMask = 15, this._target = null;
    }
    return Object.defineProperty(r.prototype, "filter", {
      /**
       * The sprite mask filter.
       * If set to `null`, the default sprite mask filter is used.
       * @default null
       */
      get: function() {
        return this._filters ? this._filters[0] : null;
      },
      set: function(t) {
        t ? this._filters ? this._filters[0] = t : this._filters = [t] : this._filters = null;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.reset = function() {
      this.pooled && (this.maskObject = null, this.type = Rt.NONE, this.autoDetect = !0), this._target = null, this._scissorRectLocal = null;
    }, r.prototype.copyCountersOrReset = function(t) {
      t ? (this._stencilCounter = t._stencilCounter, this._scissorCounter = t._scissorCounter, this._scissorRect = t._scissorRect) : (this._stencilCounter = 0, this._scissorCounter = 0, this._scissorRect = null);
    }, r;
  }()
);
function Ks(r, t, e) {
  var i = r.createShader(t);
  return r.shaderSource(i, e), r.compileShader(i), i;
}
function $s(r, t) {
  var e = r.getShaderSource(t).split(`
`).map(function(h, l) {
    return l + ": " + h;
  }), i = r.getShaderInfoLog(t), n = i.split(`
`), a = {}, o = n.map(function(h) {
    return parseFloat(h.replace(/^ERROR\: 0\:([\d]+)\:.*$/, "$1"));
  }).filter(function(h) {
    return h && !a[h] ? (a[h] = !0, !0) : !1;
  }), s = [""];
  o.forEach(function(h) {
    e[h - 1] = "%c" + e[h - 1] + "%c", s.push("background: #FF0000; color:#FFFFFF; font-size: 10px", "font-size: 10px");
  });
  var u = e.join(`
`);
  s[0] = u, console.error(i), console.groupCollapsed("click to view full shader code"), console.warn.apply(console, s), console.groupEnd();
}
function Qy(r, t, e, i) {
  r.getProgramParameter(t, r.LINK_STATUS) || (r.getShaderParameter(e, r.COMPILE_STATUS) || $s(r, e), r.getShaderParameter(i, r.COMPILE_STATUS) || $s(r, i), console.error("PixiJS Error: Could not initialize shader."), r.getProgramInfoLog(t) !== "" && console.warn("PixiJS Warning: gl.getProgramInfoLog()", r.getProgramInfoLog(t)));
}
function Kn(r) {
  for (var t = new Array(r), e = 0; e < t.length; e++)
    t[e] = !1;
  return t;
}
function Yh(r, t) {
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
      return Kn(2 * t);
    case "bvec3":
      return Kn(3 * t);
    case "bvec4":
      return Kn(4 * t);
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
var qh = {}, Ur = qh;
function Jy() {
  if (Ur === qh || Ur && Ur.isContextLost()) {
    var r = k.ADAPTER.createCanvas(), t = void 0;
    k.PREFER_ENV >= xe.WEBGL2 && (t = r.getContext("webgl2", {})), t || (t = r.getContext("webgl", {}) || r.getContext("experimental-webgl", {}), t ? t.getExtension("WEBGL_draw_buffers") : t = null), Ur = t;
  }
  return Ur;
}
var Ii;
function tg() {
  if (!Ii) {
    Ii = Vt.MEDIUM;
    var r = Jy();
    if (r && r.getShaderPrecisionFormat) {
      var t = r.getShaderPrecisionFormat(r.FRAGMENT_SHADER, r.HIGH_FLOAT);
      Ii = t.precision ? Vt.HIGH : Vt.MEDIUM;
    }
  }
  return Ii;
}
function Qs(r, t, e) {
  if (r.substring(0, 9) !== "precision") {
    var i = t;
    return t === Vt.HIGH && e !== Vt.HIGH && (i = Vt.MEDIUM), "precision " + i + ` float;
` + r;
  } else if (e !== Vt.HIGH && r.substring(0, 15) === "precision highp")
    return r.replace("precision highp", "precision mediump");
  return r;
}
var eg = {
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
function Zh(r) {
  return eg[r];
}
var Ci = null, Js = {
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
function Kh(r, t) {
  if (!Ci) {
    var e = Object.keys(Js);
    Ci = {};
    for (var i = 0; i < e.length; ++i) {
      var n = e[i];
      Ci[r[n]] = Js[n];
    }
  }
  return Ci[t];
}
var Or = [
  // a float cache layer
  {
    test: function(r) {
      return r.type === "float" && r.size === 1 && !r.isArray;
    },
    code: function(r) {
      return `
            if(uv["` + r + '"] !== ud["' + r + `"].value)
            {
                ud["` + r + '"].value = uv["' + r + `"]
                gl.uniform1f(ud["` + r + '"].location, uv["' + r + `"])
            }
            `;
    }
  },
  // handling samplers
  {
    test: function(r, t) {
      return (r.type === "sampler2D" || r.type === "samplerCube" || r.type === "sampler2DArray") && r.size === 1 && !r.isArray && (t == null || t.castToBaseTexture !== void 0);
    },
    code: function(r) {
      return `t = syncData.textureCount++;

            renderer.texture.bind(uv["` + r + `"], t);

            if(ud["` + r + `"].value !== t)
            {
                ud["` + r + `"].value = t;
                gl.uniform1i(ud["` + r + `"].location, t);
; // eslint-disable-line max-len
            }`;
    }
  },
  // uploading pixi matrix object to mat3
  {
    test: function(r, t) {
      return r.type === "mat3" && r.size === 1 && !r.isArray && t.a !== void 0;
    },
    code: function(r) {
      return `
            gl.uniformMatrix3fv(ud["` + r + '"].location, false, uv["' + r + `"].toArray(true));
            `;
    },
    codeUbo: function(r) {
      return `
                var ` + r + "_matrix = uv." + r + `.toArray(true);

                data[offset] = ` + r + `_matrix[0];
                data[offset+1] = ` + r + `_matrix[1];
                data[offset+2] = ` + r + `_matrix[2];
        
                data[offset + 4] = ` + r + `_matrix[3];
                data[offset + 5] = ` + r + `_matrix[4];
                data[offset + 6] = ` + r + `_matrix[5];
        
                data[offset + 8] = ` + r + `_matrix[6];
                data[offset + 9] = ` + r + `_matrix[7];
                data[offset + 10] = ` + r + `_matrix[8];
            `;
    }
  },
  // uploading a pixi point as a vec2 with caching layer
  {
    test: function(r, t) {
      return r.type === "vec2" && r.size === 1 && !r.isArray && t.x !== void 0;
    },
    code: function(r) {
      return `
                cv = ud["` + r + `"].value;
                v = uv["` + r + `"];

                if(cv[0] !== v.x || cv[1] !== v.y)
                {
                    cv[0] = v.x;
                    cv[1] = v.y;
                    gl.uniform2f(ud["` + r + `"].location, v.x, v.y);
                }`;
    },
    codeUbo: function(r) {
      return `
                v = uv.` + r + `;

                data[offset] = v.x;
                data[offset+1] = v.y;
            `;
    }
  },
  // caching layer for a vec2
  {
    test: function(r) {
      return r.type === "vec2" && r.size === 1 && !r.isArray;
    },
    code: function(r) {
      return `
                cv = ud["` + r + `"].value;
                v = uv["` + r + `"];

                if(cv[0] !== v[0] || cv[1] !== v[1])
                {
                    cv[0] = v[0];
                    cv[1] = v[1];
                    gl.uniform2f(ud["` + r + `"].location, v[0], v[1]);
                }
            `;
    }
  },
  // upload a pixi rectangle as a vec4 with caching layer
  {
    test: function(r, t) {
      return r.type === "vec4" && r.size === 1 && !r.isArray && t.width !== void 0;
    },
    code: function(r) {
      return `
                cv = ud["` + r + `"].value;
                v = uv["` + r + `"];

                if(cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height)
                {
                    cv[0] = v.x;
                    cv[1] = v.y;
                    cv[2] = v.width;
                    cv[3] = v.height;
                    gl.uniform4f(ud["` + r + `"].location, v.x, v.y, v.width, v.height)
                }`;
    },
    codeUbo: function(r) {
      return `
                    v = uv.` + r + `;

                    data[offset] = v.x;
                    data[offset+1] = v.y;
                    data[offset+2] = v.width;
                    data[offset+3] = v.height;
                `;
    }
  },
  // a caching layer for vec4 uploading
  {
    test: function(r) {
      return r.type === "vec4" && r.size === 1 && !r.isArray;
    },
    code: function(r) {
      return `
                cv = ud["` + r + `"].value;
                v = uv["` + r + `"];

                if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
                {
                    cv[0] = v[0];
                    cv[1] = v[1];
                    cv[2] = v[2];
                    cv[3] = v[3];

                    gl.uniform4f(ud["` + r + `"].location, v[0], v[1], v[2], v[3])
                }`;
    }
  }
], rg = {
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
}, ig = {
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
function ng(r, t) {
  var e, i = [`
        var v = null;
        var cv = null;
        var cu = null;
        var t = 0;
        var gl = renderer.gl;
    `];
  for (var n in r.uniforms) {
    var a = t[n];
    if (!a) {
      !((e = r.uniforms[n]) === null || e === void 0) && e.group && (r.uniforms[n].ubo ? i.push(`
                        renderer.shader.syncUniformBufferGroup(uv.` + n + ", '" + n + `');
                    `) : i.push(`
                        renderer.shader.syncUniformGroup(uv.` + n + `, syncData);
                    `));
      continue;
    }
    for (var o = r.uniforms[n], s = !1, u = 0; u < Or.length; u++)
      if (Or[u].test(a, o)) {
        i.push(Or[u].code(n, o)), s = !0;
        break;
      }
    if (!s) {
      var h = a.size === 1 && !a.isArray ? rg : ig, l = h[a.type].replace("location", 'ud["' + n + '"].location');
      i.push(`
            cu = ud["` + n + `"];
            cv = cu.value;
            v = uv["` + n + `"];
            ` + l + ";");
    }
  }
  return new Function("ud", "uv", "renderer", "syncData", i.join(`
`));
}
var ag = [
  "precision mediump float;",
  "void main(void){",
  "float test = 0.1;",
  "%forloop%",
  "gl_FragColor = vec4(0.0);",
  "}"
].join(`
`);
function og(r) {
  for (var t = "", e = 0; e < r; ++e)
    e > 0 && (t += `
else `), e < r - 1 && (t += "if(test == " + e + ".0){}");
  return t;
}
function sg(r, t) {
  if (r === 0)
    throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
  for (var e = t.createShader(t.FRAGMENT_SHADER); ; ) {
    var i = ag.replace(/%forloop%/gi, og(r));
    if (t.shaderSource(e, i), t.compileShader(e), !t.getShaderParameter(e, t.COMPILE_STATUS))
      r = r / 2 | 0;
    else
      break;
  }
  return r;
}
var Gr;
function ug() {
  if (typeof Gr == "boolean")
    return Gr;
  try {
    var r = new Function("param1", "param2", "param3", "return param1[param2] === param3;");
    Gr = r({ a: "b" }, "a", "b") === !0;
  } catch {
    Gr = !1;
  }
  return Gr;
}
var hg = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void){
   gl_FragColor *= texture2D(uSampler, vTextureCoord);
}`, lg = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void){
   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
   vTextureCoord = aTextureCoord;
}
`, fg = 0, Mi = {}, vi = (
  /** @class */
  function() {
    function r(t, e, i) {
      i === void 0 && (i = "pixi-shader"), this.id = fg++, this.vertexSrc = t || r.defaultVertexSrc, this.fragmentSrc = e || r.defaultFragmentSrc, this.vertexSrc = this.vertexSrc.trim(), this.fragmentSrc = this.fragmentSrc.trim(), this.vertexSrc.substring(0, 8) !== "#version" && (i = i.replace(/\s+/g, "-"), Mi[i] ? (Mi[i]++, i += "-" + Mi[i]) : Mi[i] = 1, this.vertexSrc = "#define SHADER_NAME " + i + `
` + this.vertexSrc, this.fragmentSrc = "#define SHADER_NAME " + i + `
` + this.fragmentSrc, this.vertexSrc = Qs(this.vertexSrc, k.PRECISION_VERTEX, Vt.HIGH), this.fragmentSrc = Qs(this.fragmentSrc, k.PRECISION_FRAGMENT, tg())), this.glPrograms = {}, this.syncUniforms = null;
    }
    return Object.defineProperty(r, "defaultVertexSrc", {
      /**
       * The default vertex shader source.
       * @constant
       */
      get: function() {
        return lg;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "defaultFragmentSrc", {
      /**
       * The default fragment shader source.
       * @constant
       */
      get: function() {
        return hg;
      },
      enumerable: !1,
      configurable: !0
    }), r.from = function(t, e, i) {
      var n = t + e, a = js[n];
      return a || (js[n] = a = new r(t, e, i)), a;
    }, r;
  }()
), Fe = (
  /** @class */
  function() {
    function r(t, e) {
      this.uniformBindCount = 0, this.program = t, e ? e instanceof ir ? this.uniformGroup = e : this.uniformGroup = new ir(e) : this.uniformGroup = new ir({}), this.disposeRunner = new Bt("disposeShader");
    }
    return r.prototype.checkUniformExists = function(t, e) {
      if (e.uniforms[t])
        return !0;
      for (var i in e.uniforms) {
        var n = e.uniforms[i];
        if (n.group && this.checkUniformExists(t, n))
          return !0;
      }
      return !1;
    }, r.prototype.destroy = function() {
      this.uniformGroup = null, this.disposeRunner.emit(this), this.disposeRunner.destroy();
    }, Object.defineProperty(r.prototype, "uniforms", {
      /**
       * Shader uniform values, shortcut for `uniformGroup.uniforms`.
       * @readonly
       */
      get: function() {
        return this.uniformGroup.uniforms;
      },
      enumerable: !1,
      configurable: !0
    }), r.from = function(t, e, i) {
      var n = vi.from(t, e);
      return new r(n, i);
    }, r;
  }()
), $n = 0, Qn = 1, Jn = 2, ta = 3, ea = 4, ra = 5, lr = (
  /** @class */
  function() {
    function r() {
      this.data = 0, this.blendMode = z.NORMAL, this.polygonOffset = 0, this.blend = !0, this.depthMask = !0;
    }
    return Object.defineProperty(r.prototype, "blend", {
      /**
       * Activates blending of the computed fragment color values.
       * @default true
       */
      get: function() {
        return !!(this.data & 1 << $n);
      },
      set: function(t) {
        !!(this.data & 1 << $n) !== t && (this.data ^= 1 << $n);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "offsets", {
      /**
       * Activates adding an offset to depth values of polygon's fragments
       * @default false
       */
      get: function() {
        return !!(this.data & 1 << Qn);
      },
      set: function(t) {
        !!(this.data & 1 << Qn) !== t && (this.data ^= 1 << Qn);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "culling", {
      /**
       * Activates culling of polygons.
       * @default false
       */
      get: function() {
        return !!(this.data & 1 << Jn);
      },
      set: function(t) {
        !!(this.data & 1 << Jn) !== t && (this.data ^= 1 << Jn);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "depthTest", {
      /**
       * Activates depth comparisons and updates to the depth buffer.
       * @default false
       */
      get: function() {
        return !!(this.data & 1 << ta);
      },
      set: function(t) {
        !!(this.data & 1 << ta) !== t && (this.data ^= 1 << ta);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "depthMask", {
      /**
       * Enables or disables writing to the depth buffer.
       * @default true
       */
      get: function() {
        return !!(this.data & 1 << ra);
      },
      set: function(t) {
        !!(this.data & 1 << ra) !== t && (this.data ^= 1 << ra);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "clockwiseFrontFace", {
      /**
       * Specifies whether or not front or back-facing polygons can be culled.
       * @default false
       */
      get: function() {
        return !!(this.data & 1 << ea);
      },
      set: function(t) {
        !!(this.data & 1 << ea) !== t && (this.data ^= 1 << ea);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "blendMode", {
      /**
       * The blend mode to be applied when this state is set. Apply a value of `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
       * Setting this mode to anything other than NO_BLEND will automatically switch blending on.
       * @default PIXI.BLEND_MODES.NORMAL
       */
      get: function() {
        return this._blendMode;
      },
      set: function(t) {
        this.blend = t !== z.NONE, this._blendMode = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "polygonOffset", {
      /**
       * The polygon offset. Setting this property to anything other than 0 will automatically enable polygon offset fill.
       * @default 0
       */
      get: function() {
        return this._polygonOffset;
      },
      set: function(t) {
        this.offsets = !!t, this._polygonOffset = t;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.toString = function() {
      return "[@pixi/core:State " + ("blendMode=" + this.blendMode + " ") + ("clockwiseFrontFace=" + this.clockwiseFrontFace + " ") + ("culling=" + this.culling + " ") + ("depthMask=" + this.depthMask + " ") + ("polygonOffset=" + this.polygonOffset) + "]";
    }, r.for2d = function() {
      var t = new r();
      return t.depthTest = !1, t.blend = !0, t;
    }, r;
  }()
), cg = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void){
   gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`, dg = `attribute vec2 aVertexPosition;

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
`, ke = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e, i, n) {
      var a = this, o = vi.from(e || t.defaultVertexSrc, i || t.defaultFragmentSrc);
      return a = r.call(this, o, n) || this, a.padding = 0, a.resolution = k.FILTER_RESOLUTION, a.multisample = k.FILTER_MULTISAMPLE, a.enabled = !0, a.autoFit = !0, a.state = new lr(), a;
    }
    return t.prototype.apply = function(e, i, n, a, o) {
      e.applyFilter(this, i, n, a);
    }, Object.defineProperty(t.prototype, "blendMode", {
      /**
       * Sets the blend mode of the filter.
       * @default PIXI.BLEND_MODES.NORMAL
       */
      get: function() {
        return this.state.blendMode;
      },
      set: function(e) {
        this.state.blendMode = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "resolution", {
      /**
       * The resolution of the filter. Setting this to be lower will lower the quality but
       * increase the performance of the filter.
       */
      get: function() {
        return this._resolution;
      },
      set: function(e) {
        this._resolution = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t, "defaultVertexSrc", {
      /**
       * The default vertex shader source
       * @constant
       */
      get: function() {
        return dg;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t, "defaultFragmentSrc", {
      /**
       * The default fragment shader source
       * @constant
       */
      get: function() {
        return cg;
      },
      enumerable: !1,
      configurable: !0
    }), t;
  }(Fe)
), pg = `attribute vec2 aVertexPosition;
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
`, vg = `varying vec2 vMaskCoord;
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
`, tu = new It(), Uo = (
  /** @class */
  function() {
    function r(t, e) {
      this._texture = t, this.mapCoord = new It(), this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._textureID = -1, this._updateID = 0, this.clampOffset = 0, this.clampMargin = typeof e > "u" ? 0.5 : e, this.isSimple = !1;
    }
    return Object.defineProperty(r.prototype, "texture", {
      /** Texture property. */
      get: function() {
        return this._texture;
      },
      set: function(t) {
        this._texture = t, this._textureID = -1;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.multiplyUvs = function(t, e) {
      e === void 0 && (e = t);
      for (var i = this.mapCoord, n = 0; n < t.length; n += 2) {
        var a = t[n], o = t[n + 1];
        e[n] = a * i.a + o * i.c + i.tx, e[n + 1] = a * i.b + o * i.d + i.ty;
      }
      return e;
    }, r.prototype.update = function(t) {
      var e = this._texture;
      if (!e || !e.valid || !t && this._textureID === e._updateID)
        return !1;
      this._textureID = e._updateID, this._updateID++;
      var i = e._uvs;
      this.mapCoord.set(i.x1 - i.x0, i.y1 - i.y0, i.x3 - i.x0, i.y3 - i.y0, i.x0, i.y0);
      var n = e.orig, a = e.trim;
      a && (tu.set(n.width / a.width, 0, 0, n.height / a.height, -a.x / a.width, -a.y / a.height), this.mapCoord.append(tu));
      var o = e.baseTexture, s = this.uClampFrame, u = this.clampMargin / o.resolution, h = this.clampOffset;
      return s[0] = (e._frame.x + u + h) / o.width, s[1] = (e._frame.y + u + h) / o.height, s[2] = (e._frame.x + e._frame.width - u + h) / o.width, s[3] = (e._frame.y + e._frame.height - u + h) / o.height, this.uClampOffset[0] = h / o.realWidth, this.uClampOffset[1] = h / o.realHeight, this.isSimple = e._frame.width === o.width && e._frame.height === o.height && e.rotate === 0, !0;
    }, r;
  }()
), _g = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e, i, n) {
      var a = this, o = null;
      return typeof e != "string" && i === void 0 && n === void 0 && (o = e, e = void 0, i = void 0, n = void 0), a = r.call(this, e || pg, i || vg, n) || this, a.maskSprite = o, a.maskMatrix = new It(), a;
    }
    return Object.defineProperty(t.prototype, "maskSprite", {
      /**
       * Sprite mask
       * @type {PIXI.DisplayObject}
       */
      get: function() {
        return this._maskSprite;
      },
      set: function(e) {
        this._maskSprite = e, this._maskSprite && (this._maskSprite.renderable = !1);
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.apply = function(e, i, n, a) {
      var o = this._maskSprite, s = o._texture;
      s.valid && (s.uvMatrix || (s.uvMatrix = new Uo(s, 0)), s.uvMatrix.update(), this.uniforms.npmAlpha = s.baseTexture.alphaMode ? 0 : 1, this.uniforms.mask = s, this.uniforms.otherMatrix = e.calculateSpriteMatrix(this.maskMatrix, o).prepend(s.uvMatrix.mapCoord), this.uniforms.alpha = o.worldAlpha, this.uniforms.maskClamp = s.uvMatrix.uClampFrame, e.applyFilter(this, i, n, a));
    }, t;
  }(ke)
), yg = (
  /** @class */
  function() {
    function r(t) {
      this.renderer = t, this.enableScissor = !0, this.alphaMaskPool = [], this.maskDataPool = [], this.maskStack = [], this.alphaMaskIndex = 0;
    }
    return r.prototype.setMaskStack = function(t) {
      this.maskStack = t, this.renderer.scissor.setMaskStack(t), this.renderer.stencil.setMaskStack(t);
    }, r.prototype.push = function(t, e) {
      var i = e;
      if (!i.isMaskData) {
        var n = this.maskDataPool.pop() || new $y();
        n.pooled = !0, n.maskObject = e, i = n;
      }
      var a = this.maskStack.length !== 0 ? this.maskStack[this.maskStack.length - 1] : null;
      if (i.copyCountersOrReset(a), i._colorMask = a ? a._colorMask : 15, i.autoDetect && this.detect(i), i._target = t, i.type !== Rt.SPRITE && this.maskStack.push(i), i.enabled)
        switch (i.type) {
          case Rt.SCISSOR:
            this.renderer.scissor.push(i);
            break;
          case Rt.STENCIL:
            this.renderer.stencil.push(i);
            break;
          case Rt.SPRITE:
            i.copyCountersOrReset(null), this.pushSpriteMask(i);
            break;
          case Rt.COLOR:
            this.pushColorMask(i);
            break;
        }
      i.type === Rt.SPRITE && this.maskStack.push(i);
    }, r.prototype.pop = function(t) {
      var e = this.maskStack.pop();
      if (!(!e || e._target !== t)) {
        if (e.enabled)
          switch (e.type) {
            case Rt.SCISSOR:
              this.renderer.scissor.pop(e);
              break;
            case Rt.STENCIL:
              this.renderer.stencil.pop(e.maskObject);
              break;
            case Rt.SPRITE:
              this.popSpriteMask(e);
              break;
            case Rt.COLOR:
              this.popColorMask(e);
              break;
          }
        if (e.reset(), e.pooled && this.maskDataPool.push(e), this.maskStack.length !== 0) {
          var i = this.maskStack[this.maskStack.length - 1];
          i.type === Rt.SPRITE && i._filters && (i._filters[0].maskSprite = i.maskObject);
        }
      }
    }, r.prototype.detect = function(t) {
      var e = t.maskObject;
      e ? e.isSprite ? t.type = Rt.SPRITE : this.enableScissor && this.renderer.scissor.testScissor(t) ? t.type = Rt.SCISSOR : t.type = Rt.STENCIL : t.type = Rt.COLOR;
    }, r.prototype.pushSpriteMask = function(t) {
      var e, i, n = t.maskObject, a = t._target, o = t._filters;
      o || (o = this.alphaMaskPool[this.alphaMaskIndex], o || (o = this.alphaMaskPool[this.alphaMaskIndex] = [new _g()]));
      var s = this.renderer, u = s.renderTexture, h, l;
      if (u.current) {
        var f = u.current;
        h = t.resolution || f.resolution, l = (e = t.multisample) !== null && e !== void 0 ? e : f.multisample;
      } else
        h = t.resolution || s.resolution, l = (i = t.multisample) !== null && i !== void 0 ? i : s.multisample;
      o[0].resolution = h, o[0].multisample = l, o[0].maskSprite = n;
      var c = a.filterArea;
      a.filterArea = n.getBounds(!0), s.filter.push(a, o), a.filterArea = c, t._filters || this.alphaMaskIndex++;
    }, r.prototype.popSpriteMask = function(t) {
      this.renderer.filter.pop(), t._filters ? t._filters[0].maskSprite = null : (this.alphaMaskIndex--, this.alphaMaskPool[this.alphaMaskIndex][0].maskSprite = null);
    }, r.prototype.pushColorMask = function(t) {
      var e = t._colorMask, i = t._colorMask = e & t.colorMask;
      i !== e && this.renderer.gl.colorMask((i & 1) !== 0, (i & 2) !== 0, (i & 4) !== 0, (i & 8) !== 0);
    }, r.prototype.popColorMask = function(t) {
      var e = t._colorMask, i = this.maskStack.length > 0 ? this.maskStack[this.maskStack.length - 1]._colorMask : 15;
      i !== e && this.renderer.gl.colorMask((i & 1) !== 0, (i & 2) !== 0, (i & 4) !== 0, (i & 8) !== 0);
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), $h = (
  /** @class */
  function() {
    function r(t) {
      this.renderer = t, this.maskStack = [], this.glConst = 0;
    }
    return r.prototype.getStackLength = function() {
      return this.maskStack.length;
    }, r.prototype.setMaskStack = function(t) {
      var e = this.renderer.gl, i = this.getStackLength();
      this.maskStack = t;
      var n = this.getStackLength();
      n !== i && (n === 0 ? e.disable(this.glConst) : (e.enable(this.glConst), this._useCurrent()));
    }, r.prototype._useCurrent = function() {
    }, r.prototype.destroy = function() {
      this.renderer = null, this.maskStack = null;
    }, r;
  }()
), eu = new It(), ru = [], gg = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e) {
      var i = r.call(this, e) || this;
      return i.glConst = k.ADAPTER.getWebGLRenderingContext().SCISSOR_TEST, i;
    }
    return t.prototype.getStackLength = function() {
      var e = this.maskStack[this.maskStack.length - 1];
      return e ? e._scissorCounter : 0;
    }, t.prototype.calcScissorRect = function(e) {
      var i;
      if (!e._scissorRectLocal) {
        var n = e._scissorRect, a = e.maskObject, o = this.renderer, s = o.renderTexture, u = a.getBounds(!0, (i = ru.pop()) !== null && i !== void 0 ? i : new st());
        this.roundFrameToPixels(u, s.current ? s.current.resolution : o.resolution, s.sourceFrame, s.destinationFrame, o.projection.transform), n && u.fit(n), e._scissorRectLocal = u;
      }
    }, t.isMatrixRotated = function(e) {
      if (!e)
        return !1;
      var i = e.a, n = e.b, a = e.c, o = e.d;
      return (Math.abs(n) > 1e-4 || Math.abs(a) > 1e-4) && (Math.abs(i) > 1e-4 || Math.abs(o) > 1e-4);
    }, t.prototype.testScissor = function(e) {
      var i = e.maskObject;
      if (!i.isFastRect || !i.isFastRect() || t.isMatrixRotated(i.worldTransform) || t.isMatrixRotated(this.renderer.projection.transform))
        return !1;
      this.calcScissorRect(e);
      var n = e._scissorRectLocal;
      return n.width > 0 && n.height > 0;
    }, t.prototype.roundFrameToPixels = function(e, i, n, a, o) {
      t.isMatrixRotated(o) || (o = o ? eu.copyFrom(o) : eu.identity(), o.translate(-n.x, -n.y).scale(a.width / n.width, a.height / n.height).translate(a.x, a.y), this.renderer.filter.transformAABB(o, e), e.fit(a), e.x = Math.round(e.x * i), e.y = Math.round(e.y * i), e.width = Math.round(e.width * i), e.height = Math.round(e.height * i));
    }, t.prototype.push = function(e) {
      e._scissorRectLocal || this.calcScissorRect(e);
      var i = this.renderer.gl;
      e._scissorRect || i.enable(i.SCISSOR_TEST), e._scissorCounter++, e._scissorRect = e._scissorRectLocal, this._useCurrent();
    }, t.prototype.pop = function(e) {
      var i = this.renderer.gl;
      e && ru.push(e._scissorRectLocal), this.getStackLength() > 0 ? this._useCurrent() : i.disable(i.SCISSOR_TEST);
    }, t.prototype._useCurrent = function() {
      var e = this.maskStack[this.maskStack.length - 1]._scissorRect, i;
      this.renderer.renderTexture.current ? i = e.y : i = this.renderer.height - e.height - e.y, this.renderer.gl.scissor(e.x, i, e.width, e.height);
    }, t;
  }($h)
), mg = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e) {
      var i = r.call(this, e) || this;
      return i.glConst = k.ADAPTER.getWebGLRenderingContext().STENCIL_TEST, i;
    }
    return t.prototype.getStackLength = function() {
      var e = this.maskStack[this.maskStack.length - 1];
      return e ? e._stencilCounter : 0;
    }, t.prototype.push = function(e) {
      var i = e.maskObject, n = this.renderer.gl, a = e._stencilCounter;
      a === 0 && (this.renderer.framebuffer.forceStencil(), n.clearStencil(0), n.clear(n.STENCIL_BUFFER_BIT), n.enable(n.STENCIL_TEST)), e._stencilCounter++;
      var o = e._colorMask;
      o !== 0 && (e._colorMask = 0, n.colorMask(!1, !1, !1, !1)), n.stencilFunc(n.EQUAL, a, 4294967295), n.stencilOp(n.KEEP, n.KEEP, n.INCR), i.renderable = !0, i.render(this.renderer), this.renderer.batch.flush(), i.renderable = !1, o !== 0 && (e._colorMask = o, n.colorMask((o & 1) !== 0, (o & 2) !== 0, (o & 4) !== 0, (o & 8) !== 0)), this._useCurrent();
    }, t.prototype.pop = function(e) {
      var i = this.renderer.gl;
      if (this.getStackLength() === 0)
        i.disable(i.STENCIL_TEST);
      else {
        var n = this.maskStack.length !== 0 ? this.maskStack[this.maskStack.length - 1] : null, a = n ? n._colorMask : 15;
        a !== 0 && (n._colorMask = 0, i.colorMask(!1, !1, !1, !1)), i.stencilOp(i.KEEP, i.KEEP, i.DECR), e.renderable = !0, e.render(this.renderer), this.renderer.batch.flush(), e.renderable = !1, a !== 0 && (n._colorMask = a, i.colorMask((a & 1) !== 0, (a & 2) !== 0, (a & 4) !== 0, (a & 8) !== 0)), this._useCurrent();
      }
    }, t.prototype._useCurrent = function() {
      var e = this.renderer.gl;
      e.stencilFunc(e.EQUAL, this.getStackLength(), 4294967295), e.stencilOp(e.KEEP, e.KEEP, e.KEEP);
    }, t;
  }($h)
), bg = (
  /** @class */
  function() {
    function r(t) {
      this.renderer = t, this.destinationFrame = null, this.sourceFrame = null, this.defaultFrame = null, this.projectionMatrix = new It(), this.transform = null;
    }
    return r.prototype.update = function(t, e, i, n) {
      this.destinationFrame = t || this.destinationFrame || this.defaultFrame, this.sourceFrame = e || this.sourceFrame || t, this.calculateProjection(this.destinationFrame, this.sourceFrame, i, n), this.transform && this.projectionMatrix.append(this.transform);
      var a = this.renderer;
      a.globalUniforms.uniforms.projectionMatrix = this.projectionMatrix, a.globalUniforms.update(), a.shader.shader && a.shader.syncUniformGroup(a.shader.shader.uniforms.globals);
    }, r.prototype.calculateProjection = function(t, e, i, n) {
      var a = this.projectionMatrix, o = n ? -1 : 1;
      a.identity(), a.a = 1 / e.width * 2, a.d = o * (1 / e.height * 2), a.tx = -1 - e.x * a.a, a.ty = -o - e.y * a.d;
    }, r.prototype.setTransform = function(t) {
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), Xe = new st(), kr = new st(), Eg = (
  /** @class */
  function() {
    function r(t) {
      this.renderer = t, this.clearColor = t._backgroundColorRgba, this.defaultMaskStack = [], this.current = null, this.sourceFrame = new st(), this.destinationFrame = new st(), this.viewportFrame = new st();
    }
    return r.prototype.bind = function(t, e, i) {
      t === void 0 && (t = null);
      var n = this.renderer;
      this.current = t;
      var a, o, s;
      t ? (a = t.baseTexture, s = a.resolution, e || (Xe.width = t.frame.width, Xe.height = t.frame.height, e = Xe), i || (kr.x = t.frame.x, kr.y = t.frame.y, kr.width = e.width, kr.height = e.height, i = kr), o = a.framebuffer) : (s = n.resolution, e || (Xe.width = n.screen.width, Xe.height = n.screen.height, e = Xe), i || (i = Xe, i.width = e.width, i.height = e.height));
      var u = this.viewportFrame;
      u.x = i.x * s, u.y = i.y * s, u.width = i.width * s, u.height = i.height * s, t || (u.y = n.view.height - (u.y + u.height)), u.ceil(), this.renderer.framebuffer.bind(o, u), this.renderer.projection.update(i, e, s, !o), t ? this.renderer.mask.setMaskStack(a.maskStack) : this.renderer.mask.setMaskStack(this.defaultMaskStack), this.sourceFrame.copyFrom(e), this.destinationFrame.copyFrom(i);
    }, r.prototype.clear = function(t, e) {
      this.current ? t = t || this.current.baseTexture.clearColor : t = t || this.clearColor;
      var i = this.destinationFrame, n = this.current ? this.current.baseTexture : this.renderer.screen, a = i.width !== n.width || i.height !== n.height;
      if (a) {
        var o = this.viewportFrame, s = o.x, u = o.y, h = o.width, l = o.height;
        s = Math.round(s), u = Math.round(u), h = Math.round(h), l = Math.round(l), this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST), this.renderer.gl.scissor(s, u, h, l);
      }
      this.renderer.framebuffer.clear(t[0], t[1], t[2], t[3], e), a && this.renderer.scissor.pop();
    }, r.prototype.resize = function() {
      this.bind(null);
    }, r.prototype.reset = function() {
      this.bind(null);
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
);
function Tg(r, t, e, i, n) {
  e.buffer.update(n);
}
var xg = {
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
}, Qh = {
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
function wg(r) {
  for (var t = r.map(function(u) {
    return {
      data: u,
      offset: 0,
      dataLen: 0,
      dirty: 0
    };
  }), e = 0, i = 0, n = 0, a = 0; a < t.length; a++) {
    var o = t[a];
    if (e = Qh[o.data.type], o.data.size > 1 && (e = Math.max(e, 16) * o.data.size), o.dataLen = e, i % e !== 0 && i < 16) {
      var s = i % e % 16;
      i += s, n += s;
    }
    i + e > 16 ? (n = Math.ceil(n / 16) * 16, o.offset = n, n += e, i = e) : (o.offset = n, i += e, n += e);
  }
  return n = Math.ceil(n / 16) * 16, { uboElements: t, size: n };
}
function Sg(r, t) {
  var e = [];
  for (var i in r)
    t[i] && e.push(t[i]);
  return e.sort(function(n, a) {
    return n.index - a.index;
  }), e;
}
function Pg(r, t) {
  if (!r.autoManage)
    return { size: 0, syncFunc: Tg };
  for (var e = Sg(r.uniforms, t), i = wg(e), n = i.uboElements, a = i.size, o = [`
    var v = null;
    var v2 = null;
    var cv = null;
    var t = 0;
    var gl = renderer.gl
    var index = 0;
    var data = buffer.data;
    `], s = 0; s < n.length; s++) {
    for (var u = n[s], h = r.uniforms[u.data.name], l = u.data.name, f = !1, c = 0; c < Or.length; c++) {
      var d = Or[c];
      if (d.codeUbo && d.test(u.data, h)) {
        o.push("offset = " + u.offset / 4 + ";", Or[c].codeUbo(u.data.name, h)), f = !0;
        break;
      }
    }
    if (!f)
      if (u.data.size > 1) {
        var p = Zh(u.data.type), _ = Math.max(Qh[u.data.type] / 16, 1), v = p / _, y = (4 - v % 4) % 4;
        o.push(`
                cv = ud.` + l + `.value;
                v = uv.` + l + `;
                offset = ` + u.offset / 4 + `;

                t = 0;

                for(var i=0; i < ` + u.data.size * _ + `; i++)
                {
                    for(var j = 0; j < ` + v + `; j++)
                    {
                        data[offset++] = v[t++];
                    }
                    offset += ` + y + `;
                }

                `);
      } else {
        var g = xg[u.data.type];
        o.push(`
                cv = ud.` + l + `.value;
                v = uv.` + l + `;
                offset = ` + u.offset / 4 + `;
                ` + g + `;
                `);
      }
  }
  return o.push(`
       renderer.buffer.update(buffer);
    `), {
    size: a,
    // eslint-disable-next-line no-new-func
    syncFunc: new Function("ud", "uv", "renderer", "syncData", "buffer", o.join(`
`))
  };
}
var Ag = (
  /** @class */
  function() {
    function r(t, e) {
      this.program = t, this.uniformData = e, this.uniformGroups = {}, this.uniformDirtyGroups = {}, this.uniformBufferBindings = {};
    }
    return r.prototype.destroy = function() {
      this.uniformData = null, this.uniformGroups = null, this.uniformDirtyGroups = null, this.uniformBufferBindings = null, this.program = null;
    }, r;
  }()
);
function Rg(r, t) {
  for (var e = {}, i = t.getProgramParameter(r, t.ACTIVE_ATTRIBUTES), n = 0; n < i; n++) {
    var a = t.getActiveAttrib(r, n);
    if (a.name.indexOf("gl_") !== 0) {
      var o = Kh(t, a.type), s = {
        type: o,
        name: a.name,
        size: Zh(o),
        location: t.getAttribLocation(r, a.name)
      };
      e[a.name] = s;
    }
  }
  return e;
}
function Og(r, t) {
  for (var e = {}, i = t.getProgramParameter(r, t.ACTIVE_UNIFORMS), n = 0; n < i; n++) {
    var a = t.getActiveUniform(r, n), o = a.name.replace(/\[.*?\]$/, ""), s = !!a.name.match(/\[.*?\]$/), u = Kh(t, a.type);
    e[o] = {
      name: o,
      index: n,
      type: u,
      size: a.size,
      isArray: s,
      value: Yh(u, a.size)
    };
  }
  return e;
}
function Ig(r, t) {
  var e = Ks(r, r.VERTEX_SHADER, t.vertexSrc), i = Ks(r, r.FRAGMENT_SHADER, t.fragmentSrc), n = r.createProgram();
  if (r.attachShader(n, e), r.attachShader(n, i), r.linkProgram(n), r.getProgramParameter(n, r.LINK_STATUS) || Qy(r, n, e, i), t.attributeData = Rg(n, r), t.uniformData = Og(n, r), !/^[ \t]*#[ \t]*version[ \t]+300[ \t]+es[ \t]*$/m.test(t.vertexSrc)) {
    var a = Object.keys(t.attributeData);
    a.sort(function(l, f) {
      return l > f ? 1 : -1;
    });
    for (var o = 0; o < a.length; o++)
      t.attributeData[a[o]].location = o, r.bindAttribLocation(n, o, a[o]);
    r.linkProgram(n);
  }
  r.deleteShader(e), r.deleteShader(i);
  var s = {};
  for (var o in t.uniformData) {
    var u = t.uniformData[o];
    s[o] = {
      location: r.getUniformLocation(n, o),
      value: Yh(u.type, u.size)
    };
  }
  var h = new Ag(n, s);
  return h;
}
var Cg = 0, Di = { textureCount: 0, uboCount: 0 }, Mg = (
  /** @class */
  function() {
    function r(t) {
      this.destroyed = !1, this.renderer = t, this.systemCheck(), this.gl = null, this.shader = null, this.program = null, this.cache = {}, this._uboCache = {}, this.id = Cg++;
    }
    return r.prototype.systemCheck = function() {
      if (!ug())
        throw new Error("Current environment does not allow unsafe-eval, please use @pixi/unsafe-eval module to enable support.");
    }, r.prototype.contextChange = function(t) {
      this.gl = t, this.reset();
    }, r.prototype.bind = function(t, e) {
      t.disposeRunner.add(this), t.uniforms.globals = this.renderer.globalUniforms;
      var i = t.program, n = i.glPrograms[this.renderer.CONTEXT_UID] || this.generateProgram(t);
      return this.shader = t, this.program !== i && (this.program = i, this.gl.useProgram(n.program)), e || (Di.textureCount = 0, Di.uboCount = 0, this.syncUniformGroup(t.uniformGroup, Di)), n;
    }, r.prototype.setUniforms = function(t) {
      var e = this.shader.program, i = e.glPrograms[this.renderer.CONTEXT_UID];
      e.syncUniforms(i.uniformData, t, this.renderer);
    }, r.prototype.syncUniformGroup = function(t, e) {
      var i = this.getGlProgram();
      (!t.static || t.dirtyId !== i.uniformDirtyGroups[t.id]) && (i.uniformDirtyGroups[t.id] = t.dirtyId, this.syncUniforms(t, i, e));
    }, r.prototype.syncUniforms = function(t, e, i) {
      var n = t.syncUniforms[this.shader.program.id] || this.createSyncGroups(t);
      n(e.uniformData, t.uniforms, this.renderer, i);
    }, r.prototype.createSyncGroups = function(t) {
      var e = this.getSignature(t, this.shader.program.uniformData, "u");
      return this.cache[e] || (this.cache[e] = ng(t, this.shader.program.uniformData)), t.syncUniforms[this.shader.program.id] = this.cache[e], t.syncUniforms[this.shader.program.id];
    }, r.prototype.syncUniformBufferGroup = function(t, e) {
      var i = this.getGlProgram();
      if (!t.static || t.dirtyId !== 0 || !i.uniformGroups[t.id]) {
        t.dirtyId = 0;
        var n = i.uniformGroups[t.id] || this.createSyncBufferGroup(t, i, e);
        t.buffer.update(), n(i.uniformData, t.uniforms, this.renderer, Di, t.buffer);
      }
      this.renderer.buffer.bindBufferBase(t.buffer, i.uniformBufferBindings[e]);
    }, r.prototype.createSyncBufferGroup = function(t, e, i) {
      var n = this.renderer.gl;
      this.renderer.buffer.bind(t.buffer);
      var a = this.gl.getUniformBlockIndex(e.program, i);
      e.uniformBufferBindings[i] = this.shader.uniformBindCount, n.uniformBlockBinding(e.program, a, this.shader.uniformBindCount), this.shader.uniformBindCount++;
      var o = this.getSignature(t, this.shader.program.uniformData, "ubo"), s = this._uboCache[o];
      if (s || (s = this._uboCache[o] = Pg(t, this.shader.program.uniformData)), t.autoManage) {
        var u = new Float32Array(s.size / 4);
        t.buffer.update(u);
      }
      return e.uniformGroups[t.id] = s.syncFunc, e.uniformGroups[t.id];
    }, r.prototype.getSignature = function(t, e, i) {
      var n = t.uniforms, a = [i + "-"];
      for (var o in n)
        a.push(o), e[o] && a.push(e[o].type);
      return a.join("-");
    }, r.prototype.getGlProgram = function() {
      return this.shader ? this.shader.program.glPrograms[this.renderer.CONTEXT_UID] : null;
    }, r.prototype.generateProgram = function(t) {
      var e = this.gl, i = t.program, n = Ig(e, i);
      return i.glPrograms[this.renderer.CONTEXT_UID] = n, n;
    }, r.prototype.reset = function() {
      this.program = null, this.shader = null;
    }, r.prototype.disposeShader = function(t) {
      this.shader === t && (this.shader = null);
    }, r.prototype.destroy = function() {
      this.renderer = null, this.destroyed = !0;
    }, r;
  }()
);
function Dg(r, t) {
  return t === void 0 && (t = []), t[z.NORMAL] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.ADD] = [r.ONE, r.ONE], t[z.MULTIPLY] = [r.DST_COLOR, r.ONE_MINUS_SRC_ALPHA, r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.SCREEN] = [r.ONE, r.ONE_MINUS_SRC_COLOR, r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.OVERLAY] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.DARKEN] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.LIGHTEN] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.COLOR_DODGE] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.COLOR_BURN] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.HARD_LIGHT] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.SOFT_LIGHT] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.DIFFERENCE] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.EXCLUSION] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.HUE] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.SATURATION] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.COLOR] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.LUMINOSITY] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.NONE] = [0, 0], t[z.NORMAL_NPM] = [r.SRC_ALPHA, r.ONE_MINUS_SRC_ALPHA, r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.ADD_NPM] = [r.SRC_ALPHA, r.ONE, r.ONE, r.ONE], t[z.SCREEN_NPM] = [r.SRC_ALPHA, r.ONE_MINUS_SRC_COLOR, r.ONE, r.ONE_MINUS_SRC_ALPHA], t[z.SRC_IN] = [r.DST_ALPHA, r.ZERO], t[z.SRC_OUT] = [r.ONE_MINUS_DST_ALPHA, r.ZERO], t[z.SRC_ATOP] = [r.DST_ALPHA, r.ONE_MINUS_SRC_ALPHA], t[z.DST_OVER] = [r.ONE_MINUS_DST_ALPHA, r.ONE], t[z.DST_IN] = [r.ZERO, r.SRC_ALPHA], t[z.DST_OUT] = [r.ZERO, r.ONE_MINUS_SRC_ALPHA], t[z.DST_ATOP] = [r.ONE_MINUS_DST_ALPHA, r.SRC_ALPHA], t[z.XOR] = [r.ONE_MINUS_DST_ALPHA, r.ONE_MINUS_SRC_ALPHA], t[z.SUBTRACT] = [r.ONE, r.ONE, r.ONE, r.ONE, r.FUNC_REVERSE_SUBTRACT, r.FUNC_ADD], t;
}
var Fg = 0, Ng = 1, Bg = 2, Lg = 3, Ug = 4, Gg = 5, kg = (
  /** @class */
  function() {
    function r() {
      this.gl = null, this.stateId = 0, this.polygonOffset = 0, this.blendMode = z.NONE, this._blendEq = !1, this.map = [], this.map[Fg] = this.setBlend, this.map[Ng] = this.setOffset, this.map[Bg] = this.setCullFace, this.map[Lg] = this.setDepthTest, this.map[Ug] = this.setFrontFace, this.map[Gg] = this.setDepthMask, this.checks = [], this.defaultState = new lr(), this.defaultState.blend = !0;
    }
    return r.prototype.contextChange = function(t) {
      this.gl = t, this.blendModes = Dg(t), this.set(this.defaultState), this.reset();
    }, r.prototype.set = function(t) {
      if (t = t || this.defaultState, this.stateId !== t.data) {
        for (var e = this.stateId ^ t.data, i = 0; e; )
          e & 1 && this.map[i].call(this, !!(t.data & 1 << i)), e = e >> 1, i++;
        this.stateId = t.data;
      }
      for (var i = 0; i < this.checks.length; i++)
        this.checks[i](this, t);
    }, r.prototype.forceState = function(t) {
      t = t || this.defaultState;
      for (var e = 0; e < this.map.length; e++)
        this.map[e].call(this, !!(t.data & 1 << e));
      for (var e = 0; e < this.checks.length; e++)
        this.checks[e](this, t);
      this.stateId = t.data;
    }, r.prototype.setBlend = function(t) {
      this.updateCheck(r.checkBlendMode, t), this.gl[t ? "enable" : "disable"](this.gl.BLEND);
    }, r.prototype.setOffset = function(t) {
      this.updateCheck(r.checkPolygonOffset, t), this.gl[t ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL);
    }, r.prototype.setDepthTest = function(t) {
      this.gl[t ? "enable" : "disable"](this.gl.DEPTH_TEST);
    }, r.prototype.setDepthMask = function(t) {
      this.gl.depthMask(t);
    }, r.prototype.setCullFace = function(t) {
      this.gl[t ? "enable" : "disable"](this.gl.CULL_FACE);
    }, r.prototype.setFrontFace = function(t) {
      this.gl.frontFace(this.gl[t ? "CW" : "CCW"]);
    }, r.prototype.setBlendMode = function(t) {
      if (t !== this.blendMode) {
        this.blendMode = t;
        var e = this.blendModes[t], i = this.gl;
        e.length === 2 ? i.blendFunc(e[0], e[1]) : i.blendFuncSeparate(e[0], e[1], e[2], e[3]), e.length === 6 ? (this._blendEq = !0, i.blendEquationSeparate(e[4], e[5])) : this._blendEq && (this._blendEq = !1, i.blendEquationSeparate(i.FUNC_ADD, i.FUNC_ADD));
      }
    }, r.prototype.setPolygonOffset = function(t, e) {
      this.gl.polygonOffset(t, e);
    }, r.prototype.reset = function() {
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, !1), this.forceState(this.defaultState), this._blendEq = !0, this.blendMode = -1, this.setBlendMode(0);
    }, r.prototype.updateCheck = function(t, e) {
      var i = this.checks.indexOf(t);
      e && i === -1 ? this.checks.push(t) : !e && i !== -1 && this.checks.splice(i, 1);
    }, r.checkBlendMode = function(t, e) {
      t.setBlendMode(e.blendMode);
    }, r.checkPolygonOffset = function(t, e) {
      t.setPolygonOffset(1, e.polygonOffset);
    }, r.prototype.destroy = function() {
      this.gl = null;
    }, r;
  }()
), Hg = (
  /** @class */
  function() {
    function r(t) {
      this.renderer = t, this.count = 0, this.checkCount = 0, this.maxIdle = k.GC_MAX_IDLE, this.checkCountMax = k.GC_MAX_CHECK_COUNT, this.mode = k.GC_MODE;
    }
    return r.prototype.postrender = function() {
      this.renderer.renderingToScreen && (this.count++, this.mode !== an.MANUAL && (this.checkCount++, this.checkCount > this.checkCountMax && (this.checkCount = 0, this.run())));
    }, r.prototype.run = function() {
      for (var t = this.renderer.texture, e = t.managedTextures, i = !1, n = 0; n < e.length; n++) {
        var a = e[n];
        !a.framebuffer && this.count - a.touched > this.maxIdle && (t.destroyTexture(a, !0), e[n] = null, i = !0);
      }
      if (i) {
        for (var o = 0, n = 0; n < e.length; n++)
          e[n] !== null && (e[o++] = e[n]);
        e.length = o;
      }
    }, r.prototype.unload = function(t) {
      var e = this.renderer.texture, i = t._texture;
      i && !i.framebuffer && e.destroyTexture(i);
      for (var n = t.children.length - 1; n >= 0; n--)
        this.unload(t.children[n]);
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
);
function Xg(r) {
  var t, e, i, n, a, o, s, u, h, l, f, c, d, p, _, v, y, g, m, E, b, x, S;
  return "WebGL2RenderingContext" in globalThis && r instanceof globalThis.WebGL2RenderingContext ? S = (t = {}, t[V.UNSIGNED_BYTE] = (e = {}, e[B.RGBA] = r.RGBA8, e[B.RGB] = r.RGB8, e[B.RG] = r.RG8, e[B.RED] = r.R8, e[B.RGBA_INTEGER] = r.RGBA8UI, e[B.RGB_INTEGER] = r.RGB8UI, e[B.RG_INTEGER] = r.RG8UI, e[B.RED_INTEGER] = r.R8UI, e[B.ALPHA] = r.ALPHA, e[B.LUMINANCE] = r.LUMINANCE, e[B.LUMINANCE_ALPHA] = r.LUMINANCE_ALPHA, e), t[V.BYTE] = (i = {}, i[B.RGBA] = r.RGBA8_SNORM, i[B.RGB] = r.RGB8_SNORM, i[B.RG] = r.RG8_SNORM, i[B.RED] = r.R8_SNORM, i[B.RGBA_INTEGER] = r.RGBA8I, i[B.RGB_INTEGER] = r.RGB8I, i[B.RG_INTEGER] = r.RG8I, i[B.RED_INTEGER] = r.R8I, i), t[V.UNSIGNED_SHORT] = (n = {}, n[B.RGBA_INTEGER] = r.RGBA16UI, n[B.RGB_INTEGER] = r.RGB16UI, n[B.RG_INTEGER] = r.RG16UI, n[B.RED_INTEGER] = r.R16UI, n[B.DEPTH_COMPONENT] = r.DEPTH_COMPONENT16, n), t[V.SHORT] = (a = {}, a[B.RGBA_INTEGER] = r.RGBA16I, a[B.RGB_INTEGER] = r.RGB16I, a[B.RG_INTEGER] = r.RG16I, a[B.RED_INTEGER] = r.R16I, a), t[V.UNSIGNED_INT] = (o = {}, o[B.RGBA_INTEGER] = r.RGBA32UI, o[B.RGB_INTEGER] = r.RGB32UI, o[B.RG_INTEGER] = r.RG32UI, o[B.RED_INTEGER] = r.R32UI, o[B.DEPTH_COMPONENT] = r.DEPTH_COMPONENT24, o), t[V.INT] = (s = {}, s[B.RGBA_INTEGER] = r.RGBA32I, s[B.RGB_INTEGER] = r.RGB32I, s[B.RG_INTEGER] = r.RG32I, s[B.RED_INTEGER] = r.R32I, s), t[V.FLOAT] = (u = {}, u[B.RGBA] = r.RGBA32F, u[B.RGB] = r.RGB32F, u[B.RG] = r.RG32F, u[B.RED] = r.R32F, u[B.DEPTH_COMPONENT] = r.DEPTH_COMPONENT32F, u), t[V.HALF_FLOAT] = (h = {}, h[B.RGBA] = r.RGBA16F, h[B.RGB] = r.RGB16F, h[B.RG] = r.RG16F, h[B.RED] = r.R16F, h), t[V.UNSIGNED_SHORT_5_6_5] = (l = {}, l[B.RGB] = r.RGB565, l), t[V.UNSIGNED_SHORT_4_4_4_4] = (f = {}, f[B.RGBA] = r.RGBA4, f), t[V.UNSIGNED_SHORT_5_5_5_1] = (c = {}, c[B.RGBA] = r.RGB5_A1, c), t[V.UNSIGNED_INT_2_10_10_10_REV] = (d = {}, d[B.RGBA] = r.RGB10_A2, d[B.RGBA_INTEGER] = r.RGB10_A2UI, d), t[V.UNSIGNED_INT_10F_11F_11F_REV] = (p = {}, p[B.RGB] = r.R11F_G11F_B10F, p), t[V.UNSIGNED_INT_5_9_9_9_REV] = (_ = {}, _[B.RGB] = r.RGB9_E5, _), t[V.UNSIGNED_INT_24_8] = (v = {}, v[B.DEPTH_STENCIL] = r.DEPTH24_STENCIL8, v), t[V.FLOAT_32_UNSIGNED_INT_24_8_REV] = (y = {}, y[B.DEPTH_STENCIL] = r.DEPTH32F_STENCIL8, y), t) : S = (g = {}, g[V.UNSIGNED_BYTE] = (m = {}, m[B.RGBA] = r.RGBA, m[B.RGB] = r.RGB, m[B.ALPHA] = r.ALPHA, m[B.LUMINANCE] = r.LUMINANCE, m[B.LUMINANCE_ALPHA] = r.LUMINANCE_ALPHA, m), g[V.UNSIGNED_SHORT_5_6_5] = (E = {}, E[B.RGB] = r.RGB, E), g[V.UNSIGNED_SHORT_4_4_4_4] = (b = {}, b[B.RGBA] = r.RGBA, b), g[V.UNSIGNED_SHORT_5_5_5_1] = (x = {}, x[B.RGBA] = r.RGBA, x), g), S;
}
var ia = (
  /** @class */
  function() {
    function r(t) {
      this.texture = t, this.width = -1, this.height = -1, this.dirtyId = -1, this.dirtyStyleId = -1, this.mipmap = !1, this.wrapMode = 33071, this.type = V.UNSIGNED_BYTE, this.internalFormat = B.RGBA, this.samplerType = 0;
    }
    return r;
  }()
), jg = (
  /** @class */
  function() {
    function r(t) {
      this.renderer = t, this.boundTextures = [], this.currentLocation = -1, this.managedTextures = [], this._unknownBoundTextures = !1, this.unknownTexture = new ot(), this.hasIntegerTextures = !1;
    }
    return r.prototype.contextChange = function() {
      var t = this.gl = this.renderer.gl;
      this.CONTEXT_UID = this.renderer.CONTEXT_UID, this.webGLVersion = this.renderer.context.webGLVersion, this.internalFormats = Xg(t);
      var e = t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS);
      this.boundTextures.length = e;
      for (var i = 0; i < e; i++)
        this.boundTextures[i] = null;
      this.emptyTextures = {};
      var n = new ia(t.createTexture());
      t.bindTexture(t.TEXTURE_2D, n.texture), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, 1, 1, 0, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(4)), this.emptyTextures[t.TEXTURE_2D] = n, this.emptyTextures[t.TEXTURE_CUBE_MAP] = new ia(t.createTexture()), t.bindTexture(t.TEXTURE_CUBE_MAP, this.emptyTextures[t.TEXTURE_CUBE_MAP].texture);
      for (var i = 0; i < 6; i++)
        t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, t.RGBA, 1, 1, 0, t.RGBA, t.UNSIGNED_BYTE, null);
      t.texParameteri(t.TEXTURE_CUBE_MAP, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_CUBE_MAP, t.TEXTURE_MIN_FILTER, t.LINEAR);
      for (var i = 0; i < this.boundTextures.length; i++)
        this.bind(null, i);
    }, r.prototype.bind = function(t, e) {
      e === void 0 && (e = 0);
      var i = this.gl;
      if (t = t == null ? void 0 : t.castToBaseTexture(), t && t.valid && !t.parentTextureArray) {
        t.touched = this.renderer.textureGC.count;
        var n = t._glTextures[this.CONTEXT_UID] || this.initTexture(t);
        this.boundTextures[e] !== t && (this.currentLocation !== e && (this.currentLocation = e, i.activeTexture(i.TEXTURE0 + e)), i.bindTexture(t.target, n.texture)), n.dirtyId !== t.dirtyId ? (this.currentLocation !== e && (this.currentLocation = e, i.activeTexture(i.TEXTURE0 + e)), this.updateTexture(t)) : n.dirtyStyleId !== t.dirtyStyleId && this.updateTextureStyle(t), this.boundTextures[e] = t;
      } else
        this.currentLocation !== e && (this.currentLocation = e, i.activeTexture(i.TEXTURE0 + e)), i.bindTexture(i.TEXTURE_2D, this.emptyTextures[i.TEXTURE_2D].texture), this.boundTextures[e] = null;
    }, r.prototype.reset = function() {
      this._unknownBoundTextures = !0, this.hasIntegerTextures = !1, this.currentLocation = -1;
      for (var t = 0; t < this.boundTextures.length; t++)
        this.boundTextures[t] = this.unknownTexture;
    }, r.prototype.unbind = function(t) {
      var e = this, i = e.gl, n = e.boundTextures;
      if (this._unknownBoundTextures) {
        this._unknownBoundTextures = !1;
        for (var a = 0; a < n.length; a++)
          n[a] === this.unknownTexture && this.bind(null, a);
      }
      for (var a = 0; a < n.length; a++)
        n[a] === t && (this.currentLocation !== a && (i.activeTexture(i.TEXTURE0 + a), this.currentLocation = a), i.bindTexture(t.target, this.emptyTextures[t.target].texture), n[a] = null);
    }, r.prototype.ensureSamplerType = function(t) {
      var e = this, i = e.boundTextures, n = e.hasIntegerTextures, a = e.CONTEXT_UID;
      if (n)
        for (var o = t - 1; o >= 0; --o) {
          var s = i[o];
          if (s) {
            var u = s._glTextures[a];
            u.samplerType !== nn.FLOAT && this.renderer.texture.unbind(s);
          }
        }
    }, r.prototype.initTexture = function(t) {
      var e = new ia(this.gl.createTexture());
      return e.dirtyId = -1, t._glTextures[this.CONTEXT_UID] = e, this.managedTextures.push(t), t.on("dispose", this.destroyTexture, this), e;
    }, r.prototype.initTextureType = function(t, e) {
      var i, n;
      e.internalFormat = (n = (i = this.internalFormats[t.type]) === null || i === void 0 ? void 0 : i[t.format]) !== null && n !== void 0 ? n : t.format, this.webGLVersion === 2 && t.type === V.HALF_FLOAT ? e.type = this.gl.HALF_FLOAT : e.type = t.type;
    }, r.prototype.updateTexture = function(t) {
      var e = t._glTextures[this.CONTEXT_UID];
      if (e) {
        var i = this.renderer;
        if (this.initTextureType(t, e), t.resource && t.resource.upload(i, t, e))
          e.samplerType !== nn.FLOAT && (this.hasIntegerTextures = !0);
        else {
          var n = t.realWidth, a = t.realHeight, o = i.gl;
          (e.width !== n || e.height !== a || e.dirtyId < 0) && (e.width = n, e.height = a, o.texImage2D(t.target, 0, e.internalFormat, n, a, 0, t.format, e.type, null));
        }
        t.dirtyStyleId !== e.dirtyStyleId && this.updateTextureStyle(t), e.dirtyId = t.dirtyId;
      }
    }, r.prototype.destroyTexture = function(t, e) {
      var i = this.gl;
      if (t = t.castToBaseTexture(), t._glTextures[this.CONTEXT_UID] && (this.unbind(t), i.deleteTexture(t._glTextures[this.CONTEXT_UID].texture), t.off("dispose", this.destroyTexture, this), delete t._glTextures[this.CONTEXT_UID], !e)) {
        var n = this.managedTextures.indexOf(t);
        n !== -1 && Rr(this.managedTextures, n, 1);
      }
    }, r.prototype.updateTextureStyle = function(t) {
      var e = t._glTextures[this.CONTEXT_UID];
      e && ((t.mipmap === oe.POW2 || this.webGLVersion !== 2) && !t.isPowerOfTwo ? e.mipmap = !1 : e.mipmap = t.mipmap >= 1, this.webGLVersion !== 2 && !t.isPowerOfTwo ? e.wrapMode = de.CLAMP : e.wrapMode = t.wrapMode, t.resource && t.resource.style(this.renderer, t, e) || this.setStyle(t, e), e.dirtyStyleId = t.dirtyStyleId);
    }, r.prototype.setStyle = function(t, e) {
      var i = this.gl;
      if (e.mipmap && t.mipmap !== oe.ON_MANUAL && i.generateMipmap(t.target), i.texParameteri(t.target, i.TEXTURE_WRAP_S, e.wrapMode), i.texParameteri(t.target, i.TEXTURE_WRAP_T, e.wrapMode), e.mipmap) {
        i.texParameteri(t.target, i.TEXTURE_MIN_FILTER, t.scaleMode === fe.LINEAR ? i.LINEAR_MIPMAP_LINEAR : i.NEAREST_MIPMAP_NEAREST);
        var n = this.renderer.context.extensions.anisotropicFiltering;
        if (n && t.anisotropicLevel > 0 && t.scaleMode === fe.LINEAR) {
          var a = Math.min(t.anisotropicLevel, i.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
          i.texParameterf(t.target, n.TEXTURE_MAX_ANISOTROPY_EXT, a);
        }
      } else
        i.texParameteri(t.target, i.TEXTURE_MIN_FILTER, t.scaleMode === fe.LINEAR ? i.LINEAR : i.NEAREST);
      i.texParameteri(t.target, i.TEXTURE_MAG_FILTER, t.scaleMode === fe.LINEAR ? i.LINEAR : i.NEAREST);
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), na = new It(), Vg = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e, i) {
      e === void 0 && (e = ri.UNKNOWN);
      var n = r.call(this) || this;
      return i = Object.assign({}, k.RENDER_OPTIONS, i), n.options = i, n.type = e, n.screen = new st(0, 0, i.width, i.height), n.view = i.view || k.ADAPTER.createCanvas(), n.resolution = i.resolution || k.RESOLUTION, n.useContextAlpha = i.useContextAlpha, n.autoDensity = !!i.autoDensity, n.preserveDrawingBuffer = i.preserveDrawingBuffer, n.clearBeforeRender = i.clearBeforeRender, n._backgroundColor = 0, n._backgroundColorRgba = [0, 0, 0, 1], n._backgroundColorString = "#000000", n.backgroundColor = i.backgroundColor || n._backgroundColor, n.backgroundAlpha = i.backgroundAlpha, i.transparent !== void 0 && (ae("6.0.0", "Option transparent is deprecated, please use backgroundAlpha instead."), n.useContextAlpha = i.transparent, n.backgroundAlpha = i.transparent ? 0 : 1), n._lastObjectRendered = null, n.plugins = {}, n;
    }
    return t.prototype.initPlugins = function(e) {
      for (var i in e)
        this.plugins[i] = new e[i](this);
    }, Object.defineProperty(t.prototype, "width", {
      /**
       * Same as view.width, actual number of pixels in the canvas by horizontal.
       * @member {number}
       * @readonly
       * @default 800
       */
      get: function() {
        return this.view.width;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "height", {
      /**
       * Same as view.height, actual number of pixels in the canvas by vertical.
       * @member {number}
       * @readonly
       * @default 600
       */
      get: function() {
        return this.view.height;
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.resize = function(e, i) {
      this.view.width = Math.round(e * this.resolution), this.view.height = Math.round(i * this.resolution);
      var n = this.view.width / this.resolution, a = this.view.height / this.resolution;
      this.screen.width = n, this.screen.height = a, this.autoDensity && (this.view.style.width = n + "px", this.view.style.height = a + "px"), this.emit("resize", n, a);
    }, t.prototype.generateTexture = function(e, i, n, a) {
      i === void 0 && (i = {}), typeof i == "number" && (ae("6.1.0", "generateTexture options (scaleMode, resolution, region) are now object options."), i = { scaleMode: i, resolution: n, region: a });
      var o = i.region, s = Py(i, ["region"]);
      a = o || e.getLocalBounds(null, !0), a.width === 0 && (a.width = 1), a.height === 0 && (a.height = 1);
      var u = or.create(Va({ width: a.width, height: a.height }, s));
      return na.tx = -a.x, na.ty = -a.y, this.render(e, {
        renderTexture: u,
        clear: !1,
        transform: na,
        skipUpdateTransform: !!e.parent
      }), u;
    }, t.prototype.destroy = function(e) {
      for (var i in this.plugins)
        this.plugins[i].destroy(), this.plugins[i] = null;
      e && this.view.parentNode && this.view.parentNode.removeChild(this.view);
      var n = this;
      n.plugins = null, n.type = ri.UNKNOWN, n.view = null, n.screen = null, n._tempDisplayObjectParent = null, n.options = null, this._backgroundColorRgba = null, this._backgroundColorString = null, this._lastObjectRendered = null;
    }, Object.defineProperty(t.prototype, "backgroundColor", {
      /**
       * The background color to fill if not transparent
       * @member {number}
       */
      get: function() {
        return this._backgroundColor;
      },
      set: function(e) {
        this._backgroundColor = e, this._backgroundColorString = Dh(e), Dr(e, this._backgroundColorRgba);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "backgroundAlpha", {
      /**
       * The background color alpha. Setting this to 0 will make the canvas transparent.
       * @member {number}
       */
      get: function() {
        return this._backgroundColorRgba[3];
      },
      set: function(e) {
        this._backgroundColorRgba[3] = e;
      },
      enumerable: !1,
      configurable: !0
    }), t;
  }(fi)
), zg = (
  /** @class */
  function() {
    function r(t) {
      this.buffer = t || null, this.updateID = -1, this.byteLength = -1, this.refCount = 0;
    }
    return r;
  }()
), Wg = (
  /** @class */
  function() {
    function r(t) {
      this.renderer = t, this.managedBuffers = {}, this.boundBufferBases = {};
    }
    return r.prototype.destroy = function() {
      this.renderer = null;
    }, r.prototype.contextChange = function() {
      this.disposeAll(!0), this.gl = this.renderer.gl, this.CONTEXT_UID = this.renderer.CONTEXT_UID;
    }, r.prototype.bind = function(t) {
      var e = this, i = e.gl, n = e.CONTEXT_UID, a = t._glBuffers[n] || this.createGLBuffer(t);
      i.bindBuffer(t.type, a.buffer);
    }, r.prototype.bindBufferBase = function(t, e) {
      var i = this, n = i.gl, a = i.CONTEXT_UID;
      if (this.boundBufferBases[e] !== t) {
        var o = t._glBuffers[a] || this.createGLBuffer(t);
        this.boundBufferBases[e] = t, n.bindBufferBase(n.UNIFORM_BUFFER, e, o.buffer);
      }
    }, r.prototype.bindBufferRange = function(t, e, i) {
      var n = this, a = n.gl, o = n.CONTEXT_UID;
      i = i || 0;
      var s = t._glBuffers[o] || this.createGLBuffer(t);
      a.bindBufferRange(a.UNIFORM_BUFFER, e || 0, s.buffer, i * 256, 256);
    }, r.prototype.update = function(t) {
      var e = this, i = e.gl, n = e.CONTEXT_UID, a = t._glBuffers[n];
      if (t._updateID !== a.updateID)
        if (a.updateID = t._updateID, i.bindBuffer(t.type, a.buffer), a.byteLength >= t.data.byteLength)
          i.bufferSubData(t.type, 0, t.data);
        else {
          var o = t.static ? i.STATIC_DRAW : i.DYNAMIC_DRAW;
          a.byteLength = t.data.byteLength, i.bufferData(t.type, t.data, o);
        }
    }, r.prototype.dispose = function(t, e) {
      if (this.managedBuffers[t.id]) {
        delete this.managedBuffers[t.id];
        var i = t._glBuffers[this.CONTEXT_UID], n = this.gl;
        t.disposeRunner.remove(this), i && (e || n.deleteBuffer(i.buffer), delete t._glBuffers[this.CONTEXT_UID]);
      }
    }, r.prototype.disposeAll = function(t) {
      for (var e = Object.keys(this.managedBuffers), i = 0; i < e.length; i++)
        this.dispose(this.managedBuffers[e[i]], t);
    }, r.prototype.createGLBuffer = function(t) {
      var e = this, i = e.CONTEXT_UID, n = e.gl;
      return t._glBuffers[i] = new zg(n.createBuffer()), this.managedBuffers[t.id] = t, t.disposeRunner.add(this), t._glBuffers[i];
    }, r;
  }()
), Jh = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e) {
      var i = r.call(this, ri.WEBGL, e) || this;
      return e = i.options, i.gl = null, i.CONTEXT_UID = 0, i.runners = {
        destroy: new Bt("destroy"),
        contextChange: new Bt("contextChange"),
        reset: new Bt("reset"),
        update: new Bt("update"),
        postrender: new Bt("postrender"),
        prerender: new Bt("prerender"),
        resize: new Bt("resize")
      }, i.runners.contextChange.add(i), i.globalUniforms = new ir({
        projectionMatrix: new It()
      }, !0), i.addSystem(yg, "mask").addSystem(Wy, "context").addSystem(kg, "state").addSystem(Mg, "shader").addSystem(jg, "texture").addSystem(Wg, "buffer").addSystem(Ky, "geometry").addSystem(Zy, "framebuffer").addSystem(gg, "scissor").addSystem(mg, "stencil").addSystem(bg, "projection").addSystem(Hg, "textureGC").addSystem(Vy, "filter").addSystem(Eg, "renderTexture").addSystem(zy, "batch"), i.initPlugins(t.__plugins), i.multisample = void 0, e.context ? i.context.initFromContext(e.context) : i.context.initFromOptions({
        alpha: !!i.useContextAlpha,
        antialias: e.antialias,
        premultipliedAlpha: i.useContextAlpha && i.useContextAlpha !== "notMultiplied",
        stencil: !0,
        preserveDrawingBuffer: e.preserveDrawingBuffer,
        powerPreference: i.options.powerPreference
      }), i.renderingToScreen = !0, xp(i.context.webGLVersion === 2 ? "WebGL 2" : "WebGL 1"), i.resize(i.options.width, i.options.height), i;
    }
    return t.create = function(e) {
      if (wp())
        return new t(e);
      throw new Error('WebGL unsupported in this browser, use "pixi.js-legacy" for fallback canvas2d support.');
    }, t.prototype.contextChange = function() {
      var e = this.gl, i;
      if (this.context.webGLVersion === 1) {
        var n = e.getParameter(e.FRAMEBUFFER_BINDING);
        e.bindFramebuffer(e.FRAMEBUFFER, null), i = e.getParameter(e.SAMPLES), e.bindFramebuffer(e.FRAMEBUFFER, n);
      } else {
        var n = e.getParameter(e.DRAW_FRAMEBUFFER_BINDING);
        e.bindFramebuffer(e.DRAW_FRAMEBUFFER, null), i = e.getParameter(e.SAMPLES), e.bindFramebuffer(e.DRAW_FRAMEBUFFER, n);
      }
      i >= bt.HIGH ? this.multisample = bt.HIGH : i >= bt.MEDIUM ? this.multisample = bt.MEDIUM : i >= bt.LOW ? this.multisample = bt.LOW : this.multisample = bt.NONE;
    }, t.prototype.addSystem = function(e, i) {
      var n = new e(this);
      if (this[i])
        throw new Error('Whoops! The name "' + i + '" is already in use');
      this[i] = n;
      for (var a in this.runners)
        this.runners[a].add(n);
      return this;
    }, t.prototype.render = function(e, i) {
      var n, a, o, s;
      if (i && (i instanceof or ? (ae("6.0.0", "Renderer#render arguments changed, use options instead."), n = i, a = arguments[2], o = arguments[3], s = arguments[4]) : (n = i.renderTexture, a = i.clear, o = i.transform, s = i.skipUpdateTransform)), this.renderingToScreen = !n, this.runners.prerender.emit(), this.emit("prerender"), this.projection.transform = o, !this.context.isLost) {
        if (n || (this._lastObjectRendered = e), !s) {
          var u = e.enableTempParent();
          e.updateTransform(), e.disableTempParent(u);
        }
        this.renderTexture.bind(n), this.batch.currentRenderer.start(), (a !== void 0 ? a : this.clearBeforeRender) && this.renderTexture.clear(), e.render(this), this.batch.currentRenderer.flush(), n && n.baseTexture.update(), this.runners.postrender.emit(), this.projection.transform = null, this.emit("postrender");
      }
    }, t.prototype.generateTexture = function(e, i, n, a) {
      i === void 0 && (i = {});
      var o = r.prototype.generateTexture.call(this, e, i, n, a);
      return this.framebuffer.blit(), o;
    }, t.prototype.resize = function(e, i) {
      r.prototype.resize.call(this, e, i), this.runners.resize.emit(this.screen.height, this.screen.width);
    }, t.prototype.reset = function() {
      return this.runners.reset.emit(), this;
    }, t.prototype.clear = function() {
      this.renderTexture.bind(), this.renderTexture.clear();
    }, t.prototype.destroy = function(e) {
      this.runners.destroy.emit();
      for (var i in this.runners)
        this.runners[i].destroy();
      r.prototype.destroy.call(this, e), this.gl = null;
    }, Object.defineProperty(t.prototype, "extract", {
      /**
       * Please use `plugins.extract` instead.
       * @member {PIXI.Extract} extract
       * @deprecated since 6.0.0
       * @readonly
       */
      get: function() {
        return ae("6.0.0", "Renderer#extract has been deprecated, please use Renderer#plugins.extract instead."), this.plugins.extract;
      },
      enumerable: !1,
      configurable: !0
    }), t.registerPlugin = function(e, i) {
      ae("6.5.0", "Renderer.registerPlugin() has been deprecated, please use extensions.add() instead."), Pe.add({
        name: e,
        type: vt.RendererPlugin,
        ref: i
      });
    }, t.__plugins = {}, t;
  }(Vg)
);
Pe.handleByMap(vt.RendererPlugin, Jh.__plugins);
function tl(r) {
  return Jh.create(r);
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
`, Zg = Yg, el = qg, Wa = (
  /** @class */
  function() {
    function r() {
      this.texArray = null, this.blend = 0, this.type = ie.TRIANGLES, this.start = 0, this.size = 0, this.data = null;
    }
    return r;
  }()
), Ya = (
  /** @class */
  function() {
    function r() {
      this.elements = [], this.ids = [], this.count = 0;
    }
    return r.prototype.clear = function() {
      for (var t = 0; t < this.count; t++)
        this.elements[t] = null;
      this.count = 0;
    }, r;
  }()
), qa = (
  /** @class */
  function() {
    function r(t) {
      typeof t == "number" ? this.rawBinaryData = new ArrayBuffer(t) : t instanceof Uint8Array ? this.rawBinaryData = t.buffer : this.rawBinaryData = t, this.uint32View = new Uint32Array(this.rawBinaryData), this.float32View = new Float32Array(this.rawBinaryData);
    }
    return Object.defineProperty(r.prototype, "int8View", {
      /** View on the raw binary data as a `Int8Array`. */
      get: function() {
        return this._int8View || (this._int8View = new Int8Array(this.rawBinaryData)), this._int8View;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "uint8View", {
      /** View on the raw binary data as a `Uint8Array`. */
      get: function() {
        return this._uint8View || (this._uint8View = new Uint8Array(this.rawBinaryData)), this._uint8View;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "int16View", {
      /**  View on the raw binary data as a `Int16Array`. */
      get: function() {
        return this._int16View || (this._int16View = new Int16Array(this.rawBinaryData)), this._int16View;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "uint16View", {
      /** View on the raw binary data as a `Uint16Array`. */
      get: function() {
        return this._uint16View || (this._uint16View = new Uint16Array(this.rawBinaryData)), this._uint16View;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "int32View", {
      /** View on the raw binary data as a `Int32Array`. */
      get: function() {
        return this._int32View || (this._int32View = new Int32Array(this.rawBinaryData)), this._int32View;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.view = function(t) {
      return this[t + "View"];
    }, r.prototype.destroy = function() {
      this.rawBinaryData = null, this._int8View = null, this._uint8View = null, this._int16View = null, this._uint16View = null, this._int32View = null, this.uint32View = null, this.float32View = null;
    }, r.sizeOf = function(t) {
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
          throw new Error(t + " isn't a valid view type");
      }
    }, r;
  }()
), Kg = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e) {
      var i = r.call(this, e) || this;
      return i.shaderGenerator = null, i.geometryClass = null, i.vertexSize = null, i.state = lr.for2d(), i.size = k.SPRITE_BATCH_SIZE * 4, i._vertexCount = 0, i._indexCount = 0, i._bufferedElements = [], i._bufferedTextures = [], i._bufferSize = 0, i._shader = null, i._packedGeometries = [], i._packedGeometryPoolSize = 2, i._flushId = 0, i._aBuffers = {}, i._iBuffers = {}, i.MAX_TEXTURES = 1, i.renderer.on("prerender", i.onPrerender, i), e.runners.contextChange.add(i), i._dcIndex = 0, i._aIndex = 0, i._iIndex = 0, i._attributeBuffer = null, i._indexBuffer = null, i._tempBoundTextures = [], i;
    }
    return t.prototype.contextChange = function() {
      var e = this.renderer.gl;
      k.PREFER_ENV === xe.WEBGL_LEGACY ? this.MAX_TEXTURES = 1 : (this.MAX_TEXTURES = Math.min(e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS), k.SPRITE_MAX_TEXTURES), this.MAX_TEXTURES = sg(this.MAX_TEXTURES, e)), this._shader = this.shaderGenerator.generateShader(this.MAX_TEXTURES);
      for (var i = 0; i < this._packedGeometryPoolSize; i++)
        this._packedGeometries[i] = new this.geometryClass();
      this.initFlushBuffers();
    }, t.prototype.initFlushBuffers = function() {
      for (var e = t._drawCallPool, i = t._textureArrayPool, n = this.size / 4, a = Math.floor(n / this.MAX_TEXTURES) + 1; e.length < n; )
        e.push(new Wa());
      for (; i.length < a; )
        i.push(new Ya());
      for (var o = 0; o < this.MAX_TEXTURES; o++)
        this._tempBoundTextures[o] = null;
    }, t.prototype.onPrerender = function() {
      this._flushId = 0;
    }, t.prototype.render = function(e) {
      e._texture.valid && (this._vertexCount + e.vertexData.length / 2 > this.size && this.flush(), this._vertexCount += e.vertexData.length / 2, this._indexCount += e.indices.length, this._bufferedTextures[this._bufferSize] = e._texture.baseTexture, this._bufferedElements[this._bufferSize++] = e);
    }, t.prototype.buildTexturesAndDrawCalls = function() {
      var e = this, i = e._bufferedTextures, n = e.MAX_TEXTURES, a = t._textureArrayPool, o = this.renderer.batch, s = this._tempBoundTextures, u = this.renderer.textureGC.count, h = ++ot._globalBatch, l = 0, f = a[0], c = 0;
      o.copyBoundTextures(s, n);
      for (var d = 0; d < this._bufferSize; ++d) {
        var p = i[d];
        i[d] = null, p._batchEnabled !== h && (f.count >= n && (o.boundArray(f, s, h, n), this.buildDrawCalls(f, c, d), c = d, f = a[++l], ++h), p._batchEnabled = h, p.touched = u, f.elements[f.count++] = p);
      }
      f.count > 0 && (o.boundArray(f, s, h, n), this.buildDrawCalls(f, c, this._bufferSize), ++l, ++h);
      for (var d = 0; d < s.length; d++)
        s[d] = null;
      ot._globalBatch = h;
    }, t.prototype.buildDrawCalls = function(e, i, n) {
      var a = this, o = a._bufferedElements, s = a._attributeBuffer, u = a._indexBuffer, h = a.vertexSize, l = t._drawCallPool, f = this._dcIndex, c = this._aIndex, d = this._iIndex, p = l[f];
      p.start = this._iIndex, p.texArray = e;
      for (var _ = i; _ < n; ++_) {
        var v = o[_], y = v._texture.baseTexture, g = Fh[y.alphaMode ? 1 : 0][v.blendMode];
        o[_] = null, i < _ && p.blend !== g && (p.size = d - p.start, i = _, p = l[++f], p.texArray = e, p.start = d), this.packInterleavedGeometry(v, s, u, c, d), c += v.vertexData.length / 2 * h, d += v.indices.length, p.blend = g;
      }
      i < n && (p.size = d - p.start, ++f), this._dcIndex = f, this._aIndex = c, this._iIndex = d;
    }, t.prototype.bindAndClearTexArray = function(e) {
      for (var i = this.renderer.texture, n = 0; n < e.count; n++)
        i.bind(e.elements[n], e.ids[n]), e.elements[n] = null;
      e.count = 0;
    }, t.prototype.updateGeometry = function() {
      var e = this, i = e._packedGeometries, n = e._attributeBuffer, a = e._indexBuffer;
      k.CAN_UPLOAD_SAME_BUFFER ? (i[this._flushId]._buffer.update(n.rawBinaryData), i[this._flushId]._indexBuffer.update(a), this.renderer.geometry.updateBuffers()) : (this._packedGeometryPoolSize <= this._flushId && (this._packedGeometryPoolSize++, i[this._flushId] = new this.geometryClass()), i[this._flushId]._buffer.update(n.rawBinaryData), i[this._flushId]._indexBuffer.update(a), this.renderer.geometry.bind(i[this._flushId]), this.renderer.geometry.updateBuffers(), this._flushId++);
    }, t.prototype.drawBatches = function() {
      for (var e = this._dcIndex, i = this.renderer, n = i.gl, a = i.state, o = t._drawCallPool, s = null, u = 0; u < e; u++) {
        var h = o[u], l = h.texArray, f = h.type, c = h.size, d = h.start, p = h.blend;
        s !== l && (s = l, this.bindAndClearTexArray(l)), this.state.blendMode = p, a.set(this.state), n.drawElements(f, c, n.UNSIGNED_SHORT, d * 2);
      }
    }, t.prototype.flush = function() {
      this._vertexCount !== 0 && (this._attributeBuffer = this.getAttributeBuffer(this._vertexCount), this._indexBuffer = this.getIndexBuffer(this._indexCount), this._aIndex = 0, this._iIndex = 0, this._dcIndex = 0, this.buildTexturesAndDrawCalls(), this.updateGeometry(), this.drawBatches(), this._bufferSize = 0, this._vertexCount = 0, this._indexCount = 0);
    }, t.prototype.start = function() {
      this.renderer.state.set(this.state), this.renderer.texture.ensureSamplerType(this.MAX_TEXTURES), this.renderer.shader.bind(this._shader), k.CAN_UPLOAD_SAME_BUFFER && this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
    }, t.prototype.stop = function() {
      this.flush();
    }, t.prototype.destroy = function() {
      for (var e = 0; e < this._packedGeometryPoolSize; e++)
        this._packedGeometries[e] && this._packedGeometries[e].destroy();
      this.renderer.off("prerender", this.onPrerender, this), this._aBuffers = null, this._iBuffers = null, this._packedGeometries = null, this._attributeBuffer = null, this._indexBuffer = null, this._shader && (this._shader.destroy(), this._shader = null), r.prototype.destroy.call(this);
    }, t.prototype.getAttributeBuffer = function(e) {
      var i = cn(Math.ceil(e / 8)), n = Hs(i), a = i * 8;
      this._aBuffers.length <= n && (this._iBuffers.length = n + 1);
      var o = this._aBuffers[a];
      return o || (this._aBuffers[a] = o = new qa(a * this.vertexSize * 4)), o;
    }, t.prototype.getIndexBuffer = function(e) {
      var i = cn(Math.ceil(e / 12)), n = Hs(i), a = i * 12;
      this._iBuffers.length <= n && (this._iBuffers.length = n + 1);
      var o = this._iBuffers[n];
      return o || (this._iBuffers[n] = o = new Uint16Array(a)), o;
    }, t.prototype.packInterleavedGeometry = function(e, i, n, a, o) {
      for (var s = i.uint32View, u = i.float32View, h = a / this.vertexSize, l = e.uvs, f = e.indices, c = e.vertexData, d = e._texture.baseTexture._batchLocation, p = Math.min(e.worldAlpha, 1), _ = p < 1 && e._texture.baseTexture.alphaMode ? Bo(e._tintRGB, p) : e._tintRGB + (p * 255 << 24), v = 0; v < c.length; v += 2)
        u[a++] = c[v], u[a++] = c[v + 1], u[a++] = l[v], u[a++] = l[v + 1], s[a++] = _, u[a++] = d;
      for (var v = 0; v < f.length; v++)
        n[o++] = h + f[v];
    }, t._drawCallPool = [], t._textureArrayPool = [], t;
  }(Pn)
), $g = (
  /** @class */
  function() {
    function r(t, e) {
      if (this.vertexSrc = t, this.fragTemplate = e, this.programCache = {}, this.defaultGroupCache = {}, e.indexOf("%count%") < 0)
        throw new Error('Fragment template must contain "%count%".');
      if (e.indexOf("%forloop%") < 0)
        throw new Error('Fragment template must contain "%forloop%".');
    }
    return r.prototype.generateShader = function(t) {
      if (!this.programCache[t]) {
        for (var e = new Int32Array(t), i = 0; i < t; i++)
          e[i] = i;
        this.defaultGroupCache[t] = ir.from({ uSamplers: e }, !0);
        var n = this.fragTemplate;
        n = n.replace(/%count%/gi, "" + t), n = n.replace(/%forloop%/gi, this.generateSampleSrc(t)), this.programCache[t] = new vi(this.vertexSrc, n);
      }
      var a = {
        tint: new Float32Array([1, 1, 1, 1]),
        translationMatrix: new It(),
        default: this.defaultGroupCache[t]
      };
      return new Fe(this.programCache[t], a);
    }, r.prototype.generateSampleSrc = function(t) {
      var e = "";
      e += `
`, e += `
`;
      for (var i = 0; i < t; i++)
        i > 0 && (e += `
else `), i < t - 1 && (e += "if(vTextureId < " + i + ".5)"), e += `
{`, e += `
	color = texture2D(uSamplers[` + i + "], vTextureCoord);", e += `
}`;
      return e += `
`, e += `
`, e;
    }, r;
  }()
), rl = (
  /** @class */
  function(r) {
    yt(t, r);
    function t(e) {
      e === void 0 && (e = !1);
      var i = r.call(this) || this;
      return i._buffer = new Ot(null, e, !1), i._indexBuffer = new Ot(null, e, !0), i.addAttribute("aVertexPosition", i._buffer, 2, !1, V.FLOAT).addAttribute("aTextureCoord", i._buffer, 2, !1, V.FLOAT).addAttribute("aColor", i._buffer, 4, !0, V.UNSIGNED_BYTE).addAttribute("aTextureId", i._buffer, 1, !0, V.FLOAT).addIndex(i._indexBuffer), i;
    }
    return t;
  }(pi)
), iu = `precision highp float;
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
`, nu = `varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;
uniform sampler2D uSamplers[%count%];

void main(void){
    vec4 color;
    %forloop%
    gl_FragColor = color * vColor;
}
`, Qg = (
  /** @class */
  function() {
    function r() {
    }
    return r.create = function(t) {
      var e = Object.assign({
        vertex: iu,
        fragment: nu,
        geometryClass: rl,
        vertexSize: 6
      }, t), i = e.vertex, n = e.fragment, a = e.vertexSize, o = e.geometryClass;
      return (
        /** @class */
        function(s) {
          yt(u, s);
          function u(h) {
            var l = s.call(this, h) || this;
            return l.shaderGenerator = new $g(i, n), l.geometryClass = o, l.vertexSize = a, l;
          }
          return u;
        }(Kg)
      );
    }, Object.defineProperty(r, "defaultVertexSrc", {
      /**
       * The default vertex shader source
       * @readonly
       */
      get: function() {
        return iu;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "defaultFragmentTemplate", {
      /**
       * The default fragment shader source
       * @readonly
       */
      get: function() {
        return nu;
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
), il = Qg.create();
Object.assign(il, {
  extension: {
    name: "batch",
    type: vt.RendererPlugin
  }
});
/*!
 * @pixi/accessibility - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/accessibility is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var Jg = {
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
At.mixin(Jg);
var tm = 9, Fi = 100, em = 0, rm = 0, au = 2, ou = 1, im = -1e3, nm = -1e3, am = 2, om = (
  /** @class */
  function() {
    function r(t) {
      this.debug = !1, this._isActive = !1, this._isMobileAccessibility = !1, this.pool = [], this.renderId = 0, this.children = [], this.androidUpdateCount = 0, this.androidUpdateFrequency = 500, this._hookDiv = null, (ce.tablet || ce.phone) && this.createTouchHook();
      var e = document.createElement("div");
      e.style.width = Fi + "px", e.style.height = Fi + "px", e.style.position = "absolute", e.style.top = em + "px", e.style.left = rm + "px", e.style.zIndex = au.toString(), this.div = e, this.renderer = t, this._onKeyDown = this._onKeyDown.bind(this), this._onMouseMove = this._onMouseMove.bind(this), globalThis.addEventListener("keydown", this._onKeyDown, !1);
    }
    return Object.defineProperty(r.prototype, "isActive", {
      /**
       * Value of `true` if accessibility is currently active and accessibility layers are showing.
       * @member {boolean}
       * @readonly
       */
      get: function() {
        return this._isActive;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "isMobileAccessibility", {
      /**
       * Value of `true` if accessibility is enabled for touch devices.
       * @member {boolean}
       * @readonly
       */
      get: function() {
        return this._isMobileAccessibility;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.createTouchHook = function() {
      var t = this, e = document.createElement("button");
      e.style.width = ou + "px", e.style.height = ou + "px", e.style.position = "absolute", e.style.top = im + "px", e.style.left = nm + "px", e.style.zIndex = am.toString(), e.style.backgroundColor = "#FF0000", e.title = "select to enable accessibility for this content", e.addEventListener("focus", function() {
        t._isMobileAccessibility = !0, t.activate(), t.destroyTouchHook();
      }), document.body.appendChild(e), this._hookDiv = e;
    }, r.prototype.destroyTouchHook = function() {
      this._hookDiv && (document.body.removeChild(this._hookDiv), this._hookDiv = null);
    }, r.prototype.activate = function() {
      var t;
      this._isActive || (this._isActive = !0, globalThis.document.addEventListener("mousemove", this._onMouseMove, !0), globalThis.removeEventListener("keydown", this._onKeyDown, !1), this.renderer.on("postrender", this.update, this), (t = this.renderer.view.parentNode) === null || t === void 0 || t.appendChild(this.div));
    }, r.prototype.deactivate = function() {
      var t;
      !this._isActive || this._isMobileAccessibility || (this._isActive = !1, globalThis.document.removeEventListener("mousemove", this._onMouseMove, !0), globalThis.addEventListener("keydown", this._onKeyDown, !1), this.renderer.off("postrender", this.update), (t = this.div.parentNode) === null || t === void 0 || t.removeChild(this.div));
    }, r.prototype.updateAccessibleObjects = function(t) {
      if (!(!t.visible || !t.accessibleChildren)) {
        t.accessible && t.interactive && (t._accessibleActive || this.addChild(t), t.renderId = this.renderId);
        var e = t.children;
        if (e)
          for (var i = 0; i < e.length; i++)
            this.updateAccessibleObjects(e[i]);
      }
    }, r.prototype.update = function() {
      var t = performance.now();
      if (!(ce.android.device && t < this.androidUpdateCount) && (this.androidUpdateCount = t + this.androidUpdateFrequency, !!this.renderer.renderingToScreen)) {
        this.renderer._lastObjectRendered && this.updateAccessibleObjects(this.renderer._lastObjectRendered);
        var e = this.renderer.view.getBoundingClientRect(), i = e.left, n = e.top, a = e.width, o = e.height, s = this.renderer, u = s.width, h = s.height, l = s.resolution, f = a / u * l, c = o / h * l, d = this.div;
        d.style.left = i + "px", d.style.top = n + "px", d.style.width = u + "px", d.style.height = h + "px";
        for (var p = 0; p < this.children.length; p++) {
          var _ = this.children[p];
          if (_.renderId !== this.renderId)
            _._accessibleActive = !1, Rr(this.children, p, 1), this.div.removeChild(_._accessibleDiv), this.pool.push(_._accessibleDiv), _._accessibleDiv = null, p--;
          else {
            d = _._accessibleDiv;
            var v = _.hitArea, y = _.worldTransform;
            _.hitArea ? (d.style.left = (y.tx + v.x * y.a) * f + "px", d.style.top = (y.ty + v.y * y.d) * c + "px", d.style.width = v.width * y.a * f + "px", d.style.height = v.height * y.d * c + "px") : (v = _.getBounds(), this.capHitArea(v), d.style.left = v.x * f + "px", d.style.top = v.y * c + "px", d.style.width = v.width * f + "px", d.style.height = v.height * c + "px", d.title !== _.accessibleTitle && _.accessibleTitle !== null && (d.title = _.accessibleTitle), d.getAttribute("aria-label") !== _.accessibleHint && _.accessibleHint !== null && d.setAttribute("aria-label", _.accessibleHint)), (_.accessibleTitle !== d.title || _.tabIndex !== d.tabIndex) && (d.title = _.accessibleTitle, d.tabIndex = _.tabIndex, this.debug && this.updateDebugHTML(d));
          }
        }
        this.renderId++;
      }
    }, r.prototype.updateDebugHTML = function(t) {
      t.innerHTML = "type: " + t.type + "</br> title : " + t.title + "</br> tabIndex: " + t.tabIndex;
    }, r.prototype.capHitArea = function(t) {
      t.x < 0 && (t.width += t.x, t.x = 0), t.y < 0 && (t.height += t.y, t.y = 0);
      var e = this.renderer, i = e.width, n = e.height;
      t.x + t.width > i && (t.width = i - t.x), t.y + t.height > n && (t.height = n - t.y);
    }, r.prototype.addChild = function(t) {
      var e = this.pool.pop();
      e || (e = document.createElement("button"), e.style.width = Fi + "px", e.style.height = Fi + "px", e.style.backgroundColor = this.debug ? "rgba(255,255,255,0.5)" : "transparent", e.style.position = "absolute", e.style.zIndex = au.toString(), e.style.borderStyle = "none", navigator.userAgent.toLowerCase().indexOf("chrome") > -1 ? e.setAttribute("aria-live", "off") : e.setAttribute("aria-live", "polite"), navigator.userAgent.match(/rv:.*Gecko\//) ? e.setAttribute("aria-relevant", "additions") : e.setAttribute("aria-relevant", "text"), e.addEventListener("click", this._onClick.bind(this)), e.addEventListener("focus", this._onFocus.bind(this)), e.addEventListener("focusout", this._onFocusOut.bind(this))), e.style.pointerEvents = t.accessiblePointerEvents, e.type = t.accessibleType, t.accessibleTitle && t.accessibleTitle !== null ? e.title = t.accessibleTitle : (!t.accessibleHint || t.accessibleHint === null) && (e.title = "displayObject " + t.tabIndex), t.accessibleHint && t.accessibleHint !== null && e.setAttribute("aria-label", t.accessibleHint), this.debug && this.updateDebugHTML(e), t._accessibleActive = !0, t._accessibleDiv = e, e.displayObject = t, this.children.push(t), this.div.appendChild(t._accessibleDiv), t._accessibleDiv.tabIndex = t.tabIndex;
    }, r.prototype._onClick = function(t) {
      var e = this.renderer.plugins.interaction, i = t.target.displayObject, n = e.eventData;
      e.dispatchEvent(i, "click", n), e.dispatchEvent(i, "pointertap", n), e.dispatchEvent(i, "tap", n);
    }, r.prototype._onFocus = function(t) {
      t.target.getAttribute("aria-live") || t.target.setAttribute("aria-live", "assertive");
      var e = this.renderer.plugins.interaction, i = t.target.displayObject, n = e.eventData;
      e.dispatchEvent(i, "mouseover", n);
    }, r.prototype._onFocusOut = function(t) {
      t.target.getAttribute("aria-live") || t.target.setAttribute("aria-live", "polite");
      var e = this.renderer.plugins.interaction, i = t.target.displayObject, n = e.eventData;
      e.dispatchEvent(i, "mouseout", n);
    }, r.prototype._onKeyDown = function(t) {
      t.keyCode === tm && this.activate();
    }, r.prototype._onMouseMove = function(t) {
      t.movementX === 0 && t.movementY === 0 || this.deactivate();
    }, r.prototype.destroy = function() {
      this.destroyTouchHook(), this.div = null, globalThis.document.removeEventListener("mousemove", this._onMouseMove, !0), globalThis.removeEventListener("keydown", this._onKeyDown), this.pool = null, this.children = null, this.renderer = null;
    }, r.extension = {
      name: "accessibility",
      type: [
        vt.RendererPlugin,
        vt.CanvasRendererPlugin
      ]
    }, r;
  }()
);
/*!
 * @pixi/interaction - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/interaction is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var su = (
  /** @class */
  function() {
    function r() {
      this.pressure = 0, this.rotationAngle = 0, this.twist = 0, this.tangentialPressure = 0, this.global = new gt(), this.target = null, this.originalEvent = null, this.identifier = null, this.isPrimary = !1, this.button = 0, this.buttons = 0, this.width = 0, this.height = 0, this.tiltX = 0, this.tiltY = 0, this.pointerType = null, this.pressure = 0, this.rotationAngle = 0, this.twist = 0, this.tangentialPressure = 0;
    }
    return Object.defineProperty(r.prototype, "pointerId", {
      /**
       * The unique identifier of the pointer. It will be the same as `identifier`.
       * @readonly
       * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId
       */
      get: function() {
        return this.identifier;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.getLocalPosition = function(t, e, i) {
      return t.worldTransform.applyInverse(i || this.global, e);
    }, r.prototype.copyEvent = function(t) {
      "isPrimary" in t && t.isPrimary && (this.isPrimary = !0), this.button = "button" in t && t.button;
      var e = "buttons" in t && t.buttons;
      this.buttons = Number.isInteger(e) ? e : "which" in t && t.which, this.width = "width" in t && t.width, this.height = "height" in t && t.height, this.tiltX = "tiltX" in t && t.tiltX, this.tiltY = "tiltY" in t && t.tiltY, this.pointerType = "pointerType" in t && t.pointerType, this.pressure = "pressure" in t && t.pressure, this.rotationAngle = "rotationAngle" in t && t.rotationAngle, this.twist = "twist" in t && t.twist || 0, this.tangentialPressure = "tangentialPressure" in t && t.tangentialPressure || 0;
    }, r.prototype.reset = function() {
      this.isPrimary = !1;
    }, r;
  }()
);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Za = function(r, t) {
  return Za = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, Za(r, t);
};
function sm(r, t) {
  Za(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
var um = (
  /** @class */
  function() {
    function r() {
      this.stopped = !1, this.stopsPropagatingAt = null, this.stopPropagationHint = !1, this.target = null, this.currentTarget = null, this.type = null, this.data = null;
    }
    return r.prototype.stopPropagation = function() {
      this.stopped = !0, this.stopPropagationHint = !0, this.stopsPropagatingAt = this.currentTarget;
    }, r.prototype.reset = function() {
      this.stopped = !1, this.stopsPropagatingAt = null, this.stopPropagationHint = !1, this.currentTarget = null, this.target = null;
    }, r;
  }()
), aa = (
  /** @class */
  function() {
    function r(t) {
      this._pointerId = t, this._flags = r.FLAGS.NONE;
    }
    return r.prototype._doSet = function(t, e) {
      e ? this._flags = this._flags | t : this._flags = this._flags & ~t;
    }, Object.defineProperty(r.prototype, "pointerId", {
      /**
       * Unique pointer id of the event
       * @readonly
       * @private
       * @member {number}
       */
      get: function() {
        return this._pointerId;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "flags", {
      /**
       * State of the tracking data, expressed as bit flags
       * @private
       * @member {number}
       */
      get: function() {
        return this._flags;
      },
      set: function(t) {
        this._flags = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "none", {
      /**
       * Is the tracked event inactive (not over or down)?
       * @private
       * @member {number}
       */
      get: function() {
        return this._flags === r.FLAGS.NONE;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "over", {
      /**
       * Is the tracked event over the DisplayObject?
       * @private
       * @member {boolean}
       */
      get: function() {
        return (this._flags & r.FLAGS.OVER) !== 0;
      },
      set: function(t) {
        this._doSet(r.FLAGS.OVER, t);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "rightDown", {
      /**
       * Did the right mouse button come down in the DisplayObject?
       * @private
       * @member {boolean}
       */
      get: function() {
        return (this._flags & r.FLAGS.RIGHT_DOWN) !== 0;
      },
      set: function(t) {
        this._doSet(r.FLAGS.RIGHT_DOWN, t);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "leftDown", {
      /**
       * Did the left mouse button come down in the DisplayObject?
       * @private
       * @member {boolean}
       */
      get: function() {
        return (this._flags & r.FLAGS.LEFT_DOWN) !== 0;
      },
      set: function(t) {
        this._doSet(r.FLAGS.LEFT_DOWN, t);
      },
      enumerable: !1,
      configurable: !0
    }), r.FLAGS = Object.freeze({
      NONE: 0,
      OVER: 1,
      LEFT_DOWN: 2,
      RIGHT_DOWN: 4
    }), r;
  }()
), hm = (
  /** @class */
  function() {
    function r() {
      this._tempPoint = new gt();
    }
    return r.prototype.recursiveFindHit = function(t, e, i, n, a) {
      var o;
      if (!e || !e.visible)
        return !1;
      var s = t.data.global;
      a = e.interactive || a;
      var u = !1, h = a, l = !0;
      if (e.hitArea)
        n && (e.worldTransform.applyInverse(s, this._tempPoint), e.hitArea.contains(this._tempPoint.x, this._tempPoint.y) ? u = !0 : (n = !1, l = !1)), h = !1;
      else if (e._mask && n) {
        var f = e._mask.isMaskData ? e._mask.maskObject : e._mask;
        f && !(!((o = f.containsPoint) === null || o === void 0) && o.call(f, s)) && (n = !1);
      }
      if (l && e.interactiveChildren && e.children)
        for (var c = e.children, d = c.length - 1; d >= 0; d--) {
          var p = c[d], _ = this.recursiveFindHit(t, p, i, n, h);
          if (_) {
            if (!p.parent)
              continue;
            h = !1, _ && (t.target && (n = !1), u = !0);
          }
        }
      return a && (n && !t.target && !e.hitArea && e.containsPoint && e.containsPoint(s) && (u = !0), e.interactive && (u && !t.target && (t.target = e), i && i(t, e, !!u))), u;
    }, r.prototype.findHit = function(t, e, i, n) {
      this.recursiveFindHit(t, e, i, n, !1);
    }, r;
  }()
), lm = {
  interactive: !1,
  interactiveChildren: !0,
  hitArea: null,
  /**
   * If enabled, the mouse cursor use the pointer behavior when hovered over the displayObject if it is interactive
   * Setting this changes the 'cursor' property to `'pointer'`.
   * @example
   * const sprite = new PIXI.Sprite(texture);
   * sprite.interactive = true;
   * sprite.buttonMode = true;
   * @member {boolean}
   * @memberof PIXI.DisplayObject#
   */
  get buttonMode() {
    return this.cursor === "pointer";
  },
  set buttonMode(r) {
    r ? this.cursor = "pointer" : this.cursor === "pointer" && (this.cursor = null);
  },
  /**
   * This defines what cursor mode is used when the mouse cursor
   * is hovered over the displayObject.
   * @example
   * const sprite = new PIXI.Sprite(texture);
   * sprite.interactive = true;
   * sprite.cursor = 'wait';
   * @see https://developer.mozilla.org/en/docs/Web/CSS/cursor
   * @member {string}
   * @memberof PIXI.DisplayObject#
   */
  cursor: null,
  /**
   * Internal set of all active pointers, by identifier
   * @member {Map<number, InteractionTrackingData>}
   * @memberof PIXI.DisplayObject#
   * @private
   */
  get trackedPointers() {
    return this._trackedPointers === void 0 && (this._trackedPointers = {}), this._trackedPointers;
  },
  /**
   * Map of all tracked pointers, by identifier. Use trackedPointers to access.
   * @private
   * @type {Map<number, InteractionTrackingData>}
   */
  _trackedPointers: void 0
};
At.mixin(lm);
var Ni = 1, Bi = {
  target: null,
  data: {
    global: null
  }
}, fm = (
  /** @class */
  function(r) {
    sm(t, r);
    function t(e, i) {
      var n = r.call(this) || this;
      return i = i || {}, n.renderer = e, n.autoPreventDefault = i.autoPreventDefault !== void 0 ? i.autoPreventDefault : !0, n.interactionFrequency = i.interactionFrequency || 10, n.mouse = new su(), n.mouse.identifier = Ni, n.mouse.global.set(-999999), n.activeInteractionData = {}, n.activeInteractionData[Ni] = n.mouse, n.interactionDataPool = [], n.eventData = new um(), n.interactionDOMElement = null, n.moveWhenInside = !1, n.eventsAdded = !1, n.tickerAdded = !1, n.mouseOverRenderer = !("PointerEvent" in globalThis), n.supportsTouchEvents = "ontouchstart" in globalThis, n.supportsPointerEvents = !!globalThis.PointerEvent, n.onPointerUp = n.onPointerUp.bind(n), n.processPointerUp = n.processPointerUp.bind(n), n.onPointerCancel = n.onPointerCancel.bind(n), n.processPointerCancel = n.processPointerCancel.bind(n), n.onPointerDown = n.onPointerDown.bind(n), n.processPointerDown = n.processPointerDown.bind(n), n.onPointerMove = n.onPointerMove.bind(n), n.processPointerMove = n.processPointerMove.bind(n), n.onPointerOut = n.onPointerOut.bind(n), n.processPointerOverOut = n.processPointerOverOut.bind(n), n.onPointerOver = n.onPointerOver.bind(n), n.cursorStyles = {
        default: "inherit",
        pointer: "pointer"
      }, n.currentCursorMode = null, n.cursor = null, n.resolution = 1, n.delayedEvents = [], n.search = new hm(), n._tempDisplayObject = new kh(), n._eventListenerOptions = { capture: !0, passive: !1 }, n._useSystemTicker = i.useSystemTicker !== void 0 ? i.useSystemTicker : !0, n.setTargetElement(n.renderer.view, n.renderer.resolution), n;
    }
    return Object.defineProperty(t.prototype, "useSystemTicker", {
      /**
       * Should the InteractionManager automatically add {@link tickerUpdate} to {@link PIXI.Ticker.system}.
       * @default true
       */
      get: function() {
        return this._useSystemTicker;
      },
      set: function(e) {
        this._useSystemTicker = e, e ? this.addTickerListener() : this.removeTickerListener();
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "lastObjectRendered", {
      /**
       * Last rendered object or temp object.
       * @readonly
       * @protected
       */
      get: function() {
        return this.renderer._lastObjectRendered || this._tempDisplayObject;
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.hitTest = function(e, i) {
      return Bi.target = null, Bi.data.global = e, i || (i = this.lastObjectRendered), this.processInteractive(Bi, i, null, !0), Bi.target;
    }, t.prototype.setTargetElement = function(e, i) {
      i === void 0 && (i = 1), this.removeTickerListener(), this.removeEvents(), this.interactionDOMElement = e, this.resolution = i, this.addEvents(), this.addTickerListener();
    }, t.prototype.addTickerListener = function() {
      this.tickerAdded || !this.interactionDOMElement || !this._useSystemTicker || (Lt.system.add(this.tickerUpdate, this, we.INTERACTION), this.tickerAdded = !0);
    }, t.prototype.removeTickerListener = function() {
      this.tickerAdded && (Lt.system.remove(this.tickerUpdate, this), this.tickerAdded = !1);
    }, t.prototype.addEvents = function() {
      if (!(this.eventsAdded || !this.interactionDOMElement)) {
        var e = this.interactionDOMElement.style;
        globalThis.navigator.msPointerEnabled ? (e.msContentZooming = "none", e.msTouchAction = "none") : this.supportsPointerEvents && (e.touchAction = "none"), this.supportsPointerEvents ? (globalThis.document.addEventListener("pointermove", this.onPointerMove, this._eventListenerOptions), this.interactionDOMElement.addEventListener("pointerdown", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.addEventListener("pointerleave", this.onPointerOut, this._eventListenerOptions), this.interactionDOMElement.addEventListener("pointerover", this.onPointerOver, this._eventListenerOptions), globalThis.addEventListener("pointercancel", this.onPointerCancel, this._eventListenerOptions), globalThis.addEventListener("pointerup", this.onPointerUp, this._eventListenerOptions)) : (globalThis.document.addEventListener("mousemove", this.onPointerMove, this._eventListenerOptions), this.interactionDOMElement.addEventListener("mousedown", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.addEventListener("mouseout", this.onPointerOut, this._eventListenerOptions), this.interactionDOMElement.addEventListener("mouseover", this.onPointerOver, this._eventListenerOptions), globalThis.addEventListener("mouseup", this.onPointerUp, this._eventListenerOptions)), this.supportsTouchEvents && (this.interactionDOMElement.addEventListener("touchstart", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.addEventListener("touchcancel", this.onPointerCancel, this._eventListenerOptions), this.interactionDOMElement.addEventListener("touchend", this.onPointerUp, this._eventListenerOptions), this.interactionDOMElement.addEventListener("touchmove", this.onPointerMove, this._eventListenerOptions)), this.eventsAdded = !0;
      }
    }, t.prototype.removeEvents = function() {
      if (!(!this.eventsAdded || !this.interactionDOMElement)) {
        var e = this.interactionDOMElement.style;
        globalThis.navigator.msPointerEnabled ? (e.msContentZooming = "", e.msTouchAction = "") : this.supportsPointerEvents && (e.touchAction = ""), this.supportsPointerEvents ? (globalThis.document.removeEventListener("pointermove", this.onPointerMove, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("pointerdown", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("pointerleave", this.onPointerOut, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("pointerover", this.onPointerOver, this._eventListenerOptions), globalThis.removeEventListener("pointercancel", this.onPointerCancel, this._eventListenerOptions), globalThis.removeEventListener("pointerup", this.onPointerUp, this._eventListenerOptions)) : (globalThis.document.removeEventListener("mousemove", this.onPointerMove, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("mousedown", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("mouseout", this.onPointerOut, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("mouseover", this.onPointerOver, this._eventListenerOptions), globalThis.removeEventListener("mouseup", this.onPointerUp, this._eventListenerOptions)), this.supportsTouchEvents && (this.interactionDOMElement.removeEventListener("touchstart", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("touchcancel", this.onPointerCancel, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("touchend", this.onPointerUp, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("touchmove", this.onPointerMove, this._eventListenerOptions)), this.interactionDOMElement = null, this.eventsAdded = !1;
      }
    }, t.prototype.tickerUpdate = function(e) {
      this._deltaTime += e, !(this._deltaTime < this.interactionFrequency) && (this._deltaTime = 0, this.update());
    }, t.prototype.update = function() {
      if (this.interactionDOMElement) {
        if (this._didMove) {
          this._didMove = !1;
          return;
        }
        this.cursor = null;
        for (var e in this.activeInteractionData)
          if (this.activeInteractionData.hasOwnProperty(e)) {
            var i = this.activeInteractionData[e];
            if (i.originalEvent && i.pointerType !== "touch") {
              var n = this.configureInteractionEventForDOMEvent(this.eventData, i.originalEvent, i);
              this.processInteractive(n, this.lastObjectRendered, this.processPointerOverOut, !0);
            }
          }
        this.setCursorMode(this.cursor);
      }
    }, t.prototype.setCursorMode = function(e) {
      e = e || "default";
      var i = !0;
      if (globalThis.OffscreenCanvas && this.interactionDOMElement instanceof OffscreenCanvas && (i = !1), this.currentCursorMode !== e) {
        this.currentCursorMode = e;
        var n = this.cursorStyles[e];
        if (n)
          switch (typeof n) {
            case "string":
              i && (this.interactionDOMElement.style.cursor = n);
              break;
            case "function":
              n(e);
              break;
            case "object":
              i && Object.assign(this.interactionDOMElement.style, n);
              break;
          }
        else
          i && typeof e == "string" && !Object.prototype.hasOwnProperty.call(this.cursorStyles, e) && (this.interactionDOMElement.style.cursor = e);
      }
    }, t.prototype.dispatchEvent = function(e, i, n) {
      (!n.stopPropagationHint || e === n.stopsPropagatingAt) && (n.currentTarget = e, n.type = i, e.emit(i, n), e[i] && e[i](n));
    }, t.prototype.delayDispatchEvent = function(e, i, n) {
      this.delayedEvents.push({ displayObject: e, eventString: i, eventData: n });
    }, t.prototype.mapPositionToPoint = function(e, i, n) {
      var a;
      this.interactionDOMElement.parentElement ? a = this.interactionDOMElement.getBoundingClientRect() : a = {
        x: 0,
        y: 0,
        width: this.interactionDOMElement.width,
        height: this.interactionDOMElement.height,
        left: 0,
        top: 0
      };
      var o = 1 / this.resolution;
      e.x = (i - a.left) * (this.interactionDOMElement.width / a.width) * o, e.y = (n - a.top) * (this.interactionDOMElement.height / a.height) * o;
    }, t.prototype.processInteractive = function(e, i, n, a) {
      var o = this.search.findHit(e, i, n, a), s = this.delayedEvents;
      if (!s.length)
        return o;
      e.stopPropagationHint = !1;
      var u = s.length;
      this.delayedEvents = [];
      for (var h = 0; h < u; h++) {
        var l = s[h], f = l.displayObject, c = l.eventString, d = l.eventData;
        d.stopsPropagatingAt === f && (d.stopPropagationHint = !0), this.dispatchEvent(f, c, d);
      }
      return o;
    }, t.prototype.onPointerDown = function(e) {
      if (!(this.supportsTouchEvents && e.pointerType === "touch")) {
        var i = this.normalizeToPointerData(e);
        if (this.autoPreventDefault && i[0].isNormalized) {
          var n = e.cancelable || !("cancelable" in e);
          n && e.preventDefault();
        }
        for (var a = i.length, o = 0; o < a; o++) {
          var s = i[o], u = this.getInteractionDataForPointerId(s), h = this.configureInteractionEventForDOMEvent(this.eventData, s, u);
          if (h.data.originalEvent = e, this.processInteractive(h, this.lastObjectRendered, this.processPointerDown, !0), this.emit("pointerdown", h), s.pointerType === "touch")
            this.emit("touchstart", h);
          else if (s.pointerType === "mouse" || s.pointerType === "pen") {
            var l = s.button === 2;
            this.emit(l ? "rightdown" : "mousedown", this.eventData);
          }
        }
      }
    }, t.prototype.processPointerDown = function(e, i, n) {
      var a = e.data, o = e.data.identifier;
      if (n) {
        if (i.trackedPointers[o] || (i.trackedPointers[o] = new aa(o)), this.dispatchEvent(i, "pointerdown", e), a.pointerType === "touch")
          this.dispatchEvent(i, "touchstart", e);
        else if (a.pointerType === "mouse" || a.pointerType === "pen") {
          var s = a.button === 2;
          s ? i.trackedPointers[o].rightDown = !0 : i.trackedPointers[o].leftDown = !0, this.dispatchEvent(i, s ? "rightdown" : "mousedown", e);
        }
      }
    }, t.prototype.onPointerComplete = function(e, i, n) {
      var a = this.normalizeToPointerData(e), o = a.length, s = e.target;
      e.composedPath && e.composedPath().length > 0 && (s = e.composedPath()[0]);
      for (var u = s !== this.interactionDOMElement ? "outside" : "", h = 0; h < o; h++) {
        var l = a[h], f = this.getInteractionDataForPointerId(l), c = this.configureInteractionEventForDOMEvent(this.eventData, l, f);
        if (c.data.originalEvent = e, this.processInteractive(c, this.lastObjectRendered, n, i || !u), this.emit(i ? "pointercancel" : "pointerup" + u, c), l.pointerType === "mouse" || l.pointerType === "pen") {
          var d = l.button === 2;
          this.emit(d ? "rightup" + u : "mouseup" + u, c);
        } else
          l.pointerType === "touch" && (this.emit(i ? "touchcancel" : "touchend" + u, c), this.releaseInteractionDataForPointerId(l.pointerId));
      }
    }, t.prototype.onPointerCancel = function(e) {
      this.supportsTouchEvents && e.pointerType === "touch" || this.onPointerComplete(e, !0, this.processPointerCancel);
    }, t.prototype.processPointerCancel = function(e, i) {
      var n = e.data, a = e.data.identifier;
      i.trackedPointers[a] !== void 0 && (delete i.trackedPointers[a], this.dispatchEvent(i, "pointercancel", e), n.pointerType === "touch" && this.dispatchEvent(i, "touchcancel", e));
    }, t.prototype.onPointerUp = function(e) {
      this.supportsTouchEvents && e.pointerType === "touch" || this.onPointerComplete(e, !1, this.processPointerUp);
    }, t.prototype.processPointerUp = function(e, i, n) {
      var a = e.data, o = e.data.identifier, s = i.trackedPointers[o], u = a.pointerType === "touch", h = a.pointerType === "mouse" || a.pointerType === "pen", l = !1;
      if (h) {
        var f = a.button === 2, c = aa.FLAGS, d = f ? c.RIGHT_DOWN : c.LEFT_DOWN, p = s !== void 0 && s.flags & d;
        n ? (this.dispatchEvent(i, f ? "rightup" : "mouseup", e), p && (this.dispatchEvent(i, f ? "rightclick" : "click", e), l = !0)) : p && this.dispatchEvent(i, f ? "rightupoutside" : "mouseupoutside", e), s && (f ? s.rightDown = !1 : s.leftDown = !1);
      }
      n ? (this.dispatchEvent(i, "pointerup", e), u && this.dispatchEvent(i, "touchend", e), s && ((!h || l) && this.dispatchEvent(i, "pointertap", e), u && (this.dispatchEvent(i, "tap", e), s.over = !1))) : s && (this.dispatchEvent(i, "pointerupoutside", e), u && this.dispatchEvent(i, "touchendoutside", e)), s && s.none && delete i.trackedPointers[o];
    }, t.prototype.onPointerMove = function(e) {
      if (!(this.supportsTouchEvents && e.pointerType === "touch")) {
        var i = this.normalizeToPointerData(e);
        (i[0].pointerType === "mouse" || i[0].pointerType === "pen") && (this._didMove = !0, this.cursor = null);
        for (var n = i.length, a = 0; a < n; a++) {
          var o = i[a], s = this.getInteractionDataForPointerId(o), u = this.configureInteractionEventForDOMEvent(this.eventData, o, s);
          u.data.originalEvent = e, this.processInteractive(u, this.lastObjectRendered, this.processPointerMove, !0), this.emit("pointermove", u), o.pointerType === "touch" && this.emit("touchmove", u), (o.pointerType === "mouse" || o.pointerType === "pen") && this.emit("mousemove", u);
        }
        i[0].pointerType === "mouse" && this.setCursorMode(this.cursor);
      }
    }, t.prototype.processPointerMove = function(e, i, n) {
      var a = e.data, o = a.pointerType === "touch", s = a.pointerType === "mouse" || a.pointerType === "pen";
      s && this.processPointerOverOut(e, i, n), (!this.moveWhenInside || n) && (this.dispatchEvent(i, "pointermove", e), o && this.dispatchEvent(i, "touchmove", e), s && this.dispatchEvent(i, "mousemove", e));
    }, t.prototype.onPointerOut = function(e) {
      if (!(this.supportsTouchEvents && e.pointerType === "touch")) {
        var i = this.normalizeToPointerData(e), n = i[0];
        n.pointerType === "mouse" && (this.mouseOverRenderer = !1, this.setCursorMode(null));
        var a = this.getInteractionDataForPointerId(n), o = this.configureInteractionEventForDOMEvent(this.eventData, n, a);
        o.data.originalEvent = n, this.processInteractive(o, this.lastObjectRendered, this.processPointerOverOut, !1), this.emit("pointerout", o), n.pointerType === "mouse" || n.pointerType === "pen" ? this.emit("mouseout", o) : this.releaseInteractionDataForPointerId(a.identifier);
      }
    }, t.prototype.processPointerOverOut = function(e, i, n) {
      var a = e.data, o = e.data.identifier, s = a.pointerType === "mouse" || a.pointerType === "pen", u = i.trackedPointers[o];
      n && !u && (u = i.trackedPointers[o] = new aa(o)), u !== void 0 && (n && this.mouseOverRenderer ? (u.over || (u.over = !0, this.delayDispatchEvent(i, "pointerover", e), s && this.delayDispatchEvent(i, "mouseover", e)), s && this.cursor === null && (this.cursor = i.cursor)) : u.over && (u.over = !1, this.dispatchEvent(i, "pointerout", this.eventData), s && this.dispatchEvent(i, "mouseout", e), u.none && delete i.trackedPointers[o]));
    }, t.prototype.onPointerOver = function(e) {
      if (!(this.supportsTouchEvents && e.pointerType === "touch")) {
        var i = this.normalizeToPointerData(e), n = i[0], a = this.getInteractionDataForPointerId(n), o = this.configureInteractionEventForDOMEvent(this.eventData, n, a);
        o.data.originalEvent = n, n.pointerType === "mouse" && (this.mouseOverRenderer = !0), this.emit("pointerover", o), (n.pointerType === "mouse" || n.pointerType === "pen") && this.emit("mouseover", o);
      }
    }, t.prototype.getInteractionDataForPointerId = function(e) {
      var i = e.pointerId, n;
      return i === Ni || e.pointerType === "mouse" ? n = this.mouse : this.activeInteractionData[i] ? n = this.activeInteractionData[i] : (n = this.interactionDataPool.pop() || new su(), n.identifier = i, this.activeInteractionData[i] = n), n.copyEvent(e), n;
    }, t.prototype.releaseInteractionDataForPointerId = function(e) {
      var i = this.activeInteractionData[e];
      i && (delete this.activeInteractionData[e], i.reset(), this.interactionDataPool.push(i));
    }, t.prototype.configureInteractionEventForDOMEvent = function(e, i, n) {
      return e.data = n, this.mapPositionToPoint(n.global, i.clientX, i.clientY), i.pointerType === "touch" && (i.globalX = n.global.x, i.globalY = n.global.y), n.originalEvent = i, e.reset(), e;
    }, t.prototype.normalizeToPointerData = function(e) {
      var i = [];
      if (this.supportsTouchEvents && e instanceof TouchEvent)
        for (var n = 0, a = e.changedTouches.length; n < a; n++) {
          var o = e.changedTouches[n];
          typeof o.button > "u" && (o.button = e.touches.length ? 1 : 0), typeof o.buttons > "u" && (o.buttons = e.touches.length ? 1 : 0), typeof o.isPrimary > "u" && (o.isPrimary = e.touches.length === 1 && e.type === "touchstart"), typeof o.width > "u" && (o.width = o.radiusX || 1), typeof o.height > "u" && (o.height = o.radiusY || 1), typeof o.tiltX > "u" && (o.tiltX = 0), typeof o.tiltY > "u" && (o.tiltY = 0), typeof o.pointerType > "u" && (o.pointerType = "touch"), typeof o.pointerId > "u" && (o.pointerId = o.identifier || 0), typeof o.pressure > "u" && (o.pressure = o.force || 0.5), typeof o.twist > "u" && (o.twist = 0), typeof o.tangentialPressure > "u" && (o.tangentialPressure = 0), typeof o.layerX > "u" && (o.layerX = o.offsetX = o.clientX), typeof o.layerY > "u" && (o.layerY = o.offsetY = o.clientY), o.isNormalized = !0, i.push(o);
        }
      else if (!globalThis.MouseEvent || e instanceof MouseEvent && (!this.supportsPointerEvents || !(e instanceof globalThis.PointerEvent))) {
        var s = e;
        typeof s.isPrimary > "u" && (s.isPrimary = !0), typeof s.width > "u" && (s.width = 1), typeof s.height > "u" && (s.height = 1), typeof s.tiltX > "u" && (s.tiltX = 0), typeof s.tiltY > "u" && (s.tiltY = 0), typeof s.pointerType > "u" && (s.pointerType = "mouse"), typeof s.pointerId > "u" && (s.pointerId = Ni), typeof s.pressure > "u" && (s.pressure = 0.5), typeof s.twist > "u" && (s.twist = 0), typeof s.tangentialPressure > "u" && (s.tangentialPressure = 0), s.isNormalized = !0, i.push(s);
      } else
        i.push(e);
      return i;
    }, t.prototype.destroy = function() {
      this.removeEvents(), this.removeTickerListener(), this.removeAllListeners(), this.renderer = null, this.mouse = null, this.eventData = null, this.interactionDOMElement = null, this.onPointerDown = null, this.processPointerDown = null, this.onPointerUp = null, this.processPointerUp = null, this.onPointerCancel = null, this.processPointerCancel = null, this.onPointerMove = null, this.processPointerMove = null, this.onPointerOut = null, this.processPointerOverOut = null, this.onPointerOver = null, this.search = null;
    }, t.extension = {
      name: "interaction",
      type: [
        vt.RendererPlugin,
        vt.CanvasRendererPlugin
      ]
    }, t;
  }(fi)
);
/*!
 * @pixi/extract - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/extract is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var cm = new st(), dm = 4, pm = (
  /** @class */
  function() {
    function r(t) {
      this.renderer = t;
    }
    return r.prototype.image = function(t, e, i) {
      var n = new Image();
      return n.src = this.base64(t, e, i), n;
    }, r.prototype.base64 = function(t, e, i) {
      return this.canvas(t).toDataURL(e, i);
    }, r.prototype.canvas = function(t, e) {
      var i = this._rawPixels(t, e), n = i.pixels, a = i.width, o = i.height, s = i.flipY, u = new Vs(a, o, 1), h = u.context.getImageData(0, 0, a, o);
      if (r.arrayPostDivide(n, h.data), u.context.putImageData(h, 0, 0), s) {
        var l = new Vs(u.width, u.height, 1);
        l.context.scale(1, -1), l.context.drawImage(u.canvas, 0, -o), u.destroy(), u = l;
      }
      return u.canvas;
    }, r.prototype.pixels = function(t, e) {
      var i = this._rawPixels(t, e).pixels;
      return r.arrayPostDivide(i, i), i;
    }, r.prototype._rawPixels = function(t, e) {
      var i = this.renderer, n, a = !1, o, s = !1;
      if (t)
        if (t instanceof or)
          o = t;
        else {
          var u = i.context.webGLVersion >= 2 ? i.multisample : bt.NONE;
          if (o = this.renderer.generateTexture(t, { multisample: u }), u !== bt.NONE) {
            var h = or.create({
              width: o.width,
              height: o.height
            });
            i.framebuffer.bind(o.framebuffer), i.framebuffer.blit(h.framebuffer), i.framebuffer.bind(null), o.destroy(!0), o = h;
          }
          s = !0;
        }
      o ? (n = o.baseTexture.resolution, e = e ?? o.frame, a = !1, i.renderTexture.bind(o)) : (n = i.resolution, e || (e = cm, e.width = i.width, e.height = i.height), a = !0, i.renderTexture.bind(null));
      var l = Math.round(e.width * n), f = Math.round(e.height * n), c = new Uint8Array(dm * l * f), d = i.gl;
      return d.readPixels(Math.round(e.x * n), Math.round(e.y * n), l, f, d.RGBA, d.UNSIGNED_BYTE, c), s && o.destroy(!0), { pixels: c, width: l, height: f, flipY: a };
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r.arrayPostDivide = function(t, e) {
      for (var i = 0; i < t.length; i += 4) {
        var n = e[i + 3] = t[i + 3];
        n !== 0 ? (e[i] = Math.round(Math.min(t[i] * 255 / n, 255)), e[i + 1] = Math.round(Math.min(t[i + 1] * 255 / n, 255)), e[i + 2] = Math.round(Math.min(t[i + 2] * 255 / n, 255))) : (e[i] = t[i], e[i + 1] = t[i + 1], e[i + 2] = t[i + 2]);
      }
    }, r.extension = {
      name: "extract",
      type: vt.RendererPlugin
    }, r;
  }()
);
/*!
 * @pixi/loaders - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/loaders is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var Li = (
  /** @class */
  function() {
    function r(t, e, i) {
      e === void 0 && (e = !1), this._fn = t, this._once = e, this._thisArg = i, this._next = this._prev = this._owner = null;
    }
    return r.prototype.detach = function() {
      return this._owner === null ? !1 : (this._owner.detach(this), !0);
    }, r;
  }()
);
function uu(r, t) {
  return r._head ? (r._tail._next = t, t._prev = r._tail, r._tail = t) : (r._head = t, r._tail = t), t._owner = r, t;
}
var Ee = (
  /** @class */
  function() {
    function r() {
      this._head = this._tail = void 0;
    }
    return r.prototype.handlers = function(t) {
      t === void 0 && (t = !1);
      var e = this._head;
      if (t)
        return !!e;
      for (var i = []; e; )
        i.push(e), e = e._next;
      return i;
    }, r.prototype.has = function(t) {
      if (!(t instanceof Li))
        throw new Error("MiniSignal#has(): First arg must be a SignalBinding object.");
      return t._owner === this;
    }, r.prototype.dispatch = function() {
      for (var t = arguments, e = [], i = 0; i < arguments.length; i++)
        e[i] = t[i];
      var n = this._head;
      if (!n)
        return !1;
      for (; n; )
        n._once && this.detach(n), n._fn.apply(n._thisArg, e), n = n._next;
      return !0;
    }, r.prototype.add = function(t, e) {
      if (e === void 0 && (e = null), typeof t != "function")
        throw new Error("MiniSignal#add(): First arg must be a Function.");
      return uu(this, new Li(t, !1, e));
    }, r.prototype.once = function(t, e) {
      if (e === void 0 && (e = null), typeof t != "function")
        throw new Error("MiniSignal#once(): First arg must be a Function.");
      return uu(this, new Li(t, !0, e));
    }, r.prototype.detach = function(t) {
      if (!(t instanceof Li))
        throw new Error("MiniSignal#detach(): First arg must be a SignalBinding object.");
      return t._owner !== this ? this : (t._prev && (t._prev._next = t._next), t._next && (t._next._prev = t._prev), t === this._head ? (this._head = t._next, t._next === null && (this._tail = null)) : t === this._tail && (this._tail = t._prev, this._tail._next = null), t._owner = null, this);
    }, r.prototype.detachAll = function() {
      var t = this._head;
      if (!t)
        return this;
      for (this._head = this._tail = null; t; )
        t._owner = null, t = t._next;
      return this;
    }, r;
  }()
);
function nl(r, t) {
  t = t || {};
  for (var e = {
    // eslint-disable-next-line max-len
    key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
    q: {
      name: "queryKey",
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
      // eslint-disable-next-line max-len
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      // eslint-disable-next-line max-len
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
  }, i = e.parser[t.strictMode ? "strict" : "loose"].exec(r), n = {}, a = 14; a--; )
    n[e.key[a]] = i[a] || "";
  return n[e.q.name] = {}, n[e.key[12]].replace(e.q.parser, function(o, s, u) {
    s && (n[e.q.name][s] = u);
  }), n;
}
var oa, Ui = null, vm = 0, hu = 200, _m = 204, ym = 1223, gm = 2;
function lu() {
}
function fu(r, t, e) {
  t && t.indexOf(".") === 0 && (t = t.substring(1)), t && (r[t] = e);
}
function sa(r) {
  return r.toString().replace("object ", "");
}
var Pt = (
  /** @class */
  function() {
    function r(t, e, i) {
      if (this._dequeue = lu, this._onLoadBinding = null, this._elementTimer = 0, this._boundComplete = null, this._boundOnError = null, this._boundOnProgress = null, this._boundOnTimeout = null, this._boundXhrOnError = null, this._boundXhrOnTimeout = null, this._boundXhrOnAbort = null, this._boundXhrOnLoad = null, typeof t != "string" || typeof e != "string")
        throw new Error("Both name and url are required for constructing a resource.");
      i = i || {}, this._flags = 0, this._setFlag(r.STATUS_FLAGS.DATA_URL, e.indexOf("data:") === 0), this.name = t, this.url = e, this.extension = this._getExtension(), this.data = null, this.crossOrigin = i.crossOrigin === !0 ? "anonymous" : i.crossOrigin, this.timeout = i.timeout || 0, this.loadType = i.loadType || this._determineLoadType(), this.xhrType = i.xhrType, this.metadata = i.metadata || {}, this.error = null, this.xhr = null, this.children = [], this.type = r.TYPE.UNKNOWN, this.progressChunk = 0, this._dequeue = lu, this._onLoadBinding = null, this._elementTimer = 0, this._boundComplete = this.complete.bind(this), this._boundOnError = this._onError.bind(this), this._boundOnProgress = this._onProgress.bind(this), this._boundOnTimeout = this._onTimeout.bind(this), this._boundXhrOnError = this._xhrOnError.bind(this), this._boundXhrOnTimeout = this._xhrOnTimeout.bind(this), this._boundXhrOnAbort = this._xhrOnAbort.bind(this), this._boundXhrOnLoad = this._xhrOnLoad.bind(this), this.onStart = new Ee(), this.onProgress = new Ee(), this.onComplete = new Ee(), this.onAfterMiddleware = new Ee();
    }
    return r.setExtensionLoadType = function(t, e) {
      fu(r._loadTypeMap, t, e);
    }, r.setExtensionXhrType = function(t, e) {
      fu(r._xhrTypeMap, t, e);
    }, Object.defineProperty(r.prototype, "isDataUrl", {
      /**
       * When the resource starts to load.
       * @memberof PIXI.LoaderResource
       * @callback OnStartSignal
       * @param {PIXI.Resource} resource - The resource that the event happened on.
       */
      /**
       * When the resource reports loading progress.
       * @memberof PIXI.LoaderResource
       * @callback OnProgressSignal
       * @param {PIXI.Resource} resource - The resource that the event happened on.
       * @param {number} percentage - The progress of the load in the range [0, 1].
       */
      /**
       * When the resource finishes loading.
       * @memberof PIXI.LoaderResource
       * @callback OnCompleteSignal
       * @param {PIXI.Resource} resource - The resource that the event happened on.
       */
      /**
       * @memberof PIXI.LoaderResource
       * @typedef {object} IMetadata
       * @property {HTMLImageElement|HTMLAudioElement|HTMLVideoElement} [loadElement=null] - The
       *      element to use for loading, instead of creating one.
       * @property {boolean} [skipSource=false] - Skips adding source(s) to the load element. This
       *      is useful if you want to pass in a `loadElement` that you already added load sources to.
       * @property {string|string[]} [mimeType] - The mime type to use for the source element
       *      of a video/audio elment. If the urls are an array, you can pass this as an array as well
       *      where each index is the mime type to use for the corresponding url index.
       */
      /**
       * Stores whether or not this url is a data url.
       * @readonly
       * @member {boolean}
       */
      get: function() {
        return this._hasFlag(r.STATUS_FLAGS.DATA_URL);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "isComplete", {
      /**
       * Describes if this resource has finished loading. Is true when the resource has completely
       * loaded.
       * @readonly
       * @member {boolean}
       */
      get: function() {
        return this._hasFlag(r.STATUS_FLAGS.COMPLETE);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "isLoading", {
      /**
       * Describes if this resource is currently loading. Is true when the resource starts loading,
       * and is false again when complete.
       * @readonly
       * @member {boolean}
       */
      get: function() {
        return this._hasFlag(r.STATUS_FLAGS.LOADING);
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.complete = function() {
      this._clearEvents(), this._finish();
    }, r.prototype.abort = function(t) {
      if (!this.error) {
        if (this.error = new Error(t), this._clearEvents(), this.xhr)
          this.xhr.abort();
        else if (this.xdr)
          this.xdr.abort();
        else if (this.data)
          if (this.data.src)
            this.data.src = r.EMPTY_GIF;
          else
            for (; this.data.firstChild; )
              this.data.removeChild(this.data.firstChild);
        this._finish();
      }
    }, r.prototype.load = function(t) {
      var e = this;
      if (!this.isLoading) {
        if (this.isComplete) {
          t && setTimeout(function() {
            return t(e);
          }, 1);
          return;
        } else
          t && this.onComplete.once(t);
        switch (this._setFlag(r.STATUS_FLAGS.LOADING, !0), this.onStart.dispatch(this), (this.crossOrigin === !1 || typeof this.crossOrigin != "string") && (this.crossOrigin = this._determineCrossOrigin(this.url)), this.loadType) {
          case r.LOAD_TYPE.IMAGE:
            this.type = r.TYPE.IMAGE, this._loadElement("image");
            break;
          case r.LOAD_TYPE.AUDIO:
            this.type = r.TYPE.AUDIO, this._loadSourceElement("audio");
            break;
          case r.LOAD_TYPE.VIDEO:
            this.type = r.TYPE.VIDEO, this._loadSourceElement("video");
            break;
          case r.LOAD_TYPE.XHR:
          default:
            typeof oa > "u" && (oa = !!(globalThis.XDomainRequest && !("withCredentials" in new XMLHttpRequest()))), oa && this.crossOrigin ? this._loadXdr() : this._loadXhr();
            break;
        }
      }
    }, r.prototype._hasFlag = function(t) {
      return (this._flags & t) !== 0;
    }, r.prototype._setFlag = function(t, e) {
      this._flags = e ? this._flags | t : this._flags & ~t;
    }, r.prototype._clearEvents = function() {
      clearTimeout(this._elementTimer), this.data && this.data.removeEventListener && (this.data.removeEventListener("error", this._boundOnError, !1), this.data.removeEventListener("load", this._boundComplete, !1), this.data.removeEventListener("progress", this._boundOnProgress, !1), this.data.removeEventListener("canplaythrough", this._boundComplete, !1)), this.xhr && (this.xhr.removeEventListener ? (this.xhr.removeEventListener("error", this._boundXhrOnError, !1), this.xhr.removeEventListener("timeout", this._boundXhrOnTimeout, !1), this.xhr.removeEventListener("abort", this._boundXhrOnAbort, !1), this.xhr.removeEventListener("progress", this._boundOnProgress, !1), this.xhr.removeEventListener("load", this._boundXhrOnLoad, !1)) : (this.xhr.onerror = null, this.xhr.ontimeout = null, this.xhr.onprogress = null, this.xhr.onload = null));
    }, r.prototype._finish = function() {
      if (this.isComplete)
        throw new Error("Complete called again for an already completed resource.");
      this._setFlag(r.STATUS_FLAGS.COMPLETE, !0), this._setFlag(r.STATUS_FLAGS.LOADING, !1), this.onComplete.dispatch(this);
    }, r.prototype._loadElement = function(t) {
      this.metadata.loadElement ? this.data = this.metadata.loadElement : t === "image" && typeof globalThis.Image < "u" ? this.data = new Image() : this.data = document.createElement(t), this.crossOrigin && (this.data.crossOrigin = this.crossOrigin), this.metadata.skipSource || (this.data.src = this.url), this.data.addEventListener("error", this._boundOnError, !1), this.data.addEventListener("load", this._boundComplete, !1), this.data.addEventListener("progress", this._boundOnProgress, !1), this.timeout && (this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout));
    }, r.prototype._loadSourceElement = function(t) {
      if (this.metadata.loadElement ? this.data = this.metadata.loadElement : t === "audio" && typeof globalThis.Audio < "u" ? this.data = new Audio() : this.data = document.createElement(t), this.data === null) {
        this.abort("Unsupported element: " + t);
        return;
      }
      if (this.crossOrigin && (this.data.crossOrigin = this.crossOrigin), !this.metadata.skipSource)
        if (navigator.isCocoonJS)
          this.data.src = Array.isArray(this.url) ? this.url[0] : this.url;
        else if (Array.isArray(this.url))
          for (var e = this.metadata.mimeType, i = 0; i < this.url.length; ++i)
            this.data.appendChild(this._createSource(t, this.url[i], Array.isArray(e) ? e[i] : e));
        else {
          var e = this.metadata.mimeType;
          this.data.appendChild(this._createSource(t, this.url, Array.isArray(e) ? e[0] : e));
        }
      this.data.addEventListener("error", this._boundOnError, !1), this.data.addEventListener("load", this._boundComplete, !1), this.data.addEventListener("progress", this._boundOnProgress, !1), this.data.addEventListener("canplaythrough", this._boundComplete, !1), this.data.load(), this.timeout && (this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout));
    }, r.prototype._loadXhr = function() {
      typeof this.xhrType != "string" && (this.xhrType = this._determineXhrType());
      var t = this.xhr = new XMLHttpRequest();
      this.crossOrigin === "use-credentials" && (t.withCredentials = !0), t.open("GET", this.url, !0), t.timeout = this.timeout, this.xhrType === r.XHR_RESPONSE_TYPE.JSON || this.xhrType === r.XHR_RESPONSE_TYPE.DOCUMENT ? t.responseType = r.XHR_RESPONSE_TYPE.TEXT : t.responseType = this.xhrType, t.addEventListener("error", this._boundXhrOnError, !1), t.addEventListener("timeout", this._boundXhrOnTimeout, !1), t.addEventListener("abort", this._boundXhrOnAbort, !1), t.addEventListener("progress", this._boundOnProgress, !1), t.addEventListener("load", this._boundXhrOnLoad, !1), t.send();
    }, r.prototype._loadXdr = function() {
      typeof this.xhrType != "string" && (this.xhrType = this._determineXhrType());
      var t = this.xhr = new globalThis.XDomainRequest();
      t.timeout = this.timeout || 5e3, t.onerror = this._boundXhrOnError, t.ontimeout = this._boundXhrOnTimeout, t.onprogress = this._boundOnProgress, t.onload = this._boundXhrOnLoad, t.open("GET", this.url, !0), setTimeout(function() {
        return t.send();
      }, 1);
    }, r.prototype._createSource = function(t, e, i) {
      i || (i = t + "/" + this._getExtension(e));
      var n = document.createElement("source");
      return n.src = e, n.type = i, n;
    }, r.prototype._onError = function(t) {
      this.abort("Failed to load element using: " + t.target.nodeName);
    }, r.prototype._onProgress = function(t) {
      t && t.lengthComputable && this.onProgress.dispatch(this, t.loaded / t.total);
    }, r.prototype._onTimeout = function() {
      this.abort("Load timed out.");
    }, r.prototype._xhrOnError = function() {
      var t = this.xhr;
      this.abort(sa(t) + " Request failed. Status: " + t.status + ', text: "' + t.statusText + '"');
    }, r.prototype._xhrOnTimeout = function() {
      var t = this.xhr;
      this.abort(sa(t) + " Request timed out.");
    }, r.prototype._xhrOnAbort = function() {
      var t = this.xhr;
      this.abort(sa(t) + " Request was aborted by the user.");
    }, r.prototype._xhrOnLoad = function() {
      var t = this.xhr, e = "", i = typeof t.status > "u" ? hu : t.status;
      (t.responseType === "" || t.responseType === "text" || typeof t.responseType > "u") && (e = t.responseText), i === vm && (e.length > 0 || t.responseType === r.XHR_RESPONSE_TYPE.BUFFER) ? i = hu : i === ym && (i = _m);
      var n = i / 100 | 0;
      if (n === gm)
        if (this.xhrType === r.XHR_RESPONSE_TYPE.TEXT)
          this.data = e, this.type = r.TYPE.TEXT;
        else if (this.xhrType === r.XHR_RESPONSE_TYPE.JSON)
          try {
            this.data = JSON.parse(e), this.type = r.TYPE.JSON;
          } catch (s) {
            this.abort("Error trying to parse loaded json: " + s);
            return;
          }
        else if (this.xhrType === r.XHR_RESPONSE_TYPE.DOCUMENT)
          try {
            if (globalThis.DOMParser) {
              var a = new DOMParser();
              this.data = a.parseFromString(e, "text/xml");
            } else {
              var o = document.createElement("div");
              o.innerHTML = e, this.data = o;
            }
            this.type = r.TYPE.XML;
          } catch (s) {
            this.abort("Error trying to parse loaded xml: " + s);
            return;
          }
        else
          this.data = t.response || e;
      else {
        this.abort("[" + t.status + "] " + t.statusText + ": " + t.responseURL);
        return;
      }
      this.complete();
    }, r.prototype._determineCrossOrigin = function(t, e) {
      if (t.indexOf("data:") === 0)
        return "";
      if (globalThis.origin !== globalThis.location.origin)
        return "anonymous";
      e = e || globalThis.location, Ui || (Ui = document.createElement("a")), Ui.href = t;
      var i = nl(Ui.href, { strictMode: !0 }), n = !i.port && e.port === "" || i.port === e.port, a = i.protocol ? i.protocol + ":" : "";
      return i.host !== e.hostname || !n || a !== e.protocol ? "anonymous" : "";
    }, r.prototype._determineXhrType = function() {
      return r._xhrTypeMap[this.extension] || r.XHR_RESPONSE_TYPE.TEXT;
    }, r.prototype._determineLoadType = function() {
      return r._loadTypeMap[this.extension] || r.LOAD_TYPE.XHR;
    }, r.prototype._getExtension = function(t) {
      t === void 0 && (t = this.url);
      var e = "";
      if (this.isDataUrl) {
        var i = t.indexOf("/");
        e = t.substring(i + 1, t.indexOf(";", i));
      } else {
        var n = t.indexOf("?"), a = t.indexOf("#"), o = Math.min(n > -1 ? n : t.length, a > -1 ? a : t.length);
        t = t.substring(0, o), e = t.substring(t.lastIndexOf(".") + 1);
      }
      return e.toLowerCase();
    }, r.prototype._getMimeFromXhrType = function(t) {
      switch (t) {
        case r.XHR_RESPONSE_TYPE.BUFFER:
          return "application/octet-binary";
        case r.XHR_RESPONSE_TYPE.BLOB:
          return "application/blob";
        case r.XHR_RESPONSE_TYPE.DOCUMENT:
          return "application/xml";
        case r.XHR_RESPONSE_TYPE.JSON:
          return "application/json";
        case r.XHR_RESPONSE_TYPE.DEFAULT:
        case r.XHR_RESPONSE_TYPE.TEXT:
        default:
          return "text/plain";
      }
    }, r;
  }()
);
(function(r) {
  (function(t) {
    t[t.NONE = 0] = "NONE", t[t.DATA_URL = 1] = "DATA_URL", t[t.COMPLETE = 2] = "COMPLETE", t[t.LOADING = 4] = "LOADING";
  })(r.STATUS_FLAGS || (r.STATUS_FLAGS = {})), function(t) {
    t[t.UNKNOWN = 0] = "UNKNOWN", t[t.JSON = 1] = "JSON", t[t.XML = 2] = "XML", t[t.IMAGE = 3] = "IMAGE", t[t.AUDIO = 4] = "AUDIO", t[t.VIDEO = 5] = "VIDEO", t[t.TEXT = 6] = "TEXT";
  }(r.TYPE || (r.TYPE = {})), function(t) {
    t[t.XHR = 1] = "XHR", t[t.IMAGE = 2] = "IMAGE", t[t.AUDIO = 3] = "AUDIO", t[t.VIDEO = 4] = "VIDEO";
  }(r.LOAD_TYPE || (r.LOAD_TYPE = {})), function(t) {
    t.DEFAULT = "text", t.BUFFER = "arraybuffer", t.BLOB = "blob", t.DOCUMENT = "document", t.JSON = "json", t.TEXT = "text";
  }(r.XHR_RESPONSE_TYPE || (r.XHR_RESPONSE_TYPE = {})), r._loadTypeMap = {
    // images
    gif: r.LOAD_TYPE.IMAGE,
    png: r.LOAD_TYPE.IMAGE,
    bmp: r.LOAD_TYPE.IMAGE,
    jpg: r.LOAD_TYPE.IMAGE,
    jpeg: r.LOAD_TYPE.IMAGE,
    tif: r.LOAD_TYPE.IMAGE,
    tiff: r.LOAD_TYPE.IMAGE,
    webp: r.LOAD_TYPE.IMAGE,
    tga: r.LOAD_TYPE.IMAGE,
    avif: r.LOAD_TYPE.IMAGE,
    svg: r.LOAD_TYPE.IMAGE,
    "svg+xml": r.LOAD_TYPE.IMAGE,
    // audio
    mp3: r.LOAD_TYPE.AUDIO,
    ogg: r.LOAD_TYPE.AUDIO,
    wav: r.LOAD_TYPE.AUDIO,
    // videos
    mp4: r.LOAD_TYPE.VIDEO,
    webm: r.LOAD_TYPE.VIDEO
  }, r._xhrTypeMap = {
    // xml
    xhtml: r.XHR_RESPONSE_TYPE.DOCUMENT,
    html: r.XHR_RESPONSE_TYPE.DOCUMENT,
    htm: r.XHR_RESPONSE_TYPE.DOCUMENT,
    xml: r.XHR_RESPONSE_TYPE.DOCUMENT,
    tmx: r.XHR_RESPONSE_TYPE.DOCUMENT,
    svg: r.XHR_RESPONSE_TYPE.DOCUMENT,
    // This was added to handle Tiled Tileset XML, but .tsx is also a TypeScript React Component.
    // Since it is way less likely for people to be loading TypeScript files instead of Tiled files,
    // this should probably be fine.
    tsx: r.XHR_RESPONSE_TYPE.DOCUMENT,
    // images
    gif: r.XHR_RESPONSE_TYPE.BLOB,
    png: r.XHR_RESPONSE_TYPE.BLOB,
    bmp: r.XHR_RESPONSE_TYPE.BLOB,
    jpg: r.XHR_RESPONSE_TYPE.BLOB,
    jpeg: r.XHR_RESPONSE_TYPE.BLOB,
    tif: r.XHR_RESPONSE_TYPE.BLOB,
    tiff: r.XHR_RESPONSE_TYPE.BLOB,
    webp: r.XHR_RESPONSE_TYPE.BLOB,
    tga: r.XHR_RESPONSE_TYPE.BLOB,
    avif: r.XHR_RESPONSE_TYPE.BLOB,
    // json
    json: r.XHR_RESPONSE_TYPE.JSON,
    // text
    text: r.XHR_RESPONSE_TYPE.TEXT,
    txt: r.XHR_RESPONSE_TYPE.TEXT,
    // fonts
    ttf: r.XHR_RESPONSE_TYPE.BUFFER,
    otf: r.XHR_RESPONSE_TYPE.BUFFER
  }, r.EMPTY_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
})(Pt || (Pt = {}));
function je() {
}
function mm(r) {
  return function() {
    for (var e = arguments, i = [], n = 0; n < arguments.length; n++)
      i[n] = e[n];
    if (r === null)
      throw new Error("Callback was already called.");
    var a = r;
    r = null, a.apply(this, i);
  };
}
var bm = (
  /** @class */
  function() {
    function r(t, e) {
      this.data = t, this.callback = e;
    }
    return r;
  }()
), ua = (
  /** @class */
  function() {
    function r(t, e) {
      var i = this;
      if (e === void 0 && (e = 1), this.workers = 0, this.saturated = je, this.unsaturated = je, this.empty = je, this.drain = je, this.error = je, this.started = !1, this.paused = !1, this._tasks = [], this._insert = function(n, a, o) {
        if (o && typeof o != "function")
          throw new Error("task callback must be a function");
        if (i.started = !0, n == null && i.idle()) {
          setTimeout(function() {
            return i.drain();
          }, 1);
          return;
        }
        var s = new bm(n, typeof o == "function" ? o : je);
        a ? i._tasks.unshift(s) : i._tasks.push(s), setTimeout(i.process, 1);
      }, this.process = function() {
        for (; !i.paused && i.workers < i.concurrency && i._tasks.length; ) {
          var n = i._tasks.shift();
          i._tasks.length === 0 && i.empty(), i.workers += 1, i.workers === i.concurrency && i.saturated(), i._worker(n.data, mm(i._next(n)));
        }
      }, this._worker = t, e === 0)
        throw new Error("Concurrency must not be zero");
      this.concurrency = e, this.buffer = e / 4;
    }
    return r.prototype._next = function(t) {
      var e = this;
      return function() {
        for (var i = arguments, n = [], a = 0; a < arguments.length; a++)
          n[a] = i[a];
        e.workers -= 1, t.callback.apply(t, n), n[0] != null && e.error(n[0], t.data), e.workers <= e.concurrency - e.buffer && e.unsaturated(), e.idle() && e.drain(), e.process();
      };
    }, r.prototype.push = function(t, e) {
      this._insert(t, !1, e);
    }, r.prototype.kill = function() {
      this.workers = 0, this.drain = je, this.started = !1, this._tasks = [];
    }, r.prototype.unshift = function(t, e) {
      this._insert(t, !0, e);
    }, r.prototype.length = function() {
      return this._tasks.length;
    }, r.prototype.running = function() {
      return this.workers;
    }, r.prototype.idle = function() {
      return this._tasks.length + this.workers === 0;
    }, r.prototype.pause = function() {
      this.paused !== !0 && (this.paused = !0);
    }, r.prototype.resume = function() {
      if (this.paused !== !1) {
        this.paused = !1;
        for (var t = 1; t <= this.concurrency; t++)
          this.process();
      }
    }, r.eachSeries = function(t, e, i, n) {
      var a = 0, o = t.length;
      function s(u) {
        if (u || a === o) {
          i && i(u);
          return;
        }
        n ? setTimeout(function() {
          e(t[a++], s);
        }, 1) : e(t[a++], s);
      }
      s();
    }, r.queue = function(t, e) {
      return new r(t, e);
    }, r;
  }()
), ha = 100, Em = /(#[\w-]+)?$/, _n = (
  /** @class */
  function() {
    function r(t, e) {
      var i = this;
      t === void 0 && (t = ""), e === void 0 && (e = 10), this.progress = 0, this.loading = !1, this.defaultQueryString = "", this._beforeMiddleware = [], this._afterMiddleware = [], this._resourcesParsing = [], this._boundLoadResource = function(u, h) {
        return i._loadResource(u, h);
      }, this.resources = {}, this.baseUrl = t, this._beforeMiddleware = [], this._afterMiddleware = [], this._resourcesParsing = [], this._boundLoadResource = function(u, h) {
        return i._loadResource(u, h);
      }, this._queue = ua.queue(this._boundLoadResource, e), this._queue.pause(), this.resources = {}, this.onProgress = new Ee(), this.onError = new Ee(), this.onLoad = new Ee(), this.onStart = new Ee(), this.onComplete = new Ee();
      for (var n = 0; n < r._plugins.length; ++n) {
        var a = r._plugins[n], o = a.pre, s = a.use;
        o && this.pre(o), s && this.use(s);
      }
      this._protected = !1;
    }
    return r.prototype._add = function(t, e, i, n) {
      if (this.loading && (!i || !i.parentResource))
        throw new Error("Cannot add resources while the loader is running.");
      if (this.resources[t])
        throw new Error('Resource named "' + t + '" already exists.');
      if (e = this._prepareUrl(e), this.resources[t] = new Pt(t, e, i), typeof n == "function" && this.resources[t].onAfterMiddleware.once(n), this.loading) {
        for (var a = i.parentResource, o = [], s = 0; s < a.children.length; ++s)
          a.children[s].isComplete || o.push(a.children[s]);
        var u = a.progressChunk * (o.length + 1), h = u / (o.length + 2);
        a.children.push(this.resources[t]), a.progressChunk = h;
        for (var s = 0; s < o.length; ++s)
          o[s].progressChunk = h;
        this.resources[t].progressChunk = h;
      }
      return this._queue.push(this.resources[t]), this;
    }, r.prototype.pre = function(t) {
      return this._beforeMiddleware.push(t), this;
    }, r.prototype.use = function(t) {
      return this._afterMiddleware.push(t), this;
    }, r.prototype.reset = function() {
      this.progress = 0, this.loading = !1, this._queue.kill(), this._queue.pause();
      for (var t in this.resources) {
        var e = this.resources[t];
        e._onLoadBinding && e._onLoadBinding.detach(), e.isLoading && e.abort("loader reset");
      }
      return this.resources = {}, this;
    }, r.prototype.load = function(t) {
      if (ae("6.5.0", "@pixi/loaders is being replaced with @pixi/assets in the next major release."), typeof t == "function" && this.onComplete.once(t), this.loading)
        return this;
      if (this._queue.idle())
        this._onStart(), this._onComplete();
      else {
        for (var e = this._queue._tasks.length, i = ha / e, n = 0; n < this._queue._tasks.length; ++n)
          this._queue._tasks[n].data.progressChunk = i;
        this._onStart(), this._queue.resume();
      }
      return this;
    }, Object.defineProperty(r.prototype, "concurrency", {
      /**
       * The number of resources to load concurrently.
       * @default 10
       */
      get: function() {
        return this._queue.concurrency;
      },
      set: function(t) {
        this._queue.concurrency = t;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype._prepareUrl = function(t) {
      var e = nl(t, { strictMode: !0 }), i;
      if (e.protocol || !e.path || t.indexOf("//") === 0 ? i = t : this.baseUrl.length && this.baseUrl.lastIndexOf("/") !== this.baseUrl.length - 1 && t.charAt(0) !== "/" ? i = this.baseUrl + "/" + t : i = this.baseUrl + t, this.defaultQueryString) {
        var n = Em.exec(i)[0];
        i = i.slice(0, i.length - n.length), i.indexOf("?") !== -1 ? i += "&" + this.defaultQueryString : i += "?" + this.defaultQueryString, i += n;
      }
      return i;
    }, r.prototype._loadResource = function(t, e) {
      var i = this;
      t._dequeue = e, ua.eachSeries(this._beforeMiddleware, function(n, a) {
        n.call(i, t, function() {
          a(t.isComplete ? {} : null);
        });
      }, function() {
        t.isComplete ? i._onLoad(t) : (t._onLoadBinding = t.onComplete.once(i._onLoad, i), t.load());
      }, !0);
    }, r.prototype._onStart = function() {
      this.progress = 0, this.loading = !0, this.onStart.dispatch(this);
    }, r.prototype._onComplete = function() {
      this.progress = ha, this.loading = !1, this.onComplete.dispatch(this, this.resources);
    }, r.prototype._onLoad = function(t) {
      var e = this;
      t._onLoadBinding = null, this._resourcesParsing.push(t), t._dequeue(), ua.eachSeries(this._afterMiddleware, function(i, n) {
        i.call(e, t, n);
      }, function() {
        t.onAfterMiddleware.dispatch(t), e.progress = Math.min(ha, e.progress + t.progressChunk), e.onProgress.dispatch(e, t), t.error ? e.onError.dispatch(t.error, e, t) : e.onLoad.dispatch(e, t), e._resourcesParsing.splice(e._resourcesParsing.indexOf(t), 1), e._queue.idle() && e._resourcesParsing.length === 0 && e._onComplete();
      }, !0);
    }, r.prototype.destroy = function() {
      this._protected || this.reset();
    }, Object.defineProperty(r, "shared", {
      /** A premade instance of the loader that can be used to load resources. */
      get: function() {
        var t = r._shared;
        return t || (t = new r(), t._protected = !0, r._shared = t), t;
      },
      enumerable: !1,
      configurable: !0
    }), r.registerPlugin = function(t) {
      return ae("6.5.0", "Loader.registerPlugin() is deprecated, use extensions.add() instead."), Pe.add({
        type: vt.Loader,
        ref: t
      }), r;
    }, r._plugins = [], r;
  }()
);
Pe.handleByList(vt.Loader, _n._plugins);
_n.prototype.add = function(t, e, i, n) {
  if (Array.isArray(t)) {
    for (var a = 0; a < t.length; ++a)
      this.add(t[a]);
    return this;
  }
  if (typeof t == "object" && (i = t, n = e || i.callback || i.onComplete, e = i.url, t = i.name || i.key || i.url), typeof e != "string" && (n = i, i = e, e = t), typeof e != "string")
    throw new Error("No url passed to add resource to loader.");
  return typeof i == "function" && (n = i, i = null), this._add(t, e, i, n);
};
var Tm = (
  /** @class */
  function() {
    function r() {
    }
    return r.init = function(t) {
      t = Object.assign({
        sharedLoader: !1
      }, t), this.loader = t.sharedLoader ? _n.shared : new _n();
    }, r.destroy = function() {
      this.loader && (this.loader.destroy(), this.loader = null);
    }, r.extension = vt.Application, r;
  }()
), xm = (
  /** @class */
  function() {
    function r() {
    }
    return r.add = function() {
      Pt.setExtensionLoadType("svg", Pt.LOAD_TYPE.XHR), Pt.setExtensionXhrType("svg", Pt.XHR_RESPONSE_TYPE.TEXT);
    }, r.use = function(t, e) {
      if (t.data && (t.type === Pt.TYPE.IMAGE || t.extension === "svg")) {
        var i = t.data, n = t.url, a = t.name, o = t.metadata;
        K.fromLoader(i, n, a, o).then(function(s) {
          t.texture = s, e();
        }).catch(e);
      } else
        e();
    }, r.extension = vt.Loader, r;
  }()
), wm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function Sm(r) {
  for (var t = "", e = 0; e < r.length; ) {
    for (var i = [0, 0, 0], n = [0, 0, 0, 0], a = 0; a < i.length; ++a)
      e < r.length ? i[a] = r.charCodeAt(e++) & 255 : i[a] = 0;
    n[0] = i[0] >> 2, n[1] = (i[0] & 3) << 4 | i[1] >> 4, n[2] = (i[1] & 15) << 2 | i[2] >> 6, n[3] = i[2] & 63;
    var o = e - (r.length - 1);
    switch (o) {
      case 2:
        n[3] = 64, n[2] = 64;
        break;
      case 1:
        n[3] = 64;
        break;
    }
    for (var a = 0; a < n.length; ++a)
      t += wm.charAt(n[a]);
  }
  return t;
}
function Pm(r, t) {
  if (!r.data) {
    t();
    return;
  }
  if (r.xhr && r.xhrType === Pt.XHR_RESPONSE_TYPE.BLOB) {
    if (!self.Blob || typeof r.data == "string") {
      var e = r.xhr.getResponseHeader("content-type");
      if (e && e.indexOf("image") === 0) {
        r.data = new Image(), r.data.src = "data:" + e + ";base64," + Sm(r.xhr.responseText), r.type = Pt.TYPE.IMAGE, r.data.onload = function() {
          r.data.onload = null, t();
        };
        return;
      }
    } else if (r.data.type.indexOf("image") === 0) {
      var i = globalThis.URL || globalThis.webkitURL, n = i.createObjectURL(r.data);
      r.blob = r.data, r.data = new Image(), r.data.src = n, r.type = Pt.TYPE.IMAGE, r.data.onload = function() {
        i.revokeObjectURL(n), r.data.onload = null, t();
      };
      return;
    }
  }
  t();
}
var Am = (
  /** @class */
  function() {
    function r() {
    }
    return r.extension = vt.Loader, r.use = Pm, r;
  }()
);
Pe.add(xm, Am);
/*!
 * @pixi/compressed-textures - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/compressed-textures is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var ct, Q;
(function(r) {
  r[r.COMPRESSED_RGB_S3TC_DXT1_EXT = 33776] = "COMPRESSED_RGB_S3TC_DXT1_EXT", r[r.COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777] = "COMPRESSED_RGBA_S3TC_DXT1_EXT", r[r.COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778] = "COMPRESSED_RGBA_S3TC_DXT3_EXT", r[r.COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779] = "COMPRESSED_RGBA_S3TC_DXT5_EXT", r[r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 35917] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT", r[r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 35918] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT", r[r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 35919] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT", r[r.COMPRESSED_SRGB_S3TC_DXT1_EXT = 35916] = "COMPRESSED_SRGB_S3TC_DXT1_EXT", r[r.COMPRESSED_R11_EAC = 37488] = "COMPRESSED_R11_EAC", r[r.COMPRESSED_SIGNED_R11_EAC = 37489] = "COMPRESSED_SIGNED_R11_EAC", r[r.COMPRESSED_RG11_EAC = 37490] = "COMPRESSED_RG11_EAC", r[r.COMPRESSED_SIGNED_RG11_EAC = 37491] = "COMPRESSED_SIGNED_RG11_EAC", r[r.COMPRESSED_RGB8_ETC2 = 37492] = "COMPRESSED_RGB8_ETC2", r[r.COMPRESSED_RGBA8_ETC2_EAC = 37496] = "COMPRESSED_RGBA8_ETC2_EAC", r[r.COMPRESSED_SRGB8_ETC2 = 37493] = "COMPRESSED_SRGB8_ETC2", r[r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 37497] = "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC", r[r.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37494] = "COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2", r[r.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37495] = "COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2", r[r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 35840] = "COMPRESSED_RGB_PVRTC_4BPPV1_IMG", r[r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 35842] = "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG", r[r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 35841] = "COMPRESSED_RGB_PVRTC_2BPPV1_IMG", r[r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 35843] = "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG", r[r.COMPRESSED_RGB_ETC1_WEBGL = 36196] = "COMPRESSED_RGB_ETC1_WEBGL", r[r.COMPRESSED_RGB_ATC_WEBGL = 35986] = "COMPRESSED_RGB_ATC_WEBGL", r[r.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 35986] = "COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL", r[r.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 34798] = "COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL", r[r.COMPRESSED_RGBA_ASTC_4x4_KHR = 37808] = "COMPRESSED_RGBA_ASTC_4x4_KHR";
})(Q || (Q = {}));
var yn = (ct = {}, // WEBGL_compressed_texture_s3tc
ct[Q.COMPRESSED_RGB_S3TC_DXT1_EXT] = 0.5, ct[Q.COMPRESSED_RGBA_S3TC_DXT1_EXT] = 0.5, ct[Q.COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1, ct[Q.COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1, // WEBGL_compressed_texture_s3tc
ct[Q.COMPRESSED_SRGB_S3TC_DXT1_EXT] = 0.5, ct[Q.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT] = 0.5, ct[Q.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT] = 1, ct[Q.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT] = 1, // WEBGL_compressed_texture_etc
ct[Q.COMPRESSED_R11_EAC] = 0.5, ct[Q.COMPRESSED_SIGNED_R11_EAC] = 0.5, ct[Q.COMPRESSED_RG11_EAC] = 1, ct[Q.COMPRESSED_SIGNED_RG11_EAC] = 1, ct[Q.COMPRESSED_RGB8_ETC2] = 0.5, ct[Q.COMPRESSED_RGBA8_ETC2_EAC] = 1, ct[Q.COMPRESSED_SRGB8_ETC2] = 0.5, ct[Q.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC] = 1, ct[Q.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2] = 0.5, ct[Q.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2] = 0.5, // WEBGL_compressed_texture_pvrtc
ct[Q.COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = 0.5, ct[Q.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = 0.5, ct[Q.COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = 0.25, ct[Q.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = 0.25, // WEBGL_compressed_texture_etc1
ct[Q.COMPRESSED_RGB_ETC1_WEBGL] = 0.5, // @see https://www.khronos.org/registry/OpenGL/extensions/AMD/AMD_compressed_ATC_texture.txt
// WEBGL_compressed_texture_atc
ct[Q.COMPRESSED_RGB_ATC_WEBGL] = 0.5, ct[Q.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1, ct[Q.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1, // @see https://registry.khronos.org/OpenGL/extensions/KHR/KHR_texture_compression_astc_hdr.txt
// WEBGL_compressed_texture_astc
/* eslint-disable-next-line camelcase */
ct[Q.COMPRESSED_RGBA_ASTC_4x4_KHR] = 1, ct);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Ka = function(r, t) {
  return Ka = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, Ka(r, t);
};
function al(r, t) {
  Ka(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
function Rm(r, t, e, i) {
  function n(a) {
    return a instanceof e ? a : new e(function(o) {
      o(a);
    });
  }
  return new (e || (e = Promise))(function(a, o) {
    function s(l) {
      try {
        h(i.next(l));
      } catch (f) {
        o(f);
      }
    }
    function u(l) {
      try {
        h(i.throw(l));
      } catch (f) {
        o(f);
      }
    }
    function h(l) {
      l.done ? a(l.value) : n(l.value).then(s, u);
    }
    h((i = i.apply(r, t || [])).next());
  });
}
function Om(r, t) {
  var e = { label: 0, sent: function() {
    if (a[0] & 1)
      throw a[1];
    return a[1];
  }, trys: [], ops: [] }, i, n, a, o;
  return o = { next: s(0), throw: s(1), return: s(2) }, typeof Symbol == "function" && (o[Symbol.iterator] = function() {
    return this;
  }), o;
  function s(h) {
    return function(l) {
      return u([h, l]);
    };
  }
  function u(h) {
    if (i)
      throw new TypeError("Generator is already executing.");
    for (; e; )
      try {
        if (i = 1, n && (a = h[0] & 2 ? n.return : h[0] ? n.throw || ((a = n.return) && a.call(n), 0) : n.next) && !(a = a.call(n, h[1])).done)
          return a;
        switch (n = 0, a && (h = [h[0] & 2, a.value]), h[0]) {
          case 0:
          case 1:
            a = h;
            break;
          case 4:
            return e.label++, { value: h[1], done: !1 };
          case 5:
            e.label++, n = h[1], h = [0];
            continue;
          case 7:
            h = e.ops.pop(), e.trys.pop();
            continue;
          default:
            if (a = e.trys, !(a = a.length > 0 && a[a.length - 1]) && (h[0] === 6 || h[0] === 2)) {
              e = 0;
              continue;
            }
            if (h[0] === 3 && (!a || h[1] > a[0] && h[1] < a[3])) {
              e.label = h[1];
              break;
            }
            if (h[0] === 6 && e.label < a[1]) {
              e.label = a[1], a = h;
              break;
            }
            if (a && e.label < a[2]) {
              e.label = a[2], e.ops.push(h);
              break;
            }
            a[2] && e.ops.pop(), e.trys.pop();
            continue;
        }
        h = t.call(r, e);
      } catch (l) {
        h = [6, l], n = 0;
      } finally {
        i = a = 0;
      }
    if (h[0] & 5)
      throw h[1];
    return { value: h[0] ? h[1] : void 0, done: !0 };
  }
}
var Im = (
  /** @class */
  function(r) {
    al(t, r);
    function t(e, i) {
      i === void 0 && (i = { width: 1, height: 1, autoLoad: !0 });
      var n = this, a, o;
      return typeof e == "string" ? (a = e, o = new Uint8Array()) : (a = null, o = e), n = r.call(this, o, i) || this, n.origin = a, n.buffer = o ? new qa(o) : null, n.origin && i.autoLoad !== !1 && n.load(), o && o.length && (n.loaded = !0, n.onBlobLoaded(n.buffer.rawBinaryData)), n;
    }
    return t.prototype.onBlobLoaded = function(e) {
    }, t.prototype.load = function() {
      return Rm(this, void 0, Promise, function() {
        var e, i, n;
        return Om(this, function(a) {
          switch (a.label) {
            case 0:
              return [4, fetch(this.origin)];
            case 1:
              return e = a.sent(), [4, e.blob()];
            case 2:
              return i = a.sent(), [4, i.arrayBuffer()];
            case 3:
              return n = a.sent(), this.data = new Uint32Array(n), this.buffer = new qa(n), this.loaded = !0, this.onBlobLoaded(n), this.update(), [2, this];
          }
        });
      });
    }, t;
  }(di)
), $a = (
  /** @class */
  function(r) {
    al(t, r);
    function t(e, i) {
      var n = r.call(this, e, i) || this;
      return n.format = i.format, n.levels = i.levels || 1, n._width = i.width, n._height = i.height, n._extension = t._formatToExtension(n.format), (i.levelBuffers || n.buffer) && (n._levelBuffers = i.levelBuffers || t._createLevelBuffers(
        e instanceof Uint8Array ? e : n.buffer.uint8View,
        n.format,
        n.levels,
        4,
        4,
        // PVRTC has 8x4 blocks in 2bpp mode
        n.width,
        n.height
      )), n;
    }
    return t.prototype.upload = function(e, i, n) {
      var a = e.gl, o = e.context.extensions[this._extension];
      if (!o)
        throw new Error(this._extension + " textures are not supported on the current machine");
      if (!this._levelBuffers)
        return !1;
      for (var s = 0, u = this.levels; s < u; s++) {
        var h = this._levelBuffers[s], l = h.levelID, f = h.levelWidth, c = h.levelHeight, d = h.levelBuffer;
        a.compressedTexImage2D(a.TEXTURE_2D, l, this.format, f, c, 0, d);
      }
      return !0;
    }, t.prototype.onBlobLoaded = function() {
      this._levelBuffers = t._createLevelBuffers(
        this.buffer.uint8View,
        this.format,
        this.levels,
        4,
        4,
        // PVRTC has 8x4 blocks in 2bpp mode
        this.width,
        this.height
      );
    }, t._formatToExtension = function(e) {
      if (e >= 33776 && e <= 33779)
        return "s3tc";
      if (e >= 37488 && e <= 37497)
        return "etc";
      if (e >= 35840 && e <= 35843)
        return "pvrtc";
      if (e >= 36196)
        return "etc1";
      if (e >= 35986 && e <= 34798)
        return "atc";
      throw new Error("Invalid (compressed) texture format given!");
    }, t._createLevelBuffers = function(e, i, n, a, o, s, u) {
      for (var h = new Array(n), l = e.byteOffset, f = s, c = u, d = f + a - 1 & ~(a - 1), p = c + o - 1 & ~(o - 1), _ = d * p * yn[i], v = 0; v < n; v++)
        h[v] = {
          levelID: v,
          levelWidth: n > 1 ? f : d,
          levelHeight: n > 1 ? c : p,
          levelBuffer: new Uint8Array(e.buffer, l, _)
        }, l += _, f = f >> 1 || 1, c = c >> 1 || 1, d = f + a - 1 & ~(a - 1), p = c + o - 1 & ~(o - 1), _ = d * p * yn[i];
      return h;
    }, t;
  }(Im)
), Cm = (
  /** @class */
  function() {
    function r() {
    }
    return r.use = function(t, e) {
      var i = t.data, n = this;
      if (t.type === Pt.TYPE.JSON && i && i.cacheID && i.textures) {
        for (var a = i.textures, o = void 0, s = void 0, u = 0, h = a.length; u < h; u++) {
          var l = a[u], f = l.src, c = l.format;
          if (c || (s = f), r.textureFormats[c]) {
            o = f;
            break;
          }
        }
        if (o = o || s, !o) {
          e(new Error("Cannot load compressed-textures in " + t.url + ", make sure you provide a fallback"));
          return;
        }
        if (o === t.url) {
          e(new Error("URL of compressed texture cannot be the same as the manifest's URL"));
          return;
        }
        var d = {
          crossOrigin: t.crossOrigin,
          metadata: t.metadata.imageMetadata,
          parentResource: t
        }, p = Tr.resolve(t.url.replace(n.baseUrl, ""), o), _ = i.cacheID;
        n.add(_, p, d, function(v) {
          if (v.error) {
            e(v.error);
            return;
          }
          var y = v.texture, g = y === void 0 ? null : y, m = v.textures, E = m === void 0 ? {} : m;
          Object.assign(t, { texture: g, textures: E }), e();
        });
      } else
        e();
    }, Object.defineProperty(r, "textureExtensions", {
      /**  Map of available texture extensions. */
      get: function() {
        if (!r._textureExtensions) {
          var t = k.ADAPTER.createCanvas(), e = t.getContext("webgl");
          if (!e)
            return console.warn("WebGL not available for compressed textures. Silently failing."), {};
          var i = {
            s3tc: e.getExtension("WEBGL_compressed_texture_s3tc"),
            s3tc_sRGB: e.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
            etc: e.getExtension("WEBGL_compressed_texture_etc"),
            etc1: e.getExtension("WEBGL_compressed_texture_etc1"),
            pvrtc: e.getExtension("WEBGL_compressed_texture_pvrtc") || e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
            atc: e.getExtension("WEBGL_compressed_texture_atc"),
            astc: e.getExtension("WEBGL_compressed_texture_astc")
          };
          r._textureExtensions = i;
        }
        return r._textureExtensions;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "textureFormats", {
      /** Map of available texture formats. */
      get: function() {
        if (!r._textureFormats) {
          var t = r.textureExtensions;
          r._textureFormats = {};
          for (var e in t) {
            var i = t[e];
            i && Object.assign(r._textureFormats, Object.getPrototypeOf(i));
          }
        }
        return r._textureFormats;
      },
      enumerable: !1,
      configurable: !0
    }), r.extension = vt.Loader, r;
  }()
);
function ol(r, t, e) {
  var i = {
    textures: {},
    texture: null
  };
  if (!t)
    return i;
  var n = t.map(function(a) {
    return new K(new ot(a, Object.assign({
      mipmap: oe.OFF,
      alphaMode: se.NO_PREMULTIPLIED_ALPHA
    }, e)));
  });
  return n.forEach(function(a, o) {
    var s = a.baseTexture, u = r + "-" + (o + 1);
    ot.addToCache(s, u), K.addToCache(a, u), o === 0 && (ot.addToCache(s, r), K.addToCache(a, r), i.texture = a), i.textures[u] = a;
  }), i;
}
var Hr, $t, la = 4, Gi = 124, Mm = 32, cu = 20, Dm = 542327876, ki = {
  SIZE: 1,
  FLAGS: 2,
  HEIGHT: 3,
  WIDTH: 4,
  MIPMAP_COUNT: 7,
  PIXEL_FORMAT: 19
}, Fm = {
  SIZE: 0,
  FLAGS: 1,
  FOURCC: 2,
  RGB_BITCOUNT: 3,
  R_BIT_MASK: 4,
  G_BIT_MASK: 5,
  B_BIT_MASK: 6,
  A_BIT_MASK: 7
}, Hi = {
  DXGI_FORMAT: 0,
  RESOURCE_DIMENSION: 1,
  MISC_FLAG: 2,
  ARRAY_SIZE: 3,
  MISC_FLAGS2: 4
}, Jt;
(function(r) {
  r[r.DXGI_FORMAT_UNKNOWN = 0] = "DXGI_FORMAT_UNKNOWN", r[r.DXGI_FORMAT_R32G32B32A32_TYPELESS = 1] = "DXGI_FORMAT_R32G32B32A32_TYPELESS", r[r.DXGI_FORMAT_R32G32B32A32_FLOAT = 2] = "DXGI_FORMAT_R32G32B32A32_FLOAT", r[r.DXGI_FORMAT_R32G32B32A32_UINT = 3] = "DXGI_FORMAT_R32G32B32A32_UINT", r[r.DXGI_FORMAT_R32G32B32A32_SINT = 4] = "DXGI_FORMAT_R32G32B32A32_SINT", r[r.DXGI_FORMAT_R32G32B32_TYPELESS = 5] = "DXGI_FORMAT_R32G32B32_TYPELESS", r[r.DXGI_FORMAT_R32G32B32_FLOAT = 6] = "DXGI_FORMAT_R32G32B32_FLOAT", r[r.DXGI_FORMAT_R32G32B32_UINT = 7] = "DXGI_FORMAT_R32G32B32_UINT", r[r.DXGI_FORMAT_R32G32B32_SINT = 8] = "DXGI_FORMAT_R32G32B32_SINT", r[r.DXGI_FORMAT_R16G16B16A16_TYPELESS = 9] = "DXGI_FORMAT_R16G16B16A16_TYPELESS", r[r.DXGI_FORMAT_R16G16B16A16_FLOAT = 10] = "DXGI_FORMAT_R16G16B16A16_FLOAT", r[r.DXGI_FORMAT_R16G16B16A16_UNORM = 11] = "DXGI_FORMAT_R16G16B16A16_UNORM", r[r.DXGI_FORMAT_R16G16B16A16_UINT = 12] = "DXGI_FORMAT_R16G16B16A16_UINT", r[r.DXGI_FORMAT_R16G16B16A16_SNORM = 13] = "DXGI_FORMAT_R16G16B16A16_SNORM", r[r.DXGI_FORMAT_R16G16B16A16_SINT = 14] = "DXGI_FORMAT_R16G16B16A16_SINT", r[r.DXGI_FORMAT_R32G32_TYPELESS = 15] = "DXGI_FORMAT_R32G32_TYPELESS", r[r.DXGI_FORMAT_R32G32_FLOAT = 16] = "DXGI_FORMAT_R32G32_FLOAT", r[r.DXGI_FORMAT_R32G32_UINT = 17] = "DXGI_FORMAT_R32G32_UINT", r[r.DXGI_FORMAT_R32G32_SINT = 18] = "DXGI_FORMAT_R32G32_SINT", r[r.DXGI_FORMAT_R32G8X24_TYPELESS = 19] = "DXGI_FORMAT_R32G8X24_TYPELESS", r[r.DXGI_FORMAT_D32_FLOAT_S8X24_UINT = 20] = "DXGI_FORMAT_D32_FLOAT_S8X24_UINT", r[r.DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS = 21] = "DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS", r[r.DXGI_FORMAT_X32_TYPELESS_G8X24_UINT = 22] = "DXGI_FORMAT_X32_TYPELESS_G8X24_UINT", r[r.DXGI_FORMAT_R10G10B10A2_TYPELESS = 23] = "DXGI_FORMAT_R10G10B10A2_TYPELESS", r[r.DXGI_FORMAT_R10G10B10A2_UNORM = 24] = "DXGI_FORMAT_R10G10B10A2_UNORM", r[r.DXGI_FORMAT_R10G10B10A2_UINT = 25] = "DXGI_FORMAT_R10G10B10A2_UINT", r[r.DXGI_FORMAT_R11G11B10_FLOAT = 26] = "DXGI_FORMAT_R11G11B10_FLOAT", r[r.DXGI_FORMAT_R8G8B8A8_TYPELESS = 27] = "DXGI_FORMAT_R8G8B8A8_TYPELESS", r[r.DXGI_FORMAT_R8G8B8A8_UNORM = 28] = "DXGI_FORMAT_R8G8B8A8_UNORM", r[r.DXGI_FORMAT_R8G8B8A8_UNORM_SRGB = 29] = "DXGI_FORMAT_R8G8B8A8_UNORM_SRGB", r[r.DXGI_FORMAT_R8G8B8A8_UINT = 30] = "DXGI_FORMAT_R8G8B8A8_UINT", r[r.DXGI_FORMAT_R8G8B8A8_SNORM = 31] = "DXGI_FORMAT_R8G8B8A8_SNORM", r[r.DXGI_FORMAT_R8G8B8A8_SINT = 32] = "DXGI_FORMAT_R8G8B8A8_SINT", r[r.DXGI_FORMAT_R16G16_TYPELESS = 33] = "DXGI_FORMAT_R16G16_TYPELESS", r[r.DXGI_FORMAT_R16G16_FLOAT = 34] = "DXGI_FORMAT_R16G16_FLOAT", r[r.DXGI_FORMAT_R16G16_UNORM = 35] = "DXGI_FORMAT_R16G16_UNORM", r[r.DXGI_FORMAT_R16G16_UINT = 36] = "DXGI_FORMAT_R16G16_UINT", r[r.DXGI_FORMAT_R16G16_SNORM = 37] = "DXGI_FORMAT_R16G16_SNORM", r[r.DXGI_FORMAT_R16G16_SINT = 38] = "DXGI_FORMAT_R16G16_SINT", r[r.DXGI_FORMAT_R32_TYPELESS = 39] = "DXGI_FORMAT_R32_TYPELESS", r[r.DXGI_FORMAT_D32_FLOAT = 40] = "DXGI_FORMAT_D32_FLOAT", r[r.DXGI_FORMAT_R32_FLOAT = 41] = "DXGI_FORMAT_R32_FLOAT", r[r.DXGI_FORMAT_R32_UINT = 42] = "DXGI_FORMAT_R32_UINT", r[r.DXGI_FORMAT_R32_SINT = 43] = "DXGI_FORMAT_R32_SINT", r[r.DXGI_FORMAT_R24G8_TYPELESS = 44] = "DXGI_FORMAT_R24G8_TYPELESS", r[r.DXGI_FORMAT_D24_UNORM_S8_UINT = 45] = "DXGI_FORMAT_D24_UNORM_S8_UINT", r[r.DXGI_FORMAT_R24_UNORM_X8_TYPELESS = 46] = "DXGI_FORMAT_R24_UNORM_X8_TYPELESS", r[r.DXGI_FORMAT_X24_TYPELESS_G8_UINT = 47] = "DXGI_FORMAT_X24_TYPELESS_G8_UINT", r[r.DXGI_FORMAT_R8G8_TYPELESS = 48] = "DXGI_FORMAT_R8G8_TYPELESS", r[r.DXGI_FORMAT_R8G8_UNORM = 49] = "DXGI_FORMAT_R8G8_UNORM", r[r.DXGI_FORMAT_R8G8_UINT = 50] = "DXGI_FORMAT_R8G8_UINT", r[r.DXGI_FORMAT_R8G8_SNORM = 51] = "DXGI_FORMAT_R8G8_SNORM", r[r.DXGI_FORMAT_R8G8_SINT = 52] = "DXGI_FORMAT_R8G8_SINT", r[r.DXGI_FORMAT_R16_TYPELESS = 53] = "DXGI_FORMAT_R16_TYPELESS", r[r.DXGI_FORMAT_R16_FLOAT = 54] = "DXGI_FORMAT_R16_FLOAT", r[r.DXGI_FORMAT_D16_UNORM = 55] = "DXGI_FORMAT_D16_UNORM", r[r.DXGI_FORMAT_R16_UNORM = 56] = "DXGI_FORMAT_R16_UNORM", r[r.DXGI_FORMAT_R16_UINT = 57] = "DXGI_FORMAT_R16_UINT", r[r.DXGI_FORMAT_R16_SNORM = 58] = "DXGI_FORMAT_R16_SNORM", r[r.DXGI_FORMAT_R16_SINT = 59] = "DXGI_FORMAT_R16_SINT", r[r.DXGI_FORMAT_R8_TYPELESS = 60] = "DXGI_FORMAT_R8_TYPELESS", r[r.DXGI_FORMAT_R8_UNORM = 61] = "DXGI_FORMAT_R8_UNORM", r[r.DXGI_FORMAT_R8_UINT = 62] = "DXGI_FORMAT_R8_UINT", r[r.DXGI_FORMAT_R8_SNORM = 63] = "DXGI_FORMAT_R8_SNORM", r[r.DXGI_FORMAT_R8_SINT = 64] = "DXGI_FORMAT_R8_SINT", r[r.DXGI_FORMAT_A8_UNORM = 65] = "DXGI_FORMAT_A8_UNORM", r[r.DXGI_FORMAT_R1_UNORM = 66] = "DXGI_FORMAT_R1_UNORM", r[r.DXGI_FORMAT_R9G9B9E5_SHAREDEXP = 67] = "DXGI_FORMAT_R9G9B9E5_SHAREDEXP", r[r.DXGI_FORMAT_R8G8_B8G8_UNORM = 68] = "DXGI_FORMAT_R8G8_B8G8_UNORM", r[r.DXGI_FORMAT_G8R8_G8B8_UNORM = 69] = "DXGI_FORMAT_G8R8_G8B8_UNORM", r[r.DXGI_FORMAT_BC1_TYPELESS = 70] = "DXGI_FORMAT_BC1_TYPELESS", r[r.DXGI_FORMAT_BC1_UNORM = 71] = "DXGI_FORMAT_BC1_UNORM", r[r.DXGI_FORMAT_BC1_UNORM_SRGB = 72] = "DXGI_FORMAT_BC1_UNORM_SRGB", r[r.DXGI_FORMAT_BC2_TYPELESS = 73] = "DXGI_FORMAT_BC2_TYPELESS", r[r.DXGI_FORMAT_BC2_UNORM = 74] = "DXGI_FORMAT_BC2_UNORM", r[r.DXGI_FORMAT_BC2_UNORM_SRGB = 75] = "DXGI_FORMAT_BC2_UNORM_SRGB", r[r.DXGI_FORMAT_BC3_TYPELESS = 76] = "DXGI_FORMAT_BC3_TYPELESS", r[r.DXGI_FORMAT_BC3_UNORM = 77] = "DXGI_FORMAT_BC3_UNORM", r[r.DXGI_FORMAT_BC3_UNORM_SRGB = 78] = "DXGI_FORMAT_BC3_UNORM_SRGB", r[r.DXGI_FORMAT_BC4_TYPELESS = 79] = "DXGI_FORMAT_BC4_TYPELESS", r[r.DXGI_FORMAT_BC4_UNORM = 80] = "DXGI_FORMAT_BC4_UNORM", r[r.DXGI_FORMAT_BC4_SNORM = 81] = "DXGI_FORMAT_BC4_SNORM", r[r.DXGI_FORMAT_BC5_TYPELESS = 82] = "DXGI_FORMAT_BC5_TYPELESS", r[r.DXGI_FORMAT_BC5_UNORM = 83] = "DXGI_FORMAT_BC5_UNORM", r[r.DXGI_FORMAT_BC5_SNORM = 84] = "DXGI_FORMAT_BC5_SNORM", r[r.DXGI_FORMAT_B5G6R5_UNORM = 85] = "DXGI_FORMAT_B5G6R5_UNORM", r[r.DXGI_FORMAT_B5G5R5A1_UNORM = 86] = "DXGI_FORMAT_B5G5R5A1_UNORM", r[r.DXGI_FORMAT_B8G8R8A8_UNORM = 87] = "DXGI_FORMAT_B8G8R8A8_UNORM", r[r.DXGI_FORMAT_B8G8R8X8_UNORM = 88] = "DXGI_FORMAT_B8G8R8X8_UNORM", r[r.DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM = 89] = "DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM", r[r.DXGI_FORMAT_B8G8R8A8_TYPELESS = 90] = "DXGI_FORMAT_B8G8R8A8_TYPELESS", r[r.DXGI_FORMAT_B8G8R8A8_UNORM_SRGB = 91] = "DXGI_FORMAT_B8G8R8A8_UNORM_SRGB", r[r.DXGI_FORMAT_B8G8R8X8_TYPELESS = 92] = "DXGI_FORMAT_B8G8R8X8_TYPELESS", r[r.DXGI_FORMAT_B8G8R8X8_UNORM_SRGB = 93] = "DXGI_FORMAT_B8G8R8X8_UNORM_SRGB", r[r.DXGI_FORMAT_BC6H_TYPELESS = 94] = "DXGI_FORMAT_BC6H_TYPELESS", r[r.DXGI_FORMAT_BC6H_UF16 = 95] = "DXGI_FORMAT_BC6H_UF16", r[r.DXGI_FORMAT_BC6H_SF16 = 96] = "DXGI_FORMAT_BC6H_SF16", r[r.DXGI_FORMAT_BC7_TYPELESS = 97] = "DXGI_FORMAT_BC7_TYPELESS", r[r.DXGI_FORMAT_BC7_UNORM = 98] = "DXGI_FORMAT_BC7_UNORM", r[r.DXGI_FORMAT_BC7_UNORM_SRGB = 99] = "DXGI_FORMAT_BC7_UNORM_SRGB", r[r.DXGI_FORMAT_AYUV = 100] = "DXGI_FORMAT_AYUV", r[r.DXGI_FORMAT_Y410 = 101] = "DXGI_FORMAT_Y410", r[r.DXGI_FORMAT_Y416 = 102] = "DXGI_FORMAT_Y416", r[r.DXGI_FORMAT_NV12 = 103] = "DXGI_FORMAT_NV12", r[r.DXGI_FORMAT_P010 = 104] = "DXGI_FORMAT_P010", r[r.DXGI_FORMAT_P016 = 105] = "DXGI_FORMAT_P016", r[r.DXGI_FORMAT_420_OPAQUE = 106] = "DXGI_FORMAT_420_OPAQUE", r[r.DXGI_FORMAT_YUY2 = 107] = "DXGI_FORMAT_YUY2", r[r.DXGI_FORMAT_Y210 = 108] = "DXGI_FORMAT_Y210", r[r.DXGI_FORMAT_Y216 = 109] = "DXGI_FORMAT_Y216", r[r.DXGI_FORMAT_NV11 = 110] = "DXGI_FORMAT_NV11", r[r.DXGI_FORMAT_AI44 = 111] = "DXGI_FORMAT_AI44", r[r.DXGI_FORMAT_IA44 = 112] = "DXGI_FORMAT_IA44", r[r.DXGI_FORMAT_P8 = 113] = "DXGI_FORMAT_P8", r[r.DXGI_FORMAT_A8P8 = 114] = "DXGI_FORMAT_A8P8", r[r.DXGI_FORMAT_B4G4R4A4_UNORM = 115] = "DXGI_FORMAT_B4G4R4A4_UNORM", r[r.DXGI_FORMAT_P208 = 116] = "DXGI_FORMAT_P208", r[r.DXGI_FORMAT_V208 = 117] = "DXGI_FORMAT_V208", r[r.DXGI_FORMAT_V408 = 118] = "DXGI_FORMAT_V408", r[r.DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE = 119] = "DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE", r[r.DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE = 120] = "DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE", r[r.DXGI_FORMAT_FORCE_UINT = 121] = "DXGI_FORMAT_FORCE_UINT";
})(Jt || (Jt = {}));
var Qa;
(function(r) {
  r[r.DDS_DIMENSION_TEXTURE1D = 2] = "DDS_DIMENSION_TEXTURE1D", r[r.DDS_DIMENSION_TEXTURE2D = 3] = "DDS_DIMENSION_TEXTURE2D", r[r.DDS_DIMENSION_TEXTURE3D = 6] = "DDS_DIMENSION_TEXTURE3D";
})(Qa || (Qa = {}));
var Nm = 1, Bm = 2, Lm = 4, Um = 64, Gm = 512, km = 131072, Hm = 827611204, Xm = 861165636, jm = 894720068, Vm = 808540228, zm = 4, Wm = (Hr = {}, Hr[Hm] = Q.COMPRESSED_RGBA_S3TC_DXT1_EXT, Hr[Xm] = Q.COMPRESSED_RGBA_S3TC_DXT3_EXT, Hr[jm] = Q.COMPRESSED_RGBA_S3TC_DXT5_EXT, Hr), Ym = ($t = {}, // WEBGL_compressed_texture_s3tc
$t[Jt.DXGI_FORMAT_BC1_TYPELESS] = Q.COMPRESSED_RGBA_S3TC_DXT1_EXT, $t[Jt.DXGI_FORMAT_BC1_UNORM] = Q.COMPRESSED_RGBA_S3TC_DXT1_EXT, $t[Jt.DXGI_FORMAT_BC2_TYPELESS] = Q.COMPRESSED_RGBA_S3TC_DXT3_EXT, $t[Jt.DXGI_FORMAT_BC2_UNORM] = Q.COMPRESSED_RGBA_S3TC_DXT3_EXT, $t[Jt.DXGI_FORMAT_BC3_TYPELESS] = Q.COMPRESSED_RGBA_S3TC_DXT5_EXT, $t[Jt.DXGI_FORMAT_BC3_UNORM] = Q.COMPRESSED_RGBA_S3TC_DXT5_EXT, // WEBGL_compressed_texture_s3tc_srgb
$t[Jt.DXGI_FORMAT_BC1_UNORM_SRGB] = Q.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT, $t[Jt.DXGI_FORMAT_BC2_UNORM_SRGB] = Q.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT, $t[Jt.DXGI_FORMAT_BC3_UNORM_SRGB] = Q.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT, $t);
function qm(r) {
  var t = new Uint32Array(r), e = t[0];
  if (e !== Dm)
    throw new Error("Invalid DDS file magic word");
  var i = new Uint32Array(r, 0, Gi / Uint32Array.BYTES_PER_ELEMENT), n = i[ki.HEIGHT], a = i[ki.WIDTH], o = i[ki.MIPMAP_COUNT], s = new Uint32Array(r, ki.PIXEL_FORMAT * Uint32Array.BYTES_PER_ELEMENT, Mm / Uint32Array.BYTES_PER_ELEMENT), u = s[Nm];
  if (u & Lm) {
    var h = s[Fm.FOURCC];
    if (h !== Vm) {
      var l = Wm[h], f = la + Gi, c = new Uint8Array(r, f), d = new $a(c, {
        format: l,
        width: a,
        height: n,
        levels: o
        // CompressedTextureResource will separate the levelBuffers for us!
      });
      return [d];
    }
    var p = la + Gi, _ = new Uint32Array(t.buffer, p, cu / Uint32Array.BYTES_PER_ELEMENT), v = _[Hi.DXGI_FORMAT], y = _[Hi.RESOURCE_DIMENSION], g = _[Hi.MISC_FLAG], m = _[Hi.ARRAY_SIZE], E = Ym[v];
    if (E === void 0)
      throw new Error("DDSParser cannot parse texture data with DXGI format " + v);
    if (g === zm)
      throw new Error("DDSParser does not support cubemap textures");
    if (y === Qa.DDS_DIMENSION_TEXTURE3D)
      throw new Error("DDSParser does not supported 3D texture data");
    var b = new Array(), x = la + Gi + cu;
    if (m === 1)
      b.push(new Uint8Array(r, x));
    else {
      for (var S = yn[E], A = 0, w = a, P = n, O = 0; O < o; O++) {
        var F = Math.max(1, w + 3 & -4), D = Math.max(1, P + 3 & -4), I = F * D * S;
        A += I, w = w >>> 1, P = P >>> 1;
      }
      for (var R = x, O = 0; O < m; O++)
        b.push(new Uint8Array(r, R, A)), R += A;
    }
    return b.map(function(N) {
      return new $a(N, {
        format: E,
        width: a,
        height: n,
        levels: o
      });
    });
  }
  throw u & Um ? new Error("DDSParser does not support uncompressed texture data.") : u & Gm ? new Error("DDSParser does not supported YUV uncompressed texture data.") : u & km ? new Error("DDSParser does not support single-channel (lumninance) texture data!") : u & Bm ? new Error("DDSParser does not support single-channel (alpha) texture data!") : new Error("DDSParser failed to load a texture file due to an unknown reason!");
}
var Ae, ge, Xr, du = [171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10], Zm = 67305985, Qt = {
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
}, Ja = 64, pu = (Ae = {}, Ae[V.UNSIGNED_BYTE] = 1, Ae[V.UNSIGNED_SHORT] = 2, Ae[V.INT] = 4, Ae[V.UNSIGNED_INT] = 4, Ae[V.FLOAT] = 4, Ae[V.HALF_FLOAT] = 8, Ae), Km = (ge = {}, ge[B.RGBA] = 4, ge[B.RGB] = 3, ge[B.RG] = 2, ge[B.RED] = 1, ge[B.LUMINANCE] = 1, ge[B.LUMINANCE_ALPHA] = 2, ge[B.ALPHA] = 1, ge), $m = (Xr = {}, Xr[V.UNSIGNED_SHORT_4_4_4_4] = 2, Xr[V.UNSIGNED_SHORT_5_5_5_1] = 2, Xr[V.UNSIGNED_SHORT_5_6_5] = 2, Xr);
function Qm(r, t, e) {
  e === void 0 && (e = !1);
  var i = new DataView(t);
  if (!Jm(r, i))
    return null;
  var n = i.getUint32(Qt.ENDIANNESS, !0) === Zm, a = i.getUint32(Qt.GL_TYPE, n), o = i.getUint32(Qt.GL_FORMAT, n), s = i.getUint32(Qt.GL_INTERNAL_FORMAT, n), u = i.getUint32(Qt.PIXEL_WIDTH, n), h = i.getUint32(Qt.PIXEL_HEIGHT, n) || 1, l = i.getUint32(Qt.PIXEL_DEPTH, n) || 1, f = i.getUint32(Qt.NUMBER_OF_ARRAY_ELEMENTS, n) || 1, c = i.getUint32(Qt.NUMBER_OF_FACES, n), d = i.getUint32(Qt.NUMBER_OF_MIPMAP_LEVELS, n), p = i.getUint32(Qt.BYTES_OF_KEY_VALUE_DATA, n);
  if (h === 0 || l !== 1)
    throw new Error("Only 2D textures are supported");
  if (c !== 1)
    throw new Error("CubeTextures are not supported by KTXLoader yet!");
  if (f !== 1)
    throw new Error("WebGL does not support array textures");
  var _ = 4, v = 4, y = u + 3 & -4, g = h + 3 & -4, m = new Array(f), E = u * h;
  a === 0 && (E = y * g);
  var b;
  if (a !== 0 ? pu[a] ? b = pu[a] * Km[o] : b = $m[a] : b = yn[s], b === void 0)
    throw new Error("Unable to resolve the pixel format stored in the *.ktx file!");
  for (var x = e ? e0(i, p, n) : null, S = E * b, A = S, w = u, P = h, O = y, F = g, D = Ja + p, I = 0; I < d; I++) {
    for (var R = i.getUint32(D, n), N = D + 4, L = 0; L < f; L++) {
      var W = m[L];
      W || (W = m[L] = new Array(d)), W[I] = {
        levelID: I,
        // don't align mipWidth when texture not compressed! (glType not zero)
        levelWidth: d > 1 || a !== 0 ? w : O,
        levelHeight: d > 1 || a !== 0 ? P : F,
        levelBuffer: new Uint8Array(t, N, A)
      }, N += A;
    }
    D += R + 4, D = D % 4 !== 0 ? D + 4 - D % 4 : D, w = w >> 1 || 1, P = P >> 1 || 1, O = w + _ - 1 & ~(_ - 1), F = P + v - 1 & ~(v - 1), A = O * F * b;
  }
  return a !== 0 ? {
    uncompressed: m.map(function(H) {
      var C = H[0].levelBuffer, M = !1;
      return a === V.FLOAT ? C = new Float32Array(H[0].levelBuffer.buffer, H[0].levelBuffer.byteOffset, H[0].levelBuffer.byteLength / 4) : a === V.UNSIGNED_INT ? (M = !0, C = new Uint32Array(H[0].levelBuffer.buffer, H[0].levelBuffer.byteOffset, H[0].levelBuffer.byteLength / 4)) : a === V.INT && (M = !0, C = new Int32Array(H[0].levelBuffer.buffer, H[0].levelBuffer.byteOffset, H[0].levelBuffer.byteLength / 4)), {
        resource: new di(C, {
          width: H[0].levelWidth,
          height: H[0].levelHeight
        }),
        type: a,
        format: M ? t0(o) : o
      };
    }),
    kvData: x
  } : {
    compressed: m.map(function(H) {
      return new $a(null, {
        format: s,
        width: u,
        height: h,
        levels: d,
        levelBuffers: H
      });
    }),
    kvData: x
  };
}
function Jm(r, t) {
  for (var e = 0; e < du.length; e++)
    if (t.getUint8(e) !== du[e])
      return console.error(r + " is not a valid *.ktx file!"), !1;
  return !0;
}
function t0(r) {
  switch (r) {
    case B.RGBA:
      return B.RGBA_INTEGER;
    case B.RGB:
      return B.RGB_INTEGER;
    case B.RG:
      return B.RG_INTEGER;
    case B.RED:
      return B.RED_INTEGER;
    default:
      return r;
  }
}
function e0(r, t, e) {
  for (var i = /* @__PURE__ */ new Map(), n = 0; n < t; ) {
    var a = r.getUint32(Ja + n, e), o = Ja + n + 4, s = 3 - (a + 3) % 4;
    if (a === 0 || a > t - n) {
      console.error("KTXLoader: keyAndValueByteSize out of bounds");
      break;
    }
    for (var u = 0; u < a && r.getUint8(o + u) !== 0; u++)
      ;
    if (u === -1) {
      console.error("KTXLoader: Failed to find null byte terminating kvData key");
      break;
    }
    var h = new TextDecoder().decode(new Uint8Array(r.buffer, o, u)), l = new DataView(r.buffer, o + u + 1, a - u - 1);
    i.set(h, l), n += 4 + a + s;
  }
  return i;
}
Pt.setExtensionXhrType("dds", Pt.XHR_RESPONSE_TYPE.BUFFER);
var r0 = (
  /** @class */
  function() {
    function r() {
    }
    return r.use = function(t, e) {
      if (t.extension === "dds" && t.data)
        try {
          Object.assign(t, ol(t.name || t.url, qm(t.data), t.metadata));
        } catch (i) {
          e(i);
          return;
        }
      e();
    }, r.extension = vt.Loader, r;
  }()
);
Pt.setExtensionXhrType("ktx", Pt.XHR_RESPONSE_TYPE.BUFFER);
var i0 = (
  /** @class */
  function() {
    function r() {
    }
    return r.use = function(t, e) {
      if (t.extension === "ktx" && t.data)
        try {
          var i = t.name || t.url, n = Qm(i, t.data, this.loadKeyValueData), a = n.compressed, o = n.uncompressed, s = n.kvData;
          if (a) {
            var u = ol(i, a, t.metadata);
            if (s && u.textures)
              for (var h in u.textures)
                u.textures[h].baseTexture.ktxKeyValueData = s;
            Object.assign(t, u);
          } else if (o) {
            var l = {};
            o.forEach(function(f, c) {
              var d = new K(new ot(f.resource, {
                mipmap: oe.OFF,
                alphaMode: se.NO_PREMULTIPLIED_ALPHA,
                type: f.type,
                format: f.format
              })), p = i + "-" + (c + 1);
              s && (d.baseTexture.ktxKeyValueData = s), ot.addToCache(d.baseTexture, p), K.addToCache(d, p), c === 0 && (l[i] = d, ot.addToCache(d.baseTexture, i), K.addToCache(d, i)), l[p] = d;
            }), Object.assign(t, { textures: l });
          }
        } catch (f) {
          e(f);
          return;
        }
      e();
    }, r.extension = vt.Loader, r.loadKeyValueData = !1, r;
  }()
);
/*!
 * @pixi/particle-container - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/particle-container is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var to = function(r, t) {
  return to = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, to(r, t);
};
function sl(r, t) {
  to(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
(function(r) {
  sl(t, r);
  function t(e, i, n, a) {
    e === void 0 && (e = 1500), n === void 0 && (n = 16384), a === void 0 && (a = !1);
    var o = r.call(this) || this, s = 16384;
    return n > s && (n = s), o._properties = [!1, !0, !1, !1, !1], o._maxSize = e, o._batchSize = n, o._buffers = null, o._bufferUpdateIDs = [], o._updateID = 0, o.interactiveChildren = !1, o.blendMode = z.NORMAL, o.autoResize = a, o.roundPixels = !0, o.baseTexture = null, o.setProperties(i), o._tint = 0, o.tintRgb = new Float32Array(4), o.tint = 16777215, o;
  }
  return t.prototype.setProperties = function(e) {
    e && (this._properties[0] = "vertices" in e || "scale" in e ? !!e.vertices || !!e.scale : this._properties[0], this._properties[1] = "position" in e ? !!e.position : this._properties[1], this._properties[2] = "rotation" in e ? !!e.rotation : this._properties[2], this._properties[3] = "uvs" in e ? !!e.uvs : this._properties[3], this._properties[4] = "tint" in e || "alpha" in e ? !!e.tint || !!e.alpha : this._properties[4]);
  }, t.prototype.updateTransform = function() {
    this.displayObjectUpdateTransform();
  }, Object.defineProperty(t.prototype, "tint", {
    /**
     * The tint applied to the container. This is a hex value.
     * A value of 0xFFFFFF will remove any tint effect.
     * IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
     * @default 0xFFFFFF
     */
    get: function() {
      return this._tint;
    },
    set: function(e) {
      this._tint = e, Dr(e, this.tintRgb);
    },
    enumerable: !1,
    configurable: !0
  }), t.prototype.render = function(e) {
    var i = this;
    !this.visible || this.worldAlpha <= 0 || !this.children.length || !this.renderable || (this.baseTexture || (this.baseTexture = this.children[0]._texture.baseTexture, this.baseTexture.valid || this.baseTexture.once("update", function() {
      return i.onChildrenChange(0);
    })), e.batch.setObjectRenderer(e.plugins.particle), e.plugins.particle.render(this));
  }, t.prototype.onChildrenChange = function(e) {
    for (var i = Math.floor(e / this._batchSize); this._bufferUpdateIDs.length < i; )
      this._bufferUpdateIDs.push(0);
    this._bufferUpdateIDs[i] = ++this._updateID;
  }, t.prototype.dispose = function() {
    if (this._buffers) {
      for (var e = 0; e < this._buffers.length; ++e)
        this._buffers[e].destroy();
      this._buffers = null;
    }
  }, t.prototype.destroy = function(e) {
    r.prototype.destroy.call(this, e), this.dispose(), this._properties = null, this._buffers = null, this._bufferUpdateIDs = null;
  }, t;
})(ve);
var vu = (
  /** @class */
  function() {
    function r(t, e, i) {
      this.geometry = new pi(), this.indexBuffer = null, this.size = i, this.dynamicProperties = [], this.staticProperties = [];
      for (var n = 0; n < t.length; ++n) {
        var a = t[n];
        a = {
          attributeName: a.attributeName,
          size: a.size,
          uploadFunction: a.uploadFunction,
          type: a.type || V.FLOAT,
          offset: a.offset
        }, e[n] ? this.dynamicProperties.push(a) : this.staticProperties.push(a);
      }
      this.staticStride = 0, this.staticBuffer = null, this.staticData = null, this.staticDataUint32 = null, this.dynamicStride = 0, this.dynamicBuffer = null, this.dynamicData = null, this.dynamicDataUint32 = null, this._updateID = 0, this.initBuffers();
    }
    return r.prototype.initBuffers = function() {
      var t = this.geometry, e = 0;
      this.indexBuffer = new Ot(py(this.size), !0, !0), t.addIndex(this.indexBuffer), this.dynamicStride = 0;
      for (var i = 0; i < this.dynamicProperties.length; ++i) {
        var n = this.dynamicProperties[i];
        n.offset = e, e += n.size, this.dynamicStride += n.size;
      }
      var a = new ArrayBuffer(this.size * this.dynamicStride * 4 * 4);
      this.dynamicData = new Float32Array(a), this.dynamicDataUint32 = new Uint32Array(a), this.dynamicBuffer = new Ot(this.dynamicData, !1, !1);
      var o = 0;
      this.staticStride = 0;
      for (var i = 0; i < this.staticProperties.length; ++i) {
        var n = this.staticProperties[i];
        n.offset = o, o += n.size, this.staticStride += n.size;
      }
      var s = new ArrayBuffer(this.size * this.staticStride * 4 * 4);
      this.staticData = new Float32Array(s), this.staticDataUint32 = new Uint32Array(s), this.staticBuffer = new Ot(this.staticData, !0, !1);
      for (var i = 0; i < this.dynamicProperties.length; ++i) {
        var n = this.dynamicProperties[i];
        t.addAttribute(n.attributeName, this.dynamicBuffer, 0, n.type === V.UNSIGNED_BYTE, n.type, this.dynamicStride * 4, n.offset * 4);
      }
      for (var i = 0; i < this.staticProperties.length; ++i) {
        var n = this.staticProperties[i];
        t.addAttribute(n.attributeName, this.staticBuffer, 0, n.type === V.UNSIGNED_BYTE, n.type, this.staticStride * 4, n.offset * 4);
      }
    }, r.prototype.uploadDynamic = function(t, e, i) {
      for (var n = 0; n < this.dynamicProperties.length; n++) {
        var a = this.dynamicProperties[n];
        a.uploadFunction(t, e, i, a.type === V.UNSIGNED_BYTE ? this.dynamicDataUint32 : this.dynamicData, this.dynamicStride, a.offset);
      }
      this.dynamicBuffer._updateID++;
    }, r.prototype.uploadStatic = function(t, e, i) {
      for (var n = 0; n < this.staticProperties.length; n++) {
        var a = this.staticProperties[n];
        a.uploadFunction(t, e, i, a.type === V.UNSIGNED_BYTE ? this.staticDataUint32 : this.staticData, this.staticStride, a.offset);
      }
      this.staticBuffer._updateID++;
    }, r.prototype.destroy = function() {
      this.indexBuffer = null, this.dynamicProperties = null, this.dynamicBuffer = null, this.dynamicData = null, this.dynamicDataUint32 = null, this.staticProperties = null, this.staticBuffer = null, this.staticData = null, this.staticDataUint32 = null, this.geometry.destroy();
    }, r;
  }()
), n0 = `varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

void main(void){
    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;
    gl_FragColor = color;
}`, a0 = `attribute vec2 aVertexPosition;
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
`, o0 = (
  /** @class */
  function(r) {
    sl(t, r);
    function t(e) {
      var i = r.call(this, e) || this;
      return i.shader = null, i.properties = null, i.tempMatrix = new It(), i.properties = [
        // verticesData
        {
          attributeName: "aVertexPosition",
          size: 2,
          uploadFunction: i.uploadVertices,
          offset: 0
        },
        // positionData
        {
          attributeName: "aPositionCoord",
          size: 2,
          uploadFunction: i.uploadPosition,
          offset: 0
        },
        // rotationData
        {
          attributeName: "aRotation",
          size: 1,
          uploadFunction: i.uploadRotation,
          offset: 0
        },
        // uvsData
        {
          attributeName: "aTextureCoord",
          size: 2,
          uploadFunction: i.uploadUvs,
          offset: 0
        },
        // tintData
        {
          attributeName: "aColor",
          size: 1,
          type: V.UNSIGNED_BYTE,
          uploadFunction: i.uploadTint,
          offset: 0
        }
      ], i.shader = Fe.from(a0, n0, {}), i.state = lr.for2d(), i;
    }
    return t.prototype.render = function(e) {
      var i = e.children, n = e._maxSize, a = e._batchSize, o = this.renderer, s = i.length;
      if (s !== 0) {
        s > n && !e.autoResize && (s = n);
        var u = e._buffers;
        u || (u = e._buffers = this.generateBuffers(e));
        var h = i[0]._texture.baseTexture, l = h.alphaMode > 0;
        this.state.blendMode = Nh(e.blendMode, l), o.state.set(this.state);
        var f = o.gl, c = e.worldTransform.copyTo(this.tempMatrix);
        c.prepend(o.globalUniforms.uniforms.projectionMatrix), this.shader.uniforms.translationMatrix = c.toArray(!0), this.shader.uniforms.uColor = dy(e.tintRgb, e.worldAlpha, this.shader.uniforms.uColor, l), this.shader.uniforms.uSampler = h, this.renderer.shader.bind(this.shader);
        for (var d = !1, p = 0, _ = 0; p < s; p += a, _ += 1) {
          var v = s - p;
          v > a && (v = a), _ >= u.length && u.push(this._generateOneMoreBuffer(e));
          var y = u[_];
          y.uploadDynamic(i, p, v);
          var g = e._bufferUpdateIDs[_] || 0;
          d = d || y._updateID < g, d && (y._updateID = e._updateID, y.uploadStatic(i, p, v)), o.geometry.bind(y.geometry), f.drawElements(f.TRIANGLES, v * 6, f.UNSIGNED_SHORT, 0);
        }
      }
    }, t.prototype.generateBuffers = function(e) {
      for (var i = [], n = e._maxSize, a = e._batchSize, o = e._properties, s = 0; s < n; s += a)
        i.push(new vu(this.properties, o, a));
      return i;
    }, t.prototype._generateOneMoreBuffer = function(e) {
      var i = e._batchSize, n = e._properties;
      return new vu(this.properties, n, i);
    }, t.prototype.uploadVertices = function(e, i, n, a, o, s) {
      for (var u = 0, h = 0, l = 0, f = 0, c = 0; c < n; ++c) {
        var d = e[i + c], p = d._texture, _ = d.scale.x, v = d.scale.y, y = p.trim, g = p.orig;
        y ? (h = y.x - d.anchor.x * g.width, u = h + y.width, f = y.y - d.anchor.y * g.height, l = f + y.height) : (u = g.width * (1 - d.anchor.x), h = g.width * -d.anchor.x, l = g.height * (1 - d.anchor.y), f = g.height * -d.anchor.y), a[s] = h * _, a[s + 1] = f * v, a[s + o] = u * _, a[s + o + 1] = f * v, a[s + o * 2] = u * _, a[s + o * 2 + 1] = l * v, a[s + o * 3] = h * _, a[s + o * 3 + 1] = l * v, s += o * 4;
      }
    }, t.prototype.uploadPosition = function(e, i, n, a, o, s) {
      for (var u = 0; u < n; u++) {
        var h = e[i + u].position;
        a[s] = h.x, a[s + 1] = h.y, a[s + o] = h.x, a[s + o + 1] = h.y, a[s + o * 2] = h.x, a[s + o * 2 + 1] = h.y, a[s + o * 3] = h.x, a[s + o * 3 + 1] = h.y, s += o * 4;
      }
    }, t.prototype.uploadRotation = function(e, i, n, a, o, s) {
      for (var u = 0; u < n; u++) {
        var h = e[i + u].rotation;
        a[s] = h, a[s + o] = h, a[s + o * 2] = h, a[s + o * 3] = h, s += o * 4;
      }
    }, t.prototype.uploadUvs = function(e, i, n, a, o, s) {
      for (var u = 0; u < n; ++u) {
        var h = e[i + u]._texture._uvs;
        h ? (a[s] = h.x0, a[s + 1] = h.y0, a[s + o] = h.x1, a[s + o + 1] = h.y1, a[s + o * 2] = h.x2, a[s + o * 2 + 1] = h.y2, a[s + o * 3] = h.x3, a[s + o * 3 + 1] = h.y3, s += o * 4) : (a[s] = 0, a[s + 1] = 0, a[s + o] = 0, a[s + o + 1] = 0, a[s + o * 2] = 0, a[s + o * 2 + 1] = 0, a[s + o * 3] = 0, a[s + o * 3 + 1] = 0, s += o * 4);
      }
    }, t.prototype.uploadTint = function(e, i, n, a, o, s) {
      for (var u = 0; u < n; ++u) {
        var h = e[i + u], l = h._texture.baseTexture.alphaMode > 0, f = h.alpha, c = f < 1 && l ? Bo(h._tintRGB, f) : h._tintRGB + (f * 255 << 24);
        a[s] = c, a[s + o] = c, a[s + o * 2] = c, a[s + o * 3] = c, s += o * 4;
      }
    }, t.prototype.destroy = function() {
      r.prototype.destroy.call(this), this.shader && (this.shader.destroy(), this.shader = null), this.tempMatrix = null;
    }, t.extension = {
      name: "particle",
      type: vt.RendererPlugin
    }, t;
  }(Pn)
);
/*!
 * @pixi/graphics - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/graphics is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var Te;
(function(r) {
  r.MITER = "miter", r.BEVEL = "bevel", r.ROUND = "round";
})(Te || (Te = {}));
var De;
(function(r) {
  r.BUTT = "butt", r.ROUND = "round", r.SQUARE = "square";
})(De || (De = {}));
var si = {
  adaptive: !0,
  maxLength: 10,
  minSegments: 8,
  maxSegments: 2048,
  epsilon: 1e-4,
  _segmentsCount: function(r, t) {
    if (t === void 0 && (t = 20), !this.adaptive || !r || isNaN(r))
      return t;
    var e = Math.ceil(r / this.maxLength);
    return e < this.minSegments ? e = this.minSegments : e > this.maxSegments && (e = this.maxSegments), e;
  }
}, ul = (
  /** @class */
  function() {
    function r() {
      this.color = 16777215, this.alpha = 1, this.texture = K.WHITE, this.matrix = null, this.visible = !1, this.reset();
    }
    return r.prototype.clone = function() {
      var t = new r();
      return t.color = this.color, t.alpha = this.alpha, t.texture = this.texture, t.matrix = this.matrix, t.visible = this.visible, t;
    }, r.prototype.reset = function() {
      this.color = 16777215, this.alpha = 1, this.texture = K.WHITE, this.matrix = null, this.visible = !1;
    }, r.prototype.destroy = function() {
      this.texture = null, this.matrix = null;
    }, r;
  }()
);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var eo = function(r, t) {
  return eo = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, eo(r, t);
};
function Go(r, t) {
  eo(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
function _u(r, t) {
  var e, i;
  t === void 0 && (t = !1);
  var n = r.length;
  if (!(n < 6)) {
    for (var a = 0, o = 0, s = r[n - 2], u = r[n - 1]; o < n; o += 2) {
      var h = r[o], l = r[o + 1];
      a += (h - s) * (l + u), s = h, u = l;
    }
    if (!t && a > 0 || t && a <= 0)
      for (var f = n / 2, o = f + f % 2; o < n; o += 2) {
        var c = n - o - 2, d = n - o - 1, p = o, _ = o + 1;
        e = [r[p], r[c]], r[c] = e[0], r[p] = e[1], i = [r[_], r[d]], r[d] = i[0], r[_] = i[1];
      }
  }
}
var hl = {
  build: function(r) {
    r.points = r.shape.points.slice();
  },
  triangulate: function(r, t) {
    var e = r.points, i = r.holes, n = t.points, a = t.indices;
    if (e.length >= 6) {
      _u(e, !1);
      for (var o = [], s = 0; s < i.length; s++) {
        var u = i[s];
        _u(u.points, !0), o.push(e.length / 2), e = e.concat(u.points);
      }
      var h = ph(e, o, 2);
      if (!h)
        return;
      for (var l = n.length / 2, s = 0; s < h.length; s += 3)
        a.push(h[s] + l), a.push(h[s + 1] + l), a.push(h[s + 2] + l);
      for (var s = 0; s < e.length; s++)
        n.push(e[s]);
    }
  }
}, gn = {
  build: function(r) {
    var t = r.points, e, i, n, a, o, s;
    if (r.type === Dt.CIRC) {
      var u = r.shape;
      e = u.x, i = u.y, o = s = u.radius, n = a = 0;
    } else if (r.type === Dt.ELIP) {
      var h = r.shape;
      e = h.x, i = h.y, o = h.width, s = h.height, n = a = 0;
    } else {
      var l = r.shape, f = l.width / 2, c = l.height / 2;
      e = l.x + f, i = l.y + c, o = s = Math.max(0, Math.min(l.radius, Math.min(f, c))), n = f - o, a = c - s;
    }
    if (!(o >= 0 && s >= 0 && n >= 0 && a >= 0)) {
      t.length = 0;
      return;
    }
    var d = Math.ceil(2.3 * Math.sqrt(o + s)), p = d * 8 + (n ? 4 : 0) + (a ? 4 : 0);
    if (t.length = p, p !== 0) {
      if (d === 0) {
        t.length = 8, t[0] = t[6] = e + n, t[1] = t[3] = i + a, t[2] = t[4] = e - n, t[5] = t[7] = i - a;
        return;
      }
      var _ = 0, v = d * 4 + (n ? 2 : 0) + 2, y = v, g = p;
      {
        var m = n + o, E = a, b = e + m, x = e - m, S = i + E;
        if (t[_++] = b, t[_++] = S, t[--v] = S, t[--v] = x, a) {
          var A = i - E;
          t[y++] = x, t[y++] = A, t[--g] = A, t[--g] = b;
        }
      }
      for (var w = 1; w < d; w++) {
        var P = Math.PI / 2 * (w / d), m = n + Math.cos(P) * o, E = a + Math.sin(P) * s, b = e + m, x = e - m, S = i + E, A = i - E;
        t[_++] = b, t[_++] = S, t[--v] = S, t[--v] = x, t[y++] = x, t[y++] = A, t[--g] = A, t[--g] = b;
      }
      {
        var m = n, E = a + s, b = e + m, x = e - m, S = i + E, A = i - E;
        t[_++] = b, t[_++] = S, t[--g] = A, t[--g] = b, n && (t[_++] = x, t[_++] = S, t[--g] = A, t[--g] = x);
      }
    }
  },
  triangulate: function(r, t) {
    var e = r.points, i = t.points, n = t.indices;
    if (e.length !== 0) {
      var a = i.length / 2, o = a, s, u;
      if (r.type !== Dt.RREC) {
        var h = r.shape;
        s = h.x, u = h.y;
      } else {
        var l = r.shape;
        s = l.x + l.width / 2, u = l.y + l.height / 2;
      }
      var f = r.matrix;
      i.push(r.matrix ? f.a * s + f.c * u + f.tx : s, r.matrix ? f.b * s + f.d * u + f.ty : u), a++, i.push(e[0], e[1]);
      for (var c = 2; c < e.length; c += 2)
        i.push(e[c], e[c + 1]), n.push(a++, o, a);
      n.push(o + 1, o, a);
    }
  }
}, s0 = {
  build: function(r) {
    var t = r.shape, e = t.x, i = t.y, n = t.width, a = t.height, o = r.points;
    o.length = 0, o.push(e, i, e + n, i, e + n, i + a, e, i + a);
  },
  triangulate: function(r, t) {
    var e = r.points, i = t.points, n = i.length / 2;
    i.push(e[0], e[1], e[2], e[3], e[6], e[7], e[4], e[5]), t.indices.push(n, n + 1, n + 2, n + 1, n + 2, n + 3);
  }
};
function _r(r, t, e) {
  var i = t - r;
  return r + i * e;
}
function Xi(r, t, e, i, n, a, o) {
  o === void 0 && (o = []);
  for (var s = 20, u = o, h = 0, l = 0, f = 0, c = 0, d = 0, p = 0, _ = 0, v = 0; _ <= s; ++_)
    v = _ / s, h = _r(r, e, v), l = _r(t, i, v), f = _r(e, n, v), c = _r(i, a, v), d = _r(h, f, v), p = _r(l, c, v), !(_ === 0 && u[u.length - 2] === d && u[u.length - 1] === p) && u.push(d, p);
  return u;
}
var u0 = {
  build: function(r) {
    if (sr.nextRoundedRectBehavior) {
      gn.build(r);
      return;
    }
    var t = r.shape, e = r.points, i = t.x, n = t.y, a = t.width, o = t.height, s = Math.max(0, Math.min(t.radius, Math.min(a, o) / 2));
    e.length = 0, s ? (Xi(i, n + s, i, n, i + s, n, e), Xi(i + a - s, n, i + a, n, i + a, n + s, e), Xi(i + a, n + o - s, i + a, n + o, i + a - s, n + o, e), Xi(i + s, n + o, i, n + o, i, n + o - s, e)) : e.push(i, n, i + a, n, i + a, n + o, i, n + o);
  },
  triangulate: function(r, t) {
    if (sr.nextRoundedRectBehavior) {
      gn.triangulate(r, t);
      return;
    }
    for (var e = r.points, i = t.points, n = t.indices, a = i.length / 2, o = ph(e, null, 2), s = 0, u = o.length; s < u; s += 3)
      n.push(o[s] + a), n.push(o[s + 1] + a), n.push(o[s + 2] + a);
    for (var s = 0, u = e.length; s < u; s++)
      i.push(e[s], e[++s]);
  }
};
function yu(r, t, e, i, n, a, o, s) {
  var u = r - e * n, h = t - i * n, l = r + e * a, f = t + i * a, c, d;
  o ? (c = i, d = -e) : (c = -i, d = e);
  var p = u + c, _ = h + d, v = l + c, y = f + d;
  return s.push(p, _), s.push(v, y), 2;
}
function Ve(r, t, e, i, n, a, o, s) {
  var u = e - r, h = i - t, l = Math.atan2(u, h), f = Math.atan2(n - r, a - t);
  s && l < f ? l += Math.PI * 2 : !s && l > f && (f += Math.PI * 2);
  var c = l, d = f - l, p = Math.abs(d), _ = Math.sqrt(u * u + h * h), v = (15 * p * Math.sqrt(_) / Math.PI >> 0) + 1, y = d / v;
  if (c += y, s) {
    o.push(r, t), o.push(e, i);
    for (var g = 1, m = c; g < v; g++, m += y)
      o.push(r, t), o.push(r + Math.sin(m) * _, t + Math.cos(m) * _);
    o.push(r, t), o.push(n, a);
  } else {
    o.push(e, i), o.push(r, t);
    for (var g = 1, m = c; g < v; g++, m += y)
      o.push(r + Math.sin(m) * _, t + Math.cos(m) * _), o.push(r, t);
    o.push(n, a), o.push(r, t);
  }
  return v * 2;
}
function h0(r, t) {
  var e = r.shape, i = r.points || e.points.slice(), n = t.closePointEps;
  if (i.length !== 0) {
    var a = r.lineStyle, o = new gt(i[0], i[1]), s = new gt(i[i.length - 2], i[i.length - 1]), u = e.type !== Dt.POLY || e.closeStroke, h = Math.abs(o.x - s.x) < n && Math.abs(o.y - s.y) < n;
    if (u) {
      i = i.slice(), h && (i.pop(), i.pop(), s.set(i[i.length - 2], i[i.length - 1]));
      var l = (o.x + s.x) * 0.5, f = (s.y + o.y) * 0.5;
      i.unshift(l, f), i.push(l, f);
    }
    var c = t.points, d = i.length / 2, p = i.length, _ = c.length / 2, v = a.width / 2, y = v * v, g = a.miterLimit * a.miterLimit, m = i[0], E = i[1], b = i[2], x = i[3], S = 0, A = 0, w = -(E - x), P = m - b, O = 0, F = 0, D = Math.sqrt(w * w + P * P);
    w /= D, P /= D, w *= v, P *= v;
    var I = a.alignment, R = (1 - I) * 2, N = I * 2;
    u || (a.cap === De.ROUND ? p += Ve(m - w * (R - N) * 0.5, E - P * (R - N) * 0.5, m - w * R, E - P * R, m + w * N, E + P * N, c, !0) + 2 : a.cap === De.SQUARE && (p += yu(m, E, w, P, R, N, !0, c))), c.push(m - w * R, E - P * R), c.push(m + w * N, E + P * N);
    for (var L = 1; L < d - 1; ++L) {
      m = i[(L - 1) * 2], E = i[(L - 1) * 2 + 1], b = i[L * 2], x = i[L * 2 + 1], S = i[(L + 1) * 2], A = i[(L + 1) * 2 + 1], w = -(E - x), P = m - b, D = Math.sqrt(w * w + P * P), w /= D, P /= D, w *= v, P *= v, O = -(x - A), F = b - S, D = Math.sqrt(O * O + F * F), O /= D, F /= D, O *= v, F *= v;
      var W = b - m, H = E - x, C = b - S, M = A - x, j = W * C + H * M, J = H * C - M * W, tt = J < 0;
      if (Math.abs(J) < 1e-3 * Math.abs(j)) {
        c.push(b - w * R, x - P * R), c.push(b + w * N, x + P * N), j >= 0 && (a.join === Te.ROUND ? p += Ve(b, x, b - w * R, x - P * R, b - O * R, x - F * R, c, !1) + 4 : p += 2, c.push(b - O * N, x - F * N), c.push(b + O * R, x + F * R));
        continue;
      }
      var dt = (-w + m) * (-P + x) - (-w + b) * (-P + E), $ = (-O + S) * (-F + x) - (-O + b) * (-F + A), ht = (W * $ - C * dt) / J, _t = (M * dt - H * $) / J, mt = (ht - b) * (ht - b) + (_t - x) * (_t - x), Z = b + (ht - b) * R, et = x + (_t - x) * R, nt = b - (ht - b) * N, pt = x - (_t - x) * N, rt = Math.min(W * W + H * H, C * C + M * M), X = tt ? R : N, U = rt + X * X * y, lt = mt <= U;
      lt ? a.join === Te.BEVEL || mt / y > g ? (tt ? (c.push(Z, et), c.push(b + w * N, x + P * N), c.push(Z, et), c.push(b + O * N, x + F * N)) : (c.push(b - w * R, x - P * R), c.push(nt, pt), c.push(b - O * R, x - F * R), c.push(nt, pt)), p += 2) : a.join === Te.ROUND ? tt ? (c.push(Z, et), c.push(b + w * N, x + P * N), p += Ve(b, x, b + w * N, x + P * N, b + O * N, x + F * N, c, !0) + 4, c.push(Z, et), c.push(b + O * N, x + F * N)) : (c.push(b - w * R, x - P * R), c.push(nt, pt), p += Ve(b, x, b - w * R, x - P * R, b - O * R, x - F * R, c, !1) + 4, c.push(b - O * R, x - F * R), c.push(nt, pt)) : (c.push(Z, et), c.push(nt, pt)) : (c.push(b - w * R, x - P * R), c.push(b + w * N, x + P * N), a.join === Te.ROUND ? tt ? p += Ve(b, x, b + w * N, x + P * N, b + O * N, x + F * N, c, !0) + 2 : p += Ve(b, x, b - w * R, x - P * R, b - O * R, x - F * R, c, !1) + 2 : a.join === Te.MITER && mt / y <= g && (tt ? (c.push(nt, pt), c.push(nt, pt)) : (c.push(Z, et), c.push(Z, et)), p += 2), c.push(b - O * R, x - F * R), c.push(b + O * N, x + F * N), p += 2);
    }
    m = i[(d - 2) * 2], E = i[(d - 2) * 2 + 1], b = i[(d - 1) * 2], x = i[(d - 1) * 2 + 1], w = -(E - x), P = m - b, D = Math.sqrt(w * w + P * P), w /= D, P /= D, w *= v, P *= v, c.push(b - w * R, x - P * R), c.push(b + w * N, x + P * N), u || (a.cap === De.ROUND ? p += Ve(b - w * (R - N) * 0.5, x - P * (R - N) * 0.5, b - w * R, x - P * R, b + w * N, x + P * N, c, !1) + 2 : a.cap === De.SQUARE && (p += yu(b, x, w, P, R, N, !1, c)));
    for (var ue = t.indices, fr = si.epsilon * si.epsilon, L = _; L < p + _ - 2; ++L)
      m = c[L * 2], E = c[L * 2 + 1], b = c[(L + 1) * 2], x = c[(L + 1) * 2 + 1], S = c[(L + 2) * 2], A = c[(L + 2) * 2 + 1], !(Math.abs(m * (x - A) + b * (A - E) + S * (E - x)) < fr) && ue.push(L, L + 1, L + 2);
  }
}
function l0(r, t) {
  var e = 0, i = r.shape, n = r.points || i.points, a = i.type !== Dt.POLY || i.closeStroke;
  if (n.length !== 0) {
    var o = t.points, s = t.indices, u = n.length / 2, h = o.length / 2, l = h;
    for (o.push(n[0], n[1]), e = 1; e < u; e++)
      o.push(n[e * 2], n[e * 2 + 1]), s.push(l, l + 1), l++;
    a && s.push(l, h);
  }
}
function gu(r, t) {
  r.lineStyle.native ? l0(r, t) : h0(r, t);
}
var mu = (
  /** @class */
  function() {
    function r() {
    }
    return r.curveTo = function(t, e, i, n, a, o) {
      var s = o[o.length - 2], u = o[o.length - 1], h = u - e, l = s - t, f = n - e, c = i - t, d = Math.abs(h * c - l * f);
      if (d < 1e-8 || a === 0)
        return (o[o.length - 2] !== t || o[o.length - 1] !== e) && o.push(t, e), null;
      var p = h * h + l * l, _ = f * f + c * c, v = h * f + l * c, y = a * Math.sqrt(p) / d, g = a * Math.sqrt(_) / d, m = y * v / p, E = g * v / _, b = y * c + g * l, x = y * f + g * h, S = l * (g + m), A = h * (g + m), w = c * (y + E), P = f * (y + E), O = Math.atan2(A - x, S - b), F = Math.atan2(P - x, w - b);
      return {
        cx: b + t,
        cy: x + e,
        radius: a,
        startAngle: O,
        endAngle: F,
        anticlockwise: l * f > c * h
      };
    }, r.arc = function(t, e, i, n, a, o, s, u, h) {
      for (var l = s - o, f = si._segmentsCount(Math.abs(l) * a, Math.ceil(Math.abs(l) / pn) * 40), c = l / (f * 2), d = c * 2, p = Math.cos(c), _ = Math.sin(c), v = f - 1, y = v % 1 / v, g = 0; g <= v; ++g) {
        var m = g + y * g, E = c + o + d * m, b = Math.cos(E), x = -Math.sin(E);
        h.push((p * b + _ * x) * a + i, (p * -x + _ * b) * a + n);
      }
    }, r;
  }()
), f0 = (
  /** @class */
  function() {
    function r() {
    }
    return r.curveLength = function(t, e, i, n, a, o, s, u) {
      for (var h = 10, l = 0, f = 0, c = 0, d = 0, p = 0, _ = 0, v = 0, y = 0, g = 0, m = 0, E = 0, b = t, x = e, S = 1; S <= h; ++S)
        f = S / h, c = f * f, d = c * f, p = 1 - f, _ = p * p, v = _ * p, y = v * t + 3 * _ * f * i + 3 * p * c * a + d * s, g = v * e + 3 * _ * f * n + 3 * p * c * o + d * u, m = b - y, E = x - g, b = y, x = g, l += Math.sqrt(m * m + E * E);
      return l;
    }, r.curveTo = function(t, e, i, n, a, o, s) {
      var u = s[s.length - 2], h = s[s.length - 1];
      s.length -= 2;
      var l = si._segmentsCount(r.curveLength(u, h, t, e, i, n, a, o)), f = 0, c = 0, d = 0, p = 0, _ = 0;
      s.push(u, h);
      for (var v = 1, y = 0; v <= l; ++v)
        y = v / l, f = 1 - y, c = f * f, d = c * f, p = y * y, _ = p * y, s.push(d * u + 3 * c * y * t + 3 * f * p * i + _ * a, d * h + 3 * c * y * e + 3 * f * p * n + _ * o);
    }, r;
  }()
), c0 = (
  /** @class */
  function() {
    function r() {
    }
    return r.curveLength = function(t, e, i, n, a, o) {
      var s = t - 2 * i + a, u = e - 2 * n + o, h = 2 * i - 2 * t, l = 2 * n - 2 * e, f = 4 * (s * s + u * u), c = 4 * (s * h + u * l), d = h * h + l * l, p = 2 * Math.sqrt(f + c + d), _ = Math.sqrt(f), v = 2 * f * _, y = 2 * Math.sqrt(d), g = c / _;
      return (v * p + _ * c * (p - y) + (4 * d * f - c * c) * Math.log((2 * _ + g + p) / (g + y))) / (4 * v);
    }, r.curveTo = function(t, e, i, n, a) {
      for (var o = a[a.length - 2], s = a[a.length - 1], u = si._segmentsCount(r.curveLength(o, s, t, e, i, n)), h = 0, l = 0, f = 1; f <= u; ++f) {
        var c = f / u;
        h = o + (t - o) * c, l = s + (e - s) * c, a.push(h + (t + (i - t) * c - h) * c, l + (e + (n - e) * c - l) * c);
      }
    }, r;
  }()
), d0 = (
  /** @class */
  function() {
    function r() {
      this.reset();
    }
    return r.prototype.begin = function(t, e, i) {
      this.reset(), this.style = t, this.start = e, this.attribStart = i;
    }, r.prototype.end = function(t, e) {
      this.attribSize = e - this.attribStart, this.size = t - this.start;
    }, r.prototype.reset = function() {
      this.style = null, this.size = 0, this.start = 0, this.attribStart = 0, this.attribSize = 0;
    }, r;
  }()
), ze, fa = (ze = {}, ze[Dt.POLY] = hl, ze[Dt.CIRC] = gn, ze[Dt.ELIP] = gn, ze[Dt.RECT] = s0, ze[Dt.RREC] = u0, ze), bu = [], ji = [], Eu = (
  /** @class */
  function() {
    function r(t, e, i, n) {
      e === void 0 && (e = null), i === void 0 && (i = null), n === void 0 && (n = null), this.points = [], this.holes = [], this.shape = t, this.lineStyle = i, this.fillStyle = e, this.matrix = n, this.type = t.type;
    }
    return r.prototype.clone = function() {
      return new r(this.shape, this.fillStyle, this.lineStyle, this.matrix);
    }, r.prototype.destroy = function() {
      this.shape = null, this.holes.length = 0, this.holes = null, this.points.length = 0, this.points = null, this.lineStyle = null, this.fillStyle = null;
    }, r;
  }()
), yr = new gt(), p0 = (
  /** @class */
  function(r) {
    Go(t, r);
    function t() {
      var e = r.call(this) || this;
      return e.closePointEps = 1e-4, e.boundsPadding = 0, e.uvsFloat32 = null, e.indicesUint16 = null, e.batchable = !1, e.points = [], e.colors = [], e.uvs = [], e.indices = [], e.textureIds = [], e.graphicsData = [], e.drawCalls = [], e.batchDirty = -1, e.batches = [], e.dirty = 0, e.cacheDirty = -1, e.clearDirty = 0, e.shapeIndex = 0, e._bounds = new vn(), e.boundsDirty = -1, e;
    }
    return Object.defineProperty(t.prototype, "bounds", {
      /**
       * Get the current bounds of the graphic geometry.
       * @readonly
       */
      get: function() {
        return this.updateBatches(), this.boundsDirty !== this.dirty && (this.boundsDirty = this.dirty, this.calculateBounds()), this._bounds;
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.invalidate = function() {
      this.boundsDirty = -1, this.dirty++, this.batchDirty++, this.shapeIndex = 0, this.points.length = 0, this.colors.length = 0, this.uvs.length = 0, this.indices.length = 0, this.textureIds.length = 0;
      for (var e = 0; e < this.drawCalls.length; e++)
        this.drawCalls[e].texArray.clear(), ji.push(this.drawCalls[e]);
      this.drawCalls.length = 0;
      for (var e = 0; e < this.batches.length; e++) {
        var i = this.batches[e];
        i.reset(), bu.push(i);
      }
      this.batches.length = 0;
    }, t.prototype.clear = function() {
      return this.graphicsData.length > 0 && (this.invalidate(), this.clearDirty++, this.graphicsData.length = 0), this;
    }, t.prototype.drawShape = function(e, i, n, a) {
      i === void 0 && (i = null), n === void 0 && (n = null), a === void 0 && (a = null);
      var o = new Eu(e, i, n, a);
      return this.graphicsData.push(o), this.dirty++, this;
    }, t.prototype.drawHole = function(e, i) {
      if (i === void 0 && (i = null), !this.graphicsData.length)
        return null;
      var n = new Eu(e, null, null, i), a = this.graphicsData[this.graphicsData.length - 1];
      return n.lineStyle = a.lineStyle, a.holes.push(n), this.dirty++, this;
    }, t.prototype.destroy = function() {
      r.prototype.destroy.call(this);
      for (var e = 0; e < this.graphicsData.length; ++e)
        this.graphicsData[e].destroy();
      this.points.length = 0, this.points = null, this.colors.length = 0, this.colors = null, this.uvs.length = 0, this.uvs = null, this.indices.length = 0, this.indices = null, this.indexBuffer.destroy(), this.indexBuffer = null, this.graphicsData.length = 0, this.graphicsData = null, this.drawCalls.length = 0, this.drawCalls = null, this.batches.length = 0, this.batches = null, this._bounds = null;
    }, t.prototype.containsPoint = function(e) {
      for (var i = this.graphicsData, n = 0; n < i.length; ++n) {
        var a = i[n];
        if (a.fillStyle.visible && a.shape && (a.matrix ? a.matrix.applyInverse(e, yr) : yr.copyFrom(e), a.shape.contains(yr.x, yr.y))) {
          var o = !1;
          if (a.holes)
            for (var s = 0; s < a.holes.length; s++) {
              var u = a.holes[s];
              if (u.shape.contains(yr.x, yr.y)) {
                o = !0;
                break;
              }
            }
          if (!o)
            return !0;
        }
      }
      return !1;
    }, t.prototype.updateBatches = function() {
      if (!this.graphicsData.length) {
        this.batchable = !0;
        return;
      }
      if (this.validateBatching()) {
        this.cacheDirty = this.dirty;
        var e = this.uvs, i = this.graphicsData, n = null, a = null;
        this.batches.length > 0 && (n = this.batches[this.batches.length - 1], a = n.style);
        for (var o = this.shapeIndex; o < i.length; o++) {
          this.shapeIndex++;
          var s = i[o], u = s.fillStyle, h = s.lineStyle, l = fa[s.type];
          l.build(s), s.matrix && this.transformPoints(s.points, s.matrix), (u.visible || h.visible) && this.processHoles(s.holes);
          for (var f = 0; f < 2; f++) {
            var c = f === 0 ? u : h;
            if (c.visible) {
              var d = c.texture.baseTexture, p = this.indices.length, _ = this.points.length / 2;
              d.wrapMode = de.REPEAT, f === 0 ? this.processFill(s) : this.processLine(s);
              var v = this.points.length / 2 - _;
              v !== 0 && (n && !this._compareStyles(a, c) && (n.end(p, _), n = null), n || (n = bu.pop() || new d0(), n.begin(c, p, _), this.batches.push(n), a = c), this.addUvs(this.points, e, c.texture, _, v, c.matrix));
            }
          }
        }
        var y = this.indices.length, g = this.points.length / 2;
        if (n && n.end(y, g), this.batches.length === 0) {
          this.batchable = !0;
          return;
        }
        var m = g > 65535;
        this.indicesUint16 && this.indices.length === this.indicesUint16.length && m === this.indicesUint16.BYTES_PER_ELEMENT > 2 ? this.indicesUint16.set(this.indices) : this.indicesUint16 = m ? new Uint32Array(this.indices) : new Uint16Array(this.indices), this.batchable = this.isBatchable(), this.batchable ? this.packBatches() : this.buildDrawCalls();
      }
    }, t.prototype._compareStyles = function(e, i) {
      return !(!e || !i || e.texture.baseTexture !== i.texture.baseTexture || e.color + e.alpha !== i.color + i.alpha || !!e.native != !!i.native);
    }, t.prototype.validateBatching = function() {
      if (this.dirty === this.cacheDirty || !this.graphicsData.length)
        return !1;
      for (var e = 0, i = this.graphicsData.length; e < i; e++) {
        var n = this.graphicsData[e], a = n.fillStyle, o = n.lineStyle;
        if (a && !a.texture.baseTexture.valid || o && !o.texture.baseTexture.valid)
          return !1;
      }
      return !0;
    }, t.prototype.packBatches = function() {
      this.batchDirty++, this.uvsFloat32 = new Float32Array(this.uvs);
      for (var e = this.batches, i = 0, n = e.length; i < n; i++)
        for (var a = e[i], o = 0; o < a.size; o++) {
          var s = a.start + o;
          this.indicesUint16[s] = this.indicesUint16[s] - a.attribStart;
        }
    }, t.prototype.isBatchable = function() {
      if (this.points.length > 65535 * 2)
        return !1;
      for (var e = this.batches, i = 0; i < e.length; i++)
        if (e[i].style.native)
          return !1;
      return this.points.length < t.BATCHABLE_SIZE * 2;
    }, t.prototype.buildDrawCalls = function() {
      for (var e = ++ot._globalBatch, i = 0; i < this.drawCalls.length; i++)
        this.drawCalls[i].texArray.clear(), ji.push(this.drawCalls[i]);
      this.drawCalls.length = 0;
      var n = this.colors, a = this.textureIds, o = ji.pop();
      o || (o = new Wa(), o.texArray = new Ya()), o.texArray.count = 0, o.start = 0, o.size = 0, o.type = ie.TRIANGLES;
      var s = 0, u = null, h = 0, l = !1, f = ie.TRIANGLES, c = 0;
      this.drawCalls.push(o);
      for (var i = 0; i < this.batches.length; i++) {
        var d = this.batches[i], p = 8, _ = d.style, v = _.texture.baseTexture;
        l !== !!_.native && (l = !!_.native, f = l ? ie.LINES : ie.TRIANGLES, u = null, s = p, e++), u !== v && (u = v, v._batchEnabled !== e && (s === p && (e++, s = 0, o.size > 0 && (o = ji.pop(), o || (o = new Wa(), o.texArray = new Ya()), this.drawCalls.push(o)), o.start = c, o.size = 0, o.texArray.count = 0, o.type = f), v.touched = 1, v._batchEnabled = e, v._batchLocation = s, v.wrapMode = de.REPEAT, o.texArray.elements[o.texArray.count++] = v, s++)), o.size += d.size, c += d.size, h = v._batchLocation, this.addColors(n, _.color, _.alpha, d.attribSize, d.attribStart), this.addTextureIds(a, h, d.attribSize, d.attribStart);
      }
      ot._globalBatch = e, this.packAttributes();
    }, t.prototype.packAttributes = function() {
      for (var e = this.points, i = this.uvs, n = this.colors, a = this.textureIds, o = new ArrayBuffer(e.length * 3 * 4), s = new Float32Array(o), u = new Uint32Array(o), h = 0, l = 0; l < e.length / 2; l++)
        s[h++] = e[l * 2], s[h++] = e[l * 2 + 1], s[h++] = i[l * 2], s[h++] = i[l * 2 + 1], u[h++] = n[l], s[h++] = a[l];
      this._buffer.update(o), this._indexBuffer.update(this.indicesUint16);
    }, t.prototype.processFill = function(e) {
      if (e.holes.length)
        hl.triangulate(e, this);
      else {
        var i = fa[e.type];
        i.triangulate(e, this);
      }
    }, t.prototype.processLine = function(e) {
      gu(e, this);
      for (var i = 0; i < e.holes.length; i++)
        gu(e.holes[i], this);
    }, t.prototype.processHoles = function(e) {
      for (var i = 0; i < e.length; i++) {
        var n = e[i], a = fa[n.type];
        a.build(n), n.matrix && this.transformPoints(n.points, n.matrix);
      }
    }, t.prototype.calculateBounds = function() {
      var e = this._bounds;
      e.clear(), e.addVertexData(this.points, 0, this.points.length), e.pad(this.boundsPadding, this.boundsPadding);
    }, t.prototype.transformPoints = function(e, i) {
      for (var n = 0; n < e.length / 2; n++) {
        var a = e[n * 2], o = e[n * 2 + 1];
        e[n * 2] = i.a * a + i.c * o + i.tx, e[n * 2 + 1] = i.b * a + i.d * o + i.ty;
      }
    }, t.prototype.addColors = function(e, i, n, a, o) {
      o === void 0 && (o = 0);
      var s = (i >> 16) + (i & 65280) + ((i & 255) << 16), u = Bo(s, n);
      e.length = Math.max(e.length, o + a);
      for (var h = 0; h < a; h++)
        e[o + h] = u;
    }, t.prototype.addTextureIds = function(e, i, n, a) {
      a === void 0 && (a = 0), e.length = Math.max(e.length, a + n);
      for (var o = 0; o < n; o++)
        e[a + o] = i;
    }, t.prototype.addUvs = function(e, i, n, a, o, s) {
      s === void 0 && (s = null);
      for (var u = 0, h = i.length, l = n.frame; u < o; ) {
        var f = e[(a + u) * 2], c = e[(a + u) * 2 + 1];
        if (s) {
          var d = s.a * f + s.c * c + s.tx;
          c = s.b * f + s.d * c + s.ty, f = d;
        }
        u++, i.push(f / l.width, c / l.height);
      }
      var p = n.baseTexture;
      (l.width < p.width || l.height < p.height) && this.adjustUvs(i, n, h, o);
    }, t.prototype.adjustUvs = function(e, i, n, a) {
      for (var o = i.baseTexture, s = 1e-6, u = n + a * 2, h = i.frame, l = h.width / o.width, f = h.height / o.height, c = h.x / h.width, d = h.y / h.height, p = Math.floor(e[n] + s), _ = Math.floor(e[n + 1] + s), v = n + 2; v < u; v += 2)
        p = Math.min(p, Math.floor(e[v] + s)), _ = Math.min(_, Math.floor(e[v + 1] + s));
      c -= p, d -= _;
      for (var v = n; v < u; v += 2)
        e[v] = (e[v] + c) * l, e[v + 1] = (e[v + 1] + d) * f;
    }, t.BATCHABLE_SIZE = 100, t;
  }(rl)
), v0 = (
  /** @class */
  function(r) {
    Go(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.width = 0, e.alignment = 0.5, e.native = !1, e.cap = De.BUTT, e.join = Te.MITER, e.miterLimit = 10, e;
    }
    return t.prototype.clone = function() {
      var e = new t();
      return e.color = this.color, e.alpha = this.alpha, e.texture = this.texture, e.matrix = this.matrix, e.visible = this.visible, e.width = this.width, e.alignment = this.alignment, e.native = this.native, e.cap = this.cap, e.join = this.join, e.miterLimit = this.miterLimit, e;
    }, t.prototype.reset = function() {
      r.prototype.reset.call(this), this.color = 0, this.alignment = 0.5, this.width = 0, this.native = !1;
    }, t;
  }(ul)
), _0 = new Float32Array(3), ca = {}, sr = (
  /** @class */
  function(r) {
    Go(t, r);
    function t(e) {
      e === void 0 && (e = null);
      var i = r.call(this) || this;
      return i.shader = null, i.pluginName = "batch", i.currentPath = null, i.batches = [], i.batchTint = -1, i.batchDirty = -1, i.vertexData = null, i._fillStyle = new ul(), i._lineStyle = new v0(), i._matrix = null, i._holeMode = !1, i.state = lr.for2d(), i._geometry = e || new p0(), i._geometry.refCount++, i._transformID = -1, i.tint = 16777215, i.blendMode = z.NORMAL, i;
    }
    return Object.defineProperty(t.prototype, "geometry", {
      /**
       * Includes vertex positions, face indices, normals, colors, UVs, and
       * custom attributes within buffers, reducing the cost of passing all
       * this data to the GPU. Can be shared between multiple Mesh or Graphics objects.
       * @readonly
       */
      get: function() {
        return this._geometry;
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.clone = function() {
      return this.finishPoly(), new t(this._geometry);
    }, Object.defineProperty(t.prototype, "blendMode", {
      get: function() {
        return this.state.blendMode;
      },
      /**
       * The blend mode to be applied to the graphic shape. Apply a value of
       * `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.  Note that, since each
       * primitive in the GraphicsGeometry list is rendered sequentially, modes
       * such as `PIXI.BLEND_MODES.ADD` and `PIXI.BLEND_MODES.MULTIPLY` will
       * be applied per-primitive.
       * @default PIXI.BLEND_MODES.NORMAL
       */
      set: function(e) {
        this.state.blendMode = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "tint", {
      /**
       * The tint applied to each graphic shape. This is a hex value. A value of
       * 0xFFFFFF will remove any tint effect.
       * @default 0xFFFFFF
       */
      get: function() {
        return this._tint;
      },
      set: function(e) {
        this._tint = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "fill", {
      /**
       * The current fill style.
       * @readonly
       */
      get: function() {
        return this._fillStyle;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "line", {
      /**
       * The current line style.
       * @readonly
       */
      get: function() {
        return this._lineStyle;
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.lineStyle = function(e, i, n, a, o) {
      return e === void 0 && (e = null), i === void 0 && (i = 0), n === void 0 && (n = 1), a === void 0 && (a = 0.5), o === void 0 && (o = !1), typeof e == "number" && (e = { width: e, color: i, alpha: n, alignment: a, native: o }), this.lineTextureStyle(e);
    }, t.prototype.lineTextureStyle = function(e) {
      e = Object.assign({
        width: 0,
        texture: K.WHITE,
        color: e && e.texture ? 16777215 : 0,
        alpha: 1,
        matrix: null,
        alignment: 0.5,
        native: !1,
        cap: De.BUTT,
        join: Te.MITER,
        miterLimit: 10
      }, e), this.currentPath && this.startPoly();
      var i = e.width > 0 && e.alpha > 0;
      return i ? (e.matrix && (e.matrix = e.matrix.clone(), e.matrix.invert()), Object.assign(this._lineStyle, { visible: i }, e)) : this._lineStyle.reset(), this;
    }, t.prototype.startPoly = function() {
      if (this.currentPath) {
        var e = this.currentPath.points, i = this.currentPath.points.length;
        i > 2 && (this.drawShape(this.currentPath), this.currentPath = new Qi(), this.currentPath.closeStroke = !1, this.currentPath.points.push(e[i - 2], e[i - 1]));
      } else
        this.currentPath = new Qi(), this.currentPath.closeStroke = !1;
    }, t.prototype.finishPoly = function() {
      this.currentPath && (this.currentPath.points.length > 2 ? (this.drawShape(this.currentPath), this.currentPath = null) : this.currentPath.points.length = 0);
    }, t.prototype.moveTo = function(e, i) {
      return this.startPoly(), this.currentPath.points[0] = e, this.currentPath.points[1] = i, this;
    }, t.prototype.lineTo = function(e, i) {
      this.currentPath || this.moveTo(0, 0);
      var n = this.currentPath.points, a = n[n.length - 2], o = n[n.length - 1];
      return (a !== e || o !== i) && n.push(e, i), this;
    }, t.prototype._initCurve = function(e, i) {
      e === void 0 && (e = 0), i === void 0 && (i = 0), this.currentPath ? this.currentPath.points.length === 0 && (this.currentPath.points = [e, i]) : this.moveTo(e, i);
    }, t.prototype.quadraticCurveTo = function(e, i, n, a) {
      this._initCurve();
      var o = this.currentPath.points;
      return o.length === 0 && this.moveTo(0, 0), c0.curveTo(e, i, n, a, o), this;
    }, t.prototype.bezierCurveTo = function(e, i, n, a, o, s) {
      return this._initCurve(), f0.curveTo(e, i, n, a, o, s, this.currentPath.points), this;
    }, t.prototype.arcTo = function(e, i, n, a, o) {
      this._initCurve(e, i);
      var s = this.currentPath.points, u = mu.curveTo(e, i, n, a, o, s);
      if (u) {
        var h = u.cx, l = u.cy, f = u.radius, c = u.startAngle, d = u.endAngle, p = u.anticlockwise;
        this.arc(h, l, f, c, d, p);
      }
      return this;
    }, t.prototype.arc = function(e, i, n, a, o, s) {
      if (s === void 0 && (s = !1), a === o)
        return this;
      !s && o <= a ? o += pn : s && a <= o && (a += pn);
      var u = o - a;
      if (u === 0)
        return this;
      var h = e + Math.cos(a) * n, l = i + Math.sin(a) * n, f = this._geometry.closePointEps, c = this.currentPath ? this.currentPath.points : null;
      if (c) {
        var d = Math.abs(c[c.length - 2] - h), p = Math.abs(c[c.length - 1] - l);
        d < f && p < f || c.push(h, l);
      } else
        this.moveTo(h, l), c = this.currentPath.points;
      return mu.arc(h, l, e, i, n, a, o, s, c), this;
    }, t.prototype.beginFill = function(e, i) {
      return e === void 0 && (e = 0), i === void 0 && (i = 1), this.beginTextureFill({ texture: K.WHITE, color: e, alpha: i });
    }, t.prototype.beginTextureFill = function(e) {
      e = Object.assign({
        texture: K.WHITE,
        color: 16777215,
        alpha: 1,
        matrix: null
      }, e), this.currentPath && this.startPoly();
      var i = e.alpha > 0;
      return i ? (e.matrix && (e.matrix = e.matrix.clone(), e.matrix.invert()), Object.assign(this._fillStyle, { visible: i }, e)) : this._fillStyle.reset(), this;
    }, t.prototype.endFill = function() {
      return this.finishPoly(), this._fillStyle.reset(), this;
    }, t.prototype.drawRect = function(e, i, n, a) {
      return this.drawShape(new st(e, i, n, a));
    }, t.prototype.drawRoundedRect = function(e, i, n, a, o) {
      return this.drawShape(new Ty(e, i, n, a, o));
    }, t.prototype.drawCircle = function(e, i, n) {
      return this.drawShape(new by(e, i, n));
    }, t.prototype.drawEllipse = function(e, i, n, a) {
      return this.drawShape(new Ey(e, i, n, a));
    }, t.prototype.drawPolygon = function() {
      for (var e = arguments, i = [], n = 0; n < arguments.length; n++)
        i[n] = e[n];
      var a, o = !0, s = i[0];
      s.points ? (o = s.closeStroke, a = s.points) : Array.isArray(i[0]) ? a = i[0] : a = i;
      var u = new Qi(a);
      return u.closeStroke = o, this.drawShape(u), this;
    }, t.prototype.drawShape = function(e) {
      return this._holeMode ? this._geometry.drawHole(e, this._matrix) : this._geometry.drawShape(e, this._fillStyle.clone(), this._lineStyle.clone(), this._matrix), this;
    }, t.prototype.clear = function() {
      return this._geometry.clear(), this._lineStyle.reset(), this._fillStyle.reset(), this._boundsID++, this._matrix = null, this._holeMode = !1, this.currentPath = null, this;
    }, t.prototype.isFastRect = function() {
      var e = this._geometry.graphicsData;
      return e.length === 1 && e[0].shape.type === Dt.RECT && !e[0].matrix && !e[0].holes.length && !(e[0].lineStyle.visible && e[0].lineStyle.width);
    }, t.prototype._render = function(e) {
      this.finishPoly();
      var i = this._geometry;
      i.updateBatches(), i.batchable ? (this.batchDirty !== i.batchDirty && this._populateBatches(), this._renderBatched(e)) : (e.batch.flush(), this._renderDirect(e));
    }, t.prototype._populateBatches = function() {
      var e = this._geometry, i = this.blendMode, n = e.batches.length;
      this.batchTint = -1, this._transformID = -1, this.batchDirty = e.batchDirty, this.batches.length = n, this.vertexData = new Float32Array(e.points);
      for (var a = 0; a < n; a++) {
        var o = e.batches[a], s = o.style.color, u = new Float32Array(this.vertexData.buffer, o.attribStart * 4 * 2, o.attribSize * 2), h = new Float32Array(e.uvsFloat32.buffer, o.attribStart * 4 * 2, o.attribSize * 2), l = new Uint16Array(e.indicesUint16.buffer, o.start * 2, o.size), f = {
          vertexData: u,
          blendMode: i,
          indices: l,
          uvs: h,
          _batchRGB: Dr(s),
          _tintRGB: s,
          _texture: o.style.texture,
          alpha: o.style.alpha,
          worldAlpha: 1
        };
        this.batches[a] = f;
      }
    }, t.prototype._renderBatched = function(e) {
      if (this.batches.length) {
        e.batch.setObjectRenderer(e.plugins[this.pluginName]), this.calculateVertices(), this.calculateTints();
        for (var i = 0, n = this.batches.length; i < n; i++) {
          var a = this.batches[i];
          a.worldAlpha = this.worldAlpha * a.alpha, e.plugins[this.pluginName].render(a);
        }
      }
    }, t.prototype._renderDirect = function(e) {
      var i = this._resolveDirectShader(e), n = this._geometry, a = this.tint, o = this.worldAlpha, s = i.uniforms, u = n.drawCalls;
      s.translationMatrix = this.transform.worldTransform, s.tint[0] = (a >> 16 & 255) / 255 * o, s.tint[1] = (a >> 8 & 255) / 255 * o, s.tint[2] = (a & 255) / 255 * o, s.tint[3] = o, e.shader.bind(i), e.geometry.bind(n, i), e.state.set(this.state);
      for (var h = 0, l = u.length; h < l; h++)
        this._renderDrawCallDirect(e, n.drawCalls[h]);
    }, t.prototype._renderDrawCallDirect = function(e, i) {
      for (var n = i.texArray, a = i.type, o = i.size, s = i.start, u = n.count, h = 0; h < u; h++)
        e.texture.bind(n.elements[h], h);
      e.geometry.draw(a, o, s);
    }, t.prototype._resolveDirectShader = function(e) {
      var i = this.shader, n = this.pluginName;
      if (!i) {
        if (!ca[n]) {
          for (var a = e.plugins[n].MAX_TEXTURES, o = new Int32Array(a), s = 0; s < a; s++)
            o[s] = s;
          var u = {
            tint: new Float32Array([1, 1, 1, 1]),
            translationMatrix: new It(),
            default: ir.from({ uSamplers: o }, !0)
          }, h = e.plugins[n]._shader.program;
          ca[n] = new Fe(h, u);
        }
        i = ca[n];
      }
      return i;
    }, t.prototype._calculateBounds = function() {
      this.finishPoly();
      var e = this._geometry;
      if (e.graphicsData.length) {
        var i = e.bounds, n = i.minX, a = i.minY, o = i.maxX, s = i.maxY;
        this._bounds.addFrame(this.transform, n, a, o, s);
      }
    }, t.prototype.containsPoint = function(e) {
      return this.worldTransform.applyInverse(e, t._TEMP_POINT), this._geometry.containsPoint(t._TEMP_POINT);
    }, t.prototype.calculateTints = function() {
      if (this.batchTint !== this.tint) {
        this.batchTint = this.tint;
        for (var e = Dr(this.tint, _0), i = 0; i < this.batches.length; i++) {
          var n = this.batches[i], a = n._batchRGB, o = e[0] * a[0] * 255, s = e[1] * a[1] * 255, u = e[2] * a[2] * 255, h = (o << 16) + (s << 8) + (u | 0);
          n._tintRGB = (h >> 16) + (h & 65280) + ((h & 255) << 16);
        }
      }
    }, t.prototype.calculateVertices = function() {
      var e = this.transform._worldID;
      if (this._transformID !== e) {
        this._transformID = e;
        for (var i = this.transform.worldTransform, n = i.a, a = i.b, o = i.c, s = i.d, u = i.tx, h = i.ty, l = this._geometry.points, f = this.vertexData, c = 0, d = 0; d < l.length; d += 2) {
          var p = l[d], _ = l[d + 1];
          f[c++] = n * p + o * _ + u, f[c++] = s * _ + a * p + h;
        }
      }
    }, t.prototype.closePath = function() {
      var e = this.currentPath;
      return e && (e.closeStroke = !0, this.finishPoly()), this;
    }, t.prototype.setMatrix = function(e) {
      return this._matrix = e, this;
    }, t.prototype.beginHole = function() {
      return this.finishPoly(), this._holeMode = !0, this;
    }, t.prototype.endHole = function() {
      return this.finishPoly(), this._holeMode = !1, this;
    }, t.prototype.destroy = function(e) {
      this._geometry.refCount--, this._geometry.refCount === 0 && this._geometry.dispose(), this._matrix = null, this.currentPath = null, this._lineStyle.destroy(), this._lineStyle = null, this._fillStyle.destroy(), this._fillStyle = null, this._geometry = null, this.shader = null, this.vertexData = null, this.batches.length = 0, this.batches = null, r.prototype.destroy.call(this, e);
    }, t.nextRoundedRectBehavior = !1, t._TEMP_POINT = new gt(), t;
  }(ve)
);
/*!
 * @pixi/sprite - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/sprite is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var ro = function(r, t) {
  return ro = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, ro(r, t);
};
function y0(r, t) {
  ro(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
var jr = new gt(), g0 = new Uint16Array([0, 1, 2, 0, 2, 3]), _i = (
  /** @class */
  function(r) {
    y0(t, r);
    function t(e) {
      var i = r.call(this) || this;
      return i._anchor = new wr(i._onAnchorUpdate, i, e ? e.defaultAnchor.x : 0, e ? e.defaultAnchor.y : 0), i._texture = null, i._width = 0, i._height = 0, i._tint = null, i._tintRGB = null, i.tint = 16777215, i.blendMode = z.NORMAL, i._cachedTint = 16777215, i.uvs = null, i.texture = e || K.EMPTY, i.vertexData = new Float32Array(8), i.vertexTrimmedData = null, i._transformID = -1, i._textureID = -1, i._transformTrimmedID = -1, i._textureTrimmedID = -1, i.indices = g0, i.pluginName = "batch", i.isSprite = !0, i._roundPixels = k.ROUND_PIXELS, i;
    }
    return t.prototype._onTextureUpdate = function() {
      this._textureID = -1, this._textureTrimmedID = -1, this._cachedTint = 16777215, this._width && (this.scale.x = xr(this.scale.x) * this._width / this._texture.orig.width), this._height && (this.scale.y = xr(this.scale.y) * this._height / this._texture.orig.height);
    }, t.prototype._onAnchorUpdate = function() {
      this._transformID = -1, this._transformTrimmedID = -1;
    }, t.prototype.calculateVertices = function() {
      var e = this._texture;
      if (!(this._transformID === this.transform._worldID && this._textureID === e._updateID)) {
        this._textureID !== e._updateID && (this.uvs = this._texture._uvs.uvsFloat32), this._transformID = this.transform._worldID, this._textureID = e._updateID;
        var i = this.transform.worldTransform, n = i.a, a = i.b, o = i.c, s = i.d, u = i.tx, h = i.ty, l = this.vertexData, f = e.trim, c = e.orig, d = this._anchor, p = 0, _ = 0, v = 0, y = 0;
        if (f ? (_ = f.x - d._x * c.width, p = _ + f.width, y = f.y - d._y * c.height, v = y + f.height) : (_ = -d._x * c.width, p = _ + c.width, y = -d._y * c.height, v = y + c.height), l[0] = n * _ + o * y + u, l[1] = s * y + a * _ + h, l[2] = n * p + o * y + u, l[3] = s * y + a * p + h, l[4] = n * p + o * v + u, l[5] = s * v + a * p + h, l[6] = n * _ + o * v + u, l[7] = s * v + a * _ + h, this._roundPixels)
          for (var g = k.RESOLUTION, m = 0; m < l.length; ++m)
            l[m] = Math.round((l[m] * g | 0) / g);
      }
    }, t.prototype.calculateTrimmedVertices = function() {
      if (!this.vertexTrimmedData)
        this.vertexTrimmedData = new Float32Array(8);
      else if (this._transformTrimmedID === this.transform._worldID && this._textureTrimmedID === this._texture._updateID)
        return;
      this._transformTrimmedID = this.transform._worldID, this._textureTrimmedID = this._texture._updateID;
      var e = this._texture, i = this.vertexTrimmedData, n = e.orig, a = this._anchor, o = this.transform.worldTransform, s = o.a, u = o.b, h = o.c, l = o.d, f = o.tx, c = o.ty, d = -a._x * n.width, p = d + n.width, _ = -a._y * n.height, v = _ + n.height;
      i[0] = s * d + h * _ + f, i[1] = l * _ + u * d + c, i[2] = s * p + h * _ + f, i[3] = l * _ + u * p + c, i[4] = s * p + h * v + f, i[5] = l * v + u * p + c, i[6] = s * d + h * v + f, i[7] = l * v + u * d + c;
    }, t.prototype._render = function(e) {
      this.calculateVertices(), e.batch.setObjectRenderer(e.plugins[this.pluginName]), e.plugins[this.pluginName].render(this);
    }, t.prototype._calculateBounds = function() {
      var e = this._texture.trim, i = this._texture.orig;
      !e || e.width === i.width && e.height === i.height ? (this.calculateVertices(), this._bounds.addQuad(this.vertexData)) : (this.calculateTrimmedVertices(), this._bounds.addQuad(this.vertexTrimmedData));
    }, t.prototype.getLocalBounds = function(e) {
      return this.children.length === 0 ? (this._localBounds || (this._localBounds = new vn()), this._localBounds.minX = this._texture.orig.width * -this._anchor._x, this._localBounds.minY = this._texture.orig.height * -this._anchor._y, this._localBounds.maxX = this._texture.orig.width * (1 - this._anchor._x), this._localBounds.maxY = this._texture.orig.height * (1 - this._anchor._y), e || (this._localBoundsRect || (this._localBoundsRect = new st()), e = this._localBoundsRect), this._localBounds.getRectangle(e)) : r.prototype.getLocalBounds.call(this, e);
    }, t.prototype.containsPoint = function(e) {
      this.worldTransform.applyInverse(e, jr);
      var i = this._texture.orig.width, n = this._texture.orig.height, a = -i * this.anchor.x, o = 0;
      return jr.x >= a && jr.x < a + i && (o = -n * this.anchor.y, jr.y >= o && jr.y < o + n);
    }, t.prototype.destroy = function(e) {
      r.prototype.destroy.call(this, e), this._texture.off("update", this._onTextureUpdate, this), this._anchor = null;
      var i = typeof e == "boolean" ? e : e && e.texture;
      if (i) {
        var n = typeof e == "boolean" ? e : e && e.baseTexture;
        this._texture.destroy(!!n);
      }
      this._texture = null;
    }, t.from = function(e, i) {
      var n = e instanceof K ? e : K.from(e, i);
      return new t(n);
    }, Object.defineProperty(t.prototype, "roundPixels", {
      get: function() {
        return this._roundPixels;
      },
      /**
       * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
       *
       * Advantages can include sharper image quality (like text) and faster rendering on canvas.
       * The main disadvantage is movement of objects may appear less smooth.
       *
       * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}.
       * @default false
       */
      set: function(e) {
        this._roundPixels !== e && (this._transformID = -1), this._roundPixels = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "width", {
      /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return Math.abs(this.scale.x) * this._texture.orig.width;
      },
      set: function(e) {
        var i = xr(this.scale.x) || 1;
        this.scale.x = i * e / this._texture.orig.width, this._width = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "height", {
      /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return Math.abs(this.scale.y) * this._texture.orig.height;
      },
      set: function(e) {
        var i = xr(this.scale.y) || 1;
        this.scale.y = i * e / this._texture.orig.height, this._height = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "anchor", {
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
       * const sprite = new PIXI.Sprite(texture);
       * sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
       */
      get: function() {
        return this._anchor;
      },
      set: function(e) {
        this._anchor.copyFrom(e);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "tint", {
      /**
       * The tint applied to the sprite. This is a hex value.
       *
       * A value of 0xFFFFFF will remove any tint effect.
       * @default 0xFFFFFF
       */
      get: function() {
        return this._tint;
      },
      set: function(e) {
        this._tint = e, this._tintRGB = (e >> 16) + (e & 65280) + ((e & 255) << 16);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "texture", {
      /** The texture that the sprite is using. */
      get: function() {
        return this._texture;
      },
      set: function(e) {
        this._texture !== e && (this._texture && this._texture.off("update", this._onTextureUpdate, this), this._texture = e || K.EMPTY, this._cachedTint = 16777215, this._textureID = -1, this._textureTrimmedID = -1, e && (e.baseTexture.valid ? this._onTextureUpdate() : e.once("update", this._onTextureUpdate, this)));
      },
      enumerable: !1,
      configurable: !0
    }), t;
  }(ve)
);
/*!
 * @pixi/text - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/text is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var io = function(r, t) {
  return io = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, io(r, t);
};
function m0(r, t) {
  io(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
var ui;
(function(r) {
  r[r.LINEAR_VERTICAL = 0] = "LINEAR_VERTICAL", r[r.LINEAR_HORIZONTAL = 1] = "LINEAR_HORIZONTAL";
})(ui || (ui = {}));
var da = {
  align: "left",
  breakWords: !1,
  dropShadow: !1,
  dropShadowAlpha: 1,
  dropShadowAngle: Math.PI / 6,
  dropShadowBlur: 0,
  dropShadowColor: "black",
  dropShadowDistance: 5,
  fill: "black",
  fillGradientType: ui.LINEAR_VERTICAL,
  fillGradientStops: [],
  fontFamily: "Arial",
  fontSize: 26,
  fontStyle: "normal",
  fontVariant: "normal",
  fontWeight: "normal",
  letterSpacing: 0,
  lineHeight: 0,
  lineJoin: "miter",
  miterLimit: 10,
  padding: 0,
  stroke: "black",
  strokeThickness: 0,
  textBaseline: "alphabetic",
  trim: !1,
  whiteSpace: "pre",
  wordWrap: !1,
  wordWrapWidth: 100,
  leading: 0
}, b0 = [
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui"
], Fr = (
  /** @class */
  function() {
    function r(t) {
      this.styleID = 0, this.reset(), va(this, t, t);
    }
    return r.prototype.clone = function() {
      var t = {};
      return va(t, this, da), new r(t);
    }, r.prototype.reset = function() {
      va(this, da, da);
    }, Object.defineProperty(r.prototype, "align", {
      /**
       * Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text
       *
       * @member {string}
       */
      get: function() {
        return this._align;
      },
      set: function(t) {
        this._align !== t && (this._align = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "breakWords", {
      /** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true. */
      get: function() {
        return this._breakWords;
      },
      set: function(t) {
        this._breakWords !== t && (this._breakWords = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadow", {
      /** Set a drop shadow for the text. */
      get: function() {
        return this._dropShadow;
      },
      set: function(t) {
        this._dropShadow !== t && (this._dropShadow = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadowAlpha", {
      /** Set alpha for the drop shadow. */
      get: function() {
        return this._dropShadowAlpha;
      },
      set: function(t) {
        this._dropShadowAlpha !== t && (this._dropShadowAlpha = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadowAngle", {
      /** Set a angle of the drop shadow. */
      get: function() {
        return this._dropShadowAngle;
      },
      set: function(t) {
        this._dropShadowAngle !== t && (this._dropShadowAngle = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadowBlur", {
      /** Set a shadow blur radius. */
      get: function() {
        return this._dropShadowBlur;
      },
      set: function(t) {
        this._dropShadowBlur !== t && (this._dropShadowBlur = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadowColor", {
      /** A fill style to be used on the dropshadow e.g 'red', '#00FF00'. */
      get: function() {
        return this._dropShadowColor;
      },
      set: function(t) {
        var e = pa(t);
        this._dropShadowColor !== e && (this._dropShadowColor = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadowDistance", {
      /** Set a distance of the drop shadow. */
      get: function() {
        return this._dropShadowDistance;
      },
      set: function(t) {
        this._dropShadowDistance !== t && (this._dropShadowDistance = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "fill", {
      /**
       * A canvas fillstyle that will be used on the text e.g 'red', '#00FF00'.
       *
       * Can be an array to create a gradient eg ['#000000','#FFFFFF']
       * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
       *
       * @member {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
       */
      get: function() {
        return this._fill;
      },
      set: function(t) {
        var e = pa(t);
        this._fill !== e && (this._fill = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "fillGradientType", {
      /**
       * If fill is an array of colours to create a gradient, this can change the type/direction of the gradient.
       *
       * @see PIXI.TEXT_GRADIENT
       */
      get: function() {
        return this._fillGradientType;
      },
      set: function(t) {
        this._fillGradientType !== t && (this._fillGradientType = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "fillGradientStops", {
      /**
       * If fill is an array of colours to create a gradient, this array can set the stop points
       * (numbers between 0 and 1) for the color, overriding the default behaviour of evenly spacing them.
       */
      get: function() {
        return this._fillGradientStops;
      },
      set: function(t) {
        E0(this._fillGradientStops, t) || (this._fillGradientStops = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "fontFamily", {
      /** The font family. */
      get: function() {
        return this._fontFamily;
      },
      set: function(t) {
        this.fontFamily !== t && (this._fontFamily = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "fontSize", {
      /**
       * The font size
       * (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em')
       */
      get: function() {
        return this._fontSize;
      },
      set: function(t) {
        this._fontSize !== t && (this._fontSize = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "fontStyle", {
      /**
       * The font style
       * ('normal', 'italic' or 'oblique')
       *
       * @member {string}
       */
      get: function() {
        return this._fontStyle;
      },
      set: function(t) {
        this._fontStyle !== t && (this._fontStyle = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "fontVariant", {
      /**
       * The font variant
       * ('normal' or 'small-caps')
       *
       * @member {string}
       */
      get: function() {
        return this._fontVariant;
      },
      set: function(t) {
        this._fontVariant !== t && (this._fontVariant = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "fontWeight", {
      /**
       * The font weight
       * ('normal', 'bold', 'bolder', 'lighter' and '100', '200', '300', '400', '500', '600', '700', 800' or '900')
       *
       * @member {string}
       */
      get: function() {
        return this._fontWeight;
      },
      set: function(t) {
        this._fontWeight !== t && (this._fontWeight = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "letterSpacing", {
      /** The amount of spacing between letters, default is 0. */
      get: function() {
        return this._letterSpacing;
      },
      set: function(t) {
        this._letterSpacing !== t && (this._letterSpacing = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "lineHeight", {
      /** The line height, a number that represents the vertical space that a letter uses. */
      get: function() {
        return this._lineHeight;
      },
      set: function(t) {
        this._lineHeight !== t && (this._lineHeight = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "leading", {
      /** The space between lines. */
      get: function() {
        return this._leading;
      },
      set: function(t) {
        this._leading !== t && (this._leading = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "lineJoin", {
      /**
       * The lineJoin property sets the type of corner created, it can resolve spiked text issues.
       * Default is 'miter' (creates a sharp corner).
       *
       * @member {string}
       */
      get: function() {
        return this._lineJoin;
      },
      set: function(t) {
        this._lineJoin !== t && (this._lineJoin = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "miterLimit", {
      /**
       * The miter limit to use when using the 'miter' lineJoin mode.
       *
       * This can reduce or increase the spikiness of rendered text.
       */
      get: function() {
        return this._miterLimit;
      },
      set: function(t) {
        this._miterLimit !== t && (this._miterLimit = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "padding", {
      /**
       * Occasionally some fonts are cropped. Adding some padding will prevent this from happening
       * by adding padding to all sides of the text.
       */
      get: function() {
        return this._padding;
      },
      set: function(t) {
        this._padding !== t && (this._padding = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "stroke", {
      /**
       * A canvas fillstyle that will be used on the text stroke
       * e.g 'blue', '#FCFF00'
       */
      get: function() {
        return this._stroke;
      },
      set: function(t) {
        var e = pa(t);
        this._stroke !== e && (this._stroke = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "strokeThickness", {
      /**
       * A number that represents the thickness of the stroke.
       *
       * @default 0
       */
      get: function() {
        return this._strokeThickness;
      },
      set: function(t) {
        this._strokeThickness !== t && (this._strokeThickness = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "textBaseline", {
      /**
       * The baseline of the text that is rendered.
       *
       * @member {string}
       */
      get: function() {
        return this._textBaseline;
      },
      set: function(t) {
        this._textBaseline !== t && (this._textBaseline = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "trim", {
      /** Trim transparent borders. */
      get: function() {
        return this._trim;
      },
      set: function(t) {
        this._trim !== t && (this._trim = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "whiteSpace", {
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
       * @member {string}
       */
      get: function() {
        return this._whiteSpace;
      },
      set: function(t) {
        this._whiteSpace !== t && (this._whiteSpace = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "wordWrap", {
      /** Indicates if word wrap should be used. */
      get: function() {
        return this._wordWrap;
      },
      set: function(t) {
        this._wordWrap !== t && (this._wordWrap = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "wordWrapWidth", {
      /** The width at which text will wrap, it needs wordWrap to be set to true. */
      get: function() {
        return this._wordWrapWidth;
      },
      set: function(t) {
        this._wordWrapWidth !== t && (this._wordWrapWidth = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.toFontString = function() {
      var t = typeof this.fontSize == "number" ? this.fontSize + "px" : this.fontSize, e = this.fontFamily;
      Array.isArray(this.fontFamily) || (e = this.fontFamily.split(","));
      for (var i = e.length - 1; i >= 0; i--) {
        var n = e[i].trim();
        !/([\"\'])[^\'\"]+\1/.test(n) && b0.indexOf(n) < 0 && (n = '"' + n + '"'), e[i] = n;
      }
      return this.fontStyle + " " + this.fontVariant + " " + this.fontWeight + " " + t + " " + e.join(",");
    }, r;
  }()
);
function Tu(r) {
  return typeof r == "number" ? Dh(r) : (typeof r == "string" && r.indexOf("0x") === 0 && (r = r.replace("0x", "#")), r);
}
function pa(r) {
  if (Array.isArray(r)) {
    for (var t = 0; t < r.length; ++t)
      r[t] = Tu(r[t]);
    return r;
  } else
    return Tu(r);
}
function E0(r, t) {
  if (!Array.isArray(r) || !Array.isArray(t) || r.length !== t.length)
    return !1;
  for (var e = 0; e < r.length; ++e)
    if (r[e] !== t[e])
      return !1;
  return !0;
}
function va(r, t, e) {
  for (var i in e)
    Array.isArray(t[i]) ? r[i] = t[i].slice() : r[i] = t[i];
}
var Vi = {
  // TextMetrics requires getImageData readback for measuring fonts.
  willReadFrequently: !0
}, _e = (
  /** @class */
  function() {
    function r(t, e, i, n, a, o, s, u, h) {
      this.text = t, this.style = e, this.width = i, this.height = n, this.lines = a, this.lineWidths = o, this.lineHeight = s, this.maxLineWidth = u, this.fontProperties = h;
    }
    return r.measureText = function(t, e, i, n) {
      n === void 0 && (n = r._canvas), i = i ?? e.wordWrap;
      var a = e.toFontString(), o = r.measureFont(a);
      o.fontSize === 0 && (o.fontSize = e.fontSize, o.ascent = e.fontSize);
      var s = n.getContext("2d", Vi);
      s.font = a;
      for (var u = i ? r.wordWrap(t, e, n) : t, h = u.split(/(?:\r\n|\r|\n)/), l = new Array(h.length), f = 0, c = 0; c < h.length; c++) {
        var d = s.measureText(h[c]).width + (h[c].length - 1) * e.letterSpacing;
        l[c] = d, f = Math.max(f, d);
      }
      var p = f + e.strokeThickness;
      e.dropShadow && (p += e.dropShadowDistance);
      var _ = e.lineHeight || o.fontSize + e.strokeThickness, v = Math.max(_, o.fontSize + e.strokeThickness) + (h.length - 1) * (_ + e.leading);
      return e.dropShadow && (v += e.dropShadowDistance), new r(t, e, p, v, h, l, _ + e.leading, f, o);
    }, r.wordWrap = function(t, e, i) {
      i === void 0 && (i = r._canvas);
      for (var n = i.getContext("2d", Vi), a = 0, o = "", s = "", u = /* @__PURE__ */ Object.create(null), h = e.letterSpacing, l = e.whiteSpace, f = r.collapseSpaces(l), c = r.collapseNewlines(l), d = !f, p = e.wordWrapWidth + h, _ = r.tokenize(t), v = 0; v < _.length; v++) {
        var y = _[v];
        if (r.isNewline(y)) {
          if (!c) {
            s += r.addLine(o), d = !f, o = "", a = 0;
            continue;
          }
          y = " ";
        }
        if (f) {
          var g = r.isBreakingSpace(y), m = r.isBreakingSpace(o[o.length - 1]);
          if (g && m)
            continue;
        }
        var E = r.getFromCache(y, h, u, n);
        if (E > p)
          if (o !== "" && (s += r.addLine(o), o = "", a = 0), r.canBreakWords(y, e.breakWords))
            for (var b = r.wordWrapSplit(y), x = 0; x < b.length; x++) {
              for (var S = b[x], A = 1; b[x + A]; ) {
                var w = b[x + A], P = S[S.length - 1];
                if (!r.canBreakChars(P, w, y, x, e.breakWords))
                  S += w;
                else
                  break;
                A++;
              }
              x += S.length - 1;
              var O = r.getFromCache(S, h, u, n);
              O + a > p && (s += r.addLine(o), d = !1, o = "", a = 0), o += S, a += O;
            }
          else {
            o.length > 0 && (s += r.addLine(o), o = "", a = 0);
            var F = v === _.length - 1;
            s += r.addLine(y, !F), d = !1, o = "", a = 0;
          }
        else
          E + a > p && (d = !1, s += r.addLine(o), o = "", a = 0), (o.length > 0 || !r.isBreakingSpace(y) || d) && (o += y, a += E);
      }
      return s += r.addLine(o, !1), s;
    }, r.addLine = function(t, e) {
      return e === void 0 && (e = !0), t = r.trimRight(t), t = e ? t + `
` : t, t;
    }, r.getFromCache = function(t, e, i, n) {
      var a = i[t];
      if (typeof a != "number") {
        var o = t.length * e;
        a = n.measureText(t).width + o, i[t] = a;
      }
      return a;
    }, r.collapseSpaces = function(t) {
      return t === "normal" || t === "pre-line";
    }, r.collapseNewlines = function(t) {
      return t === "normal";
    }, r.trimRight = function(t) {
      if (typeof t != "string")
        return "";
      for (var e = t.length - 1; e >= 0; e--) {
        var i = t[e];
        if (!r.isBreakingSpace(i))
          break;
        t = t.slice(0, -1);
      }
      return t;
    }, r.isNewline = function(t) {
      return typeof t != "string" ? !1 : r._newlines.indexOf(t.charCodeAt(0)) >= 0;
    }, r.isBreakingSpace = function(t, e) {
      return typeof t != "string" ? !1 : r._breakingSpaces.indexOf(t.charCodeAt(0)) >= 0;
    }, r.tokenize = function(t) {
      var e = [], i = "";
      if (typeof t != "string")
        return e;
      for (var n = 0; n < t.length; n++) {
        var a = t[n], o = t[n + 1];
        if (r.isBreakingSpace(a, o) || r.isNewline(a)) {
          i !== "" && (e.push(i), i = ""), e.push(a);
          continue;
        }
        i += a;
      }
      return i !== "" && e.push(i), e;
    }, r.canBreakWords = function(t, e) {
      return e;
    }, r.canBreakChars = function(t, e, i, n, a) {
      return !0;
    }, r.wordWrapSplit = function(t) {
      return t.split("");
    }, r.measureFont = function(t) {
      if (r._fonts[t])
        return r._fonts[t];
      var e = {
        ascent: 0,
        descent: 0,
        fontSize: 0
      }, i = r._canvas, n = r._context;
      n.font = t;
      var a = r.METRICS_STRING + r.BASELINE_SYMBOL, o = Math.ceil(n.measureText(a).width), s = Math.ceil(n.measureText(r.BASELINE_SYMBOL).width), u = Math.ceil(r.HEIGHT_MULTIPLIER * s);
      s = s * r.BASELINE_MULTIPLIER | 0, i.width = o, i.height = u, n.fillStyle = "#f00", n.fillRect(0, 0, o, u), n.font = t, n.textBaseline = "alphabetic", n.fillStyle = "#000", n.fillText(a, 0, s);
      var h = n.getImageData(0, 0, o, u).data, l = h.length, f = o * 4, c = 0, d = 0, p = !1;
      for (c = 0; c < s; ++c) {
        for (var _ = 0; _ < f; _ += 4)
          if (h[d + _] !== 255) {
            p = !0;
            break;
          }
        if (!p)
          d += f;
        else
          break;
      }
      for (e.ascent = s - c, d = l - f, p = !1, c = u; c > s; --c) {
        for (var _ = 0; _ < f; _ += 4)
          if (h[d + _] !== 255) {
            p = !0;
            break;
          }
        if (!p)
          d -= f;
        else
          break;
      }
      return e.descent = c - s, e.fontSize = e.ascent + e.descent, r._fonts[t] = e, e;
    }, r.clearMetrics = function(t) {
      t === void 0 && (t = ""), t ? delete r._fonts[t] : r._fonts = {};
    }, Object.defineProperty(r, "_canvas", {
      /**
       * Cached canvas element for measuring text
       * TODO: this should be private, but isn't because of backward compat, will fix later.
       * @ignore
       */
      get: function() {
        if (!r.__canvas) {
          var t = void 0;
          try {
            var e = new OffscreenCanvas(0, 0), i = e.getContext("2d", Vi);
            if (i && i.measureText)
              return r.__canvas = e, e;
            t = k.ADAPTER.createCanvas();
          } catch {
            t = k.ADAPTER.createCanvas();
          }
          t.width = t.height = 10, r.__canvas = t;
        }
        return r.__canvas;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "_context", {
      /**
       * TODO: this should be private, but isn't because of backward compat, will fix later.
       * @ignore
       */
      get: function() {
        return r.__context || (r.__context = r._canvas.getContext("2d", Vi)), r.__context;
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
);
_e._fonts = {};
_e.METRICS_STRING = "|ÉqÅ";
_e.BASELINE_SYMBOL = "M";
_e.BASELINE_MULTIPLIER = 1.4;
_e.HEIGHT_MULTIPLIER = 2;
_e._newlines = [
  10,
  13
];
_e._breakingSpaces = [
  9,
  32,
  8192,
  8193,
  8194,
  8195,
  8196,
  8197,
  8198,
  8200,
  8201,
  8202,
  8287,
  12288
];
var T0 = {
  texture: !0,
  children: !1,
  baseTexture: !0
}, ll = (
  /** @class */
  function(r) {
    m0(t, r);
    function t(e, i, n) {
      var a = this, o = !1;
      n || (n = k.ADAPTER.createCanvas(), o = !0), n.width = 3, n.height = 3;
      var s = K.from(n);
      return s.orig = new st(), s.trim = new st(), a = r.call(this, s) || this, a._ownCanvas = o, a.canvas = n, a.context = n.getContext("2d", {
        // required for trimming to work without warnings
        willReadFrequently: !0
      }), a._resolution = k.RESOLUTION, a._autoResolution = !0, a._text = null, a._style = null, a._styleListener = null, a._font = "", a.text = e, a.style = i, a.localStyleID = -1, a;
    }
    return t.prototype.updateText = function(e) {
      var i = this._style;
      if (this.localStyleID !== i.styleID && (this.dirty = !0, this.localStyleID = i.styleID), !(!this.dirty && e)) {
        this._font = this._style.toFontString();
        var n = this.context, a = _e.measureText(this._text || " ", this._style, this._style.wordWrap, this.canvas), o = a.width, s = a.height, u = a.lines, h = a.lineHeight, l = a.lineWidths, f = a.maxLineWidth, c = a.fontProperties;
        this.canvas.width = Math.ceil(Math.ceil(Math.max(1, o) + i.padding * 2) * this._resolution), this.canvas.height = Math.ceil(Math.ceil(Math.max(1, s) + i.padding * 2) * this._resolution), n.scale(this._resolution, this._resolution), n.clearRect(0, 0, this.canvas.width, this.canvas.height), n.font = this._font, n.lineWidth = i.strokeThickness, n.textBaseline = i.textBaseline, n.lineJoin = i.lineJoin, n.miterLimit = i.miterLimit;
        for (var d, p, _ = i.dropShadow ? 2 : 1, v = 0; v < _; ++v) {
          var y = i.dropShadow && v === 0, g = y ? Math.ceil(Math.max(1, s) + i.padding * 2) : 0, m = g * this._resolution;
          if (y) {
            n.fillStyle = "black", n.strokeStyle = "black";
            var E = i.dropShadowColor, b = Dr(typeof E == "number" ? E : fn(E)), x = i.dropShadowBlur * this._resolution, S = i.dropShadowDistance * this._resolution;
            n.shadowColor = "rgba(" + b[0] * 255 + "," + b[1] * 255 + "," + b[2] * 255 + "," + i.dropShadowAlpha + ")", n.shadowBlur = x, n.shadowOffsetX = Math.cos(i.dropShadowAngle) * S, n.shadowOffsetY = Math.sin(i.dropShadowAngle) * S + m;
          } else
            n.fillStyle = this._generateFillStyle(i, u, a), n.strokeStyle = i.stroke, n.shadowColor = "black", n.shadowBlur = 0, n.shadowOffsetX = 0, n.shadowOffsetY = 0;
          var A = (h - c.fontSize) / 2;
          (!t.nextLineHeightBehavior || h - c.fontSize < 0) && (A = 0);
          for (var w = 0; w < u.length; w++)
            d = i.strokeThickness / 2, p = i.strokeThickness / 2 + w * h + c.ascent + A, i.align === "right" ? d += f - l[w] : i.align === "center" && (d += (f - l[w]) / 2), i.stroke && i.strokeThickness && this.drawLetterSpacing(u[w], d + i.padding, p + i.padding - g, !0), i.fill && this.drawLetterSpacing(u[w], d + i.padding, p + i.padding - g);
        }
        this.updateTexture();
      }
    }, t.prototype.drawLetterSpacing = function(e, i, n, a) {
      a === void 0 && (a = !1);
      var o = this._style, s = o.letterSpacing, u = t.experimentalLetterSpacing && ("letterSpacing" in CanvasRenderingContext2D.prototype || "textLetterSpacing" in CanvasRenderingContext2D.prototype);
      if (s === 0 || u) {
        u && (this.context.letterSpacing = s, this.context.textLetterSpacing = s), a ? this.context.strokeText(e, i, n) : this.context.fillText(e, i, n);
        return;
      }
      for (var h = i, l = Array.from ? Array.from(e) : e.split(""), f = this.context.measureText(e).width, c = 0, d = 0; d < l.length; ++d) {
        var p = l[d];
        a ? this.context.strokeText(p, h, n) : this.context.fillText(p, h, n);
        for (var _ = "", v = d + 1; v < l.length; ++v)
          _ += l[v];
        c = this.context.measureText(_).width, h += f - c + s, f = c;
      }
    }, t.prototype.updateTexture = function() {
      var e = this.canvas;
      if (this._style.trim) {
        var i = _y(e);
        i.data && (e.width = i.width, e.height = i.height, this.context.putImageData(i.data, 0, 0));
      }
      var n = this._texture, a = this._style, o = a.trim ? 0 : a.padding, s = n.baseTexture;
      n.trim.width = n._frame.width = e.width / this._resolution, n.trim.height = n._frame.height = e.height / this._resolution, n.trim.x = -o, n.trim.y = -o, n.orig.width = n._frame.width - o * 2, n.orig.height = n._frame.height - o * 2, this._onTextureUpdate(), s.setRealSize(e.width, e.height, this._resolution), n.updateUvs(), this.dirty = !1;
    }, t.prototype._render = function(e) {
      this._autoResolution && this._resolution !== e.resolution && (this._resolution = e.resolution, this.dirty = !0), this.updateText(!0), r.prototype._render.call(this, e);
    }, t.prototype.updateTransform = function() {
      this.updateText(!0), r.prototype.updateTransform.call(this);
    }, t.prototype.getBounds = function(e, i) {
      return this.updateText(!0), this._textureID === -1 && (e = !1), r.prototype.getBounds.call(this, e, i);
    }, t.prototype.getLocalBounds = function(e) {
      return this.updateText(!0), r.prototype.getLocalBounds.call(this, e);
    }, t.prototype._calculateBounds = function() {
      this.calculateVertices(), this._bounds.addQuad(this.vertexData);
    }, t.prototype._generateFillStyle = function(e, i, n) {
      var a = e.fill;
      if (Array.isArray(a)) {
        if (a.length === 1)
          return a[0];
      } else
        return a;
      var o, s = e.dropShadow ? e.dropShadowDistance : 0, u = e.padding || 0, h = this.canvas.width / this._resolution - s - u * 2, l = this.canvas.height / this._resolution - s - u * 2, f = a.slice(), c = e.fillGradientStops.slice();
      if (!c.length)
        for (var d = f.length + 1, p = 1; p < d; ++p)
          c.push(p / d);
      if (f.unshift(a[0]), c.unshift(0), f.push(a[a.length - 1]), c.push(1), e.fillGradientType === ui.LINEAR_VERTICAL) {
        o = this.context.createLinearGradient(h / 2, u, h / 2, l + u);
        for (var _ = n.fontProperties.fontSize + e.strokeThickness, p = 0; p < i.length; p++) {
          var v = n.lineHeight * (p - 1) + _, y = n.lineHeight * p, g = y;
          p > 0 && v > y && (g = (y + v) / 2);
          var m = y + _, E = n.lineHeight * (p + 1), b = m;
          p + 1 < i.length && E < m && (b = (m + E) / 2);
          for (var x = (b - g) / l, S = 0; S < f.length; S++) {
            var A = 0;
            typeof c[S] == "number" ? A = c[S] : A = S / f.length;
            var w = Math.min(1, Math.max(0, g / l + A * x));
            w = Number(w.toFixed(5)), o.addColorStop(w, f[S]);
          }
        }
      } else {
        o = this.context.createLinearGradient(u, l / 2, h + u, l / 2);
        for (var P = f.length + 1, O = 1, p = 0; p < f.length; p++) {
          var F = void 0;
          typeof c[p] == "number" ? F = c[p] : F = O / P, o.addColorStop(F, f[p]), O++;
        }
      }
      return o;
    }, t.prototype.destroy = function(e) {
      typeof e == "boolean" && (e = { children: e }), e = Object.assign({}, T0, e), r.prototype.destroy.call(this, e), this._ownCanvas && (this.canvas.height = this.canvas.width = 0), this.context = null, this.canvas = null, this._style = null;
    }, Object.defineProperty(t.prototype, "width", {
      /** The width of the Text, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return this.updateText(!0), Math.abs(this.scale.x) * this._texture.orig.width;
      },
      set: function(e) {
        this.updateText(!0);
        var i = xr(this.scale.x) || 1;
        this.scale.x = i * e / this._texture.orig.width, this._width = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "height", {
      /** The height of the Text, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return this.updateText(!0), Math.abs(this.scale.y) * this._texture.orig.height;
      },
      set: function(e) {
        this.updateText(!0);
        var i = xr(this.scale.y) || 1;
        this.scale.y = i * e / this._texture.orig.height, this._height = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "style", {
      /**
       * Set the style of the text.
       *
       * Set up an event listener to listen for changes on the style object and mark the text as dirty.
       */
      get: function() {
        return this._style;
      },
      set: function(e) {
        e = e || {}, e instanceof Fr ? this._style = e : this._style = new Fr(e), this.localStyleID = -1, this.dirty = !0;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "text", {
      /** Set the copy for the text object. To split a line you can use '\n'. */
      get: function() {
        return this._text;
      },
      set: function(e) {
        e = String(e ?? ""), this._text !== e && (this._text = e, this.dirty = !0);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "resolution", {
      /**
       * The resolution / device pixel ratio of the canvas.
       *
       * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
       * @default 1
       */
      get: function() {
        return this._resolution;
      },
      set: function(e) {
        this._autoResolution = !1, this._resolution !== e && (this._resolution = e, this.dirty = !0);
      },
      enumerable: !1,
      configurable: !0
    }), t.nextLineHeightBehavior = !1, t.experimentalLetterSpacing = !1, t;
  }(_i)
);
/*!
 * @pixi/prepare - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/prepare is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
k.UPLOADS_PER_FRAME = 4;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var no = function(r, t) {
  return no = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, no(r, t);
};
function x0(r, t) {
  no(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
var w0 = (
  /** @class */
  function() {
    function r(t) {
      this.maxItemsPerFrame = t, this.itemsLeft = 0;
    }
    return r.prototype.beginFrame = function() {
      this.itemsLeft = this.maxItemsPerFrame;
    }, r.prototype.allowedToUpload = function() {
      return this.itemsLeft-- > 0;
    }, r;
  }()
);
function S0(r, t) {
  var e = !1;
  if (r && r._textures && r._textures.length) {
    for (var i = 0; i < r._textures.length; i++)
      if (r._textures[i] instanceof K) {
        var n = r._textures[i].baseTexture;
        t.indexOf(n) === -1 && (t.push(n), e = !0);
      }
  }
  return e;
}
function P0(r, t) {
  if (r.baseTexture instanceof ot) {
    var e = r.baseTexture;
    return t.indexOf(e) === -1 && t.push(e), !0;
  }
  return !1;
}
function A0(r, t) {
  if (r._texture && r._texture instanceof K) {
    var e = r._texture.baseTexture;
    return t.indexOf(e) === -1 && t.push(e), !0;
  }
  return !1;
}
function R0(r, t) {
  return t instanceof ll ? (t.updateText(!0), !0) : !1;
}
function O0(r, t) {
  if (t instanceof Fr) {
    var e = t.toFontString();
    return _e.measureFont(e), !0;
  }
  return !1;
}
function I0(r, t) {
  if (r instanceof ll) {
    t.indexOf(r.style) === -1 && t.push(r.style), t.indexOf(r) === -1 && t.push(r);
    var e = r._texture.baseTexture;
    return t.indexOf(e) === -1 && t.push(e), !0;
  }
  return !1;
}
function C0(r, t) {
  return r instanceof Fr ? (t.indexOf(r) === -1 && t.push(r), !0) : !1;
}
var M0 = (
  /** @class */
  function() {
    function r(t) {
      var e = this;
      this.limiter = new w0(k.UPLOADS_PER_FRAME), this.renderer = t, this.uploadHookHelper = null, this.queue = [], this.addHooks = [], this.uploadHooks = [], this.completes = [], this.ticking = !1, this.delayedTick = function() {
        e.queue && e.prepareItems();
      }, this.registerFindHook(I0), this.registerFindHook(C0), this.registerFindHook(S0), this.registerFindHook(P0), this.registerFindHook(A0), this.registerUploadHook(R0), this.registerUploadHook(O0);
    }
    return r.prototype.upload = function(t, e) {
      var i = this;
      return typeof t == "function" && (e = t, t = null), e && ae("6.5.0", "BasePrepare.upload callback is deprecated, use the return Promise instead."), new Promise(function(n) {
        t && i.add(t);
        var a = function() {
          e == null || e(), n();
        };
        i.queue.length ? (i.completes.push(a), i.ticking || (i.ticking = !0, Lt.system.addOnce(i.tick, i, we.UTILITY))) : a();
      });
    }, r.prototype.tick = function() {
      setTimeout(this.delayedTick, 0);
    }, r.prototype.prepareItems = function() {
      for (this.limiter.beginFrame(); this.queue.length && this.limiter.allowedToUpload(); ) {
        var t = this.queue[0], e = !1;
        if (t && !t._destroyed) {
          for (var i = 0, n = this.uploadHooks.length; i < n; i++)
            if (this.uploadHooks[i](this.uploadHookHelper, t)) {
              this.queue.shift(), e = !0;
              break;
            }
        }
        e || this.queue.shift();
      }
      if (this.queue.length)
        Lt.system.addOnce(this.tick, this, we.UTILITY);
      else {
        this.ticking = !1;
        var a = this.completes.slice(0);
        this.completes.length = 0;
        for (var i = 0, n = a.length; i < n; i++)
          a[i]();
      }
    }, r.prototype.registerFindHook = function(t) {
      return t && this.addHooks.push(t), this;
    }, r.prototype.registerUploadHook = function(t) {
      return t && this.uploadHooks.push(t), this;
    }, r.prototype.add = function(t) {
      for (var e = 0, i = this.addHooks.length; e < i && !this.addHooks[e](t, this.queue); e++)
        ;
      if (t instanceof ve)
        for (var e = t.children.length - 1; e >= 0; e--)
          this.add(t.children[e]);
      return this;
    }, r.prototype.destroy = function() {
      this.ticking && Lt.system.remove(this.tick, this), this.ticking = !1, this.addHooks = null, this.uploadHooks = null, this.renderer = null, this.completes = null, this.queue = null, this.limiter = null, this.uploadHookHelper = null;
    }, r;
  }()
);
function fl(r, t) {
  return t instanceof ot ? (t._glTextures[r.CONTEXT_UID] || r.texture.bind(t), !0) : !1;
}
function D0(r, t) {
  if (!(t instanceof sr))
    return !1;
  var e = t.geometry;
  t.finishPoly(), e.updateBatches();
  for (var i = e.batches, n = 0; n < i.length; n++) {
    var a = i[n].style.texture;
    a && fl(r, a.baseTexture);
  }
  return e.batchable || r.geometry.bind(e, t._resolveDirectShader(r)), !0;
}
function F0(r, t) {
  return r instanceof sr ? (t.push(r), !0) : !1;
}
var N0 = (
  /** @class */
  function(r) {
    x0(t, r);
    function t(e) {
      var i = r.call(this, e) || this;
      return i.uploadHookHelper = i.renderer, i.registerFindHook(F0), i.registerUploadHook(fl), i.registerUploadHook(D0), i;
    }
    return t.extension = {
      name: "prepare",
      type: vt.RendererPlugin
    }, t;
  }(M0)
);
/*!
 * @pixi/spritesheet - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/spritesheet is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var B0 = (
  /** @class */
  function() {
    function r(t, e, i) {
      i === void 0 && (i = null), this.linkedSheets = [], this._texture = t instanceof K ? t : null, this.baseTexture = t instanceof ot ? t : this._texture.baseTexture, this.textures = {}, this.animations = {}, this.data = e;
      var n = this.baseTexture.resource;
      this.resolution = this._updateResolution(i || (n ? n.url : null)), this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
    }
    return r.prototype._updateResolution = function(t) {
      t === void 0 && (t = null);
      var e = this.data.meta.scale, i = dn(t, null);
      return i === null && (i = e !== void 0 ? parseFloat(e) : 1), i !== 1 && this.baseTexture.setResolution(i), i;
    }, r.prototype.parse = function(t) {
      var e = this;
      return t && ae("6.5.0", "Spritesheet.parse callback is deprecated, use the return Promise instead."), new Promise(function(i) {
        e._callback = function(n) {
          t == null || t(n), i(n);
        }, e._batchIndex = 0, e._frameKeys.length <= r.BATCH_SIZE ? (e._processFrames(0), e._processAnimations(), e._parseComplete()) : e._nextBatch();
      });
    }, r.prototype._processFrames = function(t) {
      for (var e = t, i = r.BATCH_SIZE; e - t < i && e < this._frameKeys.length; ) {
        var n = this._frameKeys[e], a = this._frames[n], o = a.frame;
        if (o) {
          var s = null, u = null, h = a.trimmed !== !1 && a.sourceSize ? a.sourceSize : a.frame, l = new st(0, 0, Math.floor(h.w) / this.resolution, Math.floor(h.h) / this.resolution);
          a.rotated ? s = new st(Math.floor(o.x) / this.resolution, Math.floor(o.y) / this.resolution, Math.floor(o.h) / this.resolution, Math.floor(o.w) / this.resolution) : s = new st(Math.floor(o.x) / this.resolution, Math.floor(o.y) / this.resolution, Math.floor(o.w) / this.resolution, Math.floor(o.h) / this.resolution), a.trimmed !== !1 && a.spriteSourceSize && (u = new st(Math.floor(a.spriteSourceSize.x) / this.resolution, Math.floor(a.spriteSourceSize.y) / this.resolution, Math.floor(o.w) / this.resolution, Math.floor(o.h) / this.resolution)), this.textures[n] = new K(this.baseTexture, s, l, u, a.rotated ? 2 : 0, a.anchor), K.addToCache(this.textures[n], n);
        }
        e++;
      }
    }, r.prototype._processAnimations = function() {
      var t = this.data.animations || {};
      for (var e in t) {
        this.animations[e] = [];
        for (var i = 0; i < t[e].length; i++) {
          var n = t[e][i];
          this.animations[e].push(this.textures[n]);
        }
      }
    }, r.prototype._parseComplete = function() {
      var t = this._callback;
      this._callback = null, this._batchIndex = 0, t.call(this, this.textures);
    }, r.prototype._nextBatch = function() {
      var t = this;
      this._processFrames(this._batchIndex * r.BATCH_SIZE), this._batchIndex++, setTimeout(function() {
        t._batchIndex * r.BATCH_SIZE < t._frameKeys.length ? t._nextBatch() : (t._processAnimations(), t._parseComplete());
      }, 0);
    }, r.prototype.destroy = function(t) {
      var e;
      t === void 0 && (t = !1);
      for (var i in this.textures)
        this.textures[i].destroy();
      this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, t && ((e = this._texture) === null || e === void 0 || e.destroy(), this.baseTexture.destroy()), this._texture = null, this.baseTexture = null, this.linkedSheets = [];
    }, r.BATCH_SIZE = 1e3, r;
  }()
), L0 = (
  /** @class */
  function() {
    function r() {
    }
    return r.use = function(t, e) {
      var i, n, a = this, o = t.name + "_image";
      if (!t.data || t.type !== Pt.TYPE.JSON || !t.data.frames || a.resources[o]) {
        e();
        return;
      }
      var s = (n = (i = t.data) === null || i === void 0 ? void 0 : i.meta) === null || n === void 0 ? void 0 : n.related_multi_packs;
      if (Array.isArray(s))
        for (var u = function(p) {
          if (typeof p != "string")
            return "continue";
          var _ = p.replace(".json", ""), v = Tr.resolve(t.url.replace(a.baseUrl, ""), p);
          if (a.resources[_] || Object.values(a.resources).some(function(g) {
            return Tr.format(Tr.parse(g.url)) === v;
          }))
            return "continue";
          var y = {
            crossOrigin: t.crossOrigin,
            loadType: Pt.LOAD_TYPE.XHR,
            xhrType: Pt.XHR_RESPONSE_TYPE.JSON,
            parentResource: t,
            metadata: t.metadata
          };
          a.add(_, v, y);
        }, h = 0, l = s; h < l.length; h++) {
          var f = l[h];
          u(f);
        }
      var c = {
        crossOrigin: t.crossOrigin,
        metadata: t.metadata.imageMetadata,
        parentResource: t
      }, d = r.getResourcePath(t, a.baseUrl);
      a.add(o, d, c, function(_) {
        if (_.error) {
          e(_.error);
          return;
        }
        var v = new B0(_.texture, t.data, t.url);
        v.parse().then(function() {
          t.spritesheet = v, t.textures = v.textures, e();
        });
      });
    }, r.getResourcePath = function(t, e) {
      return t.isDataUrl ? t.data.meta.image : Tr.resolve(t.url.replace(e, ""), t.data.meta.image);
    }, r.extension = vt.Loader, r;
  }()
);
/*!
 * @pixi/sprite-tiling - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/sprite-tiling is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var ao = function(r, t) {
  return ao = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, ao(r, t);
};
function cl(r, t) {
  ao(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
var Vr = new gt();
(function(r) {
  cl(t, r);
  function t(e, i, n) {
    i === void 0 && (i = 100), n === void 0 && (n = 100);
    var a = r.call(this, e) || this;
    return a.tileTransform = new Gh(), a._width = i, a._height = n, a.uvMatrix = a.texture.uvMatrix || new Uo(e), a.pluginName = "tilingSprite", a.uvRespectAnchor = !1, a;
  }
  return Object.defineProperty(t.prototype, "clampMargin", {
    /**
     * Changes frame clamping in corresponding textureTransform, shortcut
     * Change to -0.5 to add a pixel to the edge, recommended for transparent trimmed textures in atlas
     * @default 0.5
     * @member {number}
     */
    get: function() {
      return this.uvMatrix.clampMargin;
    },
    set: function(e) {
      this.uvMatrix.clampMargin = e, this.uvMatrix.update(!0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "tileScale", {
    /** The scaling of the image that is being tiled. */
    get: function() {
      return this.tileTransform.scale;
    },
    set: function(e) {
      this.tileTransform.scale.copyFrom(e);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "tilePosition", {
    /** The offset of the image that is being tiled. */
    get: function() {
      return this.tileTransform.position;
    },
    set: function(e) {
      this.tileTransform.position.copyFrom(e);
    },
    enumerable: !1,
    configurable: !0
  }), t.prototype._onTextureUpdate = function() {
    this.uvMatrix && (this.uvMatrix.texture = this._texture), this._cachedTint = 16777215;
  }, t.prototype._render = function(e) {
    var i = this._texture;
    !i || !i.valid || (this.tileTransform.updateLocalTransform(), this.uvMatrix.update(), e.batch.setObjectRenderer(e.plugins[this.pluginName]), e.plugins[this.pluginName].render(this));
  }, t.prototype._calculateBounds = function() {
    var e = this._width * -this._anchor._x, i = this._height * -this._anchor._y, n = this._width * (1 - this._anchor._x), a = this._height * (1 - this._anchor._y);
    this._bounds.addFrame(this.transform, e, i, n, a);
  }, t.prototype.getLocalBounds = function(e) {
    return this.children.length === 0 ? (this._bounds.minX = this._width * -this._anchor._x, this._bounds.minY = this._height * -this._anchor._y, this._bounds.maxX = this._width * (1 - this._anchor._x), this._bounds.maxY = this._height * (1 - this._anchor._y), e || (this._localBoundsRect || (this._localBoundsRect = new st()), e = this._localBoundsRect), this._bounds.getRectangle(e)) : r.prototype.getLocalBounds.call(this, e);
  }, t.prototype.containsPoint = function(e) {
    this.worldTransform.applyInverse(e, Vr);
    var i = this._width, n = this._height, a = -i * this.anchor._x;
    if (Vr.x >= a && Vr.x < a + i) {
      var o = -n * this.anchor._y;
      if (Vr.y >= o && Vr.y < o + n)
        return !0;
    }
    return !1;
  }, t.prototype.destroy = function(e) {
    r.prototype.destroy.call(this, e), this.tileTransform = null, this.uvMatrix = null;
  }, t.from = function(e, i) {
    var n = e instanceof K ? e : K.from(e, i);
    return new t(n, i.width, i.height);
  }, Object.defineProperty(t.prototype, "width", {
    /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
    get: function() {
      return this._width;
    },
    set: function(e) {
      this._width = e;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "height", {
    /** The height of the TilingSprite, setting this will actually modify the scale to achieve the value set. */
    get: function() {
      return this._height;
    },
    set: function(e) {
      this._height = e;
    },
    enumerable: !1,
    configurable: !0
  }), t;
})(_i);
var U0 = `#version 100
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
`, xu = `#version 100
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
`, G0 = `#version 100
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
`, k0 = `#version 300 es
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
`, H0 = `#version 300 es
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
`, zi = new It(), X0 = (
  /** @class */
  function(r) {
    cl(t, r);
    function t(e) {
      var i = r.call(this, e) || this;
      return e.runners.contextChange.add(i), i.quad = new Wh(), i.state = lr.for2d(), i;
    }
    return t.prototype.contextChange = function() {
      var e = this.renderer, i = { globals: e.globalUniforms };
      this.simpleShader = Fe.from(xu, U0, i), this.shader = e.context.webGLVersion > 1 ? Fe.from(k0, H0, i) : Fe.from(xu, G0, i);
    }, t.prototype.render = function(e) {
      var i = this.renderer, n = this.quad, a = n.vertices;
      a[0] = a[6] = e._width * -e.anchor.x, a[1] = a[3] = e._height * -e.anchor.y, a[2] = a[4] = e._width * (1 - e.anchor.x), a[5] = a[7] = e._height * (1 - e.anchor.y);
      var o = e.uvRespectAnchor ? e.anchor.x : 0, s = e.uvRespectAnchor ? e.anchor.y : 0;
      a = n.uvs, a[0] = a[6] = -o, a[1] = a[3] = -s, a[2] = a[4] = 1 - o, a[5] = a[7] = 1 - s, n.invalidate();
      var u = e._texture, h = u.baseTexture, l = h.alphaMode > 0, f = e.tileTransform.localTransform, c = e.uvMatrix, d = h.isPowerOfTwo && u.frame.width === h.width && u.frame.height === h.height;
      d && (h._glTextures[i.CONTEXT_UID] ? d = h.wrapMode !== de.CLAMP : h.wrapMode === de.CLAMP && (h.wrapMode = de.REPEAT));
      var p = d ? this.simpleShader : this.shader, _ = u.width, v = u.height, y = e._width, g = e._height;
      zi.set(f.a * _ / y, f.b * _ / g, f.c * v / y, f.d * v / g, f.tx / y, f.ty / g), zi.invert(), d ? zi.prepend(c.mapCoord) : (p.uniforms.uMapCoord = c.mapCoord.toArray(!0), p.uniforms.uClampFrame = c.uClampFrame, p.uniforms.uClampOffset = c.uClampOffset), p.uniforms.uTransform = zi.toArray(!0), p.uniforms.uColor = Bh(e.tint, e.worldAlpha, p.uniforms.uColor, l), p.uniforms.translationMatrix = e.transform.worldTransform.toArray(!0), p.uniforms.uSampler = u, i.shader.bind(p), i.geometry.bind(n), this.state.blendMode = Nh(e.blendMode, l), i.state.set(this.state), i.geometry.draw(this.renderer.gl.TRIANGLES, 6, 0);
    }, t.extension = {
      name: "tilingSprite",
      type: vt.RendererPlugin
    }, t;
  }(Pn)
);
/*!
 * @pixi/mesh - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/mesh is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var oo = function(r, t) {
  return oo = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, oo(r, t);
};
function ko(r, t) {
  oo(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
var j0 = (
  /** @class */
  function() {
    function r(t, e) {
      this.uvBuffer = t, this.uvMatrix = e, this.data = null, this._bufferUpdateId = -1, this._textureUpdateId = -1, this._updateID = 0;
    }
    return r.prototype.update = function(t) {
      if (!(!t && this._bufferUpdateId === this.uvBuffer._updateID && this._textureUpdateId === this.uvMatrix._updateID)) {
        this._bufferUpdateId = this.uvBuffer._updateID, this._textureUpdateId = this.uvMatrix._updateID;
        var e = this.uvBuffer.data;
        (!this.data || this.data.length !== e.length) && (this.data = new Float32Array(e.length)), this.uvMatrix.multiplyUvs(e, this.data), this._updateID++;
      }
    }, r;
  }()
), _a = new gt(), wu = new Qi(), hi = (
  /** @class */
  function(r) {
    ko(t, r);
    function t(e, i, n, a) {
      a === void 0 && (a = ie.TRIANGLES);
      var o = r.call(this) || this;
      return o.geometry = e, o.shader = i, o.state = n || lr.for2d(), o.drawMode = a, o.start = 0, o.size = 0, o.uvs = null, o.indices = null, o.vertexData = new Float32Array(1), o.vertexDirty = -1, o._transformID = -1, o._roundPixels = k.ROUND_PIXELS, o.batchUvs = null, o;
    }
    return Object.defineProperty(t.prototype, "geometry", {
      /**
       * Includes vertex positions, face indices, normals, colors, UVs, and
       * custom attributes within buffers, reducing the cost of passing all
       * this data to the GPU. Can be shared between multiple Mesh objects.
       */
      get: function() {
        return this._geometry;
      },
      set: function(e) {
        this._geometry !== e && (this._geometry && (this._geometry.refCount--, this._geometry.refCount === 0 && this._geometry.dispose()), this._geometry = e, this._geometry && this._geometry.refCount++, this.vertexDirty = -1);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "uvBuffer", {
      /**
       * To change mesh uv's, change its uvBuffer data and increment its _updateID.
       * @readonly
       */
      get: function() {
        return this.geometry.buffers[1];
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "verticesBuffer", {
      /**
       * To change mesh vertices, change its uvBuffer data and increment its _updateID.
       * Incrementing _updateID is optional because most of Mesh objects do it anyway.
       * @readonly
       */
      get: function() {
        return this.geometry.buffers[0];
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "material", {
      get: function() {
        return this.shader;
      },
      /** Alias for {@link PIXI.Mesh#shader}. */
      set: function(e) {
        this.shader = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "blendMode", {
      get: function() {
        return this.state.blendMode;
      },
      /**
       * The blend mode to be applied to the Mesh. Apply a value of
       * `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
       * @default PIXI.BLEND_MODES.NORMAL;
       */
      set: function(e) {
        this.state.blendMode = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "roundPixels", {
      get: function() {
        return this._roundPixels;
      },
      /**
       * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
       * Advantages can include sharper image quality (like text) and faster rendering on canvas.
       * The main disadvantage is movement of objects may appear less smooth.
       * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}
       * @default false
       */
      set: function(e) {
        this._roundPixels !== e && (this._transformID = -1), this._roundPixels = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "tint", {
      /**
       * The multiply tint applied to the Mesh. This is a hex value. A value of
       * `0xFFFFFF` will remove any tint effect.
       *
       * Null for non-MeshMaterial shaders
       * @default 0xFFFFFF
       */
      get: function() {
        return "tint" in this.shader ? this.shader.tint : null;
      },
      set: function(e) {
        this.shader.tint = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "texture", {
      /** The texture that the Mesh uses. Null for non-MeshMaterial shaders */
      get: function() {
        return "texture" in this.shader ? this.shader.texture : null;
      },
      set: function(e) {
        this.shader.texture = e;
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype._render = function(e) {
      var i = this.geometry.buffers[0].data, n = this.shader;
      n.batchable && this.drawMode === ie.TRIANGLES && i.length < t.BATCHABLE_SIZE * 2 ? this._renderToBatch(e) : this._renderDefault(e);
    }, t.prototype._renderDefault = function(e) {
      var i = this.shader;
      i.alpha = this.worldAlpha, i.update && i.update(), e.batch.flush(), i.uniforms.translationMatrix = this.transform.worldTransform.toArray(!0), e.shader.bind(i), e.state.set(this.state), e.geometry.bind(this.geometry, i), e.geometry.draw(this.drawMode, this.size, this.start, this.geometry.instanceCount);
    }, t.prototype._renderToBatch = function(e) {
      var i = this.geometry, n = this.shader;
      n.uvMatrix && (n.uvMatrix.update(), this.calculateUvs()), this.calculateVertices(), this.indices = i.indexBuffer.data, this._tintRGB = n._tintRGB, this._texture = n.texture;
      var a = this.material.pluginName;
      e.batch.setObjectRenderer(e.plugins[a]), e.plugins[a].render(this);
    }, t.prototype.calculateVertices = function() {
      var e = this.geometry, i = e.buffers[0], n = i.data, a = i._updateID;
      if (!(a === this.vertexDirty && this._transformID === this.transform._worldID)) {
        this._transformID = this.transform._worldID, this.vertexData.length !== n.length && (this.vertexData = new Float32Array(n.length));
        for (var o = this.transform.worldTransform, s = o.a, u = o.b, h = o.c, l = o.d, f = o.tx, c = o.ty, d = this.vertexData, p = 0; p < d.length / 2; p++) {
          var _ = n[p * 2], v = n[p * 2 + 1];
          d[p * 2] = s * _ + h * v + f, d[p * 2 + 1] = u * _ + l * v + c;
        }
        if (this._roundPixels)
          for (var y = k.RESOLUTION, p = 0; p < d.length; ++p)
            d[p] = Math.round((d[p] * y | 0) / y);
        this.vertexDirty = a;
      }
    }, t.prototype.calculateUvs = function() {
      var e = this.geometry.buffers[1], i = this.shader;
      i.uvMatrix.isSimple ? this.uvs = e.data : (this.batchUvs || (this.batchUvs = new j0(e, i.uvMatrix)), this.batchUvs.update(), this.uvs = this.batchUvs.data);
    }, t.prototype._calculateBounds = function() {
      this.calculateVertices(), this._bounds.addVertexData(this.vertexData, 0, this.vertexData.length);
    }, t.prototype.containsPoint = function(e) {
      if (!this.getBounds().contains(e.x, e.y))
        return !1;
      this.worldTransform.applyInverse(e, _a);
      for (var i = this.geometry.getBuffer("aVertexPosition").data, n = wu.points, a = this.geometry.getIndex().data, o = a.length, s = this.drawMode === 4 ? 3 : 1, u = 0; u + 2 < o; u += s) {
        var h = a[u] * 2, l = a[u + 1] * 2, f = a[u + 2] * 2;
        if (n[0] = i[h], n[1] = i[h + 1], n[2] = i[l], n[3] = i[l + 1], n[4] = i[f], n[5] = i[f + 1], wu.contains(_a.x, _a.y))
          return !0;
      }
      return !1;
    }, t.prototype.destroy = function(e) {
      r.prototype.destroy.call(this, e), this._cachedTexture && (this._cachedTexture.destroy(), this._cachedTexture = null), this.geometry = null, this.shader = null, this.state = null, this.uvs = null, this.indices = null, this.vertexData = null;
    }, t.BATCHABLE_SIZE = 100, t;
  }(ve)
), V0 = `varying vec2 vTextureCoord;
uniform vec4 uColor;

uniform sampler2D uSampler;

void main(void)
{
    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;
}
`, z0 = `attribute vec2 aVertexPosition;
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
`, li = (
  /** @class */
  function(r) {
    ko(t, r);
    function t(e, i) {
      var n = this, a = {
        uSampler: e,
        alpha: 1,
        uTextureMatrix: It.IDENTITY,
        uColor: new Float32Array([1, 1, 1, 1])
      };
      return i = Object.assign({
        tint: 16777215,
        alpha: 1,
        pluginName: "batch"
      }, i), i.uniforms && Object.assign(a, i.uniforms), n = r.call(this, i.program || vi.from(z0, V0), a) || this, n._colorDirty = !1, n.uvMatrix = new Uo(e), n.batchable = i.program === void 0, n.pluginName = i.pluginName, n.tint = i.tint, n.alpha = i.alpha, n;
    }
    return Object.defineProperty(t.prototype, "texture", {
      /** Reference to the texture being rendered. */
      get: function() {
        return this.uniforms.uSampler;
      },
      set: function(e) {
        this.uniforms.uSampler !== e && (!this.uniforms.uSampler.baseTexture.alphaMode != !e.baseTexture.alphaMode && (this._colorDirty = !0), this.uniforms.uSampler = e, this.uvMatrix.texture = e);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "alpha", {
      get: function() {
        return this._alpha;
      },
      /**
       * This gets automatically set by the object using this.
       * @default 1
       */
      set: function(e) {
        e !== this._alpha && (this._alpha = e, this._colorDirty = !0);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "tint", {
      get: function() {
        return this._tint;
      },
      /**
       * Multiply tint for the material.
       * @default 0xFFFFFF
       */
      set: function(e) {
        e !== this._tint && (this._tint = e, this._tintRGB = (e >> 16) + (e & 65280) + ((e & 255) << 16), this._colorDirty = !0);
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.update = function() {
      if (this._colorDirty) {
        this._colorDirty = !1;
        var e = this.texture.baseTexture;
        Bh(this._tint, this._alpha, this.uniforms.uColor, e.alphaMode);
      }
      this.uvMatrix.update() && (this.uniforms.uTextureMatrix = this.uvMatrix.mapCoord);
    }, t;
  }(Fe)
), An = (
  /** @class */
  function(r) {
    ko(t, r);
    function t(e, i, n) {
      var a = r.call(this) || this, o = new Ot(e), s = new Ot(i, !0), u = new Ot(n, !0, !0);
      return a.addAttribute("aVertexPosition", o, 2, !1, V.FLOAT).addAttribute("aTextureCoord", s, 2, !1, V.FLOAT).addIndex(u), a._updateId = -1, a;
    }
    return Object.defineProperty(t.prototype, "vertexDirtyId", {
      /**
       * If the vertex position is updated.
       * @readonly
       * @private
       */
      get: function() {
        return this.buffers[0]._updateID;
      },
      enumerable: !1,
      configurable: !0
    }), t;
  }(pi)
);
/*!
 * @pixi/text-bitmap - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/text-bitmap is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var so = function(r, t) {
  return so = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, so(r, t);
};
function W0(r, t) {
  so(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
var mn = (
  /** @class */
  function() {
    function r() {
      this.info = [], this.common = [], this.page = [], this.char = [], this.kerning = [], this.distanceField = [];
    }
    return r;
  }()
), Y0 = (
  /** @class */
  function() {
    function r() {
    }
    return r.test = function(t) {
      return typeof t == "string" && t.indexOf("info face=") === 0;
    }, r.parse = function(t) {
      var e = t.match(/^[a-z]+\s+.+$/gm), i = {
        info: [],
        common: [],
        page: [],
        char: [],
        chars: [],
        kerning: [],
        kernings: [],
        distanceField: []
      };
      for (var n in e) {
        var a = e[n].match(/^[a-z]+/gm)[0], o = e[n].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm), s = {};
        for (var u in o) {
          var h = o[u].split("="), l = h[0], f = h[1].replace(/"/gm, ""), c = parseFloat(f), d = isNaN(c) ? f : c;
          s[l] = d;
        }
        i[a].push(s);
      }
      var p = new mn();
      return i.info.forEach(function(_) {
        return p.info.push({
          face: _.face,
          size: parseInt(_.size, 10)
        });
      }), i.common.forEach(function(_) {
        return p.common.push({
          lineHeight: parseInt(_.lineHeight, 10)
        });
      }), i.page.forEach(function(_) {
        return p.page.push({
          id: parseInt(_.id, 10),
          file: _.file
        });
      }), i.char.forEach(function(_) {
        return p.char.push({
          id: parseInt(_.id, 10),
          page: parseInt(_.page, 10),
          x: parseInt(_.x, 10),
          y: parseInt(_.y, 10),
          width: parseInt(_.width, 10),
          height: parseInt(_.height, 10),
          xoffset: parseInt(_.xoffset, 10),
          yoffset: parseInt(_.yoffset, 10),
          xadvance: parseInt(_.xadvance, 10)
        });
      }), i.kerning.forEach(function(_) {
        return p.kerning.push({
          first: parseInt(_.first, 10),
          second: parseInt(_.second, 10),
          amount: parseInt(_.amount, 10)
        });
      }), i.distanceField.forEach(function(_) {
        return p.distanceField.push({
          distanceRange: parseInt(_.distanceRange, 10),
          fieldType: _.fieldType
        });
      }), p;
    }, r;
  }()
), uo = (
  /** @class */
  function() {
    function r() {
    }
    return r.test = function(t) {
      return t instanceof XMLDocument && t.getElementsByTagName("page").length && t.getElementsByTagName("info")[0].getAttribute("face") !== null;
    }, r.parse = function(t) {
      for (var e = new mn(), i = t.getElementsByTagName("info"), n = t.getElementsByTagName("common"), a = t.getElementsByTagName("page"), o = t.getElementsByTagName("char"), s = t.getElementsByTagName("kerning"), u = t.getElementsByTagName("distanceField"), h = 0; h < i.length; h++)
        e.info.push({
          face: i[h].getAttribute("face"),
          size: parseInt(i[h].getAttribute("size"), 10)
        });
      for (var h = 0; h < n.length; h++)
        e.common.push({
          lineHeight: parseInt(n[h].getAttribute("lineHeight"), 10)
        });
      for (var h = 0; h < a.length; h++)
        e.page.push({
          id: parseInt(a[h].getAttribute("id"), 10) || 0,
          file: a[h].getAttribute("file")
        });
      for (var h = 0; h < o.length; h++) {
        var l = o[h];
        e.char.push({
          id: parseInt(l.getAttribute("id"), 10),
          page: parseInt(l.getAttribute("page"), 10) || 0,
          x: parseInt(l.getAttribute("x"), 10),
          y: parseInt(l.getAttribute("y"), 10),
          width: parseInt(l.getAttribute("width"), 10),
          height: parseInt(l.getAttribute("height"), 10),
          xoffset: parseInt(l.getAttribute("xoffset"), 10),
          yoffset: parseInt(l.getAttribute("yoffset"), 10),
          xadvance: parseInt(l.getAttribute("xadvance"), 10)
        });
      }
      for (var h = 0; h < s.length; h++)
        e.kerning.push({
          first: parseInt(s[h].getAttribute("first"), 10),
          second: parseInt(s[h].getAttribute("second"), 10),
          amount: parseInt(s[h].getAttribute("amount"), 10)
        });
      for (var h = 0; h < u.length; h++)
        e.distanceField.push({
          fieldType: u[h].getAttribute("fieldType"),
          distanceRange: parseInt(u[h].getAttribute("distanceRange"), 10)
        });
      return e;
    }, r;
  }()
), q0 = (
  /** @class */
  function() {
    function r() {
    }
    return r.test = function(t) {
      if (typeof t == "string" && t.indexOf("<font>") > -1) {
        var e = new globalThis.DOMParser().parseFromString(t, "text/xml");
        return uo.test(e);
      }
      return !1;
    }, r.parse = function(t) {
      var e = new globalThis.DOMParser().parseFromString(t, "text/xml");
      return uo.parse(e);
    }, r;
  }()
), ya = [
  Y0,
  uo,
  q0
];
function dl(r) {
  for (var t = 0; t < ya.length; t++)
    if (ya[t].test(r))
      return ya[t];
  return null;
}
function Z0(r, t, e, i, n, a) {
  var o = e.fill;
  if (Array.isArray(o)) {
    if (o.length === 1)
      return o[0];
  } else
    return o;
  var s, u = e.dropShadow ? e.dropShadowDistance : 0, h = e.padding || 0, l = r.width / i - u - h * 2, f = r.height / i - u - h * 2, c = o.slice(), d = e.fillGradientStops.slice();
  if (!d.length)
    for (var p = c.length + 1, _ = 1; _ < p; ++_)
      d.push(_ / p);
  if (c.unshift(o[0]), d.unshift(0), c.push(o[o.length - 1]), d.push(1), e.fillGradientType === ui.LINEAR_VERTICAL) {
    s = t.createLinearGradient(l / 2, h, l / 2, f + h);
    for (var v = 0, y = a.fontProperties.fontSize + e.strokeThickness, g = y / f, _ = 0; _ < n.length; _++)
      for (var m = a.lineHeight * _, E = 0; E < c.length; E++) {
        var b = 0;
        typeof d[E] == "number" ? b = d[E] : b = E / c.length;
        var x = m / f + b * g, S = Math.max(v, x);
        S = Math.min(S, 1), s.addColorStop(S, c[E]), v = S;
      }
  } else {
    s = t.createLinearGradient(h, f / 2, l + h, f / 2);
    for (var A = c.length + 1, w = 1, _ = 0; _ < c.length; _++) {
      var P = void 0;
      typeof d[_] == "number" ? P = d[_] : P = w / A, s.addColorStop(P, c[_]), w++;
    }
  }
  return s;
}
function K0(r, t, e, i, n, a, o) {
  var s = e.text, u = e.fontProperties;
  t.translate(i, n), t.scale(a, a);
  var h = o.strokeThickness / 2, l = -(o.strokeThickness / 2);
  if (t.font = o.toFontString(), t.lineWidth = o.strokeThickness, t.textBaseline = o.textBaseline, t.lineJoin = o.lineJoin, t.miterLimit = o.miterLimit, t.fillStyle = Z0(r, t, o, a, [s], e), t.strokeStyle = o.stroke, o.dropShadow) {
    var f = o.dropShadowColor, c = Dr(typeof f == "number" ? f : fn(f)), d = o.dropShadowBlur * a, p = o.dropShadowDistance * a;
    t.shadowColor = "rgba(" + c[0] * 255 + "," + c[1] * 255 + "," + c[2] * 255 + "," + o.dropShadowAlpha + ")", t.shadowBlur = d, t.shadowOffsetX = Math.cos(o.dropShadowAngle) * p, t.shadowOffsetY = Math.sin(o.dropShadowAngle) * p;
  } else
    t.shadowColor = "black", t.shadowBlur = 0, t.shadowOffsetX = 0, t.shadowOffsetY = 0;
  o.stroke && o.strokeThickness && t.strokeText(s, h, l + e.lineHeight - u.descent), o.fill && t.fillText(s, h, l + e.lineHeight - u.descent), t.setTransform(1, 0, 0, 1, 0, 0), t.fillStyle = "rgba(0, 0, 0, 0)";
}
function pl(r) {
  return Array.from ? Array.from(r) : r.split("");
}
function $0(r) {
  typeof r == "string" && (r = [r]);
  for (var t = [], e = 0, i = r.length; e < i; e++) {
    var n = r[e];
    if (Array.isArray(n)) {
      if (n.length !== 2)
        throw new Error("[BitmapFont]: Invalid character range length, expecting 2 got " + n.length + ".");
      var a = n[0].charCodeAt(0), o = n[1].charCodeAt(0);
      if (o < a)
        throw new Error("[BitmapFont]: Invalid character range.");
      for (var s = a, u = o; s <= u; s++)
        t.push(String.fromCharCode(s));
    } else
      t.push.apply(t, pl(n));
  }
  if (t.length === 0)
    throw new Error("[BitmapFont]: Empty set when resolving characters.");
  return t;
}
function Ji(r) {
  return r.codePointAt ? r.codePointAt(0) : r.charCodeAt(0);
}
var Re = (
  /** @class */
  function() {
    function r(t, e, i) {
      var n, a, o = t.info[0], s = t.common[0], u = t.page[0], h = t.distanceField[0], l = dn(u.file), f = {};
      this._ownsTextures = i, this.font = o.face, this.size = o.size, this.lineHeight = s.lineHeight / l, this.chars = {}, this.pageTextures = f;
      for (var c = 0; c < t.page.length; c++) {
        var d = t.page[c], p = d.id, _ = d.file;
        f[p] = e instanceof Array ? e[c] : e[_], h != null && h.fieldType && h.fieldType !== "none" && (f[p].baseTexture.alphaMode = se.NO_PREMULTIPLIED_ALPHA, f[p].baseTexture.mipmap = oe.OFF);
      }
      for (var c = 0; c < t.char.length; c++) {
        var v = t.char[c], p = v.id, y = v.page, g = t.char[c], m = g.x, E = g.y, b = g.width, x = g.height, S = g.xoffset, A = g.yoffset, w = g.xadvance;
        m /= l, E /= l, b /= l, x /= l, S /= l, A /= l, w /= l;
        var P = new st(m + f[y].frame.x / l, E + f[y].frame.y / l, b, x);
        this.chars[p] = {
          xOffset: S,
          yOffset: A,
          xAdvance: w,
          kerning: {},
          texture: new K(f[y].baseTexture, P),
          page: y
        };
      }
      for (var c = 0; c < t.kerning.length; c++) {
        var O = t.kerning[c], F = O.first, D = O.second, I = O.amount;
        F /= l, D /= l, I /= l, this.chars[D] && (this.chars[D].kerning[F] = I);
      }
      this.distanceFieldRange = h == null ? void 0 : h.distanceRange, this.distanceFieldType = (a = (n = h == null ? void 0 : h.fieldType) === null || n === void 0 ? void 0 : n.toLowerCase()) !== null && a !== void 0 ? a : "none";
    }
    return r.prototype.destroy = function() {
      for (var t in this.chars)
        this.chars[t].texture.destroy(), this.chars[t].texture = null;
      for (var t in this.pageTextures)
        this._ownsTextures && this.pageTextures[t].destroy(!0), this.pageTextures[t] = null;
      this.chars = null, this.pageTextures = null;
    }, r.install = function(t, e, i) {
      var n;
      if (t instanceof mn)
        n = t;
      else {
        var a = dl(t);
        if (!a)
          throw new Error("Unrecognized data format for font.");
        n = a.parse(t);
      }
      e instanceof K && (e = [e]);
      var o = new r(n, e, i);
      return r.available[o.font] = o, o;
    }, r.uninstall = function(t) {
      var e = r.available[t];
      if (!e)
        throw new Error("No font found named '" + t + "'");
      e.destroy(), delete r.available[t];
    }, r.from = function(t, e, i) {
      if (!t)
        throw new Error("[BitmapFont] Property `name` is required.");
      var n = Object.assign({}, r.defaultOptions, i), a = n.chars, o = n.padding, s = n.resolution, u = n.textureWidth, h = n.textureHeight, l = $0(a), f = e instanceof Fr ? e : new Fr(e), c = u, d = new mn();
      d.info[0] = {
        face: f.fontFamily,
        size: f.fontSize
      }, d.common[0] = {
        lineHeight: f.fontSize
      };
      for (var p = 0, _ = 0, v, y, g, m = 0, E = [], b = 0; b < l.length; b++) {
        v || (v = k.ADAPTER.createCanvas(), v.width = u, v.height = h, y = v.getContext("2d"), g = new ot(v, { resolution: s }), E.push(new K(g)), d.page.push({
          id: E.length - 1,
          file: ""
        }));
        var x = l[b], S = _e.measureText(x, f, !1, v), A = S.width, w = Math.ceil(S.height), P = Math.ceil((f.fontStyle === "italic" ? 2 : 1) * A);
        if (_ >= h - w * s) {
          if (_ === 0)
            throw new Error("[BitmapFont] textureHeight " + h + "px is too small " + ("(fontFamily: '" + f.fontFamily + "', fontSize: " + f.fontSize + "px, char: '" + x + "')"));
          --b, v = null, y = null, g = null, _ = 0, p = 0, m = 0;
          continue;
        }
        if (m = Math.max(w + S.fontProperties.descent, m), P * s + p >= c) {
          if (p === 0)
            throw new Error("[BitmapFont] textureWidth " + u + "px is too small " + ("(fontFamily: '" + f.fontFamily + "', fontSize: " + f.fontSize + "px, char: '" + x + "')"));
          --b, _ += m * s, _ = Math.ceil(_), p = 0, m = 0;
          continue;
        }
        K0(v, y, S, p, _, s, f);
        var O = Ji(S.text);
        d.char.push({
          id: O,
          page: E.length - 1,
          x: p / s,
          y: _ / s,
          width: P,
          height: w,
          xoffset: 0,
          yoffset: 0,
          xadvance: Math.ceil(A - (f.dropShadow ? f.dropShadowDistance : 0) - (f.stroke ? f.strokeThickness : 0))
        }), p += (P + 2 * o) * s, p = Math.ceil(p);
      }
      if (!(i != null && i.skipKerning))
        for (var b = 0, F = l.length; b < F; b++)
          for (var D = l[b], I = 0; I < F; I++) {
            var R = l[I], N = y.measureText(D).width, L = y.measureText(R).width, W = y.measureText(D + R).width, H = W - (N + L);
            H && d.kerning.push({
              first: Ji(D),
              second: Ji(R),
              amount: H
            });
          }
      var C = new r(d, E, !0);
      return r.available[t] !== void 0 && r.uninstall(t), r.available[t] = C, C;
    }, r.ALPHA = [["a", "z"], ["A", "Z"], " "], r.NUMERIC = [["0", "9"]], r.ALPHANUMERIC = [["a", "z"], ["A", "Z"], ["0", "9"], " "], r.ASCII = [[" ", "~"]], r.defaultOptions = {
      resolution: 1,
      textureWidth: 512,
      textureHeight: 512,
      padding: 4,
      chars: r.ALPHANUMERIC
    }, r.available = {}, r;
  }()
), Q0 = `// Pixi texture info\r
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
  // NPM Textures, NPM outputs\r
  gl_FragColor = vec4(uColor.rgb, uColor.a * alpha);\r
\r
}\r
`, J0 = `// Mesh material default fragment\r
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
`, Su = [], Pu = [], Au = [];
(function(r) {
  W0(t, r);
  function t(e, i) {
    i === void 0 && (i = {});
    var n = r.call(this) || this;
    n._tint = 16777215;
    var a = Object.assign({}, t.styleDefaults, i), o = a.align, s = a.tint, u = a.maxWidth, h = a.letterSpacing, l = a.fontName, f = a.fontSize;
    if (!Re.available[l])
      throw new Error('Missing BitmapFont "' + l + '"');
    return n._activePagesMeshData = [], n._textWidth = 0, n._textHeight = 0, n._align = o, n._tint = s, n._font = void 0, n._fontName = l, n._fontSize = f, n.text = e, n._maxWidth = u, n._maxLineHeight = 0, n._letterSpacing = h, n._anchor = new wr(function() {
      n.dirty = !0;
    }, n, 0, 0), n._roundPixels = k.ROUND_PIXELS, n.dirty = !0, n._resolution = k.RESOLUTION, n._autoResolution = !0, n._textureCache = {}, n;
  }
  return t.prototype.updateText = function() {
    for (var e, i = Re.available[this._fontName], n = this.fontSize, a = n / i.size, o = new gt(), s = [], u = [], h = [], l = this._text.replace(/(?:\r\n|\r)/g, `
`) || " ", f = pl(l), c = this._maxWidth * i.size / n, d = i.distanceFieldType === "none" ? Su : Pu, p = null, _ = 0, v = 0, y = 0, g = -1, m = 0, E = 0, b = 0, x = 0, S = 0; S < f.length; S++) {
      var A = f[S], w = Ji(A);
      if (/(?:\s)/.test(A) && (g = S, m = _, x++), A === "\r" || A === `
`) {
        u.push(_), h.push(-1), v = Math.max(v, _), ++y, ++E, o.x = 0, o.y += i.lineHeight, p = null, x = 0;
        continue;
      }
      var P = i.chars[w];
      if (P) {
        p && P.kerning[p] && (o.x += P.kerning[p]);
        var O = Au.pop() || {
          texture: K.EMPTY,
          line: 0,
          charCode: 0,
          prevSpaces: 0,
          position: new gt()
        };
        O.texture = P.texture, O.line = y, O.charCode = w, O.position.x = o.x + P.xOffset + this._letterSpacing / 2, O.position.y = o.y + P.yOffset, O.prevSpaces = x, s.push(O), _ = O.position.x + Math.max(P.xAdvance - P.xOffset, P.texture.orig.width), o.x += P.xAdvance + this._letterSpacing, b = Math.max(b, P.yOffset + P.texture.height), p = w, g !== -1 && c > 0 && o.x > c && (++E, Rr(s, 1 + g - E, 1 + S - g), S = g, g = -1, u.push(m), h.push(s.length > 0 ? s[s.length - 1].prevSpaces : 0), v = Math.max(v, m), y++, o.x = 0, o.y += i.lineHeight, p = null, x = 0);
      }
    }
    var F = f[f.length - 1];
    F !== "\r" && F !== `
` && (/(?:\s)/.test(F) && (_ = m), u.push(_), v = Math.max(v, _), h.push(-1));
    for (var D = [], S = 0; S <= y; S++) {
      var I = 0;
      this._align === "right" ? I = v - u[S] : this._align === "center" ? I = (v - u[S]) / 2 : this._align === "justify" && (I = h[S] < 0 ? 0 : (v - u[S]) / h[S]), D.push(I);
    }
    var R = s.length, N = {}, L = [], W = this._activePagesMeshData;
    d.push.apply(d, W);
    for (var S = 0; S < R; S++) {
      var H = s[S].texture, C = H.baseTexture.uid;
      if (!N[C]) {
        var M = d.pop();
        if (!M) {
          var j = new An(), J = void 0, tt = void 0;
          i.distanceFieldType === "none" ? (J = new li(K.EMPTY), tt = z.NORMAL) : (J = new li(K.EMPTY, { program: vi.from(J0, Q0), uniforms: { uFWidth: 0 } }), tt = z.NORMAL_NPM);
          var dt = new hi(j, J);
          dt.blendMode = tt, M = {
            index: 0,
            indexCount: 0,
            vertexCount: 0,
            uvsCount: 0,
            total: 0,
            mesh: dt,
            vertices: null,
            uvs: null,
            indices: null
          };
        }
        M.index = 0, M.indexCount = 0, M.vertexCount = 0, M.uvsCount = 0, M.total = 0;
        var $ = this._textureCache;
        $[C] = $[C] || new K(H.baseTexture), M.mesh.texture = $[C], M.mesh.tint = this._tint, L.push(M), N[C] = M;
      }
      N[C].total++;
    }
    for (var S = 0; S < W.length; S++)
      L.indexOf(W[S]) === -1 && this.removeChild(W[S].mesh);
    for (var S = 0; S < L.length; S++)
      L[S].mesh.parent !== this && this.addChild(L[S].mesh);
    this._activePagesMeshData = L;
    for (var S in N) {
      var M = N[S], ht = M.total;
      if (!(((e = M.indices) === null || e === void 0 ? void 0 : e.length) > 6 * ht) || M.vertices.length < hi.BATCHABLE_SIZE * 2)
        M.vertices = new Float32Array(4 * 2 * ht), M.uvs = new Float32Array(4 * 2 * ht), M.indices = new Uint16Array(6 * ht);
      else
        for (var _t = M.total, mt = M.vertices, Z = _t * 4 * 2; Z < mt.length; Z++)
          mt[Z] = 0;
      M.mesh.size = 6 * ht;
    }
    for (var S = 0; S < R; S++) {
      var A = s[S], et = A.position.x + D[A.line] * (this._align === "justify" ? A.prevSpaces : 1);
      this._roundPixels && (et = Math.round(et));
      var nt = et * a, pt = A.position.y * a, H = A.texture, rt = N[H.baseTexture.uid], X = H.frame, U = H._uvs, lt = rt.index++;
      rt.indices[lt * 6 + 0] = 0 + lt * 4, rt.indices[lt * 6 + 1] = 1 + lt * 4, rt.indices[lt * 6 + 2] = 2 + lt * 4, rt.indices[lt * 6 + 3] = 0 + lt * 4, rt.indices[lt * 6 + 4] = 2 + lt * 4, rt.indices[lt * 6 + 5] = 3 + lt * 4, rt.vertices[lt * 8 + 0] = nt, rt.vertices[lt * 8 + 1] = pt, rt.vertices[lt * 8 + 2] = nt + X.width * a, rt.vertices[lt * 8 + 3] = pt, rt.vertices[lt * 8 + 4] = nt + X.width * a, rt.vertices[lt * 8 + 5] = pt + X.height * a, rt.vertices[lt * 8 + 6] = nt, rt.vertices[lt * 8 + 7] = pt + X.height * a, rt.uvs[lt * 8 + 0] = U.x0, rt.uvs[lt * 8 + 1] = U.y0, rt.uvs[lt * 8 + 2] = U.x1, rt.uvs[lt * 8 + 3] = U.y1, rt.uvs[lt * 8 + 4] = U.x2, rt.uvs[lt * 8 + 5] = U.y2, rt.uvs[lt * 8 + 6] = U.x3, rt.uvs[lt * 8 + 7] = U.y3;
    }
    this._textWidth = v * a, this._textHeight = (o.y + i.lineHeight) * a;
    for (var S in N) {
      var M = N[S];
      if (this.anchor.x !== 0 || this.anchor.y !== 0)
        for (var ue = 0, fr = this._textWidth * this.anchor.x, yi = this._textHeight * this.anchor.y, Ho = 0; Ho < M.total; Ho++)
          M.vertices[ue++] -= fr, M.vertices[ue++] -= yi, M.vertices[ue++] -= fr, M.vertices[ue++] -= yi, M.vertices[ue++] -= fr, M.vertices[ue++] -= yi, M.vertices[ue++] -= fr, M.vertices[ue++] -= yi;
      this._maxLineHeight = b * a;
      var Xo = M.mesh.geometry.getBuffer("aVertexPosition"), jo = M.mesh.geometry.getBuffer("aTextureCoord"), Vo = M.mesh.geometry.getIndex();
      Xo.data = M.vertices, jo.data = M.uvs, Vo.data = M.indices, Xo.update(), jo.update(), Vo.update();
    }
    for (var S = 0; S < s.length; S++)
      Au.push(s[S]);
    this._font = i, this.dirty = !1;
  }, t.prototype.updateTransform = function() {
    this.validate(), this.containerUpdateTransform();
  }, t.prototype._render = function(e) {
    this._autoResolution && this._resolution !== e.resolution && (this._resolution = e.resolution, this.dirty = !0);
    var i = Re.available[this._fontName], n = i.distanceFieldRange, a = i.distanceFieldType, o = i.size;
    if (a !== "none")
      for (var s = this.worldTransform, u = s.a, h = s.b, l = s.c, f = s.d, c = Math.sqrt(u * u + h * h), d = Math.sqrt(l * l + f * f), p = (Math.abs(c) + Math.abs(d)) / 2, _ = this.fontSize / o, v = 0, y = this._activePagesMeshData; v < y.length; v++) {
        var g = y[v];
        g.mesh.shader.uniforms.uFWidth = p * n * _ * this._resolution;
      }
    r.prototype._render.call(this, e);
  }, t.prototype.getLocalBounds = function() {
    return this.validate(), r.prototype.getLocalBounds.call(this);
  }, t.prototype.validate = function() {
    var e = Re.available[this._fontName];
    if (!e)
      throw new Error('Missing BitmapFont "' + this._fontName + '"');
    this._font !== e && (this.dirty = !0), this.dirty && this.updateText();
  }, Object.defineProperty(t.prototype, "tint", {
    /**
     * The tint of the BitmapText object.
     * @default 0xffffff
     */
    get: function() {
      return this._tint;
    },
    set: function(e) {
      if (this._tint !== e) {
        this._tint = e;
        for (var i = 0; i < this._activePagesMeshData.length; i++)
          this._activePagesMeshData[i].mesh.tint = e;
      }
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "align", {
    /**
     * The alignment of the BitmapText object.
     * @member {string}
     * @default 'left'
     */
    get: function() {
      return this._align;
    },
    set: function(e) {
      this._align !== e && (this._align = e, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "fontName", {
    /** The name of the BitmapFont. */
    get: function() {
      return this._fontName;
    },
    set: function(e) {
      if (!Re.available[e])
        throw new Error('Missing BitmapFont "' + e + '"');
      this._fontName !== e && (this._fontName = e, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "fontSize", {
    /** The size of the font to display. */
    get: function() {
      var e;
      return (e = this._fontSize) !== null && e !== void 0 ? e : Re.available[this._fontName].size;
    },
    set: function(e) {
      this._fontSize !== e && (this._fontSize = e, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "anchor", {
    /**
     * The anchor sets the origin point of the text.
     *
     * The default is `(0,0)`, this means the text's origin is the top left.
     *
     * Setting the anchor to `(0.5,0.5)` means the text's origin is centered.
     *
     * Setting the anchor to `(1,1)` would mean the text's origin point will be the bottom right corner.
     */
    get: function() {
      return this._anchor;
    },
    set: function(e) {
      typeof e == "number" ? this._anchor.set(e) : this._anchor.copyFrom(e);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "text", {
    /** The text of the BitmapText object. */
    get: function() {
      return this._text;
    },
    set: function(e) {
      e = String(e ?? ""), this._text !== e && (this._text = e, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "maxWidth", {
    /**
     * The max width of this bitmap text in pixels. If the text provided is longer than the
     * value provided, line breaks will be automatically inserted in the last whitespace.
     * Disable by setting the value to 0.
     */
    get: function() {
      return this._maxWidth;
    },
    set: function(e) {
      this._maxWidth !== e && (this._maxWidth = e, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "maxLineHeight", {
    /**
     * The max line height. This is useful when trying to use the total height of the Text,
     * i.e. when trying to vertically align.
     * @readonly
     */
    get: function() {
      return this.validate(), this._maxLineHeight;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "textWidth", {
    /**
     * The width of the overall text, different from fontSize,
     * which is defined in the style object.
     * @readonly
     */
    get: function() {
      return this.validate(), this._textWidth;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "letterSpacing", {
    /** Additional space between characters. */
    get: function() {
      return this._letterSpacing;
    },
    set: function(e) {
      this._letterSpacing !== e && (this._letterSpacing = e, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "roundPixels", {
    /**
     * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
     * Advantages can include sharper image quality (like text) and faster rendering on canvas.
     * The main disadvantage is movement of objects may appear less smooth.
     * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}
     * @default PIXI.settings.ROUND_PIXELS
     */
    get: function() {
      return this._roundPixels;
    },
    set: function(e) {
      e !== this._roundPixels && (this._roundPixels = e, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "textHeight", {
    /**
     * The height of the overall text, different from fontSize,
     * which is defined in the style object.
     * @readonly
     */
    get: function() {
      return this.validate(), this._textHeight;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "resolution", {
    /**
     * The resolution / device pixel ratio of the canvas.
     *
     * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
     * @default 1
     */
    get: function() {
      return this._resolution;
    },
    set: function(e) {
      this._autoResolution = !1, this._resolution !== e && (this._resolution = e, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), t.prototype.destroy = function(e) {
    var i = this._textureCache, n = Re.available[this._fontName], a = n.distanceFieldType === "none" ? Su : Pu;
    a.push.apply(a, this._activePagesMeshData);
    for (var o = 0, s = this._activePagesMeshData; o < s.length; o++) {
      var u = s[o];
      this.removeChild(u.mesh);
    }
    this._activePagesMeshData = [], a.filter(function(f) {
      return i[f.mesh.texture.baseTexture.uid];
    }).forEach(function(f) {
      f.mesh.texture = K.EMPTY;
    });
    for (var h in i) {
      var l = i[h];
      l.destroy(), delete i[h];
    }
    this._font = null, this._textureCache = null, r.prototype.destroy.call(this, e);
  }, t.styleDefaults = {
    align: "left",
    tint: 16777215,
    maxWidth: 0,
    letterSpacing: 0
  }, t;
})(ve);
var tb = (
  /** @class */
  function() {
    function r() {
    }
    return r.add = function() {
      Pt.setExtensionXhrType("fnt", Pt.XHR_RESPONSE_TYPE.TEXT);
    }, r.use = function(t, e) {
      var i = dl(t.data);
      if (!i) {
        e();
        return;
      }
      for (var n = r.getBaseUrl(this, t), a = i.parse(t.data), o = {}, s = function(_) {
        o[_.metadata.pageFile] = _.texture, Object.keys(o).length === a.page.length && (t.bitmapFont = Re.install(a, o, !0), e());
      }, u = 0; u < a.page.length; ++u) {
        var h = a.page[u].file, l = n + h, f = !1;
        for (var c in this.resources) {
          var d = this.resources[c];
          if (d.url === l) {
            d.metadata.pageFile = h, d.texture ? s(d) : d.onAfterMiddleware.add(s), f = !0;
            break;
          }
        }
        if (!f) {
          var p = {
            crossOrigin: t.crossOrigin,
            loadType: Pt.LOAD_TYPE.IMAGE,
            metadata: Object.assign({ pageFile: h }, t.metadata.imageMetadata),
            parentResource: t
          };
          this.add(l, p, s);
        }
      }
    }, r.getBaseUrl = function(t, e) {
      var i = e.isDataUrl ? "" : r.dirname(e.url);
      return e.isDataUrl && (i === "." && (i = ""), t.baseUrl && i && t.baseUrl.charAt(t.baseUrl.length - 1) === "/" && (i += "/")), i = i.replace(t.baseUrl, ""), i && i.charAt(i.length - 1) !== "/" && (i += "/"), i;
    }, r.dirname = function(t) {
      var e = t.replace(/\\/g, "/").replace(/\/$/, "").replace(/\/[^\/]*$/, "");
      return e === t ? "." : e === "" ? "/" : e;
    }, r.extension = vt.Loader, r;
  }()
);
/*!
 * @pixi/filter-alpha - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/filter-alpha is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var ho = function(r, t) {
  return ho = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, ho(r, t);
};
function eb(r, t) {
  ho(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
var rb = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float uAlpha;

void main(void)
{
   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;
}
`;
(function(r) {
  eb(t, r);
  function t(e) {
    e === void 0 && (e = 1);
    var i = r.call(this, Zg, rb, { uAlpha: 1 }) || this;
    return i.alpha = e, i;
  }
  return Object.defineProperty(t.prototype, "alpha", {
    /**
     * Coefficient for alpha multiplication
     * @default 1
     */
    get: function() {
      return this.uniforms.uAlpha;
    },
    set: function(e) {
      this.uniforms.uAlpha = e;
    },
    enumerable: !1,
    configurable: !0
  }), t;
})(ke);
/*!
 * @pixi/filter-blur - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/filter-blur is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var lo = function(r, t) {
  return lo = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, lo(r, t);
};
function vl(r, t) {
  lo(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
var ib = `
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
function nb(r, t) {
  var e = Math.ceil(r / 2), i = ib, n = "", a;
  t ? a = "vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * strength, 0.0);" : a = "vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * strength);";
  for (var o = 0; o < r; o++) {
    var s = a.replace("%index%", o.toString());
    s = s.replace("%sampleIndex%", o - (e - 1) + ".0"), n += s, n += `
`;
  }
  return i = i.replace("%blur%", n), i = i.replace("%size%", r.toString()), i;
}
var ab = {
  5: [0.153388, 0.221461, 0.250301],
  7: [0.071303, 0.131514, 0.189879, 0.214607],
  9: [0.028532, 0.067234, 0.124009, 0.179044, 0.20236],
  11: [93e-4, 0.028002, 0.065984, 0.121703, 0.175713, 0.198596],
  13: [2406e-6, 9255e-6, 0.027867, 0.065666, 0.121117, 0.174868, 0.197641],
  15: [489e-6, 2403e-6, 9246e-6, 0.02784, 0.065602, 0.120999, 0.174697, 0.197448]
}, ob = [
  "varying vec2 vBlurTexCoords[%size%];",
  "uniform sampler2D uSampler;",
  "void main(void)",
  "{",
  "    gl_FragColor = vec4(0.0);",
  "    %blur%",
  "}"
].join(`
`);
function sb(r) {
  for (var t = ab[r], e = t.length, i = ob, n = "", a = "gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;", o, s = 0; s < r; s++) {
    var u = a.replace("%index%", s.toString());
    o = s, s >= e && (o = r - s - 1), u = u.replace("%value%", t[o].toString()), n += u, n += `
`;
  }
  return i = i.replace("%blur%", n), i = i.replace("%size%", r.toString()), i;
}
var Ru = (
  /** @class */
  function(r) {
    vl(t, r);
    function t(e, i, n, a, o) {
      i === void 0 && (i = 8), n === void 0 && (n = 4), a === void 0 && (a = k.FILTER_RESOLUTION), o === void 0 && (o = 5);
      var s = this, u = nb(o, e), h = sb(o);
      return s = r.call(
        this,
        // vertex shader
        u,
        // fragment shader
        h
      ) || this, s.horizontal = e, s.resolution = a, s._quality = 0, s.quality = n, s.blur = i, s;
    }
    return t.prototype.apply = function(e, i, n, a) {
      if (n ? this.horizontal ? this.uniforms.strength = 1 / n.width * (n.width / i.width) : this.uniforms.strength = 1 / n.height * (n.height / i.height) : this.horizontal ? this.uniforms.strength = 1 / e.renderer.width * (e.renderer.width / i.width) : this.uniforms.strength = 1 / e.renderer.height * (e.renderer.height / i.height), this.uniforms.strength *= this.strength, this.uniforms.strength /= this.passes, this.passes === 1)
        e.applyFilter(this, i, n, a);
      else {
        var o = e.getFilterTexture(), s = e.renderer, u = i, h = o;
        this.state.blend = !1, e.applyFilter(this, u, h, re.CLEAR);
        for (var l = 1; l < this.passes - 1; l++) {
          e.bindAndClear(u, re.BLIT), this.uniforms.uSampler = h;
          var f = h;
          h = u, u = f, s.shader.bind(this), s.geometry.draw(5);
        }
        this.state.blend = !0, e.applyFilter(this, h, n, a), e.returnFilterTexture(o);
      }
    }, Object.defineProperty(t.prototype, "blur", {
      /**
       * Sets the strength of both the blur.
       * @default 16
       */
      get: function() {
        return this.strength;
      },
      set: function(e) {
        this.padding = 1 + Math.abs(e) * 2, this.strength = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "quality", {
      /**
       * Sets the quality of the blur by modifying the number of passes. More passes means higher
       * quality bluring but the lower the performance.
       * @default 4
       */
      get: function() {
        return this._quality;
      },
      set: function(e) {
        this._quality = e, this.passes = e;
      },
      enumerable: !1,
      configurable: !0
    }), t;
  }(ke)
);
(function(r) {
  vl(t, r);
  function t(e, i, n, a) {
    e === void 0 && (e = 8), i === void 0 && (i = 4), n === void 0 && (n = k.FILTER_RESOLUTION), a === void 0 && (a = 5);
    var o = r.call(this) || this;
    return o.blurXFilter = new Ru(!0, e, i, n, a), o.blurYFilter = new Ru(!1, e, i, n, a), o.resolution = n, o.quality = i, o.blur = e, o.repeatEdgePixels = !1, o;
  }
  return t.prototype.apply = function(e, i, n, a) {
    var o = Math.abs(this.blurXFilter.strength), s = Math.abs(this.blurYFilter.strength);
    if (o && s) {
      var u = e.getFilterTexture();
      this.blurXFilter.apply(e, i, u, re.CLEAR), this.blurYFilter.apply(e, u, n, a), e.returnFilterTexture(u);
    } else
      s ? this.blurYFilter.apply(e, i, n, a) : this.blurXFilter.apply(e, i, n, a);
  }, t.prototype.updatePadding = function() {
    this._repeatEdgePixels ? this.padding = 0 : this.padding = Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength)) * 2;
  }, Object.defineProperty(t.prototype, "blur", {
    /**
     * Sets the strength of both the blurX and blurY properties simultaneously
     * @default 2
     */
    get: function() {
      return this.blurXFilter.blur;
    },
    set: function(e) {
      this.blurXFilter.blur = this.blurYFilter.blur = e, this.updatePadding();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "quality", {
    /**
     * Sets the number of passes for blur. More passes means higher quality bluring.
     * @default 1
     */
    get: function() {
      return this.blurXFilter.quality;
    },
    set: function(e) {
      this.blurXFilter.quality = this.blurYFilter.quality = e;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "blurX", {
    /**
     * Sets the strength of the blurX property
     * @default 2
     */
    get: function() {
      return this.blurXFilter.blur;
    },
    set: function(e) {
      this.blurXFilter.blur = e, this.updatePadding();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "blurY", {
    /**
     * Sets the strength of the blurY property
     * @default 2
     */
    get: function() {
      return this.blurYFilter.blur;
    },
    set: function(e) {
      this.blurYFilter.blur = e, this.updatePadding();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "blendMode", {
    /**
     * Sets the blendmode of the filter
     * @default PIXI.BLEND_MODES.NORMAL
     */
    get: function() {
      return this.blurYFilter.blendMode;
    },
    set: function(e) {
      this.blurYFilter.blendMode = e;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "repeatEdgePixels", {
    /**
     * If set to true the edge of the target will be clamped
     * @default false
     */
    get: function() {
      return this._repeatEdgePixels;
    },
    set: function(e) {
      this._repeatEdgePixels = e, this.updatePadding();
    },
    enumerable: !1,
    configurable: !0
  }), t;
})(ke);
/*!
 * @pixi/filter-color-matrix - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/filter-color-matrix is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var fo = function(r, t) {
  return fo = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, fo(r, t);
};
function ub(r, t) {
  fo(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
var hb = `varying vec2 vTextureCoord;
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
`, Ou = (
  /** @class */
  function(r) {
    ub(t, r);
    function t() {
      var e = this, i = {
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
      return e = r.call(this, el, hb, i) || this, e.alpha = 1, e;
    }
    return t.prototype._loadMatrix = function(e, i) {
      i === void 0 && (i = !1);
      var n = e;
      i && (this._multiply(n, this.uniforms.m, e), n = this._colorMatrix(n)), this.uniforms.m = n;
    }, t.prototype._multiply = function(e, i, n) {
      return e[0] = i[0] * n[0] + i[1] * n[5] + i[2] * n[10] + i[3] * n[15], e[1] = i[0] * n[1] + i[1] * n[6] + i[2] * n[11] + i[3] * n[16], e[2] = i[0] * n[2] + i[1] * n[7] + i[2] * n[12] + i[3] * n[17], e[3] = i[0] * n[3] + i[1] * n[8] + i[2] * n[13] + i[3] * n[18], e[4] = i[0] * n[4] + i[1] * n[9] + i[2] * n[14] + i[3] * n[19] + i[4], e[5] = i[5] * n[0] + i[6] * n[5] + i[7] * n[10] + i[8] * n[15], e[6] = i[5] * n[1] + i[6] * n[6] + i[7] * n[11] + i[8] * n[16], e[7] = i[5] * n[2] + i[6] * n[7] + i[7] * n[12] + i[8] * n[17], e[8] = i[5] * n[3] + i[6] * n[8] + i[7] * n[13] + i[8] * n[18], e[9] = i[5] * n[4] + i[6] * n[9] + i[7] * n[14] + i[8] * n[19] + i[9], e[10] = i[10] * n[0] + i[11] * n[5] + i[12] * n[10] + i[13] * n[15], e[11] = i[10] * n[1] + i[11] * n[6] + i[12] * n[11] + i[13] * n[16], e[12] = i[10] * n[2] + i[11] * n[7] + i[12] * n[12] + i[13] * n[17], e[13] = i[10] * n[3] + i[11] * n[8] + i[12] * n[13] + i[13] * n[18], e[14] = i[10] * n[4] + i[11] * n[9] + i[12] * n[14] + i[13] * n[19] + i[14], e[15] = i[15] * n[0] + i[16] * n[5] + i[17] * n[10] + i[18] * n[15], e[16] = i[15] * n[1] + i[16] * n[6] + i[17] * n[11] + i[18] * n[16], e[17] = i[15] * n[2] + i[16] * n[7] + i[17] * n[12] + i[18] * n[17], e[18] = i[15] * n[3] + i[16] * n[8] + i[17] * n[13] + i[18] * n[18], e[19] = i[15] * n[4] + i[16] * n[9] + i[17] * n[14] + i[18] * n[19] + i[19], e;
    }, t.prototype._colorMatrix = function(e) {
      var i = new Float32Array(e);
      return i[4] /= 255, i[9] /= 255, i[14] /= 255, i[19] /= 255, i;
    }, t.prototype.brightness = function(e, i) {
      var n = [
        e,
        0,
        0,
        0,
        0,
        0,
        e,
        0,
        0,
        0,
        0,
        0,
        e,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(n, i);
    }, t.prototype.tint = function(e, i) {
      var n = e >> 16 & 255, a = e >> 8 & 255, o = e & 255, s = [
        n / 255,
        0,
        0,
        0,
        0,
        0,
        a / 255,
        0,
        0,
        0,
        0,
        0,
        o / 255,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(s, i);
    }, t.prototype.greyscale = function(e, i) {
      var n = [
        e,
        e,
        e,
        0,
        0,
        e,
        e,
        e,
        0,
        0,
        e,
        e,
        e,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(n, i);
    }, t.prototype.blackAndWhite = function(e) {
      var i = [
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
      this._loadMatrix(i, e);
    }, t.prototype.hue = function(e, i) {
      e = (e || 0) / 180 * Math.PI;
      var n = Math.cos(e), a = Math.sin(e), o = Math.sqrt, s = 1 / 3, u = o(s), h = n + (1 - n) * s, l = s * (1 - n) - u * a, f = s * (1 - n) + u * a, c = s * (1 - n) + u * a, d = n + s * (1 - n), p = s * (1 - n) - u * a, _ = s * (1 - n) - u * a, v = s * (1 - n) + u * a, y = n + s * (1 - n), g = [
        h,
        l,
        f,
        0,
        0,
        c,
        d,
        p,
        0,
        0,
        _,
        v,
        y,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(g, i);
    }, t.prototype.contrast = function(e, i) {
      var n = (e || 0) + 1, a = -0.5 * (n - 1), o = [
        n,
        0,
        0,
        0,
        a,
        0,
        n,
        0,
        0,
        a,
        0,
        0,
        n,
        0,
        a,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(o, i);
    }, t.prototype.saturate = function(e, i) {
      e === void 0 && (e = 0);
      var n = e * 2 / 3 + 1, a = (n - 1) * -0.5, o = [
        n,
        a,
        a,
        0,
        0,
        a,
        n,
        a,
        0,
        0,
        a,
        a,
        n,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(o, i);
    }, t.prototype.desaturate = function() {
      this.saturate(-1);
    }, t.prototype.negative = function(e) {
      var i = [
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
      this._loadMatrix(i, e);
    }, t.prototype.sepia = function(e) {
      var i = [
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
      this._loadMatrix(i, e);
    }, t.prototype.technicolor = function(e) {
      var i = [
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
      this._loadMatrix(i, e);
    }, t.prototype.polaroid = function(e) {
      var i = [
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
      this._loadMatrix(i, e);
    }, t.prototype.toBGR = function(e) {
      var i = [
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
      this._loadMatrix(i, e);
    }, t.prototype.kodachrome = function(e) {
      var i = [
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
      this._loadMatrix(i, e);
    }, t.prototype.browni = function(e) {
      var i = [
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
      this._loadMatrix(i, e);
    }, t.prototype.vintage = function(e) {
      var i = [
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
      this._loadMatrix(i, e);
    }, t.prototype.colorTone = function(e, i, n, a, o) {
      e = e || 0.2, i = i || 0.15, n = n || 16770432, a = a || 3375104;
      var s = (n >> 16 & 255) / 255, u = (n >> 8 & 255) / 255, h = (n & 255) / 255, l = (a >> 16 & 255) / 255, f = (a >> 8 & 255) / 255, c = (a & 255) / 255, d = [
        0.3,
        0.59,
        0.11,
        0,
        0,
        s,
        u,
        h,
        e,
        0,
        l,
        f,
        c,
        i,
        0,
        s - l,
        u - f,
        h - c,
        0,
        0
      ];
      this._loadMatrix(d, o);
    }, t.prototype.night = function(e, i) {
      e = e || 0.1;
      var n = [
        e * -2,
        -e,
        0,
        0,
        0,
        -e,
        0,
        e,
        0,
        0,
        0,
        e,
        e * 2,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(n, i);
    }, t.prototype.predator = function(e, i) {
      var n = [
        // row 1
        11.224130630493164 * e,
        -4.794486999511719 * e,
        -2.8746118545532227 * e,
        0 * e,
        0.40342438220977783 * e,
        // row 2
        -3.6330697536468506 * e,
        9.193157196044922 * e,
        -2.951810836791992 * e,
        0 * e,
        -1.316135048866272 * e,
        // row 3
        -3.2184197902679443 * e,
        -4.2375030517578125 * e,
        7.476448059082031 * e,
        0 * e,
        0.8044459223747253 * e,
        // row 4
        0,
        0,
        0,
        1,
        0
      ];
      this._loadMatrix(n, i);
    }, t.prototype.lsd = function(e) {
      var i = [
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
      this._loadMatrix(i, e);
    }, t.prototype.reset = function() {
      var e = [
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
      this._loadMatrix(e, !1);
    }, Object.defineProperty(t.prototype, "matrix", {
      /**
       * The matrix of the color matrix filter
       * @member {number[]}
       * @default [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]
       */
      get: function() {
        return this.uniforms.m;
      },
      set: function(e) {
        this.uniforms.m = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(t.prototype, "alpha", {
      /**
       * The opacity value to use when mixing the original and resultant colors.
       *
       * When the value is 0, the original color is used without modification.
       * When the value is 1, the result color is used.
       * When in the range (0, 1) the color is interpolated between the original and result by this amount.
       * @default 1
       */
      get: function() {
        return this.uniforms.uAlpha;
      },
      set: function(e) {
        this.uniforms.uAlpha = e;
      },
      enumerable: !1,
      configurable: !0
    }), t;
  }(ke)
);
Ou.prototype.grayscale = Ou.prototype.greyscale;
/*!
 * @pixi/filter-displacement - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/filter-displacement is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var co = function(r, t) {
  return co = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, co(r, t);
};
function lb(r, t) {
  co(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
var fb = `varying vec2 vFilterCoord;
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
`, cb = `attribute vec2 aVertexPosition;

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
(function(r) {
  lb(t, r);
  function t(e, i) {
    var n = this, a = new It();
    return e.renderable = !1, n = r.call(this, cb, fb, {
      mapSampler: e._texture,
      filterMatrix: a,
      scale: { x: 1, y: 1 },
      rotation: new Float32Array([1, 0, 0, 1])
    }) || this, n.maskSprite = e, n.maskMatrix = a, i == null && (i = 20), n.scale = new gt(i, i), n;
  }
  return t.prototype.apply = function(e, i, n, a) {
    this.uniforms.filterMatrix = e.calculateSpriteMatrix(this.maskMatrix, this.maskSprite), this.uniforms.scale.x = this.scale.x, this.uniforms.scale.y = this.scale.y;
    var o = this.maskSprite.worldTransform, s = Math.sqrt(o.a * o.a + o.b * o.b), u = Math.sqrt(o.c * o.c + o.d * o.d);
    s !== 0 && u !== 0 && (this.uniforms.rotation[0] = o.a / s, this.uniforms.rotation[1] = o.b / s, this.uniforms.rotation[2] = o.c / u, this.uniforms.rotation[3] = o.d / u), e.applyFilter(this, i, n, a);
  }, Object.defineProperty(t.prototype, "map", {
    /** The texture used for the displacement map. Must be power of 2 sized texture. */
    get: function() {
      return this.uniforms.mapSampler;
    },
    set: function(e) {
      this.uniforms.mapSampler = e;
    },
    enumerable: !1,
    configurable: !0
  }), t;
})(ke);
/*!
 * @pixi/filter-fxaa - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/filter-fxaa is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var po = function(r, t) {
  return po = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, po(r, t);
};
function db(r, t) {
  po(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
var pb = `
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
`, vb = `varying vec2 v_rgbNW;
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
`;
(function(r) {
  db(t, r);
  function t() {
    return r.call(this, pb, vb) || this;
  }
  return t;
})(ke);
/*!
 * @pixi/filter-noise - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/filter-noise is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var vo = function(r, t) {
  return vo = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, vo(r, t);
};
function _b(r, t) {
  vo(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
var yb = `precision highp float;

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
(function(r) {
  _b(t, r);
  function t(e, i) {
    e === void 0 && (e = 0.5), i === void 0 && (i = Math.random());
    var n = r.call(this, el, yb, {
      uNoise: 0,
      uSeed: 0
    }) || this;
    return n.noise = e, n.seed = i, n;
  }
  return Object.defineProperty(t.prototype, "noise", {
    /**
     * The amount of noise to apply, this value should be in the range (0, 1].
     * @default 0.5
     */
    get: function() {
      return this.uniforms.uNoise;
    },
    set: function(e) {
      this.uniforms.uNoise = e;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "seed", {
    /** A seed value to apply to the random noise generation. `Math.random()` is a good value to use. */
    get: function() {
      return this.uniforms.uSeed;
    },
    set: function(e) {
      this.uniforms.uSeed = e;
    },
    enumerable: !1,
    configurable: !0
  }), t;
})(ke);
/*!
 * @pixi/mixin-cache-as-bitmap - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/mixin-cache-as-bitmap is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var _l = new It();
At.prototype._cacheAsBitmap = !1;
At.prototype._cacheData = null;
At.prototype._cacheAsBitmapResolution = null;
At.prototype._cacheAsBitmapMultisample = bt.NONE;
var gb = (
  /** @class */
  function() {
    function r() {
      this.textureCacheId = null, this.originalRender = null, this.originalRenderCanvas = null, this.originalCalculateBounds = null, this.originalGetLocalBounds = null, this.originalUpdateTransform = null, this.originalDestroy = null, this.originalMask = null, this.originalFilterArea = null, this.originalContainsPoint = null, this.sprite = null;
    }
    return r;
  }()
);
Object.defineProperties(At.prototype, {
  /**
   * The resolution to use for cacheAsBitmap. By default this will use the renderer's resolution
   * but can be overriden for performance. Lower values will reduce memory usage at the expense
   * of render quality. A falsey value of `null` or `0` will default to the renderer's resolution.
   * If `cacheAsBitmap` is set to `true`, this will re-render with the new resolution.
   * @member {number} cacheAsBitmapResolution
   * @memberof PIXI.DisplayObject#
   * @default null
   */
  cacheAsBitmapResolution: {
    get: function() {
      return this._cacheAsBitmapResolution;
    },
    set: function(r) {
      r !== this._cacheAsBitmapResolution && (this._cacheAsBitmapResolution = r, this.cacheAsBitmap && (this.cacheAsBitmap = !1, this.cacheAsBitmap = !0));
    }
  },
  /**
   * The number of samples to use for cacheAsBitmap. If set to `null`, the renderer's
   * sample count is used.
   * If `cacheAsBitmap` is set to `true`, this will re-render with the new number of samples.
   * @member {number} cacheAsBitmapMultisample
   * @memberof PIXI.DisplayObject#
   * @default PIXI.MSAA_QUALITY.NONE
   */
  cacheAsBitmapMultisample: {
    get: function() {
      return this._cacheAsBitmapMultisample;
    },
    set: function(r) {
      r !== this._cacheAsBitmapMultisample && (this._cacheAsBitmapMultisample = r, this.cacheAsBitmap && (this.cacheAsBitmap = !1, this.cacheAsBitmap = !0));
    }
  },
  /**
   * Set this to true if you want this display object to be cached as a bitmap.
   * This basically takes a snap shot of the display object as it is at that moment. It can
   * provide a performance benefit for complex static displayObjects.
   * To remove simply set this property to `false`
   *
   * IMPORTANT GOTCHA - Make sure that all your textures are preloaded BEFORE setting this property to true
   * as it will take a snapshot of what is currently there. If the textures have not loaded then they will not appear.
   * @member {boolean}
   * @memberof PIXI.DisplayObject#
   */
  cacheAsBitmap: {
    get: function() {
      return this._cacheAsBitmap;
    },
    set: function(r) {
      if (this._cacheAsBitmap !== r) {
        this._cacheAsBitmap = r;
        var t;
        r ? (this._cacheData || (this._cacheData = new gb()), t = this._cacheData, t.originalRender = this.render, t.originalRenderCanvas = this.renderCanvas, t.originalUpdateTransform = this.updateTransform, t.originalCalculateBounds = this.calculateBounds, t.originalGetLocalBounds = this.getLocalBounds, t.originalDestroy = this.destroy, t.originalContainsPoint = this.containsPoint, t.originalMask = this._mask, t.originalFilterArea = this.filterArea, this.render = this._renderCached, this.renderCanvas = this._renderCachedCanvas, this.destroy = this._cacheAsBitmapDestroy) : (t = this._cacheData, t.sprite && this._destroyCachedDisplayObject(), this.render = t.originalRender, this.renderCanvas = t.originalRenderCanvas, this.calculateBounds = t.originalCalculateBounds, this.getLocalBounds = t.originalGetLocalBounds, this.destroy = t.originalDestroy, this.updateTransform = t.originalUpdateTransform, this.containsPoint = t.originalContainsPoint, this._mask = t.originalMask, this.filterArea = t.originalFilterArea);
      }
    }
  }
});
At.prototype._renderCached = function(t) {
  !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObject(t), this._cacheData.sprite.transform._worldID = this.transform._worldID, this._cacheData.sprite.worldAlpha = this.worldAlpha, this._cacheData.sprite._render(t));
};
At.prototype._initCachedDisplayObject = function(t) {
  var e;
  if (!(this._cacheData && this._cacheData.sprite)) {
    var i = this.alpha;
    this.alpha = 1, t.batch.flush();
    var n = this.getLocalBounds(null, !0).clone();
    if (this.filters && this.filters.length) {
      var a = this.filters[0].padding;
      n.pad(a);
    }
    n.ceil(k.RESOLUTION);
    var o = t.renderTexture.current, s = t.renderTexture.sourceFrame.clone(), u = t.renderTexture.destinationFrame.clone(), h = t.projection.transform, l = or.create({
      width: n.width,
      height: n.height,
      resolution: this.cacheAsBitmapResolution || t.resolution,
      multisample: (e = this.cacheAsBitmapMultisample) !== null && e !== void 0 ? e : t.multisample
    }), f = "cacheAsBitmap_" + ar();
    this._cacheData.textureCacheId = f, ot.addToCache(l.baseTexture, f), K.addToCache(l, f);
    var c = this.transform.localTransform.copyTo(_l).invert().translate(-n.x, -n.y);
    this.render = this._cacheData.originalRender, t.render(this, { renderTexture: l, clear: !0, transform: c, skipUpdateTransform: !1 }), t.framebuffer.blit(), t.projection.transform = h, t.renderTexture.bind(o, s, u), this.render = this._renderCached, this.updateTransform = this.displayObjectUpdateTransform, this.calculateBounds = this._calculateCachedBounds, this.getLocalBounds = this._getCachedLocalBounds, this._mask = null, this.filterArea = null, this.alpha = i;
    var d = new _i(l);
    d.transform.worldTransform = this.transform.worldTransform, d.anchor.x = -(n.x / n.width), d.anchor.y = -(n.y / n.height), d.alpha = i, d._bounds = this._bounds, this._cacheData.sprite = d, this.transform._parentID = -1, this.parent ? this.updateTransform() : (this.enableTempParent(), this.updateTransform(), this.disableTempParent(null)), this.containsPoint = d.containsPoint.bind(d);
  }
};
At.prototype._renderCachedCanvas = function(t) {
  !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObjectCanvas(t), this._cacheData.sprite.worldAlpha = this.worldAlpha, this._cacheData.sprite._renderCanvas(t));
};
At.prototype._initCachedDisplayObjectCanvas = function(t) {
  if (!(this._cacheData && this._cacheData.sprite)) {
    var e = this.getLocalBounds(null, !0), i = this.alpha;
    this.alpha = 1;
    var n = t.context, a = t._projTransform;
    e.ceil(k.RESOLUTION);
    var o = or.create({ width: e.width, height: e.height }), s = "cacheAsBitmap_" + ar();
    this._cacheData.textureCacheId = s, ot.addToCache(o.baseTexture, s), K.addToCache(o, s);
    var u = _l;
    this.transform.localTransform.copyTo(u), u.invert(), u.tx -= e.x, u.ty -= e.y, this.renderCanvas = this._cacheData.originalRenderCanvas, t.render(this, { renderTexture: o, clear: !0, transform: u, skipUpdateTransform: !1 }), t.context = n, t._projTransform = a, this.renderCanvas = this._renderCachedCanvas, this.updateTransform = this.displayObjectUpdateTransform, this.calculateBounds = this._calculateCachedBounds, this.getLocalBounds = this._getCachedLocalBounds, this._mask = null, this.filterArea = null, this.alpha = i;
    var h = new _i(o);
    h.transform.worldTransform = this.transform.worldTransform, h.anchor.x = -(e.x / e.width), h.anchor.y = -(e.y / e.height), h.alpha = i, h._bounds = this._bounds, this._cacheData.sprite = h, this.transform._parentID = -1, this.parent ? this.updateTransform() : (this.parent = t._tempDisplayObjectParent, this.updateTransform(), this.parent = null), this.containsPoint = h.containsPoint.bind(h);
  }
};
At.prototype._calculateCachedBounds = function() {
  this._bounds.clear(), this._cacheData.sprite.transform._worldID = this.transform._worldID, this._cacheData.sprite._calculateBounds(), this._bounds.updateID = this._boundsID;
};
At.prototype._getCachedLocalBounds = function() {
  return this._cacheData.sprite.getLocalBounds(null);
};
At.prototype._destroyCachedDisplayObject = function() {
  this._cacheData.sprite._texture.destroy(!0), this._cacheData.sprite = null, ot.removeFromCache(this._cacheData.textureCacheId), K.removeFromCache(this._cacheData.textureCacheId), this._cacheData.textureCacheId = null;
};
At.prototype._cacheAsBitmapDestroy = function(t) {
  this.cacheAsBitmap = !1, this.destroy(t);
};
/*!
 * @pixi/mixin-get-child-by-name - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/mixin-get-child-by-name is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
At.prototype.name = null;
ve.prototype.getChildByName = function(t, e) {
  for (var i = 0, n = this.children.length; i < n; i++)
    if (this.children[i].name === t)
      return this.children[i];
  if (e)
    for (var i = 0, n = this.children.length; i < n; i++) {
      var a = this.children[i];
      if (a.getChildByName) {
        var o = a.getChildByName(t, !0);
        if (o)
          return o;
      }
    }
  return null;
};
/*!
 * @pixi/mixin-get-global-position - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/mixin-get-global-position is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
At.prototype.getGlobalPosition = function(t, e) {
  return t === void 0 && (t = new gt()), e === void 0 && (e = !1), this.parent ? this.parent.toGlobal(this.position, t, e) : (t.x = this.position.x, t.y = this.position.y), t;
};
/*!
 * @pixi/app - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/app is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var mb = (
  /** @class */
  function() {
    function r() {
    }
    return r.init = function(t) {
      var e = this;
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
          set: function(i) {
            globalThis.removeEventListener("resize", this.queueResize), this._resizeTo = i, i && (globalThis.addEventListener("resize", this.queueResize), this.resize());
          },
          get: function() {
            return this._resizeTo;
          }
        }
      ), this.queueResize = function() {
        e._resizeTo && (e.cancelResize(), e._resizeId = requestAnimationFrame(function() {
          return e.resize();
        }));
      }, this.cancelResize = function() {
        e._resizeId && (cancelAnimationFrame(e._resizeId), e._resizeId = null);
      }, this.resize = function() {
        if (e._resizeTo) {
          e.cancelResize();
          var i, n;
          if (e._resizeTo === globalThis.window)
            i = globalThis.innerWidth, n = globalThis.innerHeight;
          else {
            var a = e._resizeTo, o = a.clientWidth, s = a.clientHeight;
            i = o, n = s;
          }
          e.renderer.resize(i, n);
        }
      }, this._resizeId = null, this._resizeTo = null, this.resizeTo = t.resizeTo || null;
    }, r.destroy = function() {
      globalThis.removeEventListener("resize", this.queueResize), this.cancelResize(), this.cancelResize = null, this.queueResize = null, this.resizeTo = null, this.resize = null;
    }, r.extension = vt.Application, r;
  }()
), bb = (
  /** @class */
  function() {
    function r(t) {
      var e = this;
      this.stage = new ve(), t = Object.assign({
        forceCanvas: !1
      }, t), this.renderer = tl(t), r._plugins.forEach(function(i) {
        i.init.call(e, t);
      });
    }
    return r.registerPlugin = function(t) {
      ae("6.5.0", "Application.registerPlugin() is deprecated, use extensions.add()"), Pe.add({
        type: vt.Application,
        ref: t
      });
    }, r.prototype.render = function() {
      this.renderer.render(this.stage);
    }, Object.defineProperty(r.prototype, "view", {
      /**
       * Reference to the renderer's canvas element.
       * @member {HTMLCanvasElement}
       * @readonly
       */
      get: function() {
        return this.renderer.view;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "screen", {
      /**
       * Reference to the renderer's screen rectangle. Its safe to use as `filterArea` or `hitArea` for the whole screen.
       * @member {PIXI.Rectangle}
       * @readonly
       */
      get: function() {
        return this.renderer.screen;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.destroy = function(t, e) {
      var i = this, n = r._plugins.slice(0);
      n.reverse(), n.forEach(function(a) {
        a.destroy.call(i);
      }), this.stage.destroy(e), this.stage = null, this.renderer.destroy(t), this.renderer = null;
    }, r._plugins = [], r;
  }()
);
Pe.handleByList(vt.Application, bb._plugins);
Pe.add(mb);
/*!
 * @pixi/mesh-extras - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/mesh-extras is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var _o = function(r, t) {
  return _o = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, _o(r, t);
};
function Br(r, t) {
  _o(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
var Eb = (
  /** @class */
  function(r) {
    Br(t, r);
    function t(e, i, n, a) {
      e === void 0 && (e = 100), i === void 0 && (i = 100), n === void 0 && (n = 10), a === void 0 && (a = 10);
      var o = r.call(this) || this;
      return o.segWidth = n, o.segHeight = a, o.width = e, o.height = i, o.build(), o;
    }
    return t.prototype.build = function() {
      for (var e = this.segWidth * this.segHeight, i = [], n = [], a = [], o = this.segWidth - 1, s = this.segHeight - 1, u = this.width / o, h = this.height / s, l = 0; l < e; l++) {
        var f = l % this.segWidth, c = l / this.segWidth | 0;
        i.push(f * u, c * h), n.push(f / o, c / s);
      }
      for (var d = o * s, l = 0; l < d; l++) {
        var p = l % o, _ = l / o | 0, v = _ * this.segWidth + p, y = _ * this.segWidth + p + 1, g = (_ + 1) * this.segWidth + p, m = (_ + 1) * this.segWidth + p + 1;
        a.push(v, y, g, y, m, g);
      }
      this.buffers[0].data = new Float32Array(i), this.buffers[1].data = new Float32Array(n), this.indexBuffer.data = new Uint16Array(a), this.buffers[0].update(), this.buffers[1].update(), this.indexBuffer.update();
    }, t;
  }(An)
), Tb = (
  /** @class */
  function(r) {
    Br(t, r);
    function t(e, i, n) {
      e === void 0 && (e = 200), n === void 0 && (n = 0);
      var a = r.call(this, new Float32Array(i.length * 4), new Float32Array(i.length * 4), new Uint16Array((i.length - 1) * 6)) || this;
      return a.points = i, a._width = e, a.textureScale = n, a.build(), a;
    }
    return Object.defineProperty(t.prototype, "width", {
      /**
       * The width (i.e., thickness) of the rope.
       * @readonly
       */
      get: function() {
        return this._width;
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype.build = function() {
      var e = this.points;
      if (e) {
        var i = this.getBuffer("aVertexPosition"), n = this.getBuffer("aTextureCoord"), a = this.getIndex();
        if (!(e.length < 1)) {
          i.data.length / 4 !== e.length && (i.data = new Float32Array(e.length * 4), n.data = new Float32Array(e.length * 4), a.data = new Uint16Array((e.length - 1) * 6));
          var o = n.data, s = a.data;
          o[0] = 0, o[1] = 0, o[2] = 0, o[3] = 1;
          for (var u = 0, h = e[0], l = this._width * this.textureScale, f = e.length, c = 0; c < f; c++) {
            var d = c * 4;
            if (this.textureScale > 0) {
              var p = h.x - e[c].x, _ = h.y - e[c].y, v = Math.sqrt(p * p + _ * _);
              h = e[c], u += v / l;
            } else
              u = c / (f - 1);
            o[d] = u, o[d + 1] = 0, o[d + 2] = u, o[d + 3] = 1;
          }
          for (var y = 0, c = 0; c < f - 1; c++) {
            var d = c * 2;
            s[y++] = d, s[y++] = d + 1, s[y++] = d + 2, s[y++] = d + 2, s[y++] = d + 1, s[y++] = d + 3;
          }
          n.update(), a.update(), this.updateVertices();
        }
      }
    }, t.prototype.updateVertices = function() {
      var e = this.points;
      if (!(e.length < 1)) {
        for (var i = e[0], n, a = 0, o = 0, s = this.buffers[0].data, u = e.length, h = 0; h < u; h++) {
          var l = e[h], f = h * 4;
          h < e.length - 1 ? n = e[h + 1] : n = l, o = -(n.x - i.x), a = n.y - i.y;
          var c = Math.sqrt(a * a + o * o), d = this.textureScale > 0 ? this.textureScale * this._width / 2 : this._width / 2;
          a /= c, o /= c, a *= d, o *= d, s[f] = l.x + a, s[f + 1] = l.y + o, s[f + 2] = l.x - a, s[f + 3] = l.y - o, i = l;
        }
        this.buffers[0].update();
      }
    }, t.prototype.update = function() {
      this.textureScale > 0 ? this.build() : this.updateVertices();
    }, t;
  }(An)
);
(function(r) {
  Br(t, r);
  function t(e, i, n) {
    n === void 0 && (n = 0);
    var a = this, o = new Tb(e.height, i, n), s = new li(e);
    return n > 0 && (e.baseTexture.wrapMode = de.REPEAT), a = r.call(this, o, s) || this, a.autoUpdate = !0, a;
  }
  return t.prototype._render = function(e) {
    var i = this.geometry;
    (this.autoUpdate || i._width !== this.shader.texture.height) && (i._width = this.shader.texture.height, i.update()), r.prototype._render.call(this, e);
  }, t;
})(hi);
var xb = (
  /** @class */
  function(r) {
    Br(t, r);
    function t(e, i, n) {
      var a = this, o = new Eb(e.width, e.height, i, n), s = new li(K.WHITE);
      return a = r.call(this, o, s) || this, a.texture = e, a.autoResize = !0, a;
    }
    return t.prototype.textureUpdated = function() {
      this._textureID = this.shader.texture._updateID;
      var e = this.geometry, i = this.shader.texture, n = i.width, a = i.height;
      this.autoResize && (e.width !== n || e.height !== a) && (e.width = this.shader.texture.width, e.height = this.shader.texture.height, e.build());
    }, Object.defineProperty(t.prototype, "texture", {
      get: function() {
        return this.shader.texture;
      },
      set: function(e) {
        this.shader.texture !== e && (this.shader.texture = e, this._textureID = -1, e.baseTexture.valid ? this.textureUpdated() : e.once("update", this.textureUpdated, this));
      },
      enumerable: !1,
      configurable: !0
    }), t.prototype._render = function(e) {
      this._textureID !== this.shader.texture._updateID && this.textureUpdated(), r.prototype._render.call(this, e);
    }, t.prototype.destroy = function(e) {
      this.shader.texture.off("update", this.textureUpdated, this), r.prototype.destroy.call(this, e);
    }, t;
  }(hi)
);
(function(r) {
  Br(t, r);
  function t(e, i, n, a, o) {
    e === void 0 && (e = K.EMPTY);
    var s = this, u = new An(i, n, a);
    u.getBuffer("aVertexPosition").static = !1;
    var h = new li(e);
    return s = r.call(this, u, h, null, o) || this, s.autoUpdate = !0, s;
  }
  return Object.defineProperty(t.prototype, "vertices", {
    /**
     * Collection of vertices data.
     * @type {Float32Array}
     */
    get: function() {
      return this.geometry.getBuffer("aVertexPosition").data;
    },
    set: function(e) {
      this.geometry.getBuffer("aVertexPosition").data = e;
    },
    enumerable: !1,
    configurable: !0
  }), t.prototype._render = function(e) {
    this.autoUpdate && this.geometry.getBuffer("aVertexPosition").update(), r.prototype._render.call(this, e);
  }, t;
})(hi);
var Wi = 10;
(function(r) {
  Br(t, r);
  function t(e, i, n, a, o) {
    i === void 0 && (i = Wi), n === void 0 && (n = Wi), a === void 0 && (a = Wi), o === void 0 && (o = Wi);
    var s = r.call(this, K.WHITE, 4, 4) || this;
    return s._origWidth = e.orig.width, s._origHeight = e.orig.height, s._width = s._origWidth, s._height = s._origHeight, s._leftWidth = i, s._rightWidth = a, s._topHeight = n, s._bottomHeight = o, s.texture = e, s;
  }
  return t.prototype.textureUpdated = function() {
    this._textureID = this.shader.texture._updateID, this._refresh();
  }, Object.defineProperty(t.prototype, "vertices", {
    get: function() {
      return this.geometry.getBuffer("aVertexPosition").data;
    },
    set: function(e) {
      this.geometry.getBuffer("aVertexPosition").data = e;
    },
    enumerable: !1,
    configurable: !0
  }), t.prototype.updateHorizontalVertices = function() {
    var e = this.vertices, i = this._getMinScale();
    e[9] = e[11] = e[13] = e[15] = this._topHeight * i, e[17] = e[19] = e[21] = e[23] = this._height - this._bottomHeight * i, e[25] = e[27] = e[29] = e[31] = this._height;
  }, t.prototype.updateVerticalVertices = function() {
    var e = this.vertices, i = this._getMinScale();
    e[2] = e[10] = e[18] = e[26] = this._leftWidth * i, e[4] = e[12] = e[20] = e[28] = this._width - this._rightWidth * i, e[6] = e[14] = e[22] = e[30] = this._width;
  }, t.prototype._getMinScale = function() {
    var e = this._leftWidth + this._rightWidth, i = this._width > e ? 1 : this._width / e, n = this._topHeight + this._bottomHeight, a = this._height > n ? 1 : this._height / n, o = Math.min(i, a);
    return o;
  }, Object.defineProperty(t.prototype, "width", {
    /** The width of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
    get: function() {
      return this._width;
    },
    set: function(e) {
      this._width = e, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "height", {
    /** The height of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
    get: function() {
      return this._height;
    },
    set: function(e) {
      this._height = e, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "leftWidth", {
    /** The width of the left column. */
    get: function() {
      return this._leftWidth;
    },
    set: function(e) {
      this._leftWidth = e, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "rightWidth", {
    /** The width of the right column. */
    get: function() {
      return this._rightWidth;
    },
    set: function(e) {
      this._rightWidth = e, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "topHeight", {
    /** The height of the top row. */
    get: function() {
      return this._topHeight;
    },
    set: function(e) {
      this._topHeight = e, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "bottomHeight", {
    /** The height of the bottom row. */
    get: function() {
      return this._bottomHeight;
    },
    set: function(e) {
      this._bottomHeight = e, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), t.prototype._refresh = function() {
    var e = this.texture, i = this.geometry.buffers[1].data;
    this._origWidth = e.orig.width, this._origHeight = e.orig.height;
    var n = 1 / this._origWidth, a = 1 / this._origHeight;
    i[0] = i[8] = i[16] = i[24] = 0, i[1] = i[3] = i[5] = i[7] = 0, i[6] = i[14] = i[22] = i[30] = 1, i[25] = i[27] = i[29] = i[31] = 1, i[2] = i[10] = i[18] = i[26] = n * this._leftWidth, i[4] = i[12] = i[20] = i[28] = 1 - n * this._rightWidth, i[9] = i[11] = i[13] = i[15] = a * this._topHeight, i[17] = i[19] = i[21] = i[23] = 1 - a * this._bottomHeight, this.updateHorizontalVertices(), this.updateVerticalVertices(), this.geometry.buffers[0].update(), this.geometry.buffers[1].update();
  }, t;
})(xb);
/*!
 * @pixi/sprite-animated - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/sprite-animated is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var yo = function(r, t) {
  return yo = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (e[n] = i[n]);
  }, yo(r, t);
};
function wb(r, t) {
  yo(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
(function(r) {
  wb(t, r);
  function t(e, i) {
    i === void 0 && (i = !0);
    var n = r.call(this, e[0] instanceof K ? e[0] : e[0].texture) || this;
    return n._textures = null, n._durations = null, n._autoUpdate = i, n._isConnectedToTicker = !1, n.animationSpeed = 1, n.loop = !0, n.updateAnchor = !1, n.onComplete = null, n.onFrameChange = null, n.onLoop = null, n._currentTime = 0, n._playing = !1, n._previousFrame = null, n.textures = e, n;
  }
  return t.prototype.stop = function() {
    this._playing && (this._playing = !1, this._autoUpdate && this._isConnectedToTicker && (Lt.shared.remove(this.update, this), this._isConnectedToTicker = !1));
  }, t.prototype.play = function() {
    this._playing || (this._playing = !0, this._autoUpdate && !this._isConnectedToTicker && (Lt.shared.add(this.update, this, we.HIGH), this._isConnectedToTicker = !0));
  }, t.prototype.gotoAndStop = function(e) {
    this.stop();
    var i = this.currentFrame;
    this._currentTime = e, i !== this.currentFrame && this.updateTexture();
  }, t.prototype.gotoAndPlay = function(e) {
    var i = this.currentFrame;
    this._currentTime = e, i !== this.currentFrame && this.updateTexture(), this.play();
  }, t.prototype.update = function(e) {
    if (this._playing) {
      var i = this.animationSpeed * e, n = this.currentFrame;
      if (this._durations !== null) {
        var a = this._currentTime % 1 * this._durations[this.currentFrame];
        for (a += i / 60 * 1e3; a < 0; )
          this._currentTime--, a += this._durations[this.currentFrame];
        var o = Math.sign(this.animationSpeed * e);
        for (this._currentTime = Math.floor(this._currentTime); a >= this._durations[this.currentFrame]; )
          a -= this._durations[this.currentFrame] * o, this._currentTime += o;
        this._currentTime += a / this._durations[this.currentFrame];
      } else
        this._currentTime += i;
      this._currentTime < 0 && !this.loop ? (this.gotoAndStop(0), this.onComplete && this.onComplete()) : this._currentTime >= this._textures.length && !this.loop ? (this.gotoAndStop(this._textures.length - 1), this.onComplete && this.onComplete()) : n !== this.currentFrame && (this.loop && this.onLoop && (this.animationSpeed > 0 && this.currentFrame < n ? this.onLoop() : this.animationSpeed < 0 && this.currentFrame > n && this.onLoop()), this.updateTexture());
    }
  }, t.prototype.updateTexture = function() {
    var e = this.currentFrame;
    this._previousFrame !== e && (this._previousFrame = e, this._texture = this._textures[e], this._textureID = -1, this._textureTrimmedID = -1, this._cachedTint = 16777215, this.uvs = this._texture._uvs.uvsFloat32, this.updateAnchor && this._anchor.copyFrom(this._texture.defaultAnchor), this.onFrameChange && this.onFrameChange(this.currentFrame));
  }, t.prototype.destroy = function(e) {
    this.stop(), r.prototype.destroy.call(this, e), this.onComplete = null, this.onFrameChange = null, this.onLoop = null;
  }, t.fromFrames = function(e) {
    for (var i = [], n = 0; n < e.length; ++n)
      i.push(K.from(e[n]));
    return new t(i);
  }, t.fromImages = function(e) {
    for (var i = [], n = 0; n < e.length; ++n)
      i.push(K.from(e[n]));
    return new t(i);
  }, Object.defineProperty(t.prototype, "totalFrames", {
    /**
     * The total number of frames in the AnimatedSprite. This is the same as number of textures
     * assigned to the AnimatedSprite.
     * @readonly
     * @default 0
     */
    get: function() {
      return this._textures.length;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "textures", {
    /** The array of textures used for this AnimatedSprite. */
    get: function() {
      return this._textures;
    },
    set: function(e) {
      if (e[0] instanceof K)
        this._textures = e, this._durations = null;
      else {
        this._textures = [], this._durations = [];
        for (var i = 0; i < e.length; i++)
          this._textures.push(e[i].texture), this._durations.push(e[i].time);
      }
      this._previousFrame = null, this.gotoAndStop(0), this.updateTexture();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "currentFrame", {
    /**
     * The AnimatedSprites current frame index.
     * @readonly
     */
    get: function() {
      var e = Math.floor(this._currentTime) % this._textures.length;
      return e < 0 && (e += this._textures.length), e;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "playing", {
    /**
     * Indicates if the AnimatedSprite is currently playing.
     * @readonly
     */
    get: function() {
      return this._playing;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(t.prototype, "autoUpdate", {
    /** Whether to use PIXI.Ticker.shared to auto update animation time. */
    get: function() {
      return this._autoUpdate;
    },
    set: function(e) {
      e !== this._autoUpdate && (this._autoUpdate = e, !this._autoUpdate && this._isConnectedToTicker ? (Lt.shared.remove(this.update, this), this._isConnectedToTicker = !1) : this._autoUpdate && !this._isConnectedToTicker && this._playing && (Lt.shared.add(this.update, this), this._isConnectedToTicker = !0));
    },
    enumerable: !1,
    configurable: !0
  }), t;
})(_i);
/*!
 * pixi.js - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * pixi.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
Pe.add(
  // Install renderer plugins
  om,
  pm,
  fm,
  o0,
  N0,
  il,
  X0,
  // Install loader plugins
  tb,
  Cm,
  r0,
  i0,
  L0,
  // Install application plugins
  Sy,
  Tm
);
var zt = /* @__PURE__ */ ((r) => (r.ELLIPSE = "ELLIPSE", r.POLYGON = "POLYGON", r.RECTANGLE = "RECTANGLE", r.FREEHAND = "FREEHAND", r))(zt || {});
const Rn = (r, t) => t, yl = (r) => {
  let t = 1 / 0, e = 1 / 0, i = -1 / 0, n = -1 / 0;
  return r.forEach(([a, o]) => {
    t = Math.min(t, a), e = Math.min(e, o), i = Math.max(i, a), n = Math.max(n, o);
  }), { minX: t, minY: e, maxX: i, maxY: n };
}, Sb = {
  area: (r) => Math.PI * r.geometry.rx * r.geometry.ry,
  intersects: (r, t, e) => {
    const { cx: i, cy: n, rx: a, ry: o } = r.geometry, s = 0, u = Math.cos(s), h = Math.sin(s), l = t - i, f = e - n, c = u * l + h * f, d = h * l - u * f;
    return c * c / (a * a) + d * d / (o * o) <= 1;
  }
};
Rn(zt.ELLIPSE, Sb);
const Pb = {
  area: (r) => {
    const { points: t } = r.geometry;
    let e = 0, i = t.length - 1;
    for (let n = 0; n < t.length; n++)
      e += (t[i][0] + t[n][0]) * (t[i][1] - t[n][1]), i = n;
    return Math.abs(0.5 * e);
  },
  intersects: (r, t, e) => {
    const { points: i } = r.geometry;
    let n = !1;
    for (let a = 0, o = i.length - 1; a < i.length; o = a++) {
      const s = i[a][0], u = i[a][1], h = i[o][0], l = i[o][1];
      u > e != l > e && t < (h - s) * (e - u) / (l - u) + s && (n = !n);
    }
    return n;
  }
};
Rn(zt.POLYGON, Pb);
const Ab = {
  area: (r) => r.geometry.w * r.geometry.h,
  intersects: (r, t, e) => t >= r.geometry.x && t <= r.geometry.x + r.geometry.w && e >= r.geometry.y && e <= r.geometry.y + r.geometry.h
};
Rn(zt.RECTANGLE, Ab);
const Rb = {
  area: (r) => {
    const { points: t } = r.geometry;
    let e = 0, i = t.length - 1;
    for (let n = 0; n < t.length; n++)
      e += (t[i][0] + t[n][0]) * (t[i][1] - t[n][1]), i = n;
    return Math.abs(0.5 * e);
  },
  intersects: (r, t, e) => {
    const { points: i } = r.geometry;
    let n = !1;
    for (let a = 0, o = i.length - 1; a < i.length; o = a++) {
      const s = i[a][0], u = i[a][1], h = i[o][0], l = i[o][1];
      u > e != l > e && t < (h - s) * (e - u) / (l - u) + s && (n = !n);
    }
    return n;
  }
};
Rn(zt.FREEHAND, Rb);
function Iu(r, t, e, i = (n) => n) {
  return r * i(0.5 - t * (0.5 - e));
}
function Ob(r) {
  return [-r[0], -r[1]];
}
function ee(r, t) {
  return [r[0] + t[0], r[1] + t[1]];
}
function qt(r, t) {
  return [r[0] - t[0], r[1] - t[1]];
}
function te(r, t) {
  return [r[0] * t, r[1] * t];
}
function Ib(r, t) {
  return [r[0] / t, r[1] / t];
}
function zr(r) {
  return [r[1], -r[0]];
}
function Cu(r, t) {
  return r[0] * t[0] + r[1] * t[1];
}
function Cb(r, t) {
  return r[0] === t[0] && r[1] === t[1];
}
function Mb(r) {
  return Math.hypot(r[0], r[1]);
}
function Db(r) {
  return r[0] * r[0] + r[1] * r[1];
}
function Mu(r, t) {
  return Db(qt(r, t));
}
function gl(r) {
  return Ib(r, Mb(r));
}
function Fb(r, t) {
  return Math.hypot(r[1] - t[1], r[0] - t[0]);
}
function Wr(r, t, e) {
  let i = Math.sin(e), n = Math.cos(e), a = r[0] - t[0], o = r[1] - t[1], s = a * n - o * i, u = a * i + o * n;
  return [s + t[0], u + t[1]];
}
function go(r, t, e) {
  return ee(r, te(qt(t, r), e));
}
function Du(r, t, e) {
  return ee(r, te(t, e));
}
var { min: gr, PI: Nb } = Math, Fu = 0.275, Yr = Nb + 1e-4;
function Bb(r, t = {}) {
  let { size: e = 16, smoothing: i = 0.5, thinning: n = 0.5, simulatePressure: a = !0, easing: o = (L) => L, start: s = {}, end: u = {}, last: h = !1 } = t, { cap: l = !0, easing: f = (L) => L * (2 - L) } = s, { cap: c = !0, easing: d = (L) => --L * L * L + 1 } = u;
  if (r.length === 0 || e <= 0)
    return [];
  let p = r[r.length - 1].runningLength, _ = s.taper === !1 ? 0 : s.taper === !0 ? Math.max(e, p) : s.taper, v = u.taper === !1 ? 0 : u.taper === !0 ? Math.max(e, p) : u.taper, y = Math.pow(e * i, 2), g = [], m = [], E = r.slice(0, 10).reduce((L, W) => {
    let H = W.pressure;
    if (a) {
      let C = gr(1, W.distance / e), M = gr(1, 1 - C);
      H = gr(1, L + (M - L) * (C * Fu));
    }
    return (L + H) / 2;
  }, r[0].pressure), b = Iu(e, n, r[r.length - 1].pressure, o), x, S = r[0].vector, A = r[0].point, w = A, P = A, O = w, F = !1;
  for (let L = 0; L < r.length; L++) {
    let { pressure: W } = r[L], { point: H, vector: C, distance: M, runningLength: j } = r[L];
    if (L < r.length - 1 && p - j < 3)
      continue;
    if (n) {
      if (a) {
        let Z = gr(1, M / e), et = gr(1, 1 - Z);
        W = gr(1, E + (et - E) * (Z * Fu));
      }
      b = Iu(e, n, W, o);
    } else
      b = e / 2;
    x === void 0 && (x = b);
    let J = j < _ ? f(j / _) : 1, tt = p - j < v ? d((p - j) / v) : 1;
    b = Math.max(0.01, b * Math.min(J, tt));
    let dt = (L < r.length - 1 ? r[L + 1] : r[L]).vector, $ = L < r.length - 1 ? Cu(C, dt) : 1, ht = Cu(C, S) < 0 && !F, _t = $ !== null && $ < 0;
    if (ht || _t) {
      let Z = te(zr(S), b);
      for (let et = 1 / 13, nt = 0; nt <= 1; nt += et)
        P = Wr(qt(H, Z), H, Yr * nt), g.push(P), O = Wr(ee(H, Z), H, Yr * -nt), m.push(O);
      A = P, w = O, _t && (F = !0);
      continue;
    }
    if (F = !1, L === r.length - 1) {
      let Z = te(zr(C), b);
      g.push(qt(H, Z)), m.push(ee(H, Z));
      continue;
    }
    let mt = te(zr(go(dt, C, $)), b);
    P = qt(H, mt), (L <= 1 || Mu(A, P) > y) && (g.push(P), A = P), O = ee(H, mt), (L <= 1 || Mu(w, O) > y) && (m.push(O), w = O), E = W, S = C;
  }
  let D = r[0].point.slice(0, 2), I = r.length > 1 ? r[r.length - 1].point.slice(0, 2) : ee(r[0].point, [1, 1]), R = [], N = [];
  if (r.length === 1) {
    if (!(_ || v) || h) {
      let L = Du(D, gl(zr(qt(D, I))), -(x || b)), W = [];
      for (let H = 1 / 13, C = H; C <= 1; C += H)
        W.push(Wr(L, D, Yr * 2 * C));
      return W;
    }
  } else {
    if (!(_ || v && r.length === 1))
      if (l)
        for (let W = 1 / 13, H = W; H <= 1; H += W) {
          let C = Wr(m[0], D, Yr * H);
          R.push(C);
        }
      else {
        let W = qt(g[0], m[0]), H = te(W, 0.5), C = te(W, 0.51);
        R.push(qt(D, H), qt(D, C), ee(D, C), ee(D, H));
      }
    let L = zr(Ob(r[r.length - 1].vector));
    if (v || _ && r.length === 1)
      N.push(I);
    else if (c) {
      let W = Du(I, L, b);
      for (let H = 1 / 29, C = H; C < 1; C += H)
        N.push(Wr(W, I, Yr * 3 * C));
    } else
      N.push(ee(I, te(L, b)), ee(I, te(L, b * 0.99)), qt(I, te(L, b * 0.99)), qt(I, te(L, b)));
  }
  return g.concat(N, m.reverse(), R);
}
function Lb(r, t = {}) {
  var e;
  let { streamline: i = 0.5, size: n = 16, last: a = !1 } = t;
  if (r.length === 0)
    return [];
  let o = 0.15 + (1 - i) * 0.85, s = Array.isArray(r[0]) ? r : r.map(({ x: d, y: p, pressure: _ = 0.5 }) => [d, p, _]);
  if (s.length === 2) {
    let d = s[1];
    s = s.slice(0, -1);
    for (let p = 1; p < 5; p++)
      s.push(go(s[0], d, p / 4));
  }
  s.length === 1 && (s = [...s, [...ee(s[0], [1, 1]), ...s[0].slice(2)]]);
  let u = [{ point: [s[0][0], s[0][1]], pressure: s[0][2] >= 0 ? s[0][2] : 0.25, vector: [1, 1], distance: 0, runningLength: 0 }], h = !1, l = 0, f = u[0], c = s.length - 1;
  for (let d = 1; d < s.length; d++) {
    let p = a && d === c ? s[d].slice(0, 2) : go(f.point, s[d], o);
    if (Cb(f.point, p))
      continue;
    let _ = Fb(p, f.point);
    if (l += _, d < c && !h) {
      if (l < n)
        continue;
      h = !0;
    }
    f = { point: p, pressure: s[d][2] >= 0 ? s[d][2] : 0.5, vector: gl(qt(f.point, p)), distance: _, runningLength: l }, u.push(f);
  }
  return u[0].vector = ((e = u[1]) == null ? void 0 : e.vector) || [0, 0], u;
}
function ml(r, t = {}) {
  return Bb(Lb(r, t), t);
}
function Ub(r, t) {
  var e = r[0] - t[0], i = r[1] - t[1];
  return e * e + i * i;
}
function Gb(r, t, e) {
  var i = t[0], n = t[1], a = e[0] - i, o = e[1] - n;
  if (a !== 0 || o !== 0) {
    var s = ((r[0] - i) * a + (r[1] - n) * o) / (a * a + o * o);
    s > 1 ? (i = e[0], n = e[1]) : s > 0 && (i += a * s, n += o * s);
  }
  return a = r[0] - i, o = r[1] - n, a * a + o * o;
}
function kb(r, t) {
  for (var e = r[0], i = [e], n, a = 1, o = r.length; a < o; a++)
    n = r[a], Ub(n, e) > t && (i.push(n), e = n);
  return e !== n && i.push(n), i;
}
function mo(r, t, e, i, n) {
  for (var a = i, o, s = t + 1; s < e; s++) {
    var u = Gb(r[s], r[t], r[e]);
    u > a && (o = s, a = u);
  }
  a > i && (o - t > 1 && mo(r, t, o, i, n), n.push(r[o]), e - o > 1 && mo(r, o, e, i, n));
}
function Hb(r, t) {
  var e = r.length - 1, i = [r[0]];
  return mo(r, 0, e, t, i), i.push(r[e]), i;
}
function Xb(r, t, e) {
  if (r.length <= 2)
    return r;
  var i = t !== void 0 ? t * t : 1;
  return r = e ? r : kb(r, i), r = Hb(r, i), r;
}
const jb = {
  size: 4,
  thinning: 0.5,
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
function Vb(r) {
  if (!r.length)
    return "";
  const t = r.reduce(
    (e, [i, n], a, o) => {
      const [s, u] = o[(a + 1) % o.length];
      return e.push(i, n, (i + s) / 2, (n + u) / 2), e;
    },
    ["M", ...r[0], "Q"]
  );
  return t.push("Z"), t.join(" ");
}
function zb(r, t, e = !1) {
  const i = ml(r, t);
  return Vb(
    e ? Xb(i, 0.25) : i
  );
}
let Yi;
const Wb = new Uint8Array(16);
function Yb() {
  if (!Yi && (Yi = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !Yi))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return Yi(Wb);
}
const Nt = [];
for (let r = 0; r < 256; ++r)
  Nt.push((r + 256).toString(16).slice(1));
function qb(r, t = 0) {
  return Nt[r[t + 0]] + Nt[r[t + 1]] + Nt[r[t + 2]] + Nt[r[t + 3]] + "-" + Nt[r[t + 4]] + Nt[r[t + 5]] + "-" + Nt[r[t + 6]] + Nt[r[t + 7]] + "-" + Nt[r[t + 8]] + Nt[r[t + 9]] + "-" + Nt[r[t + 10]] + Nt[r[t + 11]] + Nt[r[t + 12]] + Nt[r[t + 13]] + Nt[r[t + 14]] + Nt[r[t + 15]];
}
const Zb = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), Nu = {
  randomUUID: Zb
};
function Kb(r, t, e) {
  if (Nu.randomUUID && !t && !r)
    return Nu.randomUUID();
  r = r || {};
  const i = r.random || (r.rng || Yb)();
  if (i[6] = i[6] & 15 | 64, i[8] = i[8] & 63 | 128, t) {
    e = e || 0;
    for (let n = 0; n < 16; ++n)
      t[e + n] = i[n];
    return t;
  }
  return qb(i);
}
function Bu(r, t, e) {
  const i = r.slice();
  return i[11] = t[e], i[13] = e, i;
}
function Lu(r) {
  let t, e, i, n, a;
  return {
    c() {
      t = ut("rect"), T(t, "class", "a9s-corner-handle"), T(t, "x", e = /*point*/
      r[11][0] - /*handleSize*/
      r[3] / 2), T(t, "y", i = /*point*/
      r[11][1] - /*handleSize*/
      r[3] / 2), T(
        t,
        "height",
        /*handleSize*/
        r[3]
      ), T(
        t,
        "width",
        /*handleSize*/
        r[3]
      );
    },
    m(o, s) {
      q(o, t, s), n || (a = St(t, "pointerdown", function() {
        Tt(
          /*grab*/
          r[10](G(
            /*idx*/
            r[13]
          ))
        ) && r[10](G(
          /*idx*/
          r[13]
        )).apply(this, arguments);
      }), n = !0);
    },
    p(o, s) {
      r = o, s & /*geom, handleSize*/
      24 && e !== (e = /*point*/
      r[11][0] - /*handleSize*/
      r[3] / 2) && T(t, "x", e), s & /*geom, handleSize*/
      24 && i !== (i = /*point*/
      r[11][1] - /*handleSize*/
      r[3] / 2) && T(t, "y", i), s & /*handleSize*/
      8 && T(
        t,
        "height",
        /*handleSize*/
        r[3]
      ), s & /*handleSize*/
      8 && T(
        t,
        "width",
        /*handleSize*/
        r[3]
      );
    },
    d(o) {
      o && Y(t), n = !1, a();
    }
  };
}
function $b(r) {
  let t, e, i, n, a, o, s, u, h, l, f = (
    /*geom*/
    r[4].points
  ), c = [];
  for (let d = 0; d < f.length; d += 1)
    c[d] = Lu(Bu(r, f, d));
  return {
    c() {
      t = ut("polygon"), n = Gt(), a = ut("polygon"), s = Gt();
      for (let d = 0; d < c.length; d += 1)
        c[d].c();
      u = ur(), T(t, "class", "a9s-outer"), T(t, "style", e = /*computedStyle*/
      r[1] ? "display:none;" : void 0), T(t, "points", i = /*geom*/
      r[4].points.map(Uu).join(" ")), T(a, "class", "a9s-inner a9s-shape-handle"), T(
        a,
        "style",
        /*computedStyle*/
        r[1]
      ), T(a, "points", o = /*geom*/
      r[4].points.map(Gu).join(" "));
    },
    m(d, p) {
      q(d, t, p), q(d, n, p), q(d, a, p), q(d, s, p);
      for (let _ = 0; _ < c.length; _ += 1)
        c[_] && c[_].m(d, p);
      q(d, u, p), h || (l = [
        St(t, "pointerdown", function() {
          Tt(
            /*grab*/
            r[10](G.SHAPE)
          ) && r[10](G.SHAPE).apply(this, arguments);
        }),
        St(a, "pointerdown", function() {
          Tt(
            /*grab*/
            r[10](G.SHAPE)
          ) && r[10](G.SHAPE).apply(this, arguments);
        })
      ], h = !0);
    },
    p(d, p) {
      if (r = d, p & /*computedStyle*/
      2 && e !== (e = /*computedStyle*/
      r[1] ? "display:none;" : void 0) && T(t, "style", e), p & /*geom*/
      16 && i !== (i = /*geom*/
      r[4].points.map(Uu).join(" ")) && T(t, "points", i), p & /*computedStyle*/
      2 && T(
        a,
        "style",
        /*computedStyle*/
        r[1]
      ), p & /*geom*/
      16 && o !== (o = /*geom*/
      r[4].points.map(Gu).join(" ")) && T(a, "points", o), p & /*geom, handleSize, grab, Handle*/
      1048) {
        f = /*geom*/
        r[4].points;
        let _;
        for (_ = 0; _ < f.length; _ += 1) {
          const v = Bu(r, f, _);
          c[_] ? c[_].p(v, p) : (c[_] = Lu(v), c[_].c(), c[_].m(u.parentNode, u));
        }
        for (; _ < c.length; _ += 1)
          c[_].d(1);
        c.length = f.length;
      }
    },
    d(d) {
      d && Y(t), d && Y(n), d && Y(a), d && Y(s), wo(c, d), d && Y(u), h = !1, Se(l);
    }
  };
}
function Qb(r) {
  let t, e;
  return t = new On({
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
          $b,
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
      Kt(t.$$.fragment);
    },
    m(i, n) {
      Wt(t, i, n), e = !0;
    },
    p(i, [n]) {
      const a = {};
      n & /*shape*/
      1 && (a.shape = /*shape*/
      i[0]), n & /*transform*/
      4 && (a.transform = /*transform*/
      i[2]), n & /*$$scope, geom, handleSize, grab, computedStyle*/
      17434 && (a.$$scope = { dirty: n, ctx: i }), t.$set(a);
    },
    i(i) {
      e || (at(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Yt(t, i);
    }
  };
}
const Uu = (r) => r.join(","), Gu = (r) => r.join(",");
function Jb(r, t, e) {
  let i, n, { shape: a } = t, { computedStyle: o = void 0 } = t, { transform: s } = t, { viewportScale: u = 1 } = t;
  const h = (d, p, _) => {
    let v;
    p === G.SHAPE ? v = d.geometry.points.map(([g, m]) => [g + _[0], m + _[1]]) : v = d.geometry.points.map(([g, m], E) => p === G(E) ? [g + _[0], m + _[1]] : [g, m]);
    const y = yl(v);
    return { ...d, geometry: { points: v, bounds: y } };
  };
  function l(d) {
    Zt.call(this, r, d);
  }
  function f(d) {
    Zt.call(this, r, d);
  }
  function c(d) {
    Zt.call(this, r, d);
  }
  return r.$$set = (d) => {
    "shape" in d && e(0, a = d.shape), "computedStyle" in d && e(1, o = d.computedStyle), "transform" in d && e(2, s = d.transform), "viewportScale" in d && e(6, u = d.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*shape*/
    1 && e(4, i = a.geometry), r.$$.dirty & /*viewportScale*/
    64 && e(3, n = 10 / u);
  }, [
    a,
    o,
    s,
    n,
    i,
    h,
    u,
    l,
    f,
    c
  ];
}
class t1 extends jt {
  constructor(t) {
    super(), Xt(this, t, Jb, Qb, Ht, {
      shape: 0,
      computedStyle: 1,
      transform: 2,
      viewportScale: 6
    });
  }
}
function e1(r) {
  let t, e, i, n, a, o, s, u, h, l, f, c, d, p, _, v, y, g, m, E, b, x, S, A, w, P, O, F, D, I, R, N, L, W, H, C, M, j, J, tt, dt, $, ht, _t, mt, Z, et, nt, pt, rt;
  return {
    c() {
      t = ut("rect"), s = Gt(), u = ut("rect"), d = Gt(), p = ut("rect"), g = Gt(), m = ut("rect"), S = Gt(), A = ut("rect"), F = Gt(), D = ut("rect"), L = Gt(), W = ut("rect"), M = Gt(), j = ut("rect"), dt = Gt(), $ = ut("rect"), mt = Gt(), Z = ut("rect"), T(t, "class", "a9s-outer"), T(t, "style", e = /*computedStyle*/
      r[1] ? "display:none;" : void 0), T(t, "x", i = /*geom*/
      r[4].x), T(t, "y", n = /*geom*/
      r[4].y), T(t, "width", a = /*geom*/
      r[4].w), T(t, "height", o = /*geom*/
      r[4].h), T(u, "class", "a9s-inner a9s-shape-handle"), T(
        u,
        "style",
        /*computedStyle*/
        r[1]
      ), T(u, "x", h = /*geom*/
      r[4].x), T(u, "y", l = /*geom*/
      r[4].y), T(u, "width", f = /*geom*/
      r[4].w), T(u, "height", c = /*geom*/
      r[4].h), T(p, "class", "a9s-edge-handle a9s-edge-handle-top"), T(p, "x", _ = /*geom*/
      r[4].x), T(p, "y", v = /*geom*/
      r[4].y), T(p, "height", 1), T(p, "width", y = /*geom*/
      r[4].w), T(m, "class", "a9s-edge-handle a9s-edge-handle-right"), T(m, "x", E = /*geom*/
      r[4].x + /*geom*/
      r[4].w), T(m, "y", b = /*geom*/
      r[4].y), T(m, "height", x = /*geom*/
      r[4].h), T(m, "width", 1), T(A, "class", "a9s-edge-handle a9s-edge-handle-bottom"), T(A, "x", w = /*geom*/
      r[4].x), T(A, "y", P = /*geom*/
      r[4].y + /*geom*/
      r[4].h), T(A, "height", 1), T(A, "width", O = /*geom*/
      r[4].w), T(D, "class", "a9s-edge-handle a9s-edge-handle-left"), T(D, "x", I = /*geom*/
      r[4].x), T(D, "y", R = /*geom*/
      r[4].y), T(D, "height", N = /*geom*/
      r[4].h), T(D, "width", 1), T(W, "class", "a9s-corner-handle a9s-corner-handle-topleft"), T(W, "x", H = /*geom*/
      r[4].x - /*handleSize*/
      r[3] / 2), T(W, "y", C = /*geom*/
      r[4].y - /*handleSize*/
      r[3] / 2), T(
        W,
        "height",
        /*handleSize*/
        r[3]
      ), T(
        W,
        "width",
        /*handleSize*/
        r[3]
      ), T(j, "class", "a9s-corner-handle a9s-corner-handle-topright"), T(j, "x", J = /*geom*/
      r[4].x + /*geom*/
      r[4].w - /*handleSize*/
      r[3] / 2), T(j, "y", tt = /*geom*/
      r[4].y - /*handleSize*/
      r[3] / 2), T(
        j,
        "height",
        /*handleSize*/
        r[3]
      ), T(
        j,
        "width",
        /*handleSize*/
        r[3]
      ), T($, "class", "a9s-corner-handle a9s-corner-handle-bottomright"), T($, "x", ht = /*geom*/
      r[4].x + /*geom*/
      r[4].w - /*handleSize*/
      r[3] / 2), T($, "y", _t = /*geom*/
      r[4].y + /*geom*/
      r[4].h - /*handleSize*/
      r[3] / 2), T(
        $,
        "height",
        /*handleSize*/
        r[3]
      ), T(
        $,
        "width",
        /*handleSize*/
        r[3]
      ), T(Z, "class", "a9s-corner-handle a9s-corner-handle-bottomleft"), T(Z, "x", et = /*geom*/
      r[4].x - /*handleSize*/
      r[3] / 2), T(Z, "y", nt = /*geom*/
      r[4].y + /*geom*/
      r[4].h - /*handleSize*/
      r[3] / 2), T(
        Z,
        "height",
        /*handleSize*/
        r[3]
      ), T(
        Z,
        "width",
        /*handleSize*/
        r[3]
      );
    },
    m(X, U) {
      q(X, t, U), q(X, s, U), q(X, u, U), q(X, d, U), q(X, p, U), q(X, g, U), q(X, m, U), q(X, S, U), q(X, A, U), q(X, F, U), q(X, D, U), q(X, L, U), q(X, W, U), q(X, M, U), q(X, j, U), q(X, dt, U), q(X, $, U), q(X, mt, U), q(X, Z, U), pt || (rt = [
        St(t, "pointerdown", function() {
          Tt(
            /*grab*/
            r[10](G.SHAPE)
          ) && r[10](G.SHAPE).apply(this, arguments);
        }),
        St(u, "pointerdown", function() {
          Tt(
            /*grab*/
            r[10](G.SHAPE)
          ) && r[10](G.SHAPE).apply(this, arguments);
        }),
        St(p, "pointerdown", function() {
          Tt(
            /*grab*/
            r[10](G.TOP)
          ) && r[10](G.TOP).apply(this, arguments);
        }),
        St(m, "pointerdown", function() {
          Tt(
            /*grab*/
            r[10](G.RIGHT)
          ) && r[10](G.RIGHT).apply(this, arguments);
        }),
        St(A, "pointerdown", function() {
          Tt(
            /*grab*/
            r[10](G.BOTTOM)
          ) && r[10](G.BOTTOM).apply(this, arguments);
        }),
        St(D, "pointerdown", function() {
          Tt(
            /*grab*/
            r[10](G.LEFT)
          ) && r[10](G.LEFT).apply(this, arguments);
        }),
        St(W, "pointerdown", function() {
          Tt(
            /*grab*/
            r[10](G.TOP_LEFT)
          ) && r[10](G.TOP_LEFT).apply(this, arguments);
        }),
        St(j, "pointerdown", function() {
          Tt(
            /*grab*/
            r[10](G.TOP_RIGHT)
          ) && r[10](G.TOP_RIGHT).apply(this, arguments);
        }),
        St($, "pointerdown", function() {
          Tt(
            /*grab*/
            r[10](G.BOTTOM_RIGHT)
          ) && r[10](G.BOTTOM_RIGHT).apply(this, arguments);
        }),
        St(Z, "pointerdown", function() {
          Tt(
            /*grab*/
            r[10](G.BOTTOM_LEFT)
          ) && r[10](G.BOTTOM_LEFT).apply(this, arguments);
        })
      ], pt = !0);
    },
    p(X, U) {
      r = X, U & /*computedStyle*/
      2 && e !== (e = /*computedStyle*/
      r[1] ? "display:none;" : void 0) && T(t, "style", e), U & /*geom*/
      16 && i !== (i = /*geom*/
      r[4].x) && T(t, "x", i), U & /*geom*/
      16 && n !== (n = /*geom*/
      r[4].y) && T(t, "y", n), U & /*geom*/
      16 && a !== (a = /*geom*/
      r[4].w) && T(t, "width", a), U & /*geom*/
      16 && o !== (o = /*geom*/
      r[4].h) && T(t, "height", o), U & /*computedStyle*/
      2 && T(
        u,
        "style",
        /*computedStyle*/
        r[1]
      ), U & /*geom*/
      16 && h !== (h = /*geom*/
      r[4].x) && T(u, "x", h), U & /*geom*/
      16 && l !== (l = /*geom*/
      r[4].y) && T(u, "y", l), U & /*geom*/
      16 && f !== (f = /*geom*/
      r[4].w) && T(u, "width", f), U & /*geom*/
      16 && c !== (c = /*geom*/
      r[4].h) && T(u, "height", c), U & /*geom*/
      16 && _ !== (_ = /*geom*/
      r[4].x) && T(p, "x", _), U & /*geom*/
      16 && v !== (v = /*geom*/
      r[4].y) && T(p, "y", v), U & /*geom*/
      16 && y !== (y = /*geom*/
      r[4].w) && T(p, "width", y), U & /*geom*/
      16 && E !== (E = /*geom*/
      r[4].x + /*geom*/
      r[4].w) && T(m, "x", E), U & /*geom*/
      16 && b !== (b = /*geom*/
      r[4].y) && T(m, "y", b), U & /*geom*/
      16 && x !== (x = /*geom*/
      r[4].h) && T(m, "height", x), U & /*geom*/
      16 && w !== (w = /*geom*/
      r[4].x) && T(A, "x", w), U & /*geom*/
      16 && P !== (P = /*geom*/
      r[4].y + /*geom*/
      r[4].h) && T(A, "y", P), U & /*geom*/
      16 && O !== (O = /*geom*/
      r[4].w) && T(A, "width", O), U & /*geom*/
      16 && I !== (I = /*geom*/
      r[4].x) && T(D, "x", I), U & /*geom*/
      16 && R !== (R = /*geom*/
      r[4].y) && T(D, "y", R), U & /*geom*/
      16 && N !== (N = /*geom*/
      r[4].h) && T(D, "height", N), U & /*geom, handleSize*/
      24 && H !== (H = /*geom*/
      r[4].x - /*handleSize*/
      r[3] / 2) && T(W, "x", H), U & /*geom, handleSize*/
      24 && C !== (C = /*geom*/
      r[4].y - /*handleSize*/
      r[3] / 2) && T(W, "y", C), U & /*handleSize*/
      8 && T(
        W,
        "height",
        /*handleSize*/
        r[3]
      ), U & /*handleSize*/
      8 && T(
        W,
        "width",
        /*handleSize*/
        r[3]
      ), U & /*geom, handleSize*/
      24 && J !== (J = /*geom*/
      r[4].x + /*geom*/
      r[4].w - /*handleSize*/
      r[3] / 2) && T(j, "x", J), U & /*geom, handleSize*/
      24 && tt !== (tt = /*geom*/
      r[4].y - /*handleSize*/
      r[3] / 2) && T(j, "y", tt), U & /*handleSize*/
      8 && T(
        j,
        "height",
        /*handleSize*/
        r[3]
      ), U & /*handleSize*/
      8 && T(
        j,
        "width",
        /*handleSize*/
        r[3]
      ), U & /*geom, handleSize*/
      24 && ht !== (ht = /*geom*/
      r[4].x + /*geom*/
      r[4].w - /*handleSize*/
      r[3] / 2) && T($, "x", ht), U & /*geom, handleSize*/
      24 && _t !== (_t = /*geom*/
      r[4].y + /*geom*/
      r[4].h - /*handleSize*/
      r[3] / 2) && T($, "y", _t), U & /*handleSize*/
      8 && T(
        $,
        "height",
        /*handleSize*/
        r[3]
      ), U & /*handleSize*/
      8 && T(
        $,
        "width",
        /*handleSize*/
        r[3]
      ), U & /*geom, handleSize*/
      24 && et !== (et = /*geom*/
      r[4].x - /*handleSize*/
      r[3] / 2) && T(Z, "x", et), U & /*geom, handleSize*/
      24 && nt !== (nt = /*geom*/
      r[4].y + /*geom*/
      r[4].h - /*handleSize*/
      r[3] / 2) && T(Z, "y", nt), U & /*handleSize*/
      8 && T(
        Z,
        "height",
        /*handleSize*/
        r[3]
      ), U & /*handleSize*/
      8 && T(
        Z,
        "width",
        /*handleSize*/
        r[3]
      );
    },
    d(X) {
      X && Y(t), X && Y(s), X && Y(u), X && Y(d), X && Y(p), X && Y(g), X && Y(m), X && Y(S), X && Y(A), X && Y(F), X && Y(D), X && Y(L), X && Y(W), X && Y(M), X && Y(j), X && Y(dt), X && Y($), X && Y(mt), X && Y(Z), pt = !1, Se(rt);
    }
  };
}
function r1(r) {
  let t, e;
  return t = new On({
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
          e1,
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
      Kt(t.$$.fragment);
    },
    m(i, n) {
      Wt(t, i, n), e = !0;
    },
    p(i, [n]) {
      const a = {};
      n & /*shape*/
      1 && (a.shape = /*shape*/
      i[0]), n & /*transform*/
      4 && (a.transform = /*transform*/
      i[2]), n & /*$$scope, geom, handleSize, grab, computedStyle*/
      3098 && (a.$$scope = { dirty: n, ctx: i }), t.$set(a);
    },
    i(i) {
      e || (at(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Yt(t, i);
    }
  };
}
function i1(r, t, e) {
  let i, n, { shape: a } = t, { computedStyle: o = void 0 } = t, { transform: s } = t, { viewportScale: u = 1 } = t;
  const h = (d, p, _) => {
    const v = d.geometry.bounds;
    let [y, g] = [v.minX, v.minY], [m, E] = [v.maxX, v.maxY];
    const [b, x] = _;
    if (p === G.SHAPE)
      y += b, m += b, g += x, E += x;
    else {
      switch (p) {
        case G.TOP:
        case G.TOP_LEFT:
        case G.TOP_RIGHT: {
          g += x;
          break;
        }
        case G.BOTTOM:
        case G.BOTTOM_LEFT:
        case G.BOTTOM_RIGHT: {
          E += x;
          break;
        }
      }
      switch (p) {
        case G.LEFT:
        case G.TOP_LEFT:
        case G.BOTTOM_LEFT: {
          y += b;
          break;
        }
        case G.RIGHT:
        case G.TOP_RIGHT:
        case G.BOTTOM_RIGHT: {
          m += b;
          break;
        }
      }
    }
    const S = Math.min(y, m), A = Math.min(g, E), w = Math.abs(m - y), P = Math.abs(E - g);
    return {
      ...d,
      geometry: {
        x: S,
        y: A,
        w,
        h: P,
        bounds: {
          minX: S,
          minY: A,
          maxX: S + w,
          maxY: A + P
        }
      }
    };
  };
  function l(d) {
    Zt.call(this, r, d);
  }
  function f(d) {
    Zt.call(this, r, d);
  }
  function c(d) {
    Zt.call(this, r, d);
  }
  return r.$$set = (d) => {
    "shape" in d && e(0, a = d.shape), "computedStyle" in d && e(1, o = d.computedStyle), "transform" in d && e(2, s = d.transform), "viewportScale" in d && e(6, u = d.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*shape*/
    1 && e(4, i = a.geometry), r.$$.dirty & /*viewportScale*/
    64 && e(3, n = 10 / u);
  }, [
    a,
    o,
    s,
    n,
    i,
    h,
    u,
    l,
    f,
    c
  ];
}
class n1 extends jt {
  constructor(t) {
    super(), Xt(this, t, i1, r1, Ht, {
      shape: 0,
      computedStyle: 1,
      transform: 2,
      viewportScale: 6
    });
  }
}
function a1(r) {
  let t, e, i, n, a, o, s, u, h, l, f, c, d, p, _, v, y, g, m, E, b, x, S, A, w, P, O, F, D;
  return {
    c() {
      t = ut("ellipse"), o = Gt(), s = ut("ellipse"), c = Gt(), d = ut("rect"), v = Gt(), y = ut("rect"), E = Gt(), b = ut("rect"), A = Gt(), w = ut("rect"), T(t, "class", "a9s-outer"), T(t, "cx", e = /*geom*/
      r[3].cx), T(t, "cy", i = /*geom*/
      r[3].cy), T(t, "rx", n = /*geom*/
      r[3].rx), T(t, "ry", a = /*geom*/
      r[3].ry), T(s, "class", "a9s-inner a9s-shape-handle"), T(s, "cx", u = /*geom*/
      r[3].cx), T(s, "cy", h = /*geom*/
      r[3].cy), T(s, "rx", l = /*geom*/
      r[3].rx), T(s, "ry", f = /*geom*/
      r[3].ry), T(d, "class", "a9s-corner-handle a9s-corner-top"), T(d, "x", p = /*geom*/
      r[3].cx - /*handleSize*/
      r[2] / 2), T(d, "y", _ = /*geom*/
      r[3].cy - /*handleSize*/
      r[2] / 2 - /*geom*/
      r[3].ry), T(
        d,
        "height",
        /*handleSize*/
        r[2]
      ), T(
        d,
        "width",
        /*handleSize*/
        r[2]
      ), T(y, "class", "a9s-corner-handle a9s-corner-handle-right"), T(y, "x", g = /*geom*/
      r[3].cx + /*geom*/
      r[3].rx - /*handleSize*/
      r[2] / 2), T(y, "y", m = /*geom*/
      r[3].cy - /*handleSize*/
      r[2] / 2), T(
        y,
        "height",
        /*handleSize*/
        r[2]
      ), T(
        y,
        "width",
        /*handleSize*/
        r[2]
      ), T(b, "class", "a9s-corner-handle a9s-corner-handle-bottom"), T(b, "x", x = /*geom*/
      r[3].cx - /*handleSize*/
      r[2] / 2), T(b, "y", S = /*geom*/
      r[3].cy + /*geom*/
      r[3].ry - /*handleSize*/
      r[2] / 2), T(
        b,
        "height",
        /*handleSize*/
        r[2]
      ), T(
        b,
        "width",
        /*handleSize*/
        r[2]
      ), T(w, "class", "a9s-corner-handle a9s-corner-handle-left"), T(w, "x", P = /*geom*/
      r[3].cx - /*geom*/
      r[3].rx - /*handleSize*/
      r[2] / 2), T(w, "y", O = /*geom*/
      r[3].cy - /*handleSize*/
      r[2] / 2), T(
        w,
        "height",
        /*handleSize*/
        r[2]
      ), T(
        w,
        "width",
        /*handleSize*/
        r[2]
      );
    },
    m(I, R) {
      q(I, t, R), q(I, o, R), q(I, s, R), q(I, c, R), q(I, d, R), q(I, v, R), q(I, y, R), q(I, E, R), q(I, b, R), q(I, A, R), q(I, w, R), F || (D = [
        St(t, "pointerdown", function() {
          Tt(
            /*grab*/
            r[9](G.SHAPE)
          ) && r[9](G.SHAPE).apply(this, arguments);
        }),
        St(s, "pointerdown", function() {
          Tt(
            /*grab*/
            r[9](G.SHAPE)
          ) && r[9](G.SHAPE).apply(this, arguments);
        }),
        St(d, "pointerdown", function() {
          Tt(
            /*grab*/
            r[9](G.TOP)
          ) && r[9](G.TOP).apply(this, arguments);
        }),
        St(y, "pointerdown", function() {
          Tt(
            /*grab*/
            r[9](G.RIGHT)
          ) && r[9](G.RIGHT).apply(this, arguments);
        }),
        St(b, "pointerdown", function() {
          Tt(
            /*grab*/
            r[9](G.BOTTOM)
          ) && r[9](G.BOTTOM).apply(this, arguments);
        }),
        St(w, "pointerdown", function() {
          Tt(
            /*grab*/
            r[9](G.LEFT)
          ) && r[9](G.LEFT).apply(this, arguments);
        })
      ], F = !0);
    },
    p(I, R) {
      r = I, R & /*geom*/
      8 && e !== (e = /*geom*/
      r[3].cx) && T(t, "cx", e), R & /*geom*/
      8 && i !== (i = /*geom*/
      r[3].cy) && T(t, "cy", i), R & /*geom*/
      8 && n !== (n = /*geom*/
      r[3].rx) && T(t, "rx", n), R & /*geom*/
      8 && a !== (a = /*geom*/
      r[3].ry) && T(t, "ry", a), R & /*geom*/
      8 && u !== (u = /*geom*/
      r[3].cx) && T(s, "cx", u), R & /*geom*/
      8 && h !== (h = /*geom*/
      r[3].cy) && T(s, "cy", h), R & /*geom*/
      8 && l !== (l = /*geom*/
      r[3].rx) && T(s, "rx", l), R & /*geom*/
      8 && f !== (f = /*geom*/
      r[3].ry) && T(s, "ry", f), R & /*geom, handleSize*/
      12 && p !== (p = /*geom*/
      r[3].cx - /*handleSize*/
      r[2] / 2) && T(d, "x", p), R & /*geom, handleSize*/
      12 && _ !== (_ = /*geom*/
      r[3].cy - /*handleSize*/
      r[2] / 2 - /*geom*/
      r[3].ry) && T(d, "y", _), R & /*handleSize*/
      4 && T(
        d,
        "height",
        /*handleSize*/
        r[2]
      ), R & /*handleSize*/
      4 && T(
        d,
        "width",
        /*handleSize*/
        r[2]
      ), R & /*geom, handleSize*/
      12 && g !== (g = /*geom*/
      r[3].cx + /*geom*/
      r[3].rx - /*handleSize*/
      r[2] / 2) && T(y, "x", g), R & /*geom, handleSize*/
      12 && m !== (m = /*geom*/
      r[3].cy - /*handleSize*/
      r[2] / 2) && T(y, "y", m), R & /*handleSize*/
      4 && T(
        y,
        "height",
        /*handleSize*/
        r[2]
      ), R & /*handleSize*/
      4 && T(
        y,
        "width",
        /*handleSize*/
        r[2]
      ), R & /*geom, handleSize*/
      12 && x !== (x = /*geom*/
      r[3].cx - /*handleSize*/
      r[2] / 2) && T(b, "x", x), R & /*geom, handleSize*/
      12 && S !== (S = /*geom*/
      r[3].cy + /*geom*/
      r[3].ry - /*handleSize*/
      r[2] / 2) && T(b, "y", S), R & /*handleSize*/
      4 && T(
        b,
        "height",
        /*handleSize*/
        r[2]
      ), R & /*handleSize*/
      4 && T(
        b,
        "width",
        /*handleSize*/
        r[2]
      ), R & /*geom, handleSize*/
      12 && P !== (P = /*geom*/
      r[3].cx - /*geom*/
      r[3].rx - /*handleSize*/
      r[2] / 2) && T(w, "x", P), R & /*geom, handleSize*/
      12 && O !== (O = /*geom*/
      r[3].cy - /*handleSize*/
      r[2] / 2) && T(w, "y", O), R & /*handleSize*/
      4 && T(
        w,
        "height",
        /*handleSize*/
        r[2]
      ), R & /*handleSize*/
      4 && T(
        w,
        "width",
        /*handleSize*/
        r[2]
      );
    },
    d(I) {
      I && Y(t), I && Y(o), I && Y(s), I && Y(c), I && Y(d), I && Y(v), I && Y(y), I && Y(E), I && Y(b), I && Y(A), I && Y(w), F = !1, Se(D);
    }
  };
}
function o1(r) {
  let t, e;
  return t = new On({
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
          a1,
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
      Kt(t.$$.fragment);
    },
    m(i, n) {
      Wt(t, i, n), e = !0;
    },
    p(i, [n]) {
      const a = {};
      n & /*shape*/
      1 && (a.shape = /*shape*/
      i[0]), n & /*transform*/
      2 && (a.transform = /*transform*/
      i[1]), n & /*$$scope, geom, handleSize, grab*/
      1548 && (a.$$scope = { dirty: n, ctx: i }), t.$set(a);
    },
    i(i) {
      e || (at(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Yt(t, i);
    }
  };
}
function s1(r, t, e) {
  let i, n, { shape: a } = t, { transform: o } = t, { viewportScale: s = 1 } = t;
  const u = (c, d, p) => {
    const _ = c.geometry.bounds;
    let [v, y] = [_.minX, _.minY], [g, m] = [_.maxX, _.maxY];
    const [E, b] = p;
    if (d === G.SHAPE)
      v += E, g += E, y += b, m += b;
    else
      switch (d) {
        case G.TOP: {
          y += b;
          break;
        }
        case G.BOTTOM: {
          m += b;
          break;
        }
        case G.LEFT: {
          v += E;
          break;
        }
        case G.RIGHT: {
          g += E;
          break;
        }
      }
    const x = Math.min(v, g), S = Math.min(y, m), A = Math.abs(g - v), w = Math.abs(m - y), P = (v + g) / 2, O = (y + m) / 2, F = A / 2, D = w / 2;
    return {
      ...c,
      geometry: {
        ...c.geometry,
        cx: P,
        cy: O,
        rx: F,
        ry: D,
        bounds: {
          minX: x,
          minY: S,
          maxX: x + A,
          maxY: S + w
        }
      }
    };
  };
  function h(c) {
    Zt.call(this, r, c);
  }
  function l(c) {
    Zt.call(this, r, c);
  }
  function f(c) {
    Zt.call(this, r, c);
  }
  return r.$$set = (c) => {
    "shape" in c && e(0, a = c.shape), "transform" in c && e(1, o = c.transform), "viewportScale" in c && e(5, s = c.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*shape*/
    1 && e(3, i = a.geometry), r.$$.dirty & /*viewportScale*/
    32 && e(2, n = 10 / s);
  }, [
    a,
    o,
    n,
    i,
    u,
    s,
    h,
    l,
    f
  ];
}
class u1 extends jt {
  constructor(t) {
    super(), Xt(this, t, s1, o1, Ht, { shape: 0, transform: 1, viewportScale: 5 });
  }
}
const bl = (r, t, e) => {
  const i = typeof t == "function" ? t(r) : t;
  if (i) {
    const { fill: n, fillOpacity: a } = i;
    let o = "", s;
    return n && (o += `fill:${n};stroke:${n};`), e && (s = e.fillOpacity), o += `fill-opacity:${s || a || "0.25"};`, o;
  }
};
function h1(r) {
  let t, e, i;
  return {
    c() {
      t = ut("path"), T(t, "class", "a9s-shape-handle"), T(
        t,
        "style",
        /*computedStyle*/
        r[3]
      ), T(
        t,
        "d",
        /*pathData*/
        r[2]
      );
    },
    m(n, a) {
      q(n, t, a), e || (i = St(t, "pointerdown", function() {
        Tt(
          /*grab*/
          r[14](G.SHAPE)
        ) && r[14](G.SHAPE).apply(this, arguments);
      }), e = !0);
    },
    p(n, a) {
      r = n, a & /*computedStyle*/
      8 && T(
        t,
        "style",
        /*computedStyle*/
        r[3]
      ), a & /*pathData*/
      4 && T(
        t,
        "d",
        /*pathData*/
        r[2]
      );
    },
    d(n) {
      n && Y(t), e = !1, i();
    }
  };
}
function l1(r) {
  let t, e;
  return t = new On({
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
          h1,
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
      Kt(t.$$.fragment);
    },
    m(i, n) {
      Wt(t, i, n), e = !0;
    },
    p(i, [n]) {
      const a = {};
      n & /*shape*/
      1 && (a.shape = /*shape*/
      i[0]), n & /*transform*/
      2 && (a.transform = /*transform*/
      i[1]), n & /*$$scope, computedStyle, pathData, grab*/
      49164 && (a.$$scope = { dirty: n, ctx: i }), t.$set(a);
    },
    i(i) {
      e || (at(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Yt(t, i);
    }
  };
}
function f1(r, t, e) {
  let i, n, a, { shape: o } = t, { annotation: s } = t, { transform: u } = t, { viewportScale: h = 1 } = t, { style: l = void 0 } = t, f = { fillOpacity: 1 };
  const c = (v, y, g) => {
    let m;
    y === G.SHAPE && (m = v.geometry.points.map(([b, x, S]) => [b + g[0], x + g[1], S]));
    const E = yl(m.map((b) => [b[0], b[1]]));
    return { ...v, geometry: { points: m, bounds: E } };
  };
  function d(v) {
    Zt.call(this, r, v);
  }
  function p(v) {
    Zt.call(this, r, v);
  }
  function _(v) {
    Zt.call(this, r, v);
  }
  return r.$$set = (v) => {
    "shape" in v && e(0, o = v.shape), "annotation" in v && e(5, s = v.annotation), "transform" in v && e(1, u = v.transform), "viewportScale" in v && e(6, h = v.viewportScale), "style" in v && e(7, l = v.style);
  }, r.$$.update = () => {
    r.$$.dirty & /*shape*/
    1 && e(8, i = o.geometry), r.$$.dirty & /*viewportScale*/
    64, r.$$.dirty & /*annotation, style*/
    160 && e(3, n = bl(s, l, f)), r.$$.dirty & /*geom*/
    256 && e(2, a = zb(i.points, jb, !0));
  }, [
    o,
    u,
    a,
    n,
    c,
    s,
    h,
    l,
    i,
    d,
    p,
    _
  ];
}
class c1 extends jt {
  constructor(t) {
    super(), Xt(this, t, f1, l1, Ht, {
      shape: 0,
      annotation: 5,
      transform: 1,
      viewportScale: 6,
      style: 7
    });
  }
}
zt.RECTANGLE, zt.POLYGON, zt.ELLIPSE, zt.FREEHAND;
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
const d1 = (r) => ({}), ku = (r) => ({ grab: (
  /*onGrab*/
  r[0]
) });
function p1(r) {
  let t, e, i, n;
  const a = (
    /*#slots*/
    r[7].default
  ), o = th(
    a,
    r,
    /*$$scope*/
    r[6],
    ku
  );
  return {
    c() {
      t = ut("g"), o && o.c(), T(t, "class", "a9s-annotation selected");
    },
    m(s, u) {
      q(s, t, u), o && o.m(t, null), e = !0, i || (n = [
        St(
          t,
          "pointerup",
          /*onRelease*/
          r[2]
        ),
        St(
          t,
          "pointermove",
          /*onPointerMove*/
          r[1]
        )
      ], i = !0);
    },
    p(s, [u]) {
      o && o.p && (!e || u & /*$$scope*/
      64) && ih(
        o,
        a,
        s,
        /*$$scope*/
        s[6],
        e ? rh(
          a,
          /*$$scope*/
          s[6],
          u,
          d1
        ) : nh(
          /*$$scope*/
          s[6]
        ),
        ku
      );
    },
    i(s) {
      e || (at(o, s), e = !0);
    },
    o(s) {
      ft(o, s), e = !1;
    },
    d(s) {
      s && Y(t), o && o.d(s), i = !1, Se(n);
    }
  };
}
function v1(r, t, e) {
  let { $$slots: i = {}, $$scope: n } = t;
  const a = En();
  let { shape: o } = t, { editor: s } = t, { transform: u } = t, h = null, l, f = null;
  const c = (_) => (v) => {
    h = _, l = u.elementToImage(v.offsetX, v.offsetY), f = o, v.target.setPointerCapture(v.pointerId), a("grab");
  }, d = (_) => {
    if (h) {
      const [v, y] = u.elementToImage(_.offsetX, _.offsetY), g = [v - l[0], y - l[1]];
      e(3, o = s(f, h, g)), a("change", o);
    }
  }, p = (_) => {
    _.target.releasePointerCapture(_.pointerId), h = null, f = o, a("release");
  };
  return r.$$set = (_) => {
    "shape" in _ && e(3, o = _.shape), "editor" in _ && e(4, s = _.editor), "transform" in _ && e(5, u = _.transform), "$$scope" in _ && e(6, n = _.$$scope);
  }, [c, d, p, o, s, u, n, i];
}
class On extends jt {
  constructor(t) {
    super(), Xt(this, t, v1, p1, Ht, { shape: 3, editor: 4, transform: 5 });
  }
}
function _1(r, t, e) {
  let i;
  const n = En();
  let { annotation: a } = t, { editor: o } = t, { style: s = void 0 } = t, { target: u } = t, { transform: h } = t, { viewportScale: l } = t, f;
  return bn(() => (e(6, f = new o({
    target: u,
    props: {
      shape: a.target.selector,
      computedStyle: i,
      transform: h,
      viewportScale: l
    }
  })), f.$on("change", (c) => {
    f.$$set({ shape: c.detail }), n("change", c.detail);
  }), f.$on("grab", (c) => n("grab", c.detail)), f.$on("release", (c) => n("release", c.detail)), () => {
    f.$destroy();
  })), r.$$set = (c) => {
    "annotation" in c && e(0, a = c.annotation), "editor" in c && e(1, o = c.editor), "style" in c && e(2, s = c.style), "target" in c && e(3, u = c.target), "transform" in c && e(4, h = c.transform), "viewportScale" in c && e(5, l = c.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*annotation, style*/
    5 && (i = bl(a, s)), r.$$.dirty & /*annotation, editorComponent*/
    65 && a && (f == null || f.$set({ shape: a.target.selector })), r.$$.dirty & /*editorComponent, transform*/
    80 && f && f.$set({ transform: h }), r.$$.dirty & /*editorComponent, viewportScale*/
    96 && f && f.$set({ viewportScale: l });
  }, [a, o, s, u, h, l, f];
}
class y1 extends jt {
  constructor(t) {
    super(), Xt(this, t, _1, null, Ht, {
      annotation: 0,
      editor: 1,
      style: 2,
      target: 3,
      transform: 4,
      viewportScale: 5
    });
  }
}
const g1 = (r) => {
  let t, e;
  if (r.nodeName === "CANVAS")
    t = r, e = t.getContext("2d", { willReadFrequently: !0 });
  else {
    const n = r;
    t = document.createElement("canvas"), t.width = n.width, t.height = n.height, e = t.getContext("2d", { willReadFrequently: !0 }), e.drawImage(n, 0, 0, n.width, n.height);
  }
  let i = 0;
  for (let n = 1; n < 10; n++)
    for (let a = 1; a < 10; a++) {
      const o = Math.round(a * t.width / 10), s = Math.round(n * t.height / 10), u = e.getImageData(o, s, 1, 1).data, h = (0.299 * u[0] + 0.587 * u[1] + 0.114 * u[2]) / 255;
      i += h;
    }
  return i / 81;
}, m1 = (r) => {
  const t = g1(r), e = t > 0.6 ? "dark" : "light";
  return console.log(`[Annotorious] Image brightness: ${t.toFixed(1)}. Setting ${e} theme.`), e;
};
navigator.userAgent.indexOf("Mac OS X");
var b1 = T1, ga = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 }, E1 = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
function T1(r) {
  var t = [];
  return r.replace(E1, function(e, i, n) {
    var a = i.toLowerCase();
    for (n = w1(n), a == "m" && n.length > 2 && (t.push([i].concat(n.splice(0, 2))), a = "l", i = i == "m" ? "l" : "L"); ; ) {
      if (n.length == ga[a])
        return n.unshift(i), t.push(n);
      if (n.length < ga[a])
        throw new Error("malformed path data");
      t.push([i].concat(n.splice(0, ga[a])));
    }
  }), t;
}
var x1 = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
function w1(r) {
  var t = r.match(x1);
  return t ? t.map(Number) : [];
}
const S1 = /* @__PURE__ */ Tn(b1);
function P1(r, t) {
  var e = r[0] - t[0], i = r[1] - t[1];
  return e * e + i * i;
}
function A1(r, t, e) {
  var i = t[0], n = t[1], a = e[0] - i, o = e[1] - n;
  if (a !== 0 || o !== 0) {
    var s = ((r[0] - i) * a + (r[1] - n) * o) / (a * a + o * o);
    s > 1 ? (i = e[0], n = e[1]) : s > 0 && (i += a * s, n += o * s);
  }
  return a = r[0] - i, o = r[1] - n, a * a + o * o;
}
function R1(r, t) {
  for (var e = r[0], i = [e], n, a = 1, o = r.length; a < o; a++)
    n = r[a], P1(n, e) > t && (i.push(n), e = n);
  return e !== n && i.push(n), i;
}
function bo(r, t, e, i, n) {
  for (var a = i, o, s = t + 1; s < e; s++) {
    var u = A1(r[s], r[t], r[e]);
    u > a && (o = s, a = u);
  }
  a > i && (o - t > 1 && bo(r, t, o, i, n), n.push(r[o]), e - o > 1 && bo(r, o, e, i, n));
}
function O1(r, t) {
  var e = r.length - 1, i = [r[0]];
  return bo(r, 0, e, t, i), i.push(r[e]), i;
}
function I1(r, t, e) {
  if (r.length <= 2)
    return r;
  var i = t !== void 0 ? t * t : 1;
  return r = e ? r : R1(r, i), r = O1(r, i), r;
}
const C1 = {
  size: 4,
  thinning: 0.5,
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
function M1(r) {
  if (!r.length)
    return "";
  const t = r.reduce(
    (e, [i, n], a, o) => {
      const [s, u] = o[(a + 1) % o.length];
      return e.push(i, n, (i + s) / 2, (n + u) / 2), e;
    },
    ["M", ...r[0], "Q"]
  );
  return t.push("Z"), t.join(" ");
}
function D1(r, t, e = !1) {
  const i = ml(r, t);
  return M1(
    e ? I1(i, 0.25) : i
  );
}
const F1 = 1733608, N1 = 0.25;
let Ie = !1, Eo;
const To = (r) => {
  const t = {
    tint: r != null && r.fill ? fn(r.fill) : F1,
    alpha: (r == null ? void 0 : r.fillOpacity) === void 0 ? N1 : Math.min(r.fillOpacity, 1)
  }, e = {
    tint: (r == null ? void 0 : r.stroke) && fn(r.stroke),
    alpha: (r == null ? void 0 : r.strokeOpacity) === void 0 ? r.stroke ? 1 : 0 : Math.min(r.strokeOpacity, 1),
    lineWidth: r != null && r.stroke ? (r == null ? void 0 : r.strokeWidth) || 1 : 0
  };
  return { fillStyle: t, strokeStyle: e };
}, In = (r) => (t, e, i) => {
  const { fillStyle: n, strokeStyle: a } = To(i), o = new sr();
  o.beginFill(16777215), r(e, o), o.endFill(), o.tint = n.tint, o.alpha = n.alpha, t.addChild(o);
  const s = new sr();
  return s.lineStyle(a.lineWidth / Eo, 16777215, 1, 0.5, a.lineWidth === 1), r(e, s), s.tint = a.tint, s.alpha = a.alpha, t.addChild(s), { fill: o, stroke: s, strokeWidth: a.lineWidth };
}, B1 = In((r, t) => {
  const e = D1(r.geometry.points, C1, !0);
  S1(e).forEach((n) => {
    switch (n[0]) {
      case "M":
        t.moveTo(n[1], n[2]);
        break;
      case "L":
        t.lineTo(n[1], n[2]);
        break;
      case "Q":
        n.points.length === 4 && t.quadraticCurveTo(n[1], n[2], n[3], n[4]);
        break;
      case "C":
        n.points.length === 6 && t.bezierCurveTo(n[1], n[2], n[3], n[4], n[5], n[6]);
        break;
      case "Z":
        t.closePath();
        break;
      default:
        console.warn(`Unhandled path command: ${n[0]}`);
    }
  });
}), L1 = In((r, t) => {
  const { cx: e, cy: i, rx: n, ry: a } = r.geometry;
  t.drawEllipse(e, i, n, a);
}), U1 = In((r, t) => {
  const e = r.geometry.points.reduce((i, n) => [...i, ...n], []);
  t.drawPolygon(e);
}), G1 = In((r, t) => {
  const { x: e, y: i, w: n, h: a } = r.geometry;
  t.drawRect(e, i, n, a);
}), k1 = (r, t, e, i) => () => {
  const n = r.viewport.viewportToImageRectangle(r.viewport.getBounds(!0)), a = r.viewport.getContainerSize().x, s = r.viewport.getZoom(!0) * a / r.world.getContentFactor();
  s !== Eo && !Ie && (Ie = !0, e.forEach(({ stroke: d, strokeWidth: p }) => {
    const { lineStyle: _ } = d.geometry.graphicsData[0];
    p > 1 ? (Ie = !1, _.width = p / s, d.geometry.invalidate()) : p === 1 && !_.native && (_.width = 1, _.native = !0, d.geometry.invalidate());
  })), Eo = s;
  const u = Math.PI * r.viewport.getRotation() / 180, h = -n.x * s, l = -n.y * s;
  let f, c;
  u > 0 && u <= Math.PI / 2 ? (f = n.height * s, c = 0) : u > Math.PI / 2 && u <= Math.PI ? (f = n.width * s, c = n.height * s) : u > Math.PI && u <= Math.PI * 1.5 ? (f = 0, c = n.width * s) : (f = 0, c = 0), t.position.x = f + h * Math.cos(u) - l * Math.sin(u), t.position.y = c + h * Math.sin(u) + l * Math.cos(u), t.scale.set(s, s), t.rotation = u, i.render(t);
}, H1 = (r, t) => {
  const e = new sr(), i = tl({
    width: t.width,
    height: t.height,
    backgroundAlpha: 0,
    view: t,
    antialias: !0,
    resolution: 2
  }), n = /* @__PURE__ */ new Map();
  let a = /* @__PURE__ */ new Set(), o;
  const s = (_) => {
    Ie = !1;
    const { selector: v } = _.target, y = typeof o == "function" ? o(_) : o;
    let g;
    v.type === zt.RECTANGLE ? g = G1(e, v, y) : v.type === zt.POLYGON ? g = U1(e, v, y) : v.type === zt.FREEHAND ? g = B1(e, v, y) : v.type === zt.ELLIPSE ? g = L1(e, v, y) : console.warn(`Unsupported shape type: ${v.type}`), g && n.set(_.id, { annotation: _, ...g });
  }, u = (_) => {
    const v = n.get(_.id);
    v && (n.delete(_.id), v.fill.destroy(), v.stroke.destroy());
  }, h = (_, v) => {
    Ie = !1;
    const y = n.get(_.id);
    y && (n.delete(_.id), y.fill.destroy(), y.stroke.destroy(), s(v));
  }, l = (_, v) => {
    i.resize(_, v), i.render(e);
  }, f = (_) => {
    Ie = !1;
    const { children: v } = e;
    n.forEach(({ fill: y, stroke: g, annotation: m }) => {
      const E = _ ? a.has(m.id) || _(m) : !0;
      E && !v.includes(y) ? (e.addChild(y), e.addChild(g)) : !E && v.includes(y) && (e.removeChild(y), e.removeChild(g));
    }), i.render(e);
  }, c = (_) => {
    const { selected: v } = _;
    a = new Set(v.map((y) => y.id));
  }, d = (_) => {
    if (typeof _ == "function")
      n.forEach(({ annotation: v, fill: y, stroke: g, strokeWidth: m }, E) => {
        m > 1 && (Ie = !1);
        const { fillStyle: b, strokeStyle: x } = To(_(v));
        y.tint = b.tint, y.alpha = b.alpha, g.tint = x.tint, g.alpha = x.alpha, n.set(v.id, { annotation: v, fill: y, stroke: g, strokeWidth: m });
      });
    else {
      const { fillStyle: v, strokeStyle: y } = To(_);
      y.lineWidth > 1 && (Ie = !1), n.forEach(({ annotation: g, fill: m, stroke: E, strokeWidth: b }, x) => {
        m.tint = v.tint, m.alpha = v.alpha, E.tint = y.tint, E.alpha = y.alpha, n.set(g.id, { annotation: g, fill: m, stroke: E, strokeWidth: b });
      });
    }
    o = _, i.render(e);
  };
  return {
    addAnnotation: s,
    destroy: () => i.destroy(),
    redraw: k1(r, e, n, i),
    removeAnnotation: u,
    resize: l,
    setFilter: f,
    setSelected: c,
    setStyle: d,
    updateAnnotation: h
  };
};
function X1(r, t, e) {
  let i, n, { filter: a = void 0 } = t, { state: o } = t, { style: s = void 0 } = t, { viewer: u } = t;
  const { store: h, hover: l, selection: f, viewport: c } = o;
  Ea(r, l, (b) => e(10, i = b)), Ea(r, f, (b) => e(7, n = b));
  const d = En();
  let p, _ = !1;
  const v = (b) => {
    const x = new tn.Point(b.x, b.y), { x: S, y: A } = u.viewport.pointFromPixel(x);
    return u.viewport.viewportToImageCoordinates(S, A);
  }, y = (b) => (x) => {
    const { x: S, y: A } = v(new tn.Point(x.offsetX, x.offsetY)), w = h.getAt(S, A);
    w && (!a || a(w)) ? (b.classList.add("hover"), i !== w.id && l.set(w.id)) : (b.classList.remove("hover"), i && l.set(null));
  }, g = (b) => {
    const x = b.originalEvent;
    if (!_) {
      const { x: S, y: A } = v(b.position), w = h.getAt(S, A);
      w ? d("click", { originalEvent: x, annotation: w }) : d("click", { originalEvent: x });
    }
    _ = !1;
  }, m = () => _ = !0;
  let E;
  return bn(() => {
    const { offsetWidth: b, offsetHeight: x } = u.canvas, S = document.createElement("canvas");
    S.width = b, S.height = x, S.className = "a9s-gl-canvas", u.element.querySelector(".openseadragon-canvas").appendChild(S), e(6, p = H1(u, S));
    const A = y(S);
    S.addEventListener("pointermove", A), new ResizeObserver((O) => {
      try {
        const { width: F, height: D } = O[0].contentRect;
        S.width = F, S.height = D, p.resize(F, D);
      } catch {
        console.warn("WebGL canvas already disposed");
      }
    }).observe(S);
    const P = () => {
      const O = u.viewport.getBounds();
      E = u.viewport.viewportToImageRectangle(O);
      const { x: F, y: D, width: I, height: R } = E, N = h.getIntersecting(F, D, I, R);
      c.set(N.map((L) => L.id));
    };
    return u.addHandler("canvas-drag", m), u.addHandler("canvas-release", g), u.addHandler("update-viewport", p.redraw), u.addHandler("animation-finish", P), () => {
      S.removeEventListener("pointermove", A), u.removeHandler("canvas-drag", m), u.removeHandler("canvas-release", g), u.removeHandler("update-viewport", p.redraw), u.removeHandler("animation-finish", P), p.destroy(), S.parentNode.removeChild(S);
    };
  }), h.observe((b) => {
    const { created: x, updated: S, deleted: A } = b.changes;
    if (x.forEach((w) => p.addAnnotation(w)), S.forEach(({ oldValue: w, newValue: P }) => p.updateAnnotation(w, P)), A.forEach((w) => p.removeAnnotation(w)), E) {
      const { x: w, y: P, width: O, height: F } = E, D = h.getIntersecting(w, P, O, F);
      c.set(D.map((I) => I.id));
    } else
      c.set(h.all().map((w) => w.id));
    p.redraw();
  }), r.$$set = (b) => {
    "filter" in b && e(2, a = b.filter), "state" in b && e(3, o = b.state), "style" in b && e(4, s = b.style), "viewer" in b && e(5, u = b.viewer);
  }, r.$$.update = () => {
    r.$$.dirty & /*stage, filter*/
    68 && (p == null || p.setFilter(a)), r.$$.dirty & /*stage, $selection*/
    192 && (p == null || p.setSelected(n)), r.$$.dirty & /*stage, style*/
    80 && (p == null || p.setStyle(s));
  }, [l, f, a, o, s, u, p, n];
}
class j1 extends jt {
  constructor(t) {
    super(), Xt(this, t, X1, null, Ht, { filter: 2, state: 3, style: 4, viewer: 5 });
  }
}
const V1 = (r) => ({
  transform: r & /*layerTransform*/
  2,
  scale: r & /*scale*/
  1
}), Hu = (r) => ({
  transform: (
    /*layerTransform*/
    r[1]
  ),
  scale: (
    /*scale*/
    r[0]
  )
});
function z1(r) {
  let t;
  const e = (
    /*#slots*/
    r[4].default
  ), i = th(
    e,
    r,
    /*$$scope*/
    r[3],
    Hu
  );
  return {
    c() {
      i && i.c();
    },
    m(n, a) {
      i && i.m(n, a), t = !0;
    },
    p(n, [a]) {
      i && i.p && (!t || a & /*$$scope, layerTransform, scale*/
      11) && ih(
        i,
        e,
        n,
        /*$$scope*/
        n[3],
        t ? rh(
          e,
          /*$$scope*/
          n[3],
          a,
          V1
        ) : nh(
          /*$$scope*/
          n[3]
        ),
        Hu
      );
    },
    i(n) {
      t || (at(i, n), t = !0);
    },
    o(n) {
      ft(i, n), t = !1;
    },
    d(n) {
      i && i.d(n);
    }
  };
}
function W1(r, t, e) {
  let { $$slots: i = {}, $$scope: n } = t, { viewer: a } = t, o = 1, s;
  const u = () => {
    const h = a.viewport.getContainerSize().x, l = a.viewport.getZoom(!0), f = a.viewport.getFlip(), c = a.viewport.pixelFromPoint(new tn.Point(0, 0), !0);
    f && (c.x = h - c.x);
    const d = l * h / a.world.getContentFactor(), p = f ? -d : d, _ = a.viewport.getRotation();
    e(1, s = `translate(${c.x}, ${c.y}) scale(${p}, ${d}) rotate(${_})`), e(0, o = l * h / a.world.getContentFactor());
  };
  return bn(() => (a.addHandler("update-viewport", u), () => {
    a.removeHandler("update-viewport", u);
  })), r.$$set = (h) => {
    "viewer" in h && e(2, a = h.viewer), "$$scope" in h && e(3, n = h.$$scope);
  }, [o, s, a, n, i];
}
class El extends jt {
  constructor(t) {
    super(), Xt(this, t, W1, z1, Ht, { viewer: 2 });
  }
}
function Y1(r, t, e) {
  const i = En();
  let { drawingMode: n } = t, { target: a } = t, { tool: o } = t, { transform: s } = t, { viewer: u } = t, { viewportScale: h } = t, l;
  return bn(() => {
    const f = a.closest("svg"), c = [], d = (p, _, v) => {
      if (f.addEventListener(p, _, v), c.push(() => f.removeEventListener(p, _, v)), p === "pointerup" || p === "dblclick") {
        const y = (m) => {
          const { originalEvent: E } = m;
          _(E);
        }, g = p === "pointerup" ? "canvas-click" : "canvas-double-click";
        u.addHandler(g, y), c.push(() => u.removeHandler(g, y));
      } else if (p === "pointermove") {
        const y = (g) => {
          const { originalEvent: m } = g;
          _(m);
        };
        u.addHandler("canvas-drag", y), c.push(() => u.removeHandler("canvas-drag", y));
      }
    };
    return e(6, l = new o({
      target: a,
      props: {
        addEventListener: d,
        drawingMode: n,
        transform: s,
        viewportScale: h
      }
    })), l.$on("create", (p) => i("create", p.detail)), () => {
      c.forEach((p) => p()), l.$destroy();
    };
  }), r.$$set = (f) => {
    "drawingMode" in f && e(0, n = f.drawingMode), "target" in f && e(1, a = f.target), "tool" in f && e(2, o = f.tool), "transform" in f && e(3, s = f.transform), "viewer" in f && e(4, u = f.viewer), "viewportScale" in f && e(5, h = f.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*toolComponent, transform*/
    72 && l && l.$set({ transform: s }), r.$$.dirty & /*toolComponent, viewportScale*/
    96 && l && l.$set({ viewportScale: h });
  }, [n, a, o, s, u, h, l];
}
class q1 extends jt {
  constructor(t) {
    super(), Xt(this, t, Y1, null, Ht, {
      drawingMode: 0,
      target: 1,
      tool: 2,
      transform: 3,
      viewer: 4,
      viewportScale: 5
    });
  }
}
function Xu(r, t, e) {
  const i = r.slice();
  return i[24] = t[e], i;
}
function Z1(r) {
  let t = (
    /*toolName*/
    r[1]
  ), e, i, n = ju(r);
  return {
    c() {
      n.c(), e = ur();
    },
    m(a, o) {
      n.m(a, o), q(a, e, o), i = !0;
    },
    p(a, o) {
      o & /*toolName*/
      2 && Ht(t, t = /*toolName*/
      a[1]) ? (Le(), ft(n, 1, 1, Ne), Ue(), n = ju(a), n.c(), at(n, 1), n.m(e.parentNode, e)) : n.p(a, o);
    },
    i(a) {
      i || (at(n), i = !0);
    },
    o(a) {
      ft(n), i = !1;
    },
    d(a) {
      a && Y(e), n.d(a);
    }
  };
}
function K1(r) {
  let t, e, i = (
    /*editableAnnotations*/
    r[5]
  ), n = [];
  for (let o = 0; o < i.length; o += 1)
    n[o] = zu(Xu(r, i, o));
  const a = (o) => ft(n[o], 1, 1, () => {
    n[o] = null;
  });
  return {
    c() {
      for (let o = 0; o < n.length; o += 1)
        n[o].c();
      t = ur();
    },
    m(o, s) {
      for (let u = 0; u < n.length; u += 1)
        n[u] && n[u].m(o, s);
      q(o, t, s), e = !0;
    },
    p(o, s) {
      if (s & /*editableAnnotations, drawingEl, getEditor, toolTransform, scale, onGrab, onChangeSelected, onRelease*/
      8392496) {
        i = /*editableAnnotations*/
        o[5];
        let u;
        for (u = 0; u < i.length; u += 1) {
          const h = Xu(o, i, u);
          n[u] ? (n[u].p(h, s), at(n[u], 1)) : (n[u] = zu(h), n[u].c(), at(n[u], 1), n[u].m(t.parentNode, t));
        }
        for (Le(), u = i.length; u < n.length; u += 1)
          a(u);
        Ue();
      }
    },
    i(o) {
      if (!e) {
        for (let s = 0; s < i.length; s += 1)
          at(n[s]);
        e = !0;
      }
    },
    o(o) {
      n = n.filter(Boolean);
      for (let s = 0; s < n.length; s += 1)
        ft(n[s]);
      e = !1;
    },
    d(o) {
      wo(n, o), o && Y(t);
    }
  };
}
function ju(r) {
  let t, e;
  return t = new q1({
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
      Kt(t.$$.fragment);
    },
    m(i, n) {
      Wt(t, i, n), e = !0;
    },
    p(i, n) {
      const a = {};
      n & /*drawingEl*/
      16 && (a.target = /*drawingEl*/
      i[4]), n & /*tool*/
      64 && (a.tool = /*tool*/
      i[6]), n & /*drawingMode*/
      8 && (a.drawingMode = /*drawingMode*/
      i[3]), n & /*viewer*/
      4 && (a.viewer = /*viewer*/
      i[2]), n & /*scale*/
      8388608 && (a.viewportScale = /*scale*/
      i[23]), t.$set(a);
    },
    i(i) {
      e || (at(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Yt(t, i);
    }
  };
}
function Vu(r) {
  let t, e;
  return t = new y1({
    props: {
      target: (
        /*drawingEl*/
        r[4]
      ),
      editor: zo(
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
    Tt(
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
      Kt(t.$$.fragment);
    },
    m(i, n) {
      Wt(t, i, n), e = !0;
    },
    p(i, n) {
      r = i;
      const a = {};
      n & /*drawingEl*/
      16 && (a.target = /*drawingEl*/
      r[4]), n & /*editableAnnotations*/
      32 && (a.editor = zo(
        /*editable*/
        r[24].target.selector
      )), n & /*editableAnnotations*/
      32 && (a.annotation = /*editable*/
      r[24]), n & /*scale*/
      8388608 && (a.viewportScale = /*scale*/
      r[23]), t.$set(a);
    },
    i(i) {
      e || (at(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Yt(t, i);
    }
  };
}
function zu(r) {
  let t = (
    /*editable*/
    r[24].id
  ), e, i, n = Vu(r);
  return {
    c() {
      n.c(), e = ur();
    },
    m(a, o) {
      n.m(a, o), q(a, e, o), i = !0;
    },
    p(a, o) {
      o & /*editableAnnotations*/
      32 && Ht(t, t = /*editable*/
      a[24].id) ? (Le(), ft(n, 1, 1, Ne), Ue(), n = Vu(a), n.c(), at(n, 1), n.m(e.parentNode, e)) : n.p(a, o);
    },
    i(a) {
      i || (at(n), i = !0);
    },
    o(a) {
      ft(n), i = !1;
    },
    d(a) {
      a && Y(e), n.d(a);
    }
  };
}
function $1(r) {
  let t, e, i, n, a, o;
  const s = [K1, Z1], u = [];
  function h(l, f) {
    return (
      /*drawingEl*/
      l[4] && /*editableAnnotations*/
      l[5] ? 0 : (
        /*drawingEl*/
        l[4] && /*tool*/
        l[6] && /*drawingEnabled*/
        l[0] ? 1 : -1
      )
    );
  }
  return ~(i = h(r)) && (n = u[i] = s[i](r)), {
    c() {
      t = ut("svg"), e = ut("g"), n && n.c(), T(e, "transform", a = /*transform*/
      r[22]), T(e, "class", "svelte-190cqdf"), T(t, "class", "a9s-annotationlayer a9s-osd-drawinglayer svelte-190cqdf"), Zo(
        t,
        "drawing",
        /*drawingEnabled*/
        r[0]
      );
    },
    m(l, f) {
      q(l, t, f), Je(t, e), ~i && u[i].m(e, null), r[18](e), o = !0;
    },
    p(l, f) {
      let c = i;
      i = h(l), i === c ? ~i && u[i].p(l, f) : (n && (Le(), ft(u[c], 1, 1, () => {
        u[c] = null;
      }), Ue()), ~i ? (n = u[i], n ? n.p(l, f) : (n = u[i] = s[i](l), n.c()), at(n, 1), n.m(e, null)) : n = null), (!o || f & /*transform*/
      4194304 && a !== (a = /*transform*/
      l[22])) && T(e, "transform", a), (!o || f & /*drawingEnabled*/
      1) && Zo(
        t,
        "drawing",
        /*drawingEnabled*/
        l[0]
      );
    },
    i(l) {
      o || (at(n), o = !0);
    },
    o(l) {
      ft(n), o = !1;
    },
    d(l) {
      l && Y(t), ~i && u[i].d(), r[18](null);
    }
  };
}
function Q1(r) {
  let t, e;
  return t = new El({
    props: {
      viewer: (
        /*viewer*/
        r[2]
      ),
      $$slots: {
        default: [
          $1,
          ({ transform: i, scale: n }) => ({ 22: i, 23: n }),
          ({ transform: i, scale: n }) => (i ? 4194304 : 0) | (n ? 8388608 : 0)
        ]
      },
      $$scope: { ctx: r }
    }
  }), {
    c() {
      Kt(t.$$.fragment);
    },
    m(i, n) {
      Wt(t, i, n), e = !0;
    },
    p(i, [n]) {
      const a = {};
      n & /*viewer*/
      4 && (a.viewer = /*viewer*/
      i[2]), n & /*$$scope, drawingEnabled, transform, drawingEl, editableAnnotations, scale, toolName, tool, drawingMode, viewer*/
      146800767 && (a.$$scope = { dirty: n, ctx: i }), t.$set(a);
    },
    i(i) {
      e || (at(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Yt(t, i);
    }
  };
}
function J1(r, t, e) {
  let i, n, a, o, { drawingEnabled: s } = t, { preferredDrawingMode: u } = t, { state: h } = t, { toolName: l = ma().length > 0 ? ma()[0] : void 0 } = t, { user: f } = t, { viewer: c } = t, d;
  const { store: p, selection: _ } = h;
  Ea(r, _, (w) => e(17, o = w));
  let v = null, y = null;
  const g = (w) => {
    p.unobserve(v);
    const P = w.filter(({ editable: O }) => O).map(({ id: O }) => O);
    P.length > 0 ? (e(5, y = P.map((O) => p.getAnnotation(O))), v = (O) => {
      const { updated: F } = O.changes;
      e(5, y = F.map((D) => D.newValue));
    }, p.observe(v, { annotations: P })) : e(5, y = null);
  }, m = (w, P) => {
    const { x: O, y: F } = c.viewport.viewerElementToImageCoordinates(new tn.Point(w, P));
    return [O, F];
  }, E = () => c.setMouseNavEnabled(!1), b = () => c.setMouseNavEnabled(!0), x = (w) => (P) => {
    var I;
    const { target: O } = w, F = 10 * 60 * 1e3, D = ((I = O.creator) == null ? void 0 : I.id) !== f.id || !O.created || (/* @__PURE__ */ new Date()).getTime() - O.created.getTime() > F;
    p.updateTarget({
      ...O,
      selector: P.detail,
      created: D ? O.created : /* @__PURE__ */ new Date(),
      updated: D ? /* @__PURE__ */ new Date() : null,
      updatedBy: D ? f : null
    });
  }, S = (w) => {
    const P = Kb(), O = {
      id: P,
      bodies: [],
      target: {
        annotation: P,
        selector: w.detail,
        creator: f,
        created: /* @__PURE__ */ new Date()
      }
    };
    p.addAnnotation(O), _.setSelected(O.id), c.setMouseNavEnabled(!0);
  };
  function A(w) {
    en[w ? "unshift" : "push"](() => {
      d = w, e(4, d);
    });
  }
  return r.$$set = (w) => {
    "drawingEnabled" in w && e(0, s = w.drawingEnabled), "preferredDrawingMode" in w && e(13, u = w.preferredDrawingMode), "state" in w && e(14, h = w.state), "toolName" in w && e(1, l = w.toolName), "user" in w && e(15, f = w.user), "viewer" in w && e(2, c = w.viewer);
  }, r.$$.update = () => {
    r.$$.dirty & /*toolName*/
    2 && e(6, { tool: i, opts: n } = Qu(l), i, (e(16, n), e(1, l))), r.$$.dirty & /*opts, preferredDrawingMode*/
    73728 && e(3, a = (n == null ? void 0 : n.drawingMode) || u), r.$$.dirty & /*drawingEnabled, drawingMode, viewer*/
    13 && (s && a === "drag" ? c.setMouseNavEnabled(!1) : c.setMouseNavEnabled(!0)), r.$$.dirty & /*drawingEnabled*/
    1 && s && _.clear(), r.$$.dirty & /*$selection, drawingMode, drawingEnabled, viewer*/
    131085 && o.selected.length === 0 && a === "drag" && s && c.setMouseNavEnabled(!1), r.$$.dirty & /*$selection*/
    131072 && g(o.selected);
  }, [
    s,
    l,
    c,
    a,
    d,
    y,
    i,
    _,
    m,
    E,
    b,
    x,
    S,
    u,
    h,
    f,
    n,
    o,
    A
  ];
}
class tE extends jt {
  constructor(t) {
    super(), Xt(this, t, J1, Q1, Ht, {
      drawingEnabled: 0,
      preferredDrawingMode: 13,
      state: 14,
      toolName: 1,
      user: 15,
      viewer: 2
    });
  }
}
function eE(r) {
  let t, e, i, n, a, o, s, u = (
    /*user*/
    r[2].appearance.label + ""
  ), h, l, f, c;
  return {
    c() {
      t = ut("g"), e = ut("rect"), s = ut("text"), h = So(u), T(e, "class", "a9s-presence-label-bg svelte-1rehw2p"), T(
        e,
        "x",
        /*x*/
        r[0]
      ), T(e, "y", i = /*y*/
      r[1] - 18 / /*scale*/
      r[3]), T(e, "height", n = 18 / /*scale*/
      r[3]), T(e, "fill", a = /*user*/
      r[2].appearance.color), T(e, "stroke", o = /*user*/
      r[2].appearance.color), T(s, "font-size", l = 12 / /*scale*/
      r[3]), T(s, "x", f = /*x*/
      r[0] + Math.round(5 / /*scale*/
      r[3])), T(s, "y", c = /*y*/
      r[1] - 5 / /*scale*/
      r[3]), T(s, "class", "svelte-1rehw2p"), T(t, "class", "a9s-presence-label");
    },
    m(d, p) {
      q(d, t, p), Je(t, e), Je(t, s), Je(s, h), r[6](t);
    },
    p(d, [p]) {
      p & /*x*/
      1 && T(
        e,
        "x",
        /*x*/
        d[0]
      ), p & /*y, scale*/
      10 && i !== (i = /*y*/
      d[1] - 18 / /*scale*/
      d[3]) && T(e, "y", i), p & /*scale*/
      8 && n !== (n = 18 / /*scale*/
      d[3]) && T(e, "height", n), p & /*user*/
      4 && a !== (a = /*user*/
      d[2].appearance.color) && T(e, "fill", a), p & /*user*/
      4 && o !== (o = /*user*/
      d[2].appearance.color) && T(e, "stroke", o), p & /*user*/
      4 && u !== (u = /*user*/
      d[2].appearance.label + "") && uf(h, u), p & /*scale*/
      8 && l !== (l = 12 / /*scale*/
      d[3]) && T(s, "font-size", l), p & /*x, scale*/
      9 && f !== (f = /*x*/
      d[0] + Math.round(5 / /*scale*/
      d[3])) && T(s, "x", f), p & /*y, scale*/
      10 && c !== (c = /*y*/
      d[1] - 5 / /*scale*/
      d[3]) && T(s, "y", c);
    },
    i: Ne,
    o: Ne,
    d(d) {
      d && Y(t), r[6](null);
    }
  };
}
function rE(r, t, e) {
  let { x: i } = t, { y: n } = t, { user: a } = t, { scale: o } = t, { hAlign: s = null } = t, u;
  const h = (f) => {
    const c = u.querySelector("text"), d = u.querySelector("rect"), p = c.getBBox().width + 10 / f;
    s === "CENTER" && u.setAttribute("style", `transform: translateX(-${p / 2}px)`), d.setAttribute("width", `${p}`);
  };
  function l(f) {
    en[f ? "unshift" : "push"](() => {
      u = f, e(4, u);
    });
  }
  return r.$$set = (f) => {
    "x" in f && e(0, i = f.x), "y" in f && e(1, n = f.y), "user" in f && e(2, a = f.user), "scale" in f && e(3, o = f.scale), "hAlign" in f && e(5, s = f.hAlign);
  }, r.$$.update = () => {
    r.$$.dirty & /*g, scale*/
    24 && u && h(o);
  }, [i, n, a, o, u, s, l];
}
class Tl extends jt {
  constructor(t) {
    super(), Xt(this, t, rE, eE, Ht, { x: 0, y: 1, user: 2, scale: 3, hAlign: 5 });
  }
}
function iE(r) {
  let t, e, i, n, a, o;
  return e = new Tl({
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
      t = ut("g"), Kt(e.$$.fragment), i = ut("polygon"), T(i, "class", "a9s-presence-shape a9s-presence-polygon svelte-fgq4n0"), T(i, "stroke", n = /*user*/
      r[0].appearance.color), T(i, "fill", "transparent"), T(i, "points", a = /*geom*/
      r[2].points.map(Wu).join(" ")), T(t, "class", "a9s-presence-overlay");
    },
    m(s, u) {
      q(s, t, u), Wt(e, t, null), Je(t, i), o = !0;
    },
    p(s, [u]) {
      const h = {};
      u & /*scale*/
      2 && (h.scale = /*scale*/
      s[1]), u & /*user*/
      1 && (h.user = /*user*/
      s[0]), u & /*origin*/
      8 && (h.x = /*origin*/
      s[3][0]), u & /*origin*/
      8 && (h.y = /*origin*/
      s[3][1]), e.$set(h), (!o || u & /*user*/
      1 && n !== (n = /*user*/
      s[0].appearance.color)) && T(i, "stroke", n), (!o || u & /*geom*/
      4 && a !== (a = /*geom*/
      s[2].points.map(Wu).join(" "))) && T(i, "points", a);
    },
    i(s) {
      o || (at(e.$$.fragment, s), o = !0);
    },
    o(s) {
      ft(e.$$.fragment, s), o = !1;
    },
    d(s) {
      s && Y(t), Yt(e);
    }
  };
}
const Wu = (r) => r.join(",");
function nE(r, t, e) {
  let i, n, { annotation: a } = t, { user: o } = t, { scale: s } = t;
  const u = (h) => {
    let [l, ...f] = h.points;
    return f.forEach(([c, d]) => {
      d < l[1] && (l = [c, d]);
    }), l;
  };
  return r.$$set = (h) => {
    "annotation" in h && e(4, a = h.annotation), "user" in h && e(0, o = h.user), "scale" in h && e(1, s = h.scale);
  }, r.$$.update = () => {
    r.$$.dirty & /*annotation*/
    16 && e(2, i = a.target.selector.geometry), r.$$.dirty & /*geom*/
    4 && e(3, n = u(i));
  }, [o, s, i, n, a];
}
class aE extends jt {
  constructor(t) {
    super(), Xt(this, t, nE, iE, Ht, { annotation: 4, user: 0, scale: 1 });
  }
}
function oE(r) {
  let t, e, i, n, a, o, s, u, h;
  return e = new Tl({
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
      t = ut("g"), Kt(e.$$.fragment), i = ut("rect"), T(i, "class", "a9s-presence-shape a9s-presence-rectangle svelte-gze948"), T(i, "stroke", n = /*user*/
      r[0].appearance.color), T(i, "fill", "transparent"), T(i, "x", a = /*geom*/
      r[2].x), T(i, "y", o = /*geom*/
      r[2].y), T(i, "width", s = /*geom*/
      r[2].w), T(i, "height", u = /*geom*/
      r[2].h), T(t, "class", "a9s-presence-overlay");
    },
    m(l, f) {
      q(l, t, f), Wt(e, t, null), Je(t, i), h = !0;
    },
    p(l, [f]) {
      const c = {};
      f & /*scale*/
      2 && (c.scale = /*scale*/
      l[1]), f & /*user*/
      1 && (c.user = /*user*/
      l[0]), f & /*geom*/
      4 && (c.x = /*geom*/
      l[2].x), f & /*geom*/
      4 && (c.y = /*geom*/
      l[2].y), e.$set(c), (!h || f & /*user*/
      1 && n !== (n = /*user*/
      l[0].appearance.color)) && T(i, "stroke", n), (!h || f & /*geom*/
      4 && a !== (a = /*geom*/
      l[2].x)) && T(i, "x", a), (!h || f & /*geom*/
      4 && o !== (o = /*geom*/
      l[2].y)) && T(i, "y", o), (!h || f & /*geom*/
      4 && s !== (s = /*geom*/
      l[2].w)) && T(i, "width", s), (!h || f & /*geom*/
      4 && u !== (u = /*geom*/
      l[2].h)) && T(i, "height", u);
    },
    i(l) {
      h || (at(e.$$.fragment, l), h = !0);
    },
    o(l) {
      ft(e.$$.fragment, l), h = !1;
    },
    d(l) {
      l && Y(t), Yt(e);
    }
  };
}
function sE(r, t, e) {
  let i, { annotation: n } = t, { user: a } = t, { scale: o } = t;
  return r.$$set = (s) => {
    "annotation" in s && e(3, n = s.annotation), "user" in s && e(0, a = s.user), "scale" in s && e(1, o = s.scale);
  }, r.$$.update = () => {
    r.$$.dirty & /*annotation*/
    8 && e(2, i = n.target.selector.geometry);
  }, [a, o, i, n];
}
class uE extends jt {
  constructor(t) {
    super(), Xt(this, t, sE, oE, Ht, { annotation: 3, user: 0, scale: 1 });
  }
}
const { Boolean: hE } = of;
function Yu(r, t, e) {
  const i = r.slice();
  return i[8] = t[e], i;
}
function qu(r) {
  let t, e;
  return t = new El({
    props: {
      viewer: (
        /*viewer*/
        r[0]
      ),
      $$slots: {
        default: [
          cE,
          ({ transform: i, scale: n }) => ({ 6: i, 7: n }),
          ({ transform: i, scale: n }) => (i ? 64 : 0) | (n ? 128 : 0)
        ]
      },
      $$scope: { ctx: r }
    }
  }), {
    c() {
      Kt(t.$$.fragment);
    },
    m(i, n) {
      Wt(t, i, n), e = !0;
    },
    p(i, n) {
      const a = {};
      n & /*viewer*/
      1 && (a.viewer = /*viewer*/
      i[0]), n & /*$$scope, transform, trackedAnnotations, scale*/
      2244 && (a.$$scope = { dirty: n, ctx: i }), t.$set(a);
    },
    i(i) {
      e || (at(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Yt(t, i);
    }
  };
}
function Zu(r) {
  let t, e, i = (
    /*trackedAnnotations*/
    r[2]
  ), n = [];
  for (let o = 0; o < i.length; o += 1)
    n[o] = Ku(Yu(r, i, o));
  const a = (o) => ft(n[o], 1, 1, () => {
    n[o] = null;
  });
  return {
    c() {
      for (let o = 0; o < n.length; o += 1)
        n[o].c();
      t = ur();
    },
    m(o, s) {
      for (let u = 0; u < n.length; u += 1)
        n[u] && n[u].m(o, s);
      q(o, t, s), e = !0;
    },
    p(o, s) {
      if (s & /*trackedAnnotations, scale, ShapeType*/
      132) {
        i = /*trackedAnnotations*/
        o[2];
        let u;
        for (u = 0; u < i.length; u += 1) {
          const h = Yu(o, i, u);
          n[u] ? (n[u].p(h, s), at(n[u], 1)) : (n[u] = Ku(h), n[u].c(), at(n[u], 1), n[u].m(t.parentNode, t));
        }
        for (Le(), u = i.length; u < n.length; u += 1)
          a(u);
        Ue();
      }
    },
    i(o) {
      if (!e) {
        for (let s = 0; s < i.length; s += 1)
          at(n[s]);
        e = !0;
      }
    },
    o(o) {
      n = n.filter(hE);
      for (let s = 0; s < n.length; s += 1)
        ft(n[s]);
      e = !1;
    },
    d(o) {
      wo(n, o), o && Y(t);
    }
  };
}
function lE(r) {
  let t, e;
  return t = new aE({
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
      Kt(t.$$.fragment);
    },
    m(i, n) {
      Wt(t, i, n), e = !0;
    },
    p(i, n) {
      const a = {};
      n & /*trackedAnnotations*/
      4 && (a.annotation = /*tracked*/
      i[8].annotation), n & /*trackedAnnotations*/
      4 && (a.user = /*tracked*/
      i[8].selectedBy), n & /*scale*/
      128 && (a.scale = /*scale*/
      i[7]), t.$set(a);
    },
    i(i) {
      e || (at(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Yt(t, i);
    }
  };
}
function fE(r) {
  let t, e;
  return t = new uE({
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
      Kt(t.$$.fragment);
    },
    m(i, n) {
      Wt(t, i, n), e = !0;
    },
    p(i, n) {
      const a = {};
      n & /*trackedAnnotations*/
      4 && (a.annotation = /*tracked*/
      i[8].annotation), n & /*trackedAnnotations*/
      4 && (a.user = /*tracked*/
      i[8].selectedBy), n & /*scale*/
      128 && (a.scale = /*scale*/
      i[7]), t.$set(a);
    },
    i(i) {
      e || (at(t.$$.fragment, i), e = !0);
    },
    o(i) {
      ft(t.$$.fragment, i), e = !1;
    },
    d(i) {
      Yt(t, i);
    }
  };
}
function Ku(r) {
  let t, e, i, n;
  const a = [fE, lE], o = [];
  function s(u, h) {
    return (
      /*tracked*/
      u[8].annotation.target.selector.type === ba.RECTANGLE ? 0 : (
        /*tracked*/
        u[8].annotation.target.selector.type === ba.POLYGON ? 1 : -1
      )
    );
  }
  return ~(t = s(r)) && (e = o[t] = a[t](r)), {
    c() {
      e && e.c(), i = ur();
    },
    m(u, h) {
      ~t && o[t].m(u, h), q(u, i, h), n = !0;
    },
    p(u, h) {
      let l = t;
      t = s(u), t === l ? ~t && o[t].p(u, h) : (e && (Le(), ft(o[l], 1, 1, () => {
        o[l] = null;
      }), Ue()), ~t ? (e = o[t], e ? e.p(u, h) : (e = o[t] = a[t](u), e.c()), at(e, 1), e.m(i.parentNode, i)) : e = null);
    },
    i(u) {
      n || (at(e), n = !0);
    },
    o(u) {
      ft(e), n = !1;
    },
    d(u) {
      ~t && o[t].d(u), u && Y(i);
    }
  };
}
function cE(r) {
  let t, e, i, n, a = (
    /*trackedAnnotations*/
    r[2].length > 0 && Zu(r)
  );
  return {
    c() {
      t = ut("svg"), e = ut("g"), a && a.c(), T(e, "transform", i = /*transform*/
      r[6]), T(t, "class", "a9s-osd-presencelayer svelte-1krwc4m");
    },
    m(o, s) {
      q(o, t, s), Je(t, e), a && a.m(e, null), n = !0;
    },
    p(o, s) {
      /*trackedAnnotations*/
      o[2].length > 0 ? a ? (a.p(o, s), s & /*trackedAnnotations*/
      4 && at(a, 1)) : (a = Zu(o), a.c(), at(a, 1), a.m(e, null)) : a && (Le(), ft(a, 1, 1, () => {
        a = null;
      }), Ue()), (!n || s & /*transform*/
      64 && i !== (i = /*transform*/
      o[6])) && T(e, "transform", i);
    },
    i(o) {
      n || (at(a), n = !0);
    },
    o(o) {
      ft(a), n = !1;
    },
    d(o) {
      o && Y(t), a && a.d();
    }
  };
}
function dE(r) {
  let t = !!/*provider*/
  r[1], e, i, n = t && qu(r);
  return {
    c() {
      n && n.c(), e = ur();
    },
    m(a, o) {
      n && n.m(a, o), q(a, e, o), i = !0;
    },
    p(a, [o]) {
      o & /*provider*/
      2 && (t = !!/*provider*/
      a[1]), t ? n ? (n.p(a, o), o & /*provider*/
      2 && at(n, 1)) : (n = qu(a), n.c(), at(n, 1), n.m(e.parentNode, e)) : n && (Le(), ft(n, 1, 1, () => {
        n = null;
      }), Ue());
    },
    i(a) {
      i || (at(n), i = !0);
    },
    o(a) {
      ft(n), i = !1;
    },
    d(a) {
      n && n.d(a), a && Y(e);
    }
  };
}
function pE(r, t, e) {
  let { store: i } = t, { viewer: n } = t, { provider: a = null } = t, o = [], s = null;
  const u = (h, l) => {
    e(2, o = [
      ...o.filter(({ selectedBy: f }) => f.presenceKey !== h.presenceKey),
      ...(l || []).map((f) => ({
        // Warning - could be undefined!
        annotation: i.getAnnotation(f),
        selectedBy: h
      }))
    ].filter(({ annotation: f }) => (f || console.warn("Selection event on unknown annotation"), !!f))), s && i.unobserve(s), s = (f) => {
      const { deleted: c, updated: d } = f.changes, p = new Set(c.map((v) => v.id)), _ = o.filter(({ annotation: v }) => !p.has(v.id)).map((v) => {
        const y = d.find((g) => g.oldValue.id === v.annotation.id);
        return y ? {
          selectedBy: v.selectedBy,
          annotation: y.newValue
        } : v;
      });
      e(2, o = _);
    }, i.observe(s, {
      annotations: o.map((f) => f.annotation.id)
    });
  };
  return lf(() => {
    s && i.unobserve(s);
  }), r.$$set = (h) => {
    "store" in h && e(3, i = h.store), "viewer" in h && e(0, n = h.viewer), "provider" in h && e(1, a = h.provider);
  }, r.$$.update = () => {
    r.$$.dirty & /*provider*/
    2 && a && a.on("selectionChange", u);
  }, [n, a, o, i];
}
class vE extends jt {
  constructor(t) {
    super(), Xt(this, t, pE, dE, Ht, { store: 3, viewer: 0, provider: 1 });
  }
}
const $u = (r, t) => {
  t === "auto" ? r.addHandler("open", (e) => {
    const i = r.world.getItemCount();
    r.world.getItemAt(i - 1).addOnceHandler("fully-loaded-change", (a) => {
      const { fullyLoaded: o } = a;
      if (o) {
        const s = r.canvas.querySelector("canvas"), u = m1(s);
        r.element.setAttribute("data-theme", u);
      }
    });
  }) : r.element.setAttribute("data-theme", t);
}, xl = (r, t, e) => (i, n = {}) => {
  const a = typeof i == "string" ? i : i.id, o = t.getAnnotation(a);
  if (!o)
    return;
  const s = r.container.getBoundingClientRect(), { padding: u } = n;
  let [h, l, f, c] = u ? Array.isArray(u) ? u : [u, u, u, u] : [0, 0, 0, 0];
  h = h / s.height, l = l / s.width, f = f / s.height, c = c / s.width;
  const { minX: d, minY: p, maxX: _, maxY: v } = o.target.selector.geometry.bounds, y = _ - d, g = v - p, m = d - c * y, E = p - h * g, b = y + (l + c) * y, x = g + (h + f) * g, S = r.viewport.imageToViewportRectangle(m, E, b, x);
  r.viewport[e](S, n.immediately);
}, _E = (r, t) => xl(r, t, "fitBounds"), yE = (r, t) => xl(r, t, "fitBoundsWithConstraints");
const bE = (r, t = {}) => {
  const e = wl(t, {
    drawingEnabled: !1,
    drawingMode: "click",
    pointerSelectAction: xo.EDIT,
    theme: "light"
  }), i = Sl(e), { hover: n, selection: a, store: o } = i, s = zl(o), u = Wl(
    i,
    s,
    e.adapter,
    e.autoSave
  );
  let h = Jl(), l = e.drawingEnabled, f = e.drawingMode;
  const c = Pl(s, r.element), d = new j1({
    target: r.element,
    props: {
      state: i,
      viewer: r,
      style: e.style
    }
  }), p = new vE({
    target: r.element.querySelector(".openseadragon-canvas"),
    props: {
      store: o,
      viewer: r,
      provider: null
    }
  }), _ = new tE({
    target: r.element.querySelector(".openseadragon-canvas"),
    props: {
      drawingEnabled: l,
      preferredDrawingMode: f,
      state: i,
      user: h,
      viewer: r
    }
  });
  d.$on("click", (I) => {
    const { originalEvent: R, annotation: N } = I.detail;
    N && !(f === "click" && l) ? a.clickSelect(N.id, R) : a.isEmpty() || a.clear();
  }), r.element.addEventListener("pointerdown", (I) => {
    if (n.current) {
      const R = o.getAnnotation(n.current);
      u.emit("clickAnnotation", R, I);
    }
  }), $u(r, e.theme);
  const v = ql(i, s, e.adapter), y = () => {
    d.$destroy(), p.$destroy(), _.$destroy(), c.destroy(), s.destroy();
  }, g = _E(r, o), m = yE(r, o), E = () => h, b = (I, R, N) => Al(I, R, N), x = (I, R) => Rl(I, R), S = (I) => {
    if (!Qu(I))
      throw `No drawing tool named ${I}`;
    _.$set({ toolName: I });
  }, A = (I) => {
    l = I, _.$set({ drawingEnabled: l });
  }, w = (I) => d.$set({ filter: I }), P = (I) => d.$set({ style: I }), O = (I) => p.$set({ provider: I }), F = (I) => $u(r, I), D = (I) => {
    h = I, _.$set({ user: I });
  };
  return {
    ...v,
    destroy: y,
    fitBounds: g,
    fitBoundsWithConstraints: m,
    getUser: E,
    listDrawingTools: ma,
    on: u.on,
    off: u.off,
    registerDrawingTool: b,
    registerShapeEditor: x,
    setDrawingEnabled: A,
    setDrawingTool: S,
    setFilter: w,
    setPresenceProvider: O,
    setStyle: P,
    setTheme: F,
    setUser: D,
    state: i,
    viewer: r
  };
}, EE = ef, TE = xo, xE = Bl, wE = Ol, SE = ba, PE = Il;
export {
  TE as PointerSelectAction,
  SE as ShapeType,
  PE as W3CImageFormat,
  xE as createBody,
  wE as createImageAnnotator,
  bE as createOSDAnnotator,
  EE as defaultColorProvider
};
//# sourceMappingURL=annotorious-openseadragon.es.js.map
