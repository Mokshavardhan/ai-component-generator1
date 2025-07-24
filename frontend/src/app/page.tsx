// src/app/page.tsx
'use client'; // This page now needs to be a client component
import ChatPanel from '@/components/ChatPanel';
import CodeEditor from '@/components/CodeEditor';
import PreviewWindow from '@/components/PreviewWindow';
import ProtectedPage from '@/components/ProtectedPage';
import { useAppStore } from '@/stores/useAppStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const activeSession = useAppStore((state) => state.activeSession);
  const router = useRouter();
  const selectedElementId = useAppStore((state) => state.selectedElementId);
  
  useEffect(() => {
    console.log("Selected element ID:", selectedElementId);
  }, [selectedElementId]);
  // If there's no active session, redirect to dashboard to select or create one
  useEffect(() => {
    if (!activeSession) {
      router.replace('/dashboard');
    }
  }, [activeSession, router]);

  if (!activeSession) {
    return <ProtectedPage><div>Loading session...</div></ProtectedPage>;
  }

  return (
    <ProtectedPage>
      <main className="main-layout">
        <ChatPanel />
        <PreviewWindow />
        <CodeEditor />
      </main>
    </ProtectedPage>
  );
}