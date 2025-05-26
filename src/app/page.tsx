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

      {/* Main content with semantic structure */}
      <main role="main">
        {/* Hero Section - Ból #1: Rotacja */}
        <section aria-labelledby="hero-heading">
          <NewHero />
        </section>

        {/* Pain Sections - Bóle #2-#6 */}
        <section aria-labelledby="pain-points-heading">
          <PainSections />
        </section>

        {/* Social Proof Carousel */}
        <section aria-labelledby="testimonials-heading">
          <SocialProofCarousel />
        </section>

        {/* Interactive Cost Calculator */}
        <section aria-labelledby="calculator-heading">
          <CostCalculator />
        </section>

        {/* FAQ / Obiekcje */}
        <section aria-labelledby="faq-heading">
          <NewFAQ />
        </section>

        {/* Case Study Lead Magnet */}
        <section aria-labelledby="case-study-heading">
          <CaseStudyLeadMagnet />
        </section>

        {/* Final CTA */}
        <section aria-labelledby="cta-heading">
          <FinalCTA />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Debug Info - only in development */}
      {process.env.NODE_ENV === 'development' && <DebugInfo />}
    </>
  );
} 