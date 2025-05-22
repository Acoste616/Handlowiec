import Image from 'next/image';
import { CONTENT } from '@/constants';

export function SocialProof() {
  const { socialProof } = CONTENT;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-16">
        {socialProof.stats.map((stat, index) => (
          <div key={index} className="text-center">
            <p className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</p>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main testimonial */}
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
          {socialProof.title}
        </h2>
        
        <div className="bg-white p-8 rounded-2xl shadow-soft border border-gray-100 max-w-4xl mx-auto">
          <p className="text-xl text-gray-600 italic mb-6">
            "{socialProof.testimonial}"
          </p>
          <p className="font-semibold text-gray-900">
            - {socialProof.author}
          </p>
        </div>
      </div>

      {/* Trust badges */}
      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500 mb-4">ZAUFALI NAM</p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
          {socialProof.companies.map((company, index) => (
            <div key={index} className="bg-gray-200 px-6 py-3 rounded-lg">
              <span className="text-gray-600 font-medium">{company}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 