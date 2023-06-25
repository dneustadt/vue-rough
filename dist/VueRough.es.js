import { ref as H, onMounted as Mt, openBlock as kt, createElementBlock as yt, renderSlot as bt, createCommentVNode as xt } from "vue";
function tt(r, e, s) {
  if (r && r.length) {
    const [t, n] = e, a = Math.PI / 180 * s, h = Math.cos(a), o = Math.sin(a);
    r.forEach((c) => {
      const [p, i] = c;
      c[0] = (p - t) * h - (i - n) * o + t, c[1] = (p - t) * o + (i - n) * h + n;
    });
  }
}
function Y(r) {
  const e = r[0], s = r[1];
  return Math.sqrt(Math.pow(e[0] - s[0], 2) + Math.pow(e[1] - s[1], 2));
}
function j(r, e) {
  const s = e.hachureAngle + 90;
  let t = e.hachureGap;
  t < 0 && (t = 4 * e.strokeWidth), t = Math.max(t, 0.1);
  const n = [0, 0];
  if (s)
    for (const h of r)
      tt(h, n, s);
  const a = function(h, o) {
    const c = [];
    for (const u of h) {
      const l = [...u];
      l[0].join(",") !== l[l.length - 1].join(",") && l.push([l[0][0], l[0][1]]), l.length > 2 && c.push(l);
    }
    const p = [];
    o = Math.max(o, 0.1);
    const i = [];
    for (const u of c)
      for (let l = 0; l < u.length - 1; l++) {
        const m = u[l], g = u[l + 1];
        if (m[1] !== g[1]) {
          const M = Math.min(m[1], g[1]);
          i.push({ ymin: M, ymax: Math.max(m[1], g[1]), x: M === m[1] ? m[0] : g[0], islope: (g[0] - m[0]) / (g[1] - m[1]) });
        }
      }
    if (i.sort((u, l) => u.ymin < l.ymin ? -1 : u.ymin > l.ymin ? 1 : u.x < l.x ? -1 : u.x > l.x ? 1 : u.ymax === l.ymax ? 0 : (u.ymax - l.ymax) / Math.abs(u.ymax - l.ymax)), !i.length)
      return p;
    let d = [], f = i[0].ymin;
    for (; d.length || i.length; ) {
      if (i.length) {
        let u = -1;
        for (let l = 0; l < i.length && !(i[l].ymin > f); l++)
          u = l;
        i.splice(0, u + 1).forEach((l) => {
          d.push({ s: f, edge: l });
        });
      }
      if (d = d.filter((u) => !(u.edge.ymax <= f)), d.sort((u, l) => u.edge.x === l.edge.x ? 0 : (u.edge.x - l.edge.x) / Math.abs(u.edge.x - l.edge.x)), d.length > 1)
        for (let u = 0; u < d.length; u += 2) {
          const l = u + 1;
          if (l >= d.length)
            break;
          const m = d[u].edge, g = d[l].edge;
          p.push([[Math.round(m.x), f], [Math.round(g.x), f]]);
        }
      f += o, d.forEach((u) => {
        u.edge.x = u.edge.x + o * u.edge.islope;
      });
    }
    return p;
  }(r, t);
  if (s) {
    for (const h of r)
      tt(h, n, -s);
    (function(h, o, c) {
      const p = [];
      h.forEach((i) => p.push(...i)), tt(p, o, c);
    })(a, n, -s);
  }
  return a;
}
class at {
  constructor(e) {
    this.helper = e;
  }
  fillPolygons(e, s) {
    return this._fillPolygons(e, s);
  }
  _fillPolygons(e, s) {
    const t = j(e, s);
    return { type: "fillSketch", ops: this.renderLines(t, s) };
  }
  renderLines(e, s) {
    const t = [];
    for (const n of e)
      t.push(...this.helper.doubleLineOps(n[0][0], n[0][1], n[1][0], n[1][1], s));
    return t;
  }
}
class Rt extends at {
  fillPolygons(e, s) {
    let t = s.hachureGap;
    t < 0 && (t = 4 * s.strokeWidth), t = Math.max(t, 0.1);
    const n = j(e, Object.assign({}, s, { hachureGap: t })), a = Math.PI / 180 * s.hachureAngle, h = [], o = 0.5 * t * Math.cos(a), c = 0.5 * t * Math.sin(a);
    for (const [p, i] of n)
      Y([p, i]) && h.push([[p[0] - o, p[1] + c], [...i]], [[p[0] + o, p[1] - c], [...i]]);
    return { type: "fillSketch", ops: this.renderLines(h, s) };
  }
}
class $t extends at {
  fillPolygons(e, s) {
    const t = this._fillPolygons(e, s), n = Object.assign({}, s, { hachureAngle: s.hachureAngle + 90 }), a = this._fillPolygons(e, n);
    return t.ops = t.ops.concat(a.ops), t;
  }
}
class At {
  constructor(e) {
    this.helper = e;
  }
  fillPolygons(e, s) {
    const t = j(e, s = Object.assign({}, s, { hachureAngle: 0 }));
    return this.dotsOnLines(t, s);
  }
  dotsOnLines(e, s) {
    const t = [];
    let n = s.hachureGap;
    n < 0 && (n = 4 * s.strokeWidth), n = Math.max(n, 0.1);
    let a = s.fillWeight;
    a < 0 && (a = s.strokeWidth / 2);
    const h = n / 4;
    for (const o of e) {
      const c = Y(o), p = c / n, i = Math.ceil(p) - 1, d = c - i * n, f = (o[0][0] + o[1][0]) / 2 - n / 4, u = Math.min(o[0][1], o[1][1]);
      for (let l = 0; l < i; l++) {
        const m = u + d + l * n, g = f - h + 2 * Math.random() * h, M = m - h + 2 * Math.random() * h, y = this.helper.ellipse(g, M, a, a, s);
        t.push(...y.ops);
      }
    }
    return { type: "fillSketch", ops: t };
  }
}
class Nt {
  constructor(e) {
    this.helper = e;
  }
  fillPolygons(e, s) {
    const t = j(e, s);
    return { type: "fillSketch", ops: this.dashedLine(t, s) };
  }
  dashedLine(e, s) {
    const t = s.dashOffset < 0 ? s.hachureGap < 0 ? 4 * s.strokeWidth : s.hachureGap : s.dashOffset, n = s.dashGap < 0 ? s.hachureGap < 0 ? 4 * s.strokeWidth : s.hachureGap : s.dashGap, a = [];
    return e.forEach((h) => {
      const o = Y(h), c = Math.floor(o / (t + n)), p = (o + n - c * (t + n)) / 2;
      let i = h[0], d = h[1];
      i[0] > d[0] && (i = h[1], d = h[0]);
      const f = Math.atan((d[1] - i[1]) / (d[0] - i[0]));
      for (let u = 0; u < c; u++) {
        const l = u * (t + n), m = l + t, g = [i[0] + l * Math.cos(f) + p * Math.cos(f), i[1] + l * Math.sin(f) + p * Math.sin(f)], M = [i[0] + m * Math.cos(f) + p * Math.cos(f), i[1] + m * Math.sin(f) + p * Math.sin(f)];
        a.push(...this.helper.doubleLineOps(g[0], g[1], M[0], M[1], s));
      }
    }), a;
  }
}
class Ct {
  constructor(e) {
    this.helper = e;
  }
  fillPolygons(e, s) {
    const t = s.hachureGap < 0 ? 4 * s.strokeWidth : s.hachureGap, n = s.zigzagOffset < 0 ? t : s.zigzagOffset, a = j(e, s = Object.assign({}, s, { hachureGap: t + n }));
    return { type: "fillSketch", ops: this.zigzagLines(a, n, s) };
  }
  zigzagLines(e, s, t) {
    const n = [];
    return e.forEach((a) => {
      const h = Y(a), o = Math.round(h / (2 * s));
      let c = a[0], p = a[1];
      c[0] > p[0] && (c = a[1], p = a[0]);
      const i = Math.atan((p[1] - c[1]) / (p[0] - c[0]));
      for (let d = 0; d < o; d++) {
        const f = 2 * d * s, u = 2 * (d + 1) * s, l = Math.sqrt(2 * Math.pow(s, 2)), m = [c[0] + f * Math.cos(i), c[1] + f * Math.sin(i)], g = [c[0] + u * Math.cos(i), c[1] + u * Math.sin(i)], M = [m[0] + l * Math.cos(i + Math.PI / 4), m[1] + l * Math.sin(i + Math.PI / 4)];
        n.push(...this.helper.doubleLineOps(m[0], m[1], M[0], M[1], t), ...this.helper.doubleLineOps(M[0], M[1], g[0], g[1], t));
      }
    }), n;
  }
}
const v = {};
class Dt {
  constructor(e) {
    this.seed = e;
  }
  next() {
    return this.seed ? (2 ** 31 - 1 & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31 : Math.random();
  }
}
const F = { A: 7, a: 7, C: 6, c: 6, H: 1, h: 1, L: 2, l: 2, M: 2, m: 2, Q: 4, q: 4, S: 4, s: 4, T: 2, t: 2, V: 1, v: 1, Z: 0, z: 0 };
function et(r, e) {
  return r.type === e;
}
function st(r) {
  const e = [], s = function(h) {
    const o = new Array();
    for (; h !== ""; )
      if (h.match(/^([ \t\r\n,]+)/))
        h = h.substr(RegExp.$1.length);
      else if (h.match(/^([aAcChHlLmMqQsStTvVzZ])/))
        o[o.length] = { type: 0, text: RegExp.$1 }, h = h.substr(RegExp.$1.length);
      else {
        if (!h.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/))
          return [];
        o[o.length] = { type: 1, text: `${parseFloat(RegExp.$1)}` }, h = h.substr(RegExp.$1.length);
      }
    return o[o.length] = { type: 2, text: "" }, o;
  }(r);
  let t = "BOD", n = 0, a = s[n];
  for (; !et(a, 2); ) {
    let h = 0;
    const o = [];
    if (t === "BOD") {
      if (a.text !== "M" && a.text !== "m")
        return st("M0,0" + r);
      n++, h = F[a.text], t = a.text;
    } else
      et(a, 1) ? h = F[t] : (n++, h = F[a.text], t = a.text);
    if (!(n + h < s.length))
      throw new Error("Path data ended short");
    for (let c = n; c < n + h; c++) {
      const p = s[c];
      if (!et(p, 1))
        throw new Error("Param not a number: " + t + "," + p.text);
      o[o.length] = +p.text;
    }
    if (typeof F[t] != "number")
      throw new Error("Bad segment: " + t);
    {
      const c = { key: t, data: o };
      e.push(c), n += h, a = s[n], t === "M" && (t = "L"), t === "m" && (t = "l");
    }
  }
  return e;
}
function it(r) {
  let e = 0, s = 0, t = 0, n = 0;
  const a = [];
  for (const { key: h, data: o } of r)
    switch (h) {
      case "M":
        a.push({ key: "M", data: [...o] }), [e, s] = o, [t, n] = o;
        break;
      case "m":
        e += o[0], s += o[1], a.push({ key: "M", data: [e, s] }), t = e, n = s;
        break;
      case "L":
        a.push({ key: "L", data: [...o] }), [e, s] = o;
        break;
      case "l":
        e += o[0], s += o[1], a.push({ key: "L", data: [e, s] });
        break;
      case "C":
        a.push({ key: "C", data: [...o] }), e = o[4], s = o[5];
        break;
      case "c": {
        const c = o.map((p, i) => i % 2 ? p + s : p + e);
        a.push({ key: "C", data: c }), e = c[4], s = c[5];
        break;
      }
      case "Q":
        a.push({ key: "Q", data: [...o] }), e = o[2], s = o[3];
        break;
      case "q": {
        const c = o.map((p, i) => i % 2 ? p + s : p + e);
        a.push({ key: "Q", data: c }), e = c[2], s = c[3];
        break;
      }
      case "A":
        a.push({ key: "A", data: [...o] }), e = o[5], s = o[6];
        break;
      case "a":
        e += o[5], s += o[6], a.push({ key: "A", data: [o[0], o[1], o[2], o[3], o[4], e, s] });
        break;
      case "H":
        a.push({ key: "H", data: [...o] }), e = o[0];
        break;
      case "h":
        e += o[0], a.push({ key: "H", data: [e] });
        break;
      case "V":
        a.push({ key: "V", data: [...o] }), s = o[0];
        break;
      case "v":
        s += o[0], a.push({ key: "V", data: [s] });
        break;
      case "S":
        a.push({ key: "S", data: [...o] }), e = o[2], s = o[3];
        break;
      case "s": {
        const c = o.map((p, i) => i % 2 ? p + s : p + e);
        a.push({ key: "S", data: c }), e = c[2], s = c[3];
        break;
      }
      case "T":
        a.push({ key: "T", data: [...o] }), e = o[0], s = o[1];
        break;
      case "t":
        e += o[0], s += o[1], a.push({ key: "T", data: [e, s] });
        break;
      case "Z":
      case "z":
        a.push({ key: "Z", data: [] }), e = t, s = n;
    }
  return a;
}
function lt(r) {
  const e = [];
  let s = "", t = 0, n = 0, a = 0, h = 0, o = 0, c = 0;
  for (const { key: p, data: i } of r) {
    switch (p) {
      case "M":
        e.push({ key: "M", data: [...i] }), [t, n] = i, [a, h] = i;
        break;
      case "C":
        e.push({ key: "C", data: [...i] }), t = i[4], n = i[5], o = i[2], c = i[3];
        break;
      case "L":
        e.push({ key: "L", data: [...i] }), [t, n] = i;
        break;
      case "H":
        t = i[0], e.push({ key: "L", data: [t, n] });
        break;
      case "V":
        n = i[0], e.push({ key: "L", data: [t, n] });
        break;
      case "S": {
        let d = 0, f = 0;
        s === "C" || s === "S" ? (d = t + (t - o), f = n + (n - c)) : (d = t, f = n), e.push({ key: "C", data: [d, f, ...i] }), o = i[0], c = i[1], t = i[2], n = i[3];
        break;
      }
      case "T": {
        const [d, f] = i;
        let u = 0, l = 0;
        s === "Q" || s === "T" ? (u = t + (t - o), l = n + (n - c)) : (u = t, l = n);
        const m = t + 2 * (u - t) / 3, g = n + 2 * (l - n) / 3, M = d + 2 * (u - d) / 3, y = f + 2 * (l - f) / 3;
        e.push({ key: "C", data: [m, g, M, y, d, f] }), o = u, c = l, t = d, n = f;
        break;
      }
      case "Q": {
        const [d, f, u, l] = i, m = t + 2 * (d - t) / 3, g = n + 2 * (f - n) / 3, M = u + 2 * (d - u) / 3, y = l + 2 * (f - l) / 3;
        e.push({ key: "C", data: [m, g, M, y, u, l] }), o = d, c = f, t = u, n = l;
        break;
      }
      case "A": {
        const d = Math.abs(i[0]), f = Math.abs(i[1]), u = i[2], l = i[3], m = i[4], g = i[5], M = i[6];
        d === 0 || f === 0 ? (e.push({ key: "C", data: [t, n, g, M, g, M] }), t = g, n = M) : (t !== g || n !== M) && (vt(t, n, g, M, d, f, u, l, m).forEach(function(y) {
          e.push({ key: "C", data: y });
        }), t = g, n = M);
        break;
      }
      case "Z":
        e.push({ key: "Z", data: [] }), t = a, n = h;
    }
    s = p;
  }
  return e;
}
function z(r, e, s) {
  return [r * Math.cos(s) - e * Math.sin(s), r * Math.sin(s) + e * Math.cos(s)];
}
function vt(r, e, s, t, n, a, h, o, c, p) {
  const i = (d = h, Math.PI * d / 180);
  var d;
  let f = [], u = 0, l = 0, m = 0, g = 0;
  if (p)
    [u, l, m, g] = p;
  else {
    [r, e] = z(r, e, -i), [s, t] = z(s, t, -i);
    const O = (r - s) / 2, x = (e - t) / 2;
    let $ = O * O / (n * n) + x * x / (a * a);
    $ > 1 && ($ = Math.sqrt($), n *= $, a *= $);
    const q = n * n, E = a * a, _t = q * E - q * x * x - E * O * O, Lt = q * x * x + E * O * O, ht = (o === c ? -1 : 1) * Math.sqrt(Math.abs(_t / Lt));
    m = ht * n * x / a + (r + s) / 2, g = ht * -a * O / n + (e + t) / 2, u = Math.asin(parseFloat(((e - g) / a).toFixed(9))), l = Math.asin(parseFloat(((t - g) / a).toFixed(9))), r < m && (u = Math.PI - u), s < m && (l = Math.PI - l), u < 0 && (u = 2 * Math.PI + u), l < 0 && (l = 2 * Math.PI + l), c && u > l && (u -= 2 * Math.PI), !c && l > u && (l -= 2 * Math.PI);
  }
  let M = l - u;
  if (Math.abs(M) > 120 * Math.PI / 180) {
    const O = l, x = s, $ = t;
    l = c && l > u ? u + 120 * Math.PI / 180 * 1 : u + 120 * Math.PI / 180 * -1, f = vt(s = m + n * Math.cos(l), t = g + a * Math.sin(l), x, $, n, a, h, 0, c, [l, O, m, g]);
  }
  M = l - u;
  const y = Math.cos(u), S = Math.sin(u), _ = Math.cos(l), b = Math.sin(l), w = Math.tan(M / 4), A = 4 / 3 * n * w, R = 4 / 3 * a * w, G = [r, e], L = [r + A * S, e - R * y], D = [s + A * b, t - R * _], ot = [s, t];
  if (L[0] = 2 * G[0] - L[0], L[1] = 2 * G[1] - L[1], p)
    return [L, D, ot].concat(f);
  {
    f = [L, D, ot].concat(f);
    const O = [];
    for (let x = 0; x < f.length; x += 3) {
      const $ = z(f[x][0], f[x][1], i), q = z(f[x + 1][0], f[x + 1][1], i), E = z(f[x + 2][0], f[x + 2][1], i);
      O.push([$[0], $[1], q[0], q[1], E[0], E[1]]);
    }
    return O;
  }
}
const Tt = { randOffset: function(r, e) {
  return k(r, e);
}, randOffsetWithRange: function(r, e, s) {
  return J(r, e, s);
}, ellipse: function(r, e, s, t, n) {
  const a = Pt(s, t, n);
  return nt(r, e, n, a).opset;
}, doubleLineOps: function(r, e, s, t, n) {
  return N(r, e, s, t, n, !0);
} };
function wt(r, e, s, t, n) {
  return { type: "path", ops: N(r, e, s, t, n) };
}
function Z(r, e, s) {
  const t = (r || []).length;
  if (t > 2) {
    const n = [];
    for (let a = 0; a < t - 1; a++)
      n.push(...N(r[a][0], r[a][1], r[a + 1][0], r[a + 1][1], s));
    return e && n.push(...N(r[t - 1][0], r[t - 1][1], r[0][0], r[0][1], s)), { type: "path", ops: n };
  }
  return t === 2 ? wt(r[0][0], r[0][1], r[1][0], r[1][1], s) : { type: "path", ops: [] };
}
function qt(r, e, s, t, n) {
  return function(a, h) {
    return Z(a, !0, h);
  }([[r, e], [r + s, e], [r + s, e + t], [r, e + t]], n);
}
function Et(r, e) {
  let s = pt(r, 1 * (1 + 0.2 * e.roughness), e);
  if (!e.disableMultiStroke) {
    const t = pt(r, 1.5 * (1 + 0.22 * e.roughness), function(n) {
      const a = Object.assign({}, n);
      return a.randomizer = void 0, n.seed && (a.seed = n.seed + 1), a;
    }(e));
    s = s.concat(t);
  }
  return { type: "path", ops: s };
}
function Pt(r, e, s) {
  const t = Math.sqrt(2 * Math.PI * Math.sqrt((Math.pow(r / 2, 2) + Math.pow(e / 2, 2)) / 2)), n = Math.ceil(Math.max(s.curveStepCount, s.curveStepCount / Math.sqrt(200) * t)), a = 2 * Math.PI / n;
  let h = Math.abs(r / 2), o = Math.abs(e / 2);
  const c = 1 - s.curveFitting;
  return h += k(h * c, s), o += k(o * c, s), { increment: a, rx: h, ry: o };
}
function nt(r, e, s, t) {
  const [n, a] = ft(t.increment, r, e, t.rx, t.ry, 1, t.increment * J(0.1, J(0.4, 1, s), s), s);
  let h = K(n, null, s);
  if (!s.disableMultiStroke && s.roughness !== 0) {
    const [o] = ft(t.increment, r, e, t.rx, t.ry, 1.5, 0, s), c = K(o, null, s);
    h = h.concat(c);
  }
  return { estimatedPoints: a, opset: { type: "path", ops: h } };
}
function ct(r, e, s, t, n, a, h, o, c) {
  const p = r, i = e;
  let d = Math.abs(s / 2), f = Math.abs(t / 2);
  d += k(0.01 * d, c), f += k(0.01 * f, c);
  let u = n, l = a;
  for (; u < 0; )
    u += 2 * Math.PI, l += 2 * Math.PI;
  l - u > 2 * Math.PI && (u = 0, l = 2 * Math.PI);
  const m = 2 * Math.PI / c.curveStepCount, g = Math.min(m / 2, (l - u) / 2), M = dt(g, p, i, d, f, u, l, 1, c);
  if (!c.disableMultiStroke) {
    const y = dt(g, p, i, d, f, u, l, 1.5, c);
    M.push(...y);
  }
  return h && (o ? M.push(...N(p, i, p + d * Math.cos(u), i + f * Math.sin(u), c), ...N(p, i, p + d * Math.cos(l), i + f * Math.sin(l), c)) : M.push({ op: "lineTo", data: [p, i] }, { op: "lineTo", data: [p + d * Math.cos(u), i + f * Math.sin(u)] })), { type: "path", ops: M };
}
function V(r, e) {
  const s = [];
  for (const t of r)
    if (t.length) {
      const n = e.maxRandomnessOffset || 0, a = t.length;
      if (a > 2) {
        s.push({ op: "move", data: [t[0][0] + k(n, e), t[0][1] + k(n, e)] });
        for (let h = 1; h < a; h++)
          s.push({ op: "lineTo", data: [t[h][0] + k(n, e), t[h][1] + k(n, e)] });
      }
    }
  return { type: "fillPath", ops: s };
}
function I(r, e) {
  return function(s, t) {
    let n = s.fillStyle || "hachure";
    if (!v[n])
      switch (n) {
        case "zigzag":
          v[n] || (v[n] = new Rt(t));
          break;
        case "cross-hatch":
          v[n] || (v[n] = new $t(t));
          break;
        case "dots":
          v[n] || (v[n] = new At(t));
          break;
        case "dashed":
          v[n] || (v[n] = new Nt(t));
          break;
        case "zigzag-line":
          v[n] || (v[n] = new Ct(t));
          break;
        case "hachure":
        default:
          n = "hachure", v[n] || (v[n] = new at(t));
      }
    return v[n];
  }(e, Tt).fillPolygons(r, e);
}
function St(r) {
  return r.randomizer || (r.randomizer = new Dt(r.seed || 0)), r.randomizer.next();
}
function J(r, e, s, t = 1) {
  return s.roughness * t * (St(s) * (e - r) + r);
}
function k(r, e, s = 1) {
  return J(-r, r, e, s);
}
function N(r, e, s, t, n, a = !1) {
  const h = a ? n.disableMultiStrokeFill : n.disableMultiStroke, o = ut(r, e, s, t, n, !0, !1);
  if (h)
    return o;
  const c = ut(r, e, s, t, n, !0, !0);
  return o.concat(c);
}
function ut(r, e, s, t, n, a, h) {
  const o = Math.pow(r - s, 2) + Math.pow(e - t, 2), c = Math.sqrt(o);
  let p = 1;
  p = c < 200 ? 1 : c > 500 ? 0.4 : -16668e-7 * c + 1.233334;
  let i = n.maxRandomnessOffset || 0;
  i * i * 100 > o && (i = c / 10);
  const d = i / 2, f = 0.2 + 0.2 * St(n);
  let u = n.bowing * n.maxRandomnessOffset * (t - e) / 200, l = n.bowing * n.maxRandomnessOffset * (r - s) / 200;
  u = k(u, n, p), l = k(l, n, p);
  const m = [], g = () => k(d, n, p), M = () => k(i, n, p), y = n.preserveVertices;
  return a && (h ? m.push({ op: "move", data: [r + (y ? 0 : g()), e + (y ? 0 : g())] }) : m.push({ op: "move", data: [r + (y ? 0 : k(i, n, p)), e + (y ? 0 : k(i, n, p))] })), h ? m.push({ op: "bcurveTo", data: [u + r + (s - r) * f + g(), l + e + (t - e) * f + g(), u + r + 2 * (s - r) * f + g(), l + e + 2 * (t - e) * f + g(), s + (y ? 0 : g()), t + (y ? 0 : g())] }) : m.push({ op: "bcurveTo", data: [u + r + (s - r) * f + M(), l + e + (t - e) * f + M(), u + r + 2 * (s - r) * f + M(), l + e + 2 * (t - e) * f + M(), s + (y ? 0 : M()), t + (y ? 0 : M())] }), m;
}
function pt(r, e, s) {
  const t = [];
  t.push([r[0][0] + k(e, s), r[0][1] + k(e, s)]), t.push([r[0][0] + k(e, s), r[0][1] + k(e, s)]);
  for (let n = 1; n < r.length; n++)
    t.push([r[n][0] + k(e, s), r[n][1] + k(e, s)]), n === r.length - 1 && t.push([r[n][0] + k(e, s), r[n][1] + k(e, s)]);
  return K(t, null, s);
}
function K(r, e, s) {
  const t = r.length, n = [];
  if (t > 3) {
    const a = [], h = 1 - s.curveTightness;
    n.push({ op: "move", data: [r[1][0], r[1][1]] });
    for (let o = 1; o + 2 < t; o++) {
      const c = r[o];
      a[0] = [c[0], c[1]], a[1] = [c[0] + (h * r[o + 1][0] - h * r[o - 1][0]) / 6, c[1] + (h * r[o + 1][1] - h * r[o - 1][1]) / 6], a[2] = [r[o + 1][0] + (h * r[o][0] - h * r[o + 2][0]) / 6, r[o + 1][1] + (h * r[o][1] - h * r[o + 2][1]) / 6], a[3] = [r[o + 1][0], r[o + 1][1]], n.push({ op: "bcurveTo", data: [a[1][0], a[1][1], a[2][0], a[2][1], a[3][0], a[3][1]] });
    }
    if (e && e.length === 2) {
      const o = s.maxRandomnessOffset;
      n.push({ op: "lineTo", data: [e[0] + k(o, s), e[1] + k(o, s)] });
    }
  } else
    t === 3 ? (n.push({ op: "move", data: [r[1][0], r[1][1]] }), n.push({ op: "bcurveTo", data: [r[1][0], r[1][1], r[2][0], r[2][1], r[2][0], r[2][1]] })) : t === 2 && n.push(...N(r[0][0], r[0][1], r[1][0], r[1][1], s));
  return n;
}
function ft(r, e, s, t, n, a, h, o) {
  const c = [], p = [];
  if (o.roughness === 0) {
    r /= 4, p.push([e + t * Math.cos(-r), s + n * Math.sin(-r)]);
    for (let i = 0; i <= 2 * Math.PI; i += r) {
      const d = [e + t * Math.cos(i), s + n * Math.sin(i)];
      c.push(d), p.push(d);
    }
    p.push([e + t * Math.cos(0), s + n * Math.sin(0)]), p.push([e + t * Math.cos(r), s + n * Math.sin(r)]);
  } else {
    const i = k(0.5, o) - Math.PI / 2;
    p.push([k(a, o) + e + 0.9 * t * Math.cos(i - r), k(a, o) + s + 0.9 * n * Math.sin(i - r)]);
    const d = 2 * Math.PI + i - 0.01;
    for (let f = i; f < d; f += r) {
      const u = [k(a, o) + e + t * Math.cos(f), k(a, o) + s + n * Math.sin(f)];
      c.push(u), p.push(u);
    }
    p.push([k(a, o) + e + t * Math.cos(i + 2 * Math.PI + 0.5 * h), k(a, o) + s + n * Math.sin(i + 2 * Math.PI + 0.5 * h)]), p.push([k(a, o) + e + 0.98 * t * Math.cos(i + h), k(a, o) + s + 0.98 * n * Math.sin(i + h)]), p.push([k(a, o) + e + 0.9 * t * Math.cos(i + 0.5 * h), k(a, o) + s + 0.9 * n * Math.sin(i + 0.5 * h)]);
  }
  return [p, c];
}
function dt(r, e, s, t, n, a, h, o, c) {
  const p = a + k(0.1, c), i = [];
  i.push([k(o, c) + e + 0.9 * t * Math.cos(p - r), k(o, c) + s + 0.9 * n * Math.sin(p - r)]);
  for (let d = p; d <= h; d += r)
    i.push([k(o, c) + e + t * Math.cos(d), k(o, c) + s + n * Math.sin(d)]);
  return i.push([e + t * Math.cos(h), s + n * Math.sin(h)]), i.push([e + t * Math.cos(h), s + n * Math.sin(h)]), K(i, null, c);
}
function It(r, e, s, t, n, a, h, o) {
  const c = [], p = [o.maxRandomnessOffset || 1, (o.maxRandomnessOffset || 1) + 0.3];
  let i = [0, 0];
  const d = o.disableMultiStroke ? 1 : 2, f = o.preserveVertices;
  for (let u = 0; u < d; u++)
    u === 0 ? c.push({ op: "move", data: [h[0], h[1]] }) : c.push({ op: "move", data: [h[0] + (f ? 0 : k(p[0], o)), h[1] + (f ? 0 : k(p[0], o))] }), i = f ? [n, a] : [n + k(p[u], o), a + k(p[u], o)], c.push({ op: "bcurveTo", data: [r + k(p[u], o), e + k(p[u], o), s + k(p[u], o), t + k(p[u], o), i[0], i[1]] });
  return c;
}
function W(r) {
  return [...r];
}
function Q(r, e) {
  return Math.pow(r[0] - e[0], 2) + Math.pow(r[1] - e[1], 2);
}
function zt(r, e, s) {
  const t = Q(e, s);
  if (t === 0)
    return Q(r, e);
  let n = ((r[0] - e[0]) * (s[0] - e[0]) + (r[1] - e[1]) * (s[1] - e[1])) / t;
  return n = Math.max(0, Math.min(1, n)), Q(r, T(e, s, n));
}
function T(r, e, s) {
  return [r[0] + (e[0] - r[0]) * s, r[1] + (e[1] - r[1]) * s];
}
function rt(r, e, s, t) {
  const n = t || [];
  if (function(o, c) {
    const p = o[c + 0], i = o[c + 1], d = o[c + 2], f = o[c + 3];
    let u = 3 * i[0] - 2 * p[0] - f[0];
    u *= u;
    let l = 3 * i[1] - 2 * p[1] - f[1];
    l *= l;
    let m = 3 * d[0] - 2 * f[0] - p[0];
    m *= m;
    let g = 3 * d[1] - 2 * f[1] - p[1];
    return g *= g, u < m && (u = m), l < g && (l = g), u + l;
  }(r, e) < s) {
    const o = r[e + 0];
    n.length ? (a = n[n.length - 1], h = o, Math.sqrt(Q(a, h)) > 1 && n.push(o)) : n.push(o), n.push(r[e + 3]);
  } else {
    const c = r[e + 0], p = r[e + 1], i = r[e + 2], d = r[e + 3], f = T(c, p, 0.5), u = T(p, i, 0.5), l = T(i, d, 0.5), m = T(f, u, 0.5), g = T(u, l, 0.5), M = T(m, g, 0.5);
    rt([c, f, m, M], 0, s, n), rt([M, g, l, d], 0, s, n);
  }
  var a, h;
  return n;
}
function Wt(r, e) {
  return U(r, 0, r.length, e);
}
function U(r, e, s, t, n) {
  const a = n || [], h = r[e], o = r[s - 1];
  let c = 0, p = 1;
  for (let i = e + 1; i < s - 1; ++i) {
    const d = zt(r[i], h, o);
    d > c && (c = d, p = i);
  }
  return Math.sqrt(c) > t ? (U(r, e, p + 1, t, a), U(r, p, s, t, a)) : (a.length || a.push(h), a.push(o)), a;
}
function gt(r, e = 0.15, s) {
  const t = [], n = (r.length - 1) / 3;
  for (let a = 0; a < n; a++)
    rt(r, 3 * a, e, t);
  return s && s > 0 ? U(t, 0, t.length, s) : t;
}
const P = "none";
class X {
  constructor(e) {
    this.defaultOptions = { maxRandomnessOffset: 2, roughness: 1, bowing: 1, stroke: "#000", strokeWidth: 1, curveTightness: 0, curveFitting: 0.95, curveStepCount: 9, fillStyle: "hachure", fillWeight: -1, hachureAngle: -41, hachureGap: -1, dashOffset: -1, dashGap: -1, zigzagOffset: -1, seed: 0, disableMultiStroke: !1, disableMultiStrokeFill: !1, preserveVertices: !1 }, this.config = e || {}, this.config.options && (this.defaultOptions = this._o(this.config.options));
  }
  static newSeed() {
    return Math.floor(Math.random() * 2 ** 31);
  }
  _o(e) {
    return e ? Object.assign({}, this.defaultOptions, e) : this.defaultOptions;
  }
  _d(e, s, t) {
    return { shape: e, sets: s || [], options: t || this.defaultOptions };
  }
  line(e, s, t, n, a) {
    const h = this._o(a);
    return this._d("line", [wt(e, s, t, n, h)], h);
  }
  rectangle(e, s, t, n, a) {
    const h = this._o(a), o = [], c = qt(e, s, t, n, h);
    if (h.fill) {
      const p = [[e, s], [e + t, s], [e + t, s + n], [e, s + n]];
      h.fillStyle === "solid" ? o.push(V([p], h)) : o.push(I([p], h));
    }
    return h.stroke !== P && o.push(c), this._d("rectangle", o, h);
  }
  ellipse(e, s, t, n, a) {
    const h = this._o(a), o = [], c = Pt(t, n, h), p = nt(e, s, h, c);
    if (h.fill)
      if (h.fillStyle === "solid") {
        const i = nt(e, s, h, c).opset;
        i.type = "fillPath", o.push(i);
      } else
        o.push(I([p.estimatedPoints], h));
    return h.stroke !== P && o.push(p.opset), this._d("ellipse", o, h);
  }
  circle(e, s, t, n) {
    const a = this.ellipse(e, s, t, t, n);
    return a.shape = "circle", a;
  }
  linearPath(e, s) {
    const t = this._o(s);
    return this._d("linearPath", [Z(e, !1, t)], t);
  }
  arc(e, s, t, n, a, h, o = !1, c) {
    const p = this._o(c), i = [], d = ct(e, s, t, n, a, h, o, !0, p);
    if (o && p.fill)
      if (p.fillStyle === "solid") {
        const f = Object.assign({}, p);
        f.disableMultiStroke = !0;
        const u = ct(e, s, t, n, a, h, !0, !1, f);
        u.type = "fillPath", i.push(u);
      } else
        i.push(function(f, u, l, m, g, M, y) {
          const S = f, _ = u;
          let b = Math.abs(l / 2), w = Math.abs(m / 2);
          b += k(0.01 * b, y), w += k(0.01 * w, y);
          let A = g, R = M;
          for (; A < 0; )
            A += 2 * Math.PI, R += 2 * Math.PI;
          R - A > 2 * Math.PI && (A = 0, R = 2 * Math.PI);
          const G = (R - A) / y.curveStepCount, L = [];
          for (let D = A; D <= R; D += G)
            L.push([S + b * Math.cos(D), _ + w * Math.sin(D)]);
          return L.push([S + b * Math.cos(R), _ + w * Math.sin(R)]), L.push([S, _]), I([L], y);
        }(e, s, t, n, a, h, p));
    return p.stroke !== P && i.push(d), this._d("arc", i, p);
  }
  curve(e, s) {
    const t = this._o(s), n = [], a = Et(e, t);
    if (t.fill && t.fill !== P && e.length >= 3) {
      const h = gt(function(o, c = 0) {
        const p = o.length;
        if (p < 3)
          throw new Error("A curve must have at least three points.");
        const i = [];
        if (p === 3)
          i.push(W(o[0]), W(o[1]), W(o[2]), W(o[2]));
        else {
          const d = [];
          d.push(o[0], o[0]);
          for (let l = 1; l < o.length; l++)
            d.push(o[l]), l === o.length - 1 && d.push(o[l]);
          const f = [], u = 1 - c;
          i.push(W(d[0]));
          for (let l = 1; l + 2 < d.length; l++) {
            const m = d[l];
            f[0] = [m[0], m[1]], f[1] = [m[0] + (u * d[l + 1][0] - u * d[l - 1][0]) / 6, m[1] + (u * d[l + 1][1] - u * d[l - 1][1]) / 6], f[2] = [d[l + 1][0] + (u * d[l][0] - u * d[l + 2][0]) / 6, d[l + 1][1] + (u * d[l][1] - u * d[l + 2][1]) / 6], f[3] = [d[l + 1][0], d[l + 1][1]], i.push(f[1], f[2], f[3]);
          }
        }
        return i;
      }(e), 10, (1 + t.roughness) / 2);
      t.fillStyle === "solid" ? n.push(V([h], t)) : n.push(I([h], t));
    }
    return t.stroke !== P && n.push(a), this._d("curve", n, t);
  }
  polygon(e, s) {
    const t = this._o(s), n = [], a = Z(e, !0, t);
    return t.fill && (t.fillStyle === "solid" ? n.push(V([e], t)) : n.push(I([e], t))), t.stroke !== P && n.push(a), this._d("polygon", n, t);
  }
  path(e, s) {
    const t = this._o(s), n = [];
    if (!e)
      return this._d("path", n, t);
    e = (e || "").replace(/\n/g, " ").replace(/(-\s)/g, "-").replace("/(ss)/g", " ");
    const a = t.fill && t.fill !== "transparent" && t.fill !== P, h = t.stroke !== P, o = !!(t.simplification && t.simplification < 1), c = function(p, i, d) {
      const f = lt(it(st(p))), u = [];
      let l = [], m = [0, 0], g = [];
      const M = () => {
        g.length >= 4 && l.push(...gt(g, i)), g = [];
      }, y = () => {
        M(), l.length && (u.push(l), l = []);
      };
      for (const { key: _, data: b } of f)
        switch (_) {
          case "M":
            y(), m = [b[0], b[1]], l.push(m);
            break;
          case "L":
            M(), l.push([b[0], b[1]]);
            break;
          case "C":
            if (!g.length) {
              const w = l.length ? l[l.length - 1] : m;
              g.push([w[0], w[1]]);
            }
            g.push([b[0], b[1]]), g.push([b[2], b[3]]), g.push([b[4], b[5]]);
            break;
          case "Z":
            M(), l.push([m[0], m[1]]);
        }
      if (y(), !d)
        return u;
      const S = [];
      for (const _ of u) {
        const b = Wt(_, d);
        b.length && S.push(b);
      }
      return S;
    }(e, 1, o ? 4 - 4 * t.simplification : (1 + t.roughness) / 2);
    return a && (t.fillStyle === "solid" ? n.push(V(c, t)) : n.push(I(c, t))), h && (o ? c.forEach((p) => {
      n.push(Z(p, !1, t));
    }) : n.push(function(p, i) {
      const d = lt(it(st(p))), f = [];
      let u = [0, 0], l = [0, 0];
      for (const { key: m, data: g } of d)
        switch (m) {
          case "M": {
            const M = 1 * (i.maxRandomnessOffset || 0), y = i.preserveVertices;
            f.push({ op: "move", data: g.map((S) => S + (y ? 0 : k(M, i))) }), l = [g[0], g[1]], u = [g[0], g[1]];
            break;
          }
          case "L":
            f.push(...N(l[0], l[1], g[0], g[1], i)), l = [g[0], g[1]];
            break;
          case "C": {
            const [M, y, S, _, b, w] = g;
            f.push(...It(M, y, S, _, b, w, l, i)), l = [b, w];
            break;
          }
          case "Z":
            f.push(...N(l[0], l[1], u[0], u[1], i)), l = [u[0], u[1]];
        }
      return { type: "path", ops: f };
    }(e, t))), this._d("path", n, t);
  }
  opsToPath(e, s) {
    let t = "";
    for (const n of e.ops) {
      const a = typeof s == "number" && s >= 0 ? n.data.map((h) => +h.toFixed(s)) : n.data;
      switch (n.op) {
        case "move":
          t += `M${a[0]} ${a[1]} `;
          break;
        case "bcurveTo":
          t += `C${a[0]} ${a[1]}, ${a[2]} ${a[3]}, ${a[4]} ${a[5]} `;
          break;
        case "lineTo":
          t += `L${a[0]} ${a[1]} `;
      }
    }
    return t.trim();
  }
  toPaths(e) {
    const s = e.sets || [], t = e.options || this.defaultOptions, n = [];
    for (const a of s) {
      let h = null;
      switch (a.type) {
        case "path":
          h = { d: this.opsToPath(a), stroke: t.stroke, strokeWidth: t.strokeWidth, fill: P };
          break;
        case "fillPath":
          h = { d: this.opsToPath(a), stroke: P, strokeWidth: 0, fill: t.fill || P };
          break;
        case "fillSketch":
          h = this.fillSketch(a, t);
      }
      h && n.push(h);
    }
    return n;
  }
  fillSketch(e, s) {
    let t = s.fillWeight;
    return t < 0 && (t = s.strokeWidth / 2), { d: this.opsToPath(e), stroke: s.fill || P, strokeWidth: t, fill: P };
  }
}
class jt {
  constructor(e, s) {
    this.canvas = e, this.ctx = this.canvas.getContext("2d"), this.gen = new X(s);
  }
  draw(e) {
    const s = e.sets || [], t = e.options || this.getDefaultOptions(), n = this.ctx, a = e.options.fixedDecimalPlaceDigits;
    for (const h of s)
      switch (h.type) {
        case "path":
          n.save(), n.strokeStyle = t.stroke === "none" ? "transparent" : t.stroke, n.lineWidth = t.strokeWidth, t.strokeLineDash && n.setLineDash(t.strokeLineDash), t.strokeLineDashOffset && (n.lineDashOffset = t.strokeLineDashOffset), this._drawToContext(n, h, a), n.restore();
          break;
        case "fillPath": {
          n.save(), n.fillStyle = t.fill || "";
          const o = e.shape === "curve" || e.shape === "polygon" || e.shape === "path" ? "evenodd" : "nonzero";
          this._drawToContext(n, h, a, o), n.restore();
          break;
        }
        case "fillSketch":
          this.fillSketch(n, h, t);
      }
  }
  fillSketch(e, s, t) {
    let n = t.fillWeight;
    n < 0 && (n = t.strokeWidth / 2), e.save(), t.fillLineDash && e.setLineDash(t.fillLineDash), t.fillLineDashOffset && (e.lineDashOffset = t.fillLineDashOffset), e.strokeStyle = t.fill || "", e.lineWidth = n, this._drawToContext(e, s, t.fixedDecimalPlaceDigits), e.restore();
  }
  _drawToContext(e, s, t, n = "nonzero") {
    e.beginPath();
    for (const a of s.ops) {
      const h = typeof t == "number" && t >= 0 ? a.data.map((o) => +o.toFixed(t)) : a.data;
      switch (a.op) {
        case "move":
          e.moveTo(h[0], h[1]);
          break;
        case "bcurveTo":
          e.bezierCurveTo(h[0], h[1], h[2], h[3], h[4], h[5]);
          break;
        case "lineTo":
          e.lineTo(h[0], h[1]);
      }
    }
    s.type === "fillPath" ? e.fill(n) : e.stroke();
  }
  get generator() {
    return this.gen;
  }
  getDefaultOptions() {
    return this.gen.defaultOptions;
  }
  line(e, s, t, n, a) {
    const h = this.gen.line(e, s, t, n, a);
    return this.draw(h), h;
  }
  rectangle(e, s, t, n, a) {
    const h = this.gen.rectangle(e, s, t, n, a);
    return this.draw(h), h;
  }
  ellipse(e, s, t, n, a) {
    const h = this.gen.ellipse(e, s, t, n, a);
    return this.draw(h), h;
  }
  circle(e, s, t, n) {
    const a = this.gen.circle(e, s, t, n);
    return this.draw(a), a;
  }
  linearPath(e, s) {
    const t = this.gen.linearPath(e, s);
    return this.draw(t), t;
  }
  polygon(e, s) {
    const t = this.gen.polygon(e, s);
    return this.draw(t), t;
  }
  arc(e, s, t, n, a, h, o = !1, c) {
    const p = this.gen.arc(e, s, t, n, a, h, o, c);
    return this.draw(p), p;
  }
  curve(e, s) {
    const t = this.gen.curve(e, s);
    return this.draw(t), t;
  }
  path(e, s) {
    const t = this.gen.path(e, s);
    return this.draw(t), t;
  }
}
const B = "http://www.w3.org/2000/svg";
class Gt {
  constructor(e, s) {
    this.svg = e, this.gen = new X(s);
  }
  draw(e) {
    const s = e.sets || [], t = e.options || this.getDefaultOptions(), n = this.svg.ownerDocument || window.document, a = n.createElementNS(B, "g"), h = e.options.fixedDecimalPlaceDigits;
    for (const o of s) {
      let c = null;
      switch (o.type) {
        case "path":
          c = n.createElementNS(B, "path"), c.setAttribute("d", this.opsToPath(o, h)), c.setAttribute("stroke", t.stroke), c.setAttribute("stroke-width", t.strokeWidth + ""), c.setAttribute("fill", "none"), t.strokeLineDash && c.setAttribute("stroke-dasharray", t.strokeLineDash.join(" ").trim()), t.strokeLineDashOffset && c.setAttribute("stroke-dashoffset", `${t.strokeLineDashOffset}`);
          break;
        case "fillPath":
          c = n.createElementNS(B, "path"), c.setAttribute("d", this.opsToPath(o, h)), c.setAttribute("stroke", "none"), c.setAttribute("stroke-width", "0"), c.setAttribute("fill", t.fill || ""), e.shape !== "curve" && e.shape !== "polygon" || c.setAttribute("fill-rule", "evenodd");
          break;
        case "fillSketch":
          c = this.fillSketch(n, o, t);
      }
      c && a.appendChild(c);
    }
    return a;
  }
  fillSketch(e, s, t) {
    let n = t.fillWeight;
    n < 0 && (n = t.strokeWidth / 2);
    const a = e.createElementNS(B, "path");
    return a.setAttribute("d", this.opsToPath(s, t.fixedDecimalPlaceDigits)), a.setAttribute("stroke", t.fill || ""), a.setAttribute("stroke-width", n + ""), a.setAttribute("fill", "none"), t.fillLineDash && a.setAttribute("stroke-dasharray", t.fillLineDash.join(" ").trim()), t.fillLineDashOffset && a.setAttribute("stroke-dashoffset", `${t.fillLineDashOffset}`), a;
  }
  get generator() {
    return this.gen;
  }
  getDefaultOptions() {
    return this.gen.defaultOptions;
  }
  opsToPath(e, s) {
    return this.gen.opsToPath(e, s);
  }
  line(e, s, t, n, a) {
    const h = this.gen.line(e, s, t, n, a);
    return this.draw(h);
  }
  rectangle(e, s, t, n, a) {
    const h = this.gen.rectangle(e, s, t, n, a);
    return this.draw(h);
  }
  ellipse(e, s, t, n, a) {
    const h = this.gen.ellipse(e, s, t, n, a);
    return this.draw(h);
  }
  circle(e, s, t, n) {
    const a = this.gen.circle(e, s, t, n);
    return this.draw(a);
  }
  linearPath(e, s) {
    const t = this.gen.linearPath(e, s);
    return this.draw(t);
  }
  polygon(e, s) {
    const t = this.gen.polygon(e, s);
    return this.draw(t);
  }
  arc(e, s, t, n, a, h, o = !1, c) {
    const p = this.gen.arc(e, s, t, n, a, h, o, c);
    return this.draw(p);
  }
  curve(e, s) {
    const t = this.gen.curve(e, s);
    return this.draw(t);
  }
  path(e, s) {
    const t = this.gen.path(e, s);
    return this.draw(t);
  }
}
var Ft = { canvas: (r, e) => new jt(r, e), svg: (r, e) => new Gt(r, e), generator: (r) => new X(r), newSeed: () => X.newSeed() };
const Ot = (r, e) => {
  const s = r.__vccOpts || r;
  for (const [t, n] of e)
    s[t] = n;
  return s;
}, Vt = {
  name: "RoughCanvas",
  props: {
    width: String,
    height: String,
    config: Object
  },
  setup(r) {
    const e = H(null), s = H(null);
    return Mt(() => {
      s.value = Ft.canvas(e.value, r.config);
    }), {
      rough: s,
      canvasRef: e
    };
  }
}, Bt = ["width", "height"];
function Zt(r, e, s, t, n, a) {
  return kt(), yt("canvas", {
    width: s.width,
    height: s.height,
    ref: "canvasRef"
  }, [
    t.rough ? bt(r.$slots, "default", { key: 0 }) : xt("", !0)
  ], 8, Bt);
}
const Qt = /* @__PURE__ */ Ot(Vt, [["render", Zt]]), Ht = {
  name: "RoughSvg",
  props: {
    width: String,
    height: String,
    config: Object
  },
  setup(r) {
    const e = H(null), s = H(null);
    return Mt(() => {
      s.value = s.svg(e.value, r.config);
    }), { rough: s, append: (a) => {
      e.value.appendChild(a);
    }, remove: (a) => {
      e.value.removeChild(a);
    } };
  }
}, Jt = ["width", "height"];
function Kt(r, e, s, t, n, a) {
  return kt(), yt("svg", {
    width: s.width,
    height: s.height,
    ref: "svgElement"
  }, [
    t.rough ? bt(r.$slots, "default", { key: 0 }) : xt("", !0)
  ], 8, Jt);
}
const Ut = /* @__PURE__ */ Ot(Ht, [["render", Kt]]), C = {
  props: {
    roughness: Number,
    bowing: Number,
    seed: Number,
    stroke: String,
    strokeWidth: Number,
    fill: String,
    fillStyle: String,
    fillWeight: Number,
    hachureAngle: Number,
    hachureGap: Number,
    curveStepCount: Number,
    curveFitting: Number,
    strokeLineDash: Array,
    strokeLineDashOffset: Number,
    fillLineDash: Array,
    fillLineDashOffset: Number,
    disableMultiStroke: Boolean,
    disableMultiStrokeFill: Boolean,
    simplification: Number,
    dashOffset: Number,
    dashGap: Number,
    zigzagOffset: Number
  },
  data() {
    return {
      element: null
    };
  },
  mounted() {
    this.$watch("$props", () => {
      this.handler();
    }, { deep: !0 }), this.handler();
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  destroyed() {
    this.$parent.rough.svg ? this.element && this.$parent.remove(this.element) : this.$parent.$emit("rerender");
  },
  methods: {
    createElement: function(r, e, s = !1) {
      const t = this.$parent.rough;
      if (!t) {
        console.error("Parent component does not provide a Rough.js instance.");
        return;
      }
      const n = Object.assign(
        {},
        ...Object.entries(this.$props).map(([a, h]) => h !== void 0 && { [a]: h })
      );
      if (s) {
        t[r](...e, n);
        return;
      }
      t != null && t.svg ? (this.element && this.$parent.remove(this.element), this.element = t[r](...e, n), this.$parent.append(this.element)) : this.$parent.$emit("rerender");
    }
  }
}, Xt = {
  name: "RoughLine",
  mixins: [C],
  props: {
    x1: {
      type: Number,
      default: 0,
      required: !0
    },
    y1: {
      type: Number,
      default: 0,
      required: !0
    },
    x2: {
      type: Number,
      default: 0,
      required: !0
    },
    y2: {
      type: Number,
      default: 0,
      required: !0
    }
  },
  methods: {
    handler(r = !1) {
      this.createElement("line", [this.x1, this.y1, this.x2, this.y2], r);
    }
  }
}, Yt = {
  name: "RoughRectangle",
  mixins: [C],
  props: {
    x1: {
      type: Number,
      default: 0,
      required: !0
    },
    y1: {
      type: Number,
      default: 0,
      required: !0
    },
    x2: {
      type: Number,
      default: 0,
      required: !0
    },
    y2: {
      type: Number,
      default: 0,
      required: !0
    }
  },
  methods: {
    handler(r = !1) {
      this.createElement("rectangle", [this.x1, this.y1, this.x2, this.y2], r);
    }
  }
}, te = {
  name: "RoughEllipse",
  mixins: [C],
  props: {
    x: {
      type: Number,
      default: 0,
      required: !0
    },
    y: {
      type: Number,
      default: 0,
      required: !0
    },
    width: {
      type: Number,
      default: 0,
      required: !0
    },
    height: {
      type: Number,
      default: 0,
      required: !0
    }
  },
  methods: {
    handler(r = !1) {
      this.createElement("ellipse", [this.x, this.y, this.width, this.height], r);
    }
  }
}, ee = {
  name: "RoughCircle",
  mixins: [C],
  props: {
    x: {
      type: Number,
      default: 0,
      required: !0
    },
    y: {
      type: Number,
      default: 0,
      required: !0
    },
    diameter: {
      type: Number,
      default: 0,
      required: !0
    }
  },
  methods: {
    handler(r = !1) {
      this.createElement("circle", [this.x, this.y, this.diameter], r);
    }
  }
}, se = {
  name: "RoughLinearPath",
  mixins: [C],
  props: {
    points: {
      type: Array,
      required: !0
    }
  },
  methods: {
    handler(r = !1) {
      this.createElement("linearPath", [this.points], r);
    }
  }
}, ne = {
  name: "RoughPolygon",
  mixins: [C],
  props: {
    vertices: {
      type: Array,
      required: !0
    }
  },
  methods: {
    handler(r = !1) {
      this.createElement("polygon", [this.vertices], r);
    }
  }
}, re = {
  name: "RoughArc",
  mixins: [C],
  props: {
    x: {
      type: Number,
      default: 0,
      required: !0
    },
    y: {
      type: Number,
      default: 0,
      required: !0
    },
    width: {
      type: Number,
      default: 0,
      required: !0
    },
    height: {
      type: Number,
      default: 0,
      required: !0
    },
    start: {
      type: Number,
      default: 0,
      required: !0
    },
    stop: {
      type: Number,
      default: 0,
      required: !0
    },
    closed: {
      type: Boolean,
      default: !1,
      required: !0
    }
  },
  methods: {
    handler(r = !1) {
      this.createElement("arc", [this.x, this.y, this.width, this.height, this.start, this.stop, this.closed], r);
    }
  }
}, ae = {
  name: "RoughCurve",
  mixins: [C],
  props: {
    points: {
      type: Array,
      required: !0
    }
  },
  methods: {
    handler(r = !1) {
      this.createElement("curve", [this.points], r);
    }
  }
}, oe = {
  name: "RoughPath",
  mixins: [C],
  props: {
    d: {
      type: String,
      required: !0
    }
  },
  methods: {
    handler(r = !1) {
      this.createElement("path", [this.d], r);
    }
  }
}, mt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  RoughArc: re,
  RoughCanvas: Qt,
  RoughCircle: ee,
  RoughCurve: ae,
  RoughEllipse: te,
  RoughLine: Xt,
  RoughLinearPath: se,
  RoughPath: oe,
  RoughPolygon: ne,
  RoughRectangle: Yt,
  RoughSvg: Ut
}, Symbol.toStringTag, { value: "Module" }));
function ie(r) {
  Object.keys(mt).forEach((e) => {
    r.component(e, mt[e]);
  });
}
export {
  re as RoughArc,
  Qt as RoughCanvas,
  ee as RoughCircle,
  ae as RoughCurve,
  te as RoughEllipse,
  Xt as RoughLine,
  se as RoughLinearPath,
  oe as RoughPath,
  ne as RoughPolygon,
  Yt as RoughRectangle,
  Ut as RoughSvg,
  ie as default,
  ie as install
};
