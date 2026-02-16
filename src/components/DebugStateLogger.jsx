
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSite } from '@/contexts/SiteContext';
import { useAppContext } from '@/contexts/AppContext';
import { useCart } from '@/hooks/useCart';

const DebugStateLogger = () => {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { siteStatus, loading: siteLoading } = useSite();
  const { loading: appLoading } = useAppContext();
  const { cartItems } = useCart();

  useEffect(() => {
    console.group('Navigate: ', location.pathname);
    console.log('Timestamp:', new Date().toISOString());
    console.log('Current Route:', location.pathname);
    console.groupEnd();
  }, [location.pathname]);

  useEffect(() => {
    if (!authLoading) {
      console.log('[Auth State] Updated:', { user: user ? user.email : 'Guest', loading: authLoading });
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!siteLoading) {
      console.log('[Site State] Updated:', { status: siteStatus, loading: siteLoading });
    }
  }, [siteStatus, siteLoading]);

  useEffect(() => {
    if (!appLoading) {
      console.log('[App Content] Updated:', { loading: appLoading });
    }
  }, [appLoading]);

  useEffect(() => {
    console.log('[Cart] Updated:', { itemCount: cartItems.length });
  }, [cartItems]);

  return null; // This component renders nothing
};

export default DebugStateLogger;
