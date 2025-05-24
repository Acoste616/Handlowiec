'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClientAuth } from '@/hooks/useClientAuth';
import Link from 'next/link';

export default function ClientLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [enable2FA, setEnable2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const { login, isAuthenticated } = useClientAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/client/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (enable2FA && !twoFACode) {
        setError('Wprowadź kod 2FA');
        setIsLoading(false);
        return;
      }

      // Simulate 2FA verification if enabled
      if (enable2FA && twoFACode !== '123456') {
        setError('Nieprawidłowy kod 2FA. Użyj: 123456');
        setIsLoading(false);
        return;
      }

      const success = await login(email, password, rememberMe);
      
      if (success) {
        router.push('/client/dashboard');
      } else {
        setError('Nieprawidłowy email lub hasło');
      }
    } catch (error) {
      setError('Wystąpił błąd podczas logowania');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    {
      company: 'TechFlow Solutions',
      email: 'techflow@bezhandlowca.pl',
      password: 'client2024',
      description: 'Firma technologiczna - pełen dostęp'
    },
    {
      company: 'ProBiznes Sp. z o.o.',
      email: 'probiznes@bezhandlowca.pl', 
      password: 'client2024',
      description: 'Konsulting biznesowy - pełen dostęp'
    }
  ];

  const fillDemoAccount = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setShowDemoAccounts(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="mx-auto h-16 w-16 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">BH</span>
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Panel Klienta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Zaloguj się do portalu zarządzania sprzedażą
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Demo Accounts */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-blue-400 mr-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-blue-800">Konta demonstracyjne</span>
            </div>
            <button
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showDemoAccounts ? 'Ukryj' : 'Pokaż'}
            </button>
          </div>
          
          {showDemoAccounts && (
            <div className="mt-3 space-y-2">
              {demoAccounts.map((account, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{account.company}</div>
                      <div className="text-xs text-gray-600">{account.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {account.email} / {account.password}
                      </div>
                    </div>
                    <button
                      onClick={() => fillDemoAccount(account.email, account.password)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Użyj
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email firmy
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="twoja-firma@bezhandlowca.pl"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Hasło
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Wprowadź hasło"
              />
            </div>

            {/* 2FA Section */}
            <div className="border-t pt-4">
              <div className="flex items-center">
                <input
                  id="enable2fa"
                  name="enable2fa"
                  type="checkbox"
                  checked={enable2FA}
                  onChange={(e) => setEnable2FA(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="enable2fa" className="ml-2 block text-sm text-gray-700">
                  Uwierzytelnianie dwuskładnikowe (2FA)
                </label>
              </div>

              {enable2FA && (
                <div className="mt-3">
                  <label htmlFor="twofa" className="block text-sm font-medium text-gray-700">
                    Kod 2FA
                  </label>
                  <input
                    id="twofa"
                    name="twofa"
                    type="text"
                    maxLength={6}
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value)}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="123456 (demo)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Demo: użyj kodu <span className="font-mono font-medium">123456</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Zapamiętaj mnie (7 dni)
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Zapomniałeś hasła?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logowanie...
                </div>
              ) : (
                'Zaloguj się'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Nie masz dostępu?{' '}
              <Link href="/kontakt" className="font-medium text-primary-600 hover:text-primary-500">
                Skontaktuj się z nami
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 