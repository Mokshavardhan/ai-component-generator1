// src/components/ProtectedPage.tsx
'use client';

import { useAppStore } from '@/stores/useAppStore'; 
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const token = useAppStore((state) => state.token); 
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !token) {
      router.replace('/login');
    }
  }, [token, isClient, router]);

  if (!token) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return <>{children}</>;
}