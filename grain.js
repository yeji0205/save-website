/* Background grain, built from Perlin/simplex noise on a <canvas>.
 *
 * Uses the `simplex-noise` package. Simplex is Ken Perlin's own improved
 * version of Perlin noise — same organic, clumpy character, faster and
 * without the directional artefacts of the 1985 original.
 *
 * SEAMLESS TILING is the one non-obvious part. Perlin noise is infinite but
 * does not repeat, so a naive tile shows hard seams where it wraps. The fix
 * is to sample 4D noise around two circles: as x walks left to right it
 * travels a full circle in dimensions 1-2, and as y walks top to bottom it
 * travels a full circle in dimensions 3-4. Both loops close on themselves,
 * so the tile matches its own edges exactly.
 *
 * Then it is standard fBm: add several octaves, each double the frequency
 * and half the amplitude, to get detail at more than one scale.
 */

import { createNoise4D } from "simplex-noise";

export const GRAIN = {
  /* How many noise features fit across the tile. HIGHER = finer, smaller
     specks. 32 is chunky, 64 medium, 128 fine. Speck size in pixels is
     roughly tile / scale. */
  scale: 64,

  /* Octaves of detail. 1 = smooth blobs only, 4 = rich and grainy.
     Each octave doubles frequency and multiplies amplitude by persistence. */
  octaves: 4,

  /* How much each successive octave contributes, 0..1.
     Low = smooth, high = rough and noisy. */
  persistence: 0.55,

  /* Speck opacity, 0..1. Raise for harsher grain. */
  contrast: 0.9,

  /* Balance of dark vs light specks, 0..1. 0.5 = even.
     Below 0.5 leans light, above 0.5 leans dark. */
  lightness: 0.5,

  /* Repeating tile size in pixels. Bigger hides the repeat better but costs
     more to generate — it is scale x scale noise lookups per octave. */
  tile: 256,

  /* Change for a different random pattern with the same character. */
  seed: 7,
};

/* Small seeded RNG, so the same seed always gives the same texture.
   simplex-noise takes any function returning 0..1. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Build the grain texture and return it as a PNG data URL. */
export function buildGrainTexture(options = {}) {
  const { scale, octaves, persistence, contrast, lightness, tile, seed } = {
    ...GRAIN,
    ...options,
  };

  const noise4D = createNoise4D(mulberry32(seed));

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = tile;

  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(tile, tile);
  const px = image.data; // flat [r,g,b,a, r,g,b,a, ...]

  // Radius of the two sampling circles. Circumference 2*PI*r spans `scale`
  // noise units, so `scale` features fit across the tile.
  const radius = scale / (2 * Math.PI);

  for (let y = 0; y < tile; y++) {
    const v = (y / tile) * 2 * Math.PI;
    const cosV = Math.cos(v);
    const sinV = Math.sin(v);

    for (let x = 0; x < tile; x++) {
      const u = (x / tile) * 2 * Math.PI;
      const cosU = Math.cos(u);
      const sinU = Math.sin(u);

      // fBm: sum octaves at doubling frequency, halving amplitude.
      // Frequencies stay whole multiples of the loop, so tiling survives.
      let sum = 0;
      let amplitude = 1;
      let total = 0;

      for (let o = 0; o < octaves; o++) {
        const r = radius * (1 << o); // radius * 2^o
        sum += amplitude * noise4D(cosU * r, sinU * r, cosV * r, sinV * r);
        total += amplitude;
        amplitude *= persistence;
      }

      // noise4D returns -1..1; fold to 0..1.
      const n = sum / total / 2 + 0.5;

      // Dark speck or light speck, and how far from neutral it is.
      // Mid-range values stay transparent so the sage shows between specks.
      const o = (y * tile + x) * 4;
      const value = n < lightness ? 0 : 255;
      const strength = Math.abs(n - lightness) * 2;

      px[o] = px[o + 1] = px[o + 2] = value;
      px[o + 3] = Math.round(Math.min(1, strength) * contrast * 255);
    }
  }

  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png");
}

/** Generate the texture and expose it to CSS as --grain-url on <html>. */
export function applyGrain(options = {}) {
  const { tile } = { ...GRAIN, ...options };
  const root = document.documentElement;

  root.style.setProperty("--grain-url", `url("${buildGrainTexture(options)}")`);
  root.style.setProperty("--grain-tile", `${tile}px`);
}
