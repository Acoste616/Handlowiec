import { CONTENT } from '@/constants';

export function Process() {
  const { process } = CONTENT;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          {process.title}
        </h2>
        <p className="text-xl text-primary-100 max-w-3xl mx-auto">
          {process.description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
        {process.steps.map((step, index) => (
          <div
            key={index}
            className="relative bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 text-white text-xl font-bold">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-primary-100">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-primary-100 mb-8">
          Pierwsze rezultaty już po 14 dniach
        </p>
        <a
          href="#contact"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-900 bg-white hover:bg-primary-50"
        >
          Sprawdź czy kwalifikujesz się do programu
        </a>
      </div>
    </div>
  );
} 