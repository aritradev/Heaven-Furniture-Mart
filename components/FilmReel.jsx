'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CHANNEL, REEL, clock, embedUrl, thumbUrl, watchUrl } from '@/lib/filmReel';
import styles from './FilmReel.module.css';

/**
 * On the record — the channel's footage, on the page.
 *
 * Three decisions carry this section, and each responds to something specific
 * about these seven files rather than to a layout preference.
 *
 * 1. ONE GRID, TWO SHAPES. Every clip renders at the ratio it was shot in: the
 *    125-second showroom tour spans the full row at 16:9, the six verticals sit
 *    beneath it at 9:16. Equal boxes would letterbox six of seven and rank a
 *    two-minute walk through a building level with a five-second mood loop.
 *    They are one grid, not two blocks — the tour is a spanning cell, so
 *    nothing about the arrangement implies a second section.
 *
 * 2. PROVENANCE IS ON THE CARD. Three of the seven were filmed by other people
 *    (see lib/filmReel.js). Since they share the grid with the real workshop
 *    footage, each one carries a plainer chip reading "Saved reference" and a
 *    note that says whose room it is. Three sections above this one the page
 *    promises in-house artisans; an unmarked apartment tour would spend that
 *    promise for one extra thumbnail.
 *
 * 3. NOTHING LOADS UNTIL ASKED. Each card is a poster and a button. Seven
 *    YouTube iframes on mount is roughly 3.5 MB of player JavaScript and a set
 *    of cookies for a visitor who never presses play, so the iframe is built on
 *    click — one at a time, because two clips talking over each other is a bug
 *    no amount of styling fixes.
 *
 * The section runs dark because it has to: the block directly above it ends on
 * the #0D1B1E end of a gradient, and a light band here would read as a new page
 * rather than the next paragraph. It also happens to be what video wants —
 * these frames are lit interiors, and they only look lit against something
 * darker than they are.
 */

export default function FilmReel() {
  const t = useTranslations('reel');
  /* Static clip data (id, thumb, aspect, seconds, own) merged with its
     localized title/kind/note from reel.clips.<id>. */
  const clips = REEL.map((c) => ({ ...c, ...t.raw(`clips.${c.id}`) }));
  /* Which clip is playing, by id. One at a time — see note 3. */
  const [playing, setPlaying] = useState(null);
  const [reduced, setReduced] = useState(false);
  /* Ids whose poster has decoded, so a card fades its still in rather than
     flashing from empty to loaded. */
  const [loaded, setLoaded] = useState({});

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () => setReduced(q.matches);
    read();
    q.addEventListener('change', read);
    return () => q.removeEventListener('change', read);
  }, []);

  /* Escape closes the open player. The iframe swallows key events once it has
     focus, so this listens on the document rather than on the card — otherwise
     the shortcut works only until the visitor clicks into the video. */
  useEffect(() => {
    if (!playing) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setPlaying(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [playing]);

  const markLoaded = useCallback((id) => {
    setLoaded((m) => (m[id] ? m : { ...m, [id]: true }));
  }, []);

  /* A poster that is already in cache finishes decoding before React attaches
     onLoad, and that event never fires — the still then sits at opacity 0
     forever. So the ref checks `complete` on mount and marks it directly. This
     is not a hypothetical: the tour's thumbnail hits cache on every reload
     after the first, which is most of them. */
  const posterRef = useCallback(
    (id) => (node) => {
      if (node && node.complete && node.naturalWidth > 0) markLoaded(id);
    },
    [markLoaded]
  );

  /* One card, one clip. Pulled out of the JSX below so the tour and the six
     verticals go through exactly the same path — the only thing that differs
     between them is the ratio, and that comes from the data. */
  const card = (clip) => {
    const live = playing === clip.id;
    /* The tour is the only 16:9 clip and the only one that shows the building,
       so it spans the row. Driven off the ratio rather than an index — add a
       second landscape clip and it behaves correctly. */
    const wide = clip.aspect === '16 / 9';

    return (
      <article
        key={clip.id}
        data-own={clip.own ? 'yes' : 'no'}
        className={`${styles.card} ${wide ? styles.cardWide : ''} ${
          live ? styles.cardLive : ''
        }`}
      >
        <div className={styles.frame} style={{ aspectRatio: clip.aspect }}>
          {live ? (
            <iframe
              className={styles.player}
              src={embedUrl(clip)}
              title={clip.title}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              /* Trims the full page URL out of the request to YouTube; the
                 embed works fine on the origin alone. */
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button
              type="button"
              className={styles.trigger}
              onClick={() => setPlaying(clip.id)}
              aria-label={t('card.ariaPlay', { title: clip.title, time: clock(clip.seconds) })}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- an
                  i.ytimg.com poster. Routing it through next/image would mean
                  adding a remote pattern and paying for an optimiser pass on a
                  file YouTube already serves at the right size. */}
              <img
                ref={posterRef(clip.id)}
                src={thumbUrl(clip)}
                alt=""
                loading="lazy"
                decoding="async"
                onLoad={() => markLoaded(clip.id)}
                className={`${styles.poster} ${loaded[clip.id] ? styles.posterIn : ''}`}
              />
              <span className={styles.scrim} aria-hidden="true" />
              <span className={styles.cue} aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M9 6.5 17.5 12 9 17.5V6.5Z" fill="currentColor" />
                </svg>
              </span>
              {/* The runtime is the caption. It is the one number that says what
                  kind of thing you are about to open — a two-minute walk through
                  a building, or five seconds of a chair. */}
              <span className={styles.clock} aria-hidden="true">
                {clock(clip.seconds)}
              </span>
            </button>
          )}
        </div>

        <div className={styles.meta}>
          <p className={styles.kind}>{clip.kind}</p>
          <h3 className={styles.cardTitle}>{clip.title}</h3>
          <p className={styles.note}>{clip.note}</p>
          {live && (
            <button type="button" className={styles.close} onClick={() => setPlaying(null)}>
              {t('close')}
            </button>
          )}
        </div>
      </article>
    );
  };

  const tour = clips.find((c) => c.aspect === '16 / 9') ?? clips[0];
  const shorts = clips.filter((c) => c !== tour);

  return (
    <section
      className={`${styles.section} ${reduced ? styles.still : ''}`}
      id="reel"
      aria-label={t('ariaLabel')}
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>{t('eyebrow')}</p>
          <h2 className={styles.title}>
            {t('title1')} <em>{t('title2')}</em>
          </h2>
          <p className={styles.lede}>
            {t('ledeStart')}{' '}
            <span className={styles.ledeMark}>{t('ledeMark')}</span>{' '}
            {t('ledeEnd')}
          </p>
        </header>

        <div className={styles.reel}>
          {card(tour)}
          {/* `display: contents` on desktop, so these six are grid items of
              .reel and the whole thing is one grid with no seam. Below 600px it
              becomes a swipe rail, which is the only reason the wrapper exists
              — six stacked 9:16 cards measure 4,700px on a 375px phone. */}
          <div className={styles.tail}>{shorts.map(card)}</div>
        </div>

        <footer className={styles.foot}>
          <a className={styles.channel} href={CHANNEL} target="_blank" rel="noopener noreferrer">
            {t('everything')}
            <span aria-hidden="true">↗</span>
          </a>
          <a
            className={styles.watch}
            href={watchUrl(tour)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('openTour')}
          </a>
        </footer>
      </div>
    </section>
  );
}
