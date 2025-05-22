import { CONTENT } from '@/constants';

export function Benefits() {
  const { benefits } = CONTENT;

  // Icon mapping for the new benefit icons
  const iconMap: Record<string, string> = {
    target: '🎯',
    award: '🏆', 
    star: '⭐',
    chart: '📊',
    'trending-up': '📈',
    money: '💰',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Dlaczego warto oddać nam swoją sprzedaż?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Przejmujemy kompletny proces sprzedaży, abyś mógł skupić się na tym, co robisz najlepiej
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="relative bg-white p-8 rounded-2xl shadow-soft border border-gray-100 hover:shadow-medium transition-shadow duration-300"
          >
            <div className="text-4xl mb-4">{iconMap[benefit.icon] || '🎯'}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {benefit.title}
            </h3>
            <p className="text-gray-600">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 