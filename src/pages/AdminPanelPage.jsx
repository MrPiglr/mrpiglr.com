import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Music, Book, Brush, Palette, MessageSquare, Cog, LogOut, Rss, BarChart2, Briefcase, Calendar, Star, Users, Gamepad, FolderKanban, ShoppingCart, Send } from 'lucide-react';
import MusicManager from '@/components/admin/MusicManager';
import SocialsManager from '@/components/admin/SocialsManager';
import ContentManager from '@/components/admin/ContentManager';
import SiteStatusManager from '@/components/admin/SiteStatusManager';
import BlogManager from '@/components/admin/BlogManager';
import PortfolioManager from '@/components/admin/PortfolioManager';
import EventManager from '@/components/admin/EventManager';
import FanArtManager from '@/components/admin/FanArtManager';
import RoleManager from '@/components/admin/RoleManager';
import BadgeManager from '@/components/admin/BadgeManager';
import InspirationManager from '@/components/admin/InspirationManager';
import ForumManager from '@/components/admin/ForumManager';
import NowPlayingManager from '@/components/admin/NowPlayingManager';
import ServicesManager from '@/components/admin/ServicesManager';
import InquiriesManager from '@/components/admin/InquiriesManager';
import AnimatedPage from '@/components/AnimatedPage';

const AdminPanelPage = () => {
    const { profile, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const adminSections = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: () => <AdminDashboard /> },
        { id: 'site_status', label: 'Site Status', icon: Cog, component: () => <SiteStatusManager /> },
        { id: 'inquiries', label: 'Inquiries', icon: Send, component: () => <InquiriesManager /> },
        { id: 'blog', label: 'Blog', icon: Rss, component: () => <BlogManager /> },
        { id: 'portfolio', label: 'Portfolio', icon: Briefcase, component: () => <PortfolioManager /> },
        { id: 'music', label: 'Music', icon: Music, component: () => <MusicManager /> },
        { id: 'books', label: 'Books', icon: Book, component: () => <ContentManager type="books" title="Book" /> },
        { id: 'creations', label: 'Creations', icon: Brush, component: () => <ContentManager type="creations" title="Creation" /> },
        { id: 'services', label: 'Services', icon: ShoppingCart, component: () => <ServicesManager /> },
        { id: 'events', label: 'Events', icon: Calendar, component: () => <EventManager /> },
        { id: 'socials', label: 'Socials', icon: MessageSquare, component: () => <SocialsManager /> },
        { id: 'inspirations', label: 'Inspirations', icon: Star, component: () => <InspirationManager /> },
        { id: 'fan_art', label: 'Fan Art', icon: Palette, component: () => <FanArtManager /> },
        { id: 'users', label: 'User Roles', icon: Users, component: () => <RoleManager /> },
        { id: 'badges', label: 'Badges', icon: Gamepad, component: () => <BadgeManager /> },
        { id: 'forum', label: 'Forum', icon: FolderKanban, component: () => <ForumManager /> },
        { id: 'now_playing', label: 'Now Playing', icon: BarChart2, component: () => <NowPlayingManager /> }
    ];

    const AdminDashboard = () => (
        <Card>
            <CardHeader>
                <CardTitle>Welcome, {profile.username}!</CardTitle>
                <CardDescription>This is your control center. Manage your site's content and settings from here.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Select a tab from the navigation to get started.</p>
            </CardContent>
        </Card>
    );

    return (
        <AnimatedPage>
            <Helmet>
                <title>Admin Panel - MrPiglr</title>
                <meta name="description" content="Manage your MrPiglr personal website content, users, and settings from the admin panel." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="bg-background min-h-screen">
                <header className="bg-card/30 backdrop-blur-lg sticky top-0 z-40 border-b border-border">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Link to="/" className="text-2xl font-bold text-primary">MrPiglr Admin</Link>
                            <div className="flex items-center gap-4">
                                <span className="hidden sm:inline text-sm text-muted-foreground">Welcome, {profile.username}</span>
                                <Button onClick={handleSignOut} variant="ghost" size="icon">
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                    <Tabs defaultValue="dashboard" className="flex flex-col md:flex-row gap-8" onValueChange={setActiveTab}>
                        <TabsList className="flex md:flex-col items-start h-auto md:w-1/5 bg-transparent p-0 overflow-y-auto">
                            {adminSections.map(section => (
                                <TabsTrigger key={section.id} value={section.id} className="w-full justify-start gap-2 px-4 py-2 text-left hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                    <section.icon className="h-5 w-5" />
                                    <span>{section.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="flex-1">
                            <AnimatePresence mode="wait">
                                {adminSections.map(section =>
                                    activeTab === section.id && (
                                        <TabsContent key={section.id} value={section.id} asChild>
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="w-full"
                                            >
                                                {section.component()}
                                            </motion.div>
                                        </TabsContent>
                                    )
                                )}
                            </AnimatePresence>
                        </div>
                    </Tabs>
                </main>
            </div>
        </AnimatedPage>
    );
};

export default AdminPanelPage;