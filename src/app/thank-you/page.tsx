import { Metadata } from 'next';
import ThankYouContent from './ThankYouContent';

export const metadata: Metadata = {
  title: 'Dziękujemy za zgłoszenie | BezHandlowca.pl',
  description: 'Twoje zgłoszenie zostało wysłane pomyślnie. Skontaktujemy się z Tobą najszybciej jak to możliwe.',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return <ThankYouContent />;
} 