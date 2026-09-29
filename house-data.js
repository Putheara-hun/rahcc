/* =====================================================================
   7 x 15 m LOT — TWO-STOREY HOUSE
   Single source of truth for the drawings, the 3D model and the
   material take-off. Every page reads this file; change it here only.

   Units: metres. Levels relative to road crown at front boundary = 0.000
   Plan origin: grid A/1 = centreline of front wall on the left party wall.
     x -> to the right when standing on the street facing the house
     y -> into the lot, from the street towards the rear
   Lot 10 x 20 m. Lot corner (front-left) is at plan (-0.15, -6.00).
   ===================================================================== */
(function () {
  const T20 = Math.tan(20 * Math.PI / 180);

  const LV = {
    road: 0.00, yard: 0.15, gfSlabTop: 0.40, gf: 0.45, landing: 2.10,
    gfCeil: 3.20, ffSlabTop: 3.70, ff: 3.75, landing2: 5.40, ffCeil: 6.60,
    ring: 7.00,        // top of roof slab and roof beams
    roof: 7.05,        // stair-house floor, top of the stair (20 risers above FF)
    deck: 7.20,        // terrace deck on pedestals (150 above stair-house floor, door has upstand threshold)
    parapet: 7.50,     // top of solid parapet
    rail: 8.30,        // top of railing, 1100 above terrace deck
    shSlab: 9.75,      // top of stair-house roof slab
    shTop: 9.95,       // top of stair-house parapet (highest point)
    footTop: -1.15, footBot: -1.55
  };

  const site = { w: 10.0, d: 20.0, ox: 0.15, oy: 6.00 }; // lot x = plan x + ox, lot y = plan y + oy

  const grid = {
    x: [{ id: 'A', v: 0 }, { id: 'B', v: 5.8 }],
    y: [{ id: '1', v: 0 }, { id: '2', v: 3.8 }, { id: '3', v: 8.0 }, { id: '4', v: 11.0 }]
  };

  /* Flat roof terrace: 150 RC slab, PU membrane, 50 XPS, screed to falls 1:100, deck tiles on pedestals.
     Parapet 450 + steel railing to 1100 above deck. Stair house over the stair gives access. */
  const roof = {
    type: 'flat', x0: -0.1, x1: 5.9, y0: -0.1, y1: 11.1, top: LV.shTop,
    stairHouse: { x0: -0.1, x1: 2.2, y0: 3.7, y1: 8.1 },
    outlets: [[5.45, 0.35], [5.45, 10.65], [0.35, 0.35], [0.35, 10.65]],   // roof drains, each to a 90 mm downpipe
    downpipes: [[6.0, 0.35], [6.0, 10.65], [0.3, -0.2], [0.3, 11.2]],       // right pair in the passage, left pair on front/rear faces
    rails: [                                                              // railing lines on the parapet
      { o: 'h', c: 0.0, s: 0.1, e: 5.7 }, { o: 'v', c: 5.8, s: 0.1, e: 10.9 }, { o: 'h', c: 11.0, s: 0.1, e: 5.7 }
    ]
  };

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
    { id: 'F4', lv: 'ff', o: 'v', c: 0.0, s: 0.0, e: 11.0, t: 0.2, out: '-x', fin: 'render', note: 'party wall' },
    { id: 'F5', lv: 'ff', o: 'v', c: 5.8, s: 0.0, e: 3.8, t: 0.2, out: '+x', fin: 'clad' },
    { id: 'F6', lv: 'ff', o: 'v', c: 5.8, s: 3.8, e: 11.0, t: 0.2, out: '+x', fin: 'render' },
    { id: 'F7', lv: 'ff', o: 'h', c: 11.0, s: 0.0, e: 5.8, t: 0.2, out: '+y', fin: 'render' },
    { id: 'F8', lv: 'ff', o: 'v', c: 2.7, s: 1.2, e: 3.8, t: 0.1 },
    { id: 'F9', lv: 'ff', o: 'h', c: 3.8, s: 2.7, e: 5.8, t: 0.1 },
    { id: 'F10', lv: 'ff', o: 'v', c: 3.3, s: 3.8, e: 8.0, t: 0.1 },
    { id: 'F11', lv: 'ff', o: 'h', c: 5.9, s: 3.3, e: 5.8, t: 0.1 },
    { id: 'F12', lv: 'ff', o: 'h', c: 8.0, s: 0.0, e: 5.8, t: 0.1 },
    { id: 'F13', lv: 'ff', o: 'v', c: 2.1, s: 4.75, e: 8.0, t: 0.1, note: 'stair enclosure wall' },
    { id: 'F14', lv: 'ff', o: 'v', c: 1.05, s: 4.75, e: 7.0, t: 0.1, note: 'stair spine wall' },
    // ---------- ROOF TERRACE (walls stand on the roof slab at +7.000) ----------
    { id: 'R1', lv: 'rf', o: 'h', c: 0.0, s: 0.0, e: 5.8, t: 0.2, out: '-y', fin: 'render', top: LV.parapet, note: 'parapet + railing' },
    { id: 'R2', lv: 'rf', o: 'v', c: 5.8, s: 0.0, e: 11.0, t: 0.2, out: '+x', fin: 'render', top: LV.parapet, note: 'parapet + railing' },
    { id: 'R3', lv: 'rf', o: 'h', c: 11.0, s: 0.0, e: 5.8, t: 0.2, out: '+y', fin: 'render', top: LV.parapet, note: 'parapet + railing' },
    { id: 'R4', lv: 'rf', o: 'v', c: 0.0, s: 0.0, e: 3.8, t: 0.2, out: '-x', fin: 'render', top: LV.rail, note: 'party-wall parapet, solid 1100' },
    { id: 'R5', lv: 'rf', o: 'v', c: 0.0, s: 3.8, e: 8.0, t: 0.2, out: '-x', fin: 'render', top: LV.shTop, note: 'stair house' },
    { id: 'R6', lv: 'rf', o: 'v', c: 0.0, s: 8.0, e: 11.0, t: 0.2, out: '-x', fin: 'render', top: LV.rail, note: 'party-wall parapet, solid 1100' },
    { id: 'R7', lv: 'rf', o: 'h', c: 3.8, s: 0.0, e: 2.1, t: 0.2, out: '-y', fin: 'render', top: LV.shTop, note: 'stair house' },
    { id: 'R8', lv: 'rf', o: 'h', c: 8.0, s: 0.0, e: 2.1, t: 0.2, out: '+y', fin: 'render', top: LV.shTop, note: 'stair house' },
    { id: 'R9', lv: 'rf', o: 'v', c: 2.1, s: 3.8, e: 8.0, t: 0.2, out: '+x', fin: 'render', top: LV.shTop, note: 'stair house, door to terrace' }
  ];

  /* Opening types (sizes in m). head/sill above the floor finish of that level. */
  const types = {
    D01: { kind: 'door', w: 1.00, sill: 0, head: 2.40, name: 'Main entry door', spec: 'Solid engineered timber (merbau/teak veneer), 50 mm, stainless pivot or 3 hinges, multi-point lock, weather seal' },
    D02: { kind: 'door', w: 0.80, sill: 0, head: 2.10, name: 'Bedroom door', spec: 'Solid-core flush timber, 40 mm, painted/laminate, hardwood frame, lever lockset' },
    D03: { kind: 'door', w: 0.70, sill: 0, head: 2.10, name: 'Bathroom door', spec: 'WPC or aluminium frame door, moisture-proof, privacy lock, 20 mm threshold' },
    D04: { kind: 'door', w: 0.70, sill: 0, head: 2.10, name: 'Wardrobe door', spec: 'Solid-core flush timber, 40 mm, painted, hardwood frame, passage lever' },
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
    W09: { kind: 'window', w: 2.20, sill: 0.60, head: 2.40, name: 'Master bedroom window', spec: 'Black aluminium, 2 fixed + 2 sliding, 6 mm clear, flyscreen' },
    D06: { kind: 'door', w: 0.80, sill: 0, head: 2.10, name: 'Roof terrace door', spec: 'Powder-coated aluminium or galvanised steel, weather-stripped, 150 upstand threshold, lever lock' },
    W10: { kind: 'window', w: 1.20, sill: 0.90, head: 2.10, name: 'Stair house window', spec: 'Black aluminium, 2 sliding sashes, 6 mm clear, flyscreen' }
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
    { t: 'D03', lv: 'ff', o: 'h', c: 5.9, s: 3.40, e: 4.05, swing: '-y', hinge: 's' },
    { t: 'W08', lv: 'ff', o: 'v', c: 5.8, s: 4.40, e: 5.20 },
    { t: 'W08', lv: 'ff', o: 'v', c: 5.8, s: 6.60, e: 7.40 },
    { t: 'D02', lv: 'ff', o: 'h', c: 8.0, s: 2.30, e: 3.10, swing: '+y', hinge: 's' },
    { t: 'D04', lv: 'ff', o: 'h', c: 8.0, s: 4.40, e: 5.10, swing: '-y', hinge: 'e' },
    { t: 'W07', lv: 'ff', o: 'v', c: 5.8, s: 9.20, e: 10.40 },
    { t: 'W09', lv: 'ff', o: 'h', c: 11.0, s: 1.60, e: 3.80 },

    { t: 'D06', lv: 'rf', o: 'v', c: 2.1, s: 3.95, e: 4.75, swing: '+x', hinge: 's' },
    { t: 'W10', lv: 'rf', o: 'v', c: 2.1, s: 5.90, e: 7.10 }
  ];

  /* Finish codes */
  const finishes = {
    floor: {
      F1: '600×600 polished porcelain tile on 40 mm sand-cement screed',
      F2: '300×300 anti-slip matt ceramic, laid to falls (1:100) to floor drain, on waterproof membrane',
      F3: '600×600 anti-slip outdoor porcelain (R11), laid to falls away from doors',
      F4: '200×1200 wood-look porcelain plank on screed',
      F5: 'Stair: 30 mm granite or wood-look porcelain tread + 20 mm riser, anti-slip nosing',
      F6: 'Roof deck: 600×600 WPC or porcelain deck tiles on adjustable pedestals, over 2-coat PU waterproofing, 50 mm XPS insulation and screed to falls 1:100 (min. 40 mm at outlets)'
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
    { id: 'F-06', lv: 'ff', name: 'Master Bathroom', r: [[3.3, 3.8, 5.8, 5.9]], fl: 'F2', wl: 'W2', cl: 'C2', wet: true, elec: { L: 1, S: 0, F: 1, H: 1 } },
    { id: 'F-07', lv: 'ff', name: 'Walk-in Wardrobe', r: [[3.3, 5.9, 5.8, 8.0]], lab: [4.55, 7.35], fl: 'F4', wl: 'W1', cl: 'C1', elec: { L: 1, S: 1 } },
    { id: 'F-08', lv: 'ff', name: 'Master Bedroom', r: [[0, 8.0, 5.8, 11.0]], lab: [3.9, 9.35], fl: 'F4', wl: 'W1', cl: 'C1', elec: { L: 3, S: 5, AC: 1, D: 1 } },

    { id: 'R-01', lv: 'rf', name: 'Roof Terrace', r: [[2.1, 0, 5.8, 11.0], [0, 0, 2.1, 3.8], [0, 8.0, 2.1, 11.0]], lab: [3.95, 5.6], fl: 'F6', wl: 'W3', cl: '—', out: true, elec: { L: 4, S: 2 } },
    { id: 'R-02', lv: 'rf', name: 'Stair House', r: [[0, 3.8, 2.1, 8.0]], lab: [0.55, 4.35], fl: 'F5', wl: 'W1', cl: 'C1', stair: true, elec: { L: 1, S: 0 } }
  ];

  /* Built-in fittings only (shown on plans for plumbing setting-out; not modelled in 3D). k = kind */
  const furniture = [
    { lv: 'gf', k: 'counter', r: [2.90, 10.30, 4.55, 10.90], h: 0.9, sink: true },
    { lv: 'gf', k: 'counter', r: [5.15, 7.90, 5.75, 9.90], h: 0.9, hob: true },
    { lv: 'gf', k: 'shower', r: [0.15, 9.95, 1.05, 10.90], h: 0.05 },
    { lv: 'gf', k: 'wc', r: [0.15, 8.65, 0.85, 9.05], h: 0.8 },
    { lv: 'gf', k: 'basin', r: [1.50, 10.25, 2.05, 10.75], h: 0.85 },
    // kitchen fit-out, laundry corner and TV (z = height above floor where the item starts)
    { lv: 'gf', k: 'fridge', r: [5.10, 7.20, 5.75, 7.85], h: 1.85 },
    { lv: 'gf', k: 'upper', r: [5.40, 7.90, 5.75, 8.55], z: 1.45, h: 0.75 },
    { lv: 'gf', k: 'hood', r: [5.30, 8.60, 5.75, 9.20], z: 1.60, h: 0.55 },
    { lv: 'gf', k: 'upper', r: [5.40, 9.25, 5.75, 9.90], z: 1.45, h: 0.75 },
    { lv: 'gf', k: 'island', r: [3.00, 8.60, 4.20, 9.40], h: 0.9 },
    { lv: 'gf', k: 'stool', r: [3.15, 8.15, 3.45, 8.45], h: 0.65 },
    { lv: 'gf', k: 'stool', r: [3.45, 8.15, 3.75, 8.45], h: 0.65 },
    { lv: 'gf', k: 'stool', r: [3.75, 8.15, 4.05, 8.45], h: 0.65 },
    { lv: 'gf', k: 'pendant', r: [3.25, 8.90, 3.45, 9.10], z: 1.9, h: 0.25 },
    { lv: 'gf', k: 'pendant', r: [3.75, 8.90, 3.95, 9.10], z: 1.9, h: 0.25 },
    { lv: 'gf', k: 'washer', r: [2.15, 10.25, 2.80, 10.90], h: 0.85 },
    { lv: 'gf', k: 'dryer', r: [2.15, 10.25, 2.80, 10.90], z: 0.85, h: 0.85 },
    { lv: 'gf', k: 'upper', r: [2.15, 10.30, 2.80, 10.90], z: 1.85, h: 0.6 },
    { lv: 'gf', k: 'tvwall', r: [2.15, 9.15, 2.20, 10.15], z: 1.25, h: 0.58 },
    { lv: 'ff', k: 'shower', r: [4.55, 3.85, 5.75, 4.95], h: 0.05 },
    { lv: 'ff', k: 'wc', r: [5.05, 5.10, 5.75, 5.50], h: 0.8 },
    { lv: 'ff', k: 'basin', r: [4.10, 5.40, 4.70, 5.85], h: 0.85 },
    { lv: 'ff', k: 'wardrobe', r: [5.15, 5.95, 5.75, 6.55], h: 2.2 },
    { lv: 'ff', k: 'wardrobe', r: [5.15, 7.45, 5.75, 7.95], h: 2.2 },
    { lv: 'ff', k: 'wardrobe', r: [3.35, 6.60, 3.95, 7.95], h: 2.2 }
  ];

  /* U-stair, GF -> FF -> roof. Each storey: 20 risers x 165 = 3300, going 250, clear width ~900–950 */
  const stair = {
    risers: 20, rise: 0.165, going: 0.25,
    f1: { x0: 0.10, x1: 1.00, yStart: 4.75, dir: +1, n: 10, z0: LV.gf },            // GF -> half landing
    landing: { x0: 0.10, x1: 2.05, y0: 7.00, y1: 7.95, z: LV.landing },
    f2: { x0: 1.10, x1: 2.05, yStart: 7.00, dir: -1, n: 10, z0: LV.landing },       // half landing -> FF
    f3: { x0: 0.10, x1: 1.00, yStart: 4.75, dir: +1, n: 10, z0: LV.ff },            // FF -> upper half landing
    landing2: { x0: 0.10, x1: 2.05, y0: 7.00, y1: 7.95, z: LV.landing2 },
    f4: { x0: 1.10, x1: 2.05, yStart: 7.00, dir: -1, n: 10, z0: LV.landing2 },      // upper half landing -> roof
    topLanding: { x0: 0.10, x1: 2.05, y0: 3.85, y1: 4.75 },
    void: { x0: 0.10, x1: 2.05, y0: 4.75, y1: 7.95 }
  };

  /* ---------------- STRUCTURE (reinforced concrete frame) ---------------- */
  const S = {};
  const tall = y => (y === 3.8 || y === 8.0);   // grid A columns that carry the stair house
  S.columns = [
    ...[0, 3.8, 8.0, 11.0].map((y, i) => ({ m: 'C1', x: 0, y, b: 0.25, d: 0.25, z0: LV.footBot + 0.4, z1: tall(y) ? LV.shSlab : LV.ring, grid: 'A' + (i + 1) })),
    ...[0, 3.8, 8.0, 11.0].map((y, i) => ({ m: 'C1', x: 5.8, y, b: 0.25, d: 0.25, z0: LV.footBot + 0.4, z1: LV.ring, grid: 'B' + (i + 1) })),
    { m: 'C2', x: 2.1, y: 8.0, b: 0.20, d: 0.20, z0: LV.footBot + 0.4, z1: LV.shSlab, grid: 'stair' },
    { m: 'C3', x: 2.1, y: 3.8, b: 0.20, d: 0.20, z0: LV.ring - 0.5, z1: LV.shSlab, grid: 'stair house' }
  ];
  S.footings = [
    ...[0, 3.8, 8.0, 11.0].map(y => ({ m: 'F2', x0: -0.125, x1: 0.875, y0: y - 0.9, y1: y + 0.9, th: 0.40 })),
    ...[0, 3.8, 8.0, 11.0].map(y => ({ m: 'F1', x0: 5.05, x1: 6.55, y0: y - 0.75, y1: y + 0.75, th: 0.40 })),
    { m: 'F3', x0: 1.50, x1: 2.70, y0: 7.40, y1: 8.60, th: 0.40 }
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
  S.roofBeams = [
    ...[0, 3.8, 8.0, 11.0].map(y => beam('R1', 'h', y, 0, 5.8, 0.25, 0.50, LV.ring)),
    beam('R2', 'v', 0, 0, 11, 0.20, 0.40, LV.ring),
    beam('R2', 'v', 5.8, 0, 11, 0.20, 0.40, LV.ring),
    beam('R3', 'v', 2.7, 0, 3.8, 0.20, 0.35, LV.ring),
    beam('R3', 'h', 1.2, 0, 2.7, 0.20, 0.35, LV.ring),
    beam('R3', 'v', 2.1, 3.8, 8.0, 0.20, 0.35, LV.ring),
    beam('R3', 'h', 4.75, 0, 2.1, 0.20, 0.35, LV.ring),
    beam('R3', 'v', 3.3, 3.8, 8.0, 0.20, 0.35, LV.ring),
    beam('LB2', 'h', 7.95, 0, 2.1, 0.20, 0.30, LV.landing2 - 0.05)
  ];
  S.shBeams = [
    beam('SH1', 'h', 3.8, 0, 2.1, 0.20, 0.30, LV.shSlab), beam('SH1', 'h', 8.0, 0, 2.1, 0.20, 0.30, LV.shSlab),
    beam('SH1', 'v', 0, 3.8, 8.0, 0.20, 0.30, LV.shSlab), beam('SH1', 'v', 2.1, 3.8, 8.0, 0.20, 0.30, LV.shSlab)
  ];
  S.slabs = {
    gf: { m: 'S0', th: 0.10, x0: -0.1, x1: 5.9, y0: -0.1, y1: 11.1 },
    ff: { m: 'S1', th: 0.12, x0: 0, x1: 5.8, y0: 0, y1: 11.0, hole: stair.void },
    balcony: { m: 'S2', x0: 0, x1: 2.7, y0: 0, y1: 1.2, drop: 0.05 },
    roof: { m: 'S3', th: 0.15, x0: 0, x1: 5.8, y0: 0, y1: 11.0, hole: stair.void },
    sh: { m: 'S4', th: 0.10, x0: -0.1, x1: 2.2, y0: 3.7, y1: 8.1 }
  };
  S.schedule = [
    { m: 'F1', size: '1500 × 1500 × 400', rebar: 'DB12 @ 150 both ways, bottom; 50 cover to lean', note: 'Pad footing, grid B (4 no.)' },
    { m: 'F2', size: '1000 × 1800 × 400', rebar: 'DB12 @ 125 both ways, bottom; column starter on boundary edge', note: 'Eccentric footing flush with party boundary, grid A (4 no.)' },
    { m: 'F3', size: '1200 × 1200 × 400', rebar: 'DB12 @ 150 both ways', note: 'Stair column C2 footing (1 no.)' },
    { m: 'SB1', size: '250 × 500', rebar: 'T 3-DB16, B 3-DB16, links RB6 @ 150 (@ 100 within 1 m of col.)', note: 'Strap beams A–B on grids 1–4, balance eccentric F2' },
    { m: 'GB1', size: '200 × 400', rebar: 'T 2-DB12, B 3-DB12, links RB6 @ 150', note: 'Ground beams on grids A and B' },
    { m: 'GB2', size: '200 × 300', rebar: 'T 2-DB12, B 2-DB12, links RB6 @ 200', note: 'Under internal ground floor walls' },
    { m: 'C1', size: '250 × 250', rebar: '4-DB16 + 4-DB12, ties RB6 @ 100 (ends) / 150 (mid)', note: 'Main columns, footing to roof (8 no.); A2 and A3 continue to the stair-house roof' },
    { m: 'C2', size: '200 × 200', rebar: '4-DB16, ties RB6 @ 100/150', note: 'Stair column, footing to stair-house roof (1 no.)' },
    { m: 'C3', size: '200 × 200', rebar: '4-DB12, ties RB6 @ 150, starters cast into R1', note: 'Stair-house column, starts on roof beam R1 at grid 2 (1 no.)' },
    { m: 'B1', size: '250 × 500', rebar: 'T 2-DB16 + 2-DB16 extra at supports (L/3), B 3-DB16, links RB6 @ 100/150', note: 'Primary beams, span 5.8 m, grids 1–4' },
    { m: 'B2', size: '200 × 400', rebar: 'T 2-DB16, B 3-DB16, links RB6 @ 150', note: 'Edge beams grids A and B' },
    { m: 'B3', size: '200 × 350', rebar: 'T 2-DB12, B 2-DB16, links RB6 @ 150', note: 'Secondary beams under first floor walls and stair trimmers' },
    { m: 'LB1', size: '200 × 300', rebar: 'T 2-DB12, B 3-DB12, links RB6 @ 150', note: 'Lower stair landing beam A3–C2' },
    { m: 'R1', size: '250 × 500', rebar: 'T 2-DB16 + 2-DB16 extra at supports (L/3), B 3-DB16, links RB6 @ 100/150', note: 'Roof primary beams, span 5.8 m, grids 1–4' },
    { m: 'R2', size: '200 × 400', rebar: 'T 2-DB16, B 3-DB16, links RB6 @ 150', note: 'Roof edge beams grids A and B' },
    { m: 'R3', size: '200 × 350', rebar: 'T 2-DB12, B 2-DB16, links RB6 @ 150', note: 'Roof secondary beams and stair trimmers' },
    { m: 'LB2', size: '200 × 300', rebar: 'T 2-DB12, B 3-DB12, links RB6 @ 150', note: 'Upper stair landing beam A3–C2' },
    { m: 'SH1', size: '200 × 300', rebar: 'T 2-DB12, B 2-DB12, links RB6 @ 200', note: 'Stair-house roof beams' },
    { m: 'S0', size: '100 slab on grade', rebar: 'DB10 @ 250 both ways, mid-depth', note: 'On 0.2 mm polythene DPM, 50 sand blinding, compacted fill (95% MDD)' },
    { m: 'S1', size: '120 suspended slab', rebar: 'B DB10 @ 200 both ways; T DB10 @ 200 over beams for L/4', note: 'First floor. Stair void 1950 × 3200' },
    { m: 'S2', size: '120 slab, set down 50', rebar: 'As S1', note: 'Balcony: falls 1:100 to outlet, waterproof membrane' },
    { m: 'S3', size: '150 roof slab', rebar: 'B DB10 @ 150 both ways; T DB10 @ 200 both ways (full, crack control)', note: 'Roof terrace. Live load 2.0 kPa + finishes 2.0 kPa. Stair void 1950 × 3200' },
    { m: 'S4', size: '100 slab', rebar: 'DB10 @ 200 both ways', note: 'Stair-house roof, falls 1:50, PU membrane' },
    { m: 'ST1', size: '150 waist, 20R × 165 / 250 going per storey', rebar: 'Main DB12 @ 150, distribution DB10 @ 200, top & bottom at landings', note: 'U-stair GF → FF → roof, brick spine wall' },
    { m: 'PP1', size: '200 brick parapet, 450 high', rebar: 'RC coping 200 × 100 with 2-DB10; stiffeners TC1 @ 2.0 m', note: 'Roof edge, railing base plates fixed to coping' },
    { m: 'L1', size: '100/200 × 150 lintel', rebar: '2-DB10 bottom, RB6 @ 200', note: 'Over every opening not under a beam, 200 bearing each side' },
    { m: 'TC1', size: '100/200 × 150 stiffener', rebar: '4-DB10, RB6 @ 200', note: 'At free wall ends, door jambs, and max 3.0 m along brick walls' }
  ];
  /* Site, plan coordinates. Front yard 5.9 m deep: car park on the right, fish pond on the left. */
  const siteItems = {
    path: { x0: 2.75, x1: 3.95, y0: -6.0, y1: -0.6 },
    steps: { x0: 2.75, x1: 3.95, y0: -0.6, y1: 0.0 },
    carpark: { x0: 6.20, x1: 9.70, y0: -6.0, y1: -0.40 },                     // 3.5 × 5.6 m, 125 mm RC slab
    carport: { x0: 6.10, x1: 9.80, y0: -5.60, y1: -0.30, z: 2.70, posts: [[6.2, -5.5], [9.7, -5.5], [6.2, -0.45], [9.7, -0.45]] },
    car: { x0: 7.05, x1: 8.85, y0: -5.20, y1: -0.85 },
    carGate: { x0: 6.20, x1: 9.70, y: -6.0 }, walkGate: { x0: 2.75, x1: 3.95, y: -6.0 },
    pond: { x0: 0.50, x1: 2.50, y0: -4.80, y1: -1.80, depth: 0.8 },          // koi fish pond, RC shell
    bedFront: { x0: -0.15, x1: 2.60, y0: -1.1, y1: -0.1 },
    gravel: { x0: 5.90, x1: 6.90, y0: -0.1, y1: 11.1 },
    septic: { x0: 4.20, x1: 6.00, y0: -4.60, y1: -3.60 },
    tank: { x0: 2.6, x1: 4.6, y0: 12.0, y1: 13.1, top: -0.1, bot: -1.2 },    // underground RC water tank ~2.2 m³ under the rear yard
    pump: { x: 4.95, y: 12.5 },
    meterW: { x: 5.95, y: -5.85 }, meterE: { x: -0.05, y: -5.85 },
    mango: { x: 8.35, y: 5.0, canopy: 2.0, height: 4.5, barrier: { x: 7.0, y0: 2.5, y1: 7.5 } }   // grafted dwarf mango, pruned to ~4.5 m
  };
  const lvZ = lv => (lv === 'gf' ? LV.gf : lv === 'ff' ? LV.ff : LV.roof);
  const rectArea = r => (r[2] - r[0]) * (r[3] - r[1]);
  const roomArea = rm => rm.r.reduce((a, r) => a + rectArea(r), 0);
  const wallLen = w => w.e - w.s;
  const openingsOn = w => openings.filter(o => o.lv === w.lv && o.o === w.o && Math.abs(o.c - w.c) < 1e-6 && o.s >= w.s - 1e-6 && o.e <= w.e + 1e-6);
  const pipes = [];
  const pipe = (sys, lv, dia, pts) => pipes.push({ sys, lv, dia, pts });
  const Zg = LV.gfCeil + 0.15;  
  const Zw = LV.ff + 0.30;      
  const Zd = LV.gfCeil + 0.25;  
  const Zu = -0.4, Zs = 0.2;    
  pipe('cw', 'site', 0.025, [[5.95, -5.75, 0.9], [5.95, -5.75, Zu], [6.1, -5.75, Zu], [6.1, 12.55, Zu], [4.6, 12.55, Zu], [4.45, 12.55, -0.3]]); // meter -> rear tank  
  pipe('cw', 'site', 0.025, [[4.45, 12.5, -0.9], [4.45, 12.5, -0.3], [4.95, 12.5, -0.3], [4.95, 12.5, 0.3]]);                        // tank -> pump
  pipe('cw', 'gf', 0.025, [[4.95, 12.5, 0.3], [4.95, 12.5, Zu], [4.95, 11.2, Zu], [4.95, 11.0, Zs], [4.95, 9.6, Zs], [0.25, 9.6, Zs]]); // pump -> under slab
  pipe('cw', 'site', 0.02, [[6.1, -2.6, Zu], [2.75, -2.6, Zu], [2.75, -2.6, LV.yard + 0.6]]);            // garden tap for the fish pond
  pipe('cw', 'gf', 0.02, [[2.4, 9.6, Zs], [3.7, 9.6, Zs], [3.7, 10.92, Zs], [3.7, 10.92, LV.gf + 0.95]]);                        // kitchen sink, up in rear wall
  pipe('cw', 'gf', 0.02, [[0.25, 9.6, Zs], [0.14, 9.6, Zs], [0.14, 8.85, Zs], [0.14, 8.85, LV.gf + 0.25]]);                     // WC, up in party wall
  pipe('cw', 'gf', 0.02, [[0.14, 9.6, Zs], [0.14, 10.4, Zs], [0.14, 10.4, LV.gf + 1.9]]);                                       // shower heater
  pipe('cw', 'gf', 0.02, [[1.95, 9.6, Zs], [2.06, 9.6, Zs], [2.06, 10.5, Zs], [2.06, 10.5, LV.gf + 0.55]]);                     // basin, up in wall
  pipe('cw', 'gf', 0.025, [[3.7, 9.6, Zs], [5.72, 9.6, Zs], [5.72, 5.9, Zs], [5.72, 5.9, Zw]]);                                  // riser inside external wall
  pipe('cw', 'ff', 0.02, [[5.72, 5.9, Zw], [5.72, 4.4, Zw], [5.72, 4.4, LV.ff + 1.9]]);                                          // bath 2 WC + shower heater
  pipe('cw', 'ff', 0.02, [[5.72, 5.9, Zw], [4.4, 5.9, Zw]]);                                                                     // along the bathroom wall to the basin
  pipe('cw', 'ff', 0.02, [[4.4, 5.9, Zw], [4.4, 5.9, LV.ff + 0.55]]);                                                            // bath 2 basin
  pipe('cw', 'rf', 0.02, [[5.72, 5.9, Zw], [5.72, 5.9, LV.deck + 0.6]]);                                                         // terrace tap, up in wall
  // hot water: instant heater -> shower mixer
  pipe('hw', 'gf', 0.02, [[0.35, 10.4, LV.gf + 1.85], [0.35, 10.4, LV.gf + 1.0]]);
  pipe('hw', 'ff', 0.02, [[5.6, 4.4, LV.ff + 1.85], [5.6, 4.4, LV.ff + 1.0]]);
  // waste and soil
  pipe('ww', 'gf', 0.1, [[0.5, 8.85, LV.gf], [0.6, 8.85, 0.2], [0.6, 11.3, -0.1], [1.0, 11.3, -0.15]]);
  pipe('ww', 'gf', 0.05, [[1.8, 10.5, LV.gf + 0.4], [1.8, 10.5, 0.2], [0.6, 10.5, 0.2]]);
  pipe('ww', 'gf', 0.05, [[0.6, 10.4, LV.gf], [0.6, 10.4, 0.2]]);
  pipe('ww', 'gf', 0.05, [[3.7, 10.6, LV.gf + 0.5], [3.7, 10.6, 0.2], [3.7, 11.3, -0.15]]);
  pipe('cw', 'gf', 0.02, [[2.4, 9.6, 0.2], [2.4, 10.92, 0.2], [2.4, 10.92, LV.gf + 1.0]]);                     // washing machine tap, up in rear wall
  pipe('ww', 'gf', 0.05, [[2.6, 10.85, LV.gf + 0.6], [2.6, 10.85, 0.2], [2.6, 11.3, -0.15]]);                  // washing machine standpipe and trap
  pipe('ww', 'site', 0.1, [[1.0, 11.3, -0.15], [6.35, 11.3, -0.3], [6.35, -4.1, -0.6], [6.0, -4.1, -0.6]]);   // sewer to septic
  pipe('ww', 'site', 0.1, [[5.1, -4.6, -0.6], [5.1, -6.6, -0.7]]);                                              // septic overflow
  pipe('ww', 'ff', 0.1, [[6.35, 5.9, -0.35], [6.0, 5.9, -0.3], [6.0, 5.9, LV.parapet + 0.6]]);                   // soil stack + vent
  pipe('ww', 'ff', 0.1, [[5.5, 4.4, Zd], [5.5, 5.9, Zd]]);
  pipe('ww', 'ff', 0.1, [[5.5, 5.9, Zd], [6.0, 5.9, Zd]]);
  pipe('ww', 'ff', 0.05, [[5.15, 4.4, LV.ff], [5.15, 4.4, Zd], [5.5, 4.4, Zd]]);
  pipe('ww', 'ff', 0.1, [[5.4, 5.3, LV.ff], [5.4, 5.3, Zd], [5.5, 5.3, Zd]]);
  pipe('ww', 'ff', 0.05, [[4.4, 5.6, LV.ff + 0.4], [4.4, 5.6, Zd], [5.5, 5.6, Zd]]);
  // rainwater: roof outlets -> downpipes -> underground to the street drain
  const RZ = LV.ring + 0.05;
  pipe('sw', 'rf', 0.09, [[5.45, 0.35, RZ], [6.0, 0.35, RZ], [6.0, 0.35, LV.yard]]);
  pipe('sw', 'rf', 0.09, [[5.45, 10.65, RZ], [6.0, 10.65, RZ], [6.0, 10.65, LV.yard]]);
  pipe('sw', 'rf', 0.09, [[0.35, 0.35, RZ], [0.3, -0.2, RZ], [0.3, -0.2, LV.yard]]);
  pipe('sw', 'rf', 0.09, [[0.35, 10.65, RZ], [0.3, 11.2, RZ], [0.3, 11.2, LV.yard]]);
  pipe('sw', 'ff', 0.075, [[0.3, 0.3, LV.ff - 0.1], [0.3, -0.2, LV.ff - 0.1]]);                                 // balcony outlet
  pipe('sw', 'site', 0.1, [[6.0, 0.35, LV.yard], [6.0, 0.35, -0.3], [6.6, 0.35, -0.3]]);
  pipe('sw', 'site', 0.1, [[6.0, 10.65, LV.yard], [6.0, 10.65, -0.3], [6.6, 10.65, -0.3], [6.6, -6.6, -0.4]]);
  pipe('sw', 'site', 0.1, [[0.3, -0.2, LV.yard], [0.3, -0.2, -0.3], [0.1, -0.5, -0.3], [0.1, -6.6, -0.4]]);
  pipe('sw', 'site', 0.075, [[0.5, -3.3, 0.0], [0.1, -3.3, -0.3]]);                                            // fish pond overflow
  pipe('sw', 'site', 0.1, [[0.3, 11.2, LV.yard], [0.3, 11.2, -0.3], [0.3, 13.6, -0.3], [6.6, 13.6, -0.3], [6.6, 10.65, -0.3]]);
  const fixtures = [
    { k: 'pump', lv: 'site', x: 4.95, y: 12.5, z: 0.3 }, { k: 'tank', lv: 'site', x: 3.6, y: 12.55, z: -0.6 },
    { k: 'septic', lv: 'site', x: 5.1, y: -4.1, z: -0.6 }, { k: 'meter', lv: 'site', x: 5.95, y: -5.75, z: 0.9 },
    { k: 'tap', lv: 'site', x: 2.75, y: -2.6, z: LV.yard + 0.6 }, { k: 'pondpump', lv: 'site', x: 2.3, y: -3.3, z: 0.1 },
    { k: 'heater', lv: 'gf', x: 0.3, y: 10.4, z: LV.gf + 1.9 }, { k: 'heater', lv: 'ff', x: 5.65, y: 4.4, z: LV.ff + 1.9 },
    { k: 'fd', lv: 'gf', x: 0.6, y: 10.4, z: LV.gf }, { k: 'fd', lv: 'ff', x: 5.15, y: 4.4, z: LV.ff },
    { k: 'tap', lv: 'rf', x: 5.62, y: 5.9, z: LV.deck + 0.6 }, { k: 'ic', lv: 'site', x: 1.0, y: 11.3, z: -0.15 }
  ];

  /* electrical: main board in the ground floor lobby, risers in the lobby wall, one hub per room in the ceiling void */
  const floorZ = rm => (rm.id === 'R-01' ? LV.deck : lvZ(rm.lv));
  const ceilZ = { gf: LV.gfCeil, ff: LV.ffCeil, rf: LV.shSlab - 0.25 };
  const voidZ = { gf: LV.gfCeil + 0.2, ff: LV.ffCeil + 0.12, rf: LV.shSlab - 0.2 };
  const riserXY = { gf: [0.45, 3.8], ff: [0.6, 3.8], rf: [0.75, 3.8] };
  const db = { x0: 0.2, x1: 0.75, y0: 3.85, y1: 3.95, z0: LV.gf + 1.2, z1: LV.gf + 1.9 };
  const epts = [], runs = [];
  const cableOf = { L: '1.5', X: '1.5', F: '1.5', SW: '1.5', S: '2.5', D: 'data', AC: '4', H: '4', P: '4' };
  const onEdge = (o, r) => {
    const m = (o.s + o.e) / 2, tol = 0.06;
    return o.o === 'h' ? (Math.abs(o.c - r[1]) < tol || Math.abs(o.c - r[3]) < tol) && m > r[0] && m < r[2]
      : (Math.abs(o.c - r[0]) < tol || Math.abs(o.c - r[2]) < tol) && m > r[1] && m < r[3];
  };
  rooms.forEach(rm => {
    const [x0, y0, x1, y1] = rm.r[0], w = x1 - x0, d = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const e = rm.elec || {}, fz = floorZ(rm), lv = rm.lv, cz = ceilZ[lv], ins = 0.14, pts = [];
    // lights
    if (rm.id === 'R-01') [[2.27, 5.3], [2.27, 7.7], [1.0, 3.63], [1.0, 8.17]].slice(0, e.L || 0).forEach(([x, y]) => pts.push({ t: 'L', x, y, z: fz + 2.1 }));
    else if (rm.stair) for (let i = 0; i < (e.L || 0); i++) pts.push({ t: 'L', x: 0.14, y: 4.3 + i * 2.2, z: fz + 2.2 });
    else for (let i = 0; i < (e.L || 0); i++) { const f = (i + 0.5) / e.L; pts.push(w >= d ? { t: 'L', x: x0 + w * f, y: cy, z: cz } : { t: 'L', x: cx, y: y0 + d * f, z: cz }); }
    // sockets around the perimeter
    const E = [[x0 + ins, y0 + ins, x1 - ins, y0 + ins], [x1 - ins, y0 + ins, x1 - ins, y1 - ins], [x1 - ins, y1 - ins, x0 + ins, y1 - ins], [x0 + ins, y1 - ins, x0 + ins, y0 + ins]];
    const L = E.map(q => Math.hypot(q[2] - q[0], q[3] - q[1])), per = L.reduce((a, b) => a + b, 0);
    const at = t => { let s = ((t % per) + per) % per; for (let k = 0; k < 4; k++) { if (s <= L[k]) { const q = E[k], f = s / L[k]; return [q[0] + (q[2] - q[0]) * f, q[1] + (q[3] - q[1]) * f]; } s -= L[k]; } return [E[0][0], E[0][1]]; };
    for (let i = 0; i < (e.S || 0); i++) { const [x, y] = at(per * (i + 0.35) / e.S); pts.push({ t: 'S', x, y, z: fz + 0.3 }); }
    if (e.D) { const [x, y] = at(per * 0.35 / Math.max(1, e.S || 1) + 0.35); pts.push({ t: 'D', x, y, z: fz + 0.3 }); }
    // switch beside the door into the room
    const door = openings.find(o => o.lv === lv && ['door', 'slider'].includes(types[o.t].kind) && rm.r.some(r => onEdge(o, r)));
    if (door) {
      const inR = (a) => (door.o === 'h' ? a > x0 + 0.1 && a < x1 - 0.1 : a > y0 + 0.1 && a < y1 - 0.1);
      const a = inR(door.e + 0.15) ? door.e + 0.15 : door.s - 0.15;
      const n = door.c + ((door.o === 'h' ? cy : cx) > door.c ? 0.1 : -0.1);
      pts.push(door.o === 'h' ? { t: 'SW', x: a, y: n, z: fz + 1.2 } : { t: 'SW', x: n, y: a, z: fz + 1.2 });
    }
    // air-conditioner on the wall opposite the door
    if (e.AC) {
      let p = [cx, y1 - ins];
      if (door) { if (door.o === 'h') p = Math.abs(door.c - y1) < 0.1 ? [cx, y0 + ins] : [cx, y1 - ins]; else p = Math.abs(door.c - x1) < 0.1 ? [x0 + ins, cy] : [x1 - ins, cy]; }
      pts.push({ t: 'AC', x: p[0], y: p[1], z: fz + 2.3 });
    }
    if (e.F) pts.push({ t: 'F', x: cx + 0.3, y: cy, z: cz });
    if (e.H) {
      const sh = furniture.find(f => f.k === 'shower' && f.lv === lv && (f.r[0] + f.r[2]) / 2 > x0 && (f.r[0] + f.r[2]) / 2 < x1 && (f.r[1] + f.r[3]) / 2 > y0 && (f.r[1] + f.r[3]) / 2 < y1);
      const hx = fixtures.find(f => f.k === 'heater' && f.lv === lv && f.x > x0 && f.x < x1 && f.y > y0 && f.y < y1);
      if (hx) pts.push({ t: 'H', x: hx.x, y: hx.y, z: hx.z + 0.3 }); else if (sh) pts.push({ t: 'H', x: sh.r[0] + 0.1, y: (sh.r[1] + sh.r[3]) / 2, z: fz + 2.1 });
    }
    // hub and wiring
    const hub = rm.id === 'R-01' ? [2.25, 5.0, LV.ring + 0.08] : [cx, cy, voidZ[lv]];
    const [rx, ry] = riserXY[lv], rz = rm.id === 'R-01' ? LV.ring + 0.08 : voidZ[lv];
    runs.push({ kind: 'home', lv, room: rm.id, cable: '2.5', pts: [[rx, ry, rz], [hub[0], ry, rz], [hub[0], hub[1], rz]] });
    pts.forEach(p => {
      p.lv = lv; p.room = rm.id; epts.push(p);
      runs.push({ kind: 'leg', lv, room: rm.id, t: p.t, cable: cableOf[p.t], pts: [hub, [p.x, hub[1], hub[2]], [p.x, p.y, hub[2]], [p.x, p.y, p.z]] });
    });
  });
  // risers from the board to each level, the incoming main, and outdoor points run underground from the board
  ['gf', 'ff', 'rf'].forEach(lv => { const [rx, ry] = riserXY[lv]; runs.push({ kind: 'riser', lv, cable: '4', pts: [[rx, ry, db.z1], [rx, ry, lv === 'rf' ? voidZ.rf : voidZ[lv]]] }); });
  runs.push({ kind: 'main', lv: 'site', cable: '10', pts: [[0.05, -5.75, 1.0], [0.05, -5.75, -0.5], [0.3, -5.75, -0.5], [0.3, 3.8, -0.5], [0.3, 3.8, db.z0]] });
  [{ t: 'X', x: 2.75, y: -1.4, z: LV.yard + 0.5 }, { t: 'X', x: 5.2, y: -0.6, z: LV.yard + 0.5 }, { t: 'X', x: 3.95, y: -5.85, z: LV.yard + 1.2 },
   { t: 'X', x: 5.95, y: 5.0, z: LV.yard + 2.5 }, { t: 'X', x: 7.95, y: -4.2, z: 2.6 }, { t: 'X', x: 7.95, y: -1.6, z: 2.6 },
   { t: 'S', x: 9.6, y: -5.3, z: LV.yard + 0.9 }, { t: 'P', x: 4.95, y: 12.4, z: LV.yard + 0.6 }, { t: 'P', x: 2.65, y: -3.3, z: LV.yard + 0.4 }].forEach(p => {
    p.lv = 'site'; p.room = 'EXT'; epts.push(p);
    runs.push({ kind: 'leg', lv: 'site', t: p.t, cable: cableOf[p.t], pts: [[0.5, 3.8, db.z0], [0.5, 3.8, -0.3], [0.5, p.y, -0.3], [p.x, p.y, -0.3], [p.x, p.y, p.z]] });
  });
  const polyLen = pts => pts.reduce((a, p, i) => (i ? a + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1], p[2] - pts[i - 1][2]) : 0), 0);
  const services = { pipes, fixtures, elec: { db, points: epts, runs }, polyLen };

  window.HOUSE = {
    name: 'Two-Storey House, 10 × 20 m Lot',
    LV, site, grid, roof, canopy, walls, types, openings, finishes, rooms, furniture, stair, S, siteItems, services,
    lvZ, rectArea, roomArea, wallLen, openingsOn, T20
  };
})();
