/* =====================================================================
   7 x 15 m LOT — TWO-STOREY HOUSE
   Single source of truth for the drawings, the 3D model and the
   material take-off. Every page reads this file; change it here only.

   Units: metres. Levels relative to road crown at front boundary = 0.000
   Plan origin: grid A/1 = centreline of front wall on the left party wall.
     x -> to the right when standing on the street facing the house
     y -> into the lot, from the street towards the rear
   Lot corner (front-left) is at plan (-0.15, -2.90).
   ===================================================================== */
(function () {
  const T20 = Math.tan(20 * Math.PI / 180);

  const LV = {
    road: 0.00, yard: 0.15, gfSlabTop: 0.40, gf: 0.45, landing: 2.10,
    gfCeil: 3.20, ffSlabTop: 3.70, ff: 3.75, ffCeil: 6.60, ring: 6.95,
    parapet: 7.35, footTop: -1.15, footBot: -1.55
  };

  const site = { w: 7.0, d: 15.0, ox: 0.15, oy: 2.90 }; // lot x = plan x + ox, lot y = plan y + oy

  const grid = {
    x: [{ id: 'A', v: 0 }, { id: 'B', v: 5.8 }],
    y: [{ id: '1', v: 0 }, { id: '2', v: 3.8 }, { id: '3', v: 8.0 }, { id: '4', v: 11.0 }]
  };

  /* Hip roof, 20°, eaves 600 on three sides, box gutter on the party wall */
  const roof = { x0: 0.10, x1: 6.50, y0: -0.70, y1: 11.70, pitch: 20, t: T20 };
  roof.eave = 7.10 - 0.60 * T20;              // sheet level at eave edge
  roof.half = (roof.x1 - roof.x0) / 2;
  roof.ridgeX = (roof.x0 + roof.x1) / 2;
  roof.ridgeY0 = roof.y0 + roof.half;
  roof.ridgeY1 = roof.y1 - roof.half;
  roof.ridge = roof.eave + roof.half * T20;
  roof.h = (x, y) => roof.eave + T20 * Math.min(x - roof.x0, roof.x1 - x, y - roof.y0, roof.y1 - y);
  roof.skylight = { x0: 0.55, x1: 1.75, y0: 5.00, y1: 7.00 };

  const canopy = { x0: 2.60, x1: 6.30, y0: -0.90, y1: -0.10, hWall: 4.00, hEdge: 3.78 };

  /* Walls. o: 'h' runs along x at y=c, 'v' runs along y at x=c. s..e = extent.
     t: thickness. out: exterior side (-y street, +y rear, +x passage, -x party).
     fin: exterior finish of the out face. top: optional top level override.   */
  const walls = [
    // ---------- GROUND FLOOR ----------
    { id: 'G1', lv: 'gf', o: 'h', c: 0.0, s: 0.0, e: 2.7, t: 0.2, out: '-y', fin: 'clad' },
    { id: 'G2', lv: 'gf', o: 'v', c: 2.7, s: 0.0, e: 1.2, t: 0.2, out: '+x', fin: 'timber' },
    { id: 'G3', lv: 'gf', o: 'h', c: 1.2, s: 2.7, e: 5.8, t: 0.2, out: '-y', fin: 'render' },
    { id: 'G4', lv: 'gf', o: 'v', c: 0.0, s: 0.0, e: 11.0, t: 0.2, out: '-x', fin: 'render' },
    { id: 'G5', lv: 'gf', o: 'v', c: 5.8, s: 1.2, e: 11.0, t: 0.2, out: '+x', fin: 'render' },
    { id: 'G6', lv: 'gf', o: 'h', c: 11.0, s: 0.0, e: 5.8, t: 0.2, out: '+y', fin: 'render' },
    { id: 'G7', lv: 'gf', o: 'v', c: 2.7, s: 1.2, e: 3.8, t: 0.1 },
    { id: 'G8', lv: 'gf', o: 'h', c: 3.8, s: 0.0, e: 2.7, t: 0.1 },
    { id: 'G9', lv: 'gf', o: 'v', c: 2.1, s: 4.75, e: 11.0, t: 0.1 },
    { id: 'G10', lv: 'gf', o: 'h', c: 8.0, s: 0.0, e: 2.1, t: 0.1 },
    { id: 'G11', lv: 'gf', o: 'v', c: 1.05, s: 4.75, e: 7.0, t: 0.1, note: 'stair spine wall' },
    // ---------- FIRST FLOOR ----------
    { id: 'F1', lv: 'ff', o: 'h', c: 0.0, s: 2.7, e: 5.8, t: 0.2, out: '-y', fin: 'clad' },
    { id: 'F2', lv: 'ff', o: 'v', c: 2.7, s: 0.0, e: 1.2, t: 0.2, out: '-x', fin: 'clad' },
    { id: 'F3', lv: 'ff', o: 'h', c: 1.2, s: 0.0, e: 2.7, t: 0.2, out: '-y', fin: 'timber' },
    { id: 'F4', lv: 'ff', o: 'v', c: 0.0, s: 0.0, e: 11.0, t: 0.2, out: '-x', fin: 'render', top: LV.parapet, note: 'party wall, rises as parapet' },
    { id: 'F5', lv: 'ff', o: 'v', c: 5.8, s: 0.0, e: 3.8, t: 0.2, out: '+x', fin: 'clad' },
    { id: 'F6', lv: 'ff', o: 'v', c: 5.8, s: 3.8, e: 11.0, t: 0.2, out: '+x', fin: 'render' },
    { id: 'F7', lv: 'ff', o: 'h', c: 11.0, s: 0.0, e: 5.8, t: 0.2, out: '+y', fin: 'render' },
    { id: 'F8', lv: 'ff', o: 'v', c: 2.7, s: 1.2, e: 3.8, t: 0.1 },
    { id: 'F9', lv: 'ff', o: 'h', c: 3.8, s: 2.7, e: 5.8, t: 0.1 },
    { id: 'F10', lv: 'ff', o: 'v', c: 3.3, s: 3.8, e: 8.0, t: 0.1 },
    { id: 'F11', lv: 'ff', o: 'h', c: 5.9, s: 3.3, e: 5.8, t: 0.1 },
    { id: 'F12', lv: 'ff', o: 'h', c: 8.0, s: 0.0, e: 5.8, t: 0.1 },
    { id: 'F13', lv: 'ff', o: 'v', c: 2.1, s: 4.75, e: 8.0, t: 0.1, low: 1.0, note: 'stair half-wall, 1000 high, timber cap' }
  ];

  /* Opening types (sizes in m). head/sill above the floor finish of that level. */
  const types = {
    D01: { kind: 'door', w: 1.00, sill: 0, head: 2.40, name: 'Main entry door', spec: 'Solid engineered timber (merbau/teak veneer), 50 mm, stainless pivot or 3 hinges, multi-point lock, weather seal' },
    D02: { kind: 'door', w: 0.80, sill: 0, head: 2.10, name: 'Bedroom door', spec: 'Solid-core flush timber, 40 mm, painted/laminate, hardwood frame, lever lockset' },
    D03: { kind: 'door', w: 0.70, sill: 0, head: 2.10, name: 'Bathroom door', spec: 'WPC or aluminium frame door, moisture-proof, privacy lock, 20 mm threshold' },
    D05: { kind: 'door', w: 0.80, sill: 0, head: 2.10, name: 'Rear service door', spec: 'Powder-coated aluminium, lower solid panel, upper frosted glass, security bar' },
    SD01: { kind: 'slider', w: 1.60, sill: 0, head: 2.40, name: 'Living sliding door', spec: '2-panel black aluminium slider, 8 mm toughened clear glass, flyscreen, key lock' },
    SD02: { kind: 'slider', w: 2.10, sill: 0, head: 2.40, name: 'Lounge-to-balcony slider', spec: '2-panel black aluminium slider, 8 mm toughened clear glass, raised weather sill' },
    W01: { kind: 'window', w: 1.90, sill: 1.00, head: 2.00, name: 'Guest room window', spec: 'Black aluminium, 1 fixed + 1 sliding sash, 6 mm clear, flyscreen' },
    W02: { kind: 'window', w: 1.40, sill: 1.05, head: 2.10, name: 'Kitchen window', spec: 'Black aluminium, 2 sliding sashes, 6 mm clear, flyscreen' },
    W03: { kind: 'louvre', w: 0.70, sill: 1.60, head: 2.10, name: 'Bathroom louvre', spec: 'Aluminium glass louvre, 6 mm frosted, flyscreen' },
    W04: { kind: 'window', w: 1.60, sill: 0.90, head: 2.40, name: 'Dining window', spec: 'Black aluminium, 2 sliding sashes, 6 mm clear, flyscreen' },
    W05: { kind: 'window', w: 1.80, sill: 0.60, head: 2.40, name: 'Bedroom 2 picture window', spec: 'Black aluminium, fixed centre + 2 casements, 6 mm toughened low-E' },
    W06: { kind: 'window', w: 0.60, sill: 0.90, head: 2.10, name: 'Bedroom 2 small window', spec: 'Black aluminium, fixed, 6 mm clear' },
    W07: { kind: 'window', w: 1.20, sill: 0.90, head: 2.10, name: 'Bedroom side window', spec: 'Black aluminium, 2 sliding sashes, 6 mm clear, flyscreen' },
    W08: { kind: 'louvre', w: 0.80, sill: 1.50, head: 2.10, name: 'Bathroom high window', spec: 'Aluminium awning/louvre, 6 mm frosted, flyscreen' },
    W09: { kind: 'window', w: 2.20, sill: 0.60, head: 2.40, name: 'Master bedroom window', spec: 'Black aluminium, 2 fixed + 2 sliding, 6 mm clear, flyscreen' }
  };

  /* Openings: placed on a wall line. swing: side the leaf opens into. hinge: 's' or 'e' end. */
  const openings = [
    { t: 'W01', lv: 'gf', o: 'h', c: 0.0, s: 0.40, e: 2.30 },
    { t: 'D01', lv: 'gf', o: 'h', c: 1.2, s: 2.85, e: 3.85, swing: '+y', hinge: 's' },
    { t: 'SD01', lv: 'gf', o: 'h', c: 1.2, s: 4.05, e: 5.65 },
    { t: 'D02', lv: 'gf', o: 'h', c: 3.8, s: 1.10, e: 1.90, swing: '-y', hinge: 'e' },
    { t: 'D03', lv: 'gf', o: 'v', c: 2.1, s: 8.25, e: 8.95, swing: '-x', hinge: 'e' },
    { t: 'W04', lv: 'gf', o: 'v', c: 5.8, s: 5.60, e: 7.20 },
    { t: 'W03', lv: 'gf', o: 'h', c: 11.0, s: 0.70, e: 1.40 },
    { t: 'W02', lv: 'gf', o: 'h', c: 11.0, s: 3.00, e: 4.40 },
    { t: 'D05', lv: 'gf', o: 'h', c: 11.0, s: 4.75, e: 5.55, swing: '+y', hinge: 'e' },

    { t: 'SD02', lv: 'ff', o: 'h', c: 1.2, s: 0.30, e: 2.40, tagIn: true },
    { t: 'W06', lv: 'ff', o: 'h', c: 0.0, s: 2.95, e: 3.55 },
    { t: 'W05', lv: 'ff', o: 'h', c: 0.0, s: 3.80, e: 5.60 },
    { t: 'W07', lv: 'ff', o: 'v', c: 5.8, s: 1.80, e: 3.00 },
    { t: 'D02', lv: 'ff', o: 'v', c: 2.7, s: 2.80, e: 3.60, swing: '+x', hinge: 'e' },
    { t: 'D03', lv: 'ff', o: 'v', c: 3.3, s: 4.90, e: 5.60, swing: '+x', hinge: 's' },
    { t: 'W08', lv: 'ff', o: 'v', c: 5.8, s: 4.40, e: 5.20 },
    { t: 'W08', lv: 'ff', o: 'v', c: 5.8, s: 6.60, e: 7.40 },
    { t: 'D02', lv: 'ff', o: 'h', c: 8.0, s: 2.30, e: 3.10, swing: '+y', hinge: 's' },
    { t: 'D03', lv: 'ff', o: 'h', c: 8.0, s: 4.40, e: 5.10, swing: '-y', hinge: 'e' },
    { t: 'W07', lv: 'ff', o: 'v', c: 5.8, s: 9.20, e: 10.40 },
    { t: 'W09', lv: 'ff', o: 'h', c: 11.0, s: 1.60, e: 3.80 }
  ];

  /* Finish codes */
  const finishes = {
    floor: {
      F1: '600×600 polished porcelain tile on 40 mm sand-cement screed',
      F2: '300×300 anti-slip matt ceramic, laid to falls (1:100) to floor drain, on waterproof membrane',
      F3: '600×600 anti-slip outdoor porcelain (R11), laid to falls away from doors',
      F4: '200×1200 wood-look porcelain plank on screed',
      F5: 'Stair: 30 mm granite or wood-look porcelain tread + 20 mm riser, anti-slip nosing'
    },
    wall: {
      W1: '15 mm cement plaster, skim coat, 1 primer + 2 coats washable emulsion',
      W2: '300×600 glazed ceramic wall tile to 2400 mm on waterproofing (shower zone to 1800 mm min.)',
      W3: 'External: 15 mm render, 1 sealer + 2 coats exterior acrylic, warm light grey'
    },
    ceil: {
      C1: '9 mm gypsum board on concealed steel grid, painted white',
      C2: '9 mm moisture-resistant gypsum / 4.5 mm fibre-cement, painted, with exhaust fan',
      C3: '4.5 mm fibre-cement soffit lining, painted, with LED downlights (external)'
    }
  };

  /* Rooms: rectangles to wall centreline. elec = lights / sockets / AC / exhaust fan / water heater / data */
  const rooms = [
    { id: 'G-01', lv: 'gf', name: 'Guest Bedroom', r: [[0, 0, 2.7, 3.8]], fl: 'F1', wl: 'W1', cl: 'C1', elec: { L: 2, S: 4, AC: 1 } },
    { id: 'G-02', lv: 'gf', name: 'Porch', r: [[2.7, 0, 5.8, 1.2]], lab: [3.55, 0.42], compact: true, fl: 'F3', wl: 'W3', cl: 'C3', out: true, elec: { L: 2, S: 1 } },
    { id: 'G-03', lv: 'gf', name: 'Living', r: [[2.7, 1.2, 5.8, 3.8], [2.1, 3.8, 5.8, 5.2]], lab: [4.25, 2.5], fl: 'F1', wl: 'W1', cl: 'C1', elec: { L: 4, S: 6, AC: 1, D: 1 } },
    { id: 'G-04', lv: 'gf', name: 'Dining', r: [[2.1, 5.2, 5.8, 7.8]], fl: 'F1', wl: 'W1', cl: 'C1', elec: { L: 2, S: 2 } },
    { id: 'G-05', lv: 'gf', name: 'Kitchen', r: [[2.1, 7.8, 5.8, 11.0]], lab: [3.7, 9.2], fl: 'F1', wl: 'W1', cl: 'C1', elec: { L: 3, S: 6 } },
    { id: 'G-06', lv: 'gf', name: 'Bathroom', r: [[0, 8.0, 2.1, 11.0]], lab: [1.05, 9.6], fl: 'F2', wl: 'W2', cl: 'C2', wet: true, elec: { L: 1, S: 0, F: 1, H: 1 } },
    { id: 'G-07', lv: 'gf', name: 'Stair', r: [[0, 3.8, 2.1, 8.0]], lab: [0.55, 4.35], fl: 'F5', wl: 'W1', cl: 'C1', stair: true, elec: { L: 2, S: 1 } },

    { id: 'F-01', lv: 'ff', name: 'Balcony', r: [[0, 0, 2.7, 1.2]], lab: [1.35, 0.52], compact: true, fl: 'F3', wl: 'W3', cl: 'C3', out: true, elec: { L: 1, S: 1 } },
    { id: 'F-02', lv: 'ff', name: 'Family Lounge', r: [[0, 1.2, 2.7, 3.8]], lab: [1.55, 2.5], fl: 'F4', wl: 'W1', cl: 'C1', elec: { L: 2, S: 3, D: 1 } },
    { id: 'F-03', lv: 'ff', name: 'Bedroom 2', r: [[2.7, 0, 5.8, 3.8]], lab: [4.4, 0.95], fl: 'F4', wl: 'W1', cl: 'C1', elec: { L: 2, S: 4, AC: 1 } },
    { id: 'F-04', lv: 'ff', name: 'Landing', r: [[0, 3.8, 2.1, 8.0]], lab: [0.55, 4.35], fl: 'F5', wl: 'W1', cl: 'C1', stair: true, elec: { L: 1, S: 0 } },
    { id: 'F-05', lv: 'ff', name: 'Hall', r: [[2.1, 3.8, 3.3, 8.0]], lab: [2.7, 6.9], fl: 'F4', wl: 'W1', cl: 'C1', elec: { L: 2, S: 1 } },
    { id: 'F-06', lv: 'ff', name: 'Bathroom 2', r: [[3.3, 3.8, 5.8, 5.9]], fl: 'F2', wl: 'W2', cl: 'C2', wet: true, elec: { L: 1, S: 0, F: 1, H: 1 } },
    { id: 'F-07', lv: 'ff', name: 'Ensuite', r: [[3.3, 5.9, 5.8, 8.0]], fl: 'F2', wl: 'W2', cl: 'C2', wet: true, elec: { L: 1, S: 0, F: 1, H: 1 } },
    { id: 'F-08', lv: 'ff', name: 'Master Bedroom', r: [[0, 8.0, 5.8, 11.0]], lab: [3.9, 9.35], fl: 'F4', wl: 'W1', cl: 'C1', elec: { L: 3, S: 5, AC: 1, D: 1 } }
  ];

  /* Furniture and fixtures (plan rectangles, height h). k = kind */
  const furniture = [
    // GF
    { lv: 'gf', k: 'bed', r: [0.15, 1.30, 2.15, 2.80], h: 0.5 },
    { lv: 'gf', k: 'wardrobe', r: [0.15, 3.15, 1.05, 3.75], h: 2.2 },
    { lv: 'gf', k: 'desk', r: [0.45, 0.15, 1.65, 0.65], h: 0.75 },
    { lv: 'gf', k: 'sofa', r: [3.10, 2.40, 4.00, 4.60], h: 0.8 },
    { lv: 'gf', k: 'table', r: [4.30, 3.00, 4.90, 4.00], h: 0.4 },
    { lv: 'gf', k: 'tv', r: [5.35, 2.60, 5.75, 4.20], h: 0.5 },
    { lv: 'gf', k: 'dining', r: [3.20, 6.00, 4.80, 6.90], h: 0.75 },
    { lv: 'gf', k: 'counter', r: [2.90, 10.30, 4.55, 10.90], h: 0.9, sink: true },
    { lv: 'gf', k: 'fridge', r: [2.15, 10.25, 2.85, 10.90], h: 1.8 },
    { lv: 'gf', k: 'counter', r: [5.15, 7.90, 5.75, 9.90], h: 0.9, hob: true },
    { lv: 'gf', k: 'shower', r: [0.15, 9.95, 1.05, 10.90], h: 0.05 },
    { lv: 'gf', k: 'wc', r: [0.15, 8.65, 0.85, 9.05], h: 0.8 },
    { lv: 'gf', k: 'basin', r: [1.50, 10.25, 2.05, 10.75], h: 0.85 },
    { lv: 'gf', k: 'plant', r: [5.30, 0.20, 5.70, 0.60], h: 0.9 },
    { lv: 'gf', k: 'chair', r: [4.40, 0.25, 5.00, 0.85], h: 0.8 },
    // FF
    { lv: 'ff', k: 'sofa', r: [0.15, 1.70, 0.95, 3.50], h: 0.8 },
    { lv: 'ff', k: 'table', r: [1.25, 2.30, 1.75, 3.00], h: 0.4 },
    { lv: 'ff', k: 'chair', r: [0.35, 0.30, 0.95, 0.90], h: 0.8 },
    { lv: 'ff', k: 'chair', r: [1.45, 0.30, 2.05, 0.90], h: 0.8 },
    { lv: 'ff', k: 'bed', r: [3.60, 1.75, 5.20, 3.75], h: 0.5 },
    { lv: 'ff', k: 'wardrobe', r: [2.75, 0.15, 3.35, 1.95], h: 2.2 },
    { lv: 'ff', k: 'shower', r: [4.55, 3.85, 5.75, 4.95], h: 0.05 },
    { lv: 'ff', k: 'wc', r: [5.05, 5.10, 5.75, 5.50], h: 0.8 },
    { lv: 'ff', k: 'basin', r: [4.10, 5.40, 4.70, 5.85], h: 0.85 },
    { lv: 'ff', k: 'shower', r: [3.35, 5.95, 4.35, 6.95], h: 0.05 },
    { lv: 'ff', k: 'wc', r: [5.05, 6.30, 5.75, 6.70], h: 0.8 },
    { lv: 'ff', k: 'basin', r: [3.35, 7.10, 3.85, 7.70], h: 0.85 },
    { lv: 'ff', k: 'wardrobe', r: [0.15, 8.05, 2.05, 8.65], h: 2.2 },
    { lv: 'ff', k: 'bed', r: [0.15, 8.75, 2.15, 10.55], h: 0.5 },
    { lv: 'ff', k: 'desk', r: [4.10, 10.40, 5.30, 10.90], h: 0.75 },
    { lv: 'ff', k: 'chair', r: [5.00, 8.60, 5.60, 9.20], h: 0.8 }
  ];

  /* U-stair: 20 risers x 165 = 3300, going 250, clear width ~900–950 */
  const stair = {
    risers: 20, rise: 0.165, going: 0.25,
    f1: { x0: 0.10, x1: 1.00, yStart: 4.75, dir: +1, n: 10, z0: LV.gf },           // GF -> landing
    landing: { x0: 0.10, x1: 2.05, y0: 7.00, y1: 7.95, z: LV.landing },
    f2: { x0: 1.10, x1: 2.05, yStart: 7.00, dir: -1, n: 10, z0: LV.landing },      // landing -> FF
    topLanding: { x0: 0.10, x1: 2.05, y0: 3.85, y1: 4.75 },
    void: { x0: 0.10, x1: 2.05, y0: 4.75, y1: 7.95 }
  };

  /* ---------------- STRUCTURE (reinforced concrete frame) ---------------- */
  const S = {};
  S.columns = [
    ...[0, 3.8, 8.0, 11.0].map((y, i) => ({ m: 'C1', x: 0, y, b: 0.25, d: 0.25, z0: LV.footBot + 0.4, z1: LV.ring, grid: 'A' + (i + 1) })),
    ...[0, 3.8, 8.0, 11.0].map((y, i) => ({ m: 'C1', x: 5.8, y, b: 0.25, d: 0.25, z0: LV.footBot + 0.4, z1: LV.ring, grid: 'B' + (i + 1) })),
    { m: 'C2', x: 2.1, y: 8.0, b: 0.20, d: 0.20, z0: LV.footBot + 0.35, z1: LV.ffSlabTop, grid: 'stair' }
  ];
  S.footings = [
    ...[0, 3.8, 8.0, 11.0].map(y => ({ m: 'F2', x0: -0.125, x1: 0.875, y0: y - 0.9, y1: y + 0.9, th: 0.40 })),
    ...[0, 3.8, 8.0, 11.0].map(y => ({ m: 'F1', x0: 5.05, x1: 6.55, y0: y - 0.75, y1: y + 0.75, th: 0.40 })),
    { m: 'F3', x0: 1.60, x1: 2.60, y0: 7.50, y1: 8.50, th: 0.35 }
  ];
  const beam = (m, o, c, s, e, b, d, top) => ({ m, o, c, s, e, b, d, top });
  S.groundBeams = [
    ...[0, 3.8, 8.0, 11.0].map(y => beam('SB1', 'h', y, 0, 5.8, 0.25, 0.50, LV.gfSlabTop)),
    beam('GB1', 'v', 0, 0, 11, 0.20, 0.40, LV.gfSlabTop),
    beam('GB1', 'v', 5.8, 0, 11, 0.20, 0.40, LV.gfSlabTop),
    beam('GB2', 'v', 2.7, 0, 3.8, 0.20, 0.30, LV.gfSlabTop),
    beam('GB2', 'h', 1.2, 2.7, 5.8, 0.20, 0.30, LV.gfSlabTop),
    beam('GB2', 'v', 2.1, 3.8, 11, 0.20, 0.30, LV.gfSlabTop),
    beam('GB2', 'v', 1.05, 3.8, 8.0, 0.20, 0.30, LV.gfSlabTop)
  ];
  S.floorBeams = [
    ...[0, 3.8, 8.0, 11.0].map(y => beam('B1', 'h', y, 0, 5.8, 0.25, 0.50, LV.ffSlabTop)),
    beam('B2', 'v', 0, 0, 11, 0.20, 0.40, LV.ffSlabTop),
    beam('B2', 'v', 5.8, 0, 11, 0.20, 0.40, LV.ffSlabTop),
    beam('B3', 'v', 2.7, 0, 3.8, 0.20, 0.35, LV.ffSlabTop),
    beam('B3', 'h', 1.2, 0, 2.7, 0.20, 0.35, LV.ffSlabTop),
    beam('B3', 'v', 2.1, 3.8, 8.0, 0.20, 0.35, LV.ffSlabTop),
    beam('B3', 'h', 4.75, 0, 2.1, 0.20, 0.35, LV.ffSlabTop),
    beam('B3', 'v', 3.3, 3.8, 8.0, 0.20, 0.35, LV.ffSlabTop),
    beam('B3', 'h', 5.9, 3.3, 5.8, 0.20, 0.35, LV.ffSlabTop),
    beam('LB1', 'h', 7.95, 0, 2.1, 0.20, 0.30, LV.landing - 0.05)
  ];
  S.ringBeams = [
    ...[0, 3.8, 8.0, 11.0].map(y => beam('RB1', 'h', y, 0, 5.8, 0.20, 0.30, LV.ring)),
    beam('RB1', 'v', 0, 0, 11, 0.20, 0.30, LV.ring),
    beam('RB1', 'v', 5.8, 0, 11, 0.20, 0.30, LV.ring),
    beam('RB1', 'h', 1.2, 0, 2.7, 0.20, 0.30, LV.ring),
    beam('RB1', 'v', 2.7, 0, 1.2, 0.20, 0.30, LV.ring)
  ];
  S.slabs = {
    gf: { m: 'S0', th: 0.10, x0: -0.1, x1: 5.9, y0: -0.1, y1: 11.1 },
    ff: { m: 'S1', th: 0.12, x0: 0, x1: 5.8, y0: 0, y1: 11.0, hole: stair.void },
    balcony: { m: 'S2', x0: 0, x1: 2.7, y0: 0, y1: 1.2, drop: 0.05 }
  };
  S.schedule = [
    { m: 'F1', size: '1500 × 1500 × 400', rebar: 'DB12 @ 150 both ways, bottom; 50 cover to lean', note: 'Pad footing, grid B (4 no.)' },
    { m: 'F2', size: '1000 × 1800 × 400', rebar: 'DB12 @ 125 both ways, bottom; column starter on boundary edge', note: 'Eccentric footing flush with party boundary, grid A (4 no.)' },
    { m: 'F3', size: '1000 × 1000 × 350', rebar: 'DB12 @ 150 both ways', note: 'Stair column footing (1 no.)' },
    { m: 'SB1', size: '250 × 500', rebar: 'T 3-DB16, B 3-DB16, links RB6 @ 150 (@ 100 within 1 m of col.)', note: 'Strap beams A–B on grids 1–4, balance eccentric F2' },
    { m: 'GB1', size: '200 × 400', rebar: 'T 2-DB12, B 3-DB12, links RB6 @ 150', note: 'Ground beams on grids A and B' },
    { m: 'GB2', size: '200 × 300', rebar: 'T 2-DB12, B 2-DB12, links RB6 @ 200', note: 'Under internal ground floor walls' },
    { m: 'C1', size: '250 × 250', rebar: '4-DB16 + 4-DB12, ties RB6 @ 100 (ends) / 150 (mid)', note: 'Main columns, footing to ring beam (8 no.)' },
    { m: 'C2', size: '200 × 200', rebar: '4-DB12, ties RB6 @ 150', note: 'Stair column, footing to first floor (1 no.)' },
    { m: 'B1', size: '250 × 500', rebar: 'T 2-DB16 + 2-DB16 extra at supports (L/3), B 3-DB16, links RB6 @ 100/150', note: 'Primary beams, span 5.8 m, grids 1–4' },
    { m: 'B2', size: '200 × 400', rebar: 'T 2-DB16, B 3-DB16, links RB6 @ 150', note: 'Edge beams grids A and B' },
    { m: 'B3', size: '200 × 350', rebar: 'T 2-DB12, B 2-DB16, links RB6 @ 150', note: 'Secondary beams under first floor walls and stair trimmers' },
    { m: 'LB1', size: '200 × 300', rebar: 'T 2-DB12, B 3-DB12, links RB6 @ 150', note: 'Stair landing beam A3–C2' },
    { m: 'RB1', size: '200 × 300', rebar: 'T 2-DB12, B 2-DB12, links RB6 @ 200', note: 'Roof ring / tie beams, truss cast-in plates @ 1200' },
    { m: 'S0', size: '100 slab on grade', rebar: 'DB10 @ 250 both ways, mid-depth', note: 'On 0.2 mm polythene DPM, 50 sand blinding, compacted fill (95% MDD)' },
    { m: 'S1', size: '120 suspended slab', rebar: 'B DB10 @ 200 both ways; T DB10 @ 200 over beams for L/4', note: 'First floor. Stair void 1950 × 3200' },
    { m: 'S2', size: '120 slab, set down 50', rebar: 'As S1', note: 'Balcony: falls 1:100 to outlet, waterproof membrane' },
    { m: 'ST1', size: '150 waist, 20R × 165 / 250 going', rebar: 'Main DB12 @ 150, distribution DB10 @ 200, top & bottom at landing', note: 'U-stair with brick spine wall' },
    { m: 'L1', size: '100/200 × 150 lintel', rebar: '2-DB10 bottom, RB6 @ 200', note: 'Over every opening not under a beam, 200 bearing each side' },
    { m: 'TC1', size: '100/200 × 150 stiffener', rebar: '4-DB10, RB6 @ 200', note: 'At free wall ends, door jambs, and max 3.0 m along brick walls' }
  ];

  const siteItems = {
    path: { x0: 2.75, x1: 3.95, y0: -2.9, y1: -0.6 },         
    steps: { x0: 2.75, x1: 3.95, y0: -0.6, y1: 0.0 },
    forecourt: { x0: 4.10, x1: 6.85, y0: -2.9, y1: -1.4 },
    bedFront: { x0: -0.15, x1: 2.60, y0: -1.1, y1: -0.1 },
    septic: { x0: 4.60, x1: 6.60, y0: -2.35, y1: -1.35 },
    tank: { x: 6.35, y: 11.55, r: 0.48 },
    meterW: { x: 6.55, y: -2.85 }, meterE: { x: -0.05, y: -2.85 }
  };
  const lvZ = lv => (lv === 'gf' ? LV.gf : LV.ff);
  const rectArea = r => (r[2] - r[0]) * (r[3] - r[1]);
  const roomArea = rm => rm.r.reduce((a, r) => a + rectArea(r), 0);
  const wallLen = w => w.e - w.s;
  const openingsOn = w => openings.filter(o => o.lv === w.lv && o.o === w.o && Math.abs(o.c - w.c) < 1e-6 && o.s >= w.s - 1e-6 && o.e <= w.e + 1e-6);

  window.HOUSE = {
    name: 'Two-Storey House, 7 × 15 m Lot',
    LV, site, grid, roof, canopy, walls, types, openings, finishes, rooms, furniture, stair, S, siteItems,
    lvZ, rectArea, roomArea, wallLen, openingsOn, T20
  };
})();
