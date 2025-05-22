'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, TrendingUp, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CONTENT } from '@/constants';

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProcess = () => {
    const processSection = document.getElementById('process');
    processSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-secondary-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          {/* Main Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                <span className="block">{CONTENT.hero.headline}</span>
                <span className="block text-secondary-400 mt-2">
                  {CONTENT.hero.subheadline}
                </span>
              </h1>

              {/* Subheadline with ROI */}
              <div className="mb-8">
                <p className="text-xl lg:text-2xl text-primary-100 mb-4">
                  {CONTENT.hero.description}
                </p>
                <div className="flex items-center space-x-4 text-secondary-300 font-semibold">
                  <TrendingUp className="h-5 w-5" />
                  <span>-20% rotacji = +3× niższy koszt akwizycji klienta</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  size="lg"
                  onClick={scrollToContact}
                  className="bg-secondary-500 hover:bg-secondary-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {CONTENT.hero.cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={scrollToProcess}
                  className="border-2 border-primary-200 text-primary-100 hover:bg-primary-200 hover:text-primary-900 px-8 py-4 text-lg font-semibold"
                >
                  <Play className="mr-2 h-5 w-5" />
                  {CONTENT.hero.ctaSecondary}
                </Button>
              </div>

              {/* Social Proof Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="grid grid-cols-3 gap-6 text-center"
              >
                <div className="text-primary-100">
                  <div className="text-3xl font-bold text-secondary-400">50+</div>
                  <div className="text-sm">Zadowolonych firm</div>
                </div>
                <div className="text-primary-100">
                  <div className="text-3xl font-bold text-secondary-400">7x</div>
                  <div className="text-sm">Więcej leadów</div>
                </div>
                <div className="text-primary-100">
                  <div className="text-3xl font-bold text-secondary-400">90%</div>
                  <div className="text-sm">Retencja klientów</div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <div className="lg:col-span-5 mt-12 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative"
            >
              {/* Main Visual Container */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-primary-300/20">
                {/* Dashboard Mockup */}
                <div className="bg-white rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pipeline Dashboard
                    </h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Metrics Cards */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="flex items-center">
                        <Target className="h-8 w-8 text-green-600 mr-3" />
                        <div>
                          <div className="text-2xl font-bold text-green-600">123</div>
                          <div className="text-sm text-green-700">Nowe leady</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="flex items-center">
                        <Users className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                          <div className="text-2xl font-bold text-blue-600">7</div>
                          <div className="text-sm text-blue-700">Nowe kontrakty</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Konwersja leadów</span>
                        <span>85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-green-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={isVisible ? { width: "85%" } : {}}
                          transition={{ duration: 1.5, delay: 1 }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Realizacja planu</span>
                        <span>92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={isVisible ? { width: "92%" } : {}}
                          transition={{ duration: 1.5, delay: 1.2 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-secondary-500 text-white p-3 rounded-xl shadow-lg"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <TrendingUp className="h-6 w-6" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 bg-green-500 text-white p-3 rounded-xl shadow-lg"
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Target className="h-6 w-6" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-6 h-10 border-2 border-primary-200 rounded-full flex justify-center"
          >
            <motion.div
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1 h-3 bg-primary-200 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 