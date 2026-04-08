'use client';

import { useEffect } from 'react';

/**
 * Service Worker Provider
 * Registers and manages the service worker for offline support and caching
 */
export function ServiceWorkerProvider() {
  useEffect(() => {
    // Only register in production and if service worker is supported
    if (
      process.env.NODE_ENV === 'production' &&
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator
    ) {
      registerServiceWorker();
    }
  }, []);

  return null;
}

async function registerServiceWorker() {
  try {
    // Wait for page load to avoid impacting performance
    if (document.readyState === 'loading') {
      window.addEventListener('load', () => register());
    } else {
      register();
    }

    async function register() {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('[SW] Service Worker registered successfully:', registration.scope);

        // Check for updates periodically
        setInterval(
          () => {
            registration.update();
          },
          60 * 60 * 1000
        ); // Check every hour

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New service worker available — skip waiting and auto-reload
                console.log('[SW] New version available. Reloading...');
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              }

              if (newWorker.state === 'activated') {
                window.location.reload();
              }
            });
          }
        });

        // Handle controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('[SW] Controller changed');
        });
      } catch (error) {
        console.error('[SW] Service Worker registration failed:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Service Worker setup failed:', error);
  }
}

// Utility function to clear service worker cache (can be called from console)
if (typeof window !== 'undefined') {
  (window as any).clearSWCache = async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
      console.log('[SW] Cache clear requested');
    }
  };
}
