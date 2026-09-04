'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './LoopingVideo.module.css';

/**
 * A silent video that autoplays on loop and fills its container.
 *
 * The video is the whole content of the frame — there is no still image
 * behind it. The frame therefore carries a dark tone of its own, so the
 * moment before the first decoded frame reads as a deliberate card
 * rather than a hole in the layout, and the video fades in over it.
 *
 * Two things stay deliberate. `src` is attached when the frame nears the
 * viewport rather than at page load, so the clip never competes with the
 * hero for bandwidth. And playback follows visibility, because decoding
 * a loop nobody can see is pure battery cost.
 *
 * Someone who has asked for reduced motion gets the video held on its
 * first frame instead: the picture, without the movement.
 */
export default function LoopingVideo({ src, className = '' }) {
  const videoRef = useRef(null);
  const frameRef = useRef(null);

  // Withhold src entirely until the frame is close — see note above.
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);

  /* null until measured on the client, so the server render and the
     first paint agree and there is no hydration mismatch. */
  const [motionOk, setMotionOk] = useState(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () => setMotionOk(!query.matches);
    read();
    // Re-read on change: the preference can be toggled mid-session.
    query.addEventListener('change', read);
    return () => query.removeEventListener('change', read);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        /* Read the LAST record, not the first. A fast scroll — or any
           programmatic jump — queues several records in one callback,
           and entries[0] is then the stale one. Destructuring the first
           entry makes a flick-scroll back into view read as "left the
           viewport" and pause instead of resume. */
        const entry = entries[entries.length - 1];

        if (entry.isIntersecting) {
          setArmed(true);
          // Rejects harmlessly while still unarmed; autoPlay covers first start.
          if (motionOk !== false) videoRef.current?.play?.().catch(() => {});
        } else {
          videoRef.current?.pause?.();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, [motionOk]);

  /* loadeddata, not canplay: it is the earliest point at which a frame
     is guaranteed to exist, so the fade can never expose an undecoded
     one — and it is the event the held-frame path depends on too. */
  const reveal = useCallback(() => {
    setReady(true);
    if (motionOk !== false) videoRef.current?.play?.().catch(() => {});
  }, [motionOk]);

  /* If the file fails after revealing, fall back to the frame's own tone
     rather than leaving a broken-media glyph in the composition. */
  const hide = useCallback(() => setReady(false), []);

  return (
    <div className={styles.frame} ref={frameRef}>
      <div className={`${styles.veil} ${ready ? styles.veilReady : ''}`}>
        <video
          ref={videoRef}
          src={armed ? src : undefined}
          className={className}
          onLoadedData={reveal}
          onError={hide}
          preload={armed ? 'auto' : 'none'}
          autoPlay={motionOk !== false}
          muted
          loop
          playsInline
          disablePictureInPicture
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
