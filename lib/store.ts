'use client';

import { create } from 'zustand';

/* ═══════════════════════════════════════════════════════════════════════════
   CURSOR STATE STORE
   ═══════════════════════════════════════════════════════════════════════════ */

export type CursorVariant =
  | 'default'
  | 'hover'
  | 'text'
  | 'hidden'
  | 'drag'
  | 'view'
  | 'link'
  | 'arrow-left'
  | 'arrow-right';

interface CursorState {
  variant: CursorVariant;
  text: string;
  isVisible: boolean;
  setVariant: (variant: CursorVariant) => void;
  setText: (text: string) => void;
  setVisible: (visible: boolean) => void;
  reset: () => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  variant: 'default',
  text: '',
  isVisible: true,
  setVariant: (variant) => set({ variant }),
  setText: (text) => set({ text }),
  setVisible: (visible) => set({ isVisible: visible }),
  reset: () => set({ variant: 'default', text: '', isVisible: true }),
}));

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
  isHeaderVisible: boolean;
  isHeaderSolid: boolean;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
  setHeaderVisible: (visible: boolean) => void;
  setHeaderSolid: (solid: boolean) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  isMenuOpen: false,
  isHeaderVisible: true,
  isHeaderSolid: false,
  setMenuOpen: (isMenuOpen) => set({ isMenuOpen }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setHeaderVisible: (isHeaderVisible) => set({ isHeaderVisible }),
  setHeaderSolid: (isHeaderSolid) => set({ isHeaderSolid }),
}));
