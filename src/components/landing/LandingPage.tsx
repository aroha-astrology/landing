import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { MoonSignSection } from './MoonSignSection';
import { NavagrahaSection } from './NavagrahaSection';
import { HowItWorksSection } from './HowItWorksSection';
import { FeaturesSection } from './FeaturesSection';
import { PrecisionSection } from './PrecisionSection';
import { PanchangSection } from './PanchangSection';
import { LanguagesSection } from './LanguagesSection';
import { FAQSection } from './FAQSection';
import { Footer } from './Footer';

/**
 * Light editorial landing page with two full-bleed dark "acts"
 * (Navagraha, Precision) breaking up the paper surface. Order:
 * Hero → Moon-sign tool (the free hook) → Navagraha (dark) → How it
 * works → Features → Precision (dark) → Panchang (live data) →
 * Languages → FAQ → Footer.
 */
export function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <MoonSignSection />
        <NavagrahaSection />
        <HowItWorksSection />
        <FeaturesSection />
        <PrecisionSection />
        <PanchangSection />
        <LanguagesSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
