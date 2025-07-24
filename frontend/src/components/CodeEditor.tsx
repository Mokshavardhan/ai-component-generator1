// src/components/CodeEditor.tsx
'use client';

import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import JSZip from 'jszip';

export default function CodeEditor() {
  const [activeTab, setActiveTab] = useState<'jsx' | 'css'>('jsx');
  const latestCode = useAppStore((state) => state.activeSession?.latestCode);

  const handleCopy = () => {
    if (!latestCode) return;
    const codeToCopy = activeTab === 'jsx' ? latestCode.jsx : latestCode.css;
    navigator.clipboard.writeText(codeToCopy);
    alert('Code copied to clipboard!');
  };

  const handleDownload = () => {
    if (!latestCode) return;
    const zip = new JSZip();
    zip.file('Component.tsx', latestCode.jsx);
    zip.file('styles.css', latestCode.css);
    zip.generateAsync({ type: 'blob' }).then((content) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'component.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="code-editor">
      <div className="panel-header">
        <div className="code-tabs">
          <button onClick={() => setActiveTab('jsx')} className={activeTab === 'jsx' ? 'active' : ''}>Component.tsx</button>
          <button onClick={() => setActiveTab('css')} className={activeTab === 'css' ? 'active' : ''}>styles.css</button>
        </div>
        {/* 👇 Add buttons here */}
        <div className="code-actions">
          <button onClick={handleCopy} className="action-btn">Copy</button>
          <button onClick={handleDownload} className="action-btn">Download .zip</button>
        </div>
      </div>
      <div className="code-content">
        {!latestCode ? (
          <p style={{ padding: '20px', color: 'var(--text-secondary)' }}>Generate a component to see the code here.</p>
        ) : activeTab === 'jsx' ? (
          <SyntaxHighlighter language="tsx" style={oneDark} showLineNumbers>
            {latestCode.jsx || ''}
          </SyntaxHighlighter>
        ) : (
          <SyntaxHighlighter language="css" style={oneDark} showLineNumbers>
            {latestCode.css || ''}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
}