'use client';

import { useState } from 'react';
import { CONTENT } from '@/constants';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { faq } = CONTENT;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Często zadawane pytania
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Odpowiedzi na najczęstsze pytania o przejęcie procesu sprzedaży
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {faq.map((faqItem, index) => (
          <div
            key={index}
            className="border-b border-gray-200 last:border-0"
          >
            <button
              className="w-full py-6 text-left focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {faqItem.question}
                </h3>
                <span className="ml-6 flex-shrink-0">
                  <svg
                    className={`w-6 h-6 transform ${
                      openIndex === index ? 'rotate-180' : ''
                    } transition-transform duration-200`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>
            </button>
            {openIndex === index && (
              <div className="pb-6">
                <p className="text-gray-600">{faqItem.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-600 mb-8">
          Nie znalazłeś odpowiedzi na swoje pytanie?
        </p>
        <a
          href="#contact"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Skontaktuj się z nami
        </a>
      </div>
    </div>
  );
} 