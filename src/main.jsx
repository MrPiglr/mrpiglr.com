
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '@/App';
import '@/index.css';
import { Toaster } from '@/components/ui/toaster';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import { SupabaseProvider } from '@/contexts/SupabaseContext';
import { SiteProvider } from '@/contexts/SiteContext';
import { AppProvider } from '@/contexts/AppContext';
import { MusicProvider } from '@/contexts/MusicContext';
import { BookReaderProvider } from '@/contexts/BookReaderContext';
import { CartProvider } from '@/hooks/useCart';

const SITE_ID = '2db26123-3ca5-4163-b230-48a515f0339c';
const SITE_NAME = 'MrPiglr Personal Site';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

// Optimized Provider Ordering for maximum stability
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <HelmetProvider>
        <BrowserRouter>
          <SiteProvider siteId={SITE_ID} siteName={SITE_NAME}>
            <SupabaseAuthProvider>
              <SupabaseProvider>
                <CartProvider>
                  <AppProvider>
                    <MusicProvider>
                      <BookReaderProvider>
                        <App />
                        <Toaster />
                      </BookReaderProvider>
                    </MusicProvider>
                  </AppProvider>
                </CartProvider>
              </SupabaseProvider>
            </SupabaseAuthProvider>
          </SiteProvider>
        </BrowserRouter>
    </HelmetProvider>
  </>
);
