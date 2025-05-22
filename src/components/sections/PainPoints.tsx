import { CONTENT } from '@/constants';

export function PainPoints() {
  const { painPoints } = CONTENT;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Problemy z własnymi handlowcami?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Znamy te frustracje. Oto jak je rozwiązujemy:
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:gap-12">
        {painPoints.map((painPoint, index) => (
          <div
            key={index}
            className={`flex flex-col lg:flex-row items-center gap-8 ${
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Content */}
            <div className="flex-1">
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg 
                      className="h-5 w-5 text-red-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      Problem:
                    </h3>
                    <p className="text-red-700 font-medium">
                      {painPoint.title}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg 
                      className="h-5 w-5 text-green-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Nasze rozwiązanie:
                    </h3>
                    <p className="text-green-700">
                      {painPoint.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-600 mb-8">
          Poznaj wszystkie korzyści naszego rozwiązania
        </p>
        <a
          href="#contact"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Oddaj nam swoją sprzedaż
        </a>
      </div>
    </div>
  );
} 