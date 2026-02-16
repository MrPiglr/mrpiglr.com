import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Globe, Github, Twitter, Linkedin } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BadgeDisplay from '@/components/BadgeDisplay';
import { Badge } from '@/components/ui/badge';
import NotFoundPage from './NotFoundPage';
import { generateProfileSchema, generateBreadcrumbSchema } from '@/lib/jsonLdSchemas';

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError || !profileData) {
        throw new Error(profileError?.message || 'Profile not found');
      }
      setProfile(profileData);

      // Fetch badges
      const [siteBadgesRes, aethexBadgesRes] = await Promise.all([
        supabase
          .from('user_mrpiglr_site_badges')
          .select('mrpiglr_site_badges!inner(*)')
          .eq('user_id', profileData.id),
        supabase
          .from('user_aethex_badges')
          .select('aethex_badges!inner(*)')
          .eq('user_id', profileData.id),
      ]);

      if (siteBadgesRes.error) throw siteBadgesRes.error;
      if (aethexBadgesRes.error) throw aethexBadgesRes.error;

      const combinedBadges = [
        ...siteBadgesRes.data.map(b => ({ ...b.mrpiglr_site_badges, source: 'MrPiglr' })),
        ...aethexBadgesRes.data.map(b => ({ ...b.aethex_badges, source: 'AeThex' })),
      ].filter(b => b && b.id);

      setBadges(combinedBadges);

    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-65px)]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <NotFoundPage />;
  }

  const featuredBadges = badges.slice(0, 5); // Placeholder logic
  const otherBadges = badges.slice(5);
  const baseUrl = "https://www.mrpiglr.com";

  return (
    <AnimatedPage>
      <Helmet>
        <title>{`${profile.username}'s Profile - MrPiglr`}</title>
        <meta name="description" content={`View the profile and achievements of ${profile.username}.`} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={`${profile.username} - MrPiglr`} />
        <meta property="og:description" content={profile.bio || `Check out ${profile.username}'s profile`} />
        {profile.avatar_url && <meta property="og:image" content={profile.avatar_url} />}
        
        <script type="application/ld+json">
          {JSON.stringify(generateProfileSchema(profile, baseUrl))}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema([
            { label: "Home", url: "/" },
            { label: "Members", url: "/members" },
            { label: profile.username, url: `/profile/${profile.username}` }
          ], baseUrl))}
        </script>
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <div className="relative">
          <div className="h-32 sm:h-48 bg-card rounded-t-lg overflow-hidden">
            <img 
              className="w-full h-full object-cover"
              alt={`${profile.username}'s banner`}
             src={profile.banner_url || "https://images.unsplash.com/photo-1468874555285-a4bf099c2d9f"} />
          </div>
          <div className="absolute top-16 sm:top-24 left-1/2 -translate-x-1/2">
            <Avatar className="w-32 h-32 sm:w-48 sm:h-48 border-4 border-background shadow-lg">
              <AvatarImage src={profile.avatar_url} alt={profile.username} />
              <AvatarFallback>{profile.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <Card className="mt-20 sm:mt-28 pt-16 sm:pt-24 text-center">
          <CardContent>
            <h1 className="text-3xl sm:text-4xl font-bold text-glow">{profile.username}</h1>
            {profile.full_name && <p className="text-lg sm:text-xl text-muted-foreground">{profile.full_name}</p>}
            <div className="flex justify-center gap-4 my-4">
              {profile.website_url && <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Globe /></a>}
              {profile.github_url && <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Github /></a>}
              {profile.twitter_url && <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Twitter /></a>}
              {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Linkedin /></a>}
            </div>
            <p className="max-w-2xl mx-auto text-foreground/80">{profile.bio || 'No bio provided.'}</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Badge Collection</CardTitle>
            </CardHeader>
            <CardContent>
              {badges.length > 0 ? (
                <>
                  {featuredBadges.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4 text-primary">Featured Badges</h3>
                      <div className="flex flex-wrap gap-6 justify-center">
                        {featuredBadges.map(badge => <BadgeDisplay key={`${badge.source}-${badge.id}`} badge={badge} size="lg" />)}
                      </div>
                    </div>
                  )}
                  {otherBadges.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-primary">All Badges</h3>
                      <div className="flex flex-wrap gap-4 justify-center">
                        {otherBadges.map(badge => <BadgeDisplay key={`${badge.source}-${badge.id}`} badge={badge} size="md" />)}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground text-center py-8">This user hasn't earned any badges yet.</p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardHeader><CardTitle>Stats</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between"><span>Loyalty Points:</span> <span className="font-bold text-primary">{profile.loyalty_points}</span></div>
                <div className="flex justify-between"><span>Level:</span> <span className="font-bold text-primary">{profile.level || 1}</span></div>
                <div className="flex justify-between"><span>Role:</span> <Badge variant="secondary">{profile.role}</Badge></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>)
                ) : (
                  <p className="text-muted-foreground text-sm">No skills listed.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ProfilePage;