import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Run from a project with @tscircuit/math-utils installed. This never renders,
// routes, writes CircuitJSON, or modifies copper. It audits ONLY traces, vias,
// and filled pours against native polygon cutouts, not component/pad clearance.
const { segmentToSegmentMinDistance, pointToSegmentDistance, isPointInsidePolygon } =
  await import(pathToFileURL(resolve(process.cwd(), "node_modules/@tscircuit/math-utils/dist/index.js")).href);
const EPS = 1e-6; // mm: avoid calling sub-nanometre polygon rounding a violation.
const LIMIT = 5_000_000;
const must = (value, message) => { if (!value) throw new Error(message); };
const finite = (v) => (must(Number.isFinite(v), `Nonfinite number: ${v}`), v);
const positive = (v) => (must(finite(v) > 0, `Nonpositive dimension: ${v}`), v);
const edges = (p) => p.map((a, i) => [a, p[(i + 1) % p.length]]);
const cross = (a, b, p) => (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
const properCrossing = (a, b, u, v) => cross(a, b, u) * cross(a, b, v) < 0 && cross(u, v, a) * cross(u, v, b) < 0;
const polygon = (points) => {
  must(Array.isArray(points) && points.length >= 3, "Invalid polygon");
  for (const p of points) {
    finite(p.x); finite(p.y);
    must((p.bulge ?? 0) === 0 && p.arc === undefined && p.curve === undefined, "Unsupported curved polygon/BRep bulge");
  }
  const area = points.reduce((s, p, i) => { const q = points[(i + 1) % points.length]; return s + p.x * q.y - q.x * p.y; }, 0);
  must(Math.abs(area) > EPS * EPS, "Degenerate polygon");
  return points;
};
const rect = (x0, y0, x1, y1) => [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }];

export function auditCutoutClearance(circuit) {
  must(Array.isArray(circuit) && circuit.length <= 50_000, "Invalid or oversized CircuitJSON array");
  const boards = circuit.filter((e) => e.type === "pcb_board");
  must(boards.length === 1, "Exactly one board is required");
  const board = boards[0], count = board.num_layers;
  must(Number.isInteger(count) && count >= 2 && count <= 32, "Unsupported layer count");
  const layers = ["top", ...Array.from({ length: count - 2 }, (_, i) => `inner${i + 1}`), "bottom"];
  const minimum = Math.max(0.2, positive(board.min_board_edge_clearance ?? 0.2));
  const cutouts = circuit.filter((e) => e.type === "pcb_cutout");
  must(cutouts.length > 0 && cutouts.length <= 8, "Expected 1–8 native cutouts");
  const byId = new Map(circuit.map((e) => [e[`${e.type}_id`], e]));
  let comparisons = 0;
  const records = [];
  const tick = () => must(++comparisons <= LIMIT, `Bounded audit exceeded ${LIMIT} segment comparisons; no pass established`);
  const pointDistance = (p, es) => Math.min(...es.map(([a, b]) => { tick(); return pointToSegmentDistance(p, a, b); }));
  const validLayer = (l) => must(layers.includes(l), `Unknown copper layer: ${l}`);
  const classify = (gap, overlap) => overlap || gap < -EPS ? "overlap" : gap <= EPS ? "touching" : "separated";
  for (const cutout of cutouts) {
    must(cutout.shape === "polygon", `Unsupported cutout shape: ${cutout.shape}`);
    const cut = polygon(cutout.points), ce = edges(cut);
    const strictInside = (p, ring, re = edges(ring)) => isPointInsidePolygon(p, ring) && pointDistance(p, re) > EPS;
    const add = (e, result, ls) => {
      const relation = classify(result.gap, result.overlap);
      records.push({ cutout: cutout.pcb_cutout_id, type: e.type, id: e[`${e.type}_id`], layers: ls,
        sourceTrace: e.source_trace_id, name: byId.get(e.source_trace_id)?.name,
        net: byId.get(e.source_net_id)?.name, relation, edgeClearanceMm: Math.max(0, result.gap),
        deficitMm: Math.max(0, minimum - Math.max(0, result.gap)),
        violation: relation !== "separated" || result.gap < minimum - EPS, witness: result.witness });
    };
    for (const e of circuit) {
      if (e.type === "pcb_trace") {
        must(Array.isArray(e.route), `Missing route: ${e.pcb_trace_id}`);
        const bestByLayer = new Map();
        for (let i = 0; i < e.route.length; i++) {
          const a = e.route[i], b = e.route[i + 1];
          must(["wire", "via"].includes(a.route_type) && (a.bulge ?? 0) === 0 && a.arc === undefined && a.curve === undefined, `Unsupported route geometry: ${e.pcb_trace_id}`);
          finite(a.x); finite(a.y);
          if (a.route_type !== "wire") continue;
          validLayer(a.layer); positive(a.width);
          if (b?.route_type !== "wire") continue;
          must(a.layer === b.layer, `Wire layer change without via: ${e.pcb_trace_id}`);
          finite(b.x); finite(b.y);
          let best = { gap: Infinity, overlap: strictInside(a, cut, ce) || strictInside(b, cut, ce) };
          // Native copper conversion applies the START wire record's width.
          for (const [u, v] of ce) {
            tick(); const gap = segmentToSegmentMinDistance(a, b, u, v) - a.width / 2;
            if (gap < best.gap) best = { ...best, gap, witness: { copperCenterline: [{ x: a.x, y: a.y }, { x: b.x, y: b.y }], width: a.width, cutoutEdge: [u, v] } };
          }
          if (best.overlap) best.gap = Math.min(0, best.gap);
          const old = bestByLayer.get(a.layer);
          if (!old || best.gap < old.gap || (best.overlap && !old.overlap)) bestByLayer.set(a.layer, best);
        }
        for (const [l, result] of bestByLayer) add(e, result, [l]);
      } else if (e.type === "pcb_via") {
        finite(e.x); finite(e.y); positive(e.outer_diameter); positive(e.hole_diameter);
        must(e.outer_diameter > e.hole_diameter, `Invalid via annulus: ${e.pcb_via_id}`);
        must(Array.isArray(e.layers) && e.layers.length > 0 && new Set(e.layers).size === e.layers.length, `Missing/duplicate via layers: ${e.pcb_via_id}`);
        e.layers.forEach(validLayer);
        const distance = pointDistance(e, ce), overlap = strictInside(e, cut, ce);
        add(e, { gap: overlap ? 0 : distance - e.outer_diameter / 2, overlap, witness: { center: { x: e.x, y: e.y }, outerDiameter: e.outer_diameter } }, e.layers);
      } else if (e.type === "pcb_copper_pour") {
        validLayer(e.layer);
        let rings;
        if (e.shape === "brep") rings = [polygon(e.brep_shape.outer_ring.vertices), ...(e.brep_shape.inner_rings ?? []).map((r) => polygon(r.vertices))];
        else if (e.shape === "polygon") rings = [polygon(e.points)];
        else if (e.shape === "rect") {
          const w = positive(e.width), h = positive(e.height), angle = finite(e.rotation ?? 0) * Math.PI / 180;
          rings = [rect(-w / 2, -h / 2, w / 2, h / 2).map((p) => ({ x: finite(e.center.x) + p.x * Math.cos(angle) - p.y * Math.sin(angle), y: finite(e.center.y) + p.x * Math.sin(angle) + p.y * Math.cos(angle) }))];
        } else throw new Error(`Unsupported pour shape: ${e.shape}`);
        const ringEdges = rings.map(edges);
        // Inner rings are voids, not filled polygons. Valid native BRep topology
        // is required; no winding-dependent boolean union is performed here.
        const filled = (p) => strictInside(p, rings[0], ringEdges[0]) && !rings.slice(1).some((r, i) => isPointInsidePolygon(p, r) || pointDistance(p, ringEdges[i + 1]) <= EPS);
        let best = { gap: Infinity, overlap: cut.some(filled) };
        for (let ri = 0; ri < rings.length; ri++) {
          if (rings[ri].some((p) => strictInside(p, cut, ce))) best.overlap = true;
          for (const [a, b] of ringEdges[ri]) for (const [u, v] of ce) {
            tick(); const gap = segmentToSegmentMinDistance(a, b, u, v);
            if (properCrossing(a, b, u, v)) best.overlap = true;
            if (gap < best.gap) best = { ...best, gap, witness: { pourRing: ri, copperEdge: [a, b], cutoutEdge: [u, v] } };
          }
        }
        if (best.overlap) best.gap = 0;
        add(e, best, [e.layer]);
      }
    }
  }
  const violations = records.filter((r) => r.violation).sort((a, b) => a.edgeClearanceMm - b.edgeClearanceMm);
  const minima = [...new Set(records.flatMap((r) => r.layers.map((l) => `${r.cutout}|${r.type}|${l}`)))].map((key) => {
    const [cutout, type, layer] = key.split("|");
    return { cutout, type, layer, nearest: records.filter((r) => r.cutout === cutout && r.type === type && r.layers.includes(layer)).sort((a, b) => a.edgeClearanceMm - b.edgeClearanceMm)[0] };
  });
  return { ok: violations.length === 0, minimumClearanceMm: minimum, roundingToleranceMm: EPS, comparisons,
    scope: "Trace copper widths, via annuli and filled pour BRep boundaries versus native polygon cutouts only; not a full DRC or pad audit", violations, minima };
}

function selfTest() {
  const board = { type: "pcb_board", num_layers: 4, min_board_edge_clearance: 0.2 };
  const cutout = { type: "pcb_cutout", pcb_cutout_id: "slot", shape: "polygon", points: rect(0, 0, 2, 2) };
  const check = (...e) => auditCutoutClearance([board, cutout, ...e]);
  const trace = (y, width = 0.1) => ({ type: "pcb_trace", pcb_trace_id: "trace", route: [{ route_type: "wire", x: -1, y, width, layer: "top" }, { route_type: "wire", x: 3, y, width: 0.1, layer: "top" }] });
  const via = (y) => ({ type: "pcb_via", pcb_via_id: "via", x: 1, y, outer_diameter: 0.2, hole_diameter: 0.1, layers: ["top", "inner1", "inner2", "bottom"] });
  const pour = (holes = []) => ({ type: "pcb_copper_pour", pcb_copper_pour_id: "pour", shape: "brep", layer: "inner1", brep_shape: { outer_ring: { vertices: rect(-2, -2, 4, 4) }, inner_rings: holes.map((vertices) => ({ vertices })) } });
  assert.equal(check(trace(-0.15)).violations[0].relation, "separated");
  assert(Math.abs(check(trace(-0.25, 0.4)).violations[0].edgeClearanceMm - 0.05) < EPS);
  assert.equal(check(trace(1)).violations[0].relation, "overlap");
  assert.equal(check(via(-0.3)).ok, true);
  assert.equal(check(via(-0.1)).violations[0].relation, "touching");
  assert.equal(check(via(-0.05)).violations[0].relation, "overlap");
  assert.equal(check(pour([rect(-0.3, -0.3, 2.3, 2.3)])).ok, true);
  assert.equal(check(pour([rect(-0.1, -0.1, 2.1, 2.1)])).violations[0].relation, "separated");
  assert.equal(check(pour()).violations[0].relation, "overlap");
  assert.equal(check({ ...pour(), shape: "polygon", points: rect(-1, -1, 0, 1) }).violations[0].relation, "touching");
  const curved = pour(); curved.brep_shape.outer_ring.vertices[0].bulge = 0.2;
  assert.throws(() => check(curved), /Unsupported curved/);
  assert.throws(() => check({ ...pour(), shape: "unknown" }), /Unsupported pour/);
  return { ok: true, syntheticAssertions: 12 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const [file, ...extra] = process.argv.slice(2);
    must(file && extra.length === 0, "Usage from project directory: node checks/audit-cutout-clearance.mjs CIRCUIT.json | --self-test");
    if (file === "--self-test") console.log(JSON.stringify(selfTest()));
    else {
      must(statSync(file).size <= 64 * 1024 * 1024, "Input exceeds bounded 64 MiB audit size");
      const result = auditCutoutClearance(JSON.parse(readFileSync(file, "utf8")));
      console.log(JSON.stringify(result, null, 2)); process.exitCode = result.ok ? 0 : 1;
    }
  } catch (error) { console.error(JSON.stringify({ ok: false, unsupportedOrInvalid: error.message })); process.exitCode = 2; }
}
