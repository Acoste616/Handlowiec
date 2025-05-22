'use client';

import { useEffect, useState } from 'react';

export default function DebugInfo() {
  const [sections, setSections] = useState<string[]>([]);

  useEffect(() => {
    const checkSections = () => {
      const sectionIds = ['rotacja', 'kompetencje', 'lejek', 'koszty', 'kontrola', 'skalowanie', 'dowod', 'kalkulator', 'faq', 'case-study', 'final-cta'];
      const foundSections = sectionIds.filter(id => document.getElementById(id));
      setSections(foundSections);
    };

    checkSections();
    
    // Check again after a delay to account for dynamic rendering
    setTimeout(checkSections, 2000);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <h4 className="font-bold mb-2">Debug: Sekcje na stronie</h4>
      <div className="space-y-1">
        {['rotacja', 'kompetencje', 'lejek', 'koszty', 'kontrola', 'skalowanie', 'dowod', 'kalkulator', 'faq', 'case-study', 'final-cta'].map(id => (
          <div key={id} className={`flex justify-between ${sections.includes(id) ? 'text-green-400' : 'text-red-400'}`}>
            <span>#{id}</span>
            <span>{sections.includes(id) ? '✅' : '❌'}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-gray-600">
        <div>Znaleziono: {sections.length}/11</div>
      </div>
    </div>
  );
} 