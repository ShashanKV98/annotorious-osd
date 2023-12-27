var ol = Object.defineProperty;
var sl = (r, e, t) => e in r ? ol(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var En = (r, e, t) => (sl(r, typeof e != "symbol" ? e + "" : e, t), t);
import { listDrawingTools as ha, getTool as Uu, getEditor as Bo, ShapeType as la, fillDefaults as ul, createImageAnnotatorState as hl, initKeyboardCommands as ll, registerTool as fl, registerEditor as cl, createImageAnnotator as dl, W3CImageFormat as pl } from "@annotorious/annotorious";
import qi from "openseadragon";
var Lo = Object.prototype.hasOwnProperty;
function Ke(r, e) {
  var t, i;
  if (r === e)
    return !0;
  if (r && e && (t = r.constructor) === e.constructor) {
    if (t === Date)
      return r.getTime() === e.getTime();
    if (t === RegExp)
      return r.toString() === e.toString();
    if (t === Array) {
      if ((i = r.length) === e.length)
        for (; i-- && Ke(r[i], e[i]); )
          ;
      return i === -1;
    }
    if (!t || typeof r == "object") {
      i = 0;
      for (t in r)
        if (Lo.call(r, t) && ++i && !Lo.call(e, t) || !(t in e) || !Ke(r[t], e[t]))
          return !1;
      return Object.keys(e).length === i;
    }
  }
  return r !== r && e !== e;
}
var ho = /* @__PURE__ */ ((r) => (r.EDIT = "EDIT", r.SELECT = "SELECT", r.NONE = "NONE", r))(ho || {});
let ci;
const vl = new Uint8Array(16);
function _l() {
  if (!ci && (ci = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !ci))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return ci(vl);
}
const Ft = [];
for (let r = 0; r < 256; ++r)
  Ft.push((r + 256).toString(16).slice(1));
function yl(r, e = 0) {
  return Ft[r[e + 0]] + Ft[r[e + 1]] + Ft[r[e + 2]] + Ft[r[e + 3]] + "-" + Ft[r[e + 4]] + Ft[r[e + 5]] + "-" + Ft[r[e + 6]] + Ft[r[e + 7]] + "-" + Ft[r[e + 8]] + Ft[r[e + 9]] + "-" + Ft[r[e + 10]] + Ft[r[e + 11]] + Ft[r[e + 12]] + Ft[r[e + 13]] + Ft[r[e + 14]] + Ft[r[e + 15]];
}
const gl = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), Uo = {
  randomUUID: gl
};
function ml(r, e, t) {
  if (Uo.randomUUID && !e && !r)
    return Uo.randomUUID();
  r = r || {};
  const i = r.random || (r.rng || _l)();
  if (i[6] = i[6] & 15 | 64, i[8] = i[8] & 63 | 128, e) {
    t = t || 0;
    for (let n = 0; n < 16; ++n)
      e[t + n] = i[n];
    return e;
  }
  return yl(i);
}
const bl = (r, e, t, i) => ({
  id: ml(),
  annotation: r.id,
  created: t || /* @__PURE__ */ new Date(),
  creator: i,
  ...e
}), El = (r, e) => {
  const t = new Set(r.bodies.map((i) => i.id));
  return e.bodies.filter((i) => !t.has(i.id));
}, Tl = (r, e) => {
  const t = new Set(e.bodies.map((i) => i.id));
  return r.bodies.filter((i) => !t.has(i.id));
}, xl = (r, e) => e.bodies.map((t) => {
  const i = r.bodies.find((n) => n.id === t.id);
  return { newBody: t, oldBody: i && !Ke(i, t) ? i : void 0 };
}).filter(({ oldBody: t }) => t), wl = (r, e) => !Ke(r.target, e.target), Sl = (r, e) => {
  const t = El(r, e), i = Tl(r, e), n = xl(r, e);
  return {
    oldValue: r,
    newValue: e,
    bodiesCreated: t.length > 0 ? t : void 0,
    bodiesDeleted: i.length > 0 ? i : void 0,
    bodiesUpdated: n.length > 0 ? n : void 0,
    targetUpdated: wl(r, e) ? { oldTarget: r.target, newTarget: e.target } : void 0
  };
};
var Re = /* @__PURE__ */ ((r) => (r.LOCAL = "LOCAL", r.REMOTE = "REMOTE", r))(Re || {});
const Pl = (r, e) => {
  const t = new Set((r.created || []).map((f) => f.id)), i = new Set((r.updated || []).map(({ newValue: f }) => f.id)), n = new Set((e.created || []).map((f) => f.id)), a = new Set((e.deleted || []).map((f) => f.id)), o = new Set((e.updated || []).map(({ oldValue: f }) => f.id)), s = new Set((e.updated || []).filter(({ oldValue: f }) => t.has(f.id) || i.has(f.id)).map(({ oldValue: f }) => f.id)), u = [
    ...(r.created || []).filter((f) => !a.has(f.id)).map((f) => o.has(f.id) ? e.updated.find(({ oldValue: c }) => c.id === f.id).newValue : f),
    ...e.created || []
  ], h = [
    ...(r.deleted || []).filter((f) => !n.has(f.id)),
    ...(e.deleted || []).filter((f) => !t.has(f.id))
  ], l = [
    ...(r.updated || []).filter(({ newValue: f }) => !a.has(f.id)).map((f) => {
      const { oldValue: c, newValue: d } = f;
      if (o.has(d.id)) {
        const p = e.updated.find((v) => v.oldValue.id === d.id).newValue;
        return Sl(c, p);
      } else
        return f;
    }),
    ...(e.updated || []).filter(({ oldValue: f }) => !s.has(f.id))
  ];
  return { created: u, deleted: h, updated: l };
};
let Al = () => ({
  emit(r, ...e) {
    let t = this.events[r] || [];
    for (let i = 0, n = t.length; i < n; i++)
      t[i](...e);
  },
  events: {},
  on(r, e) {
    var t;
    return (t = this.events[r]) != null && t.push(e) || (this.events[r] = [e]), () => {
      var i;
      this.events[r] = (i = this.events[r]) == null ? void 0 : i.filter((n) => e !== n);
    };
  }
});
const Rl = 250, Ol = (r) => {
  const e = Al(), t = [];
  let i = -1, n = !1, a = 0;
  const o = (d) => {
    if (!n) {
      const { changes: p } = d, v = performance.now();
      if (v - a > Rl)
        t.splice(i + 1), t.push(p), i = t.length - 1;
      else {
        const _ = t.length - 1;
        t[_] = Pl(t[_], p);
      }
      a = v;
    }
    n = !1;
  };
  r.observe(o, { origin: Re.LOCAL });
  const s = (d) => (d == null ? void 0 : d.length) > 0 && r.bulkDeleteAnnotation(d), u = (d) => (d == null ? void 0 : d.length) > 0 && r.bulkAddAnnotation(d, !1), h = (d) => (d == null ? void 0 : d.length) > 0 && r.bulkUpdateAnnotation(d.map(({ oldValue: p }) => p)), l = (d) => (d == null ? void 0 : d.length) > 0 && r.bulkUpdateAnnotation(d.map(({ newValue: p }) => p)), f = (d) => (d == null ? void 0 : d.length) > 0 && r.bulkAddAnnotation(d, !1), c = (d) => (d == null ? void 0 : d.length) > 0 && r.bulkDeleteAnnotation(d);
  return {
    canRedo: () => t.length - 1 > i,
    canUndo: () => i > -1,
    destroy: () => r.unobserve(o),
    on: (d, p) => e.on(d, p),
    redo: () => {
      if (t.length - 1 > i) {
        n = !0;
        const { created: d, updated: p, deleted: v } = t[i + 1];
        u(d), l(p), c(v), e.emit("redo", t[i + 1]), i += 1;
      }
    },
    undo: () => {
      if (i > -1) {
        n = !0;
        const { created: d, updated: p, deleted: v } = t[i];
        s(d), h(p), f(v), e.emit("undo", t[i]), i -= 1;
      }
    }
  };
}, Il = (r, e, t, i) => {
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
        if (t) {
          const b = Array.isArray(g) ? g.map((S) => t.serialize(S)) : t.serialize(g), x = m ? m instanceof PointerEvent ? m : t.serialize(m) : void 0;
          E(b, x);
        } else
          E(g, m);
      });
    }, 1);
  }, v = () => {
    const { selected: y } = a, g = y.map(({ id: m }) => n.getAnnotation(m));
    g.forEach((m) => {
      const E = h.find((b) => b.id === m.id);
      (!E || !Ke(E, m)) && p("updateAnnotation", m, E);
    }), h = h.map((m) => g.find(({ id: b }) => b === m.id) || m);
  };
  a.subscribe(({ selected: y }) => {
    if (!(h.length === 0 && y.length === 0)) {
      if (h.length === 0 && y.length > 0)
        h = y.map(({ id: g }) => n.getAnnotation(g));
      else if (h.length > 0 && y.length === 0)
        h.forEach((g) => {
          const m = n.getAnnotation(g.id);
          m && !Ke(m, g) && p("updateAnnotation", m, g);
        }), h = [];
      else {
        const g = new Set(h.map((E) => E.id)), m = new Set(y.map(({ id: E }) => E));
        h.filter((E) => !m.has(E.id)).forEach((E) => {
          const b = n.getAnnotation(E.id);
          b && !Ke(b, E) && p("updateAnnotation", b, E);
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
    i && (f && clearTimeout(f), f = setTimeout(v, 1e3));
    const { created: g, deleted: m } = y.changes;
    g.forEach((E) => p("createAnnotation", E)), m.forEach((E) => p("deleteAnnotation", E)), y.changes.updated.filter((E) => [
      ...E.bodiesCreated || [],
      ...E.bodiesDeleted || [],
      ...E.bodiesUpdated || []
    ].length > 0).forEach(({ oldValue: E, newValue: b }) => {
      const x = h.find((S) => S.id === E.id) || E;
      h = h.map((S) => S.id === E.id ? b : S), p("updateAnnotation", b, x);
    });
  }, { origin: Re.LOCAL }), n.observe((y) => {
    if (h) {
      const g = new Set(h.map((E) => E.id)), m = y.changes.updated.filter(({ newValue: E }) => g.has(E.id)).map(({ newValue: E }) => E);
      m.length > 0 && (h = h.map((E) => m.find((x) => x.id === E.id) || E));
    }
  }, { origin: Re.REMOTE });
  const _ = (y) => (g) => {
    const { created: m, deleted: E, updated: b } = g;
    m.forEach((x) => p("createAnnotation", x)), E.forEach((x) => p("deleteAnnotation", x)), y ? b.forEach((x) => p("updateAnnotation", x.oldValue, x.newValue)) : b.forEach((x) => p("updateAnnotation", x.newValue, x.oldValue));
  };
  return e.on("undo", _(!0)), e.on("redo", _(!1)), { on: c, off: d, emit: p };
}, Cl = (r) => (e) => e.reduce((t, i) => {
  const { parsed: n, error: a } = r.parse(i);
  return a ? {
    parsed: t.parsed,
    failed: [...t.failed, i]
  } : {
    parsed: [...t.parsed, n],
    failed: t.failed
  };
}, { parsed: [], failed: [] }), Ml = (r, e, t) => {
  const { store: i, selection: n } = r, a = (_) => {
    if (t) {
      const { parsed: y, error: g } = t.parse(_);
      y ? i.addAnnotation(y, Re.REMOTE) : console.error(g);
    } else
      i.addAnnotation(_, Re.REMOTE);
  }, o = () => n.clear(), s = () => i.clear(), u = (_) => {
    const y = i.getAnnotation(_);
    return t && y ? t.serialize(y) : y;
  }, h = () => t ? i.all().map(t.serialize) : i.all(), l = () => {
    var _;
    const y = (((_ = n.selected) == null ? void 0 : _.map((g) => g.id)) || []).map((g) => i.getAnnotation(g));
    return t ? y.map(t.serialize) : y;
  }, f = (_) => fetch(_).then((y) => y.json()).then((y) => (d(y), y)), c = (_) => {
    if (typeof _ == "string") {
      const y = i.getAnnotation(_);
      return i.deleteAnnotation(_), t ? t.serialize(y) : y;
    } else {
      const y = t ? t.parse(_).parsed : _;
      return i.deleteAnnotation(y), _;
    }
  }, d = (_) => {
    if (t) {
      const { parsed: y, failed: g } = Cl(t)(_);
      g.length > 0 && console.warn(`Discarded ${g.length} invalid annotations`, g), i.bulkAddAnnotation(y, !0, Re.REMOTE);
    } else
      i.bulkAddAnnotation(_, !0, Re.REMOTE);
  }, p = (_) => {
    _ ? n.setSelected(_) : n.clear();
  }, v = (_) => {
    if (t) {
      const y = t.parse(_).parsed, g = t.serialize(i.getAnnotation(y.id));
      return i.updateAnnotation(y), g;
    } else {
      const y = i.getAnnotation(_.id);
      return i.updateAnnotation(_), y;
    }
  };
  return {
    addAnnotation: a,
    cancelSelected: o,
    canRedo: e.canRedo,
    canUndo: e.canUndo,
    clearAnnotations: s,
    getAnnotationById: u,
    getAnnotations: h,
    getSelected: l,
    loadAnnotations: f,
    redo: e.redo,
    removeAnnotation: c,
    setAnnotations: d,
    setSelected: p,
    undo: e.undo,
    updateAnnotation: v
  };
};
let Dl = (r) => crypto.getRandomValues(new Uint8Array(r)), Fl = (r, e, t) => {
  let i = (2 << Math.log(r.length - 1) / Math.LN2) - 1, n = -~(1.6 * i * e / r.length);
  return (a = e) => {
    let o = "";
    for (; ; ) {
      let s = t(n), u = n;
      for (; u--; )
        if (o += r[s[u] & i] || "", o.length === a)
          return o;
    }
  };
}, Nl = (r, e = 21) => Fl(r, e, Dl), Bl = (r = 21) => crypto.getRandomValues(new Uint8Array(r)).reduce((e, t) => (t &= 63, t < 36 ? e += t.toString(36) : t < 62 ? e += (t - 26).toString(36).toUpperCase() : t > 62 ? e += "-" : e += "_", e), "");
const Ll = () => ({ isGuest: !0, id: Nl("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_", 20)() }), Ul = [
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
], Gl = () => {
  const r = [...Ul];
  return { assignRandomColor: () => {
    const e = Math.floor(Math.random() * r.length), t = r[e];
    return r.splice(e, 1), t;
  }, releaseColor: (e) => r.push(e) };
};
Bl();
function Me() {
}
function kl(r, e) {
  for (const t in e)
    r[t] = e[t];
  return (
    /** @type {T & S} */
    r
  );
}
function Gu(r) {
  return r();
}
function Go() {
  return /* @__PURE__ */ Object.create(null);
}
function Te(r) {
  r.forEach(Gu);
}
function xt(r) {
  return typeof r == "function";
}
function Ht(r, e) {
  return r != r ? e == e : r !== e || r && typeof r == "object" || typeof r == "function";
}
function Hl(r) {
  return Object.keys(r).length === 0;
}
function Xl(r, ...e) {
  if (r == null) {
    for (const i of e)
      i(void 0);
    return Me;
  }
  const t = r.subscribe(...e);
  return t.unsubscribe ? () => t.unsubscribe() : t;
}
function fa(r, e, t) {
  r.$$.on_destroy.push(Xl(e, t));
}
function ku(r, e, t, i) {
  if (r) {
    const n = Hu(r, e, t, i);
    return r[0](n);
  }
}
function Hu(r, e, t, i) {
  return r[1] && i ? kl(t.ctx.slice(), r[1](i(e))) : t.ctx;
}
function Xu(r, e, t, i) {
  if (r[2] && i) {
    const n = r[2](i(t));
    if (e.dirty === void 0)
      return n;
    if (typeof n == "object") {
      const a = [], o = Math.max(e.dirty.length, n.length);
      for (let s = 0; s < o; s += 1)
        a[s] = e.dirty[s] | n[s];
      return a;
    }
    return e.dirty | n;
  }
  return e.dirty;
}
function ju(r, e, t, i, n, a) {
  if (n) {
    const o = Hu(e, t, i, a);
    r.p(o, n);
  }
}
function Vu(r) {
  if (r.ctx.length > 32) {
    const e = [], t = r.ctx.length / 32;
    for (let i = 0; i < t; i++)
      e[i] = -1;
    return e;
  }
  return -1;
}
const jl = typeof window < "u" ? window : typeof globalThis < "u" ? globalThis : (
  // @ts-ignore Node typings have this
  global
);
function Ze(r, e) {
  r.appendChild(e);
}
function V(r, e, t) {
  r.insertBefore(e, t || null);
}
function j(r) {
  r.parentNode && r.parentNode.removeChild(r);
}
function lo(r, e) {
  for (let t = 0; t < r.length; t += 1)
    r[t] && r[t].d(e);
}
function st(r) {
  return document.createElementNS("http://www.w3.org/2000/svg", r);
}
function fo(r) {
  return document.createTextNode(r);
}
function Gt() {
  return fo(" ");
}
function ar() {
  return fo("");
}
function Pt(r, e, t, i) {
  return r.addEventListener(e, t, i), () => r.removeEventListener(e, t, i);
}
function T(r, e, t) {
  t == null ? r.removeAttribute(e) : r.getAttribute(e) !== t && r.setAttribute(e, t);
}
function Vl(r) {
  return Array.from(r.childNodes);
}
function zl(r, e) {
  e = "" + e, r.data !== e && (r.data = /** @type {string} */
  e);
}
function ko(r, e, t) {
  r.classList.toggle(e, !!t);
}
function Wl(r, e, { bubbles: t = !1, cancelable: i = !1 } = {}) {
  return new CustomEvent(r, { detail: e, bubbles: t, cancelable: i });
}
let qr;
function Xr(r) {
  qr = r;
}
function co() {
  if (!qr)
    throw new Error("Function called outside component initialization");
  return qr;
}
function pn(r) {
  co().$$.on_mount.push(r);
}
function Yl(r) {
  co().$$.on_destroy.push(r);
}
function vn() {
  const r = co();
  return (e, t, { cancelable: i = !1 } = {}) => {
    const n = r.$$.callbacks[e];
    if (n) {
      const a = Wl(
        /** @type {string} */
        e,
        t,
        { cancelable: i }
      );
      return n.slice().forEach((o) => {
        o.call(r, a);
      }), !a.defaultPrevented;
    }
    return !0;
  };
}
function me(r, e) {
  const t = r.$$.callbacks[e.type];
  t && t.slice().forEach((i) => i.call(this, e));
}
const vr = [], Ki = [];
let Er = [];
const Ho = [], ql = /* @__PURE__ */ Promise.resolve();
let ca = !1;
function Kl() {
  ca || (ca = !0, ql.then(zu));
}
function da(r) {
  Er.push(r);
}
const Tn = /* @__PURE__ */ new Set();
let hr = 0;
function zu() {
  if (hr !== 0)
    return;
  const r = qr;
  do {
    try {
      for (; hr < vr.length; ) {
        const e = vr[hr];
        hr++, Xr(e), Zl(e.$$);
      }
    } catch (e) {
      throw vr.length = 0, hr = 0, e;
    }
    for (Xr(null), vr.length = 0, hr = 0; Ki.length; )
      Ki.pop()();
    for (let e = 0; e < Er.length; e += 1) {
      const t = Er[e];
      Tn.has(t) || (Tn.add(t), t());
    }
    Er.length = 0;
  } while (vr.length);
  for (; Ho.length; )
    Ho.pop()();
  ca = !1, Tn.clear(), Xr(r);
}
function Zl(r) {
  if (r.fragment !== null) {
    r.update(), Te(r.before_update);
    const e = r.dirty;
    r.dirty = [-1], r.fragment && r.fragment.p(r.ctx, e), r.after_update.forEach(da);
  }
}
function $l(r) {
  const e = [], t = [];
  Er.forEach((i) => r.indexOf(i) === -1 ? e.push(i) : t.push(i)), t.forEach((i) => i()), Er = e;
}
const Xi = /* @__PURE__ */ new Set();
let qe;
function Fe() {
  qe = {
    r: 0,
    c: [],
    p: qe
    // parent group
  };
}
function Ne() {
  qe.r || Te(qe.c), qe = qe.p;
}
function nt(r, e) {
  r && r.i && (Xi.delete(r), r.i(e));
}
function ct(r, e, t, i) {
  if (r && r.o) {
    if (Xi.has(r))
      return;
    Xi.add(r), qe.c.push(() => {
      Xi.delete(r), i && (t && r.d(1), i());
    }), r.o(e);
  } else
    i && i();
}
function Pr(r) {
  return (r == null ? void 0 : r.length) !== void 0 ? r : Array.from(r);
}
function re(r) {
  r && r.c();
}
function zt(r, e, t) {
  const { fragment: i, after_update: n } = r.$$;
  i && i.m(e, t), da(() => {
    const a = r.$$.on_mount.map(Gu).filter(xt);
    r.$$.on_destroy ? r.$$.on_destroy.push(...a) : Te(a), r.$$.on_mount = [];
  }), n.forEach(da);
}
function Wt(r, e) {
  const t = r.$$;
  t.fragment !== null && ($l(t.after_update), Te(t.on_destroy), t.fragment && t.fragment.d(e), t.on_destroy = t.fragment = null, t.ctx = []);
}
function Ql(r, e) {
  r.$$.dirty[0] === -1 && (vr.push(r), Kl(), r.$$.dirty.fill(0)), r.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function jt(r, e, t, i, n, a, o = null, s = [-1]) {
  const u = qr;
  Xr(r);
  const h = r.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: a,
    update: Me,
    not_equal: n,
    bound: Go(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (u ? u.$$.context : [])),
    // everything else
    callbacks: Go(),
    dirty: s,
    skip_bound: !1,
    root: e.target || u.$$.root
  };
  o && o(h.root);
  let l = !1;
  if (h.ctx = t ? t(r, e.props || {}, (f, c, ...d) => {
    const p = d.length ? d[0] : c;
    return h.ctx && n(h.ctx[f], h.ctx[f] = p) && (!h.skip_bound && h.bound[f] && h.bound[f](p), l && Ql(r, f)), c;
  }) : [], h.update(), l = !0, Te(h.before_update), h.fragment = i ? i(h.ctx) : !1, e.target) {
    if (e.hydrate) {
      const f = Vl(e.target);
      h.fragment && h.fragment.l(f), f.forEach(j);
    } else
      h.fragment && h.fragment.c();
    e.intro && nt(r.$$.fragment), zt(r, e.target, e.anchor), zu();
  }
  Xr(u);
}
class Vt {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    En(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    En(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    Wt(this, 1), this.$destroy = Me;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, t) {
    if (!xt(t))
      return Me;
    const i = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return i.push(t), () => {
      const n = i.indexOf(t);
      n !== -1 && i.splice(n, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(e) {
    this.$$set && !Hl(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const Jl = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Jl);
function tf(r) {
  var e = this.constructor;
  return this.then(
    function(t) {
      return e.resolve(r()).then(function() {
        return t;
      });
    },
    function(t) {
      return e.resolve(r()).then(function() {
        return e.reject(t);
      });
    }
  );
}
function ef(r) {
  var e = this;
  return new e(function(t, i) {
    if (!(r && typeof r.length < "u"))
      return i(
        new TypeError(
          typeof r + " " + r + " is not iterable(cannot read property Symbol(Symbol.iterator))"
        )
      );
    var n = Array.prototype.slice.call(r);
    if (n.length === 0)
      return t([]);
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
              n[u] = { status: "rejected", reason: f }, --a === 0 && t(n);
            }
          );
          return;
        }
      }
      n[u] = { status: "fulfilled", value: h }, --a === 0 && t(n);
    }
    for (var s = 0; s < n.length; s++)
      o(s, n[s]);
  });
}
function Wu(r, e) {
  this.name = "AggregateError", this.errors = r, this.message = e || "";
}
Wu.prototype = Error.prototype;
function rf(r) {
  var e = this;
  return new e(function(t, i) {
    if (!(r && typeof r.length < "u"))
      return i(new TypeError("Promise.any accepts an array"));
    var n = Array.prototype.slice.call(r);
    if (n.length === 0)
      return i();
    for (var a = [], o = 0; o < n.length; o++)
      try {
        e.resolve(n[o]).then(t).catch(function(s) {
          a.push(s), a.length === n.length && i(
            new Wu(
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
var nf = setTimeout;
function Yu(r) {
  return !!(r && typeof r.length < "u");
}
function af() {
}
function of(r, e) {
  return function() {
    r.apply(e, arguments);
  };
}
function Tt(r) {
  if (!(this instanceof Tt))
    throw new TypeError("Promises must be constructed via new");
  if (typeof r != "function")
    throw new TypeError("not a function");
  this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], Ku(r, this);
}
function qu(r, e) {
  for (; r._state === 3; )
    r = r._value;
  if (r._state === 0) {
    r._deferreds.push(e);
    return;
  }
  r._handled = !0, Tt._immediateFn(function() {
    var t = r._state === 1 ? e.onFulfilled : e.onRejected;
    if (t === null) {
      (r._state === 1 ? pa : Kr)(e.promise, r._value);
      return;
    }
    var i;
    try {
      i = t(r._value);
    } catch (n) {
      Kr(e.promise, n);
      return;
    }
    pa(e.promise, i);
  });
}
function pa(r, e) {
  try {
    if (e === r)
      throw new TypeError("A promise cannot be resolved with itself.");
    if (e && (typeof e == "object" || typeof e == "function")) {
      var t = e.then;
      if (e instanceof Tt) {
        r._state = 3, r._value = e, va(r);
        return;
      } else if (typeof t == "function") {
        Ku(of(t, e), r);
        return;
      }
    }
    r._state = 1, r._value = e, va(r);
  } catch (i) {
    Kr(r, i);
  }
}
function Kr(r, e) {
  r._state = 2, r._value = e, va(r);
}
function va(r) {
  r._state === 2 && r._deferreds.length === 0 && Tt._immediateFn(function() {
    r._handled || Tt._unhandledRejectionFn(r._value);
  });
  for (var e = 0, t = r._deferreds.length; e < t; e++)
    qu(r, r._deferreds[e]);
  r._deferreds = null;
}
function sf(r, e, t) {
  this.onFulfilled = typeof r == "function" ? r : null, this.onRejected = typeof e == "function" ? e : null, this.promise = t;
}
function Ku(r, e) {
  var t = !1;
  try {
    r(
      function(i) {
        t || (t = !0, pa(e, i));
      },
      function(i) {
        t || (t = !0, Kr(e, i));
      }
    );
  } catch (i) {
    if (t)
      return;
    t = !0, Kr(e, i);
  }
}
Tt.prototype.catch = function(r) {
  return this.then(null, r);
};
Tt.prototype.then = function(r, e) {
  var t = new this.constructor(af);
  return qu(this, new sf(r, e, t)), t;
};
Tt.prototype.finally = tf;
Tt.all = function(r) {
  return new Tt(function(e, t) {
    if (!Yu(r))
      return t(new TypeError("Promise.all accepts an array"));
    var i = Array.prototype.slice.call(r);
    if (i.length === 0)
      return e([]);
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
              t
            );
            return;
          }
        }
        i[s] = u, --n === 0 && e(i);
      } catch (l) {
        t(l);
      }
    }
    for (var o = 0; o < i.length; o++)
      a(o, i[o]);
  });
};
Tt.any = rf;
Tt.allSettled = ef;
Tt.resolve = function(r) {
  return r && typeof r == "object" && r.constructor === Tt ? r : new Tt(function(e) {
    e(r);
  });
};
Tt.reject = function(r) {
  return new Tt(function(e, t) {
    t(r);
  });
};
Tt.race = function(r) {
  return new Tt(function(e, t) {
    if (!Yu(r))
      return t(new TypeError("Promise.race accepts an array"));
    for (var i = 0, n = r.length; i < n; i++)
      Tt.resolve(r[i]).then(e, t);
  });
};
Tt._immediateFn = // @ts-ignore
typeof setImmediate == "function" && function(r) {
  setImmediate(r);
} || function(r) {
  nf(r, 0);
};
Tt._unhandledRejectionFn = function(e) {
  typeof console < "u" && console && console.warn("Possible Unhandled Promise Rejection:", e);
};
var ji = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function po(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function uf(r) {
  if (r.__esModule)
    return r;
  var e = r.default;
  if (typeof e == "function") {
    var t = function i() {
      return this instanceof i ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else
    t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(r).forEach(function(i) {
    var n = Object.getOwnPropertyDescriptor(r, i);
    Object.defineProperty(t, i, n.get ? n : {
      enumerable: !0,
      get: function() {
        return r[i];
      }
    });
  }), t;
}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var Xo = Object.getOwnPropertySymbols, hf = Object.prototype.hasOwnProperty, lf = Object.prototype.propertyIsEnumerable;
function ff(r) {
  if (r == null)
    throw new TypeError("Object.assign cannot be called with null or undefined");
  return Object(r);
}
function cf() {
  try {
    if (!Object.assign)
      return !1;
    var r = new String("abc");
    if (r[5] = "de", Object.getOwnPropertyNames(r)[0] === "5")
      return !1;
    for (var e = {}, t = 0; t < 10; t++)
      e["_" + String.fromCharCode(t)] = t;
    var i = Object.getOwnPropertyNames(e).map(function(a) {
      return e[a];
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
var df = cf() ? Object.assign : function(r, e) {
  for (var t, i = ff(r), n, a = 1; a < arguments.length; a++) {
    t = Object(arguments[a]);
    for (var o in t)
      hf.call(t, o) && (i[o] = t[o]);
    if (Xo) {
      n = Xo(t);
      for (var s = 0; s < n.length; s++)
        lf.call(t, n[s]) && (i[n[s]] = t[n[s]]);
    }
  }
  return i;
};
const pf = /* @__PURE__ */ po(df);
/*!
 * @pixi/polyfill - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/polyfill is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
typeof globalThis > "u" && (typeof self < "u" ? self.globalThis = self : typeof global < "u" && (global.globalThis = global));
globalThis.Promise || (globalThis.Promise = Tt);
Object.assign || (Object.assign = pf);
var vf = 16;
Date.now && Date.prototype.getTime || (Date.now = function() {
  return (/* @__PURE__ */ new Date()).getTime();
});
if (!(globalThis.performance && globalThis.performance.now)) {
  var _f = Date.now();
  globalThis.performance || (globalThis.performance = {}), globalThis.performance.now = function() {
    return Date.now() - _f;
  };
}
var xn = Date.now(), jo = ["ms", "moz", "webkit", "o"];
for (var wn = 0; wn < jo.length && !globalThis.requestAnimationFrame; ++wn) {
  var Sn = jo[wn];
  globalThis.requestAnimationFrame = globalThis[Sn + "RequestAnimationFrame"], globalThis.cancelAnimationFrame = globalThis[Sn + "CancelAnimationFrame"] || globalThis[Sn + "CancelRequestAnimationFrame"];
}
globalThis.requestAnimationFrame || (globalThis.requestAnimationFrame = function(r) {
  if (typeof r != "function")
    throw new TypeError(r + "is not a function");
  var e = Date.now(), t = vf + xn - e;
  return t < 0 && (t = 0), xn = e, globalThis.self.setTimeout(function() {
    xn = Date.now(), r(performance.now());
  }, t);
});
globalThis.cancelAnimationFrame || (globalThis.cancelAnimationFrame = function(r) {
  return clearTimeout(r);
});
Math.sign || (Math.sign = function(e) {
  return e = Number(e), e === 0 || isNaN(e) ? e : e > 0 ? 1 : -1;
});
Number.isInteger || (Number.isInteger = function(e) {
  return typeof e == "number" && isFinite(e) && Math.floor(e) === e;
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
var be;
(function(r) {
  r[r.WEBGL_LEGACY = 0] = "WEBGL_LEGACY", r[r.WEBGL = 1] = "WEBGL", r[r.WEBGL2 = 2] = "WEBGL2";
})(be || (be = {}));
var Zr;
(function(r) {
  r[r.UNKNOWN = 0] = "UNKNOWN", r[r.WEBGL = 1] = "WEBGL", r[r.CANVAS = 2] = "CANVAS";
})(Zr || (Zr = {}));
var Zi;
(function(r) {
  r[r.COLOR = 16384] = "COLOR", r[r.DEPTH = 256] = "DEPTH", r[r.STENCIL = 1024] = "STENCIL";
})(Zi || (Zi = {}));
var H;
(function(r) {
  r[r.NORMAL = 0] = "NORMAL", r[r.ADD = 1] = "ADD", r[r.MULTIPLY = 2] = "MULTIPLY", r[r.SCREEN = 3] = "SCREEN", r[r.OVERLAY = 4] = "OVERLAY", r[r.DARKEN = 5] = "DARKEN", r[r.LIGHTEN = 6] = "LIGHTEN", r[r.COLOR_DODGE = 7] = "COLOR_DODGE", r[r.COLOR_BURN = 8] = "COLOR_BURN", r[r.HARD_LIGHT = 9] = "HARD_LIGHT", r[r.SOFT_LIGHT = 10] = "SOFT_LIGHT", r[r.DIFFERENCE = 11] = "DIFFERENCE", r[r.EXCLUSION = 12] = "EXCLUSION", r[r.HUE = 13] = "HUE", r[r.SATURATION = 14] = "SATURATION", r[r.COLOR = 15] = "COLOR", r[r.LUMINOSITY = 16] = "LUMINOSITY", r[r.NORMAL_NPM = 17] = "NORMAL_NPM", r[r.ADD_NPM = 18] = "ADD_NPM", r[r.SCREEN_NPM = 19] = "SCREEN_NPM", r[r.NONE = 20] = "NONE", r[r.SRC_OVER = 0] = "SRC_OVER", r[r.SRC_IN = 21] = "SRC_IN", r[r.SRC_OUT = 22] = "SRC_OUT", r[r.SRC_ATOP = 23] = "SRC_ATOP", r[r.DST_OVER = 24] = "DST_OVER", r[r.DST_IN = 25] = "DST_IN", r[r.DST_OUT = 26] = "DST_OUT", r[r.DST_ATOP = 27] = "DST_ATOP", r[r.ERASE = 26] = "ERASE", r[r.SUBTRACT = 28] = "SUBTRACT", r[r.XOR = 29] = "XOR";
})(H || (H = {}));
var $t;
(function(r) {
  r[r.POINTS = 0] = "POINTS", r[r.LINES = 1] = "LINES", r[r.LINE_LOOP = 2] = "LINE_LOOP", r[r.LINE_STRIP = 3] = "LINE_STRIP", r[r.TRIANGLES = 4] = "TRIANGLES", r[r.TRIANGLE_STRIP = 5] = "TRIANGLE_STRIP", r[r.TRIANGLE_FAN = 6] = "TRIANGLE_FAN";
})($t || ($t = {}));
var N;
(function(r) {
  r[r.RGBA = 6408] = "RGBA", r[r.RGB = 6407] = "RGB", r[r.RG = 33319] = "RG", r[r.RED = 6403] = "RED", r[r.RGBA_INTEGER = 36249] = "RGBA_INTEGER", r[r.RGB_INTEGER = 36248] = "RGB_INTEGER", r[r.RG_INTEGER = 33320] = "RG_INTEGER", r[r.RED_INTEGER = 36244] = "RED_INTEGER", r[r.ALPHA = 6406] = "ALPHA", r[r.LUMINANCE = 6409] = "LUMINANCE", r[r.LUMINANCE_ALPHA = 6410] = "LUMINANCE_ALPHA", r[r.DEPTH_COMPONENT = 6402] = "DEPTH_COMPONENT", r[r.DEPTH_STENCIL = 34041] = "DEPTH_STENCIL";
})(N || (N = {}));
var $e;
(function(r) {
  r[r.TEXTURE_2D = 3553] = "TEXTURE_2D", r[r.TEXTURE_CUBE_MAP = 34067] = "TEXTURE_CUBE_MAP", r[r.TEXTURE_2D_ARRAY = 35866] = "TEXTURE_2D_ARRAY", r[r.TEXTURE_CUBE_MAP_POSITIVE_X = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X", r[r.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X", r[r.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y", r[r.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y", r[r.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z", r[r.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
})($e || ($e = {}));
var k;
(function(r) {
  r[r.UNSIGNED_BYTE = 5121] = "UNSIGNED_BYTE", r[r.UNSIGNED_SHORT = 5123] = "UNSIGNED_SHORT", r[r.UNSIGNED_SHORT_5_6_5 = 33635] = "UNSIGNED_SHORT_5_6_5", r[r.UNSIGNED_SHORT_4_4_4_4 = 32819] = "UNSIGNED_SHORT_4_4_4_4", r[r.UNSIGNED_SHORT_5_5_5_1 = 32820] = "UNSIGNED_SHORT_5_5_5_1", r[r.UNSIGNED_INT = 5125] = "UNSIGNED_INT", r[r.UNSIGNED_INT_10F_11F_11F_REV = 35899] = "UNSIGNED_INT_10F_11F_11F_REV", r[r.UNSIGNED_INT_2_10_10_10_REV = 33640] = "UNSIGNED_INT_2_10_10_10_REV", r[r.UNSIGNED_INT_24_8 = 34042] = "UNSIGNED_INT_24_8", r[r.UNSIGNED_INT_5_9_9_9_REV = 35902] = "UNSIGNED_INT_5_9_9_9_REV", r[r.BYTE = 5120] = "BYTE", r[r.SHORT = 5122] = "SHORT", r[r.INT = 5124] = "INT", r[r.FLOAT = 5126] = "FLOAT", r[r.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV", r[r.HALF_FLOAT = 36193] = "HALF_FLOAT";
})(k || (k = {}));
var $i;
(function(r) {
  r[r.FLOAT = 0] = "FLOAT", r[r.INT = 1] = "INT", r[r.UINT = 2] = "UINT";
})($i || ($i = {}));
var oe;
(function(r) {
  r[r.NEAREST = 0] = "NEAREST", r[r.LINEAR = 1] = "LINEAR";
})(oe || (oe = {}));
var ue;
(function(r) {
  r[r.CLAMP = 33071] = "CLAMP", r[r.REPEAT = 10497] = "REPEAT", r[r.MIRRORED_REPEAT = 33648] = "MIRRORED_REPEAT";
})(ue || (ue = {}));
var te;
(function(r) {
  r[r.OFF = 0] = "OFF", r[r.POW2 = 1] = "POW2", r[r.ON = 2] = "ON", r[r.ON_MANUAL = 3] = "ON_MANUAL";
})(te || (te = {}));
var ee;
(function(r) {
  r[r.NPM = 0] = "NPM", r[r.UNPACK = 1] = "UNPACK", r[r.PMA = 2] = "PMA", r[r.NO_PREMULTIPLIED_ALPHA = 0] = "NO_PREMULTIPLIED_ALPHA", r[r.PREMULTIPLY_ON_UPLOAD = 1] = "PREMULTIPLY_ON_UPLOAD", r[r.PREMULTIPLY_ALPHA = 2] = "PREMULTIPLY_ALPHA", r[r.PREMULTIPLIED_ALPHA = 2] = "PREMULTIPLIED_ALPHA";
})(ee || (ee = {}));
var Zt;
(function(r) {
  r[r.NO = 0] = "NO", r[r.YES = 1] = "YES", r[r.AUTO = 2] = "AUTO", r[r.BLEND = 0] = "BLEND", r[r.CLEAR = 1] = "CLEAR", r[r.BLIT = 2] = "BLIT";
})(Zt || (Zt = {}));
var Qi;
(function(r) {
  r[r.AUTO = 0] = "AUTO", r[r.MANUAL = 1] = "MANUAL";
})(Qi || (Qi = {}));
var Xt;
(function(r) {
  r.LOW = "lowp", r.MEDIUM = "mediump", r.HIGH = "highp";
})(Xt || (Xt = {}));
var Rt;
(function(r) {
  r[r.NONE = 0] = "NONE", r[r.SCISSOR = 1] = "SCISSOR", r[r.STENCIL = 2] = "STENCIL", r[r.SPRITE = 3] = "SPRITE", r[r.COLOR = 4] = "COLOR";
})(Rt || (Rt = {}));
var Vo;
(function(r) {
  r[r.RED = 1] = "RED", r[r.GREEN = 2] = "GREEN", r[r.BLUE = 4] = "BLUE", r[r.ALPHA = 8] = "ALPHA";
})(Vo || (Vo = {}));
var gt;
(function(r) {
  r[r.NONE = 0] = "NONE", r[r.LOW = 2] = "LOW", r[r.MEDIUM = 4] = "MEDIUM", r[r.HIGH = 8] = "HIGH";
})(gt || (gt = {}));
var he;
(function(r) {
  r[r.ELEMENT_ARRAY_BUFFER = 34963] = "ELEMENT_ARRAY_BUFFER", r[r.ARRAY_BUFFER = 34962] = "ARRAY_BUFFER", r[r.UNIFORM_BUFFER = 35345] = "UNIFORM_BUFFER";
})(he || (he = {}));
/*!
 * @pixi/settings - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/settings is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var yf = {
  /**
   * Creates a canvas element of the given size.
   * This canvas is created using the browser's native canvas element.
   * @param width - width of the canvas
   * @param height - height of the canvas
   */
  createCanvas: function(r, e) {
    var t = document.createElement("canvas");
    return t.width = r, t.height = e, t;
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
  fetch: function(r, e) {
    return fetch(r, e);
  }
}, Pn = /iPhone/i, zo = /iPod/i, Wo = /iPad/i, Yo = /\biOS-universal(?:.+)Mac\b/i, An = /\bAndroid(?:.+)Mobile\b/i, qo = /Android/i, lr = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i, di = /Silk/i, de = /Windows Phone/i, Ko = /\bWindows(?:.+)ARM\b/i, Zo = /BlackBerry/i, $o = /BB10/i, Qo = /Opera Mini/i, Jo = /\b(CriOS|Chrome)(?:.+)Mobile/i, ts = /Mobile(?:.+)Firefox\b/i, es = function(r) {
  return typeof r < "u" && r.platform === "MacIntel" && typeof r.maxTouchPoints == "number" && r.maxTouchPoints > 1 && typeof MSStream > "u";
};
function gf(r) {
  return function(e) {
    return e.test(r);
  };
}
function mf(r) {
  var e = {
    userAgent: "",
    platform: "",
    maxTouchPoints: 0
  };
  !r && typeof navigator < "u" ? e = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints || 0
  } : typeof r == "string" ? e.userAgent = r : r && r.userAgent && (e = {
    userAgent: r.userAgent,
    platform: r.platform,
    maxTouchPoints: r.maxTouchPoints || 0
  });
  var t = e.userAgent, i = t.split("[FBAN");
  typeof i[1] < "u" && (t = i[0]), i = t.split("Twitter"), typeof i[1] < "u" && (t = i[0]);
  var n = gf(t), a = {
    apple: {
      phone: n(Pn) && !n(de),
      ipod: n(zo),
      tablet: !n(Pn) && (n(Wo) || es(e)) && !n(de),
      universal: n(Yo),
      device: (n(Pn) || n(zo) || n(Wo) || n(Yo) || es(e)) && !n(de)
    },
    amazon: {
      phone: n(lr),
      tablet: !n(lr) && n(di),
      device: n(lr) || n(di)
    },
    android: {
      phone: !n(de) && n(lr) || !n(de) && n(An),
      tablet: !n(de) && !n(lr) && !n(An) && (n(di) || n(qo)),
      device: !n(de) && (n(lr) || n(di) || n(An) || n(qo)) || n(/\bokhttp\b/i)
    },
    windows: {
      phone: n(de),
      tablet: n(Ko),
      device: n(de) || n(Ko)
    },
    other: {
      blackberry: n(Zo),
      blackberry10: n($o),
      opera: n(Qo),
      firefox: n(ts),
      chrome: n(Jo),
      device: n(Zo) || n($o) || n(Qo) || n(ts) || n(Jo)
    },
    any: !1,
    phone: !1,
    tablet: !1
  };
  return a.any = a.apple.device || a.android.device || a.windows.device || a.other.device, a.phone = a.apple.phone || a.android.phone || a.windows.phone, a.tablet = a.apple.tablet || a.android.tablet || a.windows.tablet, a;
}
var se = mf(globalThis.navigator);
function bf() {
  return !se.apple.device;
}
function Ef(r) {
  var e = !0;
  if (se.tablet || se.phone) {
    if (se.apple.device) {
      var t = navigator.userAgent.match(/OS (\d+)_(\d+)?/);
      if (t) {
        var i = parseInt(t[1], 10);
        i < 11 && (e = !1);
      }
    }
    if (se.android.device) {
      var t = navigator.userAgent.match(/Android\s([0-9.]*)/);
      if (t) {
        var i = parseInt(t[1], 10);
        i < 7 && (e = !1);
      }
    }
  }
  return e ? r : 4;
}
var U = {
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
  ADAPTER: yf,
  /**
   * If set to true WebGL will attempt make textures mimpaped by default.
   * Mipmapping will only succeed if the base texture uploaded has power of two dimensions.
   * @static
   * @name MIPMAP_TEXTURES
   * @memberof PIXI.settings
   * @type {PIXI.MIPMAP_MODES}
   * @default PIXI.MIPMAP_MODES.POW2
   */
  MIPMAP_TEXTURES: te.POW2,
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
  FILTER_MULTISAMPLE: gt.NONE,
  /**
   * The maximum textures that this device supports.
   * @static
   * @name SPRITE_MAX_TEXTURES
   * @memberof PIXI.settings
   * @type {number}
   * @default 32
   */
  SPRITE_MAX_TEXTURES: Ef(32),
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
  GC_MODE: Qi.AUTO,
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
  WRAP_MODE: ue.CLAMP,
  /**
   * Default scale mode for textures.
   * @static
   * @name SCALE_MODE
   * @memberof PIXI.settings
   * @type {PIXI.SCALE_MODES}
   * @default PIXI.SCALE_MODES.LINEAR
   */
  SCALE_MODE: oe.LINEAR,
  /**
   * Default specify float precision in vertex shader.
   * @static
   * @name PRECISION_VERTEX
   * @memberof PIXI.settings
   * @type {PIXI.PRECISION}
   * @default PIXI.PRECISION.HIGH
   */
  PRECISION_VERTEX: Xt.HIGH,
  /**
   * Default specify float precision in fragment shader.
   * iOS is best set at highp due to https://github.com/pixijs/pixi.js/issues/3742
   * @static
   * @name PRECISION_FRAGMENT
   * @memberof PIXI.settings
   * @type {PIXI.PRECISION}
   * @default PIXI.PRECISION.MEDIUM
   */
  PRECISION_FRAGMENT: se.apple.device ? Xt.HIGH : Xt.MEDIUM,
  /**
   * Can we upload the same buffer in a single frame?
   * @static
   * @name CAN_UPLOAD_SAME_BUFFER
   * @memberof PIXI.settings
   * @type {boolean}
   */
  CAN_UPLOAD_SAME_BUFFER: bf(),
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
}, Zu = { exports: {} };
(function(r) {
  var e = Object.prototype.hasOwnProperty, t = "~";
  function i() {
  }
  Object.create && (i.prototype = /* @__PURE__ */ Object.create(null), new i().__proto__ || (t = !1));
  function n(u, h, l) {
    this.fn = u, this.context = h, this.once = l || !1;
  }
  function a(u, h, l, f, c) {
    if (typeof l != "function")
      throw new TypeError("The listener must be a function");
    var d = new n(l, f || u, c), p = t ? t + h : h;
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
      e.call(l, f) && h.push(t ? f.slice(1) : f);
    return Object.getOwnPropertySymbols ? h.concat(Object.getOwnPropertySymbols(l)) : h;
  }, s.prototype.listeners = function(h) {
    var l = t ? t + h : h, f = this._events[l];
    if (!f)
      return [];
    if (f.fn)
      return [f.fn];
    for (var c = 0, d = f.length, p = new Array(d); c < d; c++)
      p[c] = f[c].fn;
    return p;
  }, s.prototype.listenerCount = function(h) {
    var l = t ? t + h : h, f = this._events[l];
    return f ? f.fn ? 1 : f.length : 0;
  }, s.prototype.emit = function(h, l, f, c, d, p) {
    var v = t ? t + h : h;
    if (!this._events[v])
      return !1;
    var _ = this._events[v], y = arguments.length, g, m;
    if (_.fn) {
      switch (_.once && this.removeListener(h, _.fn, void 0, !0), y) {
        case 1:
          return _.fn.call(_.context), !0;
        case 2:
          return _.fn.call(_.context, l), !0;
        case 3:
          return _.fn.call(_.context, l, f), !0;
        case 4:
          return _.fn.call(_.context, l, f, c), !0;
        case 5:
          return _.fn.call(_.context, l, f, c, d), !0;
        case 6:
          return _.fn.call(_.context, l, f, c, d, p), !0;
      }
      for (m = 1, g = new Array(y - 1); m < y; m++)
        g[m - 1] = arguments[m];
      _.fn.apply(_.context, g);
    } else {
      var E = _.length, b;
      for (m = 0; m < E; m++)
        switch (_[m].once && this.removeListener(h, _[m].fn, void 0, !0), y) {
          case 1:
            _[m].fn.call(_[m].context);
            break;
          case 2:
            _[m].fn.call(_[m].context, l);
            break;
          case 3:
            _[m].fn.call(_[m].context, l, f);
            break;
          case 4:
            _[m].fn.call(_[m].context, l, f, c);
            break;
          default:
            if (!g)
              for (b = 1, g = new Array(y - 1); b < y; b++)
                g[b - 1] = arguments[b];
            _[m].fn.apply(_[m].context, g);
        }
    }
    return !0;
  }, s.prototype.on = function(h, l, f) {
    return a(this, h, l, f, !1);
  }, s.prototype.once = function(h, l, f) {
    return a(this, h, l, f, !0);
  }, s.prototype.removeListener = function(h, l, f, c) {
    var d = t ? t + h : h;
    if (!this._events[d])
      return this;
    if (!l)
      return o(this, d), this;
    var p = this._events[d];
    if (p.fn)
      p.fn === l && (!c || p.once) && (!f || p.context === f) && o(this, d);
    else {
      for (var v = 0, _ = [], y = p.length; v < y; v++)
        (p[v].fn !== l || c && !p[v].once || f && p[v].context !== f) && _.push(p[v]);
      _.length ? this._events[d] = _.length === 1 ? _[0] : _ : o(this, d);
    }
    return this;
  }, s.prototype.removeAllListeners = function(h) {
    var l;
    return h ? (l = t ? t + h : h, this._events[l] && o(this, l)) : (this._events = new i(), this._eventsCount = 0), this;
  }, s.prototype.off = s.prototype.removeListener, s.prototype.addListener = s.prototype.on, s.prefixed = t, s.EventEmitter = s, r.exports = s;
})(Zu);
var Tf = Zu.exports;
const ai = /* @__PURE__ */ po(Tf);
var vo = { exports: {} };
vo.exports = _n;
vo.exports.default = _n;
function _n(r, e, t) {
  t = t || 2;
  var i = e && e.length, n = i ? e[0] * t : r.length, a = $u(r, 0, n, t, !0), o = [];
  if (!a || a.next === a.prev)
    return o;
  var s, u, h, l, f, c, d;
  if (i && (a = Af(r, e, a, t)), r.length > 80 * t) {
    s = h = r[0], u = l = r[1];
    for (var p = t; p < n; p += t)
      f = r[p], c = r[p + 1], f < s && (s = f), c < u && (u = c), f > h && (h = f), c > l && (l = c);
    d = Math.max(h - s, l - u), d = d !== 0 ? 32767 / d : 0;
  }
  return $r(a, o, t, s, u, d, 0), o;
}
function $u(r, e, t, i, n) {
  var a, o;
  if (n === ga(r, e, t, i) > 0)
    for (a = e; a < t; a += i)
      o = rs(a, r[a], r[a + 1], o);
  else
    for (a = t - i; a >= e; a -= i)
      o = rs(a, r[a], r[a + 1], o);
  return o && yn(o, o.next) && (Jr(o), o = o.next), o;
}
function er(r, e) {
  if (!r)
    return r;
  e || (e = r);
  var t = r, i;
  do
    if (i = !1, !t.steiner && (yn(t, t.next) || Et(t.prev, t, t.next) === 0)) {
      if (Jr(t), t = e = t.prev, t === t.next)
        break;
      i = !0;
    } else
      t = t.next;
  while (i || t !== e);
  return e;
}
function $r(r, e, t, i, n, a, o) {
  if (r) {
    !o && a && Mf(r, i, n, a);
    for (var s = r, u, h; r.prev !== r.next; ) {
      if (u = r.prev, h = r.next, a ? wf(r, i, n, a) : xf(r)) {
        e.push(u.i / t | 0), e.push(r.i / t | 0), e.push(h.i / t | 0), Jr(r), r = h.next, s = h.next;
        continue;
      }
      if (r = h, r === s) {
        o ? o === 1 ? (r = Sf(er(r), e, t), $r(r, e, t, i, n, a, 2)) : o === 2 && Pf(r, e, t, i, n, a) : $r(er(r), e, t, i, n, a, 1);
        break;
      }
    }
  }
}
function xf(r) {
  var e = r.prev, t = r, i = r.next;
  if (Et(e, t, i) >= 0)
    return !1;
  for (var n = e.x, a = t.x, o = i.x, s = e.y, u = t.y, h = i.y, l = n < a ? n < o ? n : o : a < o ? a : o, f = s < u ? s < h ? s : h : u < h ? u : h, c = n > a ? n > o ? n : o : a > o ? a : o, d = s > u ? s > h ? s : h : u > h ? u : h, p = i.next; p !== e; ) {
    if (p.x >= l && p.x <= c && p.y >= f && p.y <= d && yr(n, s, a, u, o, h, p.x, p.y) && Et(p.prev, p, p.next) >= 0)
      return !1;
    p = p.next;
  }
  return !0;
}
function wf(r, e, t, i) {
  var n = r.prev, a = r, o = r.next;
  if (Et(n, a, o) >= 0)
    return !1;
  for (var s = n.x, u = a.x, h = o.x, l = n.y, f = a.y, c = o.y, d = s < u ? s < h ? s : h : u < h ? u : h, p = l < f ? l < c ? l : c : f < c ? f : c, v = s > u ? s > h ? s : h : u > h ? u : h, _ = l > f ? l > c ? l : c : f > c ? f : c, y = _a(d, p, e, t, i), g = _a(v, _, e, t, i), m = r.prevZ, E = r.nextZ; m && m.z >= y && E && E.z <= g; ) {
    if (m.x >= d && m.x <= v && m.y >= p && m.y <= _ && m !== n && m !== o && yr(s, l, u, f, h, c, m.x, m.y) && Et(m.prev, m, m.next) >= 0 || (m = m.prevZ, E.x >= d && E.x <= v && E.y >= p && E.y <= _ && E !== n && E !== o && yr(s, l, u, f, h, c, E.x, E.y) && Et(E.prev, E, E.next) >= 0))
      return !1;
    E = E.nextZ;
  }
  for (; m && m.z >= y; ) {
    if (m.x >= d && m.x <= v && m.y >= p && m.y <= _ && m !== n && m !== o && yr(s, l, u, f, h, c, m.x, m.y) && Et(m.prev, m, m.next) >= 0)
      return !1;
    m = m.prevZ;
  }
  for (; E && E.z <= g; ) {
    if (E.x >= d && E.x <= v && E.y >= p && E.y <= _ && E !== n && E !== o && yr(s, l, u, f, h, c, E.x, E.y) && Et(E.prev, E, E.next) >= 0)
      return !1;
    E = E.nextZ;
  }
  return !0;
}
function Sf(r, e, t) {
  var i = r;
  do {
    var n = i.prev, a = i.next.next;
    !yn(n, a) && Qu(n, i, i.next, a) && Qr(n, a) && Qr(a, n) && (e.push(n.i / t | 0), e.push(i.i / t | 0), e.push(a.i / t | 0), Jr(i), Jr(i.next), i = r = a), i = i.next;
  } while (i !== r);
  return er(i);
}
function Pf(r, e, t, i, n, a) {
  var o = r;
  do {
    for (var s = o.next.next; s !== o.prev; ) {
      if (o.i !== s.i && Nf(o, s)) {
        var u = Ju(o, s);
        o = er(o, o.next), u = er(u, u.next), $r(o, e, t, i, n, a, 0), $r(u, e, t, i, n, a, 0);
        return;
      }
      s = s.next;
    }
    o = o.next;
  } while (o !== r);
}
function Af(r, e, t, i) {
  var n = [], a, o, s, u, h;
  for (a = 0, o = e.length; a < o; a++)
    s = e[a] * i, u = a < o - 1 ? e[a + 1] * i : r.length, h = $u(r, s, u, i, !1), h === h.next && (h.steiner = !0), n.push(Ff(h));
  for (n.sort(Rf), a = 0; a < n.length; a++)
    t = Of(n[a], t);
  return t;
}
function Rf(r, e) {
  return r.x - e.x;
}
function Of(r, e) {
  var t = If(r, e);
  if (!t)
    return e;
  var i = Ju(t, r);
  return er(i, i.next), er(t, t.next);
}
function If(r, e) {
  var t = e, i = r.x, n = r.y, a = -1 / 0, o;
  do {
    if (n <= t.y && n >= t.next.y && t.next.y !== t.y) {
      var s = t.x + (n - t.y) * (t.next.x - t.x) / (t.next.y - t.y);
      if (s <= i && s > a && (a = s, o = t.x < t.next.x ? t : t.next, s === i))
        return o;
    }
    t = t.next;
  } while (t !== e);
  if (!o)
    return null;
  var u = o, h = o.x, l = o.y, f = 1 / 0, c;
  t = o;
  do
    i >= t.x && t.x >= h && i !== t.x && yr(n < l ? i : a, n, h, l, n < l ? a : i, n, t.x, t.y) && (c = Math.abs(n - t.y) / (i - t.x), Qr(t, r) && (c < f || c === f && (t.x > o.x || t.x === o.x && Cf(o, t))) && (o = t, f = c)), t = t.next;
  while (t !== u);
  return o;
}
function Cf(r, e) {
  return Et(r.prev, r, e.prev) < 0 && Et(e.next, r, r.next) < 0;
}
function Mf(r, e, t, i) {
  var n = r;
  do
    n.z === 0 && (n.z = _a(n.x, n.y, e, t, i)), n.prevZ = n.prev, n.nextZ = n.next, n = n.next;
  while (n !== r);
  n.prevZ.nextZ = null, n.prevZ = null, Df(n);
}
function Df(r) {
  var e, t, i, n, a, o, s, u, h = 1;
  do {
    for (t = r, r = null, a = null, o = 0; t; ) {
      for (o++, i = t, s = 0, e = 0; e < h && (s++, i = i.nextZ, !!i); e++)
        ;
      for (u = h; s > 0 || u > 0 && i; )
        s !== 0 && (u === 0 || !i || t.z <= i.z) ? (n = t, t = t.nextZ, s--) : (n = i, i = i.nextZ, u--), a ? a.nextZ = n : r = n, n.prevZ = a, a = n;
      t = i;
    }
    a.nextZ = null, h *= 2;
  } while (o > 1);
  return r;
}
function _a(r, e, t, i, n) {
  return r = (r - t) * n | 0, e = (e - i) * n | 0, r = (r | r << 8) & 16711935, r = (r | r << 4) & 252645135, r = (r | r << 2) & 858993459, r = (r | r << 1) & 1431655765, e = (e | e << 8) & 16711935, e = (e | e << 4) & 252645135, e = (e | e << 2) & 858993459, e = (e | e << 1) & 1431655765, r | e << 1;
}
function Ff(r) {
  var e = r, t = r;
  do
    (e.x < t.x || e.x === t.x && e.y < t.y) && (t = e), e = e.next;
  while (e !== r);
  return t;
}
function yr(r, e, t, i, n, a, o, s) {
  return (n - o) * (e - s) >= (r - o) * (a - s) && (r - o) * (i - s) >= (t - o) * (e - s) && (t - o) * (a - s) >= (n - o) * (i - s);
}
function Nf(r, e) {
  return r.next.i !== e.i && r.prev.i !== e.i && !Bf(r, e) && // dones't intersect other edges
  (Qr(r, e) && Qr(e, r) && Lf(r, e) && // locally visible
  (Et(r.prev, r, e.prev) || Et(r, e.prev, e)) || // does not create opposite-facing sectors
  yn(r, e) && Et(r.prev, r, r.next) > 0 && Et(e.prev, e, e.next) > 0);
}
function Et(r, e, t) {
  return (e.y - r.y) * (t.x - e.x) - (e.x - r.x) * (t.y - e.y);
}
function yn(r, e) {
  return r.x === e.x && r.y === e.y;
}
function Qu(r, e, t, i) {
  var n = vi(Et(r, e, t)), a = vi(Et(r, e, i)), o = vi(Et(t, i, r)), s = vi(Et(t, i, e));
  return !!(n !== a && o !== s || n === 0 && pi(r, t, e) || a === 0 && pi(r, i, e) || o === 0 && pi(t, r, i) || s === 0 && pi(t, e, i));
}
function pi(r, e, t) {
  return e.x <= Math.max(r.x, t.x) && e.x >= Math.min(r.x, t.x) && e.y <= Math.max(r.y, t.y) && e.y >= Math.min(r.y, t.y);
}
function vi(r) {
  return r > 0 ? 1 : r < 0 ? -1 : 0;
}
function Bf(r, e) {
  var t = r;
  do {
    if (t.i !== r.i && t.next.i !== r.i && t.i !== e.i && t.next.i !== e.i && Qu(t, t.next, r, e))
      return !0;
    t = t.next;
  } while (t !== r);
  return !1;
}
function Qr(r, e) {
  return Et(r.prev, r, r.next) < 0 ? Et(r, e, r.next) >= 0 && Et(r, r.prev, e) >= 0 : Et(r, e, r.prev) < 0 || Et(r, r.next, e) < 0;
}
function Lf(r, e) {
  var t = r, i = !1, n = (r.x + e.x) / 2, a = (r.y + e.y) / 2;
  do
    t.y > a != t.next.y > a && t.next.y !== t.y && n < (t.next.x - t.x) * (a - t.y) / (t.next.y - t.y) + t.x && (i = !i), t = t.next;
  while (t !== r);
  return i;
}
function Ju(r, e) {
  var t = new ya(r.i, r.x, r.y), i = new ya(e.i, e.x, e.y), n = r.next, a = e.prev;
  return r.next = e, e.prev = r, t.next = n, n.prev = t, i.next = t, t.prev = i, a.next = i, i.prev = a, i;
}
function rs(r, e, t, i) {
  var n = new ya(r, e, t);
  return i ? (n.next = i.next, n.prev = i, i.next.prev = n, i.next = n) : (n.prev = n, n.next = n), n;
}
function Jr(r) {
  r.next.prev = r.prev, r.prev.next = r.next, r.prevZ && (r.prevZ.nextZ = r.nextZ), r.nextZ && (r.nextZ.prevZ = r.prevZ);
}
function ya(r, e, t) {
  this.i = r, this.x = e, this.y = t, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = !1;
}
_n.deviation = function(r, e, t, i) {
  var n = e && e.length, a = n ? e[0] * t : r.length, o = Math.abs(ga(r, 0, a, t));
  if (n)
    for (var s = 0, u = e.length; s < u; s++) {
      var h = e[s] * t, l = s < u - 1 ? e[s + 1] * t : r.length;
      o -= Math.abs(ga(r, h, l, t));
    }
  var f = 0;
  for (s = 0; s < i.length; s += 3) {
    var c = i[s] * t, d = i[s + 1] * t, p = i[s + 2] * t;
    f += Math.abs(
      (r[c] - r[p]) * (r[d + 1] - r[c + 1]) - (r[c] - r[d]) * (r[p + 1] - r[c + 1])
    );
  }
  return o === 0 && f === 0 ? 0 : Math.abs((f - o) / o);
};
function ga(r, e, t, i) {
  for (var n = 0, a = e, o = t - i; a < t; a += i)
    n += (r[o] - r[a]) * (r[a + 1] + r[o + 1]), o = a;
  return n;
}
_n.flatten = function(r) {
  for (var e = r[0][0].length, t = { vertices: [], holes: [], dimensions: e }, i = 0, n = 0; n < r.length; n++) {
    for (var a = 0; a < r[n].length; a++)
      for (var o = 0; o < e; o++)
        t.vertices.push(r[n][a][o]);
    n > 0 && (i += r[n - 1].length, t.holes.push(i));
  }
  return t;
};
var Uf = vo.exports;
const th = /* @__PURE__ */ po(Uf);
var Ji = { exports: {} };
/*! https://mths.be/punycode v1.4.1 by @mathias */
Ji.exports;
(function(r, e) {
  (function(t) {
    var i = e && !e.nodeType && e, n = r && !r.nodeType && r, a = typeof ji == "object" && ji;
    (a.global === a || a.window === a || a.self === a) && (t = a);
    var o, s = 2147483647, u = 36, h = 1, l = 26, f = 38, c = 700, d = 72, p = 128, v = "-", _ = /^xn--/, y = /[^\x20-\x7E]/, g = /[\x2E\u3002\uFF0E\uFF61]/g, m = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    }, E = u - h, b = Math.floor, x = String.fromCharCode, S;
    function A(B) {
      throw new RangeError(m[B]);
    }
    function w(B, I) {
      for (var X = B.length, $ = []; X--; )
        $[X] = I(B[X]);
      return $;
    }
    function P(B, I) {
      var X = B.split("@"), $ = "";
      X.length > 1 && ($ = X[0] + "@", B = X[1]), B = B.replace(g, ".");
      var J = B.split("."), _t = w(J, I).join(".");
      return $ + _t;
    }
    function O(B) {
      for (var I = [], X = 0, $ = B.length, J, _t; X < $; )
        J = B.charCodeAt(X++), J >= 55296 && J <= 56319 && X < $ ? (_t = B.charCodeAt(X++), (_t & 64512) == 56320 ? I.push(((J & 1023) << 10) + (_t & 1023) + 65536) : (I.push(J), X--)) : I.push(J);
      return I;
    }
    function M(B) {
      return w(B, function(I) {
        var X = "";
        return I > 65535 && (I -= 65536, X += x(I >>> 10 & 1023 | 55296), I = 56320 | I & 1023), X += x(I), X;
      }).join("");
    }
    function D(B) {
      return B - 48 < 10 ? B - 22 : B - 65 < 26 ? B - 65 : B - 97 < 26 ? B - 97 : u;
    }
    function C(B, I) {
      return B + 22 + 75 * (B < 26) - ((I != 0) << 5);
    }
    function R(B, I, X) {
      var $ = 0;
      for (B = X ? b(B / c) : B >> 1, B += b(B / I); B > E * l >> 1; $ += u)
        B = b(B / E);
      return b($ + (E + 1) * B / (B + f));
    }
    function F(B) {
      var I = [], X = B.length, $, J = 0, _t = p, K = d, lt, mt, St, et, at, ut, dt, Q, q;
      for (lt = B.lastIndexOf(v), lt < 0 && (lt = 0), mt = 0; mt < lt; ++mt)
        B.charCodeAt(mt) >= 128 && A("not-basic"), I.push(B.charCodeAt(mt));
      for (St = lt > 0 ? lt + 1 : 0; St < X; ) {
        for (et = J, at = 1, ut = u; St >= X && A("invalid-input"), dt = D(B.charCodeAt(St++)), (dt >= u || dt > b((s - J) / at)) && A("overflow"), J += dt * at, Q = ut <= K ? h : ut >= K + l ? l : ut - K, !(dt < Q); ut += u)
          q = u - Q, at > b(s / q) && A("overflow"), at *= q;
        $ = I.length + 1, K = R(J - et, $, et == 0), b(J / $) > s - _t && A("overflow"), _t += b(J / $), J %= $, I.splice(J++, 0, _t);
      }
      return M(I);
    }
    function z(B) {
      var I, X, $, J, _t, K, lt, mt, St, et, at, ut = [], dt, Q, q, L;
      for (B = O(B), dt = B.length, I = p, X = 0, _t = d, K = 0; K < dt; ++K)
        at = B[K], at < 128 && ut.push(x(at));
      for ($ = J = ut.length, J && ut.push(v); $ < dt; ) {
        for (lt = s, K = 0; K < dt; ++K)
          at = B[K], at >= I && at < lt && (lt = at);
        for (Q = $ + 1, lt - I > b((s - X) / Q) && A("overflow"), X += (lt - I) * Q, I = lt, K = 0; K < dt; ++K)
          if (at = B[K], at < I && ++X > s && A("overflow"), at == I) {
            for (mt = X, St = u; et = St <= _t ? h : St >= _t + l ? l : St - _t, !(mt < et); St += u)
              L = mt - et, q = u - et, ut.push(
                x(C(et + L % q, 0))
              ), mt = b(L / q);
            ut.push(x(C(mt, 0))), _t = R(X, Q, $ == J), X = 0, ++$;
          }
        ++X, ++I;
      }
      return ut.join("");
    }
    function ot(B) {
      return P(B, function(I) {
        return _.test(I) ? F(I.slice(4).toLowerCase()) : I;
      });
    }
    function Z(B) {
      return P(B, function(I) {
        return y.test(I) ? "xn--" + z(I) : I;
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
      decode: F,
      encode: z,
      toASCII: Z,
      toUnicode: ot
    }, i && n)
      if (r.exports == i)
        n.exports = o;
      else
        for (S in o)
          o.hasOwnProperty(S) && (i[S] = o[S]);
    else
      t.punycode = o;
  })(ji);
})(Ji, Ji.exports);
var Gf = Ji.exports, kf = function() {
  if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
    return !1;
  if (typeof Symbol.iterator == "symbol")
    return !0;
  var e = {}, t = Symbol("test"), i = Object(t);
  if (typeof t == "string" || Object.prototype.toString.call(t) !== "[object Symbol]" || Object.prototype.toString.call(i) !== "[object Symbol]")
    return !1;
  var n = 42;
  e[t] = n;
  for (t in e)
    return !1;
  if (typeof Object.keys == "function" && Object.keys(e).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(e).length !== 0)
    return !1;
  var a = Object.getOwnPropertySymbols(e);
  if (a.length !== 1 || a[0] !== t || !Object.prototype.propertyIsEnumerable.call(e, t))
    return !1;
  if (typeof Object.getOwnPropertyDescriptor == "function") {
    var o = Object.getOwnPropertyDescriptor(e, t);
    if (o.value !== n || o.enumerable !== !0)
      return !1;
  }
  return !0;
}, is = typeof Symbol < "u" && Symbol, Hf = kf, Xf = function() {
  return typeof is != "function" || typeof Symbol != "function" || typeof is("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : Hf();
}, ns = {
  foo: {}
}, jf = Object, Vf = function() {
  return { __proto__: ns }.foo === ns.foo && !({ __proto__: null } instanceof jf);
}, zf = "Function.prototype.bind called on incompatible ", Wf = Object.prototype.toString, Yf = Math.max, qf = "[object Function]", as = function(e, t) {
  for (var i = [], n = 0; n < e.length; n += 1)
    i[n] = e[n];
  for (var a = 0; a < t.length; a += 1)
    i[a + e.length] = t[a];
  return i;
}, Kf = function(e, t) {
  for (var i = [], n = t || 0, a = 0; n < e.length; n += 1, a += 1)
    i[a] = e[n];
  return i;
}, Zf = function(r, e) {
  for (var t = "", i = 0; i < r.length; i += 1)
    t += r[i], i + 1 < r.length && (t += e);
  return t;
}, $f = function(e) {
  var t = this;
  if (typeof t != "function" || Wf.apply(t) !== qf)
    throw new TypeError(zf + t);
  for (var i = Kf(arguments, 1), n, a = function() {
    if (this instanceof n) {
      var l = t.apply(
        this,
        as(i, arguments)
      );
      return Object(l) === l ? l : this;
    }
    return t.apply(
      e,
      as(i, arguments)
    );
  }, o = Yf(0, t.length - i.length), s = [], u = 0; u < o; u++)
    s[u] = "$" + u;
  if (n = Function("binder", "return function (" + Zf(s, ",") + "){ return binder.apply(this,arguments); }")(a), t.prototype) {
    var h = function() {
    };
    h.prototype = t.prototype, n.prototype = new h(), h.prototype = null;
  }
  return n;
}, Qf = $f, _o = Function.prototype.bind || Qf, Jf = Function.prototype.call, tc = Object.prototype.hasOwnProperty, ec = _o, rc = ec.call(Jf, tc), tt, Ar = SyntaxError, eh = Function, Tr = TypeError, Rn = function(r) {
  try {
    return eh('"use strict"; return (' + r + ").constructor;")();
  } catch {
  }
}, Qe = Object.getOwnPropertyDescriptor;
if (Qe)
  try {
    Qe({}, "");
  } catch {
    Qe = null;
  }
var On = function() {
  throw new Tr();
}, ic = Qe ? function() {
  try {
    return arguments.callee, On;
  } catch {
    try {
      return Qe(arguments, "callee").get;
    } catch {
      return On;
    }
  }
}() : On, fr = Xf(), nc = Vf(), Mt = Object.getPrototypeOf || (nc ? function(r) {
  return r.__proto__;
} : null), _r = {}, ac = typeof Uint8Array > "u" || !Mt ? tt : Mt(Uint8Array), Je = {
  "%AggregateError%": typeof AggregateError > "u" ? tt : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer > "u" ? tt : ArrayBuffer,
  "%ArrayIteratorPrototype%": fr && Mt ? Mt([][Symbol.iterator]()) : tt,
  "%AsyncFromSyncIteratorPrototype%": tt,
  "%AsyncFunction%": _r,
  "%AsyncGenerator%": _r,
  "%AsyncGeneratorFunction%": _r,
  "%AsyncIteratorPrototype%": _r,
  "%Atomics%": typeof Atomics > "u" ? tt : Atomics,
  "%BigInt%": typeof BigInt > "u" ? tt : BigInt,
  "%BigInt64Array%": typeof BigInt64Array > "u" ? tt : BigInt64Array,
  "%BigUint64Array%": typeof BigUint64Array > "u" ? tt : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView > "u" ? tt : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": Error,
  "%eval%": eval,
  // eslint-disable-line no-eval
  "%EvalError%": EvalError,
  "%Float32Array%": typeof Float32Array > "u" ? tt : Float32Array,
  "%Float64Array%": typeof Float64Array > "u" ? tt : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? tt : FinalizationRegistry,
  "%Function%": eh,
  "%GeneratorFunction%": _r,
  "%Int8Array%": typeof Int8Array > "u" ? tt : Int8Array,
  "%Int16Array%": typeof Int16Array > "u" ? tt : Int16Array,
  "%Int32Array%": typeof Int32Array > "u" ? tt : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": fr && Mt ? Mt(Mt([][Symbol.iterator]())) : tt,
  "%JSON%": typeof JSON == "object" ? JSON : tt,
  "%Map%": typeof Map > "u" ? tt : Map,
  "%MapIteratorPrototype%": typeof Map > "u" || !fr || !Mt ? tt : Mt((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": Object,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise > "u" ? tt : Promise,
  "%Proxy%": typeof Proxy > "u" ? tt : Proxy,
  "%RangeError%": RangeError,
  "%ReferenceError%": ReferenceError,
  "%Reflect%": typeof Reflect > "u" ? tt : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set > "u" ? tt : Set,
  "%SetIteratorPrototype%": typeof Set > "u" || !fr || !Mt ? tt : Mt((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? tt : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": fr && Mt ? Mt(""[Symbol.iterator]()) : tt,
  "%Symbol%": fr ? Symbol : tt,
  "%SyntaxError%": Ar,
  "%ThrowTypeError%": ic,
  "%TypedArray%": ac,
  "%TypeError%": Tr,
  "%Uint8Array%": typeof Uint8Array > "u" ? tt : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? tt : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array > "u" ? tt : Uint16Array,
  "%Uint32Array%": typeof Uint32Array > "u" ? tt : Uint32Array,
  "%URIError%": URIError,
  "%WeakMap%": typeof WeakMap > "u" ? tt : WeakMap,
  "%WeakRef%": typeof WeakRef > "u" ? tt : WeakRef,
  "%WeakSet%": typeof WeakSet > "u" ? tt : WeakSet
};
if (Mt)
  try {
    null.error;
  } catch (r) {
    var oc = Mt(Mt(r));
    Je["%Error.prototype%"] = oc;
  }
var sc = function r(e) {
  var t;
  if (e === "%AsyncFunction%")
    t = Rn("async function () {}");
  else if (e === "%GeneratorFunction%")
    t = Rn("function* () {}");
  else if (e === "%AsyncGeneratorFunction%")
    t = Rn("async function* () {}");
  else if (e === "%AsyncGenerator%") {
    var i = r("%AsyncGeneratorFunction%");
    i && (t = i.prototype);
  } else if (e === "%AsyncIteratorPrototype%") {
    var n = r("%AsyncGenerator%");
    n && Mt && (t = Mt(n.prototype));
  }
  return Je[e] = t, t;
}, os = {
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
}, oi = _o, tn = rc, uc = oi.call(Function.call, Array.prototype.concat), hc = oi.call(Function.apply, Array.prototype.splice), ss = oi.call(Function.call, String.prototype.replace), en = oi.call(Function.call, String.prototype.slice), lc = oi.call(Function.call, RegExp.prototype.exec), fc = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, cc = /\\(\\)?/g, dc = function(e) {
  var t = en(e, 0, 1), i = en(e, -1);
  if (t === "%" && i !== "%")
    throw new Ar("invalid intrinsic syntax, expected closing `%`");
  if (i === "%" && t !== "%")
    throw new Ar("invalid intrinsic syntax, expected opening `%`");
  var n = [];
  return ss(e, fc, function(a, o, s, u) {
    n[n.length] = s ? ss(u, cc, "$1") : o || a;
  }), n;
}, pc = function(e, t) {
  var i = e, n;
  if (tn(os, i) && (n = os[i], i = "%" + n[0] + "%"), tn(Je, i)) {
    var a = Je[i];
    if (a === _r && (a = sc(i)), typeof a > "u" && !t)
      throw new Tr("intrinsic " + e + " exists, but is not available. Please file an issue!");
    return {
      alias: n,
      name: i,
      value: a
    };
  }
  throw new Ar("intrinsic " + e + " does not exist!");
}, or = function(e, t) {
  if (typeof e != "string" || e.length === 0)
    throw new Tr("intrinsic name must be a non-empty string");
  if (arguments.length > 1 && typeof t != "boolean")
    throw new Tr('"allowMissing" argument must be a boolean');
  if (lc(/^%?[^%]*%?$/, e) === null)
    throw new Ar("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  var i = dc(e), n = i.length > 0 ? i[0] : "", a = pc("%" + n + "%", t), o = a.name, s = a.value, u = !1, h = a.alias;
  h && (n = h[0], hc(i, uc([0, 1], h)));
  for (var l = 1, f = !0; l < i.length; l += 1) {
    var c = i[l], d = en(c, 0, 1), p = en(c, -1);
    if ((d === '"' || d === "'" || d === "`" || p === '"' || p === "'" || p === "`") && d !== p)
      throw new Ar("property names with quotes must have matching quotes");
    if ((c === "constructor" || !f) && (u = !0), n += "." + c, o = "%" + n + "%", tn(Je, o))
      s = Je[o];
    else if (s != null) {
      if (!(c in s)) {
        if (!t)
          throw new Tr("base intrinsic for " + e + " exists, but the property is not available.");
        return;
      }
      if (Qe && l + 1 >= i.length) {
        var v = Qe(s, c);
        f = !!v, f && "get" in v && !("originalValue" in v.get) ? s = v.get : s = s[c];
      } else
        f = tn(s, c), s = s[c];
      f && !u && (Je[o] = s);
    }
  }
  return s;
}, rh = { exports: {} }, vc = or, ma = vc("%Object.defineProperty%", !0), ba = function() {
  if (ma)
    try {
      return ma({}, "a", { value: 1 }), !0;
    } catch {
      return !1;
    }
  return !1;
};
ba.hasArrayLengthDefineBug = function() {
  if (!ba())
    return null;
  try {
    return ma([], "length", { value: 1 }).length !== 1;
  } catch {
    return !0;
  }
};
var ih = ba, _c = or, Vi = _c("%Object.getOwnPropertyDescriptor%", !0);
if (Vi)
  try {
    Vi([], "length");
  } catch {
    Vi = null;
  }
var nh = Vi, yc = ih(), yo = or, jr = yc && yo("%Object.defineProperty%", !0);
if (jr)
  try {
    jr({}, "a", { value: 1 });
  } catch {
    jr = !1;
  }
var gc = yo("%SyntaxError%"), cr = yo("%TypeError%"), us = nh, mc = function(e, t, i) {
  if (!e || typeof e != "object" && typeof e != "function")
    throw new cr("`obj` must be an object or a function`");
  if (typeof t != "string" && typeof t != "symbol")
    throw new cr("`property` must be a string or a symbol`");
  if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null)
    throw new cr("`nonEnumerable`, if provided, must be a boolean or null");
  if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null)
    throw new cr("`nonWritable`, if provided, must be a boolean or null");
  if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null)
    throw new cr("`nonConfigurable`, if provided, must be a boolean or null");
  if (arguments.length > 6 && typeof arguments[6] != "boolean")
    throw new cr("`loose`, if provided, must be a boolean");
  var n = arguments.length > 3 ? arguments[3] : null, a = arguments.length > 4 ? arguments[4] : null, o = arguments.length > 5 ? arguments[5] : null, s = arguments.length > 6 ? arguments[6] : !1, u = !!us && us(e, t);
  if (jr)
    jr(e, t, {
      configurable: o === null && u ? u.configurable : !o,
      enumerable: n === null && u ? u.enumerable : !n,
      value: i,
      writable: a === null && u ? u.writable : !a
    });
  else if (s || !n && !a && !o)
    e[t] = i;
  else
    throw new gc("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
}, ah = or, hs = mc, bc = ih(), ls = nh, fs = ah("%TypeError%"), Ec = ah("%Math.floor%"), Tc = function(e, t) {
  if (typeof e != "function")
    throw new fs("`fn` is not a function");
  if (typeof t != "number" || t < 0 || t > 4294967295 || Ec(t) !== t)
    throw new fs("`length` must be a positive 32-bit integer");
  var i = arguments.length > 2 && !!arguments[2], n = !0, a = !0;
  if ("length" in e && ls) {
    var o = ls(e, "length");
    o && !o.configurable && (n = !1), o && !o.writable && (a = !1);
  }
  return (n || a || !i) && (bc ? hs(e, "length", t, !0, !0) : hs(e, "length", t)), e;
};
(function(r) {
  var e = _o, t = or, i = Tc, n = t("%TypeError%"), a = t("%Function.prototype.apply%"), o = t("%Function.prototype.call%"), s = t("%Reflect.apply%", !0) || e.call(o, a), u = t("%Object.defineProperty%", !0), h = t("%Math.max%");
  if (u)
    try {
      u({}, "a", { value: 1 });
    } catch {
      u = null;
    }
  r.exports = function(c) {
    if (typeof c != "function")
      throw new n("a function is required");
    var d = s(e, o, arguments);
    return i(
      d,
      1 + h(0, c.length - (arguments.length - 1)),
      !0
    );
  };
  var l = function() {
    return s(e, a, arguments);
  };
  u ? u(r.exports, "apply", { value: l }) : r.exports.apply = l;
})(rh);
var xc = rh.exports, oh = or, sh = xc, wc = sh(oh("String.prototype.indexOf")), Sc = function(e, t) {
  var i = oh(e, !!t);
  return typeof i == "function" && wc(e, ".prototype.") > -1 ? sh(i) : i;
};
const Pc = {}, Ac = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Pc
}, Symbol.toStringTag, { value: "Module" })), Rc = /* @__PURE__ */ uf(Ac);
var go = typeof Map == "function" && Map.prototype, In = Object.getOwnPropertyDescriptor && go ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null, rn = go && In && typeof In.get == "function" ? In.get : null, cs = go && Map.prototype.forEach, mo = typeof Set == "function" && Set.prototype, Cn = Object.getOwnPropertyDescriptor && mo ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null, nn = mo && Cn && typeof Cn.get == "function" ? Cn.get : null, ds = mo && Set.prototype.forEach, Oc = typeof WeakMap == "function" && WeakMap.prototype, Vr = Oc ? WeakMap.prototype.has : null, Ic = typeof WeakSet == "function" && WeakSet.prototype, zr = Ic ? WeakSet.prototype.has : null, Cc = typeof WeakRef == "function" && WeakRef.prototype, ps = Cc ? WeakRef.prototype.deref : null, Mc = Boolean.prototype.valueOf, Dc = Object.prototype.toString, Fc = Function.prototype.toString, Nc = String.prototype.match, bo = String.prototype.slice, Oe = String.prototype.replace, Bc = String.prototype.toUpperCase, vs = String.prototype.toLowerCase, uh = RegExp.prototype.test, _s = Array.prototype.concat, ae = Array.prototype.join, Lc = Array.prototype.slice, ys = Math.floor, Ea = typeof BigInt == "function" ? BigInt.prototype.valueOf : null, Mn = Object.getOwnPropertySymbols, Ta = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Symbol.prototype.toString : null, Rr = typeof Symbol == "function" && typeof Symbol.iterator == "object", kt = typeof Symbol == "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === Rr || !0) ? Symbol.toStringTag : null, hh = Object.prototype.propertyIsEnumerable, gs = (typeof Reflect == "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(r) {
  return r.__proto__;
} : null);
function ms(r, e) {
  if (r === 1 / 0 || r === -1 / 0 || r !== r || r && r > -1e3 && r < 1e3 || uh.call(/e/, e))
    return e;
  var t = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof r == "number") {
    var i = r < 0 ? -ys(-r) : ys(r);
    if (i !== r) {
      var n = String(i), a = bo.call(e, n.length + 1);
      return Oe.call(n, t, "$&_") + "." + Oe.call(Oe.call(a, /([0-9]{3})/g, "$&_"), /_$/, "");
    }
  }
  return Oe.call(e, t, "$&_");
}
var xa = Rc, bs = xa.custom, Es = fh(bs) ? bs : null, Uc = function r(e, t, i, n) {
  var a = t || {};
  if (Pe(a, "quoteStyle") && a.quoteStyle !== "single" && a.quoteStyle !== "double")
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  if (Pe(a, "maxStringLength") && (typeof a.maxStringLength == "number" ? a.maxStringLength < 0 && a.maxStringLength !== 1 / 0 : a.maxStringLength !== null))
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  var o = Pe(a, "customInspect") ? a.customInspect : !0;
  if (typeof o != "boolean" && o !== "symbol")
    throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
  if (Pe(a, "indent") && a.indent !== null && a.indent !== "	" && !(parseInt(a.indent, 10) === a.indent && a.indent > 0))
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  if (Pe(a, "numericSeparator") && typeof a.numericSeparator != "boolean")
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  var s = a.numericSeparator;
  if (typeof e > "u")
    return "undefined";
  if (e === null)
    return "null";
  if (typeof e == "boolean")
    return e ? "true" : "false";
  if (typeof e == "string")
    return dh(e, a);
  if (typeof e == "number") {
    if (e === 0)
      return 1 / 0 / e > 0 ? "0" : "-0";
    var u = String(e);
    return s ? ms(e, u) : u;
  }
  if (typeof e == "bigint") {
    var h = String(e) + "n";
    return s ? ms(e, h) : h;
  }
  var l = typeof a.depth > "u" ? 5 : a.depth;
  if (typeof i > "u" && (i = 0), i >= l && l > 0 && typeof e == "object")
    return wa(e) ? "[Array]" : "[Object]";
  var f = rd(a, i);
  if (typeof n > "u")
    n = [];
  else if (ch(n, e) >= 0)
    return "[Circular]";
  function c(D, C, R) {
    if (C && (n = Lc.call(n), n.push(C)), R) {
      var F = {
        depth: a.depth
      };
      return Pe(a, "quoteStyle") && (F.quoteStyle = a.quoteStyle), r(D, F, i + 1, n);
    }
    return r(D, a, i + 1, n);
  }
  if (typeof e == "function" && !Ts(e)) {
    var d = Yc(e), p = _i(e, c);
    return "[Function" + (d ? ": " + d : " (anonymous)") + "]" + (p.length > 0 ? " { " + ae.call(p, ", ") + " }" : "");
  }
  if (fh(e)) {
    var v = Rr ? Oe.call(String(e), /^(Symbol\(.*\))_[^)]*$/, "$1") : Ta.call(e);
    return typeof e == "object" && !Rr ? Fr(v) : v;
  }
  if (Jc(e)) {
    for (var _ = "<" + vs.call(String(e.nodeName)), y = e.attributes || [], g = 0; g < y.length; g++)
      _ += " " + y[g].name + "=" + lh(Gc(y[g].value), "double", a);
    return _ += ">", e.childNodes && e.childNodes.length && (_ += "..."), _ += "</" + vs.call(String(e.nodeName)) + ">", _;
  }
  if (wa(e)) {
    if (e.length === 0)
      return "[]";
    var m = _i(e, c);
    return f && !ed(m) ? "[" + Sa(m, f) + "]" : "[ " + ae.call(m, ", ") + " ]";
  }
  if (Hc(e)) {
    var E = _i(e, c);
    return !("cause" in Error.prototype) && "cause" in e && !hh.call(e, "cause") ? "{ [" + String(e) + "] " + ae.call(_s.call("[cause]: " + c(e.cause), E), ", ") + " }" : E.length === 0 ? "[" + String(e) + "]" : "{ [" + String(e) + "] " + ae.call(E, ", ") + " }";
  }
  if (typeof e == "object" && o) {
    if (Es && typeof e[Es] == "function" && xa)
      return xa(e, { depth: l - i });
    if (o !== "symbol" && typeof e.inspect == "function")
      return e.inspect();
  }
  if (qc(e)) {
    var b = [];
    return cs && cs.call(e, function(D, C) {
      b.push(c(C, e, !0) + " => " + c(D, e));
    }), xs("Map", rn.call(e), b, f);
  }
  if ($c(e)) {
    var x = [];
    return ds && ds.call(e, function(D) {
      x.push(c(D, e));
    }), xs("Set", nn.call(e), x, f);
  }
  if (Kc(e))
    return Dn("WeakMap");
  if (Qc(e))
    return Dn("WeakSet");
  if (Zc(e))
    return Dn("WeakRef");
  if (jc(e))
    return Fr(c(Number(e)));
  if (zc(e))
    return Fr(c(Ea.call(e)));
  if (Vc(e))
    return Fr(Mc.call(e));
  if (Xc(e))
    return Fr(c(String(e)));
  if (typeof window < "u" && e === window)
    return "{ [object Window] }";
  if (e === ji)
    return "{ [object globalThis] }";
  if (!kc(e) && !Ts(e)) {
    var S = _i(e, c), A = gs ? gs(e) === Object.prototype : e instanceof Object || e.constructor === Object, w = e instanceof Object ? "" : "null prototype", P = !A && kt && Object(e) === e && kt in e ? bo.call(Be(e), 8, -1) : w ? "Object" : "", O = A || typeof e.constructor != "function" ? "" : e.constructor.name ? e.constructor.name + " " : "", M = O + (P || w ? "[" + ae.call(_s.call([], P || [], w || []), ": ") + "] " : "");
    return S.length === 0 ? M + "{}" : f ? M + "{" + Sa(S, f) + "}" : M + "{ " + ae.call(S, ", ") + " }";
  }
  return String(e);
};
function lh(r, e, t) {
  var i = (t.quoteStyle || e) === "double" ? '"' : "'";
  return i + r + i;
}
function Gc(r) {
  return Oe.call(String(r), /"/g, "&quot;");
}
function wa(r) {
  return Be(r) === "[object Array]" && (!kt || !(typeof r == "object" && kt in r));
}
function kc(r) {
  return Be(r) === "[object Date]" && (!kt || !(typeof r == "object" && kt in r));
}
function Ts(r) {
  return Be(r) === "[object RegExp]" && (!kt || !(typeof r == "object" && kt in r));
}
function Hc(r) {
  return Be(r) === "[object Error]" && (!kt || !(typeof r == "object" && kt in r));
}
function Xc(r) {
  return Be(r) === "[object String]" && (!kt || !(typeof r == "object" && kt in r));
}
function jc(r) {
  return Be(r) === "[object Number]" && (!kt || !(typeof r == "object" && kt in r));
}
function Vc(r) {
  return Be(r) === "[object Boolean]" && (!kt || !(typeof r == "object" && kt in r));
}
function fh(r) {
  if (Rr)
    return r && typeof r == "object" && r instanceof Symbol;
  if (typeof r == "symbol")
    return !0;
  if (!r || typeof r != "object" || !Ta)
    return !1;
  try {
    return Ta.call(r), !0;
  } catch {
  }
  return !1;
}
function zc(r) {
  if (!r || typeof r != "object" || !Ea)
    return !1;
  try {
    return Ea.call(r), !0;
  } catch {
  }
  return !1;
}
var Wc = Object.prototype.hasOwnProperty || function(r) {
  return r in this;
};
function Pe(r, e) {
  return Wc.call(r, e);
}
function Be(r) {
  return Dc.call(r);
}
function Yc(r) {
  if (r.name)
    return r.name;
  var e = Nc.call(Fc.call(r), /^function\s*([\w$]+)/);
  return e ? e[1] : null;
}
function ch(r, e) {
  if (r.indexOf)
    return r.indexOf(e);
  for (var t = 0, i = r.length; t < i; t++)
    if (r[t] === e)
      return t;
  return -1;
}
function qc(r) {
  if (!rn || !r || typeof r != "object")
    return !1;
  try {
    rn.call(r);
    try {
      nn.call(r);
    } catch {
      return !0;
    }
    return r instanceof Map;
  } catch {
  }
  return !1;
}
function Kc(r) {
  if (!Vr || !r || typeof r != "object")
    return !1;
  try {
    Vr.call(r, Vr);
    try {
      zr.call(r, zr);
    } catch {
      return !0;
    }
    return r instanceof WeakMap;
  } catch {
  }
  return !1;
}
function Zc(r) {
  if (!ps || !r || typeof r != "object")
    return !1;
  try {
    return ps.call(r), !0;
  } catch {
  }
  return !1;
}
function $c(r) {
  if (!nn || !r || typeof r != "object")
    return !1;
  try {
    nn.call(r);
    try {
      rn.call(r);
    } catch {
      return !0;
    }
    return r instanceof Set;
  } catch {
  }
  return !1;
}
function Qc(r) {
  if (!zr || !r || typeof r != "object")
    return !1;
  try {
    zr.call(r, zr);
    try {
      Vr.call(r, Vr);
    } catch {
      return !0;
    }
    return r instanceof WeakSet;
  } catch {
  }
  return !1;
}
function Jc(r) {
  return !r || typeof r != "object" ? !1 : typeof HTMLElement < "u" && r instanceof HTMLElement ? !0 : typeof r.nodeName == "string" && typeof r.getAttribute == "function";
}
function dh(r, e) {
  if (r.length > e.maxStringLength) {
    var t = r.length - e.maxStringLength, i = "... " + t + " more character" + (t > 1 ? "s" : "");
    return dh(bo.call(r, 0, e.maxStringLength), e) + i;
  }
  var n = Oe.call(Oe.call(r, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, td);
  return lh(n, "single", e);
}
function td(r) {
  var e = r.charCodeAt(0), t = {
    8: "b",
    9: "t",
    10: "n",
    12: "f",
    13: "r"
  }[e];
  return t ? "\\" + t : "\\x" + (e < 16 ? "0" : "") + Bc.call(e.toString(16));
}
function Fr(r) {
  return "Object(" + r + ")";
}
function Dn(r) {
  return r + " { ? }";
}
function xs(r, e, t, i) {
  var n = i ? Sa(t, i) : ae.call(t, ", ");
  return r + " (" + e + ") {" + n + "}";
}
function ed(r) {
  for (var e = 0; e < r.length; e++)
    if (ch(r[e], `
`) >= 0)
      return !1;
  return !0;
}
function rd(r, e) {
  var t;
  if (r.indent === "	")
    t = "	";
  else if (typeof r.indent == "number" && r.indent > 0)
    t = ae.call(Array(r.indent + 1), " ");
  else
    return null;
  return {
    base: t,
    prev: ae.call(Array(e + 1), t)
  };
}
function Sa(r, e) {
  if (r.length === 0)
    return "";
  var t = `
` + e.prev + e.base;
  return t + ae.call(r, "," + t) + `
` + e.prev;
}
function _i(r, e) {
  var t = wa(r), i = [];
  if (t) {
    i.length = r.length;
    for (var n = 0; n < r.length; n++)
      i[n] = Pe(r, n) ? e(r[n], r) : "";
  }
  var a = typeof Mn == "function" ? Mn(r) : [], o;
  if (Rr) {
    o = {};
    for (var s = 0; s < a.length; s++)
      o["$" + a[s]] = a[s];
  }
  for (var u in r)
    Pe(r, u) && (t && String(Number(u)) === u && u < r.length || Rr && o["$" + u] instanceof Symbol || (uh.call(/[^\w$]/, u) ? i.push(e(u, r) + ": " + e(r[u], r)) : i.push(u + ": " + e(r[u], r))));
  if (typeof Mn == "function")
    for (var h = 0; h < a.length; h++)
      hh.call(r, a[h]) && i.push("[" + e(a[h]) + "]: " + e(r[a[h]], r));
  return i;
}
var Eo = or, Mr = Sc, id = Uc, nd = Eo("%TypeError%"), yi = Eo("%WeakMap%", !0), gi = Eo("%Map%", !0), ad = Mr("WeakMap.prototype.get", !0), od = Mr("WeakMap.prototype.set", !0), sd = Mr("WeakMap.prototype.has", !0), ud = Mr("Map.prototype.get", !0), hd = Mr("Map.prototype.set", !0), ld = Mr("Map.prototype.has", !0), To = function(r, e) {
  for (var t = r, i; (i = t.next) !== null; t = i)
    if (i.key === e)
      return t.next = i.next, i.next = r.next, r.next = i, i;
}, fd = function(r, e) {
  var t = To(r, e);
  return t && t.value;
}, cd = function(r, e, t) {
  var i = To(r, e);
  i ? i.value = t : r.next = {
    // eslint-disable-line no-param-reassign
    key: e,
    next: r.next,
    value: t
  };
}, dd = function(r, e) {
  return !!To(r, e);
}, pd = function() {
  var e, t, i, n = {
    assert: function(a) {
      if (!n.has(a))
        throw new nd("Side channel does not contain " + id(a));
    },
    get: function(a) {
      if (yi && a && (typeof a == "object" || typeof a == "function")) {
        if (e)
          return ad(e, a);
      } else if (gi) {
        if (t)
          return ud(t, a);
      } else if (i)
        return fd(i, a);
    },
    has: function(a) {
      if (yi && a && (typeof a == "object" || typeof a == "function")) {
        if (e)
          return sd(e, a);
      } else if (gi) {
        if (t)
          return ld(t, a);
      } else if (i)
        return dd(i, a);
      return !1;
    },
    set: function(a, o) {
      yi && a && (typeof a == "object" || typeof a == "function") ? (e || (e = new yi()), od(e, a, o)) : gi ? (t || (t = new gi()), hd(t, a, o)) : (i || (i = { key: {}, next: null }), cd(i, a, o));
    }
  };
  return n;
}, vd = String.prototype.replace, _d = /%20/g, Fn = {
  RFC1738: "RFC1738",
  RFC3986: "RFC3986"
}, xo = {
  default: Fn.RFC3986,
  formatters: {
    RFC1738: function(r) {
      return vd.call(r, _d, "+");
    },
    RFC3986: function(r) {
      return String(r);
    }
  },
  RFC1738: Fn.RFC1738,
  RFC3986: Fn.RFC3986
}, yd = xo, Nn = Object.prototype.hasOwnProperty, Ye = Array.isArray, ne = function() {
  for (var r = [], e = 0; e < 256; ++e)
    r.push("%" + ((e < 16 ? "0" : "") + e.toString(16)).toUpperCase());
  return r;
}(), gd = function(e) {
  for (; e.length > 1; ) {
    var t = e.pop(), i = t.obj[t.prop];
    if (Ye(i)) {
      for (var n = [], a = 0; a < i.length; ++a)
        typeof i[a] < "u" && n.push(i[a]);
      t.obj[t.prop] = n;
    }
  }
}, ph = function(e, t) {
  for (var i = t && t.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, n = 0; n < e.length; ++n)
    typeof e[n] < "u" && (i[n] = e[n]);
  return i;
}, md = function r(e, t, i) {
  if (!t)
    return e;
  if (typeof t != "object") {
    if (Ye(e))
      e.push(t);
    else if (e && typeof e == "object")
      (i && (i.plainObjects || i.allowPrototypes) || !Nn.call(Object.prototype, t)) && (e[t] = !0);
    else
      return [e, t];
    return e;
  }
  if (!e || typeof e != "object")
    return [e].concat(t);
  var n = e;
  return Ye(e) && !Ye(t) && (n = ph(e, i)), Ye(e) && Ye(t) ? (t.forEach(function(a, o) {
    if (Nn.call(e, o)) {
      var s = e[o];
      s && typeof s == "object" && a && typeof a == "object" ? e[o] = r(s, a, i) : e.push(a);
    } else
      e[o] = a;
  }), e) : Object.keys(t).reduce(function(a, o) {
    var s = t[o];
    return Nn.call(a, o) ? a[o] = r(a[o], s, i) : a[o] = s, a;
  }, n);
}, bd = function(e, t) {
  return Object.keys(t).reduce(function(i, n) {
    return i[n] = t[n], i;
  }, e);
}, Ed = function(r, e, t) {
  var i = r.replace(/\+/g, " ");
  if (t === "iso-8859-1")
    return i.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(i);
  } catch {
    return i;
  }
}, Td = function(e, t, i, n, a) {
  if (e.length === 0)
    return e;
  var o = e;
  if (typeof e == "symbol" ? o = Symbol.prototype.toString.call(e) : typeof e != "string" && (o = String(e)), i === "iso-8859-1")
    return escape(o).replace(/%u[0-9a-f]{4}/gi, function(l) {
      return "%26%23" + parseInt(l.slice(2), 16) + "%3B";
    });
  for (var s = "", u = 0; u < o.length; ++u) {
    var h = o.charCodeAt(u);
    if (h === 45 || h === 46 || h === 95 || h === 126 || h >= 48 && h <= 57 || h >= 65 && h <= 90 || h >= 97 && h <= 122 || a === yd.RFC1738 && (h === 40 || h === 41)) {
      s += o.charAt(u);
      continue;
    }
    if (h < 128) {
      s = s + ne[h];
      continue;
    }
    if (h < 2048) {
      s = s + (ne[192 | h >> 6] + ne[128 | h & 63]);
      continue;
    }
    if (h < 55296 || h >= 57344) {
      s = s + (ne[224 | h >> 12] + ne[128 | h >> 6 & 63] + ne[128 | h & 63]);
      continue;
    }
    u += 1, h = 65536 + ((h & 1023) << 10 | o.charCodeAt(u) & 1023), s += ne[240 | h >> 18] + ne[128 | h >> 12 & 63] + ne[128 | h >> 6 & 63] + ne[128 | h & 63];
  }
  return s;
}, xd = function(e) {
  for (var t = [{ obj: { o: e }, prop: "o" }], i = [], n = 0; n < t.length; ++n)
    for (var a = t[n], o = a.obj[a.prop], s = Object.keys(o), u = 0; u < s.length; ++u) {
      var h = s[u], l = o[h];
      typeof l == "object" && l !== null && i.indexOf(l) === -1 && (t.push({ obj: o, prop: h }), i.push(l));
    }
  return gd(t), e;
}, wd = function(e) {
  return Object.prototype.toString.call(e) === "[object RegExp]";
}, Sd = function(e) {
  return !e || typeof e != "object" ? !1 : !!(e.constructor && e.constructor.isBuffer && e.constructor.isBuffer(e));
}, Pd = function(e, t) {
  return [].concat(e, t);
}, Ad = function(e, t) {
  if (Ye(e)) {
    for (var i = [], n = 0; n < e.length; n += 1)
      i.push(t(e[n]));
    return i;
  }
  return t(e);
}, vh = {
  arrayToObject: ph,
  assign: bd,
  combine: Pd,
  compact: xd,
  decode: Ed,
  encode: Td,
  isBuffer: Sd,
  isRegExp: wd,
  maybeMap: Ad,
  merge: md
}, _h = pd, zi = vh, Wr = xo, Rd = Object.prototype.hasOwnProperty, ws = {
  brackets: function(e) {
    return e + "[]";
  },
  comma: "comma",
  indices: function(e, t) {
    return e + "[" + t + "]";
  },
  repeat: function(e) {
    return e;
  }
}, _e = Array.isArray, Od = Array.prototype.push, yh = function(r, e) {
  Od.apply(r, _e(e) ? e : [e]);
}, Id = Date.prototype.toISOString, Ss = Wr.default, Ut = {
  addQueryPrefix: !1,
  allowDots: !1,
  charset: "utf-8",
  charsetSentinel: !1,
  delimiter: "&",
  encode: !0,
  encoder: zi.encode,
  encodeValuesOnly: !1,
  format: Ss,
  formatter: Wr.formatters[Ss],
  // deprecated
  indices: !1,
  serializeDate: function(e) {
    return Id.call(e);
  },
  skipNulls: !1,
  strictNullHandling: !1
}, Cd = function(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "symbol" || typeof e == "bigint";
}, Bn = {}, Md = function r(e, t, i, n, a, o, s, u, h, l, f, c, d, p, v, _) {
  for (var y = e, g = _, m = 0, E = !1; (g = g.get(Bn)) !== void 0 && !E; ) {
    var b = g.get(e);
    if (m += 1, typeof b < "u") {
      if (b === m)
        throw new RangeError("Cyclic object value");
      E = !0;
    }
    typeof g.get(Bn) > "u" && (m = 0);
  }
  if (typeof u == "function" ? y = u(t, y) : y instanceof Date ? y = f(y) : i === "comma" && _e(y) && (y = zi.maybeMap(y, function(F) {
    return F instanceof Date ? f(F) : F;
  })), y === null) {
    if (a)
      return s && !p ? s(t, Ut.encoder, v, "key", c) : t;
    y = "";
  }
  if (Cd(y) || zi.isBuffer(y)) {
    if (s) {
      var x = p ? t : s(t, Ut.encoder, v, "key", c);
      return [d(x) + "=" + d(s(y, Ut.encoder, v, "value", c))];
    }
    return [d(t) + "=" + d(String(y))];
  }
  var S = [];
  if (typeof y > "u")
    return S;
  var A;
  if (i === "comma" && _e(y))
    p && s && (y = zi.maybeMap(y, s)), A = [{ value: y.length > 0 ? y.join(",") || null : void 0 }];
  else if (_e(u))
    A = u;
  else {
    var w = Object.keys(y);
    A = h ? w.sort(h) : w;
  }
  for (var P = n && _e(y) && y.length === 1 ? t + "[]" : t, O = 0; O < A.length; ++O) {
    var M = A[O], D = typeof M == "object" && typeof M.value < "u" ? M.value : y[M];
    if (!(o && D === null)) {
      var C = _e(y) ? typeof i == "function" ? i(P, M) : P : P + (l ? "." + M : "[" + M + "]");
      _.set(e, m);
      var R = _h();
      R.set(Bn, _), yh(S, r(
        D,
        C,
        i,
        n,
        a,
        o,
        i === "comma" && p && _e(y) ? null : s,
        u,
        h,
        l,
        f,
        c,
        d,
        p,
        v,
        R
      ));
    }
  }
  return S;
}, Dd = function(e) {
  if (!e)
    return Ut;
  if (e.encoder !== null && typeof e.encoder < "u" && typeof e.encoder != "function")
    throw new TypeError("Encoder has to be a function.");
  var t = e.charset || Ut.charset;
  if (typeof e.charset < "u" && e.charset !== "utf-8" && e.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var i = Wr.default;
  if (typeof e.format < "u") {
    if (!Rd.call(Wr.formatters, e.format))
      throw new TypeError("Unknown format option provided.");
    i = e.format;
  }
  var n = Wr.formatters[i], a = Ut.filter;
  return (typeof e.filter == "function" || _e(e.filter)) && (a = e.filter), {
    addQueryPrefix: typeof e.addQueryPrefix == "boolean" ? e.addQueryPrefix : Ut.addQueryPrefix,
    allowDots: typeof e.allowDots > "u" ? Ut.allowDots : !!e.allowDots,
    charset: t,
    charsetSentinel: typeof e.charsetSentinel == "boolean" ? e.charsetSentinel : Ut.charsetSentinel,
    delimiter: typeof e.delimiter > "u" ? Ut.delimiter : e.delimiter,
    encode: typeof e.encode == "boolean" ? e.encode : Ut.encode,
    encoder: typeof e.encoder == "function" ? e.encoder : Ut.encoder,
    encodeValuesOnly: typeof e.encodeValuesOnly == "boolean" ? e.encodeValuesOnly : Ut.encodeValuesOnly,
    filter: a,
    format: i,
    formatter: n,
    serializeDate: typeof e.serializeDate == "function" ? e.serializeDate : Ut.serializeDate,
    skipNulls: typeof e.skipNulls == "boolean" ? e.skipNulls : Ut.skipNulls,
    sort: typeof e.sort == "function" ? e.sort : null,
    strictNullHandling: typeof e.strictNullHandling == "boolean" ? e.strictNullHandling : Ut.strictNullHandling
  };
}, Fd = function(r, e) {
  var t = r, i = Dd(e), n, a;
  typeof i.filter == "function" ? (a = i.filter, t = a("", t)) : _e(i.filter) && (a = i.filter, n = a);
  var o = [];
  if (typeof t != "object" || t === null)
    return "";
  var s;
  e && e.arrayFormat in ws ? s = e.arrayFormat : e && "indices" in e ? s = e.indices ? "indices" : "repeat" : s = "indices";
  var u = ws[s];
  if (e && "commaRoundTrip" in e && typeof e.commaRoundTrip != "boolean")
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  var h = u === "comma" && e && e.commaRoundTrip;
  n || (n = Object.keys(t)), i.sort && n.sort(i.sort);
  for (var l = _h(), f = 0; f < n.length; ++f) {
    var c = n[f];
    i.skipNulls && t[c] === null || yh(o, Md(
      t[c],
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
}, Or = vh, Pa = Object.prototype.hasOwnProperty, Nd = Array.isArray, Ct = {
  allowDots: !1,
  allowPrototypes: !1,
  allowSparse: !1,
  arrayLimit: 20,
  charset: "utf-8",
  charsetSentinel: !1,
  comma: !1,
  decoder: Or.decode,
  delimiter: "&",
  depth: 5,
  ignoreQueryPrefix: !1,
  interpretNumericEntities: !1,
  parameterLimit: 1e3,
  parseArrays: !0,
  plainObjects: !1,
  strictNullHandling: !1
}, Bd = function(r) {
  return r.replace(/&#(\d+);/g, function(e, t) {
    return String.fromCharCode(parseInt(t, 10));
  });
}, gh = function(r, e) {
  return r && typeof r == "string" && e.comma && r.indexOf(",") > -1 ? r.split(",") : r;
}, Ld = "utf8=%26%2310003%3B", Ud = "utf8=%E2%9C%93", Gd = function(e, t) {
  var i = { __proto__: null }, n = t.ignoreQueryPrefix ? e.replace(/^\?/, "") : e, a = t.parameterLimit === 1 / 0 ? void 0 : t.parameterLimit, o = n.split(t.delimiter, a), s = -1, u, h = t.charset;
  if (t.charsetSentinel)
    for (u = 0; u < o.length; ++u)
      o[u].indexOf("utf8=") === 0 && (o[u] === Ud ? h = "utf-8" : o[u] === Ld && (h = "iso-8859-1"), s = u, u = o.length);
  for (u = 0; u < o.length; ++u)
    if (u !== s) {
      var l = o[u], f = l.indexOf("]="), c = f === -1 ? l.indexOf("=") : f + 1, d, p;
      c === -1 ? (d = t.decoder(l, Ct.decoder, h, "key"), p = t.strictNullHandling ? null : "") : (d = t.decoder(l.slice(0, c), Ct.decoder, h, "key"), p = Or.maybeMap(
        gh(l.slice(c + 1), t),
        function(v) {
          return t.decoder(v, Ct.decoder, h, "value");
        }
      )), p && t.interpretNumericEntities && h === "iso-8859-1" && (p = Bd(p)), l.indexOf("[]=") > -1 && (p = Nd(p) ? [p] : p), Pa.call(i, d) ? i[d] = Or.combine(i[d], p) : i[d] = p;
    }
  return i;
}, kd = function(r, e, t, i) {
  for (var n = i ? e : gh(e, t), a = r.length - 1; a >= 0; --a) {
    var o, s = r[a];
    if (s === "[]" && t.parseArrays)
      o = [].concat(n);
    else {
      o = t.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
      var u = s.charAt(0) === "[" && s.charAt(s.length - 1) === "]" ? s.slice(1, -1) : s, h = parseInt(u, 10);
      !t.parseArrays && u === "" ? o = { 0: n } : !isNaN(h) && s !== u && String(h) === u && h >= 0 && t.parseArrays && h <= t.arrayLimit ? (o = [], o[h] = n) : u !== "__proto__" && (o[u] = n);
    }
    n = o;
  }
  return n;
}, Hd = function(e, t, i, n) {
  if (e) {
    var a = i.allowDots ? e.replace(/\.([^.[]+)/g, "[$1]") : e, o = /(\[[^[\]]*])/, s = /(\[[^[\]]*])/g, u = i.depth > 0 && o.exec(a), h = u ? a.slice(0, u.index) : a, l = [];
    if (h) {
      if (!i.plainObjects && Pa.call(Object.prototype, h) && !i.allowPrototypes)
        return;
      l.push(h);
    }
    for (var f = 0; i.depth > 0 && (u = s.exec(a)) !== null && f < i.depth; ) {
      if (f += 1, !i.plainObjects && Pa.call(Object.prototype, u[1].slice(1, -1)) && !i.allowPrototypes)
        return;
      l.push(u[1]);
    }
    return u && l.push("[" + a.slice(u.index) + "]"), kd(l, t, i, n);
  }
}, Xd = function(e) {
  if (!e)
    return Ct;
  if (e.decoder !== null && e.decoder !== void 0 && typeof e.decoder != "function")
    throw new TypeError("Decoder has to be a function.");
  if (typeof e.charset < "u" && e.charset !== "utf-8" && e.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var t = typeof e.charset > "u" ? Ct.charset : e.charset;
  return {
    allowDots: typeof e.allowDots > "u" ? Ct.allowDots : !!e.allowDots,
    allowPrototypes: typeof e.allowPrototypes == "boolean" ? e.allowPrototypes : Ct.allowPrototypes,
    allowSparse: typeof e.allowSparse == "boolean" ? e.allowSparse : Ct.allowSparse,
    arrayLimit: typeof e.arrayLimit == "number" ? e.arrayLimit : Ct.arrayLimit,
    charset: t,
    charsetSentinel: typeof e.charsetSentinel == "boolean" ? e.charsetSentinel : Ct.charsetSentinel,
    comma: typeof e.comma == "boolean" ? e.comma : Ct.comma,
    decoder: typeof e.decoder == "function" ? e.decoder : Ct.decoder,
    delimiter: typeof e.delimiter == "string" || Or.isRegExp(e.delimiter) ? e.delimiter : Ct.delimiter,
    // eslint-disable-next-line no-implicit-coercion, no-extra-parens
    depth: typeof e.depth == "number" || e.depth === !1 ? +e.depth : Ct.depth,
    ignoreQueryPrefix: e.ignoreQueryPrefix === !0,
    interpretNumericEntities: typeof e.interpretNumericEntities == "boolean" ? e.interpretNumericEntities : Ct.interpretNumericEntities,
    parameterLimit: typeof e.parameterLimit == "number" ? e.parameterLimit : Ct.parameterLimit,
    parseArrays: e.parseArrays !== !1,
    plainObjects: typeof e.plainObjects == "boolean" ? e.plainObjects : Ct.plainObjects,
    strictNullHandling: typeof e.strictNullHandling == "boolean" ? e.strictNullHandling : Ct.strictNullHandling
  };
}, jd = function(r, e) {
  var t = Xd(e);
  if (r === "" || r === null || typeof r > "u")
    return t.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (var i = typeof r == "string" ? Gd(r, t) : r, n = t.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, a = Object.keys(i), o = 0; o < a.length; ++o) {
    var s = a[o], u = Hd(s, i[s], t, typeof r == "string");
    n = Or.merge(n, u, t);
  }
  return t.allowSparse === !0 ? n : Or.compact(n);
}, Vd = Fd, zd = jd, Wd = xo, Yd = {
  formats: Wd,
  parse: zd,
  stringify: Vd
}, qd = Gf;
function Qt() {
  this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null;
}
var Kd = /^([a-z0-9.+-]+:)/i, Zd = /:[0-9]*$/, $d = /^(\/\/?(?!\/)[^?\s]*)(\?[^\s]*)?$/, Qd = [
  "<",
  ">",
  '"',
  "`",
  " ",
  "\r",
  `
`,
  "	"
], Jd = [
  "{",
  "}",
  "|",
  "\\",
  "^",
  "`"
].concat(Qd), Aa = ["'"].concat(Jd), Ps = [
  "%",
  "/",
  "?",
  ";",
  "#"
].concat(Aa), As = [
  "/",
  "?",
  "#"
], tp = 255, Rs = /^[+a-z0-9A-Z_-]{0,63}$/, ep = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, rp = {
  javascript: !0,
  "javascript:": !0
}, Ra = {
  javascript: !0,
  "javascript:": !0
}, xr = {
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
}, Oa = Yd;
function gn(r, e, t) {
  if (r && typeof r == "object" && r instanceof Qt)
    return r;
  var i = new Qt();
  return i.parse(r, e, t), i;
}
Qt.prototype.parse = function(r, e, t) {
  if (typeof r != "string")
    throw new TypeError("Parameter 'url' must be a string, not " + typeof r);
  var i = r.indexOf("?"), n = i !== -1 && i < r.indexOf("#") ? "?" : "#", a = r.split(n), o = /\\/g;
  a[0] = a[0].replace(o, "/"), r = a.join(n);
  var s = r;
  if (s = s.trim(), !t && r.split("#").length === 1) {
    var u = $d.exec(s);
    if (u)
      return this.path = s, this.href = s, this.pathname = u[1], u[2] ? (this.search = u[2], e ? this.query = Oa.parse(this.search.substr(1)) : this.query = this.search.substr(1)) : e && (this.search = "", this.query = {}), this;
  }
  var h = Kd.exec(s);
  if (h) {
    h = h[0];
    var l = h.toLowerCase();
    this.protocol = l, s = s.substr(h.length);
  }
  if (t || h || s.match(/^\/\/[^@/]+@[^@/]+/)) {
    var f = s.substr(0, 2) === "//";
    f && !(h && Ra[h]) && (s = s.substr(2), this.slashes = !0);
  }
  if (!Ra[h] && (f || h && !xr[h])) {
    for (var c = -1, d = 0; d < As.length; d++) {
      var p = s.indexOf(As[d]);
      p !== -1 && (c === -1 || p < c) && (c = p);
    }
    var v, _;
    c === -1 ? _ = s.lastIndexOf("@") : _ = s.lastIndexOf("@", c), _ !== -1 && (v = s.slice(0, _), s = s.slice(_ + 1), this.auth = decodeURIComponent(v)), c = -1;
    for (var d = 0; d < Ps.length; d++) {
      var p = s.indexOf(Ps[d]);
      p !== -1 && (c === -1 || p < c) && (c = p);
    }
    c === -1 && (c = s.length), this.host = s.slice(0, c), s = s.slice(c), this.parseHost(), this.hostname = this.hostname || "";
    var y = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!y)
      for (var g = this.hostname.split(/\./), d = 0, m = g.length; d < m; d++) {
        var E = g[d];
        if (E && !E.match(Rs)) {
          for (var b = "", x = 0, S = E.length; x < S; x++)
            E.charCodeAt(x) > 127 ? b += "x" : b += E[x];
          if (!b.match(Rs)) {
            var A = g.slice(0, d), w = g.slice(d + 1), P = E.match(ep);
            P && (A.push(P[1]), w.unshift(P[2])), w.length && (s = "/" + w.join(".") + s), this.hostname = A.join(".");
            break;
          }
        }
      }
    this.hostname.length > tp ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), y || (this.hostname = qd.toASCII(this.hostname));
    var O = this.port ? ":" + this.port : "", M = this.hostname || "";
    this.host = M + O, this.href += this.host, y && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), s[0] !== "/" && (s = "/" + s));
  }
  if (!rp[l])
    for (var d = 0, m = Aa.length; d < m; d++) {
      var D = Aa[d];
      if (s.indexOf(D) !== -1) {
        var C = encodeURIComponent(D);
        C === D && (C = escape(D)), s = s.split(D).join(C);
      }
    }
  var R = s.indexOf("#");
  R !== -1 && (this.hash = s.substr(R), s = s.slice(0, R));
  var F = s.indexOf("?");
  if (F !== -1 ? (this.search = s.substr(F), this.query = s.substr(F + 1), e && (this.query = Oa.parse(this.query)), s = s.slice(0, F)) : e && (this.search = "", this.query = {}), s && (this.pathname = s), xr[l] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
    var O = this.pathname || "", z = this.search || "";
    this.path = O + z;
  }
  return this.href = this.format(), this;
};
function ip(r) {
  return typeof r == "string" && (r = gn(r)), r instanceof Qt ? r.format() : Qt.prototype.format.call(r);
}
Qt.prototype.format = function() {
  var r = this.auth || "";
  r && (r = encodeURIComponent(r), r = r.replace(/%3A/i, ":"), r += "@");
  var e = this.protocol || "", t = this.pathname || "", i = this.hash || "", n = !1, a = "";
  this.host ? n = r + this.host : this.hostname && (n = r + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]"), this.port && (n += ":" + this.port)), this.query && typeof this.query == "object" && Object.keys(this.query).length && (a = Oa.stringify(this.query, {
    arrayFormat: "repeat",
    addQueryPrefix: !1
  }));
  var o = this.search || a && "?" + a || "";
  return e && e.substr(-1) !== ":" && (e += ":"), this.slashes || (!e || xr[e]) && n !== !1 ? (n = "//" + (n || ""), t && t.charAt(0) !== "/" && (t = "/" + t)) : n || (n = ""), i && i.charAt(0) !== "#" && (i = "#" + i), o && o.charAt(0) !== "?" && (o = "?" + o), t = t.replace(/[?#]/g, function(s) {
    return encodeURIComponent(s);
  }), o = o.replace("#", "%23"), e + n + t + o + i;
};
function np(r, e) {
  return gn(r, !1, !0).resolve(e);
}
Qt.prototype.resolve = function(r) {
  return this.resolveObject(gn(r, !1, !0)).format();
};
Qt.prototype.resolveObject = function(r) {
  if (typeof r == "string") {
    var e = new Qt();
    e.parse(r, !1, !0), r = e;
  }
  for (var t = new Qt(), i = Object.keys(this), n = 0; n < i.length; n++) {
    var a = i[n];
    t[a] = this[a];
  }
  if (t.hash = r.hash, r.href === "")
    return t.href = t.format(), t;
  if (r.slashes && !r.protocol) {
    for (var o = Object.keys(r), s = 0; s < o.length; s++) {
      var u = o[s];
      u !== "protocol" && (t[u] = r[u]);
    }
    return xr[t.protocol] && t.hostname && !t.pathname && (t.pathname = "/", t.path = t.pathname), t.href = t.format(), t;
  }
  if (r.protocol && r.protocol !== t.protocol) {
    if (!xr[r.protocol]) {
      for (var h = Object.keys(r), l = 0; l < h.length; l++) {
        var f = h[l];
        t[f] = r[f];
      }
      return t.href = t.format(), t;
    }
    if (t.protocol = r.protocol, !r.host && !Ra[r.protocol]) {
      for (var m = (r.pathname || "").split("/"); m.length && !(r.host = m.shift()); )
        ;
      r.host || (r.host = ""), r.hostname || (r.hostname = ""), m[0] !== "" && m.unshift(""), m.length < 2 && m.unshift(""), t.pathname = m.join("/");
    } else
      t.pathname = r.pathname;
    if (t.search = r.search, t.query = r.query, t.host = r.host || "", t.auth = r.auth, t.hostname = r.hostname || r.host, t.port = r.port, t.pathname || t.search) {
      var c = t.pathname || "", d = t.search || "";
      t.path = c + d;
    }
    return t.slashes = t.slashes || r.slashes, t.href = t.format(), t;
  }
  var p = t.pathname && t.pathname.charAt(0) === "/", v = r.host || r.pathname && r.pathname.charAt(0) === "/", _ = v || p || t.host && r.pathname, y = _, g = t.pathname && t.pathname.split("/") || [], m = r.pathname && r.pathname.split("/") || [], E = t.protocol && !xr[t.protocol];
  if (E && (t.hostname = "", t.port = null, t.host && (g[0] === "" ? g[0] = t.host : g.unshift(t.host)), t.host = "", r.protocol && (r.hostname = null, r.port = null, r.host && (m[0] === "" ? m[0] = r.host : m.unshift(r.host)), r.host = null), _ = _ && (m[0] === "" || g[0] === "")), v)
    t.host = r.host || r.host === "" ? r.host : t.host, t.hostname = r.hostname || r.hostname === "" ? r.hostname : t.hostname, t.search = r.search, t.query = r.query, g = m;
  else if (m.length)
    g || (g = []), g.pop(), g = g.concat(m), t.search = r.search, t.query = r.query;
  else if (r.search != null) {
    if (E) {
      t.host = g.shift(), t.hostname = t.host;
      var b = t.host && t.host.indexOf("@") > 0 ? t.host.split("@") : !1;
      b && (t.auth = b.shift(), t.hostname = b.shift(), t.host = t.hostname);
    }
    return t.search = r.search, t.query = r.query, (t.pathname !== null || t.search !== null) && (t.path = (t.pathname ? t.pathname : "") + (t.search ? t.search : "")), t.href = t.format(), t;
  }
  if (!g.length)
    return t.pathname = null, t.search ? t.path = "/" + t.search : t.path = null, t.href = t.format(), t;
  for (var x = g.slice(-1)[0], S = (t.host || r.host || g.length > 1) && (x === "." || x === "..") || x === "", A = 0, w = g.length; w >= 0; w--)
    x = g[w], x === "." ? g.splice(w, 1) : x === ".." ? (g.splice(w, 1), A++) : A && (g.splice(w, 1), A--);
  if (!_ && !y)
    for (; A--; A)
      g.unshift("..");
  _ && g[0] !== "" && (!g[0] || g[0].charAt(0) !== "/") && g.unshift(""), S && g.join("/").substr(-1) !== "/" && g.push("");
  var P = g[0] === "" || g[0] && g[0].charAt(0) === "/";
  if (E) {
    t.hostname = P ? "" : g.length ? g.shift() : "", t.host = t.hostname;
    var b = t.host && t.host.indexOf("@") > 0 ? t.host.split("@") : !1;
    b && (t.auth = b.shift(), t.hostname = b.shift(), t.host = t.hostname);
  }
  return _ = _ || t.host && g.length, _ && !P && g.unshift(""), g.length > 0 ? t.pathname = g.join("/") : (t.pathname = null, t.path = null), (t.pathname !== null || t.search !== null) && (t.path = (t.pathname ? t.pathname : "") + (t.search ? t.search : "")), t.auth = r.auth || t.auth, t.slashes = t.slashes || r.slashes, t.href = t.format(), t;
};
Qt.prototype.parseHost = function() {
  var r = this.host, e = Zd.exec(r);
  e && (e = e[0], e !== ":" && (this.port = e.substr(1)), r = r.substr(0, r.length - e.length)), r && (this.hostname = r);
};
var ap = gn, op = np, sp = ip;
/*!
 * @pixi/utils - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/utils is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var gr = {
  parse: ap,
  format: sp,
  resolve: op
};
U.RETINA_PREFIX = /@([0-9\.]+)x/;
U.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = !1;
var Os = !1, Is = "6.5.10";
function up(r) {
  var e;
  if (!Os) {
    if (U.ADAPTER.getNavigator().userAgent.toLowerCase().indexOf("chrome") > -1) {
      var t = [
        `
 %c %c %c PixiJS ` + Is + " - ✰ " + r + ` ✰  %c  %c  http://www.pixijs.com/  %c %c ♥%c♥%c♥ 

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
      (e = globalThis.console).log.apply(e, t);
    } else
      globalThis.console && globalThis.console.log("PixiJS " + Is + " - " + r + " - http://www.pixijs.com/");
    Os = !0;
  }
}
var Ln;
function hp() {
  return typeof Ln > "u" && (Ln = function() {
    var e = {
      stencil: !0,
      failIfMajorPerformanceCaveat: U.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
    };
    try {
      if (!U.ADAPTER.getWebGLRenderingContext())
        return !1;
      var t = U.ADAPTER.createCanvas(), i = t.getContext("webgl", e) || t.getContext("experimental-webgl", e), n = !!(i && i.getContextAttributes().stencil);
      if (i) {
        var a = i.getExtension("WEBGL_lose_context");
        a && a.loseContext();
      }
      return i = null, n;
    } catch {
      return !1;
    }
  }()), Ln;
}
var lp = "#f0f8ff", fp = "#faebd7", cp = "#00ffff", dp = "#7fffd4", pp = "#f0ffff", vp = "#f5f5dc", _p = "#ffe4c4", yp = "#000000", gp = "#ffebcd", mp = "#0000ff", bp = "#8a2be2", Ep = "#a52a2a", Tp = "#deb887", xp = "#5f9ea0", wp = "#7fff00", Sp = "#d2691e", Pp = "#ff7f50", Ap = "#6495ed", Rp = "#fff8dc", Op = "#dc143c", Ip = "#00ffff", Cp = "#00008b", Mp = "#008b8b", Dp = "#b8860b", Fp = "#a9a9a9", Np = "#006400", Bp = "#a9a9a9", Lp = "#bdb76b", Up = "#8b008b", Gp = "#556b2f", kp = "#ff8c00", Hp = "#9932cc", Xp = "#8b0000", jp = "#e9967a", Vp = "#8fbc8f", zp = "#483d8b", Wp = "#2f4f4f", Yp = "#2f4f4f", qp = "#00ced1", Kp = "#9400d3", Zp = "#ff1493", $p = "#00bfff", Qp = "#696969", Jp = "#696969", tv = "#1e90ff", ev = "#b22222", rv = "#fffaf0", iv = "#228b22", nv = "#ff00ff", av = "#dcdcdc", ov = "#f8f8ff", sv = "#daa520", uv = "#ffd700", hv = "#808080", lv = "#008000", fv = "#adff2f", cv = "#808080", dv = "#f0fff0", pv = "#ff69b4", vv = "#cd5c5c", _v = "#4b0082", yv = "#fffff0", gv = "#f0e68c", mv = "#fff0f5", bv = "#e6e6fa", Ev = "#7cfc00", Tv = "#fffacd", xv = "#add8e6", wv = "#f08080", Sv = "#e0ffff", Pv = "#fafad2", Av = "#d3d3d3", Rv = "#90ee90", Ov = "#d3d3d3", Iv = "#ffb6c1", Cv = "#ffa07a", Mv = "#20b2aa", Dv = "#87cefa", Fv = "#778899", Nv = "#778899", Bv = "#b0c4de", Lv = "#ffffe0", Uv = "#00ff00", Gv = "#32cd32", kv = "#faf0e6", Hv = "#ff00ff", Xv = "#800000", jv = "#66cdaa", Vv = "#0000cd", zv = "#ba55d3", Wv = "#9370db", Yv = "#3cb371", qv = "#7b68ee", Kv = "#00fa9a", Zv = "#48d1cc", $v = "#c71585", Qv = "#191970", Jv = "#f5fffa", t_ = "#ffe4e1", e_ = "#ffe4b5", r_ = "#ffdead", i_ = "#000080", n_ = "#fdf5e6", a_ = "#808000", o_ = "#6b8e23", s_ = "#ffa500", u_ = "#ff4500", h_ = "#da70d6", l_ = "#eee8aa", f_ = "#98fb98", c_ = "#afeeee", d_ = "#db7093", p_ = "#ffefd5", v_ = "#ffdab9", __ = "#cd853f", y_ = "#ffc0cb", g_ = "#dda0dd", m_ = "#b0e0e6", b_ = "#800080", E_ = "#663399", T_ = "#ff0000", x_ = "#bc8f8f", w_ = "#4169e1", S_ = "#8b4513", P_ = "#fa8072", A_ = "#f4a460", R_ = "#2e8b57", O_ = "#fff5ee", I_ = "#a0522d", C_ = "#c0c0c0", M_ = "#87ceeb", D_ = "#6a5acd", F_ = "#708090", N_ = "#708090", B_ = "#fffafa", L_ = "#00ff7f", U_ = "#4682b4", G_ = "#d2b48c", k_ = "#008080", H_ = "#d8bfd8", X_ = "#ff6347", j_ = "#40e0d0", V_ = "#ee82ee", z_ = "#f5deb3", W_ = "#ffffff", Y_ = "#f5f5f5", q_ = "#ffff00", K_ = "#9acd32", Z_ = {
  aliceblue: lp,
  antiquewhite: fp,
  aqua: cp,
  aquamarine: dp,
  azure: pp,
  beige: vp,
  bisque: _p,
  black: yp,
  blanchedalmond: gp,
  blue: mp,
  blueviolet: bp,
  brown: Ep,
  burlywood: Tp,
  cadetblue: xp,
  chartreuse: wp,
  chocolate: Sp,
  coral: Pp,
  cornflowerblue: Ap,
  cornsilk: Rp,
  crimson: Op,
  cyan: Ip,
  darkblue: Cp,
  darkcyan: Mp,
  darkgoldenrod: Dp,
  darkgray: Fp,
  darkgreen: Np,
  darkgrey: Bp,
  darkkhaki: Lp,
  darkmagenta: Up,
  darkolivegreen: Gp,
  darkorange: kp,
  darkorchid: Hp,
  darkred: Xp,
  darksalmon: jp,
  darkseagreen: Vp,
  darkslateblue: zp,
  darkslategray: Wp,
  darkslategrey: Yp,
  darkturquoise: qp,
  darkviolet: Kp,
  deeppink: Zp,
  deepskyblue: $p,
  dimgray: Qp,
  dimgrey: Jp,
  dodgerblue: tv,
  firebrick: ev,
  floralwhite: rv,
  forestgreen: iv,
  fuchsia: nv,
  gainsboro: av,
  ghostwhite: ov,
  goldenrod: sv,
  gold: uv,
  gray: hv,
  green: lv,
  greenyellow: fv,
  grey: cv,
  honeydew: dv,
  hotpink: pv,
  indianred: vv,
  indigo: _v,
  ivory: yv,
  khaki: gv,
  lavenderblush: mv,
  lavender: bv,
  lawngreen: Ev,
  lemonchiffon: Tv,
  lightblue: xv,
  lightcoral: wv,
  lightcyan: Sv,
  lightgoldenrodyellow: Pv,
  lightgray: Av,
  lightgreen: Rv,
  lightgrey: Ov,
  lightpink: Iv,
  lightsalmon: Cv,
  lightseagreen: Mv,
  lightskyblue: Dv,
  lightslategray: Fv,
  lightslategrey: Nv,
  lightsteelblue: Bv,
  lightyellow: Lv,
  lime: Uv,
  limegreen: Gv,
  linen: kv,
  magenta: Hv,
  maroon: Xv,
  mediumaquamarine: jv,
  mediumblue: Vv,
  mediumorchid: zv,
  mediumpurple: Wv,
  mediumseagreen: Yv,
  mediumslateblue: qv,
  mediumspringgreen: Kv,
  mediumturquoise: Zv,
  mediumvioletred: $v,
  midnightblue: Qv,
  mintcream: Jv,
  mistyrose: t_,
  moccasin: e_,
  navajowhite: r_,
  navy: i_,
  oldlace: n_,
  olive: a_,
  olivedrab: o_,
  orange: s_,
  orangered: u_,
  orchid: h_,
  palegoldenrod: l_,
  palegreen: f_,
  paleturquoise: c_,
  palevioletred: d_,
  papayawhip: p_,
  peachpuff: v_,
  peru: __,
  pink: y_,
  plum: g_,
  powderblue: m_,
  purple: b_,
  rebeccapurple: E_,
  red: T_,
  rosybrown: x_,
  royalblue: w_,
  saddlebrown: S_,
  salmon: P_,
  sandybrown: A_,
  seagreen: R_,
  seashell: O_,
  sienna: I_,
  silver: C_,
  skyblue: M_,
  slateblue: D_,
  slategray: F_,
  slategrey: N_,
  snow: B_,
  springgreen: L_,
  steelblue: U_,
  tan: G_,
  teal: k_,
  thistle: H_,
  tomato: X_,
  turquoise: j_,
  violet: V_,
  wheat: z_,
  white: W_,
  whitesmoke: Y_,
  yellow: q_,
  yellowgreen: K_
};
function Ir(r, e) {
  return e === void 0 && (e = []), e[0] = (r >> 16 & 255) / 255, e[1] = (r >> 8 & 255) / 255, e[2] = (r & 255) / 255, e;
}
function mh(r) {
  var e = r.toString(16);
  return e = "000000".substring(0, 6 - e.length) + e, "#" + e;
}
function an(r) {
  return typeof r == "string" && (r = Z_[r.toLowerCase()] || r, r[0] === "#" && (r = r.slice(1))), parseInt(r, 16);
}
function $_() {
  for (var r = [], e = [], t = 0; t < 32; t++)
    r[t] = t, e[t] = t;
  r[H.NORMAL_NPM] = H.NORMAL, r[H.ADD_NPM] = H.ADD, r[H.SCREEN_NPM] = H.SCREEN, e[H.NORMAL] = H.NORMAL_NPM, e[H.ADD] = H.ADD_NPM, e[H.SCREEN] = H.SCREEN_NPM;
  var i = [];
  return i.push(e), i.push(r), i;
}
var bh = $_();
function Eh(r, e) {
  return bh[e ? 1 : 0][r];
}
function Q_(r, e, t, i) {
  return t = t || new Float32Array(4), i || i === void 0 ? (t[0] = r[0] * e, t[1] = r[1] * e, t[2] = r[2] * e) : (t[0] = r[0], t[1] = r[1], t[2] = r[2]), t[3] = e, t;
}
function wo(r, e) {
  if (e === 1)
    return (e * 255 << 24) + r;
  if (e === 0)
    return 0;
  var t = r >> 16 & 255, i = r >> 8 & 255, n = r & 255;
  return t = t * e + 0.5 | 0, i = i * e + 0.5 | 0, n = n * e + 0.5 | 0, (e * 255 << 24) + (t << 16) + (i << 8) + n;
}
function Th(r, e, t, i) {
  return t = t || new Float32Array(4), t[0] = (r >> 16 & 255) / 255, t[1] = (r >> 8 & 255) / 255, t[2] = (r & 255) / 255, (i || i === void 0) && (t[0] *= e, t[1] *= e, t[2] *= e), t[3] = e, t;
}
function J_(r, e) {
  e === void 0 && (e = null);
  var t = r * 6;
  if (e = e || new Uint16Array(t), e.length !== t)
    throw new Error("Out buffer length is incorrect, got " + e.length + " and expected " + t);
  for (var i = 0, n = 0; i < t; i += 6, n += 4)
    e[i + 0] = n + 0, e[i + 1] = n + 1, e[i + 2] = n + 2, e[i + 3] = n + 0, e[i + 4] = n + 2, e[i + 5] = n + 3;
  return e;
}
function xh(r) {
  if (r.BYTES_PER_ELEMENT === 4)
    return r instanceof Float32Array ? "Float32Array" : r instanceof Uint32Array ? "Uint32Array" : "Int32Array";
  if (r.BYTES_PER_ELEMENT === 2) {
    if (r instanceof Uint16Array)
      return "Uint16Array";
  } else if (r.BYTES_PER_ELEMENT === 1 && r instanceof Uint8Array)
    return "Uint8Array";
  return null;
}
function on(r) {
  return r += r === 0 ? 1 : 0, --r, r |= r >>> 1, r |= r >>> 2, r |= r >>> 4, r |= r >>> 8, r |= r >>> 16, r + 1;
}
function Cs(r) {
  return !(r & r - 1) && !!r;
}
function Ms(r) {
  var e = (r > 65535 ? 1 : 0) << 4;
  r >>>= e;
  var t = (r > 255 ? 1 : 0) << 3;
  return r >>>= t, e |= t, t = (r > 15 ? 1 : 0) << 2, r >>>= t, e |= t, t = (r > 3 ? 1 : 0) << 1, r >>>= t, e |= t, e | r >> 1;
}
function wr(r, e, t) {
  var i = r.length, n;
  if (!(e >= i || t === 0)) {
    t = e + t > i ? i - e : t;
    var a = i - t;
    for (n = e; n < a; ++n)
      r[n] = r[n + t];
    r.length = a;
  }
}
function mr(r) {
  return r === 0 ? 0 : r < 0 ? -1 : 1;
}
var ty = 0;
function rr() {
  return ++ty;
}
var Ds = {};
function Jt(r, e, t) {
  if (t === void 0 && (t = 3), !Ds[e]) {
    var i = new Error().stack;
    typeof i > "u" ? console.warn("PixiJS Deprecation Warning: ", e + `
Deprecated since v` + r) : (i = i.split(`
`).splice(t).join(`
`), console.groupCollapsed ? (console.groupCollapsed("%cPixiJS Deprecation Warning: %c%s", "color:#614108;background:#fffbe6", "font-weight:normal;color:#614108;background:#fffbe6", e + `
Deprecated since v` + r), console.warn(i), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", e + `
Deprecated since v` + r), console.warn(i))), Ds[e] = !0;
  }
}
var Fs = {}, ve = /* @__PURE__ */ Object.create(null), Ue = /* @__PURE__ */ Object.create(null), Ns = (
  /** @class */
  function() {
    function r(e, t, i) {
      this.canvas = U.ADAPTER.createCanvas(), this.context = this.canvas.getContext("2d"), this.resolution = i || U.RESOLUTION, this.resize(e, t);
    }
    return r.prototype.clear = function() {
      this.context.setTransform(1, 0, 0, 1, 0, 0), this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }, r.prototype.resize = function(e, t) {
      this.canvas.width = Math.round(e * this.resolution), this.canvas.height = Math.round(t * this.resolution);
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
      set: function(e) {
        this.canvas.width = Math.round(e);
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
      set: function(e) {
        this.canvas.height = Math.round(e);
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
);
function ey(r) {
  var e = r.width, t = r.height, i = r.getContext("2d", {
    willReadFrequently: !0
  }), n = i.getImageData(0, 0, e, t), a = n.data, o = a.length, s = {
    top: null,
    left: null,
    right: null,
    bottom: null
  }, u = null, h, l, f;
  for (h = 0; h < o; h += 4)
    a[h + 3] !== 0 && (l = h / 4 % e, f = ~~(h / 4 / e), s.top === null && (s.top = f), (s.left === null || l < s.left) && (s.left = l), (s.right === null || s.right < l) && (s.right = l + 1), (s.bottom === null || s.bottom < f) && (s.bottom = f));
  return s.top !== null && (e = s.right - s.left, t = s.bottom - s.top + 1, u = i.getImageData(s.left, s.top, e, t)), {
    height: t,
    width: e,
    data: u
  };
}
var mi;
function ry(r, e) {
  if (e === void 0 && (e = globalThis.location), r.indexOf("data:") === 0)
    return "";
  e = e || globalThis.location, mi || (mi = document.createElement("a")), mi.href = r;
  var t = gr.parse(mi.href), i = !t.port && e.port === "" || t.port === e.port;
  return t.hostname !== e.hostname || !i || t.protocol !== e.protocol ? "anonymous" : "";
}
function sn(r, e) {
  var t = U.RETINA_PREFIX.exec(r);
  return t ? parseFloat(t[1]) : e !== void 0 ? e : 1;
}
/*!
 * @pixi/math - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/math is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var un = Math.PI * 2, iy = 180 / Math.PI, ny = Math.PI / 180, Dt;
(function(r) {
  r[r.POLY = 0] = "POLY", r[r.RECT = 1] = "RECT", r[r.CIRC = 2] = "CIRC", r[r.ELIP = 3] = "ELIP", r[r.RREC = 4] = "RREC";
})(Dt || (Dt = {}));
var yt = (
  /** @class */
  function() {
    function r(e, t) {
      e === void 0 && (e = 0), t === void 0 && (t = 0), this.x = 0, this.y = 0, this.x = e, this.y = t;
    }
    return r.prototype.clone = function() {
      return new r(this.x, this.y);
    }, r.prototype.copyFrom = function(e) {
      return this.set(e.x, e.y), this;
    }, r.prototype.copyTo = function(e) {
      return e.set(this.x, this.y), e;
    }, r.prototype.equals = function(e) {
      return e.x === this.x && e.y === this.y;
    }, r.prototype.set = function(e, t) {
      return e === void 0 && (e = 0), t === void 0 && (t = e), this.x = e, this.y = t, this;
    }, r.prototype.toString = function() {
      return "[@pixi/math:Point x=" + this.x + " y=" + this.y + "]";
    }, r;
  }()
), bi = [new yt(), new yt(), new yt(), new yt()], it = (
  /** @class */
  function() {
    function r(e, t, i, n) {
      e === void 0 && (e = 0), t === void 0 && (t = 0), i === void 0 && (i = 0), n === void 0 && (n = 0), this.x = Number(e), this.y = Number(t), this.width = Number(i), this.height = Number(n), this.type = Dt.RECT;
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
    }, r.prototype.copyFrom = function(e) {
      return this.x = e.x, this.y = e.y, this.width = e.width, this.height = e.height, this;
    }, r.prototype.copyTo = function(e) {
      return e.x = this.x, e.y = this.y, e.width = this.width, e.height = this.height, e;
    }, r.prototype.contains = function(e, t) {
      return this.width <= 0 || this.height <= 0 ? !1 : e >= this.x && e < this.x + this.width && t >= this.y && t < this.y + this.height;
    }, r.prototype.intersects = function(e, t) {
      if (!t) {
        var i = this.x < e.x ? e.x : this.x, n = this.right > e.right ? e.right : this.right;
        if (n <= i)
          return !1;
        var a = this.y < e.y ? e.y : this.y, o = this.bottom > e.bottom ? e.bottom : this.bottom;
        return o > a;
      }
      var s = this.left, u = this.right, h = this.top, l = this.bottom;
      if (u <= s || l <= h)
        return !1;
      var f = bi[0].set(e.left, e.top), c = bi[1].set(e.left, e.bottom), d = bi[2].set(e.right, e.top), p = bi[3].set(e.right, e.bottom);
      if (d.x <= f.x || c.y <= f.y)
        return !1;
      var v = Math.sign(t.a * t.d - t.b * t.c);
      if (v === 0 || (t.apply(f, f), t.apply(c, c), t.apply(d, d), t.apply(p, p), Math.max(f.x, c.x, d.x, p.x) <= s || Math.min(f.x, c.x, d.x, p.x) >= u || Math.max(f.y, c.y, d.y, p.y) <= h || Math.min(f.y, c.y, d.y, p.y) >= l))
        return !1;
      var _ = v * (c.y - f.y), y = v * (f.x - c.x), g = _ * s + y * h, m = _ * u + y * h, E = _ * s + y * l, b = _ * u + y * l;
      if (Math.max(g, m, E, b) <= _ * f.x + y * f.y || Math.min(g, m, E, b) >= _ * p.x + y * p.y)
        return !1;
      var x = v * (f.y - d.y), S = v * (d.x - f.x), A = x * s + S * h, w = x * u + S * h, P = x * s + S * l, O = x * u + S * l;
      return !(Math.max(A, w, P, O) <= x * f.x + S * f.y || Math.min(A, w, P, O) >= x * p.x + S * p.y);
    }, r.prototype.pad = function(e, t) {
      return e === void 0 && (e = 0), t === void 0 && (t = e), this.x -= e, this.y -= t, this.width += e * 2, this.height += t * 2, this;
    }, r.prototype.fit = function(e) {
      var t = Math.max(this.x, e.x), i = Math.min(this.x + this.width, e.x + e.width), n = Math.max(this.y, e.y), a = Math.min(this.y + this.height, e.y + e.height);
      return this.x = t, this.width = Math.max(i - t, 0), this.y = n, this.height = Math.max(a - n, 0), this;
    }, r.prototype.ceil = function(e, t) {
      e === void 0 && (e = 1), t === void 0 && (t = 1e-3);
      var i = Math.ceil((this.x + this.width - t) * e) / e, n = Math.ceil((this.y + this.height - t) * e) / e;
      return this.x = Math.floor((this.x + t) * e) / e, this.y = Math.floor((this.y + t) * e) / e, this.width = i - this.x, this.height = n - this.y, this;
    }, r.prototype.enlarge = function(e) {
      var t = Math.min(this.x, e.x), i = Math.max(this.x + this.width, e.x + e.width), n = Math.min(this.y, e.y), a = Math.max(this.y + this.height, e.y + e.height);
      return this.x = t, this.width = i - t, this.y = n, this.height = a - n, this;
    }, r.prototype.toString = function() {
      return "[@pixi/math:Rectangle x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + "]";
    }, r;
  }()
), ay = (
  /** @class */
  function() {
    function r(e, t, i) {
      e === void 0 && (e = 0), t === void 0 && (t = 0), i === void 0 && (i = 0), this.x = e, this.y = t, this.radius = i, this.type = Dt.CIRC;
    }
    return r.prototype.clone = function() {
      return new r(this.x, this.y, this.radius);
    }, r.prototype.contains = function(e, t) {
      if (this.radius <= 0)
        return !1;
      var i = this.radius * this.radius, n = this.x - e, a = this.y - t;
      return n *= n, a *= a, n + a <= i;
    }, r.prototype.getBounds = function() {
      return new it(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }, r.prototype.toString = function() {
      return "[@pixi/math:Circle x=" + this.x + " y=" + this.y + " radius=" + this.radius + "]";
    }, r;
  }()
), oy = (
  /** @class */
  function() {
    function r(e, t, i, n) {
      e === void 0 && (e = 0), t === void 0 && (t = 0), i === void 0 && (i = 0), n === void 0 && (n = 0), this.x = e, this.y = t, this.width = i, this.height = n, this.type = Dt.ELIP;
    }
    return r.prototype.clone = function() {
      return new r(this.x, this.y, this.width, this.height);
    }, r.prototype.contains = function(e, t) {
      if (this.width <= 0 || this.height <= 0)
        return !1;
      var i = (e - this.x) / this.width, n = (t - this.y) / this.height;
      return i *= i, n *= n, i + n <= 1;
    }, r.prototype.getBounds = function() {
      return new it(this.x - this.width, this.y - this.height, this.width, this.height);
    }, r.prototype.toString = function() {
      return "[@pixi/math:Ellipse x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + "]";
    }, r;
  }()
), Wi = (
  /** @class */
  function() {
    function r() {
      for (var e = arguments, t = [], i = 0; i < arguments.length; i++)
        t[i] = e[i];
      var n = Array.isArray(t[0]) ? t[0] : t;
      if (typeof n[0] != "number") {
        for (var a = [], o = 0, s = n.length; o < s; o++)
          a.push(n[o].x, n[o].y);
        n = a;
      }
      this.points = n, this.type = Dt.POLY, this.closeStroke = !0;
    }
    return r.prototype.clone = function() {
      var e = this.points.slice(), t = new r(e);
      return t.closeStroke = this.closeStroke, t;
    }, r.prototype.contains = function(e, t) {
      for (var i = !1, n = this.points.length / 2, a = 0, o = n - 1; a < n; o = a++) {
        var s = this.points[a * 2], u = this.points[a * 2 + 1], h = this.points[o * 2], l = this.points[o * 2 + 1], f = u > t != l > t && e < (h - s) * ((t - u) / (l - u)) + s;
        f && (i = !i);
      }
      return i;
    }, r.prototype.toString = function() {
      return "[@pixi/math:Polygon" + ("closeStroke=" + this.closeStroke) + ("points=" + this.points.reduce(function(e, t) {
        return e + ", " + t;
      }, "") + "]");
    }, r;
  }()
), sy = (
  /** @class */
  function() {
    function r(e, t, i, n, a) {
      e === void 0 && (e = 0), t === void 0 && (t = 0), i === void 0 && (i = 0), n === void 0 && (n = 0), a === void 0 && (a = 20), this.x = e, this.y = t, this.width = i, this.height = n, this.radius = a, this.type = Dt.RREC;
    }
    return r.prototype.clone = function() {
      return new r(this.x, this.y, this.width, this.height, this.radius);
    }, r.prototype.contains = function(e, t) {
      if (this.width <= 0 || this.height <= 0)
        return !1;
      if (e >= this.x && e <= this.x + this.width && t >= this.y && t <= this.y + this.height) {
        var i = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
        if (t >= this.y + i && t <= this.y + this.height - i || e >= this.x + i && e <= this.x + this.width - i)
          return !0;
        var n = e - (this.x + i), a = t - (this.y + i), o = i * i;
        if (n * n + a * a <= o || (n = e - (this.x + this.width - i), n * n + a * a <= o) || (a = t - (this.y + this.height - i), n * n + a * a <= o) || (n = e - (this.x + i), n * n + a * a <= o))
          return !0;
      }
      return !1;
    }, r.prototype.toString = function() {
      return "[@pixi/math:RoundedRectangle x=" + this.x + " y=" + this.y + ("width=" + this.width + " height=" + this.height + " radius=" + this.radius + "]");
    }, r;
  }()
), br = (
  /** @class */
  function() {
    function r(e, t, i, n) {
      i === void 0 && (i = 0), n === void 0 && (n = 0), this._x = i, this._y = n, this.cb = e, this.scope = t;
    }
    return r.prototype.clone = function(e, t) {
      return e === void 0 && (e = this.cb), t === void 0 && (t = this.scope), new r(e, t, this._x, this._y);
    }, r.prototype.set = function(e, t) {
      return e === void 0 && (e = 0), t === void 0 && (t = e), (this._x !== e || this._y !== t) && (this._x = e, this._y = t, this.cb.call(this.scope)), this;
    }, r.prototype.copyFrom = function(e) {
      return (this._x !== e.x || this._y !== e.y) && (this._x = e.x, this._y = e.y, this.cb.call(this.scope)), this;
    }, r.prototype.copyTo = function(e) {
      return e.set(this._x, this._y), e;
    }, r.prototype.equals = function(e) {
      return e.x === this._x && e.y === this._y;
    }, r.prototype.toString = function() {
      return "[@pixi/math:ObservablePoint x=0 y=0 scope=" + this.scope + "]";
    }, Object.defineProperty(r.prototype, "x", {
      /** Position of the observable point on the x axis. */
      get: function() {
        return this._x;
      },
      set: function(e) {
        this._x !== e && (this._x = e, this.cb.call(this.scope));
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "y", {
      /** Position of the observable point on the y axis. */
      get: function() {
        return this._y;
      },
      set: function(e) {
        this._y !== e && (this._y = e, this.cb.call(this.scope));
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
), It = (
  /** @class */
  function() {
    function r(e, t, i, n, a, o) {
      e === void 0 && (e = 1), t === void 0 && (t = 0), i === void 0 && (i = 0), n === void 0 && (n = 1), a === void 0 && (a = 0), o === void 0 && (o = 0), this.array = null, this.a = e, this.b = t, this.c = i, this.d = n, this.tx = a, this.ty = o;
    }
    return r.prototype.fromArray = function(e) {
      this.a = e[0], this.b = e[1], this.c = e[3], this.d = e[4], this.tx = e[2], this.ty = e[5];
    }, r.prototype.set = function(e, t, i, n, a, o) {
      return this.a = e, this.b = t, this.c = i, this.d = n, this.tx = a, this.ty = o, this;
    }, r.prototype.toArray = function(e, t) {
      this.array || (this.array = new Float32Array(9));
      var i = t || this.array;
      return e ? (i[0] = this.a, i[1] = this.b, i[2] = 0, i[3] = this.c, i[4] = this.d, i[5] = 0, i[6] = this.tx, i[7] = this.ty, i[8] = 1) : (i[0] = this.a, i[1] = this.c, i[2] = this.tx, i[3] = this.b, i[4] = this.d, i[5] = this.ty, i[6] = 0, i[7] = 0, i[8] = 1), i;
    }, r.prototype.apply = function(e, t) {
      t = t || new yt();
      var i = e.x, n = e.y;
      return t.x = this.a * i + this.c * n + this.tx, t.y = this.b * i + this.d * n + this.ty, t;
    }, r.prototype.applyInverse = function(e, t) {
      t = t || new yt();
      var i = 1 / (this.a * this.d + this.c * -this.b), n = e.x, a = e.y;
      return t.x = this.d * i * n + -this.c * i * a + (this.ty * this.c - this.tx * this.d) * i, t.y = this.a * i * a + -this.b * i * n + (-this.ty * this.a + this.tx * this.b) * i, t;
    }, r.prototype.translate = function(e, t) {
      return this.tx += e, this.ty += t, this;
    }, r.prototype.scale = function(e, t) {
      return this.a *= e, this.d *= t, this.c *= e, this.b *= t, this.tx *= e, this.ty *= t, this;
    }, r.prototype.rotate = function(e) {
      var t = Math.cos(e), i = Math.sin(e), n = this.a, a = this.c, o = this.tx;
      return this.a = n * t - this.b * i, this.b = n * i + this.b * t, this.c = a * t - this.d * i, this.d = a * i + this.d * t, this.tx = o * t - this.ty * i, this.ty = o * i + this.ty * t, this;
    }, r.prototype.append = function(e) {
      var t = this.a, i = this.b, n = this.c, a = this.d;
      return this.a = e.a * t + e.b * n, this.b = e.a * i + e.b * a, this.c = e.c * t + e.d * n, this.d = e.c * i + e.d * a, this.tx = e.tx * t + e.ty * n + this.tx, this.ty = e.tx * i + e.ty * a + this.ty, this;
    }, r.prototype.setTransform = function(e, t, i, n, a, o, s, u, h) {
      return this.a = Math.cos(s + h) * a, this.b = Math.sin(s + h) * a, this.c = -Math.sin(s - u) * o, this.d = Math.cos(s - u) * o, this.tx = e - (i * this.a + n * this.c), this.ty = t - (i * this.b + n * this.d), this;
    }, r.prototype.prepend = function(e) {
      var t = this.tx;
      if (e.a !== 1 || e.b !== 0 || e.c !== 0 || e.d !== 1) {
        var i = this.a, n = this.c;
        this.a = i * e.a + this.b * e.c, this.b = i * e.b + this.b * e.d, this.c = n * e.a + this.d * e.c, this.d = n * e.b + this.d * e.d;
      }
      return this.tx = t * e.a + this.ty * e.c + e.tx, this.ty = t * e.b + this.ty * e.d + e.ty, this;
    }, r.prototype.decompose = function(e) {
      var t = this.a, i = this.b, n = this.c, a = this.d, o = e.pivot, s = -Math.atan2(-n, a), u = Math.atan2(i, t), h = Math.abs(s + u);
      return h < 1e-5 || Math.abs(un - h) < 1e-5 ? (e.rotation = u, e.skew.x = e.skew.y = 0) : (e.rotation = 0, e.skew.x = s, e.skew.y = u), e.scale.x = Math.sqrt(t * t + i * i), e.scale.y = Math.sqrt(n * n + a * a), e.position.x = this.tx + (o.x * t + o.y * n), e.position.y = this.ty + (o.x * i + o.y * a), e;
    }, r.prototype.invert = function() {
      var e = this.a, t = this.b, i = this.c, n = this.d, a = this.tx, o = e * n - t * i;
      return this.a = n / o, this.b = -t / o, this.c = -i / o, this.d = e / o, this.tx = (i * this.ty - n * a) / o, this.ty = -(e * this.ty - t * a) / o, this;
    }, r.prototype.identity = function() {
      return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this;
    }, r.prototype.clone = function() {
      var e = new r();
      return e.a = this.a, e.b = this.b, e.c = this.c, e.d = this.d, e.tx = this.tx, e.ty = this.ty, e;
    }, r.prototype.copyTo = function(e) {
      return e.a = this.a, e.b = this.b, e.c = this.c, e.d = this.d, e.tx = this.tx, e.ty = this.ty, e;
    }, r.prototype.copyFrom = function(e) {
      return this.a = e.a, this.b = e.b, this.c = e.c, this.d = e.d, this.tx = e.tx, this.ty = e.ty, this;
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
), je = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1], Ve = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1], ze = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1], We = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1], Ia = [], wh = [], Ei = Math.sign;
function uy() {
  for (var r = 0; r < 16; r++) {
    var e = [];
    Ia.push(e);
    for (var t = 0; t < 16; t++)
      for (var i = Ei(je[r] * je[t] + ze[r] * Ve[t]), n = Ei(Ve[r] * je[t] + We[r] * Ve[t]), a = Ei(je[r] * ze[t] + ze[r] * We[t]), o = Ei(Ve[r] * ze[t] + We[r] * We[t]), s = 0; s < 16; s++)
        if (je[s] === i && Ve[s] === n && ze[s] === a && We[s] === o) {
          e.push(s);
          break;
        }
  }
  for (var r = 0; r < 16; r++) {
    var u = new It();
    u.set(je[r], Ve[r], ze[r], We[r], 0, 0), wh.push(u);
  }
}
uy();
var bt = {
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
    return je[r];
  },
  /**
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
   * @returns {PIXI.GD8Symmetry} The Y-component of the U-axis
   *    after rotating the axes.
   */
  uY: function(r) {
    return Ve[r];
  },
  /**
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
   * @returns {PIXI.GD8Symmetry} The X-component of the V-axis
   *    after rotating the axes.
   */
  vX: function(r) {
    return ze[r];
  },
  /**
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
   * @returns {PIXI.GD8Symmetry} The Y-component of the V-axis
   *    after rotating the axes.
   */
  vY: function(r) {
    return We[r];
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
  add: function(r, e) {
    return Ia[r][e];
  },
  /**
   * Reverse of `add`.
   * @memberof PIXI.groupD8
   * @param {PIXI.GD8Symmetry} rotationSecond - Second operation
   * @param {PIXI.GD8Symmetry} rotationFirst - First operation
   * @returns {PIXI.GD8Symmetry} Result
   */
  sub: function(r, e) {
    return Ia[r][bt.inv(e)];
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
  byDirection: function(r, e) {
    return Math.abs(r) * 2 <= Math.abs(e) ? e >= 0 ? bt.S : bt.N : Math.abs(e) * 2 <= Math.abs(r) ? r > 0 ? bt.E : bt.W : e > 0 ? r > 0 ? bt.SE : bt.SW : r > 0 ? bt.NE : bt.NW;
  },
  /**
   * Helps sprite to compensate texture packer rotation.
   * @memberof PIXI.groupD8
   * @param {PIXI.Matrix} matrix - sprite world matrix
   * @param {PIXI.GD8Symmetry} rotation - The rotation factor to use.
   * @param {number} tx - sprite anchoring
   * @param {number} ty - sprite anchoring
   */
  matrixAppendRotationInv: function(r, e, t, i) {
    t === void 0 && (t = 0), i === void 0 && (i = 0);
    var n = wh[bt.inv(e)];
    n.tx = t, n.ty = i, r.append(n);
  }
}, Sh = (
  /** @class */
  function() {
    function r() {
      this.worldTransform = new It(), this.localTransform = new It(), this.position = new br(this.onChange, this, 0, 0), this.scale = new br(this.onChange, this, 1, 1), this.pivot = new br(this.onChange, this, 0, 0), this.skew = new br(this.updateSkew, this, 0, 0), this._rotation = 0, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._localID = 0, this._currentLocalID = 0, this._worldID = 0, this._parentID = 0;
    }
    return r.prototype.onChange = function() {
      this._localID++;
    }, r.prototype.updateSkew = function() {
      this._cx = Math.cos(this._rotation + this.skew.y), this._sx = Math.sin(this._rotation + this.skew.y), this._cy = -Math.sin(this._rotation - this.skew.x), this._sy = Math.cos(this._rotation - this.skew.x), this._localID++;
    }, r.prototype.toString = function() {
      return "[@pixi/math:Transform " + ("position=(" + this.position.x + ", " + this.position.y + ") ") + ("rotation=" + this.rotation + " ") + ("scale=(" + this.scale.x + ", " + this.scale.y + ") ") + ("skew=(" + this.skew.x + ", " + this.skew.y + ") ") + "]";
    }, r.prototype.updateLocalTransform = function() {
      var e = this.localTransform;
      this._localID !== this._currentLocalID && (e.a = this._cx * this.scale.x, e.b = this._sx * this.scale.x, e.c = this._cy * this.scale.y, e.d = this._sy * this.scale.y, e.tx = this.position.x - (this.pivot.x * e.a + this.pivot.y * e.c), e.ty = this.position.y - (this.pivot.x * e.b + this.pivot.y * e.d), this._currentLocalID = this._localID, this._parentID = -1);
    }, r.prototype.updateTransform = function(e) {
      var t = this.localTransform;
      if (this._localID !== this._currentLocalID && (t.a = this._cx * this.scale.x, t.b = this._sx * this.scale.x, t.c = this._cy * this.scale.y, t.d = this._sy * this.scale.y, t.tx = this.position.x - (this.pivot.x * t.a + this.pivot.y * t.c), t.ty = this.position.y - (this.pivot.x * t.b + this.pivot.y * t.d), this._currentLocalID = this._localID, this._parentID = -1), this._parentID !== e._worldID) {
        var i = e.worldTransform, n = this.worldTransform;
        n.a = t.a * i.a + t.b * i.c, n.b = t.a * i.b + t.b * i.d, n.c = t.c * i.a + t.d * i.c, n.d = t.c * i.b + t.d * i.d, n.tx = t.tx * i.a + t.ty * i.c + i.tx, n.ty = t.tx * i.b + t.ty * i.d + i.ty, this._parentID = e._worldID, this._worldID++;
      }
    }, r.prototype.setFromMatrix = function(e) {
      e.decompose(this), this._localID++;
    }, Object.defineProperty(r.prototype, "rotation", {
      /** The rotation of the object in radians. */
      get: function() {
        return this._rotation;
      },
      set: function(e) {
        this._rotation !== e && (this._rotation = e, this.updateSkew());
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
U.SORTABLE_CHILDREN = !1;
var hn = (
  /** @class */
  function() {
    function r() {
      this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.rect = null, this.updateID = -1;
    }
    return r.prototype.isEmpty = function() {
      return this.minX > this.maxX || this.minY > this.maxY;
    }, r.prototype.clear = function() {
      this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0;
    }, r.prototype.getRectangle = function(e) {
      return this.minX > this.maxX || this.minY > this.maxY ? it.EMPTY : (e = e || new it(0, 0, 1, 1), e.x = this.minX, e.y = this.minY, e.width = this.maxX - this.minX, e.height = this.maxY - this.minY, e);
    }, r.prototype.addPoint = function(e) {
      this.minX = Math.min(this.minX, e.x), this.maxX = Math.max(this.maxX, e.x), this.minY = Math.min(this.minY, e.y), this.maxY = Math.max(this.maxY, e.y);
    }, r.prototype.addPointMatrix = function(e, t) {
      var i = e.a, n = e.b, a = e.c, o = e.d, s = e.tx, u = e.ty, h = i * t.x + a * t.y + s, l = n * t.x + o * t.y + u;
      this.minX = Math.min(this.minX, h), this.maxX = Math.max(this.maxX, h), this.minY = Math.min(this.minY, l), this.maxY = Math.max(this.maxY, l);
    }, r.prototype.addQuad = function(e) {
      var t = this.minX, i = this.minY, n = this.maxX, a = this.maxY, o = e[0], s = e[1];
      t = o < t ? o : t, i = s < i ? s : i, n = o > n ? o : n, a = s > a ? s : a, o = e[2], s = e[3], t = o < t ? o : t, i = s < i ? s : i, n = o > n ? o : n, a = s > a ? s : a, o = e[4], s = e[5], t = o < t ? o : t, i = s < i ? s : i, n = o > n ? o : n, a = s > a ? s : a, o = e[6], s = e[7], t = o < t ? o : t, i = s < i ? s : i, n = o > n ? o : n, a = s > a ? s : a, this.minX = t, this.minY = i, this.maxX = n, this.maxY = a;
    }, r.prototype.addFrame = function(e, t, i, n, a) {
      this.addFrameMatrix(e.worldTransform, t, i, n, a);
    }, r.prototype.addFrameMatrix = function(e, t, i, n, a) {
      var o = e.a, s = e.b, u = e.c, h = e.d, l = e.tx, f = e.ty, c = this.minX, d = this.minY, p = this.maxX, v = this.maxY, _ = o * t + u * i + l, y = s * t + h * i + f;
      c = _ < c ? _ : c, d = y < d ? y : d, p = _ > p ? _ : p, v = y > v ? y : v, _ = o * n + u * i + l, y = s * n + h * i + f, c = _ < c ? _ : c, d = y < d ? y : d, p = _ > p ? _ : p, v = y > v ? y : v, _ = o * t + u * a + l, y = s * t + h * a + f, c = _ < c ? _ : c, d = y < d ? y : d, p = _ > p ? _ : p, v = y > v ? y : v, _ = o * n + u * a + l, y = s * n + h * a + f, c = _ < c ? _ : c, d = y < d ? y : d, p = _ > p ? _ : p, v = y > v ? y : v, this.minX = c, this.minY = d, this.maxX = p, this.maxY = v;
    }, r.prototype.addVertexData = function(e, t, i) {
      for (var n = this.minX, a = this.minY, o = this.maxX, s = this.maxY, u = t; u < i; u += 2) {
        var h = e[u], l = e[u + 1];
        n = h < n ? h : n, a = l < a ? l : a, o = h > o ? h : o, s = l > s ? l : s;
      }
      this.minX = n, this.minY = a, this.maxX = o, this.maxY = s;
    }, r.prototype.addVertices = function(e, t, i, n) {
      this.addVerticesMatrix(e.worldTransform, t, i, n);
    }, r.prototype.addVerticesMatrix = function(e, t, i, n, a, o) {
      a === void 0 && (a = 0), o === void 0 && (o = a);
      for (var s = e.a, u = e.b, h = e.c, l = e.d, f = e.tx, c = e.ty, d = this.minX, p = this.minY, v = this.maxX, _ = this.maxY, y = i; y < n; y += 2) {
        var g = t[y], m = t[y + 1], E = s * g + h * m + f, b = l * m + u * g + c;
        d = Math.min(d, E - a), v = Math.max(v, E + a), p = Math.min(p, b - o), _ = Math.max(_, b + o);
      }
      this.minX = d, this.minY = p, this.maxX = v, this.maxY = _;
    }, r.prototype.addBounds = function(e) {
      var t = this.minX, i = this.minY, n = this.maxX, a = this.maxY;
      this.minX = e.minX < t ? e.minX : t, this.minY = e.minY < i ? e.minY : i, this.maxX = e.maxX > n ? e.maxX : n, this.maxY = e.maxY > a ? e.maxY : a;
    }, r.prototype.addBoundsMask = function(e, t) {
      var i = e.minX > t.minX ? e.minX : t.minX, n = e.minY > t.minY ? e.minY : t.minY, a = e.maxX < t.maxX ? e.maxX : t.maxX, o = e.maxY < t.maxY ? e.maxY : t.maxY;
      if (i <= a && n <= o) {
        var s = this.minX, u = this.minY, h = this.maxX, l = this.maxY;
        this.minX = i < s ? i : s, this.minY = n < u ? n : u, this.maxX = a > h ? a : h, this.maxY = o > l ? o : l;
      }
    }, r.prototype.addBoundsMatrix = function(e, t) {
      this.addFrameMatrix(t, e.minX, e.minY, e.maxX, e.maxY);
    }, r.prototype.addBoundsArea = function(e, t) {
      var i = e.minX > t.x ? e.minX : t.x, n = e.minY > t.y ? e.minY : t.y, a = e.maxX < t.x + t.width ? e.maxX : t.x + t.width, o = e.maxY < t.y + t.height ? e.maxY : t.y + t.height;
      if (i <= a && n <= o) {
        var s = this.minX, u = this.minY, h = this.maxX, l = this.maxY;
        this.minX = i < s ? i : s, this.minY = n < u ? n : u, this.maxX = a > h ? a : h, this.maxY = o > l ? o : l;
      }
    }, r.prototype.pad = function(e, t) {
      e === void 0 && (e = 0), t === void 0 && (t = e), this.isEmpty() || (this.minX -= e, this.maxX += e, this.minY -= t, this.maxY += t);
    }, r.prototype.addFramePad = function(e, t, i, n, a, o) {
      e -= a, t -= o, i += a, n += o, this.minX = this.minX < e ? this.minX : e, this.maxX = this.maxX > i ? this.maxX : i, this.minY = this.minY < t ? this.minY : t, this.maxY = this.maxY > n ? this.maxY : n;
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
var Ca = function(r, e) {
  return Ca = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Ca(r, e);
};
function So(r, e) {
  Ca(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var At = (
  /** @class */
  function(r) {
    So(e, r);
    function e() {
      var t = r.call(this) || this;
      return t.tempDisplayObjectParent = null, t.transform = new Sh(), t.alpha = 1, t.visible = !0, t.renderable = !0, t.cullable = !1, t.cullArea = null, t.parent = null, t.worldAlpha = 1, t._lastSortedIndex = 0, t._zIndex = 0, t.filterArea = null, t.filters = null, t._enabledFilters = null, t._bounds = new hn(), t._localBounds = null, t._boundsID = 0, t._boundsRect = null, t._localBoundsRect = null, t._mask = null, t._maskRefCount = 0, t._destroyed = !1, t.isSprite = !1, t.isMask = !1, t;
    }
    return e.mixin = function(t) {
      for (var i = Object.keys(t), n = 0; n < i.length; ++n) {
        var a = i[n];
        Object.defineProperty(e.prototype, a, Object.getOwnPropertyDescriptor(t, a));
      }
    }, Object.defineProperty(e.prototype, "destroyed", {
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
    }), e.prototype._recursivePostUpdateTransform = function() {
      this.parent ? (this.parent._recursivePostUpdateTransform(), this.transform.updateTransform(this.parent.transform)) : this.transform.updateTransform(this._tempDisplayObjectParent.transform);
    }, e.prototype.updateTransform = function() {
      this._boundsID++, this.transform.updateTransform(this.parent.transform), this.worldAlpha = this.alpha * this.parent.worldAlpha;
    }, e.prototype.getBounds = function(t, i) {
      return t || (this.parent ? (this._recursivePostUpdateTransform(), this.updateTransform()) : (this.parent = this._tempDisplayObjectParent, this.updateTransform(), this.parent = null)), this._bounds.updateID !== this._boundsID && (this.calculateBounds(), this._bounds.updateID = this._boundsID), i || (this._boundsRect || (this._boundsRect = new it()), i = this._boundsRect), this._bounds.getRectangle(i);
    }, e.prototype.getLocalBounds = function(t) {
      t || (this._localBoundsRect || (this._localBoundsRect = new it()), t = this._localBoundsRect), this._localBounds || (this._localBounds = new hn());
      var i = this.transform, n = this.parent;
      this.parent = null, this.transform = this._tempDisplayObjectParent.transform;
      var a = this._bounds, o = this._boundsID;
      this._bounds = this._localBounds;
      var s = this.getBounds(!1, t);
      return this.parent = n, this.transform = i, this._bounds = a, this._bounds.updateID += this._boundsID - o, s;
    }, e.prototype.toGlobal = function(t, i, n) {
      return n === void 0 && (n = !1), n || (this._recursivePostUpdateTransform(), this.parent ? this.displayObjectUpdateTransform() : (this.parent = this._tempDisplayObjectParent, this.displayObjectUpdateTransform(), this.parent = null)), this.worldTransform.apply(t, i);
    }, e.prototype.toLocal = function(t, i, n, a) {
      return i && (t = i.toGlobal(t, n, a)), a || (this._recursivePostUpdateTransform(), this.parent ? this.displayObjectUpdateTransform() : (this.parent = this._tempDisplayObjectParent, this.displayObjectUpdateTransform(), this.parent = null)), this.worldTransform.applyInverse(t, n);
    }, e.prototype.setParent = function(t) {
      if (!t || !t.addChild)
        throw new Error("setParent: Argument must be a Container");
      return t.addChild(this), t;
    }, e.prototype.setTransform = function(t, i, n, a, o, s, u, h, l) {
      return t === void 0 && (t = 0), i === void 0 && (i = 0), n === void 0 && (n = 1), a === void 0 && (a = 1), o === void 0 && (o = 0), s === void 0 && (s = 0), u === void 0 && (u = 0), h === void 0 && (h = 0), l === void 0 && (l = 0), this.position.x = t, this.position.y = i, this.scale.x = n || 1, this.scale.y = a || 1, this.rotation = o, this.skew.x = s, this.skew.y = u, this.pivot.x = h, this.pivot.y = l, this;
    }, e.prototype.destroy = function(t) {
      this.parent && this.parent.removeChild(this), this._destroyed = !0, this.transform = null, this.parent = null, this._bounds = null, this.mask = null, this.cullArea = null, this.filters = null, this.filterArea = null, this.hitArea = null, this.interactive = !1, this.interactiveChildren = !1, this.emit("destroyed"), this.removeAllListeners();
    }, Object.defineProperty(e.prototype, "_tempDisplayObjectParent", {
      /**
       * @protected
       * @member {PIXI.Container}
       */
      get: function() {
        return this.tempDisplayObjectParent === null && (this.tempDisplayObjectParent = new Ph()), this.tempDisplayObjectParent;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.enableTempParent = function() {
      var t = this.parent;
      return this.parent = this._tempDisplayObjectParent, t;
    }, e.prototype.disableTempParent = function(t) {
      this.parent = t;
    }, Object.defineProperty(e.prototype, "x", {
      /**
       * The position of the displayObject on the x axis relative to the local coordinates of the parent.
       * An alias to position.x
       */
      get: function() {
        return this.position.x;
      },
      set: function(t) {
        this.transform.position.x = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "y", {
      /**
       * The position of the displayObject on the y axis relative to the local coordinates of the parent.
       * An alias to position.y
       */
      get: function() {
        return this.position.y;
      },
      set: function(t) {
        this.transform.position.y = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "worldTransform", {
      /**
       * Current transform of the object based on world (parent) factors.
       * @readonly
       */
      get: function() {
        return this.transform.worldTransform;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "localTransform", {
      /**
       * Current transform of the object based on local factors: position, scale, other stuff.
       * @readonly
       */
      get: function() {
        return this.transform.localTransform;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "position", {
      /**
       * The coordinate of the object relative to the local coordinates of the parent.
       * @since 4.0.0
       */
      get: function() {
        return this.transform.position;
      },
      set: function(t) {
        this.transform.position.copyFrom(t);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "scale", {
      /**
       * The scale factors of this object along the local coordinate axes.
       *
       * The default scale is (1, 1).
       * @since 4.0.0
       */
      get: function() {
        return this.transform.scale;
      },
      set: function(t) {
        this.transform.scale.copyFrom(t);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "pivot", {
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
      set: function(t) {
        this.transform.pivot.copyFrom(t);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "skew", {
      /**
       * The skew factor for the object in radians.
       * @since 4.0.0
       */
      get: function() {
        return this.transform.skew;
      },
      set: function(t) {
        this.transform.skew.copyFrom(t);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "rotation", {
      /**
       * The rotation of the object in radians.
       * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
       */
      get: function() {
        return this.transform.rotation;
      },
      set: function(t) {
        this.transform.rotation = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "angle", {
      /**
       * The angle of the object in degrees.
       * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
       */
      get: function() {
        return this.transform.rotation * iy;
      },
      set: function(t) {
        this.transform.rotation = t * ny;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "zIndex", {
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
      set: function(t) {
        this._zIndex = t, this.parent && (this.parent.sortDirty = !0);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "worldVisible", {
      /**
       * Indicates if the object is globally visible.
       * @readonly
       */
      get: function() {
        var t = this;
        do {
          if (!t.visible)
            return !1;
          t = t.parent;
        } while (t);
        return !0;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "mask", {
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
      set: function(t) {
        if (this._mask !== t) {
          if (this._mask) {
            var i = this._mask.isMaskData ? this._mask.maskObject : this._mask;
            i && (i._maskRefCount--, i._maskRefCount === 0 && (i.renderable = !0, i.isMask = !1));
          }
          if (this._mask = t, this._mask) {
            var i = this._mask.isMaskData ? this._mask.maskObject : this._mask;
            i && (i._maskRefCount === 0 && (i.renderable = !1, i.isMask = !0), i._maskRefCount++);
          }
        }
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(ai)
), Ph = (
  /** @class */
  function(r) {
    So(e, r);
    function e() {
      var t = r !== null && r.apply(this, arguments) || this;
      return t.sortDirty = null, t;
    }
    return e;
  }(At)
);
At.prototype.displayObjectUpdateTransform = At.prototype.updateTransform;
function hy(r, e) {
  return r.zIndex === e.zIndex ? r._lastSortedIndex - e._lastSortedIndex : r.zIndex - e.zIndex;
}
var fe = (
  /** @class */
  function(r) {
    So(e, r);
    function e() {
      var t = r.call(this) || this;
      return t.children = [], t.sortableChildren = U.SORTABLE_CHILDREN, t.sortDirty = !1, t;
    }
    return e.prototype.onChildrenChange = function(t) {
    }, e.prototype.addChild = function() {
      for (var t = arguments, i = [], n = 0; n < arguments.length; n++)
        i[n] = t[n];
      if (i.length > 1)
        for (var a = 0; a < i.length; a++)
          this.addChild(i[a]);
      else {
        var o = i[0];
        o.parent && o.parent.removeChild(o), o.parent = this, this.sortDirty = !0, o.transform._parentID = -1, this.children.push(o), this._boundsID++, this.onChildrenChange(this.children.length - 1), this.emit("childAdded", o, this, this.children.length - 1), o.emit("added", this);
      }
      return i[0];
    }, e.prototype.addChildAt = function(t, i) {
      if (i < 0 || i > this.children.length)
        throw new Error(t + "addChildAt: The index " + i + " supplied is out of bounds " + this.children.length);
      return t.parent && t.parent.removeChild(t), t.parent = this, this.sortDirty = !0, t.transform._parentID = -1, this.children.splice(i, 0, t), this._boundsID++, this.onChildrenChange(i), t.emit("added", this), this.emit("childAdded", t, this, i), t;
    }, e.prototype.swapChildren = function(t, i) {
      if (t !== i) {
        var n = this.getChildIndex(t), a = this.getChildIndex(i);
        this.children[n] = i, this.children[a] = t, this.onChildrenChange(n < a ? n : a);
      }
    }, e.prototype.getChildIndex = function(t) {
      var i = this.children.indexOf(t);
      if (i === -1)
        throw new Error("The supplied DisplayObject must be a child of the caller");
      return i;
    }, e.prototype.setChildIndex = function(t, i) {
      if (i < 0 || i >= this.children.length)
        throw new Error("The index " + i + " supplied is out of bounds " + this.children.length);
      var n = this.getChildIndex(t);
      wr(this.children, n, 1), this.children.splice(i, 0, t), this.onChildrenChange(i);
    }, e.prototype.getChildAt = function(t) {
      if (t < 0 || t >= this.children.length)
        throw new Error("getChildAt: Index (" + t + ") does not exist.");
      return this.children[t];
    }, e.prototype.removeChild = function() {
      for (var t = arguments, i = [], n = 0; n < arguments.length; n++)
        i[n] = t[n];
      if (i.length > 1)
        for (var a = 0; a < i.length; a++)
          this.removeChild(i[a]);
      else {
        var o = i[0], s = this.children.indexOf(o);
        if (s === -1)
          return null;
        o.parent = null, o.transform._parentID = -1, wr(this.children, s, 1), this._boundsID++, this.onChildrenChange(s), o.emit("removed", this), this.emit("childRemoved", o, this, s);
      }
      return i[0];
    }, e.prototype.removeChildAt = function(t) {
      var i = this.getChildAt(t);
      return i.parent = null, i.transform._parentID = -1, wr(this.children, t, 1), this._boundsID++, this.onChildrenChange(t), i.emit("removed", this), this.emit("childRemoved", i, this, t), i;
    }, e.prototype.removeChildren = function(t, i) {
      t === void 0 && (t = 0), i === void 0 && (i = this.children.length);
      var n = t, a = i, o = a - n, s;
      if (o > 0 && o <= a) {
        s = this.children.splice(n, o);
        for (var u = 0; u < s.length; ++u)
          s[u].parent = null, s[u].transform && (s[u].transform._parentID = -1);
        this._boundsID++, this.onChildrenChange(t);
        for (var u = 0; u < s.length; ++u)
          s[u].emit("removed", this), this.emit("childRemoved", s[u], this, u);
        return s;
      } else if (o === 0 && this.children.length === 0)
        return [];
      throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
    }, e.prototype.sortChildren = function() {
      for (var t = !1, i = 0, n = this.children.length; i < n; ++i) {
        var a = this.children[i];
        a._lastSortedIndex = i, !t && a.zIndex !== 0 && (t = !0);
      }
      t && this.children.length > 1 && this.children.sort(hy), this.sortDirty = !1;
    }, e.prototype.updateTransform = function() {
      this.sortableChildren && this.sortDirty && this.sortChildren(), this._boundsID++, this.transform.updateTransform(this.parent.transform), this.worldAlpha = this.alpha * this.parent.worldAlpha;
      for (var t = 0, i = this.children.length; t < i; ++t) {
        var n = this.children[t];
        n.visible && n.updateTransform();
      }
    }, e.prototype.calculateBounds = function() {
      this._bounds.clear(), this._calculateBounds();
      for (var t = 0; t < this.children.length; t++) {
        var i = this.children[t];
        if (!(!i.visible || !i.renderable))
          if (i.calculateBounds(), i._mask) {
            var n = i._mask.isMaskData ? i._mask.maskObject : i._mask;
            n ? (n.calculateBounds(), this._bounds.addBoundsMask(i._bounds, n._bounds)) : this._bounds.addBounds(i._bounds);
          } else
            i.filterArea ? this._bounds.addBoundsArea(i._bounds, i.filterArea) : this._bounds.addBounds(i._bounds);
      }
      this._bounds.updateID = this._boundsID;
    }, e.prototype.getLocalBounds = function(t, i) {
      i === void 0 && (i = !1);
      var n = r.prototype.getLocalBounds.call(this, t);
      if (!i)
        for (var a = 0, o = this.children.length; a < o; ++a) {
          var s = this.children[a];
          s.visible && s.updateTransform();
        }
      return n;
    }, e.prototype._calculateBounds = function() {
    }, e.prototype._renderWithCulling = function(t) {
      var i = t.renderTexture.sourceFrame;
      if (i.width > 0 && i.height > 0) {
        var n, a;
        if (this.cullArea ? (n = this.cullArea, a = this.worldTransform) : this._render !== e.prototype._render && (n = this.getBounds(!0)), n && i.intersects(n, a))
          this._render(t);
        else if (this.cullArea)
          return;
        for (var o = 0, s = this.children.length; o < s; ++o) {
          var u = this.children[o], h = u.cullable;
          u.cullable = h || !this.cullArea, u.render(t), u.cullable = h;
        }
      }
    }, e.prototype.render = function(t) {
      if (!(!this.visible || this.worldAlpha <= 0 || !this.renderable))
        if (this._mask || this.filters && this.filters.length)
          this.renderAdvanced(t);
        else if (this.cullable)
          this._renderWithCulling(t);
        else {
          this._render(t);
          for (var i = 0, n = this.children.length; i < n; ++i)
            this.children[i].render(t);
        }
    }, e.prototype.renderAdvanced = function(t) {
      var i = this.filters, n = this._mask;
      if (i) {
        this._enabledFilters || (this._enabledFilters = []), this._enabledFilters.length = 0;
        for (var a = 0; a < i.length; a++)
          i[a].enabled && this._enabledFilters.push(i[a]);
      }
      var o = i && this._enabledFilters && this._enabledFilters.length || n && (!n.isMaskData || n.enabled && (n.autoDetect || n.type !== Rt.NONE));
      if (o && t.batch.flush(), i && this._enabledFilters && this._enabledFilters.length && t.filter.push(this, this._enabledFilters), n && t.mask.push(this, this._mask), this.cullable)
        this._renderWithCulling(t);
      else {
        this._render(t);
        for (var a = 0, s = this.children.length; a < s; ++a)
          this.children[a].render(t);
      }
      o && t.batch.flush(), n && t.mask.pop(this), i && this._enabledFilters && this._enabledFilters.length && t.filter.pop();
    }, e.prototype._render = function(t) {
    }, e.prototype.destroy = function(t) {
      r.prototype.destroy.call(this), this.sortDirty = !1;
      var i = typeof t == "boolean" ? t : t && t.children, n = this.removeChildren(0, this.children.length);
      if (i)
        for (var a = 0; a < n.length; ++a)
          n[a].destroy(t);
    }, Object.defineProperty(e.prototype, "width", {
      /** The width of the Container, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return this.scale.x * this.getLocalBounds().width;
      },
      set: function(t) {
        var i = this.getLocalBounds().width;
        i !== 0 ? this.scale.x = t / i : this.scale.x = 1, this._width = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "height", {
      /** The height of the Container, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return this.scale.y * this.getLocalBounds().height;
      },
      set: function(t) {
        var i = this.getLocalBounds().height;
        i !== 0 ? this.scale.y = t / i : this.scale.y = 1, this._height = t;
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(At)
);
fe.prototype.containerUpdateTransform = fe.prototype.updateTransform;
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
var Yr = function() {
  return Yr = Object.assign || function(e) {
    for (var t = arguments, i, n = 1, a = arguments.length; n < a; n++) {
      i = t[n];
      for (var o in i)
        Object.prototype.hasOwnProperty.call(i, o) && (e[o] = i[o]);
    }
    return e;
  }, Yr.apply(this, arguments);
}, pt;
(function(r) {
  r.Application = "application", r.RendererPlugin = "renderer-webgl-plugin", r.CanvasRendererPlugin = "renderer-canvas-plugin", r.Loader = "loader", r.LoadParser = "load-parser", r.ResolveParser = "resolve-parser", r.CacheParser = "cache-parser", r.DetectionParser = "detection-parser";
})(pt || (pt = {}));
var Bs = function(r) {
  if (typeof r == "function" || typeof r == "object" && r.extension) {
    if (!r.extension)
      throw new Error("Extension class must have an extension object");
    var e = typeof r.extension != "object" ? { type: r.extension } : r.extension;
    r = Yr(Yr({}, e), { ref: r });
  }
  if (typeof r == "object")
    r = Yr({}, r);
  else
    throw new Error("Invalid extension type");
  return typeof r.type == "string" && (r.type = [r.type]), r;
}, xe = {
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
    for (var r = arguments, e = this, t = [], i = 0; i < arguments.length; i++)
      t[i] = r[i];
    return t.map(Bs).forEach(function(n) {
      n.type.forEach(function(a) {
        var o, s;
        return (s = (o = e._removeHandlers)[a]) === null || s === void 0 ? void 0 : s.call(o, n);
      });
    }), this;
  },
  /**
   * Register new extensions with PixiJS.
   * @param extensions - The spread of extensions to add to PixiJS.
   * @returns {PIXI.extensions} For chaining.
   */
  add: function() {
    for (var r = arguments, e = this, t = [], i = 0; i < arguments.length; i++)
      t[i] = r[i];
    return t.map(Bs).forEach(function(n) {
      n.type.forEach(function(a) {
        var o = e._addHandlers, s = e._queue;
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
  handle: function(r, e, t) {
    var i = this._addHandlers = this._addHandlers || {}, n = this._removeHandlers = this._removeHandlers || {};
    if (i[r] || n[r])
      throw new Error("Extension type " + r + " already has a handler");
    i[r] = e, n[r] = t;
    var a = this._queue;
    return a[r] && (a[r].forEach(function(o) {
      return e(o);
    }), delete a[r]), this;
  },
  /**
   * Handle a type, but using a map by `name` property.
   * @param type - Type of extension to handle.
   * @param map - The object map of named extensions.
   * @returns {PIXI.extensions} For chaining.
   */
  handleByMap: function(r, e) {
    return this.handle(r, function(t) {
      e[t.name] = t.ref;
    }, function(t) {
      delete e[t.name];
    });
  },
  /**
   * Handle a type, but using a list of extensions.
   * @param type - Type of extension to handle.
   * @param list - The list of extensions.
   * @returns {PIXI.extensions} For chaining.
   */
  handleByList: function(r, e) {
    return this.handle(r, function(t) {
      var i, n;
      e.includes(t.ref) || (e.push(t.ref), r === pt.Loader && ((n = (i = t.ref).add) === null || n === void 0 || n.call(i)));
    }, function(t) {
      var i = e.indexOf(t.ref);
      i !== -1 && e.splice(i, 1);
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
    function r(e) {
      this.items = [], this._name = e, this._aliasCount = 0;
    }
    return r.prototype.emit = function(e, t, i, n, a, o, s, u) {
      if (arguments.length > 8)
        throw new Error("max arguments reached");
      var h = this, l = h.name, f = h.items;
      this._aliasCount++;
      for (var c = 0, d = f.length; c < d; c++)
        f[c][l](e, t, i, n, a, o, s, u);
      return f === this.items && this._aliasCount--, this;
    }, r.prototype.ensureNonAliasedItems = function() {
      this._aliasCount > 0 && this.items.length > 1 && (this._aliasCount = 0, this.items = this.items.slice(0));
    }, r.prototype.add = function(e) {
      return e[this._name] && (this.ensureNonAliasedItems(), this.remove(e), this.items.push(e)), this;
    }, r.prototype.remove = function(e) {
      var t = this.items.indexOf(e);
      return t !== -1 && (this.ensureNonAliasedItems(), this.items.splice(t, 1)), this;
    }, r.prototype.contains = function(e) {
      return this.items.indexOf(e) !== -1;
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
U.TARGET_FPMS = 0.06;
var Ee;
(function(r) {
  r[r.INTERACTION = 50] = "INTERACTION", r[r.HIGH = 25] = "HIGH", r[r.NORMAL = 0] = "NORMAL", r[r.LOW = -25] = "LOW", r[r.UTILITY = -50] = "UTILITY";
})(Ee || (Ee = {}));
var Un = (
  /** @class */
  function() {
    function r(e, t, i, n) {
      t === void 0 && (t = null), i === void 0 && (i = 0), n === void 0 && (n = !1), this.next = null, this.previous = null, this._destroyed = !1, this.fn = e, this.context = t, this.priority = i, this.once = n;
    }
    return r.prototype.match = function(e, t) {
      return t === void 0 && (t = null), this.fn === e && this.context === t;
    }, r.prototype.emit = function(e) {
      this.fn && (this.context ? this.fn.call(this.context, e) : this.fn(e));
      var t = this.next;
      return this.once && this.destroy(!0), this._destroyed && (this.next = null), t;
    }, r.prototype.connect = function(e) {
      this.previous = e, e.next && (e.next.previous = this), this.next = e.next, e.next = this;
    }, r.prototype.destroy = function(e) {
      e === void 0 && (e = !1), this._destroyed = !0, this.fn = null, this.context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
      var t = this.next;
      return this.next = e ? null : t, this.previous = null, t;
    }, r;
  }()
), Lt = (
  /** @class */
  function() {
    function r() {
      var e = this;
      this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new Un(null, null, 1 / 0), this.deltaMS = 1 / U.TARGET_FPMS, this.elapsedMS = 1 / U.TARGET_FPMS, this._tick = function(t) {
        e._requestId = null, e.started && (e.update(t), e.started && e._requestId === null && e._head.next && (e._requestId = requestAnimationFrame(e._tick)));
      };
    }
    return r.prototype._requestIfNeeded = function() {
      this._requestId === null && this._head.next && (this.lastTime = performance.now(), this._lastFrame = this.lastTime, this._requestId = requestAnimationFrame(this._tick));
    }, r.prototype._cancelIfNeeded = function() {
      this._requestId !== null && (cancelAnimationFrame(this._requestId), this._requestId = null);
    }, r.prototype._startIfPossible = function() {
      this.started ? this._requestIfNeeded() : this.autoStart && this.start();
    }, r.prototype.add = function(e, t, i) {
      return i === void 0 && (i = Ee.NORMAL), this._addListener(new Un(e, t, i));
    }, r.prototype.addOnce = function(e, t, i) {
      return i === void 0 && (i = Ee.NORMAL), this._addListener(new Un(e, t, i, !0));
    }, r.prototype._addListener = function(e) {
      var t = this._head.next, i = this._head;
      if (!t)
        e.connect(i);
      else {
        for (; t; ) {
          if (e.priority > t.priority) {
            e.connect(i);
            break;
          }
          i = t, t = t.next;
        }
        e.previous || e.connect(i);
      }
      return this._startIfPossible(), this;
    }, r.prototype.remove = function(e, t) {
      for (var i = this._head.next; i; )
        i.match(e, t) ? i = i.destroy() : i = i.next;
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
        for (var e = 0, t = this._head; t = t.next; )
          e++;
        return e;
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
        for (var e = this._head.next; e; )
          e = e.destroy(!0);
        this._head.destroy(), this._head = null;
      }
    }, r.prototype.update = function(e) {
      e === void 0 && (e = performance.now());
      var t;
      if (e > this.lastTime) {
        if (t = this.elapsedMS = e - this.lastTime, t > this._maxElapsedMS && (t = this._maxElapsedMS), t *= this.speed, this._minElapsedMS) {
          var i = e - this._lastFrame | 0;
          if (i < this._minElapsedMS)
            return;
          this._lastFrame = e - i % this._minElapsedMS;
        }
        this.deltaMS = t, this.deltaTime = this.deltaMS * U.TARGET_FPMS;
        for (var n = this._head, a = n.next; a; )
          a = a.emit(this.deltaTime);
        n.next || this._cancelIfNeeded();
      } else
        this.deltaTime = this.deltaMS = this.elapsedMS = 0;
      this.lastTime = e;
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
      set: function(e) {
        var t = Math.min(this.maxFPS, e), i = Math.min(Math.max(0, t) / 1e3, U.TARGET_FPMS);
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
      set: function(e) {
        if (e === 0)
          this._minElapsedMS = 0;
        else {
          var t = Math.max(this.minFPS, e);
          this._minElapsedMS = 1 / (t / 1e3);
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
          var e = r._shared = new r();
          e.autoStart = !0, e._protected = !0;
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
          var e = r._system = new r();
          e.autoStart = !0, e._protected = !0;
        }
        return r._system;
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
), ly = (
  /** @class */
  function() {
    function r() {
    }
    return r.init = function(e) {
      var t = this;
      e = Object.assign({
        autoStart: !0,
        sharedTicker: !1
      }, e), Object.defineProperty(this, "ticker", {
        set: function(i) {
          this._ticker && this._ticker.remove(this.render, this), this._ticker = i, i && i.add(this.render, this, Ee.LOW);
        },
        get: function() {
          return this._ticker;
        }
      }), this.stop = function() {
        t._ticker.stop();
      }, this.start = function() {
        t._ticker.start();
      }, this._ticker = null, this.ticker = e.sharedTicker ? Lt.shared : new Lt(), e.autoStart && this.start();
    }, r.destroy = function() {
      if (this._ticker) {
        var e = this._ticker;
        this.ticker = null, e.destroy();
      }
    }, r.extension = pt.Application, r;
  }()
);
/*!
 * @pixi/core - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/core is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
U.PREFER_ENV = se.any ? be.WEBGL : be.WEBGL2;
U.STRICT_TEXTURE_CACHE = !1;
var Ma = [];
function Ah(r, e) {
  if (!r)
    return null;
  var t = "";
  if (typeof r == "string") {
    var i = /\.(\w{3,4})(?:$|\?|#)/i.exec(r);
    i && (t = i[1].toLowerCase());
  }
  for (var n = Ma.length - 1; n >= 0; --n) {
    var a = Ma[n];
    if (a.test && a.test(r, t))
      return new a(r, e);
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
var Da = function(r, e) {
  return Da = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Da(r, e);
};
function vt(r, e) {
  Da(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var Fa = function() {
  return Fa = Object.assign || function(e) {
    for (var t = arguments, i, n = 1, a = arguments.length; n < a; n++) {
      i = t[n];
      for (var o in i)
        Object.prototype.hasOwnProperty.call(i, o) && (e[o] = i[o]);
    }
    return e;
  }, Fa.apply(this, arguments);
};
function fy(r, e) {
  var t = {};
  for (var i in r)
    Object.prototype.hasOwnProperty.call(r, i) && e.indexOf(i) < 0 && (t[i] = r[i]);
  if (r != null && typeof Object.getOwnPropertySymbols == "function")
    for (var n = 0, i = Object.getOwnPropertySymbols(r); n < i.length; n++)
      e.indexOf(i[n]) < 0 && Object.prototype.propertyIsEnumerable.call(r, i[n]) && (t[i[n]] = r[i[n]]);
  return t;
}
var ti = (
  /** @class */
  function() {
    function r(e, t) {
      e === void 0 && (e = 0), t === void 0 && (t = 0), this._width = e, this._height = t, this.destroyed = !1, this.internal = !1, this.onResize = new Bt("setRealSize"), this.onUpdate = new Bt("update"), this.onError = new Bt("onError");
    }
    return r.prototype.bind = function(e) {
      this.onResize.add(e), this.onUpdate.add(e), this.onError.add(e), (this._width || this._height) && this.onResize.emit(this._width, this._height);
    }, r.prototype.unbind = function(e) {
      this.onResize.remove(e), this.onUpdate.remove(e), this.onError.remove(e);
    }, r.prototype.resize = function(e, t) {
      (e !== this._width || t !== this._height) && (this._width = e, this._height = t, this.onResize.emit(e, t));
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
    }), r.prototype.style = function(e, t, i) {
      return !1;
    }, r.prototype.dispose = function() {
    }, r.prototype.destroy = function() {
      this.destroyed || (this.destroyed = !0, this.dispose(), this.onError.removeAll(), this.onError = null, this.onResize.removeAll(), this.onResize = null, this.onUpdate.removeAll(), this.onUpdate = null);
    }, r.test = function(e, t) {
      return !1;
    }, r;
  }()
), si = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t, i) {
      var n = this, a = i || {}, o = a.width, s = a.height;
      if (!o || !s)
        throw new Error("BufferResource width or height invalid");
      return n = r.call(this, o, s) || this, n.data = t, n;
    }
    return e.prototype.upload = function(t, i, n) {
      var a = t.gl;
      a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, i.alphaMode === ee.UNPACK);
      var o = i.realWidth, s = i.realHeight;
      return n.width === o && n.height === s ? a.texSubImage2D(i.target, 0, 0, 0, o, s, i.format, n.type, this.data) : (n.width = o, n.height = s, a.texImage2D(i.target, 0, n.internalFormat, o, s, 0, i.format, n.type, this.data)), !0;
    }, e.prototype.dispose = function() {
      this.data = null;
    }, e.test = function(t) {
      return t instanceof Float32Array || t instanceof Uint8Array || t instanceof Uint32Array;
    }, e;
  }(ti)
), cy = {
  scaleMode: oe.NEAREST,
  format: N.RGBA,
  alphaMode: ee.NPM
}, rt = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t, i) {
      t === void 0 && (t = null), i === void 0 && (i = null);
      var n = r.call(this) || this;
      i = i || {};
      var a = i.alphaMode, o = i.mipmap, s = i.anisotropicLevel, u = i.scaleMode, h = i.width, l = i.height, f = i.wrapMode, c = i.format, d = i.type, p = i.target, v = i.resolution, _ = i.resourceOptions;
      return t && !(t instanceof ti) && (t = Ah(t, _), t.internal = !0), n.resolution = v || U.RESOLUTION, n.width = Math.round((h || 0) * n.resolution) / n.resolution, n.height = Math.round((l || 0) * n.resolution) / n.resolution, n._mipmap = o !== void 0 ? o : U.MIPMAP_TEXTURES, n.anisotropicLevel = s !== void 0 ? s : U.ANISOTROPIC_LEVEL, n._wrapMode = f || U.WRAP_MODE, n._scaleMode = u !== void 0 ? u : U.SCALE_MODE, n.format = c || N.RGBA, n.type = d || k.UNSIGNED_BYTE, n.target = p || $e.TEXTURE_2D, n.alphaMode = a !== void 0 ? a : ee.UNPACK, n.uid = rr(), n.touched = 0, n.isPowerOfTwo = !1, n._refreshPOT(), n._glTextures = {}, n.dirtyId = 0, n.dirtyStyleId = 0, n.cacheId = null, n.valid = h > 0 && l > 0, n.textureCacheIds = [], n.destroyed = !1, n.resource = null, n._batchEnabled = 0, n._batchLocation = 0, n.parentTextureArray = null, n.setResource(t), n;
    }
    return Object.defineProperty(e.prototype, "realWidth", {
      /**
       * Pixel width of the source of this texture
       * @readonly
       */
      get: function() {
        return Math.round(this.width * this.resolution);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "realHeight", {
      /**
       * Pixel height of the source of this texture
       * @readonly
       */
      get: function() {
        return Math.round(this.height * this.resolution);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "mipmap", {
      /**
       * Mipmap mode of the texture, affects downscaled images
       * @default PIXI.settings.MIPMAP_TEXTURES
       */
      get: function() {
        return this._mipmap;
      },
      set: function(t) {
        this._mipmap !== t && (this._mipmap = t, this.dirtyStyleId++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "scaleMode", {
      /**
       * The scale mode to apply when scaling this texture
       * @default PIXI.settings.SCALE_MODE
       */
      get: function() {
        return this._scaleMode;
      },
      set: function(t) {
        this._scaleMode !== t && (this._scaleMode = t, this.dirtyStyleId++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "wrapMode", {
      /**
       * How the texture wraps
       * @default PIXI.settings.WRAP_MODE
       */
      get: function() {
        return this._wrapMode;
      },
      set: function(t) {
        this._wrapMode !== t && (this._wrapMode = t, this.dirtyStyleId++);
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.setStyle = function(t, i) {
      var n;
      return t !== void 0 && t !== this.scaleMode && (this.scaleMode = t, n = !0), i !== void 0 && i !== this.mipmap && (this.mipmap = i, n = !0), n && this.dirtyStyleId++, this;
    }, e.prototype.setSize = function(t, i, n) {
      return n = n || this.resolution, this.setRealSize(t * n, i * n, n);
    }, e.prototype.setRealSize = function(t, i, n) {
      return this.resolution = n || this.resolution, this.width = Math.round(t) / this.resolution, this.height = Math.round(i) / this.resolution, this._refreshPOT(), this.update(), this;
    }, e.prototype._refreshPOT = function() {
      this.isPowerOfTwo = Cs(this.realWidth) && Cs(this.realHeight);
    }, e.prototype.setResolution = function(t) {
      var i = this.resolution;
      return i === t ? this : (this.resolution = t, this.valid && (this.width = Math.round(this.width * i) / t, this.height = Math.round(this.height * i) / t, this.emit("update", this)), this._refreshPOT(), this);
    }, e.prototype.setResource = function(t) {
      if (this.resource === t)
        return this;
      if (this.resource)
        throw new Error("Resource can be set only once");
      return t.bind(this), this.resource = t, this;
    }, e.prototype.update = function() {
      this.valid ? (this.dirtyId++, this.dirtyStyleId++, this.emit("update", this)) : this.width > 0 && this.height > 0 && (this.valid = !0, this.emit("loaded", this), this.emit("update", this));
    }, e.prototype.onError = function(t) {
      this.emit("error", this, t);
    }, e.prototype.destroy = function() {
      this.resource && (this.resource.unbind(this), this.resource.internal && this.resource.destroy(), this.resource = null), this.cacheId && (delete Ue[this.cacheId], delete ve[this.cacheId], this.cacheId = null), this.dispose(), e.removeFromCache(this), this.textureCacheIds = null, this.destroyed = !0;
    }, e.prototype.dispose = function() {
      this.emit("dispose", this);
    }, e.prototype.castToBaseTexture = function() {
      return this;
    }, e.from = function(t, i, n) {
      n === void 0 && (n = U.STRICT_TEXTURE_CACHE);
      var a = typeof t == "string", o = null;
      if (a)
        o = t;
      else {
        if (!t._pixiId) {
          var s = i && i.pixiIdPrefix || "pixiid";
          t._pixiId = s + "_" + rr();
        }
        o = t._pixiId;
      }
      var u = Ue[o];
      if (a && n && !u)
        throw new Error('The cacheId "' + o + '" does not exist in BaseTextureCache.');
      return u || (u = new e(t, i), u.cacheId = o, e.addToCache(u, o)), u;
    }, e.fromBuffer = function(t, i, n, a) {
      t = t || new Float32Array(i * n * 4);
      var o = new si(t, { width: i, height: n }), s = t instanceof Float32Array ? k.FLOAT : k.UNSIGNED_BYTE;
      return new e(o, Object.assign({}, cy, a || { width: i, height: n, type: s }));
    }, e.addToCache = function(t, i) {
      i && (t.textureCacheIds.indexOf(i) === -1 && t.textureCacheIds.push(i), Ue[i] && console.warn("BaseTexture added to the cache with an id [" + i + "] that already had an entry"), Ue[i] = t);
    }, e.removeFromCache = function(t) {
      if (typeof t == "string") {
        var i = Ue[t];
        if (i) {
          var n = i.textureCacheIds.indexOf(t);
          return n > -1 && i.textureCacheIds.splice(n, 1), delete Ue[t], i;
        }
      } else if (t && t.textureCacheIds) {
        for (var a = 0; a < t.textureCacheIds.length; ++a)
          delete Ue[t.textureCacheIds[a]];
        return t.textureCacheIds.length = 0, t;
      }
      return null;
    }, e._globalBatch = 0, e;
  }(ai)
), Rh = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t, i) {
      var n = this, a = i || {}, o = a.width, s = a.height;
      n = r.call(this, o, s) || this, n.items = [], n.itemDirtyIds = [];
      for (var u = 0; u < t; u++) {
        var h = new rt();
        n.items.push(h), n.itemDirtyIds.push(-2);
      }
      return n.length = t, n._load = null, n.baseTexture = null, n;
    }
    return e.prototype.initFromArray = function(t, i) {
      for (var n = 0; n < this.length; n++)
        t[n] && (t[n].castToBaseTexture ? this.addBaseTextureAt(t[n].castToBaseTexture(), n) : t[n] instanceof ti ? this.addResourceAt(t[n], n) : this.addResourceAt(Ah(t[n], i), n));
    }, e.prototype.dispose = function() {
      for (var t = 0, i = this.length; t < i; t++)
        this.items[t].destroy();
      this.items = null, this.itemDirtyIds = null, this._load = null;
    }, e.prototype.addResourceAt = function(t, i) {
      if (!this.items[i])
        throw new Error("Index " + i + " is out of bounds");
      return t.valid && !this.valid && this.resize(t.width, t.height), this.items[i].setResource(t), this;
    }, e.prototype.bind = function(t) {
      if (this.baseTexture !== null)
        throw new Error("Only one base texture per TextureArray is allowed");
      r.prototype.bind.call(this, t);
      for (var i = 0; i < this.length; i++)
        this.items[i].parentTextureArray = t, this.items[i].on("update", t.update, t);
    }, e.prototype.unbind = function(t) {
      r.prototype.unbind.call(this, t);
      for (var i = 0; i < this.length; i++)
        this.items[i].parentTextureArray = null, this.items[i].off("update", t.update, t);
    }, e.prototype.load = function() {
      var t = this;
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
        var a = t.items[0], o = a.realWidth, s = a.realHeight;
        return t.resize(o, s), Promise.resolve(t);
      }), this._load;
    }, e;
  }(ti)
), dy = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t, i) {
      var n = this, a = i || {}, o = a.width, s = a.height, u, h;
      return Array.isArray(t) ? (u = t, h = t.length) : h = t, n = r.call(this, h, { width: o, height: s }) || this, u && n.initFromArray(u, i), n;
    }
    return e.prototype.addBaseTextureAt = function(t, i) {
      if (t.resource)
        this.addResourceAt(t.resource, i);
      else
        throw new Error("ArrayResource does not support RenderTexture");
      return this;
    }, e.prototype.bind = function(t) {
      r.prototype.bind.call(this, t), t.target = $e.TEXTURE_2D_ARRAY;
    }, e.prototype.upload = function(t, i, n) {
      var a = this, o = a.length, s = a.itemDirtyIds, u = a.items, h = t.gl;
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
    }, e;
  }(Rh)
), De = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t) {
      var i = this, n = t, a = n.naturalWidth || n.videoWidth || n.width, o = n.naturalHeight || n.videoHeight || n.height;
      return i = r.call(this, a, o) || this, i.source = t, i.noSubImage = !1, i;
    }
    return e.crossOrigin = function(t, i, n) {
      n === void 0 && i.indexOf("data:") !== 0 ? t.crossOrigin = ry(i) : n !== !1 && (t.crossOrigin = typeof n == "string" ? n : "anonymous");
    }, e.prototype.upload = function(t, i, n, a) {
      var o = t.gl, s = i.realWidth, u = i.realHeight;
      if (a = a || this.source, a instanceof HTMLImageElement) {
        if (!a.complete || a.naturalWidth === 0)
          return !1;
      } else if (a instanceof HTMLVideoElement && a.readyState <= 1)
        return !1;
      return o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL, i.alphaMode === ee.UNPACK), !this.noSubImage && i.target === o.TEXTURE_2D && n.width === s && n.height === u ? o.texSubImage2D(o.TEXTURE_2D, 0, 0, 0, i.format, n.type, a) : (n.width = s, n.height = u, o.texImage2D(i.target, 0, n.internalFormat, i.format, n.type, a)), !0;
    }, e.prototype.update = function() {
      if (!this.destroyed) {
        var t = this.source, i = t.naturalWidth || t.videoWidth || t.width, n = t.naturalHeight || t.videoHeight || t.height;
        this.resize(i, n), r.prototype.update.call(this);
      }
    }, e.prototype.dispose = function() {
      this.source = null;
    }, e;
  }(ti)
), py = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t) {
      return r.call(this, t) || this;
    }
    return e.test = function(t) {
      var i = globalThis.OffscreenCanvas;
      return i && t instanceof i ? !0 : globalThis.HTMLCanvasElement && t instanceof HTMLCanvasElement;
    }, e;
  }(De)
), vy = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t, i) {
      var n = this, a = i || {}, o = a.width, s = a.height, u = a.autoLoad, h = a.linkBaseTexture;
      if (t && t.length !== e.SIDES)
        throw new Error("Invalid length. Got " + t.length + ", expected 6");
      n = r.call(this, 6, { width: o, height: s }) || this;
      for (var l = 0; l < e.SIDES; l++)
        n.items[l].target = $e.TEXTURE_CUBE_MAP_POSITIVE_X + l;
      return n.linkBaseTexture = h !== !1, t && n.initFromArray(t, i), u !== !1 && n.load(), n;
    }
    return e.prototype.bind = function(t) {
      r.prototype.bind.call(this, t), t.target = $e.TEXTURE_CUBE_MAP;
    }, e.prototype.addBaseTextureAt = function(t, i, n) {
      if (!this.items[i])
        throw new Error("Index " + i + " is out of bounds");
      if (!this.linkBaseTexture || t.parentTextureArray || Object.keys(t._glTextures).length > 0)
        if (t.resource)
          this.addResourceAt(t.resource, i);
        else
          throw new Error("CubeResource does not support copying of renderTexture.");
      else
        t.target = $e.TEXTURE_CUBE_MAP_POSITIVE_X + i, t.parentTextureArray = this.baseTexture, this.items[i] = t;
      return t.valid && !this.valid && this.resize(t.realWidth, t.realHeight), this.items[i] = t, this;
    }, e.prototype.upload = function(t, i, n) {
      for (var a = this.itemDirtyIds, o = 0; o < e.SIDES; o++) {
        var s = this.items[o];
        (a[o] < s.dirtyId || n.dirtyId < i.dirtyId) && (s.valid && s.resource ? (s.resource.upload(t, s, n), a[o] = s.dirtyId) : a[o] < -1 && (t.gl.texImage2D(s.target, 0, n.internalFormat, i.realWidth, i.realHeight, 0, i.format, n.type, null), a[o] = -1));
      }
      return !0;
    }, e.test = function(t) {
      return Array.isArray(t) && t.length === e.SIDES;
    }, e.SIDES = 6, e;
  }(Rh)
), Oh = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t, i) {
      var n = this;
      if (i = i || {}, !(t instanceof HTMLImageElement)) {
        var a = new Image();
        De.crossOrigin(a, t, i.crossorigin), a.src = t, t = a;
      }
      return n = r.call(this, t) || this, !t.complete && n._width && n._height && (n._width = 0, n._height = 0), n.url = t.src, n._process = null, n.preserveBitmap = !1, n.createBitmap = (i.createBitmap !== void 0 ? i.createBitmap : U.CREATE_IMAGE_BITMAP) && !!globalThis.createImageBitmap, n.alphaMode = typeof i.alphaMode == "number" ? i.alphaMode : null, n.bitmap = null, n._load = null, i.autoLoad !== !1 && n.load(), n;
    }
    return e.prototype.load = function(t) {
      var i = this;
      return this._load ? this._load : (t !== void 0 && (this.createBitmap = t), this._load = new Promise(function(n, a) {
        var o = i.source;
        i.url = o.src;
        var s = function() {
          i.destroyed || (o.onload = null, o.onerror = null, i.resize(o.width, o.height), i._load = null, i.createBitmap ? n(i.process()) : n(i));
        };
        o.complete && o.src ? s() : (o.onload = s, o.onerror = function(u) {
          a(u), i.onError.emit(u);
        });
      }), this._load);
    }, e.prototype.process = function() {
      var t = this, i = this.source;
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
          premultiplyAlpha: t.alphaMode === null || t.alphaMode === ee.UNPACK ? "premultiply" : "none"
        });
      }).then(function(o) {
        return t.destroyed ? Promise.reject() : (t.bitmap = o, t.update(), t._process = null, Promise.resolve(t));
      }), this._process;
    }, e.prototype.upload = function(t, i, n) {
      if (typeof this.alphaMode == "number" && (i.alphaMode = this.alphaMode), !this.createBitmap)
        return r.prototype.upload.call(this, t, i, n);
      if (!this.bitmap && (this.process(), !this.bitmap))
        return !1;
      if (r.prototype.upload.call(this, t, i, n, this.bitmap), !this.preserveBitmap) {
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
    }, e.prototype.dispose = function() {
      this.source.onload = null, this.source.onerror = null, r.prototype.dispose.call(this), this.bitmap && (this.bitmap.close(), this.bitmap = null), this._process = null, this._load = null;
    }, e.test = function(t) {
      return typeof t == "string" || t instanceof HTMLImageElement;
    }, e;
  }(De)
), _y = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t, i) {
      var n = this;
      return i = i || {}, n = r.call(this, U.ADAPTER.createCanvas()) || this, n._width = 0, n._height = 0, n.svg = t, n.scale = i.scale || 1, n._overrideWidth = i.width, n._overrideHeight = i.height, n._resolve = null, n._crossorigin = i.crossorigin, n._load = null, i.autoLoad !== !1 && n.load(), n;
    }
    return e.prototype.load = function() {
      var t = this;
      return this._load ? this._load : (this._load = new Promise(function(i) {
        if (t._resolve = function() {
          t.resize(t.source.width, t.source.height), i(t);
        }, e.SVG_XML.test(t.svg.trim())) {
          if (!btoa)
            throw new Error("Your browser doesn't support base64 conversions.");
          t.svg = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(t.svg)));
        }
        t._loadSvg();
      }), this._load);
    }, e.prototype._loadSvg = function() {
      var t = this, i = new Image();
      De.crossOrigin(i, this.svg, this._crossorigin), i.src = this.svg, i.onerror = function(n) {
        t._resolve && (i.onerror = null, t.onError.emit(n));
      }, i.onload = function() {
        if (t._resolve) {
          var n = i.width, a = i.height;
          if (!n || !a)
            throw new Error("The SVG image must have width and height defined (in pixels), canvas API needs them.");
          var o = n * t.scale, s = a * t.scale;
          (t._overrideWidth || t._overrideHeight) && (o = t._overrideWidth || t._overrideHeight / a * n, s = t._overrideHeight || t._overrideWidth / n * a), o = Math.round(o), s = Math.round(s);
          var u = t.source;
          u.width = o, u.height = s, u._pixiId = "canvas_" + rr(), u.getContext("2d").drawImage(i, 0, 0, n, a, 0, 0, o, s), t._resolve(), t._resolve = null;
        }
      };
    }, e.getSize = function(t) {
      var i = e.SVG_SIZE.exec(t), n = {};
      return i && (n[i[1]] = Math.round(parseFloat(i[3])), n[i[5]] = Math.round(parseFloat(i[7]))), n;
    }, e.prototype.dispose = function() {
      r.prototype.dispose.call(this), this._resolve = null, this._crossorigin = null;
    }, e.test = function(t, i) {
      return i === "svg" || typeof t == "string" && t.startsWith("data:image/svg+xml") || typeof t == "string" && e.SVG_XML.test(t);
    }, e.SVG_XML = /^(<\?xml[^?]+\?>)?\s*(<!--[^(-->)]*-->)?\s*\<svg/m, e.SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i, e;
  }(De)
), yy = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t, i) {
      var n = this;
      if (i = i || {}, !(t instanceof HTMLVideoElement)) {
        var a = document.createElement("video");
        a.setAttribute("preload", "auto"), a.setAttribute("webkit-playsinline", ""), a.setAttribute("playsinline", ""), typeof t == "string" && (t = [t]);
        var o = t[0].src || t[0];
        De.crossOrigin(a, o, i.crossorigin);
        for (var s = 0; s < t.length; ++s) {
          var u = document.createElement("source"), h = t[s], l = h.src, f = h.mime;
          l = l || t[s];
          var c = l.split("?").shift().toLowerCase(), d = c.slice(c.lastIndexOf(".") + 1);
          f = f || e.MIME_TYPES[d] || "video/" + d, u.src = l, u.type = f, a.appendChild(u);
        }
        t = a;
      }
      return n = r.call(this, t) || this, n.noSubImage = !0, n._autoUpdate = !0, n._isConnectedToTicker = !1, n._updateFPS = i.updateFPS || 0, n._msToNextUpdate = 0, n.autoPlay = i.autoPlay !== !1, n._load = null, n._resolve = null, n._onCanPlay = n._onCanPlay.bind(n), n._onError = n._onError.bind(n), i.autoLoad !== !1 && n.load(), n;
    }
    return e.prototype.update = function(t) {
      if (!this.destroyed) {
        var i = Lt.shared.elapsedMS * this.source.playbackRate;
        this._msToNextUpdate = Math.floor(this._msToNextUpdate - i), (!this._updateFPS || this._msToNextUpdate <= 0) && (r.prototype.update.call(this), this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0);
      }
    }, e.prototype.load = function() {
      var t = this;
      if (this._load)
        return this._load;
      var i = this.source;
      return (i.readyState === i.HAVE_ENOUGH_DATA || i.readyState === i.HAVE_FUTURE_DATA) && i.width && i.height && (i.complete = !0), i.addEventListener("play", this._onPlayStart.bind(this)), i.addEventListener("pause", this._onPlayStop.bind(this)), this._isSourceReady() ? this._onCanPlay() : (i.addEventListener("canplay", this._onCanPlay), i.addEventListener("canplaythrough", this._onCanPlay), i.addEventListener("error", this._onError, !0)), this._load = new Promise(function(n) {
        t.valid ? n(t) : (t._resolve = n, i.load());
      }), this._load;
    }, e.prototype._onError = function(t) {
      this.source.removeEventListener("error", this._onError, !0), this.onError.emit(t);
    }, e.prototype._isSourcePlaying = function() {
      var t = this.source;
      return !t.paused && !t.ended && this._isSourceReady();
    }, e.prototype._isSourceReady = function() {
      var t = this.source;
      return t.readyState > 2;
    }, e.prototype._onPlayStart = function() {
      this.valid || this._onCanPlay(), this.autoUpdate && !this._isConnectedToTicker && (Lt.shared.add(this.update, this), this._isConnectedToTicker = !0);
    }, e.prototype._onPlayStop = function() {
      this._isConnectedToTicker && (Lt.shared.remove(this.update, this), this._isConnectedToTicker = !1);
    }, e.prototype._onCanPlay = function() {
      var t = this.source;
      t.removeEventListener("canplay", this._onCanPlay), t.removeEventListener("canplaythrough", this._onCanPlay);
      var i = this.valid;
      this.resize(t.videoWidth, t.videoHeight), !i && this._resolve && (this._resolve(this), this._resolve = null), this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && t.play();
    }, e.prototype.dispose = function() {
      this._isConnectedToTicker && (Lt.shared.remove(this.update, this), this._isConnectedToTicker = !1);
      var t = this.source;
      t && (t.removeEventListener("error", this._onError, !0), t.pause(), t.src = "", t.load()), r.prototype.dispose.call(this);
    }, Object.defineProperty(e.prototype, "autoUpdate", {
      /** Should the base texture automatically update itself, set to true by default. */
      get: function() {
        return this._autoUpdate;
      },
      set: function(t) {
        t !== this._autoUpdate && (this._autoUpdate = t, !this._autoUpdate && this._isConnectedToTicker ? (Lt.shared.remove(this.update, this), this._isConnectedToTicker = !1) : this._autoUpdate && !this._isConnectedToTicker && this._isSourcePlaying() && (Lt.shared.add(this.update, this), this._isConnectedToTicker = !0));
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "updateFPS", {
      /**
       * How many times a second to update the texture from the video. Leave at 0 to update at every render.
       * A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.
       */
      get: function() {
        return this._updateFPS;
      },
      set: function(t) {
        t !== this._updateFPS && (this._updateFPS = t);
      },
      enumerable: !1,
      configurable: !0
    }), e.test = function(t, i) {
      return globalThis.HTMLVideoElement && t instanceof HTMLVideoElement || e.TYPES.indexOf(i) > -1;
    }, e.TYPES = ["mp4", "m4v", "webm", "ogg", "ogv", "h264", "avi", "mov"], e.MIME_TYPES = {
      ogv: "video/ogg",
      mov: "video/quicktime",
      m4v: "video/mp4"
    }, e;
  }(De)
), gy = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t) {
      return r.call(this, t) || this;
    }
    return e.test = function(t) {
      return !!globalThis.createImageBitmap && typeof ImageBitmap < "u" && t instanceof ImageBitmap;
    }, e;
  }(De)
);
Ma.push(Oh, gy, py, yy, _y, si, vy, dy);
var my = (
  /** @class */
  function(r) {
    vt(e, r);
    function e() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return e.prototype.upload = function(t, i, n) {
      var a = t.gl;
      a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, i.alphaMode === ee.UNPACK);
      var o = i.realWidth, s = i.realHeight;
      return n.width === o && n.height === s ? a.texSubImage2D(i.target, 0, 0, 0, o, s, i.format, n.type, this.data) : (n.width = o, n.height = s, a.texImage2D(i.target, 0, n.internalFormat, o, s, 0, i.format, n.type, this.data)), !0;
    }, e;
  }(si)
), Na = (
  /** @class */
  function() {
    function r(e, t) {
      this.width = Math.round(e || 100), this.height = Math.round(t || 100), this.stencil = !1, this.depth = !1, this.dirtyId = 0, this.dirtyFormat = 0, this.dirtySize = 0, this.depthTexture = null, this.colorTextures = [], this.glFramebuffers = {}, this.disposeRunner = new Bt("disposeFramebuffer"), this.multisample = gt.NONE;
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
    }), r.prototype.addColorTexture = function(e, t) {
      return e === void 0 && (e = 0), this.colorTextures[e] = t || new rt(null, {
        scaleMode: oe.NEAREST,
        resolution: 1,
        mipmap: te.OFF,
        width: this.width,
        height: this.height
      }), this.dirtyId++, this.dirtyFormat++, this;
    }, r.prototype.addDepthTexture = function(e) {
      return this.depthTexture = e || new rt(new my(null, { width: this.width, height: this.height }), {
        scaleMode: oe.NEAREST,
        resolution: 1,
        width: this.width,
        height: this.height,
        mipmap: te.OFF,
        format: N.DEPTH_COMPONENT,
        type: k.UNSIGNED_SHORT
      }), this.dirtyId++, this.dirtyFormat++, this;
    }, r.prototype.enableDepth = function() {
      return this.depth = !0, this.dirtyId++, this.dirtyFormat++, this;
    }, r.prototype.enableStencil = function() {
      return this.stencil = !0, this.dirtyId++, this.dirtyFormat++, this;
    }, r.prototype.resize = function(e, t) {
      if (e = Math.round(e), t = Math.round(t), !(e === this.width && t === this.height)) {
        this.width = e, this.height = t, this.dirtyId++, this.dirtySize++;
        for (var i = 0; i < this.colorTextures.length; i++) {
          var n = this.colorTextures[i], a = n.resolution;
          n.setSize(e / a, t / a);
        }
        if (this.depthTexture) {
          var a = this.depthTexture.resolution;
          this.depthTexture.setSize(e / a, t / a);
        }
      }
    }, r.prototype.dispose = function() {
      this.disposeRunner.emit(this, !1);
    }, r.prototype.destroyDepthTexture = function() {
      this.depthTexture && (this.depthTexture.destroy(), this.depthTexture = null, ++this.dirtyId, ++this.dirtyFormat);
    }, r;
  }()
), Ih = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t) {
      t === void 0 && (t = {});
      var i = this;
      if (typeof t == "number") {
        var n = arguments[0], a = arguments[1], o = arguments[2], s = arguments[3];
        t = { width: n, height: a, scaleMode: o, resolution: s };
      }
      return t.width = t.width || 100, t.height = t.height || 100, t.multisample = t.multisample !== void 0 ? t.multisample : gt.NONE, i = r.call(this, null, t) || this, i.mipmap = te.OFF, i.valid = !0, i.clearColor = [0, 0, 0, 0], i.framebuffer = new Na(i.realWidth, i.realHeight).addColorTexture(0, i), i.framebuffer.multisample = t.multisample, i.maskStack = [], i.filterStack = [{}], i;
    }
    return e.prototype.resize = function(t, i) {
      this.framebuffer.resize(t * this.resolution, i * this.resolution), this.setRealSize(this.framebuffer.width, this.framebuffer.height);
    }, e.prototype.dispose = function() {
      this.framebuffer.dispose(), r.prototype.dispose.call(this);
    }, e.prototype.destroy = function() {
      r.prototype.destroy.call(this), this.framebuffer.destroyDepthTexture(), this.framebuffer = null;
    }, e;
  }(rt)
), Ch = (
  /** @class */
  function() {
    function r() {
      this.x0 = 0, this.y0 = 0, this.x1 = 1, this.y1 = 0, this.x2 = 1, this.y2 = 1, this.x3 = 0, this.y3 = 1, this.uvsFloat32 = new Float32Array(8);
    }
    return r.prototype.set = function(e, t, i) {
      var n = t.width, a = t.height;
      if (i) {
        var o = e.width / 2 / n, s = e.height / 2 / a, u = e.x / n + o, h = e.y / a + s;
        i = bt.add(i, bt.NW), this.x0 = u + o * bt.uX(i), this.y0 = h + s * bt.uY(i), i = bt.add(i, 2), this.x1 = u + o * bt.uX(i), this.y1 = h + s * bt.uY(i), i = bt.add(i, 2), this.x2 = u + o * bt.uX(i), this.y2 = h + s * bt.uY(i), i = bt.add(i, 2), this.x3 = u + o * bt.uX(i), this.y3 = h + s * bt.uY(i);
      } else
        this.x0 = e.x / n, this.y0 = e.y / a, this.x1 = (e.x + e.width) / n, this.y1 = e.y / a, this.x2 = (e.x + e.width) / n, this.y2 = (e.y + e.height) / a, this.x3 = e.x / n, this.y3 = (e.y + e.height) / a;
      this.uvsFloat32[0] = this.x0, this.uvsFloat32[1] = this.y0, this.uvsFloat32[2] = this.x1, this.uvsFloat32[3] = this.y1, this.uvsFloat32[4] = this.x2, this.uvsFloat32[5] = this.y2, this.uvsFloat32[6] = this.x3, this.uvsFloat32[7] = this.y3;
    }, r.prototype.toString = function() {
      return "[@pixi/core:TextureUvs " + ("x0=" + this.x0 + " y0=" + this.y0 + " ") + ("x1=" + this.x1 + " y1=" + this.y1 + " x2=" + this.x2 + " ") + ("y2=" + this.y2 + " x3=" + this.x3 + " y3=" + this.y3) + "]";
    }, r;
  }()
), Ls = new Ch();
function Ti(r) {
  r.destroy = function() {
  }, r.on = function() {
  }, r.once = function() {
  }, r.emit = function() {
  };
}
var W = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t, i, n, a, o, s) {
      var u = r.call(this) || this;
      if (u.noFrame = !1, i || (u.noFrame = !0, i = new it(0, 0, 1, 1)), t instanceof e && (t = t.baseTexture), u.baseTexture = t, u._frame = i, u.trim = a, u.valid = !1, u._uvs = Ls, u.uvMatrix = null, u.orig = n || i, u._rotate = Number(o || 0), o === !0)
        u._rotate = 2;
      else if (u._rotate % 2 !== 0)
        throw new Error("attempt to use diamond-shaped UVs. If you are sure, set rotation manually");
      return u.defaultAnchor = s ? new yt(s.x, s.y) : new yt(0, 0), u._updateID = 0, u.textureCacheIds = [], t.valid ? u.noFrame ? t.valid && u.onBaseTextureUpdated(t) : u.frame = i : t.once("loaded", u.onBaseTextureUpdated, u), u.noFrame && t.on("update", u.onBaseTextureUpdated, u), u;
    }
    return e.prototype.update = function() {
      this.baseTexture.resource && this.baseTexture.resource.update();
    }, e.prototype.onBaseTextureUpdated = function(t) {
      if (this.noFrame) {
        if (!this.baseTexture.valid)
          return;
        this._frame.width = t.width, this._frame.height = t.height, this.valid = !0, this.updateUvs();
      } else
        this.frame = this._frame;
      this.emit("update", this);
    }, e.prototype.destroy = function(t) {
      if (this.baseTexture) {
        if (t) {
          var i = this.baseTexture.resource;
          i && i.url && ve[i.url] && e.removeFromCache(i.url), this.baseTexture.destroy();
        }
        this.baseTexture.off("loaded", this.onBaseTextureUpdated, this), this.baseTexture.off("update", this.onBaseTextureUpdated, this), this.baseTexture = null;
      }
      this._frame = null, this._uvs = null, this.trim = null, this.orig = null, this.valid = !1, e.removeFromCache(this), this.textureCacheIds = null;
    }, e.prototype.clone = function() {
      var t = this._frame.clone(), i = this._frame === this.orig ? t : this.orig.clone(), n = new e(this.baseTexture, !this.noFrame && t, i, this.trim && this.trim.clone(), this.rotate, this.defaultAnchor);
      return this.noFrame && (n._frame = t), n;
    }, e.prototype.updateUvs = function() {
      this._uvs === Ls && (this._uvs = new Ch()), this._uvs.set(this._frame, this.baseTexture, this.rotate), this._updateID++;
    }, e.from = function(t, i, n) {
      i === void 0 && (i = {}), n === void 0 && (n = U.STRICT_TEXTURE_CACHE);
      var a = typeof t == "string", o = null;
      if (a)
        o = t;
      else if (t instanceof rt) {
        if (!t.cacheId) {
          var s = i && i.pixiIdPrefix || "pixiid";
          t.cacheId = s + "-" + rr(), rt.addToCache(t, t.cacheId);
        }
        o = t.cacheId;
      } else {
        if (!t._pixiId) {
          var s = i && i.pixiIdPrefix || "pixiid";
          t._pixiId = s + "_" + rr();
        }
        o = t._pixiId;
      }
      var u = ve[o];
      if (a && n && !u)
        throw new Error('The cacheId "' + o + '" does not exist in TextureCache.');
      return !u && !(t instanceof rt) ? (i.resolution || (i.resolution = sn(t)), u = new e(new rt(t, i)), u.baseTexture.cacheId = o, rt.addToCache(u.baseTexture, o), e.addToCache(u, o)) : !u && t instanceof rt && (u = new e(t), e.addToCache(u, o)), u;
    }, e.fromURL = function(t, i) {
      var n = Object.assign({ autoLoad: !1 }, i == null ? void 0 : i.resourceOptions), a = e.from(t, Object.assign({ resourceOptions: n }, i), !1), o = a.baseTexture.resource;
      return a.baseTexture.valid ? Promise.resolve(a) : o.load().then(function() {
        return Promise.resolve(a);
      });
    }, e.fromBuffer = function(t, i, n, a) {
      return new e(rt.fromBuffer(t, i, n, a));
    }, e.fromLoader = function(t, i, n, a) {
      var o = new rt(t, Object.assign({
        scaleMode: U.SCALE_MODE,
        resolution: sn(i)
      }, a)), s = o.resource;
      s instanceof Oh && (s.url = i);
      var u = new e(o);
      return n || (n = i), rt.addToCache(u.baseTexture, n), e.addToCache(u, n), n !== i && (rt.addToCache(u.baseTexture, i), e.addToCache(u, i)), u.baseTexture.valid ? Promise.resolve(u) : new Promise(function(h) {
        u.baseTexture.once("loaded", function() {
          return h(u);
        });
      });
    }, e.addToCache = function(t, i) {
      i && (t.textureCacheIds.indexOf(i) === -1 && t.textureCacheIds.push(i), ve[i] && console.warn("Texture added to the cache with an id [" + i + "] that already had an entry"), ve[i] = t);
    }, e.removeFromCache = function(t) {
      if (typeof t == "string") {
        var i = ve[t];
        if (i) {
          var n = i.textureCacheIds.indexOf(t);
          return n > -1 && i.textureCacheIds.splice(n, 1), delete ve[t], i;
        }
      } else if (t && t.textureCacheIds) {
        for (var a = 0; a < t.textureCacheIds.length; ++a)
          ve[t.textureCacheIds[a]] === t && delete ve[t.textureCacheIds[a]];
        return t.textureCacheIds.length = 0, t;
      }
      return null;
    }, Object.defineProperty(e.prototype, "resolution", {
      /**
       * Returns resolution of baseTexture
       * @readonly
       */
      get: function() {
        return this.baseTexture.resolution;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "frame", {
      /**
       * The frame specifies the region of the base texture that this texture uses.
       * Please call `updateUvs()` after you change coordinates of `frame` manually.
       */
      get: function() {
        return this._frame;
      },
      set: function(t) {
        this._frame = t, this.noFrame = !1;
        var i = t.x, n = t.y, a = t.width, o = t.height, s = i + a > this.baseTexture.width, u = n + o > this.baseTexture.height;
        if (s || u) {
          var h = s && u ? "and" : "or", l = "X: " + i + " + " + a + " = " + (i + a) + " > " + this.baseTexture.width, f = "Y: " + n + " + " + o + " = " + (n + o) + " > " + this.baseTexture.height;
          throw new Error("Texture Error: frame does not fit inside the base Texture dimensions: " + (l + " " + h + " " + f));
        }
        this.valid = a && o && this.baseTexture.valid, !this.trim && !this.rotate && (this.orig = t), this.valid && this.updateUvs();
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "rotate", {
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
      set: function(t) {
        this._rotate = t, this.valid && this.updateUvs();
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "width", {
      /** The width of the Texture in pixels. */
      get: function() {
        return this.orig.width;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "height", {
      /** The height of the Texture in pixels. */
      get: function() {
        return this.orig.height;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.castToBaseTexture = function() {
      return this.baseTexture;
    }, Object.defineProperty(e, "EMPTY", {
      /** An empty texture, used often to not have to create multiple empty textures. Can not be destroyed. */
      get: function() {
        return e._EMPTY || (e._EMPTY = new e(new rt()), Ti(e._EMPTY), Ti(e._EMPTY.baseTexture)), e._EMPTY;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e, "WHITE", {
      /** A white texture of 16x16 size, used for graphics and other things Can not be destroyed. */
      get: function() {
        if (!e._WHITE) {
          var t = U.ADAPTER.createCanvas(16, 16), i = t.getContext("2d");
          t.width = 16, t.height = 16, i.fillStyle = "white", i.fillRect(0, 0, 16, 16), e._WHITE = new e(rt.from(t)), Ti(e._WHITE), Ti(e._WHITE.baseTexture);
        }
        return e._WHITE;
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(ai)
), ir = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t, i) {
      var n = r.call(this, t, i) || this;
      return n.valid = !0, n.filterFrame = null, n.filterPoolKey = null, n.updateUvs(), n;
    }
    return Object.defineProperty(e.prototype, "framebuffer", {
      /**
       * Shortcut to `this.baseTexture.framebuffer`, saves baseTexture cast.
       * @readonly
       */
      get: function() {
        return this.baseTexture.framebuffer;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "multisample", {
      /**
       * Shortcut to `this.framebuffer.multisample`.
       * @default PIXI.MSAA_QUALITY.NONE
       */
      get: function() {
        return this.framebuffer.multisample;
      },
      set: function(t) {
        this.framebuffer.multisample = t;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.resize = function(t, i, n) {
      n === void 0 && (n = !0);
      var a = this.baseTexture.resolution, o = Math.round(t * a) / a, s = Math.round(i * a) / a;
      this.valid = o > 0 && s > 0, this._frame.width = this.orig.width = o, this._frame.height = this.orig.height = s, n && this.baseTexture.resize(o, s), this.updateUvs();
    }, e.prototype.setResolution = function(t) {
      var i = this.baseTexture;
      i.resolution !== t && (i.setResolution(t), this.resize(i.width, i.height, !1));
    }, e.create = function(t) {
      for (var i = arguments, n = [], a = 1; a < arguments.length; a++)
        n[a - 1] = i[a];
      return typeof t == "number" && (Jt("6.0.0", "Arguments (width, height, scaleMode, resolution) have been deprecated."), t = {
        width: t,
        height: n[0],
        scaleMode: n[1],
        resolution: n[2]
      }), new e(new Ih(t));
    }, e;
  }(W)
), by = (
  /** @class */
  function() {
    function r(e) {
      this.texturePool = {}, this.textureOptions = e || {}, this.enableFullScreen = !1, this._pixelsWidth = 0, this._pixelsHeight = 0;
    }
    return r.prototype.createTexture = function(e, t, i) {
      i === void 0 && (i = gt.NONE);
      var n = new Ih(Object.assign({
        width: e,
        height: t,
        resolution: 1,
        multisample: i
      }, this.textureOptions));
      return new ir(n);
    }, r.prototype.getOptimalTexture = function(e, t, i, n) {
      i === void 0 && (i = 1), n === void 0 && (n = gt.NONE);
      var a;
      e = Math.ceil(e * i - 1e-6), t = Math.ceil(t * i - 1e-6), !this.enableFullScreen || e !== this._pixelsWidth || t !== this._pixelsHeight ? (e = on(e), t = on(t), a = ((e & 65535) << 16 | t & 65535) >>> 0, n > 1 && (a += n * 4294967296)) : a = n > 1 ? -n : -1, this.texturePool[a] || (this.texturePool[a] = []);
      var o = this.texturePool[a].pop();
      return o || (o = this.createTexture(e, t, n)), o.filterPoolKey = a, o.setResolution(i), o;
    }, r.prototype.getFilterTexture = function(e, t, i) {
      var n = this.getOptimalTexture(e.width, e.height, t || e.resolution, i || gt.NONE);
      return n.filterFrame = e.filterFrame, n;
    }, r.prototype.returnTexture = function(e) {
      var t = e.filterPoolKey;
      e.filterFrame = null, this.texturePool[t].push(e);
    }, r.prototype.returnFilterTexture = function(e) {
      this.returnTexture(e);
    }, r.prototype.clear = function(e) {
      if (e = e !== !1, e)
        for (var t in this.texturePool) {
          var i = this.texturePool[t];
          if (i)
            for (var n = 0; n < i.length; n++)
              i[n].destroy(!0);
        }
      this.texturePool = {};
    }, r.prototype.setScreenSize = function(e) {
      if (!(e.width === this._pixelsWidth && e.height === this._pixelsHeight)) {
        this.enableFullScreen = e.width > 0 && e.height > 0;
        for (var t in this.texturePool)
          if (Number(t) < 0) {
            var i = this.texturePool[t];
            if (i)
              for (var n = 0; n < i.length; n++)
                i[n].destroy(!0);
            this.texturePool[t] = [];
          }
        this._pixelsWidth = e.width, this._pixelsHeight = e.height;
      }
    }, r.SCREEN_KEY = -1, r;
  }()
), Us = (
  /** @class */
  function() {
    function r(e, t, i, n, a, o, s) {
      t === void 0 && (t = 0), i === void 0 && (i = !1), n === void 0 && (n = k.FLOAT), this.buffer = e, this.size = t, this.normalized = i, this.type = n, this.stride = a, this.start = o, this.instance = s;
    }
    return r.prototype.destroy = function() {
      this.buffer = null;
    }, r.from = function(e, t, i, n, a) {
      return new r(e, t, i, n, a);
    }, r;
  }()
), Ey = 0, Ot = (
  /** @class */
  function() {
    function r(e, t, i) {
      t === void 0 && (t = !0), i === void 0 && (i = !1), this.data = e || new Float32Array(1), this._glBuffers = {}, this._updateID = 0, this.index = i, this.static = t, this.id = Ey++, this.disposeRunner = new Bt("disposeBuffer");
    }
    return r.prototype.update = function(e) {
      e instanceof Array && (e = new Float32Array(e)), this.data = e || this.data, this._updateID++;
    }, r.prototype.dispose = function() {
      this.disposeRunner.emit(this, !1);
    }, r.prototype.destroy = function() {
      this.dispose(), this.data = null;
    }, Object.defineProperty(r.prototype, "index", {
      get: function() {
        return this.type === he.ELEMENT_ARRAY_BUFFER;
      },
      /**
       * Flags whether this is an index buffer.
       *
       * Index buffers are of type `ELEMENT_ARRAY_BUFFER`. Note that setting this property to false will make
       * the buffer of type `ARRAY_BUFFER`.
       *
       * For backwards compatibility.
       */
      set: function(e) {
        this.type = e ? he.ELEMENT_ARRAY_BUFFER : he.ARRAY_BUFFER;
      },
      enumerable: !1,
      configurable: !0
    }), r.from = function(e) {
      return e instanceof Array && (e = new Float32Array(e)), new r(e);
    }, r;
  }()
), Ty = {
  Float32Array,
  Uint32Array,
  Int32Array,
  Uint8Array
};
function xy(r, e) {
  for (var t = 0, i = 0, n = {}, a = 0; a < r.length; a++)
    i += e[a], t += r[a].length;
  for (var o = new ArrayBuffer(t * 4), s = null, u = 0, a = 0; a < r.length; a++) {
    var h = e[a], l = r[a], f = xh(l);
    n[f] || (n[f] = new Ty[f](o)), s = n[f];
    for (var c = 0; c < l.length; c++) {
      var d = (c / h | 0) * i + u, p = c % h;
      s[d + p] = l[c];
    }
    u += h;
  }
  return new Float32Array(o);
}
var Gs = { 5126: 4, 5123: 2, 5121: 1 }, wy = 0, Sy = {
  Float32Array,
  Uint32Array,
  Int32Array,
  Uint8Array,
  Uint16Array
}, ui = (
  /** @class */
  function() {
    function r(e, t) {
      e === void 0 && (e = []), t === void 0 && (t = {}), this.buffers = e, this.indexBuffer = null, this.attributes = t, this.glVertexArrayObjects = {}, this.id = wy++, this.instanced = !1, this.instanceCount = 1, this.disposeRunner = new Bt("disposeGeometry"), this.refCount = 0;
    }
    return r.prototype.addAttribute = function(e, t, i, n, a, o, s, u) {
      if (i === void 0 && (i = 0), n === void 0 && (n = !1), u === void 0 && (u = !1), !t)
        throw new Error("You must pass a buffer when creating an attribute");
      t instanceof Ot || (t instanceof Array && (t = new Float32Array(t)), t = new Ot(t));
      var h = e.split("|");
      if (h.length > 1) {
        for (var l = 0; l < h.length; l++)
          this.addAttribute(h[l], t, i, n, a);
        return this;
      }
      var f = this.buffers.indexOf(t);
      return f === -1 && (this.buffers.push(t), f = this.buffers.length - 1), this.attributes[e] = new Us(f, i, n, a, o, s, u), this.instanced = this.instanced || u, this;
    }, r.prototype.getAttribute = function(e) {
      return this.attributes[e];
    }, r.prototype.getBuffer = function(e) {
      return this.buffers[this.getAttribute(e).buffer];
    }, r.prototype.addIndex = function(e) {
      return e instanceof Ot || (e instanceof Array && (e = new Uint16Array(e)), e = new Ot(e)), e.type = he.ELEMENT_ARRAY_BUFFER, this.indexBuffer = e, this.buffers.indexOf(e) === -1 && this.buffers.push(e), this;
    }, r.prototype.getIndex = function() {
      return this.indexBuffer;
    }, r.prototype.interleave = function() {
      if (this.buffers.length === 1 || this.buffers.length === 2 && this.indexBuffer)
        return this;
      var e = [], t = [], i = new Ot(), n;
      for (n in this.attributes) {
        var a = this.attributes[n], o = this.buffers[a.buffer];
        e.push(o.data), t.push(a.size * Gs[a.type] / 4), a.buffer = 0;
      }
      for (i.data = xy(e, t), n = 0; n < this.buffers.length; n++)
        this.buffers[n] !== this.indexBuffer && this.buffers[n].destroy();
      return this.buffers = [i], this.indexBuffer && this.buffers.push(this.indexBuffer), this;
    }, r.prototype.getSize = function() {
      for (var e in this.attributes) {
        var t = this.attributes[e], i = this.buffers[t.buffer];
        return i.data.length / (t.stride / 4 || t.size);
      }
      return 0;
    }, r.prototype.dispose = function() {
      this.disposeRunner.emit(this, !1);
    }, r.prototype.destroy = function() {
      this.dispose(), this.buffers = null, this.indexBuffer = null, this.attributes = null;
    }, r.prototype.clone = function() {
      for (var e = new r(), t = 0; t < this.buffers.length; t++)
        e.buffers[t] = new Ot(this.buffers[t].data.slice(0));
      for (var t in this.attributes) {
        var i = this.attributes[t];
        e.attributes[t] = new Us(i.buffer, i.size, i.normalized, i.type, i.stride, i.start, i.instance);
      }
      return this.indexBuffer && (e.indexBuffer = e.buffers[this.buffers.indexOf(this.indexBuffer)], e.indexBuffer.type = he.ELEMENT_ARRAY_BUFFER), e;
    }, r.merge = function(e) {
      for (var t = new r(), i = [], n = [], a = [], o, s = 0; s < e.length; s++) {
        o = e[s];
        for (var u = 0; u < o.buffers.length; u++)
          n[u] = n[u] || 0, n[u] += o.buffers[u].data.length, a[u] = 0;
      }
      for (var s = 0; s < o.buffers.length; s++)
        i[s] = new Sy[xh(o.buffers[s].data)](n[s]), t.buffers[s] = new Ot(i[s]);
      for (var s = 0; s < e.length; s++) {
        o = e[s];
        for (var u = 0; u < o.buffers.length; u++)
          i[u].set(o.buffers[u].data, a[u]), a[u] += o.buffers[u].data.length;
      }
      if (t.attributes = o.attributes, o.indexBuffer) {
        t.indexBuffer = t.buffers[o.buffers.indexOf(o.indexBuffer)], t.indexBuffer.type = he.ELEMENT_ARRAY_BUFFER;
        for (var h = 0, l = 0, f = 0, c = 0, s = 0; s < o.buffers.length; s++)
          if (o.buffers[s] !== o.indexBuffer) {
            c = s;
            break;
          }
        for (var s in o.attributes) {
          var d = o.attributes[s];
          (d.buffer | 0) === c && (l += d.size * Gs[d.type] / 4);
        }
        for (var s = 0; s < e.length; s++) {
          for (var p = e[s].indexBuffer.data, u = 0; u < p.length; u++)
            t.indexBuffer.data[u + f] += h;
          h += e[s].buffers[c].data.length / l, f += p.length;
        }
      }
      return t;
    }, r;
  }()
), Py = (
  /** @class */
  function(r) {
    vt(e, r);
    function e() {
      var t = r.call(this) || this;
      return t.addAttribute("aVertexPosition", new Float32Array([
        0,
        0,
        1,
        0,
        1,
        1,
        0,
        1
      ])).addIndex([0, 1, 3, 2]), t;
    }
    return e;
  }(ui)
), Mh = (
  /** @class */
  function(r) {
    vt(e, r);
    function e() {
      var t = r.call(this) || this;
      return t.vertices = new Float32Array([
        -1,
        -1,
        1,
        -1,
        1,
        1,
        -1,
        1
      ]), t.uvs = new Float32Array([
        0,
        0,
        1,
        0,
        1,
        1,
        0,
        1
      ]), t.vertexBuffer = new Ot(t.vertices), t.uvBuffer = new Ot(t.uvs), t.addAttribute("aVertexPosition", t.vertexBuffer).addAttribute("aTextureCoord", t.uvBuffer).addIndex([0, 1, 2, 0, 2, 3]), t;
    }
    return e.prototype.map = function(t, i) {
      var n = 0, a = 0;
      return this.uvs[0] = n, this.uvs[1] = a, this.uvs[2] = n + i.width / t.width, this.uvs[3] = a, this.uvs[4] = n + i.width / t.width, this.uvs[5] = a + i.height / t.height, this.uvs[6] = n, this.uvs[7] = a + i.height / t.height, n = i.x, a = i.y, this.vertices[0] = n, this.vertices[1] = a, this.vertices[2] = n + i.width, this.vertices[3] = a, this.vertices[4] = n + i.width, this.vertices[5] = a + i.height, this.vertices[6] = n, this.vertices[7] = a + i.height, this.invalidate(), this;
    }, e.prototype.invalidate = function() {
      return this.vertexBuffer._updateID++, this.uvBuffer._updateID++, this;
    }, e;
  }(ui)
), Ay = 0, tr = (
  /** @class */
  function() {
    function r(e, t, i) {
      this.group = !0, this.syncUniforms = {}, this.dirtyId = 0, this.id = Ay++, this.static = !!t, this.ubo = !!i, e instanceof Ot ? (this.buffer = e, this.buffer.type = he.UNIFORM_BUFFER, this.autoManage = !1, this.ubo = !0) : (this.uniforms = e, this.ubo && (this.buffer = new Ot(new Float32Array(1)), this.buffer.type = he.UNIFORM_BUFFER, this.autoManage = !0));
    }
    return r.prototype.update = function() {
      this.dirtyId++, !this.autoManage && this.buffer && this.buffer.update();
    }, r.prototype.add = function(e, t, i) {
      if (!this.ubo)
        this.uniforms[e] = new r(t, i);
      else
        throw new Error("[UniformGroup] uniform groups in ubo mode cannot be modified, or have uniform groups nested in them");
    }, r.from = function(e, t, i) {
      return new r(e, t, i);
    }, r.uboFrom = function(e, t) {
      return new r(e, t ?? !0, !0);
    }, r;
  }()
), Ry = (
  /** @class */
  function() {
    function r() {
      this.renderTexture = null, this.target = null, this.legacy = !1, this.resolution = 1, this.multisample = gt.NONE, this.sourceFrame = new it(), this.destinationFrame = new it(), this.bindingSourceFrame = new it(), this.bindingDestinationFrame = new it(), this.filters = [], this.transform = null;
    }
    return r.prototype.clear = function() {
      this.target = null, this.filters = null, this.renderTexture = null;
    }, r;
  }()
), xi = [new yt(), new yt(), new yt(), new yt()], Gn = new It(), Oy = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.defaultFilterStack = [{}], this.texturePool = new by(), this.texturePool.setScreenSize(e.view), this.statePool = [], this.quad = new Py(), this.quadUv = new Mh(), this.tempRect = new it(), this.activeState = {}, this.globalUniforms = new tr({
        outputFrame: new it(),
        inputSize: new Float32Array(4),
        inputPixel: new Float32Array(4),
        inputClamp: new Float32Array(4),
        resolution: 1,
        // legacy variables
        filterArea: new Float32Array(4),
        filterClamp: new Float32Array(4)
      }, !0), this.forceClear = !1, this.useMaxPadding = !1;
    }
    return r.prototype.push = function(e, t) {
      for (var i, n, a = this.renderer, o = this.defaultFilterStack, s = this.statePool.pop() || new Ry(), u = this.renderer.renderTexture, h = t[0].resolution, l = t[0].multisample, f = t[0].padding, c = t[0].autoFit, d = (i = t[0].legacy) !== null && i !== void 0 ? i : !0, p = 1; p < t.length; p++) {
        var v = t[p];
        h = Math.min(h, v.resolution), l = Math.min(l, v.multisample), f = this.useMaxPadding ? Math.max(f, v.padding) : f + v.padding, c = c && v.autoFit, d = d || ((n = v.legacy) !== null && n !== void 0 ? n : !0);
      }
      o.length === 1 && (this.defaultFilterStack[0].renderTexture = u.current), o.push(s), s.resolution = h, s.multisample = l, s.legacy = d, s.target = e, s.sourceFrame.copyFrom(e.filterArea || e.getBounds(!0)), s.sourceFrame.pad(f);
      var _ = this.tempRect.copyFrom(u.sourceFrame);
      a.projection.transform && this.transformAABB(Gn.copyFrom(a.projection.transform).invert(), _), c ? (s.sourceFrame.fit(_), (s.sourceFrame.width <= 0 || s.sourceFrame.height <= 0) && (s.sourceFrame.width = 0, s.sourceFrame.height = 0)) : s.sourceFrame.intersects(_) || (s.sourceFrame.width = 0, s.sourceFrame.height = 0), this.roundFrame(s.sourceFrame, u.current ? u.current.resolution : a.resolution, u.sourceFrame, u.destinationFrame, a.projection.transform), s.renderTexture = this.getOptimalFilterTexture(s.sourceFrame.width, s.sourceFrame.height, h, l), s.filters = t, s.destinationFrame.width = s.renderTexture.width, s.destinationFrame.height = s.renderTexture.height;
      var y = this.tempRect;
      y.x = 0, y.y = 0, y.width = s.sourceFrame.width, y.height = s.sourceFrame.height, s.renderTexture.filterFrame = s.sourceFrame, s.bindingSourceFrame.copyFrom(u.sourceFrame), s.bindingDestinationFrame.copyFrom(u.destinationFrame), s.transform = a.projection.transform, a.projection.transform = null, u.bind(s.renderTexture, s.sourceFrame, y), a.framebuffer.clear(0, 0, 0, 0);
    }, r.prototype.pop = function() {
      var e = this.defaultFilterStack, t = e.pop(), i = t.filters;
      this.activeState = t;
      var n = this.globalUniforms.uniforms;
      n.outputFrame = t.sourceFrame, n.resolution = t.resolution;
      var a = n.inputSize, o = n.inputPixel, s = n.inputClamp;
      if (a[0] = t.destinationFrame.width, a[1] = t.destinationFrame.height, a[2] = 1 / a[0], a[3] = 1 / a[1], o[0] = Math.round(a[0] * t.resolution), o[1] = Math.round(a[1] * t.resolution), o[2] = 1 / o[0], o[3] = 1 / o[1], s[0] = 0.5 * o[2], s[1] = 0.5 * o[3], s[2] = t.sourceFrame.width * a[2] - 0.5 * o[2], s[3] = t.sourceFrame.height * a[3] - 0.5 * o[3], t.legacy) {
        var u = n.filterArea;
        u[0] = t.destinationFrame.width, u[1] = t.destinationFrame.height, u[2] = t.sourceFrame.x, u[3] = t.sourceFrame.y, n.filterClamp = n.inputClamp;
      }
      this.globalUniforms.update();
      var h = e[e.length - 1];
      if (this.renderer.framebuffer.blit(), i.length === 1)
        i[0].apply(this, t.renderTexture, h.renderTexture, Zt.BLEND, t), this.returnFilterTexture(t.renderTexture);
      else {
        var l = t.renderTexture, f = this.getOptimalFilterTexture(l.width, l.height, t.resolution);
        f.filterFrame = l.filterFrame;
        var c = 0;
        for (c = 0; c < i.length - 1; ++c) {
          c === 1 && t.multisample > 1 && (f = this.getOptimalFilterTexture(l.width, l.height, t.resolution), f.filterFrame = l.filterFrame), i[c].apply(this, l, f, Zt.CLEAR, t);
          var d = l;
          l = f, f = d;
        }
        i[c].apply(this, l, h.renderTexture, Zt.BLEND, t), c > 1 && t.multisample > 1 && this.returnFilterTexture(t.renderTexture), this.returnFilterTexture(l), this.returnFilterTexture(f);
      }
      t.clear(), this.statePool.push(t);
    }, r.prototype.bindAndClear = function(e, t) {
      t === void 0 && (t = Zt.CLEAR);
      var i = this.renderer, n = i.renderTexture, a = i.state;
      if (e === this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture ? this.renderer.projection.transform = this.activeState.transform : this.renderer.projection.transform = null, e && e.filterFrame) {
        var o = this.tempRect;
        o.x = 0, o.y = 0, o.width = e.filterFrame.width, o.height = e.filterFrame.height, n.bind(e, e.filterFrame, o);
      } else
        e !== this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture ? n.bind(e) : this.renderer.renderTexture.bind(e, this.activeState.bindingSourceFrame, this.activeState.bindingDestinationFrame);
      var s = a.stateId & 1 || this.forceClear;
      (t === Zt.CLEAR || t === Zt.BLIT && s) && this.renderer.framebuffer.clear(0, 0, 0, 0);
    }, r.prototype.applyFilter = function(e, t, i, n) {
      var a = this.renderer;
      a.state.set(e.state), this.bindAndClear(i, n), e.uniforms.uSampler = t, e.uniforms.filterGlobals = this.globalUniforms, a.shader.bind(e), e.legacy = !!e.program.attributeData.aTextureCoord, e.legacy ? (this.quadUv.map(t._frame, t.filterFrame), a.geometry.bind(this.quadUv), a.geometry.draw($t.TRIANGLES)) : (a.geometry.bind(this.quad), a.geometry.draw($t.TRIANGLE_STRIP));
    }, r.prototype.calculateSpriteMatrix = function(e, t) {
      var i = this.activeState, n = i.sourceFrame, a = i.destinationFrame, o = t._texture.orig, s = e.set(a.width, 0, 0, a.height, n.x, n.y), u = t.worldTransform.copyTo(It.TEMP_MATRIX);
      return u.invert(), s.prepend(u), s.scale(1 / o.width, 1 / o.height), s.translate(t.anchor.x, t.anchor.y), s;
    }, r.prototype.destroy = function() {
      this.renderer = null, this.texturePool.clear(!1);
    }, r.prototype.getOptimalFilterTexture = function(e, t, i, n) {
      return i === void 0 && (i = 1), n === void 0 && (n = gt.NONE), this.texturePool.getOptimalTexture(e, t, i, n);
    }, r.prototype.getFilterTexture = function(e, t, i) {
      if (typeof e == "number") {
        var n = e;
        e = t, t = n;
      }
      e = e || this.activeState.renderTexture;
      var a = this.texturePool.getOptimalTexture(e.width, e.height, t || e.resolution, i || gt.NONE);
      return a.filterFrame = e.filterFrame, a;
    }, r.prototype.returnFilterTexture = function(e) {
      this.texturePool.returnTexture(e);
    }, r.prototype.emptyPool = function() {
      this.texturePool.clear(!0);
    }, r.prototype.resize = function() {
      this.texturePool.setScreenSize(this.renderer.view);
    }, r.prototype.transformAABB = function(e, t) {
      var i = xi[0], n = xi[1], a = xi[2], o = xi[3];
      i.set(t.left, t.top), n.set(t.left, t.bottom), a.set(t.right, t.top), o.set(t.right, t.bottom), e.apply(i, i), e.apply(n, n), e.apply(a, a), e.apply(o, o);
      var s = Math.min(i.x, n.x, a.x, o.x), u = Math.min(i.y, n.y, a.y, o.y), h = Math.max(i.x, n.x, a.x, o.x), l = Math.max(i.y, n.y, a.y, o.y);
      t.x = s, t.y = u, t.width = h - s, t.height = l - u;
    }, r.prototype.roundFrame = function(e, t, i, n, a) {
      if (!(e.width <= 0 || e.height <= 0 || i.width <= 0 || i.height <= 0)) {
        if (a) {
          var o = a.a, s = a.b, u = a.c, h = a.d;
          if ((Math.abs(s) > 1e-4 || Math.abs(u) > 1e-4) && (Math.abs(o) > 1e-4 || Math.abs(h) > 1e-4))
            return;
        }
        a = a ? Gn.copyFrom(a) : Gn.identity(), a.translate(-i.x, -i.y).scale(n.width / i.width, n.height / i.height).translate(n.x, n.y), this.transformAABB(a, e), e.ceil(t), this.transformAABB(a.invert(), e);
      }
    }, r;
  }()
), mn = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e;
    }
    return r.prototype.flush = function() {
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r.prototype.start = function() {
    }, r.prototype.stop = function() {
      this.flush();
    }, r.prototype.render = function(e) {
    }, r;
  }()
), Iy = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.emptyRenderer = new mn(e), this.currentRenderer = this.emptyRenderer;
    }
    return r.prototype.setObjectRenderer = function(e) {
      this.currentRenderer !== e && (this.currentRenderer.stop(), this.currentRenderer = e, this.currentRenderer.start());
    }, r.prototype.flush = function() {
      this.setObjectRenderer(this.emptyRenderer);
    }, r.prototype.reset = function() {
      this.setObjectRenderer(this.emptyRenderer);
    }, r.prototype.copyBoundTextures = function(e, t) {
      for (var i = this.renderer.texture.boundTextures, n = t - 1; n >= 0; --n)
        e[n] = i[n] || null, e[n] && (e[n]._batchLocation = n);
    }, r.prototype.boundArray = function(e, t, i, n) {
      for (var a = e.elements, o = e.ids, s = e.count, u = 0, h = 0; h < s; h++) {
        var l = a[h], f = l._batchLocation;
        if (f >= 0 && f < n && t[f] === l) {
          o[h] = f;
          continue;
        }
        for (; u < n; ) {
          var c = t[u];
          if (c && c._batchEnabled === i && c._batchLocation === u) {
            u++;
            continue;
          }
          o[h] = u, l._batchLocation = u, t[u] = l;
          break;
        }
      }
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), ks = 0, Cy = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.webGLVersion = 1, this.extensions = {}, this.supports = {
        uint32Indices: !1
      }, this.handleContextLost = this.handleContextLost.bind(this), this.handleContextRestored = this.handleContextRestored.bind(this), e.view.addEventListener("webglcontextlost", this.handleContextLost, !1), e.view.addEventListener("webglcontextrestored", this.handleContextRestored, !1);
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
    }), r.prototype.contextChange = function(e) {
      this.gl = e, this.renderer.gl = e, this.renderer.CONTEXT_UID = ks++;
    }, r.prototype.initFromContext = function(e) {
      this.gl = e, this.validateContext(e), this.renderer.gl = e, this.renderer.CONTEXT_UID = ks++, this.renderer.runners.contextChange.emit(e);
    }, r.prototype.initFromOptions = function(e) {
      var t = this.createContext(this.renderer.view, e);
      this.initFromContext(t);
    }, r.prototype.createContext = function(e, t) {
      var i;
      if (U.PREFER_ENV >= be.WEBGL2 && (i = e.getContext("webgl2", t)), i)
        this.webGLVersion = 2;
      else if (this.webGLVersion = 1, i = e.getContext("webgl", t) || e.getContext("experimental-webgl", t), !i)
        throw new Error("This browser does not support WebGL. Try using the canvas renderer");
      return this.gl = i, this.getExtensions(), this.gl;
    }, r.prototype.getExtensions = function() {
      var e = this.gl, t = {
        loseContext: e.getExtension("WEBGL_lose_context"),
        anisotropicFiltering: e.getExtension("EXT_texture_filter_anisotropic"),
        floatTextureLinear: e.getExtension("OES_texture_float_linear"),
        s3tc: e.getExtension("WEBGL_compressed_texture_s3tc"),
        s3tc_sRGB: e.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
        etc: e.getExtension("WEBGL_compressed_texture_etc"),
        etc1: e.getExtension("WEBGL_compressed_texture_etc1"),
        pvrtc: e.getExtension("WEBGL_compressed_texture_pvrtc") || e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
        atc: e.getExtension("WEBGL_compressed_texture_atc"),
        astc: e.getExtension("WEBGL_compressed_texture_astc")
      };
      this.webGLVersion === 1 ? Object.assign(this.extensions, t, {
        drawBuffers: e.getExtension("WEBGL_draw_buffers"),
        depthTexture: e.getExtension("WEBGL_depth_texture"),
        vertexArrayObject: e.getExtension("OES_vertex_array_object") || e.getExtension("MOZ_OES_vertex_array_object") || e.getExtension("WEBKIT_OES_vertex_array_object"),
        uint32ElementIndex: e.getExtension("OES_element_index_uint"),
        // Floats and half-floats
        floatTexture: e.getExtension("OES_texture_float"),
        floatTextureLinear: e.getExtension("OES_texture_float_linear"),
        textureHalfFloat: e.getExtension("OES_texture_half_float"),
        textureHalfFloatLinear: e.getExtension("OES_texture_half_float_linear")
      }) : this.webGLVersion === 2 && Object.assign(this.extensions, t, {
        // Floats and half-floats
        colorBufferFloat: e.getExtension("EXT_color_buffer_float")
      });
    }, r.prototype.handleContextLost = function(e) {
      var t = this;
      e.preventDefault(), setTimeout(function() {
        t.gl.isContextLost() && t.extensions.loseContext && t.extensions.loseContext.restoreContext();
      }, 0);
    }, r.prototype.handleContextRestored = function() {
      this.renderer.runners.contextChange.emit(this.gl);
    }, r.prototype.destroy = function() {
      var e = this.renderer.view;
      this.renderer = null, e.removeEventListener("webglcontextlost", this.handleContextLost), e.removeEventListener("webglcontextrestored", this.handleContextRestored), this.gl.useProgram(null), this.extensions.loseContext && this.extensions.loseContext.loseContext();
    }, r.prototype.postrender = function() {
      this.renderer.renderingToScreen && this.gl.flush();
    }, r.prototype.validateContext = function(e) {
      var t = e.getContextAttributes(), i = "WebGL2RenderingContext" in globalThis && e instanceof globalThis.WebGL2RenderingContext;
      i && (this.webGLVersion = 2), t && !t.stencil && console.warn("Provided WebGL context does not have a stencil buffer, masks may not render correctly");
      var n = i || !!e.getExtension("OES_element_index_uint");
      this.supports.uint32Indices = n, n || console.warn("Provided WebGL context does not support 32 index buffer, complex graphics may not render correctly");
    }, r;
  }()
), My = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e) {
      this.framebuffer = e, this.stencil = null, this.dirtyId = -1, this.dirtyFormat = -1, this.dirtySize = -1, this.multisample = gt.NONE, this.msaaBuffer = null, this.blitFramebuffer = null, this.mipLevel = 0;
    }
    return r;
  }()
), Dy = new it(), Fy = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.managedFramebuffers = [], this.unknownFramebuffer = new Na(10, 10), this.msaaSamples = null;
    }
    return r.prototype.contextChange = function() {
      this.disposeAll(!0);
      var e = this.gl = this.renderer.gl;
      if (this.CONTEXT_UID = this.renderer.CONTEXT_UID, this.current = this.unknownFramebuffer, this.viewport = new it(), this.hasMRT = !0, this.writeDepthTexture = !0, this.renderer.context.webGLVersion === 1) {
        var t = this.renderer.context.extensions.drawBuffers, i = this.renderer.context.extensions.depthTexture;
        U.PREFER_ENV === be.WEBGL_LEGACY && (t = null, i = null), t ? e.drawBuffers = function(n) {
          return t.drawBuffersWEBGL(n);
        } : (this.hasMRT = !1, e.drawBuffers = function() {
        }), i || (this.writeDepthTexture = !1);
      } else
        this.msaaSamples = e.getInternalformatParameter(e.RENDERBUFFER, e.RGBA8, e.SAMPLES);
    }, r.prototype.bind = function(e, t, i) {
      i === void 0 && (i = 0);
      var n = this.gl;
      if (e) {
        var a = e.glFramebuffers[this.CONTEXT_UID] || this.initFramebuffer(e);
        this.current !== e && (this.current = e, n.bindFramebuffer(n.FRAMEBUFFER, a.framebuffer)), a.mipLevel !== i && (e.dirtyId++, e.dirtyFormat++, a.mipLevel = i), a.dirtyId !== e.dirtyId && (a.dirtyId = e.dirtyId, a.dirtyFormat !== e.dirtyFormat ? (a.dirtyFormat = e.dirtyFormat, a.dirtySize = e.dirtySize, this.updateFramebuffer(e, i)) : a.dirtySize !== e.dirtySize && (a.dirtySize = e.dirtySize, this.resizeFramebuffer(e)));
        for (var o = 0; o < e.colorTextures.length; o++) {
          var s = e.colorTextures[o];
          this.renderer.texture.unbind(s.parentTextureArray || s);
        }
        if (e.depthTexture && this.renderer.texture.unbind(e.depthTexture), t) {
          var u = t.width >> i, h = t.height >> i, l = u / t.width;
          this.setViewport(t.x * l, t.y * l, u, h);
        } else {
          var u = e.width >> i, h = e.height >> i;
          this.setViewport(0, 0, u, h);
        }
      } else
        this.current && (this.current = null, n.bindFramebuffer(n.FRAMEBUFFER, null)), t ? this.setViewport(t.x, t.y, t.width, t.height) : this.setViewport(0, 0, this.renderer.width, this.renderer.height);
    }, r.prototype.setViewport = function(e, t, i, n) {
      var a = this.viewport;
      e = Math.round(e), t = Math.round(t), i = Math.round(i), n = Math.round(n), (a.width !== i || a.height !== n || a.x !== e || a.y !== t) && (a.x = e, a.y = t, a.width = i, a.height = n, this.gl.viewport(e, t, i, n));
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
    }), r.prototype.clear = function(e, t, i, n, a) {
      a === void 0 && (a = Zi.COLOR | Zi.DEPTH);
      var o = this.gl;
      o.clearColor(e, t, i, n), o.clear(a);
    }, r.prototype.initFramebuffer = function(e) {
      var t = this.gl, i = new My(t.createFramebuffer());
      return i.multisample = this.detectSamples(e.multisample), e.glFramebuffers[this.CONTEXT_UID] = i, this.managedFramebuffers.push(e), e.disposeRunner.add(this), i;
    }, r.prototype.resizeFramebuffer = function(e) {
      var t = this.gl, i = e.glFramebuffers[this.CONTEXT_UID];
      i.msaaBuffer && (t.bindRenderbuffer(t.RENDERBUFFER, i.msaaBuffer), t.renderbufferStorageMultisample(t.RENDERBUFFER, i.multisample, t.RGBA8, e.width, e.height)), i.stencil && (t.bindRenderbuffer(t.RENDERBUFFER, i.stencil), i.msaaBuffer ? t.renderbufferStorageMultisample(t.RENDERBUFFER, i.multisample, t.DEPTH24_STENCIL8, e.width, e.height) : t.renderbufferStorage(t.RENDERBUFFER, t.DEPTH_STENCIL, e.width, e.height));
      var n = e.colorTextures, a = n.length;
      t.drawBuffers || (a = Math.min(a, 1));
      for (var o = 0; o < a; o++) {
        var s = n[o], u = s.parentTextureArray || s;
        this.renderer.texture.bind(u, 0);
      }
      e.depthTexture && this.writeDepthTexture && this.renderer.texture.bind(e.depthTexture, 0);
    }, r.prototype.updateFramebuffer = function(e, t) {
      var i = this.gl, n = e.glFramebuffers[this.CONTEXT_UID], a = e.colorTextures, o = a.length;
      i.drawBuffers || (o = Math.min(o, 1)), n.multisample > 1 && this.canMultisampleFramebuffer(e) ? (n.msaaBuffer = n.msaaBuffer || i.createRenderbuffer(), i.bindRenderbuffer(i.RENDERBUFFER, n.msaaBuffer), i.renderbufferStorageMultisample(i.RENDERBUFFER, n.multisample, i.RGBA8, e.width, e.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.RENDERBUFFER, n.msaaBuffer)) : n.msaaBuffer && (i.deleteRenderbuffer(n.msaaBuffer), n.msaaBuffer = null, n.blitFramebuffer && (n.blitFramebuffer.dispose(), n.blitFramebuffer = null));
      for (var s = [], u = 0; u < o; u++) {
        var h = a[u], l = h.parentTextureArray || h;
        this.renderer.texture.bind(l, 0), !(u === 0 && n.msaaBuffer) && (i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + u, h.target, l._glTextures[this.CONTEXT_UID].texture, t), s.push(i.COLOR_ATTACHMENT0 + u));
      }
      if (s.length > 1 && i.drawBuffers(s), e.depthTexture) {
        var f = this.writeDepthTexture;
        if (f) {
          var c = e.depthTexture;
          this.renderer.texture.bind(c, 0), i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, c._glTextures[this.CONTEXT_UID].texture, t);
        }
      }
      (e.stencil || e.depth) && !(e.depthTexture && this.writeDepthTexture) ? (n.stencil = n.stencil || i.createRenderbuffer(), i.bindRenderbuffer(i.RENDERBUFFER, n.stencil), n.msaaBuffer ? i.renderbufferStorageMultisample(i.RENDERBUFFER, n.multisample, i.DEPTH24_STENCIL8, e.width, e.height) : i.renderbufferStorage(i.RENDERBUFFER, i.DEPTH_STENCIL, e.width, e.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.RENDERBUFFER, n.stencil)) : n.stencil && (i.deleteRenderbuffer(n.stencil), n.stencil = null);
    }, r.prototype.canMultisampleFramebuffer = function(e) {
      return this.renderer.context.webGLVersion !== 1 && e.colorTextures.length <= 1 && !e.depthTexture;
    }, r.prototype.detectSamples = function(e) {
      var t = this.msaaSamples, i = gt.NONE;
      if (e <= 1 || t === null)
        return i;
      for (var n = 0; n < t.length; n++)
        if (t[n] <= e) {
          i = t[n];
          break;
        }
      return i === 1 && (i = gt.NONE), i;
    }, r.prototype.blit = function(e, t, i) {
      var n = this, a = n.current, o = n.renderer, s = n.gl, u = n.CONTEXT_UID;
      if (o.context.webGLVersion === 2 && a) {
        var h = a.glFramebuffers[u];
        if (h) {
          if (!e) {
            if (!h.msaaBuffer)
              return;
            var l = a.colorTextures[0];
            if (!l)
              return;
            h.blitFramebuffer || (h.blitFramebuffer = new Na(a.width, a.height), h.blitFramebuffer.addColorTexture(0, l)), e = h.blitFramebuffer, e.colorTextures[0] !== l && (e.colorTextures[0] = l, e.dirtyId++, e.dirtyFormat++), (e.width !== a.width || e.height !== a.height) && (e.width = a.width, e.height = a.height, e.dirtyId++, e.dirtySize++);
          }
          t || (t = Dy, t.width = a.width, t.height = a.height), i || (i = t);
          var f = t.width === i.width && t.height === i.height;
          this.bind(e), s.bindFramebuffer(s.READ_FRAMEBUFFER, h.framebuffer), s.blitFramebuffer(t.left, t.top, t.right, t.bottom, i.left, i.top, i.right, i.bottom, s.COLOR_BUFFER_BIT, f ? s.NEAREST : s.LINEAR);
        }
      }
    }, r.prototype.disposeFramebuffer = function(e, t) {
      var i = e.glFramebuffers[this.CONTEXT_UID], n = this.gl;
      if (i) {
        delete e.glFramebuffers[this.CONTEXT_UID];
        var a = this.managedFramebuffers.indexOf(e);
        a >= 0 && this.managedFramebuffers.splice(a, 1), e.disposeRunner.remove(this), t || (n.deleteFramebuffer(i.framebuffer), i.msaaBuffer && n.deleteRenderbuffer(i.msaaBuffer), i.stencil && n.deleteRenderbuffer(i.stencil)), i.blitFramebuffer && i.blitFramebuffer.dispose();
      }
    }, r.prototype.disposeAll = function(e) {
      var t = this.managedFramebuffers;
      this.managedFramebuffers = [];
      for (var i = 0; i < t.length; i++)
        this.disposeFramebuffer(t[i], e);
    }, r.prototype.forceStencil = function() {
      var e = this.current;
      if (e) {
        var t = e.glFramebuffers[this.CONTEXT_UID];
        if (!(!t || t.stencil)) {
          e.stencil = !0;
          var i = e.width, n = e.height, a = this.gl, o = a.createRenderbuffer();
          a.bindRenderbuffer(a.RENDERBUFFER, o), t.msaaBuffer ? a.renderbufferStorageMultisample(a.RENDERBUFFER, t.multisample, a.DEPTH24_STENCIL8, i, n) : a.renderbufferStorage(a.RENDERBUFFER, a.DEPTH_STENCIL, i, n), t.stencil = o, a.framebufferRenderbuffer(a.FRAMEBUFFER, a.DEPTH_STENCIL_ATTACHMENT, a.RENDERBUFFER, o);
        }
      }
    }, r.prototype.reset = function() {
      this.current = this.unknownFramebuffer, this.viewport = new it();
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), kn = { 5126: 4, 5123: 2, 5121: 1 }, Ny = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this._activeGeometry = null, this._activeVao = null, this.hasVao = !0, this.hasInstance = !0, this.canUseUInt32ElementIndex = !1, this.managedGeometries = {};
    }
    return r.prototype.contextChange = function() {
      this.disposeAll(!0);
      var e = this.gl = this.renderer.gl, t = this.renderer.context;
      if (this.CONTEXT_UID = this.renderer.CONTEXT_UID, t.webGLVersion !== 2) {
        var i = this.renderer.context.extensions.vertexArrayObject;
        U.PREFER_ENV === be.WEBGL_LEGACY && (i = null), i ? (e.createVertexArray = function() {
          return i.createVertexArrayOES();
        }, e.bindVertexArray = function(a) {
          return i.bindVertexArrayOES(a);
        }, e.deleteVertexArray = function(a) {
          return i.deleteVertexArrayOES(a);
        }) : (this.hasVao = !1, e.createVertexArray = function() {
          return null;
        }, e.bindVertexArray = function() {
          return null;
        }, e.deleteVertexArray = function() {
          return null;
        });
      }
      if (t.webGLVersion !== 2) {
        var n = e.getExtension("ANGLE_instanced_arrays");
        n ? (e.vertexAttribDivisor = function(a, o) {
          return n.vertexAttribDivisorANGLE(a, o);
        }, e.drawElementsInstanced = function(a, o, s, u, h) {
          return n.drawElementsInstancedANGLE(a, o, s, u, h);
        }, e.drawArraysInstanced = function(a, o, s, u) {
          return n.drawArraysInstancedANGLE(a, o, s, u);
        }) : this.hasInstance = !1;
      }
      this.canUseUInt32ElementIndex = t.webGLVersion === 2 || !!t.extensions.uint32ElementIndex;
    }, r.prototype.bind = function(e, t) {
      t = t || this.renderer.shader.shader;
      var i = this.gl, n = e.glVertexArrayObjects[this.CONTEXT_UID], a = !1;
      n || (this.managedGeometries[e.id] = e, e.disposeRunner.add(this), e.glVertexArrayObjects[this.CONTEXT_UID] = n = {}, a = !0);
      var o = n[t.program.id] || this.initGeometryVao(e, t, a);
      this._activeGeometry = e, this._activeVao !== o && (this._activeVao = o, this.hasVao ? i.bindVertexArray(o) : this.activateVao(e, t.program)), this.updateBuffers();
    }, r.prototype.reset = function() {
      this.unbind();
    }, r.prototype.updateBuffers = function() {
      for (var e = this._activeGeometry, t = this.renderer.buffer, i = 0; i < e.buffers.length; i++) {
        var n = e.buffers[i];
        t.update(n);
      }
    }, r.prototype.checkCompatibility = function(e, t) {
      var i = e.attributes, n = t.attributeData;
      for (var a in n)
        if (!i[a])
          throw new Error('shader and geometry incompatible, geometry missing the "' + a + '" attribute');
    }, r.prototype.getSignature = function(e, t) {
      var i = e.attributes, n = t.attributeData, a = ["g", e.id];
      for (var o in i)
        n[o] && a.push(o, n[o].location);
      return a.join("-");
    }, r.prototype.initGeometryVao = function(e, t, i) {
      i === void 0 && (i = !0);
      var n = this.gl, a = this.CONTEXT_UID, o = this.renderer.buffer, s = t.program;
      s.glPrograms[a] || this.renderer.shader.generateProgram(t), this.checkCompatibility(e, s);
      var u = this.getSignature(e, s), h = e.glVertexArrayObjects[this.CONTEXT_UID], l = h[u];
      if (l)
        return h[s.id] = l, l;
      var f = e.buffers, c = e.attributes, d = {}, p = {};
      for (var v in f)
        d[v] = 0, p[v] = 0;
      for (var v in c)
        !c[v].size && s.attributeData[v] ? c[v].size = s.attributeData[v].size : c[v].size || console.warn("PIXI Geometry attribute '" + v + "' size cannot be determined (likely the bound shader does not have the attribute)"), d[c[v].buffer] += c[v].size * kn[c[v].type];
      for (var v in c) {
        var _ = c[v], y = _.size;
        _.stride === void 0 && (d[_.buffer] === y * kn[_.type] ? _.stride = 0 : _.stride = d[_.buffer]), _.start === void 0 && (_.start = p[_.buffer], p[_.buffer] += y * kn[_.type]);
      }
      l = n.createVertexArray(), n.bindVertexArray(l);
      for (var g = 0; g < f.length; g++) {
        var m = f[g];
        o.bind(m), i && m._glBuffers[a].refCount++;
      }
      return this.activateVao(e, s), this._activeVao = l, h[s.id] = l, h[u] = l, l;
    }, r.prototype.disposeGeometry = function(e, t) {
      var i;
      if (this.managedGeometries[e.id]) {
        delete this.managedGeometries[e.id];
        var n = e.glVertexArrayObjects[this.CONTEXT_UID], a = this.gl, o = e.buffers, s = (i = this.renderer) === null || i === void 0 ? void 0 : i.buffer;
        if (e.disposeRunner.remove(this), !!n) {
          if (s)
            for (var u = 0; u < o.length; u++) {
              var h = o[u]._glBuffers[this.CONTEXT_UID];
              h && (h.refCount--, h.refCount === 0 && !t && s.dispose(o[u], t));
            }
          if (!t) {
            for (var l in n)
              if (l[0] === "g") {
                var f = n[l];
                this._activeVao === f && this.unbind(), a.deleteVertexArray(f);
              }
          }
          delete e.glVertexArrayObjects[this.CONTEXT_UID];
        }
      }
    }, r.prototype.disposeAll = function(e) {
      for (var t = Object.keys(this.managedGeometries), i = 0; i < t.length; i++)
        this.disposeGeometry(this.managedGeometries[t[i]], e);
    }, r.prototype.activateVao = function(e, t) {
      var i = this.gl, n = this.CONTEXT_UID, a = this.renderer.buffer, o = e.buffers, s = e.attributes;
      e.indexBuffer && a.bind(e.indexBuffer);
      var u = null;
      for (var h in s) {
        var l = s[h], f = o[l.buffer], c = f._glBuffers[n];
        if (t.attributeData[h]) {
          u !== c && (a.bind(f), u = c);
          var d = t.attributeData[h].location;
          if (i.enableVertexAttribArray(d), i.vertexAttribPointer(d, l.size, l.type || i.FLOAT, l.normalized, l.stride, l.start), l.instance)
            if (this.hasInstance)
              i.vertexAttribDivisor(d, 1);
            else
              throw new Error("geometry error, GPU Instancing is not supported on this device");
        }
      }
    }, r.prototype.draw = function(e, t, i, n) {
      var a = this.gl, o = this._activeGeometry;
      if (o.indexBuffer) {
        var s = o.indexBuffer.data.BYTES_PER_ELEMENT, u = s === 2 ? a.UNSIGNED_SHORT : a.UNSIGNED_INT;
        s === 2 || s === 4 && this.canUseUInt32ElementIndex ? o.instanced ? a.drawElementsInstanced(e, t || o.indexBuffer.data.length, u, (i || 0) * s, n || 1) : a.drawElements(e, t || o.indexBuffer.data.length, u, (i || 0) * s) : console.warn("unsupported index buffer type: uint32");
      } else
        o.instanced ? a.drawArraysInstanced(e, i, t || o.getSize(), n || 1) : a.drawArrays(e, i, t || o.getSize());
      return this;
    }, r.prototype.unbind = function() {
      this.gl.bindVertexArray(null), this._activeVao = null, this._activeGeometry = null;
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), By = (
  /** @class */
  function() {
    function r(e) {
      e === void 0 && (e = null), this.type = Rt.NONE, this.autoDetect = !0, this.maskObject = e || null, this.pooled = !1, this.isMaskData = !0, this.resolution = null, this.multisample = U.FILTER_MULTISAMPLE, this.enabled = !0, this.colorMask = 15, this._filters = null, this._stencilCounter = 0, this._scissorCounter = 0, this._scissorRect = null, this._scissorRectLocal = null, this._colorMask = 15, this._target = null;
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
      set: function(e) {
        e ? this._filters ? this._filters[0] = e : this._filters = [e] : this._filters = null;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.reset = function() {
      this.pooled && (this.maskObject = null, this.type = Rt.NONE, this.autoDetect = !0), this._target = null, this._scissorRectLocal = null;
    }, r.prototype.copyCountersOrReset = function(e) {
      e ? (this._stencilCounter = e._stencilCounter, this._scissorCounter = e._scissorCounter, this._scissorRect = e._scissorRect) : (this._stencilCounter = 0, this._scissorCounter = 0, this._scissorRect = null);
    }, r;
  }()
);
function Hs(r, e, t) {
  var i = r.createShader(e);
  return r.shaderSource(i, t), r.compileShader(i), i;
}
function Xs(r, e) {
  var t = r.getShaderSource(e).split(`
`).map(function(h, l) {
    return l + ": " + h;
  }), i = r.getShaderInfoLog(e), n = i.split(`
`), a = {}, o = n.map(function(h) {
    return parseFloat(h.replace(/^ERROR\: 0\:([\d]+)\:.*$/, "$1"));
  }).filter(function(h) {
    return h && !a[h] ? (a[h] = !0, !0) : !1;
  }), s = [""];
  o.forEach(function(h) {
    t[h - 1] = "%c" + t[h - 1] + "%c", s.push("background: #FF0000; color:#FFFFFF; font-size: 10px", "font-size: 10px");
  });
  var u = t.join(`
`);
  s[0] = u, console.error(i), console.groupCollapsed("click to view full shader code"), console.warn.apply(console, s), console.groupEnd();
}
function Ly(r, e, t, i) {
  r.getProgramParameter(e, r.LINK_STATUS) || (r.getShaderParameter(t, r.COMPILE_STATUS) || Xs(r, t), r.getShaderParameter(i, r.COMPILE_STATUS) || Xs(r, i), console.error("PixiJS Error: Could not initialize shader."), r.getProgramInfoLog(e) !== "" && console.warn("PixiJS Warning: gl.getProgramInfoLog()", r.getProgramInfoLog(e)));
}
function Hn(r) {
  for (var e = new Array(r), t = 0; t < e.length; t++)
    e[t] = !1;
  return e;
}
function Dh(r, e) {
  switch (r) {
    case "float":
      return 0;
    case "vec2":
      return new Float32Array(2 * e);
    case "vec3":
      return new Float32Array(3 * e);
    case "vec4":
      return new Float32Array(4 * e);
    case "int":
    case "uint":
    case "sampler2D":
    case "sampler2DArray":
      return 0;
    case "ivec2":
      return new Int32Array(2 * e);
    case "ivec3":
      return new Int32Array(3 * e);
    case "ivec4":
      return new Int32Array(4 * e);
    case "uvec2":
      return new Uint32Array(2 * e);
    case "uvec3":
      return new Uint32Array(3 * e);
    case "uvec4":
      return new Uint32Array(4 * e);
    case "bool":
      return !1;
    case "bvec2":
      return Hn(2 * e);
    case "bvec3":
      return Hn(3 * e);
    case "bvec4":
      return Hn(4 * e);
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
var Fh = {}, Nr = Fh;
function Uy() {
  if (Nr === Fh || Nr && Nr.isContextLost()) {
    var r = U.ADAPTER.createCanvas(), e = void 0;
    U.PREFER_ENV >= be.WEBGL2 && (e = r.getContext("webgl2", {})), e || (e = r.getContext("webgl", {}) || r.getContext("experimental-webgl", {}), e ? e.getExtension("WEBGL_draw_buffers") : e = null), Nr = e;
  }
  return Nr;
}
var wi;
function Gy() {
  if (!wi) {
    wi = Xt.MEDIUM;
    var r = Uy();
    if (r && r.getShaderPrecisionFormat) {
      var e = r.getShaderPrecisionFormat(r.FRAGMENT_SHADER, r.HIGH_FLOAT);
      wi = e.precision ? Xt.HIGH : Xt.MEDIUM;
    }
  }
  return wi;
}
function js(r, e, t) {
  if (r.substring(0, 9) !== "precision") {
    var i = e;
    return e === Xt.HIGH && t !== Xt.HIGH && (i = Xt.MEDIUM), "precision " + i + ` float;
` + r;
  } else if (t !== Xt.HIGH && r.substring(0, 15) === "precision highp")
    return r.replace("precision highp", "precision mediump");
  return r;
}
var ky = {
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
function Nh(r) {
  return ky[r];
}
var Si = null, Vs = {
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
function Bh(r, e) {
  if (!Si) {
    var t = Object.keys(Vs);
    Si = {};
    for (var i = 0; i < t.length; ++i) {
      var n = t[i];
      Si[r[n]] = Vs[n];
    }
  }
  return Si[e];
}
var Sr = [
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
    test: function(r, e) {
      return (r.type === "sampler2D" || r.type === "samplerCube" || r.type === "sampler2DArray") && r.size === 1 && !r.isArray && (e == null || e.castToBaseTexture !== void 0);
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
    test: function(r, e) {
      return r.type === "mat3" && r.size === 1 && !r.isArray && e.a !== void 0;
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
    test: function(r, e) {
      return r.type === "vec2" && r.size === 1 && !r.isArray && e.x !== void 0;
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
    test: function(r, e) {
      return r.type === "vec4" && r.size === 1 && !r.isArray && e.width !== void 0;
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
], Hy = {
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
}, Xy = {
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
function jy(r, e) {
  var t, i = [`
        var v = null;
        var cv = null;
        var cu = null;
        var t = 0;
        var gl = renderer.gl;
    `];
  for (var n in r.uniforms) {
    var a = e[n];
    if (!a) {
      !((t = r.uniforms[n]) === null || t === void 0) && t.group && (r.uniforms[n].ubo ? i.push(`
                        renderer.shader.syncUniformBufferGroup(uv.` + n + ", '" + n + `');
                    `) : i.push(`
                        renderer.shader.syncUniformGroup(uv.` + n + `, syncData);
                    `));
      continue;
    }
    for (var o = r.uniforms[n], s = !1, u = 0; u < Sr.length; u++)
      if (Sr[u].test(a, o)) {
        i.push(Sr[u].code(n, o)), s = !0;
        break;
      }
    if (!s) {
      var h = a.size === 1 && !a.isArray ? Hy : Xy, l = h[a.type].replace("location", 'ud["' + n + '"].location');
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
var Vy = [
  "precision mediump float;",
  "void main(void){",
  "float test = 0.1;",
  "%forloop%",
  "gl_FragColor = vec4(0.0);",
  "}"
].join(`
`);
function zy(r) {
  for (var e = "", t = 0; t < r; ++t)
    t > 0 && (e += `
else `), t < r - 1 && (e += "if(test == " + t + ".0){}");
  return e;
}
function Wy(r, e) {
  if (r === 0)
    throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
  for (var t = e.createShader(e.FRAGMENT_SHADER); ; ) {
    var i = Vy.replace(/%forloop%/gi, zy(r));
    if (e.shaderSource(t, i), e.compileShader(t), !e.getShaderParameter(t, e.COMPILE_STATUS))
      r = r / 2 | 0;
    else
      break;
  }
  return r;
}
var Br;
function Yy() {
  if (typeof Br == "boolean")
    return Br;
  try {
    var r = new Function("param1", "param2", "param3", "return param1[param2] === param3;");
    Br = r({ a: "b" }, "a", "b") === !0;
  } catch {
    Br = !1;
  }
  return Br;
}
var qy = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void){
   gl_FragColor *= texture2D(uSampler, vTextureCoord);
}`, Ky = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void){
   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
   vTextureCoord = aTextureCoord;
}
`, Zy = 0, Pi = {}, hi = (
  /** @class */
  function() {
    function r(e, t, i) {
      i === void 0 && (i = "pixi-shader"), this.id = Zy++, this.vertexSrc = e || r.defaultVertexSrc, this.fragmentSrc = t || r.defaultFragmentSrc, this.vertexSrc = this.vertexSrc.trim(), this.fragmentSrc = this.fragmentSrc.trim(), this.vertexSrc.substring(0, 8) !== "#version" && (i = i.replace(/\s+/g, "-"), Pi[i] ? (Pi[i]++, i += "-" + Pi[i]) : Pi[i] = 1, this.vertexSrc = "#define SHADER_NAME " + i + `
` + this.vertexSrc, this.fragmentSrc = "#define SHADER_NAME " + i + `
` + this.fragmentSrc, this.vertexSrc = js(this.vertexSrc, U.PRECISION_VERTEX, Xt.HIGH), this.fragmentSrc = js(this.fragmentSrc, U.PRECISION_FRAGMENT, Gy())), this.glPrograms = {}, this.syncUniforms = null;
    }
    return Object.defineProperty(r, "defaultVertexSrc", {
      /**
       * The default vertex shader source.
       * @constant
       */
      get: function() {
        return Ky;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "defaultFragmentSrc", {
      /**
       * The default fragment shader source.
       * @constant
       */
      get: function() {
        return qy;
      },
      enumerable: !1,
      configurable: !0
    }), r.from = function(e, t, i) {
      var n = e + t, a = Fs[n];
      return a || (Fs[n] = a = new r(e, t, i)), a;
    }, r;
  }()
), Ce = (
  /** @class */
  function() {
    function r(e, t) {
      this.uniformBindCount = 0, this.program = e, t ? t instanceof tr ? this.uniformGroup = t : this.uniformGroup = new tr(t) : this.uniformGroup = new tr({}), this.disposeRunner = new Bt("disposeShader");
    }
    return r.prototype.checkUniformExists = function(e, t) {
      if (t.uniforms[e])
        return !0;
      for (var i in t.uniforms) {
        var n = t.uniforms[i];
        if (n.group && this.checkUniformExists(e, n))
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
    }), r.from = function(e, t, i) {
      var n = hi.from(e, t);
      return new r(n, i);
    }, r;
  }()
), Xn = 0, jn = 1, Vn = 2, zn = 3, Wn = 4, Yn = 5, sr = (
  /** @class */
  function() {
    function r() {
      this.data = 0, this.blendMode = H.NORMAL, this.polygonOffset = 0, this.blend = !0, this.depthMask = !0;
    }
    return Object.defineProperty(r.prototype, "blend", {
      /**
       * Activates blending of the computed fragment color values.
       * @default true
       */
      get: function() {
        return !!(this.data & 1 << Xn);
      },
      set: function(e) {
        !!(this.data & 1 << Xn) !== e && (this.data ^= 1 << Xn);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "offsets", {
      /**
       * Activates adding an offset to depth values of polygon's fragments
       * @default false
       */
      get: function() {
        return !!(this.data & 1 << jn);
      },
      set: function(e) {
        !!(this.data & 1 << jn) !== e && (this.data ^= 1 << jn);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "culling", {
      /**
       * Activates culling of polygons.
       * @default false
       */
      get: function() {
        return !!(this.data & 1 << Vn);
      },
      set: function(e) {
        !!(this.data & 1 << Vn) !== e && (this.data ^= 1 << Vn);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "depthTest", {
      /**
       * Activates depth comparisons and updates to the depth buffer.
       * @default false
       */
      get: function() {
        return !!(this.data & 1 << zn);
      },
      set: function(e) {
        !!(this.data & 1 << zn) !== e && (this.data ^= 1 << zn);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "depthMask", {
      /**
       * Enables or disables writing to the depth buffer.
       * @default true
       */
      get: function() {
        return !!(this.data & 1 << Yn);
      },
      set: function(e) {
        !!(this.data & 1 << Yn) !== e && (this.data ^= 1 << Yn);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "clockwiseFrontFace", {
      /**
       * Specifies whether or not front or back-facing polygons can be culled.
       * @default false
       */
      get: function() {
        return !!(this.data & 1 << Wn);
      },
      set: function(e) {
        !!(this.data & 1 << Wn) !== e && (this.data ^= 1 << Wn);
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
      set: function(e) {
        this.blend = e !== H.NONE, this._blendMode = e;
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
      set: function(e) {
        this.offsets = !!e, this._polygonOffset = e;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.toString = function() {
      return "[@pixi/core:State " + ("blendMode=" + this.blendMode + " ") + ("clockwiseFrontFace=" + this.clockwiseFrontFace + " ") + ("culling=" + this.culling + " ") + ("depthMask=" + this.depthMask + " ") + ("polygonOffset=" + this.polygonOffset) + "]";
    }, r.for2d = function() {
      var e = new r();
      return e.depthTest = !1, e.blend = !0, e;
    }, r;
  }()
), $y = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void){
   gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`, Qy = `attribute vec2 aVertexPosition;

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
`, Le = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t, i, n) {
      var a = this, o = hi.from(t || e.defaultVertexSrc, i || e.defaultFragmentSrc);
      return a = r.call(this, o, n) || this, a.padding = 0, a.resolution = U.FILTER_RESOLUTION, a.multisample = U.FILTER_MULTISAMPLE, a.enabled = !0, a.autoFit = !0, a.state = new sr(), a;
    }
    return e.prototype.apply = function(t, i, n, a, o) {
      t.applyFilter(this, i, n, a);
    }, Object.defineProperty(e.prototype, "blendMode", {
      /**
       * Sets the blend mode of the filter.
       * @default PIXI.BLEND_MODES.NORMAL
       */
      get: function() {
        return this.state.blendMode;
      },
      set: function(t) {
        this.state.blendMode = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "resolution", {
      /**
       * The resolution of the filter. Setting this to be lower will lower the quality but
       * increase the performance of the filter.
       */
      get: function() {
        return this._resolution;
      },
      set: function(t) {
        this._resolution = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e, "defaultVertexSrc", {
      /**
       * The default vertex shader source
       * @constant
       */
      get: function() {
        return Qy;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e, "defaultFragmentSrc", {
      /**
       * The default fragment shader source
       * @constant
       */
      get: function() {
        return $y;
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(Ce)
), Jy = `attribute vec2 aVertexPosition;
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
`, tg = `varying vec2 vMaskCoord;
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
`, zs = new It(), Po = (
  /** @class */
  function() {
    function r(e, t) {
      this._texture = e, this.mapCoord = new It(), this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._textureID = -1, this._updateID = 0, this.clampOffset = 0, this.clampMargin = typeof t > "u" ? 0.5 : t, this.isSimple = !1;
    }
    return Object.defineProperty(r.prototype, "texture", {
      /** Texture property. */
      get: function() {
        return this._texture;
      },
      set: function(e) {
        this._texture = e, this._textureID = -1;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.multiplyUvs = function(e, t) {
      t === void 0 && (t = e);
      for (var i = this.mapCoord, n = 0; n < e.length; n += 2) {
        var a = e[n], o = e[n + 1];
        t[n] = a * i.a + o * i.c + i.tx, t[n + 1] = a * i.b + o * i.d + i.ty;
      }
      return t;
    }, r.prototype.update = function(e) {
      var t = this._texture;
      if (!t || !t.valid || !e && this._textureID === t._updateID)
        return !1;
      this._textureID = t._updateID, this._updateID++;
      var i = t._uvs;
      this.mapCoord.set(i.x1 - i.x0, i.y1 - i.y0, i.x3 - i.x0, i.y3 - i.y0, i.x0, i.y0);
      var n = t.orig, a = t.trim;
      a && (zs.set(n.width / a.width, 0, 0, n.height / a.height, -a.x / a.width, -a.y / a.height), this.mapCoord.append(zs));
      var o = t.baseTexture, s = this.uClampFrame, u = this.clampMargin / o.resolution, h = this.clampOffset;
      return s[0] = (t._frame.x + u + h) / o.width, s[1] = (t._frame.y + u + h) / o.height, s[2] = (t._frame.x + t._frame.width - u + h) / o.width, s[3] = (t._frame.y + t._frame.height - u + h) / o.height, this.uClampOffset[0] = h / o.realWidth, this.uClampOffset[1] = h / o.realHeight, this.isSimple = t._frame.width === o.width && t._frame.height === o.height && t.rotate === 0, !0;
    }, r;
  }()
), eg = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t, i, n) {
      var a = this, o = null;
      return typeof t != "string" && i === void 0 && n === void 0 && (o = t, t = void 0, i = void 0, n = void 0), a = r.call(this, t || Jy, i || tg, n) || this, a.maskSprite = o, a.maskMatrix = new It(), a;
    }
    return Object.defineProperty(e.prototype, "maskSprite", {
      /**
       * Sprite mask
       * @type {PIXI.DisplayObject}
       */
      get: function() {
        return this._maskSprite;
      },
      set: function(t) {
        this._maskSprite = t, this._maskSprite && (this._maskSprite.renderable = !1);
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.apply = function(t, i, n, a) {
      var o = this._maskSprite, s = o._texture;
      s.valid && (s.uvMatrix || (s.uvMatrix = new Po(s, 0)), s.uvMatrix.update(), this.uniforms.npmAlpha = s.baseTexture.alphaMode ? 0 : 1, this.uniforms.mask = s, this.uniforms.otherMatrix = t.calculateSpriteMatrix(this.maskMatrix, o).prepend(s.uvMatrix.mapCoord), this.uniforms.alpha = o.worldAlpha, this.uniforms.maskClamp = s.uvMatrix.uClampFrame, t.applyFilter(this, i, n, a));
    }, e;
  }(Le)
), rg = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.enableScissor = !0, this.alphaMaskPool = [], this.maskDataPool = [], this.maskStack = [], this.alphaMaskIndex = 0;
    }
    return r.prototype.setMaskStack = function(e) {
      this.maskStack = e, this.renderer.scissor.setMaskStack(e), this.renderer.stencil.setMaskStack(e);
    }, r.prototype.push = function(e, t) {
      var i = t;
      if (!i.isMaskData) {
        var n = this.maskDataPool.pop() || new By();
        n.pooled = !0, n.maskObject = t, i = n;
      }
      var a = this.maskStack.length !== 0 ? this.maskStack[this.maskStack.length - 1] : null;
      if (i.copyCountersOrReset(a), i._colorMask = a ? a._colorMask : 15, i.autoDetect && this.detect(i), i._target = e, i.type !== Rt.SPRITE && this.maskStack.push(i), i.enabled)
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
    }, r.prototype.pop = function(e) {
      var t = this.maskStack.pop();
      if (!(!t || t._target !== e)) {
        if (t.enabled)
          switch (t.type) {
            case Rt.SCISSOR:
              this.renderer.scissor.pop(t);
              break;
            case Rt.STENCIL:
              this.renderer.stencil.pop(t.maskObject);
              break;
            case Rt.SPRITE:
              this.popSpriteMask(t);
              break;
            case Rt.COLOR:
              this.popColorMask(t);
              break;
          }
        if (t.reset(), t.pooled && this.maskDataPool.push(t), this.maskStack.length !== 0) {
          var i = this.maskStack[this.maskStack.length - 1];
          i.type === Rt.SPRITE && i._filters && (i._filters[0].maskSprite = i.maskObject);
        }
      }
    }, r.prototype.detect = function(e) {
      var t = e.maskObject;
      t ? t.isSprite ? e.type = Rt.SPRITE : this.enableScissor && this.renderer.scissor.testScissor(e) ? e.type = Rt.SCISSOR : e.type = Rt.STENCIL : e.type = Rt.COLOR;
    }, r.prototype.pushSpriteMask = function(e) {
      var t, i, n = e.maskObject, a = e._target, o = e._filters;
      o || (o = this.alphaMaskPool[this.alphaMaskIndex], o || (o = this.alphaMaskPool[this.alphaMaskIndex] = [new eg()]));
      var s = this.renderer, u = s.renderTexture, h, l;
      if (u.current) {
        var f = u.current;
        h = e.resolution || f.resolution, l = (t = e.multisample) !== null && t !== void 0 ? t : f.multisample;
      } else
        h = e.resolution || s.resolution, l = (i = e.multisample) !== null && i !== void 0 ? i : s.multisample;
      o[0].resolution = h, o[0].multisample = l, o[0].maskSprite = n;
      var c = a.filterArea;
      a.filterArea = n.getBounds(!0), s.filter.push(a, o), a.filterArea = c, e._filters || this.alphaMaskIndex++;
    }, r.prototype.popSpriteMask = function(e) {
      this.renderer.filter.pop(), e._filters ? e._filters[0].maskSprite = null : (this.alphaMaskIndex--, this.alphaMaskPool[this.alphaMaskIndex][0].maskSprite = null);
    }, r.prototype.pushColorMask = function(e) {
      var t = e._colorMask, i = e._colorMask = t & e.colorMask;
      i !== t && this.renderer.gl.colorMask((i & 1) !== 0, (i & 2) !== 0, (i & 4) !== 0, (i & 8) !== 0);
    }, r.prototype.popColorMask = function(e) {
      var t = e._colorMask, i = this.maskStack.length > 0 ? this.maskStack[this.maskStack.length - 1]._colorMask : 15;
      i !== t && this.renderer.gl.colorMask((i & 1) !== 0, (i & 2) !== 0, (i & 4) !== 0, (i & 8) !== 0);
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), Lh = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.maskStack = [], this.glConst = 0;
    }
    return r.prototype.getStackLength = function() {
      return this.maskStack.length;
    }, r.prototype.setMaskStack = function(e) {
      var t = this.renderer.gl, i = this.getStackLength();
      this.maskStack = e;
      var n = this.getStackLength();
      n !== i && (n === 0 ? t.disable(this.glConst) : (t.enable(this.glConst), this._useCurrent()));
    }, r.prototype._useCurrent = function() {
    }, r.prototype.destroy = function() {
      this.renderer = null, this.maskStack = null;
    }, r;
  }()
), Ws = new It(), Ys = [], ig = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t) {
      var i = r.call(this, t) || this;
      return i.glConst = U.ADAPTER.getWebGLRenderingContext().SCISSOR_TEST, i;
    }
    return e.prototype.getStackLength = function() {
      var t = this.maskStack[this.maskStack.length - 1];
      return t ? t._scissorCounter : 0;
    }, e.prototype.calcScissorRect = function(t) {
      var i;
      if (!t._scissorRectLocal) {
        var n = t._scissorRect, a = t.maskObject, o = this.renderer, s = o.renderTexture, u = a.getBounds(!0, (i = Ys.pop()) !== null && i !== void 0 ? i : new it());
        this.roundFrameToPixels(u, s.current ? s.current.resolution : o.resolution, s.sourceFrame, s.destinationFrame, o.projection.transform), n && u.fit(n), t._scissorRectLocal = u;
      }
    }, e.isMatrixRotated = function(t) {
      if (!t)
        return !1;
      var i = t.a, n = t.b, a = t.c, o = t.d;
      return (Math.abs(n) > 1e-4 || Math.abs(a) > 1e-4) && (Math.abs(i) > 1e-4 || Math.abs(o) > 1e-4);
    }, e.prototype.testScissor = function(t) {
      var i = t.maskObject;
      if (!i.isFastRect || !i.isFastRect() || e.isMatrixRotated(i.worldTransform) || e.isMatrixRotated(this.renderer.projection.transform))
        return !1;
      this.calcScissorRect(t);
      var n = t._scissorRectLocal;
      return n.width > 0 && n.height > 0;
    }, e.prototype.roundFrameToPixels = function(t, i, n, a, o) {
      e.isMatrixRotated(o) || (o = o ? Ws.copyFrom(o) : Ws.identity(), o.translate(-n.x, -n.y).scale(a.width / n.width, a.height / n.height).translate(a.x, a.y), this.renderer.filter.transformAABB(o, t), t.fit(a), t.x = Math.round(t.x * i), t.y = Math.round(t.y * i), t.width = Math.round(t.width * i), t.height = Math.round(t.height * i));
    }, e.prototype.push = function(t) {
      t._scissorRectLocal || this.calcScissorRect(t);
      var i = this.renderer.gl;
      t._scissorRect || i.enable(i.SCISSOR_TEST), t._scissorCounter++, t._scissorRect = t._scissorRectLocal, this._useCurrent();
    }, e.prototype.pop = function(t) {
      var i = this.renderer.gl;
      t && Ys.push(t._scissorRectLocal), this.getStackLength() > 0 ? this._useCurrent() : i.disable(i.SCISSOR_TEST);
    }, e.prototype._useCurrent = function() {
      var t = this.maskStack[this.maskStack.length - 1]._scissorRect, i;
      this.renderer.renderTexture.current ? i = t.y : i = this.renderer.height - t.height - t.y, this.renderer.gl.scissor(t.x, i, t.width, t.height);
    }, e;
  }(Lh)
), ng = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t) {
      var i = r.call(this, t) || this;
      return i.glConst = U.ADAPTER.getWebGLRenderingContext().STENCIL_TEST, i;
    }
    return e.prototype.getStackLength = function() {
      var t = this.maskStack[this.maskStack.length - 1];
      return t ? t._stencilCounter : 0;
    }, e.prototype.push = function(t) {
      var i = t.maskObject, n = this.renderer.gl, a = t._stencilCounter;
      a === 0 && (this.renderer.framebuffer.forceStencil(), n.clearStencil(0), n.clear(n.STENCIL_BUFFER_BIT), n.enable(n.STENCIL_TEST)), t._stencilCounter++;
      var o = t._colorMask;
      o !== 0 && (t._colorMask = 0, n.colorMask(!1, !1, !1, !1)), n.stencilFunc(n.EQUAL, a, 4294967295), n.stencilOp(n.KEEP, n.KEEP, n.INCR), i.renderable = !0, i.render(this.renderer), this.renderer.batch.flush(), i.renderable = !1, o !== 0 && (t._colorMask = o, n.colorMask((o & 1) !== 0, (o & 2) !== 0, (o & 4) !== 0, (o & 8) !== 0)), this._useCurrent();
    }, e.prototype.pop = function(t) {
      var i = this.renderer.gl;
      if (this.getStackLength() === 0)
        i.disable(i.STENCIL_TEST);
      else {
        var n = this.maskStack.length !== 0 ? this.maskStack[this.maskStack.length - 1] : null, a = n ? n._colorMask : 15;
        a !== 0 && (n._colorMask = 0, i.colorMask(!1, !1, !1, !1)), i.stencilOp(i.KEEP, i.KEEP, i.DECR), t.renderable = !0, t.render(this.renderer), this.renderer.batch.flush(), t.renderable = !1, a !== 0 && (n._colorMask = a, i.colorMask((a & 1) !== 0, (a & 2) !== 0, (a & 4) !== 0, (a & 8) !== 0)), this._useCurrent();
      }
    }, e.prototype._useCurrent = function() {
      var t = this.renderer.gl;
      t.stencilFunc(t.EQUAL, this.getStackLength(), 4294967295), t.stencilOp(t.KEEP, t.KEEP, t.KEEP);
    }, e;
  }(Lh)
), ag = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.destinationFrame = null, this.sourceFrame = null, this.defaultFrame = null, this.projectionMatrix = new It(), this.transform = null;
    }
    return r.prototype.update = function(e, t, i, n) {
      this.destinationFrame = e || this.destinationFrame || this.defaultFrame, this.sourceFrame = t || this.sourceFrame || e, this.calculateProjection(this.destinationFrame, this.sourceFrame, i, n), this.transform && this.projectionMatrix.append(this.transform);
      var a = this.renderer;
      a.globalUniforms.uniforms.projectionMatrix = this.projectionMatrix, a.globalUniforms.update(), a.shader.shader && a.shader.syncUniformGroup(a.shader.shader.uniforms.globals);
    }, r.prototype.calculateProjection = function(e, t, i, n) {
      var a = this.projectionMatrix, o = n ? -1 : 1;
      a.identity(), a.a = 1 / t.width * 2, a.d = o * (1 / t.height * 2), a.tx = -1 - t.x * a.a, a.ty = -o - t.y * a.d;
    }, r.prototype.setTransform = function(e) {
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), Ge = new it(), Lr = new it(), og = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.clearColor = e._backgroundColorRgba, this.defaultMaskStack = [], this.current = null, this.sourceFrame = new it(), this.destinationFrame = new it(), this.viewportFrame = new it();
    }
    return r.prototype.bind = function(e, t, i) {
      e === void 0 && (e = null);
      var n = this.renderer;
      this.current = e;
      var a, o, s;
      e ? (a = e.baseTexture, s = a.resolution, t || (Ge.width = e.frame.width, Ge.height = e.frame.height, t = Ge), i || (Lr.x = e.frame.x, Lr.y = e.frame.y, Lr.width = t.width, Lr.height = t.height, i = Lr), o = a.framebuffer) : (s = n.resolution, t || (Ge.width = n.screen.width, Ge.height = n.screen.height, t = Ge), i || (i = Ge, i.width = t.width, i.height = t.height));
      var u = this.viewportFrame;
      u.x = i.x * s, u.y = i.y * s, u.width = i.width * s, u.height = i.height * s, e || (u.y = n.view.height - (u.y + u.height)), u.ceil(), this.renderer.framebuffer.bind(o, u), this.renderer.projection.update(i, t, s, !o), e ? this.renderer.mask.setMaskStack(a.maskStack) : this.renderer.mask.setMaskStack(this.defaultMaskStack), this.sourceFrame.copyFrom(t), this.destinationFrame.copyFrom(i);
    }, r.prototype.clear = function(e, t) {
      this.current ? e = e || this.current.baseTexture.clearColor : e = e || this.clearColor;
      var i = this.destinationFrame, n = this.current ? this.current.baseTexture : this.renderer.screen, a = i.width !== n.width || i.height !== n.height;
      if (a) {
        var o = this.viewportFrame, s = o.x, u = o.y, h = o.width, l = o.height;
        s = Math.round(s), u = Math.round(u), h = Math.round(h), l = Math.round(l), this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST), this.renderer.gl.scissor(s, u, h, l);
      }
      this.renderer.framebuffer.clear(e[0], e[1], e[2], e[3], t), a && this.renderer.scissor.pop();
    }, r.prototype.resize = function() {
      this.bind(null);
    }, r.prototype.reset = function() {
      this.bind(null);
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
);
function sg(r, e, t, i, n) {
  t.buffer.update(n);
}
var ug = {
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
}, Uh = {
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
function hg(r) {
  for (var e = r.map(function(u) {
    return {
      data: u,
      offset: 0,
      dataLen: 0,
      dirty: 0
    };
  }), t = 0, i = 0, n = 0, a = 0; a < e.length; a++) {
    var o = e[a];
    if (t = Uh[o.data.type], o.data.size > 1 && (t = Math.max(t, 16) * o.data.size), o.dataLen = t, i % t !== 0 && i < 16) {
      var s = i % t % 16;
      i += s, n += s;
    }
    i + t > 16 ? (n = Math.ceil(n / 16) * 16, o.offset = n, n += t, i = t) : (o.offset = n, i += t, n += t);
  }
  return n = Math.ceil(n / 16) * 16, { uboElements: e, size: n };
}
function lg(r, e) {
  var t = [];
  for (var i in r)
    e[i] && t.push(e[i]);
  return t.sort(function(n, a) {
    return n.index - a.index;
  }), t;
}
function fg(r, e) {
  if (!r.autoManage)
    return { size: 0, syncFunc: sg };
  for (var t = lg(r.uniforms, e), i = hg(t), n = i.uboElements, a = i.size, o = [`
    var v = null;
    var v2 = null;
    var cv = null;
    var t = 0;
    var gl = renderer.gl
    var index = 0;
    var data = buffer.data;
    `], s = 0; s < n.length; s++) {
    for (var u = n[s], h = r.uniforms[u.data.name], l = u.data.name, f = !1, c = 0; c < Sr.length; c++) {
      var d = Sr[c];
      if (d.codeUbo && d.test(u.data, h)) {
        o.push("offset = " + u.offset / 4 + ";", Sr[c].codeUbo(u.data.name, h)), f = !0;
        break;
      }
    }
    if (!f)
      if (u.data.size > 1) {
        var p = Nh(u.data.type), v = Math.max(Uh[u.data.type] / 16, 1), _ = p / v, y = (4 - _ % 4) % 4;
        o.push(`
                cv = ud.` + l + `.value;
                v = uv.` + l + `;
                offset = ` + u.offset / 4 + `;

                t = 0;

                for(var i=0; i < ` + u.data.size * v + `; i++)
                {
                    for(var j = 0; j < ` + _ + `; j++)
                    {
                        data[offset++] = v[t++];
                    }
                    offset += ` + y + `;
                }

                `);
      } else {
        var g = ug[u.data.type];
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
var cg = (
  /** @class */
  function() {
    function r(e, t) {
      this.program = e, this.uniformData = t, this.uniformGroups = {}, this.uniformDirtyGroups = {}, this.uniformBufferBindings = {};
    }
    return r.prototype.destroy = function() {
      this.uniformData = null, this.uniformGroups = null, this.uniformDirtyGroups = null, this.uniformBufferBindings = null, this.program = null;
    }, r;
  }()
);
function dg(r, e) {
  for (var t = {}, i = e.getProgramParameter(r, e.ACTIVE_ATTRIBUTES), n = 0; n < i; n++) {
    var a = e.getActiveAttrib(r, n);
    if (a.name.indexOf("gl_") !== 0) {
      var o = Bh(e, a.type), s = {
        type: o,
        name: a.name,
        size: Nh(o),
        location: e.getAttribLocation(r, a.name)
      };
      t[a.name] = s;
    }
  }
  return t;
}
function pg(r, e) {
  for (var t = {}, i = e.getProgramParameter(r, e.ACTIVE_UNIFORMS), n = 0; n < i; n++) {
    var a = e.getActiveUniform(r, n), o = a.name.replace(/\[.*?\]$/, ""), s = !!a.name.match(/\[.*?\]$/), u = Bh(e, a.type);
    t[o] = {
      name: o,
      index: n,
      type: u,
      size: a.size,
      isArray: s,
      value: Dh(u, a.size)
    };
  }
  return t;
}
function vg(r, e) {
  var t = Hs(r, r.VERTEX_SHADER, e.vertexSrc), i = Hs(r, r.FRAGMENT_SHADER, e.fragmentSrc), n = r.createProgram();
  if (r.attachShader(n, t), r.attachShader(n, i), r.linkProgram(n), r.getProgramParameter(n, r.LINK_STATUS) || Ly(r, n, t, i), e.attributeData = dg(n, r), e.uniformData = pg(n, r), !/^[ \t]*#[ \t]*version[ \t]+300[ \t]+es[ \t]*$/m.test(e.vertexSrc)) {
    var a = Object.keys(e.attributeData);
    a.sort(function(l, f) {
      return l > f ? 1 : -1;
    });
    for (var o = 0; o < a.length; o++)
      e.attributeData[a[o]].location = o, r.bindAttribLocation(n, o, a[o]);
    r.linkProgram(n);
  }
  r.deleteShader(t), r.deleteShader(i);
  var s = {};
  for (var o in e.uniformData) {
    var u = e.uniformData[o];
    s[o] = {
      location: r.getUniformLocation(n, o),
      value: Dh(u.type, u.size)
    };
  }
  var h = new cg(n, s);
  return h;
}
var _g = 0, Ai = { textureCount: 0, uboCount: 0 }, yg = (
  /** @class */
  function() {
    function r(e) {
      this.destroyed = !1, this.renderer = e, this.systemCheck(), this.gl = null, this.shader = null, this.program = null, this.cache = {}, this._uboCache = {}, this.id = _g++;
    }
    return r.prototype.systemCheck = function() {
      if (!Yy())
        throw new Error("Current environment does not allow unsafe-eval, please use @pixi/unsafe-eval module to enable support.");
    }, r.prototype.contextChange = function(e) {
      this.gl = e, this.reset();
    }, r.prototype.bind = function(e, t) {
      e.disposeRunner.add(this), e.uniforms.globals = this.renderer.globalUniforms;
      var i = e.program, n = i.glPrograms[this.renderer.CONTEXT_UID] || this.generateProgram(e);
      return this.shader = e, this.program !== i && (this.program = i, this.gl.useProgram(n.program)), t || (Ai.textureCount = 0, Ai.uboCount = 0, this.syncUniformGroup(e.uniformGroup, Ai)), n;
    }, r.prototype.setUniforms = function(e) {
      var t = this.shader.program, i = t.glPrograms[this.renderer.CONTEXT_UID];
      t.syncUniforms(i.uniformData, e, this.renderer);
    }, r.prototype.syncUniformGroup = function(e, t) {
      var i = this.getGlProgram();
      (!e.static || e.dirtyId !== i.uniformDirtyGroups[e.id]) && (i.uniformDirtyGroups[e.id] = e.dirtyId, this.syncUniforms(e, i, t));
    }, r.prototype.syncUniforms = function(e, t, i) {
      var n = e.syncUniforms[this.shader.program.id] || this.createSyncGroups(e);
      n(t.uniformData, e.uniforms, this.renderer, i);
    }, r.prototype.createSyncGroups = function(e) {
      var t = this.getSignature(e, this.shader.program.uniformData, "u");
      return this.cache[t] || (this.cache[t] = jy(e, this.shader.program.uniformData)), e.syncUniforms[this.shader.program.id] = this.cache[t], e.syncUniforms[this.shader.program.id];
    }, r.prototype.syncUniformBufferGroup = function(e, t) {
      var i = this.getGlProgram();
      if (!e.static || e.dirtyId !== 0 || !i.uniformGroups[e.id]) {
        e.dirtyId = 0;
        var n = i.uniformGroups[e.id] || this.createSyncBufferGroup(e, i, t);
        e.buffer.update(), n(i.uniformData, e.uniforms, this.renderer, Ai, e.buffer);
      }
      this.renderer.buffer.bindBufferBase(e.buffer, i.uniformBufferBindings[t]);
    }, r.prototype.createSyncBufferGroup = function(e, t, i) {
      var n = this.renderer.gl;
      this.renderer.buffer.bind(e.buffer);
      var a = this.gl.getUniformBlockIndex(t.program, i);
      t.uniformBufferBindings[i] = this.shader.uniformBindCount, n.uniformBlockBinding(t.program, a, this.shader.uniformBindCount), this.shader.uniformBindCount++;
      var o = this.getSignature(e, this.shader.program.uniformData, "ubo"), s = this._uboCache[o];
      if (s || (s = this._uboCache[o] = fg(e, this.shader.program.uniformData)), e.autoManage) {
        var u = new Float32Array(s.size / 4);
        e.buffer.update(u);
      }
      return t.uniformGroups[e.id] = s.syncFunc, t.uniformGroups[e.id];
    }, r.prototype.getSignature = function(e, t, i) {
      var n = e.uniforms, a = [i + "-"];
      for (var o in n)
        a.push(o), t[o] && a.push(t[o].type);
      return a.join("-");
    }, r.prototype.getGlProgram = function() {
      return this.shader ? this.shader.program.glPrograms[this.renderer.CONTEXT_UID] : null;
    }, r.prototype.generateProgram = function(e) {
      var t = this.gl, i = e.program, n = vg(t, i);
      return i.glPrograms[this.renderer.CONTEXT_UID] = n, n;
    }, r.prototype.reset = function() {
      this.program = null, this.shader = null;
    }, r.prototype.disposeShader = function(e) {
      this.shader === e && (this.shader = null);
    }, r.prototype.destroy = function() {
      this.renderer = null, this.destroyed = !0;
    }, r;
  }()
);
function gg(r, e) {
  return e === void 0 && (e = []), e[H.NORMAL] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.ADD] = [r.ONE, r.ONE], e[H.MULTIPLY] = [r.DST_COLOR, r.ONE_MINUS_SRC_ALPHA, r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.SCREEN] = [r.ONE, r.ONE_MINUS_SRC_COLOR, r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.OVERLAY] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.DARKEN] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.LIGHTEN] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.COLOR_DODGE] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.COLOR_BURN] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.HARD_LIGHT] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.SOFT_LIGHT] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.DIFFERENCE] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.EXCLUSION] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.HUE] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.SATURATION] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.COLOR] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.LUMINOSITY] = [r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.NONE] = [0, 0], e[H.NORMAL_NPM] = [r.SRC_ALPHA, r.ONE_MINUS_SRC_ALPHA, r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.ADD_NPM] = [r.SRC_ALPHA, r.ONE, r.ONE, r.ONE], e[H.SCREEN_NPM] = [r.SRC_ALPHA, r.ONE_MINUS_SRC_COLOR, r.ONE, r.ONE_MINUS_SRC_ALPHA], e[H.SRC_IN] = [r.DST_ALPHA, r.ZERO], e[H.SRC_OUT] = [r.ONE_MINUS_DST_ALPHA, r.ZERO], e[H.SRC_ATOP] = [r.DST_ALPHA, r.ONE_MINUS_SRC_ALPHA], e[H.DST_OVER] = [r.ONE_MINUS_DST_ALPHA, r.ONE], e[H.DST_IN] = [r.ZERO, r.SRC_ALPHA], e[H.DST_OUT] = [r.ZERO, r.ONE_MINUS_SRC_ALPHA], e[H.DST_ATOP] = [r.ONE_MINUS_DST_ALPHA, r.SRC_ALPHA], e[H.XOR] = [r.ONE_MINUS_DST_ALPHA, r.ONE_MINUS_SRC_ALPHA], e[H.SUBTRACT] = [r.ONE, r.ONE, r.ONE, r.ONE, r.FUNC_REVERSE_SUBTRACT, r.FUNC_ADD], e;
}
var mg = 0, bg = 1, Eg = 2, Tg = 3, xg = 4, wg = 5, Sg = (
  /** @class */
  function() {
    function r() {
      this.gl = null, this.stateId = 0, this.polygonOffset = 0, this.blendMode = H.NONE, this._blendEq = !1, this.map = [], this.map[mg] = this.setBlend, this.map[bg] = this.setOffset, this.map[Eg] = this.setCullFace, this.map[Tg] = this.setDepthTest, this.map[xg] = this.setFrontFace, this.map[wg] = this.setDepthMask, this.checks = [], this.defaultState = new sr(), this.defaultState.blend = !0;
    }
    return r.prototype.contextChange = function(e) {
      this.gl = e, this.blendModes = gg(e), this.set(this.defaultState), this.reset();
    }, r.prototype.set = function(e) {
      if (e = e || this.defaultState, this.stateId !== e.data) {
        for (var t = this.stateId ^ e.data, i = 0; t; )
          t & 1 && this.map[i].call(this, !!(e.data & 1 << i)), t = t >> 1, i++;
        this.stateId = e.data;
      }
      for (var i = 0; i < this.checks.length; i++)
        this.checks[i](this, e);
    }, r.prototype.forceState = function(e) {
      e = e || this.defaultState;
      for (var t = 0; t < this.map.length; t++)
        this.map[t].call(this, !!(e.data & 1 << t));
      for (var t = 0; t < this.checks.length; t++)
        this.checks[t](this, e);
      this.stateId = e.data;
    }, r.prototype.setBlend = function(e) {
      this.updateCheck(r.checkBlendMode, e), this.gl[e ? "enable" : "disable"](this.gl.BLEND);
    }, r.prototype.setOffset = function(e) {
      this.updateCheck(r.checkPolygonOffset, e), this.gl[e ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL);
    }, r.prototype.setDepthTest = function(e) {
      this.gl[e ? "enable" : "disable"](this.gl.DEPTH_TEST);
    }, r.prototype.setDepthMask = function(e) {
      this.gl.depthMask(e);
    }, r.prototype.setCullFace = function(e) {
      this.gl[e ? "enable" : "disable"](this.gl.CULL_FACE);
    }, r.prototype.setFrontFace = function(e) {
      this.gl.frontFace(this.gl[e ? "CW" : "CCW"]);
    }, r.prototype.setBlendMode = function(e) {
      if (e !== this.blendMode) {
        this.blendMode = e;
        var t = this.blendModes[e], i = this.gl;
        t.length === 2 ? i.blendFunc(t[0], t[1]) : i.blendFuncSeparate(t[0], t[1], t[2], t[3]), t.length === 6 ? (this._blendEq = !0, i.blendEquationSeparate(t[4], t[5])) : this._blendEq && (this._blendEq = !1, i.blendEquationSeparate(i.FUNC_ADD, i.FUNC_ADD));
      }
    }, r.prototype.setPolygonOffset = function(e, t) {
      this.gl.polygonOffset(e, t);
    }, r.prototype.reset = function() {
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, !1), this.forceState(this.defaultState), this._blendEq = !0, this.blendMode = -1, this.setBlendMode(0);
    }, r.prototype.updateCheck = function(e, t) {
      var i = this.checks.indexOf(e);
      t && i === -1 ? this.checks.push(e) : !t && i !== -1 && this.checks.splice(i, 1);
    }, r.checkBlendMode = function(e, t) {
      e.setBlendMode(t.blendMode);
    }, r.checkPolygonOffset = function(e, t) {
      e.setPolygonOffset(1, t.polygonOffset);
    }, r.prototype.destroy = function() {
      this.gl = null;
    }, r;
  }()
), Pg = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.count = 0, this.checkCount = 0, this.maxIdle = U.GC_MAX_IDLE, this.checkCountMax = U.GC_MAX_CHECK_COUNT, this.mode = U.GC_MODE;
    }
    return r.prototype.postrender = function() {
      this.renderer.renderingToScreen && (this.count++, this.mode !== Qi.MANUAL && (this.checkCount++, this.checkCount > this.checkCountMax && (this.checkCount = 0, this.run())));
    }, r.prototype.run = function() {
      for (var e = this.renderer.texture, t = e.managedTextures, i = !1, n = 0; n < t.length; n++) {
        var a = t[n];
        !a.framebuffer && this.count - a.touched > this.maxIdle && (e.destroyTexture(a, !0), t[n] = null, i = !0);
      }
      if (i) {
        for (var o = 0, n = 0; n < t.length; n++)
          t[n] !== null && (t[o++] = t[n]);
        t.length = o;
      }
    }, r.prototype.unload = function(e) {
      var t = this.renderer.texture, i = e._texture;
      i && !i.framebuffer && t.destroyTexture(i);
      for (var n = e.children.length - 1; n >= 0; n--)
        this.unload(e.children[n]);
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
);
function Ag(r) {
  var e, t, i, n, a, o, s, u, h, l, f, c, d, p, v, _, y, g, m, E, b, x, S;
  return "WebGL2RenderingContext" in globalThis && r instanceof globalThis.WebGL2RenderingContext ? S = (e = {}, e[k.UNSIGNED_BYTE] = (t = {}, t[N.RGBA] = r.RGBA8, t[N.RGB] = r.RGB8, t[N.RG] = r.RG8, t[N.RED] = r.R8, t[N.RGBA_INTEGER] = r.RGBA8UI, t[N.RGB_INTEGER] = r.RGB8UI, t[N.RG_INTEGER] = r.RG8UI, t[N.RED_INTEGER] = r.R8UI, t[N.ALPHA] = r.ALPHA, t[N.LUMINANCE] = r.LUMINANCE, t[N.LUMINANCE_ALPHA] = r.LUMINANCE_ALPHA, t), e[k.BYTE] = (i = {}, i[N.RGBA] = r.RGBA8_SNORM, i[N.RGB] = r.RGB8_SNORM, i[N.RG] = r.RG8_SNORM, i[N.RED] = r.R8_SNORM, i[N.RGBA_INTEGER] = r.RGBA8I, i[N.RGB_INTEGER] = r.RGB8I, i[N.RG_INTEGER] = r.RG8I, i[N.RED_INTEGER] = r.R8I, i), e[k.UNSIGNED_SHORT] = (n = {}, n[N.RGBA_INTEGER] = r.RGBA16UI, n[N.RGB_INTEGER] = r.RGB16UI, n[N.RG_INTEGER] = r.RG16UI, n[N.RED_INTEGER] = r.R16UI, n[N.DEPTH_COMPONENT] = r.DEPTH_COMPONENT16, n), e[k.SHORT] = (a = {}, a[N.RGBA_INTEGER] = r.RGBA16I, a[N.RGB_INTEGER] = r.RGB16I, a[N.RG_INTEGER] = r.RG16I, a[N.RED_INTEGER] = r.R16I, a), e[k.UNSIGNED_INT] = (o = {}, o[N.RGBA_INTEGER] = r.RGBA32UI, o[N.RGB_INTEGER] = r.RGB32UI, o[N.RG_INTEGER] = r.RG32UI, o[N.RED_INTEGER] = r.R32UI, o[N.DEPTH_COMPONENT] = r.DEPTH_COMPONENT24, o), e[k.INT] = (s = {}, s[N.RGBA_INTEGER] = r.RGBA32I, s[N.RGB_INTEGER] = r.RGB32I, s[N.RG_INTEGER] = r.RG32I, s[N.RED_INTEGER] = r.R32I, s), e[k.FLOAT] = (u = {}, u[N.RGBA] = r.RGBA32F, u[N.RGB] = r.RGB32F, u[N.RG] = r.RG32F, u[N.RED] = r.R32F, u[N.DEPTH_COMPONENT] = r.DEPTH_COMPONENT32F, u), e[k.HALF_FLOAT] = (h = {}, h[N.RGBA] = r.RGBA16F, h[N.RGB] = r.RGB16F, h[N.RG] = r.RG16F, h[N.RED] = r.R16F, h), e[k.UNSIGNED_SHORT_5_6_5] = (l = {}, l[N.RGB] = r.RGB565, l), e[k.UNSIGNED_SHORT_4_4_4_4] = (f = {}, f[N.RGBA] = r.RGBA4, f), e[k.UNSIGNED_SHORT_5_5_5_1] = (c = {}, c[N.RGBA] = r.RGB5_A1, c), e[k.UNSIGNED_INT_2_10_10_10_REV] = (d = {}, d[N.RGBA] = r.RGB10_A2, d[N.RGBA_INTEGER] = r.RGB10_A2UI, d), e[k.UNSIGNED_INT_10F_11F_11F_REV] = (p = {}, p[N.RGB] = r.R11F_G11F_B10F, p), e[k.UNSIGNED_INT_5_9_9_9_REV] = (v = {}, v[N.RGB] = r.RGB9_E5, v), e[k.UNSIGNED_INT_24_8] = (_ = {}, _[N.DEPTH_STENCIL] = r.DEPTH24_STENCIL8, _), e[k.FLOAT_32_UNSIGNED_INT_24_8_REV] = (y = {}, y[N.DEPTH_STENCIL] = r.DEPTH32F_STENCIL8, y), e) : S = (g = {}, g[k.UNSIGNED_BYTE] = (m = {}, m[N.RGBA] = r.RGBA, m[N.RGB] = r.RGB, m[N.ALPHA] = r.ALPHA, m[N.LUMINANCE] = r.LUMINANCE, m[N.LUMINANCE_ALPHA] = r.LUMINANCE_ALPHA, m), g[k.UNSIGNED_SHORT_5_6_5] = (E = {}, E[N.RGB] = r.RGB, E), g[k.UNSIGNED_SHORT_4_4_4_4] = (b = {}, b[N.RGBA] = r.RGBA, b), g[k.UNSIGNED_SHORT_5_5_5_1] = (x = {}, x[N.RGBA] = r.RGBA, x), g), S;
}
var qn = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e) {
      this.texture = e, this.width = -1, this.height = -1, this.dirtyId = -1, this.dirtyStyleId = -1, this.mipmap = !1, this.wrapMode = 33071, this.type = k.UNSIGNED_BYTE, this.internalFormat = N.RGBA, this.samplerType = 0;
    }
    return r;
  }()
), Rg = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.boundTextures = [], this.currentLocation = -1, this.managedTextures = [], this._unknownBoundTextures = !1, this.unknownTexture = new rt(), this.hasIntegerTextures = !1;
    }
    return r.prototype.contextChange = function() {
      var e = this.gl = this.renderer.gl;
      this.CONTEXT_UID = this.renderer.CONTEXT_UID, this.webGLVersion = this.renderer.context.webGLVersion, this.internalFormats = Ag(e);
      var t = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS);
      this.boundTextures.length = t;
      for (var i = 0; i < t; i++)
        this.boundTextures[i] = null;
      this.emptyTextures = {};
      var n = new qn(e.createTexture());
      e.bindTexture(e.TEXTURE_2D, n.texture), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, 1, 1, 0, e.RGBA, e.UNSIGNED_BYTE, new Uint8Array(4)), this.emptyTextures[e.TEXTURE_2D] = n, this.emptyTextures[e.TEXTURE_CUBE_MAP] = new qn(e.createTexture()), e.bindTexture(e.TEXTURE_CUBE_MAP, this.emptyTextures[e.TEXTURE_CUBE_MAP].texture);
      for (var i = 0; i < 6; i++)
        e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, e.RGBA, 1, 1, 0, e.RGBA, e.UNSIGNED_BYTE, null);
      e.texParameteri(e.TEXTURE_CUBE_MAP, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_CUBE_MAP, e.TEXTURE_MIN_FILTER, e.LINEAR);
      for (var i = 0; i < this.boundTextures.length; i++)
        this.bind(null, i);
    }, r.prototype.bind = function(e, t) {
      t === void 0 && (t = 0);
      var i = this.gl;
      if (e = e == null ? void 0 : e.castToBaseTexture(), e && e.valid && !e.parentTextureArray) {
        e.touched = this.renderer.textureGC.count;
        var n = e._glTextures[this.CONTEXT_UID] || this.initTexture(e);
        this.boundTextures[t] !== e && (this.currentLocation !== t && (this.currentLocation = t, i.activeTexture(i.TEXTURE0 + t)), i.bindTexture(e.target, n.texture)), n.dirtyId !== e.dirtyId ? (this.currentLocation !== t && (this.currentLocation = t, i.activeTexture(i.TEXTURE0 + t)), this.updateTexture(e)) : n.dirtyStyleId !== e.dirtyStyleId && this.updateTextureStyle(e), this.boundTextures[t] = e;
      } else
        this.currentLocation !== t && (this.currentLocation = t, i.activeTexture(i.TEXTURE0 + t)), i.bindTexture(i.TEXTURE_2D, this.emptyTextures[i.TEXTURE_2D].texture), this.boundTextures[t] = null;
    }, r.prototype.reset = function() {
      this._unknownBoundTextures = !0, this.hasIntegerTextures = !1, this.currentLocation = -1;
      for (var e = 0; e < this.boundTextures.length; e++)
        this.boundTextures[e] = this.unknownTexture;
    }, r.prototype.unbind = function(e) {
      var t = this, i = t.gl, n = t.boundTextures;
      if (this._unknownBoundTextures) {
        this._unknownBoundTextures = !1;
        for (var a = 0; a < n.length; a++)
          n[a] === this.unknownTexture && this.bind(null, a);
      }
      for (var a = 0; a < n.length; a++)
        n[a] === e && (this.currentLocation !== a && (i.activeTexture(i.TEXTURE0 + a), this.currentLocation = a), i.bindTexture(e.target, this.emptyTextures[e.target].texture), n[a] = null);
    }, r.prototype.ensureSamplerType = function(e) {
      var t = this, i = t.boundTextures, n = t.hasIntegerTextures, a = t.CONTEXT_UID;
      if (n)
        for (var o = e - 1; o >= 0; --o) {
          var s = i[o];
          if (s) {
            var u = s._glTextures[a];
            u.samplerType !== $i.FLOAT && this.renderer.texture.unbind(s);
          }
        }
    }, r.prototype.initTexture = function(e) {
      var t = new qn(this.gl.createTexture());
      return t.dirtyId = -1, e._glTextures[this.CONTEXT_UID] = t, this.managedTextures.push(e), e.on("dispose", this.destroyTexture, this), t;
    }, r.prototype.initTextureType = function(e, t) {
      var i, n;
      t.internalFormat = (n = (i = this.internalFormats[e.type]) === null || i === void 0 ? void 0 : i[e.format]) !== null && n !== void 0 ? n : e.format, this.webGLVersion === 2 && e.type === k.HALF_FLOAT ? t.type = this.gl.HALF_FLOAT : t.type = e.type;
    }, r.prototype.updateTexture = function(e) {
      var t = e._glTextures[this.CONTEXT_UID];
      if (t) {
        var i = this.renderer;
        if (this.initTextureType(e, t), e.resource && e.resource.upload(i, e, t))
          t.samplerType !== $i.FLOAT && (this.hasIntegerTextures = !0);
        else {
          var n = e.realWidth, a = e.realHeight, o = i.gl;
          (t.width !== n || t.height !== a || t.dirtyId < 0) && (t.width = n, t.height = a, o.texImage2D(e.target, 0, t.internalFormat, n, a, 0, e.format, t.type, null));
        }
        e.dirtyStyleId !== t.dirtyStyleId && this.updateTextureStyle(e), t.dirtyId = e.dirtyId;
      }
    }, r.prototype.destroyTexture = function(e, t) {
      var i = this.gl;
      if (e = e.castToBaseTexture(), e._glTextures[this.CONTEXT_UID] && (this.unbind(e), i.deleteTexture(e._glTextures[this.CONTEXT_UID].texture), e.off("dispose", this.destroyTexture, this), delete e._glTextures[this.CONTEXT_UID], !t)) {
        var n = this.managedTextures.indexOf(e);
        n !== -1 && wr(this.managedTextures, n, 1);
      }
    }, r.prototype.updateTextureStyle = function(e) {
      var t = e._glTextures[this.CONTEXT_UID];
      t && ((e.mipmap === te.POW2 || this.webGLVersion !== 2) && !e.isPowerOfTwo ? t.mipmap = !1 : t.mipmap = e.mipmap >= 1, this.webGLVersion !== 2 && !e.isPowerOfTwo ? t.wrapMode = ue.CLAMP : t.wrapMode = e.wrapMode, e.resource && e.resource.style(this.renderer, e, t) || this.setStyle(e, t), t.dirtyStyleId = e.dirtyStyleId);
    }, r.prototype.setStyle = function(e, t) {
      var i = this.gl;
      if (t.mipmap && e.mipmap !== te.ON_MANUAL && i.generateMipmap(e.target), i.texParameteri(e.target, i.TEXTURE_WRAP_S, t.wrapMode), i.texParameteri(e.target, i.TEXTURE_WRAP_T, t.wrapMode), t.mipmap) {
        i.texParameteri(e.target, i.TEXTURE_MIN_FILTER, e.scaleMode === oe.LINEAR ? i.LINEAR_MIPMAP_LINEAR : i.NEAREST_MIPMAP_NEAREST);
        var n = this.renderer.context.extensions.anisotropicFiltering;
        if (n && e.anisotropicLevel > 0 && e.scaleMode === oe.LINEAR) {
          var a = Math.min(e.anisotropicLevel, i.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
          i.texParameterf(e.target, n.TEXTURE_MAX_ANISOTROPY_EXT, a);
        }
      } else
        i.texParameteri(e.target, i.TEXTURE_MIN_FILTER, e.scaleMode === oe.LINEAR ? i.LINEAR : i.NEAREST);
      i.texParameteri(e.target, i.TEXTURE_MAG_FILTER, e.scaleMode === oe.LINEAR ? i.LINEAR : i.NEAREST);
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r;
  }()
), Kn = new It(), Og = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t, i) {
      t === void 0 && (t = Zr.UNKNOWN);
      var n = r.call(this) || this;
      return i = Object.assign({}, U.RENDER_OPTIONS, i), n.options = i, n.type = t, n.screen = new it(0, 0, i.width, i.height), n.view = i.view || U.ADAPTER.createCanvas(), n.resolution = i.resolution || U.RESOLUTION, n.useContextAlpha = i.useContextAlpha, n.autoDensity = !!i.autoDensity, n.preserveDrawingBuffer = i.preserveDrawingBuffer, n.clearBeforeRender = i.clearBeforeRender, n._backgroundColor = 0, n._backgroundColorRgba = [0, 0, 0, 1], n._backgroundColorString = "#000000", n.backgroundColor = i.backgroundColor || n._backgroundColor, n.backgroundAlpha = i.backgroundAlpha, i.transparent !== void 0 && (Jt("6.0.0", "Option transparent is deprecated, please use backgroundAlpha instead."), n.useContextAlpha = i.transparent, n.backgroundAlpha = i.transparent ? 0 : 1), n._lastObjectRendered = null, n.plugins = {}, n;
    }
    return e.prototype.initPlugins = function(t) {
      for (var i in t)
        this.plugins[i] = new t[i](this);
    }, Object.defineProperty(e.prototype, "width", {
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
    }), Object.defineProperty(e.prototype, "height", {
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
    }), e.prototype.resize = function(t, i) {
      this.view.width = Math.round(t * this.resolution), this.view.height = Math.round(i * this.resolution);
      var n = this.view.width / this.resolution, a = this.view.height / this.resolution;
      this.screen.width = n, this.screen.height = a, this.autoDensity && (this.view.style.width = n + "px", this.view.style.height = a + "px"), this.emit("resize", n, a);
    }, e.prototype.generateTexture = function(t, i, n, a) {
      i === void 0 && (i = {}), typeof i == "number" && (Jt("6.1.0", "generateTexture options (scaleMode, resolution, region) are now object options."), i = { scaleMode: i, resolution: n, region: a });
      var o = i.region, s = fy(i, ["region"]);
      a = o || t.getLocalBounds(null, !0), a.width === 0 && (a.width = 1), a.height === 0 && (a.height = 1);
      var u = ir.create(Fa({ width: a.width, height: a.height }, s));
      return Kn.tx = -a.x, Kn.ty = -a.y, this.render(t, {
        renderTexture: u,
        clear: !1,
        transform: Kn,
        skipUpdateTransform: !!t.parent
      }), u;
    }, e.prototype.destroy = function(t) {
      for (var i in this.plugins)
        this.plugins[i].destroy(), this.plugins[i] = null;
      t && this.view.parentNode && this.view.parentNode.removeChild(this.view);
      var n = this;
      n.plugins = null, n.type = Zr.UNKNOWN, n.view = null, n.screen = null, n._tempDisplayObjectParent = null, n.options = null, this._backgroundColorRgba = null, this._backgroundColorString = null, this._lastObjectRendered = null;
    }, Object.defineProperty(e.prototype, "backgroundColor", {
      /**
       * The background color to fill if not transparent
       * @member {number}
       */
      get: function() {
        return this._backgroundColor;
      },
      set: function(t) {
        this._backgroundColor = t, this._backgroundColorString = mh(t), Ir(t, this._backgroundColorRgba);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "backgroundAlpha", {
      /**
       * The background color alpha. Setting this to 0 will make the canvas transparent.
       * @member {number}
       */
      get: function() {
        return this._backgroundColorRgba[3];
      },
      set: function(t) {
        this._backgroundColorRgba[3] = t;
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(ai)
), Ig = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e) {
      this.buffer = e || null, this.updateID = -1, this.byteLength = -1, this.refCount = 0;
    }
    return r;
  }()
), Cg = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e, this.managedBuffers = {}, this.boundBufferBases = {};
    }
    return r.prototype.destroy = function() {
      this.renderer = null;
    }, r.prototype.contextChange = function() {
      this.disposeAll(!0), this.gl = this.renderer.gl, this.CONTEXT_UID = this.renderer.CONTEXT_UID;
    }, r.prototype.bind = function(e) {
      var t = this, i = t.gl, n = t.CONTEXT_UID, a = e._glBuffers[n] || this.createGLBuffer(e);
      i.bindBuffer(e.type, a.buffer);
    }, r.prototype.bindBufferBase = function(e, t) {
      var i = this, n = i.gl, a = i.CONTEXT_UID;
      if (this.boundBufferBases[t] !== e) {
        var o = e._glBuffers[a] || this.createGLBuffer(e);
        this.boundBufferBases[t] = e, n.bindBufferBase(n.UNIFORM_BUFFER, t, o.buffer);
      }
    }, r.prototype.bindBufferRange = function(e, t, i) {
      var n = this, a = n.gl, o = n.CONTEXT_UID;
      i = i || 0;
      var s = e._glBuffers[o] || this.createGLBuffer(e);
      a.bindBufferRange(a.UNIFORM_BUFFER, t || 0, s.buffer, i * 256, 256);
    }, r.prototype.update = function(e) {
      var t = this, i = t.gl, n = t.CONTEXT_UID, a = e._glBuffers[n];
      if (e._updateID !== a.updateID)
        if (a.updateID = e._updateID, i.bindBuffer(e.type, a.buffer), a.byteLength >= e.data.byteLength)
          i.bufferSubData(e.type, 0, e.data);
        else {
          var o = e.static ? i.STATIC_DRAW : i.DYNAMIC_DRAW;
          a.byteLength = e.data.byteLength, i.bufferData(e.type, e.data, o);
        }
    }, r.prototype.dispose = function(e, t) {
      if (this.managedBuffers[e.id]) {
        delete this.managedBuffers[e.id];
        var i = e._glBuffers[this.CONTEXT_UID], n = this.gl;
        e.disposeRunner.remove(this), i && (t || n.deleteBuffer(i.buffer), delete e._glBuffers[this.CONTEXT_UID]);
      }
    }, r.prototype.disposeAll = function(e) {
      for (var t = Object.keys(this.managedBuffers), i = 0; i < t.length; i++)
        this.dispose(this.managedBuffers[t[i]], e);
    }, r.prototype.createGLBuffer = function(e) {
      var t = this, i = t.CONTEXT_UID, n = t.gl;
      return e._glBuffers[i] = new Ig(n.createBuffer()), this.managedBuffers[e.id] = e, e.disposeRunner.add(this), e._glBuffers[i];
    }, r;
  }()
), Gh = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t) {
      var i = r.call(this, Zr.WEBGL, t) || this;
      return t = i.options, i.gl = null, i.CONTEXT_UID = 0, i.runners = {
        destroy: new Bt("destroy"),
        contextChange: new Bt("contextChange"),
        reset: new Bt("reset"),
        update: new Bt("update"),
        postrender: new Bt("postrender"),
        prerender: new Bt("prerender"),
        resize: new Bt("resize")
      }, i.runners.contextChange.add(i), i.globalUniforms = new tr({
        projectionMatrix: new It()
      }, !0), i.addSystem(rg, "mask").addSystem(Cy, "context").addSystem(Sg, "state").addSystem(yg, "shader").addSystem(Rg, "texture").addSystem(Cg, "buffer").addSystem(Ny, "geometry").addSystem(Fy, "framebuffer").addSystem(ig, "scissor").addSystem(ng, "stencil").addSystem(ag, "projection").addSystem(Pg, "textureGC").addSystem(Oy, "filter").addSystem(og, "renderTexture").addSystem(Iy, "batch"), i.initPlugins(e.__plugins), i.multisample = void 0, t.context ? i.context.initFromContext(t.context) : i.context.initFromOptions({
        alpha: !!i.useContextAlpha,
        antialias: t.antialias,
        premultipliedAlpha: i.useContextAlpha && i.useContextAlpha !== "notMultiplied",
        stencil: !0,
        preserveDrawingBuffer: t.preserveDrawingBuffer,
        powerPreference: i.options.powerPreference
      }), i.renderingToScreen = !0, up(i.context.webGLVersion === 2 ? "WebGL 2" : "WebGL 1"), i.resize(i.options.width, i.options.height), i;
    }
    return e.create = function(t) {
      if (hp())
        return new e(t);
      throw new Error('WebGL unsupported in this browser, use "pixi.js-legacy" for fallback canvas2d support.');
    }, e.prototype.contextChange = function() {
      var t = this.gl, i;
      if (this.context.webGLVersion === 1) {
        var n = t.getParameter(t.FRAMEBUFFER_BINDING);
        t.bindFramebuffer(t.FRAMEBUFFER, null), i = t.getParameter(t.SAMPLES), t.bindFramebuffer(t.FRAMEBUFFER, n);
      } else {
        var n = t.getParameter(t.DRAW_FRAMEBUFFER_BINDING);
        t.bindFramebuffer(t.DRAW_FRAMEBUFFER, null), i = t.getParameter(t.SAMPLES), t.bindFramebuffer(t.DRAW_FRAMEBUFFER, n);
      }
      i >= gt.HIGH ? this.multisample = gt.HIGH : i >= gt.MEDIUM ? this.multisample = gt.MEDIUM : i >= gt.LOW ? this.multisample = gt.LOW : this.multisample = gt.NONE;
    }, e.prototype.addSystem = function(t, i) {
      var n = new t(this);
      if (this[i])
        throw new Error('Whoops! The name "' + i + '" is already in use');
      this[i] = n;
      for (var a in this.runners)
        this.runners[a].add(n);
      return this;
    }, e.prototype.render = function(t, i) {
      var n, a, o, s;
      if (i && (i instanceof ir ? (Jt("6.0.0", "Renderer#render arguments changed, use options instead."), n = i, a = arguments[2], o = arguments[3], s = arguments[4]) : (n = i.renderTexture, a = i.clear, o = i.transform, s = i.skipUpdateTransform)), this.renderingToScreen = !n, this.runners.prerender.emit(), this.emit("prerender"), this.projection.transform = o, !this.context.isLost) {
        if (n || (this._lastObjectRendered = t), !s) {
          var u = t.enableTempParent();
          t.updateTransform(), t.disableTempParent(u);
        }
        this.renderTexture.bind(n), this.batch.currentRenderer.start(), (a !== void 0 ? a : this.clearBeforeRender) && this.renderTexture.clear(), t.render(this), this.batch.currentRenderer.flush(), n && n.baseTexture.update(), this.runners.postrender.emit(), this.projection.transform = null, this.emit("postrender");
      }
    }, e.prototype.generateTexture = function(t, i, n, a) {
      i === void 0 && (i = {});
      var o = r.prototype.generateTexture.call(this, t, i, n, a);
      return this.framebuffer.blit(), o;
    }, e.prototype.resize = function(t, i) {
      r.prototype.resize.call(this, t, i), this.runners.resize.emit(this.screen.height, this.screen.width);
    }, e.prototype.reset = function() {
      return this.runners.reset.emit(), this;
    }, e.prototype.clear = function() {
      this.renderTexture.bind(), this.renderTexture.clear();
    }, e.prototype.destroy = function(t) {
      this.runners.destroy.emit();
      for (var i in this.runners)
        this.runners[i].destroy();
      r.prototype.destroy.call(this, t), this.gl = null;
    }, Object.defineProperty(e.prototype, "extract", {
      /**
       * Please use `plugins.extract` instead.
       * @member {PIXI.Extract} extract
       * @deprecated since 6.0.0
       * @readonly
       */
      get: function() {
        return Jt("6.0.0", "Renderer#extract has been deprecated, please use Renderer#plugins.extract instead."), this.plugins.extract;
      },
      enumerable: !1,
      configurable: !0
    }), e.registerPlugin = function(t, i) {
      Jt("6.5.0", "Renderer.registerPlugin() has been deprecated, please use extensions.add() instead."), xe.add({
        name: t,
        type: pt.RendererPlugin,
        ref: i
      });
    }, e.__plugins = {}, e;
  }(Og)
);
xe.handleByMap(pt.RendererPlugin, Gh.__plugins);
function kh(r) {
  return Gh.create(r);
}
var Mg = `attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`, Dg = `attribute vec2 aVertexPosition;

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
`, Fg = Mg, Hh = Dg, Ba = (
  /** @class */
  /* @__PURE__ */ function() {
    function r() {
      this.texArray = null, this.blend = 0, this.type = $t.TRIANGLES, this.start = 0, this.size = 0, this.data = null;
    }
    return r;
  }()
), La = (
  /** @class */
  function() {
    function r() {
      this.elements = [], this.ids = [], this.count = 0;
    }
    return r.prototype.clear = function() {
      for (var e = 0; e < this.count; e++)
        this.elements[e] = null;
      this.count = 0;
    }, r;
  }()
), Ua = (
  /** @class */
  function() {
    function r(e) {
      typeof e == "number" ? this.rawBinaryData = new ArrayBuffer(e) : e instanceof Uint8Array ? this.rawBinaryData = e.buffer : this.rawBinaryData = e, this.uint32View = new Uint32Array(this.rawBinaryData), this.float32View = new Float32Array(this.rawBinaryData);
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
    }), r.prototype.view = function(e) {
      return this[e + "View"];
    }, r.prototype.destroy = function() {
      this.rawBinaryData = null, this._int8View = null, this._uint8View = null, this._int16View = null, this._uint16View = null, this._int32View = null, this.uint32View = null, this.float32View = null;
    }, r.sizeOf = function(e) {
      switch (e) {
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
          throw new Error(e + " isn't a valid view type");
      }
    }, r;
  }()
), Ng = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t) {
      var i = r.call(this, t) || this;
      return i.shaderGenerator = null, i.geometryClass = null, i.vertexSize = null, i.state = sr.for2d(), i.size = U.SPRITE_BATCH_SIZE * 4, i._vertexCount = 0, i._indexCount = 0, i._bufferedElements = [], i._bufferedTextures = [], i._bufferSize = 0, i._shader = null, i._packedGeometries = [], i._packedGeometryPoolSize = 2, i._flushId = 0, i._aBuffers = {}, i._iBuffers = {}, i.MAX_TEXTURES = 1, i.renderer.on("prerender", i.onPrerender, i), t.runners.contextChange.add(i), i._dcIndex = 0, i._aIndex = 0, i._iIndex = 0, i._attributeBuffer = null, i._indexBuffer = null, i._tempBoundTextures = [], i;
    }
    return e.prototype.contextChange = function() {
      var t = this.renderer.gl;
      U.PREFER_ENV === be.WEBGL_LEGACY ? this.MAX_TEXTURES = 1 : (this.MAX_TEXTURES = Math.min(t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS), U.SPRITE_MAX_TEXTURES), this.MAX_TEXTURES = Wy(this.MAX_TEXTURES, t)), this._shader = this.shaderGenerator.generateShader(this.MAX_TEXTURES);
      for (var i = 0; i < this._packedGeometryPoolSize; i++)
        this._packedGeometries[i] = new this.geometryClass();
      this.initFlushBuffers();
    }, e.prototype.initFlushBuffers = function() {
      for (var t = e._drawCallPool, i = e._textureArrayPool, n = this.size / 4, a = Math.floor(n / this.MAX_TEXTURES) + 1; t.length < n; )
        t.push(new Ba());
      for (; i.length < a; )
        i.push(new La());
      for (var o = 0; o < this.MAX_TEXTURES; o++)
        this._tempBoundTextures[o] = null;
    }, e.prototype.onPrerender = function() {
      this._flushId = 0;
    }, e.prototype.render = function(t) {
      t._texture.valid && (this._vertexCount + t.vertexData.length / 2 > this.size && this.flush(), this._vertexCount += t.vertexData.length / 2, this._indexCount += t.indices.length, this._bufferedTextures[this._bufferSize] = t._texture.baseTexture, this._bufferedElements[this._bufferSize++] = t);
    }, e.prototype.buildTexturesAndDrawCalls = function() {
      var t = this, i = t._bufferedTextures, n = t.MAX_TEXTURES, a = e._textureArrayPool, o = this.renderer.batch, s = this._tempBoundTextures, u = this.renderer.textureGC.count, h = ++rt._globalBatch, l = 0, f = a[0], c = 0;
      o.copyBoundTextures(s, n);
      for (var d = 0; d < this._bufferSize; ++d) {
        var p = i[d];
        i[d] = null, p._batchEnabled !== h && (f.count >= n && (o.boundArray(f, s, h, n), this.buildDrawCalls(f, c, d), c = d, f = a[++l], ++h), p._batchEnabled = h, p.touched = u, f.elements[f.count++] = p);
      }
      f.count > 0 && (o.boundArray(f, s, h, n), this.buildDrawCalls(f, c, this._bufferSize), ++l, ++h);
      for (var d = 0; d < s.length; d++)
        s[d] = null;
      rt._globalBatch = h;
    }, e.prototype.buildDrawCalls = function(t, i, n) {
      var a = this, o = a._bufferedElements, s = a._attributeBuffer, u = a._indexBuffer, h = a.vertexSize, l = e._drawCallPool, f = this._dcIndex, c = this._aIndex, d = this._iIndex, p = l[f];
      p.start = this._iIndex, p.texArray = t;
      for (var v = i; v < n; ++v) {
        var _ = o[v], y = _._texture.baseTexture, g = bh[y.alphaMode ? 1 : 0][_.blendMode];
        o[v] = null, i < v && p.blend !== g && (p.size = d - p.start, i = v, p = l[++f], p.texArray = t, p.start = d), this.packInterleavedGeometry(_, s, u, c, d), c += _.vertexData.length / 2 * h, d += _.indices.length, p.blend = g;
      }
      i < n && (p.size = d - p.start, ++f), this._dcIndex = f, this._aIndex = c, this._iIndex = d;
    }, e.prototype.bindAndClearTexArray = function(t) {
      for (var i = this.renderer.texture, n = 0; n < t.count; n++)
        i.bind(t.elements[n], t.ids[n]), t.elements[n] = null;
      t.count = 0;
    }, e.prototype.updateGeometry = function() {
      var t = this, i = t._packedGeometries, n = t._attributeBuffer, a = t._indexBuffer;
      U.CAN_UPLOAD_SAME_BUFFER ? (i[this._flushId]._buffer.update(n.rawBinaryData), i[this._flushId]._indexBuffer.update(a), this.renderer.geometry.updateBuffers()) : (this._packedGeometryPoolSize <= this._flushId && (this._packedGeometryPoolSize++, i[this._flushId] = new this.geometryClass()), i[this._flushId]._buffer.update(n.rawBinaryData), i[this._flushId]._indexBuffer.update(a), this.renderer.geometry.bind(i[this._flushId]), this.renderer.geometry.updateBuffers(), this._flushId++);
    }, e.prototype.drawBatches = function() {
      for (var t = this._dcIndex, i = this.renderer, n = i.gl, a = i.state, o = e._drawCallPool, s = null, u = 0; u < t; u++) {
        var h = o[u], l = h.texArray, f = h.type, c = h.size, d = h.start, p = h.blend;
        s !== l && (s = l, this.bindAndClearTexArray(l)), this.state.blendMode = p, a.set(this.state), n.drawElements(f, c, n.UNSIGNED_SHORT, d * 2);
      }
    }, e.prototype.flush = function() {
      this._vertexCount !== 0 && (this._attributeBuffer = this.getAttributeBuffer(this._vertexCount), this._indexBuffer = this.getIndexBuffer(this._indexCount), this._aIndex = 0, this._iIndex = 0, this._dcIndex = 0, this.buildTexturesAndDrawCalls(), this.updateGeometry(), this.drawBatches(), this._bufferSize = 0, this._vertexCount = 0, this._indexCount = 0);
    }, e.prototype.start = function() {
      this.renderer.state.set(this.state), this.renderer.texture.ensureSamplerType(this.MAX_TEXTURES), this.renderer.shader.bind(this._shader), U.CAN_UPLOAD_SAME_BUFFER && this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
    }, e.prototype.stop = function() {
      this.flush();
    }, e.prototype.destroy = function() {
      for (var t = 0; t < this._packedGeometryPoolSize; t++)
        this._packedGeometries[t] && this._packedGeometries[t].destroy();
      this.renderer.off("prerender", this.onPrerender, this), this._aBuffers = null, this._iBuffers = null, this._packedGeometries = null, this._attributeBuffer = null, this._indexBuffer = null, this._shader && (this._shader.destroy(), this._shader = null), r.prototype.destroy.call(this);
    }, e.prototype.getAttributeBuffer = function(t) {
      var i = on(Math.ceil(t / 8)), n = Ms(i), a = i * 8;
      this._aBuffers.length <= n && (this._iBuffers.length = n + 1);
      var o = this._aBuffers[a];
      return o || (this._aBuffers[a] = o = new Ua(a * this.vertexSize * 4)), o;
    }, e.prototype.getIndexBuffer = function(t) {
      var i = on(Math.ceil(t / 12)), n = Ms(i), a = i * 12;
      this._iBuffers.length <= n && (this._iBuffers.length = n + 1);
      var o = this._iBuffers[n];
      return o || (this._iBuffers[n] = o = new Uint16Array(a)), o;
    }, e.prototype.packInterleavedGeometry = function(t, i, n, a, o) {
      for (var s = i.uint32View, u = i.float32View, h = a / this.vertexSize, l = t.uvs, f = t.indices, c = t.vertexData, d = t._texture.baseTexture._batchLocation, p = Math.min(t.worldAlpha, 1), v = p < 1 && t._texture.baseTexture.alphaMode ? wo(t._tintRGB, p) : t._tintRGB + (p * 255 << 24), _ = 0; _ < c.length; _ += 2)
        u[a++] = c[_], u[a++] = c[_ + 1], u[a++] = l[_], u[a++] = l[_ + 1], s[a++] = v, u[a++] = d;
      for (var _ = 0; _ < f.length; _++)
        n[o++] = h + f[_];
    }, e._drawCallPool = [], e._textureArrayPool = [], e;
  }(mn)
), Bg = (
  /** @class */
  function() {
    function r(e, t) {
      if (this.vertexSrc = e, this.fragTemplate = t, this.programCache = {}, this.defaultGroupCache = {}, t.indexOf("%count%") < 0)
        throw new Error('Fragment template must contain "%count%".');
      if (t.indexOf("%forloop%") < 0)
        throw new Error('Fragment template must contain "%forloop%".');
    }
    return r.prototype.generateShader = function(e) {
      if (!this.programCache[e]) {
        for (var t = new Int32Array(e), i = 0; i < e; i++)
          t[i] = i;
        this.defaultGroupCache[e] = tr.from({ uSamplers: t }, !0);
        var n = this.fragTemplate;
        n = n.replace(/%count%/gi, "" + e), n = n.replace(/%forloop%/gi, this.generateSampleSrc(e)), this.programCache[e] = new hi(this.vertexSrc, n);
      }
      var a = {
        tint: new Float32Array([1, 1, 1, 1]),
        translationMatrix: new It(),
        default: this.defaultGroupCache[e]
      };
      return new Ce(this.programCache[e], a);
    }, r.prototype.generateSampleSrc = function(e) {
      var t = "";
      t += `
`, t += `
`;
      for (var i = 0; i < e; i++)
        i > 0 && (t += `
else `), i < e - 1 && (t += "if(vTextureId < " + i + ".5)"), t += `
{`, t += `
	color = texture2D(uSamplers[` + i + "], vTextureCoord);", t += `
}`;
      return t += `
`, t += `
`, t;
    }, r;
  }()
), Xh = (
  /** @class */
  function(r) {
    vt(e, r);
    function e(t) {
      t === void 0 && (t = !1);
      var i = r.call(this) || this;
      return i._buffer = new Ot(null, t, !1), i._indexBuffer = new Ot(null, t, !0), i.addAttribute("aVertexPosition", i._buffer, 2, !1, k.FLOAT).addAttribute("aTextureCoord", i._buffer, 2, !1, k.FLOAT).addAttribute("aColor", i._buffer, 4, !0, k.UNSIGNED_BYTE).addAttribute("aTextureId", i._buffer, 1, !0, k.FLOAT).addIndex(i._indexBuffer), i;
    }
    return e;
  }(ui)
), qs = `precision highp float;
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
`, Ks = `varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;
uniform sampler2D uSamplers[%count%];

void main(void){
    vec4 color;
    %forloop%
    gl_FragColor = color * vColor;
}
`, Lg = (
  /** @class */
  function() {
    function r() {
    }
    return r.create = function(e) {
      var t = Object.assign({
        vertex: qs,
        fragment: Ks,
        geometryClass: Xh,
        vertexSize: 6
      }, e), i = t.vertex, n = t.fragment, a = t.vertexSize, o = t.geometryClass;
      return (
        /** @class */
        function(s) {
          vt(u, s);
          function u(h) {
            var l = s.call(this, h) || this;
            return l.shaderGenerator = new Bg(i, n), l.geometryClass = o, l.vertexSize = a, l;
          }
          return u;
        }(Ng)
      );
    }, Object.defineProperty(r, "defaultVertexSrc", {
      /**
       * The default vertex shader source
       * @readonly
       */
      get: function() {
        return qs;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r, "defaultFragmentTemplate", {
      /**
       * The default fragment shader source
       * @readonly
       */
      get: function() {
        return Ks;
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
), jh = Lg.create();
Object.assign(jh, {
  extension: {
    name: "batch",
    type: pt.RendererPlugin
  }
});
/*!
 * @pixi/accessibility - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/accessibility is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var Ug = {
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
At.mixin(Ug);
var Gg = 9, Ri = 100, kg = 0, Hg = 0, Zs = 2, $s = 1, Xg = -1e3, jg = -1e3, Vg = 2, zg = (
  /** @class */
  function() {
    function r(e) {
      this.debug = !1, this._isActive = !1, this._isMobileAccessibility = !1, this.pool = [], this.renderId = 0, this.children = [], this.androidUpdateCount = 0, this.androidUpdateFrequency = 500, this._hookDiv = null, (se.tablet || se.phone) && this.createTouchHook();
      var t = document.createElement("div");
      t.style.width = Ri + "px", t.style.height = Ri + "px", t.style.position = "absolute", t.style.top = kg + "px", t.style.left = Hg + "px", t.style.zIndex = Zs.toString(), this.div = t, this.renderer = e, this._onKeyDown = this._onKeyDown.bind(this), this._onMouseMove = this._onMouseMove.bind(this), globalThis.addEventListener("keydown", this._onKeyDown, !1);
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
      var e = this, t = document.createElement("button");
      t.style.width = $s + "px", t.style.height = $s + "px", t.style.position = "absolute", t.style.top = Xg + "px", t.style.left = jg + "px", t.style.zIndex = Vg.toString(), t.style.backgroundColor = "#FF0000", t.title = "select to enable accessibility for this content", t.addEventListener("focus", function() {
        e._isMobileAccessibility = !0, e.activate(), e.destroyTouchHook();
      }), document.body.appendChild(t), this._hookDiv = t;
    }, r.prototype.destroyTouchHook = function() {
      this._hookDiv && (document.body.removeChild(this._hookDiv), this._hookDiv = null);
    }, r.prototype.activate = function() {
      var e;
      this._isActive || (this._isActive = !0, globalThis.document.addEventListener("mousemove", this._onMouseMove, !0), globalThis.removeEventListener("keydown", this._onKeyDown, !1), this.renderer.on("postrender", this.update, this), (e = this.renderer.view.parentNode) === null || e === void 0 || e.appendChild(this.div));
    }, r.prototype.deactivate = function() {
      var e;
      !this._isActive || this._isMobileAccessibility || (this._isActive = !1, globalThis.document.removeEventListener("mousemove", this._onMouseMove, !0), globalThis.addEventListener("keydown", this._onKeyDown, !1), this.renderer.off("postrender", this.update), (e = this.div.parentNode) === null || e === void 0 || e.removeChild(this.div));
    }, r.prototype.updateAccessibleObjects = function(e) {
      if (!(!e.visible || !e.accessibleChildren)) {
        e.accessible && e.interactive && (e._accessibleActive || this.addChild(e), e.renderId = this.renderId);
        var t = e.children;
        if (t)
          for (var i = 0; i < t.length; i++)
            this.updateAccessibleObjects(t[i]);
      }
    }, r.prototype.update = function() {
      var e = performance.now();
      if (!(se.android.device && e < this.androidUpdateCount) && (this.androidUpdateCount = e + this.androidUpdateFrequency, !!this.renderer.renderingToScreen)) {
        this.renderer._lastObjectRendered && this.updateAccessibleObjects(this.renderer._lastObjectRendered);
        var t = this.renderer.view.getBoundingClientRect(), i = t.left, n = t.top, a = t.width, o = t.height, s = this.renderer, u = s.width, h = s.height, l = s.resolution, f = a / u * l, c = o / h * l, d = this.div;
        d.style.left = i + "px", d.style.top = n + "px", d.style.width = u + "px", d.style.height = h + "px";
        for (var p = 0; p < this.children.length; p++) {
          var v = this.children[p];
          if (v.renderId !== this.renderId)
            v._accessibleActive = !1, wr(this.children, p, 1), this.div.removeChild(v._accessibleDiv), this.pool.push(v._accessibleDiv), v._accessibleDiv = null, p--;
          else {
            d = v._accessibleDiv;
            var _ = v.hitArea, y = v.worldTransform;
            v.hitArea ? (d.style.left = (y.tx + _.x * y.a) * f + "px", d.style.top = (y.ty + _.y * y.d) * c + "px", d.style.width = _.width * y.a * f + "px", d.style.height = _.height * y.d * c + "px") : (_ = v.getBounds(), this.capHitArea(_), d.style.left = _.x * f + "px", d.style.top = _.y * c + "px", d.style.width = _.width * f + "px", d.style.height = _.height * c + "px", d.title !== v.accessibleTitle && v.accessibleTitle !== null && (d.title = v.accessibleTitle), d.getAttribute("aria-label") !== v.accessibleHint && v.accessibleHint !== null && d.setAttribute("aria-label", v.accessibleHint)), (v.accessibleTitle !== d.title || v.tabIndex !== d.tabIndex) && (d.title = v.accessibleTitle, d.tabIndex = v.tabIndex, this.debug && this.updateDebugHTML(d));
          }
        }
        this.renderId++;
      }
    }, r.prototype.updateDebugHTML = function(e) {
      e.innerHTML = "type: " + e.type + "</br> title : " + e.title + "</br> tabIndex: " + e.tabIndex;
    }, r.prototype.capHitArea = function(e) {
      e.x < 0 && (e.width += e.x, e.x = 0), e.y < 0 && (e.height += e.y, e.y = 0);
      var t = this.renderer, i = t.width, n = t.height;
      e.x + e.width > i && (e.width = i - e.x), e.y + e.height > n && (e.height = n - e.y);
    }, r.prototype.addChild = function(e) {
      var t = this.pool.pop();
      t || (t = document.createElement("button"), t.style.width = Ri + "px", t.style.height = Ri + "px", t.style.backgroundColor = this.debug ? "rgba(255,255,255,0.5)" : "transparent", t.style.position = "absolute", t.style.zIndex = Zs.toString(), t.style.borderStyle = "none", navigator.userAgent.toLowerCase().indexOf("chrome") > -1 ? t.setAttribute("aria-live", "off") : t.setAttribute("aria-live", "polite"), navigator.userAgent.match(/rv:.*Gecko\//) ? t.setAttribute("aria-relevant", "additions") : t.setAttribute("aria-relevant", "text"), t.addEventListener("click", this._onClick.bind(this)), t.addEventListener("focus", this._onFocus.bind(this)), t.addEventListener("focusout", this._onFocusOut.bind(this))), t.style.pointerEvents = e.accessiblePointerEvents, t.type = e.accessibleType, e.accessibleTitle && e.accessibleTitle !== null ? t.title = e.accessibleTitle : (!e.accessibleHint || e.accessibleHint === null) && (t.title = "displayObject " + e.tabIndex), e.accessibleHint && e.accessibleHint !== null && t.setAttribute("aria-label", e.accessibleHint), this.debug && this.updateDebugHTML(t), e._accessibleActive = !0, e._accessibleDiv = t, t.displayObject = e, this.children.push(e), this.div.appendChild(e._accessibleDiv), e._accessibleDiv.tabIndex = e.tabIndex;
    }, r.prototype._onClick = function(e) {
      var t = this.renderer.plugins.interaction, i = e.target.displayObject, n = t.eventData;
      t.dispatchEvent(i, "click", n), t.dispatchEvent(i, "pointertap", n), t.dispatchEvent(i, "tap", n);
    }, r.prototype._onFocus = function(e) {
      e.target.getAttribute("aria-live") || e.target.setAttribute("aria-live", "assertive");
      var t = this.renderer.plugins.interaction, i = e.target.displayObject, n = t.eventData;
      t.dispatchEvent(i, "mouseover", n);
    }, r.prototype._onFocusOut = function(e) {
      e.target.getAttribute("aria-live") || e.target.setAttribute("aria-live", "polite");
      var t = this.renderer.plugins.interaction, i = e.target.displayObject, n = t.eventData;
      t.dispatchEvent(i, "mouseout", n);
    }, r.prototype._onKeyDown = function(e) {
      e.keyCode === Gg && this.activate();
    }, r.prototype._onMouseMove = function(e) {
      e.movementX === 0 && e.movementY === 0 || this.deactivate();
    }, r.prototype.destroy = function() {
      this.destroyTouchHook(), this.div = null, globalThis.document.removeEventListener("mousemove", this._onMouseMove, !0), globalThis.removeEventListener("keydown", this._onKeyDown), this.pool = null, this.children = null, this.renderer = null;
    }, r.extension = {
      name: "accessibility",
      type: [
        pt.RendererPlugin,
        pt.CanvasRendererPlugin
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
var Qs = (
  /** @class */
  function() {
    function r() {
      this.pressure = 0, this.rotationAngle = 0, this.twist = 0, this.tangentialPressure = 0, this.global = new yt(), this.target = null, this.originalEvent = null, this.identifier = null, this.isPrimary = !1, this.button = 0, this.buttons = 0, this.width = 0, this.height = 0, this.tiltX = 0, this.tiltY = 0, this.pointerType = null, this.pressure = 0, this.rotationAngle = 0, this.twist = 0, this.tangentialPressure = 0;
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
    }), r.prototype.getLocalPosition = function(e, t, i) {
      return e.worldTransform.applyInverse(i || this.global, t);
    }, r.prototype.copyEvent = function(e) {
      "isPrimary" in e && e.isPrimary && (this.isPrimary = !0), this.button = "button" in e && e.button;
      var t = "buttons" in e && e.buttons;
      this.buttons = Number.isInteger(t) ? t : "which" in e && e.which, this.width = "width" in e && e.width, this.height = "height" in e && e.height, this.tiltX = "tiltX" in e && e.tiltX, this.tiltY = "tiltY" in e && e.tiltY, this.pointerType = "pointerType" in e && e.pointerType, this.pressure = "pressure" in e && e.pressure, this.rotationAngle = "rotationAngle" in e && e.rotationAngle, this.twist = "twist" in e && e.twist || 0, this.tangentialPressure = "tangentialPressure" in e && e.tangentialPressure || 0;
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
var Ga = function(r, e) {
  return Ga = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Ga(r, e);
};
function Wg(r, e) {
  Ga(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var Yg = (
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
), Zn = (
  /** @class */
  function() {
    function r(e) {
      this._pointerId = e, this._flags = r.FLAGS.NONE;
    }
    return r.prototype._doSet = function(e, t) {
      t ? this._flags = this._flags | e : this._flags = this._flags & ~e;
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
      set: function(e) {
        this._flags = e;
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
      set: function(e) {
        this._doSet(r.FLAGS.OVER, e);
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
      set: function(e) {
        this._doSet(r.FLAGS.RIGHT_DOWN, e);
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
      set: function(e) {
        this._doSet(r.FLAGS.LEFT_DOWN, e);
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
), qg = (
  /** @class */
  function() {
    function r() {
      this._tempPoint = new yt();
    }
    return r.prototype.recursiveFindHit = function(e, t, i, n, a) {
      var o;
      if (!t || !t.visible)
        return !1;
      var s = e.data.global;
      a = t.interactive || a;
      var u = !1, h = a, l = !0;
      if (t.hitArea)
        n && (t.worldTransform.applyInverse(s, this._tempPoint), t.hitArea.contains(this._tempPoint.x, this._tempPoint.y) ? u = !0 : (n = !1, l = !1)), h = !1;
      else if (t._mask && n) {
        var f = t._mask.isMaskData ? t._mask.maskObject : t._mask;
        f && !(!((o = f.containsPoint) === null || o === void 0) && o.call(f, s)) && (n = !1);
      }
      if (l && t.interactiveChildren && t.children)
        for (var c = t.children, d = c.length - 1; d >= 0; d--) {
          var p = c[d], v = this.recursiveFindHit(e, p, i, n, h);
          if (v) {
            if (!p.parent)
              continue;
            h = !1, v && (e.target && (n = !1), u = !0);
          }
        }
      return a && (n && !e.target && !t.hitArea && t.containsPoint && t.containsPoint(s) && (u = !0), t.interactive && (u && !e.target && (e.target = t), i && i(e, t, !!u))), u;
    }, r.prototype.findHit = function(e, t, i, n) {
      this.recursiveFindHit(e, t, i, n, !1);
    }, r;
  }()
), Kg = {
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
At.mixin(Kg);
var Oi = 1, Ii = {
  target: null,
  data: {
    global: null
  }
}, Zg = (
  /** @class */
  function(r) {
    Wg(e, r);
    function e(t, i) {
      var n = r.call(this) || this;
      return i = i || {}, n.renderer = t, n.autoPreventDefault = i.autoPreventDefault !== void 0 ? i.autoPreventDefault : !0, n.interactionFrequency = i.interactionFrequency || 10, n.mouse = new Qs(), n.mouse.identifier = Oi, n.mouse.global.set(-999999), n.activeInteractionData = {}, n.activeInteractionData[Oi] = n.mouse, n.interactionDataPool = [], n.eventData = new Yg(), n.interactionDOMElement = null, n.moveWhenInside = !1, n.eventsAdded = !1, n.tickerAdded = !1, n.mouseOverRenderer = !("PointerEvent" in globalThis), n.supportsTouchEvents = "ontouchstart" in globalThis, n.supportsPointerEvents = !!globalThis.PointerEvent, n.onPointerUp = n.onPointerUp.bind(n), n.processPointerUp = n.processPointerUp.bind(n), n.onPointerCancel = n.onPointerCancel.bind(n), n.processPointerCancel = n.processPointerCancel.bind(n), n.onPointerDown = n.onPointerDown.bind(n), n.processPointerDown = n.processPointerDown.bind(n), n.onPointerMove = n.onPointerMove.bind(n), n.processPointerMove = n.processPointerMove.bind(n), n.onPointerOut = n.onPointerOut.bind(n), n.processPointerOverOut = n.processPointerOverOut.bind(n), n.onPointerOver = n.onPointerOver.bind(n), n.cursorStyles = {
        default: "inherit",
        pointer: "pointer"
      }, n.currentCursorMode = null, n.cursor = null, n.resolution = 1, n.delayedEvents = [], n.search = new qg(), n._tempDisplayObject = new Ph(), n._eventListenerOptions = { capture: !0, passive: !1 }, n._useSystemTicker = i.useSystemTicker !== void 0 ? i.useSystemTicker : !0, n.setTargetElement(n.renderer.view, n.renderer.resolution), n;
    }
    return Object.defineProperty(e.prototype, "useSystemTicker", {
      /**
       * Should the InteractionManager automatically add {@link tickerUpdate} to {@link PIXI.Ticker.system}.
       * @default true
       */
      get: function() {
        return this._useSystemTicker;
      },
      set: function(t) {
        this._useSystemTicker = t, t ? this.addTickerListener() : this.removeTickerListener();
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "lastObjectRendered", {
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
    }), e.prototype.hitTest = function(t, i) {
      return Ii.target = null, Ii.data.global = t, i || (i = this.lastObjectRendered), this.processInteractive(Ii, i, null, !0), Ii.target;
    }, e.prototype.setTargetElement = function(t, i) {
      i === void 0 && (i = 1), this.removeTickerListener(), this.removeEvents(), this.interactionDOMElement = t, this.resolution = i, this.addEvents(), this.addTickerListener();
    }, e.prototype.addTickerListener = function() {
      this.tickerAdded || !this.interactionDOMElement || !this._useSystemTicker || (Lt.system.add(this.tickerUpdate, this, Ee.INTERACTION), this.tickerAdded = !0);
    }, e.prototype.removeTickerListener = function() {
      this.tickerAdded && (Lt.system.remove(this.tickerUpdate, this), this.tickerAdded = !1);
    }, e.prototype.addEvents = function() {
      if (!(this.eventsAdded || !this.interactionDOMElement)) {
        var t = this.interactionDOMElement.style;
        globalThis.navigator.msPointerEnabled ? (t.msContentZooming = "none", t.msTouchAction = "none") : this.supportsPointerEvents && (t.touchAction = "none"), this.supportsPointerEvents ? (globalThis.document.addEventListener("pointermove", this.onPointerMove, this._eventListenerOptions), this.interactionDOMElement.addEventListener("pointerdown", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.addEventListener("pointerleave", this.onPointerOut, this._eventListenerOptions), this.interactionDOMElement.addEventListener("pointerover", this.onPointerOver, this._eventListenerOptions), globalThis.addEventListener("pointercancel", this.onPointerCancel, this._eventListenerOptions), globalThis.addEventListener("pointerup", this.onPointerUp, this._eventListenerOptions)) : (globalThis.document.addEventListener("mousemove", this.onPointerMove, this._eventListenerOptions), this.interactionDOMElement.addEventListener("mousedown", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.addEventListener("mouseout", this.onPointerOut, this._eventListenerOptions), this.interactionDOMElement.addEventListener("mouseover", this.onPointerOver, this._eventListenerOptions), globalThis.addEventListener("mouseup", this.onPointerUp, this._eventListenerOptions)), this.supportsTouchEvents && (this.interactionDOMElement.addEventListener("touchstart", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.addEventListener("touchcancel", this.onPointerCancel, this._eventListenerOptions), this.interactionDOMElement.addEventListener("touchend", this.onPointerUp, this._eventListenerOptions), this.interactionDOMElement.addEventListener("touchmove", this.onPointerMove, this._eventListenerOptions)), this.eventsAdded = !0;
      }
    }, e.prototype.removeEvents = function() {
      if (!(!this.eventsAdded || !this.interactionDOMElement)) {
        var t = this.interactionDOMElement.style;
        globalThis.navigator.msPointerEnabled ? (t.msContentZooming = "", t.msTouchAction = "") : this.supportsPointerEvents && (t.touchAction = ""), this.supportsPointerEvents ? (globalThis.document.removeEventListener("pointermove", this.onPointerMove, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("pointerdown", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("pointerleave", this.onPointerOut, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("pointerover", this.onPointerOver, this._eventListenerOptions), globalThis.removeEventListener("pointercancel", this.onPointerCancel, this._eventListenerOptions), globalThis.removeEventListener("pointerup", this.onPointerUp, this._eventListenerOptions)) : (globalThis.document.removeEventListener("mousemove", this.onPointerMove, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("mousedown", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("mouseout", this.onPointerOut, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("mouseover", this.onPointerOver, this._eventListenerOptions), globalThis.removeEventListener("mouseup", this.onPointerUp, this._eventListenerOptions)), this.supportsTouchEvents && (this.interactionDOMElement.removeEventListener("touchstart", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("touchcancel", this.onPointerCancel, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("touchend", this.onPointerUp, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("touchmove", this.onPointerMove, this._eventListenerOptions)), this.interactionDOMElement = null, this.eventsAdded = !1;
      }
    }, e.prototype.tickerUpdate = function(t) {
      this._deltaTime += t, !(this._deltaTime < this.interactionFrequency) && (this._deltaTime = 0, this.update());
    }, e.prototype.update = function() {
      if (this.interactionDOMElement) {
        if (this._didMove) {
          this._didMove = !1;
          return;
        }
        this.cursor = null;
        for (var t in this.activeInteractionData)
          if (this.activeInteractionData.hasOwnProperty(t)) {
            var i = this.activeInteractionData[t];
            if (i.originalEvent && i.pointerType !== "touch") {
              var n = this.configureInteractionEventForDOMEvent(this.eventData, i.originalEvent, i);
              this.processInteractive(n, this.lastObjectRendered, this.processPointerOverOut, !0);
            }
          }
        this.setCursorMode(this.cursor);
      }
    }, e.prototype.setCursorMode = function(t) {
      t = t || "default";
      var i = !0;
      if (globalThis.OffscreenCanvas && this.interactionDOMElement instanceof OffscreenCanvas && (i = !1), this.currentCursorMode !== t) {
        this.currentCursorMode = t;
        var n = this.cursorStyles[t];
        if (n)
          switch (typeof n) {
            case "string":
              i && (this.interactionDOMElement.style.cursor = n);
              break;
            case "function":
              n(t);
              break;
            case "object":
              i && Object.assign(this.interactionDOMElement.style, n);
              break;
          }
        else
          i && typeof t == "string" && !Object.prototype.hasOwnProperty.call(this.cursorStyles, t) && (this.interactionDOMElement.style.cursor = t);
      }
    }, e.prototype.dispatchEvent = function(t, i, n) {
      (!n.stopPropagationHint || t === n.stopsPropagatingAt) && (n.currentTarget = t, n.type = i, t.emit(i, n), t[i] && t[i](n));
    }, e.prototype.delayDispatchEvent = function(t, i, n) {
      this.delayedEvents.push({ displayObject: t, eventString: i, eventData: n });
    }, e.prototype.mapPositionToPoint = function(t, i, n) {
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
      t.x = (i - a.left) * (this.interactionDOMElement.width / a.width) * o, t.y = (n - a.top) * (this.interactionDOMElement.height / a.height) * o;
    }, e.prototype.processInteractive = function(t, i, n, a) {
      var o = this.search.findHit(t, i, n, a), s = this.delayedEvents;
      if (!s.length)
        return o;
      t.stopPropagationHint = !1;
      var u = s.length;
      this.delayedEvents = [];
      for (var h = 0; h < u; h++) {
        var l = s[h], f = l.displayObject, c = l.eventString, d = l.eventData;
        d.stopsPropagatingAt === f && (d.stopPropagationHint = !0), this.dispatchEvent(f, c, d);
      }
      return o;
    }, e.prototype.onPointerDown = function(t) {
      if (!(this.supportsTouchEvents && t.pointerType === "touch")) {
        var i = this.normalizeToPointerData(t);
        if (this.autoPreventDefault && i[0].isNormalized) {
          var n = t.cancelable || !("cancelable" in t);
          n && t.preventDefault();
        }
        for (var a = i.length, o = 0; o < a; o++) {
          var s = i[o], u = this.getInteractionDataForPointerId(s), h = this.configureInteractionEventForDOMEvent(this.eventData, s, u);
          if (h.data.originalEvent = t, this.processInteractive(h, this.lastObjectRendered, this.processPointerDown, !0), this.emit("pointerdown", h), s.pointerType === "touch")
            this.emit("touchstart", h);
          else if (s.pointerType === "mouse" || s.pointerType === "pen") {
            var l = s.button === 2;
            this.emit(l ? "rightdown" : "mousedown", this.eventData);
          }
        }
      }
    }, e.prototype.processPointerDown = function(t, i, n) {
      var a = t.data, o = t.data.identifier;
      if (n) {
        if (i.trackedPointers[o] || (i.trackedPointers[o] = new Zn(o)), this.dispatchEvent(i, "pointerdown", t), a.pointerType === "touch")
          this.dispatchEvent(i, "touchstart", t);
        else if (a.pointerType === "mouse" || a.pointerType === "pen") {
          var s = a.button === 2;
          s ? i.trackedPointers[o].rightDown = !0 : i.trackedPointers[o].leftDown = !0, this.dispatchEvent(i, s ? "rightdown" : "mousedown", t);
        }
      }
    }, e.prototype.onPointerComplete = function(t, i, n) {
      var a = this.normalizeToPointerData(t), o = a.length, s = t.target;
      t.composedPath && t.composedPath().length > 0 && (s = t.composedPath()[0]);
      for (var u = s !== this.interactionDOMElement ? "outside" : "", h = 0; h < o; h++) {
        var l = a[h], f = this.getInteractionDataForPointerId(l), c = this.configureInteractionEventForDOMEvent(this.eventData, l, f);
        if (c.data.originalEvent = t, this.processInteractive(c, this.lastObjectRendered, n, i || !u), this.emit(i ? "pointercancel" : "pointerup" + u, c), l.pointerType === "mouse" || l.pointerType === "pen") {
          var d = l.button === 2;
          this.emit(d ? "rightup" + u : "mouseup" + u, c);
        } else
          l.pointerType === "touch" && (this.emit(i ? "touchcancel" : "touchend" + u, c), this.releaseInteractionDataForPointerId(l.pointerId));
      }
    }, e.prototype.onPointerCancel = function(t) {
      this.supportsTouchEvents && t.pointerType === "touch" || this.onPointerComplete(t, !0, this.processPointerCancel);
    }, e.prototype.processPointerCancel = function(t, i) {
      var n = t.data, a = t.data.identifier;
      i.trackedPointers[a] !== void 0 && (delete i.trackedPointers[a], this.dispatchEvent(i, "pointercancel", t), n.pointerType === "touch" && this.dispatchEvent(i, "touchcancel", t));
    }, e.prototype.onPointerUp = function(t) {
      this.supportsTouchEvents && t.pointerType === "touch" || this.onPointerComplete(t, !1, this.processPointerUp);
    }, e.prototype.processPointerUp = function(t, i, n) {
      var a = t.data, o = t.data.identifier, s = i.trackedPointers[o], u = a.pointerType === "touch", h = a.pointerType === "mouse" || a.pointerType === "pen", l = !1;
      if (h) {
        var f = a.button === 2, c = Zn.FLAGS, d = f ? c.RIGHT_DOWN : c.LEFT_DOWN, p = s !== void 0 && s.flags & d;
        n ? (this.dispatchEvent(i, f ? "rightup" : "mouseup", t), p && (this.dispatchEvent(i, f ? "rightclick" : "click", t), l = !0)) : p && this.dispatchEvent(i, f ? "rightupoutside" : "mouseupoutside", t), s && (f ? s.rightDown = !1 : s.leftDown = !1);
      }
      n ? (this.dispatchEvent(i, "pointerup", t), u && this.dispatchEvent(i, "touchend", t), s && ((!h || l) && this.dispatchEvent(i, "pointertap", t), u && (this.dispatchEvent(i, "tap", t), s.over = !1))) : s && (this.dispatchEvent(i, "pointerupoutside", t), u && this.dispatchEvent(i, "touchendoutside", t)), s && s.none && delete i.trackedPointers[o];
    }, e.prototype.onPointerMove = function(t) {
      if (!(this.supportsTouchEvents && t.pointerType === "touch")) {
        var i = this.normalizeToPointerData(t);
        (i[0].pointerType === "mouse" || i[0].pointerType === "pen") && (this._didMove = !0, this.cursor = null);
        for (var n = i.length, a = 0; a < n; a++) {
          var o = i[a], s = this.getInteractionDataForPointerId(o), u = this.configureInteractionEventForDOMEvent(this.eventData, o, s);
          u.data.originalEvent = t, this.processInteractive(u, this.lastObjectRendered, this.processPointerMove, !0), this.emit("pointermove", u), o.pointerType === "touch" && this.emit("touchmove", u), (o.pointerType === "mouse" || o.pointerType === "pen") && this.emit("mousemove", u);
        }
        i[0].pointerType === "mouse" && this.setCursorMode(this.cursor);
      }
    }, e.prototype.processPointerMove = function(t, i, n) {
      var a = t.data, o = a.pointerType === "touch", s = a.pointerType === "mouse" || a.pointerType === "pen";
      s && this.processPointerOverOut(t, i, n), (!this.moveWhenInside || n) && (this.dispatchEvent(i, "pointermove", t), o && this.dispatchEvent(i, "touchmove", t), s && this.dispatchEvent(i, "mousemove", t));
    }, e.prototype.onPointerOut = function(t) {
      if (!(this.supportsTouchEvents && t.pointerType === "touch")) {
        var i = this.normalizeToPointerData(t), n = i[0];
        n.pointerType === "mouse" && (this.mouseOverRenderer = !1, this.setCursorMode(null));
        var a = this.getInteractionDataForPointerId(n), o = this.configureInteractionEventForDOMEvent(this.eventData, n, a);
        o.data.originalEvent = n, this.processInteractive(o, this.lastObjectRendered, this.processPointerOverOut, !1), this.emit("pointerout", o), n.pointerType === "mouse" || n.pointerType === "pen" ? this.emit("mouseout", o) : this.releaseInteractionDataForPointerId(a.identifier);
      }
    }, e.prototype.processPointerOverOut = function(t, i, n) {
      var a = t.data, o = t.data.identifier, s = a.pointerType === "mouse" || a.pointerType === "pen", u = i.trackedPointers[o];
      n && !u && (u = i.trackedPointers[o] = new Zn(o)), u !== void 0 && (n && this.mouseOverRenderer ? (u.over || (u.over = !0, this.delayDispatchEvent(i, "pointerover", t), s && this.delayDispatchEvent(i, "mouseover", t)), s && this.cursor === null && (this.cursor = i.cursor)) : u.over && (u.over = !1, this.dispatchEvent(i, "pointerout", this.eventData), s && this.dispatchEvent(i, "mouseout", t), u.none && delete i.trackedPointers[o]));
    }, e.prototype.onPointerOver = function(t) {
      if (!(this.supportsTouchEvents && t.pointerType === "touch")) {
        var i = this.normalizeToPointerData(t), n = i[0], a = this.getInteractionDataForPointerId(n), o = this.configureInteractionEventForDOMEvent(this.eventData, n, a);
        o.data.originalEvent = n, n.pointerType === "mouse" && (this.mouseOverRenderer = !0), this.emit("pointerover", o), (n.pointerType === "mouse" || n.pointerType === "pen") && this.emit("mouseover", o);
      }
    }, e.prototype.getInteractionDataForPointerId = function(t) {
      var i = t.pointerId, n;
      return i === Oi || t.pointerType === "mouse" ? n = this.mouse : this.activeInteractionData[i] ? n = this.activeInteractionData[i] : (n = this.interactionDataPool.pop() || new Qs(), n.identifier = i, this.activeInteractionData[i] = n), n.copyEvent(t), n;
    }, e.prototype.releaseInteractionDataForPointerId = function(t) {
      var i = this.activeInteractionData[t];
      i && (delete this.activeInteractionData[t], i.reset(), this.interactionDataPool.push(i));
    }, e.prototype.configureInteractionEventForDOMEvent = function(t, i, n) {
      return t.data = n, this.mapPositionToPoint(n.global, i.clientX, i.clientY), i.pointerType === "touch" && (i.globalX = n.global.x, i.globalY = n.global.y), n.originalEvent = i, t.reset(), t;
    }, e.prototype.normalizeToPointerData = function(t) {
      var i = [];
      if (this.supportsTouchEvents && t instanceof TouchEvent)
        for (var n = 0, a = t.changedTouches.length; n < a; n++) {
          var o = t.changedTouches[n];
          typeof o.button > "u" && (o.button = t.touches.length ? 1 : 0), typeof o.buttons > "u" && (o.buttons = t.touches.length ? 1 : 0), typeof o.isPrimary > "u" && (o.isPrimary = t.touches.length === 1 && t.type === "touchstart"), typeof o.width > "u" && (o.width = o.radiusX || 1), typeof o.height > "u" && (o.height = o.radiusY || 1), typeof o.tiltX > "u" && (o.tiltX = 0), typeof o.tiltY > "u" && (o.tiltY = 0), typeof o.pointerType > "u" && (o.pointerType = "touch"), typeof o.pointerId > "u" && (o.pointerId = o.identifier || 0), typeof o.pressure > "u" && (o.pressure = o.force || 0.5), typeof o.twist > "u" && (o.twist = 0), typeof o.tangentialPressure > "u" && (o.tangentialPressure = 0), typeof o.layerX > "u" && (o.layerX = o.offsetX = o.clientX), typeof o.layerY > "u" && (o.layerY = o.offsetY = o.clientY), o.isNormalized = !0, i.push(o);
        }
      else if (!globalThis.MouseEvent || t instanceof MouseEvent && (!this.supportsPointerEvents || !(t instanceof globalThis.PointerEvent))) {
        var s = t;
        typeof s.isPrimary > "u" && (s.isPrimary = !0), typeof s.width > "u" && (s.width = 1), typeof s.height > "u" && (s.height = 1), typeof s.tiltX > "u" && (s.tiltX = 0), typeof s.tiltY > "u" && (s.tiltY = 0), typeof s.pointerType > "u" && (s.pointerType = "mouse"), typeof s.pointerId > "u" && (s.pointerId = Oi), typeof s.pressure > "u" && (s.pressure = 0.5), typeof s.twist > "u" && (s.twist = 0), typeof s.tangentialPressure > "u" && (s.tangentialPressure = 0), s.isNormalized = !0, i.push(s);
      } else
        i.push(t);
      return i;
    }, e.prototype.destroy = function() {
      this.removeEvents(), this.removeTickerListener(), this.removeAllListeners(), this.renderer = null, this.mouse = null, this.eventData = null, this.interactionDOMElement = null, this.onPointerDown = null, this.processPointerDown = null, this.onPointerUp = null, this.processPointerUp = null, this.onPointerCancel = null, this.processPointerCancel = null, this.onPointerMove = null, this.processPointerMove = null, this.onPointerOut = null, this.processPointerOverOut = null, this.onPointerOver = null, this.search = null;
    }, e.extension = {
      name: "interaction",
      type: [
        pt.RendererPlugin,
        pt.CanvasRendererPlugin
      ]
    }, e;
  }(ai)
);
/*!
 * @pixi/extract - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/extract is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var $g = new it(), Qg = 4, Jg = (
  /** @class */
  function() {
    function r(e) {
      this.renderer = e;
    }
    return r.prototype.image = function(e, t, i) {
      var n = new Image();
      return n.src = this.base64(e, t, i), n;
    }, r.prototype.base64 = function(e, t, i) {
      return this.canvas(e).toDataURL(t, i);
    }, r.prototype.canvas = function(e, t) {
      var i = this._rawPixels(e, t), n = i.pixels, a = i.width, o = i.height, s = i.flipY, u = new Ns(a, o, 1), h = u.context.getImageData(0, 0, a, o);
      if (r.arrayPostDivide(n, h.data), u.context.putImageData(h, 0, 0), s) {
        var l = new Ns(u.width, u.height, 1);
        l.context.scale(1, -1), l.context.drawImage(u.canvas, 0, -o), u.destroy(), u = l;
      }
      return u.canvas;
    }, r.prototype.pixels = function(e, t) {
      var i = this._rawPixels(e, t).pixels;
      return r.arrayPostDivide(i, i), i;
    }, r.prototype._rawPixels = function(e, t) {
      var i = this.renderer, n, a = !1, o, s = !1;
      if (e)
        if (e instanceof ir)
          o = e;
        else {
          var u = i.context.webGLVersion >= 2 ? i.multisample : gt.NONE;
          if (o = this.renderer.generateTexture(e, { multisample: u }), u !== gt.NONE) {
            var h = ir.create({
              width: o.width,
              height: o.height
            });
            i.framebuffer.bind(o.framebuffer), i.framebuffer.blit(h.framebuffer), i.framebuffer.bind(null), o.destroy(!0), o = h;
          }
          s = !0;
        }
      o ? (n = o.baseTexture.resolution, t = t ?? o.frame, a = !1, i.renderTexture.bind(o)) : (n = i.resolution, t || (t = $g, t.width = i.width, t.height = i.height), a = !0, i.renderTexture.bind(null));
      var l = Math.round(t.width * n), f = Math.round(t.height * n), c = new Uint8Array(Qg * l * f), d = i.gl;
      return d.readPixels(Math.round(t.x * n), Math.round(t.y * n), l, f, d.RGBA, d.UNSIGNED_BYTE, c), s && o.destroy(!0), { pixels: c, width: l, height: f, flipY: a };
    }, r.prototype.destroy = function() {
      this.renderer = null;
    }, r.arrayPostDivide = function(e, t) {
      for (var i = 0; i < e.length; i += 4) {
        var n = t[i + 3] = e[i + 3];
        n !== 0 ? (t[i] = Math.round(Math.min(e[i] * 255 / n, 255)), t[i + 1] = Math.round(Math.min(e[i + 1] * 255 / n, 255)), t[i + 2] = Math.round(Math.min(e[i + 2] * 255 / n, 255))) : (t[i] = e[i], t[i + 1] = e[i + 1], t[i + 2] = e[i + 2]);
      }
    }, r.extension = {
      name: "extract",
      type: pt.RendererPlugin
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
var Ci = (
  /** @class */
  function() {
    function r(e, t, i) {
      t === void 0 && (t = !1), this._fn = e, this._once = t, this._thisArg = i, this._next = this._prev = this._owner = null;
    }
    return r.prototype.detach = function() {
      return this._owner === null ? !1 : (this._owner.detach(this), !0);
    }, r;
  }()
);
function Js(r, e) {
  return r._head ? (r._tail._next = e, e._prev = r._tail, r._tail = e) : (r._head = e, r._tail = e), e._owner = r, e;
}
var ye = (
  /** @class */
  function() {
    function r() {
      this._head = this._tail = void 0;
    }
    return r.prototype.handlers = function(e) {
      e === void 0 && (e = !1);
      var t = this._head;
      if (e)
        return !!t;
      for (var i = []; t; )
        i.push(t), t = t._next;
      return i;
    }, r.prototype.has = function(e) {
      if (!(e instanceof Ci))
        throw new Error("MiniSignal#has(): First arg must be a SignalBinding object.");
      return e._owner === this;
    }, r.prototype.dispatch = function() {
      for (var e = arguments, t = [], i = 0; i < arguments.length; i++)
        t[i] = e[i];
      var n = this._head;
      if (!n)
        return !1;
      for (; n; )
        n._once && this.detach(n), n._fn.apply(n._thisArg, t), n = n._next;
      return !0;
    }, r.prototype.add = function(e, t) {
      if (t === void 0 && (t = null), typeof e != "function")
        throw new Error("MiniSignal#add(): First arg must be a Function.");
      return Js(this, new Ci(e, !1, t));
    }, r.prototype.once = function(e, t) {
      if (t === void 0 && (t = null), typeof e != "function")
        throw new Error("MiniSignal#once(): First arg must be a Function.");
      return Js(this, new Ci(e, !0, t));
    }, r.prototype.detach = function(e) {
      if (!(e instanceof Ci))
        throw new Error("MiniSignal#detach(): First arg must be a SignalBinding object.");
      return e._owner !== this ? this : (e._prev && (e._prev._next = e._next), e._next && (e._next._prev = e._prev), e === this._head ? (this._head = e._next, e._next === null && (this._tail = null)) : e === this._tail && (this._tail = e._prev, this._tail._next = null), e._owner = null, this);
    }, r.prototype.detachAll = function() {
      var e = this._head;
      if (!e)
        return this;
      for (this._head = this._tail = null; e; )
        e._owner = null, e = e._next;
      return this;
    }, r;
  }()
);
function Vh(r, e) {
  e = e || {};
  for (var t = {
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
  }, i = t.parser[e.strictMode ? "strict" : "loose"].exec(r), n = {}, a = 14; a--; )
    n[t.key[a]] = i[a] || "";
  return n[t.q.name] = {}, n[t.key[12]].replace(t.q.parser, function(o, s, u) {
    s && (n[t.q.name][s] = u);
  }), n;
}
var $n, Mi = null, tm = 0, tu = 200, em = 204, rm = 1223, im = 2;
function eu() {
}
function ru(r, e, t) {
  e && e.indexOf(".") === 0 && (e = e.substring(1)), e && (r[e] = t);
}
function Qn(r) {
  return r.toString().replace("object ", "");
}
var wt = (
  /** @class */
  function() {
    function r(e, t, i) {
      if (this._dequeue = eu, this._onLoadBinding = null, this._elementTimer = 0, this._boundComplete = null, this._boundOnError = null, this._boundOnProgress = null, this._boundOnTimeout = null, this._boundXhrOnError = null, this._boundXhrOnTimeout = null, this._boundXhrOnAbort = null, this._boundXhrOnLoad = null, typeof e != "string" || typeof t != "string")
        throw new Error("Both name and url are required for constructing a resource.");
      i = i || {}, this._flags = 0, this._setFlag(r.STATUS_FLAGS.DATA_URL, t.indexOf("data:") === 0), this.name = e, this.url = t, this.extension = this._getExtension(), this.data = null, this.crossOrigin = i.crossOrigin === !0 ? "anonymous" : i.crossOrigin, this.timeout = i.timeout || 0, this.loadType = i.loadType || this._determineLoadType(), this.xhrType = i.xhrType, this.metadata = i.metadata || {}, this.error = null, this.xhr = null, this.children = [], this.type = r.TYPE.UNKNOWN, this.progressChunk = 0, this._dequeue = eu, this._onLoadBinding = null, this._elementTimer = 0, this._boundComplete = this.complete.bind(this), this._boundOnError = this._onError.bind(this), this._boundOnProgress = this._onProgress.bind(this), this._boundOnTimeout = this._onTimeout.bind(this), this._boundXhrOnError = this._xhrOnError.bind(this), this._boundXhrOnTimeout = this._xhrOnTimeout.bind(this), this._boundXhrOnAbort = this._xhrOnAbort.bind(this), this._boundXhrOnLoad = this._xhrOnLoad.bind(this), this.onStart = new ye(), this.onProgress = new ye(), this.onComplete = new ye(), this.onAfterMiddleware = new ye();
    }
    return r.setExtensionLoadType = function(e, t) {
      ru(r._loadTypeMap, e, t);
    }, r.setExtensionXhrType = function(e, t) {
      ru(r._xhrTypeMap, e, t);
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
    }, r.prototype.abort = function(e) {
      if (!this.error) {
        if (this.error = new Error(e), this._clearEvents(), this.xhr)
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
    }, r.prototype.load = function(e) {
      var t = this;
      if (!this.isLoading) {
        if (this.isComplete) {
          e && setTimeout(function() {
            return e(t);
          }, 1);
          return;
        } else
          e && this.onComplete.once(e);
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
            typeof $n > "u" && ($n = !!(globalThis.XDomainRequest && !("withCredentials" in new XMLHttpRequest()))), $n && this.crossOrigin ? this._loadXdr() : this._loadXhr();
            break;
        }
      }
    }, r.prototype._hasFlag = function(e) {
      return (this._flags & e) !== 0;
    }, r.prototype._setFlag = function(e, t) {
      this._flags = t ? this._flags | e : this._flags & ~e;
    }, r.prototype._clearEvents = function() {
      clearTimeout(this._elementTimer), this.data && this.data.removeEventListener && (this.data.removeEventListener("error", this._boundOnError, !1), this.data.removeEventListener("load", this._boundComplete, !1), this.data.removeEventListener("progress", this._boundOnProgress, !1), this.data.removeEventListener("canplaythrough", this._boundComplete, !1)), this.xhr && (this.xhr.removeEventListener ? (this.xhr.removeEventListener("error", this._boundXhrOnError, !1), this.xhr.removeEventListener("timeout", this._boundXhrOnTimeout, !1), this.xhr.removeEventListener("abort", this._boundXhrOnAbort, !1), this.xhr.removeEventListener("progress", this._boundOnProgress, !1), this.xhr.removeEventListener("load", this._boundXhrOnLoad, !1)) : (this.xhr.onerror = null, this.xhr.ontimeout = null, this.xhr.onprogress = null, this.xhr.onload = null));
    }, r.prototype._finish = function() {
      if (this.isComplete)
        throw new Error("Complete called again for an already completed resource.");
      this._setFlag(r.STATUS_FLAGS.COMPLETE, !0), this._setFlag(r.STATUS_FLAGS.LOADING, !1), this.onComplete.dispatch(this);
    }, r.prototype._loadElement = function(e) {
      this.metadata.loadElement ? this.data = this.metadata.loadElement : e === "image" && typeof globalThis.Image < "u" ? this.data = new Image() : this.data = document.createElement(e), this.crossOrigin && (this.data.crossOrigin = this.crossOrigin), this.metadata.skipSource || (this.data.src = this.url), this.data.addEventListener("error", this._boundOnError, !1), this.data.addEventListener("load", this._boundComplete, !1), this.data.addEventListener("progress", this._boundOnProgress, !1), this.timeout && (this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout));
    }, r.prototype._loadSourceElement = function(e) {
      if (this.metadata.loadElement ? this.data = this.metadata.loadElement : e === "audio" && typeof globalThis.Audio < "u" ? this.data = new Audio() : this.data = document.createElement(e), this.data === null) {
        this.abort("Unsupported element: " + e);
        return;
      }
      if (this.crossOrigin && (this.data.crossOrigin = this.crossOrigin), !this.metadata.skipSource)
        if (navigator.isCocoonJS)
          this.data.src = Array.isArray(this.url) ? this.url[0] : this.url;
        else if (Array.isArray(this.url))
          for (var t = this.metadata.mimeType, i = 0; i < this.url.length; ++i)
            this.data.appendChild(this._createSource(e, this.url[i], Array.isArray(t) ? t[i] : t));
        else {
          var t = this.metadata.mimeType;
          this.data.appendChild(this._createSource(e, this.url, Array.isArray(t) ? t[0] : t));
        }
      this.data.addEventListener("error", this._boundOnError, !1), this.data.addEventListener("load", this._boundComplete, !1), this.data.addEventListener("progress", this._boundOnProgress, !1), this.data.addEventListener("canplaythrough", this._boundComplete, !1), this.data.load(), this.timeout && (this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout));
    }, r.prototype._loadXhr = function() {
      typeof this.xhrType != "string" && (this.xhrType = this._determineXhrType());
      var e = this.xhr = new XMLHttpRequest();
      this.crossOrigin === "use-credentials" && (e.withCredentials = !0), e.open("GET", this.url, !0), e.timeout = this.timeout, this.xhrType === r.XHR_RESPONSE_TYPE.JSON || this.xhrType === r.XHR_RESPONSE_TYPE.DOCUMENT ? e.responseType = r.XHR_RESPONSE_TYPE.TEXT : e.responseType = this.xhrType, e.addEventListener("error", this._boundXhrOnError, !1), e.addEventListener("timeout", this._boundXhrOnTimeout, !1), e.addEventListener("abort", this._boundXhrOnAbort, !1), e.addEventListener("progress", this._boundOnProgress, !1), e.addEventListener("load", this._boundXhrOnLoad, !1), e.send();
    }, r.prototype._loadXdr = function() {
      typeof this.xhrType != "string" && (this.xhrType = this._determineXhrType());
      var e = this.xhr = new globalThis.XDomainRequest();
      e.timeout = this.timeout || 5e3, e.onerror = this._boundXhrOnError, e.ontimeout = this._boundXhrOnTimeout, e.onprogress = this._boundOnProgress, e.onload = this._boundXhrOnLoad, e.open("GET", this.url, !0), setTimeout(function() {
        return e.send();
      }, 1);
    }, r.prototype._createSource = function(e, t, i) {
      i || (i = e + "/" + this._getExtension(t));
      var n = document.createElement("source");
      return n.src = t, n.type = i, n;
    }, r.prototype._onError = function(e) {
      this.abort("Failed to load element using: " + e.target.nodeName);
    }, r.prototype._onProgress = function(e) {
      e && e.lengthComputable && this.onProgress.dispatch(this, e.loaded / e.total);
    }, r.prototype._onTimeout = function() {
      this.abort("Load timed out.");
    }, r.prototype._xhrOnError = function() {
      var e = this.xhr;
      this.abort(Qn(e) + " Request failed. Status: " + e.status + ', text: "' + e.statusText + '"');
    }, r.prototype._xhrOnTimeout = function() {
      var e = this.xhr;
      this.abort(Qn(e) + " Request timed out.");
    }, r.prototype._xhrOnAbort = function() {
      var e = this.xhr;
      this.abort(Qn(e) + " Request was aborted by the user.");
    }, r.prototype._xhrOnLoad = function() {
      var e = this.xhr, t = "", i = typeof e.status > "u" ? tu : e.status;
      (e.responseType === "" || e.responseType === "text" || typeof e.responseType > "u") && (t = e.responseText), i === tm && (t.length > 0 || e.responseType === r.XHR_RESPONSE_TYPE.BUFFER) ? i = tu : i === rm && (i = em);
      var n = i / 100 | 0;
      if (n === im)
        if (this.xhrType === r.XHR_RESPONSE_TYPE.TEXT)
          this.data = t, this.type = r.TYPE.TEXT;
        else if (this.xhrType === r.XHR_RESPONSE_TYPE.JSON)
          try {
            this.data = JSON.parse(t), this.type = r.TYPE.JSON;
          } catch (s) {
            this.abort("Error trying to parse loaded json: " + s);
            return;
          }
        else if (this.xhrType === r.XHR_RESPONSE_TYPE.DOCUMENT)
          try {
            if (globalThis.DOMParser) {
              var a = new DOMParser();
              this.data = a.parseFromString(t, "text/xml");
            } else {
              var o = document.createElement("div");
              o.innerHTML = t, this.data = o;
            }
            this.type = r.TYPE.XML;
          } catch (s) {
            this.abort("Error trying to parse loaded xml: " + s);
            return;
          }
        else
          this.data = e.response || t;
      else {
        this.abort("[" + e.status + "] " + e.statusText + ": " + e.responseURL);
        return;
      }
      this.complete();
    }, r.prototype._determineCrossOrigin = function(e, t) {
      if (e.indexOf("data:") === 0)
        return "";
      if (globalThis.origin !== globalThis.location.origin)
        return "anonymous";
      t = t || globalThis.location, Mi || (Mi = document.createElement("a")), Mi.href = e;
      var i = Vh(Mi.href, { strictMode: !0 }), n = !i.port && t.port === "" || i.port === t.port, a = i.protocol ? i.protocol + ":" : "";
      return i.host !== t.hostname || !n || a !== t.protocol ? "anonymous" : "";
    }, r.prototype._determineXhrType = function() {
      return r._xhrTypeMap[this.extension] || r.XHR_RESPONSE_TYPE.TEXT;
    }, r.prototype._determineLoadType = function() {
      return r._loadTypeMap[this.extension] || r.LOAD_TYPE.XHR;
    }, r.prototype._getExtension = function(e) {
      e === void 0 && (e = this.url);
      var t = "";
      if (this.isDataUrl) {
        var i = e.indexOf("/");
        t = e.substring(i + 1, e.indexOf(";", i));
      } else {
        var n = e.indexOf("?"), a = e.indexOf("#"), o = Math.min(n > -1 ? n : e.length, a > -1 ? a : e.length);
        e = e.substring(0, o), t = e.substring(e.lastIndexOf(".") + 1);
      }
      return t.toLowerCase();
    }, r.prototype._getMimeFromXhrType = function(e) {
      switch (e) {
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
  (function(e) {
    e[e.NONE = 0] = "NONE", e[e.DATA_URL = 1] = "DATA_URL", e[e.COMPLETE = 2] = "COMPLETE", e[e.LOADING = 4] = "LOADING";
  })(r.STATUS_FLAGS || (r.STATUS_FLAGS = {})), function(e) {
    e[e.UNKNOWN = 0] = "UNKNOWN", e[e.JSON = 1] = "JSON", e[e.XML = 2] = "XML", e[e.IMAGE = 3] = "IMAGE", e[e.AUDIO = 4] = "AUDIO", e[e.VIDEO = 5] = "VIDEO", e[e.TEXT = 6] = "TEXT";
  }(r.TYPE || (r.TYPE = {})), function(e) {
    e[e.XHR = 1] = "XHR", e[e.IMAGE = 2] = "IMAGE", e[e.AUDIO = 3] = "AUDIO", e[e.VIDEO = 4] = "VIDEO";
  }(r.LOAD_TYPE || (r.LOAD_TYPE = {})), function(e) {
    e.DEFAULT = "text", e.BUFFER = "arraybuffer", e.BLOB = "blob", e.DOCUMENT = "document", e.JSON = "json", e.TEXT = "text";
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
})(wt || (wt = {}));
function ke() {
}
function nm(r) {
  return function() {
    for (var t = arguments, i = [], n = 0; n < arguments.length; n++)
      i[n] = t[n];
    if (r === null)
      throw new Error("Callback was already called.");
    var a = r;
    r = null, a.apply(this, i);
  };
}
var am = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(e, t) {
      this.data = e, this.callback = t;
    }
    return r;
  }()
), Jn = (
  /** @class */
  function() {
    function r(e, t) {
      var i = this;
      if (t === void 0 && (t = 1), this.workers = 0, this.saturated = ke, this.unsaturated = ke, this.empty = ke, this.drain = ke, this.error = ke, this.started = !1, this.paused = !1, this._tasks = [], this._insert = function(n, a, o) {
        if (o && typeof o != "function")
          throw new Error("task callback must be a function");
        if (i.started = !0, n == null && i.idle()) {
          setTimeout(function() {
            return i.drain();
          }, 1);
          return;
        }
        var s = new am(n, typeof o == "function" ? o : ke);
        a ? i._tasks.unshift(s) : i._tasks.push(s), setTimeout(i.process, 1);
      }, this.process = function() {
        for (; !i.paused && i.workers < i.concurrency && i._tasks.length; ) {
          var n = i._tasks.shift();
          i._tasks.length === 0 && i.empty(), i.workers += 1, i.workers === i.concurrency && i.saturated(), i._worker(n.data, nm(i._next(n)));
        }
      }, this._worker = e, t === 0)
        throw new Error("Concurrency must not be zero");
      this.concurrency = t, this.buffer = t / 4;
    }
    return r.prototype._next = function(e) {
      var t = this;
      return function() {
        for (var i = arguments, n = [], a = 0; a < arguments.length; a++)
          n[a] = i[a];
        t.workers -= 1, e.callback.apply(e, n), n[0] != null && t.error(n[0], e.data), t.workers <= t.concurrency - t.buffer && t.unsaturated(), t.idle() && t.drain(), t.process();
      };
    }, r.prototype.push = function(e, t) {
      this._insert(e, !1, t);
    }, r.prototype.kill = function() {
      this.workers = 0, this.drain = ke, this.started = !1, this._tasks = [];
    }, r.prototype.unshift = function(e, t) {
      this._insert(e, !0, t);
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
        for (var e = 1; e <= this.concurrency; e++)
          this.process();
      }
    }, r.eachSeries = function(e, t, i, n) {
      var a = 0, o = e.length;
      function s(u) {
        if (u || a === o) {
          i && i(u);
          return;
        }
        n ? setTimeout(function() {
          t(e[a++], s);
        }, 1) : t(e[a++], s);
      }
      s();
    }, r.queue = function(e, t) {
      return new r(e, t);
    }, r;
  }()
), ta = 100, om = /(#[\w-]+)?$/, ln = (
  /** @class */
  function() {
    function r(e, t) {
      var i = this;
      e === void 0 && (e = ""), t === void 0 && (t = 10), this.progress = 0, this.loading = !1, this.defaultQueryString = "", this._beforeMiddleware = [], this._afterMiddleware = [], this._resourcesParsing = [], this._boundLoadResource = function(u, h) {
        return i._loadResource(u, h);
      }, this.resources = {}, this.baseUrl = e, this._beforeMiddleware = [], this._afterMiddleware = [], this._resourcesParsing = [], this._boundLoadResource = function(u, h) {
        return i._loadResource(u, h);
      }, this._queue = Jn.queue(this._boundLoadResource, t), this._queue.pause(), this.resources = {}, this.onProgress = new ye(), this.onError = new ye(), this.onLoad = new ye(), this.onStart = new ye(), this.onComplete = new ye();
      for (var n = 0; n < r._plugins.length; ++n) {
        var a = r._plugins[n], o = a.pre, s = a.use;
        o && this.pre(o), s && this.use(s);
      }
      this._protected = !1;
    }
    return r.prototype._add = function(e, t, i, n) {
      if (this.loading && (!i || !i.parentResource))
        throw new Error("Cannot add resources while the loader is running.");
      if (this.resources[e])
        throw new Error('Resource named "' + e + '" already exists.');
      if (t = this._prepareUrl(t), this.resources[e] = new wt(e, t, i), typeof n == "function" && this.resources[e].onAfterMiddleware.once(n), this.loading) {
        for (var a = i.parentResource, o = [], s = 0; s < a.children.length; ++s)
          a.children[s].isComplete || o.push(a.children[s]);
        var u = a.progressChunk * (o.length + 1), h = u / (o.length + 2);
        a.children.push(this.resources[e]), a.progressChunk = h;
        for (var s = 0; s < o.length; ++s)
          o[s].progressChunk = h;
        this.resources[e].progressChunk = h;
      }
      return this._queue.push(this.resources[e]), this;
    }, r.prototype.pre = function(e) {
      return this._beforeMiddleware.push(e), this;
    }, r.prototype.use = function(e) {
      return this._afterMiddleware.push(e), this;
    }, r.prototype.reset = function() {
      this.progress = 0, this.loading = !1, this._queue.kill(), this._queue.pause();
      for (var e in this.resources) {
        var t = this.resources[e];
        t._onLoadBinding && t._onLoadBinding.detach(), t.isLoading && t.abort("loader reset");
      }
      return this.resources = {}, this;
    }, r.prototype.load = function(e) {
      if (Jt("6.5.0", "@pixi/loaders is being replaced with @pixi/assets in the next major release."), typeof e == "function" && this.onComplete.once(e), this.loading)
        return this;
      if (this._queue.idle())
        this._onStart(), this._onComplete();
      else {
        for (var t = this._queue._tasks.length, i = ta / t, n = 0; n < this._queue._tasks.length; ++n)
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
      set: function(e) {
        this._queue.concurrency = e;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype._prepareUrl = function(e) {
      var t = Vh(e, { strictMode: !0 }), i;
      if (t.protocol || !t.path || e.indexOf("//") === 0 ? i = e : this.baseUrl.length && this.baseUrl.lastIndexOf("/") !== this.baseUrl.length - 1 && e.charAt(0) !== "/" ? i = this.baseUrl + "/" + e : i = this.baseUrl + e, this.defaultQueryString) {
        var n = om.exec(i)[0];
        i = i.slice(0, i.length - n.length), i.indexOf("?") !== -1 ? i += "&" + this.defaultQueryString : i += "?" + this.defaultQueryString, i += n;
      }
      return i;
    }, r.prototype._loadResource = function(e, t) {
      var i = this;
      e._dequeue = t, Jn.eachSeries(this._beforeMiddleware, function(n, a) {
        n.call(i, e, function() {
          a(e.isComplete ? {} : null);
        });
      }, function() {
        e.isComplete ? i._onLoad(e) : (e._onLoadBinding = e.onComplete.once(i._onLoad, i), e.load());
      }, !0);
    }, r.prototype._onStart = function() {
      this.progress = 0, this.loading = !0, this.onStart.dispatch(this);
    }, r.prototype._onComplete = function() {
      this.progress = ta, this.loading = !1, this.onComplete.dispatch(this, this.resources);
    }, r.prototype._onLoad = function(e) {
      var t = this;
      e._onLoadBinding = null, this._resourcesParsing.push(e), e._dequeue(), Jn.eachSeries(this._afterMiddleware, function(i, n) {
        i.call(t, e, n);
      }, function() {
        e.onAfterMiddleware.dispatch(e), t.progress = Math.min(ta, t.progress + e.progressChunk), t.onProgress.dispatch(t, e), e.error ? t.onError.dispatch(e.error, t, e) : t.onLoad.dispatch(t, e), t._resourcesParsing.splice(t._resourcesParsing.indexOf(e), 1), t._queue.idle() && t._resourcesParsing.length === 0 && t._onComplete();
      }, !0);
    }, r.prototype.destroy = function() {
      this._protected || this.reset();
    }, Object.defineProperty(r, "shared", {
      /** A premade instance of the loader that can be used to load resources. */
      get: function() {
        var e = r._shared;
        return e || (e = new r(), e._protected = !0, r._shared = e), e;
      },
      enumerable: !1,
      configurable: !0
    }), r.registerPlugin = function(e) {
      return Jt("6.5.0", "Loader.registerPlugin() is deprecated, use extensions.add() instead."), xe.add({
        type: pt.Loader,
        ref: e
      }), r;
    }, r._plugins = [], r;
  }()
);
xe.handleByList(pt.Loader, ln._plugins);
ln.prototype.add = function(e, t, i, n) {
  if (Array.isArray(e)) {
    for (var a = 0; a < e.length; ++a)
      this.add(e[a]);
    return this;
  }
  if (typeof e == "object" && (i = e, n = t || i.callback || i.onComplete, t = i.url, e = i.name || i.key || i.url), typeof t != "string" && (n = i, i = t, t = e), typeof t != "string")
    throw new Error("No url passed to add resource to loader.");
  return typeof i == "function" && (n = i, i = null), this._add(e, t, i, n);
};
var sm = (
  /** @class */
  function() {
    function r() {
    }
    return r.init = function(e) {
      e = Object.assign({
        sharedLoader: !1
      }, e), this.loader = e.sharedLoader ? ln.shared : new ln();
    }, r.destroy = function() {
      this.loader && (this.loader.destroy(), this.loader = null);
    }, r.extension = pt.Application, r;
  }()
), um = (
  /** @class */
  function() {
    function r() {
    }
    return r.add = function() {
      wt.setExtensionLoadType("svg", wt.LOAD_TYPE.XHR), wt.setExtensionXhrType("svg", wt.XHR_RESPONSE_TYPE.TEXT);
    }, r.use = function(e, t) {
      if (e.data && (e.type === wt.TYPE.IMAGE || e.extension === "svg")) {
        var i = e.data, n = e.url, a = e.name, o = e.metadata;
        W.fromLoader(i, n, a, o).then(function(s) {
          e.texture = s, t();
        }).catch(t);
      } else
        t();
    }, r.extension = pt.Loader, r;
  }()
), hm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function lm(r) {
  for (var e = "", t = 0; t < r.length; ) {
    for (var i = [0, 0, 0], n = [0, 0, 0, 0], a = 0; a < i.length; ++a)
      t < r.length ? i[a] = r.charCodeAt(t++) & 255 : i[a] = 0;
    n[0] = i[0] >> 2, n[1] = (i[0] & 3) << 4 | i[1] >> 4, n[2] = (i[1] & 15) << 2 | i[2] >> 6, n[3] = i[2] & 63;
    var o = t - (r.length - 1);
    switch (o) {
      case 2:
        n[3] = 64, n[2] = 64;
        break;
      case 1:
        n[3] = 64;
        break;
    }
    for (var a = 0; a < n.length; ++a)
      e += hm.charAt(n[a]);
  }
  return e;
}
function fm(r, e) {
  if (!r.data) {
    e();
    return;
  }
  if (r.xhr && r.xhrType === wt.XHR_RESPONSE_TYPE.BLOB) {
    if (!self.Blob || typeof r.data == "string") {
      var t = r.xhr.getResponseHeader("content-type");
      if (t && t.indexOf("image") === 0) {
        r.data = new Image(), r.data.src = "data:" + t + ";base64," + lm(r.xhr.responseText), r.type = wt.TYPE.IMAGE, r.data.onload = function() {
          r.data.onload = null, e();
        };
        return;
      }
    } else if (r.data.type.indexOf("image") === 0) {
      var i = globalThis.URL || globalThis.webkitURL, n = i.createObjectURL(r.data);
      r.blob = r.data, r.data = new Image(), r.data.src = n, r.type = wt.TYPE.IMAGE, r.data.onload = function() {
        i.revokeObjectURL(n), r.data.onload = null, e();
      };
      return;
    }
  }
  e();
}
var cm = (
  /** @class */
  function() {
    function r() {
    }
    return r.extension = pt.Loader, r.use = fm, r;
  }()
);
xe.add(um, cm);
/*!
 * @pixi/compressed-textures - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/compressed-textures is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var ft, Y;
(function(r) {
  r[r.COMPRESSED_RGB_S3TC_DXT1_EXT = 33776] = "COMPRESSED_RGB_S3TC_DXT1_EXT", r[r.COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777] = "COMPRESSED_RGBA_S3TC_DXT1_EXT", r[r.COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778] = "COMPRESSED_RGBA_S3TC_DXT3_EXT", r[r.COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779] = "COMPRESSED_RGBA_S3TC_DXT5_EXT", r[r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 35917] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT", r[r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 35918] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT", r[r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 35919] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT", r[r.COMPRESSED_SRGB_S3TC_DXT1_EXT = 35916] = "COMPRESSED_SRGB_S3TC_DXT1_EXT", r[r.COMPRESSED_R11_EAC = 37488] = "COMPRESSED_R11_EAC", r[r.COMPRESSED_SIGNED_R11_EAC = 37489] = "COMPRESSED_SIGNED_R11_EAC", r[r.COMPRESSED_RG11_EAC = 37490] = "COMPRESSED_RG11_EAC", r[r.COMPRESSED_SIGNED_RG11_EAC = 37491] = "COMPRESSED_SIGNED_RG11_EAC", r[r.COMPRESSED_RGB8_ETC2 = 37492] = "COMPRESSED_RGB8_ETC2", r[r.COMPRESSED_RGBA8_ETC2_EAC = 37496] = "COMPRESSED_RGBA8_ETC2_EAC", r[r.COMPRESSED_SRGB8_ETC2 = 37493] = "COMPRESSED_SRGB8_ETC2", r[r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 37497] = "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC", r[r.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37494] = "COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2", r[r.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37495] = "COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2", r[r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 35840] = "COMPRESSED_RGB_PVRTC_4BPPV1_IMG", r[r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 35842] = "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG", r[r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 35841] = "COMPRESSED_RGB_PVRTC_2BPPV1_IMG", r[r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 35843] = "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG", r[r.COMPRESSED_RGB_ETC1_WEBGL = 36196] = "COMPRESSED_RGB_ETC1_WEBGL", r[r.COMPRESSED_RGB_ATC_WEBGL = 35986] = "COMPRESSED_RGB_ATC_WEBGL", r[r.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 35986] = "COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL", r[r.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 34798] = "COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL", r[r.COMPRESSED_RGBA_ASTC_4x4_KHR = 37808] = "COMPRESSED_RGBA_ASTC_4x4_KHR";
})(Y || (Y = {}));
var fn = (ft = {}, // WEBGL_compressed_texture_s3tc
ft[Y.COMPRESSED_RGB_S3TC_DXT1_EXT] = 0.5, ft[Y.COMPRESSED_RGBA_S3TC_DXT1_EXT] = 0.5, ft[Y.COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1, ft[Y.COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1, // WEBGL_compressed_texture_s3tc
ft[Y.COMPRESSED_SRGB_S3TC_DXT1_EXT] = 0.5, ft[Y.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT] = 0.5, ft[Y.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT] = 1, ft[Y.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT] = 1, // WEBGL_compressed_texture_etc
ft[Y.COMPRESSED_R11_EAC] = 0.5, ft[Y.COMPRESSED_SIGNED_R11_EAC] = 0.5, ft[Y.COMPRESSED_RG11_EAC] = 1, ft[Y.COMPRESSED_SIGNED_RG11_EAC] = 1, ft[Y.COMPRESSED_RGB8_ETC2] = 0.5, ft[Y.COMPRESSED_RGBA8_ETC2_EAC] = 1, ft[Y.COMPRESSED_SRGB8_ETC2] = 0.5, ft[Y.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC] = 1, ft[Y.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2] = 0.5, ft[Y.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2] = 0.5, // WEBGL_compressed_texture_pvrtc
ft[Y.COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = 0.5, ft[Y.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = 0.5, ft[Y.COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = 0.25, ft[Y.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = 0.25, // WEBGL_compressed_texture_etc1
ft[Y.COMPRESSED_RGB_ETC1_WEBGL] = 0.5, // @see https://www.khronos.org/registry/OpenGL/extensions/AMD/AMD_compressed_ATC_texture.txt
// WEBGL_compressed_texture_atc
ft[Y.COMPRESSED_RGB_ATC_WEBGL] = 0.5, ft[Y.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1, ft[Y.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1, // @see https://registry.khronos.org/OpenGL/extensions/KHR/KHR_texture_compression_astc_hdr.txt
// WEBGL_compressed_texture_astc
/* eslint-disable-next-line camelcase */
ft[Y.COMPRESSED_RGBA_ASTC_4x4_KHR] = 1, ft);
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
var ka = function(r, e) {
  return ka = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, ka(r, e);
};
function zh(r, e) {
  ka(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
function dm(r, e, t, i) {
  function n(a) {
    return a instanceof t ? a : new t(function(o) {
      o(a);
    });
  }
  return new (t || (t = Promise))(function(a, o) {
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
    h((i = i.apply(r, e || [])).next());
  });
}
function pm(r, e) {
  var t = { label: 0, sent: function() {
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
    for (; t; )
      try {
        if (i = 1, n && (a = h[0] & 2 ? n.return : h[0] ? n.throw || ((a = n.return) && a.call(n), 0) : n.next) && !(a = a.call(n, h[1])).done)
          return a;
        switch (n = 0, a && (h = [h[0] & 2, a.value]), h[0]) {
          case 0:
          case 1:
            a = h;
            break;
          case 4:
            return t.label++, { value: h[1], done: !1 };
          case 5:
            t.label++, n = h[1], h = [0];
            continue;
          case 7:
            h = t.ops.pop(), t.trys.pop();
            continue;
          default:
            if (a = t.trys, !(a = a.length > 0 && a[a.length - 1]) && (h[0] === 6 || h[0] === 2)) {
              t = 0;
              continue;
            }
            if (h[0] === 3 && (!a || h[1] > a[0] && h[1] < a[3])) {
              t.label = h[1];
              break;
            }
            if (h[0] === 6 && t.label < a[1]) {
              t.label = a[1], a = h;
              break;
            }
            if (a && t.label < a[2]) {
              t.label = a[2], t.ops.push(h);
              break;
            }
            a[2] && t.ops.pop(), t.trys.pop();
            continue;
        }
        h = e.call(r, t);
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
var vm = (
  /** @class */
  function(r) {
    zh(e, r);
    function e(t, i) {
      i === void 0 && (i = { width: 1, height: 1, autoLoad: !0 });
      var n = this, a, o;
      return typeof t == "string" ? (a = t, o = new Uint8Array()) : (a = null, o = t), n = r.call(this, o, i) || this, n.origin = a, n.buffer = o ? new Ua(o) : null, n.origin && i.autoLoad !== !1 && n.load(), o && o.length && (n.loaded = !0, n.onBlobLoaded(n.buffer.rawBinaryData)), n;
    }
    return e.prototype.onBlobLoaded = function(t) {
    }, e.prototype.load = function() {
      return dm(this, void 0, Promise, function() {
        var t, i, n;
        return pm(this, function(a) {
          switch (a.label) {
            case 0:
              return [4, fetch(this.origin)];
            case 1:
              return t = a.sent(), [4, t.blob()];
            case 2:
              return i = a.sent(), [4, i.arrayBuffer()];
            case 3:
              return n = a.sent(), this.data = new Uint32Array(n), this.buffer = new Ua(n), this.loaded = !0, this.onBlobLoaded(n), this.update(), [2, this];
          }
        });
      });
    }, e;
  }(si)
), Ha = (
  /** @class */
  function(r) {
    zh(e, r);
    function e(t, i) {
      var n = r.call(this, t, i) || this;
      return n.format = i.format, n.levels = i.levels || 1, n._width = i.width, n._height = i.height, n._extension = e._formatToExtension(n.format), (i.levelBuffers || n.buffer) && (n._levelBuffers = i.levelBuffers || e._createLevelBuffers(
        t instanceof Uint8Array ? t : n.buffer.uint8View,
        n.format,
        n.levels,
        4,
        4,
        // PVRTC has 8x4 blocks in 2bpp mode
        n.width,
        n.height
      )), n;
    }
    return e.prototype.upload = function(t, i, n) {
      var a = t.gl, o = t.context.extensions[this._extension];
      if (!o)
        throw new Error(this._extension + " textures are not supported on the current machine");
      if (!this._levelBuffers)
        return !1;
      for (var s = 0, u = this.levels; s < u; s++) {
        var h = this._levelBuffers[s], l = h.levelID, f = h.levelWidth, c = h.levelHeight, d = h.levelBuffer;
        a.compressedTexImage2D(a.TEXTURE_2D, l, this.format, f, c, 0, d);
      }
      return !0;
    }, e.prototype.onBlobLoaded = function() {
      this._levelBuffers = e._createLevelBuffers(
        this.buffer.uint8View,
        this.format,
        this.levels,
        4,
        4,
        // PVRTC has 8x4 blocks in 2bpp mode
        this.width,
        this.height
      );
    }, e._formatToExtension = function(t) {
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
    }, e._createLevelBuffers = function(t, i, n, a, o, s, u) {
      for (var h = new Array(n), l = t.byteOffset, f = s, c = u, d = f + a - 1 & ~(a - 1), p = c + o - 1 & ~(o - 1), v = d * p * fn[i], _ = 0; _ < n; _++)
        h[_] = {
          levelID: _,
          levelWidth: n > 1 ? f : d,
          levelHeight: n > 1 ? c : p,
          levelBuffer: new Uint8Array(t.buffer, l, v)
        }, l += v, f = f >> 1 || 1, c = c >> 1 || 1, d = f + a - 1 & ~(a - 1), p = c + o - 1 & ~(o - 1), v = d * p * fn[i];
      return h;
    }, e;
  }(vm)
), _m = (
  /** @class */
  function() {
    function r() {
    }
    return r.use = function(e, t) {
      var i = e.data, n = this;
      if (e.type === wt.TYPE.JSON && i && i.cacheID && i.textures) {
        for (var a = i.textures, o = void 0, s = void 0, u = 0, h = a.length; u < h; u++) {
          var l = a[u], f = l.src, c = l.format;
          if (c || (s = f), r.textureFormats[c]) {
            o = f;
            break;
          }
        }
        if (o = o || s, !o) {
          t(new Error("Cannot load compressed-textures in " + e.url + ", make sure you provide a fallback"));
          return;
        }
        if (o === e.url) {
          t(new Error("URL of compressed texture cannot be the same as the manifest's URL"));
          return;
        }
        var d = {
          crossOrigin: e.crossOrigin,
          metadata: e.metadata.imageMetadata,
          parentResource: e
        }, p = gr.resolve(e.url.replace(n.baseUrl, ""), o), v = i.cacheID;
        n.add(v, p, d, function(_) {
          if (_.error) {
            t(_.error);
            return;
          }
          var y = _.texture, g = y === void 0 ? null : y, m = _.textures, E = m === void 0 ? {} : m;
          Object.assign(e, { texture: g, textures: E }), t();
        });
      } else
        t();
    }, Object.defineProperty(r, "textureExtensions", {
      /**  Map of available texture extensions. */
      get: function() {
        if (!r._textureExtensions) {
          var e = U.ADAPTER.createCanvas(), t = e.getContext("webgl");
          if (!t)
            return console.warn("WebGL not available for compressed textures. Silently failing."), {};
          var i = {
            s3tc: t.getExtension("WEBGL_compressed_texture_s3tc"),
            s3tc_sRGB: t.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
            etc: t.getExtension("WEBGL_compressed_texture_etc"),
            etc1: t.getExtension("WEBGL_compressed_texture_etc1"),
            pvrtc: t.getExtension("WEBGL_compressed_texture_pvrtc") || t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
            atc: t.getExtension("WEBGL_compressed_texture_atc"),
            astc: t.getExtension("WEBGL_compressed_texture_astc")
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
          var e = r.textureExtensions;
          r._textureFormats = {};
          for (var t in e) {
            var i = e[t];
            i && Object.assign(r._textureFormats, Object.getPrototypeOf(i));
          }
        }
        return r._textureFormats;
      },
      enumerable: !1,
      configurable: !0
    }), r.extension = pt.Loader, r;
  }()
);
function Wh(r, e, t) {
  var i = {
    textures: {},
    texture: null
  };
  if (!e)
    return i;
  var n = e.map(function(a) {
    return new W(new rt(a, Object.assign({
      mipmap: te.OFF,
      alphaMode: ee.NO_PREMULTIPLIED_ALPHA
    }, t)));
  });
  return n.forEach(function(a, o) {
    var s = a.baseTexture, u = r + "-" + (o + 1);
    rt.addToCache(s, u), W.addToCache(a, u), o === 0 && (rt.addToCache(s, r), W.addToCache(a, r), i.texture = a), i.textures[u] = a;
  }), i;
}
var Ur, Yt, ea = 4, Di = 124, ym = 32, iu = 20, gm = 542327876, Fi = {
  SIZE: 1,
  FLAGS: 2,
  HEIGHT: 3,
  WIDTH: 4,
  MIPMAP_COUNT: 7,
  PIXEL_FORMAT: 19
}, mm = {
  SIZE: 0,
  FLAGS: 1,
  FOURCC: 2,
  RGB_BITCOUNT: 3,
  R_BIT_MASK: 4,
  G_BIT_MASK: 5,
  B_BIT_MASK: 6,
  A_BIT_MASK: 7
}, Ni = {
  DXGI_FORMAT: 0,
  RESOURCE_DIMENSION: 1,
  MISC_FLAG: 2,
  ARRAY_SIZE: 3,
  MISC_FLAGS2: 4
}, Kt;
(function(r) {
  r[r.DXGI_FORMAT_UNKNOWN = 0] = "DXGI_FORMAT_UNKNOWN", r[r.DXGI_FORMAT_R32G32B32A32_TYPELESS = 1] = "DXGI_FORMAT_R32G32B32A32_TYPELESS", r[r.DXGI_FORMAT_R32G32B32A32_FLOAT = 2] = "DXGI_FORMAT_R32G32B32A32_FLOAT", r[r.DXGI_FORMAT_R32G32B32A32_UINT = 3] = "DXGI_FORMAT_R32G32B32A32_UINT", r[r.DXGI_FORMAT_R32G32B32A32_SINT = 4] = "DXGI_FORMAT_R32G32B32A32_SINT", r[r.DXGI_FORMAT_R32G32B32_TYPELESS = 5] = "DXGI_FORMAT_R32G32B32_TYPELESS", r[r.DXGI_FORMAT_R32G32B32_FLOAT = 6] = "DXGI_FORMAT_R32G32B32_FLOAT", r[r.DXGI_FORMAT_R32G32B32_UINT = 7] = "DXGI_FORMAT_R32G32B32_UINT", r[r.DXGI_FORMAT_R32G32B32_SINT = 8] = "DXGI_FORMAT_R32G32B32_SINT", r[r.DXGI_FORMAT_R16G16B16A16_TYPELESS = 9] = "DXGI_FORMAT_R16G16B16A16_TYPELESS", r[r.DXGI_FORMAT_R16G16B16A16_FLOAT = 10] = "DXGI_FORMAT_R16G16B16A16_FLOAT", r[r.DXGI_FORMAT_R16G16B16A16_UNORM = 11] = "DXGI_FORMAT_R16G16B16A16_UNORM", r[r.DXGI_FORMAT_R16G16B16A16_UINT = 12] = "DXGI_FORMAT_R16G16B16A16_UINT", r[r.DXGI_FORMAT_R16G16B16A16_SNORM = 13] = "DXGI_FORMAT_R16G16B16A16_SNORM", r[r.DXGI_FORMAT_R16G16B16A16_SINT = 14] = "DXGI_FORMAT_R16G16B16A16_SINT", r[r.DXGI_FORMAT_R32G32_TYPELESS = 15] = "DXGI_FORMAT_R32G32_TYPELESS", r[r.DXGI_FORMAT_R32G32_FLOAT = 16] = "DXGI_FORMAT_R32G32_FLOAT", r[r.DXGI_FORMAT_R32G32_UINT = 17] = "DXGI_FORMAT_R32G32_UINT", r[r.DXGI_FORMAT_R32G32_SINT = 18] = "DXGI_FORMAT_R32G32_SINT", r[r.DXGI_FORMAT_R32G8X24_TYPELESS = 19] = "DXGI_FORMAT_R32G8X24_TYPELESS", r[r.DXGI_FORMAT_D32_FLOAT_S8X24_UINT = 20] = "DXGI_FORMAT_D32_FLOAT_S8X24_UINT", r[r.DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS = 21] = "DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS", r[r.DXGI_FORMAT_X32_TYPELESS_G8X24_UINT = 22] = "DXGI_FORMAT_X32_TYPELESS_G8X24_UINT", r[r.DXGI_FORMAT_R10G10B10A2_TYPELESS = 23] = "DXGI_FORMAT_R10G10B10A2_TYPELESS", r[r.DXGI_FORMAT_R10G10B10A2_UNORM = 24] = "DXGI_FORMAT_R10G10B10A2_UNORM", r[r.DXGI_FORMAT_R10G10B10A2_UINT = 25] = "DXGI_FORMAT_R10G10B10A2_UINT", r[r.DXGI_FORMAT_R11G11B10_FLOAT = 26] = "DXGI_FORMAT_R11G11B10_FLOAT", r[r.DXGI_FORMAT_R8G8B8A8_TYPELESS = 27] = "DXGI_FORMAT_R8G8B8A8_TYPELESS", r[r.DXGI_FORMAT_R8G8B8A8_UNORM = 28] = "DXGI_FORMAT_R8G8B8A8_UNORM", r[r.DXGI_FORMAT_R8G8B8A8_UNORM_SRGB = 29] = "DXGI_FORMAT_R8G8B8A8_UNORM_SRGB", r[r.DXGI_FORMAT_R8G8B8A8_UINT = 30] = "DXGI_FORMAT_R8G8B8A8_UINT", r[r.DXGI_FORMAT_R8G8B8A8_SNORM = 31] = "DXGI_FORMAT_R8G8B8A8_SNORM", r[r.DXGI_FORMAT_R8G8B8A8_SINT = 32] = "DXGI_FORMAT_R8G8B8A8_SINT", r[r.DXGI_FORMAT_R16G16_TYPELESS = 33] = "DXGI_FORMAT_R16G16_TYPELESS", r[r.DXGI_FORMAT_R16G16_FLOAT = 34] = "DXGI_FORMAT_R16G16_FLOAT", r[r.DXGI_FORMAT_R16G16_UNORM = 35] = "DXGI_FORMAT_R16G16_UNORM", r[r.DXGI_FORMAT_R16G16_UINT = 36] = "DXGI_FORMAT_R16G16_UINT", r[r.DXGI_FORMAT_R16G16_SNORM = 37] = "DXGI_FORMAT_R16G16_SNORM", r[r.DXGI_FORMAT_R16G16_SINT = 38] = "DXGI_FORMAT_R16G16_SINT", r[r.DXGI_FORMAT_R32_TYPELESS = 39] = "DXGI_FORMAT_R32_TYPELESS", r[r.DXGI_FORMAT_D32_FLOAT = 40] = "DXGI_FORMAT_D32_FLOAT", r[r.DXGI_FORMAT_R32_FLOAT = 41] = "DXGI_FORMAT_R32_FLOAT", r[r.DXGI_FORMAT_R32_UINT = 42] = "DXGI_FORMAT_R32_UINT", r[r.DXGI_FORMAT_R32_SINT = 43] = "DXGI_FORMAT_R32_SINT", r[r.DXGI_FORMAT_R24G8_TYPELESS = 44] = "DXGI_FORMAT_R24G8_TYPELESS", r[r.DXGI_FORMAT_D24_UNORM_S8_UINT = 45] = "DXGI_FORMAT_D24_UNORM_S8_UINT", r[r.DXGI_FORMAT_R24_UNORM_X8_TYPELESS = 46] = "DXGI_FORMAT_R24_UNORM_X8_TYPELESS", r[r.DXGI_FORMAT_X24_TYPELESS_G8_UINT = 47] = "DXGI_FORMAT_X24_TYPELESS_G8_UINT", r[r.DXGI_FORMAT_R8G8_TYPELESS = 48] = "DXGI_FORMAT_R8G8_TYPELESS", r[r.DXGI_FORMAT_R8G8_UNORM = 49] = "DXGI_FORMAT_R8G8_UNORM", r[r.DXGI_FORMAT_R8G8_UINT = 50] = "DXGI_FORMAT_R8G8_UINT", r[r.DXGI_FORMAT_R8G8_SNORM = 51] = "DXGI_FORMAT_R8G8_SNORM", r[r.DXGI_FORMAT_R8G8_SINT = 52] = "DXGI_FORMAT_R8G8_SINT", r[r.DXGI_FORMAT_R16_TYPELESS = 53] = "DXGI_FORMAT_R16_TYPELESS", r[r.DXGI_FORMAT_R16_FLOAT = 54] = "DXGI_FORMAT_R16_FLOAT", r[r.DXGI_FORMAT_D16_UNORM = 55] = "DXGI_FORMAT_D16_UNORM", r[r.DXGI_FORMAT_R16_UNORM = 56] = "DXGI_FORMAT_R16_UNORM", r[r.DXGI_FORMAT_R16_UINT = 57] = "DXGI_FORMAT_R16_UINT", r[r.DXGI_FORMAT_R16_SNORM = 58] = "DXGI_FORMAT_R16_SNORM", r[r.DXGI_FORMAT_R16_SINT = 59] = "DXGI_FORMAT_R16_SINT", r[r.DXGI_FORMAT_R8_TYPELESS = 60] = "DXGI_FORMAT_R8_TYPELESS", r[r.DXGI_FORMAT_R8_UNORM = 61] = "DXGI_FORMAT_R8_UNORM", r[r.DXGI_FORMAT_R8_UINT = 62] = "DXGI_FORMAT_R8_UINT", r[r.DXGI_FORMAT_R8_SNORM = 63] = "DXGI_FORMAT_R8_SNORM", r[r.DXGI_FORMAT_R8_SINT = 64] = "DXGI_FORMAT_R8_SINT", r[r.DXGI_FORMAT_A8_UNORM = 65] = "DXGI_FORMAT_A8_UNORM", r[r.DXGI_FORMAT_R1_UNORM = 66] = "DXGI_FORMAT_R1_UNORM", r[r.DXGI_FORMAT_R9G9B9E5_SHAREDEXP = 67] = "DXGI_FORMAT_R9G9B9E5_SHAREDEXP", r[r.DXGI_FORMAT_R8G8_B8G8_UNORM = 68] = "DXGI_FORMAT_R8G8_B8G8_UNORM", r[r.DXGI_FORMAT_G8R8_G8B8_UNORM = 69] = "DXGI_FORMAT_G8R8_G8B8_UNORM", r[r.DXGI_FORMAT_BC1_TYPELESS = 70] = "DXGI_FORMAT_BC1_TYPELESS", r[r.DXGI_FORMAT_BC1_UNORM = 71] = "DXGI_FORMAT_BC1_UNORM", r[r.DXGI_FORMAT_BC1_UNORM_SRGB = 72] = "DXGI_FORMAT_BC1_UNORM_SRGB", r[r.DXGI_FORMAT_BC2_TYPELESS = 73] = "DXGI_FORMAT_BC2_TYPELESS", r[r.DXGI_FORMAT_BC2_UNORM = 74] = "DXGI_FORMAT_BC2_UNORM", r[r.DXGI_FORMAT_BC2_UNORM_SRGB = 75] = "DXGI_FORMAT_BC2_UNORM_SRGB", r[r.DXGI_FORMAT_BC3_TYPELESS = 76] = "DXGI_FORMAT_BC3_TYPELESS", r[r.DXGI_FORMAT_BC3_UNORM = 77] = "DXGI_FORMAT_BC3_UNORM", r[r.DXGI_FORMAT_BC3_UNORM_SRGB = 78] = "DXGI_FORMAT_BC3_UNORM_SRGB", r[r.DXGI_FORMAT_BC4_TYPELESS = 79] = "DXGI_FORMAT_BC4_TYPELESS", r[r.DXGI_FORMAT_BC4_UNORM = 80] = "DXGI_FORMAT_BC4_UNORM", r[r.DXGI_FORMAT_BC4_SNORM = 81] = "DXGI_FORMAT_BC4_SNORM", r[r.DXGI_FORMAT_BC5_TYPELESS = 82] = "DXGI_FORMAT_BC5_TYPELESS", r[r.DXGI_FORMAT_BC5_UNORM = 83] = "DXGI_FORMAT_BC5_UNORM", r[r.DXGI_FORMAT_BC5_SNORM = 84] = "DXGI_FORMAT_BC5_SNORM", r[r.DXGI_FORMAT_B5G6R5_UNORM = 85] = "DXGI_FORMAT_B5G6R5_UNORM", r[r.DXGI_FORMAT_B5G5R5A1_UNORM = 86] = "DXGI_FORMAT_B5G5R5A1_UNORM", r[r.DXGI_FORMAT_B8G8R8A8_UNORM = 87] = "DXGI_FORMAT_B8G8R8A8_UNORM", r[r.DXGI_FORMAT_B8G8R8X8_UNORM = 88] = "DXGI_FORMAT_B8G8R8X8_UNORM", r[r.DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM = 89] = "DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM", r[r.DXGI_FORMAT_B8G8R8A8_TYPELESS = 90] = "DXGI_FORMAT_B8G8R8A8_TYPELESS", r[r.DXGI_FORMAT_B8G8R8A8_UNORM_SRGB = 91] = "DXGI_FORMAT_B8G8R8A8_UNORM_SRGB", r[r.DXGI_FORMAT_B8G8R8X8_TYPELESS = 92] = "DXGI_FORMAT_B8G8R8X8_TYPELESS", r[r.DXGI_FORMAT_B8G8R8X8_UNORM_SRGB = 93] = "DXGI_FORMAT_B8G8R8X8_UNORM_SRGB", r[r.DXGI_FORMAT_BC6H_TYPELESS = 94] = "DXGI_FORMAT_BC6H_TYPELESS", r[r.DXGI_FORMAT_BC6H_UF16 = 95] = "DXGI_FORMAT_BC6H_UF16", r[r.DXGI_FORMAT_BC6H_SF16 = 96] = "DXGI_FORMAT_BC6H_SF16", r[r.DXGI_FORMAT_BC7_TYPELESS = 97] = "DXGI_FORMAT_BC7_TYPELESS", r[r.DXGI_FORMAT_BC7_UNORM = 98] = "DXGI_FORMAT_BC7_UNORM", r[r.DXGI_FORMAT_BC7_UNORM_SRGB = 99] = "DXGI_FORMAT_BC7_UNORM_SRGB", r[r.DXGI_FORMAT_AYUV = 100] = "DXGI_FORMAT_AYUV", r[r.DXGI_FORMAT_Y410 = 101] = "DXGI_FORMAT_Y410", r[r.DXGI_FORMAT_Y416 = 102] = "DXGI_FORMAT_Y416", r[r.DXGI_FORMAT_NV12 = 103] = "DXGI_FORMAT_NV12", r[r.DXGI_FORMAT_P010 = 104] = "DXGI_FORMAT_P010", r[r.DXGI_FORMAT_P016 = 105] = "DXGI_FORMAT_P016", r[r.DXGI_FORMAT_420_OPAQUE = 106] = "DXGI_FORMAT_420_OPAQUE", r[r.DXGI_FORMAT_YUY2 = 107] = "DXGI_FORMAT_YUY2", r[r.DXGI_FORMAT_Y210 = 108] = "DXGI_FORMAT_Y210", r[r.DXGI_FORMAT_Y216 = 109] = "DXGI_FORMAT_Y216", r[r.DXGI_FORMAT_NV11 = 110] = "DXGI_FORMAT_NV11", r[r.DXGI_FORMAT_AI44 = 111] = "DXGI_FORMAT_AI44", r[r.DXGI_FORMAT_IA44 = 112] = "DXGI_FORMAT_IA44", r[r.DXGI_FORMAT_P8 = 113] = "DXGI_FORMAT_P8", r[r.DXGI_FORMAT_A8P8 = 114] = "DXGI_FORMAT_A8P8", r[r.DXGI_FORMAT_B4G4R4A4_UNORM = 115] = "DXGI_FORMAT_B4G4R4A4_UNORM", r[r.DXGI_FORMAT_P208 = 116] = "DXGI_FORMAT_P208", r[r.DXGI_FORMAT_V208 = 117] = "DXGI_FORMAT_V208", r[r.DXGI_FORMAT_V408 = 118] = "DXGI_FORMAT_V408", r[r.DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE = 119] = "DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE", r[r.DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE = 120] = "DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE", r[r.DXGI_FORMAT_FORCE_UINT = 121] = "DXGI_FORMAT_FORCE_UINT";
})(Kt || (Kt = {}));
var Xa;
(function(r) {
  r[r.DDS_DIMENSION_TEXTURE1D = 2] = "DDS_DIMENSION_TEXTURE1D", r[r.DDS_DIMENSION_TEXTURE2D = 3] = "DDS_DIMENSION_TEXTURE2D", r[r.DDS_DIMENSION_TEXTURE3D = 6] = "DDS_DIMENSION_TEXTURE3D";
})(Xa || (Xa = {}));
var bm = 1, Em = 2, Tm = 4, xm = 64, wm = 512, Sm = 131072, Pm = 827611204, Am = 861165636, Rm = 894720068, Om = 808540228, Im = 4, Cm = (Ur = {}, Ur[Pm] = Y.COMPRESSED_RGBA_S3TC_DXT1_EXT, Ur[Am] = Y.COMPRESSED_RGBA_S3TC_DXT3_EXT, Ur[Rm] = Y.COMPRESSED_RGBA_S3TC_DXT5_EXT, Ur), Mm = (Yt = {}, // WEBGL_compressed_texture_s3tc
Yt[Kt.DXGI_FORMAT_BC1_TYPELESS] = Y.COMPRESSED_RGBA_S3TC_DXT1_EXT, Yt[Kt.DXGI_FORMAT_BC1_UNORM] = Y.COMPRESSED_RGBA_S3TC_DXT1_EXT, Yt[Kt.DXGI_FORMAT_BC2_TYPELESS] = Y.COMPRESSED_RGBA_S3TC_DXT3_EXT, Yt[Kt.DXGI_FORMAT_BC2_UNORM] = Y.COMPRESSED_RGBA_S3TC_DXT3_EXT, Yt[Kt.DXGI_FORMAT_BC3_TYPELESS] = Y.COMPRESSED_RGBA_S3TC_DXT5_EXT, Yt[Kt.DXGI_FORMAT_BC3_UNORM] = Y.COMPRESSED_RGBA_S3TC_DXT5_EXT, // WEBGL_compressed_texture_s3tc_srgb
Yt[Kt.DXGI_FORMAT_BC1_UNORM_SRGB] = Y.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT, Yt[Kt.DXGI_FORMAT_BC2_UNORM_SRGB] = Y.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT, Yt[Kt.DXGI_FORMAT_BC3_UNORM_SRGB] = Y.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT, Yt);
function Dm(r) {
  var e = new Uint32Array(r), t = e[0];
  if (t !== gm)
    throw new Error("Invalid DDS file magic word");
  var i = new Uint32Array(r, 0, Di / Uint32Array.BYTES_PER_ELEMENT), n = i[Fi.HEIGHT], a = i[Fi.WIDTH], o = i[Fi.MIPMAP_COUNT], s = new Uint32Array(r, Fi.PIXEL_FORMAT * Uint32Array.BYTES_PER_ELEMENT, ym / Uint32Array.BYTES_PER_ELEMENT), u = s[bm];
  if (u & Tm) {
    var h = s[mm.FOURCC];
    if (h !== Om) {
      var l = Cm[h], f = ea + Di, c = new Uint8Array(r, f), d = new Ha(c, {
        format: l,
        width: a,
        height: n,
        levels: o
        // CompressedTextureResource will separate the levelBuffers for us!
      });
      return [d];
    }
    var p = ea + Di, v = new Uint32Array(e.buffer, p, iu / Uint32Array.BYTES_PER_ELEMENT), _ = v[Ni.DXGI_FORMAT], y = v[Ni.RESOURCE_DIMENSION], g = v[Ni.MISC_FLAG], m = v[Ni.ARRAY_SIZE], E = Mm[_];
    if (E === void 0)
      throw new Error("DDSParser cannot parse texture data with DXGI format " + _);
    if (g === Im)
      throw new Error("DDSParser does not support cubemap textures");
    if (y === Xa.DDS_DIMENSION_TEXTURE3D)
      throw new Error("DDSParser does not supported 3D texture data");
    var b = new Array(), x = ea + Di + iu;
    if (m === 1)
      b.push(new Uint8Array(r, x));
    else {
      for (var S = fn[E], A = 0, w = a, P = n, O = 0; O < o; O++) {
        var M = Math.max(1, w + 3 & -4), D = Math.max(1, P + 3 & -4), C = M * D * S;
        A += C, w = w >>> 1, P = P >>> 1;
      }
      for (var R = x, O = 0; O < m; O++)
        b.push(new Uint8Array(r, R, A)), R += A;
    }
    return b.map(function(F) {
      return new Ha(F, {
        format: E,
        width: a,
        height: n,
        levels: o
      });
    });
  }
  throw u & xm ? new Error("DDSParser does not support uncompressed texture data.") : u & wm ? new Error("DDSParser does not supported YUV uncompressed texture data.") : u & Sm ? new Error("DDSParser does not support single-channel (lumninance) texture data!") : u & Em ? new Error("DDSParser does not support single-channel (alpha) texture data!") : new Error("DDSParser failed to load a texture file due to an unknown reason!");
}
var we, pe, Gr, nu = [171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10], Fm = 67305985, qt = {
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
}, ja = 64, au = (we = {}, we[k.UNSIGNED_BYTE] = 1, we[k.UNSIGNED_SHORT] = 2, we[k.INT] = 4, we[k.UNSIGNED_INT] = 4, we[k.FLOAT] = 4, we[k.HALF_FLOAT] = 8, we), Nm = (pe = {}, pe[N.RGBA] = 4, pe[N.RGB] = 3, pe[N.RG] = 2, pe[N.RED] = 1, pe[N.LUMINANCE] = 1, pe[N.LUMINANCE_ALPHA] = 2, pe[N.ALPHA] = 1, pe), Bm = (Gr = {}, Gr[k.UNSIGNED_SHORT_4_4_4_4] = 2, Gr[k.UNSIGNED_SHORT_5_5_5_1] = 2, Gr[k.UNSIGNED_SHORT_5_6_5] = 2, Gr);
function Lm(r, e, t) {
  t === void 0 && (t = !1);
  var i = new DataView(e);
  if (!Um(r, i))
    return null;
  var n = i.getUint32(qt.ENDIANNESS, !0) === Fm, a = i.getUint32(qt.GL_TYPE, n), o = i.getUint32(qt.GL_FORMAT, n), s = i.getUint32(qt.GL_INTERNAL_FORMAT, n), u = i.getUint32(qt.PIXEL_WIDTH, n), h = i.getUint32(qt.PIXEL_HEIGHT, n) || 1, l = i.getUint32(qt.PIXEL_DEPTH, n) || 1, f = i.getUint32(qt.NUMBER_OF_ARRAY_ELEMENTS, n) || 1, c = i.getUint32(qt.NUMBER_OF_FACES, n), d = i.getUint32(qt.NUMBER_OF_MIPMAP_LEVELS, n), p = i.getUint32(qt.BYTES_OF_KEY_VALUE_DATA, n);
  if (h === 0 || l !== 1)
    throw new Error("Only 2D textures are supported");
  if (c !== 1)
    throw new Error("CubeTextures are not supported by KTXLoader yet!");
  if (f !== 1)
    throw new Error("WebGL does not support array textures");
  var v = 4, _ = 4, y = u + 3 & -4, g = h + 3 & -4, m = new Array(f), E = u * h;
  a === 0 && (E = y * g);
  var b;
  if (a !== 0 ? au[a] ? b = au[a] * Nm[o] : b = Bm[a] : b = fn[s], b === void 0)
    throw new Error("Unable to resolve the pixel format stored in the *.ktx file!");
  for (var x = t ? km(i, p, n) : null, S = E * b, A = S, w = u, P = h, O = y, M = g, D = ja + p, C = 0; C < d; C++) {
    for (var R = i.getUint32(D, n), F = D + 4, z = 0; z < f; z++) {
      var ot = m[z];
      ot || (ot = m[z] = new Array(d)), ot[C] = {
        levelID: C,
        // don't align mipWidth when texture not compressed! (glType not zero)
        levelWidth: d > 1 || a !== 0 ? w : O,
        levelHeight: d > 1 || a !== 0 ? P : M,
        levelBuffer: new Uint8Array(e, F, A)
      }, F += A;
    }
    D += R + 4, D = D % 4 !== 0 ? D + 4 - D % 4 : D, w = w >> 1 || 1, P = P >> 1 || 1, O = w + v - 1 & ~(v - 1), M = P + _ - 1 & ~(_ - 1), A = O * M * b;
  }
  return a !== 0 ? {
    uncompressed: m.map(function(Z) {
      var B = Z[0].levelBuffer, I = !1;
      return a === k.FLOAT ? B = new Float32Array(Z[0].levelBuffer.buffer, Z[0].levelBuffer.byteOffset, Z[0].levelBuffer.byteLength / 4) : a === k.UNSIGNED_INT ? (I = !0, B = new Uint32Array(Z[0].levelBuffer.buffer, Z[0].levelBuffer.byteOffset, Z[0].levelBuffer.byteLength / 4)) : a === k.INT && (I = !0, B = new Int32Array(Z[0].levelBuffer.buffer, Z[0].levelBuffer.byteOffset, Z[0].levelBuffer.byteLength / 4)), {
        resource: new si(B, {
          width: Z[0].levelWidth,
          height: Z[0].levelHeight
        }),
        type: a,
        format: I ? Gm(o) : o
      };
    }),
    kvData: x
  } : {
    compressed: m.map(function(Z) {
      return new Ha(null, {
        format: s,
        width: u,
        height: h,
        levels: d,
        levelBuffers: Z
      });
    }),
    kvData: x
  };
}
function Um(r, e) {
  for (var t = 0; t < nu.length; t++)
    if (e.getUint8(t) !== nu[t])
      return console.error(r + " is not a valid *.ktx file!"), !1;
  return !0;
}
function Gm(r) {
  switch (r) {
    case N.RGBA:
      return N.RGBA_INTEGER;
    case N.RGB:
      return N.RGB_INTEGER;
    case N.RG:
      return N.RG_INTEGER;
    case N.RED:
      return N.RED_INTEGER;
    default:
      return r;
  }
}
function km(r, e, t) {
  for (var i = /* @__PURE__ */ new Map(), n = 0; n < e; ) {
    var a = r.getUint32(ja + n, t), o = ja + n + 4, s = 3 - (a + 3) % 4;
    if (a === 0 || a > e - n) {
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
wt.setExtensionXhrType("dds", wt.XHR_RESPONSE_TYPE.BUFFER);
var Hm = (
  /** @class */
  function() {
    function r() {
    }
    return r.use = function(e, t) {
      if (e.extension === "dds" && e.data)
        try {
          Object.assign(e, Wh(e.name || e.url, Dm(e.data), e.metadata));
        } catch (i) {
          t(i);
          return;
        }
      t();
    }, r.extension = pt.Loader, r;
  }()
);
wt.setExtensionXhrType("ktx", wt.XHR_RESPONSE_TYPE.BUFFER);
var Xm = (
  /** @class */
  function() {
    function r() {
    }
    return r.use = function(e, t) {
      if (e.extension === "ktx" && e.data)
        try {
          var i = e.name || e.url, n = Lm(i, e.data, this.loadKeyValueData), a = n.compressed, o = n.uncompressed, s = n.kvData;
          if (a) {
            var u = Wh(i, a, e.metadata);
            if (s && u.textures)
              for (var h in u.textures)
                u.textures[h].baseTexture.ktxKeyValueData = s;
            Object.assign(e, u);
          } else if (o) {
            var l = {};
            o.forEach(function(f, c) {
              var d = new W(new rt(f.resource, {
                mipmap: te.OFF,
                alphaMode: ee.NO_PREMULTIPLIED_ALPHA,
                type: f.type,
                format: f.format
              })), p = i + "-" + (c + 1);
              s && (d.baseTexture.ktxKeyValueData = s), rt.addToCache(d.baseTexture, p), W.addToCache(d, p), c === 0 && (l[i] = d, rt.addToCache(d.baseTexture, i), W.addToCache(d, i)), l[p] = d;
            }), Object.assign(e, { textures: l });
          }
        } catch (f) {
          t(f);
          return;
        }
      t();
    }, r.extension = pt.Loader, r.loadKeyValueData = !1, r;
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
var Va = function(r, e) {
  return Va = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Va(r, e);
};
function Yh(r, e) {
  Va(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
(function(r) {
  Yh(e, r);
  function e(t, i, n, a) {
    t === void 0 && (t = 1500), n === void 0 && (n = 16384), a === void 0 && (a = !1);
    var o = r.call(this) || this, s = 16384;
    return n > s && (n = s), o._properties = [!1, !0, !1, !1, !1], o._maxSize = t, o._batchSize = n, o._buffers = null, o._bufferUpdateIDs = [], o._updateID = 0, o.interactiveChildren = !1, o.blendMode = H.NORMAL, o.autoResize = a, o.roundPixels = !0, o.baseTexture = null, o.setProperties(i), o._tint = 0, o.tintRgb = new Float32Array(4), o.tint = 16777215, o;
  }
  return e.prototype.setProperties = function(t) {
    t && (this._properties[0] = "vertices" in t || "scale" in t ? !!t.vertices || !!t.scale : this._properties[0], this._properties[1] = "position" in t ? !!t.position : this._properties[1], this._properties[2] = "rotation" in t ? !!t.rotation : this._properties[2], this._properties[3] = "uvs" in t ? !!t.uvs : this._properties[3], this._properties[4] = "tint" in t || "alpha" in t ? !!t.tint || !!t.alpha : this._properties[4]);
  }, e.prototype.updateTransform = function() {
    this.displayObjectUpdateTransform();
  }, Object.defineProperty(e.prototype, "tint", {
    /**
     * The tint applied to the container. This is a hex value.
     * A value of 0xFFFFFF will remove any tint effect.
     * IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
     * @default 0xFFFFFF
     */
    get: function() {
      return this._tint;
    },
    set: function(t) {
      this._tint = t, Ir(t, this.tintRgb);
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.render = function(t) {
    var i = this;
    !this.visible || this.worldAlpha <= 0 || !this.children.length || !this.renderable || (this.baseTexture || (this.baseTexture = this.children[0]._texture.baseTexture, this.baseTexture.valid || this.baseTexture.once("update", function() {
      return i.onChildrenChange(0);
    })), t.batch.setObjectRenderer(t.plugins.particle), t.plugins.particle.render(this));
  }, e.prototype.onChildrenChange = function(t) {
    for (var i = Math.floor(t / this._batchSize); this._bufferUpdateIDs.length < i; )
      this._bufferUpdateIDs.push(0);
    this._bufferUpdateIDs[i] = ++this._updateID;
  }, e.prototype.dispose = function() {
    if (this._buffers) {
      for (var t = 0; t < this._buffers.length; ++t)
        this._buffers[t].destroy();
      this._buffers = null;
    }
  }, e.prototype.destroy = function(t) {
    r.prototype.destroy.call(this, t), this.dispose(), this._properties = null, this._buffers = null, this._bufferUpdateIDs = null;
  }, e;
})(fe);
var ou = (
  /** @class */
  function() {
    function r(e, t, i) {
      this.geometry = new ui(), this.indexBuffer = null, this.size = i, this.dynamicProperties = [], this.staticProperties = [];
      for (var n = 0; n < e.length; ++n) {
        var a = e[n];
        a = {
          attributeName: a.attributeName,
          size: a.size,
          uploadFunction: a.uploadFunction,
          type: a.type || k.FLOAT,
          offset: a.offset
        }, t[n] ? this.dynamicProperties.push(a) : this.staticProperties.push(a);
      }
      this.staticStride = 0, this.staticBuffer = null, this.staticData = null, this.staticDataUint32 = null, this.dynamicStride = 0, this.dynamicBuffer = null, this.dynamicData = null, this.dynamicDataUint32 = null, this._updateID = 0, this.initBuffers();
    }
    return r.prototype.initBuffers = function() {
      var e = this.geometry, t = 0;
      this.indexBuffer = new Ot(J_(this.size), !0, !0), e.addIndex(this.indexBuffer), this.dynamicStride = 0;
      for (var i = 0; i < this.dynamicProperties.length; ++i) {
        var n = this.dynamicProperties[i];
        n.offset = t, t += n.size, this.dynamicStride += n.size;
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
        e.addAttribute(n.attributeName, this.dynamicBuffer, 0, n.type === k.UNSIGNED_BYTE, n.type, this.dynamicStride * 4, n.offset * 4);
      }
      for (var i = 0; i < this.staticProperties.length; ++i) {
        var n = this.staticProperties[i];
        e.addAttribute(n.attributeName, this.staticBuffer, 0, n.type === k.UNSIGNED_BYTE, n.type, this.staticStride * 4, n.offset * 4);
      }
    }, r.prototype.uploadDynamic = function(e, t, i) {
      for (var n = 0; n < this.dynamicProperties.length; n++) {
        var a = this.dynamicProperties[n];
        a.uploadFunction(e, t, i, a.type === k.UNSIGNED_BYTE ? this.dynamicDataUint32 : this.dynamicData, this.dynamicStride, a.offset);
      }
      this.dynamicBuffer._updateID++;
    }, r.prototype.uploadStatic = function(e, t, i) {
      for (var n = 0; n < this.staticProperties.length; n++) {
        var a = this.staticProperties[n];
        a.uploadFunction(e, t, i, a.type === k.UNSIGNED_BYTE ? this.staticDataUint32 : this.staticData, this.staticStride, a.offset);
      }
      this.staticBuffer._updateID++;
    }, r.prototype.destroy = function() {
      this.indexBuffer = null, this.dynamicProperties = null, this.dynamicBuffer = null, this.dynamicData = null, this.dynamicDataUint32 = null, this.staticProperties = null, this.staticBuffer = null, this.staticData = null, this.staticDataUint32 = null, this.geometry.destroy();
    }, r;
  }()
), jm = `varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

void main(void){
    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;
    gl_FragColor = color;
}`, Vm = `attribute vec2 aVertexPosition;
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
`, zm = (
  /** @class */
  function(r) {
    Yh(e, r);
    function e(t) {
      var i = r.call(this, t) || this;
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
          type: k.UNSIGNED_BYTE,
          uploadFunction: i.uploadTint,
          offset: 0
        }
      ], i.shader = Ce.from(Vm, jm, {}), i.state = sr.for2d(), i;
    }
    return e.prototype.render = function(t) {
      var i = t.children, n = t._maxSize, a = t._batchSize, o = this.renderer, s = i.length;
      if (s !== 0) {
        s > n && !t.autoResize && (s = n);
        var u = t._buffers;
        u || (u = t._buffers = this.generateBuffers(t));
        var h = i[0]._texture.baseTexture, l = h.alphaMode > 0;
        this.state.blendMode = Eh(t.blendMode, l), o.state.set(this.state);
        var f = o.gl, c = t.worldTransform.copyTo(this.tempMatrix);
        c.prepend(o.globalUniforms.uniforms.projectionMatrix), this.shader.uniforms.translationMatrix = c.toArray(!0), this.shader.uniforms.uColor = Q_(t.tintRgb, t.worldAlpha, this.shader.uniforms.uColor, l), this.shader.uniforms.uSampler = h, this.renderer.shader.bind(this.shader);
        for (var d = !1, p = 0, v = 0; p < s; p += a, v += 1) {
          var _ = s - p;
          _ > a && (_ = a), v >= u.length && u.push(this._generateOneMoreBuffer(t));
          var y = u[v];
          y.uploadDynamic(i, p, _);
          var g = t._bufferUpdateIDs[v] || 0;
          d = d || y._updateID < g, d && (y._updateID = t._updateID, y.uploadStatic(i, p, _)), o.geometry.bind(y.geometry), f.drawElements(f.TRIANGLES, _ * 6, f.UNSIGNED_SHORT, 0);
        }
      }
    }, e.prototype.generateBuffers = function(t) {
      for (var i = [], n = t._maxSize, a = t._batchSize, o = t._properties, s = 0; s < n; s += a)
        i.push(new ou(this.properties, o, a));
      return i;
    }, e.prototype._generateOneMoreBuffer = function(t) {
      var i = t._batchSize, n = t._properties;
      return new ou(this.properties, n, i);
    }, e.prototype.uploadVertices = function(t, i, n, a, o, s) {
      for (var u = 0, h = 0, l = 0, f = 0, c = 0; c < n; ++c) {
        var d = t[i + c], p = d._texture, v = d.scale.x, _ = d.scale.y, y = p.trim, g = p.orig;
        y ? (h = y.x - d.anchor.x * g.width, u = h + y.width, f = y.y - d.anchor.y * g.height, l = f + y.height) : (u = g.width * (1 - d.anchor.x), h = g.width * -d.anchor.x, l = g.height * (1 - d.anchor.y), f = g.height * -d.anchor.y), a[s] = h * v, a[s + 1] = f * _, a[s + o] = u * v, a[s + o + 1] = f * _, a[s + o * 2] = u * v, a[s + o * 2 + 1] = l * _, a[s + o * 3] = h * v, a[s + o * 3 + 1] = l * _, s += o * 4;
      }
    }, e.prototype.uploadPosition = function(t, i, n, a, o, s) {
      for (var u = 0; u < n; u++) {
        var h = t[i + u].position;
        a[s] = h.x, a[s + 1] = h.y, a[s + o] = h.x, a[s + o + 1] = h.y, a[s + o * 2] = h.x, a[s + o * 2 + 1] = h.y, a[s + o * 3] = h.x, a[s + o * 3 + 1] = h.y, s += o * 4;
      }
    }, e.prototype.uploadRotation = function(t, i, n, a, o, s) {
      for (var u = 0; u < n; u++) {
        var h = t[i + u].rotation;
        a[s] = h, a[s + o] = h, a[s + o * 2] = h, a[s + o * 3] = h, s += o * 4;
      }
    }, e.prototype.uploadUvs = function(t, i, n, a, o, s) {
      for (var u = 0; u < n; ++u) {
        var h = t[i + u]._texture._uvs;
        h ? (a[s] = h.x0, a[s + 1] = h.y0, a[s + o] = h.x1, a[s + o + 1] = h.y1, a[s + o * 2] = h.x2, a[s + o * 2 + 1] = h.y2, a[s + o * 3] = h.x3, a[s + o * 3 + 1] = h.y3, s += o * 4) : (a[s] = 0, a[s + 1] = 0, a[s + o] = 0, a[s + o + 1] = 0, a[s + o * 2] = 0, a[s + o * 2 + 1] = 0, a[s + o * 3] = 0, a[s + o * 3 + 1] = 0, s += o * 4);
      }
    }, e.prototype.uploadTint = function(t, i, n, a, o, s) {
      for (var u = 0; u < n; ++u) {
        var h = t[i + u], l = h._texture.baseTexture.alphaMode > 0, f = h.alpha, c = f < 1 && l ? wo(h._tintRGB, f) : h._tintRGB + (f * 255 << 24);
        a[s] = c, a[s + o] = c, a[s + o * 2] = c, a[s + o * 3] = c, s += o * 4;
      }
    }, e.prototype.destroy = function() {
      r.prototype.destroy.call(this), this.shader && (this.shader.destroy(), this.shader = null), this.tempMatrix = null;
    }, e.extension = {
      name: "particle",
      type: pt.RendererPlugin
    }, e;
  }(mn)
);
/*!
 * @pixi/graphics - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/graphics is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var ge;
(function(r) {
  r.MITER = "miter", r.BEVEL = "bevel", r.ROUND = "round";
})(ge || (ge = {}));
var Ie;
(function(r) {
  r.BUTT = "butt", r.ROUND = "round", r.SQUARE = "square";
})(Ie || (Ie = {}));
var ei = {
  adaptive: !0,
  maxLength: 10,
  minSegments: 8,
  maxSegments: 2048,
  epsilon: 1e-4,
  _segmentsCount: function(r, e) {
    if (e === void 0 && (e = 20), !this.adaptive || !r || isNaN(r))
      return e;
    var t = Math.ceil(r / this.maxLength);
    return t < this.minSegments ? t = this.minSegments : t > this.maxSegments && (t = this.maxSegments), t;
  }
}, qh = (
  /** @class */
  function() {
    function r() {
      this.color = 16777215, this.alpha = 1, this.texture = W.WHITE, this.matrix = null, this.visible = !1, this.reset();
    }
    return r.prototype.clone = function() {
      var e = new r();
      return e.color = this.color, e.alpha = this.alpha, e.texture = this.texture, e.matrix = this.matrix, e.visible = this.visible, e;
    }, r.prototype.reset = function() {
      this.color = 16777215, this.alpha = 1, this.texture = W.WHITE, this.matrix = null, this.visible = !1;
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
var za = function(r, e) {
  return za = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, za(r, e);
};
function Ao(r, e) {
  za(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
function su(r, e) {
  var t, i;
  e === void 0 && (e = !1);
  var n = r.length;
  if (!(n < 6)) {
    for (var a = 0, o = 0, s = r[n - 2], u = r[n - 1]; o < n; o += 2) {
      var h = r[o], l = r[o + 1];
      a += (h - s) * (l + u), s = h, u = l;
    }
    if (!e && a > 0 || e && a <= 0)
      for (var f = n / 2, o = f + f % 2; o < n; o += 2) {
        var c = n - o - 2, d = n - o - 1, p = o, v = o + 1;
        t = [r[p], r[c]], r[c] = t[0], r[p] = t[1], i = [r[v], r[d]], r[d] = i[0], r[v] = i[1];
      }
  }
}
var Kh = {
  build: function(r) {
    r.points = r.shape.points.slice();
  },
  triangulate: function(r, e) {
    var t = r.points, i = r.holes, n = e.points, a = e.indices;
    if (t.length >= 6) {
      su(t, !1);
      for (var o = [], s = 0; s < i.length; s++) {
        var u = i[s];
        su(u.points, !0), o.push(t.length / 2), t = t.concat(u.points);
      }
      var h = th(t, o, 2);
      if (!h)
        return;
      for (var l = n.length / 2, s = 0; s < h.length; s += 3)
        a.push(h[s] + l), a.push(h[s + 1] + l), a.push(h[s + 2] + l);
      for (var s = 0; s < t.length; s++)
        n.push(t[s]);
    }
  }
}, cn = {
  build: function(r) {
    var e = r.points, t, i, n, a, o, s;
    if (r.type === Dt.CIRC) {
      var u = r.shape;
      t = u.x, i = u.y, o = s = u.radius, n = a = 0;
    } else if (r.type === Dt.ELIP) {
      var h = r.shape;
      t = h.x, i = h.y, o = h.width, s = h.height, n = a = 0;
    } else {
      var l = r.shape, f = l.width / 2, c = l.height / 2;
      t = l.x + f, i = l.y + c, o = s = Math.max(0, Math.min(l.radius, Math.min(f, c))), n = f - o, a = c - s;
    }
    if (!(o >= 0 && s >= 0 && n >= 0 && a >= 0)) {
      e.length = 0;
      return;
    }
    var d = Math.ceil(2.3 * Math.sqrt(o + s)), p = d * 8 + (n ? 4 : 0) + (a ? 4 : 0);
    if (e.length = p, p !== 0) {
      if (d === 0) {
        e.length = 8, e[0] = e[6] = t + n, e[1] = e[3] = i + a, e[2] = e[4] = t - n, e[5] = e[7] = i - a;
        return;
      }
      var v = 0, _ = d * 4 + (n ? 2 : 0) + 2, y = _, g = p;
      {
        var m = n + o, E = a, b = t + m, x = t - m, S = i + E;
        if (e[v++] = b, e[v++] = S, e[--_] = S, e[--_] = x, a) {
          var A = i - E;
          e[y++] = x, e[y++] = A, e[--g] = A, e[--g] = b;
        }
      }
      for (var w = 1; w < d; w++) {
        var P = Math.PI / 2 * (w / d), m = n + Math.cos(P) * o, E = a + Math.sin(P) * s, b = t + m, x = t - m, S = i + E, A = i - E;
        e[v++] = b, e[v++] = S, e[--_] = S, e[--_] = x, e[y++] = x, e[y++] = A, e[--g] = A, e[--g] = b;
      }
      {
        var m = n, E = a + s, b = t + m, x = t - m, S = i + E, A = i - E;
        e[v++] = b, e[v++] = S, e[--g] = A, e[--g] = b, n && (e[v++] = x, e[v++] = S, e[--g] = A, e[--g] = x);
      }
    }
  },
  triangulate: function(r, e) {
    var t = r.points, i = e.points, n = e.indices;
    if (t.length !== 0) {
      var a = i.length / 2, o = a, s, u;
      if (r.type !== Dt.RREC) {
        var h = r.shape;
        s = h.x, u = h.y;
      } else {
        var l = r.shape;
        s = l.x + l.width / 2, u = l.y + l.height / 2;
      }
      var f = r.matrix;
      i.push(r.matrix ? f.a * s + f.c * u + f.tx : s, r.matrix ? f.b * s + f.d * u + f.ty : u), a++, i.push(t[0], t[1]);
      for (var c = 2; c < t.length; c += 2)
        i.push(t[c], t[c + 1]), n.push(a++, o, a);
      n.push(o + 1, o, a);
    }
  }
}, Wm = {
  build: function(r) {
    var e = r.shape, t = e.x, i = e.y, n = e.width, a = e.height, o = r.points;
    o.length = 0, o.push(t, i, t + n, i, t + n, i + a, t, i + a);
  },
  triangulate: function(r, e) {
    var t = r.points, i = e.points, n = i.length / 2;
    i.push(t[0], t[1], t[2], t[3], t[6], t[7], t[4], t[5]), e.indices.push(n, n + 1, n + 2, n + 1, n + 2, n + 3);
  }
};
function dr(r, e, t) {
  var i = e - r;
  return r + i * t;
}
function Bi(r, e, t, i, n, a, o) {
  o === void 0 && (o = []);
  for (var s = 20, u = o, h = 0, l = 0, f = 0, c = 0, d = 0, p = 0, v = 0, _ = 0; v <= s; ++v)
    _ = v / s, h = dr(r, t, _), l = dr(e, i, _), f = dr(t, n, _), c = dr(i, a, _), d = dr(h, f, _), p = dr(l, c, _), !(v === 0 && u[u.length - 2] === d && u[u.length - 1] === p) && u.push(d, p);
  return u;
}
var Ym = {
  build: function(r) {
    if (nr.nextRoundedRectBehavior) {
      cn.build(r);
      return;
    }
    var e = r.shape, t = r.points, i = e.x, n = e.y, a = e.width, o = e.height, s = Math.max(0, Math.min(e.radius, Math.min(a, o) / 2));
    t.length = 0, s ? (Bi(i, n + s, i, n, i + s, n, t), Bi(i + a - s, n, i + a, n, i + a, n + s, t), Bi(i + a, n + o - s, i + a, n + o, i + a - s, n + o, t), Bi(i + s, n + o, i, n + o, i, n + o - s, t)) : t.push(i, n, i + a, n, i + a, n + o, i, n + o);
  },
  triangulate: function(r, e) {
    if (nr.nextRoundedRectBehavior) {
      cn.triangulate(r, e);
      return;
    }
    for (var t = r.points, i = e.points, n = e.indices, a = i.length / 2, o = th(t, null, 2), s = 0, u = o.length; s < u; s += 3)
      n.push(o[s] + a), n.push(o[s + 1] + a), n.push(o[s + 2] + a);
    for (var s = 0, u = t.length; s < u; s++)
      i.push(t[s], t[++s]);
  }
};
function uu(r, e, t, i, n, a, o, s) {
  var u = r - t * n, h = e - i * n, l = r + t * a, f = e + i * a, c, d;
  o ? (c = i, d = -t) : (c = -i, d = t);
  var p = u + c, v = h + d, _ = l + c, y = f + d;
  return s.push(p, v), s.push(_, y), 2;
}
function He(r, e, t, i, n, a, o, s) {
  var u = t - r, h = i - e, l = Math.atan2(u, h), f = Math.atan2(n - r, a - e);
  s && l < f ? l += Math.PI * 2 : !s && l > f && (f += Math.PI * 2);
  var c = l, d = f - l, p = Math.abs(d), v = Math.sqrt(u * u + h * h), _ = (15 * p * Math.sqrt(v) / Math.PI >> 0) + 1, y = d / _;
  if (c += y, s) {
    o.push(r, e), o.push(t, i);
    for (var g = 1, m = c; g < _; g++, m += y)
      o.push(r, e), o.push(r + Math.sin(m) * v, e + Math.cos(m) * v);
    o.push(r, e), o.push(n, a);
  } else {
    o.push(t, i), o.push(r, e);
    for (var g = 1, m = c; g < _; g++, m += y)
      o.push(r + Math.sin(m) * v, e + Math.cos(m) * v), o.push(r, e);
    o.push(n, a), o.push(r, e);
  }
  return _ * 2;
}
function qm(r, e) {
  var t = r.shape, i = r.points || t.points.slice(), n = e.closePointEps;
  if (i.length !== 0) {
    var a = r.lineStyle, o = new yt(i[0], i[1]), s = new yt(i[i.length - 2], i[i.length - 1]), u = t.type !== Dt.POLY || t.closeStroke, h = Math.abs(o.x - s.x) < n && Math.abs(o.y - s.y) < n;
    if (u) {
      i = i.slice(), h && (i.pop(), i.pop(), s.set(i[i.length - 2], i[i.length - 1]));
      var l = (o.x + s.x) * 0.5, f = (s.y + o.y) * 0.5;
      i.unshift(l, f), i.push(l, f);
    }
    var c = e.points, d = i.length / 2, p = i.length, v = c.length / 2, _ = a.width / 2, y = _ * _, g = a.miterLimit * a.miterLimit, m = i[0], E = i[1], b = i[2], x = i[3], S = 0, A = 0, w = -(E - x), P = m - b, O = 0, M = 0, D = Math.sqrt(w * w + P * P);
    w /= D, P /= D, w *= _, P *= _;
    var C = a.alignment, R = (1 - C) * 2, F = C * 2;
    u || (a.cap === Ie.ROUND ? p += He(m - w * (R - F) * 0.5, E - P * (R - F) * 0.5, m - w * R, E - P * R, m + w * F, E + P * F, c, !0) + 2 : a.cap === Ie.SQUARE && (p += uu(m, E, w, P, R, F, !0, c))), c.push(m - w * R, E - P * R), c.push(m + w * F, E + P * F);
    for (var z = 1; z < d - 1; ++z) {
      m = i[(z - 1) * 2], E = i[(z - 1) * 2 + 1], b = i[z * 2], x = i[z * 2 + 1], S = i[(z + 1) * 2], A = i[(z + 1) * 2 + 1], w = -(E - x), P = m - b, D = Math.sqrt(w * w + P * P), w /= D, P /= D, w *= _, P *= _, O = -(x - A), M = b - S, D = Math.sqrt(O * O + M * M), O /= D, M /= D, O *= _, M *= _;
      var ot = b - m, Z = E - x, B = b - S, I = A - x, X = ot * B + Z * I, $ = Z * B - I * ot, J = $ < 0;
      if (Math.abs($) < 1e-3 * Math.abs(X)) {
        c.push(b - w * R, x - P * R), c.push(b + w * F, x + P * F), X >= 0 && (a.join === ge.ROUND ? p += He(b, x, b - w * R, x - P * R, b - O * R, x - M * R, c, !1) + 4 : p += 2, c.push(b - O * F, x - M * F), c.push(b + O * R, x + M * R));
        continue;
      }
      var _t = (-w + m) * (-P + x) - (-w + b) * (-P + E), K = (-O + S) * (-M + x) - (-O + b) * (-M + A), lt = (ot * K - B * _t) / $, mt = (I * _t - Z * K) / $, St = (lt - b) * (lt - b) + (mt - x) * (mt - x), et = b + (lt - b) * R, at = x + (mt - x) * R, ut = b - (lt - b) * F, dt = x - (mt - x) * F, Q = Math.min(ot * ot + Z * Z, B * B + I * I), q = J ? R : F, L = Q + q * q * y, ht = St <= L;
      ht ? a.join === ge.BEVEL || St / y > g ? (J ? (c.push(et, at), c.push(b + w * F, x + P * F), c.push(et, at), c.push(b + O * F, x + M * F)) : (c.push(b - w * R, x - P * R), c.push(ut, dt), c.push(b - O * R, x - M * R), c.push(ut, dt)), p += 2) : a.join === ge.ROUND ? J ? (c.push(et, at), c.push(b + w * F, x + P * F), p += He(b, x, b + w * F, x + P * F, b + O * F, x + M * F, c, !0) + 4, c.push(et, at), c.push(b + O * F, x + M * F)) : (c.push(b - w * R, x - P * R), c.push(ut, dt), p += He(b, x, b - w * R, x - P * R, b - O * R, x - M * R, c, !1) + 4, c.push(b - O * R, x - M * R), c.push(ut, dt)) : (c.push(et, at), c.push(ut, dt)) : (c.push(b - w * R, x - P * R), c.push(b + w * F, x + P * F), a.join === ge.ROUND ? J ? p += He(b, x, b + w * F, x + P * F, b + O * F, x + M * F, c, !0) + 2 : p += He(b, x, b - w * R, x - P * R, b - O * R, x - M * R, c, !1) + 2 : a.join === ge.MITER && St / y <= g && (J ? (c.push(ut, dt), c.push(ut, dt)) : (c.push(et, at), c.push(et, at)), p += 2), c.push(b - O * R, x - M * R), c.push(b + O * F, x + M * F), p += 2);
    }
    m = i[(d - 2) * 2], E = i[(d - 2) * 2 + 1], b = i[(d - 1) * 2], x = i[(d - 1) * 2 + 1], w = -(E - x), P = m - b, D = Math.sqrt(w * w + P * P), w /= D, P /= D, w *= _, P *= _, c.push(b - w * R, x - P * R), c.push(b + w * F, x + P * F), u || (a.cap === Ie.ROUND ? p += He(b - w * (R - F) * 0.5, x - P * (R - F) * 0.5, b - w * R, x - P * R, b + w * F, x + P * F, c, !1) + 2 : a.cap === Ie.SQUARE && (p += uu(b, x, w, P, R, F, !1, c)));
    for (var ie = e.indices, ur = ei.epsilon * ei.epsilon, z = v; z < p + v - 2; ++z)
      m = c[z * 2], E = c[z * 2 + 1], b = c[(z + 1) * 2], x = c[(z + 1) * 2 + 1], S = c[(z + 2) * 2], A = c[(z + 2) * 2 + 1], !(Math.abs(m * (x - A) + b * (A - E) + S * (E - x)) < ur) && ie.push(z, z + 1, z + 2);
  }
}
function Km(r, e) {
  var t = 0, i = r.shape, n = r.points || i.points, a = i.type !== Dt.POLY || i.closeStroke;
  if (n.length !== 0) {
    var o = e.points, s = e.indices, u = n.length / 2, h = o.length / 2, l = h;
    for (o.push(n[0], n[1]), t = 1; t < u; t++)
      o.push(n[t * 2], n[t * 2 + 1]), s.push(l, l + 1), l++;
    a && s.push(l, h);
  }
}
function hu(r, e) {
  r.lineStyle.native ? Km(r, e) : qm(r, e);
}
var lu = (
  /** @class */
  function() {
    function r() {
    }
    return r.curveTo = function(e, t, i, n, a, o) {
      var s = o[o.length - 2], u = o[o.length - 1], h = u - t, l = s - e, f = n - t, c = i - e, d = Math.abs(h * c - l * f);
      if (d < 1e-8 || a === 0)
        return (o[o.length - 2] !== e || o[o.length - 1] !== t) && o.push(e, t), null;
      var p = h * h + l * l, v = f * f + c * c, _ = h * f + l * c, y = a * Math.sqrt(p) / d, g = a * Math.sqrt(v) / d, m = y * _ / p, E = g * _ / v, b = y * c + g * l, x = y * f + g * h, S = l * (g + m), A = h * (g + m), w = c * (y + E), P = f * (y + E), O = Math.atan2(A - x, S - b), M = Math.atan2(P - x, w - b);
      return {
        cx: b + e,
        cy: x + t,
        radius: a,
        startAngle: O,
        endAngle: M,
        anticlockwise: l * f > c * h
      };
    }, r.arc = function(e, t, i, n, a, o, s, u, h) {
      for (var l = s - o, f = ei._segmentsCount(Math.abs(l) * a, Math.ceil(Math.abs(l) / un) * 40), c = l / (f * 2), d = c * 2, p = Math.cos(c), v = Math.sin(c), _ = f - 1, y = _ % 1 / _, g = 0; g <= _; ++g) {
        var m = g + y * g, E = c + o + d * m, b = Math.cos(E), x = -Math.sin(E);
        h.push((p * b + v * x) * a + i, (p * -x + v * b) * a + n);
      }
    }, r;
  }()
), Zm = (
  /** @class */
  function() {
    function r() {
    }
    return r.curveLength = function(e, t, i, n, a, o, s, u) {
      for (var h = 10, l = 0, f = 0, c = 0, d = 0, p = 0, v = 0, _ = 0, y = 0, g = 0, m = 0, E = 0, b = e, x = t, S = 1; S <= h; ++S)
        f = S / h, c = f * f, d = c * f, p = 1 - f, v = p * p, _ = v * p, y = _ * e + 3 * v * f * i + 3 * p * c * a + d * s, g = _ * t + 3 * v * f * n + 3 * p * c * o + d * u, m = b - y, E = x - g, b = y, x = g, l += Math.sqrt(m * m + E * E);
      return l;
    }, r.curveTo = function(e, t, i, n, a, o, s) {
      var u = s[s.length - 2], h = s[s.length - 1];
      s.length -= 2;
      var l = ei._segmentsCount(r.curveLength(u, h, e, t, i, n, a, o)), f = 0, c = 0, d = 0, p = 0, v = 0;
      s.push(u, h);
      for (var _ = 1, y = 0; _ <= l; ++_)
        y = _ / l, f = 1 - y, c = f * f, d = c * f, p = y * y, v = p * y, s.push(d * u + 3 * c * y * e + 3 * f * p * i + v * a, d * h + 3 * c * y * t + 3 * f * p * n + v * o);
    }, r;
  }()
), $m = (
  /** @class */
  function() {
    function r() {
    }
    return r.curveLength = function(e, t, i, n, a, o) {
      var s = e - 2 * i + a, u = t - 2 * n + o, h = 2 * i - 2 * e, l = 2 * n - 2 * t, f = 4 * (s * s + u * u), c = 4 * (s * h + u * l), d = h * h + l * l, p = 2 * Math.sqrt(f + c + d), v = Math.sqrt(f), _ = 2 * f * v, y = 2 * Math.sqrt(d), g = c / v;
      return (_ * p + v * c * (p - y) + (4 * d * f - c * c) * Math.log((2 * v + g + p) / (g + y))) / (4 * _);
    }, r.curveTo = function(e, t, i, n, a) {
      for (var o = a[a.length - 2], s = a[a.length - 1], u = ei._segmentsCount(r.curveLength(o, s, e, t, i, n)), h = 0, l = 0, f = 1; f <= u; ++f) {
        var c = f / u;
        h = o + (e - o) * c, l = s + (t - s) * c, a.push(h + (e + (i - e) * c - h) * c, l + (t + (n - t) * c - l) * c);
      }
    }, r;
  }()
), Qm = (
  /** @class */
  function() {
    function r() {
      this.reset();
    }
    return r.prototype.begin = function(e, t, i) {
      this.reset(), this.style = e, this.start = t, this.attribStart = i;
    }, r.prototype.end = function(e, t) {
      this.attribSize = t - this.attribStart, this.size = e - this.start;
    }, r.prototype.reset = function() {
      this.style = null, this.size = 0, this.start = 0, this.attribStart = 0, this.attribSize = 0;
    }, r;
  }()
), Xe, ra = (Xe = {}, Xe[Dt.POLY] = Kh, Xe[Dt.CIRC] = cn, Xe[Dt.ELIP] = cn, Xe[Dt.RECT] = Wm, Xe[Dt.RREC] = Ym, Xe), fu = [], Li = [], cu = (
  /** @class */
  function() {
    function r(e, t, i, n) {
      t === void 0 && (t = null), i === void 0 && (i = null), n === void 0 && (n = null), this.points = [], this.holes = [], this.shape = e, this.lineStyle = i, this.fillStyle = t, this.matrix = n, this.type = e.type;
    }
    return r.prototype.clone = function() {
      return new r(this.shape, this.fillStyle, this.lineStyle, this.matrix);
    }, r.prototype.destroy = function() {
      this.shape = null, this.holes.length = 0, this.holes = null, this.points.length = 0, this.points = null, this.lineStyle = null, this.fillStyle = null;
    }, r;
  }()
), pr = new yt(), Jm = (
  /** @class */
  function(r) {
    Ao(e, r);
    function e() {
      var t = r.call(this) || this;
      return t.closePointEps = 1e-4, t.boundsPadding = 0, t.uvsFloat32 = null, t.indicesUint16 = null, t.batchable = !1, t.points = [], t.colors = [], t.uvs = [], t.indices = [], t.textureIds = [], t.graphicsData = [], t.drawCalls = [], t.batchDirty = -1, t.batches = [], t.dirty = 0, t.cacheDirty = -1, t.clearDirty = 0, t.shapeIndex = 0, t._bounds = new hn(), t.boundsDirty = -1, t;
    }
    return Object.defineProperty(e.prototype, "bounds", {
      /**
       * Get the current bounds of the graphic geometry.
       * @readonly
       */
      get: function() {
        return this.updateBatches(), this.boundsDirty !== this.dirty && (this.boundsDirty = this.dirty, this.calculateBounds()), this._bounds;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.invalidate = function() {
      this.boundsDirty = -1, this.dirty++, this.batchDirty++, this.shapeIndex = 0, this.points.length = 0, this.colors.length = 0, this.uvs.length = 0, this.indices.length = 0, this.textureIds.length = 0;
      for (var t = 0; t < this.drawCalls.length; t++)
        this.drawCalls[t].texArray.clear(), Li.push(this.drawCalls[t]);
      this.drawCalls.length = 0;
      for (var t = 0; t < this.batches.length; t++) {
        var i = this.batches[t];
        i.reset(), fu.push(i);
      }
      this.batches.length = 0;
    }, e.prototype.clear = function() {
      return this.graphicsData.length > 0 && (this.invalidate(), this.clearDirty++, this.graphicsData.length = 0), this;
    }, e.prototype.drawShape = function(t, i, n, a) {
      i === void 0 && (i = null), n === void 0 && (n = null), a === void 0 && (a = null);
      var o = new cu(t, i, n, a);
      return this.graphicsData.push(o), this.dirty++, this;
    }, e.prototype.drawHole = function(t, i) {
      if (i === void 0 && (i = null), !this.graphicsData.length)
        return null;
      var n = new cu(t, null, null, i), a = this.graphicsData[this.graphicsData.length - 1];
      return n.lineStyle = a.lineStyle, a.holes.push(n), this.dirty++, this;
    }, e.prototype.destroy = function() {
      r.prototype.destroy.call(this);
      for (var t = 0; t < this.graphicsData.length; ++t)
        this.graphicsData[t].destroy();
      this.points.length = 0, this.points = null, this.colors.length = 0, this.colors = null, this.uvs.length = 0, this.uvs = null, this.indices.length = 0, this.indices = null, this.indexBuffer.destroy(), this.indexBuffer = null, this.graphicsData.length = 0, this.graphicsData = null, this.drawCalls.length = 0, this.drawCalls = null, this.batches.length = 0, this.batches = null, this._bounds = null;
    }, e.prototype.containsPoint = function(t) {
      for (var i = this.graphicsData, n = 0; n < i.length; ++n) {
        var a = i[n];
        if (a.fillStyle.visible && a.shape && (a.matrix ? a.matrix.applyInverse(t, pr) : pr.copyFrom(t), a.shape.contains(pr.x, pr.y))) {
          var o = !1;
          if (a.holes)
            for (var s = 0; s < a.holes.length; s++) {
              var u = a.holes[s];
              if (u.shape.contains(pr.x, pr.y)) {
                o = !0;
                break;
              }
            }
          if (!o)
            return !0;
        }
      }
      return !1;
    }, e.prototype.updateBatches = function() {
      if (!this.graphicsData.length) {
        this.batchable = !0;
        return;
      }
      if (this.validateBatching()) {
        this.cacheDirty = this.dirty;
        var t = this.uvs, i = this.graphicsData, n = null, a = null;
        this.batches.length > 0 && (n = this.batches[this.batches.length - 1], a = n.style);
        for (var o = this.shapeIndex; o < i.length; o++) {
          this.shapeIndex++;
          var s = i[o], u = s.fillStyle, h = s.lineStyle, l = ra[s.type];
          l.build(s), s.matrix && this.transformPoints(s.points, s.matrix), (u.visible || h.visible) && this.processHoles(s.holes);
          for (var f = 0; f < 2; f++) {
            var c = f === 0 ? u : h;
            if (c.visible) {
              var d = c.texture.baseTexture, p = this.indices.length, v = this.points.length / 2;
              d.wrapMode = ue.REPEAT, f === 0 ? this.processFill(s) : this.processLine(s);
              var _ = this.points.length / 2 - v;
              _ !== 0 && (n && !this._compareStyles(a, c) && (n.end(p, v), n = null), n || (n = fu.pop() || new Qm(), n.begin(c, p, v), this.batches.push(n), a = c), this.addUvs(this.points, t, c.texture, v, _, c.matrix));
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
    }, e.prototype._compareStyles = function(t, i) {
      return !(!t || !i || t.texture.baseTexture !== i.texture.baseTexture || t.color + t.alpha !== i.color + i.alpha || !!t.native != !!i.native);
    }, e.prototype.validateBatching = function() {
      if (this.dirty === this.cacheDirty || !this.graphicsData.length)
        return !1;
      for (var t = 0, i = this.graphicsData.length; t < i; t++) {
        var n = this.graphicsData[t], a = n.fillStyle, o = n.lineStyle;
        if (a && !a.texture.baseTexture.valid || o && !o.texture.baseTexture.valid)
          return !1;
      }
      return !0;
    }, e.prototype.packBatches = function() {
      this.batchDirty++, this.uvsFloat32 = new Float32Array(this.uvs);
      for (var t = this.batches, i = 0, n = t.length; i < n; i++)
        for (var a = t[i], o = 0; o < a.size; o++) {
          var s = a.start + o;
          this.indicesUint16[s] = this.indicesUint16[s] - a.attribStart;
        }
    }, e.prototype.isBatchable = function() {
      if (this.points.length > 65535 * 2)
        return !1;
      for (var t = this.batches, i = 0; i < t.length; i++)
        if (t[i].style.native)
          return !1;
      return this.points.length < e.BATCHABLE_SIZE * 2;
    }, e.prototype.buildDrawCalls = function() {
      for (var t = ++rt._globalBatch, i = 0; i < this.drawCalls.length; i++)
        this.drawCalls[i].texArray.clear(), Li.push(this.drawCalls[i]);
      this.drawCalls.length = 0;
      var n = this.colors, a = this.textureIds, o = Li.pop();
      o || (o = new Ba(), o.texArray = new La()), o.texArray.count = 0, o.start = 0, o.size = 0, o.type = $t.TRIANGLES;
      var s = 0, u = null, h = 0, l = !1, f = $t.TRIANGLES, c = 0;
      this.drawCalls.push(o);
      for (var i = 0; i < this.batches.length; i++) {
        var d = this.batches[i], p = 8, v = d.style, _ = v.texture.baseTexture;
        l !== !!v.native && (l = !!v.native, f = l ? $t.LINES : $t.TRIANGLES, u = null, s = p, t++), u !== _ && (u = _, _._batchEnabled !== t && (s === p && (t++, s = 0, o.size > 0 && (o = Li.pop(), o || (o = new Ba(), o.texArray = new La()), this.drawCalls.push(o)), o.start = c, o.size = 0, o.texArray.count = 0, o.type = f), _.touched = 1, _._batchEnabled = t, _._batchLocation = s, _.wrapMode = ue.REPEAT, o.texArray.elements[o.texArray.count++] = _, s++)), o.size += d.size, c += d.size, h = _._batchLocation, this.addColors(n, v.color, v.alpha, d.attribSize, d.attribStart), this.addTextureIds(a, h, d.attribSize, d.attribStart);
      }
      rt._globalBatch = t, this.packAttributes();
    }, e.prototype.packAttributes = function() {
      for (var t = this.points, i = this.uvs, n = this.colors, a = this.textureIds, o = new ArrayBuffer(t.length * 3 * 4), s = new Float32Array(o), u = new Uint32Array(o), h = 0, l = 0; l < t.length / 2; l++)
        s[h++] = t[l * 2], s[h++] = t[l * 2 + 1], s[h++] = i[l * 2], s[h++] = i[l * 2 + 1], u[h++] = n[l], s[h++] = a[l];
      this._buffer.update(o), this._indexBuffer.update(this.indicesUint16);
    }, e.prototype.processFill = function(t) {
      if (t.holes.length)
        Kh.triangulate(t, this);
      else {
        var i = ra[t.type];
        i.triangulate(t, this);
      }
    }, e.prototype.processLine = function(t) {
      hu(t, this);
      for (var i = 0; i < t.holes.length; i++)
        hu(t.holes[i], this);
    }, e.prototype.processHoles = function(t) {
      for (var i = 0; i < t.length; i++) {
        var n = t[i], a = ra[n.type];
        a.build(n), n.matrix && this.transformPoints(n.points, n.matrix);
      }
    }, e.prototype.calculateBounds = function() {
      var t = this._bounds;
      t.clear(), t.addVertexData(this.points, 0, this.points.length), t.pad(this.boundsPadding, this.boundsPadding);
    }, e.prototype.transformPoints = function(t, i) {
      for (var n = 0; n < t.length / 2; n++) {
        var a = t[n * 2], o = t[n * 2 + 1];
        t[n * 2] = i.a * a + i.c * o + i.tx, t[n * 2 + 1] = i.b * a + i.d * o + i.ty;
      }
    }, e.prototype.addColors = function(t, i, n, a, o) {
      o === void 0 && (o = 0);
      var s = (i >> 16) + (i & 65280) + ((i & 255) << 16), u = wo(s, n);
      t.length = Math.max(t.length, o + a);
      for (var h = 0; h < a; h++)
        t[o + h] = u;
    }, e.prototype.addTextureIds = function(t, i, n, a) {
      a === void 0 && (a = 0), t.length = Math.max(t.length, a + n);
      for (var o = 0; o < n; o++)
        t[a + o] = i;
    }, e.prototype.addUvs = function(t, i, n, a, o, s) {
      s === void 0 && (s = null);
      for (var u = 0, h = i.length, l = n.frame; u < o; ) {
        var f = t[(a + u) * 2], c = t[(a + u) * 2 + 1];
        if (s) {
          var d = s.a * f + s.c * c + s.tx;
          c = s.b * f + s.d * c + s.ty, f = d;
        }
        u++, i.push(f / l.width, c / l.height);
      }
      var p = n.baseTexture;
      (l.width < p.width || l.height < p.height) && this.adjustUvs(i, n, h, o);
    }, e.prototype.adjustUvs = function(t, i, n, a) {
      for (var o = i.baseTexture, s = 1e-6, u = n + a * 2, h = i.frame, l = h.width / o.width, f = h.height / o.height, c = h.x / h.width, d = h.y / h.height, p = Math.floor(t[n] + s), v = Math.floor(t[n + 1] + s), _ = n + 2; _ < u; _ += 2)
        p = Math.min(p, Math.floor(t[_] + s)), v = Math.min(v, Math.floor(t[_ + 1] + s));
      c -= p, d -= v;
      for (var _ = n; _ < u; _ += 2)
        t[_] = (t[_] + c) * l, t[_ + 1] = (t[_ + 1] + d) * f;
    }, e.BATCHABLE_SIZE = 100, e;
  }(Xh)
), t0 = (
  /** @class */
  function(r) {
    Ao(e, r);
    function e() {
      var t = r !== null && r.apply(this, arguments) || this;
      return t.width = 0, t.alignment = 0.5, t.native = !1, t.cap = Ie.BUTT, t.join = ge.MITER, t.miterLimit = 10, t;
    }
    return e.prototype.clone = function() {
      var t = new e();
      return t.color = this.color, t.alpha = this.alpha, t.texture = this.texture, t.matrix = this.matrix, t.visible = this.visible, t.width = this.width, t.alignment = this.alignment, t.native = this.native, t.cap = this.cap, t.join = this.join, t.miterLimit = this.miterLimit, t;
    }, e.prototype.reset = function() {
      r.prototype.reset.call(this), this.color = 0, this.alignment = 0.5, this.width = 0, this.native = !1;
    }, e;
  }(qh)
), e0 = new Float32Array(3), ia = {}, nr = (
  /** @class */
  function(r) {
    Ao(e, r);
    function e(t) {
      t === void 0 && (t = null);
      var i = r.call(this) || this;
      return i.shader = null, i.pluginName = "batch", i.currentPath = null, i.batches = [], i.batchTint = -1, i.batchDirty = -1, i.vertexData = null, i._fillStyle = new qh(), i._lineStyle = new t0(), i._matrix = null, i._holeMode = !1, i.state = sr.for2d(), i._geometry = t || new Jm(), i._geometry.refCount++, i._transformID = -1, i.tint = 16777215, i.blendMode = H.NORMAL, i;
    }
    return Object.defineProperty(e.prototype, "geometry", {
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
    }), e.prototype.clone = function() {
      return this.finishPoly(), new e(this._geometry);
    }, Object.defineProperty(e.prototype, "blendMode", {
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
      set: function(t) {
        this.state.blendMode = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "tint", {
      /**
       * The tint applied to each graphic shape. This is a hex value. A value of
       * 0xFFFFFF will remove any tint effect.
       * @default 0xFFFFFF
       */
      get: function() {
        return this._tint;
      },
      set: function(t) {
        this._tint = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "fill", {
      /**
       * The current fill style.
       * @readonly
       */
      get: function() {
        return this._fillStyle;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "line", {
      /**
       * The current line style.
       * @readonly
       */
      get: function() {
        return this._lineStyle;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.lineStyle = function(t, i, n, a, o) {
      return t === void 0 && (t = null), i === void 0 && (i = 0), n === void 0 && (n = 1), a === void 0 && (a = 0.5), o === void 0 && (o = !1), typeof t == "number" && (t = { width: t, color: i, alpha: n, alignment: a, native: o }), this.lineTextureStyle(t);
    }, e.prototype.lineTextureStyle = function(t) {
      t = Object.assign({
        width: 0,
        texture: W.WHITE,
        color: t && t.texture ? 16777215 : 0,
        alpha: 1,
        matrix: null,
        alignment: 0.5,
        native: !1,
        cap: Ie.BUTT,
        join: ge.MITER,
        miterLimit: 10
      }, t), this.currentPath && this.startPoly();
      var i = t.width > 0 && t.alpha > 0;
      return i ? (t.matrix && (t.matrix = t.matrix.clone(), t.matrix.invert()), Object.assign(this._lineStyle, { visible: i }, t)) : this._lineStyle.reset(), this;
    }, e.prototype.startPoly = function() {
      if (this.currentPath) {
        var t = this.currentPath.points, i = this.currentPath.points.length;
        i > 2 && (this.drawShape(this.currentPath), this.currentPath = new Wi(), this.currentPath.closeStroke = !1, this.currentPath.points.push(t[i - 2], t[i - 1]));
      } else
        this.currentPath = new Wi(), this.currentPath.closeStroke = !1;
    }, e.prototype.finishPoly = function() {
      this.currentPath && (this.currentPath.points.length > 2 ? (this.drawShape(this.currentPath), this.currentPath = null) : this.currentPath.points.length = 0);
    }, e.prototype.moveTo = function(t, i) {
      return this.startPoly(), this.currentPath.points[0] = t, this.currentPath.points[1] = i, this;
    }, e.prototype.lineTo = function(t, i) {
      this.currentPath || this.moveTo(0, 0);
      var n = this.currentPath.points, a = n[n.length - 2], o = n[n.length - 1];
      return (a !== t || o !== i) && n.push(t, i), this;
    }, e.prototype._initCurve = function(t, i) {
      t === void 0 && (t = 0), i === void 0 && (i = 0), this.currentPath ? this.currentPath.points.length === 0 && (this.currentPath.points = [t, i]) : this.moveTo(t, i);
    }, e.prototype.quadraticCurveTo = function(t, i, n, a) {
      this._initCurve();
      var o = this.currentPath.points;
      return o.length === 0 && this.moveTo(0, 0), $m.curveTo(t, i, n, a, o), this;
    }, e.prototype.bezierCurveTo = function(t, i, n, a, o, s) {
      return this._initCurve(), Zm.curveTo(t, i, n, a, o, s, this.currentPath.points), this;
    }, e.prototype.arcTo = function(t, i, n, a, o) {
      this._initCurve(t, i);
      var s = this.currentPath.points, u = lu.curveTo(t, i, n, a, o, s);
      if (u) {
        var h = u.cx, l = u.cy, f = u.radius, c = u.startAngle, d = u.endAngle, p = u.anticlockwise;
        this.arc(h, l, f, c, d, p);
      }
      return this;
    }, e.prototype.arc = function(t, i, n, a, o, s) {
      if (s === void 0 && (s = !1), a === o)
        return this;
      !s && o <= a ? o += un : s && a <= o && (a += un);
      var u = o - a;
      if (u === 0)
        return this;
      var h = t + Math.cos(a) * n, l = i + Math.sin(a) * n, f = this._geometry.closePointEps, c = this.currentPath ? this.currentPath.points : null;
      if (c) {
        var d = Math.abs(c[c.length - 2] - h), p = Math.abs(c[c.length - 1] - l);
        d < f && p < f || c.push(h, l);
      } else
        this.moveTo(h, l), c = this.currentPath.points;
      return lu.arc(h, l, t, i, n, a, o, s, c), this;
    }, e.prototype.beginFill = function(t, i) {
      return t === void 0 && (t = 0), i === void 0 && (i = 1), this.beginTextureFill({ texture: W.WHITE, color: t, alpha: i });
    }, e.prototype.beginTextureFill = function(t) {
      t = Object.assign({
        texture: W.WHITE,
        color: 16777215,
        alpha: 1,
        matrix: null
      }, t), this.currentPath && this.startPoly();
      var i = t.alpha > 0;
      return i ? (t.matrix && (t.matrix = t.matrix.clone(), t.matrix.invert()), Object.assign(this._fillStyle, { visible: i }, t)) : this._fillStyle.reset(), this;
    }, e.prototype.endFill = function() {
      return this.finishPoly(), this._fillStyle.reset(), this;
    }, e.prototype.drawRect = function(t, i, n, a) {
      return this.drawShape(new it(t, i, n, a));
    }, e.prototype.drawRoundedRect = function(t, i, n, a, o) {
      return this.drawShape(new sy(t, i, n, a, o));
    }, e.prototype.drawCircle = function(t, i, n) {
      return this.drawShape(new ay(t, i, n));
    }, e.prototype.drawEllipse = function(t, i, n, a) {
      return this.drawShape(new oy(t, i, n, a));
    }, e.prototype.drawPolygon = function() {
      for (var t = arguments, i = [], n = 0; n < arguments.length; n++)
        i[n] = t[n];
      var a, o = !0, s = i[0];
      s.points ? (o = s.closeStroke, a = s.points) : Array.isArray(i[0]) ? a = i[0] : a = i;
      var u = new Wi(a);
      return u.closeStroke = o, this.drawShape(u), this;
    }, e.prototype.drawShape = function(t) {
      return this._holeMode ? this._geometry.drawHole(t, this._matrix) : this._geometry.drawShape(t, this._fillStyle.clone(), this._lineStyle.clone(), this._matrix), this;
    }, e.prototype.clear = function() {
      return this._geometry.clear(), this._lineStyle.reset(), this._fillStyle.reset(), this._boundsID++, this._matrix = null, this._holeMode = !1, this.currentPath = null, this;
    }, e.prototype.isFastRect = function() {
      var t = this._geometry.graphicsData;
      return t.length === 1 && t[0].shape.type === Dt.RECT && !t[0].matrix && !t[0].holes.length && !(t[0].lineStyle.visible && t[0].lineStyle.width);
    }, e.prototype._render = function(t) {
      this.finishPoly();
      var i = this._geometry;
      i.updateBatches(), i.batchable ? (this.batchDirty !== i.batchDirty && this._populateBatches(), this._renderBatched(t)) : (t.batch.flush(), this._renderDirect(t));
    }, e.prototype._populateBatches = function() {
      var t = this._geometry, i = this.blendMode, n = t.batches.length;
      this.batchTint = -1, this._transformID = -1, this.batchDirty = t.batchDirty, this.batches.length = n, this.vertexData = new Float32Array(t.points);
      for (var a = 0; a < n; a++) {
        var o = t.batches[a], s = o.style.color, u = new Float32Array(this.vertexData.buffer, o.attribStart * 4 * 2, o.attribSize * 2), h = new Float32Array(t.uvsFloat32.buffer, o.attribStart * 4 * 2, o.attribSize * 2), l = new Uint16Array(t.indicesUint16.buffer, o.start * 2, o.size), f = {
          vertexData: u,
          blendMode: i,
          indices: l,
          uvs: h,
          _batchRGB: Ir(s),
          _tintRGB: s,
          _texture: o.style.texture,
          alpha: o.style.alpha,
          worldAlpha: 1
        };
        this.batches[a] = f;
      }
    }, e.prototype._renderBatched = function(t) {
      if (this.batches.length) {
        t.batch.setObjectRenderer(t.plugins[this.pluginName]), this.calculateVertices(), this.calculateTints();
        for (var i = 0, n = this.batches.length; i < n; i++) {
          var a = this.batches[i];
          a.worldAlpha = this.worldAlpha * a.alpha, t.plugins[this.pluginName].render(a);
        }
      }
    }, e.prototype._renderDirect = function(t) {
      var i = this._resolveDirectShader(t), n = this._geometry, a = this.tint, o = this.worldAlpha, s = i.uniforms, u = n.drawCalls;
      s.translationMatrix = this.transform.worldTransform, s.tint[0] = (a >> 16 & 255) / 255 * o, s.tint[1] = (a >> 8 & 255) / 255 * o, s.tint[2] = (a & 255) / 255 * o, s.tint[3] = o, t.shader.bind(i), t.geometry.bind(n, i), t.state.set(this.state);
      for (var h = 0, l = u.length; h < l; h++)
        this._renderDrawCallDirect(t, n.drawCalls[h]);
    }, e.prototype._renderDrawCallDirect = function(t, i) {
      for (var n = i.texArray, a = i.type, o = i.size, s = i.start, u = n.count, h = 0; h < u; h++)
        t.texture.bind(n.elements[h], h);
      t.geometry.draw(a, o, s);
    }, e.prototype._resolveDirectShader = function(t) {
      var i = this.shader, n = this.pluginName;
      if (!i) {
        if (!ia[n]) {
          for (var a = t.plugins[n].MAX_TEXTURES, o = new Int32Array(a), s = 0; s < a; s++)
            o[s] = s;
          var u = {
            tint: new Float32Array([1, 1, 1, 1]),
            translationMatrix: new It(),
            default: tr.from({ uSamplers: o }, !0)
          }, h = t.plugins[n]._shader.program;
          ia[n] = new Ce(h, u);
        }
        i = ia[n];
      }
      return i;
    }, e.prototype._calculateBounds = function() {
      this.finishPoly();
      var t = this._geometry;
      if (t.graphicsData.length) {
        var i = t.bounds, n = i.minX, a = i.minY, o = i.maxX, s = i.maxY;
        this._bounds.addFrame(this.transform, n, a, o, s);
      }
    }, e.prototype.containsPoint = function(t) {
      return this.worldTransform.applyInverse(t, e._TEMP_POINT), this._geometry.containsPoint(e._TEMP_POINT);
    }, e.prototype.calculateTints = function() {
      if (this.batchTint !== this.tint) {
        this.batchTint = this.tint;
        for (var t = Ir(this.tint, e0), i = 0; i < this.batches.length; i++) {
          var n = this.batches[i], a = n._batchRGB, o = t[0] * a[0] * 255, s = t[1] * a[1] * 255, u = t[2] * a[2] * 255, h = (o << 16) + (s << 8) + (u | 0);
          n._tintRGB = (h >> 16) + (h & 65280) + ((h & 255) << 16);
        }
      }
    }, e.prototype.calculateVertices = function() {
      var t = this.transform._worldID;
      if (this._transformID !== t) {
        this._transformID = t;
        for (var i = this.transform.worldTransform, n = i.a, a = i.b, o = i.c, s = i.d, u = i.tx, h = i.ty, l = this._geometry.points, f = this.vertexData, c = 0, d = 0; d < l.length; d += 2) {
          var p = l[d], v = l[d + 1];
          f[c++] = n * p + o * v + u, f[c++] = s * v + a * p + h;
        }
      }
    }, e.prototype.closePath = function() {
      var t = this.currentPath;
      return t && (t.closeStroke = !0, this.finishPoly()), this;
    }, e.prototype.setMatrix = function(t) {
      return this._matrix = t, this;
    }, e.prototype.beginHole = function() {
      return this.finishPoly(), this._holeMode = !0, this;
    }, e.prototype.endHole = function() {
      return this.finishPoly(), this._holeMode = !1, this;
    }, e.prototype.destroy = function(t) {
      this._geometry.refCount--, this._geometry.refCount === 0 && this._geometry.dispose(), this._matrix = null, this.currentPath = null, this._lineStyle.destroy(), this._lineStyle = null, this._fillStyle.destroy(), this._fillStyle = null, this._geometry = null, this.shader = null, this.vertexData = null, this.batches.length = 0, this.batches = null, r.prototype.destroy.call(this, t);
    }, e.nextRoundedRectBehavior = !1, e._TEMP_POINT = new yt(), e;
  }(fe)
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
var Wa = function(r, e) {
  return Wa = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Wa(r, e);
};
function r0(r, e) {
  Wa(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var kr = new yt(), i0 = new Uint16Array([0, 1, 2, 0, 2, 3]), li = (
  /** @class */
  function(r) {
    r0(e, r);
    function e(t) {
      var i = r.call(this) || this;
      return i._anchor = new br(i._onAnchorUpdate, i, t ? t.defaultAnchor.x : 0, t ? t.defaultAnchor.y : 0), i._texture = null, i._width = 0, i._height = 0, i._tint = null, i._tintRGB = null, i.tint = 16777215, i.blendMode = H.NORMAL, i._cachedTint = 16777215, i.uvs = null, i.texture = t || W.EMPTY, i.vertexData = new Float32Array(8), i.vertexTrimmedData = null, i._transformID = -1, i._textureID = -1, i._transformTrimmedID = -1, i._textureTrimmedID = -1, i.indices = i0, i.pluginName = "batch", i.isSprite = !0, i._roundPixels = U.ROUND_PIXELS, i;
    }
    return e.prototype._onTextureUpdate = function() {
      this._textureID = -1, this._textureTrimmedID = -1, this._cachedTint = 16777215, this._width && (this.scale.x = mr(this.scale.x) * this._width / this._texture.orig.width), this._height && (this.scale.y = mr(this.scale.y) * this._height / this._texture.orig.height);
    }, e.prototype._onAnchorUpdate = function() {
      this._transformID = -1, this._transformTrimmedID = -1;
    }, e.prototype.calculateVertices = function() {
      var t = this._texture;
      if (!(this._transformID === this.transform._worldID && this._textureID === t._updateID)) {
        this._textureID !== t._updateID && (this.uvs = this._texture._uvs.uvsFloat32), this._transformID = this.transform._worldID, this._textureID = t._updateID;
        var i = this.transform.worldTransform, n = i.a, a = i.b, o = i.c, s = i.d, u = i.tx, h = i.ty, l = this.vertexData, f = t.trim, c = t.orig, d = this._anchor, p = 0, v = 0, _ = 0, y = 0;
        if (f ? (v = f.x - d._x * c.width, p = v + f.width, y = f.y - d._y * c.height, _ = y + f.height) : (v = -d._x * c.width, p = v + c.width, y = -d._y * c.height, _ = y + c.height), l[0] = n * v + o * y + u, l[1] = s * y + a * v + h, l[2] = n * p + o * y + u, l[3] = s * y + a * p + h, l[4] = n * p + o * _ + u, l[5] = s * _ + a * p + h, l[6] = n * v + o * _ + u, l[7] = s * _ + a * v + h, this._roundPixels)
          for (var g = U.RESOLUTION, m = 0; m < l.length; ++m)
            l[m] = Math.round((l[m] * g | 0) / g);
      }
    }, e.prototype.calculateTrimmedVertices = function() {
      if (!this.vertexTrimmedData)
        this.vertexTrimmedData = new Float32Array(8);
      else if (this._transformTrimmedID === this.transform._worldID && this._textureTrimmedID === this._texture._updateID)
        return;
      this._transformTrimmedID = this.transform._worldID, this._textureTrimmedID = this._texture._updateID;
      var t = this._texture, i = this.vertexTrimmedData, n = t.orig, a = this._anchor, o = this.transform.worldTransform, s = o.a, u = o.b, h = o.c, l = o.d, f = o.tx, c = o.ty, d = -a._x * n.width, p = d + n.width, v = -a._y * n.height, _ = v + n.height;
      i[0] = s * d + h * v + f, i[1] = l * v + u * d + c, i[2] = s * p + h * v + f, i[3] = l * v + u * p + c, i[4] = s * p + h * _ + f, i[5] = l * _ + u * p + c, i[6] = s * d + h * _ + f, i[7] = l * _ + u * d + c;
    }, e.prototype._render = function(t) {
      this.calculateVertices(), t.batch.setObjectRenderer(t.plugins[this.pluginName]), t.plugins[this.pluginName].render(this);
    }, e.prototype._calculateBounds = function() {
      var t = this._texture.trim, i = this._texture.orig;
      !t || t.width === i.width && t.height === i.height ? (this.calculateVertices(), this._bounds.addQuad(this.vertexData)) : (this.calculateTrimmedVertices(), this._bounds.addQuad(this.vertexTrimmedData));
    }, e.prototype.getLocalBounds = function(t) {
      return this.children.length === 0 ? (this._localBounds || (this._localBounds = new hn()), this._localBounds.minX = this._texture.orig.width * -this._anchor._x, this._localBounds.minY = this._texture.orig.height * -this._anchor._y, this._localBounds.maxX = this._texture.orig.width * (1 - this._anchor._x), this._localBounds.maxY = this._texture.orig.height * (1 - this._anchor._y), t || (this._localBoundsRect || (this._localBoundsRect = new it()), t = this._localBoundsRect), this._localBounds.getRectangle(t)) : r.prototype.getLocalBounds.call(this, t);
    }, e.prototype.containsPoint = function(t) {
      this.worldTransform.applyInverse(t, kr);
      var i = this._texture.orig.width, n = this._texture.orig.height, a = -i * this.anchor.x, o = 0;
      return kr.x >= a && kr.x < a + i && (o = -n * this.anchor.y, kr.y >= o && kr.y < o + n);
    }, e.prototype.destroy = function(t) {
      r.prototype.destroy.call(this, t), this._texture.off("update", this._onTextureUpdate, this), this._anchor = null;
      var i = typeof t == "boolean" ? t : t && t.texture;
      if (i) {
        var n = typeof t == "boolean" ? t : t && t.baseTexture;
        this._texture.destroy(!!n);
      }
      this._texture = null;
    }, e.from = function(t, i) {
      var n = t instanceof W ? t : W.from(t, i);
      return new e(n);
    }, Object.defineProperty(e.prototype, "roundPixels", {
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
      set: function(t) {
        this._roundPixels !== t && (this._transformID = -1), this._roundPixels = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "width", {
      /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return Math.abs(this.scale.x) * this._texture.orig.width;
      },
      set: function(t) {
        var i = mr(this.scale.x) || 1;
        this.scale.x = i * t / this._texture.orig.width, this._width = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "height", {
      /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return Math.abs(this.scale.y) * this._texture.orig.height;
      },
      set: function(t) {
        var i = mr(this.scale.y) || 1;
        this.scale.y = i * t / this._texture.orig.height, this._height = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "anchor", {
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
      set: function(t) {
        this._anchor.copyFrom(t);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "tint", {
      /**
       * The tint applied to the sprite. This is a hex value.
       *
       * A value of 0xFFFFFF will remove any tint effect.
       * @default 0xFFFFFF
       */
      get: function() {
        return this._tint;
      },
      set: function(t) {
        this._tint = t, this._tintRGB = (t >> 16) + (t & 65280) + ((t & 255) << 16);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "texture", {
      /** The texture that the sprite is using. */
      get: function() {
        return this._texture;
      },
      set: function(t) {
        this._texture !== t && (this._texture && this._texture.off("update", this._onTextureUpdate, this), this._texture = t || W.EMPTY, this._cachedTint = 16777215, this._textureID = -1, this._textureTrimmedID = -1, t && (t.baseTexture.valid ? this._onTextureUpdate() : t.once("update", this._onTextureUpdate, this)));
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(fe)
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
var Ya = function(r, e) {
  return Ya = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Ya(r, e);
};
function n0(r, e) {
  Ya(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var ri;
(function(r) {
  r[r.LINEAR_VERTICAL = 0] = "LINEAR_VERTICAL", r[r.LINEAR_HORIZONTAL = 1] = "LINEAR_HORIZONTAL";
})(ri || (ri = {}));
var na = {
  align: "left",
  breakWords: !1,
  dropShadow: !1,
  dropShadowAlpha: 1,
  dropShadowAngle: Math.PI / 6,
  dropShadowBlur: 0,
  dropShadowColor: "black",
  dropShadowDistance: 5,
  fill: "black",
  fillGradientType: ri.LINEAR_VERTICAL,
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
}, a0 = [
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui"
], Cr = (
  /** @class */
  function() {
    function r(e) {
      this.styleID = 0, this.reset(), oa(this, e, e);
    }
    return r.prototype.clone = function() {
      var e = {};
      return oa(e, this, na), new r(e);
    }, r.prototype.reset = function() {
      oa(this, na, na);
    }, Object.defineProperty(r.prototype, "align", {
      /**
       * Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text
       *
       * @member {string}
       */
      get: function() {
        return this._align;
      },
      set: function(e) {
        this._align !== e && (this._align = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "breakWords", {
      /** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true. */
      get: function() {
        return this._breakWords;
      },
      set: function(e) {
        this._breakWords !== e && (this._breakWords = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadow", {
      /** Set a drop shadow for the text. */
      get: function() {
        return this._dropShadow;
      },
      set: function(e) {
        this._dropShadow !== e && (this._dropShadow = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadowAlpha", {
      /** Set alpha for the drop shadow. */
      get: function() {
        return this._dropShadowAlpha;
      },
      set: function(e) {
        this._dropShadowAlpha !== e && (this._dropShadowAlpha = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadowAngle", {
      /** Set a angle of the drop shadow. */
      get: function() {
        return this._dropShadowAngle;
      },
      set: function(e) {
        this._dropShadowAngle !== e && (this._dropShadowAngle = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadowBlur", {
      /** Set a shadow blur radius. */
      get: function() {
        return this._dropShadowBlur;
      },
      set: function(e) {
        this._dropShadowBlur !== e && (this._dropShadowBlur = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadowColor", {
      /** A fill style to be used on the dropshadow e.g 'red', '#00FF00'. */
      get: function() {
        return this._dropShadowColor;
      },
      set: function(e) {
        var t = aa(e);
        this._dropShadowColor !== t && (this._dropShadowColor = t, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "dropShadowDistance", {
      /** Set a distance of the drop shadow. */
      get: function() {
        return this._dropShadowDistance;
      },
      set: function(e) {
        this._dropShadowDistance !== e && (this._dropShadowDistance = e, this.styleID++);
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
      set: function(e) {
        var t = aa(e);
        this._fill !== t && (this._fill = t, this.styleID++);
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
      set: function(e) {
        this._fillGradientType !== e && (this._fillGradientType = e, this.styleID++);
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
      set: function(e) {
        o0(this._fillGradientStops, e) || (this._fillGradientStops = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "fontFamily", {
      /** The font family. */
      get: function() {
        return this._fontFamily;
      },
      set: function(e) {
        this.fontFamily !== e && (this._fontFamily = e, this.styleID++);
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
      set: function(e) {
        this._fontSize !== e && (this._fontSize = e, this.styleID++);
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
      set: function(e) {
        this._fontStyle !== e && (this._fontStyle = e, this.styleID++);
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
      set: function(e) {
        this._fontVariant !== e && (this._fontVariant = e, this.styleID++);
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
      set: function(e) {
        this._fontWeight !== e && (this._fontWeight = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "letterSpacing", {
      /** The amount of spacing between letters, default is 0. */
      get: function() {
        return this._letterSpacing;
      },
      set: function(e) {
        this._letterSpacing !== e && (this._letterSpacing = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "lineHeight", {
      /** The line height, a number that represents the vertical space that a letter uses. */
      get: function() {
        return this._lineHeight;
      },
      set: function(e) {
        this._lineHeight !== e && (this._lineHeight = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "leading", {
      /** The space between lines. */
      get: function() {
        return this._leading;
      },
      set: function(e) {
        this._leading !== e && (this._leading = e, this.styleID++);
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
      set: function(e) {
        this._lineJoin !== e && (this._lineJoin = e, this.styleID++);
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
      set: function(e) {
        this._miterLimit !== e && (this._miterLimit = e, this.styleID++);
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
      set: function(e) {
        this._padding !== e && (this._padding = e, this.styleID++);
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
      set: function(e) {
        var t = aa(e);
        this._stroke !== t && (this._stroke = t, this.styleID++);
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
      set: function(e) {
        this._strokeThickness !== e && (this._strokeThickness = e, this.styleID++);
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
      set: function(e) {
        this._textBaseline !== e && (this._textBaseline = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "trim", {
      /** Trim transparent borders. */
      get: function() {
        return this._trim;
      },
      set: function(e) {
        this._trim !== e && (this._trim = e, this.styleID++);
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
      set: function(e) {
        this._whiteSpace !== e && (this._whiteSpace = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "wordWrap", {
      /** Indicates if word wrap should be used. */
      get: function() {
        return this._wordWrap;
      },
      set: function(e) {
        this._wordWrap !== e && (this._wordWrap = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "wordWrapWidth", {
      /** The width at which text will wrap, it needs wordWrap to be set to true. */
      get: function() {
        return this._wordWrapWidth;
      },
      set: function(e) {
        this._wordWrapWidth !== e && (this._wordWrapWidth = e, this.styleID++);
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.toFontString = function() {
      var e = typeof this.fontSize == "number" ? this.fontSize + "px" : this.fontSize, t = this.fontFamily;
      Array.isArray(this.fontFamily) || (t = this.fontFamily.split(","));
      for (var i = t.length - 1; i >= 0; i--) {
        var n = t[i].trim();
        !/([\"\'])[^\'\"]+\1/.test(n) && a0.indexOf(n) < 0 && (n = '"' + n + '"'), t[i] = n;
      }
      return this.fontStyle + " " + this.fontVariant + " " + this.fontWeight + " " + e + " " + t.join(",");
    }, r;
  }()
);
function du(r) {
  return typeof r == "number" ? mh(r) : (typeof r == "string" && r.indexOf("0x") === 0 && (r = r.replace("0x", "#")), r);
}
function aa(r) {
  if (Array.isArray(r)) {
    for (var e = 0; e < r.length; ++e)
      r[e] = du(r[e]);
    return r;
  } else
    return du(r);
}
function o0(r, e) {
  if (!Array.isArray(r) || !Array.isArray(e) || r.length !== e.length)
    return !1;
  for (var t = 0; t < r.length; ++t)
    if (r[t] !== e[t])
      return !1;
  return !0;
}
function oa(r, e, t) {
  for (var i in t)
    Array.isArray(e[i]) ? r[i] = e[i].slice() : r[i] = e[i];
}
var Ui = {
  // TextMetrics requires getImageData readback for measuring fonts.
  willReadFrequently: !0
}, ce = (
  /** @class */
  function() {
    function r(e, t, i, n, a, o, s, u, h) {
      this.text = e, this.style = t, this.width = i, this.height = n, this.lines = a, this.lineWidths = o, this.lineHeight = s, this.maxLineWidth = u, this.fontProperties = h;
    }
    return r.measureText = function(e, t, i, n) {
      n === void 0 && (n = r._canvas), i = i ?? t.wordWrap;
      var a = t.toFontString(), o = r.measureFont(a);
      o.fontSize === 0 && (o.fontSize = t.fontSize, o.ascent = t.fontSize);
      var s = n.getContext("2d", Ui);
      s.font = a;
      for (var u = i ? r.wordWrap(e, t, n) : e, h = u.split(/(?:\r\n|\r|\n)/), l = new Array(h.length), f = 0, c = 0; c < h.length; c++) {
        var d = s.measureText(h[c]).width + (h[c].length - 1) * t.letterSpacing;
        l[c] = d, f = Math.max(f, d);
      }
      var p = f + t.strokeThickness;
      t.dropShadow && (p += t.dropShadowDistance);
      var v = t.lineHeight || o.fontSize + t.strokeThickness, _ = Math.max(v, o.fontSize + t.strokeThickness) + (h.length - 1) * (v + t.leading);
      return t.dropShadow && (_ += t.dropShadowDistance), new r(e, t, p, _, h, l, v + t.leading, f, o);
    }, r.wordWrap = function(e, t, i) {
      i === void 0 && (i = r._canvas);
      for (var n = i.getContext("2d", Ui), a = 0, o = "", s = "", u = /* @__PURE__ */ Object.create(null), h = t.letterSpacing, l = t.whiteSpace, f = r.collapseSpaces(l), c = r.collapseNewlines(l), d = !f, p = t.wordWrapWidth + h, v = r.tokenize(e), _ = 0; _ < v.length; _++) {
        var y = v[_];
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
          if (o !== "" && (s += r.addLine(o), o = "", a = 0), r.canBreakWords(y, t.breakWords))
            for (var b = r.wordWrapSplit(y), x = 0; x < b.length; x++) {
              for (var S = b[x], A = 1; b[x + A]; ) {
                var w = b[x + A], P = S[S.length - 1];
                if (!r.canBreakChars(P, w, y, x, t.breakWords))
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
            var M = _ === v.length - 1;
            s += r.addLine(y, !M), d = !1, o = "", a = 0;
          }
        else
          E + a > p && (d = !1, s += r.addLine(o), o = "", a = 0), (o.length > 0 || !r.isBreakingSpace(y) || d) && (o += y, a += E);
      }
      return s += r.addLine(o, !1), s;
    }, r.addLine = function(e, t) {
      return t === void 0 && (t = !0), e = r.trimRight(e), e = t ? e + `
` : e, e;
    }, r.getFromCache = function(e, t, i, n) {
      var a = i[e];
      if (typeof a != "number") {
        var o = e.length * t;
        a = n.measureText(e).width + o, i[e] = a;
      }
      return a;
    }, r.collapseSpaces = function(e) {
      return e === "normal" || e === "pre-line";
    }, r.collapseNewlines = function(e) {
      return e === "normal";
    }, r.trimRight = function(e) {
      if (typeof e != "string")
        return "";
      for (var t = e.length - 1; t >= 0; t--) {
        var i = e[t];
        if (!r.isBreakingSpace(i))
          break;
        e = e.slice(0, -1);
      }
      return e;
    }, r.isNewline = function(e) {
      return typeof e != "string" ? !1 : r._newlines.indexOf(e.charCodeAt(0)) >= 0;
    }, r.isBreakingSpace = function(e, t) {
      return typeof e != "string" ? !1 : r._breakingSpaces.indexOf(e.charCodeAt(0)) >= 0;
    }, r.tokenize = function(e) {
      var t = [], i = "";
      if (typeof e != "string")
        return t;
      for (var n = 0; n < e.length; n++) {
        var a = e[n], o = e[n + 1];
        if (r.isBreakingSpace(a, o) || r.isNewline(a)) {
          i !== "" && (t.push(i), i = ""), t.push(a);
          continue;
        }
        i += a;
      }
      return i !== "" && t.push(i), t;
    }, r.canBreakWords = function(e, t) {
      return t;
    }, r.canBreakChars = function(e, t, i, n, a) {
      return !0;
    }, r.wordWrapSplit = function(e) {
      return e.split("");
    }, r.measureFont = function(e) {
      if (r._fonts[e])
        return r._fonts[e];
      var t = {
        ascent: 0,
        descent: 0,
        fontSize: 0
      }, i = r._canvas, n = r._context;
      n.font = e;
      var a = r.METRICS_STRING + r.BASELINE_SYMBOL, o = Math.ceil(n.measureText(a).width), s = Math.ceil(n.measureText(r.BASELINE_SYMBOL).width), u = Math.ceil(r.HEIGHT_MULTIPLIER * s);
      s = s * r.BASELINE_MULTIPLIER | 0, i.width = o, i.height = u, n.fillStyle = "#f00", n.fillRect(0, 0, o, u), n.font = e, n.textBaseline = "alphabetic", n.fillStyle = "#000", n.fillText(a, 0, s);
      var h = n.getImageData(0, 0, o, u).data, l = h.length, f = o * 4, c = 0, d = 0, p = !1;
      for (c = 0; c < s; ++c) {
        for (var v = 0; v < f; v += 4)
          if (h[d + v] !== 255) {
            p = !0;
            break;
          }
        if (!p)
          d += f;
        else
          break;
      }
      for (t.ascent = s - c, d = l - f, p = !1, c = u; c > s; --c) {
        for (var v = 0; v < f; v += 4)
          if (h[d + v] !== 255) {
            p = !0;
            break;
          }
        if (!p)
          d -= f;
        else
          break;
      }
      return t.descent = c - s, t.fontSize = t.ascent + t.descent, r._fonts[e] = t, t;
    }, r.clearMetrics = function(e) {
      e === void 0 && (e = ""), e ? delete r._fonts[e] : r._fonts = {};
    }, Object.defineProperty(r, "_canvas", {
      /**
       * Cached canvas element for measuring text
       * TODO: this should be private, but isn't because of backward compat, will fix later.
       * @ignore
       */
      get: function() {
        if (!r.__canvas) {
          var e = void 0;
          try {
            var t = new OffscreenCanvas(0, 0), i = t.getContext("2d", Ui);
            if (i && i.measureText)
              return r.__canvas = t, t;
            e = U.ADAPTER.createCanvas();
          } catch {
            e = U.ADAPTER.createCanvas();
          }
          e.width = e.height = 10, r.__canvas = e;
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
        return r.__context || (r.__context = r._canvas.getContext("2d", Ui)), r.__context;
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
);
ce._fonts = {};
ce.METRICS_STRING = "|ÉqÅ";
ce.BASELINE_SYMBOL = "M";
ce.BASELINE_MULTIPLIER = 1.4;
ce.HEIGHT_MULTIPLIER = 2;
ce._newlines = [
  10,
  13
];
ce._breakingSpaces = [
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
var s0 = {
  texture: !0,
  children: !1,
  baseTexture: !0
}, Zh = (
  /** @class */
  function(r) {
    n0(e, r);
    function e(t, i, n) {
      var a = this, o = !1;
      n || (n = U.ADAPTER.createCanvas(), o = !0), n.width = 3, n.height = 3;
      var s = W.from(n);
      return s.orig = new it(), s.trim = new it(), a = r.call(this, s) || this, a._ownCanvas = o, a.canvas = n, a.context = n.getContext("2d", {
        // required for trimming to work without warnings
        willReadFrequently: !0
      }), a._resolution = U.RESOLUTION, a._autoResolution = !0, a._text = null, a._style = null, a._styleListener = null, a._font = "", a.text = t, a.style = i, a.localStyleID = -1, a;
    }
    return e.prototype.updateText = function(t) {
      var i = this._style;
      if (this.localStyleID !== i.styleID && (this.dirty = !0, this.localStyleID = i.styleID), !(!this.dirty && t)) {
        this._font = this._style.toFontString();
        var n = this.context, a = ce.measureText(this._text || " ", this._style, this._style.wordWrap, this.canvas), o = a.width, s = a.height, u = a.lines, h = a.lineHeight, l = a.lineWidths, f = a.maxLineWidth, c = a.fontProperties;
        this.canvas.width = Math.ceil(Math.ceil(Math.max(1, o) + i.padding * 2) * this._resolution), this.canvas.height = Math.ceil(Math.ceil(Math.max(1, s) + i.padding * 2) * this._resolution), n.scale(this._resolution, this._resolution), n.clearRect(0, 0, this.canvas.width, this.canvas.height), n.font = this._font, n.lineWidth = i.strokeThickness, n.textBaseline = i.textBaseline, n.lineJoin = i.lineJoin, n.miterLimit = i.miterLimit;
        for (var d, p, v = i.dropShadow ? 2 : 1, _ = 0; _ < v; ++_) {
          var y = i.dropShadow && _ === 0, g = y ? Math.ceil(Math.max(1, s) + i.padding * 2) : 0, m = g * this._resolution;
          if (y) {
            n.fillStyle = "black", n.strokeStyle = "black";
            var E = i.dropShadowColor, b = Ir(typeof E == "number" ? E : an(E)), x = i.dropShadowBlur * this._resolution, S = i.dropShadowDistance * this._resolution;
            n.shadowColor = "rgba(" + b[0] * 255 + "," + b[1] * 255 + "," + b[2] * 255 + "," + i.dropShadowAlpha + ")", n.shadowBlur = x, n.shadowOffsetX = Math.cos(i.dropShadowAngle) * S, n.shadowOffsetY = Math.sin(i.dropShadowAngle) * S + m;
          } else
            n.fillStyle = this._generateFillStyle(i, u, a), n.strokeStyle = i.stroke, n.shadowColor = "black", n.shadowBlur = 0, n.shadowOffsetX = 0, n.shadowOffsetY = 0;
          var A = (h - c.fontSize) / 2;
          (!e.nextLineHeightBehavior || h - c.fontSize < 0) && (A = 0);
          for (var w = 0; w < u.length; w++)
            d = i.strokeThickness / 2, p = i.strokeThickness / 2 + w * h + c.ascent + A, i.align === "right" ? d += f - l[w] : i.align === "center" && (d += (f - l[w]) / 2), i.stroke && i.strokeThickness && this.drawLetterSpacing(u[w], d + i.padding, p + i.padding - g, !0), i.fill && this.drawLetterSpacing(u[w], d + i.padding, p + i.padding - g);
        }
        this.updateTexture();
      }
    }, e.prototype.drawLetterSpacing = function(t, i, n, a) {
      a === void 0 && (a = !1);
      var o = this._style, s = o.letterSpacing, u = e.experimentalLetterSpacing && ("letterSpacing" in CanvasRenderingContext2D.prototype || "textLetterSpacing" in CanvasRenderingContext2D.prototype);
      if (s === 0 || u) {
        u && (this.context.letterSpacing = s, this.context.textLetterSpacing = s), a ? this.context.strokeText(t, i, n) : this.context.fillText(t, i, n);
        return;
      }
      for (var h = i, l = Array.from ? Array.from(t) : t.split(""), f = this.context.measureText(t).width, c = 0, d = 0; d < l.length; ++d) {
        var p = l[d];
        a ? this.context.strokeText(p, h, n) : this.context.fillText(p, h, n);
        for (var v = "", _ = d + 1; _ < l.length; ++_)
          v += l[_];
        c = this.context.measureText(v).width, h += f - c + s, f = c;
      }
    }, e.prototype.updateTexture = function() {
      var t = this.canvas;
      if (this._style.trim) {
        var i = ey(t);
        i.data && (t.width = i.width, t.height = i.height, this.context.putImageData(i.data, 0, 0));
      }
      var n = this._texture, a = this._style, o = a.trim ? 0 : a.padding, s = n.baseTexture;
      n.trim.width = n._frame.width = t.width / this._resolution, n.trim.height = n._frame.height = t.height / this._resolution, n.trim.x = -o, n.trim.y = -o, n.orig.width = n._frame.width - o * 2, n.orig.height = n._frame.height - o * 2, this._onTextureUpdate(), s.setRealSize(t.width, t.height, this._resolution), n.updateUvs(), this.dirty = !1;
    }, e.prototype._render = function(t) {
      this._autoResolution && this._resolution !== t.resolution && (this._resolution = t.resolution, this.dirty = !0), this.updateText(!0), r.prototype._render.call(this, t);
    }, e.prototype.updateTransform = function() {
      this.updateText(!0), r.prototype.updateTransform.call(this);
    }, e.prototype.getBounds = function(t, i) {
      return this.updateText(!0), this._textureID === -1 && (t = !1), r.prototype.getBounds.call(this, t, i);
    }, e.prototype.getLocalBounds = function(t) {
      return this.updateText(!0), r.prototype.getLocalBounds.call(this, t);
    }, e.prototype._calculateBounds = function() {
      this.calculateVertices(), this._bounds.addQuad(this.vertexData);
    }, e.prototype._generateFillStyle = function(t, i, n) {
      var a = t.fill;
      if (Array.isArray(a)) {
        if (a.length === 1)
          return a[0];
      } else
        return a;
      var o, s = t.dropShadow ? t.dropShadowDistance : 0, u = t.padding || 0, h = this.canvas.width / this._resolution - s - u * 2, l = this.canvas.height / this._resolution - s - u * 2, f = a.slice(), c = t.fillGradientStops.slice();
      if (!c.length)
        for (var d = f.length + 1, p = 1; p < d; ++p)
          c.push(p / d);
      if (f.unshift(a[0]), c.unshift(0), f.push(a[a.length - 1]), c.push(1), t.fillGradientType === ri.LINEAR_VERTICAL) {
        o = this.context.createLinearGradient(h / 2, u, h / 2, l + u);
        for (var v = n.fontProperties.fontSize + t.strokeThickness, p = 0; p < i.length; p++) {
          var _ = n.lineHeight * (p - 1) + v, y = n.lineHeight * p, g = y;
          p > 0 && _ > y && (g = (y + _) / 2);
          var m = y + v, E = n.lineHeight * (p + 1), b = m;
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
          var M = void 0;
          typeof c[p] == "number" ? M = c[p] : M = O / P, o.addColorStop(M, f[p]), O++;
        }
      }
      return o;
    }, e.prototype.destroy = function(t) {
      typeof t == "boolean" && (t = { children: t }), t = Object.assign({}, s0, t), r.prototype.destroy.call(this, t), this._ownCanvas && (this.canvas.height = this.canvas.width = 0), this.context = null, this.canvas = null, this._style = null;
    }, Object.defineProperty(e.prototype, "width", {
      /** The width of the Text, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return this.updateText(!0), Math.abs(this.scale.x) * this._texture.orig.width;
      },
      set: function(t) {
        this.updateText(!0);
        var i = mr(this.scale.x) || 1;
        this.scale.x = i * t / this._texture.orig.width, this._width = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "height", {
      /** The height of the Text, setting this will actually modify the scale to achieve the value set. */
      get: function() {
        return this.updateText(!0), Math.abs(this.scale.y) * this._texture.orig.height;
      },
      set: function(t) {
        this.updateText(!0);
        var i = mr(this.scale.y) || 1;
        this.scale.y = i * t / this._texture.orig.height, this._height = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "style", {
      /**
       * Set the style of the text.
       *
       * Set up an event listener to listen for changes on the style object and mark the text as dirty.
       */
      get: function() {
        return this._style;
      },
      set: function(t) {
        t = t || {}, t instanceof Cr ? this._style = t : this._style = new Cr(t), this.localStyleID = -1, this.dirty = !0;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "text", {
      /** Set the copy for the text object. To split a line you can use '\n'. */
      get: function() {
        return this._text;
      },
      set: function(t) {
        t = String(t ?? ""), this._text !== t && (this._text = t, this.dirty = !0);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "resolution", {
      /**
       * The resolution / device pixel ratio of the canvas.
       *
       * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
       * @default 1
       */
      get: function() {
        return this._resolution;
      },
      set: function(t) {
        this._autoResolution = !1, this._resolution !== t && (this._resolution = t, this.dirty = !0);
      },
      enumerable: !1,
      configurable: !0
    }), e.nextLineHeightBehavior = !1, e.experimentalLetterSpacing = !1, e;
  }(li)
);
/*!
 * @pixi/prepare - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/prepare is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
U.UPLOADS_PER_FRAME = 4;
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
var qa = function(r, e) {
  return qa = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, qa(r, e);
};
function u0(r, e) {
  qa(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var h0 = (
  /** @class */
  function() {
    function r(e) {
      this.maxItemsPerFrame = e, this.itemsLeft = 0;
    }
    return r.prototype.beginFrame = function() {
      this.itemsLeft = this.maxItemsPerFrame;
    }, r.prototype.allowedToUpload = function() {
      return this.itemsLeft-- > 0;
    }, r;
  }()
);
function l0(r, e) {
  var t = !1;
  if (r && r._textures && r._textures.length) {
    for (var i = 0; i < r._textures.length; i++)
      if (r._textures[i] instanceof W) {
        var n = r._textures[i].baseTexture;
        e.indexOf(n) === -1 && (e.push(n), t = !0);
      }
  }
  return t;
}
function f0(r, e) {
  if (r.baseTexture instanceof rt) {
    var t = r.baseTexture;
    return e.indexOf(t) === -1 && e.push(t), !0;
  }
  return !1;
}
function c0(r, e) {
  if (r._texture && r._texture instanceof W) {
    var t = r._texture.baseTexture;
    return e.indexOf(t) === -1 && e.push(t), !0;
  }
  return !1;
}
function d0(r, e) {
  return e instanceof Zh ? (e.updateText(!0), !0) : !1;
}
function p0(r, e) {
  if (e instanceof Cr) {
    var t = e.toFontString();
    return ce.measureFont(t), !0;
  }
  return !1;
}
function v0(r, e) {
  if (r instanceof Zh) {
    e.indexOf(r.style) === -1 && e.push(r.style), e.indexOf(r) === -1 && e.push(r);
    var t = r._texture.baseTexture;
    return e.indexOf(t) === -1 && e.push(t), !0;
  }
  return !1;
}
function _0(r, e) {
  return r instanceof Cr ? (e.indexOf(r) === -1 && e.push(r), !0) : !1;
}
var y0 = (
  /** @class */
  function() {
    function r(e) {
      var t = this;
      this.limiter = new h0(U.UPLOADS_PER_FRAME), this.renderer = e, this.uploadHookHelper = null, this.queue = [], this.addHooks = [], this.uploadHooks = [], this.completes = [], this.ticking = !1, this.delayedTick = function() {
        t.queue && t.prepareItems();
      }, this.registerFindHook(v0), this.registerFindHook(_0), this.registerFindHook(l0), this.registerFindHook(f0), this.registerFindHook(c0), this.registerUploadHook(d0), this.registerUploadHook(p0);
    }
    return r.prototype.upload = function(e, t) {
      var i = this;
      return typeof e == "function" && (t = e, e = null), t && Jt("6.5.0", "BasePrepare.upload callback is deprecated, use the return Promise instead."), new Promise(function(n) {
        e && i.add(e);
        var a = function() {
          t == null || t(), n();
        };
        i.queue.length ? (i.completes.push(a), i.ticking || (i.ticking = !0, Lt.system.addOnce(i.tick, i, Ee.UTILITY))) : a();
      });
    }, r.prototype.tick = function() {
      setTimeout(this.delayedTick, 0);
    }, r.prototype.prepareItems = function() {
      for (this.limiter.beginFrame(); this.queue.length && this.limiter.allowedToUpload(); ) {
        var e = this.queue[0], t = !1;
        if (e && !e._destroyed) {
          for (var i = 0, n = this.uploadHooks.length; i < n; i++)
            if (this.uploadHooks[i](this.uploadHookHelper, e)) {
              this.queue.shift(), t = !0;
              break;
            }
        }
        t || this.queue.shift();
      }
      if (this.queue.length)
        Lt.system.addOnce(this.tick, this, Ee.UTILITY);
      else {
        this.ticking = !1;
        var a = this.completes.slice(0);
        this.completes.length = 0;
        for (var i = 0, n = a.length; i < n; i++)
          a[i]();
      }
    }, r.prototype.registerFindHook = function(e) {
      return e && this.addHooks.push(e), this;
    }, r.prototype.registerUploadHook = function(e) {
      return e && this.uploadHooks.push(e), this;
    }, r.prototype.add = function(e) {
      for (var t = 0, i = this.addHooks.length; t < i && !this.addHooks[t](e, this.queue); t++)
        ;
      if (e instanceof fe)
        for (var t = e.children.length - 1; t >= 0; t--)
          this.add(e.children[t]);
      return this;
    }, r.prototype.destroy = function() {
      this.ticking && Lt.system.remove(this.tick, this), this.ticking = !1, this.addHooks = null, this.uploadHooks = null, this.renderer = null, this.completes = null, this.queue = null, this.limiter = null, this.uploadHookHelper = null;
    }, r;
  }()
);
function $h(r, e) {
  return e instanceof rt ? (e._glTextures[r.CONTEXT_UID] || r.texture.bind(e), !0) : !1;
}
function g0(r, e) {
  if (!(e instanceof nr))
    return !1;
  var t = e.geometry;
  e.finishPoly(), t.updateBatches();
  for (var i = t.batches, n = 0; n < i.length; n++) {
    var a = i[n].style.texture;
    a && $h(r, a.baseTexture);
  }
  return t.batchable || r.geometry.bind(t, e._resolveDirectShader(r)), !0;
}
function m0(r, e) {
  return r instanceof nr ? (e.push(r), !0) : !1;
}
var b0 = (
  /** @class */
  function(r) {
    u0(e, r);
    function e(t) {
      var i = r.call(this, t) || this;
      return i.uploadHookHelper = i.renderer, i.registerFindHook(m0), i.registerUploadHook($h), i.registerUploadHook(g0), i;
    }
    return e.extension = {
      name: "prepare",
      type: pt.RendererPlugin
    }, e;
  }(y0)
);
/*!
 * @pixi/spritesheet - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/spritesheet is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var E0 = (
  /** @class */
  function() {
    function r(e, t, i) {
      i === void 0 && (i = null), this.linkedSheets = [], this._texture = e instanceof W ? e : null, this.baseTexture = e instanceof rt ? e : this._texture.baseTexture, this.textures = {}, this.animations = {}, this.data = t;
      var n = this.baseTexture.resource;
      this.resolution = this._updateResolution(i || (n ? n.url : null)), this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
    }
    return r.prototype._updateResolution = function(e) {
      e === void 0 && (e = null);
      var t = this.data.meta.scale, i = sn(e, null);
      return i === null && (i = t !== void 0 ? parseFloat(t) : 1), i !== 1 && this.baseTexture.setResolution(i), i;
    }, r.prototype.parse = function(e) {
      var t = this;
      return e && Jt("6.5.0", "Spritesheet.parse callback is deprecated, use the return Promise instead."), new Promise(function(i) {
        t._callback = function(n) {
          e == null || e(n), i(n);
        }, t._batchIndex = 0, t._frameKeys.length <= r.BATCH_SIZE ? (t._processFrames(0), t._processAnimations(), t._parseComplete()) : t._nextBatch();
      });
    }, r.prototype._processFrames = function(e) {
      for (var t = e, i = r.BATCH_SIZE; t - e < i && t < this._frameKeys.length; ) {
        var n = this._frameKeys[t], a = this._frames[n], o = a.frame;
        if (o) {
          var s = null, u = null, h = a.trimmed !== !1 && a.sourceSize ? a.sourceSize : a.frame, l = new it(0, 0, Math.floor(h.w) / this.resolution, Math.floor(h.h) / this.resolution);
          a.rotated ? s = new it(Math.floor(o.x) / this.resolution, Math.floor(o.y) / this.resolution, Math.floor(o.h) / this.resolution, Math.floor(o.w) / this.resolution) : s = new it(Math.floor(o.x) / this.resolution, Math.floor(o.y) / this.resolution, Math.floor(o.w) / this.resolution, Math.floor(o.h) / this.resolution), a.trimmed !== !1 && a.spriteSourceSize && (u = new it(Math.floor(a.spriteSourceSize.x) / this.resolution, Math.floor(a.spriteSourceSize.y) / this.resolution, Math.floor(o.w) / this.resolution, Math.floor(o.h) / this.resolution)), this.textures[n] = new W(this.baseTexture, s, l, u, a.rotated ? 2 : 0, a.anchor), W.addToCache(this.textures[n], n);
        }
        t++;
      }
    }, r.prototype._processAnimations = function() {
      var e = this.data.animations || {};
      for (var t in e) {
        this.animations[t] = [];
        for (var i = 0; i < e[t].length; i++) {
          var n = e[t][i];
          this.animations[t].push(this.textures[n]);
        }
      }
    }, r.prototype._parseComplete = function() {
      var e = this._callback;
      this._callback = null, this._batchIndex = 0, e.call(this, this.textures);
    }, r.prototype._nextBatch = function() {
      var e = this;
      this._processFrames(this._batchIndex * r.BATCH_SIZE), this._batchIndex++, setTimeout(function() {
        e._batchIndex * r.BATCH_SIZE < e._frameKeys.length ? e._nextBatch() : (e._processAnimations(), e._parseComplete());
      }, 0);
    }, r.prototype.destroy = function(e) {
      var t;
      e === void 0 && (e = !1);
      for (var i in this.textures)
        this.textures[i].destroy();
      this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, e && ((t = this._texture) === null || t === void 0 || t.destroy(), this.baseTexture.destroy()), this._texture = null, this.baseTexture = null, this.linkedSheets = [];
    }, r.BATCH_SIZE = 1e3, r;
  }()
), T0 = (
  /** @class */
  function() {
    function r() {
    }
    return r.use = function(e, t) {
      var i, n, a = this, o = e.name + "_image";
      if (!e.data || e.type !== wt.TYPE.JSON || !e.data.frames || a.resources[o]) {
        t();
        return;
      }
      var s = (n = (i = e.data) === null || i === void 0 ? void 0 : i.meta) === null || n === void 0 ? void 0 : n.related_multi_packs;
      if (Array.isArray(s))
        for (var u = function(p) {
          if (typeof p != "string")
            return "continue";
          var v = p.replace(".json", ""), _ = gr.resolve(e.url.replace(a.baseUrl, ""), p);
          if (a.resources[v] || Object.values(a.resources).some(function(g) {
            return gr.format(gr.parse(g.url)) === _;
          }))
            return "continue";
          var y = {
            crossOrigin: e.crossOrigin,
            loadType: wt.LOAD_TYPE.XHR,
            xhrType: wt.XHR_RESPONSE_TYPE.JSON,
            parentResource: e,
            metadata: e.metadata
          };
          a.add(v, _, y);
        }, h = 0, l = s; h < l.length; h++) {
          var f = l[h];
          u(f);
        }
      var c = {
        crossOrigin: e.crossOrigin,
        metadata: e.metadata.imageMetadata,
        parentResource: e
      }, d = r.getResourcePath(e, a.baseUrl);
      a.add(o, d, c, function(v) {
        if (v.error) {
          t(v.error);
          return;
        }
        var _ = new E0(v.texture, e.data, e.url);
        _.parse().then(function() {
          e.spritesheet = _, e.textures = _.textures, t();
        });
      });
    }, r.getResourcePath = function(e, t) {
      return e.isDataUrl ? e.data.meta.image : gr.resolve(e.url.replace(t, ""), e.data.meta.image);
    }, r.extension = pt.Loader, r;
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
var Ka = function(r, e) {
  return Ka = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Ka(r, e);
};
function Qh(r, e) {
  Ka(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var Hr = new yt();
(function(r) {
  Qh(e, r);
  function e(t, i, n) {
    i === void 0 && (i = 100), n === void 0 && (n = 100);
    var a = r.call(this, t) || this;
    return a.tileTransform = new Sh(), a._width = i, a._height = n, a.uvMatrix = a.texture.uvMatrix || new Po(t), a.pluginName = "tilingSprite", a.uvRespectAnchor = !1, a;
  }
  return Object.defineProperty(e.prototype, "clampMargin", {
    /**
     * Changes frame clamping in corresponding textureTransform, shortcut
     * Change to -0.5 to add a pixel to the edge, recommended for transparent trimmed textures in atlas
     * @default 0.5
     * @member {number}
     */
    get: function() {
      return this.uvMatrix.clampMargin;
    },
    set: function(t) {
      this.uvMatrix.clampMargin = t, this.uvMatrix.update(!0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "tileScale", {
    /** The scaling of the image that is being tiled. */
    get: function() {
      return this.tileTransform.scale;
    },
    set: function(t) {
      this.tileTransform.scale.copyFrom(t);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "tilePosition", {
    /** The offset of the image that is being tiled. */
    get: function() {
      return this.tileTransform.position;
    },
    set: function(t) {
      this.tileTransform.position.copyFrom(t);
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype._onTextureUpdate = function() {
    this.uvMatrix && (this.uvMatrix.texture = this._texture), this._cachedTint = 16777215;
  }, e.prototype._render = function(t) {
    var i = this._texture;
    !i || !i.valid || (this.tileTransform.updateLocalTransform(), this.uvMatrix.update(), t.batch.setObjectRenderer(t.plugins[this.pluginName]), t.plugins[this.pluginName].render(this));
  }, e.prototype._calculateBounds = function() {
    var t = this._width * -this._anchor._x, i = this._height * -this._anchor._y, n = this._width * (1 - this._anchor._x), a = this._height * (1 - this._anchor._y);
    this._bounds.addFrame(this.transform, t, i, n, a);
  }, e.prototype.getLocalBounds = function(t) {
    return this.children.length === 0 ? (this._bounds.minX = this._width * -this._anchor._x, this._bounds.minY = this._height * -this._anchor._y, this._bounds.maxX = this._width * (1 - this._anchor._x), this._bounds.maxY = this._height * (1 - this._anchor._y), t || (this._localBoundsRect || (this._localBoundsRect = new it()), t = this._localBoundsRect), this._bounds.getRectangle(t)) : r.prototype.getLocalBounds.call(this, t);
  }, e.prototype.containsPoint = function(t) {
    this.worldTransform.applyInverse(t, Hr);
    var i = this._width, n = this._height, a = -i * this.anchor._x;
    if (Hr.x >= a && Hr.x < a + i) {
      var o = -n * this.anchor._y;
      if (Hr.y >= o && Hr.y < o + n)
        return !0;
    }
    return !1;
  }, e.prototype.destroy = function(t) {
    r.prototype.destroy.call(this, t), this.tileTransform = null, this.uvMatrix = null;
  }, e.from = function(t, i) {
    var n = t instanceof W ? t : W.from(t, i);
    return new e(n, i.width, i.height);
  }, Object.defineProperty(e.prototype, "width", {
    /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
    get: function() {
      return this._width;
    },
    set: function(t) {
      this._width = t;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "height", {
    /** The height of the TilingSprite, setting this will actually modify the scale to achieve the value set. */
    get: function() {
      return this._height;
    },
    set: function(t) {
      this._height = t;
    },
    enumerable: !1,
    configurable: !0
  }), e;
})(li);
var x0 = `#version 100
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
`, pu = `#version 100
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
`, w0 = `#version 100
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
`, S0 = `#version 300 es
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
`, P0 = `#version 300 es
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
`, Gi = new It(), A0 = (
  /** @class */
  function(r) {
    Qh(e, r);
    function e(t) {
      var i = r.call(this, t) || this;
      return t.runners.contextChange.add(i), i.quad = new Mh(), i.state = sr.for2d(), i;
    }
    return e.prototype.contextChange = function() {
      var t = this.renderer, i = { globals: t.globalUniforms };
      this.simpleShader = Ce.from(pu, x0, i), this.shader = t.context.webGLVersion > 1 ? Ce.from(S0, P0, i) : Ce.from(pu, w0, i);
    }, e.prototype.render = function(t) {
      var i = this.renderer, n = this.quad, a = n.vertices;
      a[0] = a[6] = t._width * -t.anchor.x, a[1] = a[3] = t._height * -t.anchor.y, a[2] = a[4] = t._width * (1 - t.anchor.x), a[5] = a[7] = t._height * (1 - t.anchor.y);
      var o = t.uvRespectAnchor ? t.anchor.x : 0, s = t.uvRespectAnchor ? t.anchor.y : 0;
      a = n.uvs, a[0] = a[6] = -o, a[1] = a[3] = -s, a[2] = a[4] = 1 - o, a[5] = a[7] = 1 - s, n.invalidate();
      var u = t._texture, h = u.baseTexture, l = h.alphaMode > 0, f = t.tileTransform.localTransform, c = t.uvMatrix, d = h.isPowerOfTwo && u.frame.width === h.width && u.frame.height === h.height;
      d && (h._glTextures[i.CONTEXT_UID] ? d = h.wrapMode !== ue.CLAMP : h.wrapMode === ue.CLAMP && (h.wrapMode = ue.REPEAT));
      var p = d ? this.simpleShader : this.shader, v = u.width, _ = u.height, y = t._width, g = t._height;
      Gi.set(f.a * v / y, f.b * v / g, f.c * _ / y, f.d * _ / g, f.tx / y, f.ty / g), Gi.invert(), d ? Gi.prepend(c.mapCoord) : (p.uniforms.uMapCoord = c.mapCoord.toArray(!0), p.uniforms.uClampFrame = c.uClampFrame, p.uniforms.uClampOffset = c.uClampOffset), p.uniforms.uTransform = Gi.toArray(!0), p.uniforms.uColor = Th(t.tint, t.worldAlpha, p.uniforms.uColor, l), p.uniforms.translationMatrix = t.transform.worldTransform.toArray(!0), p.uniforms.uSampler = u, i.shader.bind(p), i.geometry.bind(n), this.state.blendMode = Eh(t.blendMode, l), i.state.set(this.state), i.geometry.draw(this.renderer.gl.TRIANGLES, 6, 0);
    }, e.extension = {
      name: "tilingSprite",
      type: pt.RendererPlugin
    }, e;
  }(mn)
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
var Za = function(r, e) {
  return Za = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Za(r, e);
};
function Ro(r, e) {
  Za(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var R0 = (
  /** @class */
  function() {
    function r(e, t) {
      this.uvBuffer = e, this.uvMatrix = t, this.data = null, this._bufferUpdateId = -1, this._textureUpdateId = -1, this._updateID = 0;
    }
    return r.prototype.update = function(e) {
      if (!(!e && this._bufferUpdateId === this.uvBuffer._updateID && this._textureUpdateId === this.uvMatrix._updateID)) {
        this._bufferUpdateId = this.uvBuffer._updateID, this._textureUpdateId = this.uvMatrix._updateID;
        var t = this.uvBuffer.data;
        (!this.data || this.data.length !== t.length) && (this.data = new Float32Array(t.length)), this.uvMatrix.multiplyUvs(t, this.data), this._updateID++;
      }
    }, r;
  }()
), sa = new yt(), vu = new Wi(), ii = (
  /** @class */
  function(r) {
    Ro(e, r);
    function e(t, i, n, a) {
      a === void 0 && (a = $t.TRIANGLES);
      var o = r.call(this) || this;
      return o.geometry = t, o.shader = i, o.state = n || sr.for2d(), o.drawMode = a, o.start = 0, o.size = 0, o.uvs = null, o.indices = null, o.vertexData = new Float32Array(1), o.vertexDirty = -1, o._transformID = -1, o._roundPixels = U.ROUND_PIXELS, o.batchUvs = null, o;
    }
    return Object.defineProperty(e.prototype, "geometry", {
      /**
       * Includes vertex positions, face indices, normals, colors, UVs, and
       * custom attributes within buffers, reducing the cost of passing all
       * this data to the GPU. Can be shared between multiple Mesh objects.
       */
      get: function() {
        return this._geometry;
      },
      set: function(t) {
        this._geometry !== t && (this._geometry && (this._geometry.refCount--, this._geometry.refCount === 0 && this._geometry.dispose()), this._geometry = t, this._geometry && this._geometry.refCount++, this.vertexDirty = -1);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "uvBuffer", {
      /**
       * To change mesh uv's, change its uvBuffer data and increment its _updateID.
       * @readonly
       */
      get: function() {
        return this.geometry.buffers[1];
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "verticesBuffer", {
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
    }), Object.defineProperty(e.prototype, "material", {
      get: function() {
        return this.shader;
      },
      /** Alias for {@link PIXI.Mesh#shader}. */
      set: function(t) {
        this.shader = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "blendMode", {
      get: function() {
        return this.state.blendMode;
      },
      /**
       * The blend mode to be applied to the Mesh. Apply a value of
       * `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
       * @default PIXI.BLEND_MODES.NORMAL;
       */
      set: function(t) {
        this.state.blendMode = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "roundPixels", {
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
      set: function(t) {
        this._roundPixels !== t && (this._transformID = -1), this._roundPixels = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "tint", {
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
      set: function(t) {
        this.shader.tint = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "texture", {
      /** The texture that the Mesh uses. Null for non-MeshMaterial shaders */
      get: function() {
        return "texture" in this.shader ? this.shader.texture : null;
      },
      set: function(t) {
        this.shader.texture = t;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype._render = function(t) {
      var i = this.geometry.buffers[0].data, n = this.shader;
      n.batchable && this.drawMode === $t.TRIANGLES && i.length < e.BATCHABLE_SIZE * 2 ? this._renderToBatch(t) : this._renderDefault(t);
    }, e.prototype._renderDefault = function(t) {
      var i = this.shader;
      i.alpha = this.worldAlpha, i.update && i.update(), t.batch.flush(), i.uniforms.translationMatrix = this.transform.worldTransform.toArray(!0), t.shader.bind(i), t.state.set(this.state), t.geometry.bind(this.geometry, i), t.geometry.draw(this.drawMode, this.size, this.start, this.geometry.instanceCount);
    }, e.prototype._renderToBatch = function(t) {
      var i = this.geometry, n = this.shader;
      n.uvMatrix && (n.uvMatrix.update(), this.calculateUvs()), this.calculateVertices(), this.indices = i.indexBuffer.data, this._tintRGB = n._tintRGB, this._texture = n.texture;
      var a = this.material.pluginName;
      t.batch.setObjectRenderer(t.plugins[a]), t.plugins[a].render(this);
    }, e.prototype.calculateVertices = function() {
      var t = this.geometry, i = t.buffers[0], n = i.data, a = i._updateID;
      if (!(a === this.vertexDirty && this._transformID === this.transform._worldID)) {
        this._transformID = this.transform._worldID, this.vertexData.length !== n.length && (this.vertexData = new Float32Array(n.length));
        for (var o = this.transform.worldTransform, s = o.a, u = o.b, h = o.c, l = o.d, f = o.tx, c = o.ty, d = this.vertexData, p = 0; p < d.length / 2; p++) {
          var v = n[p * 2], _ = n[p * 2 + 1];
          d[p * 2] = s * v + h * _ + f, d[p * 2 + 1] = u * v + l * _ + c;
        }
        if (this._roundPixels)
          for (var y = U.RESOLUTION, p = 0; p < d.length; ++p)
            d[p] = Math.round((d[p] * y | 0) / y);
        this.vertexDirty = a;
      }
    }, e.prototype.calculateUvs = function() {
      var t = this.geometry.buffers[1], i = this.shader;
      i.uvMatrix.isSimple ? this.uvs = t.data : (this.batchUvs || (this.batchUvs = new R0(t, i.uvMatrix)), this.batchUvs.update(), this.uvs = this.batchUvs.data);
    }, e.prototype._calculateBounds = function() {
      this.calculateVertices(), this._bounds.addVertexData(this.vertexData, 0, this.vertexData.length);
    }, e.prototype.containsPoint = function(t) {
      if (!this.getBounds().contains(t.x, t.y))
        return !1;
      this.worldTransform.applyInverse(t, sa);
      for (var i = this.geometry.getBuffer("aVertexPosition").data, n = vu.points, a = this.geometry.getIndex().data, o = a.length, s = this.drawMode === 4 ? 3 : 1, u = 0; u + 2 < o; u += s) {
        var h = a[u] * 2, l = a[u + 1] * 2, f = a[u + 2] * 2;
        if (n[0] = i[h], n[1] = i[h + 1], n[2] = i[l], n[3] = i[l + 1], n[4] = i[f], n[5] = i[f + 1], vu.contains(sa.x, sa.y))
          return !0;
      }
      return !1;
    }, e.prototype.destroy = function(t) {
      r.prototype.destroy.call(this, t), this._cachedTexture && (this._cachedTexture.destroy(), this._cachedTexture = null), this.geometry = null, this.shader = null, this.state = null, this.uvs = null, this.indices = null, this.vertexData = null;
    }, e.BATCHABLE_SIZE = 100, e;
  }(fe)
), O0 = `varying vec2 vTextureCoord;
uniform vec4 uColor;

uniform sampler2D uSampler;

void main(void)
{
    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;
}
`, I0 = `attribute vec2 aVertexPosition;
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
`, ni = (
  /** @class */
  function(r) {
    Ro(e, r);
    function e(t, i) {
      var n = this, a = {
        uSampler: t,
        alpha: 1,
        uTextureMatrix: It.IDENTITY,
        uColor: new Float32Array([1, 1, 1, 1])
      };
      return i = Object.assign({
        tint: 16777215,
        alpha: 1,
        pluginName: "batch"
      }, i), i.uniforms && Object.assign(a, i.uniforms), n = r.call(this, i.program || hi.from(I0, O0), a) || this, n._colorDirty = !1, n.uvMatrix = new Po(t), n.batchable = i.program === void 0, n.pluginName = i.pluginName, n.tint = i.tint, n.alpha = i.alpha, n;
    }
    return Object.defineProperty(e.prototype, "texture", {
      /** Reference to the texture being rendered. */
      get: function() {
        return this.uniforms.uSampler;
      },
      set: function(t) {
        this.uniforms.uSampler !== t && (!this.uniforms.uSampler.baseTexture.alphaMode != !t.baseTexture.alphaMode && (this._colorDirty = !0), this.uniforms.uSampler = t, this.uvMatrix.texture = t);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "alpha", {
      get: function() {
        return this._alpha;
      },
      /**
       * This gets automatically set by the object using this.
       * @default 1
       */
      set: function(t) {
        t !== this._alpha && (this._alpha = t, this._colorDirty = !0);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "tint", {
      get: function() {
        return this._tint;
      },
      /**
       * Multiply tint for the material.
       * @default 0xFFFFFF
       */
      set: function(t) {
        t !== this._tint && (this._tint = t, this._tintRGB = (t >> 16) + (t & 65280) + ((t & 255) << 16), this._colorDirty = !0);
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.update = function() {
      if (this._colorDirty) {
        this._colorDirty = !1;
        var t = this.texture.baseTexture;
        Th(this._tint, this._alpha, this.uniforms.uColor, t.alphaMode);
      }
      this.uvMatrix.update() && (this.uniforms.uTextureMatrix = this.uvMatrix.mapCoord);
    }, e;
  }(Ce)
), bn = (
  /** @class */
  function(r) {
    Ro(e, r);
    function e(t, i, n) {
      var a = r.call(this) || this, o = new Ot(t), s = new Ot(i, !0), u = new Ot(n, !0, !0);
      return a.addAttribute("aVertexPosition", o, 2, !1, k.FLOAT).addAttribute("aTextureCoord", s, 2, !1, k.FLOAT).addIndex(u), a._updateId = -1, a;
    }
    return Object.defineProperty(e.prototype, "vertexDirtyId", {
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
    }), e;
  }(ui)
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
var $a = function(r, e) {
  return $a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, $a(r, e);
};
function C0(r, e) {
  $a(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var dn = (
  /** @class */
  /* @__PURE__ */ function() {
    function r() {
      this.info = [], this.common = [], this.page = [], this.char = [], this.kerning = [], this.distanceField = [];
    }
    return r;
  }()
), M0 = (
  /** @class */
  function() {
    function r() {
    }
    return r.test = function(e) {
      return typeof e == "string" && e.indexOf("info face=") === 0;
    }, r.parse = function(e) {
      var t = e.match(/^[a-z]+\s+.+$/gm), i = {
        info: [],
        common: [],
        page: [],
        char: [],
        chars: [],
        kerning: [],
        kernings: [],
        distanceField: []
      };
      for (var n in t) {
        var a = t[n].match(/^[a-z]+/gm)[0], o = t[n].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm), s = {};
        for (var u in o) {
          var h = o[u].split("="), l = h[0], f = h[1].replace(/"/gm, ""), c = parseFloat(f), d = isNaN(c) ? f : c;
          s[l] = d;
        }
        i[a].push(s);
      }
      var p = new dn();
      return i.info.forEach(function(v) {
        return p.info.push({
          face: v.face,
          size: parseInt(v.size, 10)
        });
      }), i.common.forEach(function(v) {
        return p.common.push({
          lineHeight: parseInt(v.lineHeight, 10)
        });
      }), i.page.forEach(function(v) {
        return p.page.push({
          id: parseInt(v.id, 10),
          file: v.file
        });
      }), i.char.forEach(function(v) {
        return p.char.push({
          id: parseInt(v.id, 10),
          page: parseInt(v.page, 10),
          x: parseInt(v.x, 10),
          y: parseInt(v.y, 10),
          width: parseInt(v.width, 10),
          height: parseInt(v.height, 10),
          xoffset: parseInt(v.xoffset, 10),
          yoffset: parseInt(v.yoffset, 10),
          xadvance: parseInt(v.xadvance, 10)
        });
      }), i.kerning.forEach(function(v) {
        return p.kerning.push({
          first: parseInt(v.first, 10),
          second: parseInt(v.second, 10),
          amount: parseInt(v.amount, 10)
        });
      }), i.distanceField.forEach(function(v) {
        return p.distanceField.push({
          distanceRange: parseInt(v.distanceRange, 10),
          fieldType: v.fieldType
        });
      }), p;
    }, r;
  }()
), Qa = (
  /** @class */
  function() {
    function r() {
    }
    return r.test = function(e) {
      return e instanceof XMLDocument && e.getElementsByTagName("page").length && e.getElementsByTagName("info")[0].getAttribute("face") !== null;
    }, r.parse = function(e) {
      for (var t = new dn(), i = e.getElementsByTagName("info"), n = e.getElementsByTagName("common"), a = e.getElementsByTagName("page"), o = e.getElementsByTagName("char"), s = e.getElementsByTagName("kerning"), u = e.getElementsByTagName("distanceField"), h = 0; h < i.length; h++)
        t.info.push({
          face: i[h].getAttribute("face"),
          size: parseInt(i[h].getAttribute("size"), 10)
        });
      for (var h = 0; h < n.length; h++)
        t.common.push({
          lineHeight: parseInt(n[h].getAttribute("lineHeight"), 10)
        });
      for (var h = 0; h < a.length; h++)
        t.page.push({
          id: parseInt(a[h].getAttribute("id"), 10) || 0,
          file: a[h].getAttribute("file")
        });
      for (var h = 0; h < o.length; h++) {
        var l = o[h];
        t.char.push({
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
        t.kerning.push({
          first: parseInt(s[h].getAttribute("first"), 10),
          second: parseInt(s[h].getAttribute("second"), 10),
          amount: parseInt(s[h].getAttribute("amount"), 10)
        });
      for (var h = 0; h < u.length; h++)
        t.distanceField.push({
          fieldType: u[h].getAttribute("fieldType"),
          distanceRange: parseInt(u[h].getAttribute("distanceRange"), 10)
        });
      return t;
    }, r;
  }()
), D0 = (
  /** @class */
  function() {
    function r() {
    }
    return r.test = function(e) {
      if (typeof e == "string" && e.indexOf("<font>") > -1) {
        var t = new globalThis.DOMParser().parseFromString(e, "text/xml");
        return Qa.test(t);
      }
      return !1;
    }, r.parse = function(e) {
      var t = new globalThis.DOMParser().parseFromString(e, "text/xml");
      return Qa.parse(t);
    }, r;
  }()
), ua = [
  M0,
  Qa,
  D0
];
function Jh(r) {
  for (var e = 0; e < ua.length; e++)
    if (ua[e].test(r))
      return ua[e];
  return null;
}
function F0(r, e, t, i, n, a) {
  var o = t.fill;
  if (Array.isArray(o)) {
    if (o.length === 1)
      return o[0];
  } else
    return o;
  var s, u = t.dropShadow ? t.dropShadowDistance : 0, h = t.padding || 0, l = r.width / i - u - h * 2, f = r.height / i - u - h * 2, c = o.slice(), d = t.fillGradientStops.slice();
  if (!d.length)
    for (var p = c.length + 1, v = 1; v < p; ++v)
      d.push(v / p);
  if (c.unshift(o[0]), d.unshift(0), c.push(o[o.length - 1]), d.push(1), t.fillGradientType === ri.LINEAR_VERTICAL) {
    s = e.createLinearGradient(l / 2, h, l / 2, f + h);
    for (var _ = 0, y = a.fontProperties.fontSize + t.strokeThickness, g = y / f, v = 0; v < n.length; v++)
      for (var m = a.lineHeight * v, E = 0; E < c.length; E++) {
        var b = 0;
        typeof d[E] == "number" ? b = d[E] : b = E / c.length;
        var x = m / f + b * g, S = Math.max(_, x);
        S = Math.min(S, 1), s.addColorStop(S, c[E]), _ = S;
      }
  } else {
    s = e.createLinearGradient(h, f / 2, l + h, f / 2);
    for (var A = c.length + 1, w = 1, v = 0; v < c.length; v++) {
      var P = void 0;
      typeof d[v] == "number" ? P = d[v] : P = w / A, s.addColorStop(P, c[v]), w++;
    }
  }
  return s;
}
function N0(r, e, t, i, n, a, o) {
  var s = t.text, u = t.fontProperties;
  e.translate(i, n), e.scale(a, a);
  var h = o.strokeThickness / 2, l = -(o.strokeThickness / 2);
  if (e.font = o.toFontString(), e.lineWidth = o.strokeThickness, e.textBaseline = o.textBaseline, e.lineJoin = o.lineJoin, e.miterLimit = o.miterLimit, e.fillStyle = F0(r, e, o, a, [s], t), e.strokeStyle = o.stroke, o.dropShadow) {
    var f = o.dropShadowColor, c = Ir(typeof f == "number" ? f : an(f)), d = o.dropShadowBlur * a, p = o.dropShadowDistance * a;
    e.shadowColor = "rgba(" + c[0] * 255 + "," + c[1] * 255 + "," + c[2] * 255 + "," + o.dropShadowAlpha + ")", e.shadowBlur = d, e.shadowOffsetX = Math.cos(o.dropShadowAngle) * p, e.shadowOffsetY = Math.sin(o.dropShadowAngle) * p;
  } else
    e.shadowColor = "black", e.shadowBlur = 0, e.shadowOffsetX = 0, e.shadowOffsetY = 0;
  o.stroke && o.strokeThickness && e.strokeText(s, h, l + t.lineHeight - u.descent), o.fill && e.fillText(s, h, l + t.lineHeight - u.descent), e.setTransform(1, 0, 0, 1, 0, 0), e.fillStyle = "rgba(0, 0, 0, 0)";
}
function tl(r) {
  return Array.from ? Array.from(r) : r.split("");
}
function B0(r) {
  typeof r == "string" && (r = [r]);
  for (var e = [], t = 0, i = r.length; t < i; t++) {
    var n = r[t];
    if (Array.isArray(n)) {
      if (n.length !== 2)
        throw new Error("[BitmapFont]: Invalid character range length, expecting 2 got " + n.length + ".");
      var a = n[0].charCodeAt(0), o = n[1].charCodeAt(0);
      if (o < a)
        throw new Error("[BitmapFont]: Invalid character range.");
      for (var s = a, u = o; s <= u; s++)
        e.push(String.fromCharCode(s));
    } else
      e.push.apply(e, tl(n));
  }
  if (e.length === 0)
    throw new Error("[BitmapFont]: Empty set when resolving characters.");
  return e;
}
function Yi(r) {
  return r.codePointAt ? r.codePointAt(0) : r.charCodeAt(0);
}
var Se = (
  /** @class */
  function() {
    function r(e, t, i) {
      var n, a, o = e.info[0], s = e.common[0], u = e.page[0], h = e.distanceField[0], l = sn(u.file), f = {};
      this._ownsTextures = i, this.font = o.face, this.size = o.size, this.lineHeight = s.lineHeight / l, this.chars = {}, this.pageTextures = f;
      for (var c = 0; c < e.page.length; c++) {
        var d = e.page[c], p = d.id, v = d.file;
        f[p] = t instanceof Array ? t[c] : t[v], h != null && h.fieldType && h.fieldType !== "none" && (f[p].baseTexture.alphaMode = ee.NO_PREMULTIPLIED_ALPHA, f[p].baseTexture.mipmap = te.OFF);
      }
      for (var c = 0; c < e.char.length; c++) {
        var _ = e.char[c], p = _.id, y = _.page, g = e.char[c], m = g.x, E = g.y, b = g.width, x = g.height, S = g.xoffset, A = g.yoffset, w = g.xadvance;
        m /= l, E /= l, b /= l, x /= l, S /= l, A /= l, w /= l;
        var P = new it(m + f[y].frame.x / l, E + f[y].frame.y / l, b, x);
        this.chars[p] = {
          xOffset: S,
          yOffset: A,
          xAdvance: w,
          kerning: {},
          texture: new W(f[y].baseTexture, P),
          page: y
        };
      }
      for (var c = 0; c < e.kerning.length; c++) {
        var O = e.kerning[c], M = O.first, D = O.second, C = O.amount;
        M /= l, D /= l, C /= l, this.chars[D] && (this.chars[D].kerning[M] = C);
      }
      this.distanceFieldRange = h == null ? void 0 : h.distanceRange, this.distanceFieldType = (a = (n = h == null ? void 0 : h.fieldType) === null || n === void 0 ? void 0 : n.toLowerCase()) !== null && a !== void 0 ? a : "none";
    }
    return r.prototype.destroy = function() {
      for (var e in this.chars)
        this.chars[e].texture.destroy(), this.chars[e].texture = null;
      for (var e in this.pageTextures)
        this._ownsTextures && this.pageTextures[e].destroy(!0), this.pageTextures[e] = null;
      this.chars = null, this.pageTextures = null;
    }, r.install = function(e, t, i) {
      var n;
      if (e instanceof dn)
        n = e;
      else {
        var a = Jh(e);
        if (!a)
          throw new Error("Unrecognized data format for font.");
        n = a.parse(e);
      }
      t instanceof W && (t = [t]);
      var o = new r(n, t, i);
      return r.available[o.font] = o, o;
    }, r.uninstall = function(e) {
      var t = r.available[e];
      if (!t)
        throw new Error("No font found named '" + e + "'");
      t.destroy(), delete r.available[e];
    }, r.from = function(e, t, i) {
      if (!e)
        throw new Error("[BitmapFont] Property `name` is required.");
      var n = Object.assign({}, r.defaultOptions, i), a = n.chars, o = n.padding, s = n.resolution, u = n.textureWidth, h = n.textureHeight, l = B0(a), f = t instanceof Cr ? t : new Cr(t), c = u, d = new dn();
      d.info[0] = {
        face: f.fontFamily,
        size: f.fontSize
      }, d.common[0] = {
        lineHeight: f.fontSize
      };
      for (var p = 0, v = 0, _, y, g, m = 0, E = [], b = 0; b < l.length; b++) {
        _ || (_ = U.ADAPTER.createCanvas(), _.width = u, _.height = h, y = _.getContext("2d"), g = new rt(_, { resolution: s }), E.push(new W(g)), d.page.push({
          id: E.length - 1,
          file: ""
        }));
        var x = l[b], S = ce.measureText(x, f, !1, _), A = S.width, w = Math.ceil(S.height), P = Math.ceil((f.fontStyle === "italic" ? 2 : 1) * A);
        if (v >= h - w * s) {
          if (v === 0)
            throw new Error("[BitmapFont] textureHeight " + h + "px is too small " + ("(fontFamily: '" + f.fontFamily + "', fontSize: " + f.fontSize + "px, char: '" + x + "')"));
          --b, _ = null, y = null, g = null, v = 0, p = 0, m = 0;
          continue;
        }
        if (m = Math.max(w + S.fontProperties.descent, m), P * s + p >= c) {
          if (p === 0)
            throw new Error("[BitmapFont] textureWidth " + u + "px is too small " + ("(fontFamily: '" + f.fontFamily + "', fontSize: " + f.fontSize + "px, char: '" + x + "')"));
          --b, v += m * s, v = Math.ceil(v), p = 0, m = 0;
          continue;
        }
        N0(_, y, S, p, v, s, f);
        var O = Yi(S.text);
        d.char.push({
          id: O,
          page: E.length - 1,
          x: p / s,
          y: v / s,
          width: P,
          height: w,
          xoffset: 0,
          yoffset: 0,
          xadvance: Math.ceil(A - (f.dropShadow ? f.dropShadowDistance : 0) - (f.stroke ? f.strokeThickness : 0))
        }), p += (P + 2 * o) * s, p = Math.ceil(p);
      }
      if (!(i != null && i.skipKerning))
        for (var b = 0, M = l.length; b < M; b++)
          for (var D = l[b], C = 0; C < M; C++) {
            var R = l[C], F = y.measureText(D).width, z = y.measureText(R).width, ot = y.measureText(D + R).width, Z = ot - (F + z);
            Z && d.kerning.push({
              first: Yi(D),
              second: Yi(R),
              amount: Z
            });
          }
      var B = new r(d, E, !0);
      return r.available[e] !== void 0 && r.uninstall(e), r.available[e] = B, B;
    }, r.ALPHA = [["a", "z"], ["A", "Z"], " "], r.NUMERIC = [["0", "9"]], r.ALPHANUMERIC = [["a", "z"], ["A", "Z"], ["0", "9"], " "], r.ASCII = [[" ", "~"]], r.defaultOptions = {
      resolution: 1,
      textureWidth: 512,
      textureHeight: 512,
      padding: 4,
      chars: r.ALPHANUMERIC
    }, r.available = {}, r;
  }()
), L0 = `// Pixi texture info\r
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
`, U0 = `// Mesh material default fragment\r
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
`, _u = [], yu = [], gu = [];
(function(r) {
  C0(e, r);
  function e(t, i) {
    i === void 0 && (i = {});
    var n = r.call(this) || this;
    n._tint = 16777215;
    var a = Object.assign({}, e.styleDefaults, i), o = a.align, s = a.tint, u = a.maxWidth, h = a.letterSpacing, l = a.fontName, f = a.fontSize;
    if (!Se.available[l])
      throw new Error('Missing BitmapFont "' + l + '"');
    return n._activePagesMeshData = [], n._textWidth = 0, n._textHeight = 0, n._align = o, n._tint = s, n._font = void 0, n._fontName = l, n._fontSize = f, n.text = t, n._maxWidth = u, n._maxLineHeight = 0, n._letterSpacing = h, n._anchor = new br(function() {
      n.dirty = !0;
    }, n, 0, 0), n._roundPixels = U.ROUND_PIXELS, n.dirty = !0, n._resolution = U.RESOLUTION, n._autoResolution = !0, n._textureCache = {}, n;
  }
  return e.prototype.updateText = function() {
    for (var t, i = Se.available[this._fontName], n = this.fontSize, a = n / i.size, o = new yt(), s = [], u = [], h = [], l = this._text.replace(/(?:\r\n|\r)/g, `
`) || " ", f = tl(l), c = this._maxWidth * i.size / n, d = i.distanceFieldType === "none" ? _u : yu, p = null, v = 0, _ = 0, y = 0, g = -1, m = 0, E = 0, b = 0, x = 0, S = 0; S < f.length; S++) {
      var A = f[S], w = Yi(A);
      if (/(?:\s)/.test(A) && (g = S, m = v, x++), A === "\r" || A === `
`) {
        u.push(v), h.push(-1), _ = Math.max(_, v), ++y, ++E, o.x = 0, o.y += i.lineHeight, p = null, x = 0;
        continue;
      }
      var P = i.chars[w];
      if (P) {
        p && P.kerning[p] && (o.x += P.kerning[p]);
        var O = gu.pop() || {
          texture: W.EMPTY,
          line: 0,
          charCode: 0,
          prevSpaces: 0,
          position: new yt()
        };
        O.texture = P.texture, O.line = y, O.charCode = w, O.position.x = o.x + P.xOffset + this._letterSpacing / 2, O.position.y = o.y + P.yOffset, O.prevSpaces = x, s.push(O), v = O.position.x + Math.max(P.xAdvance - P.xOffset, P.texture.orig.width), o.x += P.xAdvance + this._letterSpacing, b = Math.max(b, P.yOffset + P.texture.height), p = w, g !== -1 && c > 0 && o.x > c && (++E, wr(s, 1 + g - E, 1 + S - g), S = g, g = -1, u.push(m), h.push(s.length > 0 ? s[s.length - 1].prevSpaces : 0), _ = Math.max(_, m), y++, o.x = 0, o.y += i.lineHeight, p = null, x = 0);
      }
    }
    var M = f[f.length - 1];
    M !== "\r" && M !== `
` && (/(?:\s)/.test(M) && (v = m), u.push(v), _ = Math.max(_, v), h.push(-1));
    for (var D = [], S = 0; S <= y; S++) {
      var C = 0;
      this._align === "right" ? C = _ - u[S] : this._align === "center" ? C = (_ - u[S]) / 2 : this._align === "justify" && (C = h[S] < 0 ? 0 : (_ - u[S]) / h[S]), D.push(C);
    }
    var R = s.length, F = {}, z = [], ot = this._activePagesMeshData;
    d.push.apply(d, ot);
    for (var S = 0; S < R; S++) {
      var Z = s[S].texture, B = Z.baseTexture.uid;
      if (!F[B]) {
        var I = d.pop();
        if (!I) {
          var X = new bn(), $ = void 0, J = void 0;
          i.distanceFieldType === "none" ? ($ = new ni(W.EMPTY), J = H.NORMAL) : ($ = new ni(W.EMPTY, { program: hi.from(U0, L0), uniforms: { uFWidth: 0 } }), J = H.NORMAL_NPM);
          var _t = new ii(X, $);
          _t.blendMode = J, I = {
            index: 0,
            indexCount: 0,
            vertexCount: 0,
            uvsCount: 0,
            total: 0,
            mesh: _t,
            vertices: null,
            uvs: null,
            indices: null
          };
        }
        I.index = 0, I.indexCount = 0, I.vertexCount = 0, I.uvsCount = 0, I.total = 0;
        var K = this._textureCache;
        K[B] = K[B] || new W(Z.baseTexture), I.mesh.texture = K[B], I.mesh.tint = this._tint, z.push(I), F[B] = I;
      }
      F[B].total++;
    }
    for (var S = 0; S < ot.length; S++)
      z.indexOf(ot[S]) === -1 && this.removeChild(ot[S].mesh);
    for (var S = 0; S < z.length; S++)
      z[S].mesh.parent !== this && this.addChild(z[S].mesh);
    this._activePagesMeshData = z;
    for (var S in F) {
      var I = F[S], lt = I.total;
      if (!(((t = I.indices) === null || t === void 0 ? void 0 : t.length) > 6 * lt) || I.vertices.length < ii.BATCHABLE_SIZE * 2)
        I.vertices = new Float32Array(4 * 2 * lt), I.uvs = new Float32Array(4 * 2 * lt), I.indices = new Uint16Array(6 * lt);
      else
        for (var mt = I.total, St = I.vertices, et = mt * 4 * 2; et < St.length; et++)
          St[et] = 0;
      I.mesh.size = 6 * lt;
    }
    for (var S = 0; S < R; S++) {
      var A = s[S], at = A.position.x + D[A.line] * (this._align === "justify" ? A.prevSpaces : 1);
      this._roundPixels && (at = Math.round(at));
      var ut = at * a, dt = A.position.y * a, Z = A.texture, Q = F[Z.baseTexture.uid], q = Z.frame, L = Z._uvs, ht = Q.index++;
      Q.indices[ht * 6 + 0] = 0 + ht * 4, Q.indices[ht * 6 + 1] = 1 + ht * 4, Q.indices[ht * 6 + 2] = 2 + ht * 4, Q.indices[ht * 6 + 3] = 0 + ht * 4, Q.indices[ht * 6 + 4] = 2 + ht * 4, Q.indices[ht * 6 + 5] = 3 + ht * 4, Q.vertices[ht * 8 + 0] = ut, Q.vertices[ht * 8 + 1] = dt, Q.vertices[ht * 8 + 2] = ut + q.width * a, Q.vertices[ht * 8 + 3] = dt, Q.vertices[ht * 8 + 4] = ut + q.width * a, Q.vertices[ht * 8 + 5] = dt + q.height * a, Q.vertices[ht * 8 + 6] = ut, Q.vertices[ht * 8 + 7] = dt + q.height * a, Q.uvs[ht * 8 + 0] = L.x0, Q.uvs[ht * 8 + 1] = L.y0, Q.uvs[ht * 8 + 2] = L.x1, Q.uvs[ht * 8 + 3] = L.y1, Q.uvs[ht * 8 + 4] = L.x2, Q.uvs[ht * 8 + 5] = L.y2, Q.uvs[ht * 8 + 6] = L.x3, Q.uvs[ht * 8 + 7] = L.y3;
    }
    this._textWidth = _ * a, this._textHeight = (o.y + i.lineHeight) * a;
    for (var S in F) {
      var I = F[S];
      if (this.anchor.x !== 0 || this.anchor.y !== 0)
        for (var ie = 0, ur = this._textWidth * this.anchor.x, fi = this._textHeight * this.anchor.y, Mo = 0; Mo < I.total; Mo++)
          I.vertices[ie++] -= ur, I.vertices[ie++] -= fi, I.vertices[ie++] -= ur, I.vertices[ie++] -= fi, I.vertices[ie++] -= ur, I.vertices[ie++] -= fi, I.vertices[ie++] -= ur, I.vertices[ie++] -= fi;
      this._maxLineHeight = b * a;
      var Do = I.mesh.geometry.getBuffer("aVertexPosition"), Fo = I.mesh.geometry.getBuffer("aTextureCoord"), No = I.mesh.geometry.getIndex();
      Do.data = I.vertices, Fo.data = I.uvs, No.data = I.indices, Do.update(), Fo.update(), No.update();
    }
    for (var S = 0; S < s.length; S++)
      gu.push(s[S]);
    this._font = i, this.dirty = !1;
  }, e.prototype.updateTransform = function() {
    this.validate(), this.containerUpdateTransform();
  }, e.prototype._render = function(t) {
    this._autoResolution && this._resolution !== t.resolution && (this._resolution = t.resolution, this.dirty = !0);
    var i = Se.available[this._fontName], n = i.distanceFieldRange, a = i.distanceFieldType, o = i.size;
    if (a !== "none")
      for (var s = this.worldTransform, u = s.a, h = s.b, l = s.c, f = s.d, c = Math.sqrt(u * u + h * h), d = Math.sqrt(l * l + f * f), p = (Math.abs(c) + Math.abs(d)) / 2, v = this.fontSize / o, _ = 0, y = this._activePagesMeshData; _ < y.length; _++) {
        var g = y[_];
        g.mesh.shader.uniforms.uFWidth = p * n * v * this._resolution;
      }
    r.prototype._render.call(this, t);
  }, e.prototype.getLocalBounds = function() {
    return this.validate(), r.prototype.getLocalBounds.call(this);
  }, e.prototype.validate = function() {
    var t = Se.available[this._fontName];
    if (!t)
      throw new Error('Missing BitmapFont "' + this._fontName + '"');
    this._font !== t && (this.dirty = !0), this.dirty && this.updateText();
  }, Object.defineProperty(e.prototype, "tint", {
    /**
     * The tint of the BitmapText object.
     * @default 0xffffff
     */
    get: function() {
      return this._tint;
    },
    set: function(t) {
      if (this._tint !== t) {
        this._tint = t;
        for (var i = 0; i < this._activePagesMeshData.length; i++)
          this._activePagesMeshData[i].mesh.tint = t;
      }
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "align", {
    /**
     * The alignment of the BitmapText object.
     * @member {string}
     * @default 'left'
     */
    get: function() {
      return this._align;
    },
    set: function(t) {
      this._align !== t && (this._align = t, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "fontName", {
    /** The name of the BitmapFont. */
    get: function() {
      return this._fontName;
    },
    set: function(t) {
      if (!Se.available[t])
        throw new Error('Missing BitmapFont "' + t + '"');
      this._fontName !== t && (this._fontName = t, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "fontSize", {
    /** The size of the font to display. */
    get: function() {
      var t;
      return (t = this._fontSize) !== null && t !== void 0 ? t : Se.available[this._fontName].size;
    },
    set: function(t) {
      this._fontSize !== t && (this._fontSize = t, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "anchor", {
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
    set: function(t) {
      typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "text", {
    /** The text of the BitmapText object. */
    get: function() {
      return this._text;
    },
    set: function(t) {
      t = String(t ?? ""), this._text !== t && (this._text = t, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "maxWidth", {
    /**
     * The max width of this bitmap text in pixels. If the text provided is longer than the
     * value provided, line breaks will be automatically inserted in the last whitespace.
     * Disable by setting the value to 0.
     */
    get: function() {
      return this._maxWidth;
    },
    set: function(t) {
      this._maxWidth !== t && (this._maxWidth = t, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "maxLineHeight", {
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
  }), Object.defineProperty(e.prototype, "textWidth", {
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
  }), Object.defineProperty(e.prototype, "letterSpacing", {
    /** Additional space between characters. */
    get: function() {
      return this._letterSpacing;
    },
    set: function(t) {
      this._letterSpacing !== t && (this._letterSpacing = t, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "roundPixels", {
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
    set: function(t) {
      t !== this._roundPixels && (this._roundPixels = t, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "textHeight", {
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
  }), Object.defineProperty(e.prototype, "resolution", {
    /**
     * The resolution / device pixel ratio of the canvas.
     *
     * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
     * @default 1
     */
    get: function() {
      return this._resolution;
    },
    set: function(t) {
      this._autoResolution = !1, this._resolution !== t && (this._resolution = t, this.dirty = !0);
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.destroy = function(t) {
    var i = this._textureCache, n = Se.available[this._fontName], a = n.distanceFieldType === "none" ? _u : yu;
    a.push.apply(a, this._activePagesMeshData);
    for (var o = 0, s = this._activePagesMeshData; o < s.length; o++) {
      var u = s[o];
      this.removeChild(u.mesh);
    }
    this._activePagesMeshData = [], a.filter(function(f) {
      return i[f.mesh.texture.baseTexture.uid];
    }).forEach(function(f) {
      f.mesh.texture = W.EMPTY;
    });
    for (var h in i) {
      var l = i[h];
      l.destroy(), delete i[h];
    }
    this._font = null, this._textureCache = null, r.prototype.destroy.call(this, t);
  }, e.styleDefaults = {
    align: "left",
    tint: 16777215,
    maxWidth: 0,
    letterSpacing: 0
  }, e;
})(fe);
var G0 = (
  /** @class */
  function() {
    function r() {
    }
    return r.add = function() {
      wt.setExtensionXhrType("fnt", wt.XHR_RESPONSE_TYPE.TEXT);
    }, r.use = function(e, t) {
      var i = Jh(e.data);
      if (!i) {
        t();
        return;
      }
      for (var n = r.getBaseUrl(this, e), a = i.parse(e.data), o = {}, s = function(v) {
        o[v.metadata.pageFile] = v.texture, Object.keys(o).length === a.page.length && (e.bitmapFont = Se.install(a, o, !0), t());
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
            crossOrigin: e.crossOrigin,
            loadType: wt.LOAD_TYPE.IMAGE,
            metadata: Object.assign({ pageFile: h }, e.metadata.imageMetadata),
            parentResource: e
          };
          this.add(l, p, s);
        }
      }
    }, r.getBaseUrl = function(e, t) {
      var i = t.isDataUrl ? "" : r.dirname(t.url);
      return t.isDataUrl && (i === "." && (i = ""), e.baseUrl && i && e.baseUrl.charAt(e.baseUrl.length - 1) === "/" && (i += "/")), i = i.replace(e.baseUrl, ""), i && i.charAt(i.length - 1) !== "/" && (i += "/"), i;
    }, r.dirname = function(e) {
      var t = e.replace(/\\/g, "/").replace(/\/$/, "").replace(/\/[^\/]*$/, "");
      return t === e ? "." : t === "" ? "/" : t;
    }, r.extension = pt.Loader, r;
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
var Ja = function(r, e) {
  return Ja = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, Ja(r, e);
};
function k0(r, e) {
  Ja(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var H0 = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float uAlpha;

void main(void)
{
   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;
}
`;
(function(r) {
  k0(e, r);
  function e(t) {
    t === void 0 && (t = 1);
    var i = r.call(this, Fg, H0, { uAlpha: 1 }) || this;
    return i.alpha = t, i;
  }
  return Object.defineProperty(e.prototype, "alpha", {
    /**
     * Coefficient for alpha multiplication
     * @default 1
     */
    get: function() {
      return this.uniforms.uAlpha;
    },
    set: function(t) {
      this.uniforms.uAlpha = t;
    },
    enumerable: !1,
    configurable: !0
  }), e;
})(Le);
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
var to = function(r, e) {
  return to = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, to(r, e);
};
function el(r, e) {
  to(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var X0 = `
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
function j0(r, e) {
  var t = Math.ceil(r / 2), i = X0, n = "", a;
  e ? a = "vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * strength, 0.0);" : a = "vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * strength);";
  for (var o = 0; o < r; o++) {
    var s = a.replace("%index%", o.toString());
    s = s.replace("%sampleIndex%", o - (t - 1) + ".0"), n += s, n += `
`;
  }
  return i = i.replace("%blur%", n), i = i.replace("%size%", r.toString()), i;
}
var V0 = {
  5: [0.153388, 0.221461, 0.250301],
  7: [0.071303, 0.131514, 0.189879, 0.214607],
  9: [0.028532, 0.067234, 0.124009, 0.179044, 0.20236],
  11: [93e-4, 0.028002, 0.065984, 0.121703, 0.175713, 0.198596],
  13: [2406e-6, 9255e-6, 0.027867, 0.065666, 0.121117, 0.174868, 0.197641],
  15: [489e-6, 2403e-6, 9246e-6, 0.02784, 0.065602, 0.120999, 0.174697, 0.197448]
}, z0 = [
  "varying vec2 vBlurTexCoords[%size%];",
  "uniform sampler2D uSampler;",
  "void main(void)",
  "{",
  "    gl_FragColor = vec4(0.0);",
  "    %blur%",
  "}"
].join(`
`);
function W0(r) {
  for (var e = V0[r], t = e.length, i = z0, n = "", a = "gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;", o, s = 0; s < r; s++) {
    var u = a.replace("%index%", s.toString());
    o = s, s >= t && (o = r - s - 1), u = u.replace("%value%", e[o].toString()), n += u, n += `
`;
  }
  return i = i.replace("%blur%", n), i = i.replace("%size%", r.toString()), i;
}
var mu = (
  /** @class */
  function(r) {
    el(e, r);
    function e(t, i, n, a, o) {
      i === void 0 && (i = 8), n === void 0 && (n = 4), a === void 0 && (a = U.FILTER_RESOLUTION), o === void 0 && (o = 5);
      var s = this, u = j0(o, t), h = W0(o);
      return s = r.call(
        this,
        // vertex shader
        u,
        // fragment shader
        h
      ) || this, s.horizontal = t, s.resolution = a, s._quality = 0, s.quality = n, s.blur = i, s;
    }
    return e.prototype.apply = function(t, i, n, a) {
      if (n ? this.horizontal ? this.uniforms.strength = 1 / n.width * (n.width / i.width) : this.uniforms.strength = 1 / n.height * (n.height / i.height) : this.horizontal ? this.uniforms.strength = 1 / t.renderer.width * (t.renderer.width / i.width) : this.uniforms.strength = 1 / t.renderer.height * (t.renderer.height / i.height), this.uniforms.strength *= this.strength, this.uniforms.strength /= this.passes, this.passes === 1)
        t.applyFilter(this, i, n, a);
      else {
        var o = t.getFilterTexture(), s = t.renderer, u = i, h = o;
        this.state.blend = !1, t.applyFilter(this, u, h, Zt.CLEAR);
        for (var l = 1; l < this.passes - 1; l++) {
          t.bindAndClear(u, Zt.BLIT), this.uniforms.uSampler = h;
          var f = h;
          h = u, u = f, s.shader.bind(this), s.geometry.draw(5);
        }
        this.state.blend = !0, t.applyFilter(this, h, n, a), t.returnFilterTexture(o);
      }
    }, Object.defineProperty(e.prototype, "blur", {
      /**
       * Sets the strength of both the blur.
       * @default 16
       */
      get: function() {
        return this.strength;
      },
      set: function(t) {
        this.padding = 1 + Math.abs(t) * 2, this.strength = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "quality", {
      /**
       * Sets the quality of the blur by modifying the number of passes. More passes means higher
       * quality bluring but the lower the performance.
       * @default 4
       */
      get: function() {
        return this._quality;
      },
      set: function(t) {
        this._quality = t, this.passes = t;
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(Le)
);
(function(r) {
  el(e, r);
  function e(t, i, n, a) {
    t === void 0 && (t = 8), i === void 0 && (i = 4), n === void 0 && (n = U.FILTER_RESOLUTION), a === void 0 && (a = 5);
    var o = r.call(this) || this;
    return o.blurXFilter = new mu(!0, t, i, n, a), o.blurYFilter = new mu(!1, t, i, n, a), o.resolution = n, o.quality = i, o.blur = t, o.repeatEdgePixels = !1, o;
  }
  return e.prototype.apply = function(t, i, n, a) {
    var o = Math.abs(this.blurXFilter.strength), s = Math.abs(this.blurYFilter.strength);
    if (o && s) {
      var u = t.getFilterTexture();
      this.blurXFilter.apply(t, i, u, Zt.CLEAR), this.blurYFilter.apply(t, u, n, a), t.returnFilterTexture(u);
    } else
      s ? this.blurYFilter.apply(t, i, n, a) : this.blurXFilter.apply(t, i, n, a);
  }, e.prototype.updatePadding = function() {
    this._repeatEdgePixels ? this.padding = 0 : this.padding = Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength)) * 2;
  }, Object.defineProperty(e.prototype, "blur", {
    /**
     * Sets the strength of both the blurX and blurY properties simultaneously
     * @default 2
     */
    get: function() {
      return this.blurXFilter.blur;
    },
    set: function(t) {
      this.blurXFilter.blur = this.blurYFilter.blur = t, this.updatePadding();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "quality", {
    /**
     * Sets the number of passes for blur. More passes means higher quality bluring.
     * @default 1
     */
    get: function() {
      return this.blurXFilter.quality;
    },
    set: function(t) {
      this.blurXFilter.quality = this.blurYFilter.quality = t;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "blurX", {
    /**
     * Sets the strength of the blurX property
     * @default 2
     */
    get: function() {
      return this.blurXFilter.blur;
    },
    set: function(t) {
      this.blurXFilter.blur = t, this.updatePadding();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "blurY", {
    /**
     * Sets the strength of the blurY property
     * @default 2
     */
    get: function() {
      return this.blurYFilter.blur;
    },
    set: function(t) {
      this.blurYFilter.blur = t, this.updatePadding();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "blendMode", {
    /**
     * Sets the blendmode of the filter
     * @default PIXI.BLEND_MODES.NORMAL
     */
    get: function() {
      return this.blurYFilter.blendMode;
    },
    set: function(t) {
      this.blurYFilter.blendMode = t;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "repeatEdgePixels", {
    /**
     * If set to true the edge of the target will be clamped
     * @default false
     */
    get: function() {
      return this._repeatEdgePixels;
    },
    set: function(t) {
      this._repeatEdgePixels = t, this.updatePadding();
    },
    enumerable: !1,
    configurable: !0
  }), e;
})(Le);
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
var eo = function(r, e) {
  return eo = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, eo(r, e);
};
function Y0(r, e) {
  eo(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var q0 = `varying vec2 vTextureCoord;
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
`, bu = (
  /** @class */
  function(r) {
    Y0(e, r);
    function e() {
      var t = this, i = {
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
      return t = r.call(this, Hh, q0, i) || this, t.alpha = 1, t;
    }
    return e.prototype._loadMatrix = function(t, i) {
      i === void 0 && (i = !1);
      var n = t;
      i && (this._multiply(n, this.uniforms.m, t), n = this._colorMatrix(n)), this.uniforms.m = n;
    }, e.prototype._multiply = function(t, i, n) {
      return t[0] = i[0] * n[0] + i[1] * n[5] + i[2] * n[10] + i[3] * n[15], t[1] = i[0] * n[1] + i[1] * n[6] + i[2] * n[11] + i[3] * n[16], t[2] = i[0] * n[2] + i[1] * n[7] + i[2] * n[12] + i[3] * n[17], t[3] = i[0] * n[3] + i[1] * n[8] + i[2] * n[13] + i[3] * n[18], t[4] = i[0] * n[4] + i[1] * n[9] + i[2] * n[14] + i[3] * n[19] + i[4], t[5] = i[5] * n[0] + i[6] * n[5] + i[7] * n[10] + i[8] * n[15], t[6] = i[5] * n[1] + i[6] * n[6] + i[7] * n[11] + i[8] * n[16], t[7] = i[5] * n[2] + i[6] * n[7] + i[7] * n[12] + i[8] * n[17], t[8] = i[5] * n[3] + i[6] * n[8] + i[7] * n[13] + i[8] * n[18], t[9] = i[5] * n[4] + i[6] * n[9] + i[7] * n[14] + i[8] * n[19] + i[9], t[10] = i[10] * n[0] + i[11] * n[5] + i[12] * n[10] + i[13] * n[15], t[11] = i[10] * n[1] + i[11] * n[6] + i[12] * n[11] + i[13] * n[16], t[12] = i[10] * n[2] + i[11] * n[7] + i[12] * n[12] + i[13] * n[17], t[13] = i[10] * n[3] + i[11] * n[8] + i[12] * n[13] + i[13] * n[18], t[14] = i[10] * n[4] + i[11] * n[9] + i[12] * n[14] + i[13] * n[19] + i[14], t[15] = i[15] * n[0] + i[16] * n[5] + i[17] * n[10] + i[18] * n[15], t[16] = i[15] * n[1] + i[16] * n[6] + i[17] * n[11] + i[18] * n[16], t[17] = i[15] * n[2] + i[16] * n[7] + i[17] * n[12] + i[18] * n[17], t[18] = i[15] * n[3] + i[16] * n[8] + i[17] * n[13] + i[18] * n[18], t[19] = i[15] * n[4] + i[16] * n[9] + i[17] * n[14] + i[18] * n[19] + i[19], t;
    }, e.prototype._colorMatrix = function(t) {
      var i = new Float32Array(t);
      return i[4] /= 255, i[9] /= 255, i[14] /= 255, i[19] /= 255, i;
    }, e.prototype.brightness = function(t, i) {
      var n = [
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
      this._loadMatrix(n, i);
    }, e.prototype.tint = function(t, i) {
      var n = t >> 16 & 255, a = t >> 8 & 255, o = t & 255, s = [
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
    }, e.prototype.greyscale = function(t, i) {
      var n = [
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
      this._loadMatrix(n, i);
    }, e.prototype.blackAndWhite = function(t) {
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
      this._loadMatrix(i, t);
    }, e.prototype.hue = function(t, i) {
      t = (t || 0) / 180 * Math.PI;
      var n = Math.cos(t), a = Math.sin(t), o = Math.sqrt, s = 1 / 3, u = o(s), h = n + (1 - n) * s, l = s * (1 - n) - u * a, f = s * (1 - n) + u * a, c = s * (1 - n) + u * a, d = n + s * (1 - n), p = s * (1 - n) - u * a, v = s * (1 - n) - u * a, _ = s * (1 - n) + u * a, y = n + s * (1 - n), g = [
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
        v,
        _,
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
    }, e.prototype.contrast = function(t, i) {
      var n = (t || 0) + 1, a = -0.5 * (n - 1), o = [
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
    }, e.prototype.saturate = function(t, i) {
      t === void 0 && (t = 0);
      var n = t * 2 / 3 + 1, a = (n - 1) * -0.5, o = [
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
    }, e.prototype.desaturate = function() {
      this.saturate(-1);
    }, e.prototype.negative = function(t) {
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
      this._loadMatrix(i, t);
    }, e.prototype.sepia = function(t) {
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
      this._loadMatrix(i, t);
    }, e.prototype.technicolor = function(t) {
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
      this._loadMatrix(i, t);
    }, e.prototype.polaroid = function(t) {
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
      this._loadMatrix(i, t);
    }, e.prototype.toBGR = function(t) {
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
      this._loadMatrix(i, t);
    }, e.prototype.kodachrome = function(t) {
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
      this._loadMatrix(i, t);
    }, e.prototype.browni = function(t) {
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
      this._loadMatrix(i, t);
    }, e.prototype.vintage = function(t) {
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
      this._loadMatrix(i, t);
    }, e.prototype.colorTone = function(t, i, n, a, o) {
      t = t || 0.2, i = i || 0.15, n = n || 16770432, a = a || 3375104;
      var s = (n >> 16 & 255) / 255, u = (n >> 8 & 255) / 255, h = (n & 255) / 255, l = (a >> 16 & 255) / 255, f = (a >> 8 & 255) / 255, c = (a & 255) / 255, d = [
        0.3,
        0.59,
        0.11,
        0,
        0,
        s,
        u,
        h,
        t,
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
    }, e.prototype.night = function(t, i) {
      t = t || 0.1;
      var n = [
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
      this._loadMatrix(n, i);
    }, e.prototype.predator = function(t, i) {
      var n = [
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
      this._loadMatrix(n, i);
    }, e.prototype.lsd = function(t) {
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
      this._loadMatrix(i, t);
    }, e.prototype.reset = function() {
      var t = [
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
    }, Object.defineProperty(e.prototype, "matrix", {
      /**
       * The matrix of the color matrix filter
       * @member {number[]}
       * @default [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]
       */
      get: function() {
        return this.uniforms.m;
      },
      set: function(t) {
        this.uniforms.m = t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "alpha", {
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
      set: function(t) {
        this.uniforms.uAlpha = t;
      },
      enumerable: !1,
      configurable: !0
    }), e;
  }(Le)
);
bu.prototype.grayscale = bu.prototype.greyscale;
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
var ro = function(r, e) {
  return ro = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, ro(r, e);
};
function K0(r, e) {
  ro(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var Z0 = `varying vec2 vFilterCoord;
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
`, $0 = `attribute vec2 aVertexPosition;

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
  K0(e, r);
  function e(t, i) {
    var n = this, a = new It();
    return t.renderable = !1, n = r.call(this, $0, Z0, {
      mapSampler: t._texture,
      filterMatrix: a,
      scale: { x: 1, y: 1 },
      rotation: new Float32Array([1, 0, 0, 1])
    }) || this, n.maskSprite = t, n.maskMatrix = a, i == null && (i = 20), n.scale = new yt(i, i), n;
  }
  return e.prototype.apply = function(t, i, n, a) {
    this.uniforms.filterMatrix = t.calculateSpriteMatrix(this.maskMatrix, this.maskSprite), this.uniforms.scale.x = this.scale.x, this.uniforms.scale.y = this.scale.y;
    var o = this.maskSprite.worldTransform, s = Math.sqrt(o.a * o.a + o.b * o.b), u = Math.sqrt(o.c * o.c + o.d * o.d);
    s !== 0 && u !== 0 && (this.uniforms.rotation[0] = o.a / s, this.uniforms.rotation[1] = o.b / s, this.uniforms.rotation[2] = o.c / u, this.uniforms.rotation[3] = o.d / u), t.applyFilter(this, i, n, a);
  }, Object.defineProperty(e.prototype, "map", {
    /** The texture used for the displacement map. Must be power of 2 sized texture. */
    get: function() {
      return this.uniforms.mapSampler;
    },
    set: function(t) {
      this.uniforms.mapSampler = t;
    },
    enumerable: !1,
    configurable: !0
  }), e;
})(Le);
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
var io = function(r, e) {
  return io = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, io(r, e);
};
function Q0(r, e) {
  io(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var J0 = `
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
`, tb = `varying vec2 v_rgbNW;
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
  Q0(e, r);
  function e() {
    return r.call(this, J0, tb) || this;
  }
  return e;
})(Le);
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
var no = function(r, e) {
  return no = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, no(r, e);
};
function eb(r, e) {
  no(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var rb = `precision highp float;

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
  eb(e, r);
  function e(t, i) {
    t === void 0 && (t = 0.5), i === void 0 && (i = Math.random());
    var n = r.call(this, Hh, rb, {
      uNoise: 0,
      uSeed: 0
    }) || this;
    return n.noise = t, n.seed = i, n;
  }
  return Object.defineProperty(e.prototype, "noise", {
    /**
     * The amount of noise to apply, this value should be in the range (0, 1].
     * @default 0.5
     */
    get: function() {
      return this.uniforms.uNoise;
    },
    set: function(t) {
      this.uniforms.uNoise = t;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "seed", {
    /** A seed value to apply to the random noise generation. `Math.random()` is a good value to use. */
    get: function() {
      return this.uniforms.uSeed;
    },
    set: function(t) {
      this.uniforms.uSeed = t;
    },
    enumerable: !1,
    configurable: !0
  }), e;
})(Le);
/*!
 * @pixi/mixin-cache-as-bitmap - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/mixin-cache-as-bitmap is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var rl = new It();
At.prototype._cacheAsBitmap = !1;
At.prototype._cacheData = null;
At.prototype._cacheAsBitmapResolution = null;
At.prototype._cacheAsBitmapMultisample = gt.NONE;
var ib = (
  /** @class */
  /* @__PURE__ */ function() {
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
        var e;
        r ? (this._cacheData || (this._cacheData = new ib()), e = this._cacheData, e.originalRender = this.render, e.originalRenderCanvas = this.renderCanvas, e.originalUpdateTransform = this.updateTransform, e.originalCalculateBounds = this.calculateBounds, e.originalGetLocalBounds = this.getLocalBounds, e.originalDestroy = this.destroy, e.originalContainsPoint = this.containsPoint, e.originalMask = this._mask, e.originalFilterArea = this.filterArea, this.render = this._renderCached, this.renderCanvas = this._renderCachedCanvas, this.destroy = this._cacheAsBitmapDestroy) : (e = this._cacheData, e.sprite && this._destroyCachedDisplayObject(), this.render = e.originalRender, this.renderCanvas = e.originalRenderCanvas, this.calculateBounds = e.originalCalculateBounds, this.getLocalBounds = e.originalGetLocalBounds, this.destroy = e.originalDestroy, this.updateTransform = e.originalUpdateTransform, this.containsPoint = e.originalContainsPoint, this._mask = e.originalMask, this.filterArea = e.originalFilterArea);
      }
    }
  }
});
At.prototype._renderCached = function(e) {
  !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObject(e), this._cacheData.sprite.transform._worldID = this.transform._worldID, this._cacheData.sprite.worldAlpha = this.worldAlpha, this._cacheData.sprite._render(e));
};
At.prototype._initCachedDisplayObject = function(e) {
  var t;
  if (!(this._cacheData && this._cacheData.sprite)) {
    var i = this.alpha;
    this.alpha = 1, e.batch.flush();
    var n = this.getLocalBounds(null, !0).clone();
    if (this.filters && this.filters.length) {
      var a = this.filters[0].padding;
      n.pad(a);
    }
    n.ceil(U.RESOLUTION);
    var o = e.renderTexture.current, s = e.renderTexture.sourceFrame.clone(), u = e.renderTexture.destinationFrame.clone(), h = e.projection.transform, l = ir.create({
      width: n.width,
      height: n.height,
      resolution: this.cacheAsBitmapResolution || e.resolution,
      multisample: (t = this.cacheAsBitmapMultisample) !== null && t !== void 0 ? t : e.multisample
    }), f = "cacheAsBitmap_" + rr();
    this._cacheData.textureCacheId = f, rt.addToCache(l.baseTexture, f), W.addToCache(l, f);
    var c = this.transform.localTransform.copyTo(rl).invert().translate(-n.x, -n.y);
    this.render = this._cacheData.originalRender, e.render(this, { renderTexture: l, clear: !0, transform: c, skipUpdateTransform: !1 }), e.framebuffer.blit(), e.projection.transform = h, e.renderTexture.bind(o, s, u), this.render = this._renderCached, this.updateTransform = this.displayObjectUpdateTransform, this.calculateBounds = this._calculateCachedBounds, this.getLocalBounds = this._getCachedLocalBounds, this._mask = null, this.filterArea = null, this.alpha = i;
    var d = new li(l);
    d.transform.worldTransform = this.transform.worldTransform, d.anchor.x = -(n.x / n.width), d.anchor.y = -(n.y / n.height), d.alpha = i, d._bounds = this._bounds, this._cacheData.sprite = d, this.transform._parentID = -1, this.parent ? this.updateTransform() : (this.enableTempParent(), this.updateTransform(), this.disableTempParent(null)), this.containsPoint = d.containsPoint.bind(d);
  }
};
At.prototype._renderCachedCanvas = function(e) {
  !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObjectCanvas(e), this._cacheData.sprite.worldAlpha = this.worldAlpha, this._cacheData.sprite._renderCanvas(e));
};
At.prototype._initCachedDisplayObjectCanvas = function(e) {
  if (!(this._cacheData && this._cacheData.sprite)) {
    var t = this.getLocalBounds(null, !0), i = this.alpha;
    this.alpha = 1;
    var n = e.context, a = e._projTransform;
    t.ceil(U.RESOLUTION);
    var o = ir.create({ width: t.width, height: t.height }), s = "cacheAsBitmap_" + rr();
    this._cacheData.textureCacheId = s, rt.addToCache(o.baseTexture, s), W.addToCache(o, s);
    var u = rl;
    this.transform.localTransform.copyTo(u), u.invert(), u.tx -= t.x, u.ty -= t.y, this.renderCanvas = this._cacheData.originalRenderCanvas, e.render(this, { renderTexture: o, clear: !0, transform: u, skipUpdateTransform: !1 }), e.context = n, e._projTransform = a, this.renderCanvas = this._renderCachedCanvas, this.updateTransform = this.displayObjectUpdateTransform, this.calculateBounds = this._calculateCachedBounds, this.getLocalBounds = this._getCachedLocalBounds, this._mask = null, this.filterArea = null, this.alpha = i;
    var h = new li(o);
    h.transform.worldTransform = this.transform.worldTransform, h.anchor.x = -(t.x / t.width), h.anchor.y = -(t.y / t.height), h.alpha = i, h._bounds = this._bounds, this._cacheData.sprite = h, this.transform._parentID = -1, this.parent ? this.updateTransform() : (this.parent = e._tempDisplayObjectParent, this.updateTransform(), this.parent = null), this.containsPoint = h.containsPoint.bind(h);
  }
};
At.prototype._calculateCachedBounds = function() {
  this._bounds.clear(), this._cacheData.sprite.transform._worldID = this.transform._worldID, this._cacheData.sprite._calculateBounds(), this._bounds.updateID = this._boundsID;
};
At.prototype._getCachedLocalBounds = function() {
  return this._cacheData.sprite.getLocalBounds(null);
};
At.prototype._destroyCachedDisplayObject = function() {
  this._cacheData.sprite._texture.destroy(!0), this._cacheData.sprite = null, rt.removeFromCache(this._cacheData.textureCacheId), W.removeFromCache(this._cacheData.textureCacheId), this._cacheData.textureCacheId = null;
};
At.prototype._cacheAsBitmapDestroy = function(e) {
  this.cacheAsBitmap = !1, this.destroy(e);
};
/*!
 * @pixi/mixin-get-child-by-name - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/mixin-get-child-by-name is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
At.prototype.name = null;
fe.prototype.getChildByName = function(e, t) {
  for (var i = 0, n = this.children.length; i < n; i++)
    if (this.children[i].name === e)
      return this.children[i];
  if (t)
    for (var i = 0, n = this.children.length; i < n; i++) {
      var a = this.children[i];
      if (a.getChildByName) {
        var o = a.getChildByName(e, !0);
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
At.prototype.getGlobalPosition = function(e, t) {
  return e === void 0 && (e = new yt()), t === void 0 && (t = !1), this.parent ? this.parent.toGlobal(this.position, e, t) : (e.x = this.position.x, e.y = this.position.y), e;
};
/*!
 * @pixi/app - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * @pixi/app is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var nb = (
  /** @class */
  function() {
    function r() {
    }
    return r.init = function(e) {
      var t = this;
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
        t._resizeTo && (t.cancelResize(), t._resizeId = requestAnimationFrame(function() {
          return t.resize();
        }));
      }, this.cancelResize = function() {
        t._resizeId && (cancelAnimationFrame(t._resizeId), t._resizeId = null);
      }, this.resize = function() {
        if (t._resizeTo) {
          t.cancelResize();
          var i, n;
          if (t._resizeTo === globalThis.window)
            i = globalThis.innerWidth, n = globalThis.innerHeight;
          else {
            var a = t._resizeTo, o = a.clientWidth, s = a.clientHeight;
            i = o, n = s;
          }
          t.renderer.resize(i, n);
        }
      }, this._resizeId = null, this._resizeTo = null, this.resizeTo = e.resizeTo || null;
    }, r.destroy = function() {
      globalThis.removeEventListener("resize", this.queueResize), this.cancelResize(), this.cancelResize = null, this.queueResize = null, this.resizeTo = null, this.resize = null;
    }, r.extension = pt.Application, r;
  }()
), ab = (
  /** @class */
  function() {
    function r(e) {
      var t = this;
      this.stage = new fe(), e = Object.assign({
        forceCanvas: !1
      }, e), this.renderer = kh(e), r._plugins.forEach(function(i) {
        i.init.call(t, e);
      });
    }
    return r.registerPlugin = function(e) {
      Jt("6.5.0", "Application.registerPlugin() is deprecated, use extensions.add()"), xe.add({
        type: pt.Application,
        ref: e
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
    }), r.prototype.destroy = function(e, t) {
      var i = this, n = r._plugins.slice(0);
      n.reverse(), n.forEach(function(a) {
        a.destroy.call(i);
      }), this.stage.destroy(t), this.stage = null, this.renderer.destroy(e), this.renderer = null;
    }, r._plugins = [], r;
  }()
);
xe.handleByList(pt.Application, ab._plugins);
xe.add(nb);
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
var ao = function(r, e) {
  return ao = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, ao(r, e);
};
function Dr(r, e) {
  ao(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var ob = (
  /** @class */
  function(r) {
    Dr(e, r);
    function e(t, i, n, a) {
      t === void 0 && (t = 100), i === void 0 && (i = 100), n === void 0 && (n = 10), a === void 0 && (a = 10);
      var o = r.call(this) || this;
      return o.segWidth = n, o.segHeight = a, o.width = t, o.height = i, o.build(), o;
    }
    return e.prototype.build = function() {
      for (var t = this.segWidth * this.segHeight, i = [], n = [], a = [], o = this.segWidth - 1, s = this.segHeight - 1, u = this.width / o, h = this.height / s, l = 0; l < t; l++) {
        var f = l % this.segWidth, c = l / this.segWidth | 0;
        i.push(f * u, c * h), n.push(f / o, c / s);
      }
      for (var d = o * s, l = 0; l < d; l++) {
        var p = l % o, v = l / o | 0, _ = v * this.segWidth + p, y = v * this.segWidth + p + 1, g = (v + 1) * this.segWidth + p, m = (v + 1) * this.segWidth + p + 1;
        a.push(_, y, g, y, m, g);
      }
      this.buffers[0].data = new Float32Array(i), this.buffers[1].data = new Float32Array(n), this.indexBuffer.data = new Uint16Array(a), this.buffers[0].update(), this.buffers[1].update(), this.indexBuffer.update();
    }, e;
  }(bn)
), sb = (
  /** @class */
  function(r) {
    Dr(e, r);
    function e(t, i, n) {
      t === void 0 && (t = 200), n === void 0 && (n = 0);
      var a = r.call(this, new Float32Array(i.length * 4), new Float32Array(i.length * 4), new Uint16Array((i.length - 1) * 6)) || this;
      return a.points = i, a._width = t, a.textureScale = n, a.build(), a;
    }
    return Object.defineProperty(e.prototype, "width", {
      /**
       * The width (i.e., thickness) of the rope.
       * @readonly
       */
      get: function() {
        return this._width;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.build = function() {
      var t = this.points;
      if (t) {
        var i = this.getBuffer("aVertexPosition"), n = this.getBuffer("aTextureCoord"), a = this.getIndex();
        if (!(t.length < 1)) {
          i.data.length / 4 !== t.length && (i.data = new Float32Array(t.length * 4), n.data = new Float32Array(t.length * 4), a.data = new Uint16Array((t.length - 1) * 6));
          var o = n.data, s = a.data;
          o[0] = 0, o[1] = 0, o[2] = 0, o[3] = 1;
          for (var u = 0, h = t[0], l = this._width * this.textureScale, f = t.length, c = 0; c < f; c++) {
            var d = c * 4;
            if (this.textureScale > 0) {
              var p = h.x - t[c].x, v = h.y - t[c].y, _ = Math.sqrt(p * p + v * v);
              h = t[c], u += _ / l;
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
    }, e.prototype.updateVertices = function() {
      var t = this.points;
      if (!(t.length < 1)) {
        for (var i = t[0], n, a = 0, o = 0, s = this.buffers[0].data, u = t.length, h = 0; h < u; h++) {
          var l = t[h], f = h * 4;
          h < t.length - 1 ? n = t[h + 1] : n = l, o = -(n.x - i.x), a = n.y - i.y;
          var c = Math.sqrt(a * a + o * o), d = this.textureScale > 0 ? this.textureScale * this._width / 2 : this._width / 2;
          a /= c, o /= c, a *= d, o *= d, s[f] = l.x + a, s[f + 1] = l.y + o, s[f + 2] = l.x - a, s[f + 3] = l.y - o, i = l;
        }
        this.buffers[0].update();
      }
    }, e.prototype.update = function() {
      this.textureScale > 0 ? this.build() : this.updateVertices();
    }, e;
  }(bn)
);
(function(r) {
  Dr(e, r);
  function e(t, i, n) {
    n === void 0 && (n = 0);
    var a = this, o = new sb(t.height, i, n), s = new ni(t);
    return n > 0 && (t.baseTexture.wrapMode = ue.REPEAT), a = r.call(this, o, s) || this, a.autoUpdate = !0, a;
  }
  return e.prototype._render = function(t) {
    var i = this.geometry;
    (this.autoUpdate || i._width !== this.shader.texture.height) && (i._width = this.shader.texture.height, i.update()), r.prototype._render.call(this, t);
  }, e;
})(ii);
var ub = (
  /** @class */
  function(r) {
    Dr(e, r);
    function e(t, i, n) {
      var a = this, o = new ob(t.width, t.height, i, n), s = new ni(W.WHITE);
      return a = r.call(this, o, s) || this, a.texture = t, a.autoResize = !0, a;
    }
    return e.prototype.textureUpdated = function() {
      this._textureID = this.shader.texture._updateID;
      var t = this.geometry, i = this.shader.texture, n = i.width, a = i.height;
      this.autoResize && (t.width !== n || t.height !== a) && (t.width = this.shader.texture.width, t.height = this.shader.texture.height, t.build());
    }, Object.defineProperty(e.prototype, "texture", {
      get: function() {
        return this.shader.texture;
      },
      set: function(t) {
        this.shader.texture !== t && (this.shader.texture = t, this._textureID = -1, t.baseTexture.valid ? this.textureUpdated() : t.once("update", this.textureUpdated, this));
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype._render = function(t) {
      this._textureID !== this.shader.texture._updateID && this.textureUpdated(), r.prototype._render.call(this, t);
    }, e.prototype.destroy = function(t) {
      this.shader.texture.off("update", this.textureUpdated, this), r.prototype.destroy.call(this, t);
    }, e;
  }(ii)
);
(function(r) {
  Dr(e, r);
  function e(t, i, n, a, o) {
    t === void 0 && (t = W.EMPTY);
    var s = this, u = new bn(i, n, a);
    u.getBuffer("aVertexPosition").static = !1;
    var h = new ni(t);
    return s = r.call(this, u, h, null, o) || this, s.autoUpdate = !0, s;
  }
  return Object.defineProperty(e.prototype, "vertices", {
    /**
     * Collection of vertices data.
     * @type {Float32Array}
     */
    get: function() {
      return this.geometry.getBuffer("aVertexPosition").data;
    },
    set: function(t) {
      this.geometry.getBuffer("aVertexPosition").data = t;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype._render = function(t) {
    this.autoUpdate && this.geometry.getBuffer("aVertexPosition").update(), r.prototype._render.call(this, t);
  }, e;
})(ii);
var ki = 10;
(function(r) {
  Dr(e, r);
  function e(t, i, n, a, o) {
    i === void 0 && (i = ki), n === void 0 && (n = ki), a === void 0 && (a = ki), o === void 0 && (o = ki);
    var s = r.call(this, W.WHITE, 4, 4) || this;
    return s._origWidth = t.orig.width, s._origHeight = t.orig.height, s._width = s._origWidth, s._height = s._origHeight, s._leftWidth = i, s._rightWidth = a, s._topHeight = n, s._bottomHeight = o, s.texture = t, s;
  }
  return e.prototype.textureUpdated = function() {
    this._textureID = this.shader.texture._updateID, this._refresh();
  }, Object.defineProperty(e.prototype, "vertices", {
    get: function() {
      return this.geometry.getBuffer("aVertexPosition").data;
    },
    set: function(t) {
      this.geometry.getBuffer("aVertexPosition").data = t;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.updateHorizontalVertices = function() {
    var t = this.vertices, i = this._getMinScale();
    t[9] = t[11] = t[13] = t[15] = this._topHeight * i, t[17] = t[19] = t[21] = t[23] = this._height - this._bottomHeight * i, t[25] = t[27] = t[29] = t[31] = this._height;
  }, e.prototype.updateVerticalVertices = function() {
    var t = this.vertices, i = this._getMinScale();
    t[2] = t[10] = t[18] = t[26] = this._leftWidth * i, t[4] = t[12] = t[20] = t[28] = this._width - this._rightWidth * i, t[6] = t[14] = t[22] = t[30] = this._width;
  }, e.prototype._getMinScale = function() {
    var t = this._leftWidth + this._rightWidth, i = this._width > t ? 1 : this._width / t, n = this._topHeight + this._bottomHeight, a = this._height > n ? 1 : this._height / n, o = Math.min(i, a);
    return o;
  }, Object.defineProperty(e.prototype, "width", {
    /** The width of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
    get: function() {
      return this._width;
    },
    set: function(t) {
      this._width = t, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "height", {
    /** The height of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
    get: function() {
      return this._height;
    },
    set: function(t) {
      this._height = t, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "leftWidth", {
    /** The width of the left column. */
    get: function() {
      return this._leftWidth;
    },
    set: function(t) {
      this._leftWidth = t, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "rightWidth", {
    /** The width of the right column. */
    get: function() {
      return this._rightWidth;
    },
    set: function(t) {
      this._rightWidth = t, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "topHeight", {
    /** The height of the top row. */
    get: function() {
      return this._topHeight;
    },
    set: function(t) {
      this._topHeight = t, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "bottomHeight", {
    /** The height of the bottom row. */
    get: function() {
      return this._bottomHeight;
    },
    set: function(t) {
      this._bottomHeight = t, this._refresh();
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype._refresh = function() {
    var t = this.texture, i = this.geometry.buffers[1].data;
    this._origWidth = t.orig.width, this._origHeight = t.orig.height;
    var n = 1 / this._origWidth, a = 1 / this._origHeight;
    i[0] = i[8] = i[16] = i[24] = 0, i[1] = i[3] = i[5] = i[7] = 0, i[6] = i[14] = i[22] = i[30] = 1, i[25] = i[27] = i[29] = i[31] = 1, i[2] = i[10] = i[18] = i[26] = n * this._leftWidth, i[4] = i[12] = i[20] = i[28] = 1 - n * this._rightWidth, i[9] = i[11] = i[13] = i[15] = a * this._topHeight, i[17] = i[19] = i[21] = i[23] = 1 - a * this._bottomHeight, this.updateHorizontalVertices(), this.updateVerticalVertices(), this.geometry.buffers[0].update(), this.geometry.buffers[1].update();
  }, e;
})(ub);
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
var oo = function(r, e) {
  return oo = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var n in i)
      i.hasOwnProperty(n) && (t[n] = i[n]);
  }, oo(r, e);
};
function hb(r, e) {
  oo(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
(function(r) {
  hb(e, r);
  function e(t, i) {
    i === void 0 && (i = !0);
    var n = r.call(this, t[0] instanceof W ? t[0] : t[0].texture) || this;
    return n._textures = null, n._durations = null, n._autoUpdate = i, n._isConnectedToTicker = !1, n.animationSpeed = 1, n.loop = !0, n.updateAnchor = !1, n.onComplete = null, n.onFrameChange = null, n.onLoop = null, n._currentTime = 0, n._playing = !1, n._previousFrame = null, n.textures = t, n;
  }
  return e.prototype.stop = function() {
    this._playing && (this._playing = !1, this._autoUpdate && this._isConnectedToTicker && (Lt.shared.remove(this.update, this), this._isConnectedToTicker = !1));
  }, e.prototype.play = function() {
    this._playing || (this._playing = !0, this._autoUpdate && !this._isConnectedToTicker && (Lt.shared.add(this.update, this, Ee.HIGH), this._isConnectedToTicker = !0));
  }, e.prototype.gotoAndStop = function(t) {
    this.stop();
    var i = this.currentFrame;
    this._currentTime = t, i !== this.currentFrame && this.updateTexture();
  }, e.prototype.gotoAndPlay = function(t) {
    var i = this.currentFrame;
    this._currentTime = t, i !== this.currentFrame && this.updateTexture(), this.play();
  }, e.prototype.update = function(t) {
    if (this._playing) {
      var i = this.animationSpeed * t, n = this.currentFrame;
      if (this._durations !== null) {
        var a = this._currentTime % 1 * this._durations[this.currentFrame];
        for (a += i / 60 * 1e3; a < 0; )
          this._currentTime--, a += this._durations[this.currentFrame];
        var o = Math.sign(this.animationSpeed * t);
        for (this._currentTime = Math.floor(this._currentTime); a >= this._durations[this.currentFrame]; )
          a -= this._durations[this.currentFrame] * o, this._currentTime += o;
        this._currentTime += a / this._durations[this.currentFrame];
      } else
        this._currentTime += i;
      this._currentTime < 0 && !this.loop ? (this.gotoAndStop(0), this.onComplete && this.onComplete()) : this._currentTime >= this._textures.length && !this.loop ? (this.gotoAndStop(this._textures.length - 1), this.onComplete && this.onComplete()) : n !== this.currentFrame && (this.loop && this.onLoop && (this.animationSpeed > 0 && this.currentFrame < n ? this.onLoop() : this.animationSpeed < 0 && this.currentFrame > n && this.onLoop()), this.updateTexture());
    }
  }, e.prototype.updateTexture = function() {
    var t = this.currentFrame;
    this._previousFrame !== t && (this._previousFrame = t, this._texture = this._textures[t], this._textureID = -1, this._textureTrimmedID = -1, this._cachedTint = 16777215, this.uvs = this._texture._uvs.uvsFloat32, this.updateAnchor && this._anchor.copyFrom(this._texture.defaultAnchor), this.onFrameChange && this.onFrameChange(this.currentFrame));
  }, e.prototype.destroy = function(t) {
    this.stop(), r.prototype.destroy.call(this, t), this.onComplete = null, this.onFrameChange = null, this.onLoop = null;
  }, e.fromFrames = function(t) {
    for (var i = [], n = 0; n < t.length; ++n)
      i.push(W.from(t[n]));
    return new e(i);
  }, e.fromImages = function(t) {
    for (var i = [], n = 0; n < t.length; ++n)
      i.push(W.from(t[n]));
    return new e(i);
  }, Object.defineProperty(e.prototype, "totalFrames", {
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
  }), Object.defineProperty(e.prototype, "textures", {
    /** The array of textures used for this AnimatedSprite. */
    get: function() {
      return this._textures;
    },
    set: function(t) {
      if (t[0] instanceof W)
        this._textures = t, this._durations = null;
      else {
        this._textures = [], this._durations = [];
        for (var i = 0; i < t.length; i++)
          this._textures.push(t[i].texture), this._durations.push(t[i].time);
      }
      this._previousFrame = null, this.gotoAndStop(0), this.updateTexture();
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "currentFrame", {
    /**
     * The AnimatedSprites current frame index.
     * @readonly
     */
    get: function() {
      var t = Math.floor(this._currentTime) % this._textures.length;
      return t < 0 && (t += this._textures.length), t;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "playing", {
    /**
     * Indicates if the AnimatedSprite is currently playing.
     * @readonly
     */
    get: function() {
      return this._playing;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "autoUpdate", {
    /** Whether to use PIXI.Ticker.shared to auto update animation time. */
    get: function() {
      return this._autoUpdate;
    },
    set: function(t) {
      t !== this._autoUpdate && (this._autoUpdate = t, !this._autoUpdate && this._isConnectedToTicker ? (Lt.shared.remove(this.update, this), this._isConnectedToTicker = !1) : this._autoUpdate && !this._isConnectedToTicker && this._playing && (Lt.shared.add(this.update, this), this._isConnectedToTicker = !0));
    },
    enumerable: !1,
    configurable: !0
  }), e;
})(li);
/*!
 * pixi.js - v6.5.10
 * Compiled Thu, 06 Jul 2023 15:25:11 UTC
 *
 * pixi.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
xe.add(
  // Install renderer plugins
  zg,
  Jg,
  Zg,
  zm,
  b0,
  jh,
  A0,
  // Install loader plugins
  G0,
  _m,
  Hm,
  Xm,
  T0,
  // Install application plugins
  ly,
  sm
);
var le = /* @__PURE__ */ ((r) => (r.ELLIPSE = "ELLIPSE", r.POLYGON = "POLYGON", r.RECTANGLE = "RECTANGLE", r.FREEHAND = "FREEHAND", r))(le || {});
const Oo = (r, e) => e, lb = (r) => {
  let e = 1 / 0, t = 1 / 0, i = -1 / 0, n = -1 / 0;
  return r.forEach(([a, o]) => {
    e = Math.min(e, a), t = Math.min(t, o), i = Math.max(i, a), n = Math.max(n, o);
  }), { minX: e, minY: t, maxX: i, maxY: n };
}, fb = {
  area: (r) => Math.PI * r.geometry.rx * r.geometry.ry,
  intersects: (r, e, t) => {
    const { cx: i, cy: n, rx: a, ry: o } = r.geometry, s = 0, u = Math.cos(s), h = Math.sin(s), l = e - i, f = t - n, c = u * l + h * f, d = h * l - u * f;
    return c * c / (a * a) + d * d / (o * o) <= 1;
  }
};
Oo(le.ELLIPSE, fb);
const cb = {
  area: (r) => {
    const { points: e } = r.geometry;
    let t = 0, i = e.length - 1;
    for (let n = 0; n < e.length; n++)
      t += (e[i][0] + e[n][0]) * (e[i][1] - e[n][1]), i = n;
    return Math.abs(0.5 * t);
  },
  intersects: (r, e, t) => {
    const { points: i } = r.geometry;
    let n = !1;
    for (let a = 0, o = i.length - 1; a < i.length; o = a++) {
      const s = i[a][0], u = i[a][1], h = i[o][0], l = i[o][1];
      u > t != l > t && e < (h - s) * (t - u) / (l - u) + s && (n = !n);
    }
    return n;
  }
};
Oo(le.POLYGON, cb);
const db = {
  area: (r) => r.geometry.w * r.geometry.h,
  intersects: (r, e, t) => e >= r.geometry.x && e <= r.geometry.x + r.geometry.w && t >= r.geometry.y && t <= r.geometry.y + r.geometry.h
};
Oo(le.RECTANGLE, db);
let Hi;
const pb = new Uint8Array(16);
function vb() {
  if (!Hi && (Hi = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !Hi))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return Hi(pb);
}
const Nt = [];
for (let r = 0; r < 256; ++r)
  Nt.push((r + 256).toString(16).slice(1));
function _b(r, e = 0) {
  return Nt[r[e + 0]] + Nt[r[e + 1]] + Nt[r[e + 2]] + Nt[r[e + 3]] + "-" + Nt[r[e + 4]] + Nt[r[e + 5]] + "-" + Nt[r[e + 6]] + Nt[r[e + 7]] + "-" + Nt[r[e + 8]] + Nt[r[e + 9]] + "-" + Nt[r[e + 10]] + Nt[r[e + 11]] + Nt[r[e + 12]] + Nt[r[e + 13]] + Nt[r[e + 14]] + Nt[r[e + 15]];
}
const yb = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), Eu = {
  randomUUID: yb
};
function gb(r, e, t) {
  if (Eu.randomUUID && !e && !r)
    return Eu.randomUUID();
  r = r || {};
  const i = r.random || (r.rng || vb)();
  if (i[6] = i[6] & 15 | 64, i[8] = i[8] & 63 | 128, e) {
    t = t || 0;
    for (let n = 0; n < 16; ++n)
      e[t + n] = i[n];
    return e;
  }
  return _b(i);
}
function Tu(r, e, t) {
  const i = r.slice();
  return i[11] = e[t], i[13] = t, i;
}
function xu(r) {
  let e, t, i, n, a;
  return {
    c() {
      e = st("rect"), T(e, "class", "a9s-corner-handle"), T(e, "x", t = /*point*/
      r[11][0] - /*handleSize*/
      r[3] / 2), T(e, "y", i = /*point*/
      r[11][1] - /*handleSize*/
      r[3] / 2), T(
        e,
        "height",
        /*handleSize*/
        r[3]
      ), T(
        e,
        "width",
        /*handleSize*/
        r[3]
      );
    },
    m(o, s) {
      V(o, e, s), n || (a = Pt(e, "pointerdown", function() {
        xt(
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
      24 && t !== (t = /*point*/
      r[11][0] - /*handleSize*/
      r[3] / 2) && T(e, "x", t), s & /*geom, handleSize*/
      24 && i !== (i = /*point*/
      r[11][1] - /*handleSize*/
      r[3] / 2) && T(e, "y", i), s & /*handleSize*/
      8 && T(
        e,
        "height",
        /*handleSize*/
        r[3]
      ), s & /*handleSize*/
      8 && T(
        e,
        "width",
        /*handleSize*/
        r[3]
      );
    },
    d(o) {
      o && j(e), n = !1, a();
    }
  };
}
function mb(r) {
  let e, t, i, n, a, o, s, u, h, l, f = Pr(
    /*geom*/
    r[4].points
  ), c = [];
  for (let d = 0; d < f.length; d += 1)
    c[d] = xu(Tu(r, f, d));
  return {
    c() {
      e = st("polygon"), n = Gt(), a = st("polygon"), s = Gt();
      for (let d = 0; d < c.length; d += 1)
        c[d].c();
      u = ar(), T(e, "class", "a9s-outer"), T(e, "style", t = /*computedStyle*/
      r[1] ? "display:none;" : void 0), T(e, "points", i = /*geom*/
      r[4].points.map(wu).join(" ")), T(a, "class", "a9s-inner a9s-shape-handle"), T(
        a,
        "style",
        /*computedStyle*/
        r[1]
      ), T(a, "points", o = /*geom*/
      r[4].points.map(Su).join(" "));
    },
    m(d, p) {
      V(d, e, p), V(d, n, p), V(d, a, p), V(d, s, p);
      for (let v = 0; v < c.length; v += 1)
        c[v] && c[v].m(d, p);
      V(d, u, p), h || (l = [
        Pt(e, "pointerdown", function() {
          xt(
            /*grab*/
            r[10](G.SHAPE)
          ) && r[10](G.SHAPE).apply(this, arguments);
        }),
        Pt(a, "pointerdown", function() {
          xt(
            /*grab*/
            r[10](G.SHAPE)
          ) && r[10](G.SHAPE).apply(this, arguments);
        })
      ], h = !0);
    },
    p(d, p) {
      if (r = d, p & /*computedStyle*/
      2 && t !== (t = /*computedStyle*/
      r[1] ? "display:none;" : void 0) && T(e, "style", t), p & /*geom*/
      16 && i !== (i = /*geom*/
      r[4].points.map(wu).join(" ")) && T(e, "points", i), p & /*computedStyle*/
      2 && T(
        a,
        "style",
        /*computedStyle*/
        r[1]
      ), p & /*geom*/
      16 && o !== (o = /*geom*/
      r[4].points.map(Su).join(" ")) && T(a, "points", o), p & /*geom, handleSize, grab*/
      1048) {
        f = Pr(
          /*geom*/
          r[4].points
        );
        let v;
        for (v = 0; v < f.length; v += 1) {
          const _ = Tu(r, f, v);
          c[v] ? c[v].p(_, p) : (c[v] = xu(_), c[v].c(), c[v].m(u.parentNode, u));
        }
        for (; v < c.length; v += 1)
          c[v].d(1);
        c.length = f.length;
      }
    },
    d(d) {
      d && (j(e), j(n), j(a), j(s), j(u)), lo(c, d), h = !1, Te(l);
    }
  };
}
function bb(r) {
  let e, t;
  return e = new Io({
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
          mb,
          ({ grab: i }) => ({ 10: i }),
          ({ grab: i }) => i ? 1024 : 0
        ]
      },
      $$scope: { ctx: r }
    }
  }), e.$on(
    "change",
    /*change_handler*/
    r[7]
  ), e.$on(
    "grab",
    /*grab_handler*/
    r[8]
  ), e.$on(
    "release",
    /*release_handler*/
    r[9]
  ), {
    c() {
      re(e.$$.fragment);
    },
    m(i, n) {
      zt(e, i, n), t = !0;
    },
    p(i, [n]) {
      const a = {};
      n & /*shape*/
      1 && (a.shape = /*shape*/
      i[0]), n & /*transform*/
      4 && (a.transform = /*transform*/
      i[2]), n & /*$$scope, geom, handleSize, grab, computedStyle*/
      17434 && (a.$$scope = { dirty: n, ctx: i }), e.$set(a);
    },
    i(i) {
      t || (nt(e.$$.fragment, i), t = !0);
    },
    o(i) {
      ct(e.$$.fragment, i), t = !1;
    },
    d(i) {
      Wt(e, i);
    }
  };
}
const wu = (r) => r.join(","), Su = (r) => r.join(",");
function Eb(r, e, t) {
  let i, n, { shape: a } = e, { computedStyle: o = void 0 } = e, { transform: s } = e, { viewportScale: u = 1 } = e;
  const h = (d, p, v) => {
    let _;
    p === G.SHAPE ? _ = d.geometry.points.map(([g, m]) => [g + v[0], m + v[1]]) : _ = d.geometry.points.map(([g, m], E) => p === G(E) ? [g + v[0], m + v[1]] : [g, m]);
    const y = lb(_);
    return { ...d, geometry: { points: _, bounds: y } };
  };
  function l(d) {
    me.call(this, r, d);
  }
  function f(d) {
    me.call(this, r, d);
  }
  function c(d) {
    me.call(this, r, d);
  }
  return r.$$set = (d) => {
    "shape" in d && t(0, a = d.shape), "computedStyle" in d && t(1, o = d.computedStyle), "transform" in d && t(2, s = d.transform), "viewportScale" in d && t(6, u = d.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*shape*/
    1 && t(4, i = a.geometry), r.$$.dirty & /*viewportScale*/
    64 && t(3, n = 10 / u);
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
class Tb extends Vt {
  constructor(e) {
    super(), jt(this, e, Eb, bb, Ht, {
      shape: 0,
      computedStyle: 1,
      transform: 2,
      viewportScale: 6
    });
  }
}
function xb(r) {
  let e, t, i, n, a, o, s, u, h, l, f, c, d, p, v, _, y, g, m, E, b, x, S, A, w, P, O, M, D, C, R, F, z, ot, Z, B, I, X, $, J, _t, K, lt, mt, St, et, at, ut, dt, Q;
  return {
    c() {
      e = st("rect"), s = Gt(), u = st("rect"), d = Gt(), p = st("rect"), g = Gt(), m = st("rect"), S = Gt(), A = st("rect"), M = Gt(), D = st("rect"), z = Gt(), ot = st("rect"), I = Gt(), X = st("rect"), _t = Gt(), K = st("rect"), St = Gt(), et = st("rect"), T(e, "class", "a9s-outer"), T(e, "style", t = /*computedStyle*/
      r[1] ? "display:none;" : void 0), T(e, "x", i = /*geom*/
      r[4].x), T(e, "y", n = /*geom*/
      r[4].y), T(e, "width", a = /*geom*/
      r[4].w), T(e, "height", o = /*geom*/
      r[4].h), T(u, "class", "a9s-inner a9s-shape-handle"), T(
        u,
        "style",
        /*computedStyle*/
        r[1]
      ), T(u, "x", h = /*geom*/
      r[4].x), T(u, "y", l = /*geom*/
      r[4].y), T(u, "width", f = /*geom*/
      r[4].w), T(u, "height", c = /*geom*/
      r[4].h), T(p, "class", "a9s-edge-handle a9s-edge-handle-top"), T(p, "x", v = /*geom*/
      r[4].x), T(p, "y", _ = /*geom*/
      r[4].y), T(p, "height", 1), T(p, "width", y = /*geom*/
      r[4].w), T(m, "class", "a9s-edge-handle a9s-edge-handle-right"), T(m, "x", E = /*geom*/
      r[4].x + /*geom*/
      r[4].w), T(m, "y", b = /*geom*/
      r[4].y), T(m, "height", x = /*geom*/
      r[4].h), T(m, "width", 1), T(A, "class", "a9s-edge-handle a9s-edge-handle-bottom"), T(A, "x", w = /*geom*/
      r[4].x), T(A, "y", P = /*geom*/
      r[4].y + /*geom*/
      r[4].h), T(A, "height", 1), T(A, "width", O = /*geom*/
      r[4].w), T(D, "class", "a9s-edge-handle a9s-edge-handle-left"), T(D, "x", C = /*geom*/
      r[4].x), T(D, "y", R = /*geom*/
      r[4].y), T(D, "height", F = /*geom*/
      r[4].h), T(D, "width", 1), T(ot, "class", "a9s-corner-handle a9s-corner-handle-topleft"), T(ot, "x", Z = /*geom*/
      r[4].x - /*handleSize*/
      r[3] / 2), T(ot, "y", B = /*geom*/
      r[4].y - /*handleSize*/
      r[3] / 2), T(
        ot,
        "height",
        /*handleSize*/
        r[3]
      ), T(
        ot,
        "width",
        /*handleSize*/
        r[3]
      ), T(X, "class", "a9s-corner-handle a9s-corner-handle-topright"), T(X, "x", $ = /*geom*/
      r[4].x + /*geom*/
      r[4].w - /*handleSize*/
      r[3] / 2), T(X, "y", J = /*geom*/
      r[4].y - /*handleSize*/
      r[3] / 2), T(
        X,
        "height",
        /*handleSize*/
        r[3]
      ), T(
        X,
        "width",
        /*handleSize*/
        r[3]
      ), T(K, "class", "a9s-corner-handle a9s-corner-handle-bottomright"), T(K, "x", lt = /*geom*/
      r[4].x + /*geom*/
      r[4].w - /*handleSize*/
      r[3] / 2), T(K, "y", mt = /*geom*/
      r[4].y + /*geom*/
      r[4].h - /*handleSize*/
      r[3] / 2), T(
        K,
        "height",
        /*handleSize*/
        r[3]
      ), T(
        K,
        "width",
        /*handleSize*/
        r[3]
      ), T(et, "class", "a9s-corner-handle a9s-corner-handle-bottomleft"), T(et, "x", at = /*geom*/
      r[4].x - /*handleSize*/
      r[3] / 2), T(et, "y", ut = /*geom*/
      r[4].y + /*geom*/
      r[4].h - /*handleSize*/
      r[3] / 2), T(
        et,
        "height",
        /*handleSize*/
        r[3]
      ), T(
        et,
        "width",
        /*handleSize*/
        r[3]
      );
    },
    m(q, L) {
      V(q, e, L), V(q, s, L), V(q, u, L), V(q, d, L), V(q, p, L), V(q, g, L), V(q, m, L), V(q, S, L), V(q, A, L), V(q, M, L), V(q, D, L), V(q, z, L), V(q, ot, L), V(q, I, L), V(q, X, L), V(q, _t, L), V(q, K, L), V(q, St, L), V(q, et, L), dt || (Q = [
        Pt(e, "pointerdown", function() {
          xt(
            /*grab*/
            r[10](G.SHAPE)
          ) && r[10](G.SHAPE).apply(this, arguments);
        }),
        Pt(u, "pointerdown", function() {
          xt(
            /*grab*/
            r[10](G.SHAPE)
          ) && r[10](G.SHAPE).apply(this, arguments);
        }),
        Pt(p, "pointerdown", function() {
          xt(
            /*grab*/
            r[10](G.TOP)
          ) && r[10](G.TOP).apply(this, arguments);
        }),
        Pt(m, "pointerdown", function() {
          xt(
            /*grab*/
            r[10](G.RIGHT)
          ) && r[10](G.RIGHT).apply(this, arguments);
        }),
        Pt(A, "pointerdown", function() {
          xt(
            /*grab*/
            r[10](G.BOTTOM)
          ) && r[10](G.BOTTOM).apply(this, arguments);
        }),
        Pt(D, "pointerdown", function() {
          xt(
            /*grab*/
            r[10](G.LEFT)
          ) && r[10](G.LEFT).apply(this, arguments);
        }),
        Pt(ot, "pointerdown", function() {
          xt(
            /*grab*/
            r[10](G.TOP_LEFT)
          ) && r[10](G.TOP_LEFT).apply(this, arguments);
        }),
        Pt(X, "pointerdown", function() {
          xt(
            /*grab*/
            r[10](G.TOP_RIGHT)
          ) && r[10](G.TOP_RIGHT).apply(this, arguments);
        }),
        Pt(K, "pointerdown", function() {
          xt(
            /*grab*/
            r[10](G.BOTTOM_RIGHT)
          ) && r[10](G.BOTTOM_RIGHT).apply(this, arguments);
        }),
        Pt(et, "pointerdown", function() {
          xt(
            /*grab*/
            r[10](G.BOTTOM_LEFT)
          ) && r[10](G.BOTTOM_LEFT).apply(this, arguments);
        })
      ], dt = !0);
    },
    p(q, L) {
      r = q, L & /*computedStyle*/
      2 && t !== (t = /*computedStyle*/
      r[1] ? "display:none;" : void 0) && T(e, "style", t), L & /*geom*/
      16 && i !== (i = /*geom*/
      r[4].x) && T(e, "x", i), L & /*geom*/
      16 && n !== (n = /*geom*/
      r[4].y) && T(e, "y", n), L & /*geom*/
      16 && a !== (a = /*geom*/
      r[4].w) && T(e, "width", a), L & /*geom*/
      16 && o !== (o = /*geom*/
      r[4].h) && T(e, "height", o), L & /*computedStyle*/
      2 && T(
        u,
        "style",
        /*computedStyle*/
        r[1]
      ), L & /*geom*/
      16 && h !== (h = /*geom*/
      r[4].x) && T(u, "x", h), L & /*geom*/
      16 && l !== (l = /*geom*/
      r[4].y) && T(u, "y", l), L & /*geom*/
      16 && f !== (f = /*geom*/
      r[4].w) && T(u, "width", f), L & /*geom*/
      16 && c !== (c = /*geom*/
      r[4].h) && T(u, "height", c), L & /*geom*/
      16 && v !== (v = /*geom*/
      r[4].x) && T(p, "x", v), L & /*geom*/
      16 && _ !== (_ = /*geom*/
      r[4].y) && T(p, "y", _), L & /*geom*/
      16 && y !== (y = /*geom*/
      r[4].w) && T(p, "width", y), L & /*geom*/
      16 && E !== (E = /*geom*/
      r[4].x + /*geom*/
      r[4].w) && T(m, "x", E), L & /*geom*/
      16 && b !== (b = /*geom*/
      r[4].y) && T(m, "y", b), L & /*geom*/
      16 && x !== (x = /*geom*/
      r[4].h) && T(m, "height", x), L & /*geom*/
      16 && w !== (w = /*geom*/
      r[4].x) && T(A, "x", w), L & /*geom*/
      16 && P !== (P = /*geom*/
      r[4].y + /*geom*/
      r[4].h) && T(A, "y", P), L & /*geom*/
      16 && O !== (O = /*geom*/
      r[4].w) && T(A, "width", O), L & /*geom*/
      16 && C !== (C = /*geom*/
      r[4].x) && T(D, "x", C), L & /*geom*/
      16 && R !== (R = /*geom*/
      r[4].y) && T(D, "y", R), L & /*geom*/
      16 && F !== (F = /*geom*/
      r[4].h) && T(D, "height", F), L & /*geom, handleSize*/
      24 && Z !== (Z = /*geom*/
      r[4].x - /*handleSize*/
      r[3] / 2) && T(ot, "x", Z), L & /*geom, handleSize*/
      24 && B !== (B = /*geom*/
      r[4].y - /*handleSize*/
      r[3] / 2) && T(ot, "y", B), L & /*handleSize*/
      8 && T(
        ot,
        "height",
        /*handleSize*/
        r[3]
      ), L & /*handleSize*/
      8 && T(
        ot,
        "width",
        /*handleSize*/
        r[3]
      ), L & /*geom, handleSize*/
      24 && $ !== ($ = /*geom*/
      r[4].x + /*geom*/
      r[4].w - /*handleSize*/
      r[3] / 2) && T(X, "x", $), L & /*geom, handleSize*/
      24 && J !== (J = /*geom*/
      r[4].y - /*handleSize*/
      r[3] / 2) && T(X, "y", J), L & /*handleSize*/
      8 && T(
        X,
        "height",
        /*handleSize*/
        r[3]
      ), L & /*handleSize*/
      8 && T(
        X,
        "width",
        /*handleSize*/
        r[3]
      ), L & /*geom, handleSize*/
      24 && lt !== (lt = /*geom*/
      r[4].x + /*geom*/
      r[4].w - /*handleSize*/
      r[3] / 2) && T(K, "x", lt), L & /*geom, handleSize*/
      24 && mt !== (mt = /*geom*/
      r[4].y + /*geom*/
      r[4].h - /*handleSize*/
      r[3] / 2) && T(K, "y", mt), L & /*handleSize*/
      8 && T(
        K,
        "height",
        /*handleSize*/
        r[3]
      ), L & /*handleSize*/
      8 && T(
        K,
        "width",
        /*handleSize*/
        r[3]
      ), L & /*geom, handleSize*/
      24 && at !== (at = /*geom*/
      r[4].x - /*handleSize*/
      r[3] / 2) && T(et, "x", at), L & /*geom, handleSize*/
      24 && ut !== (ut = /*geom*/
      r[4].y + /*geom*/
      r[4].h - /*handleSize*/
      r[3] / 2) && T(et, "y", ut), L & /*handleSize*/
      8 && T(
        et,
        "height",
        /*handleSize*/
        r[3]
      ), L & /*handleSize*/
      8 && T(
        et,
        "width",
        /*handleSize*/
        r[3]
      );
    },
    d(q) {
      q && (j(e), j(s), j(u), j(d), j(p), j(g), j(m), j(S), j(A), j(M), j(D), j(z), j(ot), j(I), j(X), j(_t), j(K), j(St), j(et)), dt = !1, Te(Q);
    }
  };
}
function wb(r) {
  let e, t;
  return e = new Io({
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
          xb,
          ({ grab: i }) => ({ 10: i }),
          ({ grab: i }) => i ? 1024 : 0
        ]
      },
      $$scope: { ctx: r }
    }
  }), e.$on(
    "grab",
    /*grab_handler*/
    r[7]
  ), e.$on(
    "change",
    /*change_handler*/
    r[8]
  ), e.$on(
    "release",
    /*release_handler*/
    r[9]
  ), {
    c() {
      re(e.$$.fragment);
    },
    m(i, n) {
      zt(e, i, n), t = !0;
    },
    p(i, [n]) {
      const a = {};
      n & /*shape*/
      1 && (a.shape = /*shape*/
      i[0]), n & /*transform*/
      4 && (a.transform = /*transform*/
      i[2]), n & /*$$scope, geom, handleSize, grab, computedStyle*/
      3098 && (a.$$scope = { dirty: n, ctx: i }), e.$set(a);
    },
    i(i) {
      t || (nt(e.$$.fragment, i), t = !0);
    },
    o(i) {
      ct(e.$$.fragment, i), t = !1;
    },
    d(i) {
      Wt(e, i);
    }
  };
}
function Sb(r, e, t) {
  let i, n, { shape: a } = e, { computedStyle: o = void 0 } = e, { transform: s } = e, { viewportScale: u = 1 } = e;
  const h = (d, p, v) => {
    const _ = d.geometry.bounds;
    let [y, g] = [_.minX, _.minY], [m, E] = [_.maxX, _.maxY];
    const [b, x] = v;
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
    me.call(this, r, d);
  }
  function f(d) {
    me.call(this, r, d);
  }
  function c(d) {
    me.call(this, r, d);
  }
  return r.$$set = (d) => {
    "shape" in d && t(0, a = d.shape), "computedStyle" in d && t(1, o = d.computedStyle), "transform" in d && t(2, s = d.transform), "viewportScale" in d && t(6, u = d.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*shape*/
    1 && t(4, i = a.geometry), r.$$.dirty & /*viewportScale*/
    64 && t(3, n = 10 / u);
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
class Pb extends Vt {
  constructor(e) {
    super(), jt(this, e, Sb, wb, Ht, {
      shape: 0,
      computedStyle: 1,
      transform: 2,
      viewportScale: 6
    });
  }
}
function Ab(r) {
  let e, t, i, n, a, o, s, u, h, l, f, c, d, p, v, _, y, g, m, E, b, x, S, A, w, P, O, M, D;
  return {
    c() {
      e = st("ellipse"), o = Gt(), s = st("ellipse"), c = Gt(), d = st("rect"), _ = Gt(), y = st("rect"), E = Gt(), b = st("rect"), A = Gt(), w = st("rect"), T(e, "class", "a9s-outer"), T(e, "cx", t = /*geom*/
      r[3].cx), T(e, "cy", i = /*geom*/
      r[3].cy), T(e, "rx", n = /*geom*/
      r[3].rx), T(e, "ry", a = /*geom*/
      r[3].ry), T(s, "class", "a9s-inner a9s-shape-handle"), T(s, "cx", u = /*geom*/
      r[3].cx), T(s, "cy", h = /*geom*/
      r[3].cy), T(s, "rx", l = /*geom*/
      r[3].rx), T(s, "ry", f = /*geom*/
      r[3].ry), T(d, "class", "a9s-corner-handle a9s-corner-top"), T(d, "x", p = /*geom*/
      r[3].cx - /*handleSize*/
      r[2] / 2), T(d, "y", v = /*geom*/
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
    m(C, R) {
      V(C, e, R), V(C, o, R), V(C, s, R), V(C, c, R), V(C, d, R), V(C, _, R), V(C, y, R), V(C, E, R), V(C, b, R), V(C, A, R), V(C, w, R), M || (D = [
        Pt(e, "pointerdown", function() {
          xt(
            /*grab*/
            r[9](G.SHAPE)
          ) && r[9](G.SHAPE).apply(this, arguments);
        }),
        Pt(s, "pointerdown", function() {
          xt(
            /*grab*/
            r[9](G.SHAPE)
          ) && r[9](G.SHAPE).apply(this, arguments);
        }),
        Pt(d, "pointerdown", function() {
          xt(
            /*grab*/
            r[9](G.TOP)
          ) && r[9](G.TOP).apply(this, arguments);
        }),
        Pt(y, "pointerdown", function() {
          xt(
            /*grab*/
            r[9](G.RIGHT)
          ) && r[9](G.RIGHT).apply(this, arguments);
        }),
        Pt(b, "pointerdown", function() {
          xt(
            /*grab*/
            r[9](G.BOTTOM)
          ) && r[9](G.BOTTOM).apply(this, arguments);
        }),
        Pt(w, "pointerdown", function() {
          xt(
            /*grab*/
            r[9](G.LEFT)
          ) && r[9](G.LEFT).apply(this, arguments);
        })
      ], M = !0);
    },
    p(C, R) {
      r = C, R & /*geom*/
      8 && t !== (t = /*geom*/
      r[3].cx) && T(e, "cx", t), R & /*geom*/
      8 && i !== (i = /*geom*/
      r[3].cy) && T(e, "cy", i), R & /*geom*/
      8 && n !== (n = /*geom*/
      r[3].rx) && T(e, "rx", n), R & /*geom*/
      8 && a !== (a = /*geom*/
      r[3].ry) && T(e, "ry", a), R & /*geom*/
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
      12 && v !== (v = /*geom*/
      r[3].cy - /*handleSize*/
      r[2] / 2 - /*geom*/
      r[3].ry) && T(d, "y", v), R & /*handleSize*/
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
    d(C) {
      C && (j(e), j(o), j(s), j(c), j(d), j(_), j(y), j(E), j(b), j(A), j(w)), M = !1, Te(D);
    }
  };
}
function Rb(r) {
  let e, t;
  return e = new Io({
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
          Ab,
          ({ grab: i }) => ({ 9: i }),
          ({ grab: i }) => i ? 512 : 0
        ]
      },
      $$scope: { ctx: r }
    }
  }), e.$on(
    "grab",
    /*grab_handler*/
    r[6]
  ), e.$on(
    "change",
    /*change_handler*/
    r[7]
  ), e.$on(
    "release",
    /*release_handler*/
    r[8]
  ), {
    c() {
      re(e.$$.fragment);
    },
    m(i, n) {
      zt(e, i, n), t = !0;
    },
    p(i, [n]) {
      const a = {};
      n & /*shape*/
      1 && (a.shape = /*shape*/
      i[0]), n & /*transform*/
      2 && (a.transform = /*transform*/
      i[1]), n & /*$$scope, geom, handleSize, grab*/
      1548 && (a.$$scope = { dirty: n, ctx: i }), e.$set(a);
    },
    i(i) {
      t || (nt(e.$$.fragment, i), t = !0);
    },
    o(i) {
      ct(e.$$.fragment, i), t = !1;
    },
    d(i) {
      Wt(e, i);
    }
  };
}
function Ob(r, e, t) {
  let i, n, { shape: a } = e, { transform: o } = e, { viewportScale: s = 1 } = e;
  const u = (c, d, p) => {
    const v = c.geometry.bounds;
    let [_, y] = [v.minX, v.minY], [g, m] = [v.maxX, v.maxY];
    const [E, b] = p;
    if (d === G.SHAPE)
      _ += E, g += E, y += b, m += b;
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
          _ += E;
          break;
        }
        case G.RIGHT: {
          g += E;
          break;
        }
      }
    const x = Math.min(_, g), S = Math.min(y, m), A = Math.abs(g - _), w = Math.abs(m - y), P = (_ + g) / 2, O = (y + m) / 2, M = A / 2, D = w / 2;
    return {
      ...c,
      geometry: {
        ...c.geometry,
        cx: P,
        cy: O,
        rx: M,
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
    me.call(this, r, c);
  }
  function l(c) {
    me.call(this, r, c);
  }
  function f(c) {
    me.call(this, r, c);
  }
  return r.$$set = (c) => {
    "shape" in c && t(0, a = c.shape), "transform" in c && t(1, o = c.transform), "viewportScale" in c && t(5, s = c.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*shape*/
    1 && t(3, i = a.geometry), r.$$.dirty & /*viewportScale*/
    32 && t(2, n = 10 / s);
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
class Ib extends Vt {
  constructor(e) {
    super(), jt(this, e, Ob, Rb, Ht, { shape: 0, transform: 1, viewportScale: 5 });
  }
}
le.RECTANGLE, le.POLYGON, le.ELLIPSE;
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
const Cb = (r) => ({}), Pu = (r) => ({ grab: (
  /*onGrab*/
  r[0]
) });
function Mb(r) {
  let e, t, i, n;
  const a = (
    /*#slots*/
    r[7].default
  ), o = ku(
    a,
    r,
    /*$$scope*/
    r[6],
    Pu
  );
  return {
    c() {
      e = st("g"), o && o.c(), T(e, "class", "a9s-annotation selected");
    },
    m(s, u) {
      V(s, e, u), o && o.m(e, null), t = !0, i || (n = [
        Pt(
          e,
          "pointerup",
          /*onRelease*/
          r[2]
        ),
        Pt(
          e,
          "pointermove",
          /*onPointerMove*/
          r[1]
        )
      ], i = !0);
    },
    p(s, [u]) {
      o && o.p && (!t || u & /*$$scope*/
      64) && ju(
        o,
        a,
        s,
        /*$$scope*/
        s[6],
        t ? Xu(
          a,
          /*$$scope*/
          s[6],
          u,
          Cb
        ) : Vu(
          /*$$scope*/
          s[6]
        ),
        Pu
      );
    },
    i(s) {
      t || (nt(o, s), t = !0);
    },
    o(s) {
      ct(o, s), t = !1;
    },
    d(s) {
      s && j(e), o && o.d(s), i = !1, Te(n);
    }
  };
}
function Db(r, e, t) {
  let { $$slots: i = {}, $$scope: n } = e;
  const a = vn();
  let { shape: o } = e, { editor: s } = e, { transform: u } = e, h = null, l, f = null;
  const c = (v) => (_) => {
    h = v, l = u.elementToImage(_.offsetX, _.offsetY), f = o, _.target.setPointerCapture(_.pointerId), a("grab");
  }, d = (v) => {
    if (h) {
      const [_, y] = u.elementToImage(v.offsetX, v.offsetY), g = [_ - l[0], y - l[1]];
      t(3, o = s(f, h, g)), a("change", o);
    }
  }, p = (v) => {
    v.target.releasePointerCapture(v.pointerId), h = null, f = o, a("release");
  };
  return r.$$set = (v) => {
    "shape" in v && t(3, o = v.shape), "editor" in v && t(4, s = v.editor), "transform" in v && t(5, u = v.transform), "$$scope" in v && t(6, n = v.$$scope);
  }, [c, d, p, o, s, u, n, i];
}
class Io extends Vt {
  constructor(e) {
    super(), jt(this, e, Db, Mb, Ht, { shape: 3, editor: 4, transform: 5 });
  }
}
const Fb = (r, e) => {
  const t = typeof e == "function" ? e(r) : e;
  if (t) {
    const { fill: i, fillOpacity: n } = t;
    let a = "";
    return i && (a += `fill:${i};stroke:${i};`), a += `fill-opacity:${n || "0.25"};`, a;
  }
};
function Nb(r, e, t) {
  let i;
  const n = vn();
  let { annotation: a } = e, { editor: o } = e, { style: s = void 0 } = e, { target: u } = e, { transform: h } = e, { viewportScale: l } = e, f;
  return pn(() => (t(6, f = new o({
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
    "annotation" in c && t(0, a = c.annotation), "editor" in c && t(1, o = c.editor), "style" in c && t(2, s = c.style), "target" in c && t(3, u = c.target), "transform" in c && t(4, h = c.transform), "viewportScale" in c && t(5, l = c.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*annotation, style*/
    5 && (i = Fb(a, s)), r.$$.dirty & /*annotation, editorComponent*/
    65 && a && (f == null || f.$set({ shape: a.target.selector })), r.$$.dirty & /*editorComponent, transform*/
    80 && f && f.$set({ transform: h }), r.$$.dirty & /*editorComponent, viewportScale*/
    96 && f && f.$set({ viewportScale: l });
  }, [a, o, s, u, h, l, f];
}
class Bb extends Vt {
  constructor(e) {
    super(), jt(this, e, Nb, null, Ht, {
      annotation: 0,
      editor: 1,
      style: 2,
      target: 3,
      transform: 4,
      viewportScale: 5
    });
  }
}
const Lb = (r) => {
  let e, t;
  if (r.nodeName === "CANVAS")
    e = r, t = e.getContext("2d", { willReadFrequently: !0 });
  else {
    const n = r;
    e = document.createElement("canvas"), e.width = n.width, e.height = n.height, t = e.getContext("2d", { willReadFrequently: !0 }), t.drawImage(n, 0, 0, n.width, n.height);
  }
  let i = 0;
  for (let n = 1; n < 10; n++)
    for (let a = 1; a < 10; a++) {
      const o = Math.round(a * e.width / 10), s = Math.round(n * e.height / 10), u = t.getImageData(o, s, 1, 1).data, h = (0.299 * u[0] + 0.587 * u[1] + 0.114 * u[2]) / 255;
      i += h;
    }
  return i / 81;
}, Ub = (r) => {
  const e = Lb(r), t = e > 0.6 ? "dark" : "light";
  return console.log(`[Annotorious] Image brightness: ${e.toFixed(1)}. Setting ${t} theme.`), t;
};
navigator.userAgent.indexOf("Mac OS X");
const Gb = 1733608, kb = 0.25;
let Ae = !1, so;
const uo = (r) => {
  const e = {
    tint: r != null && r.fill ? an(r.fill) : Gb,
    alpha: (r == null ? void 0 : r.fillOpacity) === void 0 ? kb : Math.min(r.fillOpacity, 1)
  }, t = {
    tint: (r == null ? void 0 : r.stroke) && an(r.stroke),
    alpha: (r == null ? void 0 : r.strokeOpacity) === void 0 ? r.stroke ? 1 : 0 : Math.min(r.strokeOpacity, 1),
    lineWidth: r != null && r.stroke ? (r == null ? void 0 : r.strokeWidth) || 1 : 0
  };
  return { fillStyle: e, strokeStyle: t };
}, Co = (r) => (e, t, i) => {
  const { fillStyle: n, strokeStyle: a } = uo(i), o = new nr();
  o.beginFill(16777215), r(t, o), o.endFill(), o.tint = n.tint, o.alpha = n.alpha, e.addChild(o);
  const s = new nr();
  return s.lineStyle(a.lineWidth / so, 16777215, 1, 0.5, a.lineWidth === 1), r(t, s), s.tint = a.tint, s.alpha = a.alpha, e.addChild(s), { fill: o, stroke: s, strokeWidth: a.lineWidth };
}, Hb = Co((r, e) => {
  const { cx: t, cy: i, rx: n, ry: a } = r.geometry;
  e.drawEllipse(t, i, n, a);
}), Xb = Co((r, e) => {
  const t = r.geometry.points.reduce((i, n) => [...i, ...n], []);
  e.drawPolygon(t);
}), jb = Co((r, e) => {
  const { x: t, y: i, w: n, h: a } = r.geometry;
  e.drawRect(t, i, n, a);
}), Vb = (r, e, t, i) => () => {
  const n = r.viewport.viewportToImageRectangle(r.viewport.getBounds(!0)), a = r.viewport.getContainerSize().x, s = r.viewport.getZoom(!0) * a / r.world.getContentFactor();
  s !== so && !Ae && (Ae = !0, t.forEach(({ stroke: d, strokeWidth: p }) => {
    const { lineStyle: v } = d.geometry.graphicsData[0];
    p > 1 ? (Ae = !1, v.width = p / s, d.geometry.invalidate()) : p === 1 && !v.native && (v.width = 1, v.native = !0, d.geometry.invalidate());
  })), so = s;
  const u = Math.PI * r.viewport.getRotation() / 180, h = -n.x * s, l = -n.y * s;
  let f, c;
  u > 0 && u <= Math.PI / 2 ? (f = n.height * s, c = 0) : u > Math.PI / 2 && u <= Math.PI ? (f = n.width * s, c = n.height * s) : u > Math.PI && u <= Math.PI * 1.5 ? (f = 0, c = n.width * s) : (f = 0, c = 0), e.position.x = f + h * Math.cos(u) - l * Math.sin(u), e.position.y = c + h * Math.sin(u) + l * Math.cos(u), e.scale.set(s, s), e.rotation = u, i.render(e);
}, zb = (r, e) => {
  const t = new nr(), i = kh({
    width: e.width,
    height: e.height,
    backgroundAlpha: 0,
    view: e,
    antialias: !0,
    resolution: 2
  }), n = /* @__PURE__ */ new Map();
  let a = /* @__PURE__ */ new Set(), o;
  const s = (v) => {
    Ae = !1;
    const { selector: _ } = v.target, y = typeof o == "function" ? o(v) : o;
    let g;
    _.type === le.RECTANGLE ? g = jb(t, _, y) : _.type === le.POLYGON ? g = Xb(t, _, y) : _.type === le.ELLIPSE ? g = Hb(t, _, y) : console.warn(`Unsupported shape type: ${_.type}`), g && n.set(v.id, { annotation: v, ...g });
  }, u = (v) => {
    const _ = n.get(v.id);
    _ && (n.delete(v.id), _.fill.destroy(), _.stroke.destroy());
  }, h = (v, _) => {
    Ae = !1;
    const y = n.get(v.id);
    y && (n.delete(v.id), y.fill.destroy(), y.stroke.destroy(), s(_));
  }, l = (v, _) => {
    i.resize(v, _), i.render(t);
  }, f = (v) => {
    Ae = !1;
    const { children: _ } = t;
    n.forEach(({ fill: y, stroke: g, annotation: m }) => {
      const E = v ? a.has(m.id) || v(m) : !0;
      E && !_.includes(y) ? (t.addChild(y), t.addChild(g)) : !E && _.includes(y) && (t.removeChild(y), t.removeChild(g));
    }), i.render(t);
  }, c = (v) => {
    const { selected: _ } = v;
    a = new Set(_.map((y) => y.id));
  }, d = (v) => {
    if (typeof v == "function")
      n.forEach(({ annotation: _, fill: y, stroke: g, strokeWidth: m }, E) => {
        m > 1 && (Ae = !1);
        const { fillStyle: b, strokeStyle: x } = uo(v(_));
        y.tint = b.tint, y.alpha = b.alpha, g.tint = x.tint, g.alpha = x.alpha, n.set(_.id, { annotation: _, fill: y, stroke: g, strokeWidth: m });
      });
    else {
      const { fillStyle: _, strokeStyle: y } = uo(v);
      y.lineWidth > 1 && (Ae = !1), n.forEach(({ annotation: g, fill: m, stroke: E, strokeWidth: b }, x) => {
        m.tint = _.tint, m.alpha = _.alpha, E.tint = y.tint, E.alpha = y.alpha, n.set(g.id, { annotation: g, fill: m, stroke: E, strokeWidth: b });
      });
    }
    o = v, i.render(t);
  };
  return {
    addAnnotation: s,
    destroy: () => i.destroy(),
    redraw: Vb(r, t, n, i),
    removeAnnotation: u,
    resize: l,
    setFilter: f,
    setSelected: c,
    setStyle: d,
    updateAnnotation: h
  };
};
function Wb(r, e, t) {
  let i, n, { filter: a = void 0 } = e, { state: o } = e, { style: s = void 0 } = e, { viewer: u } = e;
  const { store: h, hover: l, selection: f, viewport: c } = o;
  fa(r, l, (b) => t(10, i = b)), fa(r, f, (b) => t(7, n = b));
  const d = vn();
  let p, v = !1;
  const _ = (b) => {
    const x = new qi.Point(b.x, b.y), { x: S, y: A } = u.viewport.pointFromPixel(x);
    return u.viewport.viewportToImageCoordinates(S, A);
  }, y = (b) => (x) => {
    const { x: S, y: A } = _(new qi.Point(x.offsetX, x.offsetY)), w = h.getAt(S, A);
    w && (!a || a(w)) ? (b.classList.add("hover"), i !== w.id && l.set(w.id)) : (b.classList.remove("hover"), i && l.set(null));
  }, g = (b) => {
    const x = b.originalEvent;
    if (!v) {
      const { x: S, y: A } = _(b.position), w = h.getAt(S, A);
      w ? d("click", { originalEvent: x, annotation: w }) : d("click", { originalEvent: x });
    }
    v = !1;
  }, m = () => v = !0;
  let E;
  return pn(() => {
    const { offsetWidth: b, offsetHeight: x } = u.canvas, S = document.createElement("canvas");
    S.width = b, S.height = x, S.className = "a9s-gl-canvas", u.element.querySelector(".openseadragon-canvas").appendChild(S), t(6, p = zb(u, S));
    const A = y(S);
    S.addEventListener("pointermove", A), new ResizeObserver((O) => {
      try {
        const { width: M, height: D } = O[0].contentRect;
        S.width = M, S.height = D, p.resize(M, D);
      } catch {
        console.warn("WebGL canvas already disposed");
      }
    }).observe(S);
    const P = () => {
      const O = u.viewport.getBounds();
      E = u.viewport.viewportToImageRectangle(O);
      const { x: M, y: D, width: C, height: R } = E, F = h.getIntersecting(M, D, C, R);
      c.set(F.map((z) => z.id));
    };
    return u.addHandler("canvas-drag", m), u.addHandler("canvas-release", g), u.addHandler("update-viewport", p.redraw), u.addHandler("animation-finish", P), () => {
      S.removeEventListener("pointermove", A), u.removeHandler("canvas-drag", m), u.removeHandler("canvas-release", g), u.removeHandler("update-viewport", p.redraw), u.removeHandler("animation-finish", P), p.destroy(), S.parentNode.removeChild(S);
    };
  }), h.observe((b) => {
    const { created: x, updated: S, deleted: A } = b.changes;
    if (x.forEach((w) => p.addAnnotation(w)), S.forEach(({ oldValue: w, newValue: P }) => p.updateAnnotation(w, P)), A.forEach((w) => p.removeAnnotation(w)), E) {
      const { x: w, y: P, width: O, height: M } = E, D = h.getIntersecting(w, P, O, M);
      c.set(D.map((C) => C.id));
    } else
      c.set(h.all().map((w) => w.id));
    p.redraw();
  }), r.$$set = (b) => {
    "filter" in b && t(2, a = b.filter), "state" in b && t(3, o = b.state), "style" in b && t(4, s = b.style), "viewer" in b && t(5, u = b.viewer);
  }, r.$$.update = () => {
    r.$$.dirty & /*stage, filter*/
    68 && (p == null || p.setFilter(a)), r.$$.dirty & /*stage, $selection*/
    192 && (p == null || p.setSelected(n)), r.$$.dirty & /*stage, style*/
    80 && (p == null || p.setStyle(s));
  }, [l, f, a, o, s, u, p, n];
}
class Yb extends Vt {
  constructor(e) {
    super(), jt(this, e, Wb, null, Ht, { filter: 2, state: 3, style: 4, viewer: 5 });
  }
}
const qb = (r) => ({
  transform: r & /*layerTransform*/
  2,
  scale: r & /*scale*/
  1
}), Au = (r) => ({
  transform: (
    /*layerTransform*/
    r[1]
  ),
  scale: (
    /*scale*/
    r[0]
  )
});
function Kb(r) {
  let e;
  const t = (
    /*#slots*/
    r[4].default
  ), i = ku(
    t,
    r,
    /*$$scope*/
    r[3],
    Au
  );
  return {
    c() {
      i && i.c();
    },
    m(n, a) {
      i && i.m(n, a), e = !0;
    },
    p(n, [a]) {
      i && i.p && (!e || a & /*$$scope, layerTransform, scale*/
      11) && ju(
        i,
        t,
        n,
        /*$$scope*/
        n[3],
        e ? Xu(
          t,
          /*$$scope*/
          n[3],
          a,
          qb
        ) : Vu(
          /*$$scope*/
          n[3]
        ),
        Au
      );
    },
    i(n) {
      e || (nt(i, n), e = !0);
    },
    o(n) {
      ct(i, n), e = !1;
    },
    d(n) {
      i && i.d(n);
    }
  };
}
function Zb(r, e, t) {
  let { $$slots: i = {}, $$scope: n } = e, { viewer: a } = e, o = 1, s;
  const u = () => {
    const h = a.viewport.getContainerSize().x, l = a.viewport.getZoom(!0), f = a.viewport.getFlip(), c = a.viewport.pixelFromPoint(new qi.Point(0, 0), !0);
    f && (c.x = h - c.x);
    const d = l * h / a.world.getContentFactor(), p = f ? -d : d, v = a.viewport.getRotation();
    t(1, s = `translate(${c.x}, ${c.y}) scale(${p}, ${d}) rotate(${v})`), t(0, o = l * h / a.world.getContentFactor());
  };
  return pn(() => (a.addHandler("update-viewport", u), () => {
    a.removeHandler("update-viewport", u);
  })), r.$$set = (h) => {
    "viewer" in h && t(2, a = h.viewer), "$$scope" in h && t(3, n = h.$$scope);
  }, [o, s, a, n, i];
}
class il extends Vt {
  constructor(e) {
    super(), jt(this, e, Zb, Kb, Ht, { viewer: 2 });
  }
}
function $b(r, e, t) {
  const i = vn();
  let { drawingMode: n } = e, { target: a } = e, { tool: o } = e, { transform: s } = e, { viewer: u } = e, { viewportScale: h } = e, l;
  return pn(() => {
    const f = a.closest("svg"), c = [], d = (p, v, _) => {
      if (f.addEventListener(p, v, _), c.push(() => f.removeEventListener(p, v, _)), p === "pointerup" || p === "dblclick") {
        const y = (m) => {
          const { originalEvent: E } = m;
          v(E);
        }, g = p === "pointerup" ? "canvas-click" : "canvas-double-click";
        u.addHandler(g, y), c.push(() => u.removeHandler(g, y));
      } else if (p === "pointermove") {
        const y = (g) => {
          const { originalEvent: m } = g;
          v(m);
        };
        u.addHandler("canvas-drag", y), c.push(() => u.removeHandler("canvas-drag", y));
      }
    };
    return t(6, l = new o({
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
    "drawingMode" in f && t(0, n = f.drawingMode), "target" in f && t(1, a = f.target), "tool" in f && t(2, o = f.tool), "transform" in f && t(3, s = f.transform), "viewer" in f && t(4, u = f.viewer), "viewportScale" in f && t(5, h = f.viewportScale);
  }, r.$$.update = () => {
    r.$$.dirty & /*toolComponent, transform*/
    72 && l && l.$set({ transform: s }), r.$$.dirty & /*toolComponent, viewportScale*/
    96 && l && l.$set({ viewportScale: h });
  }, [n, a, o, s, u, h, l];
}
class Qb extends Vt {
  constructor(e) {
    super(), jt(this, e, $b, null, Ht, {
      drawingMode: 0,
      target: 1,
      tool: 2,
      transform: 3,
      viewer: 4,
      viewportScale: 5
    });
  }
}
function Ru(r, e, t) {
  const i = r.slice();
  return i[24] = e[t], i;
}
function Jb(r) {
  let e = (
    /*toolName*/
    r[1]
  ), t, i, n = Ou(r);
  return {
    c() {
      n.c(), t = ar();
    },
    m(a, o) {
      n.m(a, o), V(a, t, o), i = !0;
    },
    p(a, o) {
      o & /*toolName*/
      2 && Ht(e, e = /*toolName*/
      a[1]) ? (Fe(), ct(n, 1, 1, Me), Ne(), n = Ou(a), n.c(), nt(n, 1), n.m(t.parentNode, t)) : n.p(a, o);
    },
    i(a) {
      i || (nt(n), i = !0);
    },
    o(a) {
      ct(n), i = !1;
    },
    d(a) {
      a && j(t), n.d(a);
    }
  };
}
function tE(r) {
  let e, t, i = Pr(
    /*editableAnnotations*/
    r[5]
  ), n = [];
  for (let o = 0; o < i.length; o += 1)
    n[o] = Cu(Ru(r, i, o));
  const a = (o) => ct(n[o], 1, 1, () => {
    n[o] = null;
  });
  return {
    c() {
      for (let o = 0; o < n.length; o += 1)
        n[o].c();
      e = ar();
    },
    m(o, s) {
      for (let u = 0; u < n.length; u += 1)
        n[u] && n[u].m(o, s);
      V(o, e, s), t = !0;
    },
    p(o, s) {
      if (s & /*editableAnnotations, drawingEl, toolTransform, scale, onGrab, onChangeSelected, onRelease*/
      8392496) {
        i = Pr(
          /*editableAnnotations*/
          o[5]
        );
        let u;
        for (u = 0; u < i.length; u += 1) {
          const h = Ru(o, i, u);
          n[u] ? (n[u].p(h, s), nt(n[u], 1)) : (n[u] = Cu(h), n[u].c(), nt(n[u], 1), n[u].m(e.parentNode, e));
        }
        for (Fe(), u = i.length; u < n.length; u += 1)
          a(u);
        Ne();
      }
    },
    i(o) {
      if (!t) {
        for (let s = 0; s < i.length; s += 1)
          nt(n[s]);
        t = !0;
      }
    },
    o(o) {
      n = n.filter(Boolean);
      for (let s = 0; s < n.length; s += 1)
        ct(n[s]);
      t = !1;
    },
    d(o) {
      o && j(e), lo(n, o);
    }
  };
}
function Ou(r) {
  let e, t;
  return e = new Qb({
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
  }), e.$on(
    "create",
    /*onSelectionCreated*/
    r[12]
  ), {
    c() {
      re(e.$$.fragment);
    },
    m(i, n) {
      zt(e, i, n), t = !0;
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
      i[23]), e.$set(a);
    },
    i(i) {
      t || (nt(e.$$.fragment, i), t = !0);
    },
    o(i) {
      ct(e.$$.fragment, i), t = !1;
    },
    d(i) {
      Wt(e, i);
    }
  };
}
function Iu(r) {
  let e, t;
  return e = new Bb({
    props: {
      target: (
        /*drawingEl*/
        r[4]
      ),
      editor: Bo(
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
  }), e.$on(
    "grab",
    /*onGrab*/
    r[9]
  ), e.$on("change", function() {
    xt(
      /*onChangeSelected*/
      r[11](
        /*editable*/
        r[24]
      )
    ) && r[11](
      /*editable*/
      r[24]
    ).apply(this, arguments);
  }), e.$on(
    "release",
    /*onRelease*/
    r[10]
  ), {
    c() {
      re(e.$$.fragment);
    },
    m(i, n) {
      zt(e, i, n), t = !0;
    },
    p(i, n) {
      r = i;
      const a = {};
      n & /*drawingEl*/
      16 && (a.target = /*drawingEl*/
      r[4]), n & /*editableAnnotations*/
      32 && (a.editor = Bo(
        /*editable*/
        r[24].target.selector
      )), n & /*editableAnnotations*/
      32 && (a.annotation = /*editable*/
      r[24]), n & /*scale*/
      8388608 && (a.viewportScale = /*scale*/
      r[23]), e.$set(a);
    },
    i(i) {
      t || (nt(e.$$.fragment, i), t = !0);
    },
    o(i) {
      ct(e.$$.fragment, i), t = !1;
    },
    d(i) {
      Wt(e, i);
    }
  };
}
function Cu(r) {
  let e = (
    /*editable*/
    r[24].id
  ), t, i, n = Iu(r);
  return {
    c() {
      n.c(), t = ar();
    },
    m(a, o) {
      n.m(a, o), V(a, t, o), i = !0;
    },
    p(a, o) {
      o & /*editableAnnotations*/
      32 && Ht(e, e = /*editable*/
      a[24].id) ? (Fe(), ct(n, 1, 1, Me), Ne(), n = Iu(a), n.c(), nt(n, 1), n.m(t.parentNode, t)) : n.p(a, o);
    },
    i(a) {
      i || (nt(n), i = !0);
    },
    o(a) {
      ct(n), i = !1;
    },
    d(a) {
      a && j(t), n.d(a);
    }
  };
}
function eE(r) {
  let e, t, i, n, a, o;
  const s = [tE, Jb], u = [];
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
      e = st("svg"), t = st("g"), n && n.c(), T(t, "transform", a = /*transform*/
      r[22]), T(t, "class", "svelte-190cqdf"), T(e, "class", "a9s-annotationlayer a9s-osd-drawinglayer svelte-190cqdf"), ko(
        e,
        "drawing",
        /*drawingEnabled*/
        r[0]
      );
    },
    m(l, f) {
      V(l, e, f), Ze(e, t), ~i && u[i].m(t, null), r[18](t), o = !0;
    },
    p(l, f) {
      let c = i;
      i = h(l), i === c ? ~i && u[i].p(l, f) : (n && (Fe(), ct(u[c], 1, 1, () => {
        u[c] = null;
      }), Ne()), ~i ? (n = u[i], n ? n.p(l, f) : (n = u[i] = s[i](l), n.c()), nt(n, 1), n.m(t, null)) : n = null), (!o || f & /*transform*/
      4194304 && a !== (a = /*transform*/
      l[22])) && T(t, "transform", a), (!o || f & /*drawingEnabled*/
      1) && ko(
        e,
        "drawing",
        /*drawingEnabled*/
        l[0]
      );
    },
    i(l) {
      o || (nt(n), o = !0);
    },
    o(l) {
      ct(n), o = !1;
    },
    d(l) {
      l && j(e), ~i && u[i].d(), r[18](null);
    }
  };
}
function rE(r) {
  let e, t;
  return e = new il({
    props: {
      viewer: (
        /*viewer*/
        r[2]
      ),
      $$slots: {
        default: [
          eE,
          ({ transform: i, scale: n }) => ({ 22: i, 23: n }),
          ({ transform: i, scale: n }) => (i ? 4194304 : 0) | (n ? 8388608 : 0)
        ]
      },
      $$scope: { ctx: r }
    }
  }), {
    c() {
      re(e.$$.fragment);
    },
    m(i, n) {
      zt(e, i, n), t = !0;
    },
    p(i, [n]) {
      const a = {};
      n & /*viewer*/
      4 && (a.viewer = /*viewer*/
      i[2]), n & /*$$scope, drawingEnabled, transform, drawingEl, editableAnnotations, scale, toolName, tool, drawingMode, viewer*/
      146800767 && (a.$$scope = { dirty: n, ctx: i }), e.$set(a);
    },
    i(i) {
      t || (nt(e.$$.fragment, i), t = !0);
    },
    o(i) {
      ct(e.$$.fragment, i), t = !1;
    },
    d(i) {
      Wt(e, i);
    }
  };
}
function iE(r, e, t) {
  let i, n, a, o, { drawingEnabled: s } = e, { preferredDrawingMode: u } = e, { state: h } = e, { toolName: l = ha().length > 0 ? ha()[0] : void 0 } = e, { user: f } = e, { viewer: c } = e, d;
  const { store: p, selection: v } = h;
  fa(r, v, (w) => t(17, o = w));
  let _ = null, y = null;
  const g = (w) => {
    p.unobserve(_);
    const P = w.filter(({ editable: O }) => O).map(({ id: O }) => O);
    P.length > 0 ? (t(5, y = P.map((O) => p.getAnnotation(O))), _ = (O) => {
      const { updated: M } = O.changes;
      t(5, y = M.map((D) => D.newValue));
    }, p.observe(_, { annotations: P })) : t(5, y = null);
  }, m = (w, P) => {
    const { x: O, y: M } = c.viewport.viewerElementToImageCoordinates(new qi.Point(w, P));
    return [O, M];
  }, E = () => c.setMouseNavEnabled(!1), b = () => c.setMouseNavEnabled(!0), x = (w) => (P) => {
    var C;
    const { target: O } = w, M = 10 * 60 * 1e3, D = ((C = O.creator) == null ? void 0 : C.id) !== f.id || !O.created || (/* @__PURE__ */ new Date()).getTime() - O.created.getTime() > M;
    p.updateTarget({
      ...O,
      selector: P.detail,
      created: D ? O.created : /* @__PURE__ */ new Date(),
      updated: D ? /* @__PURE__ */ new Date() : null,
      updatedBy: D ? f : null
    });
  }, S = (w) => {
    const P = gb(), O = {
      id: P,
      bodies: [],
      target: {
        annotation: P,
        selector: w.detail,
        creator: f,
        created: /* @__PURE__ */ new Date()
      }
    };
    p.addAnnotation(O), v.setSelected(O.id), c.setMouseNavEnabled(!0);
  };
  function A(w) {
    Ki[w ? "unshift" : "push"](() => {
      d = w, t(4, d);
    });
  }
  return r.$$set = (w) => {
    "drawingEnabled" in w && t(0, s = w.drawingEnabled), "preferredDrawingMode" in w && t(13, u = w.preferredDrawingMode), "state" in w && t(14, h = w.state), "toolName" in w && t(1, l = w.toolName), "user" in w && t(15, f = w.user), "viewer" in w && t(2, c = w.viewer);
  }, r.$$.update = () => {
    r.$$.dirty & /*toolName*/
    2 && t(6, { tool: i, opts: n } = Uu(l), i, (t(16, n), t(1, l))), r.$$.dirty & /*opts, preferredDrawingMode*/
    73728 && t(3, a = (n == null ? void 0 : n.drawingMode) || u), r.$$.dirty & /*drawingEnabled, drawingMode, viewer*/
    13 && (s && a === "drag" ? c.setMouseNavEnabled(!1) : c.setMouseNavEnabled(!0)), r.$$.dirty & /*drawingEnabled*/
    1 && s && v.clear(), r.$$.dirty & /*$selection, drawingMode, drawingEnabled, viewer*/
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
    v,
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
class nE extends Vt {
  constructor(e) {
    super(), jt(this, e, iE, rE, Ht, {
      drawingEnabled: 0,
      preferredDrawingMode: 13,
      state: 14,
      toolName: 1,
      user: 15,
      viewer: 2
    });
  }
}
function aE(r) {
  let e, t, i, n, a, o, s, u = (
    /*user*/
    r[2].appearance.label + ""
  ), h, l, f, c;
  return {
    c() {
      e = st("g"), t = st("rect"), s = st("text"), h = fo(u), T(t, "class", "a9s-presence-label-bg svelte-1rehw2p"), T(
        t,
        "x",
        /*x*/
        r[0]
      ), T(t, "y", i = /*y*/
      r[1] - 18 / /*scale*/
      r[3]), T(t, "height", n = 18 / /*scale*/
      r[3]), T(t, "fill", a = /*user*/
      r[2].appearance.color), T(t, "stroke", o = /*user*/
      r[2].appearance.color), T(s, "font-size", l = 12 / /*scale*/
      r[3]), T(s, "x", f = /*x*/
      r[0] + Math.round(5 / /*scale*/
      r[3])), T(s, "y", c = /*y*/
      r[1] - 5 / /*scale*/
      r[3]), T(s, "class", "svelte-1rehw2p"), T(e, "class", "a9s-presence-label");
    },
    m(d, p) {
      V(d, e, p), Ze(e, t), Ze(e, s), Ze(s, h), r[6](e);
    },
    p(d, [p]) {
      p & /*x*/
      1 && T(
        t,
        "x",
        /*x*/
        d[0]
      ), p & /*y, scale*/
      10 && i !== (i = /*y*/
      d[1] - 18 / /*scale*/
      d[3]) && T(t, "y", i), p & /*scale*/
      8 && n !== (n = 18 / /*scale*/
      d[3]) && T(t, "height", n), p & /*user*/
      4 && a !== (a = /*user*/
      d[2].appearance.color) && T(t, "fill", a), p & /*user*/
      4 && o !== (o = /*user*/
      d[2].appearance.color) && T(t, "stroke", o), p & /*user*/
      4 && u !== (u = /*user*/
      d[2].appearance.label + "") && zl(h, u), p & /*scale*/
      8 && l !== (l = 12 / /*scale*/
      d[3]) && T(s, "font-size", l), p & /*x, scale*/
      9 && f !== (f = /*x*/
      d[0] + Math.round(5 / /*scale*/
      d[3])) && T(s, "x", f), p & /*y, scale*/
      10 && c !== (c = /*y*/
      d[1] - 5 / /*scale*/
      d[3]) && T(s, "y", c);
    },
    i: Me,
    o: Me,
    d(d) {
      d && j(e), r[6](null);
    }
  };
}
function oE(r, e, t) {
  let { x: i } = e, { y: n } = e, { user: a } = e, { scale: o } = e, { hAlign: s = null } = e, u;
  const h = (f) => {
    const c = u.querySelector("text"), d = u.querySelector("rect"), p = c.getBBox().width + 10 / f;
    s === "CENTER" && u.setAttribute("style", `transform: translateX(-${p / 2}px)`), d.setAttribute("width", `${p}`);
  };
  function l(f) {
    Ki[f ? "unshift" : "push"](() => {
      u = f, t(4, u);
    });
  }
  return r.$$set = (f) => {
    "x" in f && t(0, i = f.x), "y" in f && t(1, n = f.y), "user" in f && t(2, a = f.user), "scale" in f && t(3, o = f.scale), "hAlign" in f && t(5, s = f.hAlign);
  }, r.$$.update = () => {
    r.$$.dirty & /*g, scale*/
    24 && u && h(o);
  }, [i, n, a, o, u, s, l];
}
class nl extends Vt {
  constructor(e) {
    super(), jt(this, e, oE, aE, Ht, { x: 0, y: 1, user: 2, scale: 3, hAlign: 5 });
  }
}
function sE(r) {
  let e, t, i, n, a, o;
  return t = new nl({
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
      e = st("g"), re(t.$$.fragment), i = st("polygon"), T(i, "class", "a9s-presence-shape a9s-presence-polygon svelte-fgq4n0"), T(i, "stroke", n = /*user*/
      r[0].appearance.color), T(i, "fill", "transparent"), T(i, "points", a = /*geom*/
      r[2].points.map(Mu).join(" ")), T(e, "class", "a9s-presence-overlay");
    },
    m(s, u) {
      V(s, e, u), zt(t, e, null), Ze(e, i), o = !0;
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
      s[3][1]), t.$set(h), (!o || u & /*user*/
      1 && n !== (n = /*user*/
      s[0].appearance.color)) && T(i, "stroke", n), (!o || u & /*geom*/
      4 && a !== (a = /*geom*/
      s[2].points.map(Mu).join(" "))) && T(i, "points", a);
    },
    i(s) {
      o || (nt(t.$$.fragment, s), o = !0);
    },
    o(s) {
      ct(t.$$.fragment, s), o = !1;
    },
    d(s) {
      s && j(e), Wt(t);
    }
  };
}
const Mu = (r) => r.join(",");
function uE(r, e, t) {
  let i, n, { annotation: a } = e, { user: o } = e, { scale: s } = e;
  const u = (h) => {
    let [l, ...f] = h.points;
    return f.forEach(([c, d]) => {
      d < l[1] && (l = [c, d]);
    }), l;
  };
  return r.$$set = (h) => {
    "annotation" in h && t(4, a = h.annotation), "user" in h && t(0, o = h.user), "scale" in h && t(1, s = h.scale);
  }, r.$$.update = () => {
    r.$$.dirty & /*annotation*/
    16 && t(2, i = a.target.selector.geometry), r.$$.dirty & /*geom*/
    4 && t(3, n = u(i));
  }, [o, s, i, n, a];
}
class hE extends Vt {
  constructor(e) {
    super(), jt(this, e, uE, sE, Ht, { annotation: 4, user: 0, scale: 1 });
  }
}
function lE(r) {
  let e, t, i, n, a, o, s, u, h;
  return t = new nl({
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
      e = st("g"), re(t.$$.fragment), i = st("rect"), T(i, "class", "a9s-presence-shape a9s-presence-rectangle svelte-gze948"), T(i, "stroke", n = /*user*/
      r[0].appearance.color), T(i, "fill", "transparent"), T(i, "x", a = /*geom*/
      r[2].x), T(i, "y", o = /*geom*/
      r[2].y), T(i, "width", s = /*geom*/
      r[2].w), T(i, "height", u = /*geom*/
      r[2].h), T(e, "class", "a9s-presence-overlay");
    },
    m(l, f) {
      V(l, e, f), zt(t, e, null), Ze(e, i), h = !0;
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
      l[2].y), t.$set(c), (!h || f & /*user*/
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
      h || (nt(t.$$.fragment, l), h = !0);
    },
    o(l) {
      ct(t.$$.fragment, l), h = !1;
    },
    d(l) {
      l && j(e), Wt(t);
    }
  };
}
function fE(r, e, t) {
  let i, { annotation: n } = e, { user: a } = e, { scale: o } = e;
  return r.$$set = (s) => {
    "annotation" in s && t(3, n = s.annotation), "user" in s && t(0, a = s.user), "scale" in s && t(1, o = s.scale);
  }, r.$$.update = () => {
    r.$$.dirty & /*annotation*/
    8 && t(2, i = n.target.selector.geometry);
  }, [a, o, i, n];
}
class cE extends Vt {
  constructor(e) {
    super(), jt(this, e, fE, lE, Ht, { annotation: 3, user: 0, scale: 1 });
  }
}
const { Boolean: dE } = jl;
function Du(r, e, t) {
  const i = r.slice();
  return i[8] = e[t], i;
}
function Fu(r) {
  let e, t;
  return e = new il({
    props: {
      viewer: (
        /*viewer*/
        r[0]
      ),
      $$slots: {
        default: [
          _E,
          ({ transform: i, scale: n }) => ({ 6: i, 7: n }),
          ({ transform: i, scale: n }) => (i ? 64 : 0) | (n ? 128 : 0)
        ]
      },
      $$scope: { ctx: r }
    }
  }), {
    c() {
      re(e.$$.fragment);
    },
    m(i, n) {
      zt(e, i, n), t = !0;
    },
    p(i, n) {
      const a = {};
      n & /*viewer*/
      1 && (a.viewer = /*viewer*/
      i[0]), n & /*$$scope, transform, trackedAnnotations, scale*/
      2244 && (a.$$scope = { dirty: n, ctx: i }), e.$set(a);
    },
    i(i) {
      t || (nt(e.$$.fragment, i), t = !0);
    },
    o(i) {
      ct(e.$$.fragment, i), t = !1;
    },
    d(i) {
      Wt(e, i);
    }
  };
}
function Nu(r) {
  let e, t, i = Pr(
    /*trackedAnnotations*/
    r[2]
  ), n = [];
  for (let o = 0; o < i.length; o += 1)
    n[o] = Bu(Du(r, i, o));
  const a = (o) => ct(n[o], 1, 1, () => {
    n[o] = null;
  });
  return {
    c() {
      for (let o = 0; o < n.length; o += 1)
        n[o].c();
      e = ar();
    },
    m(o, s) {
      for (let u = 0; u < n.length; u += 1)
        n[u] && n[u].m(o, s);
      V(o, e, s), t = !0;
    },
    p(o, s) {
      if (s & /*trackedAnnotations, scale*/
      132) {
        i = Pr(
          /*trackedAnnotations*/
          o[2]
        );
        let u;
        for (u = 0; u < i.length; u += 1) {
          const h = Du(o, i, u);
          n[u] ? (n[u].p(h, s), nt(n[u], 1)) : (n[u] = Bu(h), n[u].c(), nt(n[u], 1), n[u].m(e.parentNode, e));
        }
        for (Fe(), u = i.length; u < n.length; u += 1)
          a(u);
        Ne();
      }
    },
    i(o) {
      if (!t) {
        for (let s = 0; s < i.length; s += 1)
          nt(n[s]);
        t = !0;
      }
    },
    o(o) {
      n = n.filter(dE);
      for (let s = 0; s < n.length; s += 1)
        ct(n[s]);
      t = !1;
    },
    d(o) {
      o && j(e), lo(n, o);
    }
  };
}
function pE(r) {
  let e, t;
  return e = new hE({
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
      re(e.$$.fragment);
    },
    m(i, n) {
      zt(e, i, n), t = !0;
    },
    p(i, n) {
      const a = {};
      n & /*trackedAnnotations*/
      4 && (a.annotation = /*tracked*/
      i[8].annotation), n & /*trackedAnnotations*/
      4 && (a.user = /*tracked*/
      i[8].selectedBy), n & /*scale*/
      128 && (a.scale = /*scale*/
      i[7]), e.$set(a);
    },
    i(i) {
      t || (nt(e.$$.fragment, i), t = !0);
    },
    o(i) {
      ct(e.$$.fragment, i), t = !1;
    },
    d(i) {
      Wt(e, i);
    }
  };
}
function vE(r) {
  let e, t;
  return e = new cE({
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
      re(e.$$.fragment);
    },
    m(i, n) {
      zt(e, i, n), t = !0;
    },
    p(i, n) {
      const a = {};
      n & /*trackedAnnotations*/
      4 && (a.annotation = /*tracked*/
      i[8].annotation), n & /*trackedAnnotations*/
      4 && (a.user = /*tracked*/
      i[8].selectedBy), n & /*scale*/
      128 && (a.scale = /*scale*/
      i[7]), e.$set(a);
    },
    i(i) {
      t || (nt(e.$$.fragment, i), t = !0);
    },
    o(i) {
      ct(e.$$.fragment, i), t = !1;
    },
    d(i) {
      Wt(e, i);
    }
  };
}
function Bu(r) {
  let e, t, i, n;
  const a = [vE, pE], o = [];
  function s(u, h) {
    return (
      /*tracked*/
      u[8].annotation.target.selector.type === la.RECTANGLE ? 0 : (
        /*tracked*/
        u[8].annotation.target.selector.type === la.POLYGON ? 1 : -1
      )
    );
  }
  return ~(e = s(r)) && (t = o[e] = a[e](r)), {
    c() {
      t && t.c(), i = ar();
    },
    m(u, h) {
      ~e && o[e].m(u, h), V(u, i, h), n = !0;
    },
    p(u, h) {
      let l = e;
      e = s(u), e === l ? ~e && o[e].p(u, h) : (t && (Fe(), ct(o[l], 1, 1, () => {
        o[l] = null;
      }), Ne()), ~e ? (t = o[e], t ? t.p(u, h) : (t = o[e] = a[e](u), t.c()), nt(t, 1), t.m(i.parentNode, i)) : t = null);
    },
    i(u) {
      n || (nt(t), n = !0);
    },
    o(u) {
      ct(t), n = !1;
    },
    d(u) {
      u && j(i), ~e && o[e].d(u);
    }
  };
}
function _E(r) {
  let e, t, i, n, a = (
    /*trackedAnnotations*/
    r[2].length > 0 && Nu(r)
  );
  return {
    c() {
      e = st("svg"), t = st("g"), a && a.c(), T(t, "transform", i = /*transform*/
      r[6]), T(e, "class", "a9s-osd-presencelayer svelte-1krwc4m");
    },
    m(o, s) {
      V(o, e, s), Ze(e, t), a && a.m(t, null), n = !0;
    },
    p(o, s) {
      /*trackedAnnotations*/
      o[2].length > 0 ? a ? (a.p(o, s), s & /*trackedAnnotations*/
      4 && nt(a, 1)) : (a = Nu(o), a.c(), nt(a, 1), a.m(t, null)) : a && (Fe(), ct(a, 1, 1, () => {
        a = null;
      }), Ne()), (!n || s & /*transform*/
      64 && i !== (i = /*transform*/
      o[6])) && T(t, "transform", i);
    },
    i(o) {
      n || (nt(a), n = !0);
    },
    o(o) {
      ct(a), n = !1;
    },
    d(o) {
      o && j(e), a && a.d();
    }
  };
}
function yE(r) {
  let e = !!/*provider*/
  r[1], t, i, n = e && Fu(r);
  return {
    c() {
      n && n.c(), t = ar();
    },
    m(a, o) {
      n && n.m(a, o), V(a, t, o), i = !0;
    },
    p(a, [o]) {
      o & /*provider*/
      2 && (e = !!/*provider*/
      a[1]), e ? n ? (n.p(a, o), o & /*provider*/
      2 && nt(n, 1)) : (n = Fu(a), n.c(), nt(n, 1), n.m(t.parentNode, t)) : n && (Fe(), ct(n, 1, 1, () => {
        n = null;
      }), Ne());
    },
    i(a) {
      i || (nt(n), i = !0);
    },
    o(a) {
      ct(n), i = !1;
    },
    d(a) {
      a && j(t), n && n.d(a);
    }
  };
}
function gE(r, e, t) {
  let { store: i } = e, { viewer: n } = e, { provider: a = null } = e, o = [], s = null;
  const u = (h, l) => {
    t(2, o = [
      ...o.filter(({ selectedBy: f }) => f.presenceKey !== h.presenceKey),
      ...(l || []).map((f) => ({
        // Warning - could be undefined!
        annotation: i.getAnnotation(f),
        selectedBy: h
      }))
    ].filter(({ annotation: f }) => (f || console.warn("Selection event on unknown annotation"), !!f))), s && i.unobserve(s), s = (f) => {
      const { deleted: c, updated: d } = f.changes, p = new Set(c.map((_) => _.id)), v = o.filter(({ annotation: _ }) => !p.has(_.id)).map((_) => {
        const y = d.find((g) => g.oldValue.id === _.annotation.id);
        return y ? {
          selectedBy: _.selectedBy,
          annotation: y.newValue
        } : _;
      });
      t(2, o = v);
    }, i.observe(s, {
      annotations: o.map((f) => f.annotation.id)
    });
  };
  return Yl(() => {
    s && i.unobserve(s);
  }), r.$$set = (h) => {
    "store" in h && t(3, i = h.store), "viewer" in h && t(0, n = h.viewer), "provider" in h && t(1, a = h.provider);
  }, r.$$.update = () => {
    r.$$.dirty & /*provider*/
    2 && a && a.on("selectionChange", u);
  }, [n, a, o, i];
}
class mE extends Vt {
  constructor(e) {
    super(), jt(this, e, gE, yE, Ht, { store: 3, viewer: 0, provider: 1 });
  }
}
const Lu = (r, e) => {
  e === "auto" ? r.addHandler("open", (t) => {
    const i = r.world.getItemCount();
    r.world.getItemAt(i - 1).addOnceHandler("fully-loaded-change", (a) => {
      const { fullyLoaded: o } = a;
      if (o) {
        const s = r.canvas.querySelector("canvas"), u = Ub(s);
        r.element.setAttribute("data-theme", u);
      }
    });
  }) : r.element.setAttribute("data-theme", e);
}, al = (r, e, t) => (i, n = {}) => {
  const a = typeof i == "string" ? i : i.id, o = e.getAnnotation(a);
  if (!o)
    return;
  const s = r.container.getBoundingClientRect(), { padding: u } = n;
  let [h, l, f, c] = u ? Array.isArray(u) ? u : [u, u, u, u] : [0, 0, 0, 0];
  h = h / s.height, l = l / s.width, f = f / s.height, c = c / s.width;
  const { minX: d, minY: p, maxX: v, maxY: _ } = o.target.selector.geometry.bounds, y = v - d, g = _ - p, m = d - c * y, E = p - h * g, b = y + (l + c) * y, x = g + (h + f) * g, S = r.viewport.imageToViewportRectangle(m, E, b, x);
  r.viewport[t](S, n.immediately);
}, bE = (r, e) => al(r, e, "fitBounds"), EE = (r, e) => al(r, e, "fitBoundsWithConstraints"), SE = (r, e = {}) => {
  const t = ul(e, {
    drawingEnabled: !1,
    drawingMode: "click",
    pointerSelectAction: ho.EDIT,
    theme: "light"
  }), i = hl(t), { hover: n, selection: a, store: o } = i, s = Ol(o), u = Il(
    i,
    s,
    t.adapter,
    t.autoSave
  );
  let h = Ll(), l = t.drawingEnabled, f = t.drawingMode;
  const c = ll(s, r.element), d = new Yb({
    target: r.element,
    props: {
      state: i,
      viewer: r,
      filter: void 0,
      style: t.style
    }
  }), p = new mE({
    target: r.element.querySelector(".openseadragon-canvas"),
    props: {
      store: o,
      viewer: r,
      provider: null
    }
  }), v = new nE({
    target: r.element.querySelector(".openseadragon-canvas"),
    props: {
      drawingEnabled: l,
      preferredDrawingMode: f,
      state: i,
      toolName: "",
      user: h,
      viewer: r
    }
  });
  d.$on("click", (C) => {
    const { originalEvent: R, annotation: F } = C.detail;
    F && !(f === "click" && l) ? a.clickSelect(F.id, R) : a.isEmpty() || a.clear();
  }), r.element.addEventListener("pointerdown", (C) => {
    if (n.current) {
      const R = o.getAnnotation(n.current);
      u.emit("clickAnnotation", R, C);
    }
  }), Lu(r, t.theme);
  const _ = Ml(i, s, t.adapter), y = () => {
    d.$destroy(), p.$destroy(), v.$destroy(), c.destroy(), s.destroy();
  }, g = bE(r, o), m = EE(r, o), E = () => h, b = (C, R, F) => fl(C, R, F), x = (C, R) => cl(C, R), S = (C) => {
    if (!Uu(C))
      throw `No drawing tool named ${C}`;
    v.$set({ toolName: C });
  }, A = (C) => {
    l = C, v.$set({ drawingEnabled: l });
  }, w = (C) => d.$set({ filter: C }), P = (C) => d.$set({ style: C }), O = (C) => p.$set({ provider: C }), M = (C) => Lu(r, C), D = (C) => {
    h = C, v.$set({ user: C });
  };
  return {
    ..._,
    destroy: y,
    fitBounds: g,
    fitBoundsWithConstraints: m,
    getUser: E,
    listDrawingTools: ha,
    on: u.on,
    off: u.off,
    registerDrawingTool: b,
    registerShapeEditor: x,
    setDrawingEnabled: A,
    setDrawingTool: S,
    setFilter: w,
    setPresenceProvider: O,
    setStyle: P,
    setTheme: M,
    setUser: D,
    state: i,
    viewer: r
  };
}, PE = Gl, AE = ho, RE = bl, OE = dl, IE = la, CE = pl;
export {
  AE as PointerSelectAction,
  IE as ShapeType,
  CE as W3CImageFormat,
  RE as createBody,
  OE as createImageAnnotator,
  SE as createOSDAnnotator,
  PE as defaultColorProvider
};
//# sourceMappingURL=annotorious-openseadragon.es.js.map
