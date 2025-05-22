import { Suspense } from 'react';
import { Hero } from '@/components/sections/Hero';
import { Benefits } from '@/components/sections/Benefits';
import { SocialProof } from '@/components/sections/SocialProof';
import { Process } from '@/components/sections/Process';
import { FAQ } from '@/components/sections/FAQ';
import { ContactForm } from '@/components/sections/ContactForm';
import { CallToAction } from '@/components/sections/CallToAction';
import { Footer } from '@/components/layout/Footer';
import { StickyButton } from '@/components/layout/StickyButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

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

      {/* Pain Points Section */}
      <section id="pain-points" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Czy to brzmi znajomo?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Najczęstsze problemy polskich MŚP w sprzedaży B2B
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pain Point 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-gray-100">
              <div className="text-4xl mb-4">😩</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                20-30% rotacji = utrata nawet 6 msc. przychodu z jednego etatu
              </h3>
              <p className="text-gray-600">
                Każda wymiana handlowca kosztuje Cię miesiące budowania relacji od nowa. 
                Tracisz momentum i klientów odchodzą do konkurencji.
              </p>
            </div>

            {/* Pain Point 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-gray-100">
              <div className="text-4xl mb-4">😰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Pusty lejek = stres właściciela
              </h3>
              <p className="text-gray-600">
                Nie wiesz skąd przyjdą kolejni klienci. Żyjesz w niepewności, 
                planowanie to koszmar, a sen ucieka gdy pipeline świeci pustkami.
              </p>
            </div>

            {/* Pain Point 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-gray-100">
              <div className="text-4xl mb-4">💸</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Koszt etatu vs wyniki
              </h3>
              <p className="text-gray-600">
                Płacisz pensję + ZUS + PPK + koszty rekrutacji, a kontrakt podpisuje 
                co trzeci miesiąc. ROI? Wolisz nie liczyć.
              </p>
            </div>
          </div>
        </div>
      </section>

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