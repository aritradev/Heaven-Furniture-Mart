import './globals.css';

export const metadata = {
  title: 'Heaven Furniture Mart — Bespoke Luxury Furniture, Chattogram',
  description:
    'Premium handcrafted furniture & interior styling from Chattogram. Custom sofas, beds, dining sets & office chairs built around your space. Free design consultation. Visit our Agrabad showroom or WhatsApp us.',
  keywords: [
    'luxury furniture Chattogram',
    'bespoke furniture Bangladesh',
    'custom sofa Chattogram',
    'custom bed Chattogram',
    'interior styling Chattogram',
    'Heaven Furniture Mart',
    'Agrabad furniture showroom',
    'handcrafted furniture BD',
  ],
  authors: [{ name: 'Heaven Furniture Mart' }],
  creator: 'Heaven Furniture Mart',
  metadataBase: new URL('https://heavenfurnituremart.com'),
  openGraph: {
    title: 'Heaven Furniture Mart — Furniture, Crafted Around You',
    description:
      'Premium bespoke furniture & interior styling from Chattogram. Every piece built around your space, your style, your life. WhatsApp us or visit our Agrabad showroom.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Heaven Furniture Mart',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Heaven Furniture Mart — Bespoke Luxury Furniture, Chattogram',
    description: 'Handcrafted luxury furniture & interior styling. Free design consultation. Agrabad, Chattogram.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1A2B2F" />
      </head>
      <body>{children}</body>
    </html>
  );
}
