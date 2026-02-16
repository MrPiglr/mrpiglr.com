
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useSite } from '@/contexts/SiteContext';

const AuthContext = createContext(undefined);

export const SupabaseAuthProvider = ({ children }) => {
  const { toast } = useToast();
  const { siteId } = useSite();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use a ref to track if we've already done the initial fetch to avoid double-loading
  const initialFetchDone = React.useRef(false);

  const fetchUserProfileAndRole = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      setRole(null);
      return;
    }

    try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setProfile(null);
        } else {
          setProfile(profileData);
        }

        if (siteId) {
          const { data: siteContextData, error: siteContextError } = await supabase
            .from('site_context')
            .select('role')
            .eq('user_id', userId)
            .eq('site_id', siteId)
            .maybeSingle();

          if (siteContextError) {
            console.error('Error fetching site context role:', siteContextError);
            setRole(null);
          } else if (siteContextData) {
            setRole(siteContextData.role);
          } else {
            setRole(profileData?.role || null);
          }
        } else {
           setRole(profileData?.role || null);
        }
    } catch (e) {
        console.error("Exception in fetchUserProfileAndRole:", e);
    }
  }, [siteId]);

  const handleAuthChange = useCallback(async (event, currentSession) => {
    // console.log("Auth Change Event:", event);
    
    if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setProfile(null);
        setRole(null);
        setLoading(false);
        return;
    }

    const currentUser = currentSession?.user ?? null;
    
    // If session hasn't effectively changed, don't trigger full reload logic unless it's initial
    if (event !== 'INITIAL_STATE' && currentUser?.id === user?.id && session?.access_token === currentSession?.access_token) {
        return; 
    }

    setSession(currentSession);
    setUser(currentUser);
    
    if (currentUser) {
        // Only set loading true if we are actually fetching something new
        if (!profile || profile.id !== currentUser.id) {
             // Only block UI if critical
        }
        await fetchUserProfileAndRole(currentUser.id);
    } else {
        setProfile(null);
        setRole(null);
    }
    
    setLoading(false);
  }, [fetchUserProfileAndRole, user?.id, session?.access_token, profile]);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          if (mounted) {
             await handleAuthChange('INITIAL_STATE', initialSession);
          }
      } catch (e) {
          console.error("Auth bootstrap error:", e);
          if (mounted) setLoading(false);
      }
    };

    if (!initialFetchDone.current) {
        bootstrap();
        initialFetchDone.current = true;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (mounted) {
            handleAuthChange(event, session);
        }
    });

    return () => {
        mounted = false;
        subscription.unsubscribe();
    };
  }, [handleAuthChange]);

  const signUpWithEmail = useCallback(async (email, password, options = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
    } else {
      toast({
        title: "Sign up Successful",
        description: "Please check your email to verify your account.",
      });
    }

    return { data, error };
  }, [toast]);

  const signInWithEmail = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "Invalid login credentials",
      });
    } else {
        toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
        });
    }
    
    return { data, error };
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message || "Something went wrong",
      });
    } else {
        toast({
            title: "Signed out",
            description: "See you next time!",
        });
    }

    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    profile,
    role,
    session,
    loading,
    signUp: signUpWithEmail,
    signUpWithEmail,
    signIn: signInWithEmail,
    signInWithEmail,
    signOut,
  }), [user, profile, role, session, loading, signUpWithEmail, signInWithEmail, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};
