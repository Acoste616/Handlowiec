'use client';

import { useState, useEffect } from 'react';

export default function CostCalculator() {
  const [salary, setSalary] = useState(8000);
  const [totalCost, setTotalCost] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Calculate total annual cost including all expenses
    const monthlySalary = salary;
    const zusEmployer = monthlySalary * 0.1971; // ZUS employer contribution
    const ppk = monthlySalary * 0.015; // PPK
    const provisions = monthlySalary * 0.5; // Average provisions (50% of salary)
    const equipment = 500; // Monthly equipment/tools cost
    const training = 1000; // Monthly training/development cost
    
    const monthlyTotal = monthlySalary + zusEmployer + ppk + provisions + equipment + training;
    const annualTotal = monthlyTotal * 12;
    
    setTotalCost(Math.round(annualTotal));
  }, [salary]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('kalkulator');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const bezHandlowcaCost = Math.round(totalCost * 0.6); // 40% savings
  const savings = totalCost - bezHandlowcaCost;

  return (
    <section id="kalkulator" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ile kosztuje Cię etatowy handlowiec?
          </h2>
          <p className="text-xl text-gray-600">
            Sprawdź rzeczywiste koszty i porównaj z naszą usługą
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Calculator */}
          <div className={`bg-white p-8 rounded-2xl shadow-large transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Kalkulator kosztów handlowca
            </h3>

            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-700 mb-4">
                Pensja brutto miesięcznie: <span className="text-secondary-500 font-bold">{salary.toLocaleString()} zł</span>
              </label>
              <input
                type="range"
                min="6000"
                max="20000"
                step="500"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #e63946 0%, #e63946 ${((salary - 6000) / (20000 - 6000)) * 100}%, #e5e7eb ${((salary - 6000) / (20000 - 6000)) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>6 000 zł</span>
                <span>20 000 zł</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Pensja brutto</span>
                <span className="font-medium">{salary.toLocaleString()} zł/mies.</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">ZUS pracodawcy (19,71%)</span>
                <span className="font-medium">{Math.round(salary * 0.1971).toLocaleString()} zł/mies.</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">PPK (1,5%)</span>
                <span className="font-medium">{Math.round(salary * 0.015).toLocaleString()} zł/mies.</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Prowizje (średnio 50%)</span>
                <span className="font-medium">{Math.round(salary * 0.5).toLocaleString()} zł/mies.</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Narzędzia/sprzęt</span>
                <span className="font-medium">500 zł/mies.</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Szkolenia</span>
                <span className="font-medium">1 000 zł/mies.</span>
              </div>
            </div>

            <div className="bg-secondary-50 p-6 rounded-lg">
              <div className="text-center">
                <p className="text-lg text-gray-700 mb-2">Całkowity koszt roczny:</p>
                <p className="text-4xl font-bold text-secondary-500">
                  {totalCost.toLocaleString()} zł
                </p>
                <p className="text-sm text-gray-600">+ rekrutacja, wdrożenie, ryzyko rotacji</p>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white p-8 rounded-2xl shadow-large border-2 border-secondary-500">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Z BezHandlowca.pl
                </h3>
                <p className="text-gray-600">Płacisz tylko za efekty</p>
              </div>

              <div className="text-center mb-8">
                <p className="text-lg text-gray-700 mb-2">Orientacyjny koszt:</p>
                <p className="text-4xl font-bold text-primary-500">
                  {bezHandlowcaCost.toLocaleString()} zł
                </p>
                <p className="text-sm text-gray-600">tylko za wygenerowane leady</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <div className="text-center">
                  <p className="text-lg text-green-700 mb-2">Oszczędzasz:</p>
                  <p className="text-3xl font-bold text-green-600">
                    {savings.toLocaleString()} zł
                  </p>
                  <p className="text-sm text-green-600">rocznie</p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-green-600">
                  <span className="w-5 h-5 bg-green-500 rounded-full mr-3 flex items-center justify-center text-white text-xs">✓</span>
                  Brak kosztów stałych
                </div>
                <div className="flex items-center text-green-600">
                  <span className="w-5 h-5 bg-green-500 rounded-full mr-3 flex items-center justify-center text-white text-xs">✓</span>
                  Płatność tylko za wyniki
                </div>
                <div className="flex items-center text-green-600">
                  <span className="w-5 h-5 bg-green-500 rounded-full mr-3 flex items-center justify-center text-white text-xs">✓</span>
                  Brak ryzyka rotacji
                </div>
                <div className="flex items-center text-green-600">
                  <span className="w-5 h-5 bg-green-500 rounded-full mr-3 flex items-center justify-center text-white text-xs">✓</span>
                  Gotowy zespół ekspertów
                </div>
              </div>

              <button className="w-full bg-secondary-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-secondary-600 transition-all duration-200 transform hover:scale-105">
                Sprawdź ofertę
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 