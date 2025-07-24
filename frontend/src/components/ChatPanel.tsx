// src/components/ChatPanel.tsx
'use client';
import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { useRouter } from 'next/navigation';

export default function ChatPanel() {
  const [prompt, setPrompt] = useState('');
  const { activeSession, generateCode, logout } = useAppStore();
const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    generateCode(prompt);
    setPrompt('');
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
         <button onClick={() => router.push('/dashboard')} className="logout-button">
          Dashboard
        </button>
        <h2>{activeSession?.title || 'Chat'}</h2>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>
      <div className="chat-history">
        {activeSession?.chatHistory.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your component..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}