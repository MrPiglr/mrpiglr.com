
import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSite } from '@/contexts/SiteContext';
import { Loader2 } from 'lucide-react';
// CartProvider is in main.jsx

import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardGate from '@/components/DashboardGate';
import DebugStateLogger from '@/components/DebugStateLogger';

// Lazy Load Pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const BooksPage = lazy(() => import('@/pages/BooksPage'));
const BookReaderPage = lazy(() => import('@/pages/BookReaderPage'));
const SocialsPage = lazy(() => import('@/pages/SocialsPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const PressKitPage = lazy(() => import('@/pages/PressKitPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignUpPage = lazy(() => import('@/pages/SignUpPage'));
const MemberDashboardPage = lazy(() => import('@/pages/MemberDashboardPage'));
const ComingSoonPage = lazy(() => import('@/pages/ComingSoonPage'));
const MaintenancePage = lazy(() => import('@/pages/MaintenancePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const DiscordVerification = lazy(() => import('@/pages/DiscordVerification'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const SuccessPage = lazy(() => import('@/pages/SuccessPage'));
const MembershipPage = lazy(() => import('@/pages/MembershipPage'));
const DevExchangePage = lazy(() => import('@/pages/DevExchangePage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BlogDetailPage = lazy(() => import('@/pages/BlogPostPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const MembersPage = lazy(() => import('@/pages/MembersPage'));
const PortfolioPage = lazy(() => import('@/pages/PortfolioPage'));
const PortfolioDetailPage = lazy(() => import('@/pages/PortfolioDetailPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const BioPage = lazy(() => import('@/pages/BioPage'));
const BrowseAllPage = lazy(() => import('@/pages/BrowseAllPage'));
const AdminPanelPage = lazy(() => import('@/pages/AdminPanelPage'));
const StorePage = lazy(() => import('@/pages/StorePage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen bg-black">
    <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
  </div>
);

const ScrollWrapper = ({ children }) => (
  <div className="fixed inset-0 w-full h-full overflow-y-auto overflow-x-hidden bg-background overscroll-none scroll-smooth">
    {children}
  </div>
);

function App() {
  const location = useLocation();
  const { loading: appLoading } = useAppContext();
  const { siteStatus, loading: siteLoading } = useSite();
  const { profile, loading: authLoading } = useAuth();
  
  const isLoading = appLoading || authLoading || siteLoading;

  if (isLoading) {
    return <LoadingFallback />;
  }
  
  const isAdmin = profile && ['admin', 'site_owner', 'oversee'].includes(profile.role);
  const isSiteLocked = !isAdmin && (siteStatus === 'coming_soon' || siteStatus === 'maintenance');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isSiteLocked && !isAuthPage) {
    if (siteStatus === 'coming_soon') {
      return (
        <ScrollWrapper>
          <Suspense fallback={<LoadingFallback />}>
            <ComingSoonPage />
          </Suspense>
        </ScrollWrapper>
      );
    }
    if (siteStatus === 'maintenance') {
      return (
        <ScrollWrapper>
          <Suspense fallback={<LoadingFallback />}>
            <MaintenancePage />
          </Suspense>
        </ScrollWrapper>
      );
    }
  }

  return (
    <ScrollWrapper>
      <DebugStateLogger />
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={profile ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="/signup" element={profile ? <Navigate to="/dashboard" replace /> : <SignUpPage />} />
            <Route path="/read-book/:bookId" element={<BookReaderPage />} />
            <Route path="/.well-known/discord" element={<DiscordVerification />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/dev-exchange" element={<DevExchangePage />} />
            
            {/* Dashboard Route with Gate */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                  <DashboardGate>
                    <MemberDashboardPage />
                  </DashboardGate>
              </ProtectedRoute>
            } />
            
            {/* Admin Panel */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanelPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Public Routes Wrapped in Layout */}
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="bio" element={<BioPage />} />
              <Route path="music" element={<MusicPage />} />
              <Route path="books" element={<BooksPage />} />
              
              {/* Portfolio Routes */}
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="portfolio/:slug" element={<PortfolioDetailPage />} />
              
              <Route path="socials" element={<SocialsPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="terms-of-service" element={<TermsPage />} />
              <Route path="privacy-policy" element={<PrivacyPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="press-kit" element={<PressKitPage />} />
              
              {/* Blog Routes */}
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<BlogDetailPage />} />
              
              {/* Community Routes */}
              <Route path="profile/:username" element={<ProfilePage />} />
              <Route path="members" element={<MembersPage />} />
              
              {/* Events Route */}
              <Route path="events" element={<EventsPage />} />
              
              <Route path="browse" element={<BrowseAllPage />} />
              
              {/* Store Routes */}
              <Route path="store" element={<StorePage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="services" element={<PricingPage />} />
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </ScrollWrapper>
  );
}

export default App;
