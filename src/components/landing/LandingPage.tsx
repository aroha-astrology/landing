'use client';

import { CosmicBackground } from './CosmicBackground';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { PanchangSection } from './PanchangSection';
import { NakshatraSection } from './NakshatraSection';
import { AstrologersSection } from './AstrologersSection';

/**
 * Premium cinematic Vedic astrology landing page. A fixed cosmic backdrop sits
 * behind a fixed nav and four scroll-revealed sections:
 *   Hero → Panchang → Nakshatra tool → Live Astrologers.
 */
export function LandingPage() {
  return (
    <>
      <CosmicBackground />
      <Navbar />
      <main className="relative">
        <HeroSection />
        <PanchangSection />
        <NakshatraSection />
        <AstrologersSection />
      </main>
    </>
  );
}
