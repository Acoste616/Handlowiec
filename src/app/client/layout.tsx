'use client';

import { ClientAuthProvider } from '@/hooks/useClientAuth';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthProvider>
      {children}
    </ClientAuthProvider>
  );
} 