'use client';

import { useState, useEffect } from 'react';
import { scrollToContact } from '@/lib/scroll';
import Link from 'next/link';

const navItems = [
  { label: 'Rotacja', href: '#rotacja' },
  { label: 'Kompetencje', href: '#kompetencje' },
  { label: 'Lejek', href: '#lejek' },
  { label: 'Koszty', href: '#koszty' },
  { label: 'Dowód', href: '#dowod' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Case Study', href: '#case-study' },
];

export default function StickyNavigation() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);

      // Check which section is currently in view
      const sections = navItems.map(item => item.href.slice(1));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.slice(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary-500">
              BezHandlowca.pl
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeSection === item.href.slice(1)
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:text-primary-500 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/client/login"
              className="text-blue-600 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors border border-blue-200 rounded-lg hover:bg-blue-50"
            >
              Panel Klienta
            </Link>
            <Link 
              href="/admin/login"
              className="text-gray-600 hover:text-gray-700 px-3 py-2 text-sm font-medium transition-colors"
            >
              Panel Handlowca
            </Link>
            <button 
              onClick={scrollToContact}
              className="bg-secondary-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-secondary-600 transition-colors"
            >
              Kontakt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 