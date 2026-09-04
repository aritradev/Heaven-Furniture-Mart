'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { removeBackground } from '@/lib/removeBg';
import styles from './RoomPreview.module.css';

/* ── palettes ───────────────────────────────────────────────────
   Architectural paint names, because "light blue" tells a customer
   nothing about whether it belongs on their wall. */

const WALLS = [
  { name: 'Alabaster', hex: '#EFE9DE' },
  { name: 'Warm Greige', hex: '#D6C9B8' },
  { name: 'Pale Linen', hex: '#E3DBCA' },
  { name: 'Morning Mist', hex: '#D2D7D8' },
  { name: 'Sage Whisper', hex: '#BDC8B5' },
  { name: 'Dusty Indigo', hex: '#96A8BB' },
  { name: 'Chittagong Clay', hex: '#C08A6B' },
  { name: 'Deep Teal', hex: '#2E5157' },
  { name: 'Obsidian Slate', hex: '#33373B' },
];

/* Teak leads, and is therefore the default, because a warm wood floor under a
   pale wall establishes the horizon on sight. White tile under Alabaster is a
   real Chittagong pairing but the two tones nearly coincide, so opening on it
   made the room read as a flat void. */
const FLOORS = [
  { name: 'Teak Wood', hex: '#9C6A41' },
  { name: 'White Tile', hex: '#E8E5DF' },
  { name: 'Grey Tile', hex: '#B3B1AD' },
  { name: 'Veined Marble', hex: '#DCD7CC' },
  { name: 'Red Oxide', hex: '#985643' },
];

/* Each preset carries its own shadow geometry, because that is what actually
   sells the light: a low warm sun throws a long soft shadow to one side,
   overhead daylight throws a short tight one, and a dim room barely throws
   one at all. */
const LIGHTS = [
  {
    key: 'daylight',
    name: 'Natural Daylight',
    kelvin: '5000K',
    tint: 'rgba(206, 228, 255, 0.28)',
    blend: 'soft-light',
    brightness: 1.03,
    saturate: 1,
    vignette: 0.1,
    shadow: { spread: 1, drop: 0.4, density: 0.66, blur: 16, skew: 0 },
  },
  {
    key: 'sunset',
    name: 'Warm Sunset',
    kelvin: '3000K',
    tint: 'rgba(255, 172, 88, 0.32)',
    blend: 'soft-light',
    brightness: 1,
    saturate: 1.07,
    vignette: 0.17,
    shadow: { spread: 1.45, drop: 0.62, density: 0.56, blur: 24, skew: -14 },
  },
  {
    key: 'ambient',
    name: 'Moody Ambient',
    kelvin: '2700K',
    tint: 'rgba(72, 56, 94, 0.4)',
    blend: 'multiply',
    brightness: 0.9,
    saturate: 0.93,
    vignette: 0.3,
    shadow: { spread: 1.7, drop: 0.3, density: 0.44, blur: 34, skew: 6 },
  },
];

/* Relative framing per room type. These are proportions for composition, not
   measurements — a dining set reads wide and low, an office chair tall and
   narrow. Real dimensions belong on the quotation, and the call to action
   asks for the room's instead of inventing them. */
const FRAMING = {
  living: { height: '44%', maxWidth: '90%' },
  bedroom: { height: '50%', maxWidth: '86%' },
  dining: { height: '50%', maxWidth: '90%' },
  office: { height: '62%', maxWidth: '48%' },
};

/* Where the piece stands, given how much floor it needs.

   The cutouts come from photographs of whole settings, and a setting carries
   its own perspective: the centre table's feet are lower in the frame than the
   sofas behind it. A bounding box flattens that — its bottom edge is only the
   nearest contact point — so standing that edge a fixed distance below the
   horizon leaves everything further back above the horizon, which the eye
   reads as furniture hung on the wall. `contactDepth` measures the spread, and
   the piece is sunk by it: the rearmost feet land just below the wall/floor
   junction and the rest of the footprint falls forward into the room.

   The clamp is what keeps this honest for the cases the measurement gets
   wrong. The ceiling is the old fixed value, so nothing ends up nearer the
   wall than before; the floor leaves room for the contact shadow, which
   extends a little below the piece. */
const HORIZON_PCT = 28; // .floor's height — keep in step with the stylesheet
const SINK_PCT = 2.5; // clear floor between the junction and the rearmost feet

function placement(framing, contactDepth) {
  const heightPct = parseFloat(framing.height);
  const stand = Math.min(
    26,
    Math.max(5, HORIZON_PCT - SINK_PCT - contactDepth * heightPct)
  );
  return {
    stand,
    /* The row is only the part of the stage above where the piece stands, so a
       height given as a share of the stage has to be converted to a share of
       the row — otherwise sinking the piece would silently enlarge it. */
    rowHeight: heightPct / (1 - stand / 100),
  };
}

/* ── colour ─────────────────────────────────────────────────── */

function toRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const toHex = (r, g, b) =>
  `#${[r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')}`;

function mix(a, b, t) {
  const [r1, g1, b1] = toRgb(a);
  const [r2, g2, b2] = toRgb(b);
  return toHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

/** Perceived lightness, for deciding whether a label sits on light or dark. */
function luminance(hex) {
  const [r, g, b] = toRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/* ── component ──────────────────────────────────────────────── */

export default function RoomPreview({ item, onClose }) {
  const [wall, setWall] = useState(WALLS[0].hex);
  const [floor, setFloor] = useState(FLOORS[0].hex);
  const [lightKey, setLightKey] = useState('daylight');
  const [cut, setCut] = useState({ state: 'working' });
  const [photo, setPhoto] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [note, setNote] = useState('');

  const panelRef = useRef(null);
  const photoRef = useRef(null);
  const sampleRef = useRef(null);
  const restoreFocusRef = useRef(null);

  const light = LIGHTS.find((l) => l.key === lightKey) || LIGHTS[0];
  const framing = FRAMING[item.category] || FRAMING.living;

  /* ── cut the product out ─────────────────────────────────────
     Deferred one frame past mount so the panel's entrance animation runs
     before the main thread is handed ~150 ms of pixel work. */
  useEffect(() => {
    let alive = true;
    const size = typeof window !== 'undefined' && window.innerWidth < 768 ? 384 : 512;

    const id = requestAnimationFrame(() => {
      removeBackground(item.image, { size })
        .then((result) => {
          if (!alive) return;
          setCut(result.ok ? { state: 'ready', ...result } : { state: 'failed' });
        })
        .catch(() => alive && setCut({ state: 'failed' }));
    });

    return () => {
      alive = false;
      cancelAnimationFrame(id);
    };
  }, [item.image]);

  // Escape closes; focus moves into the panel and back out on close.
  useEffect(() => {
    restoreFocusRef.current = document.activeElement;
    panelRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      restoreFocusRef.current?.focus?.();
    };
  }, [onClose]);

  // The room photo never leaves the device; this is the only reference to it.
  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo); }, [photo]);

  const cssVars = useMemo(() => {
    const trim = mix(wall, '#FFFFFF', 0.74);
    const { stand, rowHeight } = placement(framing, cut.contactDepth || 0);
    return {
      '--wall': wall,
      '--trim': trim,
      '--trim-shade': mix(trim, '#000000', 0.34),
      '--floor': floor,
      /* Shadows multiply a darkened floor tone rather than flat black, so they
         absorb the floor rather than sit on top of it. Passed as components so
         the stylesheet can vary alpha per tier inside rgba(). */
      '--shadow-rgb': toRgb(mix(floor, '#1A1008', 0.82)).join(', '),
      '--tint': light.tint,
      '--tint-blend': light.blend,
      '--brightness': light.brightness,
      '--saturate': light.saturate,
      '--vignette': light.vignette,
      '--sh-spread': light.shadow.spread,
      '--sh-drop': light.shadow.drop,
      '--sh-density': light.shadow.density,
      '--sh-blur': `${light.shadow.blur}px`,
      '--sh-skew': `${light.shadow.skew}deg`,
      '--stand': `${stand}%`,
      '--product-h': `${rowHeight}%`,
      '--product-w': framing.maxWidth,
      '--aspect': cut.aspect || 1,
      /* The diffuse shadow spans the footprint, so it grows with it — a pool
         under one pair of feet would leave the rest of a deep set floating. */
      '--contact-depth': cut.contactDepth || 0,
    };
  }, [wall, floor, light, framing, cut.aspect, cut.contactDepth]);

  /* ── sampling the customer's own wall ────────────────────────── */

  const onPhotoChosen = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (photo) URL.revokeObjectURL(photo);
    setPhoto(URL.createObjectURL(file));
    setNote('Tap anywhere on your photo to lift that colour onto the wall.');
  };

  /** Average a 5×5 patch, so a single noisy pixel cannot decide the wall. */
  const sampleFromPhoto = useCallback((event) => {
    const img = photoRef.current;
    if (!img?.naturalWidth) return;

    const box = img.getBoundingClientRect();
    // Undo object-fit: contain — letterboxing offsets the click.
    const scale = Math.min(box.width / img.naturalWidth, box.height / img.naturalHeight);
    const insetX = (box.width - img.naturalWidth * scale) / 2;
    const insetY = (box.height - img.naturalHeight * scale) / 2;
    const px = Math.round((event.clientX - box.left - insetX) / scale);
    const py = Math.round((event.clientY - box.top - insetY) / scale);
    if (px < 0 || py < 0 || px >= img.naturalWidth || py >= img.naturalHeight) return;

    let canvas = sampleRef.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      sampleRef.current = canvas;
    }
    if (canvas.width !== img.naturalWidth) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
    }

    const x0 = Math.max(0, px - 2);
    const y0 = Math.max(0, py - 2);
    const w = Math.min(5, img.naturalWidth - x0);
    const h = Math.min(5, img.naturalHeight - y0);
    const { data } = canvas.getContext('2d').getImageData(x0, y0, w, h);

    let r = 0;
    let g = 0;
    let b = 0;
    const n = data.length / 4;
    for (let i = 0; i < n; i += 1) {
      r += data[i * 4];
      g += data[i * 4 + 1];
      b += data[i * 4 + 2];
    }
    const hex = toHex(r / n, g / n, b / n);
    setWall(hex);
    setNote(`Sampled ${hex.toUpperCase()} from your room.`);
  }, []);

  const eyeDropperSupported = typeof window !== 'undefined' && 'EyeDropper' in window;

  const useEyeDropper = async () => {
    try {
      const { sRGBHex } = await new window.EyeDropper().open();
      setWall(sRGBHex);
      setNote(`Sampled ${sRGBHex.toUpperCase()} from your screen.`);
    } catch {
      // The picker was dismissed — nothing to report.
    }
  };

  /* ── take it away ────────────────────────────────────────────
     A flat redraw of the scene, because a CSS composite cannot be read back
     off the screen. Same partition, same tones, same shadow hierarchy. */
  const shareScene = async () => {
    if (cut.state !== 'ready' || sharing) return;
    setSharing(true);
    try {
      const S = 1080;
      const canvas = document.createElement('canvas');
      canvas.width = S;
      canvas.height = S;
      const ctx = canvas.getContext('2d');

      const horizon = Math.round(S * 0.72);
      const footer = 96;

      ctx.fillStyle = wall;
      ctx.fillRect(0, 0, S, horizon);
      // Corner falloff, then the light gradient down the wall.
      const sides = ctx.createLinearGradient(0, 0, S, 0);
      sides.addColorStop(0, 'rgba(0,0,0,0.17)');
      sides.addColorStop(0.2, 'rgba(0,0,0,0)');
      sides.addColorStop(0.5, 'rgba(255,255,255,0.05)');
      sides.addColorStop(0.8, 'rgba(0,0,0,0)');
      sides.addColorStop(1, 'rgba(0,0,0,0.17)');
      ctx.fillStyle = sides;
      ctx.fillRect(0, 0, S, horizon);

      ctx.fillStyle = floor;
      ctx.fillRect(0, horizon, S, S - horizon - footer);
      const depth = ctx.createLinearGradient(0, horizon, 0, S - footer);
      depth.addColorStop(0, 'rgba(0,0,0,0.22)');
      depth.addColorStop(0.45, 'rgba(0,0,0,0.02)');
      depth.addColorStop(1, 'rgba(255,255,255,0.08)');
      ctx.fillStyle = depth;
      ctx.fillRect(0, horizon, S, S - horizon - footer);

      // Baseboard.
      const trimH = Math.round(S * 0.022);
      ctx.fillStyle = mix(wall, '#FFFFFF', 0.74);
      ctx.fillRect(0, horizon - trimH, S, trimH);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(0, horizon - 2, S, 3);

      const product = await new Promise((res, rej) => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = rej;
        im.src = cut.url;
      });

      const maxH = (S - footer) * 0.5;
      const drawH = Math.min(maxH, (S * 0.86) / cut.aspect);
      const drawW = drawH * cut.aspect;
      /* Same rule as the stage: the piece is sunk by its own contact depth so
         its rearmost feet clear the junction, then clamped so a deep set cannot
         walk off the bottom of the frame. */
      const stands = cut.contactDepth || 0;
      const floorBand = S - footer - horizon;
      const baseY = Math.min(
        S - footer - 10,
        horizon + floorBand * 0.12 + stands * drawH
      );
      const drawX = (S - drawW) / 2;

      // Diffuse ambient, then the tight contact shadow.
      const { spread, drop, density, skew } = light.shadow;
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.translate(drawX + drawW / 2 + skew * 2, baseY - depth * drawH * 0.25);
      ctx.scale(drawW * 0.62 * spread, drawH * (0.1 * (0.6 + drop) + depth * 0.5));
      const ambient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      const [sr, sg, sb] = toRgb(mix(floor, '#1A1008', 0.82));
      ambient.addColorStop(0, `rgba(${sr},${sg},${sb},${density})`);
      ambient.addColorStop(1, `rgba(${sr},${sg},${sb},0)`);
      ctx.fillStyle = ambient;
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.translate(drawX + drawW / 2, baseY);
      ctx.scale(drawW * 0.4, drawH * 0.028);
      const contact = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      contact.addColorStop(0, `rgba(${sr},${sg},${sb},${Math.min(0.85, density + 0.3)})`);
      contact.addColorStop(1, `rgba(${sr},${sg},${sb},0)`);
      ctx.fillStyle = contact;
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.drawImage(product, drawX, baseY - drawH, drawW, drawH);

      // The lighting pass, over room and product alike.
      ctx.save();
      ctx.globalCompositeOperation = light.blend === 'multiply' ? 'multiply' : 'soft-light';
      ctx.fillStyle = light.tint;
      ctx.fillRect(0, 0, S, S - footer);
      ctx.restore();

      ctx.fillStyle = '#2C1810';
      ctx.fillRect(0, S - footer, S, footer);
      ctx.fillStyle = '#F5F0E8';
      ctx.font = '600 30px Georgia, serif';
      ctx.fillText(item.title, 40, S - footer + 42);
      ctx.fillStyle = '#C4A882';
      ctx.font = '400 22px system-ui, sans-serif';
      ctx.fillText(
        `${item.price}  ·  wall ${wall.toUpperCase()}  ·  Heaven Furniture Mart`,
        40,
        S - footer + 74
      );

      const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
      const file = new File([blob], `${item.id}-room-preview.png`, { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: item.title,
          text: `${item.title} in my room — Heaven Furniture Mart`,
        });
      } else {
        const href = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = href;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(href);
        setNote('Saved to your downloads.');
      }
    } catch {
      setNote('Could not create the image. Try again.');
    } finally {
      setSharing(false);
    }
  };

  const wallName = WALLS.find((w) => w.hex.toLowerCase() === wall.toLowerCase())?.name;
  const floorName = FLOORS.find((f) => f.hex.toLowerCase() === floor.toLowerCase())?.name;

  const whatsapp = `https://wa.me/8801960481983?text=${encodeURIComponent(
    `Hi! I previewed the ${item.title} (${item.price}) against a ${
      wallName ? `${wallName} (${wall.toUpperCase()})` : wall.toUpperCase()
    } wall${floorName ? ` with a ${floorName} floor` : ''} and I think it suits my room. ` +
      `My room measures roughly ___ ft × ___ ft — can you confirm the fit, availability and delivery time?`
  )}`;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={`Room preview — ${item.title}`}
        tabIndex={-1}
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.head}>
          <div>
            <span className={styles.eyebrow}>Room Preview</span>
            <h3 className={styles.title}>{item.title}</h3>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="Close room preview">
            ✕
          </button>
        </header>

        <div className={styles.body}>
          {/* ── the room ─────────────────────────────────────── */}
          <div className={styles.stageWrap}>
            <div className={styles.stage} style={cssVars}>
              <div className={styles.wall} />
              <div className={styles.baseboard} />
              <div className={styles.floor} />

              {cut.state === 'ready' && (
                <div className={styles.productRow}>
                  <div className={styles.product}>
                    <span className={styles.shadowDiffuse} aria-hidden="true" />
                    <span className={styles.shadowContact} aria-hidden="true" />
                    {/* A blob URL from a canvas, so there is nothing for
                        next/image to optimise — it is already sized and
                        cropped by the removal pass. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cut.url} alt={`${item.title}, background removed`} />
                  </div>
                </div>
              )}

              <div className={styles.lightLayer} aria-hidden="true" />
              <div className={styles.vignette} aria-hidden="true" />

              {cut.state === 'working' && (
                <div className={styles.stageMsg}>
                  <span className={styles.spinner} aria-hidden="true" />
                  Cutting the piece out of its studio backdrop…
                </div>
              )}
              {cut.state === 'failed' && (
                <div className={styles.stageMsg}>
                  This photo couldn&apos;t be isolated cleanly. Ask us on WhatsApp and
                  we&apos;ll mock it up against your wall by hand.
                </div>
              )}
            </div>

            <p className={styles.caveat}>
              Every screen renders colour differently — treat this as a guide to
              proportion and tone, not a paint match.
            </p>
          </div>

          {/* ── the controls ─────────────────────────────────── */}
          <div className={styles.rail}>
            <section className={styles.group}>
              <h4 className={styles.groupTitle}>
                Wall colour
                <span className={styles.chip} style={{
                  background: wall,
                  color: luminance(wall) > 0.6 ? '#2C1810' : '#FFFFFF',
                }}>
                  {wallName || wall.toUpperCase()}
                </span>
              </h4>

              <div className={styles.swatches}>
                {WALLS.map((w) => (
                  <button
                    key={w.hex}
                    className={`${styles.swatch} ${
                      w.hex.toLowerCase() === wall.toLowerCase() ? styles.swatchOn : ''
                    }`}
                    style={{ background: w.hex }}
                    onClick={() => { setWall(w.hex); setNote(''); }}
                    aria-pressed={w.hex.toLowerCase() === wall.toLowerCase()}
                    title={w.name}
                  >
                    <span className={styles.srOnly}>{w.name}</span>
                  </button>
                ))}
              </div>

              <div className={styles.pickRow}>
                <label className={styles.pickLabel}>
                  <input
                    type="color"
                    value={wall}
                    onChange={(e) => { setWall(e.target.value); setNote(''); }}
                    aria-label="Choose an exact wall colour"
                  />
                  Exact colour
                </label>

                {eyeDropperSupported && (
                  <button className={styles.pickBtn} onClick={useEyeDropper}>
                    <Dropper /> Pick from screen
                  </button>
                )}
              </div>

              <label className={styles.upload}>
                <input type="file" accept="image/*" onChange={onPhotoChosen} />
                <Camera />
                {photo ? 'Use a different room photo' : 'Match a photo of your room'}
              </label>

              {photo && (
                <button
                  type="button"
                  className={styles.photoBox}
                  onClick={sampleFromPhoto}
                  aria-label="Tap your room photo to sample its wall colour"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img ref={photoRef} src={photo} alt="Your room" />
                </button>
              )}

              {note && <p className={styles.note}>{note}</p>}
              {photo && (
                <p className={styles.privacy}>
                  Your photo stays on this device — it is never uploaded.
                </p>
              )}
            </section>

            <section className={styles.group}>
              <h4 className={styles.groupTitle}>Floor</h4>
              <div className={styles.pills}>
                {FLOORS.map((f) => (
                  <button
                    key={f.hex}
                    className={`${styles.pill} ${
                      f.hex.toLowerCase() === floor.toLowerCase() ? styles.pillOn : ''
                    }`}
                    onClick={() => setFloor(f.hex)}
                    aria-pressed={f.hex.toLowerCase() === floor.toLowerCase()}
                  >
                    <span className={styles.pillDot} style={{ background: f.hex }} />
                    {f.name}
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.group}>
              <h4 className={styles.groupTitle}>Light</h4>
              <div className={styles.pills}>
                {LIGHTS.map((l) => (
                  <button
                    key={l.key}
                    className={`${styles.pill} ${l.key === lightKey ? styles.pillOn : ''}`}
                    onClick={() => setLightKey(l.key)}
                    aria-pressed={l.key === lightKey}
                  >
                    {l.name}
                    <em className={styles.kelvin}>{l.kelvin}</em>
                  </button>
                ))}
              </div>
            </section>

            <div className={styles.actions}>
              <button
                className={styles.secondaryBtn}
                onClick={shareScene}
                disabled={cut.state !== 'ready' || sharing}
              >
                {sharing ? 'Preparing…' : 'Save or share this view'}
              </button>
              <a
                className={styles.primaryBtn}
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                Check the fit on WhatsApp →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── icons ──────────────────────────────────────────────────── */

const Dropper = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 7l6 6" /><path d="M4 20l4-1 9.5-9.5a2.1 2.1 0 000-3l-.5-.5a2.1 2.1 0 00-3 0L4.5 15.5 4 20z" />
  </svg>
);

const Camera = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8a2 2 0 012-2h2l1.5-2h7L17 6h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
    <circle cx="12" cy="12.5" r="3.2" />
  </svg>
);
