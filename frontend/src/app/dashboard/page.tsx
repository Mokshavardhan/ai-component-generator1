// src/app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import ProtectedPage from '@/components/ProtectedPage';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { sessions, fetchSessions, createSession, setActiveSession, deleteSession, token, logout } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetchSessions();
    }
  }, [token, fetchSessions]);

  const handleCreateSession = async () => {
    const title = prompt('Enter a title for your new session:', 'New Component');
    if (title) {
      await createSession(title);
      router.push('/');
    }
  };

  // 👇 This function is now implemented
  const handleSessionClick = (sessionId: string) => {
    setActiveSession(sessionId);
    router.push('/');
  };
  
  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation(); 
    if (window.confirm('Are you sure you want to delete this session?')) {
      await deleteSession(sessionId);
    }
  };

  return (
    <ProtectedPage>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>My Sessions</h1>
          <div>
            <button onClick={logout} className="new-session-btn">Logout</button>
            <button onClick={handleCreateSession} className="new-session-btn" style={{marginLeft: '10px'}}>+ New Session</button>
          </div>
        </div>

        <div className="sessions-grid">
          {sessions.map((session) => (
            <div key={session._id} onClick={() => handleSessionClick(session._id)} className="session-card">
               <button onClick={(e) => handleDelete(e, session._id)} className="delete-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
              <h3>{session.title}</h3>
              <p>Last updated: {new Date(session.updatedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
        {sessions.length === 0 && <p>No sessions found. Create one to get started!</p>}
      </div>
    </ProtectedPage>
  );
}