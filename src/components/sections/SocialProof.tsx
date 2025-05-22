import Image from 'next/image';

export function SocialProof() {
  const testimonials = [
    {
      content: "Współpraca z Handlowiec.pl to strzał w dziesiątkę. W ciągu 3 miesięcy zamknęliśmy więcej kontraktów niż przez ostatni rok.",
      author: "Jan Kowalski",
      role: "CEO, TechCorp",
      image: "/images/testimonials/1.jpg"
    },
    {
      content: "Profesjonalizm i zaangażowanie na najwyższym poziomie. Zespół zna się na rzeczy i dostarcza realne wyniki.",
      author: "Anna Nowak",
      role: "Dyrektor Sprzedaży, InnoTech",
      image: "/images/testimonials/2.jpg"
    },
    {
      content: "Zero rotacji, pełny lejek i przewidywalne wyniki. Wreszcie mogę skupić się na rozwoju firmy.",
      author: "Piotr Wiśniewski",
      role: "Właściciel, SmartSolutions",
      image: "/images/testimonials/3.jpg"
    }
  ];

  const stats = [
    { label: "Klientów", value: "50+" },
    { label: "Zamkniętych kontraktów", value: "200+" },
    { label: "Średni ROI", value: "1:5" },
    { label: "Lat doświadczenia", value: "5+" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-16">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <p className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</p>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Co mówią nasi klienci?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Zobacz, jak outsourcing sprzedaży B2B pomógł innym firmom osiągnąć sukces
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-2xl shadow-soft border border-gray-100"
          >
            <div className="flex items-center mb-6">
              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.author}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-600 italic">"{testimonial.content}"</p>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500 mb-4">ZAUFALI NAM</p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
          <Image src="/images/logos/logo1.svg" alt="Partner 1" width={120} height={40} />
          <Image src="/images/logos/logo2.svg" alt="Partner 2" width={120} height={40} />
          <Image src="/images/logos/logo3.svg" alt="Partner 3" width={120} height={40} />
          <Image src="/images/logos/logo4.svg" alt="Partner 4" width={120} height={40} />
        </div>
      </div>
    </div>
  );
} 