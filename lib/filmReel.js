/**
 * The reel.
 *
 * Seven clips off Heaven's own YouTube channel. They are not seven of a kind,
 * and two facts about them drive everything the component does:
 *
 *   shape       one is 16:9 landscape, six are vertical phone video — and in
 *               three different vertical source sizes (1080×1920, 720×1280,
 *               576×1024). Any grid of equal 16:9 boxes letterboxes six of
 *               seven, which is where the grey bars in a naive gallery come
 *               from.
 *   provenance  four were shot in the Agrabad showroom and workshop. Three
 *               were not: `_ffwjuuuv2g` still carries the original's Amazon
 *               affiliate links in its description, `ybx69tQ2uDY` credits
 *               @Heider, and `F6dePgWHwq8` is a lived-in high-rise apartment
 *               — baby chair and exercise bike in frame — with a hashtag-only
 *               title and no location. All three are 576×1024, the size a
 *               re-upload lands at; nothing filmed on the showroom floor is.
 *
 * Provenance is the load-bearing one. This page's argument is that Heaven
 * builds furniture in-house and it says so three sections above. These seven
 * sit in a single grid, so the labelling has to happen on the card: `own:
 * false` sets a plainer chip and a note that says where the clip came from.
 * That is the disclosure — not a wall, not a footnote.
 *
 * Durations are read from YouTube, not estimated, and they are the caption on
 * every card. A 125-second walk through a building and a 5-second mood loop are
 * different offers, and the runtime is the only thing that says which is which
 * before you press play.
 *
 * Nothing is embedded until someone asks for it. Each card is a poster image
 * and a button; the iframe is created on click. Seven YouTube embeds on mount
 * would cost roughly 3.5 MB of player JS and set cookies for a visitor who
 * never pressed play.
 */

/* `thumb` names the endpoint, `aspect` the box it renders in — and for one clip
   those two disagree on purpose.

   `maxresdefault`/`hq720` are always 16:9. `oardefault`/`oar2` ("original
   aspect ratio") give the true frame, but they are not present on every video,
   so each clip names the endpoint it actually has. Verified per-id by decoding
   the JPEG SOF headers.

   `F6dePgWHwq8` has no OAR variant at all. Its 16:9 thumbnail is the vertical
   frame pillarboxed between two blurred copies of itself, and the arithmetic
   works out: the real strip is 720 × (576/1024) = 405px wide, and rendering
   that 1280×720 file into a 9:16 box under `object-fit: cover` crops to the
   central 405px exactly. Same frame, no bars, at 405×720 of effective
   resolution — more than the 300×533 it displays at. */
export const REEL = [
  {
    id: 'qEwoJWbXSTs',
    thumb: 'maxresdefault',
    aspect: '16 / 9',
    title: 'Walk the showroom',
    note: 'Agrabad Access Road, opposite RAK Ceramics — the full floor, room by room.',
    seconds: 125,
    kind: 'Showroom',
    own: true,
  },
  {
    id: 'lxhZF9s7fhY',
    thumb: 'oardefault',
    aspect: '9 / 16',
    title: 'Setting brass pins by hand',
    note: 'One row of decorative pins on a sofa frame, placed one at a time.',
    seconds: 17,
    kind: 'Workshop',
    own: true,
  },
  {
    id: 'h-Idu5_85WA',
    thumb: 'oardefault',
    aspect: '9 / 16',
    title: 'Navy and gold bedroom set',
    note: 'Velvet headboard, mirrored wardrobe — on the showroom floor.',
    seconds: 48,
    kind: 'Showroom',
    own: true,
  },
  {
    id: '95QrFvVcLXI',
    thumb: 'oardefault',
    aspect: '9 / 16',
    title: 'Victorian coffee table, gilded',
    /* The frame is the showroom floor, not a doorstep — two customers sat
       either side of the finished table. An earlier draft of this line said
       "photographed the day it left", which the picture plainly contradicts. */
    note: 'Carved and gold-leafed to order, on the floor with the men who ordered it.',
    seconds: 22,
    kind: 'Made to order',
    own: true,
  },
  /* The three reposts. Kept because they are genuinely useful — this is the
     look customers arrive asking for — and each one says so on its own card. */
  {
    id: 'F6dePgWHwq8',
    thumb: 'maxresdefault',
    aspect: '9 / 16',
    title: 'Apartment with a brass chandelier',
    note: 'Saved to the channel for the lighting and the built-in shelving. Someone else’s flat.',
    seconds: 40,
    kind: 'Saved reference',
    own: false,
  },
  {
    id: '_ffwjuuuv2g',
    thumb: 'oar2',
    aspect: '9 / 16',
    title: 'Cream chairs, black-framed mirror',
    note: 'A reference clip, not our work — the pairing is what we kept it for.',
    seconds: 5,
    kind: 'Saved reference',
    own: false,
  },
  {
    id: 'ybx69tQ2uDY',
    thumb: 'oar2',
    aspect: '9 / 16',
    title: 'Fitted pantry shelving',
    note: 'Reposted from @Heider. The joinery is the part worth borrowing.',
    seconds: 13,
    kind: 'Saved reference',
    own: false,
  },
];

export const CHANNEL = 'https://youtube.com/@HeavenFurnitureMart';

/** `2:05` for the tour, `0:17` for a short. Padded, so the digits align. */
export function clock(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export const thumbUrl = (clip) => `https://i.ytimg.com/vi/${clip.id}/${clip.thumb}.jpg`;

/* `youtube-nocookie.com` sets no tracking cookie until playback, and the
   params trim the player down to something that suits a furniture page:
   no related-video wall at the end, no channel branding, captions off. */
export const embedUrl = (clip) =>
  `https://www.youtube-nocookie.com/embed/${clip.id}` +
  '?autoplay=1&rel=0&modestbranding=1&playsinline=1&color=white';

export const watchUrl = (clip) => `https://www.youtube.com/watch?v=${clip.id}`;
