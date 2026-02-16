import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Award, Settings, LogOut, Check, Save, Github, Twitter, Linkedin, Loader2, Edit2, KeyRound, Lock, LayoutDashboard } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

const calculateLevel = (xp) => {
  return Math.floor(0.1 * Math.sqrt(xp));
};
const xpForNextLevel = (level) => {
  return Math.pow((level + 1) / 0.1, 2);
};

const UserProfile = () => {
  const { profile, updateProfile, setProfile, user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    github_url: '',
    twitter_url: '',
    linkedin_url: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        github_url: profile.social_links?.github || '',
        twitter_url: profile.social_links?.twitter || '',
        linkedin_url: profile.social_links?.linkedin || ''
      });
    }
  }, [profile]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const social_links = {
        github: formData.github_url,
        twitter: formData.twitter_url,
        linkedin: formData.linkedin_url,
      };

      const updatedProfileData = {
        username: formData.username,
        full_name: formData.full_name,
        bio: formData.bio,
        social_links: social_links,
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updatedProfileData)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setProfile(data);
      updateProfile(data); // update context
      toast({ title: 'Success', description: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  if (!profile) return <div className="flex justify-center items-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  const currentLevel = calculateLevel(profile.total_xp || 0);
  const nextLevelXp = xpForNextLevel(currentLevel);
  const currentLevelXp = xpForNextLevel(currentLevel - 1 > 0 ? currentLevel - 1 : 0);
  const xpProgress = ((profile.total_xp || 0) - currentLevelXp) / (nextLevelXp - currentLevelXp) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle>Profile Overview</CardTitle>
          <CardDescription>Your personal information and site statistics.</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={() => setIsEditing(!isEditing)}>
          <Edit2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div><Label htmlFor="username">Username</Label><Input id="username" name="username" value={formData.username} onChange={handleInputChange} /></div>
            <div><Label htmlFor="full_name">Full Name</Label><Input id="full_name" name="full_name" value={formData.full_name} onChange={handleInputChange} /></div>
            <div><Label htmlFor="bio">Bio</Label><Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} /></div>
            <div><Label htmlFor="github_url">GitHub URL</Label><Input id="github_url" name="github_url" value={formData.github_url} onChange={handleInputChange} /></div>
            <div><Label htmlFor="twitter_url">Twitter URL</Label><Input id="twitter_url" name="twitter_url" value={formData.twitter_url} onChange={handleInputChange} /></div>
            <div><Label htmlFor="linkedin_url">LinkedIn URL</Label><Input id="linkedin_url" name="linkedin_url" value={formData.linkedin_url} onChange={handleInputChange} /></div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><h3 className="font-semibold">Username</h3><p className="text-muted-foreground">{profile.username}</p></div>
              <div><h3 className="font-semibold">Full Name</h3><p className="text-muted-foreground">{profile.full_name || 'Not set'}</p></div>
              <div><h3 className="font-semibold">Email</h3><p className="text-muted-foreground">{user?.email}</p></div>
              <div><h3 className="font-semibold">Bio</h3><p className="text-muted-foreground">{profile.bio}</p></div>
            </div>
            <div className="flex gap-4">
              {profile.social_links?.github && <a href={profile.social_links.github} target="_blank" rel="noreferrer noopener"><Button variant="outline" size="icon"><Github/></Button></a>}
              {profile.social_links?.twitter && <a href={profile.social_links.twitter} target="_blank" rel="noreferrer noopener"><Button variant="outline" size="icon"><Twitter/></Button></a>}
              {profile.social_links?.linkedin && <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer noopener"><Button variant="outline" size="icon"><Linkedin/></Button></a>}
            </div>
            <div className="space-y-4 pt-4">
              <CardTitle>Stats & Progress</CardTitle>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <Card><CardContent className="p-4"><p className="text-2xl font-bold">{profile.loyalty_points || 0}</p><p className="text-sm text-muted-foreground">Loyalty Points</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-2xl font-bold">{profile.total_xp || 0}</p><p className="text-sm text-muted-foreground">Total XP</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-2xl font-bold">{currentLevel}</p><p className="text-sm text-muted-foreground">Level</p></CardContent></Card>
              </div>
              <div>
                <Label>Level Progress</Label>
                <Progress value={xpProgress} className="w-full" />
                <p className="text-sm text-muted-foreground text-right">{(profile.total_xp || 0)} / {Math.round(nextLevelXp)} XP</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const UserBadges = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [badges, setBadges] = useState([]);
  
    const fetchBadges = useCallback(async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [siteUserBadges, aethexUserBadges] = await Promise.all([
          supabase.from('user_mrpiglr_site_badges').select('badge_id').eq('user_id', user.id),
          supabase.from('user_aethex_badges').select('badge_id').eq('user_id', user.id)
        ]);

        if (siteUserBadges.error) throw siteUserBadges.error;
        if (aethexUserBadges.error) throw aethexUserBadges.error;

        const siteBadgeIds = siteUserBadges.data.map(b => b.badge_id);
        const aethexBadgeIds = aethexUserBadges.data.map(b => b.badge_id);

        const [siteBadges, aethexBadges] = await Promise.all([
          supabase.from('mrpiglr_site_badges').select('*').in('id', siteBadgeIds).then(res => res.data.map(b => ({...b, type: 'MrPiglr Site'}))),
          supabase.from('aethex_badges').select('*').in('id', aethexBadgeIds).then(res => res.data.map(b => ({...b, type: 'AeThex Network'})))
        ]);
        
        setBadges([...(siteBadges || []), ...(aethexBadges || [])]);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: `Failed to fetch badges: ${error.message}` });
      } finally {
        setLoading(false);
      }
    }, [user, toast]);
  
    useEffect(() => {
      fetchBadges();
    }, [fetchBadges]);
  
    if (loading) return <div className="flex justify-center items-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Badges</CardTitle>
          <CardDescription>A collection of all your earned achievements.</CardDescription>
        </CardHeader>
        <CardContent>
          {badges.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">You haven't earned any badges yet. Keep exploring!</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {badges.map(badge => (
                <Card key={badge.id} className="text-center p-4 aspect-square flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                  <Award className="w-10 h-10" style={{ color: badge.color }} />
                  <p className="font-semibold text-sm">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.type}</p>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
};

const AccountSettings = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast({ variant: 'destructive', title: 'Error', description: 'Passwords do not match.' });
            return;
        }
        if (password.length < 6) {
            toast({ variant: 'destructive', title: 'Error', description: 'Password must be at least 6 characters long.' });
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            toast({ title: 'Success', description: 'Password updated successfully.' });
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your account password here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                        <div>
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <KeyRound className="w-4 h-4 mr-2" />}
                            Update Password
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Control how your information is displayed to others.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="profile-visibility" className="flex-grow">Public Profile</Label>
                            <Switch id="profile-visibility" defaultChecked onCheckedChange={() => toast({ description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}/>
                        </div>
                        <p className="text-sm text-muted-foreground">Allow anyone to view your profile, badges, and stats.</p>
                     </div>
                </CardContent>
            </Card>
        </div>
    );
};

const MemberDashboardPage = () => {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile />;
      case 'badges':
        return <UserBadges />;
      case 'settings':
        return <AccountSettings />;
      default:
        return <UserProfile />;
    }
  };

  const getUsername = () => {
    if (profile?.username) return profile.username;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const isAdmin = profile && ['admin', 'site_owner', 'oversee'].includes(profile.role);
  
  const baseUrl = "https://www.mrpiglr.com";
  const pageUrl = `${baseUrl}/dashboard`;
  const pageDescription = "Manage your MrPiglr profile, view your achievements and stats, and configure your account settings.";


  return (
    <AnimatedPage>
      <Helmet>
        <title>Dashboard - MrPiglr</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url} alt={getUsername()} />
              <AvatarFallback>{getUsername().charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-grow text-center sm:text-left">
              <h1 className="text-2xl font-bold">{getUsername()}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {isAdmin && (
                <Button variant="outline" onClick={() => navigate('/admin')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Admin Panel
                </Button>
              )}
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>

          <main>
            <div className="flex items-center border border-border rounded-lg p-1 mb-6 bg-muted/50 overflow-x-auto custom-scrollbar">
              <div className="flex flex-nowrap min-w-full">
                <Button
                  variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                  className={`flex-1 gap-2 ${activeTab === 'profile' ? '' : 'text-muted-foreground'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant={activeTab === 'badges' ? 'secondary' : 'ghost'}
                  className={`flex-1 gap-2 ${activeTab === 'badges' ? '' : 'text-muted-foreground'}`}
                  onClick={() => setActiveTab('badges')}
                >
                  <Award className="h-4 w-4" />
                  Badges
                </Button>
                <Button
                  variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                  className={`flex-1 gap-2 ${activeTab === 'settings' ? '' : 'text-muted-foreground'}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>

            <div>{renderContent()}</div>
          </main>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default MemberDashboardPage;