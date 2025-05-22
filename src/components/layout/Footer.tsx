import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const navigation = {
    main: [
      { name: 'O nas', href: '#about' },
      { name: 'Usługi', href: '#services' },
      { name: 'Proces', href: '#process' },
      { name: 'FAQ', href: '#faq' },
      { name: 'Kontakt', href: '#contact' },
    ],
    social: [
      {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/company/handlowiec-pl',
        icon: (props: any) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.svg"
                alt="Handlowiec.pl"
                width={180}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-4 text-gray-400 max-w-md">
              Profesjonalny outsourcing sprzedaży B2B dla polskich MŚP. 
              Wypełniamy lejek jakościowymi leadami i dbamy o relacje z klientami.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Nawigacja
            </h3>
            <ul className="mt-4 space-y-4">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-base text-gray-300 hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Kontakt
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="tel:+48123456789"
                  className="text-base text-gray-300 hover:text-white"
                >
                  +48 123 456 789
                </a>
              </li>
              <li>
                <a
                  href="mailto:kontakt@handlowiec.pl"
                  className="text-base text-gray-300 hover:text-white"
                >
                  kontakt@handlowiec.pl
                </a>
              </li>
              <li className="text-base text-gray-300">
                ul. Przykładowa 123<br />
                00-001 Warszawa
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Handlowiec.pl. Wszelkie prawa zastrzeżone.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 