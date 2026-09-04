/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  transpilePackages: ['three'],

  /* Files in public/ are served with max-age=0 by default, so a
     returning visitor re-downloads the whole video. Not marked
     immutable on purpose: replacing craft.mp4 in place should still be
     picked up within the month rather than never. If you swap the clip
     and need it live immediately, change the filename. */
  async headers() {
    return [
      {
        source: '/:file*.mp4',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
