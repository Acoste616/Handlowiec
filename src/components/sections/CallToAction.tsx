import Link from 'next/link';

export function CallToAction() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Gotowy na zmianę?
        </h2>
        <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
          Umów bezpłatną konsultację i dowiedz się, jak możemy pomóc Twojej firmie osiągnąć lepsze wyniki sprzedażowe.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-900 bg-white hover:bg-primary-50"
          >
            Umów konsultację
          </Link>
          <Link
            href="tel:+48123456789"
            className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10"
          >
            Zadzwoń teraz
          </Link>
        </div>
        <p className="mt-8 text-sm text-primary-100">
          Konsultacja jest bezpłatna i niezobowiązująca. Nie ma ukrytych kosztów.
        </p>
      </div>
    </div>
  );
} 