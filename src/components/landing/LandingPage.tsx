import { HeroSection } from '@/components/home/HeroSection';
import { EcosystemSection } from '@/components/home/EcosystemSection';
import { AstrologySection } from '@/components/home/AstrologySection';
import { AskSection } from '@/components/home/AskSection';
import { SignatureTransition } from '@/components/home/SignatureTransition';
import { VastuPreview } from '@/components/home/VastuPreview';
import { PujaPreview } from '@/components/home/PujaPreview';
import { TrustSection } from '@/components/home/TrustSection';
import { AppExperience } from '@/components/home/AppExperience';
import { KnowledgeSection } from '@/components/home/KnowledgeSection';
import { FinalCta } from '@/components/home/FinalCta';
import { PanchangSection } from './PanchangSection';
import { FAQSection } from './FAQSection';

/**
 * The ecosystem homepage, told as one arc — Life → Space → Journey:
 * Hero → the three paths → Astrology (Kundli) → asking about your chart →
 * today's Panchang → the Cosmos/Space/Ritual transition → Vastu → Puja →
 * why Aroha → the app → the Knowledge Hub → questions → closing CTA.
 * Dark "cosmos" bands and warm "space"/"ritual" bands alternate so each
 * product's light is recognisable before its name is read.
 */
export function LandingPage() {
  return (
    <>
      <HeroSection />
      <EcosystemSection />
      <AstrologySection />
      <AskSection />
      <PanchangSection intro />
      <SignatureTransition />
      <VastuPreview />
      <PujaPreview />
      <TrustSection />
      <AppExperience />
      <KnowledgeSection />
      <FAQSection eyebrow="Questions" title="About Aroha" />
      <FinalCta />
    </>
  );
}
