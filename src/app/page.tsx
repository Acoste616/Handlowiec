import { Suspense } from 'react';import { Hero } from '@/components/sections/Hero';import { Benefits } from '@/components/sections/Benefits';import { SocialProof } from '@/components/sections/SocialProof';import { Process } from '@/components/sections/Process';import { PainPoints } from '@/components/sections/PainPoints';import { FAQ } from '@/components/sections/FAQ';import { ContactForm } from '@/components/sections/ContactForm';import { CallToAction } from '@/components/sections/CallToAction';import { Footer } from '@/components/layout/Footer';import { StickyButton } from '@/components/layout/StickyButton';import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="relative">
        <Hero />
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 lg:py-24 bg-gray-50">
        <Benefits />
      </section>

      {/* Social Proof Section */}
      <section id="social-proof" className="py-16 lg:py-24 bg-white">
        <SocialProof />
      </section>

      {/* Process Section */}
      <section id="process" className="py-16 lg:py-24 bg-primary-900 text-white">
        <Process />
      </section>

                  {/* Pain Points Section */}      <section id="pain-points" className="py-16 lg:py-24 bg-gray-50">        <PainPoints />      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 lg:py-24 bg-white">
        <FAQ />
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-16 lg:py-24 bg-primary-50">
        <Suspense fallback={<LoadingSpinner />}>
          <ContactForm />
        </Suspense>
      </section>

      {/* Final CTA Section */}
      <section id="final-cta" className="py-16 lg:py-24 bg-gradient-to-r from-primary-900 to-primary-700 text-white">
        <CallToAction />
      </section>

      {/* Footer */}
      <Footer />

      {/* Sticky CTA Button */}
      <StickyButton />
    </>
  );
} 