import { Suspense } from 'react';
import StickyNavigation from '@/components/layout/StickyNavigation';
import NewHero from '@/components/sections/NewHero';
import PainSections from '@/components/sections/PainSections';
import SocialProofCarousel from '@/components/sections/SocialProofCarousel';
import CostCalculator from '@/components/sections/CostCalculator';
import NewFAQ from '@/components/sections/NewFAQ';
import CaseStudyLeadMagnet from '@/components/sections/CaseStudyLeadMagnet';
import FinalCTA from '@/components/sections/FinalCTA';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import DebugInfo from '@/components/debug/DebugInfo';

export default function HomePage() {
  return (
    <>
      {/* Sticky Navigation */}
      <StickyNavigation />

      {/* Hero Section - Ból #1: Rotacja */}
      <NewHero />

      {/* Pain Sections - Bóle #2-#6 */}
      <PainSections />

      {/* Social Proof Carousel */}
      <SocialProofCarousel />

      {/* Interactive Cost Calculator */}
      <CostCalculator />

      {/* FAQ / Obiekcje */}
      <NewFAQ />

      {/* Case Study Lead Magnet */}
      <CaseStudyLeadMagnet />

      {/* Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <Footer />

      {/* Debug Info - only in development */}
      <DebugInfo />
    </>
  );
} 