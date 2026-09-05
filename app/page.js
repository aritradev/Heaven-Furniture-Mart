'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroScene from '../components/HeroScene';
import BrandAndJourney from '../components/BrandAndJourney';
import ProductCatalog from '../components/ProductCatalog';
import BespokeProcess from '../components/BespokeProcess';
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
          sectionHeader="Explore Our Collections"
        />

        {/* 4. Bespoke & Process — Differentiator + trust + 4-step process */}
        <BespokeProcess />

        {/* 5. Testimonials */}
        <Testimonials />

        {/* 6. Contact — Showroom map + hours + enquiry */}
        <ShowroomSection />
      </main>
      <Footer />
      <MobileCTA />
      <ScrollBottomBlur />
    </>
  );
}
