import { HeroSection } from './HeroSection';
import { MoonSignsOverviewSection } from './MoonSignsOverviewSection';
import { NavagrahaSection } from './NavagrahaSection';
import { HowItWorksSection } from './HowItWorksSection';
import { FeaturesSection } from './FeaturesSection';
import { ReportsSection } from './ReportsSection';
import { VideoSection } from './VideoSection';
import { PrecisionSection } from './PrecisionSection';
import { PanchangSection } from './PanchangSection';
import { LanguagesSection } from './LanguagesSection';
import { FAQSection } from './FAQSection';

/**
 * Light editorial landing page with two full-bleed dark "acts"
 * (Navagraha, Precision) breaking up the paper surface. Order:
 * Hero → Moon-sign overview (no form — the real calculator lives at
 * /moon-sign) → Navagraha (dark) → How it works → Features → Videos (dark) → Reports →
 * Precision (dark) → Panchang (live data) → Languages → FAQ → Footer.
 */
export function LandingPage() {
  return (
    <main>
      <HeroSection />
      <MoonSignsOverviewSection />
      <NavagrahaSection />
      <HowItWorksSection />
      <FeaturesSection />
      <VideoSection />
      <ReportsSection />
      <PrecisionSection />
      <PanchangSection />
      <LanguagesSection />
      <FAQSection />
    </main>
  );
}
