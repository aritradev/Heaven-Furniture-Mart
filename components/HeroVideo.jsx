'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './HeroVideo.module.css';

/* First frame at 28×16, inlined. A hero must never be a dark hole on a cold
   load, and at this size the cost of a separate request outweighs the bytes. */
const POSTER =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAwICQsJCAwLCgsODQwOEh4UEhEREiUbHBYeLCcuLisnKyoxN0Y7MTRCNCorPVM+QkhKTk9OLztWXFVMW0ZNTkv/2wBDAQ0ODhIQEiQUFCRLMisyS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0v/wAARCAAQABwDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAwQFAv/EACgQAAIBAgUDAwUAAAAAAAAAAAECAwQRABIhMVEFBkEUYYEiIzJxkf/EABYBAQEBAAAAAAAAAAAAAAAAAAIAAf/EABoRAAICAwAAAAAAAAAAAAAAAAABAhEhMUH/2gAMAwEAAhEDEQA/AEYKmSFSPVKJM6C7pci/gWsNR7X0vfcYfra2pnkpg8SKJwMilipFyQNLH9jXC0PbbyLd2zgg2Sb69dthYc/3fB4qenjrAaaKSqdlIb75FhyPb587YLa2KmYDiFKhJnEckRKnK+YXtbTTm4+MSek9tRdaSoqZqwwMJ2UK0dyRYEHUje+AdzwChqpViM4dm0Oay2OpVRuRqPPPxKo+pN05HhjZspct+I4HKnjnGSTXSjm6P//Z';

/* The clip's own length, and how long before the end to start the handoff. Both
   are measured from the file, not guessed: 8.29s at 60fps, and its last frame
   does not match its first (mean channel difference 55/255), so `loop` on a
   single element would visibly cut every pass. See the note on the seam below.

   LEAD must exceed the 600ms dissolve in the stylesheet by a full tick of
   `timeupdate`, which this browser fires every 265ms (p90 267ms). Armed at one
   fade length the handoff lands late by up to that tick, and the outgoing player
   hits its final frame while still part-visible — measured at 41% opacity, a
   frozen frame you can see. At 1.05s the worst-case runway is ~0.78s against a
   0.6s fade, so the dissolve always finishes on moving footage. */
const CLIP = 8.29;
const LEAD = 1.05;

/**
 * The showroom, running behind the hero.
 *
 * Two players, not one. The footage does not loop cleanly — its closing frame
 * sits in a different part of the room from its opening one — so a plain
 * `loop` attribute produces a jump-cut on a fixed 8-second beat, which is the
 * kind of detail that makes a page feel cheap. Instead the second player is
 * armed a fade-length before the first one ends and the pair cross-dissolve,
 * so the room drifts without a visible seam.
 *
 * The video is decoration, so it is also the first thing to go: held on its
 * poster for reduced motion, for Save-Data, and on 2g/3g, where 8 MB of
 * ambient footage is indefensible. Playback follows visibility for the same
 * reason — decoding a loop nobody is looking at is pure battery.
 */
export default function HeroVideo() {
  const wrapRef = useRef(null);
  const aRef = useRef(null);
  const bRef = useRef(null);

  /* Which player is showing. The other is the one being prepared. */
  const [front, setFront] = useState('a');
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);

  /* null until measured on the client, so the server render and first paint
     agree — the poster is what both sides render. */
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () => {
      const c = navigator.connection;
      /* Save-Data is a stated preference and 2g is not survivable at this file
         size, so both get the poster. `3g` is deliberately NOT in here: Chrome
         infers it from round-trip heuristics and gets it wrong often — this
         very page reports 3g when served from localhost — so gating on it
         would quietly deny the hero to a large slice of people on adequate
         connections. The poster, the fade-in and the byte budget are what
         protect those visitors instead. */
      const thin = c && (c.saveData || /^(slow-)?2g$/.test(c.effectiveType || ''));
      setAllowed(!motion.matches && !thin);
    };
    read();
    // Both can change mid-session: an OS setting, or walking out of wifi.
    motion.addEventListener('change', read);
    navigator.connection?.addEventListener?.('change', read);
    return () => {
      motion.removeEventListener('change', read);
      navigator.connection?.removeEventListener?.('change', read);
    };
  }, []);

  /* Attach src only once we know the visitor should get video at all. `armed`
     latches on, so the 8 MB fetch is never repeated; withdrawing consent hides
     and stops the players instead of unmounting them, which is handled below. */
  useEffect(() => {
    if (allowed) setArmed(true);
  }, [allowed]);

  /* Bring the trailing player in and swap which is on top. The outgoing one is
     left playing through the dissolve — cutting it would put back the freeze
     this whole mechanism exists to avoid. */
  const handoff = useCallback(
    (which) => {
      if (which !== front || !allowed) return;
      const next = which === 'a' ? bRef.current : aRef.current;
      if (!next) return;
      next.currentTime = 0;
      next.play?.().catch(() => {});
      setFront(which === 'a' ? 'b' : 'a');
    },
    [front, allowed]
  );

  /* The seam. Watch the leading player's time and hand off before it ends, so
     the two cross-dissolve rather than cut. */
  const watch = useCallback(
    (which) => () => {
      if (which !== front || !allowed) return;
      const lead = which === 'a' ? aRef.current : bRef.current;
      if (!lead) return;
      const end = lead.duration || CLIP;
      if (lead.currentTime < end - LEAD) return;
      handoff(which);
    },
    [front, allowed, handoff]
  );

  /* The safety net. `timeupdate` stops firing while paused, so a pause landing
     inside the last LEAD seconds — going off-screen, or a hidden tab — loses the
     handoff and the leading player reaches `ended`. Calling play() on an ended
     element rewinds it to zero, which is the hard cut this rig exists to avoid,
     so hand off from here instead. Late means no dissolve, but a cut that
     happens once after a pause beats one on every pass. */
  const finish = useCallback((which) => () => handoff(which), [handoff]);

  /* Withdrawn consent mid-session — someone turns on reduced motion, or walks
     out of wifi onto a metered connection. `armed` has already latched, so stop
     the players rather than leaving them running behind a hidden layer. */
  useEffect(() => {
    if (allowed !== false || !armed) return;
    for (const el of [aRef.current, bRef.current]) el?.pause?.();
    setReady(false);
  }, [allowed, armed]);

  // Pause off-screen and on a hidden tab; resume only when both are true again.
  useEffect(() => {
    if (!allowed) return undefined;
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    let onScreen = true;
    const sync = () => {
      const play = onScreen && !document.hidden;
      for (const el of [aRef.current, bRef.current]) {
        if (!el) continue;
        if (play) {
          // Only the visible player runs; the other waits its turn at the seam.
          if (el === (front === 'a' ? aRef.current : bRef.current)) el.play?.().catch(() => {});
        } else {
          el.pause?.();
        }
      }
    };

    const io = new IntersectionObserver((entries) => {
      /* Last record, not first: a fast scroll queues several in one callback
         and entries[0] is the stale one. */
      onScreen = entries[entries.length - 1].isIntersecting;
      sync();
    });
    io.observe(wrap);
    document.addEventListener('visibilitychange', sync);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [allowed, front]);

  // Guarded, so a late `loadeddata` cannot re-reveal players consent withdrew.
  const reveal = useCallback(() => setReady(allowed === true), [allowed]);
  // A failed decode leaves the poster showing rather than a broken-media glyph.
  const fail = useCallback(() => setReady(false), []);

  const common = {
    muted: true,
    playsInline: true,
    preload: armed ? 'auto' : 'none',
    disablePictureInPicture: true,
    tabIndex: -1,
    'aria-hidden': true,
  };

  return (
    <div className={styles.wrap} ref={wrapRef} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- already an
          inlined 1.3 KB data URI; next/image would add a request to optimize
          something smaller than its own markup. */}
      <img src={POSTER} alt="" className={styles.poster} />

      {armed && (
        <div className={`${styles.players} ${ready ? styles.playersReady : ''}`}>
          <video
            {...common}
            ref={aRef}
            src="/hero.mp4"
            autoPlay
            className={`${styles.player} ${front === 'a' ? styles.playerOn : ''}`}
            onTimeUpdate={watch('a')}
            onEnded={finish('a')}
            onLoadedData={reveal}
            onError={fail}
          />
          <video
            {...common}
            ref={bRef}
            src="/hero.mp4"
            className={`${styles.player} ${front === 'b' ? styles.playerOn : ''}`}
            onTimeUpdate={watch('b')}
            onEnded={finish('b')}
          />
        </div>
      )}

      {/* The grade. A teal multiply pulls the footage into the brand's own
          palette instead of leaving it as dropped-in stock, and the scrim
          buys the headline its contrast. Both are fixed rather than adaptive:
          the headline band only varies by 0.03 luminance across the whole
          clip, so there is nothing for a reactive overlay to react to. */}
      <div className={styles.grade} />
      <div className={styles.scrim} />
    </div>
  );
}
