
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const SiteContext = createContext(undefined);

export const useSite = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};

export const SiteProvider = ({ children, siteId: siteIdProp, siteName }) => {
  const [siteId, setSiteId] = useState(siteIdProp);
  const [personalSiteConfig, setPersonalSiteConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeSite = useCallback(async (currentAuthUser) => {
    // If we already have the config and siteId hasn't changed, don't re-fetch
    if (isInitialized && siteId === siteIdProp) {
        setLoading(false);
        return;
    }

    if (!siteIdProp) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      // Optimistic check: if we are just hydrating and have data, skip strict re-fetch if possible
      // But for correctness, we fetch.
      
      const { error: siteCreationError } = await supabase.rpc('get_or_create_site_by_uuid', {
        p_site_uuid: siteIdProp,
        p_site_name: siteName,
        p_owner_id: currentAuthUser?.id || null,
      });

      if (siteCreationError) {
        console.error('Error creating or getting site in aethex_sites:', siteCreationError);
        // Don't throw, just try to proceed or fallback
      }
      
      setSiteId(siteIdProp);

      const { data, error } = await supabase.rpc('get_or_create_personal_site_config', {
        p_site_uuid: siteIdProp
      });

      if (error) {
        console.error('Error fetching personal site config:', error);
        setPersonalSiteConfig(prev => prev || { site_status: 'live' });
      } else {
        setPersonalSiteConfig(data);
      }
      
      setIsInitialized(true);
    } catch (error) {
        console.error("A critical error occurred during site initialization:", error);
        setPersonalSiteConfig(prev => prev || { site_status: 'live' });
    } finally {
        setLoading(false);
    }
  }, [siteIdProp, siteName, isInitialized, siteId]);

  useEffect(() => {
    let mounted = true;
    const bootstrapSite = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        await initializeSite(session?.user ?? null);
      }
    };
    
    bootstrapSite();
    
    return () => {
        mounted = false;
    };
  }, [initializeSite]);

  const updatePersonalSiteStatus = useCallback(async (newStatus) => {
    if (!siteId) return;

    setPersonalSiteConfig(prev => ({ ...prev, site_status: newStatus }));

    const { error } = await supabase
      .from('personal_site_config')
      .update({ site_status: newStatus })
      .eq('site_id', siteId);

    if (error) {
      console.error('Error updating personal site status:', error);
      // Revert on error could be added here if needed
    }
  }, [siteId]);

  const value = useMemo(() => ({
    siteId,
    siteName,
    siteStatus: personalSiteConfig?.site_status || 'live',
    loading: loading,
    updatePersonalSiteStatus,
    logoUrl: personalSiteConfig?.logo_url || '/favicon.svg' 
  }), [siteId, siteName, personalSiteConfig, loading, updatePersonalSiteStatus]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};
