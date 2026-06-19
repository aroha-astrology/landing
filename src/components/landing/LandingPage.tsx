'use client';

import { Scene3D } from '@/components/three/Scene3D';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { PanchangSection } from './PanchangSection';
import { NavagrahaSection } from './NavagrahaSection';
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
      <Scene3D />
      <Navbar />
      <main className="relative">
        <HeroSection />
        <PanchangSection />
        <NavagrahaSection />
        <NakshatraSection />
        <AstrologersSection />
      </main>
    </>
  );
}
