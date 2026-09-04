/**
 * Background removal for the studio product photography, in the browser.
 *
 * Every catalogue photo is shot against the same red studio wall, which is
 * what makes this tractable without a model or a paid API. But the wall is
 * *vignetted*: bright red through the middle, falling to near-black in the
 * corners. A plain flood fill seeded from one border colour therefore fails —
 * on this catalogue it left three products almost untouched, because a single
 * tolerance cannot span that range.
 *
 * So the fill anchors on hue instead of colour. Hue plus saturation establish
 * *what* the backdrop is; local brightness continuity lets the fill follow the
 * vignette down into the dark corners; connectivity from the frame edge stops
 * it entering the product.
 *
 * The whole thing then turns on how *precisely* that hue is held, and the
 * intuition here is backwards. A generous tolerance feels like the safe
 * setting — surely it just removes more wall. It does not. Measured against
 * the mask itself, each photo's backdrop occupies a single narrow hue: the
 * median sits 3–7° below 360, and 98% of it lies inside a 4° span. The nearest
 * product tones are 8–34° warmer — teak +33, mahogany +25, gilt +32. That gap
 * is the only thing separating a red wall from red-brown wood, and a 26°
 * tolerance opens a band wide enough to swallow it whole: on average 15,907
 * per-million of the removed pixels were warm-hued product, 77,543 on the
 * worst photo, which is what tore the panel bed, the marble set's chairs and
 * the cream sofa's carved centre table into ragged spikes. At 8° it is 4.
 *
 * The cost of tightening is nothing, and that is the part worth remembering:
 * leftover wall stays flat across the whole sweep, because it is `stepDelta`
 * continuity — not hue width — that walks the fill down the vignette. Hue only
 * ever has to name the backdrop, not cover its whole brightness range.
 *
 * Below `darkCeiling` hue is numerically meaningless, so nothing there is
 * removed on colour alone: those pixels need connectivity to proven wall, the
 * outer margin where a studio vignette lives, and a match against the local
 * backdrop colour.
 *
 * Five passes, each earning its keep:
 *   1. Chromatic flood from the frame edge — the wall, lit and shadowed.
 *   1b. Growth into the near-black corners, where hue cannot vouch for a
 *      pixel and the three constraints above stand in for it.
 *   2. Trapped backdrop: wall seen through glass doors or between carved
 *      spindles, enclosed by the product so pass 1 can never reach it.
 *   3. Islands: shadow debris left stranded by passes 1–2.
 *   4. The edge matte: partial alpha along the outline, so the piece does not
 *      carry a red rim from the wall it was cut out of. Graded, not shaved —
 *      an outline pixel is genuinely part wall, and measurement showed that
 *      deleting it outright costs far more real timber than the rim is worth.
 *   5. A one-pixel alpha ramp, so the cutout is not a sticker on the wall.
 *
 * Results are cached per source, and the returned bitmap is cropped to the
 * subject so the room stage can size pieces consistently. The crop also
 * carries a measurement of the subject's contact spread, since a cutout of a
 * scene has no single ground line — see `contactDepth` below.
 */

const cache = new Map();

const DEFAULTS = {
  /* Degrees of hue either side of the measured backdrop. Sounds tight and is
     deliberately so: the wall's own drift is under ±2°, and the nearest
     product tone is 8° away. Widening this does not remove more wall, it
     removes wood — see the note at the top of the file. */
  hueTolerance: 8,

  /* The wall is a saturated red even where it is dark. Anything washed out
     is product, not backdrop. Raised per-image from the measured border. */
  satFloor: 0.16,

  /* Largest brightness step the fill may take between neighbours. This is
     the term that walks the vignette — the one doing the work a wide hue
     tolerance looks like it is doing — and it is small enough that the
     product edge, always an abrupt change, reads as a wall it cannot
     cross. */
  stepDelta: 26,

  /* Below this lightness, hue is numerically meaningless: a near-black red
     and a near-black green are indistinguishable. Such pixels are only ever
     removed under the extra constraints in pass 1b. */
  darkCeiling: 22,

  /* Pass 1b runs only within this fraction of the frame edge. A studio
     vignette lives at the margin by definition, so confining the rule there
     keeps it away from a product's own dark upholstery. */
  darkMargin: 0.18,

  /* Block size for the local backdrop reference, and how far a pixel or a
     trapped region may sit from it. Pass 4 reuses the same distance on the
     outline, where it acts as a matte test: a boundary pixel this close to
     the wall's own colour is mostly wall, whatever its hue reads as. */
  refBlock: 32,
  refTolerance: 38,

  /* Pass 3: a kept island smaller than this share of the subject is debris. */
  islandRatio: 0.01,

  /* Pass 4: the least alpha the fallback matte may assign, used only where the
     wall and the piece are too close in colour to define a line to project on.
     Low enough that the red ring stops reading, high enough that a genuine edge
     goes soft rather than disappearing. `matteFloor` is how far apart the two
     ends must be, in RGB units, for the projection to be trusted at all. */
  edgeFloor: 0.15,
  matteFloor: 18,

  /* Pass 5: how far a boundary pixel's alpha may fall. */
  feather: 0.85,
};

/* ── colour ─────────────────────────────────────────────────── */

/** Hue in degrees, saturation 0–1, lightness 0–255. */
function toHsl(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const chroma = max - min;
  if (!chroma) return [0, 0, l];

  const s = chroma / (255 - Math.abs(max + min - 255));
  let h;
  if (max === r) h = 60 * (((g - b) / chroma) % 6);
  else if (max === g) h = 60 * ((b - r) / chroma + 2);
  else h = 60 * ((r - g) / chroma + 4);

  return [(h + 360) % 360, s, l];
}

/** Shortest angular distance between two hues. */
function hueGap(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/* ── loading ────────────────────────────────────────────────── */

/**
 * Route static imports through Next's image endpoint at a fixed width.
 *
 * Two reasons. The original files are 3–5 MB each, and w=640 is a candidate
 * the product grid has usually already downloaded, so this is typically a
 * cache hit rather than a second fetch. Quality must stay at Next's default
 * of 75 for that hit to land.
 */
function resolveUrl(source) {
  const raw = typeof source === 'string' ? source : source?.src;
  if (!raw) throw new Error('removeBackground: no image source');
  if (/^(https?:|blob:|data:)/.test(raw)) return raw;
  return `/_next/image?url=${encodeURIComponent(raw)}&w=640&q=75`;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Same-origin, so the canvas stays untainted and getImageData works.
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`removeBackground: cannot load ${url}`));
    img.src = url;
  });
}

/* ── the passes ─────────────────────────────────────────────── */

/**
 * Measure the backdrop from the one-pixel border ring.
 *
 * The hue is a saturation-weighted peak over 10° bins rather than a mean:
 * a mean is dragged off by the product where it runs to the frame edge, and
 * weighting by saturation lets a bright centre pixel outvote a black corner
 * whose hue is noise. The bins either side of the peak are folded in so a
 * backdrop sitting near a bin boundary is not clipped.
 */
function measureBackdrop(hue, sat, size, opts) {
  const ring = [];
  for (let p = 0; p < size; p += 1) {
    ring.push(p, (size - 1) * size + p, p * size, p * size + size - 1);
  }

  const BINS = 36;
  const weight = new Float32Array(BINS);
  for (const i of ring) weight[Math.floor(hue[i] / 10) % BINS] += sat[i];

  let peak = 0;
  for (let b = 1; b < BINS; b += 1) if (weight[b] > weight[peak]) peak = b;

  let num = 0;
  let den = 0;
  for (const b of [(peak + BINS - 1) % BINS, peak, (peak + 1) % BINS]) {
    for (const i of ring) {
      if (Math.floor(hue[i] / 10) % BINS !== b) continue;
      // Unwrap across 0° so red either side of the seam averages correctly.
      const h = peak < 3 && hue[i] > 300 ? hue[i] - 360 : hue[i];
      num += h * sat[i];
      den += sat[i];
    }
  }

  const sorted = ring.map((i) => sat[i]).sort((a, b) => a - b);
  return {
    ring,
    hue: (num / den + 360) % 360,
    /* Lift the floor towards what this particular wall actually measures,
       taking the 10th percentile so product intruding on the border cannot
       drag it down. */
    satFloor: Math.max(opts.satFloor, sorted[Math.floor(sorted.length * 0.1)] * 0.65),
  };
}

/**
 * Coarse grid of what the backdrop looks like locally, averaged from the
 * pixels already removed. Pass 1b and pass 2 compare against this rather than
 * against a hue family: down in the near-black corners hue is noise, and the
 * only honest question left is whether a pixel is the colour the wall
 * measurably is *right there*.
 *
 * Sampled bilinearly between block centres, not read straight out of the
 * block. As a piecewise-constant grid the warrant flipped on block
 * boundaries, and since the darkest backdrop sits directly beneath each piece
 * — where its own shadow pools — that printed 32-pixel stair-steps along the
 * one edge a viewer reads as the product meeting the floor. The vignette is a
 * smooth field, so the reference has to be one too.
 */
function backdropReference(data, keep, size, block) {
  const cols = Math.ceil(size / block);
  const sums = new Float32Array(cols * cols * 4);

  for (let i = 0; i < keep.length; i += 1) {
    if (keep[i]) continue;
    const x = i % size;
    const y = (i - x) / size;
    const b = (((y / block) | 0) * cols + ((x / block) | 0)) * 4;
    sums[b] += data[i * 4];
    sums[b + 1] += data[i * 4 + 1];
    sums[b + 2] += data[i * 4 + 2];
    sums[b + 3] += 1;
  }

  /* A block speaks only if enough removed pixels landed in it. Interior
     blocks are often entirely product and hold no evidence at all. */
  const mean = new Float32Array(cols * cols * 3);
  const known = new Uint8Array(cols * cols);
  for (let b = 0; b < cols * cols; b += 1) {
    const n = sums[b * 4 + 3];
    if (n <= 8) continue;
    known[b] = 1;
    mean[b * 3] = sums[b * 4] / n;
    mean[b * 3 + 1] = sums[b * 4 + 1] / n;
    mean[b * 3 + 2] = sums[b * 4 + 2] / n;
  }

  // Fallback for a pixel with no evidence in any of its four blocks.
  const nearest = (bx, by) => {
    for (let r = 0; r < cols; r += 1) {
      for (let dy = -r; dy <= r; dy += 1) {
        for (let dx = -r; dx <= r; dx += 1) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          const X = bx + dx;
          const Y = by + dy;
          if (X < 0 || Y < 0 || X >= cols || Y >= cols) continue;
          const b = Y * cols + X;
          if (known[b]) return [mean[b * 3], mean[b * 3 + 1], mean[b * 3 + 2]];
        }
      }
    }
    return null;
  };

  return function referenceAt(x, y) {
    // Block centres sit at (n + 0.5) * block, hence the half-block shift.
    const gx = x / block - 0.5;
    const gy = y / block - 0.5;
    const bx = Math.floor(gx);
    const by = Math.floor(gy);
    const fx = gx - bx;
    const fy = gy - by;

    let r = 0;
    let g = 0;
    let b = 0;
    let w = 0;
    for (let dy = 0; dy <= 1; dy += 1) {
      for (let dx = 0; dx <= 1; dx += 1) {
        const X = bx + dx;
        const Y = by + dy;
        if (X < 0 || Y < 0 || X >= cols || Y >= cols) continue;
        const bi = Y * cols + X;
        if (!known[bi]) continue;
        // Renormalised at the end, so a silent neighbour simply abstains
        // instead of dragging the estimate towards zero.
        const wt = (dx ? fx : 1 - fx) * (dy ? fy : 1 - fy);
        if (wt <= 0) continue;
        r += mean[bi * 3] * wt;
        g += mean[bi * 3 + 1] * wt;
        b += mean[bi * 3 + 2] * wt;
        w += wt;
      }
    }
    if (w > 0) return [r / w, g / w, b / w];
    return nearest((x / block) | 0, (y / block) | 0);
  };
}

/** Four-neighbour indices, written into a reusable buffer. */
function neighbours(i, size, out) {
  const x = i % size;
  const y = (i - x) / size;
  let n = 0;
  if (x > 0) out[n++] = i - 1;
  if (x < size - 1) out[n++] = i + 1;
  if (y > 0) out[n++] = i - size;
  if (y < size - 1) out[n++] = i + size;
  return n;
}

function buildMask(data, size, opts) {
  const total = size * size;
  const hue = new Float32Array(total);
  const sat = new Float32Array(total);
  const lum = new Float32Array(total);

  for (let i = 0; i < total; i += 1) {
    const [h, s, l] = toHsl(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
    hue[i] = h;
    sat[i] = s;
    lum[i] = l;
  }

  const wall = measureBackdrop(hue, sat, size, opts);
  const keep = new Uint8Array(total).fill(1);
  const stack = [];
  const nb = new Int32Array(4);

  /* Positive chromatic evidence: this pixel is the backdrop's hue, and
     saturated enough that its hue means something. */
  const isWallColour = (i) =>
    lum[i] >= opts.darkCeiling &&
    hueGap(hue[i], wall.hue) <= opts.hueTolerance &&
    sat[i] >= wall.satFloor;

  /* ── Pass 1: flood the wall inward from the frame edge. Hue names the
     backdrop, `stepDelta` carries the fill down the vignette, and the product
     edge stops it: a boundary is an abrupt brightness change by definition,
     so it reads as a wall the fill cannot step over. */
  for (const i of wall.ring) {
    if (isWallColour(i)) {
      keep[i] = 0;
      stack.push(i);
    }
  }
  while (stack.length) {
    const i = stack.pop();
    const n = neighbours(i, size, nb);
    for (let k = 0; k < n; k += 1) {
      const j = nb[k];
      if (!keep[j] || !isWallColour(j)) continue;
      if (Math.abs(lum[j] - lum[i]) > opts.stepDelta) continue;
      keep[j] = 0;
      stack.push(j);
    }
  }

  /* ── Pass 1b: the near-black corners, where hue cannot vouch for anything.
     Three warrants stand in for it — the pixel must adjoin wall already
     proven by pass 1, lie in the outer margin where a studio vignette lives,
     and match the colour of the wall measured locally by the pass above.
     Product upholstery fails at least one: the emerald bed's dark base is
     central rather than at the margin, and the burgundy dining chairs are
     nowhere near the wall's local colour. */
  const edgeBand = Math.round(size * opts.darkMargin);
  const referenceAt = backdropReference(data, keep, size, opts.refBlock);
  const nearFrameEdge = (i) => {
    const x = i % size;
    const y = (i - x) / size;
    return Math.min(x, y, size - 1 - x, size - 1 - y) < edgeBand;
  };
  const matchesLocalWall = (i, tolerance) => {
    const x = i % size;
    const ref = referenceAt(x, (i - x) / size);
    if (!ref) return false;
    return (
      Math.hypot(data[i * 4] - ref[0], data[i * 4 + 1] - ref[1], data[i * 4 + 2] - ref[2]) <=
      tolerance
    );
  };
  const isDarkWall = (i) =>
    lum[i] < opts.darkCeiling && nearFrameEdge(i) && matchesLocalWall(i, opts.refTolerance);

  for (let i = 0; i < total; i += 1) {
    if (keep[i]) continue;
    const n = neighbours(i, size, nb);
    for (let k = 0; k < n; k += 1) {
      if (keep[nb[k]] && isDarkWall(nb[k])) {
        stack.push(i);
        break;
      }
    }
  }
  while (stack.length) {
    const i = stack.pop();
    const n = neighbours(i, size, nb);
    for (let k = 0; k < n; k += 1) {
      const j = nb[k];
      if (!keep[j]) continue;
      if (!isDarkWall(j) && !isWallColour(j)) continue;
      keep[j] = 0;
      stack.push(j);
    }
  }

  /* ── Pass 2: backdrop the product has enclosed — seen through the glass
     doors of the showcase, or between the carved spindles of a chair back.
     Chromatic evidence only; the dark warrant above is deliberately not
     reused, since without connectivity it has nothing to lean on. */
  const seen = new Uint8Array(total);
  for (let start = 0; start < total; start += 1) {
    if (!keep[start] || seen[start] || !isWallColour(start)) continue;

    const region = [];
    const walk = [start];
    seen[start] = 1;
    let touchesEdge = false;
    let r = 0;
    let g = 0;
    let b = 0;

    while (walk.length) {
      const i = walk.pop();
      region.push(i);
      r += data[i * 4];
      g += data[i * 4 + 1];
      b += data[i * 4 + 2];

      const x = i % size;
      const y = (i - x) / size;
      if (x === 0 || y === 0 || x === size - 1 || y === size - 1) touchesEdge = true;

      const n = neighbours(i, size, nb);
      for (let k = 0; k < n; k += 1) {
        const j = nb[k];
        if (keep[j] && !seen[j] && isWallColour(j)) {
          seen[j] = 1;
          walk.push(j);
        }
      }
    }

    // Reaching the frame edge means pass 1 declined it on brightness, not enclosure.
    if (touchesEdge) continue;

    const count = region.length;
    const x0 = region[0] % size;
    const ref = referenceAt(x0, (region[0] - x0) / size);
    if (!ref) continue;
    if (Math.hypot(r / count - ref[0], g / count - ref[1], b / count - ref[2]) > opts.refTolerance) {
      continue;
    }
    for (const i of region) keep[i] = 0;
  }

  // ── Pass 3: kept islands far smaller than the subject are shadow debris.
  const visited = new Uint8Array(total);
  const islands = [];
  for (let start = 0; start < total; start += 1) {
    if (!keep[start] || visited[start]) continue;
    const island = [];
    const walk = [start];
    visited[start] = 1;
    while (walk.length) {
      const i = walk.pop();
      island.push(i);
      const n = neighbours(i, size, nb);
      for (let k = 0; k < n; k += 1) {
        const j = nb[k];
        if (keep[j] && !visited[j]) {
          visited[j] = 1;
          walk.push(j);
        }
      }
    }
    islands.push(island);
  }
  const subject = islands.reduce((max, island) => Math.max(max, island.length), 0);
  for (const island of islands) {
    if (island.length < subject * opts.islandRatio) for (const i of island) keep[i] = 0;
  }

  /* ── Pass 4: the edge matte.
     A pixel straddling the outline is a blend of wall and product, so it fails
     the 8° test that holds correctly everywhere else. Left at full opacity
     those pixels ring the piece in red — the artifact a viewer reads instantly
     as a bad cutout, and the worst-placed one possible, since it sits exactly
     where the cutout meets its new wall.

     The instinct is to erode: test each boundary pixel and drop the ones that
     look like wall. Measured, that is a bad trade whichever test is used. On
     hue, the shave took 2,481 pixels off the carved sofa set and reduced its
     rim by nothing. On the local wall colour it is worse where it matters most:
     near the product's own shadow the reference *is* the near-black vignette,
     and dark teak sits inside `refTolerance` of it, so the test collapses
     precisely under the heavy pieces. It removed 2,004 pixels from the cream
     marble set to retire seven rim pixels, and 1,933 from the wooden dining set
     to retire four. Across the catalogue: 11,544 pixels of real timber deleted
     for a 22% reduction in a one-pixel artifact.

     So the same evidence is used to set alpha instead of to delete, and once
     that is the goal the right quantity is not a threshold at all but the
     pixel's coverage: how far it sits along the line from the wall behind it to
     the piece in front of it. Both ends of that line can be measured right
     here. The wall end is the mean of the removed pixels touching this one —
     which is a far better local estimate than the 32-pixel block mean serving
     passes 1b and 2, since inside one block the vignette can swing a long way
     and a rim pixel beside the dark end of it would read as far from the
     block's average and wrongly stay opaque. The product end is the mean of the
     nearby pixels that are fully interior, so not themselves blends. Projecting
     onto that line gives coverage directly, and it needs no tolerance: it
     rescales itself to however far apart the wall and the piece happen to be,
     which is the whole reason a fixed distance could not work — half of the way
     from red wall to teak is 46 units, further than `refTolerance` sees, so a
     true half-covered pixel was staying solid.

     Where the two ends are too close to define a line, there is nothing to
     project onto and the older fixed-distance form stands in, floored so a
     misjudgement there softens an edge rather than erasing it. Pass 5
     multiplies the result into its ramp. */
  const interior = new Uint8Array(total);
  for (let i = 0; i < total; i += 1) {
    if (!keep[i]) continue;
    const n = neighbours(i, size, nb);
    let open = false;
    for (let k = 0; k < n; k += 1) {
      if (!keep[nb[k]]) {
        open = true;
        break;
      }
    }
    if (!open) interior[i] = 1;
  }

  const edgeAlpha = new Float32Array(total).fill(1);
  for (let i = 0; i < total; i += 1) {
    if (!keep[i]) continue;

    /* Only pixels within two of the backdrop can be blends, and the sampling
       below is expensive enough to be worth skipping on the ~95% of the subject
       that is nowhere near an edge. `interior` answers this without touching the
       image: the pixel itself borders the backdrop, or one of its neighbours
       does. */
    if (interior[i]) {
      const n = neighbours(i, size, nb);
      let adjacent = false;
      for (let k = 0; k < n; k += 1) {
        if (!interior[nb[k]]) {
          adjacent = true;
          break;
        }
      }
      if (!adjacent) continue;
    }

    const x = i % size;
    const y = (i - x) / size;

    /* The wall end, from removed pixels within two of here. Their count also
       serves as the boundary test: no removed neighbours, no blending. */
    let wr = 0;
    let wg = 0;
    let wb = 0;
    let wn = 0;
    /* The product end, from interior pixels within three — wider, because
       close to a thin edge every kept pixel is itself part blend. */
    let pr = 0;
    let pg = 0;
    let pb = 0;
    let pn = 0;
    for (let dy = -3; dy <= 3; dy += 1) {
      const Y = y + dy;
      if (Y < 0 || Y >= size) continue;
      for (let dx = -3; dx <= 3; dx += 1) {
        const X = x + dx;
        if (X < 0 || X >= size) continue;
        const j = Y * size + X;
        const q = j * 4;
        if (interior[j]) {
          pr += data[q];
          pg += data[q + 1];
          pb += data[q + 2];
          pn += 1;
        } else if (!keep[j] && dy >= -2 && dy <= 2 && dx >= -2 && dx <= 2) {
          wr += data[q];
          wg += data[q + 1];
          wb += data[q + 2];
          wn += 1;
        }
      }
    }
    if (!wn) continue;

    const W = wn >= 3 ? [wr / wn, wg / wn, wb / wn] : referenceAt(x, y);
    const p = i * 4;
    const vr = data[p] - W[0];
    const vg = data[p + 1] - W[1];
    const vb = data[p + 2] - W[2];

    if (pn >= 3) {
      const ur = pr / pn - W[0];
      const ug = pg / pn - W[1];
      const ub = pb / pn - W[2];
      const len = ur * ur + ug * ug + ub * ub;
      if (len >= opts.matteFloor * opts.matteFloor) {
        const t = (vr * ur + vg * ug + vb * ub) / len;
        edgeAlpha[i] = t <= 0 ? 0 : t >= 1 ? 1 : t;
        continue;
      }
    }

    const t = Math.min(1, Math.hypot(vr, vg, vb) / opts.refTolerance);
    edgeAlpha[i] = opts.edgeFloor + (1 - opts.edgeFloor) * t;
  }

  return { keep, edgeAlpha };
}

/* ── public API ─────────────────────────────────────────────── */

/**
 * Cut the studio backdrop out of a product photo.
 *
 * @param source  A next/image static import, or a same-origin URL string.
 * @param options `size` is the working square; 512 costs ~150 ms on a
 *                laptop, 384 is the sensible choice on a phone.
 * @returns `{ url, aspect, contactDepth, removedPct, ok }` — `url` is an
 *          object URL for a PNG cropped to the subject, so callers can size
 *          pieces consistently, and `contactDepth` tells them how much floor
 *          the piece needs (see the crop block). `ok` is false when the result
 *          looks implausible and the caller should fall back to the original
 *          photograph.
 */
export function removeBackground(source, options = {}) {
  const opts = { ...DEFAULTS, ...options };
  const size = opts.size || 512;
  const url = resolveUrl(source);
  const key = `${url}|${size}`;

  // Share the in-flight promise, so two callers never decode the same photo twice.
  if (cache.has(key)) return cache.get(key);

  const job = (async () => {
    const img = await loadImage(url);

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, size, size);

    const frame = ctx.getImageData(0, 0, size, size);
    const data = frame.data;
    const { keep, edgeAlpha } = buildMask(data, size, opts);

    // Subject bounds, for the crop.
    let minX = size;
    let maxX = -1;
    let minY = size;
    let maxY = -1;
    let kept = 0;
    for (let i = 0; i < keep.length; i += 1) {
      if (!keep[i]) continue;
      kept += 1;
      const x = i % size;
      const y = (i - x) / size;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    const removedPct = Math.round(100 * (1 - kept / keep.length));
    /* Nothing removed means the fill never found the wall; nearly everything
       removed means it ate the product. Either way the caller should show the
       photograph instead of a broken cutout. */
    const ok = maxX > minX && maxY > minY && removedPct >= 15 && removedPct <= 95;

    /* Pass 5: one-pixel alpha ramp along the boundary, multiplied by pass 4's
       edge matte. The ramp alone keeps the outline from reading as a sticker
       laid on the wall; the matte is what stops it reading as a red-ringed
       one. Interior pixels are untouched at full opacity. */
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const i = y * size + x;
        if (!keep[i]) {
          data[i * 4 + 3] = 0;
          continue;
        }
        let open = 0;
        let seen = 0;
        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            const X = x + dx;
            const Y = y + dy;
            if (X < 0 || Y < 0 || X >= size || Y >= size) continue;
            seen += 1;
            if (!keep[Y * size + X]) open += 1;
          }
        }
        if (open) {
          const ramp = 1 - (open / seen) * opts.feather;
          data[i * 4 + 3] = Math.round(255 * ramp * edgeAlpha[i]);
        }
      }
    }
    ctx.putImageData(frame, 0, 0);

    if (!ok) {
      return { url: null, aspect: 1, contactDepth: 0, removedPct, ok: false };
    }

    // Crop to the subject with a hair of margin, so the feathered edge survives.
    const pad = 2;
    const cx = Math.max(0, minX - pad);
    const cy = Math.max(0, minY - pad);
    const cw = Math.min(size, maxX + pad + 1) - cx;
    const ch = Math.min(size, maxY + pad + 1) - cy;

    /* How much floor the piece stands on, as a fraction of the crop's height.
       These are photographs of scenes, not elevations: a sofa set's centre
       table sits a good way forward of the sofas flanking it, so the silhouette
       has no single ground line. The bounding box only knows the nearest
       contact point, and a room stage that anchors that point puts everything
       behind it up on the wall. So walk the bottom edge column by column and
       measure the spread between the rearmost and nearest contact.

       Read the rear from a low percentile rather than the true minimum, because
       the shallowest column is often not a foot at all — it is the outer sliver
       of an angled arm, or the underside of a frame seen between two legs. */
    let contactDepth = 0;
    const floorProfile = [];
    for (let x = minX; x <= maxX; x += 1) {
      for (let y = maxY; y >= minY; y -= 1) {
        if (keep[y * size + x]) {
          floorProfile.push(y);
          break;
        }
      }
    }
    if (floorProfile.length) {
      floorProfile.sort((a, b) => a - b);
      const rear = floorProfile[Math.round(0.1 * (floorProfile.length - 1))];
      contactDepth = Math.min(0.5, (maxY - rear) / ch);
    }

    const cropped = document.createElement('canvas');
    cropped.width = cw;
    cropped.height = ch;
    cropped.getContext('2d').drawImage(canvas, cx, cy, cw, ch, 0, 0, cw, ch);

    const blob = await new Promise((res) => cropped.toBlob(res, 'image/png'));
    return {
      url: URL.createObjectURL(blob),
      aspect: cw / ch,
      contactDepth,
      removedPct,
      ok: true,
    };
  })();

  cache.set(key, job);
  // A failed decode should not poison the cache for a later retry.
  job.catch(() => cache.delete(key));
  return job;
}
