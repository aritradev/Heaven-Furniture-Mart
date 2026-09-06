'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroScene from '../components/HeroScene';
import BrandAndJourney from '../components/BrandAndJourney';
import ProductCatalog from '../components/ProductCatalog';
import BespokeProcess from '../components/BespokeProcess';
import FilmReel from '../components/FilmReel';
import Testimonials from '../components/Testimonials';
import ShowroomSection from '../components/ShowroomSection';
import Footer from '../components/Footer';
import MobileCTA from '../components/MobileCTA';
import ScrollBottomBlur from '../components/ScrollBottomBlur';

export default function Home() {
  const [activeCatalogFilter, setActiveCatalogFilter] = useState('all');

  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero */}
        <HeroScene />

        {/* 2. About — Brand quote + stats + journey milestones */}
        <BrandAndJourney />

        {/* 3. Shop — Catalog with category filters */}
        <ProductCatalog
          activeFilter={activeCatalogFilter}
          onSelectCategory={(cat) => setActiveCatalogFilter(cat)}
        />

        {/* 4. Bespoke & Process — Differentiator + trust + 4-step process */}
        <BespokeProcess />

        {/* 5. Reel — the process section above ends on a claim about in-house
            craft; this is the footage of it. Opens on #0D1B1E, the colour that
            block's gradient ends on, so the two read as one thought. */}
        <FilmReel />

        {/* 6. Testimonials */}
        <Testimonials />

        {/* 7. Contact — Showroom map + hours + enquiry */}
        <ShowroomSection />
      </main>
      <Footer />
      <MobileCTA />
      <ScrollBottomBlur />
    </>
  );
}
