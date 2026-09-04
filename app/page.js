'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import BrandAndJourney from '../components/BrandAndJourney';
import ProductCatalog from '../components/ProductCatalog';
import BespokeProcess from '../components/BespokeProcess';
import Testimonials from '../components/Testimonials';
import ShowroomSection from '../components/ShowroomSection';
import Footer from '../components/Footer';
import MobileCTA from '../components/MobileCTA';

import Logo from '../components/Logo';

const HeroScene = dynamic(() => import('../components/HeroScene'), {
  ssr: false,
  loading: () => (
    <section
      style={{
        height: '100vh',
        background: 'linear-gradient(135deg, #0D1B1E 0%, #1A2B2F 40%, #1E2D31 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Logo height={48} textColor="#FFFFFF" subtextColor="#C9A96E" accentColor="#EAA023" />
    </section>
  ),
});

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
    </>
  );
}
