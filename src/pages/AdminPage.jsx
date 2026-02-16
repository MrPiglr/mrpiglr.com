import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge, Book, Bot, Brush, Gamepad, LayoutDashboard, Library, Music, Shield, ShoppingBag, Users, Globe, Menu, X } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import ContentManager from '@/components/admin/ContentManager';
import MusicManager from '@/components/admin/MusicManager';
import SocialsManager from '@/components/admin/SocialsManager';
import RoleManager from '@/components/admin/RoleManager';
import BadgeManager from '@/components/admin/BadgeManager';
import SiteStatusManager from '@/components/admin/SiteStatusManager';
import BlogManager from '@/components/admin/BlogManager';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSite } from '@/contexts/SiteContext';
import { Loader2 } from 'lucide-react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const adminTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: AdminDashboard },
  { id: 'site-status', label: 'Site Status', icon: Shield, component: SiteStatusManager },
  { id: 'blog', label: 'Blog', icon: Bot, component: BlogManager },
  { id: 'music', label: 'Music', icon: Music, component: MusicManager },
  { id: 'creations', label: 'Creations', icon: Brush, component: () => <ContentManager type="creations" title="Creations" /> },
  { id: 'books', label: 'Books', icon: Book, component: () => <ContentManager type="books" title="Books" /> },
  { id: 'products', label: 'Products', icon: ShoppingBag, component: () => <ContentManager type="products" title="Products" /> },
  { id: 'socials', label: 'Socials', icon: Globe, component: SocialsManager },
  { id: 'roles', label: 'Roles', icon: Users, component: RoleManager },
  { id: 'badges', label: 'Badges', icon: Badge, component: BadgeManager },
];

const AdminSidebarNav = ({ activeTab, setActiveTab, onLinkClick }) => (
    <nav className="flex flex-col gap-2 flex-grow">
      {adminTabs.map(tab => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? 'secondary' : 'ghost'}
          className="justify-start gap-3 px-4"
          onClick={() => {
            setActiveTab(tab.id);
            if(onLinkClick) onLinkClick();
          }}
        >
          <tab.icon className="h-5 w-5" />
          {tab.label}
        </Button>
      ))}
    </nav>
);

const AdminPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const { loading: authLoading } = useAuth();
  const { loading: siteLoading } = useSite();

  const setActiveTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };
  
  const ActiveComponent = adminTabs.find(tab => tab.id === activeTab)?.component || AdminDashboard;

  if (authLoading || siteLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AnimatedPage>
      <Helmet>
        <title>Admin Panel - MrPiglr</title>
        <meta name="description" content="Manage your MrPiglr personal website content, users, and settings from the admin panel." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex min-h-screen bg-background">
        <aside className="w-64 bg-card p-4 flex-col border-r border-border hidden lg:flex">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-glow">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">MrPiglr Site</p>
          </div>
          <AdminSidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-40">
             <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-4 flex flex-col">
                <SheetHeader className="mb-8">
                  <SheetTitle className="text-2xl font-bold text-glow text-left">Admin Panel</SheetTitle>
                  <p className="text-sm text-muted-foreground text-left">MrPiglr Site</p>
                </SheetHeader>
                <AdminSidebarNav activeTab={activeTab} setActiveTab={setActiveTab} onLinkClick={() => setIsSheetOpen(false)} />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold text-glow">
              {adminTabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <div className="w-8"></div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default AdminPage;