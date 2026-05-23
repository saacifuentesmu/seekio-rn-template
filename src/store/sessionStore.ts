import {create} from 'zustand';

export interface SessionUser {
  id: string;
  email?: string;
  name?: string;
}

interface SessionState {
  isAuthenticated: boolean;
  user: SessionUser | null;
  setSession: (user: SessionUser) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>(set => ({
  isAuthenticated: false,
  user: null,
  setSession: user => set({isAuthenticated: true, user}),
  clearSession: () => set({isAuthenticated: false, user: null}),
}));
