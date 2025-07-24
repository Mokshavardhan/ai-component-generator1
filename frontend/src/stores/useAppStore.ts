// src/stores/useAppStore.ts
import { create } from 'zustand';
import api from '@/services/api';

interface Session {
  _id: string;
  title: string;
  chatHistory: { role: 'user' | 'assistant'; content: string; timestamp: Date }[];
  latestCode: { jsx: string; css: string };
  updatedAt: string;
}

interface AppState {
  token: string | null;
  sessions: Session[];
  activeSession: Session | null;
  latestCode: { jsx: string; css: string } | null; 
  selectedElementId: string | null;
  setToken: (token: string | null) => void;
  fetchSessions: () => Promise<void>;
  createSession: (title: string) => Promise<void>;
  setActiveSession: (sessionId: string) => void;
  generateCode: (prompt: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  deleteSession: (sessionId: string) => Promise<void>;
  setSelectedElementId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  token: null,
  sessions: [],
  activeSession: null,
  latestCode: null, // 👇 Initialize the property here
  selectedElementId: null,

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token } = response.data;
    get().setToken(access_token);
  },

  setToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('auth_token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('auth_token');
    }
    set({ token });
  },

  fetchSessions: async () => {
    const response = await api.get('/sessions');
    set({ sessions: response.data });
  },
  
  createSession: async (title) => {
    const response = await api.post('/sessions', { title });
    const newSession = response.data;
    set((state) => ({ sessions: [...state.sessions, newSession] }));
    get().setActiveSession(newSession._id);
  },

  setActiveSession: (sessionId) => {
    const session = get().sessions.find(s => s._id === sessionId);
    // 👇 Also set latestCode when the session changes
    set({ 
      activeSession: session || null,
      latestCode: session ? session.latestCode : null 
    });
  },
  
  generateCode: async (prompt) => {
    const activeSessionId = get().activeSession?._id;
    if (!activeSessionId) return;
    
    set(state => ({
        activeSession: state.activeSession ? {
            ...state.activeSession,
            chatHistory: [...state.activeSession.chatHistory, { role: 'user', content: prompt, timestamp: new Date() }]
        } : null
    }));

    const response = await api.post(`/sessions/${activeSessionId}/generate`, { prompt });
    // 👇 Also set latestCode when new code is generated
    set({ 
      activeSession: response.data,
      latestCode: response.data.latestCode 
    });
  },

  deleteSession: async (sessionId) => {
    await api.delete(`/sessions/${sessionId}`);
    set((state) => ({
      sessions: state.sessions.filter((session) => session._id !== sessionId),
    }));
  },

  setSelectedElementId: (id) => set({ selectedElementId: id }),

  logout: () => {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('auth_token');
    set({ token: null, activeSession: null, sessions: [], latestCode: null });
  },
}));

// Initialize token from localStorage on app load
if (typeof window !== 'undefined') {
  const tokenFromStorage = localStorage.getItem('auth_token');
  if (tokenFromStorage) {
    useAppStore.getState().setToken(tokenFromStorage);
  }
}