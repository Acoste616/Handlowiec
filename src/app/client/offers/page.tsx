'use client';

import { useState, useEffect } from 'react';
import { useClientAuth } from '@/hooks/useClientAuth';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface Offer {
  id: string;
  title: string;
  description: string;
  leadName: string;
  leadCompany: string;
  agentName: string;
  totalValue: number;
  validUntil: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  terms: string;
  notes?: string;
}

export default function ClientOffersPage() {
  const { user } = useClientAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setError(null);
      
      // Symulacja danych - w produkcji to byłyby prawdziwe API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockOffers: Offer[] = [
        {
          id: '1',
          title: 'Pakiet Premium - System CRM',
          description: 'Kompletne rozwiązanie CRM z integracjami',
          leadName: 'Jan Kowalski',
          leadCompany: 'TechCorp Sp. z o.o.',
          agentName: 'Bartek Nowak',
          totalValue: 85000,
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          items: [
            { name: 'Licencja CRM (12 miesięcy)', quantity: 1, unitPrice: 60000, total: 60000 },
            { name: 'Wdrożenie i konfiguracja', quantity: 1, unitPrice: 15000, total: 15000 },
            { name: 'Szkolenie zespołu', quantity: 1, unitPrice: 10000, total: 10000 },
          ],
          terms: 'Płatność w 30 dni od akceptacji. Gwarancja 12 miesięcy.',
          notes: 'Oferta zawiera rabat 15% dla nowych klientów.'
        },
        {
          id: '2',
          title: 'Rozszerzenie funkcjonalności',
          description: 'Dodatkowe moduły i integracje',
          leadName: 'Anna Nowak',
          leadCompany: 'ProSoft Solutions',
          agentName: 'Marta Kowalska',
          totalValue: 45000,
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          items: [
            { name: 'Moduł raportowania', quantity: 1, unitPrice: 25000, total: 25000 },
            { name: 'Integracja z systemami zewnętrznymi', quantity: 1, unitPrice: 20000, total: 20000 },
          ],
          terms: 'Płatność w 30 dni. Wdrożenie w ciągu 6 tygodni.',
        },
        {
          id: '3',
          title: 'Konsultacje strategiczne',
          description: 'Pakiet konsultacji biznesowych',
          leadName: 'Piotr Wiśniewski',
          leadCompany: 'DataFlow Ltd.',
          agentName: 'Tomasz Wiśniewski',
          totalValue: 25000,
          validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          items: [
            { name: 'Analiza procesów biznesowych', quantity: 1, unitPrice: 15000, total: 15000 },
            { name: 'Rekomendacje optymalizacji', quantity: 1, unitPrice: 10000, total: 10000 },
          ],
          terms: 'Płatność po zakończeniu każdego etapu.',
          notes: 'Pilna oferta - wymagana szybka decyzja.'
        }
      ];

      setOffers(mockOffers);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setError('Błąd podczas ładowania ofert');
    } finally {
      setIsLoading(false);
    }
  };

  const acceptOffer = async (offerId: string) => {
    try {
      // Symulacja API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOffers(prev => prev.map(offer => 
        offer.id === offerId 
          ? { ...offer, status: 'accepted' as const }
          : offer
      ));
      
      setShowAcceptModal(false);
      setSelectedOffer(null);
    } catch (error) {
      console.error('Error accepting offer:', error);
      setError('Błąd podczas akceptacji oferty');
    }
  };

  const rejectOffer = async (offerId: string) => {
    try {
      // Symulacja API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOffers(prev => prev.map(offer => 
        offer.id === offerId 
          ? { ...offer, status: 'rejected' as const }
          : offer
      ));
    } catch (error) {
      console.error('Error rejecting offer:', error);
      setError('Błąd podczas odrzucania oferty');
    }
  };

  const getStatusColor = (status: Offer['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Offer['status']) => {
    switch (status) {
      case 'pending': return 'Oczekuje';
      case 'accepted': return 'Zaakceptowana';
      case 'rejected': return 'Odrzucona';
      default: return status;
    }
  };

  const pendingOffers = offers.filter(offer => offer.status === 'pending');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie ofert...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Oferty do Akceptacji</h1>
              <p className="text-sm text-gray-500">
                {pendingOffers.length} ofert oczekuje na Twoją decyzję
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Offers List */}
        <div className="space-y-6">
          {offers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Brak ofert</h3>
              <p className="text-gray-500">Obecnie nie masz żadnych ofert do przejrzenia.</p>
            </div>
          ) : (
            offers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{offer.title}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(offer.status)}`}>
                          {getStatusText(offer.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{offer.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>👤 {offer.leadName} - {offer.leadCompany}</span>
                        <span>🤝 Agent: {offer.agentName}</span>
                        <span>📅 Ważna do: {format(new Date(offer.validUntil), 'd MMM yyyy', { locale: pl })}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">{offer.totalValue.toLocaleString()} zł</p>
                      <p className="text-sm text-gray-500">Wartość całkowita</p>
                    </div>
                  </div>

                  {/* Offer Items */}
                  <div className="border-t pt-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">Pozycje oferty:</h4>
                    <div className="space-y-2">
                      {offer.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex-1">
                            <span className="text-gray-900">{item.name}</span>
                            <span className="text-gray-500 ml-2">x{item.quantity}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{item.total.toLocaleString()} zł</span>
                            <div className="text-sm text-gray-500">{item.unitPrice.toLocaleString()} zł/szt</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terms and Notes */}
                  <div className="border-t pt-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Warunki:</h4>
                    <p className="text-gray-600 text-sm">{offer.terms}</p>
                    {offer.notes && (
                      <>
                        <h4 className="font-medium text-gray-900 mb-2 mt-3">Uwagi:</h4>
                        <p className="text-gray-600 text-sm bg-yellow-50 p-3 rounded">{offer.notes}</p>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  {offer.status === 'pending' && (
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                      <button
                        onClick={() => rejectOffer(offer.id)}
                        className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                      >
                        Odrzuć
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOffer(offer);
                          setShowAcceptModal(true);
                        }}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Akceptuję ofertę
                      </button>
                    </div>
                  )}

                  {offer.status === 'accepted' && (
                    <div className="flex items-center justify-end pt-4 border-t">
                      <span className="text-green-600 font-medium">✅ Oferta zaakceptowana</span>
                    </div>
                  )}

                  {offer.status === 'rejected' && (
                    <div className="flex items-center justify-end pt-4 border-t">
                      <span className="text-red-600 font-medium">❌ Oferta odrzucona</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Accept Confirmation Modal */}
        {showAcceptModal && selectedOffer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Potwierdź akceptację</h3>
              <p className="text-gray-600 mb-4">
                Czy na pewno chcesz zaakceptować ofertę "{selectedOffer.title}" 
                o wartości {selectedOffer.totalValue.toLocaleString()} zł?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Po akceptacji oferta zostanie przekazana do realizacji.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAcceptModal(false);
                    setSelectedOffer(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Anuluj
                </button>
                <button
                  onClick={() => acceptOffer(selectedOffer.id)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Tak, akceptuję
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 