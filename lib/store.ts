'use client';

import { create } from 'zustand';

/* ═══════════════════════════════════════════════════════════════════════════
   PRELOADER STATE STORE
   ═══════════════════════════════════════════════════════════════════════════ */

interface PreloaderState {
  isLoading: boolean;
  progress: number;
  isComplete: boolean;
  setLoading: (loading: boolean) => void;
  setProgress: (progress: number) => void;
  setComplete: (complete: boolean) => void;
}

export const usePreloaderStore = create<PreloaderState>((set) => ({
  isLoading: true,
  progress: 0,
  isComplete: false,
  setLoading: (isLoading) => set({ isLoading }),
  setProgress: (progress) => set({ progress }),
  setComplete: (isComplete) => set({ isComplete, isLoading: false }),
}));

/* ═══════════════════════════════════════════════════════════════════════════
   NAVIGATION STATE STORE
   ═══════════════════════════════════════════════════════════════════════════ */

interface NavigationState {
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  isMenuOpen: false,
  setMenuOpen: (isMenuOpen) => set({ isMenuOpen }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
}));
