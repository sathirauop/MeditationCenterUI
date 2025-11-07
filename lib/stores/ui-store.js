import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Global UI State Store
 * Manages client-side UI state like modals, sidebars, menus, etc.
 */
export const useUIStore = create(
  devtools(
    (set) => ({
      // Mobile menu state
      isMobileMenuOpen: false,
      openMobileMenu: () => set({ isMobileMenuOpen: true }),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

      // Language preference
      language: 'en', // 'en' or 'si'
      setLanguage: (lang) => set({ language: lang }),

      // Modal state
      activeModal: null, // 'booking', 'contact', 'donation', etc.
      openModal: (modalName) => set({ activeModal: modalName }),
      closeModal: () => set({ activeModal: null }),

      // Loading states
      isGlobalLoading: false,
      setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),

      // Toast/notification state
      toast: null,
      showToast: (message, type = 'info') => set({ toast: { message, type } }),
      hideToast: () => set({ toast: null }),
    }),
    { name: 'UI Store' }
  )
);
